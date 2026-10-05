---
navn: docker-publish
skabelon-version: 3
formål: Linter compose-filen, bygger og signerer et container-image til GitHub Packages når der pushes et versionstag, og skriver den nye version ind i compose-filen på main så Portainer udruller den
foreslå-ja-når: projektets dokument siger at projektet leveres som container-image eller kører på en Docker- eller Portainer-vært
filer:
  - fra: assets/docker-publish.yaml
    til: .github/workflows/docker-publish.yaml
---

# docker-publish

Når der pushes et semver-tag (`v1.2.3`), bygges et image og pushes til `ghcr.io/<org>/<repo>`, og den nye version skrives ind i `deploy/docker-compose.yml` på `main`. **Almindelige commits bygger ikke** — heller ikke på `main`. PR-builds bygger men pusher ikke, så det kan ses at imaget overhovedet bygger, før nogen tagger.

Projektet får en **kalder** med tre jobs: `lint`, der holder compose-filen op mod reglerne nedenfor; `build`, der bygger og signerer imaget; og `deploy`, der skriver versionen ind i compose-filen. Selve arbejdet bor i `HJK-Automatisering/workflow` som genbrugelige workflows, så de SHA-pinnede action-versioner og reglerne kan bumpes ét sted i stedet for i hvert repository.

**Udrulningen er en commit på `main`.** Portainer følger `main`, læser compose-filen og udruller når den ændres — ved næste poll. Der er ingen webhook og ingen forbindelse fra GitHub til serveren; det eneste workflowet gør, er at committe den nye image-version. En grøn kørsel betyder at compose-filen er opdateret, ikke at den nye version kører endnu.

## Brug det når

- Projektet leveres som et container-image.
- Det kører på en Docker- eller Portainer-vært.
- Der findes en `Dockerfile` i roden, eller der kommer en.

## Brug det ikke når

- Projektet er et bibliotek eller en pakke der distribueres på anden vis.
- Det er et statisk site eller deployes gennem en anden pipeline.
- Der ikke er nogen plan om at containerisere. Tilføj det senere når der er.

## Hvad du får

| Tag | Hvornår | Brug |
|---|---|---|
| `:sha-a1b2c3d` | hver bygning | **immutabelt — det er dette du ruller tilbage til** |
| `:1.2.3` og `:1.2` | tag `v1.2.3` | udgivelser |
| `:main` | manuel kørsel fra `main` | rullende. Kommer ikke af sig selv længere |
| `:latest` | seneste semver-tag | |
| `:pr-123` | pull request | bygges, pushes ikke |

Imaget signeres med cosign mod sigstores Fulcio. Alle tags peger på samme digest, så der signeres én gang.

Build-jobbet returnerer `digest`, `version`, `tags` og `image` som outputs. Deploy-jobbet tager dem og skriver `<image>:<version>` ind i compose-filen — men først efter at have tjekket at tagget er præcis `vX.Y.Z` og ligger på `main`, at imaget er signeret af det fælles build-workflow, og at versionstagget i registryet peger på den verificerede digest. Et forhåndstag som `v1.2.3-rc1` bygges, men udrulles ikke; det er ikke en fejl, og kørslen er grøn.

Tilbagerulning er `git revert` af deploy-commit'en. Compose-filen peger så igen på den forrige version, og Portainer udruller den ved næste poll. Det forrige image findes stadig i GHCR og er præcis det der kørte — fordi `protect_release_tags` er slået til i kalderen, så et versionstag aldrig bygges igen.

## Forudsætninger projektet skal opfylde

Uden disse fejler workflowet — eller, værre, lykkes uden at gøre hvad du tror:

