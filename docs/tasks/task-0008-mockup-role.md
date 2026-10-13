---
nummer: task-0008
titel: En mockup-rolle til møder med slutbrugere
status: afsluttet
kilde: interview
oprettet: 2026-10-13
---

# task-0008 — En mockup-rolle til møder med slutbrugere

## Hvad og hvorfor

Projektkonsulenter sidder i møder med slutbrugere og har brug for at vise
*"kunne det her være en løsning?"* — en klikbar side med fiktive data, rettet
til mens slutbrugeren ser på. Ingen rolle kan det i dag: alle kræver interview,
opgave og gren før noget vises, og ingen af dem må gætte. Det der skal
overleve mødet, er ikke kun skitsen, men hvad slutbrugeren reagerede på — det
er grundlaget de udviklere der bygger løsningen, arbejder videre fra.

## Færdig når

- [ ] En konsulent kan kalde en ny rolle, `mockup`, som viser en første skitse uden at interviewe først
- [ ] Rollen arbejder i konsulentens egen tråd, retter til efter konsulentens ord, og gætter frem for at spørge — men hvert gæt står i noterne
- [ ] Rollen virker både i en tom mappe og i et projekt der er sat op med metoden
- [ ] I en tom mappe opretter den kun de mapper den selv skal bruge: ingen kontrakt, ingen `CLAUDE.md`, ingen `.gitignore`, ingen git
- [ ] I et opsat projekt arbejder den på sin egen gren, lavet ud fra default-grenen og ikke fra den gren der er tjekket ud
- [ ] Står der ucommittede ændringer i arbejdstræet, stopper den og siger det i stedet for at skifte gren
- [ ] Den committer kun sin egen skitsemappe, undervejs når konsulenten siger at noget er vist, og pusher kun efter et ja
- [ ] Skitsen åbner uden installation og uden netværk, og viser selv tydeligt at den er en skitse med fiktive data
- [ ] Skitsen viser aldrig rigtige data: rollen læser ingen hemmeligheder og åbner ingen forbindelser. I et opsat projekt låner den kun datamodellens form
- [ ] De fiktive data ligner virkeligheden i form, men er aldrig kopieret fra et rigtigt system og indeholder ingen personnumre
- [ ] Hver skitse efterlader noter: hvad blev vist, hvad slutbrugeren reagerede på, hvad blev valgt fra, hvilke data skærmen forudsætter, hvilke gæt rollen tog, og hvad der stadig er åbent
- [ ] Rollen starter ikke selv en browser
- [ ] Kontrakten beskriver rollen, hvor den skriver, og at den — inden for sin egen mappe — er undtaget fra at kun `developer` ændrer kode, og fra at kun `architect` og `kickoff` taler med mennesket
- [ ] Kontrakten siger at en skitse aldrig flyttes ind i løsningen: skal den bygges, bliver den til opgaver, og `developer` bygger forfra
- [ ] `architect` behandler en skitse som en rapport: den står på BOARD indtil hver reaktion i noterne er blevet en opgave eller er afvist, og den kan stå som `Kilde` i en opgave
- [ ] Vejledningen har et afsnit til konsulenter, og alle steder der tæller roller, kald og samtaleroller, passer
- [ ] Kontrollen er ren
- [ ] Intet versionsnummer er ændret — hverken i manifesterne eller `kontrakt-version`

## Sådan bygger vi det

**Skillen, `plugins/agents/skills/mockup/SKILL.md`.** Ingen agent — rollen
skal arbejde i dialog. `disable-model-invocation: true` som alle andre.
Beskrivelsen følger de øvrige skills' form.

Rollen opfører sig modsat de andre: den viser først og retter bagefter. Den
stiller ikke spørgsmål med for og imod. Er noget uklart, gætter den og skriver
gættet i noterne. Konsulenten styrer; slutbrugeren sidder ved siden af.

