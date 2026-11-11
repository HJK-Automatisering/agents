# En app bag Nginx Proxy Manager og Authentik, klik for klik

Til dig der skal gøre en app i Portainer synlig på en adresse, bag login i
Authentik. Det gøres én gang pr. app.

Det er den anden af to guider. Den første, `AUTHENTIK.md`, er klikkene i
Authentik. Den her er nøglen, proxy-værten i Nginx Proxy Manager og tjekket af
det hele. Begge forudsætter at `PORTAINER.md` er fulgt til ende.

## Rækkefølgen

1. **`PORTAINER.md`** — stacken kører. Appen har et alias på netværket
   `nginx-proxy-manager_default` og ingen `ports:`.
2. **`AUTHENTIK.md`** — udbyderen, applikationen, gruppen, bindingen og
   outposten.
3. **Denne guide** — nøglen, proxy-værten og tjekket.

**Authentik først, proxy-værten bagefter. Opret aldrig en proxy-vært uden
Authentiks konfiguration i fanen *Advanced*.** Uden den sender proxyen alle
videre til appen, også dem der aldrig har logget ind, og intet sted melder
fejl. Udfyld alle tre faner, før du klikker **Save** første gang.

## Pladsholderne

Alt i `<vinkelparenteser>` er noget du selv skriver ind, dér hvor du
indtaster det. Skriv det aldrig i et repo.

| Pladsholder | Hvad |
|---|---|
| `<app>` | Appens navn, det samme som repoet og stacken hedder, som i `PORTAINER.md` |
| `<adresse>` | Den adresse brugerne skal åbne appen på, uden `https://`. Samme som i `AUTHENTIK.md` |
| `<alias>` | Appens alias på `nginx-proxy-manager_default`, fra compose-filen |
| `<port>` | Den port appen lytter på inde i containeren |
| `<nøglens navn>` | Navnet på den variabel appen læser nøglen fra. Det står i appens `.env.example` |
| `<nøglen>` | Selve nøglen, fra del 1. Står på stacken og i proxy-værten, ingen andre steder |
| `<authentik-server>` | Navnet Authentiks servercontainer har på `nginx-proxy-manager_default` |
| `<authentik-adresse>` | Adressen på jeres Authentik, uden `https://`. Bruges kun hvis Authentik ikke er på proxyens netværk |
| `<en anden sti i appen>` | En side eller fil i appen ud over forsiden, fx et stylesheet. Bruges i tjekket |
| `<en bruger i gruppen>` | Brugernavnet på en der må komme ind. Bruges i tjekket, for at se at et forfalsket navn ikke hjælper |
| `<nummer>` | Proxy-værtens nummer i Nginx Proxy Manager. Findes i tjekket |

## Hvorfor appen skal have en nøgle fra proxyen

Netværket `nginx-proxy-manager_default` er delt. Alle stakke bag proxyen ligger
på det, og enhver container på det kan kalde appen direkte på `<alias>` — uden
om proxyen og uden om Authentik.

Det er ikke kun et spørgsmål om at se en side uden login. Authentik fortæller
appen hvem brugeren er i headerne `X-authentik-username`, `X-authentik-email`
og de andre der begynder med `X-authentik-`. Proxyen sætter dem selv og
overskriver dem browseren sender, så de kan ikke forfalskes udefra. Men en
container der kalder appen direkte, kan sætte dem til hvad den vil — og være
hvilken som helst bruger.

**Nøglen lukker den vej.** Proxyen sætter den på hvert kald, efter Authentik
har sagt ja. Appen svarer kun på kald der bærer den. En container på netværket
kender den ikke, og bliver afvist, uanset hvilke headere den sætter.

## Det appen selv skal gøre

Proxyen og Authentik kan ikke gøre det her for appen. Listen kan gives videre
som krav til den opgave der bygger eller retter appen. Er et punkt ikke
opfyldt, skal appen ikke bag proxyen endnu.

De samme krav står i kontrakten, `AGENTS.md`, i afsnittet *En app bag
Authentik*. Det er dem rollerne bygger og tjekker appen efter. Er listen her og
kontrakten uenige, er det kontrakten der gælder.

1. **Afvise ethvert kald uden den rigtige nøgle**, på alle stier — også
   stylesheets, billeder og andet der ser harmløst ud. Afvisningen er `401`
   eller `403` uden indhold, så den viser intet af appen.
