/**
 * Obiettivi personali (D-046…D-052): assegnazione, scelta, verifica, punteggio, rivelazione finale.
 * La riservatezza delle viste è controllata anche nel test generale (riservatezza.test.ts).
 */
import { describe, expect, it } from "vitest";
import { creaEAvvia } from "./aiuti.js";
import type { Azione } from "../src/azioni.js";
import { caricaAmbiente, controllaObiettivi } from "../src/contenuti.js";
import { MISURE_NOTE } from "../src/misure.js";
import { applica } from "../src/motore.js";
import { valutaObiettivo, vociObiettivo } from "../src/obiettivi.js";
import { creaPartita } from "../src/partita.js";
import type { Partita, RegistroVotazione } from "../src/tipi.js";
import { vistaGiocatore, vistaTV } from "../src/viste.js";

const ambiente = caricaAmbiente();
const persone = (n: number) => Array.from({ length: n }, (_, i) => ({ id: `g${i + 1}`, nome: `G${i + 1}` }));
const modello = (id: string) => ambiente.obiettivi.find((o) => o.id === id)!;

function nuova(n = 5, seme = 7): Partita {
  const esito = creaPartita(persone(n), seme, ambiente);
  if (!esito.ok) throw new Error(esito.errore);
  return esito.partita;
}

function fai(p: Partita, azione: Azione) {
  const esito = applica(p, azione, ambiente);
  if (!esito.ok) throw new Error(esito.errore);
  return esito;
}

/** Partita avviata in cui g1 ha l'obiettivo indicato. */
function conObiettivo(obiettivo: string, n = 5): Partita {
  const esito = creaEAvvia(persone(n), 3, ambiente);
  if (!esito.ok) throw new Error(esito.errore);
  const p = esito.partita;
  p.obiettivi.g1 = { proposti: [obiettivo], scelto: obiettivo };
  return p;
}

function registro(r: Partial<RegistroVotazione>): RegistroVotazione {
  return {
    propostaId: "x", trimestre: 1, posizione: 1, votazioniDelTrimestre: 2, costo: 30, piuCostosa: false,
    approvata: true, effettoAzienda: 1, voti: {}, decisivi: [], cassaDopo: 100, ...r,
  };
}

describe("contenuti degli obiettivi", () => {
  it("la lista è valida: 34 obiettivi (12 / 11 / 11), 4 aziendalisti per tipo (D-052, D-053)", () => {
    expect(controllaObiettivi(ambiente.obiettivi, ambiente.config, MISURE_NOTE)).toEqual([]);
    for (const [tipo, quanti] of [[1, 12], [2, 11], [3, 11]] as const) {
      const delTipo = ambiente.obiettivi.filter((o) => o.tipo === tipo);
      expect(delTipo).toHaveLength(quanti);
      expect(delTipo.filter((o) => o.aziendalista)).toHaveLength(4);
    }
  });

  it("il controllo segnala misure sconosciute e tipi 1 con gradini incoerenti", () => {
    const sbagliato = structuredClone(modello("T1-01"));
    sbagliato.traguardi[1].soglia = 1;
    sbagliato.traguardi[0].misura = "INVENTATA";
    const problemi = controllaObiettivi([...ambiente.obiettivi.filter((o) => o.id !== "T1-01"), sbagliato], ambiente.config, MISURE_NOTE);
    expect(problemi.some((x) => x.includes("INVENTATA"))).toBe(true);
    expect(problemi.some((x) => x.includes("stessa misura"))).toBe(true);
  });
});