**Opstart uden kontrakt.** De øvrige roller stopper med `kør /agents:kickoff
først`, når `AGENTS.md` mangler. Det må denne ikke. Skillen skal selv rumme det
den har brug for af regler, så den kan arbejde i en tom mappe. Hooken vil sige
`PROJEKT NUL` ved sessionsstart i en tom mappe; skillen skal sige at det er
forventet under en skitse, og at `kickoff` køres bagefter. Hookens besked
gøres mildere i task-0009 — den del hører ikke hjemme her.

**Placering.** `docs/mockups/mockup-NNNN-slug/` med to filer:

- `index.html` — én fil med HTML, CSS, JavaScript og evt. SVG skrevet direkte.
  Ingen pakker, intet CDN, ingen `fetch`. Data ligger i filen. Om den vises ved
  at åbne filen eller via en lokal server, er dit valg, men den skal virke
  åbnet direkte.
- `NOTER.md` — frontmatter med `nummer`, `titel`, `status` og `oprettet`, og
  afsnit for det der står i *Færdig når*. `status` er rapporternes:
  `klar til behandling` → `behandlet`. Rollen skriver den første; `architect`
  den anden.

`NNNN` er fortløbende i `docs/mockups/`, slug på engelsk, som de andre numre.

**At vise skitsen.** Kontraktens *Efterprøvning af en webflade* forbyder
agenter at starte browsere, og grunden gælder også her. Konsulenten åbner selv
skitsen, eller rollen bruger den browser klienten stiller til rådighed. Rollen
starter aldrig en browser via kommandolinjen.

**I et opsat projekt.** Grenen hedder `mockup-NNNN-slug`. `git add` med den
eksplicitte sti til skitsemappen — aldrig `-A` eller `.`. Datamodellens form
læses fra koden, skemaer eller `docs/map.md`. `.env` læses ikke, og der åbnes
ingen forbindelser.

**Kontrakten, `plugins/agents/skills/kickoff/AGENTS.md`.** Det er skabelonen,
ikke kopien i roden. Steder der skal med:

- *Grundprincipper* 1, 2 og 6 — undtagelserne, afgrænset til skitsemappen
- *Roller og hvor de kører* — en række for `mockup`
- *Til mennesket: chatten* — gælder i dag kun `architect` og `kickoff`
- *Filstruktur* — `docs/mockups/`
- *Numre* og *Rapporter* — at en skitse nummereres og behandles som en rapport
- Reglen om at `.gitignore` findes før projektets anden fil: i en tom mappe
  ligger skitsen før `.gitignore`, og det er forsvarligt fordi der ingen git er.
  Sig det, så de to regler ikke ser ud til at modsige hinanden

**`architect`, `plugins/agents/skills/architect/SKILL.md`.** `mockup-NNNN` som
mulig værdi i opgaveskabelonens `kilde`, og skitser med i det den læser i trin
1 og triagerer i trin 6.

**Dokumentationen.** `GUIDE.md` får et afsnit til konsulenter: hvornår man
kalder rollen, de to tilfælde, og hvad der sker med skitsen bagefter. Tallene
skal passe i `GUIDE.md`, `README.md`, `PLUGIN.md` (også træet),
`OPSAETNING.md`, `CLAUDE.md` og beskrivelsesteksten i begge manifester.
Beskrivelsesteksten er ikke versionen; den må gerne ændres.

## Hvad vi ikke rører

- `plugins/agents/hooks/detect-project-zero.cjs` og `plugins/agents/skills/kickoff/SKILL.md` — task-0009
- `AGENTS.md` i roden — repoets egen kontrakt, som følger skabelonen efter udgivelsen
- `docs/projekt.md` — ejes af `kickoff`. Dens tal og målgruppe er et emne på BOARD
- De syv agentfiler under `plugins/agents/agents/`
- Versionsnumre i begge manifester og `kontrakt-version`
- `CHANGELOG.md` — skrives ved udgivelsen

