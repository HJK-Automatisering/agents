---
nummer: task-0025
titel: reviewer og architect kender ikke reglen om en ny udgave uden Ctrl+F5
status: i-gang
kilde: interview
oprettet: 2026-11-13
---

# task-0025 — reviewer og architect kender ikke reglen om en ny udgave uden Ctrl+F5

## Hvad og hvorfor

task-0024 gav kontrakten en regel om at hver webløsning leverer sine filer, så en ny udgave bruges
uden Ctrl+F5. Kontraktens *Hvem gør hvad* giver pligten til `architect`, `developer` og `reviewer`.
Men rollefilerne for `reviewer` og `architect` har hver en konkret linje om bundlinjen og ingen om den
nye regel. En rolle der arbejder efter sin egen fil, overser den. `developer` fandt det under
task-0024. Det skal med i samme udgivelse som reglen.

## Færdig når

- [ ] `reviewer` holder hvert projekt med en webflade op mod kontraktens regel om en ny udgave uden Ctrl+F5, på samme måde som den gør med bundlinjen, og melder det som fund når en fil kan blive hængende i browserens lager
- [ ] `architect` gør det til et emne, når en app i drift leverer sine filer uden om reglen
- [ ] `architect` skriver reglen ind i `Færdig når`, når den skriver en opgave der sætter en webflade op eller ændrer hvordan den leverer sine filer
- [ ] Begge henviser til kontraktens underafsnit og gentager ikke reglen
- [ ] Repoets kontrol er grøn, bortset fra de ventede advarsler om stemplerne

## Sådan bygger vi det

**1. `plugins/agents/agents/reviewer.md`**, omkring linje 39. Efter stykket om **Bundlinjen**: et
tilsvarende kort stykke om reglen i kontraktens `### En ny udgave uden Ctrl+F5`. Fundet er en side
eller fil med lang levetid på en adresse der ikke skifter med indholdet, eller en side der ikke svarer
`no-cache`. Brug kontraktens egne ord, og læs selve underafsnittet før du skriver.

**2. `plugins/agents/skills/architect/SKILL.md`**, omkring linje 97–101. Listen har et punkt pr.
emne architect skal se efter. Tilføj et punkt om en app i drift, der leverer sine filer uden om
reglen. Stykket efter listen siger hvad en opgave om bundlinjen skal have i `Færdig når`. Tilføj det
samme for en opgave der sætter en webflade op eller ændrer hvordan den leverer sine filer.

Søg også de øvrige rollefiler under `plugins/agents/` igennem for steder hvor bundlinjen er nævnt som
noget en rolle skal tjekke eller kræve. Står reglen om en ny udgave ikke ved siden af der, hvor den
hører hjemme på samme måde, så skriv i dine noter hvad du fandt. Ret kun de to filer ovenfor.

Kør `node tools/validate.mjs`. Advarslerne om `kontrakt-version` og `design-version` er ventede.
**Bump ingen af dem.**

## Hvad vi ikke rører

- Kontraktskabelonen og `AGENTS.md` i roden
- `design.md`, `design.css`, `eksempel.html` og `GUIDE.md`
- Alle andre rollefiler end de to
- `kontrakt-version`, `design-version`, `skabelon-version` og versionsnumrene i manifesterne
- `README.md`, `CHANGELOG.md`, `docs/BOARD.md` og beslutningsloggen

## Afhænger af

task-0024

## Beslutninger

- BESLUTTET: developers fund fra task-0024 bliver en opgave. Uden den mangler reglen i netop de to
  rollefiler, der har en konkret linje om bundlinjen. Det skal med før udgivelsen
- BESLUTTET: rollefilerne henviser til kontrakten og gentager ikke reglen. To steder med samme regel
  driver fra hinanden
- BESLUTTET: kun de to filer rettes. Andre steder developer finder, bliver afgjort ved lukningen

## Åbne punkter

## Indvendinger

---

## Developers noter

<Alt over denne overskrift ejes af architect. Alt herunder skrives kun af
developer, som aldrig retter i definitionen ovenfor.>

### Hvad er lavet
### Hvad er ikke lavet, og hvorfor
### Uklart
