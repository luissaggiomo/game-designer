/**
 * Misure degli obiettivi personali (D-050, D-052): cosa conta il computer per ogni traguardo.
 *
 * Ogni misura legge lo stato della partita e restituisce un numero (da confrontare con la soglia)
 * ed eventualmente "violato" (per i traguardi "mai…" / "nessun…").
 *
 * Conoscenza (regola R1 di D-052):
 * - "GIOCATORE": avanzamento mostrato sul telefono durante la partita. Conta solo ciò che il
 *   giocatore può già sapere: niente effetti non ancora rivelati (D-029), niente mittenti anonimi.
 *   Le misure "rinviate" non mostrano nulla ("si verifica a fine partita").
 * - "COMPLETA": verifica finale al punteggio, con tutte le informazioni del server.
 *
 * Regole comuni: contano solo le scelte del giocatore (R2: niente voti scaduti, astensioni, mosse
 * del computer); i voti con peso 0 non esistono (R3).
 */
import type { CopiaSegreto, GiocatoreId, Partita, RegistroVotazione, SceltaMossa } from "./tipi.js";

export type Conoscenza = "GIOCATORE" | "COMPLETA";

export interface ContestoMisura {
  p: Partita;
  id: GiocatoreId;
  conoscenza: Conoscenza;
  parametro?: number;
  trimestri: number;
}

export interface ValoreMisura {
  valore: number;
  /** Il traguardo non può più essere raggiunto (es. "mai bersaglio" dopo esserlo stato). */
  violato?: boolean;
}

interface Misura {
  /** Dipende da informazioni nascoste: durante la partita "si verifica a fine partita" (R1). */
  rinviata?: boolean;
  /** Si considera raggiunta solo a fine partita (traguardi "mai…", "a fine anno", "nessun…"). */
  soloAFine?: boolean;
  calcola: (c: ContestoMisura) => ValoreMisura;
}

// ——— Aiuti ———

const contaSe = <T>(elenco: T[], condizione: (x: T) => boolean): number => elenco.filter(condizione).length;
const conta = (n: number): ValoreMisura => ({ valore: n });

/** Votazioni in cui il giocatore ha espresso SÌ o NO. */
function mieiVoti(c: ContestoMisura): (RegistroVotazione & { mio: "SI" | "NO" })[] {
  return c.p.storicoVotazioni.flatMap((r) => {
    const v = r.voti[c.id];
    return v === "SI" || v === "NO" ? [{ ...r, mio: v }] : [];
  });
}

const comeEsito = (r: RegistroVotazione & { mio: "SI" | "NO" }) => (r.mio === "SI") === r.approvata;

/** I risultati di un trimestre sono noti al giocatore? (D-029: l'ultimo si scopre al punteggio.) */
function trimestreNoto(c: ContestoMisura, trimestre: number): boolean {
  if (c.conoscenza === "COMPLETA") return true;
  const risolto = c.p.storicoTrimestri.some((t) => t.trimestre === trimestre);
  return risolto && !(c.p.risultatiRinviati && trimestre === c.p.trimestre);
}

/** Effetto reale noto: maggiore di zero (positiva), minore (dannosa). Solo proposte approvate. */
const positiva = (c: ContestoMisura, r: RegistroVotazione) => r.approvata && trimestreNoto(c, r.trimestre) && r.effettoAzienda > 0;
const dannosa = (c: ContestoMisura, r: RegistroVotazione) => r.approvata && trimestreNoto(c, r.trimestre) && r.effettoAzienda < 0;

const messaggiRicevuti = (c: ContestoMisura) => c.p.messaggi.filter((m) => m.a === c.id);

/** Mittenti distinti; durante la partita gli anonimi non contano (svelerebbero chi scrive, R1). */
function mittentiDistinti(c: ContestoMisura, elenco: { da: GiocatoreId; anonimo: boolean }[]): number {
  return new Set(elenco.filter((m) => c.conoscenza === "COMPLETA" || !m.anonimo).map((m) => m.da)).size;
}

const copiaDi = (p: Partita, id: string | undefined) => p.copieSegreto.find((x) => x.id === id);
const segretoDi = (p: Partita, copia: CopiaSegreto) => p.segreti.find((s) => s.id === copia.segretoId)!;

