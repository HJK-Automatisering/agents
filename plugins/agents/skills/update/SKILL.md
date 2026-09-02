---
description: "Opdaterer projektets AGENTS.md til plugin'ets nuværende kontrakt og bevarer projektets egne afvigelser. Brug når hooken siger at kontrakten er bagud, eller efter en plugin-opdatering."
disable-model-invocation: true
---

# update

Projektets `AGENTS.md` er en **kopi**, lagt ind dengang `kickoff` kørte. Opdaterer man plugin'et, følger den ikke med. Du bringer den ajour.

Det er den eneste fil du rører.

## Find plugin'ets kontrakt

Kontrakten ligger i søsterskillen `kickoff`, i samme plugin: filen `AGENTS.md` i dens mappe. Fra denne mappe er den `../kickoff/AGENTS.md`.

Kan du ikke finde den ad den vej, så søg efter `*/skills/kickoff/AGENTS.md` under plugin-mappen. **Gæt ikke på indholdet, og skriv den ikke selv** — findes filen ikke, siger du det og stopper.

## Proces

### 1. Sammenlign versionerne

Begge filer har `kontrakt-version` i frontmatter. Mangler projektets, er den version 1 — fra før versionsstemplet fandtes.

Er de ens, er der intet at gøre. Sig det og stop.

### 2. Tag projektets afvigelser til side

Findes afsnittet `## Projektspecifikke afvigelser` i projektets fil, **skal dets indhold bevares ordret.** Det er projektets egne beslutninger, og de findes ikke andre steder.

Er der ingen afvigelser, eller er afsnittet tomt, er der intet at bevare.

### 3. Læs de projektspecifikke ændringer der *ikke* står i afvigelsesafsnittet

Sammenlign de to filer afsnit for afsnit. Har nogen ændret den generelle tekst i projektets kopi — en regel formuleret om, et punkt tilføjet, en linje slettet — så **stop og vis det.**

Det er ikke en afvigelse; det er en utilsigtet ændring, eller en afvigelse nogen har skrevet det forkerte sted. Spørg om den skal med over i afvigelsesafsnittet, eller kasseres. Ét spørgsmål ad gangen.

Overskriv den ikke i tavshed. Nogen kan have haft en grund.

### 4. Tjek om strukturen passer til den nye kontrakt

Kontrakten beskriver hvilke mapper der findes under `docs/`. Ændrer den sig, kan projektet stå med en kontrakt der beskriver en struktur det ikke har — og så peger hver rolle på filer der ikke findes.

Kig efter begge dele:

- **Mapper den nye kontrakt nævner, som ikke findes** i projektet.
- **Mapper projektet har, som den nye kontrakt ikke nævner** — de bærer indhold nogen har skrevet.

Er der forskel, **stop før du skriver.** Vis den i almindeligt dansk: hvilke mapper hedder noget andet nu, hvor mange filer der ligger i de gamle, og hvad der sker hvis de bliver liggende.

**Du flytter ikke filerne.** En omdøbning af `docs/`-strukturen er en ændring af projektets historik og af hvad hver fil hedder — den træffes af mennesket, ikke som et trin i en opdatering. Der er tre veje, og du lægger dem frem uden at vælge:

- Filerne flyttes og omdøbes til den nye struktur.
- Projektet bliver på den gamle kontrakt indtil igangværende arbejde er i drift.
- Den gamle struktur skrives ind under `## Projektspecifikke afvigelser` som en bevidst afvigelse.

Er der ingen forskel, går du videre uden at nævne det.

### 5. Erstat

Skriv plugin'ets kontrakt til projektets `AGENTS.md`, og indsæt de bevarede afvigelser i `## Projektspecifikke afvigelser`.

### 6. Rapportér hvad der ændrede sig

I almindeligt dansk, ikke som en diff. Hvilke afsnit er nye, hvilke regler er ændret, og hvad det betyder for den måde der arbejdes. Mennesket skal kunne læse det uden at åbne filen.

Er der kommet regler der gør igangværende arbejde forkert — en ny formregel, et nyt loft — så sig det eksplicit.

## Du må ikke

- Røre andre filer. Ikke `BOARD.md`, ikke beslutningsloggen, ikke `CLAUDE.md`, ikke kode.
- **Flytte, omdøbe eller oprette mapper under `docs/`.** Se trin 4. Du opdager forskellen og lægger vejene frem; valget er menneskets.
- Kaste projektets afvigelser væk.
- Skrive kontrakten ud fra hukommelsen. Findes plugin'ets fil ikke, stopper du.
- Opdatere hvis versionerne er ens.

## Lukning

```
LUKNING
Skrevet:      AGENTS.md
Åbent:        docs/plans/ og docs/findings/ hedder noget andet i den nye kontrakt. 7 filer. Ikke flyttet
Næste:        beslut hvad der skal ske med den gamle docs-struktur
Uskrevet:     intet
```

Er der igangværende arbejde som de nye regler gør forkert, siger du det i prosaen over blokken — og peger på hvad der skal gennemgås først.
