# Guide: sådan arbejder vi med agent-roller

Til dig der skal bruge det. Læs den én gang, brug snydearket bagefter.

## Idéen på fem linjer

Vi bruger ikke én AI-assistent til alt. Vi bruger **ni roller** og elleve kald, der hver kan én ting og har forbud mod resten.

**Almindelig prosa udløser ingenting.** Skriver du bare i Claude Code, sker der ikke noget særligt. Rollerne træder først i kraft når du kalder dem: `/agents:kickoff`, `/agents:security`.

Og rollerne taler ikke sammen — de afleverer markdown i `docs/`, og næste rolle læser dem. **Tråde er engangs, filerne er hukommelsen.**

## Ordene

Sproget kolliderer let, så hold de to fra hinanden:

- **Rolle** — hvad det er. Der er ni. Det er dem du taler om.
- **Mekanisme** — hvordan den leveres. Enten en *skill* eller en *agent*.

Og de to slags roller, som er den skelnen du bruger i praksis:

**Samtalerolle** — du arbejder *sammen med* den. Den kører i din tråd, spørger, og du kan gribe ind.
`kickoff` · `brainstorm` · `architect` · `developer` · `tester` · `debugger`

**Rapportrolle** — du sender den *af sted* og får et svar. Den kører i sit eget vindue og kan ikke rette noget.
`security` · `reviewer` · `scout` · `status`

Én sætning: **en samtalerolle taler med dig, en rapportrolle kommer tilbage med noget.**

## Hvorfor ikke bare én lang tråd

Tre grunde, i rækkefølge efter hvad de koster os:

1. **En lang tråd husker koden som den var.** Efter en times arbejde redigerer den selvsikkert ud fra en version af filen der ikke findes længere. Fejlen ser kompetent ud, og det er derfor den er dyr.
2. **En model der lige har skrevet koden er dårlig til at angribe den.** Den vil have at det virker. Derfor er `tester` og `security` egne kald — ikke fordi vi mangler plads, men fordi de skal være i dårligt humør.
3. **Konteksten bliver for stor**, og kvaliteten falder længe før den løber tør.

## Opsætning

**Én gang på din maskine:**

```
claude plugin marketplace add HJK-Automatisering/agents
claude plugin install agents@hjk-agents --scope user
```

`--scope user` er det vigtige — så gælder rollerne i alle dine projekter og ikke kun den mappe du står i.

**Én gang pr. projekt:**

```
/agents:kickoff
```

Den finder selv ud af hvad der mangler: er projektet tomt, kører den hele interviewet. Findes projektet allerede uden kontrakt, lægger den bare kontrakt og skelet ind. Er alt på plads, siger den det og rører ingenting.

**Kopiér aldrig rollerne ind i et projekt.** En `.claude/agents/`-mappe i projektet overskriver plugin-rollerne, så centrale rettelser ikke virker. Det er den fejl der er sværest at se, fordi alt *ser* ud til at fungere.

## De ni roller

| Kald | Kører | Laver |
|---|---|---|
| `/agents:kickoff` | din tråd | Charter, fundament, `.gitignore`, `CLAUDE.md` |
| `/agents:brainstorm` | din tråd | Spec: hvad og hvorfor |
| `/agents:architect` | din tråd | Plan: hvordan, opdelt i opgaver |
| `/agents:developer` | din tråd | Koden |
| `/agents:tester` | din tråd | Acceptkriterier og tests |
| `/agents:debugger` | din tråd | Rettelse + årsagsanalyse |
| `/agents:security` | **eget vindue** | Fund: huller og logiske fejl |
| `/agents:reviewer` | **eget vindue** | Fund: oprydning og dokumentation |
| `/agents:scout` | **eget vindue** | Kort over en ukendt kodebase |
| `/agents:status` | **eget vindue** | Hvor står vi, og hvad er næste skridt |
| `/agents:workflow` | din tråd | Tilføjer et fælles workflow, fx docker-publish |

De fire nederste kan køre samtidig og fylder ikke din kontekst med deres filopslag.

**Kun to roller er teknisk spærret fra at redigere filer: `security` og `reviewer`.** For alle andre er "må ikke" en instruktion, ikke en lås. Sig det som det er — påstår du at noget er umuligt, og nogen ser det ske, mister hele metoden troværdighed.

