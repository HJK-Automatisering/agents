---
nummer: task-0002
titel: PLUGIN.md kender kun kontraktens stempel
status: planlagt
kilde: interview
oprettet: 2026-09-22
---

# task-0002 — PLUGIN.md kender kun kontraktens stempel

## Hvad og hvorfor

`update` dækker nu to slags kopier i et projekt: kontrakten og de installerede
workflows. Vedligeholdelsesdokumentet blev ikke rettet med, fordi det ikke stod
i task-0001's filliste. To steder er derfor forkerte: træet beskriver `update`
som noget der kun opdaterer kontrakten, og afsnittet om versionsstempler kender
kun kontraktens. Den der vedligeholder plugin'et, læser netop den fil.

## Færdig når

- [ ] Beskrivelsen af opdateringskaldet i træet dækker begge slags kopier
- [ ] Afsnittet om versionsstempler nævner også workflow-skabelonernes stempel, og hvad der sker hvis det glemmes
- [ ] Ingen anden fil er ændret, og intet versionsnummer er rørt

## Sådan bygger vi det

| Fil | Ændring |
|---|---|
| `PLUGIN.md` | Linjen om `update/` i træet. Afsnittet `## Kontrakten driver` udvides med workflow-stemplet, eller får et sideordnet afsnit |

Stemplet hedder `skabelon-version` og står i frontmatter i plugin'ets
`skills/workflow/<navn>.md`. Hooken sammenligner det med projektets kopi på
samme måde som `kontrakt-version`, og bumpet er menneskets beslutning.
`CLAUDE.md` beskriver det allerede — gentag det ikke ordret, henvis hvor det
er naturligt.

## Hvad vi ikke rører

- Alt uden for `PLUGIN.md`.
- Alle versionsnumre, inklusive `kontrakt-version` og de to manifester.

## Afhænger af

task-0001

## Beslutninger

- BESLUTTET: det bliver et eget nummer frem for en rettelse i task-0001 — en
  opgave genåbnes ikke, og filen stod bevidst uden for dens tabel.

## Åbne punkter

## Indvendinger

---

## Developers noter

### Hvad er lavet
### Hvad er ikke lavet, og hvorfor
### Uklart
