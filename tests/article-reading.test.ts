import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import guides from '../content/reading-support/ceh-m01-m02.json' with {type:'json'};
import {readingGuide,readingText,readableDiagram} from '../src/lib/article-reading.ts';
import {allConceptTeachings,lessons,searchEntries} from '../src/lib/server/catalog.ts';
test('every published M01–M02 article has bilingual actionable reading support in search',()=>{
 const ids=[...allConceptTeachings.filter(c=>/^M0[12]-|^M03-0[1-5]$/.test(c.id)).map(c=>c.id),...lessons.filter(l=>l.course==='ceh'&&['m01','m02'].includes(l.module)).map(l=>l.id)];
 assert.deepEqual(Object.keys(guides).sort(),ids.sort());assert.equal(ids.length,23);
 for(const id of ids)for(const lang of ['zh','en']){
  const g=readingGuide(id,lang)!;assert.deepEqual(Object.keys(g).sort(),['goal','output','route','startingPoint']);
  for(const text of readingText(id,lang)){assert.ok(text.trim().length);assert.ok(searchEntries.find(e=>e.id===id&&e.lang===lang)?.text.includes(text));}
 }
 assert.equal(readingGuide('M03-06','zh'),undefined);
});
test('readable diagrams are reproducible, bilingual and preserve reviewed SVG boundary',()=>{
 const result=spawnSync('python3',['scripts/build-readable-diagrams.py','--check'],{encoding:'utf8'});assert.equal(result.status,0,result.stderr);
 for(const c of allConceptTeachings.filter(c=>c.id==='M01-07'||c.id.startsWith('M02-')))for(const lang of ['zh','en'] as const)for(const b of c.text[lang].sourceBody??[]){
  if(b.kind==='visual'||b.kind==='sourceImage'){const d=readableDiagram(b.src,lang);assert.ok(d?.description);assert.ok(d.rows.length);assert.ok(d.rows.flat().every(x=>typeof x==='string'&&x.length));}
 }
 assert.equal(readableDiagram('https://example.com/unreviewed.svg','zh'),undefined);
});
