/**
 * Giocatori-robot (Architettura §14).
 *
 * Ogni robot decide vedendo SOLO la propria vista filtrata e gli eventi che riceve, come un
 * giocatore vero. Conosce in più il materiale di gioco pubblico (il mazzo dei segreti), che usa
 * per capire a quale reparto serve un segreto.
 *
 * Obiettivi personali (D-046…D-052): il robot sceglie uno dei suoi tre (in parte secondo il
 * profilo, in parte a caso) e lo persegue con regole semplici, finché i traguardi non sono
 * raggiunti. Quanto si impegna dipende dal profilo ("impegno"): per una spia gli obiettivi sono
 * aziendalisti, quindi impegnarsi significa aiutare l'azienda (il suo dilemma, D-049).
 *
 * Limiti: i robot non parlano, non mentono a voce e non persuadono. Non sanno "leggere la sala":
 * gli obiettivi che chiedono di indovinare l'esito o l'effetto sull'azienda li perseguono male.
 * Il simulatore trova gli squilibri numerici evidenti, non misura il divertimento.
 */
import type { Ambiente, Azione, Casuale, Evento, GiocatoreId, ModelloObiettivo, VistaGiocatore } from "@il-direttivo/engine";

export interface Profilo {
  nome: "COOPERATIVO" | "EGOISTA" | "SPIA_PRUDENTE" | "SPIA_AGGRESSIVA";
  /** Probabilità di scegliere "reparto" nella mossa privata (per le spie: sabotaggio). */
  egoismo: number;
  /** Vota sì se l'effetto sul proprio reparto è almeno questo. */
  sogliaVoto: number;
  /** Probabilità di condividere un segreto con il reparto a cui serve. */
  condivisione: number;
  /** Solo spie: probabilità di votare no per sabotare, o di inoltrare un segreto falsato. */
  sabotaggio: number;
  /** Solo spie: la prudente consegna al concorrente solo segreti ricevuti da altri (più persone li conoscono). */
  prudente: boolean;
  /** Probabilità di agire per il proprio obiettivo personale quando se ne presenta l'occasione. */
  impegno: number;
}

export const PROFILI: Record<Profilo["nome"], Profilo> = {
  COOPERATIVO: { nome: "COOPERATIVO", egoismo: 0.15, sogliaVoto: -1, condivisione: 0.8, sabotaggio: 0, prudente: false, impegno: 0.8 },
  EGOISTA: { nome: "EGOISTA", egoismo: 0.6, sogliaVoto: 1, condivisione: 0.4, sabotaggio: 0, prudente: false, impegno: 0.8 },
  // Le spie prudenti inseguono l'obiettivo (aziendalista) più delle aggressive: è anche copertura.
  SPIA_PRUDENTE: { nome: "SPIA_PRUDENTE", egoismo: 0.5, sogliaVoto: 1, condivisione: 0.5, sabotaggio: 0.4, prudente: true, impegno: 0.6 },
  SPIA_AGGRESSIVA: { nome: "SPIA_AGGRESSIVA", egoismo: 0.85, sogliaVoto: 2, condivisione: 0.3, sabotaggio: 0.8, prudente: false, impegno: 0.3 },
};

/**
 * Finale (D-058): un onesto risponde "sì, c'è una spia" se sospetta qualcuno almeno così tanto;
 * altrimenti risponde sì solo per istinto, con PROBABILITA_SI_SENZA_INDIZI (nel finale non ci sono
 * punti in gioco, D-059: dire sì non costa nulla).
 */
const SOGLIA_SOSPETTO = 1.5;
const PROBABILITA_SI_SENZA_INDIZI = 0.3;
/** Le spie prudenti rispondono "sì" per mimetizzarsi con questa probabilità; le aggressive dicono sempre "no". */
const PROBABILITA_SI_SPIA_PRUDENTE = 0.5;

/**
 * Spie e segreti finti (D-074): se la spia non sa quale dei due segreti del trimestre è il finto,
 * passarlo al concorrente è una scommessa (il finto gli costa la penalità). La spia aggressiva rischia
 * più spesso della prudente. Se sa che l'altro è il finto (perché il finto è il suo), lo passa.
 */
