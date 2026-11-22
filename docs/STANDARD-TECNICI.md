# Standard tecnici di riferimento

Sono le scelte **predefinite** per tutti i giochi. Un gioco può discostarsene solo con
una motivazione scritta nel proprio `DECISIONI.md`.

Legenda: ✅ deciso · 🟡 raccomandato, da confermare · 🔴 da decidere

## 1. Modello di gioco

| Modello | Descrizione | Uso |
|---|---|---|
| **A** | TV/PC = tabellone, telefoni = controller | ✅ predefinito |
| **B** | Solo telefoni, stessa stanza | quando il gioco non ha bisogno di uno schermo comune |
| **C** | Solo telefoni, a distanza | richiede audio o chat integrati |

## 2. Principi architetturali (validi per tutti)

1. **Server autorevole** (= il server è l'unico arbitro: i telefoni mandano solo
   intenzioni tipo "voto sì", mai risultati). Impedisce imbrogli ed errori.
2. **Viste filtrate:** ogni dispositivo riceve **solo** ciò che deve vedere. Un dato
   segreto non deve mai arrivare al telefono sbagliato, nemmeno nascosto.
3. **Motore puro** (= le regole del gioco stanno in un blocco di codice isolato, senza
   rete né grafica, come un regolamento scritto che chiunque può applicare).
   Lo usano allo stesso modo server, test e simulatore.
4. **Casualità con seme** (= il "mescolamento" del mazzo parte da un numero: stesso
   numero, stessa partita). Rende le partite riproducibili per trovare gli errori.
5. **Contenuti come dati** in file JSON, validati all'avvio.
6. **Tutto via browser**, HTTPS obbligatorio (necessario per microfono e schermo sempre acceso).

## 3. Stack predefinito

| Livello | Scelta | Stato |
|---|---|---|
| Linguaggio | TypeScript (= JavaScript con controllo dei tipi: segnala molti errori prima di eseguire) | 🟡 |
| Runtime server | Node.js 22 (già installato) | ✅ |
| Tempo reale | Socket.IO (= canale sempre aperto tra server e telefoni, si ricollega da solo) | 🟡 |
| Interfaccia | Svelte o React, con Vite | 🔴 |
| Test | Vitest | 🟡 |
| Gestione pacchetti | pnpm (da attivare con `corepack enable`) | 🟡 |
| Persistenza | in memoria + SQLite per i salvataggi | 🟡 |

## 4. Struttura tipica di un gioco

```
giochi/NN-nome/
├── CLAUDE.md, ROADMAP.md, CHANGELOG.md, DECISIONI.md, TEST-MANUALI.md
├── docs/                 ← design, architettura, playtest
├── packages/
│   ├── engine/           ← regole pure + test
│   ├── content/          ← JSON dei contenuti
│   ├── shared/           ← tipi comuni a server e client
│   ├── server/
│   ├── client-tv/
│   ├── client-phone/
│   └── simulator/        ← solo se ci sono numeri da tarare
└── package.json
```

Ogni gioco è **autonomo**: ha il proprio `package.json` e si avvia/testa dalla propria cartella.

## 5. Hosting

🔴 Da scegliere quando il primo gioco arriva alla fase 3 (prototipo giocabile).
Nelle fasi 1–2 non serve alcun hosting.

- **Sviluppo:** sul PC di Luis, con un tunnel HTTPS (= un "ponte" sicuro temporaneo che
  rende il PC raggiungibile dai telefoni) per provare dai cellulari.
- **Prove e serate:** servizio cloud con HTTPS automatico (es. Fly.io, Render, Railway
  o un piccolo server virtuale). Valutare costi aggiornati al momento della scelta.

## 6. Dispositivi minimi

- iPhone: Safari, iOS 16.4+ · Android: Chrome recente
- TV: consigliato portatile via HDMI; chiavette TV accettabili; browser smart TV solo come ripiego.
