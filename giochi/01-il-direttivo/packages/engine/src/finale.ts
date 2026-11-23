/**
 * Il finale "Rinnovo dei contratti" (GDD §15 · D-058, D-059).
 *
 * 1. DOMANDA: "C'è una spia nel direttivo?" Sì / No, voto palese mostrato a fine voto. Il tempo
 *    scaduto vale "No" (conserva lo stato delle cose). Si procede se i sì sono almeno la metà dei
 *    membri del direttivo (50/50 = si procede).
 * 2. NOMINA: ognuno fa un nome (non il proprio). Licenziato chi ha più della metà dei nomi fatti
 *    (metà più uno, contata sui votanti). Altrimenti ballottaggio tra il primo e il secondo, con
 *    tutti i pari merito.
 * 3. BALLOTTAGGIO: chi è candidato non vota (se fuori non resta nessuno, votano anche i candidati,
 *    non per sé). Licenziato chi ha più voti da solo.
 *    - Percorso "DUE" (due candidati): stallo → si rivota; nuovo stallo → licenziati entrambi.
 *    - Percorso "TRE" (tre o più candidati): stallo → si rivota tra i primi, con l'avvertimento;
 *      nuovo stallo → ultima votazione in cui chi ha votato lo stesso nome due volte non può
 *      rivotarlo; nuovo stallo → nessun licenziato. Chi entra nel percorso a tre ci resta.
 * 4. Con 8 giocatori, se nel primo giro è stato licenziato uno solo, secondo giro dalla domanda.
 * Nessun punto per accuse e licenziamenti (D-059).
 */
import type { AzioneGiocatore, Esito, Evento } from "./azioni.js";
import type { Ambiente } from "./contenuti.js";
import { creaCasuale } from "./rng.js";
import type { Ballottaggio, Giocatore, GiocatoreId, Partita } from "./tipi.js";

const attivi = (p: Partita) => p.giocatori.filter((g) => g.stato === "ATTIVO");
const nomeDi = (p: Partita, id: GiocatoreId) => p.giocatori.find((g) => g.id === id)!.nome;
const elencoNomi = (p: Partita, ids: GiocatoreId[]) => ids.map((id) => nomeDi(p, id)).join(", ");

function ruolo(p: Partita, g: Giocatore): string {
  if (g.fazione.tipo === "ONESTO") return "era onesto";
  const concorrente = g.fazione.concorrente;
  return `era una spia di ${p.concorrenti.find((c) => c.id === concorrente)?.nome ?? concorrente}`;
}

function licenzia(p: Partita, id: GiocatoreId, giro: number, votatoDa: GiocatoreId[], motivo: string): Evento {
  const g = p.giocatori.find((x) => x.id === id)!;
  g.stato = "LICENZIATO";
  p.finale.licenziamenti.push({ giocatore: id, giro, votatoDa });
  return { tipo: "LICENZIAMENTO", giocatore: g.id, spia: g.fazione.tipo === "SPIA", causa: `${g.nome} ${motivo}: ${ruolo(p, g)}.` };
}

/** Sono possibili due spie solo con 8 giocatori (GDD §4.2): serve per il secondo giro. */
export const duePossibiliSpie = (p: Partita) => p.giocatori.length === 8;

/** Licenziati in un giro del finale. */
export const licenziatiNelGiro = (p: Partita, giro: number) => p.finale.licenziamenti.filter((l) => l.giro === giro).length;

// ——— Domanda ———

export function rispondiDomanda(partita: Partita, azione: Extract<AzioneGiocatore, { tipo: "DOMANDA_SPIA" }>): Esito {
  if (partita.fase.nome !== "DOMANDA") return { ok: false, errore: "Ora non c'è la domanda sulla spia" };
  const g = partita.giocatori.find((x) => x.id === azione.da);
  if (!g || g.stato !== "ATTIVO") return { ok: false, errore: "Rispondono solo i membri del direttivo" };
  const nuova = structuredClone(partita);
  nuova.finale.risposte[g.id] = azione.risposta === "SI"; // modificabile fino alla chiusura
  return { ok: true, partita: nuova, eventi: [{ tipo: "RISPOSTA_REGISTRATA", da: g.id, causa: `${g.nome} ha risposto` }] };
}

/** Chiude la domanda del giro in corso. Modifica la copia ricevuta. */
export function chiudiDomanda(partita: Partita, ambiente: Ambiente): Evento[] {
  if (partita.fase.nome !== "DOMANDA") return [];
  const giro = partita.fase.giro;
  const predefinita = ambiente.config.finale.rispostaDomandaPredefinita === "SI";
  const membri = attivi(partita);
  const tempoScaduto = membri.filter((g) => partita.finale.risposte[g.id] === undefined).map((g) => g.id);
  const si = membri.filter((g) => partita.finale.risposte[g.id] ?? predefinita).map((g) => g.id);
  const no = membri.filter((g) => !si.includes(g.id)).map((g) => g.id);
  const procede = si.length * 2 >= membri.length;
  partita.finale.esitiDomanda.push({ giro, si, no, tempoScaduto, procede });
  partita.finale.risposte = {};
  const scaduti = tempoScaduto.length > 0 ? ` (tempo scaduto: ${elencoNomi(partita, tempoScaduto)})` : "";
  return [
    {
      tipo: "ESITO_DOMANDA",
      giro,
      si,
      no,
      procede,
      causa:
        `Sì: ${si.length > 0 ? elencoNomi(partita, si) : "nessuno"} · No: ${no.length > 0 ? elencoNomi(partita, no) : "nessuno"}${scaduti}. ` +
        (procede ? "Si procede con i nomi." : "Il direttivo ritiene che non ci siano spie: nessun licenziamento."),
    },
  ];
}

