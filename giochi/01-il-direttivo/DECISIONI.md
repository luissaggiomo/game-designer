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
- Scelta: segreto dal gioco con etichetta **"dato ufficiale del tuo reparto"** *(dal 22/11/2026 "dato certo, arrivato al tuo reparto", D-035)*; segreto da un
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

## D-018 — Cassa aziendale: budget, accumulo e tetto
- Data: 2026-11-22 · Stato: ✅ provvisoria — **da verificare col simulatore**
- Alternative: A) si azzera a ogni trimestre · B) si accumula senza limiti · C) si accumula con un tetto.
- Scelta: **C**. A ogni trimestre arrivano **100 K** (100.000 €), sommati alla cassa avanzata,
  con un **tetto di 150 K** (cassa = minimo tra avanzo + 100 K e 150 K). Gli importi diventano
  in K€ (prima "crediti").
- Indicazione per i contenuti: le proposte di un trimestre, sommate, costano spesso più di 100 K.
- Motivo: rinunciare a investimenti nei primi trimestri dà margine dopo (strategia e argomento
  politico), mentre il tetto evita un T4 in cui passa tutto.
- Da sorvegliare: una spia può spingere a "risparmiare" per bloccare proposte utili (D-005 e spie).
- Verifica col simulatore: cassa media a inizio trimestre; frequenza del tetto raggiunto;
  frequenza di cassa esaurita prima dell'ultimo voto; % approvazione per posizione e per trimestre.
- Rif.: GDD §6 · Architettura §10.3

## D-019 — Quando si vedono i voti
- Data: 2026-11-22 · Stato: ✅ provvisoria — **da verificare nelle serate** (il simulatore misura poco)
- Alternative: A) voti mostrati man mano, definitivi · B) mostrati man mano, modificabili ·
  C) nascosti fino alla chiusura, poi rivelati tutti insieme.
- Scelta: **C**. Durante il voto la TV mostra solo chi ha già votato; voto modificabile fino
  alla chiusura; alla chiusura rivelazione di tutti i voti (resta voto palese).
- Motivo: niente vantaggio per chi vota per ultimo; voto più sincero; spie costrette a esporsi
  "al buio"; ogni chiusura è un momento di scena.
- Verifica nelle serate: voti cambiati, "no" per tempo scaduto, discussione dopo la rivelazione.
- Rif.: GDD §8.5 · Architettura §10.3

## D-020 — Mossa privata: autogestione e scelta predefinita
- Data: 2026-11-22 · Stato: ✅ provvisoria — **da verificare col simulatore**
- Alternative: A) partecipano tutti i reparti in autogestione · B) nessuno · C) solo i reparti dei demansionati.
- Scelta: **C**; inoltre chi non sceglie in tempo gioca **per l'azienda**.
- Motivo: coerente con D-006 (i vacanti non entrano nei conti); evita che con pochi giocatori
  l'azienda riceva una spinta gratuita e il sabotaggio si diluisca (equilibrio per numero di
  giocatori); una spia demansionata non sabota più con la mossa privata; chi si distrae non
  danneggia l'azienda e la distrazione non fa da copertura alla spia.
- Verifica col simulatore: vittorie di onesti e spie per numero di giocatori; deducibilità
  dell'andamento "in calo" per numero di giocatori.
- Rif.: GDD §9 · Architettura §7.4, §10.4, §10.7

## D-021 — Segreti e messaggi: regole di dettaglio
- Data: 2026-11-22 · Stato: ✅ provvisoria — **da verificare col simulatore e nelle serate**
- Scelte:
  - S1: ogni segreto è collegato a una proposta del trimestre e vale se arriva vero al reparto
    utile prima della chiusura di quella votazione (scartato: entro fine trimestre);
  - S2: la TV annuncia il segreto arrivato in tempo **senza dire quale** (si può cambiare dopo
    le simulazioni);
  - S3: messaggi dal Rapporto alla chiusura dell'ultima votazione; in alternativa in tutto il
    trimestre — **parametro** `messaggi.quando`, da valutare giocando;
  - S4: il demansionato non può mandare messaggi anonimi;
  - S5: la spia passa un segreto solo nel trimestre in cui è uscito.
- In aggiunta (applicazione di D-005): fonti dei segreti bilanciate tra i reparti.
- Motivo: urgenza dentro i cicli discussione → voto; meno indizi pubblici sui possessori;
  regole semplici e coerenti con i costi dei messaggi.
- Verifica: % segreti arrivati in tempo per reparto; % segreti usati dalle spie e falsi;
  segreti ricevuti come fonte per reparto; nelle serate, ritmo dei messaggi con le due
  impostazioni di S3.
- Rif.: GDD §10, §11 · Architettura §10.5

## D-022 — Demansionamento, finale e punteggio: regole di dettaglio
- Data: 2026-11-22 · Stato: ✅ provvisoria — **da verificare col simulatore**
- Scelte (tutte come raccomandato):
  - F1: una sola votazione di demansionamento per trimestre; chi è stato bersaglio non può
    essere riproposto nel trimestre successivo; niente demansionamenti nel 4° trimestre;
  - F2: propone un direttore attivo nella fase 6, dopo le promozioni; va al voto la prima proposta;
  - F3: con il demansionamento il ruolo non si rivela, si perdono i segreti del proprio
    reparto, si ha 1 messaggio a trimestre;
  - F4: nel finale si nominano solo membri attivi del direttivo (non se stessi né licenziati);
  - F5: pareggio nella corsa di mercato = non vince nessuno;
  - F6: punteggio per ora senza obiettivi personali, valori del GDD §16 come segnaposto.
- Motivo: limitare l'uso politico del demansionamento e la manipolazione del voto finale da
  parte delle spie; neutralità del pareggio tra onesti e spie.
- Verifica col simulatore: demansionamenti per trimestre e per fazione; onesti fuori dal voto
  finale; frequenza dei pareggi; distribuzione dei punteggi per reparto e fazione.
