import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {assertArchitectureDiagram} from '../src/lib/architecture-diagram.ts';
import {getPage,searchEntries} from '../src/lib/server/catalog.ts';
const root='docs/sources/aase/m06-02/replacement-2026-11-11/';
const lesson=JSON.parse(readFileSync('content/aase/lessons/aase-m06-c02.json','utf8'));
test('M06-02 retains source bytes, prior identity and every original anchor',()=>{
 for(const line of readFileSync(root+'SHA256SUMS','utf8').trim().split('\n')){const [hash,file]=line.split('  ');assert.equal(createHash('sha256').update(readFileSync(root+file)).digest('hex'),hash);}
 const prior=JSON.parse(readFileSync(root+'previous-lesson.json','utf8'));assert.equal(lesson.publishedOn,prior.publishedOn);assert.equal(lesson.contentVersion,'1.1.0');assert.equal(lesson.date,'2026-11-11');assert.equal(lesson.revision,prior.revision+1);
 for(const s of prior.text.zh.sections)assert.ok(lesson.text.zh.sections.some((v:any)=>v.id===s.id));
});
test('complete paired manuscripts rebuild the published body and all eight bounded SVG exports',()=>{
 execFileSync('python3',['scripts/aase_m0602_content.py','--check']);execFileSync('python3',['scripts/aase_m0602_svg.py','--check']);
 for(const lang of ['zh','en']){
  const text=lesson.text[lang];assert.equal(text.sections.length,10);assert.equal(text.sections.flatMap((s:any)=>s.blocks??[]).filter((b:any)=>b.kind==='table').length,5);assert.deepEqual(text.sections.find((s:any)=>s.id==='distinctions').blocks.map((b:any)=>b.kind),['step','step','step']);
  const code=text.sections.find((s:any)=>s.id==='review').blocks.find((b:any)=>b.code).code;assert.equal((code.match(/^## /gm)??[]).length,7);assert.equal(text.openChecks.length,3);assert.deepEqual(text.openChecks.map((q:any)=>q.prompt.split('\n').length),[4,4,1]);
  const page=getPage(`${lang==='en'?'/en':''}/courses/aase/v1/m06/concepts/m06-02/`)!;assert.equal(page.aaseConcept!.lesson!.contentVersion,'1.1.0');const entry=searchEntries.find(e=>e.id===lesson.id&&e.lang===lang)!;
  for(const s of text.sections){assert.ok(entry.text.includes(s.heading));for(const p of s.paragraphs)assert.ok(entry.text.includes(p));}
 }
});
test('banking retains email-to-customer without admitting disconnected external architecture',()=>{
 for(const lang of ['zh','en']){
  const f=lesson.text[lang].sections.find((s:any)=>s.id==='banking').blocks[0];assertArchitectureDiagram(f);assert.equal(f.nodes.length,4);assert.equal(f.relations.length,4);assert.ok(f.relations.some((r:any)=>r.from==='email'&&r.to==='customer'));
  const disconnected=structuredClone(f);disconnected.relations=disconnected.relations.filter((r:any)=>!(r.from==='banking'&&r.to==='email'));assert.throws(()=>assertArchitectureDiagram(disconnected));
  const injected=structuredClone(f);Object.assign(injected.nodes[0],{markup:'<script/>'});assert.throws(()=>assertArchitectureDiagram(injected));
 }
});
