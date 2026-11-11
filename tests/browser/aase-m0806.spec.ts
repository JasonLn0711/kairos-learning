import {test,expect} from '@playwright/test';
import {readFileSync,mkdirSync} from 'node:fs';
const lesson=JSON.parse(readFileSync('content/aase/lessons/aase-m08-c06.json','utf8'));
const normalize=(s:string)=>s.replace(/^### |> |^- |^\d+\. /gm,'').replace(/`/g,'').replace(/\s+/g,' ').trim();
mkdirSync('.local/m0806/screenshots',{recursive:true});
for(const lang of ['zh','en'] as const)test(`${lang}: complete body, responsive flow, operation and SVG`,async({page,browser,baseURL})=>{
 const path=`${lang==='en'?'/en':''}/courses/aase/v1/m08/concepts/m08-06/`;
 const t=lesson.text[lang];const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(path);await expect(page.locator('main')).toContainText('v1.1.0');
 for(const s of t.sections){
  const section=page.locator(`h2#${s.id}`).locator('..');const body=normalize(await section.innerText());
  for(const p of s.paragraphs)expect(body).toContain(normalize(p));
  for(const b of s.blocks){
   const values=b.kind==='prose'?b.paragraphs:b.kind==='flow'?[b.caption,b.description,...b.items.flatMap((i:any)=>[i.title,i.body])]:b.kind==='table'?[b.caption,...b.headers,...b.rows.flat()]:[b.heading,...b.paragraphs,b.code];
   for(const value of values)expect(body).toContain(normalize(value));
  }
 }
 const flow=page.locator('.regression-evidence');await expect(flow.locator('li')).toHaveCount(5);
 for(const width of [320,390,768,1280]){
  await page.setViewportSize({width,height:1000});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  const rects=await flow.locator('li').evaluateAll(es=>es.map(e=>{const r=e.getBoundingClientRect();return {top:r.top,bottom:r.bottom}}));
  for(let i=1;i<rects.length;i++)expect(rects[i].top).toBeGreaterThanOrEqual(rects[i-1].bottom);
  const metrics=await flow.locator('li p').first().evaluate(e=>{const s=getComputedStyle(e);return {font:parseFloat(s.fontSize),line:parseFloat(s.lineHeight)}});
  expect(metrics.font).toBeGreaterThanOrEqual(16);expect(metrics.line/metrics.font).toBeGreaterThanOrEqual(1.7);
  await expect(flow.locator('li').last()).toHaveCSS('background-color','rgb(234, 246, 239)');
  if([390,1280].includes(width))await flow.screenshot({path:`.local/m0806/screenshots/${lang}-${width}.png`});
 }
 await page.setViewportSize({width:390,height:1000});await page.addStyleTag({content:'html{font-size:200% !important}'});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await flow.screenshot({path:`.local/m0806/screenshots/${lang}-200.png`});
 await page.goto(path);await page.keyboard.press('Tab');await expect(page.locator('a.skip')).toBeFocused();await page.keyboard.press('Enter');await expect(page.locator('#main')).toBeFocused();
 const summary=page.locator('#checks').locator('..').locator('summary').first();await summary.focus();await page.keyboard.press('Enter');await expect(summary.locator('..')).toHaveAttribute('open','');await page.keyboard.press('Space');await expect(summary.locator('..')).not.toHaveAttribute('open','');
 await page.keyboard.press('Tab');await page.keyboard.press('Shift+Tab');await expect(summary).toBeFocused();
 await page.setViewportSize({width:320,height:900});
 for(const region of await page.locator('.code-region,.table-scroll').all()){
  await region.focus();await expect(region).toBeFocused();
  if(await region.evaluate(e=>e.scrollWidth>e.clientWidth)){await page.keyboard.press('ArrowRight');await expect.poll(()=>region.evaluate(e=>e.scrollLeft)).toBeGreaterThan(0);}
 }
 const download=flow.locator('a');await download.focus();await expect(download).toBeFocused();
 const [popup]=await Promise.all([page.waitForEvent('popup'),page.keyboard.press('Enter')]);await popup.waitForLoadState();
 expect(popup.url()).toContain(`m08-06-1-${lang}.svg`);await popup.close();
 const response=await page.request.get(`/images/aase/m08-06-1-${lang}.svg`);expect(response.ok()).toBe(true);expect(await response.body()).toEqual(readFileSync(`site/images/aase/m08-06-1-${lang}.svg`));
 const search=await (await page.request.get('/search-index.json')).text();expect(search).toContain(lang==='zh'?'比較預期結果與實際結果':'Compare expected and actual results');
 const context=await browser.newContext({javaScriptEnabled:false,baseURL});const staticPage=await context.newPage();await staticPage.goto(path);await expect(staticPage.locator('.regression-evidence li')).toHaveCount(5);
 const staticBody=normalize(await staticPage.locator('main').innerText());for(const s of t.sections)for(const p of s.paragraphs)expect(staticBody).toContain(normalize(p));
 const staticSummary=staticPage.locator('#checks').locator('..').locator('summary').first();await staticSummary.click();await expect(staticSummary.locator('..')).toHaveAttribute('open','');await context.close();
 await page.goto(`/images/aase/m08-06-1-${lang}.svg`);await page.evaluate(()=>document.fonts.ready);
 const geometry=await page.locator('svg').evaluate((svg:any)=>{
  const v=svg.viewBox.baseVal;const boxes=Array.from(svg.querySelectorAll('text')).map((e:any)=>{const b=e.getBBox();return {x:b.x,y:b.y,w:b.width,h:b.height,text:e.textContent}});
  return {outside:boxes.filter(b=>b.x<0||b.y<0||b.x+b.w>v.width||b.y+b.h>v.height),overlaps:boxes.flatMap((a,i)=>boxes.slice(i+1).filter(b=>a.x<b.x+b.w&&b.x<a.x+a.w&&a.y<b.y+b.h&&b.y<a.y+a.h).map(b=>[a.text,b.text]))};
 });expect(geometry.outside).toEqual([]);expect(geometry.overlaps).toEqual([]);
 expect(errors).toEqual([]);
});
