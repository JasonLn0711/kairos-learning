import { aaseAtlas } from '#lib/server/aase-interactive.ts';
import { interactiveCatalog } from '#lib/server/interactive.ts';

export const load = () => ({ lessons: interactiveCatalog.summaries, chapters: aaseAtlas('zh').map(({id,title,href})=>({id,title,href})) });
