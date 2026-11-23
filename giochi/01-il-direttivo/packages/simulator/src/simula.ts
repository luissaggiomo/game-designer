/**
 * Simulazione di una partita completa con soli robot, e raccolta dei dati per il report.
 * Il simulatore fa la parte del server: applica le azioni dei robot col motore vero e,
 * allo scadere di ogni fase, invia AVANZA_FASE (chi non ha agito riceve la scelta predefinita).
 */
import {
  applica,
  creaCasuale,
  creaPartita,
  eventiPer,
  modelloObiettivo,
  valutaObiettivo,
  vistaGiocatore,
  type Ambiente,
  type Azione,
  type Evento,
  type Partita,
  type RepartoId,
} from "@il-direttivo/engine";
import { PROFILI, Robot, type Profilo } from "./robot.js";

export interface OpzioniSimulazione {
  /** Quota di onesti cooperativi (gli altri sono egoisti); "VARIABILE" = estratta a caso per ogni partita. */
  quotaCooperativi: number | "VARIABILE";
  /** Quota di spie prudenti (le altre sono aggressive). */
  quotaSpiePrudenti: number;
}

export const OPZIONI_PREDEFINITE: OpzioniSimulazione = { quotaCooperativi: 0.5, quotaSpiePrudenti: 0.5 };

export interface DatiGiocatore {
  reparto: RepartoId;
  spia: boolean;
  profilo: Profilo["nome"];
  punteggio: number;
  puntiReparto: number;
  vincitore: boolean;
  licenziato: boolean;
  /** Quante volte è stato fonte o destinatario di un segreto (D-074). */
  coinvolgimentiSegreti: number;
  /** Bonus e malus ricevuti dalle carte della partita, approvate o no (D-069: devono essere uguali per tutti). */
  bonusCarte: number;
  malusCarte: number;
  /** Obiettivo personale scelto e traguardi raggiunti (D-046…D-052). */
  obiettivo: {
    id: string;
    nome: string;
    tipo: number;
    aziendalista: boolean;
    facile: boolean;
    difficile: boolean;
    punti: number;
    aCaso: boolean;
    /** Valore raggiunto su ciascun traguardo (null = traguardo "mai…" mancato), per stimare le soglie. */
    valori: (number | null)[];
  };
}

export interface DatiPartita {
  giocatori: number;
  seme: number;
  spie: number;
  configurazioneSpie: "0" | "1" | "2 alleate" | "2 rivali";
  mercato: "AZIENDA" | "CONCORRENTE" | "PAREGGIO";
  /** Voto del pacchetto, per trimestre (D-068). */
  votazioni: { trimestre: number; esito: "PRIMO_VOTO" | "PRINCIPALE" | "ALTERNATIVA"; costo: number; grande: boolean; proposte: number; cassa: number }[];
  /** Scarto massimo tra reparti nei totali di bonus e malus delle carte, e trimestri con reparti non smistati (D-069). */
  equita: { scarto: number; violazioni: number };
  cassaInizioTrimestre: number[];
  /** Cassa dopo l'ultima votazione di ogni trimestre e minima dopo le votazioni (obiettivi sulla cassa). */
  cassaFineTrimestre: number[];
  cassaMinimaDopoVoti: number;
  /** Per trimestre: effetto sull'azienda di proposte approvate e segreti arrivati in tempo (D-056). */
  crescitaProposteESegreti: number[];
  /** Finale "Rinnovo dei contratti" (D-058). */
  finale: {
    /** Esito della domanda in ogni giro (true = si procede con i nomi). */
    domande: boolean[];
    /** Votazioni di ballottaggio fatte (tutti i turni). */
    ballottaggi: number;
    /** Doppio licenziamento per stallo ripetuto a due. */
    doppio: boolean;
    /** Ultima votazione del percorso a tre finita senza licenziati. */
    nessunoAllUltima: boolean;
  };
  /** D-072…D-074: arrivati = qualunque versione al reparto utile; inTempo = copia vera di un segreto vero. */
  segreti: { totali: number; veri: number; arrivati: number; inTempo: number; passati: number; passatiFalsi: number; passatiFinti: number };
  /**
   * Esito per fazione (benchmark di Luis, 22/11/2026): vince la spia se il suo concorrente supera
   * l'azienda E lei non è stata scoperta (non licenziata); altrimenti vincono gli onesti.
   * Presente solo nelle partite con spie.
   */
  vincitoreFazione?: "ONESTI" | "SPIE";
  /** Mosse private dei membri del direttivo (chi non sceglie conta "per l'azienda"). */
  mosse: { totali: number; aziendaliste: number };
  spieLicenziate: number;
  onestiLicenziatiNelFinale: number;
  dettaglio: DatiGiocatore[];
}

