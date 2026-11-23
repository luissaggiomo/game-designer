/**
 * Rete: pagine web, QR e canale in tempo reale (Socket.IO) verso TV e telefoni.
 * Architettura §6 (stanza, QR, sessione) e §7 (comunicazione).
 *
 * Messaggi dal dispositivo al server (con risposta immediata "ok" o "errore"):
 *   tv:crea · tv:entra {codice, token?} · telefono:entra {codice, nome} · telefono:riprendi {codice, token}
 *   comando {tipo, valore?} · azione {…}
 * Dal server al dispositivo: "stato" = { info, vista, eventi }, solo la vista di quel dispositivo.
 */
import { readFile } from "node:fs/promises";
import { networkInterfaces } from "node:os";
import { fileURLToPath } from "node:url";
import Fastify, { type FastifyInstance } from "fastify";
import QRCode from "qrcode";
import { Server, type Socket } from "socket.io";
import type { Ambiente } from "@il-direttivo/engine";
import type { ConfigServer, Orologio } from "./config.js";
import { Stanza, type AzioneDalTelefono, type Chi, type Comando, type Risposta } from "./stanza.js";

/** Lettere e cifre del codice stanza, senza quelle che si confondono (O/0, I/1, Architettura §6.2). */
const ALFABETO = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const CARTELLA_PAGINE = fileURLToPath(new URL("../pubblico/", import.meta.url));

export interface OpzioniServer {
  ambiente: Ambiente;
  config: ConfigServer;
  orologio: Orologio;
  /** Moltiplica tutti i tempi (solo test). */
  fattoreTempo?: number;
  /** Seme fisso per tutte le partite (solo test). */
  seme?: number;
  /** Indirizzo da mettere nel QR (es. http://192.168.1.20:3000); se assente lo calcola. */
  indirizzoPubblico?: string;
  suRegistro?: (codice: string, riga: object) => void;
}

export interface ServerGioco {
  app: FastifyInstance;
  io: Server;
  stanze: Map<string, Stanza>;
  avvia(porta: number, host?: string): Promise<string>;
  chiudi(): Promise<void>;
}

/** Indirizzo del PC nella rete di casa (es. 192.168.1.20), per il QR (D-067). */
export function indirizzoRetLocale(): string | undefined {
  const candidati = Object.values(networkInterfaces())
    .flat()
    .filter((i) => i && i.family === "IPv4" && !i.internal)
    .map((i) => i!.address);
  // Prima le reti di casa più comuni.
  return candidati.find((a) => a.startsWith("192.168.")) ?? candidati.find((a) => a.startsWith("10.")) ?? candidati.find((a) => /^172\.(1[6-9]|2\d|3[01])\./.test(a)) ?? candidati[0];
}

