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
}
