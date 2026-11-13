---
design-version: 3
---

# Designstandard for webløsninger

Projektet bruger den fælles designstandard fra plugin'et `agents`. Den giver grundværdier — farver, skriftstørrelser, afstande, hjørner og fokusmarkering — og seks komponenter: knap, formularfelt, tabel, besked, topbjælke og bundlinje. Den virker i lys og mørk tilstand, og hvert farvepar den lover, lever op til WCAG 2.1 AA.

Standarden er tre filer i `docs/design/`:

| Fil | Hvad |
|---|---|
| `design.md` | Dette dokument |
| `design.css` | Grundværdierne som CSS-variabler, og komponenterne |
| `eksempel.html` | Alle komponenter i alle tilstande. Åbn den direkte fra disken |

`design-version` i frontmatter siger hvilken udgave af standarden kopien er.

## Kopien rettes ikke

**`docs/design/` er en kopi af det fælles.** Ret aldrig i `design.css`, `design.md` eller `eksempel.html` i et projekt. Rettes kopien, kan den ikke opdateres uden at rettelsen går tabt, og projektet glider fra de andre i tavshed.

**Projektets egne regler står i en fil for sig.** Appens eget stylesheet indlæses *efter* `design.css` og bruger standardens variabler, `var(--hjk-color-primary)`, i stedet for at skrive farverne igen. Egne klasser får ikke præfikset `hjk-` — det er standardens.

Mangler standarden noget et projekt har brug for, er det et emne til det fælles, ikke en rettelse i kopien.

## Sådan kobles den på

Appen bruger `docs/design/design.css` som den er: direkte, eller kopieret ind ved build. Hvordan afhænger af stakken. Filen henter intet udefra — ingen skrifttyper, ingen billeder, ingen `@import` — så den virker uden netværk.

```html
<link rel="stylesheet" href="design.css">
<link rel="stylesheet" href="app.css">
```

Sæt `class="hjk-page"` på `<body>` for at give siden standardens baggrund, tekstfarve og skrift. Det er valgfrit; komponenterne virker også uden.

## Præfikset `hjk-`

**Alle variabler og klasser hedder `hjk-` noget.** Komponenterne rammer kun elementer der bærer standardens egne klasser — aldrig `button`, `input` eller `table` direkte. Derfor kan standarden stå ved siden af et framework uden at ændre dets elementer: en knap ser kun ud som standardens knap, når den har klassen `hjk-button`.

Komponenterne er ren CSS. De virker uden JavaScript.

## Lys og mørk

- **Lys er standard.**
- **Mørk følger maskinen.** Er styresystemet eller browseren sat til mørk, skifter standarden af sig selv, gennem `prefers-color-scheme: dark`.
- **En side kan overstyre** med `data-theme` på `<html>`. Overstyringen vinder i begge retninger:

| `<html>` | Maskinen er lys | Maskinen er mørk |
|---|---|---|
| intet `data-theme` | lys | mørk |
| `data-theme="light"` | lys | lys |
| `data-theme="dark"` | mørk | mørk |

Skal brugeren selv kunne vælge, er det appen der sætter attributten og husker valget. Standarden gør det ikke.

Appens egne farver skifter med, når de skrives som standardens variabler. En farve skrevet som hex i appens eget stylesheet skifter ikke.

## Grundværdier

Alle er CSS-variabler på `:root`.

| Gruppe | Variabler |
|---|---|
| Flader | `--hjk-color-bg` (siden), `--hjk-color-surface` (felter, tabeller), `--hjk-color-surface-alt` (tabelhoved) |
| Tekst | `--hjk-color-text`, `--hjk-color-text-muted` |
| Kanter | `--hjk-color-border` (komponenters kant), `--hjk-color-divider` (skillelinjer, kun pynt) |
| Primærfarve | `--hjk-color-primary`, `--hjk-color-primary-hover`, `--hjk-color-on-primary` |
| Fare | `--hjk-color-danger`, `--hjk-color-danger-hover`, `--hjk-color-on-danger` |
| Beskeder | `--hjk-color-{error,warning,success,info}-text` og `-bg`, plus `--hjk-color-error-border` |
| Topbjælke | `--hjk-color-topbar-bg`, `--hjk-color-topbar-text`, `--hjk-color-topbar-focus` |
| Deaktiveret | `--hjk-color-disabled-bg`, `--hjk-color-disabled-text`, `--hjk-color-disabled-border` |
| Skrift | `--hjk-font-family` (systemets skrifttyper), `--hjk-font-family-mono`, `--hjk-font-size-{sm,base,lg,xl,xxl}`, `--hjk-font-weight-{normal,bold}`, `--hjk-line-height`, `--hjk-line-height-tight` |
| Afstande | `--hjk-space-1` til `--hjk-space-7`: 0,25 · 0,5 · 0,75 · 1 · 1,5 · 2 · 3 rem |
| Hjørner | `--hjk-radius-sm`, `--hjk-radius-md` |
| Kantbredde | `--hjk-border-width`, `--hjk-border-width-strong` |
| Fokus | `--hjk-focus-width`, `--hjk-focus-offset`, `--hjk-color-focus` |

