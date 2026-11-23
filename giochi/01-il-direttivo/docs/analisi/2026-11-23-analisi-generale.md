# Il Direttivo — Analisi generale del gioco

> 23 novembre 2026 · dopo D-056 e l'undicesimo report del simulatore.
> Analisi di Claude su tutte le regole in vigore (GDD, D-001…D-056, quesiti, segreti, obiettivi).
> È un parere, non una decisione: ogni proposta va scelta da Luis.

## In breve

Il gioco ha un **cuore buono e originale**: ognuno vede una verità diversa, la racconta come vuole e a fine trimestre la TV smentisce i bugiardi. I segreti che si possono falsificare sono un'idea vera, che un gioco da tavolo non può copiare.

Però oggi ci sono **tre problemi seri**:

1. **Non l'ha ancora giocato nessuno.** Abbiamo 56 decisioni e 11 report del simulatore, ma nessuna serata. Il simulatore misura i numeri, non il divertimento.
2. **Le regole sono troppe e piene di eccezioni.** Spiegarle in 3 minuti, come vorrebbe l'obiettivo del GDD, oggi non è realistico.
3. **Diverse meccaniche costano regole ma cambiano poco la partita:** la cassa, gli effetti privati in punti, il demansionamento a metà partita. Al contrario, alcuni strumenti per sospettare sono più deboli di quanto sembra.

Il gioco non è da rifare. È da **sfoltire**, rendendo più forti i pochi punti in cui nasce il sospetto.

---

## 1. Cosa funziona davvero

**L'effetto privato con la verifica a fine trimestre.** È il meccanismo migliore del gioco. Prima del voto ognuno sa solo cosa succede al proprio reparto e lo racconta, anche mentendo. Ai Risultati la TV mostra l'effetto sull'azienda e la frase che lo spiega. Gli schemi sono pochi (un reparto guadagna molto e due perdono poco, eccetera), quindi chi ascolta bene può accorgersi che due persone hanno detto "+3" dove ce n'era uno solo. È deduzione vera, nata dalla discussione, senza regole in più.

**I segreti falsificabili e la trappola del canarino.** Una copia passata a mano non si può verificare. Chi riceve un dato non sa se è vero, e la fuga di notizie annunciata in TV ("un'informazione è finita al concorrente: «titolo»") restringe i sospetti a chi l'aveva. Chi è fonte di un segreto e l'ha dato a una sola persona, se quel segreto esce, *sa* chi è stato. Lo può gridare al tavolo, ma gli altri non sanno se credergli. Questa è esattamente la scena che vogliamo.

**La spia si confonde con l'egoista.** La mossa privata mostra solo "in calo / stabile / in crescita", quindi un sabotaggio e un egoismo onesto sono indistinguibili. È l'ambiguità voluta, e regge.

**Il finale senza conoscere il risultato della corsa.** Nel finale nessuno sa ancora chi ha vinto la corsa di mercato, quindi la spia deve bluffare fino all'ultimo. Gli onesti accusano senza sapere se serve.

**La lettura finale dei messaggi.** Non costa regole e genera il racconto del dopo partita ("mi avevi scritto che ti fidavi di me!"). Probabilmente sarà uno dei momenti più divertenti.

**Gli obiettivi personali creano onesti ambigui.** Un onesto che deve "votare contro l'esito 3 volte" si comporta in modo strano per motivi veri, e questo copre la spia. Funziona anche il dilemma della spia: nel simulatore le spie che inseguono l'obiettivo aziendalista vincono la partita il 19% delle volte, quelle che lo ignorano il 26%. Quindi è una scelta vera, non scontata.

**L'equità tra reparti.** È costruita a monte: i ruoli si assegnano al momento. I dati la confermano: tra i reparti la differenza è di pochi decimi di punto.

**Il motore è solido.** Ci sono 164 test e un controllo automatico che nessun dato segreto finisca sul telefono sbagliato. Quando si passerà al prototipo, la base c'è.

---

## 2. Punti deboli, dal più grave

### 2.1 Stiamo tarando al decimale un gioco mai giocato

Il simulatore ci ha dato informazioni utili: cassa, equilibrio tra reparti, quanto vince la spia. Ma i robot non parlano, non mentono a voce, non si guardano in faccia. Tutto ciò che rende il gioco divertente sta fuori dal simulatore. Altri dieci report non ci diranno se una serata è noiosa a metà del secondo trimestre.

**È il rischio più grande del progetto, più di qualsiasi numero.** Ogni giorno passato a tarare aumenta la probabilità di aver rifinito con cura una cosa che a tavola non funziona.

