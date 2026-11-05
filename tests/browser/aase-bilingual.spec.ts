import {test,expect} from '@playwright/test';
import {readFileSync,readdirSync} from 'node:fs';
import {isPublic} from '../../src/lib/model';
const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const english=JSON.parse(readFileSync('content/aase/course.en.json','utf8'));
const lessons=readdirSync('content/aase/lessons').map(f=>JSON.parse(readFileSync('content/aase/lessons/'+f,'utf8'))).filter(l=>isPublic(l,today)&&l.translations?.en&&isPublic(l.translations.en,today));
const paths=['/en/courses/aase/v1/','/en/courses/aase/v1/workshop/',...english.modules.map((m:any)=>`/en/courses/aase/v1/${m.id}/`),...lessons.map(l=>`/en/courses/aase/v1/${l.id.slice(5,8).toLowerCase()}/concepts/${l.id.slice(5,8).toLowerCase()}-${l.id.slice(-2)}/`)];
for(const path of paths)test(`${path}: English teaching, reflow, keyboard and no JavaScript`,async({page,browser,baseURL})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(path);
 await expect(page.locator('html')).toHaveAttribute('lang','en');await expect(page.locator('h1')).toHaveCount(1);
 await expect(page.locator('.module-rail nav a')).toHaveCount(10);await expect(page.locator('a.language')).toHaveAttribute('href',path.replace(/^\/en/,''));
 await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href','https://learn.cs-kairos.com'+path);
 await expect(page.locator('link[rel=alternate][hreflang=en]')).toHaveAttribute('href','https://learn.cs-kairos.com'+path);
 await expect(page.locator('link[rel=alternate][hreflang=zh-Hant]')).toHaveAttribute('href','https://learn.cs-kairos.com'+path.replace(/^\/en/,''));
 const module=english.modules.find((m:any)=>path===`/en/courses/aase/v1/${m.id}/`);
 if(module){
  await expect(page.locator('h1')).toContainText(module.title);
  for(const c of module.concepts){const row=page.locator('#'+module.id+'-'+c.id.slice(-2));await expect(row).toContainText(c.title);await expect(row).toContainText(c.objective);await expect(row).toContainText(c.practice);await expect(row).toContainText(c.assessment);}
 }
 const lesson=lessons.find(l=>path.endsWith(`${l.id.slice(5,8).toLowerCase()}-${l.id.slice(-2)}/`));
 if(lesson){
  for(const s of lesson.text.en.sections){await expect(page.locator('h2#'+s.id)).toHaveText(s.heading);for(const p of s.paragraphs)await expect(page.locator('h2#'+s.id).locator('..')).toContainText(p);}
  await expect(page.locator('.article-reading-guide')).toContainText(lesson.text.en.readingGuide.goal);
  await expect(page.locator('.article-metadata')).toContainText('v'+lesson.contentVersion);
  await expect(page.locator('.article-metadata time').first()).toHaveAttribute('datetime',lesson.publishedOn);
  await expect(page.locator('.article-metadata time').last()).toHaveAttribute('datetime',lesson.date);
  for(const q of lesson.checks){const section=page.locator('h3#'+q.id).locator('..');await expect(section.locator('ol').first().locator('li')).toHaveText(q.text.en.options);await expect(section.locator('details')).not.toHaveAttribute('open','');await expect(section.locator('details ol li')).toHaveText(q.text.en.rationales);await expect(section.locator('details')).toContainText(String.fromCharCode(65+q.answer));}
  await expect(page.locator('#discussion')).toHaveText('Concept Q&A');
 }
 for(const width of [320,390,768,1280])for(const scale of [1,2]){
  await page.setViewportSize({width,height:900});await page.evaluate(scale=>document.documentElement.style.setProperty('font-size',`${scale*100}%`,'important'),scale);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth),`${path} ${width}px ${scale*100}%`).toBeLessThanOrEqual(width);
  const issues=await page.locator('main p,main li,figcaption').evaluateAll(es=>es.filter(e=>{const s=getComputedStyle(e);return e.getClientRects().length&&(parseFloat(s.fontSize)<(e.closest('.module-list,.toc')?14:16)&&!e.classList.contains('article-metadata')||parseFloat(s.lineHeight)/parseFloat(s.fontSize)<1.7||e.scrollWidth>e.clientWidth+1);}).map(e=>e.textContent?.slice(0,100)));
  expect(issues,`${width}px/${scale} reading`).toEqual([]);
 }
 await page.evaluate(()=>document.documentElement.style.removeProperty('font-size'));
 await page.setViewportSize({width:390,height:900});await page.screenshot({path:`.local/aase/bilingual/${path.replaceAll('/','-')}.png`,fullPage:true});
 if(lesson)for(const width of [390,1280]){await page.setViewportSize({width,height:900});await page.locator('article figure').first().screenshot({path:`.local/aase/bilingual/first-figure-${width}.png`});}
 await page.goto(path);await page.keyboard.press('Tab');await expect(page.locator('a.skip')).toBeFocused();await page.keyboard.press('Enter');await expect(page.locator('#main')).toBeFocused();
 await page.locator('a.language').focus();await page.keyboard.press('Enter');await expect(page).toHaveURL(path.replace(/^\/en/,''));await page.locator('a.language').press('Enter');await expect(page).toHaveURL(path);
 const context=await browser.newContext({baseURL,javaScriptEnabled:false});try{const p=await context.newPage();await p.goto(path);await expect(p.locator('h1')).toHaveCount(1);await p.locator('a.language').press('Enter');await expect(p).toHaveURL(path.replace(/^\/en/,''));if(lesson){await p.goto(path);await expect(p.locator('#practice').locator('..')).toContainText(lesson.text.en.exercise.expected);const summary=p.locator('main summary').first();await summary.focus();await summary.press('Enter');await expect(p.locator('main details').first()).toHaveAttribute('open','');await summary.press('Space');await expect(p.locator('main details').first()).not.toHaveAttribute('open','');}}finally{await context.close();}
 expect(errors).toEqual([]);
});
test('English directory, search, pending neighbors and downloads use actual locale availability',async({page,request})=>{
 await page.goto('/en/courses/aase/v1/');await expect(page.locator('main li[id^=m]')).toHaveCount(49);await expect(page.locator('main li[id^=m] a')).toHaveCount(lessons.length);
 const index=await(await request.get('/search-index.json')).json();const entries=Array.isArray(index)?index:index.entries;
 expect(entries.filter((e:any)=>e.id.startsWith('AASE-M')&&e.lang==='en')).toHaveLength(lessons.length);
 expect(entries.filter((e:any)=>e.id.startsWith('AASE-M')&&e.lang==='zh')).toHaveLength(49);
 await page.goto('/en/search/');await page.locator('#search-query').fill('production release');await page.getByRole('button',{name:'Search',exact:true}).click();await expect(page.locator('.reading-list a[href="/en/courses/aase/v1/m01/concepts/m01-01/"]')).toBeVisible();
 for(const m of english.modules)for(const c of m.concepts)if(!lessons.some(l=>l.id===c.id)){
  const slug=m.id+'-'+c.id.slice(-2),path=`/en/courses/aase/v1/${m.id}/concepts/${slug}/`;expect((await request.get(path)).status(),path).toBe(404);
  const zh=await request.get(path.replace(/^\/en/,''));expect(zh.status()).toBe(200);expect(await zh.text()).not.toContain('class="language"');
 }
 await page.goto('/en/courses/aase/v1/m01/concepts/m01-01/');const next=page.locator('.next-links a').last();await expect(next).toHaveAttribute('href','/en/courses/aase/v1/m01/#m01-02');await next.click();await expect(page.locator('#m01-02')).toContainText('In preparation');
 const sitemap=await(await request.get('/sitemap.xml')).text();expect(sitemap).toContain('https://learn.cs-kairos.com/en/courses/aase/v1/m01/concepts/m01-01/');expect(sitemap).not.toContain('/en/courses/aase/v1/m01/concepts/m01-02/');
 await page.goto('/en/courses/aase/v1/workshop/');await expect(page.locator('main')).toContainText('currently in Traditional Chinese');for(const name of ['aase-v1-workshop.zip','SHA256SUMS.txt']){const r=await request.get('/downloads/aase/'+name);expect(r.status()).toBe(200);expect(await r.body()).toEqual(readFileSync('site/downloads/aase/'+name));}
});

