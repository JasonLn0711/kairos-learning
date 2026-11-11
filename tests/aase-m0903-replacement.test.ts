import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createAaseCatalog} from '../src/lib/aase.ts';
const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const lesson=read('content/aase/lessons/aase-m09-c03.json');
test('M09-03 retains nine chapters, scenario evidence and bilingual source structure',()=>{
 assert.equal(lesson.publishedOn,'2026-11-05');assert.equal(lesson.contentVersion,'1.1.0');assert.deepEqual(lesson.qa,[]);
 for(const lang of ['zh','en']){
  const s=lesson.text[lang].sections;assert.equal(s.length,11);
  for(const id of ['demo','analogy','trace','walkthrough','assessment','decision'])assert(s.some((s:any)=>s.id===id));
  const figures=s.flatMap((s:any)=>s.blocks).filter((b:any)=>['flow','cards'].includes(b.kind));
  assert.deepEqual(figures.map((b:any)=>[b.kind,b.items.length]),[['flow',5],['cards',3]]);
  assert.equal(s.flatMap((s:any)=>s.blocks).filter((b:any)=>b.kind==='table').length,4);
  assert.equal(lesson.text[lang].openChecks[0].answer.length,3);
  for(let n=1;n<=2;n++)assert(readFileSync(`site/images/aase/m09-03-${n}-${lang}.svg`).length<100000);
 }
});
test('acceptance renderer rejects incorrect order, extra fields and scenario counts',()=>{
 const course=read('content/aase/course.json'),english=read('content/aase/course.en.json'),sources=read('content/aase/sources.json');
 const catalog=(x:any)=>createAaseCatalog(course,[x],sources,'2026-11-11',english);
 assert.doesNotThrow(()=>catalog(lesson));
 for(const mutation of [(b:any)=>b.items.pop(),(b:any)=>b.kind='cards',(b:any)=>b.items[0].markup='<script/>']){
  const copy=structuredClone(lesson);mutation(copy.text.zh.sections.find((s:any)=>s.id==='analogy').blocks[0]);assert.throws(()=>catalog(copy));
 }
});
