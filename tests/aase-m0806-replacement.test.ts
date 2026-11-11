import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createAaseCatalog} from '../src/lib/aase.ts';
const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const lesson=read('content/aase/lessons/aase-m08-c06.json');
const root='docs/sources/aase/m08-06/replacement-2026-11-11/';
const catalog=(l:any)=>createAaseCatalog(read('content/aase/course.json'),[l],read('content/aase/sources.json'),'2026-11-11',read('content/aase/course.en.json'));
test('M08-06 retains publication, anchors, all supplied subsections and 4/4/3 choices',()=>{
 const prior=read(root+'previous/lesson.json');
 assert.equal(lesson.publishedOn,prior.publishedOn);assert.equal(lesson.contentVersion,'1.1.0');
 for(const lang of ['zh','en']){
  const sections=lesson.text[lang].sections;
  for(const s of prior.text[lang].sections)assert.ok(sections.some((n:any)=>n.id===s.id));
  assert.equal(sections.length,10);
  assert.equal(sections.flatMap((s:any)=>s.blocks).filter((b:any)=>b.kind==='table').length,5);
  assert.equal(sections.flatMap((s:any)=>s.blocks).filter((b:any)=>b.kind==='step').length,7);
 }
 assert.deepEqual(lesson.checks.map((q:any)=>q.text.zh.options.length),[4,4,3]);
 assert.deepEqual(lesson.checks.map((q:any)=>q.answer),[1,2,1]);
 assert.deepEqual(lesson.qa,[]);catalog(lesson);
});
test('M08-06 rejects changed flow relations, counts and unreviewed fields',()=>{
 for(const mutate of [(f:any)=>f.items.pop(),(f:any)=>f.kind='cards',(f:any)=>f.markup='<svg/>',(f:any)=>f.items[0].href='https://example.com']){
  const l=structuredClone(lesson);
  for(const lang of ['zh','en'])mutate(l.text[lang].sections.find((s:any)=>s.id==='analogy').blocks.find((b:any)=>b.kind==='flow'));
  assert.throws(()=>catalog(l),/invalid regression evidence figure/);
 }
});
test('M08-06 manuscripts and exports reproduce the published data',()=>{
 execFileSync('python3',['scripts/aase_m0806_content.py','--check']);
 execFileSync('python3',['scripts/aase_m0806_svg.py','--check']);
 for(const lang of ['zh','en']){
  const svg=readFileSync(`site/images/aase/m08-06-1-${lang}.svg`,'utf8');
  assert.ok(Buffer.byteLength(svg)<100000);assert.equal((svg.match(/<path /g)||[]).length,4);
  assert.match(svg,/#eaf6ef/);assert.doesNotMatch(svg,/<script|foreignObject|onload=/);
 }
});
