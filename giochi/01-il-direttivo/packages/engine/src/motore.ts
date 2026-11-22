/**
 * Funzione centrale del motore: applica(partita, azione) → nuova partita + eventi.
 *
 * - Pura: non modifica la partita ricevuta, non usa rete, orologio o Math.random().
 * - Un'azione non valida non lancia errori: restituisce { ok: false, errore } e la partita resta com'è.
 */
import type { Azione, Esito, Evento } from "./azioni.js";
import type { Ambiente } from "./contenuti.js";
import { descriviFase, entraNellaFase, faseSuccessiva } from "./fasi.js";
import type { Partita } from "./tipi.js";
import { registraMossa } from "./risoluzione.js";
import { chiudiVotazione, registraVoto } from "./votazioni.js";

export function applica(partita: Partita, azione: Azione, ambiente: Ambiente): Esito {
  switch (azione.tipo) {
    case "AVANZA_FASE":
      return avanzaFase(partita, ambiente);
    case "VOTA":
      return registraVoto(partita, azione);
    case "MOSSA_PRIVATA":
      return registraMossa(partita, azione);
    default:
      return { ok: false, errore: `Azione "${azione.tipo}" non ancora gestita dal motore` };
  }
}

function avanzaFase(partita: Partita, ambiente: Ambiente): Esito {
  const prossima = faseSuccessiva(partita, ambiente.config);
  if (!prossima) return { ok: false, errore: "La partita è finita" };

  const nuova = structuredClone(partita);
  const eventi: Evento[] = [];

  // Uscendo da una votazione si chiude il conteggio (chi non ha votato vale "no", D-007).
  if (nuova.fase.nome === "VOTAZIONE") eventi.push(...chiudiVotazione(nuova, ambiente));

  nuova.fase = prossima.fase;
  nuova.trimestre = prossima.trimestre;
  eventi.push({
    tipo: "FASE_INIZIATA",
    fase: nuova.fase,
    trimestre: nuova.trimestre,
    causa: descriviFase(nuova.fase, nuova.trimestre),
  });
  eventi.push(...entraNellaFase(nuova, ambiente));

  return { ok: true, partita: nuova, eventi };
}
