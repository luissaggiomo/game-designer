/**
 * Test della stanza (senza rete): sala d'attesa, comandi, timer, pausa, chiusura anticipata,
 * bot, riconnessione e riservatezza di ciò che riceve ogni dispositivo.
 */
import { describe, expect, it } from "vitest";
import { caricaAmbiente, type Evento } from "@il-direttivo/engine";
import { caricaConfigServer, controllaConfigServer } from "../src/config.js";
import { Stanza, type Chi, type StatoDispositivo } from "../src/stanza.js";
import { OrologioFinto, problemiRiservatezza } from "./aiuti.js";

const ambiente = caricaAmbiente();
const config = caricaConfigServer();
const TV: Chi = { tipo: "TV", comandi: true };
const TV_SOLO_VISTA: Chi = { tipo: "TV", comandi: false };

function nuova(seme = 7) {
  const orologio = new OrologioFinto();
  const cambi: Evento[][] = [];
  const stanza = new Stanza({ codice: "ABCD", ambiente, config, orologio, seme, suCambiamento: (e) => cambi.push(e) });
  return { stanza, orologio, cambi };
}

function conBot(stanza: Stanza, n: number) {
  for (let i = 0; i < n; i++) expect(stanza.comando(TV, { tipo: "AGGIUNGI_BOT" }).ok).toBe(true);
}

describe("configurazione del server", () => {
  it("config.json ha una sezione server valida", () => {
    expect(controllaConfigServer(config)).toEqual([]);
  });

  it("segnala i valori sbagliati", () => {
    const rotta = { ...config, porta: -1, secondiPerFase: { ...config.secondiPerFase, VOTO_PACCHETTO: 0 } };
    expect(controllaConfigServer(rotta).length).toBe(2);
  });
});

describe("sala d'attesa", () => {
  it("il primo telefono è il capo partita; la TV che ha creato la stanza ha i comandi", () => {
    const { stanza } = nuova();
    const a = stanza.entraTelefono("Anna");
    const b = stanza.entraTelefono("Bruno");
    if (!a.ok || !b.ok) throw new Error("ingresso");
    expect(stanza.statoPer({ tipo: "GIOCATORE", id: a.id }).info.sonoCapo).toBe(true);
    expect(stanza.statoPer({ tipo: "GIOCATORE", id: b.id }).info.sonoCapo).toBe(false);
    expect(stanza.statoPer(TV).info.sonoCapo).toBe(true);
    expect(stanza.statoPer(TV_SOLO_VISTA).info.sonoCapo).toBe(false);
    expect(stanza.comando({ tipo: "GIOCATORE", id: b.id }, { tipo: "AGGIUNGI_BOT" }).ok).toBe(false);
    expect(stanza.comando(TV_SOLO_VISTA, { tipo: "AGGIUNGI_BOT" }).ok).toBe(false);
    expect(stanza.comando({ tipo: "GIOCATORE", id: a.id }, { tipo: "AGGIUNGI_BOT" }).ok).toBe(true);
  });

  it("controlla i nomi e il numero massimo di giocatori", () => {
    const { stanza } = nuova();
    expect(stanza.entraTelefono("  ").ok).toBe(false);
    expect(stanza.entraTelefono("x".repeat(config.caratteriNome + 1)).ok).toBe(false);
    expect(stanza.entraTelefono("Anna").ok).toBe(true);
    expect(stanza.entraTelefono("anna").ok).toBe(false);
    conBot(stanza, 7);
    expect(stanza.comando(TV, { tipo: "AGGIUNGI_BOT" }).ok).toBe(false);
    expect(stanza.entraTelefono("Carla").ok).toBe(false);
    expect(stanza.comando(TV, { tipo: "TOGLI_BOT" }).ok).toBe(true);
    expect(stanza.entraTelefono("Carla").ok).toBe(true);
  });

  it("non parte con meno di 4 giocatori; dopo l'avvio non entra nessuno di nuovo, ma si rientra col token", () => {
    const { stanza } = nuova();
    const a = stanza.entraTelefono("Anna");
    if (!a.ok) throw new Error("ingresso");
    conBot(stanza, 2);
    expect(stanza.comando(TV, { tipo: "AVVIA" }).ok).toBe(false);
    conBot(stanza, 1);
    expect(stanza.comando(TV, { tipo: "AVVIA" }).ok).toBe(true);
    expect(stanza.entraTelefono("Bruno").ok).toBe(false);
    expect(stanza.riprendi(a.token)).toBe(a.id);
    expect(stanza.riprendi("token-falso")).toBeUndefined();
    const s = stanza.statoPer({ tipo: "GIOCATORE", id: a.id });
    expect(s.vista?.tipo).toBe("GIOCATORE");
  });
});

