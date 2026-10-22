import { json } from '@sveltejs/kit';
import { searchEntries } from '$lib/server/catalog';
export const prerender = true;
export const GET = () => json(searchEntries);
