/**
 * Il finale (GDD §15 · Architettura §10.9 · D-022).
 *
 * 1. Promozioni finali (vedi personali.ts).
 * 2. Licenziamento dei demansionati, con ruolo rivelato.
 * 3. Verifica: ogni attivo risponde in segreto "nel direttivo sono rimasti solo onesti?".
 *    Tutti sì → punteggio. Almeno un no → la TV rivela chi ha risposto no.
 * 4. Nomina segreta della spia (solo membri attivi, non se stessi); rivelazione una alla volta.
 * 5. Il più nominato viene licenziato e il ruolo rivelato; parità → ballottaggio tra i pari;
 *    nuova parità → tutti i pari licenziati.
 * 6. Secondo giro dalla verifica solo se sono possibili due spie (8 giocatori).
 */
import type { AzioneGiocatore, Esito, Evento } from "./azioni.js";
import type { Ambiente } from "./contenuti.js";
import { creaCasuale } from "./rng.js";
import type { Giocatore, GiocatoreId, Partita } from "./tipi.js";

const attivi = (p: Partita) => p.giocatori.filter((g) => g.stato === "ATTIVO");
const nomeDi = (p: Partita, id: GiocatoreId) => p.giocatori.find((g) => g.id === id)!.nome;

function ruolo(p: Partita, g: Giocatore): string {
  if (g.fazione.tipo === "ONESTO") return "era onesto";
  const concorrente = g.fazione.concorrente;
  return `era una spia di ${p.concorrenti.find((c) => c.id === concorrente)?.nome ?? concorrente}`;
}

function licenzia(p: Partita, g: Giocatore, motivo: string): Evento {
  g.stato = "LICENZIATO";
  return { tipo: "LICENZIAMENTO", giocatore: g.id, spia: g.fazione.tipo === "SPIA", causa: `${g.nome} ${motivo}: ${ruolo(p, g)}.` };
}

/** Sono possibili due spie solo con 8 giocatori (GDD §4.2): serve per il secondo giro. */
export const duePossibiliSpie = (p: Partita) => p.giocatori.length === 8;

/** Ingresso in LICENZIAMENTO_DEMANSIONATI: chi è ancora demansionato viene licenziato. */
export function licenziaDemansionati(partita: Partita): Evento[] {
  return partita.giocatori
    .filter((g) => g.stato === "DEMANSIONATO")
    .map((g) => licenzia(partita, g, "è ancora demansionato e viene licenziato"));
}

export function rispondiVerifica(partita: Partita, azione: Extract<AzioneGiocatore, { tipo: "VERIFICA_FINALE" }>): Esito {
  if (partita.fase.nome !== "VERIFICA") return { ok: false, errore: "Ora non c'è la domanda di verifica" };
  const g = partita.giocatori.find((x) => x.id === azione.da);
  if (!g || g.stato !== "ATTIVO") return { ok: false, errore: "Rispondono solo i membri attivi del direttivo" };
  const nuova = structuredClone(partita);
  nuova.finale.verifica[g.id] = azione.soloOnesti;
  return { ok: true, partita: nuova, eventi: [{ tipo: "RISPOSTA_REGISTRATA", da: g.id, causa: `${g.nome} ha risposto` }] };
}

/** Chiude la verifica del giro in corso. Modifica la copia ricevuta. */
export function chiudiVerifica(partita: Partita, ambiente: Ambiente): Evento[] {
  if (partita.fase.nome !== "VERIFICA") return [];
  const giro = partita.fase.giro;
  const predefinita = ambiente.config.finale.rispostaVerificaPredefinita === "SI";
  const votanti = attivi(partita);
  const votiNo = votanti.filter((g) => !(partita.finale.verifica[g.id] ?? predefinita)).map((g) => g.id);
  const tuttiSi = votiNo.length === 0;
  partita.finale.esitiVerifica.push({
    giro,
    tuttiSi,
    votiNo,
    spieTraAttivi: votanti.filter((g) => g.fazione.tipo === "SPIA").map((g) => g.id),
  });
  return [
    {
      tipo: "ESITO_VERIFICA",
      tuttiSi,
      votiNo,
      causa: tuttiSi
        ? "Tutti hanno risposto: nel direttivo sono rimasti solo onesti."
        : `Hanno risposto no: ${votiNo.map((id) => nomeDi(partita, id)).join(", ")}.`,
    },
  ];
}

