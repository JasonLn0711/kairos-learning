import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {createAaseCatalog} from '../src/lib/aase.ts';
const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const root='docs/sources/aase/m03-03/replacement-2026-11-11/';
const lesson=read('content/aase/lessons/aase-m03-c03.json'),before=read(root+'prior-lesson.json');
const build=(l:any)=>createAaseCatalog(read('content/aase/course.json'),[l],read('content/aase/sources.json'),'2026-11-11',read('content/aase/course.en.json'));
test('workflow replacement retains history, all task anchors and paired complete content',()=>{
 assert.equal(lesson.contentVersion,'1.1.0');assert.equal(lesson.revision,before.revision+1);assert.equal(lesson.publishedOn,before.publishedOn);assert.deepEqual(lesson.translations,before.translations);assert.equal(lesson.date,'2026-11-11');assert.deepEqual(lesson.qa,before.qa);
 for(const lang of ['zh','en'] as const){
  const t=lesson.text[lang];assert.equal(t.sections.length,12);
  for(const s of before.text[lang].sections)assert.ok(t.sections.some((x:any)=>x.id===s.id),s.id);
  const blocks=t.sections.flatMap((s:any)=>s.blocks??[]);assert.equal(blocks.filter((b:any)=>b.kind==='flow'||b.kind==='cards').length,5);assert.equal(blocks.filter((b:any)=>b.kind==='table').length,5);
  assert.equal(t.openChecks.length,4);assert.ok(t.openChecks[2].prompt.includes('1,500'));assert.ok(t.openChecks[2].prompt.includes('15,000'));
  assert.equal(blocks.find((b:any)=>b.code).code,readFileSync(root+'pasted-text-1.txt','utf8').match(/```\n([\s\S]*?)\n```/)![1]);
 }
 assert.doesNotThrow(()=>build(lesson));assert.equal(lesson.checks.length,0);
 assert.equal(spawnSync('sha256sum',['-c','SHA256SUMS.txt'],{cwd:root}).status,0);
 for(const script of ['scripts/aase_m0303_content.py','scripts/aase_m0303_svg.py']){const r=spawnSync('python3',[script,'--check'],{encoding:'utf8'});assert.equal(r.status,0,r.stdout+r.stderr);}
});
test('workflow layouts reject altered branch counts, parallelism and arbitrary diagram fields',()=>{
 for(const id of ['analogy','flow','stale-result','layers','record'])for(const change of ['add','remove','kind','html']){
  const l=structuredClone(lesson);for(const lang of ['zh','en']){const b=l.text[lang].sections.find((s:any)=>s.id===id).blocks.find((b:any)=>b.kind==='cards'||b.kind==='flow');if(change==='add')b.items.push({...b.items[0]});else if(change==='remove')b.items.pop();else if(change==='kind')b.kind=b.kind==='cards'?'flow':'cards';else b.html='<script>bad()</script>';}
  assert.throws(()=>build(l),/invalid workflow figure/);
 }
 const l=structuredClone(lesson);for(const lang of ['zh','en'])l.text[lang].sections.find((s:any)=>s.id==='walkthrough').blocks.find((b:any)=>b.id==='workflow-walkthrough').id='workflow-unknown';assert.throws(()=>build(l),/invalid workflow exercise/);
 const c=build(lesson);for(const lang of ['zh','en'] as const){const entry=c.forLanguage(lang)!.searchEntries[0];for(const s of lesson.text[lang].sections)for(const b of s.blocks??[])if(b.kind==='cards'||b.kind==='flow')for(const item of b.items){assert.ok(entry.text.includes(item.title));assert.ok(entry.text.includes(item.body));}}
});
