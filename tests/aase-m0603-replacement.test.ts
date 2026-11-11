import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {createAaseCatalog} from '../src/lib/aase.ts';
const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const root='docs/sources/aase/m06-03/replacement-2026-11-11/';
const lesson=read('content/aase/lessons/aase-m06-c03.json'),prior=read(root+'prior-lesson.json');
const build=(l:any)=>createAaseCatalog(read('content/aase/course.json'),[l],read('content/aase/sources.json'),'2026-11-11',read('content/aase/course.en.json'));
test('M06-03 preserves source and publication, four-level teaching and seven diagram relationships',()=>{
 assert.equal(lesson.contentVersion,'1.1.0');assert.equal(lesson.revision,prior.revision+1);assert.equal(lesson.publishedOn,prior.publishedOn);assert.deepEqual(lesson.translations,prior.translations);assert.deepEqual(lesson.qa,[]);
 assert.deepEqual(lesson.checks.map((q:any)=>q.answer),[1,2,1]);
 for(const lang of ['zh','en'] as const){
  const t=lesson.text[lang],blocks=t.sections.flatMap((s:any)=>s.blocks??[]);
  const anchors=[...t.sections.map((s:any)=>s.id),...blocks.map((b:any)=>b.id)];
  for(const s of prior.text[lang].sections)assert.ok(anchors.includes(s.id),s.id);
  assert.deepEqual(blocks.filter((b:any)=>b.kind==='cards').map((b:any)=>b.items.length),[4,4,3,5,4,6,4]);
  assert.deepEqual(blocks.filter((b:any)=>b.kind==='table').map((b:any)=>b.rows.length),[4,6,3,5]);
  assert.equal(lesson.checks.length,3);for(const q of lesson.checks)assert.equal(q.text[lang].options.length,3);
  const entry=build(lesson).forLanguage(lang)!.searchEntries[0];
  for(const b of blocks){if(b.kind==='prose'||b.kind==='step')for(const p of b.paragraphs)assert.ok(entry.text.includes(p));if(b.kind==='cards')for(const item of b.items)assert.ok(entry.text.includes(item.body));}
  const code=blocks.find((b:any)=>b.id==='restaurant-code').code;
  const run=spawnSync('python3',['-c',code],{encoding:'utf8'});assert.equal(run.status,0,run.stderr);assert.equal(run.stdout,'PASS\n');
 }
 assert.match(JSON.stringify(lesson.text.zh),/沒有自行實作的 REST API/);
 assert.match(JSON.stringify(lesson.text.en),/server crash also clears/);
 const r=spawnSync('python3',['scripts/aase_m0603_svg.py','--check'],{encoding:'utf8'});assert.equal(r.status,0,r.stdout+r.stderr);
 assert.equal(spawnSync('sha256sum',['-c','SHA256SUMS'],{cwd:root}).status,0);
});
test('M06-03 rejects misleading sequence, extra nodes and arbitrary markup; publication gates stay closed',()=>{
 for(const change of ['extra','flow','markup']){
  const l=structuredClone(lesson);for(const lang of ['zh','en']){const b=l.text[lang].sections.find((s:any)=>s.id==='containers').blocks.find((b:any)=>b.kind==='cards');if(change==='extra')b.items.push({...b.items[0]});if(change==='flow')b.kind='flow';if(change==='markup')b.items[0].html='<svg onload="alert(1)"/>';}
  assert.throws(()=>build(l),/invalid C4 views figure/);
 }
 for(const state of ['draft','future']){const l=structuredClone(lesson);if(state==='draft')l.status='draft';else{l.publishedOn=l.date=l.translations.en.publishedOn='2099-01-01';}for(const lang of ['zh','en'] as const)assert.equal(build(l).forLanguage(lang)!.searchEntries.length,0);}
});
