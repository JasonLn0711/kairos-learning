<script lang="ts">
  let { text }: {text:string} = $props();
  const parts = $derived(text.split(/(\[[^\]]+\]\(https:\/\/[^)]+\))/g).map(part=>{
    const match=part.match(/^\[([^\]]+)\]\((https:\/\/[^)]+)\)$/);
    return match?{label:match[1],href:match[2]}:{label:part,href:null};
  }));
</script>
{#each parts as part}{#if part.href}<a href={part.href}>{part.label}</a>{:else}{part.label}{/if}{/each}
