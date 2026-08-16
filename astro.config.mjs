// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import checkPlaceholders from './scripts/check-placeholders.mjs';

// Impressum und Datenschutz tragen `noindex` und gehören deshalb aus der
// Sitemap gefiltert — Google eine URL zum Crawlen anzubieten und ihr zugleich
// das Indexieren zu verbieten, ist ein Widerspruch, den man nicht ausliefert.
export default defineConfig({
  site: 'https://deutschland-bescheid.de',
  output: 'static',
  integrations: [
    preact(),
    // Bricht den Build ab, wenn ein Deploy-Platzhalter es ins `dist/` geschafft
    // hat. Cloudflare Pages baut mit `npm run build`, ein roter Build ist also
    // ein Deploy, der nicht stattfindet.
    checkPlaceholders(),

    sitemap({
      filter: (page) => !page.includes('/impressum/') && !page.includes('/datenschutz/'),
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
