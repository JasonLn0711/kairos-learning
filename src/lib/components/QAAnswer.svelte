<script lang="ts">
 import {parseQA} from '$lib/qa-markdown';import QAInline from './QAInline.svelte';import QAQuiz from './QAQuiz.svelte';
 let {source,id,explanation,lang}:{source:string;id:string;explanation:string[];lang:string}=$props();
 const blocks=$derived(parseQA(source));
</script>
<div class="qa-original">
{#each blocks as b,i}
 {#if b.kind==='heading'}<h3 id={id+'-section-'+i} class="qa-source-text"><QAInline text={b.text}/></h3>
 {:else if b.kind==='paragraph'}<p class="qa-source-text"><QAInline text={b.text}/></p>
 {:else if b.kind==='code'}<pre><code class="qa-source-code">{b.text}</code></pre>
 {:else if b.kind==='table'}
 <!-- svelte-ignore a11y_no_noninteractive_tabindex (Keyboard scroll access for wide tables.) -->
 <div class="qa-table" role="region" aria-label={b.headers.join(' / ')} tabindex="0"><table><thead><tr>{#each b.headers as text}<th scope="col" class="qa-source-text"><QAInline {text}/></th>{/each}</tr></thead><tbody>{#each b.rows as row}<tr>{#each row as text}<td class="qa-source-text"><QAInline {text}/></td>{/each}</tr>{/each}</tbody></table></div>
 {:else if b.kind==='quiz'}<QAQuiz options={b.options} button={b.button} {id} {explanation} {lang}/>{/if}
{/each}
</div>
<style>.qa-table{max-width:100%;overflow-x:auto;margin:1rem 0}table{width:100%;border-collapse:collapse}th,td{text-align:left;vertical-align:top;padding:.6rem;border-bottom:1px solid var(--line);min-width:7rem}th{background:var(--soft)}h3{line-height:1.6}</style>
