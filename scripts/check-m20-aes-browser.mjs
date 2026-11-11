import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
const base=process.env.M20_BASE_URL||'http://127.0.0.1:4238';
const lesson=JSON.parse(readFileSync('content/lessons/ceh-m20-crypto.json','utf8'));
const browser=await chromium.launch({headless:true});
const checks=[];mkdirSync('.local/m20-aes',{recursive:true});
try{
 for(const lang of ['zh','en']){
  const url=base+(lang==='en'?'/en':'')+'/courses/ceh/v13/m20/hash-encryption-and-signatures/';
  const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();page.setDefaultTimeout(10000);
  for(const width of [320,390,768,1280]){
   await page.setViewportSize({width,height:900});await page.goto(url);
   assert.equal(await page.locator('h1').textContent(),lesson.text[lang].title);
   const text=await page.locator('main').innerText();
   for(const section of lesson.text[lang].sections)for(const p of section.paragraphs)assert.ok(text.includes(p),`${lang}/${section.id}: body missing`);
   assert.ok(text.includes('1.1.0'));assert.ok(text.includes('2026-10-23'));assert.ok(text.includes('2026-11-10'));
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   assert.equal(await page.locator('#aes-finalists').count(),1);
   if(width===390||width===1280)await page.screenshot({path:`.local/m20-aes/${lang}-${width}.png`,fullPage:true});
   checks.push(`${lang} ${width}: complete static body, dates/version, no overflow`);
  }
  console.log(lang+': static checks done');await page.setViewportSize({width:320,height:900});await page.evaluate(()=>document.documentElement.style.fontSize='200%');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);checks.push(`${lang}: 200% text`);
  await context.close();
  const interactive=await browser.newContext();const p=await interactive.newPage();p.setDefaultTimeout(10000);await p.goto(url);console.log(lang+': interactive loaded');
  const q=p.locator('.question').filter({has:p.locator('#ceh-m20-crypto-q3')});
  console.log('question count',await q.count());await q.locator('input[type=radio]').nth(2).focus();await p.keyboard.press('Space');
  await q.locator('select').selectOption('high');await q.locator('button[type=submit]').focus();await p.keyboard.press('Enter');
  await q.locator('.result').waitFor();assert.ok((await q.locator('.result').innerText()).includes(lang==='zh'?'判斷正確':'Correct.'));
  for(const rationale of lesson.questions[2].text[lang].rationales)assert.ok((await q.innerText()).includes(rationale));
  checks.push(`${lang}: keyboard answer, correct feedback and all rationales`);
  await interactive.close();
 }
 writeFileSync('.local/m20-aes/result.json',JSON.stringify({base,checks,passed:checks.length,scope:'Isolated browser QA, not learner evidence'},null,2)+'\n');
 console.log(JSON.stringify({passed:checks.length,base}));
}catch(error){console.error(error);throw error}finally{await browser.close()}
