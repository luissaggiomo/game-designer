# Report del simulatore — Il Direttivo

Concorrenti (D-056): direttivo di riferimento al 45% di scelte aziendaliste, effetto medio di proposte e segreti 2.93 a trimestre. 5000 partite simulate (1000 per ciascun numero di giocatori: 4, 5, 6, 7, 8), semi da 1. Durata: 1283.7 s. Data: 2026-11-23. Dopo D-056 (concorrente = azienda media al 45% di scelte aziendaliste; segreti veri +1/+2/+3, falsi −4; evento casuale −1/0/+1). Confronto col report 10: spia vincente con 1 spia 28–35% → 15–25%, con 2 spie 53–57% → 34–39%; spie scoperte invariate; soglia stimata 60% → 55%.

## 1. Chi vince la corsa di mercato

Con una spia attiva l'azienda deve vincere sensibilmente meno. La vittoria dell'azienda senza spie è **solo informativa** (D-054: ogni giocatore punta a vincere personalmente).

| Giocatori | Spie | Partite | Vince l'azienda | Vince un concorrente | Pareggio |
|---|---|---|---|---|---|
| 4 | 0 | 150 | 71% | 25% | 4% |
| 4 | 1 | 850 | 41% | 55% | 4% |
| 5 | 0 | 150 | 80% | 19% | 1% |
| 5 | 1 | 850 | 48% | 48% | 5% |
| 6 | 0 | 150 | 79% | 17% | 4% |
| 6 | 1 | 850 | 59% | 37% | 4% |
| 7 | 0 | 150 | 80% | 18% | 2% |
| 7 | 1 | 850 | 65% | 32% | 4% |
| 8 | 0 | 150 | 86% | 13% | 1% |
| 8 | 1 | 523 | 70% | 26% | 4% |
| 8 | 2 alleate | 168 | 54% | 43% | 3% |
| 8 | 2 rivali | 159 | 55% | 42% | 3% |

### Scelte aziendaliste e vittoria dell'azienda (partite senza spie)

Quota di mosse private "per l'azienda" sul totale della partita, e quante volte l'azienda vince in ciascuna fascia. La **soglia** è la quota oltre la quale l'azienda vince più spesso di quanto perde.

| Scelte aziendaliste | Partite | Vince l'azienda |
|---|---|---|
| 0–30% | 4 | 0% |
| 30–40% | 26 | 4% |
| 40–50% | 67 | 16% |
| 50–60% | 177 | 66% |
| 60–67% | 183 | 96% |
| 67–75% | 108 | 99% |
| 75–85% | 146 | 99% |
| 85–100% | 39 | 100% |

Quota media di scelte aziendaliste: 63%. Soglia stimata: 55%.

### Chi vince tra onesti e spie (partite con spie)

Vince la spia se il suo concorrente supera l'azienda **e** lei non è stata scoperta (non licenziata); altrimenti vincono gli onesti. Riferimento indicato da Luis: con 4 giocatori e 1 spia, **circa 20% spia, 80% onesti**.

| Giocatori | Spie | Partite | Vincono gli onesti | Vince la spia |
|---|---|---|---|---|
| 4 | 1 | 850 | 77% | 23% |
| 5 | 1 | 850 | 75% | 25% |
| 6 | 1 | 850 | 78% | 22% |
| 7 | 1 | 850 | 77% | 23% |
| 8 | 1 | 523 | 85% | 15% |
| 8 | 2 alleate | 168 | 61% | 39% |
| 8 | 2 rivali | 159 | 66% | 34% |

## 2. Spie: scoperte ed errori

| Giocatori | Spie licenziate (su spie presenti) | Onesti licenziati nel finale (per partita) | Demansionamenti per partita | …di cui su spie |
|---|---|---|---|---|
| 4 | 58% | 0.31 | 0.51 | 65% |
| 5 | 46% | 0.20 | 0.17 | 62% |
| 6 | 43% | 0.27 | 0.24 | 58% |
| 7 | 34% | 0.20 | 0.08 | 49% |
| 8 | 35% | 0.38 | 0.16 | 46% |

