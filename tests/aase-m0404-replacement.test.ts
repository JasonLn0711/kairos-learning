import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const read=(p:string)=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const lesson=JSON.parse(read('content/aase/lessons/aase-m04-c04.json'));
const base='docs/sources/aase/m04-04/replacement-2026-11-11/';
test('M04-04 retains source and historical publication; all branches and original questions enter both languages',()=>{
 const prior=JSON.parse(read(base+'prior-lesson.json'));
 assert.equal(lesson.publishedOn,prior.publishedOn);assert.equal(lesson.contentVersion,'1.1.0');assert.deepEqual(lesson.qa,[]);
 for(const line of read(base+'SHA256SUMS.txt').trim().split('\n')){
  const [hash,name]=line.split(/\s+/);assert.equal(createHash('sha256').update(readFileSync(new URL('../'+base+name,import.meta.url))).digest('hex'),hash);
 }
 for(const lang of ['zh','en']){
  const t=lesson.text[lang];assert.equal(t.sections.length,10);assert.equal(t.openChecks.length,3);
  const figures=t.sections.flatMap((s:any)=>s.blocks??[]).filter((b:any)=>['flow','cards'].includes(b.kind));
  assert.deepEqual(figures.map((f:any)=>f.items.length),[5,4,11,2,2]);
  assert.equal(figures[2].kind,'cards');assert.equal(figures[2].items.filter((i:any)=>i.title.includes(' → ')).length,11);
  const tables=t.sections.flatMap((s:any)=>s.blocks??[]).filter((b:any)=>b.kind==='table');assert.deepEqual(tables.map((b:any)=>b.rows.length),[4,4]);
  const code=t.sections.flatMap((s:any)=>s.blocks??[]).find((b:any)=>b.code)?.code;assert.ok(code.includes('## 完成後修改'));assert.ok(code.includes('## 技術失敗'));
  for(let n=1;n<=5;n++){const svg=read(`site/images/aase/m04-04-${n}-${lang}.svg`);assert.ok(Buffer.byteLength(svg)<100000);assert.ok(svg.includes('<title'));assert.ok(!svg.includes('<script'));}
 }
});
