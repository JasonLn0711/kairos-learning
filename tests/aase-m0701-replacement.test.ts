import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {createAaseCatalog} from '../src/lib/aase.ts';
const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const root='docs/sources/aase/m07-01/replacement-2026-11-11/';
const lesson=read('content/aase/lessons/aase-m07-c01.json'),before=read(root+'previous-lesson.json');
const build=(l:any)=>createAaseCatalog(read('content/aase/course.json'),[l],read('content/aase/sources.json'),'2026-11-11',read('content/aase/course.en.json'));
test('M07-01 retains source, original commands, stable anchors, bilingual depth and publication gates',()=>{
 assert.equal(lesson.contentVersion,'1.1.0');assert.equal(lesson.revision,before.revision+1);assert.equal(lesson.publishedOn,before.publishedOn);assert.deepEqual(lesson.translations,before.translations);assert.deepEqual(lesson.qa,[]);
 const raw=readFileSync(root+'pasted-text-1.txt','utf8');
 const originalCode=[...raw.matchAll(/```[^\n]*\n([\s\S]*?)```/g)].map(m=>m[1].trim());
 for(const lang of ['zh','en']){
  const t=lesson.text[lang];assert.equal(t.sections.length,9);
  const blocks=t.sections.flatMap((s:any)=>s.blocks??[]);
  for(const old of before.text[lang].sections)assert.ok(t.sections.some((s:any)=>s.id===old.id)||blocks.some((b:any)=>b.id===old.id),old.id);
  const figures=blocks.filter((b:any)=>b.kind==='cards'||b.kind==='flow');assert.deepEqual(figures.map((b:any)=>b.items.length),[8,3,5,2]);assert.deepEqual(figures.map((b:any)=>b.kind),['cards','cards','flow','cards']);
  assert.equal(blocks.filter((b:any)=>b.kind==='table').length,4);assert.equal(t.openChecks.length,3);
  const code=blocks.map((b:any)=>b.code??'').concat(figures[3].items.map((i:any)=>i.body));
  for(const original of originalCode)assert.ok(code.includes(original),'missing original code: '+original.slice(0,60));
  const catalog=build(lesson).forLanguage(lang as 'zh'|'en')!;
  for(const s of t.sections){for(const p of s.paragraphs)assert.ok(catalog.searchEntries[0].text.includes(p));for(const b of s.blocks??[])if(b.kind==='prose')for(const p of b.paragraphs)assert.ok(catalog.searchEntries[0].text.includes(p));}
 }
 for(const status of ['draft','future']){const l=structuredClone(lesson);if(status==='draft')l.status='draft';else l.publishedOn='2099-01-01',l.date='2099-01-01',l.translations.en.publishedOn='2099-01-01';assert.equal(build(l).forLanguage('zh')!.searchEntries.length,0);}
 assert.equal(spawnSync('sha256sum',['-c','SHA256SUMS'],{cwd:root}).status,0);
 for(const script of ['scripts/aase_m0701_content.py','scripts/aase_m0701_svg.py']){const r=spawnSync('python3',[script,'--check'],{encoding:'utf8'});assert.equal(r.status,0,r.stdout+r.stderr);}
});
test('environment figure contract rejects changed parallelism, node counts and arbitrary markup',()=>{
 for(const id of ['analogy','layers','commands'])for(const change of ['add','kind','markup']){
  const l=structuredClone(lesson);for(const lang of ['zh','en']){const f=l.text[lang].sections.find((s:any)=>s.id===id).blocks.find((b:any)=>b.kind==='cards'||b.kind==='flow');if(change==='add')f.items.push({...f.items[0]});else if(change==='kind')f.kind=f.kind==='cards'?'flow':'cards';else f.items[0].html='<script/>';}
  assert.throws(()=>build(l),/invalid environment setup figure/);
 }
});
