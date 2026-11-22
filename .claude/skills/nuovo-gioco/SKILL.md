---
name: nuovo-gioco
description: Crea la cartella di un nuovo gioco in giochi/ partendo dai modelli in templates/gioco, e lo registra nel README principale. Usare quando Luis vuole iniziare un nuovo gioco.
---

# Nuovo gioco

1. Chiedi a Luis, se non già indicati: nome (anche provvisorio), modello (A/B/C), numero di giocatori, idea in una frase.
2. Calcola il numero progressivo `NN` (due cifre) guardando le cartelle in `giochi/`.
3. Crea la cartella `giochi/NN-nome-in-minuscolo-con-trattini/` copiando tutto `templates/gioco/`.
4. Sostituisci `{{NOME_GIOCO}}` e `{{DATA}}` (data odierna AAAA-MM-GG) in tutti i file.
5. Crea `docs/01-design-del-gioco.md` con la legenda degli stati (✅ 🟡 🔴 ⚖️) e le sezioni:
   Visione, Formato e dispositivi, Giocatori, Struttura della partita, Meccaniche, Punteggio,
   Cosa mostrano TV e telefono, Tono, Punti aperti, Glossario. Inserisci ciò che Luis ha detto, tutto come 🟡 salvo conferme esplicite.
6. Aggiungi la riga del gioco alla tabella in `README.md` (fase "1 · Design").
7. Aggiungi una voce nel `CHANGELOG.md` principale.
8. Riporta a Luis il percorso creato e i prossimi passi (completare il GDD).
