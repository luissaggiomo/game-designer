/**
 * Mossa privata e risultati del trimestre (GDD §7.2 fase 5, §8.2, §9, §12, §14 · Architettura §10.4, §10.6, §10.7).
 *
 * Alla RISOLUZIONE, in quest'ordine:
 * 1. mosse private: punti di reparto (privati) e andamento dell'azienda; la TV vede quanti hanno
 *    giocato per l'azienda, mai chi (D-061);
 * 2. effetti delle proposte approvate: punti di reparto (privati) ed effetto reale sull'azienda (pubblico);
 * 3. mosse dei concorrenti;
 * 4. corsa di mercato aggiornata.
 * 3bis. segreti: arrivi annunciati, valore di quelli che scadono, segreti usati dai concorrenti (D-072…D-074).
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
  if (g.stato !== "ATTIVO") return { ok: false, errore: "La mossa privata la fanno solo i membri del direttivo" };

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
  const quotaDopoMosse = partita.azienda.quota;
  eventi.push(...applicaEffettiProposte(partita));
  const quotaDopoProposte = partita.azienda.quota;
  eventi.push(...risolviSegreti(partita, ambiente));
  // Storico (solo server): quanto hanno reso all'azienda proposte e segreti (D-056).
  const registro = partita.storicoTrimestri.at(-1)!;
  registro.effettoProposte = quotaDopoProposte - quotaDopoMosse;
  registro.effettoSegreti = partita.azienda.quota - quotaDopoProposte;
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
  // le decisioni del finale si prendono senza sapere chi ha vinto la corsa. Le fughe di notizie e il
  // conteggio della mossa privata si annunciano subito: sono indizi che servono al finale (variante B, D-061).
  if (partita.trimestre >= ambiente.config.trimestri) {
    partita.risultatiRinviati = { eventi: eventi.filter((e) => e.tipo !== "ESITO_MOSSE_PRIVATE"), quote: quotePrima };
    const mosse = eventi.filter((e) => e.tipo === "ESITO_MOSSE_PRIVATE");
    const fughe: Evento[] = eventi.flatMap((e) => {
      if (e.tipo !== "SEGRETO_USATO") return [];
      const titolo = partita.segreti.find((s) => s.id === e.segretoId)!.titolo;
      const nome = partita.concorrenti.find((c) => c.id === e.concorrente)!.nome;
      return [{ tipo: "FUGA_DI_NOTIZIE" as const, concorrente: e.concorrente, segretoId: e.segretoId, causa: `Un'informazione è finita a ${nome}: «${titolo}».` }];
    });
    return [...mosse, ...fughe, { tipo: "RISULTATI_RINVIATI", causa: "I numeri del mercato dell'ultimo trimestre si scopriranno alla fine, dopo il finale." }];
  }
  return eventi;
}

function risolviMossePrivate(partita: Partita, ambiente: Ambiente, casuale: Casuale): Evento {
  const valori = ambiente.config.mossaPrivata;
  let delta = 0;
  let perAzienda = 0;

  // Membri del direttivo: la loro scelta, oppure quella predefinita se il tempo è scaduto (D-020).
  // I reparti vacanti non partecipano.
  const membri = partita.giocatori.filter((x) => x.stato === "ATTIVO");
  for (const g of membri) {
    const scelta: SceltaMossa = partita.mossePrivate[g.id] ?? valori.sceltaPredefinita;
    const v = scelta === "REPARTO" ? valori.reparto : valori.azienda;
    if (scelta === "AZIENDA") perAzienda++;
    g.puntiReparto += v.puntiReparto;
    delta += v.deltaAzienda;
  }

  delta += casuale.scegli(valori.rumore);
  partita.azienda.quota += delta;

  // Storico per gli obiettivi: solo le mosse scelte davvero dai direttori attivi (D-052 R2).
  const mosseScelte: Partial<Record<string, SceltaMossa>> = {};
  for (const g of partita.giocatori.filter((x) => x.stato === "ATTIVO")) {
    const scelta = partita.mossePrivate[g.id];
    if (scelta) mosseScelte[g.id] = scelta;
  }
  partita.storicoTrimestri.push({
    trimestre: partita.trimestre,
    mosseScelte,
    perAzienda,
    partecipanti: membri.length,
    cassaInizio: partita.cassaInizioTrimestre,
    cassaFine: partita.azienda.cassa,
  });
  const verbo = perAzienda === 1 ? "ha giocato" : "hanno giocato";
  return { tipo: "ESITO_MOSSE_PRIVATE", perAzienda, partecipanti: membri.length, causa: `Mossa privata: ${perAzienda} su ${membri.length} ${verbo} per l'azienda.` };
}

function applicaEffettiProposte(partita: Partita): Evento[] {
  const eventi: Evento[] = [];
  for (const p of partita.proposteTrimestre.filter((x) => x.approvata)) {
    // Effetti privati sui reparti (i vacanti non accumulano punti).
    for (const r of partita.reparti) {
      const punti = p.effettiPrivati[r.id]?.punti;
      if (punti === undefined) continue;
      const direttore = partita.giocatori.find((g) => g.id === r.occupatoDa);
      if (!direttore) continue; // reparto vacante: nessuno accumula punti
      direttore.puntiReparto += punti;
    }
    // Effetto reale sull'azienda: pubblico.
    partita.azienda.quota += p.effettoAzienda;
    const segno = p.effettoAzienda > 0 ? `+${p.effettoAzienda}` : `${p.effettoAzienda}`;
    eventi.push({
      tipo: "EFFETTO_PROPOSTA",
      propostaId: p.id,
      effettoAzienda: p.effettoAzienda,
      // Con la frase di spiegazione (D-033); nell'ultimo trimestre esce al punteggio (D-029).
      causa: `${p.titolo}: effetto reale sull'azienda ${segno}. ${p.spiegazione}.`,
    });
  }
  return eventi;
}

function muoviConcorrenti(partita: Partita, ambiente: Ambiente, casuale: Casuale): Evento[] {
  const { quotaAziendalistaRiferimento: q, crescitaMediaProposteESegreti, eventoCasuale } = ambiente.config.concorrenti;
  // D-056: il concorrente avanza quanto l'azienda media, cioè un direttivo che sceglie "per l'azienda"
  // nella quota q dei casi: effetto medio della mossa privata per giocatore, più l'effetto medio di
  // proposte e segreti. La parte decimale diventa +1 con quella probabilità (niente gradini).
  const { azienda, reparto } = ambiente.config.mossaPrivata;
  const perGiocatore = q * azienda.deltaAzienda + (1 - q) * reparto.deltaAzienda;
  const attesa = Math.max(0, crescitaMediaProposteESegreti + perGiocatore * partita.giocatori.length);
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
