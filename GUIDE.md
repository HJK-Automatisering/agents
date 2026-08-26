# Guide: sådan arbejder vi med agent-roller

Til dig der skal bruge det. Læs den én gang, brug snydearket bagefter.

## Idéen på fem linjer

Vi bruger ikke én AI-assistent til alt. Vi bruger **ni roller**, der hver kan én ting og har forbud mod resten.

**Almindelig prosa udløser ingenting.** Skriver du bare i Claude Code, sker der ikke noget særligt. Rollerne træder først i kraft når du kalder dem: `/agents:kickoff`, `/agents:security`.

Rollerne taler ikke sammen — de afleverer markdown i `docs/`, og næste rolle læser den. **Tråde er engangs, filerne er hukommelsen.**

## Ordene

Sproget kolliderer let, så hold de to fra hinanden:

- **Rolle** — hvad det er. Der er ni. Det er dem du taler om.
- **Mekanisme** — hvordan den leveres. Enten en *skill* eller en *agent*.

Og de to slags roller, som er den skelnen du bruger i praksis:

**Samtalerolle** — du arbejder *sammen med* den. Den kører i din tråd, spørger ét spørgsmål ad gangen, og venter på svaret.
`kickoff` · `architect` · `developer` · `tester` · `debugger`

**Rapportrolle** — du sender den *af sted* og får et svar. Den kører i sit eget vindue og kan ikke rette noget.
`security` · `reviewer` · `scout` · `status`

Én sætning: **en samtalerolle taler med dig, en rapportrolle kommer tilbage med noget.**

## To modtagere

Det er den regel der bærer resten. Rollerne skriver to steder, og de skriver forskelligt:

**Til hinanden: filerne.** Numre, stier, funktionsnavne, struktureret markdown.

**Til dig: chatten.** Ét spørgsmål ad gangen, i almindeligt dansk, og så venter de. Filen er protokol over at spørgsmålet blev stillet — den er ikke måden at stille det.

Derfor skal du **aldrig åbne en fil for at svare på noget.** Heller ikke for at godkende. Rollen viser hvad der skal besluttes, du svarer i chatten, og rollen skriver det ind.

Og derfor slutter en rolle ikke midt i en dialog. Har den seks spørgsmål, bliver det seks runder i samme tråd — det går hurtigere end det lyder, fordi halvdelen bliver irrelevante undervejs.

## Hvorfor ikke bare én lang tråd

Tre grunde, i rækkefølge efter hvad de koster os:

1. **En lang tråd husker koden som den var.** Efter en times arbejde redigerer den selvsikkert ud fra en version af filen der ikke findes længere. Fejlen ser kompetent ud, og det er derfor den er dyr.
2. **En model der lige har skrevet koden er dårlig til at angribe den.** Den vil have at det virker. Derfor er `tester` og `security` egne kald — ikke fordi vi mangler plads, men fordi de skal være i dårligt humør.
3. **Konteksten bliver for stor**, og kvaliteten falder længe før den løber tør.

## Opsætning

**Én gang på din maskine:**

```
claude plugin marketplace update hjk-agents
claude plugin install agents@hjk-agents --scope user
```

`--scope user` er det vigtige — så gælder rollerne i alle dine projekter.

**Én gang pr. projekt:**

```
/agents:kickoff
```

Den finder selv ud af hvad der mangler: er projektet tomt, kører den hele interviewet. Findes projektet allerede uden kontrakt, lægger den bare kontrakt og skelet ind. Er alt på plads, siger den det og rører ingenting.

**Kopiér aldrig rollerne ind i et projekt.** En `.claude/agents/`-mappe i projektet overskriver plugin-rollerne, så centrale rettelser ikke virker. Det er den fejl der er sværest at se, fordi alt *ser* ud til at fungere.

## De ni roller

| Kald | Kører | Laver |
|---|---|---|
| `/agents:kickoff` | din tråd | Projektets dokument, `.gitignore`, `CLAUDE.md`, kontrakten |
| `/agents:architect` | din tråd | Ét dokument pr. nummer: hvad, hvorfor og hvordan |
| `/agents:developer` | din tråd | Koden |
| `/agents:tester` | din tråd | Acceptkriterier og tests |
| `/agents:debugger` | din tråd | Rettelse + årsagsanalyse |
| `/agents:security` | **eget vindue** | Fund: huller og logiske fejl |
| `/agents:reviewer` | **eget vindue** | Fund: oprydning og dokumentation |
| `/agents:scout` | **eget vindue** | Kort over en ukendt kodebase |
| `/agents:status` | **eget vindue** | Hvor står vi, og hvad er næste skridt |

Plus to hjælpekald: `/agents:workflow` tilføjer et fælles workflow, og `/agents:update` bringer projektets kontrakt ajour.

De fire rapportroller kan køre samtidig og fylder ikke din kontekst med deres filopslag.

**Kun to roller er teknisk spærret fra at redigere filer: `security` og `reviewer`.** For alle andre er "må ikke" en instruktion, ikke en lås. Sig det som det er — påstår du at noget er umuligt, og nogen ser det ske, mister hele metoden troværdighed.

