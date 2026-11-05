import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
const cases=[
 {id:'ceh-zh',path:'/courses/ceh/v13/m04/concepts/m04-05/',count:21},
 {id:'ceh-en',path:'/en/courses/ceh/v13/m04/concepts/m04-05/',count:21},
 {id:'aase-zh',path:'/courses/aase/v1/m09/concepts/m09-04/',count:10}
];
for(const entry of cases)for(const javaScriptEnabled of [true,false]){
 test(`${entry.id}: readable rail at 100% and 200%, JS ${javaScriptEnabled}`,async({browser,baseURL})=>{
  const context=await browser.newContext({baseURL,javaScriptEnabled});
  try{
   const page=await context.newPage();await page.goto(entry.path);
   const links=page.locator('.module-rail nav a');await expect(links).toHaveCount(entry.count);
   const navigation=page.locator('.module-rail nav a,.next-links a');
   const before=await navigation.evaluateAll(es=>es.map(e=>({text:e.textContent,href:e.getAttribute('href')})));
   for(const width of [320,390,768,1280])for(const zoom of [1,2]){
    await page.setViewportSize({width,height:900});
    await page.evaluate(zoom=>document.documentElement.style.setProperty('font-size',`${zoom*100}%`,'important'),zoom);
    const dimensions=await page.evaluate(()=>({viewport:innerWidth,width:document.documentElement.scrollWidth}));
    expect(dimensions.width,`${entry.id} ${width}px ${zoom*100}%`).toBeLessThanOrEqual(dimensions.viewport);
    if(entry.id==='ceh-en' && width<=540){expect(await page.locator('.next-links').evaluate(e=>getComputedStyle(e).flexDirection)).toBe('column');}
    if(entry.id==='ceh-en' && width<=900){expect(await page.locator('.rail-content').evaluate(e=>parseFloat(getComputedStyle(e).maxHeight))).toBe(160*zoom);}

    expect(await links.evaluateAll(es=>es.filter(e=>e.scrollWidth>e.clientWidth+1).map(e=>e.textContent)),`rail must not clip text at ${width}px/${zoom}`).toEqual([]);
    const clipped=await page.locator('.next-links a').evaluateAll(es=>es.filter(e=>{const style=getComputedStyle(e);const range=document.createRange();range.selectNodeContents(e);return ['hidden','clip'].includes(style.overflowX)||style.textOverflow==='ellipsis'||[...range.getClientRects()].some(r=>r.left < -1 || r.right>innerWidth+1);}).map(e=>e.textContent));
    expect(clipped,`adjacent labels must remain fully visible at ${width}px/${zoom}`).toEqual([]);
    for(const link of await navigation.all()){
     await link.focus();await expect(link).toBeFocused();
     const bounds=await link.evaluate(e=>({left:e.getBoundingClientRect().left,right:e.getBoundingClientRect().right,width:innerWidth,outline:getComputedStyle(e).outlineStyle}));
     expect(bounds.left).toBeGreaterThanOrEqual(0);expect(bounds.right).toBeLessThanOrEqual(bounds.width+1);expect(bounds.outline).not.toBe('none');
    }
   }
   expect(await navigation.evaluateAll(es=>es.map(e=>({text:e.textContent,href:e.getAttribute('href')})))).toEqual(before);
   await page.setViewportSize({width:320,height:900});
   await links.first().focus();await page.locator('.module-rail').screenshot({path:`.local/aase/rail-fix/${entry.id}-${javaScriptEnabled}-rail.png`});await page.locator('.next-links').screenshot({path:`.local/aase/rail-fix/${entry.id}-${javaScriptEnabled}-adjacent.png`});await page.screenshot({path:`.local/aase/rail-fix/${entry.id}-${javaScriptEnabled}-zoom.png`,fullPage:true});
   await links.first().press('Enter');await expect(page).toHaveURL(entry.path.startsWith('/en')?'/en/courses/ceh/v13/':entry.id.startsWith('aase')?'/courses/aase/v1/':'/courses/ceh/v13/');
  }finally{await context.close();}
 });
}


test('all patched bilingual editions retain original publication dates in rendered metadata',async({request})=>{
 const manifest=JSON.parse(readFileSync('docs/releases/2026-11-05-course-navigation-versions.json','utf8'));
 for(const row of manifest.items)for(const path of [row.path,row.path.replace(/^\/en/,'')]){
  const response=await request.get(path);expect(response.status(),path).toBe(200);
  const html=await response.text();const metadata=html.match(/<p class="[^"]*article-metadata[^"]*"[^>]*>([\s\S]*?)<\/p>/)?.[1];
  expect(metadata,path+' metadata').toBeTruthy();
  expect(metadata).toContain('v'+row.after.contentVersion);
  const times=[...metadata!.matchAll(/<time datetime="([^"]+)"/g)].map(m=>m[1]);
  expect(times[0],path+' original publication').toBe(row.publishedOn);
  expect(times[1],path+' version revision').toBe(row.after[row.dateKey]);
 }
});
