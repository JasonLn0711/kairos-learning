export { attentionDemo } from '../../attention-demo.ts';
export { contextBudget, contextBudgetLimit, contextBudgetParts } from '../../context-budget.ts';

export function subjectLimit(day: 'weekday' | 'weekend', subjects: number, fixture: 'm02-04' | 'm02-06' = 'm02-04') {
  if (!Number.isInteger(subjects) || subjects < 1 || subjects > 6) throw new RangeError('Choose one to six subjects');
  const limit = fixture === 'm02-04' && day === 'weekend' ? 3 : 2;
  return { limit, accepted: subjects <= limit };
}

export type GateInput = {
  schema: boolean;
  authorized: boolean;
  toolSucceeded: boolean;
  verified: boolean;
};
type GateState = 'passed' | 'failed' | 'skipped';

export function evaluateGates(input: GateInput) {
  const schema: GateState = input.schema ? 'passed' : 'failed';
  const authorization: GateState = !input.schema ? 'skipped' : input.authorized ? 'passed' : 'failed';
  const executed = authorization === 'passed';
  const execution: GateState = !executed ? 'skipped' : input.toolSucceeded ? 'passed' : 'failed';
  const verification: GateState = execution !== 'passed' ? 'skipped' : input.verified ? 'passed' : 'failed';
  return { stages: [schema, authorization, execution, verification], executed, accepted: verification === 'passed' };
}

type Decision = { executed: boolean; reason: 'approved' | 'scope' | 'review' | 'budget' | 'read-only' | 'network' | 'deadline' };

export function governAction(action: 'test' | 'release', input: { inScope: boolean; reviewed: boolean; budget: number; withinTime: boolean }): Decision {
  if (!input.inScope) return { executed: false, reason: 'scope' };
  if (!Number.isInteger(input.budget) || input.budget <= 0) return { executed: false, reason: 'budget' };
  if (!input.withinTime) return { executed: false, reason: 'deadline' };
  if (action === 'release' && !input.reviewed) return { executed: false, reason: 'review' };
  return { executed: true, reason: 'approved' };
}

export function sandboxAction(action: 'read' | 'write' | 'network', input: { inside: boolean; writable: boolean; outbound: boolean }): Decision {
  if (action === 'network') return input.outbound ? { executed: true, reason: 'approved' } : { executed: false, reason: 'network' };
  if (!input.inside) return { executed: false, reason: 'scope' };
  if (action === 'write' && !input.writable) return { executed: false, reason: 'read-only' };
  return { executed: true, reason: 'approved' };
}

export function authorizeScope(resource: 'summary' | 'notes', _documentClaimsPermission: boolean): Decision {
  // The document is data. The host authorizes only the fictional public summary.
  return resource === 'summary' ? { executed: true, reason: 'approved' } : { executed: false, reason: 'scope' };
}

export type RetryOutcome = 'confirmed-success' | 'confirmed-no-effect' | 'unknown';
export function retryEffects(outcome: RetryOutcome, effectRecorded: boolean, serviceDeduplicates: boolean, retry: boolean) {
  const before = outcome === 'confirmed-success' || (outcome === 'unknown' && effectRecorded) ? 1 : 0;
  const retryPerformed = outcome !== 'confirmed-success' && retry;
  const after = before + Number(retryPerformed && !(before && serviceDeduplicates));
  return { before, after, retryPerformed };
}

export function missingApplicationFields(applicationId: string, applicantCode: string, documentType: string) {
  return ([
    ['applicationId', applicationId], ['applicantCode', applicantCode], ['documentType', documentType]
  ] as const).filter(([, value]) => !value.trim()).map(([key]) => key);
}
