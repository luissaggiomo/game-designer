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
import { duePossibiliSpie, licenziatiNelGiro } from "./finale.js";
import { calcolaPunteggi } from "./punteggio.js";
import { creaCasuale } from "./rng.js";
import type { Fase, Partita } from "./tipi.js";

/** Fine di un giro del finale: con 8 giocatori, se nel primo giro è uscito uno solo, secondo giro (D-058). */
function dopoIlGiro(partita: Partita, giro: number, trimestre: number): { fase: Fase; trimestre: number } {
  return duePossibiliSpie(partita) && giro === 1 && licenziatiNelGiro(partita, 1) === 1
    ? { fase: { nome: "DOMANDA", giro: 2 }, trimestre }
    : { fase: { nome: "PUNTEGGIO" }, trimestre };
}

/** Fase successiva a quella attuale; null se la partita è finita. */
export function faseSuccessiva(partita: Partita, config: Configurazione): { fase: Fase; trimestre: number } | null {
  const { fase, trimestre } = partita;
  const votazioniDelTrimestre = partita.proposteTrimestre.length;

  switch (fase.nome) {
    case "SCELTA_OBIETTIVI":
      return { fase: { nome: "RAPPORTO" }, trimestre: 1 };
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
      return trimestre < config.trimestri ? { fase: { nome: "RAPPORTO" }, trimestre: trimestre + 1 } : { fase: { nome: "DOMANDA", giro: 1 }, trimestre };
    // Finale (GDD §15, D-058). Le chiusure di domanda, nomi e ballottaggi sono già avvenute quando si calcola la fase successiva.
    case "DOMANDA":
      return partita.finale.esitiDomanda.at(-1)?.procede ? { fase: { nome: "NOMINA", giro: fase.giro }, trimestre } : { fase: { nome: "PUNTEGGIO" }, trimestre };
    case "NOMINA":
    case "BALLOTTAGGIO": {
      const b = partita.finale.ballottaggio;
      return b ? { fase: { nome: "BALLOTTAGGIO", giro: fase.giro, turno: b.turno }, trimestre } : dopoIlGiro(partita, fase.giro, trimestre);
    }
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
    case "DOMANDA":
      partita.finale.risposte = {};
      return [];
    case "NOMINA":
    case "BALLOTTAGGIO":
      partita.finale.nomine = {};
      return [];
    case "PUNTEGGIO": {
      // Prima si svelano i risultati dell'ultimo trimestre (D-029), poi la classifica.
      const rinviati = partita.risultatiRinviati?.eventi ?? [];
      delete partita.risultatiRinviati;
      return [...rinviati, ...calcolaPunteggi(partita, ambiente)];
    }
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
  partita.cassaInizioTrimestre = dopo;
  const tetto = prima + config.cassa.perTrimestre > config.cassa.massima ? ` (tetto massimo ${config.cassa.massima} ${unita})` : "";
  eventi.push({
    tipo: "CASSA_RICARICATA",
    cassa: dopo,
    causa: `Budget del trimestre: +${config.cassa.perTrimestre} ${unita}. In cassa ${dopo} ${unita}${tetto}.`,
  });

  // Quota messaggi: riparte, non si accumula (GDD §10.1).
  for (const g of partita.giocatori) g.quotaMessaggi = config.messaggi.perTrimestre;

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
    case "SCELTA_OBIETTIVI":
      return "Prima della partita: ognuno sceglie il suo obiettivo personale";
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
    case "DOMANDA":
      return fase.giro === 1 ? "Rinnovo dei contratti: c'è una spia nel direttivo?" : "Rinnovo dei contratti: c'è ancora una spia nel direttivo?";
    case "NOMINA":
      return "Rinnovo dei contratti: chi è la spia? Fate un nome";
    case "BALLOTTAGGIO":
      return `Rinnovo dei contratti: ballottaggio (votazione ${fase.turno})`;
    case "PUNTEGGIO":
      return "Punteggi";
    case "LETTURA_MESSAGGI":
      return "Lettura dei messaggi";
    case "FINE":
      return "Fine della partita";
  }
}
