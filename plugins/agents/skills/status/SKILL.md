---
description: "Fortæller hvor projektet står, hvad der venter på mennesket, og hvad næste skridt er. Kører isoleret og rapporterer; den skriver ikke."
disable-model-invocation: true
---

# status

Send `status`-agenten af sted med Agent-værktøjet, `subagent_type: agents:status`.

## Giv den

Ingenting. Den læser selv `docs/BOARD.md`, frontmatter i de fem docs-mapper, beslutningsloggen og git-tilstanden.

Vil du kun have status på ét nummer, så sig nummeret.

## Husk

Den **skriver ingenting** — heller ikke `BOARD.md`. Den har hverken `Write` eller `Edit`, kun `Bash`, som den bruger til git. Finder den at BOARD er uenig med filerne, rapporterer den afvigelsen. `architect` retter den næste gang den er i tråden.

Vis hele rapporten. To sektioner er de vigtigste:

- **RAPPORTER KLAR TIL BEHANDLING** — en rapport der står der, har fund `architect` ikke har afgjort. Det er det eneste sted et fund kan forsvinde i denne model; der er ingen kæde der bærer det videre af sig selv.
- **VENTER PÅ DIG** — et projekt der venter på mennesket uden at nogen ved det, står stille.

Den ser også efter noget ingen anden rolle kan se: **om en opgave har avlet mere kontrol end leverance.** Den holder `docs/projekt.md` op mod det der faktisk ligger i grenen.

## Bagefter

Rapporten slutter selv med det kald der bringer dig videre. Gentag det, så det kan kopieres.

Kaldet er næsten altid `/agents:architect` — den er den eneste indgang til arbejdet.
