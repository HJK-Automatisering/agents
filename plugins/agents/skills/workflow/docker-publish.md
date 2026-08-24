---
navn: docker-publish
formål: Bygger og publicerer et container-image til GitHub Packages ved hvert push til main, med signering og rollback-tags
foreslå-ja-når: fundamentet siger at projektet leveres som container-image eller kører på en Docker- eller Portainer-vært
filer:
  - fra: assets/docker-publish.yaml
    til: .github/workflows/docker-publish.yaml
---

# docker-publish

Ved hvert push til `main` bygges et image og pushes til `ghcr.io/<org>/<repo>`. Semver-tags (`v1.2.3`) giver versionerede images. PR-builds bygger men pusher ikke.

Projektet får en **kalder** på ti linjer. Selve bygningen bor i `HJK-Automatisering/workflow` som et genbrugeligt workflow, så de SHA-pinnede action-versioner kan bumpes ét sted i stedet for i hvert repository.

## Brug det når

- Projektet leveres som et container-image.
- Det kører på en Docker- eller Portainer-vært.
- Der findes en `Dockerfile` i roden, eller der kommer en.

## Brug det ikke når

- Projektet er et bibliotek eller en pakke der distribueres på anden vis.
- Det er et statisk site eller deployes gennem en anden pipeline.
- Der ikke er nogen plan om at containerisere. Tilføj det senere når der er.

## Hvad du får

| Tag | Hvornår | Brug |
|---|---|---|
| `:main` | hvert push til main | rullende, altid nyeste |
| `:sha-a1b2c3d` | hvert push | **immutabelt — det er dette du ruller tilbage til** |
| `:1.2.3` og `:1.2` | tag `v1.2.3` | udgivelser |
| `:latest` | seneste semver-tag | |
| `:pr-123` | pull request | bygges, pushes ikke |

Imaget signeres med cosign mod sigstores Fulcio. Alle tags peger på samme digest, så der signeres én gang.

Workflowet returnerer `digest`, `version` og `tags` som outputs, så et efterfølgende job kan deploye på digest frem for på et tag.

## Forudsætninger projektet skal opfylde

Uden disse fejler workflowet — eller, værre, lykkes uden at gøre hvad du tror:

1. **`./Dockerfile` skal findes i roden.** Ligger den et andet sted, sæt `dockerfile:` i kalderen. Ret ikke det genbrugelige workflow.
2. **Dockerfilen skal tage imod `APP_VERSION` og `GIT_SHA`** som `ARG`, sætte dem som `ENV` og logge dem ved opstart. Ellers sendes de to build-args ind og forsvinder, og Portainers logvisning kan ikke fortælle hvilken build der kører. Det er hele grunden til at de er der.
3. **`permissions`-blokken i kalderen skal stå der.** Et genbrugeligt workflow kan ikke give sig selv flere rettigheder end kalderen har. Er organisationens standard read-only, fejler push til GHCR uden den — og fejlen ser ud som et loginproblem.
4. **Intet at gøre — `workflow`-repoet er offentligt**, og offentlige genbrugelige workflows kan kaldes af alle uden yderligere opsætning. Bliver det nogensinde privat igen, skal Settings → Actions → General → Access åbnes for organisationen; ellers fejler kaldet med at workflowet ikke findes, hvilket ligner en stavefejl i stien.
5. **`@v1` skal findes i `workflow`-repoet** som et flytbart tag ved siden af de immutable `v1.x.y`. Se vedligeholdelse nedenfor. **Der er i dag ingen tags i repoet, så kalderen kan ikke resolve `@v1`.**
6. **Kun `linux/amd64` som standard.** Skal det køre på arm, sæt `platforms:` i kalderen. Tilføj ikke arm64 "for at være sikker": det bygger under QEMU-emulering og tager mange gange så lang tid.
7. **Pakken oprettes ved første push til `main`** og er privat. Første gang skal den kobles til repoet, så adgangen arves, og synligheden sættes bevidst.
8. **Store bogstaver i organisationsnavnet.** GHCR kræver små. `metadata-action` konverterer sine egne tags, og cosign-trinnet konverterer i hånden — men bygger du selv en imagereference et tredje sted, skal du huske det samme.

## Inputs i kalderen

Alle er valgfrie. Står de kommenteret ud i skabelonen.

