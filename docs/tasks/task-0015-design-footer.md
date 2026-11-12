---
nummer: task-0015
titel: Designstandarden har ingen fast bundlinje med team, kontaktadresse og version
status: i-gang
kilde: interview
oprettet: 2026-11-12
---

# task-0015 — Designstandarden har ingen fast bundlinje med team, kontaktadresse og version

## Hvad og hvorfor

Hver webløsning skal nederst sige hvem der har lavet den, hvem man kontakter ved udfordringer,
og hvilken version der kører. I dag findes det kun i ét projekt, som det har bygget selv.
Bundlinjen skal være en fast del af designstandarden fra task-0014, med samme tekst og samme
nøgler overalt, før standarden udgives første gang.

## Færdig når

- [ ] Standarden har en sjette komponent, bundlinjen: lille, dæmpet tekst med en tynd linje over, kontaktadressen som link i primærfarven, og synligt fokus på linket. Ren CSS, kun standardens egne klassenavne
- [ ] Bundlinjens farvepar står i standardens tabel med kontrasten i begge tilstande, og kontrollen regner dem efter
- [ ] Standardens dokument siger at hver webløsning viser bundlinjen nederst på hver side, med præcis teksten *Udviklet af TEAMNAVN. Ved udfordringer kontakt EMAIL. Version X.Y.Z*
- [ ] Dokumentet siger hvor værdierne kommer fra: team og adresse er påkrævede indstillinger på stakken, versionen er den der er bygget ind i imaget. Appen starter ikke uden de to indstillinger, og står versionen tom, udelades versionsdelen
- [ ] Dokumentet siger at værdierne sættes ind som tekst, aldrig som HTML, og at adressen er et link der åbner en ny mail med appens navn i emnet
- [ ] Eksempelsiden viser bundlinjen med opdigtede værdier, og den ser rigtig ud i begge tilstande
- [ ] `/agents:design` nævner bundlinjen, når den viser standarden, i afsnittet i projektets `CLAUDE.md`, og med sit eget emne på projektets BOARD
- [ ] Alle steder der tæller standardens komponenter, siger seks
- [ ] Repoets kontrol er grøn

## Sådan bygger vi det

Alt ligger i `plugins/agents/skills/design/`. Paletten er godkendt og ændres ikke; bundlinjen
bruger de farver der findes. Findes et par ikke i forvejen, skriver du det i noterne frem for at
lave en ny farve.

**`assets/design.css`:** en komponent `hjk-footer` efter samme mønster som de fem andre. Den
mindste skriftstørrelse standarden har, dæmpet tekstfarve, `divider` som linje over, linket i
primærfarven med `:focus-visible`. Ingen JavaScript.

**`design.md`:** et nyt afsnit under `## Komponenter`, `### Bundlinje`, med markup som de andre,
og et afsnit `## Bundlinjen er fast` der siger til en model i et fremmed projekt:

- Teksten er præcis *Udviklet af TEAMNAVN. Ved udfordringer kontakt EMAIL. Version X.Y.Z*.
- `TEAM_NAME` og `CONTACT_EMAIL` er påkrævede indstillinger. De står i `.env.example` uden værdi
  og i compose-filen som `${NØGLE}`. Værdierne sættes kun på stakken. Appen nægter at starte når
  en af dem mangler eller er tom, og loggen siger hvilken — aldrig en værdi.
- Versionen er `APP_VERSION`, som `docker-publish` bygger ind i imaget. Er den tom, fx ved lokal
  kørsel, udelades *. Version X.Y.Z*. Den skrives aldrig fast i koden.
- Værdierne læses på serveren. Hvordan de når siden, afhænger af stakken; de bages aldrig ind i
  en statisk fil ved build.
- Værdierne sættes ind som tekst, aldrig som HTML.
- Adressen er et `mailto:`-link med emnet *Angående <appens navn>*, procentkodet. Appens navn er
  tekst i koden, ikke en indstilling.

Tabellen under `## Farvepar` får bundlinjens par: teksten mod siden og linket mod siden.

**`assets/eksempel.html`:** bundlinjen nederst på siden med opdigtede værdier — et opdigtet
teamnavn og en adresse på `example.org`. Ingen rigtige navne eller adresser; repoet er offentligt.

**`SKILL.md`:** teksten der viser standarden, nævner bundlinjen. Afsnittet `## Designstandard` i
projektets `CLAUDE.md` får en linje om at bundlinjen er fast. Kaldet skriver to emner på BOARD:
det der står i dag om stylesheetet, og ét om bundlinjen med de to indstillinger.

**Tællingen:** "fem komponenter" står i `design.md`, `SKILL.md`, `assets/eksempel.html` og
`GUIDE.md`. Ret dem til seks, og nævn bundlinjen hvor de fem nævnes ved navn.

## Hvad vi ikke rører

