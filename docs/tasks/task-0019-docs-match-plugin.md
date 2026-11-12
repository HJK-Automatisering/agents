---
nummer: task-0019
titel: Hooken og dokumenterne beskriver et mindre plugin end det der findes
status: afsluttet
kilde: interview
oprettet: 2026-11-12
---

# task-0019 — Hooken og dokumenterne beskriver et mindre plugin end det der findes

## Hvad og hvorfor

Fire emner har stået på BOARD, nogle siden den første opgave. De har det til fælles at teksten
er blevet overhalet af det plugin'et gør. Hooken hedder noget med *projekt nul*, men laver seks
tjek. Tre dokumenter skriver "tre tjek". Projektdokumentet tæller ni roller og nævner ikke
projektkonsulenterne. `CLAUDE.md` siger ikke hvilken Node der gælder. Og træet i `PLUGIN.md`
mangler Portainer-guiden. Ingen af dem giver en fejl, og derfor bliver de ved med at stå.

## Færdig når

- [x] Hookens filnavn og beskrivelse siger at den tjekker projektets tilstand ved sessionsstart, ikke kun at den genkender projekt nul. Alle steder der nævner filen, bruger det nye navn
- [x] Intet dokument til mennesker siger hvor mange tjek hooken laver. De siger hvad man mister uden Node, uden et tal der kan blive forkert igen
- [x] Projektdokumentet siger ti roller og har projektkonsulenterne med under *For hvem*
- [x] `CLAUDE.md` siger hvilken Node-version kontrollen kører på, og at hooken skal virke på den Node brugerne får uden ekstra pakker
- [x] Træet i `PLUGIN.md` har alle guiderne i roden med, også `PORTAINER.md`
- [x] Repoets kontrol er grøn, og hooken giver samme beskeder som før på et testprojekt

## Sådan bygger vi det

**1. Hookens navn.** Omdøb `plugins/agents/hooks/detect-project-zero.cjs` til
`plugins/agents/hooks/check-project-state.cjs` med `git mv`, så historikken følger med. Navnet
følger `statusMessage` i `hooks.json`, der allerede siger *Tjekker projektets tilstand*. Ret
henvisningerne i `hooks.json`, `tools/validate.mjs`, `CLAUDE.md` og `PLUGIN.md`. Søg bagefter
efter `detect-project-zero` i hele repoet. `CHANGELOG.md`, `docs/tasks/` og
`docs/decisions/log.md` beskriver fortiden og skal ikke rettes. Ret også `description` i
`hooks.json`: den siger kun *projekt nul og manglende .gitignore*. Selve koden i hooken skal ikke
ændres.

**2. Tællingen.** `README.md` linje 23, `GUIDE.md` omkring linje 91 og `OPSAETNING.md` omkring
linje 73 siger "tre automatiske tjek" eller "tre tjek". Fjern tallet. Skriv i stedet hvad tjekkene
dækker i én kort bisætning, fx at projektet er nyt, eller at kopierne fra plugin'et er bagud, og at
`.gitignore` mangler. `README.md` retter jeg selv. Du tager `GUIDE.md` og `OPSAETNING.md`.

**3. Projektdokumentet.** I `docs/projekt.md`, under *Ikke-mål*: "ni bestemte roller" bliver til
ti. Under *For hvem* kommer et punkt om projektkonsulenter, der viser slutbrugere en klikbar
skitse med `/agents:mockup` uden at bruge navet. Hold det i dokumentets korte stil.

**4. Runtime-versionen.** I `CLAUDE.md`, under *Kommandoer* eller lige efter: kontrollen kører på
Node 22 i CI (se `.github/workflows/validate.yaml`), og brugerne får den LTS som `winget`
installerer. Skriv også at hooken kun bruger Nodes egne moduler og ingen pakker, så den virker
uden `npm install`. Se efter i `tools/validate.mjs`, om den bruger noget der kræver en nyere Node
end 22. Gør den, så skriv det.

