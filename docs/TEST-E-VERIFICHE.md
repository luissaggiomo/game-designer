# Test e verifiche

## 1. Livelli di test

| Livello | Cosa verifica | Chi lo esegue | Quando |
|---|---|---|---|
| **Test unitari** (= collaudo di ogni singola regola, come provare un impianto per volta) | Ogni regola del motore, con i casi limite | Automatico | A ogni modifica |
| **Test delle viste** | Nessun dispositivo riceve dati che non deve vedere | Automatico | A ogni modifica |
| **Partite riprodotte** | Stesso seme + stesse azioni = stesso risultato | Automatico | A ogni modifica |
| **Simulazione** | Equilibrio dei numeri su migliaia di partite | Automatico, report letto da Luis | Quando cambiano i numeri ⚖️ |
| **Checklist manuale** | Ingresso con QR, riconnessione, schermo acceso, ecc. con telefoni veri | Luis + Claude | Prima di ogni serata di prova |
| **Serata di prova** | Il gioco è divertente e comprensibile | Persone vere | A fine fase 3 e 4 |

## 2. Regole obbligatorie

1. **Ogni regola del GDD marcata ✅ ha almeno un test** che la verifica.
2. **Ogni errore trovato** riceve prima un test che lo riproduce, poi la correzione
   (così non ritorna).
3. **I test di sicurezza delle viste** sono obbligatori per i giochi con informazioni segrete.
4. **Nessun lavoro è "fatto" con test che falliscono.** Se un test viene disattivato
   temporaneamente, va scritto nel changelog con il motivo.
5. I test si eseguono con un solo comando, indicato nel `CLAUDE.md` del gioco.

## 3. Prima di dichiarare "fatto" (checklist di `/verifica`)

- [ ] test automatici: tutti verdi
- [ ] controllo dei tipi TypeScript senza errori
- [ ] nessun dato segreto nelle viste (se applicabile)
- [ ] contenuti JSON validi
- [ ] `CHANGELOG.md` e `ROADMAP.md` aggiornati
- [ ] decisioni nuove registrate in `DECISIONI.md`
- [ ] se l'interfaccia è cambiata: provata almeno su un telefono (o simulazione mobile del browser)

## 4. Resoconto a Luis

Dopo una verifica Claude riporta in modo breve: cosa è stato provato, esito, eventuali
punti non verificati. Se un test fallisce si mostra quale e perché, senza nasconderlo.
