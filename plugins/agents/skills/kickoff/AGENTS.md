# AGENTS.md — fælles kontrakt

Denne fil arves af **alle** roller i `.claude/agents/`. Læs den før du gør noget andet.

Ved konflikt: rollefilen bestemmer *hvad* der skal laves, denne fil bestemmer *hvordan* der arbejdes.

## Grundprincipper

1. **Én rolle, ét mandat.** Du gør præcis det din rollefil beskriver — hverken mere eller mindre. Ser du arbejde der hører til en anden rolle, skriver du det ned og sender det videre. Du laver det ikke selv.
2. **Kun tre roller ændrer kode:** `developer`, `tester` og `debugger`. Alle andre roller er read-only og afleverer markdown. Er du i tvivl om du er en af de tre, er du det ikke. Undtagelsen er `kickoff`, som opretter projektets skelet én gang og aldrig rører kode.
3. **Intet arbejde uden godkendt kilde.** `developer` og `tester` implementerer kun hvad der står i en spec eller plan med status `godkendt`.
4. **Sporbarhed.** Alt du beslutter eller finder ender i en fil under `docs/` — ikke kun i tråden. Tråden forsvinder, filen består. `docs/` versionsstyres ikke og ligger kun lokalt: den er hukommelse mellem tråde, ikke mellem maskiner.
5. **Ingen stille antagelser.** Er noget uklart, bliver det et `ÅBENT`-punkt. Ikke et gæt.
6. **Fald ikke ud af rollen.** Bliver du bedt om noget der hører til en anden rolle, siger du hvilken rolle det hører til, og stopper.

## Sådan starter du

Din kontekst er **filerne**, ikke samtalen. Læs i denne rækkefølge, **før** du gør noget:

1. Denne fil, og projektets `CLAUDE.md` hvis den findes.
2. `docs/BOARD.md` — hvad er i gang, og hvem har bolden.
3. Den fil du er sat på: spec, plan, fund eller årsagsanalyse — og den spec eller plan den peger på.

Det gælder **også når du kaldes midt i en tråd der allerede kører.** Tråden kan have talt om noget andet i tyve minutter og kan huske en version af koden der ikke findes længere. **Filerne slår trådens hukommelse.** Er de uenige, er filen rigtig.

Findes `AGENTS.md` ikke, er projektet ikke sat op. Sig `kør /agents:kickoff først` og stop.

Derefter, i din **første** besked, før du arbejder:

- Skriv i én linje hvilket nummer du arbejder på, og hvad du har forstået opgaven som.
- Mangler der en godkendt kilde til det du er bedt om, så stop og sig det. Begynd ikke.
- Er `BOARD.md` uenig med den fil du er sat på, så stol på filen og ret `BOARD.md`.

Når du slutter: opdater `docs/BOARD.md` og skriv handoff-blokken. En tråd der slutter uden begge dele, har mistet sit arbejde.

## Filstruktur

| Sti | Ejer | Indhold |
|---|---|---|
| `docs/BOARD.md` | alle | Overblik over hvad der er i gang |
| `docs/specs/NNNN-slug.md` | brainstorm | Hvad og hvorfor |
| `docs/plans/NNNN-slug.md` | architect | Hvordan — teknisk plan |
| `docs/tests/NNNN-slug.md` | tester | Testplan og acceptkriterier |
| `docs/findings/NNNN-slug.md` | security, reviewer, tester | Fund der skal handles på |
| `docs/rca/NNNN-slug.md` | debugger | Årsagsanalyse af en konkret fejl |
| `docs/decisions/log.md` | alle | Append-only beslutningslog |

`NNNN` er næste ledige 4-cifrede nummer. Numre genbruges aldrig. En spec, dens plan, dens testplan og dens fund deler samme nummer — det er den tråd der binder arbejdet sammen.

## Status-livscyklus

```
udkast → godkendt → i-gang → færdig
                  ↘ henlagt
```

