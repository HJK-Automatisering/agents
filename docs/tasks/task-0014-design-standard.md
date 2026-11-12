---
nummer: task-0014
titel: En fælles designstandard for webløsninger, og et kald der lægger den ind
status: afsluttet
kilde: interview
oprettet: 2026-11-12
---

# task-0014 — En fælles designstandard for webløsninger, og et kald der lægger den ind

## Hvad og hvorfor

Hvert projekt med en webflade finder i dag selv på farver, skrift og komponenter. Løsningerne
ligner ikke hinanden, og kontrasten er ikke kontrolleret nogen steder, selvom offentlige
løsninger skal leve op til WCAG 2.1 AA. Opgaven laver én standard til lys og mørk tilstand og
et kald, `/agents:design`, der lægger den ind i et projekt. At kontrakten og rollerne følger
standarden, er sit eget emne bagefter.

## Færdig når

- [x] Der findes én standard med grundværdier — farver, skriftstørrelser, afstande, hjørner og fokusmarkering — og fem komponenter: knap, formularfelt, tabel, besked og topbjælke
- [x] Standarden virker i lys og mørk tilstand. Den følger maskinens indstilling, og en side kan overstyre den
- [x] Komponenterne er ren CSS. De virker uden JavaScript, og de rammer kun elementer der har standardens egne klassenavne
- [x] Hvert farvepar standarden lover, står i dens dokument med sit kontrastforhold i begge tilstande, og alle lever op til WCAG 2.1 AA
- [x] Repoets kontrol beregner selv kontrasten for de par og fejler hvis ét falder under kravet
- [x] Der findes en eksempelside med alle fem komponenter i alle deres tilstande, som virker åbnet direkte fra disken uden netværk, og som kan skifte mellem lys og mørk
- [x] Mennesket har set eksempelsiden i begge tilstande og godkendt paletten
- [x] `/agents:design` lægger standarden ind i et projekt der er sat op, overskriver aldrig noget, nævner den i projektets `CLAUDE.md`, og sætter et emne på projektets BOARD om at appen skal kobles på
- [x] Dokumenterne der tæller kaldene eller viser træet, passer med det nye kald
- [x] Repoets kontrol er grøn

## Sådan bygger vi det

**Placering.** Alt ligger i en ny skill-mappe, `plugins/agents/skills/design/`, efter mønstret fra
`workflow`, der ejer sine skabeloner:

| Fil | Hvad |
|---|---|
| `SKILL.md` | Kaldet |
| `design.md` | Standardens dokument, med `design-version: 1` i frontmatter |
| `assets/design.css` | Grundværdier og komponenter |
| `assets/eksempel.html` | Eksempelsiden. Henter `design.css` med en relativ sti |

**Paletten** er vores egen, lavet til skærm. Kommunens udtryk er inspiration, ikke kilde. Den er
rolig og neutral, med én primærfarve og fire beskedfarver: fejl, advarsel, succes og info.
Foreslå den; mennesket godkender den på eksempelsiden. Intet logo, ingen kommunenavne og
ingen rigtige data på siden — repoet er offentligt. Topbjælken viser et opdigtet appnavn.

**`design.css`:**

- CSS-variabler med semantiske navne på engelsk. **Alle variabler og klasser har præfikset
  `hjk-`**, så de ikke støder ind i et frameworks egne. Komponenterne styler kun deres egne
  klasser, aldrig `button`, `input` eller `table` direkte.
- Farver skrives som hex, så kontrollen kan læse dem.
- Lys tilstand er standard. Mørk kommer med `prefers-color-scheme: dark`. En side overstyrer
  med `data-theme="light"` eller `data-theme="dark"` på `<html>`, og overstyringen vinder i
  begge retninger.
