import { describe, expect, it } from "vitest";
import { caricaConfigurazione, controllaConfigurazione } from "../src/config.js";

describe("configurazione (content/config.json)", () => {
  it("il file predefinito è valido", () => {
    expect(() => caricaConfigurazione()).not.toThrow();
  });

  it("scaletta delle votazioni 2-3-3-2, 10 a partita (D-014)", () => {
    const c = caricaConfigurazione();
    expect(c.votazioniPerTrimestre).toEqual([2, 3, 3, 2]);
    expect(c.votazioniPerTrimestre.reduce((a, b) => a + b, 0)).toBe(10);
  });

  it("segnala una scaletta che non corrisponde ai trimestri", () => {
    const c = { ...caricaConfigurazione(), votazioniPerTrimestre: [2, 3] };
    expect(controllaConfigurazione(c)).toContainEqual(expect.stringContaining("scaletta"));
  });

  it("segnala una probabilità fuori da 0..1", () => {
    const c = { ...caricaConfigurazione(), spie: { probabilitaNessunaSpia: 1.5 } };
    expect(controllaConfigurazione(c)).toHaveLength(1);
  });
});
