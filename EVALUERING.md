# Evaluering: ba-nsp-data, august 2026

Første rigtige afprøvning af metoden. Et eksisterende projekt i drift på Portainer
blev scoutet og kørt igennem hele flowet, fra `kickoff` til `security`.

Dette er ikke en referatfil. Det er en arbejdsliste: hvert punkt er noget der skal
ændres i dette repo, med belæg fra afprøvningen og et forslag til hvor rettelsen
hører hjemme. Ret i punkterne, slet dem du er uenig i, og luk dem efterhånden.

## Grundlaget

| | |
|---|---|
| Periode | 24.–25. august 2026, ca. to arbejdsdage |
| Tråde | 19 |
| Commits | 33, alle lokale — intet pushet, intet merget, intet deployet |
| Faktisk leverance | `sql/001_schema.sql` + `sql/002_views.sql` = **301 linjer SQL** |
| Øvrig kodeændring | 1.054 indsatte, 223 slettede linjer |
| Tests | ~4.600 linjer |
| Dokumentation | ~3.800 linjer |

Projektet virkede før og virker stadig — det kører den gamle kode. Den nye datamodel
har aldrig rørt databasen.

**Det metoden fandt, som ingen havde set:** at pagineringen kunne flytte vandmærket
forbi rækker vi aldrig læste, så sager forsvandt permanent uden at noget fejlede
(F5). At modellen aldrig sletter noget, så udmeldte medarbejderes navne bliver
stående for evigt (F4). At en databasefejl skriver personoplysninger i
containerloggen (F3). Tre ægte fund. Det er metodens eksistensberettigelse, og
intet nedenfor må rettes på en måde der koster os dem.

## Punkterne

| # | Punkt | Rammer | Status |
|---|---|---|---|
| 1 | Skriv hvad der skal besluttes — ikke et nummer | alle roller | åben |
| 2 | `Næste: menneske` skal bære spørgsmålet | alle roller | åben |
| 3 | Ét spørgsmål ad gangen | `kickoff`, `brainstorm` | åben |
| 4 | `architect` mangler et proportionalitetsloft | `architect` | åben |
| 5 | Testmængden skal følge konsekvensen | `tester` | åben |
| 6 | Scoutens ukendte punkter bliver ikke til arbejde | `scout`, `brainstorm`, `architect` | åben |
| 7 | Ingen rolle ejer leverancen | flowet | åben |
| 8 | Attrappen forsvinder med tråden | `tester` | åben |
| 9 | Loft på igangværende numre | `AGENTS.md` | åben |
| 10 | Små beslutninger skal have en hurtig bane | `AGENTS.md` | åben |
| 11 | BOARD.md forfalder til en anden beslutningslog | `AGENTS.md`, skabelonen | åben |
| 12 | Kontrakten kender ikke projektets versioneringsvalg | `kickoff` | åben |
| 13 | `reviewer` og `debugger` blev aldrig afprøvet | — | åben |

---

## 1. Skriv hvad der skal besluttes — ikke et nummer

**Status:** åben

Rollerne skriver til den næste agent, ikke til mennesket. Det er den enkeltfejl der
gør mest skade, fordi den rammer præcis dér hvor mennesket skal træffe en beslutning.

**Belæg.** Sådan så det ud i `docs/BOARD.md` under *Venter på godkendelse*:

> Opgave 8, fund F1: vejen er din fra 2026-08-25, placeringen er `architect`s.
> Afgrænsningen ligger i `main` og ændrer den timevise skrivevej fra 0001 —
> `write_to_sql` og `create_ticket_df` er urørte. Ét ja, og `tester` kan skrive
> acceptkriterierne

Der står ikke ét sted hvad opgave 8 gør. For at kunne svare skal mennesket åbne
planen — og hele pointen i `AGENTS.md` er at det aldrig skal være nødvendigt.

Sådan burde det se ud:

> **Skal den timevise hentning holde op med at skrive sager, der blev lukket for
> over fem år siden?**
> I dag skriver den dem ind, og sletteløbet fjerner dem igen næste morgen.
> Ændringen er ca. 10 linjer i `main.py`.
> Ja eller nej.

**Forslag.** En regel i `AGENTS.md` under *Sprog og stil*, som alle roller arver:

- Henvis aldrig til noget ved nummer alene. Skriver du "opgave 8", "F1" eller
  "AK30a", skal den følgende sætning sige hvad det er, i almindelige ord.
- Alt der er skrevet til mennesket, skal kunne læses uden at åbne en fil.
  Filstier, funktionsnavne og commit-hashes er sporbarhed — de er ikke forklaringen.
