/**
 * Le carte della partita e l'algoritmo di equità (GDD §8.6 · D-068, D-069, D-070, D-045).
 *
 * A inizio partita si preparano TUTTE le carte: per ogni trimestre un quesito per costo (30 / 50 / 80),
 * con la sua versione (principale o alternativa, D-045), preferendo categorie diverse nello stesso
 * trimestre. Poi i ruoli di ogni schema (es. +3, −1, −1) si assegnano ai reparti occupati in modo che:
 *
 * 1. ogni reparto riceva, sulla somma di tutte le carte, lo STESSO totale di bonus e lo STESSO totale
 *    di malus (differenza massima "tolleranzaEquita", di solito 1 punto, quando la parità esatta è
 *    impossibile per aritmetica);
 * 2. nello stesso trimestre nessun reparto abbia un bonus sia nella carta più cara sia in una delle
 *    altre: il pacchetto mette reparti diversi uno contro l'altro ("reparti smistati");
 * 3. in una stessa carta un reparto abbia al massimo un ruolo; i vacanti non ricevono ruoli (D-006).
 *
 * Metodo: tentativi ripetuti (con il generatore casuale della partita, quindi riproducibili) di
 * un'assegnazione "golosa" su tutta la partita (i ruoli più grandi per primi, ognuno al reparto col
 * totale più basso di quel segno), seguita da ritocchi (spostamenti e scambi tra il reparto più carico
 * e il più scarico). Si tiene la migliore; ci si ferma appena è dentro la tolleranza senza violazioni.
 */
import type { Ambiente, ModelloProposta, Schema } from "./contenuti.js";
import type { Casuale } from "./rng.js";
import type { PropostaIstanza, RepartoId } from "./tipi.js";

/** Una carta scelta, prima dell'assegnazione dei ruoli. */
interface CartaScelta {
  trimestre: number;
  modello: ModelloProposta;
  schema: Schema;
  spiegazione: string;
}

/** Risultato dell'assegnazione: per ogni carta, i punti di ogni reparto coinvolto. */
type Assegnazione = Map<RepartoId, number>[];

export interface EsitoEquita {
  carte: PropostaIstanza[][];
  /** Differenza massima tra reparti nei totali di bonus e di malus (per i test e il report). */
  scarto: number;
  /** Trimestri in cui un reparto ha un bonus su entrambi i lati del pacchetto (dovrebbe essere 0). */
  violazioni: number;
}

/** Quanti reparti ricevono un bonus da uno schema. */
const repartiConBonus = (schema: Schema) => schema.ruoli.filter((r) => r.punti > 0).length;

/**
 * Sceglie le carte di tutta la partita (senza ruoli). In ogni trimestre la combinazione deve permettere
 * i reparti smistati: i reparti con bonus nella carta più cara più quelli necessari alle altre non
 * possono superare i reparti occupati (con 4 giocatori certe combinazioni sono impossibili).
 */
function scegliCarte(ambiente: Ambiente, casuale: Casuale, numeroReparti: number): CartaScelta[] {
  const { config, mazzo, schemi } = ambiente;
  const costoMassimo = Math.max(...config.proposte.costi);
  const usati = new Set<string>();
  const carte: CartaScelta[] = [];
  for (let t = 1; t <= config.trimestri; t++) {
    let scelte: CartaScelta[] = [];
    for (let prova = 0; prova < 50; prova++) {
      scelte = [];
      const categorie: string[] = [];
      for (const costo of config.proposte.costi) {
        const presi = new Set([...usati, ...scelte.map((c) => c.modello.id)]);
        let candidati = mazzo.filter((m) => m.costo === costo && m.trimestri.includes(t) && !presi.has(m.id));
        if (candidati.length === 0) candidati = mazzo.filter((m) => m.costo === costo && m.trimestri.includes(t));
        const fattori = candidati.map((m) => (categorie.includes(m.categoria) ? config.selezione.fattoreStessaCategoria : 1));
        const modello = casuale.scegliPesato(candidati, fattori);
        categorie.push(modello.categoria);
        const alternativa = modello.alternativa && casuale.probabilita(config.selezione.probabilitaAlternativa) ? modello.alternativa : undefined;
        scelte.push({ trimestre: t, modello, schema: schemi[alternativa?.schema ?? modello.schema]!, spiegazione: alternativa?.spiegazione ?? modello.spiegazione });
      }
      const caro = Math.max(0, ...scelte.filter((c) => c.modello.costo === costoMassimo).map((c) => repartiConBonus(c.schema)));
      const altri = Math.max(0, ...scelte.filter((c) => c.modello.costo !== costoMassimo).map((c) => repartiConBonus(c.schema)));
      if (caro + altri <= numeroReparti) break;
    }
    for (const c of scelte) usati.add(c.modello.id);
    carte.push(...scelte);
  }
  return carte;
}

