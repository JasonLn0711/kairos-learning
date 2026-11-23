import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import {
  boundaryAnchor, layoutNetwork, motionAt, motionPlan, projectIsometric, sceneLinks
} from '../src/lib/interactive/geometry.ts';
import type { InteractiveLessonData, Scene } from '../src/lib/interactive/model.ts';

const lesson: InteractiveLessonData = JSON.parse(readFileSync(
  new URL('../content/interactive/request-lifecycle.json', import.meta.url), 'utf8'
));

test('ground axes project symmetrically and elevation moves a point straight up', () => {
  assert.deepEqual(projectIsometric({ x: 1, y: 0 }), { x: 36, y: 21 });
  assert.deepEqual(projectIsometric({ x: 0, y: 1 }), { x: 36, y: -21 });
  assert.deepEqual(projectIsometric({ x: 1, y: 1, z: 12 }), { x: 72, y: -12 });
});

test('both layouts fit all node silhouettes and project links to their boundaries', () => {
  for (const mode of ['wide', 'compact'] as const) {
    const layout = layoutNetwork(lesson.nodes, lesson.edges, mode);
    const reversed = layoutNetwork([...lesson.nodes].reverse(), lesson.edges, mode);
    assert.deepEqual(layout, reversed);
    for (const { bounds } of layout.nodes) {
      assert.ok(bounds.left > 0 && bounds.right < layout.width);
      assert.ok(bounds.top > 0 && bounds.bottom < layout.height);
    }
    for (const link of layout.links) {
      const from = layout.nodes.find(node => node.id === link.from)!;
      const to = layout.nodes.find(node => node.id === link.to)!;
      assert.deepEqual(link.start, boundaryAnchor(from.position, to.position, from.bounds));
      assert.deepEqual(link.end, boundaryAnchor(to.position, from.position, to.bounds));
      assert.notDeepEqual(link.start, from.position);
      assert.notDeepEqual(link.end, to.position);
    }
  }
});

test('DNS uses separate query and answer lanes and a warm cache stays local', () => {
  const dns = lesson.steps.find(step => step.id === 'dns')!;
  const layout = layoutNetwork(lesson.nodes, lesson.edges, 'wide');
  const [query, answer] = sceneLinks(layout, dns.scene);
  assert.deepEqual([query.from, query.to, answer.from, answer.to], ['browser', 'dns', 'dns', 'browser']);
  assert.notDeepEqual(query.start, answer.end);
  assert.notDeepEqual(query.end, answer.start);
  assert.deepEqual(sceneLinks(layout, dns.variant!.scene), []);
  const disconnected: Scene = { ...dns.scene, route: ['dns', 'database'] };
  assert.deepEqual(sceneLinks(layout, disconnected), []);
});

test('a slow database pauses at the database before starting the return leg', () => {
  const database = lesson.steps.find(step => step.id === 'database')!;
  const layout = layoutNetwork(lesson.nodes, lesson.edges, 'compact');
  const slow = database.variant!.scene;
  const normalPlan = motionPlan(sceneLinks(layout, database.scene), database.scene);
  const slowPlan = motionPlan(sceneLinks(layout, slow), slow);
  assert.equal(sceneLinks(layout, slow)[0].to, 'database');
  assert.deepEqual(motionAt(normalPlan, 850), {
    leg: 1, position: 60 / 650, waiting: false, done: false
  });
  assert.deepEqual(motionAt(slowPlan, 850), { leg: 0, position: 1, waiting: true, done: false });
  assert.deepEqual(motionAt(slowPlan, 1750), { leg: 1, position: 0, waiting: false, done: false });
  assert.deepEqual(motionAt(slowPlan, 2400), { leg: 1, position: 1, waiting: false, done: true });
});
