---
description: "Fortæller hvor projektet står, hvad der venter på mennesket, og hvad næste skridt er — inklusive det kald der bringer dig videre. Kører isoleret og skriver ingenting."
disable-model-invocation: true
---

# status

Send `status`-agenten af sted med Agent-værktøjet, `subagent_type: status`.

## Giv den

Ingenting. Den læser selv `docs/BOARD.md`, frontmatter i de nummererede filer, beslutningsloggen og git-tilstanden.

Vil du kun have status på ét nummer, så sig nummeret.

## Husk

Den **skriver ingenting** — heller ikke `BOARD.md`. Finder den at BOARD er uenig med filerne, rapporterer den afvigelsen og tilbyder at rette. Det er dit valg.

Vis hele rapporten. Den vigtigste sektion er **VENTER PÅ DIG** — et projekt der venter på mennesket uden at nogen ved det, står stille.

## Bagefter

Rapporten slutter selv med det kald der bringer dig videre. Gentag det, så det kan kopieres.
