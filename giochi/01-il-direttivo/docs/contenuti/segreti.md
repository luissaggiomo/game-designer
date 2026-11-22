# Il Direttivo — Contenuti dei segreti (bozza)

> Bozza della sessione "segreti" (punto aperto 2 del GDD). Decisioni numerate D-035…D-039,
> **da riportare** in `DECISIONI.md` e nel GDD dalla sessione di integrazione.
> Riferimenti: GDD §11 · D-015, D-021, D-023, D-024 · `packages/content/segreti.json`.

## Situazione di partenza

- `segreti.json` contiene 10 segnaposto con valori dei campi **fissi** (uguali in ogni partita).
- Fonte e reparto utile si scelgono **alla distribuzione** (D-024): il titolo non può dare per
  scontato chi lo riceve né a chi serve.
- Ogni segreto è collegato a **una proposta a caso** del trimestre (D-021); chi lo possiede vede
  il reparto utile ma non la proposta collegata.
- Parametri attuali (config, non toccati qui): 2 segreti a trimestre, penalità 2 per dato falso,
  2 punti alla spia per segreto usato.

## Scaletta

| # | Domanda | Stato |
|---|---|---|
| D-035 | Come scrivere titoli adatti a qualsiasi reparto | ✅ A (Luis) |
| D-036 | Valori dei campi: fissi o variabili tra le partite | ✅ B + suggerimenti (Luis) |
| D-037 | Quanti campi e di che tipo (pensando a falsi e canarino) | ✅ B + almeno un numero/data (Luis) |
| D-038 | Valore per l'azienda e per il concorrente | ✅ C + TV senza numero (Luis) |
| D-039 | Quanti segreti e in quali trimestri | ✅ C + 2, mai due "da custodire" insieme (Luis) |

---

## D-035 — Titoli adatti a qualsiasi reparto
- Data: 2026-11-22 · Stato: ✅ provvisoria (scelta di Luis) — **da verificare nelle serate**
- Contesto: fonte e reparto utile si estraggono alla distribuzione (D-024); il titolo deve
  avere senso per qualsiasi coppia di reparti.
- Alternative: A) informazioni "da corridoio aziendale", senza reparto nel titolo ·
  B) nomi dei reparti inseriti nel titolo al momento · C) segreto agganciato alla proposta collegata.
- Scelta: **A**, con la nuova etichetta per i segreti distribuiti dal gioco:
  **"dato certo, arrivato al tuo reparto"** (al posto di "dato ufficiale del tuo reparto").
- Motivo: pari opportunità per costruzione (D-005); nessun indizio sulla fonte nel titolo,
  coerente con D-015 (solo mittente diretto); non rivela quale votazione è collegata (D-021 S2).
  B scartata perché il nome della fonte viaggerebbe con ogni inoltro; C perché renderebbe
  riconoscibile il segreto arrivato in tempo.
- Effetto su spie e onesti: neutro; la spia non ricava indizi dal titolo.
- Regola di scrittura dei titoli: notizia che chiunque in azienda potrebbe aver saputo; nessun
  nome di reparto; nessun riferimento a una proposta precisa.
- **Modifica al motore (da fare nella sessione di integrazione):** testo dell'evento
  `SEGRETO_RICEVUTO` in `packages/engine/src/segreti.ts` e provenienza "GIOCO" nelle viste
  (`viste.ts`) e nel futuro telefono: "Dato certo, arrivato al tuo reparto". Aggiornare il GDD
  §11.5 (oggi: "dato ufficiale del tuo reparto") e il testo di D-015.

## D-036 — Valori dei campi variabili tra le partite
- Data: 2026-11-22 · Stato: ✅ provvisoria (scelta di Luis) — **da verificare col simulatore e nelle serate**
- Contesto: con valori fissi i giocatori abituali imparano i dati veri e riconoscono i falsi a
  colpo d'occhio: falsificazione e trappola del canarino (GDD §11.4) smetterebbero di funzionare.
