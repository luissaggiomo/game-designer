# Report del simulatore — Il Direttivo

Concorrenti (D-056): direttivo di riferimento al 45% di scelte aziendaliste, effetto medio di proposte e segreti 2.93 a trimestre. 5000 partite simulate (1000 per ciascun numero di giocatori: 4, 5, 6, 7, 8), semi da 1. Durata: 1220.8 s. Data: 2026-11-23. Dopo D-057…D-062 (via demansionamento e astensione; finale "Rinnovo dei contratti" senza punti sulle accuse; conteggio "N su M per l'azienda" e annuncio dei segreti, che i robot non usano; costi 30 / 50 / 80 K). Confronto col report 11: spia vincente con una spia 24 / 32 / 26 / 27 / 18% (era 23 / 25 / 22 / 23 / 15%), con due spie 45% alleate / 40% rivali (era 39 / 34%); spie licenziate 56 / 35 / 33 / 19 / 22% (era 58 / 46 / 43 / 34 / 35%); spie aggressive 43% di vittorie (era 28%), prudenti 23% (era 17%); cassa al tetto nel 76% dei trimestri e 3% di bocciature per fondi (invariate: i nuovi costi hanno la stessa media dei vecchi); crescita da proposte e segreti 2,95 a trimestre (config: 2,93, nessun ritocco necessario).

> **Prova di sensibilità (300 partite per numero di giocatori, non conservata):** con robot onesti che rispondono "sì, c'è una spia" anche senza indizi nel 70% dei casi (invece del 30%) la spia vince il 16–17% con una spia (8% con 8 giocatori), le spie licenziate salgono al 49–66%, ma gli onesti licenziati salgono a 0,4–1,1 per partita e nelle partite **senza spie** la domanda passa nel 78–94% dei casi (quasi sempre un innocente licenziato). Il risultato del finale dipende quindi molto da quanto facilmente le persone diranno "sì": è la prima cosa da osservare nelle serate.

## 1. Chi vince la corsa di mercato

Con una spia attiva l'azienda deve vincere sensibilmente meno. La vittoria dell'azienda senza spie è **solo informativa** (D-054: ogni giocatore punta a vincere personalmente).

| Giocatori | Spie | Partite | Vince l'azienda | Vince un concorrente | Pareggio |
|---|---|---|---|---|---|
| 4 | 0 | 150 | 77% | 21% | 3% |
| 4 | 1 | 850 | 40% | 56% | 5% |
| 5 | 0 | 150 | 83% | 16% | 1% |
| 5 | 1 | 850 | 46% | 49% | 5% |
| 6 | 0 | 150 | 81% | 17% | 3% |
| 6 | 1 | 850 | 58% | 39% | 4% |
| 7 | 0 | 150 | 75% | 22% | 3% |
| 7 | 1 | 850 | 63% | 33% | 4% |
| 8 | 0 | 150 | 85% | 14% | 1% |
| 8 | 1 | 523 | 71% | 27% | 2% |
| 8 | 2 alleate | 168 | 45% | 46% | 9% |
| 8 | 2 rivali | 159 | 52% | 44% | 4% |

### Scelte aziendaliste e vittoria dell'azienda (partite senza spie)

Quota di mosse private "per l'azienda" sul totale della partita, e quante volte l'azienda vince in ciascuna fascia. La **soglia** è la quota oltre la quale l'azienda vince più spesso di quanto perde.

| Scelte aziendaliste | Partite | Vince l'azienda |
|---|---|---|
| 0–30% | 6 | 0% |
| 30–40% | 30 | 3% |
| 40–50% | 47 | 21% |
| 50–60% | 203 | 67% |
| 60–67% | 151 | 95% |
| 67–75% | 121 | 98% |
| 75–85% | 148 | 100% |
| 85–100% | 44 | 100% |

Quota media di scelte aziendaliste: 63%. Soglia stimata: 55%.

### Chi vince tra onesti e spie (partite con spie)

Vince la spia se il suo concorrente supera l'azienda **e** lei non è stata scoperta (non licenziata); altrimenti vincono gli onesti. Riferimento indicato da Luis: con 4 giocatori e 1 spia, **circa 20% spia, 80% onesti**.

