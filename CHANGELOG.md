# Ændringer

Nyeste øverst. Én sektion pr. udgivelse.

Posten skrives **før** versionen bumpes — den er teksten der skal i mailen til
udviklerne. Se `PLUGIN.md`.

Ved hver ny version skal begge køres:

```
claude plugin marketplace update hjk-agents
claude plugin install agents@hjk-agents --scope user
```

---

## 1.0.0-beta.14

Kontrakt-version 10 → 11. **Kør `/agents:update` i hvert projekt.**

### `architect` lukker grenen — med linjerne, og efter et ja

Rollerne committer, men ingen pushede, og sidste skridt stod ingen steder.
Man sad med en færdig gren og skulle selv huske default-branchens navn,
`--no-ff`, og hvad der egentlig manglede at blive committet. Grønt arbejde blev
liggende i et arbejdstræ, fordi det billigste skridt var det eneste der ikke var
skrevet ned.

`architect` har fået et nyt **trin 8, "Luk grenen"**, mellem vurderingen af
opgaven og lukningen af tråden. Når en opgave er `afsluttet` og grenen ikke skal
bruges til mere, gør den to ting i samme besked:

1. **Skriver linjerne.** Præcis dem der skal køres, i én blok, klar til at
   kopiere. Den slår tilstanden op først — uncommittede filer, aktuel gren,
   default-branchens navn — så blokken passer til virkeligheden. Den gætter ikke
   på `main`. Er der intet uncommitteret, står commit-linjerne der ikke; er
   grenen allerede merget, er der ingen blok.
2. **Spørger om den skal køre dem.** Ét spørgsmål, og så venter den.

**Ja'et gælder kun den ene blok.** Ikke næste gren, ikke næste opgave, ikke
resten af tråden — og et *"det må du gerne fremover"* ændrer det ikke. Et push er
det skridt der giver arbejdet fra sig, og det koster et ja hver gang. Siger du
nej, kører den ingenting: linjerne står der stadig, til dig selv.

Sikringerne i blokken: filerne navngives i `git add` frem for `-A`, merge sker
med `--no-ff`, og der force-pushes ikke. Kører projektet med pull requests,
merges der ikke lokalt — og ved rollen det ikke, spørger den.

**Udrulning er uændret menneskets.** Det er kun merge og push der har flyttet
sig.

### Kontrakten

`Du pusher ikke` har fået én undtagelse: `architect` må køre merge og push, når
den har vist de præcise linjer og fået et ja på netop dem. Alle andre roller
pusher aldrig. Uden undtagelsen vinder kontrakten over rollefilen, og
`architect` ville stå med to regler der modsiger hinanden.

`GUIDE.md` er rettet med. Menneskets tredje opgave er nu at svare på
spørgsmålet — ikke at huske kommandoen.

---

## 1.0.0-beta.13

Kontrakt-version 9 → 10. **Kør `/agents:update` i hvert projekt.**

Dette er den største ændring siden metoden blev lagt ind. Kæden er erstattet af
en stjerne, og fem roller har fået et andet mandat. Læs `GUIDE.md` igen — det
er ikke nok at køre `/agents:update`.

### Hvorfor

Afprøvningen blev målt. På ét nummer gik **55 % af omkostningen til test og
efterprøvning, mod 11 % til selve leverancen** — og testapparatet endte på 5,8
gange så mange linjer som det nummeret leverede.

Proportionalitetsreglerne i `tester` virkede: rollen vurderede konsekvensen,
prioriterede, og skrev ti bevidste fravalg. Volumen faldt alligevel ikke, fordi
den ikke kom fra `tester`s dømmekraft. Den kom fra **routingen**: `architect`,
`developer` og `debugger` pegede alle ubetinget videre på `tester`, og der
fandtes ingen rute forbi. Den billigste testrunde havde et gulv, uanset hvor
lille nummeret var.

En regel inde i en rolle kan ikke løse et problem der ligger i rækkefølgen
mellem roller. Derfor stjernen.

### `architect` er navet

Alle andre roller returnerer til den. Ingen rolle peger på en tredje.

