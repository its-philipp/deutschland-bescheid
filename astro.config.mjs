// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Impressum und Datenschutz tragen `noindex` und gehören deshalb aus der
// Sitemap gefiltert — Google eine URL zum Crawlen anzubieten und ihr zugleich
// das Indexieren zu verbieten, ist ein Widerspruch, den man nicht ausliefert.
export default defineConfig({
  site: 'https://{{DOMAIN}}',
  output: 'static',
  integrations: [
    preact(),
    sitemap({
      filter: (page) => !page.includes('/impressum/') && !page.includes('/datenschutz/'),
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
