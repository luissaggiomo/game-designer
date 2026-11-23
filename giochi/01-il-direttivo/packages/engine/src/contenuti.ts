/**
 * Contenuti del gioco (mazzo dei quesiti, schemi di effetto, frasi, segreti) e "ambiente" del
 * motore: tutto ciò che il motore deve conoscere oltre allo stato della partita.
 * I contenuti sono controllati al caricamento: se un file è sbagliato, il gioco non parte.
 *
 * Modello B (D-023): un quesito non è legato a reparti precisi. Ha uno SCHEMA di effetto, cioè una
 * famiglia (D-077: buon affare, investimento, neutro, spreco) con il suo effetto sull'azienda e alcune
 * "forme" possibili (ruoli con punti); a inizio partita si estrae una forma e i ruoli si assegnano ai
 * reparti con l'algoritmo di equità (D-069).
 * Niente pesi: nel voto del pacchetto ognuno vale 1 (D-068).
 */
import datiFrasi from "@il-direttivo/content/frasi.json" with { type: "json" };
import datiProposte from "@il-direttivo/content/proposte.json" with { type: "json" };
import datiSchemi from "@il-direttivo/content/schemi.json" with { type: "json" };
import datiSegreti from "@il-direttivo/content/segreti.json" with { type: "json" };
import datiObiettivi from "@il-direttivo/content/obiettivi.json" with { type: "json" };
import { caricaConfigurazione, type Configurazione } from "./config.js";
import { MISURE_NOTE } from "./misure.js";
import type { RepartoId, TipoSegreto, ValoreCampo } from "./tipi.js";

/** Famiglie di schemi (D-077), distinte dall'effetto sull'azienda. */
export const FAMIGLIE = ["BUON_AFFARE", "INVESTIMENTO", "NEUTRO", "SPRECO"] as const;
export type Famiglia = (typeof FAMIGLIE)[number];

