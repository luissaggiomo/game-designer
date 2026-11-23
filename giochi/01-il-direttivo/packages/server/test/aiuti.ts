/**
 * Aiuti per i test del server: un orologio finto che avanza solo quando lo dice il test,
 * e il controllo di riservatezza di ciò che arriva a un dispositivo.
 */
import type { StatoDispositivo } from "../src/stanza.js";
import type { Orologio } from "../src/config.js";

export class OrologioFinto implements Orologio {
  private adesso = 1_000_000;
  private prossimo = 0;
  private readonly coda = new Map<number, { quando: number; fn: () => void }>();

  ora(): number {
    return this.adesso;
  }

  programma(ms: number, fn: () => void): () => void {
    const id = this.prossimo++;
    this.coda.set(id, { quando: this.adesso + ms, fn });
    return () => this.coda.delete(id);
  }

  /** Fa passare il tempo, eseguendo in ordine tutto ciò che scade nel frattempo. */
  avanza(ms: number): void {
    const fine = this.adesso + ms;
    for (;;) {
      const primo = [...this.coda.entries()].filter(([, v]) => v.quando <= fine).sort((a, b) => a[1].quando - b[1].quando || a[0] - b[0])[0];
      if (!primo) break;
      this.coda.delete(primo[0]);
      this.adesso = Math.max(this.adesso, primo[1].quando);
      primo[1].fn();
    }
    this.adesso = fine;
  }

  /** Quanti timer sono in attesa. */
  get inAttesa(): number {
    return this.coda.size;
  }
}

/**
 * Chiavi che non devono mai arrivare a un dispositivo (stesso elenco del test di riservatezza
 * del motore, packages/engine/test/riservatezza.test.ts) più quelle del server.
 */
export const CHIAVI_VIETATE = [
  "catena", "statoCasuale", "seme", "mossePrivate", "spieTraAttivi", "effettiPrivati", "effettoAzienda", "nomine", "revocata", "possessore",
  "proposti", "storicoPacchetti", "primiVoti", "storicoTrimestri", "decisivi", "mosseScelte", "alterataDa", "modificataDalMittente", "aziendalista", "misura",
  "carte", "alternativa", "equita", "coinvolgimentiSegreti",
  // Server: token e caratteri dei bot (solo a fine partita).
  "token", "tokenTV", "profilo",
];

const FASI_FINE = new Set(["PUNTEGGIO", "LETTURA_MESSAGGI", "FINE"]);

function chiavi(oggetto: unknown, trovate = new Set<string>()): Set<string> {
  if (Array.isArray(oggetto)) oggetto.forEach((x) => chiavi(x, trovate));
  else if (oggetto && typeof oggetto === "object") {
    for (const [k, v] of Object.entries(oggetto)) {
      trovate.add(k);
      chiavi(v, trovate);
    }
  }
  return trovate;
}

/**
 * Controlla un messaggio "stato" ricevuto da un dispositivo. Restituisce i problemi trovati.
 * io = id del giocatore (undefined per la TV); segreti = stringhe che non devono mai comparire (token altrui).
 */
export function problemiRiservatezza(s: StatoDispositivo, io: string | undefined, segreti: string[] = []): string[] {
  const problemi: string[] = [];
  // Le chiavi vietate si cercano nelle viste e nei dati della stanza; gli eventi pubblici dei
  // Risultati portano legittimamente l'effetto sull'azienda (GDD §8.2), come nel test del motore.
  const presenti = chiavi({ info: s.info, vista: s.vista });
  for (const k of CHIAVI_VIETATE) if (presenti.has(k)) problemi.push(`chiave vietata "${k}"`);
  const testo = JSON.stringify(s);
  for (const x of segreti) if (testo.includes(x)) problemi.push("contiene un token");
  const fase = s.vista?.fase.nome;
  const fine = fase !== undefined && FASI_FINE.has(fase);
  if (!fine && s.info.carattereBot) problemi.push("carattere dei bot prima della fine");
  if (s.vista && !fine) {
    for (const g of s.vista.giocatori) if ("fazione" in g && g.fazione) problemi.push(`ruolo di ${g.id} visibile prima della fine`);
  }
  if (s.vista && io === undefined && s.vista.tipo !== "TV") problemi.push("la TV riceve una vista da giocatore");
  if (s.vista && io !== undefined && (s.vista.tipo !== "GIOCATORE" || s.vista.io.id !== io)) problemi.push("vista di un altro giocatore");
  for (const e of s.eventi) if (e.riservatoA && !(io !== undefined && e.riservatoA.includes(io))) problemi.push(`evento riservato ad altri: ${e.tipo}`);
  return problemi;
}
