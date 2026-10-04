---
nummer: task-0007
titel: Caller-skabelon og compose-regler efter workflow v1.2.0
status: planlagt
kilde: interview
oprettet: 2026-10-04
---

# task-0007 — Caller-skabelon og compose-regler efter workflow v1.2.0

## Hvad og hvorfor

Det fælles workflow-repo er udgivet som v1.2.0 med tre nye ting: lint af
compose-filen i pull requests, beskyttelse af versionstags i build-jobbet, og
udrulning af flere services i ét deploy-job. Plugin'ets skabelon kalder stadig
kun build-jobbet, og fire projekter kører på den. Samtidig henviser README og
lint-scriptet til "agenternes deploy-kontrakt" for compose-filer — en tekst
der aldrig har været skrevet i plugin'et. Den skrives nu, med lintens seksten
regelnavne, så en agent og et menneske retter efter den samme liste.

## Færdig når

- [ ] Et projekt der får workflowet lagt ind, får en kalder der svarer til README-eksemplet i workflow-repoet én til én: tre jobs — lint, build og deploy
- [ ] Build-jobbet nægter at bygge et versionstag der allerede findes i registryet
- [ ] Deploy-jobbet kører kun når der er pushet et tag og bygget et image, én udrulning ad gangen pr. repo, og kan opdatere flere services i én kørsel
- [ ] Lint-jobbet kører ved alle tre udløsere, kræver kun læseadgang, og har ingen betingelse
- [ ] Workflow-dokumentet beskriver de seksten regler for compose-filen med samme navne og samme udfald som lint-scriptet, og hvordan en undtagelse skrives
- [ ] Dokumentet omtaler hverken stack.env eller env_file som noget der bruges. Variabler sættes på stacken i Portainer og substitueres ind i compose-filen
- [ ] Dokumentet siger at den der bygger, kører lint lokalt før en pull request, og hvordan — og at sikkerhedsgennemgangen holder compose-filen op mod reglerne før en udrulning
- [ ] Ingen eksempler i dokumentet bruger interne system-, projekt- eller netværksnavne; proxyens netværksnavn er den eneste undtagelse, fordi det allerede står offentligt i workflow-repoet
- [ ] Et projekt med den nuværende kopi får besked ved sessionsstart om at den er bagud
- [ ] Opdateringskaldet kan bringe en kalder fra den nuværende udgave til den nye uden at tabe projektets egne indstillinger i noget job, uden at gætte navnet på servicen, og med skabelonens nye linjer med
- [ ] Opdateringskaldet stopper og viser forskellen, når et projekt har jobs skabelonen ikke har — fx to deploy-jobs med hver sin service
- [ ] Workflow-skillen sætter navnet på servicen i den nye kalder ud fra projektets compose-fil, eller spørger
- [ ] Beskrivelsen af workflowet i vejledningen til mennesker passer til det workflowet gør nu
- [ ] Repoets egen kontrol kører uden advarsler
- [ ] Ingen versionsnumre er ændret ud over `skabelon-version`, som går fra 2 til 3

## Sådan bygger vi det

**Forlægget er README på `main` i `HJK-Automatisering/workflow`.** Repoet er
offentligt. Hent den rå fil fra
`https://raw.githubusercontent.com/HJK-Automatisering/workflow/main/README.md`,
eller læs den i en lokal klon hvis en ligger som søsterrepo (`../workflow`,
efter `git fetch`). De afsnit der gælder: *Caller-eksempel*, *Inputs og
outputs*, *Regler for compose-filen* med *Undtagelser* og *Lokal kørsel*, og
*Reference: forventet compose-format*. Facit for regelnavne og udfald er
`scripts/compose_lint.py` i samme repo — konstanten `REGLER` og
funktionerne `lint_service`, `lint_netvaerk` og `lint_env_filer`.

**Alle stier er fulde. To filer hedder `AGENTS.md`; ingen af dem røres.**

