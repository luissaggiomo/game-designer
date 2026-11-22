# Il Direttivo — Registro delle decisioni

Come un verbale: ogni decisione è numerata e non si cancella. Se cambia, se ne aggiunge
una nuova che la sostituisce. Le decisioni di dettaglio sulle regole restano marcate
nel GDD; qui si registrano quelle prese esplicitamente, con le alternative valutate.

Modello di voce:

```
## D-NNN — Titolo
- Data: AAAA-MM-GG · Stato: ✅ decisa / 🟡 proposta / ❌ superata da D-XXX
- Contesto · Alternative · Scelta · Motivo · Rif.
```

---

## D-001 — Ambientazione unica: azienda
- Data: 2026-11-20 · Stato: ✅
- Scelta: si parte con un'unica ambientazione aziendale; le alternative (fantascienza, politica) sono rinviate.
- Rif.: GDD §3

## D-002 — Sviluppo in due fasi: locale, poi online
- Data: 2026-11-20 · Stato: ✅
- Scelta: prima una TV e tutti nella stessa stanza (voce dal vivo); poi più case con audio integrato.
- Rif.: GDD §2, §18

## D-003 — Architettura: server autorevole, motore puro, viste filtrate
- Data: 2026-11-20 · Stato: ✅ confermata da Luis il 2026-11-22
- Rif.: Architettura §2, §3

## D-005 — Pari opportunità tra reparti
- Data: 2026-11-22 · Stato: ✅
- Scelta: ogni giocatore, a prescindere dal reparto, deve avere le stesse possibilità e
  opportunità. Tutte le decisioni su regole e numeri sono calibrate e verificate con test
  e simulazioni (metriche per reparto nel simulatore).
- Rif.: GDD §1, Architettura §14

## D-004 — Libreria per l'interfaccia: Svelte o React
- Data: 2026-11-22 · Stato: ✅ (scelta delegata a Claude da Luis)
- Alternative: A) Svelte — più leggero e semplice da leggere. B) React — più diffuso, più esempi in rete.
- Scelta: **Svelte** (con Vite).
- Motivo: Svelte compila in JavaScript semplice senza una grossa libreria da scaricare, quindi
  pacchetti più piccoli e meno lavoro per il processore: conta su smart TV, chiavette e
  telefoni economici. La maggiore diffusione di React conta poco, perché il codice lo scrive Claude.
- Controindicazioni e rimedi: la compatibilità con i browser datati delle smart TV dipende
  soprattutto dall'obiettivo di compilazione (vale per Svelte e React): per il client TV si
  compila per browser datati (es. ES2017, eventuale plugin "legacy" di Vite); Socket.IO ripiega
  sul long-polling se il WebSocket manca; la TV consigliata resta il portatile via HDMI.
  Prova obbligatoria su dispositivi reali (smart TV, chiavetta, iPhone, Android) in fase 3.
- Rif.: Architettura §5

## D-006 — Peso dei reparti vacanti nella soglia
- Data: 2026-11-22 · Stato: ✅ provvisoria — **da verificare col simulatore**
- Contesto: con meno di 8 giocatori alcuni reparti sono vacanti; se il loro peso contasse
  nella soglia, alcune categorie di voto diventerebbero inapprovabili.
- Alternative: A) i vacanti non contano · B) contano come i demansionati (un "no" fisso) ·
  C) il computer vota per loro secondo il loro interesse.
- Scelta: **A**. La soglia si calcola sui reparti occupati, demansionati compresi.
  In aggiunta (indicazione di Luis): l'estrattore dell'ordine del giorno privilegia i
  quesiti che riguardano i reparti occupati e scarta quelli con molti vacanti o in cui i
  vacanti avrebbero peso rilevante; il mazzo va costruito perché questi casi siano rari.
- Motivo: proposte sempre approvabili; nessun reparto penalizzato in modo fisso (D-005);
  coerente con §8.3 (il vacante non vota) e con il costo del demansionamento (§8.4);
  il "no" di una spia resta visibile e decisivo, quindi deducibile.
- Verifica col simulatore: % di proposte approvate per categoria e per numero di giocatori;
  quota di votazioni decise da un solo reparto, per reparto; peso di voto disponibile
  nell'anno per reparto; frequenza di estrazione di quesiti con vacanti pesanti.
