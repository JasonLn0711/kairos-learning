import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {createHash} from 'node:crypto';import {spawnSync} from 'node:child_process';
import {allConceptTeachings,getPage,searchEntries} from '../src/lib/server/catalog.ts';import type {SourceBlock} from '../src/lib/concepts.ts';
const id='CEH26-M04-C03';const t=allConceptTeachings.find(t=>t.id===id)!;
const flatten=(b:SourceBlock)=>b.kind==='list'?b.items:b.kind==='visual'?[b.visual.caption,b.visual.description,...b.visual.items.flatMap(x=>[x.title,x.body])]:b.kind==='answer'?[b.summary,...b.paragraphs]:'text'in b?[b.text]:[];
test('new FTP/SMTP lesson preserves both full manuscripts, separate evidence, answers, and safe paired diagrams',()=>{
 assert.equal(t.contentVersion,'1.0.1');assert.equal(t.revision,2);assert.equal(t.publishedOn,'2026-11-04');assert.deepEqual(t.qa,[]);
 const root='docs/sources/ceh26-m04-c03/';for(const [f,h] of Object.entries(JSON.parse(readFileSync(root+'sha256.json','utf8'))))assert.equal(createHash('sha256').update(readFileSync(root+f)).digest('hex'),h);
 for(const [lang,suffix] of [['zh','zh-TW'],['en','en']] as const){const b=t.text[lang].sourceBody!;assert.equal(b.filter(x=>x.kind==='heading').length,11);assert.equal(b.filter(x=>x.kind==='code').length,2);assert.equal(b.filter(x=>x.kind==='visual').length,2);assert.equal(b.filter(x=>x.kind==='answer').length,1);let cursor=0;const text=b.flatMap(flatten).join('\n');
 for(const line of readFileSync(root+`teaching.${suffix}.md`,'utf8').split('\n')){const value=line.trim().replace(/^#{1,3} /,'').replace(/^- /,'').replaceAll('**','');if(!value)continue;const at=text.indexOf(value,cursor);assert.ok(at>=cursor,`Full source order: ${value}`);cursor=at+value.length;}
 const entry=searchEntries.find(e=>e.id===id&&e.lang===lang)!;for(const x of b)for(const v of flatten(x))assert.ok(entry.text.includes(v));
 assert.ok(!/Sentinel_|libfile_|deliveryId|learner_answers_received/.test(JSON.stringify(t)));const prefix=lang==='en'?'/en':'';const page=getPage(`${prefix}/courses/ceh/v13/m04/concepts/m04-03/`)!;assert.equal(page.conceptTeaching?.id,id);assert.equal(page.conceptNavigation?.previous?.id,'CEH26-M04-C02');assert.equal(page.conceptNavigation?.next?.id,'CEH26-M04-C04');assert.equal(page.conceptNavigation?.next?.href,null);assert.equal(getPage(`${prefix}/courses/ceh/v13/m04/concepts/ceh26-m04-c03/`),null);
 }
 for(const script of ['ceh26_m04_c03_content.py','ceh26_m04_c03_diagrams.py']){const r=spawnSync('python3',['scripts/'+script,'--check'],{encoding:'utf8'});assert.equal(r.status,0,r.stdout+r.stderr);}
});
