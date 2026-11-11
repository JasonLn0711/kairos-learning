import {test,expect,type Page} from '@playwright/test';
import {readFileSync} from 'node:fs';
const lesson=JSON.parse(readFileSync('content/aase/lessons/aase-m07-c02.json','utf8'));
async function completeBody(page:Page,lang:'zh'|'en'){
 for(const s of lesson.text[lang].sections){
  const section=page.locator('h2#'+s.id).locator('..');await expect(section.locator('h2').first()).toHaveText(s.heading);
  for(const p of s.paragraphs)await expect(section).toContainText(p);
  for(const b of s.blocks??[]){
   if(b.kind==='prose')for(const p of b.paragraphs)await expect(section).toContainText(p);
   if(b.kind==='step'){await expect(section).toContainText(b.heading);for(const p of b.paragraphs)await expect(section).toContainText(p);if(b.code)await expect(section.locator('code')).toHaveText(b.code);}
   if(b.kind==='cards'||b.kind==='flow'){for(const item of b.items){await expect(section).toContainText(item.title);await expect(section).toContainText(item.body);}await expect(section).toContainText(b.description);}
   if(b.kind==='table'){const table=section.getByRole('table',{name:b.caption});await expect(table.locator('th')).toHaveText(b.headers.map((v:string)=>v.replaceAll('`','')));await expect(table.locator('td')).toHaveText(b.rows.flat().map((v:string)=>v.replaceAll('`','')));}
  }
 }
 for(const q of lesson.text[lang].openChecks){const section=page.locator('#'+q.id).locator('..');await expect(section.locator('h3')).toHaveText(q.prompt);await expect(section.locator('details p')).toHaveText(q.answer);}
}
for(const lang of ['zh','en'] as const)test(`${lang}: full body, responsive figures, keyboard, no-JS, search and exports`,async({page,browser,baseURL,request})=>{
 const path=`${lang==='en'?'/en':''}/courses/aase/v1/m07/concepts/m07-02/`;const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(path);await expect(page.locator('.article-metadata')).toContainText('v1.1.0');await completeBody(page,lang);
 const figures=page.locator('figure:has(a[href*="/images/aase/m07-02-"])');await expect(figures).toHaveCount(2);await expect(figures.nth(0).locator('ol>li')).toHaveCount(5);await expect(figures.nth(1).locator('ul>li')).toHaveCount(2);
 expect(await figures.nth(0).locator('ol>li').evaluateAll(es=>es.map(e=>getComputedStyle(e,'::after').content).filter(c=>c.includes('↓')).length)).toBe(4);
 expect(await figures.nth(1).locator('li').evaluateAll(es=>es.some(e=>getComputedStyle(e,'::after').content.includes('↓')))).toBe(false);
 const firstLink=figures.first().locator('a');await firstLink.focus();await page.keyboard.press('Tab');await page.keyboard.press('Shift+Tab');await expect(firstLink).toBeFocused();expect(await firstLink.evaluate(e=>getComputedStyle(e).outlineStyle)).not.toBe('none');
 for(const q of lesson.text[lang].openChecks){const answer=page.locator('#'+q.id).locator('..').locator('details');await answer.locator('summary').focus();await page.keyboard.press('Enter');await expect(answer).toHaveAttribute('open','');await page.keyboard.press('Space');await expect(answer).not.toHaveAttribute('open','');}
 for(const width of [320,390,768,1280])for(const scale of [1,2]){
  await page.setViewportSize({width,height:900});await page.evaluate(s=>document.documentElement.style.setProperty('font-size',s*100+'%','important'),scale);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth),`${width}/${scale}`).toBeLessThanOrEqual(width);
  const bad=await page.locator('article p,article li,article th,article td,article figcaption').evaluateAll(es=>es.filter(e=>{const s=getComputedStyle(e);return e.getClientRects().length&&(parseFloat(s.fontSize)<16||parseFloat(s.lineHeight)/parseFloat(s.fontSize)<1.7||e.scrollWidth>e.clientWidth+1)}).map(e=>e.textContent?.slice(0,100)));expect(bad,`${width}/${scale}`).toEqual([]);
  if(scale===1&&(width===390||width===1280))for(let n=0;n<2;n++)await figures.nth(n).screenshot({path:`.local/aase/m0702/${lang}-${n+1}-${width}.png`});
 }
 await page.evaluate(()=>document.documentElement.style.removeProperty('font-size'));
 for(const region of await page.locator('article .table-scroll,article .code-region').all()){await region.focus();await expect(region).toBeFocused();if(await region.evaluate(e=>e.scrollWidth>e.clientWidth)){await region.press('ArrowRight');await expect.poll(()=>region.evaluate(e=>e.scrollLeft)).toBeGreaterThan(0);}}
 const search=await(await request.get('/search-index.json')).json();const entry=search.find((e:any)=>e.id===lesson.id&&e.lang===lang);for(const s of lesson.text[lang].sections){for(const p of s.paragraphs)expect(entry.text).toContain(p);for(const b of s.blocks??[])if(b.kind==='cards'||b.kind==='flow')for(const item of b.items){expect(entry.text).toContain(item.title);expect(entry.text).toContain(item.body);}}
 for(const n of [1,2]){const href=`/images/aase/m07-02-${n}-${lang}.svg`;const link=page.locator('a[href="'+href+'"]');await link.focus();const popupPromise=page.waitForEvent('popup');await page.keyboard.press('Enter');const popup=await popupPromise;await popup.waitForLoadState();await popup.evaluate(()=>document.fonts.ready);expect(new URL(popup.url()).pathname).toBe(href);
  const bounds=await popup.locator('text').evaluateAll(es=>es.map(e=>{const t=e as SVGGraphicsElement;const b=t.getBBox();const v=t.ownerSVGElement!.viewBox.baseVal;return {text:e.textContent,x:b.x,y:b.y,right:b.x+b.width,bottom:b.y+b.height,width:v.width,height:v.height};}).filter(b=>b.x<0||b.y<0||b.right>b.width||b.bottom>b.height));expect(bounds).toEqual([]);
  const overlaps=await popup.locator('text').evaluateAll(es=>{const boxes=es.map(e=>({text:e.textContent,b:(e as SVGGraphicsElement).getBBox()}));return boxes.flatMap((a,i)=>boxes.slice(i+1).filter(c=>a.b.x<c.b.x+c.b.width&&c.b.x<a.b.x+a.b.width&&a.b.y<c.b.y+c.b.height&&c.b.y<a.b.y+a.b.height).map(c=>[a.text,c.text]));});expect(overlaps).toEqual([]);await popup.screenshot({path:`.local/aase/m0702/${lang}-${n}-svg.png`});await popup.close();const response=await request.get(href);expect(response.status()).toBe(200);const body=await response.body();expect(body.length).toBeLessThan(100000);expect(body).toEqual(readFileSync('site'+href));}
 const context=await browser.newContext({baseURL,javaScriptEnabled:false,viewport:{width:320,height:900}});try{const p=await context.newPage();await p.goto(path);await completeBody(p,lang);const summary=p.locator('#checks').locator('..').locator('summary').first();await summary.press('Enter');await expect(summary.locator('..')).toHaveAttribute('open','');expect(await p.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);}finally{await context.close();}
 expect(errors).toEqual([]);
});
