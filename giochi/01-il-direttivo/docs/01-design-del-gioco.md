# IL DIRETTIVO — Documento di design del gioco

> **Titolo provvisorio.** Versione 0.1 — 20 novembre 2026
> Questo documento raccoglie la logica, la struttura e tutte le funzionalità discusse.
> Ogni elemento è marcato con il suo stato:
>
> - ✅ **Approvato**: deciso e confermato
> - 🟡 **Proposto**: suggerito, non ancora confermato esplicitamente
> - 🔴 **Da definire**: approvato come idea, ma i dettagli sono ancora aperti
> - ⚖️ **Da tarare**: la regola c'è, ma i numeri vanno verificati con simulatore e prove

---

## Indice

1. [Visione](#1-visione)
2. [Formato e dispositivi](#2-formato-e-dispositivi)
3. [Ambientazione](#3-ambientazione)
4. [Giocatori, fazioni e spie](#4-giocatori-fazioni-e-spie)
5. [I reparti](#5-i-reparti)
6. [I tre numeri del gioco](#6-i-tre-numeri-del-gioco)
7. [Struttura della partita](#7-struttura-della-partita)
8. [Proposte e votazioni](#8-proposte-e-votazioni)
9. [La mossa privata](#9-la-mossa-privata)
10. [Messaggi privati](#10-messaggi-privati)
11. [I segreti](#11-i-segreti)
12. [I concorrenti](#12-i-concorrenti)
13. [Demansionamento e promozione](#13-demansionamento-e-promozione)
14. [Autogestione](#14-autogestione)
15. [Il finale](#15-il-finale)
16. [Punteggio](#16-punteggio)
17. [Cosa mostrano TV e telefono](#17-cosa-mostrano-tv-e-telefono)
18. [Audio e comunicazione vocale](#18-audio-e-comunicazione-vocale)
19. [Tono e stile](#19-tono-e-stile)
20. [Punti aperti](#20-punti-aperti)
21. [Glossario](#21-glossario)

---

## 1. Visione

✅ Un gioco di società **psicologico e politico** per amici e parenti che vivono lontani. Si basa su influenze, convenienze, sospetti e alleanze.

✅ **Non deve diventare un gestionale.** I numeri sono pochi e semplici e servono solo a creare conflitti di interesse. Il cuore del gioco è la discussione a voce.

✅ Tensione centrale: **collaborare conviene, ma ci si può fidare?** Ogni giocatore ha un interesse personale e un dovere verso il gruppo. Tra i giocatori possono esserci spie.

**Principi di design:**

| Principio | Significato |
|---|---|
| Ognuno vede una verità diversa | Il digitale permette informazioni private e diverse per ciascuno. È il vantaggio principale rispetto a un gioco da tavolo. |
| Il computer nasconde i conti, mai il perché | Ogni esito deve essere spiegabile in una frase. Se i giocatori non capiscono cosa è successo, la deduzione muore. |
| Nessuno resta a guardare | Nessuna eliminazione durante la partita. |
| Gli errori si possono rimediare | Il demansionamento è reversibile. |
| Onesti ambigui | Anche un onesto ha motivi legittimi per comportarsi in modo sospetto, quindi il sospetto è reale e non solo bluff. |
| ✅ Pari opportunità tra reparti | Ogni giocatore, **a prescindere dal reparto**, deve avere le stesse possibilità di vincere e di incidere. I reparti sono diversi per tipo di influenza, non per quantità. Verificato con il simulatore. |

**Obiettivi pratici:**
- ✅ da 4 a 8 giocatori;
- ✅ durata circa 45–60 minuti più il finale *(da verificare col simulatore e nelle serate; priorità: che non sia noioso né ripetitivo — D-017)*;
- 🟡 regole spiegabili in circa 3 minuti, anche con l'aiuto della TV.

---

## 2. Formato e dispositivi

✅ **TV = tabellone comune.** Mostra ciò che è pubblico.

✅ **Smartphone = controller personale.** Mostra ciò che è privato: ruolo, dati del reparto, segreti, messaggi, voti.

✅ **Accesso tramite QR code** mostrato sulla TV: si inquadra e si entra, senza installare app.

✅ **Sviluppo in due fasi:**
1. **Fase locale:** una sola TV, tutti nella stessa stanza, audio naturale (si parla dal vivo).
2. **Fase online:** più case, ognuna con la sua TV, e audio integrato tra i telefoni.

---

## 3. Ambientazione

✅ **Un'azienda.** Ogni giocatore è il direttore di un reparto (acquisti, vendite, marketing, ecc.).

✅ **Nessun capo o proprietario.** Tutti hanno lo stesso grado. Le decisioni si prendono votando al **tavolo del direttivo**.

✅ Tutti sono **in competizione tra loro** (punti del proprio reparto) e al tempo stesso devono **contribuire ai traguardi aziendali**.

✅ Ognuno può **lamentarsi degli altri**: "senza il tuo contributo non raggiungo il mio obiettivo".

✅ L'azienda è in competizione con **uno o due concorrenti**, gestiti dal computer.

✅ Tra i direttori possono esserci **spie e infiltrati** dei concorrenti, che vogliono rubare segreti aziendali.

✅ **Dilemma centrale:** condividere informazioni aiuta a usare meglio le risorse, ma se arrivano a una spia favoriscono il concorrente.

> Le ambientazioni alternative (fantascienza, politica, ecc.) sono rinviate. Si parte con **un'ambientazione sola** e la si rende solida.

---

## 4. Giocatori, fazioni e spie

### 4.1 Fazioni

| Fazione | Obiettivo |
|---|---|
| **Onesti** | Far vincere l'azienda contro i concorrenti, e intanto accumulare punti personali (reparto più obiettivo segreto). |
| **Spie** | Far vincere il **proprio** concorrente, passandogli segreti e boicottando l'azienda. Hanno anche un reparto da gestire e obiettivi personali. |

### 4.2 Numero di spie

✅ Il numero di spie è **variabile e segreto**. Può capitare una partita **senza spie**.

| Giocatori | Spie possibili |
|---|---|
| 4–7 | 0 oppure 1 |
| 8 | 0, 1 oppure 2 |

⚖️ Probabilità indicativa di una partita senza spie: circa **1 su 6–7**. Deve essere rara, altrimenti diventa prevedibile.

🔴 Da definire: si dichiara a inizio partita quante spie sono *possibili* (per esempio "da 0 a 2")? Proposta: sì, si mostra solo l'intervallo.

### 4.3 Rapporti tra spie

✅ Due spie **dello stesso concorrente si conoscono** tra loro.

✅ Due spie di **concorrenti diversi non si conoscono**, e sono rivali anche tra loro.

✅ Una spia che fa licenziare una spia rivale **prende punti**.

### 4.4 Obiettivi segreti personali

✅ Ogni giocatore ha almeno un **obiettivo personale segreto**, svelato solo a fine partita.

🟡 Due livelli: un obiettivo **facile** e uno **difficile**, con punteggi diversi.

🟡 Esempi:
- "Fai approvare almeno 2 proposte che favoriscono il tuo reparto."
- "Chiudi l'anno con più punti di reparto di tutti."
- "Fai in modo che [Reparto X] venga demansionato almeno una volta." Gli obiettivi che riguardano altri giocatori rendono sospetti gli onesti per motivi legittimi.

🔴 Da definire: la lista completa degli obiettivi per reparto e per spie.

---

## 5. I reparti

### 5.1 Principio

✅ L'identità di un reparto **non** viene da numeri gestionali. Viene da:
1. **cosa vede** (quali informazioni private riceve);
2. **in quali votazioni pesa** (peso 2, 1 o 0);
3. **quali segreti riceve** e a chi gli conviene passarli;
4. 🟡 un eventuale **potere speciale** da usare una volta per partita.

### 5.2 Reparti di base (sempre presenti)

🟡 Acquisti, Produzione, Vendite, Marketing. Con 5 giocatori si aggiunge Finanza.

| Reparto | Cosa vede (proposta) | Tipo di segreti | Potere speciale (preliminare) |
|---|---|---|---|
| **Acquisti** | Prezzi e disponibilità dei fornitori | Prezzi d'acquisto | Contratto bloccato |
| **Produzione** | Capacità, guasti, costi interni | Costi reali | Straordinari |
| **Vendite** | Clienti, gare d'appalto | Offerte di gara | Grande cliente fuori gara |
| **Marketing** | Tendenze di mercato, **parte delle mosse dei concorrenti** | Date delle campagne | Ricerca di mercato: rivela un piano di un concorrente |

### 5.3 Reparti aggiuntivi (da 5 a 8 giocatori)

| Reparto | Cosa vede (proposta) | Potere speciale (preliminare) | Note |
|---|---|---|---|
| **Finanza** | Cassa aziendale, totali dei reparti | Verifica dei conti di un reparto | Deve avere solo poteri di informazione, altrimenti diventa un capo nascosto |
| **Risorse Umane** | Carichi di lavoro, clima | Colloquio: rivela a chi ha scritto un giocatore | ⚠️ si sovrappone a IT |
| **Ricerca & Sviluppo** | Avanzamento del nuovo prodotto | Brevetto: protegge un segreto | Custodisce il segreto più prezioso |
| **IT / Sicurezza** | Chi scrive a chi (non il contenuto) | Traccia una fuga di notizie | Il ruolo più potente, quindi nascondiglio ideale per una spia |

🔴 Da definire:
- i poteri speciali sono stati pensati prima del modello a "tre numeri" e vanno riallineati;
- Risorse Umane e IT hanno poteri troppo simili, e uno dei due va ripensato;
- quale reparto si aggiunge con 6, 7 e 8 giocatori.

🟡 Si parte con **i 4 di base più Finanza**. Gli altri si aggiungono dopo le prime prove.

### 5.4 Reparti non occupati

✅ Se i giocatori sono meno dei reparti, i reparti vacanti vanno in **autogestione** (vedi §14).

---

## 6. I tre numeri del gioco

✅ Pochi numeri, semplici. Il tema aziendale vive nei nomi delle proposte, non nei calcoli.

| Numero | Dove si vede | Funzione |
|---|---|---|
| **Quota di mercato** | TV (pubblico) | Una "corsa" tra l'azienda e i concorrenti. A fine anno conta chi è davanti. |
| **Cassa aziendale** | TV (pubblico) | ✅ *(provvisorio, da verificare col simulatore — D-018)* **Budget di 100 K (100.000 €) a ogni trimestre**, che si somma a quanto avanzato, con un **tetto di 150 K**. Approvare tutte le proposte di un trimestre costa spesso più di 100 K: non si può approvare tutto, bisogna scegliere e litigare; rinunciare a qualcosa nei primi trimestri dà più margine dopo. ⚖️ Importi da tarare. |
| **Punti di reparto** | Telefono (privato) | Il punteggio personale di ogni direttore. |

🟡 Ogni reparto ha di fatto un **proprio bilancio**: una scelta può essere buona per l'azienda e cattiva per chi la deve gestire. Esempio: un nuovo macchinario aiuta l'azienda, ma la Produzione si ritrova più spese che utili a fine trimestre.

---

## 7. Struttura della partita

✅ Una partita è **un anno di 4 trimestri**, seguito dal **finale**.

### 7.1 Prima della partita
1. La TV crea la stanza e mostra il QR code.
2. I giocatori entrano e scelgono un nome.
3. Il gioco assegna in segreto reparti, fazioni, spie e obiettivi.
4. 🟡 La TV spiega le regole passo per passo.

### 7.2 Il trimestre

| Fase | Cosa succede | Dove |
|---|---|---|
| **1. Rapporto** | Ognuno vede l'effetto delle proposte sul proprio reparto ed eventuali segreti | Telefono |
| **2–3. Ciclo per proposta** (ripetuto 2–3 volte) | **Discussione** a voce sulla proposta di turno, con messaggi privati (quota per trimestre, spesa quando si vuole), poi **votazione** palese con pesi. Il voto appare subito in TV. | Voce + TV + telefono |
| **4. Mossa privata** | Scelta segreta: interesse personale o aziendale | Telefono |
| **5. Risultati** | Corsa di mercato, mosse dei concorrenti, esito della mossa privata, effetto reale delle proposte | TV |
| **6. Demansionamento** (facoltativo) | Votazione per demansionare un direttore | TV + telefono |

⚖️ Durata indicativa di un trimestre: 10–12 minuti, con timer gestiti dal gioco.

✅ *(provvisorio, da verificare col simulatore — D-008)* **Un ciclo discussione → voto per ogni proposta.** L'**ordine delle proposte è casuale** e viene **annunciato già nel Rapporto**, così il gruppo può pianificare la cassa e trattare "pacchetti" fin dal primo ciclo.
⚖️ Durata dei timer (discussione per ciclo, voto, mossa privata): da tarare. Negli ultimi secondi del voto il telefono dà un preavviso chiaro (il tempo scaduto vale "no", D-007).

---

## 8. Proposte e votazioni

### 8.1 Chi propone
✅ **Le proposte le genera il gioco**, come se fosse il consiglio di amministrazione.

🟡 In più ogni giocatore può presentare **una mozione propria per partita**. Non è ancora confermato.

### 8.2 Effetti privati: il cuore del gioco
✅ In TV si vede solo **il titolo e il costo** della proposta.
✅ **Sul proprio telefono ognuno vede solo l'effetto sul proprio reparto.**
✅ Alcuni reparti vedono invece informazioni di contesto (per esempio il Marketing vede l'andamento del mercato).
✅ Ognuno riferisce a voce cosa ha visto, e **può mentire o esagerare**.
✅ A fine trimestre la TV mostra **l'effetto reale sull'azienda**, e si scopre chi aveva esagerato.

**Esempio:**
> TV: *"Nuovo macchinario — costo 40 K"*
> - Produzione vede: **−2** per il tuo reparto
> - Vendite vede: **+3** per il tuo reparto
> - Finanza vede: **−1** per il tuo reparto
> - Marketing vede: *"Il mercato sta calando: effetto sull'azienda inferiore al previsto"*

✅ Le scelte **non devono mai essere ovvie**: ogni proposta deve avere vincitori e perdenti tra i reparti.

✅ *(provvisorio, da rivalutare dopo le serate di prova — D-023)* **I quesiti nascono dall'effetto.** Ogni quesito ha uno **schema** (per esempio "un reparto guadagna molto, due perdono poco"); **i ruoli si assegnano ai reparti al momento dell'estrazione**, solo tra i reparti occupati e non in autogestione, dando i ruoli migliori ai reparti finora meno favoriti. Così tutti i reparti sono uguali per costruzione, a qualsiasi numero di giocatori. Il significato (testo) per ciascun reparto viene da frasi su misura del quesito, se ci sono, o da frasi predefinite del reparto.
🔴 Da ripensare (punto aperto 29): le **informazioni di contesto** di alcuni reparti (es. il Marketing vede l'andamento del mercato) con i quesiti generici, insieme all'identità dei reparti (punto 5).

### 8.3 Pesi
✅ Ogni reparto ha un **peso diverso a seconda del tipo di votazione**: 2, 1 oppure 0.
✅ Peso 0 significa che non vota, ma può influenzare gli altri a voce.
✅ I pesi sono **sempre visibili in TV** prima del voto.

🟡 Esempi:

| Tipo di votazione | Peso 2 | Peso 1 | Peso 0 |
|---|---|---|---|
| Investimenti negli impianti | Produzione, Finanza | Acquisti, Vendite | Marketing |
| Campagne e prezzi | Marketing, Vendite | Finanza | Produzione |
| Personale | Risorse Umane | Produzione, Finanza | Vendite |

✅ Se un reparto non è occupato o è demansionato, **il suo peso non vota**.

### 8.4 Soglia di approvazione
✅ La soglia si calcola sul **peso totale, compreso chi non può votare**.

> Esempio: peso totale 8, servono 5 sì. Se un reparto con peso 2 è demansionato, i 5 sì vanno trovati tra i 6 punti rimasti. Approvare diventa più difficile.

🟡 In caso di pareggio la proposta **non passa**.

✅ *(provvisorio, da verificare col simulatore — D-006)* I **reparti vacanti dall'inizio non contano** nella soglia; i **demansionati sì**. Vedi §14.

### 8.4bis Astensione
✅ *(provvisorio, da verificare col simulatore — D-007)* **Regola normale: solo SÌ / NO.** Chi non vota entro il tempo vale **"no"**; in TV: *"No (tempo scaduto)"*.
✅ *(provvisorio — D-007)* **Eccezione: quesiti "con astensione".** Alcuni quesiti, indicati nel mazzo, mostrano anche il tasto **"Mi astengo"**. In quel caso l'astensione è **vera**: la soglia si calcola **solo sul peso di chi ha votato** (sì + no).
✅ *(provvisorio — D-007)* Nei voti di **demansionamento e promozione** l'astensione **non esiste mai**: solo SÌ / NO, e il tempo scaduto vale "no".
✅ *(provvisorio, da verificare col simulatore — D-013)* Dettagli dei quesiti con astensione:
- il peso dei **demansionati conta come un "no" fisso**: soglia = metà più uno di (peso dei votanti + peso dei demansionati), così il demansionamento resta costoso (§8.4);
- il **tempo scaduto vale "no"**, come in tutte le altre votazioni (una sola regola sul tempo);
- sono **rari** (⚖️ circa il 15% del mazzo, in media 1–2 per partita), **segnalati in TV** dall'inizio della discussione con l'etichetta *"⚖️ Astensione ammessa"*, e riguardano temi in cui un onesto ha motivi legittimi per non schierarsi (conflitti di interesse, "votazione di coscienza");
- in questi quesiti **tutti i reparti occupati hanno peso 1** ("votazione del consiglio"), per non dare ai reparti di peso 2 un'astensione più pesante (D-005).

### 8.5 Voto palese
✅ Il voto è **palese**: in TV si vede chi ha votato cosa. Le votazioni sono il cuore delle discussioni.
✅ *(provvisorio, da verificare nelle serate — D-019)* Durante la votazione la TV mostra solo **chi ha già votato**, non cosa. Il voto si può **cambiare fino alla chiusura**. Alla chiusura la TV **rivela tutti i voti insieme** (chi ha votato cosa): un momento di scena.
✅ Rarissime eccezioni con voto segreto, legate a eventi speciali (per esempio "votazione anonima del consiglio").

### 8.6 Numero di proposte
✅ *(provvisorio, da verificare col simulatore — D-014)* **Scaletta fissa e nota in anticipo: 2 votazioni nel T1, 3 nel T2 e nel T3, 2 nel T4** (10 a partita). Il T1 serve anche a imparare; il T4 lascia tempo per il finale.
🔴 Da definire: la lista completa (indicativamente 20–30 proposte) con effetti e pesi.

✅ *(provvisorio, da verificare col simulatore — D-006)* **Selezione dell'ordine del giorno:** l'estrattore privilegia i quesiti che interessano soprattutto i reparti **occupati** (compresi i demansionati) e scarta quelli con molti reparti vacanti o in cui i vacanti avrebbero un peso rilevante. Il mazzo dei quesiti va costruito in modo che un quesito in cui un vacante "avrebbe" pesato esca solo raramente.
✅ *(provvisorio — D-014)* **Bilanciamento dei favoriti:** nel corso della partita ogni reparto occupato risulta "favorito" (l'effetto privato migliore) in un numero di quesiti simile agli altri, con tolleranza ±1 (D-005).
✅ *(provvisorio — D-014)* **Mazzo:** 30 quesiti nella versione minima per il simulatore, 40–50 per le serate. Ogni quesito indica nei dati trimestri ammessi, categoria, schema di effetto ed eventuale astensione. *(La composizione "a strati" per reparto non serve più con D-023.)*

---

## 9. La mossa privata

✅ Una scelta segreta per giocatore a ogni trimestre:

| Scelta | Effetto sul mio reparto | Effetto sull'azienda |
|---|---|---|
| **Spingo il mio reparto** | ⚖️ +1 | ⚖️ −1 |
| **Gioco per l'azienda** | ⚖️ 0 | ⚖️ +1 |

✅ **La TV mostra solo l'esito complessivo**: *in calo*, *stabile* o *in crescita*. Non il totale numerico, che rivelerebbe esattamente quanti hanno fatto gli egoisti.

✅ Il sabotaggio della spia e l'egoismo di un onesto **si confondono**: è l'ambiguità voluta.

✅ *(provvisorio, da verificare col simulatore — D-020)* Chi non sceglie entro il tempo gioca **per l'azienda**.
✅ *(provvisorio — D-020)* Il reparto di un **demansionato** fa la mossa privata guidato dal computer (⚖️ "azienda" all'80%); i **reparti vacanti non la fanno** (coerente con D-006: i vacanti non entrano nei conti).

⚖️ I valori sono una prima ipotesi. Contano soprattutto il **rapporto tra guadagno personale e valore della vittoria aziendale** e quanto è combattuta la corsa con i concorrenti.

🟡 Variante: eventi che cambiano i valori per un trimestre ("questo trimestre l'egoismo vale doppio"), per evitare la ripetitività.

---

## 10. Messaggi privati

### 10.1 Regole
✅ L'audio è condiviso con tutti. I **messaggi privati** passano da telefono a telefono.
✅ I messaggi sono **limitati**: 🟡 2 per giocatore a trimestre, non accumulabili.
✅ **Messaggio anonimo**: costa entrambi i messaggi del trimestre.
✅ **A fine partita tutti i messaggi vengono resi leggibili a tutti**, anonimi compresi (con il nome del mittente).
✅ *(provvisorio — D-021)* Il **demansionato non può mandare messaggi anonimi** (ha un solo messaggio, l'anonimo ne costa due).
✅ *(provvisorio, da valutare giocando — D-021)* **Quando si scrive:** dal Rapporto alla chiusura dell'ultima votazione del trimestre. Alternativa pronta nel motore (un parametro): in tutto il trimestre.

### 10.2 Formato
🟡 Messaggi **a modello** più un breve testo libero:
- "Invia un segreto" (vedi §11)
- "Chiedi un dato"
- "Proponi un patto"
- testo libero di massimo **80 caratteri**

✅ Il testo libero serve solo a parlare ("fidati di me", "non dirlo a Marco") e **non produce effetti nel gioco**.

### 10.3 "Pausa caffè": chi esce dall'app
✅ Il gioco rileva quando un giocatore **esce dall'app** (il telefono passa ad altro), facendo sospettare che comunichi all'esterno.
🟡 In TV, con ironia: *"Marco è in pausa caffè ☕ (3ª volta)"*.
✅ È un **deterrente sociale**, non una prova: ci sono falsi allarmi (chiamate, notifiche, schermo bloccato) e non può vedere un secondo dispositivo.

### 10.4 Regola di correttezza (fase locale)
🟡 Nella stessa stanza nessuno impedisce di sussurrare. Si dichiara a inizio partita: *"In privato si comunica solo con l'app."* La lettura finale dei messaggi aiuta a rispettarla.

---

## 11. I segreti

### 11.1 Cos'è un segreto
✅ Un segreto è un'**informazione concreta generata dal gioco** (una "scheda"), non testo libero.

> Esempi: *"Gara X — offerta del concorrente: 118.000 €"*, *"Lancio campagna: trimestre 3"*, *"Il concorrente A punta alla stessa gara"*.

### 11.2 Condivisione: facoltativa, conveniente e rischiosa
✅ Condividere **non è obbligatorio**.
✅ Un segreto **vale solo se arriva al reparto giusto**. Esempio: Marketing riceve un'informazione utile a Vendite. Se Vendite la conosce prima della votazione, l'azienda guadagna.
✅ Ogni condivisione è un rischio: il destinatario potrebbe essere una spia.

### 11.3 Uso da parte della spia
✅ La spia può **passare un segreto al proprio concorrente** con un'azione sul telefono.
✅ La spia **sceglie se e quando** usarlo.
✅ Le conseguenze sono **visibili in TV**: *"Il concorrente A ha anticipato la nostra mossa: +2 per lui."*
✅ **Tensione emergente:** più persone conoscono un segreto, più è sicuro per la spia usarlo. La spia ha interesse a far girare i segreti, gli onesti a tenerli in un cerchio stretto.

### 11.4 Segreti falsi
✅ Un segreto si può **inoltrare così com'è** oppure **modificato** (per esempio cambiando un numero). Il gioco registra la versione modificata come falsa.
✅ Chi riceve la scheda **non sa se è vera**.
✅ Se la spia passa al concorrente un segreto falso, **il concorrente sbaglia mossa e perde punti**, e in TV si vede.
✅ **Trappola del canarino:** dare versioni diverse dello stesso dato a persone diverse. La versione usata dal concorrente indica chi ha parlato.

### 11.5 Regole di dettaglio
✅ *(provvisorio, da verificare col simulatore — D-021)* Ogni segreto è **collegato a una proposta del trimestre**: vale per l'azienda se arriva (in versione vera) al reparto a cui serve **prima che quella votazione si chiuda**.
✅ *(provvisorio — D-021)* Quando succede, la TV dice solo *"Un'informazione è arrivata in tempo al reparto giusto: +N"*, **senza dire quale** (da riconsiderare dopo le simulazioni).
✅ *(provvisorio — D-021)* La spia può passare un segreto al concorrente **solo nel trimestre in cui è uscito**; l'effetto si vede ai Risultati, e la TV dice quale segreto il concorrente ha usato (§11.3).
✅ *(D-005, D-024)* **Fonte e reparto utile di ogni segreto si scelgono al momento della distribuzione**, tra i reparti con un direttore attivo (come i quesiti, D-023); le fonti si distribuiscono in modo equilibrato. Chi possiede una copia vede a quale reparto serve.
⚖️ Segnaposto da tarare: 2 segreti a trimestre, penalità 2 per il concorrente che usa un dato falso, 2 punti alla spia per segreto usato.
🔴 Lista dei segreti e loro valore (punto aperto 2).
✅ *(provvisorio, da verificare col simulatore — D-015)* **Provenienza visibile:**
- un segreto distribuito dal gioco porta l'etichetta **"dato ufficiale del tuo reparto"**: chi lo riceve sa che è vero (serve per falsificare e per la trappola del canarino);
- un segreto ricevuto da un altro giocatore mostra **solo il mittente diretto** ("da Marco", oppure "anonimo"). Non si vede se il mittente è la fonte o un passaggio intermedio, né la catena.
🔴 Quanti punti vale per la spia un segreto usato.

---

## 12. I concorrenti

✅ 1 o 2 concorrenti, **gestiti dal computer**, visibili in TV nella corsa di mercato.
✅ Avanzano grazie ai segreti ricevuti dalle spie, e perdono punti con i segreti falsi.
✅ *(provvisorio, da verificare col simulatore — D-011)* **1 concorrente da 4 a 7 giocatori, 2 concorrenti con 8.** Il numero dipende solo dal numero di giocatori, così non rivela quante spie ci sono.
✅ *(provvisorio — D-011)* **Il concorrente di una spia vince se a fine anno supera l'azienda**, anche se non supera l'altro concorrente. Con due spie rivali possono quindi vincere entrambe.

🔴 Da definire:
- il comportamento di base: crescita propria, eventi, casualità;
- quanto deve essere combattuta la corsa. ⚖️ È la "manopola" principale dell'equilibrio del gioco.

---

## 13. Demansionamento e promozione

### 13.1 Regole approvate
✅ **Niente licenziamento durante la partita.** Il licenziamento avviene solo a fine anno (§15).
✅ Durante la partita si può **demansionare** un direttore: una potenziale spia, oppure un onesto ritenuto incompetente o poco collaborativo.
✅ Il demansionato **non vota** al tavolo del direttivo, ma può parlare, suggerire e influenzare.
✅ Il suo reparto va in **autogestione** (§14).
✅ Al tavolo **non arrivano più proposte che riguardano specificamente quel reparto**.
✅ Approvare le decisioni diventa più difficile, perché la soglia resta calcolata sul peso totale (§8.4).
✅ Si può **rimediare con una promozione**, che riporta il direttore al suo ruolo.
✅ **A fine partita chi è ancora demansionato viene licenziato**, quindi ha interesse a convincere gli altri a promuoverlo.

### 13.2 Proposte collegate
✅ *(provvisorio — D-022)* **Il ruolo non viene rivelato** con il demansionamento.
✅ *(provvisorio — D-022)* Il demansionato **perde l'accesso ai segreti** del proprio reparto. Se le fughe di notizie si fermano, è un indizio, non una prova.
✅ *(provvisorio — D-022)* Il demansionato ha **1 solo messaggio** a trimestre invece di 2.

### 13.3 Limiti contro l'uso politico (proposti)
✅ *(provvisorio, da verificare col simulatore — D-022)* Al massimo **una votazione di demansionamento per trimestre**: se fallisce, non se ne propone un'altra. La propone un direttore attivo nella fase 6, dopo le promozioni; va al voto la prima proposta.
✅ *(provvisorio — D-022)* **Chi è stato bersaglio** di una proposta di demansionamento (riuscita o no) non può essere riproposto nel trimestre successivo.
🟡 A fine anno, **chi ha votato per demansionare un onesto perde punti**.
✅ *(provvisorio — D-022)* **Niente demansionamenti nel 4° trimestre**: altrimenti una spia può togliere un onesto dal voto finale.

### 13.4 Da definire
✅ *(provvisorio, da verificare col simulatore — D-009)* Il voto per demansionare è **1 a testa** tra i direttori attivi. **Il bersaglio non vota** sul proprio demansionamento. Solo SÌ/NO, il tempo scaduto vale "no" (D-007).
✅ *(provvisorio, da verificare col simulatore — D-012)* Soglia: **metà più uno** degli aventi diritto (con D-007 coincidono con i votanti). **Pareggio = non passa.** Vale anche per la promozione.
✅ *(provvisorio, da verificare col simulatore — D-010)* **Promozione: durata minima di un trimestre intero, poi solo a voto.** Chi è demansionato a fine T1 resta fuori per tutto T2 e può essere promosso dalla fine di T2; chi è demansionato a fine T3 ha come unica occasione il finale. Il trimestre minimo serve anche a osservare se le fughe di notizie si fermano (§13.2).
✅ *(provvisorio — D-010)* Modalità:
- si vota nella **fase 6**, **prima** dell'eventuale proposta di demansionamento;
- la propone **qualsiasi direttore attivo** oppure la **richiede il demansionato** stesso;
- voto **1 a testa** tra gli attivi, il demansionato non vota; solo SÌ/NO, tempo scaduto = "no" (D-007); soglia come il demansionamento (punto aperto 21);
- al massimo **una richiesta di promozione a trimestre per persona**.

---

## 14. Autogestione

✅ Un reparto in **autogestione** è guidato dal computer. Si applica a:
- reparti **non occupati** (partite con pochi giocatori);
- reparti di direttori **demansionati**.

✅ Al tavolo non arrivano proposte specifiche per i reparti in autogestione.
🟡 Regola di rendimento: **rende poco ma non fa disastri**. Il demansionamento costa al gruppo senza distruggerlo.

✅ *(provvisorio, da verificare col simulatore — D-006)* Il peso dei reparti **vacanti dall'inizio non conta** nella soglia, perché nessuno potrebbe mai votare con quel peso. Il peso dei **demansionati conta** (§8.4): il demansionamento è una scelta del gruppo e deve costare.

---

## 15. Il finale

### 15.1 Sequenza approvata

1. **Decisione sui demansionati** *(provvisorio, da verificare col simulatore — D-028)*. Per **ogni** demansionato, uno alla volta (prima chi è fuori da più tempo), il direttivo decide esplicitamente: **promuoverlo o licenziarlo?** Voto palese, 1 a testa tra gli attivi, il demansionato non vota, metà più uno per promuovere. **Pareggio o nessuna risposta = licenziato.** Chi viene promosso torna nel direttivo e vota sui successivi.
2. **Licenziamento.** Chi non viene promosso è licenziato e il suo ruolo viene rivelato subito. Punti come la nomina (§16.2): chi ha votato "licenzia" prende i punti o le penalità di chi nomina; chi ha votato "promuovi" per una spia prende la stessa penalità di chi fa licenziare un onesto.
3. **Domanda di verifica.** Ogni membro del direttivo vota **in segreto**: *"Nel direttivo sono rimasti solo onesti?"* Sì o no.
4. **Se tutti rispondono sì**, il gioco passa al punteggio.
5. **Se c'è almeno un no**, la TV rivela **chi ha votato no**.
6. **Nomina.** Ognuno indica in segreto chi secondo lui è la spia.
7. **Rivelazione.** La TV mostra **uno alla volta** chi ha votato chi.
8. **Il più votato viene licenziato** e il suo ruolo viene **rivelato subito**.
9. **Parità:** ballottaggio tra i pari merito. **Se c'è di nuovo parità, vengono licenziati entrambi.**
10. **Secondo giro:** si ripete dal punto 3 **solo se sono possibili due spie** (8 giocatori). Si rifà la domanda anche se nel primo giro è stato licenziato un onesto.

### 15.2 Regole del finale
✅ **Votano solo i membri del direttivo.** Demansionati e licenziati possono solo suggerire e confondere.
✅ Nel finale **ogni voto vale 1**, senza pesi di reparto.
✅ *(provvisorio — D-022)* Si può nominare come spia solo un **membro attivo del direttivo**, esclusi se stessi e i licenziati.
✅ Il ruolo di ogni licenziato viene rivelato subito.

### 15.3 Dopo il finale
✅ Calcolo dei punteggi (§16).
✅ **Lettura di tutti i messaggi privati** scambiati durante la partita.

---

## 16. Punteggio

### 16.1 Struttura
✅ Punteggi e penalità a più livelli. ⚖️ Tutti i valori vanno tarati.

🟡 Principio: **il bonus aziendale vale più di qualsiasi obiettivo personale**. Così a un onesto non conviene mai far fallire l'azienda per i propri punti.

✅ *(provvisorio — D-022)* **Pareggio** nella corsa di mercato a fine anno: **non vince nessuno** (niente bonus agli onesti né alla spia).
✅ *(provvisorio — D-022)* Il punteggio si calcola per ora **senza obiettivi personali** (si aggiungono quando ci sarà la lista, punto aperto 3), con i valori indicativi di questa sezione come segnaposto ⚖️. Ogni giocatore vede l'elenco delle voci che compongono il suo punteggio.

| Voce | Chi | Punti (indicativi) |
|---|---|---|
| Azienda batte i concorrenti | ogni onesto | +20 *(D-024: il bonus comune deve valere più del guadagno egoistico)* |
| Concorrente della spia vince (supera l'azienda, D-011) | spia **non licenziata** *(D-025: una spia scoperta ha perso)* | +10 |
| Punti di reparto | tutti | accumulati in partita |
| Obiettivo personale facile / difficile | tutti | +2 / +5 |
| Segreto passato al concorrente con successo | spia | 🔴 da definire |
| Crisi o sconfitta aziendale causata | spia | 🟡 +2 per evento |

### 16.2 Esiti del finale

| Esito | Effetto |
|---|---|
| Tutti "sì" e davvero nessuna spia | Bonus a tutti gli onesti |
| Tutti "sì" ma la spia c'era | Grande bonus alla spia |
| Qualcuno "no" ma non c'erano spie | Penalità a chi ha votato "no" (falso allarme) |
| Spia licenziata | Bonus agli onesti, punti extra a chi l'ha nominata, grossa penalità alla spia *(D-027: vale anche per la spia ancora demansionata a fine anno — contratto non rinnovato = licenziata; l'unica via d'uscita è farsi promuovere all'ultimo turno)* |
| Onesto licenziato | Penalità a chi l'ha nominato, punti alla spia, **penalità anche all'onesto licenziato** *(D-026, −5 indicativo ⚖️; vale anche per chi è licenziato perché ancora demansionato)* |
| Spia che fa licenziare una spia rivale | Punti alla spia accusatrice |
| Decisione finale su un demansionato *(D-028)* | Chi vota "licenzia" = come chi nomina (stessi punti e penalità); chi vota "promuovi" per una spia = penalità come chi fa licenziare un onesto. Contano i voti espressi |
| Demansionamento di un onesto (durante la partita) | 🟡 Penalità a chi l'ha votato |

### 16.3 Classifica
🟡 Classifica sulla singola partita e **classifica su più serate** (campionato).

---

## 17. Cosa mostrano TV e telefono

### 17.1 TV (pubblico)
- QR code e lista dei giocatori collegati
- Spiegazione delle regole
- Corsa di mercato (azienda contro concorrenti)
- Cassa aziendale
- Trimestre e fase in corso, timer
- Proposta in votazione: titolo, costo, **pesi per reparto**
- **Voti palesi** (chi ha votato cosa)
- Esito della mossa privata (in calo, stabile, in crescita)
- Effetti reali delle proposte e mosse dei concorrenti
- Stato dei direttori: attivo, demansionato, in autogestione
- "Pausa caffè" ☕
- Indicatore di **chi sta parlando** (fase online)
- Finale: votazioni, rivelazioni una alla volta, ruoli
- Punteggi e lettura dei messaggi

### 17.2 Telefono (privato)
- Ruolo, reparto, fazione (e altre spie dello stesso concorrente)
- Obiettivi segreti
- Effetti privati delle proposte sul proprio reparto
- Informazioni di contesto del reparto
- Segreti ricevuti (veri o falsi, senza saperlo)
- Messaggi: invio, ricezione, quota residua, anonimato
- Pulsanti di voto, mossa privata, demansionamento, nomina finale
- Azioni della spia: passare un segreto al concorrente
- Punti di reparto
- Controlli audio (fase online)

---

## 18. Audio e comunicazione vocale

✅ **L'audio integrato è essenziale.** Chat o servizi esterni rovinerebbero il coinvolgimento.

### 18.1 Fase locale
Una sola TV, tutti nella stessa stanza: si parla dal vivo. Nessun audio digitale.

### 18.2 Fase online (decisioni approvate)
✅ Ogni casa ha la sua TV. **La TV non riproduce l'audio dei telefoni della propria stanza.** L'associazione avviene tramite il QR code inquadrato.
✅ Due modalità, a scelta del giocatore:

| Modalità | Ascolto | Parlato |
|---|---|---|
| **Cuffie** | Nelle cuffie del telefono | Microfono aperto |
| **TV** | Dagli altoparlanti della TV | Premi-e-parla, anche a interruttore (un tocco accende, un tocco spegne) |

✅ **Noise gate** contro le voci doppie quando più giocatori in cuffia sono nella stessa stanza.
✅ **Schermo sempre acceso** durante la partita (Wake Lock).
✅ **Indicatore in TV di chi sta parlando**: senza volti, è fondamentale sapere chi ha detto cosa.
🟡 Consigliate cuffie con filo. Le cuffie Bluetooth peggiorano qualità e ritardo quando si usa il loro microfono.

Dettagli tecnici nel documento di architettura.

---

## 19. Tono e stile

🟡 **Ironia aziendale**: riunioni inutili, mail passivo-aggressive, eventi assurdi, "pausa caffè".
🟡 Il gioco non deve "sembrare lavoro": pochi numeri, tanto racconto.
🟡 Le proposte devono avere titoli coloriti e memorabili.

---

## 20. Punti aperti

| # | Tema | Stato |
|---|---|---|
| 1 | Lista proposte (20–30) con effetti privati e pesi | 🔴 |
| 2 | Lista segreti e loro valore | 🔴 |
| 3 | Obiettivi segreti per reparto e per spie | 🔴 |
| 4 | Comportamento dei concorrenti | 🔴 |
| 5 | Poteri speciali dei reparti (riallineare al modello a tre numeri) | 🔴 |
| 6 | Sovrapposizione Risorse Umane / IT | 🔴 |
| 7 | Reparti da aggiungere con 6, 7 e 8 giocatori | 🔴 |
| 8 | Voto per demansionare: pesi uguali o di reparto | ✅ provvisorio (D-009) |
| 9 | Promozione: durata minima, automatica o a voto | ✅ provvisorio (D-010) |
| 10 | Peso dei reparti vacanti nella soglia | ✅ provvisorio (D-006) |
| 11 | Ordine delle fasi (✅ provvisorio, D-008) e durata dei timer (⚖️) | ⚖️ |
| 12 | Mozione personale per giocatore | 🟡 |
| 13 | Valori di mossa privata, cassa, bonus, penalità | ⚖️ |
| 14 | Probabilità di partita senza spie | ⚖️ |
| 15 | Equilibrio generale (simulatore) | ⚖️ |
| 16 | Titolo definitivo del gioco | 🔴 |
| 17 | Numero di votazioni per partita e dimensione del mazzo di quesiti, perché la selezione "reparti occupati" (D-006) funzioni con ogni numero di giocatori | ✅ provvisorio (D-014) |
| 18 | 💡 Idea da valutare: bot che occupano i reparti (anche con 3 umani), con livello da 1 = "solo interesse aziendale" a 5 = "solo interesse del reparto", e opzione d'avvio "i bot possono essere spie sì/no" | 🔴 da valutare |
| 19 | Quesiti "con astensione vera" (D-007): peso dei demansionati, valore del tempo scaduto, quanti e quali quesiti | ✅ provvisorio (D-013) |
| 20 | 💡 Idea da valutare: "livello di fiducia" 1–5 mosso dalle mosse private; a 5 "scudo sociale" contro il demansionamento, che perde efficacia nel finale | 🔴 da valutare |
| 21 | Soglia esatta del voto di demansionamento/promozione (aventi diritto o votanti) e pareggio | ✅ provvisorio (D-012) |
| 22 | 💡 Idea da valutare (da discutere quando si costruiscono i reparti): Risorse Umane con peso 2 nei voti di demansionamento/promozione — **oppure, variante, voto decisivo in caso di pareggio** — e punti extra o penalità nel finale per spie scoperte o innocenti accusati. Da confrontare con D-009 (1 a testa) e D-005 | 🔴 da valutare |
| 23 | 💡 Idea da valutare: numero massimo di demansionati contemporanei (es. 1 fino a 4 giocatori, 2 da 5 in su) | 🔴 da valutare |
| 24 | Poteri di IT e Risorse Umane (chi scrive a chi): valgono anche per i messaggi anonimi? Da decidere con i punti 5–6 | 🔴 |
| 25 | 💡 Idea da valutare (sviluppo successivo): mini-sfide sul telefono con bonus/penalità (quiz, giochini a tema: "evita ostacoli", "evadi pratiche"…) contro noia e ripetitività | 🔴 da valutare |
| 26 | Cassa non spesa: si accumula nel trimestre successivo o si azzera? | ✅ provvisorio (D-018) |
| 27 | Voto palese: voti mostrati man mano o tutti alla chiusura; voto modificabile prima della chiusura? | ✅ provvisorio (D-019) |
| 28 | Mossa privata dei reparti in autogestione (sì/no, con quale probabilità) e scelta predefinita a tempo scaduto | ✅ provvisorio (D-020) |
| 29 | Informazioni di contesto dei reparti (es. Marketing e mercato) con i quesiti generici di D-023 | 🔴 |
| 30 | Spia scoperta (licenziata): conserva il bonus "il suo concorrente vince"? Oggi sì (+10, poi −5); il criterio di vittoria indicato da Luis dice che una spia scoperta ha perso | ✅ provvisorio (D-025: niente bonus alla spia licenziata) |
| 31 | Gli onesti egoisti vincono più spesso dei cooperativi (simulazione 04: 23% contro 9%) perché il bonus aziendale va a tutti gli onesti. Alternative: A) bonus proporzionale alle mosse "per l'azienda" · B) ridurre il guadagno della mossa "reparto" · C) lasciare così e contare sulle accuse | ⏸️ per ora C (Luis, 22/11/2026): si osserva nelle serate di prova |

---

## 21. Glossario

| Termine | Significato |
|---|---|
| **Direttivo** | Il tavolo dei direttori che votano |
| **Reparto** | Il settore aziendale di un giocatore |
| **Peso** | Il valore del voto di un reparto in un certo tipo di votazione (2, 1, 0) |
| **Soglia** | I voti "sì" necessari, calcolati sul peso totale |
| **Effetto privato** | Conseguenza di una proposta visibile solo al reparto interessato |
| **Mossa privata** | La scelta segreta trimestrale tra interesse personale e aziendale |
| **Segreto** | Informazione concreta generata dal gioco, vera o falsa |
| **Trappola del canarino** | Dare versioni diverse di un dato a persone diverse per scoprire chi lo fa trapelare |
| **Demansionamento** | Sospensione del voto e dell'accesso ai segreti, reversibile con una promozione |
| **Autogestione** | Reparto guidato dal computer |
| **Licenziamento** | Esclusione definitiva, solo a fine anno, con ruolo rivelato |
| **Noise gate** | Filtro che lascia passare solo le voci forti e vicine |
| **Premi-e-parla** | Il microfono si attiva solo mentre si preme (o dopo un tocco) |
