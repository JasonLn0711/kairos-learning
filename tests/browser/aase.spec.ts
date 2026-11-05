import {test,expect} from '@playwright/test';
import {readFileSync,readdirSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
const course=JSON.parse(readFileSync('content/aase/course.json','utf8'));
const lessons=readdirSync('content/aase/lessons').map(f=>JSON.parse(readFileSync('content/aase/lessons/'+f,'utf8')));
const conceptPaths=lessons.map(l=>{const m=course.modules.find((m:any)=>m.concepts.some((c:any)=>c.id===l.id));const c=m.concepts.find((c:any)=>c.id===l.id);return {path:`/courses/aase/v1/${m.id}/concepts/${c.slug}/`,lesson:l};});
const paths=['/courses/aase/v1/','/courses/aase/v1/workshop/',...course.modules.map((m:any)=>`/courses/aase/v1/${m.id}/`),...conceptPaths.map(c=>c.path)];
mkdirSync('.local/aase/screenshots',{recursive:true});
for(const path of paths){
 test(`${path}: readable, responsive, keyboard, static`,async({page,browser,baseURL})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(path);await expect(page.locator('h1')).toHaveCount(1);await expect(page.locator('html')).toHaveAttribute('lang','zh-Hant');
  await expect(page.locator('link[rel=alternate]')).toHaveCount(0);await expect(page.locator('a.language')).toHaveCount(0);await expect(page.locator('.module-rail')).toBeVisible();await expect(page.locator('.module-rail nav a')).toHaveCount(10);
  const data=conceptPaths.find(c=>c.path===path);
  if(data){await expect(page.locator('.toc')).toHaveCount(1);await expect(page.locator('article.prose')).toHaveCount(1);await expect(page.locator('.article-reading-guide')).toHaveCount(1);await expect(page.locator('#discussion')).toHaveText('概念 Q&A');await expect(page.locator('.next-links a')).toHaveCount(2);for(const s of data.lesson.text.zh.sections){await expect(page.locator('h2#'+s.id)).toHaveText(s.heading);for(const p of s.paragraphs)await expect(page.locator('h2#'+s.id).locator('..')).toContainText(p);}
   await expect(page.locator('.article-metadata')).toContainText('v'+data.lesson.contentVersion);
  }
  for(const width of [320,390,768,1280]){
   await page.setViewportSize({width,height:900});
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${width}px overflow`).toBe(true);
   const issues=await page.locator('main p,main li,.node h3,figcaption').evaluateAll(es=>es.filter(e=>{const s=getComputedStyle(e);return e.getClientRects().length&&(parseFloat(s.fontSize)<(e.closest('.module-list,.toc')?14:16)&& !e.classList.contains('article-metadata')||parseFloat(s.lineHeight)/parseFloat(s.fontSize)<1.7||e.scrollWidth>e.clientWidth+1);}).map(e=>e.textContent?.slice(0,80)));
   expect(issues,`${width}px readability`).toEqual([]);
   if(width===390||width===1280)await page.screenshot({path:`.local/aase/screenshots/${path.replaceAll('/','-')}-${width}.png`,fullPage:true});
   if(data && (['AASE-M01-C02','AASE-M01-C03','AASE-M01-C04'].includes(data.lesson.id)||data.lesson.id.startsWith('AASE-M02-')||data.lesson.id.startsWith('AASE-M03-')) && [390,1280].includes(width)){for(const [i,figure] of (await page.locator('article figure').all()).entries())await figure.screenshot({path:`.local/aase/screenshots/${data.lesson.id}-${width}-figure-${i}.png`});}
  }
  await page.setViewportSize({width:390,height:900});await page.addStyleTag({content:'html{font-size:200% !important}'});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'200% overflow').toBe(true);
  if(data){const summary=page.locator('main summary').first();await summary.focus();await expect(summary).toBeFocused();await page.keyboard.press('Enter');await expect(page.locator('main details').first()).toHaveAttribute('open','');await page.keyboard.press('Space');await expect(page.locator('main details').first()).not.toHaveAttribute('open','');}
  await page.goto(path);await page.keyboard.press('Tab');await expect(page.locator('a.skip')).toBeFocused();await page.keyboard.press('Enter');await expect(page.locator('#main')).toBeFocused();
  if(data && ((data.lesson.id.startsWith('AASE-M01-C0') && data.lesson.id!=='AASE-M01-C01')||data.lesson.id.startsWith('AASE-M02-')||data.lesson.id.startsWith('AASE-M03-'))){await page.setViewportSize({width:320,height:900});for(const region of await page.locator('.table-scroll').all()){await region.focus();await expect(region).toBeFocused();const range=await region.evaluate(e=>e.scrollWidth-e.clientWidth);if(range>0){await page.keyboard.press('ArrowRight');await expect.poll(()=>region.evaluate(e=>e.scrollLeft)).toBeGreaterThan(0);}}}
  if(data && ['AASE-M02-','AASE-M03-'].some(prefix=>data.lesson.id.startsWith(prefix))){for(const region of await page.locator('.code-region').all()){await region.focus();await expect(region).toBeFocused();const range=await region.evaluate(e=>e.scrollWidth-e.clientWidth);const codeWidth=await region.locator('code').evaluate(e=>e.getBoundingClientRect().width);if(codeWidth>await region.evaluate(e=>e.clientWidth)+1)expect(range,'The focusable code region must own horizontal scrolling').toBeGreaterThan(0);if(range>0){await page.keyboard.press('ArrowRight');await expect.poll(()=>region.evaluate(e=>e.scrollLeft)).toBeGreaterThan(0);}}}
  expect(errors).toEqual([]);
  const context=await browser.newContext({javaScriptEnabled:false,baseURL});const staticPage=await context.newPage();await staticPage.goto(path);
  await expect(staticPage.locator('h1')).toHaveCount(1);if(data){await expect(staticPage.locator('#practice').locator('..')).toContainText(data.lesson.text.zh.exercise.expected);await staticPage.locator('main summary').first().click();await expect(staticPage.locator('main details').first()).toHaveAttribute('open','');}
  await context.close();
 });
}
test('registry, search, directory gates, CEH regression and download bytes',async({page,request})=>{
 await page.goto('/courses/aase/v1/');await expect(page.locator('main li[id^=m]')).toHaveCount(49);await expect(page.locator('main li[id^=m] a')).toHaveCount(lessons.length);
 const data=await (await request.get('/search-index.json')).json();
 const list=Array.isArray(data)?data:data.entries;expect(list.filter((e:any)=>e.id.startsWith('AASE-M'))).toHaveLength(lessons.length);
 await page.goto('/search/');await page.locator('#search-query').fill('結果過期');await page.getByRole('button',{name:'搜尋',exact:true}).click();await expect(page.locator('.reading-list a[href="/courses/aase/v1/m05/concepts/m05-03/"]')).toBeVisible();
 const pending=await request.get('/courses/aase/v1/m04/concepts/m04-01/');expect(pending.status()).toBe(404);
 expect((await request.get('/en/courses/aase/v1/')).status()).toBe(404);
 await page.goto('/courses/ceh/v13/m01/concepts/m01-01/');await expect(page.locator('.module-rail')).toBeVisible();
 for(const name of ['aase-v1-workshop.zip','SHA256SUMS.txt']){const res=await request.get('/downloads/aase/'+name);expect(res.status()).toBe(200);expect(await res.body()).toEqual(readFileSync('site/downloads/aase/'+name));}
 const bytes=await (await request.get('/downloads/aase/aase-v1-workshop.zip')).body();expect(readFileSync('site/downloads/aase/SHA256SUMS.txt','utf8')).toContain(createHash('sha256').update(bytes).digest('hex'));
});
test('real Streamlit task, invalidation, keyboard and exported JSON',async({page})=>{
 test.skip(Boolean(process.env.AASE_BASE_URL),'Streamlit is a separate local teaching environment.');
 await page.goto('http://127.0.0.1:8515');await expect(page.getByRole('heading',{name:'收件資料完整性檢核'})).toBeVisible();
 await page.getByLabel('申請編號（必填）').fill('SYN-001');await page.getByLabel('申請人代號（必填）').fill('DEMO-A');await page.getByRole('button',{name:'檢查資料',exact:true}).click();
 await expect(page.getByText('缺少文件類型。請補齊或修正後重新檢查。')).toBeVisible();await expect(page.getByRole('button',{name:'匯出完整報告'})).toHaveCount(0);
 await page.getByLabel('文件類型（必填）').fill('合成申請表');await page.getByRole('button',{name:'檢查資料',exact:true}).focus();await page.keyboard.press('Enter');
 const downloadPromise=page.waitForEvent('download');await page.getByRole('button',{name:'匯出完整報告'}).click();const download=await downloadPromise;const stream=await download.createReadStream();const chunks=[];for await(const chunk of stream!)chunks.push(chunk);const report=JSON.parse(Buffer.concat(chunks).toString());expect(report.status).toBe('complete');expect(report.data).toEqual({application_id:'SYN-001',applicant_code:'DEMO-A',document_type:'合成申請表'});
 await page.getByLabel('文件類型（必填）').fill('');await page.getByLabel('文件類型（必填）').press('Tab');await expect(page.getByRole('button',{name:'匯出完整報告'})).toHaveCount(0);
 await page.screenshot({path:'.local/aase/screenshots/streamlit-invalidated.png',fullPage:true});
});


test('AASE and CEH share the same teaching frame and navigation geometry',async({page})=>{
 await page.setViewportSize({width:1280,height:900});
 const snapshots=[];
 for(const path of ['/courses/ceh/v13/m01/concepts/m01-01/','/courses/aase/v1/m04/concepts/m04-05/']){
  await page.goto(path);
  snapshots.push(await page.evaluate(()=>Object.fromEntries(['.page-shell','.module-rail','main','.toc','.article-metadata','.next-links'].map(selector=>{const e=document.querySelector(selector)!;const c=getComputedStyle(e);return [selector,{width:Math.round(e.getBoundingClientRect().width),fontSize:c.fontSize,lineHeight:c.lineHeight,display:c.display}];}))));
 }
 expect(snapshots[1]).toEqual(snapshots[0]);
 await expect(page.locator('.module-rail a[href*="/ceh/"]')).toHaveCount(0);
 await page.locator('.module-rail a[href="/courses/aase/v1/m03/"]').click();await expect(page.locator('h1')).toContainText('M03');await expect(page.locator('.module-rail a[aria-current=page]')).toContainText('M03');
});
