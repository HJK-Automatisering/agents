---
nummer: task-0006
titel: En workflow-kopi uden sit dokument er usynlig for hooken
status: i-gang
kilde: interview
oprettet: 2026-09-22
---

# task-0006 — En workflow-kopi uden sit dokument er usynlig for hooken

## Hvad og hvorfor

Hooken afgør om et projekts workflow er bagud ved at gå gennem
`docs/workflows/*.md` og sammenligne `skabelon-version`. Findes dokumentet ikke,
sker der ingenting — hverken en sammenligning eller en besked.

Et projekt kan altså have en kopi af vores workflow i `.github/workflows/` og
aldrig få at vide at den er forældet. Det rammer især den fritstående udgave,
som ikke står i noget `filer:`-felt, og som selv bærer sine fastlåste
action-versioner.

Det er præcis den tavse fejl hele stempelmekanismen blev bygget for at undgå.

## Færdig når

- [ ] Et projekt med en workflow-fil fra plugin'et, men uden det dokument der bærer stemplet, får besked ved sessionsstart
- [ ] Beskeden siger hvilken fil det drejer sig om, at udgaven ikke kan aflæses, og at `/agents:update` er vejen videre
- [ ] Et projekt hvis egen workflow-fil tilfældigvis hedder det samme som vores, får ingen besked
- [ ] Hooken tier som i dag når dokumentet findes — den nye besked kommer kun når det mangler
- [ ] Den nye besked kan stå sammen med de øvrige, og fortrænger hverken kontraktbeskeden eller advarslen om manglende `.gitignore`
- [ ] En fejl undervejs får stadig hooken til at tie helt frem for at blokere sessionen
- [ ] Opdateringskaldet lægger dokumentet på plads og bringer workflow-filen ajour, også når der ikke er noget stempel at sammenligne med
- [ ] Opdateringskaldet stopper stadig og viser det, hvis der er rettet i projektets workflow-fil
- [ ] Kontrollen slår fejl hvis en workflow-asset mangler den henvisning hooken kender kopien på
- [ ] Vedligeholdelsesdokumentet beskriver det nye tjek
- [ ] Intet versionsnummer er ændret

## Sådan bygger vi det

**Kendetegnet.** Begge assets under `plugins/agents/skills/workflow/assets/`
bærer allerede et hoved med to ting, hver på sin egen linje:

- stien til kilden i plugin'et, som indeholder
  `plugins/agents/skills/workflow/assets/`
- stien til dokumentet, `docs/workflows/docker-publish.md`

Den første er kendetegnet: bærer en fil i projektets `.github/workflows/` den
tekststump, er den vores kopi. Den anden siger hvilket dokument der skal findes.
Ombrydningen af den omgivende sætning er ikke ens i de to assets, så begge
stumper skal findes som enkeltstående tokens på en linje — ikke som en del af en
sætning der antages at stå samlet.

**I hooken, `plugins/agents/hooks/detect-project-zero.cjs`.** Et femte tjek ved
siden af de fire. Det ligger i samme gren som de to versionstjek — altså ikke
når projektet er nul. For hver `.yaml`- og `.yml`-fil i projektets
`.github/workflows/`: bærer den kendetegnet, og findes det dokument den peger
på ikke, er det et fund. Er der intet `.github/workflows/`, er der intet at
sige.

Beskeden følger formen fra `skabelonBagud()`: en overskrift i versaler, én linje
pr. fil, og hvad brugeren skal gøre. Den skal sige at udgaven ikke kan aflæses —
ikke at kopien er bagud, for det ved vi ikke.

**I `plugins/agents/skills/update/SKILL.md`, del 2.** Trin 1 finder i dag
kopien via `filer:`-feltets `til:`. Den vej rammer ikke den fritstående udgave,
og trin 3 forudsætter at dokumentet findes. Der skal stå hvad der sker når
workflow-filen findes og dokumentet ikke gør: udgaven er **ukendt**,
versionsporten springes over, og både filen og dokumentet skrives. Trin 5 —
stop og vis, hvis der er rettet andre steder — gælder uændret og er det der
beskytter projektet i stedet for porten.

