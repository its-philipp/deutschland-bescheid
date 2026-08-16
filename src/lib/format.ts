/**
 * Datumsausgabe per Zeichenkettenoperation, nicht über `new Date()`.
 *
 * Ein ISO-Datum als UTC gelesen und in einer westlichen Zeitzone formatiert
 * kommt einen Tag zu früh heraus. Bei einer Widerspruchsfrist ist ein Tag
 * nicht kosmetisch — er entscheidet darüber, ob ein Schreiben rechtzeitig war.
 * (Portfolio-Lehre, MEMORY.md 2026-07-12.)
 */
export function isoToGerman(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  return m ? `${m[3]}.${m[2]}.${m[1]}` : iso;
}

/** Ausgeschriebenes Datum mit Wochentag — für das Fristende, das man sich merkt. */
export function isoLang(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  const MONATE = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
  ];
  return `${Number(m[3])}. ${MONATE[Number(m[2]) - 1]} ${m[1]}`;
}

export function euro(n: number): string {
  return n.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
}
