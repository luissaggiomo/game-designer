# Contenuti dei quesiti — bozza di lavoro

> Punto aperto 1 del GDD. Sessione dedicata ai **testi** dei quesiti (titoli, frasi private,
> frasi generiche). Le decisioni qui sotto sono **bozze** (numeri D-030…D-034 riservati a questa
> sessione): la sessione di integrazione le riporterà in `DECISIONI.md` e nel GDD.
>
> Vincoli rispettati: non si toccano schemi, costi, numeri degli effetti, trimestri, codice.

## Vincoli tecnici rilevati (dal motore, sola lettura)

- Ogni quesito può avere `testi[REPARTO].positivo` / `.negativo`: **una frase per reparto e per segno**.
  Se manca, il motore usa una frase a caso di `frasi.json` per quel reparto e segno.
- La frase non distingue l'intensità (+3 o +1): il numero lo mostra il telefono accanto alla frase.
- I reparti senza ruolo vedono la frase `neutro`.
- In TV vanno solo titolo, costo, pesi (GDD §8.2).

## Decisioni (bozza)

### D-030 — Legame tra titolo e reparti
- Stato: ✅ scelta di Luis (22/11/2026): **B** — bozza da riportare in DECISIONI.md
- Domanda: con i ruoli estratti a caso (D-023), il titolo può parlare di un tema preciso
  ("Fiera di settore") anche se a guadagnarci esce, per esempio, la Produzione?
- Alternative: A) titoli generici · B) titoli vivi + frasi su misura per ogni reparto ·
  C) titoli vivi + frasi su misura solo per i reparti "naturali", generiche per gli altri.
- Scelta: **B**, con titoli "a più facce" (temi che toccano credibilmente molti reparti).
  Metodo: campione di 5 quesiti completi letto da Luis; se approvato, compilazione di tutte le schede.
- Conseguenze: ogni quesito ha `testi` per tutti gli 8 reparti e i due segni (16 frasi);
  `frasi.json` resta come rete di sicurezza.

### D-031 — Il titolo non deve rivelare l'effetto sull'azienda
- Stato: ✅ scelta di Luis (22/11/2026): **B** — bozza da riportare in DECISIONI.md
- Domanda: il titolo deve far capire se la proposta conviene all'azienda (schema egoistico/aziendale)?
- Alternative: A) titolo "sincero" · B) titolo "a doppia faccia" · C) misto.
- Scelta: **B**. Ogni titolo deve stare in piedi sia come buona idea sia come spreco; l'ironia sta
  nel tono, non nel rivelare l'effetto. Così la discussione serve e un onesto può difendere una
  proposta egoistica per motivi veri ("onesti ambigui").
- Conseguenze: titoli cambiati (identificativi interni invariati):
  - "Budget extra per il reparto più convincente" → "Fondo per l'innovazione interna"
  - "Auto aziendale nuova (una sola)" → "Auto di rappresentanza per le visite ai clienti"
  - "Premio di produzione per un solo reparto" → "Premio di risultato legato agli obiettivi"
  - "Ufficio nuovo per un solo direttore" → "Ristrutturazione del piano direzionale"
  - "Fusione di due reparti per un anno" → "Prestito di personale tra reparti per un anno"
    (con due vincitori estratti a caso la "fusione" non reggeva)
- Rischio residuo (fuori perimetro, per l'integrazione): lo schema è fisso per quesito, quindi chi
  gioca molte serate impara "titolo → effetto". Possibile rimedio nel motore: schema estratto tra
  due possibili al momento dell estrazione.

### D-032 — Forma e tono della frase privata
- Stato: ✅ approvata da Luis tramite il campione (22/11/2026) — bozza
- Regole: seconda persona; massimo ~85 caratteri (circa 2 righe sul telefono); ogni frase dice
  **cosa succede al tuo reparto e perché**; tono ironico aziendale; la stessa frase vale per
  qualsiasi intensità (+1…+4, −1…−3), il numero lo mostra il telefono; se lo schema ha più
  vincitori la frase positiva non rivendica l'esclusiva (due onesti sinceri non devono
  contraddirsi); nessuna frase rivela l'effetto sull'azienda.
- Nota: negli schemi AZIENDALE (nessun vincitore) le frasi positive oggi non escono mai; sono
  scritte lo stesso, pronte se in futuro lo schema cambiasse.

### D-033 — Frase di spiegazione in TV per l'effetto reale
- Stato: ✅ scelta di Luis (22/11/2026): **B** — bozza da riportare in DECISIONI.md
- Domanda: ai Risultati la TV deve spiegare perché una proposta approvata ha avuto quell'effetto?
- Alternative: A) nessuna frase · B) una frase su misura per quesito · C) frasi generiche per tipo di esito.
- Scelta: **B**. Principio "il computer nasconde i conti, mai il perché"; chiude il cerchio dei
  titoli a doppia faccia (D-031).
- Regole: la frase parla **solo dell'azienda**, mai di un reparto (non rivela effetti privati);
  il tono segue il numero (−1 flop, 0 in pari, +1 piccolo, +2 buono, +3 grande); massimo ~85 caratteri.
- Dati: nuovo campo `spiegazione` in `proposte.json` (una frase per quesito: l'effetto aziendale
  è fisso per schema). **Il motore oggi lo ignora**: va collegato (vedi riepilogo).

### D-034 — Quali quesiti ammettono l'astensione
- Stato: ✅ scelta di Luis (22/11/2026): **C** — bozza da riportare in DECISIONI.md, **da verificare col simulatore**
- Domanda: i quesiti "con astensione" (D-013, ~15%) sono quelli giusti?
- Alternative: A) lasciare i 5 attuali · B) spostare l'astensione dal Corso al Premio di risultato ·
  C) aggiungerla al Premio di risultato mantenendo il Corso.
- Scelta: **C**. 6 quesiti su 40 = 15% (come da GDD §8.4bis). Due tipi di motivo legittimo:
  - **coscienza:** Settimana corta, Videosorveglianza, Riunione del lunedì, Codice di abbigliamento,
    Corso di formazione obbligatorio;
  - **conflitto d'interesse (nuovo):** Premio di risultato legato agli obiettivi (schema EGOISTICO):
    chi ci guadagna può astenersi "per correttezza", e una spia può fare lo stesso per sembrare corretta.
- Conseguenze sui numeri: nei quesiti con astensione tutti votano con peso 1 (D-013), quindi il
  Premio perde il peso 2 del vincitore. Piccolo cambio di meccanica: **non simulato** in questa sessione.

## Schede complete (40 quesiti × 8 reparti × 2 segni = 640 frasi + 40 spiegazioni)

Fonte di verità: `packages/content/proposte.json` (campi `testi` e `spiegazione`). Questa è la copia leggibile.

#### Nuovo gestionale aziendale (l'ennesimo) — 60 K · PROTAGONISTA (Un reparto guadagna molto, due perdono poco)

**In TV se approvata (+2):** Dopo tre mesi di lamentele il gestionale funziona: ordini più rapidi, meno errori

| Reparto | Se guadagna (+) | Se perde (−) |
|---|---|---|
| ACQUISTI | Il gestionale lo configuri tu: ordini automatici e fornitori sotto controllo | Tutti i codici dei fornitori da reinserire a mano: settimane perse |
| PRODUZIONE | Il nuovo gestionale pianifica le tue linee: addio fogli Excel volanti | Gli operai registrano ogni pezzo su un tablet: produzione rallentata |
| VENDITE | Preventivi in un clic: i tuoi venditori arrivano prima dei concorrenti | Il listino nel nuovo sistema è sbagliato: offerte da rifare ai clienti |
| MARKETING | Finalmente i dati dei clienti in un posto solo: campagne mirate per te | Il sistema non dialoga con i tuoi strumenti: report fatti a mano |
| FINANZA | Bilanci in tempo reale: il tuo reparto diventa la torre di controllo | Due sistemi in parallelo per un anno: doppia contabilità sulle tue spalle |
| RISORSE_UMANE | Ferie e presenze gestite dal sistema: il tuo reparto si libera della carta | Il corso sul nuovo gestionale lo organizzi tu, e nessuno vuole farlo |
| RICERCA_SVILUPPO | Il gestionale traccia i tuoi progetti: finalmente il tuo lavoro si vede | Ogni ora di laboratorio va registrata su una commessa: burocrazia per te |
| IT_SICUREZZA | Il progetto lo guidi tu: budget, fornitore e gloria al tuo reparto | Migrazione dei dati nel weekend: il tuo reparto non dorme per un mese |

#### Riorganizzazione degli uffici in open space — 45 K · COPPIA (Due reparti guadagnano, uno perde molto)

**In TV se approvata (+1):** Rumoroso ma vivace: l'open space fa circolare qualche idea in più

