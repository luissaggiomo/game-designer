/**
 * Macchina a stati delle fasi (= la scaletta che la partita segue, come un ordine del giorno).
 * Architettura §9, con il ciclo discussione → voto per ogni proposta (D-008)
 * e la scaletta delle votazioni per trimestre (D-014).
 */
import type { Evento } from "./azioni.js";
import type { Ambiente } from "./contenuti.js";
import type { Configurazione } from "./config.js";
import { estraiOrdineDelGiorno } from "./proposte.js";
import { risolviTrimestre } from "./risoluzione.js";
import { distribuisciSegreti } from "./segreti.js";
import { duePossibiliSpie, licenziaDemansionati } from "./finale.js";
import { calcolaPunteggi } from "./punteggio.js";
import { creaCasuale } from "./rng.js";
import type { Fase, Partita } from "./tipi.js";

/** Fase successiva a quella attuale; null se la partita è finita. */
export function faseSuccessiva(partita: Partita, config: Configurazione): { fase: Fase; trimestre: number } | null {
  const { fase, trimestre } = partita;
  const votazioniDelTrimestre = partita.proposteTrimestre.length;

  switch (fase.nome) {
    case "RAPPORTO":
      return votazioniDelTrimestre > 0
        ? { fase: { nome: "DISCUSSIONE", votazione: 1 }, trimestre }
        : { fase: { nome: "MOSSA_PRIVATA" }, trimestre };
    case "DISCUSSIONE":
      return { fase: { nome: "VOTAZIONE", votazione: fase.votazione }, trimestre };
    case "VOTAZIONE":
      return fase.votazione < votazioniDelTrimestre
        ? { fase: { nome: "DISCUSSIONE", votazione: fase.votazione + 1 }, trimestre }
        : { fase: { nome: "MOSSA_PRIVATA" }, trimestre };
    case "MOSSA_PRIVATA":
      return { fase: { nome: "RISOLUZIONE" }, trimestre };
    case "RISOLUZIONE":
      return { fase: { nome: "DEMANSIONAMENTO" }, trimestre };
    case "DEMANSIONAMENTO":
      return trimestre < config.trimestri
        ? { fase: { nome: "RAPPORTO" }, trimestre: trimestre + 1 }
        : { fase: { nome: "PROMOZIONI_FINALI" }, trimestre };
    // Finale (GDD §15). Le chiusure di verifica e nomina sono già avvenute quando si calcola la fase successiva.
    case "PROMOZIONI_FINALI":
      return { fase: { nome: "LICENZIAMENTO_DEMANSIONATI" }, trimestre };
    case "LICENZIAMENTO_DEMANSIONATI":
      return { fase: { nome: "VERIFICA", giro: 1 }, trimestre };
    case "VERIFICA": {
      const ultimo = partita.finale.esitiVerifica.at(-1);
      return ultimo?.tuttiSi
        ? { fase: { nome: "PUNTEGGIO" }, trimestre }
        : { fase: { nome: "NOMINA", giro: fase.giro, ballottaggio: false }, trimestre };
    }
    case "NOMINA":
      if (partita.finale.ballottaggio.length > 0) return { fase: { nome: "NOMINA", giro: fase.giro, ballottaggio: true }, trimestre };
      return duePossibiliSpie(partita) && fase.giro === 1
        ? { fase: { nome: "VERIFICA", giro: 2 }, trimestre }
        : { fase: { nome: "PUNTEGGIO" }, trimestre };
    case "PUNTEGGIO":
      return { fase: { nome: "LETTURA_MESSAGGI" }, trimestre };
    case "LETTURA_MESSAGGI":
      return { fase: { nome: "FINE" }, trimestre };
    case "FINE":
      return null;
  }
}

