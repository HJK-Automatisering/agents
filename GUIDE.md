# Guide: sådan arbejder vi med agent-roller

Til dig der skal bruge det. Læs den én gang, brug snydearket bagefter.

## Idéen på fem linjer

Vi bruger ikke én AI-assistent til alt. Vi bruger **ni roller**, der hver kan én ting og har forbud mod resten.

**Du sidder hos én af dem.** `architect` er navet: den interviewer dig, opretter opgaverne, og sender de andre roller af sted. De kommer tilbage med en rapport. Alt vender tilbage til navet.

**Almindelig prosa udløser ingenting.** Skriver du bare i Claude Code, sker der ikke noget særligt. Rollerne træder først i kraft når du kalder dem.

Rollerne taler ikke sammen — de afleverer markdown i `docs/`, og `architect` læser den. **Tråde er engangs, filerne er hukommelsen.**

## Ordene

Sproget kolliderer let, så hold de to fra hinanden:

- **Rolle** — hvad det er. Der er ni. Det er dem du taler om.
- **Mekanisme** — hvordan den leveres. Enten en *skill* eller en *agent*.

Og de to slags roller, som er den skelnen du bruger i praksis:

**Samtalerolle** — du arbejder *sammen med* den. Den kører i din tråd, spørger ét spørgsmål ad gangen, og venter på svaret.
`architect` · `kickoff`

**Rapportrolle** — du sender den *af sted* og får et svar tilbage. Den kører i sit eget vindue.
`developer` · `tester` · `security` · `reviewer` · `debugger` · `scout` · `status`

Én sætning: **`architect` taler med dig, alle andre kommer tilbage med noget.**

`developer` er også en rapportrolle. Den bygger, men den sidder ikke i din tråd — den får en opgave, skriver koden, og svarer i opgavefilens noter.

## Navet

Det er den ændring der betyder mest i praksis. **Du skifter ikke tråd mellem hvert skridt.**

Du åbner `/agents:architect`. Derfra:

- Den interviewer dig frem til en opgave der kan bygges.
- Den sender `developer` af sted. Den kommer tilbage.
- Skal noget prøves, sender den `tester` af sted. Den kommer tilbage med en rapport.
- Hvert fund i rapporten bliver en ny opgave, eller bliver afvist med en begrundelse.

**Der er ingen kæde.** Ingen rolle sender bolden videre til en tredje. Alt går gennem navet, og navet er der hvor du er.

Det betyder også at `architect`s tråd bliver langlivet. Den lukker den selv, når den siger til — og triggeren er ikke at tråden er lang, men at den rummer noget filerne ikke gør.

## To modtagere

Det er den regel der bærer resten. Rollerne skriver to steder, og de skriver forskelligt:

**Til hinanden: filerne.** Numre, stier, funktionsnavne, struktureret markdown.

**Til dig: chatten.** Ét spørgsmål ad gangen, i almindeligt dansk, og så venter de. Filen er protokol over at spørgsmålet blev stillet — den er ikke måden at stille det.

Derfor skal du **aldrig åbne en fil for at svare på noget.** `architect` viser hvad der skal afgøres, du svarer i chatten, og den skriver det ind.

**Kun `architect` og `kickoff` kan spørge.** En agent sidder ikke i din tråd. Er noget uklart for den, skriver den det ned og returnerer det — og `architect` læser det som et spørgsmål til dig. Det er derfor interviewet skal være ordentligt: en dårligt defineret opgave betales i genudsendelser.

## Hvorfor ikke bare én lang tråd til alt

Tre grunde, i rækkefølge efter hvad de koster os:

1. **En lang tråd husker koden som den var.** Efter en times arbejde redigerer den selvsikkert ud fra en version af filen der ikke findes længere. Fejlen ser kompetent ud, og det er derfor den er dyr.
2. **En model der lige har skrevet koden er dårlig til at angribe den.** Den vil have at det virker. Derfor er `tester` og `security` egne agenter — ikke fordi vi mangler plads, men fordi de skal være i dårligt humør.
3. **Konteksten bliver for stor**, og kvaliteten falder længe før den løber tør. En agent læser hundrede filer i sit eget vindue; du får resultatet, ikke arbejdet.

