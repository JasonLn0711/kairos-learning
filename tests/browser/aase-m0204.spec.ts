import {test,expect,type Page} from '@playwright/test';
import {readFileSync} from 'node:fs';
const lesson=JSON.parse(readFileSync('content/aase/lessons/aase-m02-c04.json','utf8'));
async function completeBody(page:Page,lang:'zh'|'en'){
 for(const s of lesson.text[lang].sections){
  const section=page.locator('h2#'+s.id).locator('..');await expect(section.locator('h2').first()).toHaveText(s.heading);
  for(const p of s.paragraphs)await expect(section).toContainText(p);
  for(const b of s.blocks??[]){
   if(b.kind==='step'){await expect(section.locator('h3#'+b.id)).toHaveText(b.heading);for(const p of b.paragraphs)await expect(section).toContainText(p);if(b.code)await expect(section.locator('code')).toHaveText(b.code);}
   if(b.kind==='cards'||b.kind==='flow'){for(const i of b.items){await expect(section).toContainText(i.title);for(const line of i.body.split('\n'))await expect(section).toContainText(line);}await expect(section).toContainText(b.description);}
   if(b.kind==='table'){const table=section.getByRole('table',{name:b.caption});await expect(table.locator('th')).toHaveText(b.headers);await expect(table.locator('td')).toHaveText(b.rows.flat());}
  }
 }
 for(const q of lesson.checks){const section=page.locator('#'+q.id).locator('..');await expect(section.locator('h3')).toHaveText(q.text[lang].prompt);await expect(section.locator('ol').first().locator('li')).toHaveText(q.text[lang].options);await expect(section.locator('details ol li')).toHaveText(q.text[lang].rationales);}
 for(const q of (lesson.text[lang].openChecks??[])){const section=page.locator('#'+q.id).locator('..');await expect(section.locator('h3')).toHaveText(q.prompt);await expect(section.locator('details p')).toHaveText(q.answer);}
 const practice=page.locator('#practice').locator('..');for(const value of Object.values(lesson.text[lang].exercise).flat())await expect(practice).toContainText(String(value));
}
for(const lang of ['zh','en'] as const)test(`${lang}: complete article, branches, keyboard, responsive figures and downloads`,async({page,browser,baseURL,request})=>{
 const path=`${lang==='en'?'/en':''}/courses/aase/v1/m02/concepts/m02-04/`;const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(path);await expect(page.locator('.article-metadata')).toContainText('v1.1.0');await completeBody(page,lang);await expect(page.locator('.agent-control-diagram')).toHaveCount(4);
 await expect(page.locator('[data-figure="1"] .outcomes li')).toHaveCount(2);await expect(page.locator('[data-figure="2"] .return')).toContainText(lang==='zh'?'回到「觀察」':'Return to Observe');await expect(page.locator('[data-figure="3"] dt')).toHaveCount(6);await expect(page.locator('[data-figure="4"] .sequence li')).toHaveCount(4);
 for(const q of lesson.checks){const d=page.locator('#'+q.id).locator('..').locator('details');await expect(d).not.toHaveAttribute('open','');await d.locator('summary').focus();await page.keyboard.press('Enter');await expect(d).toHaveAttribute('open','');expect(await d.locator('summary').evaluate(e=>getComputedStyle(e).outlineStyle)).not.toBe('none');await page.keyboard.press('Space');await expect(d).not.toHaveAttribute('open','');}
 for(const width of [320,390,768,1280])for(const scale of [1,2]){
  await page.setViewportSize({width,height:900});await page.evaluate(s=>document.documentElement.style.setProperty('font-size',s*100+'%','important'),scale);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth),`${width}/${scale}`).toBeLessThanOrEqual(width);
  const bad=await page.locator('article p,article li,article dt,article dd,article figcaption').evaluateAll(es=>es.filter(e=>{const s=getComputedStyle(e);return e.getClientRects().length&&(parseFloat(s.fontSize)<16||parseFloat(s.lineHeight)/parseFloat(s.fontSize)<1.7||e.scrollWidth>e.clientWidth+1)}).map(e=>e.textContent?.slice(0,100)));expect(bad,`${width}/${scale}`).toEqual([]);
  if(width<=390)expect(await page.locator('[data-figure="1"] .outcomes').evaluate(e=>getComputedStyle(e).gridTemplateColumns.split(' ').length)).toBe(1);
  if(scale===1&&(width===390||width===1280))for(const n of [1,2,3,4])await page.locator(`[data-figure="${n}"]`).screenshot({path:`.local/aase/m0204/${lang}-${n}-${width}.png`});
 }
 await page.evaluate(()=>document.documentElement.style.removeProperty('font-size'));await page.setViewportSize({width:320,height:900});
 for(const region of await page.locator('article .table-scroll,article .code-region').all()){await region.focus();await expect(region).toBeFocused();if(await region.evaluate(e=>e.scrollWidth>e.clientWidth)){await region.press('ArrowRight');await expect.poll(()=>region.evaluate(e=>e.scrollLeft)).toBeGreaterThan(0);}}
 const search=await(await request.get('/search-index.json')).json();const entry=search.find((e:any)=>e.id===lesson.id&&e.lang===lang);for(const s of lesson.text[lang].sections){for(const p of s.paragraphs)expect(entry.text).toContain(p);for(const b of s.blocks??[])if(b.items)for(const i of b.items){expect(entry.text).toContain(i.title);expect(entry.text).toContain(i.body);}}
 for(const n of [1,2,3,4]){const href=`/images/aase/m02-04-${n}-${lang}.svg`;const link=page.locator(`a[href="${href}"]`);await link.focus();await page.keyboard.press('Tab');await page.keyboard.press('Shift+Tab');await expect(link).toBeFocused();const pending=page.waitForEvent('popup');await page.keyboard.press('Enter');const popup=await pending;await popup.waitForLoadState();await popup.evaluate(()=>document.fonts.ready);
 const bad=await popup.locator('text').evaluateAll(es=>es.filter(e=>{const t=e as SVGGraphicsElement,b=t.getBBox(),v=t.ownerSVGElement!.viewBox.baseVal;return b.x<0||b.y<0||b.x+b.width>v.width||b.y+b.height>v.height;}).map(e=>e.textContent));expect(bad).toEqual([]);
 const overlaps=await popup.locator('text').evaluateAll(es=>{const boxes=es.map(e=>({text:e.textContent,b:(e as SVGGraphicsElement).getBBox()}));return boxes.flatMap((a,i)=>boxes.slice(i+1).filter(c=>a.b.x<c.b.x+c.b.width&&c.b.x<a.b.x+a.b.width&&a.b.y<c.b.y+c.b.height&&c.b.y<a.b.y+a.b.height).map(c=>[a.text,c.text]));});expect(overlaps).toEqual([]);await popup.screenshot({path:`.local/aase/m0204/${lang}-${n}-svg.png`});await popup.close();const r=await request.get(href);expect(r.status()).toBe(200);const b=await r.body();expect(b).toEqual(readFileSync('site'+href));expect(b.length).toBeLessThan(100000);}
 const context=await browser.newContext({baseURL,javaScriptEnabled:false,viewport:{width:320,height:900}});try{const p=await context.newPage();await p.goto(path);await completeBody(p,lang);await expect(p.locator('.agent-control-diagram')).toHaveCount(4);const d=p.locator('#checks').locator('..').locator('details').first();await d.locator('summary').press('Enter');await expect(d).toHaveAttribute('open','');expect(await p.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);}finally{await context.close();}expect(errors).toEqual([]);
});
