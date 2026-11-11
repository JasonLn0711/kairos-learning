import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createAaseCatalog} from '../src/lib/aase.ts';
const read=(path:string)=>JSON.parse(readFileSync(path,'utf8'));
const lesson=read('content/aase/lessons/aase-m09-c04.json');
const course=read('content/aase/course.json'),english=read('content/aase/course.en.json'),sources=read('content/aase/sources.json');
test('M09-04 full bilingual replacement retains publication identity and reference relationships',()=>{
 const catalog=createAaseCatalog(course,[lesson],sources,'2026-11-11',english);
 assert.ok(catalog.concepts.find(c=>c.id===lesson.id)?.lesson);
 assert.equal(lesson.publishedOn,'2026-11-05');assert.equal(lesson.contentVersion,'1.1.0');
 for(const lang of ['zh','en']){
  const sections=lesson.text[lang].sections;
  assert.equal(sections.length,9);
  const figures=sections.flatMap((s:any)=>s.blocks??[]).filter((b:any)=>['cards','flow'].includes(b.kind));
  assert.deepEqual(figures.map((f:any)=>[f.kind,f.items.length]),[['cards',2],['flow',6],['cards',5]]);
  const tables=sections.flatMap((s:any)=>s.blocks??[]).filter((b:any)=>b.kind==='table');assert.deepEqual(tables.map((t:any)=>t.rows.length),[3,9]);
 }
 assert.deepEqual(lesson.checks.map((q:any)=>q.answer),[1,1,2]);assert.ok(lesson.checks.every((q:any)=>q.text.zh.options.length===3));
});
test('M09-04 rejects a spurious process arrow in the responsibility comparison',()=>{
 const invalid=structuredClone(lesson);for(const lang of ['zh','en'])invalid.text[lang].sections[2].blocks[0].kind='flow';
 assert.throws(()=>createAaseCatalog(course,[invalid],sources,'2026-11-11',english),/invalid technology change figure/);
});
