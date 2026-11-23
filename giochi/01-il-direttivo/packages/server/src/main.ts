/**
 * Avvio del server sul PC di Luis (D-067). Comando: corepack pnpm gioca
 * Apre la pagina TV nel browser e scrive l'indirizzo per i telefoni.
 * Opzioni: --porta 3001 · --non-aprire
 */
import { exec } from "node:child_process";
import { appendFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { caricaAmbiente } from "@il-direttivo/engine";
import { caricaConfigServer, orologioVero } from "./config.js";
import { creaServer } from "./rete.js";

const argomenti = process.argv.slice(2);
const config = caricaConfigServer();
const iPorta = argomenti.indexOf("--porta");
const porta = iPorta >= 0 ? Number(argomenti[iPorta + 1]) : config.porta;
const cartellaRegistri = fileURLToPath(new URL("../registri/", import.meta.url));
mkdirSync(cartellaRegistri, { recursive: true });
const giorno = new Date().toISOString().slice(0, 10);

const server = creaServer({
  ambiente: caricaAmbiente(),
  config,
  orologio: orologioVero,
  // Registro delle azioni di ogni partita, un file per stanza (non salvato in Git).
  suRegistro: (codice, riga) => appendFileSync(`${cartellaRegistri}${giorno}-${codice}.jsonl`, JSON.stringify(riga) + "\n"),
});

try {
  const indirizzo = await server.avvia(porta);
  const tv = `http://localhost:${porta}/tv`;
  console.log("");
  console.log("  IL DIRETTIVO — server acceso");
  console.log("");
  console.log(`  Pagina TV (su questo PC):  ${tv}`);
  console.log(`  Telefoni (Wi-Fi di casa):  ${indirizzo}/p   oppure inquadra il QR sulla TV`);
  console.log("");
  console.log("  Per spegnere: premi Ctrl+C in questa finestra.");
  console.log("");
  if (!argomenti.includes("--non-aprire") && process.platform === "win32") exec(`start "" "${tv}"`);
} catch (e) {
  const err = e as NodeJS.ErrnoException;
  if (err.code === "EADDRINUSE") console.error(`\n  La porta ${porta} è già occupata: forse il server è già acceso in un'altra finestra.\n  Chiudi l'altra finestra, oppure usa: corepack pnpm gioca -- --porta ${porta + 1}\n`);
  else console.error(e);
  process.exit(1);
}

const spegni = async () => {
  await server.chiudi();
  process.exit(0);
};
process.on("SIGINT", spegni);
process.on("SIGTERM", spegni);
