---
nummer: task-0002
titel: Vedligeholdelsesdokumentet kender kun kontraktens stempel, og afprøvningsvejen er forkert
status: afsluttet
kilde: interview
oprettet: 2026-09-22
---

# task-0002 — Vedligeholdelsesdokumentet kender kun kontraktens stempel, og afprøvningsvejen er forkert

## Hvad og hvorfor

`update` dækker nu to slags kopier i et projekt: kontrakten og de installerede
workflows. Vedligeholdelsesdokumentet blev ikke rettet med, fordi det ikke stod
i task-0001's filliste. To steder er derfor forkerte: træet beskriver `update`
som noget der kun opdaterer kontrakten, og afsnittet om versionsstempler kender
kun kontraktens. Den der vedligeholder plugin'et, læser netop den fil.

Oveni står der et sted i repoet at en udgivelsesløs afprøvning gøres ved at
pege kaldet på arbejdstræet. Det holder ikke når plugin'et allerede er
installeret under samme navn: kilden blev læst fra den installerede udgave i
tre af fire forsøg den 2026-09-22, uden at det blev sagt nogen steder. Den
vej der virker, er en engangskopi af plugin-mappen med et andet navn i
manifestet — så findes der kun én kandidat, og kaldene bærer det nye navn.

## Færdig når

- [ ] Beskrivelsen af opdateringskaldet i træet dækker begge slags kopier
- [ ] Afsnittet om versionsstempler nævner også workflow-skabelonernes stempel, og hvad der sker hvis det glemmes
- [ ] Den beskrevne måde at afprøve en uudgivet udgave på, virker når plugin'et allerede er installeret
- [ ] Det står hvad der går galt hvis man gør det på den gamle måde, så det kan genkendes
- [ ] Ingen anden fil end de to er ændret, og intet versionsnummer er rørt

## Sådan bygger vi det

| Fil | Ændring |
|---|---|
| `PLUGIN.md` | Linjen om `update/` i træet. Afsnittet `## Kontrakten driver` udvides med workflow-stemplet, eller får et sideordnet afsnit. Afprøvningsvejen beskrives her |
| `CLAUDE.md` | Kommandolisten øverst. Linjen der siger at man prøver af uden at udgive ved at pege på arbejdstræet |

Stemplet hedder `skabelon-version` og står i frontmatter i plugin'ets
`skills/workflow/<navn>.md`. Hooken sammenligner det med projektets kopi på
samme måde som `kontrakt-version`, og bumpet er menneskets beslutning.
`CLAUDE.md` beskriver det allerede — gentag det ikke ordret, henvis hvor det
er naturligt.

## Hvad vi ikke rører

- Alt uden for `PLUGIN.md` og `CLAUDE.md`.
- Alle versionsnumre, inklusive `kontrakt-version` og de to manifester.

## Afhænger af

task-0001

## Beslutninger

- BESLUTTET: det bliver et eget nummer frem for en rettelse i task-0001 — en
  opgave genåbnes ikke, og filen stod bevidst uden for dens tabel.
- BESLUTTET: fundet om afprøvningsvejen lægges i dette nummer frem for i et
  nyt. Det er samme emne — hvordan plugin'et vedligeholdes — og opgaven er
  stadig planlagt, så definitionen kan udvides uden at genåbne noget. Afvist:
  et tredje nummer til to linjer dokumentation.

## Åbne punkter

## Indvendinger

---

## Developers noter

### Hvad er lavet

- `PLUGIN.md`: træets linje om `update/` siger nu "opdaterer projektets kopier:
  kontrakt og workflows" — dækker begge slags kopier (punkt 1).
- `PLUGIN.md`, `## Kontrakten driver`: to afsnit tilføjet om workflow-kopierne —
  stemplet `skabelon-version` i workflow-dokumentets frontmatter, at hooken
  sammenligner det pr. fil, og hvad der sker hvis bumpet glemmes. Reglen for
  hvornår der bumpes, og validatorens advarsel, er henvist til `CLAUDE.md`
  frem for gentaget (punkt 2).
- `PLUGIN.md`, `## Prøv af før udgivelsen`: `claude --plugin-dir` er taget ud af
  kommandoblokken, og et nyt underafsnit `### Kør en uudgivet udgave i en
  session` beskriver engangskopien uden for repoet med et andet `name` i
  manifestet, de tre trin, det ændrede kaldnavn `/agents-preview:architect` og at
  kopien ikke er et arbejdstræ (punkt 3).
- `PLUGIN.md`, samme afsnit: fejlbilledet står som eget afsnit — kaldet svarer
  som det plejer, men efter den installerede udgaves tekst, uden fejl eller
  advarsel (punkt 4). Den gamle slutlinje om marketplacet er bevaret, men
  omskrevet til at pege på kopien i stedet for `--plugin-dir`.
- `CLAUDE.md`: kommandolistens `--plugin-dir`-linje peger nu på kopien, og et
  kort afsnit under blokken siger hvorfor og henviser til `PLUGIN.md` (punkt 3
  og 4).
- Engangskopien hedder `agents-preview` i begge filer — sti, `name`-værdi og
  kaldenavn. Navnet er afgjort i tråden: det ender i en kommando og i et
  kaldenavn, og kontrakten siger identifiers på engelsk.
- Kun de to filer er ændret ud over denne opgavefil. Intet versionsnummer er
  rørt — hverken de to manifester, `kontrakt-version` eller `skabelon-version`
  (punkt 5). `node tools/validate.mjs` kører OK.

### Hvad er ikke lavet, og hvorfor

intet

### Uklart

intet
