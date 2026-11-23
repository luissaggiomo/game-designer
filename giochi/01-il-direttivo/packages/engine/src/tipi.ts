/**
 * Stato della partita: tutto ciò che il server conosce.
 * ATTENZIONE: questo stato contiene i segreti (ruoli, spie, effetti privati). Non va mai inviato
 * così com'è ai dispositivi: ognuno riceverà solo la propria "vista filtrata" (Architettura §2, regola 3).
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
export type Peso = 0 | 1 | 2;
export type Voto = "SI" | "NO";
export type SceltaMossa = "REPARTO" | "AZIENDA";

export type Fazione = { tipo: "ONESTO" } | { tipo: "SPIA"; concorrente: ConcorrenteId };

export interface Giocatore {
  id: GiocatoreId;
  nome: string;
  repartoId: RepartoId;
  fazione: Fazione;
  /** Niente demansionamento (D-057): si è attivi fino all'eventuale licenziamento nel finale. */
  stato: "ATTIVO" | "LICENZIATO";
  puntiReparto: number;
  /** Messaggi privati ancora disponibili nel trimestre (non accumulabili, GDD §10.1). */
  quotaMessaggi: number;
  pauseCaffe: number;
}

export interface Reparto {
  id: RepartoId;
  /** Assente = reparto vacante dall'inizio. */
  occupatoDa?: GiocatoreId;
  /** Vero se il reparto è vacante (GDD §14, D-057). */
  autogestione: boolean;
}

export interface Concorrente {
  id: ConcorrenteId;
  nome: string;
  quota: number;
}

export interface EsitoVotazione {
  approvata: boolean;
  si: number;
  soglia: number;
  /** Voti assegnati d'ufficio come "no" per tempo scaduto (D-007). */
  votiPerTempoScaduto: number;
  /** Spiegazione in una frase, da mostrare in TV. */
  motivo: string;
}

/** Un quesito estratto per il trimestre in corso. */
export interface PropostaIstanza {
  id: string;
  modelloId: string;
  titolo: string;
  categoria: string;
  costo: number;
  /** Frase che spiega in TV l'effetto reale, mostrata ai risultati (D-033): mai prima. */
  spiegazione: string;
  /** Pesi effettivi: solo reparti occupati (D-006). */
  pesi: Partial<Record<RepartoId, Peso>>;
  /** Effetti privati per reparto: SEGRETI, ognuno vede solo il proprio. */
  effettiPrivati: Partial<Record<RepartoId, { punti?: number; testo: string }>>;
  /** Effetto sull'azienda: nascosto fino alla risoluzione. */
  effettoAzienda: number;
  voti: Partial<Record<GiocatoreId, Voto>>;
  esito?: EsitoVotazione;
}

/** Le fasi della partita (Architettura §9, con il ciclo discussione → voto di D-008). */
export type Fase =
  /** Prima della partita: ognuno sceglie il suo obiettivo personale fra tre (D-048). */
  | { nome: "SCELTA_OBIETTIVI" }
  | { nome: "RAPPORTO" }
  | { nome: "DISCUSSIONE"; votazione: number }
  | { nome: "VOTAZIONE"; votazione: number }
  | { nome: "MOSSA_PRIVATA" }
  | { nome: "RISOLUZIONE" }
  // Finale "Rinnovo dei contratti" (GDD §15, D-058)
  /** "C'è una spia nel direttivo?" Sì / No, voto palese. */
  | { nome: "DOMANDA"; giro: number }
  /** Ognuno fa un nome. */
  | { nome: "NOMINA"; giro: number }
  /** Ballottaggio tra i più nominati: turno 1, 2 (dopo uno stallo) e 3 (ultima votazione, percorso a tre). */
  | { nome: "BALLOTTAGGIO"; giro: number; turno: number }
  | { nome: "PUNTEGGIO" }
  | { nome: "LETTURA_MESSAGGI" }
  | { nome: "FINE" };

import type { Evento } from "./azioni.js";

