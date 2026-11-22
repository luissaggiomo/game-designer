/**
 * Parametri del gioco, letti da packages/content/config.json.
 * I numeri non si scrivono mai nel codice: si cambiano nel file JSON (regola 4 del gioco).
 */
import datiConfig from "@il-direttivo/content/config.json" with { type: "json" };

export interface Configurazione {
  giocatori: { minimo: number; massimo: number };
  trimestri: number;
  votazioniPerTrimestre: number[];
  cassaPerTrimestre: number;
  mossaPrivata: {
    reparto: { puntiReparto: number; deltaAzienda: number };
    azienda: { puntiReparto: number; deltaAzienda: number };
    rumore: number[];
  };
  spie: { probabilitaNessunaSpia: number };
  concorrenti: { finoA7Giocatori: number; con8Giocatori: number };
  messaggi: { perTrimestre: number; perTrimestreDemansionato: number; caratteriTestoLibero: number };
  quesitiConAstensione: { quotaDelMazzo: number };
  autogestione: { probabilitaMossaAzienda: number };
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
  if (c.votazioniPerTrimestre.length !== c.trimestri) {
    problemi.push(
      `La scaletta delle votazioni ha ${c.votazioniPerTrimestre.length} valori, ma i trimestri sono ${c.trimestri}`,
    );
  }
  if (c.votazioniPerTrimestre.some((n) => !Number.isInteger(n) || n < 1)) {
    problemi.push("Ogni trimestre deve avere almeno una votazione");
  }
  if (c.cassaPerTrimestre <= 0) problemi.push("La cassa per trimestre deve essere positiva");
  if (c.mossaPrivata.rumore.length === 0) problemi.push("Il rumore della mossa privata non può essere vuoto");
  probabilita("spie.probabilitaNessunaSpia", c.spie.probabilitaNessunaSpia);
  probabilita("quesitiConAstensione.quotaDelMazzo", c.quesitiConAstensione.quotaDelMazzo);
  probabilita("autogestione.probabilitaMossaAzienda", c.autogestione.probabilitaMossaAzienda);
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
