import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {createAaseCatalog} from '../src/lib/aase.ts';
const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const root='docs/sources/aase/m03-04/replacement-2026-11-09/';
const lesson=read('content/aase/lessons/aase-m03-c04.json'),before=read(root+'prior-lesson.json');
const build=(l:any)=>createAaseCatalog(read('content/aase/course.json'),[l],read('content/aase/sources.json'),'2026-11-09',read('content/aase/course.en.json'));
test('MVP scope replacement preserves history, anchors, code and complete bilingual structure',()=>{
 assert.equal(lesson.contentVersion,'1.1.0');assert.equal(lesson.revision,before.revision+1);assert.equal(lesson.publishedOn,before.publishedOn);assert.deepEqual(lesson.translations,before.translations);assert.equal(lesson.date,'2026-11-09');assert.deepEqual(lesson.qa,[]);
 for(const lang of ['zh','en']){
  const t=lesson.text[lang];assert.equal(t.sections.length,11);
  for(const s of before.text[lang].sections)assert.ok(t.sections.some((x:any)=>x.id===s.id));
  assert.equal(t.sections.flatMap((s:any)=>s.blocks??[]).filter((b:any)=>b.kind==='flow'||b.kind==='cards').length,2);

  const code=readFileSync(root+'original.zh.md','utf8').match(/```\n([\s\S]*?)\n```/)![1];
  assert.equal(t.sections.find((s:any)=>s.id==='document').blocks.find((b:any)=>b.code).code,code);
 }
 assert.equal(lesson.checks.length,1);assert.doesNotThrow(()=>build(lesson));
 assert.equal(spawnSync('sha256sum',['-c','SHA256SUMS.txt'],{cwd:root}).status,0);
 for(const script of ['scripts/aase_m0304_content.py','scripts/aase_m0304_svg.py']){const r=spawnSync('python3',[script,'--check'],{encoding:'utf8'});assert.equal(r.status,0,r.stdout+r.stderr);}
});
test('success evidence model rejects changed relationships and unsafe ordered prose',()=>{
 for(const id of ['analogy','workflow'])for(const change of ['add','remove','kind']){
  const l=structuredClone(lesson);
  for(const lang of ['zh','en']){const b=l.text[lang].sections.find((s:any)=>s.id===id).blocks.find((b:any)=>b.kind==='cards'||b.kind==='flow');if(change==='add')b.items.push({...b.items[0]});else if(change==='remove')b.items.pop();else b.kind=b.kind==='cards'?'flow':'cards';}
  assert.throws(()=>build(l),/invalid MVP scope figure/);
 }
 const c=build(lesson);for(const lang of ['zh','en'] as const){const entry=c.forLanguage(lang)!.searchEntries[0];for(const s of lesson.text[lang].sections)for(const b of s.blocks??[])if(b.kind==='prose')for(const p of b.paragraphs)assert.ok(entry.text.includes(p));}
});