Undtagelsen skal også stå i `## Du må ikke`, hvor forbudslinjen om ikke at
opdatere uden et højere stempel står i dag. En undtagelse der kun står ét sted,
bliver læst som en modsigelse.

**I `tools/validate.mjs`, afsnit 10.** Dokumenternes assets samles allerede i
et `Set` pr. workflow-dokument. Hver asset skal indeholde både
`plugins/agents/skills/workflow/assets/` og stien til sit eget dokument. Uden
den kontrol kan en oprydning i et filhoved gøre hooken blind uden at nogen
opdager det.

**I `PLUGIN.md`.** Hookens tjek beskrives der. Det nye skal med.

## Hvad vi ikke rører

- **Selve workflow-assets.** Henvisningen står der allerede. Ændres de ikke,
  er der ingen `skabelon-version` at tage stilling til.
- **`plugins/agents/skills/workflow/docker-publish.md`.** Dokumentets afsnit om
  vedligeholdelse er stadig rigtigt, og det er ikke stedet der beskriver hooken.
- **`plugins/agents/skills/workflow/SKILL.md`.** Den lægger allerede dokumentet
  ind hver gang. Det er ikke der hullet opstår.
- **Kontrakten.** Ingen regel ændrer sig, så `kontrakt-version` bliver stående.
- **Tællingen af hookens tjek** i `README.md`, `GUIDE.md` og `OPSAETNING.md`.
  De tre steder siger allerede "tre" hvor der er fire, og bliver med denne
  opgave forkerte med to. Rettelsen hører i emnet om hookens navn, som ejer
  både navnet og tællingen.
- **Det omvendte tilfælde:** et dokument i `docs/workflows/` uden en
  workflow-fil. Det er ikke det samme problem, og ingen har set det.

## Afhænger af

intet

## Beslutninger

- BESLUTTET: hooken opdager det, og opdateringskaldet får reglen for hvad der
  så sker — begge dele. En regel der kun står i opdateringskaldet, fyrer aldrig
  i netop dette tilfælde, fordi kaldet køres fordi hooken beder om det.
- BESLUTTET: kopien kendes på henvisningen i filens hoved, ikke på `til:`-stien
  fra `filer:`. Afvist: `til:`-stien, som melder forkert om ethvert projekt med
  samme filnavn, og som ikke dækker den fritstående udgave. Afvist også: at
  udlede stien af dokumentets filnavn, fordi opdateringskaldet allerede har
  reglen *gæt ikke på stier*. Prisen er at en kopi hvor hovedet er fjernet,
  forbliver usynlig — det efterlader os hvor vi står i dag, mens en besked uden
  grund lærer folk at springe hookens beskeder over.
- BESLUTTET: et manglende dokument er en **ukendt** udgave, ikke version 1.
  Regnes det som 1, gør opdateringskaldet ingenting den dag et plugin-stempel
  også står på 1, og hooken melder videre uden at nogen kan lukke den. Afvist:
  at genbruge reglen om at et manglende stempel er version 1.
- BESLUTTET: kontrollen håndhæver at henvisningen står i hver asset. Uden den
  hviler hele kendetegnet på en kommentar ingen holder øje med.

## Åbne punkter

ingen

## Indvendinger

---

## Developers noter

<Alt over denne overskrift ejes af architect. Alt herunder skrives kun af
developer, som aldrig retter i definitionen ovenfor.>

### Hvad er lavet

- `plugins/agents/hooks/detect-project-zero.cjs`: et femte tjek i samme gren som
  de to versionstjek. `yamlFiler()` lister `.yaml`/`.yml` i projektets
  `.github/workflows/` og giver en tom liste hvis mappen ikke findes.
  `dokumentFor()` læser filen, finder de to stier som enkeltstående tokens —
  `plugins/agents/skills/workflow/assets/` som kendetegn, og
  `docs/workflows/<navn>.md` som dokumentet — og giver `null` hvis kendetegnet
  ikke er der. Ny beskedfunktion `udgaveUkendt()` i samme form som
  `skabelonBagud()`: overskrift i versaler, én linje pr. fil med både filsti og
  dokumentsti, og `/agents:update` som vej videre. Beskeden siger at udgaven ikke
  kan aflæses — ikke at kopien er bagud. Hovedkommentaren i filen siger nu fem
  tjek i stedet for fire.
