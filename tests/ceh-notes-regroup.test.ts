import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createNotesCatalog,notePath} from '../src/lib/ceh-notes.ts';
const read=(path:string)=>JSON.parse(readFileSync(path,'utf8'));
const historical=read('content/ceh-notes/2026-11-10.json');
const current=read('content/ceh-notes/2026-11-12.json');
test('source dates retain original content and migrated anchors without duplicate chapters',()=>{
 const before=read('docs/sources/ceh-notes/2026-11-10/c01-c05-replacement-2026-11-12/before-note.json');
 assert.deepEqual(historical.parts,before.parts);
 assert.equal(historical.publishedOn,before.publishedOn);
 assert.equal(historical.contentVersion,'1.5.0');
 assert.equal(current.publishedOn,'2026-11-12');assert.equal(current.contentVersion,'1.0.0');
 for(const lang of ['zh','en']){
  const sections=current.parts[0].text[lang].sections;
  assert.equal(sections.length,21);
  assert.ok(sections.every((s:any)=>/^p1-c(?:01|06)-/.test(s.id)));
  assert.ok(historical.parts[0].text[lang].sections.every((s:any)=>!/^p1-c(?:01|06)-/.test(s.id)));
 }
 const catalog=createNotesCatalog([historical,current],'2026-11-12');
 assert.equal(catalog.notes.length,2);assert.equal(catalog.searchEntries.length,4);
 assert.equal(notePath('2026-11-12','en'),'/en/ceh-notes/2026-11-12/');
});
