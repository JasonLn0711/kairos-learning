import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {createAaseCatalog} from '../src/lib/aase.ts';
const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const root='docs/sources/aase/m07-03/replacement-2026-11-11/';
const lesson=read('content/aase/lessons/aase-m07-c03.json'),prior=read(root+'previous-lesson.json');
const catalog=(l:any)=>createAaseCatalog(read('content/aase/course.json'),[l],read('content/aase/sources.json'),'2026-11-11',read('content/aase/course.en.json'));
test('M07-03 preserves history, eight bilingual sections, full tables, runnable code and original questions',()=>{
 assert.equal(lesson.revision,prior.revision+1);assert.equal(lesson.publishedOn,prior.publishedOn);assert.deepEqual(lesson.translations,prior.translations);assert.deepEqual(lesson.checks,prior.checks);assert.deepEqual(lesson.qa,[]);
 for(const lang of ['zh','en'] as const){
  const t=lesson.text[lang];assert.equal(t.sections.length,8);for(const s of prior.text[lang].sections)assert.ok(t.sections.some((x:any)=>x.id===s.id));
  const blocks=t.sections.flatMap((s:any)=>s.blocks??[]);
  assert.deepEqual(blocks.filter((b:any)=>b.kind==='table').map((b:any)=>b.rows.length),[5,6,7]);
  assert.deepEqual(blocks.filter((b:any)=>b.kind==='cards'||b.kind==='flow').map((b:any)=>[b.kind,b.items.length]),[['cards',4],['cards',3],['flow',4]]);
  assert.equal(t.openChecks.length,3);
  assert.equal(blocks.find((b:any)=>b.kind==='step').code,readFileSync(root+'app.py','utf8'));
  const entry=catalog(lesson).forLanguage(lang)!.searchEntries[0];for(const b of blocks)if(b.kind==='cards'||b.kind==='flow')for(const i of b.items){assert.ok(entry.text.includes(i.title));assert.ok(entry.text.includes(i.body));}
 }
 assert.equal(spawnSync('python3',['scripts/aase_m0703_svg.py','--check']).status,0);
 const checks=spawnSync('sha256sum',['-c','SHA256SUMS'],{cwd:root});assert.equal(checks.status,0,checks.stdout.toString());
});
test('M07-03 rejects false figure relations, extra nodes and markup; draft and future stay closed',()=>{
 for(const mode of ['kind','count','markup']){const l=structuredClone(lesson);for(const lang of ['zh','en']){const b=l.text[lang].sections[0].blocks[0];if(mode==='kind')b.kind='flow';if(mode==='count')b.items.push({...b.items[0]});if(mode==='markup')b.items[0].html='<svg/>'; }assert.throws(()=>catalog(l),/invalid vertical slice figure/);}
 for(const mode of ['layers','defaults']){const l=structuredClone(lesson);for(const lang of ['zh','en']){const section=l.text[lang].sections.find((s:any)=>s.id===(mode==='layers'?'slice':'behavior'));section.blocks[0].items[0].body='changed';}assert.throws(()=>catalog(l),/invalid vertical slice (layers|defaults)/);}
 for(const mode of ['draft','future']){const l=structuredClone(lesson);if(mode==='draft')l.status='draft';else{l.publishedOn=l.date=l.translations.en.publishedOn='2099-01-01';}for(const lang of ['zh','en'] as const)assert.equal(catalog(l).forLanguage(lang)!.searchEntries.length,0);}
});
