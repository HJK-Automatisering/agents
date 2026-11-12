---
nummer: task-0020
titel: GUIDE kender kun hookens kontrakttjek, og træet i PLUGIN.md mangler repoets egne filer
status: afsluttet
kilde: interview
oprettet: 2026-11-12
---

# task-0020 — GUIDE kender kun hookens kontrakttjek, og træet i PLUGIN.md mangler repoets egne filer

## Hvad og hvorfor

To rester fra task-0019, som developer fandt. `GUIDE.md` siger stadig to steder at hooken og
`/agents:update` kun handler om kontrakten. De dækker også workflows, designstandarden og
`.gitignore`. Træet i `PLUGIN.md` mangler repoets egen kontrakt, kontrolværktøjet, CI og `docs/`.
`CLAUDE.md` kalder træet det fulde og kilden, så hullerne er fejl og ikke et valg.

## Færdig når

- [ ] Afsnittet om hvorfor man skal have Node i `GUIDE.md` siger det samme om hooken som afsnittet om hvad man mister uden Node: om projektet er nyt, om kopierne fra plugin'et er bagud, og om `.gitignore` mangler. Der står intet tal
- [ ] Sætningen om at man selv skal huske opdateringen uden hooken, siger at det er projektets kopier fra plugin'et der bliver forældede, ikke kun kontrakten
- [ ] Træet i `PLUGIN.md` viser repoets egen kontrakt i roden og siger tydeligt at den ikke er skabelonen der kopieres ud i projekter
- [ ] Træet viser kontrolværktøjet, CI-workflowet, `docs/` og `.gitignore`, hver med en kort forklaring
- [ ] Repoets kontrol er grøn

## Sådan bygger vi det

**1. `GUIDE.md`.** Under `## Forudsætning: Node`, første afsnit (omkring linje 73), står at hooken
siger til ved et tomt projekt, eller når kontrakten er bagud. Skriv den om, så den dækker det samme
som linjen under `### Hvis Node mangler` (omkring linje 91), som task-0019 rettede. Brug gerne samme
ord, så de to steder ikke driver fra hinanden. Under samme overskrift (omkring linje 93) står at
ingen gør opmærksom på at *projektets kontrakt* er blevet forældet. Det skal være projektets kopier
fra plugin'et: kontrakt, workflows og designstandard. Det er dem `/agents:update` skriver. Søg også
resten af `GUIDE.md` igennem for andre steder der beskriver hooken eller `/agents:update` som noget
der kun handler om kontrakten. Ret dem på samme måde, og skriv i dine noter hvilke du fandt.

**2. Træet i `PLUGIN.md`.** Under `## Struktur`, i rodens del af træet, tilføjer du:

- `AGENTS.md`: repoets egen kontrakt, som rollerne arbejder under her. Forklaringen skal skille den
  fra `skills/kickoff/AGENTS.md`, som er skabelonen. `CLAUDE.md` advarer mod netop den forveksling
- `tools/validate.mjs`: kontrollen, den samme som CI kører
- `.github/workflows/validate.yaml`: CI, som kører kontrollen
- `docs/`: repoets egne opgaver, rapporter, BOARD og beslutningslog
- `.gitignore`: nævn at den holder `EVALUERING.md` ude, fordi repoet er offentligt

Hold træets form med en kort forklaring til højre. Kig i filerne selv frem for at gætte, hvis du er i
tvivl om hvad de gør. `.gitattributes` skal ikke med.

Kør `node tools/validate.mjs` til sidst.

## Hvad vi ikke rører

- Hookens kode og beskeder, og `hooks.json`
- `kontrakt-version`, `skabelon-version`, `design-version` og versionsnumrene i manifesterne
- `AGENTS.md` i roden og skabelonen under `plugins/agents/skills/kickoff/`
- `README.md`, `OPSAETNING.md`, `CLAUDE.md` og resten af `PLUGIN.md` uden for træet
- `CHANGELOG.md`, rapporterne, opgaverne, `docs/BOARD.md` og beslutningsloggen

## Afhænger af

task-0019, som er afsluttet

## Beslutninger

- BESLUTTET: de to emner er én opgave. Begge er rester fra task-0019's fund, begge er
  dokumenttekst, og de rører hver sin fil. Ingen af dem bærer en tråd alene