## Forudsætning: Node

Plugin'ets SessionStart-hook kører på Node. Den er det der siger til når du står i et tomt projekt, eller når projektets kontrakt er bagud i forhold til plugin'ets.

**Node skal være installeret på maskinen.** Claude Code har sin egen Node-runtime bagt ind i sin binære fil, men den er ikke tilgængelig for hooks — de skal bruge systemets.

```
winget install --id OpenJS.NodeJS.LTS
```

**Administratorrettigheder skal være aktiveret på pc'en inden du kører den.** Uden dem fejler installationen midtvejs, og resultatet er en halvt installeret Node der er værre end ingen.

Tjek bagefter, i en **ny** terminal:

```
node --version
```

### Hvis Node mangler

Så gør hooken ingenting, og **den siger det ikke.** Alt andet virker: alle elleve kald, alle roller, kontrakten. Du mister kun de tre automatiske tjek.

Det betyder i praksis at du selv skal huske at køre `/agents:update` når plugin'et er blevet opdateret. Uden hooken er der ingen der gør opmærksom på at projektets kontrakt er blevet forældet.

Kør derfor `node --version` som en del af opsætningen, og ikke først når noget opfører sig underligt.

## Opsætning

**Én gang på din maskine:**

```
claude plugin marketplace add HJK-Automatisering/agents
claude plugin install agents@hjk-agents --scope user
```

`--scope user` er det vigtige — så gælder rollerne i alle dine projekter.

**Ved hver ny version — begge, hver gang:**

```
claude plugin marketplace update hjk-agents
claude plugin install agents@hjk-agents --scope user
```

Springer du den første over, sker der ingenting, og der kommer ingen fejl. Se `PLUGIN.md`.

**Én gang pr. projekt:**

```
/agents:kickoff
```

Den finder selv ud af hvad der mangler: er projektet tomt, kører den hele interviewet. Findes projektet allerede uden kontrakt, lægger den bare kontrakt og skelet ind. Er alt på plads, siger den det og rører ingenting.

**Kopiér aldrig rollerne ind i et projekt.** En `.claude/agents/`-mappe i projektet overskriver plugin-rollerne, så centrale rettelser ikke virker. Det er den fejl der er sværest at se, fordi alt *ser* ud til at fungere.

## De ni roller

| Kald | Kører | Laver | Svarer til |
|---|---|---|---|
| `/agents:kickoff` | din tråd | Projektets dokument, `.gitignore`, `CLAUDE.md`, kontrakten | dig |
| `/agents:architect` | **din tråd** | Opgaverne. Sender alle andre af sted | dig |
| `/agents:developer` | eget vindue | Koden, plus noter i opgavefilen | `architect` |
| `/agents:tester` | eget vindue | Rapport: holder sammenhængen | `architect` |
| `/agents:security` | eget vindue | Rapport: huller og logiske fejl | `architect` |
| `/agents:reviewer` | eget vindue | Rapport: oprydning og dokumentation | `architect` |
| `/agents:debugger` | eget vindue | Rapport: årsagen til én fejl | `architect` |
| `/agents:scout` | eget vindue | Kort over en ukendt kodebase | `architect` |
| `/agents:status` | eget vindue | Læser projektet som helhed og vurderer næste skridt | dig |

Plus to hjælpekald: `/agents:workflow` tilføjer et fælles workflow, og `/agents:update` bringer projektets kontrakt ajour.

**Du behøver ikke kalde dem selv.** `architect` sender dem af sted. Du kan gøre det direkte — `/agents:security` før en udrulning, `/agents:status` når du vil vide hvor du står — men det normale er at arbejdet går gennem navet.

