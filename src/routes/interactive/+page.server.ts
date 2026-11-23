import { interactiveCatalog } from '#lib/server/interactive.ts';

export const load = () => ({ lessons: interactiveCatalog.summaries });
