import { creaEAvvia } from "./aiuti.js";
import { describe, expect, it } from "vitest";
import type { AzioneGiocatore, Evento } from "../src/azioni.js";
import { caricaAmbiente, type Ambiente } from "../src/contenuti.js";
import { applica } from "../src/motore.js";
import { calcolaPunteggi } from "../src/punteggio.js";
import { vistaGiocatore, vistaTV } from "../src/viste.js";
import type { Fazione, Giocatore, Partita, SegretoIstanza } from "../src/tipi.js";

const base = caricaAmbiente();
/** Ambiente senza casualità nei risultati, per controllare i conti. */
const amb: Ambiente = {
  ...base,
  config: {
    ...base.config,
    mossaPrivata: { ...base.config.mossaPrivata, rumore: [0] },
    concorrenti: { ...base.config.concorrenti, eventoCasuale: [0], crescitaBase: 0, crescitaPerGiocatore: 0 },
    autogestione: { ...base.config.autogestione, mossaPrivataDemansionati: false },
  },
};

function nuova(seme = 21, ambiente = amb): Partita {
  const esito = creaEAvvia(Array.from({ length: 5 }, (_, i) => ({ id: `g${i + 1}`, nome: `G${i + 1}` })), seme, ambiente);
  if (!esito.ok) throw new Error(esito.errore);
  return esito.partita;
}

function fai(p: Partita, azione: AzioneGiocatore | { tipo: "AVANZA_FASE" }, ambiente = amb): { partita: Partita; eventi: Evento[] } {
  const esito = applica(p, azione, ambiente);
  if (!esito.ok) throw new Error(esito.errore);
  return { partita: esito.partita, eventi: esito.eventi };
}

const rifiutata = (p: Partita, azione: AzioneGiocatore, ambiente = amb) => !applica(p, azione, ambiente).ok;

/** Avanza fino alla fase indicata (stesso trimestre). */
function vaiA(p: Partita, nome: string, votazione?: number): Partita {
  let attuale = p;
  for (let i = 0; i < 50; i++) {
    const f = attuale.fase;
    if (f.nome === nome && (votazione === undefined || ("votazione" in f && f.votazione === votazione))) return attuale;
    attuale = fai(attuale, { tipo: "AVANZA_FASE" }).partita;
  }
  throw new Error(`Fase ${nome} non raggiunta`);
}

const giocatoreDi = (p: Partita, reparto: string): Giocatore => p.giocatori.find((g) => g.repartoId === reparto)!;
const copiaDi = (p: Partita, s: SegretoIstanza, possessore: string) =>
  p.copieSegreto.find((c) => c.segretoId === s.id && c.possessore === possessore);
const indiceProposta = (p: Partita, s: SegretoIstanza) => p.proposteTrimestre.findIndex((x) => x.id === s.propostaCollegataId) + 1;

function rendiSpia(p: Partita, g: Giocatore): void {
  const fazione: Fazione = { tipo: "SPIA", concorrente: p.concorrenti[0]!.id };
  p.giocatori.find((x) => x.id === g.id)!.fazione = fazione;
}

describe("distribuzione dei segreti (Rapporto)", () => {
  it("ogni trimestre arrivano i segreti previsti, come «dato certo, arrivato al tuo reparto» alla fonte (D-035)", () => {
    const p = nuova();
    const delTrimestre = p.segreti.filter((s) => s.trimestre === 1);
    expect(delTrimestre).toHaveLength(amb.config.segreti.perTrimestre);
    for (const s of delTrimestre) {
      expect(s.fonte).not.toBe(s.utile);
      const fonte = giocatoreDi(p, s.fonte);
      const copia = copiaDi(p, s, fonte.id)!;
      expect(copia.provenienza).toEqual({ tipo: "GIOCO" });
      expect(copia.falsa).toBe(false);
      expect(p.proposteTrimestre.map((x) => x.id)).toContain(s.propostaCollegataId);
    }
  });

  it("l'avviso del segreto ricevuto è riservato alla fonte", () => {
    const esito = creaEAvvia(Array.from({ length: 5 }, (_, i) => ({ id: `g${i + 1}`, nome: `G${i + 1}` })), 21, amb);
    if (!esito.ok) throw new Error(esito.errore);
    for (const e of esito.eventi.filter((x) => x.tipo === "SEGRETO_RICEVUTO")) expect(e.riservatoA).toHaveLength(1);
  });

  it("le fonti si distribuiscono tra i reparti in modo equilibrato nell'arco della partita (D-005)", () => {
    let somma = 0;
    for (let seme = 0; seme < 100; seme++) {
      let p = nuova(seme);
      while (p.fase.nome !== "FINE") p = fai(p, { tipo: "AVANZA_FASE" }).partita;
      const conteggi = p.giocatori.map((g) => p.conteggioFontiSegreti[g.repartoId] ?? 0);
      somma += Math.max(...conteggi) - Math.min(...conteggi);
    }
    // 8 segreti su 5 reparti: lo squilibrio medio resta piccolo (il mazzo segnaposto limita le combinazioni).
    expect(somma / 100).toBeLessThanOrEqual(2);
  });
});

