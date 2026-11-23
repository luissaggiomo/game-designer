# Report del simulatore — Il Direttivo

Concorrenti (D-056): direttivo di riferimento al 45% di scelte aziendaliste, effetto medio di proposte e segreti 3.47 a trimestre. 5000 partite simulate (1000 per ciascun numero di giocatori: 4, 5, 6, 7, 8), semi da 1. Durata: 1790.5 s. Data: 2026-11-23.

> **Quattordicesimo report, dopo D-076 e D-077** (più D-078, che non cambia i robot). Quesiti con **famiglie di schemi** coerenti con le frasi (buon affare / investimento / neutro / spreco; effetti 30 K +2/+1/0/−1, 50 K +3/+2/0/−2, 80 K +5/+2/0/−3; forme dei ruoli estratte a ogni partita) e **16 obiettivi riscritti** per il voto del pacchetto, con soglie tarate in due giri preliminari da 1000 partite. Concorrente (D-056) portato a **3,47** (misura del secondo giro); qui la crescita misurata è 3,41 (scarto 2%, trascurabile). Confronto col report 13: **spia prima in classifica con 4 giocatori 23%** (era 34%, metro 25%); spia vincente con una spia 19 / 22 / 18 / 18 / 8% (era 25 / 18 / 17 / 13 / 9%): fuori dai ±4 punti del metro 1/N con 4 giocatori (−6) e di poco con 8 (−4,5). Carte: le due piccole rendono in media 2,61, la grande 2,59 (prima +0,75 contro +1,25). Obiettivi: i tre tipi rendono 3,8 / 4,2 / 4,5 punti; dei 16 riscritti restano fuori bersaglio solo quelli limitati dai pochi gradini possibili (4 trimestri) e due da rivedere con Luis (3.7 Tesoriere difficile 93%, 3.8 Controcorrente facile 23%). Gli altri 18 obiettivi (segreti, messaggi, mossa privata) non sono stati toccati: si tarano nelle serate.

## 1. Chi vince la corsa di mercato

Con una spia attiva l'azienda deve vincere sensibilmente meno. La vittoria dell'azienda senza spie è **solo informativa** (D-054: ogni giocatore punta a vincere personalmente).

| Giocatori | Spie | Partite | Vince l'azienda | Vince un concorrente | Pareggio |
|---|---|---|---|---|---|
| 4 | 0 | 150 | 81% | 17% | 2% |
| 4 | 1 | 850 | 60% | 35% | 5% |
| 5 | 0 | 150 | 79% | 19% | 3% |
| 5 | 1 | 850 | 67% | 27% | 5% |
| 6 | 0 | 150 | 85% | 10% | 5% |
| 6 | 1 | 850 | 73% | 23% | 4% |
| 7 | 0 | 150 | 83% | 14% | 3% |
| 7 | 1 | 850 | 76% | 22% | 3% |
| 8 | 0 | 150 | 86% | 13% | 1% |
| 8 | 1 | 523 | 80% | 17% | 3% |
| 8 | 2 alleate | 168 | 69% | 27% | 4% |
| 8 | 2 rivali | 159 | 74% | 22% | 4% |

### Scelte aziendaliste e vittoria dell'azienda (partite senza spie)

Quota di mosse private "per l'azienda" sul totale della partita, e quante volte l'azienda vince in ciascuna fascia. La **soglia** è la quota oltre la quale l'azienda vince più spesso di quanto perde.

| Scelte aziendaliste | Partite | Vince l'azienda |
|---|---|---|
| 0–30% | 7 | 0% |
| 30–40% | 32 | 22% |
| 40–50% | 59 | 36% |
| 50–60% | 175 | 75% |
| 60–67% | 165 | 93% |
| 67–75% | 127 | 96% |
| 75–85% | 144 | 99% |
| 85–100% | 41 | 100% |

Quota media di scelte aziendaliste: 63%. Soglia stimata: 50%.

### Chi vince tra onesti e spie (partite con spie)

Vince la spia se il suo concorrente supera l'azienda **e** lei non è stata scoperta (non licenziata); altrimenti vincono gli onesti. Riferimento indicato da Luis: con 4 giocatori e 1 spia, **circa 20% spia, 80% onesti**.