1. **Der skal tagges. Ellers bygges der aldrig.** Workflowet udløses kun af et push af et tag på formen `v1.2.3` — og af pull requests og manuel kørsel, som ikke pusher noget image. Et projekt der merger til `main` uden nogensinde at sætte et tag, får aldrig et image i GHCR, og der kommer ingen fejl der fortæller det. Sæt tagget når en udgivelse er besluttet: `git tag v1.2.3` og `git push origin v1.2.3`.
2. **`./Dockerfile` skal findes i roden.** Ligger den et andet sted, sæt `dockerfile:` i kalderen. Ret ikke det genbrugelige workflow.
3. **Dockerfilen skal tage imod `APP_VERSION` og `GIT_SHA`** som `ARG`, sætte dem som `ENV` og logge dem ved opstart. Ellers sendes de to build-args ind og forsvinder, og Portainers logvisning kan ikke fortælle hvilken build der kører. Det er hele grunden til at de er der.
4. **`permissions`-blokkene i kalderen skal stå der — i alle tre jobs.** Et genbrugeligt workflow kan ikke give sig selv flere rettigheder end kalderen har. Er organisationens standard read-only, fejler push til GHCR og commit til `main` uden dem — og fejlen ser ud som et loginproblem.
5. **Intet at gøre — `workflow`-repoet er offentligt**, og offentlige genbrugelige workflows kan kaldes af alle uden yderligere opsætning. Bliver det nogensinde privat igen, skal Settings → Actions → General → Access åbnes for organisationen; ellers fejler kaldet med at workflowet ikke findes, hvilket ligner en stavefejl i stien.
6. **`@v1` skal findes i `workflow`-repoet** som et flytbart tag ved siden af de immutable `v1.x.y`. Se vedligeholdelse nedenfor. Kontrollér med `git ls-remote --tags https://github.com/HJK-Automatisering/workflow`.
7. **Kun `linux/amd64` som standard.** Skal det køre på arm, sæt `platforms:` i kalderen. Tilføj ikke arm64 "for at være sikker": det bygger under QEMU-emulering og tager mange gange så lang tid.
8. **Pakken oprettes ved den første bygning der pusher** — altså ved det første versionstag — og er privat. Første gang skal den kobles til repoet, så adgangen arves, og synligheden sættes bevidst.
9. **Store bogstaver i organisationsnavnet.** GHCR kræver små. `metadata-action` konverterer sine egne tags, og cosign-trinnet konverterer i hånden — men bygger du selv en imagereference et tredje sted, skal du huske det samme.
10. **`deploy/docker-compose.yml` skal findes og bestå lint.** Det er filen deploy-jobbet skriver i, og den lintes i hver pull request og igen før deploy-commit'en. Ligger den et andet sted, sæt `compose_path:` i både lint- og deploy-jobbet. Reglerne står nedenfor; kør scriptet lokalt før den første pull request, så den første release ikke bliver rød på en regel projektet aldrig har set.
11. **Portainer kører stakken som Git-stack fra `main`**, med `deploy/docker-compose.yml` som compose-sti og polling slået til, og med variablerne sat på stacken. Workflowet ved intet om Portainer; det committer, og Portainer opdager det. Er stakken stadig en der redigeres i Portainers web-editor, bliver deploy-commit'en aldrig til en udrulning. Opsætningen står trin for trin under *Opsætning af stacken i Portainer* nedenfor.
12. **`main` må ikke være beskyttet.** Deploy-jobbet committer med `GITHUB_TOKEN`, og den kan ikke skrive til en beskyttet gren — pushet afvises, og deploy-jobbet fejler. Skal `main` beskyttes, se afsnittet *Hvis `main` beskyttes* i README for `HJK-Automatisering/workflow`; vejene står der, og ingen af dem er noget projektet løser i kalderen.

## Inputs i kalderen

### Build-jobbet

Alle er valgfrie undtagen `protect_release_tags`, som skabelonen slår til. De øvrige står kommenteret ud.

