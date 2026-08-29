// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import checkPlaceholders from './scripts/check-placeholders.mjs';
import checkUrls from './scripts/check-urls.mjs';
import checkSeo from './scripts/check-seo.mjs';

// Impressum und Datenschutz tragen `noindex` und gehören deshalb aus der
// Sitemap gefiltert — Google eine URL zum Crawlen anzubieten und ihr zugleich
// das Indexieren zu verbieten, ist ein Widerspruch, den man nicht ausliefert.
export default defineConfig({
  site: 'https://deutschland-bescheid.de',
  output: 'static',
  integrations: [
    checkSeo({ domain: 'deutschland-bescheid.de', jahrImTitel: true }),
    preact(),
    // Bricht den Build ab, wenn ein Deploy-Platzhalter es ins `dist/` geschafft
    // hat. Cloudflare Pages baut mit `npm run build`, ein roter Build ist also
    // ein Deploy, der nicht stattfindet.
    checkPlaceholders(),
    // Bricht den Build ab, wenn canonical, og:url, ein interner Link oder ein
    // Sitemap-Eintrag auf eine Adresse zeigt, die Pages weiterleitet — die
    // Ursache der Search-Console-Meldung „Page with redirect" vom 2026-08-23.
    checkUrls(),

/**
     * Impressum und Datenschutz sind seit 2026-08-28 indexierbar und in der
     * Sitemap. Die frühere Begründung — ein Rechtstext konkurriere um nichts und
     * verdünne nur die indexierte Fläche — war teuer: deutschland-vorlagen wurde
     * von AdSense mit „Low value content" abgelehnt, und der erste Befund der
     * Diagnose lautete, im Index stehe nirgends, wer die Seite betreibt. Googles
     * Mindestanforderungen nennen genau das. Der Fund war portfolioweit: alle
     * sechs Seiten trugen dieselbe Einstellung.
     */
    sitemap({
      filter: () => true,
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
