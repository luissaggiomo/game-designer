import { describe, expect, it } from "vitest";
import type { Evento } from "../src/azioni.js";
import { caricaAmbiente, type Ambiente } from "../src/contenuti.js";
import { applica } from "../src/motore.js";
import { creaPartita } from "../src/partita.js";
import type { Partita, PropostaIstanza, RepartoId, SceltaMossa } from "../src/tipi.js";

const base = caricaAmbiente();

/** Ambiente senza casualità nei risultati, per controllare i conti esatti. */
function ambienteFisso(modifiche: { autogestione?: Partial<Ambiente["config"]["autogestione"]> } = {}): Ambiente {
  return {
    ...base,
    config: {
      ...base.config,
      mossaPrivata: { ...base.config.mossaPrivata, rumore: [0] },
      concorrenti: { ...base.config.concorrenti, eventoCasuale: [0] },
      autogestione: { ...base.config.autogestione, partecipaMossaPrivata: false, ...modifiche.autogestione },
    },
  };
}

function inMossaPrivata(n: number, amb: Ambiente): Partita {
  const esito = creaPartita(Array.from({ length: n }, (_, i) => ({ id: `g${i + 1}`, nome: `G${i + 1}` })), 5, amb);
  if (!esito.ok) throw new Error(esito.errore);
  const p = esito.partita;
  p.proposteTrimestre = [];
  p.fase = { nome: "MOSSA_PRIVATA" };
  return p;
}

const idDi = (p: Partita, r: RepartoId) => p.giocatori.find((g) => g.repartoId === r)!.id;
const punti = (p: Partita, r: RepartoId) => p.giocatori.find((g) => g.repartoId === r)!.puntiReparto;

function scegli(p: Partita, amb: Ambiente, scelte: Partial<Record<RepartoId, SceltaMossa>>): Partita {
  let attuale = p;
  for (const [r, scelta] of Object.entries(scelte) as [RepartoId, SceltaMossa][]) {
    const esito = applica(attuale, { tipo: "MOSSA_PRIVATA", da: idDi(attuale, r), scelta }, amb);
    if (!esito.ok) throw new Error(esito.errore);
    attuale = esito.partita;
  }
  return attuale;
}

function risolvi(p: Partita, amb: Ambiente): { partita: Partita; eventi: Evento[] } {
  const esito = applica(p, { tipo: "AVANZA_FASE" }, amb);
  if (!esito.ok) throw new Error(esito.errore);
  return { partita: esito.partita, eventi: esito.eventi };
}

const andamento = (eventi: Evento[]) => eventi.find((e) => e.tipo === "ESITO_MOSSE_PRIVATE");

describe("mossa privata (GDD §9)", () => {
  const amb = ambienteFisso();

  it("tutti per l'azienda: azienda in crescita, nessun punto di reparto", () => {
    const p = scegli(inMossaPrivata(5, amb), amb, { ACQUISTI: "AZIENDA", PRODUZIONE: "AZIENDA", VENDITE: "AZIENDA", MARKETING: "AZIENDA", FINANZA: "AZIENDA" });
    const { partita, eventi } = risolvi(p, amb);
    expect(andamento(eventi)).toMatchObject({ andamento: "IN_CRESCITA" });
    expect(partita.azienda.quota).toBe(5);
    expect(partita.giocatori.every((g) => g.puntiReparto === 0)).toBe(true);
  });

  it("tutti per il reparto: +1 a testa, azienda in calo", () => {
    const p = scegli(inMossaPrivata(5, amb), amb, { ACQUISTI: "REPARTO", PRODUZIONE: "REPARTO", VENDITE: "REPARTO", MARKETING: "REPARTO", FINANZA: "REPARTO" });
    const { partita, eventi } = risolvi(p, amb);
    expect(andamento(eventi)).toMatchObject({ andamento: "IN_CALO" });
    expect(partita.azienda.quota).toBe(-5);
    expect(partita.giocatori.every((g) => g.puntiReparto === 1)).toBe(true);
  });

  it("chi non sceglie in tempo gioca per l'azienda (scelta predefinita)", () => {
    const { partita } = risolvi(inMossaPrivata(5, amb), amb);
    expect(partita.azienda.quota).toBe(5);
  });

  it("la TV vede solo l'andamento, mai un numero", () => {
    const p = scegli(inMossaPrivata(5, amb), amb, { ACQUISTI: "REPARTO", PRODUZIONE: "REPARTO" });
    const evento = andamento(risolvi(p, amb).eventi);
    expect(evento?.causa).not.toMatch(/\d/);
  });

  it("l'evento di registrazione dice chi ha scelto, non cosa", () => {
    const p = inMossaPrivata(5, amb);
    const esito = applica(p, { tipo: "MOSSA_PRIVATA", da: idDi(p, "VENDITE"), scelta: "REPARTO" }, amb);
    expect(esito.ok && JSON.stringify(esito.eventi)).not.toContain("REPARTO");
  });

  it("il demansionato non fa la mossa privata; fuori fase è rifiutata", () => {
    const p = inMossaPrivata(5, amb);
    p.giocatori.find((g) => g.repartoId === "MARKETING")!.stato = "DEMANSIONATO";
    expect(applica(p, { tipo: "MOSSA_PRIVATA", da: idDi(p, "MARKETING"), scelta: "AZIENDA" }, amb).ok).toBe(false);
    p.fase = { nome: "RISOLUZIONE" };
    expect(applica(p, { tipo: "MOSSA_PRIVATA", da: idDi(p, "VENDITE"), scelta: "AZIENDA" }, amb).ok).toBe(false);
  });

  it("i reparti in autogestione partecipano se previsto (punto aperto 28)", () => {
    const conAutogestione = ambienteFisso({ autogestione: { partecipaMossaPrivata: true, probabilitaMossaAzienda: 1 } });
    // 4 giocatori → 4 reparti vacanti, che giocano tutti per l'azienda.
    const { partita } = risolvi(inMossaPrivata(4, conAutogestione), conAutogestione);
    expect(partita.azienda.quota).toBe(4 + 4);
  });
});

