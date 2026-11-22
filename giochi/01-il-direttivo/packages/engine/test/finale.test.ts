import { describe, expect, it } from "vitest";
import type { Azione, Evento } from "../src/azioni.js";
import { caricaAmbiente } from "../src/contenuti.js";
import { applica } from "../src/motore.js";
import { creaPartita } from "../src/partita.js";
import type { Fazione, Giocatore, Partita } from "../src/tipi.js";

const ambiente = caricaAmbiente();

function nuova(n = 5, seme = 3): Partita {
  const esito = creaPartita(Array.from({ length: n }, (_, i) => ({ id: `g${i + 1}`, nome: `G${i + 1}` })), seme, ambiente);
  if (!esito.ok) throw new Error(esito.errore);
  return esito.partita;
}

function fai(p: Partita, azione: Azione): { partita: Partita; eventi: Evento[] } {
  const esito = applica(p, azione, ambiente);
  if (!esito.ok) throw new Error(esito.errore);
  return { partita: esito.partita, eventi: esito.eventi };
}
const rifiutata = (p: Partita, azione: Azione) => !applica(p, azione, ambiente).ok;
const avanza = (p: Partita) => fai(p, { tipo: "AVANZA_FASE" });

/** Avanza fino a una fase (per nome) dentro un trimestre preciso. */
function vaiA(p: Partita, nome: string, trimestre = p.trimestre): Partita {
  let q = p;
  for (let i = 0; i < 200; i++) {
    if (q.fase.nome === nome && q.trimestre === trimestre) return q;
    q = avanza(q).partita;
  }
  throw new Error(`Fase ${nome} del trimestre ${trimestre} non raggiunta`);
}

/** Imposta le fazioni in modo noto: g1 spia del concorrente A, gli altri onesti. */
function conSpia(p: Partita, ids: string[] = ["g1"], concorrente = "A"): Partita {
  const q = structuredClone(p);
  for (const g of q.giocatori) g.fazione = ids.includes(g.id) ? ({ tipo: "SPIA", concorrente } as Fazione) : { tipo: "ONESTO" };
  return q;
}

const g = (p: Partita, id: string): Giocatore => p.giocatori.find((x) => x.id === id)!;

/** Demansiona g2 nel trimestre 1 votando tutti sì. */
function demansionaG2(p: Partita): Partita {
  let q = vaiA(p, "DEMANSIONAMENTO", 1);
  q = fai(q, { tipo: "PROPONI_DEMANSIONAMENTO", da: "g1", bersaglio: "g2" }).partita;
  for (const id of ["g1", "g3", "g4", "g5"]) q = fai(q, { tipo: "VOTA_DEMANSIONAMENTO", da: id, voto: "SI" }).partita;
  return fai(q, { tipo: "CHIUDI_VOTO_PERSONALE" }).partita;
}

