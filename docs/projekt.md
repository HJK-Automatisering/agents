---
titel: agents
rolle: kickoff
oprettet: 2026-09-22
---

# agents

Repoet fandtes før metoden. Dokumentet er skrevet bagudrettet og dækker kun
det der ikke står andre steder: hvem det er til, hvad vi bevidst ikke bygger,
og hvad vi skal leve med.

**Hvad plugin'et er** står i `README.md`. **Hvordan det bruges** står i
`GUIDE.md`. **Hvordan det vedligeholdes** står i `PLUGIN.md`. Det gentages
ikke her.

## Hvad og hvorfor

### For hvem

- **Udviklere i HJK-Automatisering** der arbejder i Claude Code. De kalder
  rollerne; `GUIDE.md` er skrevet til dem.
- **Dem der vedligeholder og udruller plugin'et.** `PLUGIN.md` er deres.

Uden det har hver udvikler sin egen arbejdsmåde, og der findes ingen fælles
regelbog en rolle kan arve. Plugin-formen er valgt så en rettelse rammer alle
ved næste udgivelse.

Repoet er offentligt, så andre kan installere det. Det er ikke skrevet til dem,
og deres behov styrer ikke hvad der kommer i.

### Ikke-mål

- **Ikke en generel agent-ramme.** Der er ni bestemte roller med hvert sit
  mandat — ikke byggeklodser andre kan sætte sammen til noget andet.
- **Ingen automatisk rollevalg.** Prosa udløser ingenting. Alle skills har
  `disable-model-invocation`, og agenternes beskrivelser er skrevet som
  anti-trigger.
- **Ingen kæde mellem roller.** Stjernemodellen er et valg: ingen rolle peger
  på en anden, alt returnerer til navet.
- **Intet program.** Der er ingen build, ingen tests og ingen kørende kode ud
  over SessionStart-hooken.
- **Ikke en erstatning for projekternes `CLAUDE.md`.** Kontrakten bestemmer
  *hvordan* der arbejdes; projektets egen fil bestemmer *hvad* projektet er.
- **Ingen håndhævelse i værktøjslaget.** En agents `tools:`-liste fjerner
  værktøjer, men `Write` og `Bash` er med — begrænsningen er en aftale, ikke
  en mekanisme.

### Begrænsninger

| Type | Beskrivelse |
|---|---|
| Tid | Ingen kendt binding. Udgivelser sker når noget er klar, ikke til en dato |
| Data og persondata | Repoet er offentligt og kan ikke gøres privat bagudrettet. Ingen kundenavne, systemnavne, logudskrifter, fund eller persondata i eksempler — heller ikke opdigtede der ligner rigtige |
| Systemer vi skal leve med | Claude Code findes i to udgaver på samme maskine (app og WinGet) og deler `~/.claude/plugins`. Appen sætter `DISABLE_AUTOUPDATER=1`, så udrulning er manuel. Node skal installeres separat, ellers kører hooken ikke. GitHub er både marketplace og distribution |
| Lovkrav | Ingen ud over det et offentligt repo i sig selv medfører |

### Uden for dette dokument

- **Versionsnumre og udgivelser.** Begge manifester og `kontrakt-version`
  bumpes kun når mennesket beder om det. Se `CLAUDE.md`.
- **Hvad der skal bygges.** Emner står på `docs/BOARD.md`; opgaver oprettes af
  `architect`.

## Beslutninger

- BESLUTTET: dokumentet skrives kort og bagudrettet — kun `For hvem`,
  `Ikke-mål` og `Begrænsninger`. Resten af skabelonen ville gentage
  `PLUGIN.md` og `GUIDE.md`, og to lister om det samme driver fra hinanden.