| Giocatori | Spie | Partite | Vincono gli onesti | Vince la spia |
|---|---|---|---|---|
| 4 | 1 | 850 | 76% | 24% |
| 5 | 1 | 850 | 68% | 32% |
| 6 | 1 | 850 | 74% | 26% |
| 7 | 1 | 850 | 73% | 27% |
| 8 | 1 | 523 | 82% | 18% |
| 8 | 2 alleate | 168 | 55% | 45% |
| 8 | 2 rivali | 159 | 60% | 40% |

## 2. Finale: rinnovo dei contratti (D-058)

La domanda "C'è una spia?" passa con almeno metà di sì. "Doppio" = due licenziati per stallo ripetuto a due; "Ultima a vuoto" = percorso a tre finito senza licenziati.

| Giocatori | Spie licenziate (su spie presenti) | Onesti licenziati (per partita) | Domanda passa (con spie) | Domanda passa (senza spie) | Partite con ballottaggio | Doppio | Ultima a vuoto |
|---|---|---|---|---|---|---|---|
| 4 | 56% | 0.33 | 82% | 33% | 48% | 6% | 0% |
| 5 | 35% | 0.15 | 51% | 12% | 23% | 0% | 0% |
| 6 | 33% | 0.26 | 54% | 28% | 43% | 5% | 1% |
| 7 | 19% | 0.12 | 31% | 10% | 22% | 0% | 0% |
| 8 | 22% | 0.26 | 44% | 17% | 38% | 2% | 1% |

## 3. Equità tra reparti (D-005)

Per ogni reparto: punteggio medio, percentuale di partite vinte (punteggio più alto), peso di voto disponibile nell'anno, segreti ricevuti come fonte, volte "favorito" dall'ordine del giorno, percentuale di licenziamenti subiti nel finale.


**4 giocatori** (vittoria attesa se tutti pari: 25%)

| Reparto | Punteggio medio | Vittorie | Peso voto/anno | Segreti come fonte | Favorito | Licenziato |
|---|---|---|---|---|---|---|
| ACQUISTI | 15.5 | 27% | 12.5 | 2.0 | 3.5 | 20% |
| PRODUZIONE | 15.3 | 25% | 12.5 | 2.0 | 3.5 | 20% |
| VENDITE | 15.5 | 27% | 12.5 | 2.0 | 3.6 | 22% |
| MARKETING | 15.2 | 28% | 12.5 | 2.0 | 3.6 | 18% |

**5 giocatori** (vittoria attesa se tutti pari: 20%)

| Reparto | Punteggio medio | Vittorie | Peso voto/anno | Segreti come fonte | Favorito | Licenziato |
|---|---|---|---|---|---|---|
| ACQUISTI | 16.1 | 24% | 12.0 | 1.6 | 2.8 | 10% |
| PRODUZIONE | 15.7 | 20% | 12.0 | 1.6 | 2.8 | 9% |
| VENDITE | 15.6 | 21% | 12.0 | 1.6 | 2.9 | 9% |
| MARKETING | 15.9 | 22% | 12.0 | 1.6 | 2.8 | 9% |
| FINANZA | 16.1 | 23% | 12.0 | 1.6 | 2.8 | 9% |

**6 giocatori** (vittoria attesa se tutti pari: 17%)

| Reparto | Punteggio medio | Vittorie | Peso voto/anno | Segreti come fonte | Favorito | Licenziato |
|---|---|---|---|---|---|---|
| ACQUISTI | 17.1 | 16% | 11.7 | 1.3 | 2.4 | 9% |
| PRODUZIONE | 16.9 | 17% | 11.7 | 1.3 | 2.4 | 9% |
| VENDITE | 17.3 | 20% | 11.7 | 1.4 | 2.4 | 9% |
| MARKETING | 17.4 | 18% | 11.7 | 1.3 | 2.4 | 9% |
| FINANZA | 17.1 | 19% | 11.6 | 1.3 | 2.4 | 10% |
| RISORSE_UMANE | 17.3 | 19% | 11.7 | 1.3 | 2.4 | 8% |

**7 giocatori** (vittoria attesa se tutti pari: 14%)

