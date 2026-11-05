import {assertArchitectureDiagram,architectureDiagramText,type ArchitectureDiagramModel} from './architecture-diagram.ts';
import {parseQA} from './qa-markdown.ts';
import type {ConceptBlock,ConceptCheck,ConceptDiscussion} from './concepts.ts';
import type {ReadingGuide} from './article-reading.ts';
import { isPublic, type SearchEntry } from './model.ts';
export type AaseSource = {id:string;title:string;url:string;checkedOn:string};
export type AaseBlock = ConceptBlock | ArchitectureDiagramModel;
export type AaseSection = {id:string;heading:string;paragraphs:string[];sourceIds?:string[];blocks?:AaseBlock[]};
export type AaseExercise = {environment:string;steps:string[];expected:string;check:string;cleanup:string};
export type AaseLesson = {id:string;status:'draft'|'published';revision:number;contentVersion:string;publishedOn:string;date:string;qa:ConceptDiscussion[];text:{zh:{summary:string;objectives:string[];sections:AaseSection[];exercise:AaseExercise;readingGuide:ReadingGuide}};checks:ConceptCheck[];sourceIds:string[]};
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
    const t=l.text?.zh;
    if(!t||!t.readingGuide||!(['goal','startingPoint','route','output'] as const).every(k=>text(t.readingGuide[k]))||!Array.isArray(l.qa))fail('incomplete lesson fields');
    if(Object.keys(l.text).some(k=>k!=='zh'))fail('unreviewed lesson language');
    if(!concepts.some(c=>c.id===l.id)||!['draft','published'].includes(l.status)||!Number.isInteger(l.revision)||l.revision<1||!/^\d+\.\d+\.\d+$/.test(l.contentVersion)||!day(l.publishedOn)||!day(l.date)||l.date<l.publishedOn)fail('invalid lesson metadata');
    if(!text(t.summary)||t.objectives.length<2||t.objectives.some(x=>!text(x))||t.sections.length<5||!l.sourceIds.length||l.sourceIds.some(id=>!sourceIds.has(id)))fail('incomplete lesson');
    if(new Set(t.sections.map(s=>s.id)).size!==t.sections.length)fail('duplicate section');
    for(const s of t.sections){
      if(!/^[a-z][a-z0-9-]*$/.test(s.id)||!text(s.heading)||['discussion','objectives','practice','checks','sources'].includes(s.id)||s.id.startsWith('qa-')||!s.paragraphs.length||s.paragraphs.some(p=>!text(p))||(s.sourceIds??[]).some(id=>!l.sourceIds.includes(id)))fail('invalid section');
      for(const b of s.blocks??[]){
        if(b.kind==='architecture'){assertArchitectureDiagram(b);}
        else if(b.kind==='flow'||b.kind==='cards'){if(!text(b.caption)||!text(b.description)||b.items.length<2||b.items.some(i=>!text(i.title)||!text(i.body)))fail('invalid figure');}
        else if(b.kind==='step'||b.kind==='details'){if(!text(b.heading)||!b.paragraphs.length||!b.paragraphs.every(text)||(b.code!==undefined&&!text(b.code)))fail('invalid step');}
        else if(b.kind==='table'){if(!text(b.caption)||!b.headers.length||!b.headers.every(text)||!b.rows.length||b.rows.some(r=>r.length!==b.headers.length||!r.every(text)))fail('invalid table');}
        else fail('invalid block');
      }
    }
    const e=t.exercise;
    if(!e||!text(e.environment)||e.steps.length<3||e.steps.some(x=>!text(x))||![e.expected,e.check,e.cleanup].every(text))fail('incomplete exercise');
    if(!l.checks.length||new Set(l.checks.map(q=>q.id)).size!==l.checks.length)fail('missing or duplicate checks');
    if(l.checks.some(q=>!q.id.startsWith(l.id+'-Q')||!q.text.zh||Object.keys(q.text).some(k=>k!=='zh')||!text(q.text.zh.prompt)||q.text.zh.options.length!==4||q.text.zh.rationales.length!==4||!Number.isInteger(q.answer)||q.answer<0||q.answer>3||[...q.text.zh.options,...q.text.zh.rationales].some(x=>!text(x))))fail('invalid check');
    const qaIds=new Set<string>();
    for(const q of l.qa){const v=q.text.zh;if(!v)throw new Error('AASE: missing Q&A locale');if(!/^[a-zA-Z0-9-]+$/.test(q.id)||qaIds.has(q.id)||Object.keys(q.text).some(k=>k!=='zh')||(q.format!==undefined&&q.format!=='markdown')||!text(v.question)||!v.answer.length||!v.answer.every(text))fail('invalid Q&A');if([v.originalQuestion].some(x=>x!==undefined&&!text(x))||[v.explanation,v.editorial].some(a=>a!==undefined&&(!a.length||!a.every(text))))fail('invalid Q&A fields');if(q.format==='markdown'&&(parseQA(v.answer.join('\n\n')).filter(b=>b.kind==='quiz').length!==1||!v.explanation?.length))fail('incomplete Q&A teaching test');qaIds.add(q.id);}

  }
  const publicLessons=lessons.filter(l=>isPublic(l,today));
  const publicConcepts=concepts.map(c=>({...c,lesson:publicLessons.find(l=>l.id===c.id)??null}));
  const blockText=(b:AaseBlock):string[]=>b.kind==='architecture'?architectureDiagramText(b):b.kind==='flow'||b.kind==='cards'?[b.caption,b.description,...b.items.flatMap(i=>[i.title,i.body])]:b.kind==='table'?[b.caption,...b.headers,...b.rows.flat()]:'heading' in b?[b.heading,...b.paragraphs,b.code??'']:[];
  const searchEntries:SearchEntry[]=publicConcepts.filter(c=>c.lesson).map(c=>{const l=c.lesson!,t=l.text.zh;return {id:c.id,lang:'zh',title:c.title,summary:t.summary,text:[...t.objectives,...Object.values(t.readingGuide),...t.sections.flatMap(s=>[s.heading,...s.paragraphs,...(s.blocks??[]).flatMap(blockText)]),...Object.values(t.exercise).flat(),...l.checks.flatMap(q=>[q.text.zh!.prompt,...q.text.zh!.options,...q.text.zh!.rationales]),...l.qa.flatMap(q=>[q.text.zh!.question,q.text.zh!.originalQuestion??'',...q.text.zh!.answer,...(q.text.zh!.explanation??[]),...(q.text.zh!.editorial??[])])].join(' '),href:c.href,label:`AASE ${c.module.toUpperCase()}`};});
  return {concepts:publicConcepts,lessons:publicLessons,searchEntries};
}
