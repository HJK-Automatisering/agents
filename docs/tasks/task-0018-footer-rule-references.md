---
nummer: task-0018
titel: Henvisningerne til bundlinjens regel peger stadig på standardens dokument
status: planlagt
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
### Hvad er ikke lavet, og hvorfor
### Uklart