export interface Schema {
  /** Costo dei quesiti che usano questo schema: fissa il totale di bonus e malus (D-070). */
  costo: number;
  famiglia: Famiglia;
  descrizione: string;
  /** Modi possibili di ripartire i punti tra i reparti (es. [3, -1, -1]); se ne estrae uno a partita. */
  forme: number[][];
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
  /** Frase per la TV che spiega l'effetto reale sull'azienda (D-033). */
  spiegazione: string;
  /** Secondo schema possibile, con la sua spiegazione, estratto a ogni partita (D-045). */
  alternativa?: { schema: string; spiegazione: string };
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

/** Soglia di un traguardo: un numero, oppure un valore che dipende dalla partita. */
export type SogliaObiettivo = number | "META_ALTRI" | "TUTTI_ALTRI" | "TUTTI_I_TRIMESTRI";

export interface ModelloTraguardo {
  /** Testo per il telefono e la TV; {soglia} e {parametro} si sostituiscono con i valori. */
  testo: string;
  /** Cosa conta il computer (elenco in misure.ts). */
  misura: string;
  soglia: SogliaObiettivo;
  parametro?: number;
}

export interface ModelloObiettivo {
  id: string;
  nome: string;
  /** 1 graduale, 2 e 3 doppi (D-046). */
  tipo: number;
  /** Aiuta l'azienda: le spie ricevono solo questi (D-049). */
  aziendalista: boolean;
  /** Traguardo facile e difficile. */
  traguardi: [ModelloTraguardo, ModelloTraguardo];
}

export interface Ambiente {
  config: Configurazione;
  mazzo: ModelloProposta[];
  schemi: Record<string, Schema>;
  frasi: Frasi;
  segreti: ModelloSegreto[];
  obiettivi: ModelloObiettivo[];
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
    if (!FAMIGLIE.includes(s.famiglia)) problemi.push(`${dove}: famiglia "${s.famiglia}" sconosciuta (D-077)`);
    if (!Number.isInteger(s.effettoAzienda)) problemi.push(`${dove}: l'effetto sull'azienda deve essere un numero intero`);
    if (!s.forme || s.forme.length === 0) problemi.push(`${dove}: serve almeno una forma`);
    const valore = config.proposte.valorePerCosto[String(s.costo)];
    if (!valore) problemi.push(`${dove}: costo ${s.costo} non previsto in proposte.costi`);
    for (const [k, forma] of (s.forme ?? []).entries()) {
      const qui = `${dove}, forma ${k + 1}`;
      if (forma.length === 0) problemi.push(`${qui}: servono dei ruoli`);
      if (forma.length > config.giocatori.minimo) problemi.push(`${qui}: più ruoli (${forma.length}) del minimo di giocatori`);
      if (forma.some((p) => !Number.isInteger(p) || p === 0)) problemi.push(`${qui}: ogni ruolo deve avere punti interi diversi da zero`);
      // Valore proporzionale al costo (D-070): totale dei bonus e dei malus fissato per costo.
      if (valore) {
        const bonus = forma.filter((p) => p > 0).reduce((t, p) => t + p, 0);
        const malus = -forma.filter((p) => p < 0).reduce((t, p) => t + p, 0);
        if (bonus !== valore.bonus || malus !== valore.malus) problemi.push(`${qui}: bonus ${bonus} e malus ${malus}, per il costo ${s.costo} servono ${valore.bonus} e ${valore.malus} (D-070)`);
      }
    }
  }
  // Per ogni costo le famiglie devono avere effetti diversi (altrimenti non si distinguono, D-077).
  for (const costo of config.proposte.costi) {
    const delCosto = Object.values(schemi).filter((s) => s.costo === costo);
    if (new Set(delCosto.map((s) => s.famiglia)).size !== delCosto.length) problemi.push(`Schemi da ${costo}: una famiglia ripetuta`);
    if (new Set(delCosto.map((s) => s.effettoAzienda)).size !== delCosto.length) problemi.push(`Schemi da ${costo}: due famiglie con lo stesso effetto sull'azienda`);
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
    else if (schemi[m.schema]!.costo !== m.costo) problemi.push(`${dove}: lo schema "${m.schema}" è per il costo ${schemi[m.schema]!.costo}, il quesito costa ${m.costo}`);
    if (!config.proposte.costi.includes(m.costo)) problemi.push(`${dove}: costo ${m.costo} non previsto in proposte.costi`);
    if (m.alternativa) {
      const alt = schemi[m.alternativa.schema];
      if (!alt) problemi.push(`${dove}: schema alternativo "${m.alternativa.schema}" inesistente`);
      else if (alt.costo !== m.costo) problemi.push(`${dove}: lo schema alternativo è per un altro costo`);
      else if (schemi[m.schema] && alt.famiglia === schemi[m.schema]!.famiglia) {
        problemi.push(`${dove}: lo schema alternativo deve essere di un'altra famiglia (D-045, D-077)`);
      }
      if (!m.alternativa.spiegazione) problemi.push(`${dove}: manca la spiegazione dello schema alternativo`);
    }
    if (m.trimestri.length === 0 || m.trimestri.some((t) => !Number.isInteger(t) || t < 1 || t > config.trimestri)) {
      problemi.push(`${dove}: trimestri non validi`);
    }
    for (const r of Object.keys(m.testi ?? {})) if (!repartiValidi.has(r)) problemi.push(`${dove}: testi per il reparto sconosciuto "${r}"`);
  }
  // Ogni trimestre serve almeno un quesito per costo (D-068).
  for (let t = 1; t <= config.trimestri; t++) {
    for (const costo of config.proposte.costi) {
      if (!mazzo.some((m) => m.costo === costo && m.trimestri.includes(t))) problemi.push(`Mazzo: nessun quesito da ${costo} per il trimestre ${t}`);
    }
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

/** Massimo numero di spie in una partita (GDD §4.2: fino a 2 con 8 giocatori). */
const MASSIMO_SPIE = 2;

export function controllaObiettivi(obiettivi: ModelloObiettivo[], config: Configurazione, misureNote: Set<string>): string[] {
  const problemi: string[] = [];
  const visti = new Set<string>();
  const tipi = Object.keys(config.obiettivi.punti).map(Number);
  for (const o of obiettivi) {
    const dove = `Obiettivo "${o.id}"`;
    if (visti.has(o.id)) problemi.push(`${dove}: identificativo ripetuto`);
    visti.add(o.id);
    if (!o.nome) problemi.push(`${dove}: manca il nome`);
    if (!tipi.includes(o.tipo)) problemi.push(`${dove}: tipo ${o.tipo} senza punti in config.json`);
    if (o.traguardi?.length !== 2) {
      problemi.push(`${dove}: servono due traguardi (facile e difficile, D-046)`);
      continue;
    }
    for (const t of o.traguardi) {
      if (!t.testo) problemi.push(`${dove}: manca il testo di un traguardo`);
      if (!misureNote.has(t.misura)) problemi.push(`${dove}: misura "${t.misura}" sconosciuta`);
      const simbolica = ["META_ALTRI", "TUTTI_ALTRI", "TUTTI_I_TRIMESTRI"].includes(t.soglia as string);
      if (!simbolica && !(typeof t.soglia === "number" && t.soglia >= 1)) problemi.push(`${dove}: soglia non valida`);
      if (t.testo.includes("{parametro}") && t.parametro === undefined) problemi.push(`${dove}: manca il parametro del traguardo`);
    }
    // Tipo 1 graduale: stesso tema, il secondo gradino più alto del primo (D-046).
    if (o.tipo === 1) {
      const [a, b] = o.traguardi;
      if (a.misura !== b.misura) problemi.push(`${dove}: nel tipo 1 i due gradini devono avere la stessa misura`);
      if (typeof a.soglia === "number" && typeof b.soglia === "number" && b.soglia <= a.soglia) problemi.push(`${dove}: il secondo gradino deve essere più alto del primo`);
    }
  }
  // Nessuna ripetizione nella stessa partita (D-048): servono abbastanza obiettivi per tipo, e
  // abbastanza aziendalisti per le spie (D-049).
  for (const tipo of tipi) {
    const delTipo = obiettivi.filter((o) => o.tipo === tipo);
    if (delTipo.length < config.giocatori.massimo) problemi.push(`Obiettivi di tipo ${tipo}: ne servono almeno ${config.giocatori.massimo}, ce ne sono ${delTipo.length}`);
    if (delTipo.filter((o) => o.aziendalista).length < MASSIMO_SPIE) problemi.push(`Obiettivi di tipo ${tipo}: servono almeno ${MASSIMO_SPIE} aziendalisti`);
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
  const obiettivi = datiObiettivi.obiettivi as ModelloObiettivo[];
  const problemi = [
    ...controllaContenuti(mazzo, schemi, frasi, config),
    ...controllaSegreti(segreti, config),
    ...controllaObiettivi(obiettivi, config, MISURE_NOTE),
  ];
  if (problemi.length > 0) throw new Error("Contenuti non validi:\n- " + problemi.join("\n- "));
  return { config, mazzo, schemi, frasi, segreti, obiettivi };
}
