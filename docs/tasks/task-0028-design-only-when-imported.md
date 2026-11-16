---
nummer: task-0028
titel: Rollerne kræver design og bundlinje i projekter der ikke har valgt standarden
status: afsluttet
kilde: interview
oprettet: 2026-11-16
---

# task-0028 — Rollerne kræver design og bundlinje i projekter der ikke har valgt standarden

## Hvad og hvorfor

Kontrakten siger i dag at et nyt projekt med en webflade skal bruge designstandarden, og at
bundlinjen gælder hver webløsning, også uden standarden. Derfor laver `architect` emner om standard
og bundlinje, mens folk bygger deres app, og `reviewer` melder fund. Det vil mennesket ikke have.
Alt om design gælder kun, når projektet har lagt standarden ind med `/agents:design`. Før det må
`architect` kun nævne standarden som en mulighed. Til gengæld skal `architect` aktivt foreslå
`/agents:workflow`, når et projekt skal udrulles via Portainer.

## Færdig når

- [ ] Kontrakten siger at designstandarden er et tilbud. Den gælder kun projekter der har `docs/design/`, og ingen rolle kræver den ellers
- [ ] Bundlinjen og alt andet om design gælder kun projekter der har `docs/design/`. Ingen tekst i plugin'et siger at bundlinjen gælder en webløsning uden standarden
- [ ] Reglen om en ny udgave uden Ctrl+F5 gælder stadig hver webløsning, og den står i et afsnit for sig, uden for afsnittet om designstandarden
- [ ] `architect` laver ingen emner om standard eller bundlinje i et projekt uden `docs/design/`. Den nævner standarden én gang i chatten som en mulighed, når et projekt har en webflade, og nævner den ikke igen efter et nej
- [ ] Har projektet `docs/design/`, holder `architect` det op mod standarden og bundlinjen som i dag
- [ ] `architect` foreslår `/agents:workflow` i chatten, med sin anbefaling, når den finder ud af at projektet skal udrulles via Portainer, og projektet ikke allerede har workflowet. Efter et nej nævner den det ikke igen
- [ ] `reviewer` melder kun fund om standarden og bundlinjen i projekter med `docs/design/`. Reglen om Ctrl+F5 holder den stadig op mod hvert projekt med en webflade
- [ ] `GUIDE.md` siger det samme: standarden er et tilbud, bundlinjen følger med standarden, og `architect` foreslår workflowet ved udrulning via Portainer
- [ ] Alle henvisninger til et afsnit der har fået nyt navn eller er flyttet, peger det rigtige sted hen
- [ ] Repoets kontrol er grøn, bortset fra de ventede advarsler om stemplerne

## Sådan bygger vi det

**1. Kontraktskabelonen**, `plugins/agents/skills/kickoff/AGENTS.md`, `## Webflader og
designstandarden` omkring linje 372.

- Afsnittet gælder nu kun projekter med `docs/design/`. Skriv det i første linje, i stedet for
  *"Gælder hvert projekt med en webflade."* Behold overskriften, så henvisningerne holder.
- *"Et nyt projekt med en webflade bruger den fælles designstandard fra start"* og stykket om at et
  projekt er nyt indtil sin første udgivelse: erstat med at standarden er et tilbud, som lægges ind
  med `/agents:design`, når mennesket vælger det. Rollerne kræver den ikke.
- Linjen om at *bundlinjen gælder hver webløsning, med eller uden standarden*: bundlinjen følger
  standarden. `### Bundlinjen er fast` bliver stående med sin overskrift, men gælder kun projekter
  med standarden. Første fede sætning skal sige det i stedet for *"Hver webløsning"*.
- *Hvem gør hvad*: tilpas punkterne til at alt gælder projekter med `docs/design/`. `architect`
  laver ingen emner om standard eller bundlinje uden den. `mockup`-punktet bliver stående.
- **Flyt `### En ny udgave uden Ctrl+F5`** ud i sit eget afsnit på niveau `##` lige efter, fx
  `## En webflades filer`. Behold underafsnittets indhold uændret. Den fede linje om reglen øverst i
  designafsnittet og pligterne om reglen i designafsnittets *Hvem gør hvad* flyttes med, og står i
  det nye afsnits egen *Hvem gør hvad*. Reglen gælder hver webløsning, som i dag.

**2. `plugins/agents/skills/architect/SKILL.md`**, omkring linje 95–104.

- Skriv stykket om webflader om. Har projektet `docs/design/`, holder `architect` det op mod
  standarden og bundlinjen som i dag. Har det ikke, laver den ingen emner om standard eller
  bundlinje, men nævner én gang i chatten, at `/agents:design` findes, som en mulighed.
