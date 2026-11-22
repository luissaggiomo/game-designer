# Report del simulatore — Il Direttivo

5000 partite simulate (1000 per ciascun numero di giocatori: 4, 5, 6, 7, 8), semi da 1. Durata: 247.3 s. Data: 2026-11-22.

## 1. Chi vince la corsa di mercato

Obiettivo (Architettura §10.6): **senza spie l'azienda vince nel 55–65% dei casi**; con una spia attiva, sensibilmente meno.

| Giocatori | Spie | Partite | Vince l'azienda | Vince un concorrente | Pareggio |
|---|---|---|---|---|---|
| 4 | 0 | 150 | 57% | 37% | 5% |
| 4 | 1 | 850 | 26% | 69% | 5% |
| 5 | 0 | 150 | 52% | 44% | 4% |
| 5 | 1 | 850 | 27% | 70% | 3% |
| 6 | 0 | 150 | 54% | 41% | 5% |
| 6 | 1 | 850 | 32% | 64% | 4% |
| 7 | 0 | 150 | 54% | 42% | 4% |
| 7 | 1 | 850 | 32% | 64% | 4% |
| 8 | 0 | 150 | 51% | 47% | 3% |
| 8 | 1 | 523 | 35% | 61% | 4% |
| 8 | 2 alleate | 168 | 20% | 80% | 1% |
| 8 | 2 rivali | 159 | 14% | 83% | 3% |

### Scelte aziendaliste e vittoria dell'azienda (partite senza spie)

Quota di mosse private "per l'azienda" sul totale della partita, e quante volte l'azienda vince in ciascuna fascia. La **soglia** è la quota oltre la quale l'azienda vince più spesso di quanto perde.

| Scelte aziendaliste | Partite | Vince l'azienda |
|---|---|---|
| 0–30% | 8 | 0% |
| 30–40% | 37 | 3% |
| 40–50% | 80 | 6% |
| 50–60% | 198 | 19% |
| 60–67% | 158 | 61% |
| 67–75% | 105 | 93% |
| 75–85% | 136 | 99% |
| 85–100% | 28 | 100% |

Quota media di scelte aziendaliste: 62%. Soglia stimata: 65%.

### Chi vince tra onesti e spie (partite con spie)

Vince la spia se il suo concorrente supera l'azienda **e** lei non è stata scoperta (non licenziata); altrimenti vincono gli onesti. Riferimento indicato da Luis: con 4 giocatori e 1 spia, **circa 20% spia, 80% onesti**.

| Giocatori | Spie | Partite | Vincono gli onesti | Vince la spia |
|---|---|---|---|---|
| 4 | 1 | 850 | 74% | 26% |
| 5 | 1 | 850 | 67% | 33% |
| 6 | 1 | 850 | 65% | 35% |
| 7 | 1 | 850 | 60% | 40% |
| 8 | 1 | 523 | 64% | 36% |
| 8 | 2 alleate | 168 | 29% | 71% |
| 8 | 2 rivali | 159 | 31% | 69% |

## 2. Spie: scoperte ed errori

| Giocatori | Spie licenziate (su spie presenti) | Onesti licenziati nel finale (per partita) | Demansionamenti per partita | …di cui su spie |
|---|---|---|---|---|
| 4 | 65% | 0.16 | 0.47 | 83% |
| 5 | 53% | 0.10 | 0.14 | 87% |
| 6 | 46% | 0.19 | 0.20 | 76% |
| 7 | 36% | 0.15 | 0.07 | 67% |
| 8 | 38% | 0.27 | 0.13 | 62% |

## 3. Equità tra reparti (D-005)

Per ogni reparto: punteggio medio, percentuale di partite vinte (punteggio più alto), peso di voto disponibile nell'anno, segreti ricevuti come fonte, volte "favorito" dall'ordine del giorno, percentuale di demansionamenti subiti.


**4 giocatori** (vittoria attesa se tutti pari: 25%)

| Reparto | Punteggio medio | Vittorie | Peso voto/anno | Segreti come fonte | Favorito | Demansionato |
|---|---|---|---|---|---|---|
| ACQUISTI | 11.8 | 27% | 12.3 | 2.0 | 3.5 | 11% |
| PRODUZIONE | 11.7 | 26% | 12.2 | 2.0 | 3.6 | 9% |
| VENDITE | 11.8 | 29% | 12.2 | 2.0 | 3.5 | 11% |
| MARKETING | 11.6 | 27% | 12.3 | 2.0 | 3.5 | 11% |

**5 giocatori** (vittoria attesa se tutti pari: 20%)

| Reparto | Punteggio medio | Vittorie | Peso voto/anno | Segreti come fonte | Favorito | Demansionato |
|---|---|---|---|---|---|---|
| ACQUISTI | 11.2 | 22% | 11.8 | 1.6 | 2.8 | 3% |
| PRODUZIONE | 10.6 | 22% | 11.9 | 1.6 | 2.8 | 3% |
| VENDITE | 11.1 | 23% | 11.9 | 1.6 | 2.8 | 3% |
| MARKETING | 11.3 | 24% | 11.9 | 1.6 | 2.8 | 3% |
| FINANZA | 11.2 | 22% | 11.8 | 1.6 | 2.8 | 2% |

**6 giocatori** (vittoria attesa se tutti pari: 17%)

