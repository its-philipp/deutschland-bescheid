/**
 * Werbung — eine Konstante steuert alles.
 *
 * `ADSENSE_CLIENT` treibt den Script-Tag, `/ads.txt` und die Abschnitte der
 * Datenschutzerklärung. Solange sie leer ist, erreicht **kein**
 * Anzeigenskript die Seite — und nur deshalb ist „setzt keine Cookies"
 * nachprüfbar statt versprochen.
 *
 * **EWR-Auslieferung braucht eine zertifizierte CMP** (root CLAUDE.md);
 * Googles eigene liegt in der AdSense-Oberfläche unter „Datenschutz und
 * Mitteilungen". Ein selbstgebauter Cookie-Banner ist keine Lösung.
 */
export const ADSENSE_CLIENT = '';

export const adsEnabled = ADSENSE_CLIENT !== '';

/**
 * Auto-Ads bleiben aus. Google setzt sie sonst zwischen das Datumsfeld und
 * das Fristende — also mitten in die einzige Stelle, an der diese Seite eine
 * Antwort gibt.
 */
export const AUTO_ADS = false;

/**
 * Jede Anzeige trägt eine sichtbare Kennzeichnung. Diese Seite erklärt
 * Behördenpost; eine unmarkierte Anzeige darin wäre leichter mit einem
 * amtlichen Hinweis zu verwechseln als anderswo (Trennungsgebot, § 6 DDG).
 */
export const AD_LABEL = 'Anzeige';

export function adsenseScriptUrl(): string {
  return `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
}

export function adsTxt(): string {
  if (!adsEnabled) return '';
  return `google.com, ${ADSENSE_CLIENT}, DIRECT, f08c47fec0942fa0\n`;
}