| Giocatori | Spie | Partite | Vincono gli onesti | Vince la spia |
|---|---|---|---|---|
| 4 | 1 | 850 | 81% | 19% |
| 5 | 1 | 850 | 78% | 22% |
| 6 | 1 | 850 | 82% | 18% |
| 7 | 1 | 850 | 82% | 18% |
| 8 | 1 | 523 | 92% | 8% |
| 8 | 2 alleate | 168 | 78% | 22% |
| 8 | 2 rivali | 159 | 82% | 18% |

### Equilibrio della spia (D-075, partite con una spia)

Un ruolo è equilibrato se vince circa **una volta ogni N partite** (scarto accettabile ±3–4 punti). "Prima in classifica" = la spia ha il punteggio personale più alto (pari merito compreso).

| Giocatori | Partite | Metro 1/N | Vince la spia | Spia prima in classifica |
|---|---|---|---|---|
| 4 | 850 | 25% | 19% | 23% |
| 5 | 850 | 20% | 22% | 21% |
| 6 | 850 | 17% | 18% | 16% |
| 7 | 850 | 14% | 18% | 16% |
| 8 | 523 | 13% | 8% | 9% |

## 2. Finale: rinnovo dei contratti (D-058)

La domanda "C'è una spia?" passa con almeno metà di sì. "Doppio" = due licenziati per stallo ripetuto a due; "Ultima a vuoto" = percorso a tre finito senza licenziati.

| Giocatori | Spie licenziate (su spie presenti) | Onesti licenziati (per partita) | Domanda passa (con spie) | Domanda passa (senza spie) | Partite con ballottaggio | Doppio | Ultima a vuoto |
|---|---|---|---|---|---|---|---|
| 4 | 43% | 0.42 | 81% | 39% | 57% | 5% | 0% |
| 5 | 25% | 0.28 | 56% | 11% | 30% | 0% | 0% |
| 6 | 27% | 0.49 | 75% | 27% | 65% | 7% | 2% |
| 7 | 20% | 0.38 | 62% | 11% | 51% | 0% | 0% |
| 8 | 21% | 0.71 | 67% | 23% | 60% | 5% | 2% |

## 3. Equità tra reparti (D-005, D-069)

Per ogni reparto: punteggio medio, percentuale di partite vinte (punteggio più alto), bonus e malus ricevuti dalle 12 carte della partita (approvate o no: devono essere uguali per tutti), volte coinvolto come fonte o destinatario di un segreto, percentuale di licenziamenti subiti nel finale.

Algoritmo di equità: scarto massimo tra reparti **1** punti (tolleranza 1); trimestri con un reparto premiato sia nella grande sia nelle piccole: **0**.


**4 giocatori** (vittoria attesa se tutti pari: 25%)

| Reparto | Punteggio medio | Vittorie | Bonus carte | Malus carte | Segreti (fonte o destinatario) | Licenziato |
|---|---|---|---|---|---|---|
| ACQUISTI | 19.3 | 26% | 10.0 | 6.0 | 3.0 | 19% |
| PRODUZIONE | 19.2 | 26% | 10.0 | 6.0 | 3.0 | 19% |
| VENDITE | 19.5 | 27% | 10.0 | 6.0 | 3.0 | 21% |
| MARKETING | 19.1 | 27% | 10.0 | 6.0 | 3.0 | 20% |

**5 giocatori** (vittoria attesa se tutti pari: 20%)

| Reparto | Punteggio medio | Vittorie | Bonus carte | Malus carte | Segreti (fonte o destinatario) | Licenziato |
|---|---|---|---|---|---|---|
| ACQUISTI | 19.8 | 20% | 8.0 | 4.8 | 2.4 | 10% |
| PRODUZIONE | 20.1 | 23% | 8.0 | 4.8 | 2.4 | 9% |
| VENDITE | 19.6 | 19% | 8.0 | 4.8 | 2.4 | 10% |
| MARKETING | 19.8 | 22% | 8.0 | 4.8 | 2.4 | 11% |
| FINANZA | 20.3 | 25% | 8.0 | 4.8 | 2.4 | 10% |

