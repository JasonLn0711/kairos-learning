import {aaseChapterEntries,loadAaseChapter} from '#lib/server/aase-interactive.ts';
export const prerender=aaseChapterEntries().length>0;
export const entries=aaseChapterEntries;
export const load=({params}:{params:{chapter:string}})=>loadAaseChapter(params.chapter,'zh');
