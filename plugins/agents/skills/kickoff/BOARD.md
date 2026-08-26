# BOARD

Svarer på **ét** spørgsmål: hvem har bolden. Skal kunne skimmes på ti sekunder.

Opdateres af den rolle der afslutter et handoff — sidste handling før handoff-blokken.

Er BOARD uenig med et dokument i `docs/plans/`, er dokumentet rigtigt og BOARD forkert. Ret BOARD.

## I gang

| Nr. | Titel | Fase | Bolden hos | Status | Venter på |
|---|---|---|---|---|---|
| 0001 | <eksempel — slet linjen> | byg | developer | i-gang | intet |

**Fase:** `plan` · `byg` · `test` · `sikkerhed` · `review` · `afventer udrulning` · `i drift`

**Bolden hos** er en rolle, eller `menneske` når der ventes på en godkendelse eller et valg.

## Kommende

| Nr. | Emne |
|---|---|

<Overskrifter, én linje hver. Skrevet af `kickoff`, taget af `architect`.>

## Færdige

| Nr. | Titel | I drift siden |
|---|---|---|

## Regler

- **Ét nummer, én række.** Ingen prosa. Formen er selve håndhævelsen — en tabelrække kan ikke blive otte linjers forklaring.
- **Ingen commit-hashes, filstier eller rollenavne i `Venter på`.** Begrundelser hører i `docs/decisions/log.md`, som gør det arbejde bedre.
- **Der bygges kun på ét nummer ad gangen.** Er fasen `byg` optaget, startes der ikke et nyt nummer der. Flere numre må gerne ligge i `afventer udrulning` — det er kun bygningen der er begrænset.
- Står der `menneske` under *bolden hos*, arbejder ingen rolle videre på det nummer.
- **Flyt til Færdige når det er i drift** — ikke når testene er grønne. Er arbejdet klar men ikke udrullet, er fasen `afventer udrulning`.
- Slet ikke fra Færdige. Historikken er billig.
