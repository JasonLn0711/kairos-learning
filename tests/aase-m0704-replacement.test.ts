import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {validationIssue} from '../src/lib/validation-demo.ts';
const lesson=JSON.parse(readFileSync('content/aase/lessons/aase-m07-c04.json','utf8'));
test('M07-04 retains all ten source sections, examples, tables and original anchors',()=>{
 for(const lang of ['zh','en']){
  const t=lesson.text[lang],sections=t.sections,blocks=sections.flatMap((s:any)=>s.blocks??[]);
  assert.deepEqual(sections.map((s:any)=>s.id),['problem','analogy','cases','implementation','testing','flow','industry','run','misread','understanding']);
  assert.deepEqual(blocks.filter((b:any)=>b.kind==='table').map((b:any)=>b.rows.length),[3,8,6,6]);
  assert.deepEqual(blocks.filter((b:any)=>['cards','flow'].includes(b.kind)).map((b:any)=>[b.kind,b.items.length]),[['cards',4],['cards',3],['cards',3],['flow',4]]);
  assert.equal(blocks.filter((b:any)=>b.code).length,6);
  assert.deepEqual(t.openChecks.map((q:any)=>q.id),['AASE-M07-C04-Q04','AASE-M07-C04-Q05','AASE-M07-C04-Q06']);
 }
 assert.equal(lesson.publishedOn,'2026-11-05');assert.equal(lesson.contentVersion,'1.1.0');assert.deepEqual(lesson.qa,[]);
});
test('text validation agrees with Python on blanks, Unicode length and trim boundaries',()=>{
 const values=['','   ','X'.repeat(80),'X'.repeat(81),'  SYN-001  ','😀'.repeat(80),'😀'.repeat(81),'\u0085','\u001c','\ufeff','\u001fX\u0085','e\u0301'.repeat(40),'e\u0301'.repeat(41)];
 const expected=[...values.map(v=>validationIssue(v))];
 assert.deepEqual(expected,['blank','blank',null,'length',null,null,'length','blank','blank',null,null,null,'length']);
 const python=JSON.parse(execFileSync('python3',['-c','import json,sys;print(json.dumps(["blank" if not s.strip() else "length" if len(s.strip())>80 else None for s in json.load(sys.stdin)]))'],{input:JSON.stringify(values),encoding:'utf8'}));
 assert.deepEqual(expected,python);
});
test('source archive and generated content/SVG remain reproducible',()=>{
 execFileSync('sha256sum',['-c','SHA256SUMS'],{cwd:'docs/sources/aase/m07-04/replacement-2026-11-11'});
 execFileSync('python3',['scripts/aase_m0704_content.py','--check']);
 execFileSync('python3',['scripts/aase_m0704_svg.py','--check']);
});
test('M07-04 model rejects extra nodes and arbitrary diagram fields',async()=>{
 const {createAaseCatalog}=await import('../src/lib/aase.ts');
 const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
 const build=(l:any)=>createAaseCatalog(read('content/aase/course.json'),[l],read('content/aase/sources.json'),'2026-11-11',read('content/aase/course.en.json'));
 assert.doesNotThrow(()=>build(lesson));
 for(const mutation of [(b:any)=>b.items.push({title:'extra',body:'extra'}),(b:any)=>{b.markup='<svg onload="alert(1)"/>';},(b:any)=>{b.kind='flow';}]){
  const bad=structuredClone(lesson);for(const lang of ['zh','en'])mutation(bad.text[lang].sections[0].blocks[0]);
  assert.throws(()=>build(bad),/invalid data validation figure/);
 }
});
