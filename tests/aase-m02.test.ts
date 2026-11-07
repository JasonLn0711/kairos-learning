import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {aaseCatalog,getPage} from '../src/lib/server/catalog.ts';
import type {AaseLesson} from '../src/lib/aase.ts';
const lesson=(n:number)=>JSON.parse(readFileSync(`content/aase/lessons/aase-m02-c${String(n).padStart(2,'0')}.json`,'utf8')) as AaseLesson;
const example=(n:number,section:string,lang:'zh'|'en'='zh')=>{const s=lesson(n).text[lang]!.sections.find(s=>s.id===section)!;const b=s.blocks!.find(b=>'code'in b&&b.code&&(n!==6||b.code.includes('"jsonrpc"')));assert.ok(b&&'code'in b);return b.code!;};
const run=(code:string)=>{const r=spawnSync('python3',['-c',code],{encoding:'utf8',timeout:5000});assert.equal(r.status,0,r.stderr);return r.stdout.trim();};
test('M02 has six independently published lessons, original checks and retained extension depth',()=>{
 const cs=aaseCatalog.concepts.filter(c=>c.module==='m02');assert.equal(cs.length,6);assert.ok(cs.every(c=>c.lesson));
 for(const c of cs){const l=c.lesson!;assert.equal(l.contentVersion,['AASE-M02-C01','AASE-M02-C02','AASE-M02-C03','AASE-M02-C04','AASE-M02-C06'].includes(l.id)?'1.1.0':'1.0.2');assert.equal(l.revision,['AASE-M02-C01','AASE-M02-C02','AASE-M02-C03','AASE-M02-C04','AASE-M02-C06'].includes(l.id)?4:3);assert.ok(l.text.zh.sections.length>=6);assert.equal(l.checks.length,['AASE-M02-C01','AASE-M02-C03'].includes(l.id)?4:['AASE-M02-C02','AASE-M02-C06'].includes(l.id)?1:3);assert.deepEqual(l.qa,[]);assert.ok(l.text.zh.sections.some(s=>s.blocks?.some(b=>b.kind==='flow'||b.kind==='cards')));assert.ok(getPage(c.href));assert.ok(getPage('/en'+c.href));}
 assert.equal(cs.find(c=>c.id==='AASE-M02-C03')!.workshopDepth,'extension');
});
test('the published attention teaching program reproduces both weighting cases',()=>{
 const code=example(1,'attention-example');
 assert.equal(run(code),'weights = [0.731, 0.269]\nweighted_value = 3.076');
 assert.equal(run(code.replace('scores = [1.0, 0.0]','scores = [0.0, 0.0]')),'weights = [0.5, 0.5]\nweighted_value = 4.0');
});
test('the published context-budget teaching program handles both fitting and overflow',()=>{
 const code=example(2,'budget-example');
 assert.equal(run(code),'reserved = 9500\nremaining = 500\nfits = True');
 assert.equal(run(code.replace('extra_logs = 500','extra_logs = 1800')),'reserved = 10800\nremaining = -800\nfits = False');
});
test('M02 labels editorial taxonomies, model limits and protocol examples honestly',()=>{
 const content=(n:number)=>lesson(n).text.zh.sections.flatMap(s=>s.paragraphs).join(' ');
 assert.ok(JSON.stringify(lesson(1).text.zh).includes('並非實際模型結果')); assert.ok(content(2).includes('教學指定值'));
 assert.ok(content(3).includes('沒有測量'));assert.ok(content(5).includes('本課規劃'));
 const rpc=JSON.parse(example(6,'calling'));assert.equal(rpc.method,'tools/call');assert.equal(rpc.params.name,'read_project_file');assert.deepEqual(rpc.params.arguments,{path:'spec.md'});
});

test('M02 English preserves Chinese originals, publication, sources, answers and executable examples',()=>{
 for(let n=1;n<=6;n++){
  const l=[1,2,3,6].includes(n)?JSON.parse(readFileSync(`docs/sources/aase/m02-0${n}/replacement-2026-11-07/previous.json`,'utf8')) as AaseLesson:n===4?JSON.parse(readFileSync('docs/sources/aase/m02-04/replacement-2026-11-07/previous.json','utf8')) as AaseLesson:lesson(n),before=JSON.parse(readFileSync(`docs/sources/aase/m02-en/aase-m02-c0${n}.before.json`,'utf8'));
  assert.deepEqual(l.text.zh,before.text.zh);assert.equal(l.publishedOn,before.publishedOn);assert.deepEqual(l.sourceIds,before.sourceIds);assert.deepEqual(l.qa,before.qa);assert.equal(l.revision,before.revision+2);
  for(const [i,q] of l.checks.entries()){assert.equal(q.id,before.checks[i].id);assert.equal(q.answer,before.checks[i].answer);assert.deepEqual(q.text.zh,before.checks[i].text.zh);assert.equal(q.text.en!.options.length,4);assert.equal(q.text.en!.rationales.length,4);}
 }
 for(const [n,id] of [[1,'attention-example'],[2,'budget-example'],[6,'calling']] as const)assert.equal(example(n,id,'en'),example(n,id,'zh'));
 assert.equal(run(example(1,'attention-example','en')),'weights = [0.731, 0.269]\nweighted_value = 3.076');
 assert.equal(run(example(2,'budget-example','en')),'reserved = 9500\nremaining = 500\nfits = True');
});
