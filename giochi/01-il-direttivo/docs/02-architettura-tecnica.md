# IL DIRETTIVO — Architettura tecnica

> **Titolo provvisorio.** Versione 0.1 — 20 novembre 2026
> Struttura tecnica di funzionamento: componenti, dispositivi, collegamenti, algoritmi e infrastruttura.
> Si legge insieme a `01-design-del-gioco.md`, a cui rimandano i riferimenti §.
>
> Legenda: ✅ scelta consolidata · 🟡 raccomandazione · 🔴 da decidere

---

## Indice

1. [Panoramica](#1-panoramica)
2. [Principi architetturali](#2-principi-architetturali)
3. [Componenti](#3-componenti)
4. [Dispositivi supportati](#4-dispositivi-supportati)
5. [Stack tecnologico](#5-stack-tecnologico)
6. [Collegamento: stanza, QR e sessione](#6-collegamento-stanza-qr-e-sessione)
7. [Comunicazione in tempo reale](#7-comunicazione-in-tempo-reale)
8. [Modello dati](#8-modello-dati)
9. [Macchina a stati della partita](#9-macchina-a-stati-della-partita)
10. [Algoritmi di gioco](#10-algoritmi-di-gioco)
11. [Messaggi privati e "pausa caffè"](#11-messaggi-privati-e-pausa-caffè)
12. [Audio (fase online)](#12-audio-fase-online)
13. [Contenuti come dati](#13-contenuti-come-dati)
14. [Simulatore](#14-simulatore)
15. [Sicurezza e anti-imbroglio](#15-sicurezza-e-anti-imbroglio)
16. [Persistenza, riconnessione e log](#16-persistenza-riconnessione-e-log)
17. [Infrastruttura e hosting](#17-infrastruttura-e-hosting)
18. [Struttura del codice](#18-struttura-del-codice)
19. [Test](#19-test)
20. [Roadmap tecnica](#20-roadmap-tecnica)
21. [Rischi tecnici](#21-rischi-tecnici)

---

## 1. Panoramica

```
                    ┌────────────────────────────────┐
                    │        SERVER DI GIOCO         │
                    │  (autorevole, conosce tutto)   │
                    │  ┌──────────────────────────┐  │
                    │  │  MOTORE DI GIOCO (puro)  │  │
                    │  └──────────────────────────┘  │
                    └──────┬──────────────┬──────────┘
            WebSocket      │              │      WebSocket
          (vista pubblica) │              │ (vista privata, una per giocatore)
                 ┌─────────▼───┐   ┌──────▼───────────────────┐
                 │  CLIENT TV  │   │  CLIENT TELEFONO (×4–8)  │
                 │  tabellone  │   │  controller personale    │
                 └─────────────┘   └──────────────────────────┘

      ─────────── solo FASE ONLINE ───────────
                 ┌──────────────────────────────┐
                 │   SERVER AUDIO (SFU WebRTC)  │◄── flussi audio dai telefoni
                 │   instradamento per stanza   │──► audio a TV e cuffie
                 └──────────────────────────────┘
```

- **Fase locale:** server di gioco, un client TV e i client telefono. Nessun audio digitale.
- **Fase online:** in più il server audio e più client TV, uno per casa.

---

## 2. Principi architetturali

| Principio | Applicazione |
|---|---|
| **Server autorevole** | Lo stato vero della partita esiste solo sul server. I client mostrano e inviano intenzioni ("voto sì"), mai risultati. |
| **Viste filtrate** | Ogni client riceve **solo** ciò che deve vedere. Un dato segreto non deve mai arrivare al telefono sbagliato, nemmeno nascosto nel codice o nei messaggi di rete. |
| **Motore puro e deterministico** | La logica di gioco è una libreria separata, senza rete né interfaccia, con generatore casuale a seme. Così la usano server, simulatore e test. |
| **Contenuti come dati** | Proposte, segreti, obiettivi ed eventi stanno in file JSON. Si modificano senza toccare il codice. |
| **Tutto via browser** | Nessuna app da installare. TV e telefoni aprono pagine web. |
| **Spiegabilità** | Ogni evento di risoluzione porta con sé una **causa leggibile** da mostrare in TV ("il concorrente A ha usato un segreto"). |

---

## 3. Componenti

### 3.1 Motore di gioco (`engine`)
- Libreria TypeScript pura.
- Funzione centrale: `applica(stato, azione) → { nuovoStato, eventi }`.
- Funzione di proiezione: `vista(stato, destinatario) → dati visibili` (TV oppure giocatore X).
- Nessun accesso a rete, orologio o casualità esterna: il tempo e il seme casuale arrivano come input.

### 3.2 Server di gioco (`server`)
- Gestisce stanze, connessioni, timer e persistenza.
- Riceve le azioni dai client, le valida, le passa al motore e invia a ciascuno la propria vista aggiornata.
- Registra il **log completo** delle azioni (serve per la lettura finale dei messaggi, la ripresa dopo un crash e il debug).

### 3.3 Client TV (`client-tv`)
- Pagina web a schermo intero, ottimizzata per la distanza (caratteri grandi, alto contrasto).
- Solo visualizzazione: nessuna interazione obbligatoria, salvo un tocco iniziale per sbloccare l'audio.
- Animazioni per i momenti di scena (rivelazioni una alla volta, corsa di mercato).

### 3.4 Client telefono (`client-phone`)
- Pagina web responsive in verticale, installabile come PWA (facoltativo).
- Schede: Reparto · Proposte · Segreti · Messaggi · Azioni.
- Pulsanti grandi, utilizzabili anche da chi è poco pratico.

### 3.5 Server audio (`sfu`, fase online)
- Smistamento dei flussi audio WebRTC (SFU = Selective Forwarding Unit, un "centralino" che riceve un flusso da ogni telefono e lo inoltra a chi deve sentirlo).
- 🟡 LiveKit, in cloud o installato in proprio.

### 3.6 Simulatore (`simulator`)
- Usa lo stesso motore con giocatori-robot. Gioca migliaia di partite per tarare i numeri (§14).

---

## 4. Dispositivi supportati

### 4.1 TV
| Opzione | Valutazione |
|---|---|
| **Portatile collegato via HDMI** | 🟡 **Consigliata.** Browser completo, affidabile, e in fase online può fare anche da microfono di stanza. |
| Chiavetta Fire TV / Google TV con browser | Buona, economica. Da verificare le prestazioni delle animazioni. |
| Browser integrato della smart TV | ⚠️ Spesso lento, con motore del browser datato e supporto WebSocket/WebRTC incompleto. Solo come ripiego. Il client TV va compilato per browser datati (es. ES2017, eventuale plugin "legacy" di Vite) e Socket.IO può ripiegare sul long-polling. Da provare su dispositivi reali in fase 3. |
| Chromecast (trasmissione di una scheda) | Possibile, con ritardo maggiore. |

### 4.2 Telefoni
- **iPhone:** Safari, iOS 16.4 o superiore (necessario per Wake Lock).
- **Android:** Chrome, versione recente.
- Requisito: **HTTPS obbligatorio**. Microfono, Wake Lock e altre funzioni del browser funzionano solo su connessione sicura.

### 4.3 Audio (fase online)
- Cuffie con filo consigliate.
- Bluetooth supportato, con un avviso nell'interfaccia sul peggioramento di qualità e ritardo quando si usa il loro microfono.

---

## 5. Stack tecnologico

| Livello | Scelta 🟡 | Motivo |
|---|---|---|
| Linguaggio | ✅ **TypeScript** ovunque (D-016) | Un solo linguaggio per motore, server e client. I tipi riducono gli errori. |
| Server | **Node.js** con **Fastify** o Express | Semplice, diffuso, ottimo per il tempo reale |
| Tempo reale | **Socket.IO** (WebSocket) | Riconnessione automatica, stanze, ampia documentazione |
| Client | ✅ **Svelte** con **Vite** (D-004) | Codice compilato in JavaScript semplice, pacchetti piccoli: più leggero su smart TV, chiavette e telefoni economici. Per la TV: obiettivo di compilazione abbassato per browser datati e prova su dispositivi reali (vedi §4.1) |
| Stile | CSS semplice o Tailwind | |
| Audio | **LiveKit** (SDK client e server) | SFU open source, con assegnazione dei flussi per "stanza" |
| Persistenza | In memoria più **SQLite** (o Redis) per gli snapshot | Leggera, sufficiente per decine di partite contemporanee |
| QR code | libreria `qrcode` | Genera il QR lato server o client |
| Test | ✅ **Vitest** (D-016) | Veloce, integrato con Vite |
| Monorepo | ✅ **pnpm workspaces** (D-016) | Pacchetti condivisi tra server, client e simulatore |

---

## 6. Collegamento: stanza, QR e sessione

### 6.1 Flusso di ingresso
```
TV apre il sito ──► server crea Partita {codice: "K7QX"} ──► TV mostra QR + codice
                                                               │
Telefono inquadra QR ──► apre https://sito/p/K7QX?loc=<idTV>  ◄┘
        │
        ├─► inserisce il nome ──► server crea Giocatore + token di sessione
        └─► token salvato nel telefono (localStorage) per la riconnessione
```

### 6.2 Dettagli
- **Codice stanza:** 4 caratteri senza quelli ambigui (niente O/0, I/1), da digitare a mano se il QR non funziona.
- **Parametro `loc`:** identifica **la TV/casa** da cui è stato inquadrato il QR. In fase locale ce n'è uno solo. In fase online serve all'instradamento audio (§12): i telefoni con lo stesso `loc` sono nella stessa stanza.
- **Token di sessione:** stringa casuale firmata. Se il telefono si disconnette o si ricarica la pagina, il giocatore rientra nello stesso posto.
- **Ingresso a partita iniziata:** consentito solo per riconnessione, non per nuovi giocatori.
- **Host:** il primo telefono collegato (o la TV) può avviare la partita e scegliere le opzioni.

---

## 7. Comunicazione in tempo reale

### 7.1 Modello
- **Client → server:** solo **intenzioni** (`azione`), con tipo e parametri.
- **Server → client:** **vista completa aggiornata** dopo ogni cambiamento, più **eventi** per le animazioni.
- 🟡 Si invia la vista completa (non le differenze) finché i dati sono piccoli: è più semplice e robusto. Si passa alle differenze solo se servirà.

### 7.2 Esempi di azioni
```ts
type Azione =
  | { tipo: "VOTA"; propostaId: string; voto: "SI" | "NO" }
  | { tipo: "MOSSA_PRIVATA"; scelta: "REPARTO" | "AZIENDA" }
  | { tipo: "INVIA_MESSAGGIO"; a: GiocatoreId; anonimo: boolean;
      modello: ModelloMsg; testo?: string; segreto?: InoltroSegreto }
  | { tipo: "PASSA_AL_CONCORRENTE"; segretoCopiaId: string }   // solo spie
  | { tipo: "DOMANDA_SPIA"; risposta: "SI" | "NO" }               // finale: "C'è una spia?" (D-058)
  | { tipo: "NOMINA_SPIA"; bersaglio: GiocatoreId }               // finale: nome o voto di ballottaggio
  | { tipo: "USA_POTERE"; parametri: unknown }
  | { tipo: "VISIBILITA"; visibile: boolean };                 // pausa caffè
```

### 7.3 Validazione lato server
Ogni azione viene controllata prima di passare al motore:
- è la fase giusta?
- il giocatore ha diritto di farla (voto: peso maggiore di 0 e non licenziato; ballottaggio: non candidato; azione da spia: è una spia)?
- ha ancora quota (messaggi)?
- i riferimenti esistono e gli appartengono (per esempio, possiede la copia del segreto che inoltra)?

### 7.4 Timer
- I timer stanno **sul server**. I client mostrano solo un conto alla rovescia basato sull'orario di scadenza ricevuto.
- Alla scadenza, chi non ha agito riceve una **scelta predefinita** che conserva lo stato delle cose (D-029, D-060): voto → **"NO"** (in TV "No (tempo scaduto)"); domanda "C'è una spia?" → **"No"**; nomi e ballottaggio → nessun voto; mossa privata → "azienda"; obiettivo → a caso.

---

## 8. Modello dati

```ts
interface Partita {
  id: string; codice: string; seme: number;
  stato: Fase;                         // vedi §9
  trimestre: 1 | 2 | 3 | 4;
  giocatori: Giocatore[];
  reparti: Reparto[];
  concorrenti: Concorrente[];
  azienda: { quota: number; cassa: number };
  proposteTrimestre: PropostaIstanza[];
  segreti: Segreto[];                  // originali generati dal gioco
  copieSegreto: CopiaSegreto[];        // chi possiede quale versione
  messaggi: Messaggio[];
  log: VoceLog[];                      // tutto ciò che è accaduto, in ordine
  opzioni: OpzioniPartita;
}

interface Giocatore {
  id: string; nome: string; loc: string;          // casa/TV di appartenenza
  repartoId: RepartoId;
  fazione: "ONESTO" | { spiaDi: ConcorrenteId };
  stato: "ATTIVO" | "LICENZIATO";                // niente demansionamento (D-057)
  puntiReparto: number;
  quotaMessaggi: number;
  poteriUsati: string[];
  pauseCaffe: number;
  connesso: boolean;
}

interface Reparto {
  id: RepartoId;                                  // "ACQUISTI" | "PRODUZIONE" | ...
  occupatoDa?: GiocatoreId;                       // assente = vacante
  autogestione: boolean;                          // vacante (D-057)
}

interface PropostaIstanza {
  id: string; modelloId: string;
  titolo: string; costo: number;
  categoria: CategoriaVoto;                       // determina i pesi
  pesi: Record<RepartoId, 0 | 1 | 2>;
  effettiPrivati: Record<RepartoId, EffettoPrivato>;
  effettoAzienda: number;                         // nascosto fino alla risoluzione
  voti: Record<GiocatoreId, "SI" | "NO" | "ASTENUTO">;
  esito?: "APPROVATA" | "RESPINTA";
}

interface Segreto {
  id: string; modelloId: string;
  tipo: "DA_FAR_GIRARE" | "NORMALE" | "DA_CUSTODIRE"; // D-038, valori in config segreti.tipi
  campi: Record<string, string | number>;         // dato vero, estratto campo per campo (D-036, D-037)
  valoriPossibili: Record<string, (string | number)[]>; // suggerimenti per chi falsifica
  repartoUtile: RepartoId;                        // dove vale se arriva in tempo
  valoreAzienda: number; valoreConcorrente: number; // copiati dal tipo alla distribuzione
  scadenzaTrimestre: number;
}

interface CopiaSegreto {
  id: string; segretoId: string;
  possessore: GiocatoreId;
  campi: Record<string, string | number>;         // possono differire dall'originale
  falsa: boolean;                                 // calcolato: campi ≠ originale
  provenienza: "GIOCO" | { da: GiocatoreId; anonimo: boolean };
  catena: GiocatoreId[];                          // percorso completo (solo server)
}

interface Messaggio {
  id: string; trimestre: number;
  da: GiocatoreId; a: GiocatoreId; anonimo: boolean;
  modello: "SEGRETO" | "CHIEDI_DATO" | "PATTO" | "SOLO_TESTO";
  testo?: string;                                 // max 80 caratteri
  copiaSegretoId?: string;
  ora: number;
}

interface Concorrente {
  id: ConcorrenteId; nome: string;
  quota: number;
  segretiRicevuti: string[];                      // id copie
}
```

**Nota sulla `catena`:** il server registra il percorso di ogni copia di segreto (chi l'ha passata a chi, e se modificata). Serve per gli effetti (vero/falso), per i poteri d'indagine (IT, Risorse Umane) e per la lettura finale. Non viene mai inviata ai client durante la partita.

---

## 9. Macchina a stati della partita

```
LOBBY
  └─► ASSEGNAZIONE (ruoli, spie, tre obiettivi proposti a testa)
        └─► TUTORIAL (facoltativo, si può saltare)
              └─► SCELTA_OBIETTIVI (ognuno ne tiene uno; a tempo scaduto a caso — D-048)
                    └─► TRIMESTRE n (n = 1..4)
                    ├─ RAPPORTO           (tre proposte 30/50/80 e pacchetti possibili;
                    │                      segreti distribuiti nei trimestri 1–3; nel 1° si
                    │                      preparano le 12 carte con l'algoritmo di equità)
                    ├─ DISCUSSIONE        (messaggi abilitati, timer — D-068)
                    ├─ VOTO_PACCHETTO     (segreto fino alla chiusura, poi palese; maggioranza
                    │                      dei membri → approvato)
                    ├─ SECONDO_VOTO       (solo senza maggioranza: sì/no al più votato,
                    │                      alternativa coperta; tempo scaduto = no)
                    ├─ MOSSA_PRIVATA      (timer)
                    └─ RISOLUZIONE        (calcoli + animazioni TV)
              └─► FINALE "Rinnovo dei contratti" (D-058)
                    ├─ DOMANDA giro g    ("C'è una spia?" palese; sì < metà → PUNTEGGIO)
                    ├─ NOMINA giro g     (un nome a testa; > metà dei nomi fatti → licenziato)
                    ├─ BALLOTTAGGIO g, turno 1..3 (se nessuno ha la maggioranza)
                    │    percorso DUE: stallo → turno 2; stallo → licenziati entrambi
                    │    percorso TRE: stallo → turno 2 (avviso); stallo → turno 3 con
                    │                  nomi ripetuti bloccati; stallo → nessun licenziato
                    └─ 8 giocatori e un solo licenziato al giro 1 → DOMANDA giro 2
              └─► PUNTEGGIO
                    └─► LETTURA_MESSAGGI
                          └─► FINE
```

- Ogni transizione è un'azione di sistema (`AVANZA_FASE`), attivata dal timer o dalla conferma di tutti i giocatori.
- ✅ provvisorio (D-068, supera D-008): una DISCUSSIONE e un VOTO_PACCHETTO per trimestre, con eventuale SECONDO_VOTO. La quota messaggi resta per trimestre.

---

## 10. Algoritmi di gioco

> Tutti i numeri indicati sono **parametri** in un file di configurazione, da tarare con il simulatore.

### 10.1 Assegnazione di ruoli e spie
```
input: N giocatori (4..8), seme
1. reparti_attivi = BASE(4) + aggiuntivi in ordine fino a N
   reparti oltre N → vacanti, in autogestione
2. numero_spie:
     N in 4..7 → 0 con p0 (≈ 0,15), altrimenti 1
     N = 8     → 0 con p0, 1 con p1, 2 con p2
3. numero_concorrenti = 2 se N = 8, altrimenti 1   (D-011, provvisorio)
4. se 2 spie:
     stesso concorrente con probabilità q (si conoscono)
     concorrenti diversi con probabilità 1−q (non si conoscono)
5. assegnazione casuale (mescolamento con seme) di reparti e fazioni
6. obiettivi (D-046…D-049): tre a testa, uno per tipo; prima le spie (solo aziendalisti),
   poi gli onesti (tutto il mazzo); nessun obiettivo ripetuto nella partita. Lo stato
   (proposti e scelto) sta in partita.obiettivi, solo sul server.
```

### 10.2 Le carte della partita e l'algoritmo di equità (D-068, D-069, D-070)
```
all'inizio del 1° trimestre (una volta sola, con il seme della partita):
1. per ogni trimestre un quesito per costo (30 / 50 / 80), tra quelli ammessi nel trimestre e non
   ancora usciti, preferendo categorie diverse; versione principale o alternativa (D-045)
   — la combinazione del trimestre deve permettere i reparti smistati:
     reparti con bonus nella più cara + reparti con bonus in una delle altre ≤ reparti occupati
2. ogni schema ha un totale fisso di bonus e malus per costo (30 → +2/−1, 50 → +3/−2, 80 → +5/−3:
   la grande vale quanto le due piccole), controllato al caricamento dei contenuti
3. assegnazione dei ruoli ai reparti occupati:
   a) "golosa": tutti i ruoli della partita dal più grande, ognuno al reparto con il totale più
      basso di quel segno; un ruolo per reparto per carta; un bonus non va a chi ha già un bonus
      sull'altro lato del pacchetto (la più cara / le altre) nello stesso trimestre
   b) "scalata": spostamenti e scambi di ruoli che avvicinano i totali alla media, senza creare
      reparti non smistati; passi "alla pari" a caso per uscire dai vicoli ciechi
   c) obiettivo: totali di bonus e di malus uguali per tutti, scarto ≤ tolleranzaEquita (1);
      dopo tentativiEquita prove si estrae un'altra serie di carte (fino a 10), poi si tiene la migliore
4. effetti privati: testo su misura del quesito o frase predefinita del reparto
Misure (3000 partite di prova): scarto entro 1 e zero violazioni in tutti i casi; da 0,2 a 33 ms a partita.
```

### 10.3 Voto del pacchetto (D-068)
```
pacchetti validi = combinazioni delle tre proposte con  costo ≥ investimentoMinimo (51) e ≤ cassa
primo voto: ogni membro del direttivo sceglie un pacchetto (segreto fino alla chiusura)
  se un pacchetto ha ≥ floor(membri/2)+1 voti → approvato
  altrimenti: principale = il più votato (pari merito o nessun voto: estratto tra i candidati)
              alternativa = estratta tra gli altri pacchetti validi (coperta: la TV vede solo quante proposte)
secondo voto: sì/no al principale; sì ≥ floor(membri/2)+1 → principale, altrimenti alternativa
              (tempo scaduto = no)
approvazione: cassa −= costo del pacchetto; effetti privati e aziendale alla RISOLUZIONE
cassa: += 100 a trimestre, senza tetto
```
### 10.4 Mossa privata
```
per ogni membro del direttivo (i reparti vacanti non partecipano; tempo scaduto = "azienda"):
  REPARTO → puntiReparto += a ; deltaAzienda −= b
  AZIENDA → puntiReparto += 0 ; deltaAzienda += c
  (a, b, c iniziali: 1, 1, 1; eventi possono modificarli)
deltaAzienda += rumore ∈ {−1, 0, +1}
TV mostra: "N su M hanno giocato per l'azienda" (mai chi; D-061). Nel 4° trimestre si annuncia subito.
```

### 10.5 Segreti: distribuzione, inoltro, uso (D-072, D-073, D-074)
```
DISTRIBUZIONE (fase RAPPORTO, trimestri 1..ultimoTrimestre = 3):
  due segreti dello STESSO tipo (tipo estratto con segreti.tipi[t].probabilita), uno vero e uno finto
  fonte e destinatario tra i membri del direttivo: chi è stato coinvolto meno finora, un ruolo a testa
  nel trimestre se possibile; al massimo un segreto con una spia dentro, ed è il finto; se nessuna spia
  è coinvolta il finto si estrae a caso
  scadenza = trimestre + 1 (fine del trimestre successivo), per il reparto utile e per il concorrente
  evento pubblico SEGRETO_ANNUNCIATO: "<reparto utile> ha bisogno di informazioni su «titolo» entro la
  fine del prossimo trimestre!" — mai chi l'ha ricevuto (D-061)
  alla fonte: "Arrivato al tuo reparto" (niente "dato certo", D-074)

INOLTRO (messaggio con modello SEGRETO):
  rifiutato se il destinatario ha già una copia, se il segreto è scaduto, o se il destinatario è il
  reparto utile e la catena della copia ha meno di passaggiMinimi[N] colleghi (1-1-2-2-2)
  nuova copia: campi inviati; falsa = (campi ≠ originale); catena = catena del mittente + [mittente]
  vista: mittente diretto (o "anonimo"), passaggi mancanti, chi ha già il segreto (giaServiti);
  la spia vede "finto" sui segreti in cui è fonte o destinataria; mai il flag "falsa"
  primo arrivo al reparto utile (qualsiasi versione) → annunciato in TV ai Risultati

VALORE PER L'AZIENDA (RISOLUZIONE del trimestre di scadenza):
  se il reparto utile ha una copia VERA e il segreto non è il finto → quota azienda += valoreAzienda
  (si conta alla scadenza, insieme all'altro segreto del trimestre: niente numero per segreto)

USO DA PARTE DI UNA SPIA (PASSA_AL_CONCORRENTE, fino alla scadenza):
  copia vera di un segreto vero → quota concorrente += valoreConcorrente
  copia falsa o segreto finto  → quota concorrente −= penalitàFalso (4)
  l'evento TV mostra QUALE segreto è stato usato (nel 4° trimestre come fuga di notizie, senza numeri)
```

### 10.6 Concorrenti
```
a ogni RISOLUZIONE, per ogni concorrente:
  quota += crescita media dell'azienda (D-056):
              numero giocatori × [q × deltaAzienda "per l'azienda" + (1−q) × deltaAzienda "per il reparto"]
              + crescitaMediaProposteESegreti        (q = quotaAziendalistaRiferimento, 0,45)
         + evento casuale (−1 / 0 / +1, media zero)
         + effetti dei segreti veri ricevuti in questo trimestre (+1 / +2 / +3)
         − penalità per segreti falsi (4)
         + reazione: se l'azienda ha approvato una proposta di "attacco", −1
  Marketing (se attivo) riceve in anticipo l'anteprima di una mossa concorrente
```
Obiettivo di taratura: con una spia attiva e non scoperta la vittoria dell'azienda deve scendere sensibilmente; riferimento di Luis con 4 giocatori e 1 spia: circa 20% spia, 80% onesti. La vittoria dell'azienda senza spie (in origine 55–65%) è **solo informativa** (D-054): ogni giocatore punta a vincere personalmente. ⚖️

### 10.7 Autogestione
```
voto:          nessuno (il reparto non vota)
mossa privata: "azienda" con probabilità alta (es. 80%)
segreti:       non sono mai fonte né reparto utile (si scelgono tra i membri del direttivo)
effetti:       nessuno accumula punti (D-057: l'autogestione riguarda solo i reparti vacanti)
proposte:      non vengono generate proposte che lo riguardano specificamente
```

### 10.8 Demansionamento e promozione — eliminato (D-057)

### 10.9 Finale "Rinnovo dei contratti" (D-058)
```
0. i numeri del 4° trimestre restano nascosti fino a PUNTEGGIO; le fughe di notizie e il
   conteggio della mossa privata si annunciano subito (D-029 variante B, D-061)
1. DOMANDA: ogni membro risponde "C'è una spia?"; tempo scaduto = No; voti rivelati a fine voto
   sì × 2 ≥ membri → NOMINA, altrimenti → PUNTEGGIO
2. NOMINA: ogni membro fa un nome (non se stesso); rivelazione una alla volta (ordine casuale)
   votanti = chi ha fatto un nome
   un solo primo con voti ≥ floor(votanti / 2) + 1 → licenziato (ruolo svelato solo al PUNTEGGIO, D-078)
   altrimenti candidati = primi pari merito (se più d'uno) oppure primo + tutti i secondi
              percorso = DUE se i candidati sono 2, TRE se sono di più
3. BALLOTTAGGIO turno t: votano i membri non candidati (se non ce ne sono, tutti, non per sé)
   un solo candidato col massimo dei voti → licenziato
   stallo, percorso DUE: t=1 → t=2 stessi candidati; t=2 → licenziati entrambi
   stallo, percorso TRE: t=1 → AVVISO + t=2 tra i primi; t=2 → t=3 tra i primi, e chi ha
          votato lo stesso nome a t=1 e t=2 non può votarlo; t=3 → nessun licenziato
4. 8 giocatori, giro 1 con esattamente un licenziato → DOMANDA giro 2; altrimenti PUNTEGGIO
```
### 10.10 Punteggio
```
per ogni giocatore:
  totale = puntiReparto
         + Σ obiettivi raggiunti (facile / difficile)
         + bonus fazione (azienda vince → onesti; concorrente X vince → spie di X)
         (nessun punto per accuse e licenziamenti — D-059; la spia licenziata perde il bonus — D-025)
         + punti spia per segreti usati (🔴)
```
L'esito "azienda vince" si calcola a fine anno: quota dell'azienda maggiore di quella di ogni concorrente.
L'esito "concorrente X vince" (bonus alle spie di X): quota di X maggiore di quella dell'azienda, indipendentemente dall'altro concorrente (D-011).

---

## 11. Messaggi privati e "pausa caffè"

### 11.1 Messaggi
- **Quota:** ricaricata a ogni trimestre (default 2). Non si accumula.
- **Anonimo:** consuma 2 unità. Il destinatario vede "Mittente anonimo".
- **Testo libero:** massimo 80 caratteri, filtrato contro l'invio di codice o link.
- **Finestra temporale:** 🔴 da decidere se i messaggi sono permessi in tutte le fasi o solo in DISCUSSIONE.
- **Lettura finale:** in LETTURA_MESSAGGI la TV mostra tutti i messaggi in ordine cronologico, con mittenti reali e indicazione dei segreti falsi.

### 11.2 Rilevamento "pausa caffè"
- **Page Visibility API:** l'evento `visibilitychange` segnala quando la pagina passa in secondo piano.
- **Filtro antirumore:** si conta una pausa solo se la pagina resta nascosta più di **3 secondi** (⚖️). Così si ignorano gesti accidentali.
- Il client invia `VISIBILITA`. Il server conta le pause e la TV mostra "☕ Marco (3)".
- **Limiti noti:** non distingue una chiamata in arrivo da un'uscita volontaria. Non vede un secondo dispositivo. In alcuni casi l'apertura del centro notifiche non viene rilevata. È un **deterrente sociale**, non un controllo.

### 11.3 Schermo sempre acceso
- **Screen Wake Lock API** (`navigator.wakeLock.request("screen")`), da richiedere di nuovo quando la pagina torna visibile.
- Ripiego per browser non compatibili: libreria tipo *NoSleep.js* (video muto in riproduzione continua).

---

## 12. Audio (fase online)

### 12.1 Topologia
- Ogni telefono **pubblica** un flusso audio (microfono) verso il server audio.
- Ogni **TV** e ogni telefono **in modalità cuffie** si **iscrive** ai flussi da ascoltare.
- **Regola di instradamento:** si ascoltano tutti i flussi **con `loc` diverso dal proprio**. Chi è nella stessa stanza si sente dal vivo.

```
Casa A (loc=A): TV_A, tel1, tel2         Casa B (loc=B): TV_B, tel3
  TV_A    ascolta: tel3                    TV_B ascolta: tel1, tel2
  tel1 (cuffie) ascolta: tel3              tel3 (cuffie) ascolta: tel1, tel2
```

- Implementazione con LiveKit: un'unica "room" audio. Il server assegna a ogni partecipante i permessi di iscrizione filtrati per `loc` (tramite token o iscrizione selettiva gestita dal client secondo una lista fornita dal server).

### 12.2 Modalità del giocatore

| | Modalità CUFFIE | Modalità TV |
|---|---|---|
| Ascolto | Flussi remoti nel telefono | Flussi remoti dalla TV |
| Microfono | Aperto, con noise gate | Premi-e-parla o interruttore |
| Cancellazione eco | Del browser (efficace: l'audio esce nelle cuffie) | Non necessaria: microfono chiuso mentre si ascolta |

### 12.3 Trattamento del microfono
- Vincoli di acquisizione: `echoCancellation: true`, `noiseSuppression: true`, `autoGainControl: true`.
- **Noise gate** lato client (Web Audio API): si misura il volume del microfono; sotto una soglia ⚖️ il flusso viene silenziato (`track.enabled = false` o guadagno a 0). Lo scopo è non trasmettere la voce del vicino ripresa debolmente.
- **Premi-e-parla:** il flusso è pubblicato ma silenziato. Si attiva con il tocco o con l'interruttore.

### 12.4 Indicatore di chi parla
- Il server audio segnala i **parlanti attivi**. Il server di gioco li inoltra alla TV, che illumina il nome.
- Per i giocatori nella stessa stanza della TV: anche se il loro audio non viene riprodotto lì, il loro nome si illumina comunque.

### 12.5 Particolarità dei browser
- **Riproduzione automatica:** i browser bloccano l'audio senza un gesto dell'utente. La TV mostra "Tocca/premi per iniziare" all'avvio.
- **iPhone:** il microfono si chiude se la pagina va in secondo piano. Al ritorno serve ripristinare il flusso automaticamente.
- **Bluetooth:** usare il microfono delle cuffie forza la modalità "chiamata" (qualità telefonica). Avviso nell'interfaccia.
- **Ritardo obiettivo:** sotto i 300 ms dall'inizio alla fine.

### 12.6 Alternativa di stanza (facoltativa)
- Un **portatile collegato alla TV** può pubblicare un unico microfono di stanza, con cancellazione dell'eco efficace perché conosce l'audio che riproduce. I telefoni della stanza restano solo controller.

---

## 13. Contenuti come dati

Tutti i contenuti sono file JSON validati da uno schema all'avvio.

### 13.1 Proposta
```json
{
  "id": "nuovo-macchinario",
  "titolo": "Nuovo macchinario per la linea 2",
  "categoria": "INVESTIMENTI",
  "costo": 50,                       // solo 30 / 50 / 80 (D-062)
  "riguarda": ["PRODUZIONE"],
  "trimestri": [1, 2, 3],
  "pesi": { "PRODUZIONE": 2, "ACQUISTI": 1, "VENDITE": 1, "MARKETING": 1 },   // facoltativo: se assente valgono i pesi della categoria
  "effettiPrivati": {
    "PRODUZIONE": { "punti": -2, "testo": "Più costi di gestione per il tuo reparto" },
    "VENDITE":    { "punti": 3,  "testo": "Più merce da vendere" },
    "FINANZA":    { "punti": -1, "testo": "Investimento pesante sul bilancio" },
    "MARKETING":  { "info": "Il mercato è in calo: effetto sull'azienda minore del previsto" }
  },
  "effettoAzienda": { "base": 2, "modificatori": [{ "se": "mercatoInCalo", "delta": -1 }] }
}
```

### 13.2 Tabella dei pesi
```json
{
  "INVESTIMENTI": { "PRODUZIONE": 2, "FINANZA": 2, "ACQUISTI": 1, "VENDITE": 1, "MARKETING": 0 },
  "CAMPAGNE":     { "MARKETING": 2, "VENDITE": 2, "FINANZA": 1, "PRODUZIONE": 0, "ACQUISTI": 0 },
  "PERSONALE":    { "RISORSE_UMANE": 2, "PRODUZIONE": 1, "FINANZA": 1, "VENDITE": 0 }
}
```

### 13.3 Altri file
- `segreti.json`: modelli di segreti con campi variabili, reparto fonte, reparto utile e valori.
- `obiettivi.json`: obiettivi personali (D-046…D-052). Ogni obiettivo ha tipo, flag `aziendalista` e due traguardi; ogni traguardo ha una `misura` (cosa conta il motore, elenco in `engine/src/misure.ts`), una `soglia` (numero oppure `META_ALTRI`, `TUTTI_ALTRI`, `TUTTI_I_TRIMESTRI`) e un eventuale `parametro`. Le misure leggono gli storici solo-server (`storicoVotazioni`, `storicoTrimestri`, `finale.storicoNomine`, `alterataDa` delle copie) e hanno due livelli di conoscenza: "giocatore" (avanzamento sul telefono, senza informazioni nascoste) e "completa" (punteggio).
- `eventi.json`: eventi di trimestre ("questo trimestre l'egoismo vale doppio").
- `concorrenti.json`: nomi, eventi propri.
- `config.json`: tutti i parametri numerici (§10).

I contenuti si possono tradurre o cambiare di ambientazione senza toccare il codice.

---

## 14. Simulatore

**Scopo:** tarare i numeri prima delle prove con persone vere.

- Usa **lo stesso motore** del server.
- **Giocatori-robot** con strategie configurabili:
  - *onesto cooperativo*, *onesto egoista*, *onesto bugiardo* (esagera gli effetti);
  - *spia prudente* (usa solo segreti molto diffusi), *spia aggressiva*;
  - votazioni e accuse basate su regole semplici e sui sospetti accumulati.
- **Metodo Monte Carlo:** migliaia di partite con semi diversi.
- **Metriche:**
  - percentuale di vittoria di onesti e spie, per numero di giocatori e di spie;
  - percentuale di spie scoperte nel finale;
  - frequenza di onesti licenziati per errore;
  - quanto spesso conviene la mossa "reparto" rispetto alla mossa "azienda";
  - distribuzione dei punteggi finali;
  - quanto spesso la cassa si esaurisce;
  - **equità tra reparti:** percentuale di vittoria personale, punteggio medio, peso di voto
    totale disponibile nell'anno, segreti ricevuti e utilità dei poteri, **per ciascun reparto**
    e per ogni numero di giocatori (principio "pari opportunità", GDD §1).
- **Uscita:** report in CSV e grafici.

Limite: i robot non mentono e non persuadono come le persone. Il simulatore trova gli squilibri numerici evidenti, ma il divertimento si misura solo con le prove reali.

---

## 15. Sicurezza e anti-imbroglio

| Rischio | Contromisura |
|---|---|
| Leggere dati segreti dal codice o dalla rete | Viste filtrate lato server: i dati segreti non escono mai verso il client sbagliato. Nessun contenuto segreto nel pacchetto JavaScript. |
| Inviare azioni non permesse | Validazione completa lato server (§7.3) |
| Impersonare un altro giocatore | Token di sessione casuali e firmati, associati alla connessione |
| Entrare in partite altrui | Codici stanza casuali, scadenza delle stanze, limite di tentativi |
| Inondare di messaggi | Quote applicate lato server e limite di frequenza |
| Comunicazione esterna (WhatsApp, ecc.) | Non è impedibile. Deterrenti: "pausa caffè", lettura finale dei messaggi, regola dichiarata |
| Dati personali | Si raccoglie solo il nome scelto. Partite e messaggi vengono cancellati dopo un periodo (🟡 7 giorni), tranne la classifica |

---

## 16. Persistenza, riconnessione e log

- **Stato in memoria** per le partite in corso, più uno **snapshot** su SQLite (o Redis) dopo ogni azione o fase.
- **Log degli eventi** completo: permette di ricostruire la partita da zero (seme più sequenza di azioni). È utile per riprendere dopo un riavvio del server e per riprodurre un bug.
- **Riconnessione:** il telefono riapre la pagina, presenta il token e riceve la vista aggiornata. La TV si riconnette con il codice stanza.
- **Giocatore disconnesso a lungo:** dopo un tempo limite ⚖️ il suo reparto passa temporaneamente in autogestione, finché non torna.
- **Classifica su più serate:** tabella persistente collegata a un "gruppo" di giocatori (🔴 serve un minimo di identificazione: nome più codice gruppo).

**Stato di attuazione (fase 3, passo 1 — 23/11/2026):** stato solo in memoria; ogni stanza scrive il registro delle azioni (seme + azioni) in `packages/server/registri/` (non salvato in Git), utile per riprodurre un problema. **Non ancora fatti:** snapshot su SQLite e ripresa automatica dopo un riavvio del server (se il server si spegne, la partita si perde); autogestione dei giocatori scollegati a lungo (per ora chi è scollegato riceve allo scadere la scelta predefinita, come chi non agisce, D-060).

---

## 17. Infrastruttura e hosting

### 17.1 Fase locale
✅ **Prime prove sul PC di Luis, in rete di casa, con indirizzo `http`** (D-067): comando `corepack pnpm gioca`. Senza HTTPS il telefono non tiene lo schermo acceso da solo (limite accettato per le prove in solitario).

🟡 **Hosting in cloud, prima della serata con altre persone** (DG-006, da decidere al passo 5).
Motivo: microfono e Wake Lock richiedono **HTTPS**. Un server sul portatile di casa richiederebbe certificati installati su ogni telefono: complicato per gli ospiti.

- Un servizio di hosting per applicazioni Node.js con WebSocket e HTTPS automatico (per esempio Fly.io, Render, Railway, oppure un piccolo server virtuale con Caddy).
- Costo indicativo: da zero a pochi euro al mese per l'uso previsto. Da verificare sui listini attuali.

### 17.2 Fase online
- Stesso server di gioco più **server audio**:
  - **LiveKit Cloud**: nessuna gestione, costo a consumo (da verificare i piani attuali);
  - **LiveKit installato in proprio** su un server virtuale: più economico ma richiede configurazione di rete (porte UDP, server TURN per le reti restrittive).
- **TURN:** necessario per i telefoni dietro reti che bloccano il traffico diretto (alcune reti mobili). Incluso nei servizi cloud.

### 17.3 Ambienti
- **Sviluppo:** in locale, con tunnel HTTPS (per esempio un tunnel Cloudflare) per provare dai telefoni.
- **Prova:** un'istanza separata per le serate di test.
- **Produzione:** l'istanza per giocare.

---

## 18. Struttura del codice

```
il-direttivo/
├─ packages/
│  ├─ engine/          # logica pura: stato, azioni, regole, viste, punteggio
│  │  ├─ src/
│  │  │  ├─ tipi.ts    # stato della partita
│  │  │  ├─ azioni.ts  # azioni, eventi, esiti
│  │  │  ├─ partita.ts # creazione e assegnazione segreta
│  │  │  ├─ fasi.ts    # macchina a stati delle fasi
│  │  │  ├─ motore.ts  # applica(partita, azione)
│  │  │  ├─ config.ts  # lettura e controllo dei parametri
│  │  │  ├─ contenuti.ts # mazzo, pesi, segreti + controlli
│  │  │  ├─ proposte.ts  # estrazione dell'ordine del giorno
│  │  │  ├─ votazioni.ts · risoluzione.ts · segreti.ts · personali.ts · finale.ts · punteggio.ts
│  │  │  ├─ rules/     # votazioni, segreti, concorrenti, autogestione, finale
│  │  │  ├─ views.ts   # proiezione per TV e per giocatore
│  │  │  └─ rng.ts     # generatore casuale con seme
│  │  └─ test/
│  ├─ content/         # JSON: proposte, segreti, obiettivi, eventi, config
│  ├─ server/          # Node: stanze, socket, timer, persistenza, token audio
│  ├─ client-tv/       # pagina tabellone
│  ├─ client-phone/    # pagina controller
│  ├─ shared/          # tipi e schemi condivisi (azioni, viste)
│  └─ simulator/       # robot, Monte Carlo, report
├─ docs/
│  ├─ 01-design-del-gioco.md
│  └─ 02-architettura-tecnica.md
└─ pnpm-workspace.yaml
```

---

## 19. Test

- **Unitari sul motore:** ogni regola ha test con casi limite (parità, segreti falsi, ballottaggi a due e a tre, nomi bloccati, partita senza spie).
- **Proprietà fondamentale delle viste:** un test automatico verifica che **nessuna vista di un giocatore contenga dati che non dovrebbe vedere** (ruoli altrui, flag "falsa", effetti privati altrui, catena dei segreti).
- **Partite riprodotte:** dato seme più sequenza di azioni, il risultato deve essere sempre identico.
- **Prove manuali con più telefoni:** una lista di controllo per ogni rilascio (ingresso con QR, riconnessione, schermo acceso, pausa caffè).
- **Prove audio reali** (fase online) in 2–3 case diverse.

---

## 20. Roadmap tecnica

| Fase | Contenuto | Uscita |
|---|---|---|
| **0. Motore e simulatore** | Motore puro, contenuti minimi, robot, metriche | Numeri tarati in modo approssimativo |
| **1. Prototipo locale** | Server, TV, telefoni, QR, tutte le fasi, finale, lettura messaggi | Serata di prova con 5–6 persone |
| **2. Rifinitura** | Animazioni, tutorial in TV, tono, più contenuti, classifica | Gioco locale completo |
| **3. Prototipo audio** | Stanze per `loc`, due modalità, premi-e-parla, noise gate, indicatore di chi parla | Prova audio in 2–3 case, senza gioco |
| **4. Online** | Più TV, integrazione audio nel gioco, riconnessione robusta | Prima partita a distanza |
| **5. Estensioni** | Reparti aggiuntivi, poteri speciali, nuove ambientazioni | |

> La fase 3 (audio) può essere sviluppata in parallelo alla 2, perché è indipendente dal gioco.

---

## 21. Rischi tecnici

| Rischio | Impatto | Mitigazione |
|---|---|---|
| Browser delle smart TV inadeguati | Medio | Consigliare portatile o chiavetta; testare presto |
| iPhone: microfono e schermo che si spengono | Alto (fase online) | Wake Lock, ripristino automatico del flusso, avvisi chiari |
| Eco e voci doppie nella stessa stanza | Alto (fase online) | Regola di instradamento per `loc`, modalità cuffie, premi-e-parla, noise gate |
| Reti mobili restrittive | Medio | Server TURN (incluso nei servizi cloud) |
| Fuga di dati segreti nelle viste | Alto (rovina il gioco) | Viste filtrate più test automatico dedicato |
| Disconnessioni durante la partita | Medio | Token, snapshot, autogestione temporanea |
| Complessità eccessiva per un non programmatore | Alto | Motore separato e testato, sviluppo a fasi, contenuti in JSON modificabili a mano |
| Costi del server audio | Basso–medio | Partire con un piano a consumo; valutare l'installazione in proprio solo se necessario |
