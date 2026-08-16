/**
 * Die Widerspruchsfrist nach dem SGG — reine Rechenlogik, ohne Anzeige.
 *
 * Belegt in `src/data/sources/widerspruchsfrist.json`, dort mit Fundstelle je
 * Schritt und fünf durchgerechneten Grenzfällen. `scripts/check-fristen.mjs`
 * rechnet diese Beispiele bei jedem Lauf gegen diese Funktion; weicht eines
 * ab, scheitert die Prüfung.
 *
 * **Der Fehler, den fast jeder Rechner macht:** § 37 Abs. 2 Satz 1 SGB X
 * stellt auf den **vierten** Tag nach Aufgabe zur Post ab, nicht auf den
 * dritten. Die Drei-Tages-Regel ist der frühere Wortlaut. Wer damit rechnet,
 * nennt ein Fristende, das einen Tag zu früh liegt — und schickt jemanden im
 * Zweifel einen Tag zu spät zur Behörde.
 *
 * **Korrektur vom 2026-08-16:** Hier stand, die Drei-Tages-Regel sei „die
 * allgemeine Verwaltungsverfahrensregel (§ 41 VwVfG)". Das stimmt nicht mehr.
 * § 41 Abs. 2 Satz 1 VwVfG stellt heute wortgleich auf den **vierten** Tag ab
 * — nachgelesen am Volltext für die Erhebung zu Wohngeld und BAföG. Die
 * Fehlannahme war folgenreich: Sie hätte nahegelegt, für Wohngeld- und
 * BAföG-Bescheide, die vor das Verwaltungsgericht führen, einen zweiten
 * Rechner mit drei Tagen zu bauen.
 *
 * **Diese Funktion gilt für alle vier Bescheidtypen dieser Seite.** Der Weg
 * über die VwGO (Wohngeld, BAföG) führt durch andere Vorschriften — § 70
 * Abs. 1 VwGO für den Monat, § 57 Abs. 2 VwGO i. V. m. § 222 ZPO und
 * §§ 187 Abs. 1, 188 Abs. 2 und 3 BGB für die Berechnung, § 222 Abs. 2 ZPO und
 * § 193 BGB für die Verschiebung auf den nächsten Werktag —, ergibt aber Tag
 * für Tag dasselbe Ergebnis wie das SGG. Was sich unterscheidet, sind die
 * Fundstellen und die Frage, ob überhaupt ein Widerspruch statthaft ist
 * (§ 68 Abs. 1 Satz 2 VwGO); beides tragen die Erklärseiten, nicht der Rechner.
 *
 * Bewusst ohne `Date`-Arithmetik über Zeitzonen: gerechnet wird auf UTC-Mitternacht,
 * weil ein Datum hier ein Kalendertag ist und keine Zeitangabe. Ein
 * Sommerzeitwechsel darf eine Frist nicht um einen Tag verschieben.
 */

export interface FristEingabe {
  /** Tag der Aufgabe zur Post, wie im Bescheid angegeben (ISO). */
  aufgabeZurPost: string;
  /** Bekanntgabe im Ausland → drei Monate statt einem (§ 84 Abs. 1 SGG). */
  imAusland?: boolean;
  /**
   * Fehlende oder unrichtige Rechtsbehelfsbelehrung → ein Jahr
   * (§ 66 Abs. 2 SGG). Der häufigste Rettungsanker, wenn die Monatsfrist
   * schon abgelaufen scheint.
   */
  belehrungFehltOderFalsch?: boolean;
}

export interface FristErgebnis {
  /** Fingierte Bekanntgabe: Aufgabe zur Post + 4 Tage. */
  bekanntgabe: string;
  /** Erster Tag des Fristlaufs — der Tag nach der Bekanntgabe. */
  fristbeginn: string;
  /** Letzter Tag, an dem der Widerspruch eingehen muss. */
  fristende: string;
  /** Kurzform des Wochentags, z. B. „Mo". */
  fristendeWochentag: string;
  /** Wurde nach § 64 Abs. 3 SGG auf den nächsten Werktag geschoben? */
  aufWerktagVerschoben: boolean;
  /** Die angewandte Fristlänge, für die Anzeige. */
  fristlaenge: 'ein Monat' | 'drei Monate' | 'ein Jahr';
}