- Punktet om reglen om Ctrl+F5 og stykket om `Færdig når` for en opgave der sætter en webflade op,
  bliver stående. Ret henvisningen til det nye afsnit.
- **Nyt stykke om workflows:** finder `architect` ud af at projektet skal udrulles via Portainer —
  fra `docs/projekt.md`, `CLAUDE.md` eller interviewet — og findes `docs/workflows/docker-publish.md`
  ikke, foreslår den `/agents:workflow` i chatten med sin anbefaling. Det skal give mening:
  projektet har eller skal have en container. Efter et nej nævner den det ikke igen i projektet, og
  svaret står i beslutningsloggen. `architect` kører ikke kaldet selv.

**3. `plugins/agents/agents/reviewer.md`**, omkring linje 33–41. Stykket om **Bundlinjen** gælder
kun projekter med `docs/design/`. Fjern *"også uden `docs/design/`"* der. Stykket om **En ny udgave
uden Ctrl+F5** gælder stadig hvert projekt med en webflade. Ret dets henvisning til det nye afsnit.

**4. `plugins/agents/skills/design/design.md`**, `## Sådan kobles den på`: sætningen henviser til
`### En ny udgave uden Ctrl+F5` *i `## Webflader og designstandarden`*. Ret den til det nye afsnit.
Under `### Bundlinje` henvises til `### Bundlinjen er fast` i samme afsnit; den henvisning holder.

**5. `GUIDE.md`**:

- `## Workflows`, linje 342: *"Ingen roller nævner workflows af sig selv."* Ret: `architect`
  foreslår `docker-publish`, når projektet skal udrulles via Portainer. Ellers kalder du det selv.
- `## Designstandard`: standarden er et tilbud, ikke et krav for nye projekter, og `architect` nævner
  den som en mulighed. Bundlinjen følger standarden og gælder ikke løsninger uden den. Stykket om
  Ctrl+F5 bliver stående og gælder hver webløsning.

**6. Søg** i `plugins/agents/` og i rodens dokumenter, undtagen `CHANGELOG.md`, `README.md` og
`docs/`, efter andre steder der siger at standarden eller bundlinjen kræves uden `docs/design/`, eller
at ingen rolle foreslår workflows. Ret dem efter samme princip, og skriv i dine noter hvad du fandt.
`skills/workflow/SKILL.md` siger at *kaldet selv* ikke foreslår af sig selv; det er rigtigt og skal
blive.

Kør `node tools/validate.mjs`. Advarslerne om `kontrakt-version` og `design-version` er ventede.
**Bump ingen af dem.**

## Hvad vi ikke rører

- Indholdet af `### Bundlinjen er fast` og `### En ny udgave uden Ctrl+F5`, ud over den første fede
  sætning i bundlinjens og flytningen af Ctrl+F5
- `mockup`, `design/SKILL.md`, `design.css` og `eksempel.html`
- `skills/workflow/` og opdateringskaldet
- `AGENTS.md` i roden, `CHANGELOG.md` og `README.md`, som architect retter
- `kontrakt-version`, `design-version`, `skabelon-version` og versionsnumrene i manifesterne
- `docs/BOARD.md` og beslutningsloggen

## Afhænger af

intet

## Beslutninger

- BESLUTTET: alt om design gælder kun projekter med `docs/design/`. Mennesket valgte. Det vender
  beslutningen fra 2026-11-12 om at standarden er et krav for nye webløsninger, og at bundlinjen er
  et krav for alle
- BESLUTTET: bundlinjen følger standarden. Mennesket: *"bundlinjen hører designet til"*. Reglen
  bliver i kontrakten under sin overskrift, men gælder kun med standarden. Afvist: at flytte den
  tilbage til standardens dokument. Det ville koste flere henvisninger og et bump af `design-version`
  uden at ændre noget for brugeren
- BESLUTTET: reglen om Ctrl+F5 gælder stadig hver webløsning og flyttes ud af designafsnittet. Den
  handler om at levere filer, ikke om udseende. Mennesket sagde ja til architects anbefaling
- BESLUTTET: `architect` nævner standarden én gang i chatten som en mulighed, når et projekt har en
  webflade uden `docs/design/`. Det bliver ikke et emne på BOARD
- BESLUTTET: `architect` foreslår `/agents:workflow` aktivt, når projektet skal udrulles via
  Portainer og ikke har workflowet. Mennesket bad om det. Én gang, med anbefaling, og svaret står i
  loggen
