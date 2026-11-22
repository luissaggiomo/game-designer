/**
 * Macchina a stati delle fasi (= la scaletta che la partita segue, come un ordine del giorno).
 * Architettura §9, con il ciclo discussione → voto per ogni proposta (D-008)
 * e la scaletta delle votazioni per trimestre (D-014).
 */
import type { Configurazione } from "./config.js";
import type { Fase, Partita } from "./tipi.js";

/** Fase successiva a quella attuale; null se la partita è finita. */
export function faseSuccessiva(partita: Partita, config: Configurazione): { fase: Fase; trimestre: number } | null {
  const { fase, trimestre } = partita;
  const votazioniDelTrimestre = config.votazioniPerTrimestre[trimestre - 1] ?? 0;

  switch (fase.nome) {
    case "RAPPORTO":
      return { fase: { nome: "DISCUSSIONE", votazione: 1 }, trimestre };
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
        : { fase: { nome: "FINALE" }, trimestre };
    // Il finale avrà le sue sotto-fasi (promozioni, verifica, nomina, ballottaggio…):
    // arriveranno con le regole del finale. Per ora si passa direttamente al punteggio.
    case "FINALE":
      return { fase: { nome: "PUNTEGGIO" }, trimestre };
    case "PUNTEGGIO":
      return { fase: { nome: "LETTURA_MESSAGGI" }, trimestre };
    case "LETTURA_MESSAGGI":
      return { fase: { nome: "FINE" }, trimestre };
    case "FINE":
      return null;
  }
}

/** Cosa succede automaticamente all'ingresso in una fase. Modifica la copia ricevuta. */
export function entraNellaFase(partita: Partita, config: Configurazione): void {
  if (partita.fase.nome === "RAPPORTO") {
    // Nuovo trimestre: la quota messaggi riparte, non si accumula (GDD §10.1, §13.2).
    for (const g of partita.giocatori) {
      g.quotaMessaggi =
        g.stato === "DEMANSIONATO" ? config.messaggi.perTrimestreDemansionato : config.messaggi.perTrimestre;
    }
  }
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
    case "FINALE":
      return "Il finale";
    case "PUNTEGGIO":
      return "Punteggi";
    case "LETTURA_MESSAGGI":
      return "Lettura dei messaggi";
    case "FINE":
      return "Fine della partita";
  }
}
