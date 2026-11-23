/**
 * Parametri del server, letti dalla sezione "server" di packages/content/config.json
 * (regola 4: nessun numero scritto nel codice). D-066, D-080.
 */
import datiConfig from "@il-direttivo/content/config.json" with { type: "json" };
import type { Fase } from "@il-direttivo/engine";

export type NomeFase = Fase["nome"];

export interface ConfigServer {
  porta: number;
  /** Secondi di ogni fase; null = solo con "Avanti". SCELTA_OBIETTIVI usa obiettivi.secondiPerLaScelta. */
  secondiPerFase: Partial<Record<NomeFase, number | null>>;
  secondiChiusuraAnticipata: number;
  secondiRitardoBot: [number, number];
  oreScadenzaStanza: number;
  lunghezzaCodice: number;
  caratteriNome: number;
}

const FASI_CON_TEMPO: NomeFase[] = [
  "RAPPORTO", "DISCUSSIONE", "VOTO_PACCHETTO", "SECONDO_VOTO", "MOSSA_PRIVATA", "RISOLUZIONE",
  "DOMANDA", "NOMINA", "BALLOTTAGGIO", "PUNTEGGIO", "LETTURA_MESSAGGI", "FINE",
];

export function controllaConfigServer(c: ConfigServer): string[] {
  const problemi: string[] = [];
  if (!Number.isInteger(c?.porta) || c.porta <= 0) problemi.push("server.porta deve essere un numero intero positivo");
  for (const f of FASI_CON_TEMPO) {
    const v = c?.secondiPerFase?.[f];
    if (v !== null && !(typeof v === "number" && v > 0)) problemi.push(`server.secondiPerFase.${f}: serve un numero positivo oppure null`);
  }
  if (!(c?.secondiChiusuraAnticipata >= 0)) problemi.push("server.secondiChiusuraAnticipata non può essere negativo");
  const [min, max] = c?.secondiRitardoBot ?? [];
  if (!(typeof min === "number" && typeof max === "number" && min >= 0 && max >= min)) problemi.push("server.secondiRitardoBot: servono due numeri [minimo, massimo]");
  if (!(c?.oreScadenzaStanza > 0)) problemi.push("server.oreScadenzaStanza deve essere positivo");
  if (!(Number.isInteger(c?.lunghezzaCodice) && c.lunghezzaCodice >= 4)) problemi.push("server.lunghezzaCodice: almeno 4");
  if (!(Number.isInteger(c?.caratteriNome) && c.caratteriNome > 0)) problemi.push("server.caratteriNome deve essere positivo");
  return problemi;
}

export function caricaConfigServer(): ConfigServer {
  const c = (datiConfig as unknown as { server: ConfigServer }).server;
  const problemi = controllaConfigServer(c);
  if (problemi.length > 0) throw new Error("config.json, sezione server, non valida:\n- " + problemi.join("\n- "));
  return c;
}

/** Orologio del server: vero in partita, finto nei test (si fa avanzare il tempo a mano). */
export interface Orologio {
  ora(): number;
  /** Esegue la funzione dopo tot millisecondi; restituisce la funzione che annulla. */
  programma(ms: number, fn: () => void): () => void;
}

export const orologioVero: Orologio = {
  ora: () => Date.now(),
  programma(ms, fn) {
    const t = setTimeout(fn, ms);
    return () => clearTimeout(t);
  },
};
