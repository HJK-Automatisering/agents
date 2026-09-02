#!/usr/bin/env node
// SessionStart-hook. Tre tjek:
//   1. Er dette projekt nul? Udelukker de to andre — beskeden beder
//      allerede selv om .gitignore.
//   2. Er projektets AGENTS.md bagud i forhold til plugin'ets?
//   3. Mangler der en .gitignore?
// 2 og 3 kan optræde sammen. Tjek 3 er sikkerhed og må ikke tabe til 2.
//
// Skriver ren tekst til stdout, så Claude ser beskeden. SessionStart lægger
// tekst der ikke starter med '{' direkte ind som kontekst, så JSON-indpakning
// er unødvendig her.
//
// Er alt som det skal være, skrives ingenting. Fejler noget, skrives ingenting -
// en hook må aldrig blokere en session.

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
  // Frontmatter står i de første linjer. Mangler feltet, er filen fra
  // før versionsstemplet fandtes, og det regnes som version 1.
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

const PROJEKT_NUL = [
  'PROJEKT NUL. Denne mappe har ingen dokumenter, ingen CLAUDE.md, ingen kontrakt',
  'og ingen commits. Det er næsten altid rollen `kickoff` der skal køre her.',
  '',
  'Gå ikke i gang med at skrive filer. Bekræft først med brugeren at det er et nyt',
  'projekt, bed om opgaven i prosa hvis den ikke er givet, og kør så kickoff-processen:',
  'ét spørgsmål ad gangen, derefter git init og .gitignore FØR nogen anden fil oprettes.',
].join('\n');

function kontraktBagud(vProjekt, vPlugin) {
  return [
    `KONTRAKTEN ER BAGUD. Projektets AGENTS.md er version ${vProjekt}; plugin'et har version ${vPlugin}.`,
    '',
    'Reglerne i projektets kopi er altså ikke dem der gælder. Sig det til brugeren,',
    'og foreslå `/agents:update` — den henter den nye kontrakt og bevarer projektets',
    'egne afvigelser.',
    '',
    'Arbejd videre hvis brugeren beder om det, men gør opmærksom på at reglerne kan',
    'have ændret sig siden kopien blev lagt ind.',
  ].join('\n');
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

  // Den nye struktur er docs/tasks + docs/projekt.md. docs/plans er den gamle;
  // et projekt der endnu ikke er migreret, er ikke projekt nul, så den tæller med.
  const hasDocs =
    harMarkdown(path.join(cwd, 'docs', 'tasks')) ||
    findes(path.join(cwd, 'docs', 'projekt.md')) ||
    harMarkdown(path.join(cwd, 'docs', 'plans'));
  const hasClaude = findes(path.join(cwd, 'CLAUDE.md'));
  const hasGitignore = findes(path.join(cwd, '.gitignore'));
  const hasGit = findes(path.join(cwd, '.git'));
  const commits = hasGit ? getCommitAntal(cwd) : 0;

  const hasKontrakt = findes(projektKontrakt);
  const beskeder = [];

  if (!hasDocs && !hasClaude && !hasKontrakt && commits === 0) {
    // Projekt nul udelukker resten: beskeden beder allerede selv om .gitignore.
    beskeder.push(PROJEKT_NUL);
  } else {
    if (hasKontrakt) {
      // Plugin'ets kontrakt ligger i kickoff-skillen ved siden af denne hook.
      const pluginKontrakt = path.join(__dirname, '..', 'skills', 'kickoff', 'AGENTS.md');
      const vProjekt = getKontraktVersion(projektKontrakt);
      const vPlugin = getKontraktVersion(pluginKontrakt);

      if (vPlugin && vProjekt && vPlugin > vProjekt) {
        beskeder.push(kontraktBagud(vProjekt, vPlugin));
      }
    }

    // Denne er sikkerhed og ikke hygiejne, så den må ikke tabe til en
    // versionsbesked. Begge kan stå på én gang.
    if (!hasGitignore) beskeder.push(MANGLER_GITIGNORE);
  }

  if (beskeder.length > 0) {
    process.stdout.write(beskeder.join('\n\n') + '\n');
  }
} catch {
  // Stilhed er det rigtige svar. Hooken må ikke stå i vejen.
}

process.exit(0);
