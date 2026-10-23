import { isPublic, localized, type Locale, type Bilingual, type SearchEntry } from './model.ts';
export type ConceptEntry = { id: string; module: string; title: Bilingual };
export type ConceptBlock = {kind:'table';caption:string;headers:string[];rows:string[][]} | {kind:'details'|'step';heading:string;paragraphs:string[];code?:string;id?:string};
export type ConceptCheck = {id:string;answer:number;text:Bilingual<{prompt:string;options:string[];rationales:string[]}>};
export type ConceptTeaching = {
  id: string; revision: number; date: string; status: 'draft' | 'published'; publishedOn: string;
  text: Bilingual<{summary: string; sections: {id: string; heading: string; paragraphs: string[];blocks?:ConceptBlock[]}[]}>;
  checks?: ConceptCheck[];
  qa?: {id: string; text: Bilingual<{question: string; answer: string[]}>}[];
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
      if (!nonempty(text?.summary) || !text?.sections?.length) fail(`${t.id}: missing ${lang} teaching`);
      const headings = new Set<string>(['discussion']);
      for (const s of text.sections) {
        if (!/^[a-z][a-z0-9-]*$/.test(s.id) || headings.has(s.id) || s.id.startsWith('qa-') || !nonempty(s.heading) || !s.paragraphs?.length || !s.paragraphs.every(nonempty)) fail(`${t.id}: invalid section ${s.id}`);
        headings.add(s.id);
        for(const block of s.blocks ?? []) {
          if(block.kind === 'table') {
            if(!nonempty(block.caption) || !block.headers?.length || !block.headers.every(nonempty) || !block.rows?.length || !block.rows.every(row => row.length === block.headers.length && row.every(nonempty))) fail(`${t.id}: invalid table`);
          } else if(block.kind === 'step' || block.kind === 'details') {
            if(!nonempty(block.heading) || !block.paragraphs?.length || !block.paragraphs.every(nonempty) || (block.code !== undefined && !nonempty(block.code))) fail(`${t.id}: invalid content block`);
            if(block.id) {if(headings.has(block.id)) fail(`${t.id}: duplicate block anchor`);headings.add(block.id);}
          } else fail(`${t.id}: unknown content block`);
        }
      }
    }
    if (JSON.stringify(t.text.zh.sections.map(s=>s.id)) !== JSON.stringify(t.text.en.sections.map(s=>s.id))) fail(`${t.id}: bilingual section IDs differ`);
    const checkIds=new Set<string>();
    for(const q of t.checks ?? []) {
      if(!/^[a-zA-Z0-9-]+$/.test(q.id) || checkIds.has(q.id) || !Number.isInteger(q.answer) || q.answer<0 || q.answer>3) fail(`${t.id}: invalid test identity/key`);
      checkIds.add(q.id);
      for(const lang of ['zh','en'] as const) {
        const text=q.text?.[lang];
        if(!nonempty(text?.prompt) || text?.options?.length!==4 || text?.rationales?.length!==4 || !text.options.every(nonempty) || !text.rationales.every(nonempty)) fail(`${t.id}: incomplete ${lang} test explanation`);
      }
    }
    const qaIds = new Set<string>();
    if (t.qa !== undefined && !Array.isArray(t.qa)) fail(`${t.id}: qa must be an array`);
    for (const q of t.qa ?? []) {
      if (!/^[a-z0-9-]+$/.test(q.id) || qaIds.has(q.id)) fail(`${t.id}: invalid Q&A ID`);
      qaIds.add(q.id);
      for (const lang of ['zh','en'] as const) if (!nonempty(q.text?.[lang]?.question) || !q.text[lang].answer?.length || !q.text[lang].answer.every(nonempty)) fail(`${t.id}: missing ${lang} Q&A`);
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
    return [{id:c.id,lang,title:`${c.id} · ${c.title[lang]}`,summary:t.text[lang].summary,text:[...t.text[lang].sections.flatMap(s=>[s.heading,...s.paragraphs,...(s.blocks??[]).flatMap(b=>b.kind==='table'?[b.caption,...b.headers,...b.rows.flat()]:[b.heading,...b.paragraphs,b.code??''])]),...(t.checks??[]).flatMap(q=>[q.text[lang].prompt,...q.text[lang].options,...q.text[lang].rationales]),...(t.qa??[]).flatMap(q=>[q.text[lang].question,...q.text[lang].answer])].join(' '),href:conceptPath(c.id,lang),label:`CEH ${c.module.toUpperCase()}`}];
  }));
  return {list,get,searchEntries};
}
