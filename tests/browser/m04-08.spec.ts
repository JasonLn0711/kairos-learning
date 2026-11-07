import {test,expect} from '@playwright/test';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
const source=JSON.parse(readFileSync('content/concepts/ceh26-m04-c08.json','utf8'));
const norm=(s:string)=>s.replace(/\[([^\]]+)\]\(https:\/\/[^)]+\)/g,'$1').replace(/\s+/g,' ').trim();
const dir='.local/m04-08';mkdirSync(dir,{recursive:true});
for(const lang of ['zh','en']){
 const prefix=lang==='en'?'/en':'';const path=prefix+'/courses/ceh/v13/m04/concepts/m04-08/';
 test(lang+': full paired body, four widths, 200% text, keyboard and navigation',async({page})=>{
  expect((await page.goto(path))?.status()).toBe(200);await expect(page.locator('h1')).toContainText('M04-08');
  await expect(page.locator('h1')).not.toContainText('CEH26');await expect(page.locator('.article-metadata')).toContainText('v'+source.contentVersion);
  const dates=page.locator('.article-metadata time');await expect(dates).toHaveCount(2);await expect(dates.nth(0)).toHaveAttribute('datetime',source.publishedOn);await expect(dates.nth(1)).toHaveAttribute('datetime',source.date);
  await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href','https://learn.cs-kairos.com'+path);
  const body=source.text[lang].sourceBody;const text=norm((await page.locator('article').textContent())!);let cursor=0;
  for(const b of body)for(const unit of b.kind==='list'?b.items:b.kind==='answer'?[b.summary,...b.paragraphs]:b.kind==='visual'?[b.visual.caption,...b.visual.items.flatMap((i:any)=>b.src.includes('-tickets-')?[i.body.split('\n')[0],...i.title.split(' → '),...i.body.split('\n').slice(1)]:[i.title,i.body]),b.visual.description,b.downloadLabel]:b.kind==='table'?[...b.headers,...b.rows.flat()]:[b.text]){const value=norm(unit);const at=text.indexOf(value,cursor);expect(at,value).toBeGreaterThanOrEqual(cursor);cursor=at+value.length;}
  const answer=page.locator('#answer-ldap-completeness');await expect(page.locator('article details')).toHaveCount(3);await expect(answer).not.toHaveAttribute('open','');
  for(const heading of await page.locator('.source-body h2').all())await expect(heading).toBeVisible();
  for(const width of [320,390,768,1280]){
   await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
   const baseItem=page.locator('[data-ldap=scope] .root');await expect(baseItem).toHaveCount(1);
   expect(await baseItem.evaluate(e=>e.scrollWidth<=e.clientWidth)).toBe(true);
   expect(await page.locator('.source-body p,.source-body li').evaluateAll(es=>es.filter(e=>{const s=getComputedStyle(e);return e.getClientRects().length&&(parseFloat(s.fontSize)<16||parseFloat(s.lineHeight)/parseFloat(s.fontSize)<1.7)}).length)).toBe(0);
   await page.screenshot({path:dir+'/'+lang+'-'+width+'.png',fullPage:true});
  }
  await page.setViewportSize({width:320,height:900});await page.addStyleTag({content:'html{font-size:200%!important}'});
  const zoom=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,articleRight:document.querySelector('article')!.getBoundingClientRect().right}));
  writeFileSync(dir+'/'+lang+'-zoom.json',JSON.stringify(zoom));expect(zoom.articleRight).toBeLessThanOrEqual(zoom.width);expect(zoom.scrollWidth).toBeLessThanOrEqual(zoom.width);
  await answer.locator('summary').focus();expect(await answer.locator('summary').evaluate(e=>getComputedStyle(e).outlineStyle)).not.toBe('none');
  await page.keyboard.press('Enter');await expect(answer).toHaveAttribute('open','');await page.keyboard.press('Space');await expect(answer).not.toHaveAttribute('open','');
  await page.keyboard.press('Shift+Tab');await page.keyboard.press('Tab');await expect(answer.locator('summary')).toBeFocused();
  await expect(page.locator('.next-links a').first()).toHaveAttribute('href',prefix+'/courses/ceh/v13/m04/concepts/m04-07/');
  await expect(page.locator('.next-links a').last()).toHaveAttribute('href',prefix+'/courses/ceh/v13/m04/concepts/m04-09/');
  await page.goto(prefix+'/search/');await page.locator('input[type=search]').fill('sizeLimitExceeded');await expect(page.locator('.reading-list a[href="'+path+'"]')).toBeVisible();
 });
 test(lang+': no JavaScript retains selectable body, sources and native answer',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:900}});const page=await context.newPage();await page.goto(path);
  await expect(page.locator('.source-body h2')).toHaveCount(12);await expect(page.locator('.source-body a[href^="https://"]')).toHaveCount(13);
  const answer=page.locator('#answer-ldap-completeness');await expect(answer).not.toHaveAttribute('open','');await answer.locator('summary').focus();await page.keyboard.press('Enter');await expect(answer.locator('p').first()).toBeVisible();
  const selected=await page.locator('.source-body p').first().evaluate(e=>{const r=document.createRange();r.selectNodeContents(e);const s=getSelection()!;s.removeAllRanges();s.addRange(r);return s.toString();});expect(selected.length).toBeGreaterThan(0);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await context.close();
 });
 test(lang+': actual article text doubles at 320px without clipping',async({page})=>{
  await page.setViewportSize({width:320,height:900});await page.goto(path);
  const baseline=await page.locator('.source-body p').first().evaluate(e=>parseFloat(getComputedStyle(e).fontSize));
  await page.locator('main').evaluate(main=>{
   const sizes=[main,...main.querySelectorAll('*')].map(e=>({e,size:parseFloat(getComputedStyle(e).fontSize),line:parseFloat(getComputedStyle(e).lineHeight)}));
   for(const {e,size,line} of sizes){(e as HTMLElement).style.fontSize=size*2+'px';if(Number.isFinite(line))(e as HTMLElement).style.lineHeight=line*2+'px';}
  });
  const resized=await page.locator('.source-body p').first().evaluate(e=>parseFloat(getComputedStyle(e).fontSize));expect(resized).toBe(baseline*2);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  const answer=page.locator('#answer-ldap-completeness');await answer.locator('summary').focus();await page.keyboard.press('Enter');await expect(answer.locator('p').first()).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.locator('[data-ldap=scope]').screenshot({path:dir+'/'+lang+'-case-text-200.png'});
  await page.locator('.toc').screenshot({path:dir+'/'+lang+'-toc-text-200.png'});
  writeFileSync(dir+'/'+lang+'-actual-text-200.json',JSON.stringify({baseline,resized,width:320,scrollWidth:await page.evaluate(()=>document.documentElement.scrollWidth)}));
 });
}
for(const lang of ['zh','en'])test(lang+': all ten figures retain readable HTML, keyboard downloads and bounded SVG labels',async({page,request})=>{
 await page.goto((lang==='en'?'/en':'')+'/courses/ceh/v13/m04/concepts/m04-08/');
 const figures=page.locator('[data-ldap]');await expect(figures).toHaveCount(10);
 for(const width of [390,1280]){
  await page.setViewportSize({width,height:900});
  for(const figure of await figures.all()){
   const key=await figure.getAttribute('data-ldap');await figure.screenshot({path:dir+'/'+lang+'-'+key+'-'+width+'.png'});
   expect(await figure.evaluate(e=>e.scrollWidth<=e.clientWidth)).toBe(true);
  }
 }
 for(const figure of await figures.all()){
  const a=figure.locator('a[download]');await a.focus();await expect(a).toBeFocused();await page.keyboard.press('Shift+Tab');await page.keyboard.press('Tab');await expect(a).toBeFocused();
  const downloadPromise=page.waitForEvent('download');await page.keyboard.press('Enter');const download=await downloadPromise;expect(await download.failure()).toBeNull();
  const src=(await a.getAttribute('href'))!;const response=await request.get(src);expect(response.status()).toBe(200);
  const svg=await response.body();expect(svg.length).toBeLessThan(100000);expect(svg.equals(readFileSync('site'+src))).toBe(true);
  const asset=await page.context().newPage();await asset.goto(src);
  const bad=await asset.locator('svg').evaluate(svg=>{
   const view=(svg as SVGSVGElement).viewBox.baseVal;
   const labels=[...svg.querySelectorAll('text')].map(t=>({text:t.textContent!,box:t.getBBox()}));
   const overlaps=labels.flatMap((a,i)=>labels.slice(i+1).filter(b=>a.box.x<b.box.x+b.box.width-.5&&a.box.x+a.box.width>b.box.x+.5&&a.box.y<b.box.y+b.box.height-.5&&a.box.y+a.box.height>b.box.y+.5).map(b=>a.text+' / '+b.text));
   const separators=svg.querySelectorAll('path[d^="M30 "]');
   for(const path of separators){const line=(path as SVGGraphicsElement).getBBox();if(line.height===0)for(const label of labels)if(line.y>label.box.y&&line.y<label.box.y+label.box.height)overlaps.push('Separator crosses '+label.text);}
   return overlaps.concat(labels.filter(({box:b})=>b.x<0||b.y<0||b.x+b.width>1000||b.y+b.height>view.height/.85).map(l=>l.text));
  });expect(bad).toEqual([]);await asset.locator('svg').screenshot({path:dir+'/'+lang+'-svg-'+(await figure.getAttribute('data-ldap'))+'.png'});await asset.close();
 }
});
