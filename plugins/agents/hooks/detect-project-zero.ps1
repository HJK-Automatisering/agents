# SessionStart-hook. Tre tjek, i prioriteret raekkefoelge:
#   1. Er dette projekt nul?
#   2. Er projektets AGENTS.md bagud i forhold til plugin'ets?
#   3. Mangler der en .gitignore?
#
# Skriver JSON med additionalContext til stdout, saa Claude ser beskeden.
# Er alt som det skal vaere, skrives ingenting. Fejler noget, skrives ingenting -
# en hook maa aldrig blokere en session.

$ErrorActionPreference = 'SilentlyContinue'

function Get-KontraktVersion {
    param([string]$Sti)
    if (-not (Test-Path $Sti)) { return $null }
    # Frontmatter staar i de foerste linjer. Mangler feltet, er filen fra
    # foer versionsstemplet fandtes, og det regnes som version 1.
    foreach ($linje in (Get-Content -Path $Sti -TotalCount 12)) {
        if ($linje -match '^\s*kontrakt-version\s*:\s*(\d+)\s*$') {
            return [int]$Matches[1]
        }
    }
    return 1
}

try {
    [Console]::OutputEncoding = [System.Text.Encoding]::UTF8

    $cwd = (Get-Location).Path
    try {
        $raw = [Console]::In.ReadToEnd()
        if ($raw) {
            $payloadIn = $raw | ConvertFrom-Json
            if ($payloadIn.cwd) { $cwd = $payloadIn.cwd }
        }
    } catch { }

    $projektKontrakt = Join-Path $cwd 'AGENTS.md'

    $hasDocs      = @(Get-ChildItem -Path (Join-Path $cwd 'docs\plans') -Filter '*.md' -File).Count -gt 0
    $hasClaude    = Test-Path (Join-Path $cwd 'CLAUDE.md')
    $hasGitignore = Test-Path (Join-Path $cwd '.gitignore')
    $hasGit       = Test-Path (Join-Path $cwd '.git')

    $commits = 0
    if ($hasGit) {
        $count = & git -C $cwd rev-list --count HEAD 2>$null
        if ($LASTEXITCODE -eq 0 -and $count) { $commits = [int]$count }
    }

    $context = $null

    if (-not $hasDocs -and -not $hasClaude -and $commits -eq 0) {
        $context = @(
            'PROJEKT NUL. Denne mappe har ingen dokumenter, ingen CLAUDE.md og ingen commits.',
            'Det er næsten altid rollen `kickoff` der skal køre her.',
            '',
            'Gå ikke i gang med at skrive filer. Bekræft først med brugeren at det er et nyt',
            'projekt, bed om opgaven i prosa hvis den ikke er givet, og kør så kickoff-processen:',
            'ét spørgsmål ad gangen, derefter git init og .gitignore FØR nogen anden fil oprettes.'
        ) -join "`n"
    }
    elseif (Test-Path $projektKontrakt) {
        # Plugin'ets kontrakt ligger i kickoff-skillen ved siden af denne hook.
        $pluginKontrakt = Join-Path $PSScriptRoot '..\skills\kickoff\AGENTS.md'
        $vProjekt = Get-KontraktVersion $projektKontrakt
        $vPlugin  = Get-KontraktVersion $pluginKontrakt

        if ($vPlugin -and $vProjekt -and $vPlugin -gt $vProjekt) {
            $context = @(
                "KONTRAKTEN ER BAGUD. Projektets AGENTS.md er version $vProjekt; plugin'et har version $vPlugin.",
                '',
                'Reglerne i projektets kopi er altså ikke dem der gælder. Sig det til brugeren,',
                'og foreslå `/agents:update` — den henter den nye kontrakt og bevarer projektets',
                'egne afvigelser.',
                '',
                'Arbejd videre hvis brugeren beder om det, men gør opmærksom på at reglerne kan',
                'have ændret sig siden kopien blev lagt ind.'
            ) -join "`n"
        }
        elseif (-not $hasGitignore) {
            $context = @(
                'ADVARSEL: projektet har ingen .gitignore.',
                'Ifølge AGENTS.md skal den findes før der oprettes flere filer. Opret den nu,',
                'tilpasset projektets stak, og inkluder .env og alt der kan indeholde hemmeligheder.'
            ) -join "`n"
        }
    }
    elseif (-not $hasGitignore) {
        $context = @(
            'ADVARSEL: projektet har ingen .gitignore.',
            'Ifølge AGENTS.md skal den findes før der oprettes flere filer. Opret den nu,',
            'tilpasset projektets stak, og inkluder .env og alt der kan indeholde hemmeligheder.'
        ) -join "`n"
    }

    if ($context) {
        $payload = @{
            hookSpecificOutput = @{
                hookEventName     = 'SessionStart'
                additionalContext = $context
            }
        }
        $payload | ConvertTo-Json -Depth 5 -Compress
    }
}
catch {
    # Stilhed er det rigtige svar. Hooken maa ikke staa i vejen.
}

exit 0