describe("assegnazione delle tre proposte (D-046, D-048, D-049)", () => {
  it("tre a testa, uno per tipo, nessuno ripetuto, spie solo aziendalisti", () => {
    let spieViste = 0;
    for (const n of [4, 5, 6, 7, 8]) {
      for (let seme = 0; seme < 60; seme++) {
        const p = nuova(n, seme);
        const tutti = p.giocatori.flatMap((g) => p.obiettivi[g.id]!.proposti);
        expect(new Set(tutti).size).toBe(tutti.length);
        for (const g of p.giocatori) {
          const proposti = p.obiettivi[g.id]!.proposti.map(modello);
          expect(proposti.map((o) => o.tipo).sort()).toEqual([1, 2, 3]);
          if (g.fazione.tipo === "SPIA") {
            spieViste++;
            expect(proposti.every((o) => o.aziendalista)).toBe(true);
          }
        }
      }
    }
    expect(spieViste).toBeGreaterThan(100);
  });

  it("gli onesti ricevono a volte anche aziendalisti (dichiararne uno non prova nulla, D-049)", () => {
    let aziendalisti = 0;
    for (let seme = 0; seme < 40; seme++) {
      const p = nuova(6, seme);
      for (const g of p.giocatori.filter((x) => x.fazione.tipo === "ONESTO")) aziendalisti += p.obiettivi[g.id]!.proposti.filter((id) => modello(id).aziendalista).length;
    }
    expect(aziendalisti).toBeGreaterThan(0);
  });
});

describe("scelta dell'obiettivo (D-048)", () => {
  it("la partita comincia con la scelta; si sceglie solo fra i propri tre e si può cambiare idea", () => {
    let p = nuova();
    expect(p.fase).toEqual({ nome: "SCELTA_OBIETTIVI" });
    expect(p.proposteTrimestre).toHaveLength(0);
    const [primo, secondo] = p.obiettivi.g1!.proposti;
    const altrui = p.obiettivi.g2!.proposti[0]!;
    expect(applica(p, { tipo: "SCEGLI_OBIETTIVO", da: "g1", obiettivo: altrui }, ambiente).ok).toBe(false);
    const esito = fai(p, { tipo: "SCEGLI_OBIETTIVO", da: "g1", obiettivo: primo! });
    // L'evento dice solo chi ha scelto, non cosa.
    expect(esito.eventi[0]).toEqual({ tipo: "OBIETTIVO_REGISTRATO", da: "g1", causa: "G1 ha scelto il suo obiettivo" });
    p = fai(esito.partita, { tipo: "SCEGLI_OBIETTIVO", da: "g1", obiettivo: secondo! }).partita;
    expect(p.obiettivi.g1!.scelto).toBe(secondo);
  });

  it("a tempo scaduto l'obiettivo si estrae a caso fra i tre, con un avviso riservato; poi parte il trimestre 1", () => {
    const p = fai(nuova(), { tipo: "SCEGLI_OBIETTIVO", da: "g1", obiettivo: nuova().obiettivi.g1!.proposti[2]! }).partita;
    const { partita, eventi } = fai(p, { tipo: "AVANZA_FASE" });
    expect(partita.fase).toEqual({ nome: "RAPPORTO" });
    expect(partita.trimestre).toBe(1);
    expect(partita.proposteTrimestre.length).toBeGreaterThan(0);
    expect(partita.obiettivi.g1!.sceltoACaso).toBeUndefined();
    for (const g of partita.giocatori.filter((x) => x.id !== "g1")) {
      const o = partita.obiettivi[g.id]!;
      expect(o.proposti).toContain(o.scelto);
      expect(o.sceltoACaso).toBe(true);
    }
    const avvisi = eventi.filter((e) => e.tipo === "OBIETTIVO_ASSEGNATO");
    expect(avvisi).toHaveLength(4);
    for (const a of avvisi) expect(a.riservatoA).toHaveLength(1);
    // Dopo la partenza non si cambia più.
    expect(applica(partita, { tipo: "SCEGLI_OBIETTIVO", da: "g1", obiettivo: partita.obiettivi.g1!.proposti[0]! }, ambiente).ok).toBe(false);
  });

  it("durante la scelta il telefono mostra le tre proposte con i punti; dopo, solo lo scelto", () => {
    const p = nuova();
    const v = vistaGiocatore(p, "g1", ambiente);
    expect(v.obiettivo.proposte!.map((o) => o.id)).toEqual(p.obiettivi.g1!.proposti);
    expect(v.obiettivo.proposte!.map((o) => o.traguardi.map((t) => t.punti))).toEqual([[3, 5], [3, 7], [4, 6]]);
    const avviata = fai(fai(p, { tipo: "SCEGLI_OBIETTIVO", da: "g1", obiettivo: p.obiettivi.g1!.proposti[0]! }).partita, { tipo: "AVANZA_FASE" }).partita;
    const dopo = vistaGiocatore(avviata, "g1", ambiente);
    expect(dopo.obiettivo.proposte).toBeUndefined();
    expect(dopo.obiettivo.scelto!.id).toBe(p.obiettivi.g1!.proposti[0]);
  });
});