- Interpretazioni applicate nel motore e approvate da Luis (2026-11-22): chi non risponde alla
  verifica vale "no" (D-007, parametro); chi non nomina non conta; nessuna nomina = nessun
  licenziamento; i demansionati licenziati a fine anno non danno bonus o penalità aggiuntive;
  una spia che fa licenziare una spia rivale prende il bonus "spia rivale".
- Rif.: GDD §13, §15, §16 · Architettura §10.8–10.10

## D-023 — Quesiti costruiti dall'effetto, ruoli assegnati all'estrazione
- Data: 2026-11-22 · Stato: ✅ provvisoria — **da rivalutare dopo le serate di prova** e col simulatore
- Contesto: il primo report del simulatore mostrava squilibri tra reparti dovuti ai quesiti
  segnaposto. Indicazione di Luis: costruire i quesiti partendo dall'effetto, poi attaccare il
  significato per ciascun reparto, così tutti i reparti sono uguali.
- Alternative: A) schemi fissi ruotati nel mazzo (testi solo per i reparti coinvolti) ·
  B) ruoli assegnati al momento dell'estrazione (uguaglianza perfetta, testi per ogni reparto).
- Scelta: **B**. Ogni quesito ha uno schema (ruoli con punti e peso, peso degli altri reparti,
  effetto sull'azienda); all'estrazione i ruoli vanno ai reparti occupati e non in autogestione,
  i migliori ai reparti meno favoriti finora. Testi: frasi su misura del quesito o frasi
  predefinite per reparto (positive/negative/neutre).
- Conseguenze: la parte di D-006 sulla selezione dei quesiti con "vacanti pesanti" e gli strati
  del mazzo di D-014 diventano superflui (i vacanti non ricevono mai ruoli); restano la soglia
  senza vacanti (D-006), la scaletta e il bilanciamento dei favoriti (D-014). Il controllo
  automatico "bilancio per reparto" è garantito dalla costruzione e verificato dai test.
- Punto aperto generato: GDD §20 n. 29 (informazioni di contesto dei reparti).
- Verifica: equità tra reparti nel report del simulatore; nelle serate, se i titoli generici
  rendono il tema meno vivo (in quel caso si valuta il modello A).
- Rif.: GDD §8.2, §8.6 · Architettura §10.2

## D-024 — Prima taratura dopo il secondo report del simulatore
- Data: 2026-11-22 · Stato: ✅ provvisoria — **da verificare col simulatore** (terzo report)
- Scelte di Luis:
  - concorrenti tarati perché l'azienda vinca **circa il 60%** senza spie, con una **soglia di
    circa 2/3** di scelte aziendaliste per vincere; crescita dei concorrenti legata al numero di
    giocatori, con arrotondamento "a probabilità" (niente gradini) — valori dallo studio;
  - forza delle spie: il valore attuale va probabilmente bene; nuovo **benchmark**: vince la spia
    se il suo concorrente supera l'azienda **e** lei non è stata scoperta, altrimenti vincono gli
    onesti; atteso con 4 giocatori e 1 spia **circa 20% spia, 80% onesti**;
  - egoismo: **bonus "l'azienda vince" da +10 a +20** (alternativa A);
  - costi dei quesiti **+35%** (cassa che "morde"), budget e tetto invariati (D-018);
  - segreti con il modello B: fonte e reparto utile scelti alla distribuzione.
- Punto aperto generato: GDD §20 n. 30 (bonus della spia scoperta).
- Verifica: terzo report — vittoria dell'azienda per numero di giocatori, soglia, chi vince
  tra onesti e spie, cooperativi contro egoisti, cassa, segreti per reparto.
- Rif.: GDD §6, §11, §12, §16 · docs/simulazioni/

## D-025 — La spia scoperta non prende il bonus "il suo concorrente vince"
- Data: 2026-11-22 · Stato: ✅ provvisoria — **da verificare col simulatore**
- Scelta di Luis: una spia licenziata ha perso, anche se il suo concorrente supera l'azienda;
  quindi non riceve il bonus del concorrente (resta la penalità per essere stata scoperta).
- Motivo: il punteggio deve dire la stessa cosa del criterio di vittoria per fazione (D-024).
- Effetto: spie (scoperta = sconfitta piena, più incentivo alla prudenza); onesti (scoprire la
  spia conta anche quando l'azienda perde); reparti: nessun effetto, vale per tutti uguale.
- Verifica: nel report, vittorie della spia aggressiva contro quella prudente.
- Rif.: GDD §16, §20 n. 30

## D-026 — Penalità all'onesto licenziato
- Data: 2026-11-22 · Stato: ✅ provvisoria — **da verificare col simulatore**
- Scelta di Luis (alternativa B, tra: A non può vincere · B penalità · C niente): l'onesto
  licenziato prende una penalità in punti, oltre a quella di chi l'ha nominato. Valore
  indicativo −5 (come la spia scoperta), ⚖️ da tarare.
- Vale anche per l'onesto licenziato perché ancora demansionato a fine anno.
- Motivo: chi gioca da egoista deve rischiare qualcosa di concreto se si fa sospettare.
- Effetto: onesti (l'egoismo visibile costa); spie (accusare un onesto lo danneggia due volte,
  quindi depistare rende di più); reparti: nessun effetto, vale per tutti uguale.
- Verifica: nel report, vittorie egoisti contro cooperativi.
- Rif.: GDD §16.2

## D-027 — Demansionato a fine anno = licenziato a tutti gli effetti
- Data: 2026-11-22 · Stato: ✅ provvisoria — **da verificare col simulatore**
- Chiarimento di Luis: chi è ancora demansionato a fine anno non ottiene il rinnovo del
  contratto, quindi è licenziato. Se è una spia: penalità come spia scoperta e bonus agli onesti,
  come se fosse stata nominata (senza punti ai nominatori, perché nessuno l'ha nominata). Se è
  un onesto: penalità di D-026. L'unica via d'uscita è ottenere la promozione all'ultimo turno.
- Effetto: spie (il demansionamento diventa una minaccia piena); onesti (demansionare un sospetto
  è un'accusa che "paga" anche senza la nomina finale); reparti: nessun effetto.
- Verifica: nel report, demansionamenti su spie e punteggio medio delle spie.
- Rif.: GDD §13, §15, §16.2

## D-028 — Decisione finale obbligatoria sui demansionati: promuovere o licenziare
- Data: 2026-11-22 · Stato: ✅ provvisoria — **da verificare col simulatore**
- Scelta di Luis: prima della chiusura, per **ogni** demansionato il direttivo decide
  esplicitamente se promuoverlo o licenziarlo. Così criterio e punti sono unificati con la nomina.
  Sostituisce i punti 1-2 del finale (promozioni finali facoltative + licenziamento automatico).
- Dettagli (proposta approvata): voto palese 1 a testa tra gli attivi, il demansionato non vota,
  metà più uno per promuovere; **pareggio o nessuna risposta = licenziato**; un demansionato alla
  volta (prima chi è fuori da più tempo); chi viene promosso torna attivo e vota sui successivi.
- Punti: chi vota "licenzia" è trattato come chi nomina (spia licenziata: +3 all'onesto, +3 alla
  spia rivale; onesto licenziato: −2 a chi ha votato, +2 alle spie); **chi vota "promuovi" per
  una spia prende la stessa penalità di chi fa licenziare un onesto (−2)**. Restano D-026 e D-027.
- Scelta tecnica di Claude (da confermare): come nella nomina, contano solo i voti espressi; il
  tempo scaduto decide l'esito (licenziato) ma non dà punti né penalità.
- Effetto: spie (il demansionamento porta a un verdetto esplicito; salvare un alleato costa);
  onesti (votare "licenzia" a cuor leggero costa, come una nomina sbagliata); reparti: nessuno.
- Verifica: quanti licenziati con questo voto sono davvero spie; onesti licenziati per partita;
  egoisti contro cooperativi.
- Rif.: GDD §13, §15.1, §16.2 · Architettura §9, §10.9

## D-029 — Revisione del finale: chi vota, tempo scaduto, punti delle accuse, esito nascosto
- Data: 2026-11-22 · Stato: ✅ provvisoria — **da verificare col simulatore**
- Scelte di Luis:
  - **Decisione sui demansionati:** votano tutti, anche demansionati e licenziati, tranne
    l'interessato (eccezione a GDD §15.2, valida solo per questo voto).
  - **Principio generale del tempo scaduto:** conserva lo stato delle cose. Quesiti: no;
    demansionamento e promozione: no; verifica finale: **sì**; nomina: nessuna nomina;
    decisione sui demansionati: **licenzia** (e conta come voto, con i suoi punti). Dove
    l'astensione è ammessa il tempo scaduto vale **astensione** (rivede D-013). La mossa
    privata a tempo scaduto resta "per l'azienda" (D-020).
  - **Punti delle accuse,** uguali per onesti e spie: nomina giusta +5, nomina di un onesto −5;
    voto "licenzia" giusto +3, "licenzia" su un onesto −3, "promuovi" su una spia −3. Una spia
    che accusa la propria alleata: 0. **Nessun bonus alle spie** quando un onesto è licenziato.
    Due soli valori (5 e 3), da tarare insieme mantenendo la simmetria bonus/penalità.
  - **Niente bonus "azienda vince" alla spia** (le converrebbe far vincere l'azienda).
  - **Esito del 4° trimestre nascosto fino al punteggio:** il finale si gioca senza sapere chi
    ha vinto la corsa di mercato. Variante **B** (dopo il quinto report): si nascondono solo i
    numeri (quote, mosse dei concorrenti, andamento dell'azienda); le fughe di notizie si
    annunciano subito senza numeri, perché nascondere tutto toglieva agli onesti gli indizi
    dell'ultimo trimestre (spie scoperte con 4 giocatori: dal 65% al 52%).
  - Valutazione: valgono i punteggi individuali; il criterio per fazione (onesti/spie) serve
    solo a Luis per valutare le simulazioni.
- Effetto: spie (accusare un onesto costa anche a loro; restano prudenti anche a mercato perso,
  perché non sanno l'esito e rischiano −5); onesti (accuse sbagliate costose, ma sbagliare in
  silenzio è possibile non nominando); reparti: nessun effetto.
- Verifica: nomine fatte per partita, spie sopravvissute, onesti licenziati, egoisti contro
  cooperativi; nelle serate, se le accuse costano troppo e nessuno nomina più.
- Rif.: GDD §8.4bis, §15, §16.2 · D-007, D-013, D-020, D-026…D-028

## D-030 — Quesiti: titoli vivi e frasi su misura per ogni reparto
- Data: 2026-11-22 · Stato: ✅ provvisoria — **da verificare nelle serate**
- Alternative: A) titoli generici · B) titoli vivi "a più facce" + frasi su misura per ogni reparto e segno · C) frasi su misura solo per i reparti "naturali".
- Scelta di Luis: **B**. Ogni quesito ha 16 frasi (8 reparti × effetto positivo/negativo); `frasi.json` resta come rete di sicurezza.
- Effetto: reparti uguali per costruzione (D-005); ogni direttore ha una storia credibile da raccontare (o da inventare).
- Dettaglio e schede complete: [docs/contenuti/quesiti.md](docs/contenuti/quesiti.md) · Rif.: GDD §8.2 · D-023

## D-031 — Il titolo non rivela l'effetto sull'azienda
- Data: 2026-11-22 · Stato: ✅ provvisoria — **da verificare nelle serate**
- Alternative: A) titolo "sincero" · B) titolo "a doppia faccia" · C) misto.
- Scelta di Luis: **B**. Ogni titolo deve reggere sia come buona idea sia come spreco: la discussione serve, e un onesto può difendere una proposta egoistica per motivi veri. Cinque titoli cambiati (identificativi interni invariati).
- Rischio residuo: lo schema di effetto è fisso per quesito; dopo molte serate i giocatori possono imparare "titolo → effetto". Possibile rimedio da valutare: schema estratto tra due possibili.
- Rif.: GDD §8.2, §1 (onesti ambigui)

