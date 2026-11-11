import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {createAaseCatalog} from '../src/lib/aase.ts';
const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const root='docs/sources/aase/m06-04/replacement-2026-11-11/';
const lesson=read('content/aase/lessons/aase-m06-c04.json'),before=read(root+'prior-lesson.json');
const build=(l:any)=>createAaseCatalog(read('content/aase/course.json'),[l],read('content/aase/sources.json'),'2026-11-11',read('content/aase/course.en.json'));
test('M06-04 preserves identity, complete paired content, examples, four figures and original answer choices',()=>{
 assert.equal(lesson.contentVersion,'1.1.0');assert.equal(lesson.revision,before.revision+1);assert.equal(lesson.publishedOn,before.publishedOn);assert.deepEqual(lesson.translations,before.translations);assert.deepEqual(lesson.qa,[]);
 for(const lang of ['zh','en'] as const){
  const t=lesson.text[lang];assert.equal(t.sections.length,11);
  for(const s of before.text[lang].sections)assert.ok(t.sections.some((x:any)=>x.id===s.id));
  const blocks=t.sections.flatMap((s:any)=>s.blocks??[]);
  assert.deepEqual(blocks.filter((b:any)=>b.kind==='flow'||b.kind==='cards').map((b:any)=>[b.kind,b.items.length]),[['flow',6],['cards',3],['cards',2]]);
  assert.deepEqual(blocks.filter((b:any)=>b.kind==='table').map((b:any)=>b.rows.length),[5,5,8,4,6,2]);
  const codes=blocks.filter((b:any)=>b.code).map((b:any)=>b.code);assert.equal(codes.length,4);
  assert.ok(codes[0].includes('POST /api/orders HTTP/1.1'));assert.ok(codes[0].includes('"quantity": 2'));assert.ok(codes[1].includes('201 Created'));assert.ok(codes[2].includes('"success": false'));assert.ok(codes[3].includes('def validate(name):\n    return bool(name.strip())'));
  const entry=build(lesson).forLanguage(lang)!.searchEntries[0];
  for(const s of t.sections){for(const p of s.paragraphs)assert.ok(entry.text.includes(p));for(const b of s.blocks??[])if(b.kind==='prose')for(const p of b.paragraphs)assert.ok(entry.text.includes(p));}
 }
 const source=readFileSync(root+'pasted-text-1.txt','utf8');
 for(const q of lesson.checks)for(const option of q.text.zh.options)assert.ok(source.includes(option));
 assert.deepEqual(lesson.checks.map((q:any)=>q.answer),[1,2,2]);
 for(const script of ['scripts/aase_m0604_content.py','scripts/aase_m0604_svg.py']){const r=spawnSync('python3',[script,'--check'],{encoding:'utf8'});assert.equal(r.status,0,r.stdout+r.stderr);}
 assert.equal(spawnSync('sha256sum',['-c','SHA256SUMS'],{cwd:root}).status,0);
});
test('M06-04 rejects altered relations, extra nodes, markup and false simulated entries; preserves publication gate',()=>{
 for(const section of ['analogy','outcomes','streamlit'])for(const change of ['kind','extra','markup']){
  const l=structuredClone(lesson);for(const lang of ['zh','en']){const b=l.text[lang].sections.find((s:any)=>s.id===section).blocks.find((b:any)=>b.kind==='cards'||b.kind==='flow');if(change==='kind')b.kind=b.kind==='cards'?'flow':'cards';if(change==='extra')b.items.push({...b.items[0]});if(change==='markup')b.items[0].html='<svg onload="alert(1)"/>';}
  assert.throws(()=>build(l),/invalid web data-flow figure/);
 }
 const l=structuredClone(lesson);for(const lang of ['zh','en'])l.text[lang].sections.find((s:any)=>s.id==='record').blocks.find((b:any)=>b.kind==='table').rows[1][1]='200';assert.throws(()=>build(l),/invalid simulated Network entries/);
 for(const gate of ['draft','future']){
  const l=structuredClone(lesson);if(gate==='draft')l.status='draft';else {l.publishedOn='2099-01-01';l.date='2099-01-01';l.translations.en.publishedOn='2099-01-01';}
  for(const lang of ['zh','en'] as const)assert.equal(build(l).forLanguage(lang)!.searchEntries.length,0);
 }
});
test('published Streamlit example parses and handles empty, whitespace and nonblank input with a UI stub',()=>{
 const code=lesson.text.zh.sections.flatMap((s:any)=>s.blocks??[]).find((b:any)=>b.code?.startsWith('import streamlit')).code;
 const r=spawnSync('python3',['-c',`import ast,sys,types
code=sys.stdin.read();ast.parse(code)
for name,valid in [('',False),('   ',False),('合成姓名',True),(' Test ',True)]:
 calls=[];st=types.ModuleType('streamlit');st.text_input=lambda label:name;st.button=lambda label:True;st.success=lambda msg:calls.append(('success',msg));st.error=lambda msg:calls.append(('error',msg));sys.modules['streamlit']=st;scope={};exec(compile(code,'app.py','exec'),scope)
 assert scope['validate'](name)==valid
 assert calls==[('success','資料完整') if valid else ('error','請填寫姓名')]
`],{input:code,encoding:'utf8'});assert.equal(r.status,0,r.stderr);
});
