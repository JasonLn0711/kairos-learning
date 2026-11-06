import {test,expect,type Page} from '@playwright/test';
import {readFileSync} from 'node:fs';
const lesson=JSON.parse(readFileSync('content/aase/lessons/aase-m01-c04.json','utf8'));
const layouts=['comparison','process','evidence'];
async function completeBody(page:Page,lang:'zh'|'en'){
 for(const s of lesson.text[lang].sections){
  const section=page.locator('h2#'+s.id).locator('..');await expect(section.locator('h2').first()).toHaveText(s.heading);
  for(const p of s.paragraphs)await expect(section).toContainText(p);
  for(const b of s.blocks??[]){
   if(b.kind==='step'){await expect(section.locator('h3#'+b.id)).toHaveText(b.heading);for(const p of b.paragraphs)await expect(section).toContainText(p);if(b.code)await expect(section.locator('code')).toHaveText(b.code);}
   if(b.kind==='cards'||b.kind==='flow'){for(const i of b.items){await expect(section).toContainText(i.title);await expect(section).toContainText(i.body);}await expect(section).toContainText(b.description);}
   if(b.kind==='table'){await expect(section.locator('th')).toHaveText(b.headers);await expect(section.locator('td')).toHaveText(b.rows.flat());}
  }
 }
 for(const q of lesson.checks){const section=page.locator('#'+q.id).locator('..');await expect(section.locator('h3')).toHaveText(q.text[lang].prompt);await expect(section.locator('ol').first().locator('li')).toHaveText(q.text[lang].options);await expect(section.locator('details ol li')).toHaveText(q.text[lang].rationales);}
}
for(const lang of ['zh','en'] as const)test(`${lang}: full source, three diagram relationships, exports, keyboard, reflow and no JavaScript`,async({page,browser,baseURL,request})=>{
 const path=`${lang==='en'?'/en':''}/courses/aase/v1/m01/concepts/m01-04/`;const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(path);await expect(page.locator('.article-metadata')).toContainText('v1.1.0');await completeBody(page,lang);await expect(page.locator('.requirements-diagram')).toHaveCount(3);
 await expect(page.locator('.comparison ul>li')).toHaveCount(2);await expect(page.locator('.process ol>li')).toHaveCount(5);await expect(page.locator('.evidence ul>li')).toHaveCount(3);
 for(const q of lesson.checks){const section=page.locator('#'+q.id).locator('..');const answer=section.locator('details');await expect(answer).not.toHaveAttribute('open','');await answer.locator('summary').focus();await page.keyboard.press('Enter');await expect(answer).toHaveAttribute('open','');await expect(answer).toContainText(String.fromCharCode(65+q.answer));expect(await answer.locator('summary').evaluate(e=>getComputedStyle(e).outlineStyle)).not.toBe('none');await page.keyboard.press('Space');await expect(answer).not.toHaveAttribute('open','');}
 await page.locator('.requirements-diagram a').first().focus();await page.keyboard.press('Tab');await expect(page.locator('.table-scroll').first()).toBeFocused();await page.keyboard.press('Shift+Tab');await expect(page.locator('.requirements-diagram a').first()).toBeFocused();
 for(const width of [320,390,768,1280])for(const scale of [1,2]){
  await page.setViewportSize({width,height:900});await page.evaluate(s=>document.documentElement.style.setProperty('font-size',s*100+'%','important'),scale);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth),`${width}/${scale}`).toBeLessThanOrEqual(width);
  const bad=await page.locator('article p,article li,article figcaption').evaluateAll(es=>es.filter(e=>{const s=getComputedStyle(e);return e.getClientRects().length&&(parseFloat(s.fontSize)<16||parseFloat(s.lineHeight)/parseFloat(s.fontSize)<1.7||e.scrollWidth>e.clientWidth+1)}).map(e=>e.textContent?.slice(0,100)));expect(bad,`${width}/${scale}`).toEqual([]);
  const columns=await page.locator('.comparison ul').evaluate(e=>getComputedStyle(e).gridTemplateColumns.split(' ').length);if(width<=390||scale===2)expect(columns).toBe(1);if(width===1280&&scale===1)expect(columns).toBe(2);
  const arrows=await page.locator('.process li:not(:last-child)').evaluateAll(es=>es.map(e=>getComputedStyle(e,'::after').content));expect(arrows).toEqual(Array(4).fill('"↓"'));expect(await page.locator('.process li:last-child').evaluate(e=>getComputedStyle(e).borderTopWidth)).toBe('1px');
  if(scale===1&&(width===390||width===1280))for(const layout of layouts)await page.locator('.'+layout+'.requirements-diagram').screenshot({path:`.local/aase/m0104/${lang}-${layout}-${width}.png`});
 }
 await page.evaluate(()=>document.documentElement.style.removeProperty('font-size'));await page.setViewportSize({width:320,height:900});
 for(const region of await page.locator('article .table-scroll,article .code-region').all()){await region.focus();await expect(region).toBeFocused();if(await region.evaluate(e=>e.scrollWidth>e.clientWidth)){await region.press('ArrowRight');await expect.poll(()=>region.evaluate(e=>e.scrollLeft)).toBeGreaterThan(0);}}
 const search=await(await request.get('/search-index.json')).json();const entry=search.find((e:any)=>e.id===lesson.id&&e.lang===lang);for(const s of lesson.text[lang].sections)for(const p of s.paragraphs)expect(entry.text).toContain(p);
 for(const layout of layouts){const href=`/images/aase/m01-04-${layout}-${lang}.svg`;const link=page.locator('a[href="'+href+'"]');await expect(link).toHaveCount(1);await link.focus();const popupPromise=page.waitForEvent('popup');await page.keyboard.press('Enter');const popup=await popupPromise;await popup.waitForLoadState();await popup.evaluate(()=>document.fonts.ready);expect(new URL(popup.url()).pathname).toBe(href);
  const bounds=await popup.locator('text').evaluateAll(es=>es.map(e=>{const t=e as SVGGraphicsElement;const b=t.getBBox();const v=t.ownerSVGElement!.viewBox.baseVal;return {text:e.textContent,x:b.x,y:b.y,right:b.x+b.width,bottom:b.y+b.height,width:v.width,height:v.height};}).filter(b=>b.x<0||b.y<0||b.right>b.width||b.bottom>b.height));expect(bounds).toEqual([]);await popup.screenshot({path:`.local/aase/m0104/${lang}-${layout}-svg.png`});await popup.close();const response=await request.get(href);expect(response.status()).toBe(200);const body=await response.body();expect(body.length).toBeLessThan(100000);expect(body).toEqual(readFileSync('site'+href));}
 const context=await browser.newContext({baseURL,javaScriptEnabled:false,viewport:{width:320,height:900}});try{const p=await context.newPage();await p.goto(path);await completeBody(p,lang);await expect(p.locator('.requirements-diagram')).toHaveCount(3);const summary=p.locator('#checks').locator('..').locator('summary').first();await summary.press('Enter');await expect(summary.locator('..')).toHaveAttribute('open','');expect(await p.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);}finally{await context.close();}
 expect(errors).toEqual([]);
});