describe("demansionamento (D-009, D-012, D-022)", () => {
  it("1 a testa, il bersaglio non vota: 4 sì su 4 → demansionato, reparto in autogestione, segreti del reparto persi", () => {
    const prima = vaiA(nuova(), "DEMANSIONAMENTO", 1);
    const copieGioco = prima.copieSegreto.filter((c) => c.possessore === "g2" && c.provenienza.tipo === "GIOCO").length;
    const q = demansionaG2(nuova());
    expect(g(q, "g2").stato).toBe("DEMANSIONATO");
    expect(g(q, "g2").demansionatoDalTrimestre).toBe(1);
    expect(q.reparti.find((r) => r.id === g(q, "g2").repartoId)!.autogestione).toBe(true);
    const revocate = q.copieSegreto.filter((c) => c.possessore === "g2" && c.revocata).length;
    expect(revocate).toBe(copieGioco);
  });

  it("il ruolo NON viene rivelato con il demansionamento", () => {
    let q = vaiA(nuova(), "DEMANSIONAMENTO", 1);
    q = fai(q, { tipo: "PROPONI_DEMANSIONAMENTO", da: "g1", bersaglio: "g2" }).partita;
    for (const id of ["g1", "g3", "g4", "g5"]) q = fai(q, { tipo: "VOTA_DEMANSIONAMENTO", da: id, voto: "SI" }).partita;
    const { eventi } = fai(q, { tipo: "CHIUDI_VOTO_PERSONALE" });
    expect(JSON.stringify(eventi)).not.toMatch(/spia|onesto/i);
  });

  it("pareggio 2 a 2 → non passa; tempo scaduto vale no", () => {
    let q = vaiA(nuova(), "DEMANSIONAMENTO", 1);
    q = fai(q, { tipo: "PROPONI_DEMANSIONAMENTO", da: "g1", bersaglio: "g2" }).partita;
    q = fai(q, { tipo: "VOTA_DEMANSIONAMENTO", da: "g1", voto: "SI" }).partita;
    q = fai(q, { tipo: "VOTA_DEMANSIONAMENTO", da: "g3", voto: "SI" }).partita;
    const chiuso = fai(q, { tipo: "CHIUDI_VOTO_PERSONALE" });
    expect(g(chiuso.partita, "g2").stato).toBe("ATTIVO");
    expect(chiuso.eventi[0]).toMatchObject({ approvato: false, si: 2, soglia: 3 });
  });

  it("il bersaglio non può votare; una sola votazione per trimestre (F1a)", () => {
    let q = vaiA(nuova(), "DEMANSIONAMENTO", 1);
    q = fai(q, { tipo: "PROPONI_DEMANSIONAMENTO", da: "g1", bersaglio: "g2" }).partita;
    expect(rifiutata(q, { tipo: "VOTA_DEMANSIONAMENTO", da: "g2", voto: "NO" })).toBe(true);
    q = fai(q, { tipo: "CHIUDI_VOTO_PERSONALE" }).partita;
    expect(rifiutata(q, { tipo: "PROPONI_DEMANSIONAMENTO", da: "g3", bersaglio: "g4" })).toBe(true);
  });

  it("chi è stato bersaglio non può essere riproposto nel trimestre successivo (F1b)", () => {
    let q = vaiA(nuova(), "DEMANSIONAMENTO", 1);
    q = fai(q, { tipo: "PROPONI_DEMANSIONAMENTO", da: "g1", bersaglio: "g2" }).partita;
    q = vaiA(q, "DEMANSIONAMENTO", 2);
    expect(rifiutata(q, { tipo: "PROPONI_DEMANSIONAMENTO", da: "g1", bersaglio: "g2" })).toBe(true);
    expect(rifiutata(q, { tipo: "PROPONI_DEMANSIONAMENTO", da: "g1", bersaglio: "g3" })).toBe(false);
  });

  it("niente demansionamenti nel 4° trimestre (F1c)", () => {
    const q = vaiA(nuova(), "DEMANSIONAMENTO", 4);
    expect(rifiutata(q, { tipo: "PROPONI_DEMANSIONAMENTO", da: "g1", bersaglio: "g2" })).toBe(true);
  });

  it("i demansionati non votano e non propongono demansionamenti", () => {
    let q = demansionaG2(nuova());
    q = vaiA(q, "DEMANSIONAMENTO", 2);
    expect(rifiutata(q, { tipo: "PROPONI_DEMANSIONAMENTO", da: "g2", bersaglio: "g3" })).toBe(true);
  });
});

describe("promozione (D-010)", () => {
  it("non prima di un trimestre intero: demansionato nel T1, promuovibile dal T2", () => {
    let q = demansionaG2(nuova());
    expect(rifiutata(q, { tipo: "PROPONI_PROMOZIONE", da: "g3", bersaglio: "g2" })).toBe(true); // ancora nel T1
    q = vaiA(q, "DEMANSIONAMENTO", 2);
    q = fai(q, { tipo: "PROPONI_PROMOZIONE", da: "g2", bersaglio: "g2" }).partita; // la chiede lui
    for (const id of ["g1", "g3", "g4"]) q = fai(q, { tipo: "VOTA_PROMOZIONE", da: id, voto: "SI" }).partita;
    q = fai(q, { tipo: "CHIUDI_VOTO_PERSONALE" }).partita;
    expect(g(q, "g2").stato).toBe("ATTIVO");
    expect(q.reparti.find((r) => r.id === g(q, "g2").repartoId)!.autogestione).toBe(false);
  });

  it("una sola richiesta per persona per trimestre; prima le promozioni, poi il demansionamento", () => {
    let q = demansionaG2(nuova());
    q = vaiA(q, "DEMANSIONAMENTO", 2);
    q = fai(q, { tipo: "PROPONI_PROMOZIONE", da: "g3", bersaglio: "g2" }).partita;
    q = fai(q, { tipo: "CHIUDI_VOTO_PERSONALE" }).partita; // nessuno ha votato → respinta
    expect(rifiutata(q, { tipo: "PROPONI_PROMOZIONE", da: "g4", bersaglio: "g2" })).toBe(true);
    q = fai(q, { tipo: "PROPONI_DEMANSIONAMENTO", da: "g1", bersaglio: "g3" }).partita;
    q = fai(q, { tipo: "CHIUDI_VOTO_PERSONALE" }).partita;
    expect(g(q, "g2").stato).toBe("DEMANSIONATO");
  });
});

