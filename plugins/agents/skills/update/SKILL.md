---
description: "Bringer projektets kopier fra plugin'et ajour: AGENTS.md og de workflows der er lagt ind. Bevarer projektets afvigelser og dets egne indstillinger. Brug når hooken siger at noget er bagud, eller efter en plugin-opdatering."
disable-model-invocation: true
---

# update

Projektet har **kopier** fra plugin'et. De følger ikke med når plugin'et opdateres, og du er den eneste vej tilbage. Der er to slags:

| Kopi | Lagt ind af | Bærer versionen |
|---|---|---|
| `AGENTS.md` i projektets rod | `kickoff` | `kontrakt-version` i frontmatter |
| Et workflow i `.github/workflows/` med sit dokument i `docs/workflows/` | `workflow` | `skabelon-version` i dokumentets frontmatter |

Du rører kun de filer. Tag kontrakten først, workflows bagefter — begge dele kan være ajour, og så siger du det og stopper med netop den del.

## Find plugin'ets filer

Kontrakten ligger i søsterskillen `kickoff`, i samme plugin: filen `AGENTS.md` i dens mappe. Fra denne mappe er den `../kickoff/AGENTS.md`.

Workflow-dokumenterne ligger i søsterskillen `workflow`: hver `.md`-fil i dens mappe undtagen `SKILL.md`. Fra denne mappe er det `../workflow/*.md`.

Kan du ikke finde dem ad den vej, så søg efter `*/skills/kickoff/AGENTS.md` og `*/skills/workflow/*.md` under plugin-mappen. **Gæt ikke på indholdet, og skriv det ikke selv** — findes en fil ikke, siger du det og springer den del over.

## Del 1 — kontrakten

### 1. Sammenlign versionerne

Begge filer har `kontrakt-version` i frontmatter. Mangler projektets, er den version 1 — fra før versionsstemplet fandtes.

**Der skrives kun når plugin'ets version er højere end projektets.** Er de ens, eller er plugin'ets lavere, rører du ikke filen. Sig hvilke to versioner du så, og at kontrakten derfor bliver stående, og gå videre til del 2.

At plugin'ets kontrakt er ældre end projektets, er ikke en fejl i projektet. Projektets kopi kan være lagt ind fra en nyere udgave end den der er installeret nu. Du ruller den ikke tilbage, og det standser ikke del 2 — workflows bærer deres eget stempel og sammenlignes hver for sig.

### 2. Tag projektets afvigelser til side

Findes afsnittet `## Projektspecifikke afvigelser` i projektets fil, **skal dets indhold bevares ordret.** Det er projektets egne beslutninger, og de findes ikke andre steder.

Er der ingen afvigelser, eller er afsnittet tomt, er der intet at bevare.

### 3. Læs de projektspecifikke ændringer der *ikke* står i afvigelsesafsnittet

Sammenlign de to filer afsnit for afsnit. Har nogen ændret den generelle tekst i projektets kopi — en regel formuleret om, et punkt tilføjet, en linje slettet — så **stop og vis det.**

Det er ikke en afvigelse; det er en utilsigtet ændring, eller en afvigelse nogen har skrevet det forkerte sted. Spørg om den skal med over i afvigelsesafsnittet, eller kasseres. Ét spørgsmål ad gangen.

Overskriv den ikke i tavshed. Nogen kan have haft en grund.

### 4. Tjek om strukturen passer til den nye kontrakt

Kontrakten beskriver hvilke mapper der findes under `docs/`. Ændrer den sig, kan projektet stå med en kontrakt der beskriver en struktur det ikke har — og så peger hver rolle på filer der ikke findes.

Kig efter begge dele:

- **Mapper den nye kontrakt nævner, som ikke findes** i projektet.
- **Mapper projektet har, som den nye kontrakt ikke nævner** — de bærer indhold nogen har skrevet.

Er der forskel, **stop før du skriver.** Vis den i almindeligt dansk: hvilke mapper hedder noget andet nu, hvor mange filer der ligger i de gamle, og hvad der sker hvis de bliver liggende.

**Du flytter ikke filerne.** En omdøbning af `docs/`-strukturen er en ændring af projektets historik og af hvad hver fil hedder — den træffes af mennesket, ikke som et trin i en opdatering. Der er tre veje, og du lægger dem frem uden at vælge:

- Filerne flyttes og omdøbes til den nye struktur.
- Projektet bliver på den gamle kontrakt indtil igangværende arbejde er i drift.
- Den gamle struktur skrives ind under `## Projektspecifikke afvigelser` som en bevidst afvigelse.

Er der ingen forskel, går du videre uden at nævne det.

### 5. Erstat

Skriv plugin'ets kontrakt til projektets `AGENTS.md`, og indsæt de bevarede afvigelser i `## Projektspecifikke afvigelser`.

## Del 2 — workflows

Gør det i denne rækkefølge, ét workflow ad gangen.

### 1. Find ud af hvad der er lagt ind

For hvert af plugin'ets workflow-dokumenter: læs `filer:`-feltet. Hver post har et `til:` — det er stien i projektet. Findes den fil, er workflowet lagt ind.

