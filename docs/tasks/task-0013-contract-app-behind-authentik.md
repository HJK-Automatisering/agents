---
nummer: task-0013
titel: Kontrakten kender ikke de krav en app bag Authentik selv skal opfylde
status: afsluttet
kilde: interview
oprettet: 2026-11-11
---

# task-0013 — Kontrakten kender ikke de krav en app bag Authentik selv skal opfylde

## Hvad og hvorfor

En app bag Authentik står på proxyens delte netværk. Uden en nøgle fra proxyen kan enhver
container på netværket kalde den direkte og udgive sig for at være en hvilken som helst bruger.
Kravene til appen står i dag kun i guiden til mennesker (`NGINX-PROXY-MANAGER.md`, task-0012).
Rollerne i projekterne kender dem ikke. Derfor kommer kravene ikke med i opgaven, når appen
bygges, og de bliver ikke tjekket før den udrulles.

## Færdig når

- [ ] Kontraktskabelonen har afsnittet *En app bag Authentik*, med præcis den tekst der står under *Sådan bygger vi det*. Afsnittet står lige efter afsnittet om at værdier hører i `.env`
- [ ] Sikkerhedsgennemgangens tjekliste har en linje der peger på afsnittet, på samme måde som linjen om compose-filen
- [ ] Guiden til proxyen siger at kravene til appen står i kontrakten, og at kontrakten bestemmer hvis de to er uenige. Listen i guiden siger det samme som kontrakten
- [ ] Repoets kontrol er grøn. Advarslen om at kontrakten er ændret uden at versionen er bumpet, er ventet og står i noterne

## Sådan bygger vi det

**Kontraktskabelonen** er `plugins/agents/skills/kickoff/AGENTS.md`, ikke `AGENTS.md` i roden. Indsæt
afsnittet nedenfor ordret, mellem `## Værdier hører i .env` og `## Versionering`. Teksten er godkendt
af mennesket i interviewet. Ret ikke i formuleringerne. Finder du en fejl i teksten, så skriv den
under *Uklart*.

```markdown
## En app bag Authentik

Gælder en app der ikke har sit eget login, men står bag Authentik som *forward
auth* i Nginx Proxy Manager. Proxyen spørger Authentik før hver forespørgsel og
sender kun videre ved et ja. Kendetegnet er at koden læser `X-authentik-*`-
headerne, eller at projektets dokumenter siger at appen står bag Authentik.

**Proxyens netværk er delt.** Alle stakke bag proxyen står på det, og enhver
container på det kan kalde appen direkte: uden om proxyen, uden om Authentik,
og med de `X-authentik-*`-headere den selv vil. Derfor sender proxyen en delt
nøgle med hvert kald i headeren `X-Proxy-Secret`, og appen svarer kun på kald
der bærer den.

Appen skal:

1. **Afvise ethvert kald uden den rigtige nøgle.** Det gælder alle stier, også
   statiske filer. Afvisningen er `401` eller `403` uden indhold.
2. **Sammenligne nøglen i konstant tid**, med sprogets egen funktion til det.
3. **Nægte at starte når nøglen ikke er sat eller er tom.** Loggen siger hvilken
   nøgle der mangler, aldrig en værdi. Der er ingen standardværdi.
4. **Aldrig skrive nøglen** i loggen, i en fejlbesked eller i et svar. Det
   gælder også det der blev sendt ved en afvisning.
5. **Først læse `X-authentik-*`-headerne når nøglen er tjekket.** Før det kan de
   indeholde hvad som helst.
6. **Forbyde at siderne vises i en ramme.** Hvert svar, også afvisningerne,
   bærer `Content-Security-Policy: frame-ancestors 'none'` og
   `X-Frame-Options: DENY`.
7. **Give hver formular der ændrer noget, et token** der er bundet til brugeren.
   Så kan en side et andet sted ikke sende formularen i brugerens navn.

Projektet vælger selv hvad nøglen hedder på stakken. Navnet står i
`.env.example` uden værdi og i compose-filen som `${NØGLE}`. Værdien står kun
på stakken og i proxy-værten. Se `## Værdier hører i .env`.

**Hvem gør hvad:**

- `architect` skriver de syv punkter ind i `Færdig når` i den opgave der sætter
  appen bag Authentik. Er det uklart om appen står bag Authentik, spørger den.
