/**
 * Una stanza di gioco: sala d'attesa, partita, bot, timer (Architettura §3.2, §6, §7.4).
 *
 * - Il motore è l'unica fonte di verità: la stanza gli passa le azioni e invia a ciascuno
 *   solo la sua vista filtrata (vista TV o vista del giocatore) e gli eventi che lo riguardano.
 * - Non sa nulla della rete: chi la usa riceve una notifica a ogni cambiamento e chiede la
 *   vista per ogni dispositivo collegato (statoPer).
 * - Il tempo arriva da un Orologio: vero in partita, finto nei test.
 */
import { randomBytes } from "node:crypto";
import {
  applica,
  creaCasuale,
  creaPartita,
  descriviFase,
  eventiPer,
  inAttesaDi,
  vista,
  vistaGiocatore,
  type Ambiente,
  type Azione,
  type AzioneGiocatore,
  type Casuale,
  type Destinatario,
  type Evento,
  type GiocatoreId,
  type Partita,
  type VistaGiocatore,
  type VistaTV,
} from "@il-direttivo/engine";
import { PROFILI, Robot, type Profilo } from "@il-direttivo/simulator/robot";
import type { ConfigServer, Orologio } from "./config.js";

/** Chi è collegato: la TV (con i comandi se ha il token della stanza) o un giocatore. */
export type Chi = { tipo: "TV"; comandi: boolean } | { tipo: "GIOCATORE"; id: GiocatoreId };

export interface Partecipante {
  id: GiocatoreId;
  nome: string;
  bot: boolean;
  connesso: boolean;
}

export type Comando =
  | { tipo: "AGGIUNGI_BOT" }
  | { tipo: "TOGLI_BOT" }
  | { tipo: "BOT_SPIE"; valore: boolean }
  | { tipo: "AVVIA" }
  | { tipo: "PAUSA" }
  | { tipo: "RIPRENDI" }
  | { tipo: "AVANTI" };

/** Un'azione come la manda il telefono: senza "da" (lo aggiunge il server dal token). */
export type AzioneDalTelefono = AzioneGiocatore extends infer A ? (A extends { da: GiocatoreId } ? Omit<A, "da"> : never) : never;

export type Risposta<T = object> = ({ ok: true } & T) | { ok: false; errore: string };

/** Dati della stanza che non vengono dal motore (uguali per tutti, salvo "sonoCapo"). */
export interface InfoStanza {
  codice: string;
  stato: "ATTESA" | "IN_CORSO";
  /** La fase in parole (es. "Trimestre 2: voto del pacchetto"). */
  descrizioneFase: string;
  partecipanti: Partecipante[];
  capo?: GiocatoreId;
  /** Vero se questo dispositivo ha i comandi della partita. */
  sonoCapo: boolean;
  opzioni: { botSpie: boolean };
  /** Timer della fase: scadenza (orario del server, ms) oppure tempo rimasto se in pausa; null = solo "Avanti". */
  timer: { scadenza: number | null; rimanenteMs: number | null; inPausa: boolean; ora: number };
  /** Chi deve ancora agire (null = fase senza azione per tutti). */
  inAttesaDi: GiocatoreId[] | null;
  /** Carattere dei bot: solo a fine partita (D-065 punto 4), mai prima (rivelerebbe le spie). */
  carattereBot?: Partial<Record<GiocatoreId, Profilo["nome"]>>;
}

export interface StatoDispositivo {
  info: InfoStanza;
  vista: VistaTV | VistaGiocatore | null;
  eventi: Evento[];
}

const FASI_FINE = new Set(["PUNTEGGIO", "LETTURA_MESSAGGI", "FINE"]);

export interface OpzioniStanza {
  codice: string;
  ambiente: Ambiente;
  config: ConfigServer;
  orologio: Orologio;
  /** Seme della partita (casuale se assente). */
  seme?: number;
  /** Moltiplica tutti i tempi (solo per i test: 0,001 = mille volte più veloce). */
  fattoreTempo?: number;
  /** Chiamata a ogni cambiamento, con gli eventi nuovi (da filtrare per dispositivo). */
  suCambiamento?: (eventi: Evento[]) => void;
  /** Registro delle azioni (per il debug e per riprodurre una partita). */
  suRegistro?: (riga: object) => void;
}

