<script lang="ts">
  import type {AaseCourse} from '$lib/aase';
  import {localized,type Locale} from '$lib/model';
  import {aaseUI} from '$lib/aase-ui';
  let {moduleId,concepts,course,lang='zh'}:{moduleId?:string;concepts:{id:string;available:boolean;href:string}[];course:Pick<AaseCourse,'title'|'subtitle'|'modules'>;lang?:Locale}=$props();
  const modules=$derived(moduleId?course.modules.filter(m=>m.id===moduleId):course.modules);
  const l=$derived(aaseUI[lang]);
</script>
<p class="lead">{l.lead}</p>
<p>{l.allocation} {concepts.filter(c=>c.available).length} {l.available} <a href={localized('/courses/aase/v1/workshop/',lang)}>{l.workshop}</a>{' '}{l.resources}</p>
{#if !moduleId}<section><h2>{l.journeyTitle}</h2>{#each l.journey as p}<p>{p}</p>{/each}</section>
<h2>{l.chapters}</h2><ol class="module-list">{#each modules as m}<li><span class="eyebrow">{m.id.toUpperCase()}</span><div><h2><a href={localized('/courses/aase/v1/'+m.id+'/',lang)}>{m.title}</a></h2><p>{m.minutes} {l.minutes} · {m.concepts.length} {l.concepts}</p><p>{m.artifact}</p></div></li>{/each}</ol>{/if}
{#each modules as m}
<section id={moduleId?'one-concept':m.id}><h2><a href={localized('/courses/aase/v1/'+m.id+'/',lang)}>{m.id.toUpperCase()}｜{m.title}</a></h2><p>{m.concepts.length} {l.concepts} · {m.minutes} {l.minutes} ({l.including} {m.practiceMinutes} {l.practiceMinutes})</p><p>{l.evidence}：{m.artifact}</p><ol class="concept-map">{#each m.concepts as c}{@const entry=concepts.find(x=>x.id===c.id)}<li id={c.slug}>{#if entry?.available}<a href={entry.href}><strong>{c.slug.toUpperCase()}｜{c.title}</strong></a>{:else}<strong>{c.slug.toUpperCase()}｜{c.title}</strong>{/if}<p>{c.id} · {l.depth[c.workshopDepth as keyof typeof l.depth]} · {entry?.available?l.ready:l.pending}</p>{#if moduleId}<p>{l.objective}：{c.objective}</p><p>{l.practice}：{c.practice}</p><p>{l.assessment}：{c.assessment}</p>{/if}</li>{/each}</ol></section>
{/each}
{#if !moduleId}
<section><h2>{l.acceptanceTitle}</h2>{#each l.acceptance as p}<p>{p}</p>{/each}</section>
<section><h2>{l.integrationTitle}</h2><p>{l.scenario}</p><ol>{#each l.integration as question}<li>{question}</li>{/each}</ol></section>
{/if}
<style>
 .concept-map p{font-size:1rem}section{margin-block:2rem}li{margin-block:1rem}li p{margin-top:.25rem}p,li{line-height:1.8;overflow-wrap:anywhere}strong{font-weight:600}
</style>
