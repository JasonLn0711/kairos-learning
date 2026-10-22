// Practice data stays on this browser; answer revisions invalidate obsolete records.
import type { Question } from './model.ts';
export const STORAGE_KEY = 'kairos.practice.v1';
export type Attempt = { revision: number; choice: number; confidence: 'low' | 'medium' | 'high'; correct: boolean; attempts: number; updatedAt: string };
export type Progress = { version: 1; answers: Record<string, Attempt> };
export const emptyProgress = (): Progress => ({ version: 1, answers: {} });
export function readProgress(raw: string | null): Progress {
  if (!raw) return emptyProgress();
  try {
    const p = JSON.parse(raw);
    if (p?.version !== 1 || typeof p.answers !== 'object' || p.answers === null || Array.isArray(p.answers)) return emptyProgress();
    const answers: Record<string, Attempt> = {};
    for (const [id, item] of Object.entries(p.answers).slice(0, 500)) {
      const a = item as Attempt;
      if (/^[a-z0-9-]+$/.test(id) && a && Number.isInteger(a.revision) && a.revision > 0 && Number.isInteger(a.choice) && a.choice >= 0 && a.choice <= 3 && ['low','medium','high'].includes(a.confidence) && typeof a.correct === 'boolean' && Number.isInteger(a.attempts) && a.attempts > 0 && typeof a.updatedAt === 'string' && Number.isFinite(Date.parse(a.updatedAt))) answers[id] = a;
    }
    return { version: 1, answers };
  } catch { return emptyProgress(); }
}
export function recordAnswer(p: Progress, q: Question, choice: number, confidence: Attempt['confidence'], now: string): Progress {
  if (!Number.isInteger(choice) || choice < 0 || choice >= q.text.en.options.length || !['low','medium','high'].includes(confidence)) throw new Error('Choose an option and confidence.');
  const prior = p.answers[q.id];
  return { version: 1, answers: { ...p.answers, [q.id]: { revision:q.revision, choice, confidence, correct:choice === q.answer, attempts: prior?.revision === q.revision ? prior.attempts + 1 : 1, updatedAt:now } } };
}
export function wrongQuestions(p: Progress, questions: Question[]) {
  // Recompute correctness from the current answer key; never trust imported correctness.
  return questions.filter(q => { const a = p.answers[q.id]; return a?.revision === q.revision && a.choice !== q.answer; });
}