- Punti aperti generati: GDD §20 n. 17 (numero di votazioni e mazzo), n. 18 (idea bot).
- Rif.: GDD §8.4, §8.6, §14 · Architettura §10.2, §10.3

## D-007 — Astensione
- Data: 2026-11-22 · Stato: ✅ provvisoria — **da verificare col simulatore**
- Contesto: con la soglia sul peso totale (§8.4) ogni non-sì equivale a un no; restava da
  decidere cosa offre il telefono e cosa vale il tempo scaduto.
- Alternative: A) solo SÌ/NO, tempo scaduto = no · B) tasto "mi astengo" che conta come no ·
  C) astensione vera, che toglie il peso dell'astenuto dalla soglia.
- Scelta: **A come regola normale**, anche per demansionamento e promozione.
  Eccezione (indicazione di Luis): alcuni quesiti, marcati nel mazzo, ammettono
  l'**astensione vera** (C): compare il tasto "Mi astengo" e la soglia si calcola solo sul
  peso dei votanti. Nei voti di demansionamento e promozione l'astensione non esiste mai.
- Motivo: regola base semplicissima che obbliga a esporsi; l'eccezione crea momenti
  speciali e varietà, limitati ai quesiti scelti.
- Attenzione (equità, D-005): nei quesiti con astensione vera un reparto di peso 2 che si
  astiene sposta la soglia più di uno di peso 1. Da sorvegliare.
- Verifica col simulatore: % di approvazione dei quesiti con astensione rispetto agli altri;
  frequenza di astensione per fazione e per reparto (peso 2 vs peso 1); quota di votazioni
  decise dall'astensione di un singolo reparto; frequenza di "no per tempo scaduto".
- Punti aperti generati: GDD §20 n. 19 (dettagli dell'astensione vera), n. 20 (idea fiducia).
- Rif.: GDD §8.4bis · Architettura §7.4, §10.3, §10.8, §13.1

## D-008 — Ordine delle fasi del trimestre
- Data: 2026-11-22 · Stato: ✅ provvisoria — **da verificare col simulatore**
- Contesto: 2–3 proposte per trimestre; ogni approvazione consuma cassa.
- Alternative: A) discussione unica, poi tutti i voti · B) un ciclo discussione → voto per
  proposta · C) ibrido (discussione generale + mini-cicli).
- Scelta: **B**, con **ordine delle proposte casuale e annunciato nel Rapporto**.
  La quota messaggi resta per trimestre (ognuno sceglie in quale ciclo spenderla).
- Motivo: discussioni concentrate; ogni voto palese alimenta la discussione successiva
  (più deduzione, spie più esposte); i "pacchetti" restano possibili perché tutte le
  proposte sono note dal Rapporto; l'ordine annunciato permette di pianificare la cassa.
- Attenzione (equità, D-005): rischio che l'ultima proposta resti senza cassa e penalizzi
  il reparto che ne beneficia.
- Verifica col simulatore: % di approvazione per posizione (1ª/2ª/3ª) e per reparto
  beneficiario; frequenza di cassa esaurita prima dell'ultimo voto; durata stimata del
  trimestre (obiettivo 10–12 min); frequenza di "no per tempo scaduto".
- Rif.: GDD §7.2 · Architettura §9

## D-009 — Voto di demansionamento
- Data: 2026-11-22 · Stato: ✅ provvisoria — **da verificare col simulatore**
- Alternative: A) 1 voto a testa · B) pesi di reparto (es. categoria "Personale").
- Scelta: **A**, 1 a testa tra i direttori attivi; **il bersaglio non vota** sul proprio
  demansionamento. Solo SÌ/NO, tempo scaduto = no (D-007).
- Motivo: è un giudizio sulla persona, non sul reparto; coerente con il finale (§15.2);
  nessun reparto "giudice" (D-005); con i pesi, una spia in un reparto di peso 2 potrebbe
  demansionare onesti con pochi complici.
- Verifica col simulatore: frequenza di demansionamento per reparto (uniforme); % spie vs
  onesti demansionati; onesti demansionati per errore; demansionamenti decisi dal voto delle spie.
- Punti aperti generati: GDD §20 n. 21 (soglia e pareggio), n. 22 (idea Risorse Umane, che
  se adottata modificherebbe questa decisione).
- Rif.: GDD §13.4 · Architettura §10.8

