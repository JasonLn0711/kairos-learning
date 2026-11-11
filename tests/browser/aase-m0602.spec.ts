import {test,expect,type Page} from '@playwright/test';
import {readFileSync} from 'node:fs';
const lesson=JSON.parse(readFileSync('content/aase/lessons/aase-m06-c02.json','utf8'));
const normalize=(s:string)=>s.replace(/^(?:- |\d+\. )/gm,'').replace(/`/g,'').replace(/\s/g,'');
async function body(page:Page,lang:'zh'|'en'){
 for(const s of lesson.text[lang].sections){
  const section=page.locator('h2#'+s.id).locator('..');await expect(section.locator('h2').first()).toHaveText(s.heading);const actual=normalize((await section.textContent())!);let cursor=0;
  const ordered=[s.heading,...s.paragraphs];
  for(const b of s.blocks??[]){
   if(b.kind==='prose')ordered.push(...b.paragraphs);
   else if(b.kind==='step')ordered.push(b.heading,...b.paragraphs,...(b.code?[b.code]:[]));
   else if(b.kind==='table'){ordered.push(b.caption,...b.headers,...b.rows.flat());await expect(section.getByRole('table',{name:b.caption}).locator('td')).toHaveText(b.rows.flat());}
   else{
    ordered.push(b.caption);
    if(b.kind==='architecture'){
     const f=section.locator('.architecture-diagram');await expect(f.locator('[data-scope="inside"] [data-node]')).toHaveCount(1);await expect(f.locator('.relations > li')).toHaveCount(b.relations.length);
     for(const n of b.nodes){const node=f.locator('[data-node="'+n.id+'"]');await expect(node).toContainText(n.title);await expect(node).toContainText(n.body);}
     for(const r of b.relations)await expect(f.locator('[data-from="'+r.from+'"][data-to="'+r.to+'"]')).toContainText(r.label);
    }else for(const item of b.items){await expect(section).toContainText(item.title);await expect(section).toContainText(item.body);}
   }
  }
  for(const token of ordered){const v=normalize(token);const found=actual.indexOf(v,cursor);expect(found,lang+'/'+s.id+': '+token.slice(0,70)).toBeGreaterThanOrEqual(cursor);cursor=found+v.length;}
 }
 for(const q of lesson.text[lang].openChecks){const s=page.locator('#'+q.id).locator('..');await expect(s.locator('h3')).toHaveText(q.prompt.split('\n')[0]);if(q.prompt.includes('\n'))await expect(s.locator(':scope > ol > li')).toHaveText(q.prompt.split('\n').slice(1));await expect(s.locator('details p')).toHaveText(q.answer);}
}
for(const lang of ['zh','en'] as const)test(lang+': full text, responsive diagrams, keyboard, no JS and exact downloads',async({page,browser,baseURL,request})=>{
 const path=`${lang==='en'?'/en':''}/courses/aase/v1/m06/concepts/m06-02/`;const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(path);await body(page,lang);await expect(page.locator('.article-metadata')).toContainText('v1.1.0');await expect(page.locator('.context-figure')).toHaveCount(4);
 for(const width of [320,390,768,1280])for(const scale of [1,2]){
  await page.setViewportSize({width,height:900});await page.evaluate(s=>document.documentElement.style.setProperty('font-size',s*100+'%','important'),scale);expect(await page.evaluate(()=>document.documentElement.scrollWidth),`${width}/${scale}`).toBeLessThanOrEqual(width);
  const bad=await page.locator('article p,article li,article figcaption').evaluateAll(es=>es.filter(e=>{const s=getComputedStyle(e);return e.getClientRects().length&&(parseFloat(s.fontSize)<16||parseFloat(s.lineHeight)/parseFloat(s.fontSize)<1.7||e.scrollWidth>e.clientWidth+1)}).map(e=>e.textContent?.slice(0,60)));expect(bad,`${width}/${scale}`).toEqual([]);
  if(scale===1&&(width===390||width===1280))for(const n of [1,2,3,4])await page.locator('[data-figure="'+n+'"]').screenshot({path:`.local/aase/m0602/${lang}-${n}-${width}.png`});
 }
 await page.evaluate(()=>document.documentElement.style.removeProperty('font-size'));await page.setViewportSize({width:320,height:900});
 for(const region of await page.locator('article .table-scroll,article .code-region').all()){await region.focus();await expect(region).toBeFocused();if(await region.evaluate(e=>e.scrollWidth>e.clientWidth)){await region.press('ArrowRight');await expect.poll(()=>region.evaluate(e=>e.scrollLeft)).toBeGreaterThan(0);}}
 const link=page.locator('.context-figure a').first();await link.focus();await page.keyboard.press('Tab');await page.keyboard.press('Shift+Tab');await expect(link).toBeFocused();expect(await link.evaluate(e=>getComputedStyle(e).outlineStyle)).not.toBe('none');
 for(const q of lesson.text[lang].openChecks){const d=page.locator('#'+q.id).locator('..').locator('details');await d.locator('summary').focus();await page.keyboard.press('Enter');await expect(d).toHaveAttribute('open','');await expect(d).toContainText(q.answer[0]);expect(await d.locator('summary').evaluate(e=>getComputedStyle(e).outlineStyle)).not.toBe('none');await page.keyboard.press('Space');await expect(d).not.toHaveAttribute('open','');}
 const search=await(await request.get('/search-index.json')).json();const entry=search.find((e:any)=>e.id===lesson.id&&e.lang===lang);for(const s of lesson.text[lang].sections){for(const p of s.paragraphs)expect(entry.text).toContain(p);for(const b of s.blocks??[]){if(b.kind==='architecture')for(const r of b.relations)expect(entry.text).toContain(r.label);if(b.kind==='prose')for(const p of b.paragraphs)expect(entry.text).toContain(p);}}
 for(const n of [1,2,3,4]){
  const href=`/images/aase/m06-02-${n}-${lang}.svg`;const a=page.locator('a[href="'+href+'"]');await a.focus();const promise=page.waitForEvent('popup');await page.keyboard.press('Enter');const popup=await promise;await popup.waitForLoadState();await popup.evaluate(()=>document.fonts.ready);expect(new URL(popup.url()).pathname).toBe(href);
  const bad=await popup.locator('text').evaluateAll(es=>es.map(e=>{const t=e as SVGGraphicsElement;const b=t.getBBox();const v=t.ownerSVGElement!.viewBox.baseVal;return {text:e.textContent,x:b.x,y:b.y,right:b.x+b.width,bottom:b.y+b.height,width:v.width,height:v.height};}).filter(b=>b.x<0||b.y<0||b.right>b.width||b.bottom>b.height));expect(bad).toEqual([]);
  const overlaps=await popup.locator('text').evaluateAll(es=>{const boxes=es.map(e=>({text:e.textContent,b:(e as SVGGraphicsElement).getBBox()}));return boxes.flatMap((a,i)=>boxes.slice(i+1).filter(c=>a.b.x<c.b.x+c.b.width&&c.b.x<a.b.x+a.b.width&&a.b.y<c.b.y+c.b.height&&c.b.y<a.b.y+a.b.height).map(c=>[a.text,c.text]));});expect(overlaps).toEqual([]);await popup.screenshot({path:`.local/aase/m0602/${lang}-${n}-svg.png`});await popup.close();const r=await request.get(href);expect(r.status()).toBe(200);const bytes=await r.body();expect(bytes.length).toBeLessThan(100000);expect(bytes).toEqual(readFileSync('site'+href));
 }
 const context=await browser.newContext({baseURL,javaScriptEnabled:false,viewport:{width:320,height:900}});try{const p=await context.newPage();await p.goto(path);await body(p,lang);await expect(p.locator('.context-figure')).toHaveCount(4);const summary=p.locator('#checks').locator('..').locator('summary').first();await summary.press('Enter');await expect(summary.locator('..')).toHaveAttribute('open','');expect(await p.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);}finally{await context.close();}
 expect(errors).toEqual([]);
});
