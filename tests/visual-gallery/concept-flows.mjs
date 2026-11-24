import {chromium} from '@playwright/test';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';

const root=process.env.VISUAL_ORIGIN??'http://127.0.0.1:4652';
const dir=process.env.VISUAL_EVIDENCE_DIR??'.local/aase-concept-flows';
const widths=process.argv.length>2?process.argv.slice(2).map(Number):[1280,768,390,320];
assert.ok(widths.every(width=>Number.isInteger(width) && width>0));
const chapters=await read('manifest');
const failures=[];
async function read(key){
  return JSON.parse(await readFile('content/interactive/aase-m02/'+key+'.json','utf8'));
}
const browser=await chromium.launch();
try{
  for(const width of widths)for(const lang of ['zh','en']){
    const receipts=[];
    const folder=dir+'/'+lang+'-'+width;
    await mkdir(folder,{recursive:true});
    const page=await browser.newPage({viewport:{width,height:width===768?1024:width<768?844:720},reducedMotion:'reduce'});
    for(const chapter of chapters){
      const path=(lang==='en'?'/en':'')+'/interactive/aase/m02/'+chapter.id+'/';
      await page.goto(root+path);
      for(const [unitIndex,unit] of (await read(chapter.id)).entries()){
      for(const [index,scene] of unit.scenes.entries()){
        await page.locator('.controls select').selectOption(String(unitIndex*3+index));
        const diagram=page.locator('[data-panel="'+unit.slug+'-'+scene.id+'"]');
        await page.waitForURL(root+path+'#'+unit.slug+'-'+scene.id);
        await page.locator('[data-panel="'+unit.slug+'-'+scene.id+'"][aria-hidden=false]').waitFor();
        const stage=page.locator('.learning-stage');
        const label=await diagram.locator('[data-flow] > title').textContent();
        assert.equal(label,scene.title[lang]);
        const select=stage.locator('.choice select');
        if(await select.count()){
          for(const [i,choice] of scene.choices.entries()){
            await select.selectOption(String(i));
            assert.equal(await stage.locator('output').innerText(),choice.result[lang]);
          }
        }
        const bounds=await diagram.evaluate(panel=>{
          const box=panel.querySelector('.panel').getBoundingClientRect();
          const outside=[...panel.querySelectorAll('text,dt,dd,.observation,.panel-title')].filter(el=>{
            const rect=el.getBoundingClientRect();
            return rect.left<box.left-2 || rect.right>box.right+2 || rect.top<box.top-2 || rect.bottom>box.bottom+2;
          }).map(el=>el.textContent);
          return {outside,page:document.documentElement.scrollWidth};
        });
        if(bounds.page>width+1 || bounds.outside.length)failures.push({path,index,width,...bounds});
        const name=unit.slug+'-'+scene.id+'.png';
        const image=await diagram.screenshot({path:folder+'/'+name});
        receipts.push({path,scene:scene.id,title:label,objects:await diagram.locator('[data-object]').count(),name,sha256:createHash('sha256').update(image).digest('hex')});
      }
    }
    }
    await page.close();
    await writeFile(folder+'/receipts.json',JSON.stringify(receipts,null,2));
    console.log(lang,width,receipts.length,'scenes;',failures.length,'cumulative layout failures');
  }
}finally{await browser.close();}
await writeFile(dir+'/layout.json',JSON.stringify(failures,null,2));
assert.equal(failures.length,0,'See '+dir+'/layout.json');
