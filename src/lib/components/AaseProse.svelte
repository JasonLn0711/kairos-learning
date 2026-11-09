<script lang="ts">
 let {paragraphs}:{paragraphs:string[]}=$props();
</script>
{#each paragraphs as p}
 {#if /^- /m.test(p)}<ul>{#each p.split('\n') as line}<li>{line.replace(/^- /,'')}</li>{/each}</ul>
 {:else if /^1\. /m.test(p)}<ol>{#each p.split('\n') as line}<li>{line.replace(/^\d+\. /,'')}</li>{/each}</ol>
 {:else}<p>{p}</p>{/if}
{/each}
