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
  demansionato: boolean;
  licenziato: boolean;
  segretiComeFonte: number;
  favorito: number;
  pesoVotoAnno: number;
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
  votazioni: { trimestre: number; posizione: number; approvata: boolean; perFondi: boolean }[];
  cassaInizioTrimestre: number[];
  /** Cassa dopo l'ultima votazione di ogni trimestre e minima dopo le votazioni (obiettivi sulla cassa). */
  cassaFineTrimestre: number[];
  cassaMinimaDopoVoti: number;
  /** Per trimestre: effetto sull'azienda di proposte approvate e segreti arrivati in tempo (D-056). */
  crescitaProposteESegreti: number[];
  tettoRaggiunto: number;
  demansionamenti: { trimestre: number; spia: boolean }[];
  segreti: { totali: number; inTempo: number; passati: number; passatiFalsi: number };
  /**
   * Esito per fazione (benchmark di Luis, 22/11/2026): vince la spia se il suo concorrente supera
   * l'azienda E lei non è stata scoperta (non licenziata); altrimenti vincono gli onesti.
   * Presente solo nelle partite con spie.
   */
  vincitoreFazione?: "ONESTI" | "SPIE";
  /** Mosse private scelte dai direttori attivi (non quelle automatiche dell'autogestione). */
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

  const dati: Omit<DatiPartita, "mercato" | "dettaglio" | "segreti" | "spieLicenziate" | "onestiLicenziatiNelFinale" | "cassaFineTrimestre" | "cassaMinimaDopoVoti" | "crescitaProposteESegreti"> & { mosse: DatiPartita["mosse"] } = {
    giocatori: n,
    seme,
    spie: 0,
    configurazioneSpie: "0",
    votazioni: [],
    cassaInizioTrimestre: [],
    tettoRaggiunto: 0,
    demansionamenti: [],
    mosse: { totali: 0, aziendaliste: 0 },
  };
  const pesoVoto = new Map<RepartoId, number>();
  const registraPesi = (q: Partita) => {
    for (const prop of q.proposteTrimestre) for (const [r, peso] of Object.entries(prop.pesi) as [RepartoId, number][]) pesoVoto.set(r, (pesoVoto.get(r) ?? 0) + peso);
  };
  registraPesi(p);

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
      if (e.tipo === "VOTAZIONE_CHIUSA" && prima.fase.nome === "VOTAZIONE") {
        dati.votazioni.push({ trimestre: prima.trimestre, posizione: prima.fase.votazione, approvata: e.approvata, perFondi: e.causa.includes("mancanza di fondi") });
      }
      if (e.tipo === "VOTO_PERSONALE_CHIUSO" && e.voto === "DEMANSIONAMENTO" && e.approvato) {
        const bersaglio = p.giocatori.find((g) => g.id === e.bersaglio)!;
        dati.demansionamenti.push({ trimestre: prima.trimestre, spia: bersaglio.fazione.tipo === "SPIA" });
      }
      if (e.tipo === "CASSA_RICARICATA") {
        dati.cassaInizioTrimestre.push(e.cassa);
        if (e.cassa >= ambiente.config.cassa.massima) dati.tettoRaggiunto++;
      }
    }
  };

  for (let passi = 0; passi < 500 && p.fase.nome !== "FINE"; passi++) {
    const fase = p.fase.nome;
    if (fase === "DECISIONE_FINALE") {
      // Il voto "promuovere o licenziare?" è già aperto: votano tutti, poi AVANZA_FASE lo chiude.
      for (const [id, rob] of robot) prova(rob.votaPersonale(vistaGiocatore(p, id, ambiente)));
    } else if (fase === "DEMANSIONAMENTO") {
      // Proposte una alla volta: chi ha una proposta la presenta, tutti votano, si chiude.
      for (let giro = 0; giro < 8; giro++) {
        let aperta = false;
        for (const id of casuale.mescola([...robot.keys()])) {
          if (prova(robot.get(id)!.proponi(vistaGiocatore(p, id, ambiente)))) {
            aperta = true;
            break;
          }
        }
        if (!aperta) break;
        for (const [id, rob] of robot) prova(rob.votaPersonale(vistaGiocatore(p, id, ambiente)));
        prova({ tipo: "CHIUDI_VOTO_PERSONALE" });
      }
    } else {
      for (const id of casuale.mescola([...robot.keys()])) {
        for (const azione of robot.get(id)!.agisci(vistaGiocatore(p, id, ambiente))) prova(azione);
      }
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
    if (p.fase.nome === "RAPPORTO" && primaDiAvanzare.fase.nome !== "RAPPORTO") registraPesi(p);
  }

  // Dati finali dalla partita conclusa.
  const spie = p.giocatori.filter((g) => g.fazione.tipo === "SPIA");
  const concorrentiSpie = new Set(spie.map((g) => (g.fazione.tipo === "SPIA" ? g.fazione.concorrente : "")));
  const quota = p.azienda.quota;
  const mercato = p.concorrenti.every((c) => quota > c.quota) ? "AZIENDA" : p.concorrenti.some((c) => c.quota > quota) ? "CONCORRENTE" : "PAREGGIO";
  const punteggi = p.punteggi ?? {};
  const massimo = Math.max(...p.giocatori.map((g) => punteggi[g.id]?.totale ?? 0));
  const demansionatiMai = new Set(p.storicoVotiPersonali.filter((v) => v.tipo === "DEMANSIONAMENTO" && v.approvato).map((v) => v.bersaglio));

  return {
    ...dati,
    spie: spie.length,
    configurazioneSpie: spie.length === 0 ? "0" : spie.length === 1 ? "1" : concorrentiSpie.size === 1 ? "2 alleate" : "2 rivali",
    mercato,
    cassaFineTrimestre: p.storicoTrimestri.map((t) => t.cassaFine),
    cassaMinimaDopoVoti: Math.min(...p.storicoVotazioni.map((r) => r.cassaDopo)),
    crescitaProposteESegreti: p.storicoTrimestri.map((t) => (t.effettoProposte ?? 0) + (t.effettoSegreti ?? 0)),
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
      inTempo: p.segreti.filter((s) => s.arrivatoInTempo).length,
      passati: p.segretiPassati.length,
      passatiFalsi: p.segretiPassati.filter((s) => s.riuscito === false).length,
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
      demansionato: demansionatiMai.has(g.id),
      licenziato: g.stato === "LICENZIATO",
      segretiComeFonte: p.conteggioFontiSegreti[g.repartoId] ?? 0,
      favorito: p.conteggioFavoriti[g.repartoId] ?? 0,
      pesoVotoAnno: pesoVoto.get(g.repartoId) ?? 0,
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