### 2.2 Troppe regole, troppe eccezioni

Un elenco onesto di cosa deve sapere un giocatore alla prima serata:

- pesi di voto 2 / 1 / 0 che cambiano a ogni proposta, e una soglia calcolata anche sui demansionati;
- quesiti con astensione, che hanno **tre regole diverse** dagli altri: tutti peso 1, demansionati come "no" fisso, tempo scaduto = astensione;
- il **tempo scaduto** vale "no" nei voti, "per l'azienda" nella mossa privata, "sì" alla domanda di verifica, "licenzia" nella decisione finale e "astensione" nei quesiti con astensione: cinque significati;
- cassa con budget e tetto;
- messaggi: 2 a trimestre, anonimo che ne costa 2, 1 solo per il demansionato che non può mandare anonimi;
- segreti: tre tipi con valori diversi, fonte e reparto utile, copie false, scadenza a fine trimestre;
- demansionamento: uno a trimestre, il bersaglio non riproponibile nel trimestre dopo, mai nel T4, durata minima prima della promozione, promozione richiedibile una volta a trimestre;
- un finale in **10 passi**, con una votazione (quella sui demansionati) in cui votano anche i licenziati, al contrario di tutto il resto;
- un punteggio con **11 voci diverse**, più obiettivi e segreti;
- 34 obiettivi con parole tecniche come "voto decisivo", "proposta positiva" e "proposta più costosa".

Ognuna di queste regole, presa da sola, ha una buona ragione. Messe insieme fanno un gioco che si capisce alla terza partita, non alla prima. Per un gioco "di amici e parenti" è un problema serio: la prima serata decide se ce ne sarà una seconda.

### 2.3 Il "cuore del gioco" vale pochissimi punti

Gli effetti privati delle proposte sono presentati come il cuore del gioco. In punti, però, a fine partita valgono quasi niente:

- **0,8 punti di reparto** in media per un aziendalista e **3,1** per un egoista, compresa la mossa privata;
- contro **+20** se l'azienda vince, **±5** per una nomina giusta o sbagliata, 3–4 punti di obiettivo.

Conseguenza: un onesto **non ha quasi mai un motivo reale per mentire sul proprio effetto**, perché non gli conviene. Allora chi mente sugli effetti è quasi sempre la spia. Questo da un lato rende la deduzione più facile; dall'altro toglie agli onesti una ragione per essere ambigui proprio nel momento più importante, la discussione sulla proposta. A rendere ambigui gli onesti restano gli obiettivi personali, e basta.

### 2.4 La cassa non crea conflitto

Il GDD dice "non si può approvare tutto, bisogna scegliere e litigare". I dati dicono altro:

- la cassa è **al tetto nel 73% dei trimestri** dal T2 al T4;
- le proposte respinte per mancanza di fondi sono tra lo 0% e il 9%.

Quindi la cassa oggi è un numero sulla TV che quasi mai obbliga a scegliere. Attenzione: i robot approvano solo il 35% delle proposte. Le persone, trattando "pacchetti", forse ne approveranno di più e la cassa morderà di più. Ma così com'è, è una regola che costa senza rendere.

### 2.5 La spia che è fonte di un segreto non lascia tracce

Se il segreto nasce sul telefono della spia (è lei la fonte) e lei lo passa subito al concorrente senza farlo girare, nessun altro l'ha mai visto. In TV si legge solo il titolo della fuga, e nessuno sa chi ne era la fonte. È la mossa più sicura per la spia ed è **completamente invisibile**: il reparto a cui il dato serviva non sa nemmeno che esisteva.

Una spia furba lo capisce alla seconda partita. Da lì in poi la principale fonte di indizi del gioco, cioè la fuga di notizie, funziona solo contro le spie ingenue.

### 2.6 La mossa giusta per un onesto è fare l'egoista di nascosto

È il punto 31, lasciato in sospeso per scelta. Lo ripeto perché pesa sul divertimento.

Il bonus di +20 va a tutti gli onesti, che abbiano giocato per l'azienda o no, e la mossa privata egoista non si può scoprire. Quindi il comportamento che conviene è "lasciare agli altri il lavoro per l'azienda": nel simulatore gli egoisti arrivano primi il 20% delle volte, gli aziendalisti il 15%.

Il problema non è il numero, è la scelta. Una volta capito, la mossa privata smette di essere un dilemma e diventa un riflesso: si sceglie sempre "per il reparto". E "in calo" diventa normale, quindi non insospettisce più nessuno.

