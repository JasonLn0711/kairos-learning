import m0302SvgLabels from './m0302-svg-labels.json' with {type:'json'};
import m0303SvgLabels from './m0303-svg-labels.json' with {type:'json'};
import m0304SvgLabels from './m0304-svg-labels.json' with {type:'json'};
import m0301SvgLabels from './m0301-svg-labels.json' with {type:'json'};
import m0207SvgLabels from './m0207-svg-labels.json' with {type:'json'};
import m0208SvgLabels from './m0208-svg-labels.json' with {type:'json'};
import {readingText,readableDiagram} from './article-reading.ts';
import m0206SvgLabels from './m0206-svg-labels.json' with { type: 'json' };
import m0204SvgLabels from './m0204-svg-labels.json' with { type: 'json' };
import m0205SvgLabels from './m0205-svg-labels.json' with { type: 'json' };
import m0203SvgLabels from './m0203-svg-labels.json' with { type: 'json' };
import m0202SvgLabels from './m0202-svg-labels.json' with { type: 'json' };
import m0201SvgLabels from './m0201-svg-labels.json' with { type: 'json' };
import m0906SvgLabels from './m0906-svg-labels.json' with { type: 'json' };
import m0905SvgLabels from './m0905-svg-labels.json' with { type: 'json' };
import m0904SvgLabels from './m0904-svg-labels.json' with { type: 'json' };
import m0903SvgLabels from './m0903-svg-labels.json' with { type: 'json' };
import { parseQA } from './qa-markdown.ts';
import { isPublic, localized, type Locale, type Bilingual, type SearchEntry } from './model.ts';
export type ConceptEntry = { id: string; module: string; title: Bilingual; displayId?: string };
export type ConceptVisual = {kind:'flow'|'cards';caption:string;description:string;items:{title:string;body:string}[]};
export type ConceptBlock = ConceptVisual | {kind:'table';caption:string;headers:string[];rows:string[][]} | {kind:'details'|'step';heading:string;paragraphs:string[];code?:string;id?:string};
export type ConceptCheck = {id:string;answer:number;text:Partial<Bilingual<{prompt:string;options:string[];rationales:string[]}>>};
export type SourceBlock = {kind:'sourceImage';src:string;alt:string;caption:string;openLabel:string;downloadLabel:string;width:number;height:number} | {kind:'answer';id:string;summary:string;paragraphs:string[]} | {kind:'dnsDiagram';id:'lookup'|'resolution'|'cname'|'axfr'} | {kind:'visual';visual:ConceptVisual;src:string;downloadLabel:string} | {kind:'accessDiagram';src:string;texts:string[]} | {kind:'paragraph'|'heading'|'code';text:string;id?:string} | {kind:'list';items:string[]} | {kind:'table';headers:string[];rows:string[][]};
export type ConceptDiscussion = {id:string;format?:'markdown';text:Partial<Bilingual<{question:string;originalQuestion?:string;answer:string[];explanation?:string[];editorial?:string[]}>>};
export type ConceptTeaching = {
  id: string; revision: number; contentVersion?: string; date: string; status: 'draft' | 'published'; publishedOn: string;
  text: Bilingual<{summary: string; sourceBody?: SourceBlock[]; sections: {id: string; heading: string; paragraphs: string[];blocks?:ConceptBlock[]}[]}>;
  checks?: ConceptCheck[];
  qa?: {id: string; format?: 'markdown'; text: Bilingual<{question: string; originalQuestion?:string; answer: string[]; explanation?: string[]; editorial?: string[]}>}[];
};
const contentVersionPattern = /^[1-9]\d*\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
export function compareContentVersions(a: string, b: string): number {
  if (!contentVersionPattern.test(a) || !contentVersionPattern.test(b)) throw new Error('Invalid content version');
  const left=a.split('.').map(BigInt), right=b.split('.').map(BigInt);
  for(let i=0;i<3;i++) { if(left[i]<right[i]) return -1; if(left[i]>right[i]) return 1; }
  return 0;
}
export const conceptVersionLabel = (t: Pick<ConceptTeaching,'revision'|'contentVersion'>) => `v${t.contentVersion ?? t.revision}`;
export const conceptModule = (id: string) => id.startsWith('CEH26-') ? id.slice(6,9).toLowerCase() : id.slice(0,3).toLowerCase();
// Public locators follow the module numbering; internal curriculum IDs remain immutable.
export const conceptSlug = (id: string) => /^CEH26-M04-C(?:0[1-9]|10)$/.test(id) ? `m04-${id.slice(-2)}` : id.toLowerCase();
export const conceptPath = (id: string, lang: Locale) => localized(`/courses/ceh/v13/${conceptModule(id)}/concepts/${conceptSlug(id)}/`,lang);
// One catalog controls routes, search, navigation and serialized public teaching.
export function createConceptCatalog(entries: ConceptEntry[], teachings: ConceptTeaching[], today: string) {
  const fail = (message: string): never => { throw new Error(`Concept content: ${message}`); };
  const nonempty = (s: unknown) => typeof s === 'string' && s.trim().length > 0;
  const ids = new Set<string>();
  const paths = new Set<string>();
  for (const c of entries) {
    if (!(/^(?:M\d{2}-\d{2}|CEH26-M04-C(?:0[1-9]|10))$/.test(c.id)) || c.module !== conceptModule(c.id) || ids.has(c.id)) fail(`invalid or duplicate ID ${c.id}`);
    for (const lang of ['zh','en'] as const) if (!nonempty(c.title?.[lang])) fail(`${c.id}: missing ${lang} title`);
    if(c.displayId !== undefined && (!/^CEH26-M04-C(?:0[1-9]|10)$/.test(c.id) || ![`CEH M04-${c.id.slice(-2)}`,`M04-${c.id.slice(-2)}`].includes(c.displayId))) fail(`${c.id}: invalid display identity`);
    const path=conceptPath(c.id,'zh');
    if(paths.has(path)) fail(`duplicate public path ${path}`);
    paths.add(path);
    ids.add(c.id);
  }
  const seen = new Set<string>();
  for (const t of teachings) {
    if (!ids.has(t.id) || seen.has(t.id)) fail(`unknown or duplicate teaching ${t.id}`);
    seen.add(t.id);
    if (t.contentVersion !== undefined && (typeof t.contentVersion !== 'string' || !contentVersionPattern.test(t.contentVersion))) fail(`${t.id}: invalid content version`);
    if (!Number.isInteger(t.revision) || t.revision < 1 || !['draft','published'].includes(t.status) || !isPublic({status:'published',publishedOn:t.publishedOn},'9999-12-31') || !isPublic({status:'published',publishedOn:t.date},'9999-12-31')) fail(`${t.id}: invalid revision/status/date`);
    for (const lang of ['zh','en'] as const) {
      const text = t.text?.[lang];
      if (!nonempty(text?.summary) || (!text?.sections?.length && !text?.sourceBody?.length)) fail(`${t.id}: missing ${lang} teaching`);
      const headings = new Set<string>(['discussion']);
      if(text.sourceBody) {
        if(text.sections.length || !text.sourceBody.length) fail(`${t.id}: mixed source body`);
        for(const block of text.sourceBody) {
          if(block.kind==='sourceImage') {if(!/^\/images\/ceh\/[a-z0-9-]+\.svg$/.test(block.src)||![block.alt,block.caption,block.openLabel,block.downloadLabel].every(nonempty)||!Number.isInteger(block.width)||!Number.isInteger(block.height)||block.width<1||block.height<1) fail(`${t.id}: invalid source image`);}
          else if(block.kind==='dnsDiagram') {if(!['lookup','resolution','cname','axfr'].includes(block.id)) fail(`${t.id}: invalid DNS diagram`);}
          else if(block.kind==='visual') {const v=block.visual;if(!/^\/images\/ceh\/[a-z0-9-]+\.svg$/.test(block.src)||!nonempty(block.downloadLabel)||!['flow','cards'].includes(v.kind)||!nonempty(v.caption)||!nonempty(v.description)||!v.items?.length||!v.items.every(i=>nonempty(i.title)&&nonempty(i.body))) fail(`${t.id}: invalid source visual`);if(['/images/ceh/snmp-manager-zh.svg','/images/ceh/snmp-manager-en.svg'].includes(block.src)&&(v.kind!=='cards'||v.items.length!==4))fail(`${t.id}: invalid SNMP topology`);const ftp=block.src.match(/^\/images\/ceh\/m04-03-(protocols|evidence)-(zh|en)-v1-1-0\.svg$/);if(ftp&&(v.kind!=='cards'||v.items.length!==(ftp[1]==='protocols'?11:3)||(ftp[1]==='evidence'&&v.items.some(i=>i.body.split('\n').length!==3))))fail(`${t.id}: invalid FTP/SMTP diagram structure`);const other=block.src.match(/^\/images\/ceh\/m04-09-(ladder|stratum|ntp-network|ike|sip|bgp|legacy|case|report)-(zh|en)-v1-0-0\.svg$/);if(other){const counts:Record<string,number>={ladder:5,stratum:3,'ntp-network':14,ike:3,sip:2,bgp:5,legacy:2,case:3,report:3};if(v.items.length!==counts[other[1]]||v.kind!==(['ladder','stratum','ike','report'].includes(other[1])?'flow':'cards'))fail(`${t.id}: invalid other enumeration diagram`);}const otherNew=block.src.match(/^\/images\/ceh\/m04-09-(roles|stages|ladder|stratum|ntp-network|ike|sip|bgp|telnet|tftp|report)-(zh|en)-v1-1-0\.svg$/);if(otherNew){const counts:Record<string,number>={roles:6,stages:3,ladder:5,stratum:4,'ntp-network':14,ike:3,sip:2,bgp:4,telnet:2,tftp:2,report:3};if(v.items.length!==counts[otherNew[1]]||v.kind!==(['stages','ladder','stratum','ike'].includes(otherNew[1])?'flow':'cards'))fail(`${t.id}: invalid other enumeration diagram`);}const nfs=block.src.match(/^\/images\/ceh\/m04-06-(mount|permissions)-(zh|en)-v1-0-0\.svg$/);if(nfs&&(v.kind!=='cards'||v.items.length!==(nfs[1]==='mount'?3:4)))fail(`${t.id}: invalid NFS diagram structure`);}
          else if(block.kind==='accessDiagram') { if(block.src!=='/images/ceh/m04-01-access-results.svg' || block.texts?.length!==8 || !block.texts.every(nonempty)) fail(`${t.id}: invalid access diagram`); }
          else if(block.kind==='table') { if(!block.headers?.length || !block.headers.every(nonempty) || !block.rows?.length || !block.rows.every(row=>row.length===block.headers.length&&row.every(nonempty))) fail(`${t.id}: invalid source table`); }
          else if(block.kind==='answer') { if(!/^answer-[a-z0-9-]+$/.test(block.id)||headings.has(block.id)||!nonempty(block.summary)||!block.paragraphs?.length||!block.paragraphs.every(nonempty)) fail(`${t.id}: invalid reference answer`);headings.add(block.id); }
          else if(block.kind==='list') { if(!block.items?.length||!block.items.every(nonempty)) fail(`${t.id}: invalid source list`); }
          else if(['paragraph','heading','code'].includes(block.kind)) {
            if(!nonempty(block.text)) fail(`${t.id}: invalid source text`);
            if(block.kind==='heading') {if(!block.id||!/^[a-z][a-z0-9-]*$/.test(block.id)||headings.has(block.id)||block.id.startsWith('qa-')) fail(`${t.id}: invalid source heading`);headings.add(block.id!);}
          } else fail(`${t.id}: unknown source block`);
        }
      }
      for (const s of text.sections) {
        if (!/^[a-z][a-z0-9-]*$/.test(s.id) || headings.has(s.id) || s.id.startsWith('qa-') || !nonempty(s.heading) || !s.paragraphs?.length || !s.paragraphs.every(nonempty)) fail(`${t.id}: invalid section ${s.id}`);
        headings.add(s.id);
        for(const block of s.blocks ?? []) {
          if(block.kind === 'flow' || block.kind === 'cards') {
            if(!nonempty(block.caption) || !nonempty(block.description) || !block.items?.length || !block.items.every(item=>nonempty(item.title)&&nonempty(item.body))) fail(`${t.id}: invalid visual`);
          } else if(block.kind === 'table') {
            if(!nonempty(block.caption) || !block.headers?.length || !block.headers.every(nonempty) || !block.rows?.length || !block.rows.every(row => row.length === block.headers.length && row.every(nonempty))) fail(`${t.id}: invalid table`);
          } else if(block.kind === 'step' || block.kind === 'details') {
            if(!nonempty(block.heading) || !block.paragraphs?.length || !block.paragraphs.every(nonempty) || (block.code !== undefined && !nonempty(block.code))) fail(`${t.id}: invalid content block`);
            if(block.id) {if(headings.has(block.id)) fail(`${t.id}: duplicate block anchor`);headings.add(block.id);}
          } else fail(`${t.id}: unknown content block`);
        }
      }
    }
    if (!t.text.zh.sourceBody && !t.text.en.sourceBody && JSON.stringify(t.text.zh.sections.map(s=>s.id)) !== JSON.stringify(t.text.en.sections.map(s=>s.id))) fail(`${t.id}: bilingual section IDs differ`);
    const checkIds=new Set<string>();
    for(const q of t.checks ?? []) {
      if(!/^[a-zA-Z0-9-]+$/.test(q.id) || checkIds.has(q.id) || !Number.isInteger(q.answer) || q.answer<0 || q.answer>3) fail(`${t.id}: invalid test identity/key`);
      checkIds.add(q.id);
      if(!q.text?.zh && !q.text?.en) fail(`${t.id}: empty test translation`);
      for(const lang of ['zh','en'] as const) {
        const text=q.text?.[lang];
        if(text===undefined) continue;
        if(!nonempty(text?.prompt) || text?.options?.length!==4 || text?.rationales?.length!==4 || !text.options.every(nonempty) || !text.rationales.every(nonempty)) fail(`${t.id}: incomplete ${lang} test explanation`);
      }
    }
    const qaIds = new Set<string>();
    if (t.qa !== undefined && !Array.isArray(t.qa)) fail(`${t.id}: qa must be an array`);
    for (const q of t.qa ?? []) {
      if(q.format && q.format!=='markdown') fail(`${t.id}: invalid Q&A format`);
      if (!/^[a-z0-9-]+$/.test(q.id) || qaIds.has(q.id)) fail(`${t.id}: invalid Q&A ID`);
      qaIds.add(q.id);
      for (const lang of ['zh','en'] as const) {
        if (!nonempty(q.text?.[lang]?.question) || !q.text[lang].answer?.length || !q.text[lang].answer.every(nonempty)) fail(`${t.id}: missing ${lang} Q&A`);
        if(q.format==='markdown' && (parseQA(q.text[lang].answer.join('\n\n')).filter(b=>b.kind==='quiz').length!==1 || !q.text[lang].explanation?.length)) fail(`${t.id}: incomplete Q&A teaching test`);
      }
    }
  }
  const published = new Map(teachings.filter(t=>isPublic(t,today)).map(t=>[t.id,t]));
  const list = (lang: Locale) => entries.map(c=>({...c,href:published.has(c.id)?conceptPath(c.id,lang):null}));
  const get = (id: string, lang: Locale) => {
    const teaching = published.get(id);
    if (!teaching) return null;
    const items = list(lang); const at = items.findIndex(c=>c.id===id);
    return { teaching, navigation: {previous:items[at-1] ?? null,next:items[at+1] ?? null} };
  };
  const searchEntries: SearchEntry[] = (['zh','en'] as Locale[]).flatMap(lang=>entries.flatMap(c=>{
    const t=published.get(c.id); if (!t) return [];
    return [{id:c.id,lang,title:`${c.displayId ?? c.id} · ${c.title[lang]}`,summary:t.text[lang].summary,text:[...(c.displayId ? [c.id] : []),...readingText(t.id,lang),...(t.id==='M03-02'?m0302SvgLabels[lang]:[]),...(t.id==='M03-03'?m0303SvgLabels[lang]:[]),...(t.id==='M03-04'?m0304SvgLabels[lang]:[]),...(t.id==='M03-01'?m0301SvgLabels[lang]:[]),...(t.id==='M02-07'?m0207SvgLabels[lang]:[]),...(t.id==='M02-08'?m0208SvgLabels[lang]:[]),...(t.id==='M02-06'?m0206SvgLabels[lang]:[]),...(t.id==='M02-04'?m0204SvgLabels[lang]:[]),...(t.id==='M02-05'?m0205SvgLabels[lang]:[]),...(t.id==='M02-03'?m0203SvgLabels[lang]:[]),...(t.id==='M02-02'?m0202SvgLabels[lang]:[]),...(t.id==='M02-01'?m0201SvgLabels[lang]:[]),...(t.id==='M09-06'?m0906SvgLabels[lang]:[]),...(t.id==='M09-05'?m0905SvgLabels[lang]:[]),...(t.id==='M09-04'?m0904SvgLabels[lang]:[]),...(t.id==='M09-03'?m0903SvgLabels[lang]:[]),...(t.contentVersion ? [conceptVersionLabel(t)] : []),...(t.text[lang].sourceBody??[]).flatMap(b=>b.kind==='sourceImage'?[b.alt,b.caption,...(readableDiagram(b.src,lang)?.rows.flat()??[]),readableDiagram(b.src,lang)?.description??'']:b.kind==='dnsDiagram'?[]:b.kind==='visual'?[b.visual.caption,b.visual.description,...b.visual.items.flatMap(i=>[i.title,i.body])]:b.kind==='accessDiagram'?b.texts:b.kind==='table'?[...b.headers,...b.rows.flat()]:b.kind==='list'?b.items:b.kind==='answer'?[b.summary,...b.paragraphs]:[b.text]),...t.text[lang].sections.flatMap(s=>[s.heading,...s.paragraphs,...(s.blocks??[]).flatMap(b=>b.kind==='table'?[b.caption,...b.headers,...b.rows.flat()]:'items' in b?[b.caption,b.description,...b.items.flatMap(i=>[i.title,i.body])]:[b.heading,...b.paragraphs,b.code??''])]),...(t.checks??[]).flatMap(q=>{const text=q.text[lang];return text?[text.prompt,...text.options,...text.rationales]:[];}),...(t.qa??[]).flatMap(q=>[q.text[lang].question,q.text[lang].originalQuestion??'',...q.text[lang].answer,...(q.text[lang].editorial??[]),...(q.text[lang].explanation??[])])].join(' '),href:conceptPath(c.id,lang),label:`CEH ${c.module.toUpperCase()}`}];
  }));
  return {list,get,searchEntries};
}
