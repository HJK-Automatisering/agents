---
nummer: task-0024
titel: En ny udgave af et stylesheet kræver Ctrl+F5, før browseren bruger den
status: afsluttet
kilde: interview
oprettet: 2026-11-13
---

# task-0024 — En ny udgave af et stylesheet kræver Ctrl+F5, før browseren bruger den

## Hvad og hvorfor

Når en app udgives med et nyt stylesheet, bliver browseren ved med at vise det gamle, indtil
brugeren trykker Ctrl+F5. Ingen regel i kontrakten siger hvordan en app skal levere sine filer.
Designstandarden viser kun `<link rel="stylesheet" href="design.css">`. Mennesket vil sikre at
browseren af sig selv henter den nye udgave. Det gælder alle webløsninger og alle deres egne filer,
ikke kun standardens. Derfor hører reglen i kontrakten.

## Færdig når

- [ ] Kontraktskabelonen har en regel om at hver webløsning leverer sine stylesheets og scripts, så en ny udgave bruges ved næste almindelige sidevisning, uden Ctrl+F5
- [ ] Reglen siger præcis hvilke to måder der er tilladt, og hvad der aldrig må ske
- [ ] Reglen gælder også selve siderne, så en side aldrig peger på en gammel fil fra browserens lager
- [ ] Reglen siger hvordan `developer` efterprøver den med almindelige HTTP-kald, uden en browser
- [ ] *Hvem gør hvad* i afsnittet om webflader giver pligten til `architect`, `developer` og `reviewer`, ligesom for bundlinjen
- [ ] Standardens dokument henviser til reglen der hvor det viser hvordan stylesheetet kobles på
- [ ] `GUIDE.md` nævner reglen kort under designstandarden
- [ ] Repoets kontrol er grøn, bortset fra de ventede advarsler om stemplerne

## Sådan bygger vi det

**1. Kontraktskabelonen**, `plugins/agents/skills/kickoff/AGENTS.md`, under
`## Webflader og designstandarden`. Skriv et nyt underafsnit, `### En ny udgave uden Ctrl+F5`, efter
`### Bundlinjen er fast`. Skriv også en fed linje om reglen øverst i afsnittet, som linjen om
bundlinjen, så den kan findes. Reglen gælder hver webløsning, med eller uden standarden, og hver
fil appen selv leverer: stylesheets, scripts, også kopien af `design.css`.

Indholdet:

- **En af to måder, og ikke andre:**
  1. **Adressen skifter med indholdet.** Filens navn eller adresse bærer et fingeraftryk af
     indholdet, typisk en hash, som stakken sætter ved build. Så må filen gemmes længe.
  2. **Browseren spørger hver gang.** Svaret har `Cache-Control: no-cache` og enten `ETag` eller
     `Last-Modified`. Så spørger browseren serveren før hver brug, og får `304` uden indhold, når
     filen er den samme.
- **Det må aldrig ske:** en lang levetid (`max-age` over nul eller `immutable`) på en adresse der
  ikke skifter med indholdet.
- **Selve siderne** svarer med `Cache-Control: no-cache`, så en side aldrig peger på en gammel
  adresse fra browserens lager.
- **Proxyen må ikke gemme filerne.** I Nginx Proxy Manager står *Cache Assets* på *Fra*, som
  `NGINX-PROXY-MANAGER.md` allerede siger. Henvis dertil.
- **Efterprøvning:** et HTTP-kald mod appens egen server viser svarets `Cache-Control` for en side og
  for et stylesheet. Ved den anden måde viser et nyt kald med `If-None-Match` eller
  `If-Modified-Since` et `304`. Henvis til `## Efterprøvning af en webflade`.

Skriv det kort, i kontraktens tone. Nævn intet framework, og brug ingen navne på systemer.

**2. *Hvem gør hvad*** i samme afsnit:

- `architect` skriver reglen ind i `Færdig når`, i den opgave der sætter en webflade op eller ændrer
  hvordan den leverer sine filer. Mangler en app i drift reglen, bliver det et emne
- `developer` bygger det og efterprøver det med HTTP-kald
- `reviewer` melder det som fund, når en fil har lang levetid på en adresse der ikke skifter

Flet det ind i de punkter der står der, i stedet for at skrive nye punkter ved siden af.

**3. Standardens dokument**, `plugins/agents/skills/design/design.md`, under
`## Sådan kobles den på`: én sætning om at appen skal levere `design.css` efter kontraktens regel,
med henvisning til underafsnittet. Gentag ikke reglen.

**4. `GUIDE.md`**, under `## Designstandard`: én kort sætning eller et kort stykke om at en ny
udgave af appens stylesheets skal virke uden Ctrl+F5, og at reglen står i kontrakten.

Kør `node tools/validate.mjs`. Den vil advare om `kontrakt-version` og `design-version`. Det er
ventet. **Bump ingen af dem**; det beslutter mennesket ved lukningen.

