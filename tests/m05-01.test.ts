import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {allConceptTeachings,getPage} from '../src/lib/server/catalog.ts';
const id='CEH26-M05-C01';
test('M05-01 retains complete paired source, boundaries and answer-only disclosure',()=>{
 const result=spawnSync('python3',['scripts/m05_01_content.py','--check'],{encoding:'utf8'});assert.equal(result.status,0,result.stderr);
 const t=allConceptTeachings.find(v=>v.id===id)!;assert.ok(t);assert.equal(t.contentVersion,'1.0.0');assert.deepEqual(t.qa,[]);
 for(const lang of ['zh','en'] as const){const body=t.text[lang].sourceBody!;assert.equal(body.filter(b=>b.kind==='heading').length,8);assert.equal(body.filter(b=>b.kind==='answer').length,1);assert.equal(getPage(`${lang==='en'?'/en':''}/courses/ceh/v13/m05/concepts/m05-01/`)?.conceptTeaching?.id,id);
 for(const term of ['VA','PT','ROE','2.4','2008','https://csrc.nist.gov/pubs/sp/800/115/final'])assert.ok(JSON.stringify(body).includes(term),term);}
 assert.deepEqual(t.text.zh.sourceBody!.map(b=>b.kind),t.text.en.sourceBody!.map(b=>b.kind));
 assert.deepEqual(t.text.zh.sourceBody!.flatMap(b=>'id'in b?[b.id]:[]),t.text.en.sourceBody!.flatMap(b=>'id'in b?[b.id]:[]));
});
