---
nummer: task-0016
titel: Hooken, opdateringen og kontrollen kender ikke designstandardens stempel
status: i-gang
kilde: interview
oprettet: 2026-11-12
---

# task-0016 — Hooken, opdateringen og kontrollen kender ikke designstandardens stempel

## Hvad og hvorfor

`/agents:design` lægger en kopi af designstandarden i projektets `docs/design/`, med
`design-version` i `design.md`. Ændres standarden i plugin'et, opdager projektet det aldrig:
hooken siger intet, `/agents:update` kender ikke kopien, og kontrollen i dette repo advarer
ikke når standarden ændres uden at stemplet bumpes. Kontrakten og workflowene har alle tre
dele i forvejen; standarden skal have det samme, før den ændres første gang.

## Færdig når

- [ ] Starter en session i et projekt hvis kopi af standarden har et lavere stempel end plugin'ets, siger hooken det, med begge numre og `/agents:update` som vejen videre
- [ ] Hooken siger intet om standarden i et projekt uden `docs/design/`, eller når stemplerne er ens, eller når plugin'ets er lavere
- [ ] `/agents:update` bringer projektets tre filer i `docs/design/` ajour når plugin'ets stempel er højere, med en filkopi, og rører dem ikke ellers
- [ ] `/agents:update` stopper og viser det, før den skriver, hvis der er ucommittede ændringer i `docs/design/`, eller hvis `design.md` mangler mens de andre filer findes
- [ ] `/agents:update` fortæller i almindeligt dansk hvad der er ændret i standarden, og om projektet skal gøre noget
- [ ] Kontrollen i dette repo advarer når standardens kopierede filer er ændret siden sidste udgivelse uden at `design-version` er bumpet, på samme måde som for workflowenes stempel
- [ ] Dokumenterne der forklarer stemplerne, nævner standardens
- [ ] Hooken består `node --check`, og repoets kontrol er grøn

## Sådan bygger vi det

Mønstret findes i forvejen tre steder. Gør det samme for standarden, og opfind ikke noget nyt.

**Hooken**, `plugins/agents/hooks/detect-project-zero.cjs`: efter tjekket af workflowene. Plugin'ets
dokument er `skills/design/design.md` ved siden af hooken, projektets er `docs/design/design.md`.
Feltet er `design-version`. Beskeden skrives som `kontraktBagud`: kort, med begge numre, og
`/agents:update`. Den må ikke fortrænge beskeden om `.gitignore`.

**`/agents:update`**, `plugins/agents/skills/update/SKILL.md`:

- Tabellen øverst får en tredje række: `docs/design/`, lagt ind af `design`, stempel
  `design-version` i `docs/design/design.md`.
- En ny `## Del 3 — designstandarden` efter workflowene. Plugin'ets filer ligger i søsterskillen
  `design`, fra denne mappe `../design/`. De tre filer og deres destinationer står i
  `../design/SKILL.md`; læs dem dér frem for at skrive dem af.
- Kun når plugin'ets stempel er højere. Lavere eller ens: sig det og stop med den del, som for de
  to andre.
- Ucommittede ændringer i `docs/design/`: stop og vis dem. Kopien rettes aldrig ifølge standardens
  eget dokument, så committede ændringer overskrives; de står i git-historikken, og det siger
  du i rapporten. `design.md` mangler, men andre filer findes: udgaven er ukendt — stop og sig det.
- Alle tre filer kopieres uændret, også dem der ikke er ændret.
- Rapporten siger hvad der er nyt i standarden, ud fra forskellen mellem de to `design.md`, og
  peger på hvad appens eget stylesheet eller bundlinje skal have rettet.
- `docs/design/` kommer på listen over mapper der oprettes efter behov, så et projekt uden
  standarden ikke giver en forskel.
- `## Du må ikke` nævner de tre filer blandt det kaldet må skrive.

**Kontrollen**, `tools/validate.mjs`: en advarsel efter afsnit 12, bygget som den. Den holder
`design.md` og alt under `assets/` op mod sidste udgivelse; `SKILL.md` kopieres ikke og tæller
ikke med. Ændret uden at `design-version` er højere: advarsel, ikke fejl.

**Dokumenterne:** `CLAUDE.md` i roden, reglen om at skabelonerne har deres eget stempel —
standarden har også et, og bumpet er menneskets. `PLUGIN.md`, hvor stemplerne og kontrollens
advarsler står. `GUIDE.md`, hvor `/agents:update` beskrives.

