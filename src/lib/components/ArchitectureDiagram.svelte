<script lang="ts">
 import {architectureDiagramLabels,type ArchitectureDiagramModel} from '$lib/architecture-diagram';
 let {diagram,lang='zh'}:{diagram:ArchitectureDiagramModel;lang?:'zh'|'en'}=$props();
 const l=$derived(architectureDiagramLabels[lang]);
 const nodeTitle=(id:string)=>diagram.nodes.find(n=>n.id===id)!.title;
</script>
<figure class="architecture-diagram" data-level={diagram.level}>
 <figcaption><strong>{diagram.caption}</strong><p>{diagram.description}</p></figcaption>
 <div class="groups">
  {#each [false,true] as inside}
   <section class:boundary={inside} data-scope={inside?'inside':'outside'}>
    <h3>{inside?l.inside+'：'+diagram.boundary:l.outside}</h3>
    <ul class="nodes">{#each diagram.nodes.filter(n=>n.inside===inside) as node}<li data-node={node.id}><span class="node-kind">{l[node.kind]}</span><strong>{node.title}</strong><p>{node.body}</p></li>{/each}</ul>
   </section>
  {/each}
 </div>
 <h3>{l.relations}</h3>
 <ul class="relations">{#each diagram.relations as relation}<li data-from={relation.from} data-to={relation.to}><div class="endpoints"><strong>{nodeTitle(relation.from)}</strong><span class="arrow" aria-hidden="true">→</span><span class="sr-only">{l.to}</span><strong>{nodeTitle(relation.to)}</strong></div><p>{relation.label}</p></li>{/each}</ul>
</figure>
<style>
 .architecture-diagram{container-type:inline-size;margin:1.5rem 0;padding:1.25rem;background:var(--soft);border:1px solid var(--line);border-radius:6px;min-width:0}
 figcaption>strong{font-size:1.1rem}p,li,h3{font-size:1rem;line-height:1.8;overflow-wrap:anywhere}figcaption p{margin:.5rem 0 1rem}
 .groups{display:grid;gap:1rem}section{min-width:0;padding:.8rem;border:1px solid var(--line);border-radius:4px}.boundary{border:2px solid var(--accent);background:var(--paper)}h3{margin:.25rem 0 .8rem;font-weight:650;letter-spacing:normal}
 ul{list-style:none;padding:0;margin:0}.nodes{display:grid;gap:.75rem}li{min-width:0;margin:0;padding:.8rem;background:var(--paper);border:1px solid var(--line);border-radius:4px}.nodes strong,.node-kind{display:block}.node-kind{font-size:.9rem;line-height:1.8;color:var(--muted)}li p{margin:.45rem 0 0}.relations{display:grid;gap:.65rem}.groups+h3{margin:1.2rem 0 .75rem}
 .endpoints{display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);gap:.6rem;align-items:center}.arrow{font-size:1.4rem;line-height:1.8;color:var(--accent)}.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}
 @container(min-width:620px){.groups{grid-template-columns:1fr 1.4fr}}
 @container(max-width:360px){.endpoints{grid-template-columns:minmax(0,1fr)}.arrow{transform:rotate(90deg);width:1.4rem}}
</style>
