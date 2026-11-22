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
export type Voto = "SI" | "NO" | "ASTENUTO";
export type SceltaMossa = "REPARTO" | "AZIENDA";

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
  astensioneAmmessa: boolean;
  /** Pesi effettivi: solo reparti occupati (D-006); tutti 1 nei quesiti con astensione (D-013). */
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
  | { nome: "RAPPORTO" }
  | { nome: "DISCUSSIONE"; votazione: number }
  | { nome: "VOTAZIONE"; votazione: number }
  | { nome: "MOSSA_PRIVATA" }
  | { nome: "RISOLUZIONE" }
  | { nome: "DEMANSIONAMENTO" }
  // Finale (GDD §15, Architettura §9 e §10.9)
  /** Decisione obbligatoria su un demansionato: promuoverlo o licenziarlo (D-028). */
  | { nome: "DECISIONE_FINALE"; bersaglio: GiocatoreId }
  | { nome: "VERIFICA"; giro: number }
  | { nome: "NOMINA"; giro: number; ballottaggio: boolean }
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
  /** Quota di mercato e cassa (in K€, D-018). */
  azienda: { quota: number; cassa: number };
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
  /** Votazione di promozione o demansionamento in corso (una alla volta). */
  votoPersonale?: VotoPersonale;
  storicoVotiPersonali: VotoPersonaleChiuso[];
  finale: StatoFinale;
  /** Calcolati nella fase PUNTEGGIO. */
  punteggi?: Partial<Record<GiocatoreId, Punteggio>>;
}

/** "Momento" di un voto personale: il numero del trimestre (fase 6) oppure il finale. */
export type MomentoVoto = number | "FINALE";

export interface VotoPersonale {
  tipo: "PROMOZIONE" | "DEMANSIONAMENTO";
  bersaglio: GiocatoreId;
  proponente: GiocatoreId;
  momento: MomentoVoto;
  voti: Partial<Record<GiocatoreId, "SI" | "NO">>;
}

export interface VotoPersonaleChiuso extends VotoPersonale {
  approvato: boolean;
  si: number;
  soglia: number;
}

export interface EsitoVerifica {
  giro: number;
  tuttiSi: boolean;
  votiNo: GiocatoreId[];
  /** Spie presenti tra gli attivi al momento della domanda (solo server, per il punteggio). */
  spieTraAttivi: GiocatoreId[];
}

export interface StatoFinale {
  /** Risposte segrete alla domanda "nel direttivo sono rimasti solo onesti?" (giro in corso). */
  verifica: Partial<Record<GiocatoreId, boolean>>;
  /** Nomine segrete (giro o ballottaggio in corso). */
  nomine: Partial<Record<GiocatoreId, GiocatoreId>>;
  /** Candidati del ballottaggio in corso (vuoto = nessun ballottaggio). */
  ballottaggio: GiocatoreId[];
  esitiVerifica: EsitoVerifica[];
  licenziamenti: { giocatore: GiocatoreId; giro: number; nominatoDa: GiocatoreId[] }[];
}

export interface Punteggio {
  totale: number;
  /** Ogni voce spiegata in una frase ("mai nascondere il perché"). */
  voci: { testo: string; punti: number }[];
}

export type ValoreCampo = string | number;

export interface SegretoIstanza {
  id: string;
  modelloId: string;
  titolo: string;
  /** Valori veri. */
  campi: Record<string, ValoreCampo>;
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
  /** Vero se il possessore l'ha persa perché demansionato (dato del proprio reparto, D-022). */
  revocata?: boolean;
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