## D-032 — Forma e tono della frase privata
- Data: 2026-11-22 · Stato: ✅ provvisoria (approvata da Luis sul campione)
- Regole: seconda persona; massimo ~85 caratteri; dice cosa succede al tuo reparto e perché; tono ironico aziendale; vale per qualsiasi intensità (il numero lo mostra il telefono); con più vincitori la frase positiva non rivendica l'esclusiva; nessuna frase rivela l'effetto sull'azienda.
- Rif.: GDD §8.2, §19

## D-033 — Frase di spiegazione in TV per l'effetto reale
- Data: 2026-11-22 · Stato: ✅ provvisoria
- Alternative: A) nessuna frase · B) una frase su misura per quesito · C) frasi generiche per tipo di esito.
- Scelta di Luis: **B**. Ai Risultati la TV mostra, per ogni proposta approvata, effetto reale **e** frase di spiegazione ("il computer nasconde i conti, mai il perché"). La frase parla solo dell'azienda, mai di un reparto; il tono segue il numero. Nel 4° trimestre esce al punteggio insieme al numero (D-029), perché il tono rivela il segno.
- Motore: campo `spiegazione` dei quesiti, accodato alla causa dell'evento "effetto della proposta".
- Rif.: GDD §7.2 fase 5, §8.2, §17

