---
nummer: task-0017
titel: Kontrakten og rollerne kender ikke designstandarden
status: i-gang
kilde: interview
oprettet: 2026-11-12
---

# task-0017 — Kontrakten og rollerne kender ikke designstandarden

## Hvad og hvorfor

Designstandarden findes, men ingen rolle ved at den skal bruges. Et nyt projekt med en webflade
får ikke standarden af sig selv, skitser ser ud som de altid har gjort, og en gennemgang ser ikke
når en webflade går uden om standarden. Bundlinjen skal stå i alle webløsninger — også dem i
drift uden standarden — men reglen står i dag kun i standardens eget dokument, som et projekt
uden standarden ikke har.

## Færdig når

- [ ] Kontrakten siger at et nyt projekt med en webflade bruger designstandarden fra start, og at en løsning i drift kun får den gennem en opgave mennesket har sagt ja til
- [ ] Kontrakten siger hvornår et projekt er nyt, så en rolle kan afgøre det uden at spørge
- [ ] Kontraktens tabeller over roller og filer kender `docs/design/`: hvem der lægger den ind, at `update` også bringer den ajour, og hvad stemplet er
- [ ] Reglen om bundlinjen står i kontrakten og gælder hver webløsning, med eller uden standarden. Standardens dokument viser kun komponenten og henviser til kontrakten
- [ ] `architect` gør det til et emne på BOARD, når et projekt med en webflade mangler standarden og er nyt, eller mangler bundlinjen. For en løsning i drift foreslår den standarden som et emne og bygger intet om af sig selv
- [ ] `reviewer` melder det som fund når en webflade går uden om standarden, når projektets kopi af standarden er rettet, og når bundlinjen mangler eller afviger
- [ ] En skitse fra `mockup` bruger standardens udseende og viser bundlinjen med opdigtede værdier, og virker stadig åbnet direkte fra disken uden netværk
- [ ] Dokumenterne til mennesker siger hvad rollerne nu gør med standarden
- [ ] Repoets kontrol er grøn. Advarslerne om at kontrakten og standarden er ændret uden bump, er ventede og står i noterne

## Sådan bygger vi det

**Kontraktskabelonen** er `plugins/agents/skills/kickoff/AGENTS.md`, ikke `AGENTS.md` i roden. Et nyt
afsnit, `## Webflader og designstandarden`, lige efter `## Efterprøvning af en webflade`. Det siger:

- Et nyt projekt med en webflade bruger den fælles designstandard. Den lægges ind med
  `/agents:design`, og reglerne for udseendet står i `docs/design/design.md`.
- **Et projekt er nyt indtil sin første udgivelse** — der findes intet versionsnummer og intet
  versionstag. Derefter er det i drift.
- En løsning i drift får standarden kun gennem en opgave mennesket har sagt ja til. Ingen rolle
  bygger udseendet om i forbifarten.
- **Bundlinjen** gælder hver webløsning. Flyt hele afsnittet `## Bundlinjen er fast` fra
  `plugins/agents/skills/design/design.md` hertil, med teksten, nøglerne og reglerne uændrede.
  I `design.md` står kun komponenten `### Bundlinje` tilbage, med én linje der henviser til
  kontraktens afsnit.
- Hvem gør hvad, kort, som i `## En app bag Authentik`: `architect`, `developer`, `reviewer`, `mockup`.

Ret også kontraktens to tabeller: rækken for `update` under `## Roller og hvor de kører`, der i dag
kun nævner kontrakten og workflow-kopierne, og `## Filstruktur`, der skal have en række for
`docs/design/` som rækken for `docs/workflows/`.

**`architect`**, `plugins/agents/skills/architect/SKILL.md`, trin 1: har projektet en webflade, så
holder den det op mod afsnittet. Nyt projekt uden `docs/design/`: emne om at lægge standarden
ind. I drift uden standarden: emne der foreslår den — mennesket afgør. Ingen bundlinje: emne.
Skriver den en opgave om bundlinjen, står kontraktens regel i `Færdig når`.

**`reviewer`**, `plugins/agents/agents/reviewer.md`, under `## Hvad du leder efter`, et punkt om
designstandarden. Har projektet `docs/design/`: farver og størrelser skrevet direkte hvor der
findes en variabel, egne regler på `hjk-`-klasser, egne klasser med præfikset `hjk-`, og rettelser
i kopien. En rettelse i kopien er en commit der ændrer filerne i `docs/design/` uden at ændre
`design-version`. Bundlinjen holdes op mod kontraktens regel i alle projekter med en webflade.

**`mockup`**, `plugins/agents/skills/mockup/SKILL.md`, under `## Skitsen — index.html`: skitsen
bruger standarden. Læs `../design/assets/design.css` fra skillens egen mappe og skriv indholdet ind
i en `<style>` i `index.html` — skitsen er stadig én fil uden netværk. Brug standardens klasser og
vis bundlinjen nederst med opdigtede værdier og en adresse på `example.org`. Båndet *SKITSE —
fiktive data* er skitsens eget og bliver. Findes filen ikke, laver skitsen sit eget udseende og
skriver det under `## Gæt` — et møde må ikke gå i stå på en manglende fil.

**Dokumenterne:** `GUIDE.md` og `README.md`'s beskrivelse af rollerne, hvor de nævner skitser,
gennemgang eller standarden. `README.md` retter architect.

## Hvad vi ikke rører

- `kontrakt-version` og `design-version`. Bumpene er menneskets og tilbydes når grenen lukkes
- Standardens farver, komponenter og `design.css`
- `AGENTS.md` i roden
- `developer`, `tester`, `security`, `debugger`, `scout`, `status`, `kickoff`, `workflow` og `update`
- Hooken og kontrollen
- Versionsnumrene i begge manifester

## Afhænger af

task-0016 — `design.md` ændres her, og projekterne kan kun få ændringen når `/agents:update` kender standarden.

## Beslutninger

- BESLUTTET: krav for nye løsninger, tilbud for dem i drift; bundlinjen er et krav for alle — mennesket valgte. Afvist: krav for alle, fordi det bygger løsninger i drift om uden en beslutning
- BESLUTTET: et projekt er nyt indtil sin første udgivelse — det kan aflæses uden at spørge, og kontrakten har allerede reglerne for versionsnumre
- BESLUTTET: bundlinjens regel flyttes til kontrakten, og standarden henviser dertil. Den skal kunne læses i et projekt uden standarden. Afvist: at have teksten begge steder, som driver; og at lade `architect` læse den i plugin'et, fordi `reviewer` ikke kan
- BESLUTTET: `mockup` skriver standarden ind i skitsen frem for at henvise til den — skitsen skal være én fil der virker uden netværk
- BESLUTTET: `mockup` falder tilbage på sit eget udseende hvis standarden ikke findes, og skriver det som et gæt — et møde må ikke gå i stå
- BESLUTTET: `kickoff` røres ikke; `architect` ser et nyt projekt med en webflade i sit første trin og gør standarden til et emne

## Åbne punkter

## Indvendinger

---

## Developers noter

<Alt over denne overskrift ejes af architect. Alt herunder skrives kun af
developer, som aldrig retter i definitionen ovenfor.>

### Hvad er lavet
### Hvad er ikke lavet, og hvorfor
### Uklart
