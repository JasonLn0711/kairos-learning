import { error } from '@sveltejs/kit';
import requestLifecycle from '../../../content/interactive/request-lifecycle.json' with { type: 'json' };
import { createInteractiveCatalog } from '../interactive/catalog.ts';

const today = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit'
}).format(new Date());

export const interactiveCatalog = createInteractiveCatalog([requestLifecycle], today);

export function loadInteractiveLesson(id: string) {
  const lesson = interactiveCatalog.lesson(id);
  if (!lesson) error(404, 'This interactive lesson was not found.');
  return { lesson };
}
