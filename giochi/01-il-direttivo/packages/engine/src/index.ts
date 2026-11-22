// Punto d'ingresso del motore di gioco.
export { creaCasuale, type Casuale } from "./rng.js";
export { caricaConfigurazione, controllaConfigurazione, type Configurazione } from "./config.js";
export {
  caricaAmbiente,
  controllaContenuti,
  type Ambiente,
  type ModelloProposta,
  type TabellaPesi,
  type ModelloSegreto,
} from "./contenuti.js";
export type * from "./tipi.js";
export type { Azione, AzioneGiocatore, AzioneSistema, Esito, Evento } from "./azioni.js";
export { creaPartita, type NuovoGiocatore, type EsitoCreazione } from "./partita.js";
export { applica } from "./motore.js";
export { faseSuccessiva, descriviFase } from "./fasi.js";
export { calcolaEsito, propostaInVotazione } from "./votazioni.js";
export {
  vista,
  vistaTV,
  vistaGiocatore,
  eventiPer,
  type Destinatario,
  type VistaTV,
  type VistaGiocatore,
} from "./viste.js";