- Afprøvet mod to projekter i scratchpad-mappen: ét med begge assets kopieret ind
  og intet `docs/workflows/` gav beskeden med begge filer nævnt; samme projekt gav
  intet da dokumentet blev lagt ind; ét projekt med sin egen `docker-publish.yaml`
  uden kendetegnet gav intet. Med både gammel kontrakt og manglende `.gitignore`
  stod alle tre beskeder samtidig, i rækkefølgen kontrakt, workflow, `.gitignore`.
  Læse- og listefejl fanges som i resten af filen, så hooken stadig tier frem for
  at blokere.
- `plugins/agents/skills/update/SKILL.md`, del 2, trin 1: kopien findes nu også
  ved at læse hovedet på filerne i `.github/workflows/`, hvilket er den eneste vej
  til den fritstående udgave. *Gæt ikke på stier* er omskrevet til at dække begge
  kilder og siger at en fil uden henvisningen ikke er vores, uanset navn.
- Samme fil, trin 3: nyt afsnit om at et manglende dokument er en **ukendt**
  udgave — ikke version 1 — at versionsporten springes over, at begge filer
  skrives, og at trin 4 og 5 gælder uændret.
- Samme fil, trin 5: en linje om at trinnet er det eneste der beskytter projektet
  når udgaven er ukendt, og at hele filen derfor sammenlignes.
- Samme fil, `## Du må ikke`: undtagelsen står nu ved forbudslinjen om ikke at
  opdatere uden et højere stempel, med henvisning til del 2, trin 3.
- `tools/validate.mjs`, afsnit 10: hver asset i `Set`'et kontrolleres for begge
  stier — kilden i plugin'et og `docs/workflows/<dokumentets navn>.md` — og der
  meldes fejl med hvad der mangler. Afprøvet ved midlertidigt at fjerne begge
  stumper fra `assets/docker-publish.yaml`: kontrollen fejlede med exit 1 og
  pegede på filen. Assetet er stillet tilbage uændret.
- `PLUGIN.md`, afsnittet `## Kontrakten driver`: det nye tjek beskrevet — hvad det
  læser, hvorfor kopien kendes på henvisningen og ikke på filnavnet, hvad prisen
  er, og at kontrollen håndhæver henvisningen.
- `node --check plugins/agents/hooks/detect-project-zero.cjs` og
  `node tools/validate.mjs` kører begge rent til sidst. Intet versionsnummer er
  ændret — hverken de to manifester, `kontrakt-version` eller `skabelon-version`.

### Hvad er ikke lavet, og hvorfor

- Tællingen af hookens tjek i `README.md`, `GUIDE.md` og `OPSAETNING.md` er ikke
  rettet. Den står under `## Hvad vi ikke rører` og hører i emnet om hookens navn.
  De tre steder siger nu "tre" hvor der er fem.
- Workflow-assets, `plugins/agents/skills/workflow/docker-publish.md`,
  `plugins/agents/skills/workflow/SKILL.md` og kontrakten er ikke rørt, som
  opgaven siger.

### Uklart

- Opgaven beskriver det tilfælde hvor filen bærer kendetegnet og dokumentet ikke
  findes. Den siger ikke hvad der skal ske hvis kendetegnet står i en fil hvis
  hoved er *delvist* ryddet — kilden er der, men dokumentstien er fjernet. Jeg har
  valgt at hooken tier i det tilfælde, fordi den ellers skulle udlede stien af
  filnavnet, og det er netop hvad beslutningen om `gæt ikke på stier` afviser. Den
  nye kontrol i `tools/validate.mjs` sikrer at vores egne assets aldrig havner i
  den tilstand.