## Et nyt projekt starter med en prosatekst

Du behøver ikke en spec, en plan eller en idé om teknologi. Du behøver den tekst du fik opgaven i.

```
/agents:kickoff

Her er opgaven: <indsæt prosateksten, ufuldstændig og løs som den er>
```

`kickoff` interviewer dig i **rul af tre til fire spørgsmål**, hvert med et foreslået svar, så du kan sige "ja" og komme videre. Den bliver ved indtil to ting holder: problemet kan beskrives uden forbehold, og den kan navngive de første tre til fem opgaver.

Først derefter skriver den noget. Et afbrudt interview efterlader ingen halve filer.

Prosateksten gemmes ordret i charteret. Om tre måneder kan du se hvad der faktisk blev bedt om, kontra hvad vi udledte.

## Din rolle som menneske

Du har tre opgaver. Ikke flere.

**1. Du godkender — i samtalen.** Ingen rolle må sætte sit eget arbejde til `godkendt`. Men du skal aldrig åbne en fil for at godkende: rollen viser dig hvad der skal besluttes, du svarer *godkendt* eller siger hvad der skal laves om, og **rollen skriver det ind**. Det er dit eneste reelle kontrolpunkt — og det er nok, fordi alt andet er skrevet ned.

**2. Du skriver kaldene.** Hver rolle slutter med at foreslå det næste kald, klar til at kopiere. **Ingen rolle starter den næste selv.** Det er med vilje: det er der du fanger at noget er gået skævt, mens det stadig er billigt.

**3. Du afgør uenigheder.** Kører to roller i ring om samme punkt, eskalerer de til dig efter to runder — med et konkret A/B-valg.

## Handoff: læs de to nederste linjer

Hver rolle slutter sådan:

```
HANDOFF
Nummer:       0007
Rolle:        architect
Udført:       Plan med fire opgaver, rækkefølge fastlagt.
Filer:        docs/plans/0007-sagsliste-eksport.md
Næste:        ny tråd → /agents:tester — acceptkriterier ud fra planen
Blokeret af:  intet
```

`Næste` har tre former, og præfikset fortæller dig hvad du skal gøre:

- **`ny tråd →`** — luk tråden, åbn en ny, indsæt kaldet.
- **`her →`** — skriv kaldet i den tråd du står i. Det er en rapportrolle; den kører isoleret.
- **`menneske`** — bolden er din. Rollen bliver i tråden og venter på dit svar; den skriver det ind når det kommer.

Kaldet skrives som du taster det i appen — `/agents:brainstorm Regellogik`. Ikke pakket ind i `claude "..."`; det er terminalformen, og vi sidder i skrivebordsappen.

## Hvor meget proces skal en opgave have

**Nyt projekt** — `/agents:kickoff`, godkend, så `/agents:brainstorm`. Altid, uanset hvor lille projektet lyder.

**Lille** — tekstændring, tydelig fejl, ét felt mere: `/agents:developer` eller `/agents:debugger`. Ingen spec, ingen plan. Én linje i `docs/decisions/log.md`.

**Mellem** — afgrænset feature, under en dag: `/agents:brainstorm` (kort spec) → `/agents:developer` → `/agents:reviewer`. Spring `architect` over hvis planen er indlysende.

**Stor** — nyt modul, ny integration, noget der rører data eller adgang: hele flowet. `security` er ikke valgfri her.

Tvivl? Tag et spor op. En overflødig plan koster tyve minutter; en manglende koster en uge.

## Versionering

**GitHub er til kode.** `docs/`, `AGENTS.md` og `.claude/` versionsstyres ikke — projektets `.gitignore` holder dem ude fra første commit. `docs/findings/` kan indeholde sikkerhedsfund der ikke er udbedret endnu.

Det betyder at filerne er hukommelse mellem *tråde*, ikke mellem *maskiner*. Vi arbejder som udgangspunkt alene på et projekt; skal en anden overtage, overdrages `docs/` uden om git.

For koden:

