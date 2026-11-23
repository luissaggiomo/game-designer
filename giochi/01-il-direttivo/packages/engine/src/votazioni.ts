/**
 * Votazione pesata (GDD §8.3–8.4bis · Architettura §10.3).
 *
 * - Votano i direttori con peso maggiore di 0. Solo SÌ/NO: niente astensione (D-060).
 * - Soglia = metà più uno del peso dei reparti occupati; i vacanti non contano (D-006).
 * - Tempo scaduto = "no" (conserva lo stato delle cose, D-029, D-060).
 *   Pareggio = respinta (segue dalla soglia "metà più uno").
 * - Approvata solo se c'è abbastanza cassa (costo ≤ cassa).
 */
import type { AzioneGiocatore, Esito, Evento } from "./azioni.js";
import type { Ambiente } from "./contenuti.js";
import { verificaSegretiInTempo } from "./segreti.js";
import type { EsitoVotazione, Giocatore, GiocatoreId, Partita, PropostaIstanza, Voto } from "./tipi.js";

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
  if (g.stato !== "ATTIVO") return { ok: false, errore: "Vota solo chi è nel direttivo" };
  if (pesoDi(proposta, g) === 0) return { ok: false, errore: "Il tuo reparto ha peso 0 in questa votazione: puoi solo parlare" };
  if (azione.voto !== "SI" && azione.voto !== "NO") return { ok: false, errore: "Si vota solo SÌ o NO" };

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
  // Tempo scaduto = conserva lo stato delle cose (D-029, D-060): "no".
  const votiPerTempoScaduto = aventiDiritto.filter((g) => proposta.voti[g.id] === undefined).length;
  const si = aventiDiritto.filter((g) => proposta.voti[g.id] === "SI").reduce((s, g) => s + pesoDi(proposta, g), 0);
  // Peso di tutti i reparti occupati (i pesi effettivi contengono già solo gli occupati, D-006).
  const base = Object.values(proposta.pesi).reduce<number>((s, p) => s + (p ?? 0), 0);
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

/**
 * Voti decisivi (obiettivi, D-052): chi, votando al contrario, avrebbe ribaltato l'esito.
 * Contano solo i SÌ e i NO espressi (niente tempo scaduto, R2).
 */
function votiDecisivi(partita: Partita, proposta: PropostaIstanza, approvata: boolean, unita: string): GiocatoreId[] {
  return Object.entries(proposta.voti).flatMap(([id, voto]) => {
    if (voto !== "SI" && voto !== "NO") return [];
    const ribaltata = { ...proposta, voti: { ...proposta.voti, [id]: voto === "SI" ? ("NO" as const) : ("SI" as const) } };
    return calcolaEsito(partita, ribaltata, unita).approvata !== approvata ? [id] : [];
  });
}

/** Storico delle votazioni per gli obiettivi (solo server). */
function registraNelloStorico(partita: Partita, proposta: PropostaIstanza, approvata: boolean, decisivi: GiocatoreId[]): void {
  const costoMassimo = Math.max(...partita.proposteTrimestre.map((x) => x.costo));
  const voti: Partial<Record<GiocatoreId, Voto>> = {};
  for (const [id, voto] of Object.entries(proposta.voti)) {
    const g = partita.giocatori.find((x) => x.id === id);
    if (voto && g?.stato === "ATTIVO" && pesoDi(proposta, g) > 0) voti[id] = voto;
  }
  partita.storicoVotazioni.push({
    propostaId: proposta.id,
    trimestre: partita.trimestre,
    posizione: partita.proposteTrimestre.indexOf(proposta) + 1,
    votazioniDelTrimestre: partita.proposteTrimestre.length,
    costo: proposta.costo,
    piuCostosa: proposta.costo === costoMassimo,
    approvata,
    effettoAzienda: proposta.effettoAzienda,
    voti,
    decisivi,
    cassaDopo: partita.azienda.cassa,
  });
}

/** Chiude la votazione in corso: registra l'esito e, se approvata, paga il costo. Modifica la copia ricevuta. */
export function chiudiVotazione(partita: Partita, ambiente: Ambiente): Evento[] {
  const proposta = propostaInVotazione(partita);
  if (!proposta) return [];
  const unita = ambiente.config.cassa.unita;
  const esito = calcolaEsito(partita, proposta, unita);
  proposta.esito = esito;
  verificaSegretiInTempo(partita, proposta);
  const decisivi = votiDecisivi(partita, proposta, esito.approvata, unita);
  if (esito.approvata) partita.azienda.cassa -= proposta.costo;
  registraNelloStorico(partita, proposta, esito.approvata, decisivi);
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
