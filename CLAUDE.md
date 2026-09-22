# CLAUDE.md

## Hvad dette repo er

Kildekode til Claude Code-plugin'et `agents`: elleve skills, syv agenter, en
SessionStart-hook og to manifester. Repoet er **både marketplace og plugin** —
brugerne peger deres klient direkte på det.

Der er **ingen build, ingen tests og intet program**. Indholdet er markdown,
JSON og én Node-hook. Ændringer rammer alle projekter i organisationen ved
næste udgivelse.

## Kommandoer

```
node tools/validate.mjs                     # alle kontroller, samme som CI
claude plugin validate .                    # marketplace-manifestet
claude plugin validate ./plugins/agents     # plugin-manifestet
claude --plugin-dir "<sti>/agents-preview"  # prøv af uden at udgive, se nedenfor
node --check plugins/agents/hooks/detect-project-zero.cjs
```

Afprøvning uden at udgive kræver en engangskopi af `plugins/agents` uden for
repoet med et andet `name` i manifestet. `--plugin-dir` mod arbejdstræet selv
rammer den installerede udgave, uden at klienten siger det: kaldet svarer, men
med den installerede udgaves tekst. Fremgangsmåden står i `PLUGIN.md`.

Hooken kan afprøves direkte ved at fodre den en SessionStart-nyttelast:

```
echo '{"cwd":"<sti til et testprojekt>"}' | node plugins/agents/hooks/detect-project-zero.cjs
```

## Regler der gælder her

- **Bump aldrig et versionsnummer uden at være bedt om det.** Hverken
  `plugins/agents/.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`
  eller `kontrakt-version` i kontrakten. En udgivelse er en beslutning, ikke et
  trin i en opgave. Sig til når noget er klar.
- **De to manifesters `version` skal følges ad.** Bumpes den ene og ikke den
  anden, ser brugerne stadig den gamle udgave i kataloget.
- **To filer hedder `AGENTS.md`. Forveksl dem aldrig.**
  `plugins/agents/skills/kickoff/AGENTS.md` er **skabelonen** — den kopieres ind
  i brugerprojekter, og det er den en opgave om kontrakten altid mener.
  `AGENTS.md` i roden er **dette repos egen kontrakt**, som rollerne selv
  arbejder under; retter du den, ændrer du reglerne for det arbejde du er midt
  i. Er du i tvivl om hvilken en opgave peger på, er det skabelonen.
  Ændrer du en *regel* i skabelonen, skal `kontrakt-version` bumpes — ellers
  opdager projekterne aldrig at deres kopi er forældet. Bumpet er menneskets
  beslutning.
- **Skabelonerne under `plugins/agents/skills/workflow/` har deres eget stempel.**
  `skabelon-version` i workflow-dokumentet er det eneste et projekt kan se en
  ændring på. Ændrer du hvad et workflow gør, skal den bumpes — men bumpet er,
  som `kontrakt-version`, menneskets beslutning. `node tools/validate.mjs`
  advarer når filerne har flyttet sig uden at stemplet fulgte med.
- **Repoet er offentligt.** Alle kan læse det, og historik kan ikke gøres privat
  bagefter. Ingen kundenavne, systemnavne, logudskrifter, fund eller persondata i
  eksempler — heller ikke opdigtede der ligner rigtige. `EVALUERING.md` er
  gitignoreret af netop den grund.
- **Skriv til en model der ikke kender konteksten.** En rollefil læses i en
  frisk tråd i et fremmed projekt. Alt der kun giver mening her, er tabt.
- **Påstå ikke at noget er teknisk umuligt.** En agents `tools:`-liste fjerner
  værktøjer; den er ikke en lås, så længe `Write` eller `Bash` er med. Se
  `GUIDE.md`.

## Struktur

`PLUGIN.md` har det fulde træ og er kilden. Kort fortalt:

| Sti | Hvad |
|---|---|
| `plugins/agents/skills/<navn>/SKILL.md` | De elleve kald |
| `plugins/agents/agents/<navn>.md` | De syv rapportroller |
| `plugins/agents/skills/kickoff/` | Kontrakt, BOARD og beslutningslog der kopieres ind i projekter |
| `plugins/agents/hooks/` | SessionStart-hook |
| `.claude-plugin/marketplace.json` | Kataloget — skal ligge i roden |

## Ord

- **Rolle** — hvad det er. Der er ni, plus to hjælpekald.
- **Skill** / **agent** — hvordan rollen leveres. En skill kører i brugerens
  tråd; en agent kører isoleret i sit eget kontekstvindue.
- **Samtalerolle** — arbejder sammen med mennesket, ét spørgsmål ad gangen.
  Der er **to**: `architect` og `kickoff`. Kun de to kan spørge.
- **Rapportrolle** — sendes af sted, kommer tilbage med en henvisning og
  én linje pr. fund. De syv øvrige, inklusive `developer`.
- **Navet** — `architect`. Den eneste rolle der opretter opgaver og sender de
  andre af sted. Ingen rolle peger på en anden; alt returnerer til navet.
- **Opgave** kontra **rapport** — de to slags dokumenter, med hver sit
  statussæt. En opgave planlægges og udføres; en rapport produceres og
  forbruges. Bland dem ikke.
- **Kontrakten** — `AGENTS.md`, den fælles regelbog alle roller arver.
  Den kopieres ind i hvert projekt og driver derfor; derfor `kontrakt-version`.

## Til mennesker

`GUIDE.md` er til dem der bruger rollerne. `PLUGIN.md` er til dem der
vedligeholder og udruller plugin'et.
