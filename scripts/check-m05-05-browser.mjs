import {chromium} from '@playwright/test';
import {spawn} from 'node:child_process';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import assert from 'node:assert/strict';
const base=process.env.M05_05_BASE_URL||'http://127.0.0.1:4195';
const out=process.env.M05_05_BASE_URL?'.local/m05-05/live':'.local/m05-05/browser';mkdirSync(out,{recursive:true});
const server=process.env.M05_05_BASE_URL?null:spawn('python3',['-m','http.server','4195','--bind','127.0.0.1','--directory','build'],{stdio:'ignore'});
const a=JSON.parse(readFileSync('content/concepts/ceh26-m05-c05.json','utf8'));
const norm=s=>s.replace(/\[([^\]]+)\]\(https:\/\/[^)]+\)/g,'$1').replace(/`/g,'').replace(/\s+/g,' ').trim();
const texts=x=>x.kind==='visual'?[x.visual.caption,x.visual.description,...x.visual.items.flatMap(n=>[n.title,n.body])]:x.kind==='list'?x.items:x.kind==='table'?[...x.headers,...x.rows.flat()]:[x.text];
function checkBody(body,lang){let cursor=0;for(const x of a.text[lang].sourceBody)for(const t of texts(x)){const expected=norm(t),at=body.indexOf(expected,cursor);assert.ok(at>=0,`${lang}: missing or out of order: ${expected.slice(0,100)}`);cursor=at+expected.length;}}
let browser;const results=[];
try{
 console.error(`Checking M05-05 full bilingual body, four figures and responsive behavior at ${base}.`);
 if(server){let ready=false;for(let i=0;i<50;i++){try{if((await fetch(base+'/')).ok){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,100));}assert.ok(ready,'local server starts');}
 browser=await chromium.launch({channel:'chrome',headless:true});
 for(const lang of ['zh','en'])for(const width of [320,390,768,1280]){
  const prefix=lang==='en'?'/en':'',path=`${prefix}/courses/ceh/v13/m05/concepts/m05-05/`;
  const page=await browser.newPage({viewport:{width,height:900},acceptDownloads:true});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const response=await page.goto(base+path);assert.equal(response.status(),200);await page.evaluate(()=>document.fonts.ready);
  assert.equal(await page.locator('h1').count(),1);assert.ok((await page.locator('h1').innerText()).includes('M05-05'));
  assert.equal(await page.locator('.source-body h2').count(),9);assert.equal(await page.locator('.source-body table').count(),5);assert.equal(await page.locator('[data-prioritization-diagram]').count(),4);
  checkBody(norm(await page.locator('.source-body').innerText()),lang);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  const bad=await page.locator('.source-body p,.source-body li,.source-body table,.source-body h3').evaluateAll(es=>es.filter(e=>{const s=getComputedStyle(e);return parseFloat(s.fontSize)<16||parseFloat(s.lineHeight)/parseFloat(s.fontSize)<1.69}).map(e=>e.tagName));assert.deepEqual(bad,[]);
  assert.equal(await page.locator('[data-prioritization-diagram=signals] li').count(),3);assert.equal(await page.locator('[data-prioritization-diagram=groups] li').count(),4);assert.equal(await page.locator('[data-prioritization-diagram=workflow] .arrow').count(),3);
  assert.equal(await page.locator('[data-prioritization-diagram=signals] .arrow,[data-prioritization-diagram=groups] .arrow').count(),0);
  const ratio=await page.locator('.probability-track').evaluate(e=>e.firstElementChild.getBoundingClientRect().width/e.getBoundingClientRect().width);assert.ok(Math.abs(ratio-.2)<.001);
  for(const link of await page.locator('[data-prioritization-diagram] a').all()){
   const href=await link.getAttribute('href'),r=await page.request.get(new URL(href,page.url()).href);assert.equal(r.status(),200);assert.deepEqual(await r.body(),readFileSync('site'+href));
  }
  if([320,1280].includes(width))for(const fig of await page.locator('[data-prioritization-diagram]').all()){const name=await fig.getAttribute('data-prioritization-diagram');await fig.screenshot({path:`${out}/${lang}-${width}-${name}.png`});}
  await page.addStyleTag({content:'html{font-size:200%}'});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  for(const fig of await page.locator('[data-prioritization-diagram]').all())assert.equal(await fig.evaluate(e=>e.scrollWidth>e.clientWidth),false);
  assert.deepEqual(errors,[]);results.push({lang,width,fullBodyInOrder:true,figures:4,svgBytes:true,text200:true});await page.close();
 }
 for(const lang of ['zh','en']){
  const prefix=lang==='en'?'/en':'',path=`${prefix}/courses/ceh/v13/m05/concepts/m05-05/`;
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:900}}),page=await context.newPage();assert.equal((await page.goto(base+path)).status(),200);checkBody(norm(await page.locator('.source-body').innerText()),lang);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await context.close();
  const keyboard=await browser.newPage({viewport:{width:320,height:844},acceptDownloads:true});await keyboard.goto(base+path);let reached=false;
  for(let i=0;i<150;i++){await keyboard.keyboard.press('Tab');if(await keyboard.evaluate(()=>document.activeElement?.matches('[data-prioritization-diagram] a'))){reached=true;break;}}
  assert.ok(reached);assert.notEqual(await keyboard.evaluate(()=>getComputedStyle(document.activeElement).outlineStyle),'none');const pending=keyboard.waitForEvent('download');await keyboard.keyboard.press('Enter');const download=await pending;assert.ok(download.suggestedFilename().endsWith('.svg'));assert.deepEqual(readFileSync(await download.path()),readFileSync('site/images/ceh/'+download.suggestedFilename()));await keyboard.keyboard.press('Shift+Tab');assert.equal(await keyboard.evaluate(()=>document.activeElement?.matches('[data-prioritization-diagram] a')),false);
  const table=keyboard.locator('.table-scroll').nth(3);await table.focus();assert.equal(await table.evaluate(e=>e===document.activeElement),true);assert.notEqual(await table.evaluate(e=>getComputedStyle(e).outlineStyle),'none');await keyboard.keyboard.press('ArrowRight');await keyboard.waitForTimeout(100);assert.ok(await table.evaluate(e=>e.scrollLeft>0));
  assert.equal(await keyboard.locator('.next-links a').first().getAttribute('href'),`${prefix}/courses/ceh/v13/m05/concepts/m05-04/`);assert.equal(await keyboard.locator('.next-links a').last().getAttribute('href'),`${prefix}/courses/ceh/v13/m05/#m05-08`);
  assert.ok((await keyboard.locator('main').innerText()).includes('v1.0.0'));assert.ok((await keyboard.locator('main').innerText()).includes('2026-11-09'));
  await keyboard.locator('.language').click();assert.equal(await keyboard.locator('html').getAttribute('lang'),lang==='zh'?'en':'zh-Hant');
  await keyboard.goto(base+prefix+'/courses/ceh/v13/m05/concepts/m05-04/');assert.equal(await keyboard.locator('.next-links a').last().getAttribute('href'),path);
  await keyboard.goto(base+prefix+'/search/');await keyboard.locator('input[type=search]').fill('EPSS');await keyboard.locator(`.reading-list a[href="${path}"]`).waitFor({state:'visible'});
  for(const pendingSlug of ['ceh26-m05-c05','m05-08'])assert.equal((await keyboard.request.get(base+prefix+'/courses/ceh/v13/m05/concepts/'+pendingSlug+'/')).status(),404);
  await keyboard.close();results.push({lang,noJavaScriptFullBody:true,keyboardDownloadBytes:true,tableKeyboardScroll:true,languageRoundtrip:true,adjacentNavigation:true,search:true,pending404:true});
 }
 const context=await browser.newContext();const r=await context.request.get(base+'/sitemap.xml');assert.equal(r.status(),200);const sitemap=await r.text();assert.ok(sitemap.includes('/courses/ceh/v13/m05/concepts/m05-05/'));assert.ok(sitemap.includes('/en/courses/ceh/v13/m05/concepts/m05-05/'));await context.close();
 writeFileSync(`${out}/results.json`,JSON.stringify({base,results},null,2));console.log('PASS: both full bodies, four widths and 200% text, eight SVG bytes, no-JS, keyboard, language, search and navigation.');
}finally{await browser?.close();server?.kill();}
