---
nummer: task-0001
titel: Workflow-skabelon: tag-trigger og synkronisering
status: afsluttet
kilde: interview
oprettet: 2026-09-22
---

# task-0001 — Workflow-skabelon: tag-trigger og synkronisering

## Hvad og hvorfor

`docker-publish` bygger og signerer et image ved hvert push til `main`. Et
commit i en markdown-fil koster derfor en ny digest i GHCR, en post i den
offentlige Rekor-log og et `:main`-tag der flytter sig uden at noget er
ændret. Samtidig kan en skabelon der er lagt ind i et projekt aldrig bringes
ajour — skillen kopierer, og der findes ingen vej tilbage.

## Færdig når

- [ ] Et projekt der får workflowet lagt ind, bygger kun når der udgives med et versionstag — ikke ved almindelige commits
- [ ] Et forslag til ændring bygges stadig, uden at der udgives noget image
- [ ] Beskrivelsen der følger med workflowet, passer til det workflowet gør. Ingen linje lover en bygning ved hvert commit
- [ ] Beskrivelsen siger at der skal tagges, ellers bygges der aldrig
- [ ] Et projekt med en ældre kopi får besked ved sessionsstart om at den er bagud
- [ ] Opdateringskaldet kan bringe en ældre kopi ajour uden at kaste projektets egne indstillinger væk, og stopper hvis der er rettet andre steder i filen
- [ ] Opdateringskaldet kan se forskel på de to udgaver af workflowet og forveksler dem ikke
- [ ] Rollen der forbereder en udgivelse, siger fra hvis projektet bygger på tags men aldrig tagger
- [ ] Sikkerhedsrollen siger fra når kopien er bagud, skarpest i den udgave hvor projektet selv ejer sine versioner
- [ ] Repoets egen kontrol kører, og advarer hvis skabelonen ændres uden at nummeret følger med
- [ ] Ingen versionsnumre er ændret

## Sådan bygger vi det

**Alle stier er fulde. Der findes to filer der hedder `AGENTS.md` — se
advarslen nederst i dette afsnit.**

| Fil | Ændring |
|---|---|
| `plugins/agents/skills/workflow/assets/docker-publish.yaml` | `on.push` mister `branches`, beholder `tags: [ 'v*.*.*' ]`. `pull_request` og `workflow_dispatch` står urørt. Kommentar i toppen der siger hvor filen kommer fra, og hvor versionen står |
| `plugins/agents/skills/workflow/assets/docker-publish-standalone.yaml` | Samme to ændringer, ordret. De to filer må ikke drive fra hinanden |
| `plugins/agents/skills/workflow/docker-publish.md` | `skabelon-version: 2` i frontmatter. Retter linje 3, 12, 32-33 og 52. Ny forudsætning: uden tags bygges der aldrig |
| `plugins/agents/skills/workflow/SKILL.md` | Linje 2 og 60 |
| `plugins/agents/skills/update/SKILL.md` | Nyt omfang. Linje 10 og 71 skal væk |
| `plugins/agents/hooks/detect-project-zero.cjs` | Tredje kontrol og tredje besked |
| `plugins/agents/skills/architect/SKILL.md` | Trin 8 |
| `plugins/agents/agents/security.md` | Stempel-kontrol |
| `plugins/agents/skills/kickoff/AGENTS.md` | Linje 35 og 157. **Ikke** `kontrakt-version` |
| `tools/validate.mjs` | Kræv `skabelon-version`. Advar når en asset er ændret uden bump |
| `GUIDE.md` | Linje 334 |
| `CLAUDE.md` | Skarpere linje om de to `AGENTS.md`-filer |

**`update` skal gøre, i denne rækkefølge:**

1. Finde installerede workflows via `filer:`-feltet i plugin'ets
   workflow-dokumenter — ikke ved at gætte stier.
2. Afgøre hvilken udgave projektet har, på `uses:`-linjen. Findes den, er det
   den genbrugelige; findes den ikke, er det standalone. Et projekt må aldrig
   flyttes fra den ene til den anden.