## 3. Equità tra reparti (D-005)

Per ogni reparto: punteggio medio, percentuale di partite vinte (punteggio più alto), peso di voto disponibile nell'anno, segreti ricevuti come fonte, volte "favorito" dall'ordine del giorno, percentuale di demansionamenti subiti.


**4 giocatori** (vittoria attesa se tutti pari: 25%)

| Reparto | Punteggio medio | Vittorie | Peso voto/anno | Segreti come fonte | Favorito | Demansionato |
|---|---|---|---|---|---|---|
| ACQUISTI | 16.5 | 28% | 12.2 | 2.0 | 3.5 | 10% |
| PRODUZIONE | 16.3 | 25% | 12.2 | 2.0 | 3.5 | 11% |
| VENDITE | 16.3 | 27% | 12.1 | 2.0 | 3.5 | 13% |
| MARKETING | 15.8 | 27% | 12.1 | 2.0 | 3.5 | 13% |

**5 giocatori** (vittoria attesa se tutti pari: 20%)

| Reparto | Punteggio medio | Vittorie | Peso voto/anno | Segreti come fonte | Favorito | Demansionato |
|---|---|---|---|---|---|---|
| ACQUISTI | 17.1 | 19% | 11.7 | 1.6 | 2.8 | 4% |
| PRODUZIONE | 17.3 | 21% | 11.8 | 1.6 | 2.8 | 3% |
| VENDITE | 17.4 | 23% | 11.7 | 1.6 | 2.9 | 3% |
| MARKETING | 17.3 | 23% | 11.8 | 1.6 | 2.8 | 3% |
| FINANZA | 17.4 | 23% | 11.8 | 1.6 | 2.8 | 4% |

**6 giocatori** (vittoria attesa se tutti pari: 17%)

| Reparto | Punteggio medio | Vittorie | Peso voto/anno | Segreti come fonte | Favorito | Demansionato |
|---|---|---|---|---|---|---|
| ACQUISTI | 18.1 | 17% | 11.5 | 1.3 | 2.4 | 5% |
| PRODUZIONE | 18.1 | 17% | 11.5 | 1.3 | 2.4 | 3% |
| VENDITE | 18.5 | 19% | 11.5 | 1.4 | 2.4 | 3% |
| MARKETING | 18.2 | 18% | 11.5 | 1.3 | 2.4 | 4% |
| FINANZA | 18.3 | 19% | 11.5 | 1.3 | 2.4 | 3% |
| RISORSE_UMANE | 18.3 | 20% | 11.5 | 1.3 | 2.4 | 4% |

**7 giocatori** (vittoria attesa se tutti pari: 14%)

| Reparto | Punteggio medio | Vittorie | Peso voto/anno | Segreti come fonte | Favorito | Demansionato |
|---|---|---|---|---|---|---|
| ACQUISTI | 18.5 | 14% | 11.3 | 1.1 | 2.0 | 1% |
| PRODUZIONE | 18.8 | 16% | 11.3 | 1.1 | 2.0 | 1% |
| VENDITE | 19.2 | 17% | 11.3 | 1.2 | 2.0 | 1% |
| MARKETING | 18.6 | 16% | 11.2 | 1.1 | 2.0 | 1% |
| FINANZA | 18.9 | 16% | 11.3 | 1.1 | 2.1 | 1% |
| RISORSE_UMANE | 19.3 | 16% | 11.2 | 1.1 | 2.0 | 1% |
| RICERCA_SVILUPPO | 19.0 | 18% | 11.3 | 1.1 | 2.1 | 1% |

**8 giocatori** (vittoria attesa se tutti pari: 13%)

