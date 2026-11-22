/**
 * Parametri del gioco, letti da packages/content/config.json.
 * I numeri non si scrivono mai nel codice: si cambiano nel file JSON (regola 4 del gioco).
 */
import datiConfig from "@il-direttivo/content/config.json" with { type: "json" };
import type { RepartoId, SceltaMossa } from "./tipi.js";

export interface Configurazione {
  giocatori: { minimo: number; massimo: number };
  trimestri: number;
  reparti: { base: RepartoId[]; aggiuntiviInOrdine: RepartoId[] };
  votazioniPerTrimestre: number[];
  cassa: { perTrimestre: number; massima: number; unita: string };
  selezione: {
    sogliaPesoVacanti: number;
    fattoreVacantiPesanti: number;
    fattoreStessaCategoria: number;
    fattoreFavoritoInEccesso: number;
  };
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
    crescitaBase: number;
    eventoCasuale: number[];
  };
  messaggi: {
    perTrimestre: number;
    perTrimestreDemansionato: number;
    caratteriTestoLibero: number;
    costoAnonimo: number;
    quando: "DAL_RAPPORTO_ALLE_VOTAZIONI" | "TUTTO_IL_TRIMESTRE";
  };
  segreti: {
    perTrimestre: number;
    penalitaFalsoConcorrente: number;
    puntiSpiaPerSegretoUsato: number;
    fattoreFonteInEccesso: number;
  };
  quesitiConAstensione: { quotaDelMazzo: number };
  autogestione: { mossaPrivataDemansionati: boolean; probabilitaMossaAzienda: number; fattoreEffetti: number };
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
  probabilita("autogestione.fattoreEffetti", c.autogestione.fattoreEffetti);
  probabilita("segreti.fattoreFonteInEccesso", c.segreti.fattoreFonteInEccesso);
  if (!["DAL_RAPPORTO_ALLE_VOTAZIONI", "TUTTO_IL_TRIMESTRE"].includes(c.messaggi.quando)) {
    problemi.push('messaggi.quando deve essere "DAL_RAPPORTO_ALLE_VOTAZIONI" o "TUTTO_IL_TRIMESTRE"');
  }
  if (c.messaggi.costoAnonimo < 1) problemi.push("Il costo del messaggio anonimo deve essere almeno 1");
  if (c.segreti.perTrimestre < 0) problemi.push("I segreti per trimestre non possono essere negativi");
  const maxConcorrenti = Math.max(c.concorrenti.finoA7Giocatori, c.concorrenti.con8Giocatori);
  if (c.concorrenti.nomi.length < maxConcorrenti) {
    problemi.push(`Servono almeno ${maxConcorrenti} nomi di concorrenti`);
  }
  probabilita("spie.probabilitaNessunaSpia", c.spie.probabilitaNessunaSpia);
  probabilita("spie.con8Giocatori.probabilitaDueSpie", c.spie.con8Giocatori.probabilitaDueSpie);
  probabilita("spie.con8Giocatori.probabilitaStessoConcorrente", c.spie.con8Giocatori.probabilitaStessoConcorrente);
  probabilita("quesitiConAstensione.quotaDelMazzo", c.quesitiConAstensione.quotaDelMazzo);
  probabilita("autogestione.probabilitaMossaAzienda", c.autogestione.probabilitaMossaAzienda);
  probabilita("selezione.sogliaPesoVacanti", c.selezione.sogliaPesoVacanti);
  probabilita("selezione.fattoreVacantiPesanti", c.selezione.fattoreVacantiPesanti);
  probabilita("selezione.fattoreStessaCategoria", c.selezione.fattoreStessaCategoria);
  probabilita("selezione.fattoreFavoritoInEccesso", c.selezione.fattoreFavoritoInEccesso);
  return problemi;
}

/** Configurazione predefinita, controllata al caricamento: se è incoerente il gioco non parte. */
export function caricaConfigurazione(): Configurazione {
  const c = datiConfig as Configurazione;
  const problemi = controllaConfigurazione(c);
  if (problemi.length > 0) {
    throw new Error("config.json non valido:\n- " + problemi.join("\n- "));
  }
  return c;
}
