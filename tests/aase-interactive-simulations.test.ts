import assert from 'node:assert/strict';
import { test } from 'node:test';
import { attentionDemo, contextBudget, evaluateGates, subjectLimit, authorizeScope, governAction, sandboxAction, retryEffects, missingApplicationFields } from '../src/lib/interactive/aase/simulations.ts';

test('softmax and context calculations reuse canonical bounded arithmetic', () => {
  const answer = attentionDemo(1, 0);
  assert.ok(Math.abs(answer.weights[0] - 0.7310585786) < 1e-9);
  assert.ok(Math.abs(answer.value - 3.0757656855) < 1e-9);
  assert.equal(attentionDemo(0, 0).value, 4);
  assert.equal(attentionDemo(-4, 4).weights.reduce((sum, weight) => sum + weight, 0), 1);
  assert.equal(contextBudget(500).remaining, 500);
  assert.equal(contextBudget(1800).remaining, -800);
});

test('the two independent subject rule fixtures retain their own weekend limits', () => {
  assert.deepEqual(subjectLimit('weekday', 3), { limit: 2, accepted: false });
  assert.deepEqual(subjectLimit('weekend', 3), { limit: 3, accepted: true });
  assert.deepEqual(subjectLimit('weekend', 3, 'm02-06'), { limit: 2, accepted: false });
});

test('tool execution requires both prior gates and task acceptance requires independent verification', () => {
  const all = { schema: true, authorized: true, toolSucceeded: true, verified: true };
  assert.deepEqual(evaluateGates({ ...all, authorized: false }), {
    stages: ['passed', 'failed', 'skipped', 'skipped'], executed: false, accepted: false
  });
  assert.deepEqual(evaluateGates({ ...all, verified: false }), {
    stages: ['passed', 'passed', 'passed', 'failed'], executed: true, accepted: false
  });
  assert.equal(evaluateGates(all).accepted, true);
});

test('toy host policies require independent scope, review, budget and runtime permissions', () => {
  const input = { inScope: true, reviewed: true, budget: 1, withinTime: true };
  assert.equal(governAction('release', input).executed, true);
  assert.deepEqual(governAction('release', { ...input, reviewed: false }), { executed: false, reason: 'review' });
  assert.deepEqual(governAction('test', { ...input, budget: 0 }), { executed: false, reason: 'budget' });
  assert.deepEqual(governAction('release', { ...input, inScope: false }), { executed: false, reason: 'scope' });
  assert.equal(governAction('test', { ...input, reviewed: false }).executed, true);
  assert.deepEqual(governAction('test', { ...input, withinTime: false }), { executed: false, reason: 'deadline' });
  const environment = { inside: true, writable: false, outbound: false };
  assert.equal(sandboxAction('read', environment).executed, true);
  assert.equal(sandboxAction('write', environment).reason, 'read-only');
  assert.equal(sandboxAction('write', { ...environment, writable: true }).executed, true);
  assert.equal(sandboxAction('write', { ...environment, writable: true, inside: false }).reason, 'scope');
  assert.equal(sandboxAction('network', environment).reason, 'network');
  assert.equal(sandboxAction('network', { ...environment, outbound: true }).executed, true);
  for (const claim of [false, true]) {
    assert.equal(authorizeScope('notes', claim).executed, false);
    assert.equal(authorizeScope('summary', claim).executed, true);
  }
});

test('retry uses executor enforcement and initial outcome, and field checks use actual content', () => {
  assert.deepEqual(retryEffects('unknown', true, false, true), { before: 1, after: 2, retryPerformed: true });
  assert.deepEqual(retryEffects('unknown', true, true, true), { before: 1, after: 1, retryPerformed: true });
  assert.deepEqual(retryEffects('unknown', false, true, true), { before: 0, after: 1, retryPerformed: true });
  assert.deepEqual(retryEffects('unknown', true, false, false), { before: 1, after: 1, retryPerformed: false });
  assert.deepEqual(retryEffects('confirmed-success', false, false, true), { before: 1, after: 1, retryPerformed: false });
  assert.deepEqual(retryEffects('confirmed-no-effect', true, false, true), { before: 0, after: 1, retryPerformed: true });
  assert.deepEqual(missingApplicationFields('SYN-001', 'DEMO-A', ' '), ['documentType']);
  assert.deepEqual(missingApplicationFields('SYN-001', 'DEMO-A', 'course plan'), []);
});