| Reparto | Se guadagna (+) | Se perde (−) |
|---|---|---|
| ACQUISTI | Gli arredi li scegli tu: i fornitori ti fanno sconti anche sul resto | Arredi da ordinare in tre settimane: prezzi d'urgenza e fornitori scontenti |
| PRODUZIONE | Il tuo ufficio si sposta accanto all'ufficio tecnico: problemi risolti in metà tempo | L'ufficio di produzione finisce nel capannone, accanto alla pressa |
| VENDITE | I tuoi venditori siedono vicino a chi produce: risposte ai clienti più veloci | Telefonate con i clienti nel rumore dell'open space: trattative saltate |
| MARKETING | Le pareti nuove diventano la vetrina del marchio, e le firmi tu | Le tue riunioni creative ora le sentono tutti (e tutti dicono la loro) |
| FINANZA | Meno metri quadri, affitto più basso: il tuo bilancio ringrazia | Documenti riservati su scrivanie condivise: armadi blindati a carico tuo |
| RISORSE_UMANE | La gente si parla di più: meno conflitti tra reparti da gestire | Lamentele su rumore, aria condizionata e posti a sedere: tutte da te |
| RICERCA_SVILUPPO | Il tuo laboratorio ottiene lo spazio liberato dai vecchi uffici | Impossibile concentrarsi: i tuoi progetti rallentano di settimane |
| IT_SICUREZZA | Rete e cablaggi rifatti da zero: finalmente un impianto come dici tu | Cento postazioni da spostare e ricablare in un weekend: tocca a te |

#### Taglio del 10% alle spese generali — 25 K · SACRIFICIO (Un reparto paga, tre guadagnano un poco)

**In TV se approvata (+2):** Il taglio regge: conti più snelli e prezzi più competitivi

| Reparto | Se guadagna (+) | Se perde (−) |
|---|---|---|
| ACQUISTI | Rinegozi pulizie e cancelleria: parte del risparmio resta al tuo reparto | Il taglio colpisce le forniture: contratti da rifare tutti, e in fretta |
| PRODUZIONE | Meno burocrazia da pagare: recuperi budget per la manutenzione | Il taglio colpisce la manutenzione: macchine più vecchie e più fermi |
| VENDITE | Meno riunioni e meno moduli: i tuoi venditori stanno più tempo dai clienti | Tagliati trasferte e pranzi con i clienti: lavori a mani legate |
| MARKETING | Addio gadget inutili: il risparmio va nella tua prossima campagna | Il primo taglio è sempre la pubblicità: la tua campagna salta |
| FINANZA | Spese sotto controllo: chiudi il bilancio con meno affanno | Devi approvare ogni spesa sopra i 50 euro: settimane di lavoro e nemici ovunque |
| RISORSE_UMANE | Via i consulenti esterni: le selezioni tornano al tuo reparto, con il budget | Tagliati buoni pasto e formazione: le proteste arrivano tutte da te |
| RICERCA_SVILUPPO | Si taglia altrove: il tuo laboratorio viene dichiarato intoccabile | La ricerca «non rende subito»: il tuo budget è il primo a saltare |
| IT_SICUREZZA | Disdette le licenze software mai usate: i soldi passano al tuo reparto | Rinviato il rinnovo dei server: tiri avanti con macchine di dieci anni |

#### Progetto pilota con un cliente importante — 80 K · RISCHIO (Grande guadagno per un reparto, perdita sicura per un altro)

**In TV se approvata (0):** Il cliente è soddisfatto ma pretende lo sconto: tanto lavoro, guadagno zero

| Reparto | Se guadagna (+) | Se perde (−) |
|---|---|---|
| ACQUISTI | Il cliente ti apre i suoi fornitori: prezzi da grande gruppo anche per te | Il cliente impone materiali certificati: costano il doppio e li compri tu |
| PRODUZIONE | Il pilota si fa sulle tue linee: se va bene, ordini per tre anni | Pezzi su misura, tolleranze impossibili: la tua linea ferma per le prove |
| VENDITE | Il contratto lo firmi tu: il cliente più grosso dell'anno è tuo | Il cliente pretende un referente fisso: ti porta via il venditore migliore |
| MARKETING | Il caso di successo lo racconti tu: il marchio cresce col nome del cliente | Il cliente vieta di citarlo: niente comunicazione, e budget bloccato |
| FINANZA | Pagamento anticipato del cliente: la tua cassa respira | Il cliente paga a 180 giorni: il buco in cassa lo copri tu |
| RISORSE_UMANE | Il pilota attira talenti: i candidati migliori ora scrivono a te | Squadra dedicata da formare in un mese: straordinari e malumori per te |
| RICERCA_SVILUPPO | Il cliente finanzia il tuo prototipo e lo prova sul campo | Il cliente vuole modifiche ogni settimana: i tuoi progetti fermi |
| IT_SICUREZZA | Il pilota usa i tuoi sistemi: il cliente vuole comprarli anche lui | Il cliente vuole accedere ai nostri sistemi: controlli infiniti per te |

#### Consulenza strategica di una società famosa — 70 K · PAREGGIO (Due guadagnano poco, due perdono poco)

**In TV se approvata (+1):** Duecento slide, tre idee buone: qualcosa migliora davvero

| Reparto | Se guadagna (+) | Se perde (−) |
|---|---|---|
| ACQUISTI | I consulenti confermano che spendi bene: lo scrivono anche nelle slide | I consulenti propongono di centralizzare gli acquisti, a tue spese |
| PRODUZIONE | Il rapporto chiede più investimenti sulle tue linee | I consulenti cronometrano i tuoi operai: clima pessimo in reparto |
| VENDITE | I consulenti indicano il tuo reparto come motore della crescita | Nuovo metodo di vendita imposto dalle slide: i tuoi venditori smarriti |
| MARKETING | La parola chiave della consulenza è «marchio»: il budget pende verso di te | I consulenti rifanno il logo senza chiederti nulla |
| FINANZA | Il rapporto premia il rigore dei tuoi conti | Tre mesi di dati da preparare per i consulenti, più la loro fattura |
| RISORSE_UMANE | La consulenza raccomanda più formazione: budget in arrivo per te | Le slide parlano di «ottimizzare l'organico»: tutti vengono a chiedere a te |
| RICERCA_SVILUPPO | I consulenti scoprono il tuo progetto e lo mettono nella prima slide | La ricerca «va resa più efficiente»: obiettivi trimestrali per te |
| IT_SICUREZZA | Raccomandazione numero uno: investire nei sistemi. Cioè in te | I consulenti vogliono tutti i dati entro venerdì: estrazioni notturne per te |

#### Certificazione di qualità internazionale — 55 K · AZIENDALE (Buono per l'azienda, costa a due reparti)

**In TV se approvata (+3):** Con il bollino internazionale si aprono mercati nuovi: grande passo avanti

| Reparto | Se guadagna (+) | Se perde (−) |
|---|---|---|
| ACQUISTI | Fornitori certificati: meno controlli e meno contestazioni per te | Ogni fornitore va qualificato di nuovo: mesi di moduli per il tuo reparto |
| PRODUZIONE | Processi scritti e chiari: meno scarti sulle tue linee | Ogni passaggio di produzione va documentato: linee più lente |
| VENDITE | Con il bollino internazionale entri in gare prima vietate | I tuoi venditori compilano un questionario dopo ogni visita |
| MARKETING | Un bollino da mettere ovunque: materiale perfetto per le tue campagne | Brochure e sito da rifare per citare la norma esatta |
| FINANZA | Le banche apprezzano la certificazione: condizioni migliori per te | Ispettori che chiedono ogni fattura degli ultimi tre anni |
| RISORSE_UMANE | Ruoli e mansioni finalmente scritti: meno discussioni da gestire | Formazione obbligatoria sulla norma: la organizzi tu, la odiano tutti |
| RICERCA_SVILUPPO | I tuoi metodi di prova diventano lo standard aziendale | Ogni esperimento va verbalizzato: il laboratorio affoga nelle carte |
| IT_SICUREZZA | La norma richiede sistemi sicuri: arriva il budget che chiedevi | Backup, accessi e registri da dimostrare agli ispettori: tocca a te |

#### Fondo per l'innovazione interna — 40 K · EGOISTICO (Buono per un reparto, cattivo per l'azienda)

**In TV se approvata (-1):** Il fondo finisce in un progetto che interessa solo a chi l'ha voluto: soldi bruciati

| Reparto | Se guadagna (+) | Se perde (−) |
|---|---|---|
| ACQUISTI | Il fondo va al tuo reparto: compri gli strumenti che aspettavi da anni | I soldi del fondo vengono tolti dal tuo budget |
| PRODUZIONE | Il fondo finanzia il tuo macchinario: la tua linea diventa la più moderna | Per finanziare il fondo si rinvia la manutenzione delle tue linee |
| VENDITE | Il fondo finanzia la tua idea: un nuovo servizio tutto da vendere | Il fondo si mangia gli incentivi dei tuoi venditori |
| MARKETING | Il fondo premia il tuo progetto: campagna sperimentale firmata da te | La tua campagna dell'anno viene rinviata per pagare il fondo |
| FINANZA | Il fondo lo gestisci tu: decidi tu chi spende e quanto | Un fondo senza regole chiare: le spese le devi giustificare tu |
| RISORSE_UMANE | Il fondo finanzia la tua accademia interna: il tuo reparto brilla | Chi non ha vinto il fondo protesta, e lo fa nel tuo ufficio |
| RICERCA_SVILUPPO | Il fondo va al tuo laboratorio: un progetto nuovo tutto tuo | Il fondo fa concorrenza ai tuoi progetti: idee finanziate altrove |
| IT_SICUREZZA | Il fondo finanzia la tua piattaforma: il tuo reparto al centro | Ogni idea finanziata vuole un'app entro un mese: e la fai tu |

#### Fiera di settore a Milano — 60 K · PROTAGONISTA (Un reparto guadagna molto, due perdono poco)

**In TV se approvata (+2):** Stand affollato per tre giorni: contatti nuovi e marchio in vista

