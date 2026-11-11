import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {createAaseCatalog} from '../src/lib/aase.ts';
const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const root='docs/sources/aase/m07-02/replacement-2026-11-11/';
const lesson=read('content/aase/lessons/aase-m07-c02.json'),before=read(root+'prior-lesson.json');
const build=(l:any)=>createAaseCatalog(read('content/aase/course.json'),[l],read('content/aase/sources.json'),'2026-11-11',read('content/aase/course.en.json'));
test('M07-02 retains history, exact task template, all tables and new open questions',()=>{
 assert.equal(lesson.revision,before.revision+1);assert.equal(lesson.contentVersion,'1.1.0');assert.equal(lesson.publishedOn,before.publishedOn);assert.deepEqual(lesson.translations,before.translations);assert.deepEqual(lesson.qa,before.qa);assert.deepEqual(lesson.checks,[]);
 const raw=readFileSync(root+'pasted-text-1.txt','utf8');const code=raw.match(/```\n([\s\S]*?)\n```/)![1];
 for(const lang of ['zh','en']){
  const t=lesson.text[lang];assert.equal(t.sections.length,11);
  for(const s of before.text[lang].sections)assert.ok(t.sections.some((x:any)=>x.id===s.id));
  const blocks=t.sections.flatMap((s:any)=>s.blocks??[]);
  assert.deepEqual(blocks.filter((b:any)=>b.kind==='table').map((b:any)=>b.rows.length),[8,4,4,2,5,7,4]);
  assert.equal(blocks.find((b:any)=>b.code).code,code);
  assert.deepEqual(t.openChecks.map((q:any)=>q.id),['AASE-M07-C02-Q04','AASE-M07-C02-Q05','AASE-M07-C02-Q06','AASE-M07-C02-Q07']);
 }
 assert.doesNotThrow(()=>build(lesson));assert.equal(spawnSync('sha256sum',['-c','SHA256SUMS'],{cwd:root}).status,0);
});
test('M07-02 rejects altered figure relationships and node counts',()=>{
 for(const id of ['contract','review'])for(const change of ['add','remove','kind']){
  const l=structuredClone(lesson);for(const lang of ['zh','en']){const b=l.text[lang].sections.find((s:any)=>s.id===id).blocks.find((b:any)=>b.kind==='cards'||b.kind==='flow');if(change==='add')b.items.push({...b.items[0]});else if(change==='remove')b.items.pop();else b.kind=b.kind==='cards'?'flow':'cards';}
  assert.throws(()=>build(l),/invalid task contract figure/);
 }
});
test('M07-02 content and reviewed SVG exports reproduce',()=>{
 for(const script of ['aase_m0702_content.py','aase_m0702_svg.py']){const r=spawnSync('python3',['scripts/'+script,'--check'],{encoding:'utf8'});assert.equal(r.status,0,r.stdout+r.stderr);}
});
