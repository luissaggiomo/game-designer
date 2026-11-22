/**
 * Promozioni e demansionamenti (GDD §13 · Architettura §10.8 · D-009, D-010, D-012, D-022).
 *
 * - Fase 6 del trimestre (DEMANSIONAMENTO) e finale (PROMOZIONI_FINALI, solo promozioni).
 * - Prima le promozioni, poi l'eventuale demansionamento: dopo una proposta di demansionamento
 *   non si propongono più promozioni in quella fase.
 * - Voto 1 a testa tra gli attivi, il bersaglio non vota; solo SÌ/NO; tempo scaduto = no;
 *   soglia metà più uno degli aventi diritto; pareggio = non passa.
 * - Promozione: dopo almeno un trimestre intero fuori; proposta da un attivo o richiesta dal
 *   demansionato; al massimo una richiesta per persona per momento (fase 6 o finale).
 * - Demansionamento: una sola votazione per trimestre; chi è stato bersaglio non può essere
 *   riproposto nel trimestre successivo; mai nel 4° trimestre; il ruolo non si rivela;
 *   si perdono i segreti del proprio reparto.
 */
import type { AzioneGiocatore, Esito, Evento } from "./azioni.js";
import type { Ambiente } from "./contenuti.js";
import type { MomentoVoto, Partita, VotoPersonale } from "./tipi.js";

function momentoAttuale(partita: Partita): MomentoVoto | null {
  if (partita.fase.nome === "DEMANSIONAMENTO") return partita.trimestre;
  if (partita.fase.nome === "PROMOZIONI_FINALI") return "FINALE";
  return null;
}

const tuttiIVoti = (p: Partita): VotoPersonale[] => [...p.storicoVotiPersonali, ...(p.votoPersonale ? [p.votoPersonale] : [])];

function apri(partita: Partita, voto: VotoPersonale): Esito {
  const nuova = structuredClone(partita);
  nuova.votoPersonale = voto;
  const nome = (id: string) => nuova.giocatori.find((g) => g.id === id)!.nome;
  const cosa = voto.tipo === "PROMOZIONE" ? "promozione" : "demansionamento";
  const chi = voto.proponente === voto.bersaglio ? `${nome(voto.bersaglio)} chiede la ${cosa}` : `${nome(voto.proponente)} propone il ${cosa} di ${nome(voto.bersaglio)}`;
  return {
    ok: true,
    partita: nuova,
    eventi: [{ tipo: "VOTO_PERSONALE_APERTO", voto: voto.tipo, bersaglio: voto.bersaglio, proponente: voto.proponente, causa: `${chi}.` }],
  };
}

export function proponiPromozione(partita: Partita, azione: Extract<AzioneGiocatore, { tipo: "PROPONI_PROMOZIONE" }>): Esito {
  const momento = momentoAttuale(partita);
  if (momento === null) return { ok: false, errore: "Ora non si votano promozioni" };
  if (partita.votoPersonale) return { ok: false, errore: "C'è già una votazione in corso" };
  if (tuttiIVoti(partita).some((v) => v.tipo === "DEMANSIONAMENTO" && v.momento === momento)) {
    return { ok: false, errore: "Le promozioni si votano prima del demansionamento" };
  }
  const proponente = partita.giocatori.find((g) => g.id === azione.da);
  const bersaglio = partita.giocatori.find((g) => g.id === azione.bersaglio);
  if (!proponente || !bersaglio) return { ok: false, errore: "Giocatore sconosciuto" };
  if (bersaglio.stato !== "DEMANSIONATO") return { ok: false, errore: "Si può promuovere solo chi è demansionato" };
  if (proponente.stato !== "ATTIVO" && proponente.id !== bersaglio.id) {
    return { ok: false, errore: "La promozione la propone un direttore attivo o la chiede il demansionato" };
  }
  if (momento !== "FINALE" && partita.trimestre < (bersaglio.demansionatoDalTrimestre ?? 0) + 1) {
    return { ok: false, errore: "Serve almeno un trimestre intero da demansionato prima della promozione" };
  }
  if (tuttiIVoti(partita).some((v) => v.tipo === "PROMOZIONE" && v.bersaglio === bersaglio.id && v.momento === momento)) {
    return { ok: false, errore: "Per questa persona la promozione è già stata votata in questo momento" };
  }
  return apri(partita, { tipo: "PROMOZIONE", bersaglio: bersaglio.id, proponente: proponente.id, momento, voti: {} });
}

