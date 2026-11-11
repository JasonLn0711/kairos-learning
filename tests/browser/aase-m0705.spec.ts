import {test,expect,type Page} from '@playwright/test';
import {readFileSync} from 'node:fs';
const lesson=JSON.parse(readFileSync('content/aase/lessons/aase-m07-c05.json','utf8'));
const norm=(s:string)=>s.replace(/^(- |\d+\. )/gm,'').replace(/\s/g,'');
async function completeBody(page:Page,lang:'zh'|'en'){
 for(const s of lesson.text[lang].sections){
  const section=page.locator('h2#'+s.id).locator('..');await expect(section.locator('h2').first()).toHaveText(s.heading);
  const tokens=[s.heading,...s.paragraphs];
  for(const b of s.blocks??[]){
   if(b.kind==='prose')tokens.push(...b.paragraphs);
   else if(b.kind==='step')tokens.push(b.heading,...b.paragraphs,...(b.code?[b.code]:[]));
   else if(b.kind==='table'){tokens.push(b.caption,...b.headers,...b.rows.flat());await expect(section.getByRole('table',{name:b.caption}).locator('td')).toHaveText(b.rows.flat());}
   else if(b.kind==='cards'||b.kind==='flow'){tokens.push(b.caption,b.description);if(s.id==='workflow')tokens.push(...b.items.flatMap((i:any)=>[i.title,i.body]));}
  }
  const actual=norm((await section.textContent())!);let cursor=0;
  for(const value of tokens){const token=norm(value),found=actual.indexOf(token,cursor);expect(found,`${lang}/${s.id}: ${value.slice(0,60)}`).toBeGreaterThanOrEqual(cursor);cursor=found+token.length;}
 }
 for(const q of lesson.text[lang].openChecks){const section=page.locator('#'+q.id).locator('..');await expect(section.locator('h3')).toHaveText(q.prompt);await expect(section.locator('details p')).toHaveText(q.answer);}
}
for(const lang of ['zh','en'] as const)test(`${lang}: full text, state changes, download, reflow, keyboard, no-JS and SVG`,async({page,browser,baseURL,request})=>{
 const path=`${lang==='en'?'/en':''}/courses/aase/v1/m07/concepts/m07-05/`;
 await page.goto(path);await expect(page.locator('.article-metadata')).toContainText('v1.1.0');await completeBody(page,lang);
 const demo=page.locator('[data-preview-export="1"]'),input=demo.locator('input'),check=demo.getByRole('button',{name:lang==='zh'?'檢查資料':'Check data',exact:true}),reset=demo.getByRole('button',{name:lang==='zh'?'重設':'Reset',exact:true}),download=demo.locator('a[download]');
 await expect(input).toBeEnabled();await expect(download).toHaveCount(0);await check.click();await expect(download).toHaveCount(1);
 const first=page.waitForEvent('download');await download.click();const file=await first;expect(file.suggestedFilename()).toBe('synthetic-report.json');const original=JSON.parse(readFileSync((await file.path())!,'utf8'));expect(original.data).toEqual({application_id:'A001',applicant_code:'C123',document_type:'收入證明'});expect(original.scope).toBe('僅代表教學欄位完整性，不代表正式受理');expect(original.status).toBe('complete');
 await input.fill('戶籍謄本');await expect(download).toHaveCount(0);await expect(demo.locator('pre')).toHaveCount(0);await check.click();await expect(demo.locator('pre')).toContainText('戶籍謄本');
 const changed=page.waitForEvent('download');await download.click();const changedFile=await changed;expect(JSON.parse(readFileSync((await changedFile.path())!,'utf8')).data.document_type).toBe('戶籍謄本');
 await input.fill('');await expect(download).toHaveCount(0);await check.click();await expect(download).toHaveCount(0);await expect(demo.locator('[aria-live]')).toContainText(lang==='zh'?'缺漏':'missing');
 await input.fill('   ');await check.click();await expect(download).toHaveCount(0);
 await input.fill('收入證明');await expect(download).toHaveCount(0);await check.click();await expect(download).toHaveCount(1);await reset.click();await expect(input).toHaveValue('收入證明');await expect(download).toHaveCount(0);
 await input.focus();await page.keyboard.press('Tab');await expect(check).toBeFocused();await page.keyboard.press('Enter');await expect(download).toHaveCount(1);await page.keyboard.press('Tab');await expect(reset).toBeFocused();await page.keyboard.press('Shift+Tab');await expect(check).toBeFocused();expect(await check.evaluate(e=>getComputedStyle(e).outlineStyle)).not.toBe('none');await reset.click();
 for(const width of [320,390,768,1280])for(const scale of [1,2]){
  await page.setViewportSize({width,height:900});await page.evaluate(s=>document.documentElement.style.setProperty('font-size',s*100+'%','important'),scale);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth),`${width}/${scale}`).toBeLessThanOrEqual(width);
  expect(await page.locator('article p,article figcaption').evaluateAll(es=>es.filter(e=>{const s=getComputedStyle(e);return e.getClientRects().length&&(parseFloat(s.fontSize)<16||parseFloat(s.lineHeight)/parseFloat(s.fontSize)<1.7||e.scrollWidth>e.clientWidth+1)}).map(e=>e.textContent?.slice(0,100)))).toEqual([]);
  if(scale===1&&(width===390||width===1280))for(const n of [1,2])await page.locator(`[data-preview-export="${n}"]`).screenshot({path:`.local/aase/m0705/${lang}-${n}-${width}.png`});
 }
 await page.evaluate(()=>document.documentElement.style.removeProperty('font-size'));
 for(const summary of await page.locator('#checks').locator('..').locator('summary').all()){await summary.focus();await page.keyboard.press('Enter');await expect(summary.locator('..')).toHaveAttribute('open','');await page.keyboard.press('Space');await expect(summary.locator('..')).not.toHaveAttribute('open','');}
 for(const region of await page.locator('article .table-scroll,article .code-region').all()){await region.focus();await expect(region).toBeFocused();if(await region.evaluate(e=>e.scrollWidth>e.clientWidth)){await region.press('ArrowRight');await expect.poll(()=>region.evaluate(e=>e.scrollLeft)).toBeGreaterThan(0);}}
 const search=await(await request.get('/search-index.json')).json();const entry=search.find((e:any)=>e.id===lesson.id&&e.lang===lang);for(const s of lesson.text[lang].sections)for(const b of s.blocks??[])if(b.kind==='cards'||b.kind==='flow')for(const item of b.items){expect(entry.text).toContain(item.title);expect(entry.text).toContain(item.body);}
 for(const n of [1,2]){
  const href=`/images/aase/m07-05-${n}-${lang}.svg`;await page.locator(`a[href="${href}"]`).focus();const promise=page.waitForEvent('popup');await page.keyboard.press('Enter');const popup=await promise;await popup.waitForLoadState();await popup.evaluate(()=>document.fonts.ready);
  expect(await popup.locator('text').evaluateAll(es=>es.filter(e=>{const t=e as SVGGraphicsElement,b=t.getBBox(),v=t.ownerSVGElement!.viewBox.baseVal;return b.x<0||b.y<0||b.x+b.width>v.width||b.y+b.height>v.height}).map(e=>e.textContent))).toEqual([]);
  expect(await popup.locator('text').evaluateAll(es=>{const bs=es.map(e=>({text:e.textContent,b:(e as SVGGraphicsElement).getBBox()}));return bs.flatMap((a,i)=>bs.slice(i+1).filter(c=>a.b.x<c.b.x+c.b.width&&c.b.x<a.b.x+a.b.width&&a.b.y<c.b.y+c.b.height&&c.b.y<a.b.y+a.b.height).map(c=>[a.text,c.text]));})).toEqual([]);
  await popup.screenshot({path:`.local/aase/m0705/${lang}-${n}-svg.png`});await popup.close();const response=await request.get(href);expect(response.status()).toBe(200);const body=await response.body();expect(body.length).toBeLessThan(100000);expect(body).toEqual(readFileSync('site'+href));
 }
 const context=await browser.newContext({baseURL,javaScriptEnabled:false,viewport:{width:320,height:900}});try{const p=await context.newPage();await p.goto(path);await completeBody(p,lang);await expect(p.locator('[data-preview-export="1"] input')).toBeDisabled();await expect(p.locator('[data-preview-export="1"] a[download]')).toHaveCount(0);const summary=p.locator('#checks').locator('..').locator('summary').first();await summary.press('Enter');await expect(summary.locator('..')).toHaveAttribute('open','');expect(await p.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);}finally{await context.close();}
});
