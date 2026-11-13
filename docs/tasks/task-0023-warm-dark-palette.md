---
nummer: task-0023
titel: Mørk tilstand er kølig blågrå, men skal være varm grå over i grøn
status: afsluttet
kilde: interview
oprettet: 2026-11-13
---

# task-0023 — Mørk tilstand er kølig blågrå, men skal være varm grå over i grøn

## Hvad og hvorfor

Designstandardens mørke tilstand er blågrå med en lyseblå markeringsfarve. Mennesket vil have den
varmere: mørkegrå med et grønt skær, varm hvid tekst og en messingfarvet accent. Alle farver skal
følge paletten, også beskederne. Der må ikke stå et blåt infofelt tilbage. Mennesket valgte palet A,
*mos og messing*, ud fra en prøveside, hvor tre paletter blev vist på et rigtigt layout. Lys tilstand
er ikke en del af ønsket.

## Færdig når

- [ ] Mørk tilstand bruger præcis farverne i tabellen under *Paletten* nedenfor, både der hvor den følger maskinen, og der hvor en side selv vælger mørk
- [ ] Der er ingen blå farve tilbage i mørk tilstand. Beskederne, fareknappen, fokusrammen og topbjælken følger paletten
- [ ] Lys tilstand er uændret til sidste tegn
- [ ] Tabellen over farvepar i standardens dokument viser de nye forhold for mørk tilstand, og hvert par holder kravet
- [ ] Standardens dokument beskriver mørk tilstand så det passer med paletten, hvis det overhovedet beskriver dens udseende
- [ ] Repoets kontrol er grøn, bortset fra den ventede advarsel om `design-version`

## Sådan bygger vi det

**Paletten.** Værdierne er regnet efter for kontrast, før opgaven blev skrevet. Alle 27 par holder
med mindst 1,49 gange kravet.

| Variabel | Værdi |
|---|---|
| `--hjk-color-bg` | `#141a17` |
| `--hjk-color-surface` | `#1b231f` |
| `--hjk-color-surface-alt` | `#24302a` |
| `--hjk-color-text` | `#ecebe4` |
| `--hjk-color-text-muted` | `#a9b1a8` |
| `--hjk-color-border` | `#7e8a80` |
| `--hjk-color-divider` | `#2f3a34` |
| `--hjk-color-primary` | `#d9b25f` |
| `--hjk-color-primary-hover` | `#e8cb8c` |
| `--hjk-color-on-primary` | `#1e1606` |
| `--hjk-color-danger` | `#ee9a88` |
| `--hjk-color-danger-hover` | `#f4bcae` |
| `--hjk-color-on-danger` | `#2a0e08` |
| `--hjk-color-focus` | `#e8cb8c` |
| `--hjk-color-disabled-bg` | `#232b27` |
| `--hjk-color-disabled-text` | `#87908a` |
| `--hjk-color-disabled-border` | `#38423c` |
| `--hjk-color-error-text` | `#f2b0a2` |
| `--hjk-color-error-bg` | `#3a1a14` |
| `--hjk-color-error-border` | `#e2705c` |
| `--hjk-color-warning-text` | `#f0cf86` |
| `--hjk-color-warning-bg` | `#33290f` |
| `--hjk-color-success-text` | `#a8d5a2` |
| `--hjk-color-success-bg` | `#18291a` |
| `--hjk-color-info-text` | `#c3d4c6` |
| `--hjk-color-info-bg` | `#1f2b25` |
| `--hjk-color-topbar-bg` | `#0e1311` |
| `--hjk-color-topbar-text` | `#ecebe4` |
| `--hjk-color-topbar-focus` | `#e8cb8c` |

**1. `plugins/agents/skills/design/assets/design.css`.** Mørk tilstand står i to blokke med samme
værdier: `@media (prefers-color-scheme: dark)` og `:root[data-theme="dark"]`. Kontrollen fejler hvis
de skilles ad. Skriv værdierne fra tabellen ind i begge. `--hjk-color-scheme` og alt uden for de to
blokke skal ikke røres.

**2. `plugins/agents/skills/design/design.md`, `## Farvepar`.** Kolonnen *Mørk* skal vise de nye
forhold, beregnet efter WCAG 2.1 og rundet *ned* til to decimaler, som afsnittet selv beskriver.
Kontrollen regner dem efter og fejler hvis et tal ikke passer. Kolonnen *Lys* skal ikke røres. Læs
også resten af dokumentet: står der noget om hvordan mørk tilstand ser ud, skal det passe.

**3. `eksempel.html`** bruger stylesheetet og skal kun rettes, hvis den selv skriver farver for mørk
tilstand. Skriv i dine noter hvad du fandt.

Det visuelle kræver øjne. Start ikke en browser. Skriv i noterne at det ikke er set, så åbner
mennesket `eksempel.html` i mørk tilstand.

