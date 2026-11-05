import {aaseDisplayId} from '../aase-labels.ts';
import {createAaseCatalog,aaseModulePath,type AaseCourseTranslation,type AaseLesson,type AaseSource} from '../aase.ts';
import aase from '../../../content/aase/course.json' with { type: 'json' };
import aaseEnglish from '../../../content/aase/course.en.json' with { type: 'json' };
import {readingText} from '../article-reading.ts';
import {diagramText} from '../perspective-diagrams.ts';
import {validatePerspectives, type Perspective} from '../perspectives.ts';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { isPublic, lessonPath, modulePath, localized, type Lesson, type Locale, type Module, type Source, type Term, type SearchEntry } from '../model.ts';
import { createConceptCatalog, type ConceptEntry, type ConceptTeaching } from '../concepts.ts';
const root = join(process.cwd(), 'content');
export const modules = JSON.parse(readFileSync(join(root, 'modules.json'), 'utf8')) as Module[];
export const sources = JSON.parse(readFileSync(join(root, 'sources.json'), 'utf8')) as Source[];
export const allLessons = readdirSync(join(root, 'lessons')).filter(f => f.endsWith('.json')).sort().map(f => JSON.parse(readFileSync(join(root, 'lessons', f), 'utf8')) as Lesson).sort((a,b) => a.order - b.order || a.id.localeCompare(b.id));
// Every route, quiz, search result and glossary backlink uses this one publication gate.
export const lessons = allLessons.filter(l => isPublic(l, new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())));
export const allTerms = JSON.parse(readFileSync(join(root, 'glossary.json'), 'utf8')) as Term[];
export const terms = allTerms.map(t => ({...t, lessons: t.lessons.filter(id => lessons.some(l => l.id === id))})).filter(t => t.lessons.length);
export const searchEntries: SearchEntry[] = lessons.flatMap(l => (['zh','en'] as Locale[]).map(lang => ({ id:l.id, lang, title:l.text[lang].title, summary:l.text[lang].summary, text:[...readingText(l.id,lang),...l.text[lang].objectives, ...l.text[lang].sections.flatMap(s => [s.heading,...s.paragraphs,s.code ?? '']), ...Object.values(l.text[lang].example), ...Object.values(l.text[lang].lab).flat(), ...l.questions.flatMap(q => [q.text[lang].prompt,...q.text[lang].options,...q.text[lang].rationales]), ...l.terms].join(' '), href:lessonPath(l,lang), label:l.course === 'ceh' ? `CEH ${l.module.toUpperCase()}` : l.course })));
export const concepts = JSON.parse(readFileSync(join(root, 'concepts.json'), 'utf8')) as ConceptEntry[];
if (concepts.some(c => !modules.some(m => m.id === c.module))) throw new Error('Concept registry references an unknown module');
export const allConceptTeachings = readdirSync(join(root,'concepts')).filter(f => f.endsWith('.json')).map(f => JSON.parse(readFileSync(join(root,'concepts',f),'utf8')) as ConceptTeaching);
export const conceptCatalog = createConceptCatalog(concepts, allConceptTeachings, new Intl.DateTimeFormat('en-CA', {timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date()));
searchEntries.push(...conceptCatalog.searchEntries);
const allPerspectives = readdirSync(join(root,'perspectives')).filter(f=>f.endsWith('.json')).map(f=>JSON.parse(readFileSync(join(root,'perspectives',f),'utf8'))) as Perspective[];
validatePerspectives(allPerspectives,{lesson:new Set(allLessons.map(l=>l.id)),concept:new Set(concepts.map(c=>c.id))});
export const perspectives = allPerspectives.filter(p=>isPublic(p,new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date()))).sort((a,b)=>b.publishedOn.localeCompare(a.publishedOn)||a.id.localeCompare(b.id));
searchEntries.push(...perspectives.flatMap(p=>(['zh','en'] as Locale[]).map(lang=>({id:p.id,lang,title:p.text[lang].title,summary:p.text[lang].summary,text:p.text[lang].sections.flatMap(s=>[s.heading,...s.paragraphs,...(s.list??[]),s.code??'',...(s.diagram?diagramText(s.diagram):[]),...(s.table?[...s.table.headers,...s.table.rows.flat()]:[])]).join(' '),href:localized(`/perspectives/${p.slug}/`,lang),label:lang==='zh'?'觀點':'Perspectives'}))));
const aaseSources=JSON.parse(readFileSync(join(root,'aase/sources.json'),'utf8')) as AaseSource[];
const allAaseLessons=readdirSync(join(root,'aase/lessons')).filter(f=>f.endsWith('.json')).map(f=>JSON.parse(readFileSync(join(root,'aase/lessons',f),'utf8')) as AaseLesson);
export const aaseCatalog=createAaseCatalog(aase,allAaseLessons,aaseSources,new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date()),aaseEnglish as AaseCourseTranslation);
searchEntries.push(...aaseCatalog.searchEntries,...(aaseCatalog.forLanguage('en')?.searchEntries??[]));
export type Kind = 'aase' | 'aase-concept' | 'aase-workshop' | 'perspectives' | 'perspective' | 'concept' | 'home' | 'ceh' | 'module' | 'lesson' | 'quiz' | 'lab' | 'course' | 'glossary' | 'search' | 'review' | 'standards';
export type Route = { path: string; kind: Kind; lang: Locale; lessonId?: string; moduleId?: string; courseId?: string; perspectiveId?: string; conceptId?: string };
export const routes: Route[] = (['zh','en'] as Locale[]).flatMap(lang => [
  {path:localized('/',lang),kind:'home',lang},
  {path:localized('/perspectives/',lang),kind:'perspectives',lang},
  ...perspectives.map(p=>({path:localized(`/perspectives/${p.slug}/`,lang),kind:'perspective' as Kind,lang,perspectiveId:p.id})),
  ...['/courses/ceh/','/courses/ceh/v13/'].map(path => ({path:localized(path,lang),kind:'ceh' as Kind,lang})),
  ...modules.map(m => ({path:modulePath(m.id,lang),kind:'module' as Kind,lang,moduleId:m.id})),
  ...modules.filter(m => lessons.some(l => l.module === m.id)).flatMap(m => [
    {path:modulePath(m.id,lang)+'quiz/',kind:'quiz' as Kind,lang,moduleId:m.id},
    {path:modulePath(m.id,lang)+'labs/',kind:'lab' as Kind,lang,moduleId:m.id}
  ]),
  ...conceptCatalog.list(lang).filter(c => c.href).map(c => ({path:c.href!,kind:'concept' as Kind,lang,moduleId:c.module,conceptId:c.id})),
  ...lessons.map(l => ({path:lessonPath(l,lang),kind:'lesson' as Kind,lang,lessonId:l.id})),
  ...['ai-ml','networking'].map(courseId=>({path:localized(`/courses/${courseId}/`,lang),kind:'course' as Kind,lang,courseId})),
  ...(['glossary','search','review','standards'] as const).map(kind => ({path:localized(`/${kind}/`,lang),kind,lang}))
]);
for(const lang of ['zh','en'] as const){
  const catalog=aaseCatalog.forLanguage(lang);if(!catalog)continue;
  routes.push({path:localized('/courses/aase/v1/',lang),kind:'aase',lang,courseId:'aase'},...catalog.modules.map(m=>({path:aaseModulePath(m.id,lang),kind:'aase' as Kind,lang,courseId:'aase',moduleId:m.id})));
  routes.push({path:localized('/courses/aase/v1/workshop/',lang),kind:'aase-workshop',lang,courseId:'aase'},...catalog.concepts.filter(c=>c.lesson).map(c=>({path:c.href,kind:'aase-concept' as Kind,lang,courseId:'aase',moduleId:c.module,conceptId:c.id})));
  searchEntries.push({id:'AASE',lang,title:catalog.title,summary:catalog.subtitle,text:catalog.modules.map(m=>m.title).join(' '),href:localized('/courses/aase/v1/',lang),label:lang==='zh'?'AASE · 課程規劃':'AASE · Course map'});
}
export function getPage(path: string) {
  const route = routes.find(r => r.path === path);
  if (!route) return null;
  const lang = route.lang;
  const selected = route.kind === 'concept' || route.kind.startsWith('aase') ? [] : route.lessonId ? lessons.filter(l => l.id === route.lessonId) : route.moduleId ? lessons.filter(l => l.module === route.moduleId) : route.courseId ? lessons.filter(l => l.course === route.courseId) : [];
  const module = route.kind.startsWith('aase') ? undefined : modules.find(m => m.id === route.moduleId || m.id === selected[0]?.module);
  const index = lessons.map(l => ({id:l.id, course:l.course, module:l.module, title:l.text[lang].title, summary:l.text[lang].summary, href:lessonPath(l,lang)}));
  const perspectiveLinks = perspectives.map(p=>({id:p.id,title:p.text[lang].title,summary:p.text[lang].summary,href:localized(`/perspectives/${p.slug}/`,lang),publishedOn:p.publishedOn}));
  const activePerspective=perspectives.find(p=>p.id===route.perspectiveId);
  const relatedLearning=(activePerspective?.related??[]).flatMap(r=>{if(r.kind==='lesson'){const l=index.find(l=>l.id===r.id);return l?[{title:l.title,href:l.href}]:[];}const c=conceptCatalog.list(lang).find(c=>c.id===r.id&&c.href);return c?[{title:c.title[lang],href:c.href!}]:[];});
  const relatedPerspectives=perspectiveLinks.filter(p=>perspectives.find(x=>x.id===p.id)!.related.some(r=>r.kind==='lesson'?r.id===route.lessonId:r.id===route.conceptId));
  const currentAase=aaseCatalog.forLanguage(lang);
  const aaseConcept=currentAase?.concepts.find(c=>c.id===route.conceptId);
  const aaseAt=currentAase?.concepts.findIndex(c=>c.id===route.conceptId)??-1;
  const aaseNavigation=(route.kind==='aase-concept'?(['previous','next'] as const).flatMap((side,i)=>{const c=currentAase?.concepts[aaseAt+(i===0?-1:1)];return c?[{side,displayId:aaseDisplayId(c.id),title:c.title,href:c.lesson?c.href:aaseModulePath(c.module,lang)+'#'+c.slug,pending:!c.lesson}]:[]}):[]);
  return { aaseHomeHref:currentAase?localized('/courses/aase/v1/',lang):'/courses/aase/v1/',aaseCourse:route.kind==='aase'||route.kind==='aase-workshop'?{title:currentAase!.title,subtitle:currentAase!.subtitle,modules:currentAase!.modules}:null,aaseTitle:currentAase?.title??aase.title,aaseCounterpart:route.kind.startsWith('aase')?routes.find(r=>r.path===(lang==='zh'?'/en'+route.path:route.path.replace(/^\/en/,'')))?.path??null:null,aaseModules:route.kind.startsWith('aase')?currentAase!.modules.map(m=>({id:m.id,title:m.title})):[],aaseLinks:route.kind==='search'?(currentAase?.searchEntries??[]).map(({title,href})=>({title,href})):[],aaseConcept:route.kind==='aase-concept'?aaseConcept:null,aaseConcepts:(route.kind==='aase'?currentAase!.concepts:[]).map(({lesson,...c})=>({...c,available:Boolean(lesson)})),aaseSources:aaseSources.filter(s=>aaseConcept?.lesson?.sourceIds.includes(s.id)),aaseNavigation,route, perspectiveLinks, relatedLearning, relatedPerspectives, perspectives:route.kind==='perspectives'?perspectives:[], perspective:perspectives.find(p=>p.id===route.perspectiveId), module, selected, index, modules, conceptTeaching: route.conceptId ? conceptCatalog.get(route.conceptId,lang)?.teaching ?? null : null, conceptNavigation: route.conceptId ? conceptCatalog.get(route.conceptId,lang)?.navigation ?? null : null, concepts: conceptCatalog.list(lang), sources: sources.filter(s => selected.some(l => l.sourceIds.includes(s.id))), terms: ['glossary','lesson'].includes(route.kind) ? terms : [], questions: route.kind === 'review' ? lessons.flatMap(l => l.questions) : [] };
}
export type Page = NonNullable<ReturnType<typeof getPage>>;
