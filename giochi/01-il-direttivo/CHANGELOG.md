# Il Direttivo — Changelog

Voci più recenti in alto. Categorie: **Design** (regole), **Aggiunto**, **Modificato**, **Corretto**, **Rimosso**.
Versioni nel formato `0.FASE.N` finché il gioco non è completo.

## 2026-11-22 — 0.2.10

### Design
- D-029 (provvisoria): revisione del finale — nella decisione sui demansionati votano tutti tranne l'interessato; il tempo scaduto conserva lo stato delle cose (alla verifica vale "sì", nei quesiti con astensione vale astensione); accuse con due soli valori simmetrici (nomina ±5, voto ±3) uguali per onesti e spie, nessun bonus alle spie per un onesto licenziato; i risultati del 4° trimestre si scoprono solo al punteggio.

### Modificato
- Motore e robot adeguati a D-029; test del finale aggiornati (135 test).
- Variante B dell'esito nascosto: nel 4° trimestre si nascondono solo i numeri del mercato; le fughe di notizie si annunciano subito, senza numeri.

### Aggiunto
- Quinto report (docs/simulazioni/2026-11-22-simulazione-05.md): con l'esito del 4° trimestre nascosto le spie vengono scoperte meno (con 4 giocatori dal 65% al 52%), perché anche gli indizi dell'ultimo trimestre (segreti finiti al concorrente) arrivano dopo il finale.

## 2026-11-22 — 0.2.9

### Design
- D-024 (provvisoria): bonus "l'azienda batte i concorrenti" da +10 a +20; costi dei quesiti +35%; segreti con fonte e reparto utile scelti alla distribuzione; nuovo criterio di vittoria per fazione (vince la spia solo se il suo concorrente vince e lei non è scoperta).
- Nuovo punto aperto: la spia scoperta conserva il bonus "concorrente vince"? (n. 30).
- Nuovo punto aperto 31: gli onesti egoisti vincono più dei cooperativi (23% contro 9%); per ora si lascia così e si osserva nelle serate (scelta C di Luis).
- D-025 (provvisoria): la spia licenziata non prende il bonus "il suo concorrente vince" (punto 30 chiuso).
- D-026 (provvisoria): anche l'onesto licenziato prende una penalità (−5 indicativo), così l'egoismo ha un rischio concreto.
- D-027 (provvisoria): la spia ancora demansionata a fine anno è licenziata a tutti gli effetti (penalità a lei, bonus agli onesti).
- D-028 (provvisoria): nel finale, per ogni demansionato, voto obbligatorio "promuovere o licenziare?" (pareggio o nessuna risposta = licenziato); chi vota "licenzia" prende i punti della nomina, chi vota "promuovi" per una spia paga come chi fa licenziare un onesto. Sostituisce "promozioni finali" + "licenziamento automatico".