| Reparto | Punteggio medio | Vittorie | Peso voto/anno | Segreti come fonte | Favorito | Demansionato |
|---|---|---|---|---|---|---|
| ACQUISTI | 18.6 | 15% | 11.1 | 1.0 | 1.7 | 2% |
| PRODUZIONE | 18.6 | 13% | 11.0 | 1.0 | 1.8 | 2% |
| VENDITE | 18.8 | 15% | 11.1 | 1.0 | 1.8 | 1% |
| MARKETING | 18.7 | 12% | 11.2 | 1.0 | 1.8 | 3% |
| FINANZA | 19.2 | 15% | 11.2 | 1.0 | 1.8 | 2% |
| RISORSE_UMANE | 18.9 | 15% | 11.1 | 1.0 | 1.8 | 1% |
| RICERCA_SVILUPPO | 18.9 | 16% | 11.1 | 1.0 | 1.8 | 3% |
| IT_SICUREZZA | 18.7 | 13% | 11.1 | 1.0 | 1.8 | 2% |

## 4. Profili dei robot: punteggio medio e vittorie

Se gli onesti egoisti battono nettamente i cooperativi, la mossa "reparto" conviene troppo (GDD §9, ⚖️).

| Profilo | Giocatori | Punteggio medio | Punti di reparto medi | Vittorie |
|---|---|---|---|---|
| COOPERATIVO | 12659 | 21.1 | 0.8 | 15% |
| EGOISTA | 12764 | 18.0 | 3.1 | 20% |
| SPIA_PRUDENTE | 2378 | 9.4 | 2.1 | 17% |
| SPIA_AGGRESSIVA | 2199 | 11.1 | 2.6 | 28% |

## 4b. Obiettivi personali

Obiettivi di taratura (D-051): traguardo **facile** raggiunto dal **60–70%** di chi l'ha scelto, **difficile** dal **25–35%**; **i tre tipi rendono in media lo stesso (±1 punto)**; nessun reparto avvantaggiato. Si regolano le soglie, non i punti.

| Tipo | Scelto da | Facile raggiunto | Difficile raggiunto | Punti medi | …onesti | …spie |
|---|---|---|---|---|---|---|
| 1 | 33% | 62% | 22% | 3.0 | 3.0 | 2.7 |
| 2 | 34% | 55% | 28% | 3.6 | 3.7 | 3.2 |
| 3 | 33% | 61% | 22% | 3.8 | 3.9 | 3.3 |

### Resa di ogni obiettivo

⚖️ = fuori dagli obiettivi di taratura (con almeno 30 scelte). 🏢 = aziendalista.

