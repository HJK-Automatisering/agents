---
nummer: task-0011
titel: Opdateringsvejledningen dækker ikke et plugin leveret centralt
status: afsluttet
kilde: interview
oprettet: 2026-10-13
---

# task-0011 — Opdateringsvejledningen dækker ikke et plugin leveret centralt

## Hvad og hvorfor

Alle vejledninger siger `claude plugin update agents@hjk-agents --scope user`.
Ved udrulningen af 1.0.0-beta.26 fejlede den på en maskine hvor plugin'et er
leveret via organisationens managed settings: *Plugin "agents" is not
installed at scope user*. `claude plugin list` viste `Scope: managed`, og
`update --scope managed` løftede til den nye udgave. En udvikler der følger
vejledningen ordret, kommer ikke videre — og ved ikke hvorfor.

## Færdig når

- [ ] Hvor en vejledning beder om at opdatere plugin'et, står der at scope'et aflæses med `claude plugin list` først, og at opdateringen køres med det scope der står der
- [ ] Linjen for et centralt leveret plugin, `--scope managed`, står som et konkret eksempel ved siden af `--scope user`
- [ ] Fejlbeskeden *is not installed at scope user* står i vedligeholdelsesdokumentet, så den kan findes ved en søgning
- [ ] Vedligeholdelsesdokumentets uafklarede sætning om managed settings er erstattet af det der nu er efterprøvet — og kun det
- [ ] Installationsvejledningen er uændret i substans: `install --scope user` er stadig vejen for den der selv installerer
- [ ] Kontrollen er ren
- [ ] Intet versionsnummer er ændret

## Sådan bygger vi det

Steder hvor `--scope user` står ved **opdatering**:

- `PLUGIN.md`, *Hvad hver bruger kører ved hver udgivelse*
- `GUIDE.md`, *Ved hver ny version*
- `OPSAETNING.md`, opdateringsafsnittet
- `README.md`, opdateringslinjen
- `CHANGELOG.md`, den generelle tekst øverst — ikke de enkelte udgivelsesposter

`PLUGIN.md` afslutter afsnittet om managed settings med at det ikke er
efterprøvet om de fjerner `install`-kommandoen. Det er stadig ikke efterprøvet.
Det der er efterprøvet, er at et plugin leveret den vej har scope `managed`, og
at `update` skal have det scope. Skriv det, og lad resten stå som uafklaret.

Hold teksten kort i `GUIDE.md`, `README.md` og `OPSAETNING.md` — én sætning
og én ekstra linje. Forklaringen hører i `PLUGIN.md`.

## Hvad vi ikke rører

- Installationslinjerne med `install --scope user`
- Udgivelsesposterne i `CHANGELOG.md`
- Rollefiler, kontrakten, hooken og manifesterne

## Afhænger af

intet

## Beslutninger

- BESLUTTET: vejledningen beder om at aflæse scope'et frem for at liste alle tænkelige — scope'et afhænger af hvordan maskinen er sat op, og `claude plugin list` siger det
- BESLUTTET: kun det efterprøvede skrives. Om managed settings også installerer plugin'et eller blot registrerer kataloget, ved vi ikke for hver maskine

## Åbne punkter

## Indvendinger

---

## Developers noter

<Alt over denne overskrift ejes af architect. Alt herunder skrives kun af
developer, som aldrig retter i definitionen ovenfor.>

### Hvad er lavet

Gren `task-0011-managed-scope-update`, to commits: `79e4053` (PLUGIN.md) og
`6c455cb` (de fire brugervejledninger).

- **Aflæs scope'et først** — `PLUGIN.md` (*Hvad hver bruger kører ved hver
  udgivelse*), `GUIDE.md` (*Ved hver ny version*), `OPSAETNING.md` (punkt 9),
  `README.md` (opdateringslinjen) og `CHANGELOG.md` (den generelle tekst øverst)
  siger nu før kommandoblokken: aflæs scope'et med `claude plugin list`, og kør
  `update` med det scope der står der.
- **`--scope managed` som konkret eksempel** — samme fem steder har en ekstra
  blok med `claude plugin update agents@hjk-agents --scope managed`, indledt med
  at den gælder når `claude plugin list` viser `Scope: managed`. `--scope user`-
  linjen står uændret i hovedblokken. Managed-linjen står i sin egen blok, så den
  ikke køres efter user-linjen ved at hele blokken indsættes.
- **Fejlbeskeden kan findes** — `PLUGIN.md` har et nyt underafsnit, *`update`
  skal have det scope plugin'et står med*, med den ordrette besked
  `Failed to update plugin "agents@hjk-agents": Plugin "agents" is not installed at scope user`,
  hvad den betyder, og hvad der blev efterprøvet (`Scope: managed`, og
  `update --scope managed` svarede `updated from … to … for scope managed`).
  Versionstallene er erstattet af `…`; ingen maskine, bruger eller sti er nævnt.
- **Den uafklarede sætning** — `PLUGIN.md`, efter afsnittet om Intune/Group
  Policy: sætningen om at dokumentationen ikke er entydig er erstattet af det
  efterprøvede (scope `managed`, `update` skal have `--scope managed`) og det
  ikke efterprøvede (om managed settings på hver maskine installerer plugin'et
  eller blot registrerer kataloget, og dermed om `install` kan undværes).
  Udgangspunktet er stadig én `install` pr. udvikler.
- **Installationsvejledningen** — ingen af `install --scope user`-linjerne eller
  teksten om dem er rørt (`PLUGIN.md`, `GUIDE.md`, `OPSAETNING.md`, `README.md`).
- **Udgivelsesposterne i `CHANGELOG.md`** er ikke rørt.
- **Kontrollen** — `node tools/validate.mjs`: `OK. 12 skills, 7 agenter, 45
  markdown-filer, begge manifester paa version 1.0.0-beta.26.`
- **Intet versionsnummer** er ændret; manifesterne og kontrakten er ikke rørt.

### Hvad er ikke lavet, og hvorfor

- Opgavefilen selv er ikke committet. Den var ucommittet før arbejdet begyndte
  (sammen med `docs/BOARD.md` og `docs/decisions/log.md`), og jeg fik besked på
  ikke at committe den. Status `i-gang` og disse noter ligger derfor kun i
  arbejdstræet.

### Uklart

- `Sådan bygger vi det` beder om én sætning og én ekstra linje i `GUIDE.md`,
  `README.md` og `OPSAETNING.md`. Det blev to korte sætninger: én før blokken
  (aflæs scope'et) og én der indleder managed-linjen. Den ekstra linje skulle
  have en indledning for ikke at stå uforklaret, og i samme blok som user-linjen
  ville den blive kørt sammen med den. Er én sætning et krav, kan den anden
  sætning skæres til en etiket.

Fund uden for opgaven:

- `PLUGIN.md`, afsnittet *Hvad hver bruger kører ved hver udgivelse*: stavefejl
  `katalogget` (skal være `kataloget`). Ikke rettet.