- BESLUTTET: linjen om at kontrakten bliver forældet (omkring linje 93) kommer med, selvom fundet kun
  nævnte linje 73. Den er ufuldstændig på samme måde, og den står under samme overskrift
- BESLUTTET: træet tager `.gitignore` med, men ikke `.gitattributes`. `.gitignore` bærer en regel
  om det offentlige repo, som `CLAUDE.md` nævner. `.gitattributes` forklarer ingenting for en
  vedligeholder
- BESLUTTET: architect tilbyder ikke et versionsnummer. Det er dokumentation i repoet, og intet der
  kopieres ind i projekterne, ændrer adfærd

## Åbne punkter

## Indvendinger

---

## Developers noter

<Alt over denne overskrift ejes af architect. Alt herunder skrives kun af
developer, som aldrig retter i definitionen ovenfor.>

### Hvad er lavet

Gren: `task-0020-guide-hook-and-plugin-tree`. To commits: `44dbff8` (GUIDE.md) og `aacd05a`
(PLUGIN.md). Opgavefilen, `docs/BOARD.md` og `docs/decisions/log.md` er ikke committet; de er
architects.

- **Punkt 1** — `GUIDE.md`, `## Forudsætning: Node`, første afsnit: hooken "siger til ved
  sessionsstart: om projektet er nyt, om kopierne fra plugin'et er bagud, og om `.gitignore`
  mangler." Samme ord som linjen under `### Hvis Node mangler`. Intet tal.
- **Punkt 2** — `GUIDE.md`, under `### Hvis Node mangler`: uden hooken gør ingen opmærksom på at
  "projektets kopier fra plugin'et er blevet forældede: kontrakten, workflows og designstandarden."
- **Andre steder i `GUIDE.md`** jeg fandt og rettede på samme måde:
  - `## Rollerne`, linjen efter tabellen: `/agents:update` "bringer projektets kopier fra plugin'et
    ajour — kontrakten, workflows og designstandarden". Stod før: "bringer projektets kontrakt ajour".
  - `## Snydeark`: `Kontrakten er bagud` → `Kopierne er bagud`, samme kolonne.
- **Punkt 3** — `PLUGIN.md`, træet under `## Struktur`: `AGENTS.md` i roden med forklaringen
  "repoets egen kontrakt, som rollerne arbejder under her — ikke skabelonen i skills/kickoff/, der
  kopieres ud i projekter".
- **Punkt 4** — samme træ: `.github/workflows/validate.yaml` (CI, kører kontrollen ved push til
  main og ved pull requests, efter `on:` i filen), `tools/validate.mjs` (kontrollen, den samme som CI
  kører), `docs/` (repoets egne opgaver, rapporter, BOARD og beslutningslog) og `.gitignore`
  (holder bl.a. `EVALUERING.md` ude, fordi repoet er offentligt). `.gitattributes` er ikke med.
- **Punkt 5** — `node tools/validate.mjs`: `OK. 13 skills, 7 agenter, 58 markdown-filer,
  29 farvepar, begge manifester paa version 1.4.0.`

Ingen nye kommandoer eller indstillinger. Ingen versionsnumre eller stempler rørt.

### Hvad er ikke lavet, og hvorfor

- `## Kontrakten er en kopi` i `GUIDE.md` (omkring linje 296) beskriver `/agents:update` ud fra
  kontrakten alene. Ikke rettet: afsnittet handler netop om kontrakten, og det det siger, er
  rigtigt. Det påstår ikke at `update` kun handler om kontrakten. Designstandarden har sit eget
  tilsvarende afsnit under `## Designstandard`.

Uden for opgaven, set undervejs (to fund):

1. `## Workflows` i `GUIDE.md` siger ikke at projektets workflow-kopi bliver bagud når plugin'et
   opdateres, eller at hooken melder `ET WORKFLOW ER BAGUD`. `## Kontrakten er en kopi` og
   `## Designstandard` siger det for hver deres kopi. Ikke rettet: det er nyt indhold, ikke en
   rettelse af noget der står.
2. Linjen for skabelonen i træet i `PLUGIN.md`, `skills/kickoff/AGENTS.md`, hedder stadig
   "kontrakten, kopieres ind i projekter". Ordet *skabelonen* står nu kun ved roden. Ikke rettet:
   opgaven bad om forklaringen ved roden-filen, og linjen er ikke forkert.

### Uklart

intet
