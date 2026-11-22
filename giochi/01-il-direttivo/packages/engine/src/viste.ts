/**
 * Viste filtrate (Architettura §2 "viste filtrate", regola 3 del gioco).
 *
 * Ogni dispositivo riceve SOLO ciò che deve vedere. Lo stato completo della partita non lascia
 * mai il server: da lì si costruiscono una vista per la TV e una per ciascun giocatore.
 *
 * Mai nelle viste: ruoli altrui (salvo licenziati e fine partita), il segnale "falsa" delle copie,
 * la catena dei passaggi, gli effetti privati degli altri reparti, l'effetto sull'azienda prima
 * dei risultati, i voti prima della rivelazione, le mosse private, il mittente dei messaggi anonimi
 * (fino alla lettura finale), lo stato del generatore casuale.
 */
import type { Evento } from "./azioni.js";
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
  ValoreCampo,
  Voto,
} from "./tipi.js";

export type Destinatario = { tipo: "TV" } | { tipo: "GIOCATORE"; id: GiocatoreId };

export interface GiocatorePubblico {
  id: GiocatoreId;
  nome: string;
  repartoId: RepartoId;
  stato: "ATTIVO" | "DEMANSIONATO" | "LICENZIATO";
  pauseCaffe: number;
  /** Solo per i licenziati (ruolo rivelato) e dal punteggio in poi. */
  fazione?: Fazione;
}

export interface PropostaPubblica {
  id: string;
  titolo: string;
  categoria: string;
  costo: number;
  astensioneAmmessa: boolean;
  /** I pesi sono sempre visibili in TV prima del voto (GDD §8.3). */
  pesi: Partial<Record<RepartoId, Peso>>;
  /** Chi ha già votato (non cosa), finché la votazione è aperta (D-019). */
  hannoVotato: GiocatoreId[];
  /** Dopo la chiusura: voti rivelati ed esito. */
  voti?: Partial<Record<GiocatoreId, Voto>>;
  esito?: { approvata: boolean; si: number; soglia: number; motivo: string };
}

export interface VotoPersonalePubblico {
  tipo: "PROMOZIONE" | "DEMANSIONAMENTO";
  bersaglio: GiocatoreId;
  proponente: GiocatoreId;
  hannoVotato: GiocatoreId[];
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
  votoPersonale?: VotoPersonalePubblico;
  votiPersonaliChiusi: {
    tipo: "PROMOZIONE" | "DEMANSIONAMENTO";
    bersaglio: GiocatoreId;
    proponente: GiocatoreId;
    approvato: boolean;
    voti: Partial<Record<GiocatoreId, "SI" | "NO">>;
  }[];
  finale: {
    hannoRisposto: GiocatoreId[];
    hannoNominato: GiocatoreId[];
    ballottaggio: GiocatoreId[];
    esitiVerifica: { giro: number; tuttiSi: boolean; votiNo: GiocatoreId[] }[];
    licenziamenti: { giocatore: GiocatoreId; giro: number; nominatoDa: GiocatoreId[] }[];
  };
  /** Dal punteggio in poi. */
  punteggi?: Partial<Record<GiocatoreId, Punteggio>>;
  /** Solo nella lettura finale dei messaggi (GDD §10.1, §15.3). */
  letturaMessaggi?: MessaggioLetturaFinale[];
}

export type VistaTV = VistaComune & { tipo: "TV" };

export interface CopiaVisibile {
  id: string;
  titolo: string;
  /** I campi della PROPRIA copia: chi la riceve non sa se è vera (GDD §11.4). */
  campi: Record<string, ValoreCampo>;
  /** D-015: "dato ufficiale del tuo reparto", oppure solo il mittente diretto (nascosto se anonimo). */
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
    votoPersonale?: "SI" | "NO";
    verifica?: boolean;
    nomina?: GiocatoreId;
  };
  mieiSegreti: CopiaVisibile[];
  mieiMessaggi: MessaggioVisibile[];
  /** Solo per le spie: i segreti che ho consegnato. */
  segretiConsegnati: { copiaId: string; trimestre: number; riuscito?: boolean }[];
}

const FASI_FINE = new Set(["PUNTEGGIO", "LETTURA_MESSAGGI", "FINE"]);

