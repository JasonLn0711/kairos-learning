import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {allConceptTeachings,getPage,searchEntries,concepts} from '../src/lib/server/catalog.ts';
import {createConceptCatalog} from '../src/lib/concepts.ts';
import type {SourceBlock} from '../src/lib/concepts.ts';
const id='CEH26-M04-C03',root='docs/sources/ceh26-m04-c03/replacement-2026-11-05/';
const t=allConceptTeachings.find(x=>x.id===id)!;
const flatten=(b:SourceBlock):string[]=>b.kind==='visual'?[b.visual.caption,b.visual.description,...b.visual.items.flatMap(x=>[x.title,x.body])]:b.kind==='table'?[...b.headers,...b.rows.flat()]:b.kind==='list'?b.items:b.kind==='answer'?[b.summary,...b.paragraphs]:'text'in b?[b.text]:[];
test('M04-03 retains complete supplied text, eleven chapters, recap, questions and bounded bilingual evidence',()=>{
 assert.equal(t.contentVersion,'1.1.0');assert.equal(t.revision,3);assert.equal(t.publishedOn,'2026-11-04');assert.deepEqual(t.qa,[]);
 for(const [name,hash] of Object.entries(JSON.parse(readFileSync(root+'sha256.json','utf8'))))assert.equal(createHash('sha256').update(readFileSync(root+name)).digest('hex'),hash);
 let source=readFileSync(root+'pasted-text-1.txt','utf8').replace('# CEH M04-03｜','# M04-03｜');
 source=source.replace(':chatgpt-content-reference{index="8"}[下載高解析 SVG 架構圖](sandbox:/mnt/data/ceh_m04_03_protocol_map.svg)','[[figure:protocols]]').replace(':chatgpt-content-reference{index="10"}[下載高解析 SVG 證據判讀圖](sandbox:/mnt/data/ceh_m04_03_evidence.svg)','[[figure:evidence]]').replace('本次按照 [CS Kairos CEH M04-03 原始教材]','本課依 [CS Kairos M04-03 原始教材]').replace('你可以直接回答 A、B、C；我會依照 CEH 的觀念，逐題檢查你的判斷及推理。','請先回答各題的 A、B、C，再比對參考解答，檢查你的判斷及推理。').replace('| | FTP | FTPS | SFTP |','| 比較 | FTP | FTPS | SFTP |');
 assert.equal(readFileSync(root+'teaching.zh-TW.md','utf8'),source);
 for(const lang of ['zh','en'] as const){
  const blocks=t.text[lang].sourceBody!;assert.equal(blocks.length,330);assert.equal(blocks.filter(b=>b.kind==='heading').length,14);assert.equal(blocks.filter(b=>b.kind==='code').length,22);assert.equal(blocks.filter(b=>b.kind==='table').length,6);assert.equal(blocks.filter(b=>b.kind==='visual').length,2);assert.equal(blocks.filter(b=>b.kind==='answer').length,1);
  const text=blocks.flatMap(flatten).join('\n');for(const token of ['MLSD','MLST','RETR','STOR','150','226','230','425','530','550','252','STARTTLS','AUTH','EXPN','VRFY learner','PROT P','employee_salary.xlsx'])assert.ok(text.includes(token),token);
  assert.ok(!/sandbox:|chatgpt-content-reference|Sentinel_|deliveryId/.test(text));
  const entry=searchEntries.find(x=>x.id===id&&x.lang===lang)!;assert.ok(entry.title.startsWith('M04-03'));for(const value of blocks.flatMap(flatten))assert.ok(entry.text.includes(value));
  const prefix=lang==='en'?'/en':'';const page=getPage(`${prefix}/courses/ceh/v13/m04/concepts/m04-03/`)!;assert.equal(page.conceptTeaching?.id,id);assert.equal(page.conceptNavigation?.previous?.id,'CEH26-M04-C02');assert.equal(page.conceptNavigation?.next?.id,'CEH26-M04-C04');assert.equal(getPage(`${prefix}/courses/ceh/v13/m04/concepts/ceh26-m04-c03/`),null);
 }
 const zh=t.text.zh.sourceBody!,en=t.text.en.sourceBody!;assert.deepEqual(zh.map(b=>[b.kind,'id'in b?b.id:null]),en.map(b=>[b.kind,'id'in b?b.id:null]));
 assert.deepEqual(zh.filter(b=>b.kind==='table').map(b=>[b.headers.length,b.rows.length]),en.filter(b=>b.kind==='table').map(b=>[b.headers.length,b.rows.length]));
 const a=zh.flatMap(b=>b.kind==='code'&&'text'in b?[b.text]:[]),b=en.flatMap(b=>b.kind==='code'&&'text'in b?[b.text]:[]);for(let i=0;i<a.length;i++)if(/^[\x00-\x7F]*$/.test(a[i]))assert.equal(a[i],b[i]);
 for(const script of ['ceh26_m04_c03_content.py','ceh26_m04_c03_diagrams.py']){const result=spawnSync('python3',['scripts/'+script,'--check'],{encoding:'utf8'});assert.equal(result.status,0,result.stdout+result.stderr);}
});
test('FTP/SMTP diagrams preserve parallel channels, SMTP roles and three evidence categories in safe SVG',()=>{
 const models=JSON.parse(readFileSync(root+'diagram-models.json','utf8'));
 for(const [key,pair] of Object.entries(models) as [string,any][]){for(const block of Object.values(pair) as any[]){
  assert.equal(block.visual.items.length,key==='protocols'?11:3);const bytes=readFileSync('site'+block.src);assert.ok(bytes.length<100000);const svg=bytes.toString();assert.ok(!/<(?:script|image|foreignObject|use)\b|\bon\w+=|href=/i.test(svg));assert.ok(svg.includes('preserveAspectRatio="xMidYMid meet"'));assert.ok(svg.includes(block.visual.caption));
 }}
});

test('known FTP/SMTP renderers reject incomplete or incompatible diagram shapes before publication',()=>{
 for(const change of ['missing-node','wrong-kind','missing-evidence-line']){
  const bad=structuredClone(t);const block=bad.text.zh.sourceBody!.find(b=>b.kind==='visual'&&b.src.includes(change==='missing-evidence-line'?'-evidence-':'-protocols-'));assert.ok(block?.kind==='visual');
  if(change==='missing-node')block.visual.items.pop();else if(change==='wrong-kind')block.visual.kind='flow';else block.visual.items[0].body='one line';
  assert.throws(()=>createConceptCatalog(concepts,allConceptTeachings.map(x=>x.id===id?bad:x),'2026-11-05'),/invalid FTP\/SMTP diagram structure/);
 }
});
