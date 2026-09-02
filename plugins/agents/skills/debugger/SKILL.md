---
description: "Sætter debugger-agenten på én konkret fejl: reproducerer, indsnævrer og forklarer årsagen. Kører isoleret, skriver en årsagsanalyse til architect, og retter ingenting."
disable-model-invocation: true
---

# debugger

Send `debugger`-agenten af sted med Agent-værktøjet, `subagent_type: agents:debugger`.

## Brug den når

Der er **én konkret fejl** med et observeret symptom. Ikke en fornemmelse af at noget er langsomt, ikke en mistanke — et symptom nogen har set.

Er der flere fejl, sendes den af sted én gang pr. fejl. En agent der undersøger tre fejl, finder årsagen til ingen af dem.

## Giv den

- **Symptomet, så præcist du har det.** Fejlbesked ordret, hvad der blev gjort, hvad der skete i stedet.
- Hvor det blev observeret: hvilket miljø, hvilken kørsel, hvornår.
- Hvad du allerede har udelukket.

## Husk

**Den retter ikke fejlen.** Den finder årsagen og forklarer den. Rettelsen bliver en opgave til `developer` — det er dig der opretter den, når du har læst analysen.

Det er med vilje: en minimal rettelse foretaget af den der lige har brugt en time i fejlen, ser altid rigtig ud. Adskillelsen tvinger årsagen til at være forklaret, før den bliver rettet.

**Kunne den ikke reproducere fejlen, er det ikke en fejlet kørsel.** Så er svaret hvad der skal til for at reproducere den, og det er ofte det mest brugbare resultat.

## Bagefter

Læs analysen. Er årsagen forklaret, opret rettelsen som en opgave — med `Færdig når` udledt af analysens `Forebyggelse`-afsnit, så fejlklassen ikke kan komme igen ubemærket.

Er årsagen strukturel, er rettelsen ikke én opgave. Så er den et interview.
