/**
 * Le carte della partita e l'algoritmo di equità (GDD §8.6 · D-068, D-069, D-070).
 */
import { describe, expect, it } from "vitest";
import { caricaAmbiente } from "../src/contenuti.js";
import { creaEAvvia } from "./aiuti.js";
import type { Partita, RepartoId } from "../src/tipi.js";

const ambiente = caricaAmbiente();

function nuova(n: number, seme: number): Partita {
  const esito = creaEAvvia(Array.from({ length: n }, (_, i) => ({ id: `g${i + 1}`, nome: `G${i + 1}` })), seme, ambiente);
  if (!esito.ok) throw new Error(esito.errore);
  return esito.partita;
}

const occupati = (p: Partita) => p.reparti.filter((r) => r.occupatoDa).map((r) => r.id);

/** Totali di bonus e malus di ogni reparto occupato sulle 12 carte. */
function totali(p: Partita) {
  const bonus = new Map<RepartoId, number>(occupati(p).map((r) => [r, 0]));
  const malus = new Map<RepartoId, number>(occupati(p).map((r) => [r, 0]));
  for (const carta of p.carte.flat()) {
    for (const [r, e] of Object.entries(carta.effettiPrivati) as [RepartoId, { punti?: number }][]) {
      const punti = e.punti ?? 0;
      if (punti > 0) bonus.set(r, bonus.get(r)! + punti);
      if (punti < 0) malus.set(r, malus.get(r)! - punti);
    }
  }
  return { bonus, malus };
}
const scarto = (m: Map<RepartoId, number>) => Math.max(...m.values()) - Math.min(...m.values());

describe("le carte della partita (D-068)", () => {
  it("12 carte: a ogni trimestre una da 30, una da 50 e una da 80, tutte diverse", () => {
    const p = nuova(5, 3);
    expect(p.carte).toHaveLength(4);
    for (const trimestre of p.carte) expect(trimestre.map((c) => c.costo)).toEqual([30, 50, 80]);
    const modelli = p.carte.flat().map((c) => c.modelloId);
    expect(new Set(modelli).size).toBe(12);
  });

  it("ogni carta rispetta i trimestri ammessi del suo quesito", () => {
    const p = nuova(6, 9);
    p.carte.forEach((trimestre, i) => {
      for (const c of trimestre) expect(ambiente.mazzo.find((m) => m.id === c.modelloId)!.trimestri).toContain(i + 1);
    });
  });

  it("la grande vale quanto le due piccole: stessi bonus e malus totali nel trimestre (D-070)", () => {
    const p = nuova(7, 21);
    for (const [piccola, media, grande] of p.carte) {
      const somma = (c: typeof piccola, segno: 1 | -1) =>
        Object.values(c!.effettiPrivati).reduce((s, e) => s + (Math.sign(e?.punti ?? 0) === segno ? Math.abs(e!.punti!) : 0), 0);
      expect(somma(grande, 1)).toBe(somma(piccola, 1) + somma(media, 1));
      expect(somma(grande, -1)).toBe(somma(piccola, -1) + somma(media, -1));
    }
  });

  it("i reparti vacanti non ricevono mai effetti", () => {
    const p = nuova(4, 5);
    const vacanti = p.reparti.filter((r) => !r.occupatoDa).map((r) => r.id);
    for (const c of p.carte.flat()) for (const r of vacanti) expect(c.effettiPrivati[r]).toBeUndefined();
  });
});

describe("algoritmo di equità (D-069)", () => {
  it.each([4, 5, 6, 7, 8])("con %i giocatori ogni reparto ha gli stessi bonus e malus totali (al massimo 1 punto di differenza)", (n) => {
    for (let seme = 1; seme <= 25; seme++) {
      const p = nuova(n, seme);
      const { bonus, malus } = totali(p);
      expect(scarto(bonus), `bonus, ${n} giocatori, seme ${seme}`).toBeLessThanOrEqual(ambiente.config.proposte.tolleranzaEquita);
      expect(scarto(malus), `malus, ${n} giocatori, seme ${seme}`).toBeLessThanOrEqual(ambiente.config.proposte.tolleranzaEquita);
      expect(p.equita!.scarto).toBe(Math.max(scarto(bonus), scarto(malus)));
    }
  });

  it.each([4, 5, 6, 7, 8])("con %i giocatori nessun reparto ha un bonus sia nella grande sia nelle piccole dello stesso trimestre", (n) => {
    for (let seme = 1; seme <= 25; seme++) {
      const p = nuova(n, seme);
      expect(p.equita!.violazioni, `${n} giocatori, seme ${seme}`).toBe(0);
      for (const [piccola, media, grande] of p.carte) {
        const conBonus = (c: typeof piccola) => Object.entries(c!.effettiPrivati).filter(([, e]) => (e?.punti ?? 0) > 0).map(([r]) => r);
        const lati = new Set([...conBonus(piccola), ...conBonus(media)]);
        for (const r of conBonus(grande)) expect(lati.has(r)).toBe(false);
      }
    }
  });

  it("in una carta un reparto ha al massimo un ruolo", () => {
    const p = nuova(4, 8);
    for (const c of p.carte.flat()) {
      const schema = Object.values(ambiente.schemi).find((s) => s.costo === c.costo)!;
      const coinvolti = Object.values(c.effettiPrivati).filter((e) => (e?.punti ?? 0) !== 0).length;
      expect(coinvolti).toBeLessThanOrEqual(Math.max(...Object.values(ambiente.schemi).filter((x) => x.costo === schema.costo).map((x) => x.ruoli.length)));
    }
  });

  it("stesso seme → stesse carte (riproducibile)", () => {
    expect(nuova(6, 42).carte).toEqual(nuova(6, 42).carte);
  });
});