- **Kun mennesket kan godkende.** Ingen rolle forfremmer sit eget arbejde fra `udkast`.
- **Men mennesket skal aldrig åbne filen for at gøre det.** Godkendelse foregår i samtalen; du skriver den ind.
- `i-gang` og `færdig` sættes af den rolle der udfører arbejdet.
- Status står i frontmatter øverst i filen — se skabelonen i din egen rollefil.

### Sådan beder du om en godkendelse

Skriver du `Næste: menneske — ... skal godkendes`, så **bliv i tråden**. Det er ikke et handoff til en anden rolle; det er dit eget arbejde der mangler et ja.

Før handoff-blokken giver du mennesket nok til at kunne svare uden at åbne noget:

- **Hvad der skal besluttes**, i punktform. De `BESLUTTET`-punkter der reelt kan diskuteres, og ikke-målene. Ikke hele dokumentet — det de skal tage stilling til.
- **De `ÅBENT`-punkter der stadig står**, og hvad de blokerer.
- En linje om hvordan man svarer: *godkendt*, eller hvad der skal laves om.

Når svaret kommer:

- **Godkendt** → du sætter `status: godkendt` i filerne, bekræfter hvilke, og skriver handoff-blokken igen med det næste kald.
- **Rettelser** → du skriver dem ind, viser hvad du ændrede, og spørger igen.

Bed aldrig nogen om selv at rette `status` i frontmatter. Det er clerikalt arbejde, og det er dit.

## Åbne punkter og loop-brydning

- Hvert punkt i en spec eller plan er markeret `BESLUTTET` eller `ÅBENT`.
- **`BESLUTTET` må ikke genåbnes af en agent.** Er du fagligt uenig: skriv én kort indvending under `## Indvendinger` og arbejd videre efter det besluttede.
- `ÅBENT` blokerer kun det der direkte afhænger af det. Alt andet laves færdigt først.
- **Mennesket svarer i tråden; rollen skriver svaret ind i filen.** Bed aldrig nogen om selv at redigere markdown for at lukke et punkt. Er svaret givet, er det din opgave at føre det ind og flytte punktet til `BESLUTTET`.
- **Maks to runder** frem og tilbage om samme punkt. Tredje gang eskaleres til mennesket som et konkret valg ("A eller B, jeg anbefaler A fordi …") — ikke som et åbent spørgsmål.

## Handoff

Afslut **altid** dit svar med denne blok:

```
HANDOFF
Nummer:       NNNN
Rolle:        <din rolle>
Udført:       <1-3 linjer>
Filer:        <stier du har oprettet eller ændret>
Næste:        <se nedenfor>
Blokeret af:  <ÅBENT-punkter eller "intet">
```

`Næste` skal kunne **kopieres direkte ind i Claude Code**, ikke oversættes. Tre former:

```
Næste:  ny tråd → /agents:tester — acceptkriterier ud fra planen
Næste:  her → /agents:security — gennemgå ændringen på 0007
Næste:  menneske — planen står som udkast og skal godkendes
```

Kaldet skrives som det tastes i appen. Har det et argument, står det efter kaldet:

```
Næste:  ny tråd → /agents:brainstorm Regellogik
```

**Aldrig** som en terminalkommando. Det her er forkert, og det er den fejl der sker oftest:

```
claude "/agents:brainstorm Regellogik"     ← nej
$ /agents:brainstorm                        ← nej
```

Folk sidder i skrivebordsappen, ikke i en terminal.

**Præfikset er obligatorisk.** Et `Næste` der peger på en rolle uden `ny tråd →` eller `her →` er ufuldstændigt — mennesket ved så ikke om tråden skal lukkes.

Hvilken af de to første afgøres mekanisk, ikke ved skøn:

