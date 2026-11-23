/**
 * Segreti e messaggi privati (GDD §10, §11 · Architettura §10.5 · D-015, D-072, D-073, D-074).
 *
 * - Distribuzione nel Rapporto, dal 1° all'ultimo trimestre con segreti (il 4° no, D-072): escono due
 *   segreti dello STESSO tipo, uno vero e uno finto (D-074). Fonte e destinatario (reparto utile) si
 *   scelgono tra i membri del direttivo, equilibrando quante volte ognuno è coinvolto; la spia sta al
 *   massimo in un segreto per trimestre, e quel segreto è sempre il finto. Se nessuna spia è coinvolta,
 *   il finto si estrae a caso. Nessuno vede quale sia il finto (la spia lo sa per i propri).
 * - Il dato vero si estrae campo per campo tra i valori possibili (D-036, D-037).
 * - Annuncio pubblico (D-061): la TV dice quale informazione serve e a quale reparto, mai chi l'ha.
 * - Catena minima (D-073): un segreto arriva al reparto utile solo dopo essere passato da almeno
 *   X colleghi diversi (X dipende dal numero di giocatori); non si inoltra a chi ne ha già una copia.
 * - Scadenza (D-072): fine del trimestre successivo, per il reparto utile e per il concorrente.
 *   Il valore per l'azienda si conta alla scadenza: vale se il reparto utile ha una copia VERA e il
 *   segreto non è il finto. La TV annuncia ogni arrivo a destinazione, di qualunque versione (D-074).
 * - Al concorrente: un dato vero gli dà il suo valore; un dato falsificato o il finto gli costano la penalità.
 * - Messaggi: quota per trimestre, anonimo = costa entrambi i messaggi, testo libero breve.
 */
import type { AzioneGiocatore, Esito, Evento } from "./azioni.js";
import type { Ambiente, ModelloSegreto } from "./contenuti.js";
import type { Casuale } from "./rng.js";
import type { CopiaSegreto, Fase, Giocatore, GiocatoreId, Partita, SegretoIstanza, TipoSegreto, ValoreCampo } from "./tipi.js";
import { TIPI_SEGRETO } from "./config.js";

const nuovoId = (partita: Partita, prefisso: string) => `${prefisso}${++partita.contatore}`;

const ugualiAiVeri = (campi: Record<string, ValoreCampo>, veri: Record<string, ValoreCampo>) =>
  Object.keys(veri).every((k) => campi[k] === veri[k]);

/** Colleghi da attraversare prima del reparto utile (D-073). */
export function passaggiMinimi(partita: Partita, ambiente: Ambiente): number {
  return ambiente.config.segreti.passaggiMinimi[String(partita.giocatori.length)] ?? 1;
}

/** Chi possiede già una copia di un segreto (fonte compresa). */
export function possessori(partita: Partita, segretoId: string): GiocatoreId[] {
  return [...new Set(partita.copieSegreto.filter((c) => c.segretoId === segretoId).map((c) => c.possessore))];
}

/** Il direttore del reparto utile, se attivo. */
const direttoreUtile = (partita: Partita, s: SegretoIstanza): Giocatore | undefined =>
  partita.giocatori.find((g) => g.repartoId === s.utile && g.stato === "ATTIVO");

