import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {allConceptTeachings,getPage,searchEntries,conceptCatalog} from '../src/lib/server/catalog.ts';
import type {SourceBlock} from '../src/lib/concepts.ts';
const id='CEH26-M04-C06';
const teaching=allConceptTeachings.find(t=>t.id===id)!;
const root='docs/sources/ceh26-m04-c06/';
const flatten=(b:SourceBlock):string[]=>b.kind==='list'?b.items:b.kind==='answer'?[b.summary,...b.paragraphs]:'text'in b?[b.text]:[];
test('C06 preserves complete Unix/Linux and NFS manuscripts, source custody and paired evidence',()=>{
 assert.equal(teaching.contentVersion,'1.0.0');assert.equal(teaching.revision,1);
 assert.equal(teaching.date,'2026-11-05');assert.equal(teaching.publishedOn,'2026-11-05');assert.deepEqual(teaching.qa,[]);
 for(const [file,hash] of Object.entries(JSON.parse(readFileSync(root+'sha256.json','utf8'))))assert.equal(createHash('sha256').update(readFileSync(root+file)).digest('hex'),hash,file);
 for(const lang of ['zh','en'] as const){
  const blocks=teaching.text[lang].sourceBody!;
  assert.equal(blocks.filter(b=>b.kind==='heading').length,8);assert.equal(blocks.filter(b=>b.kind==='answer').length,1);assert.equal(blocks.filter(b=>b.kind==='visual').length,0);
  const text=blocks.flatMap(flatten).join('\n');
  for(const token of ['getent passwd learner','id learner','NSS','1001','2001','3000','sec=sys','AUTH_SYS','root_squash','all_squash','owner_group','rw-------','rw-r-----','report.txt','showmount -e','2049','111','krb5i','krb5p'])assert.ok(text.includes(token),token);
  assert.equal((text.match(/https:\/\/[^)]+/g)||[]).length,18);
  assert.ok(!/chatgpt-content-reference|sandbox:|message_id|delivery_id/.test(text));
  const entry=searchEntries.find(e=>e.id===id&&e.lang===lang)!;
  for(const segment of blocks.flatMap(flatten))assert.ok(entry.text.includes(segment));
 }
 assert.deepEqual(teaching.text.zh.sourceBody!.map(b=>[b.kind,'id'in b?b.id:null,b.kind==='list'?b.items.length:0]),teaching.text.en.sourceBody!.map(b=>[b.kind,'id'in b?b.id:null,b.kind==='list'?b.items.length:0]));
 const result=spawnSync('python3',['scripts/ceh26_m04_c06_content.py','--check'],{encoding:'utf8'});assert.equal(result.status,0,result.stdout+result.stderr);
});
test('C06 short routes, neighboring navigation and remaining unpublished gates share the catalog',()=>{
 for(const lang of ['zh','en'] as const){
  const prefix=lang==='en'?'/en':'';const path=`${prefix}/courses/ceh/v13/m04/concepts/m04-06/`;
  const page=getPage(path)!;assert.equal(page.conceptTeaching?.id,id);assert.equal(page.concepts.find(c=>c.id===id)?.displayId,'M04-06');
  assert.equal(page.conceptNavigation?.previous?.href,`${prefix}/courses/ceh/v13/m04/concepts/m04-05/`);
  assert.equal(page.conceptNavigation?.next?.id,'CEH26-M04-C07');assert.equal(page.conceptNavigation?.next?.href,null);
  assert.equal(conceptCatalog.get('CEH26-M04-C05',lang)?.navigation.next?.href,path);
  assert.equal(getPage(`${prefix}/courses/ceh/v13/m04/concepts/ceh26-m04-c06/`),null);
  for(const n of [7,8,9,10,11,12])assert.equal(getPage(`${prefix}/courses/ceh/v13/m04/concepts/m04-${String(n).padStart(2,'0')}/`),null);
  assert.equal(conceptCatalog.get('M04-06',lang),null);
 }
});