export class Stanza {
  readonly codice: string;
  /** Token della pagina TV che ha creato la stanza: dà i comandi (D-080 punto 3). */
  readonly tokenTV = nuovoToken();
  ultimaAttivita: number;

  private readonly partecipanti: Partecipante[] = [];
  private readonly token = new Map<string, GiocatoreId>();
  private capo?: GiocatoreId;
  private opzioni = { botSpie: true };
  private contaUmani = 0;
  private contaBot = 0;

  private partita?: Partita;
  private readonly robot = new Map<GiocatoreId, Robot>();
  private readonly carattere = new Map<GiocatoreId, Profilo["nome"]>();
  private casualeServer!: Casuale;

  private scadenza: number | null = null;
  private rimanente: number | null = null;
  private inPausa = false;
  private annullaTimer: (() => void) | undefined;
  private annullaChiusura: (() => void) | undefined;
  /** Bot che devono ancora agire in questa fase, con il loro timer. */
  private readonly botInAttesa = new Map<GiocatoreId, (() => void) | undefined>();

  constructor(private readonly o: OpzioniStanza) {
    this.codice = o.codice;
    this.ultimaAttivita = o.orologio.ora();
  }

  // ───────────── Sala d'attesa ─────────────

  get inCorso(): boolean {
    return this.partita !== undefined;
  }

  get fase(): string | undefined {
    return this.partita?.fase.nome;
  }

  /** Un telefono entra con un nome (solo prima dell'avvio, Architettura §6.2). */
  entraTelefono(nomeGrezzo: string): Risposta<{ token: string; id: GiocatoreId }> {
    if (this.partita) return { ok: false, errore: "La partita è già cominciata: si rientra solo con il proprio telefono" };
    const nome = String(nomeGrezzo ?? "").trim().replace(/\s+/g, " ");
    if (nome.length === 0) return { ok: false, errore: "Scrivi il tuo nome" };
    if (nome.length > this.o.config.caratteriNome) return { ok: false, errore: `Nome troppo lungo (al massimo ${this.o.config.caratteriNome} caratteri)` };
    if (this.partecipanti.some((p) => p.nome.toLowerCase() === nome.toLowerCase())) return { ok: false, errore: "C'è già qualcuno con questo nome" };
    if (this.partecipanti.length >= this.o.ambiente.config.giocatori.massimo) return { ok: false, errore: "La stanza è piena" };
    const id = `u${++this.contaUmani}`;
    this.partecipanti.push({ id, nome, bot: false, connesso: true });
    const token = nuovoToken();
    this.token.set(token, id);
    // Il primo telefono entrato è il capo partita (D-080 punto 3).
    if (!this.capo) this.capo = id;
    this.cambiato([]);
    return { ok: true, token, id };
  }

  /** Riconnessione: il telefono presenta il suo token e rientra nello stesso posto. */
  riprendi(token: string): GiocatoreId | undefined {
    return this.token.get(String(token ?? ""));
  }

  /** Segna un giocatore come collegato o scollegato (solo informazione per la TV). */
  collegato(id: GiocatoreId, si: boolean): void {
    const p = this.partecipanti.find((x) => x.id === id);
    if (p && p.connesso !== si) {
      p.connesso = si;
      this.cambiato([]);
    }
  }

  private puoComandare(chi: Chi): boolean {
    return chi.tipo === "TV" ? chi.comandi : chi.id === this.capo;
  }

