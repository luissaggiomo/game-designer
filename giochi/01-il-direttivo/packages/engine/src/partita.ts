/**
 * Creazione di una partita: assegnazione segreta di reparti, fazioni, concorrenti e delle tre
 * proposte di obiettivo personale (GDD §4, §5, §12 · Architettura §10.1 · D-046…D-049), poi la
 * scelta dell'obiettivo (D-048). Il primo trimestre comincia quando la scelta si chiude.
 *
 * L'ingresso nella stanza (lobby) e la spiegazione delle regole (tutorial) sono compiti
 * del server e della TV: il motore parte con i giocatori già presenti.
 */
import type { Evento } from "./azioni.js";
import type { Ambiente } from "./contenuti.js";
import type { Configurazione } from "./config.js";
import { descriviFase } from "./fasi.js";
import { assegnaObiettivi } from "./obiettivi.js";
import { creaCasuale, type Casuale } from "./rng.js";
import type { Concorrente, Fazione, Giocatore, GiocatoreId, Partita, Reparto } from "./tipi.js";

export interface NuovoGiocatore {
  id: GiocatoreId;
  nome: string;
}

export type EsitoCreazione = { ok: true; partita: Partita; eventi: Evento[] } | { ok: false; errore: string };

export function creaPartita(partecipanti: NuovoGiocatore[], seme: number, ambiente: Ambiente): EsitoCreazione {
  const { config } = ambiente;
  const n = partecipanti.length;
  if (n < config.giocatori.minimo || n > config.giocatori.massimo) {
    return { ok: false, errore: `Servono da ${config.giocatori.minimo} a ${config.giocatori.massimo} giocatori (sono ${n})` };
  }
  if (new Set(partecipanti.map((p) => p.id)).size !== n) {
    return { ok: false, errore: "Due giocatori hanno lo stesso identificativo" };
  }

  const casuale = creaCasuale(seme);

  // 1. Reparti: tutti esistono; i primi N (base + aggiuntivi in ordine) sono occupati, gli altri vacanti.
  const elencoReparti = [...config.reparti.base, ...config.reparti.aggiuntiviInOrdine];
  const repartiOccupati = elencoReparti.slice(0, n);

  // 2. Concorrenti: dipendono solo dal numero di giocatori (D-011).
  const numeroConcorrenti = n === 8 ? config.concorrenti.con8Giocatori : config.concorrenti.finoA7Giocatori;
  const concorrenti: Concorrente[] = config.concorrenti.nomi
    .slice(0, numeroConcorrenti)
    .map((nome, i) => ({ id: String.fromCharCode(65 + i), nome, quota: 0 }));

  // 3. Spie: numero variabile e segreto (GDD §4.2).
  const fazioni = assegnaFazioni(n, concorrenti, config, casuale);

  // 4. Mescolamento: chi prende quale reparto e quale fazione.
  const ordineGiocatori = casuale.mescola(partecipanti);
  const fazioniMescolate = casuale.mescola(fazioni);

  const giocatori: Giocatore[] = ordineGiocatori.map((p, i) => ({
    id: p.id,
    nome: p.nome,
    repartoId: repartiOccupati[i]!,
    fazione: fazioniMescolate[i]!,
    stato: "ATTIVO",
    puntiReparto: 0,
    quotaMessaggi: config.messaggi.perTrimestre,
    pauseCaffe: 0,
  }));

  const reparti: Reparto[] = elencoReparti.map((id) => {
    const direttore = giocatori.find((g) => g.repartoId === id);
    return direttore ? { id, occupatoDa: direttore.id, autogestione: false } : { id, autogestione: true };
  });

  const partita: Partita = {
    seme,
    statoCasuale: 0,
    fase: { nome: "SCELTA_OBIETTIVI" },
    trimestre: 1,
    giocatori,
    reparti,
    concorrenti,
    azienda: { quota: 0, cassa: 0 },
    cassaInizioTrimestre: 0,
    proposteTrimestre: [],
    proposteUscite: [],
    conteggioFavoriti: {},
    mossePrivate: {},
    segreti: [],
    copieSegreto: [],
    messaggi: [],
    segretiPassati: [],
    conteggioFontiSegreti: {},
    contatore: 0,
    storicoVotiPersonali: [],
    obiettivi: {},
    storicoVotazioni: [],
    storicoTrimestri: [],
    finale: { verifica: {}, nomine: {}, ballottaggio: [], esitiVerifica: [], licenziamenti: [] },
  };

  // 5. Obiettivi personali: tre a testa, uno per tipo (D-046, D-049).
  assegnaObiettivi(partita, ambiente, casuale);
  partita.statoCasuale = casuale.stato();

  // Si parte dalla scelta degli obiettivi; il Rapporto del trimestre 1 arriva con AVANZA_FASE.
  const eventi: Evento[] = [{ tipo: "FASE_INIZIATA", fase: partita.fase, trimestre: 1, causa: descriviFase(partita.fase, 1) }];
  return { ok: true, partita, eventi };
}

/** Restituisce N fazioni (una per giocatore, non ancora assegnate a nessuno). */
function assegnaFazioni(n: number, concorrenti: Concorrente[], config: Configurazione, casuale: Casuale): Fazione[] {
  const spie: Fazione[] = [];
  const nessunaSpia = casuale.probabilita(config.spie.probabilitaNessunaSpia);

  if (!nessunaSpia) {
    const dueSpie = n === 8 && casuale.probabilita(config.spie.con8Giocatori.probabilitaDueSpie);
    const primo = casuale.scegli(concorrenti);
    spie.push({ tipo: "SPIA", concorrente: primo.id });
    if (dueSpie) {
      const stesso = concorrenti.length < 2 || casuale.probabilita(config.spie.con8Giocatori.probabilitaStessoConcorrente);
      const secondo = stesso ? primo : concorrenti.find((c) => c.id !== primo.id)!;
      spie.push({ tipo: "SPIA", concorrente: secondo.id });
    }
  }

  const onesti: Fazione[] = Array.from({ length: n - spie.length }, () => ({ tipo: "ONESTO" }));
  return [...spie, ...onesti];
}
