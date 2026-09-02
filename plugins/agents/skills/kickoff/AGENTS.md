---
kontrakt-version: 12
---

# AGENTS.md — fælles kontrakt

Denne fil arves af **alle** roller i plugin'et `agents`. Læs den før du gør noget andet.

Ved konflikt: rollefilen bestemmer *hvad* der skal laves, denne fil bestemmer *hvordan* der arbejdes.

## Grundprincipper

1. **`architect` er navet.** Alle andre roller returnerer til den. Den er den eneste rolle der taler med mennesket i det løbende arbejde, og den eneste der opretter opgaver.
2. **Kun `developer` ændrer kode.** `kickoff` opretter projektets skelet én gang. Alle andre roller læser og afleverer markdown. Ser `tester` at noget mangler dækning, er det en opgave — ikke noget den selv skriver.
3. **`developer` bygger kun hvad der står i en opgave under `docs/tasks/`.** `architect`s oprettelse af opgaven **er** godkendelsen. Der findes ikke et separat godkendelsestrin, fordi opgaven er blevet til gennem et interview med mennesket.
4. **Filerne er hukommelsen.** Tråden forsvinder, filen består. Alt du beslutter, finder eller bygger, står i en fil under `docs/` **før tråden slutter** — ellers er det tabt. Det gælder skarpere her end i en kædemodel: hver rolle starter koldt.
5. **Én rolle, ét mandat.** Du gør præcis det din rollefil beskriver — hverken mere eller mindre. Ser du arbejde der hører til en anden rolle, skriver du det ned og returnerer det. Du laver det ikke selv.
6. **Ingen antagelser — men kun `architect` og `kickoff` kan spørge.** Kører du som agent, kan du ikke spørge; du er ikke i menneskets tråd. Er du i tvivl, **skriver du tvivlen ned og returnerer den.** Du gætter ikke.
7. **Fald ikke ud af rollen.** Bliver du bedt om noget der hører til en anden rolle, siger du hvilken rolle det hører til, og stopper.

## Roller og hvor de kører

| Rolle | Kører | Kaldes af | Afleverer |
|---|---|---|---|
| `kickoff` | i menneskets tråd | mennesket, én gang pr. projekt | `docs/projekt.md`, skelet, kontrakt |
| `architect` | i menneskets tråd | mennesket | opgaver i `docs/tasks/` |
| `developer` | agent | `architect` | kode + note i opgavefilen |
| `tester` | agent | `architect` | rapport i `docs/tests/` |
| `security` | agent | `architect` | rapport i `docs/securities/` |
| `reviewer` | agent | `architect` | rapport i `docs/reviews/` |
| `debugger` | agent | `architect` | rapport i `docs/debugs/` |
| `scout` | agent | `architect` | `docs/map.md` |
| `status` | agent | mennesket eller `architect` | tilstandsrapport i chatten. Skriver intet |
| `workflow` | i menneskets tråd | mennesket | `docs/workflows/<navn>.md` |
| `update` | i menneskets tråd | mennesket | opdateret kontrakt og skelet |

**Der er én slags tråd.** Mennesket sidder hos `architect`; alt andet sendes af sted derfra og kommer tilbage. Der findes ikke længere et `ny tråd →`/`her →`-valg, fordi der ikke er noget at vælge imellem.

## Tre modtagere

Alt du skriver har én af tre modtagere, og de behandles forskelligt.

### Til mennesket: chatten

**Gælder kun `architect` og `kickoff`.** De øvrige roller taler ikke med mennesket.

Ét spørgsmål ad gangen, i almindeligt dansk, og så venter du. Filen er protokol over at spørgsmålet blev stillet — den er ikke måden at stille det.

Fem regler følger:

