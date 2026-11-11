import {test,expect,type Page} from '@playwright/test';
import {readFileSync} from 'node:fs';
const lesson=JSON.parse(readFileSync('content/aase/lessons/aase-m03-c03.json','utf8'));
async function completeBody(page:Page,lang:'zh'|'en'){
 for(const s of lesson.text[lang].sections){
  const section=page.locator('h2#'+s.id).locator('..');await expect(section.locator('h2').first()).toHaveText(s.heading);
  for(const p of s.paragraphs)for(const line of p.split('\n'))await expect(section).toContainText(line.replace(/^(?:- |\d+\. )/,''));
  for(const b of s.blocks??[]){
   if(b.kind==='prose'){for(const p of b.paragraphs)for(const line of p.split('\n'))await expect(section).toContainText(line.replace(/^(?:- |\d+\. )/,''));}
   if(b.kind==='step'&&!b.id?.startsWith('workflow-')){await expect(section.locator('h3#'+b.id)).toHaveText(b.heading);for(const p of b.paragraphs)for(const line of p.split('\n'))await expect(section).toContainText(line.replace(/^(?:- |\d+\. )/,''));if(b.code)await expect(section.locator('h3#'+b.id).locator('..').locator('code')).toHaveText(b.code);}
   if(b.kind==='cards'||b.kind==='flow'){for(const i of b.items){await expect(section).toContainText(i.title);for(const p of i.body.split("\n\n"))await expect(section).toContainText(p.replace(/^[-] /gm,''));}await expect(section).toContainText(b.description);}
   if(b.kind==='table'){const table=section.getByRole('table',{name:b.caption});await expect(table.locator('th')).toHaveText(b.headers);await expect(table.locator('td')).toHaveText(b.rows.flat());}
  }
 }
 for(const q of lesson.text[lang].openChecks??[]){const section=page.locator('#'+q.id).locator('..');await expect(section.locator('h3')).toHaveText(q.prompt);await expect(section.locator('details p')).toHaveText(q.answer);}
 for(const q of lesson.checks){const section=page.locator('#'+q.id).locator('..');await expect(section.locator('h3')).toHaveText(q.text[lang].prompt);await expect(section.locator('ol').first().locator('li')).toHaveText(q.text[lang].options);await expect(section.locator('details ol li')).toHaveText(q.text[lang].rationales);}
}
for(const lang of ['zh','en'] as const)test(`${lang}: complete workflow lesson, recovery controls, reflow, exports and no-JS`,async({page,browser,baseURL,request})=>{
 const path=`${lang==='en'?'/en':''}/courses/aase/v1/m03/concepts/m03-03/`;const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(path);await expect(page.locator('.article-metadata')).toContainText('v1.1.0');await completeBody(page,lang);
 await expect(page.locator('.workflow-diagram')).toHaveCount(5);await expect(page.locator('.workflow-exercise')).toHaveCount(2);
 const stale=page.locator('figure[aria-labelledby="stale-title"]');const output=stale.getByRole('button').nth(1);await expect(output).toBeEnabled();await stale.locator('input[value="300"]').check();await expect(output).toBeDisabled();await expect(stale).toContainText(lang==='zh'?'已失效':'Invalid');await expect(stale).toContainText(lang==='zh'?'上次檢查資料：100':'Last checked input：100');await stale.locator('input[value="100"]').check();await expect(output).toBeDisabled();await stale.locator('input[value="300"]').check();await stale.getByRole('button').first().focus();await page.keyboard.press('Enter');await expect(output).toBeEnabled();await output.click();await expect(stale.getByRole('status')).toContainText('300');await stale.locator('input[value="100"]').check();await expect(stale.getByRole('status')).toHaveCount(0);await expect(output).toBeDisabled();
 const walk=page.locator('figure[aria-labelledby="walkthrough-title"]');const controls=walk.getByRole('button');await expect(controls.nth(0)).toBeDisabled();
 for(let i=0;i<4;i++){await expect(walk).toContainText(`${i+1} / 4`);await controls.nth(1).focus();await page.keyboard.press('Space');await expect(controls.nth(1)).toHaveAttribute('aria-expanded','true');await expect(walk.locator('#walkthrough-answer p')).not.toBeEmpty();expect(await controls.nth(1).evaluate(e=>getComputedStyle(e).outlineStyle)).not.toBe('none');if(i<3){await controls.nth(2).click();await expect(controls.nth(1)).toHaveAttribute('aria-expanded','false');}}
 await expect(controls.nth(2)).toBeDisabled();await controls.nth(0).click();await expect(walk).toContainText('3 / 4');
 // Native radio operation must invalidate the result, including a keyboard edit.
 await stale.getByRole('button').first().click();await stale.locator('input[value="100"]').focus();await page.keyboard.press('ArrowDown');await expect(stale.locator('input[value="300"]')).toBeChecked();await expect(output).toBeDisabled();
 for(const width of [320,390,768,1280])for(const scale of [1,2]){
  await page.setViewportSize({width,height:900});await page.evaluate(s=>document.documentElement.style.setProperty('font-size',s*100+'%','important'),scale);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth),`${width}/${scale}`).toBeLessThanOrEqual(width);
  const bad=await page.locator('.workflow-diagram p,.workflow-diagram li,.workflow-exercise p,.workflow-exercise label,article > section > p').evaluateAll(es=>es.filter(e=>{const s=getComputedStyle(e);return e.getClientRects().length&&(parseFloat(s.fontSize)<16||parseFloat(s.lineHeight)/parseFloat(s.fontSize)<1.7||e.scrollWidth>e.clientWidth+1)}).map(e=>e.textContent?.slice(0,100)));expect(bad,`${width}/${scale}`).toEqual([]);
  if(scale===1&&(width===390||width===1280))for(const n of [1,2,3,5,6])await page.locator(`[data-workflow-figure="${n}"]`).screenshot({path:`.local/aase/m0303/${lang}-${n}-${width}.png`});
 }
 await page.evaluate(()=>document.documentElement.style.removeProperty('font-size'));await page.setViewportSize({width:320,height:900});
 for(const [n,exercise] of [[4,stale],[7,walk]] as const)await exercise.screenshot({path:`.local/aase/m0303/${lang}-${n}-390.png`});
 const edgeLinks=page.locator('[data-workflow-figure="2"] .routes a');expect(await edgeLinks.count()).toBe(14);for(const link of await edgeLinks.all()){const href=await link.getAttribute('href');await expect(page.locator(href!)).toHaveCount(1);}
 await edgeLinks.first().focus();await page.keyboard.press('Tab');await page.keyboard.press('Shift+Tab');await expect(edgeLinks.first()).toBeFocused();expect(await edgeLinks.first().evaluate(e=>getComputedStyle(e).outlineStyle)).not.toBe('none');
 for(const region of await page.locator('article .table-scroll,article .code-region').all()){await region.focus();await expect(region).toBeFocused();if(await region.evaluate(e=>e.scrollWidth>e.clientWidth)){await region.press('ArrowRight');await expect.poll(()=>region.evaluate(e=>e.scrollLeft)).toBeGreaterThan(0);}}
 for(const q of lesson.text[lang].openChecks){const summary=page.locator('#'+q.id).locator('..').locator('summary');await summary.focus();await page.keyboard.press('Enter');await expect(summary.locator('..')).toHaveAttribute('open','');await page.keyboard.press('Space');await expect(summary.locator('..')).not.toHaveAttribute('open','');}
 const search=await(await request.get('/search-index.json')).json();const entry=search.find((e:any)=>e.id===lesson.id&&e.lang===lang);for(const s of lesson.text[lang].sections){for(const p of s.paragraphs)expect(entry.text).toContain(p);for(const b of s.blocks??[])if(b.kind==='cards'||b.kind==='flow')for(const item of b.items){expect(entry.text).toContain(item.title);expect(entry.text).toContain(item.body);}}
 for(const n of [1,2,3,5,6]){
  const href=`/images/aase/m03-03-${n}-${lang}.svg`;const link=page.locator('a[href="'+href+'"]');await link.focus();const pp=page.waitForEvent('popup');await page.keyboard.press('Enter');const popup=await pp;await popup.waitForLoadState();await popup.evaluate(()=>document.fonts.ready);
  const bad=await popup.locator('text').evaluateAll(es=>{const boxes=es.map(e=>({text:e.textContent,b:(e as SVGGraphicsElement).getBBox(),v:(e as SVGGraphicsElement).ownerSVGElement!.viewBox.baseVal}));return boxes.filter(a=>a.b.x<0||a.b.y<0||a.b.x+a.b.width>a.v.width||a.b.y+a.b.height>a.v.height).map(a=>a.text);});expect(bad).toEqual([]);
  const overlaps=await popup.locator('text').evaluateAll(es=>{const boxes=es.map(e=>({text:e.textContent,b:(e as SVGGraphicsElement).getBBox()}));return boxes.flatMap((a,i)=>boxes.slice(i+1).filter(c=>a.b.x<c.b.x+c.b.width&&c.b.x<a.b.x+a.b.width&&a.b.y<c.b.y+c.b.height&&c.b.y<a.b.y+a.b.height).map(c=>[a.text,c.text]));});expect(overlaps).toEqual([]);
  await popup.screenshot({path:`.local/aase/m0303/${lang}-${n}-svg.png`});await popup.close();const r=await request.get(href);expect(r.status()).toBe(200);const body=await r.body();expect(body.length).toBeLessThan(100000);expect(body).toEqual(readFileSync('site'+href));
 }
 const context=await browser.newContext({baseURL,javaScriptEnabled:false,viewport:{width:320,height:900}});try{const p=await context.newPage();await p.goto(path);await completeBody(p,lang);await expect(p.locator('.workflow-diagram')).toHaveCount(5);await expect(p.locator('.workflow-exercise')).toHaveCount(2);for(const button of await p.locator('.workflow-exercise button').all())await expect(button).toBeDisabled();const summary=p.locator('figure[aria-labelledby="walkthrough-title"] summary');await summary.press('Enter');await expect(summary.locator('..')).toHaveAttribute('open','');await expect(summary.locator('..').locator('h3')).toHaveCount(4);expect(await p.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);}finally{await context.close();}
 expect(errors).toEqual([]);
});
