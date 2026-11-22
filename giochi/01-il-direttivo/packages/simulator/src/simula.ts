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
  vistaGiocatore,
  type Ambiente,
  type Azione,
  type Evento,
  type Partita,
  type RepartoId,
} from "@il-direttivo/engine";
import { PROFILI, Robot, type Profilo } from "./robot.js";

export interface OpzioniSimulazione {
  /** Quota di onesti cooperativi (gli altri sono egoisti). */
  quotaCooperativi: number;
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
}

export interface DatiPartita {
  giocatori: number;
  seme: number;
  spie: number;
  configurazioneSpie: "0" | "1" | "2 alleate" | "2 rivali";
  mercato: "AZIENDA" | "CONCORRENTE" | "PAREGGIO";
  votazioni: { trimestre: number; posizione: number; approvata: boolean; perFondi: boolean }[];
  cassaInizioTrimestre: number[];
  tettoRaggiunto: number;
  demansionamenti: { trimestre: number; spia: boolean }[];
  segreti: { totali: number; inTempo: number; passati: number; passatiFalsi: number };
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
  for (const g of p.giocatori) {
    const profilo =
      g.fazione.tipo === "SPIA"
        ? casuale.probabilita(opzioni.quotaSpiePrudenti) ? PROFILI.SPIA_PRUDENTE : PROFILI.SPIA_AGGRESSIVA
        : casuale.probabilita(opzioni.quotaCooperativi) ? PROFILI.COOPERATIVO : PROFILI.EGOISTA;
    robot.set(g.id, new Robot(g.id, profilo, ambiente, creaCasuale(casuale.intero(1, 2 ** 31))));
  }

  const dati: Omit<DatiPartita, "mercato" | "dettaglio" | "segreti" | "spieLicenziate" | "onestiLicenziatiNelFinale"> = {
    giocatori: n,
    seme,
    spie: 0,
    configurazioneSpie: "0",
    votazioni: [],
    cassaInizioTrimestre: [p.azienda.cassa],
    tettoRaggiunto: 0,
    demansionamenti: [],
  };
  const pesoVoto = new Map<RepartoId, number>();
  const registraPesi = (q: Partita) => {
    for (const prop of q.proposteTrimestre) for (const [r, peso] of Object.entries(prop.pesi) as [RepartoId, number][]) pesoVoto.set(r, (pesoVoto.get(r) ?? 0) + peso);
  };
  registraPesi(p);

  const distribuisci = (q: Partita, eventi: Evento[]) => {
    for (const [id, rob] of robot) rob.osserva(eventiPer(eventi, { tipo: "GIOCATORE", id }), vistaGiocatore(q, id));
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
      if (e.tipo === "CASSA_RICARICATA" && prima.fase.nome !== "RAPPORTO") {
        dati.cassaInizioTrimestre.push(e.cassa);
        if (e.cassa >= ambiente.config.cassa.massima) dati.tettoRaggiunto++;
      }
    }
  };

  for (let passi = 0; passi < 500 && p.fase.nome !== "FINE"; passi++) {
    const fase = p.fase.nome;
    if (fase === "DEMANSIONAMENTO" || fase === "PROMOZIONI_FINALI") {
      // Proposte una alla volta: chi ha una proposta la presenta, tutti votano, si chiude.
      for (let giro = 0; giro < 8; giro++) {
        let aperta = false;
        for (const id of casuale.mescola([...robot.keys()])) {
          if (prova(robot.get(id)!.proponi(vistaGiocatore(p, id)))) {
            aperta = true;
            break;
          }
        }
        if (!aperta) break;
        for (const [id, rob] of robot) prova(rob.votaPersonale(vistaGiocatore(p, id)));
        prova({ tipo: "CHIUDI_VOTO_PERSONALE" });
      }
    } else {
      for (const id of casuale.mescola([...robot.keys()])) {
        for (const azione of robot.get(id)!.agisci(vistaGiocatore(p, id))) prova(azione);
      }
    }
    const primaDiAvanzare = p;
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
  const licenziatiNelFinale = new Set(p.finale.licenziamenti.map((l) => l.giocatore));

  return {
    ...dati,
    spie: spie.length,
    configurazioneSpie: spie.length === 0 ? "0" : spie.length === 1 ? "1" : concorrentiSpie.size === 1 ? "2 alleate" : "2 rivali",
    mercato,
    segreti: {
      totali: p.segreti.length,
      inTempo: p.segreti.filter((s) => s.arrivatoInTempo).length,
      passati: p.segretiPassati.length,
      passatiFalsi: p.segretiPassati.filter((s) => s.riuscito === false).length,
    },
    spieLicenziate: spie.filter((g) => g.stato === "LICENZIATO").length,
    onestiLicenziatiNelFinale: p.giocatori.filter((g) => g.fazione.tipo === "ONESTO" && licenziatiNelFinale.has(g.id)).length,
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
    })),
  };
}