3. Sammenligne `skabelon-version` i projektets `docs/workflows/<navn>.md` med
   plugin'ets. Mangler stemplet, regnes kopien som version 1. Er de ens, sker
   der ingenting.
4. Bevare `with:`-blokken i projektets kalder ordret. Alt andet erstattes,
   også `permissions:`.
5. Stoppe og vise det, hvis der er rettet uden for `with:`.
6. Skrive begge filer: kalderen og dokumentet.

**Hooken** læser projektets `docs/workflows/*.md`, sammenligner hver
`skabelon-version` med plugin'ets, og foreslår `/agents:update` — samme form
som beskeden om kontrakten. Mangler mappen, er der intet at sige.

**`architect` trin 8:** før et udgivelsesnummer tilbydes, tjekkes om projektet
har et tag-afhængigt workflow. Har det det, og findes der ingen tags i repoet,
siges det først — ellers bygges der aldrig et image.

**`security`:** en kopi der er bagud, er et fund. Skarpest i standalone, hvor
projektet selv ejer sine fastlåste action-versioner.

### Advarsel: to filer hedder `AGENTS.md`

- `plugins/agents/skills/kickoff/AGENTS.md` er **skabelonen**, og den er den
  du skal rette.
- `AGENTS.md` i repoets rod er **dette projekts egen kontrakt**, som du selv
  arbejder under. Rør den ikke.

Retter du den forkerte, ændrer du reglerne for det arbejde du er midt i.

## Hvad vi ikke rører

- `.github/workflows/validate.yaml` — dette repos egen CI. Den har intet med
  `docker-publish` at gøre.
- `AGENTS.md` i repoets rod.
- `CHANGELOG.md` og de to manifester.
- `kontrakt-version` og alle andre versionsnumre. Se nedenfor.
- De øvrige ni roller.

## Afhænger af

intet

## Beslutninger

- BESLUTTET: stemplet indføres direkte som `skabelon-version: 2` — 1 er
  reserveret til kopier fra før stemplet fandtes. Indførtes det som 1, ville
  eksisterende kopier tælle som ajour, og trigger-ændringen ville aldrig nå ud.
- BESLUTTET: `kontrakt-version` bumpes **ikke** af denne opgave, selv om linje
  35 og 157 ændres — versionsnumre er menneskets beslutning. `validate.mjs`
  vil advare om at kontrakten er ændret uden bump. Det er den rigtige opførsel,
  ikke en fejl at rette.
- BESLUTTET: `pull_request` bevares — uden branch-push er det den eneste
  kontrol af at imaget overhovedet bygger, før nogen tagger.
- BESLUTTET: `permissions:` erstattes hårdt — den er en forudsætning for at
  push til registryet virker. Er den ændret, er den forkert, og en bevaret fejl
  viser sig som et loginproblem.
- BESLUTTET: `paths-ignore` bruges ikke — filteret ville også ramme
  tag-pushet, og et tag der peger på et allerede pushet commit har ingen
  ændringsmængde. Udgivelsesbygningen ville udeblive uden en fejl.

## Åbne punkter

## Indvendinger

---

## Developers noter

### Hvad er lavet

- `plugins/agents/skills/workflow/assets/docker-publish.yaml`: `on.push` har mistet
  `branches` og udløses nu kun af `tags: [ 'v*.*.*' ]`. `pull_request` og
  `workflow_dispatch` står urørt. Ny kommentar i toppen siger hvor filen kommer fra,
  og at udgaven står som `skabelon-version` i `docs/workflows/docker-publish.md`.
- `plugins/agents/skills/workflow/assets/docker-publish-standalone.yaml`: samme to
  ændringer, ordret. Kommentaren i toppen siger derudover at `update` stopper og
  viser det, hvis der er rettet i filen — der ejer projektet selv sine pins.
