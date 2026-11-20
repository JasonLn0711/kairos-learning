import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateM20Review,type M20Review} from '../src/lib/m20-review.ts';
import {noteBodyText} from '../src/lib/ceh-notes.ts';
import {validateNoteDiagram,noteDiagramSpecs,type NoteDiagram} from '../src/lib/note-diagrams.ts';
const data=JSON.parse(readFileSync('content/ceh-day02-a.json','utf8')) as M20Review;
test('Day02-A retains 13 chapters, protocol examples, seven ambiguities and five unanswered checks',()=>{
 validateM20Review(data);assert.equal(data.sections.filter(s=>!s.collapsible).length,14);
 const text=data.sections.flatMap(s=>s.body.flatMap(noteBodyText)).join('\n');
 for(const id of ['EC-Q002','EC-Q434','P2-Q006','EC-Q513','EC-Q140','EC-Q198','EC-Q024'])assert.ok(text.includes(id));
 for(const key of ['192.0.2.25','192.0.2.0/28','-sT','-sS','-sU','-sA','Key Transport','Key Agreement','Claim:','Next Validation:','未包含完整原題','WHOIS','RDAP','180 分鐘'])assert.ok(text.includes(key),key);
 assert.equal(data.sections.flatMap(s=>s.body).filter(b=>b.kind==='paragraph'&&/^Q[1-5]｜/.test(b.text)).length,5);
 assert.doesNotMatch(data.title+'\n'+text,/博士|碩士|研究生|提交作答，逐題批改/);
 const raw=readFileSync('docs/sources/ceh-day02-a/2026-11-14/pasted-text-1.txt','utf8').split('\n');
 const ledger=JSON.parse(readFileSync('docs/sources/ceh-day02-a/2026-11-14/line-adoption.json','utf8'));
 assert.equal(ledger.length,raw.slice(1).filter(s=>s.trim()).length);
 for(const entry of ledger)assert.equal(raw[entry.line-1],entry.source);
});
test('Day02-A diagram contracts reject injected markup and missing nodes; TCP preserves direction',()=>{
 const figures=data.sections.flatMap(s=>s.body).filter((b):b is NoteDiagram=>b.kind==='diagram'&&['m20d2mail','m20d2tcp','m20d2evidence'].includes(b.name));assert.equal(figures.length,3);
 assert.equal(noteDiagramSpecs.m20d2tcp.layout,'tcp-handshake');assert.equal(noteDiagramSpecs.m20d2evidence.layout,'table');
 assert.deepEqual(figures[1].items.map(i=>i.body.split('：')[0]),['Client → Server','Server → Client','Client → Server']);
 for(const f of figures){validateNoteDiagram(f);assert.throws(()=>validateNoteDiagram({...f,items:f.items.slice(1)}));assert.throws(()=>validateNoteDiagram({...f,svg:'<script/>'} as never));assert.ok(readFileSync(`site/images/ceh-notes/2026-11-14-part-20-${f.name}-zh.svg`).length<100000);}
});
