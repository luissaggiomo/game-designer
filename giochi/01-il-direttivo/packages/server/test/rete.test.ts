/**
 * Prova attraverso la rete vera (Socket.IO su una porta del PC): una partita intera con soli bot,
 * comandata dalla pagina TV, e un telefono che entra, si scollega e rientra col suo token.
 * I tempi sono accelerati (fattoreTempo) per non aspettare un'ora.
 */
import { afterEach, describe, expect, it } from "vitest";
import { io as connetti, type Socket } from "socket.io-client";
import { caricaAmbiente } from "@il-direttivo/engine";
import { caricaConfigServer, orologioVero } from "../src/config.js";
import { creaServer, type ServerGioco } from "../src/rete.js";
import type { StatoDispositivo } from "../src/stanza.js";
import { problemiRiservatezza } from "./aiuti.js";

const ambiente = caricaAmbiente();
const config = caricaConfigServer();
let server: ServerGioco | undefined;
const prese: Socket[] = [];

afterEach(async () => {
  for (const s of prese.splice(0)) s.disconnect();
  await server?.chiudi();
  server = undefined;
});

async function avvia(fattoreTempo: number, seme: number) {
  server = creaServer({ ambiente, config, orologio: orologioVero, fattoreTempo, seme, indirizzoPubblico: "http://prova" });
  await server.avvia(0, "127.0.0.1");
  const indirizzo = server.app.server.address();
  const porta = typeof indirizzo === "object" && indirizzo ? indirizzo.port : 0;
  return `http://127.0.0.1:${porta}`;
}

function presa(url: string): Socket {
  const s = connetti(url, { transports: ["websocket"], forceNew: true });
  prese.push(s);
  return s;
}

const chiedi = <T>(s: Socket, evento: string, dati?: unknown): Promise<T> => new Promise((ok) => s.emit(evento, dati, ok));

