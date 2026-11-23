import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { validateConcepts } from '../src/lib/interactive/aase/validate.ts';

const content = new URL('../content/', import.meta.url);
const read = (path: string) => JSON.parse(readFileSync(new URL(path, content), 'utf8'));
const chapters: {id:string;sourceLessonId:string;sourceSlug:string;slugs:string[]}[] = read('interactive/aase-m02/manifest.json');

test('all 40 declared concepts match canonical bilingual anchors and cover canonical sections and named nested blocks', () => {
  const all = chapters.flatMap(chapter => chapter.slugs);
  assert.equal(chapters.length, 6);
  assert.equal(all.length, 40);
  assert.equal(new Set(all).size, 40);
  for (const [index, chapter] of chapters.entries()) {
    const source = read('aase/lessons/aase-m02-c0' + (index + 1) + '.json');
    assert.equal(source.id, chapter.sourceLessonId);
    const anchors = (lang: 'zh' | 'en') => new Set<string>(source.text[lang].sections.flatMap((section: {id:string;blocks?:{id?:string}[]}) =>
      [section.id, ...(section.blocks ?? []).flatMap(block => block.id ? [block.id] : [])]));
    const zh = anchors('zh');
    assert.deepEqual(zh, anchors('en'));
    const lessons = validateConcepts(read('interactive/aase-m02/' + chapter.id + '.json'), chapter.slugs, zh);
    const represented = new Set(lessons.flatMap(concept => concept.scenes.flatMap(scene => scene.sourceAnchors)));
    for (const anchor of zh) assert.ok(represented.has(anchor), chapter.id + '#' + anchor);
  }
});

test('the validator rejects missing scenes, invalid anchors and authored markup', () => {
  const [concept] = read('interactive/aase-m02/m02-01.json');
  const validate = (input: unknown) => validateConcepts([input], [concept.slug], new Set(concept.scenes.flatMap((scene: { sourceAnchors: string[] }) => scene.sourceAnchors)));
  assert.equal(validate(concept).length, 1);
  assert.throws(() => validate({ ...concept, scenes: concept.scenes.slice(0, 2) }), /scenes/);
  assert.throws(() => validate({ ...concept, title: { zh: '<script>', en: 'Tokenization' } }), /title/);
  const [first, ...rest] = concept.scenes;
  assert.throws(() => validate({ ...concept, scenes: [{ ...first, sourceAnchors: ['missing'] }, ...rest] }), /sourceAnchors/);
});