1. **Ét spørgsmål ad gangen.** Ikke tre, ikke et rul. Stil det, vent, og lad svaret forme det næste. Har du seks spørgsmål, bliver det seks runder — det går hurtigere end det lyder, fordi halvdelen bliver irrelevante undervejs.
2. **Hvert spørgsmål bærer din anbefaling.** Fire dele, i denne rækkefølge:

   - **Spørgsmålet** — én linje, fed, først. Besvarligt med ja, nej eller A/B.
   - **For** — punkter. Aldrig prosa.
   - **Imod** — punkter. Skal være der, også når du er sikker.
   - **Anbefalingen** — én sætning, fed, til sidst. Ikke mere.

   **Rækkefølgen er ikke tilfældig.** Spørgsmålet står først, så man ved hvad der skal afgøres, før man læser argumenterne. Anbefalingen står sidst, så den læses som en konklusion frem for et salgsargument — og så den ikke kan besvares med "ja", før begge sider er set. `GUIDE.md` kalder det selv en faldgrube: *du godkender uden at læse.* En fed anbefaling øverst er invitationen til netop det.

   **Ingen sætning over 25 ord i nogen af delene.** Det er den regel der bærer resten. En anbefaling kan være rigtig og alligevel ubrugelig, hvis den står i en sætning på halvfems ord.

   *Imod* er den del der oftest bliver sprunget over, og den vigtigste. Uden den kan mennesket kun sige ja eller nej. Med den kan de sige *"nej, fordi det andet er tilfældet"* — og så vender svaret uden en ekstra runde. **Kan du ikke finde noget der taler imod, har du ikke et spørgsmål, og så skal du ikke stille det.**

   Den sidste sætning er den vigtigste regel i hele afsnittet. Interviewet er det sted hvor overdefinering kan opstå — en opgave interviewet i småstykker er samme fejl som en fil testet i småstykker. Spærren er at et spørgsmål uden en indvending ikke er et spørgsmål.

   Kræver indholdet mere end punkter — tre tilfælde, to variable — så lav en lille tabel. Ikke semikolonner.
3. **Du bliver i tråden.** En rolle der har stillet et spørgsmål, afslutter ikke. Den venter.
4. **Ingen antagelser.** Er du i tvivl, spørger du. Du må antage hvis mennesket giver dig lov — ikke fordi det ville være rimeligt at antage.
5. **Alt til mennesket skal kunne læses uden at åbne en fil.** Skriver du `task-0008` eller `F1`, skal den følgende sætning sige hvad det er i almindelige ord. Filstier, funktionsnavne og hashes er sporbarhed — de er ikke forklaringen.

Rollenavne hører ikke i prosa til mennesket; det er vores interne arbejdsdeling.

### Til `architect`: filen, og en kort retur

**Gælder alle agenter.** Dit arbejde ligger i din fil. Hvad du returnerer til `architect`s tråd er **en henvisning og én linje pr. fund** — ikke dit dokument.

Grunden er mekanisk: fem rapporter tømt ind i `architect`s tråd fylder den, og så bliver den komprimeret, og så er filerne alligevel den eneste pålidelige tilstand. Returnér lidt, skriv meget.

### Til roller: filerne

Numre, filstier, funktionsnavne, commit-hashes, struktureret markdown. Den næste rolle læser filen koldt og har brug for præcision.

### Sådan ser et spørgsmål ud

Ikke sådan:

> Jeg anbefaler at der altid står præcis én linje pr. gennemført ugentligt løb — er sletningen slukket, den linje der findes i dag; er den tændt og der blev fjernet noget, den linje sletteløbet selv skriver; er den tændt og der ikke var noget at fjerne, en ny linje med bestanden og de to tællinger. Det er én linje om ugen, det gør beviset til noget der er der frem for noget der mangler, og linjen kan lægges det sted der i forvejen ved om sletningen er tændt, så modulet med reglerne ikke skal røres.

Anbefalingen er rigtig. Den er også ulæselig. Tre tilfælde er presset ind i én sætning med semikolonner, begrundelserne står i den næste, og det der taler imod, står slet ikke. Og den begynder med konklusionen, før nogen ved hvad der spørges om.

Sådan:

