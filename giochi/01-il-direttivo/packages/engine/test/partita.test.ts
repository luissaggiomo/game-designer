import { creaEAvvia } from "./aiuti.js";
import { describe, expect, it } from "vitest";
import { caricaAmbiente } from "../src/contenuti.js";
import { creaPartita, type NuovoGiocatore } from "../src/partita.js";
import type { Partita } from "../src/tipi.js";

const ambiente = caricaAmbiente();
const config = ambiente.config;
const persone = (n: number): NuovoGiocatore[] => Array.from({ length: n }, (_, i) => ({ id: `g${i + 1}`, nome: `Giocatore ${i + 1}` }));

/** Solo la creazione (assegnazioni segrete): le carte si preparano all'inizio del 1° trimestre. */
function crea(n: number, seme: number): Partita {
  const esito = creaPartita(persone(n), seme, ambiente);
  if (!esito.ok) throw new Error(esito.errore);
  return esito.partita;
}

const spieDi = (p: Partita) => p.giocatori.filter((g) => g.fazione.tipo === "SPIA");

describe("creazione della partita", () => {
  it("rifiuta meno di 4 o più di 8 giocatori", () => {
    expect(creaPartita(persone(3), 1, ambiente).ok).toBe(false);
    expect(creaPartita(persone(9), 1, ambiente).ok).toBe(false);
  });

  it("rifiuta identificativi doppi", () => {
    const doppi = [...persone(3), { id: "g1", nome: "Copia" }];
    expect(creaPartita(doppi, 1, ambiente).ok).toBe(false);
  });

  it("stesso seme → stessa assegnazione segreta", () => {
    expect(crea(6, 99)).toEqual(crea(6, 99));
  });

  for (const n of [4, 5, 6, 7, 8]) {
    it(`con ${n} giocatori: un reparto diverso a testa, gli altri vacanti in autogestione`, () => {
      const p = crea(n, n * 31);
      const repartiAssegnati = p.giocatori.map((g) => g.repartoId);
      expect(new Set(repartiAssegnati).size).toBe(n);
      expect(p.reparti.filter((r) => r.occupatoDa).length).toBe(n);
      for (const r of p.reparti.filter((r) => !r.occupatoDa)) expect(r.autogestione).toBe(true);
      // I reparti base sono sempre occupati.
      for (const base of config.reparti.base) {
        expect(p.reparti.find((r) => r.id === base)?.occupatoDa).toBeDefined();
      }
    });

    it(`con ${n} giocatori: ${n === 8 ? 2 : 1} concorrente/i (D-011)`, () => {
      expect(crea(n, 5).concorrenti.length).toBe(n === 8 ? 2 : 1);
    });
  }

  it("partenza: fase Rapporto del trimestre 1, cassa piena, tutti attivi", () => {
    const esito = creaEAvvia(persone(5), 3, ambiente);
    if (!esito.ok) throw new Error(esito.errore);
    const p = esito.partita;
    expect(p.fase).toEqual({ nome: "RAPPORTO" });
    expect(p.trimestre).toBe(1);
    expect(p.azienda.cassa).toBe(config.cassa.perTrimestre);
    expect(p.proposteTrimestre.map((x) => x.costo)).toEqual(config.proposte.costi);
    expect(p.giocatori.every((g) => g.stato === "ATTIVO")).toBe(true);
  });
});

describe("spie (GDD §4.2, segnaposto da tarare)", () => {
  const PARTITE = 5000;

  it("da 4 a 7 giocatori: 0 o 1 spia, mai di più", () => {
    for (let seme = 0; seme < 500; seme++) {
      for (const n of [4, 5, 6, 7]) expect(spieDi(crea(n, seme)).length).toBeLessThanOrEqual(1);
    }
  });

  it("con 8 giocatori: al massimo 2 spie, e capitano sia 1 sia 2", () => {
    const conteggi = new Set<number>();
    for (let seme = 0; seme < 500; seme++) {
      const s = spieDi(crea(8, seme)).length;
      expect(s).toBeLessThanOrEqual(2);
      conteggi.add(s);
    }
    expect(conteggi).toEqual(new Set([0, 1, 2]));
  });

  it("partite senza spie: frequenza vicina al parametro (±2 punti)", () => {
    let senza = 0;
    for (let seme = 0; seme < PARTITE; seme++) if (spieDi(crea(5, seme)).length === 0) senza++;
    expect(Math.abs(senza / PARTITE - config.spie.probabilitaNessunaSpia)).toBeLessThan(0.02);
  });

  it("ogni spia lavora per un concorrente che esiste", () => {
    for (let seme = 0; seme < 300; seme++) {
      const p = crea(8, seme);
      for (const g of spieDi(p)) {
        if (g.fazione.tipo !== "SPIA") continue;
        const concorrente = g.fazione.concorrente;
        expect(p.concorrenti.map((c) => c.id)).toContain(concorrente);
      }
    }
  });

  it("con 8 giocatori capitano sia spie alleate sia spie rivali", () => {
    let alleate = 0;
    let rivali = 0;
    for (let seme = 0; seme < 2000; seme++) {
      const s = spieDi(crea(8, seme)).map((g) => (g.fazione.tipo === "SPIA" ? g.fazione.concorrente : ""));
      if (s.length === 2) s[0] === s[1] ? alleate++ : rivali++;
    }
    expect(alleate).toBeGreaterThan(0);
    expect(rivali).toBeGreaterThan(0);
  });

  it("la spia può capitare in qualsiasi reparto (nessun reparto 'sicuro')", () => {
    const repartiConSpia = new Set<string>();
    for (let seme = 0; seme < 2000; seme++) for (const g of spieDi(crea(5, seme))) repartiConSpia.add(g.repartoId);
    expect(repartiConSpia.size).toBe(5);
  });
});
