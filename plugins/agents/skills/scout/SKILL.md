---
description: "Sætter scout-agenten til at kortlægge en eksisterende kodebase: stak, moduler, data, systemgrænser og de filer der bærer mest. Kører isoleret og skriver et kort."
disable-model-invocation: true
---

# scout

Send `scout`-agenten af sted med Agent-værktøjet, `subagent_type: agents:scout`.

## Brug den når

Projektet findes i forvejen, og ingen af os kender det. Typisk lige før `kickoff` på et brownfield-projekt, eller når `architect` skal interviewe i en kodebase der ikke er kortlagt.

**Den er ikke et trin i arbejdet.** Den er noget `architect` sender af sted når den mangler grundlag — som at slå noget op. Er projektet vores eget og velkendt, er den spild af tid.

## Giv den

- **Hvor dybt.** Som standard: nok til at kunne arbejde i projektet. Skal den dække et bestemt hjørne grundigt, så sig det.
- Hvad du allerede ved, så den ikke bruger tid på det.

## Husk

Den læser mange filer. **Det er hele grunden til at den kører i sit eget vindue** — du vil ikke have to hundrede filopslag i din kontekst. Det er den samme grund til at alle rapportroller er agenter: du får resultatet, ikke arbejdet.

Den **dømmer ikke**. Ser den noget der ser forkert ud, noterer den det uden vurdering. Det er `security` og `reviewer` der bedømmer, og dig der afgør.

## Bagefter

Kortet ligger i `docs/map.md`. Det er ikke en rapport med fund der skal behandles — det er et grundlag. Det får ikke status, og det afføder ikke numre af sig selv.

Men **kortets `Ikke undersøgt`-liste skal kvitteres**, ellers bliver den til huller ingen husker. Hvert punkt: afklaret, bevidst accepteret, eller sit eget nummer.
