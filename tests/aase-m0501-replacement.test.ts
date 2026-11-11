import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {getPage,searchEntries} from '../src/lib/server/catalog.ts';
const source='docs/sources/aase/m05-01/replacement-2026-11-11/';
const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const lesson=read('content/aase/lessons/aase-m05-c01.json');
test('M05-01 preserves supplied originals and derives the full bilingual lesson and exports',()=>{
 for(const [name,sha]of Object.entries(read(source+'source-sha256.json')))assert.equal(createHash('sha256').update(readFileSync(source+name)).digest('hex'),sha);
 execFileSync('python3',['scripts/aase_m0501_content.py','--check']);execFileSync('python3',['scripts/aase_m0501_svg.py','--check']);
 assert.equal(lesson.contentVersion,'1.1.0');assert.equal(lesson.revision,4);assert.equal(lesson.publishedOn,'2026-11-05');assert.equal(lesson.date,'2026-11-11');
 for(const lang of ['zh','en']){
  const t=lesson.text[lang];assert.deepEqual(t.sections.map((s:any)=>s.id),['analogy','responsibility','industries','contract','prompt','verification','conflict','takeaway','understanding']);
  const tables=t.sections.flatMap((s:any)=>s.blocks??[]).filter((b:any)=>b.kind==='table');assert.deepEqual(tables.map((t:any)=>t.rows.length),[5,3,5]);
  const clause=t.sections.find((s:any)=>s.id==='contract').blocks.find((b:any)=>b.kind==='step').code;for(const id of ['R-01','R-02','R-03','R-04','T-01','T-02','T-03','T-04'])assert.ok(clause.includes(id));
  const f=t.sections.find((s:any)=>s.id==='verification').blocks[0];assert.equal(f.kind,'flow');assert.equal(f.items.length,5);assert.match(f.items[0].title,/Problem/);assert.match(f.items[4].title,/Verification/);assert.ok(f.description.includes('↻'));
  assert.equal(t.openChecks.length,3);assert.equal(t.openChecks[2].answer.length,2);
  const prefix=lang==='en'?'/en':'';assert.equal(getPage(prefix+'/courses/aase/v1/m05/concepts/m05-01/')!.aaseConcept!.lesson!.contentVersion,'1.1.0');
  const entry=searchEntries.find(e=>e.id===lesson.id&&e.lang===lang)!;for(const item of f.items){assert.ok(entry.text.includes(item.title));assert.ok(entry.text.includes(item.body));}
 }
 assert.deepEqual(lesson.checks,read(source+'previous/aase-m05-c01.json').checks);
 assert.equal(lesson.text.zh.sections[3].blocks.find((b:any)=>b.code).code,lesson.text.en.sections[3].blocks.find((b:any)=>b.code).code);
});
