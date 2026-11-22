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
  | { tipo: "PROPONI_DEMANSIONAMENTO"; bersaglio: GiocatoreId }
  | { tipo: "VOTA_DEMANSIONAMENTO"; voto: "SI" | "NO" }
  | { tipo: "VOTA_PROMOZIONE"; bersaglio: GiocatoreId; voto: "SI" | "NO" }
  | { tipo: "VERIFICA_FINALE"; soloOnesti: boolean }
  | { tipo: "NOMINA_SPIA"; bersaglio: GiocatoreId }
  | { tipo: "USA_POTERE"; parametri: unknown }
  | { tipo: "VISIBILITA"; visibile: boolean };                 // pausa caffè
```

### 7.3 Validazione lato server
Ogni azione viene controllata prima di passare al motore:
- è la fase giusta?
- il giocatore ha diritto di farla (voto: peso maggiore di 0 e non demansionato; azione da spia: è una spia)?
- ha ancora quota (messaggi)?
- i riferimenti esistono e gli appartengono (per esempio, possiede la copia del segreto che inoltra)?

### 7.4 Timer
- I timer stanno **sul server**. I client mostrano solo un conto alla rovescia basato sull'orario di scadenza ricevuto.
- Alla scadenza, chi non ha agito riceve una **scelta predefinita**: voto → **"NO"** (D-007; in TV "No (tempo scaduto)"); mossa privata → "azienda".
- Quesiti con `astensioneAmmessa: true`: tempo scaduto = "NO" anche qui (D-013).

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
  stato: "ATTIVO" | "DEMANSIONATO" | "LICENZIATO";
  demansionatoDalTrimestre?: number;
  puntiReparto: number;
  obiettivi: ObiettivoIstanza[];
  quotaMessaggi: number;
  poteriUsati: string[];
  pauseCaffe: number;
  connesso: boolean;
}

interface Reparto {
  id: RepartoId;                                  // "ACQUISTI" | "PRODUZIONE" | ...
  occupatoDa?: GiocatoreId;                       // assente = vacante
  autogestione: boolean;                          // vacante oppure demansionato
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
  campi: Record<string, string | number>;         // es. { gara: "X", offerta: 118000 }
  repartoUtile: RepartoId;                        // dove vale se arriva in tempo
  valoreAzienda: number; valoreConcorrente: number;
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
  └─► ASSEGNAZIONE (ruoli, spie, obiettivi)
        └─► TUTORIAL (facoltativo)
              └─► TRIMESTRE n (n = 1..4)
                    ├─ RAPPORTO           (effetti privati, segreti distribuiti,
                    │                      ordine casuale delle proposte annunciato)
                    ├─ per k = 1..2–3:    (D-008)
                    │    ├─ DISCUSSIONE k (messaggi abilitati, timer)
                    │    └─ VOTAZIONE k   (palese, timer, esito subito in TV)
                    ├─ MOSSA_PRIVATA      (timer)
                    ├─ RISOLUZIONE        (calcoli + animazioni TV)
                    └─ DEMANSIONAMENTO    (facoltativo: proposta → voto)
              └─► FINALE
                    ├─ PROMOZIONI
                    ├─ LICENZIAMENTO_DEMANSIONATI   (rivelazione ruoli)
                    ├─ VERIFICA          (sì/no segreto)
                    │    ├─ tutti sì ───────────────────────────┐
                    │    └─ almeno un no → RIVELA_NO            │
                    ├─ NOMINA            (segreta)              │
                    ├─ RIVELAZIONE_NOMINE (una alla volta)      │
                    ├─ BALLOTTAGGIO      (se parità)            │
                    ├─ LICENZIAMENTO     (rivelazione ruolo)    │
                    └─ SECONDO_GIRO?     (solo se 2 spie possibili) ─► VERIFICA
              └─► PUNTEGGIO ◄───────────────────────────────────┘
                    └─► LETTURA_MESSAGGI
                          └─► FINE
```

- Ogni transizione è un'azione di sistema (`AVANZA_FASE`), attivata dal timer o dalla conferma di tutti i giocatori.
- ✅ provvisorio (D-008): un ciclo DISCUSSIONE → VOTAZIONE per proposta; ordine estratto con il seme della partita e annunciato nel RAPPORTO. La quota messaggi resta per trimestre.

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
6. obiettivi: estrazione dal mazzo filtrato per reparto e fazione, senza duplicati
```

### 10.2 Generazione delle proposte del trimestre
```
1. mazzo = proposte compatibili con il trimestre corrente
2. escludi le proposte con "riguarda" ∈ reparti in autogestione
   e penalizza (estrazione rara) quelle in cui i reparti vacanti avrebbero peso rilevante (D-006)
