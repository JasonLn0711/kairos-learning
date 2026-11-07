import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {createAaseCatalog} from '../src/lib/aase.ts';
const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const root='docs/sources/aase/m02-02/replacement-2026-11-07-followup/';
const lesson=read('content/aase/lessons/aase-m02-c02.json'),before=read(root+'previous.json');
const build=(l:any)=>createAaseCatalog(read('content/aase/course.json'),[l],read('content/aase/sources.json'),'2026-11-07',read('content/aase/course.en.json'));
test('M02-02 preserves source bytes, publication and anchors, with the supplied mixed question formats',()=>{
 assert.equal(lesson.contentVersion,'1.1.1');assert.equal(lesson.revision,before.revision+1);assert.equal(lesson.publishedOn,before.publishedOn);assert.deepEqual(lesson.translations,before.translations);assert.equal(lesson.date,'2026-11-07');assert.deepEqual(lesson.qa,[]);
 const raw=readFileSync(root+'pasted-text-1.txt','utf8');
 for(const lang of ['zh','en']){
  const t=lesson.text[lang];assert.equal(t.sections.length,7);
  for(const s of before.text[lang].sections)assert.ok(t.sections.some((x:any)=>x.id===s.id));
  const figures=t.sections.flatMap((s:any)=>s.blocks??[]).filter((b:any)=>b.kind==='flow'||b.kind==='cards');assert.deepEqual(figures.map((f:any)=>f.items.length),[2,5,5,7,4]);
  assert.equal(t.openChecks.length,1);assert.equal(lesson.checks.length,1);assert.equal(lesson.checks[0].text[lang].options.length,4);
  assert.ok(!JSON.stringify(t).includes('8192'));assert.ok(!JSON.stringify(t).includes('7800'));
 }
 for(const option of lesson.checks[0].text.zh.options)assert.ok(raw.includes(option));
 for(const q of lesson.text.zh.openChecks)assert.ok(raw.includes(q.prompt));assert.equal(lesson.checks[0].answer,2);assert.doesNotThrow(()=>build(lesson));
 assert.equal(spawnSync('sha256sum',['-c','SHA256SUMS.txt'],{cwd:root}).status,0);
});
test('open questions require unique stable IDs, nonempty answers and paired teaching shape',()=>{
 for(const change of ['empty','duplicate','missing','shape']){const l=structuredClone(lesson);for(const lang of ['zh','en']){const q=l.text[lang].openChecks;if(change==='empty')q[0].answer=[];if(change==='duplicate')q[0].id=l.checks[0].id;if(change==='missing')q[0].prompt='';}if(change==='shape')l.text.en.openChecks.pop();assert.throws(()=>build(l),/open check|teaching structure/);}
 const catalog=build(lesson);for(const lang of ['zh','en'] as const){const e=catalog.forLanguage(lang)!.searchEntries[0];assert.ok(e);for(const q of lesson.text[lang].openChecks){assert.ok(e.text.includes(q.prompt));for(const p of q.answer)assert.ok(e.text.includes(p));}}
});
test('context figures reject changed relationships, counts and numeric defaults',()=>{
 for(const id of ['analogy','window','budget-example','prepare']){const l=structuredClone(lesson);for(const lang of ['zh','en'])l.text[lang].sections.find((s:any)=>s.id===id).blocks.find((b:any)=>b.items).items.pop();assert.throws(()=>build(l),/context window figure/);}
 const l=structuredClone(lesson);for(const lang of ['zh','en'])l.text[lang].sections.find((s:any)=>s.id==='budget-example').blocks[0].items[0].body='999';assert.throws(()=>build(l),/context budget defaults/);
});
test('five diagram exports remain derived from bilingual source and budget programs execute',()=>{
 const run=spawnSync('python3',['scripts/aase_m0202_svg.py','--check'],{encoding:'utf8'});assert.equal(run.status,0,run.stdout+run.stderr);
 const code=lesson.text.zh.sections.find((s:any)=>s.id==='budget-example').blocks.find((b:any)=>b.code).code;
 for(const [program,expected]of [[code,'reserved = 9500\nremaining = 500\nfits = True'],[code.replace('extra_logs = 500','extra_logs = 1800'),'reserved = 10800\nremaining = -800\nfits = False']]){const r=spawnSync('python3',['-c',program],{encoding:'utf8'});assert.equal(r.status,0);assert.equal(r.stdout.trim(),expected);}
});
