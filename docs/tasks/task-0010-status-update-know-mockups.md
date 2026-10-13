---
nummer: task-0010
titel: Resten af plugin'et kender ikke skitserne
status: afsluttet
kilde: task-0008, task-0009
oprettet: 2026-10-13
---

# task-0010 — Resten af plugin'et kender ikke skitserne

## Hvad og hvorfor

task-0008 gjorde `docs/mockups/` til en rapportmappe, men to roller kender den
ikke. `status` læser kun de fem gamle mapper, så en skitse der står ubehandlet,
bliver aldrig vist — og det er netop `status` kontrakten peger på som den der
viser uafhentede fund. `update` stopper når den nye kontrakt nævner en mappe
projektet ikke har; `docs/mockups/` findes først når den første skitse laves,
så ved næste opdatering stopper den i alle projekter. task-0009 efterlod tre
løse ender: skillen og vejledningen siger stadig at hooken ikke kender
skitser, og en skitse som `kickoff` har brugt, beholder pladsholderen i
`Afledte numre`. Alt skal være på plads før udgivelsen.

## Færdig når

- [ ] `status` læser skitsernes noter sammen med de øvrige rapporter og viser en skitse der står ubehandlet, også når den kun ligger på sin egen gren
- [ ] Kontraktens beskrivelse af hvad `status` læser, passer
- [ ] `update` stopper ikke fordi et projekt mangler en mappe som en rolle selv opretter første gang den bruges
- [ ] `update` stopper stadig når en mappe projektet har, er omdøbt eller forsvundet i den nye kontrakt
- [ ] Skitserollen siger ikke længere at hookens besked ikke kender skitser; den skelner mellem den første session, hvor der endnu ingen skitse er, og de senere
- [ ] Vejledningens afsnit til konsulenter nævner hookens besked om skitser
- [ ] En skitse som `kickoff` har sat til behandlet, siger i `Afledte numre` at den blev brugt i projektets dokument og på BOARD, og ikke af `architect`
- [ ] Kontrollen er ren
- [ ] Intet versionsnummer er ændret

## Sådan bygger vi det

**`status`, `plugins/agents/agents/status.md`.** Trin 2 i *Læs, i denne
rækkefølge* nævner de fem mapper; `docs/mockups/*/NOTER.md` skal med. En
skitse på en ikke-merget `mockup-*`-gren læses som `architect` gør det, med
`git show` — se trin 1 i `plugins/agents/skills/architect/SKILL.md`.

**Kontrakten, `plugins/agents/skills/kickoff/AGENTS.md`.** Sætningen "Den
læser de fem mapper" under *BOARD*.

**`update`, `plugins/agents/skills/update/SKILL.md`, del 1 trin 4.** Første
punkt — mapper den nye kontrakt nævner, som ikke findes — skal undtage mapper
der oprettes efter behov af den rolle der skriver i dem. `docs/mockups/` er
én. Se efter om `docs/workflows/` og `docs/map.md` har samme karakter, og
gør reglen generel frem for at liste én mappe, hvis de har.

**De løse ender fra task-0009.** `plugins/agents/skills/mockup/SKILL.md`,
punktet om `PROJEKT NUL` under tilfældet uden metode. `GUIDE.md`, tabellen
*De to tilfælde* i afsnittet til konsulenter. `plugins/agents/skills/kickoff/SKILL.md`,
*Ligger der skitser*: ved siden af `status` skriver `kickoff` én linje under
`## Afledte numre`.

## Hvad vi ikke rører

- Resten af `update` — kun trin 4's første punkt
- `status`' øvrige trin og dens svarform
- Hooken
- `kickoff`-skillen ud over linjen om `Afledte numre`

## Afhænger af

task-0008

## Beslutninger

- BESLUTTET: de to fund samles i ét nummer — hver for sig er de én linje, og de skal begge være klar før samme udgivelse
- BESLUTTET: `update`-reglen skrives efter mappens karakter (oprettes efter behov), ikke som en liste med én undtagelse — næste rolle med egen mappe ville ellers ramme det samme

- BESLUTTET: task-0009s to fund og dens ene uklarhed lægges i dette nummer — alle er løse ender efter samme rolle, og hver for sig bærer de ikke en tråd
- BESLUTTET: `kickoff` skriver i `Afledte numre` ud over `status` — en pladsholder der siger at `architect` udfylder feltet, ville stå forkert for altid

## Åbne punkter

## Indvendinger

---

## Developers noter

<Alt over denne overskrift ejes af architect. Alt herunder skrives kun af
developer, som aldrig retter i definitionen ovenfor.>

### Hvad er lavet

