import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {createAaseCatalog} from '../src/lib/aase.ts';
const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const root='docs/sources/aase/m04-06/replacement-2026-11-11/';
const lesson=read('content/aase/lessons/aase-m04-c06.json'),prior=read(root+'prior-lesson.json');
const build=(l:any)=>createAaseCatalog(read('content/aase/course.json'),[l],read('content/aase/sources.json'),'2026-11-11',read('content/aase/course.en.json'));
test('M04-06 retains source, original publication and anchors, full bilingual body and five figures',()=>{
 assert.equal(lesson.contentVersion,'1.1.0');assert.equal(lesson.revision,prior.revision+1);assert.equal(lesson.publishedOn,prior.publishedOn);assert.deepEqual(lesson.translations,prior.translations);assert.deepEqual(lesson.qa,[]);
 for(const lang of ['zh','en'] as const){
  const t=lesson.text[lang],blocks=t.sections.flatMap((s:any)=>s.blocks??[]);
  const anchors=[...t.sections.map((s:any)=>s.id),...blocks.map((b:any)=>b.id)];
  for(const s of prior.text[lang].sections)assert.ok(anchors.includes(s.id),s.id);
  assert.deepEqual(blocks.filter((b:any)=>b.kind==='cards').map((b:any)=>b.items.length),[2,2,3,7,5]);
  assert.deepEqual(blocks.filter((b:any)=>b.kind==='table').map((b:any)=>b.rows.length),[3,5,4,5]);
  assert.equal(t.openChecks.length,3);assert.equal(lesson.checks.length,0);
  const entry=build(lesson).forLanguage(lang)!.searchEntries[0];
  for(const b of blocks){if(b.kind==='prose')for(const p of b.paragraphs)assert.ok(entry.text.includes(p));if(b.kind==='cards')for(const item of b.items)assert.ok(entry.text.includes(item.body));}
 }
 assert.match(JSON.stringify(lesson.text.zh),/25 分鐘/);assert.match(JSON.stringify(lesson.text.en),/80,000 to 50,000/);
 for(const script of [root+'audit-source.py','scripts/aase_m0406_content.py','scripts/aase_m0406_svg.py']){const r=spawnSync('python3',[script,'--check'],{encoding:'utf8'});assert.equal(r.status,0,r.stdout+r.stderr);}
 assert.equal(spawnSync('sha256sum',['-c','SHA256SUMS'],{cwd:root}).status,0);
});
test('M04-06 rejects extra nodes, misleading flow and unreviewed markup',()=>{
 for(const change of ['extra','flow','markup']){
  const l=structuredClone(lesson);for(const lang of ['zh','en']){const b=l.text[lang].sections.find((s:any)=>s.id==='state-transitions').blocks.find((b:any)=>b.kind==='cards');if(change==='extra')b.items.push({...b.items[0]});if(change==='flow')b.kind='flow';if(change==='markup')b.items[0].html='<svg onload="alert(1)"/>';}
  assert.throws(()=>build(l),/invalid recovery figure/);
 }
 for(const state of ['draft','future']){const l=structuredClone(lesson);if(state==='draft')l.status='draft';else{l.publishedOn=l.date=l.translations.en.publishedOn='2099-01-01';}for(const lang of ['zh','en'] as const)assert.equal(build(l).forLanguage(lang)!.searchEntries.length,0);}
});
