# SessionStart-hook: genkender projekt nul og en manglende .gitignore.
#
# Skriver JSON med additionalContext til stdout, saa Claude ser beskeden.
# Er alt som det skal vaere, skrives ingenting. Fejler noget, skrives ingenting -
# en hook maa aldrig blokere en session.

$ErrorActionPreference = 'SilentlyContinue'

try {
    # Uden dette mumler PowerShell 5.1 alle ikke-ASCII-tegn.
    [Console]::OutputEncoding = [System.Text.Encoding]::UTF8

    # Stien kommer fra hookens JSON paa stdin. Kan den ikke laeses, bruger vi
    # arbejdsmappen — et daarligt parse maa ikke slaa hele tjekket ud.
    $cwd = (Get-Location).Path
    try {
        $raw = [Console]::In.ReadToEnd()
        if ($raw) {
            $payloadIn = $raw | ConvertFrom-Json
            if ($payloadIn.cwd) { $cwd = $payloadIn.cwd }
        }
    } catch { }

    $hasSpecs     = @(Get-ChildItem -Path (Join-Path $cwd 'docs\specs') -Filter '*.md' -File).Count -gt 0
    $hasClaude    = Test-Path (Join-Path $cwd 'CLAUDE.md')
    $hasGitignore = Test-Path (Join-Path $cwd '.gitignore')
    $hasGit       = Test-Path (Join-Path $cwd '.git')

    $commits = 0
    if ($hasGit) {
        $count = & git -C $cwd rev-list --count HEAD 2>$null
        if ($LASTEXITCODE -eq 0 -and $count) { $commits = [int]$count }
    }

    $context = $null

    if (-not $hasSpecs -and -not $hasClaude -and $commits -eq 0) {
        $context = @(
            'PROJEKT NUL. Denne mappe har ingen specs, ingen CLAUDE.md og ingen commits.',
            'Det er næsten altid rollen `kickoff` der skal køre her - se .claude/agents/kickoff.md.',
            '',
            'Gå ikke i gang med at skrive filer. Bekræft først med brugeren at det er et nyt',
            'projekt, bed om opgaven i prosa hvis den ikke er givet, og kør så kickoff-processen:',
            'interview på maks syv spørgsmål med foreslåede svar, derefter git init og .gitignore',
            'FØR nogen anden fil oprettes.'
        ) -join "`n"
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
