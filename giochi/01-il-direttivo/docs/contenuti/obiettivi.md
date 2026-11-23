# Il Direttivo — Obiettivi personali

> Punto aperto 3 del GDD. Decisioni D-046…D-053 (in `DECISIONI.md`).
> D-053 (ritaratura dopo il report 09): soglie ritoccate (indicate con "era …", valore della lista approvata in D-052), rimossi 2.7 Intoccabile e 3.6 Sentinella, sistemati i traguardi invertiti. D-055: seconda taratura delle soglie col simulatore. D-057 e D-061 (23/11/2026): «Intermediario» al posto di «Riformatore», «Squadra» riscritti con il conteggio "N su M per l'azienda". Gli obiettivi su messaggi, segreti e proposte personali restano da tarare nelle serate.
> Dati: `packages/content/obiettivi.json` (testi e soglie) · punti in `packages/content/config.json` (`obiettivi.punti`).
> Soglie ⚖️: si tarano col simulatore (D-051), i punti restano fissi.
> **D-076 (23/11/2026):** 16 obiettivi riscritti per il voto del pacchetto (righe 1.1–1.3, 1.8, 1.10, 1.11, 2.1, 2.8, 2.10, 2.12, 3.1, 3.2, 3.7, 3.8, 3.10, 3.12); soglie tarate col report 14 (tra parentesi il valore della lista approvata, se cambiato). Con 4 trimestri i gradini possibili sono pochi: alcune soglie restano un po' fuori dai bersagli (vedi report).

## Come funzionano (riassunto)

- A inizio partita ognuno riceve **tre obiettivi, uno per tipo**, e ne tiene uno (D-046, D-048).
- Ogni obiettivo ha **due traguardi** (D-046):

| Tipo | Forma | Facile | Difficile | Massimo |
|---|---|---|---|---|
| 1 · Graduale | stesso tema, due soglie (il secondo gradino comprende il primo) | +3 | +5 | +8 |
| 2 · Doppio | due traguardi diversi, il facile è accessibile | +3 | +7 | +10 |
| 3 · Doppio | due traguardi diversi, il facile è un po' più complesso | +4 | +6 | +10 |

- L'obiettivo scelto si vede **solo sul proprio telefono**, con l'avanzamento; al punteggio **la TV rivela l'obiettivo di ognuno** e com'è andato; gli scartati non si mostrano mai (D-047).
- **Spie:** ricevono solo obiettivi **aziendalisti** (🏢), uno per tipo; gli onesti pescano da tutto il mazzo (D-049).
- Nessun obiettivo compare due volte nella stessa partita (D-048). I licenziati conservano i punti (D-049).

## Termini (voto del pacchetto, D-068 e D-076)

- **Il tuo pacchetto**: quello che hai scelto al **primo voto** del trimestre.
- **Passa / approvato**: il pacchetto che alla fine si fa (al primo voto, come principale o come alternativa). "Il tuo pacchetto passa" = il tuo primo voto è proprio quel pacchetto.
- **Voto decisivo** (D-076): il pacchetto passa al primo voto con il **minimo dei voti necessari** e tu l'hai votato; oppure, al secondo voto, **ribaltando il tuo voto l'esito cambierebbe** (il principale passa con il minimo dei sì e tu hai detto sì, o gli manca un solo sì e tu hai detto no). In un trimestre si può essere decisivi una volta sola.
- **Pacchetto positivo / dannoso** (D-076): la somma degli effetti sull'azienda delle sue proposte è maggiore / minore di zero; si scopre ai Risultati del trimestre (il 4° al punteggio, D-029).
- **La proposta più cara** del trimestre: quella da 80 K.
- "Con almeno N pacchetti, nessuno dannoso" (2.10 e 3.10 difficili): contano **i tuoi pacchetti approvati**; ne servono almeno N e nessuno deve essere dannoso. *(Interpretazione di Claude del testo "con almeno 3 voti": contare i soli voti dati lascerebbe vincere chi vota pacchetti che non passano mai.)*

