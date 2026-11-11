// Render the actual Svelte components in an isolated fixture; never mutate canonical content.
// Vite/SvelteKit may refresh generated files: finish this check before the final production build.
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {createServer as httpServer} from 'node:http';
import {spawnSync} from 'node:child_process';
import {createServer} from 'vite';
import {compile} from 'svelte/compiler';
import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';

const output=resolve('.local/ceh-notes/continuation-diagrams');mkdirSync(output,{recursive:true});
const refs=JSON.parse(readFileSync('docs/sources/ceh-notes/2026-11-10/continuation-17-reference/reference-diagrams.json','utf8'));
const note=JSON.parse(readFileSync('content/ceh-notes/2026-11-10.json','utf8'));
const all=refs;
const exporter=spawnSync('python3',['-c',`import sys,json\nfrom pathlib import Path\nsys.path.insert(0,'scripts')\nfrom ceh_notes_svg import render\nrefs=json.load(open('docs/sources/ceh-notes/2026-11-10/continuation-17-reference/reference-diagrams.json'))\nn=json.load(open('content/ceh-notes/2026-11-10.json'))\nfor lang in ['zh','en']:\n cia=next(b for s in n['parts'][0]['text'][lang]['sections'] for b in s['body'] if b['kind']=='figure' and b['name']=='cia')\n Path('${output}/cia-'+lang+'.svg').write_bytes(render(cia,lang))\n for r in refs: Path('${output}/'+r['text'][lang]['name']+'-'+lang+'.svg').write_bytes(render(r['text'][lang],lang))`],{encoding:'utf8',env:{...process.env,PYTHONUTF8:'1'}});
assert.equal(exporter.status,0,exporter.stderr);
const vite=await createServer({server:{middlewareMode:true}});
let css='',bodies={};
try{
 const {render}=await vite.ssrLoadModule('svelte/server');
 const components={};
 for(const name of ['NoteDiagram','NoteContinuationDiagram']){
  const filename=resolve(`src/lib/components/${name}.svelte`);
  components[name]=(await vite.ssrLoadModule(filename)).default;
  css+=compile(readFileSync(filename,'utf8'),{filename}).css.code;
 }
 for(const lang of ['zh','en']){
  bodies[lang]=all.map(r=>render(components.NoteDiagram,{props:{diagram:r.text[lang],date:note.date,part:r.part,lang}}).body).join('\n');
  const html=`<!doctype html><html lang="${lang}"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Reference diagram fixture</title><style>html{font:16px/1.8 Arial,sans-serif;color:#18252c}body{margin:0}main{max-width:900px;margin:auto;padding:12px;box-sizing:border-box}*{box-sizing:border-box}a{color:#175f91}:focus-visible{outline:3px solid #175f91;outline-offset:3px}${css}</style><main>${bodies[lang]}</main></html>`;
  writeFileSync(`${output}/${lang}.html`,html);
 }
}finally{await vite.close();}

