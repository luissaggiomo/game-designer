/**
 * Segreti e messaggi (GDD §10, §11 · D-015, D-072, D-073, D-074).
 */
import { creaEAvvia } from "./aiuti.js";
import { describe, expect, it } from "vitest";
import type { AzioneGiocatore, Evento } from "../src/azioni.js";
import { caricaAmbiente, type Ambiente } from "../src/contenuti.js";
import { applica } from "../src/motore.js";
import { creaPartita } from "../src/partita.js";
import { calcolaPunteggi } from "../src/punteggio.js";
import { vistaGiocatore, vistaTV } from "../src/viste.js";
import type { Fazione, Giocatore, Partita, SegretoIstanza } from "../src/tipi.js";

const base = caricaAmbiente();
/** Ambiente senza casualità nei risultati, per controllare i conti. */
const amb: Ambiente = {
  ...base,
  config: {
    ...base.config,
    mossaPrivata: { ...base.config.mossaPrivata, rumore: [0] },
    concorrenti: { ...base.config.concorrenti, eventoCasuale: [0], crescitaMediaProposteESegreti: 0, quotaAziendalistaRiferimento: 0.5 },
  },
};

function nuova(seme = 21, n = 5, ambiente = amb): Partita {
  const esito = creaEAvvia(Array.from({ length: n }, (_, i) => ({ id: `g${i + 1}`, nome: `G${i + 1}` })), seme, ambiente);
  if (!esito.ok) throw new Error(esito.errore);
  return esito.partita;
}

function fai(p: Partita, azione: AzioneGiocatore | { tipo: "AVANZA_FASE" }, ambiente = amb): { partita: Partita; eventi: Evento[] } {
  const esito = applica(p, azione, ambiente);
  if (!esito.ok) throw new Error(esito.errore);
  return { partita: esito.partita, eventi: esito.eventi };
}
const rifiutata = (p: Partita, azione: AzioneGiocatore, ambiente = amb) => !applica(p, azione, ambiente).ok;
const avanza = (p: Partita) => fai(p, { tipo: "AVANZA_FASE" });

/** Avanza fino alla fase indicata del trimestre indicato (raccogliendo gli eventi). */
function vaiA(p: Partita, nome: string, trimestre = p.trimestre): { partita: Partita; eventi: Evento[] } {
  let q = p;
  const eventi: Evento[] = [];
  for (let i = 0; i < 200; i++) {
    if (q.fase.nome === nome && q.trimestre === trimestre) return { partita: q, eventi };
    const r = avanza(q);
    eventi.push(...r.eventi);
    q = r.partita;
  }
  throw new Error(`Fase ${nome} del trimestre ${trimestre} non raggiunta`);
}

const giocatoreDi = (p: Partita, reparto: string): Giocatore => p.giocatori.find((g) => g.repartoId === reparto)!;
const copiaDi = (p: Partita, s: SegretoIstanza, possessore: string) => p.copieSegreto.find((c) => c.segretoId === s.id && c.possessore === possessore);
const inoltra = (p: Partita, da: string, a: string, s: SegretoIstanza, campi?: Record<string, string | number>): Partita =>
  fai(p, { tipo: "INVIA_MESSAGGIO", da, a, anonimo: false, modello: "SEGRETO", copiaSegretoId: copiaDi(p, s, da)!.id, ...(campi ? { campi } : {}) }).partita;

/** Il primo collega che non è né fonte né destinatario del segreto. */
const intermediario = (p: Partita, s: SegretoIstanza, esclusi: string[] = []) =>
  p.giocatori.find((g) => g.repartoId !== s.fonte && g.repartoId !== s.utile && !esclusi.includes(g.id))!;

/** Porta il segreto al reparto utile passando per un intermediario (con 5 giocatori ne basta uno). */
function consegna(p: Partita, s: SegretoIstanza, campi?: Record<string, string>): Partita {
  const fonte = giocatoreDi(p, s.fonte);
  const mezzo = intermediario(p, s);
  const q = inoltra(p, fonte.id, mezzo.id, s, campi);
  return inoltra(q, mezzo.id, giocatoreDi(p, s.utile).id, s);
}

function rendiSpia(p: Partita, g: Giocatore): void {
  const fazione: Fazione = { tipo: "SPIA", concorrente: p.concorrenti[0]!.id };
  p.giocatori.find((x) => x.id === g.id)!.fazione = fazione;
}