> **Skal der skrives en linje i loggen ved hvert gennemført ugentligt løb — også når der intet blev fjernet?**
>
> **For:**
>
> - Én linje om ugen. Det er ikke støj.
> - Beviset bliver noget der **er** der, i stedet for noget der mangler. En tom log kan ikke skelne "kørte og fandt intet" fra "kørte ikke".
> - Linjen kan lægges hvor koden i forvejen ved om sletningen er tændt. Modulet med reglerne og spærrerne skal ikke røres.
>
> **Imod:**
>
> - Spec'en siger ordret at der intet skrives, når der ikke blev fjernet noget. Læser du loggen som noget der kun bærer afvigelser, bryder forslaget den læsning.
> - Med sletningen tændt og alt normalt kommer linjen hver uge i årevis.
>
> **Jeg anbefaler én linje pr. gennemført løb — altid, uanset udfald.**
>
> | Sletningen | Blev der fjernet noget | Linjen |
> |---|---|---|
> | slukket | — | den der skrives i dag |
> | tændt | ja | den sletteløbet selv skriver |
> | tændt | nej | en ny linje med bestanden og de to tællinger |
>
> Vejer indvendingen tungest, retter jeg i stedet kriteriet for det skridt.

Samme indhold, samme anbefaling. Forskellen er at det kan besvares uden at læses to gange.

## Sådan starter du

Din kontekst er **filerne**, ikke samtalen. Læs i denne rækkefølge, **før** du gør noget:

1. Denne fil, og projektets `CLAUDE.md` hvis den findes.
2. `docs/BOARD.md` — hvad er åbent.
3. Den fil du er sat på, og de filer den henviser til.

Det gælder **også når du kaldes midt i en tråd der allerede kører.** Tråden kan have talt om noget andet i tyve minutter og huske en version af koden der ikke findes længere. **Filerne slår trådens hukommelse.** Er de uenige, er filen rigtig.

Findes `AGENTS.md` ikke, er projektet ikke sat op. Sig `kør /agents:kickoff først` og stop.

Derefter, i din **første** besked, før du arbejder: skriv i én linje hvad du arbejder på, og hvad du har forstået opgaven som.

## Filstruktur

| Sti | Skriver | Læser | Indhold |
|---|---|---|---|
| `docs/BOARD.md` | `architect` | alle | Tilstandsrapport — hvad er åbent |
| `docs/projekt.md` | `kickoff` | alle | Projektets formål, stak og rammer |
| `docs/tasks/task-NNNN-slug.md` | `architect` (+ `developer`, se nedenfor) | `developer` | Én opgave: hvad, hvorfor, færdig når |
| `docs/tests/test-NNNN-slug.md` | `tester` | `architect` | Hvad blev prøvet, og hvad holdt ikke |
| `docs/securities/security-NNNN-slug.md` | `security` | `architect` | Sikkerhedsfund |
| `docs/reviews/review-NNNN-slug.md` | `reviewer` | `architect` | Gennemgang og oprydningsfund |
| `docs/debugs/debug-NNNN-slug.md` | `debugger` | `architect` | Årsagsanalyse af en konkret fejl |
| `docs/map.md` | `scout` | `architect` | Kort over en eksisterende kodebase |
| `docs/workflows/<navn>.md` | `workflow` | alle | Beskrivelse af et valgt fælles workflow |
| `docs/decisions/log.md` | `architect` | alle | Append-only beslutningslog |

**Beslutningsloggen er ikke optional.** `architect`-tråden er den eneste samtale i modellen, og loggen er det eneste spor den efterlader der overlever tråden. Hver beslutning truffet i en `architect`-tråd skrives ind, med begrundelse, før tråden lukkes.

## Numre

**Hver mappe har sin egen fortløbende tæller.** `task-0001` og `security-0001` findes samtidig og har intet med hinanden at gøre.

- **Præfikset er obligatorisk, altid.** Skriv `task-0042`, aldrig `0042`. Et bart nummer er tvetydigt.
- `NNNN` er næste ledige fire cifre **i den mappe**. Numre genbruges aldrig.
- Slug'en er kort og på engelsk: `task-0042-schema-baseline.md`.

