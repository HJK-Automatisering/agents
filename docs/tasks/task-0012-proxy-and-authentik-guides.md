---
nummer: task-0012
titel: En app bag Nginx Proxy Manager og Authentik, klik for klik
status: afsluttet
kilde: interview
oprettet: 2026-11-11
---

# task-0012 — En app bag Nginx Proxy Manager og Authentik, klik for klik

## Hvad og hvorfor

`PORTAINER.md` tager en app til en kørende stack, men stopper dér. Hvordan appen bliver nået
udefra og beskyttet, står i dag kun i to app-repoers egne udrulningsdokumenter, skrevet til netop
dem. To projekter har brugt samme metode, og den næste skal ikke lede efter den. Metoden skrives
som to generelle guider til mennesker, ved siden af `PORTAINER.md`.

## Færdig når

- [ ] Der ligger to guider i roden: én til Authentik og én til Nginx Proxy Manager. Hver guide dækker de klik der hører til sit eget system, og de henviser til hinanden og til `PORTAINER.md`
- [ ] En der aldrig har brugt Authentik, kan følge dem fra en kørende stack til en app der kun kan åbnes af brugerne i én gruppe
- [ ] Rækkefølgen står i starten: Authentik først, proxy-værten bagefter, og aldrig en proxy-vært uden Authentiks konfiguration
- [ ] Guiderne forklarer hvorfor appen skal have en delt nøgle fra proxyen. Uden den kan en anden container på proxyens netværk kalde appen direkte, uden om login
- [ ] Guiderne forklarer hvordan nøglen laves, hvor den står (begge steder), og hvordan den skiftes
- [ ] Det appen selv skal gøre, står som en kort liste i almindeligt sprog uden kode. Listen er skrevet så den kan gives videre som krav til en opgave
- [ ] Til sidst er der et tjek man kan køre: uden login, uden nøglen, som en bruger uden for gruppen, og at adgangsloggen står stille. Der er også en tabel over symptomer og hvad man skal se efter
- [ ] Ingen værtsnavne, appnavne, systemnavne, organisationsnavne eller personnavne, hverken rigtige eller opdigtede der ligner rigtige. Alt der er specifikt for en app, er en pladsholder i `<vinkelparenteser>`
- [ ] README, GUIDE og PLUGIN.md nævner guiderne der hvor de nævner `PORTAINER.md`
- [ ] `node tools/validate.mjs` er grøn

## Sådan bygger vi det

**Kilder.** Metoden er beskrevet og afprøvet i to app-repoer ved siden af dette. Stierne står i
opdraget og står med vilje ikke her, fordi repoet er offentligt:

- Det første har det fulde forløb, med tjekket og symptomtabellen.
- I det andet stoler appen på brugernavnet fra headeren, og det er derfor nøglen er nødvendig.

Læs dem for at forstå metoden. **Intet må kopieres ordret, hvis det bærer noget fra de to projekter.**
Det gælder navne, adresser, appens egne nøglenavne, eksempler og forretningsord.

**Filerne.** `AUTHENTIK.md` og `NGINX-PROXY-MANAGER.md` i roden. Formen og tonen er som i
`PORTAINER.md`: til et menneske, klik for klik, nummererede trin, felt-tabeller og pladsholdere.
`PORTAINER.md` er en forudsætning: stacken kører, og appen har et alias på
`nginx-proxy-manager_default` og ingen `ports:`.

**`AUTHENTIK.md`:** udbyderen (Proxy Provider, *Forward auth (single application)*,
implicit-consent-flowet, *External host* præcis som den adresse brugerne åbner). Derefter
applikationen, gruppen og bindingen af gruppen til applikationen. Det skal stå tydeligt at alle
brugere kommer ind hvis bindingen mangler. Til sidst applikationen på den indlejrede outpost, uden
at fjerne de applikationer der står der i forvejen.

**`NGINX-PROXY-MANAGER.md`:** proxy-værtens tre faner. *Details* (alias, port, `http`, Block Common
Exploits til, Publicly Accessible fordi Authentik styrer adgangen). *SSL* med Force SSL. *Advanced*
med hele blokken, og en forklaring af hver del. Derefter tjekket og symptomtabellen for hele
forløbet. Nøglen laves med PowerShell-linjerne fra den første kilde. Nøglens navn på stacken er en
pladsholder.

**Det appen selv skal gøre**, i `AUTHENTIK.md` eller i proxy-guiden, hvor det passer bedst:

