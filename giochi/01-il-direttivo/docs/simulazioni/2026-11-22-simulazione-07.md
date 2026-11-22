# Report del simulatore — Il Direttivo

5000 partite simulate (1000 per ciascun numero di giocatori: 4, 5, 6, 7, 8), semi da 1. Durata: 1162.5 s. Data: 2026-11-22.

## 1. Chi vince la corsa di mercato

Obiettivo (Architettura §10.6): **senza spie l'azienda vince nel 55–65% dei casi**; con una spia attiva, sensibilmente meno.

| Giocatori | Spie | Partite | Vince l'azienda | Vince un concorrente | Pareggio |
|---|---|---|---|---|---|
| 4 | 0 | 150 | 57% | 38% | 5% |
| 4 | 1 | 850 | 27% | 70% | 4% |
| 5 | 0 | 150 | 50% | 47% | 3% |
| 5 | 1 | 850 | 27% | 71% | 3% |
| 6 | 0 | 150 | 60% | 38% | 2% |
| 6 | 1 | 850 | 34% | 63% | 3% |
| 7 | 0 | 150 | 56% | 40% | 4% |
| 7 | 1 | 850 | 37% | 60% | 3% |
| 8 | 0 | 150 | 57% | 40% | 3% |
| 8 | 1 | 523 | 41% | 56% | 2% |
| 8 | 2 alleate | 168 | 23% | 74% | 3% |
| 8 | 2 rivali | 159 | 23% | 77% | 0% |

### Scelte aziendaliste e vittoria dell'azienda (partite senza spie)

Quota di mosse private "per l'azienda" sul totale della partita, e quante volte l'azienda vince in ciascuna fascia. La **soglia** è la quota oltre la quale l'azienda vince più spesso di quanto perde.

| Scelte aziendaliste | Partite | Vince l'azienda |
|---|---|---|
| 0–30% | 12 | 0% |
| 30–40% | 42 | 0% |
| 40–50% | 73 | 1% |
| 50–60% | 188 | 27% |
| 60–67% | 172 | 69% |
| 67–75% | 109 | 91% |
| 75–85% | 127 | 98% |
| 85–100% | 27 | 100% |

Quota media di scelte aziendaliste: 61%. Soglia stimata: 60%.

### Chi vince tra onesti e spie (partite con spie)

Vince la spia se il suo concorrente supera l'azienda **e** lei non è stata scoperta (non licenziata); altrimenti vincono gli onesti. Riferimento indicato da Luis: con 4 giocatori e 1 spia, **circa 20% spia, 80% onesti**.

| Giocatori | Spie | Partite | Vincono gli onesti | Vince la spia |
|---|---|---|---|---|
| 4 | 1 | 850 | 76% | 24% |
| 5 | 1 | 850 | 66% | 34% |
| 6 | 1 | 850 | 65% | 35% |
| 7 | 1 | 850 | 60% | 40% |
| 8 | 1 | 523 | 67% | 33% |
| 8 | 2 alleate | 168 | 37% | 63% |
| 8 | 2 rivali | 159 | 36% | 64% |

## 2. Spie: scoperte ed errori

| Giocatori | Spie licenziate (su spie presenti) | Onesti licenziati nel finale (per partita) | Demansionamenti per partita | …di cui su spie |
|---|---|---|---|---|
| 4 | 64% | 0.17 | 0.48 | 83% |
| 5 | 52% | 0.11 | 0.11 | 82% |
| 6 | 45% | 0.17 | 0.19 | 76% |
| 7 | 33% | 0.14 | 0.06 | 71% |
| 8 | 38% | 0.24 | 0.13 | 67% |

## 3. Equità tra reparti (D-005)

Per ogni reparto: punteggio medio, percentuale di partite vinte (punteggio più alto), peso di voto disponibile nell'anno, segreti ricevuti come fonte, volte "favorito" dall'ordine del giorno, percentuale di demansionamenti subiti.


**4 giocatori** (vittoria attesa se tutti pari: 25%)

| Reparto | Punteggio medio | Vittorie | Peso voto/anno | Segreti come fonte | Favorito | Demansionato |
|---|---|---|---|---|---|---|
| ACQUISTI | 11.4 | 30% | 12.2 | 2.0 | 3.6 | 11% |
| PRODUZIONE | 10.6 | 25% | 12.2 | 2.0 | 3.6 | 10% |
| VENDITE | 10.9 | 26% | 12.2 | 2.0 | 3.5 | 11% |
| MARKETING | 10.9 | 29% | 12.2 | 2.0 | 3.5 | 11% |

**5 giocatori** (vittoria attesa se tutti pari: 20%)

| Reparto | Punteggio medio | Vittorie | Peso voto/anno | Segreti come fonte | Favorito | Demansionato |
|---|---|---|---|---|---|---|
| ACQUISTI | 10.4 | 21% | 11.9 | 1.6 | 2.8 | 2% |
| PRODUZIONE | 10.4 | 21% | 11.7 | 1.6 | 2.8 | 2% |
| VENDITE | 10.7 | 24% | 11.8 | 1.6 | 2.9 | 3% |
| MARKETING | 10.5 | 23% | 11.8 | 1.6 | 2.9 | 2% |
| FINANZA | 10.8 | 23% | 11.8 | 1.6 | 2.8 | 2% |

**6 giocatori** (vittoria attesa se tutti pari: 17%)

