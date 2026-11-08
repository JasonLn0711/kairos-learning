import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {createConceptCatalog} from '../src/lib/concepts.ts';
const load=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const teaching=load('content/concepts/m05-02.json');
const entries=load('content/concepts.json');
test('M05-02 retains exact source bytes and regenerates both complete bodies and eight SVGs',()=>{
 for(const [path,hash] of Object.entries(load('docs/sources/m05-02/source-sha256.json')))assert.equal(createHash('sha256').update(readFileSync('docs/sources/m05-02/'+path)).digest('hex'),hash);
 execFileSync('python3',['scripts/m05_02_content.py','--check']);
 for(const lang of ['zh','en']){
  const body=teaching.text[lang].sourceBody;
  assert.equal(body.filter((b:any)=>b.kind==='heading').length,8);
  assert.equal(body.filter((b:any)=>b.id?.startsWith('section-2-sub-')).length,1);
  assert.deepEqual(body.filter((b:any)=>b.kind==='visual').map((b:any)=>b.visual.items.length),[2,3,5,1]);
  assert.equal(body.filter((b:any)=>b.kind==='table')[0].rows.length,4);
  assert.equal(body.filter((b:any)=>b.kind==='answer')[0].paragraphs.length,3);
 }
});
test('M05-02 publication gate and diagram boundary reject premature publication and malformed nodes',()=>{
 const draft=structuredClone(teaching);draft.status='draft';
 const future=structuredClone(teaching);future.publishedOn='2099-01-01';
 for(const t of [draft,future])assert.equal(createConceptCatalog(entries,[t],'2026-11-08').get('M05-02','zh'),null);
 const broken=structuredClone(teaching);broken.text.zh.sourceBody.find((b:any)=>b.kind==='visual').visual.items.pop();
 assert.throws(()=>createConceptCatalog(entries,[broken],'2026-11-08'),/invalid scope diagram/);
});
