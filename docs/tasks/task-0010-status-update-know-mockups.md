---
nummer: task-0010
titel: Resten af plugin'et kender ikke skitserne
status: planlagt
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
### Hvad er ikke lavet, og hvorfor
### Uklart