const PROBABILITA_SCOMMESSA = { aggressiva: 0.35, prudente: 0.1 };

/** Probabilità di un messaggio di solo testo a inizio trimestre ("chiacchiere" che nella realtà ci sono sempre). */
const PROBABILITA_CHIACCHIERA = 0.35;

/** Cosa fa un robot per ciascuna misura degli obiettivi (le misure "passive" non hanno regole). */
type Intenzione =
  | "SEGUI"
  | "VOTA_CONTRO"
  | "SOLITARIO"
  | "VOTA_NO"
  | "VOTA_SI"
  | "NO_PIU_COSTOSA"
  | "RISPARMIA"
  | "MOSSA_AZIENDA"
  | "INOLTRA"
  | "PORTA_AL_REPARTO"
  | "FALSIFICA"
  | "CANARINO"
  | "ANONIMO"
  | "NON_CONSEGNARE_FONTE";

/**
 * Obiettivi sul voto del pacchetto (D-076). "SEGUI" = votare il pacchetto che probabilmente vincerà
 * (serve per "il tuo pacchetto passa", "decisivo", "positivo": il robot non conosce gli effetti
 * sull'azienda, quindi può solo stare con la maggioranza); "VOTA_CONTRO" = un pacchetto diverso da
 * quello che probabilmente vincerà; "SOLITARIO" = quello che nessun altro dovrebbe votare.
 */
const INTENZIONI: Record<string, Intenzione> = {
  PRIMO_VOTO_DIVERSO_DA_APPROVATO: "VOTA_CONTRO",
  UNICO_SUL_PACCHETTO: "SOLITARIO",
  PRIMO_VOTO_COME_APPROVATO: "SEGUI",
  APPROVATO_AL_PRIMO_VOTO: "SEGUI",
  VOTI_DECISIVI: "SEGUI",
  PACCHETTO_APPROVATO_POSITIVO: "SEGUI",
  PACCHETTI_APPROVATI_SENZA_DANNOSI: "SEGUI",
  PACCHETTO_SENZA_PIU_CARA: "NO_PIU_COSTOSA",
  PACCHETTO_SENZA_PIU_CARA_APPROVATO: "NO_PIU_COSTOSA",
  TRIMESTRI_CASSA_MINIMA: "RISPARMIA",
  CASSA_FINE_ANNO: "RISPARMIA",
  NO_AL_PRINCIPALE: "VOTA_NO",
  NO_DECISIVO_PER_ALTERNATIVA: "VOTA_NO",
  NO_PRINCIPALE_APPROVATO: "VOTA_NO",
  SI_PRINCIPALE_RESPINTO: "VOTA_SI",
  SECONDO_VOTO_CONTRO_ESITO: "VOTA_SI",
  MOSSE_AZIENDA: "MOSSA_AZIENDA",
  TRIMESTRI_META_AZIENDA: "MOSSA_AZIENDA",
  TRIMESTRI_MAGGIORANZA_AZIENDA: "MOSSA_AZIENDA",
  SEGRETI_INOLTRATI: "INOLTRA",
  FONTE_ARRIVATA_A_GIOCATORI: "INOLTRA",
  CATENA_DOPO_DI_TE: "INOLTRA",
  SEGRETI_IN_TEMPO_GRAZIE_A_TE: "PORTA_AL_REPARTO",
  COPIA_VERA_AL_REPARTO_UTILE: "PORTA_AL_REPARTO",
  COPIE_MODIFICATE: "FALSIFICA",
  FALSO_USATO_DA_CONCORRENTE: "FALSIFICA",
  VERSIONI_DIVERSE_INOLTRATE: "CANARINO",
  VERSIONE_CANARINO_USATA: "CANARINO",
  TRIMESTRI_CON_ANONIMO_INVIATO: "ANONIMO",
  FONTE_MAI_AL_CONCORRENTE: "NON_CONSEGNARE_FONTE",
};

