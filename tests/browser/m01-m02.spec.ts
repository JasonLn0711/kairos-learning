import {test,expect} from '@playwright/test';
import {mkdirSync,readFileSync} from 'node:fs';
const guides=JSON.parse(readFileSync('content/reading-support/ceh-m01-m02.json','utf8'));
const cases=Object.keys(guides).flatMap(id=>['zh','en'].map(lang=>{
 const lesson=id.startsWith('ceh-')?JSON.parse(readFileSync(`content/lessons/${id}.json`,'utf8')):undefined;
 const route=lesson?`/courses/ceh/v13/${lesson.module}/${lesson.slug}/`:`/courses/ceh/v13/${id.slice(0,3).toLowerCase()}/concepts/${id.toLowerCase()}/`;
 const source=lesson??JSON.parse(readFileSync(`content/concepts/${id.toLowerCase()}.json`,'utf8'));
 return {id,lang,url:(lang==='en'?'/en':'')+route,source};
}));
const screenshots=process.env.CEH_READING_BASE_URL?'.local/m01-m02/live/screenshots':'.local/m01-m02/screenshots';
mkdirSync(screenshots,{recursive:true});
for(const c of cases){
 test(`${c.id} ${c.lang}: four viewports, text resize, original downloads`,async({page,request})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(c.url);await expect(page.locator('.article-reading-guide')).toHaveCount(1);await expect(page.locator('.article-metadata')).not.toContainText(/閱讀更新|Reading updated/);
  await expect(page.locator('.article-metadata')).toContainText('v'+c.source.contentVersion);
  await expect(page.locator('.article-metadata')).toContainText(c.source.publishedOn);
  await expect(page.locator('.article-metadata')).toContainText((c.lang==='zh'?'版本修訂':'Version revised')+' '+(c.source.date??c.source.revisedOn));
  for(const width of [320,390,768,1280]){
   await page.setViewportSize({width,height:900});
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${width}px page overflow`).toBe(true);
   const issues=await page.locator('.article-reading-guide dd,.readable-diagram-text p,.prose p,.prose td,.prose li').evaluateAll(es=>es.filter(e=>{
    const s=getComputedStyle(e);return e.getClientRects().length&&(parseFloat(s.fontSize)<16||parseFloat(s.lineHeight)/parseFloat(s.fontSize)<1.7||e.scrollWidth>e.clientWidth+1);
   }).map(e=>e.textContent?.slice(0,80)));
   expect(issues,`${width}px body readability`).toEqual([]);
   if(width===390||width===1280){
    await page.screenshot({path:`${screenshots}/${c.id}-${c.lang}-${width}.png`});
    const diagram=page.locator('figure').first();if(await diagram.count())await diagram.screenshot({path:`${screenshots}/${c.id}-${c.lang}-${width}-diagram.png`});
   }
  }
  await page.setViewportSize({width:390,height:900});await page.addStyleTag({content:'html{font-size:200% !important}'});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'200% page overflow').toBe(true);
  expect(await page.locator('.article-reading-guide dd,.readable-diagram-text p').evaluateAll(es=>es.every(e=>e.scrollWidth<=e.clientWidth+1))).toBe(true);
  for(const a of await page.locator('main a[download][href$=".svg"]').all()){
   const href=(await a.getAttribute('href'))!;const response=await request.get(href);expect(response.status()).toBe(200);expect(await response.body()).toEqual(readFileSync('site'+href));
  }
  expect(errors).toEqual([]);
 });
 test(`${c.id} ${c.lang}: keyboard and no JavaScript`,async({page,browser,baseURL})=>{
  await page.setViewportSize({width:320,height:900});await page.goto(c.url);
  // The first Tab must follow initial client startup, which may restore body focus.
  await page.waitForLoadState('networkidle');
  await page.keyboard.press('Tab');await expect(page.locator('.skip')).toBeFocused();await page.keyboard.press('Enter');await expect(page.locator('#main')).toBeFocused();
  expect(await page.locator('main pre:not([tabindex="0"])').count()).toBe(0);
  // Real tab order, including scroll regions, disclosure controls and downloads.
  let summaries=0,regions=0;const visited=new Set<string>();
  for(let n=0;n<400;n++){
   await page.keyboard.press('Tab');
   const state=await page.evaluate(()=>{const e=document.activeElement as HTMLElement;return {tag:e.tagName,region:e.getAttribute('role')==='region',download:e.hasAttribute('download'),footer:!!e.closest('footer'),outline:getComputedStyle(e).outlineStyle};});
   if(state.footer)break;
   if(state.region||state.tag==='SUMMARY'||state.download)expect(state.outline).not.toBe('none');
   if(state.tag==='SUMMARY'){
    summaries++;await page.keyboard.press('Enter');expect(await page.evaluate(()=>document.activeElement?.parentElement?.hasAttribute('open'))).toBe(true);
    await page.keyboard.press('Space');expect(await page.evaluate(()=>document.activeElement?.parentElement?.hasAttribute('open'))).toBe(false);
   }
   if(state.region){
    regions++;const before=await page.evaluate(()=>{const e=document.activeElement!;return {left:e.scrollLeft,over:e.scrollWidth>e.clientWidth+1};});
    await page.keyboard.press('ArrowRight');if(before.over)await expect.poll(()=>page.evaluate(()=>document.activeElement!.scrollLeft)).toBeGreaterThan(before.left);
   }
   if(state.download)visited.add(await page.evaluate(()=>document.activeElement!.getAttribute('href')!));
   if(state.region||state.download){await page.keyboard.press('Shift+Tab');await page.keyboard.press('Tab');}
  }
  expect(summaries).toBe(await page.locator('main summary').count());
  expect(regions).toBe(await page.locator('main [role="region"][tabindex="0"]').count());
  expect(visited.size).toBe(new Set(await page.locator('main a[download]').evaluateAll(es=>es.map(e=>e.getAttribute('href')))).size);
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:900}});const p=await context.newPage();await p.goto(baseURL+c.url);
  await expect(p.locator('.article-reading-guide')).toHaveCount(1);expect(await p.locator('.readable-diagram-text').count()).toBe(await page.locator('.readable-diagram-text').count());
  const last=p.locator('.toc a').last();await last.click();expect(new URL(p.url()).hash).not.toBe('');
  for(const summary of await p.locator('main summary').all()){await summary.click();expect(await summary.evaluate(e=>e.parentElement!.hasAttribute('open'))).toBe(true);}
  await p.locator('.language').click();await expect(p.locator('html')).toHaveAttribute('lang',c.lang==='zh'?'en':'zh-Hant');await expect(p.locator('.article-reading-guide')).toHaveCount(1);
  await context.close();
 });
}
