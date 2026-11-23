import { creaEAvvia } from "./aiuti.js";
import { describe, expect, it } from "vitest";
import type { Azione, Evento } from "../src/azioni.js";
import { caricaAmbiente } from "../src/contenuti.js";
import { applica } from "../src/motore.js";
import type { Fazione, Giocatore, Partita } from "../src/tipi.js";
import { vistaGiocatore, vistaTV } from "../src/viste.js";

/**
 * Finale "Rinnovo dei contratti" (GDD §15 · D-058) e punteggio (§16 · D-059).
 */
const ambiente = caricaAmbiente();

function nuova(n = 5, seme = 3): Partita {
  const esito = creaEAvvia(Array.from({ length: n }, (_, i) => ({ id: `g${i + 1}`, nome: `G${i + 1}` })), seme, ambiente);
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

/** Imposta le fazioni in modo noto: g1 spia del concorrente A, gli altri onesti. */
function conSpia(p: Partita, ids: string[] = ["g1"], concorrente = "A"): Partita {
  const q = structuredClone(p);
  for (const g of q.giocatori) g.fazione = ids.includes(g.id) ? ({ tipo: "SPIA", concorrente } as Fazione) : { tipo: "ONESTO" };
  return q;
}

const g = (p: Partita, id: string): Giocatore => p.giocatori.find((x) => x.id === id)!;

/** Avanza fino alla domanda del finale. */
function allaDomanda(p: Partita): Partita {
  let q = p;
  for (let i = 0; i < 200 && q.fase.nome !== "DOMANDA"; i++) q = avanza(q).partita;
  if (q.fase.nome !== "DOMANDA") throw new Error("Domanda del finale non raggiunta");
  return q;
}

/** Risponde alla domanda (le risposte non date valgono "No") e chiude. */
function rispondi(p: Partita, si: string[], no: string[] = []): { partita: Partita; eventi: Evento[] } {
  let q = p;
  for (const id of si) q = fai(q, { tipo: "DOMANDA_SPIA", da: id, risposta: "SI" }).partita;
  for (const id of no) q = fai(q, { tipo: "DOMANDA_SPIA", da: id, risposta: "NO" }).partita;
  return avanza(q);
}

/** Registra i voti (nomi o ballottaggio) e chiude il turno. */
function vota(p: Partita, voti: Record<string, string>): { partita: Partita; eventi: Evento[] } {
  let q = p;
  for (const [da, bersaglio] of Object.entries(voti)) q = fai(q, { tipo: "NOMINA_SPIA", da, bersaglio }).partita;
  return avanza(q);
}

/** Dalla domanda con tutti "sì" ai nomi. */
const aiNomi = (p: Partita) => rispondi(allaDomanda(p), p.giocatori.map((x) => x.id)).partita;

describe("finale: la domanda \"C'è una spia?\" (D-058)", () => {
  it("dopo i risultati del 4° trimestre si passa alla domanda", () => {
    const q = allaDomanda(nuova());
    expect(q.trimestre).toBe(4);
    expect(q.fase).toEqual({ nome: "DOMANDA", giro: 1 });
  });

  it("si procede se i sì sono almeno la metà (50/50 = si procede)", () => {
    const sei = allaDomanda(nuova(6));
    expect(rispondi(sei, ["g1", "g2", "g3"], ["g4", "g5", "g6"]).partita.fase.nome).toBe("NOMINA");
    expect(rispondi(sei, ["g1", "g2"], ["g3", "g4", "g5", "g6"]).partita.fase.nome).toBe("PUNTEGGIO");
  });

  it("chi non risponde in tempo vale \"No\"", () => {
    const q = allaDomanda(nuova(5));
    const { partita, eventi } = rispondi(q, ["g1", "g2"]); // 2 sì, 3 tempi scaduti = no
    expect(partita.fase.nome).toBe("PUNTEGGIO");
    const esito = partita.finale.esitiDomanda[0]!;
    expect([...esito.si].sort()).toEqual(["g1", "g2"]);
    expect([...esito.tempoScaduto].sort()).toEqual(["g3", "g4", "g5"]);
    expect(esito.procede).toBe(false);
    expect(eventi.find((e) => e.tipo === "ESITO_DOMANDA")?.causa).toContain("tempo scaduto");
  });

  it("voto palese, ma solo a fine voto: prima la TV vede chi ha risposto, non cosa", () => {
    const q = fai(allaDomanda(nuova()), { tipo: "DOMANDA_SPIA", da: "g2", risposta: "SI" }).partita;
    const tv = vistaTV(q, ambiente);
    expect(tv.finale.hannoRisposto).toEqual(["g2"]);
    expect(JSON.stringify(tv.finale)).not.toContain('"SI"');
    expect(vistaGiocatore(q, "g2", ambiente).mieiVoti.domanda).toBe("SI");
    expect(vistaGiocatore(q, "g3", ambiente).mieiVoti.domanda).toBeUndefined();
    const dopo = rispondi(q, []).partita;
    expect(vistaTV(dopo, ambiente).finale.esitiDomanda[0]!.si).toEqual(["g2"]);
  });

  it("rispondono solo i membri del direttivo, e solo durante la domanda", () => {
    const q = allaDomanda(nuova());
    q.giocatori.find((x) => x.id === "g5")!.stato = "LICENZIATO";
    expect(rifiutata(q, { tipo: "DOMANDA_SPIA", da: "g5", risposta: "SI" })).toBe(true);
    expect(rifiutata(nuova(), { tipo: "DOMANDA_SPIA", da: "g1", risposta: "SI" })).toBe(true);
  });
});

describe("finale: i nomi (D-058)", () => {
  it("più della metà dei nomi fatti → licenziato subito, ruolo rivelato", () => {
    const q = aiNomi(conSpia(nuova()));
    const { partita, eventi } = vota(q, { g2: "g1", g3: "g1", g4: "g1", g1: "g2" }); // 3 su 4
    expect(g(partita, "g1").stato).toBe("LICENZIATO");
    expect(eventi.find((e) => e.tipo === "LICENZIAMENTO")?.causa).toContain("spia");
    expect(partita.fase.nome).toBe("PUNTEGGIO");
  });

  it("la maggioranza si conta sui votanti: chi non fa un nome non conta", () => {
    // 2 nomi su 3 votanti (2 non votano): 2 ≥ metà più uno di 3.
    const { partita } = vota(aiNomi(nuova()), { g2: "g1", g3: "g1", g4: "g5" });
    expect(g(partita, "g1").stato).toBe("LICENZIATO");
  });

  it("nessun nome → nessun licenziamento", () => {
    const { partita, eventi } = vota(aiNomi(nuova()), {});
    expect(partita.giocatori.every((x) => x.stato === "ATTIVO")).toBe(true);
    expect(eventi.some((e) => e.tipo === "NESSUN_LICENZIAMENTO")).toBe(true);
  });

  it("non si fa il proprio nome né quello di un licenziato", () => {
    const q = aiNomi(nuova());
    expect(rifiutata(q, { tipo: "NOMINA_SPIA", da: "g1", bersaglio: "g1" })).toBe(true);
    q.giocatori.find((x) => x.id === "g5")!.stato = "LICENZIATO";
    expect(rifiutata(q, { tipo: "NOMINA_SPIA", da: "g1", bersaglio: "g5" })).toBe(true);
  });

  it("i nomi restano segreti fino alla rivelazione, che li mostra uno alla volta", () => {
    let q = aiNomi(nuova());
    q = fai(q, { tipo: "NOMINA_SPIA", da: "g2", bersaglio: "g3" }).partita;
    expect(vistaTV(q, ambiente).finale.hannoVotato).toEqual(["g2"]);
    expect(vistaTV(q, ambiente).finale.votazioni).toEqual([]);
    expect(JSON.stringify(vistaTV(q, ambiente))).not.toContain('"bersaglio"');
    expect(vistaGiocatore(q, "g4", ambiente).mieiVoti.nomina).toBeUndefined();
    const { partita, eventi } = vota(q, { g4: "g3", g5: "g3" });
    expect(eventi.find((e) => e.tipo === "RIVELAZIONE_NOMINE")).toBeDefined();
    expect(vistaTV(partita, ambiente).finale.votazioni[0]!.voti).toHaveLength(3);
  });

  it("senza maggioranza: ballottaggio tra il primo e il secondo, con tutti i pari merito", () => {
    // 6 giocatori: g1 2 nomi, g2 1, g3 1, g4 1, g5 1 → g1 + tutti i secondi a pari merito.
    const q = aiNomi(nuova(6));
    const { partita } = vota(q, { g2: "g1", g3: "g1", g1: "g2", g4: "g3", g5: "g4", g6: "g5" });
    expect(partita.fase).toEqual({ nome: "BALLOTTAGGIO", giro: 1, turno: 1 });
    expect(partita.finale.ballottaggio).toMatchObject({ percorso: "TRE" });
    expect([...partita.finale.ballottaggio!.candidati].sort()).toEqual(["g1", "g2", "g3", "g4", "g5"]);
  });

  it("parità in testa tra due: ballottaggio a due", () => {
    const { partita } = vota(aiNomi(nuova()), { g3: "g1", g4: "g1", g5: "g2", g1: "g2" });
    expect(partita.finale.ballottaggio).toMatchObject({ percorso: "DUE", turno: 1 });
    expect([...partita.finale.ballottaggio!.candidati].sort()).toEqual(["g1", "g2"]);
  });
});

describe("finale: il ballottaggio (D-058)", () => {
  /** 5 giocatori: ballottaggio a due tra g1 e g2 (votano g3, g4, g5). */
  const aDue = () => vota(aiNomi(nuova()), { g3: "g1", g4: "g1", g5: "g2", g1: "g2" }).partita;

  it("chi è al ballottaggio non vota, e si sceglie solo tra i candidati", () => {
    const q = aDue();
    expect(rifiutata(q, { tipo: "NOMINA_SPIA", da: "g1", bersaglio: "g2" })).toBe(true);
    expect(rifiutata(q, { tipo: "NOMINA_SPIA", da: "g3", bersaglio: "g4" })).toBe(true);
    expect(vistaTV(q, ambiente).finale.ballottaggio?.votanti.sort()).toEqual(["g3", "g4", "g5"]);
  });

  it("a due: vince chi ha la maggioranza dei voti dati", () => {
    const { partita } = vota(aDue(), { g3: "g2", g4: "g2", g5: "g1" });
    expect(g(partita, "g2").stato).toBe("LICENZIATO");
    expect(g(partita, "g1").stato).toBe("ATTIVO");
  });

  it("a due: uno stallo → si rivota; il secondo stallo licenzia entrambi", () => {
    const primo = vota(aDue(), { g3: "g1", g4: "g2" }).partita; // 1-1 (g5 non vota)
    expect(primo.fase).toEqual({ nome: "BALLOTTAGGIO", giro: 1, turno: 2 });
    const secondo = vota(primo, { g3: "g1", g4: "g2" }).partita;
    expect(g(secondo, "g1").stato).toBe("LICENZIATO");
    expect(g(secondo, "g2").stato).toBe("LICENZIATO");
    expect(secondo.fase.nome).toBe("PUNTEGGIO");
  });

  /** 7 giocatori: ballottaggio a tre tra g1, g2, g3 (votano g4…g7). */
  const aTre = () => vota(aiNomi(nuova(7)), { g4: "g1", g5: "g2", g6: "g3", g7: "g1", g1: "g2", g2: "g3", g3: "g4" }).partita;

  it("a tre: basta la maggioranza relativa (2-1-1)", () => {
    const q = aTre();
    expect([...q.finale.ballottaggio!.candidati].sort()).toEqual(["g1", "g2", "g3"]);
    const { partita } = vota(q, { g4: "g1", g5: "g1", g6: "g2", g7: "g3" });
    expect(g(partita, "g1").stato).toBe("LICENZIATO");
  });

  it("a tre: stallo → avvertimento e nuova votazione tra chi è in testa; si resta nel percorso a tre anche se restano in due", () => {
    const { partita, eventi } = vota(aTre(), { g4: "g1", g5: "g1", g6: "g2", g7: "g2" }); // 2-2-0
    expect(eventi.find((e) => e.tipo === "AVVISO_BALLOTTAGGIO")?.causa).toContain("non verrà licenziato nessuno");
    expect(partita.finale.ballottaggio).toMatchObject({ percorso: "TRE", turno: 2 });
    expect([...partita.finale.ballottaggio!.candidati].sort()).toEqual(["g1", "g2"]);
  });

  it("a tre, ultima votazione: chi ha votato due volte lo stesso nome non può rivotarlo; nuovo stallo → nessun licenziato", () => {
    const t2 = vota(aTre(), { g4: "g1", g5: "g1", g6: "g2", g7: "g2" }).partita;
    const t3 = vota(t2, { g4: "g1", g5: "g2", g6: "g2", g7: "g1" }).partita; // 2-2: g4 e g6 hanno ripetuto il voto
    expect(t3.fase).toEqual({ nome: "BALLOTTAGGIO", giro: 1, turno: 3 });
    expect(rifiutata(t3, { tipo: "NOMINA_SPIA", da: "g4", bersaglio: "g1" })).toBe(true);
    expect(rifiutata(t3, { tipo: "NOMINA_SPIA", da: "g6", bersaglio: "g2" })).toBe(true);
    expect(rifiutata(t3, { tipo: "NOMINA_SPIA", da: "g5", bersaglio: "g2" })).toBe(false); // ha cambiato voto: tutti i nomi
    expect(vistaGiocatore(t3, "g4", ambiente).mieiVoti.nomeBloccato).toBe("g1");
    const { partita, eventi } = vota(t3, { g4: "g2", g5: "g1", g6: "g1", g7: "g2" }); // ancora 2-2
    expect(partita.giocatori.every((x) => x.stato === "ATTIVO")).toBe(true);
    expect(eventi.some((e) => e.tipo === "NESSUN_LICENZIAMENTO")).toBe(true);
    expect(partita.fase.nome).toBe("PUNTEGGIO");
  });

  it("se tutti sono al ballottaggio, votano anche i candidati (non per sé)", () => {
    // 4 giocatori, ognuno fa un nome diverso: 1-1-1-1, tutti candidati.
    const q = vota(aiNomi(nuova(4)), { g1: "g2", g2: "g3", g3: "g4", g4: "g1" }).partita;
    expect(q.finale.ballottaggio!.candidati).toHaveLength(4);
    expect(rifiutata(q, { tipo: "NOMINA_SPIA", da: "g1", bersaglio: "g1" })).toBe(true);
    const { partita } = vota(q, { g1: "g2", g3: "g2", g4: "g2", g2: "g1" });
    expect(g(partita, "g2").stato).toBe("LICENZIATO");
  });
});

describe("finale con 8 giocatori: secondo giro (D-058)", () => {
  it("un solo licenziato nel primo giro → secondo giro dalla domanda", () => {
    const q = aiNomi(nuova(8));
    const voti = Object.fromEntries(["g2", "g3", "g4", "g5", "g6"].map((id) => [id, "g1"]));
    const { partita } = vota(q, voti);
    expect(g(partita, "g1").stato).toBe("LICENZIATO");
    expect(partita.fase).toEqual({ nome: "DOMANDA", giro: 2 });
    expect(rifiutata(partita, { tipo: "DOMANDA_SPIA", da: "g1", risposta: "SI" })).toBe(true);
  });

  it("due licenziati (doppio stallo) → niente secondo giro", () => {
    let q = vota(aiNomi(nuova(8)), { g3: "g1", g4: "g1", g5: "g2", g6: "g2" }).partita;
    q = vota(q, { g3: "g1", g4: "g2" }).partita;
    q = vota(q, { g3: "g1", g4: "g2" }).partita;
    expect(q.giocatori.filter((x) => x.stato === "LICENZIATO")).toHaveLength(2);
    expect(q.fase.nome).toBe("PUNTEGGIO");
  });

  it("con meno di 8 giocatori il secondo giro non c'è", () => {
    const { partita } = vota(aiNomi(nuova(7)), { g2: "g1", g3: "g1", g4: "g1", g5: "g1" });
    expect(partita.fase.nome).toBe("PUNTEGGIO");
  });
});

describe("punteggio finale (GDD §16 · D-059)", () => {
  function finoAlPunteggio(p: Partita, prepara?: (q: Partita) => Partita): Partita {
    let q = allaDomanda(p);
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

  it("azienda davanti → bonus agli onesti; concorrente davanti → bonus alla sua spia; pari → nessuno", () => {
    const base = conSpia(nuova());
    const conQuote = (azienda: number, concorrente: number) =>
      finoAlPunteggio(base, (q) => {
        const r = structuredClone(q);
        r.azienda.quota = azienda;
        r.concorrenti[0]!.quota = concorrente;
        delete r.risultatiRinviati;
        return r;
      });
    const voce = (q: Partita, id: string, parola: string) => q.punteggi![id]!.voci.some((x) => x.testo.includes(parola));
    expect(voce(conQuote(10, 5), "g2", "battuto")).toBe(true);
    expect(voce(conQuote(5, 10), "g1", "superato")).toBe(true);
    const pari = conQuote(7, 7);
    expect(voce(pari, "g2", "battuto")).toBe(false);
    expect(voce(pari, "g1", "superato")).toBe(false);
  });

  it("spia licenziata → niente bonus anche se il suo concorrente vince (D-025), e nessun'altra voce del finale (D-059)", () => {
    const prima = (q: Partita) => {
      const s = structuredClone(q);
      s.azienda.quota = 5;
      s.concorrenti[0]!.quota = 10;
      delete s.risultatiRinviati;
      return s;
    };
    const licenziata = finoAlPunteggio(conSpia(nuova()), (r) => vota(rispondi(prima(r), ["g2", "g3", "g4"]).partita, { g2: "g1", g3: "g1", g4: "g1" }).partita);
    const libera = finoAlPunteggio(conSpia(nuova()), prima);
    expect(g(licenziata, "g1").stato).toBe("LICENZIATO");
    expect(licenziata.punteggi!["g1"]!.voci.some((x) => x.testo.includes("superato"))).toBe(false);
    expect(libera.punteggi!["g1"]!.voci.some((x) => x.testo.includes("superato"))).toBe(true);
    // Gli onesti che l'hanno nominata hanno lo stesso punteggio che senza finale.
    for (const id of ["g2", "g3", "g4", "g5"]) expect(licenziata.punteggi![id]!.totale).toBe(libera.punteggi![id]!.totale);
  });

  it("onesto licenziato: nessuna penalità a lui né a chi l'ha nominato (D-059)", () => {
    const conLicenziato = finoAlPunteggio(conSpia(nuova()), (r) => vota(rispondi(r, ["g1", "g3", "g4"]).partita, { g1: "g2", g3: "g2", g4: "g2" }).partita);
    const senza = finoAlPunteggio(conSpia(nuova()));
    expect(g(conLicenziato, "g2").stato).toBe("LICENZIATO");
    for (const gioc of conLicenziato.giocatori) expect(conLicenziato.punteggi![gioc.id]!.totale).toBe(senza.punteggi![gioc.id]!.totale);
  });
});
