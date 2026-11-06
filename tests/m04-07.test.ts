import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {allConceptTeachings,concepts,getPage,searchEntries} from '../src/lib/server/catalog.ts';
import {createConceptCatalog} from '../src/lib/concepts.ts';
const id='CEH26-M04-C07';
const t=allConceptTeachings.find(t=>t.id===id)!;
test('SNMP complete paired teaching, topology exports and publication gates',()=>{
 assert.equal(spawnSync('python3',['scripts/m04_07_content.py','--check']).status,0);
 assert.equal(t.contentVersion,'1.0.0');assert.deepEqual(t.qa,[]);
 for(const lang of ['zh','en'] as const){
  const body=t.text[lang].sourceBody!;
  assert.deepEqual(body.filter(b=>b.kind==='heading').map(b=>'id' in b?b.id:null),Array.from({length:10},(_,i)=>`section-${i+1}`));
  assert.equal(body.filter(b=>b.kind==='paragraph'&&b.id).length,8);
  assert.equal(body.filter(b=>b.kind==='table').length,9);
  const visual=body.find(b=>b.kind==='visual');assert.ok(visual&&visual.kind==='visual');assert.equal(visual.visual.items.length,4);
  const text=JSON.stringify(body);for(const token of ['100','20','60000 TimeTicks','sysName.0','sysLocation.0','noSuchObject','noSuchInstance','endOfMibView','timeout','authNoPriv','authPriv','Read view','Write view','Notify view'])assert.ok(text.includes(token),token);
  assert.ok(!text.includes('favicons'));assert.ok(!text.includes('五筆'));
  const path=(lang==='en'?'/en':'')+'/courses/ceh/v13/m04/concepts/m04-07/';assert.equal(getPage(path)?.conceptTeaching?.id,id);assert.equal(getPage(path)?.conceptNavigation?.previous?.href,(lang==='en'?'/en':'')+'/courses/ceh/v13/m04/concepts/m04-06/');assert.equal(getPage(path)?.conceptNavigation?.next?.href,(lang==='en'?'/en':'')+'/courses/ceh/v13/m04/concepts/m04-08/');assert.ok(searchEntries.some(e=>e.id===id&&e.lang===lang));
  for(const closed of [{...t,status:'draft' as const},{...t,publishedOn:'2099-01-01'}]){const catalog=createConceptCatalog(concepts,[closed],'2026-11-06');assert.equal(catalog.get(id,lang),null);assert.ok(!catalog.searchEntries.some(e=>e.id===id));}
 }
});