| Input | Standard | Hvornår |
|---|---|---|
| `protect_release_tags` | `false` — **skabelonen sætter `true`** | Nægter at bygge hvis versionstagget allerede findes i registryet; en ny bygning kræver et nyt nummer. Gælder kun `vX.Y.Z`. Kan opslaget ikke gennemføres, fx fordi pakken ikke findes endnu, regnes tagget som ledigt. Slå det ikke fra: tilbagerulning hviler på at et versionstag altid er samme image |
| `platforms` | `linux/amd64` | Noget kører faktisk på arm |
| `dockerfile` | `./Dockerfile` | Dockerfilen ligger ikke i roden |
| `context` | `.` | Build-konteksten er en undermappe |
| `image_name` | `<org>/<repo>` | Andet imagenavn ønskes |
| `registry` | `ghcr.io` | Andet registry. Bemærk at deploy-jobbet logger fast ind på `ghcr.io` og ikke kan verificere et image i et andet registry |
| `sign` | `true` | Registryet understøtter ikke signering. Et usigneret image kan ikke udrulles |
| `extra_build_args` | tom | Flere build-args — læs sikkerhedsafsnittet først |

### Deploy-jobbet

`image`, `digest` og `version` tages fra build-jobbets outputs og rettes ikke. `service` er projektets.

| Input | Standard | Hvornår |
|---|---|---|
| `service` | `web` i skabelonen | Navnet på servicen under `services:` hvis `image:`-felt skal opdateres. Flere services fra samme image adskilles med komma, `web,worker`; de opdateres i én commit. Alle skal pege på samme image-navn — peger en af dem på et andet, stopper jobbet og intet ændres |
| `image` | build-jobbets `image` | Rettes ikke |
| `digest` | build-jobbets `digest` | Rettes ikke. Det er digesten der verificeres, ikke tagget |
| `version` | build-jobbets `version` | Rettes ikke. Skrives som `<image>:<version>` |
| `compose_path` | `deploy/docker-compose.yml` | Compose-filen ligger et andet sted. Sæt den samme i lint-jobbet |

Har repoet flere images, kaldes deploy-workflowet én gang pr. image som to deploy-jobs med hver sin `service`. Rammer de hinanden på push, henter workflowet `main` igen og prøver igen, op til tre gange.

### Lint-jobbet

| Input | Standard | Hvornår |
|---|---|---|
| `compose_path` | `deploy/docker-compose.yml` | Compose-filen ligger et andet sted. Sæt den samme i deploy-jobbet |

Mangler et input du har brug for, tilføjes det i det genbrugelige workflow — ikke ved at kopiere workflowet ind i projektet og rette i det.

## Sikkerhed

**Build-args ender som `ENV` i det færdige image.** Alle der kan pulle imaget kan læse dem. `APP_VERSION` og `GIT_SHA` er harmløse — men lægger nogen en token, en forbindelsesstreng eller en adgangskode i `extra_build_args`, er den offentlig, og den skal roteres. Ikke bare fjernes.

Hemmeligheder der skal bruges *under* bygningen hører i `secrets:` med BuildKit-mounts, ikke i `build-args`. Hemmeligheder der skal bruges *ved kørsel* sættes som stackens variabler i Portainer og substitueres ind i compose-filen — se reglerne nedenfor.

Tilføj ikke `secrets: inherit` til kalderen. `GITHUB_TOKEN` følger automatisk med; `inherit` giver det kaldte workflow adgang til alt hvad repoet har.

**Intet organisationsspecifikt i det genbrugelige workflow.** Repoet er offentligt, så alle kan læse det og alle kan kalde det. Interne registries, navne på secrets og værtsnavne hører i kalderen eller i et `input` — aldrig i workflowet selv. Det er ikke fordi et navn er en hemmelighed, men fordi et offentligt repo ikke kan gøres privat igen med tilbagevirkende kraft: det der har været læsbart, har været læsbart.

At andre uden for organisationen kan kalde workflowet er i sig selv ufarligt — de kører det med deres eget `GITHUB_TOKEN` og pusher til deres eget registry. Reglen ovenfor er det der holder det sådan.

## Regler for compose-filen