- Systemets skrifttyper. Intet hentes udefra: ingen skrifttyper, ingen billeder, ingen `@import`.
- Fokus vises med `:focus-visible` og lever op til 3:1 mod baggrunden.
- Komponenternes tilstande: knap (primær, sekundær, fare, deaktiveret), formularfelt
  (normal, fokus, fejl med tekst, deaktiveret), tabel (hoved, rækker, smal skærm), besked
  (fejl, advarsel, succes, info), topbjælke (appnavn og navigation).

**`design.md`** siger til en model i et fremmed projekt: hvad standarden er, at projektets
kopi aldrig rettes — projektets egne regler står i en fil for sig — og hvordan lys og mørk
virker. Den har en tabel over farveparrene: forgrund, baggrund, og forholdet i hver tilstand.
Krav: 4,5:1 for tekst, 3:1 for komponentkanter og fokus. Tabellen er det kontrollen læser.

**Kontrollen** i `tools/validate.mjs`: læs parrene i tabellen, find værdierne i `design.css` for
lys og mørk, beregn forholdet efter WCAG 2.1, og fejl ved et par under kravet, ved en variabel
der ikke findes, og ved et forhold i tabellen der ikke passer med det beregnede.

**`SKILL.md`** bygges efter `plugins/agents/skills/workflow/SKILL.md`:

- `disable-model-invocation: true`. Kaldet foreslår ikke sig selv.
- Findes `AGENTS.md` ikke i projektet: `kør /agents:kickoff først`, og stop.
- Vis i få linjer hvad standarden er, og spørg ja eller nej.
- Ved ja: kopiér `design.md`, `assets/design.css` og `assets/eksempel.html` til `docs/design/`.
  Findes en af filerne, overskriver du ingenting — sig det og stop.
- Nævn standarden i projektets `CLAUDE.md` under `## Designstandard`. Opret afsnittet hvis det
  mangler.
- Skriv ét emne på projektets `docs/BOARD.md` under `## Kommende`: at appen skal bruge
  `docs/design/design.css`, direkte eller kopieret ved build, uden at rette i den.
- Kaldet ændrer ikke kode og kobler ikke selv standarden på appen.
- Luk med `LUKNING`-blokken.

**Dokumenterne:** `CLAUDE.md` i roden (antal skills og hjælpekald), træet i `PLUGIN.md`, og et
afsnit om kaldet i `GUIDE.md`. `README.md` retter architect.

## Hvad vi ikke rører

- Kontrakten — hverken `plugins/agents/skills/kickoff/AGENTS.md` eller `AGENTS.md` i roden
- `mockup`, `reviewer` og de øvrige roller
- Hooken og `update`. At de kender `design-version`, hører til næste emne
- `workflow` og dens skabeloner
- Versionsnumrene i begge manifester
- `docs/projekt.md`, som ejes af `kickoff`

## Afhænger af

intet

## Beslutninger

- BESLUTTET: standarden leveres først, rollerne binder sig til den bagefter — mennesket valgte. Afvist: en ny rolle der retter kode, fordi den går uden om navet
- BESLUTTET: egen palet til skærm, med kommunens udtryk som inspiration — mennesket valgte
- BESLUTTET: grundværdier og fem komponenter, ren CSS — mennesket valgte
- BESLUTTET: eget kald, `/agents:design`, som kun lægges ind i projekter med en webflade — mennesket valgte. Afvist: `kickoff` i alle projekter, og at blande det ind i `workflow`
- BESLUTTET: CSS-variabler uafhængigt af framework, maskinens lys/mørk-indstilling med overstyring, systemets skrifttyper
- BESLUTTET: præfikset `hjk-` på alt og kun egne klasser — så standarden kan stå ved siden af et framework uden at ændre dets elementer. Det er allerede et offentligt navn i kataloget
- BESLUTTET: kontrollen beregner kontrasten — ellers er WCAG-løftet en påstand, der brydes i tavshed ved næste farveændring
- BESLUTTET: kaldet kobler ikke standarden på appen, men skriver et emne — som `workflow` gør med sine forudsætninger. Hvordan CSS'en når appen, afhænger af stakken
- BESLUTTET: kaldet og standarden er i samme opgave — en skill-mappe uden `SKILL.md` får kontrollen til at fejle

