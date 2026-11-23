import { creaEAvvia } from "./aiuti.js";
import { describe, expect, it } from "vitest";
import { caricaAmbiente } from "../src/contenuti.js";
import { applica } from "../src/motore.js";
import type { Partita, PropostaIstanza, RepartoId, Voto } from "../src/tipi.js";

const ambiente = caricaAmbiente();

/** Partita a 5 giocatori (4 base + Finanza) ferma sulla votazione 1 di una proposta costruita apposta. */
function inVotazione(proposta: Partial<PropostaIstanza> = {}): Partita {
  const esito = creaEAvvia(
    Array.from({ length: 5 }, (_, i) => ({ id: `g${i + 1}`, nome: `G${i + 1}` })),
    11,
    ambiente,
  );
  if (!esito.ok) throw new Error(esito.errore);
  const p = esito.partita;
  p.proposteTrimestre = [
    {
      id: "prova",
      modelloId: "prova",
      titolo: "Proposta di prova",
      categoria: "INVESTIMENTI",
      costo: 40,
      astensioneAmmessa: false,
      spiegazione: "Spiegazione di prova",
      pesi: { PRODUZIONE: 2, FINANZA: 2, ACQUISTI: 1, VENDITE: 1, MARKETING: 2 }, // totale 8 → soglia 5
      effettiPrivati: {},
      effettoAzienda: 1,
      voti: {},
      ...proposta,
    },
  ];
  p.fase = { nome: "VOTAZIONE", votazione: 1 };
  return p;
}

const idDi = (p: Partita, r: RepartoId) => p.giocatori.find((g) => g.repartoId === r)!.id;

function vota(p: Partita, voti: Partial<Record<RepartoId, Voto>>): Partita {
  let attuale = p;
  for (const [reparto, voto] of Object.entries(voti) as [RepartoId, Voto][]) {
    const esito = applica(attuale, { tipo: "VOTA", da: idDi(attuale, reparto), voto }, ambiente);
    if (!esito.ok) throw new Error(esito.errore);
    attuale = esito.partita;
  }
  return attuale;
}

function chiudi(p: Partita) {
  const esito = applica(p, { tipo: "AVANZA_FASE" }, ambiente);
  if (!esito.ok) throw new Error(esito.errore);
  return { partita: esito.partita, proposta: esito.partita.proposteTrimestre[0]!, eventi: esito.eventi };
}

describe("votazione pesata — caso normale", () => {
  it("tutti sì → approvata, e la cassa paga il costo", () => {
    const { partita, proposta } = chiudi(vota(inVotazione(), { PRODUZIONE: "SI", FINANZA: "SI", ACQUISTI: "SI", VENDITE: "SI", MARKETING: "SI" }));
    expect(proposta.esito?.approvata).toBe(true);
    expect(partita.azienda.cassa).toBe(100 - 40);
  });

  it("4 sì su peso 8 = pareggio → respinta, la cassa non cambia", () => {
    const { partita, proposta } = chiudi(vota(inVotazione(), { PRODUZIONE: "SI", FINANZA: "SI", ACQUISTI: "NO", VENDITE: "NO", MARKETING: "NO" }));
    expect(proposta.esito).toMatchObject({ approvata: false, si: 4, soglia: 5 });
    expect(partita.azienda.cassa).toBe(100);
  });

  it("5 sì su peso 8 → approvata", () => {
    const { proposta } = chiudi(vota(inVotazione(), { PRODUZIONE: "SI", FINANZA: "SI", ACQUISTI: "SI" }));
    expect(proposta.esito).toMatchObject({ approvata: true, si: 5, soglia: 5 });
  });

  it("chi non vota in tempo vale 'no' e la TV lo dice (D-007)", () => {
    const { proposta, eventi } = chiudi(inVotazione());
    expect(proposta.esito).toMatchObject({ approvata: false, si: 0, votiPerTempoScaduto: 5 });
    const chiusura = eventi.find((e) => e.tipo === "VOTAZIONE_CHIUSA");
    expect(chiusura?.causa).toContain("tempo scaduto");
  });

  it("l'ultimo voto prima della chiusura sostituisce il precedente", () => {
    let p = vota(inVotazione(), { PRODUZIONE: "SI" });
    p = vota(p, { PRODUZIONE: "NO" });
    expect(p.proposteTrimestre[0]!.voti[idDi(p, "PRODUZIONE")]).toBe("NO");
  });

  it("senza fondi la proposta è respinta anche con tutti i sì, e il motivo è spiegato", () => {
    const { proposta } = chiudi(
      vota(inVotazione({ costo: 200 }), { PRODUZIONE: "SI", FINANZA: "SI", ACQUISTI: "SI", VENDITE: "SI", MARKETING: "SI" }),
    );
    expect(proposta.esito?.approvata).toBe(false);
    expect(proposta.esito?.motivo).toContain("mancanza di fondi");
  });
});