describe("messaggi privati (GDD §10, D-021)", () => {
  const p = nuova();
  const [a, b] = p.giocatori as [Giocatore, Giocatore];

  it("un messaggio costa 1, l'anonimo costa 2", () => {
    const dopo1 = fai(p, { tipo: "INVIA_MESSAGGIO", da: a.id, a: b.id, anonimo: false, modello: "SOLO_TESTO", testo: "Fidati di me" }).partita;
    expect(dopo1.giocatori.find((g) => g.id === a.id)!.quotaMessaggi).toBe(1);
    const dopo2 = fai(p, { tipo: "INVIA_MESSAGGIO", da: a.id, a: b.id, anonimo: true, modello: "SOLO_TESTO", testo: "Occhio" }).partita;
    expect(dopo2.giocatori.find((g) => g.id === a.id)!.quotaMessaggi).toBe(0);
  });

  it("senza quota sufficiente il messaggio è rifiutato (anche l'anonimo con 1 solo messaggio)", () => {
    const dopo1 = fai(p, { tipo: "INVIA_MESSAGGIO", da: a.id, a: b.id, anonimo: false, modello: "SOLO_TESTO", testo: "uno" }).partita;
    expect(rifiutata(dopo1, { tipo: "INVIA_MESSAGGIO", da: a.id, a: b.id, anonimo: true, modello: "SOLO_TESTO", testo: "due" })).toBe(true);
  });

  it("il demansionato non può mandare anonimi (D-021)", () => {
    const q = structuredClone(p);
    q.giocatori.find((g) => g.id === a.id)!.stato = "DEMANSIONATO";
    expect(rifiutata(q, { tipo: "INVIA_MESSAGGIO", da: a.id, a: b.id, anonimo: true, modello: "SOLO_TESTO", testo: "x" })).toBe(true);
  });

  it("testo oltre 80 caratteri, messaggio a se stessi o vuoto: rifiutati", () => {
    expect(rifiutata(p, { tipo: "INVIA_MESSAGGIO", da: a.id, a: b.id, anonimo: false, modello: "SOLO_TESTO", testo: "x".repeat(81) })).toBe(true);
    expect(rifiutata(p, { tipo: "INVIA_MESSAGGIO", da: a.id, a: a.id, anonimo: false, modello: "SOLO_TESTO", testo: "ciao" })).toBe(true);
    expect(rifiutata(p, { tipo: "INVIA_MESSAGGIO", da: a.id, a: b.id, anonimo: false, modello: "SOLO_TESTO" })).toBe(true);
  });

  it("l'avviso arriva solo al destinatario e, se anonimo, senza il nome del mittente", () => {
    const { eventi } = fai(p, { tipo: "INVIA_MESSAGGIO", da: a.id, a: b.id, anonimo: true, modello: "SOLO_TESTO", testo: "?" });
    expect(eventi[0]).toMatchObject({ tipo: "MESSAGGIO_RICEVUTO", riservatoA: [b.id] });
    expect(eventi[0]!.causa).not.toContain(a.nome);
  });

  it("con l'impostazione predefinita non si scrive durante la mossa privata; con 'tutto il trimestre' sì", () => {
    const inMossa = vaiA(p, "MOSSA_PRIVATA");
    const azione: AzioneGiocatore = { tipo: "INVIA_MESSAGGIO", da: a.id, a: b.id, anonimo: false, modello: "SOLO_TESTO", testo: "ehi" };
    expect(rifiutata(inMossa, azione)).toBe(true);
    const sempre: Ambiente = { ...amb, config: { ...amb.config, messaggi: { ...amb.config.messaggi, quando: "TUTTO_IL_TRIMESTRE" } } };
    expect(applica(inMossa, azione, sempre).ok).toBe(true);
  });
});

