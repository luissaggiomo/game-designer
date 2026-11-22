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
