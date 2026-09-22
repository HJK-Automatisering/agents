---
nummer: task-0005
titel: Udgivelser efterlader intet spor i historikken
status: i-gang
kilde: interview
oprettet: 2026-09-22
---

# task-0005 — Udgivelser efterlader intet spor i historikken

## Hvad og hvorfor

`CHANGELOG.md` har fjorten udgivelser. `git tag -l` er tom. Nummeret står i de
to manifester og i posten, men intet i historikken peger på den commit en
udgivelse faktisk blev hentet fra.

Udgivelsesproceduren i `PLUGIN.md` har syv trin, og et ottende trin i hånden
bliver glemt — det er derfor det er glemt fjorten gange. Kontrollen kører
allerede på hvert push til default-branchen og læser manifestet i forvejen.

## Færdig når

- [ ] En udgivelse efterlader et mærke i historikken, der peger på den commit versionen blev ændret i
- [ ] Mærket sættes af sig selv. Ingen skal huske et trin
- [ ] Et push hvor versionen står uændret, efterlader ingenting
- [ ] Et push hvor kontrollerne fejler, efterlader ingenting
- [ ] De fjorten tidligere udgivelser er urørte
- [ ] Der oprettes ingen udgivelsesside — kun mærket
- [ ] Udgivelsesproceduren i vedligeholdelsesdokumentet siger hvad der nu sker af sig selv
- [ ] Opgaven ændrer ikke selv et versionsnummer

## Sådan bygger vi det

| Fil | Ændring |
|---|---|
| `.github/workflows/validate.yaml` | Nyt job efter kontroljobbet, kun ved push til default-branchen. Læser `version` fra plugin-manifestet, sammenligner med de tags der findes, og sætter `v<version>` hvis den ikke er der |
| `PLUGIN.md` | Afsnittet `## Udgiv en rolleændring`: proceduren siger at mærket kommer af sig selv efter push, og at det ikke skal sættes i hånden |

Jobbet hænger på kontroljobbet, så et rødt kontroljob aldrig fører til et tag.
`contents: write` gives **kun til det nye job**; workflowets egen rettighed
bliver stående på `read`, så kontroljobbet er uændret.

Findes tagget allerede, gør jobbet ingenting og melder det. Det er den normale
tilstand: de fleste push ændrer ikke versionen.

De to manifester skal være enige om `version` — `tools/validate.mjs` kontrollerer
det allerede, og kontroljobbet kører først.

## Hvad vi ikke rører

- Kontroljobbet og `tools/validate.mjs`.
- `CHANGELOG.md`, dens form og dens rolle som teksten til udviklerne.
- Alle versionsnumre: de to manifester, `kontrakt-version` og `skabelon-version`.
- Historikken og de fjorten udgivelser der ligger bag os.
- Plugin'ets roller og hooken.

## Afhænger af

intet

## Beslutninger

- BESLUTTET: CI sætter mærket frem for et trin i hånden — det manuelle trin er
  blevet glemt ved alle fjorten udgivelser, og et trin der skal huskes, er ikke
  en løsning på at det blev glemt. Afvist: trin otte i proceduren.
- BESLUTTET: mærket hedder `v<version>`, altså `v1.0.0-beta.23` — kontraktens
  egne eksempler bruger `v`-præfikset. Afvist: nummeret uden præfiks.
- BESLUTTET: kun fremad. De fjorten tidligere udgivelser mærkes ikke. Afvist:
  mærkning bagud, som er arkæologi og ikke retter mekanismen — et bump-commit
  er ikke nødvendigvis det commit udgivelsen blev hentet fra.
- BESLUTTET: kun mærket, ingen udgivelsesside. Afvist: en GitHub Release med
  posten fra `CHANGELOG.md`, som ville lægge samme tekst to steder og kræve at
  den rigtige sektion klippes ud.
- BESLUTTET: mærket sættes kun når kontrollerne er grønne, og kun når versionen
  har ændret sig. Et push uden versionsændring efterlader ingenting.
