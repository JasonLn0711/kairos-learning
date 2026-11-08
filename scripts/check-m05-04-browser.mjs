import {chromium} from '@playwright/test';
import {spawn} from 'node:child_process';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import assert from 'node:assert/strict';
const base=process.env.M05_04_BASE_URL||'http://127.0.0.1:4194',root=process.env.M05_04_BASE_URL?'build':'.local/m05-04-preview/build',out=process.env.M05_04_BASE_URL?'.local/m05-04-live':'.local/m05-04-browser';mkdirSync(out,{recursive:true});
const server=process.env.M05_04_BASE_URL?null:spawn('python3',['-m','http.server','4194','--bind','127.0.0.1','--directory',root],{stdio:'ignore'});
let browser;
try{
 for(let i=0;i<50;i++){try{const r=await fetch(base+'/');if(r.ok)break;}catch{}await new Promise(r=>setTimeout(r,100));}
 browser=await chromium.launch({channel:'chrome',headless:true});
 const a=JSON.parse(readFileSync('content/concepts/ceh26-m05-c04.json','utf8')),results=[];
 const norm=s=>s.replace(/\[([^\]]+)\]\(https:\/\/[^)]+\)/g,'$1').replace(/`/g,'').replace(/\s+/g,' ').trim();
 for(const lang of ['zh','en'])for(const width of [320,390,768,1280]){
  const page=await browser.newPage({viewport:{width,height:900}});await page.goto(`${base}/${lang==='en'?'en/':''}courses/ceh/v13/m05/concepts/m05-04/`);
  assert.equal(await page.locator('[data-identification-diagram]').count(),5);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  const body=norm(await page.locator('.source-body').innerText());
  assert.deepEqual(await page.locator('.source-body p,.source-body table,.source-body pre,.source-body h3').evaluateAll(es=>es.filter(e=>{const s=getComputedStyle(e);return parseFloat(s.fontSize)<16||parseFloat(s.lineHeight)/parseFloat(s.fontSize)<1.69}).map(e=>e.tagName)),[]);
  for(const x of a.text[lang].sourceBody){const texts=x.kind==='visual'?[x.visual.caption,x.visual.description,...x.visual.items.flatMap(n=>[n.title,n.body])]:x.kind==='list'?x.items:x.kind==='table'?[...x.headers,...x.rows.flat()]:[x.text];for(const t of texts)assert.ok(body.includes(norm(t)),`${lang}: missing ${t.slice(0,60)}`);}

  if(width===320||width===1280)for(let i=0;i<5;i++)await page.locator('[data-identification-diagram]').nth(i).screenshot({path:`${out}/${lang}-${width}-figure-${i+1}.png`});
  const links=page.locator('[data-identification-diagram] a');for(let i=0;i<5;i++){const href=await links.nth(i).getAttribute('href');const r=await page.request.get(new URL(href,page.url()).href);assert.equal(r.status(),200);assert.deepEqual(await r.body(),readFileSync(root+href));}
  await page.addStyleTag({content:'html{font-size:200%}'});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  results.push({lang,width,figures:5,fullBody:true,downloadBytes:true,text200:true});await page.close();
 }
 for(const lang of ['zh','en']){const page=await browser.newPage({javaScriptEnabled:false,viewport:{width:320,height:900}});await page.goto(`${base}/${lang==='en'?'en/':''}courses/ceh/v13/m05/concepts/m05-04/`);assert.equal(await page.locator('[data-identification-diagram]').count(),5);const staticText=norm(await page.locator('.source-body').innerText());for(const x of a.text[lang].sourceBody){const texts=x.kind==='visual'?[x.visual.caption,x.visual.description,...x.visual.items.flatMap(n=>[n.title,n.body])]:x.kind==='list'?x.items:x.kind==='table'?[...x.headers,...x.rows.flat()]:[x.text];for(const t of texts)assert.ok(staticText.includes(norm(t)),`${lang} no-JS missing ${t.slice(0,50)}`);}await page.close();}
 for(const lang of ['zh','en']){
  const page=await browser.newPage({viewport:{width:320,height:900},acceptDownloads:true});await page.goto(`${base}/${lang==='en'?'en/':''}courses/ceh/v13/m05/concepts/m05-04/`);
  let reached=false;for(let i=0;i<180;i++){await page.keyboard.press('Tab');if(await page.evaluate(()=>document.activeElement?.matches('[data-identification-diagram] a'))){reached=true;break;}}assert.ok(reached,'keyboard reaches figure download');
  assert.ok(await page.evaluate(()=>getComputedStyle(document.activeElement).outlineStyle!=='none'),'visible focus');const download=page.waitForEvent('download');await page.keyboard.press('Enter');assert.ok((await download).suggestedFilename().endsWith('.svg'));await page.keyboard.press('Shift+Tab');
  const code=page.locator('pre').filter({hasText:'cpe:2.3'});await code.focus();await page.keyboard.press('End');await page.keyboard.press('ArrowRight');assert.equal(await code.evaluate(e=>e===document.activeElement),true);await page.close();
 }
 const page=await browser.newPage();for(const lang of ['zh','en']){const prefix=lang==='en'?'/en':'';await page.goto(`${base}${prefix}/courses/ceh/v13/m05/concepts/m05-04/`);assert.equal(await page.locator('.next-links a').first().getAttribute('href'),prefix+'/courses/ceh/v13/m05/concepts/m05-03/');assert.equal(await page.locator('.next-links a').last().getAttribute('href'),prefix+'/courses/ceh/v13/m05/#ceh26-m05-c05');assert.ok((await page.locator('main').innerText()).includes('v1.0.0'));}const response=await page.request.get(base+'/search-index.json');assert.equal(response.status(),200);const index=await response.json();for(const lang of ['zh','en']){const entry=index.find(x=>x.id===a.id&&x.lang===lang);assert.ok(entry);for(const word of ['CWE-79','Orange Document Server','CVE-2021-44228'])assert.ok(entry.text.includes(word),word);}await page.close();
 writeFileSync(`${out}/results.json`,JSON.stringify(results,null,2));console.log('PASS: bilingual full body, five figures, four widths, 200% text, downloads, no-JS smoke');
}finally{await browser?.close();server?.kill();}
