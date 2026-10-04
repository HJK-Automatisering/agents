---
nummer: task-0007
titel: Caller-skabelon og compose-regler efter workflow v1.2.0
status: afsluttet
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

Gren `task-0007-workflow-v1-2-0-caller`, ni commits. Holdt op mod *Færdig når*:

- **Kalderen med tre jobs** — `plugins/agents/skills/workflow/assets/docker-publish.yaml`. README-eksemplet fra `origin/main` i workflow-repoet (v1.2.0) linje for linje. `diff` mod README-blokken viser præcis to forskelle: hovedkommentaren om kilden med begge stier, og kommentarlinjen over `service` om `web,worker` (bedt om under *Kalderen*, se *Uklart*). Jobbet hedder `build`.
- **Build nægter at bygge et eksisterende versionstag** — `protect_release_tags: true` står aktivt under `with` i build-jobbet, med README's kommentar. De valgfrie inputs står udkommenteret som før.
- **Deploy kun ved tag og bygget image, én ad gangen, flere services** — `needs: build`, `if: startsWith(github.ref, 'refs/tags/v') && needs.build.outputs.digest != ''`, egen `concurrency` med `deploy-${{ github.repository }}` og `cancel-in-progress: false`, `permissions` `contents: write` og `packages: read`, `with` med `service`, `image`, `digest`, `version` og `compose_path` udkommenteret.
- **Lint ved alle tre udløsere, kun læseadgang, intet `if`** — `lint`-jobbet kalder `compose-lint.yaml@v1` med `contents: read`, uden `if`, med `compose_path` udkommenteret.
- **De seksten regler med samme navne og udfald** — `plugins/agents/skills/workflow/docker-publish.md`, nyt afsnit `## Regler for compose-filen`. Tabellen er kopieret ordret fra README (`diff` identisk), og regelnavnene i samme rækkefølge som `REGLER` i `scripts/compose_lint.py` (efterprøvet med `diff`). Forrangen `hemmelighed` over `env-vaerdi` og `docker-sock` over `bind-mount` står under tabellen. `### Undtagelser` med de fem felter, udfaldene og det generiske eksempel `<andet-system>_default`; en committet `.env`/`stack.env` kan ikke undtages.
- **Hverken `stack.env` eller `env_file` som noget der bruges** — de tre omtaler i dokumentet siger alle at de ikke findes, ikke bruges eller ikke må committes. `.env.example` er nævnt som fint.
- **Lint lokalt før PR, og security mod reglerne** — `### Lokal kørsel` med de tre PowerShell-linjer i én blok, ingen `&&`, scriptet i workflow-repoets eget `.venv`. `## Hvem gør hvad`: `architect` skriver services i `service` og `git revert`-tilbagerulning; `developer` kører lint lokalt før PR og skriver resultatet i noterne; `security` holder compose-filen op mod reglerne og tjekker `protect_release_tags`; `reviewer` rører ikke workflow-filer.
- **Ingen interne navne** — pladsholdere `<org>`, `<app>`, `<alias>`, `<app-repo>`, `<andet-system>_default`. `nginx-proxy-manager_default` står fire gange som den tilladte undtagelse. `hjk-automatisering/mit-image` i kalderen er README's egen linje.
- **Besked ved sessionsstart om en kopi der er bagud** — `skabelon-version: 3` i dokumentet. Hooken kørt mod et testprojekt i skrabemappen med kopien på version 2: beskeden *ET WORKFLOW ER BAGUD* kom med den nye tekst. Med version 3: ingen udskrift. Testprojekterne er fjernet igen.
- **Opdateringskaldet pr. job, uden gæt på `service`, med skabelonens nye linjer** — `plugins/agents/skills/update/SKILL.md`, del 2, trin 4 omskrevet til tre punkter: pr. job bevares projektets aktive `with`-nøgler, skabelonens kommer med, projektets værdi vinder; `service` er projektets, og mangler deploy-jobbet, spørges der med forslag fra `deploy/docker-compose.yml`; jobnavne er skabelonens, `publish` bliver `build` uden stop. `permissions:` erstattes i hvert job.
- **Stop ved jobs skabelonen ikke har** — trin 5 har fået et afsnit: `publish` er ikke et ekstra job, men to deploy-jobs med hver sin `service` på samme image er; vis dem, foreslå én `service`-liste, valget er menneskets. Rapport-afsnittet har fået et afsnit om at sige det nye højt når workflowet gør noget nyt uden at udløses af noget nyt, med `docker-publish` 2→3 som det konkrete tilfælde: commit til `main` ved release, rød release på reglerne, pegning på `## Regler for compose-filen`.
- **Workflow-skillen sætter `service` eller spørger** — `plugins/agents/skills/workflow/SKILL.md`: `description` nævner lint og at versionen skrives ind ved udrulning; trin 3 har fået punkt 2 om at læse `services:` i `deploy/docker-compose.yml`, sætte `service` kommasepareret, spørge hvis det ikke kan afgøres, og lade `web` stå og gøre filen til en forudsætning hvis den mangler.
- **Vejledningen passer** — `GUIDE.md`, `## Workflows`: de tre jobs, reglerne i korte træk, lint lokalt før en pull request, tilbagerulning med `git revert`.
- **Repoets egen kontrol ren** — `node tools/validate.mjs` giver `OK` uden advarsler; `node --check plugins/agents/hooks/detect-project-zero.cjs` er stille.
- **Kun `skabelon-version` ændret** — `git diff main..HEAD` mod begge manifester, `CHANGELOG.md`, begge `AGENTS.md`, standalone-filen, `tools/`, `PLUGIN.md` og `README.md` er tom. Stemplet er 2 → 3.