- BESLUTTET: `contents: write` gives kun til det nye job — kontroljobbet
  beholder `read`.

## Åbne punkter

## Indvendinger

---

## Developers noter

<Alt over denne overskrift ejes af architect. Alt herunder skrives kun af
developer, som aldrig retter i definitionen ovenfor.>

### Hvad er lavet

- `.github/workflows/validate.yaml`: nyt job `tag` efter kontroljobbet. Det
  hænger på det med `needs: validate`, så et rødt kontroljob aldrig fører til et
  mærke, og det kører kun når `github.event_name == 'push'` — push-triggeren er
  i forvejen begrænset til `main`, så pull requests og `workflow_dispatch`
  falder fra. `contents: write` står på jobbet; workflowets egen rettighed er
  urørt på `contents: read`.
- Jobbet læser `version` fra `plugins/agents/.claude-plugin/plugin.json` med
  `node -p` — samme kilde og samme værktøj som resten af repoet — og sætter
  `v<version>` på det commit der blev pushet. Findes mærket allerede på origin,
  skriver jobbet det i loggen og slutter grønt uden at røre noget.
- `PLUGIN.md`, `## Udgiv en rolleændring`: afsnit efter de syv trin om at mærket
  kommer af sig selv efter push, at det ikke sættes i hånden, at intet sker når
  versionen er uændret eller kontrollen fejler, og at der ikke oprettes en
  udgivelsesside.

Holdt op mod `Færdig når`, punkt for punkt:

| Punkt | Hvor |
|---|---|
| Mærke i historikken på den commit versionen blev ændret i | `tag`-jobbet sætter `v<version>` på `GITHUB_SHA` for pushet |
| Sættes af sig selv | Jobbet kører på hvert push til `main`; intet manuelt trin |
| Uændret version efterlader ingenting | `git ls-remote --exit-code --tags` finder mærket og jobbet stopper med `exit 0` |
| Røde kontroller efterlader ingenting | `needs: validate` |
| De fjorten tidligere udgivelser urørte | Ingen mærkning bagud, intet rørt i historikken |
| Ingen udgivelsesside | Kun `git tag` og `git push`; intet kald til GitHubs release-API |
| Proceduren siger hvad der nu sker af sig selv | Afsnittet i `PLUGIN.md` |
| Ingen versionsnumre ændret | `git diff` rører kun de to filer; begge manifester står stadig på samme nummer |

Efterprøvet her: YAML'en parser og har nu de to jobs `validate` og `tag` med de
rettigheder der er beskrevet; `bash -n` på jobbets skript; skriptet kørt mod et
lokalt testrepo med et kunstigt manifest, hvor første kørsel satte mærket og
anden kørsel meldte at det fandtes og sluttede grønt; `node tools/validate.mjs`
er grøn.

### Hvad er ikke lavet, og hvorfor

Selve jobbet kan ikke afprøves herfra — GitHub Actions kører ikke lokalt, og
jeg pusher ikke. Logikken er afprøvet som beskrevet ovenfor, men at jobbet
faktisk udløses, arver rettigheden og får lov at skrive et tag, viser sig først
ved det første rigtige push til `main` med et nyt versionsnummer. Er
`contents: write` ikke nok i repoets indstillinger (fx hvis workflow-tokenet er
sat til read-only på organisationsniveau), fejler jobbet der.

Jobbet bruger den Node der ligger på løberen frem for et `setup-node`-trin, som
kontroljobbet har. Det er kun et JSON-felt der læses, og det gør trin færre; vil
`architect` have samme fastlåste version begge steder, er det fire linjer mere.

### Uklart

Opgaven siger hvad mærket hedder, men ikke om det skal være annoteret. Jeg satte
et letvægtstag — det kræver ingen identitet på løberen og er nok til at pege på
et commit. Skal mærket bære dato, udgiver og en tekst, er det et annoteret tag
og en lille ændring i samme trin.
