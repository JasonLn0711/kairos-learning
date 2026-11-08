import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {allConceptTeachings,getPage} from '../src/lib/server/catalog.ts';
import {createConceptCatalog,type ConceptEntry} from '../src/lib/concepts.ts';
const entries:ConceptEntry[]=JSON.parse(readFileSync('content/concepts.json','utf8'));
test('M05-02/03 generated teaching retains the paired complete sources',()=>{
 const result=spawnSync('python3',['scripts/m05_02_03_content.py','--check'],{encoding:'utf8'});
 assert.equal(result.status,0,result.stderr);
});
for(const suffix of ['02','03'])test(`M05-${suffix}: complete paired source, identity, answers and gates`,()=>{
 const id=`CEH26-M05-C${suffix}`;const t=allConceptTeachings.find(x=>x.id===id)!;
 assert.ok(t);assert.equal(t.contentVersion,'1.0.0');assert.deepEqual(t.qa,[]);
 const zh=t.text.zh.sourceBody!,en=t.text.en.sourceBody!;
 assert.deepEqual(zh.map(b=>b.kind),en.map(b=>b.kind));
 assert.deepEqual(zh.flatMap(b=>'id'in b?[b.id]:[]),en.flatMap(b=>'id'in b?[b.id]:[]));
 for(const lang of ['zh','en'] as const){
  const body=t.text[lang].sourceBody!;
  assert.equal(body.filter(b=>b.kind==='heading').length,suffix==='02'?8:9);
  assert.equal(body.filter(b=>b.kind==='answer').length,1);
  assert.ok(body.filter(b=>b.kind==='paragraph').length>=15);
  assert.equal(getPage(`${lang==='en'?'/en':''}/courses/ceh/v13/m05/concepts/m05-${suffix}/`)?.conceptTeaching?.id,id);
  const data=JSON.stringify(body);assert.ok(data.includes('https://csrc.nist.gov/pubs/sp/800/115/final'));
  assert.ok(!data.includes('Sentinel_'));assert.ok(!data.includes('**'));
 }
 for(const state of ['draft','future']){
  const copy=structuredClone(t);if(state==='draft')copy.status='draft';else copy.publishedOn='2099-01-01';
  const catalog=createConceptCatalog(entries,[copy],'2026-11-08');
  for(const lang of ['zh','en'] as const){assert.equal(catalog.get(id,lang),null);assert.ok(!catalog.searchEntries.some(x=>x.id===id));}
 }
});