describe("votazione pesata — demansionati, pesi 0, permessi", () => {
  const conMarketingDemansionato = () => {
    const p = inVotazione();
    p.giocatori.find((g) => g.repartoId === "MARKETING")!.stato = "DEMANSIONATO";
    return p;
  };

  it("il peso del demansionato resta nella soglia: servono ancora 5 sì su 6 disponibili (§8.4)", () => {
    const { proposta } = chiudi(vota(conMarketingDemansionato(), { PRODUZIONE: "SI", FINANZA: "SI", ACQUISTI: "NO", VENDITE: "NO" }));
    expect(proposta.esito).toMatchObject({ approvata: false, si: 4, soglia: 5 });
  });

  it("il demansionato non può votare", () => {
    const p = conMarketingDemansionato();
    const esito = applica(p, { tipo: "VOTA", da: idDi(p, "MARKETING"), voto: "SI" }, ambiente);
    expect(esito.ok).toBe(false);
  });

  it("chi ha peso 0 non può votare (può solo parlare)", () => {
    const p = inVotazione({ pesi: { PRODUZIONE: 2, FINANZA: 2, ACQUISTI: 1, VENDITE: 1 } });
    const esito = applica(p, { tipo: "VOTA", da: idDi(p, "MARKETING"), voto: "SI" }, ambiente);
    expect(esito.ok).toBe(false);
  });

  it("l'astensione è rifiutata nei quesiti normali", () => {
    const p = inVotazione();
    const esito = applica(p, { tipo: "VOTA", da: idDi(p, "PRODUZIONE"), voto: "ASTENUTO" }, ambiente);
    expect(esito.ok).toBe(false);
  });

  it("non si vota fuori dalla fase di votazione", () => {
    const p = inVotazione();
    p.fase = { nome: "DISCUSSIONE", votazione: 1 };
    const esito = applica(p, { tipo: "VOTA", da: idDi(p, "PRODUZIONE"), voto: "SI" }, ambiente);
    expect(esito.ok).toBe(false);
  });
});

describe("quesiti con astensione vera (D-007, D-013)", () => {
  const conAstensione = () =>
    inVotazione({ astensioneAmmessa: true, pesi: { PRODUZIONE: 1, FINANZA: 1, ACQUISTI: 1, VENDITE: 1, MARKETING: 1 } });

  it("la soglia si calcola solo su chi vota: 2 sì, 1 no, 2 astenuti → approvata", () => {
    const { proposta } = chiudi(vota(conAstensione(), { PRODUZIONE: "SI", FINANZA: "SI", ACQUISTI: "NO", VENDITE: "ASTENUTO", MARKETING: "ASTENUTO" }));
    expect(proposta.esito).toMatchObject({ approvata: true, si: 2, soglia: 2 });
  });

  it("il demansionato conta come un 'no' fisso: 2 sì, 1 no, 1 astenuto + 1 demansionato → respinta", () => {
    const p = conAstensione();
    p.giocatori.find((g) => g.repartoId === "MARKETING")!.stato = "DEMANSIONATO";
    const { proposta } = chiudi(vota(p, { PRODUZIONE: "SI", FINANZA: "SI", ACQUISTI: "NO", VENDITE: "ASTENUTO" }));
    expect(proposta.esito).toMatchObject({ approvata: false, si: 2, soglia: 3 });
  });

  it("qui il tempo scaduto vale astensione (D-029, rivede D-013)", () => {
    const { proposta } = chiudi(vota(conAstensione(), { PRODUZIONE: "SI", FINANZA: "SI" }));
    // 3 astenuti per tempo scaduto: base 2 → soglia 2, 2 sì → approvata
    expect(proposta.esito).toMatchObject({ approvata: true, si: 2, soglia: 2, votiPerTempoScaduto: 3 });
  });
});