- Paletten og de fem eksisterende komponenter
- `design-version` står på 1 — standarden er aldrig udgivet, så ingen projekter har en kopi
- Kontrakten, `mockup`, `reviewer`, hooken og `update`
- Versionsnumrene i begge manifester

## Afhænger af

task-0014

## Beslutninger

- BESLUTTET: teksten er menneskets, ordret — mennesket valgte. Afvist: projektet med bundlinje i dag skriver "problemer" og et midterpunkt
- BESLUTTET: nøglerne `TEAM_NAME` og `CONTACT_EMAIL` på stakken, og `APP_VERSION` fra imaget — samme navne som det projekt der har bundlinjen i dag, og `APP_VERSION` sendes allerede ind af `docker-publish`
- BESLUTTET: kravet til bundlinjen står i standardens dokument, ikke i kontrakten — det gælder præcis de projekter der har en webflade, og kræver intet bump af `kontrakt-version`
- BESLUTTET: emnet *Angående <appens navn>* i mailen — samme mønster som projektet med bundlinje i dag; det fortæller teamet hvilken løsning henvendelsen gælder
- BESLUTTET: `design-version` bumpes ikke — standarden er aldrig udgivet
- BESLUTTET: kaldet skriver bundlinjen som sit eget emne på projektets BOARD — den kræver indstillinger og arbejde på serveren, ikke kun et stylesheet

## Åbne punkter

## Indvendinger

---

## Developers noter

<Alt over denne overskrift ejes af architect. Alt herunder skrives kun af
developer, som aldrig retter i definitionen ovenfor.>

### Hvad er lavet

Grenen er `task-0015-design-footer`, oprettet fra `main` med de ucommittede filer: opgaven, BOARD og loggen. Afkrydsningerne under `Færdig når` er ikke rørt. Kriterierne punkt for punkt:

- **Sjette komponent, bundlinjen.** `plugins/agents/skills/design/assets/design.css` har en ny blok, `hjk-footer`, efter topbjælken og efter samme mønster. Den indeholder:
  - `--hjk-font-size-sm`, standardens mindste skriftstørrelse, i `--hjk-color-text-muted`
  - `--hjk-color-divider` som tynd linje over, og `--hjk-color-bg` som baggrund, så parrene *mod siden* holder
  - linket `hjk-footer__link` i `--hjk-color-primary`, understreget, med tykkere understregning ved mus over
  - fokus med `:focus-visible` i `--hjk-color-focus`, som de andre komponenter

  Ingen JavaScript, ingen nye farver og ingen selektor uden `hjk-`-klasse.
- **Farvepar.** Tabellen under `## Farvepar` i `plugins/agents/skills/design/design.md` har to nye rækker. Begge er tekstpar med krav 4,5:
  - `--hjk-color-text-muted` mod `--hjk-color-bg`: 6,80 i lys og 8,34 i mørk. Bundlinjens tekst.
  - `--hjk-color-primary` mod `--hjk-color-bg`: 6,64 i lys og 8,69 i mørk. Adressen.

  Fokus på linket dækkes af den eksisterende række `--hjk-color-focus` mod `--hjk-color-bg`. Kontrollen regner nu 29 farvepar efter, før 27. Se `Uklart` 1.
- **Teksten.** `design.md` har et nyt afsnit, `## Bundlinjen er fast`, mellem `## Komponenter` og `## Tilgængelighed`. Det siger at hver webløsning viser bundlinjen nederst på hver side, med præcis *Udviklet af TEAMNAVN. Ved udfordringer kontakt EMAIL. Version X.Y.Z*.
- **Hvor værdierne kommer fra.** Samme afsnit har en tabel der binder hver pladsholder til sin nøgle: `TEAM_NAME`, `CONTACT_EMAIL` og `APP_VERSION`. Derefter står reglerne:
  - De to første er påkrævede. De står i `.env.example` uden værdi og i compose-filen som `${NØGLE}`, og de sættes kun på stakken.
  - Appen nægter at starte når en af dem mangler eller er tom. Loggen siger hvilken nøgle, aldrig værdien.
  - `APP_VERSION` bygges ind i imaget af `docker-publish` og skrives aldrig fast. Er den tom, udelades *. Version X.Y.Z*. Den resulterende tekst står der også.
  - Værdierne læses på serveren og bages aldrig ind i en statisk fil ved build.
