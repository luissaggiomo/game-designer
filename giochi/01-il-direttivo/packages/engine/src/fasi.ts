/**
 * Macchina a stati delle fasi (= la scaletta che la partita segue, come un ordine del giorno).
 * Architettura §9. Ogni trimestre (D-068): Rapporto → Discussione → Voto del pacchetto →
 * (se serve) Secondo voto → Mossa privata → Risultati.
 */
import type { Evento } from "./azioni.js";
import type { Ambiente } from "./contenuti.js";
import type { Configurazione } from "./config.js";
import { risolviTrimestre } from "./risoluzione.js";
import { distribuisciSegreti } from "./segreti.js";
import { preparaCarte } from "./proposte.js";
import { duePossibiliSpie, licenziatiNelGiro, rivelaRuoliLicenziati } from "./finale.js";
import { calcolaPunteggi } from "./punteggio.js";
import { creaCasuale } from "./rng.js";
import type { Fase, Partita } from "./tipi.js";
import { pacchettiValidi } from "./votazioni.js";

/** Fine di un giro del finale: con 8 giocatori, se nel primo giro è uscito uno solo, secondo giro (D-058). */
function dopoIlGiro(partita: Partita, giro: number, trimestre: number): { fase: Fase; trimestre: number } {
  return duePossibiliSpie(partita) && giro === 1 && licenziatiNelGiro(partita, 1) === 1
    ? { fase: { nome: "DOMANDA", giro: 2 }, trimestre }
    : { fase: { nome: "PUNTEGGIO" }, trimestre };
}

/** Fase successiva a quella attuale; null se la partita è finita. */
export function faseSuccessiva(partita: Partita, config: Configurazione): { fase: Fase; trimestre: number } | null {
  const { fase, trimestre } = partita;

  switch (fase.nome) {
    case "SCELTA_OBIETTIVI":
      return { fase: { nome: "RAPPORTO" }, trimestre: 1 };
    case "RAPPORTO":
      return partita.votoTrimestre ? { fase: { nome: "DISCUSSIONE" }, trimestre } : { fase: { nome: "MOSSA_PRIVATA" }, trimestre };
    case "DISCUSSIONE":
      return { fase: { nome: "VOTO_PACCHETTO" }, trimestre };
    // Le chiusure dei voti sono già avvenute quando si calcola la fase successiva.
    case "VOTO_PACCHETTO":
      return partita.votoTrimestre?.approvato ? { fase: { nome: "MOSSA_PRIVATA" }, trimestre } : { fase: { nome: "SECONDO_VOTO" }, trimestre };
    case "SECONDO_VOTO":
      return { fase: { nome: "MOSSA_PRIVATA" }, trimestre };
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
      // Prima si svelano i risultati dell'ultimo trimestre (D-029) e i ruoli dei licenziati (D-078), poi la classifica.
      const rinviati = partita.risultatiRinviati?.eventi ?? [];
      delete partita.risultatiRinviati;
      return [...rinviati, ...rivelaRuoliLicenziati(partita), ...calcolaPunteggi(partita, ambiente)];
    }
    case "RAPPORTO":
      break;
    default:
      return [];
  }

  const eventi: Evento[] = [];
  partita.mossePrivate = {};
  const unita = config.cassa.unita;

  // Cassa: arriva il budget del trimestre, che si somma all'avanzo, senza tetto (D-018, D-068).
  const dopo = partita.azienda.cassa + config.cassa.perTrimestre;
  partita.azienda.cassa = dopo;
  partita.cassaInizioTrimestre = dopo;
  eventi.push({
    tipo: "CASSA_RICARICATA",
    cassa: dopo,
    causa: `Budget del trimestre: +${config.cassa.perTrimestre} ${unita}. In cassa ${dopo} ${unita}.`,
  });

  // Quota messaggi: riparte, non si accumula (GDD §10.1).
  for (const g of partita.giocatori) g.quotaMessaggi = config.messaggi.perTrimestre;

  // Le carte di tutta la partita si preparano una volta sola, all'inizio del 1° trimestre (D-069).
  if (partita.carte.length === 0) {
    const casualeCarte = creaCasuale(partita.statoCasuale);
    const occupati = partita.reparti.filter((r) => r.occupatoDa).map((r) => r.id);
    const equita = preparaCarte(occupati, ambiente, casualeCarte);
    partita.carte = equita.carte;
    partita.equita = { scarto: equita.scarto, violazioni: equita.violazioni };
    partita.statoCasuale = casualeCarte.stato();
  }
  // Le tre proposte del trimestre e i pacchetti possibili (D-068).
  partita.proposteTrimestre = partita.carte[partita.trimestre - 1] ?? [];
  delete partita.votoTrimestre;
  if (partita.proposteTrimestre.length > 0) {
    const pacchetti = pacchettiValidi(partita.proposteTrimestre, partita.azienda.cassa, config.proposte.investimentoMinimo);
    partita.votoTrimestre = { pacchetti, voti: {}, secondiVoti: {} };
    eventi.push({
      tipo: "ORDINE_DEL_GIORNO",
      proposte: partita.proposteTrimestre.map((p) => ({ id: p.id, titolo: p.titolo, costo: p.costo })),
      pacchetti: pacchetti.map((x) => [...x]),
      causa:
        "Le proposte del trimestre: " +
        partita.proposteTrimestre.map((p) => `${p.titolo} (${p.costo} ${unita})`).join(" · ") +
        `. Da investire almeno ${config.proposte.investimentoMinimo} ${unita}, in cassa ${partita.azienda.cassa} ${unita}.`,
    });
  }
  const casuale = creaCasuale(partita.statoCasuale);
  const eventiSegreti = distribuisciSegreti(partita, ambiente, casuale);
  partita.statoCasuale = casuale.stato();
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
      return `Trimestre ${trimestre}: discussione sulle proposte`;
    case "VOTO_PACCHETTO":
      return `Trimestre ${trimestre}: voto del pacchetto`;
    case "SECONDO_VOTO":
      return `Trimestre ${trimestre}: sì o no al pacchetto più votato`;
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