describe("timer, pausa, avanti, chiusura anticipata (D-066, D-080)", () => {
  it("la scelta dell'obiettivo dura secondiPerLaScelta, poi la fase avanza da sola", () => {
    const { stanza, orologio } = nuova();
    stanza.entraTelefono("Anna");
    conBot(stanza, 3);
    stanza.comando(TV, { tipo: "AVVIA" });
    expect(stanza.fase).toBe("SCELTA_OBIETTIVI");
    orologio.avanza(ambiente.config.obiettivi.secondiPerLaScelta * 1000 - 1);
    expect(stanza.fase).toBe("SCELTA_OBIETTIVI"); // Anna non ha scelto: si aspetta
    orologio.avanza(1);
    expect(stanza.fase).toBe("RAPPORTO");
  });

  it("si chiude in anticipo quando tutti hanno agito", () => {
    const { stanza, orologio } = nuova();
    const a = stanza.entraTelefono("Anna");
    if (!a.ok) throw new Error("ingresso");
    conBot(stanza, 3);
    stanza.comando(TV, { tipo: "AVVIA" });
    const [, max] = config.secondiRitardoBot;
    orologio.avanza(max * 1000); // i bot hanno scelto
    expect(stanza.fase).toBe("SCELTA_OBIETTIVI");
    const proposte = (stanza.statoPer({ tipo: "GIOCATORE", id: a.id }).vista as { obiettivo: { proposte: { id: string }[] } }).obiettivo.proposte;
    expect(stanza.azione(a.id, { tipo: "SCEGLI_OBIETTIVO", obiettivo: proposte[0]!.id }).ok).toBe(true);
    expect(stanza.statoPer(TV).info.inAttesaDi).toEqual([]);
    orologio.avanza(config.secondiChiusuraAnticipata * 1000);
    expect(stanza.fase).toBe("RAPPORTO");
  });

  it("la pausa ferma il tempo e i bot; riprendendo il tempo rimasto è lo stesso", () => {
    const { stanza, orologio } = nuova();
    stanza.entraTelefono("Anna");
    conBot(stanza, 3);
    stanza.comando(TV, { tipo: "AVVIA" });
    orologio.avanza(1000);
    stanza.comando(TV, { tipo: "PAUSA" });
    const info = stanza.statoPer(TV).info;
    expect(info.timer.inPausa).toBe(true);
    expect(info.timer.scadenza).toBeNull();
    const rimasto = info.timer.rimanenteMs!;
    expect(rimasto).toBe(ambiente.config.obiettivi.secondiPerLaScelta * 1000 - 1000);
    expect(orologio.inAttesa).toBe(0); // nessun timer e nessun bot in attesa
    orologio.avanza(10 * 60_000);
    expect(stanza.fase).toBe("SCELTA_OBIETTIVI");
    stanza.comando(TV, { tipo: "RIPRENDI" });
    expect(stanza.statoPer(TV).info.timer.scadenza).toBe(orologio.ora() + rimasto);
    orologio.avanza(rimasto);
    expect(stanza.fase).toBe("RAPPORTO");
  });

  it("Avanti chiude subito la fase; Punteggio e Lettura dei messaggi aspettano Avanti", () => {
    const { stanza, orologio } = nuova(11);
    conBot(stanza, 5);
    stanza.comando(TV, { tipo: "AVVIA" });
    expect(stanza.comando(TV, { tipo: "AVANTI" }).ok).toBe(true);
    expect(stanza.fase).toBe("RAPPORTO");
    // Si gioca a tempo pieno fino al punteggio.
    for (let i = 0; i < 200 && stanza.fase !== "PUNTEGGIO"; i++) orologio.avanza(60_000);
    expect(stanza.fase).toBe("PUNTEGGIO");
    expect(stanza.statoPer(TV).info.timer.scadenza).toBeNull();
    orologio.avanza(60 * 60_000);
    expect(stanza.fase).toBe("PUNTEGGIO");
    stanza.comando(TV, { tipo: "AVANTI" });
    expect(stanza.fase).toBe("LETTURA_MESSAGGI");
    stanza.comando(TV, { tipo: "AVANTI" });
    expect(stanza.fase).toBe("FINE");
    expect(stanza.comando(TV, { tipo: "AVANTI" }).ok).toBe(false);
  }, 30_000);
});

describe("azioni dal telefono", () => {
  it("il mittente lo decide il server; i bot non si comandano dal telefono; niente AVANZA_FASE", () => {
    const { stanza } = nuova();
    const a = stanza.entraTelefono("Anna");
    if (!a.ok) throw new Error("ingresso");
    conBot(stanza, 3);
    stanza.comando(TV, { tipo: "AVVIA" });
    expect(stanza.azione(a.id, { tipo: "AVANZA_FASE" } as never).ok).toBe(false);
    expect(stanza.azione("b1", { tipo: "MOSSA_PRIVATA", scelta: "AZIENDA" } as never).ok).toBe(false);
    expect(stanza.azione(a.id, null as never).ok).toBe(false);
    // Un "da" falso viene sovrascritto: l'azione vale per Anna (qui rifiutata solo perché non è la fase).
    const r = stanza.azione(a.id, { tipo: "MOSSA_PRIVATA", scelta: "AZIENDA", da: "b1" } as never);
    expect(r.ok).toBe(false);
  });
});

