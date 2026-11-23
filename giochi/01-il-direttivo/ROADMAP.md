# Il Direttivo — Roadmap e avanzamento

**Fase attuale:** 2 · Motore e simulazione
**Ultimo aggiornamento:** 2026-11-23

Legenda: ⬜ da fare · 🔄 in corso · ✅ fatto · ⏸️ sospeso

> Le fasi del progetto (docs/PROCEDURE.md) corrispondono così alla roadmap tecnica
> dell'architettura (§20): Fase 2 = tecnica 0 · Fase 3 = tecnica 1 · Fase 4 = tecnica 2 ·
> la fase online (tecniche 3–4) si aggiunge dopo, con propria roadmap.

## Fase 1 · Design ✅
- ✅ Bozza del documento di design v0.1 (20/11/2026)
- ✅ Bozza dell'architettura tecnica v0.1 (20/11/2026)
- ✅ Scelta dello stack: TypeScript/Vitest/pnpm (D-016), interfaccia Svelte (D-004); architettura confermata (D-003)
- ✅ Chiusura dei punti 🔴 che bloccano le regole del motore (D-006…D-015, 22/11/2026); restano i contenuti minimi, da preparare in fase 2
- ✅ Cancello fase 1 → 2 (22/11/2026)

## Fase 2 · Motore e simulazione
- ✅ Impianto del codice (pacchetti, test, controllo tipi) — 22/11/2026
- ✅ Motore: stato, azioni, macchina a stati delle fasi — 22/11/2026 (sotto-fasi del finale insieme alle regole del finale)
- ✅ Regole: votazione pesata, cassa, ordine del giorno, mossa privata, risultati del trimestre, autogestione (versione base), concorrenti (segnaposto), segreti e messaggi
- ✅ Finale "Rinnovo dei contratti" e punteggio (D-058, D-059; demansionamento eliminato, D-057)
- ✅ Viste filtrate + test di riservatezza (partite casuali da 4 a 8 giocatori, controllo a ogni passo)
- 🔄 Contenuti in JSON — quesiti: 40 veri con due versioni ciascuno (D-030…D-034, D-045) ✅; segreti: 36 veri (D-035…D-039) ✅; obiettivi personali: 34 con regole di verifica (D-046…D-055) ✅, soglie di messaggi e segreti ⚖️ da tarare nelle serate
- ✅ Simulatore con robot e report — ultimo report: docs/simulazioni/2026-11-23-simulazione-12.md (1 avviso: soglie degli obiettivi su messaggi e segreti, da tarare nelle serate)
- 🔄 Prima taratura dei numeri ⚖️ e verifica delle decisioni provvisorie D-006…D-062 — in corso (dodicesimo report, dopo la semplificazione D-057…D-062: spia vincente 18–32% con una spia, 40–45% con due; il finale dipende molto da quanto facilmente si risponde "sì, c'è una spia", da osservare nelle serate; la cassa resta poco vincolante)

## Fase 3 · Prototipo locale giocabile
- ⬜ Scelta hosting (DG-006)
- ⬜ Server, stanze, QR, riconnessione
- ⬜ Prova di compatibilità su dispositivi reali: smart TV, chiavetta, iPhone, Android (D-004)
- ⬜ Schermata TV e schermata telefono
- ⬜ Prima serata di prova (5–6 persone)

## Fase 4 · Rifinitura
- ⬜ Animazioni, tutorial in TV, tono ironico, più contenuti, classifica

## Fase online (successiva)
- ⬜ Prototipo audio (può partire in parallelo alla fase 4)
- ⬜ Più TV, integrazione audio, prima partita a distanza

## Punti aperti che bloccano il motore
Riferimento: tabella §20 del GDD. Da chiudere prima o durante la fase 2.

| # GDD | Tema | Blocca |
|---|---|---|
| 29 | Informazioni di contesto dei reparti con i quesiti generici (D-023) | identità dei reparti (non blocca il motore) |
| 7 | Reparti aggiunti con 6, 7, 8 giocatori (nel motore c'è un ordine segnaposto in config.json) | assegnazione definitiva |
| 4 | Comportamento concorrenti (proposte, segreti e obiettivi fatti: D-030…D-039, D-046…D-052) | contenuti e simulatore |

## Idee e punti da valutare (non bloccano subito)
| # GDD | Idea | Tocca |
|---|---|---|
| 18 | Bot che occupano i reparti, livelli 1–5, opzione "bot spia sì/no" | assegnazione, autogestione, D-006, D-011 |
| 22 | Risorse Umane: voto decisivo in caso di pareggio nel finale, punti nel finale (per ora nessuno, D-059) | reparti, D-058 |
| 24 | Poteri IT/RU: valgono anche per i messaggi anonimi? (con i punti 5–6) | poteri dei reparti |
| 31 | Egoisti avvantaggiati sui cooperativi: per ora si lascia così (C), da rivedere dopo le serate (aiuta il conteggio "N su M per l'azienda", D-061) | punteggio, mossa privata |
| — | S4 carta "indagine" (una a testa) e S5 un evento per trimestre: rinviati da Luis (23/11/2026), da riconsiderare se il gioco risulta povero di indizi o ripetitivo | finale, trimestre |
| 25 | Mini-sfide sul telefono con bonus/penalità (quiz, giochini a tema) — sviluppo successivo | ritmo e varietà |

## Punti chiusi (provvisori, da verificare col simulatore)
D-006 reparti vacanti nella soglia · D-007 astensione · D-008 ordine delle fasi ·
D-009 voto di demansionamento · D-010 promozione · D-011 numero di concorrenti ·
D-012 soglia di demansionamento e promozione · D-013 dettagli dei quesiti con astensione ·
D-014 numero di votazioni, bilanciamento dei favoriti, mazzo · D-015 provenienza dei segreti ·
D-018 cassa: 100 K a trimestre, accumulo con tetto 150 K · D-019 voti rivelati alla chiusura · D-020 mossa privata: solo demansionati in automatico, predefinita "azienda" ·
D-021 segreti e messaggi: collegamento al voto, quando si scrive, anonimi, scadenza ·
D-022 demansionamento, finale e punteggio: limiti, nomina, pareggio, punteggio senza obiettivi ·
D-023 quesiti dall'effetto · D-024 prima taratura · D-025 niente bonus alla spia licenziata · D-026 penalità all'onesto licenziato · D-027 demansionato a fine anno = licenziato a tutti gli effetti · D-028 decisione finale sui demansionati · D-029 revisione del finale ·
D-030…D-034 contenuti dei quesiti · D-035…D-039 contenuti dei segreti · D-045 due versioni per quesito ·
D-046…D-055 obiettivi personali (tre proposti, aziendalisti per le spie, lista, regole di verifica, ritarature) e concorrenti più deboli (D-054) · D-056 concorrente veloce quanto l'azienda media · D-057…D-062 semplificazione dopo l'analisi generale: via demansionamento e astensione, finale "Rinnovo dei contratti" senza punti sulle accuse, conteggio "N su M per l'azienda" e annuncio dei segreti in TV, costi 30 / 50 / 80 K.