describe("server in rete", () => {
  it("una partita intera con soli bot arriva alla fine, comandata dalla TV", async () => {
    const url = await avvia(0.0005, 5);
    const tv = presa(url);
    const stati: StatoDispositivo[] = [];
    let fine!: () => void;
    const finita = new Promise<void>((ok) => (fine = ok));
    tv.on("stato", (s: StatoDispositivo) => {
      stati.push(s);
      const fase = s.vista?.fase.nome;
      // Punteggio e Lettura dei messaggi vanno avanti solo con "Avanti" (D-080).
      if (fase === "PUNTEGGIO" || fase === "LETTURA_MESSAGGI") tv.emit("comando", { tipo: "AVANTI" });
      if (fase === "FINE") fine();
    });
    const creata = await chiedi<{ ok: boolean; codice: string; token: string }>(tv, "tv:crea");
    expect(creata.ok).toBe(true);
    expect(creata.codice).toMatch(/^[A-HJ-NP-Z2-9]{4}$/);
    for (let i = 0; i < 6; i++) expect((await chiedi<{ ok: boolean }>(tv, "comando", { tipo: "AGGIUNGI_BOT" })).ok).toBe(true);
    expect((await chiedi<{ ok: boolean }>(tv, "comando", { tipo: "AVVIA" })).ok).toBe(true);
    await finita;

    const ultimo = stati.at(-1)!;
    expect(ultimo.vista?.fase.nome).toBe("FINE");
    expect(ultimo.vista?.punteggi).toBeDefined();
    expect(Object.keys(ultimo.info.carattereBot ?? {})).toHaveLength(6);
    // Sono passati tutti e quattro i trimestri e il finale.
    const trimestri = new Set(stati.map((s) => s.vista?.trimestre));
    expect([...trimestri].filter((t) => t !== undefined).sort()).toEqual([1, 2, 3, 4]);
    for (const s of stati) expect(problemiRiservatezza(s, undefined, [creata.token])).toEqual([]);

    // Il QR della stanza esiste; quello di una stanza inventata no.
    const qr = await fetch(`${url}/qr/${creata.codice}`);
    expect(qr.status).toBe(200);
    expect(qr.headers.get("content-type")).toContain("image/svg+xml");
    expect((await fetch(`${url}/qr/ZZZZ`)).status).toBe(404);
  }, 120_000);

  it("un telefono entra, vede solo la sua vista, si scollega e rientra nello stesso posto", async () => {
    const url = await avvia(1, 9); // tempi veri: la partita resta nella scelta dell'obiettivo
    const tv = presa(url);
    const creata = await chiedi<{ ok: boolean; codice: string; token: string }>(tv, "tv:crea");
    const tel = presa(url);
    const entrato = await chiedi<{ ok: boolean; token: string; id: string }>(tel, "telefono:entra", { codice: creata.codice.toLowerCase(), nome: "Luis" });
    expect(entrato.ok).toBe(true);
    // Il primo telefono è capo partita: può aggiungere i bot e avviare.
    for (let i = 0; i < 3; i++) expect((await chiedi<{ ok: boolean }>(tel, "comando", { tipo: "AGGIUNGI_BOT" })).ok).toBe(true);
    const statoTel = new Promise<StatoDispositivo>((ok) => tel.once("stato", ok));
    expect((await chiedi<{ ok: boolean }>(tel, "comando", { tipo: "AVVIA" })).ok).toBe(true);
    const s = await statoTel;
    expect(s.vista?.tipo).toBe("GIOCATORE");
    expect(problemiRiservatezza(s, entrato.id, [creata.token])).toEqual([]);

    // Una TV aperta col solo codice vede la partita ma non ha i comandi.
    const tv2 = presa(url);
    expect((await chiedi<{ ok: boolean }>(tv2, "tv:entra", { codice: creata.codice })).ok).toBe(true);
    expect((await chiedi<{ ok: boolean }>(tv2, "comando", { tipo: "PAUSA" })).ok).toBe(false);

    // Disconnessione: la TV vede il telefono scollegato.
    const scollegato = new Promise<StatoDispositivo>((ok) => {
      tv.on("stato", (x: StatoDispositivo) => {
        if (x.info.partecipanti.find((p) => p.id === entrato.id)?.connesso === false) ok(x);
      });
    });
    tel.disconnect();
    await scollegato;

    // Un nuovo telefono non può entrare a partita iniziata; quello vecchio rientra col token.
    const intruso = presa(url);
    expect((await chiedi<{ ok: boolean }>(intruso, "telefono:entra", { codice: creata.codice, nome: "Altro" })).ok).toBe(false);
    expect((await chiedi<{ ok: boolean }>(intruso, "telefono:riprendi", { codice: creata.codice, token: "sbagliato" })).ok).toBe(false);
    const rientro = presa(url);
    const statoRientro = new Promise<StatoDispositivo>((ok) => rientro.once("stato", ok));
    const ripreso = await chiedi<{ ok: boolean; id: string }>(rientro, "telefono:riprendi", { codice: creata.codice, token: entrato.token });
    expect(ripreso).toMatchObject({ ok: true, id: entrato.id });
    const dopo = await statoRientro;
    expect(dopo.vista?.tipo === "GIOCATORE" && dopo.vista.io.id).toBe(entrato.id);

    // L'azione arriva al motore con il mittente deciso dal server.
    const proposte = (dopo.vista as { obiettivo: { proposte: { id: string }[] } }).obiettivo.proposte;
    expect((await chiedi<{ ok: boolean }>(rientro, "azione", { tipo: "SCEGLI_OBIETTIVO", obiettivo: proposte[0]!.id })).ok).toBe(true);
    expect((await chiedi<{ ok: boolean }>(tv, "azione", { tipo: "SCEGLI_OBIETTIVO", obiettivo: proposte[0]!.id })).ok).toBe(false);
  }, 30_000);

  it("le pagine TV e telefono si aprono", async () => {
    const url = await avvia(1, 1);
    expect((await fetch(`${url}/tv`)).status).toBe(200);
    expect((await fetch(`${url}/p/ABCD`)).status).toBe(200);
    expect(await (await fetch(`${url}/info`)).json()).toEqual({ indirizzo: "http://prova" });
  });
});