| Input | Standard | Hvornår |
|---|---|---|
| `platforms` | `linux/amd64` | Noget kører faktisk på arm |
| `dockerfile` | `./Dockerfile` | Dockerfilen ligger ikke i roden |
| `context` | `.` | Build-konteksten er en undermappe |
| `image_name` | `<org>/<repo>` | Andet imagenavn ønskes |
| `registry` | `ghcr.io` | Andet registry |
| `sign` | `true` | Registryet understøtter ikke signering |
| `extra_build_args` | tom | Flere build-args — læs sikkerhedsafsnittet først |

Mangler et input du har brug for, tilføjes det i det genbrugelige workflow — ikke ved at kopiere workflowet ind i projektet og rette i det.

## Sikkerhed

**Build-args ender som `ENV` i det færdige image.** Alle der kan pulle imaget kan læse dem. `APP_VERSION` og `GIT_SHA` er harmløse — men lægger nogen en token, en forbindelsesstreng eller en adgangskode i `extra_build_args`, er den offentlig, og den skal roteres. Ikke bare fjernes.

Hemmeligheder der skal bruges *under* bygningen hører i `secrets:` med BuildKit-mounts, ikke i `build-args`. Hemmeligheder der skal bruges *ved kørsel* injiceres af værten.

Tilføj ikke `secrets: inherit` til kalderen. `GITHUB_TOKEN` følger automatisk med; `inherit` giver det kaldte workflow adgang til alt hvad repoet har.

**Intet organisationsspecifikt i det genbrugelige workflow.** Repoet er offentligt, så alle kan læse det og alle kan kalde det. Interne registries, navne på secrets og værtsnavne hører i kalderen eller i et `input` — aldrig i workflowet selv. Det er ikke fordi et navn er en hemmelighed, men fordi et offentligt repo ikke kan gøres privat igen med tilbagevirkende kraft: det der har været læsbart, har været læsbart.

At andre uden for organisationen kan kalde workflowet er i sig selv ufarligt — de kører det med deres eget `GITHUB_TOKEN` og pusher til deres eget registry. Reglen ovenfor er det der holder det sådan.

## Hvem gør hvad

- **`kickoff`** kopierer kalderen til `.github/workflows/`, noterer valget i `CLAUDE.md`, og skriver et `ÅBENT`-punkt for hver forudsætning projektet endnu ikke opfylder — typisk en manglende `Dockerfile`.
- **`architect`** skriver i fundamentet: imagenavn, hvor det deployes, og at rollback sker via `:sha-`-tagget eller digest. Uden det ved ingen hvordan man ruller tilbage klokken to om natten.
- **`developer`** skriver `Dockerfile` med `ARG`/`ENV` for `APP_VERSION` og `GIT_SHA`, og logger dem ved opstart. Må gerne rette kalderens `with`-blok. Må **ikke** kopiere det genbrugelige workflow ind i projektet.
- **`security`** tjekker at der ikke er hemmeligheder i build-args, at `secrets: inherit` ikke er sneget ind, og at pakkens synlighed er sat bevidst.
- **`reviewer`** rører ikke workflow-filer.

## Vedligeholdelse

Det genbrugelige workflow bor i `HJK-Automatisering/workflow/.github/workflows/docker-publish.yaml`. Action-versioner er pinnet til commit-SHA — det er det rigtige — og bumpes **kun der**.

Versionering følger action-konventionen:

- Immutable tags pr. ændring: `v1.0.0`, `v1.0.1`, …
- Et flytbart `v1` der peger på nyeste `v1.x.y`. Det er den reference projekterne bruger.
- Brydende ændringer får `v2`, og projekterne flytter når de er klar.

Et projekt kan pinne til `@v1.0.3` hvis det skal stå helt stille. Prisen er at det ikke får rettelser.

## Standalone-fallback

`assets/docker-publish-standalone.yaml` er den gamle selvstændige udgave, der bygger uden at kalde noget. Brug den kun når projektet ikke kan nå `workflow`-repoet — et repo uden for organisationen, eller et hvor Actions-adgang på tværs af repositories er lukket.

Vælger du den, arver projektet vedligeholdelsen af sine egne SHA-pins. Skriv det i fundamentet, så det ikke bliver en overraskelse.
