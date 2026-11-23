/**
 * Viste filtrate (Architettura §2 "viste filtrate", regola 3 del gioco).
 *
 * Ogni dispositivo riceve SOLO ciò che deve vedere. Lo stato completo della partita non lascia
 * mai il server: da lì si costruiscono una vista per la TV e una per ciascun giocatore.
 *
 * Mai nelle viste: ruoli altrui (salvo licenziati e fine partita), il segnale "falsa" delle copie,
 * la catena dei passaggi, gli effetti privati degli altri reparti, l'effetto sull'azienda prima
 * dei risultati, i voti prima della rivelazione, le mosse private, il mittente dei messaggi anonimi
 * (fino alla lettura finale), lo stato del generatore casuale, gli obiettivi personali altrui
 * (fino al punteggio, e mai quelli scartati: D-047).
 */
import type { Evento } from "./azioni.js";
import type { Ambiente } from "./contenuti.js";
import { nomeBloccato, votantiBallottaggio } from "./finale.js";
import { modello, testoTraguardo, valutaObiettivo, type StatoTraguardo } from "./obiettivi.js";
import type {
  Fase,
  Fazione,
  GiocatoreId,
  Messaggio,
  ModelloMessaggio,
  Partita,
  Peso,
  Punteggio,
  RepartoId,
  SceltaMossa,
  TipoSegreto,
  ValoreCampo,
  Voto,
} from "./tipi.js";

export type Destinatario = { tipo: "TV" } | { tipo: "GIOCATORE"; id: GiocatoreId };

export interface GiocatorePubblico {
  id: GiocatoreId;
  nome: string;
  repartoId: RepartoId;
  stato: "ATTIVO" | "LICENZIATO";
  pauseCaffe: number;
  /** Solo per i licenziati (ruolo rivelato) e dal punteggio in poi. */
  fazione?: Fazione;
}

export interface PropostaPubblica {
  id: string;
  titolo: string;
  categoria: string;
  costo: number;
  /** I pesi sono sempre visibili in TV prima del voto (GDD §8.3). */
  pesi: Partial<Record<RepartoId, Peso>>;
  /** Chi ha già votato (non cosa), finché la votazione è aperta (D-019). */
  hannoVotato: GiocatoreId[];
  /** Dopo la chiusura: voti rivelati ed esito. */
  voti?: Partial<Record<GiocatoreId, Voto>>;
  esito?: { approvata: boolean; si: number; soglia: number; motivo: string };
}

export interface MessaggioLetturaFinale {
  id: string;
  trimestre: number;
  da: GiocatoreId;
  a: GiocatoreId;
  anonimo: boolean;
  modello: ModelloMessaggio;
  testo?: string;
  segreto?: { titolo: string; campi: Record<string, ValoreCampo>; falso: boolean };
}

export interface VistaComune {
  fase: Fase;
  trimestre: number;
  giocatori: GiocatorePubblico[];
  reparti: { id: RepartoId; occupatoDa?: GiocatoreId; autogestione: boolean }[];
  azienda: { quota: number; cassa: number };
  concorrenti: { id: string; nome: string; quota: number }[];
  ordineDelGiorno: PropostaPubblica[];
  /** Durante la mossa privata: chi ha già scelto (non cosa). */
  hannoSceltoLaMossa: GiocatoreId[];
  /** Finale "Rinnovo dei contratti" (D-058): i voti si vedono solo dopo la chiusura. */
  finale: {
    /** Durante la domanda: chi ha già risposto (non cosa). */
    hannoRisposto: GiocatoreId[];
    /** Durante nomi e ballottaggi: chi ha già votato (non chi). */
    hannoVotato: GiocatoreId[];
    ballottaggio?: { candidati: GiocatoreId[]; percorso: "DUE" | "TRE"; turno: number; votanti: GiocatoreId[] };
    esitiDomanda: { giro: number; si: GiocatoreId[]; no: GiocatoreId[]; procede: boolean }[];
    votazioni: { giro: number; tipo: "NOMI" | "BALLOTTAGGIO"; turno: number; voti: { da: GiocatoreId; per: GiocatoreId }[] }[];
    licenziamenti: { giocatore: GiocatoreId; giro: number; votatoDa: GiocatoreId[] }[];
  };
  /** Dal punteggio in poi. */
  punteggi?: Partial<Record<GiocatoreId, Punteggio>>;
  /** Dal punteggio in poi: l'obiettivo scelto da ognuno e com'è andato (D-047). */
  obiettivi?: Partial<Record<GiocatoreId, ObiettivoRivelato>>;
  /** Solo nella lettura finale dei messaggi (GDD §10.1, §15.3). */
  letturaMessaggi?: MessaggioLetturaFinale[];
}

