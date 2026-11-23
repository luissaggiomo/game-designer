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
13. ~~Demansionamento e promozione~~ *(eliminato, D-057)*
14. [Autogestione](#14-autogestione)
15. [Il finale: rinnovo dei contratti](#15-il-finale-rinnovo-dei-contratti)
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
| Nessuno resta a guardare | Nessuna eliminazione e nessuna perdita del voto durante la partita *(D-057)*. |
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
| **Spie** | Far vincere il **proprio** concorrente, passandogli segreti e boicottando l'azienda. Hanno anche un reparto da gestire e obiettivi personali, che per loro sono sempre **aziendalisti** *(D-049)*. |

### 4.2 Numero di spie

✅ Il numero di spie è **variabile e segreto**. Può capitare una partita **senza spie**.

| Giocatori | Spie possibili |
|---|---|
| 4–7 | 0 oppure 1 |
| 8 | 0, 1 oppure 2 |

⚖️ Probabilità indicativa di una partita senza spie: circa **1 su 6–7**. Deve essere rara, altrimenti diventa prevedibile.

✅ *(provvisorio — D-061, approvato da Luis il 23/11/2026)* La TV mostra sempre, in piccolo: *"ATTENZIONE: una spia potrebbe essersi infiltrata tra voi!"* (da 4 a 7 giocatori) oppure *"ATTENZIONE: potrebbero esserci spie tra voi!"* (8 giocatori). Non dice quante sono né se ci sono davvero.

### 4.3 Rapporti tra spie

✅ Due spie **dello stesso concorrente si conoscono** tra loro.

✅ Due spie di **concorrenti diversi non si conoscono**, e sono rivali anche tra loro.

~~Una spia che fa licenziare una spia rivale prende punti.~~ *(superato da D-059: nel finale non ci sono più punti sulle accuse)*

### 4.4 Obiettivi segreti personali

✅ Ogni giocatore ha almeno un **obiettivo personale segreto**, svelato solo a fine partita.

✅ *(provvisorio, ⚖️ punti da verificare col simulatore — D-046)* **Tre proposti, se ne tiene uno.** A inizio partita ogni giocatore riceve tre obiettivi, **uno per tipo**, e ne sceglie uno. Ogni obiettivo ha **due traguardi**, con difficoltà proporzionata ai punti:

| Tipo | Forma | Facile | Difficile | Massimo |
|---|---|---|---|---|
| 1 · Graduale | stesso tema, due soglie | +3 | +5 | +8 |
| 2 · Doppio | due traguardi diversi, il facile è accessibile | +3 | +7 | +10 |
| 3 · Doppio | due traguardi diversi, il facile è un po' più complesso | +4 | +6 | +10 |

Nel tipo 1 il secondo gradino comprende il primo; nei tipi 2 e 3 i traguardi contano ciascuno per conto proprio.

✅ *(provvisorio, da verificare nelle serate — D-047)* **Visibilità.** Durante la partita l'obiettivo scelto è visibile **solo sul telefono del proprietario**, con l'**avanzamento** di ogni traguardo. Non esiste un modo di dimostrarlo dentro l'app: lo si può solo dichiarare a voce, anche mentendo. **Al punteggio la TV rivela l'obiettivo scelto da ognuno e com'è andato**; gli obiettivi scartati non si mostrano mai.

✅ *(provvisorio, da verificare nelle serate — D-048)* **Assegnazione.** Dopo la spiegazione delle regole in TV (che si può saltare) ognuno riceve le sue tre proposte e sceglie; **la partita inizia quando tutti hanno scelto**. Chi non sceglie entro il tempo massimo (⚖️) riceve uno dei suoi tre a caso. Nella stessa partita **ogni obiettivo compare al massimo una volta** fra tutte le terne.

✅ *(provvisorio, da verificare col simulatore e nelle serate — D-049)* **Spie: obiettivi aziendalisti.** Il mazzo è unico e contiene una parte di obiettivi **aziendalisti** (aiutano l'azienda). Gli onesti ricevono la terna da tutto il mazzo; **le spie ricevono solo aziendalisti**, uno per tipo: devono districarsi tra il sabotaggio e i punti extra che vengono dall'aiutare l'azienda. Schermata e punti identici per tutti, quindi dichiarare un obiettivo aziendalista non prova nulla. Una parte degli aziendalisti è **invisibile** agli altri (es. mossa privata per l'azienda), così costa davvero alla spia. Principio gemello di §16: **per la spia la vittoria del concorrente vale più di qualsiasi obiettivo.** I licenziati conservano i punti dell'obiettivo.

✅ *(provvisorio — D-050)* **Tipi ammessi.** Solo meccaniche generiche verificabili dal computer: voti sulle proposte, mossa privata, segreti in generale, cassa, finale, messaggi (solo obiettivi "di ricezione" o con un costo vero, pochi). **Bersagli solo generici**, mai un giocatore preciso. **Niente obiettivi sull'esito** (chi vince la corsa, chi è la spia). **Nessun obiettivo premia la mossa "per il reparto"**; la mossa "per l'azienda" compare solo fra gli aziendalisti.

~~🟡 Esempi iniziali~~ *(superati da D-050: niente bersagli precisi come "[Reparto X] demansionato")*.

✅ *(provvisorio — D-048, confermato da Luis il 23/11/2026)* **La scelta fra tre resta**: dà a ognuno la possibilità di prendersi in parte la responsabilità del proprio destino, decidendo quale rischio assumersi.

✅ *(provvisorio, soglie ⚖️ da tarare col simulatore — D-052; «Intermediario» al posto di «Riformatore» e «Squadra» riscritti con il conteggio della mossa privata, D-057, D-061, approvati il 23/11/2026)* **Lista:** 34 obiettivi (12 di tipo 1, 11 di tipo 2, 11 di tipo 3 dopo la ritaratura D-053), di cui 4 aziendalisti per tipo. Regole di verifica: l'avanzamento sul telefono conta solo ciò che il giocatore può già sapere, il resto si verifica a fine partita; contano solo le scelte del giocatore (non voti scaduti né scelte predefinite); i voti con peso 0 non contano. ⚠️ *(D-071)* Gli obiettivi sui voti e sulla cassa (circa 32 traguardi su 68) vanno riscritti per il voto del pacchetto, a regole fissate. Lista completa: [contenuti/obiettivi.md](contenuti/obiettivi.md). *(D-076, 23/11/2026: 16 obiettivi riscritti per il voto del pacchetto, con le definizioni di "voto decisivo" e "pacchetto positivo"; soglie tarate col report 14, vedi [contenuti/obiettivi.md](contenuti/obiettivi.md).)*

---

## 5. I reparti

### 5.1 Principio

✅ L'identità di un reparto **non** viene da numeri gestionali. Viene da:
1. **cosa vede** (quali informazioni private riceve);
2. ~~in quali votazioni pesa~~ *(D-068: i pesi non esistono più, ognuno vale 1)*;
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
| **Cassa aziendale** | TV (pubblico) | ✅ *(provvisorio, da verificare col simulatore — D-018, D-068)* **Budget di 100 K a ogni trimestre**, che si somma a quanto avanzato, **senza tetto**. Ogni trimestre arrivano **tre proposte: piccola 30 K, media 50 K, grande 80 K** (D-062) e il direttivo deve **investire almeno 51 K** ⚖️: in pratica "la grande oppure le due piccole" (entrambe 80 K), così si avanzano al massimo 20 K a trimestre (80 K in un anno). Con il tesoretto, più avanti si possono permettere pacchetti più ricchi (30+80, 50+80, tutte e tre). |
| **Punti di reparto** | Telefono (privato) | Il punteggio personale di ogni direttore. |

🟡 Ogni reparto ha di fatto un **proprio bilancio**: una scelta può essere buona per l'azienda e cattiva per chi la deve gestire. Esempio: un nuovo macchinario aiuta l'azienda, ma la Produzione si ritrova più spese che utili a fine trimestre.

---

## 7. Struttura della partita

✅ Una partita è **un anno di 4 trimestri**, seguito dal **finale**.

### 7.1 Prima della partita
1. La TV crea la stanza e mostra il QR code.
2. I giocatori entrano e scelgono un nome.
3. Il gioco assegna in segreto reparti, fazioni e spie.
4. 🟡 La TV spiega le regole passo per passo *(D-048: si possono saltare)*.
5. ✅ *(provvisorio — D-048)* Ognuno riceve sul telefono tre obiettivi personali e ne sceglie uno; la partita inizia quando tutti hanno scelto (o allo scadere del tempo, con scelta a caso).

### 7.2 Il trimestre

| Fase | Cosa succede | Dove |
|---|---|---|
| **1. Rapporto** | Ognuno vede l'effetto delle proposte sul proprio reparto ed eventuali segreti; la TV annuncia quali informazioni servono e a chi *(D-061)* | Telefono + TV |
| **2. Presentazione** *(D-068)* | Le tre proposte compaiono **una alla volta** in TV (titolo e costo) e sui telefoni (effetto sul proprio reparto) | TV + telefono |
| **3. Discussione e voto del pacchetto** *(D-068)* | **Discussione** a voce per al massimo X minuti ⚖️ (4), con messaggi privati; poi **voto segreto del pacchetto**, palese alla chiusura; se serve, **secondo voto** sul pacchetto principale (§8.3) | Voce + TV + telefono |
| **4. Mossa privata** | Scelta segreta: interesse personale o aziendale | Telefono |
| **5. Risultati** | Corsa di mercato, mosse dei concorrenti, quanti hanno giocato per l'azienda nella mossa privata *(D-061)*, effetto reale delle proposte con la frase che lo spiega *(D-033)*. *(D-029: nel 4° trimestre i **numeri** del mercato restano nascosti e si scoprono solo al punteggio, dopo il finale; le fughe di notizie e il conteggio della mossa privata si annunciano subito, senza numeri del mercato: "un'informazione è finita a [concorrente]: «titolo»")* | TV |

~~6. Demansionamento~~ *(eliminato, D-057)*.

⚖️ Durata indicativa di un trimestre: 10–12 minuti, con timer gestiti dal gioco.

❌ *(D-068)* ~~Un ciclo discussione → voto per ogni proposta (D-008)~~: sostituito da **una discussione e un voto del pacchetto per trimestre**.
⚖️ *(D-066)* Durata dei timer (discussione, voto, mossa privata) in config, da tarare: la fase si chiude appena tutti hanno agito; chi ha creato la partita ha "Pausa" e "Avanti". Negli ultimi secondi del voto il telefono dà un preavviso chiaro.

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
✅ A fine trimestre la TV mostra **l'effetto reale sull'azienda**, con una **frase che spiega perché** *(D-033)*, e si scopre chi aveva esagerato.

**Esempio:**
> TV: *"Nuovo macchinario — costo 50 K"*
> - Produzione vede: **−2** per il tuo reparto
> - Vendite vede: **+3** per il tuo reparto
> - Finanza vede: **−1** per il tuo reparto
> - Marketing vede: *"Il mercato sta calando: effetto sull'azienda inferiore al previsto"*

✅ Le scelte **non devono mai essere ovvie**: ogni proposta deve avere vincitori e perdenti tra i reparti.

✅ *(provvisorio, da rivalutare dopo le serate di prova — D-023)* **I quesiti nascono dall'effetto.** Ogni quesito ha uno **schema** (per esempio "un reparto guadagna molto, due perdono poco"); **i ruoli si assegnano ai reparti**, solo tra i reparti occupati; *(D-069)* l'assegnazione si fa **a inizio partita per tutte le 12 carte** con l'algoritmo di equità (§8.6). Così tutti i reparti sono uguali per costruzione, a qualsiasi numero di giocatori. Il significato (testo) per ciascun reparto viene da frasi su misura del quesito, se ci sono, o da frasi predefinite del reparto.
✅ *(provvisorio, da verificare nelle serate — D-030, D-031, D-032)* **Contenuti dei quesiti:** 40 quesiti con titoli vivi "a più facce" e **frasi su misura per tutti i reparti** (effetto positivo e negativo). Il titolo **non rivela l'effetto sull'azienda**: ogni proposta deve reggere sia come buona idea sia come spreco. Frase privata: seconda persona, ~85 caratteri, cosa succede al tuo reparto e perché, mai l'effetto sull'azienda. Schede complete: [contenuti/quesiti.md](contenuti/quesiti.md).
✅ *(provvisorio, ⚖️ da verificare col simulatore e nelle serate — D-045)* **Due versioni per quesito:** a ogni partita un quesito esce con il suo schema principale o con un **alternativo** (⚖️ 50%), con un effetto diverso sull'azienda e una propria frase di spiegazione. Così l'effetto non si impara a memoria tra una serata e l'altra. Nel mazzo ogni schema compare lo stesso numero di volte nelle due versioni.
🔴 Da ripensare (punto aperto 29): le **informazioni di contesto** di alcuni reparti (es. il Marketing vede l'andamento del mercato) con i quesiti generici, insieme all'identità dei reparti (punto 5).

### 8.3 Il voto del pacchetto *(provvisorio, da verificare col simulatore e nelle serate — D-068)*
✅ **Ognuno vale 1 e votano tutti i membri del direttivo.** I pesi dei reparti non esistono più.
1. **Primo voto, segreto.** Sul telefono ognuno sceglie un **pacchetto**: una combinazione delle tre proposte che costi **almeno 51 K** ⚖️ e **non superi la cassa**. Con 100 K i pacchetti possibili sono due (80 oppure 30+50); con il tesoretto se ne aggiungono altri (30+80 da 110 K, 50+80 da 130 K, tutte e tre da 160 K).
2. Quando tutti hanno votato (o allo scadere del tempo) la TV mostra **chi ha votato cosa**.
3. Se un pacchetto ha i voti di **più della metà dei membri del direttivo** (50%+1, contati sui membri: chi non vota non aiuta nessun pacchetto), viene **approvato**.
4. Altrimenti si va al **secondo voto**: il **pacchetto principale** è il **più votato** al primo voto (a parità, estratto tra i più votati); l'**alternativa** è estratta a caso tra gli altri pacchetti validi ed è mostrata **coperta** (la TV dice quante proposte contiene, non quali). Si vota **sì / no** al principale: con più della metà dei membri a favore passa il principale, altrimenti passa l'**alternativa**. **Chi non vota in tempo vale "no"**: non approva il principale e accetta l'alternativa.
5. Il voto si chiude **sempre** con un pacchetto valido: il minimo da investire è sempre rispettato.

✅ Conseguenza accettata (Luis): con 100 K i pacchetti validi sono solo due, quindi nel 1° trimestre l'alternativa coperta è di fatto nota e il secondo voto è uno spareggio; dal 2° trimestre, con il tesoretto, diventa un'incognita.

### 8.4bis Tempo scaduto (niente astensione)
✅ *(provvisorio — D-060)* **Solo SÌ / NO**: l'astensione non esiste *(i quesiti "con astensione" di D-007, D-013 e D-034 sono eliminati)*.
✅ *(D-029, D-060)* Principio unico: **il tempo scaduto conserva lo stato delle cose**. Nel voto del pacchetto chi non vota non sostiene nessun pacchetto e al secondo voto vale **"no"** (passa l'alternativa, D-068); nel finale chi non risponde alla domanda "C'è una spia?" vale **"No"** e chi non fa un nome non vota. Le uniche scelte predefinite che non sono voti: mossa privata = "per l'azienda" (D-020), obiettivo = estratto a caso (D-048).

### 8.5 Voto palese
✅ Il voto è **palese**: in TV si vede chi ha votato cosa. Le votazioni sono il cuore delle discussioni.
✅ *(provvisorio, da verificare nelle serate — D-019)* Durante la votazione la TV mostra solo **chi ha già votato**, non cosa. Il voto si può **cambiare fino alla chiusura**. Alla chiusura la TV **rivela tutti i voti insieme** (chi ha votato cosa): un momento di scena.
✅ Rarissime eccezioni con voto segreto, legate a eventi speciali (per esempio "votazione anonima del consiglio").

### 8.6 Proposte del trimestre ed equità *(provvisorio, da verificare col simulatore — D-068, D-069, D-070)*
✅ **Tre proposte a trimestre, una per taglia: 30, 50 e 80 K** (12 carte a partita). Sostituisce la scaletta 2-3-3-2 di D-014.
✅ **Valore proporzionale al costo (D-070).** La grande vale quanto le due piccole insieme: nei **punti dei reparti** in modo esatto (totale dei bonus e totale dei malus della carta da 80 = somma di quelli delle carte da 30 e 50 dello stesso trimestre); per l'**azienda** solo **in media** (ogni carta ha il suo effetto nascosto, anche negativo, così la scelta del trimestre conta e si può sbagliare). Indicativamente ⚖️ bonus + malus di una carta: circa 3 punti per la piccola, 5 per la media, 8 per la grande.
✅ **Algoritmo di equità (D-069).** A inizio partita il gioco sceglie le 12 carte (e la loro versione, D-045) e assegna i ruoli ai reparti occupati in modo che, **sulla somma delle 12 carte**, ogni reparto riceva **lo stesso totale di bonus e lo stesso totale di malus** (differenza massima **1 punto** se la parità esatta è impossibile). Se un reparto finisce penalizzato è per le scelte dei giocatori, mai per le carte.
✅ **Reparti smistati (D-069).** Nello stesso trimestre si evita che un reparto abbia un bonus sia nella grande sia nelle due piccole: il pacchetto deve mettere reparti diversi uno contro l'altro. I bonus di ciascun reparto si distribuiscono tra trimestri diversi.
✅ Vincoli dell'estrazione che restano: trimestri ammessi del quesito, categorie diverse nello stesso trimestre, nessun ruolo ai reparti vacanti (D-006).
~~✅ *(D-071)* Contenuti da riscrivere a regole fissate~~ → ✅ *(provvisorio, numeri ⚖️ tarati col report 14 — D-077)* **Famiglie di schemi:** per ogni costo quattro famiglie distinte dall'effetto sull'azienda, **buon affare / investimento / neutro / spreco** (30 K: +2 / +1 / 0 / −1 · 50 K: +3 / +2 / 0 / −2 · 80 K: +6 / +2 / 0 / −3). Ogni quesito ha, nella versione principale e nell'alternativa, la famiglia coerente con la sua frase per la TV; il modo in cui bonus e malus si dividono tra i reparti (la "forma") si estrae a ogni partita, così il proprio numero sul telefono non rivela la famiglia. Dettagli: [contenuti/quesiti.md](contenuti/quesiti.md).
❌ ~~Bilanciamento dei favoriti (D-014)~~: sostituito dall'algoritmo di equità.

---

## 9. La mossa privata

✅ Una scelta segreta per giocatore a ogni trimestre:

| Scelta | Effetto sul mio reparto | Effetto sull'azienda |
|---|---|---|
| **Spingo il mio reparto** | ⚖️ +1 | ⚖️ −1 |
| **Gioco per l'azienda** | ⚖️ 0 | ⚖️ +1 |

✅ *(provvisorio, da verificare nelle serate — D-061)* **La TV mostra quanti hanno giocato per l'azienda**: *"3 su 5 hanno giocato per l'azienda"*. Non si sa chi: partono le domande ("Io ho giocato per l'azienda. E tu?"), gli onesti devono difendersi e la spia si nasconde dietro gli egoisti veri. *(Sostituisce "in calo / stabile / in crescita".)*

✅ Il sabotaggio della spia e l'egoismo di un onesto **si confondono**: è l'ambiguità voluta.

✅ *(provvisorio, da verificare col simulatore — D-020)* Chi non sceglie entro il tempo gioca **per l'azienda**.
✅ *(provvisorio — D-020)* I **reparti vacanti non fanno la mossa privata** (coerente con D-006: i vacanti non entrano nei conti).

⚖️ I valori sono una prima ipotesi. Contano soprattutto il **rapporto tra guadagno personale e valore della vittoria aziendale** e quanto è combattuta la corsa con i concorrenti.

🟡 Variante: eventi che cambiano i valori per un trimestre ("questo trimestre l'egoismo vale doppio"), per evitare la ripetitività.

---

## 10. Messaggi privati

### 10.1 Regole
✅ L'audio è condiviso con tutti. I **messaggi privati** passano da telefono a telefono.
✅ I messaggi sono **limitati**: 🟡 2 per giocatore a trimestre, non accumulabili.
✅ **Messaggio anonimo**: costa entrambi i messaggi del trimestre.
✅ **A fine partita tutti i messaggi vengono resi leggibili a tutti**, anonimi compresi (con il nome del mittente).
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
✅ *(provvisorio — D-036, D-037)* **Valori variabili:** ogni segreto ha uno o due campi (almeno uno è un numero o una data) e 3–4 valori possibili per campo; **il dato vero si estrae campo per campo a ogni partita**, quindi non si impara a memoria e un falso "mescolato" è indistinguibile da un vero. Chi inoltra una copia modificata trova sul telefono i **valori suggeriti** di ogni campo (o ne scrive uno libero); l'elenco non indica quale sia il vero.

### 11.5 Regole di dettaglio
✅ *(provvisorio, da verificare col simulatore — D-072, modifica D-021)* Un segreto **non è più collegato a una proposta**: vale per l'azienda se arriva (in versione vera) al reparto a cui serve **entro la fine del trimestre successivo** a quello in cui è uscito. La stessa scadenza vale per la spia che vuole passarlo al concorrente. **Il 4° trimestre non distribuisce nuovi segreti**: vi scadono solo quelli del 3°.
✅ *(provvisorio, da verificare col simulatore — D-074)* **Un vero e un finto.** Ogni trimestre (dal 1° al 3°) escono **due segreti: uno vero e uno finto**, dello **stesso tipo** (stessi valori). Nessuno sa quale sia il finto, tranne la spia per il suo: **un segreto in cui la spia è fonte o destinataria è sempre il finto** (la spia sta al massimo in un segreto per trimestre); se la spia non è coinvolta, il finto si estrae a caso. Fonte e destinatario si distribuiscono in modo che ogni giocatore, spia compresa, sia coinvolto lo stesso numero di volte.
- Il finto **non vale nulla per l'azienda**; se finisce al concorrente gli costa **−4**, come una copia falsificata.
- La TV annuncia sempre **"l'informazione X è arrivata a destinazione"**, per un dato vero, finto o manomesso.
- Il valore dei due segreti di un trimestre si conta **insieme, alla scadenza** (fine del trimestre successivo), non all'arrivo: consegnarli in momenti diversi non rivela quale era vero.
- Sparisce l'etichetta "dato certo" (D-035): nessuno sa se il proprio segreto è vero. Falsificazioni e trappola del canarino restano.
✅ *(provvisorio, ⚖️ da verificare col simulatore — D-073)* **Catena minima:** un segreto non si consegna mai di prima mano al reparto che ne ha bisogno; deve passare da almeno **X colleghi** diversi (mai la fonte né il destinatario). X dipende solo dal numero di giocatori ed è scritto in TV: **4 → 1 · 5 → 1 · 6 → 2 · 7 → 2 · 8 → 2** ⚖️ (rischio "alla cieca" di passare dalla spia tra il 38% e il 50%). Il telefono dice **quanti passaggi mancano** e **disattiva** chi ha già ricevuto quel segreto: gli ultimi anelli sanno da chi è passato, ma non chi l'ha eventualmente manomesso.
✅ *(provvisorio, da verificare nelle serate — D-061)* **Annuncio in TV:** nel Rapporto la TV annuncia ogni segreto del trimestre e il reparto a cui serve, ma **non chi l'ha ricevuto**: *"Ufficio Vendite ha bisogno di informazioni sull'offerta della gara di primavera prima della scadenza!"* (D-072: la scadenza è la fine del trimestre successivo). Il reparto interessato sa che deve aspettarsi qualcosa e chiede in giro; chi ha il dato deve decidere se consegnarlo, tenerlo o mentire.
✅ *(provvisorio — D-021, D-061)* Quando un segreto arriva in tempo, la TV dice **quale** è arrivato, **senza il numero** *(D-038: il "+N" rivelerebbe il tipo del segreto)*; la quota di mercato si aggiorna comunque.
✅ *(provvisorio — D-021, D-072)* La spia può passare un segreto al concorrente **entro la stessa scadenza** (fine del trimestre successivo); l'effetto si vede ai Risultati, e la TV dice quale segreto il concorrente ha usato (§11.3).
✅ *(D-005, D-024)* **Fonte e reparto utile di ogni segreto si scelgono al momento della distribuzione**, tra i reparti con un direttore attivo (come i quesiti, D-023); le fonti si distribuiscono in modo equilibrato. Chi possiede una copia vede a quale reparto serve.
⚖️ Da tarare: 2 segreti a trimestre (uno vero e uno finto, D-074; nessuno nel 4°), penalità **4** per il concorrente che usa un dato falso *(D-056, era 2: "forti rallentamenti")*.
✅ *(provvisorio, numeri ⚖️ da verificare col simulatore — D-035…D-039)* **Lista dei segreti e loro valore:** 36 segreti con titoli "da corridoio aziendale" (nessun reparto nel titolo); 28 escono in qualsiasi trimestre, 4 solo in T1–T2, 4 solo in T3–T4. Ogni scheda porta scritto il suo **tipo "a bilancia"**:

| Tipo | Azienda se arriva in tempo | Concorrente se esce | Punti alla spia se usato |
|---|---|---|---|
| Da far girare | +2 | +1 | 1 |
| Normale | +1 | +2 *(D-056: ripristinato dopo D-054)* | 2 |
| Da custodire | +1 | +3 *(D-056: ripristinato dopo D-054)* | 3 |

~~Mai due "da custodire" nello stesso trimestre~~ *(D-074: i due segreti del trimestre hanno sempre lo stesso tipo, D-039 superata)*. Lista completa: [contenuti/segreti.md](contenuti/segreti.md).
✅ *(provvisorio, da verificare col simulatore — D-015)* **Provenienza visibile:**
- ~~un segreto distribuito dal gioco porta l'etichetta "dato certo"~~ *(D-074: eliminata, ogni trimestre uno dei due segreti è finto)*; chi lo riceve dal gioco vede "arrivato al tuo reparto";
- un segreto ricevuto da un altro giocatore mostra il mittente diretto ("da Marco", oppure "anonimo"); *(D-073)* il telefono mostra anche **quanti passaggi mancano** e, per l'inoltro, **disattiva chi ha già ricevuto** quel segreto: la catena diventa in parte ricostruibile, chi l'ha manomessa no.
✅ *(provvisorio, ⚖️ — D-038)* Punti alla spia per un segreto usato: secondo il tipo (1 / 2 / 3), vedi tabella sopra.

---

## 12. I concorrenti

✅ 1 o 2 concorrenti, **gestiti dal computer**, visibili in TV nella corsa di mercato.
✅ Avanzano grazie ai segreti ricevuti dalle spie, e perdono punti con i segreti falsi.
✅ *(provvisorio, da verificare col simulatore — D-011)* **1 concorrente da 4 a 7 giocatori, 2 concorrenti con 8.** Il numero dipende solo dal numero di giocatori, così non rivela quante spie ci sono.
✅ *(provvisorio — D-011)* **Il concorrente di una spia vince se a fine anno supera l'azienda**, anche se non supera l'altro concorrente. Con due spie rivali possono quindi vincere entrambe.

✅ *(provvisorio, ⚖️ — D-054, D-056)* **Il concorrente avanza quanto l'azienda media**: a ogni trimestre cresce quanto crescerebbe l'azienda se il direttivo facesse il **45%** ⚖️ di scelte aziendaliste (effetto medio delle mosse private, delle proposte approvate e dei segreti arrivati in tempo), più un evento casuale. Accelera con i segreti veri ricevuti dalle spie (+1 / +2 / +3) e frena forte con quelli falsi (−4). Senza spie, quindi, l'azienda vince se gioca per l'azienda più del 45% delle volte. La vittoria dell'azienda senza spie non è un obiettivo di taratura: ogni giocatore punta a vincere personalmente (D-054).

🔴 Da definire:
- il comportamento di base: crescita propria, eventi, casualità;
- quanto deve essere combattuta la corsa. ⚖️ È la "manopola" principale dell'equilibrio del gioco.

---

## 13. Demansionamento e promozione — eliminato

❌ *(D-057)* **Demansionamento e promozione non esistono più.** Durante la partita nessuno perde il voto; l'unico licenziamento avviene nel finale (§15). Superate D-009, D-010, D-012, D-022 (parti sul demansionamento) e D-028.

---

## 14. Autogestione

✅ Un reparto in **autogestione** è un reparto **non occupato** (partite con pochi giocatori) *(D-057: i demansionati non esistono più)*.

✅ Al tavolo non arrivano proposte specifiche per i reparti in autogestione, che non fanno la mossa privata e non accumulano punti.

✅ *(D-006, D-068)* I reparti vacanti non votano e non ricevono ruoli nelle carte; con il voto a una testa la soglia si conta sui membri del direttivo.

---

## 15. Il finale: rinnovo dei contratti

### 15.1 Sequenza *(provvisoria, da verificare col simulatore e nelle serate — D-058)*

1. **La domanda.** Ogni membro del direttivo risponde: **"C'è una spia nel direttivo?"** Sì / No. **Voto palese**: la TV mostra chi ha votato cosa quando hanno votato tutti. **Chi non risponde in tempo vale "No"** (il tempo scaduto conserva lo stato delle cose).
2. Se i **sì sono almeno la metà** dei membri (50/50 = si procede), si passa ai nomi; altrimenti il gioco passa al punteggio.
3. **I nomi.** Ognuno indica in segreto un collega (non sé stesso). La TV rivela i nomi **uno alla volta**. Chi non fa un nome in tempo non vota.
4. Chi raccoglie **più della metà dei nomi fatti** (metà più uno, contata sui votanti) viene **licenziato**; il suo ruolo **non si rivela subito**, ma al punteggio *(D-078)*.
5. **Ballottaggio.** Altrimenti vanno al ballottaggio il più nominato e il secondo; con pari merito vanno tutti (in testa o al secondo posto). **Chi è al ballottaggio non vota**; se fuori dal ballottaggio non resta nessuno a votare, votano anche i candidati (non per sé stessi). Viene licenziato chi ha **più voti da solo** (con due candidati: metà più uno dei voti dati; con tre o più basta la maggioranza relativa, es. 2-1-1).
6. **Stallo con due candidati:** si rivota una volta; al secondo stallo **vengono licenziati entrambi**.
   *(D-063)* Un turno di ballottaggio in cui **nessuno vota** non è uno stallo: si ripete una volta lo stesso turno, con l'avviso in TV; se anche la ripetizione resta senza voti, **non viene licenziato nessuno** (vale a due e a tre candidati).
7. **Stallo con tre o più candidati:** si rivota tra chi è ancora in testa, con un **avvertimento** ben chiaro in TV: se non c'è accordo si farà un'**ultima votazione** in cui chi ha votato **lo stesso nome nelle due votazioni precedenti non potrà votarlo** (chi ha cambiato voto ha tutti i nomi disponibili), e se lo stallo si ripete **non verrà licenziato nessuno**. Chi entra in questo percorso ci resta anche se la parità si restringe a due.
8. **Con 8 giocatori** (possibili due spie): se nel primo giro è stato licenziato **uno solo**, si ricomincia dal punto 1 (*"C'è ancora una spia?"*). Se ne sono stati licenziati due, o nessuno, il secondo giro non si fa.

### 15.2 Regole del finale
✅ **Votano solo i membri del direttivo** non licenziati. I licenziati possono solo suggerire e confondere.
✅ *(provvisorio — D-029)* **Il finale si gioca senza conoscere l'esito della corsa di mercato**: i numeri del 4° trimestre si scoprono al punteggio; le fughe di notizie e il conteggio della mossa privata del 4° trimestre si annunciano subito, perché sono indizi utili al finale *(D-061)*.
✅ Nel finale **ogni voto vale 1**, senza pesi di reparto.
✅ Si può nominare solo un membro del direttivo non licenziato, escluso sé stessi.
✅ *(D-078, scelta di Luis del 23/11/2026, modifica la regola precedente)* **Il ruolo dei licenziati non si rivela subito**, ma solo a gioco concluso, al punteggio (prima della classifica). Chi deve ancora decidere, per esempio nel secondo giro con 8 giocatori, non deve sapere se ha già eliminato una spia. Il licenziato conosce il proprio ruolo e può dire ciò che vuole (anche mentire).
✅ *(D-059)* **Nessun punto per le accuse**: nominare, votare o essere licenziati non dà né toglie punti. L'unica conseguenza è D-025: la spia licenziata non prende il bonus della vittoria del suo concorrente.

### 15.3 Dopo il finale
✅ Calcolo dei punteggi (§16).
✅ **Lettura di tutti i messaggi privati** scambiati durante la partita.
✅ *(provvisorio — D-047)* **Rivelazione degli obiettivi personali**: per ogni giocatore, obiettivo scelto, traguardi raggiunti e punti.

---

## 16. Punteggio

### 16.1 Struttura
✅ Punteggi e penalità a più livelli. ⚖️ Tutti i valori vanno tarati.

🟡 Principio: **il bonus aziendale vale più di qualsiasi obiettivo personale**. Così a un onesto non conviene mai far fallire l'azienda per i propri punti.

✅ *(provvisorio, da verificare col simulatore — D-051)* Per la spia il bonus "il concorrente vince" (+10) resta pari al massimo di un obiettivo (+10): aiutare l'azienda per l'obiettivo rischia di farla vincere, quindi il conto resta a favore del ruolo. **Si tarano le soglie degli obiettivi, non i punti**: facile raggiunto dal 60–70% di chi l'ha scelto, difficile dal 25–35%, i tre tipi con resa media simile.

✅ *(provvisorio — D-022)* **Pareggio** nella corsa di mercato a fine anno: **non vince nessuno** (niente bonus agli onesti né alla spia).
✅ *(provvisorio — D-022, D-046…D-052)* Il punteggio comprende ora gli **obiettivi personali** (§4.4), con i valori indicativi di questa sezione come segnaposto ⚖️. Ogni giocatore vede l'elenco delle voci che compongono il suo punteggio.

| Voce | Chi | Punti (indicativi) |
|---|---|---|
| Azienda batte i concorrenti | ogni onesto | +20 *(D-024: il bonus comune deve valere più del guadagno egoistico)* |
| Concorrente della spia vince (supera l'azienda, D-011) | spia **non licenziata** *(D-025: una spia scoperta ha perso; è l'unica conseguenza del licenziamento, D-059)* | +10 |
| Punti di reparto | tutti | accumulati in partita |
| Obiettivo personale (D-046: uno scelto fra tre) | tutti | tipo 1: +3 / +5 · tipo 2: +3 / +7 · tipo 3: +4 / +6 ⚖️ |
| Segreto passato al concorrente con successo | spia | +1 / +2 / +3 secondo il tipo *(D-038, ⚖️)* |
| Crisi o sconfitta aziendale causata | spia | 🟡 +2 per evento |

### 16.2 Esiti del finale

✅ *(provvisorio — D-059)* **Il finale non dà né toglie punti.** Sono stati eliminati: ±5 alla nomina, ±3 al voto sui demansionati, i bonus e le penalità della domanda di verifica, −5 all'onesto licenziato, −5 alla spia licenziata, +2 agli onesti per una spia licenziata, la penalità per chi demansionava un onesto. Resta solo che **la spia licenziata perde il +10** della vittoria del suo concorrente (D-025).

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
- Le tre proposte del trimestre (titolo e costo), i pacchetti possibili e la cassa; al secondo voto il principale e l'alternativa coperta (D-068)
- **Voti palesi** (chi ha votato cosa)
- Esito della mossa privata: quanti hanno giocato per l'azienda *(D-061)*
- Informazioni che girano e a quale reparto servono *(D-061)*
- Avviso fisso, in piccolo: "una spia potrebbe essersi infiltrata tra voi" *(D-061)*
- Effetti reali delle proposte e mosse dei concorrenti
- Stato dei direttori: attivo o licenziato; reparti vacanti in autogestione
- "Pausa caffè" ☕
- Indicatore di **chi sta parlando** (fase online)
- Finale: domanda "C'è una spia?", nomi e ballottaggi rivelati uno alla volta, ruoli dei licenziati (svelati al punteggio, D-078)
- Punteggi e lettura dei messaggi

### 17.2 Telefono (privato)
- Ruolo, reparto, fazione (e altre spie dello stesso concorrente)
- Obiettivi segreti
- Effetti privati delle proposte sul proprio reparto
- Informazioni di contesto del reparto
- Segreti ricevuti (veri o falsi, senza saperlo)
- Messaggi: invio, ricezione, quota residua, anonimato
- Pulsanti di voto, mossa privata, domanda e nomi del finale
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
✅ *(D-030, D-031)* Le proposte devono avere titoli coloriti e memorabili, "a doppia faccia" (non rivelano l'effetto sull'azienda).

---

## 20. Punti aperti

| # | Tema | Stato |
|---|---|---|
| 1 | Lista proposte con effetti privati e pesi | ✅ provvisorio (D-030…D-034), da verificare nelle serate |
| 2 | Lista segreti e loro valore | ✅ provvisorio (D-035…D-039), numeri ⚖️ |
| 3 | Obiettivi personali (anche per le spie) | ✅ provvisorio (D-046…D-052), soglie ⚖️ |
| 4 | Comportamento dei concorrenti | ✅ provvisorio (D-054, D-056), numeri ⚖️ |
| 5 | Poteri speciali dei reparti (riallineare al modello a tre numeri) | 🔴 rinviato a dopo le prime serate (D-064): il prototipo si gioca senza poteri |
| 6 | Sovrapposizione Risorse Umane / IT | 🔴 rinviato (D-064) |
| 7 | Reparti da aggiungere con 6, 7 e 8 giocatori | 🔴 |
| 8 | ~~Voto per demansionare~~ | ❌ chiuso: demansionamento eliminato (D-057) |
| 9 | ~~Promozione~~ | ❌ chiuso (D-057) |
| 10 | Peso dei reparti vacanti nella soglia | ✅ provvisorio (D-006) |
| 11 | Ordine delle fasi (✅ provvisorio, D-008) e durata dei timer (⚖️) | ⚖️ timer in config, chiusura anticipata, pausa e avanti (D-066); valori da tarare nelle prove |
| 12 | Mozione personale per giocatore | 🟡 |
| 13 | Valori di mossa privata, cassa, bonus, penalità | ⚖️ |
| 14 | Probabilità di partita senza spie | ⚖️ |
| 15 | Equilibrio generale (simulatore) | ⚖️ |
| 16 | Titolo definitivo del gioco | 🔴 |
| 17 | Numero di votazioni per partita e dimensione del mazzo di quesiti, perché la selezione "reparti occupati" (D-006) funzioni con ogni numero di giocatori | ✅ provvisorio (D-014) |
| 18 | 💡 Idea da valutare: bot che occupano i reparti (anche con 3 umani), con livello da 1 = "solo interesse aziendale" a 5 = "solo interesse del reparto", e opzione d'avvio "i bot possono essere spie sì/no" | ✅ provvisorio per il prototipo (D-065): robot del simulatore, opzione "bot spia sì/no" (predefinita sì), carattere rivelato a fine partita; livelli 1–5 rinviati |
| 19 | ~~Quesiti "con astensione vera"~~ | ❌ chiuso: astensione eliminata (D-060) |
| 20 | 💡 Idea da valutare: "livello di fiducia" 1–5 mosso dalle mosse private; a 5 "scudo sociale" contro il demansionamento | ❌ chiuso (D-057) |
| 21 | ~~Soglia del voto di demansionamento/promozione~~ | ❌ chiuso (D-057) |
| 22 | 💡 Idea da valutare (da discutere quando si costruiscono i reparti): Risorse Umane con peso 2 nei voti di demansionamento/promozione — **oppure, variante, voto decisivo in caso di pareggio** — e punti extra o penalità nel finale per spie scoperte o innocenti accusati. Da confrontare con D-009 (1 a testa) e D-005 | 🔴 da valutare *(D-057: la parte sui voti di demansionamento cade; D-059: per ora nessun punto nel finale)* |
| 23 | ~~Numero massimo di demansionati~~ | ❌ chiuso (D-057) |
| 24 | Poteri di IT e Risorse Umane (chi scrive a chi): valgono anche per i messaggi anonimi? Da decidere con i punti 5–6 | 🔴 rinviato (D-064) |
| 25 | 💡 Idea da valutare (sviluppo successivo): mini-sfide sul telefono con bonus/penalità (quiz, giochini a tema: "evita ostacoli", "evadi pratiche"…) contro noia e ripetitività | 🔴 da valutare |
| 26 | Cassa non spesa: si accumula nel trimestre successivo o si azzera? | ✅ provvisorio (D-018) |
| 27 | Voto palese: voti mostrati man mano o tutti alla chiusura; voto modificabile prima della chiusura? | ✅ provvisorio (D-019) |
| 28 | Mossa privata dei reparti vacanti (no) e scelta predefinita a tempo scaduto (per l'azienda) | ✅ provvisorio (D-020) |
| 29 | Informazioni di contesto dei reparti (es. Marketing e mercato) con i quesiti generici di D-023 | 🔴 |
| 30 | Spia scoperta (licenziata): conserva il bonus "il suo concorrente vince"? Oggi sì (+10, poi −5); il criterio di vittoria indicato da Luis dice che una spia scoperta ha perso | ✅ provvisorio (D-025: niente bonus alla spia licenziata) |
| 32 | Scadenza dei segreti con il voto unico del trimestre | ✅ provvisorio (D-072): fine del trimestre successivo, anche per la spia; 4° trimestre senza nuovi segreti |
| 34 | Segreti che coinvolgono la spia | ✅ provvisorio (D-074): coppia vero/finto a ogni trimestre, quello della spia è sempre il finto; con 4 giocatori da verificare col simulatore |
| 33 | Riscrittura di obiettivi e quesiti per il voto del pacchetto (D-071) | ✅ provvisorio: obiettivi D-076, quesiti D-077; implementati e tarati (report 14) |
| 31 | Gli onesti egoisti vincono più spesso dei cooperativi (simulazione 04: 23% contro 9%) perché il bonus aziendale va a tutti gli onesti. Alternative: A) bonus proporzionale alle mosse "per l'azienda" · B) ridurre il guadagno della mossa "reparto" · C) lasciare così e contare sulle accuse | ⏸️ per ora C (Luis, 22/11/2026): si osserva nelle serate di prova. *(D-061: il conteggio "3 su 5 per l'azienda" rende l'egoismo nascosto meno comodo.)* |

---

## 21. Glossario

| Termine | Significato |
|---|---|
| **Direttivo** | Il tavolo dei direttori che votano |
| **Reparto** | Il settore aziendale di un giocatore |
| **Peso** | Il valore del voto di un reparto in un certo tipo di votazione (2, 1, 0) |
| **Pacchetto** | Combinazione delle proposte del trimestre che si vota insieme (almeno 51 K, entro la cassa — D-068) |
| **Soglia** | Più della metà dei membri del direttivo (D-068) |
| **Effetto privato** | Conseguenza di una proposta visibile solo al reparto interessato |
| **Mossa privata** | La scelta segreta trimestrale tra interesse personale e aziendale |
| **Segreto** | Informazione concreta generata dal gioco, vera o falsa |
| **Trappola del canarino** | Dare versioni diverse di un dato a persone diverse per scoprire chi lo fa trapelare |
| **Autogestione** | Reparto guidato dal computer |
| **Licenziamento** | Esclusione decisa nel finale ("rinnovo dei contratti"); il ruolo si scopre a fine partita (D-078) |
| **Ballottaggio** | Nuova votazione tra i più nominati quando nessuno ha raccolto più della metà dei nomi |
| **Noise gate** | Filtro che lascia passare solo le voci forti e vicine |
| **Premi-e-parla** | Il microfono si attiva solo mentre si preme (o dopo un tocco) |