/** Distribuisce i segreti del trimestre. Modifica la copia ricevuta e restituisce gli eventi. */
export function distribuisciSegreti(partita: Partita, ambiente: Ambiente, casuale: Casuale): Evento[] {
  const { config } = ambiente;
  const quanti = config.segreti.perTrimestre;
  if (quanti === 0 || partita.trimestre > config.segreti.ultimoTrimestre) return [];
  const attivi = partita.giocatori.filter((g) => g.stato === "ATTIVO");
  if (attivi.length < 2 * quanti) return [];

  // Stesso tipo per tutti i segreti del trimestre (D-074, regola 5).
  const tipo: TipoSegreto = casuale.scegliPesato(TIPI_SEGRETO, TIPI_SEGRETO.map((t) => config.segreti.tipi[t].probabilita));
  const usciti = new Set(partita.segreti.map((s) => s.modelloId));
  const filtra = (f: (m: ModelloSegreto) => boolean) => ambiente.segreti.filter((m) => m.trimestri.includes(partita.trimestre) && f(m));
  let candidati = filtra((m) => m.tipo === tipo && !usciti.has(m.id));
  if (candidati.length < quanti) candidati = filtra((m) => m.tipo === tipo);
  if (candidati.length < quanti) candidati = filtra(() => true);
  const modelli = casuale.mescola(candidati).slice(0, quanti);

  // Ruoli: chi è stato coinvolto meno finora; al massimo un ruolo a testa nel trimestre (se si può)
  // e al massimo un segreto per trimestre con una spia dentro (D-074, regola 1).
  const coinvolti = new Set<GiocatoreId>();
  let segretoConSpia: number | undefined;
  const scegliPersona = (i: number, escluso?: GiocatoreId): Giocatore => {
    let ammessi = attivi.filter((g) => g.id !== escluso && !coinvolti.has(g.id));
    if (ammessi.length === 0) ammessi = attivi.filter((g) => g.id !== escluso);
    if (segretoConSpia !== undefined && segretoConSpia !== i) {
      const onesti = ammessi.filter((g) => g.fazione.tipo !== "SPIA");
      if (onesti.length > 0) ammessi = onesti;
    }
    // Nello stesso segreto, se la fonte è una spia il destinatario è un onesto (e viceversa).
    if (segretoConSpia === i) {
      const onesti = ammessi.filter((g) => g.fazione.tipo !== "SPIA");
      if (onesti.length > 0) ammessi = onesti;
    }
    const minimo = Math.min(...ammessi.map((g) => partita.coinvolgimentiSegreti[g.id] ?? 0));
    const scelto = casuale.scegli(ammessi.filter((g) => (partita.coinvolgimentiSegreti[g.id] ?? 0) === minimo));
    coinvolti.add(scelto.id);
    partita.coinvolgimentiSegreti[scelto.id] = (partita.coinvolgimentiSegreti[scelto.id] ?? 0) + 1;
    if (scelto.fazione.tipo === "SPIA") segretoConSpia = i;
    return scelto;
  };
  const ruoli = modelli.map((_, i) => {
    const fonte = scegliPersona(i);
    const utile = scegliPersona(i, fonte.id);
    return { fonte, utile };
  });
  const finto = segretoConSpia ?? casuale.intero(0, modelli.length - 1);

  const eventi: Evento[] = [];
  const valori = config.segreti.tipi[tipo];
  const scadenza = Math.min(partita.trimestre + 1, config.trimestri);
  const x = passaggiMinimi(partita, ambiente);
  modelli.forEach((modello, i) => {
    const { fonte, utile } = ruoli[i]!;
    // Dato estratto campo per campo (D-036, D-037).
    const valoriPossibili: Record<string, ValoreCampo[]> = {};
    for (const nome of Object.keys(modello.versioni[0]!)) valoriPossibili[nome] = [...new Set(modello.versioni.map((v) => v[nome]!))];
    const campi: Record<string, ValoreCampo> = {};
    for (const [nome, possibili] of Object.entries(valoriPossibili)) campi[nome] = casuale.scegli(possibili);

    const segretoId = nuovoId(partita, "S");
    partita.segreti.push({
      id: segretoId,
      modelloId: modello.id,
      titolo: modello.titolo,
      tipo: modello.tipo,
      campi,
      valoriPossibili,
      fonte: fonte.repartoId,
      utile: utile.repartoId,
      finto: i === finto,
      valoreAzienda: config.segreti.tipi[modello.tipo]?.azienda ?? valori.azienda,
      valoreConcorrente: config.segreti.tipi[modello.tipo]?.concorrente ?? valori.concorrente,
      trimestre: partita.trimestre,
      scadenza,
      arrivatoInTempo: false,
    });
    const copia: CopiaSegreto = {
      id: nuovoId(partita, "C"),
      segretoId,
      possessore: fonte.id,
      campi: { ...campi },
      falsa: false,
      provenienza: { tipo: "GIOCO" },
      catena: [],
    };
    partita.copieSegreto.push(copia);
    const entro = scadenza > partita.trimestre ? "entro la fine del prossimo trimestre" : "entro la fine del trimestre";
    eventi.push({
      tipo: "SEGRETO_ANNUNCIATO",
      segretoId,
      utile: utile.repartoId,
      causa: `${config.reparti.nomi[utile.repartoId]} ha bisogno di informazioni su «${modello.titolo}» ${entro}!`,
    });
    eventi.push({
      tipo: "SEGRETO_RICEVUTO",
      copiaId: copia.id,
      causa: `Arrivato al tuo reparto: ${modello.titolo} (serve a ${config.reparti.nomi[utile.repartoId]}; deve passare da almeno ${x} ${x === 1 ? "collega" : "colleghi"})`,
      riservatoA: [fonte.id],
    });
  });
  return eventi;
}

/** Fasi in cui si possono mandare messaggi (D-021, parametro "messaggi.quando"). */
function messaggiAmmessi(fase: Fase, ambiente: Ambiente): boolean {
  const alTavolo = ["RAPPORTO", "DISCUSSIONE", "VOTO_PACCHETTO", "SECONDO_VOTO"].includes(fase.nome);
  if (ambiente.config.messaggi.quando === "DAL_RAPPORTO_ALLE_VOTAZIONI") return alTavolo;
  return alTavolo || ["MOSSA_PRIVATA", "RISOLUZIONE"].includes(fase.nome);
}

