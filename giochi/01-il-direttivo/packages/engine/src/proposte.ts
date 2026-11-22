/**
 * Estrazione dell'ordine del giorno del trimestre (Architettura §10.2 · D-008, D-013, D-014, D-023).
 *
 * Modello B (D-023): si estraggono i quesiti (ammessi nel trimestre, non ancora usciti, preferendo
 * categorie diverse); poi i RUOLI dello schema si assegnano ai reparti occupati e non in
 * autogestione. Il ruolo migliore va al reparto finora meno "favorito" (D-014), gli altri a caso:
 * così tutti i reparti sono uguali per costruzione, e i vacanti non ricevono mai un ruolo (D-006).
 *
 * Pesi effettivi: i ruoli hanno il loro peso, gli altri reparti occupati (anche demansionati, la
 * cui assenza pesa sulla soglia, §8.4) hanno "pesoAltri"; i vacanti 0. Nei quesiti con astensione
 * tutti i reparti occupati pesano 1 (D-013).
 */
import type { Ambiente, ModelloProposta } from "./contenuti.js";
import type { Casuale } from "./rng.js";
import type { Partita, Peso, PropostaIstanza, RepartoId } from "./tipi.js";

export function estraiOrdineDelGiorno(partita: Partita, ambiente: Ambiente, casuale: Casuale): PropostaIstanza[] {
  const { config, mazzo, schemi, frasi } = ambiente;
  const quante = config.votazioniPerTrimestre[partita.trimestre - 1] ?? 0;
  const occupati = partita.reparti.filter((r) => r.occupatoDa).map((r) => r.id);
  const conRuolo = partita.reparti.filter((r) => r.occupatoDa && !r.autogestione).map((r) => r.id);

  const ammissibile = (m: ModelloProposta, ammettiRipetuti: boolean) =>
    m.trimestri.includes(partita.trimestre) && (ammettiRipetuti || !partita.proposteUscite.includes(m.id));
  let candidati = mazzo.filter((m) => ammissibile(m, false));
  if (candidati.length < quante) candidati = mazzo.filter((m) => ammissibile(m, true));

  // 1. Quesiti del trimestre, preferendo categorie diverse.
  const scelti: ModelloProposta[] = [];
  for (let i = 0; i < quante && candidati.length > 0; i++) {
    const fattori = candidati.map((m) => (scelti.some((s) => s.categoria === m.categoria) ? config.selezione.fattoreStessaCategoria : 1));
    const scelto = casuale.scegliPesato(candidati, fattori);
    scelti.push(scelto);
    candidati = candidati.filter((m) => m !== scelto);
  }
  partita.proposteUscite.push(...scelti.map((m) => m.id));

  // 2. Assegnazione dei ruoli ai reparti.
  return scelti.map((m, i) => {
    const schema = schemi[m.schema]!;
    const ruoli = [...schema.ruoli].sort((a, b) => b.punti - a.punti);
    const puntiMigliori = ruoli[0]?.punti ?? 0;
    const liberi = casuale.mescola(conRuolo);
    const assegnati = new Map<RepartoId, { punti: number; peso: Peso }>();
    for (const ruolo of ruoli) {
      if (liberi.length === 0) break; // pochi reparti disponibili: i ruoli minori restano vuoti
      let reparto: RepartoId;
      if (ruolo.punti === puntiMigliori && ruolo.punti > 0) {
        // I ruoli migliori ai reparti meno favoriti finora (a parità, a caso: l'elenco è già mescolato).
        const minimo = Math.min(...liberi.map((r) => partita.conteggioFavoriti[r] ?? 0));
        reparto = liberi.find((r) => (partita.conteggioFavoriti[r] ?? 0) === minimo)!;
      } else {
        reparto = liberi[0]!;
      }
      liberi.splice(liberi.indexOf(reparto), 1);
      assegnati.set(reparto, ruolo);
    }

    // Favoriti: i reparti con l'effetto migliore, se positivo (D-014).
    const migliore = Math.max(0, ...[...assegnati.values()].map((r) => r.punti));
    if (migliore > 0) {
      for (const [r, ruolo] of assegnati) if (ruolo.punti === migliore) partita.conteggioFavoriti[r] = (partita.conteggioFavoriti[r] ?? 0) + 1;
    }

    const pesi: Partial<Record<RepartoId, Peso>> = {};
    for (const r of occupati) {
      const p: Peso = m.astensioneAmmessa ? 1 : (assegnati.get(r)?.peso ?? schema.pesoAltri);
      if (p > 0) pesi[r] = p;
    }

    const effettiPrivati: PropostaIstanza["effettiPrivati"] = {};
    for (const r of occupati) {
      const ruolo = assegnati.get(r);
      if (!ruolo || ruolo.punti === 0) {
        effettiPrivati[r] = { punti: 0, testo: frasi.neutro };
        continue;
      }
      const segno = ruolo.punti > 0 ? "positivo" : "negativo";
      const testo = m.testi?.[r]?.[segno] ?? casuale.scegli(frasi.reparti[r][segno]);
      effettiPrivati[r] = { punti: ruolo.punti, testo };
    }

    return {
      id: `T${partita.trimestre}-${i + 1}-${m.id}`,
      modelloId: m.id,
      titolo: m.titolo,
      categoria: m.categoria,
      costo: m.costo,
      astensioneAmmessa: m.astensioneAmmessa ?? false,
      spiegazione: m.spiegazione,
      pesi,
      effettiPrivati,
      effettoAzienda: schema.effettoAzienda,
      voti: {},
    };
  });
}
