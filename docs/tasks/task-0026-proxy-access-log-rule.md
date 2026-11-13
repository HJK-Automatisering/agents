---
nummer: task-0026
titel: Kontrakten kender ikke proxyens adgangslog, og guidens tjek fejler i sh
status: afsluttet
kilde: interview
oprettet: 2026-11-13
---

# task-0026 — Kontrakten kender ikke proxyens adgangslog, og guidens tjek fejler i sh

## Hvad og hvorfor

Nginx Proxy Manager skriver som standard en linje pr. forespørgsel i proxy-værtens adgangslog, med
hele adressen. En søgning står i adressen og er tit et navn. Guiden slår allerede loggen fra i alle
tre `location`-blokke, men kontrakten har ingen regel om det. Derfor tjekker hverken `architect`
eller `security` det, og linjen er nem at overse i én af blokkene. Guidens tjek bruger desuden
pladsholderen `<nummer>`, og den fejler når den kopieres ind i `sh`.

## Færdig når

- [ ] Kontraktskabelonens afsnit om en app bag Authentik har et ottende punkt: kan adressen bære persondata, er proxy-værtens adgangslog slået fra i alle tre `location`-blokke
- [ ] Afsnittet siger ærligt at det ottende punkt er proxy-værtens og ikke appens
- [ ] *Hvem gør hvad* siger at `architect` skriver alle otte punkter ind i `Færdig når` og spørger når det er uklart om adressen kan bære persondata, og at `security` holder det ottende op mod proxy-værten før en udrulning
- [ ] `security`s rollefil taler om otte punkter, og ikke syv
- [ ] Guidens tjek af adgangsloggen bruger `N` som pladsholder for proxy-værtens nummer alle steder, og forklarer hvorfor
- [ ] Guiden viser hvordan man tømmer linjer fra før ændringen og sletter de roterede filer
- [ ] Guiden har afvejningen med: uden adgangslog er det sværere at fejlsøge og at undersøge en hændelse bagefter, og derfor er det standard for apps bag Authentik, men ikke for alle proxy-værter
- [ ] Ingen organisationsspecifikke værdier: ingen værtsnavne, ingen nøgler, ingen numre på proxy-værter
- [ ] Repoets kontrol er grøn

## Sådan bygger vi det

**1. Kontraktskabelonen**, `plugins/agents/skills/kickoff/AGENTS.md`, `## En app bag Authentik`
omkring linje 517. Listen indledes med *"Appen skal:"*, og punkt 8 er proxy-værtens. Ret
indledningen, så den dækker begge, fx *"Appen og dens proxy-vært skal:"*, eller sig det på anden vis
i punktet. Punkt 8 i kontraktens tone:

> **Slå proxy-værtens adgangslog fra, når adressen kan bære persondata** — et navn i en søgning, et
> nummer på en sag. `access_log off;` står i alle tre `location`-blokke: `location /`,
> `location /outpost.goauthentik.io` og `location @goauthentik_proxy_signin`. Adressen når loggen
> alle tre steder. Fejlloggen skrives stadig.

Henvis til `NGINX-PROXY-MANAGER.md` for blokken og tjekket. Gentag ikke tjekket.

*Hvem gør hvad*, samme afsnit:

- `architect`: *"de syv punkter"* bliver til *"de otte punkter"*. Tilføj at den spørger, når det er
  uklart om adressen kan bære persondata
- `developer`: punkt 8 er ikke kode. Sig at det ikke er `developer`s at bygge, og at mennesket sætter
  det i proxy-værten efter guiden
- `security`: holder punkt 8 op mod proxy-værten før en udrulning. Proxy-værtens konfiguration ligger
  ikke i repoet. Kan `security` ikke se den, skriver den punktet som ikke efterprøvet og peger på
  guidens tjek. Det er ikke et fund i sig selv

**2. `plugins/agents/agents/security.md`**, linje 34: *"de syv punkter"* bliver til *"de otte
punkter"*. Sig også hvad den gør med punkt 8, når konfigurationen ikke kan ses, med samme ord som i
kontrakten.

**3. `NGINX-PROXY-MANAGER.md`**:

- **Blokken i del 4 er rigtig og skal ikke ændres.** Den har `access_log off;` og en kommentar i alle
  tre blokke.