| Reparto | Se guadagna (+) | Se perde (−) |
|---|---|---|
| ACQUISTI | In fiera incontri tre fornitori nuovi: listini più bassi per il tuo reparto | Lo stand va comprato in fretta e a prezzo pieno: lo paga il tuo budget |
| PRODUZIONE | In fiera esponete il vostro macchinario: i clienti chiedono di visitare la linea | Il pezzo da esporre va costruito in tre settimane, fermando una linea |
| VENDITE | Stand pieno di clienti, e i contatti li raccolgono i tuoi venditori | I tuoi venditori bloccati tre giorni allo stand invece che dai clienti |
| MARKETING | Lo stand lo progetti tu: è la vetrina del tuo reparto | La fiera la organizza un'agenzia esterna: il tuo budget eventi finisce lì |
| FINANZA | In fiera incontri due banche: ti offrono un finanziamento a tasso agevolato | Note spese della fiera da controllare una per una (ristoranti compresi) |
| RISORSE_UMANE | In fiera fai colloqui a raffica: trovi i candidati che cercavi da mesi | Chi presidia lo stand nel weekend? Proteste e straordinari da gestire |
| RICERCA_SVILUPPO | Presenti il tuo prototipo: un'università propone una collaborazione | Il tuo prototipo va reso presentabile prima del tempo: due mesi persi |
| IT_SICUREZZA | In fiera si lancia l'app che hai sviluppato: il tuo reparto sotto i riflettori | Wi-fi, schermi e app dello stand: tre giorni di emergenze per il tuo reparto |

#### Prestito di personale tra reparti per un anno — 35 K · COPPIA (Due reparti guadagnano, uno perde molto)

**In TV se approvata (+1):** Qualche attrito, ma lo scambio di persone sblocca un paio di colli di bottiglia

| Reparto | Se guadagna (+) | Se perde (−) |
|---|---|---|
| ACQUISTI | Ti arrivano rinforzi esperti: gli ordini arretrati spariscono | Ti portano via il buyer migliore: ordini in ritardo per mesi |
| PRODUZIONE | Persone in più sulle tue linee: aggiungi un turno senza assumere | I tuoi tecnici prestati altrove: linee scoperte e straordinari |
| VENDITE | Rinforzi in arrivo: i tuoi venditori seguono più clienti | I tuoi venditori prestati ad altri: i clienti chiamano e nessuno risponde |
| MARKETING | Gente nuova, idee nuove: la tua campagna prende quota | Il tuo grafico prestato a un altro reparto: campagne ferme |
| FINANZA | Ti arriva un analista in più: chiusure mensili più rapide | La tua contabile migliore passa ad altri: chiusure in ritardo |
| RISORSE_UMANE | Gli scambi li organizzi tu: il tuo reparto diventa la regia dell'azienda | Ogni spostamento è un litigio, e i litigi finiscono da te |
| RICERCA_SVILUPPO | Un tecnico di produzione nel tuo laboratorio: prototipi più realistici | I tuoi ricercatori finiscono a fare assistenza: progetti fermi |
| IT_SICUREZZA | Ti prestano persone esperte: smaltisci le richieste arretrate | Il tuo sistemista prestato altrove: le emergenze restano tutte a te |

#### Nuova sede di rappresentanza in centro — 95 K · RISCHIO (Grande guadagno per un reparto, perdita sicura per un altro)

**In TV se approvata (0):** Bella sede, belle foto, stessi clienti di prima: l'affitto si mangia tutto

| Reparto | Se guadagna (+) | Se perde (−) |
|---|---|---|
| ACQUISTI | Ricevi i fornitori in centro: davanti a quella sede trattano meglio | Arredi di lusso da comprare in fretta: il conto passa dal tuo budget |
| PRODUZIONE | La sede in centro libera spazio in fabbrica: le tue linee si allargano | Clienti portati a visitare la fabbrica: linee ferme per fare bella figura |
| VENDITE | Clienti ricevuti in centro, con vista: le tue trattative volano | I tuoi venditori devono presidiare la sede: meno visite ai clienti |
| MARKETING | La sede diventa il simbolo del marchio: eventi e foto li curi tu | Il budget della sede si mangia la tua campagna |
| FINANZA | L'immobile acquista valore: in bilancio è un colpo da maestro tuo | Affitto in centro altissimo: tocca a te farlo quadrare |
| RISORSE_UMANE | Una sede in centro attira candidati: le selezioni diventano facili | Chi va in centro e chi resta in periferia? Invidie da gestire |
| RICERCA_SVILUPPO | Il tuo laboratorio si sposta nei vecchi uffici, più grandi | Il tuo laboratorio resta in periferia, dimenticato da tutti |
| IT_SICUREZZA | La nuova sede nasce con i sistemi che hai progettato tu | Nuova sede da collegare in un mese: il tuo reparto in trincea |

#### Settimana corta sperimentale — 40 K · PAREGGIO (Due guadagnano poco, due perdono poco) · ⚖️ astensione ammessa

**In TV se approvata (+1):** Personale più riposato e meno assenze: piccolo guadagno di produttività

| Reparto | Se guadagna (+) | Se perde (−) |
|---|---|---|
| ACQUISTI | Ordini concentrati in quattro giorni: i fornitori si adeguano e tu respiri | I fornitori lavorano il venerdì, tu no: consegne perse |
| PRODUZIONE | Turni più lunghi ma meno avviamenti: le tue linee rendono di più | Le linee non si fermano il venerdì: turni da riorganizzare tutti |
| VENDITE | Venditori riposati, clienti più contenti | I clienti chiamano il venerdì e trovano la segreteria |
| MARKETING | «L'azienda della settimana corta»: una storia perfetta per il marchio | Le campagne escono il venerdì e nessuno le segue |
| FINANZA | Uffici chiusi un giorno in più: bollette più basse in bilancio | Le scadenze fiscali non fanno la settimana corta: copri tu il venerdì |
| RISORSE_UMANE | Candidati in fila per lavorare qui: il tuo reparto vince | Chi ha la settimana corta e chi no? Le proteste arrivano da te |
| RICERCA_SVILUPPO | Giornate lunghe e senza interruzioni: i tuoi progetti avanzano | Gli esperimenti non si fermano il venerdì: turni di guardia per te |
| IT_SICUREZZA | Il venerdì i sistemi sono liberi: aggiornamenti senza disturbare nessuno | Il venerdì c'è sempre un guasto, e il reperibile sei tu |

#### Corso di formazione obbligatorio per tutti — 25 K · AZIENDALE (Buono per l'azienda, costa a due reparti) · ⚖️ astensione ammessa

**In TV se approvata (+3):** Il corso funziona davvero: errori dimezzati in tutta l'azienda

| Reparto | Se guadagna (+) | Se perde (−) |
|---|---|---|
| ACQUISTI | Il corso insegna a trattare: i tuoi buyer tornano più agguerriti | Una settimana di corso: ordini fermi e fornitori in attesa |
| PRODUZIONE | Operai formati, meno errori sulle tue linee | Gli operai in aula invece che in linea: produzione ferma |
| VENDITE | Il corso è sulla negoziazione: i tuoi venditori ne escono più forti | Due giorni d'aula: i tuoi venditori perdono appuntamenti |
| MARKETING | Il corso parla di comunicazione: il tuo reparto fa da docente | Tutto il tuo reparto in aula proprio durante il lancio |
| FINANZA | Tutti imparano a leggere un bilancio: meno domande assurde per te | Il corso usa fondi pubblici: carte su carte da rendicontare |
| RISORSE_UMANE | Il corso lo organizzi tu, ed è un successo | Calendari, aule e lamentele: il corso pesa tutto sul tuo reparto |
| RICERCA_SVILUPPO | Il docente è un tuo contatto universitario: collaborazione in vista | Un corso su cose che il tuo laboratorio sa già: tempo perso |
| IT_SICUREZZA | Finalmente tutti sanno cos'è una password sicura | Piattaforma del corso da installare e cento password da reimpostare |

#### Auto di rappresentanza per le visite ai clienti — 45 K · EGOISTICO (Buono per un reparto, cattivo per l'azienda)

**In TV se approvata (-1):** L'auto si vede più spesso al bar che dai clienti: spesa senza ritorno

| Reparto | Se guadagna (+) | Se perde (−) |
|---|---|---|
| ACQUISTI | L'auto la usi tu per visitare i fornitori: trattative di persona | L'auto va comprata in fretta: niente gara, prezzo pieno, budget tuo |
| PRODUZIONE | L'auto va al tuo reparto: porti i clienti in fabbrica con stile | L'auto si prende il posto coperto dei tuoi carrelli elevatori |
| VENDITE | L'auto va ai tuoi venditori: più visite, più contratti | L'auto va a un altro reparto: i tuoi venditori restano in treno |
| MARKETING | L'auto la decori tu col marchio: un cartellone che gira per la città | L'auto gira col logo vecchio, e la gente la vede |
| FINANZA | L'auto la prendi tu in leasing: tasse più leggere a merito tuo | Carburante, bollo, multe: ogni ricevuta passa da te |
| RISORSE_UMANE | L'auto diventa il premio del mese che gestisci tu: tutti più motivati | «Perché lui sì e io no?»: la lite sull'auto finisce da te |
| RICERCA_SVILUPPO | L'auto ti serve per portare i prototipi dai clienti: test sul posto | Il tuo furgone per le prove viene venduto per pagare l'auto |
| IT_SICUREZZA | Auto connessa: la flotta digitale la progetti tu | L'auto connessa va integrata nei sistemi, e il navigatore non va mai |

