import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createConceptCatalog,conceptPath} from '../src/lib/concepts.ts';
const load=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const t=load('content/concepts/ceh26-m05-c07.json'),entries=load('content/concepts.json');
test('M05-07 retains full source, bilingual shape and editorial answer only',()=>{
 execFileSync('python3',['scripts/m05_07_content.py','--check']);
 assert.deepEqual(t.qa,[]);assert.equal(t.status,'draft');assert.equal(t.publishedOn,'2026-11-10');
 for(const lang of ['zh','en']){
  const b=t.text[lang].sourceBody;
  assert.equal(b.filter((x:any)=>x.kind==='heading').length,8);
  assert.equal(b.filter((x:any)=>x.kind==='answer').length,1);
  assert.equal(b.find((x:any)=>x.kind==='answer').paragraphs.length,3);
  assert.equal(b.filter((x:any)=>x.kind==='visual').length,0);
  for(const url of ['https://csrc.nist.gov/glossary/term/false_positive','https://csrc.nist.gov/glossary/term/false_negative','https://access.redhat.com/security/updates/backporting','https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-115.pdf','https://docs.tenable.com/quick-reference/vulnerability-management-adoption-roadmap/Content/validation-tuning.htm'])assert.ok(JSON.stringify(b).includes(url));
 }
 assert.deepEqual(t.text.zh.sourceBody.map((x:any)=>[x.kind,x.id]),t.text.en.sourceBody.map((x:any)=>[x.kind,x.id]));
 const renderer=readFileSync('src/lib/components/SourceBody.svelte','utf8');assert.match(renderer,/<details class="reference-answer" id=\{block.id\}>/);
});
test('M05-07 replaces only the equivalent pending registry record',()=>{
 const before=load('docs/sources/m05-07/registry-before.json');
 assert.deepEqual(entries.filter((x:any)=>x.id!==t.id),before.filter((x:any)=>x.id!=='M05-11'));
 assert.equal(entries[entries.findIndex((x:any)=>x.id==='CEH26-M05-C06')+1].id,t.id);
 assert.equal(entries.find((x:any)=>x.id===t.id).displayId,'M05-07');
});
test('M05-07 draft and future body never enter the published catalog',()=>{
 for(const lang of ['zh','en'] as const){
 assert.equal(conceptPath(t.id,lang),(lang==='en'?'/en':'')+'/courses/ceh/v13/m05/concepts/m05-07/');
 assert.equal(createConceptCatalog(entries,[t],'2026-11-10').get(t.id,lang),null);
 const published=structuredClone(t);published.status='published';published.publishedOn='2026-11-10';assert.ok(createConceptCatalog(entries,[published],'2026-11-10').get(t.id,lang));
 published.publishedOn='2099-01-01';assert.equal(createConceptCatalog(entries,[published],'2026-11-10').get(t.id,lang),null);
 }
});
test('ordered source lists are typed, bilingual and preserve existing unordered defaults',()=>{
 const lists=t.text.zh.sourceBody.filter((x:any)=>x.kind==='list'&&x.ordered);
 assert.deepEqual(lists.map((x:any)=>x.items.length),[4,3]);
 for(const value of ['true',1,null]){
  const bad=structuredClone(t);bad.text.zh.sourceBody.find((x:any)=>x.kind==='list').ordered=value;
  assert.throws(()=>createConceptCatalog(entries,[bad],'2026-11-10'),/invalid source list/);
 }
 const mismatch=structuredClone(t);mismatch.text.en.sourceBody.find((x:any)=>x.kind==='list'&&x.ordered).ordered=false;
 assert.throws(()=>createConceptCatalog(entries,[mismatch],'2026-11-10'),/bilingual ordered lists differ/);
 const legacy=structuredClone(t);for(const lang of ['zh','en'])for(const b of legacy.text[lang].sourceBody)if(b.kind==='list')delete b.ordered;
 assert.doesNotThrow(()=>createConceptCatalog(entries,[legacy],'2026-11-10'));
});
