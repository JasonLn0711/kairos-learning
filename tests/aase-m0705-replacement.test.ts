import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {checkedPreviewReport,validPreviewRecord} from '../src/lib/preview-export.ts';
const record={application_id:'A001',applicant_code:'C123',document_type:'收入證明'};
test('export checks current data and snapshot at the boundary and selects only permitted fields',()=>{
 const result=JSON.parse(checkedPreviewReport({...record,debug_notes:'private',internal_token:'SECRET'},record));
 assert.deepEqual(Object.keys(result.data),['application_id','applicant_code','document_type']);
 assert.equal(result.scope,'僅代表教學欄位完整性，不代表正式受理');assert.equal(result.status,'complete');
 for(const value of [null,[],{}, {...record,document_type:''},{...record,document_type:'   '},{...record,document_type:'x'.repeat(81)},{...record,document_type:2}]){assert.equal(validPreviewRecord(value),false);assert.throws(()=>checkedPreviewReport(value,record));assert.throws(()=>checkedPreviewReport(record,value));}
 assert.throws(()=>checkedPreviewReport({...record,document_type:'戶籍謄本'},record));
 assert.equal(validPreviewRecord({...record,document_type:'x'.repeat(80)}),true);
 assert.equal(JSON.parse(checkedPreviewReport({...record,document_type:' 收入證明 '},{...record,document_type:' 收入證明 '})).data.document_type,'收入證明');
});
test('bilingual source covers all five concepts, industry table, acceptance cases and original open questions',()=>{
 const lesson=JSON.parse(readFileSync('content/aase/lessons/aase-m07-c05.json','utf8'));
 assert.equal(lesson.publishedOn,'2026-11-05');assert.equal(lesson.contentVersion,'1.1.0');assert.deepEqual(lesson.qa,[]);
 for(const lang of ['zh','en']){
  const text=lesson.text[lang];assert.equal(text.sections.length,12);assert.equal(text.openChecks.length,4);
  assert.deepEqual(text.sections.filter((s:any)=>s.blocks?.some((b:any)=>b.kind==='cards'||b.kind==='flow')).map((s:any)=>s.id),['risk','workflow']);
  const tables=text.sections.flatMap((s:any)=>s.blocks??[]).filter((b:any)=>b.kind==='table');assert.deepEqual(tables.map((b:any)=>b.rows.length),[2,5,3]);
  const body=JSON.stringify(text);for(const term of ['BATCH-100','BATCH-101','Snapshot','Invalidation','Revalidation','Allowlist','Scope','2,000','3,500','AppTest','record.copy()'])assert.ok(body.includes(term),`${lang}: ${term}`);
 }
 const old=JSON.parse(readFileSync('docs/sources/aase/m07-05/replacement-2026-11-11/previous-lesson.json','utf8'));
 for(const s of old.text.zh.sections)assert.ok(lesson.text.zh.sections.some((n:any)=>n.id===s.id),s.id);
});

test('specialized figures reject extra nodes, properties and wrong relationships in both locales',async()=>{
 const {createAaseCatalog}=await import('../src/lib/aase.ts');
 const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
 const source=read('content/aase/lessons/aase-m07-c05.json');
 const build=(lesson:any)=>createAaseCatalog(read('content/aase/course.json'),[lesson],read('content/aase/sources.json'),'2026-11-11',read('content/aase/course.en.json'));
 assert.doesNotThrow(()=>build(source));
 for(const change of [(f:any)=>f.items.push({...f.items[0]}),(f:any)=>f.kind='cards',(f:any)=>f.markup='<svg/>',(f:any)=>f.items[0].path='M0 0']){
  const lesson=structuredClone(source);
  for(const lang of ['zh','en'])change(lesson.text[lang].sections.find((s:any)=>s.id==='workflow').blocks[0]);
  assert.throws(()=>build(lesson),/invalid preview export figure/);
 }
});