2. **Sammenligne nøglen på en måde der tager lige lang tid**, uanset hvor
   meget af den der passer. Ellers kan den gættes et tegn ad gangen. Brug
   sprogets egen funktion til det, ikke en hjemmelavet.
3. **Nægte at starte når nøglen ikke er sat eller er tom.** Loggen siger
   hvorfor, med nøglens navn og aldrig med en værdi. Der er ingen
   standardværdi. Så kan appen aldrig stå åben ved en fejl.
4. **Aldrig skrive nøglen** i loggen, i en fejlbesked eller i et svar. Heller
   ikke den nøgle der blev sendt med et kald der blev afvist.
5. **Kun stole på brugeroplysningerne fra Authentik når nøglen er rigtig.**
   Headerne der begynder med `X-authentik-` læses først, når nøglen er tjekket.
6. **Forbyde at siderne vises i en ramme på en anden side.** Ellers kan en
   fremmed side lægge appen under sin egen og lokke brugeren til et klik
   brugeren ikke ser. Hvert svar, også afvisningerne, bærer
   `Content-Security-Policy: frame-ancestors 'none'` og
   `X-Frame-Options: DENY`.
7. **Give hver formular der ændrer noget, et token mod forfalskede kald.**
   Tokenet er bundet til brugeren. Brugeren er logget ind i Authentik, så en
   side et andet sted kunne ellers sende formularen i brugerens navn.

Proxyen sender nøglen i headeren `X-Proxy-Secret`. Det er den appen skal læse.

## Før du begynder

- Stacken kører, som i `PORTAINER.md`, og appen gør det der står ovenfor.
- `AUTHENTIK.md` er fulgt til ende: udbyder, applikation, gruppe, binding og
  outpost.
- `<adresse>` fører til proxyen.
- Du kan logge ind i Nginx Proxy Manager og i Portainer.

## Del 1 — Nøglen

Nøglen er en lang tilfældig værdi som kun stacken og proxy-værten kender.
Hvordan den skiftes senere, står til sidst i guiden.

1. Åbn stacken `<app>` i Portainer, og se på variablerne. Står
   `<nøglens navn>` der allerede med en værdi fra trin 30 i `PORTAINER.md`, er
   det `<nøglen>`. Gå så videre til del 2.
2. Ellers: lav nøglen. Kør i PowerShell, én linje ad gangen:

   ```powershell
   $bytes = New-Object byte[] 32
   [Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
   -join ($bytes | ForEach-Object { $_.ToString("x2") })
   ```

   Den sidste linje skriver 64 tegn. Det er `<nøglen>`. **Gem den ikke i en
   fil**, og send den ikke i en mail eller en chat. Den skal kun stå de to
   steder, og den kopieres direkte dertil.
3. Tilføj variablen `<nøglens navn>` på stacken med `<nøglen>` som værdi, og
   opdatér stacken med **Pull and redeploy**.
4. Kontrollér at containeren kører igen, og at loggen ikke siger at nøglen
   mangler.

## Del 2 — Proxy-værten: Details

5. Log ind i Nginx Proxy Manager, gå til **Hosts → Proxy Hosts**, og klik
   **Add Proxy Host**. Findes proxy-værten allerede, så åbn den i stedet.
6. Udfyld fanen **Details**:

   | Felt | Værdi |
   |---|---|
   | Domain Names | `<adresse>` |
   | Scheme | `http`. HTTPS ligger i proxyen, ikke i appen |
   | Forward Hostname / IP | `<alias>` — aliaset fra compose-filen, ikke containerens navn og ikke en IP-adresse |
   | Forward Port | `<port>` |
   | Cache Assets | Fra |
   | Block Common Exploits | Til |
   | Websockets Support | Fra, medmindre appen bruger websockets |
   | Access List | **Publicly Accessible**. Adgangen styres af Authentik, ikke af proxyen |

7. Klik ikke **Save** endnu.

## Del 3 — Proxy-værten: SSL

8. Gå til fanen **SSL**.
9. Vælg et certifikat til `<adresse>`, eller bestil et nyt.
10. Slå **Force SSL** til. Så bliver et kald på `http://` sendt videre til
    `https://`, og login sker aldrig over en ukrypteret forbindelse.

## Del 4 — Proxy-værten: Advanced