  comando(chi: Chi, c: Comando): Risposta {
    if (!this.puoComandare(chi)) return { ok: false, errore: "Solo chi ha creato la partita può usare questo comando" };
    this.ultimaAttivita = this.o.orologio.ora();
    switch (c.tipo) {
      case "AGGIUNGI_BOT": {
        if (this.partita) return { ok: false, errore: "La partita è già cominciata" };
        if (this.partecipanti.length >= this.o.ambiente.config.giocatori.massimo) return { ok: false, errore: "La stanza è piena" };
        const n = ++this.contaBot;
        this.partecipanti.push({ id: `b${n}`, nome: `Bot ${n}`, bot: true, connesso: true });
        this.cambiato([]);
        return { ok: true };
      }
      case "TOGLI_BOT": {
        if (this.partita) return { ok: false, errore: "La partita è già cominciata" };
        const i = this.partecipanti.map((p) => p.bot).lastIndexOf(true);
        if (i < 0) return { ok: false, errore: "Non ci sono bot da togliere" };
        this.partecipanti.splice(i, 1);
        this.cambiato([]);
        return { ok: true };
      }
      case "BOT_SPIE":
        if (this.partita) return { ok: false, errore: "La partita è già cominciata" };
        this.opzioni = { botSpie: c.valore === true };
        this.cambiato([]);
        return { ok: true };
      case "AVVIA":
        return this.avvia();
      case "PAUSA":
        if (!this.partita) return { ok: false, errore: "La partita non è cominciata" };
        this.pausa();
        return { ok: true };
      case "RIPRENDI":
        if (!this.partita) return { ok: false, errore: "La partita non è cominciata" };
        this.riprendiTempo();
        return { ok: true };
      case "AVANTI":
        if (!this.partita) return { ok: false, errore: "La partita non è cominciata" };
        if (this.partita.fase.nome === "FINE") return { ok: false, errore: "La partita è finita" };
        this.inPausa = false;
        this.rimanente = null;
        this.avanza();
        return { ok: true };
    }
  }

  private avvia(): Risposta {
    if (this.partita) return { ok: false, errore: "La partita è già cominciata" };
    const seme = this.o.seme ?? randomBytes(4).readUInt32BE(0) % 2 ** 31;
    this.casualeServer = creaCasuale(seme * 7919 + 13);
    const umani = this.partecipanti.filter((p) => !p.bot).map((p) => p.id);
    const esito = creaPartita(
      this.partecipanti.map((p) => ({ id: p.id, nome: p.nome })),
      seme,
      this.o.ambiente,
      this.opzioni.botSpie ? {} : { idoneiSpia: umani },
    );
    if (!esito.ok) return { ok: false, errore: esito.errore };
    this.partita = esito.partita;
    this.registra({ tipo: "AVVIO", seme, partecipanti: this.partecipanti, opzioni: this.opzioni });

    // Bot = robot del simulatore, carattere a caso secondo il ruolo (D-065 punto 3, D-080 punto 2).
    for (const g of this.partita.giocatori) {
      if (!this.partecipanti.find((p) => p.id === g.id)?.bot) continue;
      const c = this.casualeServer;
      const profilo = g.fazione.tipo === "SPIA" ? (c.probabilita(0.5) ? PROFILI.SPIA_PRUDENTE : PROFILI.SPIA_AGGRESSIVA) : c.probabilita(0.5) ? PROFILI.COOPERATIVO : PROFILI.EGOISTA;
      this.carattere.set(g.id, profilo.nome);
      this.robot.set(g.id, new Robot(g.id, profilo, this.o.ambiente, creaCasuale(c.intero(1, 2 ** 31 - 1))));
    }
    this.entraNellaFase(esito.eventi);
    return { ok: true };
  }

  // ───────────── Azioni dei giocatori ─────────────

  azione(id: GiocatoreId, azione: AzioneDalTelefono): Risposta {
    if (!this.partita) return { ok: false, errore: "La partita non è cominciata" };
    if (!azione || typeof azione !== "object" || typeof (azione as { tipo?: unknown }).tipo !== "string") return { ok: false, errore: "Azione non riconosciuta" };
    if ((azione as { tipo: string }).tipo === "AVANZA_FASE") return { ok: false, errore: "Azione non permessa" };
    if (this.robot.has(id)) return { ok: false, errore: "Azione non permessa" };
    // Il mittente lo decide il server dal token, mai il telefono (Architettura §15).
    return this.applicaAzione({ ...azione, da: id } as Azione);
  }

