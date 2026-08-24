---
description: "Sætter reviewer-agenten på en gennemgang for redundans, unødig kompleksitet, skredet stil og manglende dokumentation. Kører isoleret og kan ikke rette noget."
disable-model-invocation: true
---

# reviewer

Send `reviewer`-agenten af sted med Agent-værktøjet, `subagent_type: reviewer`.

## Giv den

- **Hvad der skal gennemgås.** Som standard ændringen på den aktuelle gren mod default-branch.
- Nummeret, hvis arbejdet hører til et.

## Husk

Den har **ikke** `Edit`. Den foreslår, den retter ikke — og dens forslag skal være konkrete nok til at kunne udføres uden at nogen skal gætte.

Fundet deles i **Oprydning** (kan udføres blindt) og **Adfærd** (kræver at nogen tænker). Den opdeling skal med i det du viser — det er den der afgør hvor meget arbejde der ligger.

## Bagefter

`Næste: ny tråd → /agents:developer` for at udføre oprydningen.

Kan et fund kun løses strukturelt, er det `architect` og ikke `developer`.