- afvise ethvert kald uden den rigtige nøgle, på alle stier, og sammenligne i konstant tid
- nægte at starte når nøglen ikke er sat, og sige hvorfor uden at skrive værdien
- aldrig skrive nøglen i loggen
- kun stole på `X-authentik-*`-headerne når nøglen er rigtig
- forbyde at siden vises i en ramme på en anden side
- give formularer der skriver noget, et token mod forfalskede kald

**Tjekket uden nøgle** køres fra Nginx Proxy Managers egen container mod appens alias. Det er
netop den vej en fremmed container ville tage. Guiden skal sige at svaret skal være en afvisning
(`401` eller `403`, alt efter appen). Du kan ikke afprøve at værktøjet findes i den container.
Skriv det i noterne under *Uklart*, så mennesket efterprøver det første gang.

**Henvisningerne.** I README skal guiderne nævnes ved linjen *App i drift* og i tabellen over filer
til mennesker. I GUIDE skal de nævnes ved stykket om Portainer. I PLUGIN.md skal de stå i træet.
Ret ikke README'ens indledning ud over det. Architect retter README'en når opgaven vurderes.

**Første commit** er den opdaterede kontrakt i roden. `AGENTS.md` står uncommittet på `main` efter
`/agents:update` fra 20 til 22. Commit den alene på grenen med beskeden
`update: bring repoets egen kontrakt fra version 20 til 22`.

## Hvad vi ikke rører

- `plugins/agents/` i det hele taget. Det gælder skabelonen `AGENTS.md`, workflow-dokumentet og rollerne
- `PORTAINER.md`, ud over én henvisning til de nye guider til sidst, hvis det falder naturligt
- Versionsnumre, i begge manifester og i `kontrakt-version`
- De to app-repoer. De læses, de rettes ikke

## Afhænger af

intet

## Beslutninger

- BESLUTTET (mennesket 2026-11-11): guiderne ligger i roden ved siden af `PORTAINER.md` og er
  kun til mennesker. Rollerne i projekterne læser dem ikke. Det appen selv skal gøre, bliver et
  emne for sig, som en regel rollerne skal kende.
- BESLUTTET (architect): opdelingen følger systemerne. Klikkene i Authentik står i den ene
  guide, proxy-værten med *Advanced*-blokken, tjekket og symptomerne i den anden. Afvist:
  *Advanced*-blokken i Authentik-guiden, fordi den indsættes i proxyen, og fordi man så skulle
  have begge guider åbne for at udfylde én formular.
- BESLUTTET (architect): filen hedder `NGINX-PROXY-MANAGER.md`, ikke `NPM.md`. I et udviklerrepo
  bliver NPM læst som Node's pakkehåndtering.
- BESLUTTET (architect): standardblokken sætter alle fem `X-authentik-*`-headere med
  `proxy_set_header`, også dem appen ikke bruger. Så kan en header af samme navn fra browseren
  aldrig nå appen. Afvist: kun brugernavnet, som i den ene kilde.
- BESLUTTET (architect): adgangsloggen er slået fra i de tre `location`-blokke i standardblokken.
  Guiden forklarer hvorfor (adressen kan bære persondata, også i `rd=`) og at den kan slås til i
  `location /` for en app hvor adressen aldrig bærer persondata. Authentik logger selv hvem der
  logger ind. Afvist: at slå den kun fra efter behov, fordi den der sætter en ny app op, ikke kan
  se på adressen om den bærer persondata.
- BESLUTTET (architect): ingen `error_page 500`, og guiden siger hvorfor. Kan proxyen ikke nå
  Authentik, skal brugeren få en fejl og ikke slippe igennem.
- BESLUTTET (architect): opgaven er dokumentation og kalder ikke på et versionsnummer.

## Åbne punkter

## Indvendinger

---

## Developers noter

<Alt over denne overskrift ejes af architect. Alt herunder skrives kun af
developer, som aldrig retter i definitionen ovenfor.>

### Hvad er lavet

Gren `task-0012-proxy-and-authentik-guides`, fire commits, ikke pushet.

- `AGENTS.md` (roden) committet alene som første commit, med beskeden fra opgaven.
- `AUTHENTIK.md` (ny): rækkefølgen øverst, hvordan forward auth hænger sammen, pladsholdertabel,
  og trin 1–18: udbyderen (Proxy Provider, *Forward auth (single application)*,
  implicit-consent-flowet, *External host* præcis som adressen), applikationen, gruppen,
  bindingen med fed advarsel om at alle kommer ind uden den, og outposten uden at fjerne de
  eksisterende. Til sidst et kort afsnit om at give og tage adgang i gruppen.
