import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {createAaseCatalog} from '../src/lib/aase.ts';
import {checkReport,reportAvailable} from '../src/lib/stale-report.ts';
const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const root='docs/sources/aase/m07-07/replacement-2026-11-11/';
const lesson=read('content/aase/lessons/aase-m07-c07.json'),before=read(root+'prior-lesson.json');
const build=(l:any)=>createAaseCatalog(read('content/aase/course.json'),[l],read('content/aase/sources.json'),'2026-11-11',read('content/aase/course.en.json'));
test('debugging replacement preserves identity and original gates, complete bilingual scope and reference questions',()=>{
 assert.equal(lesson.contentVersion,'1.1.0');assert.equal(lesson.revision,before.revision+1);assert.equal(lesson.publishedOn,before.publishedOn);assert.deepEqual(lesson.translations,before.translations);assert.deepEqual(lesson.qa,[]);
 for(const lang of ['zh','en'] as const){
  const t=lesson.text[lang],blocks=t.sections.flatMap((s:any)=>s.blocks??[]);
  for(const s of before.text[lang].sections)assert.ok(t.sections.some((x:any)=>x.id===s.id));
  assert.equal(t.sections.length,10);
  assert.deepEqual(blocks.filter((b:any)=>b.kind==='flow'||b.kind==='cards').map((b:any)=>[b.kind,b.items.length]),[['flow',6],['cards',6],['flow',3],['cards',4]]);
  assert.deepEqual(blocks.filter((b:any)=>b.kind==='table').map((b:any)=>b.rows.length),[3,4,5]);
  assert.ok(blocks.some((b:any)=>b.code===readFileSync(root+'snapshot_example.py','utf8').trim()));
  const entry=build(lesson).forLanguage(lang)!.searchEntries[0];
  for(const b of blocks)if(b.kind==='prose')for(const p of b.paragraphs)assert.ok(entry.text.includes(p));
  assert.ok(entry.text.includes('git restore -p --source=HEAD -- app.py'));
 }
 assert.deepEqual(lesson.checks.map((q:any)=>[q.id,q.answer,q.text.zh.options.length]),[4,5,6].map(i=>[`AASE-M07-C07-Q0${i}`,1,3]));
 for(const script of ['scripts/aase_m0707_content.py','scripts/aase_m0707_svg.py']){const r=spawnSync('python3',[script,'--check'],{encoding:'utf8'});assert.equal(r.status,0,r.stdout+r.stderr);}
 assert.equal(spawnSync('sha256sum',['-c','SHA256SUMS'],{cwd:root}).status,0);
});
test('debugging model rejects altered figure semantics and keeps unpublished translations out',()=>{
 for(const section of ['analogy','bug','loop','agent-task'])for(const change of ['kind','extra','missing','markup']){
  const l=structuredClone(lesson);for(const lang of ['zh','en']){const b=l.text[lang].sections.find((s:any)=>s.id===section).blocks.find((b:any)=>b.kind==='cards'||b.kind==='flow');if(change==='kind')b.kind=b.kind==='cards'?'flow':'cards';if(change==='extra')b.items.push({...b.items[0]});if(change==='missing')b.items.pop();if(change==='markup')b.items[0].html='<svg onload="alert(1)"/>';}
  assert.throws(()=>build(l),/invalid debugging figure/);
 }
 const l=structuredClone(lesson);l.status='draft';for(const lang of ['zh','en']as const)assert.equal(build(l).forLanguage(lang)!.searchEntries.length,0);
 const future=structuredClone(lesson);future.publishedOn='2099-01-01';future.date='2099-01-01';future.translations.en.publishedOn='2099-01-01';for(const lang of ['zh','en']as const)assert.equal(build(future).forLanguage(lang)!.searchEntries.length,0);
 const en=structuredClone(lesson);en.translations.en.status='draft';assert.equal(build(en).forLanguage('en')!.searchEntries.length,0);
});
test('stale-report comparison detects empty and nonempty edits, missing results and rechecked input',()=>{
 const original={name:'甲公司',taxId:'12345678',docType:'財務報表'};
 const snapshot=checkReport(original);assert.notEqual(snapshot,original);assert.ok(reportAvailable(original,snapshot,'fixed'));
 for(const docType of ['', ' ', '資產負債表']){
  const edited={...original,docType};assert.ok(reportAvailable(edited,snapshot,'bug'));assert.equal(reportAvailable(edited,snapshot,'fixed'),false);
 }
 for(const key of ['name','taxId','docType'])assert.equal(checkReport({...original,[key]:' '}),null);
 assert.equal(reportAvailable(original,null,'bug'),false);assert.equal(reportAvailable(original,null,'fixed'),false);
 const changed={...original,name:'乙公司'};assert.equal(reportAvailable(changed,snapshot,'fixed'),false);assert.ok(reportAvailable(changed,checkReport(changed),'fixed'));
});
