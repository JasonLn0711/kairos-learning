import type { Localized } from '../model.ts';

export const sceneKinds = [
  'isometric-topology', 'process-flow', 'token-stream', 'vector-inspector', 'attention-matrix',
  'numeric-budget', 'document-retrieval', 'state-machine', 'trust-boundary',
  'timeline-trace', 'comparison', 'evidence-check'
] as const;
export const policyDemos = ['governed-policy', 'sandbox-policy', 'scope-policy', 'retry-policy', 'required-field'] as const;
export const demoKinds = ['softmax', 'budget', 'gates', 'workflow', ...policyDemos] as const;
export type PolicyDemo = typeof policyDemos[number];
export const visuals = ['support-network', 'causal-mask'] as const;

export type Card = { label: Localized; value: Localized };
export type SceneChoice = { label: Localized; result: Localized; cards: Card[] };
export type TeachingScene = {
  id: string;
  kind: typeof sceneKinds[number];
  sourceAnchors: string[];
  title: Localized;
  problem: Localized;
  mechanism: Localized;
  observe: Localized;
  boundary: Localized;
  cards: Card[];
  choices?: SceneChoice[];
  demo?: typeof demoKinds[number];
  visual?: typeof visuals[number];
};
export type Concept = {
  slug: string;
  status?: 'draft' | 'published';
  publishedOn?: string;
  title: Localized;
  objective: Localized;
  scenes: TeachingScene[];
  check: {
    question: Localized;
    options: Localized[];
    answer: number;
    feedback: Localized[];
  };
};
