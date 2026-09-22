# Beslutningslog

Append-only. Nyeste øverst. Én linje pr. beslutning.

**Ejes af `architect`.** Dens tråd er den eneste samtale i modellen, og loggen er det eneste spor af den der overlever tråden. Hver beslutning truffet i en `architect`-tråd skrives ind, med begrundelse, før tråden lukkes.

Her hører også **afvisninger**: et fund der ikke bliver en opgave, skal have sin begrundelse her. Ellers er det et fund der forsvandt.

`Nr.` er nummeret beslutningen hører til — `task-0042`, `test-0003` — eller `—` hvis den gælder projektet som helhed.

| Dato | Nr. | Beslutning | Begrundelse | Rolle |
|---|---|---|---|---|
| 2026-09-22 | task-0001 | Opgavedokument, BOARD og log ligger på opsætningsgrenen, ikke på en task-gren | Kontraktens gren-pr-opgave dækker byggearbejdet; definitionen er architects bogholderi. Afvist: egen gren til et dokument der refererer BOARD på en anden gren | architect |
| 2026-09-22 | task-0001 | Alt leveres i én udgivelse | Delene virker kun sammen. Afvist: tom plumbing-udgivelse først — manglende stempel regnes som 1, så synkroniseringen ville aldrig blive prøvet | architect |
| 2026-09-22 | task-0001 | architect og security bærer kontrollen af manglende stempel og manglende tagging | Begge har mandatet i forvejen. Afvist: reviewer, fordi docker-publish.md holder den ude af workflow-filer med vilje | architect |
| 2026-09-22 | task-0001 | skabelon-version bor i workflow-dokumentets frontmatter; manglende stempel regnes som 1 | Frontmatter læses af validate.mjs i forvejen, og de to assets deler ét dokument. Afvist: to stempler der skal holdes ens | architect |
| 2026-09-22 | task-0001 | Hooken tjekker også workflow-stempler | Uden den udløses synkroniseringen aldrig; update køres fordi hooken beder om det. Afvist: at vente på næste kontrakt-bump | architect |
| 2026-09-22 | task-0001 | update synkroniserer både YAML-filen og workflow-dokumentet; CLAUDE.md røres ikke | Dokumentet bliver forkert samme sekund triggeren ændrer sig. CLAUDE.md-linjen siger kun at workflowet er valgt | architect |
| 2026-09-22 | task-0001 | Kun with:-blokken bevares; permissions: og resten erstattes hårdt | with: bærer projektfakta som dockerfile-sti. permissions: er en forudsætning — er den ændret, er den forkert | architect |
| 2026-09-22 | task-0001 | update skriver hele workflow-filen og stopper ved rettelser uden for with: | Samme form som kontrakten bruger i dag. Afvist: ren rapportering, fordi et kald der aldrig skriver, ikke bliver kørt | architect |
| 2026-09-22 | task-0001 | docker-publish bygger kun på semver-tags; pull_request bevares | Et push af en markdown-fil skal ikke skrive en ny digest. pull_request er eneste kontrol af at imaget bygger før et tag | architect |
| 2026-09-22 | — | paths-ignore afvist som løsning på unødige builds | Filteret gælder hele push-triggeren, også tags, og gør sha-serien hullet. Tag-only løser det samme uden fælden | architect |
| 2026-09-22 | — | Forbrugere af :main flyttes til :latest | Uden branch-push skrives :main aldrig igen. Portainer henter manuelt, så kadencen er uændret for mennesket | architect |
| 2026-09-22 | — | Projektdokumentet skrives kort og bagudrettet | Kun For hvem, Ikke-mål og Begrænsninger. Resten ville gentage PLUGIN.md og GUIDE.md | kickoff |
