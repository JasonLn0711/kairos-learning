import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {allConceptTeachings,concepts,getPage,searchEntries} from '../src/lib/server/catalog.ts';
import {createConceptCatalog} from '../src/lib/concepts.ts';
const id='CEH26-M04-C08';
const t=allConceptTeachings.find(t=>t.id===id)!;
test('M04-08 draft has complete paired teaching and one editorial answer; publication stays closed',()=>{
 assert.equal(t.status,'draft');assert.equal(t.publishedOn,'9999-12-31');assert.equal(t.contentVersion,'1.0.0');assert.deepEqual(t.qa,[]);
 assert.equal(spawnSync('python3',['scripts/m04_08_content.py','--check']).status,0);
 const shape=(lang:'zh'|'en')=>t.text[lang].sourceBody!.map(b=>({kind:b.kind,id:'id'in b?b.id:null,count:b.kind==='list'?b.items.length:b.kind==='answer'?b.paragraphs.length:null}));
 assert.deepEqual(shape('zh'),shape('en'));
 for(const lang of ['zh','en'] as const){
  const body=t.text[lang].sourceBody!;assert.equal(body.length,44);assert.equal(body.filter(b=>b.kind==='heading').length,8);assert.equal(body.filter(b=>b.kind==='answer').length,1);
  const text=JSON.stringify(body);for(const token of ['one-level','subtree','sizeLimitExceeded','success','636','389','RootDSE','defaultNamingContext','Lin','Chen'])assert.ok(text.includes(token),token);
  assert.ok(!/Sentinel_|libfile_|尚未作答|答案會隨|你先前已接觸過|\*\*/.test(text));
  const path=(lang==='en'?'/en':'')+'/courses/ceh/v13/m04/concepts/m04-08/';
  assert.equal(getPage(path),null);assert.ok(!searchEntries.some(e=>e.id===id));
  const preview=createConceptCatalog(concepts,[{...t,status:'published',publishedOn:'2026-11-06'}],'2026-11-06');
  const page=preview.get(id,lang)!;assert.ok(page);assert.equal(page.navigation.previous?.id,'CEH26-M04-C07');assert.equal(page.navigation.previous?.href,null);assert.equal(page.navigation.next?.id,'CEH26-M04-C09');assert.equal(page.navigation.next?.href,null);
 }
});
