import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createAaseCatalog} from '../src/lib/aase.ts';
const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const lesson=read('content/aase/lessons/aase-m08-c01.json');
test('M08-01 preserves source scope, original checks and all existing anchors',()=>{
 for(const lang of ['zh','en']){
  const sections=lesson.text[lang].sections,blocks=sections.flatMap((s:any)=>s.blocks??[]);
  assert.deepEqual(sections.map((s:any)=>s.id),['claim','analogy','layers','matrix','record','collaboration','misread','understanding']);
  assert.deepEqual(blocks.filter((b:any)=>b.kind==='table').map((b:any)=>b.rows.length),[3,5]);
  assert.deepEqual(blocks.filter((b:any)=>['cards','flow'].includes(b.kind)).map((b:any)=>[b.kind,b.items.length]),[['cards',6],['cards',3],['flow',4]]);
  assert.equal([...sections.flatMap((s:any)=>s.paragraphs),...blocks.filter((b:any)=>b.kind==='prose').flatMap((b:any)=>b.paragraphs)].filter((p:string)=>p.startsWith('### ')).length,10);
  assert.equal(blocks.filter((b:any)=>b.code).length,1);
  assert.ok(sections.find((s:any)=>s.id==='misread').paragraphs.length>=8);
 }
 assert.equal(lesson.publishedOn,'2026-11-05');assert.deepEqual(lesson.qa,[]);
 assert.deepEqual(lesson.checks.map((q:any)=>q.answer),[1,2,1]);assert.deepEqual(lesson.checks.map((q:any)=>q.text.zh.options.length),[3,3,3]);
 execFileSync('sha256sum',['-c','SHA256SUMS'],{cwd:'docs/sources/aase/m08-01/replacement-2026-11-11'});
 for(const file of ['content','svg'])execFileSync('python3',[`scripts/aase_m0801_${file}.py`,'--check']);
});
test('M08-01 fixed figure contract rejects missing perspectives and injected export fields',()=>{
 const all=readdirSync('content/aase/lessons').map(f=>read('content/aase/lessons/'+f));
 const build=(l:any)=>createAaseCatalog(read('content/aase/course.json'),all.map(x=>x.id===l.id?l:x),read('content/aase/sources.json'),'2026-11-11',read('content/aase/course.en.json'));
 for(const mutate of [(f:any)=>f.items.pop(),(f:any)=>f.kind='flow',(f:any)=>f.asset='/arbitrary.svg',(f:any)=>f.items[0].markup='<script/>']){
  const copy=structuredClone(lesson);for(const lang of ['zh','en'])mutate(copy.text[lang].sections.find((s:any)=>s.id==='layers').blocks[0]);assert.throws(()=>build(copy),/invalid verification evidence figure/);
 }
 const copy=structuredClone(lesson);copy.status='draft';assert.equal(build(copy).lessons.some(l=>l.id===copy.id),false);
});