describe("inoltro dei segreti (GDD §11.2–11.4, D-015)", () => {
  const p = nuova();
  const s = p.segreti[0]!;
  const fonte = giocatoreDi(p, s.fonte);
  const altro = p.giocatori.find((g) => g.id !== fonte.id)!;
  const copiaFonte = copiaDi(p, s, fonte.id)!;
  const campo = Object.keys(s.campi)[0]!;

  it("inoltrato così com'è: copia vera; il destinatario vede solo il mittente diretto", () => {
    const q = fai(p, { tipo: "INVIA_MESSAGGIO", da: fonte.id, a: altro.id, anonimo: false, modello: "SEGRETO", copiaSegretoId: copiaFonte.id }).partita;
    const copia = copiaDi(q, s, altro.id)!;
    expect(copia.falsa).toBe(false);
    expect(copia.provenienza).toEqual({ tipo: "GIOCATORE", da: fonte.id, anonimo: false });
    expect(copia.catena).toEqual([fonte.id]);
  });

  it("inoltrato modificato: il gioco lo registra come falso", () => {
    const q = fai(p, {
      tipo: "INVIA_MESSAGGIO", da: fonte.id, a: altro.id, anonimo: false, modello: "SEGRETO",
      copiaSegretoId: copiaFonte.id, campi: { [campo]: "valore inventato" },
    }).partita;
    expect(copiaDi(q, s, altro.id)!.falsa).toBe(true);
  });

  it("non si inoltra un segreto che non si possiede, né campi inesistenti", () => {
    expect(rifiutata(p, { tipo: "INVIA_MESSAGGIO", da: altro.id, a: fonte.id, anonimo: false, modello: "SEGRETO", copiaSegretoId: copiaFonte.id })).toBe(true);
    expect(rifiutata(p, { tipo: "INVIA_MESSAGGIO", da: fonte.id, a: altro.id, anonimo: false, modello: "SEGRETO", copiaSegretoId: copiaFonte.id, campi: { inventato: 1 } })).toBe(true);
  });
});

