# Report del simulatore — Il Direttivo

Concorrenti (D-056): direttivo di riferimento al 45% di scelte aziendaliste, effetto medio di proposte e segreti 3.41 a trimestre. 5000 partite simulate (1000 per ciascun numero di giocatori: 4, 5, 6, 7, 8), semi da 1. Durata: 1836.3 s. Data: 2026-11-23.

> **Tredicesimo report, dopo D-063…D-074.** Voto del trimestre a pacchetti (tre proposte 30/50/80, investimento minimo 51 K, cassa senza tetto), algoritmo di equità delle carte, schemi **provvisori** proporzionali al costo, segreti vero/finto con catena minima (1-1-2-2-2) e scadenza a fine del trimestre successivo, 4° trimestre senza segreti. Velocità del concorrente ritarata (D-056): effetto medio di proposte e segreti **3,41** a trimestre (misura su 3000 partite; era 2,93), confermato qui (3,39). Confronto col report 12: spia vincente con una spia 25 / 18 / 17 / 13 / 9% (era 24 / 32 / 26 / 27 / 18%), con due spie 20% alleate / 25% rivali (era 45 / 40%); spie licenziate 45 / 24 / 29 / 18 / 22% (era 56 / 35 / 33 / 19 / 22%); onesti licenziati 0,30–0,71 per partita (era 0,12–0,33); cooperativi 17% di vittorie, egoisti 19% (era 13 / 18%). Cassa: dal 2° trimestre il 36–45% dei pacchetti è "ricco", 32 K medi a fine anno (prima tetto raggiunto nel 76% dei trimestri). Obiettivi personali e quesiti non ancora riscritti (D-071): gli avvisi sugli obiettivi sono attesi.


## 1. Chi vince la corsa di mercato

Con una spia attiva l'azienda deve vincere sensibilmente meno. La vittoria dell'azienda senza spie è **solo informativa** (D-054: ogni giocatore punta a vincere personalmente).

| Giocatori | Spie | Partite | Vince l'azienda | Vince un concorrente | Pareggio |
|---|---|---|---|---|---|
| 4 | 0 | 150 | 70% | 26% | 4% |
| 4 | 1 | 850 | 51% | 44% | 5% |
| 5 | 0 | 150 | 83% | 16% | 1% |
| 5 | 1 | 850 | 71% | 25% | 4% |
| 6 | 0 | 150 | 77% | 22% | 1% |
| 6 | 1 | 850 | 72% | 23% | 5% |
| 7 | 0 | 150 | 81% | 17% | 3% |
| 7 | 1 | 850 | 82% | 16% | 2% |
| 8 | 0 | 150 | 83% | 13% | 4% |
| 8 | 1 | 523 | 84% | 14% | 2% |
| 8 | 2 alleate | 168 | 73% | 24% | 4% |
| 8 | 2 rivali | 159 | 67% | 31% | 2% |

### Scelte aziendaliste e vittoria dell'azienda (partite senza spie)

Quota di mosse private "per l'azienda" sul totale della partita, e quante volte l'azienda vince in ciascuna fascia. La **soglia** è la quota oltre la quale l'azienda vince più spesso di quanto perde.

| Scelte aziendaliste | Partite | Vince l'azienda |
|---|---|---|
| 0–30% | 4 | 25% |
| 30–40% | 40 | 8% |
| 40–50% | 67 | 30% |
| 50–60% | 154 | 71% |
| 60–67% | 181 | 88% |
| 67–75% | 113 | 95% |
| 75–85% | 138 | 99% |
| 85–100% | 53 | 100% |

Quota media di scelte aziendaliste: 63%. Soglia stimata: 50%.

### Chi vince tra onesti e spie (partite con spie)

Vince la spia se il suo concorrente supera l'azienda **e** lei non è stata scoperta (non licenziata); altrimenti vincono gli onesti. Riferimento indicato da Luis: con 4 giocatori e 1 spia, **circa 20% spia, 80% onesti**.

