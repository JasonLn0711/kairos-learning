import {test,expect,type Page} from '@playwright/test';
import {readFileSync} from 'node:fs';
const lesson=JSON.parse(readFileSync('content/aase/lessons/aase-m05-c05.json','utf8'));
const norm=(s:string)=>s.replace(/`/g,'').replace(/^(- |\d+\. )/gm,'').replace(/\s/g,'');
async function complete(page:Page,lang:'zh'|'en'){
 await expect(page.locator('body')).toContainText('v1.1.1');await expect(page.locator('time[datetime="2026-11-11"]').first()).toBeVisible();
 for(const s of lesson.text[lang].sections){
  const section=page.locator('h2#'+s.id).locator('..');await expect(section.locator('h2').first()).toHaveText(s.heading);const actual=norm((await section.textContent())!);let cursor=0;
  const tokens=[s.heading,...s.paragraphs];
  for(const b of s.blocks??[]){if(b.kind==='prose')tokens.push(...b.paragraphs);else if(b.kind==='step')tokens.push(b.heading,...b.paragraphs,...(b.code?[b.code]:[]));else if(b.kind==='table')tokens.push(b.caption,...b.headers,...b.rows.flat());else tokens.push(b.caption,...b.items.flatMap((i:any)=>[i.title,i.body]),b.description);}
  for(const value of tokens){const token=norm(value),at=actual.indexOf(token,cursor);expect(at,`${lang}/${s.id}: ${value.slice(0,65)}`).toBeGreaterThanOrEqual(cursor);cursor=at+token.length;}
 }
 await expect(page.locator('.openspec-diagram')).toHaveCount(2);await expect(page.locator('.openspec-diagram .arrow')).toHaveCount(6);await expect(page.locator('#checks').locator('..').locator('details')).toHaveCount(4);
}
for(const lang of ['zh','en'] as const)test(`${lang}: full body, reflow, keyboard, no JS and exact SVG exports`,async({page,request,browser,baseURL})=>{
 const path=`${lang==='en'?'/en':''}/courses/aase/v1/m05/concepts/m05-05/`;const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(path);await complete(page,lang);
 for(const width of [320,390,768,1280])for(const scale of [1,2]){
  await page.setViewportSize({width,height:1000});await page.evaluate(s=>document.documentElement.style.fontSize=16*s+'px',scale);expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  const body=await page.locator('article p').first().evaluate(e=>{const s=getComputedStyle(e);return {font:parseFloat(s.fontSize),line:parseFloat(s.lineHeight)/parseFloat(s.fontSize)};});expect(body.font).toBeGreaterThanOrEqual(16);expect(body.line).toBeGreaterThanOrEqual(1.7);
  for(const number of [1,2]){const fig=page.locator(`.openspec-diagram[data-figure="${number}"]`);await expect(fig).toBeVisible();expect(await fig.locator('li').evaluateAll(es=>es.filter(e=>e.scrollWidth>e.clientWidth+1).map(e=>e.textContent))).toEqual([]);const cols=await fig.locator('ol').evaluate(e=>getComputedStyle(e).gridTemplateColumns.split(' ').length);if(width<=390||scale===2)expect(cols).toBe(1);if(number===1&&width===1280&&scale===1)expect(cols).toBe(3);}
  if(scale===1&&(width===390||width===1280))for(const number of [1,2])await page.locator(`.openspec-diagram[data-figure="${number}"]`).screenshot({path:`.local/aase/m0505/${lang}-${number}-${width}.png`});
 }
 await page.evaluate(()=>document.documentElement.style.removeProperty('font-size'));await page.setViewportSize({width:320,height:900});
 for(const region of await page.locator('article .table-scroll,article .code-region').all()){await region.focus();await expect(region).toBeFocused();if(await region.evaluate(e=>e.scrollWidth>e.clientWidth)){await region.press('ArrowRight');await expect.poll(()=>region.evaluate(e=>e.scrollLeft)).toBeGreaterThan(0);}}
 const summary=page.locator('#checks').locator('..').locator('summary').first();await summary.focus();await page.keyboard.press('Enter');await expect(summary.locator('..')).toHaveAttribute('open','');await page.keyboard.press('Space');await expect(summary.locator('..')).not.toHaveAttribute('open','');await page.keyboard.press('Shift+Tab');
 const entries=await(await request.get('/search-index.json')).json();const entry=entries.find((e:any)=>e.id===lesson.id&&e.lang===lang);expect(entry).toBeTruthy();for(const s of lesson.text[lang].sections){for(const p of s.paragraphs)expect(entry.text).toContain(p);for(const b of s.blocks??[]){const values=b.kind==='prose'?b.paragraphs:b.kind==='step'?[b.heading,...b.paragraphs,...(b.code?[b.code]:[])]:b.kind==='table'?[b.caption,...b.headers,...b.rows.flat()]:[b.caption,b.description,...b.items.flatMap((i:any)=>[i.title,i.body])];for(const value of values)expect(entry.text).toContain(value);}}
 for(const number of [1,2]){
  const href=`/images/aase/m05-05-${number}-${lang}.svg`,link=page.locator(`a[href="${href}"]`);await link.focus();await page.keyboard.press('Shift+Tab');await page.keyboard.press('Tab');await expect(link).toBeFocused();expect(await link.evaluate(e=>parseFloat(getComputedStyle(e).outlineWidth))).toBeGreaterThanOrEqual(2);const popupPromise=page.waitForEvent('popup');await page.keyboard.press('Enter');const popup=await popupPromise;await popup.waitForLoadState();await popup.evaluate(()=>document.fonts.ready);
  const issues=await popup.locator('text').evaluateAll(es=>{const boxes=es.map(e=>({text:e.textContent,b:(e as SVGGraphicsElement).getBBox(),v:(e as SVGGraphicsElement).ownerSVGElement!.viewBox.baseVal}));return {bounds:boxes.filter(({b,v})=>b.x<0||b.y<0||b.x+b.width>v.width||b.y+b.height>v.height).map(x=>x.text),overlaps:boxes.flatMap((a,i)=>boxes.slice(i+1).filter(c=>a.b.x<c.b.x+c.b.width&&c.b.x<a.b.x+a.b.width&&a.b.y<c.b.y+c.b.height&&c.b.y<a.b.y+a.b.height).map(c=>[a.text,c.text]))};});expect(issues).toEqual({bounds:[],overlaps:[]});
  const f=lesson.text[lang].sections.flatMap((s:any)=>s.blocks??[]).filter((b:any)=>b.kind==='flow')[number-1],svgText=norm((await popup.locator('text').allTextContents()).join(''));let cursor=0;for(const token of [f.caption,...f.items.flatMap((i:any)=>[i.title,i.body]),f.description]){const at=svgText.indexOf(norm(token),cursor);expect(at).toBeGreaterThanOrEqual(cursor);cursor=at+norm(token).length;}
  await popup.screenshot({path:`.local/aase/m0505/${lang}-${number}-svg.png`});await popup.close();const response=await request.get(href);expect(response.status()).toBe(200);const bytes=await response.body();expect(bytes.length).toBeLessThan(100000);expect(bytes).toEqual(readFileSync('site'+href));
 }
 const context=await browser.newContext({baseURL,javaScriptEnabled:false,viewport:{width:320,height:900}});try{const p=await context.newPage();await p.goto(path);await complete(p,lang);const s=p.locator('#checks').locator('..').locator('summary').first();await s.press('Enter');await expect(s.locator('..')).toHaveAttribute('open','');expect(await p.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);}finally{await context.close();}
 expect(errors).toEqual([]);
});