### 2.7 La spia aggressiva rende più della spia furba

Nei robot la spia aggressiva (sabota molto) arriva prima nel 28% delle partite, la spia prudente nel 17%. In un gioco di bluff dovrebbe essere il contrario: la sottigliezza deve pagare.

Va preso con cautela, perché i robot non sanno "fare gli innocenti". Ma è un segnale da tenere d'occhio nelle serate. Se le persone scoprissero che sabotare a testa bassa conviene, il gioco perderebbe il suo sapore.

### 2.8 Demansionamento: tante regole, poco uso

Il demansionamento ha sei limiti, la promozione ha le sue regole e c'è un voto speciale nel finale. Nel simulatore però si usa **da 0,1 a 0,5 volte a partita**. Forse le persone lo useranno di più: è l'unico strumento per "fare qualcosa" contro un sospettato prima del finale. Oggi, però, è la parte del regolamento con il peggior rapporto tra regole e uso.

### 2.9 Il finale rischia di essere lungo

Il finale comprende: decisione su ogni demansionato, domanda di verifica, rivelazione di chi ha detto no, nomina, rivelazione uno alla volta, ballottaggio e, a 8 giocatori, un secondo giro.

La domanda di verifica ("sono rimasti solo onesti?") serve solo nelle partite senza spie, cioè circa una su sette. Nelle altre qualcuno dirà quasi sempre "no", quindi il passo si aggiunge senza cambiare nulla, e porta con sé tre voci di punteggio in più.

### 2.10 I reparti non hanno personalità

Per avere reparti uguali abbiamo assegnato i ruoli a caso a ogni proposta. Il risultato è giusto, ma "Marketing" e "Produzione" oggi sono solo etichette: stessi poteri, stesse informazioni, stessi segreti. I poteri speciali e le informazioni di contesto (punti aperti 5, 6, 7 e 29) sono fermi.

Non è grave per giocare, ma rende le partite tutte uguali. Nei giochi di deduzione i ruoli con un potere ("io posso vedere chi ha scritto a chi") sono spesso ciò che fa nascere le storie migliori.

### 2.11 Quattro trimestri identici

Ogni trimestre ha la stessa sequenza: rapporto, 2–3 votazioni, mossa privata, risultati. Su 45–60 minuti c'è il rischio concreto che il terzo trimestre sia la copia del secondo. L'idea degli eventi che cambiano una regola per un trimestre è nel GDD come proposta 🟡, ma non è stata sviluppata.

---

## 3. Suggerimenti

Divisi in **togliere** e **rafforzare il sospetto**. Le proposte del primo gruppo riducono le regole. Quelle del secondo aggiungono pochissimo, e in due casi semplificano.

### 3.1 Togliere o semplificare

| # | Proposta | Cosa si guadagna | Cosa si perde |
|---|---|---|---|
| T1 | **Un solo significato del tempo scaduto:** "conserva lo stato delle cose", dove possibile con le stesse parole sul telefono | una regola invece di cinque | niente di importante |
| T2 | **Togliere i quesiti con astensione** (6 su 40) dalla prima versione | tre eccezioni in meno | un po' di sapore nei temi di coscienza; si possono rimettere dopo |
| T3 | **Finale senza domanda di verifica:** si va subito alla nomina, con l'opzione **"Secondo me non c'è nessuna spia"**. Se vince quella, nessuno è licenziato | un passo e tre voci di punteggio in meno; resta la possibilità di partite senza spie | il momento "chi ha detto no?", che ha la sua tensione |
| T4 | **Promozione solo nel finale:** il demansionato resta fuori fino a fine anno, poi il direttivo decide se tenerlo o licenziarlo | spariscono durata minima, richieste e limiti della promozione a metà partita | la possibilità di rimediare subito a un errore (principio "gli errori si possono rimediare") |
| T5 | **Cassa:** o la si stringe davvero (es. 70 K a trimestre, tetto 100 K) o la si toglie e il costo diventa solo un'informazione di sapore | un numero che conta davvero, oppure un numero in meno | da decidere dopo una serata: con le persone la cassa potrebbe già funzionare |
| T6 | **Obiettivi per la prima serata:** uno solo assegnato, senza scelta fra tre, e solo quelli scritti con parole semplici | 90 secondi e molte domande in meno all'inizio | la scelta, che si rimette dalla seconda serata |

Con T1–T4 la spiegazione si accorcia di parecchio, senza toccare il cuore del gioco.

