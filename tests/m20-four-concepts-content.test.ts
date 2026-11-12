import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const dir='docs/sources/ceh-m20-review/2026-11-12/four-concepts-supplement/';
const json=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const current=json('content/ceh-m20-review.json');
const before=json(dir+'before-review.json');
const added=json(dir+'adopted.zh.json');
test('M20 four-concept supplement preserves the full prior article, questions and release date',()=>{
 assert.deepEqual(current.sections.slice(0,before.sections.length),before.sections);
 assert.deepEqual(current.sections.slice(before.sections.length),added);
 assert.equal(current.title,before.title);
 assert.equal(current.publishedOn,before.publishedOn);
 assert.equal(current.contentVersion,'1.1.0');
 assert.equal(current.revisedOn,'2026-11-12');
 assert.equal(current.revision,2);
 assert.equal(added.length,6);
 assert.equal(added.flatMap((s:any)=>s.body).filter((b:any)=>b.kind==='heading').length,13);
 assert.equal(added.flatMap((s:any)=>s.body).filter((b:any)=>b.kind==='table').length,4);
});
test('all supplied nonempty lines have checked body destinations or explicit presentation exclusions',()=>{
 const units=json(dir+'source-units.json');
 const lines=readFileSync(dir+'pasted-text-1.txt','utf8').split(/\r?\n/);
 assert.deepEqual(units.map((u:any)=>u.line),lines.flatMap((line,i)=>line.trim()?[i+1]:[]));
 for(const u of units){
  assert.equal(u.source,lines[u.line-1]);
  const section=current.sections.find((s:any)=>s.id===u.sectionId);
  if(u.disposition==='heading'){assert.equal(section.heading,u.adopted);continue;}
  if(u.disposition==='adopted'){
   let value=section.body[u.blockIndex];
   for(const key of u.field.split('.'))value=value[key];
   assert.deepEqual(value,u.adopted,`source line ${u.line}`);
  }else if(u.disposition==='diagram-semantic'){
   assert.deepEqual(section.body[u.blockIndex],json(dir+'figure.json'));
   assert.ok(u.reason);
  }else{
   assert.ok(['excluded-interface','excluded-presentation'].includes(u.disposition));
   assert.ok(u.reason);
   assert.ok(u.source.startsWith('[image](')||['csrc.nist.gov','rfc-editor.org+1','Foundations and Classical Ciphers'].includes(u.source)||/^\|\s*-/.test(u.source));
  }
 }
 for(const [name,expected] of Object.entries(json(dir+'sha256-manifest.json'))){
  assert.equal(createHash('sha256').update(readFileSync(dir+name)).digest('hex'),expected,name);
 }
});
test('the four-concept teaching retains worked reasoning, limitations and two unanswered checks',()=>{
 const body=added.flatMap((s:any)=>s.body);
 const text=JSON.stringify(added);
 for(const required of ['8 分鐘','4 分鐘','2 分鐘','32–448 bits','32 GiB','q ≈ 2^(n/2)','365 天','彼此獨立','同一把金鑰','不能拿來當成 AES-GCM','AAD 可公開','不能補救 IV 重用','1883','Algorithm can be public; the secret key must remain protected.','Q1. 某公司使用 AES-256','Q2. 某系統使用 AES-GCM'])assert.ok(text.includes(required),required);
 assert.equal(body.filter((b:any)=>b.kind==='answer').length,0);
 const figure=body.find((b:any)=>b.kind==='diagram');
 assert.equal(figure.name,'m20gcmflow');
 assert.deepEqual(figure,json(dir+'figure.json'));
 assert.ok(text.includes('不是已量測的學習時間'));
 assert.ok(text.includes('不表示五題的答案都是 AES'));
});