| Reparto | Punteggio medio | Vittorie | Peso voto/anno | Segreti come fonte | Favorito | Licenziato |
|---|---|---|---|---|---|---|
| ACQUISTI | 17.2 | 15% | 11.4 | 1.1 | 2.0 | 4% |
| PRODUZIONE | 17.2 | 14% | 11.4 | 1.1 | 2.0 | 4% |
| VENDITE | 17.5 | 17% | 11.4 | 1.2 | 2.0 | 5% |
| MARKETING | 17.3 | 16% | 11.4 | 1.1 | 2.0 | 4% |
| FINANZA | 17.2 | 15% | 11.4 | 1.1 | 2.0 | 4% |
| RISORSE_UMANE | 17.7 | 16% | 11.4 | 1.1 | 2.0 | 3% |
| RICERCA_SVILUPPO | 17.6 | 17% | 11.4 | 1.2 | 2.1 | 3% |

**8 giocatori** (vittoria attesa se tutti pari: 13%)

| Reparto | Punteggio medio | Vittorie | Peso voto/anno | Segreti come fonte | Favorito | Licenziato |
|---|---|---|---|---|---|---|
| ACQUISTI | 16.8 | 12% | 11.3 | 1.0 | 1.7 | 6% |
| PRODUZIONE | 16.9 | 14% | 11.2 | 1.0 | 1.8 | 6% |
| VENDITE | 17.4 | 15% | 11.2 | 1.0 | 1.7 | 7% |
| MARKETING | 17.3 | 13% | 11.3 | 1.0 | 1.8 | 8% |
| FINANZA | 17.6 | 17% | 11.3 | 1.0 | 1.8 | 6% |
| RISORSE_UMANE | 17.5 | 15% | 11.2 | 1.0 | 1.8 | 5% |
| RICERCA_SVILUPPO | 17.3 | 15% | 11.2 | 1.0 | 1.8 | 6% |
| IT_SICUREZZA | 17.3 | 15% | 11.2 | 1.0 | 1.8 | 6% |

## 4. Profili dei robot: punteggio medio e vittorie

Se gli onesti egoisti battono nettamente i cooperativi, la mossa "reparto" conviene troppo (GDD §9, ⚖️).

| Profilo | Giocatori | Punteggio medio | Punti di reparto medi | Vittorie |
|---|---|---|---|---|
| COOPERATIVO | 12659 | 19.0 | 0.8 | 13% |
| EGOISTA | 12764 | 16.6 | 3.1 | 18% |
| SPIA_PRUDENTE | 2378 | 10.3 | 2.0 | 23% |
| SPIA_AGGRESSIVA | 2199 | 12.6 | 2.6 | 43% |

## 4b. Obiettivi personali

Obiettivi di taratura (D-051): traguardo **facile** raggiunto dal **60–70%** di chi l'ha scelto, **difficile** dal **25–35%**; **i tre tipi rendono in media lo stesso (±1 punto)**; nessun reparto avvantaggiato. Si regolano le soglie, non i punti.

| Tipo | Scelto da | Facile raggiunto | Difficile raggiunto | Punti medi | …onesti | …spie |
|---|---|---|---|---|---|---|
| 1 | 33% | 64% | 26% | 3.2 | 3.3 | 3.0 |
| 2 | 34% | 58% | 28% | 3.7 | 3.8 | 3.6 |
| 3 | 33% | 63% | 23% | 3.9 | 4.0 | 3.4 |

### Resa di ogni obiettivo

⚖️ = fuori dagli obiettivi di taratura (con almeno 30 scelte). 🏢 = aziendalista.