- Alternative: A) valori fissi · B) 3–4 versioni complete per segreto, una estratta a ogni
  partita · C) valori generati da un intervallo numerico.
- Scelta: **B**, con **suggerimenti di falsificazione sul telefono**: quando si inoltra un segreto
  modificato, il telefono propone come valori alternativi quelli delle altre versioni (resta
  possibile scrivere un valore libero).
- Motivo: il valore vero non si impara con l'esperienza; i falsi restano credibili anche per chi
  gioca la prima volta. C scartata: copre solo i numeri e non sa proporre falsi plausibili.
- Effetto su spie e onesti: mantiene vivi il canarino (arma dell'onesto) e il rischio del falso
  (per la spia); toglie il vantaggio ai giocatori più esperti.
- **Modifica al motore (da fare nella sessione di integrazione):**
  - `ModelloSegreto` (`packages/engine/src/contenuti.ts`): `campi` diventa
    `versioni: Record<string, ValoreCampo>[]` (almeno 3; tutte con gli stessi nomi di campo);
  - `distribuisciSegreti` (`segreti.ts`): estrae una versione con il generatore casuale della
    partita e la usa come `campi` dell'istanza (il resto invariato: la copia è falsa se i campi
    differiscono da quelli estratti);
  - controllo dei contenuti (`contenuti.ts`): almeno 3 versioni, stessi campi in tutte, versioni
    tra loro diverse;
  - vista del possessore (`viste.ts`): per ogni campo, l'elenco dei **valori suggeriti** = valori
    di quel campo nelle versioni del modello, mescolati. Attenzione alla riservatezza: l'elenco
    **non deve** indicare quale valore è quello vero né essere ordinato in modo da rivelarlo
    (es. sempre mescolato, includendo anche il valore della propria copia);
  - test: estrazione riproducibile col seme; vista senza indizi sulla versione vera.

## D-037 — Numero e tipo dei campi
- Data: 2026-11-22 · Stato: ✅ provvisoria (scelta di Luis) — **da verificare nelle serate**
- Contesto: il canarino richiede una versione diversa per ogni sospettato; sul telefono il
  segreto deve leggersi al volo.
- Alternative: A) sempre un campo · B) uno o due campi secondo il segreto (massimo due) ·
  C) sempre due campi.
- Scelta: **B**, con la regola: **almeno un campo è un numero o una data**.
- Regole di scrittura: circa metà dei segreti con un campo e metà con due; massimo ~25 caratteri
  per valore; nei segreti a due campi ogni versione è una coppia sensata.
- Motivo: varietà; con due campi le combinazioni (fino a 16 con 4 versioni) bastano per il
  canarino anche a 8 giocatori; falsi sottili (cambiare un solo campo). Il numero/data rende
  naturale il confronto a voce ("a te che cifra è arrivata?").
- Effetto su spie e onesti: più strumenti per entrambi (canarino più ampio per l'onesto, falsi
  mirati per la spia che vuole incastrare qualcuno). Equilibrato.
- Modifica al motore: nessuna oltre a D-036 (il motore gestisce già più campi; una copia è
  falsa se anche un solo campo differisce). I suggerimenti di D-036 vanno offerti **campo per
  campo**, così si possono combinare valori di versioni diverse.
- **Aggiunta del 22/11/2026 (scelta di Luis): estrazione del dato vero campo per campo.**
  - Problema: se il vero fosse sempre una delle 4 righe scritte, i giocatori esperti imparerebbero
    le coppie e riconoscerebbero come falsa ogni combinazione mescolata.
  - Alternative: A) estrazione campo per campo (16 combinazioni vere con 2 campi × 4 valori) ·
    B) riga intera · C) a scelta per ogni segreto.
  - Scelta: **A**. Ogni campo si estrae separatamente dai valori delle versioni; le "versioni" nel
    JSON diventano di fatto un elenco di valori possibili per campo.
  - Regola di scrittura: nei segreti a due campi **ogni combinazione deve avere senso**
    (verificato sui 18 segreti attuali: tutte reggono).
  - Effetto su spie e onesti: neutro. Un falso mescolato è indistinguibile da un vero, il che
    protegge sia il canarino dell'onesto sia i falsi della spia.
  - Modifica al motore: in `distribuisciSegreti` estrarre ogni campo con il generatore della
    partita (al posto della riga intera di D-036); i suggerimenti restano i valori di ogni campo.

