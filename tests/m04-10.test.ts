import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {allConceptTeachings,concepts,getPage} from '../src/lib/server/catalog.ts';
import {createConceptCatalog} from '../src/lib/concepts.ts';
const id='CEH26-M04-C10',t=allConceptTeachings.find(t=>t.id===id)!;
test('M04-10 source custody, complete paired teaching, generated exports and publication gate',()=>{
 const run=spawnSync('python3',['scripts/m04_10_content.py','--check'],{encoding:'utf8'});assert.equal(run.status,0,run.stderr);
 const hashes=JSON.parse(readFileSync('docs/sources/m04-10/source-hashes.json','utf8'));
 for(const [name,data] of Object.entries(hashes) as [string,{sha256:string}][])assert.equal(createHash('sha256').update(readFileSync('docs/sources/m04-10/'+name)).digest('hex'),data.sha256);
 assert.equal(t.contentVersion,'1.0.0');assert.deepEqual(t.qa,[]);
 for(const lang of ['zh','en'] as const){const body=t.text[lang].sourceBody!;assert.equal(body.filter(b=>b.kind==='heading').length,9);assert.equal(body.filter(b=>b.kind==='visual').length,3);assert.equal(body.filter(b=>b.kind==='table').length,2);assert.equal(body.filter(b=>b.kind==='answer').length,1);assert.equal(body.filter(b=>b.kind==='code').length,1);
 for(const token of ['Finance','authPriv','VACM','TLS','AXFR','Connection timed out'])assert.ok(JSON.stringify(body).includes(token),token);
 assert.equal(getPage((lang==='en'?'/en':'')+'/courses/ceh/v13/m04/concepts/m04-10/')?.conceptTeaching?.id,id);
 for(const closed of [{...t,status:'draft' as const},{...t,publishedOn:'2099-01-01'}])assert.equal(createConceptCatalog(concepts,[closed],'2026-11-07').get(id,lang),null);
 }
 assert.deepEqual(t.text.zh.sourceBody!.flatMap(b=>'id'in b?[b.id]:[]),t.text.en.sourceBody!.flatMap(b=>'id'in b?[b.id]:[]));
});
test('M04-10 figures reject invalid shape and maintain all synthetic cases',()=>{
 for(const name of ['rights','controls','acceptance'])for(const mutation of ['count','kind','result']){const bad=structuredClone(t);const b=bad.text.zh.sourceBody!.find(b=>b.kind==='visual'&&b.src.includes('-'+name+'-'));assert.ok(b&&b.kind==='visual');if(mutation==='count')b.visual.items.pop();else if(mutation==='kind')b.visual.kind=b.visual.kind==='flow'?'cards':'flow';else {if(name!=='acceptance')continue;b.visual.items[0].body='missing policy and observation';}assert.throws(()=>createConceptCatalog(concepts,[bad],'2026-11-07'),/invalid enumeration defense diagram/);}
});