- BESLUTTET: `mockup` ændres ikke. Skitsen bruger standardens udseende, og bundlinjen følger med
  designet. En skitse stiller ingen krav til appen
- BESLUTTET: stemplerne bumpes ikke af developer. De tilbydes ved lukningen

## Åbne punkter

## Indvendinger

---

## Developers noter

<Alt over denne overskrift ejes af architect. Alt herunder skrives kun af
developer, som aldrig retter i definitionen ovenfor.>

### Hvad er lavet

Gren `task-0028-design-only-when-imported`, fire commits (7de0c22, 0f30c9f, 4abb95d, 178a493).

- **Kontrakten siger at standarden er et tilbud, og gælder kun med `docs/design/`** —
  `plugins/agents/skills/kickoff/AGENTS.md`, `## Webflader og designstandarden`. Første linje er nu
  *"Gælder kun projekter der har `docs/design/`."* Overskriften står uændret. *"Et nyt projekt … fra
  start"* og stykket om hvornår et projekt er nyt er erstattet af *"Designstandarden er et tilbud, ikke
  et krav"*: den lægges ind med `/agents:design` når mennesket vælger den, og ingen rolle kræver den.
  Stykket om at en løsning i drift kun får standarden efter et ja, står stadig.
- **Bundlinjen følger standarden** — samme fil. Linjen *"Bundlinjen gælder hver webløsning, med eller
  uden standarden"* er nu *"Bundlinjen følger standarden … gælder kun projekter med `docs/design/`"*.
  `### Bundlinjen er fast` har beholdt sin overskrift. Første fede sætning er nu *"Hver webløsning med
  standarden viser bundlinjen …"*. Resten af underafsnittet er uændret.
- **Designafsnittets *Hvem gør hvad*** — samme fil. `architect` holder kun et projekt med
  `docs/design/` op mod afsnittet. Emner kommer når webfladen ikke bruger standarden, eller når
  bundlinjen mangler. Uden `docs/design/` laver den ingen emner, men nævner én gang i chatten at
  standarden findes, og ikke igen efter et nej. `developer`- og `reviewer`-punkterne gælder projekter med
  `docs/design/`, og pligterne om Ctrl+F5 er flyttet ud. `mockup`-punktet er uændret.