/** Obiettivo personale come lo vede il suo proprietario (D-047). */
export interface ObiettivoVisibile {
  id: string;
  nome: string;
  tipo: number;
  traguardi: {
    testo: string;
    punti: number;
    /** Dopo la scelta: stato e avanzamento ("si verifica a fine partita" = A_FINE_PARTITA, D-052 R1). */
    stato?: StatoTraguardo;
    valore?: number;
    soglia?: number;
  }[];
}

/** Rivelazione finale in TV dell'obiettivo scelto da ognuno (D-047): mai gli scartati. */
export interface ObiettivoRivelato {
  nome: string;
  tipo: number;
  sceltoACaso: boolean;
  traguardi: { testo: string; punti: number; raggiunto: boolean }[];
}

export type VistaTV = VistaComune & { tipo: "TV" };

export interface CopiaVisibile {
  id: string;
  titolo: string;
  /** I campi della PROPRIA copia: chi la riceve non sa se è vera (GDD §11.4). */
  campi: Record<string, ValoreCampo>;
  /** Tipo "a bilancia", scritto a parole sulla scheda (D-038); i numeri non si mostrano. */
  tipo: TipoSegreto;
  /**
   * Valori suggeriti per ogni campo, per chi vuole inoltrare una copia modificata (D-036): i valori
   * possibili più quello della propria copia, in ordine alfabetico, così l'elenco non indica quale
   * sia il vero.
   */
  valoriSuggeriti: Record<string, ValoreCampo[]>;
  /** D-015, D-035: "dato certo, arrivato al tuo reparto", oppure solo il mittente diretto (nascosto se anonimo). */
  provenienza: { tipo: "GIOCO" } | { tipo: "GIOCATORE"; da?: GiocatoreId; anonimo: boolean };
  /** Il reparto a cui il dato serve (GDD §11.2: vale solo se arriva al reparto giusto). */
  utileA: RepartoId;
  trimestre: number;
}

export interface MessaggioVisibile {
  id: string;
  trimestre: number;
  /** Assente nei messaggi anonimi ricevuti. */
  da?: GiocatoreId;
  a: GiocatoreId;
  anonimo: boolean;
  modello: ModelloMessaggio;
  testo?: string;
  copiaSegretoId?: string;
}

export interface VistaGiocatore extends VistaComune {
  tipo: "GIOCATORE";
  io: {
    id: GiocatoreId;
    repartoId: RepartoId;
    fazione: Fazione;
    /** Solo per le spie: le altre spie dello stesso concorrente (GDD §4.3). */
    alleati: GiocatoreId[];
    puntiReparto: number;
    quotaMessaggi: number;
  };
  /** Effetto di ogni proposta del trimestre sul MIO reparto (GDD §8.2). */
  mieiEffetti: Record<string, { punti?: number; testo: string }>;
  mieiVoti: {
    proposta?: Voto;
    mossaPrivata?: SceltaMossa;
    /** Finale: la mia risposta alla domanda "C'è una spia?" (finché è aperta). */
    domanda?: "SI" | "NO";
    /** Finale: il mio nome o voto di ballottaggio (finché è aperto). */
    nomina?: GiocatoreId;
    /** Finale, ultima votazione del percorso a tre: il nome che non posso più votare (D-058). */
    nomeBloccato?: GiocatoreId;
  };
  mieiSegreti: CopiaVisibile[];
  mieiMessaggi: MessaggioVisibile[];
  /** Solo per le spie: i segreti che ho consegnato. */
  segretiConsegnati: { copiaId: string; trimestre: number; riuscito?: boolean }[];
  /** Il MIO obiettivo personale: le tre proposte durante la scelta, poi solo quello scelto (D-047, D-048). */
  obiettivo: {
    proposte?: ObiettivoVisibile[];
    scelto?: ObiettivoVisibile;
    sceltoACaso?: boolean;
  };
}