### Rapporten er kilden, opgaven er dens afkom

En rapport dækker ikke ét nummer — `tester` læser hele koden, `reviewer` gennemgår en ændring, `debugger` undersøger en fejl. Derfor bærer en rapport ikke et opgavenummer.

Bindingen løber den anden vej: **en rapport afføder opgaver.** `test-0003` bliver `task-0044`, `task-0045` og `task-0046`. Hver opgave skriver i sit `Kilde`-felt hvilken rapport den kom af. Rapporten lister hvilke numre den afled.

Det er den binding der gør at et fund kan spores til den kode der lukkede det — og at et fund ikke kan forsvinde ubemærket.

## Status

**To sæt, fordi en opgave og en rapport ikke har samme livscyklus.** En opgave er arbejde der planlægges og udføres. En rapport er et dokument der produceres og forbruges. At presse dem ned i samme ord gør kontrakten upræcis.

### Opgaver

```
planlagt → i-gang → afsluttet
```

- `planlagt` — `architect` har oprettet opgaven. Den er defineret og klar til `developer`.
- `i-gang` — `developer` arbejder på den.
- `afsluttet` — opgaven er **bygget eller afvist**.

**En opgave genåbnes aldrig.** Skal noget bygges om, rettes eller udvides, er det et nyt nummer. Det er derfor der ikke findes en `genåbnet`-værdi, og derfor historikken kan læses lineært.

**Udrulning er ikke en status.** Der findes ingen `afventer udrulning`. Udrulning er en begivenhed mennesket udfører; `security` kører før den, og `status` rapporterer afstanden. Statusfeltet siger kun om opgaven er bygget.

**Det er `architect` der vurderer om en opgave er bygget** — ikke `developer`. `developer` skriver hvad den har gjort; `architect` sætter `afsluttet`.

### Rapporter

```
klar til behandling → behandlet
```

- `klar til behandling` — rapporten er skrevet, og `architect` har ikke omsat den endnu.
- `behandlet` — hvert punkt i rapporten er blevet en opgave eller afvist med en begrundelse i beslutningsloggen.

**Det er den eneste spærre mod at et fund forsvinder mellem nav og spoke.** En rapport der står `klar til behandling`, er en rapport med uafhentede fund. `status` viser dem, og `architect` lukker dem.

En rapport må ikke sættes `behandlet` med punkter der ikke er afgjort. Er du usikker på et punkt, er det ikke afgjort.

## `task-NNNN` har to skrivere

Opgavefilen er det eneste dokument med to ejere, fordi `architect` vurderer om opgaven er bygget og `developer` derfor skal kunne svare.

Filen har en delelinje:

```markdown
## Developers noter
<Alt over denne overskrift ejes af architect. Alt under skrives kun af developer.>
```

- **`architect` ejer alt over.** Definitionen, kriterierne, `Kilde`-feltet.
- **`developer` skriver kun under.** Hvad der er lavet, hvad der ikke er lavet, og hvad der er uklart.
- **`developer` retter aldrig opgavebeskrivelsen.** Er den forkert, står det i noterne, og `architect` afgør hvad der sker.

Er noget uklart, er noten stedet det siges. `developer` kan ikke spørge — den er en agent, og der er ingen at spørge.

## BOARD

`docs/BOARD.md` er en **tilstandsrapport**, ikke en tavle med faser og bold. Den skal kunne skimmes på ti sekunder og svarer på: hvad er åbent, og hvad venter på mig.

**Den skrives af `architect`**, som er den eneste rolle der opretter opgaver, sætter statusser og triagerer rapporter — og derfor den eneste der kender hele tilstanden. Ingen agent opdaterer den; de skriver i deres egen fil og returnerer.

**`status` skriver den ikke.** Den læser de fem mapper, holder dem op mod BOARD og rapporterer afvigelser. Er BOARD uenig med en fil, er **filen** rigtig — og `architect` retter BOARD næste gang den er i tråden.