## Åbne punkter

## Indvendinger

---

## Developers noter

### Hvad er lavet

Grenen er `task-0014-design-standard`, oprettet fra `main` med de ucommittede opgavefiler. Afkrydsningerne under `Færdig når` er ikke rørt; de står over delelinjen. Her er kriterierne punkt for punkt:

- **Standarden med grundværdier og fem komponenter.** `plugins/agents/skills/design/assets/design.css` har farver, skriftstørrelser, afstande, hjørner, kantbredder og fokus som CSS-variabler, og komponenterne knap, formularfelt, tabel, besked og topbjælke. Tilstandene er dem opgaven nævner:
  - knap: primær, sekundær, fare og deaktiveret
  - felt: normal, fokus, fejl med tekst og deaktiveret
  - tabel: hoved, rækker og smal skærm
  - besked: fejl, advarsel, succes og info
  - topbjælke: appnavn og navigation med `aria-current`
- **Lys og mørk.** Lys står på `:root`. Mørk står under `@media (prefers-color-scheme: dark)` på `:root:not([data-theme="light"])`, og igen på `:root[data-theme="dark"]`. `data-theme` vinder derfor i begge retninger. Variablen `--hjk-color-scheme` sætter `color-scheme` på standardens egne klasser og på `.hjk-page`, ikke på `:root`.
- **Ren CSS, kun egne klasser.** Ingen selektor har et element uden `hjk-`-klasse som mål. Tabellens celler har derfor `hjk-table__header`, `hjk-table__cell` og `hjk-table__caption`; se `Uklart` 1. Der er intet `@import`, ingen `url()` og ingen skrifttyper udefra, kun systemets skrifttyper. Fokus vises med `:focus-visible`.
- **Farvepar med kontrastforhold.** `plugins/agents/skills/design/design.md` har `design-version: 1` i frontmatter. Dokumentet siger at kopien aldrig rettes, og at projektets egne regler står i appens eget stylesheet. Det forklarer også lys og mørk, med en tabel over de tre tilfælde, og har grundværdier, komponenter med markup og et afsnit om tilgængelighed. Tabellen under `## Farvepar` har 27 par: 18 tekstpar med krav 4,5 og 9 par for kanter og fokus med krav 3. Hvert par har sit forhold i lys og mørk, med to decimaler, rundet ned. Det laveste er formularfeltets kant mod siden i lys: 3,56.
- **Kontrollen beregner kontrasten.** Der er et nyt afsnit 13 i `tools/validate.mjs`. Det læser tabellen, finder værdierne i `design.css` og regner luminans efter WCAG 2.1 med tærsklen 0,03928. Det fejler i seks tilfælde:
  - et par under kravet
  - en variabel der ikke findes
  - et tal i tabellen der ikke passer med det beregnede
  - en farve der ikke er hex
  - et krav der hverken er 4,5 eller 3
  - to mørke blokke der ikke er ens; se `Uklart` 4

  OK-linjen tæller nu også farvepar. Kontrollen er prøvet på en engangskopi med alle seks fejl lagt ind, og hver gav sin fejl.
- **Eksempelsiden** er `plugins/agents/skills/design/assets/eksempel.html`. Den henter `design.css` med den relative sti `design.css`, så den virker både i plugin'et og i `docs/design/` i et projekt. Den indeholder:
  - alle fem komponenter i alle deres tilstande, også på en flade
  - en tabel og en topbjælke i en smal ramme
  - en farveoversigt der viser hex-værdien for den tilstand der vises
  - et skift mellem *Følg maskinen*, *Lys* og *Mørk*

  Skiftet og hex-visningen er et lille indlejret script; komponenterne bruger ikke JavaScript. Fokus vises også stillestående, med en klasse der kun findes i sidens egen `<style>`. Appnavnet er *Eksempelappen*. Data er opdigtede lokalebestillinger uden navne på personer eller steder, og der er intet logo.
