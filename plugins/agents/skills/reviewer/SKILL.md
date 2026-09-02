---
description: "Sætter reviewer-agenten på en gennemgang for redundans, unødig kompleksitet, skredet stil og manglende dokumentation. Rydder op bagefter. Kører isoleret og rapporterer; den retter ikke selv."
disable-model-invocation: true
---

# reviewer

Send `reviewer`-agenten af sted med Agent-værktøjet, `subagent_type: agents:reviewer`.

## Brug den når

Noget er bygget, og der skal ryddes op **bagefter**. Ikke undervejs — en gennemgang af halvfærdig kode finder ting der forsvinder af sig selv.

Den er billig i forhold til hvad den finder. Der er sjældent grund til at spare på den.

## Giv den

- **Hvad der skal gennemgås.** Som standard ændringen på den aktuelle gren mod default-branch.
- Stien til opgaven, hvis arbejdet hører til en.

## Husk

Den har **ikke** `Edit`, og dens mandat er at foreslå, ikke at rette. Det er et mandat, ikke en lås. Dens forslag skal være konkrete nok til at kunne udføres uden at nogen skal gætte.

**Opdelingen i Oprydning og Adfærd er det vigtigste i returen.** Oprydning kan samles i én opgave og udføres blindt. Hvert adfærdsfund kræver at nogen tænker og kan blive sit eget nummer.

Stiller en opgaves `Færdig når` krav til hvad en tekst skal sige, afgør `reviewer` også dem. `tester` må ikke måle den slags — en kontrol der leder efter ord i en tekst måler formulering og ikke adfærd.

## Bagefter

**Hvert fund skal have en afgørelse.** Oprydningsfundene kan blive én opgave tilsammen; det er sjældent værd at give dem et nummer hver. Adfærdsfundene vurderes enkeltvis.

Kan et fund kun løses strukturelt, er det ikke en opgave — det er et interview.

Først når hvert punkt er afgjort, sætter du rapporten til `behandlet`.
