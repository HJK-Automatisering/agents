---
nummer: task-0017
titel: Kontrakten og rollerne kender ikke designstandarden
status: afsluttet
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

- [x] Kontrakten siger at et nyt projekt med en webflade bruger designstandarden fra start, og at en løsning i drift kun får den gennem en opgave mennesket har sagt ja til
- [x] Kontrakten siger hvornår et projekt er nyt, så en rolle kan afgøre det uden at spørge
- [x] Kontraktens tabeller over roller og filer kender `docs/design/`: hvem der lægger den ind, at `update` også bringer den ajour, og hvad stemplet er
- [x] Reglen om bundlinjen står i kontrakten og gælder hver webløsning, med eller uden standarden. Standardens dokument viser kun komponenten og henviser til kontrakten
- [x] `architect` gør det til et emne på BOARD, når et projekt med en webflade mangler standarden og er nyt, eller mangler bundlinjen. For en løsning i drift foreslår den standarden som et emne og bygger intet om af sig selv
- [x] `reviewer` melder det som fund når en webflade går uden om standarden, når projektets kopi af standarden er rettet, og når bundlinjen mangler eller afviger
- [x] En skitse fra `mockup` bruger standardens udseende og viser bundlinjen med opdigtede værdier, og virker stadig åbnet direkte fra disken uden netværk
- [x] Dokumenterne til mennesker siger hvad rollerne nu gør med standarden
- [x] Repoets kontrol er grøn. Advarslerne om at kontrakten og standarden er ændret uden bump, er ventede og står i noterne

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

Gren `task-0017-roles-follow-design`, fem commits. Punkt for punkt mod `Færdig når`:

1. **Nyt projekt bruger standarden, drift kun med et ja** — `plugins/agents/skills/kickoff/AGENTS.md`, nyt
   afsnit `## Webflader og designstandarden` lige efter `## Efterprøvning af en webflade`. Fed regel for
   nye projekter (`/agents:design`, `docs/design/design.md`, kopien rettes aldrig) og for løsninger i drift
   (kun gennem en opgave mennesket har sagt ja til; intet bygges om i forbifarten).
2. **Hvornår et projekt er nyt** — samme afsnit: nyt så længe der hverken findes et versionsnummer eller et
   versionstag, derefter i drift. Henviser til `## Udgivelser og versionsnumre`.
3. **Tabellerne kender `docs/design/`** — samme fil. Rækken for `update` under `## Roller og hvor de kører`
   siger nu også *opdateret designstandard i `docs/design/`*. `## Filstruktur` har en ny række efter
   `docs/workflows/`: skrives af `design` (+ `update`), læses af alle, rettes aldrig i projektet, og
   `design-version` i frontmatter i `design.md` er stemplet.
4. **Bundlinjens regel i kontrakten** — hele afsnittet er flyttet fra `plugins/agents/skills/design/design.md`
   til kontrakten som `### Bundlinjen er fast`, under det nye afsnit. Brødtekst, citat, tabel og de seks
   punkter er byte-for-byte uændrede; kun overskriftsniveauet er gået fra `##` til `###` (se *Uklart*). I
   `design.md` er `## Bundlinjen er fast` fjernet, og komponenten `### Bundlinje` har nu ét punkt der
   henviser til projektets `AGENTS.md`, `### Bundlinjen er fast` i `## Webflader og designstandarden`.
   Farveparrene for bundlinjen står uændret i tabellen.
   **Hvem gør hvad** står i kontraktafsnittet som i `## En app bag Authentik`: `architect`, `developer`,
   `reviewer`, `mockup`. Det står før `### Bundlinjen er fast`, så reglen er afsnittets sidste del.
5. **`architect`** — `plugins/agents/skills/architect/SKILL.md`, trin 1: holder et projekt med webflade op
   mod kontraktens afsnit, aflæser nyt/i drift uden at spørge, og skriver emner på BOARD: nyt uden
   `docs/design/` → læg standarden ind; i drift uden standard → foreslå den, mennesket afgør, intet bygges
   om; ingen bundlinje → emne. Står emnet der allerede, skrives det ikke igen. En opgave om bundlinjen får
   reglerne fra `### Bundlinjen er fast` i `Færdig når`, ét punkt pr. regel.
6. **`reviewer`** — `plugins/agents/agents/reviewer.md`, nyt punkt under `## Hvad du leder efter`: med
   `docs/design/` er hårdkodede farver/størrelser hvor der findes en variabel, egne regler på `hjk-`-klasser,
   egne klasser med `hjk-` og rettelser i kopien fund. En rettelse er en commit der ændrer `docs/design/`
   uden at ændre `design-version`; punktet giver de to read-only git-linjer til at finde dem. Bundlinjen holdes
   op mod kontraktens regel i alle projekter med en webflade.