**5. Træet.** I `PLUGIN.md`, under `## Struktur`: tilføj `PORTAINER.md`. Tag linjen med
`AUTHENTIK.md` og `NGINX-PROXY-MANAGER.md` med, så de tre guider til en app i drift står samlet.

Kør `node --check` på hooken og `node tools/validate.mjs`. Kør hooken mod et midlertidigt
testprojekt med en bagud `kontrakt-version` før og efter omdøbningen, og se at beskeden er den
samme.

## Hvad vi ikke rører

- Hookens kode og beskeder. Kun filnavnet og kommentarhovedet, hvis det nævner navnet
- `kontrakt-version`, `skabelon-version`, `design-version` og versionsnumrene i manifesterne
- `AGENTS.md` i roden og skabelonen under `plugins/agents/skills/kickoff/`
- `CHANGELOG.md`, rapporterne, opgaverne og beslutningsloggen
- `README.md` og `docs/BOARD.md`, som er architects

## Afhænger af

intet

## Beslutninger

- BESLUTTET: de fire emner er én opgave — de er alle tekst der er overhalet af plugin'et, ingen af dem bærer en tråd alene, og de rører hver sin fil på nær `CLAUDE.md` og `PLUGIN.md`
- BESLUTTET: hooken omdøbes, i stedet for at kun beskrivelsen rettes — navnet er det en vedligeholder ser først, og det har været forkert siden tjek nummer to. Det koster fem henvisninger. Der er ingen risiko hos brugerne, fordi `hooks.json` og filen altid udgives sammen
- BESLUTTET: navnet er `check-project-state.cjs` — det følger `statusMessage`, og det holder også når der kommer et syvende tjek
- BESLUTTET: tallet fjernes frem for at blive rettet til seks — det har været forkert tre gange, fordi hvert nyt tjek glemmer de dokumenter der tæller
- BESLUTTET: projektdokumentet rettes i en opgave og ikke ved at køre `/agents:kickoff` igen — kickoff interviewer hele projektet forfra, og her skal to fakta rettes. Mennesket har sagt ja til at tage emnet
- BESLUTTET: architect tilbyder ikke et versionsnummer for denne opgave alene — intet der kopieres ind i projekterne, ændrer adfærd. Omdøbningen følger med næste udgivelse, når mennesket beslutter den

## Åbne punkter

## Indvendinger

---

## Developers noter

<Alt over denne overskrift ejes af architect. Alt herunder skrives kun af
developer, som aldrig retter i definitionen ovenfor.>

### Hvad er lavet

Fire commits på `task-0019-docs-match-plugin`: `7d158ce`, `dd6a901`, `e787c75`, `95304bb`.