Desuden i opgavens tabel: `plugins/agents/hooks/detect-project-zero.cjs` — kun teksten i `skabelonBagud`, nu "projektets egne indstillinger under `with` i hvert job". `plugins/agents/agents/security.md` — ét nyt punkt i gennemgangslisten med compose-filen mod reglerne og `protect_release_tags`.

Dokumentet i øvrigt, som beskrevet under *Dokumentet*: `formål` dækker lint, bygning og udrulning; åbningen siger tre jobs og at udrulningen er en commit på `main` som Portainer opdager ved næste poll uden webhook; tag-tabellen står uændret; forudsætninger 10-12 om compose-fil, Git-stack og ubeskyttet `main` med henvisning til README-afsnittet *Hvis `main` beskyttes*; tre input-tabeller; afsnittet om stemplet under *Vedligeholdelse* uændret; referencen nederst med `<app>` og `<alias>`.

### Hvad er ikke lavet, og hvorfor

- **Workflow-skillen og opdateringskaldet er ikke prøvet ved kørsel.** Begge er samtaleskills der kører i menneskets tråd og spørger undervejs; som agent kan jeg ikke køre dem. Teksten er skrevet efter opgaven og læst igennem for modsigelser mod kalderen og dokumentet, men at kaldet faktisk fletter en version 2-kalder rigtigt, er ikke efterprøvet. Det hører til en kørsel i et projekt med den gamle kopi.

### Uklart

1. **Kommentarlinjen om `web,worker` i kalderen.** *Kalderen* beder om den ("kommentaren over den siger at flere services fra samme image skrives `web,worker`"), men *Efterprøvning* siger at eneste tilladte forskel fra README-eksemplet er hovedkommentaren om kilden. De to kan ikke begge holde. Jeg fulgte *Kalderen* og lod linjen stå; vejer *Efterprøvning* tungest, er det én linje at fjerne i `plugins/agents/skills/workflow/assets/docker-publish.yaml`.
2. **To små rettelser i `update/SKILL.md` uden for trin 4, 5 og rapporten.** Trin 2-tabellens celle "kun `with:`-blokken" og punktet "eller dets `with:`-blok" i *Du må ikke* er rettet til flertal pr. job, og *Du må ikke* har fået linjen om aldrig at gætte på `service`. Uden dem modsagde filen sit eget trin 4. Står de for langt fra opgavens tabel, er de lette at tage ud igen.
3. **Én sætning i dokumentets `## Standalone-fallback`.** Standalone-*filen* er urørt som bestemt, men dokumentafsnittet har fået tilføjet at den hverken har lint eller udrulning, så compose-filen og Portainer er projektets eget ansvar. Det står ikke under *Dokumentet*; det fulgte af at dokumentet nu lover tre jobs.

### Fund

1. **README-forlæggets hovedkommentar er upræcis, og kalderen arver den.** Linjen "Skal du afvige fra standarden, så kommentér `with`-blokken ind under build" passer ikke længere: `with:` under build er aktiv på grund af `protect_release_tags`, og det er de valgfrie *linjer* der er kommenteret ud. Ikke rettet, fordi kalderen skal følge README linje for linje. Hører til workflow-repoet.
