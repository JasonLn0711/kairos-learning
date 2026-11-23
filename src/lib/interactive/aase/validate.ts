import { demoKinds, sceneKinds, visuals, type Concept } from './model.ts';

const identifier = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
const date = /^\d{4}-\d\d-\d\d$/;
const permittedDemos = {
  softmax: ['softmax-weighted-sum', 'attention-qkv'],
  budget: ['context-budget'],
  gates: ['four-gates'],
  workflow: ['deterministic-workflow', 'partial-success-verification'],
  'governed-policy': ['governed-autonomy'],
  'sandbox-policy': ['sandbox-boundary'],
  'scope-policy': ['prompt-injection-boundary'],
  'retry-policy': ['timeout-retry-idempotency'],
  'required-field': ['verification-boundary']
};

export function validateConcepts(value: unknown, slugs: readonly string[], anchors: ReadonlySet<string>): Concept[] {
  const fail = (at: string): never => { throw new TypeError('Invalid interactive concept at ' + at); };
  function object(input: unknown, required: string[], optional: string[], at: string): Record<string, unknown> {
    if (!input || typeof input !== 'object' || Array.isArray(input)) fail(at);
    const record = input as Record<string, unknown>;
    if (required.some(key => !Object.hasOwn(record, key)) ||
        Object.keys(record).some(key => !required.includes(key) && !optional.includes(key))) fail(at);
    return record;
  }
  function list(input: unknown, min: number, max: number, at: string): unknown[] {
    if (!Array.isArray(input) || input.length < min || input.length > max) return fail(at);
    return input;
  }
  function localized(input: unknown, limit: number, at: string) {
    const pair = object(input, ['zh', 'en'], [], at);
    for (const text of Object.values(pair)) {
      if (typeof text !== 'string' || !text.trim() || text.length > limit || /[<>\u0000-\u0008]/.test(text)) fail(at);
    }
  }
  function cards(input: unknown, at: string) {
    for (const item of list(input, 1, 8, at)) {
      const card = object(item, ['label', 'value'], [], at);
      localized(card.label, 100, at);
      localized(card.value, 260, at);
    }
  }

  const seen = new Set<unknown>();
  for (const item of list(value, slugs.length, slugs.length, 'manifest')) {
    const concept = object(item, ['slug', 'title', 'objective', 'scenes', 'check'], ['status', 'publishedOn'], 'concept');
    const slug = concept.slug as string;
    if (typeof slug !== 'string' || !identifier.test(slug) || !slugs.includes(slug) || seen.has(slug)) fail('slug');
    seen.add(slug);
    if (concept.status !== undefined && concept.status !== 'draft' && concept.status !== 'published') fail(slug + '.status');
    if (concept.publishedOn !== undefined) {
      const day = concept.publishedOn;
      if (typeof day !== 'string' || !date.test(day) || !Number.isFinite(Date.parse(day)) ||
          new Date(day).toISOString().slice(0, 10) !== day) fail(slug + '.publishedOn');
    }
    localized(concept.title, 100, slug + '.title');
    localized(concept.objective, 330, slug + '.objective');
    const scenes = list(concept.scenes, 3, 6, slug + '.scenes');
    scenes.forEach((input, index) => {
      const at = slug + '.' + (index + 1);
      const scene = object(input, ['id', 'kind', 'sourceAnchors', 'title', 'problem', 'mechanism', 'observe', 'boundary', 'cards'], ['choices', 'demo', 'visual'], at);
      if (scene.id !== String(index + 1).padStart(2, '0') || !sceneKinds.some(kind => kind === scene.kind)) fail(at);
      const sources = list(scene.sourceAnchors, 1, 12, at + '.sourceAnchors');
      if (new Set(sources).size !== sources.length || sources.some(anchor => typeof anchor !== 'string' || !anchors.has(anchor))) fail(at + '.sourceAnchors');
      for (const field of ['title', 'problem', 'mechanism', 'observe', 'boundary']) {
        localized(scene[field], field === 'title' ? 100 : 900, at + '.' + field);
      }
      cards(scene.cards, at + '.cards');
      if (scene.visual !== undefined) {
        const visual = visuals.find(kind => kind === scene.visual);
        const count = (scene.cards as unknown[]).length;
        const support = visual === 'support-network' && scene.kind === 'comparison' && count === 7 && slug === 'llm-vs-harness';
        const mask = visual === 'causal-mask' && scene.kind === 'attention-matrix' && count === 3 && slug === 'attention-qkv';
        if ((!support && !mask) || scene.choices !== undefined || scene.demo !== undefined) fail(at + '.visual');
      }
      if (scene.demo !== undefined) {
        const demo = demoKinds.find(kind => scene.demo === kind);
        if (!demo || !permittedDemos[demo].includes(slug) || scene.choices !== undefined) fail(at + '.demo');
      }
      if (scene.choices !== undefined) {
        for (const option of list(scene.choices, 2, 6, at + '.choices')) {
          const choice = object(option, ['label', 'result', 'cards'], [], at + '.choice');
          localized(choice.label, 100, at + '.choice.label');
          localized(choice.result, 500, at + '.choice.result');
          cards(choice.cards, at + '.choice.cards');
        }
      }
    });
    if (!scenes.some(input => {
      const scene = input as Record<string, unknown>;
      return scene.choices || scene.demo;
    })) fail(slug + '.interaction');
    const check = object(concept.check, ['question', 'options', 'answer', 'feedback'], [], slug + '.check');
    localized(check.question, 330, slug + '.check.question');
    const options = list(check.options, 2, 5, slug + '.check.options');
    const answers = list(check.feedback, options.length, options.length, slug + '.check.feedback');
    for (const text of [...options, ...answers]) localized(text, 500, slug + '.check');
    if (!Number.isInteger(check.answer) || (check.answer as number) < 0 || (check.answer as number) >= options.length) fail(slug + '.check.answer');
  }
  return value as Concept[];
}