## Hvad vi ikke rører

- Designstandardens filer, og `design-version`, som står på 1
- Kontrakten, `mockup`, `reviewer` og `architect` — det er task-0017
- Hookens øvrige tjek og beskeder
- Del 1 og 2 i `/agents:update`, ud over tabellen, listen over mapper og `## Du må ikke`
- Versionsnumrene i begge manifester

## Afhænger af

task-0015

## Beslutninger

- BESLUTTET: samme mønster som kontrakten og workflowene — det er hvad brugerne og rollerne kender i forvejen
- BESLUTTET: committede rettelser i kopien overskrives ved opdatering, ucommittede stopper den. Standardens dokument siger at kopien aldrig rettes, og git har den gamle udgave. Afvist: at sammenligne med den udgave projektet fik, som ikke findes nogen steder
- BESLUTTET: kontrollen advarer, den fejler ikke — samme styrke som for workflowenes stempel; bumpet er menneskets

## Åbne punkter

## Indvendinger

---

## Developers noter

<Alt over denne overskrift ejes af architect. Alt herunder skrives kun af
developer, som aldrig retter i definitionen ovenfor.>

### Hvad er lavet

Commits på `task-0016-design-stamp`: `bc9d5e8` (planlægningen, status `i-gang`), `d2a2d61` (hooken), `2112080` (`/agents:update`), `756ed6f` (kontrollen), `f94147f` (dokumenterne).

- **Hooken siger til når standarden er bagud** — `plugins/agents/hooks/detect-project-zero.cjs`. Nyt tjek 5 efter de to workflow-tjek: læser `design-version` i projektets `docs/design/design.md` og i `skills/design/design.md` ved siden af hooken, med samme `getVersion` som de andre. Ny besked `designBagud(vProjekt, vPlugin)`, skrevet som `kontraktBagud`: `DESIGNSTANDARDEN ER BAGUD. Projektets docs/design/design.md er version N; plugin'et har version M.`, og `/agents:update` som vejen videre. `.gitignore`-tjekket er nu nummer 6 og kommer stadig sidst, så det ikke fortrænges. Hovedkommentaren er rettet fra fem til seks tjek.
  Afprøvet med SessionStart-nyttelast mod engangsmapper i scratchpad (AGENTS.md, .gitignore, docs/design/design.md) og en engangskopi af plugin'et med `design-version: 2`, da plugin'et selv står på 1. Mapperne er slettet bagefter.

  | Projektets kopi | Plugin | Resultat |
  |---|---|---|
  | 1 | 2 | beskeden, med begge numre |
  | intet stempel (regnes som 1) | 2 | beskeden |
  | 1, uden `.gitignore` | 2 | beskeden, og `.gitignore`-advarslen efter den |
  | 2 | 2 | intet |
  | 5 | 2 | intet |
  | ingen `docs/design/` | 2 | intet |
  | kun `design.css`, ingen `design.md` | 2 | intet |
  | samme som plugin, mod det rigtige plugin (1) | 1 | intet |

- **`/agents:update` kender standarden** — `plugins/agents/skills/update/SKILL.md`.
  - Tabellen øverst har en tredje række: `docs/design/`, lagt ind af `design`, stempel `design-version` i `docs/design/design.md`. Indledningen siger "tre slags" og rækkefølgen kontrakt, workflows, designstandard.
  - Under `## Find plugin'ets filer`: standarden ligger i `../design/`, og filerne og deres destinationer læses i tabellen i `../design/SKILL.md`. Søgefaldet nævner `*/skills/design/SKILL.md`.
  - Ny `## Del 3 — designstandarden` med fire trin. 1: findes ingen af de tre filer, er der intet at gøre; mangler `design.md` mens andre findes, er udgaven ukendt, og den stopper uden at skrive. 2: kun når plugin'ets stempel er højere, og manglende stempel er 1. Ens eller lavere: sig begge numre og stop med delen. 3: `git status --porcelain -- docs/design/`; står der noget, stopper den før den skriver og viser det. Committede ændringer overskrives, med begrundelsen fra standardens dokument. 4: alle tre filer kopieres uændret med en filkopi, også de uændrede. Bagefter viser `git diff -- docs/design/design.md` hvad der er nyt, fordi trin 3 sikrede at mappen var ren.
  - `## Rapportér hvad der ændrede sig` har et nyt afsnit: hvad der er nyt i standarden ud fra forskellen mellem de to `design.md`, hvad appens eget stylesheet eller bundlinje skal have rettet, og at committede rettelser i kopien nu kun står i git-historikken.
  - `docs/design/` står på listen over mapper der oprettes efter behov (del 1, trin 4).
  - `## Du må ikke` nævner `design.md`, `design.css` og `eksempel.html` i `docs/design/` blandt det kaldet må skrive, og har et nyt punkt: ingen skrivning i `docs/design/` ved ucommittede ændringer, eller når `design.md` mangler.
  - `description` i frontmatter nævner designstandarden.