describe("segreto arrivato in tempo (D-021)", () => {
  /** Prepara: segreto e partita, con la fonte pronta a inoltrare al reparto utile. */
  const prepara = () => {
    const p = nuova();
    const s = p.segreti[0]!;
    return { p, s, fonte: giocatoreDi(p, s.fonte), utile: giocatoreDi(p, s.utile), copia: copiaDi(p, s, giocatoreDi(p, s.fonte).id)! };
  };
  const quotaDopoRisultati = (p: Partita) => vaiA(p, "RISOLUZIONE");

  it("copia vera al reparto utile prima della chiusura del voto collegato → punti per l'azienda, senza dire quale segreto", () => {
    const { p, s, fonte, utile, copia } = prepara();
    const conSegreto = fai(p, { tipo: "INVIA_MESSAGGIO", da: fonte.id, a: utile.id, anonimo: false, modello: "SEGRETO", copiaSegretoId: copia.id }).partita;
    const senza = quotaDopoRisultati(p);
    const con = quotaDopoRisultati(conSegreto);
    expect(con.azienda.quota - senza.azienda.quota).toBe(s.valoreAzienda);
    // L'evento pubblico non nomina il segreto (D-021, S2).
    let q = conSegreto;
    const eventi: Evento[] = [];
    while (q.fase.nome !== "RISOLUZIONE") {
      const r = fai(q, { tipo: "AVANZA_FASE" });
      eventi.push(...r.eventi);
      q = r.partita;
    }
    const inTempo = eventi.find((e) => e.tipo === "SEGRETO_IN_TEMPO");
    expect(inTempo).toBeDefined();
    expect(inTempo!.causa).not.toContain(s.titolo);
  });

  it("copia arrivata dopo la chiusura del voto collegato → nessun valore", () => {
    const { p, s, fonte, utile, copia } = prepara();
    // Il segreto è collegato alla prima votazione; lo si inoltra nella discussione della seconda.
    s.propostaCollegataId = p.proposteTrimestre[0]!.id;
    expect(indiceProposta(p, s)).toBe(1);
    let q = vaiA(p, "DISCUSSIONE", 2);
    q = fai(q, { tipo: "INVIA_MESSAGGIO", da: fonte.id, a: utile.id, anonimo: false, modello: "SEGRETO", copiaSegretoId: copia.id }).partita;
    expect(copiaDi(q, s, utile.id)?.falsa).toBe(false); // la copia vera è arrivata, ma tardi
    expect(quotaDopoRisultati(q).segreti[0]!.arrivatoInTempo).toBe(false);
  });

  it("copia falsa al reparto utile → nessun valore", () => {
    const { p, s, fonte, utile, copia } = prepara();
    const campo = Object.keys(s.campi)[0]!;
    const q = fai(p, {
      tipo: "INVIA_MESSAGGIO", da: fonte.id, a: utile.id, anonimo: false, modello: "SEGRETO",
      copiaSegretoId: copia.id, campi: { [campo]: "falso" },
    }).partita;
    expect(quotaDopoRisultati(q).segreti[0]!.arrivatoInTempo).toBe(false);
  });
});

describe("ultimo trimestre: fuga di notizie annunciata subito, senza numeri (D-029, variante B)", () => {
  it("ai Risultati del 4° trimestre si vede il titolo del segreto, non l'effetto sul mercato", () => {
    let p = nuova();
    while (!(p.trimestre === 4 && p.fase.nome === "RAPPORTO")) p = fai(p, { tipo: "AVANZA_FASE" }).partita;
    p = structuredClone(p);
    const s = p.segreti.find((x) => x.trimestre === 4)!;
    const spia = giocatoreDi(p, s.fonte);
    rendiSpia(p, spia);
    let q = fai(p, { tipo: "PASSA_AL_CONCORRENTE", da: spia.id, copiaSegretoId: copiaDi(p, s, spia.id)!.id }).partita;
    let eventi: Evento[] = [];
    while (q.fase.nome !== "RISOLUZIONE") ({ partita: q, eventi } = fai(q, { tipo: "AVANZA_FASE" }));
    const fuga = eventi.find((e) => e.tipo === "FUGA_DI_NOTIZIE");
    expect(fuga).toBeDefined();
    expect(fuga!.causa).toContain(s.titolo);
    expect(fuga).not.toHaveProperty("variazione");
    expect(eventi.some((e) => e.tipo === "SEGRETO_USATO" || e.tipo === "CORSA_DI_MERCATO")).toBe(false);
  });
});