describe("finale (GDD §15)", () => {
  it("decisione finale obbligatoria: nessuna risposta → licenziato e ruolo rivelato (D-028)", () => {
    let q = demansionaG2(conSpia(nuova()));
    q = vaiA(q, "DECISIONE_FINALE", 4);
    expect(q.fase).toMatchObject({ nome: "DECISIONE_FINALE", bersaglio: "g2" });
    expect(q.votoPersonale).toMatchObject({ tipo: "PROMOZIONE", bersaglio: "g2", momento: "FINALE" });
    expect(rifiutata(q, { tipo: "CHIUDI_VOTO_PERSONALE" })).toBe(true);
    const { partita, eventi } = avanza(q);
    expect(partita.fase.nome).toBe("VERIFICA");
    expect(g(partita, "g2").stato).toBe("LICENZIATO");
    expect(eventi.find((e) => e.tipo === "LICENZIAMENTO")!.causa).toContain("era onesto");
  });

  it("decisione finale: maggioranza per promuovere → torna attivo; pareggio → licenziato (D-028)", () => {
    let q = vaiA(demansionaG2(conSpia(nuova())), "DECISIONE_FINALE", 4);
    for (const id of ["g1", "g3", "g4"]) q = fai(q, { tipo: "VOTA_PROMOZIONE", da: id, voto: "SI" }).partita;
    const promosso = avanza(q).partita;
    expect(g(promosso, "g2").stato).toBe("ATTIVO");
    let r = vaiA(demansionaG2(conSpia(nuova())), "DECISIONE_FINALE", 4);
    for (const id of ["g1", "g3"]) r = fai(r, { tipo: "VOTA_PROMOZIONE", da: id, voto: "SI" }).partita;
    for (const id of ["g4", "g5"]) r = fai(r, { tipo: "VOTA_PROMOZIONE", da: id, voto: "NO" }).partita;
    expect(g(avanza(r).partita, "g2").stato).toBe("LICENZIATO");
  });

  it("tutti sì alla verifica → si passa al punteggio", () => {
    let q = vaiA(conSpia(nuova()), "VERIFICA", 4);
    for (const id of ["g1", "g2", "g3", "g4", "g5"]) q = fai(q, { tipo: "VERIFICA_FINALE", da: id, soloOnesti: true }).partita;
    expect(avanza(q).partita.fase.nome).toBe("PUNTEGGIO");
  });

  it("qualcuno no → la TV rivela chi; nomina; il più nominato è licenziato col ruolo", () => {
    let q = vaiA(conSpia(nuova()), "VERIFICA", 4);
    for (const id of ["g1", "g2", "g3"]) q = fai(q, { tipo: "VERIFICA_FINALE", da: id, soloOnesti: true }).partita;
    for (const id of ["g4", "g5"]) q = fai(q, { tipo: "VERIFICA_FINALE", da: id, soloOnesti: false }).partita;
    const verifica = avanza(q);
    expect(verifica.eventi.find((e) => e.tipo === "ESITO_VERIFICA")).toMatchObject({ tuttiSi: false, votiNo: ["g4", "g5"] });
    q = verifica.partita;
    expect(q.fase).toMatchObject({ nome: "NOMINA", giro: 1 });
    expect(rifiutata(q, { tipo: "NOMINA_SPIA", da: "g3", bersaglio: "g3" })).toBe(true); // non se stessi
    for (const id of ["g2", "g3", "g4"]) q = fai(q, { tipo: "NOMINA_SPIA", da: id, bersaglio: "g1" }).partita;
    q = fai(q, { tipo: "NOMINA_SPIA", da: "g1", bersaglio: "g5" }).partita;
    const nomina = avanza(q);
    expect(g(nomina.partita, "g1").stato).toBe("LICENZIATO");
    expect(nomina.eventi.find((e) => e.tipo === "RIVELAZIONE_NOMINE")).toBeDefined();
    expect(nomina.eventi.find((e) => e.tipo === "LICENZIAMENTO")!.causa).toContain("spia");
    expect(nomina.partita.fase.nome).toBe("PUNTEGGIO"); // 5 giocatori: niente secondo giro
  });

  it("parità → ballottaggio tra i pari; nuova parità → licenziati entrambi", () => {
    let q = vaiA(conSpia(nuova()), "NOMINA", 4);
    q = fai(q, { tipo: "NOMINA_SPIA", da: "g1", bersaglio: "g2" }).partita;
    q = fai(q, { tipo: "NOMINA_SPIA", da: "g2", bersaglio: "g1" }).partita;
    const primo = avanza(q);
    expect(primo.partita.fase).toMatchObject({ nome: "NOMINA", ballottaggio: true });
    expect(primo.partita.finale.ballottaggio.sort()).toEqual(["g1", "g2"]);
    q = primo.partita;
    expect(rifiutata(q, { tipo: "NOMINA_SPIA", da: "g3", bersaglio: "g4" })).toBe(true); // solo tra i pari
    q = fai(q, { tipo: "NOMINA_SPIA", da: "g3", bersaglio: "g1" }).partita;
    q = fai(q, { tipo: "NOMINA_SPIA", da: "g4", bersaglio: "g2" }).partita;
    const secondo = avanza(q);
    expect(g(secondo.partita, "g1").stato).toBe("LICENZIATO");
    expect(g(secondo.partita, "g2").stato).toBe("LICENZIATO");
  });

  it("con 8 giocatori si fa un secondo giro dalla verifica", () => {
    let q = vaiA(conSpia(nuova(8)), "NOMINA", 4);
    for (const id of ["g2", "g3", "g4"]) q = fai(q, { tipo: "NOMINA_SPIA", da: id, bersaglio: "g5" }).partita;
    const dopo = avanza(q).partita;
    expect(dopo.fase).toMatchObject({ nome: "VERIFICA", giro: 2 });
  });
});

