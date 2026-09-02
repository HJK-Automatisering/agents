# agents

Agent-roller og arbejdsmetode til HJK-Automatiserings projekter. Distribueres som Claude Code-plugin, så alle har det samme og rettelser rammer alle.

**Start her: [GUIDE.md](GUIDE.md)** — den praktiske guide til dem der skal bruge det.
**Vedligeholdelse og udrulning: [PLUGIN.md](PLUGIN.md)**

## Installation

**Node skal være installeret først.** Plugin'ets SessionStart-hook kører på Node, og Claude Codes egen indbyggede runtime er ikke tilgængelig for hooks.

```
winget install --id OpenJS.NodeJS.LTS
```

Administratorrettigheder skal være aktiveret på pc'en inden du kører den. Tjek bagefter i en ny terminal med `node --version`.

Mangler Node, virker alt andet — alle kald, alle roller, kontrakten — men de tre automatiske tjek ved sessionsstart udføres ikke, og det meldes ikke. Se `GUIDE.md`.

Derefter:

```
claude plugin marketplace add HJK-Automatisering/agents
claude plugin install agents@hjk-agents --scope user
```

**Ved hver ny version skal begge køres igen** — med `update` i stedet for `add`:

```
claude plugin marketplace update hjk-agents
claude plugin install agents@hjk-agents --scope user
```

Auto-update virker ikke i skrivebordsappen. Se `PLUGIN.md`.

Derefter, i hvert projekt: `/agents:kickoff`

## De ni roller, elleve kald

Almindelig prosa i Claude Code udløser **ingenting**. Rollerne kaldes eksplicit.

`architect` er **navet**: du sidder hos den, og den sender de øvrige roller af sted. De kommer tilbage med en rapport. Alt vender tilbage til navet.

| Kald | Mekanisme | Kører | Må rette filer |
|---|---|---|---|
| `/agents:kickoff` | skill | din tråd | ja, projektets skelet |
| `/agents:architect` | skill | **din tråd** | kun `docs/tasks/`, BOARD og loggen |
| `/agents:developer` | skill → agent | eget vindue | **ja — den eneste** |
| `/agents:tester` | skill → agent | eget vindue | kun `docs/tests/` |
| `/agents:security` | skill → agent | eget vindue | kun `docs/securities/` |
| `/agents:reviewer` | skill → agent | eget vindue | kun `docs/reviews/` |
| `/agents:debugger` | skill → agent | eget vindue | kun `docs/debugs/` |
| `/agents:scout` | skill → agent | eget vindue | kun `docs/map.md` |
| `/agents:status` | skill → agent | eget vindue | **nej, intet** |
| `/agents:workflow` | skill | din tråd | kun workflow-filer |
| `/agents:update` | skill | din tråd | kun `AGENTS.md` |

**Samtaleroller** — `architect` og `kickoff` — kører i din tråd, så du kan tale med dem: ét spørgsmål ad gangen, og de venter på svaret. **Rapportroller** sendes af sted, kører isoleret, og kommer tilbage med en henvisning og én linje pr. fund.

Begrænsningerne i tabellen er mandater, ikke låse. Se `GUIDE.md`.

**Du behøver ikke kalde rollerne selv** — `architect` sender dem af sted. Og der er ikke et godkendelsestrin: dens oprettelse af en opgave *er* godkendelsen, fordi den hviler på interviewet du var med i.

## Hvad ligger hvor

| Sti | Hvad |
|---|---|
| `plugins/agents/skills/` | De elleve kald. Fire kører i din tråd, syv er dispatch-skills |
| `plugins/agents/agents/` | De syv rapportroller. Værktøjslisten står her |
| `plugins/agents/skills/kickoff/AGENTS.md` | Kontrakten med `kontrakt-version`. Kopieres ind af `kickoff`, opdateres af `/agents:update` |
| `plugins/agents/skills/workflow/` | Valgfrie arbejdsgange. Kaldes eksplicit — ingen rolle foreslår dem |
| `plugins/agents/hooks/` | SessionStart-hook der genkender projekt nul |
| `.claude-plugin/marketplace.json` | Kataloget |
| `CLAUDE.md` | Reglerne der gælder når nogen redigerer *dette* repo med Claude |
| `CHANGELOG.md` | Hvad der ændrede sig ved hver udgivelse. Teksten til mailen |
| `GUIDE.md` · `PLUGIN.md` | Til mennesker |

Bemærk at `AGENTS.md` ikke ligger i roden. Den ville være en kopi, og en kopi driver.

## Ret en rolle

1. Ret filen i `plugins/agents/skills/<navn>/SKILL.md` eller `plugins/agents/agents/<navn>.md`.
2. Bump `version` i **begge** manifester: `plugins/agents/.claude-plugin/plugin.json` og `.claude-plugin/marketplace.json`.
3. Commit og push.

Glemmer du marketplacets version, ser folk stadig den gamle i kataloget.

Ændringer i en rolle bør komme af at den fejlede på samme måde tre gange — ikke af at nogen havde en holdning i går.

## Bevidst ikke med

- **`docs` som selvstændig rolle.** `reviewer` skriver den konkrete dokumentationstekst i sit fund.
- **`release` / devops.** Versionering, CI og deploy holdes uden for rollerne indtil vi har et fast flow.
- **Dispatch-agenter for samtalerollerne.** Ville betyde to filer pr. rolle der kan drive fra hinanden. Tilføjes for `developer` alene, hvis behovet for "gå væk og lav opgave 3" viser sig.