/** "Forma" di un pacchetto: i costi delle sue proposte (es. "30+50"), confrontabile tra trimestri. */
const forma = (costi: number[]) => [...costi].sort((a, b) => a - b).join("+");
/** Senza informazioni (1° trimestre) il robot pensa che gli altri votino le due piccole. */
const FORMA_PRESUNTA = "30+50";

export class Robot {
  readonly sospetto = new Map<GiocatoreId, number>();
  private readonly inviati: { titolo: string; a: GiocatoreId }[] = [];
  private readonly ricevuti: { titolo: string; da: GiocatoreId }[] = [];
  private readonly condivisi = new Set<string>();
  private readonly consegnati = new Set<string>();
  /** Forma dell'ultimo pacchetto votato da ciascun collega al primo voto (voti pubblici, D-019). */
  private readonly ultimaForma = new Map<GiocatoreId, string>();

  constructor(
    readonly id: GiocatoreId,
    readonly profilo: Profilo,
    private readonly ambiente: Ambiente,
    private readonly casuale: Casuale,
  ) {}

  private spia(v: VistaGiocatore) {
    return v.io.fazione.tipo === "SPIA";
  }

  /** Intenzioni dei traguardi non ancora decisi del proprio obiettivo. */
  private intenzioni(v: VistaGiocatore): Set<Intenzione> {
    const scelto = v.obiettivo.scelto;
    if (!scelto) return new Set();
    const modello = this.ambiente.obiettivi.find((o) => o.id === scelto.id)!;
    const aperti = modello.traguardi.filter((_, i) => {
      const stato = scelto.traguardi[i]?.stato;
      return stato !== "RAGGIUNTO" && stato !== "NON_RAGGIUNTO";
    });
    return new Set(aperti.flatMap((t) => (INTENZIONI[t.misura] ? [INTENZIONI[t.misura]!] : [])));
  }

  /** Vero se il robot ha questa intenzione e decide di agire (secondo il suo impegno). */
  private vuole(v: VistaGiocatore, intenzione: Intenzione): boolean {
    return this.intenzioni(v).has(intenzione) && this.casuale.probabilita(this.profilo.impegno);
  }

  /** Scelta dell'obiettivo: metà delle volte secondo il profilo, metà a caso. */
  private scegliObiettivo(v: VistaGiocatore): Azione | undefined {
    const proposte = v.obiettivo.proposte;
    if (!proposte || proposte.length === 0) return undefined;
    const modelli = proposte.map((o) => this.ambiente.obiettivi.find((m) => m.id === o.id)!);
    let candidati: ModelloObiettivo[] = modelli;
    if (this.casuale.probabilita(0.5)) {
      // Il cooperativo preferisce gli aziendalisti, l'egoista gli altri; le spie li hanno solo aziendalisti.
      const preferiti = this.profilo.nome === "COOPERATIVO" ? modelli.filter((m) => m.aziendalista) : this.profilo.nome === "EGOISTA" ? modelli.filter((m) => !m.aziendalista) : modelli;
      if (preferiti.length > 0) candidati = preferiti;
    }
    return { tipo: "SCEGLI_OBIETTIVO", da: this.id, obiettivo: this.casuale.scegli(candidati).id };
  }

  private aumenta(id: GiocatoreId, quanto: number) {
    if (id === this.id) return;
    this.sospetto.set(id, (this.sospetto.get(id) ?? 0) + quanto);
  }

  /** Il collega di cui mi fido di più (meno sospetto, a parità a caso). */
  private menoSospetto(candidati: GiocatoreId[]): GiocatoreId {
    let migliore: { id: GiocatoreId; valore: number } | undefined;
    for (const id of this.casuale.mescola(candidati)) {
      const valore = this.sospetto.get(id) ?? 0;
      if (!migliore || valore < migliore.valore) migliore = { id, valore };
    }
    return migliore!.id;
  }

