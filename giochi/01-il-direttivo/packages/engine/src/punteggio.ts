/**
 * Punteggio finale (GDD §16 · Architettura §10.10 · D-011, D-022).
 * Ogni voce è spiegata in una frase. Gli obiettivi personali si aggiungeranno con la loro lista.
 */
import type { Evento } from "./azioni.js";
import type { Ambiente } from "./contenuti.js";
import type { GiocatoreId, Partita, Punteggio } from "./tipi.js";

export function calcolaPunteggi(partita: Partita, ambiente: Ambiente): Evento[] {
  const v = ambiente.config.punteggio;
  const punteggi: Partial<Record<GiocatoreId, Punteggio>> = {};
  for (const g of partita.giocatori) punteggi[g.id] = { totale: 0, voci: [] };
  const aggiungi = (id: GiocatoreId, testo: string, punti: number) => {
    if (punti === 0) return;
    const p = punteggi[id]!;
    p.voci.push({ testo, punti });
    p.totale += punti;
  };
  const onesti = partita.giocatori.filter((g) => g.fazione.tipo === "ONESTO");
  const spie = partita.giocatori.filter((g) => g.fazione.tipo === "SPIA");
  const concorrenteDi = (id: GiocatoreId) => {
    const g = partita.giocatori.find((x) => x.id === id)!;
    return g.fazione.tipo === "SPIA" ? g.fazione.concorrente : null;
  };
  const nome = (id: GiocatoreId) => partita.giocatori.find((g) => g.id === id)!.nome;

  // Punti di reparto accumulati in partita.
  for (const g of partita.giocatori) aggiungi(g.id, "Punti del tuo reparto", g.puntiReparto);

  // Corsa di mercato: l'azienda vince se supera ogni concorrente; un concorrente vince se supera
  // l'azienda (D-011); pareggio = nessuno vince (D-022).
  const quotaAzienda = partita.azienda.quota;
  if (partita.concorrenti.every((c) => quotaAzienda > c.quota)) {
    for (const g of onesti) aggiungi(g.id, "L'azienda ha battuto i concorrenti", v.aziendaVince);
  }
  for (const c of partita.concorrenti.filter((x) => x.quota > quotaAzienda)) {
    for (const g of spie.filter((s) => concorrenteDi(s.id) === c.id)) aggiungi(g.id, `${c.nome} ha superato l'azienda`, v.concorrenteVince);
  }

  // Segreti consegnati con successo.
  const puntiSegreto = ambiente.config.segreti.puntiSpiaPerSegretoUsato;
  for (const p of partita.segretiPassati.filter((x) => x.riuscito)) aggiungi(p.spia, "Segreto usato dal tuo concorrente", puntiSegreto);

  // Domanda di verifica del finale.
  for (const e of partita.finale.esitiVerifica) {
    if (e.tuttiSi && e.spieTraAttivi.length === 0) {
      for (const g of onesti) aggiungi(g.id, "Tutti sì, e nel direttivo c'erano davvero solo onesti", v.tuttiSiNessunaSpia);
    } else if (e.tuttiSi) {
      for (const id of e.spieTraAttivi) aggiungi(id, "Tutti hanno detto sì, ma tu eri ancora nel direttivo", v.tuttiSiConSpia);
    } else if (e.spieTraAttivi.length === 0) {
      for (const id of e.votiNo) aggiungi(id, "Falso allarme: hai detto no, ma non c'erano spie", v.falsoAllarme);
    }
  }

  // Licenziamenti nel finale.
  for (const l of partita.finale.licenziamenti) {
    const concorrenteLicenziato = concorrenteDi(l.giocatore);
    if (concorrenteLicenziato) {
      for (const g of onesti) aggiungi(g.id, `Spia licenziata (${nome(l.giocatore)})`, v.spiaLicenziataBonusOnesti);
      aggiungi(l.giocatore, "Sei stata scoperta e licenziata", v.spiaLicenziataPenalita);
      for (const da of l.nominatoDa) {
        const concorrenteNominatore = concorrenteDi(da);
        if (concorrenteNominatore === null) aggiungi(da, `Hai nominato la spia ${nome(l.giocatore)}`, v.spiaLicenziataBonusNominatori);
        else if (concorrenteNominatore !== concorrenteLicenziato) aggiungi(da, `Hai fatto licenziare una spia rivale`, v.spiaRivaleLicenziata);
      }
    } else {
      for (const da of l.nominatoDa) aggiungi(da, `Hai fatto licenziare un onesto (${nome(l.giocatore)})`, v.onestoLicenziatoPenalitaNominatori);
      for (const g of spie) aggiungi(g.id, `Un onesto è stato licenziato al posto tuo`, v.onestoLicenziatoBonusSpie);
    }
  }

  // Demansionamenti di onesti durante la partita (🟡 GDD §13.3).
  for (const voto of partita.storicoVotiPersonali.filter((x) => x.tipo === "DEMANSIONAMENTO" && x.approvato)) {
    if (concorrenteDi(voto.bersaglio) !== null) continue;
    for (const [id, scelta] of Object.entries(voto.voti)) {
      if (scelta === "SI") aggiungi(id, `Hai votato per demansionare un onesto (${nome(voto.bersaglio)})`, v.demansionamentoOnestoPenalitaPerVoto);
    }
  }

  partita.punteggi = punteggi;
  const classifica = partita.giocatori
    .map((g) => ({ giocatore: g.id, totale: punteggi[g.id]!.totale }))
    .sort((a, b) => b.totale - a.totale);
  return [
    {
      tipo: "PUNTEGGI",
      classifica,
      causa: "Classifica: " + classifica.map((c, i) => `${i + 1}) ${nome(c.giocatore)} ${c.totale}`).join(" · "),
    },
  ];
}
