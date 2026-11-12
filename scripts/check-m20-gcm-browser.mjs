import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
const base=process.env.M20_REVIEW_BASE_URL||'http://127.0.0.1:4256';
const out=process.env.M20_GCM_OUTPUT||'.local/m20-gcm';mkdirSync(out,{recursive:true});
const data=JSON.parse(readFileSync('content/ceh-m20-review.json','utf8'));
const figure=data.sections.flatMap(s=>s.body).find(b=>b.kind==='diagram'&&b.name==='m20gcmflow');
assert.ok(figure,'GCM model must be adopted into the formal body');
const spec=JSON.parse(readFileSync('src/lib/note-diagram-specs.json','utf8')).m20gcmflow;
const norm=s=>s.replace(/\s+/g,'');
const browser=await chromium.launch({headless:true});const checks=[];
try{
 for(const javaScriptEnabled of [true,false])for(const width of [320,390,768,1280])for(const scale of [1,2]){
  const ctx=await browser.newContext({javaScriptEnabled,viewport:{width,height:900},acceptDownloads:true});const page=await ctx.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(String(e)));const response=await page.goto(base+'/ceh-notes/m20-cryptography/');assert.equal(response.status(),200);
  await page.evaluate(scale=>document.documentElement.style.fontSize=scale*100+'%',scale);await page.evaluate(()=>document.fonts.ready);
  const f=page.locator('[data-diagram="m20gcmflow"]');assert.equal(await f.count(),1);
  if(javaScriptEnabled)await page.waitForFunction(()=>document.querySelectorAll('[data-diagram="m20gcmflow"] .connections path').length===7);
  const text=norm(await f.innerText());for(const t of [figure.caption,figure.description,...figure.items.flatMap(i=>[i.title,i.body])])assert.ok(text.includes(norm(t)),`Missing figure text ${t}`);
  assert.equal(await f.locator('[data-node]').count(),7);
  assert.equal(await f.locator('.relations li').count(),7);
  const roleColors=await f.locator('[data-node]').evaluateAll(nodes=>nodes.map(n=>({fill:getComputedStyle(n).backgroundColor,stroke:getComputedStyle(n).borderTopColor})));
  assert.deepEqual(roleColors,[
   {fill:'rgb(233, 242, 250)',stroke:'rgb(164, 197, 225)'},{fill:'rgb(233, 242, 250)',stroke:'rgb(164, 197, 225)'},
   {fill:'rgb(246, 247, 248)',stroke:'rgb(203, 209, 213)'},{fill:'rgb(246, 247, 248)',stroke:'rgb(203, 209, 213)'},
   {fill:'rgb(246, 247, 248)',stroke:'rgb(203, 209, 213)'},{fill:'rgb(230, 245, 236)',stroke:'rgb(184, 213, 197)'},
   {fill:'rgb(251, 238, 238)',stroke:'rgb(217, 164, 164)'},
  ]);
  const geometry=await f.evaluate(el=>{
   const nodes=[...el.querySelectorAll('[data-node]')].map(n=>{const b=n.getBoundingClientRect();return {id:Number(n.dataset.node),x:b.x,y:b.y,w:b.width,h:b.height};});
   const pairs=[];for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++){const a=nodes[i],b=nodes[j];if(Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x)>1&&Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y)>1)pairs.push([a.id,b.id]);}
   const fonts=[...el.querySelectorAll('.node p')].map(n=>{const s=getComputedStyle(n);return {size:parseFloat(s.fontSize),line:parseFloat(s.lineHeight)};});
   return {nodes,pairs,fonts,overflow:document.documentElement.scrollWidth>innerWidth};
  });
  assert.equal(geometry.overflow,false,`${width}/${scale}/JS=${javaScriptEnabled} overflow`);assert.deepEqual(geometry.pairs,[],'Nodes must not overlap');
  for(const font of geometry.fonts){assert.ok(font.size>=16*scale);assert.ok(font.line/font.size>=1.7);}
  for(const [a,b] of [[2,3],[5,6]]){const x=geometry.nodes[a],y=geometry.nodes[b];if(Math.abs(x.y-y.y)<2)assert.ok(x.x+x.w<=y.x+1);else assert.ok(x.y+x.h<=y.y+1);}
  if(javaScriptEnabled){
   const endpoints=await f.evaluate((el,edges)=>{
    const graph=el.querySelector('.graph'),outer=graph.getBoundingClientRect();const nodes=[...el.querySelectorAll('[data-node]')].map(n=>n.getBoundingClientRect());
    return [...el.querySelectorAll('.connections path')].map((path,i)=>{const [a,b]=edges[i],from=nodes[a],to=nodes[b],line=path.getAttribute('d').split('m')[0],numbers=line.match(/-?\d+(?:\.\d+)?/g).map(Number);const sx=numbers[0],sy=numbers[1],horizontal=Math.abs(from.top-to.top)<2,tx=horizontal?numbers.at(-1):numbers.at(-2),ty=horizontal?sy:numbers.at(-1);const near=(a,b)=>Math.abs(a-b)<1;const start=(near(sx,from.right-outer.left)&&near(sy,from.top+from.height/2-outer.top))||(near(sx,from.left+from.width/2-outer.left)&&near(sy,from.bottom-outer.top));const end=horizontal?near(tx,to.left-outer.left)&&near(ty,to.top+to.height/2-outer.top):near(tx,to.left+to.width/2-outer.left)&&near(ty,to.top-outer.top);return {from:a,to:b,start,end};});
   },spec.edges);assert.ok(endpoints.every(e=>e.start&&e.end),JSON.stringify(endpoints));
  }
  const ref=await f.locator('a').last().getAttribute('href');assert.ok(ref.endsWith('/four-concepts-supplement/image-1.png'));
  assert.deepEqual(errors,[]);
  if(javaScriptEnabled&&[390,1280].includes(width)){
   for(const index of [0,4]){await f.locator(`[data-node="${index}"]`).scrollIntoViewIfNeeded();await page.screenshot({path:`${out}/gcm-${width}-${scale}x-node${index}.png`});}
  }
  checks.push({width,scale,javaScriptEnabled,nodes:7,relations:7,bodyText:true,noOverlap:true,noOverflow:true,endpoints:javaScriptEnabled?'verified':'textual fallback'});await ctx.close();
 }
 const ctx=await browser.newContext({acceptDownloads:true});const page=await ctx.newPage();await page.goto(base+'/ceh-notes/m20-cryptography/');const link=page.locator('[data-diagram="m20gcmflow"] a[download]');
 await link.focus();assert.ok(await link.evaluate(el=>el===document.activeElement));await page.keyboard.press('Tab');await page.keyboard.press('Shift+Tab');assert.ok(await link.evaluate(el=>el===document.activeElement));
 const downloadEvent=page.waitForEvent('download');await page.keyboard.press('Enter');const download=await downloadEvent;const file=await download.path();const href=await link.getAttribute('href');const expected=readFileSync('site'+href);assert.deepEqual(readFileSync(file),expected);
 const response=await ctx.request.get(base+href);assert.equal(response.status(),200);assert.deepEqual(await response.body(),expected);assert.ok(expected.length<100000);
 await page.goto(base+href);const svgGeometry=await page.evaluate(()=>{const r=document.documentElement,v=r.viewBox.baseVal;const boxes=[...r.querySelectorAll('text')].map(t=>{const b=t.getBBox();return {text:t.textContent,x:b.x,y:b.y,w:b.width,h:b.height};});const outside=boxes.filter(b=>b.x<0||b.y<0||b.x+b.w>v.width||b.y+b.h>v.height);const overlaps=[];for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){const a=boxes[i],b=boxes[j];if(Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x)>1&&Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y)>1)overlaps.push([a.text,b.text]);}return {outside,overlaps,text:r.textContent};});assert.deepEqual(svgGeometry.outside,[]);assert.deepEqual(svgGeometry.overlaps,[]);
 for(const t of [figure.caption,figure.description,...figure.items.flatMap(i=>[i.title,i.body])])assert.ok(norm(svgGeometry.text).includes(norm(t)),`SVG missing ${t}`);
 const index=await ctx.request.get(base+'/search-index.json');const entries=await index.json();const indexText=norm(entries.find(e=>e.id==='CEH-M20-REVIEW').text);for(const t of figure.items.flatMap(i=>[i.title,i.body]))assert.ok(indexText.includes(norm(t)),`Search missing ${t}`);
 await ctx.close();writeFileSync(out+'/result.json',JSON.stringify({base,checks,keyboardDownload:true,svg:{exactBytes:true,bytes:expected.length,bounds:true,noTextOverlap:true},search:true,scope:'GCM diagram article QA; not live cryptographic execution or learner acceptance'},null,2)+'\n');console.log(JSON.stringify({passed:checks.length,keyboardDownload:true,svg:true,base}));
}finally{await browser.close();}
