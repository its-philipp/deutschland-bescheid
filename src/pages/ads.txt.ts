import type { APIRoute } from 'astro';
import { adsTxt } from '../lib/ads';

/**
 * `/ads.txt` als Endpunkt statt statischer Datei, damit er aus derselben
 * `ADSENSE_CLIENT`-Konstante entsteht wie Script-Tag und Datenschutztexte.
 * Solange keine Kennung gesetzt ist, ist die Datei leer — „keine
 * autorisierten Verkäufer" ist die ehrliche Auskunft.
 */
export const GET: APIRoute = () =>
  new Response(adsTxt(), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
