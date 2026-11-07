import {test,expect} from '@playwright/test';
import {readFileSync,mkdirSync} from 'node:fs';
const source=JSON.parse(readFileSync('content/concepts/ceh26-m04-c09.json','utf8'));
const norm=(s:string)=>s.replace(/\[([^\]]+)\]\(https:\/\/[^)]+\)/g,'$1').replace(/`([^`]+)`/g,'$1').replace(/\s+/g,' ').trim();
const dir=process.env.M04_09_BASE_URL?'.local/m04-09-replacement/live':'.local/m04-09-replacement/local';mkdirSync(dir,{recursive:true});
async function verifyBody(page:import('@playwright/test').Page,lang:string){
  const text=norm((await page.locator('.source-body').textContent())!);let cursor=0;
  for(const b of source.text[lang].sourceBody){const units=b.kind==='visual'?[b.visual.caption,b.visual.description,...b.visual.items.flatMap((n:any)=>[n.title,...n.body.split('\n\n')])]:b.kind==='table'?[...b.headers,...b.rows.flat()]:b.kind==='list'?b.items:b.kind==='answer'?[b.summary,...b.paragraphs]:[b.text];for(const unit of units){const value=norm(unit);const at=text.indexOf(value,cursor);expect(at,value).toBeGreaterThanOrEqual(cursor);cursor=at+value.length;}}
}
for(const lang of ['zh','en']){
 const prefix=lang==='en'?'/en':'';const path=prefix+'/courses/ceh/v13/m04/concepts/m04-09/';
 test(lang+': full source order, reflow, text size, keyboard and navigation',async({page,request})=>{
  expect((await page.goto(path))?.status()).toBe(200);await expect(page.locator('.article-metadata')).toContainText('v1.1.0');await expect(page.locator('.source-body h2')).toHaveCount(11);await expect(page.locator('[data-other-enumeration]')).toHaveCount(11);await expect(page.locator('.source-body details')).toHaveCount(4);await expect(page.locator('pre[tabindex] code')).toHaveText('ip -6 neigh show');
  await verifyBody(page,lang);
  for(const width of [320,390,768,1280]){
   await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
   expect(await page.locator('.source-body p,.source-body td,.source-body th,.source-body strong').evaluateAll(es=>es.filter(e=>e.getClientRects().length).some(e=>parseFloat(getComputedStyle(e).fontSize)<16||parseFloat(getComputedStyle(e).lineHeight)/parseFloat(getComputedStyle(e).fontSize)<1.7))).toBe(false);
   if(width===320||width===1280)for(const figure of await page.locator('[data-other-enumeration]').all())await figure.screenshot({path:`${dir}/${lang}-${width}-${await figure.getAttribute('data-other-enumeration')}.png`});
  }
  await page.setViewportSize({width:320,height:900});
  for(const region of await page.locator('.table-scroll,pre[tabindex]').all()){await region.focus();if(await region.evaluate(e=>e.scrollWidth>e.clientWidth)){await region.press('ArrowRight');await expect.poll(()=>region.evaluate(e=>e.scrollLeft)).toBeGreaterThan(0);}}
  const answer=page.locator('#answer-m0409-1');const summary=answer.locator('summary');await summary.focus();expect(await summary.evaluate(e=>getComputedStyle(e).outlineStyle)).not.toBe('none');await page.keyboard.press('Enter');await expect(answer).toHaveAttribute('open','');await page.keyboard.press('Space');await expect(answer).not.toHaveAttribute('open','');
  const download=page.locator('[data-other-enumeration] a').first();await download.focus();await page.keyboard.press('Shift+Tab');await page.keyboard.press('Tab');await expect(download).toBeFocused();const [file]=await Promise.all([page.waitForEvent('download'),page.keyboard.press('Enter')]);expect(readFileSync((await file.path())!)).toEqual(readFileSync('site'+await download.getAttribute('href')));
  await page.locator('main').evaluate(main=>{const sizes=[main,...main.querySelectorAll('*')].map(e=>({e,size:parseFloat(getComputedStyle(e).fontSize),line:parseFloat(getComputedStyle(e).lineHeight)}));for(const {e,size,line} of sizes){(e as HTMLElement).style.fontSize=size*2+'px';if(Number.isFinite(line))(e as HTMLElement).style.lineHeight=line*2+'px';}});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await expect(page.locator('.next-links a').first()).toHaveAttribute('href',prefix+'/courses/ceh/v13/m04/concepts/m04-08/');await expect(page.locator('.next-links a').last()).toHaveAttribute('href',prefix+'/courses/ceh/v13/m04/#ceh26-m04-c10');
  expect((await request.get(prefix+'/courses/ceh/v13/m04/concepts/m04-10/')).status()).toBe(404);
  const index=await(await request.get('/search-index.json')).json();const entry=index.find((e:any)=>e.id==='CEH26-M04-C09'&&e.lang===lang);for(const token of ['CHILD_SA','S3-D','AS64498','ip -6 neigh show','RPKI'])expect(entry.text).toContain(token);
 });
 test(lang+': all eleven downloaded SVGs match and all labels fit',async({page,request})=>{
  for(const b of source.text[lang].sourceBody.filter((b:any)=>b.kind==='visual')){
   const response=await request.get(b.src);expect(response.status()).toBe(200);const bytes=await response.body();expect(bytes).toEqual(readFileSync('site'+b.src));expect(bytes.length).toBeLessThan(100000);
   await page.setContent(bytes.toString());expect(await page.locator('text').evaluateAll(es=>es.filter(e=>{const r=e.getBoundingClientRect(),s=e.closest('svg')!.getBoundingClientRect();return r.left<s.left-1||r.top<s.top-1||r.right>s.right+1||r.bottom>s.bottom+1}).map(e=>e.textContent))).toEqual([]);
   expect(await page.locator('svg').evaluate(svg=>{const texts=[...svg.querySelectorAll('text')].map(e=>({text:e.textContent,r:e.getBoundingClientRect()}));const issues:string[]=[];for(let i=0;i<texts.length;i++)for(let j=i+1;j<texts.length;j++){const a=texts[i].r,b=texts[j].r;if(Math.min(a.right,b.right)>Math.max(a.left,b.left)+1&&Math.min(a.bottom,b.bottom)>Math.max(a.top,b.top)+1)issues.push(texts[i].text+' / '+texts[j].text);}return issues;})).toEqual([]);
   await page.screenshot({path:`${dir}/svg-${b.src.split('/').at(-1)}.png`,fullPage:true,timeout:15000});
  }
 });
 test(lang+': no JavaScript preserves full teaching and native answers',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:900}});const page=await context.newPage();await page.goto(path);await verifyBody(page,lang);await expect(page.locator('.source-body h2')).toHaveCount(11);await expect(page.locator('[data-other-enumeration]')).toHaveCount(11);const answer=page.locator('#answer-m0409-4');await answer.locator('summary').click();await expect(answer.locator('p')).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await context.close();
 });
}
