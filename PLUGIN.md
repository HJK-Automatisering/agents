# Vedligeholdelse og udrulning

`agents`-repoet er **både et marketplace og et plugin**. Udviklerne tilføjer marketplacet én gang, installerer plugin'et én gang, og får derefter rolleopdateringer uden at gøre noget.

## Struktur

```
agents/
  .claude-plugin/
    marketplace.json          kataloget — skal ligge i repo-roden
  plugins/agents/
    .claude-plugin/
      plugin.json             plugin-manifestet
    skills/                   de elleve kald
      kickoff/
        SKILL.md
        AGENTS.md             kontrakten, kopieres ind i projekter
        BOARD.md
        beslutningslog.md
      architect/              navet — den eneste samtalerolle i drift
      update/                 opdaterer projektets kontrakt
      workflow/               valgfrie arbejdsgange, med assets/
      developer/  tester/  security/           ← tynde dispatch-skills
      reviewer/   debugger/  scout/  status/    ← tynde dispatch-skills
    agents/                   de syv rapportroller
      developer.md  tester.md  security.md  reviewer.md
      debugger.md   scout.md   status.md
    hooks/
      hooks.json              bruger ${CLAUDE_PLUGIN_ROOT}
      detect-project-zero.cjs
  CLAUDE.md                 reglerne for at redigere dette repo
  CHANGELOG.md              hvad der ændrede sig ved hver udgivelse
  GUIDE.md  README.md  PLUGIN.md  OPSAETNING.md
```

## De to mekanismer

**Skills** er indgangene. Alle elleve har `disable-model-invocation: true`, hvilket betyder at de **kun** kan udløses ved at nogen skriver kaldet. Aldrig af modellen ud fra brugerens prosa.

**Agenter** er implementeringerne bag de syv rapportroller. De kører i deres eget kontekstvindue, og deres `tools:`-felt afgør hvad de har med.

**`developer` er den eneste agent med `Edit`.** Den er også den eneste rolle der må ændre kode. De øvrige seks har den ikke.

**Det er en begrænsning, ikke en lås.** Alle har `Bash`, og alle på nær `status` har `Write`. Fjernelsen af `Edit` gør en kodeændring besværlig, ikke umulig. Skriv den aldrig som om den var umulig.

Agenternes `description` er skrevet som anti-trigger: *"INTERN. Kaldes kun af skillen. Vælg aldrig denne agent ud fra brugerens prosa."* Det er beskrivelsen der styrer automatisk valg, så det er dér det slås fra.

**Kun rapportroller kan overhovedet få en værktøjsliste.** En samtalerolle kører i brugerens tråd og har de værktøjer tråden har. Det er en bevidst afvejning: man kan ikke både tale med en rolle og begrænse den. Det er også grunden til at kun `architect` og `kickoff` er samtaleroller — de skal kunne spørge, og prisen er at de er ubegrænsede.

## Stjernemodellen

`architect` er nav. De øvrige roller peger ikke på hinanden; de returnerer til den. Det har tre konsekvenser for vedligeholdelsen:

- **Der er ingen routingtabel at holde konsistent.** Tidligere skulle hver rolles handoff kende den næste rolles indgang. Nu har hver agent én adresse.
- **En agents retur er en kontrakt.** `RETUR`-blokken er det eneste `architect` ser uden at åbne en fil. Ændres den, ændres hvad navet kan handle på.
- **Filerne bærer al tilstand.** `architect`s tråd er langlivet og bliver komprimeret. Enhver regel der antager at en rolle husker noget fra tidligere i tråden, er forkert.

## Manifesterne

`.claude-plugin/marketplace.json` — kataloget. `name` er offentligt; det er den del brugerne skriver efter `@`. Hver bruger kan kun have ét marketplace pr. navn.

`plugins/agents/.claude-plugin/plugin.json` — plugin'et. **`version` styrer hvornår folk får opdateringer.** En ændring slår igennem når feltet bumpes, ikke når der committes.

Begge skal bumpes ved en udgivelse.

## Prøv af før udgivelsen

```
node tools/validate.mjs
claude plugin validate ./plugins/agents
claude plugin validate .
claude --plugin-dir "<sti>/plugins/agents"
```

Inde i sessionen skal `/context` vise de syv agenter under **Custom Agents**, og `/help` skal vise de elleve skills. Er der ændringer undervejs: `/reload-plugins`.

