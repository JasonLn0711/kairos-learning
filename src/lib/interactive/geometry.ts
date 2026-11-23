import type { Scene, SceneEdge, SceneNode } from './model.ts';

export type Point = { x: number; y: number };
type WorldPoint = Point & { z?: number };
export type Rectangle = { left: number; top: number; right: number; bottom: number };
export type SceneLayout = 'wide' | 'compact';

export type PlacedNode = SceneNode & {
  position: Point;
  bounds: Rectangle;
};
export type PlacedLink = {
  id: string;
  from: string;
  to: string;
  start: Point;
  end: Point;
  path: string;
};
export type NetworkLayout = {
  width: number;
  height: number;
  nodes: PlacedNode[];
  links: PlacedLink[];
};

export const compactStageWidth = 475;

/** The ground axes contribute equally along screen x and oppositely along screen y. */
export function projectIsometric({ x, y, z = 0 }: WorldPoint, scaleX = 36, scaleY = 21): Point {
  return { x: scaleX * (x + y), y: scaleY * (x - y) - z };
}

function extent(values: number[]): [number, number] {
  return [Math.min(...values), Math.max(...values)];
}

function fitCoordinate(value: number, [min, max]: [number, number], from: number, to: number) {
  const scale = max > min ? Math.min(1, (to - from) / (max - min)) : 1;
  return (from + to) / 2 + (value - (min + max) / 2) * scale;
}

export function nodeBounds({ x, y }: Point): Rectangle {
  return { left: x - 39, top: y - 50, right: x + 39, bottom: y + 19 };
}

/** Intersect the ray from the entity's ground anchor with its projected silhouette bounds. */
export function boundaryAnchor(origin: Point, target: Point, bounds: Rectangle): Point {
  const dx = target.x - origin.x;
  const dy = target.y - origin.y;
  if (!dx && !dy) return origin;
  const horizontal = dx === 0 ? Infinity : ((dx > 0 ? bounds.right : bounds.left) - origin.x) / dx;
  const vertical = dy === 0 ? Infinity : ((dy > 0 ? bounds.bottom : bounds.top) - origin.y) / dy;
  const t = Math.min(horizontal, vertical);
  return { x: origin.x + t * dx, y: origin.y + t * dy };
}

function edgePath(origin: PlacedNode, target: PlacedNode, lane = 0) {
  const dx = target.position.x - origin.position.x;
  const dy = target.position.y - origin.position.y;
  const length = Math.hypot(dx, dy);
  const offset = length ? { x: -dy / length * lane, y: dx / length * lane } : { x: 0, y: 0 };
  const anchor = (a: PlacedNode, b: PlacedNode) => boundaryAnchor(
    { x: a.position.x + offset.x, y: a.position.y + offset.y },
    { x: b.position.x + offset.x, y: b.position.y + offset.y },
    a.bounds
  );
  const start = anchor(origin, target);
  const end = anchor(target, origin);
  return { start, end, path: `M${start.x},${start.y} L${end.x},${end.y}` };
}

export function layoutNetwork(nodes: SceneNode[], edges: SceneEdge[], mode: SceneLayout): NetworkLayout {
  const compact = mode === 'compact';
  const width = compact ? 320 : 640;
  const height = compact ? 420 : 280;
  const projected = nodes.map(node => {
    const pos = projectIsometric(node);
    // Portrait view rotates the ground axes to keep the trunk vertical and the branch to the side.
    return compact ? { x: -pos.y * 1.8, y: pos.x * .63 + pos.y * .81 } : pos;
  });
  const horizontal = extent(projected.map(pos => pos.x));
  const vertical = extent(projected.map(pos => pos.y));
  const placed = nodes.map((node, index) => {
    const pos = projected[index];
    const position = {
      x: fitCoordinate(pos.x, horizontal, compact ? 77 : 73, compact ? 236 : 567),
      y: fitCoordinate(pos.y, vertical, compact ? 81 : 89, compact ? 389 : 218)
    };
    return { ...node, position, bounds: nodeBounds(position) };
  });
  placed.sort((a, b) => a.position.y - b.position.y || a.position.x - b.position.x || a.id.localeCompare(b.id));
  const lookup = new Map(placed.map(node => [node.id, node]));
  const links = edges.flatMap(edge => {
    const from = lookup.get(edge.from);
    const to = lookup.get(edge.to);
    return from && to ? [{ ...edge, ...edgePath(from, to) }] : [];
  });
  return { width, height, nodes: placed, links };
}

/** Traverse only the declared graph; distinct lanes show a link used in both directions. */
export function sceneLinks(layout: NetworkLayout, scene: Scene): PlacedLink[] {
  const nodes = new Map(layout.nodes.map(node => [node.id, node]));
  const segments = scene.route.slice(1).flatMap((to, index) => {
    const from = scene.route[index];
    const edge = layout.links.find(link =>
      (link.from === from && link.to === to) || (link.to === from && link.from === to)
    );
    return edge ? [{ id: edge.id, from, to }] : [];
  });
  return segments.map(segment => {
    const bothDirections = segments.some(other => other.from === segment.to && other.to === segment.from);
    return { ...segment, ...edgePath(nodes.get(segment.from)!, nodes.get(segment.to)!, bothDirections ? 4 : 0) };
  });
}

export function localMotionPath({ position: { x, y } }: PlacedNode) {
  return `M${x - 21},${y - 50} a21,8 0 1,1 42,0 a21,8 0 1,1 -42,0`;
}

export type MotionLeg = { travelMs: number; holdMs: number };
export type MotionSample = { leg: number; position: number; waiting: boolean; done: boolean };

/** Times are animation pacing only. They never represent measured network duration. */
export function motionPlan(segments: PlacedLink[], scene: Scene): MotionLeg[] {
  if (!segments.length) return [{ travelMs: 1450, holdMs: 0 }];
  const delayedLeg = scene.pace === 'slow' ? segments.findIndex(segment => segment.to === scene.focus) : -1;
  return segments.map((_, index) => ({
    travelMs: 650,
    holdMs: index === delayedLeg ? 1100 : index === segments.length - 1 ? 0 : 140
  }));
}

export function motionAt(plan: MotionLeg[], elapsed: number): MotionSample {
  let remaining = Math.max(0, elapsed);
  for (const [leg, { travelMs, holdMs }] of plan.entries()) {
    if (remaining < travelMs) return { leg, position: remaining / travelMs, waiting: false, done: false };
    if (remaining < travelMs + holdMs) return { leg, position: 1, waiting: true, done: false };
    remaining -= travelMs + holdMs;
  }
  return { leg: Math.max(0, plan.length - 1), position: 1, waiting: false, done: true };
}
