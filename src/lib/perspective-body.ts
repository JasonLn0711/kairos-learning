import systemsModels from './cs-systems-diagrams.json' with {type:'json'};
export const systemsFigureNames=['lifecycle','hardware','links','cas','environment','docker','git-areas','git-dag'] as const;
export type SystemsFigureName=typeof systemsFigureNames[number];
/** Ordered, escaped-text long-form content. No HTML or arbitrary assets. */
export type PerspectiveBlock =
 | {kind:'systemsFigure';name:SystemsFigureName}
 | {kind:'paragraph';text:string}
 | {kind:'heading';id:string;text:string}
 | {kind:'code';text:string}
 | {kind:'list';items:string[]}
 | {kind:'table';headers:string[];rows:string[][]};
export function perspectiveBodyText(blocks:PerspectiveBlock[]):string[]{
 return blocks.flatMap(b=>b.kind==='systemsFigure'?[...(['zh','en'] as const).flatMap(lang=>[systemsModels[b.name].title[lang],systemsModels[b.name].note[lang],...systemsModels[b.name].nodes.flatMap(n=>[n[lang].title,n[lang].body])])]:b.kind==='table'?[...b.headers,...b.rows.flat()]:b.kind==='list'?b.items:[b.text]);
}
export function validatePerspectiveBody(blocks:PerspectiveBlock[],anchors:Set<string>):void{
 const text=(v:unknown)=>typeof v==='string'&&v.trim().length>0;
 const strings=(v:unknown):v is string[]=>Array.isArray(v)&&v.length>0&&v.every(text);
 if(!Array.isArray(blocks)||!blocks.length)throw Error('invalid perspective body');
 for(const b of blocks){
  if(!b||!['paragraph','heading','code','list','table','systemsFigure'].includes(b.kind))throw Error('invalid perspective block');
  const fields=b.kind==='systemsFigure'?['kind','name']:b.kind==='table'?['kind','headers','rows']:b.kind==='list'?['kind','items']:b.kind==='heading'?['kind','id','text']:['kind','text'];
  if(Object.keys(b).some(k=>!fields.includes(k)))throw Error('unexpected perspective block field');
  if(b.kind==='systemsFigure'){if(!systemsFigureNames.includes(b.name))throw Error('invalid systems figure');}
  else if(b.kind==='table'){
   if(!strings(b.headers)||!Array.isArray(b.rows)||!b.rows.length||b.rows.some(r=>!strings(r)||r.length!==b.headers.length))throw Error('invalid perspective table');
  }else if(b.kind==='list'){if(!strings(b.items))throw Error('invalid perspective list');}
  else if(!text(b.text))throw Error('invalid perspective text');
  if(b.kind==='heading'){
   if(!/^[a-z][a-z0-9-]*$/.test(b.id)||anchors.has(b.id))throw Error('invalid perspective heading');
   anchors.add(b.id);
  }
 }
}
export function perspectiveBodyShape(blocks:PerspectiveBlock[]):string{
 return JSON.stringify(blocks.map(b=>b.kind==='systemsFigure'?[b.kind,b.name]:b.kind==='heading'?[b.kind,b.id]:b.kind==='table'?[b.kind,b.headers.length,b.rows.length]:b.kind==='list'?[b.kind,b.items.length]:[b.kind]));
}
