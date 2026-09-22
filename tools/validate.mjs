#!/usr/bin/env node
// Kontrol af plugin'et foer udgivelse. Koerer ogsaa i CI.
//
//   node tools/validate.mjs
//
// Kontrollerer PLUGIN'ET - ikke repoets arbejdsproces. Der er ingen numre,
// intet BOARD og ingen krav til grene her; dette repo er kildekode, ikke et
// projekt der koeres med metoden. Se CLAUDE.md.
//
// Ingen afhaengigheder. Frontmatter er simple noegle/vaerdi-linjer og een
// liste, saa der parses linjevis frem for at traekke en YAML-pakke ind.

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname, resolve, basename, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const ROD = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PLUGIN = join(ROD, 'plugins', 'agents');
const SKILLS = join(PLUGIN, 'skills');
const AGENTER = join(PLUGIN, 'agents');

const fejl = [];
const advarsler = [];
const sig = (liste, hvor, hvad) => liste.push({ hvor, hvad });

const laes = (sti) => readFileSync(sti, 'utf8');
const relativ = (sti) => sti.slice(ROD.length + 1).split(sep).join('/');
const mapper = (sti) =>
  readdirSync(sti, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name);
const mdFiler = (sti) =>
  readdirSync(sti, { withFileTypes: true })
    .filter((e) => e.isFile() && e.name.endsWith('.md'))
    .map((e) => join(sti, e.name));

function frontmatter(tekst) {
  const linjer = tekst.split('\n');
  if (linjer[0].trim() !== '---') return null;
  const slut = linjer.indexOf('---', 1);
  if (slut < 0) return null;
  return linjer.slice(1, slut).join('\n');
}

function felt(fm, noegle) {
  for (const linje of (fm || '').split('\n')) {
    const i = linje.indexOf(':');
    if (i < 0) continue;
    if (linje.slice(0, i).trim() === noegle) return linje.slice(i + 1).trim();
  }
  return null;
}

// Kodeblokke efter CommonMark: en fence lukkes af mindst lige saa mange tegn
// af samme slags, uden infostreng.
const BT = String.fromCharCode(96);
const TILDE = String.fromCharCode(126);

function blokke(tekst) {
  const ud = [];
  let aaben = null;
  tekst.split('\n').forEach((linje, i) => {
    const t = linje.trimStart();
    let tegn = null;
    if (t.startsWith(BT + BT + BT)) tegn = BT;
    else if (t.startsWith(TILDE + TILDE + TILDE)) tegn = TILDE;
    if (!tegn) return;
    let n = 0;
    while (t[n] === tegn) n++;
    const info = t.slice(n).trim();
    if (aaben === null) {
      aaben = { tegn, n, info, start: i + 1 };
    } else if (tegn === aaben.tegn && n >= aaben.n && !info) {
      ud.push(Object.assign({}, aaben, { slut: i + 1 }));
      aaben = null;
    }
  });
  return { liste: ud, uafsluttet: aaben };
}

// ---------------------------------------------------------------- 1. JSON
const manifester = {};
for (const sti of [
  join(ROD, '.claude-plugin', 'marketplace.json'),
  join(PLUGIN, '.claude-plugin', 'plugin.json'),
  join(PLUGIN, 'hooks', 'hooks.json'),
]) {
  try {
    manifester[basename(sti)] = JSON.parse(laes(sti));
  } catch (e) {
    sig(fejl, relativ(sti), 'ugyldig JSON: ' + e.message);
  }
}

// ------------------------------------------------ 2. Versionerne foelges ad
const mk = manifester['marketplace.json'];
const pl = manifester['plugin.json'];
if (mk && pl) {
  const post = (mk.plugins || []).find((p) => p.name === pl.name);
  if (!post) {
    sig(fejl, '.claude-plugin/marketplace.json', 'har ingen post for plugin-navnet ' + pl.name);
  } else if (post.version !== pl.version) {
    sig(fejl, 'manifesterne',
      'version foelges ikke ad: marketplace har ' + post.version + ', plugin har ' + pl.version +
      '. Bumpes kun den ene, ser brugerne stadig den gamle i kataloget.');
  }
}