| Giocatori | Spie | Partite | Vincono gli onesti | Vince la spia |
|---|---|---|---|---|
| 4 | 1 | 850 | 75% | 25% |
| 5 | 1 | 850 | 82% | 18% |
| 6 | 1 | 850 | 83% | 17% |
| 7 | 1 | 850 | 87% | 13% |
| 8 | 1 | 523 | 91% | 9% |
| 8 | 2 alleate | 168 | 80% | 20% |
| 8 | 2 rivali | 159 | 75% | 25% |

## 2. Finale: rinnovo dei contratti (D-058)

La domanda "C'è una spia?" passa con almeno metà di sì. "Doppio" = due licenziati per stallo ripetuto a due; "Ultima a vuoto" = percorso a tre finito senza licenziati.

| Giocatori | Spie licenziate (su spie presenti) | Onesti licenziati (per partita) | Domanda passa (con spie) | Domanda passa (senza spie) | Partite con ballottaggio | Doppio | Ultima a vuoto |
|---|---|---|---|---|---|---|---|
| 4 | 45% | 0.47 | 85% | 38% | 61% | 8% | 0% |
| 5 | 24% | 0.30 | 56% | 19% | 32% | 0% | 0% |
| 6 | 29% | 0.50 | 74% | 27% | 63% | 9% | 2% |
| 7 | 18% | 0.39 | 61% | 18% | 50% | 0% | 0% |
| 8 | 22% | 0.71 | 69% | 16% | 61% | 4% | 2% |

## 3. Equità tra reparti (D-005, D-069)

Per ogni reparto: punteggio medio, percentuale di partite vinte (punteggio più alto), bonus e malus ricevuti dalle 12 carte della partita (approvate o no: devono essere uguali per tutti), volte coinvolto come fonte o destinatario di un segreto, percentuale di licenziamenti subiti nel finale.

Algoritmo di equità: scarto massimo tra reparti **1** punti (tolleranza 1); trimestri con un reparto premiato sia nella grande sia nelle piccole: **0**.


**4 giocatori** (vittoria attesa se tutti pari: 25%)

| Reparto | Punteggio medio | Vittorie | Bonus carte | Malus carte | Segreti (fonte o destinatario) | Licenziato |
|---|---|---|---|---|---|---|
| ACQUISTI | 17.9 | 26% | 10.0 | 6.0 | 3.0 | 21% |
| PRODUZIONE | 18.1 | 29% | 10.0 | 6.0 | 3.0 | 21% |
| VENDITE | 17.9 | 27% | 10.0 | 6.0 | 3.0 | 23% |
| MARKETING | 17.5 | 25% | 10.0 | 6.0 | 3.0 | 21% |

**5 giocatori** (vittoria attesa se tutti pari: 20%)

| Reparto | Punteggio medio | Vittorie | Bonus carte | Malus carte | Segreti (fonte o destinatario) | Licenziato |
|---|---|---|---|---|---|---|
| ACQUISTI | 20.0 | 21% | 8.0 | 4.8 | 2.4 | 9% |
| PRODUZIONE | 20.0 | 21% | 8.0 | 4.8 | 2.4 | 9% |
| VENDITE | 19.8 | 21% | 8.0 | 4.8 | 2.4 | 11% |
| MARKETING | 20.4 | 24% | 8.0 | 4.8 | 2.4 | 11% |
| FINANZA | 20.3 | 24% | 8.0 | 4.8 | 2.4 | 11% |

**6 giocatori** (vittoria attesa se tutti pari: 17%)

