// This fixture exists only for the check; the following boundary build replaces build/.
import { readFileSync, writeFileSync, unlinkSync, existsSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
const path='content/concepts/m04-98.json';
const registryPath='content/concepts.json';
const originalRegistry=readFileSync(registryPath,'utf8');
const registry=JSON.parse(originalRegistry);
if(registry.some(c=>c.id==='M04-98')) throw new Error('Reserved fixture ID already exists');
if(existsSync(path)) throw new Error('Reserved fixture file already exists.');
const fixture=JSON.parse(readFileSync('content/concepts/m04-01.json','utf8'));
fixture.id='M04-98';fixture.publishedOn='2026-01-01';
for(const lang of ['zh','en']) fixture.text[lang]={summary:`${lang} CONCEPT_SECOND_FIXTURE`,sections:[{id:'fixture-section',heading:`${lang} OWN_HEADING`,paragraphs:[`${lang} OWN_TEACHING`]}]};
fixture.qa=[{id:'fixture',text:{zh:{question:'ZH_FIXTURE_QUESTION',answer:['ZH_FIXTURE_ANSWER']},en:{question:'EN_FIXTURE_QUESTION',answer:['EN_FIXTURE_ANSWER']}}}];
console.error('Rendering an isolated second-concept fixture and checking bilingual Q&A/navigation.');
try {
  registry.splice(1,0,{id:'M04-98',module:'m04',title:{zh:'測試概念',en:'Fixture concept'}});
  writeFileSync(registryPath,JSON.stringify(registry));
  writeFileSync(path,JSON.stringify(fixture));
  const result=spawnSync('npm',['run','build'],{encoding:'utf8',maxBuffer:8*1024*1024});
  if(result.status!==0) throw new Error((result.stdout+result.stderr).slice(-5000));
  for(const lang of ['zh','en']) {
    const prefix=lang==='zh'?'':'en/';
    const second=readFileSync(`build/${prefix}courses/ceh/v13/m04/concepts/m04-98/index.html`,'utf8');
    const first=readFileSync(`build/${prefix}courses/ceh/v13/m04/concepts/m04-01/index.html`,'utf8');
    for(const marker of [`${lang} OWN_TEACHING`,`${lang.toUpperCase()}_FIXTURE_QUESTION`,`${lang.toUpperCase()}_FIXTURE_ANSWER`]) if(!second.includes(marker)||first.includes(marker)) throw new Error(`${lang}: teaching/Q&A not isolated`);
    if(second.includes('Finance')) throw new Error(`${lang}: first teaching reused`);
    if(!first.includes(`/${prefix}courses/ceh/v13/m04/concepts/m04-98/`) || !second.includes(`/${prefix}courses/ceh/v13/m04/concepts/m04-01/`)) throw new Error(`${lang}: adjacent navigation missing`);
  }
  console.log('PASS: second concept renders its own bilingual teaching, anonymous Q&A and navigation.');
} finally {
  if(existsSync(path)) unlinkSync(path);
  writeFileSync(registryPath,originalRegistry);
  // Never leave the published fixture artifact available for deployment, even on failure.
  rmSync('build',{recursive:true,force:true});
}