**6 giocatori** (vittoria attesa se tutti pari: 17%)

| Reparto | Punteggio medio | Vittorie | Bonus carte | Malus carte | Segreti (fonte o destinatario) | Licenziato |
|---|---|---|---|---|---|---|
| ACQUISTI | 20.7 | 17% | 6.7 | 4.0 | 2.0 | 13% |
| PRODUZIONE | 20.6 | 18% | 6.7 | 4.0 | 2.0 | 13% |
| VENDITE | 20.7 | 19% | 6.7 | 4.0 | 2.0 | 13% |
| MARKETING | 21.0 | 18% | 6.7 | 4.0 | 2.0 | 12% |
| FINANZA | 21.1 | 20% | 6.7 | 4.0 | 2.0 | 11% |
| RISORSE_UMANE | 20.9 | 18% | 6.7 | 4.0 | 2.0 | 11% |

**7 giocatori** (vittoria attesa se tutti pari: 14%)

| Reparto | Punteggio medio | Vittorie | Bonus carte | Malus carte | Segreti (fonte o destinatario) | Licenziato |
|---|---|---|---|---|---|---|
| ACQUISTI | 20.7 | 15% | 5.7 | 3.5 | 1.7 | 8% |
| PRODUZIONE | 20.4 | 14% | 5.7 | 3.4 | 1.7 | 7% |
| VENDITE | 21.0 | 16% | 5.7 | 3.5 | 1.7 | 9% |
| MARKETING | 20.7 | 13% | 5.7 | 3.4 | 1.7 | 8% |
| FINANZA | 21.3 | 17% | 5.7 | 3.4 | 1.7 | 8% |
| RISORSE_UMANE | 21.5 | 18% | 5.7 | 3.4 | 1.7 | 8% |
| RICERCA_SVILUPPO | 20.9 | 18% | 5.7 | 3.4 | 1.7 | 8% |

**8 giocatori** (vittoria attesa se tutti pari: 13%)

| Reparto | Punteggio medio | Vittorie | Bonus carte | Malus carte | Segreti (fonte o destinatario) | Licenziato |
|---|---|---|---|---|---|---|
| ACQUISTI | 20.5 | 14% | 5.0 | 3.0 | 1.5 | 13% |
| PRODUZIONE | 20.4 | 15% | 5.0 | 3.0 | 1.5 | 14% |
| VENDITE | 20.5 | 14% | 5.0 | 3.0 | 1.5 | 11% |
| MARKETING | 20.5 | 17% | 5.0 | 3.0 | 1.5 | 10% |
| FINANZA | 20.7 | 15% | 5.0 | 3.0 | 1.5 | 10% |
| RISORSE_UMANE | 20.3 | 14% | 5.0 | 3.0 | 1.5 | 12% |
| RICERCA_SVILUPPO | 20.0 | 12% | 5.0 | 3.0 | 1.5 | 12% |
| IT_SICUREZZA | 20.3 | 13% | 5.0 | 3.0 | 1.5 | 14% |

## 4. Profili dei robot: punteggio medio e vittorie

Se gli onesti egoisti battono nettamente i cooperativi, la mossa "reparto" conviene troppo (GDD §9, ⚖️).

| Profilo | Giocatori | Punteggio medio | Punti di reparto medi | Vittorie |
|---|---|---|---|---|
| COOPERATIVO | 12659 | 22.9 | 2.2 | 17% |
| EGOISTA | 12764 | 21.4 | 3.9 | 20% |
| SPIA_PRUDENTE | 2378 | 10.3 | 2.9 | 13% |
| SPIA_AGGRESSIVA | 2199 | 11.0 | 4.1 | 21% |

## 4b. Obiettivi personali

Obiettivi di taratura (D-051): traguardo **facile** raggiunto dal **60–70%** di chi l'ha scelto, **difficile** dal **25–35%**; **i tre tipi rendono in media lo stesso (±1 punto)**; nessun reparto avvantaggiato. Si regolano le soglie, non i punti.

