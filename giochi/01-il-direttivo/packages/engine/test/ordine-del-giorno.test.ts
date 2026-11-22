import { describe, expect, it } from "vitest";
import { caricaAmbiente, type Ambiente, type ModelloProposta } from "../src/contenuti.js";
import { applica } from "../src/motore.js";
import { creaPartita } from "../src/partita.js";
import type { Partita, RepartoId } from "../src/tipi.js";

const ambiente = caricaAmbiente();

function crea(n: number, seme: number, amb: Ambiente = ambiente): Partita {
  const esito = creaPartita(
    Array.from({ length: n }, (_, i) => ({ id: `g${i + 1}`, nome: `G${i + 1}` })),
    seme,
    amb,
  );
  if (!esito.ok) throw new Error(esito.errore);
  return esito.partita;
}

/** Avanza (senza voti: tutti "no" per tempo scaduto) finché la condizione è vera. */
function avanzaFinche(p: Partita, condizione: (p: Partita) => boolean, amb: Ambiente = ambiente): Partita {
  let attuale = p;
  for (let i = 0; i < 300 && condizione(attuale); i++) {
    const esito = applica(attuale, { tipo: "AVANZA_FASE" }, amb);
    if (!esito.ok) break;
    attuale = esito.partita;
  }
  return attuale;
}

const finoAlTrimestre = (t: number) => (p: Partita) => !(p.trimestre === t && p.fase.nome === "RAPPORTO");

describe("cassa (D-018)", () => {
  it("trimestre 1: 100 K", () => {
    expect(crea(5, 1).azienda.cassa).toBe(100);
  });

  it("niente speso nel T1 → T2 con 150 K (tetto), non 200", () => {
    const p = avanzaFinche(crea(5, 1), finoAlTrimestre(2));
    expect(p.azienda.cassa).toBe(150);
  });

  it("60 K spesi nel T1 → T2 con 40 + 100 = 140 K", () => {
    const p = crea(5, 1);
    p.azienda.cassa = 40; // come se nel T1 fossero stati spesi 60 K
    expect(avanzaFinche(p, finoAlTrimestre(2)).azienda.cassa).toBe(140);
  });
});

describe("ordine del giorno (D-006, D-008, D-014)", () => {
  it("ogni trimestre il numero di quesiti previsto dalla scaletta, annunciato nel Rapporto", () => {
    let p = crea(5, 3);
    for (let t = 1; t <= 4; t++) {
      p = avanzaFinche(p, finoAlTrimestre(t));
      expect(p.proposteTrimestre.length).toBe(ambiente.config.votazioniPerTrimestre[t - 1]);
    }
  });

  it("nessun quesito si ripete nella stessa partita", () => {
    for (let seme = 0; seme < 50; seme++) {
      const fine = avanzaFinche(crea(5, seme), (p) => p.fase.nome !== "FINE");
      expect(new Set(fine.proposteUscite).size).toBe(fine.proposteUscite.length);
    }
  });

  it("con 4 giocatori: mai quesiti che riguardano reparti vacanti, mai pesi ai vacanti", () => {
    for (let seme = 0; seme < 100; seme++) {
      let p = crea(4, seme);
      const occupati = new Set(p.reparti.filter((r) => r.occupatoDa).map((r) => r.id));
      for (let t = 1; t <= 4; t++) {
        p = avanzaFinche(p, finoAlTrimestre(t));
        for (const q of p.proposteTrimestre) {
          const modello = ambiente.mazzo.find((m) => m.id === q.modelloId)!;
          for (const r of modello.riguarda) expect(occupati.has(r)).toBe(true);
          for (const r of Object.keys(q.pesi)) expect(occupati.has(r as RepartoId)).toBe(true);
        }
      }
    }
  });

  it("un reparto demansionato: dal trimestre dopo nessun quesito lo riguarda", () => {
    for (let seme = 0; seme < 50; seme++) {
      let p = crea(5, seme);
      p.giocatori.find((g) => g.repartoId === "PRODUZIONE")!.stato = "DEMANSIONATO";
      p.reparti.find((r) => r.id === "PRODUZIONE")!.autogestione = true;
      p = avanzaFinche(p, finoAlTrimestre(2));
      for (const q of p.proposteTrimestre) {
        expect(ambiente.mazzo.find((m) => m.id === q.modelloId)!.riguarda).not.toContain("PRODUZIONE");
      }
    }
  });

  it("i quesiti con vacanti pesanti escono raramente (D-006)", () => {
    // Mazzo di prova: 10 quesiti solo reparti base e 10 con molto peso su reparti vacanti a 4 giocatori.
    const base = (i: number): ModelloProposta => ({
      id: `base-${i}`, titolo: `Base ${i}`, categoria: "X", costo: 10, riguarda: [], trimestri: [1, 2, 3, 4],
      pesi: { ACQUISTI: 1, PRODUZIONE: 1, VENDITE: 1, MARKETING: 1 }, effettiPrivati: {}, effettoAzienda: { base: 0 },
    });
    const pesante = (i: number): ModelloProposta => ({
      ...base(i), id: `pesante-${i}`, titolo: `Pesante ${i}`,
      pesi: { ACQUISTI: 1, PRODUZIONE: 1, FINANZA: 2, RICERCA_SVILUPPO: 2 },
    });
    const amb: Ambiente = { ...ambiente, mazzo: [...Array.from({ length: 10 }, (_, i) => base(i)), ...Array.from({ length: 10 }, (_, i) => pesante(i))] };
    let pesanti = 0;
    let totale = 0;
    for (let seme = 0; seme < 300; seme++) {
      for (const q of crea(4, seme, amb).proposteTrimestre) {
        totale++;
        if (q.modelloId.startsWith("pesante")) pesanti++;
      }
    }
    expect(pesanti / totale).toBeLessThan(0.2); // senza regola sarebbe circa 0,5
  });

  it("il bilanciamento dei favoriti riduce lo squilibrio tra reparti (D-014)", () => {
    const squilibrioMedio = (amb: Ambiente) => {
      let somma = 0;
      for (let seme = 0; seme < 200; seme++) {
        const fine = avanzaFinche(crea(5, seme, amb), (p) => p.fase.nome !== "FINE", amb);
        const occupati = fine.reparti.filter((r) => r.occupatoDa).map((r) => r.id);
        const conteggi = occupati.map((r) => fine.conteggioFavoriti[r] ?? 0);
        somma += Math.max(...conteggi) - Math.min(...conteggi);
      }
      return somma / 200;
    };
    const senzaBilanciamento: Ambiente = {
      ...ambiente,
      config: { ...ambiente.config, selezione: { ...ambiente.config.selezione, fattoreFavoritoInEccesso: 1 } },
    };
    expect(squilibrioMedio(ambiente)).toBeLessThan(squilibrioMedio(senzaBilanciamento));
  });

  it("stesso seme → stessa partita intera (estrazioni comprese)", () => {
    const a = avanzaFinche(crea(6, 77), (p) => p.fase.nome !== "FINE");
    const b = avanzaFinche(crea(6, 77), (p) => p.fase.nome !== "FINE");
    expect(a).toEqual(b);
  });
});

describe("controllo dei contenuti", () => {
  it("il mazzo e i pesi predefiniti sono validi", () => {
    expect(() => caricaAmbiente()).not.toThrow();
  });
});
