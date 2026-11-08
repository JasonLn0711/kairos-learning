import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {createConceptCatalog,conceptPath} from '../src/lib/concepts.ts';
const load=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const t=load('content/concepts/ceh26-m05-c04.json'),entries=load('content/concepts.json');
test('M05-04 preserves source bytes and complete bilingual sourceBody',()=>{
 const hashes=load('docs/sources/m05-04/source-sha256.json');
 for(const [p,h] of Object.entries(hashes))assert.equal(createHash('sha256').update(readFileSync('docs/sources/m05-04/'+p)).digest('hex'),h);
 execFileSync('python3',['scripts/m05_04_content.py','--check']);
 for(const lang of ['zh','en']){
  const b=t.text[lang].sourceBody;
  assert.equal(b.filter((x:any)=>x.kind==='heading').length,8);
  assert.equal(b.filter((x:any)=>x.kind==='answer').length,1);
  assert.equal(b.filter((x:any)=>x.kind==='visual')[0].visual.items.length,3);
  assert.equal(b.filter((x:any)=>x.kind==='list')[0].items.length,4);
  assert.match(b.find((x:any)=>x.kind==='answer').paragraphs[0],/backport/);
  assert.equal(JSON.stringify(b).includes('上午已交付'),false);
 }
 assert.deepEqual(t.text.zh.sourceBody.map((x:any)=>[x.kind,x.id]),t.text.en.sourceBody.map((x:any)=>[x.kind,x.id]));
});
test('M05-04 stable identity and shared draft/future publication boundary',()=>{
 assert.equal(conceptPath(t.id,'en'),'/en/courses/ceh/v13/m05/concepts/m05-04/');
 assert.equal(entries[entries.findIndex((e:any)=>e.id===t.id)+1].id,'CEH26-M05-C05');
 assert.equal(createConceptCatalog(entries,[t],'2026-11-08').get(t.id,'zh'),null);
 const future=structuredClone(t);future.status='published';future.publishedOn='2099-01-01';
 assert.equal(createConceptCatalog(entries,[future],'2026-11-08').get(t.id,'zh'),null);
 const invalid=structuredClone(t);invalid.text.zh.sourceBody.find((x:any)=>x.kind==='visual').visual.items.pop();
 assert.throws(()=>createConceptCatalog(entries,[invalid],'2026-11-08'),/invalid identification diagram/);
});
