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

/** Un quesito della partita (le 12 carte si preparano a inizio partita, D-069). */
export interface PropostaIstanza {
  id: string;
  modelloId: string;
  titolo: string;
  categoria: string;
  costo: number;
  trimestre: number;
  /** Frase che spiega in TV l'effetto reale, mostrata ai risultati (D-033): mai prima. */
  spiegazione: string;
  /** Effetti privati per reparto occupato: SEGRETI, ognuno vede solo il proprio. */
  effettiPrivati: Partial<Record<RepartoId, { punti?: number; testo: string }>>;
  /** Effetto sull'azienda: nascosto fino alla risoluzione. */
  effettoAzienda: number;
  /** Vero se fa parte del pacchetto approvato. */
  approvata?: boolean;
}

/** Voto del pacchetto del trimestre (D-068). Un pacchetto è un elenco di id di proposte, in ordine di costo. */
export interface VotoTrimestre {
  /** Pacchetti validi (almeno l'investimento minimo, entro la cassa). */
  pacchetti: string[][];
  /** Primo voto: SEGRETO fino alla chiusura. */
  voti: Partial<Record<GiocatoreId, string[]>>;
  /** Secondo voto, se il primo non ha una maggioranza. */
  principale?: string[];
  /** Alternativa coperta: il contenuto non esce dal server (la TV ne vede solo il numero di proposte). */
  alternativa?: string[];
  secondiVoti: Partial<Record<GiocatoreId, Voto>>;
  approvato?: string[];
  /** Come si è deciso: maggioranza al primo voto, principale o alternativa al secondo. */
  esito?: "PRIMO_VOTO" | "PRINCIPALE" | "ALTERNATIVA";
}

/** Le fasi della partita (Architettura §9; D-068: una discussione e un voto del pacchetto a trimestre). */
export type Fase =
  /** Prima della partita: ognuno sceglie il suo obiettivo personale fra tre (D-048). */
  | { nome: "SCELTA_OBIETTIVI" }
  | { nome: "RAPPORTO" }
  | { nome: "DISCUSSIONE" }
  | { nome: "VOTO_PACCHETTO" }
  | { nome: "SECONDO_VOTO" }
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
  /** Le carte di tutta la partita, per trimestre (D-069). Solo server: quelle future non si vedono. */
  carte: PropostaIstanza[][];
  /** Le tre proposte del trimestre in corso, in ordine di costo. */
  proposteTrimestre: PropostaIstanza[];
  /** Esito dell'algoritmo di equità delle carte (solo server, per test e report). */
  equita?: { scarto: number; violazioni: number };
  /** Voto del pacchetto del trimestre in corso (D-068). */
  votoTrimestre?: VotoTrimestre;
  /** Mosse private del trimestre: SEGRETE, la TV ne mostra solo l'esito complessivo (GDD §9). */
  mossePrivate: Partial<Record<GiocatoreId, SceltaMossa>>;
  /** Segreti originali generati dal gioco (solo server). */
  segreti: SegretoIstanza[];
  /** Chi possiede quale versione di quale segreto (solo server: "falsa" e "catena" non vanno mai ai telefoni). */
  copieSegreto: CopiaSegreto[];
  messaggi: Messaggio[];
  /** Segreti consegnati dalle spie ai concorrenti, con effetto ai Risultati del trimestre. */
  segretiPassati: SegretoPassato[];
  /** Quante volte ogni giocatore è stato fonte o destinatario di un segreto (D-074: equilibrio). */
  coinvolgimentiSegreti: Partial<Record<GiocatoreId, number>>;
  /** Numeratore per creare identificativi unici in modo riproducibile. */
  contatore: number;
  /** Obiettivi personali: i tre proposti e quello scelto (solo server, D-046…D-048). */
  obiettivi: Partial<Record<GiocatoreId, ObiettiviGiocatore>>;
  /**
   * Storico per proposta, per gli obiettivi (solo server). Con il voto del pacchetto (D-068): "SI" se
   * il primo voto del giocatore conteneva la proposta, "NO" altrimenti. Da rivedere con gli obiettivi (D-071).
   */
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
  /** Vero se il turno in corso ripete un turno chiuso senza nessun voto (D-063: un secondo turno vuoto = nessun licenziamento). */
  ripetutoSenzaVoti?: boolean;
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
  /** Uno dei due segreti del trimestre è finto (D-074): per l'azienda non vale nulla, al concorrente costa. MAI nelle viste. */
  finto: boolean;
  valoreAzienda: number;
  valoreConcorrente: number;
  trimestre: number;
  /** Ultimo trimestre utile per arrivare al reparto o al concorrente (D-072: il successivo). */
  scadenza: number;
  /** Trimestre in cui una copia (qualsiasi versione) è arrivata al reparto utile: lo annuncia la TV (D-074). */
  arrivatoIl?: number;
  /** Calcolato alla scadenza: una copia VERA era arrivata al reparto utile. */
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