| Obiettivo | Nome | Scelto | Facile | Difficile | Punti medi |
|---|---|---|---|---|---|
| T1-01 | Bastian contrario | 828 | 68% | 21% ⚖️ | 3.1 |
| T1-02 | Ago della bilancia | 776 | 63% | 39% ⚖️ | 3.8 |
| T1-03 | Forbici | 813 | 71% ⚖️ | 35% | 3.9 |
| T1-04 | Passaparola | 825 | 20% ⚖️ | 0% ⚖️ | 0.6 |
| T1-05 | Falsario | 798 | 86% ⚖️ | 0% ⚖️ | 2.6 |
| T1-06 | Centralino | 807 | 35% ⚖️ | 5% ⚖️ | 1.3 |
| T1-07 | Confidente | 818 | 23% ⚖️ | 5% ⚖️ | 0.9 |
| T1-08 | Cassaforte | 842 | 74% ⚖️ | 20% ⚖️ | 3.2 |
| T1-09 | 🏢 Gioco di squadra | 921 | 76% ⚖️ | 55% ⚖️ | 5.0 |
| T1-10 | 🏢 In linea | 888 | 71% ⚖️ | 22% ⚖️ | 3.3 |
| T1-11 | 🏢 Occhio clinico | 844 | 70% | 34% | 3.8 |
| T1-12 | 🏢 Postino | 865 | 82% ⚖️ | 24% ⚖️ | 3.6 |
| T2-01 | Voce critica | 913 | 60% ⚖️ | 32% | 4.0 |
| T2-02 | Riformatore | 907 | 50% ⚖️ | 10% ⚖️ | 2.2 |
| T2-03 | Archivista | 879 | 22% ⚖️ | 4% ⚖️ | 0.9 |
| T2-04 | Disinformatore | 891 | 86% ⚖️ | 21% ⚖️ | 4.1 |
| T2-05 | Popolare | 882 | 9% ⚖️ | 23% ⚖️ | 1.9 |
| T2-06 | Fantasma | 902 | 33% ⚖️ | 38% ⚖️ | 3.7 |
| T2-08 | Forbici d'oro | 847 | 74% ⚖️ | 50% ⚖️ | 5.7 |
| T2-09 | 🏢 Squadra | 922 | 76% ⚖️ | 52% ⚖️ | 6.0 |
| T2-10 | 🏢 Occhio clinico | 987 | 56% ⚖️ | 15% ⚖️ | 2.7 |
| T2-11 | 🏢 Postino | 956 | 82% ⚖️ | 23% ⚖️ | 4.1 |
| T2-12 | 🏢 Consenso | 990 | 55% ⚖️ | 39% ⚖️ | 4.3 |
| T3-01 | Ago d'oro | 873 | 62% | 16% ⚖️ | 3.4 |
| T3-02 | Voce solitaria | 909 | 68% | 24% ⚖️ | 4.2 |
| T3-03 | Rete | 881 | 55% ⚖️ | 0% ⚖️ | 2.2 |
| T3-04 | Canarino | 860 | 86% ⚖️ | 37% ⚖️ | 5.6 |
| T3-05 | Crocevia | 870 | 4% ⚖️ | 0% ⚖️ | 0.2 |
| T3-07 | Tesoriere | 886 | 64% | 45% ⚖️ | 5.3 |
| T3-08 | Controcorrente | 835 | 76% ⚖️ | 25% | 4.6 |
| T3-09 | 🏢 Squadra | 940 | 76% ⚖️ | 33% | 5.0 |
| T3-10 | 🏢 Occhio clinico | 954 | 65% | 21% ⚖️ | 3.8 |
| T3-11 | 🏢 Custode | 942 | 84% ⚖️ | 20% ⚖️ | 4.6 |
| T3-12 | 🏢 Maggioranza | 949 | 37% ⚖️ | 24% ⚖️ | 2.9 |

### Obiettivi per profilo

| Profilo | Punti obiettivo medi | Facile raggiunto | Difficile raggiunto |
|---|---|---|---|
| COOPERATIVO | 3.7 | 64% | 25% |
| EGOISTA | 3.4 | 57% | 24% |
| SPIA_PRUDENTE | 4.0 | 69% | 29% |
| SPIA_AGGRESSIVA | 2.0 | 34% | 15% |

Dilemma della spia (partite con una spia): chi ha preso punti dall'obiettivo aziendalista vince la partita nel 19% dei casi (2226 spie), chi non ne ha presi nel 26% (1697 spie).

### Obiettivi per numero di giocatori ed equità tra reparti (D-005)

| Giocatori | Punti obiettivo medi | Reparto più basso | Reparto più alto |
|---|---|---|---|
| 4 | 4.0 | 3.9 | 4.1 |
| 5 | 3.8 | 3.7 | 3.8 |
| 6 | 3.5 | 3.1 | 3.7 |
| 7 | 3.3 | 3.1 | 3.5 |
| 8 | 3.1 | 2.9 | 3.2 |

### Soglie suggerite (stima)

Soglia attuale con la sua riuscita, e la soglia intera che porterebbe la riuscita più vicina al 65% (facile) o al 30% (difficile). Per la cassa si suggerisce l'importo in K (nel tipo 1 i due gradini condividono l'importo: scegliere un valore intermedio). "—" = soglia simbolica (dipende dal numero di giocatori); "=" = già la migliore.

