import {test,expect} from '@playwright/test';
import {mkdirSync,readFileSync} from 'node:fs';
const cases=['zh','en'].map(lang=>({id:'M03-04',lang,source:JSON.parse(readFileSync('content/concepts/m03-04.json','utf8')),url:`/${lang==='en'?'en/':''}courses/ceh/v13/m03/concepts/m03-04/`}));
const screenshots='.local/m0304/screenshots';mkdirSync(screenshots,{recursive:true});
for(const c of cases){
 test(`${c.id} ${c.lang}: four viewports, text resize, original downloads`,async({page,request})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(c.url);await expect(page.locator('[data-reviewed-svg]')).toHaveCount(4);await expect(page.locator('main details')).toHaveCount(5);await expect(page.locator('.article-metadata')).not.toContainText(/閱讀更新|Reading updated/);
  await expect(page.locator('.article-metadata')).toContainText('v'+c.source.contentVersion);
  await expect(page.locator('.article-metadata')).toContainText(c.source.publishedOn);
  await expect(page.locator('.article-metadata')).toContainText((c.lang==='zh'?'版本修訂':'Version revised')+' '+c.source.date);
  for(const width of [320,390,768,1280]){
   await page.setViewportSize({width,height:900});
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${width}px page overflow`).toBe(true);
   const issues=await page.locator('.article-reading-guide dd,.readable-diagram-text p,.footprint-model p,.footprint-model h3,[data-reviewed-svg] h3,[data-reviewed-svg] p,[data-reviewed-svg] strong,.transport-figure h3,.transport-figure p,.transport-figure li,.transport-figure dd,.prose p,.prose td,.prose li').evaluateAll(es=>es.filter(e=>{
    const s=getComputedStyle(e);return e.getClientRects().length&&(parseFloat(s.fontSize)<16||parseFloat(s.lineHeight)/parseFloat(s.fontSize)<1.7||e.scrollWidth>e.clientWidth+1);
   }).map(e=>e.textContent?.slice(0,80)));
   expect(issues,`${width}px body readability`).toEqual([]);
   if(width===390||width===1280){
    await page.screenshot({path:`${screenshots}/${c.id}-${c.lang}-${width}.png`});
    for(const [i,diagram] of (await page.locator('figure').all()).entries())await diagram.screenshot({path:`${screenshots}/${c.id}-${c.lang}-${width}-diagram-${i}.png`});
   }
  }
  await page.setViewportSize({width:390,height:900});await page.addStyleTag({content:'html{font-size:200% !important}'});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'200% page overflow').toBe(true);
  expect(await page.locator('.article-reading-guide dd,.readable-diagram-text p,.footprint-model p,.footprint-model h3,[data-reviewed-svg] h3,[data-reviewed-svg] p,[data-reviewed-svg] strong,.transport-figure h3,.transport-figure p,.transport-figure li,.transport-figure dd').evaluateAll(es=>es.every(e=>e.scrollWidth<=e.clientWidth+1))).toBe(true);
  for(const a of await page.locator('main a[download][href$=".svg"]').all()){
   const href=(await a.getAttribute('href'))!;const response=await request.get(href,{maxRetries:2,timeout:30000});expect(response.status()).toBe(200);expect(await response.body()).toEqual(readFileSync('site'+href));
  }
  expect(errors).toEqual([]);
 });
 test(`${c.id} ${c.lang}: keyboard and no JavaScript`,async({page,browser,baseURL})=>{
  await page.setViewportSize({width:320,height:900});await page.goto(c.url);await expect(page.locator('[data-reviewed-svg]')).toHaveCount(4);await expect(page.locator('main details')).toHaveCount(5);
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
  await expect(p.locator('[data-reviewed-svg]')).toHaveCount(4);expect(await p.locator('.readable-diagram-text').count()).toBe(await page.locator('.readable-diagram-text').count());
  const last=p.locator('.toc a').last();await last.click();expect(new URL(p.url()).hash).not.toBe('');
  for(const summary of await p.locator('main summary').all()){await summary.click();expect(await summary.evaluate(e=>e.parentElement!.hasAttribute('open'))).toBe(true);}
  await p.locator('.language').click();await expect(p.locator('html')).toHaveAttribute('lang',c.lang==='zh'?'en':'zh-Hant');await expect(p.locator('[data-reviewed-svg]')).toHaveCount(4);
  await context.close();
 });
}

test('M03-04 standalone SVG geometry and matching downloads',async({page,request})=>{
 const models=JSON.parse(readFileSync('src/lib/m0304-inline-svg.json','utf8'));
 for(const src of Object.keys(models)){
  await page.goto(src);await page.evaluate(()=>document.fonts.ready);
  const problems=await page.locator('svg').evaluate(svg=>{
   const box=svg.getBoundingClientRect();const texts=[...svg.querySelectorAll('text')];const errors:string[]=[];
   for(const t of texts){const r=t.getBoundingClientRect();if(r.left<box.left-1||r.right>box.right+1||r.top<box.top-1||r.bottom>box.bottom+1)errors.push('out of bounds: '+t.textContent);}
   for(let i=0;i<texts.length;i++)for(let j=i+1;j<texts.length;j++){const a=texts[i].getBoundingClientRect(),b=texts[j].getBoundingClientRect();if(Math.min(a.right,b.right)-Math.max(a.left,b.left)>1&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>1)errors.push('overlap: '+texts[i].textContent+' / '+texts[j].textContent);}
   return errors;
  });expect(problems,src).toEqual([]);
  const response=await request.get(src,{maxRetries:2,timeout:30000});expect(await response.body()).toEqual(readFileSync('site'+src));expect((await response.body()).length).toBeLessThan(100000);
  await page.screenshot({path:screenshots+'/'+src.split('/').pop()+'.png'});
 }
});
