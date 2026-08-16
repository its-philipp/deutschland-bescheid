/**
 * Rechnet die dokumentierten Grenzfälle gegen die Fristenlogik.
 *
 * Die fünf Beispiele in `widerspruchsfrist.json` sind nicht dekorativ: Sie
 * decken genau die Fälle ab, an denen ein naiv gebauter Rechner danebenliegt —
 * Monatsende ohne entsprechenden Tag, Fristende am Wochenende, Jahreswechsel.
 * Läuft dieser Test durch, ist die Vier-Tage-Regel korrekt angewandt und die
 * Monatsarithmetik nicht durch `setMonth` verdorben.
 *
 * Geprüft wird **die Datei, die die Seite benutzt**. Ein erster Anlauf hatte
 * den Rechenteil per Regex aus dem TypeScript herausgeschnitten und in einer
 * `new Function` ausgeführt — damit prüft man eine Kopie und nicht den Code,
 * der ausgeliefert wird.
 *
 * Run: npm run check:fristen
 */
import { readFileSync } from 'node:fs';
import { berechneFrist } from '../src/lib/frist';

interface Beispiel {
  aufgabe_zur_post: string;
  bekanntgabe_fiktion: string;
  fristbeginn: string;
  fristende: string;
  fristende_wochentag: string;
}

const daten = JSON.parse(
  readFileSync(new URL('../src/data/sources/widerspruchsfrist.json', import.meta.url), 'utf8'),
) as { rechenbeispiele: Beispiel[] };

let fehler = 0;

for (const b of daten.rechenbeispiele) {
  const r = berechneFrist({ aufgabeZurPost: b.aufgabe_zur_post });
  const abweichungen: string[] = [];
  if (r.bekanntgabe !== b.bekanntgabe_fiktion)
    abweichungen.push(`Bekanntgabe ${r.bekanntgabe} statt ${b.bekanntgabe_fiktion}`);
  if (r.fristbeginn !== b.fristbeginn)
    abweichungen.push(`Fristbeginn ${r.fristbeginn} statt ${b.fristbeginn}`);
  if (r.fristende !== b.fristende)
    abweichungen.push(`Fristende ${r.fristende} statt ${b.fristende}`);
  if (r.fristendeWochentag !== b.fristende_wochentag)
    abweichungen.push(`Wochentag ${r.fristendeWochentag} statt ${b.fristende_wochentag}`);

  if (abweichungen.length) {
    fehler++;
    console.error(`✗ Aufgabe zur Post ${b.aufgabe_zur_post}`);
    abweichungen.forEach((a) => console.error(`    ${a}`));
  } else {
    console.log(`✓ ${b.aufgabe_zur_post} → Fristende ${b.fristende} (${b.fristende_wochentag})`);
  }
}

if (fehler) {
  console.error(`\n${fehler} Beispiel(e) weichen ab.`);
  process.exit(1);
}
console.log(`\nAlle ${daten.rechenbeispiele.length} Grenzfälle stimmen.`);