| Obiettivo | Nome | Traguardo | Attuale | Suggerita | Scelte |
|---|---|---|---|---|---|
| T1-01 | Bastian contrario | facile | 3 (68%) | = | 828 |
| T1-01 | Bastian contrario | difficile | 5 (21%) | = | 828 |
| T1-02 | Ago della bilancia | facile | 3 (63%) | = | 776 |
| T1-02 | Ago della bilancia | difficile | 4 (39%) | 5 (22%) | 776 |
| T1-03 | Forbici | facile | 3 (71%) | = | 813 |
| T1-03 | Forbici | difficile | 4 (35%) | = | 813 |
| T1-04 | Passaparola | facile | 3 (20%) | 2 (59%) | 825 |
| T1-04 | Passaparola | difficile | 6 (0%) | 3 (20%) | 825 |
| T1-05 | Falsario | facile | 1 (86%) | = | 798 |
| T1-05 | Falsario | difficile | 3 (0%) | 2 (22%) | 798 |
| T1-06 | Centralino | facile | META_ALTRI | — | — |
| T1-06 | Centralino | difficile | TUTTI_ALTRI | — | — |
| T1-07 | Confidente | facile | 2 (23%) | 1 (65%) | 818 |
| T1-07 | Confidente | difficile | 3 (5%) | 2 (23%) | 818 |
| T1-08 | Cassaforte | facile | 120 K (74%) | 130 K (68%) | 842 |
| T1-08 | Cassaforte | difficile | 120 K (20%) | 110 K (29%) | 842 |
| T1-09 | Gioco di squadra | facile | 3 (76%) | 4 (55%) | 921 |
| T1-09 | Gioco di squadra | difficile | 4 (55%) | = | 921 |
| T1-10 | In linea | facile | 5 (71%) | = | 888 |
| T1-10 | In linea | difficile | 8 (22%) | = | 888 |
| T1-11 | Occhio clinico | facile | 1 (70%) | = | 844 |
| T1-11 | Occhio clinico | difficile | 3 (34%) | = | 844 |
| T1-12 | Postino | facile | 1 (82%) | = | 865 |
| T1-12 | Postino | difficile | 2 (24%) | = | 865 |
| T2-01 | Voce critica | facile | 2 (60%) | = | 913 |
| T2-01 | Voce critica | difficile | 2 (32%) | = | 913 |
| T2-02 | Riformatore | facile | 1 (50%) | = | 907 |
| T2-02 | Riformatore | difficile | 1 (10%) | = | 907 |
| T2-03 | Archivista | facile | 2 (22%) | 1 (67%) | 879 |
| T2-03 | Archivista | difficile | 5 (4%) | 3 (38%) | 879 |
| T2-04 | Disinformatore | facile | 1 (86%) | = | 891 |
| T2-04 | Disinformatore | difficile | 1 (21%) | = | 891 |
| T2-05 | Popolare | facile | 1 (9%) | = | 882 |
| T2-05 | Popolare | difficile | 1 (23%) | = | 882 |
| T2-06 | Fantasma | facile | META_ALTRI | — | — |
| T2-06 | Fantasma | difficile | TUTTI_I_TRIMESTRI | — | — |
| T2-08 | Forbici d'oro | facile | 4 (74%) | = | 847 |
| T2-08 | Forbici d'oro | difficile | 150 K (50%) | = | 847 |
| T2-09 | Squadra | facile | 3 (76%) | = | 922 |
| T2-09 | Squadra | difficile | TUTTI_I_TRIMESTRI | — | — |
| T2-10 | Occhio clinico | facile | 2 (56%) | 1 (74%) | 987 |
| T2-10 | Occhio clinico | difficile | 1 (15%) | = | 987 |
| T2-11 | Postino | facile | 1 (82%) | = | 956 |
| T2-11 | Postino | difficile | 2 (23%) | = | 956 |
| T2-12 | Consenso | facile | 6 (55%) | 5 (70%) | 990 |
| T2-12 | Consenso | difficile | 2 (39%) | = | 990 |
| T3-01 | Ago d'oro | facile | 3 (62%) | = | 873 |
| T3-01 | Ago d'oro | difficile | 4 (16%) | = | 873 |
| T3-02 | Voce solitaria | facile | 3 (68%) | = | 909 |
| T3-02 | Voce solitaria | difficile | 1 (24%) | = | 909 |
| T3-03 | Rete | facile | 2 (55%) | = | 881 |
| T3-03 | Rete | difficile | 3 (0%) | 2 (9%) | 881 |
| T3-04 | Canarino | facile | 2 (86%) | = | 860 |
| T3-04 | Canarino | difficile | 1 (37%) | = | 860 |
| T3-05 | Crocevia | facile | TUTTI_ALTRI | — | — |
| T3-05 | Crocevia | difficile | TUTTI_I_TRIMESTRI | — | — |
| T3-07 | Tesoriere | facile | 40 K (64%) | = | 886 |
| T3-07 | Tesoriere | difficile | 150 K (45%) | = | 886 |
| T3-08 | Controcorrente | facile | 2 (76%) | = | 835 |
| T3-08 | Controcorrente | difficile | 2 (25%) | = | 835 |
| T3-09 | Squadra | facile | 3 (76%) | 4 (55%) | 940 |
| T3-09 | Squadra | difficile | 4 (33%) | = | 940 |
| T3-10 | Occhio clinico | facile | 1 (65%) | = | 954 |
| T3-10 | Occhio clinico | difficile | 2 (21%) | = | 954 |
| T3-11 | Custode | facile | 1 (84%) | = | 942 |
| T3-11 | Custode | difficile | 2 (20%) | = | 942 |
| T3-12 | Maggioranza | facile | 1 (37%) | = | 949 |
| T3-12 | Maggioranza | difficile | 8 (24%) | = | 949 |

