---
nummer: task-0009
titel: Hooken og kickoff kender en mappe der kun har skitser
status: i-gang
kilde: interview
oprettet: 2026-10-13
---

# task-0009 — Hooken og kickoff kender en mappe der kun har skitser

## Hvad og hvorfor

En konsulent der laver en skitse i en tom mappe (task-0008), får ved hver
sessionsstart hookens `PROJEKT NUL`-besked: *gå ikke i gang med at skrive
filer, kør kickoff*. Midt i et møde er det den forkerte besked. Og når
`kickoff` senere køres, ved den ikke at mødet allerede har besvaret en del af
det interviewet spørger om — så går det tabt netop dér hvor det er mest værd.

## Færdig når

- [ ] I en mappe hvor der kun ligger skitser, siger hooken at der ligger en skitse, og at `kickoff` kan køres når man er klar — ikke at man ikke må skrive filer
- [ ] I en helt tom mappe siger hooken præcis det samme som i dag
- [ ] I et projekt der er sat op, siger hooken intet nyt om skitser
- [ ] En fejl undervejs får stadig hooken til at tie helt
- [ ] `kickoff` regner stadig en mappe med kun skitser som et tomt projekt og kører hele processen
- [ ] `kickoff` læser skitsernes noter før interviewet og bruger dem som udgangspunkt, så det mødet allerede har besvaret, ikke spørges om igen
- [ ] `kickoff` sætter skitserne til behandlet, når deres indhold er brugt i projektets dokument eller er blevet emner på BOARD
- [ ] `.gitignore` findes stadig før noget bliver committet, og skitserne kommer med i den første commit
- [ ] Vedligeholdelsesdokumentet beskriver hookens nye besked
- [ ] Kontrollen er ren
- [ ] Intet versionsnummer er ændret

## Sådan bygger vi det

**Hooken, `plugins/agents/hooks/detect-project-zero.cjs`.** Projekt nul
afgøres i dag af `hasDocs`, `hasClaude`, `hasKontrakt` og antallet af commits.
`docs/mockups/` tæller ikke med i `hasDocs`, og det skal blive sådan. Inden for
projekt nul-grenen: findes der mindst én mappe under `docs/mockups/` med en
`NOTER.md`, skrives en ny besked i stedet for `PROJEKT_NUL`. Beskeden følger
de øvrige beskeders form.

**`kickoff`, `plugins/agents/skills/kickoff/SKILL.md`.** Under *A. Tomt
projekt*: skitser under `docs/mockups/` gør ikke projektet ikke-tomt. Findes
der skitser, læses deres `NOTER.md` før første spørgsmål. Det de besvarer,
bruges som udkast og bekræftes frem for at blive spurgt om forfra. Det de ikke
besvarer, interviewes som i dag.

Rækkefølgen i trin 6 — `git init`, så `.gitignore`, så resten — står fast.
Skitserne ligger allerede på disken, men intet er committet før `.gitignore`
findes.

`kickoff` skriver i dag ikke rapporter. At sætte en skitses status er en ny
ting den må; skriv det ind under dens mandat, så det ikke læses som et brud på
*Du må ikke*.

## Hvad vi ikke rører

- Hookens øvrige tjek og deres beskeder
- `kickoff`s tilfælde B og C
- Emnet om hookens navn og tællingen af dens tjek — det står på BOARD som sit eget
- Versionsnumre

## Afhænger af

task-0008

## Beslutninger

- BESLUTTET: en mappe med kun skitser er stadig projekt nul — kickoff skal køre hele processen, og hooken skal kun ændre tone, ikke tilstand
- BESLUTTET: `kickoff` bruger skitsens noter som udkast, ikke som svar — slutbrugerens reaktioner er ikke det samme som en beslutning om projektet
- BESLUTTET: `kickoff` lukker skitserne i tilfælde A. Der findes ingen `architect`-tråd endnu, og en skitse der står `klar til behandling` på et nyt BOARD, er et fund der allerede er brugt

## Åbne punkter

## Indvendinger

---

## Developers noter

<Alt over denne overskrift ejes af architect. Alt herunder skrives kun af
developer, som aldrig retter i definitionen ovenfor.>

### Hvad er lavet

