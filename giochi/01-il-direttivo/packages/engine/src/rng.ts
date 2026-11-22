/**
 * Generatore casuale con seme.
 *
 * Stesso seme → stessa sequenza di numeri → stessa partita.
 * Serve per riprodurre una partita identica (test, simulatore, ricerca degli errori).
 * Il motore non usa mai Math.random(): la casualità entra solo da qui.
 *
 * Algoritmo: mulberry32 (piccolo, veloce, sufficiente per un gioco).
 */
export interface Casuale {
  /** Numero decimale in [0, 1). */
  numero(): number;
  /** Intero compreso tra minimo e massimo, estremi inclusi. */
  intero(minimo: number, massimo: number): number;
  /** Vero con la probabilità indicata (da 0 a 1). */
  probabilita(p: number): boolean;
  /** Un elemento a caso dell'elenco (che non deve essere vuoto). */
  scegli<T>(elenco: readonly T[]): T;
  /** Copia mescolata dell'elenco (l'originale non cambia). */
  mescola<T>(elenco: readonly T[]): T[];
  /** Stato interno, per salvare e riprendere la sequenza dallo stesso punto. */
  stato(): number;
}

export function creaCasuale(seme: number): Casuale {
  let s = seme >>> 0;

  const numero = (): number => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const intero = (minimo: number, massimo: number): number => {
    if (!Number.isInteger(minimo) || !Number.isInteger(massimo) || massimo < minimo) {
      throw new Error(`Intervallo non valido: ${minimo}..${massimo}`);
    }
    return minimo + Math.floor(numero() * (massimo - minimo + 1));
  };

  const scegli = <T>(elenco: readonly T[]): T => {
    if (elenco.length === 0) throw new Error("Impossibile scegliere da un elenco vuoto");
    return elenco[intero(0, elenco.length - 1)] as T;
  };

  const mescola = <T>(elenco: readonly T[]): T[] => {
    // Mescolamento di Fisher-Yates: ogni ordine ha la stessa probabilità.
    const copia = [...elenco];
    for (let i = copia.length - 1; i > 0; i--) {
      const j = intero(0, i);
      const tmp = copia[i] as T;
      copia[i] = copia[j] as T;
      copia[j] = tmp;
    }
    return copia;
  };

  return {
    numero,
    intero,
    probabilita: (p) => numero() < p,
    scegli,
    mescola,
    stato: () => s,
  };
}