- **Mennesket godkender paletten.** Ikke afkrydset; det er menneskets. Åbn `plugins/agents/skills/design/assets/eksempel.html` direkte fra disken. Paletten er foreslået sådan:

  | Variabel `--hjk-color-` | Lys | Mørk |
  |---|---|---|
  | `bg` | `#f4f5f7` | `#121417` |
  | `surface` | `#ffffff` | `#1b1e23` |
  | `surface-alt` | `#e9ecf0` | `#252a31` |
  | `text` | `#1b2028` | `#e6e8eb` |
  | `text-muted` | `#4d5663` | `#a8afb9` |
  | `border` | `#79828f` | `#7d8796` |
  | `divider` | `#d3d8de` | `#353b44` |
  | `primary` | `#1d5b87` | `#7fb8e6` |
  | `primary-hover` | `#164769` | `#a6cef0` |
  | `on-primary` | `#ffffff` | `#0c1a26` |
  | `danger` | `#b42318` | `#f09a92` |
  | `danger-hover` | `#8e1b12` | `#f5bab4` |
  | `on-danger` | `#ffffff` | `#2a0b08` |
  | `focus` | `#1d5b87` | `#8fc6ff` |
  | `error-text` / `-bg` / `-border` | `#8a1c14` / `#fdecea` / `#c0362c` | `#ffb3ab` / `#3a1613` / `#e8695f` |
  | `warning-text` / `-bg` | `#6a4700` / `#fff3d1` | `#ffd98a` / `#372a0a` |
  | `success-text` / `-bg` | `#1d5a2c` / `#e5f3e9` | `#9fd8ad` / `#132e1b` |
  | `info-text` / `-bg` | `#1c4d78` / `#e6eff8` | `#a9cdf0` / `#11273b` |
  | `topbar-bg` / `-text` / `-focus` | `#1f2d3d` / `#ffffff` / `#9ecbff` | `#0b0d10` / `#e6e8eb` / `#8fc6ff` |
  | `disabled-bg` / `-text` / `-border` | `#e4e7eb` / `#6f7782` / `#c4c9d0` | `#2a2e35` / `#8a929d` / `#3d434c` |

  Primærfarven er en dæmpet stålblå. Fladerne er neutrale grå med et strejf af blå. Topbjælken er mørk skifer i lys tilstand.
- **`/agents:design`** er `plugins/agents/skills/design/SKILL.md`, bygget efter `workflow` og med `disable-model-invocation: true`. Kaldet gør dette:
  - Mangler `AGENTS.md`, siger det `kør /agents:kickoff først` og stopper.
  - Findes en af de tre filer i `docs/design/` allerede, stopper det før spørgsmålet og igen før kopieringen.
  - Det viser standarden i fem linjer og spørger ja eller nej. Ja foreslås kun når projektet har en webflade.
  - Det kopierer filerne uændret med en filkopi.
  - Det opretter `## Designstandard` i `CLAUDE.md` hvis afsnittet mangler, med en fast tekst på tre linjer.
  - Det skriver ét emne under `## Kommende` på BOARD.
  - Det ændrer ingen kode, kobler ikke standarden på appen og lukker med `LUKNING`.
- **Dokumenterne:**
  - `CLAUDE.md`: tretten skills, tretten kald, tre hjælpekald.
  - `PLUGIN.md`: `design/` står i træet med sine fire filer. Tællingen er rettet fire steder, og listen over hvad `validate.mjs` kontrollerer, nævner nu kontrasten.
  - `GUIDE.md`: tællingen er rettet, kaldet står blandt hjælpekaldene, der er et nyt afsnit `## Designstandard`, og snydearket har en linje.
  - `OPSAETNING.md`: tællingen "alle tolv kald" er rettet til tretten. Filen står ikke på opgavens liste, men den tæller kaldene.
