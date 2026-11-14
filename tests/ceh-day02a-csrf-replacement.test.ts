import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {validateM20Review,type M20Review} from '../src/lib/m20-review.ts';
import {noteBodyText} from '../src/lib/ceh-notes.ts';
import {noteDiagramSpecs,validateNoteDiagram,type NoteDiagram} from '../src/lib/note-diagrams.ts';
const root='docs/sources/ceh-day02-a/2026-11-14/csrf-replacement/';
const data=JSON.parse(readFileSync('content/ceh-day02-a.json','utf8')) as M20Review;
const before=JSON.parse(readFileSync(root+'published-v1.3.0.json','utf8')) as M20Review;
const adopted=JSON.parse(readFileSync(root+'adopted-body.json','utf8')) as M20Review['sections'][number]['body'];
const part=data.sections.find(s=>s.id==='p1-csrf-browser-intro')!;
test('Replacement adopts all fourteen sections, twenty-six subheadings and three three-option scenarios in one closed-capable part',()=>{
 validateM20Review(data);assert.equal(data.contentVersion,'1.4.0');assert.equal(data.revision,6);assert.equal(data.publishedOn,before.publishedOn);assert.equal(part.collapsible,true);assert.deepEqual(part.body,adopted);
 assert.equal(adopted.filter(b=>b.kind==='heading'&&b.id?.startsWith('p1-csrf-browser-section-')).length,14);assert.equal(adopted.filter(b=>b.kind==='heading'&&b.id?.startsWith('p1-csrf-v2-subsection-')).length,26);assert.equal(adopted.filter(b=>b.kind==='code').length,24);assert.equal(adopted.filter(b=>b.kind==='table').length,8);
 assert.equal(adopted.filter(b=>b.kind==='paragraph'&&/^情境 [1-3]：/.test(b.text)).length,3);for(const l of ['A','B','C'])assert.equal(adopted.filter(b=>b.kind==='paragraph'&&b.text.startsWith(l+'. ')).length,3);assert.equal(adopted.filter(b=>b.kind==='answer').length,0);
 const text=adopted.flatMap(noteBodyText).join('\n');for(const key of ['學習診斷假設','Target Selection','Delivery','XS-Leaks','localhost:3000','localhost:8000','MFA','Sec-Fetch-Site','Session 還有效','NIST','不是知道Session Token','不提交、批改'])assert.ok(text.includes(key),key);assert.doesNotMatch(text,/chatgpt-mermaid|@keyframes|utm_source|提交作答並解析|博士|碩士/);
 const raw=readFileSync(root+'pasted-text-1.txt','utf8').split('\n'),ledger=JSON.parse(readFileSync(root+'line-adoption.json','utf8'));assert.deepEqual(ledger.map((e:{line:number})=>e.line),raw.flatMap((s,i)=>s.trim()?[i+1]:[]));for(const e of ledger)assert.equal(e.source,raw[e.line-1]);
 for(const line of readFileSync(root+'SHA256SUMS','utf8').trim().split('\n')){const [sha,name]=line.split('  ');assert.equal(createHash('sha256').update(readFileSync(root+name)).digest('hex'),sha);}
});
test('Only superseded CSRF material is replaced; all other sections, prose and anchors are retained',()=>{
 assert.equal(data.sections.length,before.sections.length+1);assert.deepEqual(data.sections.filter(s=>!s.collapsible).map(s=>[s.id,s.heading]),before.sections.map(s=>[s.id,s.heading]));assert.equal(data.sections.findIndex(s=>s.id===part.id),data.sections.findIndex(s=>s.id==='p1-section-07')+1);
 for(const old of before.sections){let expected=structuredClone(old.body);if(old.id==='p1-section-07')for(const path of ['docs/sources/ceh-day02-a/2026-11-14/csrf-browser/adopted-body.json','docs/sources/ceh-day02-a/2026-11-14/four-topics/adopted-groups.json']){const source=JSON.parse(readFileSync(path,'utf8'));const removed=Array.isArray(source)?source:source.csrf;const at=expected.findIndex((_,i)=>JSON.stringify(expected.slice(i,i+removed.length))===JSON.stringify(removed));assert.ok(at>=0);expected.splice(at,removed.length);}assert.deepEqual(data.sections.find(s=>s.id===old.id)!.body,expected);}
 const ids=new Set(data.sections.flatMap(s=>[s.id,...s.aliases??[],...s.body.flatMap(b=>'id' in b&&b.id?[b.id]:[])]));for(const s of before.sections)for(const b of s.body)if('id' in b&&b.id)assert.ok(ids.has(b.id),b.id);
 for(const patch of [{collapsible:'yes'},{aliases:['main']},{aliases:[part.id]},{html:'<script/>'}]){const bad=structuredClone(data);Object.assign(bad.sections.find(s=>s.id===part.id)!,patch);assert.throws(()=>validateM20Review(bad));}
 const bad=structuredClone(data);bad.sections[0].collapsible=true;assert.throws(()=>validateM20Review(bad));
 const future=structuredClone(data);future.publishedOn='2099-01-01';future.revisedOn='2099-01-01';validateM20Review(future);
});
test('Seven redraws preserve both cookie/server decision branches and the four-group issue tree',()=>{
 const figures=adopted.filter((b):b is NoteDiagram=>b.kind==='diagram');assert.equal(figures.length,7);for(const f of figures){validateNoteDiagram(f);assert.throws(()=>validateNoteDiagram({...f,items:f.items.slice(1)}));assert.throws(()=>validateNoteDiagram({...f,svg:'<script/>'} as never));assert.ok(readFileSync(`site/images/ceh-notes/2026-11-14-part-20-${f.name}-zh.svg`).length<100000);}
 const flow=noteDiagramSpecs.m20d2rcausal;assert.deepEqual(flow.edges.slice(-5),[[4,5,'no'],[4,6,'yes'],[6,7,''],[7,8,'reject'],[7,9,'accept']]);assert.ok(!flow.edges.some(e=>e[0]===5));
 const tree=noteDiagramSpecs.m20d2rconditions;assert.deepEqual(tree.groups,[[5],[6,7],[8],[9]]);assert.equal(tree.layout,'csrf-v2-conditions');
});
