<script lang="ts">
  import type { Page } from '$lib/server/catalog';
  import ConceptBlocks from './ConceptBlocks.svelte';
  import ConceptChecks from './ConceptChecks.svelte';
  import { modulePath } from '$lib/model';
  let { data }: { data: Page } = $props();
  const lang = $derived(data.route.lang);
  const zh = $derived(lang === 'zh');
  const teaching = $derived(data.conceptTeaching!);
  const navigation = $derived(data.conceptNavigation!);
  const text = $derived(teaching.text[lang]);
  const parts = (value: string) => value.split(/(\[[^\]]+\]\(https:\/\/[^)]+\))/g).map(part => {
    const match = part.match(/^\[([^\]]+)\]\((https:\/\/[^)]+)\)$/);
    return match ? {label:match[1],href:match[2]} : {label:part,href:null};
  });
</script>
<p class="lead">{text.summary}</p>
<p class="metadata">{teaching.id} · v{teaching.revision} · {teaching.date} · {zh ? '公開教學版' : 'Public teaching edition'}</p>
<nav class="toc" aria-label={zh ? '本文導覽' : 'On this page'}><ol>{#each text.sections as section}<li><a href={'#'+section.id}>{section.heading}</a></li>{/each}<li><a href="#discussion">Q&A</a></li></ol></nav>
<article class="prose" class:light-code={zh && teaching.id === 'M04-01'}>{#each text.sections as section}<section><h2 id={section.id}>{section.heading}</h2>{#each section.paragraphs as p}<p style="white-space: pre-line">{#each parts(p) as part}{#if part.href}<a href={part.href}>{part.label}</a>{:else}{part.label}{/if}{/each}</p>{/each}{#if section.blocks}<ConceptBlocks blocks={section.blocks} />{/if}{#if section.id === 'check' && teaching.checks?.length}<ConceptChecks checks={teaching.checks} {lang} />{/if}</section>{/each}
<section><h2 id="discussion">{zh ? '概念 Q&A' : 'Concept Q&A'}</h2>{#if teaching.qa?.length}{#each teaching.qa as qa}<section><h3 id={'qa-'+qa.id}>{qa.text[lang].question}</h3>{#each qa.text[lang].answer as answer}<p>{#each parts(answer) as part}{#if part.href}<a href={part.href}>{part.label}</a>{:else}{part.label}{/if}{/each}</p>{/each}</section>{/each}{:else}<p>{zh ? '待補：收到相關問題後，會整理為匿名教學版。' : 'Pending: related questions will be edited into anonymous teaching notes when available.'}</p>{/if}</section></article>
<nav class="next-links" aria-label={zh ? '前後概念' : 'Adjacent concepts'}>
{#if navigation.previous}<a href={navigation.previous.href ?? modulePath(navigation.previous.module,lang)+'#'+navigation.previous.id.toLowerCase()}>← {navigation.previous.id} · {navigation.previous.title[lang]}{navigation.previous.href ? '' : (zh ? ' · 待整理' : ' · pending')}</a>{:else}<a href={modulePath(data.module!.id,lang)+'#one-concept'}>← {zh ? '概念目錄（第一個概念）' : 'Concept index (first concept)'}</a>{/if}
{#if navigation.next}<a href={navigation.next.href ?? modulePath(navigation.next.module,lang)+'#'+navigation.next.id.toLowerCase()}>{zh ? '下一個：' : 'Next: '}{navigation.next.id} {navigation.next.title[lang]}{navigation.next.href ? '' : (zh ? ' · 待整理' : ' · pending')} →</a>{:else}<a href={modulePath(data.module!.id,lang)+'#one-concept'}>{zh ? '返回概念目錄' : 'Return to concept index'} →</a>{/if}
</nav>

<style>
  .light-code :global(pre) { background: #f2f6f5; color: #18252c; }
</style>
