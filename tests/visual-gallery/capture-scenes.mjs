import {chromium} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const origin=process.env.VISUAL_ORIGIN??'http://127.0.0.1:4618';
const phase=process.argv[2]??'05';
const dir='.local/interactive-v2/task'+phase;
const full=phase==='07'||phase==='08';
const receipts=[];
await mkdir(dir,{recursive:true});
const browser=await chromium.launch({channel:'chrome'});
const samples=[
 ['request','/interactive/system-design/request-lifecycle/',[1,2,5,8,10]],
 ['softmax','/interactive/aase/m02/m02-01/softmax-weighted-sum/',[1,2,3]],
 ['gates','/interactive/aase/m02/m02-06/four-gates/',[1,2,3]]
];
try {
 for(const lang of ['zh','en']){
 const page=await browser.newPage({reducedMotion:'reduce'});
 for(const [width,height] of full?[[1280,720],[1366,768],[1440,900],[1920,1080],[768,900],[390,844],[320,568],[720,450]]:[[1440,900],[390,844]]){
 await page.setViewportSize({width,height});
 for(const [id,path,steps] of samples){
 const base=origin+(lang==='en'?'/en':'')+path;
 await page.goto(base);
 await page.locator(id==='request'?'.immersive-lesson.focus':'.chapter-svg[data-view=scene]').waitFor();
 for(const step of steps){
 if(id==='request' && step!==1)await page.locator('.step-select select').evaluate((s,step)=>{s.value=String(step);s.dispatchEvent(new Event('change',{bubbles:true}));},step);
 if(id!=='request'){
   const slug=path.split('/').filter(Boolean).at(-1);
   await page.goto(base.slice(0,-slug.length-1)+'#'+slug+'-0'+step);
   await page.locator('.chapter-svg[data-view=scene]').waitFor();
 }else await page.locator('.workspace[data-step="'+step+'"]').waitFor();
 await page.evaluate(()=>document.fonts.ready);
 for(const variant of (id==='request' && (step===2||step===8))?['normal','alternate']:['normal']){
 if(variant==='alternate') await page.locator('.variation input').last().check();
 const metric=await page.evaluate(()=>{
 const box=s=>{const r=document.querySelector(s)?.getBoundingClientRect();return r?[r.x,r.y,r.width,r.height].map(Math.round):null};
 return {doc:[document.documentElement.scrollWidth,document.documentElement.scrollHeight],stage:box('.scene-body,.chart'),controls:box('.lesson-controls,.controls'),title:box('.explanation h2,aside h2'),step:document.querySelector('.workspace')?.getAttribute('data-step-id')??location.hash,output:document.querySelector('.learning-stage output')?.textContent,route:document.querySelector('svg:not(.compact-svg) desc')?.textContent};
 });
 assert.equal(metric.doc[0],width,JSON.stringify({id,lang,width,step,metric}));
 if(width>=1120 && id==='request'){
 assert.ok(metric.doc[1]<=height+1,JSON.stringify({id,lang,width,step,metric}));
 for(const b of [metric.stage,metric.controls,metric.title])assert.ok(b && b[1]>=0 && b[1]+b[3]<=height+1,JSON.stringify({id,lang,width,step,b}));
 }
 const name=[id,lang,width,step,variant].join('-')+'.png';
 const data=await page.screenshot({path:dir+'/'+name,fullPage:width<1120});
 receipts.push({name,url:page.url(),width,height,lang,step,variant,...metric,utc:new Date().toISOString(),sha256:createHash('sha256').update(data).digest('hex')});
 }
 }
 }
 }
 await page.close();
 }
}finally{await browser.close();await writeFile(dir+'/scenes.json',JSON.stringify(receipts,null,2));console.log(receipts.length+' frames')}
