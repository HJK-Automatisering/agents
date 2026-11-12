---
nummer: task-0022
titel: Bundlinjen står i venstre side, men skal stå centreret
status: afsluttet
kilde: interview
oprettet: 2026-11-12
---

# task-0022 — Bundlinjen står i venstre side, men skal stå centreret

## Hvad og hvorfor

Bundlinjen er venstrestillet i hver løsning, der bruger designstandarden. Det samme gælder
eksempelsiden og skitserne fra `mockup`, fordi standardens stylesheet ikke siger andet. Mennesket
vil have den centreret. Det skal gælde i alle webløsninger, også dem der ikke bruger standarden.
Derfor skal kravet stå i kontraktens regel om bundlinjen, og ikke kun i standarden.

## Færdig når

- [ ] Kontraktskabelonens regel om bundlinjen siger at den står centreret, nederst på hver side, i alle webløsninger
- [ ] Standardens stylesheet centrerer bundlinjen, og intet andet ved komponenten ændres
- [ ] Standardens dokument beskriver bundlinjen som centreret
- [ ] `GUIDE.md` siger det samme som kontrakten, der hvor den beskriver bundlinjen
- [ ] Ingen anden fil i plugin'et beskriver bundlinjen på en måde der modsiger det
- [ ] Repoets kontrol er grøn, bortset fra de to ventede advarsler om `kontrakt-version` og `design-version`

## Sådan bygger vi det

**1. Kontraktskabelonen**, `plugins/agents/skills/kickoff/AGENTS.md`, under `### Bundlinjen er fast`.
Den første fede sætning siger *"Hver webløsning viser bundlinjen nederst på hver side."* Skriv at
den står centreret. Det skal stå i reglen selv, fordi den også gælder projekter uden standarden.
Rør ikke den faste tekst i citatet eller tabellen.

**2. Stylesheetet**, `plugins/agents/skills/design/assets/design.css`, `.hjk-footer`: tilføj
`text-align: center`. Intet andet i komponenten skal ændres.

**3. Standardens dokument**, `plugins/agents/skills/design/design.md`, under `### Bundlinje`: punktet
*"Lille, dæmpet tekst med en tynd linje over."* skal også sige centreret.

**4. `GUIDE.md`**, afsnittet `**Bundlinjen er fast, i hver webløsning**` under `## Designstandard`:
sig at den står centreret nederst. Det skal være kort, i samme sætning eller lige efter.

**5. Søg** i `plugins/agents/` efter andre beskrivelser af hvordan bundlinjen ser ud eller placeres,
fx i `mockup`, `reviewer` og `design/SKILL.md`. Er der nogen der modsiger *centreret*, så ret dem.
Beskriver de kun teksten og værdierne, skal de ikke røres. Skriv i dine noter hvad du fandt.

`eksempel.html` bruger stylesheetet og skal ikke rettes, medmindre den selv sætter en justering
på bundlinjen.

Kør `node tools/validate.mjs`. Den vil advare om at skabelonen og standarden har flyttet sig uden
at stemplerne fulgte med. Det er ventet. **Bump ikke** `kontrakt-version` eller `design-version`;
det beslutter mennesket, når opgaven lukkes.

Det visuelle kræver øjne. Start ikke en browser. Skriv i dine noter at det ikke er efterprøvet
visuelt, så åbner mennesket `eksempel.html`.

## Hvad vi ikke rører

- Bundlinjens tekst, nøgler og værdiernes kilde
- De andre komponenter i stylesheetet
- `AGENTS.md` i roden. Det er repoets egen kontrakt og opdateres for sig
- `kontrakt-version`, `design-version`, `skabelon-version` og versionsnumrene i manifesterne
- Hooken, opdateringskaldet, `README.md`, `CHANGELOG.md`, `docs/BOARD.md` og beslutningsloggen

## Afhænger af

intet

## Beslutninger

- BESLUTTET: centreringen står også i kontraktens regel, ikke kun i standarden. Den skal gælde i
  alle webløsninger. Imod: et bump af `kontrakt-version`, så alle projekter skal køre
  `/agents:update`. Afvist: kun i standarden. Mennesket valgte
