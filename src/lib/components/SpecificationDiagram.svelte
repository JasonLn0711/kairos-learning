<script lang="ts">
 import type {ConceptVisual} from '$lib/concepts';
 let {diagram,number,lang}:{diagram:ConceptVisual;number:1|2|3|4|5;lang:'zh'|'en'}=$props();
</script>
<figure class="specification-diagram" data-figure={number}>
 <figcaption><strong>{diagram.caption}</strong></figcaption>
 {#if number===1}
  <div class="layers">
   <div class="node story"><strong>{diagram.items[0].title}</strong><p>{diagram.items[0].body}</p></div>
   <span class="arrow" aria-hidden="true">↓</span>
   <ul class="parallel">{#each diagram.items.slice(1,3) as item,i}<li class="node" class:functional={i===0} class:quality={i===1}><strong>{item.title}</strong><p>{item.body}</p></li>{/each}</ul>
   <div class="node constraint"><strong>{diagram.items[3].title}</strong><p>{diagram.items[3].body}</p></div>
   <span class="arrow" aria-hidden="true">↓</span>
   <div class="node acceptance"><strong>{diagram.items[4].title}</strong><p>{diagram.items[4].body}</p></div>
  </div>
 {:else if number===5}
  <ol class="workflow">{#each diagram.items as item}<li><strong>{item.title}</strong><p>{item.body}</p></li>{/each}</ol>
 {:else}
  <ul class:parallel={number===2} class:rows={number===3||number===4}>{#each diagram.items as item}<li class="node"><strong>{item.title}</strong><p>{item.body}</p></li>{/each}</ul>
 {/if}
 <p class="interpretation">{diagram.description}</p>
 <a class="download" href={`/images/aase/m05-02-${number}-${lang}.svg`} target="_blank" rel="noreferrer">{lang==='zh'?'開啟／下載原尺寸 SVG':'Open / download full-size SVG'}</a>
</figure>
<style>
 figure{container-type:inline-size;background:#fbfcfd;border:1px solid var(--line);border-radius:1rem;padding:1.1rem;margin:1.5rem 0;color:#18252c}
 figcaption{margin-bottom:1rem}figcaption>strong{font-size:1.1rem;line-height:1.7}
 ul{list-style:none;margin:0;padding:0}.node{min-width:0;border:1px solid #647681;border-radius:.8rem;padding:.8rem;margin:0;background:#fff}.node strong,.workflow strong{font-size:1rem;line-height:1.7}.node p,.workflow p{margin:.3rem 0 0;font-size:1rem;line-height:1.8;white-space:pre-line;overflow-wrap:anywhere}
 .parallel{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.8rem}.layers{display:grid;gap:.8rem}.story,.constraint,.acceptance{text-align:center}.constraint{border-color:transparent;background:transparent}.functional{background:#edf3f8;border-color:#52748a}.quality{background:#edf5f2;border-color:#517864}.arrow{text-align:center;color:#53636d;font-size:1.3rem;line-height:1.7}
 .rows{display:grid;gap:0}.rows .node{border:0;border-bottom:1px solid var(--line);border-radius:0;background:transparent;padding:1rem 0}.rows .node:last-child{border-bottom:0}
 .workflow{padding-left:1.8rem;margin:0}.workflow li{padding:.3rem 0 .6rem .4rem;margin:0;overflow-wrap:anywhere}.workflow li::marker{font-weight:600}
 .interpretation,.download{font-size:1rem;line-height:1.8;overflow-wrap:anywhere}.interpretation{margin:1rem 0 .5rem}
 @container(max-width:34rem){.parallel{grid-template-columns:1fr}}
 @media(max-width:540px){figure{padding:.75rem}}
</style>
