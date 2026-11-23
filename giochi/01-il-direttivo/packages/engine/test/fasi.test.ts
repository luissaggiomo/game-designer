import { creaEAvvia } from "./aiuti.js";
import { describe, expect, it } from "vitest";
import { caricaAmbiente } from "../src/contenuti.js";
import { applica } from "../src/motore.js";
import type { Partita } from "../src/tipi.js";

const ambiente = caricaAmbiente();
const config = ambiente.config;

function nuova(): Partita {
  const esito = creaEAvvia(
    Array.from({ length: 5 }, (_, i) => ({ id: `g${i + 1}`, nome: `G${i + 1}` })),
    2026,
    ambiente,
  );
  if (!esito.ok) throw new Error(esito.errore);
  return esito.partita;
}

/** Fa avanzare la partita fino alla fine e restituisce l'elenco delle fasi attraversate. */
function giocaFinoAllaFine(p: Partita): { fasi: string[]; finale: Partita } {
  const fasi = [`${p.trimestre}:${p.fase.nome}`];
  let attuale = p;
  for (let passi = 0; passi < 200; passi++) {
    const esito = applica(attuale, { tipo: "AVANZA_FASE" }, ambiente);
    if (!esito.ok) break;
    attuale = esito.partita;
    const extra = "votazione" in attuale.fase ? `#${attuale.fase.votazione}` : "";
    fasi.push(`${attuale.trimestre}:${attuale.fase.nome}${extra}`);
  }
  return { fasi, finale: attuale };
}

describe("macchina a stati delle fasi", () => {
  it("trimestre 1: rapporto, 2 cicli discussione → voto, mossa privata, risultati, demansionamento", () => {
    const { fasi } = giocaFinoAllaFine(nuova());
    expect(fasi.slice(0, 9)).toEqual([
      "1:RAPPORTO",
      "1:DISCUSSIONE#1",
      "1:VOTAZIONE#1",
      "1:DISCUSSIONE#2",
      "1:VOTAZIONE#2",
      "1:MOSSA_PRIVATA",
      "1:RISOLUZIONE",
      "1:DEMANSIONAMENTO",
      "2:RAPPORTO",
    ]);
  });

  it("votazioni per trimestre secondo la scaletta 2-3-3-2 (D-014)", () => {
    const { fasi } = giocaFinoAllaFine(nuova());
    const votiPerTrimestre = [1, 2, 3, 4].map((t) => fasi.filter((f) => f.startsWith(`${t}:VOTAZIONE`)).length);
    expect(votiPerTrimestre).toEqual(config.votazioniPerTrimestre);
  });

  it("ogni votazione è preceduta dalla sua discussione (D-008)", () => {
    const { fasi } = giocaFinoAllaFine(nuova());
    fasi.forEach((f, i) => {
      if (f.includes("VOTAZIONE")) expect(fasi[i - 1]).toBe(f.replace("VOTAZIONE", "DISCUSSIONE"));
    });
  });

  it("dopo il 4° trimestre: finale, punteggio, lettura dei messaggi, fine", () => {
    const { fasi, finale } = giocaFinoAllaFine(nuova());
    // Nessun demansionato: niente decisioni finali (D-028), si passa subito alla verifica;
    // nessuno risponde → tutti "sì" (D-029) → niente nomina.
    expect(fasi.slice(-5)).toEqual([
      "4:DEMANSIONAMENTO",
      "4:VERIFICA",
      "4:PUNTEGGIO",
      "4:LETTURA_MESSAGGI",
      "4:FINE",
    ]);
    expect(finale.fase.nome).toBe("FINE");
  });

  it("a partita finita non si può più avanzare", () => {
    const { finale } = giocaFinoAllaFine(nuova());
    const esito = applica(finale, { tipo: "AVANZA_FASE" }, ambiente);
    expect(esito.ok).toBe(false);
  });

  it("il motore non modifica la partita ricevuta (funzione pura)", () => {
    const p = nuova();
    const copia = structuredClone(p);
    applica(p, { tipo: "AVANZA_FASE" }, ambiente);
    expect(p).toEqual(copia);
  });

  it("ogni cambio di fase produce un evento con una causa leggibile", () => {
    const esito = applica(nuova(), { tipo: "AVANZA_FASE" }, ambiente);
    expect(esito.ok).toBe(true);
    if (esito.ok) {
      expect(esito.eventi[0]?.tipo).toBe("FASE_INIZIATA");
      expect(esito.eventi[0]?.causa).toContain("discussione");
    }
  });

  it("a ogni nuovo trimestre la quota messaggi riparte (2, oppure 1 se demansionato)", () => {
    let p = nuova();
    p.giocatori[0]!.quotaMessaggi = 0;
    p.giocatori[1]!.quotaMessaggi = 0;
    p.giocatori[1]!.stato = "DEMANSIONATO";
    while (!(p.trimestre === 2 && p.fase.nome === "RAPPORTO")) {
      const esito = applica(p, { tipo: "AVANZA_FASE" }, ambiente);
      if (!esito.ok) throw new Error(esito.errore);
      p = esito.partita;
    }
    expect(p.giocatori[0]!.quotaMessaggi).toBe(config.messaggi.perTrimestre);
    expect(p.giocatori[1]!.quotaMessaggi).toBe(config.messaggi.perTrimestreDemansionato);
  });

  it("le azioni dei giocatori non ancora gestite vengono rifiutate senza toccare la partita", () => {
    const p = nuova();
    const esito = applica(p, { tipo: "PROPONI_DEMANSIONAMENTO", da: "g1", bersaglio: "g2" }, ambiente);
    expect(esito.ok).toBe(false);
  });
});
