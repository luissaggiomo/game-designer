/**
 * Obiettivi personali (GDD §4.4, §16 · D-046…D-052).
 *
 * - Assegnazione: a inizio partita ognuno riceve tre obiettivi, uno per tipo; le spie solo
 *   aziendalisti (D-049); nessun obiettivo ripetuto nella stessa partita (D-048).
 * - Scelta: nella fase SCELTA_OBIETTIVI, prima del primo trimestre; chi non sceglie in tempo
 *   riceve uno dei suoi tre a caso (D-048).
 * - Verifica: ogni traguardo ha una misura (misure.ts). Durante la partita il telefono mostra
 *   l'avanzamento con le sole informazioni che il giocatore può sapere; al punteggio si verifica
 *   tutto (D-047, D-052 R1).
 */
import type { AzioneGiocatore, Esito, Evento } from "./azioni.js";
import type { Ambiente, ModelloObiettivo, ModelloTraguardo, SogliaObiettivo } from "./contenuti.js";
import { MISURE, type Conoscenza } from "./misure.js";
import type { Casuale } from "./rng.js";
import { creaCasuale } from "./rng.js";
import type { Giocatore, GiocatoreId, Partita } from "./tipi.js";

/** Estrae le terne di obiettivi (uno per tipo) per tutti i giocatori. Modifica la partita ricevuta. */
export function assegnaObiettivi(partita: Partita, ambiente: Ambiente, casuale: Casuale): void {
  const tipi = Object.keys(ambiente.config.obiettivi.punti).map(Number).sort((a, b) => a - b);
  // Prima le spie (solo aziendalisti), poi gli onesti (tutto il mazzo), così non mancano mai aziendalisti.
  const ordine = [...partita.giocatori].sort((a, b) => Number(b.fazione.tipo === "SPIA") - Number(a.fazione.tipo === "SPIA"));
  const proposti = new Map<GiocatoreId, string[]>(partita.giocatori.map((g) => [g.id, []]));
  for (const tipo of tipi) {
    let liberi = casuale.mescola(ambiente.obiettivi.filter((o) => o.tipo === tipo));
    for (const g of ordine) {
      const adatto = (o: ModelloObiettivo) => g.fazione.tipo !== "SPIA" || o.aziendalista;
      const scelto = liberi.find(adatto);
      if (!scelto) throw new Error(`Obiettivi di tipo ${tipo} insufficienti`); // impedito dal controllo dei contenuti
      liberi = liberi.filter((o) => o !== scelto);
      proposti.get(g.id)!.push(scelto.id);
    }
  }
  partita.obiettivi = Object.fromEntries([...proposti].map(([id, elenco]) => [id, { proposti: elenco }]));
}

export function scegliObiettivo(partita: Partita, azione: Extract<AzioneGiocatore, { tipo: "SCEGLI_OBIETTIVO" }>): Esito {
  if (partita.fase.nome !== "SCELTA_OBIETTIVI") return { ok: false, errore: "L'obiettivo si sceglie solo prima della partita" };
  const g = partita.giocatori.find((x) => x.id === azione.da);
  if (!g) return { ok: false, errore: "Giocatore sconosciuto" };
  if (!partita.obiettivi[g.id]?.proposti.includes(azione.obiettivo)) return { ok: false, errore: "Puoi scegliere solo uno dei tuoi tre obiettivi" };
  const nuova = structuredClone(partita);
  // Si può cambiare idea fino alla chiusura: vale l'ultima scelta.
  nuova.obiettivi[g.id]!.scelto = azione.obiettivo;
  return { ok: true, partita: nuova, eventi: [{ tipo: "OBIETTIVO_REGISTRATO", da: g.id, causa: `${g.nome} ha scelto il suo obiettivo` }] };
}

/** Chiude la scelta: chi non ha scelto riceve uno dei suoi tre a caso (D-048). Modifica la copia ricevuta. */
export function chiudiSceltaObiettivi(partita: Partita, ambiente: Ambiente): Evento[] {
  const casuale = creaCasuale(partita.statoCasuale);
  const eventi: Evento[] = [];
  for (const g of partita.giocatori) {
    const o = partita.obiettivi[g.id];
    if (!o || o.scelto) continue;
    o.scelto = casuale.scegli(o.proposti);
    o.sceltoACaso = true;
    const nome = modello(ambiente, o.scelto).nome;
    eventi.push({ tipo: "OBIETTIVO_ASSEGNATO", causa: `Tempo scaduto: il tuo obiettivo, estratto a caso, è «${nome}»`, riservatoA: [g.id] });
  }
  partita.statoCasuale = casuale.stato();
  return eventi;
}