Her står Authentiks konfiguration og nøglen. Det er den del der gør
proxy-værten til andet end en åben dør.

11. Gå til fanen **Advanced**, og indsæt hele blokken nedenfor i **Custom
    Nginx Configuration**.
12. Skift de to pladsholdere ud: `<authentik-server>` med Authentiks
    servercontainer, og `<nøglen>` med nøglen fra del 1. **Behold
    anførselstegnene** om nøglen, og intet mellemrum foran eller bagved.

```nginx
# Room for Authentik's headers and cookies
proxy_buffers 8 16k;
proxy_buffer_size 32k;

# Keep redirects on the public port
port_in_redirect off;

location / {
    # The address can carry personal data
    access_log off;

    proxy_pass $forward_scheme://$server:$port;
    proxy_set_header Host $host;
    proxy_http_version 1.1;

    # Ask Authentik before every request
    auth_request     /outpost.goauthentik.io/auth/nginx;
    error_page       401 = @goauthentik_proxy_signin;
    auth_request_set $auth_cookie $upstream_http_set_cookie;
    add_header       Set-Cookie $auth_cookie;

    # Who the user is, as Authentik answered
    auth_request_set $authentik_username $upstream_http_x_authentik_username;
    auth_request_set $authentik_groups $upstream_http_x_authentik_groups;
    auth_request_set $authentik_email $upstream_http_x_authentik_email;
    auth_request_set $authentik_name $upstream_http_x_authentik_name;
    auth_request_set $authentik_uid $upstream_http_x_authentik_uid;

    # Overwrite whatever the browser sent under the same names
    proxy_set_header X-authentik-username $authentik_username;
    proxy_set_header X-authentik-groups $authentik_groups;
    proxy_set_header X-authentik-email $authentik_email;
    proxy_set_header X-authentik-name $authentik_name;
    proxy_set_header X-authentik-uid $authentik_uid;

    # Proves to the app that the call came through here
    proxy_set_header X-Proxy-Secret "<nøglen>";
}

location /outpost.goauthentik.io {
    # rd= carries the address the user came from
    access_log              off;

    proxy_pass              http://<authentik-server>:9000/outpost.goauthentik.io;
    proxy_set_header        Host $host;
    proxy_set_header        X-Original-URL $scheme://$http_host$request_uri;
    add_header              Set-Cookie $auth_cookie;
    auth_request_set        $auth_cookie $upstream_http_set_cookie;
    proxy_pass_request_body off;
    proxy_set_header        Content-Length "";
}

location @goauthentik_proxy_signin {
    # Reached with the address the user asked for
    access_log off;

    internal;
    add_header Set-Cookie $auth_cookie;
    return 302 /outpost.goauthentik.io/start?rd=$scheme://$http_host$request_uri;
}
```

13. Klik **Save**. Står proxy-værten bagefter som *Offline*, har Nginx Proxy
    Manager afvist konfigurationen. Åbn den igen, og se efter stavefejl i
    *Advanced*.

### Hvad blokken gør, del for del

**De tre linjer øverst.** `proxy_buffers` og `proxy_buffer_size` giver plads
til Authentiks headere og cookies, som er større end proxyen regner med.
`port_in_redirect off` holder omdirigeringer på den adresse brugeren kender,
uden et internt portnummer.

**`location /` er appen.** Alt brugeren åbner, går herigennem.

- `proxy_pass` sender videre til `<alias>` og `<port>` fra fanen *Details*.
- `auth_request` spørger Authentik før **hver** forespørgsel. Svarer
  Authentik `401`, sender `error_page 401` brugeren til login.
- De to linjer med `$auth_cookie` sender Authentiks cookie tilbage til
  browseren, så brugeren forbliver logget ind.
- De fem `auth_request_set` henter hvem brugeren er, fra Authentiks svar.
- De fem `proxy_set_header X-authentik-…` sætter headerne til det Authentik
  svarede. **Alle fem står der, også dem appen ikke bruger.** Så kan en header
  af samme navn fra browseren aldrig nå appen, heller ikke den dag appen
  begynder at læse en ny. Slet ingen af dem, og ret dem aldrig til at sende
  browserens header videre.
- `proxy_set_header X-Proxy-Secret` sætter nøglen. Den står kun i
  `location /`, ikke i de to andre: Authentik skal ikke have den.