export function proponiDemansionamento(
  partita: Partita,
  azione: Extract<AzioneGiocatore, { tipo: "PROPONI_DEMANSIONAMENTO" }>,
  ambiente: Ambiente,
): Esito {
  if (partita.fase.nome !== "DEMANSIONAMENTO") return { ok: false, errore: "Ora non si propongono demansionamenti" };
  if (partita.trimestre >= ambiente.config.trimestri) return { ok: false, errore: "Nel 4° trimestre non si demansiona nessuno" };
  if (partita.votoPersonale) return { ok: false, errore: "C'è già una votazione in corso" };
  if (tuttiIVoti(partita).some((v) => v.tipo === "DEMANSIONAMENTO" && v.momento === partita.trimestre)) {
    return { ok: false, errore: "In questo trimestre si è già votato un demansionamento" };
  }
  const proponente = partita.giocatori.find((g) => g.id === azione.da);
  const bersaglio = partita.giocatori.find((g) => g.id === azione.bersaglio);
  if (!proponente || !bersaglio) return { ok: false, errore: "Giocatore sconosciuto" };
  if (proponente.stato !== "ATTIVO") return { ok: false, errore: "Solo un direttore attivo può proporre un demansionamento" };
  if (bersaglio.stato !== "ATTIVO") return { ok: false, errore: "Si può demansionare solo un direttore attivo" };
  if (bersaglio.id === proponente.id) return { ok: false, errore: "Non puoi proporre il tuo demansionamento" };
  if (partita.storicoVotiPersonali.some((v) => v.tipo === "DEMANSIONAMENTO" && v.bersaglio === bersaglio.id && v.momento === partita.trimestre - 1)) {
    return { ok: false, errore: "Questa persona è stata bersaglio nel trimestre scorso" };
  }
  return apri(partita, { tipo: "DEMANSIONAMENTO", bersaglio: bersaglio.id, proponente: proponente.id, momento: partita.trimestre, voti: {} });
}

export function votaPersonale(
  partita: Partita,
  azione: Extract<AzioneGiocatore, { tipo: "VOTA_PROMOZIONE" | "VOTA_DEMANSIONAMENTO" }>,
): Esito {
  const voto = partita.votoPersonale;
  const tipoAtteso = azione.tipo === "VOTA_PROMOZIONE" ? "PROMOZIONE" : "DEMANSIONAMENTO";
  if (!voto || voto.tipo !== tipoAtteso) return { ok: false, errore: "Non c'è una votazione di questo tipo in corso" };
  const g = partita.giocatori.find((x) => x.id === azione.da);
  if (!g || g.stato !== "ATTIVO") return { ok: false, errore: "Votano solo i direttori attivi" };
  if (g.id === voto.bersaglio) return { ok: false, errore: "Non si vota sulla propria posizione" };
  const nuova = structuredClone(partita);
  nuova.votoPersonale!.voti[g.id] = azione.voto; // modificabile fino alla chiusura (come D-019)
  return { ok: true, partita: nuova, eventi: [{ tipo: "VOTO_PERSONALE_REGISTRATO", da: g.id, causa: `${g.nome} ha votato` }] };
}

/** Chiude il voto personale in corso e ne applica l'esito. Modifica la copia ricevuta. */
export function chiudiVotoPersonale(partita: Partita): Evento[] {
  const voto = partita.votoPersonale;
  if (!voto) return [];
  delete partita.votoPersonale;

  const aventiDiritto = partita.giocatori.filter((g) => g.stato === "ATTIVO" && g.id !== voto.bersaglio);
  const si = aventiDiritto.filter((g) => voto.voti[g.id] === "SI").length;
  const soglia = Math.floor(aventiDiritto.length / 2) + 1;
  const approvato = si >= soglia;
  partita.storicoVotiPersonali.push({ ...voto, approvato, si, soglia });

  const bersaglio = partita.giocatori.find((g) => g.id === voto.bersaglio)!;
  const reparto = partita.reparti.find((r) => r.id === bersaglio.repartoId)!;
  if (approvato && voto.tipo === "DEMANSIONAMENTO") {
    bersaglio.stato = "DEMANSIONATO";
    bersaglio.demansionatoDalTrimestre = partita.trimestre;
    reparto.autogestione = true;
    // Perde i segreti del proprio reparto (D-022); quelli ricevuti da altri restano.
    for (const c of partita.copieSegreto) {
      if (c.possessore === bersaglio.id && c.provenienza.tipo === "GIOCO") c.revocata = true;
    }
  }
  if (approvato && voto.tipo === "PROMOZIONE") {
    bersaglio.stato = "ATTIVO";
    delete bersaglio.demansionatoDalTrimestre;
    reparto.autogestione = false;
  }

  const voti: Partial<Record<string, "SI" | "NO" | "TEMPO_SCADUTO">> = {};
  for (const g of aventiDiritto) voti[g.id] = voto.voti[g.id] ?? "TEMPO_SCADUTO";
  const esito = voto.tipo === "PROMOZIONE" ? (approvato ? "è stato promosso" : "resta demansionato") : approvato ? "è stato demansionato" : "resta al suo posto";
  return [
    {
      tipo: "VOTO_PERSONALE_CHIUSO",
      voto: voto.tipo,
      bersaglio: bersaglio.id,
      approvato,
      si,
      soglia,
      voti,
      causa: `${bersaglio.nome} ${esito}: ${si} sì, ne servivano ${soglia}.`,
    },
  ];
}
