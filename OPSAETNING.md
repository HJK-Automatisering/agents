# Fra bar maskine til kørende opsætning

Til dig der skal have rollerne op på en ny pc. Regn med 20-30 minutter, hvoraf
det meste er installationer.

`GUIDE.md` er næste skridt — den handler om at *bruge* rollerne. Den her handler
kun om at komme i gang.

## Du kan bruge to klienter

**Skrivebordsappen** og **CLI'en i en terminal** er sideordnede. Vælg selv
bagefter; du kan bruge begge på samme maskine.

Men **den første opsætning kræver CLI'en.** Marketplacet skal tilføjes én gang
fra terminalen, hvorefter appen kan se det. Derfor installerer alle CLI'en i
punkt 3 — også dem der aldrig får den åbnet igen.

## 0. Terminalen og rettighederne

Punkt 1-6 køres i **PowerShell** — ikke cmd, ikke Git Bash. På Windows 11 er det
det du får ved at åbne **Terminal** fra Start-menuen.

| Punkt | Vindue | Sådan |
|---|---|---|
| 1-4, installationerne | PowerShell **som administrator** | Højreklik på Terminal i Start-menuen → *Kør som administrator* |
| 5-6, login og plugin | Almindelig PowerShell | Terminal fra Start-menuen |

Hæv administratorrettighederne på pc'en **inden** du begynder. Uden dem fejler
især Node-installationen midtvejs, og en halvt installeret Node er værre end
ingen.

Git Bash bliver installeret sammen med Git, og Claude Code bruger den til sit
Bash-værktøj — men du skal ikke selv sidde i den.

Kør heller ikke kommandoerne i terminalen *inde i* en Claude Code-session. Brug
et rigtigt vindue.

## 1. Git

*PowerShell som administrator.*

```
winget install --id Git.Git
```

Identiteten sættes i en **almindelig** PowerShell — den skal gælde din bruger,
ikke administratoren. Ellers kan rollerne ikke committe:

```
git config --global user.name "Fornavn Efternavn"
git config --global user.email "din@mail.dk"
```

## 2. Node

*PowerShell som administrator.*

Plugin'ets SessionStart-hook kører på systemets Node. Claude Code har sin egen
indbyggede runtime, men den er ikke tilgængelig for hooks.

```
winget install --id OpenJS.NodeJS.LTS
```

Luk vinduet og åbn et **nyt** — PATH opdateres ikke i et vindue der allerede
står åbent:

```
node --version
```

Mangler Node, virker alt andet: alle elleve kald, alle roller, kontrakten. Du
mister kun de tre tjek ved sessionsstart, **og det meldes ikke.** Så skal du selv
huske `/agents:update` når plugin'et er opdateret.

## 3. Claude Code i terminalen

*PowerShell som administrator.*

```
winget install --id Anthropic.ClaudeCode
```

Den er obligatorisk, uanset hvilken klient du ender med at bruge — se afsnittet
øverst.

## 4. Skrivebordsappen og VS Code

Vil du bruge appen, hentes den fra claude.ai og installeres som et almindeligt
program. **Den har sin egen Claude Code indbygget** og holder den opdateret selv;
den `claude` du installerede i punkt 3 er en anden installation. De deler
`~/.claude/plugins`. Det er værd at huske, og det står i punkt 7.

Koder I i VS Code:

```
winget install --id Microsoft.VisualStudioCode
```

`kickoff` skriver selv `.vscode/settings.json` i Python-projekter, så VS Codes
indbyggede terminal havner i projektets `.venv` uden at du gør noget. Prompten
viser ikke `(.venv)` — det er med vilje.

## 5. Log ind

Log ind i den klient du skal bruge. Bruger du begge, gør du det i begge.

CLI'en — *almindelig PowerShell*, ikke administrator. Logger du ind som
administrator, ligger loginnet på den forkerte profil:

```
claude
```

Følg dialogen, og afslut med `/exit`.

Appen logger du ind i, første gang du åbner den.

## 6. Plugin'et — én gang pr. maskine, fra terminalen

*Almindelig PowerShell.*

```
claude plugin marketplace add HJK-Automatisering/agents
claude plugin install agents@hjk-agents --scope user
```

`--scope user` er det vigtige. Uden den gælder rollerne kun i den mappe du står
i.

Herefter kan appen se det samme. Appen har sin egen plugin-administration under
**Indstillinger → Customize → Plugins**; slash-kommandoen `/plugin` findes ikke
der.

## 7. Kontrollér at det er landet

Start en session — i appen eller i terminalen — og se efter:

- `/help` viser de elleve `agents:`-kald
- `/context` viser de syv agenter under **Custom Agents**

Hvilken version der faktisk er installeret:

```
claude plugin list
```

Den viser den **installerede** version — ikke katalogets. Er de uenige, mangler
der en `claude plugin update`; se punkt 9.

Gør den ikke det, så tjek CLI'ens version **før** du fejlsøger noget andet:

```
claude --version
```

Er den bagud, luk appen helt og opgradér i en PowerShell som administrator:

```
winget upgrade --id Anthropic.ClaudeCode
```

Appen sætter `DISABLE_AUTOUPDATER=1` for de sessioner den starter, så CLI'en
opdaterer sig ikke selv. En gammel CLI læser et cachet katalog og finder aldrig
den nye version — uden at melde fejl. Se `PLUGIN.md`.

## 8. Første projekt

I appen: åbn projektmappen i Code-fanen.

I terminalen:

```
cd C:\sti\til\dit\projekt
claude
```

Begge steder kalder du så:

```
/agents:kickoff
```

Er projektet tomt, kører den hele interviewet. Findes koden allerede uden
kontrakt, lægger den bare kontrakt og skelet ind. Er alt på plads, siger den det
og rører ingenting.

Har du en prosatekst med opgaven, giv den med råt:

```
/agents:kickoff

Her er opgaven: <indsæt teksten, ufuldstændig og løs som den er>
```

Derefter er `/agents:architect` indgangen til alt arbejde. Den interviewer dig,
opretter opgaverne og sender de øvrige roller af sted. Resten står i `GUIDE.md`.

## 9. Ved hver ny version — begge, hver gang

*Almindelig PowerShell.* Også hvis du kun bruger appen: automatiske
marketplace-opdateringer virker ikke der.

```
claude plugin marketplace update hjk-agents
claude plugin update agents@hjk-agents --scope user
```

**`install` opgraderer ikke.** Er plugin'et installeret, svarer den
`already installed` og gør ingenting — med et flueben og uden en fejl. Det er
`update` der flytter versionen, og den skriver `Restart to apply changes`: luk
klienten og åbn den igen, ellers kører sessionen videre på den gamle udgave.

Springer du katalogopdateringen over, sker der ingenting, og der kommer heller
ingen fejl. Klienten ved bare ikke bedre.

## To fælder der ser ud som om alt virker

**En `.claude/agents/`-mappe i projektet** overskriver plugin-rollerne. Har nogen
tidligere kopieret roller ind, skal mappen slettes — ellers rammer centrale
rettelser ingenting.

**"Spørg ikke igen"** i Claude Codes tilladelsesdialog skriver en linje i
`.claude/settings.local.json`. Trykker du på den ved `git push`, prompter
klienten aldrig igen, uanset hvad rollen gør. Fjern linjen hvis det sker.
