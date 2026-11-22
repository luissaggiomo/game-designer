/**
 * Contenuti del gioco (mazzo dei quesiti, tabella dei pesi) e "ambiente" del motore:
 * tutto ciò che il motore deve conoscere oltre allo stato della partita.
 * I contenuti sono controllati al caricamento: se un file è sbagliato, il gioco non parte.
 */
import datiPesi from "@il-direttivo/content/pesi.json" with { type: "json" };
import datiProposte from "@il-direttivo/content/proposte.json" with { type: "json" };
import { caricaConfigurazione, type Configurazione } from "./config.js";
import type { Peso, RepartoId } from "./tipi.js";

export type PesiReparti = Partial<Record<RepartoId, Peso>>;

export interface TabellaPesi {
  categorie: Record<string, PesiReparti>;
}

export interface EffettoPrivatoModello {
  /** Punti per il reparto (assente = solo informazione di contesto). */
  punti?: number;
  testo: string;
}

export interface ModelloProposta {
  id: string;
  titolo: string;
  categoria: string;
  /** Costo in K€ (D-018). */
  costo: number;
  /** Reparti che il quesito riguarda specificamente: se sono in autogestione, il quesito non esce. */
  riguarda: RepartoId[];
  trimestri: number[];
  astensioneAmmessa?: boolean;
  /** Pesi propri del quesito; se assenti valgono quelli della categoria. */
  pesi?: PesiReparti;
  effettiPrivati: Partial<Record<RepartoId, EffettoPrivatoModello>>;
  effettoAzienda: { base: number };
}

export interface Ambiente {
  config: Configurazione;
  mazzo: ModelloProposta[];
  pesi: TabellaPesi;
}

/** Pesi di un quesito secondo i dati (prima di togliere i reparti vacanti). */
export function pesiDelModello(m: ModelloProposta, tabella: TabellaPesi): PesiReparti {
  return m.pesi ?? tabella.categorie[m.categoria] ?? {};
}

export function controllaContenuti(mazzo: ModelloProposta[], pesi: TabellaPesi, config: Configurazione): string[] {
  const problemi: string[] = [];
  const repartiValidi = new Set<string>([...config.reparti.base, ...config.reparti.aggiuntiviInOrdine]);
  const controllaPesi = (dove: string, p: PesiReparti) => {
    for (const [reparto, valore] of Object.entries(p)) {
      if (!repartiValidi.has(reparto)) problemi.push(`${dove}: reparto sconosciuto "${reparto}"`);
      if (![0, 1, 2].includes(valore as number)) problemi.push(`${dove}: il peso di ${reparto} deve essere 0, 1 o 2`);
    }
  };

  for (const [categoria, p] of Object.entries(pesi.categorie)) controllaPesi(`Categoria ${categoria}`, p);

  if (mazzo.length === 0) problemi.push("Il mazzo dei quesiti è vuoto");
  const visti = new Set<string>();
  for (const m of mazzo) {
    const dove = `Quesito "${m.id}"`;
    if (visti.has(m.id)) problemi.push(`${dove}: identificativo ripetuto`);
    visti.add(m.id);
    if (!m.titolo) problemi.push(`${dove}: manca il titolo`);
    if (!(m.costo > 0)) problemi.push(`${dove}: il costo deve essere positivo`);
    if (!m.pesi && !pesi.categorie[m.categoria]) problemi.push(`${dove}: categoria "${m.categoria}" senza pesi`);
    if (m.pesi) controllaPesi(dove, m.pesi);
    if (m.trimestri.length === 0 || m.trimestri.some((t) => !Number.isInteger(t) || t < 1 || t > config.trimestri)) {
      problemi.push(`${dove}: trimestri non validi`);
    }
    for (const r of m.riguarda) if (!repartiValidi.has(r)) problemi.push(`${dove}: "riguarda" contiene il reparto sconosciuto "${r}"`);
    for (const r of Object.keys(m.effettiPrivati)) {
      if (!repartiValidi.has(r)) problemi.push(`${dove}: effetto privato per il reparto sconosciuto "${r}"`);
    }
  }
  return problemi;
}

/** Carica parametri e contenuti predefiniti, controllandoli. */
export function caricaAmbiente(): Ambiente {
  const config = caricaConfigurazione();
  const mazzo = datiProposte.proposte as ModelloProposta[];
  const pesi = datiPesi as TabellaPesi;
  const problemi = controllaContenuti(mazzo, pesi, config);
  if (problemi.length > 0) throw new Error("Contenuti non validi:\n- " + problemi.join("\n- "));
  return { config, mazzo, pesi };
}
