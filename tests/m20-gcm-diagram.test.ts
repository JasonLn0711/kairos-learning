import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {noteDiagramSpecs, noteReferenceImage, validateNoteDiagram, type NoteDiagram} from '../src/lib/note-diagrams.ts';
const figure=JSON.parse(readFileSync('docs/sources/ceh-m20-review/2026-11-12/four-concepts-supplement/figure.json','utf8')) as NoteDiagram;
test('GCM preserves parallel outputs, verification gate and mutually exclusive results',()=>{
 validateNoteDiagram(figure);
 assert.deepEqual(noteDiagramSpecs.m20gcmflow,{count:7,layout:'continuation-graph',rows:[[0],[1],[2,3],[4],[5,6]],edges:[[0,1,''],[1,2,''],[1,3,''],[2,4,''],[3,4,''],[4,5,'yes'],[4,6,'no']]});
 const data=JSON.parse(readFileSync('content/ceh-m20-review.json','utf8'));
 const rendered=data.sections.flatMap((s:{body:NoteDiagram[]})=>s.body).filter((b:NoteDiagram)=>b.kind==='diagram'&&b.name==='m20gcmflow');
 assert.deepEqual(rendered,[figure],'Formal HTML/search and SVG use the same adopted model');
 assert.match(figure.description,/不表示把秘密金鑰隨密文傳送/);
 assert.match(figure.items[0].body,/IV唯一性/);
 assert.match(figure.items[0].body,/AAD參與驗證但不加密/);
 assert.match(figure.items[4].body,/自己持有/);
 assert.match(figure.items[6].body,/不把未通過驗證的明文/);
 assert.equal(noteReferenceImage('2026-11-12','m20gcmflow'),'https://github.com/JasonLn0711/kairos-learning/blob/main/docs/sources/ceh-m20-review/2026-11-12/four-concepts-supplement/image-1.png');
});
test('GCM fixed model rejects missing outcomes and unreviewed markup',()=>{
 for(const mutate of [(b:NoteDiagram)=>b.items.pop(),(b:NoteDiagram)=>(b.items[0] as unknown as Record<string,string>).html='<svg/>']){
  const value=structuredClone(figure);mutate(value);assert.throws(()=>validateNoteDiagram(value));
 }
});

test('GCM SVG distinguishes rejection from acceptance and matches the existing role palette',()=>{
 const svg=readFileSync('site/images/ceh-notes/2026-11-12-part-20-m20gcmflow-zh.svg','utf8');
 const cards=[...svg.matchAll(/<rect [^>]*rx="12"[^>]*>/g)].map(m=>({fill:m[0].match(/fill="([^"]+)"/)![1],stroke:m[0].match(/stroke="([^"]+)"/)![1]}));
 assert.deepEqual(cards,[
  {fill:'#e9f2fa',stroke:'#a4c5e1'},{fill:'#e9f2fa',stroke:'#a4c5e1'},
  {fill:'#f6f7f8',stroke:'#cbd1d5'},{fill:'#f6f7f8',stroke:'#cbd1d5'},{fill:'#f6f7f8',stroke:'#cbd1d5'},
  {fill:'#e6f5ec',stroke:'#b8d5c5'},{fill:'#fbeeee',stroke:'#d9a4a4'},
 ]);
});
