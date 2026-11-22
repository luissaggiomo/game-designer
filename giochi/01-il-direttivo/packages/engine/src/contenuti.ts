/**
 * Contenuti del gioco (mazzo dei quesiti, schemi di effetto, frasi, segreti) e "ambiente" del
 * motore: tutto ciò che il motore deve conoscere oltre allo stato della partita.
 * I contenuti sono controllati al caricamento: se un file è sbagliato, il gioco non parte.
 *
 * Modello B (D-023): un quesito non è legato a reparti precisi. Ha uno SCHEMA di effetto (ruoli con
 * punti e peso) e i ruoli si assegnano ai reparti al momento dell'estrazione.
 */
import datiFrasi from "@il-direttivo/content/frasi.json" with { type: "json" };
import datiProposte from "@il-direttivo/content/proposte.json" with { type: "json" };
import datiSchemi from "@il-direttivo/content/schemi.json" with { type: "json" };
import datiSegreti from "@il-direttivo/content/segreti.json" with { type: "json" };
import { caricaConfigurazione, type Configurazione } from "./config.js";
import type { Peso, RepartoId, TipoSegreto, ValoreCampo } from "./tipi.js";

export interface Ruolo {
  punti: number;
  peso: Peso;
}

export interface Schema {
  descrizione: string;
  ruoli: Ruolo[];
  /** Peso dei reparti occupati che non ricevono un ruolo. */
  pesoAltri: Peso;
  effettoAzienda: number;
}

export interface ModelloProposta {
  id: string;
  titolo: string;
  categoria: string;
  /** Costo in K€ (D-018). */
  costo: number;
  schema: string;
  trimestri: number[];
  astensioneAmmessa?: boolean;
  /** Frase per la TV che spiega l'effetto reale sull'azienda (D-033). */
  spiegazione: string;
  /** Frasi su misura per reparto e segno dell'effetto (D-030, D-032). */
  testi?: Partial<Record<RepartoId, { positivo?: string; negativo?: string }>>;
}

export interface Frasi {
  neutro: string;
  reparti: Record<RepartoId, { positivo: string[]; negativo: string[] }>;
}

export interface ModelloSegreto {
  id: string;
  titolo: string;
  /** Tipo "a bilancia": i valori stanno in config.json (D-038). */
  tipo: TipoSegreto;
  /** Versioni possibili; il dato vero si estrae campo per campo (D-036, D-037). */
  versioni: Record<string, ValoreCampo>[];
  trimestri: number[];
}

export interface Ambiente {
  config: Configurazione;
  mazzo: ModelloProposta[];
  schemi: Record<string, Schema>;
  frasi: Frasi;
  segreti: ModelloSegreto[];
}

const tuttiIReparti = (config: Configurazione) => new Set<string>([...config.reparti.base, ...config.reparti.aggiuntiviInOrdine]);

export function controllaContenuti(
  mazzo: ModelloProposta[],
  schemi: Record<string, Schema>,
  frasi: Frasi,
  config: Configurazione,
): string[] {
  const problemi: string[] = [];
  const repartiValidi = tuttiIReparti(config);

  for (const [nome, s] of Object.entries(schemi)) {
    const dove = `Schema "${nome}"`;
    if (s.ruoli.length === 0) problemi.push(`${dove}: servono dei ruoli`);
    if (s.ruoli.length > config.giocatori.minimo) problemi.push(`${dove}: più ruoli (${s.ruoli.length}) del minimo di giocatori`);
    for (const r of s.ruoli) if (![0, 1, 2].includes(r.peso)) problemi.push(`${dove}: i pesi devono essere 0, 1 o 2`);
    if (![0, 1, 2].includes(s.pesoAltri)) problemi.push(`${dove}: pesoAltri deve essere 0, 1 o 2`);
  }

  // Frasi: ogni reparto deve avere almeno una frase positiva e una negativa (uguaglianza tra reparti, D-005).
  for (const r of repartiValidi) {
    const f = frasi.reparti[r as RepartoId];
    if (!f || f.positivo.length === 0 || f.negativo.length === 0) problemi.push(`Frasi: mancano le frasi del reparto ${r}`);
  }

  if (mazzo.length === 0) problemi.push("Il mazzo dei quesiti è vuoto");
  const visti = new Set<string>();
  for (const m of mazzo) {
    const dove = `Quesito "${m.id}"`;
    if (visti.has(m.id)) problemi.push(`${dove}: identificativo ripetuto`);
    visti.add(m.id);
    if (!m.titolo) problemi.push(`${dove}: manca il titolo`);
    if (!m.spiegazione) problemi.push(`${dove}: manca la frase di spiegazione (D-033)`);
    if (!(m.costo > 0)) problemi.push(`${dove}: il costo deve essere positivo`);
    if (!schemi[m.schema]) problemi.push(`${dove}: schema "${m.schema}" inesistente`);
    if (m.trimestri.length === 0 || m.trimestri.some((t) => !Number.isInteger(t) || t < 1 || t > config.trimestri)) {
      problemi.push(`${dove}: trimestri non validi`);
    }
    for (const r of Object.keys(m.testi ?? {})) if (!repartiValidi.has(r)) problemi.push(`${dove}: testi per il reparto sconosciuto "${r}"`);
  }
  return problemi;
}

export function controllaSegreti(segreti: ModelloSegreto[], config: Configurazione): string[] {
  const problemi: string[] = [];
  const visti = new Set<string>();
  for (const s of segreti) {
    const dove = `Segreto "${s.id}"`;
    if (visti.has(s.id)) problemi.push(`${dove}: identificativo ripetuto`);
    visti.add(s.id);
    if (!(s.tipo in config.segreti.tipi)) problemi.push(`${dove}: tipo "${s.tipo}" sconosciuto`);
    const versioni = s.versioni ?? [];
    if (versioni.length < 3) problemi.push(`${dove}: servono almeno 3 versioni (D-036)`);
    const nomi = Object.keys(versioni[0] ?? {});
    if (nomi.length < 1 || nomi.length > 2) problemi.push(`${dove}: servono uno o due campi (D-037)`);
    if (versioni.some((v) => Object.keys(v).sort().join() !== [...nomi].sort().join())) problemi.push(`${dove}: tutte le versioni devono avere gli stessi campi`);
    if (new Set(versioni.map((v) => JSON.stringify(v))).size !== versioni.length) problemi.push(`${dove}: versioni ripetute`);
    if (!versioni.some((v) => Object.values(v).some((x) => /\d/.test(String(x))))) problemi.push(`${dove}: almeno un campo deve essere un numero o una data (D-037)`);
    if (s.trimestri.length === 0 || s.trimestri.some((t) => !Number.isInteger(t) || t < 1 || t > config.trimestri)) {
      problemi.push(`${dove}: trimestri non validi`);
    }
  }
  return problemi;
}

/** Carica parametri e contenuti predefiniti, controllandoli. */
export function caricaAmbiente(): Ambiente {
  const config = caricaConfigurazione();
  const mazzo = datiProposte.proposte as ModelloProposta[];
  const schemi = datiSchemi.schemi as Record<string, Schema>;
  const frasi = { neutro: datiFrasi.neutro, reparti: datiFrasi.reparti } as Frasi;
  const segreti = datiSegreti.segreti as ModelloSegreto[];
  const problemi = [...controllaContenuti(mazzo, schemi, frasi, config), ...controllaSegreti(segreti, config)];
  if (problemi.length > 0) throw new Error("Contenuti non validi:\n- " + problemi.join("\n- "));
  return { config, mazzo, schemi, frasi, segreti };
}