- **Tre kommentarer inde i de to asset-filer er rettet ud over selve triggeren**,
  fordi de ellers ville lyve: `concurrency`-kommentaren forklarede kapløb mellem
  pushes til main, `workflow_dispatch`-kommentaren sagde at tag-reglerne kun kunne
  afprøves ved at pushe til main, og kommentaren over `tags:`-blokken i standalone
  sagde at et push til main kun giver `:main`. Ingen adfærd er ændret af det.
- `plugins/agents/skills/workflow/docker-publish.md`: `skabelon-version: 2` i
  frontmatter. `formål` og åbningslinjen siger nu versionstag i stedet for push til
  main. I tag-tabellen er `:main` flyttet ned og beskrevet som noget der kun kommer
  ved manuel kørsel, og `:sha-` siger "hver bygning". Ny første forudsætning: der
  skal tagges, ellers bygges der aldrig, og der kommer ingen fejl der siger det.
  De øvrige forudsætninger er renummereret 2-9, og punktet om at pakken oprettes ved
  første push til main siger nu ved første versionstag. Et afsnit under
  `## Vedligeholdelse` forklarer hvad stemplet er.
- `plugins/agents/skills/workflow/SKILL.md`: `description` siger versionstag i stedet
  for push til main. Lukningsafsnittet lover ikke længere en bygning ved næste push
  til `main`, men siger at der skal tagges.
- `plugins/agents/skills/update/SKILL.md`: nyt omfang. Skillen dækker nu to slags
  kopier — kontrakten og de installerede workflows — i en `Del 1` og en `Del 2`.
  Del 2 følger de seks trin fra opgaven: find via `filer:`-feltet, afgør udgaven på
  `uses:`-linjen og flyt aldrig et projekt mellem udgaverne, sammenlign
  `skabelon-version` med manglende stempel som version 1, bevar `with:`-blokken
  ordret mens alt andet inklusive `permissions:` erstattes, stop og vis hvis der er
  rettet uden for `with:`, og skriv både kalderen og dokumentet. Linje 10 og linje 71
  er væk; forbuddet mod `BOARD.md`, beslutningsloggen, `CLAUDE.md` og kode står
  stadig, nu med det nye omfang.
- `plugins/agents/hooks/detect-project-zero.cjs`: ny kontrol der læser projektets
  `docs/workflows/*.md`, slår hver fil op på samme navn i plugin'ets
  `skills/workflow/`, og sammenligner `skabelon-version`. Manglende stempel regnes
  som version 1; et dokument plugin'et ikke kender, springes over; mangler mappen,
  siges der intet. Beskeden har samme form som den om kontrakten og peger på
  `/agents:update`. `getKontraktVersion` er blevet til `getVersion(sti, noegle)`, så
  de to stempler læses af samme funktion. Afprøvet i hånden mod et testprojekt i fem
  tilfælde: bagud, uden stempel, ajour, ukendt dokument, ingen mappe.
  **Det blev hookens fjerde kontrol, ikke tredje** — den havde tre i forvejen.
  Hovedkommentaren er rettet til.
- `plugins/agents/skills/architect/SKILL.md`, trin 8: før et udgivelsesnummer
  tilbydes, kigges der efter et workflow der kun udløses af `push:` med `tags:`.
  Findes der et, og har repoet ingen tags, siges det først — og de to linjer der
  sætter og pusher tagget hører med i blokken.
- `plugins/agents/agents/security.md`: `skabelon-version` er tilføjet
  gennemgangslisten, med et afsnit der siger hvordan de to udgaver kendes fra
  hinanden på `uses:`-linjen. Standalone vejer tungest, fordi projektet selv ejer
  sine fastlåste action-versioner.
- `plugins/agents/skills/kickoff/AGENTS.md`: linje 35 siger at `update` afleverer
  opdateret kontrakt **og** opdaterede workflow-kopier. Linje 157 siger at
  `docs/workflows/<navn>.md` skrives af `workflow` (+ `update`) og bærer
  `skabelon-version`. `kontrakt-version` står urørt på 18.