Compose-filen på `main` er det Portainer udruller. Variabler og hemmeligheder sættes på stacken i Portainer og substitueres ind i filen ved udrulning, hvor der står `${NØGLE}`. Der findes ingen `stack.env` for Git-stacks, og der bruges ingen `env_file` — filen indeholder nøgler, aldrig værdier. `.env.example` med navnene alene er fint og hører i repoet; det er `.env` og `stack.env` der ikke må committes.

Reglerne håndhæves af `scripts/compose_lint.py` i `HJK-Automatisering/workflow` tre steder: lokalt før en pull request, i pull requests af lint-jobbet, og i deploy-jobbet før commit — så de ikke kan omgås ved at skrive direkte på `main`. Regelnavnene her er de samme som scriptet skriver i sine fund, så en fejl kan rettes efter listen uden at læse scriptet. Hvert fund har fil, linje, regelnavn og service:

```text
::error file=deploy/docker-compose.yml,line=12::[latest] web: imaget `ghcr.io/<org>/<app>:latest` har tagget `latest`, som flytter sig. Skriv et versionstag, fx `:1.2.3`.
```

Exit-koden er `0` uden fejl (advarsler tillades), `1` ved fejl og `2` ved forkerte argumenter.

| Regel | Fejler når |
|---|---|
| `build` | `build:` findes. Imaget bygges og signeres af `docker-publish.yaml`; compose-filen peger kun på et image |
| `latest` | image mangler tag, tagget indeholder intet ciffer, eller tagget er et af `latest`, `main`, `master`, `stable`, `edge`, `dev`, `nightly`, `lts`. `postgres:16` og `redis:7-alpine` er tilladt; egne images er altid `X.Y.Z` via `deploy-update.yaml` |
| `privileged` | `privileged: true` |
| `docker-sock` | et volume har `/var/run/docker.sock` som kilde |
| `bind-mount` | et volume er en sti på værten (`/`, `./`, `../`) i kort form, eller `type: bind` i lang form, i stedet for et navngivet volume. `- /data` alene er et anonymt volume og er tilladt |
| `host-adgang` | `network_mode: host`, `pid: host`, `devices`, `cap_add`, `sysctls` eller `security_opt` |
| `hemmelighed` | en nøgle under `environment:` indeholder `PASSWORD`, `PASSWD`, `SECRET`, `TOKEN` eller `CREDENTIALS` som delstreng, eller `KEY` eller `PRIVATE` som helt led adskilt af `_` (`API_KEY` fejler, `KEYCLOAK_URL` gør ikke), og værdien ikke er præcis `${NAVN}`. `${NAVN:-standard}` og `${NAVN-standard}` fejler også |
| `env-vaerdi` | enhver anden værdi under `environment:`, der ikke er præcis `${NAVN}`. En nøgle uden værdi fejler også. Variabelnavnet behøver ikke være lig nøglen |
| `env-fil` | `env_file:` findes, eller en `stack.env` eller `.env` er committet i repoet. Tjekket bruger `git ls-files`; uden git springes det over med en advarsel |
| `restart` | `restart` mangler eller er `no` |
| `mem-limit` | `mem_limit` og `deploy.resources.limits.memory` mangler begge |
| `logging` | `logging.options.max-size` eller `max-file` mangler |
| `ports` | `ports:` findes. Al adgang går via Nginx Proxy Manager |
| `container-name` | `container_name` findes. Navnet kolliderer på tværs af stacks |
| `eksternt-netvaerk` | et netværk med `external: true` er ikke `nginx-proxy-manager_default` |
| `alias` | en service på `nginx-proxy-manager_default` mangler et netværksalias. Ingen krav til aliasets form |

`environment:` tjekkes i både mapping-form (`NØGLE: ${NØGLE}`) og listeform (`- NØGLE=${NØGLE}`). Én nøgle giver én fejl; `hemmelighed` vinder over `env-vaerdi`. Ét volume giver én fejl; `docker-sock` vinder over `bind-mount`.

### Undtagelser

