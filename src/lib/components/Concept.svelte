<script lang="ts">
  import type { Page } from '$lib/server/catalog';
  import { modulePath } from '$lib/model';
  let { data }: { data: Page } = $props();
  const lang = $derived(data.route.lang);
  const zh = $derived(lang === 'zh');
  const teaching = $derived(data.conceptTeaching!);
  const text = $derived(teaching.text[lang]);
  const parts = (value: string) => value.split(/(\[[^\]]+\]\(https:\/\/[^)]+\))/g).map(part => {
    const match = part.match(/^\[([^\]]+)\]\((https:\/\/[^)]+)\)$/);
    return match ? {label:match[1],href:match[2]} : {label:part,href:null};
  });
</script>
<p class="lead">{text.summary}</p>
<p class="metadata">{teaching.id} · v{teaching.revision} · {teaching.date} · {zh ? '公開教學版' : 'Public teaching edition'}</p>
<nav class="toc" aria-label={zh ? '本文導覽' : 'On this page'}><ol>{#each text.sections as section}<li><a href={'#'+section.id}>{section.heading}</a></li>{/each}<li><a href="#discussion">Q&A</a></li></ol></nav>
<article class="prose">{#each text.sections as section}<section><h2 id={section.id}>{section.heading}</h2>{#each section.paragraphs as p}<p style="white-space: pre-line">{#each parts(p) as part}{#if part.href}<a href={part.href}>{part.label}</a>{:else}{part.label}{/if}{/each}</p>{/each}</section>{/each}
<section><h2 id="discussion">{zh ? '概念 Q&A' : 'Concept Q&A'}</h2><p>{zh ? '待補：收到相關問題後，會整理為匿名教學版。' : 'Pending: related questions will be edited into anonymous teaching notes when available.'}</p></section></article>
<nav class="next-links" aria-label={zh ? '前後概念' : 'Adjacent concepts'}><a href={modulePath('m04',lang)+'#one-concept'}>← {zh ? 'M04 概念目錄（本章第一個概念）' : 'M04 concept index (first concept)'}</a><a href={modulePath('m04',lang)+'#m04-02'}>{zh ? '下一個：M04-02 DNS 列舉 · 待整理' : 'Next: M04-02 DNS enumeration · pending'} →</a></nav>