  private applicaAzione(azione: Azione): Risposta {
    const r = applica(this.partita!, azione, this.o.ambiente);
    if (!r.ok) return { ok: false, errore: r.errore };
    this.partita = r.partita;
    this.ultimaAttivita = this.o.orologio.ora();
    this.registra({ tipo: "AZIONE", azione });
    this.informaBot(r.eventi);
    this.controllaChiusuraAnticipata();
    this.cambiato(r.eventi);
    return { ok: true };
  }

  // ───────────── Fasi e timer ─────────────

  /** Chiude la fase in corso (chi non ha agito riceve la scelta predefinita) e apre la successiva. */
  private avanza(): void {
    this.fermaTutto();
    const r = applica(this.partita!, { tipo: "AVANZA_FASE" }, this.o.ambiente);
    if (!r.ok) {
      // Non dovrebbe succedere: la partita resta ferma e si può riprovare con "Avanti".
      this.registra({ tipo: "ERRORE", errore: r.errore });
      this.cambiato([]);
      return;
    }
    this.partita = r.partita;
    this.registra({ tipo: "AVANZA_FASE", fase: this.partita.fase });
    this.entraNellaFase(r.eventi);
  }

  private entraNellaFase(eventi: Evento[]): void {
    const p = this.partita!;
    this.informaBot(eventi);
    const secondi = this.secondiFase();
    this.rimanente = null;
    this.scadenza = secondi === null ? null : this.o.orologio.ora() + this.ms(secondi);
    if (!this.inPausa) this.avviaTimer();
    else if (this.scadenza !== null) {
      this.rimanente = this.scadenza - this.o.orologio.ora();
      this.scadenza = null;
    }
    // Ogni bot agisce una volta per fase, dopo un ritardo casuale (come nel simulatore).
    this.botInAttesa.clear();
    if (p.fase.nome !== "FINE") for (const id of this.robot.keys()) this.botInAttesa.set(id, undefined);
    if (!this.inPausa) this.programmaBot();
    this.controllaChiusuraAnticipata();
    this.cambiato(eventi);
  }

  private secondiFase(): number | null {
    const nome = this.partita!.fase.nome;
    if (nome === "SCELTA_OBIETTIVI") return this.o.ambiente.config.obiettivi.secondiPerLaScelta;
    return this.o.config.secondiPerFase[nome] ?? null;
  }

  private ms(secondi: number): number {
    return Math.max(1, Math.round(secondi * 1000 * (this.o.fattoreTempo ?? 1)));
  }

  private avviaTimer(): void {
    this.annullaTimer?.();
    this.annullaTimer = undefined;
    if (this.scadenza === null) return;
    const attesa = Math.max(0, this.scadenza - this.o.orologio.ora());
    this.annullaTimer = this.o.orologio.programma(attesa, () => {
      this.annullaTimer = undefined;
      this.avanza();
    });
  }

  private programmaBot(): void {
    const [min, max] = this.o.config.secondiRitardoBot;
    for (const [id, annulla] of this.botInAttesa) {
      if (annulla) continue;
      const ritardo = this.ms(min + this.casualeServer.numero() * (max - min));
      this.botInAttesa.set(id, this.o.orologio.programma(ritardo, () => this.faiAgireBot(id)));
    }
  }

  private faiAgireBot(id: GiocatoreId): void {
    this.botInAttesa.delete(id);
    const robot = this.robot.get(id);
    if (!robot || !this.partita) return;
    for (const azione of robot.agisci(vistaGiocatore(this.partita, id, this.o.ambiente))) {
      // Un'azione rifiutata dal motore si ignora, come nel simulatore.
      this.applicaAzione(azione);
    }
  }

