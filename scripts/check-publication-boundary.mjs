// Integration check: actual prerendered HTML/JSON/JS must exclude draft and future bodies.
import { readFileSync, writeFileSync, readdirSync, unlinkSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
const fixtureCheck=spawnSync('node',['scripts/check-concept-rendering.mjs'],{stdio:'inherit'});
if(fixtureCheck.status!==0) process.exit(1);
const source=JSON.parse(readFileSync('content/lessons/ceh-m01-scope.json','utf8'));
const files=[];
const aaseOriginals=new Map();
const registryPath='content/concepts.json';
const originalRegistry=readFileSync(registryPath,'utf8');
const markers=['KAIROS_UNPUBLISHED_DRAFT_4fc21','KAIROS_UNPUBLISHED_FUTURE_4fc21','CONCEPT_SECOND_FIXTURE','ZH_FIXTURE_QUESTION','EN_FIXTURE_ANSWER'];
markers.push('NOTES_DRAFT_MARKER','NOTES_FUTURE_MARKER','NOTES_PART_DRAFT_MARKER','NOTES_PART_FUTURE_MARKER');
markers.push('AASE_UNPUBLISHED_DRAFT_4fc21','AASE_UNPUBLISHED_FUTURE_4fc21','AASE_EN_DRAFT_4fc21','AASE_EN_FUTURE_4fc21','AASE_EN_COURSE_CLOSED_4fc21');
const started=Date.now();
function walk(dir) {return readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(join(dir,e.name)):[join(dir,e.name)]);}
try {
  console.error('Building with one draft and one future-dated fixture; checking all deployed text artifacts.');
  for(const [i,name] of ['aase-m01-c01','aase-m03-c01'].entries()) {
    const path=`content/aase/lessons/${name}.json`;
    const original=readFileSync(path,'utf8');aaseOriginals.set(path,original);
    const lesson=JSON.parse(original);lesson.status=i===0?'draft':'published';
    lesson.publishedOn=lesson.date=i===0?'2026-01-01':'2099-01-01';
    lesson.text.zh.summary=i===0?'AASE_UNPUBLISHED_DRAFT_4fc21':'AASE_UNPUBLISHED_FUTURE_4fc21';
    if(lesson.text.en){
      lesson.text.en.summary=lesson.text.zh.summary+'_EN';
      // A translation cannot precede its base article. Keep the fixture valid
      // so this build exercises publication exclusion rather than schema failure.
      if(lesson.translations.en.publishedOn<lesson.publishedOn)lesson.translations.en.publishedOn=lesson.publishedOn;
    }
    writeFileSync(path,JSON.stringify(lesson));
  }

  for(const [i,name] of ['aase-m01-c02','aase-m01-c03'].entries()){
    const path=`content/aase/lessons/${name}.json`,original=readFileSync(path,'utf8');aaseOriginals.set(path,original);
    const lesson=JSON.parse(original);lesson.text.en=structuredClone(lesson.text.zh);
    lesson.text.en.summary=i===0?'AASE_EN_DRAFT_4fc21':'AASE_EN_FUTURE_4fc21';
    lesson.translations={en:{status:i===0?'draft':'published',publishedOn:i===0?'2026-11-05':'2099-01-01'}};
    for(const q of lesson.checks)q.text.en=structuredClone(q.text.zh);
    writeFileSync(path,JSON.stringify(lesson));
  }

  for(let i=0;i<2;i++) {
    const path=`content/lessons/publication-boundary-${i}.json`;
    if(existsSync(path)) throw new Error(`Refusing to replace ${path}`);
    const l=structuredClone(source); l.id=`boundary-${i}`; l.slug=`boundary-${i}`;
    l.status=i===0?'draft':'published'; l.publishedOn=i===0?'2026-01-01':'2099-01-01';
    l.text.en.title=markers[i]; l.text.zh.title=markers[i];
    writeFileSync(path,JSON.stringify(l)); files.push(path);
  }
  for(let i=0;i<2;i++) {
    const path=`content/perspectives/boundary-${i}.json`;
    if(existsSync(path)) throw Error('Reserved perspective fixture exists');
    const p=JSON.parse(readFileSync('tests/fixtures/perspectives/example.json','utf8'));
    p.related=[];p.id=p.slug=`perspective-boundary-${i}`;p.status=i===0?'draft':'published';p.publishedOn=p.updatedOn=i===0?'2026-01-01':'2099-01-01';
    p.text.zh.title=p.text.en.title=markers[i];
    writeFileSync(path,JSON.stringify(p));files.push(path);
  }
  const notePath='content/ceh-notes/2026-11-10.json',noteOriginal=readFileSync(notePath,'utf8');
  aaseOriginals.set(notePath,noteOriginal);
  const publishedNote=JSON.parse(noteOriginal);publishedNote.expectedParts+=2;
  for(let i=0;i<2;i++) {
    const n=JSON.parse(noteOriginal);n.date=`209${8+i}-01-01`;
    n.status=i===0?'draft':'published';n.publishedOn=n.revisedOn=i===0?'2026-11-10':'2099-01-01';
    for(const part of n.parts)part.publishedOn=n.publishedOn;
    const marker=i===0?'NOTES_DRAFT_MARKER':'NOTES_FUTURE_MARKER';
    n.text.zh.title=n.text.en.title=n.parts[0].text.zh.title=n.parts[0].text.en.title=marker;
    const path=`content/ceh-notes/${n.date}.json`;if(existsSync(path))throw Error('Reserved note fixture exists');
    writeFileSync(path,JSON.stringify(n));files.push(path);
    const part=JSON.parse(noteOriginal).parts[0];part.number=publishedNote.expectedParts-1+i;part.status=i===0?'draft':'published';part.publishedOn=i===0?'2026-11-10':'2099-01-01';
    for(const lang of ['zh','en']){part.text[lang]=JSON.parse(JSON.stringify(part.text[lang]).replaceAll('p1-',`p${part.number}-`));part.text[lang].title=i===0?'NOTES_PART_DRAFT_MARKER':'NOTES_PART_FUTURE_MARKER';}
    publishedNote.parts.push(part);
  }
  writeFileSync(notePath,JSON.stringify(publishedNote));
  const registry=JSON.parse(originalRegistry);
  for(let i=0;i<2;i++) {
    const id=`M04-${98+i}`;
    if(registry.some(c=>c.id===id)) throw new Error('Reserved fixture ID already exists');
    registry.push({id,module:'m04',title:{zh:'邊界測試',en:'Boundary fixture'}});
    const path=`content/concepts/m04-${98+i}.json`;
    if(existsSync(path)) throw new Error(`Refusing to replace ${path}`);
    const t=JSON.parse(readFileSync('tests/fixtures/concept-teaching.json','utf8'));
    t.id=id;t.status=i===0?'draft':'published';t.publishedOn=i===0?'2026-01-01':'2099-01-01';
    t.text.zh.summary=markers[i];t.text.en.summary=markers[i];
    writeFileSync(path,JSON.stringify(t));files.push(path);
  }
  writeFileSync(registryPath,JSON.stringify(registry));
  const result=spawnSync('pnpm',['run','build'],{encoding:'utf8',maxBuffer:8*1024*1024});
  if(result.status!==0) throw new Error((result.stdout+result.stderr).slice(-5000));
  const outputs=walk('build').filter(f=>/\.(html|json|js|xml)$/.test(f));
  for(const path of outputs) {
    const text=readFileSync(path,'utf8');
    if(markers.some(m=>text.includes(m)) || text.includes('/boundary-0/') || text.includes('/boundary-1/')) throw new Error(`Unpublished content leaked to ${path}`);
  }
  for(const slug of ['m01-01','m01-02','m01-03'])if(existsSync(`build/en/courses/aase/v1/m01/concepts/${slug}/index.html`))throw Error('Closed English article route exists: '+slug);
  for(const prefix of ['', 'en/'])for(const module of ['m01','m03']){
    const path=`build/${prefix}courses/aase/v1/${module}/concepts/${module}-01/index.html`;
    if(existsSync(path))throw Error('Closed base article route exists: '+path);
  }
  console.log(`PASS: draft/future markers absent from ${outputs.length} deployed text artifacts; ${((Date.now()-started)/1000).toFixed(1)}s.`);
  const englishPath='content/aase/course.en.json',englishOriginal=readFileSync(englishPath,'utf8');aaseOriginals.set(englishPath,englishOriginal);
  for(const state of ['draft','future']){
    const gateStarted=Date.now();console.error('Checking English course '+state+' gate: building and validating static output.');
    const profile=JSON.parse(englishOriginal);profile.title='AASE_EN_COURSE_CLOSED_4fc21';
    if(state==='draft')profile.status='draft';else profile.publishedOn='2099-01-01';
    writeFileSync(englishPath,JSON.stringify(profile));
    const build=spawnSync('pnpm',['run','build'],{encoding:'utf8',maxBuffer:8*1024*1024});
    if(build.status!==0)throw Error((build.stdout+build.stderr).slice(-5000));
    if(existsSync('build/en/courses/aase/v1/index.html'))throw Error('Closed English course route exists');
    for(const path of walk('build').filter(f=>/\.(html|json|js|xml)$/.test(f)))if(markers.some(m=>readFileSync(path,'utf8').includes(m)))throw Error('Closed English data leaked: '+path);
    const validate=spawnSync('python3',['scripts/validate_release.py'],{encoding:'utf8',maxBuffer:8*1024*1024});
    if(validate.status!==0)throw Error((validate.stdout+validate.stderr).slice(-5000));
    console.log('PASS: English course '+state+' gate closes routes, search, payloads and language alternates; '+((Date.now()-gateStarted)/1000).toFixed(1)+'s.');
  }

} catch(error) { console.error(String(error)); process.exitCode=1; }
finally {
  for(const path of files) unlinkSync(path);
  for(const [path,original] of aaseOriginals)writeFileSync(path,original);
  writeFileSync(registryPath,originalRegistry);
  console.error('Fixtures removed; rebuilding clean production output.');
  const clean=spawnSync('pnpm',['run','build'],{encoding:'utf8',maxBuffer:8*1024*1024});
  if(clean.status!==0) {console.error((clean.stdout+clean.stderr).slice(-5000));process.exitCode=1;}
  else for(const path of walk('build').filter(f=>/\.(html|json|js|xml)$/.test(f))) if(/M04-98|M04-99|m04-98|m04-99|CONCEPT_SECOND_FIXTURE|FIXTURE_ANSWER/.test(readFileSync(path,'utf8'))) {console.error(`Fixture artifact leaked: ${path}`);process.exitCode=1;}
}
