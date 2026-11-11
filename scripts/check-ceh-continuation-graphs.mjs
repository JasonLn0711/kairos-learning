import {chromium} from '@playwright/test';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const base=process.env.CEH_NOTES_BASE_URL||'http://127.0.0.1:4227';
const refs=JSON.parse(readFileSync('docs/sources/ceh-notes/2026-11-10/continuation-17-reference/reference-diagrams.json','utf8'));
const specs=JSON.parse(readFileSync('src/lib/note-diagram-specs.json','utf8'));
const out='.local/ceh-notes/hydrated-continuation';mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true});const results=[];
try{
 for(const lang of ['zh','en']){
  const page=await browser.newPage();
  for(const width of [320,390,768,1280])for(const scale of [1,2]){
   await page.setViewportSize({width,height:900});
   await page.goto(base+(lang==='en'?'/en':'')+'/ceh-notes/2026-11-10/');
   await page.locator('[data-diagram="soc"] .connections path').first().waitFor();
   await page.addStyleTag({content:'html{scroll-behavior:auto!important}'});
   if(scale===2)await page.evaluate(()=>document.documentElement.style.fontSize='32px');
   await page.waitForFunction(()=>{
    const graph=document.querySelector('[data-diagram="soc"] .graph');
    return Math.abs(graph.clientWidth-graph.querySelector('svg').viewBox.baseVal.width)<2;
   });
   await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   for(const r of refs){
    const name=r.text[lang].name,figure=page.locator(`[data-diagram="${name}"]`),spec=specs[name];
    if(spec.edges){
     await page.waitForFunction(({name,count})=>document.querySelectorAll(`[data-diagram="${name}"] .connections path`).length===count,{name,count:spec.edges.length});
     const geometry=await figure.evaluate((el,edges)=>{
      const graph=el.querySelector('.graph'),outer=graph.getBoundingClientRect();
      const nodes=[...graph.querySelectorAll('[data-node]')];
      const paths=[...graph.querySelectorAll('.connections path')];
      return edges.map(([a,b],i)=>{
       const start=paths[i].getPointAtLength(0),x=nodes.find(n=>+n.dataset.node===a).getBoundingClientRect();
       const dest=nodes.find(n=>+n.dataset.node===b).getBoundingClientRect();
       const numbers=paths[i].getAttribute('d').match(/-?\d+(?:\.\d+)?/g).map(Number);
       const sx=start.x+outer.left,sy=start.y+outer.top;
       const startsOnNode=(Math.abs(sy-x.bottom)<2&&sx>=x.left&&sx<=x.right)||(Math.abs(sx-x.right)<2&&sy>=x.top&&sy<=x.bottom);
       // The first arrow-tip is the endpoint of the first continuous line, before its arrowhead.
       const line=paths[i].getAttribute('d').split('m')[0],commands=[...line.matchAll(/([MHV])([^MHV]+)/g)];
       let tx=0,ty=0;
       for(const [,cmd,args] of commands){const n=args.trim().split(/[ ,]+/).map(Number);if(cmd==='M'){[tx,ty]=n;}else if(cmd==='H')tx=n[0];else ty=n[0];}
       tx+=outer.left;ty+=outer.top;
       const endsOnNode=(Math.abs(ty-dest.top)<2&&tx>=dest.left&&tx<=dest.right)||(Math.abs(tx-dest.left)<2&&ty>=dest.top&&ty<=dest.bottom);
       const crossedNodes=[];
       for(let distance=1;distance<paths[i].getTotalLength();distance+=12){
        const point=paths[i].getPointAtLength(distance),px=point.x+outer.left,py=point.y+outer.top;
        for(const node of nodes){
         const id=+node.dataset.node;if(id===a||id===b)continue;
         const rect=node.getBoundingClientRect();
         if(px>rect.left+2&&px<rect.right-2&&py>rect.top+2&&py<rect.bottom-2)crossedNodes.push(id);
        }
       }
       return {a,b,startsOnNode,endsOnNode,crossedNodes,finite:numbers.every(Number.isFinite)};
      });
     },spec.edges);
     assert.ok(geometry.every(g=>g.startsOnNode&&g.endsOnNode&&g.finite&&!g.crossedNodes.length),JSON.stringify({lang,width,scale,name,geometry}));
     assert.equal(await figure.locator('.relations li').count(),spec.edges.length);
     assert.equal(await figure.locator('.connections text').count(),spec.edges.filter(edge=>edge[2]).length,'Every conditional/shared-secret edge keeps its visible label');
    }
    if(name==='certificate'&&width===1280&&scale===1){
     const noteBoxes=await figure.evaluate(el=>{
      const sequence=el.querySelector('.sequence').getBoundingClientRect();
      return [...el.querySelectorAll('.sequence .local')].map(node=>{const box=node.getBoundingClientRect();return {left:(box.left-sequence.left)/sequence.width,width:box.width/sequence.width};});
     });
     for(const [i,[left,width]] of [[0,2/3],[2/3,1/3],[1/3,2/3]].entries()){
      assert.ok(Math.abs(noteBoxes[i].left-left)<.005&&Math.abs(noteBoxes[i].width-width)<.005,'TLS annotation must cover only its participating roles');
     }
     const asset=await page.request.get(new URL(await figure.locator('a[download]').getAttribute('href'),page.url()).href);
     const svg=await asset.text();
     const endpoints=await page.evaluate(markup=>{
      const doc=new DOMParser().parseFromString(markup,'image/svg+xml');
      const boxes=[...doc.querySelectorAll('rect[fill="#e6f5ec"]')];
      const lines=[...doc.querySelectorAll('path[stroke="#a2aaa6"]')];
      return boxes.map((rect,i)=>{
       const [x,y]=lines.find(line=>+line.getAttribute('d').match(/^M([\d.]+)/)[1]===+rect.getAttribute('x')+134).getAttribute('d').match(/^M([\d.]+) ([\d.]+)/).slice(1).map(Number);
       return Math.abs(x-(+rect.getAttribute('x')+134))<.1&&Math.abs(y-(+rect.getAttribute('y') + +rect.getAttribute('height')))<.1;
      });
     },svg);
     assert.deepEqual(endpoints,[true,true,true],'Every CA/server/browser SVG lifeline must touch its own role box');
     for(const [x,w] of [[28,556],[604,268],[316,556]])assert.ok(svg.includes(`x="${x}"`)&&svg.includes(`width="${w}"`),'TLS SVG annotation boundaries');
    }
    if(name==='bytes')assert.deepEqual(await figure.locator('.bytes').evaluateAll(grids=>grids.map(g=>g.children.length)),[16,32]);
    if(name==='hidden')assert.equal(await figure.locator('.outer>.node').count(),1);
    if((width===320||width===1280)&&scale===1){
     await figure.evaluate(el=>el.scrollIntoView({behavior:'instant',block:'start'}));
     // Capture explicit viewport positions so tall figures do not require element auto-scrolling.
     await page.screenshot({path:`${out}/${name}-${lang}-${width}.png`});
     const height=await figure.evaluate(el=>el.getBoundingClientRect().height);
     if(height>900){
      await figure.evaluate(el=>el.scrollIntoView({behavior:'instant',block:'end'}));
      await page.screenshot({path:`${out}/${name}-${lang}-${width}-end.png`});
     }
    }
   }
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   assert.equal(await page.locator('h2[id^="p2-cont"],h2[id^="p3-cont"]').count(),0,'Continuation subheadings must stay below the section heading');
   assert.ok(await page.locator('h4[id^="p2-cont-u"]').count()>7);
   for(const part of [2,3]){
    const id=part===2?'p2-cont-u269':'p3-cont-u338';
    const exercise=page.locator('#'+id).locator('..');
    assert.equal(await exercise.locator('form,input,button,details').count(),0,'Original exercise must not expose an answer key or submission UI');
   }
   results.push({lang,width,scale,figures:17,graphEndpoints:true});
   console.log(`PASS hydrated continuation: ${lang}, ${width}px, ${scale*100}%`);
  }
  await page.close();
 }
 writeFileSync(`${out}/result.json`,JSON.stringify({base,results},null,2)+'\n');
}finally{await browser.close();}