**`location /outpost.goauthentik.io` er Authentiks egne adresser.** De skal
kunne nås uden login; det er dem login sker igennem. `<authentik-server>` er
Authentiks servercontainer på `nginx-proxy-manager_default`, og `9000` er den
port Authentik svarer på inde på netværket. Kører Authentik et andet sted, så
lad linjen pege på dens adresse i stedet:

```nginx
    proxy_pass              https://<authentik-adresse>/outpost.goauthentik.io;
```

**`location @goauthentik_proxy_signin` sender til login.** Den nås kun indefra,
når Authentik har svaret `401`, og omdirigerer til Authentiks login med den
adresse brugeren bad om i `rd=`, så brugeren lander samme sted bagefter.

**Adgangsloggen er slået fra i alle tre `location`-blokke.** Ellers skriver
Nginx Proxy Manager en linje pr. forespørgsel med hele adressen. En adresse
kan bære persondata — et navn i en søgning, et nummer på en sag i stien — og
loggen ligger på proxyen, hvor alle der administrerer den, kan læse den.
Adressen når loggen tre steder: i `location /` for en bruger med login, i
`@goauthentik_proxy_signin` når en bruger uden login åbner den, og derefter i
`rd=` under `location /outpost.goauthentik.io`. Derfor alle tre.

Hvem der logger ind, logger Authentik selv. Den der sætter en ny app op, kan
sjældent se på adresserne om de bærer persondata, så loggen er slået fra som
standard. Er du sikker på at appens adresser aldrig gør det, kan linjen
`access_log off;` fjernes fra `location /` alene. De to andre bliver stående.
Fejlloggen skrives stadig.

**Der er ingen `error_page 500`, og der må ikke komme en.** Kan proxyen ikke
nå Authentik, skal brugeren få en fejl og ikke slippe igennem. En omskrivning
af fejlen kan vende netop det.

## Del 5 — Tjek

Kør alle trin. Hvert af dem fanger noget de andre ikke gør.

**Uden login kommer ingen ind.**

14. Kør fra en hvilken som helst maskine:

    ```powershell
    curl.exe -sI https://<adresse>/
    curl.exe -sI https://<adresse>/<en anden sti i appen>
    ```

    Begge skal svare `302`, og linjen `location:` skal indeholde
    `/outpost.goauthentik.io/start`. Svarer en af dem `200`, er Authentik
    ikke foran.

**Uden nøglen kommer ingen ind, heller ikke en anden container.** Tjekket
køres fra Nginx Proxy Managers egen container mod `<alias>`. Det er netop den
vej en fremmed container på netværket ville tage.

15. I Portainer: åbn Nginx Proxy Managers container, gå til **Console**, vælg
    `/bin/sh`, og klik **Connect**. Kør:

    ```sh
    curl -s -o /dev/null -w '%{http_code}\n' http://<alias>:<port>/
    curl -s -o /dev/null -w '%{http_code}\n' http://<alias>:<port>/<en anden sti i appen>
    curl -s -o /dev/null -w '%{http_code}\n' -H 'X-authentik-username: <en bruger i gruppen>' http://<alias>:<port>/
    curl -s -o /dev/null -w '%{http_code}\n' -H 'X-Proxy-Secret: forkert' http://<alias>:<port>/
    ```

    Hver linje skal svare en afvisning: `401` eller `403`, alt efter appen.
    Den tredje er en container der udgiver sig for at være en bruger; den
    fjerde er en der gætter. Svarer en af dem `200`, tjekker appen ikke
    nøglen. Se symptomtabellen.

**Kun gruppen kommer ind.**

16. Åbn et privat browservindue, gå til `https://<adresse>`, og log ind som en
    bruger i gruppen. Appen vises.
17. Åbn et nyt privat vindue, og log ind som en bruger der **ikke** er i
    gruppen. Authentik skal afvise med en besked om manglende adgang, og
    appen må ikke vises.

**Adgangsloggen står stille.**

18. I Nginx Proxy Managers konsol: find proxy-værtens nummer.

    ```sh
    grep -l '<adresse>' /data/nginx/proxy_host/*.conf
    ```

    Svaret er `/data/nginx/proxy_host/<nummer>.conf`.
19. Tæl linjerne i proxy-værtens adgangslog, med nummeret fra svaret i stedet
    for `<nummer>`:

    ```sh
    wc -l /data/logs/proxy-host-<nummer>_access.log
    ```

