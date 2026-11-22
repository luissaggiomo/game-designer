import { describe, expect, it } from "vitest";
import { caricaAmbiente, type Ambiente } from "../src/contenuti.js";
import { applica } from "../src/motore.js";
import { creaPartita } from "../src/partita.js";
import type { Partita, RepartoId } from "../src/tipi.js";

const ambiente = caricaAmbiente();

function crea(n: number, seme: number, amb: Ambiente = ambiente): Partita {
  const esito = creaPartita(Array.from({ length: n }, (_, i) => ({ id: `g${i + 1}`, nome: `G${i + 1}` })), seme, amb);
  if (!esito.ok) throw new Error(esito.errore);
  return esito.partita;
}

/** Avanza (senza azioni: tutti "no" per tempo scaduto) finché la condizione è vera. */
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
const reparti = (p: Partita) => new Set(p.reparti.filter((r) => r.occupatoDa).map((r) => r.id));

describe("cassa (D-018)", () => {
  it("trimestre 1: 100 K", () => {
    expect(crea(5, 1).azienda.cassa).toBe(100);
  });

  it("niente speso nel T1 → T2 con 150 K (tetto), non 200", () => {
    expect(avanzaFinche(crea(5, 1), finoAlTrimestre(2)).azienda.cassa).toBe(150);
  });

  it("60 K spesi nel T1 → T2 con 40 + 100 = 140 K", () => {
    const p = crea(5, 1);
    p.azienda.cassa = 40;
    expect(avanzaFinche(p, finoAlTrimestre(2)).azienda.cassa).toBe(140);
  });
});

