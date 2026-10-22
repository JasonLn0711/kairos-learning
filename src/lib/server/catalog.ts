import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { isPublic, lessonPath, modulePath, localized, type Lesson, type Locale, type Module, type Source, type Term, type SearchEntry } from '../model.ts';
const root = join(process.cwd(), 'content');
export const modules = JSON.parse(readFileSync(join(root, 'modules.json'), 'utf8')) as Module[];
export const sources = JSON.parse(readFileSync(join(root, 'sources.json'), 'utf8')) as Source[];
export const allLessons = readdirSync(join(root, 'lessons')).filter(f => f.endsWith('.json')).sort().map(f => JSON.parse(readFileSync(join(root, 'lessons', f), 'utf8')) as Lesson).sort((a,b) => a.order - b.order || a.id.localeCompare(b.id));
// Every route, quiz, search result and glossary backlink uses this one publication gate.
export const lessons = allLessons.filter(l => isPublic(l, new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())));
export const allTerms = JSON.parse(readFileSync(join(root, 'glossary.json'), 'utf8')) as Term[];
export const terms = allTerms.map(t => ({...t, lessons: t.lessons.filter(id => lessons.some(l => l.id === id))})).filter(t => t.lessons.length);
export const searchEntries: SearchEntry[] = lessons.flatMap(l => (['zh','en'] as Locale[]).map(lang => ({ id:l.id, lang, title:l.text[lang].title, summary:l.text[lang].summary, text:[...l.text[lang].objectives, ...l.text[lang].sections.flatMap(s => [s.heading,...s.paragraphs,s.code ?? '']), ...Object.values(l.text[lang].example), ...Object.values(l.text[lang].lab).flat(), ...l.questions.flatMap(q => [q.text[lang].prompt,...q.text[lang].options,...q.text[lang].rationales]), ...l.terms].join(' '), href:lessonPath(l,lang), label:l.course === 'ceh' ? `CEH ${l.module.toUpperCase()}` : l.course })));
export type Kind = 'home' | 'ceh' | 'module' | 'lesson' | 'quiz' | 'lab' | 'course' | 'glossary' | 'search' | 'review' | 'standards';
export type Route = { path: string; kind: Kind; lang: Locale; lessonId?: string; moduleId?: string; courseId?: string };
export const routes: Route[] = (['zh','en'] as Locale[]).flatMap(lang => [
  {path:localized('/',lang),kind:'home',lang},
  ...['/courses/ceh/','/courses/ceh/v13/'].map(path => ({path:localized(path,lang),kind:'ceh' as Kind,lang})),
  ...modules.filter(m => lessons.some(l => l.module === m.id)).flatMap(m => [
    {path:modulePath(m.id,lang),kind:'module' as Kind,lang,moduleId:m.id},
    {path:modulePath(m.id,lang)+'quiz/',kind:'quiz' as Kind,lang,moduleId:m.id},
    {path:modulePath(m.id,lang)+'labs/',kind:'lab' as Kind,lang,moduleId:m.id}
  ]),
  ...lessons.map(l => ({path:lessonPath(l,lang),kind:'lesson' as Kind,lang,lessonId:l.id})),
  ...['ai-ml','networking'].map(courseId=>({path:localized(`/courses/${courseId}/`,lang),kind:'course' as Kind,lang,courseId})),
  ...(['glossary','search','review','standards'] as const).map(kind => ({path:localized(`/${kind}/`,lang),kind,lang}))
]);
export function getPage(path: string) {
  const route = routes.find(r => r.path === path);
  if (!route) return null;
  const lang = route.lang;
  const selected = route.lessonId ? lessons.filter(l => l.id === route.lessonId) : route.moduleId ? lessons.filter(l => l.module === route.moduleId) : route.courseId ? lessons.filter(l => l.course === route.courseId) : [];
  const module = modules.find(m => m.id === route.moduleId || m.id === selected[0]?.module);
  const index = lessons.map(l => ({id:l.id, course:l.course, module:l.module, title:l.text[lang].title, summary:l.text[lang].summary, href:lessonPath(l,lang)}));
  return { route, module, selected, index, modules, sources: sources.filter(s => selected.some(l => l.sourceIds.includes(s.id))), terms: ['glossary','lesson'].includes(route.kind) ? terms : [], questions: route.kind === 'review' ? lessons.flatMap(l => l.questions) : [] };
}
export type Page = NonNullable<ReturnType<typeof getPage>>;