`node tools/validate.mjs` er den samme kontrol som CI kører ved hvert push: manifesternes versioner, frontmatter i alle roller, agentnavne, kodeblokke og hooken. Den skal køres før versionen bumpes.

Virker det med `--plugin-dir` men ikke efter installation, ligger fejlen i marketplacet — ikke i plugin'et.

## Udgiv

Push til GitHub. Marketplacet *er* repoet.

## Installér

Den fulde vej fra en bar maskine — terminal, Git, Node, begge klienter — står i
`OPSAETNING.md`. Den dækker hele vejen fra en bar maskine og kan gives videre uændret.

Pr. udvikler:

```
claude plugin marketplace add HJK-Automatisering/agents
claude plugin install agents@hjk-agents --scope user
```

`--scope user`, ellers gælder det kun i den ene mappe.

Centralt, så marketplacet er registreret på forhånd — managed settings fra claude.ai admin console, leveret ved sign-in (kræver Team eller Enterprise):

```json
{
  "extraKnownMarketplaces": {
    "hjk-agents": {
      "source": { "source": "github", "repo": "HJK-Automatisering/agents" },
      "autoUpdate": true
    }
  }
}
```

`autoUpdate: true` beder om automatiske opdateringer. **Det virker ikke i skrivebordsappen.**

Appen styrer sine egne opdateringer og sætter `DISABLE_AUTOUPDATER=1` for de sessioner den starter. Det slår også marketplace-opdateringen fra, og `FORCE_AUTOUPDATE_PLUGINS=1` dækker den ikke: katalogget opdateres ikke, uanset hvor mange versioner der udgives.

Lad indstillingen stå. Den skader ikke, og den virker formentlig for den rene CLI. Men **udrulningen skal planlægges som manuel.**

### To Claude Code på samme maskine

Fælden findes på enhver maskine hvor både appen og WinGet-udgaven er installeret.

Skrivebordsappen har sin **egen** Claude Code og holder den opdateret selv. Den `claude` der ligger på PATH — fra WinGet — er en **anden** installation, og den opdaterer sig ikke, fordi appen sætter `DISABLE_AUTOUPDATER=1`.

De to versioneres uafhængigt og kan ligge måneder fra hinanden:

```
Skrivebordsappen   2.1.246
claude på PATH     2.1.185     ← 61 versioner bagud
```

De to deler `~/.claude/plugins`. Så appen læser og skriver samme tilstand som en to måneder gammel binær. Skrivebordsappen har sin egen plugin-administration under **Indstillinger → Customize → Plugins**, og den bruger appens egen, aktuelle installation. Slash-kommandoen `/plugin` findes ikke i appen — men GUI'en gør, og det er den vej der bør bruges.

Køres `claude plugin ...` i en terminal i stedet, er det WinGet-udgaven der udfører det — og den kan være måneder bagud.

Før v2.1.232 hentede Claude Code ikke marketplacet før et opslag. På 2.1.185 læste `claude plugin install` altså et cachet katalog og fandt aldrig en ny version, uden at melde fejl.

**Tjek først, hver gang noget opfører sig ulogisk:**

```
claude --version
```

Er den bagud, så opgradér før al anden fejlsøgning:

```
winget upgrade --id Anthropic.ClaudeCode
```

Luk appen helt først. Det hører i udrulningen: en gammel CLI får kommandoerne til at "virke" uden at der sker noget.

Hooken bruger `args` i exec-form. På en CLI der er ældre end feltet, køres `node` uden argumenter med hook-JSON'en på stdin, og sessionen starter med en `SyntaxError` i stedet for et tjek. Endnu en grund til at `claude --version` er det første der kontrolleres.

### Hvad hver bruger kører ved hver udgivelse

```
claude plugin marketplace update hjk-agents
claude plugin install agents@hjk-agents --scope user
```

To kommandoer, hver gang versionen bumpes. Den første henter katalogget, så klienten overhovedet ved at der findes en nyere version; den anden installerer den.

Springer man den første over, sker der ingenting — og der kommer ingen fejl. Klienten ved bare ikke bedre.

**Begge linjer hører i udgivelsesbeskeden.** Ikke "genstart appen", ikke "den kommer af sig selv".