  /** Ogni robot osserva gli eventi che lo riguardano e la sua vista, come un giocatore vero. */
  private informaBot(eventi: Evento[]): void {
    if (!this.partita) return;
    for (const [id, robot] of this.robot) robot.osserva(eventiPer(eventi, { tipo: "GIOCATORE", id }), vistaGiocatore(this.partita, id, this.o.ambiente));
  }

  /** D-066: appena tutti hanno agito, la fase si chiude (dopo una breve pausa per vederlo in TV). */
  private controllaChiusuraAnticipata(): void {
    if (this.inPausa || this.annullaChiusura || !this.partita) return;
    const attesi = inAttesaDi(this.partita);
    if (attesi === null || attesi.length > 0) return;
    this.annullaChiusura = this.o.orologio.programma(this.ms(this.o.config.secondiChiusuraAnticipata), () => {
      this.annullaChiusura = undefined;
      this.avanza();
    });
  }

  private pausa(): void {
    if (this.inPausa) return;
    this.inPausa = true;
    if (this.scadenza !== null) this.rimanente = Math.max(0, this.scadenza - this.o.orologio.ora());
    this.scadenza = null;
    this.annullaTimer?.();
    this.annullaTimer = undefined;
    this.annullaChiusura?.();
    this.annullaChiusura = undefined;
    for (const [id, annulla] of this.botInAttesa) {
      annulla?.();
      this.botInAttesa.set(id, undefined);
    }
    this.cambiato([]);
  }

  private riprendiTempo(): void {
    if (!this.inPausa) return;
    this.inPausa = false;
    if (this.rimanente !== null) this.scadenza = this.o.orologio.ora() + this.rimanente;
    this.rimanente = null;
    this.avviaTimer();
    this.programmaBot();
    this.controllaChiusuraAnticipata();
    this.cambiato([]);
  }

  private fermaTutto(): void {
    this.annullaTimer?.();
    this.annullaTimer = undefined;
    this.annullaChiusura?.();
    this.annullaChiusura = undefined;
    for (const annulla of this.botInAttesa.values()) annulla?.();
    this.botInAttesa.clear();
  }

  /** Ferma tutti i timer (stanza cancellata o server spento). */
  chiudi(): void {
    this.fermaTutto();
  }

  // ───────────── Cosa vede ogni dispositivo ─────────────

  statoPer(chi: Chi, eventi: Evento[] = []): StatoDispositivo {
    const p = this.partita;
    const dest: Destinatario = chi.tipo === "TV" ? { tipo: "TV" } : { tipo: "GIOCATORE", id: chi.id };
    const info: InfoStanza = {
      codice: this.codice,
      stato: p ? "IN_CORSO" : "ATTESA",
      descrizioneFase: p ? descriviFase(p.fase, p.trimestre) : "In attesa dei giocatori",
      partecipanti: this.partecipanti.map((x) => ({ ...x })),
      ...(this.capo ? { capo: this.capo } : {}),
      sonoCapo: this.puoComandare(chi),
      opzioni: { ...this.opzioni },
      timer: { scadenza: this.scadenza, rimanenteMs: this.rimanente, inPausa: this.inPausa, ora: this.o.orologio.ora() },
      inAttesaDi: p ? inAttesaDi(p) : null,
      ...(p && FASI_FINE.has(p.fase.nome) ? { carattereBot: Object.fromEntries(this.carattere) } : {}),
    };
    // Un giocatore vede solo la propria vista: mai quella di un altro (regola 3).
    const vistaDispositivo = p && (dest.tipo === "TV" || p.giocatori.some((g) => g.id === dest.id)) ? vista(p, dest, this.o.ambiente) : null;
    return { info, vista: vistaDispositivo, eventi: eventiPer(eventi, dest) };
  }

  private cambiato(eventi: Evento[]): void {
    this.o.suCambiamento?.(eventi);
  }

  private registra(riga: object): void {
    this.o.suRegistro?.({ t: this.o.orologio.ora(), ...riga });
  }
}

function nuovoToken(): string {
  return randomBytes(16).toString("hex");
}