| Reparto | Punteggio medio | Vittorie | Bonus carte | Malus carte | Segreti (fonte o destinatario) | Licenziato |
|---|---|---|---|---|---|---|
| ACQUISTI | 20.0 | 17% | 6.7 | 4.0 | 2.0 | 12% |
| PRODUZIONE | 19.7 | 18% | 6.6 | 4.0 | 2.0 | 13% |
| VENDITE | 20.1 | 19% | 6.7 | 4.0 | 2.0 | 11% |
| MARKETING | 20.3 | 20% | 6.7 | 4.0 | 2.0 | 13% |
| FINANZA | 20.1 | 19% | 6.6 | 4.0 | 2.0 | 13% |
| RISORSE_UMANE | 20.3 | 19% | 6.7 | 4.0 | 2.0 | 12% |

**7 giocatori** (vittoria attesa se tutti pari: 14%)

| Reparto | Punteggio medio | Vittorie | Bonus carte | Malus carte | Segreti (fonte o destinatario) | Licenziato |
|---|---|---|---|---|---|---|
| ACQUISTI | 21.3 | 17% | 5.7 | 3.5 | 1.7 | 8% |
| PRODUZIONE | 21.5 | 15% | 5.7 | 3.4 | 1.7 | 8% |
| VENDITE | 21.3 | 15% | 5.7 | 3.4 | 1.7 | 7% |
| MARKETING | 21.4 | 16% | 5.7 | 3.4 | 1.7 | 6% |
| FINANZA | 21.4 | 15% | 5.7 | 3.4 | 1.7 | 10% |
| RISORSE_UMANE | 21.9 | 18% | 5.7 | 3.4 | 1.7 | 9% |
| RICERCA_SVILUPPO | 21.3 | 16% | 5.7 | 3.4 | 1.7 | 7% |

**8 giocatori** (vittoria attesa se tutti pari: 13%)

| Reparto | Punteggio medio | Vittorie | Bonus carte | Malus carte | Segreti (fonte o destinatario) | Licenziato |
|---|---|---|---|---|---|---|
| ACQUISTI | 20.1 | 14% | 5.0 | 3.0 | 1.5 | 13% |
| PRODUZIONE | 20.1 | 12% | 5.0 | 3.0 | 1.5 | 12% |
| VENDITE | 20.6 | 14% | 5.0 | 3.0 | 1.5 | 11% |
| MARKETING | 20.2 | 13% | 5.0 | 3.0 | 1.5 | 12% |
| FINANZA | 20.8 | 15% | 5.0 | 3.0 | 1.5 | 12% |
| RISORSE_UMANE | 20.4 | 16% | 5.0 | 3.0 | 1.5 | 12% |
| RICERCA_SVILUPPO | 20.2 | 14% | 5.0 | 3.0 | 1.5 | 12% |
| IT_SICUREZZA | 20.5 | 15% | 5.0 | 3.0 | 1.5 | 13% |

## 4. Profili dei robot: punteggio medio e vittorie

Se gli onesti egoisti battono nettamente i cooperativi, la mossa "reparto" conviene troppo (GDD §9, ⚖️).

| Profilo | Giocatori | Punteggio medio | Punti di reparto medi | Vittorie |
|---|---|---|---|---|
| COOPERATIVO | 12659 | 22.7 | 2.2 | 17% |
| EGOISTA | 12764 | 20.8 | 3.9 | 19% |
| SPIA_PRUDENTE | 2378 | 11.0 | 2.9 | 15% |
| SPIA_AGGRESSIVA | 2199 | 12.0 | 3.9 | 24% |

## 4b. Obiettivi personali

Obiettivi di taratura (D-051): traguardo **facile** raggiunto dal **60–70%** di chi l'ha scelto, **difficile** dal **25–35%**; **i tre tipi rendono in media lo stesso (±1 punto)**; nessun reparto avvantaggiato. Si regolano le soglie, non i punti.

| Tipo | Scelto da | Facile raggiunto | Difficile raggiunto | Punti medi | …onesti | …spie |
|---|---|---|---|---|---|---|
| 1 | 33% | 61% | 31% | 3.4 | 3.2 | 4.6 |
| 2 | 34% | 59% | 34% | 4.1 | 4.1 | 4.4 |
| 3 | 33% | 61% | 27% | 4.1 | 3.9 | 4.9 |

