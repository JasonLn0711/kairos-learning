import assert from 'node:assert/strict';
import test from 'node:test';
import lesson from '../content/interactive/request-lifecycle.json' with { type: 'json' };
import { createInteractiveCatalog } from '../src/lib/interactive/catalog.ts';
import { explanationAt, sceneAt } from '../src/lib/interactive/model.ts';
import { validateInteractiveLesson } from '../src/lib/interactive/validate.ts';

const today = '2026-11-23';
const id = 'request-lifecycle';

test('one validated publication manifest drives the hub, search and sitemap', () => {
  const catalog = createInteractiveCatalog([lesson], today);
  assert.equal(catalog.lesson(id)?.steps.length, 10);
  assert.deepEqual(catalog.search.map(({ lang, href }) => [lang, href]), [
    ['zh', '/interactive/system-design/request-lifecycle/'],
    ['en', '/en/interactive/system-design/request-lifecycle/']
  ]);
  assert.deepEqual(catalog.paths, ['/interactive/', '/en/interactive/', ...catalog.search.map(entry => entry.href)]);
  assert.equal(catalog.summaries[0].stepCount, 10);

  for (const unpublished of [
    { ...lesson, status: 'draft' },
    { ...lesson, publishedOn: '2099-01-01', revisedOn: '2099-01-01' }
  ]) {
    const hidden = createInteractiveCatalog([unpublished], today);
    assert.equal(hidden.lesson(id), undefined);
    assert.deepEqual(hidden.summaries, []);
    assert.deepEqual(hidden.search, []);
    assert.deepEqual(hidden.paths, ['/interactive/', '/en/interactive/']);
  }
});

test('validation rejects missing text, malformed graph and executable markup fields', () => {
  validateInteractiveLesson(lesson);
  const brokenTranslation = structuredClone(lesson);
  brokenTranslation.steps[3].text.en.mechanism = '';
  assert.throws(() => validateInteractiveLesson(brokenTranslation), /mechanism/);
  const brokenRoute = structuredClone(lesson);
  brokenRoute.steps[0].scene.route.push('database');
  assert.throws(() => validateInteractiveLesson(brokenRoute), /follow edges/);
  const brokenFocus = structuredClone(lesson);
  brokenFocus.steps[0].scene.focus = 'unknown';
  assert.throws(() => validateInteractiveLesson(brokenFocus), /unknown node/);
  const missingNode = structuredClone(lesson);
  missingNode.edges[0].to = 'unknown';
  assert.throws(() => validateInteractiveLesson(missingNode), /unknown node/);
  const duplicate = structuredClone(lesson);
  duplicate.steps[1].id = duplicate.steps[0].id;
  assert.throws(() => validateInteractiveLesson(duplicate), /duplicate/);
  const wrongOrder = structuredClone(lesson);
  wrongOrder.steps[0].order = 2;
  assert.throws(() => validateInteractiveLesson(wrongOrder), /step order/);
  assert.throws(() => validateInteractiveLesson({ ...lesson, title: { ...lesson.title, en: '<svg />' } }), /plain text/);
  assert.throws(() => validateInteractiveLesson({ ...lesson, svg: '<svg />' }), /unsupported fields/);
});

test('cached DNS stays local and slow database reuses the query route with a changed pace', () => {
  validateInteractiveLesson(lesson);
  const dns = lesson.steps.find(step => step.id === 'dns')!;
  const database = lesson.steps.find(step => step.id === 'database')!;
  const defaults = { dnsCached: false, dbSlow: false };
  const cacheHit = { ...defaults, dnsCached: true };
  const slowDb = { ...defaults, dbSlow: true };
  assert.ok(sceneAt(dns, defaults).route.includes('dns'));
  assert.deepEqual(sceneAt(dns, cacheHit).route, ['browser']);
  assert.deepEqual(sceneAt(database, defaults).route, sceneAt(database, slowDb).route);
  assert.equal(sceneAt(database, slowDb).pace, 'slow');
  assert.deepEqual(sceneAt(dns, slowDb), dns.scene);
  assert.deepEqual(sceneAt(database, cacheHit), database.scene);
  for (const lang of ['zh', 'en'] as const) {
    assert.notEqual(explanationAt(dns, lang, cacheHit).observe, explanationAt(dns, lang, defaults).observe);
    assert.notEqual(explanationAt(database, lang, slowDb).observe, explanationAt(database, lang, defaults).observe);
  }
});
