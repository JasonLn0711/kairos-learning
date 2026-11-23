import { interactiveCatalog, loadInteractiveLesson } from '#lib/server/interactive.ts';

const id = 'request-lifecycle';
export const prerender = Boolean(interactiveCatalog.lesson(id));
export const load = () => loadInteractiveLesson(id);
