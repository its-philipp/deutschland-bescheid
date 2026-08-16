import { useState } from 'preact/hooks';
import { berechneFrist, tageBis } from '../lib/frist';
import { isoLang } from '../lib/format';

/**
 * Der Widerspruchsfrist-Rechner (queue task 5.3).
 *
 * Die Rechenregel liegt in `lib/frist.ts` und wird von
 * `npm run check:fristen` gegen fünf dokumentierte Grenzfälle geprüft. Diese
 * Komponente rechnet nichts selbst — sie fragt ein Datum ab und zeigt an, was
 * dabei herauskommt.
 *
 * **Drei Dinge muss die Anzeige sagen, sonst führt sie in die Irre:**
 *
 * 1. Die Vier-Tage-Regel des § 37 Abs. 2 SGB X ist eine **Fiktion**. Ist der
 *    Bescheid nachweislich später angekommen, zählt der tatsächliche Zugang —
 *    und im Zweifel muss die Behörde den Zugang beweisen, nicht der Bürger.
 * 2. **Gesetzliche Feiertage sind überwiegend Landesrecht.** Ein bundesweiter
 *    Rechner kann sie nicht raten. Verschoben wird deshalb nur über Samstag
 *    und Sonntag; fällt das Ergebnis auf einen Feiertag, verschiebt es sich
 *    noch weiter, und das steht dabei.
 * 3. Ist die Frist abgelaufen, ist der Fall **nicht** erledigt: Bei fehlender
 *    oder falscher Rechtsbehelfsbelehrung gilt ein Jahr (§ 66 Abs. 2 SGG),
 *    und daneben gibt es die Wiedereinsetzung (§ 67 SGG). Ein Rechner, der
 *    nur „zu spät" sagt, schickt jemanden nach Hause, der noch Rechte hat.
 *
 * Kein Datum wird gesendet oder gespeichert: Die Seite ist statisch, es gibt
 * keinen Endpunkt, der etwas entgegennähme.
 */

const heuteIso = () => new Date().toISOString().slice(0, 10);

