/**
 * Report del simulatore: tabelle riassuntive (Markdown) e dati grezzi (CSV).
 * Le metriche sono quelle indicate nelle decisioni D-005…D-022 e nell'Architettura §14.
 */
import type { DatiPartita } from "./simula.js";

const pct = (parte: number, totale: number) => (totale === 0 ? "—" : `${((100 * parte) / totale).toFixed(0)}%`);
const media = (valori: number[]) => (valori.length === 0 ? 0 : valori.reduce((a, b) => a + b, 0) / valori.length);
const dec = (x: number, cifre = 1) => x.toFixed(cifre);

function tabella(intestazione: string[], righe: (string | number)[][]): string {
  return [
    `| ${intestazione.join(" | ")} |`,
    `|${intestazione.map(() => "---").join("|")}|`,
    ...righe.map((r) => `| ${r.join(" | ")} |`),
  ].join("\n");
}

export interface Avviso {
  testo: string;
}

export function creaReport(partite: DatiPartita[], intestazione: string): { markdown: string; avvisi: Avviso[] } {
  const avvisi: Avviso[] = [];
  const numeri = [...new Set(partite.map((p) => p.giocatori))].sort();
  const perN = (n: number) => partite.filter((p) => p.giocatori === n);
  const sezioni: string[] = [`# Report del simulatore — Il Direttivo\n\n${intestazione}\n`];

  // 1. Corsa di mercato.
  sezioni.push("## 1. Chi vince la corsa di mercato\n\nObiettivo (Architettura §10.6): **senza spie l'azienda vince nel 55–65% dei casi**; con una spia attiva, sensibilmente meno.\n");
  const righeMercato: (string | number)[][] = [];
  for (const n of numeri) {
    for (const conf of ["0", "1", "2 alleate", "2 rivali"] as const) {
      const gruppo = perN(n).filter((p) => p.configurazioneSpie === conf);
      if (gruppo.length === 0) continue;
      const az = gruppo.filter((p) => p.mercato === "AZIENDA").length;
      righeMercato.push([n, conf, gruppo.length, pct(az, gruppo.length), pct(gruppo.filter((p) => p.mercato === "CONCORRENTE").length, gruppo.length), pct(gruppo.filter((p) => p.mercato === "PAREGGIO").length, gruppo.length)]);
      if (conf === "0" && gruppo.length >= 30) {
        const quota = az / gruppo.length;
        if (quota < 0.55 || quota > 0.65) avvisi.push({ testo: `Con ${n} giocatori e nessuna spia l'azienda vince nel ${pct(az, gruppo.length)} dei casi (obiettivo 55–65%).` });
      }
    }
  }
  sezioni.push(tabella(["Giocatori", "Spie", "Partite", "Vince l'azienda", "Vince un concorrente", "Pareggio"], righeMercato));

  // 2. Spie.
  sezioni.push("\n## 2. Spie: scoperte ed errori\n");
  sezioni.push(
    tabella(
      ["Giocatori", "Spie licenziate (su spie presenti)", "Onesti licenziati nel finale (per partita)", "Demansionamenti per partita", "…di cui su spie"],
      numeri.map((n) => {
        const g = perN(n);
        const spie = g.reduce((s, p) => s + p.spie, 0);
        const dem = g.flatMap((p) => p.demansionamenti);
        return [n, pct(g.reduce((s, p) => s + p.spieLicenziate, 0), spie), dec(media(g.map((p) => p.onestiLicenziatiNelFinale)), 2), dec(media(g.map((p) => p.demansionamenti.length)), 2), pct(dem.filter((d) => d.spia).length, dem.length)];
      }),
    ),
  );

  // 3. Equità tra reparti (D-005).
  sezioni.push("\n## 3. Equità tra reparti (D-005)\n\nPer ogni reparto: punteggio medio, percentuale di partite vinte (punteggio più alto), peso di voto disponibile nell'anno, segreti ricevuti come fonte, volte \"favorito\" dall'ordine del giorno, percentuale di demansionamenti subiti.\n");
  for (const n of numeri) {
    const giocatori = perN(n).flatMap((p) => p.dettaglio);
    const reparti = [...new Set(giocatori.map((g) => g.reparto))];
    const righe = reparti.map((r) => {
      const gs = giocatori.filter((g) => g.reparto === r);
      return { r, punteggio: media(gs.map((g) => g.punteggio)), vittorie: gs.filter((g) => g.vincitore).length / gs.length, gs };
    });
    const vittorie = righe.map((x) => x.vittorie);
    const scarto = Math.max(...vittorie) - Math.min(...vittorie);
    if (scarto > 0.1 && perN(n).length >= 100) {
      avvisi.push({ testo: `Con ${n} giocatori le vittorie personali tra reparti vanno dal ${(Math.min(...vittorie) * 100).toFixed(0)}% al ${(Math.max(...vittorie) * 100).toFixed(0)}% (scarto oltre 10 punti).` });
    }
    sezioni.push(`\n**${n} giocatori** (vittoria attesa se tutti pari: ${pct(1, n)})\n`);
    sezioni.push(
      tabella(
        ["Reparto", "Punteggio medio", "Vittorie", "Peso voto/anno", "Segreti come fonte", "Favorito", "Demansionato"],
        righe.map(({ r, punteggio, vittorie: v, gs }) => [
          r,
          dec(punteggio),
          pct(v * gs.length, gs.length),
          dec(media(gs.map((g) => g.pesoVotoAnno))),
          dec(media(gs.map((g) => g.segretiComeFonte))),
          dec(media(gs.map((g) => g.favorito))),
          pct(gs.filter((g) => g.demansionato).length, gs.length),
        ]),
      ),
    );
  }

  // 4. Mossa privata: conviene l'egoismo?
  sezioni.push("\n## 4. Profili dei robot: punteggio medio e vittorie\n\nSe gli onesti egoisti battono nettamente i cooperativi, la mossa \"reparto\" conviene troppo (GDD §9, ⚖️).\n");
  const tutti = partite.flatMap((p) => p.dettaglio);
  const vittorieProfilo = (nome: string) => {
    const gs = tutti.filter((g) => g.profilo === nome);
    return gs.length === 0 ? 0 : gs.filter((g) => g.vincitore).length / gs.length;
  };
  if (vittorieProfilo("EGOISTA") > 1.5 * vittorieProfilo("COOPERATIVO")) {
    avvisi.push({
      testo: `Gli onesti egoisti vincono il ${(vittorieProfilo("EGOISTA") * 100).toFixed(0)}% delle partite contro il ${(vittorieProfilo("COOPERATIVO") * 100).toFixed(0)}% dei cooperativi: la mossa "reparto" conviene troppo.`,
    });
  }
  sezioni.push(
    tabella(
      ["Profilo", "Giocatori", "Punteggio medio", "Punti di reparto medi", "Vittorie"],
      (["COOPERATIVO", "EGOISTA", "SPIA_PRUDENTE", "SPIA_AGGRESSIVA"] as const).map((nome) => {
        const gs = tutti.filter((g) => g.profilo === nome);
        return [nome, gs.length, dec(media(gs.map((g) => g.punteggio))), dec(media(gs.map((g) => g.puntiReparto))), pct(gs.filter((g) => g.vincitore).length, gs.length)];
      }),
    ),
  );

  // 5. Cassa e votazioni (D-008, D-014, D-018).
  sezioni.push("\n## 5. Cassa e votazioni\n");
  const voti = partite.flatMap((p) => p.votazioni);
  sezioni.push(
    tabella(
      ["Posizione nel trimestre", "Votazioni", "Approvate", "Respinte per fondi"],
      [1, 2, 3].map((k) => {
        const g = voti.filter((v) => v.posizione === k);
        return [`${k}ª`, g.length, pct(g.filter((v) => v.approvata).length, g.length), pct(g.filter((v) => v.perFondi).length, g.length)];
      }),
    ),
  );
  sezioni.push("");
  sezioni.push(
    tabella(
      ["Trimestre", "Cassa media a inizio trimestre (K)", "Approvate"],
      [1, 2, 3, 4].map((t) => [t, dec(media(partite.map((p) => p.cassaInizioTrimestre[t - 1] ?? 0))), pct(voti.filter((v) => v.trimestre === t && v.approvata).length, voti.filter((v) => v.trimestre === t).length)]),
    ),
  );
  const trimestriConRicarica = partite.reduce((s, p) => s + Math.max(0, p.cassaInizioTrimestre.length - 1), 0);
  sezioni.push(`\nTetto della cassa (150 K) raggiunto in ${pct(partite.reduce((s, p) => s + p.tettoRaggiunto, 0), trimestriConRicarica)} dei trimestri 2–4.`);

  // 6. Segreti.
  sezioni.push("\n## 6. Segreti\n");
  const seg = partite.map((p) => p.segreti);
  const totali = seg.reduce((s, x) => s + x.totali, 0);
  const passati = seg.reduce((s, x) => s + x.passati, 0);
  sezioni.push(
    tabella(
      ["Segreti distribuiti", "Arrivati in tempo al reparto giusto", "Consegnati ai concorrenti", "…di cui falsi"],
      [[totali, pct(seg.reduce((s, x) => s + x.inTempo, 0), totali), pct(passati, totali), pct(seg.reduce((s, x) => s + x.passatiFalsi, 0), passati)]],
    ),
  );

  // 7. Avvisi e limiti.
  sezioni.push("\n## 7. Avvisi automatici\n");
  sezioni.push(avvisi.length === 0 ? "Nessuno." : avvisi.map((a) => `- ⚠️ ${a.testo}`).join("\n"));
  sezioni.push(
    "\n## 8. Limiti\n\n- I robot non parlano, non mentono a voce e non persuadono: la parte \"psicologica\" si misura solo nelle serate di prova.\n- I contenuti (16 quesiti, 10 segreti, pesi) sono **segnaposto**: i risultati valgono per il motore e le regole, non ancora per il gioco finale.\n- Gli obiettivi personali non esistono ancora (punto aperto 3), quindi i punteggi sono incompleti.\n- Il comportamento dei robot (soglie di voto, sospetti, accuse) è una semplificazione descritta in packages/simulator/src/robot.ts.",
  );
  return { markdown: sezioni.join("\n"), avvisi };
}

