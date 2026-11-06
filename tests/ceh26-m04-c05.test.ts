import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {createHash} from 'node:crypto';import {spawnSync} from 'node:child_process';
import {allConceptTeachings,getPage,searchEntries} from '../src/lib/server/catalog.ts';
const id='CEH26-M04-C05';const t=allConceptTeachings.find(t=>t.id===id)!;
test('NetBIOS/RPC full bilingual manuscripts, source hashes and neighboring publication gates',()=>{
 assert.equal(t.contentVersion,'1.1.0');assert.equal(t.revision,3);assert.equal(t.date,'2026-11-05');assert.deepEqual(t.qa,[]);
 const root='docs/sources/ceh26-m04-c05/';for(const [file,hash] of Object.entries(JSON.parse(readFileSync(root+'sha256.json','utf8'))))assert.equal(createHash('sha256').update(readFileSync(root+file)).digest('hex'),hash);
 for(const [lang,suffix] of [['zh','zh-TW'],['en','en']] as const){
  const body=t.text[lang].sourceBody!;
  assert.equal(body.filter(b=>b.kind==='answer').length,1);assert.equal(body.filter(b=>b.kind==='heading').length,10);
  assert.equal(body.filter(b=>b.kind==='visual').length,3);
  assert.equal(body.filter(b=>b.kind==='table').length,9);
  assert.equal(body.filter(b=>b.kind==='code').length,37);
  const prefix=lang==='en'?'/en':'';const page=getPage(`${prefix}/courses/ceh/v13/m04/concepts/m04-05/`)!;
  assert.equal(page.conceptTeaching?.id,id);assert.equal(page.conceptNavigation?.previous?.id,'CEH26-M04-C04');assert.equal(page.conceptNavigation?.previous?.href,`${prefix}/courses/ceh/v13/m04/concepts/m04-04/`);assert.equal(page.conceptNavigation?.next?.id,'CEH26-M04-C06');assert.equal(page.conceptNavigation?.next?.href,`${prefix}/courses/ceh/v13/m04/concepts/m04-06/`);
  assert.equal(getPage(`${prefix}/courses/ceh/v13/m04/concepts/ceh26-m04-c05/`),null);
  for(const n of [7,9,10,11,12])assert.equal(getPage(`${prefix}/courses/ceh/v13/m04/concepts/m04-${String(n).padStart(2,'0')}/`),null);
  const entry=searchEntries.find(e=>e.id===id&&e.lang===lang)!;assert.ok(entry.text.includes('50020'));assert.ok(entry.text.includes('rpcbind'));
 }
 assert.deepEqual(t.text.zh.sourceBody!.flatMap(b=>'id' in b?[b.id]:[]),t.text.en.sourceBody!.flatMap(b=>'id' in b?[b.id]:[]));
 assert.equal(spawnSync('python3',['scripts/ceh26_m04_c05_diagrams.py','--check']).status,0);
 assert.equal(spawnSync('python3',['scripts/ceh26_m04_c05_content.py','--check']).status,0);
});
