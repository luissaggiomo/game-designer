import { describe, expect, it } from "vitest";
import { caricaAmbiente } from "@il-direttivo/engine";
import { creaCsv, creaReport } from "../src/report.js";
import { simulaPartita } from "../src/simula.js";

const ambiente = caricaAmbiente();

// Partite complete: con tutti i test in parallelo possono superare i 5 s predefiniti.
describe("simulatore", { timeout: 30_000 }, () => {
  it("le partite di soli robot arrivano sempre alla fine, da 4 a 8 giocatori", () => {
    for (const n of [4, 5, 6, 7, 8]) {
      for (let seme = 1; seme <= 10; seme++) {
        const d = simulaPartita(n, seme, ambiente);
        expect(d.dettaglio).toHaveLength(n);
        expect(d.votazioni).toHaveLength(10); // scaletta 2-3-3-2
        expect(["AZIENDA", "CONCORRENTE", "PAREGGIO"]).toContain(d.mercato);
      }
    }
  });

  it("stesso seme → stessa partita simulata (risultati riproducibili)", () => {
    expect(simulaPartita(6, 42, ambiente)).toEqual(simulaPartita(6, 42, ambiente));
  });

  it("nelle partite con spie succedono cose da spie (segreti consegnati, demansionamenti)", () => {
    const partite = Array.from({ length: 60 }, (_, i) => simulaPartita(6, i + 1, ambiente));
    const conSpie = partite.filter((p) => p.spie > 0);
    expect(conSpie.reduce((s, p) => s + p.segreti.passati, 0)).toBeGreaterThan(0);
    expect(partite.reduce((s, p) => s + p.demansionamenti.length, 0)).toBeGreaterThan(0);
  });

  it("i robot scelgono il proprio obiettivo (nessuno a caso) e a volte raggiungono i traguardi (D-046…D-052)", () => {
    const giocatori = Array.from({ length: 30 }, (_, i) => simulaPartita(6, i + 1, ambiente)).flatMap((p) => p.dettaglio);
    expect(giocatori.every((g) => !g.obiettivo.aCaso)).toBe(true);
    expect(giocatori.filter((g) => g.spia).every((g) => g.obiettivo.aziendalista)).toBe(true);
    expect(giocatori.some((g) => g.obiettivo.facile)).toBe(true);
    expect(giocatori.some((g) => g.obiettivo.difficile)).toBe(true);
  });

  it("il report e i CSV si generano", () => {
    const partite = Array.from({ length: 20 }, (_, i) => simulaPartita(5, i + 1, ambiente));
    const { markdown } = creaReport(partite, "prova");
    expect(markdown).toContain("Equità tra reparti");
    const csv = creaCsv(partite);
    expect(csv.giocatori.split("\n")).toHaveLength(1 + 20 * 5);
  });
});
