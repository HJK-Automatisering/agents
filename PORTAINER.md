# Fra repo til kørende stack i Portainer

Til dig der skal have en app op som Git-stack i Portainer, klik for klik.
Det gøres én gang pr. app; derefter er hver release en commit på `main`,
som Portainer selv opdager.

Hvorfor det er sat sådan op, og hvad der skal være på plads i repoet først,
står i workflow-dokumentet `docs/workflows/docker-publish.md` i app-repoet
under *Opsætning af stacken i Portainer*. Den her er kun klikkene.

`<app>` nedenfor er appens navn, det samme som repoet hedder. Brug det
samme navn hele vejen — til kilden, til tokenet og til stacken — så det kan
ses hvad der hører sammen. `<org>` er organisationens navn på GitHub; hos
os er det `HJK-automatisering`, hos andre noget andet.

## Før du begynder

- `deploy/docker-compose.yml` ligger på `main` i app-repoet og består lint.
- Imaget findes i GHCR i den version compose-filen peger på.
- Du har værdierne til alle variabler compose-filen bruger som `${NØGLE}`.
  Navnene står i `.env.example` i repoet.
- Du har to vinduer: Portainer og GitHub. Du skifter mellem dem undervejs.

## Del 1 — Git-kilden i Portainer

Kilden er Portainers adgang til app-repoet. Den læser kun; den skriver aldrig.

1. Klik på **Sources** under **App Delivery** i menuen til venstre.
2. Klik på **Add New**.
3. Skriv `<app>` i **Source Name**.
4. Indsæt repoets adresse i **Repository URL**, på formen
   `https://github.com/<org>/<app>`. Uden `.git` til sidst.
5. Vælg **GitHub** som **Git Provider**. Feltet *Authorization type*
   forsvinder; GitHub bruger altid token.
6. Skriv dit **GitHub-brugernavn** i **Username**. Dit Portainer-brugernavn
   virker også, fordi GitHub ikke læser feltet når adgangskoden er et token,
   men GitHub-navnet gør det tydeligt hvis token det er, den dag det udløber.
7. Lad vinduet stå åbent. Adgangskoden er et token, som laves i GitHub nu.

## Del 2 — Tokenet i GitHub

Et *fine-grained* token med læseadgang til det ene repo og intet andet.
Det er den mindste adgang der virker, og det er med vilje.

8. Åbn GitHub i et nyt vindue, og log ind med din egen bruger.
9. Klik på dit brugerikon øverst til højre, og vælg **Settings**.
10. Klik på **Developer settings** nederst i menuen til venstre.
11. Åbn **Personal access tokens**, og vælg **Fine-grained tokens**.
12. Klik på **Generate new token**.
13. **Token name**: `portainer-<app>`. Så kan tokenet findes igen ud fra
    kilden i Portainer, og omvendt.
14. **Resource owner**: `<org>`, organisationen. Står den ikke på
    listen, tillader den ikke fine-grained tokens endnu, og det skal en
    organisationsadministrator slå til først. Kræver organisationen
    godkendelse af tokens, virker tokenet først når en administrator har
    godkendt det; indtil da fejler kilden i Portainer med en adgangsfejl.
15. **Expiration**: 366 dage, det længste GitHub tilbyder. **Sæt en
    påmindelse i din kalender nu**, 14 dage før udløb. Når tokenet udløber,
    stopper udrulningerne stille: Actions er grøn, Portainer henter bare
    ikke noget nyt, og ingen får besked.
16. **Repository access**: **Only select repositories**, og vælg `<app>`.
    Ikke *All repositories*. Tokenet skal kun kunne læse det ene repo.
17. Klik på **Add permissions** under *Repository permissions*, og vælg
    **Contents**.
18. Kontrollér at **Contents** står med **Access: Read-only**. *Metadata*
    kommer med automatisk som read-only; det er GitHubs krav, ikke vores.
    Intet andet skal vælges.
19. Klik på **Generate token** nederst. GitHub viser en opsummering og
    spørger igen; klik **Generate token** en gang til.
20. **Kopiér tokenet med det samme.** Det vises kun denne ene gang. Lukker
    du siden, må du lave et nyt.

