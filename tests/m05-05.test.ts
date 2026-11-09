import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {createConceptCatalog,conceptPath} from '../src/lib/concepts.ts';
const load=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const t=load('content/concepts/ceh26-m05-c05.json'),entries=load('content/concepts.json');
test('M05-05 keeps complete paired teaching, source custody, signal values and reference answer',()=>{
 for(const [p,h] of Object.entries(load('docs/sources/m05-05/source-sha256.json')))assert.equal(createHash('sha256').update(readFileSync('docs/sources/m05-05/'+p)).digest('hex'),h);
 execFileSync('python3',['scripts/m05_05_content.py','--check']);
 for(const lang of ['zh','en']){
  const b=t.text[lang].sourceBody,full=JSON.stringify(b);
  assert.equal(b.filter((x:any)=>x.kind==='heading').length,8);
  assert.equal(b.filter((x:any)=>x.kind==='table')[0].rows.length,3);
  assert.equal(b.filter((x:any)=>x.kind==='answer')[0].paragraphs.length,2);
  assert.equal(b.filter((x:any)=>x.kind==='visual')[0].visual.items.length,4);
  assert.deepEqual(b.filter((x:any)=>x.kind==='list').map((x:any)=>x.items.length),[2,5]);
  for(const value of ['9.8','8.1','0.01','0.60','0.20','95','1%'])assert.ok(full.includes(value),value);
  assert.match(b.find((x:any)=>x.kind==='answer').paragraphs.join(' '),/backport/);
 }
 assert.deepEqual(t.text.zh.sourceBody.map((x:any)=>[x.kind,x.id]),t.text.en.sourceBody.map((x:any)=>[x.kind,x.id]));
 assert.deepEqual(t.qa,[]);
});
test('M05-05 has stable public identity, shared gates and restricted diagram boundary',()=>{
 assert.equal(conceptPath(t.id,'en'),'/en/courses/ceh/v13/m05/concepts/m05-05/');
 assert.equal(entries[entries.findIndex((e:any)=>e.id===t.id)-1].id,'CEH26-M05-C04');
 assert.equal(createConceptCatalog(entries,[t],'2026-11-09').get(t.id,'zh'),null);
 const future=structuredClone(t);future.status='published';future.publishedOn='2099-01-01';
 assert.equal(createConceptCatalog(entries,[future],'2026-11-09').get(t.id,'zh'),null);
 const broken=structuredClone(t);broken.text.zh.sourceBody.find((x:any)=>x.kind==='visual').visual.items.pop();
 assert.throws(()=>createConceptCatalog(entries,[broken],'2026-11-09'),/invalid priority signals diagram/);
 const wrongPath=structuredClone(t);wrongPath.text.zh.sourceBody.find((x:any)=>x.kind==='visual').src='/images/ceh/m05-05-arbitrary-zh.svg';
 assert.throws(()=>createConceptCatalog(entries,[wrongPath],'2026-11-09'),/invalid priority signals diagram/);
});
