/** Real browser/HTTPS fixture, bound to loopback; no production endpoint or real accounts. */
import https from 'node:https';
import {execFileSync} from 'node:child_process';
import {randomBytes} from 'node:crypto';
import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
const out='.local/day02a-csrf';mkdirSync(out,{recursive:true});
if(!existsSync(out+'/key.pem'))execFileSync('openssl',['req','-x509','-newkey','rsa:2048','-nodes','-keyout',out+'/key.pem','-out',out+'/cert.pem','-days','1','-subj','/CN=CSRF loopback teaching fixture'],{stdio:'ignore'});
const data=JSON.parse(readFileSync('docs/sources/ceh-day02-a/2026-11-14/csrf-replacement/adopted-body.json','utf8'));
const codes=data.filter(b=>b.kind==='code').map(b=>b.text);
const suppliedForm=codes.find(s=>s.startsWith('<form')&&s.includes('id="attack"'));
const suppliedSafeForm=codes.find(s=>s.startsWith('<form')&&s.includes('csrf_token'));
assert.ok(suppliedForm&&suppliedSafeForm);
const session=randomBytes(20).toString('hex'),token=randomBytes(24).toString('hex');
const observations=[];let port;
const origin=host=>`https://${host}:${port}`;
const bank=()=>origin('bank.example.test'),promo=()=>origin('promo.example.test'),evil=()=>origin('evil.other.test');
function names(cookie=''){return cookie.split(';').map(s=>s.trim().split('=')[0]).filter(Boolean);}
const server=https.createServer({key:readFileSync(out+'/key.pem'),cert:readFileSync(out+'/cert.pem')},async(req,res)=>{
 const url=new URL(req.url,`https://${req.headers.host}`);let body='';for await(const chunk of req)body+=chunk;
 const entry={path:url.pathname,method:req.method,origin:req.headers.origin||null,fetchSite:req.headers['sec-fetch-site']||null,cookies:names(req.headers.cookie),status:200,executed:false};
 res.setHeader('Content-Type','text/html; charset=utf-8');
 if(url.pathname==='/login'){
  res.setHeader('Set-Cookie',['Strict','Lax','None'].map(mode=>`__Host-${mode.toLowerCase()}=${url.searchParams.has('expired')?'expired-'+session:session}; Secure; HttpOnly; Path=/; SameSite=${mode}`));res.end('<p>synthetic session seeded</p>');return;
 }
 if(req.method==='OPTIONS'){entry.status=403;observations.push(entry);res.writeHead(403);res.end('preflight denied');return;}
 if(['/observe','/unsafe','/transfer'].includes(url.pathname)){
  const params=new URLSearchParams(body);const cookie=req.headers.cookie||'';entry.authenticated=['strict','lax','none'].some(name=>cookie.includes(`__Host-${name}=${session}`));
  if(url.pathname==='/transfer'){
   if(!entry.authenticated||params.get('csrf_token')!==token){entry.status=403;res.writeHead(403);}
   else entry.executed=true;
  }else if(url.pathname==='/unsafe'){entry.executed=entry.authenticated;if(!entry.authenticated){entry.status=401;res.writeHead(401);}}
  observations.push(entry);res.end('<p>fixture result</p>');return;
 }
 if(url.pathname==='/page'){
  const target=url.searchParams.get('target')||'observe';
  const form=suppliedForm.replace('https://bank.example/transfer',bank()+'/'+target).replace(/<script>[\s\S]*?<\/script>/,'').replace('</form>','<button type="submit">Continue</button></form>');
  res.end(`<a id="navigate" href="${bank()}/observe">GET navigation</a>${form}<div id="mount"></div>`);return;
 }
 if(url.pathname==='/auto'){res.end(suppliedForm.replace('https://bank.example/transfer',bank()+'/'+(url.searchParams.get('target')||'unsafe')));return;}
 if(url.pathname==='/safe-form'){
  const form=suppliedSafeForm.replace('action="/transfer"',`action="${bank()}/transfer"`).replace('RANDOM_UNPREDICTABLE_TOKEN',token).replace('</form>','<button type="submit">Continue</button></form>');
  res.end(form);return;
 }
 res.end('<p>loopback fixture</p>');
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));port=server.address().port;
let browser;const checks=[];
try{
 browser=await chromium.launch({channel:process.env.PLAYWRIGHT_CHANNEL||'chrome',args:['--host-resolver-rules=MAP *.test 127.0.0.1','--no-proxy-server']});
 async function setup(){const context=await browser.newContext({ignoreHTTPSErrors:true});const page=await context.newPage();await page.goto(bank()+'/login');return {context,page};}
 const matrix=[];
 for(const scenario of ['same-site-post','cross-site-get','cross-site-post','cross-site-image']){
  const {context,page}=await setup();const start=observations.length;
  await page.goto((scenario==='same-site-post'?promo():evil())+'/page');
  if(scenario.endsWith('post')){await Promise.all([page.waitForURL(bank()+'/observe'),page.locator('button').click()]);}
  else if(scenario==='cross-site-get'){await Promise.all([page.waitForURL(bank()+'/observe'),page.locator('#navigate').click()]);}
  else{await page.evaluate(url=>new Promise(resolve=>{const image=new Image();image.onload=image.onerror=()=>resolve(true);image.src=url;document.body.append(image);}),bank()+'/observe');}
  const observed=observations.slice(start).find(o=>o.path==='/observe');assert.ok(observed,scenario);
  const expected=scenario==='same-site-post'?['__Host-strict','__Host-lax','__Host-none']:scenario==='cross-site-get'?['__Host-lax','__Host-none']:['__Host-none'];
  assert.deepEqual([...observed.cookies].sort(),expected.sort(),scenario);
  matrix.push({scenario,...observed});await context.close();
 }
 checks.push('Explicit Strict/Lax/None: same-site POST, cross-site top GET, top POST and image GET match all twelve cells');
 const blindOutcomes=[];
 for(const [name,state,target,status,executed] of [['Bob','absent','unsafe',401,false],['Carol','expired','unsafe',401,false],['David','valid','transfer',403,false],['Alice','valid','unsafe',200,true]]){
  const context=await browser.newContext({ignoreHTTPSErrors:true});const page=await context.newPage();
  if(state!=='absent')await page.goto(bank()+'/login'+(state==='expired'?'?expired=1':''));
  await page.goto(evil()+'/auto?target='+target,{waitUntil:'commit'});await page.waitForURL(bank()+'/'+target);
  const observed=observations.at(-1);assert.equal(observed.status,status,name);assert.equal(observed.executed,executed,name);blindOutcomes.push({name,state,...observed});await context.close();
 }
 checks.push('Current published automatic form: Bob absent session 401, Carol expired session 401, David CSRF-protected endpoint 403, Alice vulnerable endpoint executes; same probe without knowing visitor state');
 {
  const {context,page}=await setup();await page.goto(bank()+'/safe-form');assert.equal(await page.evaluate(()=>document.cookie),'');
  const bankPage=page;const other=await context.newPage();await other.goto(promo()+'/page?target=transfer');assert.equal(await other.evaluate(()=>document.cookie),'');
  const denied=other.waitForResponse(r=>r.url()===bank()+'/transfer');await other.locator('button').click();assert.equal((await denied).status(),403);
  assert.ok(observations.at(-1).cookies.includes('__Host-strict'));assert.equal(observations.at(-1).executed,false);
  await bankPage.locator('[name=recipient]').fill('recipient-account');await bankPage.locator('[name=amount]').fill('1000');await bankPage.locator('button').click();await bankPage.waitForURL(bank()+'/transfer');assert.equal(observations.at(-1).status,200);assert.equal(observations.at(-1).executed,true);
  await context.close();
 }
 checks.push('HttpOnly unreadable on bank and sibling origin; sibling same-site request sends Strict cookie but missing CSRF token is rejected; legitimate token accepted');
 {
  const {context,page}=await setup();await page.goto(evil()+'/page');let start=observations.length;
  const defaultFetch=await page.evaluate(async url=>{try{await fetch(url);return 'readable';}catch{return 'blocked';}},bank()+'/observe');
  assert.equal(defaultFetch,'blocked');assert.deepEqual(observations.slice(start).find(o=>o.path==='/observe').cookies,[]);
  start=observations.length;
  const includeFetch=await page.evaluate(async url=>{try{await fetch(url,{method:'POST',credentials:'include',body:new URLSearchParams({action:'change-setting'})});return 'readable';}catch{return 'blocked';}},bank()+'/unsafe');
  assert.equal(includeFetch,'blocked');const action=observations.slice(start).find(o=>o.path==='/unsafe');assert.ok(action.executed);assert.deepEqual(action.cookies,['__Host-none']);
  start=observations.length;
  const preflight=await page.evaluate(async url=>{try{await fetch(url,{method:'POST',credentials:'include',headers:{'Content-Type':'application/json','X-CSRF-Token':'demonstration'},body:'{}'});return 'readable';}catch{return 'blocked';}},bank()+'/unsafe');
  assert.equal(preflight,'blocked');assert.equal(observations.slice(start).filter(o=>o.method==='OPTIONS').length,1);assert.equal(observations.slice(start).filter(o=>o.method==='POST').length,0);assert.deepEqual(observations.at(-1).cookies,[]);
  await context.close();
 }
 checks.push('Cross-origin default fetch omits cookies; include simple fetch can reach/mutate fixture while response unreadable; denied preflight has no cookie and no actual POST');
 const result={browser:browser.version(),environment:'Loopback HTTPS with bank.example.test / promo.example.test / evil.other.test; synthetic in-memory session and action only; certificate errors ignored only for fixture',sourceAdapters:'Current published automatic form destination replaced with loopback origin; matrix removes auto-script and adds a submit button to control timing. Legal form uses fixture token and an added submit button, fields filled as user input. Fetch calls are independent CORS controls, not claimed as supplied executable snippets. No external bank requests.',checks,matrix,blindOutcomes,observations};
 writeFileSync(out+'/mechanism-result.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({passed:checks.length,matrixCells:12,browser:result.browser}));
}finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