**Kig også i projektets `.github/workflows/`.** Bærer en fil dér en henvisning til `plugins/agents/skills/workflow/assets/` i sit hoved, er den vores kopi — også selv om den ikke står i noget `til:`. Det er sådan den fritstående udgave findes, for den kopieres ikke automatisk og har derfor ingen post i `filer:`. Samme hoved siger hvilket dokument i `docs/workflows/` der hører til filen.

**Gæt ikke på stier.** `til:` og henvisningen i filens hoved er de eneste steder der ved hvor kopien havnede og hvad dens dokument hedder. En fil uden den henvisning er ikke vores, uanset hvad den hedder. Findes der ingen af filerne, har projektet ikke workflowet, og der er intet at gøre.

### 2. Afgør hvilken udgave projektet har

Et workflow kan findes i to udgaver, og de skal behandles forskelligt:

| Udgave | Kendes på | Hvad projektet ejer |
|---|---|---|
| Den kaldende | en `uses:`-linje i projektets fil | kun sine egne indstillinger under `with` i hvert job — se trin 4 |
| Standalone | ingen `uses:`-linje på jobbet | hele filen, inklusive sine fastlåste action-versioner |

**Et projekt flyttes aldrig fra den ene udgave til den anden.** Valget blev truffet dengang workflowet blev lagt ind, og det kan have en grund du ikke kan se — typisk at projektet ikke kan nå det repo det genbrugelige workflow bor i. Ser du at projektet har standalone, opdaterer du standalone.

### 3. Sammenlign versionerne

Projektets kopi af dokumentet ligger i `docs/workflows/<navn>.md`. Sammenlign dets `skabelon-version` med plugin'ets.

- **Mangler stemplet** i projektets kopi, er den version 1 — fra før stemplet fandtes.
- **Der skrives kun når plugin'ets stempel er højere end projektets.** Er de ens, eller er plugin'ets lavere, sker der ingenting med det workflow. Sig hvilke to versioner du så, og gå videre til det næste.
- **Et lavere stempel i plugin'et er ikke en fejl.** Projektets kopi kan komme fra en nyere udgave af plugin'et end den der er installeret nu. Du ruller den ikke tilbage.

**Findes workflow-filen, men ikke dokumentet, er udgaven ukendt.** Så er der intet stempel at sammenligne med, og du regner den ikke for version 1 — et manglende dokument betyder at ingen ved hvad kopien er, ikke at den er gammel. I det tilfælde:

- **Versionsporten springes over.** Der skrives, uanset hvad plugin'ets stempel står på.
- **Begge filer skrives**, som i trin 6: workflow-filen og dokumentet, der lægges på plads for første gang.
- Trin 4 og 5 gælder uændret, og trin 5 er det der beskytter projektet i stedet for porten.

Sig til brugeren at dokumentet manglede, og at udgaven derfor ikke kunne aflæses.

### 4. Bevar projektets egne indstillinger

**I den kaldende udgave har kalderen flere jobs, og hvert job kan have en `with:`-blok.** Projektets egne indstillinger er de nøgler der står *aktive* under `with` i projektets kalder — platforme, en Dockerfile der ligger et andet sted, et andet imagenavn, navnet på servicen der udrulles. Den nye fil er plugin'ets udgave med dem lagt ind, job for job:

- **Pr. job bevares projektets egne nøgler.** Skabelonens nøgler kommer med. Står en nøgle begge steder, vinder projektets værdi. Skabelonens udkommenterede linjer tages med som de er.
- **`service` i deploy-jobbet er projektets.** Har projektet et deploy-job, bevares dets `service` ordret. Har det intet deploy-job — fordi kopien er fra før jobbet fandtes — spørger du om navnet, og foreslår det ud fra servicenavnene under `services:` i `deploy/docker-compose.yml` hvis filen findes. Flere services fra samme image skrives med komma. **Gæt aldrig.** Du kører i menneskets tråd og må spørge; skabelonens `web` er en pladsholder, ikke et svar.
- **Jobnavne er skabelonens.** Hedder projektets build-job `publish`, bliver det til `build`, og dets `with`-nøgler følger med over. Det er en omdøbning, ikke en rettelse der stopper noget.

Alt andet i filen erstattes af plugin'ets udgave, **også `permissions:` i hvert job.**

`permissions:` erstattes hårdt med vilje. Blokkene er en forudsætning for at push til registryet og commit til `main` virker, og er en af dem ændret, er den forkert. En bevaret fejl der viser sig som et loginproblem, koster mere end en overskrevet tilpasning.

**I standalone-udgaven er der ingen kalder og dermed ingen `with:`-blok at bevare.** Er filen ændret i forhold til plugin'ets udgave, gælder trin 5 for hele filen.

### 5. Stop hvis der er rettet andre steder

Er der ændringer uden for `with:`-blokkene — et trin tilføjet, en action-version bumpet, en betingelse rettet — så **stop og vis dem.** Ét spørgsmål ad gangen: skal ændringen kasseres, eller skal opdateringen droppes for det workflow?