## Hvad vi ikke rører

- `design.css` og `eksempel.html`
- `NGINX-PROXY-MANAGER.md`. Den siger allerede det rigtige
- `AGENTS.md` i roden
- `kontrakt-version`, `design-version`, `skabelon-version` og versionsnumrene i manifesterne
- `README.md`, `CHANGELOG.md`, `docs/BOARD.md` og beslutningsloggen

## Afhænger af

task-0023. Begge ændrer `design.md`, og der bygges kun på én opgave ad gangen

## Beslutninger

- BESLUTTET: reglen står i kontrakten, ikke kun i standarden. Den gælder hver webløsning og hver fil
  appen leverer, også dem uden standarden
- BESLUTTET: to tilladte måder, fingeraftryk i adressen eller `no-cache` med en validator. Det er
  etableret praksis. Fingeraftrykket kræver et build-trin, som ikke alle stakke har, og `no-cache`
  virker uden. Afvist: kun `?v=<version>` på adressen. Versionen skifter ikke under udvikling, og
  ikke når en fil ændres uden en ny udgivelse
- BESLUTTET: siderne selv er `no-cache`. Ellers kan en gemt side pege på en gammel adresse, og
  fingeraftrykket hjælper ikke
- BESLUTTET: proxyen er dækket af den guide der findes. Der kommer ingen ny opsætning
- BESLUTTET: `kontrakt-version` og `design-version` bumpes ikke af developer. De tilbydes ved
  lukningen og er menneskets beslutning

## Åbne punkter

## Indvendinger

---

## Developers noter

<Alt over denne overskrift ejes af architect. Alt herunder skrives kun af
developer, som aldrig retter i definitionen ovenfor.>

### Hvad er lavet

Gren: `task-0024-stylesheets-without-hard-reload`, tre commits (`e00d4de`, `1cf876f`, `b25ac1e`).

- **Regel i kontraktskabelonen** — `plugins/agents/skills/kickoff/AGENTS.md`, nyt underafsnit
  `### En ny udgave uden Ctrl+F5` efter `### Bundlinjen er fast`. Gælder hver webløsning og hver fil
  appen selv leverer: stylesheets, scripts og kopien af `design.css`.
- **De to tilladte måder og forbuddet** — samme sted: fingeraftryk i adressen, eller
  `Cache-Control: no-cache` med `ETag` eller `Last-Modified`. Aldrig `max-age` over nul eller
  `immutable` på en adresse der ikke skifter med indholdet. Under den første måde står én sætning om
  at et versionsnummer på adressen ikke er et fingeraftryk. Den er taget fra det afviste alternativ
  under `## Beslutninger`, så `?v=<version>` ikke læses som den første måde.
- **Siderne selv** — samme sted: siderne svarer med `Cache-Control: no-cache`.
- **Proxyen** — samme sted: *Cache Assets* på *Fra*, med henvisning til `NGINX-PROXY-MANAGER.md`.
  Guiden er ikke rørt.
- **Efterprøvning med HTTP-kald** — samme sted, med henvisning til `## Efterprøvning af en webflade`:
  `Cache-Control` på en side og på et stylesheet. Ved den første måde peger siden på adressen med
  fingeraftrykket. Ved den anden giver et nyt kald med `If-None-Match` eller `If-Modified-Since`
  `304` uden indhold.
- **Fed linje øverst i afsnittet** — i `## Webflader og designstandarden`, efter linjen om bundlinjen,
  med henvisning til underafsnittet.
- ***Hvem gør hvad*** — flettet ind i de eksisterende punkter for `architect`, `developer` og
  `reviewer`. Der er ingen nye punkter. `mockup`s punkt er ikke rørt.
- **Standardens dokument** — `plugins/agents/skills/design/design.md`, under `## Sådan kobles den på`:
  én sætning efter kodeblokken, med henvisning til underafsnittet. Reglen er ikke gentaget.
- **`GUIDE.md`** — under `## Designstandard`: et kort stykke efter afsnittet om at kaldet ikke selv
  kobler standarden på.
- **Kontrol** — `node tools/validate.mjs` slutter med `OK` og exit 0. Den giver de to ventede
  advarsler om `kontrakt-version` (25) og `design-version` (3). Ingen af dem er bumpet.

Til README: ingen ny kommando eller indstilling.

### Hvad er ikke lavet, og hvorfor

intet

### Uklart

- **Fund, uden for opgaven:** `plugins/agents/agents/reviewer.md` (linje 39) og
  `plugins/agents/skills/architect/SKILL.md` (linje 101) henviser begge til
  `### Bundlinjen er fast` med en konkret instruktion. De nævner ikke den nye regel. Kontraktens
  *Hvem gør hvad* dækker pligten, men rollefilerne er uens nu: bundlinjen har en linje i begge, og
  den nye regel har ingen. Jeg har ikke rettet dem, for de står ikke i opgaven. Architect afgør om
  det skal være en opgave.