De undersøgende agenter kan køre samtidig og fylder ikke din kontekst med deres filopslag.

**Ingen rolle er teknisk spærret fra at ændre filer.** Rapportrollerne har ikke `Edit`, så de kan ikke rette en linje i en eksisterende fil. Men de fleste har `Write`, alle har `Bash`, og med dem kan man skrive hvad som helst. `status` har kun `Bash`.

Så "må ikke" er en instruktion overalt, ikke en lås. Sig det som det er — påstår du at noget er umuligt, og nogen ser det ske, mister hele metoden troværdighed.

## Et nyt projekt starter med en prosatekst

Du behøver ikke en plan eller en idé om teknologi. Du behøver den tekst du fik opgaven i.

```
/agents:kickoff

Her er opgaven: <indsæt prosateksten, ufuldstændig og løs som den er>
```

`kickoff` spørger **ét spørgsmål ad gangen**, hvert med et foreslået svar, så du kan sige "ja" og komme videre. Den bliver ved indtil to ting holder: problemet kan beskrives uden forbehold, og den kan navngive de første tre til fem emner.

Først derefter skriver den noget. Et afbrudt interview efterlader ingen halve filer.

Prosateksten gemmes ordret i `docs/projekt.md`. Om tre måneder kan du se hvad der faktisk blev bedt om, kontra hvad vi udledte.

## Et nummer er en opgave

Der er to niveauer, og kun det ene er nummereret:

**Den grove liste** står på `docs/BOARD.md` under `Kommende`. Emnelinjer, ingen numre. Det er hvad `architect` kan se der skal laves.

**Den definerede opgave** er `docs/tasks/task-0042-slug.md`. Den findes først når interviewet har gjort emnet udførbart. Viser interviewet at emnet dækker flere uafhængige ting, deler `architect` det i flere numre — når det er blevet klart, ikke på forhånd.

Og modsat: en opgave skal være stor nok til at bære en tråd. *"Lav en `.dockerignore`"* er ikke en opgave. *"Hemmeligheder ude af det byggede image"* er.

### Fem mapper, fem tællere

| Mappe | Fil | Skrevet af |
|---|---|---|
| `docs/tasks/` | `task-NNNN-slug.md` | `architect` |
| `docs/tests/` | `test-NNNN-slug.md` | `tester` |
| `docs/securities/` | `security-NNNN-slug.md` | `security` |
| `docs/reviews/` | `review-NNNN-slug.md` | `reviewer` |
| `docs/debugs/` | `debug-NNNN-slug.md` | `debugger` |

Hver mappe tæller for sig. `task-0001` og `security-0001` findes samtidig og har intet med hinanden at gøre — **derfor er præfikset obligatorisk.** Et bart `0001` betyder ikke noget.

**Rapporten er kilden, opgaven er dens afkom.** En testrapport afføder numre; hvert nummer skriver i sit `Kilde`-felt hvilken rapport det kom af, og rapporten lister hvad den afled. Det er den binding der gør at et fund kan spores til den kode der lukkede det.

## Status: to sæt

En opgave og en rapport har ikke samme livscyklus, så de har ikke samme ord.

**Opgaver:** `planlagt` → `i-gang` → `afsluttet`.

`afsluttet` betyder bygget **eller** afvist. **En opgave genåbnes aldrig** — skal noget bygges om, er det et nyt nummer. Det er `architect` der vurderer om en opgave er bygget, ikke `developer`.

**Rapporter:** `klar til behandling` → `behandlet`.

`behandlet` betyder at hvert punkt i rapporten er blevet en opgave eller er afvist med en begrundelse i beslutningsloggen. En rapport der står `klar til behandling`, har uafhentede fund — **det er det eneste sted et fund kan forsvinde i denne model.** `status` viser dem.

**Udrulning er ikke en status.** Der er ingen `afventer udrulning`. Udrulning er noget du gør; `security` kører før, og `status` fortæller hvor langt der er.

