/**
 * Azioni: le "intenzioni" che arrivano al motore (Architettura §7).
 * I telefoni non decidono nulla: chiedono, e il motore controlla e applica.
 */
import type { Fase, GiocatoreId, ModelloMessaggio, Partita, SceltaMossa, ValoreCampo, Voto } from "./tipi.js";

/** Azioni di sistema, inviate dal server (per esempio allo scadere di un timer). */
export type AzioneSistema = { tipo: "AVANZA_FASE" };

/**
 * Azioni dei giocatori. Quelle non ancora gestite dal motore vengono rifiutate:
 * le regole relative arrivano nei passi successivi.
 */
export type AzioneGiocatore = { da: GiocatoreId } & (
  /** Prima della partita: uno dei tre obiettivi proposti (D-048). */
  | { tipo: "SCEGLI_OBIETTIVO"; obiettivo: string }
  /** Primo voto del trimestre: un pacchetto di proposte (D-068), elencate per id. */
  | { tipo: "VOTA_PACCHETTO"; pacchetto: string[] }
  /** Secondo voto: sì o no al pacchetto principale (D-068). */
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
  /** Finale: "C'è una spia nel direttivo?" (voto palese, rivelato a fine voto, D-058). */
  | { tipo: "DOMANDA_SPIA"; risposta: "SI" | "NO" }
  /** Finale: un nome nel giro dei nomi, oppure un voto nel ballottaggio (D-058). */
  | { tipo: "NOMINA_SPIA"; bersaglio: GiocatoreId }
);

export type Azione = AzioneSistema | AzioneGiocatore;

type ContenutoEvento =
  | { tipo: "FASE_INIZIATA"; fase: Fase; trimestre: number; causa: string }
  | { tipo: "CASSA_RICARICATA"; cassa: number; causa: string }
  /** Dice solo CHI ha scelto l'obiettivo, mai quale (D-047). */
  | { tipo: "OBIETTIVO_REGISTRATO"; da: GiocatoreId; causa: string }
  /** Riservato all'interessato: tempo scaduto, obiettivo estratto a caso (D-048). */
  | { tipo: "OBIETTIVO_ASSEGNATO"; causa: string }
  | { tipo: "ORDINE_DEL_GIORNO"; proposte: { id: string; titolo: string; costo: number }[]; pacchetti: string[][]; causa: string }
  /** Dice solo CHI ha votato, non cosa: i voti si rivelano alla chiusura (D-019). */
  | { tipo: "VOTO_REGISTRATO"; da: GiocatoreId; causa: string }
  /** Primo voto chiuso: chi ha votato quale pacchetto (palese alla chiusura, D-019, D-068). */
  | { tipo: "VOTO_PACCHETTO_CHIUSO"; voti: Partial<Record<GiocatoreId, string[] | "TEMPO_SCADUTO">>; approvato?: string[]; causa: string }
  /** Secondo voto: il pacchetto principale e quante proposte ha l'alternativa coperta (D-068). */
  | { tipo: "SECONDO_VOTO_APERTO"; principale: string[]; proposteAlternativa: number; causa: string }
  /** Secondo voto chiuso: chi ha votato sì o no; "TEMPO_SCADUTO" vale no. */
  | { tipo: "SECONDO_VOTO_CHIUSO"; voti: Partial<Record<GiocatoreId, Voto | "TEMPO_SCADUTO">>; approvato: string[]; principaleApprovato: boolean; causa: string }
  /** Dice solo CHI ha scelto, mai cosa. */
  | { tipo: "MOSSA_REGISTRATA"; da: GiocatoreId; causa: string }
  /** Quanti hanno giocato per l'azienda, mai chi (GDD §9, D-061). */
  | { tipo: "ESITO_MOSSE_PRIVATE"; perAzienda: number; partecipanti: number; causa: string }
  /** Effetto reale di una proposta approvata sull'azienda (GDD §8.2). */
  | { tipo: "EFFETTO_PROPOSTA"; propostaId: string; effettoAzienda: number; causa: string }
  | { tipo: "MOSSA_CONCORRENTE"; concorrente: string; variazione: number; causa: string }
  | { tipo: "CORSA_DI_MERCATO"; azienda: number; concorrenti: Record<string, number>; causa: string }
  /** Ultimo trimestre: un segreto è finito al concorrente, senza numeri né esito (D-029, variante B). */
  | { tipo: "FUGA_DI_NOTIZIE"; concorrente: string; segretoId: string; causa: string }
  /** Ultimo trimestre: risultati nascosti fino al punteggio (D-029). */
  | { tipo: "RISULTATI_RINVIATI"; causa: string }
  /** Pubblico, nel Rapporto: quale informazione serve e a chi, mai chi l'ha ricevuta (D-061). */
  | { tipo: "SEGRETO_ANNUNCIATO"; segretoId: string; utile: string; causa: string }
  /** Riservato alla fonte: "arrivato al tuo reparto" (D-074: nessuna certezza che sia vero). */
  | { tipo: "SEGRETO_RICEVUTO"; copiaId: string; causa: string }
  /** Riservato al destinatario. */
  | { tipo: "MESSAGGIO_RICEVUTO"; messaggioId: string; causa: string }
  /** Riservato alla spia. */
  | { tipo: "SEGRETO_CONSEGNATO"; copiaId: string; causa: string }
  /** Pubblico, ai Risultati: un segreto è arrivato a destinazione, vero, finto o manomesso che sia (D-074). */
  | { tipo: "SEGRETO_ARRIVATO"; segretoId: string; causa: string }
  /** Pubblico: quale segreto ha usato il concorrente, e se era falso (GDD §11.3–11.4). */
  | { tipo: "SEGRETO_USATO"; concorrente: string; segretoId: string; falso: boolean; variazione: number; causa: string }
  /** Licenziamento: il ruolo viene rivelato subito (GDD §15). */
  /** Licenziamento nel finale: il ruolo NON si rivela qui (D-078). */
  | { tipo: "LICENZIAMENTO"; giocatore: GiocatoreId; causa: string }
  /** Al punteggio: ruoli dei licenziati svelati (D-078). */
  | { tipo: "RUOLI_RIVELATI"; giocatori: GiocatoreId[]; causa: string }
  /** Dice solo chi ha risposto / nominato, mai cosa. */
  | { tipo: "RISPOSTA_REGISTRATA"; da: GiocatoreId; causa: string }
  /** Domanda del finale: voto palese (D-058). */
  | { tipo: "ESITO_DOMANDA"; giro: number; si: GiocatoreId[]; no: GiocatoreId[]; procede: boolean; causa: string }
  | { tipo: "BALLOTTAGGIO"; candidati: GiocatoreId[]; turno: number; causa: string }
  /** Percorso a tre: avvertimento prima della seconda votazione (D-058). */
  | { tipo: "AVVISO_BALLOTTAGGIO"; causa: string }
  | { tipo: "NESSUN_LICENZIAMENTO"; causa: string }
  /** Nomi o voti di ballottaggio, nell'ordine in cui la TV li mostra uno alla volta. */
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
