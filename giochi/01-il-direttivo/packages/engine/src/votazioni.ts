/**
 * Voto del pacchetto del trimestre (GDD §8.3 · D-068).
 *
 * - Ognuno vale 1 e votano tutti i membri del direttivo (niente pesi).
 * - Primo voto, segreto fino alla chiusura: un pacchetto di proposte che costi almeno
 *   "investimentoMinimo" e non superi la cassa. Passa il pacchetto con più della metà dei membri.
 * - Altrimenti secondo voto: principale = il pacchetto più votato (a parità, estratto tra i più votati;
 *   senza voti, estratto tra tutti), alternativa estratta tra gli altri e tenuta coperta. Sì / no al
 *   principale con la maggioranza dei membri; chi non vota vale "no" e passa l'alternativa.
 * - Il voto si chiude sempre con un pacchetto valido: si paga e le proposte risultano approvate.
 */
import type { AzioneGiocatore, Esito, Evento } from "./azioni.js";
import type { Ambiente } from "./contenuti.js";
import { creaCasuale } from "./rng.js";
import type { GiocatoreId, Partita, PropostaIstanza, Voto } from "./tipi.js";

/** Chiave di un pacchetto (per confrontarli e contarli). */
export const chiavePacchetto = (pacchetto: string[]): string => [...pacchetto].sort().join("+");

/** Tutti i pacchetti validi con la cassa attuale, dal meno caro (D-068). */
export function pacchettiValidi(proposte: PropostaIstanza[], cassa: number, minimo: number): string[][] {
  const validi: { ids: string[]; costo: number }[] = [];
  for (let m = 1; m < 1 << proposte.length; m++) {
    const scelte = proposte.filter((_, i) => m & (1 << i));
    const costo = scelte.reduce((s, p) => s + p.costo, 0);
    if (costo >= minimo && costo <= cassa) validi.push({ ids: scelte.map((p) => p.id), costo });
  }
  return validi.sort((a, b) => a.costo - b.costo || a.ids.length - b.ids.length).map((x) => x.ids);
}

export const costoPacchetto = (partita: Partita, pacchetto: string[]): number =>
  pacchetto.reduce((s, id) => s + (partita.proposteTrimestre.find((p) => p.id === id)?.costo ?? 0), 0);

const membri = (partita: Partita) => partita.giocatori.filter((g) => g.stato === "ATTIVO");
const maggioranza = (partita: Partita) => Math.floor(membri(partita).length / 2) + 1;

/** Descrizione leggibile di un pacchetto: "Titolo A (30 K) + Titolo B (50 K)". */
export function descriviPacchetto(partita: Partita, pacchetto: string[], unita: string): string {
  return pacchetto
    .map((id) => partita.proposteTrimestre.find((p) => p.id === id)!)
    .map((p) => `${p.titolo} (${p.costo} ${unita})`)
    .join(" + ");
}

export function votaPacchetto(partita: Partita, azione: Extract<AzioneGiocatore, { tipo: "VOTA_PACCHETTO" }>): Esito {
  if (partita.fase.nome !== "VOTO_PACCHETTO" || !partita.votoTrimestre) return { ok: false, errore: "Ora non si vota il pacchetto" };
  const g = partita.giocatori.find((x) => x.id === azione.da);
  if (!g) return { ok: false, errore: "Giocatore sconosciuto" };
  if (g.stato !== "ATTIVO") return { ok: false, errore: "Vota solo chi è nel direttivo" };
  const chiave = chiavePacchetto(azione.pacchetto ?? []);
  const valido = partita.votoTrimestre.pacchetti.find((p) => chiavePacchetto(p) === chiave);
  if (!valido) return { ok: false, errore: "Pacchetto non valido: deve costare almeno l'investimento minimo e non superare la cassa" };
  // Il voto si può cambiare fino alla chiusura: vale l'ultimo (D-019).
  const nuova = structuredClone(partita);
  nuova.votoTrimestre!.voti[g.id] = [...valido];
  return { ok: true, partita: nuova, eventi: [{ tipo: "VOTO_REGISTRATO", da: g.id, causa: `${g.nome} ha votato` }] };
}

export function votaSecondo(partita: Partita, azione: Extract<AzioneGiocatore, { tipo: "VOTA" }>): Esito {
  if (partita.fase.nome !== "SECONDO_VOTO" || !partita.votoTrimestre?.principale) return { ok: false, errore: "Ora non si vota il pacchetto principale" };
  const g = partita.giocatori.find((x) => x.id === azione.da);
  if (!g) return { ok: false, errore: "Giocatore sconosciuto" };
  if (g.stato !== "ATTIVO") return { ok: false, errore: "Vota solo chi è nel direttivo" };
  if (azione.voto !== "SI" && azione.voto !== "NO") return { ok: false, errore: "Si vota solo SÌ o NO" };
  const nuova = structuredClone(partita);
  nuova.votoTrimestre!.secondiVoti[g.id] = azione.voto;
  return { ok: true, partita: nuova, eventi: [{ tipo: "VOTO_REGISTRATO", da: g.id, causa: `${g.nome} ha votato` }] };
}