describe("ordine del giorno, modello B (D-008, D-014, D-023)", () => {
  it("ogni trimestre il numero di quesiti previsto dalla scaletta", () => {
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

  it("effetti e pesi solo per i reparti occupati: i vacanti non contano mai (D-006)", () => {
    for (let seme = 0; seme < 60; seme++) {
      let p = crea(4, seme);
      const occupati = reparti(p);
      for (let t = 1; t <= 4; t++) {
        p = avanzaFinche(p, finoAlTrimestre(t));
        for (const q of p.proposteTrimestre) {
          for (const r of Object.keys(q.pesi)) expect(occupati.has(r as RepartoId)).toBe(true);
          for (const r of Object.keys(q.effettiPrivati)) expect(occupati.has(r as RepartoId)).toBe(true);
          // Ogni reparto occupato vede un effetto (anche neutro) sul proprio telefono.
          expect(Object.keys(q.effettiPrivati).length).toBe(occupati.size);
        }
      }
    }
  });

  it("un reparto demansionato non riceve ruoli, ma il suo peso resta (soglia, §8.4)", () => {
    for (let seme = 0; seme < 40; seme++) {
      let p = crea(5, seme);
      p.giocatori.find((g) => g.repartoId === "PRODUZIONE")!.stato = "DEMANSIONATO";
      p.reparti.find((r) => r.id === "PRODUZIONE")!.autogestione = true;
      p = avanzaFinche(p, finoAlTrimestre(2));
      for (const q of p.proposteTrimestre) {
        expect(q.effettiPrivati.PRODUZIONE?.punti ?? 0).toBe(0);
        const schema = ambiente.schemi[ambiente.mazzo.find((m) => m.id === q.modelloId)!.schema]!;
        expect(q.pesi.PRODUZIONE ?? 0).toBe(q.astensioneAmmessa ? 1 : schema.pesoAltri);
      }
    }
  });

  it("gli effetti assegnati sono esattamente quelli dello schema del quesito (versione estratta, D-045)", () => {
    const p = crea(8, 7);
    for (const q of p.proposteTrimestre) {
      const m = ambiente.mazzo.find((x) => x.id === q.modelloId)!;
      const schema = ambiente.schemi[q.spiegazione === m.alternativa?.spiegazione ? m.alternativa.schema : m.schema]!;
      const assegnati = Object.values(q.effettiPrivati).map((e) => e!.punti ?? 0).filter((x) => x !== 0).sort();
      expect(assegnati).toEqual(schema.ruoli.map((r) => r.punti).filter((x) => x !== 0).sort());
      expect(q.effettoAzienda).toBe(schema.effettoAzienda);
    }
  });

  it("uguaglianza tra reparti: a fine partita ogni reparto è stato favorito lo stesso numero di volte (±1)", () => {
    for (const n of [4, 5, 6, 7, 8]) {
      for (let seme = 0; seme < 40; seme++) {
        const fine = avanzaFinche(crea(n, seme), (p) => p.fase.nome !== "FINE");
        const conteggi = [...reparti(fine)].map((r) => fine.conteggioFavoriti[r] ?? 0);
        expect(Math.max(...conteggi) - Math.min(...conteggi), `${n} giocatori, seme ${seme}`).toBeLessThanOrEqual(1);
      }
    }
  });

  it("su molte partite ogni reparto riceve in media gli stessi punti potenziali dai quesiti", () => {
    const somma = new Map<string, number>();
    let partite = 0;
    for (let seme = 0; seme < 300; seme++) {
      let p = crea(6, seme);
      for (let t = 1; t <= 4; t++) {
        p = avanzaFinche(p, finoAlTrimestre(t));
        for (const q of p.proposteTrimestre) for (const [r, e] of Object.entries(q.effettiPrivati)) somma.set(r, (somma.get(r) ?? 0) + (e!.punti ?? 0));
      }
      partite++;
    }
    const medie = [...somma.values()].map((v) => v / partite);
    // Variabilità del caso con 300 partite: circa ±0,25 per reparto; uno squilibrio vero (come col
    // vecchio mazzo segnaposto) darebbe differenze di diversi punti.
    expect(Math.max(...medie) - Math.min(...medie)).toBeLessThan(1.2);
  });

  it("stesso seme → stessa partita intera (estrazioni e ruoli compresi)", () => {
    const a = avanzaFinche(crea(6, 77), (p) => p.fase.nome !== "FINE");
    const b = avanzaFinche(crea(6, 77), (p) => p.fase.nome !== "FINE");
    expect(a).toEqual(b);
  });
});

describe("controllo dei contenuti", () => {
  it("mazzo, schemi, frasi e segreti predefiniti sono validi", () => {
    expect(() => caricaAmbiente()).not.toThrow();
    expect(ambiente.mazzo.length).toBeGreaterThanOrEqual(40);
  });
});

describe("versioni dei quesiti: schema principale o alternativo (D-045)", () => {
  const conProbabilita = (probabilita: number): Ambiente => ({
    ...ambiente,
    config: { ...ambiente.config, selezione: { ...ambiente.config.selezione, probabilitaAlternativa: probabilita } },
  });
  /** Effetto sull'azienda e spiegazione di ogni quesito estratto nel 1° trimestre, su molti semi. */
  const estratti = (amb: Ambiente) =>
    Array.from({ length: 60 }, (_, i) => crea(5, i + 1, amb)).flatMap((p) =>
      p.proposteTrimestre.map((x) => ({ modello: amb.mazzo.find((m) => m.id === x.modelloId)!, effetto: x.effettoAzienda, spiegazione: x.spiegazione })),
    );

  it("ogni quesito del mazzo ha un'alternativa con un effetto sull'azienda diverso", () => {
    for (const m of ambiente.mazzo) {
      expect(m.alternativa).toBeDefined();
      expect(ambiente.schemi[m.alternativa!.schema]!.effettoAzienda).not.toBe(ambiente.schemi[m.schema]!.effettoAzienda);
    }
  });

  it("nel mazzo ogni schema compare tante volte come alternativa quante come principale (taratura invariata)", () => {
    const conta = (f: (m: Ambiente["mazzo"][number]) => string) =>
      ambiente.mazzo.reduce<Record<string, number>>((acc, m) => ({ ...acc, [f(m)]: (acc[f(m)] ?? 0) + 1 }), {});
    expect(conta((m) => m.alternativa!.schema)).toEqual(conta((m) => m.schema));
  });

  it("con probabilità 0 esce sempre la versione principale, con 1 sempre l'alternativa, ognuna con la sua spiegazione", () => {
    for (const e of estratti(conProbabilita(0))) {
      expect(e.effetto).toBe(ambiente.schemi[e.modello.schema]!.effettoAzienda);
      expect(e.spiegazione).toBe(e.modello.spiegazione);
    }
    for (const e of estratti(conProbabilita(1))) {
      expect(e.effetto).toBe(ambiente.schemi[e.modello.alternativa!.schema]!.effettoAzienda);
      expect(e.spiegazione).toBe(e.modello.alternativa!.spiegazione);
    }
  });

  it("con la probabilità predefinita escono entrambe le versioni, in modo riproducibile col seme", () => {
    const tutti = estratti(ambiente);
    const alternative = tutti.filter((e) => e.spiegazione === e.modello.alternativa!.spiegazione).length;
    expect(alternative).toBeGreaterThan(tutti.length * 0.3);
    expect(alternative).toBeLessThan(tutti.length * 0.7);
    expect(crea(5, 7).proposteTrimestre).toEqual(crea(5, 7).proposteTrimestre);
  });
});
