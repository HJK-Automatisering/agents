---
nummer: task-0027
titel: Tjekket af adgangsloggen kan bestå uden at tjekke, og punkt 8 har ingen vej til afsluttet
status: planlagt
kilde: interview
oprettet: 2026-11-13
---

# task-0027 — Tjekket af adgangsloggen kan bestå uden at tjekke, og punkt 8 har ingen vej til afsluttet

## Hvad og hvorfor

task-0026 gav kontrakten et ottende punkt om proxy-værtens adgangslog og skiftede guidens
pladsholder til `N`. Developer fandt tre ting der skal rettes før udgivelsen. Glemmer man at skifte
`N` ud, siger `wc` at filen ikke findes, og guiden kalder det bestået. Guidens egen liste over hvad
appen skal gøre, har syv punkter, mens kontrakten nu har otte. Og kontrakten siger ikke hvordan
punkt 8 afgøres i en opgave, når `developer` ikke må bygge det.

## Færdig når

- [ ] Guidens tjek af adgangsloggen kan ikke bestå, fordi pladsholderen ikke blev skiftet ud. En fil der ikke findes, bliver først godtaget, når det er vist at nummeret er det rigtige
- [ ] Guidens liste over hvad appen selv skal gøre, siger at kontraktens ottende punkt er proxy-værtens og står i guidens del 4, så de to ikke kan læses som uenige
- [ ] Kontrakten siger hvordan punkt 8 afgøres i en opgave: det er menneskets trin, og `architect` sætter det som holdt, når mennesket har kørt guidens tjek og tallet stod stille
- [ ] `developer` skriver punkt 8 under *Hvad er ikke lavet, og hvorfor*, som menneskets trin, og ikke som noget der mangler
- [ ] Repoets kontrol er grøn, bortset fra den ventede advarsel om `kontrakt-version`

## Sådan bygger vi det

**1. `NGINX-PROXY-MANAGER.md`, del 5, trin 18–21.** I dag siger trin 21: *"Siger `wc` at filen ikke
findes, er der heller ikke skrevet noget."* Det er sandt med det rigtige nummer og falsk med et
`N` der ikke er skiftet ud. Ret det, så en manglende fil først godtages, når nummeret er vist at være
rigtigt. Fx: findes filen ikke i trin 19, så list proxy-værternes logfiler med
`ls /data/logs/proxy-host-*_access.log` og se at nummeret fra trin 18 er det der står i kommandoen.
Gør det i trin 19, før browseren åbnes, så fejlen fanges før tjekket begynder. Tilpas trin 21 og
rækken om `wc -l` i symptomtabellen, så de passer.

**2. `NGINX-PROXY-MANAGER.md`, `## Det appen selv skal gøre`** omkring linje 59. Listen har syv
punkter, og guiden siger at kontrakten gælder, hvis de to er uenige. Skriv én sætning om at
kontraktens ottende punkt er proxy-værtens adgangslog, og at det står i del 4 her. Listen skal ikke
have et ottende punkt; den handler om appen.

**3. Kontraktskabelonen**, `plugins/agents/skills/kickoff/AGENTS.md`, *Hvem gør hvad* under
`## En app bag Authentik`:

- `architect`: punkt 8 står i `Færdig når` som menneskets trin. `architect` sætter det som holdt, når
  mennesket har kørt guidens tjek og tallet stod stille. Indtil da er opgaven ikke `afsluttet`
- `developer`: punkt 8 står under *Hvad er ikke lavet, og hvorfor* som menneskets trin

Hold det kort og i samme form som de punkter der står der.

Kør `node tools/validate.mjs`. Den vil advare om `kontrakt-version`. Det er ventet. **Bump den ikke**.

## Hvad vi ikke rører

- Blokken i del 4 af `NGINX-PROXY-MANAGER.md`
- Kontraktens otte punkter og deres indledning
- `security.md`. Den siger det rigtige om punkt 8
- `AUTHENTIK.md`, `AGENTS.md` i roden og `CHANGELOG.md`
- `kontrakt-version`, `design-version`, `skabelon-version` og versionsnumrene i manifesterne
- `README.md`, `docs/BOARD.md` og beslutningsloggen

## Afhænger af

task-0026

## Beslutninger

- BESLUTTET: developers to fund og det uklare punkt fra task-0026 er én opgave. De handler alle om
  punkt 8 og skal med i samme udgivelse
- BESLUTTET: en manglende logfil godtages først, når nummeret er vist at være rigtigt. Med `N` fejler
  en glemt udskiftning i stilhed. Med `<nummer>` fejlede den højlydt, så rettelsen i task-0026 gjorde
  netop det tilfælde værre
- BESLUTTET: punkt 8 er menneskets trin i en opgave, og `architect` afgør det ud fra menneskets tjek.
  Afvist: at holde punktet uden for `Færdig når`. Så ville ingen opgave kræve det, og det er netop
  den linje der er nem at overse
- BESLUTTET: `kontrakt-version` bumpes én gang, når task-0027 lukkes, og dækker begge opgaver

## Åbne punkter

## Indvendinger

---

## Developers noter

<Alt over denne overskrift ejes af architect. Alt herunder skrives kun af
developer, som aldrig retter i definitionen ovenfor.>

### Hvad er lavet
### Hvad er ikke lavet, og hvorfor
### Uklart
