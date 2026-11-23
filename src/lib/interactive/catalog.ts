import { isPublic, localized, type Locale, type SearchEntry } from '../model.ts';
import type { InteractiveLessonData, InteractiveSummary, Localized } from './model.ts';
import { validateInteractiveLesson } from './validate.ts';

const locales = ['zh', 'en'] as const;
export const interactiveHubPath = '/interactive/';
const lessonPath = (id: string, lang: Locale) => localized(`${interactiveHubPath}system-design/${id}/`, lang);
export const interactiveHubPaths = locales.map(lang => localized(interactiveHubPath, lang));

export function createInteractiveCatalog(input: unknown[], today: string) {
  const ids = new Set<string>();
  const summaries: InteractiveSummary[] = [];
  const lessons = new Map<string, InteractiveLessonData>();
  const search: SearchEntry[] = [];
  for (const lesson of input) {
    validateInteractiveLesson(lesson);
    if (ids.has(lesson.id)) throw new Error(`Duplicate interactive lesson ${lesson.id}`);
    ids.add(lesson.id);
    if (!isPublic(lesson, today)) continue;

    lessons.set(lesson.id, lesson);
    const href: Localized = { zh: lessonPath(lesson.id, 'zh'), en: lessonPath(lesson.id, 'en') };
    const { id, title, summary, objective, steps } = lesson;
    summaries.push({ id, title, summary, objective, href, stepCount: steps.length });
    for (const lang of locales) {
      const text = [objective[lang], ...steps.flatMap(step => [step.title[lang], ...Object.values(step.text[lang])])].join(' ');
      search.push({ id: `interactive-${id}`, lang, title: title[lang], summary: summary[lang], text,
        href: href[lang], label: lang === 'zh' ? '互動教材' : 'Interactive lesson' });
    }
  }
  return {
    summaries,
    lesson: (id: string) => lessons.get(id),
    search,
    paths: [...interactiveHubPaths, ...summaries.flatMap(summary => locales.map(lang => summary.href[lang]))]
  };
}
