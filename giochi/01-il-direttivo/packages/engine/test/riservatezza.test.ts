/**
 * Test di riservatezza delle viste (regola 3 del gioco, obbligatorio).
 *
 * Si giocano molte partite con azioni casuali (valide e non) e a ogni passo si controlla che
 * nessuna vista e nessun evento ricevuto contenga dati che quel dispositivo non deve vedere.
 */
import { creaEAvvia } from "./aiuti.js";
import { describe, expect, it } from "vitest";
import type { Azione, Evento } from "../src/azioni.js";
import { caricaAmbiente } from "../src/contenuti.js";
import { applica } from "../src/motore.js";
import { creaPartita } from "../src/partita.js";
import { creaCasuale, type Casuale } from "../src/rng.js";
import type { Partita } from "../src/tipi.js";
import { eventiPer, vistaGiocatore, vistaTV, type Destinatario } from "../src/viste.js";

const ambiente = caricaAmbiente();
const FASI_FINE = new Set(["PUNTEGGIO", "LETTURA_MESSAGGI", "FINE"]);

/** Chiavi che non devono MAI comparire in una vista (a nessun livello). */
const CHIAVI_VIETATE = [
  "catena", "statoCasuale", "seme", "mossePrivate", "spieTraAttivi", "effettiPrivati", "effettoAzienda", "nomine", "revocata", "possessore",
  // Obiettivi personali e loro storici (solo server, D-047, D-052).
  "proposti", "storicoVotazioni", "storicoTrimestri", "decisivi", "mosseScelte", "alterataDa", "modificataDalMittente", "storicoNomine", "aziendalista", "misura",
];

/** Identificativi degli obiettivi (es. "T2-07") presenti in un testo. */
const idObiettivi = (testo: string): Set<string> => new Set([...testo.matchAll(/"(T\d-\d\d)"/g)].map((m) => m[1]!));

function chiaviPresenti(oggetto: unknown, trovate = new Set<string>()): Set<string> {
  if (Array.isArray(oggetto)) oggetto.forEach((x) => chiaviPresenti(x, trovate));
  else if (oggetto && typeof oggetto === "object") {
    for (const [k, v] of Object.entries(oggetto)) {
      trovate.add(k);
      chiaviPresenti(v, trovate);
    }
  }
  return trovate;
}

/** Un'azione casuale, spesso valida, a volte no: serve a esplorare tanti stati diversi. */
function azioneCasuale(p: Partita, r: Casuale): Azione {
  const g = r.scegli(p.giocatori);
  const altro = r.scegli(p.giocatori.filter((x) => x.id !== g.id));
  const mieCopie = p.copieSegreto.filter((c) => c.possessore === g.id);
  const scelte: (() => Azione)[] = [
    // Scelta dell'obiettivo: a volte uno dei propri tre, a volte quello di un altro (non valido).
    () => ({ tipo: "SCEGLI_OBIETTIVO", da: g.id, obiettivo: r.scegli(p.obiettivi[r.probabilita(0.8) ? g.id : altro.id]?.proposti ?? ["T1-01"]) }),
    () => ({ tipo: "AVANZA_FASE" }),
    () => ({ tipo: "AVANZA_FASE" }),
    () => ({ tipo: "VOTA", da: g.id, voto: r.scegli(["SI", "NO", "ASTENUTO"] as const) }),
    () => ({ tipo: "MOSSA_PRIVATA", da: g.id, scelta: r.scegli(["REPARTO", "AZIENDA"] as const) }),
    () => ({ tipo: "INVIA_MESSAGGIO", da: g.id, a: altro.id, anonimo: r.probabilita(0.3), modello: "SOLO_TESTO", testo: "parola" }),
    () => {
      const copia = mieCopie.length > 0 ? r.scegli(mieCopie) : undefined;
      const campo = copia ? Object.keys(copia.campi)[0] : undefined;
      return {
        tipo: "INVIA_MESSAGGIO", da: g.id, a: altro.id, anonimo: r.probabilita(0.3), modello: "SEGRETO",
        ...(copia ? { copiaSegretoId: copia.id } : {}),
        ...(copia && campo && r.probabilita(0.4) ? { campi: { [campo]: "modificato" } } : {}),
      };
    },
    () => (mieCopie.length > 0 ? { tipo: "PASSA_AL_CONCORRENTE", da: g.id, copiaSegretoId: r.scegli(mieCopie).id } : { tipo: "AVANZA_FASE" }),
    () => ({ tipo: "PROPONI_DEMANSIONAMENTO", da: g.id, bersaglio: altro.id }),
    () => ({ tipo: "PROPONI_PROMOZIONE", da: g.id, bersaglio: altro.id }),
    () => ({ tipo: "VOTA_DEMANSIONAMENTO", da: g.id, voto: r.scegli(["SI", "NO"] as const) }),
    () => ({ tipo: "VOTA_PROMOZIONE", da: g.id, voto: r.scegli(["SI", "NO"] as const) }),
    () => ({ tipo: "CHIUDI_VOTO_PERSONALE" }),
    () => ({ tipo: "VERIFICA_FINALE", da: g.id, soloOnesti: r.probabilita(0.6) }),
    () => ({ tipo: "NOMINA_SPIA", da: g.id, bersaglio: altro.id }),
  ];
  return r.scegli(scelte)();
}

