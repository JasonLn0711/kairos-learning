<script lang="ts">
 import previous from '$lib/m0402-previous.json';
 import type {ConceptBlock,ConceptCheck} from '$lib/concepts';
 import ConceptBlocks from './ConceptBlocks.svelte';
 import ConceptChecks from './ConceptChecks.svelte';
 import InlineText from './InlineText.svelte';
 let {checks}:{checks:ConceptCheck[]}=$props();
</script>
<aside class="supplement" aria-label="既有教材補充與解析">
 <h2 id="retained-material">既有教材補充與解析</h2>
 <p>保留先前公開版的操作練習、技術補充與教材解析。以下內容與上方原稿分開；閱讀解析不會送出答案或記錄學習完成。</p>
 {#each previous as section}<section><h4>{section.heading}</h4>
  {#each section.paragraphs as p}<p><InlineText text={p}/></p>{/each}
  {#if section.blocks}<ConceptBlocks blocks={section.blocks as ConceptBlock[]}/>{/if}
  {#if section.id==='check'}<ConceptChecks {checks} lang="zh"/>{/if}
 </section>{/each}
</aside>
<style>
 .supplement{margin-top:2rem;border-top:1px solid var(--line);padding-top:1rem}section{margin:1rem 0;padding:1rem;border:1px solid var(--line);border-radius:10px}h4{font-weight:650;line-height:1.6}h4:focus-visible{outline:3px solid #17664b;outline-offset:4px}
</style>
