import {chromium,expect} from '@playwright/test';
import assert from 'node:assert/strict';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
const base=process.env.EMEANS_BASE_URL||'http://127.0.0.1:4281';
const out=process.env.EMEANS_EVIDENCE_DIR||'.local/emeans-browser';mkdirSync(out,{recursive:true});
const article=JSON.parse(readFileSync('content/perspectives/e-means-clustering.json','utf8'));
const models=JSON.parse(readFileSync('src/lib/e-means-figures.json','utf8'));
const clean=s=>s.replace(/\[([^\]]+)\]\(https:\/\/[^)]+\)/g,'$1').replace(/`/g,'').replace(/\s+/g,'');
const browser=await chromium.launch({headless:true});const checks=[];
try{
 for(const lang of ['zh','en'])for(const javaScriptEnabled of [true,false]){
  const context=await browser.newContext({javaScriptEnabled,acceptDownloads:true});const page=await context.newPage();const errors=[];
  page.on('pageerror',e=>errors.push(String(e)));page.on('response',r=>{if(r.status()>=400&&r.url().startsWith(base))errors.push(`${r.status()} ${r.url()}`);});
  const path=(lang==='zh'?'':'/en')+'/perspectives/e-means-clustering/';
  for(const width of [320,390,768,1280]){
   await page.setViewportSize({width,height:900});const response=await page.goto(base+path);await page.waitForLoadState('networkidle');assert.equal(response.status(),200);assert.deepEqual(errors,[]);
   assert.equal(await page.locator('h1').textContent(),article.text[lang].title);assert.ok((await page.locator('main').innerText()).includes('v1.0.0'));
   assert.equal(await page.locator('[data-emeans-figure]').count(),8);
   for(const section of article.text[lang].sections){
    const actual=clean(await page.locator('#'+section.id).locator('..').innerText());assert.ok(actual.includes(clean(section.heading)));
    for(const b of section.body){
     const texts=b.kind==='eMeansFigure'?[models[b.name].title[lang],models[b.name].description[lang],...models[b.name].nodes.flatMap(n=>[n[lang].title,n[lang].body]),models[b.name].note[lang]]:b.kind==='table'?[...b.headers,...b.rows.flat()]:b.kind==='list'?b.items:[b.text];
     for(const text of texts)assert.ok(actual.includes(clean(text)),`Missing ${lang}/${section.id}: ${text}`);
    }
   }
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`${lang}/${width}/${javaScriptEnabled} overflow`);
   const typography=await page.locator('.prose p,.prose li,.prose figcaption,.prose th,.prose td').evaluateAll(els=>els.filter(e=>e.getClientRects().length).map(el=>{const s=getComputedStyle(el);return {size:parseFloat(s.fontSize),line:parseFloat(s.lineHeight),floor:el.classList.contains('source-note')?14:16}}));
   assert.ok(typography.every(s=>s.size>=s.floor&&s.line/s.size>=1.7));
   if(javaScriptEnabled&&(width===390||width===1280))for(const figure of await page.locator('[data-emeans-figure]').all())await figure.screenshot({path:`${out}/${lang}-${await figure.getAttribute('data-emeans-figure')}-${width}.png`});
   checks.push(`Full ${lang} body and 8 figures, ${width}px, JS=${javaScriptEnabled}`);
  }
  await page.setViewportSize({width:320,height:900});await page.evaluate(()=>document.documentElement.style.fontSize='200%');assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.screenshot({path:`${out}/${lang}-text200-js${javaScriptEnabled}.png`,fullPage:false});checks.push(`200% text, ${lang}, JS=${javaScriptEnabled}`);await page.evaluate(()=>document.documentElement.style.fontSize='');
  let scrollTests=0;for(const region of await page.locator('.prose pre[tabindex],.prose .table-scroll[tabindex]').all())if(await region.evaluate(el=>el.scrollWidth>el.clientWidth)){await region.focus();assert.equal(await region.evaluate(el=>el===document.activeElement),true);await region.press('ArrowRight');await expect.poll(()=>region.evaluate(el=>el.scrollLeft)).toBeGreaterThan(0);scrollTests++;}
  assert.ok(scrollTests>0);checks.push(`Keyboard-scrolled wide content, ${lang}, JS=${javaScriptEnabled}`);
  const link=page.locator('[data-emeans-figure] a[download]').first();await link.focus();await page.keyboard.press('Tab');await page.keyboard.press('Shift+Tab');assert.equal(await link.evaluate(el=>el===document.activeElement),true);const outline=await link.evaluate(el=>getComputedStyle(el).outlineStyle);assert.notEqual(outline,'none');
  const downloadPromise=page.waitForEvent('download');await page.keyboard.press('Enter');const download=await downloadPromise;assert.deepEqual(readFileSync(await download.path()),readFileSync('site'+await link.getAttribute('href')));checks.push(`Keyboard focus and SVG download, ${lang}, JS=${javaScriptEnabled}`);
  const relativeLinks=await page.locator('main a[href]').evaluateAll(els=>els.map(e=>e.getAttribute('href')).filter(h=>h.startsWith('/')&&!h.startsWith('//')));
  for(const target of new Set(relativeLinks)){const response=await context.request.get(base+target);assert.equal(response.status(),200,target);}
  for(const name of Object.keys(models)){
   const asset=`/images/perspectives/e-means-${name}-${lang}.svg`;const response=await context.request.get(base+asset);assert.equal(response.status(),200);assert.deepEqual(await response.body(),readFileSync('site'+asset));
   await page.goto(base+asset);const geometry=await page.evaluate(()=>{const v=document.documentElement.viewBox.baseVal;return [...document.querySelectorAll('text')].map(el=>{const b=el.getBBox();return {text:el.textContent,x:b.x,y:b.y,w:b.width,h:b.height,out:b.x<0||b.y<0||b.x+b.width>v.width||b.y+b.height>v.height};});});assert.ok(!geometry.some(t=>t.out),JSON.stringify(geometry.filter(t=>t.out)));
   for(let i=0;i<geometry.length;i++)for(let j=i+1;j<geometry.length;j++){const a=geometry[i],b=geometry[j];assert.ok(!(a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y),`${name}: overlapping labels ${a.text} / ${b.text}`);}
  }
  await page.goto(base+(lang==='zh'?'':'/en')+'/perspectives/');assert.equal(await page.locator(`a[href="${path}"]`).count(),1);await page.goto(base+path);assert.equal(await page.locator('a.language').getAttribute('href'),lang==='zh'?'/en'+path:path.replace('/en',''));
  checks.push(`8 SVG bytes/bounds, listing, language and related links, ${lang}, JS=${javaScriptEnabled}`);await context.close();
 }
 const context=await browser.newContext();const response=await context.request.get(base+'/search-index.json');assert.equal(response.status(),200);const index=await response.json();for(const lang of ['zh','en'])assert.ok(index.some(e=>e.id===article.id&&e.lang===lang&&e.text.includes('190/17')));await context.close();checks.push('Both search entries contain the worked derivation');
 writeFileSync(out+'/result.json',JSON.stringify({base,passed:checks.length,checks,scope:'Browser/production content verification; not physical-device, screen-reader or learner acceptance'},null,2)+'\n');console.log(JSON.stringify({base,passed:checks.length}));
}finally{await browser.close();}