/** Reparti con un bonus su ciascun lato del pacchetto, in un trimestre. */
function violazioniTrimestre(carte: CartaScelta[], assegnazione: Assegnazione, trimestre: number, costoMassimo: number): number {
  const caro = new Set<RepartoId>();
  const altri = new Set<RepartoId>();
  carte.forEach((c, i) => {
    if (c.trimestre !== trimestre) return;
    for (const [r, p] of assegnazione[i]!) if (p > 0) (c.modello.costo === costoMassimo ? caro : altri).add(r);
  });
  return [...caro].filter((r) => altri.has(r)).length;
}

/**
 * Un tentativo: i ruoli di TUTTA la partita, dal più grande al più piccolo, vanno ciascuno al reparto
 * che finora ha il totale più basso di quel segno (come riempire dei bicchieri partendo dai sassi più
 * grossi), rispettando "un ruolo per carta" e i reparti smistati.
 */
function tentativo(carte: CartaScelta[], reparti: RepartoId[], costoMassimo: number, casuale: Casuale): Assegnazione {
  const bonus = new Map<RepartoId, number>(reparti.map((r) => [r, 0]));
  const malus = new Map<RepartoId, number>(reparti.map((r) => [r, 0]));
  const assegnazione: Assegnazione = carte.map(() => new Map());
  const latoCaro = new Map<number, Set<RepartoId>>();
  const latoAltri = new Map<number, Set<RepartoId>>();
  const lato = (m: Map<number, Set<RepartoId>>, t: number) => m.get(t) ?? m.set(t, new Set()).get(t)!;
  const ruoli = casuale
    .mescola(carte.flatMap((c, i) => c.schema.ruoli.map((r) => ({ i, punti: r.punti }))))
    .sort((a, b) => Math.abs(b.punti) - Math.abs(a.punti));
  for (const { i, punti } of ruoli) {
    const c = carte[i]!;
    const caro = c.modello.costo === costoMassimo;
    const totale = punti > 0 ? bonus : malus;
    const liberi = reparti.filter((r) => !assegnazione[i]!.has(r));
    const opposto = lato(caro ? latoAltri : latoCaro, c.trimestre);
    const ammessi = punti > 0 && liberi.some((r) => !opposto.has(r)) ? liberi.filter((r) => !opposto.has(r)) : liberi;
    const minimo = Math.min(...ammessi.map((r) => totale.get(r)!));
    const scelto = casuale.scegli(ammessi.filter((r) => totale.get(r) === minimo));
    assegnazione[i]!.set(scelto, punti);
    totale.set(scelto, totale.get(scelto)! + Math.abs(punti));
    if (punti > 0) lato(caro ? latoCaro : latoAltri, c.trimestre).add(scelto);
  }
  return assegnazione;
}

/**
 * Ritocchi ("scalata"): tra tutti gli spostamenti di un ruolo a un reparto libero in quella carta e
 * tutti gli scambi di ruoli tra due reparti nella stessa carta, si applica quello che avvicina di più
 * i totali di ogni reparto alla media (somma dei quadrati degli scarti), purché non crei reparti "non
 * smistati"; se nessun passo migliora se ne fa uno "alla pari" a caso (per uscire dai vicoli ciechi).
 * Modifica l'assegnazione ricevuta.
 */
