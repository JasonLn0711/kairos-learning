export type Locale = 'zh' | 'en';
export type Bilingual<T = string> = Record<Locale, T>;
export type Source = { id: string; title: string; url: string; checkedOn: string };
export type Section = { id: string; heading: string; paragraphs: string[]; code?: string; sourceIds: string[] };
export type QuestionText = { prompt: string; options: string[]; rationales: string[] };
export type Question = { id: string; revision: number; answer: number; concept: string; text: Bilingual<QuestionText> };
export type LessonText = {
  title: string; summary: string; objectives: string[]; sections: Section[];
  example: { title: string; scenario: string; reasoning: string; conclusion: string; code?: string };
  lab: { title: string; environment: string; steps: string[]; expected: string; check: string; cleanup: string; code?: string; download?: string };
};
export type Lesson = {
  id: string; order: number; course: 'ceh' | 'ai-ml' | 'networking'; module: string; slug: string;
  revision: number; status: 'draft' | 'published'; publishedOn: string; reviewedOn: string; revisedOn?: string; contentVersion?: string;
  sourceIds: string[]; prerequisites: string[]; related: string[]; terms: string[];
  text: Bilingual<LessonText>; questions: Question[];
};
export type Module = { id: string; title: Bilingual; focus: Bilingual };
export type Term = { id: string; term: Bilingual; definition: Bilingual; lessons: string[] };
export const SITE = 'https://learn.cs-kairos.com';
export const MAIN = 'https://cs-kairos.com';
export const localized = (path: string, lang: Locale) => lang === 'en' ? `/en${path}` : path;
export function lessonPath(l: Pick<Lesson, 'course' | 'module' | 'slug'>, lang: Locale) {
  const path = l.course === 'ceh' ? `/courses/ceh/v13/${l.module}/${l.slug}/` : `/courses/${l.course}/${l.slug}/`;
  return localized(path, lang);
}
export function modulePath(module: string, lang: Locale) { return localized(`/courses/ceh/v13/${module}/`, lang); }
export function isPublic(lesson: Pick<Lesson, 'status' | 'publishedOn'>, today: string) {
  return lesson.status === 'published' && /^\d{4}-\d{2}-\d{2}$/.test(lesson.publishedOn) && Number.isFinite(Date.parse(lesson.publishedOn)) && new Date(lesson.publishedOn).toISOString().slice(0,10) === lesson.publishedOn && lesson.publishedOn <= today;
}
export type SearchEntry = { id: string; lang: Locale; title: string; summary: string; text: string; href: string; label: string };
function searchTerms(query: string) {
  return query.normalize('NFKC').trim().toLocaleLowerCase().split(/\s+/).filter(Boolean).slice(0, 12);
}
function searchableText(entry: SearchEntry) {
  return `${entry.title} ${entry.summary} ${entry.text} ${entry.label}`.normalize('NFKC').toLocaleLowerCase();
}
export function search(entries: SearchEntry[], query: string, lang: Locale) {
  const terms = searchTerms(query);
  if (!terms.length) return [];
  return entries.filter(entry => {
    if (entry.lang !== lang) return false;
    const text = searchableText(entry);
    return terms.every(term => text.includes(term));
  });
}
export function prepareSearch(entries: SearchEntry[]) {
  const prepared = entries.map(entry => ({ entry, text: searchableText(entry) }));
  return (query: string, lang: Locale) => {
    const terms = searchTerms(query);
    if (!terms.length) return [];
    return prepared.filter(({ entry, text }) => entry.lang === lang && terms.every(term => text.includes(term))).map(({ entry }) => entry);
  };
}