| Fil | Ændring |
|---|---|
| `plugins/agents/skills/workflow/assets/docker-publish.yaml` | Erstattes af README-eksemplet. Se *Kalderen* nedenfor |
| `plugins/agents/skills/workflow/assets/docker-publish-standalone.yaml` | **Urørt.** Den kan ikke kalde noget, og den får hverken lint eller deploy |
| `plugins/agents/skills/workflow/docker-publish.md` | `skabelon-version: 3`. Se *Dokumentet* nedenfor |
| `plugins/agents/skills/workflow/SKILL.md` | `description` nævner lint og udrulning. Trin 3 får et punkt om `service`. Se *Workflow-skillen* |
| `plugins/agents/skills/update/SKILL.md` | Del 2, trin 4 og 5, og rapporten. Se *Opdateringskaldet* |
| `plugins/agents/hooks/detect-project-zero.cjs` | Beskeden om et workflow der er bagud siger "`with`-blok" i ental. Ret til at kaldet bevarer projektets egne indstillinger i hvert jobs `with`. Kun teksten |
| `plugins/agents/agents/security.md` | Gennemgangslisten får ét punkt: findes `docs/workflows/docker-publish.md` i projektet, holdes compose-filen til udrulning op mod dets regler, og hvert brud uden gyldig undtagelse er et fund. Tjek også at build-jobbet har beskyttelsen af versionstags slået til |
| `GUIDE.md` | Afsnittet `## Workflows`, linje 334-336: tre jobs, reglerne for compose-filen, og at der lintes lokalt før en pull request |

### Kalderen

Filen følger README-eksemplet linje for linje, med én tilføjelse: hovedkommentaren
der siger hvor filen kommer fra. **Den skal blive stående og nævne begge stier**
— `plugins/agents/skills/workflow/assets/docker-publish.yaml` og
`docs/workflows/docker-publish.md`. Det er dem hooken kender kopien på, og
`tools/validate.mjs` fejler uden dem. Sætningen om at opdateringskaldet bevarer
`with`-blokken rettes, så den siger at projektets egne indstillinger under
`with` bevares i hvert job, og at `service` er projektets.

De tre jobs:

| Job | `uses` | `permissions` | Andet |
|---|---|---|---|
| `lint` | `compose-lint.yaml@v1` | `contents: read` | Intet `if`. `with` med `compose_path` udkommenteret |
| `build` | `docker-publish.yaml@v1` | `contents: read`, `packages: write`, `id-token: write` | `with:` med `protect_release_tags: true` aktivt, og de valgfrie inputs udkommenteret som i dag |
| `deploy` | `deploy-update.yaml@v1` | `contents: write`, `packages: read` | `needs: build`. `if: startsWith(github.ref, 'refs/tags/v') && needs.build.outputs.digest != ''`. Egen `concurrency` med gruppen `deploy-${{ github.repository }}` og `cancel-in-progress: false`. `with` med `service`, `image`, `digest`, `version`, og `compose_path` udkommenteret |

Jobbet hedder `build`, ikke `publish`. `service: web` står som i README, og
kommentaren over den siger at flere services fra samme image skrives
`web,worker`. Kommentarerne i eksemplet tages med; de forklarer hvorfor.

### Dokumentet

`skabelon-version: 3`. `formål` dækker nu lint, bygning og udrulning. Åbningen
siger at projektet får en kalder med tre jobs, og at udrulningen er en commit
på `main` som Portainer opdager ved næste poll — ingen webhook, ingen
forbindelse til serveren.

- **Tag-tabellen** står som den er; `:main` ved manuel kørsel er efterprøvet
  mod det genbrugelige workflow på v1.2.0 og holder.
- **Forudsætninger**, nye punkter: `deploy/docker-compose.yml` findes og består
  lint; Portainer kører stakken som Git-stack fra `main` med variablerne sat på
  stacken; `main` er ikke beskyttet, ellers afvises deploy-commit'en — henvis
  til README-afsnittet *Hvis `main` beskyttes* i stedet for at gentage det.
