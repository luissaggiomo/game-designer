# Report del simulatore — Il Direttivo

5000 partite simulate (1000 per ciascun numero di giocatori: 4, 5, 6, 7, 8), semi da 1. Durata: 240.1 s. Data: 2026-11-22.

## 1. Chi vince la corsa di mercato

Obiettivo (Architettura §10.6): **senza spie l'azienda vince nel 55–65% dei casi**; con una spia attiva, sensibilmente meno.

| Giocatori | Spie | Partite | Vince l'azienda | Vince un concorrente | Pareggio |
|---|---|---|---|---|---|
| 4 | 0 | 150 | 64% | 33% | 3% |
| 4 | 1 | 850 | 29% | 68% | 3% |
| 5 | 0 | 150 | 57% | 39% | 3% |
| 5 | 1 | 850 | 28% | 68% | 4% |
| 6 | 0 | 150 | 49% | 45% | 6% |
| 6 | 1 | 850 | 25% | 71% | 4% |
| 7 | 0 | 150 | 50% | 47% | 3% |
| 7 | 1 | 850 | 27% | 71% | 2% |
| 8 | 0 | 150 | 49% | 48% | 3% |
| 8 | 1 | 523 | 38% | 59% | 3% |
| 8 | 2 alleate | 168 | 20% | 77% | 3% |
| 8 | 2 rivali | 159 | 18% | 81% | 1% |

### Scelte aziendaliste e vittoria dell'azienda (partite senza spie)

Quota di mosse private "per l'azienda" sul totale della partita, e quante volte l'azienda vince in ciascuna fascia. La **soglia** è la quota oltre la quale l'azienda vince più spesso di quanto perde.

| Scelte aziendaliste | Partite | Vince l'azienda |
|---|---|---|
| 0–30% | 4 | 0% |
| 30–40% | 52 | 0% |
| 40–50% | 62 | 2% |
| 50–60% | 213 | 28% |
| 60–67% | 159 | 63% |
| 67–75% | 110 | 88% |
| 75–85% | 121 | 98% |
| 85–100% | 29 | 100% |

Quota media di scelte aziendaliste: 61%. Soglia stimata: 65%.

## 2. Spie: scoperte ed errori

| Giocatori | Spie licenziate (su spie presenti) | Onesti licenziati nel finale (per partita) | Demansionamenti per partita | …di cui su spie |
|---|---|---|---|---|
| 4 | 69% | 0.16 | 0.47 | 82% |
| 5 | 58% | 0.13 | 0.14 | 77% |
| 6 | 42% | 0.20 | 0.18 | 70% |
| 7 | 36% | 0.16 | 0.05 | 78% |
| 8 | 37% | 0.27 | 0.12 | 61% |

## 3. Equità tra reparti (D-005)

Per ogni reparto: punteggio medio, percentuale di partite vinte (punteggio più alto), peso di voto disponibile nell'anno, segreti ricevuti come fonte, volte "favorito" dall'ordine del giorno, percentuale di demansionamenti subiti.


**4 giocatori** (vittoria attesa se tutti pari: 25%)

| Reparto | Punteggio medio | Vittorie | Peso voto/anno | Segreti come fonte | Favorito | Demansionato |
|---|---|---|---|---|---|---|
| ACQUISTI | 9.4 | 24% | 12.3 | 1.5 | 3.6 | 6% |
| PRODUZIONE | 9.6 | 28% | 12.2 | 2.0 | 3.5 | 14% |
| VENDITE | 9.8 | 29% | 12.2 | 2.1 | 3.6 | 11% |
| MARKETING | 9.6 | 28% | 12.3 | 2.4 | 3.5 | 12% |

**5 giocatori** (vittoria attesa se tutti pari: 20%)

| Reparto | Punteggio medio | Vittorie | Peso voto/anno | Segreti come fonte | Favorito | Demansionato |
|---|---|---|---|---|---|---|
| ACQUISTI | 8.4 | 21% | 11.9 | 1.7 | 2.9 | 3% |
| PRODUZIONE | 8.3 | 22% | 11.8 | 1.7 | 2.9 | 3% |
| VENDITE | 8.4 | 22% | 11.9 | 1.7 | 2.9 | 3% |
| MARKETING | 8.6 | 23% | 11.9 | 1.8 | 2.9 | 3% |
| FINANZA | 9.0 | 23% | 11.9 | 1.0 | 2.9 | 2% |

**6 giocatori** (vittoria attesa se tutti pari: 17%)

| Reparto | Punteggio medio | Vittorie | Peso voto/anno | Segreti come fonte | Favorito | Demansionato |
|---|---|---|---|---|---|---|
| ACQUISTI | 7.5 | 17% | 11.6 | 1.7 | 2.4 | 4% |
| PRODUZIONE | 7.8 | 21% | 11.5 | 1.7 | 2.4 | 3% |
| VENDITE | 7.7 | 20% | 11.6 | 1.7 | 2.4 | 4% |
| MARKETING | 7.7 | 18% | 11.5 | 1.9 | 2.4 | 4% |
| FINANZA | 7.8 | 19% | 11.5 | 1.0 | 2.4 | 2% |
| RISORSE_UMANE | 8.1 | 19% | 11.6 | 0.0 | 2.4 | 1% |