#### Accordo quadro con un fornitore unico — 55 K · SACRIFICIO (Un reparto paga, tre guadagnano un poco)

**In TV se approvata (+2):** Prezzi bloccati e consegne puntuali: l'accordo quadro ripaga

| Reparto | Se guadagna (+) | Se perde (−) |
|---|---|---|
| ACQUISTI | Un solo contratto da gestire invece di trenta: meno lavoro per te | Il fornitore unico detta legge: perdi ogni margine di trattativa |
| PRODUZIONE | Materiali sempre uguali: meno regolazioni sulle tue linee | Se il fornitore unico ritarda, le tue linee si fermano |
| VENDITE | Consegne prevedibili: puoi promettere date sicure ai clienti | Il fornitore unico serve anche un concorrente, e i tuoi clienti lo sanno |
| MARKETING | Il fornitore co-finanzia le tue campagne: il suo logo accanto al nostro | Il fornitore unico ha una pessima fama: tocca a te difendere il marchio |
| FINANZA | Prezzi bloccati per due anni: il tuo budget diventa prevedibile | Penali enormi se usciamo dal contratto: un rischio che pesa su di te |
| RISORSE_UMANE | Il fornitore forma il personale gratis: un costo in meno per te | Chi seguiva i vecchi fornitori resta senza lavoro: tocca a te ricollocarlo |
| RICERCA_SVILUPPO | Il fornitore ti dà in anteprima i suoi materiali nuovi | Il fornitore unico non ha il materiale per il tuo prototipo |
| IT_SICUREZZA | Ordini automatici con un solo fornitore: integrazione semplice per te | Il fornitore pretende accesso diretto ai nostri sistemi: rischi da coprire |

#### Campagna pubblicitaria in televisione — 90 K · PROTAGONISTA (Un reparto guadagna molto, due perdono poco)

**In TV se approvata (+2):** Lo spot fa parlare di noi: il marchio guadagna terreno sui concorrenti

| Reparto | Se guadagna (+) | Se perde (−) |
|---|---|---|
| ACQUISTI | Gli spazi TV li compri tu, all'asta: grande sconto e grande merito | Scorte da aumentare in fretta per reggere la campagna: prezzi d'urgenza |
| PRODUZIONE | Lo spot è girato nella tua fabbrica: il tuo reparto in prima serata | Dopo lo spot gli ordini esplodono: turni doppi sulle tue linee |
| VENDITE | Lo spot porta clienti nuovi, e li chiudono i tuoi venditori | Lo spot promette uno sconto che devono onorare i tuoi venditori |
| MARKETING | Lo spot lo firmi tu: il tuo reparto in prima serata | Lo spot lo fa un'agenzia scelta dal direttivo: a te tocca solo pagare |
| FINANZA | Lo spot attira un investitore: la tua cassa ringrazia | Una spesa enorme da giustificare in bilancio, prima dei risultati |
| RISORSE_UMANE | Lo spot mostra i dipendenti veri: orgoglio e candidature per te | I dipendenti apparsi nello spot vogliono un compenso: trattative da te |
| RICERCA_SVILUPPO | Lo spot mostra il tuo prototipo: ora il direttivo lo finanzia volentieri | Lo spot promette un prodotto che il tuo laboratorio non ha finito |
| IT_SICUREZZA | Lo spot lancia il nuovo sito che hai costruito tu | Dopo lo spot il sito crolla sotto le visite: notte in bianco per te |

#### Digitalizzazione di tutti gli archivi — 60 K · COPPIA (Due reparti guadagnano, uno perde molto)

**In TV se approvata (+1):** Qualche file perso, ma ora tutti trovano le cose un po' più in fretta

| Reparto | Se guadagna (+) | Se perde (−) |
|---|---|---|
| ACQUISTI | Contratti dei fornitori trovati in un secondo: rinnovi più convenienti | Trent'anni di ordini da scansionare: il tuo reparto sepolto dalla carta |
| PRODUZIONE | Schede tecniche sempre a portata di tablet: meno errori in linea | I disegni tecnici scansionati sono illeggibili: errori in linea |
| VENDITE | Lo storico di ogni cliente in un clic: offerte su misura | Le vecchie offerte spariscono nella migrazione: clienti da richiamare |
| MARKETING | L'archivio storico diventa materiale per le tue campagne | I tuoi materiali creativi archiviati con nomi assurdi: introvabili |
| FINANZA | Basta faldoni: i controlli fiscali diventano una passeggiata | Le fatture vanno tenute anche su carta: doppio archivio per te |
| RISORSE_UMANE | Fascicoli del personale finalmente in ordine e al sicuro | Dati personali da digitalizzare a norma di privacy: mesi di lavoro |
| RICERCA_SVILUPPO | Vecchi brevetti ritrovati in archivio ispirano il tuo nuovo progetto | I tuoi quaderni di laboratorio vanno trascritti uno per uno |
| IT_SICUREZZA | Il progetto lo guidi tu: archivio moderno e budget al tuo reparto | Montagne di scansioni da custodire: spazio e sicurezza a carico tuo |

#### Assunzione di un super-esperto (carissimo) — 75 K · RISCHIO (Grande guadagno per un reparto, perdita sicura per un altro)

**In TV se approvata (0):** L'esperto porta idee brillanti e costa una fortuna: alla fine si va in pari

| Reparto | Se guadagna (+) | Se perde (−) |
|---|---|---|
| ACQUISTI | L'esperto viene assegnato a te: rinegozia tutti i contratti | L'esperto vuole materiali di prima scelta, e li compri tu |
| PRODUZIONE | L'esperto lavora sulle tue linee: produttività alle stelle | L'esperto rivoluziona le tue linee in un mese: caos totale |
| VENDITE | L'esperto porta con sé i suoi clienti, e li affida a te | L'esperto si prende i clienti migliori, anche i tuoi |
| MARKETING | L'esperto è famoso: il tuo reparto lo usa come testimonial | L'esperto rilascia interviste sul marchio senza consultarti |
| FINANZA | L'esperto ottiene un finanziamento che porta il tuo nome | Lo stipendio dell'esperto va giustificato, e lo chiedono a te |
| RISORSE_UMANE | L'esperto l'hai trovato tu: il merito è del tuo reparto | Lo stipendio dell'esperto trapela, e tutti chiedono un aumento a te |
| RICERCA_SVILUPPO | L'esperto entra nel tuo laboratorio: il progetto fa un salto | L'esperto boccia il tuo progetto davanti a tutti |
| IT_SICUREZZA | L'esperto ti modernizza i sistemi in tre mesi | L'esperto vuole strumenti speciali, compatibili con niente: tocca a te |

#### Nuove regole sulle trasferte — 20 K · PAREGGIO (Due guadagnano poco, due perdono poco)

**In TV se approvata (+1):** Meno viaggi, meno spese, quasi nessun cliente perso: piccolo risparmio

| Reparto | Se guadagna (+) | Se perde (−) |
|---|---|---|
| ACQUISTI | Le visite ai fornitori diventano videochiamate: meno spese per te | Niente più visite ai fornitori: i problemi li scopri a merce arrivata |
| PRODUZIONE | Basta tecnici in viaggio: le tue linee ritrovano il personale | Il tecnico del fornitore non può più venire: guasti più lunghi |
| VENDITE | Trasferte pagate a risultato: i tuoi venditori migliori ci guadagnano | Tetto alle trasferte: i tuoi venditori visitano meno clienti |
| MARKETING | Le fiere restano fuori dai tagli: il tuo calendario è salvo | Niente più eventi fuori sede: la tua agenda si svuota |
| FINANZA | Note spese con regole chiare: meno discussioni per te | Nuove regole, nuove eccezioni: ogni nota spesa diventa una trattativa |
| RISORSE_UMANE | Regole uguali per tutti: meno favoritismi da gestire | Chi viaggiava in prima classe protesta, e protesta da te |
| RICERCA_SVILUPPO | Niente congressi inutili: più tempo per il tuo laboratorio | Niente più congressi: il tuo reparto resta indietro sulle novità |
| IT_SICUREZZA | Videochiamate al posto dei viaggi: il tuo sistema diventa indispensabile | Tutti in videochiamata, e ogni microfono che non va è un problema tuo |

#### Piano di risparmio energetico — 55 K · AZIENDALE (Buono per l'azienda, costa a due reparti)

**In TV se approvata (+3):** Bollette giù di un terzo: un risparmio che si sente su tutti i prezzi

| Reparto | Se guadagna (+) | Se perde (−) |
|---|---|---|
| ACQUISTI | Rinegozi il contratto della luce: bel colpo per il tuo reparto | Lampade, sensori, pannelli: cento ordini nuovi da gestire in fretta |
| PRODUZIONE | Motori nuovi ed efficienti sulle tue linee | Le macchine più energivore lavorano solo di notte: turni da rifare |
| VENDITE | «Prodotto a basso consumo»: un argomento in più per i tuoi venditori | Riscaldamento abbassato nello showroom: clienti col cappotto |
| MARKETING | Un'azienda verde: storia perfetta per le tue campagne | Insegne luminose spente la sera: il marchio sparisce |
| FINANZA | Incentivi statali sull'efficienza: il merito in bilancio è tuo | Gli incentivi arrivano tra due anni: intanto la spesa la copri tu |
| RISORSE_UMANE | Uffici più confortevoli: meno lamentele da gestire | Aria condizionata a 27 gradi: le proteste arrivano tutte da te |
| RICERCA_SVILUPPO | Il tuo laboratorio progetta il sistema di recupero del calore | Le tue apparecchiature di prova consumano troppo: orari ridotti |
| IT_SICUREZZA | Server nuovi e a basso consumo: finalmente | Server spenti di notte per risparmiare: e i backup? |

