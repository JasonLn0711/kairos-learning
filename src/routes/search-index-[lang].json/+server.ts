import { error, json } from '@sveltejs/kit';
import { searchEntries } from '#lib/server/catalog.ts';
import type { EntryGenerator, RequestHandler } from './$types';

export const prerender = true;
export const entries: EntryGenerator = () => [{ lang: 'zh' }, { lang: 'en' }];

export const GET: RequestHandler = ({ params }) => {
  const { lang } = params;
  if (lang !== 'zh' && lang !== 'en') error(404, 'Unknown search language');
  return json(searchEntries.filter(entry => entry.lang === lang));
};