**7 giocatori** (vittoria attesa se tutti pari: 14%)

| Reparto | Punteggio medio | Vittorie | Peso voto/anno | Segreti come fonte | Favorito | Demansionato |
|---|---|---|---|---|---|---|
| ACQUISTI | 7.5 | 17% | 11.3 | 1.7 | 2.0 | 1% |
| PRODUZIONE | 7.3 | 18% | 11.3 | 1.7 | 2.0 | 1% |
| VENDITE | 7.2 | 16% | 11.3 | 1.7 | 2.0 | 1% |
| MARKETING | 7.4 | 16% | 11.4 | 1.9 | 2.0 | 1% |
| FINANZA | 7.4 | 17% | 11.3 | 1.0 | 2.0 | 0% |
| RISORSE_UMANE | 7.4 | 14% | 11.3 | 0.0 | 2.0 | 0% |
| RICERCA_SVILUPPO | 8.0 | 18% | 11.3 | 0.0 | 2.0 | 0% |

**8 giocatori** (vittoria attesa se tutti pari: 13%)

| Reparto | Punteggio medio | Vittorie | Peso voto/anno | Segreti come fonte | Favorito | Demansionato |
|---|---|---|---|---|---|---|
| ACQUISTI | 8.0 | 12% | 11.2 | 1.7 | 1.8 | 2% |
| PRODUZIONE | 8.5 | 15% | 11.1 | 1.7 | 1.8 | 3% |
| VENDITE | 8.8 | 15% | 11.1 | 1.7 | 1.8 | 2% |
| MARKETING | 8.7 | 15% | 11.2 | 1.9 | 1.8 | 2% |
| FINANZA | 8.4 | 14% | 11.2 | 1.0 | 1.8 | 1% |
| RISORSE_UMANE | 9.1 | 16% | 11.1 | 0.0 | 1.8 | 0% |
| RICERCA_SVILUPPO | 9.0 | 17% | 11.1 | 0.0 | 1.8 | 1% |
| IT_SICUREZZA | 8.8 | 16% | 11.2 | 0.0 | 1.8 | 1% |

## 4. Profili dei robot: punteggio medio e vittorie

Se gli onesti egoisti battono nettamente i cooperativi, la mossa "reparto" conviene troppo (GDD §9, ⚖️).

| Profilo | Giocatori | Punteggio medio | Punti di reparto medi | Vittorie |
|---|---|---|---|---|
| COOPERATIVO | 12659 | 7.4 | 0.9 | 7% |
| EGOISTA | 12764 | 7.4 | 3.4 | 16% |
| SPIA_PRUDENTE | 2378 | 11.0 | 2.2 | 49% |
| SPIA_AGGRESSIVA | 2199 | 15.6 | 2.5 | 73% |

## 5. Cassa e votazioni

| Posizione nel trimestre | Votazioni | Approvate | Respinte per fondi |
|---|---|---|---|
| 1ª | 20000 | 43% | 0% |
| 2ª | 20000 | 42% | 1% |
| 3ª | 10000 | 40% | 2% |

| Trimestre | Cassa media a inizio trimestre (K) | Approvate |
|---|---|---|
| 1 | 100.0 | 42% |
| 2 | 144.3 | 41% |
| 3 | 146.1 | 41% |
| 4 | 146.3 | 45% |

Tetto della cassa (150 K) raggiunto in 81% dei trimestri 2–4.

## 6. Segreti

| Segreti distribuiti | Arrivati in tempo al reparto giusto | Consegnati ai concorrenti | …di cui falsi |
|---|---|---|---|
| 39981 | 54% | 16% | 0% |

## 7. Avvisi automatici

- ⚠️ Con 6 giocatori e nessuna spia l'azienda vince nel 49% dei casi (obiettivo 55–65%).
- ⚠️ Con 7 giocatori e nessuna spia l'azienda vince nel 50% dei casi (obiettivo 55–65%).
- ⚠️ Con 8 giocatori e nessuna spia l'azienda vince nel 49% dei casi (obiettivo 55–65%).
- ⚠️ Gli onesti egoisti vincono il 16% delle partite contro il 7% dei cooperativi: la mossa "reparto" conviene troppo.

## 8. Limiti

- I robot non parlano, non mentono a voce e non persuadono: la parte "psicologica" si misura solo nelle serate di prova.
- I contenuti (16 quesiti, 10 segreti, pesi) sono **segnaposto**: i risultati valgono per il motore e le regole, non ancora per il gioco finale.
- Gli obiettivi personali non esistono ancora (punto aperto 3), quindi i punteggi sono incompleti.
- Il comportamento dei robot (soglie di voto, sospetti, accuse) è una semplificazione descritta in packages/simulator/src/robot.ts.