  /** Effetto di un pacchetto sul mio reparto. */
  private puntiPacchetto(v: VistaGiocatore, pacchetto: string[]): number {
    return pacchetto.reduce((t, id) => t + (v.mieiEffetti[id]?.punti ?? 0), 0);
  }

  /** L'elemento con il valore più alto (a parità, a caso). */
  private migliore<T>(elenco: T[], valore: (x: T) => number): T {
    const valori = elenco.map(valore);
    const massimo = Math.max(...valori);
    return this.casuale.scegli(elenco.filter((_, i) => valori[i] === massimo));
  }

  private piuSospetto(candidati: GiocatoreId[]): { id: GiocatoreId; valore: number } | undefined {
    let migliore: { id: GiocatoreId; valore: number } | undefined;
    for (const id of this.casuale.mescola(candidati)) {
      const valore = this.sospetto.get(id) ?? 0;
      if (!migliore || valore > migliore.valore) migliore = { id, valore };
    }
    return migliore;
  }

  /** Aggiorna i sospetti in base agli eventi ricevuti (solo informazioni a cui il robot ha diritto). */
  osserva(eventi: Evento[], v: VistaGiocatore): void {
    // Voti del pacchetto rivelati alla chiusura: li ricordano tutti, spie comprese.
    for (const e of eventi) {
      if (e.tipo !== "VOTO_PACCHETTO_CHIUSO") continue;
      for (const [id, pk] of Object.entries(e.voti)) {
        if (id === this.id || !Array.isArray(pk)) continue;
        this.ultimaForma.set(id, forma(pk.map((x) => v.ordineDelGiorno.find((o) => o.id === x)?.costo ?? 0)));
      }
    }
    if (this.spia(v)) return;
    for (const e of eventi) {
      if (e.tipo === "SEGRETO_USATO" || e.tipo === "FUGA_DI_NOTIZIE") {
        // Un segreto è finito al concorrente: chi l'ha ricevuto da me o me l'ha passato diventa sospetto,
        // e un po' anche gli altri che so averlo ricevuto (il telefono mostra chi l'ha già, D-073).
        for (const x of this.inviati.filter((i) => e.causa.includes(i.titolo))) this.aumenta(x.a, 3);
        for (const x of this.ricevuti.filter((r) => e.causa.includes(r.titolo))) this.aumenta(x.da, 2);
        for (const c of v.mieiSegreti.filter((c) => e.causa.includes(c.titolo))) for (const id of c.giaServiti) this.aumenta(id, 1);
      }
    }
  }

