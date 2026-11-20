import type { Handle } from '@sveltejs/kit/hooks';
export const handle: Handle = async ({ event, resolve }) => resolve(event, {
  transformPageChunk: ({ html }) => html.replace('lang="zh-Hant"', event.url.pathname.startsWith('/en/') ? 'lang="en"' : 'lang="zh-Hant"')
});
