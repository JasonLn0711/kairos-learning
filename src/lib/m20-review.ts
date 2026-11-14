import type {NoteProse} from './ceh-notes.ts';
import {noteBodyText} from './ceh-notes.ts';
import {validateNoteDiagram,type NoteDiagram} from './note-diagrams.ts';
import type {Source} from './model.ts';
export const m20ReviewPath='/ceh-notes/m20-cryptography/';
export type M20Review={title:string;summary:string;status:'draft'|'published';publishedOn:string;revisedOn:string;revision:number;contentVersion:string;sections:{id:string;heading:string;collapsible?:true;aliases?:string[];body:(NoteProse|NoteDiagram)[]}[];sources:Source[]};
export function validateM20Review(value:M20Review):M20Review {
 const fail=():never=>{throw Error('Invalid M20 review content');};
 const filled=(s:unknown)=>typeof s==='string'&&s.trim().length>0;
 const only=(v:object,keys:string[])=>{if(Object.keys(v).some(k=>!keys.includes(k)))fail();};
 only(value,['title','summary','status','publishedOn','revisedOn','revision','contentVersion','sections','sources']);
 if(!filled(value.title)||!filled(value.summary)||!['draft','published'].includes(value.status)||!/^\d{4}-\d{2}-\d{2}$/.test(value.publishedOn)||!Number.isFinite(Date.parse(value.publishedOn))||new Date(value.publishedOn).toISOString().slice(0,10)!==value.publishedOn||!/^\d+\.\d+\.\d+$/.test(value.contentVersion)||!value.sections.length||!value.sources.length)fail();
 if(!Number.isInteger(value.revision)||value.revision<1||!/^\d{4}-\d{2}-\d{2}$/.test(value.revisedOn)||!Number.isFinite(Date.parse(value.revisedOn))||new Date(value.revisedOn).toISOString().slice(0,10)!==value.revisedOn||value.revisedOn<value.publishedOn)fail();
 const ids=new Set<string>(['main','m20-sources']),figures=new Set<string>();
 const anchor=(s:string)=>{if(!/^p1-[a-z0-9-]+$/.test(s)||ids.has(s))fail();ids.add(s);};
 for(const section of value.sections){
  only(section,['id','heading','body','collapsible','aliases']);anchor(section.id);
  if(section.collapsible!==undefined&&(section.collapsible!==true||section.id!=='p1-csrf-browser-intro'))fail();
  if(section.aliases!==undefined){if(!section.collapsible||!Array.isArray(section.aliases)||section.aliases.length>50)fail();for(const id of section.aliases)anchor(id);}
 if(!filled(section.heading)||!section.body.length)fail();
  for(const b of section.body){
   const fields:Record<string,string[]>={paragraph:['kind','text'],heading:['kind','id','text'],code:['kind','text'],list:['kind','items'],table:['kind','headers','rows'],answer:['kind','id','summary','paragraphs'],diagram:['kind','name','caption','description','items']};
   if(!fields[b.kind])fail();only(b,fields[b.kind]);
   if(!noteBodyText(b).every(filled)||!noteBodyText(b).length)fail();
   if('id' in b&&b.id)anchor(b.id);
   if(b.kind==='heading'&&!b.id)fail();
   if(b.kind==='table'&&(!b.headers.length||!b.rows.length||b.rows.some(r=>r.length!==b.headers.length)))fail();
   if(b.kind==='diagram'){validateNoteDiagram(b);if(!b.name.startsWith('m20')||figures.has(b.name))fail();figures.add(b.name);}
  }
 }
 for(const s of value.sources){only(s,['id','title','url','checkedOn']);if(!filled(s.id)||!filled(s.title)||!/^https:\/\/[^\s]+$/.test(s.url)||!/^\d{4}-\d{2}-\d{2}$/.test(s.checkedOn))fail();}
 return value;
}