/** Partita fino alla fine dell'anno (solo avanzamenti). */
function annoIntero(seme: number, n: number): Partita {
  const esito = creaPartita(Array.from({ length: n }, (_, i) => ({ id: `g${i + 1}`, nome: `G${i + 1}` })), seme, base);
  if (!esito.ok) throw new Error(esito.errore);
  let p = esito.partita;
  while (p.fase.nome !== "DOMANDA") p = fai(p, { tipo: "AVANZA_FASE" }, base).partita;
  return p;
}

describe("distribuzione: un vero e un finto a trimestre (D-072, D-074)", () => {
  it("dal 1° al 3° trimestre due segreti dello stesso tipo, uno solo finto; nel 4° nessuno", () => {
    for (const seme of [1, 2, 3, 4, 5]) {
      const p = annoIntero(seme, 6);
      for (let t = 1; t <= 3; t++) {
        const coppia = p.segreti.filter((s) => s.trimestre === t);
        expect(coppia).toHaveLength(2);
        expect(coppia[0]!.tipo).toBe(coppia[1]!.tipo);
        expect(coppia.filter((s) => s.finto)).toHaveLength(1);
        for (const s of coppia) expect(s.scadenza).toBe(t + 1);
      }
      expect(p.segreti.filter((s) => s.trimestre === 4)).toHaveLength(0);
    }
  });

  it("la fonte riceve il dato senza nessuna garanzia: «arrivato al tuo reparto», niente «dato certo»", () => {
    const esito = creaEAvvia(Array.from({ length: 5 }, (_, i) => ({ id: `g${i + 1}`, nome: `G${i + 1}` })), 21, amb);
    if (!esito.ok) throw new Error(esito.errore);
    const ricevuti = esito.eventi.filter((x) => x.tipo === "SEGRETO_RICEVUTO");
    expect(ricevuti).toHaveLength(2);
    for (const e of ricevuti) {
      expect(e.riservatoA).toHaveLength(1);
      expect(e.causa).toContain("Arrivato al tuo reparto");
      expect(e.causa).not.toContain("certo");
    }
    for (const s of esito.partita.segreti) {
      expect(s.fonte).not.toBe(s.utile);
      expect(copiaDi(esito.partita, s, giocatoreDi(esito.partita, s.fonte).id)!.provenienza).toEqual({ tipo: "GIOCO" });
    }
  });

  it("la spia sta al massimo in un segreto per trimestre, e quel segreto è sempre il finto", () => {
    let conSpia = 0;
    for (const n of [4, 5, 6, 7, 8]) {
      for (let seme = 1; seme <= 15; seme++) {
        const p = annoIntero(seme, n);
        const spie = p.giocatori.filter((g) => g.fazione.tipo === "SPIA").map((g) => g.repartoId);
        if (spie.length === 0) continue;
        for (let t = 1; t <= 3; t++) {
          const coinvolti = p.segreti.filter((s) => s.trimestre === t && (spie.includes(s.fonte) || spie.includes(s.utile)));
          expect(coinvolti.length, `${n} giocatori, seme ${seme}, trimestre ${t}`).toBeLessThanOrEqual(1);
          for (const s of coinvolti) expect(s.finto).toBe(true);
          conSpia += coinvolti.length;
        }
      }
    }
    expect(conSpia).toBeGreaterThan(50); // il caso si presenta davvero (con 4 giocatori sempre)
  }, 30_000);

  it("ognuno, spia compresa, è fonte o destinatario lo stesso numero di volte (±1)", () => {
    for (const n of [4, 5, 6, 7, 8]) {
      for (let seme = 1; seme <= 20; seme++) {
        const p = annoIntero(seme, n);
        const conteggi = p.giocatori.map((g) => p.coinvolgimentiSegreti[g.id] ?? 0);
        expect(Math.max(...conteggi) - Math.min(...conteggi), `${n} giocatori, seme ${seme}`).toBeLessThanOrEqual(1);
      }
    }
  }, 30_000);

  it("nel Rapporto la TV annuncia ogni segreto, il reparto a cui serve e la scadenza, mai chi l'ha ricevuto", () => {
    const esito = creaEAvvia(Array.from({ length: 5 }, (_, i) => ({ id: `g${i + 1}`, nome: `G${i + 1}` })), 21, amb);
    if (!esito.ok) throw new Error(esito.errore);
    const annunci = esito.eventi.filter((e) => e.tipo === "SEGRETO_ANNUNCIATO");
    expect(annunci).toHaveLength(2);
    for (const e of annunci) {
      if (e.tipo !== "SEGRETO_ANNUNCIATO") continue;
      const s = esito.partita.segreti.find((x) => x.id === e.segretoId)!;
      expect(e.riservatoA).toBeUndefined();
      expect(e.causa).toContain(amb.config.reparti.nomi[s.utile]);
      expect(e.causa).toContain(s.titolo);
      expect(e.causa).toContain("entro la fine del prossimo trimestre");
      for (const g of esito.partita.giocatori) expect(e.causa).not.toContain(g.nome);
    }
  });
});

