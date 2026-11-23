/**
 * Parametri del gioco, letti da packages/content/config.json.
 * I numeri non si scrivono mai nel codice: si cambiano nel file JSON (regola 4 del gioco).
 */
import datiConfig from "@il-direttivo/content/config.json" with { type: "json" };
import type { RepartoId, SceltaMossa, TipoSegreto } from "./tipi.js";

export interface Configurazione {
  giocatori: { minimo: number; massimo: number };
  trimestri: number;
  /** "nomi": come la TV chiama ogni reparto (es. negli annunci dei segreti, D-061). */
  reparti: { base: RepartoId[]; aggiuntiviInOrdine: RepartoId[]; nomi: Record<RepartoId, string> };
  votazioniPerTrimestre: number[];
  cassa: { perTrimestre: number; massima: number; unita: string };
  selezione: { fattoreStessaCategoria: number; probabilitaAlternativa: number };
  mossaPrivata: {
    reparto: { puntiReparto: number; deltaAzienda: number };
    azienda: { puntiReparto: number; deltaAzienda: number };
    rumore: number[];
    sceltaPredefinita: SceltaMossa;
  };
  spie: {
    probabilitaNessunaSpia: number;
    con8Giocatori: { probabilitaDueSpie: number; probabilitaStessoConcorrente: number };
  };
  concorrenti: {
    finoA7Giocatori: number;
    con8Giocatori: number;
    nomi: string[];
    /** Quota di scelte "per l'azienda" del direttivo di riferimento (D-056). */
    quotaAziendalistaRiferimento: number;
    /** Effetto medio per trimestre di proposte approvate e segreti arrivati in tempo (D-056, dal simulatore). */
    crescitaMediaProposteESegreti: number;
    eventoCasuale: number[];
  };
  messaggi: {
    perTrimestre: number;
    caratteriTestoLibero: number;
    costoAnonimo: number;
    quando: "DAL_RAPPORTO_ALLE_VOTAZIONI" | "TUTTO_IL_TRIMESTRE";
  };
  segreti: {
    perTrimestre: number;
    penalitaFalsoConcorrente: number;
    /** Tipi "a bilancia" (D-038, D-039). */
    tipi: Record<
      TipoSegreto,
      {
        /** Quota di mercato per l'azienda se arriva in tempo al reparto utile. */
        azienda: number;
        /** Quota di mercato per il concorrente se una spia glielo consegna (vero). */
        concorrente: number;
        /** Punti alla spia per un segreto di questo tipo usato dal suo concorrente. */
        puntiSpia: number;
        /** Quanti segreti di questo tipo al massimo nello stesso trimestre (assente = nessun limite). */
        massimoPerTrimestre?: number;
      }
    >;
  };
  /** Risposta di chi non risponde in tempo alla domanda "C'è una spia?" (D-058: "NO"). */
  finale: { rispostaDomandaPredefinita: "SI" | "NO" };
  /** Nel finale non ci sono punti per accuse e licenziamenti (D-059). */
  punteggio: {
    aziendaVince: number;
    concorrenteVince: number;
  };
  /** Obiettivi personali (D-046…D-052). */
  obiettivi: {
    /** Quanti obiettivi riceve ognuno: uno per tipo (D-046). */
    proposti: number;
    /** Per tipo ("1", "2", "3"): punti del traguardo facile e del difficile. */
    punti: Record<string, number[]>;
    /** Tempo massimo per la scelta (lo usa il server; allo scadere il motore estrae a caso, D-048). */
    secondiPerLaScelta: number;
  };
}