describe("la spia passa un segreto al concorrente (GDD §11.3, D-021)", () => {
  const prepara = () => {
    const p = nuova();
    const s = p.segreti[0]!;
    const fonte = giocatoreDi(p, s.fonte);
    rendiSpia(p, fonte);
    return { p, s, spia: fonte, copia: copiaDi(p, s, fonte.id)! };
  };

  it("copia vera: il concorrente avanza e la TV dice quale segreto ha usato", () => {
    const { p, s, spia, copia } = prepara();
    const { partita, eventi } = fai(p, { tipo: "PASSA_AL_CONCORRENTE", da: spia.id, copiaSegretoId: copia.id });
    expect(eventi[0]).toMatchObject({ tipo: "SEGRETO_CONSEGNATO", riservatoA: [spia.id] });
    let q = partita;
    const pubblici: Evento[] = [];
    while (q.fase.nome !== "RISOLUZIONE") {
      const r = fai(q, { tipo: "AVANZA_FASE" });
      pubblici.push(...r.eventi);
      q = r.partita;
    }
    expect(q.concorrenti[0]!.quota).toBe(s.valoreConcorrente);
    expect(pubblici.find((e) => e.tipo === "SEGRETO_USATO")!.causa).toContain(s.titolo);
    expect(q.segretiPassati[0]!.riuscito).toBe(true);
  });

  it("copia falsa: il concorrente perde punti e in TV si vede", () => {
    const { p, s, spia } = prepara();
    // Un altro giocatore riceve dalla spia... qui semplifichiamo: la spia riceve una versione falsa da un onesto.
    const onesto = p.giocatori.find((g) => g.id !== spia.id)!;
    const q0 = structuredClone(p);
    q0.copieSegreto.push({ id: "falsa", segretoId: s.id, possessore: spia.id, campi: { x: 1 }, falsa: true, provenienza: { tipo: "GIOCATORE", da: onesto.id, anonimo: false }, catena: [onesto.id] });
    const q = vaiA(fai(q0, { tipo: "PASSA_AL_CONCORRENTE", da: spia.id, copiaSegretoId: "falsa" }).partita, "RISOLUZIONE");
    expect(q.concorrenti[0]!.quota).toBe(-amb.config.segreti.penalitaFalsoConcorrente);
    expect(q.segretiPassati[0]!.riuscito).toBe(false);
  });

  it("solo le spie; mai due volte lo stesso segreto; non dopo il suo trimestre", () => {
    const { p, s, spia, copia } = prepara();
    const onesto = p.giocatori.find((g) => g.fazione.tipo === "ONESTO" && g.id !== spia.id)!;
    const q0 = structuredClone(p);
    q0.copieSegreto.push({ ...copia, id: "copia-onesto", possessore: onesto.id });
    expect(rifiutata(q0, { tipo: "PASSA_AL_CONCORRENTE", da: onesto.id, copiaSegretoId: "copia-onesto" })).toBe(true);

    const dopo = fai(p, { tipo: "PASSA_AL_CONCORRENTE", da: spia.id, copiaSegretoId: copia.id }).partita;
    expect(rifiutata(dopo, { tipo: "PASSA_AL_CONCORRENTE", da: spia.id, copiaSegretoId: copia.id })).toBe(true);

    let t2 = p;
    while (!(t2.trimestre === 2 && t2.fase.nome === "RAPPORTO")) t2 = fai(t2, { tipo: "AVANZA_FASE" }).partita;
    expect(rifiutata(t2, { tipo: "PASSA_AL_CONCORRENTE", da: spia.id, copiaSegretoId: copia.id })).toBe(true);
    void s;
  });
});