- `developer` bygger dem og efterprøver dem med HTTP-kald efter
  `## Efterprøvning af en webflade`: uden nøgle, med forkert nøgle, med rigtig
  nøgle, og med et forfalsket brugernavn uden nøgle.
- `security` holder appen op mod listen før en udrulning. Hvert punkt der ikke
  holder, er et fund. Stoler appen på `X-authentik-*` uden at tjekke nøglen, er
  fundet `kritisk`.

**Står der en app i drift der ikke opfylder det:** sig det, og lad det blive en
opgave. Ret det ikke i tavshed.

Klikkene i Authentik og proxyen står i `AUTHENTIK.md` og
`NGINX-PROXY-MANAGER.md` i plugin-repoet. Dem udfører et menneske, ikke
rollerne.
```

**Sikkerhedsgennemgangen** er `plugins/agents/agents/security.md`. Tilføj et punkt i
*Gennemgangsliste* efter punktet om compose-filen. Punktet siger: står appen bag Authentik efter
kendetegnet i kontraktens afsnit *En app bag Authentik*, holdes den op mod de syv punkter dér.
Hvert punkt der ikke holder, er et fund. Tillid til `X-authentik-*` uden tjek af nøglen er
`kritisk`. Gentag ikke listen; peg på den.

**Guiden til proxyen** er `NGINX-PROXY-MANAGER.md` i roden. Under *Det appen selv skal gøre* skal
der stå en sætning om at samme krav står i kontrakten, i afsnittet *En app bag Authentik*, og at
kontrakten bestemmer hvis de to er uenige. Hold guidens syv punkter op mod kontraktens. Siger de
noget forskelligt, så ret guiden, ikke kontrakten. Guidens punkter må gerne forklare mere,
men de må ikke kræve noget andet.

## Hvad vi ikke rører

- `AGENTS.md` i roden, som er repoets egen kontrakt. Den opdateres med `/agents:update` efter udgivelsen
- `kontrakt-version`, begge manifester og alle andre versionsnumre. Bumpet afgøres af mennesket, når opgaven er vurderet
- Rollefilerne for architect og developer. De arver afsnittet fra kontrakten
- `AUTHENTIK.md`

## Afhænger af

task-0012

## Beslutninger

- BESLUTTET (mennesket 2026-11-11): reglen står i kontrakten, så alle roller arver den. Afvist:
  rollefilerne for architect og security alene. Det ville nå hurtigere ud, men reglen ville stå to
  steder og ikke i projektets repo.
- BESLUTTET (mennesket 2026-11-11): afsnittets tekst er den der står under *Sådan bygger vi det*.
  Mennesket bad om at se teksten før opgaven blev skrevet.
- BESLUTTET (mennesket 2026-11-11): afsnittet gælder kun en app bag Authentik, ikke enhver app på
  proxyens netværk. Afvist for nu: rammeforbud og formulartokens for alle webapps.
- BESLUTTET (architect): headernavnet `X-Proxy-Secret` står fast i kontrakten, mens nøglens navn
  på stakken er projektets eget valg. Samme konvention i alle apps gør proxy-værtens blok ens.
- BESLUTTET (architect 2026-11-11, efter developers *Uklart*): linjeskiftet midt i
  "`X-authentik-*`-headerne" i afsnittets første stykke flyttes, så ordet står samlet på én
  linje. Markdown gør ellers linjeskiftet til et mellemrum. Ordene er de samme, kun ombrydningen
  ændres. `${NØGLE}` står som det står: det er pladsholderen repoet bruger i forvejen, også i
  workflow-dokumentet.
- BESLUTTET (architect): `kontrakt-version` bumpes ikke i opgaven. CLAUDE.md gør bumpet til
  menneskets beslutning, og det tilbydes, når grenen lukkes.

## Åbne punkter

## Indvendinger

---

## Developers noter

<Alt over denne overskrift ejes af architect. Alt herunder skrives kun af
developer, som aldrig retter i definitionen ovenfor.>

### Hvad er lavet

Gren: `task-0013-contract-app-behind-authentik`, tre commits (`ab46a86`, `853c538`, `4da7ebf`). Intet pushet.

- **Kontraktskabelonen har afsnittet** — `plugins/agents/skills/kickoff/AGENTS.md`: `## En app bag Authentik` indsat mellem `## Værdier hører i .env` og `## Versionering`. Teksten er holdt op mod blokken i *Sådan bygger vi det* med `diff`; den er identisk, tegn for tegn.
- **Sikkerhedsgennemgangens tjekliste** — `plugins/agents/agents/security.md`: nyt punkt *En app bag Authentik* i *Gennemgangsliste*, lige efter punktet om compose-filen. Det peger på kontraktens afsnit og de syv punkter dér, gentager ikke listen, og sætter tillid til `X-authentik-*` uden tjek af nøglen som `kritisk`.
- **Guiden til proxyen** — `NGINX-PROXY-MANAGER.md`, *Det appen selv skal gøre*: nyt afsnit før listen om at samme krav står i kontrakten, `AGENTS.md`, i afsnittet *En app bag Authentik*, og at kontrakten gælder hvis de to er uenige. De syv punkter er holdt op mod kontraktens og rettet hvor guiden sagde mindre:
  1. Afvisningen er nu `401`/`403` *uden indhold* (før: "viser intet af appens indhold").
  2. Tilføjet: brug sprogets egen funktion til sammenligningen.
  3. Tilføjet: *eller er tom*, og *der er ingen standardværdi*.
  4. Udvidet fra loggen alene til loggen, fejlbeskeder og svar, også den nøgle der blev sendt med et afvist kald.
  5. Uændret, siger det samme.
  6. Tilføjet de to headere, `Content-Security-Policy: frame-ancestors 'none'` og `X-Frame-Options: DENY`, på hvert svar, også afvisningerne.
  7. Tilføjet: tokenet er bundet til brugeren.
  Resten af guiden er gennemset for modstrid. Symptomtabellen siger i forvejen "mangler eller er tom", så den er i trit.
