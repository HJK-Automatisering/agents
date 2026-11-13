---
nummer: task-0025
titel: reviewer og architect kender ikke reglen om en ny udgave uden Ctrl+F5
status: i-gang
kilde: interview
oprettet: 2026-11-13
---

# task-0025 — reviewer og architect kender ikke reglen om en ny udgave uden Ctrl+F5

## Hvad og hvorfor

task-0024 gav kontrakten en regel om at hver webløsning leverer sine filer, så en ny udgave bruges
uden Ctrl+F5. Kontraktens *Hvem gør hvad* giver pligten til `architect`, `developer` og `reviewer`.
Men rollefilerne for `reviewer` og `architect` har hver en konkret linje om bundlinjen og ingen om den
nye regel. En rolle der arbejder efter sin egen fil, overser den. `developer` fandt det under
task-0024. Det skal med i samme udgivelse som reglen.

## Færdig når

- [ ] `reviewer` holder hvert projekt med en webflade op mod kontraktens regel om en ny udgave uden Ctrl+F5, på samme måde som den gør med bundlinjen, og melder det som fund når en fil kan blive hængende i browserens lager
- [ ] `architect` gør det til et emne, når en app i drift leverer sine filer uden om reglen
- [ ] `architect` skriver reglen ind i `Færdig når`, når den skriver en opgave der sætter en webflade op eller ændrer hvordan den leverer sine filer
- [ ] Begge henviser til kontraktens underafsnit og gentager ikke reglen
- [ ] Repoets kontrol er grøn, bortset fra de ventede advarsler om stemplerne

## Sådan bygger vi det

**1. `plugins/agents/agents/reviewer.md`**, omkring linje 39. Efter stykket om **Bundlinjen**: et
tilsvarende kort stykke om reglen i kontraktens `### En ny udgave uden Ctrl+F5`. Fundet er en side
eller fil med lang levetid på en adresse der ikke skifter med indholdet, eller en side der ikke svarer
`no-cache`. Brug kontraktens egne ord, og læs selve underafsnittet før du skriver.

**2. `plugins/agents/skills/architect/SKILL.md`**, omkring linje 97–101. Listen har et punkt pr.
emne architect skal se efter. Tilføj et punkt om en app i drift, der leverer sine filer uden om
reglen. Stykket efter listen siger hvad en opgave om bundlinjen skal have i `Færdig når`. Tilføj det
samme for en opgave der sætter en webflade op eller ændrer hvordan den leverer sine filer.

Søg også de øvrige rollefiler under `plugins/agents/` igennem for steder hvor bundlinjen er nævnt som
noget en rolle skal tjekke eller kræve. Står reglen om en ny udgave ikke ved siden af der, hvor den
hører hjemme på samme måde, så skriv i dine noter hvad du fandt. Ret kun de to filer ovenfor.

Kør `node tools/validate.mjs`. Advarslerne om `kontrakt-version` og `design-version` er ventede.
**Bump ingen af dem.**

## Hvad vi ikke rører

- Kontraktskabelonen og `AGENTS.md` i roden
- `design.md`, `design.css`, `eksempel.html` og `GUIDE.md`
- Alle andre rollefiler end de to
- `kontrakt-version`, `design-version`, `skabelon-version` og versionsnumrene i manifesterne
- `README.md`, `CHANGELOG.md`, `docs/BOARD.md` og beslutningsloggen

## Afhænger af

task-0024

## Beslutninger

- BESLUTTET: developers fund fra task-0024 bliver en opgave. Uden den mangler reglen i netop de to
  rollefiler, der har en konkret linje om bundlinjen. Det skal med før udgivelsen
- BESLUTTET: rollefilerne henviser til kontrakten og gentager ikke reglen. To steder med samme regel
  driver fra hinanden
- BESLUTTET: kun de to filer rettes. Andre steder developer finder, bliver afgjort ved lukningen

## Åbne punkter

## Indvendinger

---

## Developers noter

<Alt over denne overskrift ejes af architect. Alt herunder skrives kun af
developer, som aldrig retter i definitionen ovenfor.>

### Hvad er lavet