## Regole di verifica (D-052)

- **R1 · Avanzamento rinviato quando rivelerebbe un segreto.** Sul telefono l'avanzamento conta solo ciò che il giocatore può già sapere; il resto si aggiunge a fine partita. I traguardi che dipendono da informazioni nascoste mostrano **"si verifica a fine partita"**: quelli sulle copie vere o false e sulla catena dei passaggi (1.12, 2.4 difficile, 2.11, 3.3, 3.4 difficile, 3.11), quelli sui messaggi ricevuti dagli altri (2.5 difficile). Gli effetti del 4° trimestre (proposte, mossa privata complessiva) contano solo al punteggio (D-029). I messaggi e le copie ricevuti in **anonimo** contano tra i "giocatori diversi" solo a fine partita (altrimenti il contatore svelerebbe se l'anonimo è qualcuno di nuovo).
- **R2 · Contano solo le tue scelte.** Voti scaduti e scelte predefinite non contano.
- ~~R3 · Voti con peso 0~~: superata, con il voto del pacchetto votano tutti con peso 1 (D-068).
- Traguardi "mai…" / "nessun…": si considerano raggiunti solo a fine partita.

Legenda: 👁 visibile agli altri · 🔒 invisibile (lo sa solo il computer) · ✉️ messaggi · 🏢 aziendalista.

## Tipo 1 · Graduale (+3 / +5)

| # | Nome | Obiettivo | Soglie ⚖️ |
|---|---|---|---|
| 1.1 | Bastian contrario 👁 | Al primo voto scegli un pacchetto diverso da quello poi approvato | 2 / 3 trimestri |
| 1.2 | Ago della bilancia 👁 | Il tuo voto è decisivo | 2 / 3 trimestri *(D-076: 1 / 2)* |
| 1.3 | Forbici 👁 | Voti un pacchetto senza la proposta più cara, e passa | 2 / 3 trimestri |
| 1.4 | Passaparola 🔒 | Inoltri copie di segreti ad altri giocatori | 3 / 6 |
| 1.5 | Falsario 🔒 | Inoltri copie modificate di segreti | 1 / 3 |
| 1.6 | Centralino ✉️ | Ricevi messaggi da giocatori diversi | metà degli altri / tutti |
| 1.7 | Confidente 🔒 | Ricevi copie di segreti da giocatori diversi | 2 / 3 |
| 1.8 | Cassaforte 👁 | Trimestri chiusi con almeno 40 K in cassa | 2 / 3 *(D-076: 1 / 3)* |
| 1.9 | 🏢 Gioco di squadra 🔒 | Scegli "per l'azienda" nella mossa privata | 3 / 4 trimestri |
| 1.10 | 🏢 In linea 👁 | Al primo voto scegli il pacchetto poi approvato | 2 / 3 trimestri |
| 1.11 | 🏢 Occhio clinico 👁 | Il tuo pacchetto passa e si rivela positivo | 2 / 3 trimestri *(D-076: 1 / 3)* |
| 1.12 | 🏢 Postino 🔒 | Copie vere inoltrate da te arrivano in tempo al reparto a cui servono | 1 / 2 |

## Tipo 2 · Doppio (+3 accessibile / +7 impegnativo) — 11 obiettivi

