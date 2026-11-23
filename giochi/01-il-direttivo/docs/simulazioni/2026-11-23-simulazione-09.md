# Report del simulatore — Il Direttivo

5000 partite simulate (1000 per ciascun numero di giocatori: 4, 5, 6, 7, 8), semi da 1. Durata: 1486.7 s. Data: 2026-11-23 (prima simulazione con gli obiettivi personali, D-046…D-052). Confronto con il report 08 e proposte: vedi in fondo.

## 1. Chi vince la corsa di mercato

Obiettivo (Architettura §10.6): **senza spie l'azienda vince nel 55–65% dei casi**; con una spia attiva, sensibilmente meno.

| Giocatori | Spie | Partite | Vince l'azienda | Vince un concorrente | Pareggio |
|---|---|---|---|---|---|
| 4 | 0 | 150 | 57% | 41% | 1% |
| 4 | 1 | 850 | 25% | 71% | 4% |
| 5 | 0 | 150 | 59% | 39% | 3% |
| 5 | 1 | 850 | 30% | 68% | 2% |
| 6 | 0 | 150 | 63% | 35% | 3% |
| 6 | 1 | 850 | 37% | 60% | 3% |
| 7 | 0 | 150 | 57% | 40% | 3% |
| 7 | 1 | 850 | 39% | 58% | 3% |
| 8 | 0 | 150 | 59% | 39% | 3% |
| 8 | 1 | 523 | 43% | 54% | 3% |
| 8 | 2 alleate | 168 | 23% | 74% | 3% |
| 8 | 2 rivali | 159 | 34% | 65% | 1% |

### Scelte aziendaliste e vittoria dell'azienda (partite senza spie)

Quota di mosse private "per l'azienda" sul totale della partita, e quante volte l'azienda vince in ciascuna fascia. La **soglia** è la quota oltre la quale l'azienda vince più spesso di quanto perde.

| Scelte aziendaliste | Partite | Vince l'azienda |
|---|---|---|
| 0–30% | 10 | 0% |
| 30–40% | 34 | 0% |
| 40–50% | 63 | 0% |
| 50–60% | 185 | 29% |
| 60–67% | 165 | 65% |
| 67–75% | 109 | 91% |
| 75–85% | 142 | 99% |
| 85–100% | 42 | 100% |

Quota media di scelte aziendaliste: 63%. Soglia stimata: 65%.

### Chi vince tra onesti e spie (partite con spie)

Vince la spia se il suo concorrente supera l'azienda **e** lei non è stata scoperta (non licenziata); altrimenti vincono gli onesti. Riferimento indicato da Luis: con 4 giocatori e 1 spia, **circa 20% spia, 80% onesti**.

| Giocatori | Spie | Partite | Vincono gli onesti | Vince la spia |
|---|---|---|---|---|
| 4 | 1 | 850 | 70% | 30% |
| 5 | 1 | 850 | 69% | 31% |
| 6 | 1 | 850 | 68% | 32% |
| 7 | 1 | 850 | 64% | 36% |
| 8 | 1 | 523 | 70% | 30% |
| 8 | 2 alleate | 168 | 40% | 60% |
| 8 | 2 rivali | 159 | 45% | 55% |

## 2. Spie: scoperte ed errori

| Giocatori | Spie licenziate (su spie presenti) | Onesti licenziati nel finale (per partita) | Demansionamenti per partita | …di cui su spie |
|---|---|---|---|---|
| 4 | 58% | 0.33 | 0.49 | 61% |
| 5 | 54% | 0.21 | 0.18 | 64% |
| 6 | 45% | 0.30 | 0.23 | 59% |
| 7 | 38% | 0.28 | 0.08 | 65% |
| 8 | 40% | 0.48 | 0.16 | 46% |

## 3. Equità tra reparti (D-005)

Per ogni reparto: punteggio medio, percentuale di partite vinte (punteggio più alto), peso di voto disponibile nell'anno, segreti ricevuti come fonte, volte "favorito" dall'ordine del giorno, percentuale di demansionamenti subiti.


**4 giocatori** (vittoria attesa se tutti pari: 25%)