| Næste rolle | Præfiks | Hvorfor |
|---|---|---|
| `security`, `reviewer`, `scout`, `status` | `her →` | De kører i deres eget vindue og forurener ikke din tråd |
| `kickoff`, `brainstorm`, `architect`, `developer`, `tester` | `ny tråd →` | De kører i tråden, og en gammel kontekst følger med |
| `debugger` | `ny tråd →` | Altid. Gammel fejlkontekst giver falske spor |

**Du påtager dig aldrig den næste rolle selv.** Når handoff-blokken er skrevet, er dit arbejde slut — også selvom du står i en tråd der sagtens kunne fortsætte, og også selvom det næste skridt er indlysende. Du foreslår kaldet. Mennesket skriver det.

## Versionering

**GitHub er til kode.** Agenternes papirspor versionsstyres ikke: `docs/`, denne kontrakt og `.claude/` holdes ude af repoet af projektets `.gitignore`, fra første commit.

Det er ikke en oprydningsregel. `docs/findings/` kan indeholde sikkerhedsfund der endnu ikke er udbedret, og de må ikke kunne ende i et repo der bliver offentligt.

Forudsætningen er at vi som udgangspunkt arbejder alene på et projekt. Filerne er hukommelse mellem *tråde*, ikke mellem *maskiner*. Skal en anden overtage, overdrages `docs/` uden om git.

For koden gælder:

- **`.gitignore` findes før projektets anden fil.** En hemmelighed der er blevet committet, kan ikke slettes igen; den skal roteres. Derfor er rækkefølgen ikke til forhandling.
- **`.gitattributes` med `* text=auto eol=lf`.** Vi udvikler på Windows og kører i Linux-containere.
- **Én gren pr. nummer:** `0007-sagsliste-eksport`. Aldrig arbejde direkte på default-branch.
- **Én commit pr. afsluttet enhed** — en opgave i planen, et udført fund. Ikke én stor commit til sidst.
- **Commit-beskeder på dansk, imperativ, med nummer foran:** `0007: tilføj eksport af sagsliste`. Er der ikke noget nummer, brug rollens navn: `reviewer: fjern ubrugte imports`.
- **Push når koden er færdig og testet** — ikke ved hvert handoff. De fleste handoffs flytter kun markdown, og markdown bliver ikke pushet.
- **Du ændrer aldrig et versionsnummer.** Ikke i en pakkefil, ikke i et manifest, og du opretter eller flytter ikke et tag. En udgivelse er en beslutning — den træffes af mennesket, ikke som et trin i en opgave. Mange commits hører ofte til samme udgivelse.
  Sig til når noget er klar til at blive udgivet. Bump det ikke selv.
- Ingen force-push af grene. Ingen omskrivning af historik der er pushet.
- **Undtagelse, og kun når mennesket beder om det:** flytbare major-tags (`v1`, `v2`) på delte workflow-repoer flyttes med `git tag -f` og `git push -f origin v1`. Det er tagget hele pointen, og det er den eneste tilladte brug af `-f`. Immutable tags (`v1.0.3`) flyttes aldrig.
- Er en hemmelighed havnet i en commit: **stop, sig det, og få nøglen roteret.** At slette filen i næste commit løser ingenting.

## Sprog og stil

- **Dansk:** specs, planer, fund, beslutninger, commit-beskeder.
- **Engelsk:** kode, identifiers, filnavne, branch-navne, docstrings.
- Ingen emoji i kode eller commit-beskeder.
- Skriv kode der ligner den kode der allerede er der — samme navngivning, samme kommentar-tæthed, samme idiomer. Også hvis du selv ville have gjort det anderledes.

## Aldrig

- Ingen hemmeligheder, tokens, adgangskoder eller personoplysninger i kode, tests, docs eller commits.
- Ingen nye afhængigheder medmindre det står i en godkendt plan.
- Ingen commits til default-branch, ingen force-push, ingen sletning af filer uden for dit eget mandat.
- Ingen ændring af CI, deploy eller infrastruktur uden eksplicit besked fra mennesket.
