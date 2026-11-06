import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {spawnSync} from 'node:child_process';
import {createAaseCatalog,type AaseLesson} from '../src/lib/aase.ts';import {applicationReport} from '../src/lib/application-check-demo.ts';import {agentTestScenarios} from '../src/lib/agent-test-scenarios.ts';
const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));const root='docs/sources/aase/m01-02/replacement-2026-11-06/';const lesson=read('content/aase/lessons/aase-m01-c02.json'),before=read(root+'previous-v1.0.2.json');
test('M01-02 full replacement retains historic identity, seven chapters, supplied three-choice questions and matching bilingual structure',()=>{
 assert.equal(lesson.contentVersion,'1.1.0');assert.equal(lesson.revision,before.revision+1);assert.equal(lesson.publishedOn,before.publishedOn);assert.equal(lesson.date,'2026-11-06');assert.deepEqual(lesson.qa,[]);
 for(const lang of ['zh','en']){const t=lesson.text[lang];assert.equal(t.sections.length,9);assert.equal(t.sections.flatMap((s:any)=>s.blocks??[]).filter((b:any)=>b.kind==='table').length,4);assert.equal(t.sections.flatMap((s:any)=>s.blocks??[]).filter((b:any)=>b.kind==='flow'||b.kind==='cards').length,4);assert.equal(t.sections.find((s:any)=>s.id==='contract').blocks[0].rows.length,5);assert.deepEqual(lesson.checks.map((q:any)=>q.text[lang].options.length),[3,3,3]);}
 assert.deepEqual(lesson.checks.map((q:any)=>q.answer),[1,2,0]);assert.equal(spawnSync('sha256sum',['-c','SHA256SUMS.txt'],{cwd:root}).status,0);
 const prior=JSON.stringify(before.text.zh);assert.ok(prior.includes('NIST'));assert.ok(JSON.stringify(lesson.text.zh).includes('Capability'));assert.ok(JSON.stringify(lesson.text.zh).includes('父目錄'));
 const review=read(root+'image-reference-review.json');assert.deepEqual(review.attachedRasterFiles,[]);assert.match(review.decision,/依原文設計即可/);
});
test('four fixed scenario expectations reject blank and whitespace data, including invalidation after previously complete input',()=>{
 assert.notEqual(applicationReport(agentTestScenarios.complete),null);
 for(const key of ['missing','whitespace','cleared'] as const)assert.equal(applicationReport(agentTestScenarios[key]),null,key);
 const data:{applicationId:string;applicantCode:string;documentType:string}={...agentTestScenarios.complete};assert.notEqual(applicationReport(data),null);data.documentType='';assert.equal(applicationReport(data),null);
});
test('AASE permits exactly three or four options, with matching explanations, answer range and bilingual counts',()=>{
 const course=read('content/aase/course.json'),english=read('content/aase/course.en.json'),sources=read('content/aase/sources.json');
 const build=(l:AaseLesson)=>createAaseCatalog(course,[l],sources,'2026-11-06',english);
 assert.doesNotThrow(()=>build(lesson));
 for(const mutate of [(q:any)=>{q.text.zh.options.pop();q.text.zh.rationales.pop();},(q:any)=>{q.text.zh.options.push('D','E');q.text.zh.rationales.push('D','E');},(q:any)=>{q.answer=3;},(q:any)=>{q.text.zh.rationales.pop();},(q:any)=>{q.text.en.options.push('D');q.text.en.rationales.push('D');}]){const changed=structuredClone(lesson);mutate(changed.checks[0]);assert.throws(()=>build(changed));}
 const four=read('content/aase/lessons/aase-m01-c03.json');assert.doesNotThrow(()=>build(four));
});

test('every supplied paragraph has a recorded adoption decision and all nine original answer options remain verbatim',()=>{
 const raw=readFileSync(root+'pasted-text-1.txt','utf8').split('\n\n').map(s=>s.trim()).filter(Boolean);const map=read(root+'source-paragraph-map.json');assert.deepEqual(map.map((r:any)=>r.source),raw);const options=map.filter((r:any)=>r.disposition==='retained-question-option').map((r:any)=>r.evidence);assert.deepEqual(options,lesson.checks.flatMap((q:any)=>q.text.zh.options));assert.ok(map.every((r:any)=>r.disposition&&r.evidence));
});
