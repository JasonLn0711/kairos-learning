import {isPublic,localized,type Bilingual,type Locale,type SearchEntry,type Source} from './model.ts';
import type {SourceBlock} from './concepts.ts';
export type NoteProse = Extract<SourceBlock,{kind:'paragraph'|'heading'|'code'|'list'|'table'|'answer'}>;
export type NoteFigure = {kind:'figure';name:'workflow'|'cia';caption:string;description:string;items:{title:string;body:string}[]};
export type NoteRecall = {kind:'recall';caption:string;description:string;cards:{question:string;references:string;answer:string[]}[]};
export type NoteChecks = {kind:'checks';items:{id:string;prompt:string;options:string[];answer:number;rationales:string[]}[]};
export type NoteBlock = NoteProse | NoteFigure | NoteRecall | NoteChecks;
export type NotePart = {number:number;status:'draft'|'published';publishedOn:string;text:Bilingual<{title:string;sections:{id:string;heading:string;body:NoteBlock[]}[]}>};
export type DailyNote = {date:string;revision:number;status:'draft'|'published';publishedOn:string;revisedOn:string;expectedParts:number;text:Bilingual<{title:string;summary:string}>;parts:NotePart[];sources:Source[]};
export const notePath = (date:string,lang:Locale) => localized(`/ceh-notes/${date}/`,lang);
export const noteFigurePath = (date:string,part:number,name:string,lang:Locale) => `/images/ceh-notes/${date}-part-${part}-${name}-${lang}.svg`;
export function noteBodyText(block:NoteBlock):string[] {
  if(block.kind==='figure')return [block.caption,block.description,...block.items.flatMap(i=>[i.title,i.body])];
  if(block.kind==='recall')return [block.caption,block.description,...block.cards.flatMap(c=>[c.question,c.references,...c.answer])];
  if(block.kind==='checks')return block.items.flatMap(q=>[q.prompt,...q.options,...q.rationales]);
  if(block.kind==='list')return block.items;
  if(block.kind==='table')return [...block.headers,...block.rows.flat()];
  if(block.kind==='answer')return [block.summary,...block.paragraphs];
  return [block.text];
}
export function createNotesCatalog(input:DailyNote[],today:string) {
  const fail=(message:string):never=>{throw Error('CEH notes: '+message);};
  const validDate=(s:string)=>/^\d{4}-\d{2}-\d{2}$/.test(s)&&Number.isFinite(Date.parse(s))&&new Date(s).toISOString().slice(0,10)===s;
  const filled=(s:unknown)=>typeof s==='string'&&s.trim().length>0;
  const only=(value:object,keys:string[])=>{if(Object.keys(value).some(k=>!keys.includes(k)))fail('unsupported field');};
  const dates=new Set<string>();
  for(const n of input) {
    only(n,['date','revision','status','publishedOn','revisedOn','expectedParts','text','parts','sources']);
    only(n.text,['zh','en']);
    if(!validDate(n.date)||dates.has(n.date)||!validDate(n.publishedOn)||!validDate(n.revisedOn)||n.revisedOn<n.publishedOn||!['draft','published'].includes(n.status)||!Number.isInteger(n.revision)||n.revision<1||!Number.isInteger(n.expectedParts)||n.expectedParts<1)fail('invalid date, identity or revision');
    dates.add(n.date);
    if(!n.parts.length||!n.sources.length)fail('missing parts or sources');
    if(new Set(n.sources.map(s=>s.id)).size!==n.sources.length)fail('duplicate source');
    for(const s of n.sources){only(s,['id','title','url','checkedOn']);if(!filled(s.id)||!filled(s.title)||!/^https:\/\/[^\s]+$/.test(s.url)||!validDate(s.checkedOn))fail('invalid source');}
    const numbers=new Set<number>();
    for(const p of n.parts) {
      only(p,['number','status','publishedOn','text']);only(p.text,['zh','en']);
      if(!Number.isInteger(p.number)||p.number<1||p.number>n.expectedParts||numbers.has(p.number)||!validDate(p.publishedOn)||p.publishedOn<n.publishedOn||!['draft','published'].includes(p.status))fail('invalid part');
      numbers.add(p.number);
      for(const lang of ['zh','en'] as const) {
        only(n.text[lang],['title','summary']);only(p.text[lang],['title','sections']);
        const figures=new Set<string>();
        if(!filled(n.text?.[lang]?.title)||!filled(n.text[lang].summary)||!filled(p.text?.[lang]?.title)||!p.text[lang].sections.length)fail('missing translation');
        const anchors=new Set<string>();
        const anchor=(id:string)=>{if(!id.startsWith('p'+p.number+'-')||!/^[a-z][a-z0-9-]*$/.test(id)||anchors.has(id))fail('invalid or duplicate anchor');anchors.add(id);};
        for(const s of p.text[lang].sections) {
          only(s,['id','heading','body']);
          anchor(s.id);if(!filled(s.heading)||!s.body.length)fail('empty section');
          for(const b of s.body) {
            const fields:Record<NoteBlock['kind'],string[]>={paragraph:['kind','id','text'],heading:['kind','id','text'],code:['kind','text'],list:['kind','items'],table:['kind','headers','rows'],answer:['kind','id','summary','paragraphs'],figure:['kind','name','caption','description','items'],recall:['kind','caption','description','cards'],checks:['kind','items']};
            if(!fields[b.kind]||Object.keys(b).some(k=>!fields[b.kind].includes(k)))fail('unsupported block or markup field');
            if(!noteBodyText(b).length||!noteBodyText(b).every(filled))fail('empty block text');
            if('id' in b&&b.id)anchor(b.id);
            if(b.kind==='heading'&&!b.id)fail('missing heading anchor');
            if(b.kind==='table'&&(!b.headers.length||!b.rows.length||b.rows.some(r=>r.length!==b.headers.length)))fail('invalid table');
            if(b.kind==='figure'||b.kind==='recall'){const name=b.kind==='figure'?b.name:'recall';if(figures.has(name))fail('duplicate figure');figures.add(name);}
            if(b.kind==='figure') {
              if(!['workflow','cia'].includes(b.name)||b.items.length!==(b.name==='workflow'?4:3))fail('invalid figure structure');
              if(b.items.some(i=>Object.keys(i).sort().join(',')!=='body,title'))fail('unsupported figure field');
            }
            if(b.kind==='recall'&&(b.cards.length!==3||b.cards.some(c=>Object.keys(c).sort().join(',')!=='answer,question,references'||!c.answer.length)))fail('invalid recall cards');
            if(b.kind==='checks')for(const q of b.items){anchor(q.id);if(Object.keys(q).sort().join(',')!=='answer,id,options,prompt,rationales'||q.options.length!==3||q.rationales.length!==3||!Number.isInteger(q.answer)||q.answer<0||q.answer>2)fail('invalid check');}
          }
        }
      }
      const shape=(lang:Locale)=>p.text[lang].sections.map(s=>[s.id,s.body.map(b=>[b.kind,...(b.kind==='figure'?[b.name,b.items.length]:b.kind==='recall'?[b.cards.length]:b.kind==='table'?[b.headers.length,b.rows.length]:b.kind==='checks'?[b.items.map(q=>[q.id,q.answer,q.options.length])]:[])])]);
      if(JSON.stringify(shape('zh'))!==JSON.stringify(shape('en')))fail('bilingual structure differs');
    }
  }
  const notes=input.filter(n=>isPublic(n,today)).map(n=>({...n,parts:n.parts.filter(p=>isPublic(p,today)).sort((a,b)=>a.number-b.number)})).filter(n=>n.parts.length).sort((a,b)=>b.date.localeCompare(a.date));
  const searchEntries:SearchEntry[]=notes.flatMap(n=>(['zh','en'] as const).map(lang=>({id:'CEH-NOTES-'+n.date,lang,...n.text[lang],text:n.parts.flatMap(p=>[p.text[lang].title,...p.text[lang].sections.flatMap(s=>[s.heading,...s.body.flatMap(noteBodyText)])]).join(' '),href:notePath(n.date,lang),label:lang==='zh'?'CEH · 每日筆記':'CEH · Daily notes'})));
  return {notes,searchEntries};
}