export default function FristRechner() {
  const [datum, setDatum] = useState('');
  const [imAusland, setImAusland] = useState(false);
  const [belehrung, setBelehrung] = useState(false);

  const gueltig = /^\d{4}-\d{2}-\d{2}$/.test(datum);
  const ergebnis = gueltig
    ? berechneFrist({
        aufgabeZurPost: datum,
        imAusland,
        belehrungFehltOderFalsch: belehrung,
      })
    : null;
  const verbleibend = ergebnis ? tageBis(ergebnis.fristende) : 0;

  return (
    <div class="border border-rule bg-paper p-5 sm:p-7">
      <label class="block font-semibold text-ink" for="aufgabe">
        Wann wurde der Bescheid zur Post gegeben?
      </label>
      <p class="mt-1 text-[15px] text-ink-mute">
        Das Datum steht meist oben rechts auf dem Schreiben. Wenn dort nur ein
        Ausstellungsdatum steht, nehmen Sie dieses.
      </p>
      <input
        id="aufgabe"
        type="date"
        value={datum}
        max={heuteIso()}
        onInput={(e) => setDatum((e.currentTarget as HTMLInputElement).value)}
        class="mt-3 w-full max-w-xs border-[1.5px] border-ink bg-paper px-3 py-2.5 text-ink outline-none"
      />

      <fieldset class="mt-5">
        <legend class="text-[15px] font-semibold text-ink">Trifft eines davon zu?</legend>
        <label class="mt-2 flex items-start gap-2 text-[15px] text-ink">
          <input
            type="checkbox"
            checked={belehrung}
            onChange={(e) => setBelehrung((e.currentTarget as HTMLInputElement).checked)}
            class="mt-1"
          />
          <span>
            Der Bescheid enthält <strong>keine Rechtsbehelfsbelehrung</strong> oder sie ist
            falsch
            <span class="block text-[14px] text-ink-mute">
              Also der Abschnitt, der erklärt, wie und wo Sie Widerspruch einlegen können.
            </span>
          </span>
        </label>
        <label class="mt-3 flex items-start gap-2 text-[15px] text-ink">
          <input
            type="checkbox"
            checked={imAusland}
            onChange={(e) => setImAusland((e.currentTarget as HTMLInputElement).checked)}
            class="mt-1"
          />
          <span>Der Bescheid wurde im Ausland bekannt gegeben</span>
        </label>
      </fieldset>

      <div class="mt-6 border-t border-rule pt-5" role="status" aria-live="polite">
        {!ergebnis ? (
          <p class="text-[15px] text-ink-mute">
            Sobald Sie das Datum eintragen, rechnen wir die Frist aus — Schritt für Schritt und
            mit der Vorschrift zu jedem Schritt.
          </p>
        ) : (
          <>
            <p class="text-[15px] text-ink-mute">
              Ihr Widerspruch muss eingegangen sein bis
            </p>
            <p class="mt-1 font-display text-[clamp(1.75rem,6vw,2.75rem)] leading-tight font-semibold text-ink">
              {isoLang(ergebnis.fristende)}
            </p>
            <p class="mt-1 text-[15px] text-ink-soft">
              ein {ergebnis.fristendeWochentag === 'Sa' || ergebnis.fristendeWochentag === 'So'
                ? 'Wochenendtag'
                : 'Werktag'}
              {' '}({ergebnis.fristendeWochentag})
              {verbleibend >= 0
                ? ` — das sind noch ${verbleibend} Tage`
                : ` — das war vor ${Math.abs(verbleibend)} Tagen`}
            </p>

            <ol class="mt-5 flex flex-col divide-y divide-rule border-y border-rule text-[15px]">
              <li class="flex flex-wrap justify-between gap-x-4 py-2">
                <span class="text-ink">Bekanntgabe (4 Tage nach Aufgabe zur Post)</span>
                <span class="text-ink-mute">
                  {isoLang(ergebnis.bekanntgabe)} · § 37 Abs. 2 SGB X
                </span>
              </li>
              <li class="flex flex-wrap justify-between gap-x-4 py-2">
                <span class="text-ink">Fristbeginn am Folgetag</span>
                <span class="text-ink-mute">
                  {isoLang(ergebnis.fristbeginn)} · § 64 Abs. 1 SGG
                </span>
              </li>
              <li class="flex flex-wrap justify-between gap-x-4 py-2">
                <span class="text-ink">Fristlänge: {ergebnis.fristlaenge}</span>
                <span class="text-ink-mute">
                  {ergebnis.fristlaenge === 'ein Jahr' ? '§ 66 Abs. 2 SGG' : '§ 84 Abs. 1 SGG'}
                </span>
              </li>
              {ergebnis.aufWerktagVerschoben && (
                <li class="flex flex-wrap justify-between gap-x-4 py-2">
                  <span class="text-ink">Auf den nächsten Werktag verschoben</span>
                  <span class="text-ink-mute">§ 64 Abs. 3 SGG</span>
                </li>
              )}
            </ol>

            <div class="mt-5 border-l-4 border-marker bg-marker-tint px-4 py-3 text-[15px] text-ink">
              <p>
                <strong>Zwei Dinge, die dieser Rechner nicht wissen kann.</strong> Die vier Tage
                sind eine gesetzliche Annahme — kam der Bescheid nachweislich später, gilt der
                tatsächliche Zugang, und im Zweifel muss die Behörde den Zugang beweisen
                (§ 37 Abs. 2 Satz 3 SGB X). Und gesetzliche Feiertage sind überwiegend
                Landesrecht: Fällt das Fristende auf einen Feiertag in Ihrem Bundesland,
                verschiebt es sich noch einen Werktag weiter.
              </p>
            </div>

            {verbleibend < 0 && !belehrung && (
              <div class="mt-4 border-l-4 border-hinweis bg-hinweis-tint px-4 py-3 text-[15px] text-ink">
                <p>
                  <strong>Abgelaufen heißt nicht aussichtslos.</strong> Fehlt im Bescheid die
                  Rechtsbehelfsbelehrung oder ist sie falsch, beträgt die Frist ein Jahr
                  (§ 66 Abs. 2 SGG) — setzen Sie oben das Häkchen und rechnen Sie neu. Und wer
                  ohne eigenes Verschulden verhindert war, kann Wiedereinsetzung in den vorigen
                  Stand beantragen (§ 67 SGG).
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