export function nominaSpia(partita: Partita, azione: Extract<AzioneGiocatore, { tipo: "NOMINA_SPIA" }>): Esito {
  if (partita.fase.nome !== "NOMINA") return { ok: false, errore: "Ora non si nomina nessuno" };
  const g = partita.giocatori.find((x) => x.id === azione.da);
  const bersaglio = partita.giocatori.find((x) => x.id === azione.bersaglio);
  if (!g || g.stato !== "ATTIVO") return { ok: false, errore: "Nominano solo i membri attivi del direttivo" };
  if (!bersaglio || bersaglio.stato !== "ATTIVO") return { ok: false, errore: "Si può nominare solo un membro attivo del direttivo" };
  if (bersaglio.id === g.id) return { ok: false, errore: "Non puoi nominare te stesso" };
  if (partita.finale.ballottaggio.length > 0 && !partita.finale.ballottaggio.includes(bersaglio.id)) {
    return { ok: false, errore: "Nel ballottaggio si sceglie solo tra i pari merito" };
  }
  const nuova = structuredClone(partita);
  nuova.finale.nomine[g.id] = bersaglio.id;
  return { ok: true, partita: nuova, eventi: [{ tipo: "RISPOSTA_REGISTRATA", da: g.id, causa: `${g.nome} ha nominato` }] };
}

/** Chiude la nomina (o il ballottaggio) in corso: rivelazione, conteggio, licenziamenti. */
export function chiudiNomina(partita: Partita): Evento[] {
  if (partita.fase.nome !== "NOMINA") return [];
  const { giro, ballottaggio: eraBallottaggio } = partita.fase;
  const f = partita.finale;
  const nomine = Object.entries(f.nomine) as [GiocatoreId, GiocatoreId][];
  f.nomine = {};

  // Rivelazione una alla volta, in ordine casuale (riproducibile col seme).
  const casuale = creaCasuale(partita.statoCasuale);
  const ordine = casuale.mescola(nomine);
  partita.statoCasuale = casuale.stato();
  const eventi: Evento[] = [
    {
      tipo: "RIVELAZIONE_NOMINE",
      nomine: ordine.map(([da, bersaglio]) => ({ da, bersaglio })),
      causa: ordine.length > 0 ? ordine.map(([da, b]) => `${nomeDi(partita, da)} → ${nomeDi(partita, b)}`).join(" · ") : "Nessuno ha nominato nessuno.",
    },
  ];

  f.ballottaggio = [];
  if (nomine.length === 0) return eventi;

  const conteggio = new Map<GiocatoreId, GiocatoreId[]>();
  for (const [da, b] of nomine) conteggio.set(b, [...(conteggio.get(b) ?? []), da]);
  const massimo = Math.max(...[...conteggio.values()].map((v) => v.length));
  const primi = [...conteggio.entries()].filter(([, v]) => v.length === massimo);

  if (primi.length > 1 && !eraBallottaggio) {
    f.ballottaggio = primi.map(([id]) => id);
    eventi.push({
      tipo: "BALLOTTAGGIO",
      candidati: f.ballottaggio,
      causa: `Parità tra ${f.ballottaggio.map((id) => nomeDi(partita, id)).join(" e ")}: si va al ballottaggio.`,
    });
    return eventi;
  }
  for (const [id, nominatoDa] of primi) {
    const g = partita.giocatori.find((x) => x.id === id)!;
    f.licenziamenti.push({ giocatore: id, giro, nominatoDa });
    const motivo = primi.length > 1 ? "è licenziato dopo una nuova parità" : "è il più nominato e viene licenziato";
    eventi.push(licenzia(partita, g, motivo));
  }
  return eventi;
}