function vistaComune(p: Partita): VistaComune {
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
        astensioneAmmessa: x.astensioneAmmessa,
        pesi: { ...x.pesi },
        hannoVotato: x.id === votazioneAperta ? Object.keys(x.voti) : [],
        ...(chiusa ? { voti: { ...x.voti } } : {}),
        ...(chiusa ? { esito: { approvata: x.esito!.approvata, si: x.esito!.si, soglia: x.esito!.soglia, motivo: x.esito!.motivo } } : {}),
      };
    }),
    hannoSceltoLaMossa: p.fase.nome === "MOSSA_PRIVATA" ? Object.keys(p.mossePrivate) : [],
    votiPersonaliChiusi: p.storicoVotiPersonali.map((v) => ({
      tipo: v.tipo,
      bersaglio: v.bersaglio,
      proponente: v.proponente,
      approvato: v.approvato,
      voti: { ...v.voti },
    })),
    finale: {
      hannoRisposto: p.fase.nome === "VERIFICA" ? Object.keys(p.finale.verifica) : [],
      hannoNominato: p.fase.nome === "NOMINA" ? Object.keys(p.finale.nomine) : [],
      ballottaggio: [...p.finale.ballottaggio],
      esitiVerifica: p.finale.esitiVerifica.map((e) => ({ giro: e.giro, tuttiSi: e.tuttiSi, votiNo: [...e.votiNo] })),
      licenziamenti: p.finale.licenziamenti.map((l) => ({ giocatore: l.giocatore, giro: l.giro, nominatoDa: [...l.nominatoDa] })),
    },
  };
  if (p.votoPersonale) {
    comune.votoPersonale = {
      tipo: p.votoPersonale.tipo,
      bersaglio: p.votoPersonale.bersaglio,
      proponente: p.votoPersonale.proponente,
      hannoVotato: Object.keys(p.votoPersonale.voti),
    };
  }
  if (rivelaTutti && p.punteggi) comune.punteggi = structuredClone(p.punteggi);
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

export function vistaTV(p: Partita): VistaTV {
  return { tipo: "TV", ...vistaComune(p) };
}

export function vistaGiocatore(p: Partita, id: GiocatoreId): VistaGiocatore {
  const io = p.giocatori.find((g) => g.id === id);
  if (!io) throw new Error(`Giocatore sconosciuto: ${id}`);
  const comune = vistaComune(p);

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
  const votoPers = p.votoPersonale?.voti[io.id];
  if (votoPers) mieiVoti.votoPersonale = votoPers;
  const verifica = p.fase.nome === "VERIFICA" ? p.finale.verifica[io.id] : undefined;
  if (verifica !== undefined) mieiVoti.verifica = verifica;
  const nomina = p.fase.nome === "NOMINA" ? p.finale.nomine[io.id] : undefined;
  if (nomina) mieiVoti.nomina = nomina;

  const mieiSegreti: CopiaVisibile[] = p.copieSegreto
    .filter((c) => c.possessore === io.id && !c.revocata)
    .map((c) => {
      const s = p.segreti.find((x) => x.id === c.segretoId)!;
      const provenienza: CopiaVisibile["provenienza"] =
        c.provenienza.tipo === "GIOCO"
          ? { tipo: "GIOCO" }
          : c.provenienza.anonimo
            ? { tipo: "GIOCATORE", anonimo: true }
            : { tipo: "GIOCATORE", da: c.provenienza.da, anonimo: false };
      return { id: c.id, titolo: s.titolo, campi: { ...c.campi }, provenienza, utileA: s.utile, trimestre: s.trimestre };
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
    segretiConsegnati: p.segretiPassati
      .filter((x) => x.spia === io.id)
      .map((x) => {
        // L'esito di un segreto dell'ultimo trimestre si scopre con gli altri risultati (D-029).
        const nascosto = p.risultatiRinviati !== undefined && x.trimestre === p.trimestre;
        return { copiaId: x.copiaId, trimestre: x.trimestre, ...(x.riuscito !== undefined && !nascosto ? { riuscito: x.riuscito } : {}) };
      }),
  };
}

export function vista(p: Partita, destinatario: Destinatario): VistaTV | VistaGiocatore {
  return destinatario.tipo === "TV" ? vistaTV(p) : vistaGiocatore(p, destinatario.id);
}

/** Gli eventi che un destinatario può ricevere: i riservati solo ai diretti interessati. */
export function eventiPer(eventi: Evento[], destinatario: Destinatario): Evento[] {
  return eventi.filter((e) => !e.riservatoA || (destinatario.tipo === "GIOCATORE" && e.riservatoA.includes(destinatario.id)));
}