function controllaVistaGiocatore(p: Partita, id: string): void {
  const v = vistaGiocatore(p, id, ambiente);
  const io = p.giocatori.find((g) => g.id === id)!;
  const fine = FASI_FINE.has(p.fase.nome);

  // Chiavi vietate (il segnale "falsa" è ammesso solo nella lettura finale dei messaggi).
  const chiavi = chiaviPresenti({ ...v, letturaMessaggi: undefined });
  for (const k of CHIAVI_VIETATE) expect(chiavi.has(k), `chiave vietata "${k}" nella vista di ${id}`).toBe(false);
  expect(chiavi.has("falsa") || chiavi.has("falso")).toBe(false);

  // Ruoli altrui: solo dei licenziati, o a fine partita.
  for (const altro of v.giocatori) {
    if (altro.id === id) continue;
    const stato = p.giocatori.find((g) => g.id === altro.id)!.stato;
    if (altro.fazione) expect(stato === "LICENZIATO" || fine, `ruolo di ${altro.id} visibile a ${id}`).toBe(true);
  }

  // Alleati: solo per le spie, solo dello stesso concorrente.
  for (const a of v.io.alleati) {
    const alleato = p.giocatori.find((g) => g.id === a)!;
    expect(io.fazione.tipo).toBe("SPIA");
    expect(alleato.fazione).toEqual(io.fazione);
  }
  if (io.fazione.tipo === "ONESTO") expect(v.io.alleati).toEqual([]);

  // Effetti privati: solo quelli del mio reparto.
  for (const [propostaId, effetto] of Object.entries(v.mieiEffetti)) {
    const proposta = p.proposteTrimestre.find((x) => x.id === propostaId)!;
    expect(proposta.effettiPrivati[io.repartoId]?.testo).toBe(effetto.testo);
  }

  // Voti delle proposte: rivelati solo dopo la chiusura.
  for (const prop of v.ordineDelGiorno) {
    const vera = p.proposteTrimestre.find((x) => x.id === prop.id)!;
    if (!vera.esito) expect(prop.voti).toBeUndefined();
  }

  // Copie dei segreti: solo le mie, non revocate, senza mittente se anonime.
  for (const c of v.mieiSegreti) {
    const vera = p.copieSegreto.find((x) => x.id === c.id)!;
    expect(vera.possessore).toBe(id);
    expect(vera.revocata).not.toBe(true);
    if (c.provenienza.tipo === "GIOCATORE" && c.provenienza.anonimo) expect(c.provenienza.da).toBeUndefined();
  }

  // Messaggi: solo quelli che mi riguardano; mittente nascosto negli anonimi ricevuti.
  for (const m of v.mieiMessaggi) {
    const vero = p.messaggi.find((x) => x.id === m.id)!;
    expect(vero.da === id || vero.a === id).toBe(true);
    if (vero.anonimo && vero.a === id) expect(m.da).toBeUndefined();
  }

  // Le mie scelte segrete: solo le mie (mai quelle degli altri).
  if (v.mieiVoti.verifica !== undefined) expect(v.mieiVoti.verifica).toBe(p.finale.verifica[id]);
  if (v.mieiVoti.nomina !== undefined) expect(v.mieiVoti.nomina).toBe(p.finale.nomine[id]);
  if (v.mieiVoti.mossaPrivata !== undefined) expect(v.mieiVoti.mossaPrivata).toBe(p.mossePrivate[id]);
  expect(chiaviPresenti(v.finale).has("verifica")).toBe(false);

  // Segreti consegnati: solo i miei.
  for (const s of v.segretiConsegnati) expect(p.segretiPassati.find((x) => x.copiaId === s.copiaId && x.spia === id)).toBeDefined();

  // Obiettivi (D-047): nella mia vista solo i miei — le tre proposte durante la scelta, poi lo scelto.
  // Mai gli obiettivi degli altri (la rivelazione finale mostra nomi e testi, non identificativi).
  const mio = p.obiettivi[id]!;
  const ammessi = new Set(p.fase.nome === "SCELTA_OBIETTIVI" ? mio.proposti : mio.scelto ? [mio.scelto] : []);
  for (const oid of idObiettivi(JSON.stringify(v))) expect(ammessi.has(oid), `obiettivo ${oid} nella vista di ${id}`).toBe(true);
  if (p.fase.nome !== "SCELTA_OBIETTIVI") expect(v.obiettivo.proposte).toBeUndefined();
  if (!fine) expect(v.obiettivi, `obiettivi altrui visibili a ${id} prima del punteggio`).toBeUndefined();
}