Alternativt via Intune eller Group Policy: `HKLM\SOFTWARE\Policies\ClaudeCode`, eller filen `C:\Program Files\ClaudeCode\managed-settings.json`. Bemærk at `C:\ProgramData\ClaudeCode\managed-settings.json` er **udgået** fra v2.1.75 og stadig optræder i ældre vejledninger.

Om managed settings også fjerner `install`-kommandoen er dokumentationen ikke entydig om. Indtil det er efterprøvet på en rigtig maskine, er udgangspunktet én kommando pr. udvikler.

## Kontrakten driver

`AGENTS.md` kopieres ind i projektet af `kickoff`. Den følger **ikke** med når plugin'et opdateres, og rollerne læser projektets kopi.

Derfor har kontrakten `kontrakt-version` i frontmatter. Den bumpes når en regel ændres — og SessionStart-hooken sammenligner projektets tal med plugin'ets og siger til når kopien er bagud.

**`kontrakt-version` skal bumpes hver gang en regel i kontrakten ændres.** Glemmes det, siger hooken ingenting, og projekterne kører videre efter de gamle regler uden at nogen ser det. Det er den fejl der er sværest at opdage, fordi rollerne opfører sig konsekvent — bare efter det forkerte.

Versionstjekket ligger i hooken og ikke i rollerne, så det findes ét sted i stedet for elleve der kan drive fra hinanden.

## Fælden: dobbelte rollefiler

Et projekts eller en brugers `.claude/agents/` **overskriver** plugin-agenter med samme navn. Ligger en rolle begge steder, rammer en rettelse i plugin'et ingenting.

I projekter hvor roller tidligere er kopieret ind, skal mappen slettes. `kickoff` siger det også selv, hver gang den ser en.

Undtagelsen er bevidst brug: skal en ændring af én rolle prøves i ét projekt, lægges netop den fil lokalt. Virker den, løftes den op i plugin'et, og den lokale slettes.

## Udgiv en rolleændring

En udgivelse er en bevidst handling, ikke noget der følger med hver commit. Saml flere ændringer, og udgiv når de hører sammen.

1. Ret filerne, og commit så tit det passer. **Uden at røre versionen.**
2. Skriv posten i `CHANGELOG.md` **først**. Det er teksten til
   udgivelsesbeskeden, og det er dér det viser sig om ændringerne hører sammen.
3. Bump `version` i plugin-manifestet.
4. Bump samme `version` i marketplace-manifestet.
5. Er en regel i kontrakten ændret: bump `kontrakt-version`.
6. Kør `node tools/validate.mjs`.
7. Commit og push.

Ingen rolle må bumpe versionen — det står i kontrakten. Det gælder også en model der redigerer rollerne.

Udviklerne får den ved næste opdateringstjek, eller med `/plugin marketplace update hjk-agents`.

## Tilføj et workflow

Workflows ligger i `plugins/agents/skills/workflow/`. Skillen læser hver `.md`-fil der og tilbyder dem. Et nyt tilføjes ved at lægge en fil - ikke ved at rette i `SKILL.md`.

```markdown
---
navn: <kort-kebab-navn>
formål: <en linje. Det er den tekst udvikleren ser når der spørges.>
foreslå-ja-når: <kriterium der kan afgøres ud fra projektets dokument og CLAUDE.md>
filer:
  - fra: assets/<fil>
    til: <sti i projektet>
---

# <Navn>

## Brug det når
## Brug det ikke når
## Forudsætninger projektet skal opfylde
## Hvem gør hvad
```

Tre regler:

- Et workflow må **ikke** modsige `AGENTS.md`. Det lægger trin ovenpå; det fjerner ikke grænser.
- **Skriv forudsætningerne ned.** Det vigtigste afsnit er ikke hvad workflowet gør, men hvad projektet skal opfylde for at det virker. Skillen gør hver uopfyldt forudsætning til en opgave på `BOARD.md`.
- `foreslå-ja-når` skal kunne afgøres uden at gætte. Kan det ikke, lad feltet stå tomt, så foreslås nej.

Filer under `assets/` er **snapshots**. Til få projekter er en kopi fin; til mange er et reusable workflow bedre, så der kun er et sted at bumpe SHA-pins.

## Rollback

Revertér commit'en og bump versionen igen. Skal en udvikler videre med det samme, kan de lægge en lokal `.claude/agents/<rolle>.md` som midlertidig override — og slette den igen bagefter.
