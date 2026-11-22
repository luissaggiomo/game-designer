/**
 * Azioni: le "intenzioni" che arrivano al motore (Architettura §7).
 * I telefoni non decidono nulla: chiedono, e il motore controlla e applica.
 */
import type { Fase, GiocatoreId, Partita, Voto } from "./tipi.js";

/** Azioni di sistema, inviate dal server (per esempio allo scadere di un timer). */
export type AzioneSistema = { tipo: "AVANZA_FASE" };

/**
 * Azioni dei giocatori. Quelle non ancora gestite dal motore vengono rifiutate:
 * le regole relative arrivano nei passi successivi.
 */
export type AzioneGiocatore = { da: GiocatoreId } & (
  | { tipo: "VOTA"; voto: Voto }
  | { tipo: "MOSSA_PRIVATA"; scelta: "REPARTO" | "AZIENDA" }
  | { tipo: "PROPONI_DEMANSIONAMENTO"; bersaglio: GiocatoreId }
  | { tipo: "VOTA_DEMANSIONAMENTO"; voto: "SI" | "NO" }
  | { tipo: "PROPONI_PROMOZIONE"; bersaglio: GiocatoreId }
  | { tipo: "VOTA_PROMOZIONE"; voto: "SI" | "NO" }
);

export type Azione = AzioneSistema | AzioneGiocatore;

/** Eventi da mostrare: ognuno porta una causa leggibile (regola 2 del gioco). */
export type Evento =
  | { tipo: "FASE_INIZIATA"; fase: Fase; trimestre: number; causa: string }
  | { tipo: "CASSA_RICARICATA"; cassa: number; causa: string }
  | { tipo: "ORDINE_DEL_GIORNO"; proposte: { id: string; titolo: string; costo: number }[]; causa: string }
  | { tipo: "VOTO_REGISTRATO"; da: GiocatoreId; propostaId: string; voto: Voto; causa: string }
  | { tipo: "VOTAZIONE_CHIUSA"; propostaId: string; approvata: boolean; si: number; soglia: number; causa: string };

export type Esito =
  | { ok: true; partita: Partita; eventi: Evento[] }
  | { ok: false; errore: string };
