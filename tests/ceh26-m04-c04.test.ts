import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {allConceptTeachings,getPage,searchEntries} from '../src/lib/server/catalog.ts';
import type {SourceBlock} from '../src/lib/concepts.ts';
const id='CEH26-M04-C04';
const t=allConceptTeachings.find(t=>t.id===id)!;
const root='docs/sources/ceh26-m04-c04/replacement-2026-11-05/';
const flatten=(b:SourceBlock):string[]=>b.kind==='visual'?[b.visual.caption,b.visual.description,...b.visual.items.flatMap(x=>[x.title,x.body])]:b.kind==='table'?[...b.headers,...b.rows.flat()]:b.kind==='list'?b.items:b.kind==='answer'?[b.summary,...b.paragraphs]:'text'in b?[b.text]:[];
test('M04-04 preserves the complete supplied SMB scope, paired structure, source custody and publication gate',()=>{
 assert.equal(t.contentVersion,'1.1.0');assert.equal(t.revision,2);assert.equal(t.publishedOn,'2026-11-05');assert.deepEqual(t.qa,[]);
 for(const [file,hash] of Object.entries(JSON.parse(readFileSync(root+'sha256.json','utf8'))))assert.equal(createHash('sha256').update(readFileSync(root+file)).digest('hex'),hash);
 for(const lang of ['zh','en'] as const){
  const blocks=t.text[lang].sourceBody!;assert.equal(blocks.filter(b=>b.kind==='heading').length,11);assert.equal(blocks.filter(b=>b.kind==='answer').length,1);assert.equal(blocks.filter(b=>b.kind==='visual').length,2);
  assert.equal(blocks.filter(b=>b.kind==='table').length,11);assert.equal(blocks.filter(b=>b.kind==='code').length,39);
  const text=blocks.flatMap(flatten).join('\n');
  for(const token of ['Training','Finance','readme.txt','draft.txt','confidential.txt','student01','3.1.1','445','-N','-L','ACCESS_DENIED','ABE','NTFS','Kerberos'])assert.ok(text.includes(token),token);
  assert.ok(!/chatgpt-content-reference|sandbox:/.test(text));
  const prefix=lang==='en'?'/en':'';const page=getPage(`${prefix}/courses/ceh/v13/m04/concepts/m04-04/`)!;
  assert.equal(page.conceptTeaching?.id,id);assert.equal(page.concepts.find(c=>c.id===id)?.displayId,'M04-04');assert.equal(page.conceptNavigation?.previous?.id,'CEH26-M04-C03');assert.equal(page.conceptNavigation?.next?.id,'CEH26-M04-C05');
  assert.equal(getPage(`${prefix}/courses/ceh/v13/m04/concepts/ceh26-m04-c04/`),null);
  const entry=searchEntries.find(e=>e.id===id&&e.lang===lang)!;for(const value of blocks.flatMap(flatten))assert.ok(entry.text.includes(value));
 }
 const zh=t.text.zh.sourceBody!,en=t.text.en.sourceBody!;
 assert.deepEqual(zh.map(b=>[b.kind,'id'in b?b.id:null]),en.map(b=>[b.kind,'id'in b?b.id:null]));
 assert.deepEqual(zh.filter(b=>b.kind==='table').map(b=>[b.headers.length,b.rows.length]),en.filter(b=>b.kind==='table').map(b=>[b.headers.length,b.rows.length]));
 const generated=spawnSync('python3',['scripts/ceh26_m04_c04_content.py','--check'],{encoding:'utf8'});assert.equal(generated.status,0,generated.stdout+generated.stderr);
});
test('SMB downloadable diagrams use escaped static SVG, match the semantic models and stay under the asset limit',()=>{
 const models=JSON.parse(readFileSync(root+'diagram-models.json','utf8'));
 for(const pair of Object.values(models) as any[])for(const block of Object.values(pair) as any[]){
  const bytes=readFileSync('site'+block.src);assert.ok(bytes.length<100000);const svg=bytes.toString();
  assert.ok(svg.includes('viewBox="0 0 900 675"'));assert.ok(!/<(?:script|image|foreignObject|use)\b|\bon\w+=|href=/i.test(svg));
  assert.ok(svg.includes(block.visual.caption.replaceAll('&','&amp;')));
  for(const item of block.visual.items)for(const token of item.title.split('｜'))assert.ok(svg.replace(/<[^>]+>/g,'').replace(/\s/g,'').includes(token.replace(/\s/g,'')),token);
 }
});