export function creaCsv(partite: DatiPartita[]): { partite: string; giocatori: string } {
  const righeP = ["giocatori;seme;spie;configurazione_spie;mercato;votazioni_approvate;votazioni_totali;demansionamenti;segreti_in_tempo;segreti_passati;spie_licenziate;onesti_licenziati_finale"];
  const righeG = ["giocatori;seme;reparto;spia;profilo;punteggio;punti_reparto;vincitore;demansionato;licenziato;segreti_come_fonte;favorito;peso_voto_anno"];
  for (const p of partite) {
    righeP.push([p.giocatori, p.seme, p.spie, p.configurazioneSpie, p.mercato, p.votazioni.filter((v) => v.approvata).length, p.votazioni.length, p.demansionamenti.length, p.segreti.inTempo, p.segreti.passati, p.spieLicenziate, p.onestiLicenziatiNelFinale].join(";"));
    for (const g of p.dettaglio) {
      righeG.push([p.giocatori, p.seme, g.reparto, g.spia ? 1 : 0, g.profilo, g.punteggio, g.puntiReparto, g.vincitore ? 1 : 0, g.demansionato ? 1 : 0, g.licenziato ? 1 : 0, g.segretiComeFonte, g.favorito, g.pesoVotoAnno].join(";"));
    }
  }
  return { partite: righeP.join("\n"), giocatori: righeG.join("\n") };
}
