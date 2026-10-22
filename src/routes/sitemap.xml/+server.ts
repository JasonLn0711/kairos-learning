import { routes } from '$lib/server/catalog';
import { SITE } from '$lib/model';
export const prerender = true;
export const GET = () => new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map(r => `<url><loc>${SITE}${r.path}</loc></url>`).join('')}</urlset>`, {headers:{'content-type':'application/xml'}});