#### Premio di risultato legato agli obiettivi — 40 K · EGOISTICO (Buono per un reparto, cattivo per l'azienda) · ⚖️ astensione ammessa

**In TV se approvata (-1):** Il premio scatena invidie e la corsa agli obiettivi facili: l'azienda ci perde

| Reparto | Se guadagna (+) | Se perde (−) |
|---|---|---|
| ACQUISTI | Il premio va al tuo reparto per i risparmi sugli acquisti | Il premio lo paga un taglio al tuo budget |
| PRODUZIONE | Il premio va alle tue linee: record di produzione e squadra motivata | Gli obiettivi ignorano i guasti: il tuo reparto resta senza premio |
| VENDITE | Il premio va ai tuoi venditori: corrono come mai | Obiettivi impossibili per i tuoi venditori: premio mancato e morale a terra |
| MARKETING | Il premio va al tuo reparto per la campagna dell'anno | «Il marketing non ha numeri misurabili»: niente premio per te |
| FINANZA | Il premio va al tuo reparto per i conti in ordine | Calcolare i premi tocca a te, e ognuno contesta la cifra |
| RISORSE_UMANE | Il premio va al tuo reparto per il clima migliorato | Chi non ha preso il premio protesta, e lo fa da te |
| RICERCA_SVILUPPO | Il premio va al tuo laboratorio per il brevetto depositato | Obiettivi trimestrali per la ricerca? Il tuo reparto resta a secco |
| IT_SICUREZZA | Il premio va al tuo reparto: un anno senza blocchi dei sistemi | Il calcolo dei premi va programmato in una settimana: lo fai tu |

#### Partecipazione a una gara d'appalto pubblica — 70 K · SACRIFICIO (Un reparto paga, tre guadagnano un poco)

**In TV se approvata (+2):** Gara vinta: un cliente pubblico che paga sempre e porta prestigio

| Reparto | Se guadagna (+) | Se perde (−) |
|---|---|---|
| ACQUISTI | La gara premia i fornitori locali: trattative più semplici per te | Preventivi di tutti i fornitori da allegare entro venerdì |
| PRODUZIONE | La gara garantisce lavoro alle tue linee per un anno | Capitolato rigidissimo: le tue linee vanno adattate |
| VENDITE | Un cliente pubblico in portafoglio: il tuo reparto ci guadagna | Ribasso d'asta: i tuoi venditori lavorano per margini ridicoli |
| MARKETING | «Fornitore della pubblica amministrazione»: ottimo per il marchio | Niente pubblicità durante la gara: la tua campagna è sospesa |
| FINANZA | Un cliente che paga sempre: la tua cassa diventa prevedibile | Garanzie bancarie, fideiussioni, certificati: la gara pesa su di te |
| RISORSE_UMANE | Il bando premia la formazione: i tuoi corsi valgono punti in graduatoria | Curriculum e certificati di ogni dipendente da allegare: tocca a te |
| RICERCA_SVILUPPO | Il bando premia l'innovazione: il tuo progetto vale punti preziosi | La gara vuole il prodotto vecchio: il tuo progetto nuovo resta nel cassetto |
| IT_SICUREZZA | La piattaforma della gara la conosci solo tu: il merito è tuo | Il portale della gara va in crash il giorno della scadenza: panico da te |

#### Sistema di videosorveglianza (anche in mensa) — 45 K · PROTAGONISTA (Un reparto guadagna molto, due perdono poco) · ⚖️ astensione ammessa

**In TV se approvata (+2):** Furti azzerati e assicurazione più bassa: le telecamere si ripagano

| Reparto | Se guadagna (+) | Se perde (−) |
|---|---|---|
| ACQUISTI | Le telecamere le scegli tu: contratto ricco e fornitore riconoscente | Telecamere comprate in fretta dal fornitore più caro: le paga il tuo budget |
| PRODUZIONE | Le telecamere sorvegliano il magazzino: spariscono i furti di materiale | Operai filmati tutto il giorno: tensione altissima sulle tue linee |
| VENDITE | Showroom sorvegliato: i clienti lasciano lì la merce in prova | I clienti in visita trovano telecamere ovunque: brutta impressione |
| MARKETING | Le riprese della fabbrica diventano un tuo video promozionale | Il giornale locale titola «telecamere in mensa»: il marchio ne soffre |
| FINANZA | L'assicurazione abbassa il premio: risparmio a merito tuo | Manutenzione carissima con rinnovo automatico: la paghi tu |
| RISORSE_UMANE | Le telecamere chiudono una vecchia lite sui furti: il merito è tuo | Sindacati in rivolta per le telecamere in mensa: tutto da te |
| RICERCA_SVILUPPO | Il laboratorio finalmente protetto: i tuoi prototipi al sicuro | Telecamere nel laboratorio: i tuoi ricercatori si sentono spiati |
| IT_SICUREZZA | Il sistema lo gestisci tu: il tuo reparto controlla tutto | Mille ore di video da archiviare e proteggere: a carico tuo |

#### Spostamento del magazzino fuori città — 80 K · COPPIA (Due reparti guadagnano, uno perde molto)

**In TV se approvata (+1):** Il trasloco costa fatica, ma le consegne lontane ora sono più veloci

| Reparto | Se guadagna (+) | Se perde (−) |
|---|---|---|
| ACQUISTI | Magazzino più grande: compri in grandi quantità, a prezzi migliori | I fornitori vogliono più soldi per consegnare fuori città |
| PRODUZIONE | Lo spazio del vecchio magazzino va alle tue linee | I materiali arrivano dal nuovo magazzino con ore di ritardo |
| VENDITE | Il nuovo magazzino è vicino all'autostrada: consegne più veloci | Consegne più lente in città: i tuoi clienti si lamentano |
| MARKETING | Il vecchio magazzino diventa uno spazio eventi, e lo gestisci tu | Il materiale promozionale ora è a 40 km: ogni evento è una spedizione |
| FINANZA | Affitto fuori città a metà prezzo: il tuo bilancio migliora | Trasloco, assicurazioni, trasporti: costi nascosti che emergono da te |
| RISORSE_UMANE | Il nuovo magazzino porta assunzioni sul territorio: bella figura tua | I magazzinieri non vogliono trasferirsi: trattative difficili per te |
| RICERCA_SVILUPPO | Il vecchio magazzino diventa il tuo nuovo laboratorio | I campioni per le tue prove ora arrivano dopo giorni |
| IT_SICUREZZA | Il magazzino nuovo nasce automatizzato: il tuo progetto più bello | Collegare il nuovo magazzino alla rete: cantiere infinito per te |

#### Lancio di una linea di prodotti economici — 75 K · RISCHIO (Grande guadagno per un reparto, perdita sicura per un altro)

**In TV se approvata (0):** Le vendite salgono ma i margini spariscono: la linea economica va in pari

| Reparto | Se guadagna (+) | Se perde (−) |
|---|---|---|
| ACQUISTI | Materiali economici in grandi quantità: il tuo reparto fa il colpo | Trovare materiali così economici è un incubo, e tocca a te |
| PRODUZIONE | La nuova linea riempie i tuoi impianti fermi: costi fissi ripagati | Due linee di prodotto sugli stessi impianti: cambi continui e fermi |
| VENDITE | Un prodotto che si vende da solo: i tuoi venditori ci guadagnano | I clienti chiedono lo sconto anche sul prodotto di qualità |
| MARKETING | Un marchio nuovo da lanciare da zero: il progetto lo firmi tu | Il marchio «di qualità» ora vende roba economica: difenderlo tocca a te |
| FINANZA | Grandi volumi, cassa che gira: il tuo bilancio respira | Margini minimi: devi dimostrare che ci guadagniamo davvero |
| RISORSE_UMANE | La nuova linea porta assunzioni: il tuo reparto diventa centrale | Assunzioni a tempo per la nuova linea: contratti e lamentele da gestire |
| RICERCA_SVILUPPO | Progettare economico è una sfida, e il tuo laboratorio la vince | Il tuo progetto di punta viene sospeso per la linea economica |
| IT_SICUREZZA | La nuova linea si vende online: il negozio digitale lo fai tu | Nuovi codici, nuovo listino, nuovo sito: tutto entro un mese, tutto tuo |

#### Riunione settimanale obbligatoria del lunedì — 15 K · PAREGGIO (Due guadagnano poco, due perdono poco) · ⚖️ astensione ammessa

**In TV se approvata (+1):** Le riunioni del lunedì evitano qualche lavoro doppio: guadagno modesto

| Reparto | Se guadagna (+) | Se perde (−) |
|---|---|---|
| ACQUISTI | Al lunedì scopri in anticipo cosa serve: ordini meno urgenti | Due ore di riunione mentre i fornitori ti cercano |
| PRODUZIONE | Ogni lunedì sai cosa produrre: basta cambi di programma | Il lunedì le tue linee ripartono senza capo reparto |
| VENDITE | Al lunedì presenti i tuoi risultati, e tutti ti ascoltano | Lunedì mattina in riunione invece che dai clienti |
| MARKETING | La riunione diventa la tua vetrina: presentazioni applaudite | Ogni lunedì qualcuno ha un'idea sulla tua campagna |
| FINANZA | Ogni lunedì tutti sanno quanto c'è in cassa: meno richieste assurde | Il verbale lo scrivi tu, ogni lunedì |
| RISORSE_UMANE | Le lamentele escono in riunione invece che nel tuo ufficio | Ogni lunedì un litigio in riunione, e a ricucire ci pensi tu |
| RICERCA_SVILUPPO | Il lunedì il direttivo vede i tuoi progressi e ti dà fiducia | Ogni lunedì ti chiedono «quando è pronto?» |
| IT_SICUREZZA | Riunione in videochiamata: il tuo sistema diventa indispensabile | Il proiettore non funziona mai, e ogni lunedì chiamano te |

