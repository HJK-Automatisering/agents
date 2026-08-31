# CLAUDE.md

## Hvad dette repo er

Kildekode til Claude Code-plugin'et `agents`: elleve skills, fire agenter, en
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
claude --plugin-dir "<sti>/plugins/agents"  # prøv af uden at udgive
node --check plugins/agents/hooks/detect-project-zero.cjs
```

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
- **`plugins/agents/skills/kickoff/AGENTS.md` er en skabelon, ikke dette repos
  kontrakt.** Den kopieres ind i brugerprojekter. Ændrer du en *regel* i den,
  skal `kontrakt-version` bumpes — ellers opdager projekterne aldrig at deres
  kopi er forældet. Bumpet er menneskets beslutning.
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
| `plugins/agents/agents/<navn>.md` | De fire rapportroller |
| `plugins/agents/skills/kickoff/` | Kontrakt, BOARD og beslutningslog der kopieres ind i projekter |
| `plugins/agents/hooks/` | SessionStart-hook |
| `.claude-plugin/marketplace.json` | Kataloget — skal ligge i roden |

## Ord

- **Rolle** — hvad det er. Der er ni, plus to hjælpekald.
- **Skill** / **agent** — hvordan rollen leveres. En skill kører i brugerens
  tråd; en agent kører isoleret i sit eget kontekstvindue.
- **Samtalerolle** — arbejder sammen med mennesket, ét spørgsmål ad gangen.
- **Rapportrolle** — sendes af sted, kommer tilbage med et dokument.
- **Kontrakten** — `AGENTS.md`, den fælles regelbog alle roller arver.
  Den kopieres ind i hvert projekt og driver derfor; derfor `kontrakt-version`.

## Til mennesker

`GUIDE.md` er til dem der bruger rollerne. `PLUGIN.md` er til dem der
vedligeholder og udruller plugin'et.