| Reparto | Punteggio medio | Vittorie | Peso voto/anno | Segreti come fonte | Favorito | Demansionato |
|---|---|---|---|---|---|---|
| ACQUISTI | 14.0 | 26% | 12.1 | 2.0 | 3.5 | 11% |
| PRODUZIONE | 14.6 | 27% | 12.2 | 2.0 | 3.5 | 12% |
| VENDITE | 14.8 | 28% | 12.1 | 2.0 | 3.5 | 11% |
| MARKETING | 14.4 | 28% | 12.2 | 2.0 | 3.5 | 12% |

**5 giocatori** (vittoria attesa se tutti pari: 20%)

| Reparto | Punteggio medio | Vittorie | Peso voto/anno | Segreti come fonte | Favorito | Demansionato |
|---|---|---|---|---|---|---|
| ACQUISTI | 14.9 | 20% | 11.8 | 1.6 | 2.8 | 3% |
| PRODUZIONE | 15.2 | 21% | 11.8 | 1.6 | 2.8 | 4% |
| VENDITE | 15.2 | 23% | 11.8 | 1.6 | 2.8 | 3% |
| MARKETING | 15.1 | 22% | 11.7 | 1.6 | 2.8 | 4% |
| FINANZA | 15.4 | 23% | 11.7 | 1.6 | 2.8 | 4% |

**6 giocatori** (vittoria attesa se tutti pari: 17%)

| Reparto | Punteggio medio | Vittorie | Peso voto/anno | Segreti come fonte | Favorito | Demansionato |
|---|---|---|---|---|---|---|
| ACQUISTI | 15.2 | 18% | 11.4 | 1.3 | 2.4 | 3% |
| PRODUZIONE | 14.8 | 18% | 11.5 | 1.3 | 2.4 | 4% |
| VENDITE | 15.5 | 20% | 11.5 | 1.3 | 2.4 | 5% |
| MARKETING | 15.6 | 19% | 11.5 | 1.3 | 2.4 | 4% |
| FINANZA | 15.0 | 18% | 11.5 | 1.3 | 2.4 | 4% |
| RISORSE_UMANE | 15.2 | 17% | 11.4 | 1.3 | 2.4 | 3% |

**7 giocatori** (vittoria attesa se tutti pari: 14%)

| Reparto | Punteggio medio | Vittorie | Peso voto/anno | Segreti come fonte | Favorito | Demansionato |
|---|---|---|---|---|---|---|
| ACQUISTI | 14.9 | 16% | 11.3 | 1.1 | 2.0 | 1% |
| PRODUZIONE | 14.8 | 16% | 11.3 | 1.2 | 2.0 | 1% |
| VENDITE | 15.1 | 15% | 11.2 | 1.2 | 2.0 | 1% |
| MARKETING | 14.8 | 15% | 11.3 | 1.1 | 2.0 | 2% |
| FINANZA | 15.0 | 16% | 11.3 | 1.1 | 2.0 | 1% |
| RISORSE_UMANE | 14.7 | 15% | 11.2 | 1.1 | 2.0 | 1% |
| RICERCA_SVILUPPO | 15.2 | 18% | 11.3 | 1.1 | 2.0 | 1% |

**8 giocatori** (vittoria attesa se tutti pari: 13%)

| Reparto | Punteggio medio | Vittorie | Peso voto/anno | Segreti come fonte | Favorito | Demansionato |
|---|---|---|---|---|---|---|
| ACQUISTI | 15.0 | 15% | 11.1 | 1.0 | 1.8 | 1% |
| PRODUZIONE | 15.3 | 14% | 11.1 | 1.0 | 1.8 | 2% |
| VENDITE | 14.8 | 12% | 11.1 | 1.0 | 1.8 | 2% |
| MARKETING | 15.0 | 14% | 11.1 | 1.0 | 1.7 | 2% |
| FINANZA | 15.6 | 16% | 11.1 | 1.0 | 1.8 | 2% |
| RISORSE_UMANE | 14.7 | 13% | 11.1 | 1.0 | 1.8 | 2% |
| RICERCA_SVILUPPO | 15.3 | 15% | 11.1 | 1.0 | 1.7 | 2% |
| IT_SICUREZZA | 15.0 | 14% | 11.1 | 1.0 | 1.8 | 2% |

## 4. Profili dei robot: punteggio medio e vittorie

Se gli onesti egoisti battono nettamente i cooperativi, la mossa "reparto" conviene troppo (GDD §9, ⚖️).