describe("messaggi privati (GDD §10, D-021)", () => {
  const p = nuova();
  const [a, b] = p.giocatori as [Giocatore, Giocatore];

  it("un messaggio costa 1, l'anonimo costa 2", () => {
    const dopo1 = fai(p, { tipo: "INVIA_MESSAGGIO", da: a.id, a: b.id, anonimo: false, modello: "SOLO_TESTO", testo: "Fidati di me" }).partita;
    expect(dopo1.giocatori.find((g) => g.id === a.id)!.quotaMessaggi).toBe(1);
    const dopo2 = fai(p, { tipo: "INVIA_MESSAGGIO", da: a.id, a: b.id, anonimo: true, modello: "SOLO_TESTO", testo: "Occhio" }).partita;
    expect(dopo2.giocatori.find((g) => g.id === a.id)!.quotaMessaggi).toBe(0);
  });

  it("senza quota sufficiente il messaggio è rifiutato (anche l'anonimo con 1 solo messaggio)", () => {
    const dopo1 = fai(p, { tipo: "INVIA_MESSAGGIO", da: a.id, a: b.id, anonimo: false, modello: "SOLO_TESTO", testo: "uno" }).partita;
    expect(rifiutata(dopo1, { tipo: "INVIA_MESSAGGIO", da: a.id, a: b.id, anonimo: true, modello: "SOLO_TESTO", testo: "due" })).toBe(true);
  });

  it("testo oltre 80 caratteri, messaggio a se stessi o vuoto: rifiutati", () => {
    expect(rifiutata(p, { tipo: "INVIA_MESSAGGIO", da: a.id, a: b.id, anonimo: false, modello: "SOLO_TESTO", testo: "x".repeat(81) })).toBe(true);
    expect(rifiutata(p, { tipo: "INVIA_MESSAGGIO", da: a.id, a: a.id, anonimo: false, modello: "SOLO_TESTO", testo: "ciao" })).toBe(true);
    expect(rifiutata(p, { tipo: "INVIA_MESSAGGIO", da: a.id, a: b.id, anonimo: false, modello: "SOLO_TESTO" })).toBe(true);
  });

  it("l'avviso arriva solo al destinatario e, se anonimo, senza il nome del mittente", () => {
    const { eventi } = fai(p, { tipo: "INVIA_MESSAGGIO", da: a.id, a: b.id, anonimo: true, modello: "SOLO_TESTO", testo: "?" });
    expect(eventi[0]).toMatchObject({ tipo: "MESSAGGIO_RICEVUTO", riservatoA: [b.id] });
    expect(eventi[0]!.causa).not.toContain(a.nome);
  });

  it("con l'impostazione predefinita non si scrive durante la mossa privata; con 'tutto il trimestre' sì", () => {
    const inMossa = vaiA(p, "MOSSA_PRIVATA").partita;
    const azione: AzioneGiocatore = { tipo: "INVIA_MESSAGGIO", da: a.id, a: b.id, anonimo: false, modello: "SOLO_TESTO", testo: "ehi" };
    expect(rifiutata(inMossa, azione)).toBe(true);
    const sempre: Ambiente = { ...amb, config: { ...amb.config, messaggi: { ...amb.config.messaggi, quando: "TUTTO_IL_TRIMESTRE" } } };
    expect(applica(inMossa, azione, sempre).ok).toBe(true);
  });

  it("si scrive anche durante il voto del pacchetto (D-068)", () => {
    const alVoto = vaiA(p, "VOTO_PACCHETTO").partita;
    expect(rifiutata(alVoto, { tipo: "INVIA_MESSAGGIO", da: a.id, a: b.id, anonimo: false, modello: "SOLO_TESTO", testo: "votiamo la grande" })).toBe(false);
  });
});