/** Cosa succede automaticamente all'ingresso in una fase. Modifica la copia ricevuta e restituisce gli eventi. */
export function entraNellaFase(partita: Partita, ambiente: Ambiente): Evento[] {
  const { config } = ambiente;
  switch (partita.fase.nome) {
    case "RISOLUZIONE":
      return risolviTrimestre(partita, ambiente);
    case "LICENZIAMENTO_DEMANSIONATI":
      return licenziaDemansionati(partita);
    case "VERIFICA":
      partita.finale.verifica = {};
      return [];
    case "NOMINA":
      partita.finale.nomine = {};
      return [];
    case "PUNTEGGIO":
      return calcolaPunteggi(partita, ambiente);
    case "RAPPORTO":
      break;
    default:
      return [];
  }

  const eventi: Evento[] = [];
  partita.mossePrivate = {};
  const unita = config.cassa.unita;

  // Cassa: arriva il budget del trimestre, che si somma all'avanzo fino al tetto (D-018).
  const prima = partita.azienda.cassa;
  const dopo = Math.min(prima + config.cassa.perTrimestre, config.cassa.massima);
  partita.azienda.cassa = dopo;
  const tetto = prima + config.cassa.perTrimestre > config.cassa.massima ? ` (tetto massimo ${config.cassa.massima} ${unita})` : "";
  eventi.push({
    tipo: "CASSA_RICARICATA",
    cassa: dopo,
    causa: `Budget del trimestre: +${config.cassa.perTrimestre} ${unita}. In cassa ${dopo} ${unita}${tetto}.`,
  });

  // Quota messaggi: riparte, non si accumula (GDD §10.1, §13.2).
  for (const g of partita.giocatori) {
    g.quotaMessaggi = g.stato === "DEMANSIONATO" ? config.messaggi.perTrimestreDemansionato : config.messaggi.perTrimestre;
  }

  // Ordine del giorno: estratto e annunciato subito, nell'ordine in cui si voterà (D-008).
  const casuale = creaCasuale(partita.statoCasuale);
  partita.proposteTrimestre = estraiOrdineDelGiorno(partita, ambiente, casuale);
  const eventiSegreti = distribuisciSegreti(partita, ambiente, casuale);
  partita.statoCasuale = casuale.stato();
  eventi.push({
    tipo: "ORDINE_DEL_GIORNO",
    proposte: partita.proposteTrimestre.map((p) => ({ id: p.id, titolo: p.titolo, costo: p.costo })),
    causa:
      "Ordine del giorno: " +
      partita.proposteTrimestre.map((p, i) => `${i + 1}) ${p.titolo} (${p.costo} ${unita})`).join(" · "),
  });
  eventi.push(...eventiSegreti);

  return eventi;
}

/** Descrizione leggibile della fase, da mostrare in TV. */
export function descriviFase(fase: Fase, trimestre: number): string {
  switch (fase.nome) {
    case "RAPPORTO":
      return `Trimestre ${trimestre}: rapporto dei reparti`;
    case "DISCUSSIONE":
      return `Trimestre ${trimestre}: discussione sulla proposta ${fase.votazione}`;
    case "VOTAZIONE":
      return `Trimestre ${trimestre}: votazione della proposta ${fase.votazione}`;
    case "MOSSA_PRIVATA":
      return `Trimestre ${trimestre}: mossa privata`;
    case "RISOLUZIONE":
      return `Trimestre ${trimestre}: risultati`;
    case "DEMANSIONAMENTO":
      return `Trimestre ${trimestre}: promozioni e demansionamento`;
    case "PROMOZIONI_FINALI":
      return "Il finale: ultime promozioni";
    case "LICENZIAMENTO_DEMANSIONATI":
      return "Il finale: licenziamento dei demansionati";
    case "VERIFICA":
      return `Il finale: nel direttivo sono rimasti solo onesti? (giro ${fase.giro})`;
    case "NOMINA":
      return fase.ballottaggio ? "Il finale: ballottaggio" : `Il finale: chi è la spia? (giro ${fase.giro})`;
    case "PUNTEGGIO":
      return "Punteggi";
    case "LETTURA_MESSAGGI":
      return "Lettura dei messaggi";
    case "FINE":
      return "Fine della partita";
  }
}
