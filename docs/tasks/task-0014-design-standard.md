---
nummer: task-0014
titel: En fælles designstandard for webløsninger, og et kald der lægger den ind
status: i-gang
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

- [ ] Der findes én standard med grundværdier — farver, skriftstørrelser, afstande, hjørner og fokusmarkering — og fem komponenter: knap, formularfelt, tabel, besked og topbjælke
- [ ] Standarden virker i lys og mørk tilstand. Den følger maskinens indstilling, og en side kan overstyre den
- [ ] Komponenterne er ren CSS. De virker uden JavaScript, og de rammer kun elementer der har standardens egne klassenavne
- [ ] Hvert farvepar standarden lover, står i dens dokument med sit kontrastforhold i begge tilstande, og alle lever op til WCAG 2.1 AA
- [ ] Repoets kontrol beregner selv kontrasten for de par og fejler hvis ét falder under kravet
- [ ] Der findes en eksempelside med alle fem komponenter i alle deres tilstande, som virker åbnet direkte fra disken uden netværk, og som kan skifte mellem lys og mørk
- [ ] Mennesket har set eksempelsiden i begge tilstande og godkendt paletten
- [ ] `/agents:design` lægger standarden ind i et projekt der er sat op, overskriver aldrig noget, nævner den i projektets `CLAUDE.md`, og sætter et emne på projektets BOARD om at appen skal kobles på
- [ ] Dokumenterne der tæller kaldene eller viser træet, passer med det nye kald
- [ ] Repoets kontrol er grøn

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
### Hvad er ikke lavet, og hvorfor
### Uklart
