import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {spawnSync} from 'node:child_process';import {createAaseCatalog,type AaseLesson} from '../src/lib/aase.ts';import {simulatedDocumentAccess} from '../src/lib/document-access-simulation.ts';
const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));const root='docs/sources/aase/m01-03/replacement-2026-11-06/';const lesson=read('content/aase/lessons/aase-m01-c03.json'),before=read(root+'previous-v1.0.2.json');
test('the fixed teaching policy checks all 18 role/resource/action combinations and denies unknown identifiers',()=>{
 const allowed=new Set(['a:A:read','a:A:edit','a:A:delete','b:B:read','b:B:edit','b:B:delete','reviewer:A:read','reviewer:B:read']);
 for(const actor of ['a','b','reviewer'])for(const doc of ['A','B'])for(const action of ['read','edit','delete'])assert.equal(simulatedDocumentAccess(actor,doc,action),allowed.has(`${actor}:${doc}:${action}`),`${actor}/${doc}/${action}`);
 for(const [actor,doc,action] of [['admin','A','read'],['a','C','read'],['a','A','download'],['__proto__','A','read'],[' a ','A','read'],['','','']])assert.equal(simulatedDocumentAccess(actor,doc,action),false);
});
test('complete M01-03 teaching preserves identity, paired sections, mixed original option counts and the five-to-one figure',()=>{
 assert.equal(lesson.contentVersion,'1.1.0');assert.equal(lesson.revision,before.revision+1);assert.equal(lesson.publishedOn,before.publishedOn);assert.equal(lesson.date,'2026-11-06');assert.deepEqual(lesson.qa,[]);
 for(const lang of ['zh','en']){const t=lesson.text[lang];assert.equal(t.sections.length,11);assert.equal(t.sections.flatMap((s:any)=>s.blocks??[]).filter((b:any)=>b.kind==='table').length,4);const diagram=t.sections.find((s:any)=>s.id==='differences').blocks[0];assert.equal(diagram.items.length,6);assert.equal(t.sections.find((s:any)=>s.id==='identity').blocks.filter((b:any)=>b.kind==='step').length,4);assert.deepEqual(lesson.checks.map((q:any)=>q.text[lang].options.length),[4,4,3]);assert.deepEqual(t.exercise,before.text[lang].exercise);}
 assert.deepEqual(lesson.checks.map((q:any)=>q.answer),[2,0,2]);assert.equal(spawnSync('sha256sum',['-c','SHA256SUMS.txt'],{cwd:root}).status,0);
 assert.deepEqual(lesson.text.zh.sections.find((s:any)=>s.id==='differences').blocks[0].items.map((i:any)=>i.title),['身分','權限','資料','協作','維護','安全、可靠、可交接']);
});
test('the bounded organization and access layouts reject missing or extra cards in both languages',()=>{
 const course=read('content/aase/course.json'),en=read('content/aase/course.en.json'),sources=read('content/aase/sources.json');const build=(l:AaseLesson)=>createAaseCatalog(course,[l],sources,'2026-11-06',en);assert.doesNotThrow(()=>build(lesson));
 for(const id of ['differences','identity'])for(const extra of [false,true]){const changed=structuredClone(lesson);for(const lang of ['zh','en']){const block=changed.text[lang].sections.find((s:any)=>s.id===id).blocks.find((b:any)=>b.kind==='cards');if(extra)block.items.push({...block.items[0]});else block.items.pop();}assert.throws(()=>build(changed),/invalid organization teaching layout/);}
});

test('all supplied paragraphs and eleven answer options are preserved or explicitly mapped',()=>{
 const raw=readFileSync(root+'pasted-text-1.txt','utf8').split('\n\n').map(s=>s.trim()).filter(Boolean);const map=read(root+'source-paragraph-map.json');assert.deepEqual(map.map((r:any)=>r.source),raw);assert.equal(map.length,139);assert.deepEqual(map.filter((r:any)=>r.disposition==='retained-question-option').map((r:any)=>r.evidence),lesson.checks.flatMap((q:any)=>q.text.zh.options));assert.ok(map.every((r:any)=>r.disposition&&r.evidence));
});