| Reparto | Punteggio medio | Vittorie | Peso voto/anno | Segreti come fonte | Favorito | Demansionato |
|---|---|---|---|---|---|---|
| ACQUISTI | 11.2 | 18% | 11.6 | 1.3 | 2.4 | 3% |
| PRODUZIONE | 11.2 | 19% | 11.5 | 1.4 | 2.3 | 3% |
| VENDITE | 11.6 | 21% | 11.5 | 1.3 | 2.4 | 3% |
| MARKETING | 11.2 | 18% | 11.5 | 1.3 | 2.4 | 2% |
| FINANZA | 11.4 | 18% | 11.5 | 1.3 | 2.3 | 4% |
| RISORSE_UMANE | 11.6 | 20% | 11.5 | 1.3 | 2.4 | 3% |

**7 giocatori** (vittoria attesa se tutti pari: 14%)

| Reparto | Punteggio medio | Vittorie | Peso voto/anno | Segreti come fonte | Favorito | Demansionato |
|---|---|---|---|---|---|---|
| ACQUISTI | 11.2 | 16% | 11.3 | 1.1 | 2.1 | 1% |
| PRODUZIONE | 11.5 | 18% | 11.3 | 1.1 | 2.1 | 1% |
| VENDITE | 11.4 | 16% | 11.3 | 1.1 | 2.0 | 1% |
| MARKETING | 11.4 | 20% | 11.3 | 1.1 | 2.1 | 1% |
| FINANZA | 11.6 | 17% | 11.3 | 1.2 | 2.1 | 1% |
| RISORSE_UMANE | 11.3 | 16% | 11.2 | 1.2 | 2.1 | 1% |
| RICERCA_SVILUPPO | 11.3 | 15% | 11.3 | 1.1 | 2.1 | 1% |

**8 giocatori** (vittoria attesa se tutti pari: 13%)

| Reparto | Punteggio medio | Vittorie | Peso voto/anno | Segreti come fonte | Favorito | Demansionato |
|---|---|---|---|---|---|---|
| ACQUISTI | 11.4 | 14% | 11.1 | 1.0 | 1.8 | 2% |
| PRODUZIONE | 11.9 | 16% | 11.1 | 1.0 | 1.8 | 2% |
| VENDITE | 11.7 | 16% | 11.1 | 1.0 | 1.8 | 2% |
| MARKETING | 12.0 | 15% | 11.2 | 1.0 | 1.8 | 2% |
| FINANZA | 12.0 | 15% | 11.1 | 1.0 | 1.8 | 1% |
| RISORSE_UMANE | 11.8 | 15% | 11.2 | 1.0 | 1.8 | 2% |
| RICERCA_SVILUPPO | 11.7 | 15% | 11.1 | 1.0 | 1.8 | 1% |
| IT_SICUREZZA | 11.6 | 15% | 11.1 | 1.0 | 1.8 | 1% |

## 4. Profili dei robot: punteggio medio e vittorie

Se gli onesti egoisti battono nettamente i cooperativi, la mossa "reparto" conviene troppo (GDD §9, ⚖️).

| Profilo | Giocatori | Punteggio medio | Punti di reparto medi | Vittorie |
|---|---|---|---|---|
| COOPERATIVO | 12659 | 13.2 | 0.8 | 10% |
| EGOISTA | 12764 | 10.3 | 3.3 | 23% |
| SPIA_PRUDENTE | 2378 | 7.3 | 2.2 | 31% |
| SPIA_AGGRESSIVA | 2199 | 10.4 | 2.5 | 39% |

## 5. Cassa e votazioni

| Posizione nel trimestre | Votazioni | Approvate | Respinte per fondi |
|---|---|---|---|
| 1ª | 20000 | 43% | 0% |
| 2ª | 20000 | 39% | 4% |
| 3ª | 10000 | 32% | 10% |

| Trimestre | Cassa media a inizio trimestre (K) | Approvate |
|---|---|---|
| 1 | 100.0 | 37% |
| 2 | 140.9 | 37% |
| 3 | 142.7 | 38% |
| 4 | 142.7 | 45% |

Tetto della cassa (150 K) raggiunto in 69% dei trimestri 2–4.

## 6. Segreti

| Segreti distribuiti | Arrivati in tempo al reparto giusto | Consegnati ai concorrenti | …di cui falsi |
|---|---|---|---|
| 40000 | 54% | 16% | 0% |

## 7. Avvisi automatici

- ⚠️ Con 5 giocatori e nessuna spia l'azienda vince nel 50% dei casi (obiettivo 55–65%).
- ⚠️ Gli onesti egoisti vincono il 23% delle partite contro il 10% dei cooperativi: la mossa "reparto" conviene troppo.

## 8. Limiti

- I robot non parlano, non mentono a voce e non persuadono: la parte "psicologica" si misura solo nelle serate di prova.
- Contenuti veri (40 quesiti, 36 segreti con valori variabili e tipi a bilancia, D-030…D-039), ma i robot non leggono i testi: votano sui numeri e non usano il tipo dei segreti per decidere a chi darli.
- Gli obiettivi personali non esistono ancora (punto aperto 3), quindi i punteggi sono incompleti.
- Il comportamento dei robot (soglie di voto, sospetti, accuse) è una semplificazione descritta in packages/simulator/src/robot.ts.