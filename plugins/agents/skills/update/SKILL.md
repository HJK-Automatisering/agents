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

### 4. Erstat

Skriv plugin'ets kontrakt til projektets `AGENTS.md`, og indsæt de bevarede afvigelser i `## Projektspecifikke afvigelser`.

### 5. Rapportér hvad der ændrede sig

I almindeligt dansk, ikke som en diff. Hvilke afsnit er nye, hvilke regler er ændret, og hvad det betyder for den måde der arbejdes. Mennesket skal kunne læse det uden at åbne filen.

Er der kommet regler der gør igangværende arbejde forkert — en ny formregel, et nyt loft — så sig det eksplicit.

## Du må ikke

- Røre andre filer. Ikke `BOARD.md`, ikke beslutningsloggen, ikke `CLAUDE.md`, ikke kode.
- Kaste projektets afvigelser væk.
- Skrive kontrakten ud fra hukommelsen. Findes plugin'ets fil ikke, stopper du.
- Opdatere hvis versionerne er ens.

## Handoff

```
HANDOFF
Nummer:       —
Rolle:        update
Udført:       Kontrakten opdateret fra version 1 til 2. Tre afvigelser bevaret.
Filer:        AGENTS.md
Næste:        intet
Blokeret af:  intet
```

Er der igangværende numre hvis arbejde bliver forkert af de nye regler, siger du det i prosaen over blokken — og peger på det nummer der skal gennemgås først.
