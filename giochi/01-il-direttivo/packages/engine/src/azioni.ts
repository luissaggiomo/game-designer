/**
 * Azioni: le "intenzioni" che arrivano al motore (Architettura §7).
 * I telefoni non decidono nulla: chiedono, e il motore controlla e applica.
 */
import type { Fase, GiocatoreId, Partita } from "./tipi.js";

/** Azioni di sistema, inviate dal server (per esempio allo scadere di un timer). */
export type AzioneSistema = { tipo: "AVANZA_FASE" };

/**
 * Azioni dei giocatori. Per ora sono solo dichiarate: le regole che le gestiscono
 * (votazioni, mossa privata, messaggi, segreti, demansionamento, finale) arrivano nei passi successivi.
 */
export type AzioneGiocatore = { da: GiocatoreId } & (
  | { tipo: "VOTA"; voto: "SI" | "NO" | "ASTENUTO" }
  | { tipo: "MOSSA_PRIVATA"; scelta: "REPARTO" | "AZIENDA" }
  | { tipo: "PROPONI_DEMANSIONAMENTO"; bersaglio: GiocatoreId }
  | { tipo: "VOTA_DEMANSIONAMENTO"; voto: "SI" | "NO" }
  | { tipo: "PROPONI_PROMOZIONE"; bersaglio: GiocatoreId }
  | { tipo: "VOTA_PROMOZIONE"; voto: "SI" | "NO" }
);

export type Azione = AzioneSistema | AzioneGiocatore;

/** Evento da mostrare: ogni evento porta una causa leggibile (regola 2 del gioco). */
export type Evento = { tipo: "FASE_INIZIATA"; fase: Fase; trimestre: number; causa: string };

export type Esito =
  | { ok: true; partita: Partita; eventi: Evento[] }
  | { ok: false; errore: string };