describe("inoltro e catena minima (GDD §11.2–11.4, D-015, D-073)", () => {
  const p = nuova();
  const s = p.segreti[0]!;
  const fonte = giocatoreDi(p, s.fonte);
  const utile = giocatoreDi(p, s.utile);
  const mezzo = intermediario(p, s);
  const campo = Object.keys(s.campi)[0]!;

  it("inoltrato così com'è: copia vera; il destinatario vede il mittente diretto", () => {
    const q = inoltra(p, fonte.id, mezzo.id, s);
    const copia = copiaDi(q, s, mezzo.id)!;
    expect(copia.falsa).toBe(false);
    expect(copia.provenienza).toEqual({ tipo: "GIOCATORE", da: fonte.id, anonimo: false });
    expect(copia.catena).toEqual([fonte.id]);
  });

  it("inoltrato modificato: il gioco lo registra come falso", () => {
    expect(copiaDi(inoltra(p, fonte.id, mezzo.id, s, { [campo]: "valore inventato" }), s, mezzo.id)!.falsa).toBe(true);
  });

  it("mai di prima mano: con 5 giocatori deve passare da almeno un collega", () => {
    expect(rifiutata(p, { tipo: "INVIA_MESSAGGIO", da: fonte.id, a: utile.id, anonimo: false, modello: "SEGRETO", copiaSegretoId: copiaDi(p, s, fonte.id)!.id })).toBe(true);
    const q = inoltra(p, fonte.id, mezzo.id, s);
    expect(copiaDi(inoltra(q, mezzo.id, utile.id, s), s, utile.id)).toBeDefined();
  });

  it("con 6 giocatori servono due colleghi; il telefono dice quanti passaggi mancano", () => {
    const p6 = nuova(7, 6);
    const s6 = p6.segreti[0]!;
    const f = giocatoreDi(p6, s6.fonte);
    const u = giocatoreDi(p6, s6.utile);
    const primo = intermediario(p6, s6);
    const secondo = intermediario(p6, s6, [primo.id]);
    expect(vistaGiocatore(p6, f.id, amb).mieiSegreti.find((c) => c.titolo === s6.titolo)!.passaggiMancanti).toBe(2);
    let q = inoltra(p6, f.id, primo.id, s6);
    expect(vistaGiocatore(q, primo.id, amb).mieiSegreti[0]!.passaggiMancanti).toBe(1);
    expect(rifiutata(q, { tipo: "INVIA_MESSAGGIO", da: primo.id, a: u.id, anonimo: false, modello: "SEGRETO", copiaSegretoId: copiaDi(q, s6, primo.id)!.id })).toBe(true);
    q = inoltra(q, primo.id, secondo.id, s6);
    expect(vistaGiocatore(q, secondo.id, amb).mieiSegreti[0]!.passaggiMancanti).toBe(0);
    expect(copiaDi(inoltra(q, secondo.id, u.id, s6), s6, u.id)).toBeDefined();
  });

  it("non si inoltra a chi ha già il segreto; il telefono mostra chi l'ha già ricevuto", () => {
    const q = inoltra(p, fonte.id, mezzo.id, s);
    expect(rifiutata(q, { tipo: "INVIA_MESSAGGIO", da: mezzo.id, a: fonte.id, anonimo: false, modello: "SEGRETO", copiaSegretoId: copiaDi(q, s, mezzo.id)!.id })).toBe(true);
    expect(vistaGiocatore(q, mezzo.id, amb).mieiSegreti[0]!.giaServiti).toEqual([fonte.id]);
  });

  it("non si inoltra un segreto che non si possiede, né campi inesistenti", () => {
    expect(rifiutata(p, { tipo: "INVIA_MESSAGGIO", da: mezzo.id, a: fonte.id, anonimo: false, modello: "SEGRETO", copiaSegretoId: copiaDi(p, s, fonte.id)!.id })).toBe(true);
    expect(rifiutata(p, { tipo: "INVIA_MESSAGGIO", da: fonte.id, a: mezzo.id, anonimo: false, modello: "SEGRETO", copiaSegretoId: copiaDi(p, s, fonte.id)!.id, campi: { inventato: 1 } })).toBe(true);
  });
});

