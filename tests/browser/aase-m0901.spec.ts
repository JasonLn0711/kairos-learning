import {test,expect,type Page} from '@playwright/test';
import {readFileSync} from 'node:fs';
const lesson=JSON.parse(readFileSync('content/aase/lessons/aase-m09-c01.json','utf8'));
const plain=(s:string)=>s.replace(/`/g,'').replace(/^### /,'').replace(/^(?:- |\d+\. |> )/,'');
async function body(page:Page,lang:'zh'|'en'){
 for(const s of lesson.text[lang].sections){
  const section=page.locator('h2#'+s.id).locator('..');await expect(section).toBeVisible();
  for(const p of s.paragraphs)for(const line of p.split('\n').filter(Boolean))await expect(section).toContainText(plain(line));
  for(const b of s.blocks??[]){
   if(b.kind==='table'){const table=section.getByRole('table',{name:b.caption,exact:true});await expect(table.locator('th')).toHaveText(b.headers.map(plain));await expect(table.locator('td')).toHaveText(b.rows.flat().map(plain));}
   if(b.kind==='prose'||b.kind==='step'){for(const p of b.paragraphs)for(const line of p.split('\n').filter(Boolean))await expect(section).toContainText(plain(line));if(b.code)await expect(section.locator('pre code').filter({hasText:b.code})).toHaveText(b.code);}
   if(b.kind==='cards'||b.kind==='flow'){await expect(section).toContainText(b.caption);await expect(section).toContainText(b.description);for(const item of b.items){await expect(section).toContainText(item.title);for(const line of item.body.split('\n'))await expect(section).toContainText(line);}}
  }
 }
 for(const q of lesson.checks){const section=page.locator('#'+q.id).locator('..');await expect(section.locator('h3')).toHaveText(q.text[lang].prompt);await expect(section.locator(':scope > ol li')).toHaveText(q.text[lang].options);await expect(section.locator('details li')).toHaveText(q.text[lang].rationales);}
}
for(const lang of ['zh','en'] as const)test(`${lang}: complete body, reference diagrams, reflow, keyboard, SVG and no JS`,async({page,browser,baseURL,request})=>{
 const path=`${lang==='en'?'/en':''}/courses/aase/v1/m09/concepts/m09-01/`;
 await page.goto(path);await expect(page.locator('.article-metadata')).toContainText('v1.1.1');await body(page,lang);await expect(page.locator('article pre .__cf_email__,article pre a[href*="email-protection"]')).toHaveCount(0);if(!process.env.AASE_BASE_URL){const html=await(await request.get(path)).text();expect(html).toContain('<!--email_off-->');expect(html).toContain('<!--/email_off-->');}await expect(page.locator('.git-figure')).toHaveCount(2);await expect(page.locator('.transition')).toHaveCount(3);
 for(const width of [320,390,768,1280])for(const scale of [1,2]){
  await page.setViewportSize({width,height:900});await page.evaluate(s=>document.documentElement.style.setProperty('font-size',s*100+'%','important'),scale);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  const bad=await page.locator('article p,article figcaption,.git-figure li,.transition').evaluateAll(es=>es.filter(e=>{const s=getComputedStyle(e);return e.getClientRects().length&&(parseFloat(s.fontSize)<16||parseFloat(s.lineHeight)/parseFloat(s.fontSize)<1.7||e.scrollWidth>e.clientWidth+1)}).map(e=>e.textContent?.slice(0,80)));expect(bad,`${width}/${scale}`).toEqual([]);
  if(scale===1&&(width===390||width===1280))for(let n=0;n<2;n++)await page.locator('.git-figure').nth(n).screenshot({path:`.local/aase/m0901/${lang}-${n+1}-${width}.png`});
 }
 await page.evaluate(()=>document.documentElement.style.removeProperty('font-size'));
 for(const q of lesson.checks){const details=page.locator('#'+q.id).locator('..').locator('details');await details.locator('summary').focus();await page.keyboard.press('Tab');await page.keyboard.press('Shift+Tab');await expect(details.locator('summary')).toBeFocused();expect(await details.locator('summary').evaluate(e=>getComputedStyle(e).outlineStyle)).not.toBe('none');await page.keyboard.press('Enter');await expect(details).toHaveAttribute('open','');await page.keyboard.press('Space');await expect(details).not.toHaveAttribute('open','');}
 await page.setViewportSize({width:320,height:900});for(const region of await page.locator('article .table-scroll,article .code-region').all()){await region.focus();await expect(region).toBeFocused();if(await region.evaluate(e=>e.scrollWidth>e.clientWidth)){await region.press('ArrowRight');await expect.poll(()=>region.evaluate(e=>e.scrollLeft)).toBeGreaterThan(0);}}
 for(let n=1;n<=2;n++){
  const href=`/images/aase/m09-01-${n}-${lang}.svg`;const response=await request.get(href);expect(response.status()).toBe(200);expect(await response.body()).toEqual(readFileSync('site'+href));expect((await response.body()).length).toBeLessThan(100000);
  const download=page.waitForEvent('download');await page.locator(`a[href="${href}"]`).click();expect((await download).suggestedFilename()).toBe(href.split('/').pop());
  const p=await browser.newPage();await p.goto(new URL(href,baseURL).toString());await p.evaluate(()=>document.fonts.ready);
  const problems=await p.locator('text').evaluateAll(es=>{const boxes=es.map(e=>({text:e.textContent,b:(e as SVGGraphicsElement).getBBox(),v:(e as SVGGraphicsElement).ownerSVGElement!.viewBox.baseVal}));return boxes.flatMap((a,i)=>[...(a.b.x<0||a.b.y<0||a.b.x+a.b.width>a.v.width||a.b.y+a.b.height>a.v.height?[a.text]:[]),...boxes.slice(i+1).filter(c=>a.b.x<c.b.x+c.b.width&&c.b.x<a.b.x+a.b.width&&a.b.y<c.b.y+c.b.height&&c.b.y<a.b.y+a.b.height).map(c=>[a.text,c.text])]);});expect(problems).toEqual([]);await p.screenshot({path:`.local/aase/m0901/${lang}-${n}-svg.png`});await p.close();
 }
 const search=await(await request.get('/search-index.json')).json();const entry=search.find((e:any)=>e.id===lesson.id&&e.lang===lang);for(const s of lesson.text[lang].sections)for(const p of s.paragraphs)expect(entry.text).toContain(p);
 const context=await browser.newContext({baseURL,javaScriptEnabled:false,viewport:{width:320,height:900}});try{const p=await context.newPage();await p.goto(path);await body(p,lang);await expect(p.locator('.git-figure')).toHaveCount(2);expect(await p.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);}finally{await context.close();}
});