## D-038 — Valore per l'azienda e per il concorrente ("bilancia")
- Data: 2026-11-22 · Stato: ✅ provvisoria (scelta di Luis) — **numeri ⚖️ da verificare col simulatore**
- Contesto: la taratura dei concorrenti (D-024) è stata fatta con segnaposto che valgono in media
  **1,3** per l'azienda e **1,9** per il concorrente (report 06: 54% dei segreti arriva in tempo,
  17% va ai concorrenti). Fonte e utile estratti a caso: valori diversi non sbilanciano i reparti.
- Alternative: A) tutti uguali (+1 / +2) · B) due fasce "normale" / "scottante" ·
  C) tre tipi a "bilancia" indicati a parole sulla scheda.
- Scelta: **C**.

  | Tipo (scritto sulla scheda) | Azienda se arriva | Concorrente se esce | Quota della lista |
  |---|---|---|---|
  | **Da far girare** | +2 | +1 | ~30% |
  | **Normale** | +1 | +2 | ~50% |
  | **Da custodire** | +1 | +3 | ~20% |

  Medie risultanti ≈ 1,3 / 1,9 (uguali ai segnaposto: la taratura D-024 resta valida in media).
- **In aggiunta:** quando un segreto arriva in tempo, la TV dice solo
  *"Un'informazione è arrivata in tempo al reparto giusto"*, **senza il numero** (altrimenti il
  "+2" rivelerebbe un segreto "da far girare"). La quota di mercato in TV si aggiorna comunque.
- Motivo: un dilemma leggibile a parole e non a numeri, coerente con "collaborare conviene, ma ci
  si può fidare?" e con gli "onesti ambigui"; medie della taratura invariate.
- Effetto su spie e onesti: la spia desidera i "da custodire" e ha motivo di chiederli; gli onesti
  hanno motivo di farli girare poco, ma il reparto utile li chiede legittimamente (sospetto
  ambiguo). I "da far girare" rendono conveniente fidarsi.
- **Modifiche al motore (da fare nella sessione di integrazione):**
  - vista del possessore (`viste.ts`): etichetta del tipo, ricavata dai valori del modello
    (o campo esplicito `tipo` nel JSON — vedi riepilogo). I numeri non vanno mostrati;
  - `risolviSegreti` (`segreti.ts`): causa dell'evento `SEGRETO_IN_TEMPO` senza "+N";
  - controllo contenuti: coerenza tra tipo e valori;
  - simulatore: i robot potrebbero usare il tipo (es. spia che preferisce i "da custodire",
    onesto che fa girare di più i "da far girare") — da valutare.
- Modifica alle regole: D-021 S2 e GDD §11.5 ("+N" non più mostrato).
- **Aggiunta del 22/11/2026 (scelta di Luis): punti della spia legati al tipo.**
  - Prima: 2 punti fissi alla spia per ogni segreto usato (`segreti.puntiSpiaPerSegretoUsato`).
  - Scelta: **da far girare 1 · normale 2 · da custodire 3** (uguali al guadagno del concorrente).
    Media sulla lista ≈ 1,9, quasi uguale ai 2 attuali: l'equilibrio onesti/spie di D-024 non
    dovrebbe cambiare. ⚖️ **Da verificare col simulatore.**
  - Effetto su spie e onesti: la spia ha un motivo in più per cercare i "da custodire" e quindi
    per chiederli. Gli onesti hanno un segnale (ambiguo, perché anche il reparto utile li chiede).
  - Modifica al motore e alla config: in `config.json` sostituire `puntiSpiaPerSegretoUsato`
    con i punti per tipo (es. `puntiSpiaPerTipo: { DA_FAR_GIRARE: 1, NORMALE: 2, DA_CUSTODIRE: 3 }`);
    in `punteggio.ts` (riga che legge `puntiSpiaPerSegretoUsato`) usare il tipo del segreto
    passato. Chiude il punto 🔴 "quanti punti vale per la spia un segreto usato" (GDD §11.5).