- **Hookens navn** (`7d158ce`). `git mv plugins/agents/hooks/detect-project-zero.cjs plugins/agents/hooks/check-project-state.cjs`, så historikken følger med (git ser det som en ren omdøbning, 0 linjer ændret). Henvisningerne er rettet i `plugins/agents/hooks/hooks.json` (`args`), `tools/validate.mjs` (tjek 9, begge forekomster), `CLAUDE.md` (begge kommandoblokke) og `PLUGIN.md` (træet). `description` i `hooks.json` siger nu: *Tjekker projektets tilstand ved sessionsstart: om projektet er nyt, om kopierne fra plugin'et er bagud, og om .gitignore mangler*. Hookens kode er ikke rørt. Kommentarhovedet nævner ikke filnavnet, så det er heller ikke rørt. `git grep detect-project-zero` finder nu kun filer under `docs/tasks/`, som skal blive som de er.
- **Tællingen** (`e787c75`). `GUIDE.md` (afsnittet *Hvis Node mangler*) og `OPSAETNING.md` (afsnit 2) siger ikke længere et tal. I stedet står der hvad man mister: om projektet er nyt, om kopierne fra plugin'et er bagud, og om `.gitignore` mangler. En søgning efter *to/tre/…/seks tjek* uden for `docs/` finder kun hookens eget kommentarhoved (`// Seks tjek:`). Det er kode og ikke et dokument til mennesker, og koden må ikke ændres. `README.md` er ikke rørt.
- **Projektdokumentet** (`95304bb`). I `docs/projekt.md` står der nu "ti bestemte roller" under *Ikke-mål*. Under *For hvem* er der et nyt punkt om projektkonsulenter i møder med slutbrugere, der viser en klikbar skitse med `/agents:mockup` uden at bruge navet.
- **Runtime-versionen** (`dd6a901`). `CLAUDE.md` har nu et afsnit lige efter *Kommandoer*-blokken. Det siger at kontrollen kører på Node 22 i CI (`.github/workflows/validate.yaml`), og at `tools/validate.mjs` ikke bruger noget der kræver en nyere. Brugerne får den LTS-udgave som `winget` installerer, og hooken skal virke på den. Hooken bruger kun Nodes egne moduler og ingen pakker, så den kører uden `npm install`. Jeg har gennemgået `validate.mjs`: den bruger `node:`-præfikset, `import.meta.url`, `String.prototype.matchAll`, `catch` uden binding og `readdirSync` med `withFileTypes`. Det har alt sammen været i Node længe før 22. Hooken bruger kun `fs`, `path` og `child_process`.
- **Træet** (`dd6a901`). I `PLUGIN.md` under `## Struktur` står `PORTAINER.md`, `AUTHENTIK.md` og `NGINX-PROXY-MANAGER.md` nu samlet på én linje. Under dem står forklaringen *en app i drift: stacken, så login foran, klik for klik*.
- **Kontrollen.** `node --check plugins/agents/hooks/check-project-state.cjs` er stille. `node tools/validate.mjs` siger `OK. 13 skills, 7 agenter, 57 markdown-filer, 29 farvepar, begge manifester paa version 1.4.0.` uden advarsler, både mod `origin/main` og mod `BASE_REF=main`. Der er ingen advarsler om stempler, og ingen versionsnumre eller stempler er rørt.
- **Hooken mod et testprojekt.** Jeg lavede et midlertidigt projekt i scratch-mappen med `AGENTS.md` på `kontrakt-version: 1`, `docs/design/design.md` på `design-version: 1`, en `CLAUDE.md` og ingen `.gitignore`. Hooken kørte mod det før omdøbningen, efter omdøbningen og igen efter sidste commit. Alle tre gange kom de samme tre beskeder: kontrakten er bagud (1 mod 24), designstandarden er bagud (1 mod 2), og `.gitignore` mangler. Uddata var byte for byte ens (892 byte, sammenlignet med `cmp`), og exit-koden var 0. Testprojektet er slettet.
- Ingen nye kommandoer eller indstillinger for brugeren. `README.md` skal kun bruge det, hvis den nævner hookens filnavn. Det gør den ikke i den udgave jeg har set.

### Hvad er ikke lavet, og hvorfor

- **Kontrollen er ikke kørt på Node 22.** Maskinen har Node v24.19.0, og der er ikke en Node 22 at køre den på. At `validate.mjs` virker på 22, bygger derfor på gennemgangen ovenfor og på at CI har kørt den på 22 indtil nu. Det er ikke kørt her.
- **Hookens kommentarhoved siger stadig "Seks tjek".** Det er kode, og opgaven siger at koden ikke må ændres ud over et kommentarhoved der nævner filnavnet. Det gør det ikke.

### Uklart

intet

**Fund uden for opgaven, til architect:**

1. `GUIDE.md`, afsnittet *Forudsætning: Node* (første afsnit) og *Hvis Node mangler* (andet afsnit), beskriver stadig hooken som noget der kun siger til ved et tomt projekt eller en kontrakt der er bagud. Der står intet tal, så kriteriet er opfyldt, men opremsningen er ufuldstændig på samme måde som tallet var. Jeg har ikke rettet den. Opgaven pegede kun på linjen med tallet.
2. Træet i `PLUGIN.md` mangler repoets egen `AGENTS.md` i roden og mapperne `tools/`, `docs/` og `.github/`. Ingen af dem er guider, så de er ikke en del af dette kriterium. Jeg har ikke tilføjet dem.

`README.md` blev ændret i arbejdstræet mens jeg arbejdede. Den er hverken rørt eller committet af mig.