function controllaVistaTV(p: Partita): void {
  const v = vistaTV(p, ambiente);
  const fine = FASI_FINE.has(p.fase.nome);
  const chiavi = chiaviPresenti({ ...v, letturaMessaggi: undefined });
  for (const k of [...CHIAVI_VIETATE, "io", "mieiSegreti", "mieiMessaggi", "mieiEffetti", "mieiVoti", "alleati"]) {
    expect(chiavi.has(k), `chiave vietata "${k}" nella vista TV`).toBe(false);
  }
  for (const g of v.giocatori) {
    const stato = p.giocatori.find((x) => x.id === g.id)!.stato;
    if (g.fazione) expect(stato === "LICENZIATO" || fine).toBe(true);
  }
  if (!["LETTURA_MESSAGGI", "FINE"].includes(p.fase.nome)) expect(v.letturaMessaggi).toBeUndefined();
  // Obiettivi: la TV non vede mai un identificativo né le proposte scartate; l'obiettivo scelto di
  // ognuno compare solo dal punteggio in poi (D-047).
  expect(idObiettivi(JSON.stringify(v)).size).toBe(0);
  for (const k of ["obiettivo", "proposte"]) expect(chiavi.has(k), `chiave vietata "${k}" nella vista TV`).toBe(false);
  if (!fine) expect(v.obiettivi).toBeUndefined();
  else {
    for (const [gid, o] of Object.entries(v.obiettivi ?? {})) {
      const scelto = ambiente.obiettivi.find((x) => x.id === p.obiettivi[gid]!.scelto)!;
      expect(o!.nome).toBe(scelto.nome);
      expect(o!.tipo).toBe(scelto.tipo);
    }
  }
}

