import {test,expect} from '@playwright/test';
import {readFileSync,mkdirSync} from 'node:fs';
const dir='.local/m0206-revision/screenshots';mkdirSync(dir,{recursive:true});
const route=(lang:string)=>`${lang==='en'?'/en':''}/courses/ceh/v13/m02/concepts/m02-06/`;
const ids=['network-map','prefix-bits','private-network','bgp-routing','cdn-origin','proxy-modes'];
for(const lang of ['zh','en']){
 for(const width of [320,390,768,1280])test(`${lang} ${width}: replacement text, diagram layout and exports`,async({page,request})=>{
  await page.setViewportSize({width,height:900});await page.goto(route(lang));await page.waitForLoadState('networkidle');
  await expect(page.locator('.article-metadata')).toContainText('v1.1.0');
  await expect(page.locator('.network-diagram')).toHaveCount(6);await expect(page.locator('[data-reviewed-svg]')).toHaveCount(2);await expect(page.locator('.reference-answer')).toHaveCount(9);
  await expect(page.locator('#section-2-4')).toBeVisible();await expect(page.locator('#section-3-2')).toBeVisible();await expect(page.locator('#section-4-4')).toBeVisible();await expect(page.locator('#section-8-6')).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  expect(await page.locator('.network-diagram .node p').evaluateAll(es=>es.every(e=>parseFloat(getComputedStyle(e).fontSize)>=16&&parseFloat(getComputedStyle(e).lineHeight)/parseFloat(getComputedStyle(e).fontSize)>=1.7&&e.scrollWidth<=e.clientWidth))).toBe(true);
  for(const id of ids){
   const fig=page.locator(`[data-network-layout="${id}"]`);await expect(fig).toBeVisible();
   const link=fig.locator('.network-download'),href=(await link.getAttribute('href'))!;const response=await request.get(href);expect(response.status()).toBe(200);expect(await response.body()).toEqual(readFileSync('site'+href));
   if(width===390||width===1280)await fig.screenshot({path:`${dir}/${lang}-${id}-${width}.png`});
  }
  const comparison=page.locator('[data-network-layout=proxy-modes] .comparison');const panels=comparison.locator('section');const a=(await panels.nth(0).boundingBox())!,b=(await panels.nth(1).boundingBox())!;
  if(width===1280)expect(Math.abs(a.y-b.y)).toBeLessThan(2);if(width<=390)expect(b.y).toBeGreaterThan(a.y+a.height);
  await expect(page.locator('[data-network-layout=bgp-routing] .connection.up.dashed')).toHaveCount(1);
  await expect(page.locator('[data-network-layout=cdn-origin] .dns-exchange svg path')).toHaveCount(1);
 });
 test(`${lang}: CIDR keyboard, boundaries, disclosure and text zoom`,async({page})=>{
  await page.setViewportSize({width:390,height:844});await page.goto(route(lang));await page.waitForLoadState('networkidle');
  const input=page.locator('#cidr-prefix');await expect(input).toBeEnabled();
  const link=page.locator('[data-network-layout=prefix-bits] .network-download');await link.focus();await page.keyboard.press('Tab');await expect(input).toBeFocused();expect(await input.evaluate(e=>getComputedStyle(e).outlineStyle)).not.toBe('none');
  const values=[[24,'0','255',256],[25,'0','127',128],[26,'0','63',64],[27,'0','31',32],[28,'16','31',16],[29,'24','31',8],[30,'24','27',4]];
  for(const [prefix,start,end,count] of values){if(prefix!==24)await page.keyboard.press('ArrowRight');await expect(input).toHaveValue(String(prefix));await expect(page.locator('[data-cidr=network]')).toHaveText(`192.0.2.${start}/${prefix}`);await expect(page.locator('[data-cidr=count]')).toHaveText(String(count));await expect(page.locator('[data-cidr=range]')).toHaveText(`192.0.2.${start} – 192.0.2.${end}`);}
  await page.keyboard.press('End');await expect(input).toHaveValue('30');await page.keyboard.press('Home');await expect(input).toHaveValue('24');
  await page.keyboard.press('Shift+Tab');await expect(link).toBeFocused();const wait=page.waitForEvent('download');await page.keyboard.press('Enter');const download=await wait;expect(readFileSync((await download.path())!)).toEqual(readFileSync('site'+await link.getAttribute('href')));
  const answer=page.locator('#answer-integrated-origin');await expect(answer).not.toHaveAttribute('open');await answer.locator('summary').focus();await page.keyboard.press('Space');await expect(answer).toHaveAttribute('open','');await page.keyboard.press('Enter');await expect(answer).not.toHaveAttribute('open');
  await page.addStyleTag({content:'html{font-size:200% !important}'});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  for(const id of ids){const f=page.locator(`[data-network-layout="${id}"]`);expect(await f.evaluate(e=>e.scrollWidth<=e.clientWidth)).toBe(true);}
  await page.locator('[data-network-layout=proxy-modes]').screenshot({path:`${dir}/${lang}-proxy-200.png`});
 });
 test(`${lang}: no JavaScript, search and SVG text bounds`,async({browser,page,baseURL})=>{
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:900}});const p=await context.newPage();await p.goto(baseURL+route(lang));await expect(p.locator('.network-diagram')).toHaveCount(6);await expect(p.locator('#cidr-prefix')).toBeDisabled();await expect(p.locator('[data-cidr=network]')).toHaveText('192.0.2.0/24');
  await p.locator('#answer-integrated-smb summary').click();await expect(p.locator('#answer-integrated-smb')).toHaveAttribute('open','');expect(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await context.close();
  await page.goto((lang==='en'?'/en':'')+'/search/');await page.locator('#search-query').fill('AS64497');await expect(page.locator(`a[href="${route(lang)}"]`).first()).toBeVisible();
  for(const id of ids){const svg=readFileSync(`site/images/ceh/m02-06-${id}-${lang}.svg`,'utf8');await page.setContent(svg);expect(await page.locator('svg').evaluate(e=>{const v=(e as SVGSVGElement).viewBox.baseVal;return [...e.querySelectorAll('text')].every(t=>{const b=t.getBBox();return b.x>=0&&b.y>=0&&b.x+b.width<=v.width&&b.y+b.height<=v.height;});})).toBe(true);expect(await page.locator('svg').evaluate(e=>{const overlap=(a:DOMRect,b:DOMRect)=>a.x<b.x+b.width&&a.x+a.width>b.x&&a.y<b.y+b.height&&a.y+a.height>b.y;return [...e.querySelectorAll('text')].every(t=>[...e.querySelectorAll('path')].every(p=>!overlap(t.getBBox(),p.getBBox())));})).toBe(true);await page.locator('svg').screenshot({path:`${dir}/${lang}-${id}-svg.png`});}
 });
}
