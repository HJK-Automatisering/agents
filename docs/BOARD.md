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
| task-0002 | Vedligeholdelsesdokumentet kender kun kontraktens stempel, og afprøvningsvejen er forkert | planlagt | interview |
| task-0004 | Opdateringskaldet opregner ikke de steder der stadig beskriver det gamle vilkår | planlagt | interview |

<`Status` er `planlagt`, `i-gang` eller `afsluttet`. `Kilde` er `interview`
eller nummeret på den rapport opgaven kom af.>

## Kommende

| Emne |
|---|
| Udgivelser tagges ikke i git; nummeret står kun i commit-beskeden |
| Hookens navn dækker ikke dens fire ansvar |
| Runtime-version står ikke i CLAUDE.md |
| Fritstående workflow-kopier uden dokument får aldrig besked om at de er bagud |

<Den grove liste: hvad architect kan se der skal laves. **Ingen numre.**
Et emne får først et nummer når interviewet har gjort det udførbart —
ellers fyldes `docs/tasks/` med halve idéer.>

## Afsluttet

| Nr. | Titel | Udfald |
|---|---|---|
| task-0001 | Workflow-skabelon: tag-trigger og synkronisering | bygget |
| task-0003 | Opdateringskaldet har ingen regel for en kilde der er ældre end projektets kopi | bygget |

<`Udfald` er `bygget` eller `afvist`. Flyt hertil når architect har vurderet
opgaven — ikke når udrulningen er sket; udrulning er ikke en status.
Slet ikke herfra; historikken er billig.>
