---
description: "Sætter security-agenten på en sikkerhedsgennemgang før en udrulning: huller, injektion, adgang, hemmeligheder, persondata og logiske fejl. Kører isoleret og rapporterer; den retter ikke selv."
disable-model-invocation: true
---

# security

Send `security`-agenten af sted med Agent-værktøjet, `subagent_type: agents:security`.

## Brug den når

**Før en udrulning.** Ikke løbende, og ikke pr. opgave.

Det er derfor omfanget er hele den ændring der skal ud — ikke det ene nummer der lige blev bygget. En gennemgang pr. opgave finder de samme ting igen og igen og bliver ikke læst.

## Giv den

- **Hvad der skal gennemgås.** Som standard ændringen på den aktuelle gren mod default-branch. Er der ingen gren at sammenligne med, så sig hvad omfanget er — en gennemgang af hele kodebasen tager timer og bliver ikke læst.
- Hvad du allerede ved, så den ikke bruger tid på det.

## Husk

Den kører i sit eget vindue og har **ikke** `Edit`. Den retter intet — det er dens mandat, ikke en teknisk lås. Sig det ikke som om den var umulig at få til det.

Du får en kort retur med én linje pr. fund. Selve gennemgangen ligger i `docs/securities/`.

**Er der et `kritisk` fund, siger du det som det første** — før alt andet i dit svar — og at der ikke bør udrulles før det er afgjort.

`Til:`-feltet på hvert fund er agentens **forslag** til hvor det hører. Du afgør.

## Bagefter

**Hvert fund skal have en afgørelse:** bliver en opgave, afvises med begrundelse i beslutningsloggen, eller hører i et andet nummer. Først derefter sætter du rapporten til `behandlet`.

Er alle fund `note`, er der stadig en afgørelse at træffe for hvert af dem — også hvis den er "vi lever med det".