/** Copie create dai messaggi del giocatore (ciò che ha inoltrato). */
function copieInoltrate(c: ContestoMisura): CopiaSegreto[] {
  return c.p.messaggi.filter((m) => m.da === c.id && m.copiaSegretoId).flatMap((m) => copiaDi(c.p, m.copiaSegretoId) ?? []);
}

/** Segreti di cui il giocatore è stato la fonte ("dato certo, arrivato al tuo reparto"). */
function segretiComeFonte(c: ContestoMisura): string[] {
  return c.p.copieSegreto.filter((x) => x.possessore === c.id && x.provenienza.tipo === "GIOCO").map((x) => x.segretoId);
}

/** Direttore del reparto utile di un segreto. */
const direttoreUtile = (p: Partita, segretoId: string) => {
  const s = p.segreti.find((x) => x.id === segretoId)!;
  return p.giocatori.find((g) => g.repartoId === s.utile);
};

function mosse(c: ContestoMisura, scelta: SceltaMossa): number {
  return contaSe(c.p.storicoTrimestri, (t) => t.mosseScelte[c.id] === scelta);
}

// ——— Le misure ———

export const MISURE: Record<string, Misura> = {
  // Voti sulle proposte.
  VOTI_CONTRO_ESITO: { calcola: (c) => conta(contaSe(mieiVoti(c), (r) => !comeEsito(r))) },
  VOTI_COME_ESITO: { calcola: (c) => conta(contaSe(mieiVoti(c), comeEsito)) },
  VOTI_DECISIVI: { calcola: (c) => conta(contaSe(c.p.storicoVotazioni, (r) => r.decisivi.includes(c.id))) },
  TRIMESTRI_CON_VOTO_DECISIVO: {
    calcola: (c) => conta(new Set(c.p.storicoVotazioni.filter((r) => r.decisivi.includes(c.id)).map((r) => r.trimestre)).size),
  },
  DECISIVI_PER_RESPINGERE: { calcola: (c) => conta(contaSe(c.p.storicoVotazioni, (r) => r.decisivi.includes(c.id) && !r.approvata)) },
  DECISIVI_PER_APPROVARE_POSITIVE: { calcola: (c) => conta(contaSe(c.p.storicoVotazioni, (r) => r.decisivi.includes(c.id) && positiva(c, r))) },
  NO_PIU_COSTOSA_RESPINTA: {
    calcola: (c) => conta(new Set(mieiVoti(c).filter((r) => r.piuCostosa && r.mio === "NO" && !r.approvata).map((r) => r.trimestre)).size),
  },
  NO_PIU_COSTOSA: { calcola: (c) => conta(new Set(mieiVoti(c).filter((r) => r.piuCostosa && r.mio === "NO").map((r) => r.trimestre)).size) },
  NO_SU_APPROVATE: { calcola: (c) => conta(contaSe(mieiVoti(c), (r) => r.mio === "NO" && r.approvata)) },
  SI_SU_RESPINTE: { calcola: (c) => conta(contaSe(mieiVoti(c), (r) => r.mio === "SI" && !r.approvata)) },
  SI_POSITIVE: { calcola: (c) => conta(contaSe(mieiVoti(c), (r) => r.mio === "SI" && positiva(c, r))) },
  NO_SU_DANNOSE: { calcola: (c) => conta(contaSe(mieiVoti(c), (r) => r.mio === "NO" && dannosa(c, r))) },
  SI_SENZA_DANNOSE: {
    soloAFine: true,
    calcola: (c) => {
      const si = mieiVoti(c).filter((r) => r.mio === "SI" && r.approvata && trimestreNoto(c, r.trimestre));
      return { valore: si.length, violato: si.some((r) => r.effettoAzienda < 0) };
    },
  },
  VOTI_UNICA_VOCE: {
    calcola: (c) =>
      conta(
        contaSe(mieiVoti(c), (r) => {
          const altri = Object.entries(r.voti).filter(([id, v]) => id !== c.id && (v === "SI" || v === "NO"));
          return altri.length >= 2 && altri.every(([, v]) => v !== r.mio);
        }),
      ),
  },
  TRIMESTRE_TUTTO_COME_ESITO: {
    calcola: (c) => {
      const miei = mieiVoti(c);
      const trimestri = new Set(c.p.storicoVotazioni.filter((r) => r.votazioniDelTrimestre === 3).map((r) => r.trimestre));
      const pieni = [...trimestri].filter((t) => {
        const delTrimestre = miei.filter((r) => r.trimestre === t);
        return delTrimestre.length === 3 && delTrimestre.every(comeEsito);
      });
      return conta(pieni.length > 0 ? 1 : 0);
    },
  },

  // Mossa privata (solo le scelte vere: chi non sceglie o è demansionato non conta, R2).
  MOSSE_AZIENDA: { calcola: (c) => conta(mosse(c, "AZIENDA")) },
  TRIMESTRI_NON_IN_CALO: {
    soloAFine: true,
    calcola: (c) => {
      const noti = c.p.storicoTrimestri.filter((t) => trimestreNoto(c, t.trimestre));
      return { valore: contaSe(noti, (t) => t.andamento !== "IN_CALO"), violato: noti.some((t) => t.andamento === "IN_CALO") };
    },
  },
  TRIMESTRI_IN_CRESCITA: {
    calcola: (c) => conta(contaSe(c.p.storicoTrimestri, (t) => trimestreNoto(c, t.trimestre) && t.andamento === "IN_CRESCITA")),
  },

  // Segreti.
  SEGRETI_INOLTRATI: { calcola: (c) => conta(copieInoltrate(c).length) },
  COPIE_MODIFICATE: { calcola: (c) => conta(contaSe(copieInoltrate(c), (x) => x.modificataDalMittente === true)) },
  MITTENTI_SEGRETI_DIVERSI: {
    calcola: (c) =>
      conta(
        mittentiDistinti(
          c,
          c.p.copieSegreto.flatMap((x) => (x.possessore === c.id && x.provenienza.tipo === "GIOCATORE" ? [{ da: x.provenienza.da, anonimo: x.provenienza.anonimo }] : [])),
        ),
      ),
  },
  SEGRETI_POSSEDUTI: {
    soloAFine: true,
    calcola: (c) => conta(new Set(c.p.copieSegreto.filter((x) => x.possessore === c.id && !x.revocata).map((x) => x.segretoId)).size),
  },
  SEGRETI_IN_TEMPO_GRAZIE_A_TE: {
    rinviata: true,
    calcola: (c) =>
      conta(
        contaSe(c.p.segreti, (s) => {
          if (!s.arrivatoInTempo) return false;
          const utile = direttoreUtile(c.p, s.id);
          return c.p.copieSegreto.some((x) => x.segretoId === s.id && x.possessore === utile?.id && !x.falsa && x.catena.includes(c.id));
        }),
      ),
  },
  COPIA_VERA_AL_REPARTO_UTILE: {
    rinviata: true,
    calcola: (c) => conta(contaSe(copieInoltrate(c), (x) => !x.falsa && direttoreUtile(c.p, x.segretoId)?.id === x.possessore)),
  },
  FALSO_USATO_DA_CONCORRENTE: {
    rinviata: true,
    calcola: (c) => conta(contaSe(c.p.segretiPassati, (x) => x.riuscito === false && (copiaDi(c.p, x.copiaId)?.alterataDa ?? []).includes(c.id))),
  },
  FONTE_ARRIVATA_A_GIOCATORI: {
    rinviata: true,
    calcola: (c) => {
      const raggiunti = segretiComeFonte(c).map((sid) => new Set(c.p.copieSegreto.filter((x) => x.segretoId === sid && x.possessore !== c.id).map((x) => x.possessore)).size);
      return conta(Math.max(0, ...raggiunti));
    },
  },
  CATENA_DOPO_DI_TE: {
    rinviata: true,
    calcola: (c) => {
      // Giocatori raggiunti dopo di te: i passaggi successivi più chi possiede la copia.
      const lunghezze = c.p.copieSegreto.filter((x) => x.catena.includes(c.id)).map((x) => x.catena.length - x.catena.indexOf(c.id));
      return conta(Math.max(0, ...lunghezze));
    },
  },
  VERSIONI_DIVERSE_INOLTRATE: {
    calcola: (c) => {
      const perSegreto = new Map<string, Set<string>>();
      for (const x of copieInoltrate(c)) {
        const versioni = perSegreto.get(x.segretoId) ?? new Set<string>();
        versioni.add(JSON.stringify(x.campi));
        perSegreto.set(x.segretoId, versioni);
      }
      return conta(Math.max(0, ...[...perSegreto.values()].map((v) => v.size)));
    },
  },
  VERSIONE_CANARINO_USATA: {
    rinviata: true,
    calcola: (c) => {
      const inoltrate = copieInoltrate(c);
      return conta(
        contaSe(c.p.segretiPassati, (x) => {
          const usata = copiaDi(c.p, x.copiaId);
          if (!usata || !usata.catena.includes(c.id)) return false;
          const mie = new Set(inoltrate.filter((y) => y.segretoId === x.segretoId).map((y) => JSON.stringify(y.campi)));
          return mie.size >= 2 && mie.has(JSON.stringify(usata.campi));
        }),
      );
    },
  },
  FONTE_MAI_AL_CONCORRENTE: {
    rinviata: true,
    soloAFine: true,
    calcola: (c) => {
      const fonti = segretiComeFonte(c);
      return { valore: fonti.length, violato: c.p.segretiPassati.some((x) => fonti.includes(x.segretoId)) };
    },
  },

  // Messaggi (solo "di ricezione" o con un costo vero, D-050).
  MITTENTI_MESSAGGI_DIVERSI: { calcola: (c) => conta(mittentiDistinti(c, messaggiRicevuti(c))) },
  ANONIMI_RICEVUTI: { calcola: (c) => conta(contaSe(messaggiRicevuti(c), (m) => m.anonimo)) },
  PIU_MESSAGGI_RICEVUTI: {
    rinviata: true,
    soloAFine: true,
    calcola: (c) => {
      const ricevuti = (id: GiocatoreId) => contaSe(c.p.messaggi, (m) => m.a === id);
      const mio = ricevuti(c.id);
      return conta(mio > 0 && c.p.giocatori.every((g) => ricevuti(g.id) <= mio) ? 1 : 0);
    },
  },
  TRIMESTRI_CON_ANONIMO_INVIATO: {
    calcola: (c) => conta(new Set(c.p.messaggi.filter((m) => m.da === c.id && m.anonimo).map((m) => m.trimestre)).size),
  },
  TRIMESTRI_CON_DUE_MITTENTI: {
    calcola: (c) => {
      const ricevuti = messaggiRicevuti(c);
      let pieni = 0;
      for (let t = 1; t <= c.trimestri; t++) if (mittentiDistinti(c, ricevuti.filter((m) => m.trimestre === t)) >= 2) pieni++;
      return conta(pieni);
    },
  },

  // Cassa (pubblica).
  TRIMESTRI_CASSA_MINIMA: { calcola: (c) => conta(contaSe(c.p.storicoTrimestri, (t) => t.cassaFine >= (c.parametro ?? 0))) },
  CASSA_FINE_ANNO: {
    calcola: (c) => {
      const ultimo = c.p.storicoTrimestri.find((t) => t.trimestre === c.trimestri);
      return conta(ultimo && ultimo.cassaFine >= (c.parametro ?? 0) ? 1 : 0);
    },
  },
  CASSA_MAI_SOTTO: {
    soloAFine: true,
    calcola: (c) => {
      const sotto = c.p.storicoVotazioni.some((r) => r.cassaDopo < (c.parametro ?? 0));
      return { valore: sotto ? 0 : 1, violato: sotto };
    },
  },

  // Demansionamenti e promozioni (pubblici).
  VOTI_PERSONALI_PROPOSTI: {
    calcola: (c) => conta(contaSe(c.p.storicoVotiPersonali, (v) => v.momento !== "FINALE" && v.proponente === c.id)),
  },
  VOTI_PERSONALI_APPROVATI: {
    calcola: (c) => conta(contaSe(c.p.storicoVotiPersonali, (v) => v.momento !== "FINALE" && v.proponente === c.id && v.approvato)),
  },
};

export const MISURE_NOTE = new Set(Object.keys(MISURE));
