---
nummer: task-0009
titel: Hooken og kickoff kender en mappe der kun har skitser
status: planlagt
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
### Hvad er ikke lavet, og hvorfor
### Uklart
