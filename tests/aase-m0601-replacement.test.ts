import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {createAaseCatalog} from '../src/lib/aase.ts';
const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const root='docs/sources/aase/m06-01/replacement-2026-11-11/';
const lesson=read('content/aase/lessons/aase-m06-c01.json'),before=read(root+'prior-lesson.json');
const build=(l:any)=>createAaseCatalog(read('content/aase/course.json'),[l],read('content/aase/sources.json'),'2026-11-11',read('content/aase/course.en.json'));
test('M06-01 replacement preserves originals, anchors, paired depth, examples, questions and generated exports',()=>{
 assert.equal(lesson.revision,before.revision+1);assert.equal(lesson.contentVersion,'1.1.0');assert.equal(lesson.publishedOn,before.publishedOn);assert.deepEqual(lesson.translations,before.translations);assert.deepEqual(lesson.qa,[]);
 for(const lang of ['zh','en']as const){
  const t=lesson.text[lang];assert.equal(t.sections.length,9);
  for(const s of before.text[lang].sections)assert.ok(t.sections.some((x:any)=>x.id===s.id));
  const blocks=t.sections.flatMap((s:any)=>s.blocks??[]);
  assert.deepEqual(blocks.filter((b:any)=>['flow','cards'].includes(b.kind)).map((b:any)=>b.items.length),[5,5,7,6,4]);
  assert.deepEqual(blocks.filter((b:any)=>b.kind==='table').map((b:any)=>b.rows.length),[6,5,5]);
  assert.equal(blocks.filter((b:any)=>b.code).length,2);
  assert.equal(lesson.checks.length,3);assert.ok(lesson.checks.every((q:any)=>q.answer===1&&q.text[lang].options.length===3));
  const entry=build(lesson).forLanguage(lang)!.searchEntries[0];
  for(const b of blocks)if(b.kind==='prose')for(const p of b.paragraphs)assert.ok(entry.text.includes(p));
 }
 for(const script of ['scripts/verify-aase-m0601-source.py','scripts/aase_m0601_content.py','scripts/aase_m0601_svg.py']){const r=spawnSync('python3',[script,'--check'],{encoding:'utf8'});assert.equal(r.status,0,r.stdout+r.stderr);}
 assert.equal(spawnSync('sha256sum',['-c','SHA256SUMS'],{cwd:root}).status,0);
 const blocks=lesson.text.zh.sections.flatMap((s:any)=>s.blocks??[]),codes=blocks.filter((b:any)=>b.code).map((b:any)=>b.code);
 const dir=mkdtempSync(join(tmpdir(),'m0601-example-'));try{writeFileSync(join(dir,'rules.py'),codes[0]);writeFileSync(join(dir,'app.py'),codes[1]);const run=spawnSync('python3',['app.py'],{cwd:dir,encoding:'utf8'});assert.equal(run.status,0,run.stderr);assert.equal(run.stdout.trim(),'True');}finally{rmSync(dir,{recursive:true});}
});
test('M06-01 rejects shape changes and arbitrary fields; draft and future gates remain closed',()=>{
 for(const section of ['analogy','runtime','c4'])for(const change of ['kind','extra','markup']){
  const l=structuredClone(lesson);for(const lang of ['zh','en']){const f=l.text[lang].sections.find((s:any)=>s.id===section).blocks.find((b:any)=>['cards','flow'].includes(b.kind));if(change==='kind')f.kind=f.kind==='flow'?'cards':'flow';if(change==='extra')f.items.push({...f.items[0]});if(change==='markup')f.items[0].html='<svg onload="alert(1)"/>';}
  assert.throws(()=>build(l),/invalid flow architecture figure/);
 }
 for(const gate of ['draft','future']){const l=structuredClone(lesson);if(gate==='draft')l.status='draft';else{l.date='2099-01-01';l.publishedOn='2099-01-01';l.translations.en.publishedOn='2099-01-01';}for(const lang of ['zh','en']as const)assert.equal(build(l).forLanguage(lang)!.searchEntries.length,0);}
});
