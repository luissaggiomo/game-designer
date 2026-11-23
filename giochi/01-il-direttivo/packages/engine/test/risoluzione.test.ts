import { creaEAvvia } from "./aiuti.js";
import { describe, expect, it } from "vitest";
import type { Evento } from "../src/azioni.js";
import { caricaAmbiente, type Ambiente } from "../src/contenuti.js";
import { applica } from "../src/motore.js";
import type { Partita, PropostaIstanza, RepartoId, SceltaMossa } from "../src/tipi.js";

const base = caricaAmbiente();

/** Ambiente senza casualità nei risultati, per controllare i conti esatti. */
function ambienteFisso(): Ambiente {
  return {
    ...base,
    config: {
      ...base.config,
      mossaPrivata: { ...base.config.mossaPrivata, rumore: [0] },
      concorrenti: { ...base.config.concorrenti, eventoCasuale: [0], crescitaMediaProposteESegreti: 1, quotaAziendalistaRiferimento: 0.5 },
    },
  };
}

function inMossaPrivata(n: number, amb: Ambiente): Partita {
  const esito = creaEAvvia(Array.from({ length: n }, (_, i) => ({ id: `g${i + 1}`, nome: `G${i + 1}` })), 5, amb);
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

const esitoMosse = (eventi: Evento[]) => eventi.find((e) => e.tipo === "ESITO_MOSSE_PRIVATE");

describe("mossa privata (GDD §9)", () => {
  const amb = ambienteFisso();

  it("tutti per l'azienda: +1 a testa per l'azienda, nessun punto di reparto", () => {
    const p = scegli(inMossaPrivata(5, amb), amb, { ACQUISTI: "AZIENDA", PRODUZIONE: "AZIENDA", VENDITE: "AZIENDA", MARKETING: "AZIENDA", FINANZA: "AZIENDA" });
    const { partita, eventi } = risolvi(p, amb);
    expect(esitoMosse(eventi)).toMatchObject({ perAzienda: 5, partecipanti: 5 });
    expect(partita.azienda.quota).toBe(5);
    expect(partita.giocatori.every((g) => g.puntiReparto === 0)).toBe(true);
  });

  it("tutti per il reparto: +1 a testa al reparto, −1 a testa all'azienda", () => {
    const p = scegli(inMossaPrivata(5, amb), amb, { ACQUISTI: "REPARTO", PRODUZIONE: "REPARTO", VENDITE: "REPARTO", MARKETING: "REPARTO", FINANZA: "REPARTO" });
    const { partita, eventi } = risolvi(p, amb);
    expect(esitoMosse(eventi)).toMatchObject({ perAzienda: 0, partecipanti: 5 });
    expect(partita.azienda.quota).toBe(-5);
    expect(partita.giocatori.every((g) => g.puntiReparto === 1)).toBe(true);
  });

  it("chi non sceglie in tempo gioca per l'azienda (scelta predefinita)", () => {
    const { partita } = risolvi(inMossaPrivata(5, amb), amb);
    expect(partita.azienda.quota).toBe(5);
  });

  it("la TV vede quanti hanno giocato per l'azienda, mai chi (D-061)", () => {
    const p = scegli(inMossaPrivata(5, amb), amb, { ACQUISTI: "REPARTO", PRODUZIONE: "REPARTO" });
    const evento = esitoMosse(risolvi(p, amb).eventi);
    expect(evento?.causa).toBe("Mossa privata: 3 su 5 hanno giocato per l'azienda.");
    for (const g of p.giocatori) expect(evento?.causa).not.toContain(g.nome);
  });

  it("nel 4° trimestre il conteggio si annuncia subito, i numeri del mercato no (D-029, D-061)", () => {
    const p = scegli(inMossaPrivata(5, amb), amb, { ACQUISTI: "REPARTO" });
    p.trimestre = 4;
    const { partita, eventi } = risolvi(p, amb);
    expect(esitoMosse(eventi)?.causa).toContain("4 su 5");
    expect(eventi.some((e) => e.tipo === "CORSA_DI_MERCATO")).toBe(false);
    expect(partita.risultatiRinviati?.eventi.some((e) => e.tipo === "ESITO_MOSSE_PRIVATE")).toBe(false);
  });

  it("l'evento di registrazione dice chi ha scelto, non cosa", () => {
    const p = inMossaPrivata(5, amb);
    const esito = applica(p, { tipo: "MOSSA_PRIVATA", da: idDi(p, "VENDITE"), scelta: "REPARTO" }, amb);
    expect(esito.ok && JSON.stringify(esito.eventi)).not.toContain("REPARTO");
  });

  it("il licenziato non fa la mossa privata; fuori fase è rifiutata", () => {
    const p = inMossaPrivata(5, amb);
    p.giocatori.find((g) => g.repartoId === "MARKETING")!.stato = "LICENZIATO";
    expect(applica(p, { tipo: "MOSSA_PRIVATA", da: idDi(p, "MARKETING"), scelta: "AZIENDA" }, amb).ok).toBe(false);
    p.fase = { nome: "RISOLUZIONE" };
    expect(applica(p, { tipo: "MOSSA_PRIVATA", da: idDi(p, "VENDITE"), scelta: "AZIENDA" }, amb).ok).toBe(false);
  });

  it("i reparti vacanti non fanno la mossa privata (D-020)", () => {
    // 4 giocatori (4 reparti vacanti): contano solo le 4 mosse "azienda" predefinite.
    const { partita, eventi } = risolvi(inMossaPrivata(4, amb), amb);
    expect(partita.azienda.quota).toBe(4);
    expect(esitoMosse(eventi)).toMatchObject({ perAzienda: 4, partecipanti: 4 });
  });
});

describe("effetti delle proposte approvate (GDD §8.2, §14)", () => {
  const amb = ambienteFisso();
  const approvata = (effetti: PropostaIstanza["effettiPrivati"], effettoAzienda: number, approvataSi = true): PropostaIstanza => ({
    id: "p", modelloId: "p", titolo: "Prova", categoria: "X", costo: 10, spiegazione: "Spiegazione di prova",
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
    expect(eventi.find((e) => e.tipo === "EFFETTO_PROPOSTA")?.causa).toContain("Spiegazione di prova"); // D-033
  });

  it("le proposte respinte non hanno effetti", () => {
    const p = inMossaPrivata(5, amb);
    p.proposteTrimestre = [approvata({ VENDITE: { punti: 3, testo: "" } }, 2, false)];
    const { partita } = risolvi(p, amb);
    expect(punti(partita, "VENDITE")).toBe(0);
    expect(partita.azienda.quota).toBe(5);
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