### Resa di ogni obiettivo

⚖️ = fuori dagli obiettivi di taratura (con almeno 30 scelte). 🏢 = aziendalista.

| Obiettivo | Nome | Scelto | Facile | Difficile | Punti medi |
|---|---|---|---|---|---|
| T1-01 | Bastian contrario | 828 | 80% ⚖️ | 49% ⚖️ | 4.8 |
| T1-02 | Ago della bilancia | 776 | 0% ⚖️ | 0% ⚖️ | 0.0 |
| T1-03 | Forbici | 813 | 23% ⚖️ | 3% ⚖️ | 0.9 |
| T1-04 | Passaparola | 825 | 70% | 14% ⚖️ | 2.8 |
| T1-05 | Falsario | 798 | 94% ⚖️ | 41% ⚖️ | 4.8 |
| T1-06 | Centralino | 807 | 58% ⚖️ | 9% ⚖️ | 2.2 |
| T1-07 | Confidente | 818 | 61% | 22% ⚖️ | 3.0 |
| T1-08 | Cassaforte | 842 | 0% ⚖️ | 0% ⚖️ | 0.0 |
| T1-09 | 🏢 Gioco di squadra | 921 | 78% ⚖️ | 57% ⚖️ | 5.2 |
| T1-10 | 🏢 In linea | 888 | 87% ⚖️ | 49% ⚖️ | 5.1 |
| T1-11 | 🏢 Occhio clinico | 844 | 99% ⚖️ | 77% ⚖️ | 6.8 |
| T1-12 | 🏢 Postino | 865 | 76% ⚖️ | 43% ⚖️ | 4.4 |
| T2-01 | Voce critica | 913 | 0% ⚖️ | 73% ⚖️ | 5.1 |
| T2-02 | Intermediario | 907 | 87% ⚖️ | 36% ⚖️ | 5.2 |
| T2-03 | Archivista | 879 | 64% | 16% ⚖️ | 3.0 |
| T2-04 | Disinformatore | 891 | 93% ⚖️ | 30% | 4.9 |
| T2-05 | Popolare | 882 | 9% ⚖️ | 22% ⚖️ | 1.8 |
| T2-06 | Fantasma | 902 | 59% ⚖️ | 40% ⚖️ | 4.6 |
| T2-08 | Forbici d'oro | 847 | 29% ⚖️ | 0% ⚖️ | 0.9 |
| T2-09 | 🏢 Squadra | 922 | 82% ⚖️ | 60% ⚖️ | 6.6 |
| T2-10 | 🏢 Occhio clinico | 987 | 95% ⚖️ | 47% ⚖️ | 6.1 |
| T2-11 | 🏢 Postino | 956 | 42% ⚖️ | 43% ⚖️ | 4.3 |
| T2-12 | 🏢 Consenso | 990 | 80% ⚖️ | 0% ⚖️ | 2.4 |
| T3-01 | Ago d'oro | 873 | 0% ⚖️ | 0% ⚖️ | 0.0 |
| T3-02 | Voce solitaria | 909 | 81% ⚖️ | 28% | 4.9 |
| T3-03 | Rete | 881 | 70% | 36% ⚖️ | 4.9 |
| T3-04 | Canarino | 860 | 88% ⚖️ | 40% ⚖️ | 5.9 |
| T3-05 | Crocevia | 870 | 9% ⚖️ | 0% ⚖️ | 0.3 |
| T3-07 | Tesoriere | 886 | 0% ⚖️ | 0% ⚖️ | 0.0 |
| T3-08 | Controcorrente | 835 | 69% | 76% ⚖️ | 7.3 |
| T3-09 | 🏢 Squadra | 940 | 77% ⚖️ | 32% | 5.0 |
| T3-10 | 🏢 Occhio clinico | 954 | 99% ⚖️ | 24% ⚖️ | 5.4 |
| T3-11 | 🏢 Custode | 942 | 79% ⚖️ | 17% ⚖️ | 4.2 |
| T3-12 | 🏢 Maggioranza | 949 | 92% ⚖️ | 49% ⚖️ | 6.6 |

