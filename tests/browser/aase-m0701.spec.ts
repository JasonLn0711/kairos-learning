import {test,expect,type Page} from '@playwright/test';
import {readFileSync} from 'node:fs';
const lesson=JSON.parse(readFileSync('content/aase/lessons/aase-m07-c01.json','utf8'));
async function body(page:Page,lang:'zh'|'en'){
 for(const s of lesson.text[lang].sections){
  const section=page.locator('h2#'+s.id).locator('..');await expect(section).toBeVisible();
  for(const p of s.paragraphs)for(const line of p.split('\n'))await expect(section).toContainText(line.replace(/^(- |\d+\. )/,''));
  for(const b of s.blocks??[]){
   if(b.kind==='table'){const table=section.getByRole('table',{name:b.caption,exact:true});await expect(table.locator('th')).toHaveText(b.headers);await expect(table.locator('td')).toHaveText(b.rows.flat());}
   if(b.kind==='prose'||b.kind==='step'){if(b.heading)await expect(section.getByRole('heading',{name:b.heading,exact:true})).toHaveCount(1);for(const p of b.paragraphs)for(const line of p.split('\n'))await expect(section).toContainText(line.replace(/^(- |\d+\. )/,''));if(b.code)expect(await section.locator('code').allTextContents()).toContain(b.code);}
   if(b.kind==='cards'||b.kind==='flow'){await expect(section).toContainText(b.caption);await expect(section).toContainText(b.description);for(const item of b.items){await expect(section).toContainText(item.title);for(const line of item.body.split('\n'))if(line.trim())await expect(section).toContainText(line);}}
  }
 }
 for(const q of lesson.text[lang].openChecks){const section=page.locator('#'+q.id).locator('..');await expect(section.locator('h3')).toHaveText(q.prompt);await expect(section.locator('details p')).toHaveText(q.answer);}
}
for(const lang of ['zh','en'] as const)test(`${lang}: full body, four figures, keyboard, reflow, exports and no JS`,async({page,browser,baseURL,request})=>{
 const path=`${lang==='en'?'/en':''}/courses/aase/v1/m07/concepts/m07-01/`;
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(path);
 await expect(page.locator('.article-metadata')).toContainText('v1.1.0');await body(page,lang);await expect(page.locator('.environment-diagram')).toHaveCount(4);
 for(const width of [320,390,768,1280])for(const scale of [1,2]){
  await page.setViewportSize({width,height:900});await page.evaluate(s=>document.documentElement.style.setProperty('font-size',s*100+'%','important'),scale);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  const bad=await page.locator('article p,.environment-diagram figcaption,.environment-diagram li,.environment-diagram dt,.environment-diagram dd').evaluateAll(es=>es.filter(e=>{const s=getComputedStyle(e);return e.getClientRects().length&&(parseFloat(s.fontSize)<16||parseFloat(s.lineHeight)/parseFloat(s.fontSize)<1.7||(e.scrollWidth>e.clientWidth+1&&!e.querySelector('.code-region')))}).map(e=>e.textContent?.slice(0,80)));expect(bad,`${width}/${scale}`).toEqual([]);
  const columns=await page.locator('.platforms').evaluate(e=>getComputedStyle(e).gridTemplateColumns.split(' ').length);if(width<=390||scale===2)expect(columns).toBe(1);
  if(scale===1&&(width===390||width===1280))for(let n=1;n<=4;n++)await page.locator(`[data-figure="${n}"]`).screenshot({path:`.local/aase/m0701/${lang}-${n}-${width}.png`});
 }
 await page.evaluate(()=>document.documentElement.style.removeProperty('font-size'));
 for(const q of lesson.text[lang].openChecks){const details=page.locator('#'+q.id).locator('..').locator('details');await details.locator('summary').focus();await page.keyboard.press('Tab');await page.keyboard.press('Shift+Tab');await expect(details.locator('summary')).toBeFocused();expect(await details.locator('summary').evaluate(e=>getComputedStyle(e).outlineStyle)).not.toBe('none');await page.keyboard.press('Enter');await expect(details).toHaveAttribute('open','');await page.keyboard.press('Space');await expect(details).not.toHaveAttribute('open','');}
 await page.setViewportSize({width:320,height:900});for(const region of await page.locator('article .table-scroll,article .code-region').all()){await region.focus();await expect(region).toBeFocused();if(await region.evaluate(e=>e.scrollWidth>e.clientWidth)){await region.press('ArrowRight');await expect.poll(()=>region.evaluate(e=>e.scrollLeft)).toBeGreaterThan(0);}}
 for(let n=1;n<=4;n++){
  const href=`/images/aase/m07-01-${n}-${lang}.svg`;const response=await request.get(href);expect(response.status()).toBe(200);expect(await response.body()).toEqual(readFileSync('site'+href));expect((await response.body()).length).toBeLessThan(100000);
  const link=page.locator(`a[href="${href}"]`);await link.focus();const opened=page.waitForEvent('popup');await page.keyboard.press('Enter');const popup=await opened;await popup.waitForLoadState();await popup.evaluate(()=>document.fonts.ready);
  const problems=await popup.locator('text').evaluateAll(es=>{const boxes=es.map(e=>({text:e.textContent,b:(e as SVGGraphicsElement).getBBox(),v:(e as SVGGraphicsElement).ownerSVGElement!.viewBox.baseVal}));return boxes.flatMap((a,i)=>{const outside=a.b.x<0||a.b.y<0||a.b.x+a.b.width>a.v.width||a.b.y+a.b.height>a.v.height;return [...(outside?[a.text]:[]),...boxes.slice(i+1).filter(c=>a.b.x<c.b.x+c.b.width&&c.b.x<a.b.x+a.b.width&&a.b.y<c.b.y+c.b.height&&c.b.y<a.b.y+a.b.height).map(c=>[a.text,c.text])];});});expect(problems).toEqual([]);await popup.screenshot({path:`.local/aase/m0701/${lang}-${n}-svg.png`});await popup.close();
 }
 const search=await(await request.get('/search-index.json')).json();const entry=search.find((e:any)=>e.id===lesson.id&&e.lang===lang);for(const s of lesson.text[lang].sections)for(const p of s.paragraphs)expect(entry.text).toContain(p);
 await expect(page.locator('.next-links')).toContainText('M07-02');expect(errors).toEqual([]);
 const context=await browser.newContext({baseURL,javaScriptEnabled:false,viewport:{width:320,height:900}});try{const p=await context.newPage();await p.goto(path);await body(p,lang);await expect(p.locator('.environment-diagram')).toHaveCount(4);expect(await p.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);const summary=p.locator('#AASE-M07-C01-Q04').locator('..').locator('summary');await summary.click();await expect(summary.locator('..')).toHaveAttribute('open','');}finally{await context.close();}
});

test('local starter actually renders its declared unimplemented features',async({page})=>{
 test.skip(Boolean(process.env.AASE_BASE_URL),'Static production hosting does not execute Python.');
 await page.goto('http://127.0.0.1:8531');
 await expect(page.getByRole('heading',{name:'合成收件資料檢核｜起始骨架'})).toBeVisible();
 await expect(page.getByText('目前尚未實作完整性檢核或報告匯出。只使用合成資料。')).toBeVisible();
 await expect(page.getByRole('button',{name:/下載|export/i})).toHaveCount(0);
});
