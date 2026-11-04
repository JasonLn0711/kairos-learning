import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {allConceptTeachings,concepts,conceptCatalog,getPage,searchEntries} from '../src/lib/server/catalog.ts';
import {conceptPath,createConceptCatalog,type SourceBlock} from '../src/lib/concepts.ts';
const id='CEH26-M04-C01';const t=allConceptTeachings.find(t=>t.id===id)!;
const flatten=(b:SourceBlock)=>b.kind==='list'?b.items:b.kind==='answer'?[b.summary,...b.paragraphs]:'text'in b?[b.text]:[];
test('new C01 preserves every supplied paragraph, list item, command and final question in paired source order',()=>{
 assert.equal(t.contentVersion,'1.0.1');assert.equal(t.revision,2);assert.equal(t.publishedOn,'2026-11-04');assert.equal(t.date,'2026-11-04');assert.deepEqual(t.qa,[]);assert.equal(t.checks,undefined);
 assert.equal(concepts.find(c=>c.id===id)!.title.zh,readFileSync('docs/sources/ceh26-m04-c01/teaching.zh-TW.md','utf8').split('\n')[0].split('｜')[1]);
 const hashes=JSON.parse(readFileSync('docs/sources/ceh26-m04-c01/sha256.json','utf8'));
 assert.equal(hashes['teaching.zh-TW.md'],'bf37c0834ae83d35f189e09c596e3f16d3465a52ab4b43e0c5293b4e2ad6c770');
 for(const [name,hash] of Object.entries(hashes))assert.equal(createHash('sha256').update(readFileSync('docs/sources/ceh26-m04-c01/'+name)).digest('hex'),hash);
 for(const [lang,suffix] of [['zh','zh-TW'],['en','en']] as const){
  const body=t.text[lang].sourceBody!;assert.equal(body.filter(b=>b.kind==='heading').length,10);assert.equal(body.filter(b=>b.kind==='code').length,4);assert.equal(body.filter(b=>b.kind==='answer').length,1);
  const text=[t.text[lang].summary,...body.flatMap(flatten)].join('\n');let cursor=0;
  for(let line of readFileSync(`docs/sources/ceh26-m04-c01/teaching.${suffix}.md`,'utf8').split('\n')){
   if(!line.trim()||line.startsWith('# ')||line.startsWith('```'))continue;
   line=line.replace(/^## /,'').replace(/^- /,'').replaceAll('**','');const at=text.indexOf(line,cursor);assert.ok(at>=cursor,`${lang} missing/reordered: ${line}`);cursor=at+line.length;
  }
  const answer=body.at(-1)!;assert.equal(answer.kind,'answer');if(answer.kind==='answer')assert.deepEqual(answer.paragraphs,[readFileSync(`docs/sources/ceh26-m04-c01/answer.${suffix}.md`,'utf8').trim()]);
  const entry=searchEntries.find(e=>e.id===id&&e.lang===lang)!;assert.ok(entry.text.includes(id));for(const b of body)for(const value of flatten(b))assert.ok(entry.text.includes(value));
  assert.ok(!/deliveryId|Sentinel_|libfile_|sandbox:|11:14:26/.test(JSON.stringify(t)));
 }
 assert.equal(createHash('sha256').update(JSON.stringify({text:t.text,qa:t.qa})).digest('hex'),'0b34af70e3490bc8c406a70c8ce380d2920fd57eda756bb0d3e4b0ef5ce2b6e0');
 assert.deepEqual(t.text.zh.sourceBody!.map(b=>({kind:b.kind,id:'id'in b?b.id:null,count:b.kind==='list'?b.items.length:0})),t.text.en.sourceBody!.map(b=>({kind:b.kind,id:'id'in b?b.id:null,count:b.kind==='list'?b.items.length:0})));
 assert.deepEqual(t.text.zh.sourceBody!.flatMap(b=>b.kind==='code'?[b.text]:[]),t.text.en.sourceBody!.flatMap(b=>b.kind==='code'?[b.text]:[]));
 assert.deepEqual(t.text.zh.sourceBody!.flatMap(flatten).join(' ').match(/https:\/\/[^)]+/g),t.text.en.sourceBody!.flatMap(flatten).join(' ').match(/https:\/\/[^)]+/g));
 assert.equal(spawnSync('python3',['scripts/ceh26_m04_c01_content.py','--check']).status,0);
});
test('new C01 and C02 are published; nine pending units and reused C01 slug resolves only the new stable ID',()=>{
 for(const lang of ['zh','en'] as const){
  const prefix=lang==='en'?'/en':'';const route=`${prefix}/courses/ceh/v13/m04/concepts/m04-01/`;
  assert.equal(getPage(route)?.conceptTeaching?.id,id);const page=conceptCatalog.get(id,lang)!;assert.equal(page.navigation.previous?.id,'M03-08');assert.equal(page.navigation.next?.id,'CEH26-M04-C02');assert.equal(page.navigation.next?.href,`${prefix}/courses/ceh/v13/m04/concepts/m04-02/`);
  assert.equal(getPage(`${prefix}/courses/ceh/v13/m04/concepts/ceh26-m04-c01/`),null);
  for(let i=3;i<=10;i++)assert.equal(getPage(`${prefix}/courses/ceh/v13/m04/concepts/ceh26-m04-c${String(i).padStart(2,'0')}/`),null);
  for(let i=3;i<=12;i++)assert.equal(getPage(`${prefix}/courses/ceh/v13/m04/concepts/m04-${String(i).padStart(2,'0')}/`),null);
 }
 assert.equal(concepts.find(c=>c.id===id)?.displayId,'CEH M04-01');
 assert.equal(allConceptTeachings.filter(t=>t.id.startsWith('CEH26-M04-')).length,2);
});

test('all ten new M04 IDs map to conventional public slugs without exposing pending content or colliding with legacy IDs',()=>{
 for(let i=1;i<=10;i++)for(const lang of ['zh','en'] as const){
  const n=String(i).padStart(2,'0');const prefix=lang==='en'?'/en':'';
  assert.equal(conceptPath(`CEH26-M04-C${n}`,lang),`${prefix}/courses/ceh/v13/m04/concepts/m04-${n}/`);
 }
 const entry=concepts.find(c=>c.id===id)!;
 assert.throws(()=>createConceptCatalog([entry,{id:'M04-01',module:'m04',title:{zh:'舊版',en:'Legacy'}}],[],'2026-11-04'),/duplicate public path/);
 assert.equal(conceptPath('M03-08','zh'),'/courses/ceh/v13/m03/concepts/m03-08/');
});