describe("effetti delle proposte approvate (GDD §8.2, §14)", () => {
  const amb = ambienteFisso();
  const approvata = (effetti: PropostaIstanza["effettiPrivati"], effettoAzienda: number, approvataSi = true): PropostaIstanza => ({
    id: "p", modelloId: "p", titolo: "Prova", categoria: "X", costo: 10, astensioneAmmessa: false,
    pesi: {}, effettiPrivati: effetti, effettoAzienda, voti: {},
    esito: { approvata: approvataSi, si: 0, soglia: 0, votiPerTempoScaduto: 0, motivo: "" },
  });

  it("punti ai reparti e effetto reale sull'azienda, con evento leggibile", () => {
    const p = inMossaPrivata(5, amb);
    p.proposteTrimestre = [approvata({ VENDITE: { punti: 3, testo: "" }, PRODUZIONE: { punti: -2, testo: "" } }, 2)];
    const { partita, eventi } = risolvi(p, amb);
    expect(punti(partita, "VENDITE")).toBe(3);
    expect(punti(partita, "PRODUZIONE")).toBe(-2);
    expect(partita.azienda.quota).toBe(5 + 2); // 5 dalle mosse predefinite "azienda"
    expect(eventi.find((e) => e.tipo === "EFFETTO_PROPOSTA")?.causa).toContain("+2");
  });

  it("le proposte respinte non hanno effetti", () => {
    const p = inMossaPrivata(5, amb);
    p.proposteTrimestre = [approvata({ VENDITE: { punti: 3, testo: "" } }, 2, false)];
    const { partita } = risolvi(p, amb);
    expect(punti(partita, "VENDITE")).toBe(0);
    expect(partita.azienda.quota).toBe(5);
  });

  it("reparto in autogestione: effetti ridotti, 'rende poco ma non fa disastri'", () => {
    const p = inMossaPrivata(5, amb);
    p.giocatori.find((g) => g.repartoId === "VENDITE")!.stato = "DEMANSIONATO";
    p.giocatori.find((g) => g.repartoId === "PRODUZIONE")!.stato = "DEMANSIONATO";
    p.reparti.find((r) => r.id === "VENDITE")!.autogestione = true;
    p.reparti.find((r) => r.id === "PRODUZIONE")!.autogestione = true;
    p.proposteTrimestre = [approvata({ VENDITE: { punti: 3, testo: "" }, PRODUZIONE: { punti: -3, testo: "" } }, 0)];
    const { partita } = risolvi(p, amb);
    expect(punti(partita, "VENDITE")).toBe(1); // 3 × 0,5 = 1,5 → 1
    expect(punti(partita, "PRODUZIONE")).toBe(-1); // −3 × 0,5 = −1,5 → −1
  });

  it("i punti di reparto non compaiono negli eventi pubblici", () => {
    const p = inMossaPrivata(5, amb);
    p.proposteTrimestre = [approvata({ VENDITE: { punti: 7, testo: "segreto di vendite" } }, 1)];
    const { eventi } = risolvi(p, amb);
    expect(JSON.stringify(eventi)).not.toContain("segreto di vendite");
    expect(JSON.stringify(eventi)).not.toContain("puntiReparto");
  });
});

describe("concorrenti e corsa di mercato (segnaposto, punto aperto 4)", () => {
  it("ogni trimestre i concorrenti avanzano e la TV mostra la corsa aggiornata", () => {
    const amb = ambienteFisso();
    const { partita, eventi } = risolvi(inMossaPrivata(8, amb), amb);
    expect(partita.concorrenti.map((c) => c.quota)).toEqual([1, 1]);
    const corsa = eventi.find((e) => e.tipo === "CORSA_DI_MERCATO");
    expect(corsa?.causa).toContain("Concorrente A");
  });
});
