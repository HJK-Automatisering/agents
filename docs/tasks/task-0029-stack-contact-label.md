---
nummer: task-0029
titel: En stak uden kontaktlabel får ingen mail fra overvågningen af Docker-værten
status: i-gang
kilde: interview
oprettet: 2026-11-18
---

# task-0029 — En stak uden kontaktlabel får ingen mail fra overvågningen af Docker-værten

## Hvad og hvorfor

`HJK-Automatisering/docker-monitor` overvåger Docker-værten. Den læser labelen `hjk.kontakt` på
stakkens containere og sender adressen en ugentlig rapport om sårbarheder og en morgenmail om
containere der er gået ned. En stak uden labelen får ingen mail, og ingen fejl siger det.

Beslutningen 2026-11-18 i docker-monitors beslutningslog: labelen bliver standard i begge fælles
repoer. Kontrakten i dette repo definerer den; en lint-regel i workflow-repoet håndhæver den. Dette
repo tages først. Lint-reglen er ikke en del af opgaven.

`CONTACT_EMAIL` findes allerede som påkrævet nøgle for bundlinjen. Det er samme nøgle og samme
person, så det skrives sammen og ikke som to regler.

## Færdig når

- [ ] Kontraktskabelonen siger at hver stak har `CONTACT_EMAIL` på stakken og labelen
      `hjk.kontakt: ${CONTACT_EMAIL}` på mindst én tjeneste i compose-filen, og at værdien kun sættes
      på stakken
- [ ] Kontrakten siger hvorfor: docker-monitor sender stakkens kontaktperson mailene, og en stak
      uden labelen får ingen
- [ ] Bundlinjens `CONTACT_EMAIL` og stakkens kontaktperson er skrevet som én nøgle og én person
- [ ] Kontrakten har *Hvem gør hvad*: `architect` skriver labelen i `Færdig når`, `developer` sætter
      den i compose-filen og nøglen i `.env.example`, `reviewer` og `security` melder det som fund
- [ ] `docker-publish.md`: referencefilen har labelen, og opsætningen af stacken nævner
      `CONTACT_EMAIL` blandt variablerne
- [ ] `PORTAINER.md` nævner `CONTACT_EMAIL` hvor variablerne gennemgås
- [ ] Ingen versionsnummer eller stempel er bumpet
- [ ] Repoets kontrol er grøn, bortset fra de ventede advarsler om stemplerne

## Hvad vi ikke rører

- `AGENTS.md` i roden. Den bringes ajour med `/agents:update` efter et bump af `kontrakt-version`,
  som ved version 28
- `kontrakt-version`, `skabelon-version` og versionsnumrene i manifesterne
- `CHANGELOG.md` og `README.md`. Posten skrives ved udgivelsen
- Lint-reglen. Den kommer i workflow-repoet

## Afhænger af

intet

## Beslutninger

- BESLUTTET: reglen står i sit eget afsnit i kontrakten, `## En stak og dens kontaktperson`, ikke
  kun i workflow-dokumentet. Den gælder hver stak, også en der ikke bruger `docker-publish`
- BESLUTTET: `CONTACT_EMAIL` defineres i stakkens afsnit, og bundlinjen henviser dertil. Uden
  designstandarden bruges variablen kun til labelen, og appen behøver ikke læse den
- BESLUTTET: `architect`, `reviewer` og `security` får én henvisning hver i deres rollefil, så de
  kender reglen. Erfaringen fra task-0025 er at en regel kun i kontrakten ikke bliver holdt
- BESLUTTET: stemplerne bumpes ikke her. Det er menneskets beslutning

## Åbne punkter

## Indvendinger

---

## Developers noter

<Alt over denne overskrift ejes af architect. Alt herunder skrives kun af
developer, som aldrig retter i definitionen ovenfor.>

### Hvad er lavet

Gren `task-0029-stack-contact-label`.

- **Kontraktskabelonen**, `plugins/agents/skills/kickoff/AGENTS.md`: nyt afsnit
  `## En stak og dens kontaktperson` efter `## En app bag Authentik`. Kendetegn, hvorfor, tre punkter
  (labelen på mindst én tjeneste, samme variabel overalt, `CONTACT_EMAIL` sat på stakken og ligner en
  mailadresse), henvisning til docker-monitors README, *Hvem gør hvad* for de fire roller, og linjen
  om en stak i drift uden labelen.
- **Bundlinjen**, samme fil, `### Bundlinjen er fast`: rækken for `EMAIL` og punktet om de
  påkrævede nøgler siger at `CONTACT_EMAIL` er samme nøgle og person som stakkens kontaktperson.
- **Rollerne**: `plugins/agents/skills/architect/SKILL.md` trin 1, `plugins/agents/agents/reviewer.md`
  og `plugins/agents/agents/security.md` har hver én linje der peger på det nye afsnit.
- **`plugins/agents/skills/workflow/docker-publish.md`**: referencefilen har labelen på `web` med en
  kommentar og et stykke over filen om hvorfor. Trin 0 og trin 3 i opsætningen af stacken nævner
  `CONTACT_EMAIL`. Tabellen *Når noget ikke sker* har en række om manglende mail.
- **`PORTAINER.md`**: *Før du begynder* og trin 30 nævner `CONTACT_EMAIL` og hvorfor.
- **`GUIDE.md`**, `## Workflows`: ét stykke om at hver stak har en kontaktperson.
- **Kontrollen**: `node tools/validate.mjs` gav exit 0. To advarsler, begge ventede:
  `kontrakt-version` står på 28, og `skabelon-version` står på 5.

### Hvad er ikke lavet, og hvorfor

- **Stemplerne er ikke bumpet.** Kontrakten har fået en ny regel, så `kontrakt-version` skal fra 28
  til 29. Workflow-dokumentet er ændret, så `skabelon-version` skal fra 5 til 6. Begge er menneskets
  beslutning.
- **`AGENTS.md` i roden** er ikke rørt. Den bringes ajour med `/agents:update` efter bumpet.
- **`CHANGELOG.md`** er ikke skrevet. Posten skrives ved udgivelsen, før manifesterne bumpes.

### Uklart

- Om `docker-publish.md` med denne ændring "ændrer hvad workflowet gør". Workflowet selv er uændret,
  men dokumentet der kopieres ind i projekterne, siger nu noget nyt. Uden bump får projekterne aldrig
  den nye tekst.
