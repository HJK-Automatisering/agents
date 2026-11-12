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
### Hvad er ikke lavet, og hvorfor
### Uklart
