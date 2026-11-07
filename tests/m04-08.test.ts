import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {allConceptTeachings,concepts,getPage,searchEntries} from '../src/lib/server/catalog.ts';
import {createConceptCatalog} from '../src/lib/concepts.ts';
const id='CEH26-M04-C08';
const t=allConceptTeachings.find(t=>t.id===id)!;
test('M04-08 release has complete paired teaching, ten figures and three editorial answer groups',()=>{
 assert.equal(t.status,'published');assert.equal(t.publishedOn,'2026-11-06');assert.equal(t.contentVersion,'1.1.0');assert.deepEqual(t.qa,[]);
 assert.equal(spawnSync('python3',['scripts/m04_08_content.py','--check']).status,0);
 assert.equal(spawnSync('python3',['scripts/verify-m04-08-source.py','--check']).status,0);
 const shape=(lang:'zh'|'en')=>t.text[lang].sourceBody!.map(b=>({kind:b.kind,id:'id'in b?b.id:null,count:b.kind==='list'?b.items.length:b.kind==='answer'?b.paragraphs.length:null}));
 assert.deepEqual(shape('zh'),shape('en'));
 for(const lang of ['zh','en'] as const){
  const body=t.text[lang].sourceBody!;assert.equal(body.length,266);assert.equal(body.filter(b=>b.kind==='heading').length,12);assert.equal(body.filter(b=>b.kind==='answer').length,3);
  assert.equal(body.filter(b=>b.kind==='visual').length,10);
  const text=JSON.stringify(body);for(const token of ['one-level','subtree','sizeLimitExceeded','success','636','389','RootDSE','defaultNamingContext','Lin','Chen','TGT','Service Ticket','klist','4768','4769','KRBTGT','gMSA','Authenticator'])assert.ok(text.includes(token),token);
  assert.ok(!/Sentinel_|libfile_|尚未作答|答案會隨|你先前已接觸過|\*\*/.test(text));
  const path=(lang==='en'?'/en':'')+'/courses/ceh/v13/m04/concepts/m04-08/';
  assert.equal(getPage(path)?.conceptTeaching?.id,id);assert.ok(searchEntries.some(e=>e.id===id&&e.lang===lang));
  for(const closed of [{...t,status:'draft' as const},{...t,publishedOn:'2099-01-01'}]){const catalog=createConceptCatalog(concepts,[closed],'2026-11-06');assert.equal(catalog.get(id,lang),null);assert.ok(!catalog.searchEntries.some(e=>e.id===id));}
  const preview=createConceptCatalog(concepts,[{...t,status:'published',publishedOn:'2026-11-06'}],'2026-11-06');
  const page=preview.get(id,lang)!;assert.ok(page);assert.equal(page.navigation.previous?.id,'CEH26-M04-C07');assert.equal(page.navigation.previous?.href,null);assert.equal(page.navigation.next?.id,'CEH26-M04-C09');assert.equal(page.navigation.next?.href,null);
 }
});

test('LDAP diagram trust boundary rejects malformed exchange structure and node counts',()=>{
 for(const mutate of [(v:any)=>v.items.pop(),(v:any)=>v.items[0].body='Only one line',(v:any)=>v.kind='cards']){
  const invalid=structuredClone(t);const block=invalid.text.zh.sourceBody!.find(b=>b.kind==='visual'&&b.src.includes('-tickets-'))!;
  if(block.kind!=='visual')throw Error('Missing tickets');mutate(block.visual);
  assert.throws(()=>createConceptCatalog(concepts,[invalid],'2026-11-07'),/invalid (LDAP diagram|Kerberos exchange) structure/);
 }
});
