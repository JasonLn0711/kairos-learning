// Integration check: actual prerendered HTML/JSON/JS must exclude draft and future bodies.
import { readFileSync, writeFileSync, readdirSync, unlinkSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
const fixtureCheck=spawnSync('node',['scripts/check-concept-rendering.mjs'],{stdio:'inherit'});
if(fixtureCheck.status!==0) process.exit(1);
const source=JSON.parse(readFileSync('content/lessons/ceh-m01-scope.json','utf8'));
const files=[];
const registryPath='content/concepts.json';
const originalRegistry=readFileSync(registryPath,'utf8');
const markers=['KAIROS_UNPUBLISHED_DRAFT_4fc21','KAIROS_UNPUBLISHED_FUTURE_4fc21','CONCEPT_SECOND_FIXTURE','ZH_FIXTURE_QUESTION','EN_FIXTURE_ANSWER'];
const started=Date.now();
function walk(dir) {return readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(join(dir,e.name)):[join(dir,e.name)]);}
try {
  console.error('Building with one draft and one future-dated fixture; checking all deployed text artifacts.');
  for(let i=0;i<2;i++) {
    const path=`content/lessons/publication-boundary-${i}.json`;
    if(existsSync(path)) throw new Error(`Refusing to replace ${path}`);
    const l=structuredClone(source); l.id=`boundary-${i}`; l.slug=`boundary-${i}`;
    l.status=i===0?'draft':'published'; l.publishedOn=i===0?'2026-01-01':'2099-01-01';
    l.text.en.title=markers[i]; l.text.zh.title=markers[i];
    writeFileSync(path,JSON.stringify(l)); files.push(path);
  }
  const registry=JSON.parse(originalRegistry);
  for(let i=0;i<2;i++) {
    const id=`M04-${98+i}`;
    if(registry.some(c=>c.id===id)) throw new Error('Reserved fixture ID already exists');
    registry.push({id,module:'m04',title:{zh:'邊界測試',en:'Boundary fixture'}});
    const path=`content/concepts/m04-${98+i}.json`;
    if(existsSync(path)) throw new Error(`Refusing to replace ${path}`);
    const t=JSON.parse(readFileSync('content/concepts/m04-01.json','utf8'));
    t.id=id;t.status=i===0?'draft':'published';t.publishedOn=i===0?'2026-01-01':'2099-01-01';
    t.text.zh.summary=markers[i];t.text.en.summary=markers[i];
    writeFileSync(path,JSON.stringify(t));files.push(path);
  }
  writeFileSync(registryPath,JSON.stringify(registry));
  const result=spawnSync('npm',['run','build'],{encoding:'utf8',maxBuffer:8*1024*1024});
  if(result.status!==0) throw new Error((result.stdout+result.stderr).slice(-5000));
  const outputs=walk('build').filter(f=>/\.(html|json|js|xml)$/.test(f));
  for(const path of outputs) {
    const text=readFileSync(path,'utf8');
    if(markers.some(m=>text.includes(m)) || text.includes('/boundary-0/') || text.includes('/boundary-1/')) throw new Error(`Unpublished content leaked to ${path}`);
  }
  console.log(`PASS: draft/future markers absent from ${outputs.length} deployed text artifacts; ${((Date.now()-started)/1000).toFixed(1)}s.`);
} catch(error) { console.error(String(error)); process.exitCode=1; }
finally {
  for(const path of files) unlinkSync(path);
  writeFileSync(registryPath,originalRegistry);
  console.error('Fixtures removed; rebuilding clean production output.');
  const clean=spawnSync('npm',['run','build'],{encoding:'utf8',maxBuffer:8*1024*1024});
  if(clean.status!==0) {console.error((clean.stdout+clean.stderr).slice(-5000));process.exitCode=1;}
  else for(const path of walk('build').filter(f=>/\.(html|json|js|xml)$/.test(f))) if(/M04-98|M04-99|m04-98|m04-99|CONCEPT_SECOND_FIXTURE|FIXTURE_ANSWER/.test(readFileSync(path,'utf8'))) {console.error(`Fixture artifact leaked: ${path}`);process.exitCode=1;}
}
