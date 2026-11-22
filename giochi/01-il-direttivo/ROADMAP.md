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
- ⬜ Chiusura dei punti 🔴 che bloccano il motore (vedi sotto)
- ⬜ Cancello fase 1 → 2

## Fase 2 · Motore e simulazione
- ⬜ Impianto del codice (pacchetti, test, controllo tipi)
- ⬜ Motore: stato, azioni, macchina a stati delle fasi
- ⬜ Regole: votazione pesata, mossa privata, segreti, concorrenti, autogestione
- ⬜ Demansionamento/promozione, finale, punteggio
- ⬜ Viste filtrate + test di riservatezza
- ⬜ Contenuti minimi (proposte, segreti, obiettivi) in JSON
- ⬜ Simulatore con robot e report
- ⬜ Prima taratura dei numeri ⚖️

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
| 8 | Voto per demansionare: pesi uguali o di reparto | regola demansionamento |
| 9 | Promozione: durata minima, a voto | regola promozione |
| 10 | Peso dei reparti vacanti nella soglia | votazione pesata |
| 11 | Ordine delle fasi del trimestre | macchina a stati |
| — | Astensione = "no" o astensione esplicita (arch. §7.4) | votazione e timer |
| — | Numero di concorrenti per numero di giocatori (arch. §10.1) | assegnazione |
| 1–4 | Liste di proposte, segreti, obiettivi, comportamento concorrenti | contenuti e simulatore (bastano versioni minime) |