En regel kan undtages for en service i topniveau-feltet `x-undtagelser`, som Docker Compose ignorerer. Alle fem felter skal være der:

```yaml
x-undtagelser:
  - service: web
    regel: bind-mount
    begrundelse: "Leverandørens image kræver konfigurationsfil på denne sti"
    godkendt-af: "Navn Navnesen"
    dato: "2026-10-01"
```

- En regel dækket af en gyldig undtagelse giver en **advarsel** i stedet for en fejl, og kørslen er grøn.
- En undtagelse uden `service`, `godkendt-af` eller `dato`, eller med et ukendt regelnavn, er **selv en fejl** og dækker intet.
- Undtagelser udløber ikke, men en `dato` ældre end et år giver en advarsel. Afgør om den stadig gælder, og sæt en ny dato.
- En undtagelse der ikke rammer nogen fejl, er død og giver en advarsel. Fjern den.
- For `eksternt-netvaerk` er `service` netværkets navn — typisk en anden stacks netværk, som en service skal kunne nå:

```yaml
x-undtagelser:
  - service: <andet-system>_default
    regel: eksternt-netvaerk
    begrundelse: "Servicen skal nå en database der kører i en anden stack"
    godkendt-af: "Navn Navnesen"
    dato: "2026-10-01"
```

- En committet `.env` eller `stack.env` kan ikke undtages. Filen fjernes fra git med `git rm --cached`, og `.gitignore` skal dække den.

### Lokal kørsel

Scriptet kører uden GitHub-kontekst og uden Docker. Det ligger i `workflow`-repoet og køres fra en lokal klon af det, i det repos eget `.venv` med `ruamel.yaml` fra dets `requirements.txt`. Miljøet oprettes én gang; derefter er det kun den sidste linje:

```powershell
python -m venv .venv
.venv\Scripts\python.exe -m pip install -r requirements.txt
.venv\Scripts\python.exe scripts\compose_lint.py ..\<app-repo>\deploy\docker-compose.yml
```

Findes `docker compose` ikke på maskinen, springes compose-tjekket over med en advarsel; den fulde kontrol sker i Actions. Fundene skrives på samme form som i Actions, så de kan rettes efter linjenummer.

## Opsætning af stacken i Portainer

Det her gør et menneske i Portainers webflade, én gang pr. app. Rollerne rører ikke Portainer, og intet workflow prøver. Når det er gjort, er hver release en commit på `main` som Portainer selv opdager; ingen rører stacken igen bortset fra variablerne.

Rækkefølgen er: compose-filen på `main` først, så registry og Git-adgang, så stacken, så første release. Opretter du stacken før compose-filen består lint, får du en stack der ikke kan starte, og fejlen ser ud som et Portainer-problem.

### 0. Før du går i Portainer

- `deploy/docker-compose.yml` ligger på `main` og består lint. Imaget står med den version der skal køre først — ved en migrering den version der kører i dag, så første udrulning fra Git ikke ændrer noget.
- Hver variabel compose-filen bruger som `${NØGLE}` er kendt med navn og værdi. `.env.example` i repoet har navnene; værdierne har den der driver appen i dag.
- Imaget findes i GHCR i den version compose-filen peger på. Det gør det efter det første versionstag; se forudsætning 8 om at pakken skal kobles til repoet.
- Du kender navnet på den stack der eventuelt kører i dag. Det skal genbruges; se trin 3.

### 1. Registry — GHCR skal kunne pulles

Gøres af den der administrerer Portainer, én gang for organisationen; findes registryet allerede, springes trinnet over. Pakkerne er private, så Portainer skal logge ind på `ghcr.io` for at pulle.

I Portainer: **Registries → Add registry → GitHub.** Felterne:

| Felt | Værdi |
|---|---|
| Name | Et navn, fx `GHCR` |
| Username | GitHub-brugernavnet tokenet er udstedt til |
| Personal Access Token | Et **klassisk** token; Portainers GitHub-registry tager ikke fine-grained tokens. Mindst `read:packages`. Tokenet skal tilhøre en bruger med adgang til organisationens pakker |
| Use organisation registry | Slået til |
| Organisation name | Organisationens GitHub-navn, som det står i `ghcr.io/<org>/...` |

