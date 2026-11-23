# Il Direttivo — Changelog

Voci più recenti in alto. Categorie: **Design** (regole), **Aggiunto**, **Modificato**, **Corretto**, **Rimosso**.
Versioni nel formato `0.FASE.N` finché il gioco non è completo.

## 2026-11-23 — 0.3.1

### Design
- D-079: approvate da Luis le tre frasi nuove dei quesiti da 80 K (Nuova sede, Campagna in TV, Acquisto di un concorrente).
- D-080: valori iniziali dei timer (circa 9–10 minuti a trimestre; Punteggio e Lettura dei messaggi solo con «Avanti»); comandi della partita al primo telefono e alla pagina TV; bot spia nelle prove in solitario (opzione predefinita "sì"); 🟡 regola dell'opzione "no" da confermare.

### Aggiunto
- **Server del prototipo** (`packages/server`, Fastify + Socket.IO): stanza con codice di 4 caratteri e QR con l'indirizzo della rete di casa; il motore come unica fonte di verità; a ogni dispositivo solo la sua vista e i suoi eventi; riconnessione col token (telefono) e col codice (TV); timer delle fasi con chiusura anticipata, Pausa, Riprendi e Avanti; bot = robot del simulatore con carattere a caso secondo il ruolo, rivelato a fine partita; registro delle azioni per stanza.
- Comando unico `corepack pnpm gioca`: accende il server, apre la pagina TV, scrive l'indirizzo per i telefoni.
- Pagine di prova **provvisorie** per TV e telefono (`packages/server/pubblico/`), da sostituire con le schermate Svelte (passi 2 e 3).
- Motore: `inAttesaDi` (chi deve ancora agire, per la chiusura anticipata) e opzione `idoneiSpia` di `creaPartita` (bot spia sì/no; senza opzione la partita è identica a prima).
- Parametri del server in `config.json` (sezione `server`).
- Prova manuale di Luis del Passo 1 superata (24/11/2026, TEST-MANUALI.md).
- Test: stanza con orologio finto (timer, pausa, avanti, chiusura anticipata, bot, comandi, riconnessione), riservatezza di tutto ciò che riceve ogni dispositivo in partite intere, **partita intera con soli bot attraverso la rete vera**, telefono che si scollega e rientra. 208 test.

## 2026-11-23 — 0.3.0

### Modificato
- **Passaggio alla fase 3 · Prototipo locale giocabile**, confermato da Luis (cancello fase 2 → 3). README, ROADMAP e CLAUDE.md aggiornati; roadmap della fase 3 divisa nei cinque passi indicati da Luis.

## 2026-11-23 — 0.2.18

### Design
- D-079 (scelte di Luis sul report 14): Tesoriere difficile "almeno 60 K a fine anno"; Controcorrente facile "contro l'esito del secondo voto in uno dei due modi"; tre versioni da 80 K diventano spreco (frasi 🟡 da approvare) e il buon affare da 80 sale a +6; spia con 4 giocatori accettata così. Quindicesimo report (docs/simulazioni/2026-11-23-simulazione-15.md).
- D-078 (scelta di Luis): il **ruolo dei licenziati non si rivela subito**, ma al punteggio, prima della classifica (chi decide nel secondo giro con 8 giocatori non deve sapere se ha già preso una spia). GDD §15 e architettura aggiornati.
- D-076 e D-077 implementati e tarati col simulatore (vedi DECISIONI: esito della verifica e tre punti da decidere con Luis). GDD §4.4, §8.6 e §20 punto 33 aggiornati.