## Et nyt projekt starter med en prosatekst

Du behøver ikke en plan eller en idé om teknologi. Du behøver den tekst du fik opgaven i.

```
/agents:kickoff

Her er opgaven: <indsæt prosateksten, ufuldstændig og løs som den er>
```

`kickoff` spørger **ét spørgsmål ad gangen**, hvert med et foreslået svar, så du kan sige "ja" og komme videre. Den bliver ved indtil to ting holder: problemet kan beskrives uden forbehold, og den kan navngive de første tre til fem numre.

Først derefter skriver den noget. Et afbrudt interview efterlader ingen halve filer.

Prosateksten gemmes ordret i dokumentet. Om tre måneder kan du se hvad der faktisk blev bedt om, kontra hvad vi udledte.

## Ét dokument pr. nummer

`docs/plans/0007-sagsliste-eksport.md` med to halvdele:

**Hvad og hvorfor** — problem, mål, ikke-mål, og *hvordan vi ser at det virker*. Kan læses alene.

**Sådan bygger vi det** — moduler, datamodel, afhængigheder, opgaver i rækkefølge.

`architect` skriver begge. Én godkendelse dækker dem. Og hver opgave i anden halvdel skal kunne **spores** til noget i første — kan den ikke det, hører den ikke til i nummeret. Det er den kontrol der forhindrer at et nummer vokser.

## Din rolle som menneske

Du har tre opgaver. Ikke flere.

**1. Du godkender — i samtalen.** Ingen rolle må sætte sit eget arbejde til `godkendt`. Men du skal aldrig åbne en fil for at gøre det: rollen viser hvad der skal besluttes, du svarer, og rollen skriver det ind.

**2. Du skriver kaldene.** Hver rolle slutter med at foreslå det næste kald, klar til at kopiere. **Ingen rolle starter den næste selv.**

**3. Du merger og ruller ud.** `færdig` betyder **i drift** — ikke "tests kører". Det sidste skridt er dit, fordi det tit rører produktionsdata. `status` fortæller dig hvor langt der er.

## Handoff: læs de to nederste linjer

```
HANDOFF
Nummer:       0007
Rolle:        architect
Udført:       Dokument med fire opgaver, rækkefølge fastlagt.
Filer:        docs/plans/0007-sagsliste-eksport.md
Næste:        ny tråd → /agents:tester 0007
Blokeret af:  intet
```

`Næste` peger **altid på en rolle**. Bolden står aldrig hos dig her — spørgsmål stilles og besvares i chatten, og blokken skrives først når retningen er kendt.

Præfikset siger hvad du skal gøre:

- **`ny tråd →`** — luk tråden, åbn en ny, indsæt kaldet.
- **`her →`** — skriv kaldet i den tråd du står i. Det er en rapportrolle; den kører isoleret.

Kaldet skrives som du taster det i appen — `/agents:architect Regellogik`. Ikke pakket ind i `claude "..."`; det er terminalformen, og vi sidder i skrivebordsappen.

## Hvor meget proces skal en opgave have

**Nyt projekt** — `/agents:kickoff`, godkend, så `/agents:architect`. Altid, uanset hvor lille projektet lyder.

**Lille** — tekstændring, tydelig fejl, ét felt mere: `/agents:developer` eller `/agents:debugger`. Ingen dokument. Én linje i `docs/decisions/log.md`.

**Mellem** — afgrænset feature, under en dag: `/agents:architect` → `/agents:developer` → `/agents:reviewer`.

**Stor** — nyt modul, ny integration, noget der rører data eller adgang: hele flowet. `security` er ikke valgfri her.

Og uanset størrelse: **der bygges kun på ét nummer ad gangen.** Er `byg` optaget, startes der ikke et nyt. Flere numre må gerne vente på udrulning.

## Miljø

Er projektet i Python, arbejdes der i en `.venv`. Det er antagelsen, og `kickoff` afklarer det ved projektstart.

Rollerne kalder fortolkeren direkte — `.venv\Scripts\python.exe -m pytest` — frem for at aktivere miljøet. Aktivering holder ikke fra ét kald til det næste, fordi hvert kald kører i sin egen skal.

Ingen pakke installeres globalt. Har projektet brug for en ny afhængighed, står det i et godkendt dokument.

## Kontrakten er en kopi

`AGENTS.md` i dit projekt blev lagt ind dengang `kickoff` kørte. **Opdaterer du plugin'et, følger den ikke med** — rollerne læser projektets kopi, ikke plugin'ets.

Derfor har den et versionsnummer i frontmatter, og derfor siger Claude Code til når den er bagud:

> KONTRAKTEN ER BAGUD. Projektets AGENTS.md er version 1; plugin'et har version 2.

Så kører du:

```
/agents:update
```

Den henter den nye kontrakt og **bevarer projektets egne afvigelser** — afsnittet `## Projektspecifikke afvigelser`, hvor det står hvis I bevidst gør noget anderledes end kontrakten siger.

Har nogen ændret i den generelle tekst i stedet for at bruge afvigelsesafsnittet, stopper den og spørger. Den overskriver ikke i tavshed.

