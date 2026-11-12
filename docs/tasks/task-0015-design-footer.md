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
### Hvad er ikke lavet, og hvorfor
### Uklart