| Obiettivo | Nome | Scelto | Facile | Difficile | Punti medi |
|---|---|---|---|---|---|
| T1-01 | Bastian contrario | 828 | 73% ⚖️ | 28% | 3.6 |
| T1-02 | Ago della bilancia | 776 | 65% | 47% ⚖️ | 4.3 |
| T1-03 | Forbici | 813 | 81% ⚖️ | 46% ⚖️ | 4.7 |
| T1-04 | Passaparola | 825 | 20% ⚖️ | 0% ⚖️ | 0.6 |
| T1-05 | Falsario | 798 | 85% ⚖️ | 0% ⚖️ | 2.6 |
| T1-06 | Centralino | 807 | 36% ⚖️ | 5% ⚖️ | 1.3 |
| T1-07 | Confidente | 818 | 23% ⚖️ | 5% ⚖️ | 0.9 |
| T1-08 | Cassaforte | 842 | 77% ⚖️ | 31% | 3.9 |
| T1-09 | 🏢 Gioco di squadra | 921 | 78% ⚖️ | 57% ⚖️ | 5.2 |
| T1-10 | 🏢 In linea | 888 | 75% ⚖️ | 29% | 3.7 |
| T1-11 | 🏢 Occhio clinico | 844 | 73% ⚖️ | 37% ⚖️ | 4.0 |
| T1-12 | 🏢 Postino | 865 | 83% ⚖️ | 27% | 3.8 |
| T2-01 | Voce critica | 913 | 62% | 36% ⚖️ | 4.4 |
| T2-02 | Intermediario | 907 | 62% | 0% ⚖️ | 1.9 |
| T2-03 | Archivista | 879 | 23% ⚖️ | 4% ⚖️ | 0.9 |
| T2-04 | Disinformatore | 891 | 84% ⚖️ | 23% ⚖️ | 4.2 |
| T2-05 | Popolare | 882 | 9% ⚖️ | 22% ⚖️ | 1.8 |
| T2-06 | Fantasma | 902 | 36% ⚖️ | 41% ⚖️ | 4.0 |
| T2-08 | Forbici d'oro | 847 | 85% ⚖️ | 47% ⚖️ | 5.8 |
| T2-09 | 🏢 Squadra | 922 | 79% ⚖️ | 55% ⚖️ | 6.2 |
| T2-10 | 🏢 Occhio clinico | 987 | 58% ⚖️ | 19% ⚖️ | 3.0 |
| T2-11 | 🏢 Postino | 956 | 84% ⚖️ | 27% | 4.4 |
| T2-12 | 🏢 Consenso | 990 | 59% ⚖️ | 39% ⚖️ | 4.5 |
| T3-01 | Ago d'oro | 873 | 63% | 19% ⚖️ | 3.6 |
| T3-02 | Voce solitaria | 909 | 72% ⚖️ | 18% ⚖️ | 3.9 |
| T3-03 | Rete | 881 | 60% | 0% ⚖️ | 2.4 |
| T3-04 | Canarino | 860 | 87% ⚖️ | 38% ⚖️ | 5.8 |
| T3-05 | Crocevia | 870 | 5% ⚖️ | 0% ⚖️ | 0.2 |
| T3-07 | Tesoriere | 886 | 68% | 46% ⚖️ | 5.5 |
| T3-08 | Controcorrente | 835 | 76% ⚖️ | 27% | 4.7 |
| T3-09 | 🏢 Squadra | 940 | 78% ⚖️ | 34% | 5.1 |
| T3-10 | 🏢 Occhio clinico | 954 | 66% | 19% ⚖️ | 3.8 |
| T3-11 | 🏢 Custode | 942 | 83% ⚖️ | 21% ⚖️ | 4.6 |
| T3-12 | 🏢 Maggioranza | 949 | 39% ⚖️ | 29% | 3.3 |

### Obiettivi per profilo

| Profilo | Punti obiettivo medi | Facile raggiunto | Difficile raggiunto |
|---|---|---|---|
| COOPERATIVO | 3.8 | 67% | 26% |
| EGOISTA | 3.5 | 60% | 26% |
| SPIA_PRUDENTE | 4.4 | 73% | 33% |
| SPIA_AGGRESSIVA | 2.2 | 36% | 17% |

Dilemma della spia (partite con una spia): chi ha preso punti dall'obiettivo aziendalista vince la partita nel 23% dei casi (2399 spie), chi non ne ha presi nel 31% (1524 spie).

### Obiettivi per numero di giocatori ed equità tra reparti (D-005)

| Giocatori | Punti obiettivo medi | Reparto più basso | Reparto più alto |
|---|---|---|---|
| 4 | 4.3 | 4.2 | 4.4 |
| 5 | 3.9 | 3.8 | 4.0 |
| 6 | 3.7 | 3.4 | 3.9 |
| 7 | 3.4 | 3.2 | 3.7 |
| 8 | 3.3 | 3.1 | 3.4 |

### Soglie suggerite (stima)

Soglia attuale con la sua riuscita, e la soglia intera che porterebbe la riuscita più vicina al 65% (facile) o al 30% (difficile). Per la cassa si suggerisce l'importo in K (nel tipo 1 i due gradini condividono l'importo: scegliere un valore intermedio). "—" = soglia simbolica (dipende dal numero di giocatori); "=" = già la migliore.