test('English AASE retains CEH teaching fields and computed frame styles',async({page})=>{
 for(const width of [390,1280]){
  await page.setViewportSize({width,height:900});const frames=[];
  for(const path of ['/en/courses/ceh/v13/m01/concepts/m01-01/','/en/courses/aase/v1/m01/concepts/m01-01/']){
   await page.goto(path);
   frames.push(await page.evaluate(()=>Object.fromEntries(['.page-shell','.module-rail','main','.toc','.article-metadata','.next-links','.article-reading-guide'].map(selector=>{const e=document.querySelector(selector)!;const style=getComputedStyle(e);return [selector,{width:Math.round(e.getBoundingClientRect().width),font:style.fontFamily,size:style.fontSize,line:style.lineHeight,display:style.display}];}))));
  }
  expect(frames[1]).toEqual(frames[0]);
 }
});

test('home language wording and AASE entry reflect partial translation availability',async({page,browser,baseURL})=>{
 for(const lang of ['zh','en']){
  const path=lang==='en'?'/en/':'/';await page.goto(path);
  const description=lang==='en'?'Choose available Traditional Chinese or English materials. Completed language pairs include a language switch, with clear routes for reading, practice and review.':'依課程與篇目提供繁體中文或英文教材；已完成對應翻譯的頁面可切換語言，閱讀、練習與複習各有清楚入口。';
  await expect(page.locator('.home-intro p')).toHaveText(description);
  const coursePath=(lang==='en'?'/en':'')+'/courses/aase/v1/';const entry=page.locator('a.course-row').first();await expect(entry).toHaveAttribute('href',coursePath);
  for(const width of [320,390,768,1280])for(const scale of [1,2]){await page.setViewportSize({width,height:900});await page.evaluate(scale=>document.documentElement.style.setProperty('font-size',`${scale*100}%`,'important'),scale);expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);expect(await page.locator('.course-row').evaluateAll(es=>es.every(e=>{const rects=[...e.children].map(n=>n.getBoundingClientRect());return rects.every((a,i)=>rects.slice(i+1).every(b=>a.right<=b.left+1||b.right<=a.left+1||a.bottom<=b.top+1||b.bottom<=a.top+1))&&rects[0].top<=rects[1].top&&rects[1].top<=rects[2].top;}))).toBe(true);}
  await page.setViewportSize({width:320,height:900});await page.screenshot({path:`.local/aase/bilingual/home-${lang}-320-200.png`,fullPage:true});
  await entry.focus();await expect(entry).toBeFocused();await entry.press('Enter');await expect(page).toHaveURL(coursePath);
  const context=await browser.newContext({baseURL,javaScriptEnabled:false});try{const p=await context.newPage();await p.goto(path);await expect(p.locator('.home-intro p')).toHaveText(description);await p.setViewportSize({width:320,height:900});await p.evaluate(()=>document.documentElement.style.setProperty('font-size','200%','important'));expect(await p.evaluate(()=>document.documentElement.scrollWidth)).toBe(320);await p.locator('a.course-row').first().press('Enter');await expect(p).toHaveURL(coursePath);}finally{await context.close();}
 }
});