## D-034 — Quali quesiti ammettono l'astensione
- Data: 2026-11-22 · Stato: ✅ provvisoria — **da verificare col simulatore**
- Alternative: A) i 5 attuali · B) spostare l'astensione dal Corso al Premio di risultato · C) aggiungere il Premio di risultato mantenendo il Corso.
- Scelta di Luis: **C**. 6 quesiti su 40 (15%), con due motivi legittimi: **coscienza** (Settimana corta, Videosorveglianza, Riunione del lunedì, Codice di abbigliamento, Corso obbligatorio) e **conflitto d'interesse** (Premio di risultato: chi ci guadagna può astenersi "per correttezza", e una spia può fare lo stesso per sembrare corretta).
- Effetto: nel Premio tutti votano con peso 1 (D-013), il vincitore perde il peso 2.
- Rif.: GDD §8.4bis · D-007, D-013

## D-035 — Segreti: titoli "da corridoio" e nuova etichetta
- Data: 2026-11-22 · Stato: ✅ provvisoria — **da verificare nelle serate**
- Alternative: A) notizie "da corridoio aziendale", senza reparti nel titolo · B) nomi dei reparti inseriti al momento · C) segreto agganciato alla proposta collegata.
- Scelta di Luis: **A**. Il segreto distribuito dal gioco porta l'etichetta **"dato certo, arrivato al tuo reparto"** (sostituisce "dato ufficiale del tuo reparto" di D-015).
- Effetto: neutro tra reparti e fazioni; il titolo non dà indizi sulla fonte né sulla votazione collegata.
- Dettaglio e lista completa: [docs/contenuti/segreti.md](docs/contenuti/segreti.md) · Rif.: GDD §11.5 · D-015, D-021, D-024

## D-036 — Valori dei segreti variabili tra le partite, con suggerimenti per falsificare
- Data: 2026-11-22 · Stato: ✅ provvisoria — **da verificare nelle serate**
- Alternative: A) valori fissi · B) 3–4 versioni per segreto · C) valori generati da un intervallo.
- Scelta di Luis: **B**, con **suggerimenti sul telefono**: chi inoltra una copia modificata può scegliere tra i valori possibili di ogni campo (o scriverne uno libero).
- Effetto: chi gioca spesso non impara i valori veri; canarino e falsi restano credibili anche per i principianti.
- Scelta tecnica di Claude: i suggerimenti sono **in ordine alfabetico** (non mescolati) e comprendono il valore della propria copia: l'elenco è identico qualunque sia il valore vero, quindi non lo rivela. Test dedicato.
- Rif.: GDD §11.4

## D-037 — Uno o due campi, dato vero estratto campo per campo
- Data: 2026-11-22 · Stato: ✅ provvisoria — **da verificare nelle serate**
- Alternative: A) sempre un campo · B) uno o due · C) sempre due. Estrazione: A) campo per campo · B) riga intera · C) a scelta.
- Scelte di Luis: **B** (almeno un campo è un numero o una data, per il confronto a voce "a te che cifra è arrivata?") e **estrazione campo per campo**: ogni combinazione dei valori deve avere senso, così un falso "mescolato" è indistinguibile da un vero.
- Effetto: canarino possibile anche a 8 giocatori (fino a 16 combinazioni); neutro tra fazioni.
- Rif.: GDD §11.4

## D-038 — Tipi di segreto "a bilancia" e punti della spia
- Data: 2026-11-22 · Stato: ✅ provvisoria — **numeri ⚖️ da verificare col simulatore**
- Alternative: A) tutti uguali · B) due fasce · C) tre tipi scritti a parole sulla scheda.
- Scelta di Luis: **C**.

  | Tipo (sulla scheda) | Azienda se arriva | Concorrente se esce | Punti alla spia | Segreti |
  |---|---|---|---|---|
  | Da far girare | +2 | +1 | 1 | 11 |
  | Normale | +1 | +2 | 2 | 18 |
  | Da custodire | +1 | +3 | 3 | 7 |

