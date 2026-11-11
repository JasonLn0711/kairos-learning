<script lang="ts">
 import InlineText from './InlineText.svelte';
 let {paragraphs}:{paragraphs:string[]}=$props();
</script>
{#each paragraphs as p}
 {#if p.startsWith('### ')}<h3 id={['### 還需要釐清四個常見名詞','### Four related terms'].includes(p)?'comparison':undefined}>{p.slice(4)}</h3>
 {:else if p.startsWith('> ')}<blockquote><p><InlineText text={p.slice(2)}/></p></blockquote>
 {:else if /^- /m.test(p)}<ul>{#each p.split('\n') as line}<li>{line.replace(/^- /,'')}</li>{/each}</ul>
 {:else if /^1\. /m.test(p)}<ol>{#each p.split('\n') as line}<li>{line.replace(/^\d+\. /,'')}</li>{/each}</ol>
 {:else}<p><InlineText text={p}/></p>{/if}
{/each}