## Afhænger af

intet

## Beslutninger

- BESLUTTET: rollen leveres som skill, ikke agent — den skal kunne rette til mens konsulenten og slutbrugeren ser på. En agent kan ikke føre en dialog
- BESLUTTET: en skitse viser aldrig rigtige data, heller ikke i et opsat projekt. Den låner kun datamodellens form — det er forudsætningen for at sikkerhed kan springes over
- BESLUTTET: i en tom mappe oprettes kun skitsens mapper. Køres `kickoff` bagefter, ligger skitsen klar
- BESLUTTET: i et opsat projekt egen gren fra default-grenen, commit af kun egen mappe undervejs, push kun efter et ja, stop ved ucommittede ændringer. Afvist: ingen commit (skitsen forsvinder eller ryger med i en fremmed gren) og commit på default-grenen (konsulenten har måske ikke rettighederne)
- BESLUTTET: fortløbende nummer frem for dato. To konsulenter arbejder aldrig på samme skitse, og falder to numre sammen, adskilles mapperne af slug'en
- BESLUTTET: én fil uden installation og netværk — mødelaptoppen skal ikke kunne fejle på et netværk eller en pakke, og ingen netværk gør "ingen data" til en egenskab frem for et løfte
- BESLUTTET: skitsen behandles af `architect` som en rapport — det er den eksisterende spærre mod at et fund forsvinder, og en reaktion fra slutbrugeren er et fund
- BESLUTTET: emnet er delt i to numre. Rollen kan bruges uden at hooken og `kickoff` kender den; task-0009 gør overgangen glat
- BESLUTTET: ændringen af kontrakten er en regelændring, så `kontrakt-version` skal bumpes. Bumpet er menneskets og tages ved merge, ikke i opgaven

## Åbne punkter

## Indvendinger

---

## Developers noter

<Alt over denne overskrift ejes af architect. Alt herunder skrives kun af
developer, som aldrig retter i definitionen ovenfor.>

### Hvad er lavet

Gren `task-0008-mockup-role`, fem commits (3cb1ba6, 55ffda9, cf72e72, 400d5f3, 7249122). Opgavefilen selv er ikke committet, som aftalt.