describe("contenuti veri dei segreti (D-035…D-039)", () => {
  const semi = Array.from({ length: 40 }, (_, i) => i + 1);
  /** Tutti i segreti di una partita, trimestre per trimestre (si avanza fino alla fine dell'anno). */
  const segretiDellAnno = (seme: number): Partita => {
    let p = nuova(seme, base);
    for (let i = 0; i < 400 && p.trimestre < base.config.trimestri; i++) p = fai(p, { tipo: "AVANZA_FASE" }, base).partita;
    return p;
  };

  it("il dato vero si estrae campo per campo tra i valori possibili, in modo riproducibile col seme", () => {
    const combinazioniViste = new Set<string>();
    for (const seme of semi) {
      const p = nuova(seme, base);
      for (const s of p.segreti) {
        const modello = base.segreti.find((m) => m.id === s.modelloId)!;
        for (const [nome, valore] of Object.entries(s.campi)) expect(modello.versioni.map((v) => v[nome])).toContain(valore);
        // Una combinazione che non è nessuna delle righe scritte prova l'estrazione campo per campo.
        if (!modello.versioni.some((v) => JSON.stringify(v) === JSON.stringify(s.campi))) combinazioniViste.add(s.modelloId);
      }
      expect(nuova(seme, base).segreti.map((s) => s.campi)).toEqual(p.segreti.map((s) => s.campi));
    }
    expect(combinazioniViste.size).toBeGreaterThan(0);
  });

  it("il valore per azienda e concorrente dipende dal tipo (config); mai due «da custodire» nello stesso trimestre", () => {
    for (const seme of semi.slice(0, 15)) {
      const p = segretiDellAnno(seme);
      for (const s of p.segreti) {
        expect(s.valoreAzienda).toBe(base.config.segreti.tipi[s.tipo].azienda);
        expect(s.valoreConcorrente).toBe(base.config.segreti.tipi[s.tipo].concorrente);
      }
      for (let t = 1; t <= p.trimestre; t++) {
        expect(p.segreti.filter((s) => s.trimestre === t && s.tipo === "DA_CUSTODIRE").length).toBeLessThanOrEqual(1);
      }
    }
  });

  it("il possessore vede il tipo e i valori suggeriti; l'elenco non rivela il vero (D-036, D-038)", () => {
    for (const seme of semi.slice(0, 10)) {
      const p = nuova(seme, base);
      for (const s of p.segreti) {
        const fonte = giocatoreDi(p, s.fonte);
        const copia = vistaGiocatore(p, fonte.id, base).mieiSegreti.find((c) => c.titolo === s.titolo)!;
        expect(copia.tipo).toBe(s.tipo);
        const modello = base.segreti.find((m) => m.id === s.modelloId)!;
        for (const nome of Object.keys(s.campi)) {
          // Stesso elenco qualunque sia il valore vero: tutti i valori possibili, in ordine alfabetico.
          const attesi = [...new Set(modello.versioni.map((v) => v[nome]!))].sort((a, b) => String(a).localeCompare(String(b), "it", { numeric: true }));
          expect(copia.valoriSuggeriti[nome]).toEqual(attesi);
        }
      }
      // La TV non vede né i segreti né i loro valori.
      expect(JSON.stringify(vistaTV(p, base))).not.toContain("valoriSuggeriti");
    }
  });

  it("una copia falsificata con un valore libero compare tra i suggerimenti solo per chi la possiede", () => {
    const p = nuova();
    const s = p.segreti[0]!;
    const fonte = giocatoreDi(p, s.fonte);
    const altro = p.giocatori.find((g) => g.id !== fonte.id)!;
    const campo = Object.keys(s.campi)[0]!;
    const copia = copiaDi(p, s, fonte.id)!;
    const q = fai(p, { tipo: "INVIA_MESSAGGIO", da: fonte.id, a: altro.id, anonimo: false, modello: "SEGRETO", copiaSegretoId: copia.id, campi: { [campo]: "valore inventato" } }).partita;
    expect(vistaGiocatore(q, altro.id, base).mieiSegreti[0]!.valoriSuggeriti[campo]).toContain("valore inventato");
    expect(vistaGiocatore(q, fonte.id, base).mieiSegreti.find((c) => c.titolo === s.titolo)!.valoriSuggeriti[campo]).not.toContain("valore inventato");
  });

  it("la spia prende i punti secondo il tipo del segreto usato (aggiunta a D-038)", () => {
    for (const tipo of ["DA_FAR_GIRARE", "NORMALE", "DA_CUSTODIRE"] as const) {
      const p = nuova();
      const s = p.segreti[0]!;
      s.tipo = tipo;
      const spia = giocatoreDi(p, s.fonte);
      rendiSpia(p, spia);
      p.segretiPassati.push({ copiaId: copiaDi(p, s, spia.id)!.id, segretoId: s.id, spia: spia.id, concorrente: p.concorrenti[0]!.id, trimestre: 1, riuscito: true });
      calcolaPunteggi(p, amb);
      const voce = p.punteggi![spia.id]!.voci.find((v) => v.testo === "Segreto usato dal tuo concorrente")!;
      expect(voce.punti).toBe(amb.config.segreti.tipi[tipo].puntiSpia);
    }
  });

  it("il segreto arrivato in tempo non mostra il numero in TV (D-038)", () => {
    const p = nuova();
    const s = p.segreti[0]!;
    s.arrivatoInTempo = true;
    let q = p;
    const eventi: Evento[] = [];
    while (q.fase.nome !== "RISOLUZIONE") {
      const r = fai(q, { tipo: "AVANZA_FASE" });
      eventi.push(...r.eventi);
      q = r.partita;
    }
    const e = eventi.find((x) => x.tipo === "SEGRETO_IN_TEMPO");
    expect(e).toBeDefined();
    expect(e!.causa).not.toMatch(/\d/);
  });
});