#### Revisione completa dei contratti con i clienti — 35 K · AZIENDALE (Buono per l'azienda, costa a due reparti)

**In TV se approvata (+3):** Contratti nuovi, pagamenti puntuali: l'azienda respira come non mai

| Reparto | Se guadagna (+) | Se perde (−) |
|---|---|---|
| ACQUISTI | Contratti chiari con i clienti: ordini ai fornitori più prevedibili | Nuove clausole sui materiali: fornitori da riqualificare tutti |
| PRODUZIONE | Basta personalizzazioni gratuite: le tue linee lavorano in serie | Le nuove clausole di qualità ricadono tutte sulle tue linee |
| VENDITE | Contratti più solidi: i clienti pagano puntuali | Ogni cliente va rivisitato per firmare: i tuoi venditori in trincea |
| MARKETING | Condizioni chiare per i clienti: un argomento per le tue campagne | Le promozioni della tua campagna violano i nuovi contratti: da rifare |
| FINANZA | Penali per i ritardi di pagamento: la tua cassa ringrazia | Ogni contratto va ricontrollato con gli avvocati, e le parcelle a te |
| RISORSE_UMANE | Clausole chiare: meno discussioni tra personale e clienti | I contratti nuovi vogliono personale formato: corsi da organizzare |
| RICERCA_SVILUPPO | Nei contratti entra la proprietà dei progetti: i tuoi brevetti protetti | I clienti chiedono garanzie sui prodotti futuri: prove extra per te |
| IT_SICUREZZA | Firma digitale per tutti i contratti: il progetto è tuo | Mille contratti da caricare in un sistema che non esiste ancora |

#### Sponsorizzazione della squadra di calcio locale — 55 K · EGOISTICO (Buono per un reparto, cattivo per l'azienda)

**In TV se approvata (-1):** La squadra retrocede: il nostro logo su ogni sconfitta

| Reparto | Se guadagna (+) | Se perde (−) |
|---|---|---|
| ACQUISTI | Lo sponsor tecnico della squadra è un tuo fornitore: sconti sulle forniture | Maglie, striscioni e gadget da ordinare: li paga il tuo budget |
| PRODUZIONE | In cambio dello sponsor il comune sblocca l'ampliamento del tuo capannone | Il tuo reparto deve produrre 500 pezzi omaggio per i tifosi |
| VENDITE | In tribuna d'onore porti i tuoi clienti migliori: contratti firmati all'intervallo | I clienti del paese vicino tifano la squadra rivale: qualche disdetta per te |
| MARKETING | Il marchio sulle maglie l'hai voluto tu: visibilità a ogni partita | Il logo sulle maglie è stato scelto senza di te, e si vede |
| FINANZA | La sponsorizzazione si scarica dalle tasse: il tuo bilancio migliora | La squadra vuole tutto in anticipo: buco nella tua cassa del trimestre |
| RISORSE_UMANE | Biglietti gratis ai dipendenti: il clima migliora e il merito è tuo | Biglietti gratis solo per alcuni: liti e invidie da gestire |
| RICERCA_SVILUPPO | La squadra prova il tuo nuovo materiale: test gratuiti sul campo | I soldi dello sponsor arrivano da un tuo progetto congelato |
| IT_SICUREZZA | La squadra adotta la tua app per i biglietti: il tuo reparto in vetrina | Il sito della squadra sotto attacco ogni domenica: ora tocca a te difenderlo |

#### Rinnovo dei computer di tutta l'azienda — 70 K · SACRIFICIO (Un reparto paga, tre guadagnano un poco)

**In TV se approvata (+2):** Computer nuovi, meno blocchi: tutta l'azienda lavora più veloce

| Reparto | Se guadagna (+) | Se perde (−) |
|---|---|---|
| ACQUISTI | Un ordine enorme: il fornitore ti regala anche i telefoni | Mille computer da ordinare, consegnare e collaudare: tutto a te |
| PRODUZIONE | Computer nuovi a bordo linea: meno blocchi | I nuovi computer non leggono il software delle tue macchine |
| VENDITE | Portatili leggeri per i tuoi venditori: offerte fatte dal cliente | I tuoi venditori restano senza portatile per una settimana |
| MARKETING | Computer potenti: la grafica la fate in casa, senza agenzia | I tuoi programmi di grafica non girano sui nuovi computer |
| FINANZA | Computer in leasing: costo spalmato e tasse più leggere | Mille beni da registrare e ammortizzare: il lavoro è tuo |
| RISORSE_UMANE | Computer nuovi a tutti: il clima migliora | «Perché a lui il portatile e a me il fisso?»: liti da gestire |
| RICERCA_SVILUPPO | Computer potenti per le simulazioni: i tuoi progetti accelerano | Dati di ricerca persi nel passaggio ai nuovi computer |
| IT_SICUREZZA | Finalmente macchine tutte uguali: assistenza dimezzata | Mille computer da configurare in un weekend: tocca al tuo reparto |

#### Programma di benessere aziendale (yoga alle 7) — 35 K · PROTAGONISTA (Un reparto guadagna molto, due perdono poco)

**In TV se approvata (+2):** Meno assenze, più energia: lo yoga alle 7 funziona (nessuno lo ammetterà)

| Reparto | Se guadagna (+) | Se perde (−) |
|---|---|---|
| ACQUISTI | La palestra convenzionata la trovi tu: sconto e merito al tuo reparto | Tappetini, frutta fresca, istruttori: cento acquisti strani da gestire |
| PRODUZIONE | Il programma riduce mal di schiena e infortuni sulle tue linee | Yoga alle 7: il turno del mattino arriva in linea già stanco |
| VENDITE | I tuoi venditori in forma: più energia con i clienti | Yoga alle 7, primo cliente alle 8: i tuoi venditori arrivano tardi |
| MARKETING | «L'azienda che si prende cura di te»: il racconto lo firmi tu | Le foto dello yoga girano sui social, e non in senso buono |
| FINANZA | Meno assenze per malattia: il risparmio in bilancio lo mostri tu | Il programma costa più del previsto e nessuno sa dire quanto rende |
| RISORSE_UMANE | Il programma l'hai voluto tu: clima alle stelle, merito tuo | Chi non va allo yoga si sente escluso: lamentele da gestire |
| RICERCA_SVILUPPO | Il tuo laboratorio studia la postura ideale: progetto pubblicato | La sala yoga è il tuo vecchio laboratorio |
| IT_SICUREZZA | L'app del benessere l'hai fatta tu: la usano tutti | Braccialetti contapassi da collegare ai sistemi: privacy e problemi per te |

#### Esternalizzazione dei servizi interni — 40 K · COPPIA (Due reparti guadagnano, uno perde molto)

**In TV se approvata (+1):** Servizi esterni un po' più lenti ma più economici: piccolo vantaggio

| Reparto | Se guadagna (+) | Se perde (−) |
|---|---|---|
| ACQUISTI | I contratti con le ditte esterne li gestisci tu: potere e sconti | Cinque ditte esterne da controllare: il lavoro ricade su di te |
| PRODUZIONE | Pulizie e manutenzione a una ditta esterna: i tuoi operai solo in linea | La ditta esterna di manutenzione arriva in due giorni, non in due ore |
| VENDITE | Assistenza clienti affidata a esterni: i tuoi venditori vendono e basta | Il centralino esterno risponde male ai tuoi clienti |
| MARKETING | La grafica a un'agenzia brava: le tue campagne fanno il salto | Il tuo reparto rischia di essere il prossimo a finire fuori |
| FINANZA | Costi fissi che diventano variabili: il tuo bilancio diventa flessibile | Buste paga a uno studio esterno: gli errori li correggi tu |
| RISORSE_UMANE | Meno personale da gestire: ti concentri sui talenti | Personale da ricollocare o salutare: il compito più duro tocca a te |
| RICERCA_SVILUPPO | Le prove a un centro esterno: tu ti concentri sulle idee | Il centro esterno vede i tuoi progetti: rischio di fuga di idee |
| IT_SICUREZZA | L'assistenza ai computer va fuori: tu ti dedichi ai progetti veri | Gli esterni vogliono accedere ai sistemi: password e rischi da gestire |

#### Apertura di un ufficio all'estero — 95 K · RISCHIO (Grande guadagno per un reparto, perdita sicura per un altro)

**In TV se approvata (0):** L'ufficio estero vende, ma costa altrettanto: per ora si va in pari