## Del 3 — Færdiggør kilden

21. Tilbage i Portainer: indsæt tokenet i **Password**.
22. Slå **Enable polling** til, og sæt intervallet til `5m`. Det er den
    længste ventetid fra en release committer til Portainer udruller den.
    Webhook er ikke en mulighed: GitHub kan ikke nå serveren.
23. Klik **Continue**, og dernæst **Create**. Fejler oprettelsen med en
    adgangsfejl, er det tokenet: forkert repo valgt i trin 16, manglende
    godkendelse fra trin 14, eller en fejl i indsætningen. Lav det om i
    GitHub; gæt ikke.

## Del 4 — Stacken

24. Klik på **Stacks** i menuen, og dernæst **Add stack**.
25. Skriv navnet i **Name**: `<app>`.
26. Vælg **Repository** under **Build method**. Ikke *Web editor*, ikke
    *Upload*.
27. Vælg kilden fra trin 3 under **Source**.
28. Kontrollér at **Repository reference** peger på `main`, skrevet
    `refs/heads/main`. Det er den gren deploy-jobbet committer til. Et tag
    eller en anden gren giver en stack der aldrig opdateres.
29. Ret **Compose path** til `deploy/docker-compose.yml`. Standardværdien
    er en anden, og med den finder Portainer ingen fil.
30. Variablerne. Enten **Load variables from .env file** med en fil fra din
    egen maskine, eller **Add an environment variable** én ad gangen, med
    navn præcis som i `${NØGLE}` i compose-filen. En variabel der mangler,
    giver ingen fejl: Docker Compose sætter den til tom, og appen starter
    med en tom forbindelsesstreng. Tjek listen mod `.env.example`, før du
    går videre. **Filen med værdierne må aldrig ind i repoet.** Slet den fra
    maskinen, når stacken kører; værdierne ligger nu på stacken.
31. Vælg organisationens registry under **Select registries**. Det er det
    der lader Portainer logge ind på `ghcr.io` og pulle imaget. Står der
    intet at vælge, er registryet ikke givet adgang til miljøet; det gør
    den der administrerer Portainer, ikke du.
32. Lad **Re-pull image** og **Force redeployment** stå slået fra, hvis
    felterne vises. Versionstags flytter sig aldrig, så der er intet at
    hente igen, og en tvungen genudrulning genstarter containerne hvert
    interval uden grund.
33. Klik på **Deploy the stack**. Udrulningen kører i baggrunden. At siden
    svarer, betyder at anmodningen er modtaget, ikke at containerne kører.

## Del 5 — Tjek

34. Stacken står som kørende, og hver service har en container i *running*.
    Står en i *created* eller genstarter den, så læs containerens log først
    og stackens log dernæst. Loginfejl mod `ghcr.io` er registryet fra
    trin 31; en manglende fil er stien fra trin 29.
35. Containerens log viser `APP_VERSION` ved opstart, og det er versionen
    fra compose-filen.
36. Proxyen finder appen på aliaset fra compose-filen.
37. Første release: tag og push en version, følg kørslen i Actions, og vent
    de fem minutter ud. Compose-filen på `main` viser den nye version,
    stacken viser den nye commit, og containerens log viser den nye
    `APP_VERSION`. Vil du ikke vente, gør **Pull and redeploy** på stacken
    det samme med det samme.

Så er appen i drift fra Git. Ret aldrig image-linjen i Portainers editor
eller i hånden derefter; næste release overskriver den.

## Når tokenet skal fornys

Det er det der kommer til at ske om et år, og det er derfor påmindelsen
fra trin 15 findes.

1. Lav et nyt token i GitHub som i del 2, med samme navn og et løbenummer,
   fx `portainer-<app>-2`.
2. Åbn kilden under **App Delivery → Sources**, og skift **Password** til
   det nye token. Kilden gemmes; stacken rører du ikke.
3. Slet det gamle token i GitHub, når kilden har pollet én gang uden fejl.

Registryets token udløber også, og det rammer alle apps på én gang; det
ejer den der administrerer Portainer. Spørg hvornår det udløber, så I ikke
begge bliver overraskede samme dag.