export function creaServer(o: OpzioniServer): ServerGioco {
  const app = Fastify({ logger: false });
  const io = new Server(app.server, { cors: { origin: false } });
  const stanze = new Map<string, Stanza>();
  /** Dispositivi collegati a ogni stanza, con chi sono. */
  const collegati = new Map<string, Map<Socket, Chi>>();
  let indirizzo = o.indirizzoPubblico ?? "";

  const nuovoCodice = (): string => {
    for (;;) {
      let c = "";
      for (let i = 0; i < o.config.lunghezzaCodice; i++) c += ALFABETO[Math.floor(Math.random() * ALFABETO.length)];
      if (!stanze.has(c)) return c;
    }
  };

  const invia = (codice: string, eventi: Parameters<Stanza["statoPer"]>[1] = []) => {
    const stanza = stanze.get(codice);
    if (!stanza) return;
    for (const [socket, chi] of collegati.get(codice) ?? []) socket.emit("stato", stanza.statoPer(chi, eventi));
  };

  const creaStanza = (): Stanza => {
    const codice = nuovoCodice();
    const stanza = new Stanza({
      codice,
      ambiente: o.ambiente,
      config: o.config,
      orologio: o.orologio,
      ...(o.seme !== undefined ? { seme: o.seme } : {}),
      ...(o.fattoreTempo !== undefined ? { fattoreTempo: o.fattoreTempo } : {}),
      suCambiamento: (eventi) => invia(codice, eventi),
      ...(o.suRegistro ? { suRegistro: (riga: object) => o.suRegistro!(codice, riga) } : {}),
    });
    stanze.set(codice, stanza);
    collegati.set(codice, new Map());
    return stanza;
  };

  // Le stanze ferme da troppo tempo si cancellano (Architettura §15).
  const pulizia = setInterval(() => {
    const limite = o.orologio.ora() - o.config.oreScadenzaStanza * 3600_000;
    for (const [codice, s] of stanze) {
      if (s.ultimaAttivita < limite && (collegati.get(codice)?.size ?? 0) === 0) {
        s.chiudi();
        stanze.delete(codice);
        collegati.delete(codice);
      }
    }
  }, 10 * 60_000);
  pulizia.unref();

  // ───────────── Pagine ─────────────
  const pagina = (file: string) => async (_req: unknown, reply: { type: (t: string) => { send: (b: string) => void } }) =>
    reply.type("text/html; charset=utf-8").send(await readFile(CARTELLA_PAGINE + file, "utf-8"));

  app.get("/", async (_req, reply) => reply.redirect("/tv"));
  app.get("/tv", pagina("tv.html"));
  app.get("/p/:codice", pagina("telefono.html"));
  app.get("/p", pagina("telefono.html"));
  app.get("/info", async () => ({ indirizzo }));
  app.get<{ Params: { codice: string } }>("/qr/:codice", async (req, reply) => {
    const codice = String(req.params.codice).toUpperCase();
    if (!stanze.has(codice)) return reply.code(404).send("Stanza inesistente");
    const svg = await QRCode.toString(`${indirizzo}/p/${codice}`, { type: "svg", margin: 1, errorCorrectionLevel: "M" });
    return reply.type("image/svg+xml").send(svg);
  });

  // ───────────── Canale in tempo reale ─────────────
  io.on("connection", (socket) => {
    let codice: string | undefined;
    let chi: Chi | undefined;

    const aggancia = (stanza: Stanza, nuovo: Chi) => {
      sgancia();
      codice = stanza.codice;
      chi = nuovo;
      collegati.get(codice)!.set(socket, chi);
      if (chi.tipo === "GIOCATORE") stanza.collegato(chi.id, true);
      socket.emit("stato", stanza.statoPer(chi));
    };
    const sgancia = () => {
      if (!codice || !chi) return;
      const mappa = collegati.get(codice);
      mappa?.delete(socket);
      const stanza = stanze.get(codice);
      const io2 = chi;
      if (stanza && io2.tipo === "GIOCATORE" && ![...(mappa?.values() ?? [])].some((c) => c.tipo === "GIOCATORE" && c.id === io2.id)) stanza.collegato(io2.id, false);
      codice = undefined;
      chi = undefined;
    };
    const rispondi = (ack: unknown, r: Risposta<Record<string, unknown>>) => {
      if (typeof ack === "function") ack(r);
    };
    const trova = (c: unknown) => stanze.get(String(c ?? "").trim().toUpperCase());

    socket.on("tv:crea", (_dati: unknown, ack: unknown) => {
      const stanza = creaStanza();
      aggancia(stanza, { tipo: "TV", comandi: true });
      rispondi(ack, { ok: true, codice: stanza.codice, token: stanza.tokenTV });
    });

    socket.on("tv:entra", (dati: { codice?: string; token?: string } | undefined, ack: unknown) => {
      const stanza = trova(dati?.codice);
      if (!stanza) return rispondi(ack, { ok: false, errore: "Stanza inesistente" });
      aggancia(stanza, { tipo: "TV", comandi: dati?.token === stanza.tokenTV });
      rispondi(ack, { ok: true, codice: stanza.codice });
    });

    socket.on("telefono:entra", (dati: { codice?: string; nome?: string } | undefined, ack: unknown) => {
      const stanza = trova(dati?.codice);
      if (!stanza) return rispondi(ack, { ok: false, errore: "Codice stanza sbagliato" });
      const r = stanza.entraTelefono(String(dati?.nome ?? ""));
      if (!r.ok) return rispondi(ack, r);
      aggancia(stanza, { tipo: "GIOCATORE", id: r.id });
      rispondi(ack, { ok: true, codice: stanza.codice, token: r.token, id: r.id });
    });

    socket.on("telefono:riprendi", (dati: { codice?: string; token?: string } | undefined, ack: unknown) => {
      const stanza = trova(dati?.codice);
      if (!stanza) return rispondi(ack, { ok: false, errore: "La stanza non esiste più" });
      const id = stanza.riprendi(String(dati?.token ?? ""));
      if (!id) return rispondi(ack, { ok: false, errore: "Telefono non riconosciuto in questa stanza" });
      aggancia(stanza, { tipo: "GIOCATORE", id });
      rispondi(ack, { ok: true, codice: stanza.codice, id });
    });

    socket.on("comando", (c: Comando | undefined, ack: unknown) => {
      const stanza = codice ? stanze.get(codice) : undefined;
      if (!stanza || !chi) return rispondi(ack, { ok: false, errore: "Non sei in una stanza" });
      if (!c || typeof c !== "object") return rispondi(ack, { ok: false, errore: "Comando non riconosciuto" });
      rispondi(ack, stanza.comando(chi, c));
    });

    socket.on("azione", (a: AzioneDalTelefono | undefined, ack: unknown) => {
      const stanza = codice ? stanze.get(codice) : undefined;
      if (!stanza || !chi || chi.tipo !== "GIOCATORE") return rispondi(ack, { ok: false, errore: "Solo i giocatori possono agire" });
      rispondi(ack, stanza.azione(chi.id, a as AzioneDalTelefono));
    });

    socket.on("disconnect", sgancia);
  });

  return {
    app,
    io,
    stanze,
    async avvia(porta, host = "0.0.0.0") {
      await app.listen({ port: porta, host });
      const indirizzoReale = app.server.address();
      const portaReale = typeof indirizzoReale === "object" && indirizzoReale ? indirizzoReale.port : porta;
      if (!indirizzo) indirizzo = `http://${indirizzoRetLocale() ?? "localhost"}:${portaReale}`;
      return indirizzo;
    },
    async chiudi() {
      clearInterval(pulizia);
      for (const s of stanze.values()) s.chiudi();
      io.close();
      await app.close();
    },
  };
}
