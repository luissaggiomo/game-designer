# Il Direttivo — Obiettivi personali

> Punto aperto 3 del GDD. Decisioni D-046…D-053 (in `DECISIONI.md`).
> D-053 (ritaratura dopo il report 09): soglie ritoccate (indicate con "era …", valore della lista approvata in D-052), rimossi 2.7 Intoccabile e 3.6 Sentinella, sistemati i traguardi invertiti. D-055: seconda taratura delle soglie col simulatore. Gli obiettivi su messaggi, segreti e proposte personali restano da tarare nelle serate.
> Dati: `packages/content/obiettivi.json` (testi e soglie) · punti in `packages/content/config.json` (`obiettivi.punti`).
> Soglie ⚖️: si tarano col simulatore (D-051), i punti restano fissi.

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
- Nessun obiettivo compare due volte nella stessa partita (D-048). Demansionati e licenziati conservano i punti (D-049).

## Termini

- **Esito**: approvata o respinta (anche per mancanza di fondi).
- **Voto decisivo**: se avessi votato al contrario, l'esito sarebbe stato opposto. *(Nota tecnica: "senza il tuo voto" non funziona, perché chi non vota vale "no" e un "no" non sarebbe mai decisivo.)*
- **Positiva / dannosa**: proposta approvata con effetto reale sull'azienda maggiore / minore di zero, come si vede ai Risultati.
- **La proposta più costosa** del trimestre: in caso di parità, una qualsiasi delle più costose.

## Regole di verifica (D-052)

- **R1 · Avanzamento rinviato quando rivelerebbe un segreto.** Sul telefono l'avanzamento conta solo ciò che il giocatore può già sapere; il resto si aggiunge a fine partita. I traguardi che dipendono da informazioni nascoste mostrano **"si verifica a fine partita"**: quelli sulle copie vere o false e sulla catena dei passaggi (1.12, 2.4 difficile, 2.11, 3.3, 3.4 difficile, 3.11), quelli sui messaggi ricevuti dagli altri (2.5 difficile). Gli effetti del 4° trimestre (proposte, mossa privata complessiva) contano solo al punteggio (D-029). I messaggi e le copie ricevuti in **anonimo** contano tra i "giocatori diversi" solo a fine partita (altrimenti il contatore svelerebbe se l'anonimo è qualcuno di nuovo).
- **R2 · Contano solo le tue scelte.** Voti scaduti, mosse private fatte dal computer (demansionati) e astensioni non contano.
- **R3 · Voti con peso 0 non contano** (il reparto non vota in quella proposta).
- Traguardi "mai…" / "nessun…": si considerano raggiunti solo a fine partita.

Legenda: 👁 visibile agli altri · 🔒 invisibile (lo sa solo il computer) · ✉️ messaggi · 🏢 aziendalista.

## Tipo 1 · Graduale (+3 / +5)

| # | Nome | Obiettivo | Soglie ⚖️ |
|---|---|---|---|
| 1.1 | Bastian contrario 👁 | Voti in modo opposto all'esito | 3 / 5 *(era 2 / 4)* |
| 1.2 | Ago della bilancia 👁 | Il tuo voto è decisivo | 3 / 4 *(era 2 / 4)* |
| 1.3 | Forbici 👁 | Voti NO alla proposta più costosa del trimestre, e viene respinta | 3 / 4 trimestri *(era 1 / 3)* |
| 1.4 | Passaparola 🔒 | Inoltri copie di segreti ad altri giocatori | 3 / 6 |
| 1.5 | Falsario 🔒 | Inoltri copie modificate di segreti | 1 / 3 |
| 1.6 | Centralino ✉️ | Ricevi messaggi da giocatori diversi | metà degli altri / tutti |
| 1.7 | Confidente 🔒 | Ricevi copie di segreti da giocatori diversi | 2 / 3 |
| 1.8 | Cassaforte 👁 | Trimestri chiusi con almeno 120 K in cassa *(era 50 K)* | 1 / 3 |
| 1.9 | 🏢 Gioco di squadra 🔒 | Scegli "per l'azienda" nella mossa privata | 3 / 4 trimestri |
| 1.10 | 🏢 In linea 👁 | Voti come l'esito | 5 / 8 *(era 5 / 7)* |
| 1.11 | 🏢 Occhio clinico 👁 | Voti SÌ a proposte che si rivelano positive | 1 / 3 *(era 2 / 4)* |
| 1.12 | 🏢 Postino 🔒 | Copie vere inoltrate da te arrivano in tempo al reparto a cui servono | 1 / 2 |

