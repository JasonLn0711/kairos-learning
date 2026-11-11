import {test} from 'node:test';
import assert from 'node:assert/strict';
import {deliveryFee,acceptsLength} from '../src/lib/rule-testing-demo.ts';
test('delivery threshold and invalid types follow the independent specification',()=>{
 for(const [input,fee]of [[0,60],[999,60],[1000,0],[1001,0],[2000,0]])assert.equal(deliveryFee(input),fee);
 for(const input of [-1,1.5,'1000',true,null,NaN,Infinity])assert.throws(()=>deliveryFee(input));
});
test('length-only comparison preserves the inclusive upper limit',()=>{
 for(const input of [0,79,80])assert.equal(acceptsLength(input),true);
 for(const input of [81,100])assert.equal(acceptsLength(input),false);
 for(const input of [-1,1.5,'80',null,NaN])assert.throws(()=>acceptsLength(input));
});
import {readFileSync} from 'node:fs';
import {createAaseCatalog} from '../src/lib/aase.ts';
const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const lesson=read('content/aase/lessons/aase-m08-c03.json');
const build=(l:any)=>createAaseCatalog(read('content/aase/course.json'),[l],read('content/aase/sources.json'),'2026-11-11',read('content/aase/course.en.json'));
test('rule-testing figures reject altered structure and preserve searchable teaching',()=>{
 assert.doesNotThrow(()=>build(lesson));
 for(const id of ['map','delivery','cases'])for(const change of ['kind','extra','markup']){
  const l=structuredClone(lesson);
  for(const lang of ['zh','en']){const f=l.text[lang].sections.find((s:any)=>s.id===id).blocks.find((b:any)=>['cards','flow'].includes(b.kind));if(change==='kind')f.kind=f.kind==='cards'?'flow':'cards';else if(change==='extra')f.items.push({...f.items[0]});else f.items[0].markup='<svg/>';}
  assert.throws(()=>build(l),/invalid rule testing figure/);
 }
 const catalog=build(lesson);
 for(const lang of ['zh','en']as const){const t=lesson.text[lang];assert.equal(t.sections.length,11);assert.equal(t.openChecks.length,4);const search=catalog.forLanguage(lang)!.searchEntries[0].text;for(const s of t.sections)for(const b of s.blocks??[])if(b.kind==='prose')for(const p of b.paragraphs)assert.ok(search.includes(p));}
});