describe("punteggio (GDD §16, segnaposto)", () => {
  const v = ambiente.config.punteggio;

  function finoAlPunteggio(p: Partita, prepara?: (q: Partita) => Partita): Partita {
    let q = vaiA(p, "VERIFICA", 4);
    if (prepara) q = prepara(q);
    while (q.fase.nome !== "PUNTEGGIO") q = avanza(q).partita;
    return q;
  }

  it("ogni giocatore ha un totale uguale alla somma delle sue voci spiegate", () => {
    const q = finoAlPunteggio(conSpia(nuova()));
    for (const gioc of q.giocatori) {
      const p = q.punteggi![gioc.id]!;
      expect(p.totale).toBe(p.voci.reduce((s, x) => s + x.punti, 0));
      for (const voce of p.voci) expect(voce.testo.length).toBeGreaterThan(0);
    }
  });

  it("azienda davanti → bonus agli onesti; concorrente davanti → bonus alla sua spia; pari → nessuno (F5)", () => {
    const base = conSpia(nuova());
    const conQuote = (azienda: number, concorrente: number) =>
      finoAlPunteggio(base, (q) => {
        const r = structuredClone(q);
        r.azienda.quota = azienda;
        r.concorrenti[0]!.quota = concorrente;
        return r;
      });
    const voce = (q: Partita, id: string, parola: string) => q.punteggi![id]!.voci.some((x) => x.testo.includes(parola));
    expect(voce(conQuote(10, 5), "g2", "battuto")).toBe(true);
    expect(voce(conQuote(5, 10), "g1", "superato")).toBe(true);
    const pari = conQuote(7, 7);
    expect(voce(pari, "g2", "battuto")).toBe(false);
    expect(voce(pari, "g1", "superato")).toBe(false);
  });

  it("tutti sì con la spia ancora dentro → grande bonus alla spia", () => {
    const q = finoAlPunteggio(conSpia(nuova()), (r) => {
      let s = r;
      for (const id of ["g1", "g2", "g3", "g4", "g5"]) s = fai(s, { tipo: "VERIFICA_FINALE", da: id, soloOnesti: true }).partita;
      return s;
    });
    expect(q.punteggi!["g1"]!.voci).toContainEqual(expect.objectContaining({ punti: v.tuttiSiConSpia }));
  });

  it("spia licenziata nel finale → bonus agli onesti e a chi l'ha nominata, penalità alla spia", () => {
    const q = finoAlPunteggio(conSpia(nuova()), (r) => {
      let s = avanza(r).partita; // verifica: tutti no per tempo scaduto → nomina
      for (const id of ["g2", "g3", "g4"]) s = fai(s, { tipo: "NOMINA_SPIA", da: id, bersaglio: "g1" }).partita;
      return s;
    });
    expect(q.punteggi!["g1"]!.voci).toContainEqual(expect.objectContaining({ punti: v.spiaLicenziataPenalita }));
    expect(q.punteggi!["g2"]!.voci).toContainEqual(expect.objectContaining({ punti: v.spiaLicenziataBonusNominatori }));
    expect(q.punteggi!["g5"]!.voci).toContainEqual(expect.objectContaining({ punti: v.spiaLicenziataBonusOnesti }));
  });

  it("spia licenziata → niente bonus anche se il suo concorrente vince (D-025)", () => {
    const q = finoAlPunteggio(conSpia(nuova()), (r) => {
      let s = structuredClone(r);
      s.azienda.quota = 5;
      s.concorrenti[0]!.quota = 10;
      s = avanza(s).partita;
      for (const id of ["g2", "g3", "g4"]) s = fai(s, { tipo: "NOMINA_SPIA", da: id, bersaglio: "g1" }).partita;
      return s;
    });
    expect(q.giocatori.find((g) => g.id === "g1")!.stato).toBe("LICENZIATO");
    expect(q.punteggi!["g1"]!.voci.some((x) => x.testo.includes("superato"))).toBe(false);
  });

  it("onesto licenziato → penalità a lui e a chi l'ha nominato (D-026)", () => {
    const q = finoAlPunteggio(conSpia(nuova()), (r) => {
      let s = avanza(r).partita;
      for (const id of ["g1", "g3", "g4"]) s = fai(s, { tipo: "NOMINA_SPIA", da: id, bersaglio: "g2" }).partita;
      return s;
    });
    expect(q.giocatori.find((g) => g.id === "g2")!.stato).toBe("LICENZIATO");
    expect(q.punteggi!["g2"]!.voci).toContainEqual(expect.objectContaining({ punti: v.onestoLicenziatoPenalita }));
    expect(q.punteggi!["g3"]!.voci).toContainEqual(expect.objectContaining({ punti: v.onestoLicenziatoPenalitaNominatori }));
  });

  it("spia ancora demansionata a fine anno → licenziata: penalità a lei, bonus agli onesti (D-027)", () => {
    const q = finoAlPunteggio(demansionaG2(conSpia(nuova(), ["g2"])));
    expect(q.giocatori.find((g) => g.id === "g2")!.stato).toBe("LICENZIATO");
    expect(q.punteggi!["g2"]!.voci).toContainEqual(expect.objectContaining({ punti: v.spiaLicenziataPenalita }));
    expect(q.punteggi!["g3"]!.voci).toContainEqual(expect.objectContaining({ punti: v.spiaLicenziataBonusOnesti }));
  });

  it("decisione finale: punti come la nomina; chi promuove una spia paga come chi licenzia un onesto (D-028)", () => {
    const v2 = v;
    // g2 è la spia, demansionata; g3 e g4 votano licenzia, g5 promuovi, g1 (onesto qui) non vota.
    const spiaLicenziata = finoAlPunteggio(demansionaG2(conSpia(nuova(), ["g2"])), (r) => r);
    expect(spiaLicenziata.punteggi!["g3"]!.voci.some((x) => x.punti === v2.spiaLicenziataBonusNominatori)).toBe(false); // nessun voto espresso
    const conVoti = (voti: Record<string, "SI" | "NO">, spia: string[]) => {
      let q = vaiA(demansionaG2(conSpia(nuova(), spia)), "DECISIONE_FINALE", 4);
      for (const [id, voto] of Object.entries(voti)) q = fai(q, { tipo: "VOTA_PROMOZIONE", da: id, voto }).partita;
      return finoAlPunteggio(q);
    };
    const a = conVoti({ g3: "NO", g4: "NO", g5: "NO", g1: "SI" }, ["g2"]);
    expect(a.punteggi!["g3"]!.voci).toContainEqual(expect.objectContaining({ punti: v2.spiaLicenziataBonusNominatori }));
    const b = conVoti({ g3: "SI", g4: "SI", g5: "SI", g1: "NO" }, ["g2"]);
    expect(g(b, "g2").stato).not.toBe("DEMANSIONATO");
    expect(b.punteggi!["g3"]!.voci.some((x) => x.testo.includes("promuovere una spia"))).toBe(true);
    const c = conVoti({ g3: "NO", g4: "NO", g5: "NO", g1: "SI" }, ["g1"]);
    expect(c.punteggi!["g3"]!.voci).toContainEqual(expect.objectContaining({ punti: v2.onestoLicenziatoPenalitaNominatori }));
    expect(c.punteggi!["g1"]!.voci).toContainEqual(expect.objectContaining({ punti: v2.onestoLicenziatoBonusSpie }));
  });

  it("chi vota per demansionare un onesto perde punti (🟡 GDD §13.3)", () => {
    const q = finoAlPunteggio(demansionaG2(conSpia(nuova())));
    expect(q.punteggi!["g3"]!.voci).toContainEqual(expect.objectContaining({ punti: v.demansionamentoOnestoPenalitaPerVoto }));
  });
});
