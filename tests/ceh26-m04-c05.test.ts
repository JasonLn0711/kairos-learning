import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {createHash} from 'node:crypto';import {spawnSync} from 'node:child_process';
import {allConceptTeachings,getPage,searchEntries} from '../src/lib/server/catalog.ts';
const id='CEH26-M04-C05';const t=allConceptTeachings.find(t=>t.id===id)!;
test('NetBIOS/RPC full bilingual manuscripts, source hashes and nonconsecutive publication gates',()=>{
 assert.equal(t.contentVersion,'1.0.1');assert.equal(t.revision,2);assert.equal(t.date,'2026-11-05');assert.deepEqual(t.qa,[]);
 const root='docs/sources/ceh26-m04-c05/';for(const [file,hash] of Object.entries(JSON.parse(readFileSync(root+'sha256.json','utf8'))))assert.equal(createHash('sha256').update(readFileSync(root+file)).digest('hex'),hash);
 for(const [lang,suffix] of [['zh','zh-TW'],['en','en']] as const){
  const body=t.text[lang].sourceBody!;const flat=body.flatMap(b=>b.kind==='list'?b.items:b.kind==='answer'?[b.summary,...b.paragraphs]:'text'in b?[b.text]:[]).join('\n');let cursor=0;
  for(const line of readFileSync(root+`teaching.${suffix}.md`,'utf8').split('\n')){const value=line.replace(/^#{1,3} /,'').replace(/^(?:- |\d+\. )/,'').replaceAll('**','');if(!value)continue;const at=flat.indexOf(value,cursor);assert.ok(at>=cursor,value);cursor=at+value.length;}
  assert.equal(body.filter(b=>b.kind==='answer').length,1);assert.equal(body.filter(b=>b.kind==='heading').length,7);
  const prefix=lang==='en'?'/en':'';const page=getPage(`${prefix}/courses/ceh/v13/m04/concepts/m04-05/`)!;
  assert.equal(page.conceptTeaching?.id,id);assert.equal(page.conceptNavigation?.previous?.id,'CEH26-M04-C04');assert.equal(page.conceptNavigation?.previous?.href,null);assert.equal(page.conceptNavigation?.next?.id,'CEH26-M04-C06');assert.equal(page.conceptNavigation?.next?.href,null);
  assert.equal(getPage(`${prefix}/courses/ceh/v13/m04/concepts/ceh26-m04-c05/`),null);
  for(const n of [4,6,7,8,9,10,11,12])assert.equal(getPage(`${prefix}/courses/ceh/v13/m04/concepts/m04-${String(n).padStart(2,'0')}/`),null);
  const entry=searchEntries.find(e=>e.id===id&&e.lang===lang)!;assert.ok(entry.text.includes('50020'));assert.ok(entry.text.includes('rpcbind'));
 }
 assert.deepEqual(t.text.zh.sourceBody!.map(b=>b.kind),t.text.en.sourceBody!.map(b=>b.kind));
 assert.equal(spawnSync('python3',['scripts/ceh26_m04_c05_content.py','--check']).status,0);
});
