# Il Direttivo *(titolo provvisorio)* — Regole specifiche

> Valgono in aggiunta al [regolamento generale](../../CLAUDE.md), che prevale in caso di conflitto.

## In breve
- **Genere:** gioco di società psicologico e politico (influenze, alleanze, spie)
- **Giocatori:** 4–8 · **Durata:** ~45–60 min + finale
- **Modello:** A (TV tabellone + telefoni controller). Fase online futura: più TV + audio integrato.
- **Fase attuale:** 3 · Prototipo locale giocabile (vedi [ROADMAP.md](ROADMAP.md))

## Documenti del gioco
- [docs/01-design-del-gioco.md](docs/01-design-del-gioco.md) — **fonte di verità delle regole**
- [docs/02-architettura-tecnica.md](docs/02-architettura-tecnica.md) — come è costruito
- [DECISIONI.md](DECISIONI.md) · [ROADMAP.md](ROADMAP.md) · [CHANGELOG.md](CHANGELOG.md) · [TEST-MANUALI.md](TEST-MANUALI.md)

## Comandi
| Azione | Comando (dalla cartella del gioco) |
|---|---|
| Installare le dipendenze | `corepack pnpm install` |
| Controllo tipi + test (da usare prima di dire "fatto") | `corepack pnpm verifica` |
| Solo i test | `corepack pnpm test` |
| Avviare il simulatore (1000 partite per 4–8 giocatori, ~4 min) | `corepack pnpm simula` |
| Simulazione veloce | `corepack pnpm simula -- --partite 100` |
| **Avviare il server sul PC** (pagina TV + telefoni in Wi-Fi, D-067) | `corepack pnpm gioca` |
| Server su un'altra porta, senza aprire il browser | `corepack pnpm gioca -- --porta 3001 --non-aprire` |

Il server scrive il registro di ogni partita in `packages/server/registri/` (non salvato in Git).
Le pagine in `packages/server/pubblico/` sono **provvisorie** (passo 1): le sostituiscono le schermate Svelte.

Il report del simulatore esce in `packages/simulator/output/report.md` (non salvato in Git);
i report da conservare si copiano in `docs/simulazioni/` con la data.

pnpm si usa tramite `corepack` (incluso in Node 22), senza installazioni di sistema.
Versione fissata in `package.json` (`packageManager`): pnpm 10, perché pnpm 12 non è
compatibile con il corepack di Node 22.17.

## Regole specifiche

1. **Il gioco non deve diventare un gestionale.** Ogni nuova meccanica numerica va
   giustificata dal conflitto che crea tra i giocatori. Nel dubbio, chiedere a Luis.
2. **"Il computer nasconde i conti, mai il perché":** ogni evento di risoluzione
   porta una causa leggibile da mostrare in TV.
3. **Riservatezza assoluta delle viste.** Ruoli, flag "falsa" dei segreti, catena dei
   segreti, effetti privati altrui, voti segreti: non devono **mai** comparire nella
   vista di un giocatore che non ne ha diritto. Test automatico dedicato obbligatorio.
4. **Tutti i numeri sono parametri** in `content/config.json`, mai scritti nel codice.
5. **Il simulatore viene prima del prototipo:** nessun numero ⚖️ si considera tarato senza un report del simulatore.
6. **Fase online (audio) separata:** il prototipo audio si sviluppa in modo indipendente dal gioco.
7. **Pari opportunità tra reparti** (D-005): nessun reparto deve essere più forte o più
   debole degli altri. Ogni regola o numero che tocca pesi, informazioni, segreti o poteri
   va valutato anche per il suo effetto sull'equilibrio tra reparti.
8. **Decisioni prese prima delle simulazioni = provvisorie.** Le scelte su regole e numeri
   si registrano con la nota "da verificare col simulatore" finché un report non le conferma.
   Se il simulatore mostra uno squilibrio, si torna da Luis con le alternative.

## Eccezioni agli standard generali
Nessuna.