## Din rolle som menneske

Du har tre opgaver. Ikke flere.

**1. Du bliver interviewet — og det er dér du afgør hvad opgaven er.** Der er ikke et godkendelsestrin bagefter: `architect`s oprettelse af opgaven **er** godkendelsen, fordi den hviler på interviewet du var med i. Sig nej undervejs, ikke til sidst.

**2. Du afgør hvad der sendes af sted.** Skal der testes nu, eller bygges videre? Skal der en maskinel kontrol til, eller er en advarsel i filen nok? `architect` anbefaler; du bestemmer. Det er dér proportionaliteten afgøres — ikke af en regel inde i `tester`.

**3. Du siger ja til merge og push — og du ruller ud.** Er en gren færdig, giver `architect` dig de linjer der skal køres, og spørger om den skal køre dem. Siger du ja, kører den dem; siger du nej, står linjerne der til dig selv. **Ja'et gælder kun den ene gang** — næste gren bliver du spurgt igen. Udrulningen er alene din, fordi den tit rører produktionsdata. `status` fortæller dig hvor langt der er.

## Lukning og retur

Der er ikke længere en handoff-blok med et næste kald. Der er to blokke.

**`architect` og `kickoff` lukker deres tråd:**

```
LUKNING
Skrevet:      docs/tasks/task-0042-schema-baseline.md, docs/decisions/log.md
Åbent:        test-0003 er klar til behandling, 2 punkter tilbage
Næste:        interview task-0043 — pagineringen i NSP-kaldet
Uskrevet:     intet
```

**`Uskrevet` skal stå på `intet`.** Står der noget andet, er tråden ikke klar til at lukke — den rummer viden filerne ikke gør, og den viden forsvinder med tråden.

**Agenterne returnerer:**

```
RETUR
Rolle:        tester
Fil:          docs/tests/test-0003-etl-sammenhaeng.md
Fund:         3
  1. Vandmærket kan flytte forbi rækker der aldrig blev læst.
  2. Ingen kontrol af hvad der ligger i det byggede image.
  3. Tomt datointerval giver en tom skrivning uden fejl.
Uklart:       intet
```

Én linje pr. fund, i almindeligt dansk. **Rapporten kommer ikke ind i din tråd** — kun henvisningen og linjerne. Det er med vilje: fem rapporter tømt ind i tråden fylder den, og så bliver den komprimeret.

## `status` er den der ser helheden

`architect` ser det den arbejder på. `status` læser dem alle — plus beslutningsloggen, git-tilstanden og afstanden til drift.

Den skriver ingenting, heller ikke `BOARD.md`. Finder den at BOARD er uenig med filerne, siger den det; `architect` retter det.

To ting kan kun ses derfra:

- **En rapport med uafhentede fund.** Har den stået der i dagevis, er det et fund på vej til at blive glemt.
- **Om arbejdet står mål med det der blev bedt om.** Den holder `docs/projekt.md` op mod grenen — især om en opgave har avlet mere kontrol end leverance.

## Hvor meget proces skal en opgave have

Det er ikke længere et spørgsmål om at vælge en rute. **Ruten er den samme; det er dig der afgør hvad der sendes af sted.**

- **Nyt projekt** — `/agents:kickoff`, så `/agents:architect`. Altid.
- **Alt andet** — `/agents:architect`. Den interviewer, opretter opgaven, og sender `developer` af sted.

Og så er der de tre valg du tager undervejs:

| Spørgsmål | Hvornår svaret er ja |
|---|---|
| Skal `tester` af sted? | Der er noget at prøve **på tværs**. Ikke fordi en opgave blev bygget |
| Skal `security` af sted? | **Før en udrulning.** Ikke løbende |
| Skal `reviewer` af sted? | Noget er bygget og skal ryddes op bagefter |

**Der bygges kun på én opgave ad gangen.** To `developer`-agenter i samme arbejdstræ skriver oven i hinanden. De undersøgende agenter kan godt køre samtidig.

