/**
 * Voto del pacchetto del trimestre (GDD §8.3 · D-068).
 */
import { creaEAvvia } from "./aiuti.js";
import { describe, expect, it } from "vitest";
import type { Azione, Evento } from "../src/azioni.js";
import { caricaAmbiente } from "../src/contenuti.js";
import { applica } from "../src/motore.js";
import type { Partita } from "../src/tipi.js";
import { vistaGiocatore, vistaTV } from "../src/viste.js";
import { chiavePacchetto, pacchettiValidi } from "../src/votazioni.js";

const ambiente = caricaAmbiente();

function fai(p: Partita, azione: Azione): { partita: Partita; eventi: Evento[] } {
  const esito = applica(p, azione, ambiente);
  if (!esito.ok) throw new Error(esito.errore);
  return { partita: esito.partita, eventi: esito.eventi };
}
const avanza = (p: Partita) => fai(p, { tipo: "AVANZA_FASE" });

/** Partita a n giocatori ferma sul voto del pacchetto del 1° trimestre. */
function alVoto(n = 5, seme = 11): Partita {
  const esito = creaEAvvia(Array.from({ length: n }, (_, i) => ({ id: `g${i + 1}`, nome: `G${i + 1}` })), seme, ambiente);
  if (!esito.ok) throw new Error(esito.errore);
  let p = esito.partita;
  while (p.fase.nome !== "VOTO_PACCHETTO") p = avanza(p).partita;
  return p;
}

/** I pacchetti del trimestre: la grande (80) e le due piccole (30 + 50). */
function pacchetti(p: Partita) {
  const [piccola, media, grande] = p.proposteTrimestre;
  return { grande: [grande!.id], duePiccole: [piccola!.id, media!.id] };
}

function votano(p: Partita, voti: Record<string, string[]>): Partita {
  let q = p;
  for (const [da, pacchetto] of Object.entries(voti)) q = fai(q, { tipo: "VOTA_PACCHETTO", da, pacchetto }).partita;
  return q;
}

describe("proposte del trimestre e pacchetti validi (D-068)", () => {
  it("tre proposte, una per costo, e con 100 K due pacchetti: la grande oppure le due piccole", () => {
    const p = alVoto();
    expect(p.proposteTrimestre.map((x) => x.costo)).toEqual([30, 50, 80]);
    const { grande, duePiccole } = pacchetti(p);
    expect(p.votoTrimestre!.pacchetti.map(chiavePacchetto).sort()).toEqual([chiavePacchetto(grande), chiavePacchetto(duePiccole)].sort());
  });

  it("con più cassa si aggiungono pacchetti più ricchi, sempre entro la cassa", () => {
    const p = alVoto();
    expect(pacchettiValidi(p.proposteTrimestre, 130, 51)).toHaveLength(4); // 80, 30+50, 30+80, 50+80
    expect(pacchettiValidi(p.proposteTrimestre, 160, 51)).toHaveLength(5); // + tutte e tre
  });

  it("un pacchetto sotto il minimo o sopra la cassa è rifiutato", () => {
    const p = alVoto();
    const [piccola, media, grande] = p.proposteTrimestre;
    expect(applica(p, { tipo: "VOTA_PACCHETTO", da: "g1", pacchetto: [media!.id] }, ambiente).ok).toBe(false);
    expect(applica(p, { tipo: "VOTA_PACCHETTO", da: "g1", pacchetto: [piccola!.id, grande!.id] }, ambiente).ok).toBe(false);
  });
});

describe("primo voto (D-068)", () => {
  it("più della metà dei membri sullo stesso pacchetto → approvato, si paga, si va alla mossa privata", () => {
    const p = alVoto();
    const { grande, duePiccole } = pacchetti(p);
    const { partita, eventi } = avanza(votano(p, { g1: grande, g2: grande, g3: grande, g4: duePiccole }));
    expect(partita.votoTrimestre!.approvato).toEqual(grande);
    expect(partita.votoTrimestre!.esito).toBe("PRIMO_VOTO");
    expect(partita.azienda.cassa).toBe(100 - 80);
    expect(partita.fase.nome).toBe("MOSSA_PRIVATA");
    const chiuso = eventi.find((e) => e.tipo === "VOTO_PACCHETTO_CHIUSO");
    expect(chiuso?.tipo === "VOTO_PACCHETTO_CHIUSO" && chiuso.voti.g5).toBe("TEMPO_SCADUTO");
  });

  it("la maggioranza si conta sui membri: chi non vota non aiuta nessuno", () => {
    const p = alVoto();
    const { grande } = pacchetti(p);
    // 2 voti su 5 membri: nessuna maggioranza anche se nessuno ha votato altro.
    const { partita } = avanza(votano(p, { g1: grande, g2: grande }));
    expect(partita.fase.nome).toBe("SECONDO_VOTO");
  });

  it("ognuno vale 1: niente pesi di reparto", () => {
    const p = alVoto();
    expect(p.proposteTrimestre.every((x) => !("pesi" in x))).toBe(true);
  });

  it("i voti restano segreti fino alla chiusura, poi la TV mostra chi ha votato cosa", () => {
    const p = alVoto();
    const { grande, duePiccole } = pacchetti(p);
    const q = votano(p, { g1: grande, g2: duePiccole });
    const tv = vistaTV(q, ambiente);
    expect(tv.votoTrimestre!.hannoVotato.sort()).toEqual(["g1", "g2"]);
    expect(tv.votoTrimestre!.voti).toBeUndefined();
    expect(vistaGiocatore(q, "g3", ambiente).votoTrimestre!.voti).toBeUndefined();
    expect(vistaGiocatore(q, "g1", ambiente).mieiVoti.pacchetto).toEqual(grande);
    const dopo = avanza(q).partita;
    expect(vistaTV(dopo, ambiente).votoTrimestre!.voti).toMatchObject({ g1: grande, g2: duePiccole, g3: "TEMPO_SCADUTO" });
  });
});

