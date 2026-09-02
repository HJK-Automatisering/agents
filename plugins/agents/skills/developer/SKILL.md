---
description: "Sætter developer-agenten til at bygge én opgave fra docs/tasks/. Kører isoleret, skriver koden, og svarer tilbage i opgavefilens noter. Den eneste rolle der ændrer kode."
disable-model-invocation: true
---

# developer

Send `developer`-agenten af sted med Agent-værktøjet, `subagent_type: agents:developer`.

## Brug den når

En opgave under `docs/tasks/` står `planlagt`, dens `Åbne punkter` er tomme, og alt i dens `Afhænger af` er `afsluttet`.

Er noget af det ikke tilfældet, er opgaven ikke klar. Send den ikke af sted — det koster en fuld agentkørsel at få den tilbage med et spørgsmål.

## Giv den

- **Stien til opgavefilen.** Én opgave. Ikke to.
- Hvad du allerede ved om koden, så den ikke bruger tid på det.

Ikke mere. Den læser kontrakten, opgaven og koden selv.

## Husk

**Der bygges kun på én opgave ad gangen.** To `developer`-agenter i samme arbejdstræ skriver oven i hinanden.

**Den kan ikke spørge.** Den er en agent og sidder ikke i din tråd. Er noget uklart, skriver den det under `## Developers noter` → `### Uklart` og returnerer. Det er derfor interviewet skal være færdigt før den sendes af sted: en dårligt defineret opgave betales i genudsendelser.

**Den sætter ikke `afsluttet`.** Det gør `architect`, efter at have holdt noterne op mod `Færdig når`.

## Bagefter

Læs `## Developers noter` i opgavefilen og hold dem op mod `Færdig når`. Er noget ikke lavet, bliver det et **nyt** nummer — en opgave genåbnes aldrig.
