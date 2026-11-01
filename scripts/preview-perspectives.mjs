import {createServer} from 'node:net';
import {cpSync,mkdirSync,rmSync,symlinkSync,readFileSync,writeFileSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {spawnSync,spawn} from 'node:child_process';
const port=process.env.PERSPECTIVES_PORT??'4179';
if(!/^\d+$/.test(port)||Number(port)<1024||Number(port)>65535)throw Error('PERSPECTIVES_PORT must be 1024–65535');
if(!process.argv.includes('--build-only')) {
 const probe=createServer();
 try { await new Promise((resolve,reject)=>{probe.once('error',reject);probe.listen(Number(port),'127.0.0.1',resolve)});await new Promise(resolve=>probe.close(resolve)); }
 catch(error) { console.error(`Cannot start preview on ${port}: ${error.code}. Choose an unused PERSPECTIVES_PORT.`);process.exit(1); }
}
const root=process.cwd(),target=resolve('.local/perspectives-preview');
rmSync(target,{recursive:true,force:true});mkdirSync(target,{recursive:true});
for(const name of ['src','site','content','package.json','svelte.config.js','vite.config.ts','tsconfig.json'])cpSync(join(root,name),join(target,name),{recursive:true});
symlinkSync(join(root,'node_modules'),join(target,'node_modules'),'dir');
writeFileSync(join(target,'content/perspectives/preview-perspective.json'),readFileSync('tests/fixtures/perspectives/example.json'));
const result=spawnSync('npm',['run','build'],{cwd:target,stdio:'inherit'});if(result.status!==0)process.exit(result.status??1);
if(process.argv.includes('--build-only'))process.exit(0);
console.log(`Synthetic preview only: http://127.0.0.1:${port}/perspectives/preview-perspective/`);
const server=spawn('python3',['-m','http.server',port,'--bind','127.0.0.1','--directory',join(target,'build')],{stdio:'inherit'});
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>{server.kill(signal);process.exit(0)});

server.on('error',error=>{console.error(error.message);process.exitCode=1});
server.on('exit',code=>{if(code){console.error('Preview server failed. Choose an unused PERSPECTIVES_PORT.');}process.exitCode=code??1});