| Reparto | Se guadagna (+) | Se perde (−) |
|---|---|---|
| ACQUISTI | All'estero trovi fornitori molto più economici | Dazi, dogane e fornitori nuovi da gestire: il lavoro ricade su di te |
| PRODUZIONE | L'ufficio estero porta ordini grossi: le tue linee lavorano a pieno ritmo | Prodotti da adattare alle norme straniere: mesi di modifiche alle tue linee |
| VENDITE | Un mercato nuovo, tutto per i tuoi venditori | I tuoi venditori migliori trasferiti all'estero: in Italia resti scoperto |
| MARKETING | Lanci il marchio in un paese nuovo: la campagna la firmi tu | Il marchio va tradotto e adattato: il tuo budget se ne va in traduzioni |
| FINANZA | Agevolazioni fiscali per la nuova sede: il merito in bilancio è tuo | Due valute, due fisci, due bilanci: il tuo lavoro raddoppia |
| RISORSE_UMANE | Selezioni tu il personale estero: il tuo reparto diventa centrale | Contratti stranieri, trasferimenti e famiglie scontente: tutto sulla tua scrivania |
| RICERCA_SVILUPPO | Apri un piccolo laboratorio accanto a un'università straniera | Il budget per l'estero viene preso dai tuoi progetti |
| IT_SICUREZZA | Il nuovo ufficio nasce con i tuoi sistemi: un modello per tutta l'azienda | Collegare l'ufficio estero alla rete: fusi orari ed emergenze notturne per te |

#### Codice di abbigliamento aziendale — 15 K · PAREGGIO (Due guadagnano poco, due perdono poco) · ⚖️ astensione ammessa

**In TV se approvata (+1):** Un'aria più professionale: i clienti notano la differenza, un po'

| Reparto | Se guadagna (+) | Se perde (−) |
|---|---|---|
| ACQUISTI | Divise per tutti: un ordine ricco e un fornitore riconoscente | Taglie sbagliate, divise da cambiare: il caos è nel tuo ufficio |
| PRODUZIONE | Abbigliamento tecnico uguale per tutti: più sicurezza sulle tue linee | Le divise nuove non sono adatte alle macchine: proteste in linea |
| VENDITE | Venditori eleganti: i clienti ti prendono più sul serio | Giacca e cravatta anche ad agosto: i tuoi venditori protestano |
| MARKETING | Le divise col marchio le disegni tu | Le divise col logo sbagliato sono già stampate |
| FINANZA | Basta rimborsi di abiti «da lavoro»: spese più chiare per te | Chi paga le divise? La domanda arriva a te ogni giorno |
| RISORSE_UMANE | Regole chiare: basta discussioni su ciabatte e bermuda | Ogni giorno qualcuno viola il codice, e richiamarlo tocca a te |
| RICERCA_SVILUPPO | Il laboratorio è esentato: i tuoi ricercatori ti adorano | Camici nuovi obbligatori, scomodi e brutti |
| IT_SICUREZZA | Il tuo reparto ottiene l'esenzione «felpa»: morale alle stelle | Il badge nelle divise nuove non funziona, e chiamano te |

#### Controllo di gestione mensile su tutti i reparti — 40 K · AZIENDALE (Buono per l'azienda, costa a due reparti)

**In TV se approvata (+3):** I numeri mensili scovano sprechi ovunque: grande recupero di efficienza

| Reparto | Se guadagna (+) | Se perde (−) |
|---|---|---|
| ACQUISTI | I numeri mensili dimostrano quanto risparmi: il tuo reparto brilla | Un report mensile su ogni ordine: tempo perso |
| PRODUZIONE | Costi delle linee misurati: finalmente si vede quanto rendi | Ogni fermo macchina va spiegato in un report mensile |
| VENDITE | Margini per cliente visibili: puoi lasciare i clienti in perdita | I tuoi venditori compilano report invece di vendere |
| MARKETING | Finalmente si misura quanto rende una campagna, e la tua rende | «Quanto rende questa campagna?» Ogni mese, la stessa domanda |
| FINANZA | Il controllo lo guidi tu: il tuo reparto diventa centrale | Report mensili per tutti i reparti: li prepari tu, ogni mese |
| RISORSE_UMANE | Dati chiari sui carichi di lavoro: assunzioni più facili da ottenere | Il costo del personale sotto la lente ogni mese: pressione su di te |
| RICERCA_SVILUPPO | I numeri mostrano quanto valgono i tuoi brevetti | La ricerca non ha risultati mensili, e ti trattano da spreco |
| IT_SICUREZZA | Il cruscotto mensile lo costruisci tu: tutti lo guardano | Dati da estrarre da sei sistemi diversi, ogni mese, a mano |

#### Ristrutturazione del piano direzionale — 40 K · EGOISTICO (Buono per un reparto, cattivo per l'azienda)

**In TV se approvata (-1):** Piano direzionale splendido, clienti mai visti: soldi spesi per pochi

| Reparto | Se guadagna (+) | Se perde (−) |
|---|---|---|
| ACQUISTI | Il tuo reparto si trasferisce al piano nuovo: fornitori ricevuti con stile | Arredi del piano nuovo comprati senza gara: il conto passa da te |
| PRODUZIONE | Il piano nuovo ospita il tuo ufficio tecnico, lontano dal rumore | I lavori al piano di sopra fanno vibrare le tue macchine di precisione |
| VENDITE | Il piano nuovo ospita la tua sala clienti: trattative in un ambiente top | Mesi di cantiere: niente clienti in visita per i tuoi venditori |
| MARKETING | Il piano nuovo lo arredi tu: diventa la vetrina del marchio | Il piano nuovo è arredato con i colori opposti al marchio |
| FINANZA | Il tuo reparto sale al piano nuovo, accanto alla sala del direttivo | Lavori sempre più cari del preventivo, e il bilancio lo difendi tu |
| RISORSE_UMANE | Il piano nuovo ospita la tua area colloqui: candidati colpiti | «Perché loro al piano nuovo e noi no?»: invidie da gestire |
| RICERCA_SVILUPPO | Il tuo laboratorio si sposta al piano nuovo: spazio e luce | Il cantiere si prende il deposito dei tuoi prototipi |
| IT_SICUREZZA | Il piano nuovo ospita la tua sala server, moderna e sicura | Il piano nuovo va cablato da zero: lavoro tutto tuo |

#### Scorte di sicurezza per sei mesi — 60 K · SACRIFICIO (Un reparto paga, tre guadagnano un poco)

**In TV se approvata (+2):** Arriva la crisi delle forniture: i concorrenti restano a secco, noi no

| Reparto | Se guadagna (+) | Se perde (−) |
|---|---|---|
| ACQUISTI | Un ordine gigante: prezzi bloccati e fornitore riconoscente | Sei mesi di scorte da comprare subito: il tuo budget prosciugato |
| PRODUZIONE | Materiali sempre disponibili: le tue linee non si fermano più | Le scorte occupano lo spazio delle tue linee |
| VENDITE | Consegne garantite anche in crisi: promesse sicure ai clienti | Le scorte sono del modello vecchio, e i clienti vogliono il nuovo |
| MARKETING | «Mai senza prodotto»: una promessa perfetta per le tue campagne | Scorte da smaltire: promozioni forzate che rovinano il marchio |
| FINANZA | Prezzi bloccati prima dei rincari: il tuo bilancio è protetto | Sei mesi di soldi fermi in magazzino: la tua cassa soffre |
| RISORSE_UMANE | Linee sempre attive: niente cassa integrazione da gestire | Servono magazzinieri in più: assunzioni urgenti da fare |
| RICERCA_SVILUPPO | Materiali in abbondanza: prove senza limiti per te | Scorte di materiali vecchi: il tuo nuovo progetto deve usarle |
| IT_SICUREZZA | Nuovo gestionale di magazzino: il progetto lo guidi tu | Sei mesi di inventario da tracciare: sistemi al limite |

#### Concorso a premi per i clienti — 45 K · PROTAGONISTA (Un reparto guadagna molto, due perdono poco)

**In TV se approvata (+2):** Migliaia di partecipanti al concorso: clienti nuovi e marchio più noto

| Reparto | Se guadagna (+) | Se perde (−) |
|---|---|---|
| ACQUISTI | I premi li compri tu: sconto enorme dal fornitore | Mille premi da comprare, uno diverso dall'altro: incubo per te |
| PRODUZIONE | Il primo premio è una visita alla tua fabbrica: il tuo reparto in vetrina | Confezioni speciali col codice del concorso: linee da riadattare |
| VENDITE | Il concorso riporta i vecchi clienti, e li chiudi tu | Clienti che chiedono solo del concorso: i tuoi venditori fanno da centralino |
| MARKETING | Il concorso è un'idea tua, e funziona | Il concorso lo gestisce un'agenzia: il tuo budget se ne va lì |
| FINANZA | Il concorso fa girare la cassa: incassi in anticipo | Regolamento, notaio, garanzie al ministero: la burocrazia è tua |
| RISORSE_UMANE | I dipendenti fanno da testimonial: orgoglio aziendale, merito tuo | I dipendenti vogliono partecipare al concorso: dire di no tocca a te |
| RICERCA_SVILUPPO | Il premio è il tuo prototipo: test gratuito con mille clienti | Il tuo prototipo dato come premio prima di essere pronto |
| IT_SICUREZZA | La piattaforma del concorso è tua, ed è un successo | Il sito del concorso crolla il primo giorno, e chiamano te |

#### Turni di lavoro anche il sabato — 25 K · COPPIA (Due reparti guadagnano, uno perde molto)

**In TV se approvata (+1):** I turni del sabato smaltiscono gli arretrati: qualche ordine in più

