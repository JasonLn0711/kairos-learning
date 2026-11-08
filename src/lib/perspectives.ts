import {validatePerspectiveBody,perspectiveBodyShape,type PerspectiveBlock} from './perspective-body.ts';
import {validateDiagram, type TeachingDiagram} from './perspective-diagrams.ts';
import {isPublic, type Bilingual} from './model.ts';
export type Perspective = {
 id:string;slug:string;status:'draft'|'published';publishedOn:string;updatedOn:string;contentVersion:string;revision:number;
 category:'analysis'|'field-notes'|'reflection';topics:('cs'|'ai'|'security')[];observedAt?:string;
 text:Bilingual<{title:string;summary:string;author:string;sections:{id:string;heading:string;paragraphs:string[];body?:PerspectiveBlock[];list?:string[];code?:string;table?:{headers:string[];rows:string[][]};sourceIds?:string[];diagram?:TeachingDiagram}[]}>;
 sources:{id:string;title:string;url:string;checkedOn:string}[];
 related:{kind:'lesson'|'concept';id:string}[];
 updates:{date:string;text:Bilingual}[];
};
export function validatePerspectives(items:Perspective[],known:{lesson:Set<string>;concept:Set<string>}) {
 const ids=new Set<string>(),slugs=new Set<string>();
 const date=(d:string)=>isPublic({status:'published',publishedOn:d},'9999-12-31');
 const nonempty=(s:unknown)=>typeof s==='string'&&s.trim().length>0;
 for(const p of items){
  const fail=(msg:string):never=>{throw Error(`Perspective ${p.id}: ${msg}`)};
  if(!/^[a-z][a-z0-9-]*$/.test(p.id)||ids.has(p.id)||!/^[a-z][a-z0-9-]*$/.test(p.slug)||slugs.has(p.slug))fail('invalid or duplicate identity');
  ids.add(p.id);slugs.add(p.slug);
  if(!['draft','published'].includes(p.status)||!date(p.publishedOn)||!date(p.updatedOn)||p.updatedOn<p.publishedOn||!Number.isInteger(p.revision)||p.revision<1)fail('invalid publication metadata');
  if(typeof p.contentVersion!=='string'||!/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(p.contentVersion))fail('invalid content version');
  if(!['analysis','field-notes','reflection'].includes(p.category)||!p.topics?.length||p.topics.some(t=>!['cs','ai','security'].includes(t)))fail('invalid category/topics');
  if(p.category==='field-notes'&&!p.observedAt)fail('field notes require observation time');
  if(p.observedAt&&(!Number.isFinite(Date.parse(p.observedAt))||!/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(p.observedAt)))fail('observation requires timestamp and timezone');
  const sources=new Set<string>();
  if(!Array.isArray(p.sources)||!Array.isArray(p.related)||!Array.isArray(p.updates))fail('missing collection');
  for(const s of p.sources){if(!/^[a-z][a-z0-9-]*$/.test(s.id)||sources.has(s.id)||!nonempty(s.title)||!/^https:\/\//.test(s.url)||!date(s.checkedOn))fail('invalid source');sources.add(s.id)}
  for(const lang of ['zh','en'] as const){const t=p.text?.[lang];if(!t||![t.title,t.summary,t.author].every(nonempty)||!t.sections?.length)fail('missing translation');const anchors=new Set(['main','sources','related','updates']);
   for(const s of t.sections){if(!/^[a-z][a-z0-9-]*$/.test(s.id)||anchors.has(s.id)||!nonempty(s.heading)||!Array.isArray(s.paragraphs)||(!s.paragraphs.length&&!s.body?.length)||!s.paragraphs.every(nonempty))fail('invalid section');anchors.add(s.id);if(s.body){if(s.list||s.code||s.table)fail('mixed ordered and legacy body');validatePerspectiveBody(s.body,anchors);}if(s.diagram)validateDiagram(s.diagram);if(s.list&&(!s.list.length||!s.list.every(nonempty)))fail('invalid list');if(s.sourceIds?.some(id=>!sources.has(id)))fail('unknown source');if(s.table&&(!s.table.headers.length||s.table.rows.some(r=>r.length!==s.table!.headers.length)))fail('invalid table');}
  }
  if(p.text.zh.sections.map(s=>s.id).join()!==p.text.en.sections.map(s=>s.id).join())fail('translation sections mismatch');
  for(let i=0;i<p.text.zh.sections.length;i++){const za=p.text.zh.sections[i].body,eb=p.text.en.sections[i].body;if(Boolean(za)!==Boolean(eb)||za&&eb&&perspectiveBodyShape(za)!==perspectiveBodyShape(eb))fail('translation body mismatch');const a=p.text.zh.sections[i].diagram,b=p.text.en.sections[i].diagram;if(Boolean(a)!==Boolean(b)||a&&b&&(a.id!==b.id||a.layout!==b.layout||a.groups.flatMap(g=>g.items.map(n=>[n.state,n.cells?.join('|')].join(':'))).join()!==b.groups.flatMap(g=>g.items.map(n=>[n.state,n.cells?.join('|')].join(':'))).join()||a.groups.map(g=>g.mode+g.items.length).join()!==b.groups.map(g=>g.mode+g.items.length).join()))fail('translation diagrams mismatch');}
  for(const lang of ['zh','en'] as const){const diagrams=p.text[lang].sections.flatMap(s=>s.diagram?[s.diagram.id]:[]);if(new Set(diagrams).size!==diagrams.length)fail('duplicate diagram');}
  for(const r of p.related??[])if(!known[r.kind]?.has(r.id))fail('unknown related content');
  for(const u of p.updates??[])if(!date(u.date)||!nonempty(u.text.zh)||!nonempty(u.text.en))fail('invalid update');
 }
 return items;
}