### Aggiunto
- `schemi.json`: **quattro famiglie per costo** (buon affare, investimento, neutro, spreco), ognuna con le forme di ripartizione del suo costo estratte a ogni partita; `proposte.json`: famiglia coerente con la frase per la TV in ogni versione dei 40 quesiti (ricavata dagli schemi originali). Controlli automatici: famiglie distinte per costo, forme con i totali del costo, alternativa di un'altra famiglia.
- Motore: **storico del voto del pacchetto** per trimestre (`storicoPacchetti`: primi voti, secondo voto, esito, decisivi secondo D-076, effetto di ogni pacchetto) e **14 misure nuove** per i 16 obiettivi riscritti (dopo D-079); evento `RUOLI_RIVELATI` al punteggio (D-078).
- Simulatore: robot con intenzioni per il voto del pacchetto (seguire la maggioranza prevista dai voti precedenti, votare contro, restare soli, limite di costo, NO / SÌ al principale); report con le tabelle "Equilibrio della spia (1/N)" ed "Effetto delle carte per costo".
- Quattordicesimo e quindicesimo report (docs/simulazioni/2026-11-23-simulazione-14.md e -15.md); `crescitaMediaProposteESegreti` 3,47 (D-056, misura 3,45 nel report 15).
- Test: famiglie di schemi, storico e decisivi al primo e al secondo voto, misure nuove, ruoli nascosti nel secondo giro. 186 test.

### Modificato
- `obiettivi.json` e docs/contenuti/obiettivi.md: 16 obiettivi riscritti con le soglie del report 14; docs/contenuti/quesiti.md con famiglie, valori e frasi di entrambe le versioni.
- Viste: il ruolo dei licenziati non compare più prima del punteggio (test di riservatezza aggiornato).

### Rimosso
- Storico "per proposta" (`storicoVotazioni`) e le 16 misure dei vecchi obiettivi sul voto della singola proposta e sulla cassa minima.

## 2026-11-23 — 0.2.17

### Design
- Approvati da Luis i dettagli di D-057 («Intermediario»), D-061 (quale segreto è arrivato, conteggio subito nel 4° trimestre, «Squadra» riscritti, avviso "potrebbero esserci spie" con 8 giocatori) e D-062 (conversione dei costi).
- D-063 (provvisoria): un turno di ballottaggio **senza nessun voto** si ripete una volta; se resta vuoto, nessun licenziamento (prima: due turni vuoti licenziavano entrambi i candidati).
- D-064: poteri speciali dei reparti rinviati a dopo le prime serate.
- D-065…D-067 (prototipo): bot = robot del simulatore con opzione "bot spia sì/no" e carattere rivelato a fine partita; timer in config con chiusura anticipata, pausa e avanti; prime prove sul PC di Luis in rete locale.
- D-068…D-071 (provvisorie, solo nel GDD: il codice segue): **voto del trimestre a pacchetti** — tre proposte 30/50/80, discussione di X minuti, voto segreto del pacchetto (almeno 51 K, entro la cassa), una testa un voto, maggioranza dei membri, altrimenti secondo voto sul più votato con alternativa coperta; cassa senza tetto; **algoritmo di equità** (stessi bonus e malus per reparto sulle 12 carte, ±1); **valore proporzionale al costo**; obiettivi e quesiti da riscrivere a regole fissate. Nuovi punti aperti 32 (scadenza dei segreti) e 33 (riscrittura).
- D-072…D-074 (provvisorie, solo nel GDD): segreti con **scadenza a fine del trimestre successivo** (anche per la spia), **4° trimestre senza nuovi segreti**, **catena minima** di X colleghi (1-1-2-2-2) con passaggi mancanti e destinatari già serviti disattivati, **un segreto vero e uno finto** a trimestre (quello della spia è sempre il finto), arrivi annunciati per ogni versione, valore contato alla scadenza.
- D-075: l'equilibrio della spia si misura su 1/N (vittorie neutre); da ricontrollare la spia prima in classifica con 4 giocatori (34%).
- D-076 (provvisoria): approvata la riscrittura di 16 obiettivi personali per il voto del pacchetto (da implementare e tarare).
- D-077 (provvisoria): quesiti con quattro famiglie di schemi per costo (buon affare, investimento, neutro, spreco), coerenti con le frasi di spiegazione (da implementare).
- GDD §20: punto 4 allineato a D-054/D-056; punti 5, 6, 11, 18, 24 aggiornati.