Det er værd at kende, fordi symptomet ellers er forvirrende: rollerne opfører sig efter gamle regler, og man tror rettelserne ikke virker.

## Versionering

**Alt versionsstyres**, også `AGENTS.md` og `docs/`. Kontrakten koden blev skrevet under skal rejse sammen med koden.

Kun det personlige, det hemmelige og det genskabelige holdes ude: `.claude/settings.local.json`, `.env`, nøgler, `.venv/`, byggeoutput.

Det forudsætter at repoet er privat. **Et repo der indeholder `docs/findings/` må ikke gøres offentligt uden gennemgang** — fund kan beskrive sårbarheder der ikke er udbedret, og historik kan ikke gøres privat bagefter.

For koden:

- `.gitignore` før projektets anden fil. En committet hemmelighed kan ikke slettes, kun roteres.
- `.gitattributes` med `* text=auto eol=lf`. Windows-maskiner, Linux-containere.
- Én gren pr. nummer, én commit pr. afsluttet enhed, beskeder på dansk med nummer foran.
- **Push ved hvert handoff.** Ligger arbejdet kun lokalt, findes det ikke for næste tråd.
- **Ingen rolle ændrer et versionsnummer.** En udgivelse er din beslutning.

## Workflows

```
/agents:workflow
```

Ingen roller nævner workflows af sig selv. Vil du have et, kalder du det — og det kan du gøre når som helst, også på et projekt der har kørt i et halvt år.

I dag findes **`docker-publish`**: bygger og publicerer et container-image til GitHub Packages ved hvert push til `main`, signerer det, og giver dig et immutabelt `:sha-`tag at rulle tilbage til.

Vælger du det: **din `Dockerfile` skal tage imod `APP_VERSION` og `GIT_SHA`** som `ARG` og logge dem ved opstart. Ellers virker workflowet, men logvisningen kan ikke fortælle hvilken build der kører.

## Gennemspillet: en lille eksport-funktion

| # | Kald | Hvad der sker |
|---|---|---|
| 1 | `/agents:architect` | Dialog, ét spørgsmål ad gangen. Ét dokument med fire opgaver |
| 2 | *dig* | Godkender i samtalen |
| 3 | `/agents:tester` | Acceptkriterier — inkl. "tom liste giver en tom fil, ikke en fejl" |
| 4 | `/agents:developer` | Opgave 1-2 |
| 5 | `/agents:developer` | Opgave 3-4 |
| 6 | `/agents:tester` | Kører suiten. Ét fund: 10.000 rækker timer ud |
| 7 | `/agents:developer` | Retter fundet |
| 8 | `/agents:security` + `/agents:reviewer` | Samtidig, begge i eget vindue |
| 9 | `/agents:developer` | Udfører fundene |
| 10 | *dig* | Merger og ruller ud. **Nu er nummeret færdigt** |

Bemærk trin 3: acceptkriterierne blev skrevet **før** koden fandtes. Det er derfor tom-liste-tilfældet blev fanget.

Og trin 10: uden det er nummeret ikke færdigt, uanset hvor grøn suiten er.

## Faldgruber

**"Kan du lige også …"** Den mest almindelige. Du beder `developer` om at rette noget du opdagede undervejs. Så er der ændret kode som intet dokument dækker. Skriv den i loggen og tag den som sit eget nummer.

**Du fortsætter i samme tråd.** `/agents:architect` er færdig, og du skriver bare videre. Nu er `architect`s kontekst med i `developer`s arbejde. Handoff siger `ny tråd →` af en grund.

**Grønt er ikke færdigt.** 33 commits og en grøn suite er ikke en leverance hvis intet er merget. `status` siger hvor langt der er til drift — spørg den.

**Du godkender uden at læse.** Det eneste sted metoden kan fange en misforståelse, før den bliver kode.

**En `.claude/agents/` i projektet.** Overskriver plugin-rollerne. Alt ser ud til at virke, og dine rettelser rammer ingenting.

## Snydeark

```
Nyt eller uopsat projekt   /agents:kickoff
Hvad og hvordan            /agents:architect
Byg det                    /agents:developer
Acceptkriterier og tests   /agents:tester
Noget er i stykker         /agents:debugger      (altid ny tråd)

Huller og logiske fejl     /agents:security      (eget vindue)
Oprydning og dokumentation /agents:reviewer      (eget vindue)
Ukendt kodebase            /agents:scout         (eget vindue)
Hvor er vi                 /agents:status        (eget vindue)
Tilføj docker-publish      /agents:workflow
Kontrakten er bagud        /agents:update

Overblik      docs/BOARD.md
Dokumenter    docs/plans/NNNN-slug.md
Beslutninger  docs/decisions/log.md
Kontrakt      AGENTS.md

Spærret fra at rette   security, reviewer
Godkender              kun dig
Merger og udruller     kun dig
Starter næste rolle    kun dig
```

Er en rolle for løs eller for stram, ret den i `agents`-repoet — ikke i dit projekt. Så får alle rettelsen.
