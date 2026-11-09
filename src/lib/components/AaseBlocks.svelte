<script lang="ts">
 import type {AaseBlock} from '$lib/aase';
 import AaseProse from './AaseProse.svelte';
 import ConceptBlocks from './ConceptBlocks.svelte';
 import ArchitectureDiagram from './ArchitectureDiagram.svelte';
 let {blocks,lang='zh'}:{blocks:AaseBlock[];lang?:'zh'|'en'}=$props();
</script>
{#each blocks as block}{#if block.kind==='prose'}<AaseProse paragraphs={block.paragraphs}/>{:else if block.kind==='architecture'}<ArchitectureDiagram diagram={block} {lang}/>{:else}<ConceptBlocks blocks={[block]}/>{/if}{/each}
