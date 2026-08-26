---
description: "Sætter scout-agenten til at kortlægge en eksisterende kodebase: stak, moduler, data, systemgrænser og de filer der bærer mest. Kører isoleret og skriver et kort."
disable-model-invocation: true
---

# scout

Send `scout`-agenten af sted med Agent-værktøjet, `subagent_type: scout`.

## Brug den når

Projektet findes i forvejen og ingen af os kender det. Typisk lige før `kickoff` på et brownfield-projekt, eller når nogen overtager noget de ikke har skrevet.

Er projektet vores eget og velkendt, er den spild af tid.

## Giv den

- **Hvor dybt.** Som standard: nok til at kunne arbejde i projektet. Skal den dække et bestemt hjørne grundigt, så sig det.
- Hvad du allerede ved, så den ikke bruger tid på det.

## Husk

Den læser mange filer. Det er hele grunden til at den kører i sit eget vindue — du vil ikke have to hundrede filopslag i din kontekst.

Den **dømmer ikke**. Ser den noget der ser forkert ud, noterer den det uden vurdering, så `security` og `reviewer` kan se på det med friske øjne.

## Bagefter

Kortet ligger i `docs/map.md`. Vis resuméet og sig hvad du ville tage først og hvorfor — kortet er grundlag for det næste valg, ikke et forslag i sig selv. Valget tages i samtalen, og først derefter skriver du handoff.