/** Approva il pacchetto: segna le proposte, paga, registra lo storico. Modifica la copia ricevuta. */
function approva(partita: Partita, pacchetto: string[]): void {
  const voto = partita.votoTrimestre!;
  voto.approvato = [...pacchetto];
  for (const p of partita.proposteTrimestre) p.approvata = pacchetto.includes(p.id);
  partita.azienda.cassa -= costoPacchetto(partita, pacchetto);
  // Storico per proposta (obiettivi, da rivedere con D-071): "SI" se il primo voto la conteneva.
  const costoMassimo = Math.max(...partita.proposteTrimestre.map((x) => x.costo));
  partita.proposteTrimestre.forEach((p, i) => {
    const voti: Partial<Record<GiocatoreId, Voto>> = {};
    for (const [id, scelto] of Object.entries(voto.voti)) if (scelto) voti[id] = scelto.includes(p.id) ? "SI" : "NO";
    partita.storicoVotazioni.push({
      propostaId: p.id,
      trimestre: partita.trimestre,
      posizione: i + 1,
      votazioniDelTrimestre: partita.proposteTrimestre.length,
      costo: p.costo,
      piuCostosa: p.costo === costoMassimo,
      approvata: p.approvata === true,
      effettoAzienda: p.effettoAzienda,
      voti,
      decisivi: [],
      cassaDopo: partita.azienda.cassa,
    });
  });
}

/** Chiude il primo voto: maggioranza, oppure apre il secondo voto. Modifica la copia ricevuta. */
export function chiudiVotoPacchetto(partita: Partita, ambiente: Ambiente): Evento[] {
  const voto = partita.votoTrimestre;
  if (partita.fase.nome !== "VOTO_PACCHETTO" || !voto) return [];
  const unita = ambiente.config.cassa.unita;
  const rivelati: Partial<Record<GiocatoreId, string[] | "TEMPO_SCADUTO">> = {};
  for (const g of membri(partita)) rivelati[g.id] = voto.voti[g.id] ?? "TEMPO_SCADUTO";

  const conteggio = new Map<string, number>();
  for (const p of Object.values(voto.voti)) if (p) conteggio.set(chiavePacchetto(p), (conteggio.get(chiavePacchetto(p)) ?? 0) + 1);
  const massimo = Math.max(0, ...conteggio.values());
  const inTesta = voto.pacchetti.filter((p) => massimo > 0 && conteggio.get(chiavePacchetto(p)) === massimo);

  if (massimo >= maggioranza(partita) && inTesta.length === 1) {
    approva(partita, inTesta[0]!);
    voto.esito = "PRIMO_VOTO";
    return [
      {
        tipo: "VOTO_PACCHETTO_CHIUSO",
        voti: rivelati,
        approvato: [...inTesta[0]!],
        causa: `Approvato con ${massimo} voti su ${membri(partita).length}: ${descriviPacchetto(partita, inTesta[0]!, unita)}.`,
      },
    ];
  }

  // Secondo voto: principale = il più votato; alternativa estratta tra gli altri, coperta.
  const casuale = creaCasuale(partita.statoCasuale);
  const principale = casuale.scegli(inTesta.length > 0 ? inTesta : voto.pacchetti);
  const altri = voto.pacchetti.filter((p) => chiavePacchetto(p) !== chiavePacchetto(principale));
  const alternativa = altri.length > 0 ? casuale.scegli(altri) : principale;
  partita.statoCasuale = casuale.stato();
  voto.principale = [...principale];
  voto.alternativa = [...alternativa];
  const quante = alternativa.length === 1 ? "una proposta" : `${alternativa.length} proposte`;
  return [
    {
      tipo: "VOTO_PACCHETTO_CHIUSO",
      voti: rivelati,
      causa: `Nessun pacchetto ha la maggioranza (servivano ${maggioranza(partita)} voti su ${membri(partita).length}): si vota il pacchetto più votato.`,
    },
    {
      tipo: "SECONDO_VOTO_APERTO",
      principale: [...principale],
      proposteAlternativa: alternativa.length,
      causa: `Sì o no a: ${descriviPacchetto(partita, principale, unita)}. Se non passa, si fa l'alternativa coperta (${quante}). Chi non vota, vota no.`,
    },
  ];
}

/** Chiude il secondo voto: principale o alternativa. Modifica la copia ricevuta. */
export function chiudiSecondoVoto(partita: Partita, ambiente: Ambiente): Evento[] {
  const voto = partita.votoTrimestre;
  if (partita.fase.nome !== "SECONDO_VOTO" || !voto?.principale || !voto.alternativa) return [];
  const unita = ambiente.config.cassa.unita;
  const rivelati: Partial<Record<GiocatoreId, Voto | "TEMPO_SCADUTO">> = {};
  for (const g of membri(partita)) rivelati[g.id] = voto.secondiVoti[g.id] ?? "TEMPO_SCADUTO";
  const si = Object.values(rivelati).filter((v) => v === "SI").length;
  const passa = si >= maggioranza(partita);
  const pacchetto = passa ? voto.principale : voto.alternativa;
  approva(partita, pacchetto);
  voto.esito = passa ? "PRINCIPALE" : "ALTERNATIVA";
  return [
    {
      tipo: "SECONDO_VOTO_CHIUSO",
      voti: rivelati,
      approvato: [...pacchetto],
      principaleApprovato: passa,
      causa: passa
        ? `Approvato il pacchetto principale con ${si} sì: ${descriviPacchetto(partita, pacchetto, unita)}.`
        : `Il principale non passa (${si} sì, ne servivano ${maggioranza(partita)}): si fa l'alternativa, ${descriviPacchetto(partita, pacchetto, unita)}.`,
    },
  ];
}
