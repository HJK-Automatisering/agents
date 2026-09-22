#!/usr/bin/env node
// SessionStart-hook. Fem tjek:
//   1. Er dette projekt nul? Udelukker de fire andre — beskeden beder
//      allerede selv om .gitignore.
//   2. Er projektets AGENTS.md bagud i forhold til plugin'ets?
//   3. Er en kopi af et workflow i docs/workflows/ bagud?
//   4. Ligger der en workflow-fil fra plugin'et uden det dokument der bærer
//      stemplet? Så kan udgaven ikke aflæses, og tjek 3 siger ingenting.
//   5. Mangler der en .gitignore?
// 2, 3, 4 og 5 kan optræde sammen. Tjek 5 er sikkerhed og må ikke tabe til de
// tre øvrige beskeder.
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

// Læser et versionsstempel fra frontmatter. Bruges til både kontrakten
// (kontrakt-version) og workflow-dokumenterne (skabelon-version).
function getVersion(sti, noegle) {
  let indhold;
  try {
    indhold = fs.readFileSync(sti, 'utf8');
  } catch {
    return null;
  }
  // Frontmatter står i de første linjer. Mangler feltet, er filen fra
  // før versionsstemplet fandtes, og det regnes som version 1.
  const moenster = new RegExp('^\\s*' + noegle + '\\s*:\\s*(\\d+)\\s*$');
  for (const linje of indhold.split(/\r?\n/, 12)) {
    const traef = linje.match(moenster);
    if (traef) return parseInt(traef[1], 10);
  }
  return 1;
}

// Navnene på de markdown-filer der ligger i en mappe. Tom liste hvis mappen
// ikke findes — et projekt uden workflows er ikke en fejl.
function mdFiler(mappe) {
  try {
    return fs
      .readdirSync(mappe, { withFileTypes: true })
      .filter((e) => e.isFile() && e.name.toLowerCase().endsWith('.md'))
      .map((e) => e.name);
  } catch {
    return [];
  }
}

// Navnene på de workflow-filer der ligger i en mappe. Tom liste hvis mappen
// ikke findes — et projekt uden .github/workflows er ikke en fejl.
function yamlFiler(mappe) {
  try {
    return fs
      .readdirSync(mappe, { withFileTypes: true })
      .filter((e) => {
        const n = e.name.toLowerCase();
        return e.isFile() && (n.endsWith('.yaml') || n.endsWith('.yml'));
      })
      .map((e) => e.name);
  } catch {
    return [];
  }
}

// Kendetegnet på at en workflow-fil er vores kopi: hovedet henviser til kilden
// i plugin'et. Ved siden af står stien til det dokument der bærer stemplet.
const ASSET_KILDE = 'plugins/agents/skills/workflow/assets/';
const DOKUMENT_MAPPE = 'docs/workflows/';