| # | Nome | Facile (+3) | Difficile (+7) |
|---|---|---|---|
| 2.1 | Voce critica 👁 | Voti NO al pacchetto principale 2 volte | Il tuo NO fa passare l'alternativa 2 volte *(D-076: 1)* |
| 2.2 | Intermediario 🔒 *(D-057: sostituisce Riformatore)* | Inoltra 2 copie di segreti ad altri giocatori | Una copia inoltrata da te passa per almeno 3 giocatori |
| 2.3 | Archivista 🔒 | Ricevi copie di segreti da 2 giocatori diversi | A fine anno possiedi copie di 5 segreti diversi |
| 2.4 | Disinformatore 🔒 | Inoltri una copia modificata | Un concorrente usa un dato falso partito da una tua copia modificata |
| 2.5 | Popolare ✉️ | Ricevi un messaggio anonimo | Ricevi più messaggi di chiunque altro (pari merito vale) |
| 2.6 | Fantasma ✉️ | Ricevi messaggi da metà degli altri | Mandi un anonimo in tutti e 4 i trimestri |
| ~~2.7~~ | ~~Intoccabile~~ | *rimosso (D-053): troppo facile* | |
| 2.8 | Forbici d'oro 👁 | Al primo voto un pacchetto senza la proposta più cara in 3 trimestri | A fine anno la cassa ha almeno 60 K |
| 2.9 | 🏢 Squadra 🔒 | "Per l'azienda" in 3 trimestri *(era 2)* | In ogni trimestre almeno metà del direttivo gioca per l'azienda *(D-061, era: nessun trimestre "in calo")* |
| 2.10 | 🏢 Occhio clinico 👁 | 2 tuoi pacchetti passano e si rivelano positivi | Almeno 3 tuoi pacchetti passano, nessuno dannoso |
| 2.11 | 🏢 Postino 🔒 | Inoltri una copia vera al reparto a cui serve | 2 segreti arrivano in tempo grazie a te |
| 2.12 | 🏢 Consenso 👁 | Al primo voto il pacchetto poi approvato in 2 trimestri *(D-076: 3)* | Il tuo pacchetto passa già al primo voto in 3 trimestri *(D-076: 2)* |

## Tipo 3 · Doppio (+4 un po' complesso / +6 più impegnativo) — 11 obiettivi

| # | Nome | Facile (+4) | Difficile (+6) |
|---|---|---|---|
| 3.1 | Ago d'oro 👁 | Il tuo voto è decisivo in 2 trimestri *(D-076: 1)* | Decisivo in 3 trimestri diversi *(D-076: 2)* |
| 3.2 | Voce solitaria 👁 | Al primo voto un pacchetto diverso da quello poi approvato in 2 trimestri | In 2 trimestri sei l'unico a votare il tuo pacchetto *(D-076: 1)* |
| 3.3 | Rete 🔒 | Un segreto di cui sei fonte arriva ad almeno 2 giocatori | Una copia inoltrata da te passa per almeno 3 giocatori |
| 3.4 | Canarino 🔒 | Inoltri versioni diverse dello stesso segreto a 2 giocatori | Un concorrente usa una delle tue versioni |
| 3.5 | Crocevia ✉️ | Ricevi messaggi da tutti gli altri | Ricevi messaggi da almeno 2 giocatori in ogni trimestre |
| ~~3.6~~ | ~~Sentinella~~ | *rimosso (D-053): faceva aprire nomine anche senza spie* | |
| 3.7 | Tesoriere 👁 | A fine anno la cassa ha almeno 30 K *(D-076: 40)* | A fine anno la cassa ha almeno 60 K *(scelta di Luis 1A: era "mai un pacchetto oltre 80 K", raggiunto dal 93%)* |
| 3.8 | Controcorrente 👁 | Al secondo voto vai contro l'esito una volta: SÌ a un principale che non passa, o NO a uno che passa *(scelta di Luis 2A)* | Voti SÌ a un principale che non passa *(era il facile)* |
| 3.9 | 🏢 Squadra 🔒 | "Per l'azienda" in 3 trimestri | Più di metà del direttivo gioca per l'azienda in tutti i 4 trimestri *(D-061, era: "in crescita" in tutti i 4)* |
| 3.10 | 🏢 Occhio clinico 👁 | 2 tuoi pacchetti passano e si rivelano positivi *(D-076: 1)* | Almeno 3 tuoi pacchetti passano, nessuno dannoso |
| 3.11 | 🏢 Custode 🔒 | Un segreto arriva in tempo grazie a te | Nessun segreto di cui sei fonte finisce a un concorrente (con almeno 2 ricevuti) |
| 3.12 | 🏢 Maggioranza 👁 | Al primo voto il pacchetto poi approvato in 2 trimestri | In tutti e 4 i trimestri |