- **Kontrollen advarer** — `tools/validate.mjs`, nyt afsnit 14 efter afsnit 12. Det er bygget som 12: `design.md` og hver fil direkte under `assets/` holdes op mod `BASE_REF` (standard `origin/main`) med `fraBase`. Er `design-version` den samme, og er en af filerne ændret eller ny, kommer en advarsel, ikke en fejl. `SKILL.md` tæller ikke med. Nummeret er 14, fordi 13 allerede er kontrasttjekket.
  Afprøvet med midlertidige ændringer, der er rullet tilbage med `git checkout` bagefter. En ændret `design.css` uden bump gav advarslen. Samme ændring med `design-version` bumpet gav ingen. En ændret `SKILL.md` alene gav heller ingen.
- **Dokumenterne:**
  - `CLAUDE.md` har en ny regel under `## Regler der gælder her`: standarden har sit eget stempel, bumpet er menneskets, og kontrollen advarer.
  - `PLUGIN.md`: træet siger at `update/` også tager designstandarden. Under `## Kontrakten driver` er der et nyt afsnit om standarden som kopi, hook og `update`, og "de to stempler" er blevet til "de tre". I tabellen `### Hvilket nummer` står `design-version` ved siden af de to andre stempler som minor.
  - `GUIDE.md` under `## Designstandard`: sætningen om at `/agents:update` endnu ikke henter en nyere kopi er erstattet af et afsnit med hookens besked, hvad `/agents:update` gør, og at ucommittede ændringer stopper den.
- **Til README**, hvis `architect` vil have det med: der er ingen ny kommando og ingen ny indstilling. `/agents:update` tager nu også designstandarden, og hooken har en ny besked, `DESIGNSTANDARDEN ER BAGUD`.
- `node --check plugins/agents/hooks/detect-project-zero.cjs` er grøn. `node tools/validate.mjs` er grøn uden advarsler: `OK. 13 skills, 7 agenter, 55 markdown-filer, 29 farvepar, begge manifester paa version 1.3.0.`
- Intet versionsnummer er bumpet: hverken manifesterne, `kontrakt-version` eller `design-version`.

### Hvad er ikke lavet, og hvorfor

- `GUIDE.md` linje 150, oversigten over hjælpekaldene, siger stadig at `/agents:update` "bringer projektets kontrakt ajour". Jeg lod den stå. Den nævner heller ikke workflows, og afsnittet `## Designstandard` siger nu det der skal siges. Vil `architect` have den med, er det én sætning.
- Fund uden for opgaven, ikke rettet:
  1. Kontraktskabelonen, `plugins/agents/skills/kickoff/AGENTS.md`, linje 38: rolletabellen siger at `update` afleverer "opdateret kontrakt og opdaterede workflow-kopier". Designstandarden er ikke nævnt. Kontrakten hører under task-0017 og var uden for denne opgave. En rettelse er en regelændring, så den kræver et bump af `kontrakt-version`.
  2. `GUIDE.md` linje 91 siger at man uden Node "mister de tre automatiske tjek". Hooken havde fem tjek før denne opgave, og nu seks. Tallet var allerede forkert før.

### Uklart

- I `/agents:update` har jeg også rettet `description` i frontmatter og indledningen ("tre slags", rækkefølgen af delene). Opgaven nævner kun tabellen. Rettelserne ligger uden for del 1 og 2, men sig til hvis indledningen skulle have været urørt.
- Del 3, trin 3: når der er ucommittede ændringer, siger kaldet at opdateringen først kan køre når de er committet eller kasseret, og at valget er menneskets. Opgaven siger kun "stop og vis dem". Den sidste sætning er min. Den lægger ingen ny handling ind, men siger hvad der skal ske før næste forsøg.
- Del 3 regner et manglende `design-version` i projektets kopi som version 1, som for kontrakten og workflowene, og som hookens `getVersion` gør. Opgaven siger det ikke udtrykkeligt.