- **Ctrl+F5 har sit eget afsnit** — samme fil. Det nye afsnit `## En webflades filer` står lige efter
  designafsnittet og før `## Stak og biblioteker`. Det har en første linje (*"Gælder hvert projekt med
  en webflade, med eller uden designstandarden"*), den fede linje om reglen, flyttet fra
  designafsnittet, og sin egen *Hvem gør hvad* med pligterne om reglen for `architect`, `developer` og
  `reviewer`. `### En ny udgave uden Ctrl+F5` ligger under det, med uændret indhold.
- **`architect`** — `plugins/agents/skills/architect/SKILL.md`, trin 1. Stykket om webflader er skrevet
  om. Med `docs/design/` gives emner som i dag: webfladen bruger ikke standarden (i drift: intet bygges
  om uden et ja), og manglende bundlinje. Uden `docs/design/` kommer ingen emner, men `/agents:design`
  nævnes én gang som en mulighed. Et nej skrives i loggen og nævnes ikke igen. Punktet om Ctrl+F5 og
  stykket om `Færdig når` for en webflade står der stadig og henviser til `## En webflades filer`.
  Nyt stykke om workflows: skal projektet udrulles via Portainer (ses i `docs/projekt.md`, `CLAUDE.md`
  eller interviewet, i trin 1 eller senere), har det en container eller skal have en, og findes
  `docs/workflows/docker-publish.md` ikke, så foreslår `architect` `/agents:workflow` i chatten med sin
  anbefaling. Den kører ikke kaldet selv, svaret skrives i loggen, og efter et nej nævner den det ikke
  igen.
- **`reviewer`** — `plugins/agents/agents/reviewer.md`. Bundlinjen holdes op mod reglen i projekter med
  `docs/design/`, og *"også uden `docs/design/`"* er fjernet. En linje siger at hverken standarden
  eller bundlinjen er et fund uden `docs/design/`. Ctrl+F5 er nu sit eget punkt i listen, ikke under
  *Designstandarden*. Det gælder stadig hvert projekt med en webflade og henviser til
  `## En webflades filer`.
- **Henvisningen i `design.md`** — `plugins/agents/skills/design/design.md`, `## Sådan kobles den på`:
  den peger nu på `### En ny udgave uden Ctrl+F5` i `## En webflades filer`. Henvisningen under
  `### Bundlinje` er ikke ændret, og den holder.
- **`GUIDE.md`**. Under `## Workflows` er *"Ingen roller nævner workflows af sig selv"* erstattet:
  `/agents:architect` foreslår `docker-publish` når projektet skal udrulles via Portainer, og nævner det
  ikke igen efter et nej. Ellers kalder man det selv. Under `## Designstandard` står nu at standarden er
  et tilbud, også for nye projekter, og at `architect` nævner den én gang som en mulighed. Bundlinjen
  følger standarden og gælder ikke løsninger uden den. *"så den gælder i ethvert projekt"* er fjernet.
  Stykket om Ctrl+F5 er uændret.
- **Henvisningerne**: jeg har søgt i hele repoet uden for `docs/` og `CHANGELOG.md`. Alle henvisninger
  til Ctrl+F5-reglen peger nu på `## En webflades filer`. Alle henvisninger til
  `## Webflader og designstandarden` og `### Bundlinjen er fast` holder, fordi overskrifterne er de samme.
- **Kontrollen**: `node tools/validate.mjs` gav exit 0 og *"OK. 13 skills, 7 agenter, 66
  markdown-filer, 29 farvepar"*. Der var to advarsler, begge ventede: `kontrakt-version` står stadig på 27, og
  `design-version` står stadig på 4. Ingen af dem er bumpet.
- **Til README**: ingen nye kommandoer eller indstillinger. Men brugeren oplever nu to ting
  anderledes: standarden er et tilbud, og `architect` foreslår workflowet. Se fund 1 nedenfor.

### Hvad er ikke lavet, og hvorfor

- **Stemplerne er ikke bumpet.** Det gælder `kontrakt-version` (kontrakten har fået en regelændring) og
  `design-version` (`design.md` har kun fået en henvisning rettet). Opgaven siger at de tilbydes ved
  lukningen.
- **Søgningen (trin 6) fandt to steder uden for mit mandat.** Dem har jeg ikke rettet:
  1. `README.md`, linje 86–87. Om workflow står der *"Kaldes eksplicit — ingen rolle foreslår dem"*. Om
     design står der *"Nye projekter med en webflade bruger den fra start; bundlinjens regel står i
     kontrakten og gælder alle webløsninger"*. Begge modsiger nu opgaven. README er `architect`s.
  2. `AGENTS.md` i roden har stadig den gamle tekst i `## Webflader og designstandarden`. Den er
     repoets egen kontrakt, og opgaven siger at jeg ikke må røre den.
- Ellers fandt søgningen ikke andre steder i `plugins/agents/` eller i rodens dokumenter, der kræver
  standarden eller bundlinjen uden `docs/design/`, eller som siger at ingen rolle foreslår workflows.
  `design/SKILL.md` (*"Foreslå ja når projektet har en webflade"*) handler om kaldet selv når det
  køres, så det passer stadig. `workflow/SKILL.md` er uændret, som opgaven siger. Det samme gælder
  `mockup/SKILL.md`, hooken og `PLUGIN.md`.

### Uklart

- **Hvordan "nævner den ikke igen efter et nej" for standarden holder på tværs af tråde.** Opgaven siger
  kun beslutningsloggen for workflowet. En frisk `architect`-tråd kan ellers ikke vide at der er sagt
  nej. Derfor har jeg skrevet det samme for standarden: et nej skrives i loggen, og står der et nej
  dér, nævnes den ikke igen. Det følger også af `architect`s egen regel om at hver beslutning skrives i
  loggen. Var det ikke meningen, er det én sætning i `architect/SKILL.md` trin 1.
- **Hvad "i drift" betyder i kontrakten.** Definitionen af "nyt" og "i drift" (indtil første udgivelse)
  er fjernet sammen med stykket om nye projekter, som opgaven bad om. Ordet "i drift" står stadig i
  designafsnittet og i `## En webflades filer`, og nu uden definition. Jeg har ladet det stå som
  almindeligt sprog.
- **Workflow-forslaget står ikke i kontrakten.** Opgaven placerer det kun i `architect/SKILL.md` og
  `GUIDE.md`, så jeg har ikke skrevet det i kontraktskabelonen.
- **Hvor `## En webflades filer` ligger.** Jeg forstod *"lige efter"* som lige efter designafsnittet,
  altså efter `### Bundlinjen er fast`. `### En ny udgave uden Ctrl+F5` er beholdt som underafsnit med
  sin overskrift, så henvisninger til underafsnittet holder. Kun forælderen i henvisningerne er rettet.
