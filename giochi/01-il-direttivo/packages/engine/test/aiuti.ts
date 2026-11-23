/**
 * Aiuti comuni ai test.
 * Dal D-048 una partita comincia con la scelta degli obiettivi personali: per i test che
 * riguardano il trimestre si crea la partita e si chiude subito la scelta (obiettivi a caso).
 */
import type { Ambiente } from "../src/contenuti.js";
import { applica } from "../src/motore.js";
import { creaPartita, type EsitoCreazione, type NuovoGiocatore } from "../src/partita.js";

export function creaEAvvia(partecipanti: NuovoGiocatore[], seme: number, ambiente: Ambiente): EsitoCreazione {
  const esito = creaPartita(partecipanti, seme, ambiente);
  if (!esito.ok) return esito;
  const avvio = applica(esito.partita, { tipo: "AVANZA_FASE" }, ambiente);
  if (!avvio.ok) return { ok: false, errore: avvio.errore };
  return { ok: true, partita: avvio.partita, eventi: avvio.eventi };
}