| Reparto | Punteggio medio | Vittorie | Peso voto/anno | Segreti come fonte | Favorito | Demansionato |
|---|---|---|---|---|---|---|
| ACQUISTI | 11.3 | 19% | 11.6 | 1.3 | 2.4 | 3% |
| PRODUZIONE | 11.2 | 19% | 11.6 | 1.3 | 2.4 | 3% |
| VENDITE | 11.5 | 20% | 11.6 | 1.3 | 2.4 | 4% |
| MARKETING | 11.2 | 17% | 11.5 | 1.3 | 2.4 | 2% |
| FINANZA | 11.2 | 19% | 11.5 | 1.3 | 2.4 | 4% |
| RISORSE_UMANE | 11.4 | 21% | 11.6 | 1.3 | 2.4 | 3% |

**7 giocatori** (vittoria attesa se tutti pari: 14%)

| Reparto | Punteggio medio | Vittorie | Peso voto/anno | Segreti come fonte | Favorito | Demansionato |
|---|---|---|---|---|---|---|
| ACQUISTI | 10.9 | 16% | 11.3 | 1.1 | 2.0 | 0% |
| PRODUZIONE | 10.8 | 17% | 11.3 | 1.2 | 2.1 | 1% |
| VENDITE | 10.7 | 16% | 11.3 | 1.2 | 2.0 | 1% |
| MARKETING | 11.0 | 18% | 11.4 | 1.1 | 2.0 | 1% |
| FINANZA | 11.0 | 17% | 11.4 | 1.1 | 2.0 | 1% |
| RISORSE_UMANE | 10.8 | 15% | 11.3 | 1.1 | 2.0 | 1% |
| RICERCA_SVILUPPO | 11.2 | 17% | 11.3 | 1.2 | 2.0 | 1% |

**8 giocatori** (vittoria attesa se tutti pari: 13%)

| Reparto | Punteggio medio | Vittorie | Peso voto/anno | Segreti come fonte | Favorito | Demansionato |
|---|---|---|---|---|---|---|
| ACQUISTI | 10.9 | 13% | 11.2 | 1.0 | 1.8 | 1% |
| PRODUZIONE | 11.2 | 14% | 11.2 | 1.0 | 1.8 | 2% |
| VENDITE | 11.4 | 17% | 11.1 | 1.0 | 1.8 | 1% |
| MARKETING | 11.5 | 15% | 11.2 | 1.0 | 1.8 | 1% |
| FINANZA | 11.3 | 16% | 11.1 | 1.0 | 1.7 | 1% |
| RISORSE_UMANE | 11.5 | 16% | 11.2 | 1.0 | 1.8 | 2% |
| RICERCA_SVILUPPO | 11.5 | 17% | 11.2 | 1.0 | 1.7 | 2% |
| IT_SICUREZZA | 11.1 | 12% | 11.2 | 1.0 | 1.8 | 2% |

## 4. Profili dei robot: punteggio medio e vittorie

Se gli onesti egoisti battono nettamente i cooperativi, la mossa "reparto" conviene troppo (GDD §9, ⚖️).

| Profilo | Giocatori | Punteggio medio | Punti di reparto medi | Vittorie |
|---|---|---|---|---|
| COOPERATIVO | 12659 | 12.1 | 0.8 | 7% |
| EGOISTA | 12764 | 9.7 | 3.4 | 16% |
| SPIA_PRUDENTE | 2378 | 10.9 | 2.1 | 47% |
| SPIA_AGGRESSIVA | 2199 | 15.6 | 2.5 | 70% |

## 5. Cassa e votazioni

| Posizione nel trimestre | Votazioni | Approvate | Respinte per fondi |
|---|---|---|---|
| 1ª | 20000 | 43% | 0% |
| 2ª | 20000 | 39% | 4% |
| 3ª | 10000 | 32% | 11% |

| Trimestre | Cassa media a inizio trimestre (K) | Approvate |
|---|---|---|
| 1 | 100.0 | 37% |
| 2 | 140.9 | 38% |
| 3 | 142.5 | 38% |
| 4 | 142.9 | 45% |

Tetto della cassa (150 K) raggiunto in 69% dei trimestri 2–4.

## 6. Segreti

| Segreti distribuiti | Arrivati in tempo al reparto giusto | Consegnati ai concorrenti | …di cui falsi |
|---|---|---|---|
| 40000 | 54% | 17% | 0% |

## 7. Avvisi automatici

- ⚠️ Con 5 giocatori e nessuna spia l'azienda vince nel 52% dei casi (obiettivo 55–65%).
- ⚠️ Con 6 giocatori e nessuna spia l'azienda vince nel 54% dei casi (obiettivo 55–65%).
- ⚠️ Con 7 giocatori e nessuna spia l'azienda vince nel 54% dei casi (obiettivo 55–65%).
- ⚠️ Con 8 giocatori e nessuna spia l'azienda vince nel 51% dei casi (obiettivo 55–65%).
- ⚠️ Gli onesti egoisti vincono il 16% delle partite contro il 7% dei cooperativi: la mossa "reparto" conviene troppo.

## 8. Limiti

- I robot non parlano, non mentono a voce e non persuadono: la parte "psicologica" si misura solo nelle serate di prova.
- I contenuti (16 quesiti, 10 segreti, pesi) sono **segnaposto**: i risultati valgono per il motore e le regole, non ancora per il gioco finale.
- Gli obiettivi personali non esistono ancora (punto aperto 3), quindi i punteggi sono incompleti.
- Il comportamento dei robot (soglie di voto, sospetti, accuse) è una semplificazione descritta in packages/simulator/src/robot.ts.