- **Inputs i kalderen**: `protect_release_tags` i build-tabellen, og to nye
  små tabeller for deploy-jobbets inputs (`service`, `image`, `digest`,
  `version`, `compose_path`) og lint-jobbets (`compose_path`). Beskrivelserne
  fra README, forkortet.
- **Nyt afsnit `## Regler for compose-filen`.** Det er deploy-kontrakten.
  Indledning: compose-filen på `main` er det Portainer udruller; variabler og
  hemmeligheder sættes på stacken i Portainer og substitueres ind hvor der
  står `${NØGLE}`; der findes ingen stack.env for Git-stacks, og ingen
  `env_file`. Derefter tabellen med de seksten regler **ordret efter README**,
  i samme rækkefølge og med samme navne: `build`, `latest`, `privileged`,
  `docker-sock`, `bind-mount`, `host-adgang`, `hemmelighed`, `env-vaerdi`,
  `env-fil`, `restart`, `mem-limit`, `logging`, `ports`, `container-name`,
  `eksternt-netvaerk`, `alias`. Forrangen med: én nøgle giver én fejl, og
  `hemmelighed` vinder over `env-vaerdi`; ét volume giver én fejl, og
  `docker-sock` vinder over `bind-mount`. Nævn at `.env.example` er fint —
  det er `.env` og `stack.env` der ikke må committes.
- **Undtagelser**: topfeltet `x-undtagelser` med `service`, `regel`,
  `begrundelse`, `godkendt-af` og `dato`; en gyldig undtagelse giver en
  advarsel i stedet for en fejl; mangler et felt eller er regelnavnet ukendt,
  er undtagelsen selv en fejl; ældre end et år giver en advarsel; en
  undtagelse der ikke rammer noget, giver en advarsel. For `eksternt-netvaerk`
  er `service` netværkets navn. **Eksemplet er generisk:**
  `<andet-system>_default`, med en sætning om at det typisk er en anden stacks
  netværk som en service skal nå. En committet `.env` eller `stack.env` kan
  ikke undtages.
- **Lokal kørsel**: scriptet `scripts/compose_lint.py` i workflow-repoet,
  med compose-filen som eneste argument, i det repos eget `.venv` med
  `ruamel.yaml` fra dets `requirements.txt`. Kommandoerne som i README,
  i PowerShell-form, én pr. linje i én blok, ingen `&&`. Mangler `docker`
  lokalt, springes compose-tjekket over med en advarsel; den fulde kontrol
  sker i Actions.
- **Hvem gør hvad**: `architect` skriver i opgaven hvilke services der står i
  `service`, og at tilbagerulning er `git revert` af deploy-commit'en.
  `developer` kører lint lokalt før en pull request og skriver resultatet i
  sine noter — en rød release på en regel projektet aldrig har set, er en
  fejl der kunne være fanget. `security` holder compose-filen op mod reglerne
  og tjekker at beskyttelsen af versionstags er slået til. `reviewer` rører
  stadig ikke workflow-filer.
- **Reference** nederst: compose-formatet fra README med pladsholderne
  `<app>` og `<alias>`.
- Afsnittet om stemplet under *Vedligeholdelse* står uændret.

### Workflow-skillen

`description` nævner at workflowet også linter compose-filen og skriver
versionen ind i den ved udrulning. I trin 3 tilføjes efter kopieringen: findes
`deploy/docker-compose.yml`, læses servicenavnene under `services:`, og
`service` i deploy-jobbet sættes til dem der skal have det byggede image,
adskilt af komma — spørg hvis det ikke kan afgøres. Findes filen ikke, bliver
den en forudsætning på BOARD, og `service` står på skabelonens `web`.

### Opdateringskaldet

Del 2, trin 4, omskrives til flere jobs med `with`:

- **Pr. job bevares projektets egne nøgler** — dem der står aktive under
  `with` i projektets kalder. Skabelonens nøgler kommer med. Står en nøgle
  begge steder, vinder projektets værdi.
