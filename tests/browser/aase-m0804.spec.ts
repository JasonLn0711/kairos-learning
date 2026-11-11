import {test,expect,type Page} from '@playwright/test';
import {readFileSync} from 'node:fs';
const lesson=JSON.parse(readFileSync('content/aase/lessons/aase-m08-c04.json','utf8'));
const norm=(s:string)=>s.replace(/^(### |> |- |\d+\. )/gm,'').replace(/\s/g,'');
async function completeBody(page:Page,lang:'zh'|'en'){
 for(const s of lesson.text[lang].sections){
  const section=page.locator('h2#'+s.id).locator('..');await expect(section.locator('h2').first()).toHaveText(s.heading);
  const actual=norm((await section.textContent())!);const tokens=[s.heading,...s.paragraphs];
  for(const b of s.blocks??[]){
   if(b.kind==='prose')tokens.push(...b.paragraphs);
   else if(b.kind==='step'){tokens.push(b.heading,...b.paragraphs,b.code);await expect(section.getByRole('heading',{level:3,name:b.heading,exact:true}).locator('..').locator('code')).toHaveText(b.code);}
   else if(b.kind==='table'){tokens.push(b.caption,...b.headers,...b.rows.flat());const t=section.getByRole('table',{name:b.caption});await expect(t.locator('th')).toHaveText(b.headers);await expect(t.locator('td')).toHaveText(b.rows.flat());}
   else if(b.kind==='cards'||b.kind==='flow')tokens.push(b.caption,...b.items.flatMap((i:any)=>[i.title,i.body]),b.description);
  }
  let cursor=0;for(const value of tokens){const token=norm(value);const found=actual.indexOf(token,cursor);expect(found,`${lang}/${s.id}: ordered ${value.slice(0,50)}`).toBeGreaterThanOrEqual(cursor);cursor=found+token.length;}
 }
 for(const q of lesson.checks){const section=page.locator('#'+q.id).locator('..');await expect(section.locator('h3')).toHaveText(q.text[lang].prompt);await expect(section.locator(':scope > ol > li')).toHaveText(q.text[lang].options);await expect(section.locator('details ol li')).toHaveText(q.text[lang].rationales);}
}
for(const lang of ['zh','en'] as const)test(`${lang}: complete M08-04, three figures, responsive HTML, keyboard, no-JS, search and downloads`,async({page,browser,baseURL,request})=>{
 const path=`${lang==='en'?'/en':''}/courses/aase/v1/m08/concepts/m08-04/`;const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(path);await expect(page.locator('.article-metadata')).toContainText('v1.1.0');await expect(page.locator('.article-metadata')).toContainText('2026-11-05');await expect(page.locator('.article-metadata')).toContainText('2026-11-11');await completeBody(page,lang);await expect(page.locator('h2#interface').locator('..').locator(':scope > ol > li')).toHaveCount(4);await expect(page.locator('h2#analogy').locator('..').locator(':scope > ul > li')).toHaveCount(3);await expect(page.locator('h2#analogy').locator('..').locator(':scope > ol > li')).toHaveCount(5);await expect(page.locator('h1')).toContainText('M08-04');await expect(page.locator('#run')).toHaveCount(1);await expect(page.locator('.apptest-diagram')).toHaveCount(3);await expect(page.locator('.apptest-diagram .arrow')).toHaveCount(4);await expect(page.locator('.apptest-diagram.syntax .arrow')).toHaveCount(0);
 for(const slug of ['m08-03','m08-05'])await expect(page.locator(`a[href="${lang==='en'?'/en':''}/courses/aase/v1/m08/concepts/${slug}/"]`)).not.toHaveCount(0);
 const first=page.locator('.apptest-diagram a').first();await first.focus();await page.keyboard.press('Tab');await page.keyboard.press('Shift+Tab');await expect(first).toBeFocused();expect(await first.evaluate(e=>getComputedStyle(e).outlineStyle)).not.toBe('none');
 for(const q of lesson.checks){const answer=page.locator('#'+q.id).locator('..').locator('details');await expect(answer).not.toHaveAttribute('open','');await answer.locator('summary').focus();await page.keyboard.press('Enter');await expect(answer).toHaveAttribute('open','');expect(await answer.locator('summary').evaluate(e=>getComputedStyle(e).outlineStyle)).not.toBe('none');await expect(answer.locator('p').first()).toContainText(String.fromCharCode(65+q.answer));await page.keyboard.press('Space');await expect(answer).not.toHaveAttribute('open','');}
 for(const width of [320,390,768,1280])for(const scale of [1,2]){
  await page.setViewportSize({width,height:900});await page.evaluate(s=>document.documentElement.style.setProperty('font-size',s*100+'%','important'),scale);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth),`${width}/${scale}`).toBeLessThanOrEqual(width);
  const bad=await page.locator('article p,article li:not(:has(> svg.arrow)),article figcaption,section.apptest-lesson th,section.apptest-lesson td,section.apptest-lesson code').evaluateAll(es=>es.filter(e=>{const s=getComputedStyle(e);return e.getClientRects().length&&(parseFloat(s.fontSize)<16||parseFloat(s.lineHeight)/parseFloat(s.fontSize)<1.7||(e.scrollWidth>e.clientWidth+1&&!e.closest('.table-scroll,.code-region')))}).map(e=>e.textContent?.slice(0,90)));expect(bad,`${width}/${scale}`).toEqual([]);
  const columns=await page.locator('.apptest-diagram.pipeline ol').evaluate(e=>getComputedStyle(e).gridTemplateColumns.split(' ').length);if(width<=390||scale===2)expect(columns).toBe(1);if(width===1280&&scale===1)expect(columns).toBe(3);
  if(scale===1&&(width===390||width===1280))for(const n of [1,2,3])await page.locator(`.apptest-diagram[data-figure="${n}"]`).screenshot({path:`.local/aase/m0804/${lang}-${n}-${width}.png`});
 }
 await page.evaluate(()=>document.documentElement.style.removeProperty('font-size'));await page.setViewportSize({width:320,height:900});
 for(const region of await page.locator('article .table-scroll,article .code-region').all()){await region.focus();await expect(region).toBeFocused();if(await region.evaluate(e=>e.scrollWidth>e.clientWidth)){await region.press('ArrowRight');await expect.poll(()=>region.evaluate(e=>e.scrollLeft)).toBeGreaterThan(0);}}
 const search=await(await request.get('/search-index.json')).json();const entry=search.find((e:any)=>e.id===lesson.id&&e.lang===lang);for(const s of lesson.text[lang].sections){for(const p of s.paragraphs)expect(entry.text).toContain(p);for(const b of s.blocks??[])if(['cards','flow'].includes(b.kind))for(const item of b.items){expect(entry.text).toContain(item.title);expect(entry.text).toContain(item.body);}}
 for(const n of [1,2,3]){
  const href=`/images/aase/m08-04-${n}-${lang}.svg`;const link=page.locator(`a[href="${href}"]`);await expect(link).toHaveCount(1);await link.focus();const promise=page.waitForEvent('popup');await page.keyboard.press('Enter');const popup=await promise;await popup.waitForLoadState();await popup.evaluate(()=>document.fonts.ready);expect(new URL(popup.url()).pathname).toBe(href);
  const geometry=await popup.locator('text').evaluateAll(es=>{const boxes=es.map(e=>({text:e.textContent,b:(e as SVGGraphicsElement).getBBox()}));const v=(es[0] as SVGGraphicsElement).ownerSVGElement!.viewBox.baseVal;return {outside:boxes.filter(({b})=>b.x<0||b.y<0||b.x+b.width>v.width||b.y+b.height>v.height).map(x=>x.text),overlaps:boxes.flatMap((a,i)=>boxes.slice(i+1).filter(c=>a.b.x<c.b.x+c.b.width&&c.b.x<a.b.x+a.b.width&&a.b.y<c.b.y+c.b.height&&c.b.y<a.b.y+a.b.height).map(c=>[a.text,c.text]))};});expect(geometry).toEqual({outside:[],overlaps:[]});
  await popup.screenshot({path:`.local/aase/m0804/${lang}-${n}-svg.png`});await popup.close();const response=await request.get(href);expect(response.status()).toBe(200);const body=await response.body();expect(body.length).toBeLessThan(100000);expect(body).toEqual(readFileSync('site'+href));
 }
 const context=await browser.newContext({baseURL,javaScriptEnabled:false,viewport:{width:320,height:900}});try{const p=await context.newPage();await p.goto(path);await completeBody(p,lang);await expect(p.locator('.apptest-diagram')).toHaveCount(3);const summary=p.locator('#checks').locator('..').locator('summary').first();await summary.press('Enter');await expect(summary.locator('..')).toHaveAttribute('open','');expect(await p.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);}finally{await context.close();}
 for(const href of ['/downloads/aase/aase-v1-workshop.zip','/downloads/aase/SHA256SUMS.txt']){const r=await request.get(href);expect(r.status()).toBe(200);expect(await r.body()).toEqual(readFileSync('site'+href));}
 expect(errors).toEqual([]);
});