describe("bot (D-065, D-080)", () => {
  it("con 'bot spie: no' le spie sono solo tra le persone; il carattere dei bot si vede solo a fine partita", () => {
    let spieBot = 0;
    let spieUmane = 0;
    for (let seme = 1; seme <= 20; seme++) {
      const { stanza, orologio } = nuova(seme);
      const a = stanza.entraTelefono("Anna");
      if (!a.ok) throw new Error("ingresso");
      conBot(stanza, 4);
      stanza.comando(TV, { tipo: "BOT_SPIE", valore: false });
      stanza.comando(TV, { tipo: "AVVIA" });
      expect(stanza.statoPer(TV).info.carattereBot).toBeUndefined();
      for (let i = 0; i < 300 && stanza.fase !== "FINE"; i++) {
        orologio.avanza(60_000);
        if (stanza.fase === "PUNTEGGIO" || stanza.fase === "LETTURA_MESSAGGI") stanza.comando(TV, { tipo: "AVANTI" });
      }
      const fine = stanza.statoPer(TV);
      expect(fine.vista?.fase.nome).toBe("FINE");
      const caratteri = fine.info.carattereBot!;
      expect(Object.keys(caratteri).sort()).toEqual(["b1", "b2", "b3", "b4"]);
      spieBot += Object.values(caratteri).filter((c) => c?.startsWith("SPIA")).length;
      const anna = fine.vista!.giocatori.find((g) => g.id === a.id)!;
      if (anna.fazione?.tipo === "SPIA") spieUmane++;
    }
    expect(spieBot).toBe(0);
    expect(spieUmane).toBeGreaterThan(10); // spia spostata sulla persona (D-080 punto 2)
  }, 120_000);

  it("con 'bot spie: sì' (predefinito) i bot possono essere spie, prudenti o aggressive", () => {
    const caratteri = new Set<string>();
    for (let seme = 1; seme <= 20; seme++) {
      const { stanza, orologio } = nuova(seme);
      conBot(stanza, 5);
      expect(stanza.statoPer(TV).info.opzioni.botSpie).toBe(true);
      stanza.comando(TV, { tipo: "AVVIA" });
      for (let i = 0; i < 300 && stanza.fase !== "FINE"; i++) {
        orologio.avanza(60_000);
        if (stanza.fase === "PUNTEGGIO" || stanza.fase === "LETTURA_MESSAGGI") stanza.comando(TV, { tipo: "AVANTI" });
      }
      for (const c of Object.values(stanza.statoPer(TV).info.carattereBot ?? {})) if (c) caratteri.add(c);
    }
    expect(caratteri).toEqual(new Set(["COOPERATIVO", "EGOISTA", "SPIA_PRUDENTE", "SPIA_AGGRESSIVA"]));
  }, 120_000);
});

describe("riservatezza di ciò che riceve ogni dispositivo (regola 3)", () => {
  it("in partite intere TV e telefono ricevono solo la propria vista e i propri eventi", () => {
    for (let seme = 1; seme <= 12; seme++) {
      const orologio = new OrologioFinto();
      const ricevuti: { chi: string | undefined; s: StatoDispositivo }[] = [];
      let stanza!: Stanza;
      let ids: string[] = [];
      stanza = new Stanza({
        codice: "ABCD",
        ambiente,
        config,
        orologio,
        seme,
        suCambiamento: (eventi) => {
          ricevuti.push({ chi: undefined, s: stanza.statoPer(TV, eventi) });
          for (const id of ids) ricevuti.push({ chi: id, s: stanza.statoPer({ tipo: "GIOCATORE", id }, eventi) });
        },
      });
      const a = stanza.entraTelefono("Anna");
      const b = stanza.entraTelefono("Bruno");
      if (!a.ok || !b.ok) throw new Error("ingresso");
      ids = [a.id, b.id];
      conBot(stanza, 2 + (seme % 5));
      stanza.comando(TV, { tipo: "AVVIA" });
      for (let i = 0; i < 300 && stanza.fase !== "FINE"; i++) {
        orologio.avanza(30_000);
        if (stanza.fase === "PUNTEGGIO" || stanza.fase === "LETTURA_MESSAGGI") stanza.comando(TV, { tipo: "AVANTI" });
      }
      expect(stanza.fase).toBe("FINE");
      for (const r of ricevuti) expect(problemiRiservatezza(r.s, r.chi, [a.token, b.token, stanza.tokenTV])).toEqual([]);
    }
  }, 120_000);
});