describe("arrivo e valore alla scadenza (D-072, D-074)", () => {
  const p = nuova();
  const vero = p.segreti.find((s) => !s.finto)!;
  const finto = p.segreti.find((s) => s.finto)!;
  const quotaA = (q: Partita, trimestre: number) => vaiA(q, "RISOLUZIONE", trimestre).partita.azienda.quota;

  it("il dato vero arrivato nel 1° trimestre vale per l'azienda alla scadenza (fine del 2°), non prima", () => {
    const con = consegna(p, vero);
    expect(quotaA(con, 1)).toBe(quotaA(p, 1));
    expect(quotaA(con, 2) - quotaA(p, 2)).toBe(vero.valoreAzienda);
  });

  it("arriva in tempo anche nel trimestre successivo", () => {
    const t2 = vaiA(p, "RAPPORTO", 2).partita;
    const con = consegna(t2, vero);
    expect(quotaA(con, 2) - quotaA(t2, 2)).toBe(vero.valoreAzienda);
    expect(vaiA(con, "RISOLUZIONE", 2).partita.segreti.find((s) => s.id === vero.id)!.arrivatoInTempo).toBe(true);
  });

  it("il finto o una copia falsificata non valgono nulla", () => {
    expect(quotaA(consegna(p, finto), 2)).toBe(quotaA(p, 2));
    const campo = Object.keys(vero.campi)[0]!;
    expect(quotaA(consegna(p, vero, { [campo]: "falso" }), 2)).toBe(quotaA(p, 2));
  });

  it("la TV annuncia «arrivato a destinazione» per qualunque versione, ai Risultati, senza numeri", () => {
    const campo = Object.keys(vero.campi)[0]!;
    for (const q of [consegna(p, vero), consegna(p, finto), consegna(p, vero, { [campo]: "falso" })]) {
      const { eventi } = vaiA(q, "RISOLUZIONE", 1);
      const arrivi = eventi.filter((e) => e.tipo === "SEGRETO_ARRIVATO");
      expect(arrivi).toHaveLength(1);
      expect(arrivi[0]!.causa).toContain("arrivata a destinazione");
      expect(arrivi[0]!.causa).not.toMatch(/\d/);
      expect(arrivi[0]!.riservatoA).toBeUndefined();
    }
  });

  it("dopo la scadenza non si inoltra più", () => {
    const t3 = vaiA(p, "RAPPORTO", 3).partita;
    const fonte = giocatoreDi(t3, vero.fonte);
    expect(rifiutata(t3, { tipo: "INVIA_MESSAGGIO", da: fonte.id, a: intermediario(t3, vero).id, anonimo: false, modello: "SEGRETO", copiaSegretoId: copiaDi(t3, vero, fonte.id)!.id })).toBe(true);
  });
});