## D-039 — Quanti segreti e in quali trimestri
- Data: 2026-11-22 · Stato: ✅ provvisoria (scelta di Luis) — **da verificare nelle serate**
- Contesto: in una partita escono 8 segreti (4 trimestri × 2, parametro `segreti.perTrimestre`).
- Alternative (quantità): A) 12 · B) 24 · C) 36. (Trimestri): 1) tutti liberi · 2) quasi tutti
  liberi, alcuni legati al periodo · 3) ognuno legato a un trimestre preciso.
- Scelta: **C + 2**: **36 segreti**; 28 escono in qualsiasi trimestre, 4 solo a inizio anno
  (T1–T2), 4 solo a fine anno (T3–T4). In ogni trimestre si pesca tra 32 segreti.
- **In aggiunta:** il motore **non estrae due segreti "da custodire" nello stesso trimestre**.
- Ripartizione per tipo (D-038): 11 da far girare · 18 normali · 7 da custodire
  (medie 1,31 per l'azienda / 1,89 per il concorrente). Campi (D-037): 18 con un campo, 18 con due.
  I "da custodire": 5 liberi, 1 di inizio anno, 1 di fine anno (6 pescabili in ogni trimestre).
- Motivo: in una partita esce poco più di un quinto della lista; con le versioni variabili
  (D-036) la ripetizione non si nota per molte serate. I segreti legati al periodo danno il senso
  dell'anno che passa. Evitare due "da custodire" insieme limita le partite "fortunate" per le spie.
- Effetto su spie e onesti: neutro su D-005 (fonte e utile casuali). Il limite sui "da custodire"
  riduce la varianza a favore della spia.
- **Modifica al motore (da fare nella sessione di integrazione):** in `distribuisciSegreti`
  (`segreti.ts`), dopo aver estratto un "da custodire", togliere gli altri "da custodire" dai
  candidati del trimestre (se i candidati non bastano, vale la regola dei ripetuti già presente).
  Test: in nessun trimestre due "da custodire".

---

## La lista (36 segreti)

Prima versione indicata come esempio; le altre in `packages/content/segreti.json`.
Tipo: 🟢 da far girare (+2 / +1) · ⚪ normale (+1 / +2) · 🔴 da custodire (+1 / +3).
Nomi di clienti, fornitori e aziende: inventati.

| # | Titolo | Tipo | Campi (esempio) | Trimestri |
|---|---|---|---|---|
| 1 | Fido che la banca è pronta a concedere | 🟢 | importo: 300 K€ | tutti |
| 2 | Ispezione della sicurezza a sorpresa | 🟢 | quando: tra 10 giorni · controllo: estintori | tutti |
| 3 | Bando regionale a fondo perduto in scadenza | 🟢 | contributo: 40% della spesa · scadenza: tra 15 giorni | tutti |
| 4 | Sconto del fornitore se paghiamo subito | 🟢 | sconto: 5% | tutti |
| 5 | Il capoturno più esperto sta per dimettersi | 🟢 | preavviso: 1 mese · motivo: stipendio | tutti |
| 6 | Tasso del finanziamento per i nuovi macchinari | 🟢 | tasso: 3,2% | tutti |
| 7 | Scorte reali in magazzino (non quelle a sistema) | 🟢 | bastano per: 5 settimane | tutti |
| 8 | Budget delle assunzioni approvato per l'anno | 🟢 | nuovi posti: 4 persone | T1–T2 |
| 9 | Causa di un ex dipendente: cifra per chiuderla | 🟢 | accordo: 25.000 € | tutti |
| 10 | Premio di fine anno ai dipendenti già deciso | 🟢 | premio: 800 € a testa · condizione: se si chiude in utile | T3–T4 |
| 11 | Risparmio in bolletta col nuovo contratto energia | 🟢 | risparmio: 12% · da quando: tra 2 mesi | tutti |
| 12 | Gara dell'ospedale: offerta del concorrente | ⚪ | offerta: 118.000 € | tutti |
| 13 | Prezzo dell'acciaio nel prossimo trimestre | ⚪ | variazione: +12% | tutti |
| 14 | Grande cliente pronto a cambiare fornitore | ⚪ | cliente: Rossi Arredi · ordini all'anno: 90.000 € | tutti |
| 15 | Fornitore principale vicino al fallimento | ⚪ | fornitore: Metalli Sud · resiste ancora: 3 mesi | tutti |
| 16 | Andamento del mercato nel prossimo trimestre | ⚪ | settore: arredo ufficio · variazione: −8% | tutti |
| 17 | Costo reale di un pezzo della linea principale | ⚪ | costo: 14,20 € | tutti |
| 18 | Stand alla fiera di settore: posto e prezzo | ⚪ | posizione: padiglione 3 · costo: 22.000 € | T1–T2 |
| 19 | Il concorrente sta per depositare un brevetto | ⚪ | entro: 60 giorni · su cosa: cerniere | tutti |
| 20 | Il nostro agente migliore lavora anche per il concorrente | ⚪ | per il concorrente: 20% del tempo | tutti |
| 21 | Nuovo listino del concorrente in arrivo | ⚪ | aumento: +4% · da quando: tra 1 mese | tutti |
| 22 | Gara del Comune: punteggio minimo per vincere | ⚪ | punteggio: 72 su 100 | tutti |
| 23 | Sciopero dei trasporti che bloccherà le consegne | ⚪ | quando: tra 3 settimane · durata: 2 giorni | tutti |
| 24 | Distributore estero pronto a un primo ordine | ⚪ | paese: Germania · primo ordine: 60.000 € | tutti |
| 25 | Prova comparativa della rivista di settore | ⚪ | il nostro voto: 7,5 | T3–T4 |
| 26 | Budget pubblicitario del concorrente per l'anno | ⚪ | budget: 150 K€ | T1–T2 |
| 27 | Macchinario usato ceduto da un'azienda che chiude | ⚪ | prezzo: 38.000 € | tutti |
| 28 | Il nuovo impianto arriverà in ritardo | ⚪ | ritardo: 3 settimane | tutti |
| 29 | Bilancio di fine anno del concorrente (in anteprima) | ⚪ | risultato: −120 K€ | T3–T4 |
| 30 | Lancio della nostra campagna pubblicitaria | 🔴 | lancio: tra 5 settimane · canale: televisione | tutti |
| 31 | Il nostro prezzo minimo per la gara della scuola | 🔴 | prezzo minimo: 96.000 € | tutti |
| 32 | Sconto massimo concedibile ai clienti | 🔴 | sconto: 18% | tutti |
| 33 | Il materiale segreto del nuovo prodotto | 🔴 | materiale: bambù pressato · costo al kg: 4,20 € | tutti |
| 34 | Trattativa riservata per comprare un'azienda rivale | 🔴 | azienda: Mobilificio Arno · prezzo offerto: 1,2 milioni € | T1–T2 |
| 35 | Condizioni segrete del nostro cliente più grande | 🔴 | sconto: 25% · pagamento: a 90 giorni | tutti |
| 36 | Piano per chiudere il secondo stabilimento | 🔴 | entro: 9 mesi · esuberi: 12 persone | T3–T4 |

---

## Riepilogo per la sessione di integrazione

**File toccati da questa sessione**
- `packages/content/segreti.json` — riscritto: 36 segreti con `tipo`, `versioni` (4 ciascuno) e,
  per compatibilità, `campi` = prima versione. Il motore attuale ignora `tipo` e `versioni` e usa
  sempre `campi`: **funziona, ma finché il motore non viene aggiornato i valori restano fissi**.
- `docs/contenuti/segreti.md` — questo file (nuovo).
- Nient'altro. `corepack pnpm verifica` del 22/11/2026: controllo tipi e **135/135 test superati**.
  Simulazione completa non lanciata (come da istruzioni).

**Decisioni da riportare in `DECISIONI.md`** (tutte ✅ provvisorie, scelte di Luis il 22/11/2026)
- D-035 titoli "da corridoio aziendale" + etichetta "dato certo, arrivato al tuo reparto";
- D-036 versioni variabili + suggerimenti di falsificazione sul telefono;
- D-037 uno o due campi, almeno un numero o una data; **dato vero estratto campo per campo**;
- D-038 tre tipi a bilancia (+2/+1, +1/+2, +1/+3) + TV senza "+N" sul segreto arrivato in tempo;
  **punti alla spia per tipo 1 / 2 / 3**;
- D-039 36 segreti (28 liberi, 4 in T1–T2, 4 in T3–T4), mai due "da custodire" nello stesso trimestre.

**Da riportare nel GDD**
- §11.5: nuova etichetta (sostituisce "dato ufficiale del tuo reparto"; aggiornare anche il testo
  di D-015); la TV non mostra il "+N" (modifica di D-021 S2); versioni variabili; tipi a bilancia
  scritti sulla scheda; riga "🔴 Lista dei segreti e loro valore" → ✅ provvisorio (D-035…D-039),
  con i valori ⚖️.
- §11.4: suggerimenti di falsificazione (valori delle altre versioni, campo per campo).
- §20, punto aperto 2 → ✅ provvisorio (D-035…D-039).
- §11.5 / §16: "🔴 Quanti punti vale per la spia un segreto usato" → ✅ provvisorio: 1 / 2 / 3
  secondo il tipo (aggiunta a D-038), ⚖️ da verificare col simulatore.
- §11.4 / §11.5: il dato vero si estrae campo per campo (aggiunta a D-037).

**Modifiche al motore richieste** (dettagli nelle singole voci)
1. `contenuti.ts`: `ModelloSegreto` con `tipo` e `versioni` (poi togliere `campi` dal JSON);
   `controllaSegreti`: almeno 3 versioni, stessi campi in tutte, versioni diverse, almeno un
   valore con una cifra, `tipo` coerente con i valori. In alternativa, consigliata: valori per
   tipo in `config.json` (si tarano in un punto solo, regola 4 del CLAUDE.md del gioco) e
   `valoreAzienda`/`valoreConcorrente` tolti dal JSON dei segreti.
2. `segreti.ts` → `distribuisciSegreti`: estrae **ogni campo separatamente** col generatore della
   partita; esclude un secondo "da custodire" nello stesso trimestre; testo di `SEGRETO_RICEVUTO`
   con la nuova etichetta.
3. `segreti.ts` → `risolviSegreti`: causa di `SEGRETO_IN_TEMPO` senza "+N".
3b. `config.json` + `config.ts` + `punteggio.ts`: punti della spia per tipo (1 / 2 / 3) al posto
   di `puntiSpiaPerSegretoUsato`.
4. `viste.ts`: provenienza "GIOCO" con la nuova etichetta; tipo del segreto a parole; valori
   suggeriti per campo, **sempre mescolati e comprensivi del valore della propria copia**, senza
   indizi sulla versione vera (test di riservatezza dedicato).
5. Simulatore: robot che tengano conto del tipo (da valutare) e nuovo report per confermare che le
   medie 1,31 / 1,89 lasciano valida la taratura D-024.
