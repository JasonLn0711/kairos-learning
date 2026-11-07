import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {createAaseCatalog} from '../src/lib/aase.ts';
const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const root='docs/sources/aase/m02-06/replacement-2026-11-07/';
const lesson=read('content/aase/lessons/aase-m02-c06.json'),before=read(root+'previous.json');
const build=(l:any)=>createAaseCatalog(read('content/aase/course.json'),[l],read('content/aase/sources.json'),'2026-11-07',read('content/aase/course.en.json'));
test('replacement preserves publication history, old links, source bytes and supplied answer choices',()=>{
 assert.equal(lesson.contentVersion,'1.1.0');assert.equal(lesson.revision,before.revision+1);assert.equal(lesson.publishedOn,before.publishedOn);assert.deepEqual(lesson.translations,before.translations);assert.equal(lesson.date,'2026-11-07');assert.deepEqual(lesson.qa,[]);
 for(const lang of ['zh','en']){
  const t=lesson.text[lang];assert.equal(t.sections.length,10);
  for(const s of before.text[lang].sections)assert.ok(t.sections.some((x:any)=>x.id===s.id));
  assert.equal(t.sections.flatMap((s:any)=>s.blocks??[]).filter((b:any)=>b.kind==='flow'||b.kind==='cards').length,4);
  assert.deepEqual(lesson.checks.map((q:any)=>q.text[lang].options.length),[4]);
 }
 assert.deepEqual(lesson.checks.map((q:any)=>q.answer),[1]);assert.doesNotThrow(()=>build(lesson));
 const raw=readFileSync(root+'pasted-text-1.txt','utf8');for(const q of lesson.checks)for(const option of q.text.zh.options)assert.ok(raw.includes(option));
 assert.equal(spawnSync('sha256sum',['-c','SHA256SUMS.txt'],{cwd:root}).status,0);
});
test('four specific figure layouts reject changed node counts and relationships',()=>{
 for(const id of ['analogy','sandbox','connection','verification'])for(const change of ['add','remove','kind']){
  const l=structuredClone(lesson);
  for(const lang of ['zh','en']){const b=l.text[lang].sections.find((s:any)=>s.id===id).blocks.find((b:any)=>b.kind==='cards'||b.kind==='flow');if(change==='add')b.items.push({...b.items[0]});else if(change==='remove')b.items.pop();else b.kind=b.kind==='cards'?'flow':'cards';}
  assert.throws(()=>build(l),/invalid tool evidence figure/);
 }
});
test('same-model exports are reproducible',()=>{
 const r=spawnSync('python3',['scripts/aase_m0206_svg.py','--check'],{encoding:'utf8'});assert.equal(r.status,0,r.stdout+r.stderr);
});

test('synthetic requests, responses and log values remain illustrations, with one open acceptance question',()=>{
 for(const lang of ['zh','en']){
  const blocks=lesson.text[lang].sections.flatMap((s:any)=>s.blocks??[]);
  const request=JSON.parse(blocks.find((b:any)=>b.id==='tool-request').code);
  assert.deepEqual(request,{tool:'read_file',arguments:{path:'/project/requirements.md'}});
  assert.deepEqual(JSON.parse(blocks.find((b:any)=>b.id==='tool-response').code),{status:'success',content:'週末最多安排兩個科目'});
  const rpc=JSON.parse(blocks.find((b:any)=>b.id==='mcp-example').code);assert.equal(rpc.method,'tools/call');
  assert.match(blocks.find((b:any)=>b.id==='success-log').code,/Duration: 12 ms/);
  assert.match(blocks.find((b:any)=>b.id==='denied-log').code,/PERMISSION_DENIED/);
  assert.equal(lesson.text[lang].openChecks.length,1);assert.equal(lesson.text[lang].openChecks[0].id,'AASE-M02-C06-Q05');
 }
});