- In aggiunta: la TV dice solo *"Un'informazione è arrivata in tempo al reparto giusto"*, **senza "+N"** (il numero rivelerebbe il tipo; modifica D-021).
- Medie (1,3 per l'azienda, 1,9 per il concorrente, 1,9 punti alla spia) uguali ai vecchi segnaposto: la taratura D-024 dovrebbe restare valida.
- Scelta tecnica di Claude: i valori dei tipi stanno in `config.json` (`segreti.tipi`), non ripetuti su ogni segreto: si tarano in un punto solo.
- Effetto: la spia desidera i "da custodire" e ha motivo di chiederli; il reparto utile li chiede legittimamente (sospetto ambiguo).
- Rif.: GDD §11.5, §16 · D-021, D-024

## D-039 — 36 segreti, legati al periodo, mai due "da custodire" insieme
- Data: 2026-11-22 · Stato: ✅ provvisoria — **da verificare nelle serate**
- Scelta di Luis: **36 segreti**: 28 escono in qualsiasi trimestre, 4 solo a inizio anno (T1–T2), 4 solo a fine anno (T3–T4). Il gioco **non estrae due "da custodire" nello stesso trimestre** (parametro `massimoPerTrimestre`).
- Effetto: in una partita esce poco più di un quinto della lista; meno partite "fortunate" per le spie.
- Rif.: GDD §11.5

## D-045 — Quesiti con due versioni: l'effetto non si impara a memoria
- Data: 2026-11-22 · Stato: ✅ provvisoria — **da verificare col simulatore e nelle serate**
- Contesto: con lo schema fisso per quesito, dopo poche serate i giocatori abituali ricordano quali proposte convengono all'azienda (rischio segnalato in D-031).
- Alternative: A) lasciare così · B) due schemi per quesito, estratti a ogni partita · C) schema fisso con effetto che oscilla di ±1 · D) qualsiasi schema per qualsiasi quesito.
- Scelta di Luis: **B**, con probabilità ⚖️ **50%** (`selezione.probabilitaAlternativa` in config.json).
- Regole: l'alternativa ha un effetto sull'azienda **diverso** (i quesiti "buoni" diventano deboli o dannosi e viceversa) e una **propria frase di spiegazione** (rivede D-033: una frase per versione); nel mazzo ogni schema compare come alternativa tante volte quante come principale, così la media degli effetti non cambia. Titoli, costi, categorie, frasi dei reparti e astensione restano uguali.
- Effetto: chi gioca spesso non ha vantaggi di memoria; la spia non può contare sul ricordo per spingere i quesiti dannosi, e gli onesti esperti non possono smascherare un bluff solo ricordando il titolo. Reparti: nessun effetto (i ruoli restano estratti a caso).
- Tabella delle 40 coppie: [docs/contenuti/quesiti.md](docs/contenuti/quesiti.md) · Rif.: GDD §8.2 · D-023, D-031, D-033

## D-046 — Obiettivi personali: tre proposti, se ne tiene uno; tre tipi con due traguardi
- Data: 2026-11-22 · Stato: ✅ provvisoria — **da verificare col simulatore e nelle serate**
- Contesto: punto aperto 3 (GDD §4.4, §16). Il GDD prevedeva "almeno un obiettivo segreto", con la proposta 🟡 di un facile e un difficile.
- Alternative: A) un solo obiettivo, facile o difficile a caso (scartata: viola D-005) · B) due obiettivi diversi, uno facile e uno difficile · C) due o tre obiettivi proposti, se ne tiene uno · D) un solo obiettivo "a due gradini".
- Scelta di Luis: **C + D**. A inizio partita ogni giocatore riceve **tre obiettivi, uno per tipo**, e **ne tiene uno**. Ogni obiettivo ha due traguardi:

| Tipo | Forma | Traguardo facile | Traguardo difficile | Massimo |
|---|---|---|---|---|
| 1 · Graduale | stesso tema, due soglie ("2 volte… / 4 volte…") | +3 | +5 | +8 |
| 2 · Doppio, facile accessibile | due traguardi diversi | +3 (accessibile) | +7 (impegnativo) | +10 |
| 3 · Doppio, facile più complesso | due traguardi diversi | +4 (un po' più complesso) | +6 (più impegnativo) | +10 |

- Regole: la difficoltà di ogni traguardo è proporzionata ai punti. Nel tipo 1 il secondo gradino comprende il primo; nei tipi 2 e 3 i due traguardi contano ciascuno per conto proprio (si può ottenere anche solo il difficile). Punti ⚖️ in config.json.
- Effetto: pari opportunità per costruzione (D-005: tutti ricevono un obiettivo per tipo); la scelta dà al giocatore un obiettivo "suo" e un dilemma sicuro/rischioso. Da verificare col simulatore che i tre tipi rendano in media in modo simile. Il massimo (+10) resta sotto il bonus aziendale (+20), come vuole il principio di §16; il rapporto si rivede al punto "valore" e nella ritaratura.
- Rif.: GDD §4.4, §16 · D-005, D-022

## D-047 — Obiettivi personali: chi li vede e quando si scoprono
- Data: 2026-11-22 · Stato: ✅ provvisoria — **da verificare nelle serate**
- Contesto: punto aperto 3. Fisso: durante la partita l'obiettivo sta solo sul telefono del proprietario (riservatezza, regola specifica 3).
- Alternative: 2a) avanzamento sul telefono sì / no · 2b) a fine partita A) la TV rivela l'obiettivo scelto e l'esito, B) solo sul proprio telefono, C) come A più i due scartati · 2c) prova dell'obiettivo nell'app no / sì.
- Scelta di Luis: **avanzamento sul telefono sì · rivelazione in TV al punteggio dell'obiettivo scelto e del suo esito (A) · nessuna prova nell'app.**
- Regole: il telefono mostra l'obiettivo scelto e l'avanzamento di ogni traguardo ("2 su 4"). Gli obiettivi scartati non compaiono più da nessuna parte. Al punteggio la TV mostra per ogni giocatore obiettivo, traguardi raggiunti e punti, con una frase. Durante la partita nessuno può dimostrare il proprio obiettivo: si può solo dichiararlo a voce, anche mentendo.
- Effetto: niente conti a memoria (non è un gestionale); l'obiettivo resta una copertura credibile per tutti (onesti ambigui, §1); la rivelazione finale spiega a posteriori i comportamenti strani ("mai nascondere il perché").
- Rif.: GDD §4.4, §15.3, §17 · D-046