## D-010 — Promozione: durata minima e modalità
- Data: 2026-11-22 · Stato: ✅ provvisoria — **da verificare col simulatore**
- Alternative: A) solo a voto, senza durata minima · B) un trimestre intero minimo, poi a
  voto · C) ritorno automatico dopo N trimestri.
- Scelta: **B**. Modalità: voto nella fase 6 prima dell'eventuale demansionamento; proposta
  da un attivo o richiesta dal demansionato; 1 a testa tra gli attivi (il demansionato non
  vota); solo SÌ/NO, tempo scaduto = no; soglia come il demansionamento (punto aperto 21);
  max una richiesta di promozione a trimestre per persona.
- Motivo: il demansionamento costa ma resta rimediabile; il trimestre minimo permette di
  osservare se le fughe di notizie si fermano (§13.2); A e C favorirebbero le spie.
- Nota: con il tempo scaduto = no (D-007), un gruppo distratto lascia fuori il demansionato
  (effetto accettato).
- Verifica col simulatore: durata media dei demansionamenti; % onesti promossi prima della
  fine; % spie promosse; licenziati di fine anno per fazione; punti persi in autogestione
  per reparto; fughe di notizie prima/dopo il demansionamento di una spia.
- Rif.: GDD §13.4 · Architettura §10.8

## D-011 — Numero di concorrenti e vittoria del concorrente
- Data: 2026-11-22 · Stato: ✅ provvisoria — **da verificare col simulatore**
- Alternative: A) 1 concorrente da 4 a 7 giocatori, 2 con 8 · B) sempre 2 · C) 2 solo se
  escono 2 spie rivali (scartata: svela un segreto) · D) sempre 1 (elimina la rivalità tra spie).
- Scelta: **A**. Inoltre (indicazione di Luis): **il concorrente di una spia vince se supera
  l'azienda**, senza dover battere anche l'altro concorrente.
- Motivo: il numero di concorrenti dipende solo da N e non rivela nulla sulle spie;
  mantiene la rivalità tra spie (§4.3); a 8 giocatori il concorrente senza spia confonde le piste.
- Conseguenza: con due spie rivali possono vincere entrambe; l'azienda vince solo se le supera tutte.
- Verifica col simulatore: % vittoria onesti per N (obiettivo senza spie 55–65%); vittorie
  delle spie per configurazione a 8 (0/1/2 spie, alleate o rivali); frequenza di vittoria del
  concorrente senza spia; frequenza di doppia vittoria di spie rivali; utilità del Marketing per N.
- Rif.: GDD §12, §16 · Architettura §10.1, §10.10

## D-012 — Soglia del voto di demansionamento e promozione
- Data: 2026-11-22 · Stato: ✅ provvisoria — **da verificare col simulatore**
- Contesto: senza astensione e con il tempo scaduto = no (D-007), aventi diritto e votanti
  coincidono; restava da scegliere la maggioranza. Le alternative differiscono solo a 6 e 8 giocatori.
- Alternative: A) metà più uno · B) due terzi · C) demansionamento ai 2/3, promozione a metà più uno.
- Scelta: **A**, per demansionamento e promozione; **pareggio = non passa**.
- Motivo: regola unica e uguale a quella delle proposte (§8.4); il voto palese scoraggia l'abuso.
- Da sorvegliare: effetto "valanga" (ogni demansionato esce dal conteggio e abbassa la soglia
  del demansionamento successivo).
- Verifica col simulatore, per numero di giocatori: frequenza dei demansionamenti; onesti
  demansionati per errore; spie demansionate; promozioni riuscite; frequenza di 2+ demansionati
  contemporanei.
- Idee collegate (da valutare): voto decisivo di Risorse Umane in caso di pareggio (n. 22);
  numero massimo di demansionati contemporanei (n. 23).
- Rif.: GDD §13.4 · Architettura §10.8

## D-013 — Quesiti con astensione vera: dettagli
- Data: 2026-11-22 · Stato: ✅ provvisoria — **da verificare col simulatore**
- Contesto: completa D-007 (punto aperto 19).
- Scelte:
  - peso dei demansionati: **conta come un "no" fisso** (alternativa scartata: escluderlo,
    che avrebbe reso gratuito il demansionamento in questi quesiti);
  - tempo scaduto: **"no"**, come ovunque (scartata: astensione automatica);
  - frequenza e tema: **rari** (⚖️ ~15% del mazzo, 1–2 per partita), segnalati in TV con
    "⚖️ Astensione ammessa", su temi di coscienza o conflitto di interessi;
  - **pesi tutti 1** per i reparti occupati in questi quesiti ("votazione del consiglio").