const TAG = 86_400_000;
const WOCHENTAGE = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'] as const;

function ausIso(iso: string): Date {
  const [j, m, t] = iso.split('-').map(Number);
  return new Date(Date.UTC(j, m - 1, t));
}

function zuIso(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/**
 * Monatsfrist nach § 64 Abs. 2 SGG: Sie endet an dem Tag des letzten Monats,
 * der **nach seiner Zahl** dem Tag der Bekanntgabe entspricht. Fehlt dem
 * letzten Monat dieser Tag, endet die Frist mit dem Monat.
 *
 * Das ist der Grund, warum hier nicht einfach `setMonth` steht: Bei
 * Bekanntgabe am 31. Januar liefert `setMonth` den 3. März, richtig ist der
 * 28. Februar.
 */
function plusMonate(d: Date, monate: number): Date {
  const jahr = d.getUTCFullYear();
  const monat = d.getUTCMonth() + monate;
  const tag = d.getUTCDate();
  const letzterTagImZielmonat = new Date(Date.UTC(jahr, monat + 1, 0)).getUTCDate();
  return new Date(Date.UTC(jahr, monat, Math.min(tag, letzterTagImZielmonat)));
}

/**
 * Verschiebung nach § 64 Abs. 3 SGG auf den nächsten Werktag.
 *
 * **Nur Samstag und Sonntag.** Gesetzliche Feiertage sind überwiegend
 * Landesrecht — ein bundesweiter Rechner kann nicht wissen, welches Land
 * zuständig ist, und ein geratener Feiertag verschiebt eine Frist in die
 * falsche Richtung. Die Anzeige muss darauf hinweisen; diese Funktion tut
 * ausdrücklich nur, was sie sicher weiß.
 */
function aufWerktag(d: Date): { datum: Date; verschoben: boolean } {
  let datum = d;
  let verschoben = false;
  while (datum.getUTCDay() === 0 || datum.getUTCDay() === 6) {
    datum = new Date(datum.getTime() + TAG);
    verschoben = true;
  }
  return { datum, verschoben };
}

export function berechneFrist(eingabe: FristEingabe): FristErgebnis {
  const post = ausIso(eingabe.aufgabeZurPost);

  // Schritt 1 — § 37 Abs. 2 Satz 1 SGB X: der VIERTE Tag, nicht der dritte.
  const bekanntgabe = new Date(post.getTime() + 4 * TAG);

  // Schritt 2 — § 64 Abs. 1 SGG: der Lauf beginnt am Folgetag.
  const fristbeginn = new Date(bekanntgabe.getTime() + TAG);

  // Schritt 3/4 — Länge nach § 84 Abs. 1 SGG bzw. § 66 Abs. 2 SGG,
  // Monatsende nach § 64 Abs. 2 SGG. Gerechnet wird ab der Bekanntgabe, nicht
  // ab dem Fristbeginn: § 64 Abs. 2 knüpft an den Tag des Ereignisses an.
  const fristlaenge: FristErgebnis['fristlaenge'] = eingabe.belehrungFehltOderFalsch
    ? 'ein Jahr'
    : eingabe.imAusland
      ? 'drei Monate'
      : 'ein Monat';
  const monate = fristlaenge === 'ein Jahr' ? 12 : fristlaenge === 'drei Monate' ? 3 : 1;
  const roh = plusMonate(bekanntgabe, monate);

  // Schritt 5 — § 64 Abs. 3 SGG.
  const { datum: fristende, verschoben } = aufWerktag(roh);

  return {
    bekanntgabe: zuIso(bekanntgabe),
    fristbeginn: zuIso(fristbeginn),
    fristende: zuIso(fristende),
    fristendeWochentag: WOCHENTAGE[fristende.getUTCDay()],
    aufWerktagVerschoben: verschoben,
    fristlaenge,
  };
}

/** Verbleibende Tage bis zum Fristende, bezogen auf einen Stichtag. */
export function tageBis(fristende: string, heute: Date = new Date()): number {
  const ende = ausIso(fristende).getTime();
  const jetzt = Date.UTC(heute.getFullYear(), heute.getMonth(), heute.getDate());
  return Math.round((ende - jetzt) / TAG);
}
