---
nummer: task-0010
titel: status og update kender ikke skitsemappen
status: planlagt
kilde: task-0008
oprettet: 2026-10-13
---

# task-0010 — status og update kender ikke skitsemappen

## Hvad og hvorfor

task-0008 gjorde `docs/mockups/` til en rapportmappe, men to roller kender den
ikke. `status` læser kun de fem gamle mapper, så en skitse der står ubehandlet,
bliver aldrig vist — og det er netop `status` kontrakten peger på som den der
viser uafhentede fund. `update` stopper når den nye kontrakt nævner en mappe
projektet ikke har; `docs/mockups/` findes først når den første skitse laves,
så ved næste opdatering stopper den i alle projekter. Begge skal være på plads
før task-0008 udgives.

## Færdig når

- [ ] `status` læser skitsernes noter sammen med de øvrige rapporter og viser en skitse der står ubehandlet, også når den kun ligger på sin egen gren
- [ ] Kontraktens beskrivelse af hvad `status` læser, passer
- [ ] `update` stopper ikke fordi et projekt mangler en mappe som en rolle selv opretter første gang den bruges
- [ ] `update` stopper stadig når en mappe projektet har, er omdøbt eller forsvundet i den nye kontrakt
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

## Hvad vi ikke rører

- Resten af `update` — kun trin 4's første punkt
- `status`' øvrige trin og dens svarform
- Hooken og `kickoff`-skillen — task-0009

## Afhænger af

task-0008

## Beslutninger

- BESLUTTET: de to fund samles i ét nummer — hver for sig er de én linje, og de skal begge være klar før samme udgivelse
- BESLUTTET: `update`-reglen skrives efter mappens karakter (oprettes efter behov), ikke som en liste med én undtagelse — næste rolle med egen mappe ville ellers ramme det samme

## Åbne punkter

## Indvendinger

---

## Developers noter

<Alt over denne overskrift ejes af architect. Alt herunder skrives kun af
developer, som aldrig retter i definitionen ovenfor.>

### Hvad er lavet
### Hvad er ikke lavet, og hvorfor
### Uklart
