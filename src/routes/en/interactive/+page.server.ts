import {interactiveCatalog} from '#lib/server/interactive.ts';
export const load=()=>({lesson:interactiveCatalog.lesson('request-lifecycle')??null});