- **`service` i deploy-jobbet er projektets.** Har projektet et deploy-job,
  bevares dets `service`. Har det intet deploy-job, spørges der om navnet;
  foreslå det ud fra `deploy/docker-compose.yml` hvis filen findes. **Gæt
  aldrig.** Kaldet kører i menneskets tråd og må spørge.
- **Jobnavne er skabelonens.** `publish` bliver til `build`; det er ikke en
  rettelse der stopper noget.

Trin 5 står, med én tilføjelse: har projektet jobs skabelonen ikke har — fx
to deploy-jobs med hver sin `service` på samme image — stopper kaldet og
viser dem, med forslaget om at slå dem sammen til én `service`-liste. Valget
er menneskets.

Rapporten: udløsningsvilkåret er uændret, så opregningen af gamle
beskrivelser udløses ikke. Men sig det nye højt: kalderen committer nu til
`main` ved en release, og en compose-fil der bryder reglerne, giver en rød
release. Peg på reglerne i det opdaterede dokument.

### Efterprøvning

- `node tools/validate.mjs` uden advarsler. Stemplet er bumpet, så advarslen
  om en skabelon ændret uden bump må ikke komme.
- `node --check plugins/agents/hooks/detect-project-zero.cjs`.
- Hooken mod et testprojekt i skrabemappen med `docs/workflows/docker-publish.md`
  på `skabelon-version: 2`: beskeden om at et workflow er bagud skal komme,
  og med 3 skal den tie.
- Kalderen sammenlignes med README-eksemplet linje for linje; eneste tilladte
  forskel er hovedkommentaren om kilden.

## Hvad vi ikke rører

- `plugins/agents/skills/workflow/assets/docker-publish-standalone.yaml`.
- `plugins/agents/skills/kickoff/AGENTS.md` og `AGENTS.md` i roden.
  `kontrakt-version` står på 20.
- `.claude-plugin/marketplace.json`, `plugins/agents/.claude-plugin/plugin.json`,
  `CHANGELOG.md`. Udgivelsen er menneskets skridt.
- `.github/workflows/validate.yaml` og `tools/validate.mjs`.
- `PLUGIN.md`, `README.md` og de øvrige roller end `security`.

## Afhænger af

intet

## Beslutninger

- BESLUTTET: deploy-kontrakten bor i workflow-dokumentet, ikke i kontrakten —
  reglerne gælder kun projekter der udrulles via Portainer, dokumentet kopieres
  og synkroniseres allerede med stemplet, og `kontrakt-version` røres ikke.
  Afvist: skabelonkontrakten, som ville give alle projekter seksten regler og
  kræve et bump.
- BESLUTTET: opdateringskaldet rettes i samme opgave — stemplet udløser kaldet
  i fire repoer samme dag udgivelsen rammer, og en regel der først kommer i
  næste udgivelse, kommer for sent. Afvist: eget nummer.
- BESLUTTET: eksemplet for `eksternt-netvaerk` er generisk — repoet er
  offentligt, og `CLAUDE.md` forbyder systemnavne i eksempler. Afvist: det
  rigtige netværksnavn fra det første projekt der består lint.
- BESLUTTET: `skabelon-version` går til 3 — bedt om af mennesket, og det er
  det eneste et projekt kan se ændringen på.
- BESLUTTET: standalone-udgaven står urørt — den kan ikke kalde genbrugelige
  workflows, og lint og deploy findes kun som sådanne.
- BESLUTTET: `service: web` som pladsholder i skabelonen, som i README —
  workflow-skillen og opdateringskaldet sætter det rigtige navn, og ingen af
  dem gætter.
- BESLUTTET: lint-jobbet har intet `if` og intet stifilter — et filter pr. job
  kræver en tredjeparts-action, og kørslen tager sekunder.

## Åbne punkter

## Indvendinger

---

## Developers noter

<Alt over denne overskrift ejes af architect. Alt herunder skrives kun af
developer, som aldrig retter i definitionen ovenfor.>

### Hvad er lavet
### Hvad er ikke lavet, og hvorfor
### Uklart