### Aggiunto
- Tredicesimo report (docs/simulazioni/2026-11-23-simulazione-13.md); `crescitaMediaProposteESegreti` ritarata a 3,41 (D-056).
- Motore: **voto del pacchetto** (fasi DISCUSSIONE, VOTO_PACCHETTO, SECONDO_VOTO; azione VOTA_PACCHETTO; eventi VOTO_PACCHETTO_CHIUSO, SECONDO_VOTO_APERTO, SECONDO_VOTO_CHIUSO), **algoritmo di equità** delle 12 carte (`proposte.ts`: assegnazione golosa + scalata, carte compatibili con i reparti smistati, nuove serie se serve; 3000 partite di prova tutte in tolleranza), **segreti vero/finto** con ruoli equilibrati, catena minima, scadenza e valore contato alla scadenza (evento SEGRETO_ARRIVATO).
- Viste: voto del pacchetto (voti rivelati alla chiusura, alternativa mai), passaggi mancanti e colleghi già serviti sui segreti, "finto" solo per la spia sui propri.
- Test: voto del pacchetto, equità delle carte, segreti (riscritti); riservatezza estesa a carte, alternativa e finti. 176 test.
- `schemi.json`: 12 schemi provvisori proporzionali al costo (D-070, D-071), assegnati ai quesiti a rotazione; controllo automatico dei totali di bonus e malus per costo.

### Modificato
- `config.json`: `proposte` (costi, investimento minimo 51, valore per costo, equità) al posto di `votazioniPerTrimestre`; cassa senza tetto; segreti con `ultimoTrimestre`, `passaggiMinimi` e probabilità dei tipi (al posto del limite "mai due da custodire").
- Simulatore: robot che votano il pacchetto (interesse del reparto; il cooperativo preferisce investire di più) e il secondo voto, fanno avanzare i segreti lungo la catena scegliendo il collega di cui si fidano di più; la spia evita il finto noto e "scommette" solo a volte sugli altri. Report: sezioni "Cassa e voto del pacchetto", equità delle carte, segreti veri/finti.

### Corretto
- Motore: ballottaggio senza voti (D-063), con tre nuovi test.

### Rimosso
- Pesi dei reparti, scaletta 2-3-3-2, favoriti, tetto della cassa, collegamento segreto → votazione, etichetta "dato certo".

## 2026-11-23 — 0.2.16

### Design
- D-057 (provvisoria): **eliminati demansionamento e promozione** (fase 6, autogestione dei demansionati, messaggio ridotto, perdita dei segreti, decisione finale sui demansionati). Obiettivo «Riformatore» sostituito da 🟡 «Intermediario».
- D-058 (provvisoria): **finale "Rinnovo dei contratti"** — domanda palese "C'è una spia?" (tempo scaduto = No, si procede con almeno metà di sì), un nome a testa (licenziato chi ha più della metà dei nomi fatti), ballottaggio a due (stallo ripetuto = licenziati entrambi) o a tre e più (ultima votazione con i nomi ripetuti bloccati, poi nessun licenziato); con 8 giocatori secondo giro se è uscito uno solo.
- D-059 (provvisoria): **nessun punto nel finale** per accuse e licenziamenti; resta solo D-025 (la spia licenziata perde il +10).
- D-060 (provvisoria): **eliminata l'astensione**; il tempo scaduto conserva sempre lo stato delle cose.
- D-061 (provvisoria): la TV mostra **"N su M hanno giocato per l'azienda"** (anche nel 4° trimestre, subito) e **annuncia i segreti** del trimestre con il reparto a cui servono; avviso fisso "una spia potrebbe essersi infiltrata tra voi". Obiettivi «Squadra» riscritti con il conteggio.
- D-062 (provvisoria): costi delle proposte solo **30 / 50 / 80 K**; budget e tetto invariati; resta la scelta dell'obiettivo fra tre.

