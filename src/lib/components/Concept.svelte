<script lang="ts">
  import TeachingArticle from './TeachingArticle.svelte';
  import type { Page } from '$lib/server/catalog';
  import { conceptVersionLabel } from '$lib/concepts';
  import ConceptBlocks from './ConceptBlocks.svelte';
  import ConceptChecks from './ConceptChecks.svelte';
  import SourceBody from './SourceBody.svelte';
  import { modulePath } from '$lib/model';
  let { data }: { data: Page } = $props();
  const lang = $derived(data.route.lang);
  const zh = $derived(lang === 'zh');
  const teaching = $derived(data.conceptTeaching!);
  const navigation = $derived(data.conceptNavigation!);
  const text = $derived(teaching.text[lang]);
  const toc = $derived(text.sourceBody ? text.sourceBody.flatMap(b=>b.kind==='heading'?[{id:b.id!,heading:b.text}]:[]) : text.sections);
  const parts = (value: string) => value.split(/(\[[^\]]+\]\(https:\/\/[^)]+\))/g).map(part => {
    const match = part.match(/^\[([^\]]+)\]\((https:\/\/[^)]+)\)$/);
    return match ? {label:match[1],href:match[2]} : {label:part,href:null};
  });
  const neighbor=(side:'previous'|'next')=>{
    const n=navigation[side];
    if(n)return {href:n.href??modulePath(n.module,lang)+'#'+n.id.toLowerCase(),title:side==='previous'?`← ${n.displayId??n.id} · ${n.title[lang]}${n.href?'':(zh?' · 待整理':' · pending')}`:`${zh?'下一個：':'Next: '}${n.displayId??n.id} ${n.title[lang]}${n.href?'':(zh?' · 待整理':' · pending')} →`};
    return {href:modulePath(data.module!.id,lang)+'#one-concept',title:side==='previous'?(zh?'← 概念目錄（第一個概念）':'← Concept index (first concept)'):(zh?'返回概念目錄 →':'Return to concept index →')};
  };
</script>
<TeachingArticle {lang} summary={text.summary} identifier={data.concepts.find(c=>c.id===teaching.id)?.displayId??teaching.id} publishedOn={teaching.publishedOn} version={conceptVersionLabel(teaching)} revisedOn={teaching.date} readingId={teaching.id} {toc} qa={teaching.qa} previous={neighbor('previous')} next={neighbor('next')} lightCode={['CEH26-M04-C01','CEH26-M04-C02','M09-02','M09-03','M09-04','M09-05','M09-06'].includes(teaching.id)}>
{#if text.sourceBody}<SourceBody blocks={text.sourceBody} conceptId={teaching.id} {lang} />{:else}{#each text.sections as section}<section><h2 id={section.id}>{section.heading}</h2>{#each section.paragraphs as p}<p style="white-space: pre-line">{#each parts(p) as part}{#if part.href}<a href={part.href}>{part.label}</a>{:else}{part.label}{/if}{/each}</p>{/each}{#if section.blocks}<ConceptBlocks blocks={section.blocks} />{/if}{#if section.id === 'check' && teaching.checks?.length}<ConceptChecks checks={teaching.checks} {lang} />{/if}</section>{/each}{/if}
</TeachingArticle>
