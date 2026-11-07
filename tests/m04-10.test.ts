import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {allConceptTeachings,concepts,getPage,searchEntries} from '../src/lib/server/catalog.ts';
import {createConceptCatalog} from '../src/lib/concepts.ts';
const id='CEH26-M04-C10',t=allConceptTeachings.find(t=>t.id===id)!;
test('M04-10 preserves full paired teaching and deterministic draft generation',()=>{
 const result=spawnSync('python3',['scripts/m04_10_content.py','--check'],{encoding:'utf8'});assert.equal(result.status,0,result.stdout+result.stderr);
 assert.equal(t.status,'draft');assert.equal(t.contentVersion,'1.0.0');assert.deepEqual(t.qa,[]);
 const a=t.text.zh.sourceBody!,b=t.text.en.sourceBody!;
 assert.equal(a.length,76);assert.deepEqual(a.map(x=>[x.kind,'id'in x?x.id:null]),b.map(x=>[x.kind,'id'in x?x.id:null]));
 for(const body of [a,b]){
  assert.equal(body.filter(x=>x.kind==='heading').length,10);
  assert.equal(body.filter(x=>x.kind==='paragraph'&&x.id).length,6);
  assert.equal(body.filter(x=>x.kind==='answer').length,1);
  for(const term of ['Finance','Authentication','Authorization','AXFR','VRFY','EXPN','NFSv4.1','authPriv','VACM','privateNote','lookup-demo','training-only'])assert.ok(JSON.stringify(body).includes(term),term);
 }
 const ledger=JSON.parse(readFileSync('docs/sources/m04-10/source-map.json','utf8'));
 assert.equal(ledger.length,76);assert.deepEqual(ledger.map((r:any)=>r.sourceParagraph),Array.from({length:76},(_,i)=>i+1));
 for(const [lang,suffix] of [['zh','zh-TW'],['en','en']] as const){
  const raw=readFileSync(`docs/sources/m04-10/teaching.${suffix}.md`,'utf8');
  assert.deepEqual(ledger.map((r:any)=>r[lang]),raw.trim().split(/\n\s*\n/));
  const hashes=JSON.parse(readFileSync('docs/sources/m04-10/source-hashes.json','utf8'));
  assert.equal(createHash('sha256').update(raw).digest('hex'),hashes.publicFiles[`teaching.${suffix}.md`]);
 }
 assert.deepEqual(JSON.stringify(a).match(/https:\/\/[^)]+/g),JSON.stringify(b).match(/https:\/\/[^)]+/g));
 assert.ok(!JSON.stringify(a).includes('收到你的回答'));assert.ok(!JSON.stringify(a).includes('先不附答案'));
});
test('M04-10 stays gated, while published fixture has exact navigation and searchable body',()=>{
 const fixture=createConceptCatalog(concepts,[...allConceptTeachings.filter(x=>x.id!==id),{...t,status:'published'}],'2026-11-07');
 for(const lang of ['zh','en'] as const){
  const prefix=lang==='en'?'/en':'';
  assert.equal(getPage(prefix+'/courses/ceh/v13/m04/concepts/m04-10/'),null);
  assert.ok(!searchEntries.some(e=>e.id===id));
  const page=fixture.get(id,lang)!;assert.equal(page.navigation.previous?.id,'CEH26-M04-C09');assert.equal(page.navigation.next?.id,'M05-01');
  assert.equal(page.navigation.previous?.href,prefix+'/courses/ceh/v13/m04/concepts/m04-09/');
  const result=fixture.searchEntries.find(e=>e.id===id&&e.lang===lang)!;assert.match(result.title,/^M04-10/);assert.ok(result.text.includes('privateNote'));
  for(const closed of [t,{...t,status:'published' as const,publishedOn:'2099-01-01'}])assert.equal(createConceptCatalog(concepts,[closed],'2026-11-07').get(id,lang),null);
 }
});