`architect` har nu fem jobs: holde den grove liste, interviewe et emne frem til
en opgave, sende agenter af sted, triagere det de kommer tilbage med, og
vurdere om en opgave er bygget. Den ejer også `docs/BOARD.md` og
beslutningsloggen.

**Det er dig og `architect` der afgør om der skal testes.** Der er ingen station
der fyrer af sig selv. Det er hele rettelsen.

### Kun `developer` ændrer kode

Grundprincip 2 hed før *"kun tre roller ændrer kode"*. Nu er det én.

- **`tester` skriver ikke tests.** Den læser koden, kører hvad der findes,
  prøver sammenhængen, og rapporterer. Skal en kontrol *blive* i projektet, er
  det en opgave. Mutations- og attrap-apparatet er væk.
- **`debugger` retter ikke.** Den reproducerer, indsnævrer og forklarer
  årsagen. Rettelsen bliver en opgave.
- **`developer` er blevet en agent.** Den sidder ikke længere i din tråd. Den
  får én opgave, bygger den, og svarer i opgavefilens noter.

### Der er ingen godkendelse længere

`architect`s oprettelse af en opgave **er** godkendelsen — den hviler på det
interview du var med i. `status: godkendt` findes ikke, og `udkast` heller ikke.

Sig nej undervejs i interviewet, ikke til sidst.

### Fem mapper, fem tællere

| Mappe | Fil | Skrevet af |
|---|---|---|
| `docs/tasks/` | `task-NNNN-slug.md` | `architect` |
| `docs/tests/` | `test-NNNN-slug.md` | `tester` |
| `docs/securities/` | `security-NNNN-slug.md` | `security` |
| `docs/reviews/` | `review-NNNN-slug.md` | `reviewer` |
| `docs/debugs/` | `debug-NNNN-slug.md` | `debugger` |

`docs/plans/`, `docs/findings/` og `docs/rca/` findes ikke længere, og
projektdokumentet er flyttet til `docs/projekt.md` uden nummer.

**Præfikset er obligatorisk.** `task-0001` og `security-0001` findes samtidig,
så et bart `0001` betyder ikke noget.

**Rapporten er kilden, opgaven er dens afkom.** En rapport bærer ikke et
opgavenummer — `tester` læser hele koden, ikke ét nummer. Den afføder opgaver,
og hver opgave skriver i sit `Kilde`-felt hvilken rapport den kom af.

### To statussæt

En opgave og en rapport har ikke samme livscyklus, så de har ikke samme ord.

- **Opgaver:** `planlagt` → `i-gang` → `afsluttet`. `afsluttet` betyder bygget
  **eller** afvist. **En opgave genåbnes aldrig** — skal noget bygges om, er det
  et nyt nummer. Det er `architect` der vurderer, ikke `developer`.
- **Rapporter:** `klar til behandling` → `behandlet`. `behandlet` betyder at
  hvert punkt er blevet en opgave eller er afvist med en begrundelse i loggen.

En rapport der står `klar til behandling`, har uafhentede fund. **Det er det
eneste sted et fund kan forsvinde i en stjerne** — der er ingen kæde der bærer
det videre af sig selv. `status` tæller dem.

**Udrulning er ikke en status.** `afventer udrulning` findes ikke. Udrulning er
en begivenhed; `security` kører før den, og `status` rapporterer afstanden.

### `task-NNNN` har to skrivere

`architect` ejer alt over overskriften `## Developers noter`. `developer`
skriver kun under den — hvad der er lavet, hvad der ikke er, og hvad der er
uklart. Den retter aldrig i definitionen.

**En agent kan ikke spørge.** Noten er dens eneste vej, og `architect` læser
den som et spørgsmål. Det er derfor interviewet skal være færdigt før noget
sendes af sted: en dårligt defineret opgave betales i genudsendelser.

### Handoff er erstattet af to blokke

`ny tråd →` og `her →` er væk. Der er kun én slags tråd, så der er ikke noget
at vælge imellem.

- **`LUKNING`** — `architect` og `kickoff`, når tråden lukkes. Triggeren er
  ikke at tråden er lang, men at den rummer viden filerne ikke gør. Feltet
  `Uskrevet` skal stå på `intet`.
- **`RETUR`** — agenterne. En henvisning og én linje pr. fund, ikke dokumentet.
  Fem rapporter tømt ind i navets tråd fylder den, og så bliver den komprimeret.