## D-048 — Obiettivi personali: quando si ricevono e si sceglie
- Data: 2026-11-22 · Stato: ✅ provvisoria — **da verificare nelle serate**
- Contesto: punto aperto 3. Serve un momento della scelta uguale per tutti (D-005).
- Alternative: 3a) A) prima della partita, dopo le regole · B) entro il Rapporto del T1 · C) più tardi (sconsigliata) — 3b) chi non sceglie: a caso / sempre il tipo 1 — 3c) stesso obiettivo a due giocatori: no / sì.
- Scelta di Luis: **A**, nella sequenza: la TV spiega le regole (si possono saltare), poi ognuno riceve sul telefono le sue tre proposte, e **la partita inizia quando tutti hanno scelto**. **Chi non sceglie in tempo riceve un obiettivo estratto a caso fra i suoi tre.** **Ogni obiettivo compare al massimo una volta** fra tutte le terne della partita.
- Regole: per non bloccare il gruppo c'è comunque un tempo massimo per la scelta (⚖️ in config.json); allo scadere vale l'estrazione a caso. La lista deve avere almeno 8 obiettivi per tipo (8 giocatori). L'avanzamento conta dall'inizio del T1.
- Effetto: tutti scelgono con le stesse informazioni (ruolo e reparto), prima che succeda qualsiasi cosa; nessun vantaggio a non scegliere; nessuna "alleanza naturale" tra due giocatori con lo stesso obiettivo.
- Rif.: GDD §4.4, §7.1 · D-046

## D-049 — Obiettivi personali delle spie: aziendalisti, dallo stesso mazzo
- Data: 2026-11-22 · Stato: ✅ provvisoria — **da verificare col simulatore e nelle serate**
- Contesto: punto aperto 3. Gli onesti hanno un dilemma (reparto contro azienda); la spia finora no: sabota e basta.
- Alternative: A) stesso mazzo e stessi obiettivi degli onesti · B) obiettivi propri delle spie · C) terna mista · D) spie senza obiettivi. Su proposta di Luis, B nella forma "aziendalista": gli obiettivi della spia **favoriscono l'azienda**, contro il suo ruolo. Varianti: B1) liste separate (spie solo aziendalisti, onesti mai) · B2) mazzo unico con una parte aziendalista · B3) come B2 ma 2 aziendalisti + 1 normale.
- Scelta di Luis: **B2**. Il mazzo è unico e contiene una parte di **obiettivi aziendalisti** (che aiutano l'azienda). Gli **onesti** ricevono la terna da tutto il mazzo (aziendalisti compresi); le **spie** ricevono una terna **solo di aziendalisti**, uno per tipo. Punti e schermata identici per tutti.
- Regole: una parte degli aziendalisti deve essere **invisibile** agli altri (es. mossa privata "per l'azienda", segreti arrivati in tempo), perché sono i soli che costano davvero alla spia; quelli **visibili** (es. votare con la maggioranza) le danno anche copertura. Regola gemella del principio di §16, da fissare col valore degli obiettivi: **la vittoria del concorrente deve valere per la spia più di qualsiasi obiettivo**. **4b:** demansionati e licenziati conservano i punti dell'obiettivo (vale per tutti).
- Effetto: anche la spia ha un dilemma (sabotare o prendere punti aiutando l'azienda); dichiarare a voce un obiettivo aziendalista non prova nulla, perché possono averlo anche gli onesti; gli onesti cooperativi ricevono a volte un premio personale per il gioco aziendale (punto 31). Rischio da controllare col simulatore: spie troppo indebolite (ripiego pronto: B3).
- Rif.: GDD §4.1, §4.4, §16 · D-046…D-048, punto 31

## D-050 — Obiettivi personali: tipi ammessi
- Data: 2026-11-22 · Stato: ✅ provvisoria — **da verificare col simulatore e nelle serate**
- Contesto: punto aperto 3. Gli obiettivi devono riferirsi a meccaniche generiche (mai a quesiti o segreti specifici, che cambiano da partita a partita) ed essere verificabili dal computer senza ascoltare la voce.
- Famiglie ammesse (scelta di Luis): **voti sulle proposte · mossa privata · segreti in generale · cassa · demansionamenti e promozioni · finale · messaggi**, questi ultimi **solo con obiettivi "di ricezione"** (la difficoltà dipende dalla fiducia degli altri, es. "ricevi messaggi da almeno 3 giocatori diversi") **o con un costo vero** (es. "un anonimo in tutti e 4 i trimestri"), al massimo 2–3 nella lista. Scartati gli obiettivi sui messaggi che dipendono solo da chi li compie ("manda 2 anonimi", "scrivi a tutti"): non hanno difficoltà.
- Altre scelte: **5b) bersagli solo generici** ("vota sì a un demansionamento", "vota contro chi ha peso 2"), mai un giocatore preciso (scartate: nessun bersaglio; giocatore estratto nei voti; "fai demansionare Marco") · **5c) niente obiettivi sull'esito** (chi vince la corsa, chi è la spia): solo azioni e risultati intermedi · **5d) nessun obiettivo che premi la mossa privata "per il reparto"**, già premiata dai punti di reparto (punto 31); la mossa "per l'azienda" compare solo fra gli aziendalisti.
- Effetto: nessun giocatore è preso di mira personalmente (D-005); il dilemma della spia sta in ciò che fa, non nel risultato; gli obiettivi non peggiorano il vantaggio degli egoisti. Limite: i robot scrivono messaggi in modo rozzo, quindi gli obiettivi sui messaggi si tarano davvero solo nelle serate.
- Rif.: GDD §4.4 · D-046…D-049, punto 31

