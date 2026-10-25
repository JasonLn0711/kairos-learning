import { parseQA } from './qa-markdown.ts';
import { isPublic, localized, type Locale, type Bilingual, type SearchEntry } from './model.ts';
export type ConceptEntry = { id: string; module: string; title: Bilingual };
export type ConceptVisual = {kind:'flow'|'cards';caption:string;description:string;items:{title:string;body:string}[]};
export type ConceptBlock = ConceptVisual | {kind:'table';caption:string;headers:string[];rows:string[][]} | {kind:'details'|'step';heading:string;paragraphs:string[];code?:string;id?:string};
export type ConceptCheck = {id:string;answer:number;text:Partial<Bilingual<{prompt:string;options:string[];rationales:string[]}>>};
export type SourceBlock = {kind:'accessDiagram';src:string;texts:string[]} | {kind:'paragraph'|'heading'|'code';text:string;id?:string} | {kind:'list';items:string[]} | {kind:'table';headers:string[];rows:string[][]};
export type ConceptTeaching = {
  id: string; revision: number; date: string; status: 'draft' | 'published'; publishedOn: string;
  text: Bilingual<{summary: string; sourceBody?: SourceBlock[]; sections: {id: string; heading: string; paragraphs: string[];blocks?:ConceptBlock[]}[]}>;
  checks?: ConceptCheck[];
  qa?: {id: string; format?: 'markdown'; text: Bilingual<{question: string; originalQuestion?:string; answer: string[]; explanation?: string[]; editorial?: string[]}>}[];
};
export const conceptPath = (id: string, lang: Locale) => localized(`/courses/ceh/v13/${id.slice(0,3).toLowerCase()}/concepts/${id.toLowerCase()}/`,lang);
// One catalog controls routes, search, navigation and serialized public teaching.
export function createConceptCatalog(entries: ConceptEntry[], teachings: ConceptTeaching[], today: string) {
  const fail = (message: string): never => { throw new Error(`Concept content: ${message}`); };
  const nonempty = (s: unknown) => typeof s === 'string' && s.trim().length > 0;
  const ids = new Set<string>();
  for (const c of entries) {
    if (!/^M\d{2}-\d{2}$/.test(c.id) || c.module !== c.id.slice(0,3).toLowerCase() || ids.has(c.id)) fail(`invalid or duplicate ID ${c.id}`);
    for (const lang of ['zh','en'] as const) if (!nonempty(c.title?.[lang])) fail(`${c.id}: missing ${lang} title`);
    ids.add(c.id);
  }
  const seen = new Set<string>();
  for (const t of teachings) {
    if (!ids.has(t.id) || seen.has(t.id)) fail(`unknown or duplicate teaching ${t.id}`);
    seen.add(t.id);
    if (!Number.isInteger(t.revision) || t.revision < 1 || !['draft','published'].includes(t.status) || !isPublic({status:'published',publishedOn:t.publishedOn},'9999-12-31') || !isPublic({status:'published',publishedOn:t.date},'9999-12-31')) fail(`${t.id}: invalid revision/status/date`);
    for (const lang of ['zh','en'] as const) {
      const text = t.text?.[lang];
      if (!nonempty(text?.summary) || (!text?.sections?.length && !text?.sourceBody?.length)) fail(`${t.id}: missing ${lang} teaching`);
      const headings = new Set<string>(['discussion']);
      if(text.sourceBody) {
        if(text.sections.length || !text.sourceBody.length) fail(`${t.id}: mixed source body`);
        for(const block of text.sourceBody) {
          if(block.kind==='accessDiagram') { if(block.src!=='/images/ceh/m04-01-access-results.svg' || block.texts?.length!==8 || !block.texts.every(nonempty)) fail(`${t.id}: invalid access diagram`); }
          else if(block.kind==='table') { if(!block.headers?.length || !block.headers.every(nonempty) || !block.rows?.length || !block.rows.every(row=>row.length===block.headers.length&&row.every(nonempty))) fail(`${t.id}: invalid source table`); }
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
    return [{id:c.id,lang,title:`${c.id} · ${c.title[lang]}`,summary:t.text[lang].summary,text:[...(t.text[lang].sourceBody??[]).flatMap(b=>b.kind==='accessDiagram'?b.texts:b.kind==='table'?[...b.headers,...b.rows.flat()]:b.kind==='list'?b.items:[b.text]),...t.text[lang].sections.flatMap(s=>[s.heading,...s.paragraphs,...(s.blocks??[]).flatMap(b=>b.kind==='table'?[b.caption,...b.headers,...b.rows.flat()]:'items' in b?[b.caption,b.description,...b.items.flatMap(i=>[i.title,i.body])]:[b.heading,...b.paragraphs,b.code??''])]),...(t.checks??[]).flatMap(q=>{const text=q.text[lang];return text?[text.prompt,...text.options,...text.rationales]:[];}),...(t.qa??[]).flatMap(q=>[q.text[lang].question,q.text[lang].originalQuestion??'',...q.text[lang].answer,...(q.text[lang].editorial??[]),...(q.text[lang].explanation??[])])].join(' '),href:conceptPath(c.id,lang),label:`CEH ${c.module.toUpperCase()}`}];
  }));
  return {list,get,searchEntries};
}