- **Skitser i en mappe der ellers er projekt nul** — `plugins/agents/hooks/detect-project-zero.cjs`. Ny hjælper `skitser()` lister mapper under `docs/mockups/` med en `NOTER.md`. Inden for projekt nul-grenen skrives den nye besked `skitseUdenProjekt()` (overskrift `SKITSER, INTET PROJEKT ENDNU`, liste over skitserne, at det er forventet, at `/agents:kickoff` kan køres når brugeren er klar, og at `git init` og `.gitignore` stadig kommer før første commit). Ingen sætning om ikke at skrive filer. `hasDocs` er urørt, så `docs/mockups/` tæller stadig ikke. Kommentaren øverst nævner varianten under tjek 1; antallet af tjek er urørt.
- **Helt tom mappe** — afprøvet: output er byte for byte identisk med hooken på `main`. Det samme gælder en mappe hvor `docs/mockups/` findes uden en `NOTER.md`, og hvor `docs/mockups` er en fil.
- **Opsat projekt med en skitse** (AGENTS.md, CLAUDE.md, docs/projekt.md, .gitignore, én commit) — afprøvet: intet output, identisk med `main`.
- **Fejl giver stilhed** — `skitser()` returnerer kun tom liste ved `ENOENT`/`ENOTDIR`; alle andre fejl kastes til den yderste `catch`, som tier. Afprøvet ved at lade `readdirSync` kaste `EACCES` og ved at lade `isDirectory()` kaste: 0 bytes, exit 0. Ugyldig stdin falder tilbage til `process.cwd()` som før.
- Desuden afprøvet: to skitser (listes sorteret), og `git init` uden commits plus skitse (ny besked).
- **kickoff regner skitser som tomt projekt** — `plugins/agents/skills/kickoff/SKILL.md`, *Afgør situationen først* og *A. Tomt projekt*: skitser tæller ikke med, og en mappe med kun skitser er tilfælde A med hele processen.
- **kickoff læser noterne før interviewet** — nyt afsnit *Ligger der skitser* under tilfælde A: læs hver `NOTER.md` før første spørgsmål; det de besvarer er udkast der bekræftes eller rettes; ubekræftede gæt er ikke svar; resten interviewes som i dag. Bekræftelsen følger kontraktens spørgeform.
- **kickoff sætter skitserne til behandlet** — samme afsnit: når hver reaktion, hvert fravalg og hvert åbent punkt står i `docs/projekt.md` eller er blevet et emne under `## Kommende`. Kun `status`-feltet rettes. Skrevet ind under *Mandat* som det eneste sted kickoff skriver i en rapport. Tilføjet til *Output*, og under *Commits* at ændringen kommer med i den sidste commit sammen med `docs/BOARD.md`.
- **`.gitignore` før commit, skitser i første commit** — under tilfælde A og under punkt 6 i trin 3 (*Rækkefølgen når du først skriver*): skitserne ligger på disken, men intet committes før `.gitignore`, og skitserne kommer med i `kickoff: initialiser projekt`. Rækkefølgen er ikke ændret.
- **Vedligeholdelsesdokumentet** — `PLUGIN.md`, nyt afsnit *Projekt nul, og projekt nul med skitser* efter *Kontrakten driver*: hvad projekt nul er, hvornår den nye besked kommer, hvad den siger, at den første session før skitsen findes stadig får `PROJEKT NUL`, og at hooken tier ved læsefejl.
- **Kontrollen** — `node tools/validate.mjs`: OK, én advarsel om at `plugins/agents/skills/kickoff/AGENTS.md` er ændret siden `origin/main` uden bump af `kontrakt-version`. Den skyldes task-0008 (merget lokalt, ikke pushet); denne opgave rører ikke kontrakten. `node --check` på hooken: OK.
- **Versionsnumre** — ingen ændret: `git diff main` er tom for begge manifester og kontrakten.

### Hvad er ikke lavet, og hvorfor

- Sætningen i `plugins/agents/skills/mockup/SKILL.md` under *Nej: en mappe uden metoden* — at `PROJEKT NUL` er forventet fordi "beskeden kender ikke skitser" — er ikke rettet. Uden for opgaven. Den er stadig rigtig for den første session (før skitsen findes), men begrundelsen holder ikke længere: fra næste session kender hooken skitser og siger noget andet. Ingen af opgavens kriterier afhænger af at den rettes.
- `GUIDE.md` linje 367 (*En tom mappe* i konsulentafsnittet) nævner kun `PROJEKT NUL`. Den er ikke forkert, men nævner ikke den nye besked. Ikke rørt — uden for opgaven.

### Uklart

- Opgaven siger "Rækkefølgen i trin 6 — `git init`, så `.gitignore`, så resten". I kickoff-skillen står rækkefølgen i trin 3 (*Rækkefølgen når du først skriver*); trin 6 er *Kontrakt og overblik*. Jeg har læst det som trin 3, hvor punkt 6 er den første commit, og skrevet tilføjelsen der.
- Skitsens `## Afledte numre` siger "Udfyldes af architect". Når kickoff sætter `behandlet`, bliver afsnittet stående med pladsholderen, fordi opgaven kun giver kickoff lov til `status`-feltet. Skal kickoff skrive noget der — fx at skitsen blev brugt i `docs/projekt.md` og på BOARD — er det et nyt nummer.