7. **`mockup`** — `plugins/agents/skills/mockup/SKILL.md`, under `## Skitsen — index.html`: læs
   `../design/assets/design.css` fra skillens mappe og skriv det ind i en `<style>` (ingen `<link>`), brug
   `hjk-`-klasser og -variabler, egne regler efter standardens. Bundlinjen nederst med markup og tekst fra
   `### Bundlinje` i `../design/design.md`, opdigtet team, adresse på `example.org` og et versionsnummer;
   adressen er et `mailto:` og henter intet. Båndet *SKITSE — fiktive data* bliver. Mangler filen: eget
   udseende, skrevet under `## Gæt`.
8. **Dokumenter til mennesker** — `GUIDE.md`, `## Designstandard`: nyt afsnit om nye projekter kontra drift
   og hvad `architect` og `reviewer` gør; afsnittet om bundlinjen siger nu at den gælder hver webløsning, at
   reglen står i kontrakten, og hvad rollerne gør. Under `## Til konsulenter` et punkt om at skitsen bruger
   standarden og viser bundlinjen.
   **Til `README.md`** (ikke rørt): forslag til rækken for `plugins/agents/skills/design/` i strukturtabellen,
   eller en linje under rolleoversigten: *"Nye projekter med en webflade bruger designstandarden fra start;
   løsninger i drift får den kun tilbudt. Bundlinjen gælder alle webløsninger, og reglen står i kontrakten.
   Skitser fra `/agents:mockup` bruger standarden, og `/agents:reviewer` melder webflader der går uden om
   den."* Ingen nye kommandoer eller indstillinger.
9. **Kontrollen** — `node tools/validate.mjs` er grøn (`OK. 13 skills, 7 agenter, 55 markdown-filer, 29
   farvepar, begge manifester paa version 1.3.0`, exit 0), med de to ventede advarsler: kontrakten er
   ændret uden bump af `kontrakt-version` (står på 23), og `design.md` er ændret uden bump af
   `design-version` (står på 1). Begge er regelændringer, så bumpene bør tilbydes når grenen lukkes.
   `claude plugin validate ./plugins/agents` er også grøn.

Ingen browser er startet. Ingen versionsnumre er rørt.

### Hvad er ikke lavet, og hvorfor

- **`design.css` har en forældet kommentar** (`plugins/agents/skills/design/assets/design.css:508`): *"se
  Bundlinjen er fast i design.md"*. Afsnittet findes ikke længere dér. Filen er under *Hvad vi ikke rører*.
  Kommentaren kommer også med ind i hver skitse, fordi `mockup` skriver filen ind uændret. Fund.
- **`design`-skillens `CLAUDE.md`-blok** (`plugins/agents/skills/design/SKILL.md:60`) siger *"med den tekst
  og de indstillinger `docs/design/design.md` siger"*. Indstillingerne står nu i kontrakten. Skillen er ikke
  nævnt i opgaven, så jeg har ikke rettet den. Fund.
- **`update`** (`plugins/agents/skills/update/SKILL.md:186`) nævner *"en ny regel for bundlinjen"* som noget
  der læses ud af forskellen i `design.md`. Reglen ændres nu i kontrakten og kommer gennem del 1. `update` er
  under *Hvad vi ikke rører*. Fund.
- **Rolletabellen har ingen række for `design`**, som den har for `workflow` og `update`. Opgaven bad kun om
  rækken for `update` og om en række i `## Filstruktur`, hvor `design` nu står som den der lægger
  `docs/design/` ind. Jeg har ikke tilføjet en rolle-række.
- `AGENTS.md` i roden er ikke rørt, som opgaven siger. Den er dermed en udgave bagud i forhold til skabelonen.
- `README.md` er ikke rørt; forslaget står ovenfor.

### Uklart

- **Overskriftsniveauet.** Afsnittet hed `## Bundlinjen er fast` i `design.md`. I kontrakten står det som
  `### Bundlinjen er fast` under `## Webflader og designstandarden`, fordi opgaven lægger det ind i det nye
  afsnit. Teksten er uændret. Skal det være et selvstændigt `##`-afsnit, er det en ændring af ét tegn plus
  henvisningerne i `architect`, `reviewer` og `design.md`.
- **Én sætning i den flyttede tekst peger nu forkert:** *"Markup står under `### Bundlinje`."* I kontrakten
  findes der ingen `### Bundlinje`; den ligger i `docs/design/design.md`, og i et projekt uden standarden
  findes den slet ikke. Jeg har ladet sætningen stå ordret, fordi teksten ikke måtte ændres. Forslag:
  *"Markup står under `### Bundlinje` i `docs/design/design.md`."*
- **`mockup` læser plugin'ets `design.css`, ikke projektets kopi.** Opgaven siger skillens egen mappe, og
  det har jeg fulgt. I et projekt med en ældre `docs/design/` kan skitsen dermed se ud som en nyere udgave
  end appen. Jeg har ikke tilføjet noget om det.
