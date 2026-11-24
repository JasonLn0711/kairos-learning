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
    for(const chapter of chapters)for(const unit of await read(chapter.id)){
      const path=(lang==='en'?'/en':'')+'/interactive/aase/m02/'+chapter.id+'/'+unit.slug+'/';
      await page.goto(root+path);
      await page.locator('main.focus').waitFor();
      for(const [index,scene] of unit.scenes.entries()){
        await page.locator('.concept-controls select').selectOption(String(index+1));
        const diagram=page.locator('figure[data-flow="'+unit.slug+'"][data-scene="'+scene.id+'"]');
        await diagram.waitFor();
        const stage=page.locator('.learning-stage');
        const label=await diagram.locator('svg > title').textContent();
        assert.equal(label,scene.title[lang]);
        const select=stage.locator('.choice select');
        if(await select.count()){
          for(const [i,choice] of scene.choices.entries()){
            await select.selectOption(String(i));
            assert.equal(await stage.locator('output').innerText(),choice.result[lang]);
          }
        }
        const bounds=await stage.evaluate(node=>{
          const frame=node.getBoundingClientRect();
          const figure=node.querySelector('figure[data-flow] svg');
          const svgBounds=figure.getBoundingClientRect();
          const outside=[...figure.querySelectorAll('text')].filter(text=>{
            const b=text.getBoundingClientRect();
            return b.left<svgBounds.left-1 || b.right>svgBounds.right+1 || b.top<svgBounds.top-1 || b.bottom>svgBounds.bottom+1;
          }).map(text=>text.textContent);
          return {
            outside,page:document.documentElement.scrollWidth, height:document.documentElement.scrollHeight,
            clipped:[...node.querySelectorAll('label,dt,dd,output,figure[data-flow]')].filter(el=>{
              const b=el.getBoundingClientRect();return b.width>0&&(b.right>frame.right+2||b.left<frame.left-2||b.bottom>frame.bottom+2);
            }).map(el=>el.tagName+':'+el.textContent.trim().slice(0,22))
          };
        });
        if(bounds.page>width+1 || bounds.outside.length || bounds.clipped.length || (width===1280 && bounds.height>722)){
          failures.push({path,index,width,...bounds});
        }
        const name=unit.slug+'-'+scene.id+'.png';
        const image=await diagram.screenshot({path:folder+'/'+name});
        receipts.push({path,scene:scene.id,title:label,objects:await diagram.locator('[data-object]').count(),name,sha256:createHash('sha256').update(image).digest('hex')});
      }
    }
    await page.close();
    await writeFile(folder+'/receipts.json',JSON.stringify(receipts,null,2));
    console.log(lang,width,receipts.length,'scenes;',failures.length,'cumulative layout failures');
  }
}finally{await browser.close();}
await writeFile(dir+'/layout.json',JSON.stringify(failures,null,2));
assert.equal(failures.length,0,'See '+dir+'/layout.json');
