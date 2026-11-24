import { aaseConceptEntries, loadAaseConcept } from '#lib/server/aase-interactive.ts';
export const prerender = aaseConceptEntries().length > 0;
export const entries = aaseConceptEntries;
export const load=({params}:{params:{chapter:string;concept:string}})=>{
  const {concept}=loadAaseConcept(params.chapter,params.concept,'en');
  return {target:'/en/interactive/aase/m02/'+params.chapter+'/',slug:concept.slug,count:concept.scenes.length,title:concept.title.en};
};
