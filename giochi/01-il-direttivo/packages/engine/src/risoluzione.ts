/**
 * Mossa privata e risultati del trimestre (GDD §7.2 fase 5, §8.2, §9, §12, §14 · Architettura §10.4, §10.6, §10.7).
 *
 * Alla RISOLUZIONE, in quest'ordine:
 * 1. mosse private: punti di reparto (privati) e andamento dell'azienda; la TV vede solo
 *    "in calo / stabile / in crescita", mai il numero;
 * 2. effetti delle proposte approvate: punti di reparto (privati, ridotti se in autogestione)
 *    ed effetto reale sull'azienda (pubblico);
 * 3. mosse dei concorrenti;
 * 4. corsa di mercato aggiornata.
 * I segreti passati ai concorrenti si aggiungeranno con le regole dei segreti.
 */
import type { AzioneGiocatore, Esito, Evento } from "./azioni.js";
import type { Ambiente } from "./contenuti.js";
import type { Casuale } from "./rng.js";
import { creaCasuale } from "./rng.js";
import { risolviSegreti } from "./segreti.js";
import type { Partita, SceltaMossa } from "./tipi.js";

export function registraMossa(partita: Partita, azione: Extract<AzioneGiocatore, { tipo: "MOSSA_PRIVATA" }>): Esito {
  if (partita.fase.nome !== "MOSSA_PRIVATA") return { ok: false, errore: "Ora non è il momento della mossa privata" };
  const g = partita.giocatori.find((x) => x.id === azione.da);
  if (!g) return { ok: false, errore: "Giocatore sconosciuto" };
  if (g.stato !== "ATTIVO") return { ok: false, errore: "Chi è demansionato non fa la mossa privata: il suo reparto è in autogestione" };

  const nuova = structuredClone(partita);
  nuova.mossePrivate[g.id] = azione.scelta; // si può cambiare fino alla chiusura: vale l'ultima
  return { ok: true, partita: nuova, eventi: [{ tipo: "MOSSA_REGISTRATA", da: g.id, causa: `${g.nome} ha scelto` }] };
}

/** Applica i risultati del trimestre. Modifica la copia ricevuta e restituisce gli eventi pubblici. */
export function risolviTrimestre(partita: Partita, ambiente: Ambiente): Evento[] {
  const casuale = creaCasuale(partita.statoCasuale);
  const eventi: Evento[] = [];
  // Quote prima dei risultati: nell'ultimo trimestre restano quelle visibili fino al punteggio (D-029).
  const quotePrima = {
    azienda: partita.azienda.quota,
    concorrenti: Object.fromEntries(partita.concorrenti.map((c) => [c.id, c.quota])),
  };

  eventi.push(risolviMossePrivate(partita, ambiente, casuale));
  eventi.push(...applicaEffettiProposte(partita, ambiente));
  eventi.push(...risolviSegreti(partita, ambiente));
  eventi.push(...muoviConcorrenti(partita, ambiente, casuale));

  const concorrenti: Record<string, number> = {};
  for (const c of partita.concorrenti) concorrenti[c.nome] = c.quota;
  eventi.push({
    tipo: "CORSA_DI_MERCATO",
    azienda: partita.azienda.quota,
    concorrenti,
    causa:
      `Corsa di mercato — Azienda: ${partita.azienda.quota}` +
      partita.concorrenti.map((c) => ` · ${c.nome}: ${c.quota}`).join(""),
  });

  partita.statoCasuale = casuale.stato();

  // Ultimo trimestre: i numeri del mercato si scoprono solo alla fine, dopo il finale (D-029), così
  // le decisioni del finale si prendono senza sapere chi ha vinto la corsa. Le fughe di notizie si
  // annunciano subito, senza numeri: sono indizi che servono al finale (variante B).
  if (partita.trimestre >= ambiente.config.trimestri) {
    partita.risultatiRinviati = { eventi, quote: quotePrima };
    const fughe: Evento[] = eventi.flatMap((e) => {
      if (e.tipo !== "SEGRETO_USATO") return [];
      const titolo = partita.segreti.find((s) => s.id === e.segretoId)!.titolo;
      const nome = partita.concorrenti.find((c) => c.id === e.concorrente)!.nome;
      return [{ tipo: "FUGA_DI_NOTIZIE" as const, concorrente: e.concorrente, segretoId: e.segretoId, causa: `Un'informazione è finita a ${nome}: «${titolo}».` }];
    });
    return [...fughe, { tipo: "RISULTATI_RINVIATI", causa: "I numeri del mercato dell'ultimo trimestre si scopriranno alla fine, dopo il finale." }];
  }
  return eventi;
}

