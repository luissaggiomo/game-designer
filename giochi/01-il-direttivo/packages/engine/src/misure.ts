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
 * Regole comuni: contano solo le scelte del giocatore (R2: niente voti scaduti né scelte
 * predefinite).
 *
 * Voto del pacchetto (D-068, D-076): "il tuo pacchetto" è quello che hai scelto al primo voto;
 * "passa" = è il pacchetto approvato (al primo voto, come principale o come alternativa);
 * "positivo" / "dannoso" = somma degli effetti sull'azienda delle sue proposte maggiore / minore
 * di zero, noto ai Risultati del trimestre (il 4° al punteggio, D-029). I voti sono pubblici dopo
 * la chiusura (D-019), quindi l'avanzamento si vede subito.
 */
import type { CopiaSegreto, GiocatoreId, Partita, RegistroPacchetto, SceltaMossa } from "./tipi.js";

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

/** Il pacchetto scelto dal giocatore al primo voto di un trimestre (se ha votato). */
const mioPrimo = (c: ContestoMisura, r: RegistroPacchetto) => r.primiVoti[c.id];
/** Il tuo pacchetto è passato. */
const mioPassato = (c: ContestoMisura, r: RegistroPacchetto) => mioPrimo(c, r) === r.approvato;

/** I risultati di un trimestre sono noti al giocatore? (D-029: l'ultimo si scopre al punteggio.) */
function trimestreNoto(c: ContestoMisura, trimestre: number): boolean {
  if (c.conoscenza === "COMPLETA") return true;
  const risolto = c.p.storicoTrimestri.some((t) => t.trimestre === trimestre);
  return risolto && !(c.p.risultatiRinviati && trimestre === c.p.trimestre);
}

/** Effetto del pacchetto approvato, se già noto al giocatore (undefined = non ancora noto). */
const effettoApprovato = (c: ContestoMisura, r: RegistroPacchetto) => (trimestreNoto(c, r.trimestre) ? r.pacchetti[r.approvato]!.effettoAzienda : undefined);

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
  // Voto del pacchetto (D-076).
  PRIMO_VOTO_DIVERSO_DA_APPROVATO: { calcola: (c) => conta(contaSe(c.p.storicoPacchetti, (r) => mioPrimo(c, r) !== undefined && !mioPassato(c, r))) },
  PRIMO_VOTO_COME_APPROVATO: { calcola: (c) => conta(contaSe(c.p.storicoPacchetti, (r) => mioPassato(c, r))) },
  APPROVATO_AL_PRIMO_VOTO: { calcola: (c) => conta(contaSe(c.p.storicoPacchetti, (r) => r.esito === "PRIMO_VOTO" && mioPassato(c, r))) },
  VOTI_DECISIVI: { calcola: (c) => conta(contaSe(c.p.storicoPacchetti, (r) => r.decisivi.includes(c.id))) },
  PACCHETTO_SENZA_PIU_CARA: {
    calcola: (c) => conta(contaSe(c.p.storicoPacchetti, (r) => mioPrimo(c, r) !== undefined && !r.pacchetti[mioPrimo(c, r)!]!.conPiuCara)),
  },
  PACCHETTO_SENZA_PIU_CARA_APPROVATO: {
    calcola: (c) => conta(contaSe(c.p.storicoPacchetti, (r) => mioPassato(c, r) && !r.pacchetti[r.approvato]!.conPiuCara)),
  },
  PACCHETTO_APPROVATO_POSITIVO: { calcola: (c) => conta(contaSe(c.p.storicoPacchetti, (r) => mioPassato(c, r) && (effettoApprovato(c, r) ?? 0) > 0)) },
  PACCHETTI_APPROVATI_SENZA_DANNOSI: {
    soloAFine: true,
    calcola: (c) => {
      const miei = c.p.storicoPacchetti.filter((r) => mioPassato(c, r) && effettoApprovato(c, r) !== undefined);
      return { valore: miei.length, violato: miei.some((r) => effettoApprovato(c, r)! < 0) };
    },
  },
  UNICO_SUL_PACCHETTO: {
    calcola: (c) =>
      conta(
        contaSe(c.p.storicoPacchetti, (r) => {
          const mio = mioPrimo(c, r);
          const altri = Object.entries(r.primiVoti).filter(([id]) => id !== c.id);
          return mio !== undefined && altri.length >= 2 && altri.every(([, pk]) => pk !== mio);
        }),
      ),
  },
  NO_AL_PRINCIPALE: { calcola: (c) => conta(contaSe(c.p.storicoPacchetti, (r) => r.secondiVoti[c.id] === "NO")) },
  NO_DECISIVO_PER_ALTERNATIVA: { calcola: (c) => conta(contaSe(c.p.storicoPacchetti, (r) => r.esito === "ALTERNATIVA" && r.decisivi.includes(c.id))) },
  SI_PRINCIPALE_RESPINTO: { calcola: (c) => conta(contaSe(c.p.storicoPacchetti, (r) => r.secondiVoti[c.id] === "SI" && r.esito === "ALTERNATIVA")) },
  SECONDO_VOTO_CONTRO_ESITO: {
    calcola: (c) =>
      conta(contaSe(c.p.storicoPacchetti, (r) => (r.secondiVoti[c.id] === "SI" && r.esito === "ALTERNATIVA") || (r.secondiVoti[c.id] === "NO" && r.esito === "PRINCIPALE"))),
  },
  NO_PRINCIPALE_APPROVATO: { calcola: (c) => conta(contaSe(c.p.storicoPacchetti, (r) => r.secondiVoti[c.id] === "NO" && r.esito === "PRINCIPALE")) },

  // Mossa privata (solo le scelte vere: chi non sceglie non conta, R2).
  MOSSE_AZIENDA: { calcola: (c) => conta(mosse(c, "AZIENDA")) },
  // Conteggio pubblico "3 su 5 per l'azienda" (D-061), annunciato anche nel 4° trimestre.
  TRIMESTRI_META_AZIENDA: {
    soloAFine: true,
    calcola: (c) => {
      const t = c.p.storicoTrimestri;
      return { valore: contaSe(t, (x) => 2 * x.perAzienda >= x.partecipanti), violato: t.some((x) => 2 * x.perAzienda < x.partecipanti) };
    },
  },
  TRIMESTRI_MAGGIORANZA_AZIENDA: {
    calcola: (c) => conta(contaSe(c.p.storicoTrimestri, (x) => 2 * x.perAzienda > x.partecipanti)),
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
    calcola: (c) => conta(new Set(c.p.copieSegreto.filter((x) => x.possessore === c.id).map((x) => x.segretoId)).size),
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

};

export const MISURE_NOTE = new Set(Object.keys(MISURE));
