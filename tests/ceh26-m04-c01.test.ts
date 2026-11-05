import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {allConceptTeachings,concepts,conceptCatalog,getPage,searchEntries} from '../src/lib/server/catalog.ts';
import {conceptPath,createConceptCatalog,type SourceBlock} from '../src/lib/concepts.ts';
const id='CEH26-M04-C01';const t=allConceptTeachings.find(t=>t.id===id)!;
const flatten=(b:SourceBlock)=>b.kind==='table'?[...b.headers,...b.rows.flat()]:b.kind==='list'?b.items:b.kind==='answer'?[b.summary,...b.paragraphs]:'text'in b?[b.text]:[];
test('M04-01 replacement retains supplied source, all subsections, tables, commands and bounded answers',()=>{
 assert.equal(t.contentVersion,'1.1.0');assert.equal(t.revision,3);assert.equal(t.publishedOn,'2026-11-04');assert.equal(t.date,'2026-11-04');assert.deepEqual(t.qa,[]);assert.equal(t.checks,undefined);
 const root='docs/sources/ceh26-m04-c01/';
 const old=JSON.parse(readFileSync(root+'archive-v1.0.1/concept.json','utf8'));
 assert.equal(createHash('sha256').update(JSON.stringify({text:old.text,qa:old.qa})).digest('hex'),'0b34af70e3490bc8c406a70c8ce380d2920fd57eda756bb0d3e4b0ef5ce2b6e0');
 for(const manifest of ['sha256.json','supplied-sha256.json','archive-v1.0.1/sha256.json']){
  const base=root+(manifest.startsWith('archive')?'archive-v1.0.1/':'');
  for(const [name,hash] of Object.entries(JSON.parse(readFileSync(root+manifest,'utf8'))))assert.equal(createHash('sha256').update(readFileSync(base+name)).digest('hex'),hash);
 }
 const map=JSON.parse(readFileSync(root+'detailed-section-map.json','utf8'));
 assert.equal(map.length,70);
 for(const [lang,suffix] of [['zh','zh-TW'],['en','en']] as const){
  const body=t.text[lang].sourceBody!;assert.equal(body.filter(b=>b.kind==='heading').length,14);assert.equal(body.filter(b=>b.kind==='code').length,65);assert.equal(body.filter(b=>b.kind==='table').length,9);assert.equal(body.filter(b=>b.kind==='answer').length,1);
  assert.deepEqual(body.flatMap(b=>(b.kind==='heading'||b.kind==='paragraph')&&b.id?[{kind:b.kind,id:b.id,text:b.text}]:[]),map.map((m:any)=>({kind:m.kind,id:m.id,text:m[lang]})));
  const text=body.flatMap(flatten).join('\n');let cursor=0;
  for(let line of readFileSync(root+`teaching.${suffix}.md`,'utf8').split('\n')){
   line=line.trim();if(!line||line==='---'||line.startsWith('```')||/^[| :\-]+$/.test(line))continue;
   const values=line.startsWith('|')?line.slice(1,-1).split(/(?<!\\)\|/):[line.replace(/^#{1,3} /,'').replace(/^- /,'').replace(/^> /,'')];
   for(let value of values){value=value.replaceAll('**','').replaceAll('\\|','|').trim();const at=text.indexOf(value,cursor);assert.ok(at>=cursor,`${lang} missing/reordered: ${value}`);cursor=at+value.length;}
  }
  const answer=body.at(-1)!;assert.equal(answer.kind,'answer');if(answer.kind==='answer')assert.deepEqual(answer.paragraphs,[readFileSync(root+`answer.${suffix}.md`,'utf8').trim()]);
  const entry=searchEntries.find(e=>e.id===id&&e.lang===lang)!;assert.ok(entry.text.includes(id));for(const b of body)for(const value of flatten(b))assert.ok(entry.text.includes(value));
  for(const command of ['nmap -p 445 192.168.56.10','nmap -sV -p 445 192.168.56.10','smbclient -L 192.168.56.10 -p 445 -U labuser','smbclient -L 192.168.56.20 -U student'])assert.ok(text.includes(command));
  for(const token of ['Finance/salary.xlsx','NT_STATUS_ACCESS_DENIED','Confidential_Merger_Project','Research','Admin'])assert.ok(text.includes(token));
  assert.ok(!/deliveryId|Sentinel_|libfile_|sandbox:|utm_source=/.test(JSON.stringify(t)));
 }
 const shape=(l:'zh'|'en')=>t.text[l].sourceBody!.filter(b=>['heading','table','answer'].includes(b.kind)).map(b=>({kind:b.kind,id:'id'in b?b.id:null,rows:b.kind==='table'?b.rows.map(r=>r.length):null}));
 assert.deepEqual(shape('zh'),shape('en'));
 const r=spawnSync('python3',['scripts/ceh26_m04_c01_content.py','--check'],{encoding:'utf8'});assert.equal(r.status,0,r.stdout+r.stderr);
});
test('new C01–C04 are published; six pending units and reused C01 slug resolves only the new stable ID',()=>{
 for(const lang of ['zh','en'] as const){
  const prefix=lang==='en'?'/en':'';const route=`${prefix}/courses/ceh/v13/m04/concepts/m04-01/`;
  assert.equal(getPage(route)?.conceptTeaching?.id,id);const page=conceptCatalog.get(id,lang)!;assert.equal(page.navigation.previous?.id,'M03-08');assert.equal(page.navigation.next?.id,'CEH26-M04-C02');assert.equal(page.navigation.next?.href,`${prefix}/courses/ceh/v13/m04/concepts/m04-02/`);
  assert.equal(getPage(`${prefix}/courses/ceh/v13/m04/concepts/ceh26-m04-c01/`),null);
  for(let i=3;i<=10;i++)assert.equal(getPage(`${prefix}/courses/ceh/v13/m04/concepts/ceh26-m04-c${String(i).padStart(2,'0')}/`),null);
  for(let i=5;i<=12;i++)assert.equal(getPage(`${prefix}/courses/ceh/v13/m04/concepts/m04-${String(i).padStart(2,'0')}/`),null);
 }
 assert.equal(concepts.find(c=>c.id===id)?.displayId,'CEH M04-01');
 assert.equal(allConceptTeachings.filter(t=>t.id.startsWith('CEH26-M04-')).length,4);
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
