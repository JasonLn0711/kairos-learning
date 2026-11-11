<script lang="ts">
 import ArchitectureDiagram from './ArchitectureDiagram.svelte';
 import type {ArchitectureDiagramModel} from '$lib/architecture-diagram';
 import type {ConceptVisual} from '$lib/concepts';
 let {diagram,number,lang}:{diagram:ArchitectureDiagramModel|ConceptVisual;number:number;lang:'zh'|'en'}=$props();
</script>
<div class="context-figure" data-figure={number}>
 {#if diagram.kind==='architecture'}<ArchitectureDiagram {diagram} {lang}/>
 {:else}<figure class="levels"><figcaption><strong>{diagram.caption}</strong></figcaption><ul>{#each diagram.items as item}<li><strong>{item.title}</strong><p>{item.body}</p></li>{/each}</ul><p>{diagram.description}</p></figure>{/if}
 <a href={`/images/aase/m06-02-${number}-${lang}.svg`} target="_blank" rel="noreferrer">{lang==='zh'?'開啟／下載原尺寸 SVG':'Open / download full-size SVG'}</a>
</div>
<style>
 .context-figure{container-type:inline-size;margin:1.5rem 0}.levels{margin:0;padding:1rem;border:1px solid var(--line);border-radius:1rem;background:#fbfcfd;color:#18252c}figcaption,p,li{font-size:1rem;line-height:1.8}ul{list-style:none;display:grid;grid-template-columns:1fr;gap:1rem;margin:1rem 0;padding:0}li{padding:1rem;margin:0;min-width:0;overflow-wrap:anywhere;border:1px solid #b8c2c9;border-radius:.8rem}p{margin:.5rem 0}a{display:inline-block;font-size:1rem;line-height:1.8;margin-top:.5rem}a:focus-visible{outline:3px solid #b15840;outline-offset:4px}
 .context-figure :global(.architecture-diagram){margin:0}.context-figure :global(.boundary){border-style:dashed}.context-figure :global(.nodes li[data-node='customer']){border-color:#36751b}.context-figure :global(.nodes li[data-node='email']){border-color:#b62032}.context-figure :global(.nodes li[data-node='core']){border-color:#a35c00}.context-figure :global(.boundary .nodes li){border-color:#3074aa;background:#edf4fa}
 @container(min-width:36rem){ul{grid-template-columns:repeat(2,minmax(0,1fr))}}
</style>