function migliora(carte: CartaScelta[], assegnazione: Assegnazione, reparti: RepartoId[], costoMassimo: number, tolleranza: number, casuale: Casuale): void {
  const bonus = new Map<RepartoId, number>(reparti.map((r) => [r, 0]));
  const malus = new Map<RepartoId, number>(reparti.map((r) => [r, 0]));
  const aggiungi = (r: RepartoId, punti: number, verso: 1 | -1) => {
    const m = punti > 0 ? bonus : malus;
    m.set(r, m.get(r)! + verso * Math.abs(punti));
  };
  assegnazione.forEach((m) => {
    for (const [r, p] of m) aggiungi(r, p, 1);
  });
  const quadrati = () => {
    const somma = (m: Map<RepartoId, number>) => {
      const media = [...m.values()].reduce((a, b) => a + b, 0) / reparti.length;
      return [...m.values()].reduce((a, x) => a + (x - media) ** 2, 0);
    };
    return somma(bonus) + somma(malus);
  };
  const scarto = () => Math.max(...[bonus, malus].map((m) => Math.max(...m.values()) - Math.min(...m.values())));

  for (let giri = 0; giri < 200 && scarto() > tolleranza; giri++) {
    const attuale = quadrati();
    let migliore: { valore: number; applica: () => void } | undefined;
    const pari: (() => void)[] = [];
    carte.forEach((c, i) => {
      const m = assegnazione[i]!;
      const violazioniPrima = violazioniTrimestre(carte, assegnazione, c.trimestre, costoMassimo);
      for (const [d1, p1] of [...m]) {
        for (const d2 of reparti) {
          if (d2 === d1) continue;
          const p2 = m.get(d2);
          if (p2 === p1) continue;
          // Modifica di prova: d1 prende p2 (o niente), d2 prende p1.
          const fai = () => {
            aggiungi(d1, p1, -1);
            aggiungi(d2, p1, 1);
            if (p2 !== undefined) {
              aggiungi(d2, p2, -1);
              aggiungi(d1, p2, 1);
              m.set(d1, p2);
            } else m.delete(d1);
            m.set(d2, p1);
          };
          const annulla = () => {
            aggiungi(d2, p1, -1);
            aggiungi(d1, p1, 1);
            if (p2 !== undefined) {
              aggiungi(d1, p2, -1);
              aggiungi(d2, p2, 1);
              m.set(d2, p2);
            } else m.delete(d2);
            m.set(d1, p1);
          };
          fai();
          const valore = quadrati();
          const ammessa = violazioniTrimestre(carte, assegnazione, c.trimestre, costoMassimo) <= violazioniPrima;
          annulla();
          if (ammessa && valore < attuale - 1e-9 && (!migliore || valore < migliore.valore)) migliore = { valore, applica: fai };
          if (ammessa && Math.abs(valore - attuale) < 1e-9) pari.push(fai);
        }
      }
    });
    // Nessun passo che migliora: un passo "alla pari" a caso, per uscire dai vicoli ciechi.
    if (migliore) migliore.applica();
    else if (pari.length > 0) casuale.scegli(pari)();
    else return;
  }
}

