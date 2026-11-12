# BOARD

Tilstandsrapport. Svarer på: **hvad er åbent, og hvad venter på mig.** Skal kunne skimmes på ti sekunder.

**Skrives af `architect`**, som er den eneste rolle der opretter opgaver, sætter statusser og triagerer rapporter. Opdateres før tråden lukkes. Ingen agent skriver her.

`status` skriver den ikke — den læser den, holder den op mod filerne, og siger til hvis den er skredet. **Er BOARD uenig med en fil, er filen rigtig.**

**Ingen prosa i tabellerne.** Ingen commit-hashes, filstier, datoer eller begrundelser. Begrundelser hører i `docs/decisions/log.md`.

## Rapporter klar til behandling

| Nr. | Rolle | Uafhentede punkter |
|---|---|---|

<En rapport står her indtil hvert af dens fund er blevet en opgave eller er
afvist i beslutningsloggen. Det er det eneste sted et fund kan forsvinde —
en rapport der har stået her i dagevis, er et fund på vej til at blive glemt.>

## Opgaver

| Nr. | Titel | Status | Kilde |
|---|---|---|---|

<`Status` er `planlagt`, `i-gang` eller `afsluttet`. `Kilde` er `interview`
eller nummeret på den rapport opgaven kom af.>

## Kommende

| Emne |
|---|

<Den grove liste: hvad architect kan se der skal laves. **Ingen numre.**
Et emne får først et nummer når interviewet har gjort det udførbart —
ellers fyldes `docs/tasks/` med halve idéer.>

## Afsluttet

| Nr. | Titel | Udfald |
|---|---|---|
| task-0001 | Workflow-skabelon: tag-trigger og synkronisering | bygget |
| task-0002 | Vedligeholdelsesdokumentet kender kun kontraktens stempel, og afprøvningsvejen er forkert | bygget |
| task-0003 | Opdateringskaldet har ingen regel for en kilde der er ældre end projektets kopi | bygget |
| task-0004 | Opdateringskaldet opregner ikke de steder der stadig beskriver det gamle vilkår | bygget |
| task-0005 | Udgivelser efterlader intet spor i historikken | bygget |
| task-0006 | En workflow-kopi uden sit dokument er usynlig for hooken | bygget |
| task-0007 | Caller-skabelon og compose-regler efter workflow v1.2.0 | bygget |
| task-0008 | En mockup-rolle til møder med slutbrugere | bygget |
| task-0009 | Hooken og kickoff kender en mappe der kun har skitser | bygget |
| task-0010 | Resten af plugin'et kender ikke skitserne | bygget |
| task-0011 | Opdateringsvejledningen dækker ikke et plugin leveret centralt | bygget |
| task-0012 | En app bag Nginx Proxy Manager og Authentik, klik for klik | bygget |
| task-0013 | Kontrakten kender ikke de krav en app bag Authentik selv skal opfylde | bygget |
| task-0014 | En fælles designstandard for webløsninger, og et kald der lægger den ind | bygget |
| task-0015 | Designstandarden har ingen fast bundlinje med team, kontaktadresse og version | bygget |
| task-0016 | Hooken, opdateringen og kontrollen kender ikke designstandardens stempel | bygget |
| task-0017 | Kontrakten og rollerne kender ikke designstandarden | bygget |
| task-0018 | Henvisningerne til bundlinjens regel peger stadig på standardens dokument | bygget |
| task-0019 | Hooken og dokumenterne beskriver et mindre plugin end det der findes | bygget |
| task-0020 | GUIDE kender kun hookens kontrakttjek, og træet i PLUGIN.md mangler repoets egne filer | bygget |
| task-0021 | GUIDE siger ikke at projektets workflow-kopi bliver bagud | bygget |
| task-0022 | Bundlinjen står i venstre side, men skal stå centreret | bygget |

<`Udfald` er `bygget` eller `afvist`. Flyt hertil når architect har vurderet
opgaven — ikke når udrulningen er sket; udrulning er ikke en status.
Slet ikke herfra; historikken er billig.>