Kør `node tools/validate.mjs`. Den vil advare om at standarden har flyttet sig uden at
`design-version` fulgte med. Det er ventet. **Bump den ikke**; det beslutter mennesket ved lukningen.

## Hvad vi ikke rører

- Lys tilstand: blokken `:root` øverst og kolonnen *Lys* i farveparrene
- Komponenterne, skrift, afstande, hjørner og kanter
- Kontraktskabelonen og `AGENTS.md` i roden
- `design-version`, `kontrakt-version`, `skabelon-version` og versionsnumrene i manifesterne
- `README.md`, `GUIDE.md`, `CHANGELOG.md`, `docs/BOARD.md` og beslutningsloggen

## Afhænger af

intet

## Beslutninger

- BESLUTTET: palet A, *mos og messing*. Det er grå med et grønt skær, en dæmpet messingfarvet
  accent og varm hvid tekst. Afvist: B, *skovbund og rav*, som er grønnere og hvis ravgule ligger
  tæt på advarselsfarven. Afvist: C, *grafit og kobber*, som er næsten uden grønt og hvis kobber
  ligger tæt på fareknappen. Mennesket valgte efter at have set alle tre på en prøveside
- BESLUTTET: markeringsfarven skifter fra blå til messing i mørk tilstand. Lys tilstand beholder sin
  blå. Mennesket afviste architects anbefaling om at beholde blå: en grøn flade skal ikke have blå
  markering
- BESLUTTET: alle farver følger paletten, også info, succes, advarsel, fejl og fareknappen. Info
  bliver en dæmpet grågrøn. Det bad mennesket om
- BESLUTTET: `design-version` bumpes ikke af developer. Det tilbydes ved lukningen og er menneskets
  beslutning

## Åbne punkter

## Indvendinger

---

## Developers noter

<Alt over denne overskrift ejes af architect. Alt herunder skrives kun af
developer, som aldrig retter i definitionen ovenfor.>

### Hvad er lavet

Commit `3632ffd` på grenen `task-0023-warm-dark-palette`.

- **Paletten i begge mørke blokke** — `plugins/agents/skills/design/assets/design.css`. Alle 29
  farvevariabler i `@media (prefers-color-scheme: dark)` og i `:root[data-theme="dark"]` har
  værdierne fra tabellen. Kun de 58 farvelinjer er ændret (`git diff --stat`: 58+/58-); kommentarer,
  `--hjk-color-scheme`, `:root`-blokken og alt efter de to blokke er urørt. Kontrollen bekræfter at
  de to blokke er ens.
- **Ingen blå tilbage i mørk tilstand.** Primær, fokus og topbjælkens fokus er messing (`#d9b25f`,
  `#e8cb8c`), info er grågrøn (`#c3d4c6` på `#1f2b25`), topbjælken er `#0e1311`, fareknappen
  `#ee9a88`. Alle værdier kommer fra tabellen; ingen er valgt af mig.
- **Lys tilstand er uændret.** Ingen linje i `:root` eller i kolonnen *Lys* er rørt; tjekket med
  ordvis diff, hvor kun tallene i kolonnen *Mørk* har flyttet sig.
- **Farvepar** — `plugins/agents/skills/design/design.md`, `## Farvepar`. Kolonnen *Mørk* er regnet
  om for alle 29 rækker med samme formel som `tools/validate.mjs` (WCAG 2.1, rundet ned til to
  decimaler). Laveste margin er `--hjk-color-border` mod `--hjk-color-surface`: 4,46 mod kravet 3,
  altså 1,49 gange — det stemmer med opgavens tal.
- **Resten af `design.md`** beskriver ikke hvordan mørk tilstand ser ud, kun hvordan den slås til.
  *Adressen er et understreget link i primærfarven* (under `### Bundlinje`) holder stadig, fordi
  primærfarven er messing. Intet rettet.
- **`eksempel.html`** skriver ingen farver selv: ingen hex, `rgb()` eller `hsl()`, kun
  `var(--hjk-color-*)`. Den er ikke rørt.
- **`node tools/validate.mjs`** er grøn med 29 farvepar og én advarsel: `design-version` står stadig
  på 3, selv om standarden har flyttet sig. Den er ventet og ikke bumpet.

Ingen nye kommandoer eller indstillinger.

### Hvad er ikke lavet, og hvorfor

- **Det visuelle er ikke set.** Der er ikke startet nogen browser, som opgaven og kontrakten
  kræver. Mennesket skal åbne `plugins/agents/skills/design/assets/eksempel.html` i mørk tilstand
  og se på den.
- `design-version` er ikke bumpet, som opgaven siger.
- Opgavefilen, `docs/BOARD.md` og beslutningsloggen er ikke committet. De er architects og følger
  med på grenen ucommittet.

### Uklart

intet