- **`.gitignore` før projektets anden fil.** En committet hemmelighed kan ikke slettes, kun roteres.
- **`.gitattributes` med `* text=auto eol=lf`.** Windows-maskiner, Linux-containere.
- **Én gren pr. nummer**, én commit pr. afsluttet enhed, beskeder på dansk med nummer foran.
- **Push når koden er færdig og testet** — ikke ved hvert handoff. De fleste handoffs flytter kun markdown.

## Workflows

```
/agents:workflow
```

Ingen roller nævner workflows af sig selv. Vil du have et, kalder du det — og det kan du gøre når som helst, også på et projekt der har kørt i et halvt år. Det er derfor det ikke ligger i `kickoff`: den kører én gang, og beslutningen om at containerisere kommer tit senere.

Skillen viser hvad der findes, spørger ja eller nej pr. workflow, og kopierer filerne ind.

I dag findes **`docker-publish`**: bygger og publicerer et container-image til GitHub Packages ved hvert push til `main`, signerer det med cosign, og giver dig et immutabelt `:sha-`tag at rulle tilbage til.

Vælger du det: **din `Dockerfile` skal tage imod `APP_VERSION` og `GIT_SHA`** som `ARG` og logge dem ved opstart. Ellers virker workflowet, men logvisningen kan ikke fortælle hvilken build der kører.

Alt projektet ikke opfylder i dag — manglende `Dockerfile`, indstillinger i GitHub — skriver skillen på `docs/BOARD.md`, så det ikke bliver glemt.

## Gennemspillet: en lille eksport-funktion

| # | Kald | Hvad der sker |
|---|---|---|
| 1 | `/agents:brainstorm` | Spec, efter et par runders spørgsmål |
| 2 | *dig* | Godkender |
| 3 | `/agents:architect` | Plan med fire opgaver |
| 4 | *dig* | Godkender |
| 5 | `/agents:tester` | Acceptkriterier — inkl. "tom liste giver en tom fil, ikke en fejl" |
| 6 | `/agents:developer` | Opgave 1-2 |
| 7 | `/agents:developer` | Opgave 3-4 |
| 8 | `/agents:tester` | Kører suiten. Ét fund: 10.000 rækker timer ud |
| 9 | `/agents:developer` | Retter fundet |
| 10 | `/agents:security` + `/agents:reviewer` | Samtidig, begge i eget vindue |
| 11 | `/agents:developer` | Udfører fundene |

Bemærk trin 5: acceptkriterierne blev skrevet **før** koden fandtes. Det er derfor tom-liste-tilfældet blev fanget.

## Faldgruber

**"Kan du lige også …"** Den mest almindelige. Du beder `developer` om at rette noget du opdagede undervejs. Så er der ændret kode som ingen plan dækker. Skriv den i loggen og tag den som sin egen opgave.

**Du fortsætter i samme tråd.** `/agents:architect` er færdig, og du skriver bare videre. Nu er `architect`s kontekst med i `developer`s arbejde. Handoff siger `ny tråd →` af en grund.

**Spec fuld af `ÅBENT`.** Så er det ikke en spec, det er en spørgeliste. Send den tilbage.

**Du godkender uden at læse.** Det eneste sted metoden kan fange en misforståelse, før den bliver kode.

**En `.claude/agents/` i projektet.** Overskriver plugin-rollerne. Alt ser ud til at virke, og dine rettelser rammer ingenting.

## Snydeark

```
Nyt eller uopsat projekt   /agents:kickoff
Hvad skal vi bygge         /agents:brainstorm
Hvordan bygger vi det      /agents:architect
Byg det                    /agents:developer
Acceptkriterier og tests   /agents:tester
Noget er i stykker         /agents:debugger      (altid ny tråd)

Huller og logiske fejl     /agents:security      (eget vindue)
Oprydning og dokumentation /agents:reviewer      (eget vindue)
Ukendt kodebase            /agents:scout         (eget vindue)
Hvor er vi                 /agents:status        (eget vindue)
Tilføj docker-publish     /agents:workflow

Overblik      docs/BOARD.md
Beslutninger  docs/decisions/log.md
Kontrakt      AGENTS.md

Spærret fra at rette   security, reviewer
Godkender              kun dig
Starter næste rolle    kun dig
```

Er en rolle for løs eller for stram, ret den i `agents`-repoet — ikke i dit projekt. Så får alle rettelsen.
