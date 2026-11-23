/**
 * Report del simulatore: tabelle riassuntive (Markdown) e dati grezzi (CSV).
 * Le metriche sono quelle indicate nelle decisioni D-005…D-022 e nell'Architettura §14.
 */
import type { Ambiente } from "@il-direttivo/engine";
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

export function creaReport(partite: DatiPartita[], intestazione: string, ambiente?: Ambiente): { markdown: string; avvisi: Avviso[] } {
  const avvisi: Avviso[] = [];
  const numeri = [...new Set(partite.map((p) => p.giocatori))].sort();
  const perN = (n: number) => partite.filter((p) => p.giocatori === n);
  const sezioni: string[] = [`# Report del simulatore — Il Direttivo\n\n${intestazione}\n`];

  // 1. Corsa di mercato.
  sezioni.push("## 1. Chi vince la corsa di mercato\n\nCon una spia attiva l'azienda deve vincere sensibilmente meno. La vittoria dell'azienda senza spie è **solo informativa** (D-054: ogni giocatore punta a vincere personalmente).\n");
  const righeMercato: (string | number)[][] = [];
  for (const n of numeri) {
    for (const conf of ["0", "1", "2 alleate", "2 rivali"] as const) {
      const gruppo = perN(n).filter((p) => p.configurazioneSpie === conf);
      if (gruppo.length === 0) continue;
      const az = gruppo.filter((p) => p.mercato === "AZIENDA").length;
      righeMercato.push([n, conf, gruppo.length, pct(az, gruppo.length), pct(gruppo.filter((p) => p.mercato === "CONCORRENTE").length, gruppo.length), pct(gruppo.filter((p) => p.mercato === "PAREGGIO").length, gruppo.length)]);
    }
  }
  sezioni.push(tabella(["Giocatori", "Spie", "Partite", "Vince l'azienda", "Vince un concorrente", "Pareggio"], righeMercato));

  // 1b. Scelte aziendaliste e vittoria (richiesta di Luis: per vincere servono circa 2/3 di scelte aziendaliste).
  sezioni.push("\n### Scelte aziendaliste e vittoria dell'azienda (partite senza spie)\n\nQuota di mosse private \"per l'azienda\" sul totale della partita, e quante volte l'azienda vince in ciascuna fascia. La **soglia** è la quota oltre la quale l'azienda vince più spesso di quanto perde.\n");
  const senzaSpie = partite.filter((p) => p.spie === 0 && p.mosse.totali > 0);
  const fasce = [0.3, 0.4, 0.5, 0.6, 0.67, 0.75, 0.85, 1.01];
  const righeFasce: (string | number)[][] = [];
  let da = 0;
  for (const a of fasce) {
    const g = senzaSpie.filter((p) => p.mosse.aziendaliste / p.mosse.totali >= da && p.mosse.aziendaliste / p.mosse.totali < a);
    if (g.length > 0) righeFasce.push([`${(da * 100).toFixed(0)}–${Math.min(100, a * 100).toFixed(0)}%`, g.length, pct(g.filter((p) => p.mercato === "AZIENDA").length, g.length)]);
    da = a;
  }
  sezioni.push(tabella(["Scelte aziendaliste", "Partite", "Vince l'azienda"], righeFasce));
  const sogliaStimata = stimaSoglia(senzaSpie);
  sezioni.push(`\nQuota media di scelte aziendaliste: ${pct(senzaSpie.reduce((s, p) => s + p.mosse.aziendaliste, 0), senzaSpie.reduce((s, p) => s + p.mosse.totali, 0))}. Soglia stimata: ${sogliaStimata === null ? "—" : `${(sogliaStimata * 100).toFixed(0)}%`}.`);

  // 1c. Chi vince tra onesti e spie (benchmark di Luis).
  sezioni.push("\n### Chi vince tra onesti e spie (partite con spie)\n\nVince la spia se il suo concorrente supera l'azienda **e** lei non è stata scoperta (non licenziata); altrimenti vincono gli onesti. Riferimento indicato da Luis: con 4 giocatori e 1 spia, **circa 20% spia, 80% onesti**.\n");
  const righeFazione: (string | number)[][] = [];
  for (const n of numeri) {
    for (const conf of ["1", "2 alleate", "2 rivali"] as const) {
      const g = perN(n).filter((p) => p.configurazioneSpie === conf);
      if (g.length === 0) continue;
      const spieVincono = g.filter((p) => p.vincitoreFazione === "SPIE").length;
      righeFazione.push([n, conf, g.length, pct(g.length - spieVincono, g.length), pct(spieVincono, g.length)]);
    }
  }
  sezioni.push(tabella(["Giocatori", "Spie", "Partite", "Vincono gli onesti", "Vince la spia"], righeFazione));

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

  // 4b. Obiettivi personali (D-046…D-052).
  sezioni.push(...sezioneObiettivi(partite, avvisi));
  if (ambiente) sezioni.push(...sezioneSoglie(partite, ambiente));

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
    "\n## 8. Limiti\n\n- I robot non parlano, non mentono a voce e non persuadono: la parte \"psicologica\" si misura solo nelle serate di prova.\n- Contenuti veri (40 quesiti, 36 segreti con valori variabili e tipi a bilancia, D-030…D-039), ma i robot non leggono i testi: votano sui numeri e non usano il tipo dei segreti per decidere a chi darli.\n- Obiettivi personali (D-046…D-052): i robot scelgono metà delle volte secondo il profilo e metà a caso, e li perseguono con regole semplici (robot.ts). Non sanno \"leggere la sala\": gli obiettivi che chiedono di indovinare l'esito di un voto o l'effetto sull'azienda risultano più difficili che per una persona. I messaggi di solo testo sono simulati con una probabilità fissa.\n- Il comportamento dei robot (soglie di voto, sospetti, accuse) è una semplificazione descritta in packages/simulator/src/robot.ts.",
  );
  return { markdown: sezioni.join("\n"), avvisi };
}

