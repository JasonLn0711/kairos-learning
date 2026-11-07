import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {allConceptTeachings,concepts,getPage,searchEntries} from '../src/lib/server/catalog.ts';
import {createConceptCatalog} from '../src/lib/concepts.ts';
const id='CEH26-M04-C09';
const t=allConceptTeachings.find(t=>t.id===id)!;
test('M04-09 complete bilingual evidence boundaries, answer, routes and publication gates',()=>{
 assert.equal(t.status,'published');assert.equal(t.publishedOn,'2026-11-07');assert.equal(t.contentVersion,'1.0.0');assert.deepEqual(t.qa,[]);
 assert.equal(spawnSync('python3',['scripts/m04_09_content.py','--check']).status,0);
 const shape=(lang:'zh'|'en')=>t.text[lang].sourceBody!.map(b=>({kind:b.kind,id:'id'in b?b.id:null,count:b.kind==='list'?b.items.length:b.kind==='answer'?b.paragraphs.length:null}));
 assert.deepEqual(shape('zh'),shape('en'));
 const urls=(lang:'zh'|'en')=>JSON.stringify(t.text[lang]).match(/https:\/\/[^)]+/g);
 assert.deepEqual(urls('zh'),urls('en'));
 for(const lang of ['zh','en'] as const){
  const body=t.text[lang].sourceBody!;assert.equal(body.filter(b=>b.kind==='heading').length,9);assert.equal(body.filter(b=>b.kind==='answer').length,1);
  const text=JSON.stringify(body);for(const token of ['123','4500','500','50','51','5060','5061','128','179','203.0.113.0/24','64496','23','69','IKE_SA_INIT','IKE_AUTH','AS_PATH','SRTP','ICMPv6'])assert.ok(text.includes(token),token);
  assert.ok(!/Sentinel_|libfile_|沒有收到你的回答|尚未作答|\*\*/.test(text));
  const path=(lang==='en'?'/en':'')+'/courses/ceh/v13/m04/concepts/m04-09/';
  assert.equal(getPage(path)?.conceptTeaching?.id,id);assert.ok(searchEntries.some(e=>e.id===id&&e.lang===lang));
  assert.equal(getPage(path)?.conceptNavigation?.previous?.href,(lang==='en'?'/en':'')+'/courses/ceh/v13/m04/concepts/m04-08/');
  assert.equal(getPage(path)?.conceptNavigation?.next?.href,null);
  for(const closed of [{...t,status:'draft' as const},{...t,publishedOn:'2099-01-01'}]){const catalog=createConceptCatalog(concepts,[closed],'2026-11-07');assert.equal(catalog.get(id,lang),null);assert.ok(!catalog.searchEntries.some(e=>e.id===id));}
 }
});
