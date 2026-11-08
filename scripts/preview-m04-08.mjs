// Local-only fixture: synthetic publication date never persists in source or production.
import {readFileSync,writeFileSync,mkdirSync,rmSync,renameSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
const path='content/concepts/ceh26-m04-c08.json',original=readFileSync(path,'utf8');
try {
 const t=JSON.parse(original);t.status='published';t.publishedOn='2026-11-06';
 writeFileSync(path,JSON.stringify(t));const r=spawnSync('pnpm',['run','build'],{stdio:'inherit'});
 if(r.status!==0)throw Error('Preview build failed');
 mkdirSync('.local/m04-08',{recursive:true});rmSync('.local/m04-08/preview',{recursive:true,force:true});renameSync('build','.local/m04-08/preview');
} finally {writeFileSync(path,original);}
