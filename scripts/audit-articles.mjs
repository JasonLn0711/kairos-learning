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
try{for(const file of files){const url='/'+file.slice(root.length+1);const page=await browser.newPage();for(const width of [320,390,768,1280]){await page.setViewportSize({width,height:900});await page.goto(base+url);const result=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,missingAlt:[...document.images].filter(i=>!i.hasAttribute('alt')).length,h1:document.querySelectorAll('h1').length,lang:document.documentElement.lang}));results.push({url,width,...result,manual:'pending: diagram readability, keyboard, 200% text resizing'});if(result.overflow||result.missingAlt)await page.screenshot({path:`${dir}/${results.length}.png`,fullPage:true});}await page.close();if(results.length%80===0)console.log(`${results.length/4}/${files.length} pages`)}
}finally{await browser.close();server.close()}
await writeFile(`${dir}/results.json`,JSON.stringify(results,null,2));
const failures=results.filter(r=>r.overflow||r.missingAlt||r.h1!==1);
await writeFile(`${dir}/viewport-summary.md`,`# 全站文章盤點\n\n本機建置：${new Date().toISOString()}。${files.length} 頁、${results.length} 個尺寸檢查。原始結果及差距截圖：\`.local/article-audit/\`。\n\n自動檢查發現 ${failures.length} 筆差距。人工圖解、鍵盤、文字放大與無 JavaScript 驗收尚待完成；本報告不表示全站通過。\n\n| 頁面 | 寬度 | 溢出 | 缺 alt | h1 數 |\n|---|---|---|---|---|\n`+failures.map(r=>`| ${r.url} | ${r.width} | ${r.overflow} | ${r.missingAlt} | ${r.h1} |`).join('\n'));
console.log(`Audit complete: ${files.length} pages, ${failures.length} findings`);