describe("verifica dei traguardi (D-052)", () => {
  it("tipo 1 graduale: i due gradini si sommano (+3 e +5)", () => {
    const p = conObiettivo("T1-01"); // Bastian contrario 3 / 5
    p.storicoVotazioni = [1, 2, 3, 4, 5].map((i) => registro({ propostaId: `p${i}`, approvata: true, voti: { g1: "NO" } }));
    expect(valutaObiettivo(p, ambiente, "g1", "GIOCATORE").map((t) => t.stato)).toEqual(["RAGGIUNTO", "RAGGIUNTO"]);
    expect(vociObiettivo(p, ambiente, p.giocatori.find((g) => g.id === "g1")!).reduce((s, v) => s + v.punti, 0)).toBe(8);
  });

  it("contano solo i voti espressi: i voti scaduti no (R2)", () => {
    const p = conObiettivo("T1-01");
    p.storicoVotazioni = [registro({ approvata: true, voti: {} }), registro({ approvata: false, voti: { g1: "SI" } })];
    expect(valutaObiettivo(p, ambiente, "g1", "COMPLETA")[0]!.valore).toBe(1);
  });

  it("con il voto del pacchetto lo storico segna SÌ sulle proposte del pacchetto votato, NO sulle altre (provvisorio, D-071)", () => {
    let p = conObiettivo("T1-02");
    p.fase = { nome: "VOTO_PACCHETTO" };
    const [piccola, media, grande] = p.proposteTrimestre;
    for (const da of ["g1", "g2", "g3"]) p = fai(p, { tipo: "VOTA_PACCHETTO", da, pacchetto: [grande!.id] }).partita;
    p = fai(p, { tipo: "VOTA_PACCHETTO", da: "g4", pacchetto: [piccola!.id, media!.id] }).partita;
    p = fai(p, { tipo: "AVANZA_FASE" }).partita;
    const registro = (id: string) => p.storicoVotazioni.find((r) => r.propostaId === id)!;
    expect(registro(grande!.id)).toMatchObject({ approvata: true, piuCostosa: true, voti: { g1: "SI", g4: "NO" } });
    expect(registro(piccola!.id)).toMatchObject({ approvata: false, voti: { g1: "NO", g4: "SI" } });
    expect(registro(grande!.id).voti.g5).toBeUndefined(); // chi non vota non conta (R2)
  });

  it("gli effetti si contano solo quando sono rivelati: l'ultimo trimestre al punteggio (D-029, R1)", () => {
    const p = conObiettivo("T1-11"); // Occhio clinico: SÌ a proposte positive
    p.storicoVotazioni = [registro({ trimestre: 1, voti: { g1: "SI" } }), registro({ trimestre: 2, voti: { g1: "SI" } })];
    p.storicoTrimestri = [{ trimestre: 1, mosseScelte: {}, perAzienda: 3, partecipanti: 5, cassaInizio: 100, cassaFine: 70 }];
    p.trimestre = 2;
    expect(valutaObiettivo(p, ambiente, "g1", "GIOCATORE")[0]!.valore).toBe(1);
    expect(valutaObiettivo(p, ambiente, "g1", "COMPLETA")[0]!.valore).toBe(2);
  });

  it("i traguardi su informazioni nascoste mostrano 'si verifica a fine partita' (R1)", () => {
    const p = conObiettivo("T1-12"); // Postino
    expect(valutaObiettivo(p, ambiente, "g1", "GIOCATORE").map((t) => t.stato)).toEqual(["A_FINE_PARTITA", "A_FINE_PARTITA"]);
    expect(valutaObiettivo(p, ambiente, "g1", "GIOCATORE")[0]!.valore).toBeUndefined();
  });

  it("i mittenti anonimi contano fra i 'giocatori diversi' solo a fine partita (R1)", () => {
    const p = conObiettivo("T1-06"); // Centralino
    p.messaggi = [
      { id: "m1", trimestre: 1, da: "g2", a: "g1", anonimo: false, modello: "SOLO_TESTO", testo: "ciao" },
      { id: "m2", trimestre: 1, da: "g3", a: "g1", anonimo: true, modello: "SOLO_TESTO", testo: "chi sono?" },
    ];
    expect(valutaObiettivo(p, ambiente, "g1", "GIOCATORE")[0]!.valore).toBe(1);
    expect(valutaObiettivo(p, ambiente, "g1", "COMPLETA")[0]!.valore).toBe(2);
  });

  it("i traguardi 'mai…' restano in corso fino alla fine e cadono appena violati", () => {
    const p = conObiettivo("T3-07"); // Tesoriere: la cassa non scende mai sotto 40 K
    expect(valutaObiettivo(p, ambiente, "g1", "GIOCATORE")[0]!.stato).toBe("IN_CORSO");
    expect(valutaObiettivo(p, ambiente, "g1", "COMPLETA")[0]!.stato).toBe("RAGGIUNTO");
    p.storicoVotazioni.push(registro({ cassaDopo: 20 }));
    expect(valutaObiettivo(p, ambiente, "g1", "GIOCATORE")[0]!.stato).toBe("NON_RAGGIUNTO");
  });

  it("mossa privata: contano solo le scelte vere, non quella predefinita (R2)", () => {
    let p = conObiettivo("T1-09"); // Gioco di squadra
    p.proposteTrimestre = [];
    p.fase = { nome: "MOSSA_PRIVATA" };
    p = fai(p, { tipo: "MOSSA_PRIVATA", da: "g1", scelta: "AZIENDA" }).partita;
    p = fai(p, { tipo: "AVANZA_FASE" }).partita; // RISOLUZIONE: g2…g5 non hanno scelto
    expect(p.storicoTrimestri[0]!.mosseScelte).toEqual({ g1: "AZIENDA" });
    expect(valutaObiettivo(p, ambiente, "g1", "GIOCATORE")[0]!.valore).toBe(1);
  });

  it("chi inoltra una copia modificata viene registrato, anche lungo i passaggi successivi", () => {
    let p = conObiettivo("T1-05"); // Falsario
    const copia = p.copieSegreto[0]!;
    const fonte = copia.possessore;
    // Mai di prima mano al reparto utile (D-073): i due passaggi vanno a colleghi qualsiasi.
    const utile = p.segreti.find((s) => s.id === copia.segretoId)!.utile;
    const [a, b] = p.giocatori.filter((g) => g.id !== fonte && g.repartoId !== utile).map((g) => g.id);
    const campo = Object.keys(copia.campi)[0]!;
    p = fai(p, { tipo: "INVIA_MESSAGGIO", da: fonte, a: a!, anonimo: false, modello: "SEGRETO", copiaSegretoId: copia.id, campi: { [campo]: "inventato" } }).partita;
    const ricevuta = p.copieSegreto.at(-1)!;
    p = fai(p, { tipo: "INVIA_MESSAGGIO", da: a!, a: b!, anonimo: false, modello: "SEGRETO", copiaSegretoId: ricevuta.id }).partita;
    expect(ricevuta.modificataDalMittente).toBe(true);
    expect(p.copieSegreto.at(-1)!.modificataDalMittente).toBeUndefined();
    expect(p.copieSegreto.at(-1)!.alterataDa).toEqual([fonte]);
  });
});

