import { error } from '@sveltejs/kit';
import inventory from '../../../content/interactive/aase-m02/manifest.json' with { type: 'json' };
import course from '../../../content/aase/course.json' with { type: 'json' };
import english from '../../../content/aase/course.en.json' with { type: 'json' };
import { aaseConceptPath } from '../aase.ts';
import { isPublic, localized, type Locale, type SearchEntry } from '../model.ts';
import { validateConcepts } from '../interactive/aase/validate.ts';

import source1 from '../../../content/aase/lessons/aase-m02-c01.json' with { type: 'json' };
import units1 from '../../../content/interactive/aase-m02/m02-01.json' with { type: 'json' };
import source2 from '../../../content/aase/lessons/aase-m02-c02.json' with { type: 'json' };
import units2 from '../../../content/interactive/aase-m02/m02-02.json' with { type: 'json' };
import source3 from '../../../content/aase/lessons/aase-m02-c03.json' with { type: 'json' };
import units3 from '../../../content/interactive/aase-m02/m02-03.json' with { type: 'json' };
import source4 from '../../../content/aase/lessons/aase-m02-c04.json' with { type: 'json' };
import units4 from '../../../content/interactive/aase-m02/m02-04.json' with { type: 'json' };
import source5 from '../../../content/aase/lessons/aase-m02-c05.json' with { type: 'json' };
import units5 from '../../../content/interactive/aase-m02/m02-05.json' with { type: 'json' };
import source6 from '../../../content/aase/lessons/aase-m02-c06.json' with { type: 'json' };
import units6 from '../../../content/interactive/aase-m02/m02-06.json' with { type: 'json' };
const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
const content = [units1, units2, units3, units4, units5, units6];
const canonical = [source1, source2, source3, source4, source5, source6];
const locales = ['zh', 'en'] as const;
const sourceProfiles = {
  zh: course.modules.find(module => module.id === 'm02')!.concepts,
  en: english.modules.find(module => module.id === 'm02')!.concepts
};

type Section = { id: string; blocks?: { id?: string }[] };
type Source = { id: string; status: 'draft' | 'published'; publishedOn: string; translations?: { en?: {status:'draft' | 'published';publishedOn:string} }; text: Record<Locale, { summary: string; objectives: string[]; sections: Section[] }> };

const root = '/interactive/aase/m02/';
const chapterPath = (id: string) => root + id + '/';
const conceptPath = (id: string, slug: string) => chapterPath(id) + slug + '/';

function anchors(sections: Section[]) {
  return new Set(sections.flatMap(section => [section.id, ...(section.blocks ?? []).flatMap(block => block.id ? [block.id] : [])]));
}

const chapters = inventory.flatMap((chapter, index) => {
  const source = canonical[index] as Source;
  if (!source || source.id !== chapter.sourceLessonId) throw new Error('AASE source mismatch: ' + chapter.id);
  const zh = anchors(source.text.zh.sections);
  const en = anchors(source.text.en.sections);
  const shared = new Set([...zh].filter(anchor => en.has(anchor)));
  const provisional = content[index];
  const units = validateConcepts(provisional, chapter.slugs, shared);
  const published = units.filter(unit => isPublic({ status: unit.status ?? 'published', publishedOn: unit.publishedOn ?? source.publishedOn }, today));
  // Preserve reciprocal locale identity and the source article publication boundary.
  if (!isPublic(source, today) || !source.translations?.en || !isPublic(source.translations.en, today) || !isPublic({ status: english.status === 'published' ? 'published' : 'draft', publishedOn: english.publishedOn }, today)) return [];
  return [{ ...chapter, source, published }];
});

export const aaseAtlas = (lang: Locale) => chapters.filter(chapter => chapter.published.length > 0).map(chapter => ({
  id: chapter.id,
  title: sourceProfiles[lang].find(profile => profile.id === chapter.sourceLessonId)!.title,
  objectives: chapter.source.text[lang].objectives,
  summary: chapter.source.text[lang].summary,
  href: localized(chapterPath(chapter.id), lang),
  sourceHref: aaseConceptPath('m02', chapter.sourceSlug, lang),
  concepts: chapter.published.map(({slug, title, objective}) => ({
    slug, title, objective, href: localized(conceptPath(chapter.id, slug), lang)
  }))
}));

export const aaseAtlasPaths = locales.flatMap(lang => [
  localized(root, lang),
  ...aaseAtlas(lang).flatMap(chapter => [chapter.href, ...chapter.concepts.map(concept => concept.href)])
]);

export const aaseChapterEntries = () => aaseAtlas('zh').map(({id}) => ({ chapter: id }));
export const aaseConceptEntries = () => aaseAtlas('zh').flatMap(({id, concepts}) => concepts.map(({slug}) => ({chapter:id, concept:slug})));

export function loadAaseChapter(chapter: string, lang: Locale) {
  const group = aaseAtlas(lang).find(item => item.id === chapter);
  if (!group) error(404, 'Interactive chapter not found');
  return group;
}

export function loadAaseConcept(chapter: string, slug: string, lang: Locale) {
  const group = chapters.find(item => item.id === chapter);
  const concept = group?.published.find(item => item.slug === slug);
  if (!group || !concept) error(404, 'Interactive concept not found');
  const summaries = aaseAtlas(lang).flatMap(item => item.concepts);
  const next = summaries[summaries.findIndex(item => item.slug === slug) + 1];
  return {
    chapter, concept, sourceHref: aaseConceptPath('m02', group.sourceSlug, lang),
    nextHref: next?.href, concepts: group.published.map(({slug, title}) => ({slug, title}))
  };
}

export const aaseInteractiveSearch: SearchEntry[] = locales.flatMap(lang => aaseAtlas(lang).flatMap(chapter =>
  chapter.concepts.map(concept => ({
    id: 'interactive-aase-' + concept.slug, lang, href: concept.href,
    title: concept.title[lang], summary: concept.objective[lang], text: concept.objective[lang],
    label: 'AASE ' + chapter.id.toUpperCase()
  }))
));
