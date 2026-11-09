import {chromium} from '@playwright/test';
import {spawn} from 'node:child_process';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import assert from 'node:assert/strict';
const base=process.env.M05_06_BASE_URL||'http://127.0.0.1:4196';
const out=process.env.M05_06_BASE_URL?'.local/m05-06/live':'.local/m05-06/browser';mkdirSync(out,{recursive:true});
const server=process.env.M05_06_BASE_URL?null:spawn('python3',['-m','http.server','4196','--bind','127.0.0.1','--directory','build'],{stdio:'ignore'});
const a=JSON.parse(readFileSync('content/concepts/ceh26-m05-c06.json','utf8'));
const norm=s=>s.replace(/\[([^\]]+)\]\(https:\/\/[^)]+\)/g,'$1').replace(/\s+/g,' ').trim();
const texts=x=>x.kind==='visual'?[x.visual.caption,x.visual.description,...x.visual.items.flatMap(n=>[n.title,n.body])]:x.kind==='list'?x.items:x.kind==='table'?[...x.headers,...x.rows.flat()]:[x.text];
function checkBody(body,lang){let cursor=0;for(const x of a.text[lang].sourceBody)for(const t of texts(x)){const expected=norm(t),at=body.indexOf(expected,cursor);assert.ok(at>=0,`${lang}: missing or out of order: ${expected}`);cursor=at+expected.length;}}
let browser;const results=[];
try{
 if(server){let ready=false;for(let i=0;i<50;i++){try{if((await fetch(base+'/')).ok){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,100));}assert.ok(ready);}
 browser=await chromium.launch({channel:'chrome',headless:true});
 for(const lang of ['zh','en'])for(const width of [320,390,768,1280]){
 const path=`${lang==='en'?'/en':''}/courses/ceh/v13/m05/concepts/m05-06/`;
 const page=await browser.newPage({viewport:{width,height:900},acceptDownloads:true});assert.equal((await page.goto(base+path)).status(),200);await page.evaluate(()=>document.fonts.ready);
 assert.ok((await page.locator('h1').innerText()).includes('M05-06'));
 assert.equal(await page.locator('.source-body h2').count(),8);assert.equal(await page.locator('.source-body table').count(),2);
 checkBody(norm((await page.locator('.source-body').innerText()).replace(/[✓⚠]/g,'')),lang);
 assert.equal(await page.locator('[data-scan-evidence-diagram]').count(),3);assert.equal(await page.locator('[data-scan-evidence-diagram=gates] .arrow').count(),4);assert.equal(await page.locator('[data-scan-evidence-diagram=paths] .arrow').count(),0);assert.equal(await page.locator('[data-scan-evidence-diagram=result] dt').count(),4);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 for(const link of await page.locator('[data-scan-evidence-diagram] a').all()){const href=await link.getAttribute('href');assert.deepEqual(await (await page.request.get(base+href)).body(),readFileSync('site'+href));}
 if([320,1280].includes(width))for(const fig of await page.locator('[data-scan-evidence-diagram]').all())await fig.screenshot({path:`${out}/${lang}-${width}-${await fig.getAttribute('data-scan-evidence-diagram')}.png`});
 await page.addStyleTag({content:'html{font-size:200%}'});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await page.close();results.push({lang,width,fullBody:true,text200:true,svgBytes:true});
 }
 for(const lang of ['zh','en']){
 const prefix=lang==='en'?'/en':'',path=`${prefix}/courses/ceh/v13/m05/concepts/m05-06/`;
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:900}}),page=await context.newPage();await page.goto(base+path);checkBody(norm((await page.locator('.source-body').innerText()).replace(/[✓⚠]/g,'')),lang);await context.close();
 const p=await browser.newPage({viewport:{width:320,height:900},acceptDownloads:true});await p.goto(base+path);let reached=false;for(let i=0;i<150;i++){await p.keyboard.press('Tab');if(await p.evaluate(()=>document.activeElement?.matches('[data-scan-evidence-diagram] a'))){reached=true;break;}}assert.ok(reached);assert.notEqual(await p.evaluate(()=>getComputedStyle(document.activeElement).outlineStyle),'none');const pending=p.waitForEvent('download');await p.keyboard.press('Enter');const d=await pending;assert.deepEqual(readFileSync(await d.path()),readFileSync('site/images/ceh/'+d.suggestedFilename()));await p.keyboard.press('Shift+Tab');
 assert.equal(await p.locator('.next-links a').first().getAttribute('href'),`${prefix}/courses/ceh/v13/m05/concepts/m05-05/`);assert.equal(await p.locator('.next-links a').last().getAttribute('href'),`${prefix}/courses/ceh/v13/m05/#m05-08`);
 await p.locator('.language').click();assert.equal(await p.locator('html').getAttribute('lang'),lang==='zh'?'en':'zh-Hant');
 await p.goto(base+prefix+'/search/');await p.locator('input[type=search]').fill('Permission denied');await p.locator(`.reading-list a[href="${path}"]`).waitFor({state:'visible'});await p.close();
 }
 writeFileSync(`${out}/results.json`,JSON.stringify({base,results},null,2));console.log('PASS M05-06 bilingual full bodies, four widths, 200%, no JS, keyboard download, language, navigation, search, six SVGs.');
}finally{await browser?.close();server?.kill();}
