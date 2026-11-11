import {test,expect,type Page} from '@playwright/test';
import {readFileSync} from 'node:fs';
const lesson=JSON.parse(readFileSync('content/aase/lessons/aase-m07-c03.json','utf8'));
async function body(page:Page,lang:'zh'|'en'){
 for(const s of lesson.text[lang].sections){
  const section=page.locator('h2#'+s.id).locator('..');await expect(section.locator('h2').first()).toHaveText(s.heading);
  for(const p of s.paragraphs)await expect(section).toContainText(p);
  for(const b of s.blocks??[]){
   if(b.kind==='prose')for(const p of b.paragraphs)await expect(section).toContainText(p);
   if(b.kind==='step'){await expect(section).toContainText(b.heading);for(const p of b.paragraphs)await expect(section).toContainText(p);await expect(section.locator('code').filter({hasText:b.code})).toHaveText(b.code);}
   if(b.kind==='table'){const table=section.getByRole('table',{name:b.caption});await expect(table.locator('th')).toHaveText(b.headers);await expect(table.locator('td')).toHaveText(b.rows.flat());}
   if(b.kind==='cards'||b.kind==='flow'){await expect(section).toContainText(b.caption);await expect(section).toContainText(b.description);for(const i of b.items){await expect(section).toContainText(i.title);if(s.id!=='behavior')for(const line of i.body.split('\n'))await expect(section).toContainText(line);}}
  }
 }
 for(const q of lesson.text[lang].openChecks){const section=page.locator('#'+q.id).locator('..');await expect(section.locator('h3')).toHaveText(q.prompt);await expect(section.locator('details p')).toHaveText(q.answer);}
}
for(const lang of ['zh','en'] as const)test(`${lang}: complete teaching, form, responsive diagrams and exports`,async({page,browser,baseURL,request})=>{
 const path=`${lang==='en'?'/en':''}/courses/aase/v1/m07/concepts/m07-03/`;const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(path);await body(page,lang);await expect(page.locator('.article-metadata')).toContainText('v1.1.0');await expect(page.locator('h1')).toContainText('M07-03');await expect(page.locator('.next-links a')).toHaveCount(2);for(const neighbor of ['02','04'])await expect(page.locator(`.next-links a[href="${lang==='en'?'/en':''}/courses/aase/v1/m07/concepts/m07-${neighbor}/"]`)).toHaveCount(1);await expect(page.locator('a.language')).toHaveAttribute('href',`${lang==='zh'?'/en':''}/courses/aase/v1/m07/concepts/m07-03/`);
 const form=page.locator('.slice-form'),inputs=form.locator('input'),button=form.locator('button');await expect(inputs).toHaveCount(3);await expect(inputs.nth(0)).toHaveValue('SYN-001');await expect(inputs.nth(1)).toHaveValue('DEMO-A');await expect(inputs.nth(2)).toHaveValue('');await expect(button).toBeEnabled();
 await inputs.nth(0).focus();for(let i=1;i<3;i++){await page.keyboard.press('Tab');await expect(inputs.nth(i)).toBeFocused();}await page.keyboard.press('Tab');await expect(button).toBeFocused();expect(await button.evaluate(e=>getComputedStyle(e).outlineStyle)).not.toBe('none');await page.keyboard.press('Enter');await expect(form.locator('dd')).toHaveText(['SYN-001','DEMO-A',lang==='zh'?'（空白）':'(blank)']);
 for(let i=0;i<3;i++){await inputs.nth(i).fill('CHANGED-'+i);await expect(form.locator('dl')).toHaveCount(0);await button.click();await expect(form.locator('dd').nth(i)).toHaveText('CHANGED-'+i);}
 await inputs.nth(0).fill('<script>alert(1)</script>');await inputs.nth(1).fill('');await inputs.nth(2).fill(' ');await button.click();await expect(form.locator('dd').nth(0)).toHaveText('<script>alert(1)</script>');await expect(form.locator('dd').nth(1)).toHaveText(lang==='zh'?'（空白）':'(blank)');await expect(form.locator('dd').nth(2)).toHaveText(' ');expect(await form.locator('script').count()).toBe(0);
 await page.reload();await expect(button).toBeEnabled();
 for(const width of [320,390,768,1280])for(const scale of [1,2]){
  await page.setViewportSize({width,height:1000});await page.evaluate(s=>document.documentElement.style.setProperty('font-size',s*100+'%','important'),scale);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth),`${width}/${scale}`).toBeLessThanOrEqual(width);
  const bad=await page.locator('.slice-diagram p,.slice-diagram li,.slice-diagram h3,.slice-form p,.slice-form label,.slice-form button').evaluateAll(es=>es.filter(e=>{const s=getComputedStyle(e);return e.getClientRects().length&&(parseFloat(s.fontSize)<16||parseFloat(s.lineHeight)/parseFloat(s.fontSize)<1.7||e.scrollWidth>e.clientWidth+1)}).map(e=>e.textContent));expect(bad,`${width}/${scale}`).toEqual([]);
  if(scale===1&&(width===390||width===1280))for(const n of [1,2,3])await page.locator(`[data-figure="${n}"]`).screenshot({path:`.local/aase/m0703/${lang}-${width}-${n}.png`});
 }
 await page.evaluate(()=>document.documentElement.style.removeProperty('font-size'));
 for(const region of await page.locator('article .table-scroll,article .code-region').all()){await region.focus();await expect(region).toBeFocused();if(await region.evaluate(e=>e.scrollWidth>e.clientWidth)){await region.press('ArrowRight');await expect.poll(()=>region.evaluate(e=>e.scrollLeft)).toBeGreaterThan(0);}}
 for(const q of lesson.text[lang].openChecks){const details=page.locator('#'+q.id).locator('..').locator('details');await expect(details).not.toHaveAttribute('open','');await details.locator('summary').press('Enter');await expect(details).toHaveAttribute('open','');await details.locator('summary').press('Space');await expect(details).not.toHaveAttribute('open','');}
 const entries=await(await request.get('/search-index.json')).json();const entry=entries.find((e:any)=>e.id===lesson.id&&e.lang===lang);for(const s of lesson.text[lang].sections){for(const p of s.paragraphs)expect(entry.text).toContain(p);for(const b of s.blocks??[])if(b.kind==='cards'||b.kind==='flow')for(const i of b.items){expect(entry.text).toContain(i.title);expect(entry.text).toContain(i.body);}}
 for(const n of [1,2,3]){
  const href=`/images/aase/m07-03-${n}-${lang}.svg`;const link=page.locator(`a[href="${href}"]`);await expect(link).toHaveCount(1);await link.focus();const promise=page.waitForEvent('popup');await page.keyboard.press('Enter');const popup=await promise;await popup.waitForLoadState();await popup.evaluate(()=>document.fonts.ready);
  const bad=await popup.locator('text').evaluateAll(es=>{const boxes=es.map(e=>({text:e.textContent,b:(e as SVGGraphicsElement).getBBox(),v:(e as SVGGraphicsElement).ownerSVGElement!.viewBox.baseVal}));return boxes.flatMap((a,i)=>{const result:string[]=[];if(a.b.x<0||a.b.y<0||a.b.x+a.b.width>a.v.width||a.b.y+a.b.height>a.v.height)result.push('bounds: '+a.text);for(const c of boxes.slice(i+1))if(a.b.x<c.b.x+c.b.width&&c.b.x<a.b.x+a.b.width&&a.b.y<c.b.y+c.b.height&&c.b.y<a.b.y+a.b.height)result.push('overlap: '+a.text+' / '+c.text);return result;});});expect(bad).toEqual([]);await popup.screenshot({path:`.local/aase/m0703/${lang}-${n}-svg.png`});await popup.close();const r=await request.get(href);expect(r.status()).toBe(200);const bytes=await r.body();expect(bytes.length).toBeLessThan(100000);expect(bytes).toEqual(readFileSync('site'+href));
 }
 const ctx=await browser.newContext({baseURL,javaScriptEnabled:false,viewport:{width:320,height:1000}});try{const p=await ctx.newPage();await p.goto(path);await body(p,lang);await expect(p.locator('.slice-form button')).toBeDisabled();await expect(p.locator('.slice-form noscript')).toBeVisible();expect(await p.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);}finally{await ctx.close();}expect(errors).toEqual([]);
});
