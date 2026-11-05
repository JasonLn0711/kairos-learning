import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {aaseCatalog,getPage} from '../src/lib/server/catalog.ts';
import type {AaseLesson} from '../src/lib/aase.ts';
const lesson=(n:number)=>JSON.parse(readFileSync(`content/aase/lessons/aase-m02-c${String(n).padStart(2,'0')}.json`,'utf8')) as AaseLesson;
const example=(n:number,section:string)=>{const s=lesson(n).text.zh.sections.find(s=>s.id===section)!;const b=s.blocks!.find(b=>'code'in b&&b.code);assert.ok(b&&'code'in b);return b.code!;};
const run=(code:string)=>{const r=spawnSync('python3',['-c',code],{encoding:'utf8',timeout:5000});assert.equal(r.status,0,r.stderr);return r.stdout.trim();};
test('M02 has six independently published lessons, original checks and retained extension depth',()=>{
 const cs=aaseCatalog.concepts.filter(c=>c.module==='m02');assert.equal(cs.length,6);assert.ok(cs.every(c=>c.lesson));
 for(const c of cs){const l=c.lesson!;assert.equal(l.contentVersion,'1.0.0');assert.equal(l.revision,1);assert.ok(l.text.zh.sections.length>=6);assert.equal(l.checks.length,3);assert.deepEqual(l.qa,[]);assert.ok(l.text.zh.sections.some(s=>s.blocks?.some(b=>b.kind==='flow'||b.kind==='cards')));assert.ok(getPage(c.href));assert.equal(getPage('/en'+c.href),null);}
 assert.equal(cs.find(c=>c.id==='AASE-M02-C03')!.workshopDepth,'extension');
});
test('the published attention teaching program reproduces both weighting cases',()=>{
 const code=example(1,'attention-example');
 assert.equal(run(code),'weights = [0.731, 0.269]\nweighted_value = 3.076');
 assert.equal(run(code.replace('scores = [1.0, 0.0]','scores = [0.0, 0.0]')),'weights = [0.5, 0.5]\nweighted_value = 4.0');
});
test('the published context-budget teaching program handles both fitting and overflow',()=>{
 const code=example(2,'budget-example');
 assert.equal(run(code),'reserved = 7800\nremaining = 392\nfits = True');
 assert.equal(run(code.replace('"tool_results": 4800','"tool_results": 5400')),'reserved = 8400\nremaining = -208\nfits = False');
});
test('M02 labels editorial taxonomies, model limits and protocol examples honestly',()=>{
 const content=(n:number)=>lesson(n).text.zh.sections.flatMap(s=>s.paragraphs).join(' ');
 assert.ok(content(1).includes('手工切分教具'));assert.ok(content(2).includes('教學指定數字'));
 assert.ok(content(3).includes('沒有測量'));assert.ok(content(5).includes('本課規劃'));
 const rpc=JSON.parse(example(6,'calling'));assert.equal(rpc.method,'tools/call');assert.equal(rpc.params.name,'read_project_file');assert.deepEqual(rpc.params.arguments,{path:'spec.md'});
});