describe("punteggio e rivelazione finale (D-047)", () => {
  function finoAlPunteggio(p: Partita): Partita {
    let q = p;
    while (q.fase.nome !== "PUNTEGGIO") q = fai(q, { tipo: "AVANZA_FASE" }).partita;
    return q;
  }

  it("la TV rivela al punteggio l'obiettivo scelto da ognuno, non prima e mai gli scartati", () => {
    const iniziale = nuova(6, 11);
    let p = fai(iniziale, { tipo: "AVANZA_FASE" }).partita;
    expect(vistaTV(p, ambiente).obiettivi).toBeUndefined();
    p = finoAlPunteggio(p);
    const rivelati = vistaTV(p, ambiente).obiettivi!;
    for (const g of p.giocatori) {
      const o = p.obiettivi[g.id]!;
      expect(rivelati[g.id]!.nome).toBe(modello(o.scelto!).nome);
      expect(rivelati[g.id]!.sceltoACaso).toBe(true);
    }
    const testo = JSON.stringify(vistaTV(p, ambiente));
    for (const g of p.giocatori) for (const id of p.obiettivi[g.id]!.proposti) expect(testo).not.toContain(`"${id}"`);
  });

  it("i traguardi raggiunti entrano nel punteggio, anche per chi è stato licenziato (D-049)", () => {
    // Squadra (3.9), difficile: più di metà del direttivo per l'azienda in tutti i trimestri; chi non
    // sceglie conta "per l'azienda" (D-061), quindi senza azioni il traguardo è raggiunto.
    let p = conObiettivo("T3-09");
    p.giocatori.find((g) => g.id === "g1")!.stato = "LICENZIATO";
    p = finoAlPunteggio(p);
    const voci = p.punteggi!.g1!.voci.filter((v) => v.testo.startsWith("Obiettivo"));
    expect(voci.map((v) => v.punti)).toContain(ambiente.config.obiettivi.punti["3"]![1]);
  });
});

