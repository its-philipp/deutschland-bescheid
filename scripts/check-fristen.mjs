/**
 * Die Fristberechnung gegen ihre eigenen Regeln nachrechnen.
 *
 * Die Widerspruchsfrist ist das Produkt dieser Seite: Wer hier landet, will
 * wissen, bis wann er handeln muss. Ein um einen Tag falscher Rechner kostet
 * jemanden sein Widerspruchsrecht — und man sieht ihm nichts an.
 *
 * Der Prüfer implementiert die sieben Regeln aus `widerspruchsfrist.json`
 * **noch einmal**, aus der Beschreibung heraus, und rechnet damit die dort
 * hinterlegten Beispiele nach. Er ruft den Rechner der Seite nicht auf: Eine
 * zweite Umsetzung derselben Regel ist die einzige Prüfung, die einen
 * Denkfehler in der ersten überhaupt finden kann.
 *
 * Die Kette, jeweils mit ihrer Fundstelle im Datensatz:
 *   1. Bekanntgabe = Aufgabe zur Post + 4 Tage (§ 37 Abs. 2 Satz 1 SGB X)
 *   2. Der Fristlauf beginnt am Tag danach (§ 64 Abs. 1 SGG)
 *   3./4. Ein Monat, endend am zahlgleichen Tag des Folgemonats; fehlt dieser
 *      Tag, endet die Frist mit dem Monat (§ 64 Abs. 2 SGG)
 *   5. Sonnabend, Sonntag oder Feiertag schieben auf den nächsten Werktag
 *      (§ 64 Abs. 3 SGG)
 *
 * Zu den Feiertagen: berücksichtigt sind nur die **bundeseinheitlichen** Tage.
 * Das ist keine Nachlässigkeit, sondern dieselbe Grenze, die der Datensatz
 * selbst zieht — Feiertage sind überwiegend Landesrecht, und ein bundesweiter
 * Rechner darf sie nicht raten.
 *
 * Aufruf: npm run check:fristen
 */
import { readFileSync } from 'node:fs';

const daten = JSON.parse(readFileSync('src/data/sources/widerspruchsfrist.json', 'utf8'));
const iso = (d) => d.toISOString().slice(0, 10);
const WOCHENTAG = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

/** Bundeseinheitliche Feiertage. Ostersonntag 2026 ist der 5. April. */
const FEIERTAGE = new Set([
  '2026-01-01', '2026-04-03', '2026-04-06', '2026-05-01',
  '2026-05-14', '2026-05-25', '2026-10-03', '2026-12-25', '2026-12-26',
]);

function frist(aufgabeZurPost) {
  const post = new Date(`${aufgabeZurPost}T00:00:00Z`);

  const bekanntgabe = new Date(post);
  bekanntgabe.setUTCDate(bekanntgabe.getUTCDate() + 4);

  const beginn = new Date(bekanntgabe);
  beginn.setUTCDate(beginn.getUTCDate() + 1);

  const tag = bekanntgabe.getUTCDate();
  const ende = new Date(Date.UTC(bekanntgabe.getUTCFullYear(), bekanntgabe.getUTCMonth() + 1, 1));
  const letzterTagDesMonats = new Date(
    Date.UTC(ende.getUTCFullYear(), ende.getUTCMonth() + 1, 0),
  ).getUTCDate();
  ende.setUTCDate(Math.min(tag, letzterTagDesMonats));

  while (ende.getUTCDay() === 0 || ende.getUTCDay() === 6 || FEIERTAGE.has(iso(ende))) {
    ende.setUTCDate(ende.getUTCDate() + 1);
  }

  return {
    bekanntgabe_fiktion: iso(bekanntgabe),
    fristbeginn: iso(beginn),
    fristende: iso(ende),
    fristende_wochentag: WOCHENTAG[ende.getUTCDay()],
  };
}

const fehler = [];
let werte = 0;
for (const b of daten.rechenbeispiele) {
  const gerechnet = frist(b.aufgabe_zur_post);
  for (const [feld, wert] of Object.entries(gerechnet)) {
    if (b[feld] === undefined) continue;
    werte++;
    if (b[feld] !== wert) {
      fehler.push(`Aufgabe zur Post ${b.aufgabe_zur_post} · ${feld}: Datensatz ${b[feld]}, gerechnet ${wert}`);
    }
  }
}

console.log(`${daten.rechenbeispiele.length} Rechenbeispiele, ${werte} Werte nachgerechnet`);
if (fehler.length) {
  console.error(`\n${fehler.length} Abweichung(en):`);
  for (const f of fehler) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log('Bekanntgabe, Fristbeginn, Fristende und Wochentag stimmen mit den hinterlegten Beispielen überein.');