const FASI_FINE = new Set(["PUNTEGGIO", "LETTURA_MESSAGGI", "FINE"]);

function vistaComune(p: Partita, ambiente: Ambiente): VistaComune {
  const rivelaTutti = FASI_FINE.has(p.fase.nome);
  const votazioneAperta = p.fase.nome === "VOTAZIONE" ? p.proposteTrimestre[p.fase.votazione - 1]?.id : undefined;

  const comune: VistaComune = {
    fase: structuredClone(p.fase),
    trimestre: p.trimestre,
    giocatori: p.giocatori.map((g) => ({
      id: g.id,
      nome: g.nome,
      repartoId: g.repartoId,
      stato: g.stato,
      pauseCaffe: g.pauseCaffe,
      ...(rivelaTutti || g.stato === "LICENZIATO" ? { fazione: structuredClone(g.fazione) } : {}),
    })),
    reparti: p.reparti.map((r) => ({ id: r.id, ...(r.occupatoDa ? { occupatoDa: r.occupatoDa } : {}), autogestione: r.autogestione })),
    // Fino al punteggio le quote dell'ultimo trimestre restano nascoste (D-029).
    azienda: { ...p.azienda, ...(p.risultatiRinviati ? { quota: p.risultatiRinviati.quote.azienda } : {}) },
    concorrenti: p.concorrenti.map((c) => ({ id: c.id, nome: c.nome, quota: p.risultatiRinviati ? p.risultatiRinviati.quote.concorrenti[c.id]! : c.quota })),
    ordineDelGiorno: p.proposteTrimestre.map((x) => {
      const chiusa = x.esito !== undefined;
      return {
        id: x.id,
        titolo: x.titolo,
        categoria: x.categoria,
        costo: x.costo,
        pesi: { ...x.pesi },
        hannoVotato: x.id === votazioneAperta ? Object.keys(x.voti) : [],
        ...(chiusa ? { voti: { ...x.voti } } : {}),
        ...(chiusa ? { esito: { approvata: x.esito!.approvata, si: x.esito!.si, soglia: x.esito!.soglia, motivo: x.esito!.motivo } } : {}),
      };
    }),
    hannoSceltoLaMossa: p.fase.nome === "MOSSA_PRIVATA" ? Object.keys(p.mossePrivate) : [],
    finale: {
      hannoRisposto: p.fase.nome === "DOMANDA" ? Object.keys(p.finale.risposte) : [],
      hannoVotato: p.fase.nome === "NOMINA" || p.fase.nome === "BALLOTTAGGIO" ? Object.keys(p.finale.nomine) : [],
      ...(p.finale.ballottaggio
        ? {
            ballottaggio: {
              candidati: [...p.finale.ballottaggio.candidati],
              percorso: p.finale.ballottaggio.percorso,
              turno: p.finale.ballottaggio.turno,
              votanti: votantiBallottaggio(p, p.finale.ballottaggio),
            },
          }
        : {}),
      esitiDomanda: p.finale.esitiDomanda.map((e) => ({ giro: e.giro, si: [...e.si], no: [...e.no], procede: e.procede })),
      votazioni: p.finale.votazioni.map((v) => ({ giro: v.giro, tipo: v.tipo, turno: v.turno, voti: v.voti.map((x) => ({ ...x })) })),
      licenziamenti: p.finale.licenziamenti.map((l) => ({ giocatore: l.giocatore, giro: l.giro, votatoDa: [...l.votatoDa] })),
    },
  };
  if (rivelaTutti && p.punteggi) comune.punteggi = structuredClone(p.punteggi);
  if (rivelaTutti) comune.obiettivi = obiettiviRivelati(p, ambiente);
  if (p.fase.nome === "LETTURA_MESSAGGI" || p.fase.nome === "FINE") comune.letturaMessaggi = p.messaggi.map((m) => letturaFinale(p, m));
  return comune;
}

