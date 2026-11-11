import {test,expect,type Page} from '@playwright/test';
import {readFileSync} from 'node:fs';
const lesson=JSON.parse(readFileSync('content/aase/lessons/aase-m03-c05.json','utf8'));
const layouts=[1,2,3,4,5,6];
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
  for(const value of tokens){const token=(/^(- |\d+\. )/.test(value)?value.replace(/^(- |\d+\. )/gm,''):value).replace(/\s/g,'');const found=actual.indexOf(token,cursor);expect(found,`${lang}/${s.id}: ordered ${value.slice(0,45)}`).toBeGreaterThanOrEqual(cursor);cursor=found+token.length;}
  for(const b of s.blocks??[]){
   if(b.kind==='prose'){for(const p of b.paragraphs)for(const line of p.split('\n'))await expect(section).toContainText(line.replace(/^(- |\d+\. )/,''));}
   if(b.kind==='step'){await expect(section.locator('h3#'+b.id)).toHaveText(b.heading);for(const p of b.paragraphs)for(const line of p.split('\n'))await expect(section).toContainText(line.replace(/^(- |\d+\. )/,''));if(b.code)await expect(section.locator('h3#'+b.id).locator('..').locator('code')).toHaveText(b.code);}
   if(b.kind==='cards'||b.kind==='flow'){for(const i of b.items){if(s.id==='measure')continue;await expect(section).toContainText(i.title);for(const p of i.body.split("\n\n"))for(const line of p.split('\n'))await expect(section).toContainText(line.replace(/^(- |\d+\. )/,''));}await expect(section).toContainText(b.description);}
   if(b.kind==='table'){const table=section.getByRole('table',{name:b.caption});await expect(table.locator('th')).toHaveText(b.headers);await expect(table.locator('td')).toHaveText(b.rows.flat());}
  }
 }
 for(const q of lesson.text[lang].openChecks??[]){const section=page.locator('#'+q.id).locator('..');await expect(section.locator('h3')).toHaveText(q.prompt);await expect(section.locator('details p')).toHaveText(q.answer);}
}
for(const lang of ['zh','en'] as const)test(`${lang}: full source, six diagram relationships, exports, keyboard, reflow and no JavaScript`,async({page,browser,baseURL,request})=>{
 const path=`${lang==='en'?'/en':''}/courses/aase/v1/m03/concepts/m03-05/`;const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(path);await expect(page.locator('.article-metadata')).toContainText('v1.2.0');await completeBody(page,lang);await expect(page.locator('.success-diagram')).toHaveCount(6);const firstLink=page.locator('.success-diagram a').first();await firstLink.focus();await page.keyboard.press('Tab');await page.keyboard.press('Shift+Tab');await expect(firstLink).toBeFocused();expect(await firstLink.evaluate(e=>getComputedStyle(e).outlineStyle)).not.toBe('none');
 for(const q of lesson.text[lang].openChecks){const section=page.locator('#'+q.id).locator('..');const answer=section.locator('details');await expect(answer).not.toHaveAttribute('open','');await answer.locator('summary').focus();await page.keyboard.press('Enter');await expect(answer).toHaveAttribute('open','');await expect(answer).toContainText(q.answer[0]);expect(await answer.locator('summary').evaluate(e=>getComputedStyle(e).outlineStyle)).not.toBe('none');await page.keyboard.press('Space');await expect(answer).not.toHaveAttribute('open','');}
 const slider=page.locator('#blocking-count');await slider.focus();await page.keyboard.press('Home');
 for(let i=0;i<=4;i++){await expect(slider).toHaveValue(String(i));await expect(page.locator('.rate').first()).toHaveText(`${i*25}%`);if(i<4)await page.keyboard.press('ArrowRight');}
 await page.keyboard.press('End');await expect(slider).toHaveValue('4');await page.keyboard.press('Home');await expect(slider).toHaveValue('0');await page.keyboard.press('ArrowRight');await page.keyboard.press('ArrowRight');await page.keyboard.press('ArrowRight');
 const falseSlider=page.locator('#false-blocking-count');await falseSlider.focus();await page.keyboard.press('Home');
 for(let i=0;i<=2;i++){await expect(falseSlider).toHaveValue(String(i));await expect(page.locator('.rate').nth(1)).toHaveText(`${100-i*50}%`);if(i<2)await page.keyboard.press('ArrowRight');}
 const all=page.locator('[data-figure="3"] button');await all.focus();await page.keyboard.press('Enter');await expect(slider).toHaveValue('4');await expect(falseSlider).toHaveValue('2');await expect(page.locator('.rate')).toHaveText(['100%','0%']);expect(await all.evaluate(e=>getComputedStyle(e).outlineStyle)).not.toBe('none');
 await slider.focus();await page.keyboard.press('Home');await page.keyboard.press('ArrowRight');await page.keyboard.press('ArrowRight');await page.keyboard.press('ArrowRight');await falseSlider.focus();await page.keyboard.press('Home');
 for(const width of [320,390,768,1280])for(const scale of [1,2]){
  await page.setViewportSize({width,height:900});await page.evaluate(s=>document.documentElement.style.setProperty('font-size',s*100+'%','important'),scale);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth),`${width}/${scale}`).toBeLessThanOrEqual(width);
  const bad=await page.locator('article p,article li:not(:has(> svg.arrow)),article figcaption').evaluateAll(es=>es.filter(e=>{const s=getComputedStyle(e);return e.getClientRects().length&&(parseFloat(s.fontSize)<16||parseFloat(s.lineHeight)/parseFloat(s.fontSize)<1.7||e.scrollWidth>e.clientWidth+1)}).map(e=>e.textContent?.slice(0,100)));expect(bad,`${width}/${scale}`).toEqual([]);
  const columns=await page.locator('.comparison ul').evaluate(e=>getComputedStyle(e).gridTemplateColumns.split(' ').length);if(width<=390||scale===2)expect(columns).toBe(1);if(width===1280&&scale===1)expect(columns).toBe(3);
  await expect(page.locator('.success-diagram .arrow')).toHaveCount(5);
  if(scale===1&&(width===390||width===1280))for(const layout of layouts)await page.locator('[data-figure="'+layout+'"]').screenshot({path:`.local/aase/m0305/${lang}-${layout}-${width}.png`});
 }
 await page.evaluate(()=>document.documentElement.style.removeProperty('font-size'));await page.setViewportSize({width:320,height:900});
 for(const region of await page.locator('article .table-scroll,article .code-region').all()){await region.focus();await expect(region).toBeFocused();if(await region.evaluate(e=>e.scrollWidth>e.clientWidth)){await region.press('ArrowRight');await expect.poll(()=>region.evaluate(e=>e.scrollLeft)).toBeGreaterThan(0);}}
 const search=await(await request.get('/search-index.json')).json();const entry=search.find((e:any)=>e.id===lesson.id&&e.lang===lang);for(const s of lesson.text[lang].sections){for(const p of s.paragraphs)expect(entry.text).toContain(p);for(const b of s.blocks??[])if(b.kind==='cards'||b.kind==='flow')for(const item of b.items){expect(entry.text).toContain(item.title);expect(entry.text).toContain(item.body);}}
 for(const layout of layouts){const href=`/images/aase/m03-05-${layout}-${lang}.svg`;const link=page.locator('a[href="'+href+'"]');await expect(link).toHaveCount(1);await link.focus();const popupPromise=page.waitForEvent('popup');await page.keyboard.press('Enter');const popup=await popupPromise;await popup.waitForLoadState();await popup.evaluate(()=>document.fonts.ready);expect(new URL(popup.url()).pathname).toBe(href);
  const bounds=await popup.locator('text').evaluateAll(es=>es.map(e=>{const t=e as SVGGraphicsElement;const b=t.getBBox();const v=t.ownerSVGElement!.viewBox.baseVal;return {text:e.textContent,x:b.x,y:b.y,right:b.x+b.width,bottom:b.y+b.height,width:v.width,height:v.height};}).filter(b=>b.x<0||b.y<0||b.right>b.width||b.bottom>b.height));expect(bounds).toEqual([]);
  const overlaps=await popup.locator('text').evaluateAll(es=>{const boxes=es.map(e=>({text:e.textContent,b:(e as SVGGraphicsElement).getBBox()}));return boxes.flatMap((a,i)=>boxes.slice(i+1).filter(c=>a.b.x<c.b.x+c.b.width&&c.b.x<a.b.x+a.b.width&&a.b.y<c.b.y+c.b.height&&c.b.y<a.b.y+a.b.height).map(c=>[a.text,c.text]));});expect(overlaps).toEqual([]);await popup.screenshot({path:`.local/aase/m0305/${lang}-${layout}-svg.png`});await popup.close();const response=await request.get(href);expect(response.status()).toBe(200);const body=await response.body();expect(body.length).toBeLessThan(100000);expect(body).toEqual(readFileSync('site'+href));}
 const context=await browser.newContext({baseURL,javaScriptEnabled:false,viewport:{width:320,height:900}});try{const p=await context.newPage();await p.goto(path);await completeBody(p,lang);await expect(p.locator('.success-diagram')).toHaveCount(6);await expect(p.locator('input[type=range]')).toHaveCount(2);for(const input of await p.locator('input[type=range]').all())await expect(input).toBeDisabled();await expect(p.locator('[data-figure="3"] button')).toBeDisabled();await expect(p.locator('.rate')).toHaveText(['75%','100%']);const summary=p.locator('#checks').locator('..').locator('summary').first();await summary.press('Enter');await expect(summary.locator('..')).toHaveAttribute('open','');expect(await p.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);}finally{await context.close();}
 expect(errors).toEqual([]);
});