| Tipo | Scelto da | Facile raggiunto | Difficile raggiunto | Punti medi | …onesti | …spie |
|---|---|---|---|---|---|---|
| 1 | 33% | 71% | 33% | 3.8 | 3.9 | 3.2 |
| 2 | 34% | 66% | 32% | 4.2 | 4.3 | 3.9 |
| 3 | 33% | 64% | 31% | 4.5 | 4.6 | 3.8 |

### Resa di ogni obiettivo

⚖️ = fuori dagli obiettivi di taratura (con almeno 30 scelte). 🏢 = aziendalista.

| Obiettivo | Nome | Scelto | Facile | Difficile | Punti medi |
|---|---|---|---|---|---|
| T1-01 | Bastian contrario | 828 | 78% ⚖️ | 46% ⚖️ | 4.7 |
| T1-02 | Ago della bilancia | 776 | 63% | 29% | 3.4 |
| T1-03 | Forbici | 813 | 66% | 30% | 3.5 |
| T1-04 | Passaparola | 825 | 70% ⚖️ | 13% ⚖️ | 2.8 |
| T1-05 | Falsario | 798 | 94% ⚖️ | 40% ⚖️ | 4.8 |
| T1-06 | Centralino | 807 | 61% | 7% ⚖️ | 2.2 |
| T1-07 | Confidente | 818 | 65% | 25% | 3.2 |
| T1-08 | Cassaforte | 842 | 55% ⚖️ | 34% | 3.3 |
| T1-09 | 🏢 Gioco di squadra | 921 | 77% ⚖️ | 56% ⚖️ | 5.1 |
| T1-10 | 🏢 In linea | 888 | 78% ⚖️ | 45% ⚖️ | 4.6 |
| T1-11 | 🏢 Occhio clinico | 844 | 64% | 28% | 3.3 |
| T1-12 | 🏢 Postino | 865 | 76% ⚖️ | 43% ⚖️ | 4.4 |
| T2-01 | Voce critica | 913 | 66% | 20% ⚖️ | 3.4 |
| T2-02 | Intermediario | 907 | 86% ⚖️ | 36% ⚖️ | 5.1 |
| T2-03 | Archivista | 879 | 66% | 16% ⚖️ | 3.1 |
| T2-04 | Disinformatore | 891 | 93% ⚖️ | 31% | 5.0 |
| T2-05 | Popolare | 882 | 9% ⚖️ | 26% | 2.1 |
| T2-06 | Fantasma | 902 | 60% | 39% ⚖️ | 4.5 |
| T2-08 | Forbici d'oro | 847 | 77% ⚖️ | 31% | 4.5 |
| T2-09 | 🏢 Squadra | 922 | 77% ⚖️ | 58% ⚖️ | 6.4 |
| T2-10 | 🏢 Occhio clinico | 987 | 68% | 34% | 4.4 |
| T2-11 | 🏢 Postino | 956 | 44% ⚖️ | 42% ⚖️ | 4.2 |
| T2-12 | 🏢 Consenso | 990 | 80% ⚖️ | 20% ⚖️ | 3.8 |
| T3-01 | Ago d'oro | 873 | 68% | 29% | 4.5 |
| T3-02 | Voce solitaria | 909 | 79% ⚖️ | 20% ⚖️ | 4.4 |
| T3-03 | Rete | 881 | 69% | 36% ⚖️ | 4.9 |
| T3-04 | Canarino | 860 | 88% ⚖️ | 37% ⚖️ | 5.8 |
| T3-05 | Crocevia | 870 | 8% ⚖️ | 0% ⚖️ | 0.3 |
| T3-07 | Tesoriere | 886 | 66% | 93% ⚖️ | 8.2 |
| T3-08 | Controcorrente | 835 | 23% ⚖️ | 36% ⚖️ | 3.1 |
| T3-09 | 🏢 Squadra | 940 | 79% ⚖️ | 32% | 5.1 |
| T3-10 | 🏢 Occhio clinico | 954 | 65% | 32% | 4.5 |
| T3-11 | 🏢 Custode | 942 | 80% ⚖️ | 18% ⚖️ | 4.3 |
| T3-12 | 🏢 Maggioranza | 949 | 77% ⚖️ | 13% ⚖️ | 3.9 |

