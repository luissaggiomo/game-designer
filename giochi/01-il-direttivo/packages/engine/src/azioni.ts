/**
 * Azioni: le "intenzioni" che arrivano al motore (Architettura §7).
 * I telefoni non decidono nulla: chiedono, e il motore controlla e applica.
 */
import type { Fase, GiocatoreId, ModelloMessaggio, Partita, SceltaMossa, ValoreCampo, Voto } from "./tipi.js";

/** Azioni di sistema, inviate dal server (per esempio allo scadere di un timer). */
export type AzioneSistema = { tipo: "AVANZA_FASE" } | { tipo: "CHIUDI_VOTO_PERSONALE" };

/**
 * Azioni dei giocatori. Quelle non ancora gestite dal motore vengono rifiutate:
 * le regole relative arrivano nei passi successivi.
 */
export type AzioneGiocatore = { da: GiocatoreId } & (
  | { tipo: "VOTA"; voto: Voto }
  | { tipo: "MOSSA_PRIVATA"; scelta: SceltaMossa }
  | {
      tipo: "INVIA_MESSAGGIO";
      a: GiocatoreId;
      anonimo: boolean;
      modello: ModelloMessaggio;
      testo?: string;
      /** Per inoltrare un segreto: la propria copia. */
      copiaSegretoId?: string;
      /** Per inoltrarlo modificato: i campi cambiati (il gioco registrerà la copia come falsa). */
      campi?: Record<string, ValoreCampo>;
    }
  | { tipo: "PASSA_AL_CONCORRENTE"; copiaSegretoId: string }
  | { tipo: "PROPONI_DEMANSIONAMENTO"; bersaglio: GiocatoreId }
  | { tipo: "VOTA_DEMANSIONAMENTO"; voto: "SI" | "NO" }
  | { tipo: "PROPONI_PROMOZIONE"; bersaglio: GiocatoreId }
  | { tipo: "VOTA_PROMOZIONE"; voto: "SI" | "NO" }
  /** Finale: "nel direttivo sono rimasti solo onesti?" (risposta segreta). */
  | { tipo: "VERIFICA_FINALE"; soloOnesti: boolean }
  | { tipo: "NOMINA_SPIA"; bersaglio: GiocatoreId }
);

export type Azione = AzioneSistema | AzioneGiocatore;

type ContenutoEvento =
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
  | { tipo: "CORSA_DI_MERCATO"; azienda: number; concorrenti: Record<string, number>; causa: string }
  /** Ultimo trimestre: un segreto è finito al concorrente, senza numeri né esito (D-029, variante B). */
  | { tipo: "FUGA_DI_NOTIZIE"; concorrente: string; segretoId: string; causa: string }
  /** Ultimo trimestre: risultati nascosti fino al punteggio (D-029). */
  | { tipo: "RISULTATI_RINVIATI"; causa: string }
  /** Riservato alla fonte: dato ufficiale del suo reparto (D-015). */
  | { tipo: "SEGRETO_RICEVUTO"; copiaId: string; causa: string }
  /** Riservato al destinatario. */
  | { tipo: "MESSAGGIO_RICEVUTO"; messaggioId: string; causa: string }
  /** Riservato alla spia. */
  | { tipo: "SEGRETO_CONSEGNATO"; copiaId: string; causa: string }
  /** Pubblico, senza dire quale segreto (D-021, S2). */
  | { tipo: "SEGRETO_IN_TEMPO"; variazione: number; causa: string }
  /** Pubblico: quale segreto ha usato il concorrente, e se era falso (GDD §11.3–11.4). */
  | { tipo: "SEGRETO_USATO"; concorrente: string; segretoId: string; falso: boolean; variazione: number; causa: string }
  /** Promozioni e demansionamenti (GDD §13): proposta pubblica, voti rivelati alla chiusura. */
  | { tipo: "VOTO_PERSONALE_APERTO"; voto: "PROMOZIONE" | "DEMANSIONAMENTO"; bersaglio: GiocatoreId; proponente: GiocatoreId; causa: string }
  | { tipo: "VOTO_PERSONALE_REGISTRATO"; da: GiocatoreId; causa: string }
  | {
      tipo: "VOTO_PERSONALE_CHIUSO";
      voto: "PROMOZIONE" | "DEMANSIONAMENTO";
      bersaglio: GiocatoreId;
      approvato: boolean;
      si: number;
      soglia: number;
      voti: Partial<Record<GiocatoreId, "SI" | "NO" | "TEMPO_SCADUTO">>;
      causa: string;
    }
  /** Licenziamento: il ruolo viene rivelato subito (GDD §15). */
  | { tipo: "LICENZIAMENTO"; giocatore: GiocatoreId; spia: boolean; causa: string }
  /** Dice solo chi ha risposto / nominato, mai cosa. */
  | { tipo: "RISPOSTA_REGISTRATA"; da: GiocatoreId; causa: string }
  | { tipo: "ESITO_VERIFICA"; tuttiSi: boolean; votiNo: GiocatoreId[]; causa: string }
  | { tipo: "BALLOTTAGGIO"; candidati: GiocatoreId[]; causa: string }
  /** Le nomine, nell'ordine in cui la TV le mostra una alla volta. */
  | { tipo: "RIVELAZIONE_NOMINE"; nomine: { da: GiocatoreId; bersaglio: GiocatoreId }[]; causa: string }
  | { tipo: "PUNTEGGI"; classifica: { giocatore: GiocatoreId; totale: number }[]; causa: string };

/**
 * Evento da mostrare: ognuno porta una causa leggibile (regola 2 del gioco).
 * Se "riservatoA" è presente, l'evento va SOLO a quei giocatori; altrimenti è pubblico (TV).
 */
export type Evento = ContenutoEvento & { riservatoA?: GiocatoreId[] };

export type Esito =
  | { ok: true; partita: Partita; eventi: Evento[] }
  | { ok: false; errore: string };