| Profilo | Giocatori | Punteggio medio | Punti di reparto medi | Vittorie |
|---|---|---|---|---|
| COOPERATIVO | 12659 | 17.3 | 0.7 | 14% |
| EGOISTA | 12764 | 14.2 | 3.2 | 18% |
| SPIA_PRUDENTE | 2378 | 10.0 | 2.0 | 28% |
| SPIA_AGGRESSIVA | 2199 | 11.5 | 2.6 | 35% |

## 4b. Obiettivi personali

Obiettivi di taratura (D-051): traguardo **facile** raggiunto dal **60–70%** di chi l'ha scelto, **difficile** dal **25–35%**; **i tre tipi rendono in media lo stesso (±1 punto)**; nessun reparto avvantaggiato. Si regolano le soglie, non i punti.

| Tipo | Scelto da | Facile raggiunto | Difficile raggiunto | Punti medi | …onesti | …spie |
|---|---|---|---|---|---|---|
| 1 | 34% | 68% | 32% | 3.7 | 3.8 | 2.6 |
| 2 | 33% | 60% | 36% | 4.3 | 4.5 | 3.2 |
| 3 | 33% | 59% | 36% | 4.5 | 4.7 | 3.7 |

### Resa di ogni obiettivo

⚖️ = fuori dagli obiettivi di taratura (con almeno 30 scelte). 🏢 = aziendalista.

| Obiettivo | Nome | Scelto | Facile | Difficile | Punti medi |
|---|---|---|---|---|---|
| T1-01 | Bastian contrario | 829 | 87% ⚖️ | 45% ⚖️ | 4.8 |
| T1-02 | Ago della bilancia | 790 | 81% ⚖️ | 42% ⚖️ | 4.5 |
| T1-03 | Forbici | 818 | 98% ⚖️ | 72% ⚖️ | 6.5 |
| T1-04 | Passaparola | 813 | 20% ⚖️ | 0% ⚖️ | 0.6 |
| T1-05 | Falsario | 801 | 83% ⚖️ | 0% ⚖️ | 2.5 |
| T1-06 | Centralino | 816 | 36% ⚖️ | 4% ⚖️ | 1.3 |
| T1-07 | Confidente | 821 | 23% ⚖️ | 4% ⚖️ | 0.9 |
| T1-08 | Cassaforte | 832 | 98% ⚖️ | 79% ⚖️ | 6.9 |
| T1-09 | 🏢 Gioco di squadra | 918 | 75% ⚖️ | 54% ⚖️ | 4.9 |
| T1-10 | 🏢 In linea | 890 | 72% ⚖️ | 38% ⚖️ | 4.1 |
| T1-11 | 🏢 Occhio clinico | 851 | 53% ⚖️ | 25% | 2.8 |
| T1-12 | 🏢 Postino | 876 | 84% ⚖️ | 24% ⚖️ | 3.7 |
| T2-01 | Voce critica | 793 | 19% ⚖️ | 61% ⚖️ | 4.9 |
| T2-02 | Riformatore | 834 | 49% ⚖️ | 12% ⚖️ | 2.3 |
| T2-03 | Archivista | 795 | 19% ⚖️ | 5% ⚖️ | 0.9 |
| T2-04 | Disinformatore | 803 | 86% ⚖️ | 24% ⚖️ | 4.3 |
| T2-05 | Popolare | 821 | 8% ⚖️ | 24% ⚖️ | 1.9 |
| T2-06 | Fantasma | 770 | 35% ⚖️ | 43% ⚖️ | 4.1 |
| T2-07 | Intoccabile | 836 | 90% ⚖️ | 70% ⚖️ | 7.6 |
| T2-08 | Forbici d'oro | 804 | 99% ⚖️ | 82% ⚖️ | 8.7 |
| T2-09 | 🏢 Squadra | 868 | 89% ⚖️ | 49% ⚖️ | 6.1 |
| T2-10 | 🏢 Occhio clinico | 922 | 53% ⚖️ | 5% ⚖️ | 1.9 |
| T2-11 | 🏢 Postino | 884 | 79% ⚖️ | 25% | 4.1 |
| T2-12 | 🏢 Consenso | 846 | 84% ⚖️ | 38% ⚖️ | 5.2 |
| T3-01 | Ago d'oro | 809 | 83% ⚖️ | 47% ⚖️ | 6.1 |
| T3-02 | Voce solitaria | 801 | 67% | 7% ⚖️ | 3.1 |
| T3-03 | Rete | 796 | 55% ⚖️ | 0% ⚖️ | 2.2 |
| T3-04 | Canarino | 816 | 84% ⚖️ | 34% | 5.4 |
| T3-05 | Crocevia | 815 | 4% ⚖️ | 0% ⚖️ | 0.2 |
| T3-06 | Sentinella | 807 | 85% ⚖️ | 54% ⚖️ | 6.6 |
| T3-07 | Tesoriere | 799 | 75% ⚖️ | 82% ⚖️ | 7.9 |
| T3-08 | Controcorrente | 764 | 26% ⚖️ | 70% ⚖️ | 5.3 |
| T3-09 | 🏢 Squadra | 880 | 75% ⚖️ | 88% ⚖️ | 8.3 |
| T3-10 | 🏢 Occhio clinico | 893 | 32% ⚖️ | 15% ⚖️ | 2.2 |
| T3-11 | 🏢 Custode | 895 | 80% ⚖️ | 18% ⚖️ | 4.3 |
| T3-12 | 🏢 Maggioranza | 894 | 35% ⚖️ | 24% ⚖️ | 2.8 |