// ——— Nomi e ballottaggio ———

/** Chi vota nel ballottaggio: i membri non candidati; se non ce ne sono, anche i candidati (D-058). */
export function votantiBallottaggio(partita: Partita, b: Ballottaggio): GiocatoreId[] {
  const esterni = attivi(partita).filter((g) => !b.candidati.includes(g.id)).map((g) => g.id);
  return esterni.length > 0 ? esterni : attivi(partita).map((g) => g.id);
}

/**
 * Nome bloccato per un votante nell'ultima votazione del percorso a tre: quello votato uguale nei due
 * turni precedenti (D-058). Undefined se non ha votato due volte lo stesso nome.
 */
export function nomeBloccato(b: Ballottaggio | undefined, votante: GiocatoreId): GiocatoreId | undefined {
  if (!b || b.percorso !== "TRE" || b.turno < 3) return undefined;
  const [primo, secondo] = b.votiPrecedenti.slice(-2);
  const v1 = primo?.[votante];
  return v1 !== undefined && v1 === secondo?.[votante] ? v1 : undefined;
}

export function nominaSpia(partita: Partita, azione: Extract<AzioneGiocatore, { tipo: "NOMINA_SPIA" }>): Esito {
  const fase = partita.fase.nome;
  if (fase !== "NOMINA" && fase !== "BALLOTTAGGIO") return { ok: false, errore: "Ora non si fanno nomi" };
  const g = partita.giocatori.find((x) => x.id === azione.da);
  const bersaglio = partita.giocatori.find((x) => x.id === azione.bersaglio);
  if (!g || g.stato !== "ATTIVO") return { ok: false, errore: "Votano solo i membri del direttivo" };
  if (!bersaglio || bersaglio.stato !== "ATTIVO") return { ok: false, errore: "Si può indicare solo un membro del direttivo" };
  if (bersaglio.id === g.id) return { ok: false, errore: "Non puoi indicare te stesso" };
  if (fase === "BALLOTTAGGIO") {
    const b = partita.finale.ballottaggio!;
    if (!votantiBallottaggio(partita, b).includes(g.id)) return { ok: false, errore: "Chi è al ballottaggio non vota" };
    if (!b.candidati.includes(bersaglio.id)) return { ok: false, errore: "Nel ballottaggio si sceglie solo tra i candidati" };
    if (nomeBloccato(b, g.id) === bersaglio.id) return { ok: false, errore: "Hai votato questo nome nelle due votazioni precedenti: ora non puoi votarlo" };
  }
  const nuova = structuredClone(partita);
  nuova.finale.nomine[g.id] = bersaglio.id;
  return { ok: true, partita: nuova, eventi: [{ tipo: "RISPOSTA_REGISTRATA", da: g.id, causa: `${g.nome} ha votato` }] };
}

/** Raccoglie i voti del turno, li rivela uno alla volta (ordine casuale) e li conta. */
function rivelaEConta(partita: Partita, tipo: "NOMI" | "BALLOTTAGGIO", giro: number, turno: number) {
  const voti = Object.entries(partita.finale.nomine) as [GiocatoreId, GiocatoreId][];
  partita.finale.nomine = {};
  const casuale = creaCasuale(partita.statoCasuale);
  const ordine = casuale.mescola(voti);
  partita.statoCasuale = casuale.stato();
  partita.finale.votazioni.push({ giro, tipo, turno, voti: ordine.map(([da, per]) => ({ da, per })) });
  const evento: Evento = {
    tipo: "RIVELAZIONE_NOMINE",
    nomine: ordine.map(([da, bersaglio]) => ({ da, bersaglio })),
    causa: ordine.length > 0 ? ordine.map(([da, b]) => `${nomeDi(partita, da)} → ${nomeDi(partita, b)}`).join(" · ") : "Nessuno ha votato.",
  };
  const conteggio = new Map<GiocatoreId, GiocatoreId[]>();
  for (const [da, b] of voti) conteggio.set(b, [...(conteggio.get(b) ?? []), da]);
  return { evento, conteggio, votanti: voti.length };
}