- **Afsnittet om adgangsloggen** under *Hvad blokken gør, del for del* (omkring linje 266): tilføj
  afvejningen. Uden adgangslog er det sværere at fejlsøge og at undersøge en hændelse bagefter.
  Derfor gælder standarden apps bag Authentik, der sættes op efter denne guide, og ikke alle
  proxy-værter. Nævn at loggen med Nginx Proxy Managers standardopsætning gemmes i omkring en måned,
  og at alle der administrerer proxyen, kan læse den. Det der står om fejlloggen og om at fjerne
  linjen fra `location /` alene, bliver stående.
- **Tjekket i del 5** (trin 18–21): `<nummer>` bliver til `N` alle steder. Skriv én sætning om
  hvorfor: i `sh` læses `<` som en omdirigering, så linjen fejler uden at gøre noget. Søg resten af
  filen igennem for `<nummer>`. `<adresse>` i `grep`-linjen står i anførselstegn og skal blive.
- **Et nyt trin efter trin 21**, til når loggen har stået åben før ændringen. Linjerne fra før kan
  tømmes, og de roterede filer slettes:

  ```sh
  : > /data/logs/proxy-host-N_access.log
  rm /data/logs/proxy-host-N_access.log.*
  ```

  Sig at det kun skal gøres når loggen har stået åben, og at `N` er nummeret fra trin 18.

Ret ikke nummereringen af trin længere nede, medmindre et nyt trin tvinger det. Henviser
symptomtabellen eller anden tekst til et trinnummer der flytter sig, så ret henvisningen.

Kør `node tools/validate.mjs`. Den vil advare om `kontrakt-version`. Det er ventet. **Bump den ikke**;
det gør architect ved lukningen.

## Hvad vi ikke rører

- Blokken i del 4 af `NGINX-PROXY-MANAGER.md`
- De syv punkter der står i dag, ud over indledningen
- `AUTHENTIK.md`, `AGENTS.md` i roden og `CHANGELOG.md`
- `kontrakt-version`, `design-version`, `skabelon-version` og versionsnumrene i manifesterne
- `README.md`, `docs/BOARD.md` og beslutningsloggen

## Afhænger af

intet

## Beslutninger

- BESLUTTET: guiden slår stadig adgangsloggen fra som standard. Den der sætter proxy-værten op, kan
  sjældent se om adresserne bærer persondata. Mennesket valgte det, efter architects anbefaling.
  Afvist: at loggen kun slås fra efter behov, som også blev afvist i task-0012
- BESLUTTET: kontraktens punkt 8 er betinget: kan adressen bære persondata, skal loggen være slået
  fra. Med guidens standard passer de sammen. Guiden starter det sikre sted, og kontrakten siger
  hvornår loggen ikke må slås til igen
- BESLUTTET: `security` kan sjældent se proxy-værten. Et punkt den ikke kan se, er ikke efterprøvet
  og ikke et fund
- BESLUTTET: `security.md` rettes i samme opgave. Ellers taler den om syv punkter, mens kontrakten har
  otte. Det var den fejl task-0025 rettede bagefter
- BESLUTTET: `kontrakt-version` bumpes. Mennesket bad om det i sin beskrivelse af opgaven. Architect
  gør det ved lukningen, ikke developer

## Åbne punkter

## Indvendinger

---

## Developers noter

<Alt over denne overskrift ejes af architect. Alt herunder skrives kun af
developer, som aldrig retter i definitionen ovenfor.>

### Hvad er lavet

Gren: `task-0026-proxy-access-log-rule`. To commits: `3fc30a0` (kontrakt og `security`) og
`930a552` (guiden).

- **Ottende punkt** — `plugins/agents/skills/kickoff/AGENTS.md`, `## En app bag Authentik`:
  indledningen er nu *"Appen og dens proxy-vært skal:"*, og punkt 8 står med teksten fra opgaven.
  De syv punkter er uændrede.
- **Proxy-værtens, ikke appens** — samme sted, nyt afsnit under listen: *"Punkt 1–7 er appens,
  punkt 8 er proxy-værtens."* Punkt 8 er ikke kode, står ikke i repoet, og et menneske sætter det.
  Henviser til `NGINX-PROXY-MANAGER.md` for blokken og tjekket; tjekket er ikke gentaget.
