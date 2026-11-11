# En app bag Authentik, klik for klik

Til dig der har en app kørende som stack i Portainer og skal have den bag
login, så kun brugerne i én gruppe kan åbne den. Det gøres én gang pr. app.

Det er den første af to guider. Den her er klikkene i Authentik. Den anden,
`NGINX-PROXY-MANAGER.md`, er proxy-værten, nøglen og tjekket til sidst.
Begge forudsætter at `PORTAINER.md` er fulgt til ende.

## Rækkefølgen

1. **`PORTAINER.md`** — stacken kører. Appen har et alias på netværket
   `nginx-proxy-manager_default` og ingen `ports:`, så den kun kan nås
   gennem proxyen.
2. **Denne guide** — udbyderen, applikationen, gruppen, bindingen og
   outposten i Authentik.
3. **`NGINX-PROXY-MANAGER.md`** — nøglen, proxy-værten og tjekket.

**Opret aldrig proxy-værten uden Authentiks konfiguration.** En proxy-vært
uden den sender alle videre til appen, også dem der aldrig har logget ind.
Authentik melder ingen fejl om det, for den bliver aldrig spurgt.

## Sådan hænger det sammen

Authentik står som *forward auth*. Nginx Proxy Manager spørger Authentik før
hver forespørgsel, om brugeren er logget ind og må komme ind. Er svaret nej,
sendes brugeren til login. Er svaret ja, sender proxyen forespørgslen videre
til appen, med Authentiks oplysninger om brugeren og en nøgle der viser at
kaldet kom gennem proxyen.

Det kræver fem ting, og alle fem skal være der:

| Hvad | Hvor | Gør |
|---|---|---|
| En **udbyder** (provider) | Authentik, del 1 | Siger at appen beskyttes som forward auth, og på hvilken adresse |
| En **applikation** | Authentik, del 2 | Det brugerne får adgang til |
| En **gruppe**, bundet til applikationen | Authentik, del 3 | Afgør hvem der kommer ind |
| Applikationen på den **indlejrede outpost** | Authentik, del 4 | Den del af Authentik proxyen spørger |
| En **proxy-vært** med Authentiks konfiguration og nøglen | `NGINX-PROXY-MANAGER.md` | Spørger Authentik, og sender kun videre ved et ja |

## Pladsholderne

Alt i `<vinkelparenteser>` er noget du selv skriver ind, dér hvor du
indtaster det. Skriv det aldrig i et repo.

| Pladsholder | Hvad |
|---|---|
| `<app>` | Appens navn, det samme som repoet og stacken hedder, som i `PORTAINER.md` |
| `<appens visningsnavn>` | Navnet brugerne ser i Authentik, fx på listen over deres apps |
| `<adresse>` | Den adresse brugerne skal åbne appen på, uden `https://` |
| `<authentik-adresse>` | Adressen på jeres Authentik, uden `https://` |
| `<gruppe>` | Navnet på gruppen med de brugere der må komme ind |

## Før du begynder

- Stacken kører, som i `PORTAINER.md`.
- Appen gør det der står under *Det appen selv skal gøre* i
  `NGINX-PROXY-MANAGER.md`. Gør den ikke det, står den åben for andre
  containere på proxyens netværk, uanset hvad du klikker her.
- `<adresse>` er valgt og fører til proxyen.
- Du kan logge ind i Authentik som administrator.

Log ind på `https://<authentik-adresse>`, og klik **Admin interface** øverst
til højre. Alle trin nedenfor er i administrationen.

## Del 1 — Udbyderen

Udbyderen siger til Authentik at appen skal beskyttes som forward auth, og
hvilken adresse den står på.

1. Gå til **Applications → Providers**, og klik **Create**.
2. Vælg **Proxy Provider**, og klik **Next**.
3. Udfyld:

   | Felt | Værdi |
   |---|---|
   | Name | `<appens visningsnavn>` |
   | Authorization flow | `default-provider-authorization-implicit-consent`. Så skal brugeren ikke klikke *tillad* hver gang |
   | Tilstand | **Forward auth (single application)** |
   | External host | `https://<adresse>` — **præcis** den adresse brugerne åbner |

4. Lad resten stå, og klik **Finish**.

*External host* er det felt der oftest er forkert. Passer den ikke med den
adresse der åbnes, lykkes login, men brugeren sendes i ring.

## Del 2 — Applikationen

5. Gå til **Applications → Applications**, og klik **Create**.
6. Udfyld:

   | Felt | Værdi |
   |---|---|
   | Name | `<appens visningsnavn>` |
   | Slug | `<app>` |
   | Provider | Udbyderen fra trin 3 |
   | Policy engine mode | `any`. Det er standarden. Med `all` skal en bruger være med i alle de grupper der er bundet, for at komme ind |

7. Klik **Create**.

## Del 3 — Gruppen og bindingen

Gruppen afgør hvem der kommer ind. Findes der allerede en gruppe med netop de
rigtige brugere, kan den bruges; spring så til trin 11.

8. Gå til **Directory → Groups**, og klik **Create**.
9. Skriv `<gruppe>` i **Name**. Vælg et navn der siger hvad gruppen giver
   adgang til. Klik **Create**.
10. Åbn gruppen, gå til fanen **Users**, klik **Add existing user**, vælg
    brugerne, og klik **Add**.

Nu bindes gruppen til applikationen. **Uden en binding kan alle brugere i
Authentik åbne appen.** En applikation uden bindinger er åben for alle der kan
logge ind, og det ser ud præcis som om alt virker.

11. Gå til **Applications → Applications**, og åbn applikationen fra trin 6.
12. Gå til fanen **Policy / Group / User Bindings**, og klik **Bind existing
    policy / group / user**.
13. Vælg **Group**, vælg `<gruppe>`, og klik **Create**.
14. Kontrollér at gruppen står på fanen. Står der intet, er bindingen ikke
    gemt, og alle kommer ind.

En bruger der ikke er i gruppen, afvises af Authentik og ser aldrig appen.

## Del 4 — Den indlejrede outpost

Outposten er den del af Authentik som Nginx Proxy Manager spørger. Den
indlejrede følger med Authentik og skal blot have applikationen.

15. Gå til **Applications → Outposts**.
16. Klik på blyanten ud for **authentik Embedded Outpost**.
17. Flyt applikationen fra trin 6 over i listen over valgte applikationer.
    **Fjern ikke de applikationer der står der i forvejen.** De er andre apps,
    og de holder op med at virke når de fjernes.
18. Klik **Update**.

## Videre

Authentik er klar. Fortsæt i `NGINX-PROXY-MANAGER.md`: nøglen, proxy-værten og
tjekket. Tjekket viser også om noget her mangler.

## Når nogen skal ind eller ud

Adgangen er gruppen. Appen skal ikke røres, og stacken heller ikke.

- **En ny bruger skal ind:** åbn `<gruppe>` under **Directory → Groups**,
  fanen **Users**, og tilføj brugeren som i trin 10.
- **En bruger skal ud:** åbn samme fane, markér brugeren, og fjern den fra
  gruppen.
- **Ingen må komme ind:** stop stacken i Portainer. At fjerne bindingen
  lukker ikke; det åbner for alle.