const server=httpServer((req,res)=>{
 const path=new URL(req.url,'http://localhost').pathname;
 let file;
 if(path==='/zh.html'||path==='/en.html')file=path.slice(1);
 else if(/^\/images\/ceh-notes\/2026-11-10-part-[23]-[a-z]+-(zh|en)\.svg$/.test(path))file=path.match(/part-[23]-(.+)$/)[1];
 else if(/^\/[a-z]+-(zh|en)\.svg$/.test(path))file=path.slice(1);
 if(!file){res.writeHead(404);res.end();return;}
 try{res.setHeader('Content-Type',file.endsWith('.svg')?'image/svg+xml':'text/html; charset=utf-8');res.end(readFileSync(`${output}/${file}`));}catch{res.writeHead(404);res.end();}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const base=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({headless:true});
const results=[];
try{
 for(const lang of ['zh','en']){
  const page=await browser.newPage({javaScriptEnabled:false});page.setDefaultTimeout(15000);
  for(const width of [320,390,768,1280])for(const zoom of [1,2]){
   await page.setViewportSize({width,height:900});await page.goto(`${base}/${lang}.html`);
   // addStyleTag waits for an event that cannot fire with page JavaScript disabled.
   if(zoom===2)await page.evaluate(()=>{document.documentElement.style.fontSize='32px';});
   const overflow=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:innerWidth}));
   assert.ok(overflow.scroll<=overflow.width,JSON.stringify({lang,width,zoom,overflow}));
   assert.equal(await page.locator('figure').count(),17);
   for(const r of all){
    const figure=page.locator(`[data-diagram="${r.text[lang].name}"]`);

    const text=await figure.innerText();
    const normalize=s=>s.replace(/\s+/g,' ').trim();
    for(const item of r.text[lang].items){assert.ok(normalize(text).includes(normalize(item.title.replace(/^([CIA]) · /,''))),`${r.reference}: ${item.title}`);assert.ok(normalize(text).includes(normalize(item.body)),`${r.reference}: ${item.body}`);}
    const size=await figure.locator('p').first().evaluate(el=>({font:parseFloat(getComputedStyle(el).fontSize),line:parseFloat(getComputedStyle(el).lineHeight)}));
    assert.ok(size.font>=16&&size.line/size.font>=1.7,JSON.stringify(size));
    const link=figure.locator('a[download]');const response=await page.request.get(new URL(await link.getAttribute('href'),base).href);assert.equal(response.status(),200);
    assert.ok((await figure.locator('a:not([download])').getAttribute('href')).endsWith(`/continuation-17-reference/image-${r.reference}.png`));
    assert.ok((await response.body()).equals(readFileSync(`${output}/${r.text[lang].name}-${lang}.svg`)));
    if((width===320||width===1280)&&zoom===1)await figure.screenshot({path:`${output}/image-${r.reference}-${lang}-${width}.png`});
   }
   if((width===320||width===1280)&&zoom===1)await page.screenshot({path:`${output}/${lang}-${width}.png`,fullPage:true});
   if(width===320&&zoom===1){
    await page.keyboard.press('Tab');assert.equal(await page.locator(':focus').getAttribute('download'),'');
    await page.keyboard.press('Tab');await page.keyboard.press('Shift+Tab');
    assert.equal(await page.locator(':focus').getAttribute('href'),`/images/ceh-notes/${note.date}-part-2-authorization-${lang}.svg`);
   }
   results.push({lang,width,textScale:zoom,figures:17,noPageOverflow:true,noJavaScript:true,downloadsMatched:true});
   console.log(`${lang}: ${width}px, ${zoom*100}% text passed`);
  }
  for(const r of all){
   const name=r.text[lang].name;await page.goto(`${base}/${name}-${lang}.svg`);
   const issues=await page.evaluate(()=>{
    const svg=document.querySelector('svg'),v=svg.viewBox.baseVal;
    const texts=[...document.querySelectorAll('text')].map(el=>({text:el.textContent,box:el.getBBox()}));
    const outside=texts.filter(({box:b})=>b.x<0||b.y<0||b.x+b.width>v.width+1||b.y+b.height>v.height+1).map(x=>x.text);
    const overlaps=[];
    for(let i=0;i<texts.length;i++)for(let j=i+1;j<texts.length;j++){
      const a=texts[i].box,b=texts[j].box;
      if(Math.min(a.x+a.width,b.x+b.width)-Math.max(a.x,b.x)>1&&Math.min(a.y+a.height,b.y+b.height)-Math.max(a.y,b.y)>1)overlaps.push([texts[i].text,texts[j].text]);
    }
    return {outside,overlaps};
   });
   assert.deepEqual(issues,{outside:[],overlaps:[]},`${name}-${lang} SVG text bounds/overlap`);
   assert.ok(readFileSync(`${output}/${name}-${lang}.svg`).byteLength<100000);
  }
  await page.close();
 }
 writeFileSync(`${output}/result.json`,JSON.stringify({scope:'17 continuation diagrams: SSR/no-JS fixture, not hydrated or production acceptance',results,svgFiles:34},null,2)+'\n');
 console.log(`Passed ${results.length} responsive/no-JS cases and 34 SVG bounds/download checks. Evidence: ${output}`);
}finally{await browser.close();await new Promise(r=>server.close(r));}