/** Obiettivi personali: resa per tipo, per obiettivo, per profilo e per reparto (D-046…D-052). */
function sezioneObiettivi(partite: DatiPartita[], avvisi: Avviso[]): string[] {
  const sezioni: string[] = [];
  const tutti = partite.flatMap((p) => p.dettaglio.map((g) => ({ ...g, partita: p })));
  sezioni.push(
    "\n## 4b. Obiettivi personali\n\nObiettivi di taratura (D-051): traguardo **facile** raggiunto dal **60–70%** di chi l'ha scelto, **difficile** dal **25–35%**; **i tre tipi rendono in media lo stesso (±1 punto)**; nessun reparto avvantaggiato. Si regolano le soglie, non i punti.\n",
  );
  // Per tipo.
  const righeTipo: (string | number)[][] = [];
  const reseTipo: number[] = [];
  for (const tipo of [1, 2, 3]) {
    const gs = tutti.filter((g) => g.obiettivo.tipo === tipo);
    const onesti = gs.filter((g) => !g.spia);
    const spie = gs.filter((g) => g.spia);
    const resa = media(gs.map((g) => g.obiettivo.punti));
    reseTipo.push(resa);
    righeTipo.push([tipo, pct(gs.length, tutti.length), pct(gs.filter((g) => g.obiettivo.facile).length, gs.length), pct(gs.filter((g) => g.obiettivo.difficile).length, gs.length), dec(resa), dec(media(onesti.map((g) => g.obiettivo.punti))), dec(media(spie.map((g) => g.obiettivo.punti)))]);
  }
  sezioni.push(tabella(["Tipo", "Scelto da", "Facile raggiunto", "Difficile raggiunto", "Punti medi", "…onesti", "…spie"], righeTipo));
  if (Math.max(...reseTipo) - Math.min(...reseTipo) > 1) {
    avvisi.push({ testo: `Obiettivi: i tre tipi rendono in media ${reseTipo.map((x) => dec(x)).join(" / ")} punti (scarto oltre 1 punto, D-051).` });
  }

  // Per obiettivo.
  sezioni.push("\n### Resa di ogni obiettivo\n\n⚖️ = fuori dagli obiettivi di taratura (con almeno 30 scelte). 🏢 = aziendalista.\n");
  const ids = [...new Set(tutti.map((g) => g.obiettivo.id))].sort();
  let fuori = 0;
  const righeOb = ids.map((id) => {
    const gs = tutti.filter((g) => g.obiettivo.id === id);
    const o = gs[0]!.obiettivo;
    const f = gs.filter((g) => g.obiettivo.facile).length / gs.length;
    const d = gs.filter((g) => g.obiettivo.difficile).length / gs.length;
    const fuoriF = gs.length >= 30 && (f < 0.6 || f > 0.7);
    const fuoriD = gs.length >= 30 && (d < 0.25 || d > 0.35);
    if (fuoriF || fuoriD) fuori++;
    return [id, `${o.aziendalista ? "🏢 " : ""}${o.nome}`, gs.length, `${pct(f * gs.length, gs.length)}${fuoriF ? " ⚖️" : ""}`, `${pct(d * gs.length, gs.length)}${fuoriD ? " ⚖️" : ""}`, dec(media(gs.map((g) => g.obiettivo.punti)))];
  });
  sezioni.push(tabella(["Obiettivo", "Nome", "Scelto", "Facile", "Difficile", "Punti medi"], righeOb));
  if (fuori > 0) avvisi.push({ testo: `Obiettivi: ${fuori} su ${ids.length} hanno almeno un traguardo fuori dagli obiettivi di taratura (soglie da ritoccare).` });

  // Per profilo e fazione.
  sezioni.push("\n### Obiettivi per profilo\n");
  sezioni.push(
    tabella(
      ["Profilo", "Punti obiettivo medi", "Facile raggiunto", "Difficile raggiunto"],
      (["COOPERATIVO", "EGOISTA", "SPIA_PRUDENTE", "SPIA_AGGRESSIVA"] as const).map((nome) => {
        const gs = tutti.filter((g) => g.profilo === nome);
        return [nome, dec(media(gs.map((g) => g.obiettivo.punti))), pct(gs.filter((g) => g.obiettivo.facile).length, gs.length), pct(gs.filter((g) => g.obiettivo.difficile).length, gs.length)];
      }),
    ),
  );

  // Il dilemma della spia: chi insegue l'obiettivo aziendalista vince meno?
  const spie = tutti.filter((g) => g.spia && g.partita.spie === 1);
  const conPunti = spie.filter((g) => g.obiettivo.punti > 0);
  const senzaPunti = spie.filter((g) => g.obiettivo.punti === 0);
  const vinceSpia = (gs: typeof spie) => pct(gs.filter((g) => g.partita.vincitoreFazione === "SPIE").length, gs.length);
  sezioni.push(
    `\nDilemma della spia (partite con una spia): chi ha preso punti dall'obiettivo aziendalista vince la partita nel ${vinceSpia(conPunti)} dei casi (${conPunti.length} spie), chi non ne ha presi nel ${vinceSpia(senzaPunti)} (${senzaPunti.length} spie).`,
  );

  // Equità tra reparti (D-005), a parità di numero di giocatori (alcune soglie dipendono da quanti si è).
  const righeReparti: (string | number)[][] = [];
  let scartoPeggiore = 0;
  for (const n of [...new Set(tutti.map((g) => g.partita.giocatori))].sort()) {
    const gs = tutti.filter((g) => g.partita.giocatori === n);
    const perReparto = [...new Set(gs.map((g) => g.reparto))].map((r) => media(gs.filter((g) => g.reparto === r).map((g) => g.obiettivo.punti)));
    const scarto = Math.max(...perReparto) - Math.min(...perReparto);
    scartoPeggiore = Math.max(scartoPeggiore, scarto);
    righeReparti.push([n, dec(media(gs.map((g) => g.obiettivo.punti))), dec(Math.min(...perReparto)), dec(Math.max(...perReparto))]);
  }
  sezioni.push("\n### Obiettivi per numero di giocatori ed equità tra reparti (D-005)\n");
  sezioni.push(tabella(["Giocatori", "Punti obiettivo medi", "Reparto più basso", "Reparto più alto"], righeReparti));
  if (scartoPeggiore > 0.6) avvisi.push({ testo: `Obiettivi: a parità di giocatori, tra i reparti i punti medi differiscono fino a ${dec(scartoPeggiore)} punti (D-005).` });
  return sezioni;
}