Registryet skal derefter have adgang til det miljø stacken kører på; i Business Edition gives adgangen pr. miljø. På stacken vælges det under *Select registries*, og det er det valg der lader Portainer logge ind på `ghcr.io` når imaget pulles. Står der intet at vælge, mangler adgangen til miljøet.

Et registry-token udløber. Når det gør, fejler pull ved næste release med en loginfejl i stackens log, og ingen i GitHub ser noget. Skriv udløbsdatoen ned et sted mennesker kigger.

### 2. Git-adgang — Portainer skal kunne læse app-repoet

App-repoet er privat, så Portainer skal have et token til at hente det. Tokenet sidder på en **Git-kilde** under *App Delivery → Sources*, én pr. app, og bruges kun til at læse, aldrig til at skrive.

- Lav et token i GitHub med **læseadgang til app-repoets indhold** og intet andet: et fine-grained token med *Contents: Read-only* på netop det repo, med organisationen som resource owner. Et klassisk token med `repo` giver langt mere end nødvendigt. Kald det `portainer-<app>`, så kilde og token kan findes ud fra hinanden.
- Opret kilden med app-repoets adresse på formen `https://github.com/<org>/<app-repo>`, *GitHub* som provider, dit GitHub-brugernavn og tokenet som adgangskode. Slå polling til på kilden med `5m`; stacken arver det.
- Klikkene står i `PORTAINER.md` i plugin-repoet, med GitHubs tokenformular trin for trin.

Tokenet udløber, og når det gør, stopper polling stille. Stacken kører videre på den version den har, men nye releases udrulles ikke, og Actions er grøn. Sæt en påmindelse i kalenderen når tokenet laves, og noter datoen sammen med registry-tokenets.

### 3. Stacken

**Stacks → Add stack.** Build method er **Repository** — ikke web-editoren og ikke upload.

| Felt | Værdi | Hvorfor |
|---|---|---|
| Name | **Samme navn som den stack der kører i dag**, hvis der er en | Docker præfikser navngivne volumes med stacknavnet. Et nyt navn giver tomme volumes, og databasen ser ud til at være væk |
| Source | Git-kilden fra trin 2 | Polling med `5m` følger med fra kilden. Webhook er ikke en mulighed: GitHub kan ikke nå serveren |
| Repository reference | `refs/heads/main` | Det er `main` deploy-jobbet committer til. Peg aldrig på et tag eller en anden gren |
| Compose path | `deploy/docker-compose.yml` | Samme sti som `compose_path` i kalderen. Afviger den, afviger begge. Standardværdien er en anden |
| Additional paths | tom | Én fil. Lint kender kun den ene |
| Environment variables | Én post pr. `${NØGLE}` i compose-filen | Se nedenfor |
| Select registries | Organisationens GHCR-registry fra trin 1 | Uden det kan imaget ikke pulles, og fejlen ligner et loginproblem |
| Re-pull image | Slået fra, hvis feltet vises | Versionstags flytter sig aldrig, så der er intet at hente igen. Hver release ændrer tagget, og det pulles alligevel |
| Force redeployment | Slået fra, hvis feltet vises | Ellers genstartes containerne hvert interval, også uden ændringer |
| Enable relative path volumes | Slået fra | Reglen `bind-mount` tillader ingen stier på værten |

**Variablerne.** Compose-filen indeholder nøgler, aldrig værdier; værdierne lever kun her. Tilføj hver variabel compose-filen bruger, med samme navn som i `${NØGLE}` og den rigtige værdi. Du kan taste dem én ad gangen eller indlæse en `.env`-fil fra din egen maskine med *Load variables from .env file* — den fil må aldrig ind i repoet. En variabel der mangler, giver ingen fejl ved udrulningen: Docker Compose sætter den til tom og advarer i en log ingen læser, og appen starter med en tom forbindelsesstreng. Tjek listen mod `.env.example`, før du udruller.

