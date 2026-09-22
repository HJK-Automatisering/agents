---
nummer: task-0004
titel: Opdateringskaldet opregner ikke de steder der stadig beskriver det gamle vilkår
status: planlagt
kilde: interview
oprettet: 2026-09-22
---

# task-0004 — Opdateringskaldet opregner ikke de steder der stadig beskriver det gamle vilkår

## Hvad og hvorfor

Ændrer et workflow sig så det udløses af noget andet end før, bliver projektets
egne beskrivelser af det gamle vilkår forkerte samme sekund. Ingen fejl siger
det — det er hele pointen med den slags ændring. Kaldet opregnede dem af sig
selv alle tre gange under afprøvningen den 2026-09-22, men intet i dets tekst
beder det om det, så det er ikke en garanti. Det er den eneste rolle der står i
projektet med både det gamle og det nye vilkår i hovedet.

## Færdig når

- [ ] Har et workflows udløsningsvilkår ændret sig, opregner kaldet de steder i projektet der stadig beskriver det gamle
- [ ] Opregningen siger hvor det står og hvad der er forkert. Der rettes ingenting
- [ ] Har vilkåret ikke ændret sig, ledes der ikke, og der siges ikke noget om det
- [ ] Historik opregnes ikke
- [ ] Forbudslisten siger det samme om en ældre kilde som de to trin den opsummerer
- [ ] Ingen versionsnumre er rørt

## Sådan bygger vi det

| Fil | Ændring |
|---|---|
| `plugins/agents/skills/update/SKILL.md` | Afsnittet `## Rapportér hvad der ændrede sig`. Sidste afsnit siger allerede at et ændret udløsningsvilkår er det vigtigste der siges — opregningen hænger på der |
| `plugins/agents/skills/update/SKILL.md` | Sidste punkt under `## Du må ikke`. Det siger i dag kun "ens", hvor de to trin det opsummerer nu siger "kun når plugin'ets version er højere" |

Hold søgningen på projektets egne beskrivelser: `CLAUDE.md`, `README.md`,
filerne under `docs/`, og projektets `AGENTS.md`. Ikke kode, ikke historik.

**Projektets egen kontraktafvigelse tælles med.** Kaldet har lige bevaret
afvigelserne ordret, og det er rigtigt — men en bevaret sætning kan stadig
være blevet forkert, og den er svær at få øje på netop fordi den blev bevaret
med vilje.

## Hvad vi ikke rører

- Mandatet. Rollen skriver stadig kun i de to slags kopier; opregningen er
  noget den siger, ikke noget den retter.
- De øvrige ti roller.
- `kontrakt-version`, `skabelon-version` og de to manifester.

## Afhænger af

intet

## Beslutninger

- BESLUTTET: der ledes kun når udløsningsvilkåret har ændret sig. Et kald der
  leder hver gang, finder tilfældigheder og lærer folk at springe listen over.
  Afvist: en generel oprydningsopregning ved hver opdatering.
- BESLUTTET: der opregnes, der rettes ikke. Mandatet er rollens styrke, og en
  rolle der retter i projektets dokumentation, er en anden rolle.
- BESLUTTET: forbudslisten rettes her frem for i et eget nummer. Én linje i
  en opsummerende liste bærer ikke en opgave, og en developer skal alligevel
  åbne filen. Den er en selvstændig rettelse og blandes ikke ind i
  opregningen. Afvist: et femte nummer til én linje.
- BESLUTTET: rapporter og beslutningsloggen opregnes ikke. De beskriver hvad
  der var sandt dengang, og en rettelse i dem ville være en forfalskning.

## Åbne punkter

## Indvendinger

---

## Developers noter

### Hvad er lavet
### Hvad er ikke lavet, og hvorfor
### Uklart
