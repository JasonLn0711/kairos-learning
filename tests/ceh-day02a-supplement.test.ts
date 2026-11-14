import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {noteBodyText} from '../src/lib/ceh-notes.ts';
import {validateM20Review,type M20Review} from '../src/lib/m20-review.ts';
import {validateNoteDiagram,noteDiagramSpecs,type NoteDiagram} from '../src/lib/note-diagrams.ts';
const data=JSON.parse(readFileSync('content/ceh-day02-a.json','utf8')) as M20Review;
const base='docs/sources/ceh-day02-a/2026-11-14/four-topics/';
const previous=JSON.parse(readFileSync(base+'published-v1.0.1.json','utf8')) as M20Review;
test('Four-topic insertion preserves original prose, anchors and contextual positions',()=>{
 validateM20Review(data);assert.equal(data.contentVersion,'1.1.0');assert.equal(data.publishedOn,previous.publishedOn);
 assert.deepEqual(data.sections.map(s=>s.id),previous.sections.map(s=>s.id));
 for(const old of previous.sections){const current=data.sections.find(s=>s.id===old.id)!;
  for(const b of old.body){if(b.kind==='list')for(const item of b.items)assert.ok(current.body.some(n=>n.kind==='list'&&n.items.includes(item)));else assert.ok(current.body.some(n=>JSON.stringify(n)===JSON.stringify(b)),JSON.stringify(b));}}
 const rdap=data.sections.find(s=>s.id==='p1-section-05')!.body;
 assert.ok(rdap.findIndex(b=>b.kind==='heading'&&b.id==='p1-supp-rdap')>rdap.findIndex(b=>b.kind==='paragraph'&&b.text.startsWith('考試看到 WHOIS')));
 assert.ok(rdap.findIndex(b=>b.kind==='heading'&&b.id==='p1-supp-rdap-04')<rdap.findIndex(b=>b.kind==='heading'&&b.text.startsWith('2. DNS')));
 const web=data.sections.find(s=>s.id==='p1-section-07')!.body;
 for(const [key,name] of [['path','Directory Traversal'],['sql','SQL Injection'],['csrf','CSRF']]){
  const at=web.findIndex(b=>b.kind==='heading'&&b.id===`p1-supp-${key}`);assert.equal(web[at-1].kind,'list');assert.ok((web[at-1] as {items:string[]}).items[0].startsWith(name+'：'));}
 const all=data.sections.flatMap(s=>s.body),text=all.flatMap(noteBodyText).join('\n');
 for(const key of ['Parameterized Query','In-band','Time-based','Out-of-band','JSON','Registrar','symlink','SameSite','Fetch Metadata','XSS','無法獨立重算','不是 CEH 官方'])assert.ok(text.includes(key),key);
 assert.equal(all.filter(b=>b.kind==='heading'&&/^p1-supp-(sql|rdap|path|csrf)-\d+$/.test(b.id!)).length,14);
 assert.equal(all.filter(b=>b.kind==='paragraph'&&/^題目 [1-4]｜/.test(b.text)).length,4);
 for(const letter of ['A.','B.','C.','D.'])assert.equal(all.filter(b=>b.kind==='paragraph'&&b.text.startsWith(letter+' ')).length,4);
 assert.doesNotMatch(text,/博士|碩士|研究生|提交 4 題答案並批改|我核對了你提供的/);
});
test('Four figures preserve proportional allocation, parallel directories and bounded serialization',()=>{
 const names=['m20d2priority','m20d2sqli','m20d2tree','m20d2csrf'];
 const figs=data.sections.flatMap(s=>s.body).filter((b):b is NoteDiagram=>b.kind==='diagram'&&names.includes(b.name));assert.equal(figs.length,4);
 assert.deepEqual(noteDiagramSpecs.m20d2priority.weights,[40,30,15,15]);assert.equal(noteDiagramSpecs.m20d2priority.weights.reduce((a,b)=>a+b),100);
 const priority=figs.find(b=>b.name==='m20d2priority')!;assert.throws(()=>validateNoteDiagram({...priority,items:priority.items.map((i,n)=>n?i:{...i,body:'60%｜false allocation'})}));
 for(const f of figs){validateNoteDiagram(f);assert.throws(()=>validateNoteDiagram({...f,items:f.items.slice(1)}));assert.throws(()=>validateNoteDiagram({...f,html:'<script/>'} as never));assert.ok(readFileSync(`site/images/ceh-notes/2026-11-14-part-20-${f.name}-zh.svg`).length<100000);}
 const raw=readFileSync(base+'pasted-text-1.txt','utf8').split('\n'),ledger=JSON.parse(readFileSync(base+'line-adoption.json','utf8'));
 assert.equal(ledger.length,raw.slice(1).filter(s=>s.trim()).length);for(const e of ledger)assert.equal(raw[e.line-1],e.source);
});