### Obiettivi per profilo

| Profilo | Punti obiettivo medi | Facile raggiunto | Difficile raggiunto |
|---|---|---|---|
| COOPERATIVO | 4.1 | 64% | 33% |
| EGOISTA | 3.4 | 52% | 27% |
| SPIA_PRUDENTE | 5.2 | 84% | 40% |
| SPIA_AGGRESSIVA | 4.0 | 63% | 31% |

Dilemma della spia (partite con una spia): chi ha preso punti dall'obiettivo aziendalista vince la partita nel 16% dei casi (3072 spie), chi non ne ha presi nel 20% (851 spie).

### Obiettivi per numero di giocatori ed equità tra reparti (D-005)

| Giocatori | Punti obiettivo medi | Reparto più basso | Reparto più alto |
|---|---|---|---|
| 4 | 4.1 | 4.1 | 4.2 |
| 5 | 3.9 | 3.7 | 4.2 |
| 6 | 4.0 | 3.8 | 4.2 |
| 7 | 3.8 | 3.7 | 4.0 |
| 8 | 3.6 | 3.3 | 3.8 |

### Soglie suggerite (stima)

Soglia attuale con la sua riuscita, e la soglia intera che porterebbe la riuscita più vicina al 65% (facile) o al 30% (difficile). Per la cassa si suggerisce l'importo in K (nel tipo 1 i due gradini condividono l'importo: scegliere un valore intermedio). "—" = soglia simbolica (dipende dal numero di giocatori); "=" = già la migliore.

