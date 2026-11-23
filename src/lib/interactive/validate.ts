import { nodeKinds, signals, type InteractiveLessonData } from './model.ts';

const locales = ['zh', 'en'] as const;
const identifier = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
const datePattern = /^\d{4}-\d\d-\d\d$/;
type RecordValue = Record<string, unknown>;

function invalid(path: string, message: string): never {
  throw new Error(`Interactive lesson ${path}: ${message}`);
}

function record(value: unknown, path: string, required: string[], optional: string[] = []): RecordValue {
  if (!value || typeof value !== 'object' || Array.isArray(value)) invalid(path, 'expected an object');
  const item = value as RecordValue;
  if (required.some(key => !Object.hasOwn(item, key)) || Object.keys(item).some(key => !required.includes(key) && !optional.includes(key))) {
    invalid(path, 'missing or unsupported fields');
  }
  return item;
}

function list(value: unknown, path: string, min: number, max: number): unknown[] {
  if (!Array.isArray(value) || value.length < min || value.length > max) invalid(path, `expect ${min}–${max} items`);
  return value as unknown[];
}

function plain(value: unknown, path: string, max = 900): string {
  if (typeof value !== 'string' || !value.trim() || value.length > max || /[<>\x00-\x1F]/.test(value)) {
    invalid(path, 'expected bounded plain text');
  }
  return value;
}

function id(value: unknown, path: string): string {
  const key = plain(value, path, 64);
  if (!identifier.test(key)) invalid(path, 'invalid identifier');
  return key;
}

function localized(value: unknown, path: string, max?: number) {
  const labels = record(value, path, [...locales]);
  for (const lang of locales) plain(labels[lang], `${path}.${lang}`, max);
}

function pairedFields(value: unknown, path: string, fields: string[]) {
  const text = record(value, path, [...locales]);
  for (const lang of locales) {
    const translation = record(text[lang], `${path}.${lang}`, fields);
    for (const field of fields) plain(translation[field], `${path}.${lang}.${field}`);
  }
}

function date(value: unknown, path: string): string {
  const input = plain(value, path, 10);
  const parsed = new Date(input);
  if (!datePattern.test(input) || !Number.isFinite(parsed.valueOf()) || parsed.toISOString().slice(0, 10) !== input) {
    invalid(path, 'expected a valid ISO calendar date');
  }
  return input;
}

function unique(values: Set<string>, key: string, path: string) {
  if (values.has(key)) invalid(path, `duplicate ${key}`);
  values.add(key);
}

const connection = (a: string, b: string) => [a, b].sort().join(':');

