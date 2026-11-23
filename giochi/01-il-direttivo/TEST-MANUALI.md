# Il Direttivo — Checklist di prova manuale

Da eseguire con dispositivi veri prima di ogni serata di prova.

## Passo 1 · Server sul PC di Luis (pagine di prova provvisorie)
Avvio: dalla cartella del gioco `corepack pnpm gioca` (si apre da solo la pagina TV nel browser).
La prima volta Windows può chiedere se Node.js può usare la rete: consentire le **reti private**.
- [x] La pagina TV mostra codice stanza, QR e l'indirizzo per i telefoni
- [x] Il telefono, sulla Wi-Fi di casa, entra inquadrando il QR e scrivendo il nome
- [x] Il primo telefono entrato ha la stella ⭐ e i comandi (anche la pagina TV li ha)
- [x] «+ Bot» e «− Bot» cambiano l'elenco; «Avvia» parte da 4 giocatori in su
- [x] Il telefono mostra reparto, ruolo e i pulsanti della fase; la TV mostra "Mancano: …"
- [x] Quando tutti hanno agito la fase si chiude da sola dopo circa 2 secondi
- [x] «Pausa» ferma il conto alla rovescia (anche i bot si fermano), «Riprendi» riparte dal tempo rimasto
- [x] «Avanti» chiude subito la fase; Punteggio e Lettura dei messaggi aspettano «Avanti»
- [x] Ricaricando la pagina del telefono si rientra nello stesso posto; la TV mostra il telefono sbiadito mentre è scollegato
- [x] Ricaricando la pagina TV si rientra nella stessa stanza con i comandi
- [x] Con "I bot possono essere spie" acceso, in qualche partita a fine gioco un bot risulta SPIA_PRUDENTE o SPIA_AGGRESSIVA
- [x] A fine partita la TV mostra punteggi, ruoli e carattere di ogni bot

## Ingresso e collegamento
- [ ] La TV mostra QR e codice stanza (4 caratteri, senza O/0, I/1) leggibili da 3 metri
- [ ] iPhone (Safari, iOS 16.4+) entra inquadrando il QR
- [ ] Android (Chrome) entra inquadrando il QR
- [ ] Ingresso digitando il codice a mano
- [ ] Un nuovo giocatore non può entrare a partita iniziata
- [ ] Nomi dei giocatori visibili in TV

## Stabilità
- [ ] Ricaricando la pagina del telefono si rientra nello stesso reparto
- [ ] Spegnendo e riaccendendo il Wi-Fi del telefono si rientra
- [ ] Lo schermo del telefono resta acceso (Wake Lock) su iPhone e Android
- [ ] La TV si riconnette dopo un ricaricamento

## Partita
- [ ] Partita completa da 4 giocatori senza errori
- [ ] Partita completa da 8 giocatori senza errori
- [ ] I timer scadono e applicano la scelta predefinita a chi non ha agito
- [ ] Voti palesi visibili in TV, con pesi mostrati prima del voto
- [ ] Effetti privati diversi su telefoni diversi per la stessa proposta

## Riservatezza
- [ ] Nessun telefono mostra ruolo, obiettivi o segreti altrui
- [ ] Un segreto inoltrato modificato non appare come "falso" a chi lo riceve
- [ ] Messaggio anonimo: il destinatario vede "Mittente anonimo"

## Pausa caffè
- [ ] Uscendo dall'app per più di 3 secondi la TV mostra "☕ Nome (n)"
- [ ] Un'uscita sotto i 3 secondi non viene contata

## Finale
- [ ] Verifica segreta, rivelazione dei "no", nomine una alla volta
- [ ] Ballottaggio in caso di parità
- [ ] Lettura finale di tutti i messaggi con i mittenti reali

## Registro delle prove
| Data | Dispositivi | Esito | Note |
|---|---|---|---|
| 24/11/2026 | PC di Luis (pagina TV) + telefono in Wi-Fi di casa | ✅ tutti i punti del Passo 1 superati | prova in solitario contro i bot |