// ----------------------------------- 3+4. Skills: frontmatter og de to felter
const skillNavne = mapper(SKILLS);
for (const navn of skillNavne) {
  const sti = join(SKILLS, navn, 'SKILL.md');
  if (!existsSync(sti)) {
    sig(fejl, 'plugins/agents/skills/' + navn, 'mangler SKILL.md');
    continue;
  }
  const fm = frontmatter(laes(sti));
  if (fm === null) {
    sig(fejl, relativ(sti), 'frontmatter mangler eller er ikke lukket');
    continue;
  }
  if (!felt(fm, 'description')) sig(fejl, relativ(sti), 'mangler description');
  if (felt(fm, 'disable-model-invocation') !== 'true') {
    sig(fejl, relativ(sti),
      'mangler disable-model-invocation: true - uden den kan modellen selv udloese rollen');
  }
}

// ------------------------------------------ 3. Agenter: frontmatter og navn
const agentFiler = mdFiler(AGENTER);
for (const sti of agentFiler) {
  const fm = frontmatter(laes(sti));
  if (fm === null) {
    sig(fejl, relativ(sti), 'frontmatter mangler eller er ikke lukket');
    continue;
  }
  const navn = felt(fm, 'name');
  if (!navn) sig(fejl, relativ(sti), 'mangler name');
  else if (navn !== basename(sti, '.md')) {
    sig(fejl, relativ(sti), 'name: ' + navn + ' passer ikke til filnavnet');
  }
  if (!felt(fm, 'description')) sig(fejl, relativ(sti), 'mangler description');
}

// -------------------------- 5+8. subagent_type: praefiks, og agenten findes
for (const navn of skillNavne) {
  const sti = join(SKILLS, navn, 'SKILL.md');
  if (!existsSync(sti)) continue;
  for (const linje of laes(sti).split('\n')) {
    const i = linje.indexOf('subagent_type');
    if (i < 0) continue;
    const efter = linje.slice(i + 'subagent_type'.length).replace(':', ' ');
    const traef = efter.match(/[A-Za-z0-9:_-]+/);
    const vaerdi = traef ? traef[0] : '';
    if (!vaerdi.startsWith('agents:')) {
      sig(fejl, relativ(sti),
        'subagent_type: ' + vaerdi + ' mangler praefikset. Plugin-agenter hedder agents:<navn>, ' +
        'og opslaget fjerner ikke praefikset - kaldet fejler.');
      continue;
    }
    const agent = vaerdi.slice('agents:'.length);
    if (!existsSync(join(AGENTER, agent + '.md'))) {
      sig(fejl, relativ(sti), 'peger paa agenten ' + agent + ', men der findes ingen ' + agent + '.md');
    }
  }
}