Reglen om at spørge `status` før noget nyt startes er væk — den fandtes fordi en
rolle kun kunne se sit eget nummer.

### `scout` er ikke længere en station

Den er noget `architect` sender af sted når den mangler grundlag. Den kører
stadig isoleret, af samme grund som før: du vil ikke have to hundrede filopslag
i din kontekst.

### BOARD er en tilstandsrapport

Faser og *bolden hos* er væk. Fire afsnit: rapporter klar til behandling,
opgaver, kommende, afsluttet. **Ejes af `architect`** — `status` skriver den
ikke, den læser den og melder afvigelser.

### Om at opdatere et projekt der er i gang

`/agents:update` **flytter ikke dine filer.** Den opdager at kontrakten
beskriver mapper projektet ikke har, siger hvor mange filer der ligger i de
gamle, og lægger tre veje frem: flyt dem, bliv på den gamle kontrakt indtil
igangværende arbejde er i drift, eller skriv den gamle struktur ind som en
bevidst afvigelse.

En omdøbning af `docs/` ændrer hvad hver fil hedder. Det er en beslutning, ikke
et trin i en opdatering.

SessionStart-hooken tåler begge strukturer, så et projekt der ikke er migreret,
bliver ikke meldt som projekt nul.

---

## 1.0.0-beta.12

Kontrakt-version 8 → 9. **Kør `/agents:update` i hvert projekt.**

### Fund er taget ud af plan-livscyklussen

`security` og `reviewer` skrev deres fund-filer med `status: udkast`. Ingen
kunne godkende dem — rapportrollerne kører isoleret og kan ikke blive i tråden
og spørge, og ingen anden rolle ejer opgaven. Feltet stod på `udkast` for evigt.

Samtidig siger kontrakten, at `developer` kun implementerer fra et dokument med
status `godkendt`. Kaldt til at udføre fund læste den altså et dokument, dens
egen kontrakt sagde stop på.

- **Fund bærer ikke længere `status`.** Et fund er en observation, ikke et
  forslag der skal godkendes. Der skal besluttes *hvad der gøres ved hvert
  enkelt*, og rollens forslag står i fundets eget `Til:`-felt.
- **Grundprincip 3 gælder planer, ikke fund.** `developer` må udføre et fund
  uden at det er sat til `godkendt`. Den må stadig ikke bygge funktionalitet
  uden en godkendt plan.
- **Menneskets beslutning skrives i `docs/decisions/log.md`.**

### Handoff'en følger fundets routing

`security` pegede altid på `developer`, uanset hvad den selv havde skrevet i
`Til:`-felterne. Nu udledes kaldet af dem, i rækkefølgen `menneske` →
`architect` → `developer`:

- Et `kritisk` fund, eller et fund med `Til: menneske`: `Næste: intet`.
  Afgørelsen tages i samtalen.
- Ellers, hvis noget har `Til: architect`: planændringen først. Den kan
  ugyldiggøre de opgaver de øvrige fund sidder på.
- Ellers `developer`.

`reviewer` havde begge kald, men sagde ikke hvilket der gik først. Nu gør den.

---

## 1.0.0-beta.11

Kontrakt-version uændret på 8. Ingen `/agents:update` nødvendig.

### `kickoff` sætter VS Code op til det virtuelle miljø

Oprettes der en `.venv`, skriver `kickoff` nu også `.vscode/settings.json`, så
terminalen i VS Code starter i miljøet. Filen er gitignoreret — den er
personlig og rejser ikke med projektet.

Det afgørende er `terminal.integrated.env`, som lægger `.venv\Scripts` forrest
i PATH. De almindelige indstillinger — `python.defaultInterpreterPath` og
`python.terminal.activateEnvironment` — afhænger af Python-udvidelsen, og den
ignorerer dem, hvis der allerede er valgt en fortolker for mappen. Det er der i
ethvert projekt der har været åbnet før, og så aktiveres miljøet aldrig.

`PIP_REQUIRE_VIRTUALENV` sættes samtidig, så `pip` nægter at installere, hvis
det alligevel går galt. Fundet ved at fejlsøge et projekt hvor det gik galt.

