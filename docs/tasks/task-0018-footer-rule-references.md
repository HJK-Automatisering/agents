---
nummer: task-0018
titel: Henvisningerne til bundlinjens regel peger stadig på standardens dokument
status: i-gang
kilde: interview
oprettet: 2026-11-12
---

# task-0018 — Henvisningerne til bundlinjens regel peger stadig på standardens dokument

## Hvad og hvorfor

task-0017 flyttede reglen om bundlinjen fra designstandardens `design.md` til kontrakten. Fire
steder peger stadig på det gamle sted, og to af dem kopieres ud i projekterne: kommentaren i
`design.css` kommer med i hver skitse, og teksten `/agents:design` skriver i projektets
`CLAUDE.md` sender en model hen til et afsnit der ikke findes. Det skal være rettet før
standarden og kontrakten udgives med den nye placering.

## Færdig når

- [ ] Intet sted i plugin'et siger at bundlinjens tekst, nøgler eller regler står i standardens dokument. De peger på kontraktens afsnit om bundlinjen
- [ ] Kontraktens afsnit om bundlinjen siger hvor komponentens markup står, så det også giver mening i et projekt uden standarden
- [ ] Det `/agents:design` skriver i projektets `CLAUDE.md`, peger på kontrakten for bundlinjen
- [ ] `/agents:update` siger at nye regler for bundlinjen kommer med kontrakten, ikke med standarden
- [ ] Repoets kontrol er grøn. Advarslerne om de to stempler er ventede

## Sådan bygger vi det

Fire rettelser, intet andet:

1. **`plugins/agents/skills/design/assets/design.css`**, kommentaren over `hjk-footer` (omkring
   linje 508): peg på kontraktens `### Bundlinjen er fast` i projektets `AGENTS.md`.
2. **`plugins/agents/skills/kickoff/AGENTS.md`**, sætningen *"Markup står under `### Bundlinje`."*
   i `### Bundlinjen er fast`: skriv *"Markup står under `### Bundlinje` i `docs/design/design.md`,
   når projektet har standarden."*
3. **`plugins/agents/skills/design/SKILL.md`**, den tekst kaldet skriver i projektets `CLAUDE.md`
   (omkring linje 60): bundlinjens tekst og indstillinger står i kontrakten, `AGENTS.md`, under
   `### Bundlinjen er fast`.
4. **`plugins/agents/skills/update/SKILL.md`**: hvor del 3 siger at nye regler for bundlinjen kan
   læses af standardens dokument, skal der stå at de kommer med kontrakten i del 1.

Søg bagefter efter `Bundlinjen er fast` og `bundlinje` i `plugins/` for at se at intet andet sted
peger forkert. Finder du flere, ret dem efter samme regel og nævn dem i noterne.

## Hvad vi ikke rører

- Bundlinjens tekst, nøgler og regler
- Farver, komponenter og øvrige regler i `design.css`
- `kontrakt-version` og `design-version`. Bumpene tilbydes når grenen lukkes, sammen med task-0017s
- `AGENTS.md` i roden og versionsnumrene i manifesterne

## Afhænger af

task-0017

## Beslutninger

- BESLUTTET: et eget nummer frem for at genåbne task-0017 — en afsluttet opgave genåbnes ikke, og filerne stod under *Hvad vi ikke rører*
- BESLUTTET: `### Bundlinjen er fast` bliver et underafsnit i kontrakten — reglen hører til afsnittet om webflader, og henvisningerne er skrevet til det niveau
- BESLUTTET: `mockup` læser fortsat plugin'ets `design.css` og ikke projektets kopi — skitsen skal virke også uden et opsat projekt, og en kopi der er bagud, siger hooken til om

## Åbne punkter

## Indvendinger

---

## Developers noter

<Alt over denne overskrift ejes af architect. Alt herunder skrives kun af
developer, som aldrig retter i definitionen ovenfor.>

### Hvad er lavet

Fire rettelser, én commit hver. Bundlinjens tekst, nøgler og regler er ikke rørt.

1. `plugins/agents/skills/design/assets/design.css`, kommentaren over `hjk-footer`: peger nu på
   *Bundlinjen er fast i projektets AGENTS.md* i stedet for `design.md`. Holdt i ASCII som resten
   af filens kommentarer. Ingen regler eller farver er ændret.
   → Færdig når, punkt 1.
2. `plugins/agents/skills/kickoff/AGENTS.md` (skabelonen), `### Bundlinjen er fast`: sætningen er
   nu ordret *"Markup står under `### Bundlinje` i `docs/design/design.md`, når projektet har
   standarden."* → Færdig når, punkt 2.
3. `plugins/agents/skills/design/SKILL.md`, afsnittet kaldet skriver i projektets `CLAUDE.md`:
   sidste linje er nu *"Bundlinjen er fast på hver side. Dens tekst og indstillinger står i
   kontrakten, `AGENTS.md`, under `### Bundlinjen er fast`."* → Færdig når, punkt 3.
4. `plugins/agents/skills/update/SKILL.md`, rapportafsnittet om designstandarden (det er dér
   del 3s rapport står, ikke i selve del 3): *"en ny regel for bundlinjen"* er taget ud af listen
   over hvad der kan læses af `design.md`, og der står nu at nye regler for bundlinjen kommer med
   kontrakten i del 1 og siges sammen med kontraktens ændringer. → Færdig når, punkt 4.
5. `node tools/validate.mjs`: grøn. To advarsler, begge ventede: `kontrakt-version` står på 23
   og `design-version` på 1, selv om filerne har flyttet sig. Intet stempel eller manifest er
   bumpet. → Færdig når, punkt 5.

Søgningen efter `Bundlinjen er fast` og `bundlinje` i `plugins/` fandt ingen andre steder der
siger at tekst, nøgler eller regler står i standardens dokument. `reviewer.md`, `architect/SKILL.md`
og `design.md` peger allerede på kontrakten. `mockup/SKILL.md` nævnes under *Uklart*.

Ingen nye kommandoer eller indstillinger.

### Hvad er ikke lavet, og hvorfor

intet

### Uklart

- `plugins/agents/skills/mockup/SKILL.md` linje 79 siger at bundlinjen laves *"med markup og
  tekst som under `### Bundlinje` i `../design/design.md`"*. Det er en henvisning til markup, som
  stadig står dér, og teksten er en del af markuppen — så jeg har læst det som en markup-henvisning
  og ikke rettet det. Det er også i tråd med beslutningen om at `mockup` læser plugin'ets filer,
  ikke projektets. Læses *"og tekst"* derimod som at teksten står i standardens dokument, rammer
  det punkt 1 i Færdig når; så er rettelsen at skrive *"med markup som under …"* og pege på
  `### Bundlinjen er fast` i `../kickoff/AGENTS.md` for teksten. Det er ikke gjort.
- Commit-rækkefølgen: kommentaren i `design.css` blev committet før statussen blev sat til
  `i-gang` (commit `15c15ca` før `f2ba209`). Ingen betydning for indholdet.