### Obiettivi per profilo

| Profilo | Punti obiettivo medi | Facile raggiunto | Difficile raggiunto |
|---|---|---|---|
| COOPERATIVO | 4.5 | 67% | 37% |
| EGOISTA | 4.2 | 61% | 36% |
| SPIA_PRUDENTE | 4.0 | 65% | 32% |
| SPIA_AGGRESSIVA | 2.3 | 35% | 19% |

Dilemma della spia (partite con una spia): chi ha preso punti dall'obiettivo aziendalista vince la partita nel 31% dei casi (2199 spie), chi non ne ha presi nel 33% (1724 spie).

### Obiettivi per numero di giocatori ed equità tra reparti (D-005)

| Giocatori | Punti obiettivo medi | Reparto più basso | Reparto più alto |
|---|---|---|---|
| 4 | 4.7 | 4.6 | 4.8 |
| 5 | 4.5 | 4.3 | 4.7 |
| 6 | 4.1 | 3.9 | 4.4 |
| 7 | 4.0 | 3.8 | 4.2 |
| 8 | 3.8 | 3.8 | 3.9 |

## 5. Cassa e votazioni

| Posizione nel trimestre | Votazioni | Approvate | Respinte per fondi |
|---|---|---|---|
| 1ª | 20000 | 39% | 0% |
| 2ª | 20000 | 36% | 4% |
| 3ª | 10000 | 30% | 9% |

> ⚠️ Nota: in questo report la colonna della cassa è sfasata di un trimestre (la riga T1 mostra 0, la T2 il valore del T1, ecc.) e la quota del tetto conta anche il T1: errore del report dovuto alla nuova fase di scelta degli obiettivi, corretto nel simulatore dopo questa simulazione. Le altre tabelle non sono toccate.

| Trimestre | Cassa media a inizio trimestre (K) | Approvate |
|---|---|---|
| 1 | 0.0 | 35% |
| 2 | 100.0 | 35% |
| 3 | 141.5 | 35% |
| 4 | 143.8 | 40% |

Tetto della cassa (150 K) raggiunto in 54% dei trimestri 2–4.

## 6. Segreti

| Segreti distribuiti | Arrivati in tempo al reparto giusto | Consegnati ai concorrenti | …di cui falsi |
|---|---|---|---|
| 39994 | 54% | 19% | 8% |

## 7. Avvisi automatici

- ⚠️ Obiettivi: 36 su 36 hanno almeno un traguardo fuori dagli obiettivi di taratura (soglie da ritoccare).

## 8. Limiti

- I robot non parlano, non mentono a voce e non persuadono: la parte "psicologica" si misura solo nelle serate di prova.
- Contenuti veri (40 quesiti, 36 segreti con valori variabili e tipi a bilancia, D-030…D-039), ma i robot non leggono i testi: votano sui numeri e non usano il tipo dei segreti per decidere a chi darli.
- Obiettivi personali (D-046…D-052): i robot scelgono metà delle volte secondo il profilo e metà a caso, e li perseguono con regole semplici (robot.ts). Non sanno "leggere la sala": gli obiettivi che chiedono di indovinare l'esito di un voto o l'effetto sull'azienda risultano più difficili che per una persona. I messaggi di solo testo sono simulati con una probabilità fissa.
- Il comportamento dei robot (soglie di voto, sospetti, accuse) è una semplificazione descritta in packages/simulator/src/robot.ts.