<script lang="ts">
  import {aaseDisplayId} from '$lib/aase-labels';
  import type {AasePublishedLesson,AaseSource} from '$lib/aase';
  import {aaseUI} from '$lib/aase-ui';
  import {localized,type Locale} from '$lib/model';
  import ContextWindowDiagram from './ContextWindowDiagram.svelte';
  import TokenAttentionDiagram from './TokenAttentionDiagram.svelte';
  import TeachingArticle from './TeachingArticle.svelte';
  import AaseBlocks from './AaseBlocks.svelte';
  import ApplicationCheckDemo from './ApplicationCheckDemo.svelte';
  import AgentTestScenarios from './AgentTestScenarios.svelte';
  import OrganizationDimensions from './OrganizationDimensions.svelte';
  import RequirementsInterviewDiagram from './RequirementsInterviewDiagram.svelte';
  import DocumentAccessSimulation from './DocumentAccessSimulation.svelte';
  let {lesson,sources,navigation,indexHref,lang='zh'}:{lesson:AasePublishedLesson;sources:AaseSource[];navigation:{title:string;href:string;pending:boolean;side:'previous'|'next';displayId:string}[];indexHref:string;lang?:Locale}=$props();
  const text=$derived(lesson.text[lang]);
  const l=$derived(aaseUI[lang].lesson);
  const toc=$derived([{id:'objectives',heading:l.objectives},...text.sections.map(s=>({id:s.id,heading:s.heading})),{id:'practice',heading:l.practice},{id:'checks',heading:l.checks},{id:'sources',heading:l.sources}]);
  const neighbor=(side:'previous'|'next')=>{
    const n=navigation.find(n=>n.side===side);
    if(!n)return {href:indexHref,title:side==='previous'?l.first:l.last};
    const title=`${n.displayId} · ${n.title}${n.pending?' · '+l.pending:''}`;
    return {href:n.href,title:side==='previous'?'← '+title:l.next+title+' →'};
  };
</script>
<TeachingArticle {lang} summary={text.summary} identifier={aaseDisplayId(lesson.id)} publishedOn={lesson.publishedOn} version={'v'+lesson.contentVersion} revisedOn={lesson.date} readingId={lesson.id} guide={text.readingGuide} {toc} qa={lesson.qa} previous={neighbor('previous')} next={neighbor('next')} lightCode>
<section><h2 id="objectives">{l.objectives}</h2><ul>{#each text.objectives as objective}<li>{objective}</li>{/each}</ul></section>
{#each text.sections as s}<section><h2 id={s.id}>{s.heading}</h2>{#each s.paragraphs as p}<p>{p}</p>{/each}{#if s.blocks}{#each s.blocks as block}{#if lesson.id==='AASE-M02-C02' && (block.kind==='cards'||block.kind==='flow')}<ContextWindowDiagram diagram={block} number={s.id==='analogy'?1:s.id==='window'?2:s.id==='budget-example'?3:block.kind==='cards'?4:5} {lang}/>{:else if lesson.id==='AASE-M02-C01' && (block.kind==='cards'||block.kind==='flow')}<TokenAttentionDiagram diagram={block} number={s.id==='pipeline'?1:s.id==='units'?2:s.id==='analogy'?3:s.id==='attention'?4:s.id==='attention-example'?5:6} {lang}/>{:else if lesson.id==='AASE-M01-C04' && (block.kind==='cards' || block.kind==='flow') && ['analogy','workflow','testing'].includes(s.id)}<RequirementsInterviewDiagram diagram={block} layout={s.id==='analogy'?'comparison':s.id==='workflow'?'process':'evidence'} {lang}/>{:else if lesson.id==='AASE-M01-C03' && s.id==='differences' && block.kind==='cards'}<OrganizationDimensions diagram={block}/>{:else if lesson.id==='AASE-M01-C03' && s.id==='identity' && block.kind==='cards'}<DocumentAccessSimulation diagram={block} {lang}/>{:else if lesson.id==='AASE-M01-C01' && s.id==='analogy' && block.kind==='cards'}<ApplicationCheckDemo comparison={block} {lang}/>{:else}<AaseBlocks blocks={[block]} {lang}/>{/if}{/each}{/if}{#if lesson.id==='AASE-M01-C01' && s.id==='scenario'}<ApplicationCheckDemo {lang}/>{/if}{#if lesson.id==='AASE-M01-C02' && s.id==='testing'}<AgentTestScenarios {lang}/>{/if}{#if s.sourceIds?.length}<p>{l.sectionSources}：{#each s.sourceIds as id}<a href={sources.find(x=>x.id===id)!.url}>{sources.find(x=>x.id===id)!.title}</a>{' '}{/each}</p>{/if}</section>{/each}
<section><h2 id="practice">{l.practice}</h2><p>{l.environment}：{text.exercise.environment}</p><ol>{#each text.exercise.steps as step}<li>{step}</li>{/each}</ol><h3>{l.expected}</h3><p>{text.exercise.expected}</p><h3>{l.check}</h3><p>{text.exercise.check}</p><h3>{l.cleanup}</h3><p>{text.exercise.cleanup}</p></section>
<section><h2 id="checks">{l.checks}</h2><p>{l.checkIntro}</p>{#each lesson.checks as q}{@const t=q.text[lang]!}<section><h3 id={q.id}>{t.prompt}</h3><ol type="A">{#each t.options as option}<li>{option}</li>{/each}</ol><details><summary>{l.answerSummary}</summary><p>{l.answer}：{String.fromCharCode(65+q.answer)}</p><ol type="A">{#each t.rationales as reason}<li>{reason}</li>{/each}</ol></details></section>{/each}{#each text.openChecks??[] as q}<section><h3 id={q.id}>{q.prompt}</h3><details><summary>{l.answerSummary}</summary>{#each q.answer as p}<p>{p}</p>{/each}</details></section>{/each}</section>
<section><h2 id="sources">{l.sources}</h2><p>{l.sourceIntro}</p><ul>{#each sources as source}<li><a href={source.url}>{source.title}</a> · {l.checked} <time datetime={source.checkedOn}>{source.checkedOn}</time></li>{/each}</ul><p><a href={localized('/courses/aase/v1/workshop/',lang)}>{l.workshop}</a></p></section>
</TeachingArticle>
