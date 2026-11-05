<script lang="ts">
 import type {AaseBlock} from '$lib/aase';
 import ConceptBlocks from './ConceptBlocks.svelte';
 import ArchitectureDiagram from './ArchitectureDiagram.svelte';
 let {blocks}:{blocks:AaseBlock[]}=$props();
</script>
{#each blocks as block}{#if block.kind==='architecture'}<ArchitectureDiagram diagram={block}/>{:else}<ConceptBlocks blocks={[block]}/>{/if}{/each}
