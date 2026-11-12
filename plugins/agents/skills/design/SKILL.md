---
description: "Lægger den fælles designstandard for webløsninger ind i projektet: farver, skrift, afstande og fem komponenter som ren CSS, i lys og mørk tilstand, med kontrast efter WCAG 2.1 AA. Viser hvad den er, spørger ja eller nej, og kopierer tre filer til docs/design/. Kobler den ikke selv på appen."
disable-model-invocation: true
---

# design

Følg `AGENTS.md` i projektets rod. Findes den ikke, er projektet ikke sat op — sig `kør /agents:kickoff først` og stop.

Du lægger den fælles designstandard ind i projektet. Den ligger i denne skill-mappe:

| Fil i denne mappe | Kopieres til |
|---|---|
| `design.md` | `docs/design/design.md` |
| `assets/design.css` | `docs/design/design.css` |
| `assets/eksempel.html` | `docs/design/eksempel.html` |

Kan du ikke finde dem ad den vej, så søg efter `*/skills/design/design.md` under plugin-mappen. **Gæt ikke på indholdet, og skriv det ikke selv** — findes en af filerne ikke, siger du det og stopper.

Du **foreslår ikke af dig selv**. Bliver du kaldt, viser du hvad standarden er. Ellers tier du.

## Proces

### 1. Find ud af om den allerede er der

Kig i `docs/design/`. **Findes en af de tre filer allerede, overskriver du ingenting.** Sig hvilke der findes, og stop. Det gælder også hvis kopien er ældre end plugin'ets; en kopi bringes ikke ajour herfra.

Findes `CLAUDE.md` ikke i projektets rod, er projektet ikke sat helt op. Sig det, og stop, før du kopierer noget.

### 2. Vis hvad den er, og spørg

Sig det i få linjer, i almindeligt dansk:

- Fælles farver, skriftstørrelser, afstande, hjørner og fokusmarkering, og fem komponenter: knap, formularfelt, tabel, besked og topbjælke.
- Ren CSS uden JavaScript. Alt hedder `hjk-` noget, og den ændrer ikke et frameworks egne elementer.
- Lys og mørk tilstand efter maskinens indstilling. En side kan overstyre.
- Kontrasten lever op til WCAG 2.1 AA, og den er regnet efter.
- Tre filer lægges i `docs/design/`, med en eksempelside der kan åbnes direkte fra disken. Koden røres ikke.

Spørg **ja eller nej**.

Foreslå **ja** når projektet har en webflade — det afgør du ud fra projektets `CLAUDE.md` og `docs/projekt.md` hvis den findes, ikke ud fra et gæt. Har det ingen webflade, eller kan du ikke afgøre det, foreslår du nej og siger hvorfor.

Siges der nej, nævner du det ikke igen i denne tråd.

### 3. Læg den ind

Ved ja:

1. **Kopiér de tre filer uændrede** til `docs/design/` — med en filkopi, ikke ved at skrive dem igen. Opret mappen hvis den mangler. Er en destination dukket op siden trin 1, overskriver du ingenting: sig det og stop.
2. **Nævn standarden i projektets `CLAUDE.md`** under afsnittet `## Designstandard`. Findes afsnittet ikke, opretter du det. Findes det, lader du det stå. Afsnittet siger tre ting:

   ```markdown
   ## Designstandard

   Webfladen følger den fælles designstandard i `docs/design/`. Læs `docs/design/design.md`
   før der laves noget på webfladen, og åbn `docs/design/eksempel.html` for at se den.
   Ret aldrig i filerne i `docs/design/` — projektets egne regler står i appens eget stylesheet.
   ```

3. **Skriv ét emne på `docs/BOARD.md`** under `## Kommende`: at appen skal bruge designstandardens stylesheet, direkte eller kopieret ind ved build, uden at rette i det. Som de andre emner: én linje, uden filsti og uden nummer.

## Du må ikke

- Ændre kode. Du kopierer tre filer og skriver i `CLAUDE.md` og på `BOARD.md`. Intet andet.
- Koble standarden på appen. Hvordan stylesheetet når appen, afhænger af stakken — det er et emne, som `architect` interviewer frem til en opgave.
- Rette i de kopierede filer eller tilpasse dem til projektet. Afviger projektet, står det i appens eget stylesheet.
- Overskrive en fil der findes.

## Lukning

Emnet på `docs/BOARD.md` er et **emne**, ikke en opgave. Det får ikke nummer her.

```
LUKNING
Skrevet:      docs/design/design.md, docs/design/design.css, docs/design/eksempel.html, CLAUDE.md, docs/BOARD.md
Åbent:        appen bruger ikke standarden endnu — emne på Kommende
Næste:        /agents:architect — appen skal bruge designstandardens stylesheet
Uskrevet:     intet
```

Sig i samtalen at eksempelsiden kan åbnes direkte fra disken, så man kan se standarden i begge tilstande, før appen bruger den.
