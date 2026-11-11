import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {createAaseCatalog} from '../src/lib/aase.ts';
const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const root='docs/sources/aase/m04-05/replacement-2026-11-11/';
const lesson=read('content/aase/lessons/aase-m04-c05.json'),before=read(root+'previous/aase-m04-c05.json');
const build=(l:any)=>createAaseCatalog(read('content/aase/course.json'),[l],read('content/aase/sources.json'),'2026-11-11',read('content/aase/course.en.json'));
test('M04-05 preserves history, complete manuscripts, table cells, figures, answers and search text',()=>{
 assert.equal(lesson.contentVersion,'1.1.0');assert.equal(lesson.revision,before.revision+1);assert.equal(lesson.publishedOn,before.publishedOn);assert.deepEqual(lesson.translations,before.translations);assert.deepEqual(lesson.qa,[]);assert.deepEqual(lesson.checks,[]);
 for(const lang of ['zh','en'] as const){
  const t=lesson.text[lang];assert.equal(t.sections.length,11);
  for(const s of before.text[lang].sections)assert.ok(t.sections.some((x:any)=>x.id===s.id));
  const blocks=t.sections.flatMap((s:any)=>s.blocks??[]);
  assert.deepEqual(blocks.filter((b:any)=>b.kind==='cards').map((b:any)=>b.items.length),[2,3,2,3,4,4]);
  assert.deepEqual(blocks.filter((b:any)=>b.kind==='table').map((b:any)=>b.rows.length),[4,6,4,5]);
  assert.equal(t.openChecks.length,3);
  const entry=build(lesson).forLanguage(lang)!.searchEntries[0];
  for(const s of t.sections){for(const p of s.paragraphs)assert.ok(entry.text.includes(p));for(const b of s.blocks??[])for(const value of b.kind==='prose'?b.paragraphs:b.kind==='cards'?[b.caption,b.description,...b.items.flatMap((i:any)=>[i.title,i.body])]:b.kind==='table'?[b.caption,...b.headers,...b.rows.flat()]:[b.heading,...b.paragraphs,b.code])assert.ok(entry.text.includes(value));}
  for(const q of t.openChecks){assert.ok(entry.text.includes(q.prompt));assert.ok(entry.text.includes(q.answer[0]));}
 }
 for(const script of ['scripts/aase_m0405_content.py','scripts/aase_m0405_svg.py']){const r=spawnSync('python3',[script,'--check'],{encoding:'utf8'});assert.equal(r.status,0,r.stdout+r.stderr);}
 assert.equal(spawnSync('sha256sum',['-c','SHA256SUMS'],{cwd:root}).status,0);
});
test('M04-05 rejects extra nodes, flows, unknown markup and bilingual drift; keeps publication gates',()=>{
 for(const section of ['analogy','states','changes'])for(const mutation of ['extra','kind','markup']){
  const l=structuredClone(lesson);for(const lang of ['zh','en']){const f=l.text[lang].sections.find((s:any)=>s.id===section).blocks.find((b:any)=>b.kind==='cards');if(mutation==='extra')f.items.push({...f.items[0]});if(mutation==='kind')f.kind='flow';if(mutation==='markup')f.items[0].html='<svg onload="alert(1)"/>';}
  assert.throws(()=>build(l),/invalid disclosure states figure/);
 }
 const drift=structuredClone(lesson);drift.text.en.sections[0].paragraphs.pop();assert.throws(()=>build(drift),/English teaching structure differs/);
 for(const gate of ['draft','future','translation']){
  const l=structuredClone(lesson);if(gate==='draft')l.status='draft';else if(gate==='future')l.publishedOn=l.date=l.translations.en.publishedOn='2099-01-01';else l.translations.en.status='draft';
  const c=build(l);assert.equal(c.forLanguage('en')!.searchEntries.length,0);assert.equal(c.forLanguage('zh')!.searchEntries.length,gate==='translation'?1:0);
 }
});
