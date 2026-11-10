import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {createConceptCatalog,conceptPath} from '../src/lib/concepts.ts';
const load=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const t=load('content/concepts/ceh26-m05-c08.json'),entries=load('content/concepts.json');
test('M05-08 source custody, bilingual structure and same-model figures',()=>{
 for(const [p,h] of Object.entries(load('docs/sources/m05-08/source-sha256.json')))assert.equal(createHash('sha256').update(readFileSync('docs/sources/m05-08/'+p)).digest('hex'),h);
 execFileSync('python3',['scripts/m05_08_content.py','--check']);
 for(const lang of ['zh','en']){
  const b=t.text[lang].sourceBody;assert.equal(b.filter((x:any)=>x.kind==='heading').length,8);
  assert.deepEqual(b.filter((x:any)=>x.kind==='visual').map((x:any)=>[x.visual.kind,x.visual.items.length]),[['flow',4],['cards',3]]);
  assert.deepEqual(b.filter((x:any)=>x.kind==='list').map((x:any)=>x.items.length),[4,5,3]);
  assert.equal(b.find((x:any)=>x.kind==='answer').paragraphs.length,2);
  assert.equal(b.filter((x:any)=>x.kind==='answer').length,1);
 }
 assert.deepEqual(t.text.zh.sourceBody.map((x:any)=>[x.kind,x.id]),t.text.en.sourceBody.map((x:any)=>[x.kind,x.id]));assert.deepEqual(t.qa,[]);
});
test('M05-08 adopts every supplied Chinese passage in order, including all A/B/C branches',()=>{
 const flat=t.text.zh.sourceBody.flatMap((b:any)=>b.text?[b.text]:b.kind==='list'?b.items:b.kind==='answer'?[b.summary,...b.paragraphs]:[b.visual.caption,b.visual.description,...b.visual.items.flatMap((i:any)=>[i.title,i.body])]).join('\n');let cursor=0;
 const norm=(s:string)=>s.replaceAll('**','').replaceAll('`','');
 for(const chunk of readFileSync('docs/sources/m05-08/original.zh.md','utf8').trim().split(/\n\s*\n/).slice(1)){
  const passages=chunk.startsWith('- ')||/^\d+\. /.test(chunk)?chunk.split('\n').map(s=>s.replace(/^(?:- |\d+\. )/,'')):[chunk];
  for(const p of passages){const text=norm(p),at=flat.indexOf(text,cursor);assert.ok(at>=0,text);cursor=at+text.length;}
 }
});
test('M05-08 stable path, C07 identity and draft/future boundaries',()=>{
 assert.equal(conceptPath(t.id,'en'),'/en/courses/ceh/v13/m05/concepts/m05-08/');
 const i=entries.findIndex((x:any)=>x.id===t.id);assert.equal(entries[i-1].id,'CEH26-M05-C07');
 assert.deepEqual(entries[i-1],load('docs/sources/m05-08/c07-pending-identity.json'));
 for(const v of [t,{...t,status:'published',publishedOn:'2099-01-01'}])assert.equal(createConceptCatalog(entries,[v],'2026-11-10').get(t.id,'zh'),null);
});
test('M05-08 rejects altered relationships, arbitrary fields and asset paths',()=>{
 for(const mutation of [(v:any)=>v.visual.items.pop(),(v:any)=>v.visual.kind='cards',(v:any)=>v.visual.markup='<svg/>',(v:any)=>v.visual.items[0].path='M0 0',(v:any)=>v.src='/images/ceh/m05-08-other-zh.svg']){
  const broken=structuredClone(t);mutation(broken.text.zh.sourceBody.find((x:any)=>x.kind==='visual'));assert.throws(()=>createConceptCatalog(entries,[broken],'2026-11-10'),/invalid remediation diagram/);
 }
});
