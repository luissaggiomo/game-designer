/**
 * Votazione pesata (GDD §8.3–8.4bis · Architettura §10.3).
 *
 * - Votano solo i direttori ATTIVI con peso maggiore di 0.
 * - Caso normale: soglia = metà più uno del peso dei reparti occupati, demansionati compresi;
 *   i vacanti non contano (D-006). Solo SÌ/NO.
 * - Quesito con astensione: pesi tutti 1, soglia = metà più uno del peso di chi ha votato SÌ o NO
 *   più il peso dei demansionati, che vale come un "no" fisso (D-007, D-013).
 * - Tempo scaduto = "no" (D-007). Pareggio = respinta (segue dalla soglia "metà più uno").
 * - Approvata solo se c'è abbastanza cassa (costo ≤ cassa).
 */
import type { AzioneGiocatore, Esito, Evento } from "./azioni.js";
import type { Ambiente } from "./contenuti.js";
import type { EsitoVotazione, Giocatore, Partita, PropostaIstanza, Voto } from "./tipi.js";

const pesoDi = (proposta: PropostaIstanza, g: Giocatore): number => proposta.pesi[g.repartoId] ?? 0;

/** La proposta in votazione in questo momento, se la fase è una votazione. */
export function propostaInVotazione(partita: Partita): PropostaIstanza | undefined {
  return partita.fase.nome === "VOTAZIONE" ? partita.proposteTrimestre[partita.fase.votazione - 1] : undefined;
}

export function registraVoto(partita: Partita, azione: Extract<AzioneGiocatore, { tipo: "VOTA" }>): Esito {
  const proposta = propostaInVotazione(partita);
  if (!proposta) return { ok: false, errore: "Ora non si sta votando nessuna proposta" };
  const g = partita.giocatori.find((x) => x.id === azione.da);
  if (!g) return { ok: false, errore: "Giocatore sconosciuto" };
  if (g.stato !== "ATTIVO") return { ok: false, errore: "Chi è demansionato non vota al tavolo del direttivo" };
  if (pesoDi(proposta, g) === 0) return { ok: false, errore: "Il tuo reparto ha peso 0 in questa votazione: puoi solo parlare" };
  if (azione.voto === "ASTENUTO" && !proposta.astensioneAmmessa) {
    return { ok: false, errore: "In questa votazione non è ammessa l'astensione" };
  }

  // Il voto si può cambiare fino alla chiusura: vale l'ultimo (D-019).
  const nuova = structuredClone(partita);
  const p = propostaInVotazione(nuova)!;
  p.voti[g.id] = azione.voto;
  const evento: Evento = {
    tipo: "VOTO_REGISTRATO",
    da: g.id,
    propostaId: p.id,
    causa: `${g.nome} ha votato`,
  };
  return { ok: true, partita: nuova, eventi: [evento] };
}

/** Calcola l'esito di una proposta (senza modificare nulla). */
export function calcolaEsito(partita: Partita, proposta: PropostaIstanza, unita: string): EsitoVotazione {
  const aventiDiritto = partita.giocatori.filter((g) => g.stato === "ATTIVO" && pesoDi(proposta, g) > 0);
  const votoDi = (g: Giocatore) => proposta.voti[g.id] ?? "NO"; // tempo scaduto = no (D-007)
  const votiPerTempoScaduto = aventiDiritto.filter((g) => proposta.voti[g.id] === undefined).length;

  const si = aventiDiritto.filter((g) => votoDi(g) === "SI").reduce((s, g) => s + pesoDi(proposta, g), 0);
  const pesoDemansionati = partita.giocatori
    .filter((g) => g.stato === "DEMANSIONATO")
    .reduce((s, g) => s + pesoDi(proposta, g), 0);

  let base: number;
  if (proposta.astensioneAmmessa) {
    const pesoVotanti = aventiDiritto.filter((g) => votoDi(g) !== "ASTENUTO").reduce((s, g) => s + pesoDi(proposta, g), 0);
    base = pesoVotanti + pesoDemansionati;
  } else {
    // Peso di tutti i reparti occupati (i pesi effettivi contengono già solo gli occupati, D-006).
    base = Object.values(proposta.pesi).reduce<number>((s, p) => s + (p ?? 0), 0);
  }
  const soglia = Math.floor(base / 2) + 1;
  const votiSufficienti = si >= soglia;
  const fondiSufficienti = proposta.costo <= partita.azienda.cassa;
  const approvata = votiSufficienti && fondiSufficienti;

  const scaduti = votiPerTempoScaduto > 0 ? ` (${votiPerTempoScaduto} "no" per tempo scaduto)` : "";
  let motivo: string;
  if (approvata) motivo = `Approvata: ${si} sì, ne servivano ${soglia}${scaduti}.`;
  else if (!votiSufficienti) motivo = `Respinta: ${si} sì, ne servivano ${soglia}${scaduti}.`;
  else motivo = `Respinta per mancanza di fondi: costa ${proposta.costo} ${unita}, in cassa ${partita.azienda.cassa} ${unita}.`;

  return { approvata, si, soglia, votiPerTempoScaduto, motivo };
}

/** Chiude la votazione in corso: registra l'esito e, se approvata, paga il costo. Modifica la copia ricevuta. */
export function chiudiVotazione(partita: Partita, ambiente: Ambiente): Evento[] {
  const proposta = propostaInVotazione(partita);
  if (!proposta) return [];
  const esito = calcolaEsito(partita, proposta, ambiente.config.cassa.unita);
  proposta.esito = esito;
  if (esito.approvata) partita.azienda.cassa -= proposta.costo;
  const voti: Partial<Record<string, Voto | "TEMPO_SCADUTO">> = {};
  for (const g of partita.giocatori) {
    if (g.stato === "ATTIVO" && pesoDi(proposta, g) > 0) voti[g.id] = proposta.voti[g.id] ?? "TEMPO_SCADUTO";
  }
  return [
    {
      tipo: "VOTAZIONE_CHIUSA",
      propostaId: proposta.id,
      approvata: esito.approvata,
      si: esito.si,
      soglia: esito.soglia,
      voti,
      causa: `${proposta.titolo} — ${esito.motivo}`,
    },
  ];
}
