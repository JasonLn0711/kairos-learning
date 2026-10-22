import type { Lesson, Module, Source, Term } from './model.ts';
// Validates author-controlled input before it enters routes, search or interactive practice.
export function validateContent(lessons: Lesson[], modules: Module[], sources: Source[], terms: Term[]): string[] {
  const errors: string[] = [];
  const expect = (ok: unknown, message: string) => { if (!ok) errors.push(message); };
  const nonempty = (x: unknown): x is string => typeof x === 'string' && x.trim().length > 0;
  const date = (s: unknown) => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && Number.isFinite(Date.parse(s)) && new Date(s).toISOString().slice(0,10) === s;
  const unique = (xs: string[], label: string) => expect(new Set(xs).size === xs.length, `${label}: duplicate IDs`);
  const ids = new Set(lessons.map(l=>l.id)); const sourceIds = new Set(sources.map(s=>s.id)); const termIds = new Set(terms.map(t=>t.id));
  unique(lessons.map(l=>l.id),'lessons'); unique(lessons.map(l=>String(l.order)),'lesson order'); unique(sources.map(s=>s.id),'sources'); unique(terms.map(t=>t.id),'terms');
  unique(lessons.flatMap(l=>l.questions?.map(q=>q.id) ?? []),'questions');
  expect(modules.length === 20, 'CEH: expected 20 module definitions');
  for (const s of sources) { expect(/^https:\/\//.test(s.url), `${s.id}: HTTPS source required`); expect(nonempty(s.title) && date(s.checkedOn), `${s.id}: source title/date missing`); }
  for (const l of lessons) {
    const tag = l.id ?? 'unknown lesson';
    expect(Number.isInteger(l.order) && l.order > 0, `${tag}: positive reading order required`);
    expect(/^[a-z0-9-]+$/.test(l.id) && /^[a-z0-9-]+$/.test(l.slug), `${tag}: invalid id/slug`);
    expect(['draft','published'].includes(l.status), `${tag}: invalid status`);
    expect(date(l.publishedOn) && date(l.reviewedOn), `${tag}: invalid dates`);
    expect(Number.isInteger(l.revision) && l.revision > 0, `${tag}: invalid revision`);
    expect(['ceh','ai-ml','networking'].includes(l.course), `${tag}: unknown course`);
    if(l.course === 'ceh') expect(modules.some(m=>m.id===l.module), `${tag}: unknown module`);
    expect(l.sourceIds?.length > 0, `${tag}: sources required`);
    for(const id of l.sourceIds ?? []) expect(sourceIds.has(id), `${tag}: missing source ${id}`);
    for(const id of [...(l.prerequisites??[]),...(l.related??[])]) expect(ids.has(id) && id !== l.id, `${tag}: invalid lesson relation ${id}`);
    for(const id of l.terms ?? []) expect(termIds.has(id), `${tag}: unknown term ${id}`);
    for(const lang of ['zh','en'] as const) {
      const t = l.text?.[lang];
      if(!t) { errors.push(`${tag}: missing ${lang} translation`); continue; }
      expect(nonempty(t.title) && nonempty(t.summary), `${tag}/${lang}: title/summary required`);
      expect(t.objectives?.length >= 2 && t.objectives.every(nonempty), `${tag}/${lang}: objectives required`);
      expect(t.sections?.length >= 2, `${tag}/${lang}: explanatory sections required`);
      unique((t.sections??[]).map(s=>s.id),`${tag}/${lang} headings`);
      for(const s of t.sections??[]) {
        expect(/^[a-z0-9-]+$/.test(s.id) && nonempty(s.heading) && s.paragraphs?.length >= 1 && s.paragraphs.every(nonempty), `${tag}/${lang}: empty section ${s.id}`);
        for(const id of s.sourceIds??[]) expect(l.sourceIds.includes(id), `${tag}/${lang}: section source ${id} not declared`);
      }
      for(const field of ['title','scenario','reasoning','conclusion'] as const) expect(nonempty(t.example?.[field]), `${tag}/${lang}: example.${field} required`);
      for(const field of ['title','environment','expected','check','cleanup'] as const) expect(nonempty(t.lab?.[field]), `${tag}/${lang}: lab.${field} required`);
      expect(t.lab?.steps?.length >= 3 && t.lab.steps.every(nonempty), `${tag}/${lang}: concrete lab steps required`);
      if(t.lab?.download) expect(/^\/downloads\/[a-z0-9_.-]+$/.test(t.lab.download),`${tag}: invalid exercise download`);
    }
    if(l.text?.zh && l.text?.en) {
      expect(l.text.zh.title !== l.text.en.title, `${tag}: untranslated title`);
      expect(JSON.stringify(l.text.zh.sections.map(s=>[s.id,s.paragraphs.length])) === JSON.stringify(l.text.en.sections.map(s=>[s.id,s.paragraphs.length])),`${tag}: section translation mismatch`);
      expect(l.text.zh.objectives.length === l.text.en.objectives.length && l.text.zh.lab.steps.length === l.text.en.lab.steps.length, `${tag}: objective/lab translation mismatch`);
      expect(l.text.zh.lab.code === l.text.en.lab.code, `${tag}: bilingual lab code differs`);
    }
    expect(l.questions?.length >= 2, `${tag}: at least two original questions required`);
    for(const q of l.questions??[]) {
      expect(/^[a-z0-9-]+$/.test(q.id) && Number.isInteger(q.revision) && q.revision > 0, `${tag}: invalid question identity`);
      expect(Number.isInteger(q.answer) && q.answer >= 0 && q.answer <= 3, `${q.id}: one valid answer required`);
      expect(termIds.has(q.concept),`${q.id}: unknown concept`);
      for(const lang of ['zh','en'] as const) {
        const t=q.text?.[lang];
        expect(t && nonempty(t.prompt) && t.options?.length === 4 && t.rationales?.length === 4 && t.options.every(nonempty) && t.rationales.every(nonempty), `${q.id}/${lang}: four options and rationales required`);
        if(t?.options) unique(t.options,`${q.id}/${lang} options`);
      }
    }
  }
  for(const t of terms) {
    expect(t.lessons?.length > 0,`${t.id}: glossary must link to lessons`);
    for(const lang of ['zh','en'] as const) expect(nonempty(t.term?.[lang]) && nonempty(t.definition?.[lang]),`${t.id}/${lang}: definition required`);
    for(const id of t.lessons??[]) expect(ids.has(id) && lessons.find(l=>l.id===id)?.terms.includes(t.id),`${t.id}: invalid backlink ${id}`);
  }
  // A cyclic prerequisite graph gives readers no valid starting point.
  const visit = (id:string, path:Set<string>) => {
    if(path.has(id)) { errors.push(`prerequisite cycle: ${[...path,id].join(' -> ')}`); return; }
    const next=new Set(path).add(id);
    for(const p of lessons.find(l=>l.id===id)?.prerequisites??[]) if(ids.has(p)) visit(p,next);
  };
  for(const l of lessons) visit(l.id,new Set());
  return errors;
}
