import { aaseConceptEntries, loadAaseConcept } from '#lib/server/aase-interactive.ts';
export const prerender = aaseConceptEntries().length > 0;
export const entries = aaseConceptEntries;
export const load = ({ params }: { params: {chapter: string; concept: string} }) => loadAaseConcept(params.chapter, params.concept, 'zh');