export function validateInteractiveLesson(input: unknown): asserts input is InteractiveLessonData {
  const lesson = record(input, 'root', [
    'id', 'status', 'publishedOn', 'revisedOn', 'version', 'title', 'summary', 'objective',
    'assumptions', 'nodes', 'edges', 'steps', 'check', 'sources'
  ]);
  id(lesson.id, 'id');
  if (lesson.status !== 'draft' && lesson.status !== 'published') invalid('status', 'unsupported publication state');
  if (date(lesson.revisedOn, 'revisedOn') < date(lesson.publishedOn, 'publishedOn')) invalid('revisedOn', 'precedes publication');
  if (!/^[1-9]\d*\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)$/.test(plain(lesson.version, 'version', 24))) {
    invalid('version', 'expected semantic version');
  }
  localized(lesson.title, 'title', 100);
  localized(lesson.summary, 'summary', 400);
  localized(lesson.objective, 'objective', 500);
  list(lesson.assumptions, 'assumptions', 1, 8).forEach((item, i) => localized(item, `assumptions[${i}]`));

  const nodeIds = new Set<string>();
  const positions = new Set<string>();
  list(lesson.nodes, 'nodes', 2, 12).forEach((item, i) => {
    const path = `nodes[${i}]`;
    const node = record(item, path, ['id', 'kind', 'label', 'x', 'y']);
    unique(nodeIds, id(node.id, path), path);
    if (!nodeKinds.some(kind => kind === node.kind)) invalid(path, 'unknown node kind');
    for (const axis of ['x', 'y'] as const) {
      const coordinate = node[axis];
      if (typeof coordinate !== 'number' || !Number.isInteger(coordinate) || coordinate < 0 || coordinate > 8) {
        invalid(path, 'coordinate outside the bounded grid');
      }
    }
    unique(positions, `${node.x}:${node.y}`, path);
    localized(node.label, path, 36);
  });

  const edgeIds = new Set<string>();
  const connections = new Set<string>();
  const nodeRef = (value: unknown, path: string) => {
    const key = id(value, path);
    if (!nodeIds.has(key)) invalid(path, `unknown node ${key}`);
    return key;
  };

  list(lesson.edges, 'edges', 1, 24).forEach((item, i) => {
    const path = `edges[${i}]`;
    const edge = record(item, path, ['id', 'from', 'to']);
    unique(edgeIds, id(edge.id, path), path);
    const from = nodeRef(edge.from, path);
    const to = nodeRef(edge.to, path);
    if (from === to) invalid(path, 'self edge');
    unique(connections, connection(from, to), path);
  });

  function validateScene(value: unknown, path: string) {
    const scene = record(value, path, ['focus', 'route', 'label', 'signal'], ['pace']);
    const focus = nodeRef(scene.focus, path);
    const route = list(scene.route, path, 1, 12).map(node => nodeRef(node, path));
    if (!route.includes(focus)) invalid(path, 'focus must be on the active route');
    if (route.some((node, i) => i > 0 && !connections.has(connection(route[i - 1], node)))) invalid(path, 'route must follow edges');
    if (!signals.some(signal => signal === scene.signal)) invalid(path, 'unknown signal');
    if (scene.pace !== undefined && scene.pace !== 'slow') invalid(path, 'unknown pace');
    localized(scene.label, path, 70);
  }

  const stepIds = new Set<string>();
  const scenarios = new Set<string>();
  const steps = list(lesson.steps, 'steps', 1, 24);
  steps.forEach((item, i) => {
    const path = `steps[${i}]`;
    const step = record(item, path, ['id', 'order', 'title', 'text', 'scene'], ['variant']);
    unique(stepIds, id(step.id, path), path);
    if (step.order !== i + 1) invalid(path, 'step order must match array order');
    localized(step.title, path, 75);
    pairedFields(step.text, path, ['problem', 'mechanism', 'observe', 'boundary']);
    validateScene(step.scene, path);
    if (step.variant === undefined) return;
    const variant = record(step.variant, `${path}.variant`, ['when', 'scene', 'text']);
    if (!((step.id === 'dns' && variant.when === 'dns-cached') || (step.id === 'database' && variant.when === 'db-slow'))) {
      invalid(path, 'scenario must match its teaching step');
    }
    scenarios.add(String(variant.when));
    validateScene(variant.scene, `${path}.variant`);
    pairedFields(variant.text, `${path}.variant`, ['observe', 'boundary']);
  });
  if (lesson.id === 'request-lifecycle' && (steps.length !== 10 || scenarios.size !== 2)) {
    invalid('steps', 'request lifecycle requires ten steps and both scenario variations');
  }

  const check = record(lesson.check, 'check', ['question', 'options', 'answer', 'feedback']);
  localized(check.question, 'check.question');
  const options = list(check.options, 'check.options', 2, 5);
  options.forEach((option, i) => localized(option, `check.options[${i}]`));
  list(check.feedback, 'check.feedback', options.length, options.length).forEach((feedback, i) =>
    localized(feedback, `check.feedback[${i}]`));
  if (typeof check.answer !== 'number' || !Number.isInteger(check.answer) || check.answer < 0 || check.answer >= options.length) {
    invalid('check.answer', 'answer index out of bounds');
  }

  const sources = new Set<string>();
  list(lesson.sources, 'sources', 1, 20).forEach((item, i) => {
    const path = `sources[${i}]`;
    const source = record(item, path, ['id', 'title', 'url', 'checkedOn']);
    unique(sources, id(source.id, path), path);
    localized(source.title, path, 180);
    date(source.checkedOn, path);
    const href = plain(source.url, path, 512);
    let url: URL;
    try { url = new URL(href); } catch { invalid(path, 'invalid source URL'); }
    if (!/^https:\/\/[^\s]+$/.test(href) || url.protocol !== 'https:' || url.username || url.password) {
      invalid(path, 'sources must use public HTTPS URLs');
    }
  });
}
