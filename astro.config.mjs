// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { stranica } from './src/config.ts';

/**
 * Javna adresa stranice (za sitemap, Open Graph i schema.org):
 * 1. stranica.adresa iz src/config.ts, ako je upisana
 * 2. varijabla okruženja SITE_URL
 * 3. na Vercelu automatski: glavna (produkcijska) domena projekta
 */
const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const site =
  stranica.adresa ||
  process.env.SITE_URL ||
  (vercel ? `https://${vercel}` : 'http://localhost:4321');

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
  integrations: [
    sitemap({
      filter: (stranicaUrl) => !stranicaUrl.includes('/404'),
    }),
  ],
});