Portainer læser variablerne ind i compose-filen ved hver udrulning. Filen i repoet røres ikke, så den forbliver i takt med Git. Der oprettes ingen `stack.env`, og compose-filen må ikke bede om en; se reglen `env-fil`.

Kører den gamle stack endnu: **stop den, før den nye udrulles.** To stacks med samme containere og samme alias på proxyens netværk kører ellers side om side, og proxyen rammer tilfældigt.

Klik **Deploy the stack**. Udrulningen kører i baggrunden; at knappen svarer, betyder at anmodningen er modtaget, ikke at containerne kører.

### 4. Tjek at det virker

1. **Stacken står som kørende**, og hver service har en container i *running*. Står en i *created* eller genstarter den, så se containerens log først og stackens log dernæst.
2. **Containerens log viser `APP_VERSION`** ved opstart, og det er den version compose-filen peger på. Det er hele grunden til forudsætning 3.
3. **Proxyen finder servicen** på aliaset fra compose-filen. Netværket `nginx-proxy-manager_default` er eksternt og skal findes i forvejen; mangler det, siger stackens log det tydeligt.
4. **Polling virker.** Lav en ufarlig ændring i compose-filen på `main` — en kommentar — og vent intervallet ud. Portainer skal vise den nye commit på stacken. Vil du ikke vente, gør **Pull and redeploy** på stacken det samme med det samme; det er også den knap du bruger, når en release skal ud før næste poll.
5. **Første release.** Tag og push en version, følg kørslen i Actions, og vent intervallet ud. Compose-filen på `main` viser den nye version, stacken viser den nye commit, og containerens log viser den nye `APP_VERSION`. Så er stacken i drift fra Git, og web-editoren bruges ikke mere.

### Når noget ikke sker

Portainer melder ikke tilbage til GitHub. Udebliver en udrulning, er det altid stacken man kigger på.

| Symptom | Se efter |
|---|---|
| Compose-filen på `main` er opdateret, stacken ikke — også efter intervallet | Polling slået fra på kilden, *Repository reference* peger ikke på `refs/heads/main`, eller Git-tokenet er udløbet. Stackens log siger det sidste |
| Stacken viser den nye commit, men containeren kører den gamle version | Pull fejlede. Registry-tokenet er udløbet, eller pakken er privat uden at tokenets bruger har adgang — se forudsætning 8. Stackens log viser loginfejlen |
| Appen starter, men fejler på databasen eller en ekstern tjeneste | En variabel mangler på stacken eller er stavet anderledes end i `${NØGLE}`. Sammenlign med `.env.example` |
| Databasen er tom efter skiftet til Git-stack | Stacken fik et nyt navn, og volumes blev oprettet forfra. Stop den, og opret den igen med det gamle navn; de gamle volumes står der stadig |
| Stacken kan ikke starte, og loggen nævner et netværk | `nginx-proxy-manager_default` findes ikke på den vært, eller aliaset mangler. Lint fanger det sidste; det første er værtens opsætning |
| Containeren genstartes hvert femte minut uden ændringer | *Force redeployment* er slået til. Slå det fra |

## Hvem gør hvad

Rollerne læser ikke dette dokument. Det de skal gøre, når til dem som opgaver på `BOARD.md`. Afsnittet her er til dig der skal forstå eller vedligeholde workflowet.