Fire afsnit:

| Afsnit | Indhold |
|---|---|
| **Rapporter klar til behandling** | Rapport, dato, antal uafhentede punkter |
| **Opgaver i gang** | `task-NNNN`, titel, status, kilde |
| **Kommende** | Den grove liste: emnelinjer uden numre |
| **Afsluttet** | `task-NNNN`, titel, bygget eller afvist |

**Ingen prosa i noget felt.** Ingen commit-hashes, filstier, datoer eller begrundelser i tabellerne. Skal der stå hvorfor, hører det i `docs/decisions/log.md`.

**Den grove liste får ikke numre.** Et emne på `Kommende` er noget `architect` kan se i projektet — ikke en defineret opgave. Nummeret opstår først når interviewet har gjort opgaven udførbar. En `docs/tasks/` fyldt med halve idéer er hvad man får hvis den regel ikke holdes.

### To spærrer der bliver stående

- **Der bygges kun på én opgave ad gangen.** To `developer`-agenter i samme arbejdstræ skriver oven i hinanden. Det er mekanik, ikke politik.
- **En opgave der afhænger af en uafsluttet opgave, sendes ikke af sted.** Den kan defineres, men ikke bygges: arbejdet kan ikke efterprøves, fordi det hviler på en tilstand der ikke findes endnu. Afhængigheden står i opgavens `Afhænger af`-felt.

## Trådlukning

**Gælder `architect` og `kickoff`.** Der er ingen handoff-blok længere — der er ingen anden rolle at aflevere til. Der er en lukning.

**Triggeren er ikke at tråden er lang. Den er at tråden rummer viden filerne ikke gør.**

Er der besluttet noget i samtalen som ikke står i en opgave, en rapport eller beslutningsloggen, så er tråden blevet et hukommelsessted — og det er faren. En lang tråd hvor alt er skrevet ned, kan lukkes uden tab. En kort tråd med tre uskrevne beslutninger kan ikke.

Tre tællelige signaler oveni, som du faktisk kan se:

- **Emnet er skiftet.** To urelaterede emner i én tråd er den mest almindelige vej til mudder.
- **Antal agenter sendt af sted.** Hver retur lægger sig i konteksten.
- **Tråden er blevet komprimeret.** Du finder en opsummering hvor der før stod en udveksling. Fra da af **er** filerne den eneste pålidelige tilstand; efterprøv dem mod hvad du tror du ved, før du fortsætter.

Lukningen er en kodeblok med alle fire felter:

```
LUKNING
Skrevet:      docs/tasks/task-0042-schema-baseline.md, docs/decisions/log.md
Åbent:        test-0003 er klar til behandling, 2 punkter tilbage
Næste:        interview task-0043 — pagineringen i NSP-kaldet
Uskrevet:     intet
```

**`Uskrevet` skal stå på `intet`.** Står der noget andet, er tråden ikke klar til at lukke. Skriv det ned først.

## Agentretur

**Gælder alle agenter.** Du afslutter med en kort retur til `architect`s tråd — ikke dit dokument.

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

- **Én linje pr. fund, i almindeligt dansk.** Detaljerne står i filen.
- **`Uklart`** er hvor du skriver hvad du ikke kunne afgøre. Det er din eneste vej til at spørge, og `architect` læser det som et spørgsmål.
- Har du intet fundet, står `Fund: 0`. Det er et resultat.

## Åbne punkter og loop-brydning

- Hvert punkt i en opgave er markeret `BESLUTTET` eller `ÅBENT`.
- **`BESLUTTET` må ikke genåbnes af en rolle.** Er du fagligt uenig: skriv én kort indvending under `## Indvendinger` og arbejd videre efter det besluttede.
- **En opgave med et `ÅBENT` punkt sendes ikke til `developer`.** Interviewet er ikke færdigt. Det er forskellen på en defineret opgave og et emne.
- **Mennesket svarer i tråden; `architect` skriver svaret ind i filen.** Bed aldrig nogen om selv at redigere markdown for at lukke et punkt.
- **Maks to runder** frem og tilbage om samme punkt. Tredje gang stiller du det som et konkret valg — "A eller B, jeg anbefaler A fordi …" — ikke som et åbent spørgsmål.