- **Tekst, ikke HTML, og mailto.** Afsnittet siger at værdierne sættes ind som tekst og aldrig som HTML, både i teksten og i linkets `href`. Adressen er et `mailto:`-link med emnet *Angående <appens navn>*, procentkodet, med et eksempel. Appens navn er tekst i koden.
- **Komponentafsnittet.** `design.md` har `### Bundlinje` under `## Komponenter`, med markup som de andre. Pladsholderne er `TEAMNAVN`, `EMAIL`, `APPNAVN` og `X.Y.Z`. Det siger også at bundlinjen står som sidste element i `<body>` uden for `<main>`, så den er sidens `contentinfo`. Afsnittet `## Tilgængelighed` nævner at linket er understreget, så farven ikke bærer betydningen alene.
- **Eksempelsiden.** `plugins/agents/skills/design/assets/eksempel.html` har et nyt afsnit, `Bundlinje`, med tre udgaver: med version, uden version og med fokus på adressen. Den rigtige bundlinje står nederst på siden, uden for `<main>`. Topbjælkens menu har fået et link til afsnittet. Værdierne er opdigtede:
  - team: *Team Eksempel*
  - adresse: `team@example.org`, med emnet *Angående Eksempelappen*
  - version: `1.4.2`

  Sidens egen `<style>` har en regel, så den stillestående fokusmarkering får linkets runde hjørner. Lys og mørk følger med gennem standardens variabler, men siden er ikke set; se `Hvad er ikke lavet`.
- **`/agents:design`** i `plugins/agents/skills/design/SKILL.md`:
  - Beskrivelsen og visningen i trin 2 siger seks komponenter og nævner bundlinjen. Visningen har et nyt punkt med den faste tekst og de to indstillinger.
  - Blokken til projektets `CLAUDE.md` har en fjerde linje: bundlinjen er fast, med tekst og indstillinger fra `docs/design/design.md`.
  - Trin 3 skriver to emner på BOARD: stylesheetet som før, og bundlinjen med `TEAM_NAME` og `CONTACT_EMAIL`. Der står en sætning om hvorfor bundlinjen er sit eget emne.
  - `## Du må ikke` siger også at kaldet ikke bygger bundlinjen. `LUKNING` siger to emner.
- **Tællingen.** Der står nu seks komponenter, og bundlinjen nævnes ved navn i `design.md`, i `SKILL.md` to steder, i `eksempel.html` og i `GUIDE.md`. `GUIDE.md` under `## Designstandard` siger nu også at kaldet skriver to emner på BOARD. Den har et kort afsnit om at bundlinjen er fast, med de to nøgler. Ingen andre filer uden for `docs/` tæller komponenterne.
- **Kontrollen er grøn.** `node tools/validate.mjs` svarer `OK. 13 skills, 7 agenter, 53 markdown-filer, 29 farvepar, begge manifester paa version 1.2.0.` Både `claude plugin validate ./plugins/agents` og `claude plugin validate .` består.
- **Til README** (architect): ingen nye kommandoer. `/agents:design` skriver nu to emner på BOARD og en linje mere i `CLAUDE.md`. `README.md` linje 71 siger *én linje i `CLAUDE.md` og på BOARD*. Kaldet skriver stadig ét afsnit i `CLAUDE.md`, men nu to linjer på BOARD. Komponenterne er ikke talt i README.

Intet versionsnummer er rørt: hverken manifesterne, `kontrakt-version` eller `design-version`.

### Hvad er ikke lavet, og hvorfor

- **Visuel efterprøvning.** Ingen browser er startet, så eksempelsiden er ikke set i nogen af tilstandene. Kriteriet *ser rigtig ud i begge tilstande* er derfor ikke efterprøvet; det er menneskets eller architects. Kontrasten er regnet, ikke set.
- **`/agents:design` er ikke kørt** mod et testprojekt, af samme grund som i task-0014. Kaldet kan kun prøves i en klient med en engangskopi af plugin'et.

### Uklart

1. **Ét par står nu to gange.** `--hjk-color-text-muted` mod `--hjk-color-bg` fandtes i forvejen som *Hjælpetekst på siden*. Opgaven siger at tabellen får bundlinjens par, så jeg tilføjede en ny række i stedet for at rette brugen i den gamle. De gamle rækker hører til de fem komponenter, som opgaven ikke rører. Kontrollen tæller dem som to par. Det samme gælder `--hjk-color-primary` mod `--hjk-color-bg`, som før kun stod med krav 3 som knappernes kant; nu står parret også med krav 4,5 som tekst. Begge holder 4,5 i begge tilstande. Ingen nye farver var nødvendige.
2. **Bundlinjen har sin egen baggrund**, `--hjk-color-bg`. Opgaven nævner ingen baggrund, men parrene er *mod siden*. Uden baggrund ville bundlinjen arve fladen under sig, og så gjaldt tabellens tal ikke. Lægges den på en flade, er kontrasten stadig over 4,5 (`text-muted` 7,42 og `primary` 7,24 mod `surface` i lys), men det par står ikke i tabellen.
3. **Linket har ingen farve ved mus over.** `--hjk-color-primary-hover` ville kræve et par mere i tabellen, og opgaven nævner kun linket i primærfarven. Mus over vises i stedet med en tykkere understregning.
4. **Escaping i `href`.** Opgaven siger *som tekst, aldrig som HTML*. Jeg har skrevet at det også gælder linkets `href`, fordi adressen står begge steder. Om adressen selv skal procentkodes i `mailto:`, siger dokumentet ikke. Det er kun nødvendigt for usædvanlige tegn i adressen.