  /** Azioni per le fasi "normali" del trimestre e per il finale. */
  agisci(v: VistaGiocatore): Azione[] {
    const io = v.giocatori.find((g) => g.id === this.id)!;
    const azioni: Azione[] = [];
    const r = this.casuale;
    const p = this.profilo;
    const spia = this.spia(v);

    switch (v.fase.nome) {
      case "SCELTA_OBIETTIVI": {
        const scelta = this.scegliObiettivo(v);
        if (scelta) azioni.push(scelta);
        break;
      }
      case "RAPPORTO":
      case "DISCUSSIONE": {
        const altriAttivi = v.giocatori.filter((g) => g.stato === "ATTIVO" && g.id !== this.id).map((g) => g.id);
        // Obiettivo "un anonimo in ogni trimestre": costa tutta la quota, quindi va fatto per primo.
        if (v.fase.nome === "RAPPORTO" && io.stato === "ATTIVO" && altriAttivi.length > 0 && this.vuole(v, "ANONIMO")) {
          azioni.push({ tipo: "INVIA_MESSAGGIO", da: this.id, a: r.scegli(altriAttivi), anonimo: true, modello: "SOLO_TESTO", testo: "Occhio a chi parla troppo." });
        }
        const fonteDaProteggere = this.vuole(v, "NON_CONSEGNARE_FONTE");
        const vivi = v.mieiSegreti.filter((c) => v.trimestre <= c.scadenza);
        // La spia sa quali trimestri hanno il finto "suo": l'altro segreto di quel trimestre è vero (D-074).
        const trimestriConFintoMio = new Set(vivi.filter((c) => c.finto).map((c) => c.trimestre));
        for (const copia of vivi) {
          // Consegna al concorrente (spie): mai il finto noto; con l'obiettivo "Custode" niente dati propri.
          if (spia && !copia.finto && !this.consegnati.has(copia.id) && !(fonteDaProteggere && copia.provenienza.tipo === "GIOCO")) {
            const ricevutoDaAltri = copia.provenienza.tipo === "GIOCATORE";
            const sicuro = trimestriConFintoMio.has(copia.trimestre);
            const scommessa = r.probabilita(p.prudente ? PROBABILITA_SCOMMESSA.prudente : PROBABILITA_SCOMMESSA.aggressiva);
            if ((!p.prudente || ricevutoDaAltri) && (sicuro || scommessa)) {
              this.consegnati.add(copia.id);
              azioni.push({ tipo: "PASSA_AL_CONCORRENTE", da: this.id, copiaSegretoId: copia.id });
            }
          }
          // Un solo passo per copia e per trimestre: il segreto avanza lungo la catena (D-073).
          const chiave = `${copia.id}@${v.trimestre}`;
          if (this.condivisi.has(chiave)) continue;
          this.condivisi.add(chiave);
          const utile = v.giocatori.find((g) => g.repartoId === copia.utileA && g.stato === "ATTIVO");
          if (!utile || utile.id === this.id || copia.giaServiti.includes(utile.id)) continue;
          const portaAlReparto = this.vuole(v, "PORTA_AL_REPARTO");
          azioni.push(...this.azioniObiettivoSegreto(v, copia, altriAttivi, utile.id));
          if (!(portaAlReparto || r.probabilita(p.condivisione))) continue;
          // Destinatario: il reparto utile se la catena è completa, altrimenti il collega di cui mi fido di più.
          let destinatario: GiocatoreId | undefined = utile.id;
          if (copia.passaggiMancanti > 0) {
            const liberi = altriAttivi.filter((id) => id !== utile.id && !copia.giaServiti.includes(id));
            if (liberi.length === 0) continue;
            destinatario = spia ? r.scegli(liberi) : this.menoSospetto(liberi);
          }
          // La spia a volte falsifica quello che inoltra (mai il finto: non servirebbe).
          const falsifica = spia && !copia.finto && !portaAlReparto && r.probabilita(p.sabotaggio);
          const campo = Object.keys(copia.campi)[0];
          const alternativa = campo ? copia.valoriSuggeriti[campo]?.find((x) => x !== copia.campi[campo]) : undefined;
          azioni.push({
            tipo: "INVIA_MESSAGGIO",
            da: this.id,
            a: destinatario,
            anonimo: false,
            modello: "SEGRETO",
            copiaSegretoId: copia.id,
            ...(falsifica && campo ? { campi: { [campo]: alternativa ?? `${copia.campi[campo]} (ritoccato)` } } : {}),
          });
          this.inviati.push({ titolo: copia.titolo, a: destinatario });
        }
        // Chiacchiere: un messaggio di solo testo ogni tanto (servono anche agli obiettivi "di ricezione").
        if (v.fase.nome === "RAPPORTO" && altriAttivi.length > 0 && r.probabilita(PROBABILITA_CHIACCHIERA)) {
          azioni.push({ tipo: "INVIA_MESSAGGIO", da: this.id, a: r.scegli(altriAttivi), anonimo: false, modello: "SOLO_TESTO", testo: "Ne parliamo dopo?" });
        }
        // Registra i segreti ricevuti da altri (per i sospetti).
        for (const copia of v.mieiSegreti) {
          if (copia.provenienza.tipo === "GIOCATORE" && copia.provenienza.da && !this.ricevuti.some((x) => x.titolo === copia.titolo)) {
            this.ricevuti.push({ titolo: copia.titolo, da: copia.provenienza.da });
          }
        }
        break;
      }
      case "VOTO_PACCHETTO": {
        if (io.stato !== "ATTIVO" || !v.votoTrimestre) break;
        const pacchetti = v.votoTrimestre.pacchetti;
        if (pacchetti.length === 0) break;
        const costoDi = (id: string) => v.ordineDelGiorno.find((x) => x.id === id)?.costo ?? 0;
        const costo = (pk: string[]) => pk.reduce((t, id) => t + costoDi(id), 0);
        const piuCara = Math.max(...v.ordineDelGiorno.map((x) => x.costo));
        const conCara = (pk: string[]) => pk.some((id) => costoDi(id) === piuCara);
        // Punteggio di un pacchetto: effetto sul mio reparto; il cooperativo preferisce investire di più
        // (crede che spendere aiuti l'azienda); gli obiettivi spostano un po' la scelta.
        const risparmia = this.vuole(v, "RISPARMIA");
        const noCara = this.vuole(v, "NO_PIU_COSTOSA");
        const valore = (pk: string[]) =>
          this.puntiPacchetto(v, pk) +
          (p.nome === "COOPERATIVO" ? costo(pk) / 100 : 0) -
          (risparmia ? costo(pk) / 40 : 0) -
          (noCara && conCara(pk) ? 3 : 0);
        // Quanti colleghi dovrebbero votare ciascun pacchetto (come hanno votato l'ultima volta).
        const altri = v.giocatori.filter((g) => g.stato === "ATTIVO" && g.id !== this.id);
        const previsti = (pk: string[]) => {
          const f = forma(pk.map(costoDi));
          return altri.filter((g) => (this.ultimaForma.get(g.id) ?? FORMA_PRESUNTA) === f).length;
        };
        const favorito = this.migliore(pacchetti, (pk) => previsti(pk) * 100 + valore(pk));
        let scelto: string[];
        if (spia && r.probabilita(p.sabotaggio * 0.5)) {
          // La spia non sa quale pacchetto aiuta l'azienda: a volte vota a caso.
          scelto = r.scegli(pacchetti);
        } else if (this.vuole(v, "SOLITARIO")) {
          scelto = this.migliore(pacchetti, (pk) => -previsti(pk) * 100 + valore(pk));
        } else if (this.vuole(v, "VOTA_CONTRO") && pacchetti.length > 1) {
          scelto = this.migliore(pacchetti.filter((pk) => pk !== favorito), valore);
        } else if (this.vuole(v, "SEGUI")) {
          scelto = favorito;
        } else {
          scelto = this.migliore(pacchetti, valore);
        }
        azioni.push({ tipo: "VOTA_PACCHETTO", da: this.id, pacchetto: scelto });
        break;
      }
      case "SECONDO_VOTO": {
        if (io.stato !== "ATTIVO" || !v.votoTrimestre?.principale) break;
        const principale = v.votoTrimestre.principale;
        // L'alternativa è coperta: la stimo come la media degli altri pacchetti possibili.
        const altri = v.votoTrimestre.pacchetti.filter((pk) => pk.join("+") !== principale.join("+"));
        const attesa = altri.length > 0 ? altri.reduce((t, pk) => t + this.puntiPacchetto(v, pk), 0) / altri.length : 0;
        // Obiettivi sul secondo voto (D-076): "NO al principale" / "SÌ a un principale che non passa";
        // con entrambi aperti (Controcorrente) sceglie a caso.
        const vuoleNo = this.vuole(v, "VOTA_NO");
        const vuoleSi = this.vuole(v, "VOTA_SI");
        let si: boolean;
        if (spia && r.probabilita(p.sabotaggio * 0.5)) si = r.probabilita(0.5);
        else if (vuoleNo && vuoleSi) si = r.probabilita(0.5);
        else if (vuoleNo) si = false;
        else if (vuoleSi) si = true;
        else si = this.puntiPacchetto(v, principale) >= attesa;
        azioni.push({ tipo: "VOTA", da: this.id, voto: si ? "SI" : "NO" });
        break;
      }
      case "MOSSA_PRIVATA":
        if (io.stato === "ATTIVO") {
          // Con un obiettivo sulla mossa "per l'azienda" il robot (anche la spia) ci prova secondo il suo impegno.
          const perAzienda = this.vuole(v, "MOSSA_AZIENDA") || !r.probabilita(p.egoismo);
          azioni.push({ tipo: "MOSSA_PRIVATA", da: this.id, scelta: perAzienda ? "AZIENDA" : "REPARTO" });
        }
        break;
      case "DOMANDA": {
        if (io.stato !== "ATTIVO") break;
        const altri = v.giocatori.filter((g) => g.stato === "ATTIVO" && g.id !== this.id).map((g) => g.id);
        const sospettoMassimo = this.piuSospetto(altri)?.valore ?? 0;
        const si = spia
          ? p.prudente && r.probabilita(PROBABILITA_SI_SPIA_PRUDENTE)
          : sospettoMassimo >= SOGLIA_SOSPETTO || r.probabilita(PROBABILITA_SI_SENZA_INDIZI);
        azioni.push({ tipo: "DOMANDA_SPIA", da: this.id, risposta: si ? "SI" : "NO" });
        break;
      }
      case "NOMINA":
      case "BALLOTTAGGIO": {
        if (io.stato !== "ATTIVO") break;
        const b = v.finale.ballottaggio;
        if (v.fase.nome === "BALLOTTAGGIO" && (!b || !b.votanti.includes(this.id))) break; // chi è candidato non vota
        const possibili = (b && v.fase.nome === "BALLOTTAGGIO" ? b.candidati : v.giocatori.filter((g) => g.stato === "ATTIVO").map((g) => g.id)).filter(
          (id) => id !== this.id && id !== v.mieiVoti.nomeBloccato,
        );
        // Le spie evitano i propri alleati, se possono.
        const ammessi = possibili.filter((id) => !v.io.alleati.includes(id));
        const scelta = ammessi.length > 0 ? ammessi : possibili;
        if (scelta.length === 0) break;
        const bersaglio = spia ? r.scegli(scelta) : this.piuSospetto(scelta)!.id;
        azioni.push({ tipo: "NOMINA_SPIA", da: this.id, bersaglio });
        break;
      }
      default:
        break;
    }
    return azioni;
  }

