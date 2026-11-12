import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {noteReferenceImage,validateNoteDiagram,type NoteDiagram} from '../src/lib/note-diagrams.ts';
const models=JSON.parse(readFileSync(new URL('../docs/sources/ceh-notes/2026-11-12/controls-risk-supplement/diagrams.json',import.meta.url),'utf8')).diagrams;
test('thirteen bilingual whitelisted models retain image order and source ownership',()=>{
 assert.equal(models.length,13);
 for(const m of models)for(const lang of ['zh','en']){validateNoteDiagram(m[lang]);assert.ok(noteReferenceImage('2026-11-12',m[lang].name)?.endsWith(`/controls-risk-supplement/image-${m.reference}.png`));}
 for(const name of ['ciaobjectives','securityframeworks'])assert.match(noteReferenceImage('2026-11-12',name)!,/2026-11-10/);
 assert.equal(noteReferenceImage('2026-11-13','riskmatrix'),null);
});
test('diagram boundaries reject unknown names, item counts and extra markup fields',()=>{
 for(const change of [{name:'arbitrary'},{items:[]},{html:'<script>'},{caption:''}])assert.throws(()=>validateNoteDiagram({...models[0].zh,...change} as NoteDiagram));
});
