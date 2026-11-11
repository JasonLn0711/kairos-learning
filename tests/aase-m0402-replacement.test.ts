import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {createAaseCatalog} from '../src/lib/aase.ts';
const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const root='docs/sources/aase/m04-02/replacement-2026-11-11/';
const lesson=read('content/aase/lessons/aase-m04-c02.json'),prior=read(root+'prior-lesson.json');
const build=(l:any)=>createAaseCatalog(read('content/aase/course.json'),[l],read('content/aase/sources.json'),'2026-11-11',read('content/aase/course.en.json'));
test('task analysis preserves history, full manuscripts, five diagrams, template and evidence boundaries',()=>{
 assert.equal(lesson.contentVersion,'1.1.0');assert.equal(lesson.revision,prior.revision+1);assert.equal(lesson.publishedOn,prior.publishedOn);assert.deepEqual(lesson.translations,prior.translations);assert.deepEqual(lesson.qa,[]);
 for(const lang of ['zh','en'] as const){
  const t=lesson.text[lang];assert.equal(t.sections.length,10);assert.equal(t.openChecks.length,3);
  for(const s of prior.text[lang].sections)assert.ok(t.sections.some((x:any)=>x.id===s.id));
  const blocks=t.sections.flatMap((s:any)=>s.blocks??[]);assert.deepEqual(blocks.filter((b:any)=>['cards','flow'].includes(b.kind)).map((b:any)=>b.items.length),[6,6,5,5,3]);
  assert.deepEqual(blocks.filter((b:any)=>b.kind==='table').map((b:any)=>b.rows.length),[6,5,2,5,5]);
  const entry=build(lesson).forLanguage(lang)!.searchEntries[0];for(const b of blocks)if(b.kind==='prose')for(const p of b.paragraphs)assert.ok(entry.text.includes(p));
 }
 for(const script of [root+'normalize-source.py','scripts/aase_m0402_content.py','scripts/aase_m0402_svg.py']){const r=spawnSync('python3',[script,'--check'],{encoding:'utf8'});assert.equal(r.status,0,r.stdout+r.stderr);}
 assert.equal(spawnSync('sha256sum',['-c','SHA256SUMS.txt'],{cwd:root}).status,0);
});
test('task analysis rejects altered diagram shapes and preserves publication gates',()=>{
 for(const id of ['goal','plans','methods','walkthrough'])for(const change of ['kind','extra']){
  const l=structuredClone(lesson);for(const lang of ['zh','en']){const b=l.text[lang].sections.find((s:any)=>s.id===id).blocks.find((b:any)=>b.kind==='cards'||b.kind==='flow');if(change==='kind')b.kind=b.kind==='cards'?'flow':'cards';else b.items.push({...b.items[0]});}assert.throws(()=>build(l),/invalid task analysis figure/);
 }
 for(const state of ['draft','future']){const l=structuredClone(lesson);if(state==='draft')l.status='draft';else{l.publishedOn=l.date=l.translations.en.publishedOn='2099-01-01';}for(const lang of ['zh','en']as const)assert.equal(build(l).forLanguage(lang)!.searchEntries.length,0);}
});