function controllaEventi(p: Partita, eventi: Evento[]): void {
  const destinatari: Destinatario[] = [{ tipo: "TV" }, ...p.giocatori.map((g) => ({ tipo: "GIOCATORE" as const, id: g.id }))];
  for (const d of destinatari) {
    for (const e of eventiPer(eventi, d)) {
      if (e.riservatoA) expect(d.tipo === "GIOCATORE" && e.riservatoA.includes(d.id)).toBe(true);
      // Gli eventi di registrazione dicono chi ha agito, mai cosa.
      if (e.tipo === "VOTO_REGISTRATO" || e.tipo === "MOSSA_REGISTRATA" || e.tipo === "RISPOSTA_REGISTRATA" || e.tipo === "VOTO_PERSONALE_REGISTRATO" || e.tipo === "OBIETTIVO_REGISTRATO") {
        expect(Object.keys(e).sort()).toEqual(["causa", "da", ...(e.tipo === "VOTO_REGISTRATO" ? ["propostaId"] : []), "tipo"].sort());
      }
      // L'obiettivo estratto a caso è riservato all'interessato; nessun evento contiene identificativi di obiettivi.
      if (e.tipo === "OBIETTIVO_ASSEGNATO") expect(e.riservatoA).toHaveLength(1);
      expect(idObiettivi(JSON.stringify(e)).size).toBe(0);
      // L'esito delle mosse private non contiene numeri.
      if (e.tipo === "ESITO_MOSSE_PRIVATE") expect(e.causa).not.toMatch(/\d/);
    }
  }
}

describe("riservatezza delle viste (regola 3)", () => {
  for (const n of [4, 5, 6, 7, 8]) {
    it(`partite casuali con ${n} giocatori: nessun dato segreto al dispositivo sbagliato`, () => {
      let passi = 0;
      for (let seme = 0; seme < 12; seme++) {
        const esito = creaPartita(Array.from({ length: n }, (_, i) => ({ id: `g${i + 1}`, nome: `G${i + 1}` })), seme * 7 + n, ambiente);
        if (!esito.ok) throw new Error(esito.errore);
        let p = esito.partita;
        const r = creaCasuale(seme + 1000 * n);
        controllaEventi(p, esito.eventi);
        for (let i = 0; i < 600 && p.fase.nome !== "FINE"; i++) {
          const risultato = applica(p, azioneCasuale(p, r), ambiente);
          if (!risultato.ok) continue;
          p = risultato.partita;
          passi++;
          controllaEventi(p, risultato.eventi);
          controllaVistaTV(p);
          for (const g of p.giocatori) controllaVistaGiocatore(p, g.id);
        }
      }
      expect(passi).toBeGreaterThan(100);
    });
  }

  it("nella lettura finale i messaggi anonimi mostrano il mittente", () => {
    const esito = creaEAvvia(Array.from({ length: 5 }, (_, i) => ({ id: `g${i + 1}`, nome: `G${i + 1}` })), 9, ambiente);
    if (!esito.ok) throw new Error(esito.errore);
    let p = applica(esito.partita, { tipo: "INVIA_MESSAGGIO", da: "g1", a: "g2", anonimo: true, modello: "SOLO_TESTO", testo: "chi sono?" }, ambiente);
    if (!p.ok) throw new Error(p.errore);
    expect(vistaGiocatore(p.partita, "g2", ambiente).mieiMessaggi[0]!.da).toBeUndefined();
    let q = p.partita;
    while (q.fase.nome !== "LETTURA_MESSAGGI") {
      const r = applica(q, { tipo: "AVANZA_FASE" }, ambiente);
      if (!r.ok) throw new Error(r.errore);
      q = r.partita;
    }
    expect(vistaTV(q, ambiente).letturaMessaggi![0]).toMatchObject({ da: "g1", anonimo: true, testo: "chi sono?" });
    void p;
  });
});
