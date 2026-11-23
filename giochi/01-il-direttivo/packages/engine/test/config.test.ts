import { describe, expect, it } from "vitest";
import { caricaConfigurazione, controllaConfigurazione } from "../src/config.js";

describe("configurazione (content/config.json)", () => {
  it("il file predefinito è valido", () => {
    expect(() => caricaConfigurazione()).not.toThrow();
  });

  it("tre proposte a trimestre da 30 / 50 / 80 K, investimento minimo 51 K, cassa senza tetto (D-068)", () => {
    const c = caricaConfigurazione();
    expect(c.proposte.costi).toEqual([30, 50, 80]);
    expect(c.proposte.investimentoMinimo).toBe(51);
    expect("massima" in c.cassa).toBe(false);
  });

  it("la grande vale quanto le due piccole nei punti dei reparti (D-070)", () => {
    const v = caricaConfigurazione().proposte.valorePerCosto;
    expect(v["80"]!.bonus).toBe(v["30"]!.bonus + v["50"]!.bonus);
    expect(v["80"]!.malus).toBe(v["30"]!.malus + v["50"]!.malus);
  });

  it("segnala un investimento minimo impossibile con il solo budget del trimestre", () => {
    const base = caricaConfigurazione();
    const c = { ...base, proposte: { ...base.proposte, investimentoMinimo: 200 } };
    expect(controllaConfigurazione(c)).toContainEqual(expect.stringContaining("investimento minimo"));
  });

  it("catena minima dei segreti: 1-1-2-2-2 da 4 a 8 giocatori (D-073)", () => {
    expect(caricaConfigurazione().segreti.passaggiMinimi).toEqual({ "4": 1, "5": 1, "6": 2, "7": 2, "8": 2 });
  });

  it("segnala una probabilità fuori da 0..1", () => {
    const base = caricaConfigurazione();
    const c = { ...base, spie: { ...base.spie, probabilitaNessunaSpia: 1.5 } };
    expect(controllaConfigurazione(c)).toHaveLength(1);
  });
});
