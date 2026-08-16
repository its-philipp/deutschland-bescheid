# Deutschland Bescheid

Quellcode von deutschland-bescheid.de — die Seite erklärt in normalem Deutsch,
was in einem Behördenbescheid steht, und rechnet aus, bis wann ein Widerspruch
möglich ist.

## Warum der Code offen liegt

Der Name klingt nach einem Dienst, der Ihren Bescheid liest. **Das tut die
Seite nicht.** Es gibt kein Upload-Feld, keine Texterkennung, keine KI im
Hintergrund und keinen Server, der irgendetwas von Ihnen zu sehen bekäme. Das
ist eine Aussage über etwas, das man nicht sehen kann — deshalb liegt der Code
hier.

Nachprüfbar:

- **Kein Backend.** Statischer Export ([Astro](https://astro.build),
  `output: 'static'`). Der Fristenrechner ist eine Insel im Browser; es gibt
  keinen Endpunkt, an den etwas gehen könnte.
- **Keine Datenbank, kein Formular-Endpunkt, kein Analytics-Skript.** Schriften
  liegen im eigenen Bundle statt bei einem CDN.
- **Die Fristenlogik ist der eine Teil, der still falsch sein könnte** — also
  wird sie geprüft. `src/lib/frist.ts` rechnet, `scripts/check-fristen.ts`
  rechnet die dokumentierten Grenzfälle aus `src/data/sources/` dagegen:
  Monatsende ohne entsprechenden Tag, Fristende am Wochenende, Jahreswechsel.

Ein Beispiel dafür, warum das nötig ist, steht im Kopf von `src/lib/frist.ts`:
§ 37 Abs. 2 SGB X stellt auf den **vierten** Tag nach Aufgabe zur Post ab, nicht
auf den dritten. Die Drei-Tages-Regel ist der frühere Wortlaut. Wer damit
rechnet, nennt ein Fristende, das einen Tag zu früh liegt.

## Was der Code nicht ist

Keine Rechtsberatung. Die Seite gibt Orientierung anhand der zitierten
Vorschriften; ob ein Widerspruch statthaft und begründet ist, entscheidet sich
im Einzelfall.

## Fehler gefunden?

Eine falsche Fundstelle, eine geänderte Vorschrift, eine Frist, die anders
läuft: bitte melden — formlos an kontakt@deutschland-bescheid.de.

## Lokal bauen

```bash
npm install
npm run check          # astro check
npm run check:fristen  # Grenzfälle gegen die Fristenlogik
npm run build
```

## Lizenz

MIT (siehe `LICENSE`). Die zitierten Rechtsvorschriften unterliegen ihren
eigenen Bedingungen; Normtexte stammen von
[gesetze-im-internet.de](https://www.gesetze-im-internet.de).
