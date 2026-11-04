<script lang="ts">
 import previous from '$lib/m0403-previous.json';
 import type {ConceptBlock} from '$lib/concepts';
 import ConceptBlocks from './ConceptBlocks.svelte';
 import InlineText from './InlineText.svelte';
 let {lang='zh'}:{lang?:string}=$props();
 const text=$derived(previous[lang==='zh'?'zh':'en']);
</script>
<aside aria-label={lang==='zh'?'既有 FTP 教材補充':'Previous FTP teaching supplement'}>
 <h2 id="retained-material">{lang==='zh'?'既有教材補充與檢核':'Previous teaching and check'}</h2>
 <p>{lang==='zh'?'保留先前公開教材與未作答檢核。教材發布與閱讀內容都不會更新理解狀態。':'The previous teaching and unanswered check are retained. Publication and reading do not establish learner understanding.'}</p>
 {#each text.sections as section}<section><h4>{section.heading}</h4>{#each section.paragraphs as p}<p><InlineText text={p}/></p>{/each}{#if section.blocks}<ConceptBlocks blocks={section.blocks as ConceptBlock[]}/>{/if}</section>{/each}
</aside>
<style>aside{margin-top:2rem;border-top:1px solid var(--line);padding-top:1rem}section{padding:1rem;border:1px solid var(--line);border-radius:8px;margin:1rem 0}h4{font-weight:650}h4:focus-visible{outline:3px solid #17664b;outline-offset:4px}p{white-space:pre-line}</style>
