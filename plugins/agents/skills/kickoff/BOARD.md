# BOARD

Overblik over hvad der er i gang. **Opdateres af den rolle der afslutter et handoff** — det er sidste handling før handoff-blokken.

Denne fil er et overblik, ikke en sandhed. Er den uenig med en spec eller plan, er filen rigtig og BOARD forkert. Ret den.

## I gang

| Nr. | Titel | Fase | Bolden hos | Status | Blokeret af |
|---|---|---|---|---|---|
| 0001 | <eksempel — slet denne linje> | plan | architect | udkast | intet |

**Fase** er hvor i flowet arbejdet er: `spec` · `plan` · `test` · `byg` · `sikkerhed` · `review` · `fejl`
**Bolden hos** er en rolle, eller `menneske` når der ventes på godkendelse eller et valg.

## Venter på godkendelse

| Nr. | Fil | Hvad skal besluttes |
|---|---|---|

## Færdige

| Nr. | Titel | Afsluttet |
|---|---|---|

## Regler

- Ét nummer, én linje. Er der to roller på samme nummer samtidig, er opgaven for stor — del den.
- Står en linje med `bolden hos: menneske`, arbejder ingen agent videre på det nummer.
- Flyt til **Færdige** når planen er `færdig` og fundene er lukket. Slet ikke — historikken er billig.
