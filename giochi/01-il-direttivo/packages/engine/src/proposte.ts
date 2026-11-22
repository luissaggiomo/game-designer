/**
 * Estrazione dell'ordine del giorno del trimestre (Architettura §10.2, D-006, D-013, D-014).
 *
 * Regole applicate:
 * - solo quesiti ammessi nel trimestre e non ancora usciti;
 * - mai quesiti che riguardano reparti in autogestione (vacanti o demansionati);
 * - raramente quesiti in cui i reparti vacanti avrebbero un peso rilevante (D-006);
 * - preferenza per categorie diverse nello stesso trimestre;
 * - bilanciamento dei "favoriti": si evita di favorire ancora un reparto già favorito
 *   più degli altri (D-014);
 * - pesi effettivi: i vacanti non pesano (D-006); nei quesiti con astensione tutti i reparti
 *   occupati pesano 1 (D-013).
 */
import { pesiDelModello, type Ambiente, type ModelloProposta } from "./contenuti.js";
import type { Casuale } from "./rng.js";
import type { Partita, Peso, PropostaIstanza, RepartoId } from "./tipi.js";

export function estraiOrdineDelGiorno(partita: Partita, ambiente: Ambiente, casuale: Casuale): PropostaIstanza[] {
  const { config, mazzo, pesi } = ambiente;
  const quante = config.votazioniPerTrimestre[partita.trimestre - 1] ?? 0;
  const occupati = partita.reparti.filter((r) => r.occupatoDa).map((r) => r.id);
  const vacanti = new Set(partita.reparti.filter((r) => !r.occupatoDa).map((r) => r.id));
  const inAutogestione = new Set(partita.reparti.filter((r) => r.autogestione).map((r) => r.id));

  const pesiEffettivi = (m: ModelloProposta): Partial<Record<RepartoId, Peso>> => {
    const risultato: Partial<Record<RepartoId, Peso>> = {};
    if (m.astensioneAmmessa) {
      for (const r of occupati) risultato[r] = 1;
    } else {
      const base = pesiDelModello(m, pesi);
      for (const r of occupati) {
        const p = base[r] ?? 0;
        if (p > 0) risultato[r] = p;
      }
    }
    return risultato;
  };

  const pesoTotaleOccupati = (m: ModelloProposta) =>
    Object.values(pesiEffettivi(m)).reduce<number>((a, b) => a + (b ?? 0), 0);

  const quotaVacanti = (m: ModelloProposta): number => {
    if (m.astensioneAmmessa) return 0;
    const base = pesiDelModello(m, pesi);
    let totale = 0;
    let vacante = 0;
    for (const [r, p] of Object.entries(base) as [RepartoId, number][]) {
      totale += p;
      if (vacanti.has(r)) vacante += p;
    }
    return totale > 0 ? vacante / totale : 0;
  };

  /** Reparti occupati con l'effetto privato migliore (se positivo). */
  const favoriti = (m: ModelloProposta): RepartoId[] => {
    let migliore = 0;
    let elenco: RepartoId[] = [];
    for (const r of occupati) {
      const punti = m.effettiPrivati[r]?.punti;
      if (punti === undefined || punti <= 0) continue;
      if (punti > migliore) {
        migliore = punti;
        elenco = [r];
      } else if (punti === migliore) {
        elenco.push(r);
      }
    }
    return elenco;
  };

  const ammissibile = (m: ModelloProposta, ammettiRipetuti: boolean) =>
    m.trimestri.includes(partita.trimestre) &&
    (ammettiRipetuti || !partita.proposteUscite.includes(m.id)) &&
    !m.riguarda.some((r) => inAutogestione.has(r)) &&
    pesoTotaleOccupati(m) > 0; // un quesito che nessuno può votare non ha senso

  let candidati = mazzo.filter((m) => ammissibile(m, false));
  // Mazzo troppo piccolo per questa partita: si ammettono quesiti già usciti piuttosto che saltare votazioni.
  if (candidati.length < quante) candidati = mazzo.filter((m) => ammissibile(m, true));

  const scelti: ModelloProposta[] = [];
  const conteggio = { ...partita.conteggioFavoriti };

  for (let i = 0; i < quante && candidati.length > 0; i++) {
    const minimo = Math.min(...occupati.map((r) => conteggio[r] ?? 0));
    const fattori = candidati.map((m) => {
      let f = 1;
      if (quotaVacanti(m) > config.selezione.sogliaPesoVacanti) f *= config.selezione.fattoreVacantiPesanti;
      if (scelti.some((s) => s.categoria === m.categoria)) f *= config.selezione.fattoreStessaCategoria;
      const fav = favoriti(m);
      if (fav.length > 0 && fav.every((r) => (conteggio[r] ?? 0) > minimo)) {
        f *= config.selezione.fattoreFavoritoInEccesso;
      }
      return f;
    });
    const scelto = casuale.scegliPesato(candidati, fattori);
    scelti.push(scelto);
    candidati = candidati.filter((m) => m !== scelto);
    for (const r of favoriti(scelto)) conteggio[r] = (conteggio[r] ?? 0) + 1;
  }

  partita.conteggioFavoriti = conteggio;
  partita.proposteUscite.push(...scelti.map((m) => m.id));

  return scelti.map((m, i) => ({
    id: `T${partita.trimestre}-${i + 1}-${m.id}`,
    modelloId: m.id,
    titolo: m.titolo,
    categoria: m.categoria,
    costo: m.costo,
    astensioneAmmessa: m.astensioneAmmessa ?? false,
    pesi: pesiEffettivi(m),
    effettiPrivati: structuredClone(m.effettiPrivati),
    effettoAzienda: m.effettoAzienda.base,
    voti: {},
  }));
}