- **Kontrollen er grøn.** `node tools/validate.mjs` svarer `OK. 13 skills, 7 agenter, 52 markdown-filer, 27 farvepar, begge manifester paa version 1.2.0.` Både `claude plugin validate ./plugins/agents` og `claude plugin validate .` består.
- **Til README** (architect): der er et nyt kald, `/agents:design`. `README.md` siger stadig "tolv kald" i overskriften `## De ti roller, tolv kald` på linje 51. Linje 82 siger "De tolv kald. Fem kører i din tråd, syv er dispatch-skills"; med `design` er det tretten kald, og seks kører i brugerens tråd.

Intet versionsnummer er rørt, hverken i manifesterne eller i kontrakten.

### Hvad er ikke lavet, og hvorfor

- **Godkendelsen af paletten** er menneskets og er ikke afkrydset.
- **Visuel efterprøvning.** Ingen browser er startet, så farver, layout og skiftet mellem lys og mørk er ikke set med øjne. Kontrasten er regnet, ikke set. Eksempelsiden er ikke åbnet.
- **`/agents:design` er ikke kørt** mod et testprojekt. Kaldet er tekst til en model og kan kun prøves i en klient med en engangskopi af plugin'et, som `PLUGIN.md` beskriver. Det er uden for hvad en agent kan uden at starte en klientsession.
- **Hooken, `update` og en advarsel om `design-version`** er ikke lavet; opgaven udskyder dem til næste emne. Se fundet under `Uklart` 7.

### Uklart

1. **Tabellens celler har egne klasser.** Kriteriet siger at komponenterne kun rammer elementer med standardens egne klassenavne. Jeg har læst det bogstaveligt: hver `th` og `td` bærer `hjk-table__header` eller `hjk-table__cell`. Det koster en klasse pr. celle i markup. Alternativet var `.hjk-table td`, som kun rammer celler inde i en `hjk-table` og er lettere at skrive, men ikke opfylder kriteriet ordret. Den eneste selektor med et element uden klasse er `tr:last-child > .hjk-table__cell`; målet er stadig cellen med klassen.
2. **BOARD-emnet har ingen filsti.** Opgaven formulerer emnet med `docs/design/design.css`, men BOARD tillader ikke filstier i tabellerne. Kaldet skriver derfor "designstandardens stylesheet" og siger udtrykkeligt: uden filsti.
3. **Kaldet stopper hvis `CLAUDE.md` mangler.** Opgaven siger ikke hvad der skal ske. Jeg valgte at stoppe før kopieringen i stedet for at oprette en fil `kickoff` ejer.
4. **Mørk tilstand står to gange i `design.css`,** fordi både maskinens indstilling og `data-theme="dark"` skal give mørk. Ren CSS kan ikke det uden gentagelse, medmindre man bruger `light-dark()`, som først kom i browserne i 2024. Kontrollen fejler derfor også når de to mørke blokke er uens. Ellers ville den kun efterprøve den ene. Det er en fejlregel mere end opgaven nævner.
5. **Smal skærm løses med vandret rulning** inden i `hjk-table-wrap`, ikke med rækker der stables til kort. Stabling bryder tabelbetydningen for skærmlæsere i nogle browsere og kræver en `data-label` på hver celle.
6. **Deaktiverede farver står ikke i tabellen,** fordi WCAG 2.1 undtager inaktive komponenter fra kontrastkravet. Det står i `design.md`. Skal de alligevel loves, er det tre par mere.
7. **Fund.** Der er ingen advarsel i `tools/validate.mjs`, og ingen regel i `CLAUDE.md`, når standardens filer ændres uden at `design-version` bumpes, sådan som der er for `skabelon-version`. Opgaven nævner kun hooken og `update` som næste emne. Om advarslen hører med dér, eller er sit eget emne, er architects afgørelse.
