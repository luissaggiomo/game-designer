/**
 * Chi deve ancora agire nella fase in corso (D-066: la fase si chiude appena tutti hanno agito).
 * Lo usa il server per la chiusura anticipata. Restituisce null nelle fasi senza un'azione
 * richiesta a tutti (Rapporto, Discussione, Risultati, Punteggio…): quelle durano il loro tempo.
 */
import { votantiBallottaggio } from "./finale.js";
import type { GiocatoreId, Partita } from "./tipi.js";

export function inAttesaDi(p: Partita): GiocatoreId[] | null {
  const attivi = p.giocatori.filter((g) => g.stato === "ATTIVO").map((g) => g.id);
  const mancano = (fatto: (id: GiocatoreId) => boolean) => attivi.filter((id) => !fatto(id));
  switch (p.fase.nome) {
    case "SCELTA_OBIETTIVI":
      return mancano((id) => p.obiettivi[id]?.scelto !== undefined);
    case "VOTO_PACCHETTO":
      return mancano((id) => p.votoTrimestre?.voti[id] !== undefined);
    case "SECONDO_VOTO":
      return mancano((id) => p.votoTrimestre?.secondiVoti[id] !== undefined);
    case "MOSSA_PRIVATA":
      return mancano((id) => p.mossePrivate[id] !== undefined);
    case "DOMANDA":
      return mancano((id) => p.finale.risposte[id] !== undefined);
    case "NOMINA":
      return mancano((id) => p.finale.nomine[id] !== undefined);
    case "BALLOTTAGGIO": {
      const b = p.finale.ballottaggio;
      return b ? votantiBallottaggio(p, b).filter((id) => p.finale.nomine[id] === undefined) : null;
    }
    default:
      return null;
  }
}
