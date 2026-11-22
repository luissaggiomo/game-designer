import { describe, expect, it } from "vitest";
import { creaCasuale } from "../src/rng.js";

describe("generatore casuale con seme", () => {
  it("stesso seme → stessa sequenza (partite riproducibili)", () => {
    const a = creaCasuale(42);
    const b = creaCasuale(42);
    const sequenzaA = Array.from({ length: 20 }, () => a.numero());
    const sequenzaB = Array.from({ length: 20 }, () => b.numero());
    expect(sequenzaA).toEqual(sequenzaB);
  });

  it("semi diversi → sequenze diverse", () => {
    expect(creaCasuale(1).numero()).not.toEqual(creaCasuale(2).numero());
  });

  it("numero() resta sempre in [0, 1)", () => {
    const r = creaCasuale(7);
    for (let i = 0; i < 10_000; i++) {
      const n = r.numero();
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThan(1);
    }
  });

  it("intero() copre tutti i valori, estremi compresi, in modo uniforme", () => {
    const r = creaCasuale(123);
    const conteggi = new Map<number, number>();
    const prove = 60_000;
    for (let i = 0; i < prove; i++) {
      const n = r.intero(1, 6);
      conteggi.set(n, (conteggi.get(n) ?? 0) + 1);
    }
    expect([...conteggi.keys()].sort()).toEqual([1, 2, 3, 4, 5, 6]);
    for (const c of conteggi.values()) {
      // Ogni faccia è attesa circa 10.000 volte: tolleranza ±5%.
      expect(Math.abs(c - prove / 6)).toBeLessThan((prove / 6) * 0.05);
    }
  });

  it("intero() rifiuta intervalli non validi", () => {
    expect(() => creaCasuale(1).intero(5, 2)).toThrow();
  });

  it("mescola() restituisce gli stessi elementi senza toccare l'originale", () => {
    const originale = ["A", "B", "C", "D", "E"];
    const mescolato = creaCasuale(9).mescola(originale);
    expect([...mescolato].sort()).toEqual(originale);
    expect(originale).toEqual(["A", "B", "C", "D", "E"]);
  });

  it("mescola() con lo stesso seme dà lo stesso ordine", () => {
    const elenco = Array.from({ length: 10 }, (_, i) => i);
    expect(creaCasuale(5).mescola(elenco)).toEqual(creaCasuale(5).mescola(elenco));
  });

  it("stato() permette di riprendere la sequenza dallo stesso punto", () => {
    const r = creaCasuale(77);
    r.numero();
    r.numero();
    const ripreso = creaCasuale(r.stato());
    expect(ripreso.numero()).toEqual(r.numero());
  });

  it("scegli() rifiuta un elenco vuoto", () => {
    expect(() => creaCasuale(1).scegli([])).toThrow();
  });
});