### Aggiunto
- Dodicesimo report (docs/simulazioni/2026-11-23-simulazione-12.md) con una prova di sensibilità sul comportamento nel finale.
- `config.json`: `reparti.nomi` (nomi dei reparti per gli annunci in TV), `finale.rispostaDomandaPredefinita`.
- Motore: fasi DOMANDA, NOMINA, BALLOTTAGGIO; eventi SEGRETO_ANNUNCIATO, ESITO_DOMANDA, AVVISO_BALLOTTAGGIO, NESSUN_LICENZIAMENTO; misure TRIMESTRI_META_AZIENDA e TRIMESTRI_MAGGIORANZA_AZIENDA; test del nuovo finale.

### Modificato
- Simulatore: i robot rispondono alla domanda e votano nomi e ballottaggi; report con la sezione "Finale: rinnovo dei contratti" e la quota di bocciature per fondi.
- Viste: il finale mostra domanda, voti chiusi, ballottaggio con i votanti e il nome bloccato del giocatore.

### Rimosso
- `personali.ts` (promozioni e demansionamenti), quesiti con astensione, parametri `autogestione`, `quesitiConAstensione`, `messaggi.perTrimestreDemansionato` e i punti del finale in `punteggio`.

## 2026-11-23 — 0.2.15

### Design
- D-056 (provvisoria): il concorrente avanza quanto l'azienda media al **45%** di scelte aziendaliste (scelta di Luis dopo le prove a 55 / 50 / 45%): parte dei giocatori + effetto medio di proposte e segreti (2,93 a trimestre) + evento casuale −1 / 0 / +1; segreti veri +1 / +2 / +3, falsi −4. D-054: corretta la nota di verifica.

### Aggiunto
- Undicesimo report (docs/simulazioni/2026-11-23-simulazione-11.md): spia vincente con una spia 15–25% (era 28–35%), con due spie 34–39% (era 53–57%).
- Simulatore: sezione "Crescita dell'azienda da proposte e segreti" (misura il valore da usare per il concorrente) e opzione `--quota` per provare un'altra quota di riferimento.

### Modificato
- `config.json`: `concorrenti.quotaAziendalistaRiferimento` (0,45) e `crescitaMediaProposteESegreti` (2,93) al posto di `crescitaBase` / `crescitaPerGiocatore`; evento casuale −1 / 0 / +1; segreti per il concorrente 1 / 2 / 3, penalità del falso 4.
- Motore: nuova formula di crescita del concorrente; lo storico dei trimestri registra l'effetto di proposte e segreti.
- Simulatore: lo studio dei concorrenti prova crescita base × quota.

## 2026-11-23 — 0.2.14

### Design
- D-055 (provvisoria): seconda taratura delle soglie degli obiettivi (voti, cassa, mossa privata) con le stime del simulatore.
- D-054 (provvisoria): più difficile per il concorrente battere l'azienda — crescita base 2,7 → 2,4, valore dei segreti per il concorrente 1/2/3 → 1/1/2; la vittoria dell'azienda senza spie diventa solo informativa (ogni giocatore punta a vincere personalmente).
- D-053 (provvisoria): prima ritaratura degli obiettivi dopo il report 09 — soglie ritoccate (voti, cassa, mossa privata), rimossi Sentinella e Intoccabile (34 obiettivi), sistemati i traguardi con il difficile più facile del facile; messaggi e segreti lasciati alle serate.

### Aggiunto
- Decimo report (docs/simulazioni/2026-11-23-simulazione-10.md).

### Modificato
- `config.json` secondo D-054 (crescita base 2,4; segreti per il concorrente 1 / 1 / 2); la vittoria dell'azienda senza spie non genera più avvisi nel report.
- `obiettivi.json` secondo D-053 e D-055; tolte le misure non più usate (verifica, nomine, bersaglio di demansionamento, cassa al tetto) e lo storico delle nomine.
- Simulatore: il report suggerisce le soglie degli obiettivi (valore raggiunto da ogni giocatore su ogni traguardo, cassa di fine trimestre e minima); i dati di ogni partita simulata registrano questi valori.
- Simulatore: opzioni `--base` / `--pergiocatore` per provare una crescita dei concorrenti diversa senza toccare config.json, e `--uscita` per il nome del report.