- `tools/validate.mjs`: `skabelon-version` er nu et krævet felt i workflow-dokumenter
  og skal være et heltal. Ny advarsel: er dokumentet eller en af dets assets ændret
  siden `BASE_REF`, mens stemplet står stille, siges det. Opslaget mod base-grenen er
  trukket ud i `fraBase()`, som kontrakt-tjekket også bruger. Assets findes både via
  `filer:` og via navnepræfikset, så standalone-filen tæller med selv om den ikke
  kopieres automatisk — ellers kunne de to filer drive fra hinanden ubemærket.
  Afprøvet ved midlertidigt at sætte stemplet tilbage til 1: advarslen kom og nævnte
  begge assets.
- `GUIDE.md` linje 334: `docker-publish` beskrives som noget der bygger ved et
  versionstag, og der står eksplicit at der aldrig sker noget hvis man ikke tagger.
- `CLAUDE.md`: reglen om de to `AGENTS.md`-filer er skrevet om, så den siger hvilken
  en opgave altid mener, og hvad der sker hvis den forkerte rettes. Et nyt punkt
  beskriver `skabelon-version` som workflow-skabelonernes eget stempel, med samme
  forbehold om at bumpet er menneskets.
- **Ingen versionsnumre er ændret.** Hverken `kontrakt-version`, de to manifester
  eller `CHANGELOG.md` er rørt; `git diff origin/main` på dem er tom.
- Begge kontroller kørt til sidst. `node tools/validate.mjs` går igennem med én
  advarsel — den om at kontrakten er ændret uden bump, som er den forventede ifølge
  beslutningen ovenfor. `node --check plugins/agents/hooks/detect-project-zero.cjs`
  er ren.
- Ti commits på grenen `task-0001-workflow-template-tag-trigger`, én pr. afsluttet
  enhed. Intet er pushet.

### Hvad er ikke lavet, og hvorfor

- `PLUGIN.md` er ikke rørt — den står ikke i tabellen. To steder i den er nu
  ufuldstændige: linje 21 beskriver `update` som "opdaterer projektets kontrakt", og
  afsnittet om `kontrakt-version` omkring linje 182-186 nævner kun kontraktens
  stempel, ikke workflow-skabelonernes.
- Standalone-filen står stadig ikke i `filer:`-feltet, så hverken `workflow` eller
  `update` lægger den ind automatisk. Det er urørt med vilje: feltet driver
  kopieringen, og standalone vælges i hånden. `validate.mjs` finder den på navnet i
  stedet.
- `type=ref,event=branch` er ikke fjernet fra standalone-filens tag-regler. Den giver
  stadig `:main` ved manuel kørsel, og det er beskrevet sådan i dokumentet. At fjerne
  den ville være en ændring ud over tabellen.

### Uklart

- **Hvad skal bevares i standalone-udgaven når `update` kører?** Trin 4 siger "bevar
  `with:`-blokken i projektets kalder", men standalone har ingen kalder og dermed
  ingen `with:`-blok på jobniveau — kun `with:` inde i de enkelte trin. Jeg har
  skrevet det som at der intet er at bevare i standalone, og at trin 5 derfor gælder
  hele filen: enhver lokal ændring stopper opdateringen og vises. Det er den sikre
  læsning, fordi projektet selv ejer sine pins, men den betyder også at en
  standalone-kopi med én lokal tilpasning aldrig kan opdateres uden at nogen svarer
  på et spørgsmål.
- **Om `:main` stadig opstår ved manuel kørsel i den kaldende udgave.** Tag-reglerne
  for den bor i det genbrugelige workflow i et andet repo, som jeg ikke kan læse
  herfra. Jeg har beskrevet tabellen i dokumentet ud fra standalone-filens regler,
  hvor `type=ref,event=branch` stadig står. Er reglerne anderledes i det genbrugelige
  workflow, er den ene række i tabellen forkert.
