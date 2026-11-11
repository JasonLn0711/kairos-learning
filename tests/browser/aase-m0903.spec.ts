import {test,expect,type Page} from '@playwright/test';
import {readFileSync} from 'node:fs';
const lesson=JSON.parse(readFileSync('content/aase/lessons/aase-m09-c03.json','utf8'));
const normalize=(s:string)=>s.replace(/^### /gm,'').replace(/`/g,'').replace(/^> /gm,'').replace(/^(- |\d+\. )/gm,'').replace(/\s/g,'');
async function completeBody(page:Page,lang:'zh'|'en'){
 for(const s of lesson.text[lang].sections){
  const section=page.locator('h2#'+s.id).locator('..');const actual=normalize((await section.textContent())!);let cursor=0;
  const tokens=[s.heading,...s.paragraphs];
  for(const b of s.blocks??[]){
   if(b.kind==='prose')tokens.push(...b.paragraphs);
   else if(b.kind==='step')tokens.push(b.heading,...b.paragraphs,b.code);
   else if(b.kind==='table')tokens.push(b.caption,...b.headers,...b.rows.flat());
   else tokens.push(b.caption,...b.items.flatMap((i:any)=>[i.title,i.body]),b.description);
  }
  for(const value of tokens){const token=normalize(value);const found=actual.indexOf(token,cursor);expect(found,`${lang}/${s.id}: ${value.slice(0,50)}`).toBeGreaterThanOrEqual(cursor);cursor=found+token.length;}
 }
 for(const q of lesson.text[lang].openChecks){await expect(page.locator('#'+q.id).locator('..').locator('details p')).toHaveText(q.answer);}
}
for(const lang of ['zh','en']as const)test(`${lang}: complete text, figures, exports and reading access`,async({page,browser,baseURL,request})=>{
 const path=`${lang==='en'?'/en':''}/courses/aase/v1/m09/concepts/m09-03/`;await page.goto(path);await expect(page.locator('.article-metadata')).toContainText('v1.1.0');await completeBody(page,lang);
 await expect(page.locator('.acceptance-evidence')).toHaveCount(2);await expect(page.locator('.acceptance-evidence .arrow')).toHaveCount(4);
 for(const width of [320,390,768,1280])for(const scale of [1,2]){
  await page.setViewportSize({width,height:1000});await page.evaluate(s=>document.documentElement.style.fontSize=`${s*100}%`,scale);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  const sizes=await page.locator('.acceptance-evidence p').evaluateAll(es=>es.map(e=>{const s=getComputedStyle(e);return[parseFloat(s.fontSize),parseFloat(s.lineHeight)/parseFloat(s.fontSize)]}));for(const [font,line]of sizes){expect(font).toBeGreaterThanOrEqual(16*scale);expect(line).toBeGreaterThanOrEqual(1.7);}
  if(scale===1&&[390,1280].includes(width))for(const n of [1,2])await page.locator(`.acceptance-evidence[data-figure="${n}"]`).screenshot({path:`.local/aase/m0903/${lang}-${n}-${width}.png`});
 }
 await page.evaluate(()=>document.documentElement.style.removeProperty('font-size'));
 const link=page.locator('.acceptance-evidence a').first();await link.focus();await page.keyboard.press('Tab');await page.keyboard.press('Shift+Tab');await expect(link).toBeFocused();expect(await link.evaluate(e=>getComputedStyle(e).outlineStyle)).not.toBe('none');
 for(const region of await page.locator('article .table-scroll,article .code-region').all()){await region.focus();await expect(region).toBeFocused();if(await region.evaluate(e=>e.scrollWidth>e.clientWidth)){await region.press('ArrowRight');await expect.poll(()=>region.evaluate(e=>e.scrollLeft)).toBeGreaterThan(0);}}
 await link.focus();const opened=page.waitForEvent('popup');await page.keyboard.press('Enter');const popup=await opened;await popup.waitForLoadState();expect(new URL(popup.url()).pathname).toBe(`/images/aase/m09-03-1-${lang}.svg`);await popup.close();
 for(const n of [1,2]){
  const href=`/images/aase/m09-03-${n}-${lang}.svg`;const res=await request.get(href);expect(res.status()).toBe(200);expect(await res.body()).toEqual(readFileSync('site'+href));
  const p=await browser.newPage();await p.goto(baseURL+href);await p.evaluate(()=>document.fonts.ready);
  expect(await p.locator('text').evaluateAll(es=>es.flatMap(e=>{const b=(e as SVGGraphicsElement).getBBox(),v=(e as SVGGraphicsElement).ownerSVGElement!.viewBox.baseVal;return b.x<0||b.y<0||b.x+b.width>v.width||b.y+b.height>v.height?[e.textContent]:[]}))).toEqual([]);
  expect(await p.locator('text').evaluateAll(es=>{const bs=es.map(e=>(e as SVGGraphicsElement).getBBox());return bs.flatMap((a,i)=>bs.slice(i+1).filter(b=>a.x<b.x+b.width&&b.x<a.x+a.width&&a.y<b.y+b.height&&b.y<a.y+a.height));})).toEqual([]);
  await p.screenshot({path:`.local/aase/m0903/${lang}-${n}-svg.png`});await p.close();
 }
 const search=await(await request.get('/search-index.json')).json();const entry=search.find((x:any)=>x.id===lesson.id&&x.lang===lang);for(const s of lesson.text[lang].sections)for(const p of s.paragraphs)expect(entry.text).toContain(p);
 const context=await browser.newContext({baseURL,javaScriptEnabled:false,viewport:{width:320,height:900}});const p=await context.newPage();await p.goto(path);await completeBody(p,lang);const summary=p.locator('#AASE-M09-C03-Q04').locator('..').locator('summary');await summary.press('Enter');await expect(summary.locator('..')).toHaveAttribute('open','');await summary.press('Space');await expect(summary.locator('..')).not.toHaveAttribute('open');expect(await p.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);await context.close();
});
