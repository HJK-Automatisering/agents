---
nummer: task-0001
titel: Workflow-skabelon: tag-trigger og synkronisering
status: planlagt
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
### Hvad er ikke lavet, og hvorfor
### Uklart
