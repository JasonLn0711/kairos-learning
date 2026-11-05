import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {allConceptTeachings,getPage,searchEntries} from '../src/lib/server/catalog.ts';
import type {SourceBlock} from '../src/lib/concepts.ts';
const id='CEH26-M04-C04';
const t=allConceptTeachings.find(t=>t.id===id)!;
const flatten=(b:SourceBlock)=>b.kind==='list'?b.items:b.kind==='answer'?[b.summary,...b.paragraphs]:'text'in b?[b.text]:[];
test('SMB review retains complete paired public manuscripts, one reference answer, and no learner state',()=>{
 assert.equal(t.contentVersion,'1.0.0');assert.equal(t.revision,1);assert.equal(t.publishedOn,'2026-11-05');assert.deepEqual(t.qa,[]);assert.equal(t.checks,undefined);
 const root='docs/sources/ceh26-m04-c04/';
 for(const [file,hash] of Object.entries(JSON.parse(readFileSync(root+'sha256.json','utf8'))))assert.equal(createHash('sha256').update(readFileSync(root+file)).digest('hex'),hash);
 const map=JSON.parse(readFileSync(root+'detailed-section-map.json','utf8'));
 for(const [lang,suffix] of [['zh','zh-TW'],['en','en']] as const){
  const blocks=t.text[lang].sourceBody!;assert.equal(blocks.filter(b=>b.kind==='heading').length,6);assert.equal(blocks.filter(b=>b.kind==='answer').length,1);
  assert.deepEqual(blocks.flatMap(b=>b.kind==='heading'?[{id:b.id,text:b.text}]:[]),map.map((m:any)=>({id:m.id,text:m[lang]})));
  const text=blocks.flatMap(flatten).join('\n');let cursor=0;
  for(const line of readFileSync(root+`teaching.${suffix}.md`,'utf8').split('\n')){const value=line.trim().replace(/^- /,'').replaceAll('**','');if(!value)continue;const at=text.indexOf(value,cursor);assert.ok(at>=cursor,`${lang}: missing or reordered source: ${value}`);cursor=at+value.length;}
  const answer=blocks.at(-1)!;assert.equal(answer.kind,'answer');if(answer.kind==='answer')assert.deepEqual(answer.paragraphs,readFileSync(root+`answer.${suffix}.md`,'utf8').trim().split('\n\n'));
  const entry=searchEntries.find(e=>e.id===id&&e.lang===lang)!;for(const block of blocks)for(const value of flatten(block))assert.ok(entry.text.includes(value));
  for(const token of ['LAB/labreader','Training','Finance','readme.txt','draft.txt','3.1.1','445','-N','-L','ACCESS_DENIED'])assert.ok(text.includes(token),token);
  const prefix=lang==='en'?'/en':'';const page=getPage(`${prefix}/courses/ceh/v13/m04/concepts/m04-04/`)!;
  assert.equal(page.conceptTeaching?.id,id);assert.equal(page.conceptNavigation?.previous?.id,'CEH26-M04-C03');assert.equal(page.conceptNavigation?.next?.id,'CEH26-M04-C05');assert.equal(page.conceptNavigation?.next?.href,null);
  assert.equal(getPage(`${prefix}/courses/ceh/v13/m04/concepts/ceh26-m04-c04/`),null);
 }
 assert.ok(!/Sentinel_|libfile_|deliveryId|learner_answers_received|你先前已收到|教材已交付不代表你已經理解|先前學過/.test(JSON.stringify(t)));
 const generated=spawnSync('python3',['scripts/ceh26_m04_c04_content.py','--check'],{encoding:'utf8'});assert.equal(generated.status,0,generated.stdout+generated.stderr);
});