// Stien til det dokument en workflow-fil peger på, eller null hvis filen ikke
// er vores kopi. De to stier læses som enkeltstående tokens: sætningen omkring
// dem er ombrudt forskelligt i de to assets, så den kan ikke antages at stå
// samlet på én linje. Står kilden uden en dokumentsti, gættes der ikke på en —
// så er der intet at sige.
function dokumentFor(sti) {
  let indhold;
  try {
    indhold = fs.readFileSync(sti, 'utf8');
  } catch {
    return null;
  }
  let erKopi = false;
  let dokument = null;
  for (const token of indhold.split(/\s+/)) {
    const t = token.replace(/^[`'"([]+/, '').replace(/[`'",.;:)\]]+$/, '');
    if (t.includes(ASSET_KILDE)) erKopi = true;
    else if (!dokument && t.startsWith(DOKUMENT_MAPPE) && t.endsWith('.md')) dokument = t;
  }
  return erKopi ? dokument : null;
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

function skabelonBagud(bagud) {
  const linjer = bagud.map(
    (w) => `  - docs/workflows/${w.navn} er version ${w.vProjekt}; plugin'et har version ${w.vPlugin}.`,
  );
  return [
    'ET WORKFLOW ER BAGUD. Projektet har en kopi der ikke er den nuværende:',
    '',
    ...linjer,
    '',
    'Kopien blev lagt ind dengang workflowet blev valgt, og den følger ikke med når',
    'plugin\'et opdateres. Det workflow der kører i GitHub, er altså ikke det der står',
    'i plugin\'et — og det kan udløses af noget andet end kopien lover.',
    '',
    'Sig det til brugeren, og foreslå `/agents:update` — den bringer både',
    'workflow-filen og dokumentet ajour og bevarer projektets egen `with`-blok.',
  ].join('\n');
}

function udgaveUkendt(fund) {
  const linjer = fund.map((f) => `  - ${f.fil} peger på ${f.dokument}, som ikke findes.`);
  return [
    'EN WORKFLOW-KOPI UDEN SIT DOKUMENT. Projektet har en workflow-fil fra plugin\'et,',
    'men ikke det dokument der bærer dens stempel:',
    '',
    ...linjer,
    '',
    'Uden dokumentet kan det ikke aflæses hvilken udgave kopien er. Den kan være den',
    'nuværende, og den kan være længe forældet — det kan ikke ses herfra, og derfor',
    'siger versionstjekket heller ingenting om den.',
    '',
    'Sig det til brugeren, og foreslå `/agents:update` — den lægger dokumentet på',
    'plads og bringer workflow-filen ajour.',
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
      const vProjekt = getVersion(projektKontrakt, 'kontrakt-version');
      const vPlugin = getVersion(pluginKontrakt, 'kontrakt-version');

      if (vPlugin && vProjekt && vPlugin > vProjekt) {
        beskeder.push(kontraktBagud(vProjekt, vPlugin));
      }
    }

    // Workflows er kopier på samme måde som kontrakten, og bærer deres eget
    // stempel. Filnavnet er det samme i projektet og i plugin'et, fordi
    // workflow-skillen lægger dokumentet ind uden at omdøbe det. Mangler
    // mappen, er der intet at sige.
    const pluginWorkflows = path.join(__dirname, '..', 'skills', 'workflow');
    const projektWorkflows = path.join(cwd, 'docs', 'workflows');
    const bagud = [];
    for (const navn of mdFiler(projektWorkflows)) {
      const iPlugin = path.join(pluginWorkflows, navn);
      if (!findes(iPlugin)) continue; // Projektets eget workflow. Ikke vores at versionere.
      const vProjekt = getVersion(path.join(projektWorkflows, navn), 'skabelon-version');
      const vPlugin = getVersion(iPlugin, 'skabelon-version');
      if (vPlugin && vProjekt && vPlugin > vProjekt) {
        bagud.push({ navn, vProjekt, vPlugin });
      }
    }
    if (bagud.length > 0) beskeder.push(skabelonBagud(bagud));

    // Mangler dokumentet, er der intet stempel at sammenligne, og tjekket
    // ovenfor siger ingenting. Kopien kendes på henvisningen i filens hoved og
    // ikke på filnavnet: et projekts eget workflow kan hedde det samme som
    // vores, og det er ikke vores at melde om.
    const projektFiler = path.join(cwd, '.github', 'workflows');
    const udenDokument = [];
    for (const navn of yamlFiler(projektFiler)) {
      const dokument = dokumentFor(path.join(projektFiler, navn));
      if (!dokument) continue;
      if (findes(path.join(cwd, dokument))) continue;
      udenDokument.push({ fil: '.github/workflows/' + navn, dokument });
    }
    if (udenDokument.length > 0) beskeder.push(udgaveUkendt(udenDokument));

    // Denne er sikkerhed og ikke hygiejne, så den må ikke tabe til en
    // versionsbesked. Alle kan stå på én gang.
    if (!hasGitignore) beskeder.push(MANGLER_GITIGNORE);
  }

  if (beskeder.length > 0) {
    process.stdout.write(beskeder.join('\n\n') + '\n');
  }
} catch {
  // Stilhed er det rigtige svar. Hooken må ikke stå i vejen.
}

process.exit(0);
