import {test,expect,type Page} from '@playwright/test';
import {readFileSync} from 'node:fs';
const plain=(value:string)=>value.replace(/^> /gm,'');
const lesson=JSON.parse(readFileSync('content/aase/lessons/aase-m05-c03.json','utf8'));
async function completeBody(page:Page,lang:'zh'|'en'){
 for(const s of lesson.text[lang].sections){
  const section=page.locator('h2#'+s.id).locator('..');await expect(section.locator('h2').first()).toHaveText(s.heading);
  for(const p of s.paragraphs)for(const line of p.split('\n'))await expect(section).toContainText(line.replace(/^(- |\d+\. )/,''));
  const actual=(await section.textContent())!.replace(/\s/g,'');let cursor=0;
  const tokens=[s.heading,...s.paragraphs];
  for(const b of s.blocks??[]){
   if(b.kind==='prose')tokens.push(...b.paragraphs);
   else if(b.kind==='step')tokens.push(b.heading,...b.paragraphs,...(b.code?[b.code]:[]));
   else if(b.kind==='table')tokens.push(b.caption,...b.headers,...b.rows.flat());
   else if(b.kind==='cards'||b.kind==='flow'){
    tokens.push(b.caption);
    if(s.id!=='measure')tokens.push(...b.items.flatMap((i:any)=>[i.title,...i.body.split('\n\n')]));
    tokens.push(b.description);
   }
  }
  for(const value of tokens){const token=plain(/^(- |\d+\. )/.test(value)?value.replace(/^(- |\d+\. )/gm,''):value).replace(/\s/g,'');const found=actual.indexOf(token,cursor);expect(found,`${lang}/${s.id}: ordered ${value.slice(0,45)}`).toBeGreaterThanOrEqual(cursor);cursor=found+token.length;}
  for(const b of s.blocks??[]){
   if(b.kind==='prose'){for(const p of b.paragraphs)for(const line of p.split('\n'))await expect(section).toContainText(plain(line.replace(/^(- |\d+\. )/,'')));}
   if(b.kind==='step'){await expect(section.getByRole('heading',{level:3,name:b.heading,exact:true})).toHaveText(b.heading);for(const p of b.paragraphs)for(const line of p.split('\n'))await expect(section).toContainText(plain(line.replace(/^(- |\d+\. )/,'')));if(b.code)await expect(section.getByRole('heading',{level:3,name:b.heading,exact:true}).locator('..').locator('code')).toHaveText(b.code);}
   if(b.kind==='cards'||b.kind==='flow'){for(const i of b.items){if(s.id==='measure')continue;await expect(section).toContainText(i.title);for(const p of i.body.split("\n\n"))for(const line of p.split('\n'))await expect(section).toContainText(plain(line.replace(/^(- |\d+\. )/,'')));}await expect(section).toContainText(b.description);}
   if(b.kind==='table'){const table=section.getByRole('table',{name:b.caption});await expect(table.locator('th')).toHaveText(b.headers);await expect(table.locator('td')).toHaveText(b.rows.flat());}
  }
 }
 for(const q of lesson.text[lang].openChecks??[]){const section=page.locator('#'+q.id).locator('..');await expect(section.locator('h3')).toHaveText(q.prompt);await expect(section.locator('details p')).toHaveText(q.answer);}
}
for(const lang of ['zh','en'] as const)test(`${lang}: full article, three relationships, reflow, keyboard, no JS and exports`,async({page,browser,baseURL,request})=>{
 const path=`${lang==='en'?'/en':''}/courses/aase/v1/m05/concepts/m05-03/`;
 await page.goto(path);await expect(page.locator('.article-metadata')).toContainText('v1.1.0');await completeBody(page,lang);
 await expect(page.locator('[data-acceptance-figure]')).toHaveCount(3);
 await expect(page.locator('[data-acceptance-figure="1"] .arrow')).toHaveCount(2);
 await expect(page.locator('[data-acceptance-figure="2"] .arrow')).toHaveCount(0);
 await expect(page.locator('[data-acceptance-figure="3"] .arrow')).toHaveCount(4);
 for(const width of [320,390,768,1280])for(const scale of [1,2]){
  await page.setViewportSize({width,height:900});await page.evaluate(s=>document.documentElement.style.setProperty('font-size',s*100+'%','important'),scale);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth),`${width}/${scale}`).toBeLessThanOrEqual(width);
  const bad=await page.locator('article p,article figcaption').evaluateAll(es=>es.filter(e=>{const s=getComputedStyle(e);return e.getClientRects().length&&(parseFloat(s.fontSize)<16||parseFloat(s.lineHeight)/parseFloat(s.fontSize)<1.7||e.scrollWidth>e.clientWidth+1)}).map(e=>e.textContent?.slice(0,100)));expect(bad,`${width}/${scale}`).toEqual([]);
  if(scale===1&&(width===390||width===1280))for(const n of [1,2,3])await page.locator(`[data-acceptance-figure="${n}"]`).screenshot({path:`.local/aase/m0503/${lang}-${n}-${width}.png`});
 }
 await page.evaluate(()=>document.documentElement.style.removeProperty('font-size'));await page.setViewportSize({width:320,height:900});
 const link=page.locator('[data-acceptance-figure] a').first();await link.focus();await page.keyboard.press('Tab');await page.keyboard.press('Shift+Tab');await expect(link).toBeFocused();expect(await link.evaluate(e=>getComputedStyle(e).outlineStyle)).not.toBe('none');
 for(const summary of await page.locator('#checks').locator('..').locator('summary').all()){await summary.focus();await page.keyboard.press('Enter');await expect(summary.locator('..')).toHaveAttribute('open','');await page.keyboard.press('Space');await expect(summary.locator('..')).not.toHaveAttribute('open','');}
 for(const region of await page.locator('article .table-scroll,article .code-region').all()){await region.focus();await expect(region).toBeFocused();if(await region.evaluate(e=>e.scrollWidth>e.clientWidth)){await region.press('ArrowRight');await expect.poll(()=>region.evaluate(e=>e.scrollLeft)).toBeGreaterThan(0);}}
 const search=await(await request.get('/search-index.json')).json();const entry=search.find((e:any)=>e.id===lesson.id&&e.lang===lang);
 for(const s of lesson.text[lang].sections)for(const b of s.blocks??[])if(b.kind==='cards'||b.kind==='flow')for(const item of b.items){expect(entry.text).toContain(item.title);expect(entry.text).toContain(item.body);}
 for(const n of [1,2,3]){
  const href=`/images/aase/m05-03-${n}-${lang}.svg`;await page.locator(`a[href="${href}"]`).focus();const popupPromise=page.waitForEvent('popup');await page.keyboard.press('Enter');const popup=await popupPromise;await popup.waitForLoadState();await popup.evaluate(()=>document.fonts.ready);expect(new URL(popup.url()).pathname).toBe(href);
  const bounds=await popup.locator('text').evaluateAll(es=>es.filter(e=>{const t=e as SVGGraphicsElement,b=t.getBBox(),v=t.ownerSVGElement!.viewBox.baseVal;return b.x<0||b.y<0||b.x+b.width>v.width||b.y+b.height>v.height}).map(e=>e.textContent));expect(bounds).toEqual([]);
  const overlaps=await popup.locator('text').evaluateAll(es=>{const boxes=es.map(e=>({text:e.textContent,b:(e as SVGGraphicsElement).getBBox()}));return boxes.flatMap((a,i)=>boxes.slice(i+1).filter(c=>a.b.x<c.b.x+c.b.width&&c.b.x<a.b.x+a.b.width&&a.b.y<c.b.y+c.b.height&&c.b.y<a.b.y+a.b.height).map(c=>[a.text,c.text]));});expect(overlaps).toEqual([]);
  await popup.screenshot({path:`.local/aase/m0503/${lang}-${n}-svg.png`});await popup.close();const response=await request.get(href);expect(response.status()).toBe(200);const body=await response.body();expect(body.length).toBeLessThan(100000);expect(body).toEqual(readFileSync('site'+href));
 }
 const context=await browser.newContext({baseURL,javaScriptEnabled:false,viewport:{width:320,height:900}});try{const p=await context.newPage();await p.goto(path);await completeBody(p,lang);await expect(p.locator('[data-acceptance-figure]')).toHaveCount(3);const summary=p.locator('#checks').locator('..').locator('summary').first();await summary.press('Enter');await expect(summary.locator('..')).toHaveAttribute('open','');expect(await p.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);}finally{await context.close();}
});
