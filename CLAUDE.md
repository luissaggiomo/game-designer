# Game Designer — Regolamento generale del progetto

Questo file vale per **tutti i giochi** contenuti nel progetto. Ogni gioco in `giochi/`
ha il proprio `CLAUDE.md` con regole specifiche, che **aggiungono** dettagli ma non
contraddicono queste regole. In caso di conflitto prevale questo file, salvo eccezione
scritta e motivata nel `DECISIONI.md` del gioco.

## 1. Cos'è il progetto

Un laboratorio di **giochi di società digitali** per uso personale (amici e famiglia).
Modello tipico: **TV/PC come tabellone comune + telefoni come controller personali**,
tutto via browser (link o QR code, nessuna app da installare).
Alcuni giochi potranno usare solo telefoni (stessa stanza o a distanza).

## 2. Ruoli

- **Luis (progettista):** decide regole, meccaniche, tono, priorità. Non scrive codice.
- **Claude (sviluppatore):** scrive e mantiene codice, test e documentazione tecnica.

### Regola d'oro delle scelte
Quando esistono **più strade valide** e la migliore dipende dallo scopo finale, Claude
**non sceglie da solo**: presenta le alternative con vantaggi, svantaggi e una
raccomandazione, in linguaggio semplice. La scelta di Luis va registrata in `DECISIONI.md`.
Le scelte puramente tecniche senza impatto su gioco, costi o esperienza d'uso
Claude le prende autonomamente, citandole brevemente.

## 3. Comunicazione

Valgono le regole globali di Luis: linguaggio semplice, termini tecnici spiegati con
un'analogia, istruzioni operative con comandi esatti, conferma prima di azioni
irreversibili, niente riassunti lunghi.

## 4. Struttura delle cartelle

```
Game Designer/
├── CLAUDE.md            ← questo file
├── README.md            ← elenco dei giochi e loro stato
├── CHANGELOG.md         ← modifiche alle regole generali del progetto
├── docs/                ← procedure e standard comuni
├── templates/gioco/     ← modelli da copiare per un nuovo gioco
├── shared/              ← codice riusabile tra più giochi (solo quando serve davvero)
├── .claude/skills/      ← comandi rapidi (/nuovo-gioco, /verifica, ...)
└── giochi/NN-nome/      ← un gioco per cartella, indipendente dagli altri
```

Documenti comuni da conoscere:
- [docs/PROCEDURE.md](docs/PROCEDURE.md) — le fasi di vita di un gioco e i "cancelli" tra una fase e l'altra
- [docs/STANDARD-TECNICI.md](docs/STANDARD-TECNICI.md) — tecnologie e architettura di riferimento
- [docs/STANDARD-GRAFICO.md](docs/STANDARD-GRAFICO.md) — leggibilità TV, usabilità telefono, colori, testi
- [docs/TEST-E-VERIFICHE.md](docs/TEST-E-VERIFICHE.md) — cosa verificare prima di dire "fatto"
- [docs/GLOSSARIO.md](docs/GLOSSARIO.md) — termini tecnici spiegati semplici
- [docs/DECISIONI-GENERALI.md](docs/DECISIONI-GENERALI.md) — scelte valide per tutti i giochi

## 5. Regole di lavoro

1. **Indipendenza dei giochi.** Ogni gioco ha le sue dipendenze, i suoi test, il suo
   changelog. Lavorando su un gioco non si modificano gli altri.
2. **Il design guida il codice.** Prima si aggiorna il documento di design (GDD), poi
   si scrive il codice. Se scrivendo codice emerge un buco nelle regole, ci si ferma e
   si chiede a Luis.
3. **Legenda degli stati** (in tutti i documenti di design):
   ✅ approvato · 🟡 proposto · 🔴 da definire · ⚖️ da tarare.
   Claude non promuove mai un elemento a ✅ senza conferma esplicita di Luis.
4. **Codice condiviso:** si sposta in `shared/` solo quando **almeno due giochi** ne
   hanno bisogno davvero. Prima si duplica, poi si generalizza.
5. **Nomi nel codice:** i concetti del gioco usano i termini italiani del GDD
   (es. `Giocatore`, `Reparto`, `votazione`); i termini tecnici generici restano in
   inglese quando è la convenzione (es. `server`, `client`, `test`). Commenti in italiano.
6. **Contenuti come dati:** testi, carte, numeri da tarare stanno in file JSON
   modificabili senza toccare il codice.

## 6. Definizione di "fatto"

Un lavoro è **fatto** solo se:
1. i test automatici del gioco passano (comando indicato nel `CLAUDE.md` del gioco);
2. le verifiche richieste in [docs/TEST-E-VERIFICHE.md](docs/TEST-E-VERIFICHE.md) sono superate;
3. `CHANGELOG.md` e `ROADMAP.md` del gioco sono aggiornati;
4. le eventuali decisioni prese sono in `DECISIONI.md`.

Se qualcosa non è verificato, va detto esplicitamente.

## 7. Versioni e Git

- Il progetto è sotto **Git** (= archivio delle versioni, come le revisioni numerate di una tavola).
- Messaggi di commit in italiano, con prefisso del gioco: `[il-direttivo] aggiunta votazione pesata`.
  Per modifiche generali: `[progetto] ...`.
- Claude fa commit **solo quando Luis lo chiede** o approva.
- Copia di sicurezza su GitHub **personale** di Luis (`luissaggiomo/game-designer`, privato).
  Autore dei commit: profilo privato di Luis, impostato solo in questo progetto.
- **Mai usare il comando `gh`** in questo progetto: sul PC è collegato all'account
  dell'ufficio. Il collegamento a GitHub avviene solo tramite l'indirizzo dell'archivio
  con il nome utente personale.
- Mai salvare in Git password, chiavi o file `.env`.

## 8. Sicurezza e privacy

- Si raccolgono solo i dati minimi (nome scelto dal giocatore).
- Nessun dato segreto di gioco deve arrivare al dispositivo sbagliato (vedi standard tecnici).
