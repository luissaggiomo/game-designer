# Report del simulatore — Il Direttivo

5000 partite simulate (1000 per ciascun numero di giocatori: 4, 5, 6, 7, 8), semi da 1. Durata: 219.2 s. Data: 2026-11-22.

## 1. Chi vince la corsa di mercato

Obiettivo (Architettura §10.6): **senza spie l'azienda vince nel 55–65% dei casi**; con una spia attiva, sensibilmente meno.

| Giocatori | Spie | Partite | Vince l'azienda | Vince un concorrente | Pareggio |
|---|---|---|---|---|---|
| 4 | 0 | 150 | 93% | 6% | 1% |
| 4 | 1 | 850 | 70% | 25% | 5% |
| 5 | 0 | 150 | 93% | 6% | 1% |
| 5 | 1 | 850 | 72% | 24% | 4% |
| 6 | 0 | 150 | 91% | 9% | 0% |
| 6 | 1 | 850 | 79% | 19% | 2% |
| 7 | 0 | 150 | 92% | 8% | 0% |
| 7 | 1 | 850 | 83% | 15% | 2% |
| 8 | 0 | 150 | 90% | 8% | 2% |
| 8 | 1 | 523 | 81% | 16% | 3% |
| 8 | 2 alleate | 168 | 62% | 36% | 2% |
| 8 | 2 rivali | 159 | 65% | 28% | 6% |

## 2. Spie: scoperte ed errori

| Giocatori | Spie licenziate (su spie presenti) | Onesti licenziati nel finale (per partita) | Demansionamenti per partita | …di cui su spie |
|---|---|---|---|---|
| 4 | 66% | 0.16 | 0.44 | 81% |
| 5 | 53% | 0.19 | 0.13 | 83% |
| 6 | 42% | 0.21 | 0.20 | 74% |
| 7 | 36% | 0.13 | 0.04 | 73% |
| 8 | 35% | 0.28 | 0.13 | 63% |

## 3. Equità tra reparti (D-005)

Per ogni reparto: punteggio medio, percentuale di partite vinte (punteggio più alto), peso di voto disponibile nell'anno, segreti ricevuti come fonte, volte "favorito" dall'ordine del giorno, percentuale di demansionamenti subiti.


**4 giocatori** (vittoria attesa se tutti pari: 25%)

| Reparto | Punteggio medio | Vittorie | Peso voto/anno | Segreti come fonte | Favorito | Demansionato |
|---|---|---|---|---|---|---|
| ACQUISTI | 11.8 | 20% | 12.3 | 1.5 | 2.2 | 5% |
| PRODUZIONE | 9.7 | 10% | 11.9 | 2.0 | 2.3 | 14% |
| VENDITE | 15.5 | 54% | 12.9 | 2.1 | 3.4 | 9% |
| MARKETING | 13.1 | 24% | 10.6 | 2.4 | 2.8 | 12% |

**5 giocatori** (vittoria attesa se tutti pari: 20%)

| Reparto | Punteggio medio | Vittorie | Peso voto/anno | Segreti come fonte | Favorito | Demansionato |
|---|---|---|---|---|---|---|
| ACQUISTI | 11.4 | 19% | 11.9 | 1.7 | 1.7 | 2% |
| PRODUZIONE | 9.9 | 9% | 12.8 | 1.7 | 2.0 | 3% |
| VENDITE | 13.1 | 32% | 12.1 | 1.7 | 2.5 | 3% |
| MARKETING | 12.6 | 23% | 9.0 | 1.8 | 2.3 | 3% |
| FINANZA | 13.8 | 31% | 4.7 | 1.0 | 2.2 | 1% |

**6 giocatori** (vittoria attesa se tutti pari: 17%)

| Reparto | Punteggio medio | Vittorie | Peso voto/anno | Segreti come fonte | Favorito | Demansionato |
|---|---|---|---|---|---|---|
| ACQUISTI | 11.6 | 18% | 11.3 | 1.7 | 1.5 | 5% |
| PRODUZIONE | 9.4 | 7% | 12.0 | 1.7 | 1.8 | 4% |
| VENDITE | 13.2 | 33% | 11.1 | 1.7 | 2.3 | 3% |
| MARKETING | 12.7 | 25% | 9.4 | 1.9 | 2.0 | 4% |
| FINANZA | 13.2 | 26% | 5.6 | 1.0 | 2.0 | 3% |
| RISORSE_UMANE | 12.6 | 12% | 4.1 | 0.0 | 1.0 | 1% |

**7 giocatori** (vittoria attesa se tutti pari: 14%)

| Reparto | Punteggio medio | Vittorie | Peso voto/anno | Segreti come fonte | Favorito | Demansionato |
|---|---|---|---|---|---|---|
| ACQUISTI | 11.8 | 13% | 11.2 | 1.7 | 1.3 | 1% |
| PRODUZIONE | 8.8 | 5% | 12.6 | 1.7 | 1.6 | 1% |
| VENDITE | 13.6 | 31% | 10.9 | 1.7 | 2.2 | 1% |
| MARKETING | 12.6 | 20% | 8.7 | 1.9 | 1.8 | 1% |
| FINANZA | 13.6 | 24% | 6.9 | 1.0 | 1.8 | 0% |
| RISORSE_UMANE | 13.3 | 13% | 3.9 | 0.0 | 1.0 | 0% |
| RICERCA_SVILUPPO | 13.3 | 16% | 4.9 | 0.0 | 0.9 | 0% |