| Obiettivo | Nome | Traguardo | Attuale | Suggerita | Scelte |
|---|---|---|---|---|---|
| T1-01 | Bastian contrario | facile | 3 (80%) | 4 (64%) | 828 |
| T1-01 | Bastian contrario | difficile | 5 (49%) | 6 (32%) | 828 |
| T1-02 | Ago della bilancia | facile | 3 (0%) | = | 776 |
| T1-02 | Ago della bilancia | difficile | 4 (0%) | = | 776 |
| T1-03 | Forbici | facile | 3 (23%) | 2 (63%) | 813 |
| T1-03 | Forbici | difficile | 4 (3%) | 3 (23%) | 813 |
| T1-04 | Passaparola | facile | 3 (70%) | = | 825 |
| T1-04 | Passaparola | difficile | 6 (14%) | 5 (28%) | 825 |
| T1-05 | Falsario | facile | 1 (94%) | 2 (72%) | 798 |
| T1-05 | Falsario | difficile | 3 (41%) | = | 798 |
| T1-06 | Centralino | facile | META_ALTRI | — | — |
| T1-06 | Centralino | difficile | TUTTI_ALTRI | — | — |
| T1-07 | Confidente | facile | 2 (61%) | = | 818 |
| T1-07 | Confidente | difficile | 3 (22%) | = | 818 |
| T1-08 | Cassaforte | facile | 120 K (0%) | 50 K (60%) | 842 |
| T1-08 | Cassaforte | difficile | 120 K (0%) | 30 K (34%) | 842 |
| T1-09 | Gioco di squadra | facile | 3 (78%) | 4 (57%) | 921 |
| T1-09 | Gioco di squadra | difficile | 4 (57%) | = | 921 |
| T1-10 | In linea | facile | 5 (87%) | 7 (68%) | 888 |
| T1-10 | In linea | difficile | 8 (49%) | 9 (36%) | 888 |
| T1-11 | Occhio clinico | facile | 1 (99%) | 3 (77%) | 844 |
| T1-11 | Occhio clinico | difficile | 3 (77%) | 5 (27%) | 844 |
| T1-12 | Postino | facile | 1 (76%) | = | 865 |
| T1-12 | Postino | difficile | 2 (43%) | = | 865 |
| T2-01 | Voce critica | facile | 2 (0%) | = | 913 |
| T2-01 | Voce critica | difficile | 2 (73%) | 4 (23%) | 913 |
| T2-02 | Intermediario | facile | 2 (87%) | 3 (69%) | 907 |
| T2-02 | Intermediario | difficile | 3 (36%) | = | 907 |
| T2-03 | Archivista | facile | 2 (64%) | = | 879 |
| T2-03 | Archivista | difficile | 5 (16%) | = | 879 |
| T2-04 | Disinformatore | facile | 1 (93%) | 2 (72%) | 891 |
| T2-04 | Disinformatore | difficile | 1 (30%) | = | 891 |
| T2-05 | Popolare | facile | 1 (9%) | = | 882 |
| T2-05 | Popolare | difficile | 1 (22%) | = | 882 |
| T2-06 | Fantasma | facile | META_ALTRI | — | — |
| T2-06 | Fantasma | difficile | TUTTI_I_TRIMESTRI | — | — |
| T2-08 | Forbici d'oro | facile | 4 (29%) | 3 (76%) | 847 |
| T2-08 | Forbici d'oro | difficile | 150 K (0%) | 60 K (24%) | 847 |
| T2-09 | Squadra | facile | 3 (82%) | 4 (56%) | 922 |
| T2-09 | Squadra | difficile | TUTTI_I_TRIMESTRI | — | — |
| T2-10 | Occhio clinico | facile | 2 (95%) | 4 (53%) | 987 |
| T2-10 | Occhio clinico | difficile | 1 (47%) | = | 987 |
| T2-11 | Postino | facile | 1 (42%) | = | 956 |
| T2-11 | Postino | difficile | 2 (43%) | = | 956 |
| T2-12 | Consenso | facile | 6 (80%) | 7 (67%) | 990 |
| T2-12 | Consenso | difficile | 2 (0%) | = | 990 |
| T3-01 | Ago d'oro | facile | 3 (0%) | = | 873 |
| T3-01 | Ago d'oro | difficile | 4 (0%) | = | 873 |
| T3-02 | Voce solitaria | facile | 3 (81%) | 4 (68%) | 909 |
| T3-02 | Voce solitaria | difficile | 1 (28%) | = | 909 |
| T3-03 | Rete | facile | 2 (70%) | = | 881 |
| T3-03 | Rete | difficile | 3 (36%) | = | 881 |
| T3-04 | Canarino | facile | 2 (88%) | = | 860 |
| T3-04 | Canarino | difficile | 1 (40%) | = | 860 |
| T3-05 | Crocevia | facile | TUTTI_ALTRI | — | — |
| T3-05 | Crocevia | difficile | TUTTI_I_TRIMESTRI | — | — |
| T3-07 | Tesoriere | facile | 40 K (0%) | 10 K (64%) | 886 |
| T3-07 | Tesoriere | difficile | 150 K (0%) | 60 K (21%) | 886 |
| T3-08 | Controcorrente | facile | 2 (69%) | = | 835 |
| T3-08 | Controcorrente | difficile | 2 (76%) | 4 (22%) | 835 |
| T3-09 | Squadra | facile | 3 (77%) | 4 (57%) | 940 |
| T3-09 | Squadra | difficile | 4 (32%) | = | 940 |
| T3-10 | Occhio clinico | facile | 1 (99%) | 3 (77%) | 954 |
| T3-10 | Occhio clinico | difficile | 2 (24%) | 1 (24%) | 954 |
| T3-11 | Custode | facile | 1 (79%) | = | 942 |
| T3-11 | Custode | difficile | 2 (17%) | = | 942 |
| T3-12 | Maggioranza | facile | 1 (92%) | = | 949 |
| T3-12 | Maggioranza | difficile | 8 (49%) | 9 (35%) | 949 |

