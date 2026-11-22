# Report del simulatore — Il Direttivo

5000 partite simulate (1000 per ciascun numero di giocatori: 4, 5, 6, 7, 8), semi da 1. Durata: 1273.0 s. Data: 2026-11-22.

## 1. Chi vince la corsa di mercato

Obiettivo (Architettura §10.6): **senza spie l'azienda vince nel 55–65% dei casi**; con una spia attiva, sensibilmente meno.

| Giocatori | Spie | Partite | Vince l'azienda | Vince un concorrente | Pareggio |
|---|---|---|---|---|---|
| 4 | 0 | 150 | 55% | 39% | 6% |
| 4 | 1 | 850 | 25% | 70% | 4% |
| 5 | 0 | 150 | 49% | 45% | 6% |
| 5 | 1 | 850 | 27% | 69% | 3% |
| 6 | 0 | 150 | 57% | 40% | 3% |
| 6 | 1 | 850 | 37% | 61% | 2% |
| 7 | 0 | 150 | 61% | 36% | 3% |
| 7 | 1 | 850 | 35% | 62% | 3% |
| 8 | 0 | 150 | 50% | 48% | 2% |
| 8 | 1 | 523 | 41% | 55% | 5% |
| 8 | 2 alleate | 168 | 21% | 74% | 4% |
| 8 | 2 rivali | 159 | 19% | 77% | 4% |

### Scelte aziendaliste e vittoria dell'azienda (partite senza spie)

Quota di mosse private "per l'azienda" sul totale della partita, e quante volte l'azienda vince in ciascuna fascia. La **soglia** è la quota oltre la quale l'azienda vince più spesso di quanto perde.

| Scelte aziendaliste | Partite | Vince l'azienda |
|---|---|---|
| 0–30% | 7 | 0% |
| 30–40% | 35 | 0% |
| 40–50% | 75 | 9% |
| 50–60% | 200 | 25% |
| 60–67% | 172 | 60% |
| 67–75% | 105 | 90% |
| 75–85% | 124 | 97% |
| 85–100% | 32 | 100% |

Quota media di scelte aziendaliste: 62%. Soglia stimata: 60%.

### Chi vince tra onesti e spie (partite con spie)

Vince la spia se il suo concorrente supera l'azienda **e** lei non è stata scoperta (non licenziata); altrimenti vincono gli onesti. Riferimento indicato da Luis: con 4 giocatori e 1 spia, **circa 20% spia, 80% onesti**.

| Giocatori | Spie | Partite | Vincono gli onesti | Vince la spia |
|---|---|---|---|---|
| 4 | 1 | 850 | 74% | 26% |
| 5 | 1 | 850 | 65% | 35% |
| 6 | 1 | 850 | 63% | 37% |
| 7 | 1 | 850 | 61% | 39% |
| 8 | 1 | 523 | 66% | 34% |
| 8 | 2 alleate | 168 | 38% | 63% |
| 8 | 2 rivali | 159 | 34% | 66% |

## 2. Spie: scoperte ed errori

| Giocatori | Spie licenziate (su spie presenti) | Onesti licenziati nel finale (per partita) | Demansionamenti per partita | …di cui su spie |
|---|---|---|---|---|
| 4 | 63% | 0.17 | 0.44 | 79% |
| 5 | 52% | 0.11 | 0.14 | 87% |
| 6 | 42% | 0.19 | 0.19 | 73% |
| 7 | 37% | 0.17 | 0.06 | 75% |
| 8 | 37% | 0.28 | 0.12 | 64% |

## 3. Equità tra reparti (D-005)

Per ogni reparto: punteggio medio, percentuale di partite vinte (punteggio più alto), peso di voto disponibile nell'anno, segreti ricevuti come fonte, volte "favorito" dall'ordine del giorno, percentuale di demansionamenti subiti.


**4 giocatori** (vittoria attesa se tutti pari: 25%)

| Reparto | Punteggio medio | Vittorie | Peso voto/anno | Segreti come fonte | Favorito | Demansionato |
|---|---|---|---|---|---|---|
| ACQUISTI | 10.7 | 27% | 12.1 | 2.0 | 3.6 | 10% |
| PRODUZIONE | 10.8 | 27% | 12.1 | 2.0 | 3.5 | 10% |
| VENDITE | 10.5 | 28% | 12.2 | 2.0 | 3.6 | 10% |
| MARKETING | 11.1 | 29% | 12.2 | 2.0 | 3.6 | 10% |

**5 giocatori** (vittoria attesa se tutti pari: 20%)

| Reparto | Punteggio medio | Vittorie | Peso voto/anno | Segreti come fonte | Favorito | Demansionato |
|---|---|---|---|---|---|---|
| ACQUISTI | 10.4 | 21% | 11.8 | 1.6 | 2.8 | 3% |
| PRODUZIONE | 10.6 | 23% | 11.8 | 1.6 | 2.8 | 2% |
| VENDITE | 10.7 | 22% | 11.8 | 1.6 | 2.8 | 4% |
| MARKETING | 10.8 | 22% | 11.7 | 1.6 | 2.9 | 2% |
| FINANZA | 10.8 | 22% | 11.8 | 1.6 | 2.8 | 3% |

**6 giocatori** (vittoria attesa se tutti pari: 17%)

