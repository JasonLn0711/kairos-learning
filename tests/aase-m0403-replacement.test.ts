import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {createAaseCatalog} from '../src/lib/aase.ts';
import {sitemapGroups} from '../src/lib/information-hierarchy.ts';
const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const root='docs/sources/aase/m04-03/replacement-2026-11-11/';
const lesson=read('content/aase/lessons/aase-m04-c03.json'),before=read(root+'prior-lesson.json');
const build=(l:any)=>createAaseCatalog(read('content/aase/course.json'),[l],read('content/aase/sources.json'),'2026-11-11',read('content/aase/course.en.json'));
test('M04-03 keeps original sources, anchors, source depth, checks and same-model exports',()=>{
 assert.equal(lesson.contentVersion,'1.1.0');assert.equal(lesson.revision,before.revision+1);assert.equal(lesson.publishedOn,before.publishedOn);assert.deepEqual(lesson.translations,before.translations);assert.deepEqual(lesson.qa,[]);
 for(const lang of ['zh','en'] as const){
  const t=lesson.text[lang];assert.equal(t.sections.length,10);
  const blocks=t.sections.flatMap((s:any)=>s.blocks??[]);
  const anchors=[...t.sections.map((s:any)=>s.id),...blocks.map((b:any)=>b.id).filter(Boolean)];
  for(const s of before.text[lang].sections)assert.ok(anchors.includes(s.id));
  assert.deepEqual(blocks.filter((b:any)=>b.kind==='flow'||b.kind==='cards').map((b:any)=>b.items.length),[3,5,2,4,2,5]);
  assert.deepEqual(blocks.filter((b:any)=>b.kind==='table').map((b:any)=>b.rows.length),[3,5,6]);
  assert.equal(lesson.checks.length,3);assert.deepEqual(lesson.checks.map((q:any)=>q.answer),[1,2,3]);
  for(const q of lesson.checks)assert.equal(q.text[lang].options.length,4);
  const code=blocks.find((b:any)=>b.code).code;assert.ok(code.includes('## 6. 待驗證事項'));assert.equal(code.split('\n').filter((x:string)=>x.startsWith('## ')).length,6);
  const entry=build(lesson).forLanguage(lang)!.searchEntries[0];
  for(const s of t.sections)for(const p of s.paragraphs)assert.ok(entry.text.includes(p));
  for(const b of blocks){if(b.kind==='prose'||b.kind==='step')for(const p of b.paragraphs)assert.ok(entry.text.includes(p));if(b.kind==='cards'||b.kind==='flow')for(const item of b.items){assert.ok(entry.text.includes(item.title));assert.ok(entry.text.includes(item.body));}}
 }
 for(const script of ['scripts/aase_m0403_content.py','scripts/aase_m0403_svg.py']){const r=spawnSync('python3',[script,'--check'],{encoding:'utf8'});assert.equal(r.status,0,r.stdout+r.stderr);}
 assert.equal(spawnSync('sha256sum',['-c','SHA256SUMS'],{cwd:root}).status,0);
});
test('M04-03 rejects wrong figure relationships, extra nodes, markup and malformed tree depth',()=>{
 for(const section of ['structure','navigation','compare','groups','order','workflow'])for(const change of ['kind','extra','markup']){
  const l=structuredClone(lesson);for(const lang of ['zh','en']){const b=l.text[lang].sections.find((s:any)=>s.id===section).blocks.find((b:any)=>b.kind==='cards'||b.kind==='flow');if(change==='kind')b.kind=b.kind==='cards'?'flow':'cards';if(change==='extra')b.items.push({...b.items[0]});if(change==='markup')b.items[0].body='<svg onload="alert(1)"/>';}
  assert.throws(()=>build(l),/invalid information hierarchy figure/);
 }
 const l=structuredClone(lesson);for(const lang of ['zh','en'])l.text[lang].sections.find((s:any)=>s.id==='navigation').blocks[0].items[1].body='Categories\nFeatured\nCollections\nClearance';assert.throws(()=>build(l),/invalid sitemap relationships/);
 assert.deepEqual(sitemapGroups('Parent\n  Child\nPeer'),[{title:'Parent',children:['Child']},{title:'Peer',children:[]}]);
 for(const value of ['  orphan','Parent\n    too deep','Parent\n one space','Parent\n'])assert.throws(()=>sitemapGroups(value));
 for(const gate of ['draft','future']){
  const l=structuredClone(lesson);if(gate==='draft')l.status='draft';else {l.publishedOn='2099-01-01';l.date='2099-01-01';l.translations.en.publishedOn='2099-01-01';}
  for(const lang of ['zh','en'] as const)assert.equal(build(l).forLanguage(lang)!.searchEntries.length,0);
 }
});