export interface Partita {
  /**
   * Risultati del 4° trimestre tenuti nascosti fino al punteggio (D-029): gli eventi già calcolati
   * e le quote di mercato com'erano prima, da mostrare nel frattempo.
   */
  risultatiRinviati?: { eventi: Evento[]; quote: { azienda: number; concorrenti: Record<string, number> } };
  seme: number;
  /** Stato del generatore casuale: la partita prosegue sempre in modo riproducibile. */
  statoCasuale: number;
  fase: Fase;
  trimestre: number;
  giocatori: Giocatore[];
  reparti: Reparto[];
  concorrenti: Concorrente[];
  /** Quota di mercato e cassa (in K€, D-018). */
  azienda: { quota: number; cassa: number };
  /** Cassa all'inizio del trimestre in corso, dopo il budget (storico per gli obiettivi). */
  cassaInizioTrimestre: number;
  /** Ordine del giorno del trimestre, nell'ordine annunciato nel Rapporto (D-008). */
  proposteTrimestre: PropostaIstanza[];
  /** Identificativi dei quesiti già usciti nella partita. */
  proposteUscite: string[];
  /** Quante volte ogni reparto è stato "favorito" da un quesito estratto (D-014). */
  conteggioFavoriti: Partial<Record<RepartoId, number>>;
  /** Mosse private del trimestre: SEGRETE, la TV ne mostra solo l'esito complessivo (GDD §9). */
  mossePrivate: Partial<Record<GiocatoreId, SceltaMossa>>;
  /** Segreti originali generati dal gioco (solo server). */
  segreti: SegretoIstanza[];
  /** Chi possiede quale versione di quale segreto (solo server: "falsa" e "catena" non vanno mai ai telefoni). */
  copieSegreto: CopiaSegreto[];
  messaggi: Messaggio[];
  /** Segreti consegnati dalle spie ai concorrenti, con effetto ai Risultati del trimestre. */
  segretiPassati: SegretoPassato[];
  /** Quante volte ogni reparto ha ricevuto segreti come fonte (D-005). */
  conteggioFontiSegreti: Partial<Record<RepartoId, number>>;
  /** Numeratore per creare identificativi unici in modo riproducibile. */
  contatore: number;
  /** Obiettivi personali: i tre proposti e quello scelto (solo server, D-046…D-048). */
  obiettivi: Partial<Record<GiocatoreId, ObiettiviGiocatore>>;
  /** Storico delle votazioni sulle proposte, per verificare gli obiettivi (solo server). */
  storicoVotazioni: RegistroVotazione[];
  /** Storico dei trimestri risolti: mosse scelte, andamento, cassa (solo server). */
  storicoTrimestri: RegistroTrimestre[];
  finale: StatoFinale;
  /** Calcolati nella fase PUNTEGGIO. */
  punteggi?: Partial<Record<GiocatoreId, Punteggio>>;
}

export interface ObiettiviGiocatore {
  /** Identificativi dei tre obiettivi proposti, uno per tipo. Gli scartati non escono mai dal server (D-047). */
  proposti: string[];
  scelto?: string;
  /** Vero se il tempo è scaduto e l'obiettivo è stato estratto a caso (D-048). */
  sceltoACaso?: boolean;
}

export interface RegistroVotazione {
  propostaId: string;
  trimestre: number;
  /** Posizione nell'ordine del giorno e numero di votazioni del trimestre. */
  posizione: number;
  votazioniDelTrimestre: number;
  costo: number;
  /** Vero se è (una del)le proposte più costose del trimestre. */
  piuCostosa: boolean;
  approvata: boolean;
  /** Effetto reale sull'azienda (noto ai giocatori solo ai Risultati, D-029 per l'ultimo trimestre). */
  effettoAzienda: number;
  /** Solo i voti espressi da chi aveva diritto (niente tempo scaduto, D-052 R2). */
  voti: Partial<Record<GiocatoreId, Voto>>;
  /** Chi, votando al contrario, avrebbe ribaltato l'esito (D-052). */
  decisivi: GiocatoreId[];
  /** Cassa subito dopo la votazione. */
  cassaDopo: number;
}

export interface RegistroTrimestre {
  trimestre: number;
  /** Mosse private scelte davvero dai direttori (non quelle predefinite o del computer, D-052 R2). */
  mosseScelte: Partial<Record<GiocatoreId, SceltaMossa>>;
  /** Quanti membri del direttivo hanno giocato per l'azienda (pubblico, D-061), compresi i tempi scaduti. */
  perAzienda: number;
  /** Membri del direttivo che facevano la mossa privata. */
  partecipanti: number;
  cassaInizio: number;
  /** Cassa dopo l'ultima votazione del trimestre. */
  cassaFine: number;
  /** Quanto hanno reso all'azienda le proposte approvate e i segreti arrivati in tempo (D-056). */
  effettoProposte?: number;
  effettoSegreti?: number;
}