export function simulaPartita(n: number, seme: number, ambiente: Ambiente, opzioni = OPZIONI_PREDEFINITE): DatiPartita {
  const esito = creaPartita(Array.from({ length: n }, (_, i) => ({ id: `g${i + 1}`, nome: `Robot ${i + 1}` })), seme, ambiente);
  if (!esito.ok) throw new Error(esito.errore);
  let p = esito.partita;
  const casuale = creaCasuale(seme * 7919 + 13);

  const robot = new Map<string, Robot>();
  const quotaCooperativi = opzioni.quotaCooperativi === "VARIABILE" ? casuale.numero() : opzioni.quotaCooperativi;
  for (const g of p.giocatori) {
    const profilo =
      g.fazione.tipo === "SPIA"
        ? casuale.probabilita(opzioni.quotaSpiePrudenti) ? PROFILI.SPIA_PRUDENTE : PROFILI.SPIA_AGGRESSIVA
        : casuale.probabilita(quotaCooperativi) ? PROFILI.COOPERATIVO : PROFILI.EGOISTA;
    robot.set(g.id, new Robot(g.id, profilo, ambiente, creaCasuale(casuale.intero(1, 2 ** 31))));
  }

  const dati: Omit<DatiPartita, "mercato" | "dettaglio" | "segreti" | "spieLicenziate" | "onestiLicenziatiNelFinale" | "cassaFineTrimestre" | "cassaMinimaDopoVoti" | "crescitaProposteESegreti" | "finale" | "equita"> & { mosse: DatiPartita["mosse"] } = {
    giocatori: n,
    seme,
    spie: 0,
    configurazioneSpie: "0",
    votazioni: [],
    cassaInizioTrimestre: [],
    mosse: { totali: 0, aziendaliste: 0 },
  };

  const distribuisci = (q: Partita, eventi: Evento[]) => {
    for (const [id, rob] of robot) rob.osserva(eventiPer(eventi, { tipo: "GIOCATORE", id }), vistaGiocatore(q, id, ambiente));
  };
  const prova = (azione: Azione | undefined): boolean => {
    if (!azione) return false;
    const r = applica(p, azione, ambiente);
    if (!r.ok) return false;
    const prima = p;
    p = r.partita;
    raccogli(prima, r.eventi);
    distribuisci(p, r.eventi);
    return true;
  };
  const raccogli = (prima: Partita, eventi: Evento[]) => {
    for (const e of eventi) {
      const approvato = e.tipo === "VOTO_PACCHETTO_CHIUSO" ? e.approvato : e.tipo === "SECONDO_VOTO_CHIUSO" ? e.approvato : undefined;
      if (approvato) {
        const esito = e.tipo === "VOTO_PACCHETTO_CHIUSO" ? "PRIMO_VOTO" : e.tipo === "SECONDO_VOTO_CHIUSO" && e.principaleApprovato ? "PRINCIPALE" : "ALTERNATIVA";
        const proposte = prima.proposteTrimestre.filter((x) => approvato.includes(x.id));
        const piuCara = Math.max(...prima.proposteTrimestre.map((x) => x.costo));
        dati.votazioni.push({
          trimestre: prima.trimestre,
          esito,
          costo: proposte.reduce((s, x) => s + x.costo, 0),
          grande: proposte.some((x) => x.costo === piuCara),
          proposte: proposte.length,
          cassa: prima.azienda.cassa,
        });
      }
      if (e.tipo === "CASSA_RICARICATA") dati.cassaInizioTrimestre.push(e.cassa);
    }
  };

  for (let passi = 0; passi < 500 && p.fase.nome !== "FINE"; passi++) {
    const fase = p.fase.nome;
    for (const id of casuale.mescola([...robot.keys()])) {
      for (const azione of robot.get(id)!.agisci(vistaGiocatore(p, id, ambiente))) prova(azione);
    }
    const primaDiAvanzare = p;
    if (fase === "MOSSA_PRIVATA") {
      // Il simulatore fa da server: conta le scelte (chi non sceglie gioca per l'azienda, D-020).
      for (const g of p.giocatori.filter((x) => x.stato === "ATTIVO")) {
        dati.mosse.totali++;
        if ((p.mossePrivate[g.id] ?? ambiente.config.mossaPrivata.sceltaPredefinita) === "AZIENDA") dati.mosse.aziendaliste++;
      }
    }
    prova({ tipo: "AVANZA_FASE" });
    void primaDiAvanzare;
  }

  // Dati finali dalla partita conclusa.
  const spie = p.giocatori.filter((g) => g.fazione.tipo === "SPIA");
  const concorrentiSpie = new Set(spie.map((g) => (g.fazione.tipo === "SPIA" ? g.fazione.concorrente : "")));
  const quota = p.azienda.quota;
  const mercato = p.concorrenti.every((c) => quota > c.quota) ? "AZIENDA" : p.concorrenti.some((c) => c.quota > quota) ? "CONCORRENTE" : "PAREGGIO";
  const punteggi = p.punteggi ?? {};
  const massimo = Math.max(...p.giocatori.map((g) => punteggi[g.id]?.totale ?? 0));
  const ballottaggi = p.finale.votazioni.filter((v) => v.tipo === "BALLOTTAGGIO");

  return {
    ...dati,
    spie: spie.length,
    configurazioneSpie: spie.length === 0 ? "0" : spie.length === 1 ? "1" : concorrentiSpie.size === 1 ? "2 alleate" : "2 rivali",
    mercato,
    cassaFineTrimestre: p.storicoTrimestri.map((t) => t.cassaFine),
    cassaMinimaDopoVoti: Math.min(...p.storicoVotazioni.map((r) => r.cassaDopo)),
    equita: p.equita ?? { scarto: 0, violazioni: 0 },
    crescitaProposteESegreti: p.storicoTrimestri.map((t) => (t.effettoProposte ?? 0) + (t.effettoSegreti ?? 0)),
    finale: {
      domande: p.finale.esitiDomanda.map((e) => e.procede),
      ballottaggi: ballottaggi.length,
      doppio: [1, 2].some((giro) => p.finale.licenziamenti.filter((l) => l.giro === giro).length === 2),
      nessunoAllUltima: ballottaggi.some((v) => v.turno === 3) && !p.finale.licenziamenti.some((l) => l.giro === ballottaggi.find((v) => v.turno === 3)!.giro),
    },
    ...(spie.length > 0
      ? {
          vincitoreFazione: spie.some((s) => {
            const concorrente = p.concorrenti.find((c) => s.fazione.tipo === "SPIA" && c.id === s.fazione.concorrente)!;
            return concorrente.quota > quota && s.stato !== "LICENZIATO";
          })
            ? ("SPIE" as const)
            : ("ONESTI" as const),
        }
      : {}),
    segreti: {
      totali: p.segreti.length,
      veri: p.segreti.filter((s) => !s.finto).length,
      arrivati: p.segreti.filter((s) => s.arrivatoIl !== undefined).length,
      inTempo: p.segreti.filter((s) => s.arrivatoInTempo && !s.finto).length,
      passati: p.segretiPassati.length,
      passatiFalsi: p.segretiPassati.filter((s) => s.riuscito === false).length,
      passatiFinti: p.segretiPassati.filter((x) => p.segreti.find((s) => s.id === x.segretoId)?.finto).length,
    },
    spieLicenziate: spie.filter((g) => g.stato === "LICENZIATO").length,
    onestiLicenziatiNelFinale: p.giocatori.filter((g) => g.fazione.tipo === "ONESTO" && g.stato === "LICENZIATO").length,
    dettaglio: p.giocatori.map((g) => ({
      reparto: g.repartoId,
      spia: g.fazione.tipo === "SPIA",
      profilo: robot.get(g.id)!.profilo.nome,
      punteggio: punteggi[g.id]?.totale ?? 0,
      puntiReparto: g.puntiReparto,
      vincitore: (punteggi[g.id]?.totale ?? 0) === massimo,
      licenziato: g.stato === "LICENZIATO",
      coinvolgimentiSegreti: p.coinvolgimentiSegreti[g.id] ?? 0,
      bonusCarte: p.carte.flat().reduce((s, c) => s + Math.max(0, c.effettiPrivati[g.repartoId]?.punti ?? 0), 0),
      malusCarte: p.carte.flat().reduce((s, c) => s - Math.min(0, c.effettiPrivati[g.repartoId]?.punti ?? 0), 0),
      obiettivo: (() => {
        const o = p.obiettivi[g.id]!;
        const m = modelloObiettivo(ambiente, o.scelto!);
        const t = valutaObiettivo(p, ambiente, g.id, "COMPLETA");
        const facile = t[0]?.stato === "RAGGIUNTO";
        const difficile = t[1]?.stato === "RAGGIUNTO";
        const valori = t.map((x) => (x.violato ? null : (x.valore ?? 0)));
        return { id: m.id, nome: m.nome, tipo: m.tipo, aziendalista: m.aziendalista, facile, difficile, punti: t.filter((x) => x.stato === "RAGGIUNTO").reduce((s, x) => s + x.punti, 0), aCaso: o.sceltoACaso === true, valori };
      })(),
    })),
  };
}
