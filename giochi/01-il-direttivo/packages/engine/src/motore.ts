/**
 * Funzione centrale del motore: applica(partita, azione) → nuova partita + eventi.
 *
 * - Pura: non modifica la partita ricevuta, non usa rete, orologio o Math.random().
 * - Un'azione non valida non lancia errori: restituisce { ok: false, errore } e la partita resta com'è.
 */
import type { Azione, Esito, Evento } from "./azioni.js";
import type { Ambiente } from "./contenuti.js";
import { descriviFase, entraNellaFase, faseSuccessiva } from "./fasi.js";
import { chiudiNomina, chiudiVerifica, nominaSpia, rispondiVerifica } from "./finale.js";
import { chiudiVotoPersonale, proponiDemansionamento, proponiPromozione, votaPersonale } from "./personali.js";
import { registraMossa } from "./risoluzione.js";
import { inviaMessaggio, passaAlConcorrente } from "./segreti.js";
import type { Partita } from "./tipi.js";
import { chiudiVotazione, registraVoto } from "./votazioni.js";

export function applica(partita: Partita, azione: Azione, ambiente: Ambiente): Esito {
  switch (azione.tipo) {
    case "AVANZA_FASE":
      return avanzaFase(partita, ambiente);
    case "CHIUDI_VOTO_PERSONALE": {
      if (!partita.votoPersonale) return { ok: false, errore: "Non c'è nessuna votazione in corso" };
      const nuova = structuredClone(partita);
      return { ok: true, partita: nuova, eventi: chiudiVotoPersonale(nuova) };
    }
    case "VOTA":
      return registraVoto(partita, azione);
    case "MOSSA_PRIVATA":
      return registraMossa(partita, azione);
    case "INVIA_MESSAGGIO":
      return inviaMessaggio(partita, azione, ambiente);
    case "PASSA_AL_CONCORRENTE":
      return passaAlConcorrente(partita, azione);
    case "PROPONI_PROMOZIONE":
      return proponiPromozione(partita, azione);
    case "PROPONI_DEMANSIONAMENTO":
      return proponiDemansionamento(partita, azione, ambiente);
    case "VOTA_PROMOZIONE":
    case "VOTA_DEMANSIONAMENTO":
      return votaPersonale(partita, azione);
    case "VERIFICA_FINALE":
      return rispondiVerifica(partita, azione);
    case "NOMINA_SPIA":
      return nominaSpia(partita, azione);
  }
}

/** Chiude ciò che è in corso nella fase attuale (chi non ha agito vale la scelta predefinita). */
function chiudiFase(partita: Partita, ambiente: Ambiente): Evento[] {
  switch (partita.fase.nome) {
    case "VOTAZIONE":
      return chiudiVotazione(partita, ambiente);
    case "DEMANSIONAMENTO":
    case "PROMOZIONI_FINALI":
      return chiudiVotoPersonale(partita);
    case "VERIFICA":
      return chiudiVerifica(partita, ambiente);
    case "NOMINA":
      return chiudiNomina(partita);
    default:
      return [];
  }
}

function avanzaFase(partita: Partita, ambiente: Ambiente): Esito {
  if (partita.fase.nome === "FINE") return { ok: false, errore: "La partita è finita" };

  const nuova = structuredClone(partita);
  const eventi: Evento[] = chiudiFase(nuova, ambiente);

  const prossima = faseSuccessiva(nuova, ambiente.config);
  if (!prossima) return { ok: false, errore: "La partita è finita" };
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
