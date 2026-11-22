# Procedure — Ciclo di vita di un gioco

Ogni gioco attraversa queste fasi. Tra una fase e l'altra c'è un **cancello**
(= un collaudo, come la verifica di fine lavori prima di passare alla fase successiva):
si avanza solo quando tutte le condizioni sono soddisfatte e Luis approva.

La fase corrente di ogni gioco è indicata nel `README.md` principale e nella `ROADMAP.md` del gioco.

---

## Fase 1 · Design

**Scopo:** definire il gioco su carta.

Documenti: `docs/01-design-del-gioco.md` (GDD) e, quando serve, `docs/02-architettura-tecnica.md`.

**Cancello per passare alla fase 2:**
- [ ] visione, numero giocatori, durata e flusso di una partita sono ✅
- [ ] i 🔴 rimasti non bloccano la costruzione del nucleo del gioco
- [ ] architettura tecnica scritta e stack scelto (registrato in `DECISIONI.md`)

## Fase 2 · Motore e simulazione

**Scopo:** costruire le regole come codice puro, senza grafica né rete, e verificarne
l'equilibrio con partite simulate (se il gioco ha numeri da tarare).

**Cancello:**
- [ ] tutte le regole ✅ del GDD sono implementate e coperte da test
- [ ] simulatore (se previsto) produce un report leggibile
- [ ] i valori ⚖️ hanno una prima taratura documentata

## Fase 3 · Prototipo giocabile

**Scopo:** server, schermata TV, schermata telefono. Grafica essenziale.

**Cancello:**
- [ ] una partita completa si gioca dall'inizio alla fine senza errori
- [ ] checklist manuale con più telefoni superata (vedi `TEST-MANUALI.md` del gioco)
- [ ] **prima serata di prova** con persone vere, con note raccolte in `docs/playtest/`

## Fase 4 · Rifinitura

**Scopo:** correggere ciò che è emerso dalle prove, animazioni, tutorial, più contenuti.

**Cancello:**
- [ ] almeno 2 serate di prova senza problemi bloccanti
- [ ] Luis dichiara il gioco "completo"

## Fase 5 · Rilascio personale

Il gioco è online e usabile per le serate. Si raccolgono idee per estensioni.
Un eventuale rilascio pubblico si valuta separatamente.

---

## Procedure ricorrenti

### Avviare un nuovo gioco
`/nuovo-gioco <nome>` → crea `giochi/NN-nome/` dai modelli e aggiunge la riga al README.

### Prendere una decisione
`/decisione` → Claude presenta le alternative, Luis sceglie, la scelta va in `DECISIONI.md`
(del gioco, oppure in `docs/DECISIONI-GENERALI.md` se vale per tutti).

### Chiudere un lavoro
1. `/verifica` → test e controlli
2. `/registra-modifica` → changelog e roadmap
3. commit Git (su richiesta di Luis)

### Serata di prova (playtest)
1. Prima: checklist manuale superata, istanza di prova online, numero di giocatori annotato.
2. Durante: Luis (o un osservatore) annota momenti di noia, confusione, divertimento.
3. Dopo: file `docs/playtest/AAAA-MM-GG.md` con osservazioni e proposte di modifica.
   Le modifiche al design passano dal GDD, mai direttamente dal codice.
