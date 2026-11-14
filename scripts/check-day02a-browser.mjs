import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
const base=process.env.DAY02A_BASE_URL||'http://127.0.0.1:4264';
const data=JSON.parse(readFileSync('content/ceh-day02-a.json','utf8'));
const figureCount=data.sections.flatMap(s=>s.body).filter(b=>b.kind==='diagram').length;
const clean=s=>s.replace(/\[([^\]]+)\]\(https:\/\/[^)]+\)/g,'$1').replace(/\s+/g,'');
const specs=JSON.parse(readFileSync('src/lib/note-diagram-specs.json','utf8'));
const out='.local/day02a';mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_CHANNEL?{channel:process.env.PLAYWRIGHT_CHANNEL}:{})});const checks=[];
try{
 for(const javaScriptEnabled of [true,false]){
  const ctx=await browser.newContext({javaScriptEnabled,acceptDownloads:true});const page=await ctx.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(String(e)));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
  for(const width of [320,390,768,1280]){
   await page.setViewportSize({width,height:900});const response=await page.goto(base+'/ceh-notes/day02-a-reconnaissance/');await page.waitForLoadState('networkidle');assert.equal(response.status(),200);
   assert.equal(await page.locator('h1').textContent(),data.title);assert.ok((await page.locator('main').innerText()).includes('v'+data.contentVersion));assert.equal(await page.locator('main time').first().getAttribute('datetime'),data.publishedOn);assert.equal(await page.locator('main time').last().getAttribute('datetime'),data.revisedOn);assert.equal(await page.locator('[data-diagram]').count(),figureCount);
   if(javaScriptEnabled)for(const b of data.sections.flatMap(s=>s.body).filter(b=>b.kind==='diagram')){if(!specs[b.name].edges)continue;const count=specs[b.name].edges.length;await page.waitForFunction(({name,count})=>document.querySelectorAll(`[data-diagram="${name}"] .connections path`).length===count,{name:b.name,count});}
   assert.deepEqual(errors,[], 'Page and resource loading errors');
   assert.equal(await page.locator('a.__cf_email__, a[href*="email-protection"]').count(),0,'Synthetic teaching address stays selectable without email obfuscation');
   const rendered=clean(await page.locator('main').innerText());
   assert.doesNotMatch(rendered,/博士|碩士|研究生/,'Public body uses general teaching language');
   for(const code of await page.locator('article pre').all()){const style=await code.evaluate(el=>{const s=getComputedStyle(el);return {size:parseFloat(s.fontSize),line:parseFloat(s.lineHeight),bg:s.backgroundColor,color:s.color};});assert.ok(style.size>=16&&style.line/style.size>=1.7);assert.equal(style.bg,'rgb(242, 246, 245)');assert.equal(style.color,'rgb(24, 37, 44)');}
   for(const section of data.sections){assert.ok(rendered.includes(clean(section.heading)));for(const b of section.body){
    const texts=b.kind==='diagram'?[b.caption,b.description,...b.items.flatMap(i=>[i.title,i.body])]:b.kind==='table'?[...b.headers,...b.rows.flat()]:b.kind==='list'?b.items:[b.text];
    for(const text of texts)assert.ok(rendered.includes(clean(text)),`Missing: ${text}`);
   }}
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`${width}/${javaScriptEnabled} overflow`);
   assert.equal(await page.locator('a.language').count(),0);assert.equal(await page.locator('link[rel=alternate]').count(),0);
   checks.push(`Full body and ${figureCount} figures, ${width}px, JS=${javaScriptEnabled}`);
   if(javaScriptEnabled&&(width===390||width===1280))for(const figure of await page.locator('[data-diagram]').all())await figure.screenshot({path:`${out}/${await figure.getAttribute('data-diagram')}-${width}.png`});
  }
  await page.setViewportSize({width:320,height:900});await page.evaluate(()=>document.documentElement.style.fontSize='200%');assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);checks.push(`200% at 320px, JS=${javaScriptEnabled}`);
  await page.evaluate(()=>document.documentElement.style.fontSize='');
  const table=page.locator('.table-scroll').first();await table.focus();await page.keyboard.press('ArrowRight');assert.equal(await table.evaluate(el=>el===document.activeElement),true);
  await page.keyboard.press('Tab');await page.keyboard.press('Shift+Tab');assert.equal(await table.evaluate(el=>el===document.activeElement),true);checks.push(`Keyboard table focus, JS=${javaScriptEnabled}`);
  await ctx.close();
 }
 const ctx=await browser.newContext();const page=await ctx.newPage();await page.goto(base+'/ceh-notes/day02-a-reconnaissance/');
 for(const figure of await page.locator('[data-diagram]').all()){
  const link=figure.locator('a[download]');await link.focus();assert.equal(await link.evaluate(el=>el===document.activeElement),true);const downloaded=page.waitForEvent('download');await page.keyboard.press('Enter');assert.deepEqual(readFileSync(await (await downloaded).path()),readFileSync('site'+await link.getAttribute('href')));const href=await link.getAttribute('href');const response=await ctx.request.get(base+href);assert.equal(response.status(),200);assert.deepEqual(await response.body(),readFileSync('site'+href));
  await page.goto(base+href);const geometry=await page.evaluate(()=>{const root=document.documentElement;const v=root.viewBox.baseVal;return [...root.querySelectorAll('text')].map(el=>{const b=el.getBBox();return {text:el.textContent,x:b.x,y:b.y,w:b.width,h:b.height,out:b.x<0||b.y<0||b.x+b.width>v.width||b.y+b.height>v.height};});});assert.ok(!geometry.some(b=>b.out),JSON.stringify(geometry.filter(b=>b.out)));for(let i=0;i<geometry.length;i++)for(let j=i+1;j<geometry.length;j++){const a=geometry[i],b=geometry[j];assert.ok(!(a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y),`Overlapping SVG labels: ${a.text} / ${b.text}`);}await page.goto(base+'/ceh-notes/day02-a-reconnaissance/');
 }
 const index=await ctx.request.get(base+'/search-index.json');assert.ok((await index.text()).includes('CEH-DAY02-A'));

 await page.goto(base+'/ceh-notes/');assert.equal(await page.locator('a[href="/ceh-notes/day02-a-reconnaissance/"]').count(),1);
 checks.push(`${figureCount} SVGs: exact bytes, text bounds; notes index and search discovery`);await ctx.close();
 writeFileSync(out+'/result.json',JSON.stringify({base,checks,scope:'Article/browser QA; not learner completion'},null,2)+'\n');console.log(JSON.stringify({passed:checks.length,base}));
}finally{await browser.close();}