function risolviMossePrivate(partita: Partita, ambiente: Ambiente, casuale: Casuale): Evento {
  const { config } = ambiente;
  const valori = config.mossaPrivata;
  let delta = 0;

  // Direttori attivi: la loro scelta, oppure quella predefinita se il tempo è scaduto.
  for (const g of partita.giocatori.filter((x) => x.stato === "ATTIVO")) {
    const scelta: SceltaMossa = partita.mossePrivate[g.id] ?? valori.sceltaPredefinita;
    const v = scelta === "REPARTO" ? valori.reparto : valori.azienda;
    g.puntiReparto += v.puntiReparto;
    delta += v.deltaAzienda;
  }

  // Reparti dei demansionati: sceglie il computer. I reparti vacanti non partecipano (D-020).
  if (config.autogestione.mossaPrivataDemansionati) {
    for (const r of partita.reparti.filter((x) => x.autogestione && x.occupatoDa)) {
      const scelta: SceltaMossa = casuale.probabilita(config.autogestione.probabilitaMossaAzienda) ? "AZIENDA" : "REPARTO";
      const v = scelta === "REPARTO" ? valori.reparto : valori.azienda;
      const direttore = partita.giocatori.find((g) => g.id === r.occupatoDa);
      if (direttore) direttore.puntiReparto += v.puntiReparto;
      delta += v.deltaAzienda;
    }
  }

  delta += casuale.scegli(valori.rumore);
  partita.azienda.quota += delta;

  const andamento = delta < 0 ? "IN_CALO" : delta === 0 ? "STABILE" : "IN_CRESCITA";
  const testo = { IN_CALO: "in calo", STABILE: "stabile", IN_CRESCITA: "in crescita" }[andamento];
  return { tipo: "ESITO_MOSSE_PRIVATE", andamento, causa: `Impegno dei reparti questo trimestre: ${testo}.` };
}

function applicaEffettiProposte(partita: Partita, ambiente: Ambiente): Evento[] {
  const fattore = ambiente.config.autogestione.fattoreEffetti;
  const eventi: Evento[] = [];
  for (const p of partita.proposteTrimestre.filter((x) => x.esito?.approvata)) {
    // Effetti privati sui reparti: ridotti se il reparto è in autogestione ("rende poco, non fa disastri").
    for (const r of partita.reparti) {
      const punti = p.effettiPrivati[r.id]?.punti;
      if (punti === undefined) continue;
      const direttore = partita.giocatori.find((g) => g.id === r.occupatoDa);
      if (!direttore) continue; // reparto vacante: nessuno accumula punti
      direttore.puntiReparto += r.autogestione ? Math.trunc(punti * fattore) : punti;
    }
    // Effetto reale sull'azienda: pubblico.
    partita.azienda.quota += p.effettoAzienda;
    const segno = p.effettoAzienda > 0 ? `+${p.effettoAzienda}` : `${p.effettoAzienda}`;
    eventi.push({
      tipo: "EFFETTO_PROPOSTA",
      propostaId: p.id,
      effettoAzienda: p.effettoAzienda,
      causa: `${p.titolo}: effetto reale sull'azienda ${segno}.`,
    });
  }
  return eventi;
}

function muoviConcorrenti(partita: Partita, ambiente: Ambiente, casuale: Casuale): Evento[] {
  const { crescitaBase, crescitaPerGiocatore, eventoCasuale } = ambiente.config.concorrenti;
  // Crescita attesa = base + per giocatore × giocatori; la parte decimale diventa +1 con quella probabilità
  // (arrotondamento "a probabilità": niente gradini tra un numero di giocatori e l'altro).
  const attesa = crescitaBase + crescitaPerGiocatore * partita.giocatori.length;
  return partita.concorrenti.map((c) => {
    const crescita = Math.floor(attesa) + (casuale.probabilita(attesa - Math.floor(attesa)) ? 1 : 0);
    const evento = casuale.scegli(eventoCasuale);
    const variazione = crescita + evento;
    c.quota += variazione;
    const segno = variazione >= 0 ? `+${variazione}` : `${variazione}`;
    return {
      tipo: "MOSSA_CONCORRENTE",
      concorrente: c.id,
      variazione,
      causa: `${c.nome}: ${segno} (crescita ${crescita}, imprevisti ${evento >= 0 ? "+" : ""}${evento}).`,
    };
  });
}
