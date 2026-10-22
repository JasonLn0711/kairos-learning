import { SITE } from '$lib/model';
export const prerender = true;
export const GET = () => new Response(`User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`, {headers:{'content-type':'text/plain'}});
