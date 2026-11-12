/** Optional evidence capture; ordinary viewports only, separate from assertions. */
import {chromium} from '@playwright/test';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
const base=process.env.CEH_NOTES_BASE_URL||'http://127.0.0.1:4227';
const models=JSON.parse(readFileSync('docs/sources/ceh-notes/2026-11-12/c30-c38-supplement/diagrams.json','utf8')).diagrams;
const out=process.env.CEH_SOC_EVIDENCE_DIR||'.local/ceh-soc-diagrams';mkdirSync(out,{recursive:true});const images=[];
const browser=await chromium.launch({headless:true});
try{for(const lang of ['zh','en'])for(const width of [390,1280]){
 const page=await browser.newPage({viewport:{width,height:900}});await page.goto(base+(lang==='en'?'/en':'')+'/ceh-notes/2026-11-12/');await page.evaluate(async()=>{await document.fonts.ready;});
 for(const model of models){
  const figure=page.locator(`[data-diagram="${model[lang].name}"]`);
  const box=await figure.evaluate(el=>{const r=el.getBoundingClientRect();return {top:r.top+scrollY,height:r.height};});
  const offsets=[0];for(let y=700;y<box.height-100;y+=700)offsets.push(y);
  for(const [i,offset]of offsets.entries()){
   await page.evaluate(top=>scrollTo({top,behavior:'instant'}),Math.max(0,box.top+offset-40));
   const path=`${out}/${model[lang].name}-${lang}-${width}-viewport-${i+1}.png`;await page.screenshot({path,animations:'disabled'});images.push({name:model[lang].name,lang,width,offset,path});
  }
 }
 await page.close();
}writeFileSync(out+'/screenshots.json',JSON.stringify({base,images},null,2)+'\n');console.log(`Captured ${images.length} ordinary viewport screenshots`);}finally{await browser.close();}