export function inviaMessaggio(
  partita: Partita,
  azione: Extract<AzioneGiocatore, { tipo: "INVIA_MESSAGGIO" }>,
  ambiente: Ambiente,
): Esito {
  const { config } = ambiente;
  if (!messaggiAmmessi(partita.fase, ambiente)) return { ok: false, errore: "In questa fase non si mandano messaggi" };
  const mittente = partita.giocatori.find((g) => g.id === azione.da);
  const destinatario = partita.giocatori.find((g) => g.id === azione.a);
  if (!mittente || !destinatario) return { ok: false, errore: "Giocatore sconosciuto" };
  if (mittente.stato === "LICENZIATO" || destinatario.stato === "LICENZIATO") {
    return { ok: false, errore: "I licenziati non mandano né ricevono messaggi" };
  }
  if (mittente.id === destinatario.id) return { ok: false, errore: "Non puoi scrivere a te stesso" };
  if (azione.testo !== undefined && azione.testo.length > config.messaggi.caratteriTestoLibero) {
    return { ok: false, errore: `Il testo libero può avere al massimo ${config.messaggi.caratteriTestoLibero} caratteri` };
  }
  if (azione.modello === "SOLO_TESTO" && !azione.testo) return { ok: false, errore: "Il messaggio è vuoto" };

  const costo = azione.anonimo ? config.messaggi.costoAnonimo : 1;
  if (mittente.quotaMessaggi < costo) {
    return { ok: false, errore: azione.anonimo ? "Il messaggio anonimo costa entrambi i messaggi del trimestre" : "Hai finito i messaggi di questo trimestre" };
  }

  // Inoltro di un segreto: controllo prima di modificare qualcosa.
  let copiaOrigine: CopiaSegreto | undefined;
  if (azione.modello === "SEGRETO") {
    copiaOrigine = partita.copieSegreto.find((c) => c.id === azione.copiaSegretoId && c.possessore === mittente.id);
    if (!copiaOrigine) return { ok: false, errore: "Puoi inoltrare solo un segreto che possiedi" };
    const sconosciuti = Object.keys(azione.campi ?? {}).filter((k) => !(k in copiaOrigine!.campi));
    if (sconosciuti.length > 0) return { ok: false, errore: `Campi inesistenti: ${sconosciuti.join(", ")}` };
    const segreto = partita.segreti.find((s) => s.id === copiaOrigine!.segretoId)!;
    if (partita.trimestre > segreto.scadenza) return { ok: false, errore: "Questo segreto è scaduto" };
    // D-073: niente a chi l'ha già ricevuto; al reparto utile solo dopo la catena minima.
    if (possessori(partita, segreto.id).includes(destinatario.id)) return { ok: false, errore: "Questo collega ha già ricevuto il segreto" };
    const mancano = passaggiMinimi(partita, ambiente) - copiaOrigine.catena.length;
    if (destinatario.repartoId === segreto.utile && mancano > 0) {
      return { ok: false, errore: `Prima di arrivare a destinazione deve passare ancora da ${mancano} ${mancano === 1 ? "collega" : "colleghi"}` };
    }
  }

  const nuova = structuredClone(partita);
  const m = nuova.giocatori.find((g) => g.id === mittente.id)!;
  m.quotaMessaggi -= costo;

  let copiaNuovaId: string | undefined;
  if (copiaOrigine) {
    const originale = nuova.segreti.find((s) => s.id === copiaOrigine!.segretoId)!;
    const campi = { ...copiaOrigine.campi, ...(azione.campi ?? {}) };
    const modificata = !ugualiAiVeri(campi, copiaOrigine.campi);
    const alterataDa = [...(copiaOrigine.alterataDa ?? []), ...(modificata ? [mittente.id] : [])];
    copiaNuovaId = nuovoId(nuova, "C");
    nuova.copieSegreto.push({
      id: copiaNuovaId,
      segretoId: originale.id,
      possessore: destinatario.id,
      campi,
      falsa: !ugualiAiVeri(campi, originale.campi),
      provenienza: { tipo: "GIOCATORE", da: mittente.id, anonimo: azione.anonimo },
      catena: [...copiaOrigine.catena, mittente.id],
      ...(modificata ? { modificataDalMittente: true } : {}),
      ...(alterataDa.length > 0 ? { alterataDa } : {}),
    });
    // Arrivo a destinazione (qualunque versione): la TV lo annuncerà ai Risultati (D-074).
    if (destinatario.repartoId === originale.utile && originale.arrivatoIl === undefined) originale.arrivatoIl = nuova.trimestre;
  }

  const messaggioId = nuovoId(nuova, "M");
  nuova.messaggi.push({
    id: messaggioId,
    trimestre: nuova.trimestre,
    da: mittente.id,
    a: destinatario.id,
    anonimo: azione.anonimo,
    modello: azione.modello,
    ...(azione.testo !== undefined ? { testo: azione.testo } : {}),
    ...(copiaNuovaId !== undefined ? { copiaSegretoId: copiaNuovaId } : {}),
  });

  return {
    ok: true,
    partita: nuova,
    eventi: [
      {
        tipo: "MESSAGGIO_RICEVUTO",
        messaggioId,
        causa: azione.anonimo ? "Nuovo messaggio anonimo" : `Nuovo messaggio da ${mittente.nome}`,
        riservatoA: [destinatario.id],
      },
    ],
  };
}