## Miljø

Er projektet i Python, arbejdes der i en `.venv`. Det er antagelsen, og `kickoff` afklarer det ved projektstart.

Rollerne kalder fortolkeren direkte — `.venv\Scripts\python.exe -m pytest` — frem for at aktivere miljøet. Aktivering holder ikke fra ét kald til det næste, fordi hvert kald kører i sin egen skal.

Ingen pakke installeres globalt. Har projektet brug for en ny afhængighed, står det i en opgave.

## Kontrakten er en kopi

`AGENTS.md` i dit projekt blev lagt ind dengang `kickoff` kørte. **Opdaterer du plugin'et, følger den ikke med** — rollerne læser projektets kopi, ikke plugin'ets.

Derfor har den et versionsnummer i frontmatter, og derfor siger Claude Code til når den er bagud:

> KONTRAKTEN ER BAGUD. Projektets AGENTS.md er version 9; plugin'et har version 10.

Så kører du:

```
/agents:update
```

Den henter den nye kontrakt og **bevarer projektets egne afvigelser** — afsnittet `## Projektspecifikke afvigelser`, hvor det står hvis I bevidst gør noget anderledes end kontrakten siger.

Har nogen ændret i den generelle tekst i stedet for at bruge afvigelsesafsnittet, stopper den og spørger. Den overskriver ikke i tavshed.

**Ændrer kontrakten mappestrukturen, flytter `update` ikke dine filer.** Den opdager forskellen, siger hvor mange filer der ligger i de gamle mapper, og lægger vejene frem. Valget er dit — en omdøbning af `docs/` ændrer hvad hver fil hedder, og det er ikke et trin i en opdatering.

## Versionering

**Alt versionsstyres**, også `AGENTS.md` og `docs/`. Kontrakten koden blev skrevet under skal rejse sammen med koden.

Kun det personlige, det hemmelige og det genskabelige holdes ude: `.claude/settings.local.json`, `.env`, nøgler, `.venv/`, byggeoutput.

Det forudsætter at repoet er privat. **Et repo der indeholder `docs/securities/` må ikke gøres offentligt uden gennemgang** — fund kan beskrive sårbarheder der ikke er udbedret, og historik kan ikke gøres privat bagefter. Samme forsigtighed gælder `docs/reviews/` og `docs/debugs/`.

For koden:

- `.gitignore` før projektets anden fil. En committet hemmelighed kan ikke slettes, kun roteres.
- `.gitattributes` med `* text=auto eol=lf`. Windows-maskiner, Linux-containere.
- Én gren pr. opgave — `task-0042-schema-baseline` — én commit pr. afsluttet enhed, beskeder på dansk med nummeret foran.
- **Rollerne committer. Merge og push kræver dit ja hver gang.** `architect` viser linjerne og spørger; ingen anden rolle rører dem. Næste tråd læser arbejdstræet på din maskine og har ikke brug for et push. `status` siger hvor mange commits der ligger upushet.
- **Ingen rolle ændrer et versionsnummer.** En udgivelse er din beslutning.

## Workflows

```
/agents:workflow
```

Ingen roller nævner workflows af sig selv. Vil du have et, kalder du det — og det kan du gøre når som helst, også på et projekt der har kørt i et halvt år.

I dag findes **`docker-publish`**: bygger og publicerer et container-image til GitHub Packages ved hvert push til `main`, signerer det, og giver dig et immutabelt `:sha-`tag at rulle tilbage til.

Vælger du det: **din `Dockerfile` skal tage imod `APP_VERSION` og `GIT_SHA`** som `ARG` og logge dem ved opstart. Ellers virker workflowet, men logvisningen kan ikke fortælle hvilken build der kører.

## Gennemspillet: en lille eksport-funktion

Alt herunder sker i **én** tråd, bortset fra det du selv gør til sidst.