- **Ny rolle, kaldes uden interview** — `plugins/agents/skills/mockup/SKILL.md`. Skill, ingen agent, `disable-model-invocation: true`, beskrivelse i samme form som de andre. Første besked siger hvilken situation den står i og viser så den første skitse.
- **Konsulentens tråd, retter til, gætter, gæt i noterne** — *Mandat* i skillen: viser først, ingen spørgsmål med for og imod, gætter og skriver gættet under `## Gæt` i `NOTER.md`.
- **Tom mappe og opsat projekt** — *Afgør situationen først* i skillen afgør det på om `AGENTS.md` findes. Første linje i skillen siger at den arbejder videre uden kontrakt, modsat de andre roller.
- **Tom mappe: kun egne mapper** — opretter kun `docs/mockups/` og skitsens mappe; ingen kontrakt, `CLAUDE.md`, `.gitignore`, `git init` eller commits. Siger at `PROJEKT NUL` er forventet, og at `/agents:kickoff` køres bagefter.
- **Egen gren ud fra default-grenen** — *Git* i skillen: `git switch --no-track -c mockup-NNNN-slug <default-grenen>`. Default-grenen læses med `git symbolic-ref` eller `git remote show origin`. Kan den ikke aflæses, spørger rollen; den gætter ikke på `main`.
- **Stop ved ucommittede ændringer** — `git status --porcelain` før hvert skift. Står der noget, stopper rollen og siger det. Ingen stash, ingen commit, intet kasseres.
- **Committer kun egen mappe, når noget er vist; push kun efter ja** — `git add <sti>` og `git commit -m … -- <sti>`. Aldrig `-A`, `.` eller `-a`. Pushet vises som én linje med grenens navn i spørgsmålet, og ja'et bruges op.
- **Uden installation og netværk, mærket som skitse** — *Skitsen* i skillen: én `index.html`, ingen pakker, intet CDN, ingen `fetch`, ingen eksterne adresser. Et fast bånd *SKITSE — fiktive data* som ikke kan lukkes. Virker åbnet direkte; jeg har valgt ingen lokal server.
- **Aldrig rigtige data, ingen hemmeligheder, ingen forbindelser; låner kun formen** — *Data* og *Du må ikke* i skillen. I et opsat projekt læses formen fra kode, skemafiler eller `docs/map.md`. Ingen `.env`, ingen forespørgsler, ingen server.
- **Fiktive data: realistisk form, aldrig kopieret, ingen personnumre** — *Data* i skillen. Data kopieres heller ikke fra testdata eller seed-filer i projektet. Personnummerfelter vises som pladsholderen `XXXXXX-XXXX`.
- **Noter med de seks emner** — skabelon for `NOTER.md` i skillen. Frontmatter har `nummer`, `titel`, `status` og `oprettet`. Afsnittene er: vist, reaktioner (R1, R2 …), fravalgt, data skærmen forudsætter, gæt og åbent. Desuden `## Afledte numre` til architect, som i de øvrige rapporter. Noterne skrives undervejs.
- **Starter ikke en browser** — *At vise skitsen* i skillen. Kontraktens afsnit *Efterprøvning af en webflade* siger nu at grunden også gælder `mockup`.
- **Kontrakten beskriver rollen og undtagelserne** — `plugins/agents/skills/kickoff/AGENTS.md`:
  - Grundprincip 1, 2 og 6 har hver en undtagelse, afgrænset til skitsemappen.
  - *Roller og hvor de kører* har en række for `mockup` og en sætning om at noterne ender hos architect.
  - *Til mennesket: chatten* siger hvilke af de seks regler der gælder for `mockup`.
  - *Sådan starter du* siger at `mockup` arbejder videre uden `AGENTS.md`.
  - *Filstruktur* har `docs/mockups/mockup-NNNN-slug/`.
  - *Numre* siger at en skitse er en mappe, og at et sammenfaldende nummer skilles ad af slug'en.
  - *Rapporten er kilden* og *Status → Rapporter* siger at en skitse behandles som en rapport.
  - Under *Versionering* forklarer reglen om `.gitignore` hvorfor en skitse i en tom mappe ikke modsiger den. Samme sted er der en linje om skitsegrenen, og push-undtagelsen er udvidet til `mockup`s egen gren efter et ja.
- **Skitsen flyttes aldrig ind i løsningen** — grundprincip 2 i kontrakten. Det står også i skillen, i GUIDE og i architects triage.
- **architect behandler en skitse som rapport** — `plugins/agents/skills/architect/SKILL.md`:
  - `mockup-NNNN` er en mulig værdi i skabelonens `kilde`.
  - Trin 1 læser `NOTER.md` under `docs/mockups/` og på ikke-mergede `mockup-*`-grene.
  - Trin 6 triagerer skitsen, og den står på BOARD under *Rapporter klar til behandling*, til hvert punkt er afgjort.
- **Afsnit til konsulenter, og tallene passer**:
  - `GUIDE.md` har et nyt afsnit, *Til konsulenter: en skitse i mødet*: hvornår rollen kaldes, de to tilfælde i en tabel, og hvad der sker bagefter.
  - Tallene i `GUIDE.md`: ti roller, tre samtaleroller, tolv kald. Rollerne har fået en ny række, *Seks mapper, seks tællere* har en ny række, og snydearket er rettet.
  - `README.md`: ti roller, tolv kald, en ny række i tabellen, tre samtaleroller, og "fem kører i din tråd".
  - `PLUGIN.md`: træet har `mockup/`, og architect-linjen er omformuleret til "den eneste rolle der interviewer i drift". Tolv skills tre steder, tre samtaleroller.
  - `OPSAETNING.md`: tolv kald.
  - `CLAUDE.md`: tolv skills og kald, ti roller, tre samtaleroller.
  - Beskrivelsen i begge manifester: "Ti roller … status, mockup."
