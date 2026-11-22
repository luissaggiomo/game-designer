/**
 * Stato della partita: tutto ciò che il server conosce.
 * ATTENZIONE: questo stato contiene i segreti (ruoli, spie). Non va mai inviato così com'è
 * ai dispositivi: ognuno riceverà solo la propria "vista filtrata" (Architettura §2, regola 3).
 */

export type RepartoId =
  | "ACQUISTI"
  | "PRODUZIONE"
  | "VENDITE"
  | "MARKETING"
  | "FINANZA"
  | "RISORSE_UMANE"
  | "RICERCA_SVILUPPO"
  | "IT_SICUREZZA";

export type GiocatoreId = string;
export type ConcorrenteId = string;

export type Fazione = { tipo: "ONESTO" } | { tipo: "SPIA"; concorrente: ConcorrenteId };

export interface Giocatore {
  id: GiocatoreId;
  nome: string;
  repartoId: RepartoId;
  fazione: Fazione;
  stato: "ATTIVO" | "DEMANSIONATO" | "LICENZIATO";
  /** Trimestre in cui è stato demansionato (serve per la durata minima, D-010). */
  demansionatoDalTrimestre?: number;
  puntiReparto: number;
  /** Messaggi privati ancora disponibili nel trimestre (non accumulabili, GDD §10.1). */
  quotaMessaggi: number;
  pauseCaffe: number;
}

export interface Reparto {
  id: RepartoId;
  /** Assente = reparto vacante dall'inizio. */
  occupatoDa?: GiocatoreId;
  /** Vero se vacante oppure se il direttore è demansionato (GDD §14). */
  autogestione: boolean;
}

export interface Concorrente {
  id: ConcorrenteId;
  nome: string;
  quota: number;
}

/** Le fasi della partita (Architettura §9, con il ciclo discussione → voto di D-008). */
export type Fase =
  | { nome: "RAPPORTO" }
  | { nome: "DISCUSSIONE"; votazione: number }
  | { nome: "VOTAZIONE"; votazione: number }
  | { nome: "MOSSA_PRIVATA" }
  | { nome: "RISOLUZIONE" }
  | { nome: "DEMANSIONAMENTO" }
  | { nome: "FINALE" }
  | { nome: "PUNTEGGIO" }
  | { nome: "LETTURA_MESSAGGI" }
  | { nome: "FINE" };

export interface Partita {
  seme: number;
  /** Stato del generatore casuale: la partita prosegue sempre in modo riproducibile. */
  statoCasuale: number;
  fase: Fase;
  trimestre: number;
  giocatori: Giocatore[];
  reparti: Reparto[];
  concorrenti: Concorrente[];
  azienda: { quota: number; cassa: number };
}
