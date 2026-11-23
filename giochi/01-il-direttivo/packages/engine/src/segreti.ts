/**
 * Segreti e messaggi privati (GDD §10, §11 · Architettura §10.5 · D-015, D-021).
 *
 * - Distribuzione nel Rapporto: ogni segreto va al reparto "fonte" (≠ reparto utile), come
 *   "dato certo, arrivato al tuo reparto" (D-035); fonte e reparto utile si scelgono al momento (D-023) e le
 *   fonti sono bilanciate tra i reparti (D-005). Chi possiede una copia sa a quale reparto serve.
 * - Il dato vero si estrae campo per campo tra i valori possibili (D-036, D-037); il tipo "a
 *   bilancia" decide quanto vale per l'azienda e per il concorrente (D-038, valori in config).
 * - Messaggi: quota per trimestre, anonimo = costa entrambi i messaggi (vietato ai demansionati),
 *   testo libero breve; si possono inoltrare segreti, anche modificati (copia falsa).
 * - Un segreto vale per l'azienda se il reparto utile ne ha una copia VERA prima della chiusura
 *   della votazione collegata (D-021).
 * - Una spia può passare un segreto al concorrente solo nel trimestre in cui è uscito; l'effetto
 *   si vede ai Risultati.
 */
import type { AzioneGiocatore, Esito, Evento } from "./azioni.js";
import type { Ambiente, ModelloSegreto } from "./contenuti.js";
import type { Casuale } from "./rng.js";
import type { CopiaSegreto, Fase, Partita, PropostaIstanza, ValoreCampo } from "./tipi.js";

const nuovoId = (partita: Partita, prefisso: string) => `${prefisso}${++partita.contatore}`;

const ugualiAiVeri = (campi: Record<string, ValoreCampo>, veri: Record<string, ValoreCampo>) =>
  Object.keys(veri).every((k) => campi[k] === veri[k]);

/** Distribuisce i segreti del trimestre. Modifica la copia ricevuta e restituisce gli eventi riservati. */
export function distribuisciSegreti(partita: Partita, ambiente: Ambiente, casuale: Casuale): Evento[] {
  const { config } = ambiente;
  if (partita.proposteTrimestre.length === 0) return [];

  // Modello B anche per i segreti (D-023): fonte e reparto utile si scelgono ora, tra i reparti con
  // un direttore attivo. La fonte è il reparto finora meno servito (D-005), il reparto utile un altro a caso.
  const attivi = partita.giocatori.filter((g) => g.stato === "ATTIVO");
  if (attivi.length < 2) return [];
  const usciti = new Set(partita.segreti.map((s) => s.modelloId));
  const ammissibile = (m: ModelloSegreto, ammettiRipetuti: boolean) =>
    m.trimestri.includes(partita.trimestre) && (ammettiRipetuti || !usciti.has(m.id));

  let candidati = ambiente.segreti.filter((m) => ammissibile(m, false));
  if (candidati.length < config.segreti.perTrimestre) candidati = ambiente.segreti.filter((m) => ammissibile(m, true));

  const eventi: Evento[] = [];
  const perTipo: Partial<Record<ModelloSegreto["tipo"], number>> = {};

  for (let i = 0; i < config.segreti.perTrimestre && candidati.length > 0; i++) {
    const modello = casuale.scegli(candidati);
    candidati = candidati.filter((m) => m !== modello);
    // Limite per tipo nello stesso trimestre (D-039: mai due "da custodire" insieme).
    const tipo = config.segreti.tipi[modello.tipo];
    perTipo[modello.tipo] = (perTipo[modello.tipo] ?? 0) + 1;
    if (tipo.massimoPerTrimestre !== undefined && perTipo[modello.tipo]! >= tipo.massimoPerTrimestre) {
      candidati = candidati.filter((m) => m.tipo !== modello.tipo);
    }
    // Dato vero estratto campo per campo (D-036, D-037).
    const valoriPossibili: Record<string, ValoreCampo[]> = {};
    for (const nome of Object.keys(modello.versioni[0]!)) valoriPossibili[nome] = [...new Set(modello.versioni.map((v) => v[nome]!))];
    const campi: Record<string, ValoreCampo> = {};
    for (const [nome, valori] of Object.entries(valoriPossibili)) campi[nome] = casuale.scegli(valori);

    const mescolati = casuale.mescola(attivi);
    const minimo = Math.min(...mescolati.map((g) => partita.conteggioFontiSegreti[g.repartoId] ?? 0));
    const fonte = mescolati.find((g) => (partita.conteggioFontiSegreti[g.repartoId] ?? 0) === minimo)!;
    const utile = mescolati.find((g) => g.id !== fonte.id)!;
    partita.conteggioFontiSegreti[fonte.repartoId] = minimo + 1;

    const collegata: PropostaIstanza = casuale.scegli(partita.proposteTrimestre);
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
      propostaCollegataId: collegata.id,
      valoreAzienda: tipo.azienda,
      valoreConcorrente: tipo.concorrente,
      trimestre: partita.trimestre,
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
    eventi.push({
      tipo: "SEGRETO_RICEVUTO",
      copiaId: copia.id,
      causa: `Dato certo, arrivato al tuo reparto: ${modello.titolo} (serve al reparto ${utile.repartoId})`,
      riservatoA: [fonte.id],
    });
  }
  return eventi;
}