/**
 * Soglie suggerite (D-051): dai valori raggiunti da chi ha scelto un obiettivo, la soglia intera che
 * porta la riuscita più vicina al 65% (facile) e al 30% (difficile). Solo per i traguardi con soglia
 * numerica fissa e senza parametro (per la cassa il valore dipende dal parametro). Stima prudente:
 * i robot smettono di insistere quando un traguardo è raggiunto, quindi oltre la soglia attuale i
 * valori sono un po' sottostimati.
 */
function sezioneSoglie(partite: DatiPartita[], ambiente: Ambiente): string[] {
  const tutti = partite.flatMap((p) => p.dettaglio);
  const righe: (string | number)[][] = [];
  for (const o of ambiente.obiettivi) {
    const gs = tutti.filter((g) => g.obiettivo.id === o.id);
    if (gs.length < 30) continue;
    const suggerite: number[] = [];
    o.traguardi.forEach((t, i) => {
      if (t.parametro !== undefined) {
        // Obiettivi sulla cassa: si cerca l'importo (a passi di 10 K) invece della soglia.
        const giochi = partite.filter((p) => p.dettaglio.some((g) => g.obiettivo.id === o.id));
        const riesce = (p: DatiPartita, k: number): boolean => {
          if (t.misura === "TRIMESTRI_CASSA_MINIMA") return p.cassaFineTrimestre.filter((c) => c >= k).length >= (t.soglia as number);
          if (t.misura === "CASSA_FINE_ANNO") return (p.cassaFineTrimestre.at(-1) ?? 0) >= k;
          if (t.misura === "CASSA_MAI_SOTTO") return p.cassaMinimaDopoVoti >= k;
          return false;
        };
        const quota = (k: number) => giochi.filter((p) => riesce(p, k)).length / giochi.length;
        const obiettivo = i === 0 ? 0.65 : 0.3;
        let migliore = t.parametro;
        for (let k = 0; k <= 150; k += 10) if (Math.abs(quota(k) - obiettivo) < Math.abs(quota(migliore) - obiettivo)) migliore = k;
        suggerite.push(NaN);
        righe.push([o.id, o.nome, i === 0 ? "facile" : "difficile", `${t.parametro} K (${pct(quota(t.parametro) * giochi.length, giochi.length)})`, migliore === t.parametro ? "=" : `${migliore} K (${pct(quota(migliore) * giochi.length, giochi.length)})`, giochi.length]);
        return;
      }
      if (typeof t.soglia !== "number") {
        suggerite.push(NaN);
        righe.push([o.id, o.nome, i === 0 ? "facile" : "difficile", String(t.soglia), "—", "—"]);
        return;
      }
      const valori = gs.map((g) => g.obiettivo.valori[i] ?? -1);
      const quota = (s: number) => valori.filter((v) => v >= s).length / valori.length;
      const obiettivo = i === 0 ? 0.65 : 0.3;
      let migliore = t.soglia;
      for (let s = 1; s <= 12; s++) {
        // Nel tipo 1 il difficile deve restare sopra il facile (D-046).
        if (o.tipo === 1 && i === 1 && !(s > (suggerite[0] ?? 0))) continue;
        if (Math.abs(quota(s) - obiettivo) < Math.abs(quota(migliore) - obiettivo)) migliore = s;
      }
      suggerite.push(migliore);
      righe.push([o.id, o.nome, i === 0 ? "facile" : "difficile", `${t.soglia} (${pct(quota(t.soglia) * valori.length, valori.length)})`, migliore === t.soglia ? "=" : `${migliore} (${pct(quota(migliore) * valori.length, valori.length)})`, valori.length]);
    });
  }
  return [
    "\n### Soglie suggerite (stima)\n\nSoglia attuale con la sua riuscita, e la soglia intera che porterebbe la riuscita più vicina al 65% (facile) o al 30% (difficile). Per la cassa si suggerisce l'importo in K (nel tipo 1 i due gradini condividono l'importo: scegliere un valore intermedio). \"—\" = soglia simbolica (dipende dal numero di giocatori); \"=\" = già la migliore.\n",
    tabella(["Obiettivo", "Nome", "Traguardo", "Attuale", "Suggerita", "Scelte"], righe),
  ];
}

