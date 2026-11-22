# Il Direttivo — Roadmap e avanzamento

**Fase attuale:** 1 · Design
**Ultimo aggiornamento:** 2026-11-22

Legenda: ⬜ da fare · 🔄 in corso · ✅ fatto · ⏸️ sospeso

> Le fasi del progetto (docs/PROCEDURE.md) corrispondono così alla roadmap tecnica
> dell'architettura (§20): Fase 2 = tecnica 0 · Fase 3 = tecnica 1 · Fase 4 = tecnica 2 ·
> la fase online (tecniche 3–4) si aggiunge dopo, con propria roadmap.

## Fase 1 · Design
- ✅ Bozza del documento di design v0.1 (20/11/2026)
- ✅ Bozza dell'architettura tecnica v0.1 (20/11/2026)
- ⬜ Scelta dello stack: interfaccia Svelte o React (D-004)
- 🔄 Chiusura dei punti 🔴 che bloccano il motore (vedi sotto) — chiusi i primi 6 il 22/11/2026, ne restano 3 più i contenuti minimi
- ⬜ Cancello fase 1 → 2

## Fase 2 · Motore e simulazione
- ⬜ Impianto del codice (pacchetti, test, controllo tipi)
- ⬜ Motore: stato, azioni, macchina a stati delle fasi
- ⬜ Regole: votazione pesata, mossa privata, segreti, concorrenti, autogestione
- ⬜ Demansionamento/promozione, finale, punteggio
- ⬜ Viste filtrate + test di riservatezza
- ⬜ Contenuti minimi (proposte, segreti, obiettivi) in JSON
- ⬜ Simulatore con robot e report
- ⬜ Prima taratura dei numeri ⚖️ e verifica delle decisioni provvisorie D-006…D-011

## Fase 3 · Prototipo locale giocabile
- ⬜ Scelta hosting (DG-006)
- ⬜ Server, stanze, QR, riconnessione
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
| 21 | Soglia esatta e pareggio nel voto di demansionamento/promozione (da D-009) | regola demansionamento |
| 19 | Quesiti "con astensione vera": peso dei demansionati, tempo scaduto, quanti quesiti (da D-007) | votazione pesata |
| 17 | Numero di votazioni per partita e dimensione del mazzo di quesiti (da D-006) | generazione proposte, contenuti |
| 1–4 | Liste di proposte, segreti, obiettivi, comportamento concorrenti | contenuti e simulatore (bastano versioni minime) |

## Idee da valutare (non bloccano subito)
| # GDD | Idea | Tocca |
|---|---|---|
| 18 | Bot che occupano i reparti, livelli 1–5, opzione "bot spia sì/no" | assegnazione, autogestione, D-006, D-011 |
| 20 | Livello di fiducia 1–5 e scudo sociale (attenzione: urta §9, mossa privata nascosta) | demansionamento, D-009/D-010 |
| 22 | Risorse Umane peso 2 su demansionamento/promozione + punti nel finale | reparti, D-009 |

## Punti chiusi (provvisori, da verificare col simulatore)
D-006 reparti vacanti nella soglia · D-007 astensione · D-008 ordine delle fasi ·
D-009 voto di demansionamento · D-010 promozione · D-011 numero di concorrenti.