| Obiettivo | Nome | Traguardo | Attuale | Suggerita | Scelte |
|---|---|---|---|---|---|
| T1-01 | Bastian contrario | facile | 3 (73%) | = | 828 |
| T1-01 | Bastian contrario | difficile | 5 (28%) | = | 828 |
| T1-02 | Ago della bilancia | facile | 3 (65%) | = | 776 |
| T1-02 | Ago della bilancia | difficile | 4 (47%) | 5 (26%) | 776 |
| T1-03 | Forbici | facile | 3 (81%) | = | 813 |
| T1-03 | Forbici | difficile | 4 (46%) | = | 813 |
| T1-04 | Passaparola | facile | 3 (20%) | 2 (61%) | 825 |
| T1-04 | Passaparola | difficile | 6 (0%) | 3 (20%) | 825 |
| T1-05 | Falsario | facile | 1 (85%) | = | 798 |
| T1-05 | Falsario | difficile | 3 (0%) | 2 (21%) | 798 |
| T1-06 | Centralino | facile | META_ALTRI | — | — |
| T1-06 | Centralino | difficile | TUTTI_ALTRI | — | — |
| T1-07 | Confidente | facile | 2 (23%) | 1 (64%) | 818 |
| T1-07 | Confidente | difficile | 3 (5%) | 2 (23%) | 818 |
| T1-08 | Cassaforte | facile | 120 K (77%) | 130 K (60%) | 842 |
| T1-08 | Cassaforte | difficile | 120 K (31%) | = | 842 |
| T1-09 | Gioco di squadra | facile | 3 (78%) | 4 (57%) | 921 |
| T1-09 | Gioco di squadra | difficile | 4 (57%) | = | 921 |
| T1-10 | In linea | facile | 5 (75%) | 6 (62%) | 888 |
| T1-10 | In linea | difficile | 8 (29%) | = | 888 |
| T1-11 | Occhio clinico | facile | 1 (73%) | = | 844 |
| T1-11 | Occhio clinico | difficile | 3 (37%) | = | 844 |
| T1-12 | Postino | facile | 1 (83%) | = | 865 |
| T1-12 | Postino | difficile | 2 (27%) | = | 865 |
| T2-01 | Voce critica | facile | 2 (62%) | = | 913 |
| T2-01 | Voce critica | difficile | 2 (36%) | = | 913 |
| T2-02 | Intermediario | facile | 2 (62%) | = | 907 |
| T2-02 | Intermediario | difficile | 3 (0%) | 2 (10%) | 907 |
| T2-03 | Archivista | facile | 2 (23%) | 1 (66%) | 879 |
| T2-03 | Archivista | difficile | 5 (4%) | 3 (39%) | 879 |
| T2-04 | Disinformatore | facile | 1 (84%) | = | 891 |
| T2-04 | Disinformatore | difficile | 1 (23%) | = | 891 |
| T2-05 | Popolare | facile | 1 (9%) | = | 882 |
| T2-05 | Popolare | difficile | 1 (22%) | = | 882 |
| T2-06 | Fantasma | facile | META_ALTRI | — | — |
| T2-06 | Fantasma | difficile | TUTTI_I_TRIMESTRI | — | — |
| T2-08 | Forbici d'oro | facile | 4 (85%) | = | 847 |
| T2-08 | Forbici d'oro | difficile | 150 K (47%) | = | 847 |
| T2-09 | Squadra | facile | 3 (79%) | 4 (52%) | 922 |
| T2-09 | Squadra | difficile | TUTTI_I_TRIMESTRI | — | — |
| T2-10 | Occhio clinico | facile | 2 (58%) | = | 987 |
| T2-10 | Occhio clinico | difficile | 1 (19%) | = | 987 |
| T2-11 | Postino | facile | 1 (84%) | = | 956 |
| T2-11 | Postino | difficile | 2 (27%) | = | 956 |
| T2-12 | Consenso | facile | 6 (59%) | = | 990 |
| T2-12 | Consenso | difficile | 2 (39%) | = | 990 |
| T3-01 | Ago d'oro | facile | 3 (63%) | = | 873 |
| T3-01 | Ago d'oro | difficile | 4 (19%) | = | 873 |
| T3-02 | Voce solitaria | facile | 3 (72%) | = | 909 |
| T3-02 | Voce solitaria | difficile | 1 (18%) | = | 909 |
| T3-03 | Rete | facile | 2 (60%) | = | 881 |
| T3-03 | Rete | difficile | 3 (0%) | 2 (10%) | 881 |
| T3-04 | Canarino | facile | 2 (87%) | = | 860 |
| T3-04 | Canarino | difficile | 1 (38%) | = | 860 |
| T3-05 | Crocevia | facile | TUTTI_ALTRI | — | — |
| T3-05 | Crocevia | difficile | TUTTI_I_TRIMESTRI | — | — |
| T3-07 | Tesoriere | facile | 40 K (68%) | = | 886 |
| T3-07 | Tesoriere | difficile | 150 K (46%) | = | 886 |
| T3-08 | Controcorrente | facile | 2 (76%) | = | 835 |
| T3-08 | Controcorrente | difficile | 2 (27%) | = | 835 |
| T3-09 | Squadra | facile | 3 (78%) | 4 (56%) | 940 |
| T3-09 | Squadra | difficile | 4 (34%) | = | 940 |
| T3-10 | Occhio clinico | facile | 1 (66%) | = | 954 |
| T3-10 | Occhio clinico | difficile | 2 (19%) | 1 (37%) | 954 |
| T3-11 | Custode | facile | 1 (83%) | = | 942 |
| T3-11 | Custode | difficile | 2 (21%) | = | 942 |
| T3-12 | Maggioranza | facile | 1 (39%) | = | 949 |
| T3-12 | Maggioranza | difficile | 8 (29%) | = | 949 |