- `plugins/agents/agents/reviewer.md`: nyt stykke **En ny udgave uden Ctrl+F5** lige efter stykket om
  **Bundlinjen**, under punktet om designstandarden og med samme form. Det henviser til kontraktens
  `### En ny udgave uden Ctrl+F5`. Det gælder hvert projekt med en webflade, også uden `docs/design/`.
  Det er et fund når en fil appen selv leverer, har lang levetid på en adresse der ikke skifter med
  indholdet, eller når en side ikke svarer med `Cache-Control: no-cache`. Ordene er kontraktens egne.
  Det dækker punkt 1 og den ene halvdel af punkt 4 i `Færdig når`.
- `plugins/agents/skills/architect/SKILL.md`, listen i trin 1: nyt punkt **I drift, og appen leverer
  sine filer uden om reglen**, med henvisning til kontraktens underafsnit, med eller uden standarden:
  et emne. Det dækker punkt 2.
- `plugins/agents/skills/architect/SKILL.md`, efter stykket om bundlinjeopgaven: et tilsvarende
  stykke om opgaver der sætter en webflade op eller ændrer hvordan den leverer sine filer. Reglen
  fra kontraktens `### En ny udgave uden Ctrl+F5` skal stå i `Færdig når`. Det dækker punkt 3 og den
  anden halvdel af punkt 4. Ingen af de to filer gentager selve reglen. De henviser til
  underafsnittet og nævner kun det, rollen skal se efter.
- `node tools/validate.mjs` er grøn: `OK. 13 skills, 7 agenter, 63 markdown-filer, 29 farvepar, begge
  manifester paa version 1.5.0.` Det dækker punkt 5. Den gav **ingen** advarsler om `kontrakt-version`
  eller `design-version` i denne kørsel, selv om de var ventet. Intet stempel og intet versionsnummer
  er rørt.
- Der er intet nyt for brugeren i README. Der er ingen ny kommando og ingen ny indstilling.

Søgningen efter bundlinjen i de øvrige rollefiler under `plugins/agents/`. Jeg har ikke rettet nogen
af dem:

- `plugins/agents/skills/design/SKILL.md`, trin 2, linje 60–61. Blokken der skrives ind i projektets
  `CLAUDE.md`, nævner at bundlinjen er fast og henviser til `### Bundlinjen er fast`. Reglen om en
  ny udgave står ikke ved siden af, selv om den også gælder kopien af `design.css`. Det er det sted
  der ligner de to rettede mest.
- `plugins/agents/skills/design/SKILL.md`, trin 3, linje 65. Emnet om at appen skal bruge
  standardens stylesheet, "direkte eller kopieret ind ved build", nævner ikke at filen skal leveres
  efter reglen om en ny udgave. Det er netop det emne der fører til en opgave, som "sætter en
  webflade op". Architect fanger det nu via sin egen fil, når opgaven skrives. Emnet på BOARD siger
  det dog ikke.
- `plugins/agents/skills/update/SKILL.md`, linje 186. Teksten siger at nye regler for bundlinjen
  kommer med kontrakten og ikke med standarden. Det samme gælder reglen om en ny udgave, men den
  nævnes ikke. Det er en fortællende sætning og ikke en pligt til at tjekke noget. Jeg vurderer at den
  hører mindre hjemme end de to ovenfor.
- `plugins/agents/skills/mockup/SKILL.md`, linje 79. Skitsen viser bundlinjen. Reglen om en ny udgave
  hører ikke hjemme her: skitsen er én fil uden server, så den leverer ingen filer.
- `developer.md`, `tester.md`, `security.md` og de øvrige agenter nævner ikke bundlinjen. Der er
  intet at holde reglen op imod.
- `design.md` (linje 172) nævner bundlinjereglen, men den er designstandarden og ikke en rollefil.
  Opgaven siger at den ikke må røres.

### Hvad er ikke lavet, og hvorfor

intet

### Uklart

- Architect-filen siger at en opgave om bundlinjen har reglerne "ét punkt pr. regel" i `Færdig når`. Jeg har ikke
  skrevet det samme om reglen om en ny udgave. Den består af to måder at gøre det på, som man vælger
  imellem, og tre faste punkter. At splitte den op ét punkt pr. regel ville være min fortolkning.
  Kontrakten siger kun "har reglen om en ny udgave i `Færdig når`", og det har jeg fulgt. Skal
  architect-filen bede om ét punkt pr. regel, eller om efterprøvningen fra underafsnittet, er det en
  rettelse af én sætning.
- Proxyens *Cache Assets* er ikke med i reviewers fund. Opgaven nævner kun de to fund, og reviewer kan
  ikke se proxyens opsætning fra repoet.