// -------------------------------------------------- 10. Workflows: assets
const WF = join(SKILLS, 'workflow');
const FELT_FORMAAL = 'form' + String.fromCharCode(229) + 'l';
const FELT_JANAAR = 'foresl' + String.fromCharCode(229) + '-ja-n' + String.fromCharCode(229) + 'r';
const workflowDokumenter = [];
if (existsSync(WF)) {
  for (const sti of mdFiler(WF)) {
    if (basename(sti) === 'SKILL.md') continue;
    const fm = frontmatter(laes(sti));
    if (fm === null) {
      sig(fejl, relativ(sti), 'workflow-dokument uden frontmatter');
      continue;
    }
    for (const n of ['navn', FELT_FORMAAL, FELT_JANAAR, 'skabelon-version']) {
      if (!felt(fm, n)) sig(fejl, relativ(sti), 'mangler feltet ' + n);
    }
    const version = felt(fm, 'skabelon-version');
    if (version && !/^[0-9]+$/.test(version)) {
      sig(fejl, relativ(sti), 'skabelon-version: ' + version + ' er ikke et heltal');
    }

    // Filerne dokumentet daekker: det selv, dem der kopieres ind i et projekt,
    // og de assets der baerer dokumentets navn. Standalone-udgaven staar ikke i
    // filer:, fordi den ikke kopieres automatisk - men den hoerer til samme
    // skabelon og maa ikke drive fra den.
    const assets = new Set();
    for (const linje of fm.split('\n')) {
      const t = linje.trim();
      if (!t.startsWith('- fra:')) continue;
      const fra = t.slice('- fra:'.length).trim();
      if (!existsSync(join(WF, fra))) {
        sig(fejl, relativ(sti), 'filer: peger paa ' + fra + ', som ikke findes');
        continue;
      }
      assets.add(join(WF, fra));
    }
    const praefiks = basename(sti, '.md');
    const assetMappe = join(WF, 'assets');
    if (existsSync(assetMappe)) {
      for (const navn of readdirSync(assetMappe)) {
        if (navn.startsWith(praefiks + '.') || navn.startsWith(praefiks + '-')) {
          assets.add(join(assetMappe, navn));
        }
      }
    }
    // Hooken kender en kopi i et projekts .github/workflows/ paa de to stier i
    // filens hoved: kilden i plugin'et, og dokumentet der baerer stemplet.
    // Ryddes de vaek, bliver kopien usynlig for hooken uden at noget fejler.
    const dokumentSti = 'docs/workflows/' + basename(sti);
    for (const asset of assets) {
      const tekst = laes(asset);
      const mangler = [];
      if (!tekst.includes('plugins/agents/skills/workflow/assets/')) {
        mangler.push('stien til kilden i plugin\'et');
      }
      if (!tekst.includes(dokumentSti)) mangler.push(dokumentSti);
      if (mangler.length) {
        sig(fejl, relativ(asset),
          'mangler ' + mangler.join(' og ') + ' i filens hoved. Hooken kender projektets ' +
          'kopi paa netop de stier - uden dem kan den ikke se at dokumentet mangler.');
      }
    }

    workflowDokumenter.push({ sti, version, assets: [...assets] });
  }
}

// ------------------------------ 6+7. Alle markdown-filer: ord og kodeblokke
const AA = String.fromCharCode(229);
const AE = String.fromCharCode(230);
const OE = String.fromCharCode(248);
// Paastande om at en rolle er teknisk forhindret i at skrive. Hver post kan
// baere en undtagelse: den formulering hvor ordet er korrekt netop fordi det
// bliver benaegtet. Uden den ville kontrollen fange sin egen rettelse.
const FORBUDTE = [
  { ord: 'h' + AA + 'ndh' + AE + 'vet sp' + AE + 'rring' },
  { ord: 'h' + AA + 'ndh' + AE + 'vede sp' + AE + 'rringer' },
  { ord: 'v' + AE + 'rkt' + OE + 'jssp' + AE + 'rring' },
  { ord: 'kan ikke rette noget' },
  {
    ord: 'teknisk sp' + AE + 'rret',
    medmindre: 'Ingen rolle er teknisk sp' + AE + 'rret',
  },
];

function alleMd(sti, ud = []) {
  for (const e of readdirSync(sti, { withFileTypes: true })) {
    if (e.name === '.git' || e.name === 'node_modules') continue;
    const p = join(sti, e.name);
    if (e.isDirectory()) alleMd(p, ud);
    else if (e.name.endsWith('.md')) ud.push(p);
  }
  return ud;
}

const mdListe = alleMd(ROD);
for (const sti of mdListe) {
  const tekst = laes(sti);
  const r = relativ(sti);
  const linjer = tekst.split('\n');

  for (const p of FORBUDTE) {
    if (!tekst.includes(p.ord)) continue;
    if (p.medmindre && tekst.includes(p.medmindre)) continue;
    sig(fejl, r,
      'indeholder "' + p.ord + '". En agents tools-liste er ikke en laas, saa laenge Write ' +
      'eller Bash er med. Skriv ikke at noget er umuligt.');
  }

  const fund = blokke(tekst);
  if (fund.uafsluttet) {
    sig(fejl, r, 'kodeblok aabnet paa linje ' + fund.uafsluttet.start + ' lukkes aldrig');
  }
  for (const b of fund.liste) {
    if (b.info) continue;
    const overskrift = linjer.slice(b.start, b.slut - 1).find((l) => l.startsWith('## '));
    if (overskrift) {
      sig(fejl, r,
        'kodeblokken paa linje ' + b.start + '-' + b.slut + ' har ingen sprogangivelse, men ' +
        'indeholder overskriften "' + overskrift.trim() + '". Det sker naar en indre fence ' +
        'lukker en ydre skabelon - brug fire backticks udenom skabelonen.');
    }
  }
}

