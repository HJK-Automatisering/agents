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
