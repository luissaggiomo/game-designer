/**
 * Punteggio finale (GDD §16 · Architettura §10.10 · D-011, D-022, D-059).
 * Ogni voce è spiegata in una frase. Obiettivi personali: D-046…D-052.
 */
import type { Evento } from "./azioni.js";
import type { Ambiente } from "./contenuti.js";
import { vociObiettivo } from "./obiettivi.js";
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

  // Obiettivo personale: ogni traguardo raggiunto vale i suoi punti, anche per i licenziati (D-046, D-049).
  for (const g of partita.giocatori) for (const voce of vociObiettivo(partita, ambiente, g)) aggiungi(g.id, voce.testo, voce.punti);

  // Corsa di mercato: l'azienda vince se supera ogni concorrente; un concorrente vince se supera
  // l'azienda (D-011); pareggio = nessuno vince (D-022).
  const quotaAzienda = partita.azienda.quota;
  if (partita.concorrenti.every((c) => quotaAzienda > c.quota)) {
    for (const g of onesti) aggiungi(g.id, "L'azienda ha battuto i concorrenti", v.aziendaVince);
  }
  // Una spia scoperta (licenziata) ha perso: niente bonus anche se il suo concorrente vince (D-025).
  for (const c of partita.concorrenti.filter((x) => x.quota > quotaAzienda)) {
    for (const g of spie.filter((s) => concorrenteDi(s.id) === c.id && s.stato !== "LICENZIATO")) aggiungi(g.id, `${c.nome} ha superato l'azienda`, v.concorrenteVince);
  }

  // Segreti consegnati con successo: punti secondo il tipo del segreto (D-038).
  for (const p of partita.segretiPassati.filter((x) => x.riuscito)) {
    const tipo = partita.segreti.find((s) => s.id === p.segretoId)!.tipo;
    aggiungi(p.spia, "Segreto usato dal tuo concorrente", ambiente.config.segreti.tipi[tipo].puntiSpia);
  }

  // Finale: nessun punto per accuse e licenziamenti (D-059). Resta solo D-025, più sopra.

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
