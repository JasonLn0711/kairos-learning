import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {aaseDisplayId,aaseConceptTitle} from '../src/lib/aase-labels.ts';
import {getPage,searchEntries} from '../src/lib/server/catalog.ts';
const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const before=read('docs/sources/aase/short-titles-2026-11-05/lessons.before.json');
const current=readdirSync('content/aase/lessons').map(f=>read('content/aase/lessons/'+f));
test('AASE public codes accept stable IDs or slugs and exclude course prefixes',()=>{
 assert.equal(aaseDisplayId('AASE-M04-C05'),'M04-05');assert.equal(aaseDisplayId('m04-05'),'M04-05');
 assert.equal(aaseConceptTitle({slug:'m04-05',title:'Example'}),'M04-05 · Example');
 for(const bad of ['CEH26-M04-C05','M04-C05','M4-5','AASE-M04-C05-extra',''])assert.throws(()=>aaseDisplayId(bad));
});
test('short-title migration preserves 49 articles, including the archived edition later replaced',()=>{
 assert.equal(before.length,49);assert.equal(current.length,49);assert.equal(new Set(before.map((l:any)=>l.id)).size,49);
 for(const old of before){
  const l=old.id==='AASE-M01-C01'?read('docs/sources/aase/m01-01/replacement-2026-11-06/previous-v1.0.3.json'):old.id==='AASE-M01-C02'?read('docs/sources/aase/m01-02/replacement-2026-11-06/previous-v1.0.2.json'):current.find(l=>l.id===old.id)!;const parts=old.contentVersion.split('.').map(Number);parts[2]++;
  assert.deepEqual(l,{...old,revision:old.revision+1,contentVersion:parts.join('.'),date:'2026-11-05'});
 }
});
test('search, neighbors and directory data retain identity with readable titles in both languages',()=>{
 for(const lang of ['zh','en'])for(const l of current){
  const module=l.id.slice(5,8).toLowerCase(),slug=module+'-'+l.id.slice(-2),path=(lang==='en'?'/en':'')+`/courses/aase/v1/${module}/concepts/${slug}/`;
  const page=getPage(path)!;assert.equal(page.aaseConcept!.id,l.id);
  assert.equal(searchEntries.find(e=>e.id===l.id&&e.lang===lang)!.title,aaseConceptTitle(page.aaseConcept!));
  for(const n of page.aaseNavigation)assert.match(n.displayId,/^M\d{2}-\d{2}$/);
 }
});
