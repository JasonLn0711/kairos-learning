import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createNotesCatalog} from '../src/lib/ceh-notes.ts';
import {noteDiagramSpecs,noteReferenceImage,validateNoteDiagram} from '../src/lib/note-diagrams.ts';
const source='docs/sources/ceh-notes/2026-11-10/c06-c16-supplement-2026-11-12/';
const read=(name:string)=>JSON.parse(readFileSync(source+name,'utf8'));
const note=JSON.parse(readFileSync('content/ceh-notes/2026-11-10.json','utf8'));
test('complete C06–C16 chapters preserve all earlier content and enter both public search records',()=>{
 const before=read('before-note.json');assert.equal(note.contentVersion,'1.4.0');assert.equal(note.revision,7);assert.equal(note.publishedOn,before.publishedOn);
 assert.deepEqual(note.parts.slice(1),before.parts.slice(1));
 const catalog=createNotesCatalog([note],'2026-11-12');
 for(const lang of ['zh','en']){
  const adopted=read(`adopted.${lang}.json`);assert.equal(adopted.length,12);
  assert.equal(adopted.reduce((n:number,s:any)=>n+s.body.length,0),227);
  assert.equal(adopted.flatMap((s:any)=>s.body).filter((b:any)=>b.kind==='table').length,12);
  assert.equal(adopted.flatMap((s:any)=>s.body).filter((b:any)=>b.kind==='heading').length,29);
  const sections=note.parts[0].text[lang].sections;
  assert.deepEqual(sections.filter((s:any)=>s.id.startsWith('p1-c06-')),adopted);
  for(const s of before.parts[0].text[lang].sections)assert.deepEqual(sections.find((n:any)=>n.id===s.id),s,s.id);
  assert.ok(catalog.searchEntries.find((e:any)=>e.lang===lang)!.text.includes('SEC-2026-001'));
  assert.equal(adopted.at(-1).body.filter((b:any)=>b.kind==='list').length,5);
 }
});
test('all four paired diagrams retain fixed relations and terminal negative branches',()=>{
 const models=read('diagram-models.json');assert.equal(models.length,4);
 for(const m of models){
  const name=m.text.zh.name as keyof typeof noteDiagramSpecs;assert.deepEqual(noteDiagramSpecs[name],m.spec);
  assert.deepEqual(m.spec.rows.flat().sort((a:number,b:number)=>a-b),Array.from({length:m.spec.count},(_,i)=>i));
  for(const lang of ['zh','en']){
   validateNoteDiagram(m.text[lang]);
   assert.throws(()=>validateNoteDiagram({...m.text[lang],items:m.text[lang].items.slice(1)}));
   assert.throws(()=>validateNoteDiagram({...m.text[lang],html:'<script/>'}));
   assert.ok(noteReferenceImage('2026-11-10',name)?.endsWith(m.referenceImage));
  }
 }
 assert.deepEqual(models[0].spec.edges,[]);assert.deepEqual(models[1].spec.edges,[]);
 assert.deepEqual(models[2].spec.edges,[[0,1,''],[1,2,''],[2,3,''],[3,4,'']]);
 assert.deepEqual(models[3].spec.edges,[[0,1,''],[1,2,'no'],[1,3,'yes'],[3,4,'no'],[3,5,'yes'],[5,6,'']]);
 for(const [from] of models[3].spec.edges)assert.ok(![2,4].includes(from),'negative exits must stop');
});
test('the five user attachments and prior note retain their captured bytes',()=>{
 const hashes=read('sha256.json');assert.equal(Object.keys(hashes).length,6);
 for(const [name,hash] of Object.entries(hashes))assert.equal(createHash('sha256').update(readFileSync(source+name)).digest('hex'),hash,name);
});
