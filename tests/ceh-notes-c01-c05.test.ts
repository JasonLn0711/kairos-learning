import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {noteDiagramSpecs,noteReferenceImage,validateNoteDiagram} from '../src/lib/note-diagrams.ts';
const source='docs/sources/ceh-notes/2026-11-10/c01-c05-replacement-2026-11-12/';
const models=JSON.parse(readFileSync(source+'diagram-models.json','utf8'));
test('five supplied CIA diagrams retain paired nodes and independent relationships',()=>{
 assert.equal(models.length,5);
 for(const m of models){
  const name=m.text.zh.name as keyof typeof noteDiagramSpecs;
  assert.deepEqual(noteDiagramSpecs[name],m.spec);
  assert.equal(m.text.en.name,name);
  for(const date of ['2026-11-10','2026-11-12'])assert.ok(noteReferenceImage(date,name)?.endsWith(m.referenceImage));
  assert.deepEqual(m.spec.rows.flat().sort((a:number,b:number)=>a-b),Array.from({length:m.spec.count},(_,i)=>i));
  for(const lang of ['zh','en']){
   validateNoteDiagram(m.text[lang]);
   assert.throws(()=>validateNoteDiagram({...m.text[lang],items:m.text[lang].items.slice(1)}));
   assert.throws(()=>validateNoteDiagram({...m.text[lang],html:'<script/>'}));
  }
 }
 assert.deepEqual(models[0].spec.edges,[]);
 assert.deepEqual(models[1].spec.edges,[]);
 assert.deepEqual(models[2].spec.edges,[[0,1,''],[2,3,''],[3,4,''],[3,5,'']]);
 assert.deepEqual(models[3].spec.edges,[[0,1,''],[1,2,''],[2,3,'']]);
 assert.deepEqual(models[4].spec.edges,[[0,1,''],[1,2,''],[3,4,''],[4,5,'']]);
});
test('supplied files and previous versions remain byte-for-byte intact',()=>{
 const hashes=JSON.parse(readFileSync(source+'sha256.json','utf8'));
 assert.equal(Object.keys(hashes).length,9);
 for(const [name,hash] of Object.entries(hashes))assert.equal(createHash('sha256').update(readFileSync(source+name)).digest('hex'),hash,name);
});
test('all nine complete paired chapters enter the note while earlier exam reasoning remains intact',()=>{
 const note=JSON.parse(readFileSync('content/ceh-notes/2026-11-12.json','utf8'));
 const historical=JSON.parse(readFileSync('content/ceh-notes/2026-11-10.json','utf8'));
 const before=JSON.parse(readFileSync(source+'before-note.json','utf8'));
 assert.equal(note.contentVersion,'1.0.0');assert.equal(note.publishedOn,'2026-11-12');assert.equal(historical.publishedOn,before.publishedOn);
 assert.deepEqual(historical.parts.slice(1),before.parts.slice(1));
 for(const lang of ['zh','en']){
  const adopted=JSON.parse(readFileSync(source+`adopted.${lang}.json`,'utf8'));
  assert.equal(adopted.length,9);
  assert.deepEqual(note.parts[0].text[lang].sections.filter((s:any)=>s.id.startsWith('p1-c01-')),adopted);
  for(const previous of before.parts[0].text[lang].sections){
   const current=historical.parts[0].text[lang].sections.find((s:any)=>s.id===previous.id);
   assert.deepEqual(current.body,previous.body,previous.id);
  }
 }
});