## 5. Cassa e votazioni

| Posizione nel trimestre | Votazioni | Approvate | Respinte per fondi |
|---|---|---|---|
| 1ª | 20000 | 38% | 0% |
| 2ª | 20000 | 35% | 4% |
| 3ª | 10000 | 29% | 9% |

| Trimestre | Cassa media a inizio trimestre (K) | Approvate |
|---|---|---|
| 1 | 100.0 | 34% |
| 2 | 141.5 | 35% |
| 3 | 143.6 | 34% |
| 4 | 144.0 | 37% |

Tetto della cassa (150 K) raggiunto in 73% dei trimestri 2–4.

### Crescita dell'azienda da proposte e segreti (D-056)

Effetto medio per trimestre delle proposte approvate e dei segreti arrivati in tempo, nelle partite **senza spie**: è il valore da usare per `concorrenti.crescitaMediaProposteESegreti`.

| Giocatori | Partite senza spie | Proposte + segreti a trimestre |
|---|---|---|
| 4 | 150 | 3.01 |
| 5 | 150 | 2.82 |
| 6 | 150 | 2.99 |
| 7 | 150 | 2.84 |
| 8 | 150 | 3.01 |

Media generale: **2.93** a trimestre.

## 6. Segreti

| Segreti distribuiti | Arrivati in tempo al reparto giusto | Consegnati ai concorrenti | …di cui falsi |
|---|---|---|---|
| 39996 | 54% | 18% | 8% |

## 7. Avvisi automatici

- ⚠️ Obiettivi: 33 su 34 hanno almeno un traguardo fuori dagli obiettivi di taratura (soglie da ritoccare).

## 8. Limiti

- I robot non parlano, non mentono a voce e non persuadono: la parte "psicologica" si misura solo nelle serate di prova.
- Contenuti veri (40 quesiti, 36 segreti con valori variabili e tipi a bilancia, D-030…D-039), ma i robot non leggono i testi: votano sui numeri e non usano il tipo dei segreti per decidere a chi darli.
- Obiettivi personali (D-046…D-052): i robot scelgono metà delle volte secondo il profilo e metà a caso, e li perseguono con regole semplici (robot.ts). Non sanno "leggere la sala": gli obiettivi che chiedono di indovinare l'esito di un voto o l'effetto sull'azienda risultano più difficili che per una persona. I messaggi di solo testo sono simulati con una probabilità fissa.
- Il comportamento dei robot (soglie di voto, sospetti, accuse) è una semplificazione descritta in packages/simulator/src/robot.ts.