- **`status` læser skitserne** — `plugins/agents/agents/status.md`, trin 2 i *Læs, i denne rækkefølge*: `NOTER.md` i hver skitsemappe under `docs/mockups/` læses sammen med de fem mapper (en skitse har ingen `kilde`). Ikke-mergede skitser findes med `git branch -a --list "*mockup-*"`, mappenavnet med `git ls-tree --name-only <gren> docs/mockups/`, og noterne læses med `git show <gren>:docs/mockups/<mappe>/NOTER.md` — samme fremgang som `architect` trin 1. En skitse der kun ligger på sin gren, tæller med, og det siges at den ikke er merget. Trin 3 (rapporter `klar til behandling`) og svarformen er urørte; en skitse passer ind i *RAPPORTER KLAR TIL BEHANDLING* som den står.
- **Kontrakten** — `plugins/agents/skills/kickoff/AGENTS.md`, *BOARD*: "Den læser de fem mapper" er erstattet med at den læser opgaverne, rapporterne og skitsernes noter, også skitser på deres egen gren. Ingen anden linje i kontrakten er rørt; `kontrakt-version` står på 20.
- **`update` undtager det der oprettes efter behov** — `plugins/agents/skills/update/SKILL.md`, del 1 trin 4, første punkt. Reglen er skrevet efter karakter: en mappe eller fil som den rolle der skriver i den, selv opretter første gang den bruges, og som `kickoff` ikke lægger ind ved projektstart. `docs/workflows/` (oprettes af `workflow`) og `docs/map.md` (oprettes af `scout`) har samme karakter som `docs/mockups/` — `kickoff` trin 6 opretter kun `docs/tasks/`, `docs/tests/`, `docs/securities/`, `docs/reviews/`, `docs/debugs/` og de tre kopierede filer — så alle tre står som eksempler under én regel.
- **`update` stopper stadig ved omdøbning eller forsvinden** — det andet punkt i trin 4 er urørt. Første punkt siger nu udtrykkeligt at undtagelsen kun gælder det der mangler; har projektet sådan en mappe, og er den omdøbt eller væk i den nye kontrakt, er det andet punkt.
- **Skitserollen** — `plugins/agents/skills/mockup/SKILL.md`, *Nej: en mappe uden metoden*: "beskeden kender ikke skitser" er væk. Punktet skelner nu mellem første session (ingen skitse endnu → `PROJEKT NUL`, forventet) og senere sessioner (en skitse med noter → `SKITSER, INTET PROJEKT ENDNU`, som selv siger at det er forventet). Betingelsen — en mappe under `docs/mockups/` med `NOTER.md` — og overskriften er holdt op mod `skitser()` og `skitseUdenProjekt()` i `plugins/agents/hooks/detect-project-zero.cjs`. Hooken er ikke rørt.
- **Vejledningen** — `GUIDE.md`, tabellen *De to tilfælde* i *Til konsulenter*, rækken *En tom mappe*: nævner `SKITSER, INTET PROJEKT ENDNU`, at den lister skitserne og er forventet, og at `kickoff` læser skitsernes noter.
- **`Afledte numre` efter `kickoff`** — `plugins/agents/skills/kickoff/SKILL.md`, *Ligger der skitser*: når `kickoff` sætter en skitse til `behandlet`, erstatter den pladsholderen under `## Afledte numre` med én linje (vist som skabelon) der siger at skitsen blev brugt ved projektstart i `docs/projekt.md` og som emner på `docs/BOARD.md`, at der ingen opgaver kom af den, og at den ikke blev triageret af `architect`.
- **Kontrollen** — `node tools/validate.mjs`: OK, exit 0. Én advarsel: `plugins/agents/skills/kickoff/AGENTS.md` er ændret siden `origin/main` uden bump af `kontrakt-version`. Den skyldes primært task-0008 (merget lokalt, ikke pushet) og var der før denne opgave; min ændring i *BOARD* er en rettelse af en beskrivelse, ikke en ny regel.
- **Versionsnumre** — ingen ændret: `git diff main` er tom for begge manifester, og `kontrakt-version` er uændret.
- Én commit pr. enhed på grenen `task-0010-status-update-know-mockups`, seks i alt plus noterne.

### Hvad er ikke lavet, og hvorfor

intet

### Uklart

- **To linjer i `kickoff`-skillen uden for *Ligger der skitser*.** *Hvad vi ikke rører* siger "`kickoff`-skillen ud over linjen om `Afledte numre`". Mandatet (linje 14) sagde at `kickoff` kun skriver i skitsens `status`-felt, og *Output* nævnte kun `status: behandlet`. Begge ville modsige den nye linje, så jeg har udvidet dem med `## Afledte numre` — intet andet. Læser architect afgrænsningen strengere, er det de to ændringer der skal ud igen.
- **Eksemplerne i `update`-reglen står med "I dag er det …".** Reglen er skrevet efter karakter, men nævner de tre stier for at modellen kan genkende dem. Kommer en ny rolle med egen mappe, bliver eksempellisten ufuldstændig uden at reglen bliver forkert. Jeg har ikke fundet en måde at lade `update` aflæse karakteren maskinelt (fx fra kontraktens filtabel), og har ikke opfundet en.
- **Advarslen fra kontrollen** om `kontrakt-version` er forventet (task-0008). Om rettelsen under *BOARD* i sig selv kalder på et bump, er menneskets beslutning; jeg har intet bumpet.
- **En proces uden for opgaven.** Et forsøg på at sætte status med `python -` hang (stdin-heredoc), og jeg stoppede det med `taskkill //F //IM python.exe`. Det ramte to `python.exe`-processer; den ene kan have været en anden proces på maskinen end min. Har noget Python-baseret stoppet uventet omkring det tidspunkt, er det årsagen.
