# Il Direttivo — Obiettivi personali

> Punto aperto 3 del GDD. Decisioni D-046…D-052 (in `DECISIONI.md`).
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
| 1.1 | Bastian contrario 👁 | Voti in modo opposto all'esito | 2 / 4 |
| 1.2 | Ago della bilancia 👁 | Il tuo voto è decisivo | 2 / 4 |
| 1.3 | Forbici 👁 | Voti NO alla proposta più costosa del trimestre, e viene respinta | 1 / 3 trimestri |
| 1.4 | Passaparola 🔒 | Inoltri copie di segreti ad altri giocatori | 3 / 6 |
| 1.5 | Falsario 🔒 | Inoltri copie modificate di segreti | 1 / 3 |
| 1.6 | Centralino ✉️ | Ricevi messaggi da giocatori diversi | metà degli altri / tutti |
| 1.7 | Confidente 🔒 | Ricevi copie di segreti da giocatori diversi | 2 / 3 |
| 1.8 | Cassaforte 👁 | Trimestri chiusi con almeno 50 K in cassa | 1 / 3 |
| 1.9 | 🏢 Gioco di squadra 🔒 | Scegli "per l'azienda" nella mossa privata | 3 / 4 trimestri |
| 1.10 | 🏢 In linea 👁 | Voti come l'esito | 5 / 7 |
| 1.11 | 🏢 Occhio clinico 👁 | Voti SÌ a proposte che si rivelano positive | 2 / 4 |
| 1.12 | 🏢 Postino 🔒 | Copie vere inoltrate da te arrivano in tempo al reparto a cui servono | 1 / 2 |

## Tipo 2 · Doppio (+3 accessibile / +7 impegnativo)

| # | Nome | Facile (+3) | Difficile (+7) |
|---|---|---|---|
| 2.1 | Voce critica 👁 | Voti NO a 3 proposte che vengono approvate | Il tuo voto decide il respingimento di 2 proposte |
| 2.2 | Riformatore 👁 | Proponi una votazione di demansionamento o di promozione | Una votazione personale proposta da te viene approvata |
| 2.3 | Archivista 🔒 | Ricevi copie di segreti da 2 giocatori diversi | A fine anno possiedi copie di 5 segreti diversi |
| 2.4 | Disinformatore 🔒 | Inoltri una copia modificata | Un concorrente usa un dato falso partito da una tua copia modificata |
| 2.5 | Popolare ✉️ | Ricevi un messaggio anonimo | Ricevi più messaggi di chiunque altro (pari merito vale) |
| 2.6 | Fantasma ✉️ | Ricevi messaggi da metà degli altri | Mandi un anonimo in tutti e 4 i trimestri |
| 2.7 | Intoccabile 👁 | Non sei mai bersaglio di una proposta di demansionamento | Chiudi il finale senza nomine e senza voti "licenzia" contro di te |
| 2.8 | Forbici d'oro 👁 | Voti NO alla proposta più costosa in 2 trimestri | A fine anno la cassa ha almeno 80 K |
| 2.9 | 🏢 Squadra 🔒 | "Per l'azienda" in 2 trimestri | Nessun trimestre con mossa privata complessiva "in calo" |
| 2.10 | 🏢 Occhio clinico 👁 | Voti SÌ a 2 proposte positive | Voti NO a 2 proposte approvate che si rivelano dannose |
| 2.11 | 🏢 Postino 🔒 | Inoltri una copia vera al reparto a cui serve | 2 segreti arrivano in tempo grazie a te |
| 2.12 | 🏢 Consenso 👁 | Voti come l'esito 4 volte | Il tuo voto è decisivo per approvare 2 proposte positive |

## Tipo 3 · Doppio (+4 un po' complesso / +6 più impegnativo)

| # | Nome | Facile (+4) | Difficile (+6) |
|---|---|---|---|
| 3.1 | Ago d'oro 👁 | Il tuo voto è decisivo in 2 votazioni | Sei decisivo in 3 trimestri diversi |
| 3.2 | Voce solitaria 👁 | Voti in modo opposto all'esito 3 volte | In 2 votazioni sei l'unico ad aver votato così |
| 3.3 | Rete 🔒 | Un segreto di cui sei fonte arriva ad almeno 2 giocatori | Una copia inoltrata da te passa per almeno 3 giocatori |
| 3.4 | Canarino 🔒 | Inoltri versioni diverse dello stesso segreto a 2 giocatori | Un concorrente usa una delle tue versioni |
| 3.5 | Crocevia ✉️ | Ricevi messaggi da tutti gli altri | Ricevi messaggi da almeno 2 giocatori in ogni trimestre |
| 3.6 | Sentinella 👁 | Rispondi NO alla domanda di verifica | Il tuo NO apre la nomina e il più nominato ha anche il tuo voto |
| 3.7 | Tesoriere 👁 | La cassa non scende mai sotto 30 K dopo le votazioni | A inizio T4 la cassa è al tetto (150 K) |
| 3.8 | Controcorrente 👁 | Voti NO a 2 proposte approvate | Voti SÌ a 2 proposte respinte |
| 3.9 | 🏢 Squadra 🔒 | "Per l'azienda" in 3 trimestri | Mossa privata complessiva "in crescita" in 2 trimestri |
| 3.10 | 🏢 Occhio clinico 👁 | Voti SÌ a 3 proposte positive | Con almeno 3 SÌ dati, nessuno su una proposta dannosa |
| 3.11 | 🏢 Custode 🔒 | Un segreto arriva in tempo grazie a te | Nessun segreto di cui sei fonte finisce a un concorrente (con almeno 2 ricevuti) |
| 3.12 | 🏢 Maggioranza 👁 | Voti come l'esito in tutte le votazioni di un trimestre da 3 | Voti come l'esito 8 volte |