- **`workflow`-skillen** kopierer kalderen til `.github/workflows/`, sætter `service` i deploy-jobbet ud fra `deploy/docker-compose.yml` eller spørger, lægger dette dokument i `docs/workflows/`, nævner valget i `CLAUDE.md` under `## Valgte workflows`, og skriver hver uopfyldt forudsætning på `docs/BOARD.md` under `## Kommende` — typisk en manglende `Dockerfile` eller compose-fil.
- **`architect`** skriver i opgaven: imagenavn, hvilke services der står i `service`, og at tilbagerulning er `git revert` af deploy-commit'en. Uden det ved ingen hvordan man ruller tilbage klokken to om natten.
- **`developer`** skriver `Dockerfile` med `ARG`/`ENV` for `APP_VERSION` og `GIT_SHA`, og logger dem ved opstart. Kører lint lokalt mod compose-filen før en pull request og skriver resultatet i sine noter — en rød release på en regel projektet aldrig har set, er en fejl der kunne være fanget. Må gerne rette kalderens `with`-blokke. Må **ikke** kopiere de genbrugelige workflows ind i projektet.
- **`security`** holder compose-filen op mod reglerne ovenfor før en udrulning — hvert brud uden gyldig undtagelse er et fund — og tjekker at `protect_release_tags` er slået til i build-jobbet, at der ikke er hemmeligheder i build-args, at `secrets: inherit` ikke er sneget ind, og at pakkens synlighed er sat bevidst.
- **`reviewer`** rører ikke workflow-filer.
- **Et menneske** sætter stacken op i Portainer efter afsnittet ovenfor og holder øje med at de to tokens ikke udløber. Det er ikke en opgave til en rolle; det står på `BOARD.md` som en forudsætning, til det er gjort.

## Vedligeholdelse

De genbrugelige workflows bor i `HJK-Automatisering/workflow/.github/workflows/`: `compose-lint.yaml`, `docker-publish.yaml` og `deploy-update.yaml`. Action-versioner er pinnet til commit-SHA — det er det rigtige — og bumpes **kun der**.

Versionering følger action-konventionen:

- Immutable tags pr. ændring: `v1.0.0`, `v1.0.1`, …
- Et flytbart `v1` der peger på nyeste `v1.x.y`. Det er den reference projekterne bruger.
- Brydende ændringer får `v2`, og projekterne flytter når de er klar.

Et projekt kan pinne til `@v1.0.3` hvis det skal stå helt stille. Prisen er at det ikke får rettelser.

**`skabelon-version` i frontmatter er kopiens udgave.** Bumpes den i plugin'et, siger hooken ved sessionsstart at projektets kopi er bagud, og `/agents:update` bringer både kalderen og dette dokument ajour. Rør den ikke i hånden.

## Standalone-fallback

`assets/docker-publish-standalone.yaml` er den gamle selvstændige udgave, der bygger uden at kalde noget. Brug den kun når projektet ikke kan nå `workflow`-repoet — et repo uden for organisationen, eller et hvor Actions-adgang på tværs af repositories er lukket.

Vælger du den, arver projektet vedligeholdelsen af sine egne SHA-pins, og den har hverken lint eller udrulning — compose-filen og Portainer er projektets eget ansvar. Skriv det i projektets dokument, så det ikke bliver en overraskelse.

## Reference: forventet compose-format

Filen nedenfor passerer alle regler. `<app>` er imagenavnet, `<alias>` det navn proxyen finder servicen på.

```yaml
services:
  web:
    # Sættes af deploy-update ved release. Ret ikke i hånden.
    image: ghcr.io/<org>/<app>:1.4.2
    restart: unless-stopped
    # Aldrig værdier her. De sættes som stackens variabler i Portainer og
    # substitueres ind ved udrulning — kun nøgler med ${NØGLE} som værdi.
    environment:
      - DB_SERVER=${DB_SERVER}
      - DB_PASSWORD=${DB_PASSWORD}
    networks:
      default:
      nginx-proxy-manager_default:
        aliases:
          - <alias>
    mem_limit: 512m
    logging:
      options:
        max-size: "10m"
        max-file: "3"

  db:
    image: postgres:16.4
    restart: unless-stopped
    environment:
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    volumes:
      - db-data:/var/lib/postgresql/data
    mem_limit: 1g
    logging:
      options:
        max-size: "10m"
        max-file: "3"

volumes:
  db-data:

networks:
  nginx-proxy-manager_default:
    external: true
```