/** Scarto massimo tra reparti nei totali di bonus e di malus, e trimestri con reparti non smistati. */
export function valutaAssegnazione(
  carte: { trimestre: number; costo: number }[],
  assegnazione: Assegnazione,
  reparti: RepartoId[],
  costoMassimo: number,
): { scarto: number; violazioni: number } {
  const bonus = new Map<RepartoId, number>(reparti.map((r) => [r, 0]));
  const malus = new Map<RepartoId, number>(reparti.map((r) => [r, 0]));
  assegnazione.forEach((m) => {
    for (const [r, p] of m) (p > 0 ? bonus : malus).set(r, (p > 0 ? bonus : malus).get(r)! + Math.abs(p));
  });
  const scartoDi = (m: Map<RepartoId, number>) => Math.max(...m.values()) - Math.min(...m.values());
  let violazioni = 0;
  for (const t of new Set(carte.map((c) => c.trimestre))) {
    const caro = new Set<RepartoId>();
    const altri = new Set<RepartoId>();
    carte.forEach((c, i) => {
      if (c.trimestre !== t) return;
      for (const [r, p] of assegnazione[i]!) if (p > 0) (c.costo === costoMassimo ? caro : altri).add(r);
    });
    if ([...caro].some((r) => altri.has(r))) violazioni++;
  }
  return { scarto: Math.max(scartoDi(bonus), scartoDi(malus)), violazioni };
}

/** Quante serie di carte si provano al massimo prima di tenere la migliore trovata. */
const SERIE_DI_CARTE = 10;

/** Prepara le carte di tutta la partita per i reparti occupati (D-069). */
export function preparaCarte(reparti: RepartoId[], ambiente: Ambiente, casuale: Casuale): EsitoEquita {
  const { config, frasi } = ambiente;
  const costoMassimo = Math.max(...config.proposte.costi);
  const riuscita = (x: { scarto: number; violazioni: number }) => x.violazioni === 0 && x.scarto <= config.proposte.tolleranzaEquita;

  // Alcune serie di carte non si lasciano equilibrare: dopo un certo numero di tentativi se ne estrae un'altra.
  let migliore: { scelte: CartaScelta[]; assegnazione: Assegnazione; scarto: number; violazioni: number } | undefined;
  for (let serie = 0; serie < SERIE_DI_CARTE && !(migliore && riuscita(migliore)); serie++) {
    const scelte = scegliCarte(ambiente, casuale, reparti.length);
    const descrizione = scelte.map((c) => ({ trimestre: c.trimestre, costo: c.modello.costo }));
    for (let k = 0; k < config.proposte.tentativiEquita; k++) {
      const assegnazione = tentativo(scelte, reparti, costoMassimo, casuale);
      migliora(scelte, assegnazione, reparti, costoMassimo, config.proposte.tolleranzaEquita, casuale);
      const { scarto, violazioni } = valutaAssegnazione(descrizione, assegnazione, reparti, costoMassimo);
      if (!migliore || violazioni < migliore.violazioni || (violazioni === migliore.violazioni && scarto < migliore.scarto)) {
        migliore = { scelte, assegnazione, scarto, violazioni };
      }
      if (riuscita(migliore)) break;
    }
  }
  const scelte = migliore!.scelte;

  const carte: PropostaIstanza[][] = Array.from({ length: config.trimestri }, () => []);
  scelte.forEach((c, i) => {
    const ruoli = migliore!.assegnazione[i]!;
    const effettiPrivati: PropostaIstanza["effettiPrivati"] = {};
    for (const r of reparti) {
      const punti = ruoli.get(r);
      if (punti === undefined) {
        effettiPrivati[r] = { punti: 0, testo: frasi.neutro };
        continue;
      }
      const segno = punti > 0 ? "positivo" : "negativo";
      effettiPrivati[r] = { punti, testo: c.modello.testi?.[r]?.[segno] ?? casuale.scegli(frasi.reparti[r][segno]) };
    }
    carte[c.trimestre - 1]!.push({
      id: `T${c.trimestre}-${c.modello.costo}-${c.modello.id}`,
      modelloId: c.modello.id,
      titolo: c.modello.titolo,
      categoria: c.modello.categoria,
      costo: c.modello.costo,
      trimestre: c.trimestre,
      spiegazione: c.spiegazione,
      effettiPrivati,
      effettoAzienda: c.schema.effettoAzienda,
    });
  });
  return { carte, scarto: migliore!.scarto, violazioni: migliore!.violazioni };
}