| Reparto | Se guadagna (+) | Se perde (−) |
|---|---|---|
| ACQUISTI | Consegne anche il sabato: i fornitori ti fanno prezzi migliori | Ordini da gestire anche il sabato: il tuo weekend sparisce |
| PRODUZIONE | Linee attive sei giorni su sette: produci di più senza nuove macchine | Turni del sabato: i tuoi operai minacciano lo sciopero |
| VENDITE | Aperti il sabato: i clienti piccoli possono finalmente venire | Venditori di turno il sabato, e il lunedì sono stanchi |
| MARKETING | «Aperti anche il sabato»: uno slogan per le tue campagne | Le tue campagne del weekend vanno rifatte da zero |
| FINANZA | Più produzione con gli stessi impianti: il tuo bilancio migliora | Straordinari del sabato da pagare: buco nel tuo budget |
| RISORSE_UMANE | Turni del sabato volontari e pagati bene: tutti contenti, merito tuo | Turni del sabato da assegnare: nessuno li vuole, la colpa è tua |
| RICERCA_SVILUPPO | Il sabato il laboratorio è silenzioso: i tuoi esperimenti più lunghi | Il sabato ti chiedono di fare assistenza alla produzione |
| IT_SICUREZZA | Il sabato fai gli aggiornamenti in pace | Sistemi accesi anche il sabato: reperibilità per il tuo reparto |

#### Acquisto di un piccolo concorrente in crisi — 95 K · RISCHIO (Grande guadagno per un reparto, perdita sicura per un altro)

**In TV se approvata (0):** Clienti in più, debiti in più: l'acquisizione va in pari

| Reparto | Se guadagna (+) | Se perde (−) |
|---|---|---|
| ACQUISTI | Il concorrente aveva fornitori migliori: ora sono tuoi | Due elenchi di fornitori da unificare: mesi di trattative per te |
| PRODUZIONE | Ti arrivano macchinari a prezzo di saldo | Gli impianti del concorrente sono un rottame: sistemarli tocca a te |
| VENDITE | I clienti del concorrente passano ai tuoi venditori | I clienti del concorrente pagano male, e li segui tu |
| MARKETING | Un marchio storico da rilanciare: il progetto è tuo | Il marchio del concorrente ha una pessima fama: ora ce l'abbiamo noi |
| FINANZA | Comprato a prezzo di saldo: l'affare del decennio lo firmi tu | Nei conti del concorrente spuntano debiti nascosti: gestirli tocca a te |
| RISORSE_UMANE | Ottimi tecnici in arrivo dal concorrente: il tuo reparto ci guadagna | Due squadre che si odiano da anni da far convivere |
| RICERCA_SVILUPPO | I brevetti del concorrente arrivano nel tuo laboratorio | I progetti del concorrente doppiano i tuoi: il tuo viene chiuso |
| IT_SICUREZZA | I sistemi del concorrente sono più moderni: li adotti e brilli | Due sistemi incompatibili da unire: un anno di emergenze per te |

#### App aziendale per i clienti — 75 K · PAREGGIO (Due guadagnano poco, due perdono poco)

**In TV se approvata (+1):** L'app funziona (venerdì sera a parte): qualche ordine in più

| Reparto | Se guadagna (+) | Se perde (−) |
|---|---|---|
| ACQUISTI | L'app mostra la domanda in tempo reale: ordini più precisi | L'app promette disponibilità immediata: scorte sempre piene da tenere |
| PRODUZIONE | Gli ordini dall'app arrivano già completi: meno errori in linea | L'app permette ordini personalizzati: cambi continui sulle tue linee |
| VENDITE | I clienti ordinano dall'app, e le provvigioni restano tue | I clienti ordinano dall'app senza passare dai tuoi venditori |
| MARKETING | Notifiche dirette ai clienti: le tue promozioni arrivano a tutti | Recensioni dell'app da una stella: il marchio ne soffre |
| FINANZA | Pagamenti dall'app, incassi immediati | Commissioni sui pagamenti digitali da far quadrare |
| RISORSE_UMANE | Meno telefonate: il centralino si libera | Centralinisti da riqualificare: corsi e malumori da gestire |
| RICERCA_SVILUPPO | I dati dell'app ti dicono cosa vogliono i clienti | I clienti chiedono dall'app funzioni che non esistono ancora |
| IT_SICUREZZA | L'app la sviluppi tu: il progetto più visibile dell'anno | L'app si blocca ogni venerdì sera, e il reperibile sei tu |

#### Bilancio sociale e di sostenibilità — 25 K · AZIENDALE (Buono per l'azienda, costa a due reparti)

**In TV se approvata (+3):** Il bilancio sociale conquista banche e grandi clienti: salto di reputazione

| Reparto | Se guadagna (+) | Se perde (−) |
|---|---|---|
| ACQUISTI | Fornitori sostenibili: contratti premiati dalle banche | Ogni fornitore deve dimostrare di essere «sostenibile»: moduli a te |
| PRODUZIONE | Meno scarti e meno sprechi: le tue linee diventano un esempio | Ogni chilo di scarto delle tue linee va misurato e spiegato |
| VENDITE | I grandi clienti chiedono il bilancio sociale: ora ce l'hai | I clienti leggono il bilancio e chiedono sconti «verdi» |
| MARKETING | Il bilancio sociale è materiale d'oro per le tue campagne | Il bilancio sociale rivela dati imbarazzanti: addolcirli tocca a te |
| FINANZA | Investitori attenti alla sostenibilità: finanziamenti migliori | Un secondo bilancio da preparare, e lo prepari tu |
| RISORSE_UMANE | Il bilancio racconta il buon clima aziendale: candidature in aumento | Questionari a tutti i dipendenti, e qualcuno risponde male |
| RICERCA_SVILUPPO | I tuoi progetti verdi finiscono in prima pagina | Il tuo laboratorio consuma troppo, e ora è scritto nero su bianco |
| IT_SICUREZZA | I dati raccolti dai tuoi sistemi diventano il cuore del bilancio | Dati ambientali da raccogliere da ogni reparto, a mano |

---

## Riepilogo per la sessione di integrazione

**Lavoro:** punto aperto 1 del GDD, contenuti dei quesiti (22/11/2026). Nessun commit.

### File toccati
| File | Modifica |
|---|---|
| `packages/content/proposte.json` | 40 quesiti: campo `testi` completo (8 reparti × 2 segni = 640 frasi); nuovo campo `spiegazione` (40 frasi); 5 titoli cambiati (D-031); `astensioneAmmessa: true` sul Premio di risultato (D-034). **Invariati:** id, costi, schemi, categorie, trimestri |
| `docs/contenuti/quesiti.md` | nuovo: questo file (decisioni in bozza + schede leggibili) |
| `packages/content/frasi.json` | **non modificato**: con i testi completi diventa solo rete di sicurezza (oggi non viene mai usato per i reparti con ruolo; `neutro` resta in uso) |

Verifiche: `corepack pnpm verifica` superato (controllo tipi + 135 test). Simulatore non lanciato.

### Decisioni da riportare in DECISIONI.md
- **D-030** — Titoli vivi "a più facce" + frasi su misura per ogni reparto e segno (scelta B).
- **D-031** — Titoli "a doppia faccia": non rivelano l'effetto sull'azienda (scelta B); 5 titoli cambiati.
- **D-032** — Forma e tono della frase privata (approvata con il campione).
- **D-033** — Frase di spiegazione in TV per l'effetto reale, una per quesito (scelta B).
- **D-034** — 6 quesiti con astensione (15%), aggiunto il tipo "conflitto d'interesse" (scelta C). Da verificare col simulatore.

### Da riportare nel GDD
- §8.2: aggiungere che ogni quesito ha frasi su misura per tutti i reparti (D-030, D-032) e titoli
  che non rivelano l'effetto aziendale (D-031).
- §8.4bis: i quesiti con astensione possono essere "di coscienza" o "di conflitto d'interesse" (D-034).
- §7.2 fase 5 / §17.1: la TV mostra, per ogni proposta approvata, effetto reale **e frase di
  spiegazione** (D-033); nel 4° trimestre la frase segue la regola D-029 (si mostra al punteggio,
  insieme al numero, perché il tono della frase rivela il segno dell'effetto).
- §19: le proposte hanno titoli coloriti → ✅ se Luis lo conferma.
- §20 punto 1: da 🔴 a ✅ provvisorio (contenuti scritti; da verificare nelle serate).

### Lavoro tecnico da fare (fuori dal perimetro di questa sessione)
1. **Collegare `spiegazione`:** aggiungere il campo a `ModelloProposta` (`contenuti.ts`), portarlo in
   `PropostaIstanza` (`proposte.ts`) e accodarlo alla `causa` dell'evento `EFFETTO_PROPOSTA`
   (`risoluzione.ts`, ~riga 126). Nel 4° trimestre rispettare D-029. Utile un controllo in
   `controllaContenuti`: `spiegazione` e `testi` completi per ogni quesito.
2. **Ri-simulare** dopo D-034 (Premio di risultato con astensione: pesi tutti a 1).
3. **Rischio di memorizzazione (D-031):** lo schema è fisso per quesito; dopo varie serate i giocatori
   imparano "titolo → effetto". Rimedio possibile nel motore: schema estratto tra due possibili
   all'estrazione (le frasi positive degli schemi AZIENDALE sono già scritte per questo). Da proporre a Luis.
4. Gli id dei 5 quesiti rinominati restano i vecchi (es. `auto-aziendale-nuova`): funzionano, ma
   non corrispondono più al titolo. Rinominarli solo se nessun report o test li usa.
5. Punto aperto 29 (informazioni di contesto, es. Marketing) non toccato.
