import {test,expect,type Page} from '@playwright/test';
import {readFileSync} from 'node:fs';
const lesson=JSON.parse(readFileSync('content/aase/lessons/aase-m08-c02.json','utf8'));
const norm=(s:string)=>s.replace(/^(### |> |- |\d+\. )/gm,'').replace(/`/g,'').replace(/\s/g,'');
async function complete(page:Page,lang:'zh'|'en'){
 for(const s of lesson.text[lang].sections){
  const section=page.locator('h2#'+s.id).locator('..');await expect(section.locator('h2').first()).toHaveText(s.heading);
  const actual=norm((await section.textContent())!);let cursor=0;
  const tokens=[s.heading,...s.paragraphs];
  for(const b of s.blocks??[]){
   if(b.kind==='prose')tokens.push(...b.paragraphs);
   if(b.kind==='step')tokens.push(b.heading,...b.paragraphs,b.code??'');
   if(b.kind==='table'){tokens.push(b.caption,...b.headers,...b.rows.flat());const t=section.getByRole('table',{name:b.caption});await expect(t.locator('th')).toHaveText(b.headers);await expect(t.locator('td')).toHaveText(b.rows.flat());}
   if(b.kind==='cards'||b.kind==='flow')tokens.push(b.caption,b.description,...b.items.flatMap((i:any)=>[i.title,i.body]));
  }
  for(const value of tokens){const token=norm(value),found=actual.indexOf(token,cursor);expect(found,`${lang}/${s.id} order: ${value.slice(0,60)}`).toBeGreaterThanOrEqual(cursor);cursor=found+token.length;}
 }
 for(const q of lesson.checks){const t=q.text[lang],s=page.locator('#'+q.id).locator('..');await expect(s.locator('h3')).toHaveText(t.prompt);await expect(s.locator(':scope>ol>li')).toHaveText(t.options);await expect(s.locator('details ol li')).toHaveText(t.rationales);}
}
for(const lang of ['zh','en'] as const)test(`${lang}: full text, source diagrams, exports, reflow, keyboard and no JS`,async({page,browser,request,baseURL})=>{
 const path=`${lang==='en'?'/en':''}/courses/aase/v1/m08/concepts/m08-02/`,errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(path);await expect(page.locator('h1')).toContainText('M08-02');await expect(page.locator('.article-metadata')).toContainText('v1.1.0');await expect(page.locator('.article-metadata')).toContainText('2026-11-05');await expect(page.locator('.article-metadata')).toContainText('2026-11-11');await complete(page,lang);
 await expect(page.locator('[data-tdd-figure]')).toHaveCount(3);await expect(page.locator('[data-tdd-figure="1"] .return')).toHaveCount(1);await expect(page.locator('[data-tdd-figure="1"] .arrow')).toHaveCount(2);await expect(page.locator('[data-tdd-figure="2"] .arrow')).toHaveCount(0);await expect(page.locator('[data-tdd-figure="3"] .arrow')).toHaveCount(3);
 for(const width of [320,390,768,1280])for(const scale of [1,2]){
  await page.setViewportSize({width,height:900});await page.evaluate(s=>document.documentElement.style.setProperty('font-size',s*100+'%','important'),scale);expect(await page.evaluate(()=>document.documentElement.scrollWidth),`${width}/${scale}`).toBeLessThanOrEqual(width);
  const bad=await page.locator('article p,article li,[data-tdd-figure] a,article td,article th').evaluateAll(es=>es.filter(e=>{const s=getComputedStyle(e);return parseFloat(s.fontSize)<16||parseFloat(s.lineHeight)/parseFloat(s.fontSize)<1.7||e.scrollWidth>e.clientWidth+1;}).map(e=>e.textContent));expect(bad,`${width}/${scale}`).toEqual([]);
  const columns=await page.locator('.results ol').evaluate(e=>getComputedStyle(e).gridTemplateColumns.split(' ').length);if(width<=390)expect(columns).toBe(1);if(width===1280&&scale===1)expect(columns).toBe(3);
  if(scale===1&&(width===390||width===1280))for(const n of [1,2,3])await page.locator(`[data-tdd-figure="${n}"]`).screenshot({path:`.local/aase/m0802/${lang}-${n}-${width}.png`});
 }
 await page.evaluate(()=>document.documentElement.style.removeProperty('font-size'));await page.setViewportSize({width:320,height:900});
 const first=page.locator('[data-tdd-figure] a').first();await first.focus();await page.keyboard.press('Tab');await page.keyboard.press('Shift+Tab');await expect(first).toBeFocused();expect(await first.evaluate(e=>getComputedStyle(e).outlineStyle)).not.toBe('none');
 for(const q of lesson.checks){const answer=page.locator('#'+q.id).locator('..').locator('details');await expect(answer).not.toHaveAttribute('open','');await answer.locator('summary').focus();await page.keyboard.press('Enter');await expect(answer).toHaveAttribute('open','');await page.keyboard.press('Space');await expect(answer).not.toHaveAttribute('open','');}
 for(const region of await page.locator('article .table-scroll,article .code-region').all()){await region.focus();await expect(region).toBeFocused();if(await region.evaluate(e=>e.scrollWidth>e.clientWidth)){await region.press('ArrowRight');await expect.poll(()=>region.evaluate(e=>e.scrollLeft)).toBeGreaterThan(0);}}
 const search=await(await request.get('/search-index.json')).json(),entry=search.find((e:any)=>e.id===lesson.id&&e.lang===lang);expect(entry).toBeTruthy();for(const s of lesson.text[lang].sections){for(const p of s.paragraphs)expect(entry.text).toContain(p);for(const b of s.blocks??[]){if(b.kind==='prose')for(const p of b.paragraphs)expect(entry.text).toContain(p);if(b.kind==='cards'||b.kind==='flow')for(const i of b.items){expect(entry.text).toContain(i.title);expect(entry.text).toContain(i.body);}}}
 for(const n of [1,2,3]){
  const href=`/images/aase/m08-02-${n}-${lang}.svg`,link=page.locator('a[href="'+href+'"]');await expect(link).toHaveCount(1);await link.focus();const popupPromise=page.waitForEvent('popup');await page.keyboard.press('Enter');const popup=await popupPromise;await popup.waitForLoadState();await popup.evaluate(()=>document.fonts.ready);expect(new URL(popup.url()).pathname).toBe(href);
  const bad=await popup.locator('text').evaluateAll(es=>es.map(e=>{const t=e as SVGGraphicsElement,b=t.getBBox(),v=t.ownerSVGElement!.viewBox.baseVal;return {text:e.textContent,x:b.x,y:b.y,right:b.x+b.width,bottom:b.y+b.height,width:v.width,height:v.height};}).filter(b=>b.x<0||b.y<0||b.right>b.width||b.bottom>b.height));expect(bad).toEqual([]);
  const overlaps=await popup.locator('text').evaluateAll(es=>{const boxes=es.map(e=>({text:e.textContent,b:(e as SVGGraphicsElement).getBBox()}));return boxes.flatMap((a,i)=>boxes.slice(i+1).filter(c=>a.b.x<c.b.x+c.b.width&&c.b.x<a.b.x+a.b.width&&a.b.y<c.b.y+c.b.height&&c.b.y<a.b.y+a.b.height).map(c=>[a.text,c.text]));});expect(overlaps).toEqual([]);await popup.screenshot({path:`.local/aase/m0802/${lang}-${n}-svg.png`});await popup.close();const r=await request.get(href);expect(r.status()).toBe(200);const body=await r.body();expect(body.length).toBeLessThan(100000);expect(body).toEqual(readFileSync('site'+href));
 }
 const context=await browser.newContext({baseURL,javaScriptEnabled:false,viewport:{width:320,height:900}});try{const p=await context.newPage();await p.goto(path);await complete(p,lang);const summary=p.locator('#checks').locator('..').locator('summary').first();await summary.press('Enter');await expect(summary.locator('..')).toHaveAttribute('open','');expect(await p.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);}finally{await context.close();}expect(errors).toEqual([]);
});