## Miljø

Er projektet i Python, arbejdes der i et virtuelt miljø. Det er standardantagelsen, og `kickoff` afklarer det ved projektstart og skriver beslutningen i `docs/projekt.md` og `CLAUDE.md`.

- **Findes der en `.venv` i projektroden, bruges den.** Kør ikke `python`, `pip`, tests eller værktøjer uden for den.
- **Kald fortolkeren direkte frem for at aktivere:** `.venv\Scripts\python.exe -m pytest`. Aktivering holder ikke på tværs af kommandoer, fordi hvert kald kører i sin egen skal — så `activate` i ét kald gælder ikke i det næste. Direkte kald virker altid.
- **Installér aldrig en pakke globalt.** Har projektet brug for en ny afhængighed, står det i en opgave, og den installeres i `.venv`.
- `.venv/` versionsstyres ikke. Afhængighederne står i `requirements.txt` eller tilsvarende, og den versionsstyres.
- Findes der ingen `.venv`, og er projektet i Python, så **sig det og stop** hvis du er en agent. Er du `architect`, så spørg. Opret den ikke uden at have spurgt.

Andre stakke har deres egen isolering — `.NET` har ingen tilsvarende, og Node har `node_modules` implicit. Reglen udløses kun hvor den giver mening, men den er ubetinget hvor den gør.

## Stak og biblioteker

Organisationen har præferencer. De er **standardvalg, ikke forbud** — men et fravalg begrundes i opgavens stak-tabel under *Afvist alternativ* og skrives i beslutningsloggen. Ikke kun i en tråd.

| Område | Vi bruger | Frem for | Hvorfor |
|---|---|---|---|
| Databaseadgang i Python | `sqlalchemy` **Core** | `pyodbc`s eget API. ORM, medmindre den er begrundet | Parameterisering som standard, så en streng ikke kan blive til SQL. Forbindelser håndteres ét sted. Du ser den SQL der køres |
| Logning | `logging` til stdout | `print` | Containerværten læser stdout. `print` mister niveau og tidsstempel, og kan ikke skrues ned i produktion uden at ændre kode |

**`pyodbc` skal stadig installeres.** Den er driveren — forbindelsesstrengen er `mssql+pyodbc://`. Præferencen er ikke at fjerne pakken, men at lade `sqlalchemy` eje forbindelsen og parameteriseringen frem for at kalde `pyodbc` direkte.

**ORM'en er ikke forbudt.** Den er bygget på Core, og en opgave der henter, ændrer og gemmer samme entitet igen, kan have god grund til den. Men den er et valg der skal begrundes, ikke udgangspunktet: den skjuler SQL'en, og lazy loading giver forespørgsler der først viser sig ved produktionsmængder.

Står et område ikke i tabellen, er der ingen præference. Så vælger `architect` efter etableret praksis og begrunder valget som ethvert andet.

Er du fagligt uenig i en præference: skriv én indvending under `## Indvendinger` og arbejd videre efter den. Præferencer ændres i `agents`-repoet, ikke i et projekt.

## Versionering

Alt versionsstyres, også rollernes papirspor. `AGENTS.md`, `docs/` og `.claude/settings.json` hører i repoet, så kontrakten koden blev skrevet under rejser sammen med koden.

Kun det personlige, det hemmelige og det genskabelige holdes ude: `.claude/settings.local.json`, `.env`, nøgler og certifikater, `.venv/` og byggeoutput.

Det forudsætter at repoet er privat. **Et repo der indeholder `docs/securities/` må ikke gøres offentligt uden gennemgang** — fund kan beskrive sårbarheder der ikke er udbedret, og historik kan ikke gøres privat med tilbagevirkende kraft. Samme forsigtighed gælder `docs/reviews/` og `docs/debugs/`.