**8 giocatori** (vittoria attesa se tutti pari: 13%)

| Reparto | Punteggio medio | Vittorie | Peso voto/anno | Segreti come fonte | Favorito | Demansionato |
|---|---|---|---|---|---|---|
| ACQUISTI | 11.5 | 13% | 11.0 | 1.7 | 1.3 | 2% |
| PRODUZIONE | 9.6 | 6% | 12.5 | 1.7 | 1.5 | 3% |
| VENDITE | 14.0 | 37% | 11.1 | 1.7 | 2.4 | 3% |
| MARKETING | 12.7 | 19% | 8.9 | 1.9 | 1.8 | 3% |
| FINANZA | 13.3 | 22% | 6.9 | 1.0 | 1.7 | 1% |
| RISORSE_UMANE | 12.9 | 11% | 3.8 | 0.0 | 1.0 | 0% |
| RICERCA_SVILUPPO | 12.9 | 12% | 4.9 | 0.0 | 0.9 | 0% |
| IT_SICUREZZA | 11.3 | 3% | 4.9 | 0.0 | 0.0 | 1% |

## 4. Profili dei robot: punteggio medio e vittorie

Se gli onesti egoisti battono nettamente i cooperativi, la mossa "reparto" conviene troppo (GDD §9, ⚖️).

| Profilo | Giocatori | Punteggio medio | Punti di reparto medi | Vittorie |
|---|---|---|---|---|
| COOPERATIVO | 12659 | 12.6 | 1.8 | 11% |
| EGOISTA | 12764 | 13.2 | 4.3 | 27% |
| SPIA_PRUDENTE | 2378 | 6.6 | 2.5 | 10% |
| SPIA_AGGRESSIVA | 2199 | 11.1 | 2.6 | 33% |

## 5. Cassa e votazioni

| Posizione nel trimestre | Votazioni | Approvate | Respinte per fondi |
|---|---|---|---|
| 1ª | 20000 | 60% | 0% |
| 2ª | 20000 | 61% | 0% |
| 3ª | 10000 | 56% | 5% |

| Trimestre | Cassa media a inizio trimestre (K) | Approvate |
|---|---|---|
| 1 | 100.0 | 58% |
| 2 | 143.6 | 59% |
| 3 | 143.3 | 60% |
| 4 | 142.9 | 63% |

Tetto della cassa (150 K) raggiunto in 71% dei trimestri 2–4.

## 6. Segreti

| Segreti distribuiti | Arrivati in tempo al reparto giusto | Consegnati ai concorrenti | …di cui falsi |
|---|---|---|---|
| 39993 | 54% | 16% | 0% |

## 7. Avvisi automatici

- ⚠️ Con 4 giocatori e nessuna spia l'azienda vince nel 93% dei casi (obiettivo 55–65%).
- ⚠️ Con 5 giocatori e nessuna spia l'azienda vince nel 93% dei casi (obiettivo 55–65%).
- ⚠️ Con 6 giocatori e nessuna spia l'azienda vince nel 91% dei casi (obiettivo 55–65%).
- ⚠️ Con 7 giocatori e nessuna spia l'azienda vince nel 92% dei casi (obiettivo 55–65%).
- ⚠️ Con 8 giocatori e nessuna spia l'azienda vince nel 90% dei casi (obiettivo 55–65%).
- ⚠️ Con 4 giocatori le vittorie personali tra reparti vanno dal 10% al 54% (scarto oltre 10 punti).
- ⚠️ Con 5 giocatori le vittorie personali tra reparti vanno dal 9% al 32% (scarto oltre 10 punti).
- ⚠️ Con 6 giocatori le vittorie personali tra reparti vanno dal 7% al 33% (scarto oltre 10 punti).
- ⚠️ Con 7 giocatori le vittorie personali tra reparti vanno dal 5% al 31% (scarto oltre 10 punti).
- ⚠️ Con 8 giocatori le vittorie personali tra reparti vanno dal 3% al 37% (scarto oltre 10 punti).
- ⚠️ Gli onesti egoisti vincono il 27% delle partite contro il 11% dei cooperativi: la mossa "reparto" conviene troppo.

## 8. Limiti

- I robot non parlano, non mentono a voce e non persuadono: la parte "psicologica" si misura solo nelle serate di prova.
- I contenuti (16 quesiti, 10 segreti, pesi) sono **segnaposto**: i risultati valgono per il motore e le regole, non ancora per il gioco finale.
- Gli obiettivi personali non esistono ancora (punto aperto 3), quindi i punteggi sono incompleti.
- Il comportamento dei robot (soglie di voto, sospetti, accuse) è una semplificazione descritta in packages/simulator/src/robot.ts.