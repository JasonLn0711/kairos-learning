import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
const lesson=JSON.parse(readFileSync('content/aase/lessons/aase-m07-c06.json','utf8'));
test('M07-06 preserved manuscripts compile to complete bilingual teaching and exports',()=>{
 for(const script of ['aase_m0706_content.py','aase_m0706_svg.py'])execFileSync('python3',[`scripts/${script}`,'--check']);
 for(const lang of ['zh','en']){
  const t=lesson.text[lang];assert.equal(t.sections.length,10);assert.equal(t.openChecks.length,3);
  const blocks=t.sections.flatMap((s:any)=>s.blocks??[]);
  const figures=blocks.filter((b:any)=>/^(圖|Figure) /.test(b.caption??''));
  assert.deepEqual(figures.map((b:any)=>b.kind),['cards','flow','table','flow','cards']);
  assert.equal(figures[0].items.length,4);assert.equal(figures[3].items.length,5);assert.equal(figures[4].items.length,6);
  assert.equal(blocks.filter((b:any)=>b.code).length,11);
  for(const id of ['review','analogy','diff','evidence','decision','record'])assert.ok(t.sections.some((s:any)=>s.id===id));
 }
 assert.equal(lesson.publishedOn,'2026-11-05');assert.equal(lesson.contentVersion,'1.1.0');assert.deepEqual(lesson.qa,[]);
});
