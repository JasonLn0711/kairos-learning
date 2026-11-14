import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {validateM20Review,type M20Review} from '../src/lib/m20-review.ts';
import {validateNoteDiagram,type NoteDiagram,noteDiagramSpecs} from '../src/lib/note-diagrams.ts';
import {noteBodyText} from '../src/lib/ceh-notes.ts';
const root='docs/sources/ceh-day02-a/2026-11-14/csrf-browser/';
const data=JSON.parse(readFileSync('content/ceh-day02-a.json','utf8')) as M20Review;
const prior=JSON.parse(readFileSync(root+'published-v1.2.0.json','utf8')) as M20Review;
const adopted=JSON.parse(readFileSync(root+'adopted-body.json','utf8')) as M20Review['sections'][number]['body'];
test('Complete CSRF source retains fourteen chapters, all thirty subheadings, code, tables and five open questions at its existing explanation',()=>{
 validateM20Review(data);assert.equal(data.contentVersion,'1.3.0');assert.equal(data.revision,5);assert.equal(data.publishedOn,prior.publishedOn);assert.equal(data.revisedOn,'2026-11-14');
 assert.deepEqual(data.sections.map(s=>[s.id,s.heading]),prior.sections.map(s=>[s.id,s.heading]));
 for(const old of prior.sections){let cursor=0;const body=data.sections.find(s=>s.id===old.id)!.body;for(const b of old.body){const i=body.findIndex((n,i)=>i>=cursor&&JSON.stringify(b)===JSON.stringify(n));assert.ok(i>=0,JSON.stringify(b));cursor=i+1;}}
 const body=data.sections.find(s=>s.id==='p1-section-07')!.body,at=body.findIndex(b=>b.kind==='heading'&&b.id==='p1-csrf-browser-intro');assert.ok(at>0);assert.ok((body[at-1] as {text:string}).text.startsWith('CSRF 最重要的概念是：'));assert.deepEqual(body.slice(at,at+adopted.length),adopted);
 assert.equal(adopted.filter(b=>b.kind==='heading'&&b.id?.startsWith('p1-csrf-browser-section-')).length,14);assert.equal(adopted.filter(b=>b.kind==='heading'&&b.id?.startsWith('p1-csrf-browser-subsection-')).length,30);assert.equal(adopted.filter(b=>b.kind==='code').length,22);assert.equal(adopted.filter(b=>b.kind==='table').length,11);assert.equal(adopted.filter(b=>b.kind==='paragraph'&&/^Q[1-5]：/.test(b.text)).length,5);
 const text=adopted.flatMap(noteBodyText).join('\n');for(const key of ['HttpOnly','SameSite=Strict','SameSite=None','credentials: "include"','Preflight','Authorization','JWT','六層分析模型','不記錄已作答','教學判讀','不能直接取代 Authentication','只關閉銀行分頁不等於登出','Cookie 不以 Port 分隔'])assert.ok(text.includes(key),key);
 const codes=adopted.flatMap(b=>b.kind==='code'?[b.text]:[]);for(const code of codes.filter(s=>s.includes('Set-Cookie:')))assert.doesNotMatch(code,/;\n/);assert.ok(codes.some(s=>s.includes('to=recipient-account&amount=1000&csrf_token=unpredictable-token')));
 assert.doesNotMatch(text,/博士|碩士|已完成 0|提交答案，逐題|utm_source/);
 const raw=readFileSync(root+'pasted-text-1.txt','utf8').split('\n'),ledger=JSON.parse(readFileSync(root+'line-adoption.json','utf8'));assert.equal(ledger.length,raw.filter(s=>s.trim()).length);assert.deepEqual(ledger.map((r:{line:number})=>r.line),raw.flatMap((s,i)=>s.trim()?[i+1]:[]));for(const row of ledger)assert.equal(row.source,raw[row.line-1]);
 for(const line of readFileSync(root+'SHA256SUMS','utf8').trim().split('\n')){const [sha,name]=line.split('  ');assert.equal(createHash('sha256').update(readFileSync(root+name)).digest('hex'),sha);}
});
test('Eight CSRF redraws preserve fixed groups, table values and five sequence directions and reject misleading structures',()=>{
 const figures=adopted.filter((b):b is NoteDiagram=>b.kind==='diagram');assert.equal(figures.length,8);
 for(const f of figures){validateNoteDiagram(f);assert.ok(noteDiagramSpecs[f.name].layout.startsWith('csrf-'));assert.throws(()=>validateNoteDiagram({...f,items:f.items.slice(1)}));assert.throws(()=>validateNoteDiagram({...f,html:'<script/>'} as never));assert.ok(readFileSync(`site/images/ceh-notes/2026-11-14-part-20-${f.name}-zh.svg`).length<100000);}
 for(const name of ['m20d2origins','m20d2samesite','m20d2csrfsequence']){const f=figures.find(f=>f.name===name)!;assert.throws(()=>validateNoteDiagram({...f,items:f.items.map((item,i)=>i?item:{...item,body:'wrong policy or direction'})}));}
 const exchange=figures.find(f=>f.name==='m20d2exchange')!;assert.equal(exchange.items[0].body,'GET /login HTTP/1.1\nHost: bank.example.com');assert.ok(exchange.items[1].body.includes('HTTP/1.1 200 OK'));
});