Farverne skrives som hex i `design.css`, fordi kontrollen i plugin'et læser dem.

## Komponenter

### Knap

```html
<button class="hjk-button">Gem</button>
<button class="hjk-button hjk-button--secondary">Fortryd</button>
<button class="hjk-button hjk-button--danger">Slet</button>
<button class="hjk-button" disabled>Gem</button>
```

Primær er standard. Brug én primær knap pr. handling på en skærm. Klassen virker også på et `<a>`, der skal ligne en knap.

### Formularfelt

```html
<div class="hjk-field">
  <label class="hjk-label" for="navn">Navn</label>
  <span class="hjk-hint" id="navn-hint">Som det står i registret</span>
  <input class="hjk-input" id="navn" aria-describedby="navn-hint">
</div>

<div class="hjk-field">
  <label class="hjk-label" for="dato">Dato</label>
  <input class="hjk-input" id="dato" aria-invalid="true" aria-describedby="dato-fejl">
  <span class="hjk-field-error" id="dato-fejl">Skriv datoen som dd-mm-åååå.</span>
</div>
```

- **Fejl** vises med `aria-invalid="true"` på feltet og en `hjk-field-error` med teksten, bundet med `aria-describedby`. Teksten er det der bærer fejlen; den røde kant er ikke nok alene.
- **Deaktiveret** med `disabled`.
- `hjk-input` bruges også på `<select>` og `<textarea>`.

### Tabel

```html
<div class="hjk-table-wrap" tabindex="0" role="region" aria-label="Bestillinger">
  <table class="hjk-table">
    <caption class="hjk-table__caption">Bestillinger</caption>
    <thead>
      <tr><th class="hjk-table__header" scope="col">Nummer</th></tr>
    </thead>
    <tbody>
      <tr><td class="hjk-table__cell">1001</td></tr>
    </tbody>
  </table>
</div>
```

- **Hver celle bærer sin klasse.** `hjk-table__header` i hovedet, `hjk-table__cell` i rækkerne — også på en `<th scope="row">`. Standarden rammer ikke en `th` eller `td` uden.
- **Smal skærm:** tabellen ruller vandret inden i `hjk-table-wrap`. Kolonnerne bliver stående, og skærmlæsere læser den stadig som en tabel. `tabindex="0"` gør at rammen kan rulles med tastaturet, og `aria-label` siger hvad den rummer.

### Besked

```html
<div class="hjk-message hjk-message--error" role="alert">
  <p class="hjk-message__title">Fejl</p>
  <p class="hjk-message__body">Bestillingen blev ikke gemt. Prøv igen.</p>
</div>
```

Fire varianter: `hjk-message--error`, `--warning`, `--success` og `--info`. **Beskedens art skal stå i teksten** — farven alene er ikke nok, og ikke alle kan se den. Brug `role="alert"` til fejl der opstår mens brugeren arbejder, og `role="status"` til en kvittering.

### Topbjælke

```html
<header class="hjk-topbar">
  <a class="hjk-topbar__name" href="/">Appens navn</a>
  <nav class="hjk-topbar__nav" aria-label="Hovedmenu">
    <a class="hjk-topbar__link" href="/" aria-current="page">Oversigt</a>
    <a class="hjk-topbar__link" href="/indstillinger">Indstillinger</a>
  </nav>
</header>
```

Den aktuelle side markeres med `aria-current="page"`. Topbjælken folder sig på flere linjer på en smal skærm. Den har ingen logo-plads; et logo er projektets egen regel.

### Bundlinje

```html
<footer class="hjk-footer">
  Udviklet af TEAMNAVN. Ved udfordringer kontakt
  <a class="hjk-footer__link" href="mailto:EMAIL?subject=Ang%C3%A5ende%20APPNAVN">EMAIL</a>. Version X.Y.Z
</footer>
```

- **Nederst på hver side**, som sidste element i `<body>` og uden for `<main>`. Så er den sidens `contentinfo` for skærmlæsere.
- Lille, dæmpet og centreret tekst med en tynd linje over. Adressen er et understreget link i primærfarven.
- **Teksten og værdierne er faste.** `TEAMNAVN`, `EMAIL`, `APPNAVN` og `X.Y.Z` står for værdier der sættes ind. Reglen — teksten, nøglerne, og hvor værdierne kommer fra — står i projektets `AGENTS.md`, under `### Bundlinjen er fast` i `## Webflader og designstandarden`.

## Tilgængelighed

- **Kontrast:** 4,5:1 for tekst, 3:1 for komponenters kanter og fokus. Hvert par standarden lover, står i tabellen herunder.
- **Fokus** vises med `:focus-visible` som en ramme i `--hjk-color-focus`, uden for komponenten. Den lever op til 3:1 mod baggrunden. Fjern den aldrig i appens eget stylesheet.
- **Deaktiverede komponenter** er undtaget fra kontrastkravet i WCAG 2.1, og deres farver står derfor ikke i tabellen. De er lavet til at kunne læses alligevel.
- **Farve bærer aldrig betydning alene.** En fejl har en tekst, en besked siger sin art, den aktuelle side i topbjælken er også fed og understreget, og linket i bundlinjen er understreget.
- **Appens egne farvepar** er projektets ansvar. Bruger appen standardens variabler i de par tabellen viser, holder kontrasten.