| # | Hvad | Hvor |
|---|---|---|
| 1 | `/agents:architect` — dialog, ét spørgsmål ad gangen | din tråd |
| 2 | Den opretter `task-0012 — sagsliste kan eksporteres` | din tråd |
| 3 | Den sender `developer` af sted. Kommer tilbage: bygget, én ting uklar | agent |
| 4 | Du svarer på det uklare. Den vurderer opgaven `afsluttet` | din tråd |
| 5 | Den spørger: skal sammenhængen prøves? Du siger ja | din tråd |
| 6 | `tester` af sted. Kommer tilbage: **10.000 rækker timer ud** | agent |
| 7 | Fundet bliver `task-0013`. `developer` af sted igen | agent |
| 8 | Du siger: klar til udrulning. `security` af sted | agent |
| 9 | To fund bliver opgaver, ét afvises med begrundelse i loggen | din tråd |
| 10 | Den viser merge- og push-linjerne og spørger. Du siger ja | din tråd |
| 11 | **Du ruller ud** | dig |

Bemærk trin 5: der blev **spurgt** om der skulle testes. Der er ingen station der fyrer af sig selv, og det er derfor `task-0012` ikke fik et testapparat større end sig selv.

Og trin 10-11: uden dem er der ikke leveret noget, uanset hvor grønt det ser ud. Havde du sagt nej i trin 10, stod de samme linjer klar til dig selv.

## Faldgruber

**"Kan du lige også …"** Den mest almindelige. Du beder om at få rettet noget du opdagede undervejs. Så er der ændret kode som ingen opgave dækker. Det bliver et nummer, eller det bliver ikke lavet.

**Du lader tråden bære en beslutning.** I stjernemodellen er `architect`s tråd langlivet, og den bliver komprimeret. Alt der kun står i samtalen, forsvinder. Det er derfor `Uskrevet` skal stå på `intet` før tråden lukkes.

**En rapport der bliver liggende.** `klar til behandling` i tre dage er tre dages fund ingen har afgjort. Spørg `status`.

**Grønt er ikke leveret.** 33 commits og en grøn suite er ikke en leverance hvis intet er merget.

**En for lille opgave.** *"Lav en `.dockerignore`"* kan ikke bære en tråd og trækker kontrol til sig som var den et helt nummer. Interview den frem til noget der har et formål.

**Overdefinering.** Den nye version af den gamle fejl. Et interview hakket i småstykker koster det samme som en fil testet i småstykker. Spærren står i kontrakten: kan `architect` ikke finde noget der taler imod, har den ikke et spørgsmål.

**En `.claude/agents/` i projektet.** Overskriver plugin-rollerne. Alt ser ud til at virke, og dine rettelser rammer ingenting.

## Snydeark

```
Nyt eller uopsat projekt   /agents:kickoff
Alt arbejde                /agents:architect     ← her sidder du
Hvor er vi                 /agents:status        (eget vindue)
Tilføj docker-publish      /agents:workflow
Kontrakten er bagud        /agents:update

Sendes af sted af architect:
  developer   bygger én opgave
  tester      prøver sammenhængen        (ikke pr. opgave)
  security    før en udrulning           (ikke løbende)
  reviewer    oprydning bagefter
  debugger    årsagen til én fejl
  scout       kort over ukendt kodebase

Overblik      docs/BOARD.md
Projektet     docs/projekt.md
Opgaver       docs/tasks/task-NNNN-slug.md
Rapporter     docs/{tests,securities,reviews,debugs}/
Beslutninger  docs/decisions/log.md
Kontrakt      AGENTS.md

Opgavestatus  planlagt · i-gang · afsluttet
Rapportstatus klar til behandling · behandlet

Ændrer kode            kun developer
Opretter opgaver        kun architect
Afgør hvad der testes   kun dig
Merge og push           architect spørger, du svarer — hver gang
Udruller                kun dig
```

Er en rolle for løs eller for stram, ret den i `agents`-repoet — ikke i dit projekt. Så får alle rettelsen.
