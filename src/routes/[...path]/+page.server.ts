import { error } from '@sveltejs/kit';
import { getPage, routes } from '$lib/server/catalog';
export const entries = () => routes.filter(r => r.path !== '/').map(r => ({path:r.path.slice(1,-1)}));
export const load = ({ params }: { params: { path: string } }) => {
  const page = getPage('/' + params.path.split('/').filter(Boolean).join('/') + '/');
  if (!page) error(404,'This learning page was not found.');
  return page;
};
