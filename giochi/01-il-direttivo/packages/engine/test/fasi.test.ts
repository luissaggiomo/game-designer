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
    fasi.push(`${attuale.trimestre}:${attuale.fase.nome}`);
  }
  return { fasi, finale: attuale };
}

describe("macchina a stati delle fasi", () => {
  it("trimestre 1: rapporto, discussione, voto del pacchetto, secondo voto (nessuno ha votato), mossa privata, risultati (D-068)", () => {
    const { fasi } = giocaFinoAllaFine(nuova());
    expect(fasi.slice(0, 7)).toEqual([
      "1:RAPPORTO",
      "1:DISCUSSIONE",
      "1:VOTO_PACCHETTO",
      "1:SECONDO_VOTO",
      "1:MOSSA_PRIVATA",
      "1:RISOLUZIONE",
      "2:RAPPORTO",
    ]);
  });

  it("ogni trimestre ha una sola discussione e un solo voto del pacchetto (D-068)", () => {
    const { fasi } = giocaFinoAllaFine(nuova());
    for (const t of [1, 2, 3, 4]) {
      expect(fasi.filter((f) => f === `${t}:DISCUSSIONE`)).toHaveLength(1);
      expect(fasi.filter((f) => f === `${t}:VOTO_PACCHETTO`)).toHaveLength(1);
      expect(fasi[fasi.indexOf(`${t}:VOTO_PACCHETTO`) - 1]).toBe(`${t}:DISCUSSIONE`);
    }
  });

  it("dopo il 4° trimestre: finale, punteggio, lettura dei messaggi, fine", () => {
    const { fasi, finale } = giocaFinoAllaFine(nuova());
    // Dopo i risultati del 4° trimestre: la domanda "C'è una spia?"; nessuno risponde → "No" (D-058)
    // → niente nomi, si passa al punteggio.
    expect(fasi.slice(-5)).toEqual([
      "4:RISOLUZIONE",
      "4:DOMANDA",
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

  it("a ogni nuovo trimestre la quota messaggi riparte", () => {
    let p = nuova();
    p.giocatori[0]!.quotaMessaggi = 0;
    p.giocatori[1]!.quotaMessaggi = 0;
    while (!(p.trimestre === 2 && p.fase.nome === "RAPPORTO")) {
      const esito = applica(p, { tipo: "AVANZA_FASE" }, ambiente);
      if (!esito.ok) throw new Error(esito.errore);
      p = esito.partita;
    }
    expect(p.giocatori[0]!.quotaMessaggi).toBe(config.messaggi.perTrimestre);
    expect(p.giocatori[1]!.quotaMessaggi).toBe(config.messaggi.perTrimestre);
  });

  it("le azioni fuori fase vengono rifiutate senza toccare la partita", () => {
    const p = nuova();
    const esito = applica(p, { tipo: "NOMINA_SPIA", da: "g1", bersaglio: "g2" }, ambiente);
    expect(esito.ok).toBe(false);
  });
});
