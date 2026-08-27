#!/usr/bin/env node
// SessionStart-hook. Tre tjek, i prioriteret raekkefoelge:
//   1. Er dette projekt nul?
//   2. Er projektets AGENTS.md bagud i forhold til plugin'ets?
//   3. Mangler der en .gitignore?
//
// Skriver ren tekst til stdout, saa Claude ser beskeden. SessionStart lægger
// tekst der ikke starter med '{' direkte ind som kontekst, saa JSON-indpakning
// er unoedvendig her.
//
// Er alt som det skal vaere, skrives ingenting. Fejler noget, skrives ingenting -
// en hook maa aldrig blokere en session.

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

function findes(sti) {
  try {
    fs.statSync(sti);
    return true;
  } catch {
    return false;
  }
}

function harMarkdown(mappe) {
  try {
    return fs
      .readdirSync(mappe, { withFileTypes: true })
      .some((e) => e.isFile() && e.name.toLowerCase().endsWith('.md'));
  } catch {
    return false;
  }
}

function getKontraktVersion(sti) {
  let indhold;
  try {
    indhold = fs.readFileSync(sti, 'utf8');
  } catch {
    return null;
  }
  // Frontmatter staar i de foerste linjer. Mangler feltet, er filen fra
  // foer versionsstemplet fandtes, og det regnes som version 1.
  for (const linje of indhold.split(/\r?\n/, 12)) {
    const traef = linje.match(/^\s*kontrakt-version\s*:\s*(\d+)\s*$/);
    if (traef) return parseInt(traef[1], 10);
  }
  return 1;
}

function getCommitAntal(cwd) {
  try {
    const ud = execFileSync('git', ['-C', cwd, 'rev-list', '--count', 'HEAD'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    const antal = parseInt(ud.trim(), 10);
    return Number.isFinite(antal) ? antal : 0;
  } catch {
    return 0;
  }
}

const MANGLER_GITIGNORE = [
  'ADVARSEL: projektet har ingen .gitignore.',
  'Ifølge AGENTS.md skal den findes før der oprettes flere filer. Opret den nu,',
  'tilpasset projektets stak, og inkluder .env og alt der kan indeholde hemmeligheder.',
].join('\n');

try {
  let cwd = process.cwd();
  try {
    const raa = fs.readFileSync(0, 'utf8');
    if (raa.trim()) {
      const nyttelast = JSON.parse(raa);
      if (nyttelast && typeof nyttelast.cwd === 'string' && nyttelast.cwd) {
        cwd = nyttelast.cwd;
      }
    }
  } catch {
    // Ingen eller ugyldig stdin. process.cwd() er et fornuftigt fald tilbage.
  }

  const projektKontrakt = path.join(cwd, 'AGENTS.md');

  const hasDocs = harMarkdown(path.join(cwd, 'docs', 'plans'));
  const hasClaude = findes(path.join(cwd, 'CLAUDE.md'));
  const hasGitignore = findes(path.join(cwd, '.gitignore'));
  const hasGit = findes(path.join(cwd, '.git'));
  const commits = hasGit ? getCommitAntal(cwd) : 0;

  let context = null;

  if (!hasDocs && !hasClaude && commits === 0) {
    context = [
      'PROJEKT NUL. Denne mappe har ingen dokumenter, ingen CLAUDE.md og ingen commits.',
      'Det er næsten altid rollen `kickoff` der skal køre her.',
      '',
      'Gå ikke i gang med at skrive filer. Bekræft først med brugeren at det er et nyt',
      'projekt, bed om opgaven i prosa hvis den ikke er givet, og kør så kickoff-processen:',
      'ét spørgsmål ad gangen, derefter git init og .gitignore FØR nogen anden fil oprettes.',
    ].join('\n');
  } else if (findes(projektKontrakt)) {
    // Plugin'ets kontrakt ligger i kickoff-skillen ved siden af denne hook.
    const pluginKontrakt = path.join(__dirname, '..', 'skills', 'kickoff', 'AGENTS.md');
    const vProjekt = getKontraktVersion(projektKontrakt);
    const vPlugin = getKontraktVersion(pluginKontrakt);

    if (vPlugin && vProjekt && vPlugin > vProjekt) {
      context = [
        `KONTRAKTEN ER BAGUD. Projektets AGENTS.md er version ${vProjekt}; plugin'et har version ${vPlugin}.`,
        '',
        'Reglerne i projektets kopi er altså ikke dem der gælder. Sig det til brugeren,',
        'og foreslå `/agents:update` — den henter den nye kontrakt og bevarer projektets',
        'egne afvigelser.',
        '',
        'Arbejd videre hvis brugeren beder om det, men gør opmærksom på at reglerne kan',
        'have ændret sig siden kopien blev lagt ind.',
      ].join('\n');
    } else if (!hasGitignore) {
      context = MANGLER_GITIGNORE;
    }
  } else if (!hasGitignore) {
    context = MANGLER_GITIGNORE;
  }

  if (context) {
    process.stdout.write(context + '\n');
  }
} catch {
  // Stilhed er det rigtige svar. Hooken maa ikke staa i vejen.
}

process.exit(0);
