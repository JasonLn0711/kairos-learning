import { isPublic, type SearchEntry } from './model.ts';
export type AaseSource = {id:string;title:string;url:string;checkedOn:string};
export type AaseSection = {id:string;heading:string;paragraphs:string[];sourceIds?:string[];code?:string;figure?:{kind:'flow'|'comparison';caption:string;items:{title:string;body:string}[]}};
export type AaseLesson = {id:string;status:'draft'|'published';revision:number;contentVersion:string;publishedOn:string;revisedOn:string;summary:string;objectives:string[];sections:AaseSection[];exercise:{environment:string;steps:string[];expected:string;check:string;cleanup:string};checks:{id:string;prompt:string;options:string[];answer:number;rationales:string[]}[];sourceIds:string[]};
export type AaseCourse = {id:string;version:string;contentVersion:string;title:string;subtitle:string;englishTitle:string;locale:string;status:string;modules:{id:string;title:string;minutes:number;practiceMinutes:number;artifact:string;concepts:{id:string;slug:string;title:string;status:string;workshopDepth:string;objective:string;practice:string;assessment:string}[]}[]};
export const aaseModulePath=(id:string)=>`/courses/aase/v1/${id}/`;
export const aaseConceptPath=(module:string,slug:string)=>`${aaseModulePath(module)}concepts/${slug}/`;
export function createAaseCatalog(course:AaseCourse,lessons:AaseLesson[],sources:AaseSource[],today:string){
  const fail=(message:string):never=>{throw new Error(`AASE: ${message}`);};
  const text=(value:unknown)=>typeof value==='string'&&value.trim().length>0;
  const day=(value:string)=>/^\d{4}-\d{2}-\d{2}$/.test(value)&&Number.isFinite(Date.parse(value))&&new Date(value).toISOString().slice(0,10)===value;
  if(course.id!=='aase'||course.version!=='v1'||course.locale!=='zh')fail('unsupported course identity or language');
  if(course.modules.length!==9)fail('expected nine modules');
  const concepts=course.modules.flatMap((m,i)=>{
    if(m.id!==`m${String(i+1).padStart(2,'0')}`||!text(m.title)||!Number.isInteger(m.minutes)||!Number.isInteger(m.practiceMinutes)||m.minutes<0||m.practiceMinutes<0||m.practiceMinutes>m.minutes)fail('invalid module');
    return m.concepts.map((c,j)=>{
      if(c.id!==`AASE-M${String(i+1).padStart(2,'0')}-C${String(j+1).padStart(2,'0')}`||c.slug!==`${m.id}-${String(j+1).padStart(2,'0')}`||!text(c.title)||![c.objective,c.practice,c.assessment].every(text)||c.status!=='pending'||!['deep','overview','extension'].includes(c.workshopDepth))fail('invalid concept');
      return {...c,module:m.id,href:aaseConceptPath(m.id,c.slug)};
    });
  });
  if(concepts.length!==49||new Set(concepts.map(c=>c.id)).size!==49)fail('expected 49 unique concepts');
  if(course.modules.reduce((n,m)=>n+m.minutes,0)!==600||course.modules.reduce((n,m)=>n+m.practiceMinutes,0)!==150)fail('invalid 600/150 minute allocation');
  for(const [depth,count] of [['deep',26],['overview',20],['extension',3]] as const)if(concepts.filter(c=>c.workshopDepth===depth).length!==count)fail('invalid workshop depth allocation');
  const sourceIds=new Set(sources.map(s=>s.id));
  if(sourceIds.size!==sources.length||sources.some(s=>!text(s.id)||!text(s.title)||!s.url.startsWith('https://')||!day(s.checkedOn)))fail('invalid sources');
  if(new Set(lessons.map(l=>l.id)).size!==lessons.length)fail('duplicate lesson');
  for(const l of lessons){
    if(!concepts.some(c=>c.id===l.id)||!['draft','published'].includes(l.status)||!Number.isInteger(l.revision)||l.revision<1||!/^\d+\.\d+\.\d+$/.test(l.contentVersion)||!day(l.publishedOn)||!day(l.revisedOn)||l.revisedOn<l.publishedOn)fail('invalid lesson metadata');
    if(!text(l.summary)||l.objectives.length<2||l.objectives.some(x=>!text(x))||l.sections.length<5||!l.sourceIds.length||l.sourceIds.some(id=>!sourceIds.has(id)))fail('incomplete lesson');
    if(new Set(l.sections.map(s=>s.id)).size!==l.sections.length)fail('duplicate section');
    for(const s of l.sections){
      if(!/^[a-z][a-z0-9-]*$/.test(s.id)||!text(s.heading)||!s.paragraphs.length||s.paragraphs.some(p=>!text(p))||(s.sourceIds??[]).some(id=>!l.sourceIds.includes(id)))fail('invalid section');
      if(s.figure&&(!['flow','comparison'].includes(s.figure.kind)||!text(s.figure.caption)||s.figure.items.length<2||s.figure.items.some(i=>!text(i.title)||!text(i.body))))fail('invalid figure');
    }
    const e=l.exercise;
    if(!e||!text(e.environment)||e.steps.length<3||e.steps.some(x=>!text(x))||![e.expected,e.check,e.cleanup].every(text))fail('incomplete exercise');
    if(!l.checks.length||new Set(l.checks.map(q=>q.id)).size!==l.checks.length)fail('missing or duplicate checks');
    if(l.checks.some(q=>!q.id.startsWith(l.id+'-Q')||!text(q.prompt)||q.options.length!==4||q.rationales.length!==4||!Number.isInteger(q.answer)||q.answer<0||q.answer>3||[...q.options,...q.rationales].some(x=>!text(x))))fail('invalid check');
  }
  const publicLessons=lessons.filter(l=>isPublic(l,today));
  const publicConcepts=concepts.map(c=>({...c,lesson:publicLessons.find(l=>l.id===c.id)??null}));
  const searchEntries:SearchEntry[]=publicConcepts.filter(c=>c.lesson).map(c=>({id:c.id,lang:'zh',title:c.title,summary:c.lesson!.summary,text:[...c.lesson!.objectives,...c.lesson!.sections.flatMap(s=>[s.heading,...s.paragraphs,s.code??'',...(s.figure?[s.figure.caption,...s.figure.items.flatMap(i=>[i.title,i.body])]:[])]),...Object.values(c.lesson!.exercise).flat(),...c.lesson!.checks.flatMap(q=>[q.prompt,...q.options,...q.rationales])].join(' '),href:c.href,label:`AASE ${c.module.toUpperCase()}`}));
  return {concepts:publicConcepts,lessons:publicLessons,searchEntries};
}
