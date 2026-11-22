/**
 * Azioni: le "intenzioni" che arrivano al motore (Architettura §7).
 * I telefoni non decidono nulla: chiedono, e il motore controlla e applica.
 */
import type { Fase, GiocatoreId, Partita, SceltaMossa, Voto } from "./tipi.js";

/** Azioni di sistema, inviate dal server (per esempio allo scadere di un timer). */
export type AzioneSistema = { tipo: "AVANZA_FASE" };

/**
 * Azioni dei giocatori. Quelle non ancora gestite dal motore vengono rifiutate:
 * le regole relative arrivano nei passi successivi.
 */
export type AzioneGiocatore = { da: GiocatoreId } & (
  | { tipo: "VOTA"; voto: Voto }
  | { tipo: "MOSSA_PRIVATA"; scelta: SceltaMossa }
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
  /** Dice solo CHI ha votato, non cosa: i voti si rivelano alla chiusura (D-019). */
  | { tipo: "VOTO_REGISTRATO"; da: GiocatoreId; propostaId: string; causa: string }
  /** Alla chiusura si rivelano tutti i voti (D-019); "TEMPO_SCADUTO" vale come no (D-007). */
  | {
      tipo: "VOTAZIONE_CHIUSA";
      propostaId: string;
      approvata: boolean;
      si: number;
      soglia: number;
      voti: Partial<Record<GiocatoreId, Voto | "TEMPO_SCADUTO">>;
      causa: string;
    }
  /** Dice solo CHI ha scelto, mai cosa. */
  | { tipo: "MOSSA_REGISTRATA"; da: GiocatoreId; causa: string }
  /** Solo l'esito complessivo, mai il numero (GDD §9). */
  | { tipo: "ESITO_MOSSE_PRIVATE"; andamento: "IN_CALO" | "STABILE" | "IN_CRESCITA"; causa: string }
  /** Effetto reale di una proposta approvata sull'azienda (GDD §8.2). */
  | { tipo: "EFFETTO_PROPOSTA"; propostaId: string; effettoAzienda: number; causa: string }
  | { tipo: "MOSSA_CONCORRENTE"; concorrente: string; variazione: number; causa: string }
  | { tipo: "CORSA_DI_MERCATO"; azienda: number; concorrenti: Record<string, number>; causa: string };

export type Esito =
  | { ok: true; partita: Partita; eventi: Evento[] }
  | { ok: false; errore: string };