function letturaFinale(p: Partita, m: Messaggio): MessaggioLetturaFinale {
  const copia = m.copiaSegretoId ? p.copieSegreto.find((c) => c.id === m.copiaSegretoId) : undefined;
  const segreto = copia ? p.segreti.find((s) => s.id === copia.segretoId) : undefined;
  return {
    id: m.id,
    trimestre: m.trimestre,
    da: m.da,
    a: m.a,
    anonimo: m.anonimo,
    modello: m.modello,
    ...(m.testo !== undefined ? { testo: m.testo } : {}),
    ...(copia && segreto ? { segreto: { titolo: segreto.titolo, campi: { ...copia.campi }, falso: copia.falsa } } : {}),
  };
}

function obiettiviRivelati(p: Partita, ambiente: Ambiente): Partial<Record<GiocatoreId, ObiettivoRivelato>> {
  const rivelati: Partial<Record<GiocatoreId, ObiettivoRivelato>> = {};
  for (const g of p.giocatori) {
    const o = p.obiettivi[g.id];
    if (!o?.scelto) continue;
    const m = modello(ambiente, o.scelto);
    rivelati[g.id] = {
      nome: m.nome,
      tipo: m.tipo,
      sceltoACaso: o.sceltoACaso === true,
      traguardi: valutaObiettivo(p, ambiente, g.id, "COMPLETA").map((t) => ({ testo: t.testo, punti: t.punti, raggiunto: t.stato === "RAGGIUNTO" })),
    };
  }
  return rivelati;
}

/** Il mio obiettivo: durante la scelta le tre proposte; poi solo lo scelto, con l'avanzamento. */
function mioObiettivo(p: Partita, ambiente: Ambiente, id: GiocatoreId): VistaGiocatore["obiettivo"] {
  const o = p.obiettivi[id];
  if (!o) return {};
  const punti = (tipo: number) => ambiente.config.obiettivi.punti[String(tipo)]!;
  const semplice = (oid: string): ObiettivoVisibile => {
    const m = modello(ambiente, oid);
    return { id: m.id, nome: m.nome, tipo: m.tipo, traguardi: m.traguardi.map((t, i) => ({ testo: testoTraguardo(t, p, ambiente), punti: punti(m.tipo)[i]! })) };
  };
  if (p.fase.nome === "SCELTA_OBIETTIVI") {
    return { proposte: o.proposti.map(semplice), ...(o.scelto ? { scelto: semplice(o.scelto) } : {}) };
  }
  if (!o.scelto) return {};
  const conoscenza = FASI_FINE.has(p.fase.nome) ? "COMPLETA" : "GIOCATORE";
  const scelto = semplice(o.scelto);
  scelto.traguardi = valutaObiettivo(p, ambiente, id, conoscenza).map((t) => ({
    testo: t.testo,
    punti: t.punti,
    stato: t.stato,
    soglia: t.soglia,
    ...(t.valore !== undefined ? { valore: t.valore } : {}),
  }));
  return { scelto, ...(o.sceltoACaso ? { sceltoACaso: true } : {}) };
}

export function vistaTV(p: Partita, ambiente: Ambiente): VistaTV {
  return { tipo: "TV", ...vistaComune(p, ambiente) };
}

