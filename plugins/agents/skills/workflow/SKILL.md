---
description: "Tilfoejer et faelles workflow til projektet \u2014 fx docker-publish, der bygger og publicerer et container-image ved hvert push til main. Viser hvad der findes, spoerger ja eller nej, og kopierer filerne ind."
disable-model-invocation: true
---

# workflow

Følg `AGENTS.md` i projektets rod. Findes den ikke, er projektet ikke sat op — sig `kør /agents:kickoff først` og stop.

Du tilbyder de fælles workflows der ligger i denne skill-mappe, og lægger dem valgte ind i projektet.

Du **foreslår ikke af dig selv**. Bliver du kaldt, viser du hvad der findes. Ellers tier du.

## Proces

### 1. Find ud af hvad der allerede er valgt

Kig i `docs/workflows/` og i projektets `CLAUDE.md`. Et workflow der allerede er lagt ind, tilbyder du ikke igen — du siger at det er der.

### 2. Vis hvad der findes

Læs hver `.md`-fil i denne mappe. Vis `navn` og `formål` for hver, og spørg **ja eller nej pr. workflow**.

Foreslå **ja** når feltet `foreslå-ja-når` passer på projektet — det afgør du ud fra `docs/plans/0000-fundament.md` og `CLAUDE.md`, ikke ud fra et gæt. Kan du ikke afgøre det, foreslår du nej og siger hvorfor.

Siges der nej, nævner du det ikke igen i denne tråd.

### 3. Læg det valgte ind

For hvert ja:

1. Kopiér hver post i workflowets `filer:`-felt fra `fra` til `til`. **Overskriv aldrig en destination der findes** — sig det og stop for netop det workflow.
2. Læg selve workflow-dokumentet i `docs/workflows/`.
3. Nævn det i projektets `CLAUDE.md` under et afsnit `## Valgte workflows`. Findes afsnittet ikke, opret det.

### 4. Forudsætninger bliver til opgaver

Læs workflowets afsnit om forudsætninger. Alt projektet **ikke** opfylder i dag — en manglende `Dockerfile`, en indstilling der skal sættes i GitHub, et tag der ikke findes — skriver du på `docs/BOARD.md` under `## Kommende`, ét punkt pr. forudsætning.

Antag aldrig at nogen selv opdager dem. Et workflow der lykkes uden at gøre hvad man tror, er værre end et der fejler.

## Du må ikke

- Ændre kode. Du kopierer filer og skriver på `BOARD.md` og i `CLAUDE.md`. Intet andet.
- Tilpasse et workflow til projektet. Afviger projektet fra standarden, sættes det via workflowets egne `inputs` i den kopierede kalder — ikke ved at rette i det fælles.
- Lægge et workflow ind som ikke blev sagt ja til.

## Handoff

```
Næste:  ny tråd → /agents:developer — <første uopfyldte forudsætning>
```

Er alle forudsætninger opfyldt, er der ikke noget næste skridt — workflowet kører ved næste push til `main`. Skriv `Næste: intet` og sig det i samtalen.
