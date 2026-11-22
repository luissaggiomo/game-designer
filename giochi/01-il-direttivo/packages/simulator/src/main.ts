/**
 * Avvio del simulatore da riga di comando.
 *
 *   corepack pnpm simula                       → 1000 partite per ogni numero di giocatori (4–8)
 *   corepack pnpm simula -- --partite 200      → meno partite (più veloce)
 *   corepack pnpm simula -- --giocatori 5      → solo partite a 5 giocatori
 *
 * Risultati in packages/simulator/output/: report.md (da leggere), partite.csv e giocatori.csv (per Excel).
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { caricaAmbiente } from "@il-direttivo/engine";
import { creaCsv, creaReport } from "./report.js";
import { simulaPartita, type DatiPartita } from "./simula.js";

function argomento(nome: string, predefinito: string): string {
  const i = process.argv.indexOf(`--${nome}`);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1]! : predefinito;
}

const partitePerN = Number(argomento("partite", "1000"));
const giocatori = argomento("giocatori", "4,5,6,7,8").split(",").map(Number);
const semeIniziale = Number(argomento("seme", "1"));

const ambiente = caricaAmbiente();
const inizio = Date.now();
const risultati: DatiPartita[] = [];
for (const n of giocatori) {
  for (let i = 0; i < partitePerN; i++) risultati.push(simulaPartita(n, semeIniziale + i, ambiente));
  console.log(`  ${n} giocatori: ${partitePerN} partite simulate`);
}
const secondi = ((Date.now() - inizio) / 1000).toFixed(1);

const intestazione = `${risultati.length} partite simulate (${partitePerN} per ciascun numero di giocatori: ${giocatori.join(", ")}), semi da ${semeIniziale}. Durata: ${secondi} s. Data: ${new Date().toISOString().slice(0, 10)}.`;
const { markdown, avvisi } = creaReport(risultati, intestazione);
const csv = creaCsv(risultati);

const cartella = join(dirname(fileURLToPath(import.meta.url)), "..", "output");
mkdirSync(cartella, { recursive: true });
writeFileSync(join(cartella, "report.md"), markdown, "utf-8");
writeFileSync(join(cartella, "partite.csv"), csv.partite, "utf-8");
writeFileSync(join(cartella, "giocatori.csv"), csv.giocatori, "utf-8");

console.log(`\nFatto in ${secondi} s. Report: ${join(cartella, "report.md")}`);
console.log(avvisi.length === 0 ? "Nessun avviso." : `Avvisi:\n${avvisi.map((a) => `  ⚠️ ${a.testo}`).join("\n")}`);