export function vistaGiocatore(p: Partita, id: GiocatoreId, ambiente: Ambiente): VistaGiocatore {
  const io = p.giocatori.find((g) => g.id === id);
  if (!io) throw new Error(`Giocatore sconosciuto: ${id}`);
  const comune = vistaComune(p, ambiente);

  const alleati =
    io.fazione.tipo === "SPIA"
      ? p.giocatori
          .filter((g) => g.id !== io.id && g.fazione.tipo === "SPIA" && io.fazione.tipo === "SPIA" && g.fazione.concorrente === io.fazione.concorrente)
          .map((g) => g.id)
      : [];

  const mieiEffetti: VistaGiocatore["mieiEffetti"] = {};
  for (const x of p.proposteTrimestre) {
    const e = x.effettiPrivati[io.repartoId];
    if (e) mieiEffetti[x.id] = { ...(e.punti !== undefined ? { punti: e.punti } : {}), testo: e.testo };
  }

  const inVotazione = p.fase.nome === "VOTAZIONE" ? p.proposteTrimestre[p.fase.votazione - 1] : undefined;
  const mieiVoti: VistaGiocatore["mieiVoti"] = {};
  const votoProposta = inVotazione?.voti[io.id];
  if (votoProposta) mieiVoti.proposta = votoProposta;
  const mossa = p.mossePrivate[io.id];
  if (mossa) mieiVoti.mossaPrivata = mossa;
  const risposta = p.fase.nome === "DOMANDA" ? p.finale.risposte[io.id] : undefined;
  if (risposta !== undefined) mieiVoti.domanda = risposta ? "SI" : "NO";
  const nomina = p.fase.nome === "NOMINA" || p.fase.nome === "BALLOTTAGGIO" ? p.finale.nomine[io.id] : undefined;
  if (nomina) mieiVoti.nomina = nomina;
  const bloccato = p.fase.nome === "BALLOTTAGGIO" ? nomeBloccato(p.finale.ballottaggio, io.id) : undefined;
  if (bloccato) mieiVoti.nomeBloccato = bloccato;

  const mieiSegreti: CopiaVisibile[] = p.copieSegreto
    .filter((c) => c.possessore === io.id)
    .map((c) => {
      const s = p.segreti.find((x) => x.id === c.segretoId)!;
      const provenienza: CopiaVisibile["provenienza"] =
        c.provenienza.tipo === "GIOCO"
          ? { tipo: "GIOCO" }
          : c.provenienza.anonimo
            ? { tipo: "GIOCATORE", anonimo: true }
            : { tipo: "GIOCATORE", da: c.provenienza.da, anonimo: false };
      const valoriSuggeriti: Record<string, ValoreCampo[]> = {};
      for (const [nome, valori] of Object.entries(s.valoriPossibili)) {
        valoriSuggeriti[nome] = [...new Set([...valori, c.campi[nome]!])].sort((a, b) => String(a).localeCompare(String(b), "it", { numeric: true }));
      }
      return { id: c.id, titolo: s.titolo, tipo: s.tipo, campi: { ...c.campi }, valoriSuggeriti, provenienza, utileA: s.utile, trimestre: s.trimestre };
    });

  const mieiMessaggi: MessaggioVisibile[] = p.messaggi
    .filter((m) => m.da === io.id || m.a === io.id)
    .map((m) => {
      const nascondiMittente = m.anonimo && m.da !== io.id;
      return {
        id: m.id,
        trimestre: m.trimestre,
        ...(nascondiMittente ? {} : { da: m.da }),
        a: m.a,
        anonimo: m.anonimo,
        modello: m.modello,
        ...(m.testo !== undefined ? { testo: m.testo } : {}),
        // Il destinatario vede la copia ricevuta; il mittente non riceve la copia altrui.
        ...(m.copiaSegretoId && m.a === io.id ? { copiaSegretoId: m.copiaSegretoId } : {}),
      };
    });

  return {
    ...comune,
    tipo: "GIOCATORE",
    io: {
      id: io.id,
      repartoId: io.repartoId,
      fazione: structuredClone(io.fazione),
      alleati,
      puntiReparto: io.puntiReparto,
      quotaMessaggi: io.quotaMessaggi,
    },
    mieiEffetti,
    mieiVoti,
    mieiSegreti,
    mieiMessaggi,
    obiettivo: mioObiettivo(p, ambiente, io.id),
    segretiConsegnati: p.segretiPassati
      .filter((x) => x.spia === io.id)
      .map((x) => {
        // L'esito di un segreto dell'ultimo trimestre si scopre con gli altri risultati (D-029).
        const nascosto = p.risultatiRinviati !== undefined && x.trimestre === p.trimestre;
        return { copiaId: x.copiaId, trimestre: x.trimestre, ...(x.riuscito !== undefined && !nascosto ? { riuscito: x.riuscito } : {}) };
      }),
  };
}

export function vista(p: Partita, destinatario: Destinatario, ambiente: Ambiente): VistaTV | VistaGiocatore {
  return destinatario.tipo === "TV" ? vistaTV(p, ambiente) : vistaGiocatore(p, destinatario.id, ambiente);
}

/** Gli eventi che un destinatario può ricevere: i riservati solo ai diretti interessati. */
export function eventiPer(eventi: Evento[], destinatario: Destinatario): Evento[] {
  return eventi.filter((e) => !e.riservatoA || (destinatario.tipo === "GIOCATORE" && e.riservatoA.includes(destinatario.id)));
}