| Reparto | Punteggio medio | Vittorie | Peso voto/anno | Segreti come fonte | Favorito | Demansionato |
|---|---|---|---|---|---|---|
| ACQUISTI | 11.6 | 21% | 11.5 | 1.3 | 2.3 | 2% |
| PRODUZIONE | 11.2 | 17% | 11.4 | 1.3 | 2.3 | 4% |
| VENDITE | 11.6 | 19% | 11.5 | 1.3 | 2.3 | 4% |
| MARKETING | 11.7 | 18% | 11.5 | 1.3 | 2.3 | 3% |
| FINANZA | 11.4 | 19% | 11.5 | 1.4 | 2.3 | 3% |
| RISORSE_UMANE | 11.7 | 21% | 11.6 | 1.3 | 2.3 | 2% |

**7 giocatori** (vittoria attesa se tutti pari: 14%)

| Reparto | Punteggio medio | Vittorie | Peso voto/anno | Segreti come fonte | Favorito | Demansionato |
|---|---|---|---|---|---|---|
| ACQUISTI | 11.0 | 16% | 11.2 | 1.1 | 2.0 | 2% |
| PRODUZIONE | 11.3 | 16% | 11.3 | 1.2 | 2.0 | 0% |
| VENDITE | 11.3 | 18% | 11.3 | 1.1 | 2.0 | 0% |
| MARKETING | 11.3 | 15% | 11.3 | 1.2 | 2.0 | 1% |
| FINANZA | 11.3 | 17% | 11.3 | 1.2 | 2.0 | 1% |
| RISORSE_UMANE | 11.3 | 18% | 11.3 | 1.2 | 2.0 | 1% |
| RICERCA_SVILUPPO | 11.2 | 17% | 11.3 | 1.1 | 2.0 | 1% |

**8 giocatori** (vittoria attesa se tutti pari: 13%)

| Reparto | Punteggio medio | Vittorie | Peso voto/anno | Segreti come fonte | Favorito | Demansionato |
|---|---|---|---|---|---|---|
| ACQUISTI | 10.9 | 13% | 11.1 | 1.0 | 1.7 | 2% |
| PRODUZIONE | 11.0 | 14% | 11.1 | 1.0 | 1.7 | 1% |
| VENDITE | 11.4 | 17% | 11.1 | 1.0 | 1.7 | 2% |
| MARKETING | 11.0 | 14% | 11.1 | 1.0 | 1.8 | 2% |
| FINANZA | 11.2 | 14% | 11.1 | 1.0 | 1.8 | 1% |
| RISORSE_UMANE | 11.4 | 16% | 11.1 | 1.0 | 1.7 | 2% |
| RICERCA_SVILUPPO | 11.1 | 15% | 11.0 | 1.0 | 1.7 | 1% |
| IT_SICUREZZA | 11.2 | 15% | 11.1 | 1.0 | 1.7 | 2% |

## 4. Profili dei robot: punteggio medio e vittorie

Se gli onesti egoisti battono nettamente i cooperativi, la mossa "reparto" conviene troppo (GDD §9, ⚖️).

| Profilo | Giocatori | Punteggio medio | Punti di reparto medi | Vittorie |
|---|---|---|---|---|
| COOPERATIVO | 12659 | 13.0 | 0.8 | 9% |
| EGOISTA | 12764 | 10.1 | 3.4 | 23% |
| SPIA_PRUDENTE | 2378 | 7.1 | 2.1 | 32% |
| SPIA_AGGRESSIVA | 2199 | 10.5 | 2.5 | 40% |

## 5. Cassa e votazioni

| Posizione nel trimestre | Votazioni | Approvate | Respinte per fondi |
|---|---|---|---|
| 1ª | 20000 | 43% | 0% |
| 2ª | 20000 | 38% | 5% |
| 3ª | 10000 | 30% | 12% |

| Trimestre | Cassa media a inizio trimestre (K) | Approvate |
|---|---|---|
| 1 | 100.0 | 37% |
| 2 | 140.0 | 37% |
| 3 | 142.1 | 37% |
| 4 | 142.6 | 43% |

Tetto della cassa (150 K) raggiunto in 68% dei trimestri 2–4.

## 6. Segreti

| Segreti distribuiti | Arrivati in tempo al reparto giusto | Consegnati ai concorrenti | …di cui falsi |
|---|---|---|---|
| 40000 | 54% | 16% | 0% |

## 7. Avvisi automatici

- ⚠️ Con 5 giocatori e nessuna spia l'azienda vince nel 49% dei casi (obiettivo 55–65%).
- ⚠️ Con 8 giocatori e nessuna spia l'azienda vince nel 50% dei casi (obiettivo 55–65%).
- ⚠️ Gli onesti egoisti vincono il 23% delle partite contro il 9% dei cooperativi: la mossa "reparto" conviene troppo.

## 8. Limiti

- I robot non parlano, non mentono a voce e non persuadono: la parte "psicologica" si misura solo nelle serate di prova.
- Contenuti veri (40 quesiti, 36 segreti con valori variabili e tipi a bilancia, D-030…D-039), ma i robot non leggono i testi: votano sui numeri e non usano il tipo dei segreti per decidere a chi darli.
- Gli obiettivi personali non esistono ancora (punto aperto 3), quindi i punteggi sono incompleti.
- Il comportamento dei robot (soglie di voto, sospetti, accuse) è una semplificazione descritta in packages/simulator/src/robot.ts.