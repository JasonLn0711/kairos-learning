import {test,expect,type Page} from '@playwright/test';
import {readFileSync} from 'node:fs';
const lesson=JSON.parse(readFileSync('content/aase/lessons/aase-m05-c02.json','utf8'));
async function body(page:Page,lang:'zh'|'en'){
 for(const s of lesson.text[lang].sections){
  const section=page.locator('h2#'+s.id).locator('..');await expect(section).toBeVisible();
  for(const p of s.paragraphs)for(const line of p.split('\n'))await expect(section).toContainText(line.replace(/^(- |\d+\. |### |> )/,''));
  for(const b of s.blocks??[]){
   if(b.kind==='table'){const table=section.getByRole('table',{name:b.caption,exact:true});await expect(table.locator('th')).toHaveText(b.headers);await expect(table.locator('td')).toHaveText(b.rows.flat());}
   if(b.kind==='prose'||b.kind==='step'){if(b.heading)await expect(section.getByRole('heading',{name:b.heading,exact:true})).toHaveCount(1);for(const p of b.paragraphs)for(const line of p.split('\n'))await expect(section).toContainText(line.replace(/^(- |\d+\. |### |> )/,''));if(b.code)await expect(section.locator('code').filter({hasText:b.code})).toHaveText(b.code);}
   if(b.kind==='cards'||b.kind==='flow'){await expect(section).toContainText(b.caption);await expect(section).toContainText(b.description);for(const item of b.items){await expect(section).toContainText(item.title);for(const line of item.body.split('\n'))await expect(section).toContainText(line);}}
  }
 }
 for(const q of lesson.checks){const section=page.locator('#'+q.id).locator('..');await expect(section.locator('h3')).toHaveText(q.text[lang].prompt);await expect(section.locator('ol').first().locator('li')).toHaveText(q.text[lang].options);await expect(section.locator('details ol li')).toHaveText(q.text[lang].rationales);}
}
for(const lang of ['zh','en'] as const)test(`${lang}: full body, five figures, keyboard, reflow, exports and no JS`,async({page,browser,baseURL,request})=>{
 const path=`${lang==='en'?'/en':''}/courses/aase/v1/m05/concepts/m05-02/`;
 await page.goto(path);await expect(page.locator('.article-metadata')).toContainText('v1.1.0');await body(page,lang);await expect(page.locator('.specification-diagram')).toHaveCount(5);
 for(const width of [320,390,768,1280])for(const scale of [1,2]){
  await page.setViewportSize({width,height:900});await page.evaluate(s=>document.documentElement.style.setProperty('font-size',s*100+'%','important'),scale);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  const bad=await page.locator('article p,article figcaption,.specification-diagram li,.specification-diagram .node').evaluateAll(es=>es.filter(e=>{const s=getComputedStyle(e);return e.getClientRects().length&&(parseFloat(s.fontSize)<16||parseFloat(s.lineHeight)/parseFloat(s.fontSize)<1.7||e.scrollWidth>e.clientWidth+1)}).map(e=>e.textContent?.slice(0,80)));expect(bad,`${width}/${scale}`).toEqual([]);
  const columns=await page.locator('.specification-diagram[data-figure=\"1\"] .parallel').evaluate(e=>getComputedStyle(e).gridTemplateColumns.split(' ').length);if(width<=390||scale===2)expect(columns).toBe(1);if(width===1280&&scale===1)expect(columns).toBe(2);
  if(scale===1&&(width===390||width===1280))for(let n=1;n<=5;n++)await page.locator(`[data-figure="${n}"]`).screenshot({path:`.local/aase/m0502/${process.env.AASE_BASE_URL?'production':'local'}-${lang}-${n}-${width}.png`});
 }
 await page.evaluate(()=>document.documentElement.style.removeProperty('font-size'));
 for(const q of lesson.checks){const details=page.locator('#'+q.id).locator('..').locator('details');await details.locator('summary').focus();await page.keyboard.press('Enter');await expect(details).toHaveAttribute('open','');await page.keyboard.press('Space');await expect(details).not.toHaveAttribute('open','');}
 await page.setViewportSize({width:320,height:900});for(const region of await page.locator('article .table-scroll,article .code-region').all()){await region.focus();await expect(region).toBeFocused();if(await region.evaluate(e=>e.scrollWidth>e.clientWidth)){await region.press('ArrowRight');await expect.poll(()=>region.evaluate(e=>e.scrollLeft)).toBeGreaterThan(0);}}
 for(let n=1;n<=5;n++){
  const href=`/images/aase/m05-02-${n}-${lang}.svg`;const response=await request.get(href);expect(response.status()).toBe(200);expect(await response.body()).toEqual(readFileSync('site'+href));expect((await response.body()).length).toBeLessThan(100000);
  const link=page.locator(`a[href="${href}"]`);await link.focus();await page.keyboard.press('Tab');await page.keyboard.press('Shift+Tab');await expect(link).toBeFocused();expect(await link.evaluate(e=>getComputedStyle(e).outlineStyle)).not.toBe('none');const opened=page.waitForEvent('popup');await page.keyboard.press('Enter');const popup=await opened;await popup.waitForLoadState();await popup.evaluate(()=>document.fonts.ready);
  const problems=await popup.locator('text').evaluateAll(es=>{const boxes=es.map(e=>({text:e.textContent,b:(e as SVGGraphicsElement).getBBox(),v:(e as SVGGraphicsElement).ownerSVGElement!.viewBox.baseVal}));return boxes.flatMap((a,i)=>{const outside=a.b.x<0||a.b.y<0||a.b.x+a.b.width>a.v.width||a.b.y+a.b.height>a.v.height;return [...(outside?[a.text]:[]),...boxes.slice(i+1).filter(c=>a.b.x<c.b.x+c.b.width&&c.b.x<a.b.x+a.b.width&&a.b.y<c.b.y+c.b.height&&c.b.y<a.b.y+a.b.height).map(c=>[a.text,c.text])];});});expect(problems).toEqual([]);await popup.screenshot({path:`.local/aase/m0502/${process.env.AASE_BASE_URL?'production':'local'}-${lang}-${n}-svg.png`});await popup.close();
 }
 const search=await(await request.get('/search-index.json')).json();const entry=search.find((e:any)=>e.id===lesson.id&&e.lang===lang);for(const s of lesson.text[lang].sections)for(const p of s.paragraphs)expect(entry.text).toContain(p);
 const context=await browser.newContext({baseURL,javaScriptEnabled:false,viewport:{width:320,height:900}});try{const p=await context.newPage();await p.goto(path);await body(p,lang);await expect(p.locator('.specification-diagram')).toHaveCount(5);expect(await p.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);}finally{await context.close();}
});
