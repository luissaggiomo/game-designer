/**
 * Studio di taratura dei concorrenti (richiesta di Luis, 22/11/2026).
 *
 * Per ogni combinazione di forza dei concorrenti (crescita base, crescita per giocatore) misura,
 * nelle partite SENZA spie:
 *  - la probabilità che l'azienda vinca con il mix "normale" di robot (metà cooperativi, metà egoisti);
 *  - lo stesso dato per numero di giocatori (deve restare simile da 4 a 8);
 *  - la "soglia": la quota di scelte aziendaliste oltre la quale l'azienda vince più spesso di quanto
 *    perde (stimata con mix di robot variabile, per coprire tutte le quote possibili).
 *
 *   corepack pnpm simula -- --studio                 → griglia predefinita, 100 partite per numero di giocatori
 *   corepack pnpm simula -- --studio --partite 300   → più preciso, più lento
 */
import type { Ambiente } from "@il-direttivo/engine";
import { stimaSoglia } from "./report.js";
import { simulaPartita, type DatiPartita } from "./simula.js";

export interface RigaStudio {
  crescitaBase: number;
  crescitaPerGiocatore: number;
  vittoriaAzienda: number;
  vittoriaPerN: Record<number, number>;
  quotaMediaAziendaliste: number;
  soglia: number | null;
}

export function studioConcorrenti(
  base: Ambiente,
  griglia: { crescitaBase: number[]; crescitaPerGiocatore: number[] },
  partitePerN: number,
  giocatori: number[],
): RigaStudio[] {
  const righe: RigaStudio[] = [];
  for (const crescitaBase of griglia.crescitaBase) {
    for (const crescitaPerGiocatore of griglia.crescitaPerGiocatore) {
      const ambiente: Ambiente = {
        ...base,
        config: {
          ...base.config,
          spie: { ...base.config.spie, probabilitaNessunaSpia: 1 }, // solo partite senza spie
          concorrenti: { ...base.config.concorrenti, crescitaBase, crescitaPerGiocatore },
        },
      };
      const normali: DatiPartita[] = [];
      const variabili: DatiPartita[] = [];
      for (const n of giocatori) {
        for (let i = 0; i < partitePerN; i++) {
          normali.push(simulaPartita(n, 1 + i, ambiente));
          variabili.push(simulaPartita(n, 100_000 + i, ambiente, { quotaCooperativi: "VARIABILE", quotaSpiePrudenti: 0.5 }));
        }
      }
      const vince = (g: DatiPartita[]) => (g.length === 0 ? 0 : g.filter((p) => p.mercato === "AZIENDA").length / g.length);
      const vittoriaPerN: Record<number, number> = {};
      for (const n of giocatori) vittoriaPerN[n] = vince(normali.filter((p) => p.giocatori === n));
      righe.push({
        crescitaBase,
        crescitaPerGiocatore,
        vittoriaAzienda: vince(normali),
        vittoriaPerN,
        quotaMediaAziendaliste: normali.reduce((s, p) => s + p.mosse.aziendaliste, 0) / Math.max(1, normali.reduce((s, p) => s + p.mosse.totali, 0)),
        soglia: stimaSoglia(variabili),
      });
      console.log(`  crescita ${crescitaBase} + ${crescitaPerGiocatore}×giocatori: azienda ${(vince(normali) * 100).toFixed(0)}%`);
    }
  }
  return righe;
}

export function reportStudio(righe: RigaStudio[], intestazione: string): string {
  const pct = (x: number) => `${(x * 100).toFixed(0)}%`;
  const giocatori = Object.keys(righe[0]?.vittoriaPerN ?? {}).map(Number);
  const migliori = [...righe].sort((a, b) => Math.abs(a.vittoriaAzienda - 0.6) - Math.abs(b.vittoriaAzienda - 0.6)).slice(0, 3);
  return [
    "# Studio di taratura dei concorrenti — Il Direttivo\n",
    intestazione,
    "\nPartite **senza spie**. Obiettivo: l'azienda vince **circa il 60%** delle volte con il mix normale di giocatori (metà cooperativi, metà egoisti), in modo simile da 4 a 8 giocatori; la **soglia** indica quale quota di scelte \"per l'azienda\" serve per vincere più spesso di quanto si perde.\n",
    `| Crescita base | Per giocatore | Vince l'azienda | ${giocatori.map((n) => `${n} gioc.`).join(" | ")} | Scelte aziendaliste (media) | Soglia |`,
    `|---|---|---|${giocatori.map(() => "---").join("|")}|---|---|`,
    ...righe.map(
      (r) =>
        `| ${r.crescitaBase} | ${r.crescitaPerGiocatore} | ${pct(r.vittoriaAzienda)} | ${giocatori.map((n) => pct(r.vittoriaPerN[n] ?? 0)).join(" | ")} | ${pct(r.quotaMediaAziendaliste)} | ${r.soglia === null ? "—" : pct(r.soglia)} |`,
    ),
    "\n**Combinazioni più vicine al 60%:** " + migliori.map((r) => `crescita ${r.crescitaBase} + ${r.crescitaPerGiocatore}×giocatori (${pct(r.vittoriaAzienda)}, soglia ${r.soglia === null ? "—" : pct(r.soglia)})`).join(" · "),
  ].join("\n");
}