- `NGINX-PROXY-MANAGER.md` (ny): rækkefølgen øverst (Authentik først, aldrig en proxy-vært uden
  *Advanced*), pladsholdertabel, *Hvorfor appen skal have en nøgle fra proxyen*, *Det appen selv
  skal gøre* (syv punkter uden kode — opgavens første punkt er delt i to: afvisningen og
  sammenligningen i konstant tid), del 1 nøglen med PowerShell-linjerne, del 2–4 de tre faner
  med hele *Advanced*-blokken og en forklaring del for del, del 5 tjekket (uden login, uden
  nøgle fra proxyens container — også med forfalsket brugernavn og forkert nøgle, bruger uden
  for gruppen, adgangsloggen står stille, ingen publicerede porte), symptomtabel, og til sidst
  hvor nøglen står og hvordan den skiftes.
- Standardblokken sætter alle fem `X-authentik-*` med `proxy_set_header`, har `access_log off`
  i alle tre `location`-blokke, og ingen `error_page 500`. Guiden forklarer alle tre valg, og at
  adgangsloggen kan slås til i `location /` alene.
- `GUIDE.md`, stykket om Portainer: én sætning der peger på de to guider.
- `PLUGIN.md`, træet: én linje med de to guider.
- `PORTAINER.md`: to linjer efter *Så er appen i drift fra Git*, der peger videre. Lagt efter
  hovedforløbet og før afsnittet om tokenfornyelse, fordi det er der forløbet slutter.
- `README.md`: guiderne ved linjen *App i drift* og i tabellen over filer til mennesker. Egen
  commit, se *Uklart*.
- `node tools/validate.mjs`: grøn. `OK. 12 skills, 7 agenter, 48 markdown-filer, begge
  manifester paa version 1.1.0.`

Holdt op mod *Færdig når*:

| Kriterium | |
|---|---|
| To guider i roden, hver sit system, henviser til hinanden og `PORTAINER.md` | ja |
| Kan følges uden at have brugt Authentik | ja, efter bedste skøn; ikke afprøvet af et menneske |
| Rækkefølgen står i starten | ja, i begge |
| Hvorfor nøglen | ja, eget afsnit i proxy-guiden |
| Nøglen laves, står to steder, skiftes | ja |
| Det appen selv skal gøre, uden kode | ja |
| Tjek og symptomtabel | ja |
| Ingen navne, alt app-specifikt i `<vinkelparenteser>` | ja. Også Authentiks containernavn er gjort til en pladsholder |
| README, GUIDE, PLUGIN.md | ja |
| `validate.mjs` grøn | ja |

Ingen nye kommandoer eller indstillinger i plugin'et.

### Hvad er ikke lavet, og hvorfor

- **Fund, uden for opgaven: `PLUGIN.md`s træ manglede `PORTAINER.md` i forvejen.** De to nye
  guider står der nu, som opgaven siger, men `PORTAINER.md` er ikke tilføjet. Linjen med de to
  guider er det oplagte sted.

### Uklart

1. **`curl` i Nginx Proxy Managers container er ikke afprøvet.** Tjekket uden nøgle (del 5,
   trin 15) og tjekket af adgangsloggen bruger `curl`, `grep` og `wc` i proxyens container via
   Portainers konsol med `/bin/sh`. `grep` og `wc` bruges sådan i kilden; `curl` gør ikke. Det
   skal efterprøves første gang et menneske kører tjekket. Findes `curl` ikke dér, skal trinnet
   skrives om.
2. **README.** Opgaven beder om de to henvisninger i README, mens rollefilen og kontrakten siger
   at developer ikke retter den. Jeg har fulgt opgaven, kun de to steder den nævner, i en commit
   for sig, så den kan rulles tilbage alene, hvis det var ment som architects eget skridt.
3. **Headerens navn `X-Proxy-Secret`.** Guiden lægger navnet fast og siger at appen skal læse
   netop den header. Begge kilder bruger det navn, så jeg har ikke gjort det til en pladsholder.
   Nøglens navn på stacken er en pladsholder, som opgaven siger.
4. **To påstande fra kilden er ikke taget med**, fordi jeg ikke kunne efterprøve dem generelt:
   at en bruger der fjernes fra gruppen, afvises med det samme, og hvor længe proxyens
   adgangslog gemmes.