export function passaAlConcorrente(partita: Partita, azione: Extract<AzioneGiocatore, { tipo: "PASSA_AL_CONCORRENTE" }>): Esito {
  const spia = partita.giocatori.find((g) => g.id === azione.da);
  if (!spia || spia.fazione.tipo !== "SPIA") return { ok: false, errore: "Azione non disponibile" };
  if (!["RAPPORTO", "DISCUSSIONE", "VOTO_PACCHETTO", "SECONDO_VOTO", "MOSSA_PRIVATA"].includes(partita.fase.nome)) {
    return { ok: false, errore: "Ora non puoi consegnare segreti" };
  }
  const copia = partita.copieSegreto.find((c) => c.id === azione.copiaSegretoId && c.possessore === spia.id);
  if (!copia) return { ok: false, errore: "Puoi consegnare solo un segreto che possiedi" };
  const segreto = partita.segreti.find((s) => s.id === copia.segretoId)!;
  if (partita.trimestre > segreto.scadenza) return { ok: false, errore: "Questo segreto è scaduto" };
  if (partita.segretiPassati.some((p) => p.spia === spia.id && p.segretoId === segreto.id)) {
    return { ok: false, errore: "Hai già consegnato questo segreto" };
  }

  const nuova = structuredClone(partita);
  const concorrente = spia.fazione.concorrente;
  nuova.segretiPassati.push({ copiaId: copia.id, segretoId: segreto.id, spia: spia.id, concorrente, trimestre: nuova.trimestre });
  const nome = nuova.concorrenti.find((c) => c.id === concorrente)?.nome ?? concorrente;
  return {
    ok: true,
    partita: nuova,
    eventi: [
      {
        tipo: "SEGRETO_CONSEGNATO",
        copiaId: copia.id,
        causa: `Segreto consegnato a ${nome}: l'effetto si vedrà ai risultati`,
        riservatoA: [spia.id],
      },
    ],
  };
}

/**
 * Ai Risultati: annuncio degli arrivi del trimestre, valore dei segreti che scadono (si conta
 * insieme, alla scadenza, D-074) e segreti usati dai concorrenti.
 */
export function risolviSegreti(partita: Partita, ambiente: Ambiente): Evento[] {
  const eventi: Evento[] = [];
  const t = partita.trimestre;
  for (const s of partita.segreti.filter((x) => x.arrivatoIl === t)) {
    eventi.push({ tipo: "SEGRETO_ARRIVATO", segretoId: s.id, causa: `L'informazione «${s.titolo}» è arrivata a destinazione (${ambiente.config.reparti.nomi[s.utile]}).` });
  }
  for (const s of partita.segreti.filter((x) => x.scadenza === t)) {
    const utile = direttoreUtile(partita, s);
    s.arrivatoInTempo = utile !== undefined && partita.copieSegreto.some((c) => c.segretoId === s.id && c.possessore === utile.id && !c.falsa);
    if (s.arrivatoInTempo && !s.finto) partita.azienda.quota += s.valoreAzienda;
  }
  for (const p of partita.segretiPassati.filter((x) => x.trimestre === t)) {
    const copia = partita.copieSegreto.find((c) => c.id === p.copiaId)!;
    const segreto = partita.segreti.find((s) => s.id === p.segretoId)!;
    const concorrente = partita.concorrenti.find((c) => c.id === p.concorrente)!;
    const falso = copia.falsa || segreto.finto;
    const variazione = falso ? -ambiente.config.segreti.penalitaFalsoConcorrente : segreto.valoreConcorrente;
    concorrente.quota += variazione;
    p.riuscito = !falso;
    eventi.push({
      tipo: "SEGRETO_USATO",
      concorrente: concorrente.id,
      segretoId: segreto.id,
      falso,
      variazione,
      causa: falso
        ? `${concorrente.nome} ha sbagliato mossa usando un dato falso («${segreto.titolo}»): ${variazione}.`
        : `${concorrente.nome} ha anticipato la nostra mossa («${segreto.titolo}»): +${variazione}.`,
    });
  }
  return eventi;
}