/** Controlla che la configurazione sia coerente; restituisce l'elenco dei problemi (vuoto = tutto ok). */
export function controllaConfigurazione(c: Configurazione): string[] {
  const problemi: string[] = [];
  const probabilita = (nome: string, p: number) => {
    if (!(p >= 0 && p <= 1)) problemi.push(`${nome} deve essere tra 0 e 1 (trovato ${p})`);
  };
  if (c.giocatori.minimo < 1 || c.giocatori.minimo > c.giocatori.massimo) {
    problemi.push("Numero di giocatori: minimo e massimo incoerenti");
  }
  const tuttiIReparti = [...c.reparti.base, ...c.reparti.aggiuntiviInOrdine];
  if (new Set(tuttiIReparti).size !== tuttiIReparti.length) {
    problemi.push("Un reparto compare più di una volta nell'elenco dei reparti");
  }
  for (const r of tuttiIReparti) if (!c.reparti.nomi?.[r]) problemi.push(`Manca il nome del reparto ${r} (reparti.nomi)`);
  if (tuttiIReparti.length < c.giocatori.massimo) {
    problemi.push(`Servono almeno ${c.giocatori.massimo} reparti (uno per giocatore), ce ne sono ${tuttiIReparti.length}`);
  }
  if (c.votazioniPerTrimestre.length !== c.trimestri) {
    problemi.push(
      `La scaletta delle votazioni ha ${c.votazioniPerTrimestre.length} valori, ma i trimestri sono ${c.trimestri}`,
    );
  }
  if (c.votazioniPerTrimestre.some((n) => !Number.isInteger(n) || n < 1)) {
    problemi.push("Ogni trimestre deve avere almeno una votazione");
  }
  if (c.cassa.perTrimestre <= 0) problemi.push("Il budget per trimestre deve essere positivo");
  if (c.cassa.massima < c.cassa.perTrimestre) problemi.push("Il tetto della cassa non può essere inferiore al budget per trimestre");
  if (c.mossaPrivata.rumore.length === 0) problemi.push("Il rumore della mossa privata non può essere vuoto");
  if (!["REPARTO", "AZIENDA"].includes(c.mossaPrivata.sceltaPredefinita)) {
    problemi.push('La scelta predefinita della mossa privata deve essere "REPARTO" o "AZIENDA"');
  }
  if (c.concorrenti.eventoCasuale.length === 0) problemi.push("L'evento casuale dei concorrenti non può essere vuoto");
  if (!["DAL_RAPPORTO_ALLE_VOTAZIONI", "TUTTO_IL_TRIMESTRE"].includes(c.messaggi.quando)) {
    problemi.push('messaggi.quando deve essere "DAL_RAPPORTO_ALLE_VOTAZIONI" o "TUTTO_IL_TRIMESTRE"');
  }
  if (!["SI", "NO"].includes(c.finale.rispostaDomandaPredefinita)) {
    problemi.push('finale.rispostaDomandaPredefinita deve essere "SI" o "NO"');
  }
  if (c.messaggi.costoAnonimo < 1) problemi.push("Il costo del messaggio anonimo deve essere almeno 1");
  if (c.segreti.perTrimestre < 0) problemi.push("I segreti per trimestre non possono essere negativi");
  for (const t of TIPI_SEGRETO) {
    const v = c.segreti.tipi?.[t];
    if (!v) problemi.push(`segreti.tipi: manca il tipo ${t}`);
    else if (v.massimoPerTrimestre !== undefined && v.massimoPerTrimestre < 1) problemi.push(`segreti.tipi.${t}.massimoPerTrimestre deve essere almeno 1`);
  }
  const maxConcorrenti = Math.max(c.concorrenti.finoA7Giocatori, c.concorrenti.con8Giocatori);
  if (c.concorrenti.nomi.length < maxConcorrenti) {
    problemi.push(`Servono almeno ${maxConcorrenti} nomi di concorrenti`);
  }
  probabilita("spie.probabilitaNessunaSpia", c.spie.probabilitaNessunaSpia);
  probabilita("spie.con8Giocatori.probabilitaDueSpie", c.spie.con8Giocatori.probabilitaDueSpie);
  probabilita("spie.con8Giocatori.probabilitaStessoConcorrente", c.spie.con8Giocatori.probabilitaStessoConcorrente);
  probabilita("selezione.fattoreStessaCategoria", c.selezione.fattoreStessaCategoria);
  probabilita("selezione.probabilitaAlternativa", c.selezione.probabilitaAlternativa);
  probabilita("concorrenti.quotaAziendalistaRiferimento", c.concorrenti.quotaAziendalistaRiferimento);
  const tipiObiettivi = Object.keys(c.obiettivi?.punti ?? {});
  if (tipiObiettivi.length !== c.obiettivi?.proposti) problemi.push("obiettivi: servono i punti di tanti tipi quanti sono gli obiettivi proposti (uno per tipo)");
  for (const [tipo, punti] of Object.entries(c.obiettivi?.punti ?? {})) {
    if (!Array.isArray(punti) || punti.length !== 2 || punti.some((x) => !(x > 0))) problemi.push(`obiettivi.punti.${tipo}: servono due punteggi positivi (facile, difficile)`);
  }
  if (!(c.obiettivi?.secondiPerLaScelta > 0)) problemi.push("obiettivi.secondiPerLaScelta deve essere positivo");
  return problemi;
}

export const TIPI_SEGRETO: TipoSegreto[] = ["DA_FAR_GIRARE", "NORMALE", "DA_CUSTODIRE"];

/** Configurazione predefinita, controllata al caricamento: se è incoerente il gioco non parte. */
export function caricaConfigurazione(): Configurazione {
  const c = datiConfig as Configurazione;
  const problemi = controllaConfigurazione(c);
  if (problemi.length > 0) {
    throw new Error("config.json non valido:\n- " + problemi.join("\n- "));
  }
  return c;
}