`.vscode/` er tilføjet til den `.gitignore` `kickoff` skriver.

---

## 1.0.0-beta.10

Kontrakt-version 7 → 8. **Kør `/agents:update` i hvert projekt.**

### Spørgsmålet står først, anbefalingen sidst

Formen på et spørgsmål til mennesket er vendt om. Var:
anbefaling → for → imod → spørgsmål. Er nu:

1. **Spørgsmålet** — én linje, fed, først
2. **For**
3. **Imod**
4. **Anbefalingen** — én sætning, fed, til sidst

Spørgsmålet først, så man ved hvad der skal afgøres, før man læser
argumenterne. Anbefalingen sidst, så den læses som en konklusion frem for et
salgsargument — og så den ikke kan besvares med "ja", før begge sider er set.
`GUIDE.md` kalder det selv en faldgrube: *du godkender uden at læse.*

Rettet i kontrakten, i dens gennemgående eksempel, og i `kickoff` og
`architect`.

### Kontrakten har nu en liste over foretrukne biblioteker

Nyt afsnit **Stak og biblioteker**. To rækker til at begynde med:

| Område | Vi bruger | Frem for |
|---|---|---|
| Databaseadgang i Python | `sqlalchemy` **Core** | `pyodbc`s eget API, og ORM uden begrundelse |
| Logning | `logging` til stdout | `print` |

Det er **standardvalg, ikke forbud**. Et fravalg begrundes i planens stak-tabel
under *Afvist alternativ* og skrives i beslutningsloggen — ikke kun i en tråd.
Står et område ikke i tabellen, er der ingen præference, og `architect` vælger
som hidtil.

`pyodbc` skal stadig installeres — den er driveren. Præferencen er at lade `sqlalchemy`
eje forbindelsen og parameteriseringen, ikke at fjerne pakken.

Afviger et projekt bevidst, hører det i `## Projektspecifikke afvigelser` i
projektets egen `AGENTS.md`. `/agents:update` bevarer det afsnit.

---

## 1.0.0-beta.9

Kontrakt-version 6 → 7. **Kør `/agents:update` i hvert projekt** efter
opdateringen; ellers arbejder rollerne videre efter de gamle regler.

### Rettelser der ændrer adfærd

- **Rapportrollerne blev kaldt med et navn der ikke findes.** De fire
  dispatch-skills bad om `subagent_type: reviewer` i stedet for
  `agents:reviewer`. Hvert kald kostede en fejlet runde. Rettet.
- **`developer` satte planen til `færdig`, når testene kørte.** Kontrakten
  siger at `færdig` betyder i drift. Planen bliver nu stående på `i-gang`, og
  det er fasen på `BOARD.md` der flyttes.
- **`docker-publish` blev beskrevet som ubrugelig.** Forudsætningslisten
  påstod at der ikke fandtes tags i `workflow`-repoet, så kalderen ikke kunne
  resolve `@v1`. Det passer ikke — tagget findes. Teksten er erstattet af en
  kommando du selv kan køre.
- **`workflow`-skabelonen i `PLUGIN.md` lærte forkerte feltnavne fra sig**
  (`formaal`, `foreslaa-ja-naar`). Et workflow skrevet efter den ville blive
  vist uden formål og altid foreslået nej.

### Kontrakten

- **Hvem opretter grenen.** Reglen om én gren pr. nummer sagde ikke hvem eller
  hvornår. Nu: den rolle der først skriver en fil på nummeret opretter den, og
  skifter til den hvis den findes fra en tidligere tråd.
- **Handoff-blokken modsagde sig selv.** "Hvert svar slutter med denne blok"
  mod "en rolle der har stillet et spørgsmål, afslutter ikke". Blokken skrives
  nu kun i den omgang der afslutter arbejdet — et spørgsmål bærer ingen blok.
  Til gengæld bærer en rolle der stopper, fordi projektet ikke er sat op, nu
  en blok med kaldet til `kickoff`.
- **Filstrukturen** kender nu `docs/workflows/`, og fund-filerne er navngivet
  præcist: `NNNN-security.md`, `-review.md`, `-test.md`.
