import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {createAaseCatalog} from '../src/lib/aase.ts';
const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const root='docs/sources/aase/m08-04/replacement-2026-11-11/';
const lesson=read('content/aase/lessons/aase-m08-c04.json');
const before=read(root+'previous-lesson.json');
const build=(l:any)=>createAaseCatalog(read('content/aase/course.json'),[l],read('content/aase/sources.json'),'2026-11-11',read('content/aase/course.en.json'));
test('AppTest replacement preserves source, identity, complete bilingual examples and same-source figures',()=>{
 assert.equal(lesson.revision,before.revision+2);assert.equal(lesson.contentVersion,'1.1.1');assert.equal(lesson.publishedOn,before.publishedOn);assert.deepEqual(lesson.translations,before.translations);assert.deepEqual(lesson.qa,[]);
 assert.deepEqual(lesson.checks.map((q:any)=>q.id),['AASE-M08-C04-Q01','AASE-M08-C04-Q03','AASE-M08-C04-Q02']);assert.deepEqual(lesson.checks.map((q:any)=>q.answer),[1,2,3]);
 for(const lang of ['zh','en'] as const){
  const t=lesson.text[lang];assert.equal(t.sections.length,10);const blocks=t.sections.flatMap((s:any)=>s.blocks??[]);
  for(const s of before.text[lang].sections)assert.ok(t.sections.some((x:any)=>x.id===s.id)||blocks.some((b:any)=>b.id===s.id),`preserved #${s.id}`);
  assert.deepEqual(blocks.filter((b:any)=>b.kind==='table').map((b:any)=>b.rows.length),[5,6,5,4]);
  const figures=blocks.filter((b:any)=>['cards','flow'].includes(b.kind));assert.deepEqual(figures.map((f:any)=>[f.kind,f.items.length]),[['flow',3],['flow',3],['cards',5]]);
  const code=blocks.filter((b:any)=>b.kind==='step');assert.equal(code.length,5);
  for(const filename of ['app.py','tests/test_app.py'])assert.equal(code.find((b:any)=>b.heading===filename).code,readFileSync('resources/aase/examples/m08-04/'+filename,'utf8').trimEnd());
  const search=build(lesson).forLanguage(lang)!.searchEntries[0].text;for(const f of figures)for(const item of f.items){assert.ok(search.includes(item.title));assert.ok(search.includes(item.body));}
 }
 for(const script of ['content','svg'])assert.equal(spawnSync('python3',[`scripts/aase_m0804_${script}.py`,'--check']).status,0);
 assert.equal(spawnSync('sha256sum',['-c','SHA256SUMS'],{cwd:root}).status,0);
});
test('AppTest rejects wrong figure relations, extra fields and nodes, and retains publication gates',()=>{
 for(const mutation of ['kind','extra','markup','move']){
  const l=structuredClone(lesson);
  for(const lang of ['zh','en']){const sections=l.text[lang].sections;const s=sections.find((s:any)=>s.id==='syntax');const b=s.blocks.find((b:any)=>b.kind==='cards');if(mutation==='kind')b.kind='flow';if(mutation==='extra')b.items.push({...b.items[0]});if(mutation==='markup')b.items[0].html='<svg onload="alert(1)"/>';if(mutation==='move'){s.blocks=s.blocks.filter((v:any)=>v!==b);sections.find((v:any)=>v.id==='industry').blocks=[b];}}
  assert.throws(()=>build(l),/invalid AppTest figure/);
 }
 for(const mode of ['draft','future']){const l=structuredClone(lesson);if(mode==='draft')l.status='draft';else{l.publishedOn='2099-01-01';l.date='2099-01-01';l.translations.en.publishedOn='2099-01-01';}for(const lang of ['zh','en'] as const)assert.equal(build(l).forLanguage(lang)!.searchEntries.length,0);}
 const l=structuredClone(lesson);l.translations.en.status='draft';assert.equal(build(l).forLanguage('en')!.searchEntries.length,0);assert.equal(build(l).forLanguage('zh')!.searchEntries.length,1);
});