## 2026-11-23 — 0.2.13

### Design
- D-046 (provvisoria): obiettivi personali — tre proposti (uno per tipo), se ne tiene uno; ogni obiettivo ha due traguardi: tipo 1 graduale +3/+5, tipo 2 doppio +3/+7, tipo 3 doppio +4/+6 (⚖️).
- D-047 (provvisoria): l'obiettivo scelto si vede solo sul proprio telefono, con l'avanzamento; nessuna prova nell'app; al punteggio la TV rivela l'obiettivo di ognuno e il suo esito (gli scartati mai).
- D-048 (provvisoria): dopo le regole in TV (saltabili) ognuno riceve tre obiettivi e ne sceglie uno; la partita inizia quando tutti hanno scelto; a tempo scaduto uno a caso; nessun obiettivo ripetuto nella stessa partita.
- D-049 (provvisoria): mazzo unico con una parte di obiettivi aziendalisti; le spie ricevono solo aziendalisti (dilemma tra sabotaggio e punti), gli onesti pescano da tutto il mazzo; demansionati e licenziati conservano i punti dell'obiettivo.
- D-050 (provvisoria): tipi ammessi — voti, mossa privata, segreti, cassa, demansionamenti/promozioni, finale, messaggi (solo ricezione o costo vero); bersagli solo generici; niente obiettivi sull'esito; nessun premio alla mossa "per il reparto".
- D-051 (provvisoria): il bonus della spia resta +10 (aiutare l'azienda rischia di farla vincere); si tarano le soglie degli obiettivi, non i punti (facile 60–70%, difficile 25–35%, tipi con resa simile).
- D-052 (provvisoria): lista di 36 obiettivi (12 per tipo, 4 aziendalisti per tipo) e regole di verifica R1–R3 (docs/contenuti/obiettivi.md).

### Aggiunto
- Obiettivi personali nel motore: `packages/content/obiettivi.json` (36 obiettivi), parametri `obiettivi` in config.json (punti per tipo, tempo di scelta); nuova fase SCELTA_OBIETTIVI prima del trimestre 1, azione SCEGLI_OBIETTIVO, estrazione a caso a tempo scaduto; verifica dei traguardi con 45 "misure" (engine/src/misure.ts) e storici solo-server (votazioni, trimestri, nomine, copie modificate); traguardi raggiunti nel punteggio; telefono con proposte, obiettivo scelto e avanzamento ("si verifica a fine partita" dove serve); rivelazione in TV al punteggio.
- Robot: scelgono l'obiettivo (metà secondo il profilo, metà a caso) e lo perseguono secondo un "impegno" per profilo (spie aggressive poco impegnate: per loro l'obiettivo aiuta l'azienda); messaggi di solo testo occasionali.
- Report del simulatore: sezione 4b sugli obiettivi (per tipo, per obiettivo, per profilo, dilemma della spia, equità tra reparti a parità di giocatori); colonne obiettivo nel CSV.
- 19 test (164 in tutto): assegnazione, scelta, verifica dei traguardi, regole R1–R2, punteggio, rivelazione finale; test di riservatezza esteso agli obiettivi (verificato con una fuga introdotta apposta).
- Nono report (docs/simulazioni/2026-11-23-simulazione-09.md) e studio dei concorrenti (docs/simulazioni/2026-11-23-studio-concorrenti-09.md).

### Modificato
- La partita comincia con la scelta degli obiettivi: `creaPartita` non entra più nel Rapporto, ci si arriva con AVANZA_FASE; le viste ricevono anche l'ambiente (testi degli obiettivi). Test esistenti adattati con un aiuto comune (`test/aiuti.ts`).
- Architettura (§9, §10.1, §13.3) e GDD (§4.4, §7.1, §15.3, §16, §20 punto 3) aggiornati.

### Corretto
- Simulatore: la cassa d'inizio trimestre nel report era sfasata di un trimestre dopo l'introduzione della fase di scelta (segnalato nel report 09).

## 2026-11-22 — 0.2.12

### Design
- D-045 (provvisoria): ogni quesito ha due versioni, principale e alternativa, con effetto sull'azienda diverso e una propria frase di spiegazione; a ogni partita se ne estrae una (⚖️ 50%), così l'effetto non si impara a memoria. Nel mazzo ogni schema compare lo stesso numero di volte nelle due versioni.

### Aggiunto
- 40 schemi alternativi con la loro frase per la TV (proposte.json, tabella in docs/contenuti/quesiti.md); parametro `selezione.probabilitaAlternativa` in config.json.
- 4 test (145 in tutto): alternativa sempre con effetto diverso, frequenze degli schemi uguali, probabilità 0 / 1 rispettate, estrazione riproducibile col seme.
- Ottavo report (docs/simulazioni/2026-11-22-simulazione-08.md).

## 2026-11-22 — 0.2.11

### Design
- D-030…D-034 (provvisorie): contenuti veri dei quesiti — titoli vivi "a doppia faccia" che non rivelano l'effetto sull'azienda, frasi su misura per tutti i reparti (640), frase di spiegazione in TV per ogni proposta approvata, 6 quesiti con astensione (coscienza o conflitto d'interesse).
- D-035…D-039 (provvisorie): contenuti veri dei segreti — 36 segreti "da corridoio aziendale", etichetta "dato certo, arrivato al tuo reparto", valori estratti campo per campo a ogni partita con suggerimenti per falsificare, tre tipi "a bilancia" (da far girare / normale / da custodire) con punti alla spia 1 / 2 / 3, mai due "da custodire" nello stesso trimestre.

### Modificato
- Motore: i segreti si leggono dalle versioni (dato vero estratto campo per campo), i valori dei tipi stanno in config.json (`segreti.tipi`, al posto di `puntiSpiaPerSegretoUsato`); la TV non mostra più il "+N" del segreto arrivato in tempo; il telefono riceve tipo e valori suggeriti (in ordine alfabetico, senza indizi sul vero).
- Motore: la frase di spiegazione dei quesiti accompagna l'effetto reale ai Risultati (nel 4° trimestre al punteggio, D-029).
- Robot: quando falsificano usano uno dei valori suggeriti.

### Aggiunto
- 6 test (141 in tutto): estrazione campo per campo riproducibile, valori per tipo, mai due "da custodire", suggerimenti che non rivelano il vero, punti della spia per tipo, niente numero in TV; controllo dei contenuti per versioni e spiegazioni.
- Settimo report (docs/simulazioni/2026-11-22-simulazione-07.md): con i contenuti veri i risultati restano in linea col sesto (4 giocatori + 1 spia: onesti 76%, spia 24%; spie scoperte 64% con 4 giocatori).

## 2026-11-22 — 0.2.10

### Design
- D-029 (provvisoria): revisione del finale — nella decisione sui demansionati votano tutti tranne l'interessato; il tempo scaduto conserva lo stato delle cose (alla verifica vale "sì", nei quesiti con astensione vale astensione); accuse con due soli valori simmetrici (nomina ±5, voto ±3) uguali per onesti e spie, nessun bonus alle spie per un onesto licenziato; i risultati del 4° trimestre si scoprono solo al punteggio.

### Modificato
- Motore e robot adeguati a D-029; test del finale aggiornati (135 test).
- Variante B dell'esito nascosto: nel 4° trimestre si nascondono solo i numeri del mercato; le fughe di notizie si annunciano subito, senza numeri.

### Aggiunto
- Quinto report (docs/simulazioni/2026-11-22-simulazione-05.md): con l'esito del 4° trimestre nascosto le spie vengono scoperte meno (con 4 giocatori dal 65% al 52%), perché anche gli indizi dell'ultimo trimestre (segreti finiti al concorrente) arrivano dopo il finale.
- Sesto report con la variante B (docs/simulazioni/2026-11-22-simulazione-06.md): spie scoperte di nuovo al 65% con 4 giocatori; vittoria della spia con 4 giocatori e 1 spia 26%.

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