20. I browseren: åbn et nyt privat vindue, og gå direkte til en adresse dybt i
    appen, før du logger ind, fx `https://<adresse>/<en anden sti i appen>?test=1`.
    Log ind som en bruger i gruppen, og brug appen et øjeblik.
21. Kør `wc -l` igen. Tallet skal være det samme som i trin 19. Siger `wc` at
    filen ikke findes, er der heller ikke skrevet noget.

**Containeren.**

22. I Portainer står appens container som *running*, og under *Published
    Ports* står intet. Loggen viser ingen nøgle og ingen advarsel om den.

Så står appen bag login. Adgangen gives og tages i gruppen; se *Når nogen
skal ind eller ud* i `AUTHENTIK.md`.

## Symptomer

| Symptom | Se efter |
|---|---|
| Uden login svarer adressen `200` | Fanen *Advanced* er tom eller ikke gemt, eller applikationen er ikke på outposten. Del 4 her, og del 4 i `AUTHENTIK.md` |
| Proxyen svarer `500` i stedet for at sende til login | Proxyen kan ikke nå Authentik. `<authentik-server>` eller porten er forkert, eller Authentik er ikke på proxyens netværk. Del 4, `location /outpost.goauthentik.io` |
| Login lykkes, men man sendes i ring | *External host* i udbyderen er ikke præcis den adresse der åbnes. Trin 3 i `AUTHENTIK.md` |
| En bruger uden for gruppen kommer ind | Gruppen er ikke bundet til applikationen. Del 3 i `AUTHENTIK.md` |
| En bruger i gruppen afvises af Authentik | Brugeren er ikke i gruppen, eller *Policy engine mode* står på `all` med flere grupper bundet. Trin 6 og 10 i `AUTHENTIK.md` |
| Alle afvises af appen efter login | Linjen `X-Proxy-Secret` mangler, eller værdien er ikke præcis den samme som `<nøglens navn>` på stacken — mellemrum, manglende anførselstegn. Eller stacken er ikke opdateret efter en ændring. Del 1 og del 4 |
| Containeren genstarter, og loggen siger at nøglen ikke er sat | `<nøglens navn>` mangler på stacken eller er tom. Del 1 |
| `502 Bad Gateway` efter login | Containeren kører ikke, eller *Forward Hostname / IP* og *Forward Port* er ikke `<alias>` og `<port>`. Del 2 |
| Tjekket uden nøgle svarer `200` | Appen tjekker ikke nøglen, og enhver container på netværket kan nå den. Det kan ikke rettes i proxyen. Appen skal opfylde *Det appen selv skal gøre*; stop stacken i Portainer indtil den gør |
| Tjekket uden nøgle svarer `000` | Proxyens container kan ikke nå `<alias>` på `<port>`. Forkert alias eller port, eller appen er ikke på `nginx-proxy-manager_default` |
| Tallet fra `wc -l` er steget | `access_log off;` mangler i en af de tre `location`-blokke. Del 4, og klik **Save** igen |
| Proxy-værten står som *Offline* | Nginx Proxy Manager har afvist konfigurationen i *Advanced*. Se efter stavefejl og manglende `;` |

## Nøglen: hvor den står, og hvordan den skiftes

**Nøglen står to steder:** som `<nøglens navn>` på stacken i Portainer, og i
linjen `X-Proxy-Secret` i fanen *Advanced* på proxy-værten. Ingen andre
steder — ikke i repoet, ikke i en fil, ikke i en mail. Begge steder kan ses af
dem der administrerer Portainer og Nginx Proxy Manager. Det er dem der kender
nøglen, og ingen andre.

**Skift den** når en der har kunnet se den, ikke længere skal, eller når den
kan have været set af andre:

1. Lav en ny nøgle som i del 1, trin 2.
2. Åbn proxy-værten, ret værdien i linjen `X-Proxy-Secret` i fanen
   *Advanced*, og klik **Save**.
3. **Lige efter:** ret `<nøglens navn>` på stacken til samme værdi, og opdatér
   stacken med **Pull and redeploy**. Imellem de to afviser appen alle,
   også brugere med login. Gør det derfor når få bruger appen.
4. Kør tjekket i del 5, trin 14 og 15.

Den gamle nøgle er væk i samme øjeblik stacken er opdateret. Der er intet at
slette.
