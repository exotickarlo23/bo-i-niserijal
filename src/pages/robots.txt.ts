import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const mapa = new URL('/sitemap-index.xml', site ?? 'http://localhost:4321').href;
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${mapa}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
