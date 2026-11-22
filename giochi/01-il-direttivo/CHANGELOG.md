# Il Direttivo — Changelog

Voci più recenti in alto. Categorie: **Design** (regole), **Aggiunto**, **Modificato**, **Corretto**, **Rimosso**.
Versioni nel formato `0.FASE.N` finché il gioco non è completo.

## 2026-11-22 — 0.2.0

### Modificato
- Superato il cancello fase 1 → 2: il gioco passa alla fase **2 · Motore e simulazione**.

## 2026-11-22 — 0.1.3

### Design
- D-012 (provvisoria): demansionamento e promozione a metà più uno degli aventi diritto; pareggio = non passa.
- D-013 (provvisoria): nei quesiti con astensione i demansionati contano come "no", il tempo scaduto vale "no", pesi tutti 1; quesiti rari (~15% del mazzo) e segnalati in TV.
- D-014 (provvisoria): 10 votazioni a partita (2-3-3-2), favoriti bilanciati tra i reparti, mazzo da 30 (simulatore) a 40–50 quesiti a strati.
- D-015 (provvisoria): i segreti dal gioco sono marcati "dato ufficiale"; quelli da altri giocatori mostrano solo il mittente diretto.
- Confermate l'architettura (D-003) e la durata 45–60 min + finale (D-017); scelti TypeScript/Vitest/pnpm (D-016) e Svelte per le schermate (D-004).
- Nuovo punto aperto: poteri IT/RU e messaggi anonimi (n. 24).
- Nuove idee da valutare: voto decisivo di Risorse Umane in caso di pareggio (variante del n. 22); numero massimo di demansionati (n. 23); mini-sfide sul telefono (n. 25).

## 2026-11-22 — 0.1.2

### Design
- D-006 (provvisoria): i reparti vacanti non contano nella soglia; l'ordine del giorno privilegia i quesiti dei reparti occupati.
- D-007 (provvisoria): voto solo SÌ/NO e tempo scaduto = no; alcuni quesiti ammettono l'astensione vera (soglia sui soli votanti); mai astensione su demansionamento e promozione.
- D-008 (provvisoria): un ciclo discussione → voto per ogni proposta, in ordine casuale annunciato nel Rapporto.
- D-009 (provvisoria): demansionamento con 1 voto a testa, il bersaglio non vota.
- D-010 (provvisoria): promozione dopo almeno un trimestre intero, solo a voto, nella fase 6 prima del demansionamento.
- D-011 (provvisoria): 1 concorrente da 4 a 7 giocatori, 2 con 8; il concorrente della spia vince se supera l'azienda.
- Nuovi punti aperti: numero di votazioni e mazzo di quesiti (n. 17), idea dei bot giocatori (n. 18), dettagli dell'astensione vera (n. 19), idea del livello di fiducia (n. 20), soglia del demansionamento (n. 21), idea Risorse Umane (n. 22).

## 2026-11-22 — 0.1.1

### Design
- Nuovo principio approvato: pari opportunità tra reparti (D-005); metriche di equità per reparto nel simulatore.

### Aggiunto
- Gioco inserito nella struttura del progetto: regole specifiche, roadmap, registro decisioni, checklist di prova.

## 2026-11-20 — 0.1.0

### Design
- Prima bozza del documento di design e dell'architettura tecnica.
