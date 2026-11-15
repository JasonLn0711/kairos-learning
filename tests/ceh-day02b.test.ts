import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateM20Review,type M20Review} from '../src/lib/m20-review.ts';
import {noteBodyText} from '../src/lib/ceh-notes.ts';
import {validateNoteDiagram,noteDiagramSpecs,type NoteDiagram} from '../src/lib/note-diagrams.ts';
const data=JSON.parse(readFileSync('content/ceh-day02-b.json','utf8')) as M20Review;
const blocks=data.sections.flatMap(s=>s.body);
test('Day02-B preserves every supplied subsection, example, table, command and uncertainty',()=>{
 validateM20Review(data);assert.equal(data.sections.length,15);
 const text=blocks.flatMap(noteBodyText).join('\n');
 for(const term of ['K01','K02–K03','K04','K05–K08','K07','K08','K09–K10','K11','K12'])assert.ok(data.sections.some(s=>s.heading.includes(term)),term);
 for(const term of ['5-tuple','53000','ms-sql-s','ms-sql-m','Dedicated Administrator Connection','nc -l -p 4444','fping -a -g 192.168.1.0/24','nmap -sn -PE 10.0.0.0/24','ICMP Timestamp','EC-Q255','EC-Q388','EC-Q522','smtp-enum-users.methods','STARTTLS','Finance','DNSKEY','RRSIG','DS','Key Transport','Key Agreement','Rules of Engagement','180 分鐘','160–180','10.20.30.40','未附完整23題'])assert.ok(text.includes(term),term);
 assert.equal(blocks.filter(b=>b.kind==='heading'&&/^問題 [1-6]｜/.test(b.text)).length,6);
 const scenario=blocks.find(b=>b.kind==='table'&&b.headers[0]==='觀察項目');assert.equal(scenario?.kind==='table'&&scenario.rows.length,7);
 assert.doesNotMatch(text,/提交作答並進行批改|CEH-Day02-B-2026-11-14\(1\).md|google.com\/s2\/favicons/);
 const source=readFileSync('docs/sources/ceh-day02-b/2026-11-15/pasted-text-1.txt','utf8').split(/\r?\n/);
 const ledger=JSON.parse(readFileSync('docs/sources/ceh-day02-b/2026-11-15/line-adoption.json','utf8')) as {line:number;source:string;anchor:string}[];
 assert.equal(ledger.length,source.slice(1).filter(s=>s.trim()).length);
 for(const entry of ledger){assert.equal(source[entry.line-1],entry.source);assert.ok(data.sections.some(s=>s.id===entry.anchor)||blocks.some(b=>'id' in b&&b.id===entry.anchor));}
});
test('Day02-B figures preserve directions, parallel scans and four UDP alternatives, and reject invalid models',()=>{
 const figures=blocks.filter((b):b is NoteDiagram=>b.kind==='diagram');assert.equal(figures.length,5);
 assert.deepEqual(figures.map(f=>f.items.length),[6,3,6,5,4]);
 assert.equal(noteDiagramSpecs.m20d2bscans.layout,'day02b-scans');
 assert.deepEqual(figures[2].items.map(i=>i.title),['SYN','SYN/ACK','ACK','SYN','SYN/ACK','RST']);
 assert.deepEqual(figures[3].items.slice(1).map(i=>i.title),['open','closed','filtered','open|filtered']);
 for(const f of figures){validateNoteDiagram(f);assert.throws(()=>validateNoteDiagram({...f,items:f.items.slice(1)}));assert.throws(()=>validateNoteDiagram({...f,svg:'<script/>'} as never));assert.ok(readFileSync(`site/images/ceh-notes/2026-11-15-part-20-${f.name}-zh.svg`).length<100000);}
 const wrong=structuredClone(figures[2]);wrong.items[1].body='Client → Server：錯方向';assert.throws(()=>validateNoteDiagram(wrong));
 const malformed=structuredClone(figures[3]);malformed.items[4].title='closed';assert.throws(()=>validateNoteDiagram(malformed));
});