**Har projektet jobs skabelonen ikke har, stopper du også.** Et build-job der hedder `publish`, er ikke et ekstra job — det er skabelonens eget under det gamle navn, se trin 4. Men to deploy-jobs med hver sin `service` på samme image er. Vis dem, og foreslå at slå dem sammen til ét deploy-job med servicene i én kommasepareret `service`-liste — så giver én release én commit og én udrulning. Valget er menneskets: slå sammen, eller drop opdateringen for det workflow.

Overskriv den ikke i tavshed. I standalone-udgaven især: der ejer projektet sine egne pins, og en lokal bumpet version kan være svaret på noget.

**Er udgaven ukendt, fordi dokumentet manglede, er dette trin det eneste der står mellem projektets ændringer og en overskrivning.** Sammenlign hele filen med plugin'ets udgave, og stop ved den første forskel du ikke kan henføre til en `with:`-blok.

### 6. Skriv begge filer

Kalderen i `.github/workflows/` **og** dokumentet i `docs/workflows/`. Skrives kun den ene, lyver den anden — og næste gang står der et stempel der ikke passer til det filen gør.

## Rapportér hvad der ændrede sig

I almindeligt dansk, ikke som en diff. Hvilke afsnit i kontrakten er nye, hvilke regler er ændret, hvad workflowet gør anderledes nu, og hvad det betyder for den måde der arbejdes. Mennesket skal kunne læse det uden at åbne filen.

Er der kommet regler der gør igangværende arbejde forkert — en ny formregel, et nyt loft — så sig det eksplicit.

**Ændrer et workflow sig sådan at det udløses af noget andet end før**, er det det vigtigste du siger. Et workflow der ikke længere bygger ved hvert commit, bygger ikke af sig selv — og det opdager ingen, fordi der ikke kommer en fejl.

Så opregner du de steder i projektet der stadig beskriver det gamle vilkår. De blev forkerte i samme sekund, og ingen fejl siger det.

Kig i `CLAUDE.md`, `README.md`, filerne under `docs/`, og projektets `AGENTS.md`. **Også `## Projektspecifikke afvigelser`**, som du lige har bevaret ordret — en bevaret sætning kan være blevet forkert, og den er svær at få øje på netop fordi den blev bevaret med vilje.

Ikke kode. Og ikke rapporterne under `docs/` eller beslutningsloggen: de beskriver hvad der var sandt dengang, og det skal de blive ved med.

Ét sted pr. linje: hvor det står, og hvad der er forkert ved det nu. **Du retter ingenting** — de filer er ikke dine, og opregningen er noget du siger.

**Har udløsningsvilkåret ikke ændret sig, leder du ikke, og du siger ikke noget om det.** En liste der kommer hver gang, finder tilfældigheder og lærer folk at springe den over.

**Gør workflowet noget nyt uden at udløses af noget nyt, siger du det alligevel højt.** Det er det næstvigtigste. Bringer du `docker-publish` fra skabelon-version 2 til 3, bygger det stadig kun ved tag-push, så opregningen ovenfor udløses ikke — men kalderen committer nu til `main` ved hver release, og en compose-fil der bryder reglerne, giver en rød release på et projekt der ikke har ændret andet end et tag. Sig begge dele, og peg på `## Regler for compose-filen` i det dokument du lige har skrevet til `docs/workflows/`. Foreslå at compose-filen lintes lokalt før næste release; hvordan står i samme dokument.

## Du må ikke

- Røre andet end de to slags kopier: projektets `AGENTS.md`, de installerede workflow-filer, og deres dokumenter i `docs/workflows/`. Ikke `BOARD.md`, ikke beslutningsloggen, ikke `CLAUDE.md`, ikke kode.
- **Flytte, omdøbe eller oprette mapper under `docs/`.** Se del 1, trin 4. Du opdager forskellen og lægger vejene frem; valget er menneskets.
- Kaste projektets afvigelser væk, eller dets egne indstillinger under `with` i noget job — heller ikke `service`.
- Gætte på `service`. Har projektet intet deploy-job, spørger du.
- Flytte et projekt mellem den kaldende og den standalone udgave af et workflow.
- Skrive en kontrakt eller et workflow ud fra hukommelsen. Findes plugin'ets fil ikke, stopper du.
- Opdatere når plugin'ets version ikke er højere end projektets. Det gælder både når de er ens, og når plugin'ets er lavere.
  **Én undtagelse:** findes workflow-filen uden sit dokument i `docs/workflows/`, er udgaven ukendt, og der er ikke noget stempel at måle på. Så skrives begge filer alligevel. Se del 2, trin 3.

## Lukning

```
LUKNING
Skrevet:      AGENTS.md, .github/workflows/docker-publish.yaml, docs/workflows/docker-publish.md
Åbent:        docs/plans/ og docs/findings/ hedder noget andet i den nye kontrakt. 7 filer. Ikke flyttet
Næste:        beslut hvad der skal ske med den gamle docs-struktur
Uskrevet:     intet
```

Er der igangværende arbejde som de nye regler gør forkert, siger du det i prosaen over blokken — og peger på hvad der skal gennemgås først.
