import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createAaseCatalog} from '../src/lib/aase.ts';
const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const lesson=read('content/aase/lessons/aase-m08-c02.json');
const all=readdirSync('content/aase/lessons').map(f=>read('content/aase/lessons/'+f));
const build=(ls=all)=>createAaseCatalog(read('content/aase/course.json'),ls,read('content/aase/sources.json'),'2026-11-11',read('content/aase/course.en.json'));
test('full TDD replacement preserves source sections, tables, runnable code and historical anchors',()=>{
 const prior=read('docs/sources/aase/m08-02/replacement-2026-11-11/previous-lesson.json');
 for(const lang of ['zh','en']){
  const sections=lesson.text[lang].sections,blocks=sections.flatMap((s:any)=>s.blocks??[]);
  assert.deepEqual(sections.map((s:any)=>s.id),['cycle','analogy','red-meaning','industries','requirement','red-stage','green-stage','refactor-stage','evidence','comparison','agent-workflow','quality','applicability','understanding']);
  for(const s of prior.text[lang].sections)assert.ok(sections.some((n:any)=>n.id===s.id));
  assert.deepEqual(blocks.filter((b:any)=>b.kind==='table').map((b:any)=>b.rows.length),[5,5,5,5]);
  assert.deepEqual(blocks.filter((b:any)=>['cards','flow'].includes(b.kind)).map((b:any)=>[b.kind,b.items.length]),[['flow',3],['cards',3],['flow',4]]);
  assert.equal(blocks.filter((b:any)=>b.code).length,6);
 }
 assert.equal(lesson.publishedOn,prior.publishedOn);assert.equal(lesson.contentVersion,'1.1.0');assert.equal(lesson.revision,4);assert.deepEqual(lesson.qa,[]);
 assert.deepEqual(lesson.checks.map((q:any)=>q.answer),[1,1,2]);assert.deepEqual(lesson.checks.map((q:any)=>q.text.zh.options.length),[3,3,3]);
 assert.doesNotThrow(()=>build());
});
test('TDD figures reject unreviewed kinds, counts, placement and markup fields',()=>{
 for(const mutate of [(f:any)=>f.items.pop(),(f:any)=>f.kind='cards',(f:any)=>f.html='<script>',(f:any)=>f.items[0].path='M0 0']){
  const ls=structuredClone(all),l=ls.find((l:any)=>l.id===lesson.id)!;for(const lang of ['zh','en']){const f=l.text[lang].sections.find((s:any)=>s.id==='analogy').blocks.find((b:any)=>b.kind==='flow');mutate(f);}assert.throws(()=>build(ls));
 }
});
test('source hashes, adopted body and six constrained exports are synchronized',()=>{
 execFileSync('sha256sum',['-c','SHA256SUMS'],{cwd:'docs/sources/aase/m08-02/replacement-2026-11-11'});
 execFileSync('python3',['scripts/aase_m0802_content.py','--check']);execFileSync('python3',['scripts/aase_m0802_svg.py','--check']);
});