describe("la spia passa un segreto al concorrente (GDD §11.3, D-072, D-074)", () => {
  const prepara = (quale: "vero" | "finto") => {
    const p = nuova();
    const s = p.segreti.find((x) => x.finto === (quale === "finto"))!;
    const spia = giocatoreDi(p, s.fonte);
    rendiSpia(p, spia);
    return { p, s, spia, copia: copiaDi(p, s, spia.id)! };
  };
  const ai = (q: Partita) => vaiA(q, "RISOLUZIONE");

  it("dato vero: il concorrente avanza e la TV dice quale segreto ha usato", () => {
    const { p, s, spia, copia } = prepara("vero");
    const { partita, eventi } = fai(p, { tipo: "PASSA_AL_CONCORRENTE", da: spia.id, copiaSegretoId: copia.id });
    expect(eventi[0]).toMatchObject({ tipo: "SEGRETO_CONSEGNATO", riservatoA: [spia.id] });
    const { partita: q, eventi: pubblici } = ai(partita);
    expect(q.concorrenti[0]!.quota).toBe(s.valoreConcorrente);
    expect(pubblici.find((e) => e.tipo === "SEGRETO_USATO")!.causa).toContain(s.titolo);
    expect(q.segretiPassati[0]!.riuscito).toBe(true);
  });

  it("il finto, come un dato falsificato, costa la penalità al concorrente (D-074)", () => {
    const { p, spia, copia } = prepara("finto");
    const q = ai(fai(p, { tipo: "PASSA_AL_CONCORRENTE", da: spia.id, copiaSegretoId: copia.id }).partita).partita;
    expect(q.concorrenti[0]!.quota).toBe(-amb.config.segreti.penalitaFalsoConcorrente);
    expect(q.segretiPassati[0]!.riuscito).toBe(false);
  });

  it("una copia falsificata costa la penalità anche se il segreto era vero", () => {
    const { p, s, spia } = prepara("vero");
    const onesto = p.giocatori.find((g) => g.id !== spia.id)!;
    const q0 = structuredClone(p);
    q0.copieSegreto.push({ id: "falsa", segretoId: s.id, possessore: spia.id, campi: { x: 1 }, falsa: true, provenienza: { tipo: "GIOCATORE", da: onesto.id, anonimo: false }, catena: [onesto.id] });
    const q = ai(fai(q0, { tipo: "PASSA_AL_CONCORRENTE", da: spia.id, copiaSegretoId: "falsa" }).partita).partita;
    expect(q.concorrenti[0]!.quota).toBe(-amb.config.segreti.penalitaFalsoConcorrente);
  });

  it("solo le spie; mai due volte lo stesso segreto; sì nel trimestre dopo, no dopo la scadenza", () => {
    const { p, spia, copia } = prepara("vero");
    const onesto = p.giocatori.find((g) => g.fazione.tipo === "ONESTO" && g.id !== spia.id)!;
    const q0 = structuredClone(p);
    q0.copieSegreto.push({ ...copia, id: "copia-onesto", possessore: onesto.id });
    expect(rifiutata(q0, { tipo: "PASSA_AL_CONCORRENTE", da: onesto.id, copiaSegretoId: "copia-onesto" })).toBe(true);
    const dopo = fai(p, { tipo: "PASSA_AL_CONCORRENTE", da: spia.id, copiaSegretoId: copia.id }).partita;
    expect(rifiutata(dopo, { tipo: "PASSA_AL_CONCORRENTE", da: spia.id, copiaSegretoId: copia.id })).toBe(true);
    expect(rifiutata(vaiA(p, "RAPPORTO", 2).partita, { tipo: "PASSA_AL_CONCORRENTE", da: spia.id, copiaSegretoId: copia.id })).toBe(false);
    expect(rifiutata(vaiA(p, "RAPPORTO", 3).partita, { tipo: "PASSA_AL_CONCORRENTE", da: spia.id, copiaSegretoId: copia.id })).toBe(true);
  });

  it("4° trimestre: un segreto del 3° passato al concorrente è una fuga annunciata subito, senza numeri (D-029)", () => {
    let p = vaiA(nuova(), "RAPPORTO", 4).partita;
    p = structuredClone(p);
    expect(p.segreti.filter((x) => x.trimestre === 4)).toHaveLength(0);
    const s = p.segreti.find((x) => x.trimestre === 3)!;
    const spia = giocatoreDi(p, s.fonte);
    rendiSpia(p, spia);
    const q = fai(p, { tipo: "PASSA_AL_CONCORRENTE", da: spia.id, copiaSegretoId: copiaDi(p, s, spia.id)!.id }).partita;
    const r = vaiA(q, "RISOLUZIONE", 4);
    const inizi = r.eventi.map((e, i) => (e.tipo === "FASE_INIZIATA" ? i : -1)).filter((i) => i >= 0);
    const ultimi = r.eventi.slice(inizi[inizi.length - 1]);
    const fuga = ultimi.find((e) => e.tipo === "FUGA_DI_NOTIZIE");
    expect(fuga).toBeDefined();
    expect(fuga!.causa).toContain(s.titolo);
    expect(ultimi.some((e) => e.tipo === "SEGRETO_USATO" || e.tipo === "CORSA_DI_MERCATO")).toBe(false);
  });
});

describe("cosa vede la spia (D-074)", () => {
  it("la spia vede «finto» sui segreti in cui è fonte o destinataria; gli onesti mai", () => {
    let visti = 0;
    for (let seme = 1; seme <= 40; seme++) {
      const esito = creaEAvvia(Array.from({ length: 4 }, (_, i) => ({ id: `g${i + 1}`, nome: `G${i + 1}` })), seme, base);
      if (!esito.ok) throw new Error(esito.errore);
      const p = esito.partita;
      for (const g of p.giocatori) {
        const v = vistaGiocatore(p, g.id, base);
        for (const c of v.mieiSegreti) {
          const s = p.segreti.find((x) => x.titolo === c.titolo && x.trimestre === c.trimestre)!;
          const atteso = g.fazione.tipo === "SPIA" && s.finto && (s.fonte === g.repartoId || s.utile === g.repartoId);
          expect(c.finto === true).toBe(atteso);
          if (atteso) visti++;
        }
      }
      expect(JSON.stringify(vistaTV(p, base))).not.toContain("finto");
    }
    expect(visti).toBeGreaterThan(0);
  });
});

