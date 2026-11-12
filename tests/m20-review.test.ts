import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateM20Review,type M20Review} from '../src/lib/m20-review.ts';
const source=JSON.parse(readFileSync('content/ceh-m20-review.json','utf8')) as M20Review;
test('complete M20 source, exact original questions, options and ten bounded figures',()=>{
 const n=validateM20Review(structuredClone(source));
 assert.ok(n.sections.length>=13); // The original thirteen sections remain before supplements.
 const blocks=n.sections.slice(0,13).flatMap(s=>s.body);
 assert.equal(blocks.filter(b=>b.kind==='diagram').length,10);
 assert.equal(blocks.filter(b=>b.kind==='heading').length,27);
 const original=readFileSync('docs/sources/ceh-m20-review/2026-11-12/pasted-text-1.txt','utf8');
 const qs=n.sections[11].body.flatMap(b=>b.kind==='paragraph'?[b.text]:[]);
 assert.equal(qs.filter(t=>/^題 [1-8]｜/.test(t)).length,8);
 assert.equal(qs.filter(t=>/^[A-D]\. /.test(t)).length,32);
 const questionPart=original.split('## 十一、')[1].split('## 十二、')[0];
 const originalItems=questionPart.split(/\n\s*\n/).map(s=>s.trim()).filter(t=>/^題 [1-8]｜/.test(t)||/^[A-D]\. /.test(t)||/^(Noah,|Which |A system|Sarah,|You are Jordan)/.test(t));
 const adoptedItems=qs.filter(t=>/^題 [1-8]｜/.test(t)||/^[A-D]\. /.test(t)||/^(Noah,|Which |A system|Sarah,|You are Jordan)/.test(t));
 assert.deepEqual(adoptedItems,originalItems,'Original question/option sequence must remain exact');
 for(const t of qs.filter(t=>/^[A-D]\. /.test(t)||/^(Noah,|Which |A system|Sarah,|You are Jordan)/.test(t)))assert.ok(original.includes(t),t);
 assert.ok(!qs.includes('0 / 8'));
});
test('reject unsupported markup, duplicate anchors and diagrams, invalid geometry and unsafe sources',()=>{
 for(const mutate of [
  (n:M20Review)=>{(n as unknown as Record<string,unknown>).html='<script/>';},
  (n:M20Review)=>{n.sections[1].id=n.sections[0].id;},
  (n:M20Review)=>{n.sources[0].url='javascript:alert(1)';},
  (n:M20Review)=>{n.publishedOn='2026-02-30';},
  (n:M20Review)=>{n.revisedOn='2026-02-30';},
  (n:M20Review)=>{n.revisedOn='2026-11-11';},
  (n:M20Review)=>{n.revision=0;},
  (n:M20Review)=>{n.revision=1.5;},
  (n:M20Review)=>{const b=n.sections.flatMap(s=>s.body).find(b=>b.kind==='diagram')!;if(b.kind==='diagram')b.items.pop();},
 ]){const n=structuredClone(source);mutate(n);assert.throws(()=>validateM20Review(n));}
});