- **Kontrollen er ren** — `node tools/validate.mjs` giver OK: 12 skills, 7 agenter, 43 markdown-filer. Den har én forventet advarsel: kontrakten er ændret, men `kontrakt-version` står stadig på 20. `claude plugin validate .` og `claude plugin validate ./plugins/agents` består begge.
- **Intet versionsnummer ændret** — begge manifester står på `1.0.0-beta.25`, og `kontrakt-version` står på 20. Bumpet af `kontrakt-version` er en beslutning der skal tages ved merge (se `## Beslutninger`).

### Hvad er ikke lavet, og hvorfor

- **`kontrakt-version` er ikke bumpet.** Det er menneskets beslutning ved merge, ifølge opgaven. Derfor advarer kontrollen.
- **Uden for opgaven, ikke rørt — to fund:**
  1. `status`-agenten læser kun de fem mapper `docs/tasks/`, `tests/`, `securities/`, `reviews/` og `debugs/` (`plugins/agents/agents/status.md` linje 18). Det samme står i kontraktens BOARD-afsnit: "Den læser de fem mapper". Den ser derfor ikke en skitse der står `klar til behandling`, og kan ikke advare om at den bliver liggende. Agentfilerne er udelukket i opgaven, så jeg har hverken rettet den eller sætningen i kontrakten.
  2. `update`-skillens del 1, trin 4, stopper når den nye kontrakt nævner en mappe som projektet ikke har. Ved næste opdatering vil `docs/mockups/` udløse det i alle projekter, også selv om mappen først oprettes når den første skitse laves. `update` er ikke nævnt i opgaven, så jeg har ikke rørt den.

### Uklart

- **Hvordan en skitse kommer fra sin gren ind på default-grenen.** Det er besluttet at skitsen har egen gren og kun pushes efter et ja. Hvem der merger den, står ingen steder. I mellemtiden: trin 1 i architect læser noterne direkte fra `mockup-*`-grenen med `git show`. Skal skitsen triageres (status sat, `Afledte numre` udfyldt), skal den først merges ind; det er en git-linje under samme gate som trin 8.
- **En mappe der ikke er tom, men heller ikke har `AGENTS.md`** (kode og git, men uden metoden). Opgaven nævner kun en tom mappe og et opsat projekt. Jeg har afgjort situationen alene på om `AGENTS.md` findes. Uden den opfører rollen sig som i en tom mappe: den rører ikke git og hverken læser eller rører de filer der ligger. Den låner altså ikke datamodellens form i det tilfælde.
- **Er `mockup` en samtalerolle?** Opgaven siger at tallet for samtaleroller skal passe, og jeg har læst det som at de nu er tre. Definitionen er rettet til "arbejder sammen med mennesket, i dets tråd" og siger at kun `architect` og `kickoff` spørger. Rapportrollerne er stadig syv.
- **Hvad der triageres i en skitse.** *Færdig når* siger "hver reaktion". Jeg har skrevet hver reaktion, hvert fravalg og hvert åbent punkt, fordi et fravalg også er en reaktion, og et åbent punkt ellers ville forsvinde. Gæt og dataforudsætninger er grundlag for interviewet, ikke punkter i sig selv. Rettes det til kun reaktioner, gælder det tre steder: kontrakten, architect og skillen.
- **Spørgsmål om default-grenen.** Kan default-grenen ikke aflæses, spørger rollen konsulenten i stedet for at gætte. Det er en undtagelse fra "gætter frem for at spørge". Jeg har valgt den, fordi et forkert gæt lægger skitsen oven på den forkerte gren.