### Obiettivi per profilo

| Profilo | Punti obiettivo medi | Facile raggiunto | Difficile raggiunto |
|---|---|---|---|
| COOPERATIVO | 4.5 | 71% | 35% |
| EGOISTA | 4.0 | 65% | 31% |
| SPIA_PRUDENTE | 4.4 | 73% | 33% |
| SPIA_AGGRESSIVA | 2.8 | 48% | 20% |

Dilemma della spia (partite con una spia): chi ha preso punti dall'obiettivo aziendalista vince la partita nel 15% dei casi (2562 spie), chi non ne ha presi nel 22% (1361 spie).

### Obiettivi per numero di giocatori ed equità tra reparti (D-005)

| Giocatori | Punti obiettivo medi | Reparto più basso | Reparto più alto |
|---|---|---|---|
| 4 | 4.3 | 4.2 | 4.5 |
| 5 | 4.3 | 4.1 | 4.6 |
| 6 | 4.3 | 4.1 | 4.4 |
| 7 | 4.2 | 4.0 | 4.4 |
| 8 | 3.9 | 3.8 | 4.0 |

### Soglie suggerite (stima)

Soglia attuale con la sua riuscita, e la soglia intera che porterebbe la riuscita più vicina al 65% (facile) o al 30% (difficile). Per la cassa si suggerisce l'importo in K (nel tipo 1 i due gradini condividono l'importo: scegliere un valore intermedio). "—" = soglia simbolica (dipende dal numero di giocatori); "=" = già la migliore.