/** Quota di scelte aziendaliste oltre la quale l'azienda vince almeno metà delle volte (stima a scaglioni del 5%). */
export function stimaSoglia(partite: DatiPartita[]): number | null {
  for (let s = 0.2; s <= 1; s += 0.05) {
    const g = partite.filter((p) => p.mosse.totali > 0 && Math.abs(p.mosse.aziendaliste / p.mosse.totali - s) < 0.05);
    if (g.length >= 20 && g.filter((p) => p.mercato === "AZIENDA").length / g.length >= 0.5) return Math.round(s * 100) / 100;
  }
  return null;
}

export function creaCsv(partite: DatiPartita[]): { partite: string; giocatori: string } {
  const righeP = ["giocatori;seme;spie;configurazione_spie;mercato;votazioni_approvate;votazioni_totali;demansionamenti;segreti_in_tempo;segreti_passati;spie_licenziate;onesti_licenziati_finale"];
  const righeG = ["giocatori;seme;reparto;spia;profilo;punteggio;punti_reparto;vincitore;demansionato;licenziato;segreti_come_fonte;favorito;peso_voto_anno;obiettivo;tipo_obiettivo;facile;difficile;punti_obiettivo"];
  for (const p of partite) {
    righeP.push([p.giocatori, p.seme, p.spie, p.configurazioneSpie, p.mercato, p.votazioni.filter((v) => v.approvata).length, p.votazioni.length, p.demansionamenti.length, p.segreti.inTempo, p.segreti.passati, p.spieLicenziate, p.onestiLicenziatiNelFinale].join(";"));
    for (const g of p.dettaglio) {
      righeG.push([p.giocatori, p.seme, g.reparto, g.spia ? 1 : 0, g.profilo, g.punteggio, g.puntiReparto, g.vincitore ? 1 : 0, g.demansionato ? 1 : 0, g.licenziato ? 1 : 0, g.segretiComeFonte, g.favorito, g.pesoVotoAnno, g.obiettivo.id, g.obiettivo.tipo, g.obiettivo.facile ? 1 : 0, g.obiettivo.difficile ? 1 : 0, g.obiettivo.punti].join(";"));
    }
  }
  return { partite: righeP.join("\n"), giocatori: righeG.join("\n") };
}
