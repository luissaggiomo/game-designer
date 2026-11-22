# Standard grafico e di usabilità

Regole comuni a tutti i giochi per TV e telefoni. Un gioco può avere il proprio stile
(colori, caratteri, tono), ma deve rispettare questi minimi. Le eccezioni vanno motivate
nel `DECISIONI.md` del gioco.

Principio guida: **si gioca la sera, in compagnia, con persone di ogni età e dimestichezza.**
Chi ha poca pratica col telefono deve poter giocare senza aiuto.

---

## 1. Schermo TV (tabellone)

Si guarda **da 2–4 metri**, spesso con la luce della stanza accesa.

| Elemento | Regola |
|---|---|
| Testo principale | Altezza minima ~4% dello schermo (≈ 44 px su 1080p). Mai sotto ~2,5% (≈ 28 px) |
| Titoli e numeri chiave | Grandi e in grassetto: devono leggersi da 4 metri |
| Quantità di testo | Massimo ~3 righe per volta. La TV mostra, non spiega a lungo |
| Contrasto | Alto: testo chiaro su fondo scuro (o viceversa), rapporto almeno 7:1 |
| Margini | Lasciare libero ~5% per lato (alcune TV tagliano i bordi) |
| Interazione | Nessuna obbligatoria, salvo un tocco/clic iniziale per attivare l'audio |
| Formato | Orizzontale 16:9; deve funzionare anche su un portatile |

## 2. Schermo telefono (controller)

Si usa **in verticale, con una mano**, spesso senza guardarlo a lungo.

| Elemento | Regola |
|---|---|
| Pulsanti | Area toccabile minima 48 × 48 px; azioni principali ancora più grandi, a tutta larghezza |
| Testo | Minimo 16 px; informazioni importanti 20 px o più |
| Una cosa alla volta | Ogni schermata ha **una sola azione principale** evidente |
| Posizione | Pulsanti principali nella metà bassa, raggiungibili col pollice |
| Conferma | Le scelte irreversibili (voto, accusa, invio segreto) chiedono conferma con un secondo tocco |
| Stato chiaro | Sempre visibile: chi sono, in che fase siamo, se devo fare qualcosa, quanto tempo resta |
| Attesa | Quando non tocca a me, il telefono lo dice chiaramente ("Attendi: votano gli altri") |
| Riservatezza | Le informazioni segrete si possono nascondere con un tocco (contro chi sbircia) |
| Orientamento | Solo verticale; in orizzontale si mostra un invito a ruotare |

## 3. Colori

- **Mai affidare un'informazione al solo colore.** Affiancare sempre un'icona, una
  parola o una forma (es. ✔ SÌ verde / ✖ NO rosso). Circa 1 uomo su 12 distingue
  male rosso e verde.
- Palette limitata: 1 colore principale, 1 di accento, colori di stato
  (positivo, negativo, neutro, attenzione).
- Colori dei giocatori: ben distinguibili tra loro, sempre accompagnati dal nome.
- Tema scuro preferito in TV (affatica meno la sera).

## 4. Testi e tono

- Frasi brevi, parole comuni. Niente gergo tecnico nell'interfaccia.
- Lo stesso concetto ha **sempre lo stesso nome** (quello del glossario del GDD).
- Gli errori si spiegano con cosa fare: non "Errore 403" ma "Non puoi votare: sei demansionato".
- Tutti i testi stanno nei file di contenuto (JSON), non nel codice: così si correggono senza programmare.

## 5. Movimento e suoni

- Le animazioni servono a **far capire** cosa succede (una rivelazione, un sorpasso), non a decorare.
- Durata tipica 0,3–1 secondo; le rivelazioni importanti possono durare di più, una alla volta.
- Suoni brevi e facoltativi, con volume regolabile. Il gioco deve essere comprensibile anche senza audio.
- Vibrazione del telefono per segnalare "tocca a te" (dove supportata).

## 6. Accessibilità di base

- Nessun lampeggio rapido (più di 3 volte al secondo).
- Rispettare l'impostazione "riduci movimento" del telefono.
- Timer sempre visibili come numero, non solo come barra.

## 7. Verifica

Prima di ogni serata di prova, oltre alla checklist del gioco:
- [ ] TV letta da 3 metri da una persona che non conosce il gioco
- [ ] Telefono usato da una persona poco pratica senza spiegazioni aggiuntive
- [ ] Schermate provate su un telefono piccolo (circa 5,5") e uno grande
- [ ] Nessuna informazione trasmessa solo con il colore
