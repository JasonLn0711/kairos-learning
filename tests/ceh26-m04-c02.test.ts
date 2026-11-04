import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {createHash} from 'node:crypto';import {spawnSync} from 'node:child_process';
import {concepts,allConceptTeachings,conceptCatalog,getPage,searchEntries} from '../src/lib/server/catalog.ts';import type {SourceBlock} from '../src/lib/concepts.ts';
const id='CEH26-M04-C02';const lesson=allConceptTeachings.find(t=>t.id===id)!;const flatten=(b:SourceBlock)=>b.kind==='list'?b.items:b.kind==='answer'?[b.summary,...b.paragraphs]:'text'in b?[b.text]:[];
test('complete DNS source is verbatim and the paired article preserves every paragraph, example, link and final question',()=>{
 const root='docs/sources/ceh26-m04-c02/';const raw=readFileSync(root+'teaching.zh-TW.md','utf8');assert.equal(raw.length,8170);assert.equal(raw.split('\n').length-1,265);assert.equal(createHash('sha256').update(raw).digest('hex'),'744c93e7d07c7a82131aaae007957decd1dccf4a6339c2322feda45d67c9471d');
 for(const [file,hash] of Object.entries(JSON.parse(readFileSync(root+'sha256.json','utf8'))))assert.equal(createHash('sha256').update(readFileSync(root+file)).digest('hex'),hash);
 assert.equal(lesson.contentVersion,'1.0.0');assert.equal(lesson.revision,1);assert.equal(lesson.publishedOn,'2026-11-04');assert.equal(lesson.date,'2026-11-04');assert.deepEqual(lesson.qa,[]);assert.equal(lesson.checks,undefined);
 for(const [lang,suffix] of [['zh','zh-TW'],['en','en']] as const){
  const body=lesson.text[lang].sourceBody!;assert.equal(body.filter(b=>b.kind==='heading').length,11);assert.equal(body.filter(b=>b.kind==='code').length,5);assert.equal(body.filter(b=>b.kind==='answer').length,1);
  const text=[lesson.text[lang].summary,...body.flatMap(flatten)].join('\n');let cursor=0;
  for(let line of readFileSync(root+`teaching.${suffix}.md`,'utf8').split('\n')){if(!line.trim()||line.startsWith('# ')||line.startsWith('```'))continue;line=line.replace(/^## /,'').replace(/^- /,'').replaceAll('**','');const at=text.indexOf(line,cursor);assert.ok(at>=cursor,`${lang} lost/reordered: ${line}`);cursor=at+line.length;}
  const answer=body.at(-1)!;assert.equal(answer.kind,'answer');if(answer.kind==='answer')assert.deepEqual(answer.paragraphs,[readFileSync(root+`answer.${suffix}.md`,'utf8').trim()]);
  const entry=searchEntries.find(e=>e.id===id&&e.lang===lang)!;assert.ok(entry.text.includes(id));for(const b of body)for(const value of flatten(b))assert.ok(entry.text.includes(value));
  assert.ok(!/deliveryId|13:06:45|Sentinel_|libfile_|sandbox:/.test(JSON.stringify(lesson)));
 }
 const shape=(lang:'zh'|'en')=>lesson.text[lang].sourceBody!.map(b=>({kind:b.kind,id:'id'in b?b.id:null,count:b.kind==='list'?b.items.length:0}));assert.deepEqual(shape('zh'),shape('en'));
 const code=(lang:'zh'|'en')=>lesson.text[lang].sourceBody!.flatMap(b=>b.kind==='code'?[b.text]:[]);assert.deepEqual(code('zh').slice(0,4),code('en').slice(0,4));assert.equal(code('zh')[4].split('\n').length,8);assert.equal(code('en')[4].split('\n').length,8);
 const links=(lang:'zh'|'en')=>lesson.text[lang].sourceBody!.flatMap(flatten).join(' ').match(/https:\/\/[^)]+/g);assert.deepEqual(links('zh'),links('en'));
 assert.equal(spawnSync('python3',['scripts/ceh26_m04_c02_content.py','--check']).status,0);
});
test('only new C01 and C02 are public, C02 is distinct from legacy DNS and its neighbors preserve the gate',()=>{
 assert.equal(concepts.find(c=>c.id===id)?.displayId,'CEH M04-02');
 for(const lang of ['zh','en'] as const){const prefix=lang==='en'?'/en':'';const page=getPage(`${prefix}/courses/ceh/v13/m04/concepts/m04-02/`)!;assert.equal(page.conceptTeaching?.id,id);assert.equal(page.conceptNavigation?.previous?.href,`${prefix}/courses/ceh/v13/m04/concepts/m04-01/`);assert.equal(page.conceptNavigation?.next?.id,'CEH26-M04-C03');assert.equal(page.conceptNavigation?.next?.href,null);assert.equal(getPage(`${prefix}/courses/ceh/v13/m04/concepts/ceh26-m04-c02/`),null);
  for(let i=3;i<=12;i++)assert.equal(getPage(`${prefix}/courses/ceh/v13/m04/concepts/m04-${String(i).padStart(2,'0')}/`),null);
  assert.equal(conceptCatalog.get('M04-02',lang),null);assert.ok(JSON.stringify(page.conceptTeaching).includes('40202'));assert.ok(!JSON.stringify(page.conceptTeaching).includes('11774'));
 }
 assert.deepEqual(allConceptTeachings.filter(t=>t.id.startsWith('CEH26-M04-')).map(t=>t.id).sort(),['CEH26-M04-C01','CEH26-M04-C02']);
});
