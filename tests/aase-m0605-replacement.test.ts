import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {createAaseCatalog} from '../src/lib/aase.ts';
const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const root='docs/sources/aase/m06-05/replacement-2026-11-11/';
const lesson=read('content/aase/lessons/aase-m06-c05.json'),prior=read(root+'prior-lesson.json');
const build=(l:any)=>createAaseCatalog(read('content/aase/course.json'),[l],read('content/aase/sources.json'),'2026-11-11',read('content/aase/course.en.json'));
test('M06-05 preserves source, complete bilingual teaching, prior anchors and question identities',()=>{
 assert.equal(lesson.contentVersion,'1.1.0');assert.equal(lesson.revision,prior.revision+1);assert.equal(lesson.publishedOn,prior.publishedOn);assert.deepEqual(lesson.translations,prior.translations);assert.deepEqual(lesson.qa,[]);
 for(const lang of ['zh','en'] as const){
  const t=lesson.text[lang],blocks=t.sections.flatMap((s:any)=>s.blocks??[]);
  for(const s of prior.text[lang].sections)assert.ok(t.sections.some((n:any)=>n.id===s.id),s.id);
  assert.equal(t.sections.length,9);
  assert.deepEqual(blocks.filter((b:any)=>b.kind==='cards').map((b:any)=>b.items.length),[4,6,3]);
  assert.deepEqual(blocks.filter((b:any)=>b.kind==='table').map((b:any)=>b.rows.length),[3,5,3,5,5,4]);
  assert.equal(blocks.filter((b:any)=>b.kind==='step'&&b.id).length,5);
  const entry=build(lesson).forLanguage(lang)!.searchEntries[0];
  for(const s of t.sections)for(const p of s.paragraphs)assert.ok(entry.text.includes(p));
  for(const b of blocks){if(b.kind==='prose')for(const p of b.paragraphs)assert.ok(entry.text.includes(p));if(b.kind==='cards')for(const item of b.items)assert.ok(entry.text.includes(item.body));}
 }
 assert.deepEqual(lesson.checks.map((q:any)=>[q.id,q.answer]),[['AASE-M06-C05-Q04',1],['AASE-M06-C05-Q05',1],['AASE-M06-C05-Q06',2]]);
 for(const script of ['scripts/aase_m0605_content.py','scripts/aase_m0605_svg.py']){const r=spawnSync('python3',[script,'--check'],{encoding:'utf8'});assert.equal(r.status,0,r.stdout+r.stderr);}
 assert.equal(spawnSync('sha256sum',['-c','SHA256SUMS'],{cwd:root}).status,0);
});
test('M06-05 rejects altered figure structure and retains publication gates',()=>{
 for(const mutation of ['extra','flow','markup']){
  const l=structuredClone(lesson);for(const lang of ['zh','en']){const b=l.text[lang].sections.find((s:any)=>s.id==='controls').blocks.find((b:any)=>b.kind==='cards');if(mutation==='extra')b.items.push({...b.items[0]});if(mutation==='flow')b.kind='flow';if(mutation==='markup')b.items[0].html='<svg onload="alert(1)"/>';}
  assert.throws(()=>build(l),/invalid session access figure/);
 }
 for(const state of ['draft','future']){const l=structuredClone(lesson);if(state==='draft')l.status='draft';else{l.publishedOn=l.date=l.translations.en.publishedOn='2099-01-01';}for(const lang of ['zh','en'] as const)assert.equal(build(l).forLanguage(lang)!.searchEntries.length,0);}
});
