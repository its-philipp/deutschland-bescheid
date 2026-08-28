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

/*
 * Hier stand bis zum 2026-08-28 `VORLAGEN_URL` — ein Verweis auf
 * deutschland-vorlagen.de, im Kommentar ausdrücklich „die Schwesterseite", und
 * auf `/ueber-uns/` stand der Satz „Die Schwesterseite mit den Musterschreiben
 * ist Deutschlandvorlagen" direkt neben dem Namen des Betreibers.
 *
 * Das widerspricht der Owner-Entscheidung vom 2026-08-03 (Root-CLAUDE.md):
 * Besucher sollen nicht erkennen, dass diese Seiten einem gehören, und keine
 * verlinkt eine andere als Schwesterseite.
 *
 * Die Konstante ist ersatzlos entfallen — und zwar ersatzlos mit Absicht: Den
 * Link zu behalten und nur die Offenlegung zu streichen, wäre unbenannte
 * Eigenwerbung und damit schlechter als der offene Hinweis. Wo vorher auf ein
 * Musterschreiben verwiesen wurde, steht jetzt, was ein Widerspruch enthalten
 * muss — das ist ohnehin die Antwort, wegen der jemand hier ist.
 */

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path}`;
}
