import { aaseAtlas } from '#lib/server/aase-interactive.ts';
export const load = () => ({ groups: aaseAtlas('zh') });
