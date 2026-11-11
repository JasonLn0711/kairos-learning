import {sitemapGroups} from './information-hierarchy.ts';
import {aaseConceptTitle} from './aase-labels.ts';
import {assertArchitectureDiagram,architectureDiagramText,type ArchitectureDiagramModel} from './architecture-diagram.ts';
import {parseQA} from './qa-markdown.ts';
import type {ConceptBlock,ConceptCheck,ConceptDiscussion} from './concepts.ts';
import type {ReadingGuide} from './article-reading.ts';
import { isPublic, localized, type Locale, type SearchEntry } from './model.ts';
export type AaseSource = {id:string;title:string;url:string;checkedOn:string};
export type AaseBlock = ConceptBlock | ArchitectureDiagramModel | {kind:'prose';paragraphs:string[]};
export type AaseSection = {id:string;heading:string;paragraphs:string[];sourceIds?:string[];blocks?:AaseBlock[]};
export type AaseExercise = {environment:string;steps:string[];expected:string;check:string;cleanup:string};
export type AaseText = {summary:string;objectives:string[];sections:AaseSection[];exercise:AaseExercise;readingGuide:ReadingGuide;openChecks?:{id:string;prompt:string;answer:string[]}[]};
export type AaseLesson = {id:string;status:'draft'|'published';revision:number;contentVersion:string;publishedOn:string;date:string;qa:ConceptDiscussion[];text:{zh:AaseText;en?:AaseText};checks:ConceptCheck[];sourceIds:string[];translations?:{en:{status:'draft'|'published';publishedOn:string}}};
export type AasePublishedLesson<L extends Locale = Locale> = Omit<AaseLesson,'text'|'translations'> & {text:Record<L,AaseText>};
export type AaseCourseTranslation = {lang:'en';status:'draft'|'published';publishedOn:string;title:string;subtitle:string;modules:{id:string;title:string;artifact:string;concepts:{id:string;title:string;objective:string;practice:string;assessment:string}[]}[]};
export type AaseCourse = {id:string;version:string;contentVersion:string;title:string;subtitle:string;englishTitle:string;locale:string;status:string;modules:{id:string;title:string;minutes:number;practiceMinutes:number;artifact:string;concepts:{id:string;slug:string;title:string;status:string;workshopDepth:string;objective:string;practice:string;assessment:string}[]}[]};
export const aaseModulePath=(id:string,lang:Locale='zh')=>localized(`/courses/aase/v1/${id}/`,lang);
export const aaseConceptPath=(module:string,slug:string,lang:Locale='zh')=>`${aaseModulePath(module,lang)}concepts/${slug}/`;
export function createAaseCatalog(course:AaseCourse,lessons:AaseLesson[],sources:AaseSource[],today:string,english?:AaseCourseTranslation){
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
  const keys=(v:object,allowed:string[])=>Object.keys(v).every(k=>allowed.includes(k));
  if(english){
    if(!keys(english,['lang','status','publishedOn','title','subtitle','modules']))fail('unknown English course fields');
    if(english.lang!=='en'||!['draft','published'].includes(english.status)||!day(english.publishedOn)||![english.title,english.subtitle].every(text)||english.modules.length!==course.modules.length)fail('invalid English course');
    for(const [i,m] of english.modules.entries()){
      const original=course.modules[i];
      if(!keys(m,['id','title','artifact','concepts'])||m.concepts.some(c=>!keys(c,['id','title','objective','practice','assessment'])))fail('unknown English directory fields');
      if(m.id!==original.id||![m.title,m.artifact].every(text)||m.concepts.length!==original.concepts.length)fail('English module mismatch');
      for(const [j,c] of m.concepts.entries())if(c.id!==original.concepts[j].id||![c.title,c.objective,c.practice,c.assessment].every(text))fail('English concept mismatch');
    }
  }
  // IDs, executable code and graph structure match; M06-02’s prose architecture.md template is translated.
  const sameShape=(a:unknown,b:unknown,key='',translatedTemplate=false):boolean=>{
    if(typeof a==='string')return text(b)&&(!['id','kind','level','from','to','code','tone'].includes(key)||a===b||key==='code'&&translatedTemplate&&a.startsWith('# System Context — ')&&String(b).startsWith('# System Context — '));
    if(Array.isArray(a))return Array.isArray(b)&&a.length===b.length&&a.every((v,i)=>key==='sourceIds'?v===b[i]:sameShape(v,b[i],'',translatedTemplate));
    if(a&&typeof a==='object')return Boolean(b&&typeof b==='object'&&!Array.isArray(b)&&Object.keys(a).sort().join('|')===Object.keys(b).sort().join('|')&&Object.entries(a).every(([k,v])=>sameShape(v,(b as Record<string,unknown>)[k],k,translatedTemplate)));
    return a===b;
  };
  const sourceIds=new Set(sources.map(s=>s.id));
  if(sourceIds.size!==sources.length||sources.some(s=>!text(s.id)||!text(s.title)||!s.url.startsWith('https://')||!day(s.checkedOn)))fail('invalid sources');
  if(new Set(lessons.map(l=>l.id)).size!==lessons.length)fail('duplicate lesson');
  for(const l of lessons){
    if(!l.text?.zh||Object.keys(l.text).some(k=>!['zh','en'].includes(k)))fail('unreviewed lesson language');
    const en=l.translations?.en;
    if(l.translations&&Object.keys(l.translations).some(k=>k!=='en'))fail('unsupported translation gate');
    if(Boolean(l.text.en)!==Boolean(en)||en&&(!keys(en,['status','publishedOn'])||!english||!['draft','published'].includes(en.status)||!day(en.publishedOn)||en.publishedOn<l.publishedOn))fail('invalid English publication gate');
    if(l.text.en&&!sameShape(l.text.zh,l.text.en,'',l.id==='AASE-M06-C02'))fail('English teaching structure differs');
    for(const lang of Object.keys(l.text) as Locale[]){
    const t=l.text[lang]!;
    if(!t||!t.readingGuide||!(['goal','startingPoint','route','output'] as const).every(k=>text(t.readingGuide[k]))||!Array.isArray(l.qa))fail('incomplete lesson fields');
    if(!concepts.some(c=>c.id===l.id)||!['draft','published'].includes(l.status)||!Number.isInteger(l.revision)||l.revision<1||!/^\d+\.\d+\.\d+$/.test(l.contentVersion)||!day(l.publishedOn)||!day(l.date)||l.date<l.publishedOn)fail('invalid lesson metadata');
    if(!text(t.summary)||t.objectives.length<2||t.objectives.some(x=>!text(x))||t.sections.length<5||!l.sourceIds.length||l.sourceIds.some(id=>!sourceIds.has(id)))fail('incomplete lesson');
    if(new Set(t.sections.map(s=>s.id)).size!==t.sections.length)fail('duplicate section');
    for(const s of t.sections){
      if(l.id==='AASE-M08-C02'&&l.revision>=4){
        const expected:Record<string,number>={analogy:3,evidence:3,'agent-workflow':4};
        const figures=(s.blocks??[]).filter(b=>b.kind==='cards'||b.kind==='flow');
        if(figures.length!==(expected[s.id]?1:0)||figures.some(f=>(f.kind!=='cards'&&f.kind!=='flow')||f.items.length!==expected[s.id]||f.kind!==(s.id==='evidence'?'cards':'flow')||!keys(f,['kind','caption','description','items'])||f.items.some(i=>!keys(i,['title','body']))))fail('invalid TDD figure');
      }

      if(!/^[a-z][a-z0-9-]*$/.test(s.id)||!text(s.heading)||['discussion','objectives','practice','checks','sources'].includes(s.id)||s.id.startsWith('qa-')||!s.paragraphs.length||s.paragraphs.some(p=>!text(p))||(s.sourceIds??[]).some(id=>!l.sourceIds.includes(id)))fail('invalid section');
      if(l.id==='AASE-M07-C03'&&l.revision>=4){
        const figures=(s.blocks??[]).filter(b=>b.kind==='cards'||b.kind==='flow');
        const expected=['slice','behavior'].includes(s.id)?'cards':s.id==='roadmap'?'flow':undefined;
        if(figures.length!==(expected?1:0)||figures.some(f=>(f.kind!=='cards'&&f.kind!=='flow')||f.kind!==expected||f.items.length!==(s.id==='behavior'?3:4)||!keys(f,['kind','caption','description','items'])||f.items.some(item=>!keys(item,['title','body']))))fail('invalid vertical slice figure');
        const figure=figures[0];
        if(figure&&(figure.kind==='cards'||figure.kind==='flow')){
          if(s.id==='slice'&&figure.items.some(item=>item.body.split('\n').length!==3))fail('invalid vertical slice layers');
          if(s.id==='behavior'&&figure.items.map(item=>item.body).join('|')!==`SYN-001|DEMO-A|${lang==='zh'?'（空白）':'(blank)'}`)fail('invalid vertical slice defaults');
        }
      }
      if(l.id==='AASE-M07-C05'&&l.revision>=4){
        const figures=(s.blocks??[]).filter(b=>b.kind==='cards'||b.kind==='flow');
        const count=s.id==='risk'?4:s.id==='workflow'?7:0;
        if(figures.length!==(count?1:0)||figures.some(f=>(f.kind!=='cards'&&f.kind!=='flow')||f.kind!==(s.id==='risk'?'cards':'flow')||f.items.length!==count||!keys(f,['kind','caption','description','items'])||f.items.some(i=>!keys(i,['title','body']))))fail('invalid preview export figure');
      }
      if(l.id==='AASE-M09-C01'&&l.revision>=4){
        const figures=(s.blocks??[]).filter(b=>b.kind==='cards'||b.kind==='flow');
        const expected=s.id==='analogy'?'flow':s.id==='lab'?'cards':undefined;
        if(figures.length!==(expected?1:0)||figures.some(f=>(f.kind!=='cards'&&f.kind!=='flow')||f.kind!==expected||f.items.length!==4||!keys(f,['kind','caption','description','items'])||f.items.some(item=>!keys(item,['title','body'])||/[<>]/.test(item.title+item.body))))fail('invalid Git history figure');
        if(s.id==='analogy'){const f=figures[0];if(f?.kind==='flow'&&f.items.some((item,i)=>item.body.split('\n').length!==(i<3?2:1)||i<3&&!item.body.split('\n')[1].startsWith(['git add','git commit','git push'][i])))fail('invalid Git transition labels');}
      }
      if(l.id==='AASE-M05-C04'&&l.revision>=4){
        const figures=(s.blocks??[]).filter(b=>b.kind==='flow'||b.kind==='cards');
        if(figures.length!==(s.id==='loop'?1:0)||figures.some(f=>f.kind!=='flow'||f.items.length!==5||!keys(f,['kind','caption','description','items'])||f.items.some(item=>!keys(item,['title','body']))))fail('invalid SDD change figure');
      }
      if(l.id==='AASE-M05-C01'&&l.revision>=4){
        const figures=(s.blocks??[]).filter(b=>b.kind==='cards'||b.kind==='flow');
        if(s.id==='verification'){const f=figures[0];if(figures.length!==1||!f||f.kind!=='flow'||f.items.length!==5||!keys(f,['kind','caption','description','items'])||f.items.some(i=>!keys(i,['title','body'])))fail('invalid prompt-spec workflow');}
        else if(figures.length)fail('invalid prompt-spec workflow');
      }
      if(l.id==='AASE-M05-C03'&&l.revision>=6){
        const expected:Record<string,number>={mechanism:3,examples:4,tests:5};
        const figures=(s.blocks??[]).filter(b=>b.kind==='cards'||b.kind==='flow');
        if(figures.length!==(expected[s.id]?1:0)||figures.some(f=>(f.kind!=='cards'&&f.kind!=='flow')||f.items.length!==expected[s.id]||f.kind!==(s.id==='examples'?'cards':'flow')||!keys(f,['kind','caption','description','items'])||f.items.some(item=>!keys(item,['title','body']))))fail('invalid acceptance figure');
      }
      if(l.id==='AASE-M07-C02'&&l.revision>=4){const figures=(s.blocks??[]).filter(b=>b.kind==='cards'||b.kind==='flow');const expected=s.id==='contract'?5:s.id==='review'?2:0;const f=figures[0];if(figures.length!==(expected?1:0)||expected&&(!f||(f.kind!=='flow'&&f.kind!=='cards')||f.items.length!==expected||f.kind!==(s.id==='contract'?'flow':'cards')))fail('invalid task contract figure');}
      if(l.id==='AASE-M07-C01'&&l.revision>=4){
        const figures=(s.blocks??[]).filter(b=>b.kind==='cards'||b.kind==='flow');
        const expected:Record<string,number[]>={analogy:[8],layers:[3],commands:[5,2]};
        if(figures.length!==(expected[s.id]?.length??0)||figures.some((f,i)=>(f.kind!=='cards'&&f.kind!=='flow')||!keys(f,['kind','caption','description','items'])||f.items.length!==expected[s.id][i]||f.kind!==(s.id==='commands'&&i===0?'flow':'cards')||f.items.some(item=>!keys(item,['title','body']))))fail('invalid environment setup figure');
      }
      if(l.id==='AASE-M08-C03'&&l.revision>=4){
        const expected:Record<string,number>={map:5,delivery:3,cases:3};
        const figures=(s.blocks??[]).filter(b=>b.kind==='cards'||b.kind==='flow');
        if(figures.length!==(expected[s.id]?1:0)||figures.some(f=>(f.kind!=='cards'&&f.kind!=='flow')||!keys(f,['kind','caption','description','items'])||f.items.length!==expected[s.id]||f.kind!==(s.id==='map'?'flow':'cards')||f.items.some(i=>!keys(i,['title','body']))))fail('invalid rule testing figure');
        if(s.id==='delivery'){const f=figures[0];if(!f||f.kind!=='cards'||f.items.map(i=>i.body).join('|')!=='999|60|1000')fail('invalid delivery defaults');}
      }
      if(l.id==='AASE-M01-C03'&&['differences','identity'].includes(s.id)){const cards=(s.blocks??[]).filter(b=>b.kind==='cards');if(cards.length!==1||cards[0].kind!=='cards'||cards[0].items.length!==(s.id==='differences'?6:3))fail('invalid organization teaching layout');}
      if(l.id==='AASE-M08-C06'&&l.revision>=4){
        const figures=(s.blocks??[]).filter(b=>b.kind==='cards'||b.kind==='flow');
        if(figures.length!==(s.id==='analogy'?1:0)||figures.some(f=>f.kind!=='flow'||!keys(f,['kind','caption','description','items'])||f.items.length!==5||f.items.some(item=>!keys(item,['title','body']))))fail('invalid regression evidence figure');
      }
      if(l.id==='AASE-M01-C04'&&['analogy','workflow','testing'].includes(s.id)){const figures=(s.blocks??[]).filter(b=>b.kind==='cards'||b.kind==='flow');const figure=figures[0];if(figures.length!==1||!figure||(figure.kind!=='cards'&&figure.kind!=='flow')||figure.items.length!==(s.id==='analogy'?2:s.id==='workflow'?5:3)||figure.kind!==(s.id==='workflow'?'flow':'cards'))fail('invalid requirements interview figure');}
      if(l.id==='AASE-M02-C01'&&l.revision>=4){
        const expected:Record<string,number>={pipeline:6,units:2,analogy:4,attention:3,'attention-example':2,limits:4};
        const figures=(s.blocks??[]).filter(b=>b.kind==='cards'||b.kind==='flow');
        if(expected[s.id]){const f=figures[0];if(figures.length!==1||!f||(f.kind!=='cards'&&f.kind!=='flow')||f.items.length!==expected[s.id]||f.kind!==(['pipeline','limits'].includes(s.id)?'flow':'cards'))fail('invalid token attention figure');}
        else if(figures.length)fail('invalid token attention figure');
      }
      if(l.id==='AASE-M02-C03'&&l.revision>=4){
        const expected:Record<string,number>={office:4,'kv-cache':5,'summary-and-notes':2,retrieval:3,memory:4,workflow:6};
        const figures=(s.blocks??[]).filter(b=>b.kind==='cards'||b.kind==='flow');
        if(expected[s.id]){const f=figures[0];if(figures.length!==1||!f||(f.kind!=='cards'&&f.kind!=='flow')||f.items.length!==expected[s.id]||f.kind!==(['summary-and-notes','retrieval','workflow'].includes(s.id)?'flow':'cards'))fail('invalid memory mechanisms figure');}
        else if(figures.length)fail('invalid memory mechanisms figure');
      }
      if(l.id==='AASE-M02-C02'&&l.revision>=4){
        const expected:Record<string,number[]>={analogy:[2],window:[5],'budget-example':[5],prepare:[7,4]};
        const figures=(s.blocks??[]).filter(b=>b.kind==='cards'||b.kind==='flow');
        if(figures.length!==(expected[s.id]?.length??0)||figures.some((f,i)=>(f.kind!=='cards'&&f.kind!=='flow')||f.items.length!==expected[s.id][i]||f.kind!==(s.id==='prepare'&&i===1?'flow':'cards')))fail('invalid context window figure');
        if(s.id==='budget-example'){const f=figures[0];if(!f||(f.kind!=='cards'&&f.kind!=='flow')||f.items.map(i=>i.body).join('|')!=='1,000|2,000|4,500|1,500|500')fail('invalid context budget defaults');}
      }
      if(l.id==='AASE-M02-C04'&&l.revision>=4){
        const expected:Record<string,number[]>={control:[4,6],stopping:[6],hybrid:[4]};
        const figures=(s.blocks??[]).filter(b=>b.kind==='cards'||b.kind==='flow');
        if(figures.length!==(expected[s.id]?.length??0)||figures.some((f,i)=>(f.kind!=='cards'&&f.kind!=='flow')||f.items.length!==expected[s.id][i]||f.kind!==(s.id==='hybrid'?'flow':'cards')))fail('invalid agent control figure');
      }
      if(l.id==='AASE-M02-C05'&&l.revision>=4){
        const expected:Record<string,number[]>={analogy:[9],'six-aspects':[3,3],trace:[5]};
        const figures=(s.blocks??[]).filter(b=>b.kind==='cards'||b.kind==='flow');
        if(figures.length!==(expected[s.id]?.length??0)||figures.some((f,i)=>(f.kind!=='cards'&&f.kind!=='flow')||f.items.length!==expected[s.id][i]||f.kind!==(s.id==='trace'?'flow':'cards')))fail('invalid harness figure');
      }
      if(l.id==='AASE-M03-C01'&&l.revision>=6){
        const expected:Record<string,number[]>={analogy:[2],structure:[5],acceptance:[2],workflow:[7],documents:[2,3],connection:[4]};
        const figures=(s.blocks??[]).filter(b=>b.kind==='cards'||b.kind==='flow');
        if(figures.length!==(expected[s.id]?.length??0)||figures.some((f,i)=>(f.kind!=='cards'&&f.kind!=='flow')||f.items.length!==expected[s.id][i]||f.kind!==(['workflow','connection'].includes(s.id)||s.id==='documents'&&i===1?'flow':'cards')))fail('invalid problem statement figure');
      }
      if(l.id==='AASE-M03-C03'&&l.revision>=4){
        const expected:Record<string,number>={analogy:3,flow:12,'stale-result':3,layers:3,record:6};
        const figures=(s.blocks??[]).filter(b=>b.kind==='cards'||b.kind==='flow');
        if(figures.length!==(expected[s.id]?1:0)||figures.some(f=>(f.kind!=='cards'&&f.kind!=='flow')||!keys(f,['kind','caption','description','items'])||f.items.length!==expected[s.id]||f.kind!==(s.id==='analogy'?'flow':'cards')||f.items.some(i=>!keys(i,['title','body']))))fail('invalid workflow figure');
        const demos=(s.blocks??[]).filter(b=>b.kind==='step'&&b.id?.startsWith('workflow-'));
        const demo=s.id==='stale-result'?'workflow-stale':s.id==='walkthrough'?'workflow-walkthrough':null;
        if(demos.length!==(demo?1:0)||demos.some(b=>b.kind!=='step'||b.id!==demo||b.code!==undefined))fail('invalid workflow exercise');
      }
      if(l.id==='AASE-M03-C04'&&l.revision>=4){
        const figures=(s.blocks??[]).filter(b=>b.kind==='cards'||b.kind==='flow');
        const expected:Record<string,number>=l.revision>=5?{analogy:5,workflow:2,scope:3,constraints:4,change:5,decision:6}:{analogy:4,workflow:5};
        if(expected[s.id]){const f=figures[0];if(figures.length!==1||!f||(f.kind!=='cards'&&f.kind!=='flow')||f.items.length!==expected[s.id]||f.kind!==(l.revision>=5?(['analogy','decision'].includes(s.id)?'flow':'cards'):(s.id==='workflow'?'flow':'cards')))fail('invalid MVP scope figure');}
        else if(figures.length)fail('invalid MVP scope figure');
      }
      if(l.id==='AASE-M03-C05'&&l.revision>=4){
        const expected:Record<string,number>=l.revision>=5?{'evidence-chain':6,metrics:3,measure:4,assumptions:4,trace:4,understanding:7}:{'evidence-chain':6,metrics:2,measure:4,analogy:2,trace:5};
        const figures=(s.blocks??[]).filter(b=>b.kind==='cards'||b.kind==='flow');
        if(expected[s.id]){const f=figures[0];if(figures.length!==1||!f||(f.kind!=='cards'&&f.kind!=='flow')||f.items.length!==expected[s.id]||f.kind!==(s.id==='evidence-chain'?'flow':'cards')||!keys(f,['kind','caption','description','items'])||f.items.some(item=>!keys(item,['title','body'])))fail('invalid success evidence figure');}
        else if(figures.length)fail('invalid success evidence figure');
        if(s.id==='measure'){const f=figures[0];if(!f||(f.kind!=='cards'&&f.kind!=='flow')||f.items[0].body!=='3 / 4'||(l.revision>=5?(f.items[1].body!=='0 / 2'||f.items[2].body!=='75%'||f.items[3].body!=='100%'):f.items[1].body!=='75%'))fail('invalid blocking default');}
      }
      if(l.id==='AASE-M03-C02'&&l.revision>=4){
        const expected:Record<string,number>={roadmap:5,evidence:4,conflict:2};
        const figures=(s.blocks??[]).filter(b=>b.kind==='cards'||b.kind==='flow');
        if(expected[s.id]){const f=figures[0];if(figures.length!==1||!f||(f.kind!=='cards'&&f.kind!=='flow')||f.items.length!==expected[s.id]||f.kind!==(s.id==='roadmap'?'flow':'cards'))fail('invalid stakeholder interview figure');}
        else if(figures.length)fail('invalid stakeholder interview figure');
      }
      if(l.id==='AASE-M02-C06'&&l.revision>=4){
        const expected:Record<string,number>={analogy:5,sandbox:2,connection:6,verification:5};
        const figures=(s.blocks??[]).filter(b=>b.kind==='cards'||b.kind==='flow');
        if(expected[s.id]){const f=figures[0];if(figures.length!==1||!f||(f.kind!=='cards'&&f.kind!=='flow')||f.items.length!==expected[s.id]||f.kind!==(s.id==='analogy'?'flow':'cards'))fail('invalid tool evidence figure');}
        else if(figures.length)fail('invalid tool evidence figure');
      }
      if(l.id==='AASE-M04-C05'&&l.revision>=5){
        const figures=(s.blocks??[]).filter(b=>b.kind==='cards'||b.kind==='flow');
        const expected=s.id==='analogy'?[2,3,2,3]:s.id==='states'?[4]:s.id==='changes'?[4]:[];
        if(figures.length!==expected.length||figures.some((f,i)=>f.kind!=='cards'||!keys(f,['kind','caption','description','items'])||f.items.length!==expected[i]||f.items.some(item=>!keys(item,['title','body']))))fail('invalid disclosure states figure');
      }
      if(l.id==='AASE-M04-C02'&&l.revision>=4){
        const expected:Record<string,number[]>={goal:[6],plans:[6,5],methods:[5],walkthrough:[3]};
        const figures=(s.blocks??[]).filter(b=>b.kind==='cards'||b.kind==='flow');
        if(figures.length!==(expected[s.id]?.length??0)||figures.some((f,i)=>(f.kind!=='cards'&&f.kind!=='flow')||f.items.length!==expected[s.id][i]||f.kind!==(s.id==='methods'?'flow':'cards')||!keys(f,['kind','caption','description','items'])||f.items.some(item=>!keys(item,['title','body']))))fail('invalid task analysis figure');
      }
      if(l.id==='AASE-M06-C05'&&l.revision>=4){
        const figures=(s.blocks??[]).filter(b=>b.kind==='cards'||b.kind==='flow');
        const expected=s.id==='controls'?[4,6]:s.id==='session'?[3]:[];
        if(figures.length!==expected.length||figures.some((f,i)=>f.kind!=='cards'||!keys(f,['kind','caption','description','items'])||f.items.length!==expected[i]||f.items.some(item=>!keys(item,['title','body']))))fail('invalid session access figure');
      }
      if(l.id==='AASE-M04-C06'&&l.revision>=4){
        const figures=(s.blocks??[]).filter(b=>b.kind==='cards'||b.kind==='flow');
        const expected=s.id==='recovery'?[2,2,3]:s.id==='access'?[7]:s.id==='state-transitions'?[5]:[];
        if(figures.length!==expected.length||figures.some((f,i)=>f.kind!=='cards'||!keys(f,['kind','caption','description','items'])||f.items.length!==expected[i]||f.items.some(item=>!keys(item,['title','body']))))fail('invalid recovery figure');
      }
      if(l.id==='AASE-M04-C04'&&l.revision>=4){
        const expected:Record<string,number>={analogy:5,states:4,transitions:11,annotation:2,walkthrough:2};
        const figures=(s.blocks??[]).filter(b=>b.kind==='cards'||b.kind==='flow');
        if(figures.length!==(expected[s.id]?1:0)||figures.some(f=>(f.kind!=='cards'&&f.kind!=='flow')||f.kind!==(s.id==='analogy'?'flow':'cards')||f.items.length!==expected[s.id]||!keys(f,['kind','caption','description','items'])||f.items.some(item=>!keys(item,['title','body']))))fail('invalid wireframe figure');
        if(s.id==='transitions'&&figures.some(f=>(f.kind==='cards'||f.kind==='flow')&&f.items.some(item=>item.title.split(' → ').length!==2)))fail('invalid wireframe endpoints');
      }
      if(l.id==='AASE-M04-C03'&&l.revision>=4){
        const expected:Record<string,number>={structure:3,navigation:5,compare:2,groups:4,order:2,workflow:5};
        const figures=(s.blocks??[]).filter(b=>b.kind==='cards'||b.kind==='flow');
        if(figures.length!==(expected[s.id]?1:0)||figures.some(f=>(f.kind!=='cards'&&f.kind!=='flow')||!keys(f,['kind','caption','description','items'])||f.items.length!==expected[s.id]||f.kind!==(s.id==='workflow'?'flow':'cards')||f.items.some(item=>!keys(item,['title','body'])||/[<>]/.test(item.title+item.body))))fail('invalid information hierarchy figure');
        if(s.id==='navigation'){const f=figures[0];if(f?.kind==='cards'){const counts=f.items.slice(1).map(item=>sitemapGroups(item.body).map(g=>g.children.length));if(JSON.stringify(counts)!=='[[3,0,0],[0,0,0,0],[0,0,0,0,0,0],[2,3,0]]')fail('invalid sitemap relationships');}}
      }
      if(l.id==='AASE-M06-C01'&&l.revision>=4){
        const figures=(s.blocks??[]).filter(b=>b.kind==='cards'||b.kind==='flow');
        const expected=s.id==='analogy'?[5,5]:s.id==='runtime'?[7,6]:s.id==='c4'?[4]:[];
        if(figures.length!==expected.length||figures.some((f,i)=>(f.kind!=='cards'&&f.kind!=='flow')||!keys(f,['kind','caption','description','items'])||f.items.length!==expected[i]||f.kind!==(s.id==='analogy'&&i===0?'flow':'cards')||f.items.some(item=>!keys(item,['title','body']))))fail('invalid flow architecture figure');
      }
      if(l.id==='AASE-M04-C01'){
        const figures=(s.blocks??[]).filter(b=>b.kind==='cards'||b.kind==='flow');
        const expected=l.revision>=6?(s.id==='analogy'?[3]:s.id==='three-lenses'?[4]:s.id==='quality'?[5]:s.id==='case'?[2]:[]):s.id==='case'?[4,3]:s.id==='quality'?[2]:s.id==='record'?[5]:s.id==='task-analysis'?[6]:[];
        if(figures.length!==expected.length||figures.some((f,i)=>(f.kind!=='cards'&&f.kind!=='flow')||!keys(f,['kind','caption','description','items'])||f.items.length!==expected[i]||f.kind!==(l.revision>=6?'cards':(s.id==='case'&&i===0)||s.id==='task-analysis'?'flow':'cards')||f.items.some(item=>!keys(item,['title','body']))))fail('invalid HCI perspectives figure');
      }
      if(l.id==='AASE-M05-C05' && l.revision>=4){
        const figures=(s.blocks??[]).filter(b=>b.kind==='flow'||b.kind==='cards');
        const count=s.id==='artifacts'?3:s.id==='change-workflow'?5:0;
        if(figures.length!==(count?1:0)||figures.some(f=>f.kind!=='flow'||!keys(f,['kind','caption','description','items'])||f.items.length!==count||f.items.some(item=>!keys(item,['title','body']))))fail('invalid OpenSpec figure');
      }
      if(l.id==='AASE-M05-C02'&&l.revision>=4){
        const expected:Record<string,number>={analogy:5,quality:2,examples:2,specification:5,workflow:5};
        const figures=(s.blocks??[]).filter(b=>b.kind==='cards'||b.kind==='flow');
        if(figures.length!==(expected[s.id]?1:0)||figures.some(f=>(f.kind!=='cards'&&f.kind!=='flow')||f.items.length!==expected[s.id]||f.kind!==(s.id==='workflow'?'flow':'cards')||!keys(f,['kind','caption','description','items'])||f.items.some(item=>!keys(item,['title','body']))))fail('invalid specification figure');
      }
      if(l.id==='AASE-M06-C04'&&l.revision>=4){
        const figures=(s.blocks??[]).filter(b=>b.kind==='cards'||b.kind==='flow');
        const expected:Record<string,number>={analogy:6,outcomes:3,streamlit:2};
        if(figures.length!==(expected[s.id]?1:0)||figures.some(f=>(f.kind!=='cards'&&f.kind!=='flow')||!keys(f,['kind','caption','description','items'])||f.items.length!==expected[s.id]||f.kind!==(s.id==='analogy'?'flow':'cards')||f.items.some(item=>!keys(item,['title','body'])||/[<>]/.test(item.title+item.body))))fail('invalid web data-flow figure');
        if(s.id==='streamlit'&&figures.some(f=>(f.kind==='cards'||f.kind==='flow')&&f.items.some(i=>i.body.split(' → ').length!==4)))fail('invalid web architecture paths');
        if(s.id==='record'){
          const tables=(s.blocks??[]).filter(b=>b.kind==='table');
          if(tables.length!==1||tables[0].kind!=='table'||JSON.stringify(tables[0].headers)!=='["Name","Status","Type"]'||JSON.stringify(tables[0].rows)!=='[["orders","200","fetch"],["session","101","websocket"]]')fail('invalid simulated Network entries');
        }
      }
      if(l.id==='AASE-M08-C01'&&l.revision>=4){
        const figures=(s.blocks??[]).filter(b=>b.kind==='cards'||b.kind==='flow');
        const expected:Record<string,number>={layers:6,record:3,collaboration:4};
        if(figures.length!==(expected[s.id]?1:0)||figures.some(f=>(f.kind!=='cards'&&f.kind!=='flow')||f.items.length!==expected[s.id]||f.kind!==(s.id==='collaboration'?'flow':'cards')||!keys(f,['kind','caption','description','items'])||f.items.some(i=>!keys(i,['title','body']))))fail('invalid verification evidence figure');
      }
      if(l.id==='AASE-M06-C03'&&l.revision>=4){
        const figures=(s.blocks??[]).filter(b=>b.kind==='cards'||b.kind==='flow');
        const expected:Record<string,number[]>={analogy:[4],definition:[4],restaurant:[3,5,4],containers:[6],record:[4]};
        if(figures.length!==(expected[s.id]?.length??0)||figures.some((f,i)=>f.kind!=='cards'||!keys(f,['kind','caption','description','items'])||f.items.length!==expected[s.id][i]||f.items.some(item=>!keys(item,['title','body']))))fail('invalid C4 views figure');
      }
      if(l.id==='AASE-M07-C07'&&l.revision>=4){
        const expected:Record<string,number>={analogy:6,bug:6,loop:3,'agent-task':4};
        const figures=(s.blocks??[]).filter(b=>b.kind==='cards'||b.kind==='flow');
        if(figures.length!==(expected[s.id]?1:0)||figures.some(f=>(f.kind!=='cards'&&f.kind!=='flow')||f.items.length!==expected[s.id]||f.kind!==(['analogy','loop'].includes(s.id)?'flow':'cards')||!keys(f,['kind','caption','description','items'])||f.items.some(item=>!keys(item,['title','body']))))fail('invalid debugging figure');
        if(s.id==='bug'&&figures.some(f=>(f.kind==='cards'||f.kind==='flow')&&(f.items[0].body.split('｜').length!==2||f.items[0].body.split('｜').some(v=>!v.trim()))))fail('invalid debugging mode labels');
      }
      if(l.id==='AASE-M09-C03'&&l.revision>=4){
        const figures=(s.blocks??[]).filter(b=>b.kind==='cards'||b.kind==='flow');
        const count=s.id==='analogy'?5:s.id==='walkthrough'?3:0;
        if(figures.length!==(count?1:0)||figures.some(f=>f.kind!==(count===5?'flow':'cards')||!keys(f,['kind','caption','description','items'])||f.items.length!==count||f.items.some(item=>!keys(item,['title','body']))))fail('invalid acceptance evidence figure');
      }
      if(l.id==='AASE-M09-C02'&&l.revision>=4){
        const figures=(s.blocks??[]).filter(b=>b.kind==='flow'||b.kind==='cards');
        const count=s.id==='analogy'?4:s.id==='checklist'?8:0;
        if(figures.length!==(count?1:0)||figures.some(f=>(f.kind!=='flow'&&f.kind!=='cards')||f.kind!==(s.id==='analogy'?'flow':'cards')||f.items.length!==count||!keys(f,['kind','caption','description','items'])||f.items.some(item=>!keys(item,['title','body']))))fail('invalid handoff figure');
      }
      for(const b of s.blocks??[]){
        if(b.kind==='prose'){if(!keys(b,['kind','paragraphs'])||!b.paragraphs?.length||!b.paragraphs.every(text))fail('invalid ordered prose');}
        else if(b.kind==='architecture'){assertArchitectureDiagram(b);}
        else if(b.kind==='flow'||b.kind==='cards'){if(!text(b.caption)||!text(b.description)||b.items.length<2||b.items.some(i=>!text(i.title)||!text(i.body)))fail('invalid figure');}
        else if(b.kind==='step'||b.kind==='details'){if(!text(b.heading)||!b.paragraphs.length||!b.paragraphs.every(text)||(b.code!==undefined&&!text(b.code)))fail('invalid step');}
        else if(b.kind==='table'){if(!text(b.caption)||!b.headers.length||!b.headers.every(text)||!b.rows.length||b.rows.some(r=>r.length!==b.headers.length||!r.every(text)))fail('invalid table');}
        else fail('invalid block');
      }
    }
    const e=t.exercise;
    if(!e||!text(e.environment)||e.steps.length<3||e.steps.some(x=>!text(x))||![e.expected,e.check,e.cleanup].every(text))fail('incomplete exercise');
    if(t.openChecks!==undefined){
      if(!Array.isArray(t.openChecks)||!t.openChecks.length||t.openChecks.some(q=>!q||!new RegExp('^'+l.id+'-Q[0-9]{2}$').test(q.id)||!text(q.prompt)||!Array.isArray(q.answer)||!q.answer.length||!q.answer.every(text)))fail('invalid open check');
      const ids=[...l.checks.map(q=>q.id),...t.openChecks.map(q=>q.id)];if(new Set(ids).size!==ids.length)fail('duplicate open check');
    }
    if((!l.checks.length&&!t.openChecks?.length)||new Set(l.checks.map(q=>q.id)).size!==l.checks.length)fail('missing or duplicate checks');
    if(l.checks.some(q=>{const v=q.text[lang];return !q.id.startsWith(l.id+'-Q')||!v||Object.keys(q.text).some(k=>!Object.keys(l.text).includes(k))||!text(v.prompt)||![3,4].includes(v.options.length)||v.rationales.length!==v.options.length||!Number.isInteger(q.answer)||q.answer<0||q.answer>=v.options.length||[...v.options,...v.rationales].some(x=>!text(x));}))fail('invalid check');
    if(l.checks.some(q=>q.text.zh&&q.text.en&&(q.text.zh.options.length!==q.text.en.options.length||q.text.zh.rationales.length!==q.text.en.rationales.length)))fail('English check structure differs');
    const qaIds=new Set<string>();
    for(const q of l.qa){const v=q.text[lang];if(!q.text.zh||Object.keys(q.text).some(k=>!Object.keys(l.text).includes(k)))fail('missing or unknown Q&A locale');if(!v)continue;if(!/^[a-zA-Z0-9-]+$/.test(q.id)||qaIds.has(q.id)||(q.format!==undefined&&q.format!=='markdown')||!text(v.question)||!v.answer.length||!v.answer.every(text))fail('invalid Q&A');if([v.originalQuestion].some(x=>x!==undefined&&!text(x))||[v.explanation,v.editorial].some(a=>a!==undefined&&(!a.length||!a.every(text))))fail('invalid Q&A fields');if(q.format==='markdown'&&(parseQA(v.answer.join('\n\n')).filter(b=>b.kind==='quiz').length!==1||!v.explanation?.length))fail('incomplete Q&A teaching test');qaIds.add(q.id);}
    }
    if(new Set(l.qa.map(q=>q.id)).size!==l.qa.length)fail('duplicate Q&A');

  }
  const blockText=(b:AaseBlock,lang:Locale):string[]=>b.kind==='prose'?b.paragraphs:b.kind==='architecture'?architectureDiagramText(b,lang):b.kind==='flow'||b.kind==='cards'?[b.caption,b.description,...b.items.flatMap(i=>[i.title,i.body])]:b.kind==='table'?[b.caption,...b.headers,...b.rows.flat()]:'heading' in b?[b.heading,...b.paragraphs,b.code??'']:[];
  function forLanguage<L extends Locale>(lang:L){
    if(lang==='en'&&(!english||!isPublic(english,today)))return null;
    const title=lang==='en'?english!.title:course.title,subtitle=lang==='en'?english!.subtitle:course.subtitle;
    const modules=course.modules.map((m,i)=>{
      const translation=lang==='en'?english!.modules[i]:null;
      return {...m,title:translation?.title??m.title,artifact:translation?.artifact??m.artifact,concepts:m.concepts.map((c,j)=>({...c,...(translation?.concepts[j]??{})}))};
    });
    const publicLessons=lessons.filter(l=>isPublic(l,today)&&(lang==='zh'||l.text.en&&l.translations?.en&&isPublic(l.translations.en,today))).map(l=>{
      const {text,checks,qa,translations,...metadata}=l;
      return {...metadata,text:{[lang]:text[lang]!} as Record<L,AaseText>,checks:checks.map(q=>({...q,text:{[lang]:q.text[lang]}})),qa:qa.filter(q=>q.text[lang]).map(q=>({...q,text:{[lang]:q.text[lang]}}))} satisfies AasePublishedLesson<L>;
    });
    const publicConcepts=modules.flatMap(m=>m.concepts.map(c=>({...c,module:m.id,href:aaseConceptPath(m.id,c.slug,lang),lesson:publicLessons.find(l=>l.id===c.id)??null})));
    const searchEntries:SearchEntry[]=publicConcepts.filter(c=>c.lesson).map(c=>{const l=c.lesson!,t=l.text[lang];return {id:c.id,lang,title:aaseConceptTitle(c),summary:t.summary,text:[...t.objectives,...Object.values(t.readingGuide),...t.sections.flatMap(s=>[s.heading,...s.paragraphs,...(s.blocks??[]).flatMap(b=>blockText(b,lang))]),...Object.values(t.exercise).flat(),...(t.openChecks??[]).flatMap(q=>[q.prompt,...q.answer]),...l.checks.flatMap(q=>[q.text[lang]!.prompt,...q.text[lang]!.options,...q.text[lang]!.rationales]),...l.qa.flatMap(q=>[q.text[lang]!.question,q.text[lang]!.originalQuestion??'',...q.text[lang]!.answer,...(q.text[lang]!.explanation??[]),...(q.text[lang]!.editorial??[])])].join(' '),href:c.href,label:`AASE ${c.module.toUpperCase()}`};});
    return {title,subtitle,modules,concepts:publicConcepts,lessons:publicLessons,searchEntries};
  }
  const chinese=forLanguage('zh')!;
  return {...chinese,forLanguage};
}
