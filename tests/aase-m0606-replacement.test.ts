import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
const lesson=JSON.parse(readFileSync('content/aase/lessons/aase-m06-c06.json','utf8'));
test('M06-06 preserves complete teaching and separates three transport hops',()=>{
 for(const lang of ['zh','en']){
  const sections=lesson.text[lang].sections;
  assert.deepEqual(sections.map((s:any)=>s.id),['introduction','overview','channel','hops','secrets','boundaries','integration','record','understanding']);
  const blocks=sections.flatMap((s:any)=>s.blocks??[]);
  assert.deepEqual(blocks.filter((b:any)=>b.kind==='table').map((b:any)=>b.rows.length),[3,5,7,6]);
  assert.deepEqual(blocks.filter((b:any)=>['flow','cards'].includes(b.kind)).map((b:any)=>b.items.length),[2,4,4]);
  assert.equal(blocks.filter((b:any)=>b.code).length,3);
  for(const id of ['channel','analogy','hops','secrets','boundaries','record'])assert.ok(sections.some((s:any)=>s.id===id||(s.blocks??[]).some((b:any)=>b.id===id)));
 }
 assert.deepEqual(lesson.checks.map((q:any)=>q.answer),[1,2,2]);
 assert.deepEqual(lesson.checks.map((q:any)=>q.id),['AASE-M06-C06-Q04','AASE-M06-C06-Q05','AASE-M06-C06-Q06']);
 assert.equal(lesson.publishedOn,'2026-11-05');
});
test('M06-06 manuscripts and bounded SVG exports reproduce checked artifacts',()=>{
 execFileSync('python3',['scripts/aase_m0606_content.py','--check']);
 execFileSync('python3',['scripts/aase_m0606_svg.py','--check']);
});
