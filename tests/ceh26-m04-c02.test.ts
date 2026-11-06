import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {createHash} from 'node:crypto';import {spawnSync} from 'node:child_process';
import {concepts,allConceptTeachings,conceptCatalog,getPage,searchEntries} from '../src/lib/server/catalog.ts';import type {SourceBlock} from '../src/lib/concepts.ts';
const id='CEH26-M04-C02';const lesson=allConceptTeachings.find(t=>t.id===id)!;
const flatten=(b:SourceBlock)=>b.kind==='list'?b.items:b.kind==='table'?[...b.headers,...b.rows.flat()]:b.kind==='visual'?[b.visual.caption,b.visual.description,...b.visual.items.flatMap(n=>[n.title,n.body])]:b.kind==='answer'?[b.summary,...b.paragraphs]:'text'in b?[b.text]:[];
test('DNS replacement preserves original edition, complete supplied prose, paired subsections and model-derived figures',()=>{
 const root='docs/sources/ceh26-m04-c02/';const archive=root+'revision-2026-11-04/archive-v1.0.0/';
 assert.equal(createHash('sha256').update(readFileSync(archive+'teaching.zh-TW.md')).digest('hex'),'744c93e7d07c7a82131aaae007957decd1dccf4a6339c2322feda45d67c9471d');
 for(const [file,hash] of Object.entries(JSON.parse(readFileSync(root+'sha256.json','utf8'))))assert.equal(createHash('sha256').update(readFileSync(root+file)).digest('hex'),hash);
 assert.equal(lesson.contentVersion,'1.1.1');assert.equal(lesson.revision,3);assert.equal(lesson.publishedOn,'2026-11-04');assert.equal(lesson.date,'2026-11-05');assert.deepEqual(lesson.qa,[]);assert.equal(lesson.checks,undefined);
 const map=JSON.parse(readFileSync(root+'revision-2026-11-04/detailed-section-map.json','utf8'));
 for(const lang of ['zh','en'] as const){const body=lesson.text[lang].sourceBody!;assert.equal(body.filter(b=>b.kind==='table').length,12);assert.equal(body.filter(b=>b.kind==='visual').length,2);assert.equal(body.filter(b=>b.kind==='answer').length,1);
  assert.deepEqual(body.filter(b=>('id'in b)&&b.kind!=='answer').map(b=>({id:'id'in b?b.id:null,text:'text'in b?b.text:null})),map.map((m:any)=>({id:m.id,text:m[lang].replaceAll('`','')})));
  const entry=searchEntries.find(e=>e.id===id&&e.lang===lang)!;for(const b of body)for(const value of flatten(b))assert.ok(entry.text.includes(value));
  assert.ok(!/deliveryId|Sentinel_|libfile_|sandbox:|chatgpt-content-reference/.test(JSON.stringify(lesson)));
  const code=body.flatMap(b=>b.kind==='code'?[b.text]:[]).join('\n');for(const cmd of ['dig @192.0.2.53 www.example.test A','dig example.com A','dig +tcp example.com A','dig +short example.com A','dig +dnssec example.com A','resolvectl status'])assert.ok(code.includes(cmd),cmd);
 }
 assert.equal(spawnSync('python3',['scripts/ceh26_m04_c02_content.py','--check']).status,0);
 assert.equal(spawnSync('python3',['scripts/ceh26_m04_c02_diagrams.py','--check']).status,0);
 assert.equal(spawnSync('python3',['scripts/verify-ceh26-m04-c02.py']).status,0);
});
test('C01–C05 are public and their neighboring publication gates stay intact',()=>{
 assert.equal(concepts.find(c=>c.id===id)?.displayId,'CEH M04-02');
 for(const lang of ['zh','en'] as const){const prefix=lang==='en'?'/en':'';const page=getPage(`${prefix}/courses/ceh/v13/m04/concepts/m04-02/`)!;assert.equal(page.conceptTeaching?.id,id);assert.equal(page.conceptNavigation?.previous?.href,`${prefix}/courses/ceh/v13/m04/concepts/m04-01/`);assert.equal(page.conceptNavigation?.next?.id,'CEH26-M04-C03');assert.equal(page.conceptNavigation?.next?.href,`${prefix}/courses/ceh/v13/m04/concepts/m04-03/`);assert.equal(getPage(`${prefix}/courses/ceh/v13/m04/concepts/ceh26-m04-c02/`),null);
  for(const i of [6,7,9,10,11,12])assert.equal(getPage(`${prefix}/courses/ceh/v13/m04/concepts/m04-${String(i).padStart(2,'0')}/`),null);
  assert.equal(conceptCatalog.get('M04-02',lang),null);assert.ok(!JSON.stringify(page.conceptTeaching).includes('11774'));
 }
 assert.deepEqual(allConceptTeachings.filter(t=>t.id.startsWith('CEH26-M04-')&&t.status==='published').map(t=>t.id).sort(),['CEH26-M04-C01','CEH26-M04-C02','CEH26-M04-C03','CEH26-M04-C04','CEH26-M04-C05','CEH26-M04-C08']);
});
