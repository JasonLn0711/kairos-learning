import test from 'node:test';
import assert from 'node:assert/strict';
import { prism, inverseGround, projected, frame, atLength, depthOrder, clippedRoute, roundedPath } from '../src/lib/interactive/visual/shape.ts';

test('ground and vertical coordinates round trip across both axes', () => {
  for (const x of [-2,0,3]) for (const y of [-3,0,2]) {
    assert.deepEqual(inverseGround(projected(x,y,7),7), {x,y});
    assert.equal(projected(x,y,7).y, projected(x,y,0).y-7);
  }
  assert.throws(()=>projected(Infinity,0));
});
test('closed faces share exactly the same top rim and base anchors',()=>{
  const {top,left,right}=prism(1,.5,18);
  assert.equal(top.length,4);
  assert.deepEqual(left.slice(0,2),[top[3],top[2]]);
  assert.deepEqual(right.slice(0,2),[top[2],top[1]]);
  assert.throws(()=>prism(-1,1,1));
  const bounds=frame([...top,...left,...right,{x:0,y:37}],5);
  for (const p of [...top,...left,...right,{x:0,y:37}]) assert.ok(p.x>=bounds.left+5 && p.y<=bounds.bottom-5);
});
test('ground depth and clipped polyline are stable in both directions',()=>{
  assert.deepEqual(depthOrder([{id:'b',y:5},{id:'a',y:5},{id:'z',y:0}]).map(p=>p.id),['z','a','b']);
  for(const scale of [1,2]){
    const node=(x:number)=>({x:x*scale,y:0,bounds:{left:(x-5)*scale,right:(x+5)*scale,top:-5*scale,bottom:5*scale}});
    const points=clippedRoute(node(0),node(50),[{x:25*scale,y:10*scale}]);
    assert.equal(points[0].x,5*scale);
    assert.equal(points.at(-1)!.x,45*scale);
    assert.deepEqual(atLength(points,.5).point,{x:25*scale,y:10*scale});
    assert.ok(atLength(points,1).angle<0);
  }
});

import {glyphGeometry,glyphs,type GlyphRole} from '../src/lib/interactive/visual/registry.ts';

test('every semantic role has a stable visible envelope, optical center and safe hit area',()=>{
  for(const role of Object.keys(glyphs) as GlyphRole[]){
    const {bounds,hitBounds,opticalCenter,ports}=glyphGeometry(role);
    assert.ok(hitBounds.left < bounds.left && hitBounds.bottom > bounds.bottom);
    for(const p of [opticalCenter,...Object.values(ports)]){
      assert.ok(p && p.x>=bounds.left && p.x<=bounds.right && p.y>=bounds.top && p.y<=bounds.bottom);
    }
  }
  assert.deepEqual(glyphGeometry('person').ports,{});
});

test('rounding keeps both attachments and clamps neighboring turns',()=>{
  const points=[{x:0,y:0},{x:10,y:0},{x:10,y:8}];
  assert.equal(roundedPath(points,12),'M0 0 L6 0 Q10 0 10 4 L10 8');
  assert.throws(()=>roundedPath([],1));
});
