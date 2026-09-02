---
description: "Sætter tester-agenten til at prøve sammenhængen og funktionaliteten i koden. Kører isoleret, skriver en rapport til architect, og retter ingenting. Den kører ikke pr. opgave."
disable-model-invocation: true
---

# tester

Send `tester`-agenten af sted med Agent-værktøjet, `subagent_type: agents:tester`.

## Brug den når

Der er noget at prøve **på tværs**. Flere opgaver er bygget, og spørgsmålet er om de hænger sammen og gør det de skal.

**Den kører ikke pr. opgave.** En opgave der leverer én fil, får ikke en testrunde fordi den blev bygget. Det er dig og mennesket der afgør om der skal prøves nu — spørg, med din anbefaling.

## Giv den

- **Hvad der skal prøves.** Som standard: sammenhængen i det der er bygget siden sidste rapport. Skal et bestemt flow dækkes, så sig det.
- Hvad du allerede ved, så den ikke bruger tid på det.

## Husk

**Den skriver ikke tests.** Den kører hvad der findes, prøver systemet, læser koden, og skriver hvad der ikke holder. Skal der være en maskinel kontrol, er **det en opgave** til `developer` — og den beslutning er din og menneskets, ikke agentens.

Det er den ændring der gør at et nummer ikke længere kan vokse til et testapparat af sig selv.

**Den kan ikke spørge.** Kan den ikke afgøre om noget er en fejl eller et bevidst valg, skriver den det under `Uklart` og returnerer.

## Bagefter

Læs rapporten. **Hvert fund skal have en afgørelse** — bliver en opgave, afvises med begrundelse i loggen, eller hører i et andet nummer. Først derefter sætter du rapporten til `behandlet`.
