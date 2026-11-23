import type { Bilingual, Locale } from '../model.ts';

export type { Locale };
export type Localized = Bilingual;
export const nodeKinds = ['browser', 'dns', 'edge', 'app', 'database'] as const;
export const signals = ['local', 'request', 'response', 'setup', 'secure', 'data', 'recap'] as const;
export type SceneNode = { id: string; kind: typeof nodeKinds[number]; label: Localized; x: number; y: number };
export type SceneEdge = { id: string; from: string; to: string };
export type Scene = {
  focus: string;
  route: string[];
  label: Localized;
  signal: typeof signals[number];
  pace?: 'slow';
};
export type Explanation = { problem: string; mechanism: string; observe: string; boundary: string };
export type Scenario = { dnsCached: boolean; dbSlow: boolean };
export type LessonStep = {
  id: string;
  order: number;
  title: Localized;
  text: Bilingual<Explanation>;
  scene: Scene;
  variant?: {
    when: 'dns-cached' | 'db-slow';
    scene: Scene;
    text: Bilingual<Pick<Explanation, 'observe' | 'boundary'>>;
  };
};
export type InteractiveLessonData = {
  id: string;
  status: 'draft' | 'published';
  publishedOn: string;
  revisedOn: string;
  version: string;
  title: Localized;
  summary: Localized;
  objective: Localized;
  assumptions: Localized[];
  nodes: SceneNode[];
  edges: SceneEdge[];
  steps: LessonStep[];
  check: { question: Localized; options: Localized[]; answer: number; feedback: Localized[] };
  sources: { id: string; title: Localized; url: string; checkedOn: string }[];
};
export type InteractiveSummary = Pick<InteractiveLessonData, 'id' | 'title' | 'summary' | 'objective'> & {
  href: Localized;
  stepCount: number;
};

function selectedVariant(step: LessonStep, scenario: Scenario) {
  const variant = step.variant;
  if (variant?.when === 'dns-cached' && scenario.dnsCached) return variant;
  if (variant?.when === 'db-slow' && scenario.dbSlow) return variant;
}

export const sceneAt = (step: LessonStep, scenario: Scenario) => selectedVariant(step, scenario)?.scene ?? step.scene;
export const explanationAt = (step: LessonStep, lang: Locale, scenario: Scenario): Explanation =>
  ({ ...step.text[lang], ...selectedVariant(step, scenario)?.text[lang] });