- BESLUTTET: kun teksten centreres. Linjen over og baggrunden går stadig i fuld bredde, som i dag
- BESLUTTET: bumpene af `kontrakt-version` og `design-version` tilbydes når opgaven lukkes, ikke af
  developer. Begge er menneskets beslutning
- BESLUTTET: `GUIDE.md` rettes i samme opgave. Den gengiver reglen, og den ville ellers sige noget
  andet end kontrakten

## Åbne punkter

## Indvendinger

---

## Developers noter

<Alt over denne overskrift ejes af architect. Alt herunder skrives kun af
developer, som aldrig retter i definitionen ovenfor.>

### Hvad er lavet

Gren `task-0022-center-footer`, tre commits: `b1dc003`, `88dc800`, `b7e7328`.

- **Kontraktskabelonen**, `plugins/agents/skills/kickoff/AGENTS.md`, `### Bundlinjen er fast`: den
  første fede sætning lyder nu *"Hver webløsning viser bundlinjen centreret, nederst på hver side."*
  Citatet, tabellen og punkterne under er urørte. (`b1dc003`)
- **Stylesheetet**, `plugins/agents/skills/design/assets/design.css`, `.hjk-footer`: `text-align: center`
  er tilføjet som sidste egenskab. Intet andet i komponenten er ændret. `border-top` og `background`
  sidder stadig på hele elementet, så linjen og baggrunden går i fuld bredde. (`88dc800`)
- **Standardens dokument**, `plugins/agents/skills/design/design.md`, `### Bundlinje`: punktet lyder nu
  *"Lille, dæmpet og centreret tekst med en tynd linje over."* (`88dc800`)
- **`GUIDE.md`**, `**Bundlinjen er fast, i hver webløsning**`: sætningen om teksten slutter nu med
  *", centreret nederst."* (`b7e7328`)
- **Søgning i `plugins/agents/`** efter bundlinje, footer og justeringsord. Intet modsiger *centreret*:
  - `skills/mockup/SKILL.md` l. 79: siger *nederst* og henviser til markup i `design.md`. Skitsen
    bruger standardens stylesheet og bliver derfor centreret af sig selv. Ikke rørt.
  - `agents/reviewer.md` l. 39 og `skills/architect/SKILL.md` l. 99-101: holder bundlinjen op mod
    kontraktens regel. Det dækker nu også centreringen. Ikke rørt.
  - `skills/design/SKILL.md` l. 2, 34-35, 60-68: beskriver kun tekst, indstillinger og at den er
    fast. Ikke rørt.
  - `skills/update/SKILL.md` l. 186: beskriver at nye regler for bundlinjen kommer med kontrakten.
    Ikke rørt.
  - `skills/kickoff/AGENTS.md` l. 387-406: nævner hvem der gør hvad, ikke placering. Ikke rørt.
  - `skills/design/assets/eksempel.html`: sætter ingen justering på `.hjk-footer`. Den eneste
    egne regel på bundlinjen er `.hjk-footer__link.eksempel-fokus` med `border-radius`. Ikke rørt.
- `node tools/validate.mjs`: `OK`, exit 0, med de to ventede advarsler. Den ene gælder
  `kontrakt-version`, der står på 24 i skabelonen. Den anden gælder `design-version`, der står på 2.
  Ingen af dem er bumpet.
- Ingen ny kommando eller indstilling. Intet nyt til `README.md`.

### Hvad er ikke lavet, og hvorfor

- **Ikke efterprøvet visuelt.** Der er ikke startet en browser, jf. opgaven og kontrakten. Mennesket
  skal åbne `plugins/agents/skills/design/assets/eksempel.html` og se at alle fire bundlinjer er
  centreret i både lys og mørk, og at linjen over stadig går i fuld bredde.
- `kontrakt-version` og `design-version` er ikke bumpet. Det er udeladt med vilje, efter opgaven.

### Uklart

intet