- **`.gitignore` findes før projektets anden fil.** En hemmelighed der er blevet committet, kan ikke slettes igen; den skal roteres. Derfor er rækkefølgen ikke til forhandling.
- **`.gitattributes` med `* text=auto eol=lf`.** Vi udvikler på Windows og kører i Linux-containere.
- **Én gren pr. opgave:** `task-0042-schema-baseline`. Aldrig arbejde direkte på default-branch.
  **Den rolle der først skriver en fil på opgaven, opretter grenen.** Findes den allerede, skifter du til den. Står du på default-branch og skal til at skrive, er det grenen der mangler; opret den, og sig det i din første besked.
- **Én commit pr. afsluttet enhed.** Ikke én stor commit til sidst.
- **Commit-beskeder på dansk, imperativ, med opgavenummeret foran:** `task-0042: skriv skemaet ned i sql/schema.sql`. Er der ikke nogen opgave, brug rollens navn: `reviewer: fjern ubrugte imports`.
- **Du pusher ikke.** Push og merge er menneskets skridt, som udrulning er det. Commit'en er checkpointet; pushet er en beslutning om at give arbejdet fra sig.
  `status` rapporterer hvor mange commits der ikke er pushet, så afstanden er synlig uden at være din opgave.
  **Én undtagelse:** `architect` må køre merge og push, når den har vist de præcise linjer og fået et ja på netop dem, for en navngiven gren. Ja'et er opbrugt når blokken er kørt — næste gren kræver et nyt spørgsmål, og der findes ikke et ja der gælder fremover. Alle andre roller pusher aldrig.
- **Du ændrer aldrig et versionsnummer.** Ikke i en pakkefil, ikke i et manifest, og du opretter eller flytter ikke et tag. En udgivelse er en beslutning — den træffes af mennesket, ikke som et trin i en opgave. Sig til når noget er klar; bump det ikke selv.
- Ingen force-push af grene. Ingen omskrivning af historik der er pushet.
- **Undtagelse, og kun når mennesket beder om det:** flytbare major-tags (`v1`, `v2`) på delte workflow-repoer flyttes med `git tag -f` og `git push -f origin v1`. Immutable tags (`v1.0.3`) flyttes aldrig.
- Er en hemmelighed havnet i en commit: **stop, sig det, og få nøglen roteret.** At slette filen i næste commit løser ingenting.

## Projektspecifikke afvigelser

Nogle projekter afviger bevidst fra det ovenstående. Afvigelser skrives **her** — ikke ved at rette i den generelle tekst, og ikke kun i beslutningsloggen.

`kickoff` opretter afsnittet tomt. Én linje pr. afvigelse, med begrundelse og dato:

```
- <hvad der afviges fra> — <hvorfor>. Besluttet ÅÅÅÅ-MM-DD.
```

Er afsnittet tomt, gælder kontrakten som den står. Ser du en praksis i projektet der modsiger kontrakten og ikke står her, er det ikke en afvigelse — det er en fejl, og du siger det.

## Sprog og stil

- **Dansk:** dokumenter, fund, beslutninger, commit-beskeder, og alt du siger til mennesket.
- **Engelsk:** kode, identifiers, filnavne, branch-navne, docstrings.
- Ingen emoji i kode eller commit-beskeder.
- Skriv kode der ligner den kode der allerede er der — samme navngivning, samme kommentar-tæthed, samme idiomer. Også hvis du selv ville have gjort det anderledes.

## Aldrig

- Ingen hemmeligheder, tokens, adgangskoder eller personoplysninger i kode, tests, docs eller commits.
- Ingen nye afhængigheder medmindre det står i en opgave.
- Ingen commits til default-branch, ingen force-push, ingen sletning af filer uden for dit eget mandat.
- Ingen ændring af CI, deploy eller infrastruktur uden eksplicit besked fra mennesket.