export function modello(ambiente: Ambiente, id: string): ModelloObiettivo {
  const o = ambiente.obiettivi.find((x) => x.id === id);
  if (!o) throw new Error(`Obiettivo sconosciuto: ${id}`);
  return o;
}

function valoreSoglia(soglia: SogliaObiettivo, partita: Partita, ambiente: Ambiente): number {
  const altri = partita.giocatori.length - 1;
  if (soglia === "META_ALTRI") return Math.ceil(altri / 2);
  if (soglia === "TUTTI_ALTRI") return altri;
  if (soglia === "TUTTI_I_TRIMESTRI") return ambiente.config.trimestri;
  return soglia;
}

export function testoTraguardo(t: ModelloTraguardo, partita: Partita, ambiente: Ambiente): string {
  return t.testo.replaceAll("{soglia}", String(valoreSoglia(t.soglia, partita, ambiente))).replaceAll("{parametro}", String(t.parametro ?? ""));
}

/**
 * Stato di un traguardo:
 * - RAGGIUNTO / NON_RAGGIUNTO: definitivo;
 * - IN_CORSO: durante la partita, con l'avanzamento (valore su soglia);
 * - A_FINE_PARTITA: dipende da informazioni nascoste, si verifica al punteggio (R1).
 */
export type StatoTraguardo = "RAGGIUNTO" | "NON_RAGGIUNTO" | "IN_CORSO" | "A_FINE_PARTITA";

export interface EsitoTraguardo {
  testo: string;
  punti: number;
  stato: StatoTraguardo;
  /** Avanzamento (assente se A_FINE_PARTITA). */
  valore?: number;
  soglia: number;
  /** Traguardo "mai…" / "nessun…" mancato (es. la cassa è scesa sotto il minimo). */
  violato?: boolean;
}

/** Valuta i due traguardi dell'obiettivo scelto da un giocatore. */
export function valutaObiettivo(partita: Partita, ambiente: Ambiente, id: GiocatoreId, conoscenza: Conoscenza): EsitoTraguardo[] {
  const sceltoId = partita.obiettivi[id]?.scelto;
  if (!sceltoId) return [];
  const o = modello(ambiente, sceltoId);
  const punti = ambiente.config.obiettivi.punti[String(o.tipo)]!;
  return o.traguardi.map((t, i) => {
    const misura = MISURE[t.misura]!;
    const soglia = valoreSoglia(t.soglia, partita, ambiente);
    const base = { testo: testoTraguardo(t, partita, ambiente), punti: punti[i]!, soglia };
    if (conoscenza === "GIOCATORE" && misura.rinviata) return { ...base, stato: "A_FINE_PARTITA" as const };
    const { valore, violato } = misura.calcola({
      p: partita,
      id,
      conoscenza,
      ...(t.parametro !== undefined ? { parametro: t.parametro } : {}),
      trimestri: ambiente.config.trimestri,
    });
    const raggiunto = valore >= soglia && !violato;
    let stato: StatoTraguardo;
    if (conoscenza === "COMPLETA") stato = raggiunto ? "RAGGIUNTO" : "NON_RAGGIUNTO";
    else if (violato) stato = "NON_RAGGIUNTO";
    else stato = raggiunto && !misura.soloAFine ? "RAGGIUNTO" : "IN_CORSO";
    return { ...base, stato, valore, ...(violato ? { violato: true } : {}) };
  });
}

/** Voci del punteggio finale per gli obiettivi (D-046: i traguardi si sommano). */
export function vociObiettivo(partita: Partita, ambiente: Ambiente, g: Giocatore): { testo: string; punti: number }[] {
  const sceltoId = partita.obiettivi[g.id]?.scelto;
  if (!sceltoId) return [];
  const nome = modello(ambiente, sceltoId).nome;
  return valutaObiettivo(partita, ambiente, g.id, "COMPLETA")
    .filter((t) => t.stato === "RAGGIUNTO")
    .map((t) => ({ testo: `Obiettivo «${nome}»: ${t.testo}`, punti: t.punti }));
}
