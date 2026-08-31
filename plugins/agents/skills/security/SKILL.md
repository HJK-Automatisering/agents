---
description: "Sætter security-agenten på en sikkerhedsgennemgang: huller, injektion, adgang, hemmeligheder, persondata og logiske fejl. Kører isoleret og rapporterer; den retter ikke selv."
disable-model-invocation: true
---

# security

Send `security`-agenten af sted med Agent-værktøjet, `subagent_type: agents:security`.

## Giv den

- **Hvad der skal gennemgås.** Står der intet i kaldet, så brug ændringen på den aktuelle gren mod default-branch. Er der ingen gren at sammenligne med, spørg hvad omfanget er — gæt ikke, en gennemgang af hele kodebasen tager timer og bliver ikke læst.
- Nummeret, hvis arbejdet hører til et.

## Husk

Den kører i sit eget vindue og har **ikke** `Edit`. Den retter intet — det er dens mandat, ikke en teknisk lås. Sig det ikke som om den var umulig at få til det.

Du får dens fund tilbage som et resumé. Selve fundet ligger i `docs/findings/`. Vis resuméet, og peg på filen.

Er der et `kritisk` fund, siger du det som det første — før alt andet i dit svar.

## Bagefter

`Næste: ny tråd → /agents:developer` for at udføre fundene. Er alle fund `note`, er der ikke noget næste skridt, og det siger du.