### 3.2 Rafforzare il sospetto, il bluff e l'inganno

**S1 · Mostrare quanti hanno giocato per l'azienda.** Al posto di "in calo / stabile / in crescita" la TV dice **"3 su 5 hanno giocato per l'azienda"**.
- Non si sa *chi*, ma si sa quanti sono stati egoisti, e partono subito le domande: "Io ho giocato per l'azienda. E tu?". Gli onesti devono difendersi, la spia si nasconde dietro gli egoisti veri.
- È anche una regola **più semplice** di quella attuale.
- Rende meno comodo l'egoismo nascosto (punto 31) senza toccare i punti.
- Rischio: se in un trimestre tutti dicono "io per l'azienda" e i conti non tornano, qualcuno mente per forza. È un rischio buono: è una scena da gioco di bluff.

**S2 · Annunciare quali segreti girano.** Nel Rapporto la TV mostra i **titoli** dei segreti del trimestre e **a quale reparto servono**, ma non chi li ha ricevuti: "Gira un dato su «Offerta della gara di primavera», serve a Vendite".
- Vendite sa che deve aspettarsi qualcosa e chiede in giro, e chi ha il dato deve decidere se consegnarlo, tenerlo o mentire.
- Chiude il buco del punto 2.5: se il dato esce e Vendite non l'ha mai ricevuto, la domanda "chi ce l'aveva?" diventa pubblica.
- Rischio: aiuta gli onesti, quindi la spia vincerà un po' meno. Se serve si compensa con la quota del concorrente.

**S3 · Più peso agli effetti privati.** Raddoppiare i punti di reparto delle proposte (es. +6 / −2 invece di +3 / −1), oppure ridurre a 3 i ±5 delle accuse.
- Così anche un onesto ha un motivo concreto per esagerare il proprio effetto, e la discussione torna ad avere una posta.
- Nessuna regola nuova: è un numero.
- Va verificato col simulatore che non rafforzi troppo gli egoisti.

**S4 · Un solo potere, a sorpresa.** Invece di poteri per reparto (punti 5–7, ancora fermi), **una carta "indagine" a testa per partita**, uguale per tutti: per esempio "scopri a chi ha mandato messaggi un giocatore in questo trimestre (non il contenuto)".
- Una regola sola, uguale per tutti (quindi equa), e una fonte di indizi in più.
- E soprattutto di bugie: chi ha usato l'indagine può mentire su cosa ha visto.
- Alternativa più leggera: rimandare tutti i poteri a dopo la prima serata.

**S5 · Un evento per trimestre, al massimo una riga.** Per esempio "questo trimestre l'egoismo vale doppio", "votazione segreta", "un segreto in più per tutti", "la cassa riceve solo 60 K".
- Rompe la ripetitività con una sola frase da leggere in TV.
- Da tenere per la fase di rifinitura, non per la prima serata.

### 3.3 Cosa non toccherei

- Effetti privati con verifica a fine trimestre, segreti falsificabili, trappola del canarino: sono l'identità del gioco.
- Lettura finale dei messaggi.
- Finale senza il risultato della corsa.
- Obiettivi personali (una volta semplificata la prima serata): danno agli onesti ragioni vere per sembrare sospetti.

---

## 4. Cosa farei adesso, in ordine

1. **Fermare la taratura col simulatore.** I numeri sono "abbastanza buoni" per una prima serata: spia vincente 15–25% con una spia, reparti equi.
2. **Decidere i tagli T1–T4** (mezz'ora di decisioni) e la proposta **S1**, che semplifica e insieme aumenta il sospetto.
3. **Passare alla fase 3:** server, schermate TV e telefono, prima serata con 5–6 persone.
4. **Alla prima serata osservare poche cose precise:**
   - quanto dura ogni trimestre;
   - in quale momento la gente si annoia;
   - se qualcuno mente sui propri effetti;
   - se la fuga di notizie fa nascere accuse;
   - se la cassa obbliga a scegliere;
   - quante domande arrivano sulle regole.
5. **Solo dopo** riprendere cassa (T5), effetti (S3), poteri (S4) ed eventi (S5), con le osservazioni vere in mano.

---

## Limiti di questa analisi

- I numeri vengono dai robot, che non parlano e non bluffano. Le frasi "la spia aggressiva rende di più" e "la cassa non morde" vanno verificate con le persone.
- Il divertimento si può prevedere solo in parte. Le previsioni qui sopra si basano su come funzionano di solito i giochi di deduzione sociale, non su prove fatte con questo gioco.