describe("contenuti veri dei segreti (D-035…D-039)", () => {
  const semi = Array.from({ length: 30 }, (_, i) => i + 1);

  it("il dato vero si estrae campo per campo tra i valori possibili, in modo riproducibile col seme", () => {
    const combinazioniViste = new Set<string>();
    for (const seme of semi) {
      const p = nuova(seme, 5, base);
      for (const s of p.segreti) {
        const modello = base.segreti.find((m) => m.id === s.modelloId)!;
        for (const [nome, valore] of Object.entries(s.campi)) expect(modello.versioni.map((v) => v[nome])).toContain(valore);
        if (!modello.versioni.some((v) => JSON.stringify(v) === JSON.stringify(s.campi))) combinazioniViste.add(s.modelloId);
      }
      expect(nuova(seme, 5, base).segreti.map((s) => s.campi)).toEqual(p.segreti.map((s) => s.campi));
    }
    expect(combinazioniViste.size).toBeGreaterThan(0);
  });

  it("il valore per azienda e concorrente dipende dal tipo (config)", () => {
    for (const seme of semi.slice(0, 10)) {
      for (const s of annoIntero(seme, 5).segreti) {
        expect(s.valoreAzienda).toBe(base.config.segreti.tipi[s.tipo].azienda);
        expect(s.valoreConcorrente).toBe(base.config.segreti.tipi[s.tipo].concorrente);
      }
    }
  });

  it("il possessore vede il tipo e i valori suggeriti; l'elenco non rivela il vero (D-036, D-038)", () => {
    for (const seme of semi.slice(0, 10)) {
      const p = nuova(seme, 5, base);
      for (const s of p.segreti) {
        const fonte = giocatoreDi(p, s.fonte);
        const copia = vistaGiocatore(p, fonte.id, base).mieiSegreti.find((c) => c.titolo === s.titolo)!;
        expect(copia.tipo).toBe(s.tipo);
        const modello = base.segreti.find((m) => m.id === s.modelloId)!;
        for (const nome of Object.keys(s.campi)) {
          const attesi = [...new Set(modello.versioni.map((v) => v[nome]!))].sort((a, b) => String(a).localeCompare(String(b), "it", { numeric: true }));
          expect(copia.valoriSuggeriti[nome]).toEqual(attesi);
        }
      }
      expect(JSON.stringify(vistaTV(p, base))).not.toContain("valoriSuggeriti");
    }
  });

  it("una copia falsificata con un valore libero compare tra i suggerimenti solo per chi la possiede", () => {
    const p = nuova();
    const s = p.segreti[0]!;
    const fonte = giocatoreDi(p, s.fonte);
    const altro = intermediario(p, s);
    const campo = Object.keys(s.campi)[0]!;
    const q = inoltra(p, fonte.id, altro.id, s, { [campo]: "valore inventato" });
    expect(vistaGiocatore(q, altro.id, base).mieiSegreti[0]!.valoriSuggeriti[campo]).toContain("valore inventato");
    expect(vistaGiocatore(q, fonte.id, base).mieiSegreti.find((c) => c.titolo === s.titolo)!.valoriSuggeriti[campo]).not.toContain("valore inventato");
  });

  it("la spia prende i punti secondo il tipo del segreto usato (aggiunta a D-038)", () => {
    for (const tipo of ["DA_FAR_GIRARE", "NORMALE", "DA_CUSTODIRE"] as const) {
      const p = nuova();
      const s = p.segreti[0]!;
      s.tipo = tipo;
      const spia = giocatoreDi(p, s.fonte);
      rendiSpia(p, spia);
      p.segretiPassati.push({ copiaId: copiaDi(p, s, spia.id)!.id, segretoId: s.id, spia: spia.id, concorrente: p.concorrenti[0]!.id, trimestre: 1, riuscito: true });
      calcolaPunteggi(p, amb);
      const voce = p.punteggi![spia.id]!.voci.find((v) => v.testo === "Segreto usato dal tuo concorrente")!;
      expect(voce.punti).toBe(amb.config.segreti.tipi[tipo].puntiSpia);
    }
  });
});