### Modificato (taratura)
- Concorrenti: crescita 2,7 + 0,1 × giocatori (studio 04 e prova di controllo su 2000 partite: con 2,85 l'azienda vinceva circa il 57% senza spie; 2,7 punta al 59–60%, simile da 4 a 8 giocatori).
- Studi 03 e 04 sui concorrenti e quarto report (docs/simulazioni/2026-11-22-studio-concorrenti-03.md, -04.md, 2026-11-22-simulazione-04.md).
- Test del simulatore: tempo massimo portato a 30 s (le partite complete in parallelo superavano i 5 s).

### Modificato
- Crescita dei concorrenti con arrotondamento casuale (niente più salti a gradini tra un numero di giocatori e l'altro); taratura provvisoria 2,25 + 0,2 × giocatori.

### Aggiunto
- Simulatore: tabella "chi vince tra onesti e spie".
- Secondo studio sui concorrenti e terzo report (docs/simulazioni/2026-11-22-studio-concorrenti-02.md, docs/simulazioni/2026-11-22-simulazione-03.md).

## 2026-11-22 — 0.2.8

### Design
- D-023 (provvisoria): quesiti costruiti dall'effetto; i ruoli si assegnano ai reparti al momento dell'estrazione (uguaglianza per costruzione).
- Nuovo punto aperto: informazioni di contesto dei reparti con i quesiti generici (n. 29).

### Aggiunto
- Nuovo mazzo: 40 quesiti con 7 schemi di effetto, frasi predefinite per reparto (titoli e frasi provvisori).
- Simulatore: misura delle scelte aziendaliste e della soglia di vittoria; modalità "studio" per tarare i concorrenti.
- Studio di taratura (docs/simulazioni/2026-11-22-studio-concorrenti.md) e secondo report (docs/simulazioni/2026-11-22-simulazione-02.md).

### Modificato
- Concorrenti più forti, con crescita legata al numero di giocatori (taratura provvisoria: 2 + 0,25 × giocatori).
- Rimossa la tabella dei pesi per categoria (superata dagli schemi).

## 2026-11-22 — 0.2.7

### Aggiunto
- Simulatore: robot con 4 profili (onesto cooperativo, onesto egoista, spia prudente, spia aggressiva) che decidono vedendo solo la propria vista; partite complete riproducibili; report con avvisi automatici e dati in CSV.
- Primo report (5000 partite): docs/simulazioni/2026-11-22-simulazione-01.md. 11 avvisi: azienda troppo forte, squilibri tra reparti (dovuti ai contenuti segnaposto), egoismo troppo conveniente.
- 126 test automatici.

## 2026-11-22 — 0.2.6

### Aggiunto
- Viste filtrate: una vista per la TV e una per ogni giocatore, con solo ciò che ciascuno può vedere; filtro degli eventi riservati.
- Test di riservatezza obbligatorio: centinaia di partite con azioni casuali (4–8 giocatori), controllo di tutte le viste e di tutti gli eventi a ogni passo. Verificato che scatta se si introduce una fuga di dati.
- Dalla fase del punteggio tutti i ruoli diventano visibili; nella lettura finale si vedono tutti i messaggi, compresi mittenti degli anonimi e segreti falsi.
- 122 test automatici.

## 2026-11-22 — 0.2.5

### Aggiunto
- Promozioni e demansionamenti: proposta pubblica, voto 1 a testa (il bersaglio non vota), voti rivelati alla chiusura, limiti di D-022, perdita dei segreti del reparto, ruolo non rivelato.
- Finale completo: promozioni finali, licenziamento dei demansionati con ruolo rivelato, domanda di verifica, nomina segreta con rivelazione una alla volta, ballottaggio, secondo giro con 8 giocatori.
- Punteggio finale con ogni voce spiegata (senza obiettivi personali per ora) e classifica. Valori segnaposto in config.json.
- 116 test automatici.

### Design
- D-022 (provvisoria): limiti al demansionamento, chi si può nominare nel finale, pareggio nella corsa di mercato, punteggio senza obiettivi.

## 2026-11-22 — 0.2.4

### Aggiunto
- Segreti: distribuzione alla fonte come "dato ufficiale", fonti bilanciate tra i reparti, inoltro (anche modificato = copia falsa), valore per l'azienda se arrivano in tempo, uso da parte delle spie con effetti ai Risultati.
- Messaggi privati: quota per trimestre, anonimi (costano 2, vietati ai demansionati), testo libero di massimo 80 caratteri, fasi ammesse regolabili.
- Eventi riservati: gli avvisi privati (segreto ricevuto, messaggio, consegna al concorrente) vanno solo al diretto interessato.
- Mazzo segnaposto di 10 segreti. 97 test automatici.

### Design
- D-020 e D-021 (provvisorie): mossa privata in autogestione solo per i demansionati; regole di dettaglio di segreti e messaggi.

## 2026-11-22 — 0.2.3

### Aggiunto
- Voti nascosti fino alla chiusura e poi rivelati tutti insieme (D-019).
- Mossa privata: scelta segreta, modificabile fino alla chiusura; la TV vede solo "in calo / stabile / in crescita".
- Risultati del trimestre: effetti delle proposte approvate (punti di reparto privati, effetto reale sull'azienda pubblico), effetti ridotti per i reparti in autogestione, avanzamento dei concorrenti (segnaposto), corsa di mercato.
- 79 test automatici.

### Design
- D-020 (provvisoria): la mossa privata automatica la fa solo il reparto di un demansionato, non i vacanti; chi non sceglie in tempo gioca per l'azienda.

## 2026-11-22 — 0.2.2

### Aggiunto
- Regole della votazione pesata: soglia, pareggio, demansionati, vacanti, astensione vera, tempo scaduto = no, controllo della cassa; ogni esito spiegato in una frase.
- Cassa: 100 K a trimestre con tetto 150 K (D-018).
- Estrazione dell'ordine del giorno: niente quesiti di reparti in autogestione, vacanti pesanti rari, categorie varie, favoriti bilanciati, ordine annunciato nel Rapporto.
- Mazzo segnaposto di 16 quesiti e tabella dei pesi segnaposto (da sostituire con i contenuti veri, punto aperto 1). Un quesito può avere pesi propri.
- 67 test automatici.

### Design
- D-019 (provvisoria): durante il voto si vede solo chi ha già votato; voto modificabile; tutti i voti rivelati alla chiusura.

## 2026-11-22 — 0.2.1

### Aggiunto
- Impianto del codice: pacchetto del motore (`packages/engine`) e dei contenuti (`packages/content`), controllo dei tipi e test automatici.
- Generatore casuale con seme (stessa partita a parità di seme) e file dei parametri `config.json`, controllato all'avvio.
- Primi 13 test automatici (generatore casuale, validità dei parametri).
- Motore: stato della partita, creazione con assegnazione segreta di reparti, spie e concorrenti (4–8 giocatori), scaletta delle fasi con i cicli discussione → voto e la scaletta 2-3-3-2. 42 test automatici.
- Parametri segnaposto in config.json: ordine dei reparti aggiuntivi (punto aperto 7) e probabilità delle spie con 8 giocatori.

### Design
- D-018 (provvisoria): cassa di 100 K a trimestre, l'avanzo si accumula fino a un tetto di 150 K.

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
