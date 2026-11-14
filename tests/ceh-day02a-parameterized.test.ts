import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {validateM20Review,type M20Review} from '../src/lib/m20-review.ts';
import {noteBodyText} from '../src/lib/ceh-notes.ts';
import {validateNoteDiagram,noteDiagramSpecs,type NoteDiagram} from '../src/lib/note-diagrams.ts';
const base='docs/sources/ceh-day02-a/2026-11-14/parameterized-query/';
const data=JSON.parse(readFileSync('content/ceh-day02-a.json','utf8')) as M20Review;
const previous=JSON.parse(readFileSync(base+'published-v1.1.0.json','utf8')) as M20Review;
test('Parameterized Query keeps every previous block in order and adopts all eight sections below code/data separation',()=>{
 validateM20Review(data);assert.equal(data.contentVersion,'1.2.0');assert.equal(data.revision,4);assert.equal(data.publishedOn,previous.publishedOn);assert.equal(data.revisedOn,'2026-11-14');
 assert.deepEqual(data.sections.map(s=>[s.id,s.heading]),previous.sections.map(s=>[s.id,s.heading]));
 for(const section of previous.sections){let at=0;const current=data.sections.find(s=>s.id===section.id)!.body;for(const old of section.body){const found=current.findIndex((b,i)=>i>=at&&JSON.stringify(b)===JSON.stringify(old));assert.ok(found>=0,JSON.stringify(old));at=found+1;}}
 const section=data.sections.find(s=>s.id==='p1-section-07')!;const index=section.body.findIndex(b=>b.kind==='heading'&&b.id==='p1-binding-intro');assert.ok(index>0);assert.ok((section.body[index-1] as {text:string}).text.startsWith('這叫作 Code/Data Separation'));
 const adopted=JSON.parse(readFileSync(base+'adopted-body.json','utf8')) as M20Review['sections'][number]['body'];assert.deepEqual(section.body.slice(index,index+adopted.length),adopted);
 assert.equal(adopted.filter(b=>b.kind==='heading'&&b.id?.startsWith('p1-binding-section-')).length,8);assert.equal(adopted.filter(b=>b.kind==='heading'&&b.id?.startsWith('p1-binding-subsection-')).length,4);assert.equal(adopted.filter(b=>b.kind==='code').length,16);
 const text=adopted.flatMap(noteBodyText).join('\n');for(const key of ['Alice','SELECT *','Placeholder','O\'Brien','Allowlist','Authentication','Authorization',':name','age = ?','第五節完整實驗只建立','本頁提供靜態自我檢核']){assert.ok(text.includes(key),key);}
 assert.equal(adopted.filter(b=>b.kind==='paragraph'&&/^1\. 即使/.test(b.text)).length,1);assert.equal(adopted.filter(b=>b.kind==='paragraph'&&/^2\. 如果/.test(b.text)).length,1);assert.doesNotMatch(data.title+'\n'+text,/博士|碩士|研究生|逐一批改/);
 const raw=readFileSync(base+'pasted-text-1.txt','utf8').split('\n'),ledger=JSON.parse(readFileSync(base+'line-adoption.json','utf8'));assert.equal(ledger.length,raw.slice(1).filter(s=>s.trim()).length);for(const row of ledger)assert.equal(raw[row.line-1],row.source);
});
test('Binding figure preserves identical input and separated SQL/value lanes and rejects a misleading counterpart',()=>{
 const f=data.sections.flatMap(s=>s.body).find((b):b is NoteDiagram=>b.kind==='diagram'&&b.name==='m20d2binding')!;validateNoteDiagram(f);assert.equal(noteDiagramSpecs.m20d2binding.count,6);assert.equal(noteDiagramSpecs.m20d2binding.layout,'day02-binding');assert.equal(f.items[1].body,f.items[4].body);
 assert.throws(()=>validateNoteDiagram({...f,items:f.items.slice(1)}));assert.throws(()=>validateNoteDiagram({...f,items:f.items.map((i,n)=>n===4?{...i,body:'different value'}:i)}));assert.throws(()=>validateNoteDiagram({...f,svg:'<script/>'} as never));assert.ok(readFileSync('site/images/ceh-notes/2026-11-14-part-20-m20d2binding-zh.svg').length<100000);
});
test('Adopted complete program and parameter fragments execute against their declared synthetic schemas',()=>{
 const results=JSON.parse(execFileSync('python3',['scripts/check-day02a-parameterized.py'],{encoding:'utf8'}));assert.equal(results.checks.length,5);assert.ok(results.complete_program_stdout.includes("[('Alice', 'admin'), ('Bob', 'user')]"));assert.ok(results.complete_program_stdout.includes('參數化查詢： []'));
});