## Farvepar

Hvert par herunder er lovet i begge tilstande. Forholdet er beregnet efter WCAG 2.1 ud fra værdierne i `design.css` og vist med to decimaler, rundet ned, så tabellen aldrig lover mere end farven holder. Krav: 4,5 for tekst, 3 for kanter og fokus.

I plugin'et er tabellen det kontrollen læser: den regner forholdene ud igen og fejler hvis et par falder under kravet, hvis en variabel ikke findes, eller hvis et tal her ikke passer med det beregnede.

| Forgrund | Baggrund | Krav | Lys | Mørk | Bruges til |
|---|---|---|---|---|---|
| `--hjk-color-text` | `--hjk-color-bg` | 4,5 | 14,99 | 14,76 | Brødtekst på siden |
| `--hjk-color-text` | `--hjk-color-surface` | 4,5 | 16,35 | 13,44 | Tekst i felter og tabelceller |
| `--hjk-color-text` | `--hjk-color-surface-alt` | 4,5 | 13,80 | 11,47 | Tabelhoved |
| `--hjk-color-text-muted` | `--hjk-color-bg` | 4,5 | 6,80 | 8,01 | Hjælpetekst på siden |
| `--hjk-color-text-muted` | `--hjk-color-surface` | 4,5 | 7,42 | 7,30 | Hjælpetekst på en flade |
| `--hjk-color-primary` | `--hjk-color-surface` | 4,5 | 7,24 | 8,02 | Sekundær knap |
| `--hjk-color-primary` | `--hjk-color-surface-alt` | 4,5 | 6,11 | 6,84 | Sekundær knap, mus over |
| `--hjk-color-on-primary` | `--hjk-color-primary` | 4,5 | 7,24 | 8,94 | Primær knap |
| `--hjk-color-on-primary` | `--hjk-color-primary-hover` | 4,5 | 9,81 | 11,38 | Primær knap, mus over |
| `--hjk-color-on-danger` | `--hjk-color-danger` | 4,5 | 6,57 | 8,25 | Fareknap |
| `--hjk-color-on-danger` | `--hjk-color-danger-hover` | 4,5 | 9,06 | 10,86 | Fareknap, mus over |
| `--hjk-color-error-text` | `--hjk-color-bg` | 4,5 | 8,52 | 9,67 | Fejltekst under et felt |
| `--hjk-color-error-text` | `--hjk-color-surface` | 4,5 | 9,30 | 8,80 | Fejltekst under et felt på en flade |
| `--hjk-color-error-text` | `--hjk-color-error-bg` | 4,5 | 8,13 | 8,60 | Besked: fejl |
| `--hjk-color-warning-text` | `--hjk-color-warning-bg` | 4,5 | 7,55 | 9,53 | Besked: advarsel |
| `--hjk-color-success-text` | `--hjk-color-success-bg` | 4,5 | 7,18 | 9,26 | Besked: succes |
| `--hjk-color-info-text` | `--hjk-color-info-bg` | 4,5 | 7,58 | 9,47 | Besked: info |
| `--hjk-color-topbar-text` | `--hjk-color-topbar-bg` | 4,5 | 13,99 | 15,68 | Appnavn og navigation i topbjælken |
| `--hjk-color-text-muted` | `--hjk-color-bg` | 4,5 | 6,80 | 8,01 | Bundlinjens tekst |
| `--hjk-color-primary` | `--hjk-color-bg` | 4,5 | 6,64 | 8,81 | Adressen i bundlinjen |
| `--hjk-color-primary` | `--hjk-color-bg` | 3 | 6,64 | 8,81 | Primær og sekundær knaps kant mod siden |
| `--hjk-color-danger` | `--hjk-color-bg` | 3 | 6,02 | 8,07 | Fareknappens kant mod siden |
| `--hjk-color-border` | `--hjk-color-bg` | 3 | 3,56 | 4,90 | Formularfeltets kant mod siden |
| `--hjk-color-border` | `--hjk-color-surface` | 3 | 3,88 | 4,46 | Formularfeltets kant på en flade |
| `--hjk-color-error-border` | `--hjk-color-bg` | 3 | 5,05 | 5,63 | Formularfelt med fejl, mod siden |
| `--hjk-color-error-border` | `--hjk-color-surface` | 3 | 5,51 | 5,13 | Formularfelt med fejl, på en flade |
| `--hjk-color-focus` | `--hjk-color-bg` | 3 | 6,64 | 11,22 | Fokusmarkering på siden |
| `--hjk-color-focus` | `--hjk-color-surface` | 3 | 7,24 | 10,21 | Fokusmarkering på en flade |
| `--hjk-color-topbar-focus` | `--hjk-color-topbar-bg` | 3 | 8,28 | 11,92 | Fokusmarkering i topbjælken |
