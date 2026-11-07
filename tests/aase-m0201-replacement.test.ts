import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {createAaseCatalog} from '../src/lib/aase.ts';
const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const root='docs/sources/aase/m02-01/replacement-2026-11-07/';
const lesson=read('content/aase/lessons/aase-m02-c01.json'),before=read(root+'previous.json');
const build=(l:any)=>createAaseCatalog(read('content/aase/course.json'),[l],read('content/aase/sources.json'),'2026-11-07',read('content/aase/course.en.json'));
test('replacement preserves publication history, old links, source bytes and supplied answer choices',()=>{
 assert.equal(lesson.contentVersion,'1.1.0');assert.equal(lesson.revision,before.revision+1);assert.equal(lesson.publishedOn,before.publishedOn);assert.deepEqual(lesson.translations,before.translations);assert.equal(lesson.date,'2026-11-07');assert.deepEqual(lesson.qa,[]);
 for(const lang of ['zh','en']){
  const t=lesson.text[lang];assert.equal(t.sections.length,8);assert.deepEqual(t.exercise,before.text[lang].exercise);
  for(const s of before.text[lang].sections)assert.ok(t.sections.some((x:any)=>x.id===s.id));
  assert.equal(t.sections.flatMap((s:any)=>s.blocks??[]).filter((b:any)=>b.kind==='flow'||b.kind==='cards').length,6);
  assert.deepEqual(lesson.checks.map((q:any)=>q.text[lang].options.length),[3,3,3,3]);
 }
 assert.deepEqual(lesson.checks.map((q:any)=>q.answer),[1,1,2,1]);assert.doesNotThrow(()=>build(lesson));
 const raw=readFileSync(root+'pasted-text-1.txt','utf8');for(const q of lesson.checks)for(const option of q.text.zh.options)assert.ok(raw.includes(option));
 assert.equal(spawnSync('sha256sum',['-c','SHA256SUMS.txt'],{cwd:root}).status,0);
});
test('six specific figure layouts reject changed node counts and relationships',()=>{
 for(const id of ['pipeline','units','analogy','attention','attention-example','limits'])for(const change of ['add','remove','kind']){
  const l=structuredClone(lesson);
  for(const lang of ['zh','en']){const b=l.text[lang].sections.find((s:any)=>s.id===id).blocks.find((b:any)=>b.kind==='cards'||b.kind==='flow');if(change==='add')b.items.push({...b.items[0]});else if(change==='remove')b.items.pop();else b.kind=b.kind==='cards'?'flow':'cards';}
  assert.throws(()=>build(l),/invalid token attention figure/);
 }
});
test('same-model exports and Python arithmetic reproduce the published example',()=>{
 const result=spawnSync('python3',['scripts/aase_m0201_svg.py','--check'],{encoding:'utf8'});assert.equal(result.status,0,result.stdout+result.stderr);
 const code=lesson.text.zh.sections.find((s:any)=>s.id==='attention-example').blocks.find((b:any)=>b.code).code;
 for(const [program,output] of [[code,'weights = [0.731, 0.269]\nweighted_value = 3.076'],[code.replace('[1.0, 0.0]','[0.0, 0.0]'),'weights = [0.5, 0.5]\nweighted_value = 4.0']]){const run=spawnSync('python3',['-c',program],{encoding:'utf8'});assert.equal(run.status,0);assert.equal(run.stdout.trim(),output);}
});
