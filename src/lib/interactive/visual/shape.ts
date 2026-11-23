import { projectIsometric, boundaryAnchor, type Point, type Rectangle } from '../geometry.ts';

function finite(...values: number[]) {
  if (!values.every(Number.isFinite)) throw new RangeError('Expected finite visual coordinates');
}
export function projected(x: number, y: number, z = 0): Point {
  finite(x,y,z);
  return projectIsometric({x,y,z});
}
export function inverseGround(p: Point, z = 0): Point {
  finite(p.x,p.y,z);
  const sum = p.x / 36;
  const difference = (p.y + z) / 21;
  return {x:(sum + difference)/2, y:(sum - difference)/2};
}
// Clockwise rim from back to right, front and left. The SVG polygon closes each face.
export function prism(width: number, depth: number, height: number) {
  finite(width,depth,height);
  if (width <= 0 || depth <= 0 || height < 0) throw new RangeError('Invalid extrusion');
  const w=width/2, d=depth/2;
  const top=[projected(-w,d,height),projected(w,d,height),projected(w,-d,height),projected(-w,-d,height)];
  const base=top.map(p=>({x:p.x,y:p.y+height}));
  return {top,left:[top[3],top[2],base[2],base[3]],right:[top[2],top[1],base[1],base[2]]};
}
export function frame(points: readonly Point[], margin: number): Rectangle {
  if (!points.length || margin < 0) throw new RangeError('Invalid visual bounds');
  finite(margin);
  for(const p of points) finite(p.x,p.y);
  const xs=points.map(p=>p.x), ys=points.map(p=>p.y);
  return {left:Math.min(...xs)-margin,right:Math.max(...xs)+margin,top:Math.min(...ys)-margin,bottom:Math.max(...ys)+margin};
}
export function depthOrder<T extends {id:string;y:number}>(items: readonly T[]): T[] {
  return [...items].sort((a,b)=>a.y-b.y || (a.id<b.id?-1:a.id>b.id?1:0));
}
type Body = Point & {bounds:Rectangle};
export function clippedRoute(from: Body,to: Body, turns: readonly Point[]=[]): Point[] {
  return [boundaryAnchor(from,turns[0]??to,from.bounds),...turns,boundaryAnchor(to,turns.at(-1)??from,to.bounds)];
}
export function atLength(points: readonly Point[], progress: number) {
  if (!points.length) throw new RangeError('Empty motion path');
  finite(progress);
  const legs=points.slice(1).map((b,i)=>({a:points[i],b,length:Math.hypot(b.x-points[i].x,b.y-points[i].y)})).filter(s=>s.length>0);
  let remaining=legs.reduce((sum,s)=>sum+s.length,0)*Math.max(0,Math.min(1,progress));
  for(const leg of legs){
    if(remaining<=leg.length || leg===legs.at(-1)){
      const t=Math.min(1,remaining/leg.length), dx=leg.b.x-leg.a.x, dy=leg.b.y-leg.a.y;
      return {point:{x:leg.a.x+dx*t,y:leg.a.y+dy*t},angle:Math.atan2(dy,dx)*180/Math.PI};
    }
    remaining-=leg.length;
  }
  return {point:points[0],angle:0};
}
export const pointList = (points: readonly Point[])=>points.map(p=>p.x+','+p.y).join(' ');

// Round a turn without displacing either attachment point. Adjacent rounded
// corners each consume at most half their shared straight segment.
export function roundedPath(points: readonly Point[], radius: number): string {
  finite(radius);
  if(radius<0 || !points.length) throw new RangeError('Invalid connector');
  const path: string[]=[];
  for (const [i,p] of points.entries()) {
    finite(p.x,p.y);
    const before=points[i-1], after=points[i+1];
    if(!before || !after || !radius) {
      path.push((i?'L':'M')+p.x+' '+p.y);
      continue;
    }
    const incoming=Math.hypot(before.x-p.x,before.y-p.y);
    const outgoing=Math.hypot(after.x-p.x,after.y-p.y);
    if(!incoming || !outgoing) continue;
    const trim=Math.min(radius,incoming/2,outgoing/2);
    const start={x:p.x+(before.x-p.x)*trim/incoming,y:p.y+(before.y-p.y)*trim/incoming};
    const end={x:p.x+(after.x-p.x)*trim/outgoing,y:p.y+(after.y-p.y)*trim/outgoing};
    path.push('L'+start.x+' '+start.y+' Q'+p.x+' '+p.y+' '+end.x+' '+end.y);
  }
  return path.join(' ');
}
