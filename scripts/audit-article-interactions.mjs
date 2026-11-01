import { chromium } from '@playwright/test';
import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import {createServer} from 'node:http';
import {resolve,extname} from 'node:path';
const root=resolve('build');
async function scan(dir){const out=[];for(const e of await readdir(dir,{withFileTypes:true})){const p=dir+'/'+e.name;if(e.isDirectory())out.push(...await scan(p));else if(e.name.endsWith('.html')&&e.name!=='404.html')out.push(p)}return out}
const files=await scan(root);const dir='.local/article-audit';await mkdir(dir,{recursive:true});
const server=createServer(async(req,res)=>{try{let p=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!p.startsWith(root+'/'))p=root+'/index.html';if(!extname(p))p+='/index.html';const body=await readFile(p);res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml'})[extname(p)]??'application/octet-stream');res.end(body)}catch{res.statusCode=404;res.end()}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const base=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({channel:'chrome',headless:true});const results=[];
try{for(const file of files){const url='/'+file.slice(root.length+1);const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:900}});const page=await context.newPage();await page.goto(base+url);const text=await page.locator('body').innerText();await page.keyboard.press('Tab');const focus=await page.evaluate(()=>({tag:document.activeElement?.tagName,outline:document.activeElement?getComputedStyle(document.activeElement).outlineStyle:null}));let disclosure=null;const summary=page.locator('summary').first();if(await summary.count()){await summary.focus();await page.keyboard.press('Enter');disclosure=await summary.evaluate(e=>e.parentElement.open)}results.push({url,noJavaScriptTextPresent:text.trim().length>100,firstKeyboardFocus:focus,firstDisclosureOpened:disclosure,manual:'pending full keyboard journey and visual review'});await context.close();if(results.length%20===0)console.log(`${results.length}/${files.length} interaction pages`)}
}finally{await browser.close();server.close()}
await writeFile(`${dir}/interaction-results.json`,JSON.stringify(results,null,2));console.log(`Interaction inventory: ${results.length} pages`);