- **Repoets kontrol** — `node tools/validate.mjs` er grøn (exit 0) med én advarsel, som ventet:
  `ADVARSEL plugins/agents/skills/kickoff/AGENTS.md er aendret siden origin/main, men kontrakt-version staar stadig paa 22.` Afsnittet er en regelændring, så bumpet skal afgøres af mennesket.
- Ingen nye kommandoer eller indstillinger til `README.md`.
- **Rettelse efter architects beslutning om ombrydningen** — `plugins/agents/skills/kickoff/AGENTS.md`, commit `89306d6`: i afsnittets første stykke står "`X-authentik-*`-headerne" nu samlet på én linje. Et ord-diff viser at den eneste ændring er at de to linjedele er samlet. Ordene er de samme, og linjerne er højst cirka 80 tegn. `${NØGLE}` står uændret. `node tools/validate.mjs` er kørt igen og er grøn (exit 0) med samme ene advarsel om `kontrakt-version` 22.

### Hvad er ikke lavet, og hvorfor

- **`status: i-gang` er ikke sat.** Kalderen bad mig ikke rette opgavefilen ud over noterne under delelinjen. Status står derfor stadig på `planlagt`.
- `kontrakt-version`, manifesterne, `AGENTS.md` i roden, rollefilerne for architect og developer og `AUTHENTIK.md` er ikke rørt, som opgaven siger.
- `docs/BOARD.md`, `docs/decisions/log.md` og opgavefilen er ikke committet. De er kalderens.

### Uklart

Begge punkter nedenfor er afgjort af architect. Ombrydningen er rettet i `89306d6`, og `${NØGLE}` bliver stående. Det oprindelige spørgsmål står herunder.

To mulige fejl i den godkendte tekst. Teksten er indsat ordret, som opgaven siger.

- **Linjeskiftet efter `` `X-authentik-*`- `` i første afsnit.** Linjen slutter med bindestregen, og "headerne" står på næste linje. I markdown bliver linjeskiftet til et mellemrum, så det vises som "`X-authentik-*`- headerne". Vil I have det samlet, skal "headerne" flyttes op på linjen.
- **`${NØGLE}` som eksempel i compose-filen.** Et variabelnavn med `Ø` er ikke gyldigt i compose eller i en skal. Det er tydeligvis en pladsholder, men en model kan finde på at bruge den bogstaveligt. `${NOEGLE}` eller `${<nøglens navn>}` er alternativer, hvis I vil rette det.