## 5. Cassa e voto del pacchetto (D-068)

Come si decide il pacchetto di ogni trimestre e quale si sceglie: "la grande" (80 K da sola), "le due piccole" (30 + 50) o un pacchetto più ricco grazie al tesoretto.

| Trimestre | Cassa media all'inizio (K) | Maggioranza al 1° voto | Passa il principale | Passa l'alternativa | La grande | Le due piccole | Più ricco | Spesa media (K) |
|---|---|---|---|---|---|---|---|---|
| 1 | 100.0 | 70% | 10% | 20% | 36% | 64% | 0% | 80.0 |
| 2 | 120.0 | 32% | 41% | 27% | 17% | 47% | 36% | 90.7 |
| 3 | 129.3 | 21% | 51% | 28% | 15% | 40% | 45% | 97.2 |
| 4 | 132.1 | 24% | 49% | 26% | 15% | 45% | 40% | 100.0 |

Cassa media a fine anno: 32.1 K.

### Crescita dell'azienda da proposte e segreti (D-056)

Effetto medio per trimestre delle proposte approvate e dei segreti arrivati in tempo, nelle partite **senza spie**: è il valore da usare per `concorrenti.crescitaMediaProposteESegreti`.

| Giocatori | Partite senza spie | Proposte + segreti a trimestre |
|---|---|---|
| 4 | 150 | 3.17 |
| 5 | 150 | 3.70 |
| 6 | 150 | 3.14 |
| 7 | 150 | 3.43 |
| 8 | 150 | 3.51 |

Media generale: **3.39** a trimestre.

## 6. Segreti

Due segreti a trimestre (1°–3°), uno vero e uno finto (D-074); scadenza a fine del trimestre successivo (D-072); catena minima di colleghi (D-073).

| Segreti distribuiti | Arrivati a destinazione (qualsiasi versione) | Veri arrivati veri in tempo (su veri) | Consegnati ai concorrenti | …falsi o finti (penalità) | …di cui finti |
|---|---|---|---|---|---|
| 30000 | 52% | 40% | 18% | 26% | 14% |

## 7. Avvisi automatici

- ⚠️ Obiettivi: 34 su 34 hanno almeno un traguardo fuori dagli obiettivi di taratura (soglie da ritoccare).

## 8. Limiti

- I robot non parlano, non mentono a voce e non persuadono: la parte "psicologica" si misura solo nelle serate di prova.
- Contenuti veri (40 quesiti a 30 / 50 / 80 K, 36 segreti con valori variabili e tipi a bilancia, D-030…D-039, D-062), ma i robot non leggono i testi: votano sui numeri e non usano il tipo dei segreti per decidere a chi darli.
- Obiettivi personali (D-046…D-052): i robot scelgono metà delle volte secondo il profilo e metà a caso, e li perseguono con regole semplici (robot.ts). Non sanno "leggere la sala": gli obiettivi che chiedono di indovinare l'esito di un voto o l'effetto sull'azienda risultano più difficili che per una persona. I messaggi di solo testo sono simulati con una probabilità fissa.
- Il comportamento dei robot (soglie di voto, sospetti, accuse) è una semplificazione descritta in packages/simulator/src/robot.ts. Nel finale (D-058) un onesto risponde "sì, c'è una spia" se ha un sospetto concreto (o per istinto, 30%), poi nomina chi sospetta di più; la spia prudente dice "sì" metà delle volte per mimetizzarsi, quella aggressiva sempre "no", e le spie nominano a caso. I robot non usano il conteggio "3 su 5 per l'azienda" né gli annunci dei segreti (D-061): quegli indizi servono alle persone, e il loro effetto si vedrà solo nelle serate.