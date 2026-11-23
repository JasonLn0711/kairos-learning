import { aaseAtlasPaths } from '#lib/server/aase-interactive.ts';
import { interactiveCatalog } from '#lib/server/interactive.ts';
import { routes } from '#lib/server/catalog.ts';
import { SITE } from '#lib/model.ts';
export const prerender = true;
export const GET = () => new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${[...routes.map(route => route.path), ...interactiveCatalog.paths, ...aaseAtlasPaths].map(path => `<url><loc>${SITE}${path}</loc></url>`).join('')}</urlset>`, {headers:{'content-type':'application/xml'}});