describe("secondo voto (D-068)", () => {
  function alSecondo() {
    const p = alVoto();
    const { grande, duePiccole } = pacchetti(p);
    // 2 per la grande, 1 per le due piccole: nessuna maggioranza, principale = la grande.
    const q = avanza(votano(p, { g1: grande, g2: grande, g3: duePiccole }));
    return { ...q, grande, duePiccole };
  }

  it("principale = il più votato; l'alternativa è coperta: la TV ne vede solo il numero di proposte", () => {
    const { partita, eventi, grande, duePiccole } = alSecondo();
    expect(partita.votoTrimestre!.principale).toEqual(grande);
    expect(partita.votoTrimestre!.alternativa).toEqual(duePiccole);
    const aperto = eventi.find((e) => e.tipo === "SECONDO_VOTO_APERTO");
    expect(aperto?.tipo === "SECONDO_VOTO_APERTO" && aperto.proposteAlternativa).toBe(2);
    expect(JSON.stringify(aperto)).not.toContain(duePiccole[0]!);
    for (const v of [vistaTV(partita, ambiente), vistaGiocatore(partita, "g1", ambiente)]) {
      expect(v.votoTrimestre!.proposteAlternativa).toBe(2);
      expect(JSON.stringify(v.votoTrimestre)).not.toContain("alternativa\"");
    }
  });

  it("maggioranza di sì → passa il principale", () => {
    let { partita } = alSecondo();
    for (const id of ["g1", "g2", "g3"]) partita = fai(partita, { tipo: "VOTA", da: id, voto: "SI" }).partita;
    const dopo = avanza(partita).partita;
    expect(dopo.votoTrimestre!.esito).toBe("PRINCIPALE");
    expect(dopo.proposteTrimestre.filter((x) => x.approvata).map((x) => x.costo)).toEqual([80]);
  });

  it("chi non vota vale no: senza maggioranza passa l'alternativa", () => {
    let { partita } = alSecondo();
    for (const id of ["g1", "g2"]) partita = fai(partita, { tipo: "VOTA", da: id, voto: "SI" }).partita;
    const { partita: dopo, eventi } = avanza(partita);
    expect(dopo.votoTrimestre!.esito).toBe("ALTERNATIVA");
    expect(dopo.proposteTrimestre.filter((x) => x.approvata).map((x) => x.costo)).toEqual([30, 50]);
    expect(dopo.azienda.cassa).toBe(100 - 80);
    const chiuso = eventi.find((e) => e.tipo === "SECONDO_VOTO_CHIUSO");
    expect(chiuso?.tipo === "SECONDO_VOTO_CHIUSO" && chiuso.voti.g5).toBe("TEMPO_SCADUTO");
  });

  it("nessun voto al primo turno: principale estratto tra tutti i pacchetti, e il trimestre si chiude comunque", () => {
    const p = alVoto();
    const { partita } = avanza(p);
    expect(partita.fase.nome).toBe("SECONDO_VOTO");
    const dopo = avanza(partita).partita;
    expect(dopo.votoTrimestre!.approvato).toEqual(dopo.votoTrimestre!.alternativa);
    expect(dopo.fase.nome).toBe("MOSSA_PRIVATA");
  });
});

describe("cassa senza tetto (D-068)", () => {
  it("avanza al massimo 20 K a trimestre e si accumula", () => {
    let p = alVoto();
    for (let t = 1; t <= 2; t++) {
      p = avanza(votano(p, Object.fromEntries(p.giocatori.map((g) => [g.id, pacchetti(p).grande])))).partita;
      while (p.fase.nome !== "VOTO_PACCHETTO") p = avanza(p).partita;
    }
    expect(p.trimestre).toBe(3);
    expect(p.azienda.cassa).toBe(140); // 20 + 20 avanzati + 100
    expect(p.votoTrimestre!.pacchetti.length).toBe(4);
  });
});
