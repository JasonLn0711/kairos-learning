import {test,expect,type Page} from '@playwright/test';
import {readFileSync,mkdirSync} from 'node:fs';
const lesson=JSON.parse(readFileSync('content/aase/lessons/aase-m05-c01.json','utf8'));
const out='.local/aase/m0501/'+(process.env.AASE_BASE_URL?'live':'local');mkdirSync(out,{recursive:true});
const visible=(p:string)=>p.replace(/^### /,'').replace(/^(?:> |- |\d+\. )/gm,'');
async function body(page:Page,lang:'zh'|'en'){
 for(const s of lesson.text[lang].sections){
  const section=page.locator('h2#'+s.id).locator('..');await expect(section).toBeVisible();
  for(const p of s.paragraphs)for(const line of p.split("\n"))await expect(section).toContainText(visible(line));
  for(const b of s.blocks??[]){
   if(b.kind==='table'){const t=section.getByRole('table',{name:b.caption,exact:true});await expect(t.locator('th')).toHaveText(b.headers);await expect(t.locator('td')).toHaveText(b.rows.flat());}
   if(b.kind==='prose'||b.kind==='step'){if(b.heading)await expect(section.getByRole('heading',{name:b.heading,exact:true})).toHaveCount(1);for(const p of b.paragraphs)for(const line of p.split("\n"))await expect(section).toContainText(visible(line));if(b.code)await expect(section.locator('code')).toHaveText(b.code);}
   if(b.kind==='flow'){await expect(section).toContainText(b.caption);await expect(section).toContainText(b.description);await expect(section.locator('.prompt-spec-diagram li strong')).toHaveText(b.items.map((x:any)=>x.title));await expect(section.locator('.prompt-spec-diagram li p')).toHaveText(b.items.map((x:any)=>x.body));}
  }
 }
 for(const q of lesson.text[lang].openChecks){const section=page.locator('#'+q.id).locator('..');await expect(section.locator('h3')).toHaveText(q.prompt);await expect(section.locator('details p')).toHaveText(q.answer);}
}
for(const lang of ['zh','en'] as const)test(`${lang}: complete body, source-faithful workflow, keyboard, reflow, exports and no JS`,async({page,browser,baseURL,request})=>{
 const prefix=lang==='en'?'/en':'';const path=prefix+'/courses/aase/v1/m05/concepts/m05-01/';
 await page.goto(path);await expect(page.locator('.article-metadata')).toContainText('v1.1.0');await expect(page.locator('.article-metadata')).toContainText('2026-11-05');await expect(page.locator('.article-metadata')).toContainText('2026-11-11');await body(page,lang);
 await expect(page.locator('.prompt-spec-diagram')).toHaveCount(1);await expect(page.locator('.prompt-spec-diagram .arrow')).toHaveCount(4);await expect(page.locator('.prompt-spec-diagram .verification')).toContainText('Verification');
 for(const width of [320,390,768,1280])for(const scale of [1,2]){
  await page.setViewportSize({width,height:900});await page.evaluate(s=>document.documentElement.style.setProperty('font-size',s*100+'%','important'),scale);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth),`${width}/${scale} page overflow`).toBeLessThanOrEqual(width);
  const bad=await page.locator('article p,article figcaption,article th,article td,article caption,.prompt-spec-diagram li strong').evaluateAll(es=>es.filter(e=>{const s=getComputedStyle(e);return e.getClientRects().length&&(parseFloat(s.fontSize)<16||parseFloat(s.lineHeight)/parseFloat(s.fontSize)<1.7||e.scrollWidth>e.clientWidth+1)}).map(e=>e.textContent?.slice(0,80)));expect(bad,`${width}/${scale}`).toEqual([]);
  if(scale===1&&(width===390||width===1280))await page.locator('.prompt-spec-diagram').screenshot({path:`${out}/${lang}-${width}.png`});
 }
 await page.evaluate(()=>document.documentElement.style.removeProperty('font-size'));
 for(const q of lesson.text[lang].openChecks){const details=page.locator('#'+q.id).locator('..').locator('details');await details.locator('summary').focus();await page.keyboard.press('Tab');await page.keyboard.press('Shift+Tab');await expect(details.locator('summary')).toBeFocused();expect(await details.locator('summary').evaluate(e=>getComputedStyle(e).outlineStyle)).not.toBe('none');await page.keyboard.press('Enter');await expect(details).toHaveAttribute('open','');await page.keyboard.press('Space');await expect(details).not.toHaveAttribute('open','');}
 await page.setViewportSize({width:320,height:900});for(const region of await page.locator('article .table-scroll,article .code-region').all()){await region.focus();await expect(region).toBeFocused();if(await region.evaluate(e=>e.scrollWidth>e.clientWidth)){await region.press('ArrowRight');await expect.poll(()=>region.evaluate(e=>e.scrollLeft)).toBeGreaterThan(0);}}
 const href=`/images/aase/m05-01-workflow-${lang}.svg`;const response=await request.get(href);expect(response.status()).toBe(200);expect(await response.body()).toEqual(readFileSync('site'+href));expect((await response.body()).length).toBeLessThan(100000);
 const link=page.locator(`a[href="${href}"]`);await link.focus();const opened=page.waitForEvent('popup');await page.keyboard.press('Enter');const popup=await opened;await popup.waitForLoadState();await popup.evaluate(()=>document.fonts.ready);
 const problems=await popup.locator('text').evaluateAll(es=>{const boxes=es.map(e=>({text:e.textContent,b:(e as SVGGraphicsElement).getBBox(),v:(e as SVGGraphicsElement).ownerSVGElement!.viewBox.baseVal}));return boxes.flatMap((a,i)=>{const outside=a.b.x<0||a.b.y<0||a.b.x+a.b.width>a.v.width||a.b.y+a.b.height>a.v.height;return [...(outside?[a.text]:[]),...boxes.slice(i+1).filter(c=>a.b.x<c.b.x+c.b.width&&c.b.x<a.b.x+a.b.width&&a.b.y<c.b.y+c.b.height&&c.b.y<a.b.y+a.b.height).map(c=>[a.text,c.text])];});});expect(problems).toEqual([]);await popup.screenshot({path:`${out}/${lang}-svg.png`});await popup.close();
 const search=await(await request.get('/search-index.json')).json();const entry=search.find((e:any)=>e.id===lesson.id&&e.lang===lang);for(const s of lesson.text[lang].sections)for(const p of s.paragraphs)expect(entry.text).toContain(p);
 await expect(page.locator('.next-links a').first()).toHaveAttribute('href',prefix+'/courses/aase/v1/m04/concepts/m04-06/');await expect(page.locator('.next-links a').last()).toHaveAttribute('href',prefix+'/courses/aase/v1/m05/concepts/m05-02/');
 const context=await browser.newContext({baseURL,javaScriptEnabled:false,viewport:{width:320,height:900}});try{const p=await context.newPage();await p.goto(path);await body(p,lang);expect(await p.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);const summary=p.locator('#AASE-M05-C01-Q06').locator('..').locator('summary');await summary.click();await expect(summary.locator('..')).toHaveAttribute('open','');}finally{await context.close();}
});
