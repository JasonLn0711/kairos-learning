import {chromium} from '@playwright/test';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const load=async name=>JSON.parse(await readFile('content/interactive/aase-m02/'+name+'.json','utf8'));
const chapters=await load('manifest');
const dir=process.env.VISUAL_EVIDENCE_DIR??'.local/interactive-v2/task08/chapters';
const origin=process.env.VISUAL_ORIGIN??'http://127.0.0.1:4619';
await mkdir(dir,{recursive:true});
const browser=await chromium.launch({channel:'chrome'});
try{
 for(const {id,slugs} of chapters){
 const units=await load(id);assert.deepEqual(units.map(u=>u.slug),slugs);
 const receipts=[];
 for(const lang of ['zh','en']){
 const p=await browser.newPage({viewport:{width:1280,height:720},reducedMotion:'reduce'});
 for(const [unitIndex,unit] of units.entries()){
  const url=origin+(lang==='en'?'/en':'')+'/interactive/aase/m02/'+id+'/';
  await p.goto(url);
  await p.locator('.chapter-svg').waitFor();
  for(const [i,scene] of unit.scenes.entries()){
   await p.goto(url+'#'+unit.slug+'-'+scene.id);
   const stage=p.locator('.learning-stage');await stage.waitFor();
   assert.equal(await stage.getAttribute('data-renderer'),scene.demo??scene.visual??scene.kind);
   assert.equal(await p.locator('[data-panel="'+unit.slug+'-'+scene.id+'"] [data-flow] > title').textContent(),scene.title[lang]);
   assert.equal(await p.locator('aside a').getAttribute('href').then(h=>h.split('#').at(-1)),scene.sourceAnchors[0]);
   assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth),1280);
   const selector=stage.locator('.choice select');
   if(await selector.count() && scene.choices.length>1){
    await selector.selectOption('1');assert.equal(await stage.locator('output').textContent(),scene.choices[1].result[lang]);
   }
   const name=[id,unit.slug,lang,scene.id].join('-')+'.png';
   const png=await p.locator('.desk-art').screenshot({path:dir+'/'+name});
   receipts.push({name,url:p.url(),lang,scene:scene.id,slug:unit.slug,renderer:await stage.getAttribute('data-renderer'),utc:new Date().toISOString(),sha256:createHash('sha256').update(png).digest('hex')});
  }
 }
 await p.close();
 }
 await writeFile(dir+'/'+id+'.json',JSON.stringify(receipts,null,2));console.log(id,receipts.length);
 }
}finally{await browser.close()}
