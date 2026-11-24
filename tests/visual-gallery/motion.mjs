import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome'});
const dir='.local/interactive-v2/task06';
try {
 const p=await browser.newPage({viewport:{width:1440,height:900}});
 await p.clock.install();
 await p.goto('http://127.0.0.1:4618/interactive/system-design/request-lifecycle/?step=5');
 await p.locator('.learning-desk[data-step="5"]').waitFor();
 await p.clock.pauseAt(new Date(await p.evaluate(()=>Date.now()+1000)));
 await p.getByRole('button',{name:'重播',exact:true}).evaluate(b=>b.click());
 await p.clock.runFor(16);
 const data=[];
 for(const [name,delta] of [['start',0],['mid',325],['end',335]]){
   if(delta)await p.clock.runFor(delta);
   const marker=p.locator('svg.wide-svg [data-packet]');
   data.push({name,ms:data.reduce((n,r)=>Math.max(n,r.ms),0)+delta,position:await marker.getAttribute('transform')});
   await p.screenshot({path:dir+'/'+name+'.png'});
 }
 assert.equal(new Set(data.map(r=>r.position)).size,3);
 await writeFile(dir+'/clock.json',JSON.stringify(data,null,2));console.log(data);
}finally{await browser.close()}
