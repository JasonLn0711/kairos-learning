<script lang="ts">
 import InlineText from './InlineText.svelte';
 let {text}:{text:string}=$props();
</script>
{#each text.split(/(`[^`]+`)/g) as part}{#if part.startsWith('`')&&part.endsWith('`')}<code>{part.slice(1,-1)}</code>{:else}<InlineText text={part}/>{/if}{/each}
