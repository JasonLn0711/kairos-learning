import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {successMetrics} from '../src/lib/success-metrics.ts';
import {createAaseCatalog} from '../src/lib/aase.ts';
const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const root='docs/sources/aase/m03-05/replacement-2026-11-11/';
const lesson=read('content/aase/lessons/aase-m03-c05.json'),before=read(root+'prior-lesson.json');
const build=(l:any)=>createAaseCatalog(read('content/aase/course.json'),[l],read('content/aase/sources.json'),'2026-11-11',read('content/aase/course.en.json'));
test('success metrics replacement preserves history, anchors, code and complete bilingual structure',()=>{
 assert.equal(lesson.contentVersion,'1.2.0');assert.equal(lesson.revision,before.revision+1);assert.equal(lesson.publishedOn,before.publishedOn);assert.deepEqual(lesson.translations,before.translations);assert.equal(lesson.date,'2026-11-11');assert.deepEqual(lesson.qa,[]);
 for(const lang of ['zh','en']){
  const t=lesson.text[lang];assert.equal(t.sections.length,12);
  for(const s of before.text[lang].sections)assert.ok(t.sections.some((x:any)=>x.id===s.id));
  assert.equal(t.sections.flatMap((s:any)=>s.blocks??[]).filter((b:any)=>b.kind==='flow'||b.kind==='cards').length,6);
  assert.equal(t.openChecks.length,5);
  const code=readFileSync(root+'pasted-text-1.txt','utf8').match(/```\n([\s\S]*?)\n```/)![1];
  assert.equal(t.sections.find((s:any)=>s.id==='record').blocks.find((b:any)=>b.code).code,code);
 }
 assert.equal(lesson.checks.length,0);assert.doesNotThrow(()=>build(lesson));
 assert.equal(spawnSync('sha256sum',['-c','SHA256SUMS.txt'],{cwd:root}).status,0);
 for(const script of [root+'normalize-source.py','scripts/aase_m0305_content.py','scripts/aase_m0305_svg.py']){const r=spawnSync('python3',[script,'--check'],{encoding:'utf8'});assert.equal(r.status,0,r.stdout+r.stderr);}
});
test('success evidence model rejects changed relationships and unsafe ordered prose',()=>{
 for(const id of ['evidence-chain','metrics','measure','assumptions','trace','understanding'])for(const change of ['add','remove','kind']){
  const l=structuredClone(lesson);
  for(const lang of ['zh','en']){const b=l.text[lang].sections.find((s:any)=>s.id===id).blocks.find((b:any)=>b.kind==='cards'||b.kind==='flow');if(change==='add')b.items.push({...b.items[0]});else if(change==='remove')b.items.pop();else b.kind=b.kind==='cards'?'flow':'cards';}
  assert.throws(()=>build(l),/invalid success evidence figure/);
 }
 for(const change of [[],[''],['Valid']]){
  const l=structuredClone(lesson);for(const lang of ['zh','en']){const b=l.text[lang].sections[1].blocks.find((b:any)=>b.kind==='prose');b.paragraphs=change;if(change[0]==='Valid')b.html='<script/>';}
  assert.throws(()=>build(l),/invalid ordered prose|English teaching structure differs/);
 }
 const c=build(lesson);for(const lang of ['zh','en'] as const){const entry=c.forLanguage(lang)!.searchEntries[0];for(const s of lesson.text[lang].sections)for(const b of s.blocks??[])if(b.kind==='prose')for(const p of b.paragraphs)assert.ok(entry.text.includes(p));}
});

test('fixed product metrics cover every combination and reject invalid counts',()=>{
 for(let blocked=0;blocked<=4;blocked++)for(let falseBlocked=0;falseBlocked<=2;falseBlocked++)assert.deepEqual(successMetrics(blocked,falseBlocked),{blockingRate:[0,25,50,75,100][blocked],releaseRate:[100,50,0][falseBlocked],missed:4-blocked,falseBlocked});
 assert.deepEqual(successMetrics(4,2),{blockingRate:100,releaseRate:0,missed:0,falseBlocked:2});
 for(const value of [-1,0.5,5,NaN,Infinity])assert.throws(()=>successMetrics(value,0),RangeError);
 for(const value of [-1,0.5,3,NaN,Infinity])assert.throws(()=>successMetrics(3,value),RangeError);
});
