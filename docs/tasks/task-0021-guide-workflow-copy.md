---
nummer: task-0021
titel: GUIDE siger ikke at projektets workflow-kopi bliver bagud
status: afsluttet
kilde: interview
oprettet: 2026-11-12
---

# task-0021 — GUIDE siger ikke at projektets workflow-kopi bliver bagud

## Hvad og hvorfor

`GUIDE.md` forklarer at kontrakten og designstandarden er kopier i projektet, som ikke følger med
når plugin'et opdateres, og at hooken siger til. Det samme gælder et workflow, men afsnittet om
workflows siger det ikke. En udvikler der læser guiden, ved derfor ikke at kopien kan være
forældet, og ved heller ikke at dokumentet under `docs/workflows/` ikke må slettes. Fundet kom fra
`developer` under task-0020.

## Færdig når

- [ ] Afsnittet om workflows i `GUIDE.md` siger at projektets workflow-kopi ikke følger med når plugin'et opdateres, og hvor dens versionsnummer står
- [ ] Det viser hvordan Claude Code melder det, på samme måde som afsnittene om kontrakten og designstandarden gør
- [ ] Det siger hvad `/agents:update` gør ved workflowet: hvad den bevarer, og hvornår den stopper og spørger
- [ ] Det siger at dokumentet under `docs/workflows/` ikke må slettes, fordi udgaven så ikke kan aflæses, og at Claude Code også siger til om det
- [ ] Alt det afsnittet lover, passer med hvad hooken og opdateringskaldet faktisk gør
- [ ] Repoets kontrol er grøn

## Sådan bygger vi det

Tilføj et kort stykke sidst i `## Workflows` i `GUIDE.md`, før `## Designstandard`. Brug
det sidste stykke i `## Designstandard` som forbillede (*"Kopien følger ikke med når plugin'et
opdateres …"*): én fed indledende sætning, et citat af den første linje i hookens besked, og så
hvad `/agents:update` gør.

Fakta skal hentes fra kilden, ikke fra denne opgave:

- Hookens besked står i `plugins/agents/hooks/check-project-state.cjs`, funktionerne
  `skabelonBagud` og `udgaveUkendt`. Citér kun første linje og den linje der nævner versionerne.
  Brug eksempeltal, fx 4 og 5, ikke de rigtige.
- Hvad opdateringen gør ved et workflow, står i `plugins/agents/skills/update/SKILL.md`. Den bevarer
  projektets indstillinger under `with`, og den stopper ved rettelser andre steder. Den fritstående
  udgave med lokale ændringer har sin egen regel. Skriv det kaldet faktisk gør, kort, og kun det en
  udvikler skal vide.
- Stemplet hedder `skabelon-version` og står i frontmatter i dokumentet under `docs/workflows/`.

Hold samme tone og længde som de to tilsvarende afsnit. Det er et stykke tekst, ikke et nyt afsnit
med egen overskrift.

Kør `node tools/validate.mjs` til sidst.

## Hvad vi ikke rører

- Resten af `GUIDE.md`, og alle andre filer på nær opgavens egne noter
- Hookens kode og beskeder, og opdateringskaldet
- `skabelon-version`, `kontrakt-version`, `design-version` og versionsnumrene i manifesterne
- `README.md`, `docs/BOARD.md`, beslutningsloggen og `CHANGELOG.md`

## Afhænger af

intet

## Beslutninger

- BESLUTTET: et stykke sidst i `## Workflows` i samme form som designstandardens. Der kommer ikke
  et eget afsnit. De to andre kopier er beskrevet sådan, og guiden skal læses ens for alle tre
- BESLUTTET: tilfældet med en workflow-fil uden sit dokument kommer med i én sætning. Det er den
  eneste måde en udvikler kan gøre hooken blind på, og reglen om ikke at slette dokumentet står
  ingen steder i guiden
- BESLUTTET: eksempeltallene i citatet er opdigtede, ikke det nuværende stempel. Ellers er citatet
  forkert ved næste bump
- BESLUTTET: architect tilbyder ikke et versionsnummer. Det er dokumentation i repoet

## Åbne punkter

## Indvendinger

---

## Developers noter

<Alt over denne overskrift ejes af architect. Alt herunder skrives kun af
developer, som aldrig retter i definitionen ovenfor.>

### Hvad er lavet

- `GUIDE.md`, sidst i `## Workflows` og før `## Designstandard`: tre afsnit og et citat i samme
  form som det sidste stykke i `## Designstandard`. Ingen ny overskrift. Commit `d16d39c`.
- *Følger ikke med, og hvor nummeret står:* den fede indledning siger at kopien ikke følger med,
  at workflowet er to filer (kalderen i `.github/workflows/`, dokumentet i `docs/workflows/`), og
  at nummeret er `skabelon-version` i dokumentets frontmatter.
- *Hvordan Claude Code melder det:* citat af første linje i `skabelonBagud` og én versionslinje,
  med eksempeltallene 4 og 5 og filnavnet `docker-publish.md`, som er det eneste workflow i
  plugin'et. Linjen står som et punkt i citatet, som i hookens egen udskrift.
- *Hvad `/agents:update` gør:* den skriver kalderen og dokumentet igen og bevarer indstillingerne
  under `with` i hvert job (del 2, trin 4 og 6). Den stopper og spørger ved rettelser uden for
  `with` og ved jobs skabelonen ikke har (trin 5). Den rører ikke en workflow-fil der ikke kalder
  det fælles workflow-repo, heller ikke den gamle fritstående udgave (trin 2).
- *Dokumentet må ikke slettes:* en fed sætning og én sætning mere. Uden dokumentet kan udgaven
  ikke aflæses. Claude Code siger til (`udgaveUkendt`), og `/agents:update` lægger dokumentet på
  plads og bringer kalderen ajour. Det svarer til del 2, trin 3, og hookens egen tekst.
- *Passer med kilden:* hver påstand er holdt op mod `check-project-state.cjs` og
  `update/SKILL.md` som nævnt ovenfor.
- `node tools/validate.mjs`: grøn ("OK. 13 skills, 7 agenter, 59 markdown-filer, 29 farvepar,
  begge manifester paa version 1.4.0.").
- Ingen nye kommandoer eller indstillinger.

### Hvad er ikke lavet, og hvorfor

- Hooken er ikke kørt mod et engangsprojekt for at se citatet i dens egen udskrift. Kaldet blev
  afvist af tilladelserne. Citatet er skrevet ud fra koden i `skabelonBagud`.
- Ingen versionsnumre eller stempler er rørt, efter opgaven. Opgavefilen, `docs/BOARD.md` og
  beslutningsloggen er ikke committet; det gør architect ved lukningen.

### Uklart

- Opgaven siger at *"den fritstående udgave med lokale ændringer har sin egen regel"*. I
  `update/SKILL.md` (del 2, trin 2) er reglen at en fil med `docker-publish-standalone.yaml` i
  hovedet behandles som projektets egen og ikke røres, uanset lokale ændringer. Jeg har skrevet
  det kaldet gør: at den ikke røres. Mente opgaven noget andet, skal sætningen rettes.