- Rollenavne i en tekst til mennesket er støj. Mennesket skal ikke vide at
  placeringen er `architect`s; det er vores interne arbejdsdeling.

---

## 2. `Næste: menneske` skal bære spørgsmålet

**Status:** åben

Handoff-blokkens sidste linjer er dem mennesket læser. Når bolden er hos mennesket,
skal linjen sige hvad der skal besvares — ikke hvilken tilstand en fil står i.

**Belæg.** Hvert eneste eksempel i dette repo lærer den forkerte form fra sig:

| Fil | Eksemplet i dag |
|---|---|
| `skills/architect/SKILL.md:84` | `Næste: menneske — planen står som udkast og skal godkendes` |
| `skills/brainstorm/SKILL.md:134` | `Næste: menneske — spec 0007 står som udkast og skal godkendes` |
| `skills/kickoff/SKILL.md:288` | `Næste: menneske — charter og fundament står som udkast og skal godkendes` |
| `skills/kickoff/AGENTS.md:106` | `Næste: menneske — planen står som udkast og skal godkendes` |
| `agents/scout.md:78` | `Næste: menneske — kortet i docs/map.md er grundlag for det næste valg` |

Alle fem beskriver en filtilstand. Ingen af dem stiller et spørgsmål.
`skills/kickoff/AGENTS.md:64-70` kræver faktisk at der står punkter om hvad der skal
besluttes *før* blokken — men det er formuleret som en opfordring, og eksemplerne
modsiger den.

**Forslag.**

- Skriv eksemplerne om, alle fem steder, til formen *spørgsmål først*:
  `Næste: menneske — skal skemaet droppes og bygges om, eller migreres kolonne for kolonne?`
- Gør kravet i `AGENTS.md` til en formregel frem for en opfordring: bolden hos
  mennesket kræver mindst ét spørgsmål der kan besvares med ja, nej eller A/B.
  "Skal godkendes" er ikke et spørgsmål.

---

## 3. Ét spørgsmål ad gangen

**Status:** åben

Metoden foreskriver i dag udtrykkeligt en tekstvæg, og det skal vendes om.

**Belæg.** `GUIDE.md:89`, `skills/kickoff/SKILL.md:55` og `:59`, og
`skills/brainstorm/SKILL.md:24` siger alle **rul af 3-4 spørgsmål**.
`kickoff/SKILL.md:59` begrunder det med at hver runde skal reagere på de forrige svar
— men den begrundelse taler jo *for* ét ad gangen, ikke for fire.

**Forslag.** Ét spørgsmål, ét foreslået svar, vent. Så det næste spørgsmål, formet
af svaret. Rettes fire steder. Begrundelsen i `kickoff/SKILL.md:59` kan blive stående
næsten uændret — den passer bedre til den nye form end til den gamle.

**Åbent:** koster det flere runder i alt? Sandsynligvis ikke — halvdelen af
spørgsmålene i et rul bliver irrelevante af svaret på det første.

---

## 4. `architect` mangler et proportionalitetsloft

**Status:** åben

`developer` har forbud mod fremtidssikring: *"Ingen 'mens jeg var i filen'-udvidelser,
ingen fremtidssikring, ingen abstraktioner til behov der ikke findes endnu."*
`architect` har intet tilsvarende — og det er `architect` der lægger opgaverne.

**Belæg.** Paginering blev planlagt og bygget til en tabel med 726 rækker og en
sidestørrelse på 1.000. Beslutningsloggen indrømmer det selv:

> Begrundelsen er rettet undervejs: det er ikke fordi genindlæsningen sprænger 1000
> rækker i dag — der er 726 sager i alt.

260 af de 1.054 ændrede kodelinjer er paginering til et problem der ligger cirka et
år ude i fremtiden. Dertil 251 linjer skemaverifikation. Ingen af delene var en del
af den oprindelige opgave.

**Forslag.** Under `## Du må ikke` i `skills/architect/SKILL.md`:

- Planlæg ikke for mængder, laster eller behov projektet ikke har i dag. Er det
  fremtidigt, bliver det sit eget nummer med sin egen begrundelse — ikke en opgave
  i denne plan.
- Kan en opgaves begrundelse kun formuleres i fremtid ("den dag vi passerer …"),
  hører den ikke til i planen.

Og et krav om at planen skal opgøre sit eget omfang: hvor mange linjer rører den,
og hvor meget af det er selve opgaven. Et tal gør det svært at glide.

---

## 5. Testmængden skal følge konsekvensen

**Status:** åben

