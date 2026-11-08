import {chromium} from '@playwright/test';
import {spawn} from 'node:child_process';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import assert from 'node:assert/strict';
const root='.local/cs-systems-preview/build',out='.local/cs-systems-browser';mkdirSync(out,{recursive:true});
const server=spawn('python3',['-m','http.server','4189','--bind','127.0.0.1','--directory',root],{stdio:'ignore'});
let browser;
try{
 for(let i=0;i<50;i++){try{const r=await fetch('http://127.0.0.1:4189/');if(r.ok)break;}catch{}await new Promise(r=>setTimeout(r,100));}
 browser=await chromium.launch({channel:'chrome',headless:true});
 const a=JSON.parse(readFileSync('content/perspectives/cs-systems-foundations.json','utf8')),results=[];
 const norm=s=>s.replace(/`/g,'').replace(/\s+/g,' ').trim();
 for(const lang of ['zh','en'])for(const width of [320,390,768,1280]){
  const page=await browser.newPage({viewport:{width,height:900}});await page.goto(`http://127.0.0.1:4189/${lang==='en'?'en/':''}perspectives/cs-systems-foundations/`);
  assert.equal(await page.locator('.systems-figure').count(),8);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  const body=norm(await page.locator('article.prose').innerText());
  for(const s of a.text[lang].sections)for(const b of s.body){const texts=b.kind==='systemsFigure'?[]:b.kind==='list'?b.items:b.kind==='table'?[...b.headers,...b.rows.flat()]:[b.text];for(const t of texts)assert.ok(body.includes(norm(t)),`${lang}: missing ${t.slice(0,60)}`);}
  if(width===320||width===1280)for(let i=0;i<8;i++)await page.locator('.systems-figure').nth(i).screenshot({path:`${out}/${lang}-${width}-figure-${i+1}.png`});
  const links=page.locator('.systems-figure a');for(let i=0;i<8;i++){const href=await links.nth(i).getAttribute('href');const r=await page.request.get(new URL(href,page.url()).href);assert.equal(r.status(),200);assert.deepEqual(await r.body(),readFileSync(root+href));}
  await page.addStyleTag({content:'html{font-size:200%}'});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  results.push({lang,width,figures:8,fullBody:true,downloadBytes:true,text200:true});await page.close();
 }
 for(const lang of ['zh','en']){const page=await browser.newPage({javaScriptEnabled:false,viewport:{width:320,height:900}});await page.goto(`http://127.0.0.1:4189/${lang==='en'?'en/':''}perspectives/cs-systems-foundations/`);assert.equal(await page.locator('.systems-figure').count(),8);assert.ok((await page.locator('article.prose').innerText()).includes(lang==='zh'?'TOCTOU':'TOCTOU'));await page.close();}
 for(const lang of ['zh','en']){
  const page=await browser.newPage({viewport:{width:320,height:900},acceptDownloads:true});await page.goto(`http://127.0.0.1:4189/${lang==='en'?'en/':''}perspectives/cs-systems-foundations/`);
  let reached=false;for(let i=0;i<180;i++){await page.keyboard.press('Tab');if(await page.evaluate(()=>document.activeElement?.matches('.systems-figure a'))){reached=true;break;}}assert.ok(reached,'keyboard reaches figure download');
  assert.ok(await page.evaluate(()=>getComputedStyle(document.activeElement).outlineStyle!=='none'),'visible focus');const download=page.waitForEvent('download');await page.keyboard.press('Enter');assert.ok((await download).suggestedFilename().endsWith('.svg'));await page.keyboard.press('Shift+Tab');
  const code=page.locator('pre').filter({hasText:'spawnSync'});await code.focus();await page.keyboard.press('End');await page.keyboard.press('ArrowRight');assert.equal(await code.evaluate(e=>e===document.activeElement),true);await page.close();
 }
 writeFileSync(`${out}/results.json`,JSON.stringify(results,null,2));console.log('PASS: bilingual full body, eight figures, four widths, 200% text, downloads, no-JS smoke');
}finally{await browser?.close();server.kill();}
