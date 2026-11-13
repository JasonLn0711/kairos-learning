import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateM20Review,type M20Review} from '../src/lib/m20-review.ts';
import {noteBodyText} from '../src/lib/ceh-notes.ts';
import {noteDiagramSpecs,validateNoteDiagram} from '../src/lib/note-diagrams.ts';
const data=JSON.parse(readFileSync('content/ceh-day01-b.json','utf8')) as M20Review;
test('Day01-B preserves full concept scope and distinguishes absent original questions',()=>{
 validateM20Review(data);
 const body=data.sections.flatMap(s=>s.body),text=body.flatMap(noteBodyText).join('\n');
 for(let i=1;i<=12;i++)assert.equal(body.filter(b=>b.kind==='heading'&&b.text.startsWith(`L${String(i).padStart(2,'0')}｜`)).length,1);
 for(const id of ['EC-Q284','EC-Q493','P1-Q114','EC-Q032','EC-Q053','P3-Q056','P3-Q074','EC-Q024','P3-Q121','P1-Q085','P2-Q034','P3-Q071','EC-Q084'])assert.ok(text.includes(id));
 assert.ok(text.includes('未包含完整原題、選項及官方答案'));
 assert.ok(text.includes('RFC 9525'));
 assert.doesNotMatch(data.title+'\n'+text,/博士|碩士|研究生|研究能力/);
 assert.ok(text.includes('s=k⁻¹(H(m)+xr)'));
 assert.equal(body.filter(b=>b.kind==='paragraph'&&/^Q[1-4]｜/.test(b.text)).length,4);
 assert.ok(!text.includes('提交理解檢核，逐題批改'));
});
test('Eight figures preserve parallel keys, signature lanes and CA direction',()=>{
 const figures=data.sections.flatMap(s=>s.body).filter(b=>b.kind==='diagram');assert.equal(figures.length,8);
 assert.deepEqual(noteDiagramSpecs.m20bkeys.edges,[]);
 assert.deepEqual(noteDiagramSpecs.m20bsignature.edges.map(e=>e.slice(0,2)),[[0,2],[2,4],[4,6],[1,3],[3,5],[5,7]]);
 assert.deepEqual(noteDiagramSpecs.m20bpki.edges.map(e=>e.slice(0,2)),[[0,1],[1,2]]);
 for(const f of figures){validateNoteDiagram(f);const svg=readFileSync(`site/images/ceh-notes/2026-11-13-part-20-${f.name}-zh.svg`);assert.ok(svg.length<100000);assert.throws(()=>validateNoteDiagram({...f,items:f.items.slice(1)}));}
 assert.equal([10,60,10,40,40,20].reduce((a,b)=>a+b),180);
});
