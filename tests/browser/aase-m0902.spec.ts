import {test,expect,type Page} from '@playwright/test';
import {readFileSync} from 'node:fs';
const lesson=JSON.parse(readFileSync('content/aase/lessons/aase-m09-c02.json','utf8'));
const normalize=(s:string)=>s.replace(/`/g,'').replace(/^### |^> |^- |^\d+\. /gm,'').replace(/\s+/g,' ').trim();
async function body(page:Page,lang:'zh'|'en'){
 for(const s of lesson.text[lang].sections){
  const section=page.locator('h2#'+s.id).locator('..');await expect(section).toBeVisible();
  const actual=normalize(await section.innerText());
  const ordered=[...s.paragraphs,...(s.blocks??[]).flatMap((b:any)=>b.kind==='prose'?b.paragraphs:b.kind==='step'?[...b.paragraphs,b.code??'']:b.kind==='table'?[b.caption,...b.headers,...b.rows.flat()]:[b.caption,...b.items.flatMap((i:any)=>b.kind==='flow'?[i.title,i.body]:[i.title]),b.description])];
  let cursor=0;for(const value of ordered){const token=normalize(value);if(!token)continue;const at=actual.indexOf(token,cursor);expect(at,`${s.id}: ordered ${token.slice(0,60)}`).toBeGreaterThanOrEqual(cursor);cursor=at+token.length;}
  for(const p of s.paragraphs)expect(actual).toContain(normalize(p));
  for(const b of s.blocks??[]){
   if(b.kind==='table'){const table=section.getByRole('table',{name:b.caption,exact:true});await expect(table.locator('th')).toHaveText(b.headers);await expect(table.locator('td')).toHaveText(b.rows.flat());}
   if(b.kind==='prose'||b.kind==='step'){for(const p of b.paragraphs)expect(actual).toContain(normalize(p));if(b.code)await expect(section.locator('code')).toHaveText(b.code);}
   if(b.kind==='cards'||b.kind==='flow'){await expect(section).toContainText(b.caption);await expect(section).toContainText(b.description);for(const item of b.items)await expect(section).toContainText(item.title);}
  }
 }
 for(const q of lesson.text[lang].openChecks){const section=page.locator('#'+q.id).locator('..');await expect(section.locator('h3')).toHaveText(q.prompt);await expect(section.locator('details p')).toHaveText(q.answer);}
}
for(const lang of ['zh','en'] as const)test(`${lang}: full text, figures, self-check, keyboard, responsive, SVG, search and no JS`,async({page,browser,baseURL,request})=>{
 const path=`${lang==='en'?'/en':''}/courses/aase/v1/m09/concepts/m09-02/`;
 await page.goto(path);await expect(page.locator('.article-metadata')).toContainText('v1.1.0');await body(page,lang);await expect(page.locator('.route svg')).toHaveCount(3);await expect(page.locator('.checklist input')).toHaveCount(8);
 const inputs=page.locator('.checklist input');await expect(inputs.first()).toBeEnabled();await inputs.first().focus();await page.keyboard.press('Space');await expect(page.locator('.checklist output')).toHaveText('1 / 8');await page.keyboard.press('Tab');await expect(inputs.nth(1)).toBeFocused();await page.keyboard.press('Shift+Tab');await expect(inputs.first()).toBeFocused();expect(await inputs.first().evaluate(e=>getComputedStyle(e).outlineStyle)).not.toBe('none');
 for(const input of await inputs.all())await input.check();await expect(page.locator('.checklist output')).toHaveText('8 / 8');const reset=page.locator('.checklist button');await reset.focus();await page.keyboard.press('Enter');await expect(page.locator('.checklist output')).toHaveText('0 / 8');await expect(page.locator('.checklist input:checked')).toHaveCount(0);
 for(const width of [320,390,768,1280])for(const scale of [1,2]){
  await page.setViewportSize({width,height:900});await page.evaluate(s=>document.documentElement.style.setProperty('font-size',s*100+'%','important'),scale);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth),`${width}/${scale}`).toBeLessThanOrEqual(width);
  const bad=await page.locator('article p,article th,article td,article figcaption,.checklist label,.route h3').evaluateAll(es=>es.filter(e=>{const s=getComputedStyle(e);return e.getClientRects().length&&(parseFloat(s.fontSize)<16||parseFloat(s.lineHeight)/parseFloat(s.fontSize)<1.7||e.scrollWidth>e.clientWidth+1)}).map(e=>e.textContent?.slice(0,80)));expect(bad,`${width}/${scale}`).toEqual([]);
  if(scale===1&&(width===390||width===1280)){await page.locator('.route').locator('..').screenshot({path:`.local/aase/m0902/${lang}-flow-${width}.png`});await page.locator('.checklist').screenshot({path:`.local/aase/m0902/${lang}-checklist-${width}.png`});}
 }
 await page.evaluate(()=>document.documentElement.style.removeProperty('font-size'));
 for(const q of lesson.text[lang].openChecks){const details=page.locator('#'+q.id).locator('..').locator('details');await details.locator('summary').focus();await page.keyboard.press('Enter');await expect(details).toHaveAttribute('open','');await page.keyboard.press('Space');await expect(details).not.toHaveAttribute('open','');}
 await page.setViewportSize({width:320,height:900});for(const region of await page.locator('article .table-scroll,article .code-region').all()){await region.focus();await expect(region).toBeFocused();if(await region.evaluate(e=>e.scrollWidth>e.clientWidth)){await region.press('ArrowRight');await expect.poll(()=>region.evaluate(e=>e.scrollLeft)).toBeGreaterThan(0);}}
 for(let n=1;n<=2;n++){
  const href=`/images/aase/m09-02-${n}-${lang}.svg`;const response=await request.get(href);expect(response.status()).toBe(200);expect(await response.body()).toEqual(readFileSync('site'+href));expect((await response.body()).length).toBeLessThan(100000);
  const link=page.locator(`a[href="${href}"]`);const downloading=page.waitForEvent('download');await link.click();const download=await downloading;const dest=await download.path();expect(readFileSync(dest!)).toEqual(await response.body());
  const svg=await page.context().newPage();await svg.goto(href);await svg.evaluate(()=>document.fonts.ready);
  const problems=await svg.locator('text').evaluateAll(es=>{const boxes=es.map(e=>({text:e.textContent,b:(e as SVGGraphicsElement).getBBox(),v:(e as SVGGraphicsElement).ownerSVGElement!.viewBox.baseVal}));return boxes.flatMap((a,i)=>[...(a.b.x<0||a.b.y<0||a.b.x+a.b.width>a.v.width||a.b.y+a.b.height>a.v.height?[a.text]:[]),...boxes.slice(i+1).filter(c=>a.b.x<c.b.x+c.b.width&&c.b.x<a.b.x+a.b.width&&a.b.y<c.b.y+c.b.height&&c.b.y<a.b.y+a.b.height).map(c=>[a.text,c.text])]);});expect(problems).toEqual([]);await svg.screenshot({path:`.local/aase/m0902/${lang}-${n}-svg.png`});await svg.close();
 }
 const search=await(await request.get('/search-index.json')).json();const entry=search.find((e:any)=>e.id===lesson.id&&e.lang===lang);for(const s of lesson.text[lang].sections)for(const p of s.paragraphs)expect(entry.text).toContain(p);
 const context=await browser.newContext({baseURL,javaScriptEnabled:false,viewport:{width:320,height:900}});try{const p=await context.newPage();await p.goto(path);await body(p,lang);await expect(p.locator('.checklist input')).toHaveCount(8);await expect(p.locator('.checklist input').first()).toBeDisabled();await expect(p.locator('.checklist button')).toBeDisabled();await expect(p.locator('.checklist noscript')).toBeVisible();expect(await p.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);}finally{await context.close();}
});