## D-051 — Obiettivi personali: valore e taratura
- Data: 2026-11-23 · Stato: ✅ provvisoria — **da verificare col simulatore**
- Contesto: punto aperto 3. Con D-046 un obiettivo vale al massimo +10, quanto il bonus della spia "il concorrente vince" (+10): il principio gemello di D-049 sembrava violato.
- Alternative: 6a) A) alzare il bonus della spia (≥ 12) · B) meno punti alle spie per gli stessi obiettivi (scartata: i numeri sul telefono la tradirebbero) · C) lasciare la parità · 6b) si tarano le soglie degli obiettivi, non i punti.
- Scelta di Luis: **6a C**, per ora. Motivo: per la spia non c'è vera parità, perché aiutando l'azienda per l'obiettivo rischia di farla vincere, e allora tutti gli onesti prendono +20 e lei perde il +10; il conto interno resta a favore del ruolo. Si rivede nella ritaratura se il simulatore mostra spie che "fanno le oneste". **6b sì.**
- Regole di taratura (col simulatore): i punti di D-046 restano fissi, si regolano le soglie; traguardo facile raggiunto da circa il 60–70% di chi l'ha scelto, difficile dal 25–35%; i tre tipi rendono in media lo stesso (±1 punto); nessun reparto avvantaggiato (D-005); onesti e spie con resa simile.
- Rif.: GDD §16 · D-046, D-049

## D-052 — Obiettivi personali: la lista e le regole di verifica
- Data: 2026-11-23 · Stato: ✅ provvisoria — **soglie ⚖️ da tarare col simulatore, testi da verificare nelle serate**
- Contesto: punto aperto 3, ultimo passo dopo D-046…D-051.
- Scelta di Luis: approvata la lista di **36 obiettivi, 12 per tipo, di cui 4 aziendalisti per tipo**, e le regole di verifica: **R1** avanzamento rinviato a fine partita quando rivelerebbe un'informazione nascosta (copie vere/false, catena, risultati del 4° trimestre) · **R2** contano solo le scelte del giocatore (non voti scaduti, mosse del computer, astensioni) · **R3** i voti con peso 0 non contano.
- Dettagli tecnici (Claude, senza effetto sulle regole): "voto decisivo" = se avessi votato al contrario l'esito sarebbe stato opposto (con il tempo scaduto che vale "no", "senza il tuo voto" non renderebbe mai decisivo un "no"); R1 vale anche per i mittenti anonimi nei conteggi "da giocatori diversi" e per i conteggi dei messaggi ricevuti dagli altri.
- Lista completa: [docs/contenuti/obiettivi.md](docs/contenuti/obiettivi.md) · dati: `packages/content/obiettivi.json` · Rif.: GDD §4.4 · D-046…D-051

## D-053 — Obiettivi personali: prima ritaratura dopo il nono report
- Data: 2026-11-23 · Stato: ✅ provvisoria — **da verificare col simulatore e nelle serate**
- Contesto: report 09 (prima simulazione con gli obiettivi). Quasi tutti i traguardi erano fuori dagli obiettivi di taratura (D-051); Sentinella faceva aprire nomine anche senza spie (onesti licenziati nel finale quasi raddoppiati: da 0,11–0,28 a 0,21–0,48 a partita); Intoccabile era troppo facile (90% / 70%); in quattro obiettivi il difficile riusciva più spesso del facile.
- Scelte di Luis:
  1. **Soglie** degli obiettivi su voti, cassa e mossa privata ritoccate come proposto (in docs/contenuti/obiettivi.md i valori precedenti sono indicati con "era …").
  2. Obiettivi su **messaggi, segreti e proposte di demansionamento lasciati così**: i robot scrivono e inoltrano meno delle persone, si tarano nelle serate.
  3. **Rimossi Sentinella (3.6) e Intoccabile (2.7).** Restano 34 obiettivi: 12 di tipo 1, 11 di tipo 2 e 11 di tipo 3, sempre 4 aziendalisti per tipo (bastano per 8 giocatori senza ripetizioni, D-048).
  4. **Traguardi invertiti sistemati:** in Voce critica (2.1) e Controcorrente (3.8) facile e difficile si scambiano; in Tesoriere (3.7) il facile passa a 40 K e il difficile diventa "a fine anno almeno 100 K" (la cassa al tetto nell'ultimo trimestre riusciva all'82%); in Squadra (3.9) il difficile passa a 3 trimestri "in crescita".
- Rif.: GDD §4.4 · D-051, D-052 · docs/simulazioni/2026-11-23-simulazione-09.md