Fire linjer test pr. linje produktionskode på en ETL på 1.100 linjer. Noget af det er
rigtigt: 43 tests for det modul der sletter produktionsdata, er den rette afvejning.
Andet er det ikke.

**Belæg.** `tests/test_retention_doc.py` er 167 linjer der `grep`'er i en
markdown-fil efter danske ord. Testen der fejler netop nu, fejler fordi
`DATAMODEL.md` ikke indeholder "uændre", "uændret" eller "de samme" tæt nok på
ordet "views". Det er ikke en test af systemet. Den knækker næste gang nogen
omformulerer en sætning, og den ville aldrig fange en fejl i koden.

**Forslag.** Under `## Du må ikke` i `skills/tester/SKILL.md`:

- Test ikke prosa. En test der leder efter ord i dokumentation, måler formulering
  og ikke adfærd. Skal dokumentationen dække noget bestemt, er det et
  acceptkriterium der læses af et menneske — ikke en assertion.

Og i `## Proces`, som nyt punkt 1: vurder konsekvensen af at tage fejl, før du
vælger dækning. Et modul der sletter rækker, og et modul der omdøber en kolonne,
skal ikke have samme testmængde.

---

## 6. Scoutens ukendte punkter bliver ikke til arbejde

**Status:** åben

`scout` gjorde sit arbejde. Det var flowet der tabte resultatet.

**Belæg.** `docs/map.md:293-295` skrev på dag ét, under *hvad jeg ikke ved*:

> **NSP-API'ets kontrakt.** Hvordan svarets konvolut ser ud ud over `Data`, om der
> findes et totalantal … Alt ovenstående om API'et er udledt af, hvad koden bestiller
> og læser — ikke af dokumentation.

Præcis dét væltede os på dag to: `developer` opdagede midt i en rettelse at
sorteringsnøglen hedder `sorts` og ikke `sort`, og at svaret bærer et `Total`-felt —
som blev hele grundlaget for spærren i F5. Leverandørens dokumentation lå
offentligt tilgængelig hele tiden. Ingen rolle læste kortets usikkerhedsliste som
en opgaveliste, så den lå urørt i et døgn.

**Forslag.**

- `brainstorm` og `architect` skal kvittere for hvert punkt på scoutens liste:
  afklaret, bevidst accepteret, eller eget nummer. Ikke noget punkt uden en af de tre.
- `scout` skal aktivt lede efter ekstern dokumentation til de API'er og systemer
  projektet taler med, og skrive ned hvor den ligger — eller at den ikke findes.
  I dag læser rollen kun repoet.

---

## 7. Ingen rolle ejer leverancen

**Status:** åben

`developer` sætter planen til `færdig` når opgaverne er lukket og tests kører. Ingen
rolle har mandat til at merge, pushe eller bekræfte at det kører. Derfor er
definitionen af færdig "grøn suite" — og værdien opstår ikke der.

**Belæg.** 33 commits, to dage, ingenting pushet. Grenen `0001-ny-datamodel` er ikke
merget. Planens opgave 8 og 9 — dem der rører produktionsdatabasen — står stadig
`åben`. Containeren i Portainer kører uændret den gamle kode. Metoden opdagede det
ikke, fordi ingen rolle kigger efter det.

**Forslag.** To veje, vælg én:

- **A:** En ny rolle, `/agents:release`, der merger, pusher og bekræfter at det
  kørende system svarer til grenen. Egen fase på BOARD.
- **B:** Udvid `developer`s definition af `færdig` til at inkludere push og merge,
  og lad `status` rapportere afstanden mellem `main` og det der kører.

A er renere, fordi det sidste skridt tit kræver et menneske i forvejen (opgaver der
rører produktionsdata). B er billigere.

---

## 8. Attrappen forsvinder med tråden

**Status:** åben

Metodens stærkeste kvalitetspåstand kan ingen efterprøve.

**Belæg.** `tester` skrev flere gange at suiten er grøn 205 af 205 mod "en attrap af
den færdige tilstand i en kopi **uden for repoet**", og at 31 mutationer af attrappen
alle blev røde. Det er metodisk stærkt — det er sådan man beviser at tests der endnu
ikke kan bestå, faktisk måler noget. Men attrappen er ikke gemt. Jeg har ledt efter
den; den er væk sammen med tråden. Tilbage står en påstand.

**Forslag.** I `skills/tester/SKILL.md`: bygger du en attrap for at efterprøve tests
mod en implementering der ikke findes endnu, committes den — som
`tests/attrap/NNNN/` eller et script der bygger den. Mutationslisten skrives i
testplanen, ikke kun i handoff'et. Et bevis der forsvinder med tråden, er ikke et bevis.