// ---------------------------------------------------------- 9. Hooken koerer
const hook = join(PLUGIN, 'hooks', 'detect-project-zero.cjs');
if (!existsSync(hook)) {
  sig(fejl, 'plugins/agents/hooks/detect-project-zero.cjs', 'findes ikke');
} else {
  try {
    execFileSync(process.execPath, ['--check', hook], { stdio: ['ignore', 'ignore', 'pipe'] });
  } catch (e) {
    const l = String(e.stderr || e.message).trim().split('\n').filter(Boolean);
    const linje = l.find((x) => x.includes('Error')) || l[0] || 'ukendt';
    sig(fejl, relativ(hook), 'syntaksfejl: ' + linje.trim());
  }
}

// ------------------ 11. ADVARSEL: kontrakten aendret uden bump af versionen
const base = process.env.BASE_REF || 'origin/main';

// Filens indhold paa sammenligningsgrenen. null naar der intet er at
// sammenligne med - ingen base, eller filen er ny. Saa springes tjekket over.
function fraBase(relativSti) {
  try {
    return execFileSync('git', ['show', base + ':' + relativSti], {
      cwd: ROD, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'],
    });
  } catch {
    return null;
  }
}

const KONTRAKT = 'plugins/agents/skills/kickoff/AGENTS.md';
const kontraktFoer = fraBase(KONTRAKT);
if (kontraktFoer !== null) {
  const nu = laes(join(ROD, KONTRAKT));
  if (kontraktFoer !== nu) {
    const vFoer = felt(frontmatter(kontraktFoer), 'kontrakt-version');
    const vNu = felt(frontmatter(nu), 'kontrakt-version');
    if (vFoer === vNu) {
      sig(advarsler, KONTRAKT,
        'er aendret siden ' + base + ', men kontrakt-version staar stadig paa ' + vNu +
        '. Er det en regelaendring, skal den bumpes - ellers opdager projekterne aldrig at ' +
        'deres kopi er foraeldet. Er det kun en omformulering, er alt som det skal vaere.');
    }
  }
}

// ----------- 12. ADVARSEL: en workflow-skabelon aendret uden bump af stemplet
// Et projekt opdager kun en aendring gennem skabelon-version. Flytter filerne
// sig uden at stemplet foelger med, staar projekterne med en kopi de tror er
// den nuvaerende - og et workflow der udloeses af noget andet end de tror.
for (const doku of workflowDokumenter) {
  const r = relativ(doku.sti);
  const foer = fraBase(r);
  if (foer === null) continue;
  const vFoer = felt(frontmatter(foer), 'skabelon-version') || '1';
  if (vFoer !== doku.version) continue;

  const aendrede = [];
  if (foer !== laes(doku.sti)) aendrede.push(r);
  for (const asset of doku.assets) {
    const assetFoer = fraBase(relativ(asset));
    if (assetFoer === null || assetFoer !== laes(asset)) aendrede.push(relativ(asset));
  }
  if (aendrede.length) {
    sig(advarsler, r,
      'skabelonen er aendret siden ' + base + ' (' + aendrede.join(', ') + '), men ' +
      'skabelon-version staar stadig paa ' + doku.version + '. Aendrer den hvad workflowet ' +
      'goer, skal den bumpes - ellers faar projekterne aldrig besked om at deres kopi er ' +
      'foraeldet. Er det kun en omformulering, er alt som det skal vaere.');
  }
}

// ------------------------------------------------------------------ Rapport
const skriv = (liste, maerke) => {
  for (const p of liste) console.log(maerke + ' ' + p.hvor + '\n   ' + p.hvad + '\n');
};

if (advarsler.length) {
  console.log('\n' + advarsler.length + ' advarsel(er):\n');
  skriv(advarsler, 'ADVARSEL');
}

if (fejl.length) {
  console.log('\n' + fejl.length + ' fejl:\n');
  skriv(fejl, 'FEJL    ');
  process.exit(1);
}

console.log('OK. ' + skillNavne.length + ' skills, ' + agentFiler.length + ' agenter, ' +
  mdListe.length + ' markdown-filer, begge manifester paa version ' + (pl ? pl.version : '?') + '.');