## D-054 — Più difficile per il concorrente battere l'azienda (meno vittorie delle spie)
- Data: 2026-11-23 · Stato: ✅ provvisoria — **da verificare col simulatore**
- Contesto: report 09 — la spia vince troppo spesso (4 giocatori e 1 spia: 30%, riferimento 20%; 2 spie: 55–60%). Premessa di Luis: **l'obiettivo di ogni giocatore è vincere personalmente, non far vincere l'azienda**; che l'azienda senza spie vinca spesso non è un problema, perché la competizione tra gli onesti resta accesa e l'esito della corsa si scopre solo alla fine (D-029). L'obiettivo di taratura "senza spie l'azienda vince nel 55–65%" diventa **solo informativo**.
- Prove col simulatore (400 partite per numero di giocatori): crescita dei concorrenti 2,7 → 2,4 → 2,1 abbassa la spia a 4 giocatori solo da 33% a 30% e 29%, perché nelle partite con spia il concorrente avanza soprattutto con i segreti consegnati.
- Alternative: A) solo rallentare la crescita · B) ridurre il valore dei segreti per il concorrente · C) margine di vittoria (il concorrente deve staccare l'azienda di almeno 2) · D) A leggera + B.
- Scelta di Luis: **D** — `concorrenti.crescitaBase` da 2,7 a **2,4** e valore dei segreti per il concorrente da 1 / 2 / 3 a **1 / 1 / 2** (da far girare / normale / da custodire). I punti alla spia per segreto usato restano 1 / 2 / 3 (D-038). ⚖️
- Effetto: colpisce soprattutto lo strumento della spia; si attenua la differenza tra "da far girare" e "normale" per il concorrente (resta per l'azienda e per i punti della spia). Rivede in parte D-038.
- Verifica (report 10, 5000 partite; corretta il 2026-11-23): a parità di semi, con 1 spia il concorrente vince dal 64% (crescita 2,7, D-053) al 55% (D-054) e la spia vince dal 37% al 31%. **L'effetto è proporzionale**: la spia vince circa 6 volte su 10 vittorie del concorrente, perché è scoperta nel 42% dei casi, qualunque sia la forza del concorrente. Rispetto al report 09 il calo sembra minimo perché, togliendo Sentinella (D-053), le spie vengono scoperte meno (licenziate a 5–8 giocatori: da 38–54% a 34–46%): i due effetti si compensano.
- Rif.: GDD §11.5, §12 · D-011, D-024, D-038 · docs/simulazioni/2026-11-23-simulazione-09.md

## D-055 — Obiettivi personali: seconda taratura delle soglie (delegata a Claude)
- Data: 2026-11-23 · Stato: ✅ provvisoria — **da verificare col simulatore e nelle serate**
- Contesto: dopo D-053 i traguardi facili erano quasi tutti a posto, molti difficili troppo duri (~20%) e il tipo 1 rendeva meno degli altri (3,0 punti contro 4,1). Luis ha delegato i ritocchi ("fai le dovute analisi ed applica i ritocchi necessari").
- Metodo: il simulatore registra il valore raggiunto da ogni giocatore su ogni traguardo e suggerisce la soglia intera (o l'importo di cassa) più vicina al 65% di riuscita per il facile e al 30% per il difficile (sezione "Soglie suggerite" del report). Applicato solo a voti, cassa e mossa privata; messaggi, segreti e proposte personali restano alle serate (D-053).
- Ritocchi: Ago della bilancia difficile 5 → 4 · Forbici facile 2 → 3 trimestri · Cassaforte 80 → 120 K · In linea facile 6 → 5 · Occhio clinico 1.11 1/3 (era 2/4) · Voce critica difficile 3 → 2 · Forbici d'oro facile 4 trimestri (tutti), difficile 150 K · Consenso facile 5 → 6 · Tesoriere difficile 100 → 150 K · Squadra 3.9 difficile "in crescita" in tutti i 4 trimestri · Occhio clinico 3.10 facile 2 → 1 · Maggioranza difficile 7 → 8.
- Rif.: GDD §4.4 · D-051, D-053 · docs/contenuti/obiettivi.md

## D-056 — Velocità del concorrente = velocità media dell'azienda al 45% di scelte aziendaliste
- Data: 2026-11-23 · Stato: ✅ provvisoria — **numeri ⚖️ da tarare col simulatore**
- Contesto: l'analisi del report 10 mostra che rendere più difficile la vittoria del concorrente riduce in proporzione le vittorie della spia (circa 6 su 10 vittorie del concorrente sono vittorie della spia). Proposta di Luis: il concorrente deve avanzare quanto l'azienda media, con buone accelerazioni grazie ai segreti veri e forti rallentamenti con quelli falsi.
- Alternative: A) velocità di riferimento fissa, calcolata su un direttivo che fa il 55% di scelte aziendaliste · B) "a specchio": il concorrente copia ogni trimestre la crescita reale dell'azienda (corsa sempre testa a testa, ma gli onesti non sono premiati se giocano bene ed è meno spiegabile).
- Scelta di Luis: **A**, con **segreti veri +1 / +2 / +3** (da far girare / normale / da custodire: si torna ai valori di D-038, rivede D-054) e **segreti falsi −4** (era −2).
- Regola: crescita del concorrente a trimestre = **parte dei giocatori** (numero di giocatori × effetto medio della mossa privata se il 55% sceglie "per l'azienda": con i valori attuali 0,55 × (+1) + 0,45 × (−1) = +0,1 a testa) **+ parte fissa** (effetto medio, per trimestre, delle proposte approvate e dei segreti arrivati in tempo, misurato col simulatore) **+ evento casuale**, più i segreti ricevuti dalle spie. Parametri in config.json: `concorrenti.quotaAziendalistaRiferimento` (**0,45** ⚖️, scelta di Luis dopo le prove; proposta iniziale 0,55) e `concorrenti.crescitaMediaProposteESegreti` (⚖️, dal simulatore); sostituiscono `crescitaBase` e `crescitaPerGiocatore`.
- Dettagli tecnici (Claude): la parte fissa misurata col simulatore vale **2,93** a trimestre (750 partite senza spie; una prima misura su 175 partite dava 3,06); l'evento casuale del concorrente passa da −1 / 0 / +1 / +2 a **−1 / 0 / +1**, perché valeva in media +0,5 a suo favore, un vantaggio nascosto incompatibile con "cresce con la velocità media dell'azienda".
- Taratura della quota (prove da 400 partite per numero di giocatori): 55% → spia vincente 34% con una spia, 56–58% con due; 50% → 29% e 47–49%; 45% → 23% e 40%. Scelta di Luis: **45%**, la più vicina al riferimento del 20%.
- Verifica (report 11, 5000 partite): spia vincente con una spia **23 / 25 / 22 / 23 / 15%** (4…8 giocatori; report 10: 28–35%), con due spie 39% alleate / 34% rivali (era 57 / 53%); spie scoperte invariate (35–58%); azienda senza spie 71–86% (solo informativo); soglia stimata 55%. Punteggi: cooperativi 21,1 / egoisti 18,0 (vittorie 15 / 20%), spie prudenti 17% e aggressive 28% di vittorie.
- Effetto atteso: senza spie l'azienda batte il concorrente se il direttivo gioca per l'azienda più del 45% delle volte; con una spia il risultato dipende soprattutto dai segreti, e un segreto falso costa caro al concorrente (trappola del canarino più forte).
- Rif.: GDD §11.5, §12 · D-011, D-038, D-054 · punto aperto 4