/** Fasi in cui si possono mandare messaggi (D-021, parametro "messaggi.quando"). */
function messaggiAmmessi(fase: Fase, ambiente: Ambiente): boolean {
  const alTavolo = ["RAPPORTO", "DISCUSSIONE", "VOTAZIONE"].includes(fase.nome);
  if (ambiente.config.messaggi.quando === "DAL_RAPPORTO_ALLE_VOTAZIONI") return alTavolo;
  return alTavolo || ["MOSSA_PRIVATA", "RISOLUZIONE", "DEMANSIONAMENTO"].includes(fase.nome);
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
  if (azione.anonimo && mittente.stato === "DEMANSIONATO") {
    return { ok: false, errore: "Chi è demansionato non può mandare messaggi anonimi" };
  }
  if (mittente.quotaMessaggi < costo) {
    return { ok: false, errore: azione.anonimo ? "Il messaggio anonimo costa entrambi i messaggi del trimestre" : "Hai finito i messaggi di questo trimestre" };
  }

  // Inoltro di un segreto: controllo prima di modificare qualcosa.
  let copiaOrigine: CopiaSegreto | undefined;
  if (azione.modello === "SEGRETO") {
    copiaOrigine = partita.copieSegreto.find((c) => c.id === azione.copiaSegretoId && c.possessore === mittente.id && !c.revocata);
    if (!copiaOrigine) return { ok: false, errore: "Puoi inoltrare solo un segreto che possiedi" };
    const sconosciuti = Object.keys(azione.campi ?? {}).filter((k) => !(k in copiaOrigine!.campi));
    if (sconosciuti.length > 0) return { ok: false, errore: `Campi inesistenti: ${sconosciuti.join(", ")}` };
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
  if (!["RAPPORTO", "DISCUSSIONE", "VOTAZIONE", "MOSSA_PRIVATA"].includes(partita.fase.nome)) {
    return { ok: false, errore: "Ora non puoi consegnare segreti" };
  }
  const copia = partita.copieSegreto.find((c) => c.id === azione.copiaSegretoId && c.possessore === spia.id && !c.revocata);
  if (!copia) return { ok: false, errore: "Puoi consegnare solo un segreto che possiedi" };
  const segreto = partita.segreti.find((s) => s.id === copia.segretoId)!;
  if (segreto.trimestre !== partita.trimestre) return { ok: false, errore: "Questo segreto è scaduto" };
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

/** Alla chiusura di una votazione: segna i segreti collegati arrivati in tempo al reparto utile (D-021). */
export function verificaSegretiInTempo(partita: Partita, proposta: PropostaIstanza): void {
  for (const s of partita.segreti.filter((x) => x.propostaCollegataId === proposta.id && !x.arrivatoInTempo)) {
    const utile = partita.giocatori.find((g) => g.repartoId === s.utile && g.stato === "ATTIVO");
    if (!utile) continue;
    s.arrivatoInTempo = partita.copieSegreto.some((c) => c.segretoId === s.id && c.possessore === utile.id && !c.falsa);
  }
}

/** Ai Risultati: valore dei segreti arrivati in tempo e segreti usati dai concorrenti. */
export function risolviSegreti(partita: Partita, ambiente: Ambiente): Evento[] {
  const eventi: Evento[] = [];
  for (const s of partita.segreti.filter((x) => x.trimestre === partita.trimestre && x.arrivatoInTempo)) {
    partita.azienda.quota += s.valoreAzienda;
    // Senza numero: il "+N" rivelerebbe il tipo del segreto (D-038).
    eventi.push({ tipo: "SEGRETO_IN_TEMPO", causa: "Un'informazione è arrivata in tempo al reparto giusto." });
  }
  for (const p of partita.segretiPassati.filter((x) => x.trimestre === partita.trimestre)) {
    const copia = partita.copieSegreto.find((c) => c.id === p.copiaId)!;
    const segreto = partita.segreti.find((s) => s.id === p.segretoId)!;
    const concorrente = partita.concorrenti.find((c) => c.id === p.concorrente)!;
    const variazione = copia.falsa ? -ambiente.config.segreti.penalitaFalsoConcorrente : segreto.valoreConcorrente;
    concorrente.quota += variazione;
    p.riuscito = !copia.falsa;
    eventi.push({
      tipo: "SEGRETO_USATO",
      concorrente: concorrente.id,
      segretoId: segreto.id,
      falso: copia.falsa,
      variazione,
      causa: copia.falsa
        ? `${concorrente.nome} ha sbagliato mossa usando un dato falso («${segreto.titolo}»): ${variazione}.`
        : `${concorrente.nome} ha anticipato la nostra mossa («${segreto.titolo}»): +${variazione}.`,
    });
  }
  return eventi;
}