describe("obiettivi sul conteggio della mossa privata (D-061)", () => {
  const trimestre = (t: number, perAzienda: number, partecipanti = 5) => ({ trimestre: t, mosseScelte: {}, perAzienda, partecipanti, cassaInizio: 100, cassaFine: 50 });

  it("«Squadra» 2.9: almeno metà del direttivo per l'azienda in ogni trimestre; cade appena un trimestre non ci arriva", () => {
    const p = conObiettivo("T2-09");
    p.storicoTrimestri = [trimestre(1, 3), trimestre(2, 4)];
    expect(valutaObiettivo(p, ambiente, "g1", "GIOCATORE")[1]!.stato).toBe("IN_CORSO");
    p.storicoTrimestri.push(trimestre(3, 2));
    expect(valutaObiettivo(p, ambiente, "g1", "GIOCATORE")[1]!.stato).toBe("NON_RAGGIUNTO");
    p.storicoTrimestri = [trimestre(1, 3), trimestre(2, 3), trimestre(3, 4), trimestre(4, 5)];
    expect(valutaObiettivo(p, ambiente, "g1", "COMPLETA")[1]!.stato).toBe("RAGGIUNTO");
  });

  it("«Squadra» 3.9: più di metà in tutti i 4 trimestri (con 4 giocatori, 2 su 4 non basta)", () => {
    const p = conObiettivo("T3-09");
    p.storicoTrimestri = [trimestre(1, 3, 4), trimestre(2, 3, 4), trimestre(3, 2, 4), trimestre(4, 4, 4)];
    expect(valutaObiettivo(p, ambiente, "g1", "COMPLETA")[1]!.valore).toBe(3);
    expect(valutaObiettivo(p, ambiente, "g1", "COMPLETA")[1]!.stato).toBe("NON_RAGGIUNTO");
  });
});