- Motivo: il demansionamento resta costoso ovunque (§8.4); una sola regola sul tempo; i pesi
  uguali eliminano lo squilibrio segnalato in D-007 (D-005); gli onesti hanno un motivo
  legittimo in più per sembrare ambigui.
- Verifica col simulatore: % di approvazione dei quesiti con astensione rispetto agli altri;
  frequenza di astensione per fazione e per reparto; quota di esiti decisi da un'astensione;
  frequenza reale per partita; confronto con e senza "pesi tutti 1".
- Rif.: GDD §8.4bis · Architettura §7.4, §10.3

## D-014 — Numero di votazioni, bilanciamento dei favoriti, mazzo di quesiti
- Data: 2026-11-22 · Stato: ✅ provvisoria — **da verificare col simulatore**
- Contesto: punto aperto 17, nato da D-006.
- Scelte:
  - votazioni: **scaletta 2-3-3-2** (T1-T4, 10 a partita), nota in anticipo
    (scartate: 3 fisse, troppo lunghe; 2 fisse, poche occasioni per i reparti);
  - **bilanciamento dei favoriti**: ogni reparto occupato favorito in un numero simile di
    quesiti, tolleranza ±1;
  - **mazzo**: 30 quesiti (simulatore), 40–50 (serate); a strati ~60% base, ~25% con
    Finanza, ~15% reparti aggiuntivi.
- Motivo: ritmo (T1 di apprendimento, T4 leggero prima del finale); pari opportunità
  applicata all'ordine del giorno (D-005); la selezione di D-006 funziona anche a 4 giocatori.
- Verifica col simulatore: quesiti estraibili per numero di giocatori (≥ 2× il necessario);
  frequenza di quesiti con vacanti pesanti; volte in cui ogni reparto è favorito; durata
  stimata del trimestre; ripetizioni tra partite consecutive.
- Rif.: GDD §8.6 · Architettura §10.2

## D-015 — Provenienza visibile dei segreti
- Data: 2026-11-22 · Stato: ✅ provvisoria — **da verificare col simulatore**
- Alternative (segreto ricevuto da un giocatore): A) solo il mittente diretto ·
  B) mittente + "di prima / seconda mano" · C) catena completa (scartata: distrugge la deduzione).
- Scelta: segreto dal gioco con etichetta **"dato ufficiale del tuo reparto"**; segreto da un
  giocatore con **solo il mittente diretto** (o "anonimo"); la catena resta solo sul server.
- Motivo: la fonte deve conoscere il valore vero per falsificare e usare il canarino; la
  massima ambiguità sui passaggi alimenta il dilemma "ci si può fidare?"; B darebbe ai reparti
  fonte un vantaggio strutturale di credibilità (D-005) e indicherebbe le fonti alla spia.
- Verifica col simulatore: % segreti veri arrivati al reparto giusto in tempo; % segreti
  falsi passati ai concorrenti; spie scoperte col canarino (robot "onesto canarino"); segreti
  ricevuti e valore prodotto per reparto. La credibilità a voce va verificata nelle serate.
- Punto aperto generato: GDD §20 n. 24 (poteri IT/RU e messaggi anonimi).
- Rif.: GDD §11.5 · Architettura §8, §10.5

## D-016 — Stack del motore e del simulatore
- Data: 2026-11-22 · Stato: ✅
- Scelta: TypeScript, Vitest (test), pnpm workspaces (pacchetti nello stesso archivio).
  Server (Node.js) e tempo reale (Socket.IO) restano 🟡, da confermare in fase 3.
- Rif.: Architettura §5

## D-017 — Durata della partita
- Data: 2026-11-22 · Stato: ✅ (da verificare col simulatore e nelle serate)
- Scelta: circa 45–60 minuti più il finale.
- Indicazione di Luis: se dura un'ora, la priorità è che non sia noioso né ripetitivo.
- Verifica: durata stimata dal simulatore (scaletta 2-3-3-2, timer); nelle serate, momenti
  di calo d'attenzione e ripetitività (scheda di playtest).
- Idea collegata (da valutare, sviluppo successivo): mini-sfide sul telefono, GDD §20 n. 25.
- Rif.: GDD §1
