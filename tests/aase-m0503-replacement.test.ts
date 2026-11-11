import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {createAaseCatalog} from '../src/lib/aase.ts';
const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const root='docs/sources/aase/m05-03/replacement-2026-11-11/';
const lesson=read('content/aase/lessons/aase-m05-c03.json'),before=read(root+'prior-lesson.json');
const build=(l:any)=>createAaseCatalog(read('content/aase/course.json'),[l],read('content/aase/sources.json'),'2026-11-11',read('content/aase/course.en.json'));
test('acceptance replacement retains history, three figures, complete scenario code and both checks',()=>{
 assert.equal(lesson.contentVersion,'1.1.0');assert.equal(lesson.revision,before.revision+1);assert.equal(lesson.publishedOn,before.publishedOn);assert.deepEqual(lesson.translations,before.translations);assert.deepEqual(lesson.qa,[]);
 const original=readFileSync(root+'original.zh.md','utf8');
 for(const lang of ['zh','en'] as const){
  const t=lesson.text[lang],blocks=t.sections.flatMap((s:any)=>s.blocks??[]);
  for(const s of before.text[lang].sections)assert.ok(t.sections.some((x:any)=>x.id===s.id)||blocks.some((b:any)=>b.id===s.id));
  assert.equal(t.sections.length,8);
  assert.deepEqual(blocks.filter((b:any)=>b.kind==='flow'||b.kind==='cards').map((b:any)=>[b.kind,b.items.length]),[['flow',3],['cards',4],['flow',5]]);
  assert.deepEqual(blocks.filter((b:any)=>b.kind==='table').map((b:any)=>b.rows.length),[3,6,6]);
  assert.deepEqual(blocks.filter((b:any)=>b.code).map((b:any)=>b.code),[...original.matchAll(/```\n(.*?)\n```/gs)].map(m=>m[1]));
  assert.equal(t.openChecks.length,1);assert.equal(lesson.checks.length,1);assert.equal(lesson.checks[0].answer,0);
  const entry=build(lesson).forLanguage(lang)!.searchEntries[0];
  for(const b of blocks)if(b.kind==='prose')for(const p of b.paragraphs)assert.ok(entry.text.includes(p));
 }
 for(const script of ['scripts/aase_m0503_content.py','scripts/aase_m0503_svg.py']){const r=spawnSync('python3',[script,'--check'],{encoding:'utf8'});assert.equal(r.status,0,r.stdout+r.stderr);}
 assert.equal(spawnSync('sha256sum',['-c','SHA256SUMS'],{cwd:root}).status,0);
});
test('acceptance model rejects false sequence, missing or extra nodes and arbitrary fields; gates exclude unpublished text',()=>{
 for(const section of ['mechanism','examples','tests'])for(const change of ['kind','extra','missing','markup']){
  const l=structuredClone(lesson);for(const lang of ['zh','en']){const b=l.text[lang].sections.find((s:any)=>s.id===section).blocks.find((b:any)=>b.kind==='cards'||b.kind==='flow');if(change==='kind')b.kind=b.kind==='cards'?'flow':'cards';if(change==='extra')b.items.push({...b.items[0]});if(change==='missing')b.items.pop();if(change==='markup')b.items[0].html='<svg onload="alert(1)"/>';}
  assert.throws(()=>build(l),/invalid acceptance figure/);
 }
 for(const gate of ['draft','future']){
  const l=structuredClone(lesson);if(gate==='draft')l.status='draft';else {l.publishedOn='2099-01-01';l.date='2099-01-01';l.translations.en.publishedOn='2099-01-01';}
  for(const lang of ['zh','en'] as const)assert.equal(build(l).forLanguage(lang)!.searchEntries.length,0);
 }
});
