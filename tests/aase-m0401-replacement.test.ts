import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {createAaseCatalog} from '../src/lib/aase.ts';
const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const root='docs/sources/aase/m04-01/replacement-2026-11-09/';
const lesson=read('content/aase/lessons/aase-m04-c01.json'),before=read(root+'prior-lesson.json');
const build=(l:any)=>createAaseCatalog(read('content/aase/course.json'),[l],read('content/aase/sources.json'),'2026-11-09',read('content/aase/course.en.json'));
test('HCI replacement preserves source, history, anchors, complete manuscripts and same-model exports',()=>{
 assert.equal(lesson.contentVersion,'1.1.0');assert.equal(lesson.revision,before.revision+1);assert.equal(lesson.publishedOn,before.publishedOn);assert.deepEqual(lesson.translations,before.translations);assert.deepEqual(lesson.qa,[]);
 for(const lang of ['zh','en']){
  const t=lesson.text[lang];assert.equal(t.sections.length,9);
  for(const s of before.text[lang].sections)assert.ok(t.sections.some((x:any)=>x.id===s.id));
  const blocks=t.sections.flatMap((s:any)=>s.blocks??[]);
  assert.deepEqual(blocks.filter((b:any)=>b.kind==='flow'||b.kind==='cards').map((b:any)=>b.items.length),[4,3,2]);
  assert.deepEqual(blocks.filter((b:any)=>b.kind==='table').map((b:any)=>b.rows.length),[3,4]);
  assert.equal(t.openChecks.length,3);assert.equal(lesson.checks.length,0);
  const entry=build(lesson).forLanguage(lang as 'zh'|'en')!.searchEntries[0];
  for(const b of blocks)if(b.kind==='prose')for(const p of b.paragraphs)assert.ok(entry.text.includes(p));
 }
 for(const script of [root+'normalize-source.py','scripts/aase_m0401_content.py','scripts/aase_m0401_svg.py']){const r=spawnSync('python3',[script,'--check'],{encoding:'utf8'});assert.equal(r.status,0,r.stdout+r.stderr);}
 assert.equal(spawnSync('sha256sum',['-c','SHA256SUMS.txt'],{cwd:root}).status,0);
});
test('HCI model rejects altered relations, extra nodes and supplied markup',()=>{
 for(const section of ['case','quality'])for(const change of ['kind','extra','markup']){
  const l=structuredClone(lesson);for(const lang of ['zh','en']){const b=l.text[lang].sections.find((s:any)=>s.id===section).blocks.find((b:any)=>b.kind==='cards'||b.kind==='flow');if(change==='kind')b.kind=b.kind==='cards'?'flow':'cards';if(change==='extra')b.items.push({...b.items[0]});if(change==='markup')b.items[0].html='<svg onload="alert(1)"/>';}
  assert.throws(()=>build(l),/invalid HCI perspectives figure/);
 }
 for(const gate of ['draft','future']){
  const l=structuredClone(lesson);if(gate==='draft')l.status='draft';else {l.publishedOn='2099-01-01';l.date='2099-01-01';l.translations.en.publishedOn='2099-01-01';}
  for(const lang of ['zh','en'] as const)assert.equal(build(l).forLanguage(lang)!.searchEntries.length,0);
 }
});