| Obiettivo | Nome | Traguardo | Attuale | Suggerita | Scelte |
|---|---|---|---|---|---|
| T1-01 | Bastian contrario | facile | 2 (78%) | = | 828 |
| T1-01 | Bastian contrario | difficile | 3 (46%) | 4 (14%) | 828 |
| T1-02 | Ago della bilancia | facile | 2 (63%) | = | 776 |
| T1-02 | Ago della bilancia | difficile | 3 (29%) | = | 776 |
| T1-03 | Forbici | facile | 2 (66%) | = | 813 |
| T1-03 | Forbici | difficile | 3 (30%) | = | 813 |
| T1-04 | Passaparola | facile | 3 (70%) | = | 825 |
| T1-04 | Passaparola | difficile | 6 (13%) | 5 (30%) | 825 |
| T1-05 | Falsario | facile | 1 (94%) | 2 (72%) | 798 |
| T1-05 | Falsario | difficile | 3 (40%) | = | 798 |
| T1-06 | Centralino | facile | META_ALTRI | — | — |
| T1-06 | Centralino | difficile | TUTTI_ALTRI | — | — |
| T1-07 | Confidente | facile | 2 (65%) | = | 818 |
| T1-07 | Confidente | difficile | 3 (25%) | = | 818 |
| T1-08 | Cassaforte | facile | 40 K (55%) | = | 842 |
| T1-08 | Cassaforte | difficile | 40 K (34%) | = | 842 |
| T1-09 | Gioco di squadra | facile | 3 (77%) | 4 (56%) | 921 |
| T1-09 | Gioco di squadra | difficile | 4 (56%) | = | 921 |
| T1-10 | In linea | facile | 2 (78%) | = | 888 |
| T1-10 | In linea | difficile | 3 (45%) | = | 888 |
| T1-11 | Occhio clinico | facile | 2 (64%) | = | 844 |
| T1-11 | Occhio clinico | difficile | 3 (28%) | = | 844 |
| T1-12 | Postino | facile | 1 (76%) | = | 865 |
| T1-12 | Postino | difficile | 2 (43%) | 3 (18%) | 865 |
| T2-01 | Voce critica | facile | 2 (66%) | = | 913 |
| T2-01 | Voce critica | difficile | 2 (20%) | = | 913 |
| T2-02 | Intermediario | facile | 2 (86%) | 3 (70%) | 907 |
| T2-02 | Intermediario | difficile | 3 (36%) | = | 907 |
| T2-03 | Archivista | facile | 2 (66%) | = | 879 |
| T2-03 | Archivista | difficile | 5 (16%) | 4 (43%) | 879 |
| T2-04 | Disinformatore | facile | 1 (93%) | 2 (74%) | 891 |
| T2-04 | Disinformatore | difficile | 1 (31%) | = | 891 |
| T2-05 | Popolare | facile | 1 (9%) | = | 882 |
| T2-05 | Popolare | difficile | 1 (26%) | = | 882 |
| T2-06 | Fantasma | facile | META_ALTRI | — | — |
| T2-06 | Fantasma | difficile | TUTTI_I_TRIMESTRI | — | — |
| T2-08 | Forbici d'oro | facile | 3 (77%) | = | 847 |
| T2-08 | Forbici d'oro | difficile | 60 K (31%) | = | 847 |
| T2-09 | Squadra | facile | 3 (77%) | = | 922 |
| T2-09 | Squadra | difficile | TUTTI_I_TRIMESTRI | — | — |
| T2-10 | Occhio clinico | facile | 2 (68%) | = | 987 |
| T2-10 | Occhio clinico | difficile | 3 (34%) | = | 987 |
| T2-11 | Postino | facile | 1 (44%) | = | 956 |
| T2-11 | Postino | difficile | 2 (42%) | = | 956 |
| T2-12 | Consenso | facile | 2 (80%) | = | 990 |
| T2-12 | Consenso | difficile | 3 (20%) | = | 990 |
| T3-01 | Ago d'oro | facile | 2 (68%) | = | 873 |
| T3-01 | Ago d'oro | difficile | 3 (29%) | = | 873 |
| T3-02 | Voce solitaria | facile | 2 (79%) | = | 909 |
| T3-02 | Voce solitaria | difficile | 2 (20%) | = | 909 |
| T3-03 | Rete | facile | 2 (69%) | = | 881 |
| T3-03 | Rete | difficile | 3 (36%) | = | 881 |
| T3-04 | Canarino | facile | 2 (88%) | = | 860 |
| T3-04 | Canarino | difficile | 1 (37%) | = | 860 |
| T3-05 | Crocevia | facile | TUTTI_ALTRI | — | — |
| T3-05 | Crocevia | difficile | TUTTI_I_TRIMESTRI | — | — |
| T3-07 | Tesoriere | facile | 30 K (66%) | = | 886 |
| T3-07 | Tesoriere | difficile | TUTTI_I_TRIMESTRI | — | — |
| T3-08 | Controcorrente | facile | 1 (23%) | = | 835 |
| T3-08 | Controcorrente | difficile | 1 (36%) | = | 835 |
| T3-09 | Squadra | facile | 3 (79%) | 4 (56%) | 940 |
| T3-09 | Squadra | difficile | 4 (32%) | = | 940 |
| T3-10 | Occhio clinico | facile | 2 (65%) | = | 954 |
| T3-10 | Occhio clinico | difficile | 3 (32%) | = | 954 |
| T3-11 | Custode | facile | 1 (80%) | = | 942 |
| T3-11 | Custode | difficile | 2 (18%) | = | 942 |
| T3-12 | Maggioranza | facile | 2 (77%) | = | 949 |
| T3-12 | Maggioranza | difficile | TUTTI_I_TRIMESTRI | — | — |

## 5. Cassa e voto del pacchetto (D-068)

Come si decide il pacchetto di ogni trimestre e quale si sceglie: "la grande" (80 K da sola), "le due piccole" (30 + 50) o un pacchetto più ricco grazie al tesoretto.

| Trimestre | Cassa media all'inizio (K) | Maggioranza al 1° voto | Passa il principale | Passa l'alternativa | La grande | Le due piccole | Più ricco | Spesa media (K) |
|---|---|---|---|---|---|---|---|---|
| 1 | 100.0 | 78% | 7% | 15% | 29% | 71% | 0% | 80.0 |
| 2 | 120.0 | 42% | 31% | 27% | 19% | 53% | 29% | 88.6 |
| 3 | 131.4 | 31% | 40% | 29% | 15% | 46% | 39% | 94.7 |
| 4 | 136.7 | 27% | 45% | 28% | 16% | 44% | 40% | 99.6 |