- **Hvem gør hvad** — samme sted: `architect` skriver de otte punkter ind og spørger også når det
  er uklart om adressen kan bære persondata. `developer` bygger punkt 1–7; punkt 8 er ikke
  `developer`s, mennesket sætter det efter guiden. `security` holder appen op mod 1–7 og
  proxy-værten op mod 8; kan den ikke se konfigurationen, skrives punkt 8 som ikke efterprøvet med
  henvisning til guidens tjek, og det er ikke et fund i sig selv.
- **`security` taler om otte punkter** — `plugins/agents/agents/security.md` linje 34: *"de otte
  punkter"*, og samme regel for punkt 8 med kontraktens ord.
- **`N` alle steder** — `NGINX-PROXY-MANAGER.md`: pladsholdertabellen (rækken hedder nu `N`, med
  henvisning til trin 18 og 19), trin 18 og trin 19. Trin 19 har sætningen om hvorfor: `sh` læser
  `<` som en omdirigering, så linjen fejler uden at gøre noget. Der står ingen `<nummer>` tilbage i
  filen. `<adresse>` i `grep`-linjen er uændret.
- **Oprydning** — `NGINX-PROXY-MANAGER.md`, nyt trin 22 under *Adgangsloggen står stille*: kun når
  loggen har stået åben før ændringen; tømmer loggen med `: >` og sletter de roterede filer med
  `rm …access.log.*`; `N` er nummeret fra trin 18. Én linje om at `rm` melder fejl, når der ingen
  roterede filer er.
- **Trinnummer** — det gamle trin 22 (*Containeren*) er nu trin 23. Ingen tekst i guiden eller i
  repoets andre filer henviste til trin 22; symptomtabellen henviser ikke til trinnumre i del 5.
- **Afvejningen** — `NGINX-PROXY-MANAGER.md`, afsnittet om adgangsloggen under *Hvad blokken gør,
  del for del*: nyt afsnit om at det er sværere at fejlsøge og undersøge en hændelse bagefter, og at
  standarden derfor gælder apps bag Authentik efter guiden, ikke alle proxy-værter. Omkring en
  måned med standardopsætningen er føjet til den sætning der i forvejen sagde at alle der
  administrerer proxyen, kan læse loggen. Teksten om fejlloggen og om `location /` alene er uændret.
- **Blokken i del 4** er ikke rørt.
- **Ingen organisationsspecifikke værdier** — ingen værtsnavne, nøgler eller numre; kun `N` og de
  eksisterende pladsholdere.
- **Kontrollen** — `node tools/validate.mjs`: grøn (exit 0), med den ventede advarsel om at
  `kontrakt-version` står på 26. Ikke bumpet.

Intet nyt for `README.md`: ingen ny kommando eller indstilling.

### Hvad er ikke lavet, og hvorfor

intet

### Uklart

1. **Et `N` der ikke skiftes ud, giver et falsk grønt tjek.** Kopieres `wc -l …proxy-host-N_access.log`
   uændret ind, svarer `wc` at filen ikke findes, både i trin 19 og 21. Trin 21 siger at det betyder
   at der ikke er skrevet noget. Så består tjekket uden at have tjekket noget. Med `<nummer>` fejlede
   linjen også, så det er ikke en ny svaghed, men den er nu mindre synlig. Jeg har ikke rettet trin 21,
   fordi opgaven ikke beder om det. En mulig rettelse: trin 21 siger at `N` skal være skiftet ud, før
   "findes ikke" kan læses som at intet er skrevet.
2. **Guidens liste under *Det appen selv skal gøre* har stadig syv punkter**, og siger at kontrakten
   gælder hvis de to er uenige. Kontrakten har nu otte. Punkt 8 er proxy-værtens og står i del 4,
   så listen er ikke forkert, men en læser kan tro de er uenige. Jeg har ikke rørt den; opgaven
   nævner den ikke.
3. **`architect` skriver punkt 8 ind i `Færdig når`, men `developer` må ikke bygge det.** Så vil
   `developer` i en projektopgave altid melde punkt 8 under *Hvad er ikke lavet*. Det er måske
   meningen, men kontrakten siger ikke hvordan punktet lukkes. Jeg har skrevet det som opgaven sagde.
