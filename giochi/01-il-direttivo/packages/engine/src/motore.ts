/**
 * Funzione centrale del motore: applica(partita, azione) → nuova partita + eventi.
 *
 * - Pura: non modifica la partita ricevuta, non usa rete, orologio o Math.random().
 * - Un'azione non valida non lancia errori: restituisce { ok: false, errore } e la partita resta com'è.
 */
import type { Azione, Esito } from "./azioni.js";
import type { Configurazione } from "./config.js";
import { descriviFase, entraNellaFase, faseSuccessiva } from "./fasi.js";
import type { Partita } from "./tipi.js";

export function applica(partita: Partita, azione: Azione, config: Configurazione): Esito {
  switch (azione.tipo) {
    case "AVANZA_FASE":
      return avanzaFase(partita, config);
    default:
      return { ok: false, errore: `Azione "${azione.tipo}" non ancora gestita dal motore` };
  }
}

function avanzaFase(partita: Partita, config: Configurazione): Esito {
  const prossima = faseSuccessiva(partita, config);
  if (!prossima) return { ok: false, errore: "La partita è finita" };

  const nuova = structuredClone(partita);
  nuova.fase = prossima.fase;
  nuova.trimestre = prossima.trimestre;
  entraNellaFase(nuova, config);

  return {
    ok: true,
    partita: nuova,
    eventi: [
      {
        tipo: "FASE_INIZIATA",
        fase: nuova.fase,
        trimestre: nuova.trimestre,
        causa: descriviFase(nuova.fase, nuova.trimestre),
      },
    ],
  };
}