- **Ingen rolle sætter `færdig`.** Reglen lovede før at rollen skriver status,
  når mennesket har merget og rullet ud — men på det tidspunkt er ingen tråd
  åben. Feltet står nu på `i-gang`, og fasen på `afventer udrulning`, indtil et
  menneske siger at det er i drift. Der kommer stadig ingen release-rolle; den
  er fortsat bevidst udenfor.
- **BOARD kolliderer, når to numre er i gang.** Det er ventet, og der står nu
  hvordan konflikten løses: behold begge rækker, filerne har ret, kør
  `/agents:status` bagefter.

### Scopet holdes nede to steder mere

- **`architect` må ikke lave mere om end målet kræver i et system der virker.**
  Er der kode i drift, er udgangspunktet den mindste ændring der opfylder
  målet. En omskrivning skal have sin egen begrundelse, og tjener den ikke
  målet, er den sit eget nummer. Planen har fået et afsnit **Hvad vi ikke
  rører** — er det tomt i et system i drift, er der lavet en omlægning.
- **`status` holder det leverede op mod det der blev bedt om.** Den læser nu
  også prosateksten i `0000` og er den eneste rolle der ser begge dele på én
  gang. Er der langt imellem, rejser den spørgsmålet — uden et forhold og uden
  en grænse, for et tal ville blive et mål.

### Testene stopper af sig selv

Afprøvningen gav 4.600 linjer test til 301 linjers leverance. Det var ikke
grundighed — det var en tjekliste uden bremse. `tester` sagde "dæk den lykkelige
sti, grænseværdier (0, 1, tom, maks, negativ, manglende værdi), fejlstier",
uden at spørge om nogen af værdierne overhovedet kunne opstå.

- **Fem ting er nu altid `tung`** og kan ikke vurderes ned: produktionsdata,
  persondata, adgang og autorisation, uvalideret input udefra, og noget der
  ikke kan rulles tilbage.
- **Bevisbyrden vender med konsekvensen.** Ved `let` og `normal` testes et
  tilfælde kun hvis du kan sige hvor det opstår. Ved `tung` testes det,
  medmindre du kan pege på noget der gør det umuligt.
- **Grænseværdier slås op, ikke gættes.** Kan en værdi blive negativ eller
  mangle, står det i planens datamodel. Står der at et antal aldrig er null,
  måler en test for det typesystemet og ikke systemet. Kan det ikke afgøres
  fra planen, spørges der.
- **`tester` slutter med at forelægge fravalgene i samtalen** og bede om et ja.
  Det er dér der kan bedes om mere — så mere bliver en beslutning i stedet for
  standarden.

### Sagt ærligt

- **Rapportrollerne er ikke teknisk låst.** Dokumentationen påstod fem steder
  at `security`, `reviewer`, `scout` og `status` ikke *kan* rette filer. De har
  ikke `Edit`, men tre af dem har `Write` og alle fire har `Bash`. "Må ikke" er
  en instruktion overalt — ikke en lås. Teksten siger det nu.

### Hooken ved sessionsstart

- Et projekt med en kontrakt bliver ikke længere meldt som projekt nul.
- Advarslen om manglende `.gitignore` forsvinder ikke længere, når kontrakten
  også er bagud. Begge vises.
- Kører nu også efter en komprimering, så en lang tråd ikke mister beskeden.

### Dokumentation

- `GUIDE.md`s opsætning brugte `marketplace update` som førstegangskommando.
  Den fejler. Nu står både installation og opdatering.
- Antallet af kald stod som ti fem steder. Der er elleve — `workflow` manglede
  i strukturdiagrammet, så optællingen var korrekt af et forkert træ.
- Blandet retskrivning ryddet op i otte filer. `reviewer`s skabelon brød ud af
  sin egen kodeblok og var halvt så lang som de andres.

### Nyt

- **`CLAUDE.md`** i roden: reglerne der gælder, når nogen redigerer dette repo
  med Claude. Herunder at repoet er offentligt.
- **`tools/validate.mjs`** og en GitHub Actions-kontrol: manifesternes
  versioner, frontmatter, agentnavne, kodeblokke og hooken. Kør den lokalt med
  `node tools/validate.mjs` før du bumper versionen.
- **Denne fil.**
