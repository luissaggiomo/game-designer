/**
 * Chi deve ancora agire (chiusura anticipata delle fasi, D-066) e opzione "bot spia: no" (D-080).
 */
import { describe, expect, it } from "vitest";
import { inAttesaDi } from "../src/attese.js";
import { caricaAmbiente } from "../src/contenuti.js";
import { applica } from "../src/motore.js";
import { creaPartita } from "../src/partita.js";
import type { Partita } from "../src/tipi.js";

const ambiente = caricaAmbiente();
const persone = (n: number) => Array.from({ length: n }, (_, i) => ({ id: `g${i + 1}`, nome: `G${i + 1}` }));

function avanza(p: Partita): Partita {
  const r = applica(p, { tipo: "AVANZA_FASE" }, ambiente);
  if (!r.ok) throw new Error(r.errore);
  return r.partita;
}

function esegui(p: Partita, azione: Parameters<typeof applica>[1]): Partita {
  const r = applica(p, azione, ambiente);
  if (!r.ok) throw new Error(r.errore);
  return r.partita;
}

describe("inAttesaDi", () => {
  it("nella scelta degli obiettivi aspetta chi non ha scelto", () => {
    const e = creaPartita(persone(4), 1, ambiente);
    if (!e.ok) throw new Error(e.errore);
    let p = e.partita;
    expect([...inAttesaDi(p)!].sort()).toEqual(["g1", "g2", "g3", "g4"]);
    p = esegui(p, { tipo: "SCEGLI_OBIETTIVO", da: "g2", obiettivo: p.obiettivi.g2!.proposti[0]! });
    expect(inAttesaDi(p)).not.toContain("g2");
    expect(inAttesaDi(p)).toHaveLength(3);
  });

  it("nelle fasi senza un'azione per tutti restituisce null", () => {
    const e = creaPartita(persone(5), 2, ambiente);
    if (!e.ok) throw new Error(e.errore);
    const p = avanza(e.partita); // Rapporto
    expect(p.fase.nome).toBe("RAPPORTO");
    expect(inAttesaDi(p)).toBeNull();
    const d = avanza(p);
    expect(d.fase.nome).toBe("DISCUSSIONE");
    expect(inAttesaDi(d)).toBeNull();
  });

  it("nel voto del pacchetto e nella mossa privata si svuota quando tutti hanno agito", () => {
    const e = creaPartita(persone(4), 3, ambiente);
    if (!e.ok) throw new Error(e.errore);
    let p = avanza(avanza(avanza(e.partita))); // Rapporto → Discussione → Voto
    expect(p.fase.nome).toBe("VOTO_PACCHETTO");
    const pacchetto = p.votoTrimestre!.pacchetti[0]!;
    for (const g of p.giocatori) {
      expect(inAttesaDi(p)).toContain(g.id);
      p = esegui(p, { tipo: "VOTA_PACCHETTO", da: g.id, pacchetto });
    }
    expect(inAttesaDi(p)).toEqual([]);
    p = avanza(p); // maggioranza: tutti uguali → mossa privata
    expect(p.fase.nome).toBe("MOSSA_PRIVATA");
    for (const g of p.giocatori) p = esegui(p, { tipo: "MOSSA_PRIVATA", da: g.id, scelta: "AZIENDA" });
    expect(inAttesaDi(p)).toEqual([]);
  });
});

describe("opzione idoneiSpia (D-080)", () => {
  it("senza opzione la partita è identica a prima (stesso seme, stesse fazioni)", () => {
    for (let seme = 1; seme <= 30; seme++) {
      const a = creaPartita(persone(6), seme, ambiente);
      const b = creaPartita(persone(6), seme, ambiente, {});
      if (!a.ok || !b.ok) throw new Error("creazione");
      expect(b.partita.giocatori).toEqual(a.partita.giocatori);
    }
  });

  it("le spie toccano solo agli idonei e il loro numero resta quello estratto", () => {
    for (let seme = 1; seme <= 300; seme++) {
      const libera = creaPartita(persone(8), seme, ambiente);
      const limitata = creaPartita(persone(8), seme, ambiente, { idoneiSpia: ["g1", "g2", "g3"] });
      if (!libera.ok || !limitata.ok) throw new Error("creazione");
      const spie = (p: Partita) => p.giocatori.filter((g) => g.fazione.tipo === "SPIA");
      expect(spie(limitata.partita).every((g) => ["g1", "g2", "g3"].includes(g.id))).toBe(true);
      expect(spie(limitata.partita).length).toBe(spie(libera.partita).length);
    }
  });

  it("senza idonei disponibili la spia viene tolta", () => {
    let conSpie = 0;
    for (let seme = 1; seme <= 200; seme++) {
      const libera = creaPartita(persone(4), seme, ambiente);
      const nessuno = creaPartita(persone(4), seme, ambiente, { idoneiSpia: [] });
      if (!libera.ok || !nessuno.ok) throw new Error("creazione");
      if (libera.partita.giocatori.some((g) => g.fazione.tipo === "SPIA")) conSpie++;
      expect(nessuno.partita.giocatori.every((g) => g.fazione.tipo === "ONESTO")).toBe(true);
    }
    expect(conSpie).toBeGreaterThan(100);
  });
});
