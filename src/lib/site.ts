// Site-weite Konstanten. `SITE_URL` und `site` in astro.config.mjs müssen
// übereinstimmen: die Sitemap liest es von dort, canonical und OG von hier.
export const SITE_URL = 'https://deutschland-bescheid.de';

/**
 * Wortmarke. „Deutschland Bescheid" folgt der vorgesehenen Domain
 * deutschland-bescheid.de und ist bewusst nicht „Bescheid-Checker": Es wird
 * nichts geprüft und nichts hochgeladen — die Seite erklärt, was in einem
 * Bescheid steht, und rechnet die Frist aus.
 */
export const SITE_NAME = 'Deutschland Bescheid';

/**
 * Impressum/Datenschutz-Identität — Platzhalter bis zum Deploy. Sie stehen
 * hier und nicht in den Seiten, weil eine doppelte geschweifte Klammer in
 * Astro-Markup ein Parse-Fehler ist und weil eine Definition verhindert, dass
 * Impressum und Datenschutzerklärung verschiedene Personen nennen.
 *
 * Niemals durch plausibel aussehende Werte ersetzen — ein falsches Impressum
 * ist ein schlimmerer Mangel als ein offensichtlich fehlendes.
 */
export const CONTACT_EMAIL = 'kontakt@deutschland-bescheid.de';
export const IMPRESSUM_NAME = 'Philipp Trinh';
export const IMPRESSUM_ADDRESS = 'Döscherstraße 3, 22083 Hamburg';
export const IMPRESSUM_HOSTER = 'Cloudflare (Cloudflare, Inc., 101 Townsend Street, San Francisco, CA 94107, USA)';

/**
 * Öffentlicher Spiegel des Quellcodes dieser Seite.
 *
 * Der Name klingt nach einem Dienst, der den Bescheid liest. Er tut es nicht:
 * kein Upload, keine Texterkennung, keine Inferenz, kein Backend. Das ist eine
 * Aussage über etwas, das man nicht sehen kann — und deshalb verlinkt die Seite
 * ihren Quellcode, statt um Vertrauen zu bitten.
 */
export const GITHUB_REPO = 'https://github.com/its-philipp/deutschland-bescheid';

export const CURRENT_YEAR = 2026;

/** Die Schwesterseite mit den Widerspruchs-Vorlagen. */
export const VORLAGEN_URL = 'https://deutschland-vorlagen.de';

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path}`;
}