  /** Messaggi in più per gli obiettivi sui segreti (oltre alla condivisione con il reparto utile). */
  private azioniObiettivoSegreto(v: VistaGiocatore, copia: VistaGiocatore["mieiSegreti"][number], altri: GiocatoreId[], utile?: GiocatoreId): Azione[] {
    const azioni: Azione[] = [];
    const destinatari = this.casuale.mescola(altri.filter((id) => id !== utile && !copia.giaServiti.includes(id)));
    const campo = Object.keys(copia.campi)[0];
    const falsoCredibile = () => (campo ? copia.valoriSuggeriti[campo]?.find((x) => x !== copia.campi[campo]) ?? `${copia.campi[campo]} (ritoccato)` : undefined);
    const invia = (a: GiocatoreId, modificata: boolean): Azione => ({
      tipo: "INVIA_MESSAGGIO",
      da: this.id,
      a,
      anonimo: false,
      modello: "SEGRETO",
      copiaSegretoId: copia.id,
      ...(modificata && campo ? { campi: { [campo]: falsoCredibile()! } } : {}),
    });
    if (this.vuole(v, "CANARINO") && destinatari.length >= 2 && campo) {
      // Trappola del canarino: due versioni diverse a due persone (la vera e una ritoccata).
      azioni.push(invia(destinatari[0]!, false), invia(destinatari[1]!, true));
    } else if (this.vuole(v, "FALSIFICA") && destinatari.length > 0 && campo) {
      // Una copia falsa a chi sospetta di più (o a caso).
      const bersaglio = this.piuSospetto(destinatari)?.id ?? destinatari[0]!;
      azioni.push(invia(bersaglio, true));
    } else if (this.vuole(v, "INOLTRA") && destinatari.length > 0) {
      azioni.push(invia(destinatari[0]!, false));
    }
    return azioni;
  }
}