## Tipo 2 · Doppio (+3 accessibile / +7 impegnativo) — 11 obiettivi

| # | Nome | Facile (+3) | Difficile (+7) |
|---|---|---|---|
| 2.1 | Voce critica 👁 | Il tuo voto decide il respingimento di 2 proposte | Voti NO a 2 proposte che vengono approvate *(scambiati; era 3)* |
| 2.2 | Riformatore 👁 | Proponi una votazione di demansionamento o di promozione | Una votazione personale proposta da te viene approvata |
| 2.3 | Archivista 🔒 | Ricevi copie di segreti da 2 giocatori diversi | A fine anno possiedi copie di 5 segreti diversi |
| 2.4 | Disinformatore 🔒 | Inoltri una copia modificata | Un concorrente usa un dato falso partito da una tua copia modificata |
| 2.5 | Popolare ✉️ | Ricevi un messaggio anonimo | Ricevi più messaggi di chiunque altro (pari merito vale) |
| 2.6 | Fantasma ✉️ | Ricevi messaggi da metà degli altri | Mandi un anonimo in tutti e 4 i trimestri |
| ~~2.7~~ | ~~Intoccabile~~ | *rimosso (D-053): troppo facile* | |
| 2.8 | Forbici d'oro 👁 | Voti NO alla proposta più costosa in tutti i 4 trimestri *(era 2)* | A fine anno la cassa ha almeno 150 K *(era 80 K)* |
| 2.9 | 🏢 Squadra 🔒 | "Per l'azienda" in 3 trimestri *(era 2)* | Nessun trimestre con mossa privata complessiva "in calo" |
| 2.10 | 🏢 Occhio clinico 👁 | Voti SÌ a 2 proposte positive | Voti NO ad almeno 1 proposta approvata che si rivela dannosa *(era 2)* |
| 2.11 | 🏢 Postino 🔒 | Inoltri una copia vera al reparto a cui serve | 2 segreti arrivano in tempo grazie a te |
| 2.12 | 🏢 Consenso 👁 | Voti come l'esito 6 volte *(era 4)* | Il tuo voto è decisivo per approvare 2 proposte positive |

## Tipo 3 · Doppio (+4 un po' complesso / +6 più impegnativo) — 11 obiettivi

| # | Nome | Facile (+4) | Difficile (+6) |
|---|---|---|---|
| 3.1 | Ago d'oro 👁 | Il tuo voto è decisivo in 3 votazioni *(era 2)* | Sei decisivo in 4 trimestri diversi *(era 3)* |
| 3.2 | Voce solitaria 👁 | Voti in modo opposto all'esito 3 volte | In almeno 1 votazione sei l'unico ad aver votato così *(era 2)* |
| 3.3 | Rete 🔒 | Un segreto di cui sei fonte arriva ad almeno 2 giocatori | Una copia inoltrata da te passa per almeno 3 giocatori |
| 3.4 | Canarino 🔒 | Inoltri versioni diverse dello stesso segreto a 2 giocatori | Un concorrente usa una delle tue versioni |
| 3.5 | Crocevia ✉️ | Ricevi messaggi da tutti gli altri | Ricevi messaggi da almeno 2 giocatori in ogni trimestre |
| ~~3.6~~ | ~~Sentinella~~ | *rimosso (D-053): faceva aprire nomine anche senza spie* | |
| 3.7 | Tesoriere 👁 | La cassa non scende mai sotto 40 K dopo le votazioni *(era 30 K)* | A fine anno la cassa ha almeno 150 K *(era: al tetto a inizio T4)* |
| 3.8 | Controcorrente 👁 | Voti SÌ a 2 proposte respinte | Voti NO a 2 proposte approvate *(scambiati)* |
| 3.9 | 🏢 Squadra 🔒 | "Per l'azienda" in 3 trimestri | Mossa privata complessiva "in crescita" in tutti i 4 trimestri *(era 2)* |
| 3.10 | 🏢 Occhio clinico 👁 | Voti SÌ ad almeno 1 proposta positiva *(era 3)* | Con almeno 2 SÌ dati, nessuno su una proposta dannosa *(era 3)* |
| 3.11 | 🏢 Custode 🔒 | Un segreto arriva in tempo grazie a te | Nessun segreto di cui sei fonte finisce a un concorrente (con almeno 2 ricevuti) |
| 3.12 | 🏢 Maggioranza 👁 | Voti come l'esito in tutte le votazioni di un trimestre *(era: da 3)* | Voti come l'esito 8 volte |
