/**
 * Avvio del simulatore da riga di comando.
 *
 *   corepack pnpm simula                       → 1000 partite per ogni numero di giocatori (4–8)
 *   corepack pnpm simula -- --partite 200      → meno partite (più veloce)
 *   corepack pnpm simula -- --giocatori 5      → solo partite a 5 giocatori
 *   corepack pnpm simula -- --base 2.4 --pergiocatore 0.1   → prova una crescita dei concorrenti diversa
 *                                                 da config.json (senza modificarlo)
 *   corepack pnpm simula -- --uscita prova     → scrive prova.md, prova-partite.csv, prova-giocatori.csv
 *
 * Risultati in packages/simulator/output/: report.md (da leggere), partite.csv e giocatori.csv (per Excel).
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { caricaAmbiente } from "@il-direttivo/engine";
import { creaCsv, creaReport } from "./report.js";
import { simulaPartita, type DatiPartita } from "./simula.js";
import { reportStudio, studioConcorrenti } from "./studio.js";

function argomento(nome: string, predefinito: string): string {
  const i = process.argv.indexOf(`--${nome}`);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1]! : predefinito;
}

const studio = process.argv.includes("--studio");
const partitePerN = Number(argomento("partite", studio ? "100" : "1000"));
const giocatori = argomento("giocatori", "4,5,6,7,8").split(",").map(Number);
const semeIniziale = Number(argomento("seme", "1"));

const ambiente = caricaAmbiente();
// Prova di una crescita dei concorrenti diversa (solo simulazione normale; nello studio --base è un elenco).
if (!studio && (process.argv.includes("--base") || process.argv.includes("--pergiocatore"))) {
  const c = ambiente.config.concorrenti;
  ambiente.config = {
    ...ambiente.config,
    concorrenti: { ...c, crescitaBase: Number(argomento("base", String(c.crescitaBase))), crescitaPerGiocatore: Number(argomento("pergiocatore", String(c.crescitaPerGiocatore))) },
  };
}
const nomeUscita = argomento("uscita", "report");
const prefissoCsv = nomeUscita === "report" ? "" : `${nomeUscita}-`;
const cartella = join(dirname(fileURLToPath(import.meta.url)), "..", "output");
mkdirSync(cartella, { recursive: true });

if (studio) {
  const elenco = (nome: string, predefinito: string) => argomento(nome, predefinito).split(",").map(Number);
  const griglia = { crescitaBase: elenco("base", "1,2,3"), crescitaPerGiocatore: elenco("pergiocatore", "0,0.25,0.5,0.75") };
  const t0 = Date.now();
  const righe = studioConcorrenti(ambiente, griglia, partitePerN, giocatori);
  const durata = ((Date.now() - t0) / 1000).toFixed(0);
  const testo = reportStudio(righe, `${partitePerN} partite per numero di giocatori (${giocatori.join(", ")}) per ogni combinazione. Durata: ${durata} s. Data: ${new Date().toISOString().slice(0, 10)}.`);
  writeFileSync(join(cartella, "studio-concorrenti.md"), testo, "utf-8");
  console.log(`\nStudio completato in ${durata} s: ${join(cartella, "studio-concorrenti.md")}`);
  process.exit(0);
}
const inizio = Date.now();
const risultati: DatiPartita[] = [];
for (const n of giocatori) {
  for (let i = 0; i < partitePerN; i++) risultati.push(simulaPartita(n, semeIniziale + i, ambiente));
  console.log(`  ${n} giocatori: ${partitePerN} partite simulate`);
}
const secondi = ((Date.now() - inizio) / 1000).toFixed(1);

const crescita = `Crescita dei concorrenti: ${ambiente.config.concorrenti.crescitaBase} + ${ambiente.config.concorrenti.crescitaPerGiocatore} × giocatori.`;
const intestazione = `${crescita} ${risultati.length} partite simulate (${partitePerN} per ciascun numero di giocatori: ${giocatori.join(", ")}), semi da ${semeIniziale}. Durata: ${secondi} s. Data: ${new Date().toISOString().slice(0, 10)}.`;
const { markdown, avvisi } = creaReport(risultati, intestazione, ambiente);
const csv = creaCsv(risultati);

writeFileSync(join(cartella, `${nomeUscita}.md`), markdown, "utf-8");
writeFileSync(join(cartella, `${prefissoCsv}partite.csv`), csv.partite, "utf-8");
writeFileSync(join(cartella, `${prefissoCsv}giocatori.csv`), csv.giocatori, "utf-8");

console.log(`\nFatto in ${secondi} s. Report: ${join(cartella, `${nomeUscita}.md`)}`);
console.log(avvisi.length === 0 ? "Nessun avviso." : `Avvisi:\n${avvisi.map((a) => `  ⚠️ ${a.testo}`).join("\n")}`);
