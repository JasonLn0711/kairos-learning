import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {createAaseCatalog} from '../src/lib/aase.ts';
const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const root='docs/sources/aase/m03-01/replacement-2026-11-07/';
const lesson=read('content/aase/lessons/aase-m03-c01.json'),before=read(root+'previous.json');
const build=(l:any)=>createAaseCatalog(read('content/aase/course.json'),[l],read('content/aase/sources.json'),'2026-11-07',read('content/aase/course.en.json'));
test('replacement keeps identity, publication gates, previous anchors, source template and supplied choices',()=>{
 assert.equal(lesson.contentVersion,'1.1.0');assert.equal(lesson.revision,before.revision+1);assert.equal(lesson.publishedOn,before.publishedOn);assert.deepEqual(lesson.translations,before.translations);assert.deepEqual(lesson.qa,[]);
 const raw=readFileSync(root+'supplied.zh-TW.md','utf8');const template=raw.match(/```\n([\s\S]*?)\n```/)![1];
 for(const lang of ['zh','en']){
  const t=lesson.text[lang];assert.equal(t.sections.length,11);
  for(const s of before.text[lang].sections)assert.ok(t.sections.some((x:any)=>x.id===s.id));
  const blocks=t.sections.flatMap((s:any)=>s.blocks??[]);assert.equal(blocks.filter((b:any)=>b.kind==='flow'||b.kind==='cards').length,7);
  assert.equal(blocks.find((b:any)=>b.id==='problem-template').code,template);
  assert.deepEqual(lesson.checks.map((q:any)=>q.text[lang].options.length),[3,3,3]);assert.equal(t.openChecks.length,1);
 }
 for(const q of lesson.checks)for(const option of q.text.zh.options)assert.ok(raw.includes(option));
 assert.deepEqual(lesson.checks.map((q:any)=>q.answer),[0,1,1]);assert.doesNotThrow(()=>build(lesson));
 assert.equal(spawnSync('sha256sum',['-c','SHA256SUMS.txt'],{cwd:root}).status,0);
});
test('bounded figure data rejects altered node counts and relationship kinds',()=>{
 for(const id of ['analogy','structure','acceptance','workflow','documents','connection'])for(const change of ['add','remove','kind']){
  const l=structuredClone(lesson);
  for(const lang of ['zh','en']){const b=l.text[lang].sections.find((s:any)=>s.id===id).blocks.find((b:any)=>b.kind==='cards'||b.kind==='flow');if(change==='add')b.items.push({...b.items[0]});else if(change==='remove')b.items.pop();else b.kind=b.kind==='cards'?'flow':'cards';}
  assert.throws(()=>build(l),/invalid problem statement figure/);
 }
});
test('exports reproduce the same model and stay inside the reviewed SVG boundary',()=>{
 const r=spawnSync('python3',['scripts/aase_m0301_svg.py','--check'],{encoding:'utf8'});assert.equal(r.status,0,r.stdout+r.stderr);
});
