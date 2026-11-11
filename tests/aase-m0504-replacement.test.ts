import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {createAaseCatalog} from '../src/lib/aase.ts';
const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const root='docs/sources/aase/m05-04/replacement-2026-11-11/';
const lesson=read('content/aase/lessons/aase-m05-c04.json');
const before=read(root+'previous/lesson.json');
const build=(l:any)=>createAaseCatalog(read('content/aase/course.json'),[l],read('content/aase/sources.json'),'2026-11-11',read('content/aase/course.en.json'));
test('SDD retains anchors, source, candidate boundary and complete bilingual teaching',()=>{
 assert.equal(lesson.revision,before.revision+1);assert.equal(lesson.publishedOn,before.publishedOn);assert.deepEqual(lesson.translations,before.translations);assert.deepEqual(lesson.checks,before.checks);assert.deepEqual(lesson.qa,[]);
 for(const lang of ['zh','en'] as const){
  const t=lesson.text[lang];for(const s of before.text[lang].sections)assert.ok(t.sections.some((x:any)=>x.id===s.id));
  const blocks=t.sections.flatMap((s:any)=>s.blocks??[]);
  assert.deepEqual(blocks.filter((b:any)=>b.kind==='table').map((b:any)=>b.rows.length),[6,5]);
  assert.equal(blocks.filter((b:any)=>b.kind==='step').length,3);assert.equal(t.openChecks.length,3);
  const f=blocks.find((b:any)=>b.kind==='flow');assert.equal(f.items.length,5);
  const search=build(lesson).forLanguage(lang)!.searchEntries[0].text;for(const item of f.items){assert.ok(search.includes(item.title));assert.ok(search.includes(item.body));}
 }
 assert.equal(spawnSync('python3',['scripts/aase_m0504_svg.py','--check']).status,0);
 assert.equal(spawnSync('sha256sum',['-c',root+'SHA256SUMS']).status,0);
});
test('SDD rejects changed relation, extra node and raw markup; publication gates stay closed',()=>{
 for(const mutation of ['kind','extra','markup']){const l=structuredClone(lesson);for(const lang of ['zh','en']){const b=l.text[lang].sections.find((s:any)=>s.id==='loop').blocks[0];if(mutation==='kind')b.kind='cards';if(mutation==='extra')b.items.push({...b.items[0]});if(mutation==='markup')b.items[0].html='<svg/>'; }assert.throws(()=>build(l),/invalid SDD change figure/);}
 for(const mode of ['draft','future']){const l=structuredClone(lesson);if(mode==='draft')l.status='draft';else{l.publishedOn='2099-01-01';l.date='2099-01-01';l.translations.en.publishedOn='2099-01-01';}for(const lang of ['zh','en'] as const)assert.equal(build(l).forLanguage(lang)!.searchEntries.length,0);}
});