## 5. Cassa e votazioni

| Posizione nel trimestre | Votazioni | Approvate | Respinte per fondi |
|---|---|---|---|
| 1ª | 20000 | 39% | 0% |
| 2ª | 20000 | 35% | 4% |
| 3ª | 10000 | 31% | 9% |

| Trimestre | Cassa media a inizio trimestre (K) | Approvate |
|---|---|---|
| 1 | 100.0 | 34% |
| 2 | 142.5 | 36% |
| 3 | 144.4 | 36% |
| 4 | 144.3 | 39% |

Tetto della cassa (150 K) raggiunto in 76% dei trimestri 2–4. Proposte respinte per mancanza di fondi: 3% di tutte le votazioni.

### Crescita dell'azienda da proposte e segreti (D-056)

Effetto medio per trimestre delle proposte approvate e dei segreti arrivati in tempo, nelle partite **senza spie**: è il valore da usare per `concorrenti.crescitaMediaProposteESegreti`.

| Giocatori | Partite senza spie | Proposte + segreti a trimestre |
|---|---|---|
| 4 | 150 | 3.18 |
| 5 | 150 | 2.80 |
| 6 | 150 | 3.05 |
| 7 | 150 | 2.73 |
| 8 | 150 | 2.99 |

Media generale: **2.95** a trimestre.

## 6. Segreti

| Segreti distribuiti | Arrivati in tempo al reparto giusto | Consegnati ai concorrenti | …di cui falsi |
|---|---|---|---|
| 40000 | 54% | 20% | 8% |

## 7. Avvisi automatici

- ⚠️ Obiettivi: 34 su 34 hanno almeno un traguardo fuori dagli obiettivi di taratura (soglie da ritoccare).

## 8. Limiti

- I robot non parlano, non mentono a voce e non persuadono: la parte "psicologica" si misura solo nelle serate di prova.
- Contenuti veri (40 quesiti a 30 / 50 / 80 K, 36 segreti con valori variabili e tipi a bilancia, D-030…D-039, D-062), ma i robot non leggono i testi: votano sui numeri e non usano il tipo dei segreti per decidere a chi darli.
- Obiettivi personali (D-046…D-052): i robot scelgono metà delle volte secondo il profilo e metà a caso, e li perseguono con regole semplici (robot.ts). Non sanno "leggere la sala": gli obiettivi che chiedono di indovinare l'esito di un voto o l'effetto sull'azienda risultano più difficili che per una persona. I messaggi di solo testo sono simulati con una probabilità fissa.
- Il comportamento dei robot (soglie di voto, sospetti, accuse) è una semplificazione descritta in packages/simulator/src/robot.ts. Nel finale (D-058) un onesto risponde "sì, c'è una spia" se ha un sospetto concreto (o per istinto, 30%), poi nomina chi sospetta di più; la spia prudente dice "sì" metà delle volte per mimetizzarsi, quella aggressiva sempre "no", e le spie nominano a caso. I robot non usano il conteggio "3 su 5 per l'azienda" né gli annunci dei segreti (D-061): quegli indizi servono alle persone, e il loro effetto si vedrà solo nelle serate.