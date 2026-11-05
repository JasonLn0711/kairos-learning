<script lang="ts">
  import type {AasePublishedLesson,AaseSource} from '$lib/aase';
  import {aaseUI} from '$lib/aase-ui';
  import {localized,type Locale} from '$lib/model';
  import TeachingArticle from './TeachingArticle.svelte';
  import AaseBlocks from './AaseBlocks.svelte';
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
<TeachingArticle {lang} summary={text.summary} identifier={lesson.id.replace(/^AASE-(M\d{2})-C(\d{2})$/,'AASE $1-$2')} publishedOn={lesson.publishedOn} version={'v'+lesson.contentVersion} revisedOn={lesson.date} readingId={lesson.id} guide={text.readingGuide} {toc} qa={lesson.qa} previous={neighbor('previous')} next={neighbor('next')} lightCode>
<section><h2 id="objectives">{l.objectives}</h2><ul>{#each text.objectives as objective}<li>{objective}</li>{/each}</ul></section>
{#each text.sections as s}<section><h2 id={s.id}>{s.heading}</h2>{#each s.paragraphs as p}<p>{p}</p>{/each}{#if s.blocks}<AaseBlocks blocks={s.blocks} {lang}/>{/if}{#if s.sourceIds?.length}<p>{l.sectionSources}：{#each s.sourceIds as id}<a href={sources.find(x=>x.id===id)!.url}>{sources.find(x=>x.id===id)!.title}</a>{' '}{/each}</p>{/if}</section>{/each}
<section><h2 id="practice">{l.practice}</h2><p>{l.environment}：{text.exercise.environment}</p><ol>{#each text.exercise.steps as step}<li>{step}</li>{/each}</ol><h3>{l.expected}</h3><p>{text.exercise.expected}</p><h3>{l.check}</h3><p>{text.exercise.check}</p><h3>{l.cleanup}</h3><p>{text.exercise.cleanup}</p></section>
<section><h2 id="checks">{l.checks}</h2><p>{l.checkIntro}</p>{#each lesson.checks as q}{@const t=q.text[lang]!}<section><h3 id={q.id}>{t.prompt}</h3><ol type="A">{#each t.options as option}<li>{option}</li>{/each}</ol><details><summary>{l.answerSummary}</summary><p>{l.answer}：{String.fromCharCode(65+q.answer)}</p><ol type="A">{#each t.rationales as reason}<li>{reason}</li>{/each}</ol></details></section>{/each}</section>
<section><h2 id="sources">{l.sources}</h2><p>{l.sourceIntro}</p><ul>{#each sources as source}<li><a href={source.url}>{source.title}</a> · {l.checked} <time datetime={source.checkedOn}>{source.checkedOn}</time></li>{/each}</ul><p><a href={localized('/courses/aase/v1/workshop/',lang)}>{l.workshop}</a></p></section>
</TeachingArticle>