/** Ballottaggio in corso nel finale (D-058). */
export interface Ballottaggio {
  candidati: GiocatoreId[];
  /** "DUE": stallo ripetuto = licenziati entrambi. "TRE" (tre o più candidati all'inizio): ultima votazione con i nomi ripetuti bloccati, poi nessun licenziato. */
  percorso: "DUE" | "TRE";
  turno: number;
  /** Voti dei turni precedenti (per bloccare, al turno 3, il nome votato due volte di fila). */
  votiPrecedenti: Partial<Record<GiocatoreId, GiocatoreId>>[];
}

export interface EsitoDomanda {
  giro: number;
  /** Voto palese: chi ha risposto sì e chi no (il tempo scaduto vale "No", D-058). */
  si: GiocatoreId[];
  no: GiocatoreId[];
  tempoScaduto: GiocatoreId[];
  procede: boolean;
}

/** Una votazione chiusa del finale (nomi o ballottaggio), pubblica dopo la rivelazione. */
export interface VotazioneFinale {
  giro: number;
  tipo: "NOMI" | "BALLOTTAGGIO";
  turno: number;
  voti: { da: GiocatoreId; per: GiocatoreId }[];
}

export interface StatoFinale {
  /** Risposte alla domanda "C'è una spia?" del giro in corso. */
  risposte: Partial<Record<GiocatoreId, boolean>>;
  /** Nomi (o voti di ballottaggio) del turno in corso: segreti fino alla rivelazione. */
  nomine: Partial<Record<GiocatoreId, GiocatoreId>>;
  ballottaggio?: Ballottaggio;
  esitiDomanda: EsitoDomanda[];
  votazioni: VotazioneFinale[];
  licenziamenti: { giocatore: GiocatoreId; giro: number; votatoDa: GiocatoreId[] }[];
}

export interface Punteggio {
  totale: number;
  /** Ogni voce spiegata in una frase ("mai nascondere il perché"). */
  voci: { testo: string; punti: number }[];
}

export type ValoreCampo = string | number;

/** Tipo "a bilancia" di un segreto, scritto a parole sulla scheda (D-038). */
export type TipoSegreto = "DA_FAR_GIRARE" | "NORMALE" | "DA_CUSTODIRE";

export interface SegretoIstanza {
  id: string;
  modelloId: string;
  titolo: string;
  tipo: TipoSegreto;
  /** Valori veri, estratti campo per campo tra quelli possibili (D-036, D-037). */
  campi: Record<string, ValoreCampo>;
  /** Valori possibili di ogni campo (dal modello): suggerimenti per chi falsifica (D-036). */
  valoriPossibili: Record<string, ValoreCampo[]>;
  fonte: RepartoId;
  utile: RepartoId;
  /** Vale se arriva al reparto utile prima della chiusura di questa votazione (D-021). */
  propostaCollegataId: string;
  valoreAzienda: number;
  valoreConcorrente: number;
  trimestre: number;
  arrivatoInTempo: boolean;
}

export interface CopiaSegreto {
  id: string;
  segretoId: string;
  possessore: GiocatoreId;
  /** Possono differire dai valori veri, se qualcuno li ha modificati. */
  campi: Record<string, ValoreCampo>;
  /** Vero se i campi differiscono dall'originale. MAI visibile al possessore. */
  falsa: boolean;
  /** Ciò che il possessore vede della provenienza (D-015). */
  provenienza: { tipo: "GIOCO" } | { tipo: "GIOCATORE"; da: GiocatoreId; anonimo: boolean };
  /** Percorso completo dei passaggi (solo server, lettura finale e poteri d'indagine). */
  catena: GiocatoreId[];
  /** Vero se chi l'ha inoltrata ha cambiato dei campi (solo server, per gli obiettivi). */
  modificataDalMittente?: boolean;
  /** Chi ha modificato i campi lungo il percorso di questa copia (solo server). */
  alterataDa?: GiocatoreId[];
}

export type ModelloMessaggio = "SEGRETO" | "CHIEDI_DATO" | "PATTO" | "SOLO_TESTO";

export interface Messaggio {
  id: string;
  trimestre: number;
  da: GiocatoreId;
  a: GiocatoreId;
  anonimo: boolean;
  modello: ModelloMessaggio;
  testo?: string;
  copiaSegretoId?: string;
}

export interface SegretoPassato {
  copiaId: string;
  segretoId: string;
  spia: GiocatoreId;
  concorrente: ConcorrenteId;
  trimestre: number;
  /** Calcolato ai Risultati: vero se la copia era vera. */
  riuscito?: boolean;
}
