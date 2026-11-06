import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=(path:string)=>JSON.parse(readFileSync(path,'utf8'));
const base='docs/sources/aase/m01-01/replacement-2026-11-06/';
const lesson=read('content/aase/lessons/aase-m01-c01.json'),before=read(base+'previous-v1.0.3.json');
test('M01-01 replacement retains source paragraphs, examples, all seven chapters and historic identity',()=>{
 assert.equal(lesson.contentVersion,'1.1.0');assert.equal(lesson.revision,before.revision+1);assert.equal(lesson.date,'2026-11-06');assert.equal(lesson.publishedOn,before.publishedOn);assert.deepEqual(lesson.qa,[]);
 for(const lang of ['zh','en']){assert.equal(lesson.text[lang].sections.length,8);assert.deepEqual(lesson.text[lang].exercise,before.text[lang].exercise);}
 const zh=JSON.stringify(lesson.text.zh)+JSON.stringify(lesson.checks[0].text.zh);
 const raw=readFileSync(base+'pasted-text-1.txt','utf8');
 const excluded=['只關注畫面','做一個漂亮的表單網站','有表單、有按鈕，但不知道能不能防止漏填。','關注實際成果','做一個能攔截缺漏的工具','缺少必填資料時，清楚提示並阻止錯誤匯出。'];
 // The two pasted interface regions are represented by the actual form comparison and scenario demo.
 const body=raw.replace(/只關注畫面[\s\S]*?(?=兩個網站可能)/,'').replace(/軟體工程的證據鏈[\s\S]*?(?=我們用最白話)/,'').replace(/互動示範：[\s\S]*?(?=你應該注意到)/,'').replace(/A\. 系統[\s\S]*?(?=本課最值得)/,'');
 for(const paragraph of body.split(/\n\n/).map(s=>s.trim()).filter(Boolean)){
  if(paragraph.startsWith('#')||paragraph.startsWith('|')||paragraph.startsWith('-')||excluded.includes(paragraph)||paragraph==='第一課：先看成品，從問題到成果')continue;
  assert.ok(zh.includes(paragraph),'missing source paragraph: '+paragraph);
 }
 const levels=lesson.text.zh.sections.find((s:any)=>s.id==='levels');assert.equal(levels.blocks.find((b:any)=>b.kind==='table').rows.length,4);assert.equal(lesson.text.zh.sections.find((s:any)=>s.id==='misunderstandings').blocks[0].rows.length,7);
 assert.equal(lesson.checks[0].answer,1);assert.equal(lesson.checks[0].text.zh.options.length,4);
});