Cassa media a fine anno: 37.1 K.

### Effetto delle carte sull'azienda per costo (D-070, D-077)

Effetto medio sull'azienda delle carte uscite (approvate o no) e di quelle approvate. Obiettivo: proporzionale al costo, cioè la grande in media quanto le due piccole insieme. Famiglie: quota di carte uscite per famiglia.

| Costo (K) | Carte uscite | Effetto medio | Effetto per 10 K | Effetto medio se approvata | buon affare | investimento | neutro | spreco |
|---|---|---|---|---|---|---|---|---|
| 30 | 20000 | 1.02 | 0.34 | 1.02 | 47% | 28% | 7% | 19% |
| 50 | 20000 | 1.59 | 0.32 | 1.59 | 47% | 25% | 12% | 16% |
| 80 | 20000 | 2.59 | 0.32 | 2.60 | 36% | 40% | 24% | 0% |

Le due piccole insieme: **2.62** · la grande: **2.59**.

### Crescita dell'azienda da proposte e segreti (D-056)

Effetto medio per trimestre delle proposte approvate e dei segreti arrivati in tempo, nelle partite **senza spie**: è il valore da usare per `concorrenti.crescitaMediaProposteESegreti`.

| Giocatori | Partite senza spie | Proposte + segreti a trimestre |
|---|---|---|
| 4 | 150 | 3.49 |
| 5 | 150 | 3.44 |
| 6 | 150 | 3.50 |
| 7 | 150 | 3.24 |
| 8 | 150 | 3.37 |

Media generale: **3.41** a trimestre.

## 6. Segreti

Due segreti a trimestre (1°–3°), uno vero e uno finto (D-074); scadenza a fine del trimestre successivo (D-072); catena minima di colleghi (D-073).

| Segreti distribuiti | Arrivati a destinazione (qualsiasi versione) | Veri arrivati veri in tempo (su veri) | Consegnati ai concorrenti | …falsi o finti (penalità) | …di cui finti |
|---|---|---|---|---|---|
| 30000 | 52% | 40% | 18% | 26% | 14% |

## 7. Avvisi automatici

- ⚠️ Con 4 giocatori la spia vince il 19% ed è prima in classifica nel 23% (metro 1/N = 25%, D-075).
- ⚠️ Con 8 giocatori la spia vince il 8% ed è prima in classifica nel 9% (metro 1/N = 13%, D-075).
- ⚠️ Obiettivi: 27 su 34 hanno almeno un traguardo fuori dagli obiettivi di taratura (soglie da ritoccare).

## 8. Limiti

- I robot non parlano, non mentono a voce e non persuadono: la parte "psicologica" si misura solo nelle serate di prova.
- Contenuti veri (40 quesiti a 30 / 50 / 80 K, 36 segreti con valori variabili e tipi a bilancia, D-030…D-039, D-062), ma i robot non leggono i testi: votano sui numeri e non usano il tipo dei segreti per decidere a chi darli.
- Obiettivi personali (D-046…D-052): i robot scelgono metà delle volte secondo il profilo e metà a caso, e li perseguono con regole semplici (robot.ts). Non sanno "leggere la sala": gli obiettivi che chiedono di indovinare l'esito di un voto o l'effetto sull'azienda risultano più difficili che per una persona. I messaggi di solo testo sono simulati con una probabilità fissa.
- Il comportamento dei robot (soglie di voto, sospetti, accuse) è una semplificazione descritta in packages/simulator/src/robot.ts. Nel finale (D-058) un onesto risponde "sì, c'è una spia" se ha un sospetto concreto (o per istinto, 30%), poi nomina chi sospetta di più; la spia prudente dice "sì" metà delle volte per mimetizzarsi, quella aggressiva sempre "no", e le spie nominano a caso. I robot non usano il conteggio "3 su 5 per l'azienda" né gli annunci dei segreti (D-061): quegli indizi servono alle persone, e il loro effetto si vedrà solo nelle serate.