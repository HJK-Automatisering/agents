---
nummer: task-0003
titel: Opdateringskaldet har ingen regel for en kilde der er ældre end projektets kopi
status: planlagt
kilde: interview
oprettet: 2026-09-22
---

# task-0003 — Opdateringskaldet har ingen regel for en kilde der er ældre end projektets kopi

## Hvad og hvorfor

Kaldet sammenligner to versioner og har kun regler for "ens" og for at
projektets kopi er bagud. Er kilden ældre end projektets kopi, står der intet,
og så er det op til den enkelte tråd at finde ud af det. Tilfældet er ikke
teoretisk: det opstår hver gang et projekt er blevet opdateret fra en udgave
der endnu ikke er udgivet, og det blev mødt to gange under afprøvningen den
2026-09-22. Begge gange standsede kaldet af sig selv — men det var
modellens indskydelse, ikke en regel. Den modsatte udgang er at en nyere
kontrakt bliver skrevet over med en ældre.

Hooken har reglen i forvejen og er efterprøvet: den siger kun til når kilden
er nyere, og tier ellers. Det er kun kaldet der mangler den.

## Færdig når

- [ ] Møder kaldet en kilde der er ældre end projektets kopi, skriver det ingenting og siger hvorfor
- [ ] Reglen står begge steder hvor der sammenlignes — både for kontrakten og for et workflow
- [ ] En for gammel kilde til kontrakten stopper ikke resten af kaldet; workflows prøves stadig
- [ ] Ingen versionsnumre er rørt

## Sådan bygger vi det

| Fil | Ændring |
|---|---|
| `plugins/agents/skills/update/SKILL.md` | Linje 31 og linje 96. Begge steder siger i dag kun hvad der sker når versionerne er ens |

Formuler reglen som hooken gør det: **der sker kun noget når kilden er nyere
end projektets kopi.** Så dækker én sætning både "ens" og "ældre", i stedet for
at der skal tilføjes et tredje tilfælde to steder.

Del 2 er selvbeskyttende i forvejen — den sammenligner stempler pr. workflow —
så en for gammel kontrakt skal ikke forhindre den i at køre.

## Hvad vi ikke rører

- `plugins/agents/hooks/detect-project-zero.cjs`. Den har reglen og er efterprøvet.
- De øvrige ti roller.
- `kontrakt-version`, `skabelon-version` og de to manifester. Opgaven ændrer en
  rolles tekst, ikke kontrakten og ikke en workflow-skabelon.

## Afhænger af

intet

## Beslutninger

- BESLUTTET: reglen skrives som "kun når kilden er nyere" frem for som et
  tredje tilfælde. To steder skal holdes ens, og en positiv betingelse driver
  mindre fra hinanden end to negative undtagelser.
- BESLUTTET: en for gammel kontrakt stopper ikke workflow-delen — den
  sammenligner stempler pr. workflow og kan ikke rulle noget tilbage af sig
  selv. Afvist: at standse hele kaldet, som ville gøre en uskadelig forskel
  til en blokering.

## Åbne punkter

## Indvendinger

---

## Developers noter

### Hvad er lavet
### Hvad er ikke lavet, og hvorfor
### Uklart