---

## 9. Loft på igangværende numre

**Status:** åben

BOARD-reglen siger "ét nummer, én linje", men intet begrænser hvor mange numre der
kører samtidig.

**Belæg.** Nummer 0003 fik spec, plan, testplan, 67 acceptkriterier og 934 linjer
test for `utils/prune_tickets.py` — et modul der ikke findes. Samtidig er 0003's
opgave 6 og 7 blokeret af 0001's opgave 8 og 9, som er blokeret af mennesket. Vi
byggede færdige tests til et modul, der venter på en migrering, der venter på et
svar. Suiten står rød med vilje, hvilket gør den ubrugelig som signal så længe det
står på.

**Forslag.** Ét nummer ad gangen i faserne `byg` og `sikkerhed`. Vil man starte et
nyt, skal det forrige være i `færdig` eller udtrykkeligt henlagt. Hører i `AGENTS.md`
under BOARD-reglerne.

---

## 10. Små beslutninger skal have en hurtig bane

**Status:** åben

`AGENTS.md` siger: står en linje med bolden hos mennesket, arbejder ingen agent
videre på det nummer. Det er rigtigt for reelle valg. Det er dyrt for trivialiteter.

**Belæg.** Ét af de to punkter der blokerede ved afprøvningens slutning: skal CI's
build-trin pege på `dockerfile` i stedet for `./Dockerfile`? Ét tegns forskel. Det
blokerede et nummer.

**Forslag.** Rører en beslutning hverken data, adgang, afhængigheder, infrastruktur
eller produktets omfang — og kan den skrives på én linje — så træffer rollen den og
noterer den i loggen med sin begrundelse. Mennesket kan altid rulle den tilbage;
loggen er der netop for at gøre det muligt.

Alternativt, hvis det er for løst: saml de ventende ét-linjers-valg og stil dem i
én omgang, i stedet for at blokere et nummer pr. stykke.

---

## 11. BOARD.md forfalder til en anden beslutningslog

**Status:** åben

**Belæg.** Reglen er "ét nummer, én linje". Linjen for 0003 endte som otte linjer
prosa med commit-hashes, filstier og rollenavne. Så er der ikke længere et overblik,
og filen dubletterer beslutningsloggen — som allerede gør det arbejde bedre.

**Forslag.** Håndhæv formen: én linje, og et hårdt loft (fx 200 tegn) i skabelonen.
Begrundelser hører i `docs/decisions/log.md`. BOARD svarer på ét spørgsmål —
hvem har bolden — og skal kunne skimmes på ti sekunder.

---

## 12. Kontrakten kender ikke projektets versioneringsvalg

**Status:** åben

**Belæg.** `AGENTS.md` siger at `docs/` ikke versionsstyres. I ba-nsp-data
versionsstyres `docs/` bevidst, fordi repoet deles med en kollega — besluttet ved
kickoff og skrevet i loggen. Beslutningen er rigtig. Men kontraktteksten blev ikke
rettet, så den kopi der ligger i projektet, siger noget forkert om projektet.
Næste agent læser en regel der ikke gælder.

**Forslag.** `kickoff` spørger allerede om `docs/` deles. Svaret skal skrives ind i
den `AGENTS.md` der lægges i projektet — ikke kun i `.gitignore`. Afsnittet
*Versionering* får to varianter, og `kickoff` vælger den der passer.

---

## 13. `reviewer` og `debugger` blev aldrig afprøvet

**Status:** åben

Der findes ingen `docs/findings/0001-review.md` og ingen `docs/rca/`.
`GUIDE.md`'s eget gennemspil har `security` og `reviewer` som trin 10, kørende
parallelt — kun den ene halvdel blev kørt. To af ni roller er stadig uafprøvede,
og `reviewer` er den der skulle have fanget noget af omfanget i punkt 4 og 5.

**Forslag.** Kør begge på ba-nsp-data før flere ændringer i dette repo. `reviewer`
på grenen `0001-ny-datamodel`, og `debugger` ved næste rigtige fejl. Ellers ved vi
ikke om de virker.

---

## Rækkefølge

Punkt 1, 2 og 3 rammer hver eneste samtale og er rene tekstrettelser. Tag dem først.

Punkt 4 og 5 er dem der holder omfanget nede, og de er grunden til at afprøvningen
kostede 8.000 linjer for 301 linjers leverance.

Punkt 7 er den der gør at arbejdet rent faktisk kommer i drift.

Resten kan tages løbende.