3. escludi le proposte già uscite
4. estrai il numero previsto dalla scaletta (T1: 2, T2: 3, T3: 3, T4: 2 — D-014, parametro),
   preferendo categorie diverse (varietà dei pesi) e rispettando il bilanciamento dei favoriti:
   conteggio "favorito" per reparto occupato, scarto massimo ±1 a fine partita (D-014)
5. per ognuna calcola:
     pesi = tabella_pesi[categoria], con i reparti assenti a 0
     effetti privati = modello ± variazione casuale piccola (±1), se previsto
     effettoAzienda = somma pesata degli effetti + fattore_mercato
```

### 10.3 Risoluzione di una votazione
```
se proposta.astensioneAmmessa: pesi = 1 per ogni reparto occupato   ("votazione del consiglio", D-013)

sì         = Σ pesi dei giocatori ATTIVI che hanno votato SÌ
caso normale:
  pesoTotale = Σ pesi dei reparti OCCUPATI (anche se demansionati)
               (i reparti vacanti dall'inizio non contano — D-006, provvisorio)
  soglia     = floor(pesoTotale / 2) + 1
quesito con astensione (D-007, D-013):
  pesoVotanti = Σ pesi di chi ha votato SÌ o NO + Σ pesi dei demansionati (no fisso)
  soglia      = floor(pesoVotanti / 2) + 1
approvata  = (sì ≥ soglia) E (costo ≤ cassa)
pareggio   → respinta
se approvata: cassa −= costo; effetti privati e aziendale messi in coda per la RISOLUZIONE
```
Esempio: pesi 2+2+1+1+2 = 8 → soglia 5. Con un reparto di peso 2 demansionato, i 5 sì vanno trovati tra i 6 rimasti.

### 10.4 Mossa privata
```
per ogni giocatore attivo (in autogestione: scelta "azienda" con probabilità alta):
  REPARTO → puntiReparto += a ; deltaAzienda −= b
  AZIENDA → puntiReparto += 0 ; deltaAzienda += c
  (a, b, c iniziali: 1, 1, 1; eventi possono modificarli)
deltaAzienda += rumore ∈ {−1, 0, +1}
TV mostra soltanto: deltaAzienda < 0 → "in calo" | = 0 → "stabile" | > 0 → "in crescita"
```

### 10.5 Segreti: distribuzione, inoltro, uso
```
DISTRIBUZIONE (fase RAPPORTO):
  per ogni segreto del trimestre → una CopiaSegreto (provenienza GIOCO)
  al reparto "fonte" (≠ repartoUtile, così condividere ha un senso)

INOLTRO (messaggio con modello SEGRETO):
  nuova copia per il destinatario; campi = campi inviati
  falsa = (campi ≠ campi dell'originale)
  catena = catena del mittente + [mittente]
  il destinatario NON vede il flag "falsa"
  vista del destinatario (D-015): provenienza GIOCO → "dato ufficiale del tuo reparto";
  da giocatore → solo il mittente diretto ("anonimo" se anonimo); mai la catena

VALORE PER L'AZIENDA (fase RISOLUZIONE):
  se il giocatore del repartoUtile possiede una copia VERA prima della votazione collegata
    → quota azienda += valoreAzienda

USO DA PARTE DI UNA SPIA (PASSA_AL_CONCORRENTE):
  se copia vera  → quota concorrente += valoreConcorrente;
                   evento TV: "Il concorrente ha anticipato la nostra mossa"
  se copia falsa → quota concorrente −= penalitàFalso;
                   evento TV: "Il concorrente ha sbagliato offerta"
  l'evento TV mostra QUALE segreto è stato usato, così il gruppo può chiedersi chi lo conosceva
  (rispetta il principio "mai nascondere il perché")
```

### 10.6 Concorrenti
```
a ogni RISOLUZIONE, per ogni concorrente:
  quota += crescitaBase (es. 1)
         + evento casuale (dal mazzo eventi concorrente, es. −1..+2)
         + effetti dei segreti ricevuti in questo trimestre
         − penalità per segreti falsi
         + reazione: se l'azienda ha approvato una proposta di "attacco", −1
  Marketing (se attivo) riceve in anticipo l'anteprima di una mossa concorrente
```
Obiettivo di taratura: senza spie, l'azienda vince in circa il 55–65% dei casi giocando in modo ragionevole. Con una spia attiva e non scoperta, la percentuale deve scendere sensibilmente. ⚖️

### 10.7 Autogestione
```
voto:          nessuno (il reparto non vota)
mossa privata: "azienda" con probabilità alta (es. 80%)
segreti:       ricevuti dal reparto in autogestione → nessuno li usa né li inoltra
effetti:       gli effetti privati verso il reparto vengono applicati con un fattore ridotto
               ("rende poco, non fa disastri")
proposte:      non vengono generate proposte che lo riguardano specificamente
```

### 10.8 Demansionamento e promozione
```
PROPOSTA: un giocatore attivo propone un bersaglio (limiti: 1 per trimestre,
          non lo stesso bersaglio due volte di fila — 🟡)
VOTO:     1 a testa tra gli attivi, il bersaglio escluso (D-009); soglia: metà più uno degli aventi diritto, pareggio = respinta (D-012)
          solo SÌ/NO, nessuna astensione; tempo scaduto = NO (D-007)
EFFETTI:  stato = DEMANSIONATO; reparto in autogestione;
          revoca delle copie segreto del proprio reparto; quota messaggi = 1
          il ruolo NON viene rivelato
PROMOZIONE (D-010): nella fase DEMANSIONAMENTO, PRIMA della proposta di demansionamento
          ammessa se trimestre_corrente ≥ demansionatoDalTrimestre + 1 (un trimestre intero fuori)
          proposta da un attivo o richiesta dal demansionato; max 1 richiesta/trimestre per persona
          voto 1 a testa tra gli attivi (il demansionato non vota), solo SÌ/NO, tempo scaduto = NO
          esito: stato = ATTIVO; reparto ripristinato
```

### 10.9 Finale
```
1. promozioni finali (voti)
2. per ogni DEMANSIONATO → LICENZIATO, rivela ruolo
3. VERIFICA: ogni attivo vota segretamente sì/no
   se tutti sì → PUNTEGGIO
   altrimenti → rivela l'elenco di chi ha votato no
4. NOMINA: ogni attivo nomina un altro giocatore (non se stesso)
5. RIVELAZIONE: la TV mostra le nomine una alla volta (ordine casuale)
6. conteggio:
     un solo massimo → licenziato
     parità         → BALLOTTAGGIO tra i pari merito (stessa procedura)
     nuova parità   → tutti i pari merito licenziati
7. rivela il ruolo di ogni licenziato
8. se possibili 2 spie E giro == 1 → torna a VERIFICA (giro 2)
9. PUNTEGGIO
```

### 10.10 Punteggio
```
per ogni giocatore:
  totale = puntiReparto
         + Σ obiettivi raggiunti (facile / difficile)
         + bonus fazione (azienda vince → onesti; concorrente X vince → spie di X)
         + esiti del finale (tabella §16.2 del design)
         + penalità per demansionamenti di onesti votati (🟡)
         + punti spia per segreti usati (🔴)
```
L'esito "azienda vince" si calcola a fine anno: quota dell'azienda maggiore di quella di ogni concorrente.
L'esito "concorrente X vince" (bonus alle spie di X): quota di X maggiore di quella dell'azienda, indipendentemente dall'altro concorrente (D-011).

---

## 11. Messaggi privati e "pausa caffè"

### 11.1 Messaggi
- **Quota:** ricaricata a ogni trimestre (default 2; 1 per i demansionati). Non si accumula.
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
  "costo": 4,
  "riguarda": ["PRODUZIONE"],
  "trimestri": [1, 2, 3],
  "astensioneAmmessa": false,
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
- `obiettivi.json`: obiettivi personali con condizione verificabile dal motore (per esempio `{"tipo": "PROPOSTE_APPROVATE", "riguarda": "PROPRIO_REPARTO", "min": 2}`).
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

---

## 17. Infrastruttura e hosting

### 17.1 Fase locale
🟡 **Hosting in cloud fin da subito, anche per la fase locale.**
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
│  │  │  ├─ state.ts
│  │  │  ├─ actions.ts
│  │  │  ├─ phases/    # una cartella per fase della macchina a stati
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

- **Unitari sul motore:** ogni regola ha test con casi limite (parità, soglia con demansionati, segreti falsi, doppio ballottaggio, partita senza spie).
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