/** Gruppi di pari merito in ordine di voti (dal più votato). */
function classifica(conteggio: Map<GiocatoreId, GiocatoreId[]>): GiocatoreId[][] {
  const livelli = [...new Set([...conteggio.values()].map((v) => v.length))].sort((a, b) => b - a);
  return livelli.map((n) => [...conteggio.entries()].filter(([, v]) => v.length === n).map(([id]) => id));
}

function apriBallottaggio(partita: Partita, candidati: GiocatoreId[], percorso: "DUE" | "TRE", turno: number, votiPrecedenti: Ballottaggio["votiPrecedenti"]): Evento {
  partita.finale.ballottaggio = { candidati, percorso, turno, votiPrecedenti };
  const ultima = percorso === "TRE" && turno === 3;
  return {
    tipo: "BALLOTTAGGIO",
    candidati,
    turno,
    causa: ultima
      ? `Ultima votazione tra ${elencoNomi(partita, candidati)}: chi ha votato lo stesso nome nelle due votazioni precedenti non può rivotarlo. Se c'è ancora parità, non verrà licenziato nessuno.`
      : turno === 1
        ? `Nessuno ha raccolto più della metà dei nomi: ballottaggio tra ${elencoNomi(partita, candidati)}.`
        : `Parità: si rivota tra ${elencoNomi(partita, candidati)}.`,
  };
}

/** Chiude il giro dei nomi: licenziamento a maggioranza assoluta o ballottaggio. Modifica la copia ricevuta. */
export function chiudiNomina(partita: Partita): Evento[] {
  if (partita.fase.nome !== "NOMINA") return [];
  const giro = partita.fase.giro;
  const { evento, conteggio, votanti } = rivelaEConta(partita, "NOMI", giro, 0);
  const eventi: Evento[] = [evento];
  if (votanti === 0) {
    eventi.push({ tipo: "NESSUN_LICENZIAMENTO", causa: "Nessuno ha fatto un nome: nessun licenziamento." });
    return eventi;
  }
  const gruppi = classifica(conteggio);
  const primo = gruppi[0]!;
  const votiPrimo = conteggio.get(primo[0]!)!.length;
  // Più della metà dei nomi fatti (metà più uno, contata sui votanti).
  if (primo.length === 1 && votiPrimo >= Math.floor(votanti / 2) + 1) {
    eventi.push(licenzia(partita, primo[0]!, giro, conteggio.get(primo[0]!)!, `ha raccolto ${votiPrimo} nomi su ${votanti} e viene licenziato`));
    return eventi;
  }
  // Ballottaggio: il primo e il secondo, con tutti i pari merito.
  const candidati = primo.length > 1 ? primo : [...primo, ...(gruppi[1] ?? [])];
  eventi.push(apriBallottaggio(partita, candidati, candidati.length === 2 ? "DUE" : "TRE", 1, []));
  return eventi;
}

/** Chiude il turno di ballottaggio in corso. Modifica la copia ricevuta. */
export function chiudiBallottaggio(partita: Partita): Evento[] {
  if (partita.fase.nome !== "BALLOTTAGGIO" || !partita.finale.ballottaggio) return [];
  const { giro } = partita.fase;
  const b = partita.finale.ballottaggio;
  const votiTurno = { ...partita.finale.nomine };
  const { evento, conteggio } = rivelaEConta(partita, "BALLOTTAGGIO", giro, b.turno);
  const eventi: Evento[] = [evento];
  delete partita.finale.ballottaggio;

  const voti = (id: GiocatoreId) => conteggio.get(id)?.length ?? 0;
  const massimo = Math.max(...b.candidati.map(voti));
  const inTesta = b.candidati.filter((id) => voti(id) === massimo);
  if (inTesta.length === 1) {
    eventi.push(licenzia(partita, inTesta[0]!, giro, conteggio.get(inTesta[0]!) ?? [], `vince il ballottaggio con ${massimo} voti e viene licenziato`));
    return eventi;
  }
  // Stallo.
  const precedenti = [...b.votiPrecedenti, votiTurno];
  if (b.percorso === "DUE") {
    if (b.turno === 1) {
      eventi.push(apriBallottaggio(partita, b.candidati, "DUE", 2, precedenti));
    } else {
      for (const id of b.candidati) eventi.push(licenzia(partita, id, giro, conteggio.get(id) ?? [], "è licenziato dopo una nuova parità al ballottaggio"));
    }
    return eventi;
  }
  if (b.turno < 3) {
    if (b.turno === 1) {
      eventi.push({
        tipo: "AVVISO_BALLOTTAGGIO",
        causa:
          "Attenzione: se non trovate un accordo, si farà un'ultima votazione in cui chi ha votato lo stesso nome due volte di fila non potrà rivotarlo. Se anche allora ci sarà parità, non verrà licenziato nessuno.",
      });
    }
    eventi.push(apriBallottaggio(partita, inTesta, "TRE", b.turno + 1, precedenti));
    return eventi;
  }
  eventi.push({ tipo: "NESSUN_LICENZIAMENTO", causa: "Ancora parità nell'ultima votazione: come annunciato, non viene licenziato nessuno." });
  return eventi;
}
