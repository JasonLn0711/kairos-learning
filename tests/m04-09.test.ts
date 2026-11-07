import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {allConceptTeachings,concepts,getPage} from '../src/lib/server/catalog.ts';
import {createConceptCatalog} from '../src/lib/concepts.ts';
const id='CEH26-M04-C09';const t=allConceptTeachings.find(t=>t.id===id)!;
test('M04-09 complete source, paired body, bounded figures and deferred C10',()=>{
 const run=spawnSync('python3',['scripts/m04_09_content.py','--check'],{encoding:'utf8'});assert.equal(run.status,0,run.stderr);
 const hash=JSON.parse(readFileSync('docs/sources/m04-09/source-hashes.json','utf8'))['pasted-text-1.txt'].sha256;
 assert.equal(createHash('sha256').update(readFileSync('docs/sources/m04-09/original.zh-TW.md')).digest('hex'),hash);
 assert.equal(t.contentVersion,'1.0.0');assert.deepEqual(t.qa,[]);
 const paired=t.text.zh.sourceBody!.map(b=>[b.kind,'id'in b?b.id:null]);assert.deepEqual(paired,t.text.en.sourceBody!.map(b=>[b.kind,'id'in b?b.id:null]));
 for(const lang of ['zh','en'] as const){
  const body=t.text[lang].sourceBody!;assert.equal(body.filter(b=>b.kind==='heading').length,11);assert.equal(body.filter(b=>b.kind==='visual').length,9);assert.equal(body.filter(b=>b.kind==='table').length,4);assert.equal(body.filter(b=>b.kind==='answer').length,4);
  for(const token of ['10:00:02','09:57:12','10:03:30','IKE_SA_INIT','IKE_AUTH','CHILD_SA','fe80::1234:abcd:5678:9abc','64500','64497','64496','SRTP','RPKI','128'])assert.ok(JSON.stringify(body).includes(token),token);
  const prefix=lang==='en'?'/en':'';assert.equal(getPage(prefix+'/courses/ceh/v13/m04/concepts/m04-09/')?.conceptTeaching?.id,id);assert.equal(getPage(prefix+'/courses/ceh/v13/m04/concepts/m04-10/'),null);
  for(const closed of [{...t,status:'draft' as const},{...t,publishedOn:'2099-01-01'}])assert.equal(createConceptCatalog(concepts,[closed],'2026-11-07').get(id,lang),null);
 }
});
test('M04-09 specialized diagrams reject wrong node counts and flow semantics',()=>{
 for(const mutation of ['count','kind']){const bad=structuredClone(t);const v=bad.text.zh.sourceBody!.find(b=>b.kind==='visual');assert.ok(v&&v.kind==='visual');if(mutation==='count')v.visual.items.pop();else v.visual.kind='cards';assert.throws(()=>createConceptCatalog(concepts,[bad],'2026-11-07'),/invalid other enumeration diagram/);}
});
