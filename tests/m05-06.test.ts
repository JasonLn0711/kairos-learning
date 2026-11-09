import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {createConceptCatalog,conceptPath} from '../src/lib/concepts.ts';
const load=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const t=load('content/concepts/ceh26-m05-c06.json'),entries=load('content/concepts.json');
test('M05-06 preserves exact public source and complete paired teaching',()=>{
 for(const [p,h] of Object.entries(load('docs/sources/m05-06/source-sha256.json')))assert.equal(createHash('sha256').update(readFileSync('docs/sources/m05-06/'+p)).digest('hex'),h);
 execFileSync('python3',['scripts/m05_06_content.py','--check']);
 for(const lang of ['zh','en']){
  const b=t.text[lang].sourceBody;
  assert.equal(b.filter((x:any)=>x.kind==='heading').length,8);
  assert.deepEqual(b.filter((x:any)=>x.kind==='visual').map((x:any)=>[x.visual.kind,x.visual.items.length]),[['cards',2],['cards',3]]);
  assert.deepEqual(b.filter((x:any)=>x.kind==='list').map((x:any)=>x.items.length),[2,3]);
  const a=b.find((x:any)=>x.kind==='answer');assert.equal(a.paragraphs.length,2);assert.match(a.paragraphs.join(' '),/backport/);
 }
 assert.deepEqual(t.text.zh.sourceBody.map((x:any)=>[x.kind,x.id]),t.text.en.sourceBody.map((x:any)=>[x.kind,x.id]));assert.deepEqual(t.qa,[]);
});
test('M05-06 stable identity, C07 handoff and shared draft/future gate',()=>{
 assert.equal(conceptPath(t.id,'en'),'/en/courses/ceh/v13/m05/concepts/m05-06/');
 const i=entries.findIndex((x:any)=>x.id===t.id);assert.equal(entries[i-1].id,'CEH26-M05-C05');assert.equal(entries[i+1].id,'CEH26-M05-C07');
 for(const value of [t,{...t,status:'published',publishedOn:'2099-01-01'}])assert.equal(createConceptCatalog(entries,[value],'2026-11-09').get(t.id,'zh'),null);
});
test('M05-06 rejects unknown paths, invented stages and arbitrary figure metadata',()=>{
 for(const mutate of [(v:any)=>v.visual.items.pop(),(v:any)=>v.visual.kind='flow',(v:any)=>v.src='/images/ceh/m05-06-other-zh.svg',(v:any)=>v.visual.items[0].markup='<svg/>']){
  const broken=structuredClone(t);mutate(broken.text.zh.sourceBody.find((x:any)=>x.kind==='visual'));assert.throws(()=>createConceptCatalog(entries,[broken],'2026-11-09'),/invalid scan coverage diagram/);
 }
});
test('M05-06 adopts every original Chinese teaching passage in source order',()=>{
 const flat=t.text.zh.sourceBody.flatMap((b:any)=>b.text?[b.text]:b.kind==='list'?b.items:b.kind==='answer'?[b.summary,...b.paragraphs]:[b.visual.caption,b.visual.description,...b.visual.items.flatMap((i:any)=>[i.title,i.body])]).join('\n');
 const norm=(s:string)=>s.replaceAll('**','').replaceAll('`','');
 let cursor=0;
 for(const chunk of readFileSync('docs/sources/m05-06/original.zh.md','utf8').trim().split(/\n\s*\n/).slice(1)){
  const passages=chunk.startsWith('- ')||/^\d+\. /.test(chunk)?chunk.split('\n').map(s=>s.replace(/^(?:- |\d+\. )/,'')):[chunk.replace(/^## /,'')];
  for(const passage of passages){const text=norm(passage),at=flat.indexOf(text,cursor);assert.ok(at>=0,text);cursor=at+text.length;}
 }
});
