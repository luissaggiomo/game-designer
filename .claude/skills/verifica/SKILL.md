---
name: verifica
description: Esegue i controlli previsti da docs/TEST-E-VERIFICHE.md su un gioco (test automatici, controllo tipi, viste segrete, contenuti JSON, documenti aggiornati) e riporta l'esito. Usare prima di dichiarare un lavoro "fatto" o prima di una serata di prova.
---

# Verifica

1. Individua il gioco (dalla richiesta o dai file modificati di recente). Leggi il suo `CLAUDE.md` per i comandi.
2. Esegui, dalla cartella del gioco, nell'ordine:
   - test automatici (comando del gioco);
   - controllo dei tipi TypeScript;
   - validazione dei contenuti JSON, se prevista;
   - test di sicurezza delle viste, se il gioco ha informazioni segrete.
3. Controlla i documenti: `CHANGELOG.md` e `ROADMAP.md` riflettono il lavoro fatto? Ci sono scelte non registrate in `DECISIONI.md`?
4. Se il lavoro tocca l'interfaccia, ricorda a Luis la parte pertinente di `TEST-MANUALI.md`.
5. Resoconto breve a Luis:
   - ✅ cosa è passato · ❌ cosa è fallito (con il motivo in parole semplici) · ⚠️ cosa non è stato verificato
6. Non dichiarare mai "fatto" con un controllo fallito o saltato senza dirlo esplicitamente.
