<script lang="ts">
 import type {ConceptVisual} from '$lib/concepts';
 let {diagram,number,lang}:{diagram:ConceptVisual;number:1|2|3|4;lang:'zh'|'en'}=$props();
 const roles=['context','tools','orchestration','execution','security','observability'];
</script>
{#snippet arrow()}<svg class="arrow" aria-hidden="true" viewBox="0 0 24 32"><path d="M12 2v26m-7-7 7 7 7-7"/></svg>{/snippet}
{#snippet card(i:number)}<strong>{diagram.items[i].title}</strong><p>{diagram.items[i].body}</p>{/snippet}
<figure class="harness-diagram" class:architecture={number===1} class:roles={number===2||number===3} class:workflow={number===4} data-figure={number}>
 <figcaption><strong>{diagram.caption}</strong></figcaption>
 {#if number===1}
  <div class="endpoint">{@render card(0)}</div>{@render arrow()}
  <div class="boundary"><h3>Agent Harness</h3><p class="boundary-label">{lang==='zh'?'工作支援系統':'Work support system'}</p>
   <ul class="parallel">{#each diagram.items.slice(1,7) as item}<li><strong>{item.title}</strong><p>{item.body}</p></li>{/each}</ul>
   <div class="llm"><span aria-hidden="true">↔</span><div>{@render card(7)}</div></div>
  </div>{@render arrow()}<div class="endpoint result">{@render card(8)}</div>
 {:else if number===2||number===3}
  {#each diagram.items as item,i}<section class="role"><h3 id={'harness-'+roles[(number-2)*3+i]}>{item.title}</h3>{#each item.body.split('\n\n') as p,j}<p>{#if j===item.body.split('\n\n').length-1}<strong>{p}</strong>{:else}{p}{/if}</p>{/each}</section>{/each}
 {:else}
  <ol>{#each diagram.items as item,i}<li class:result={i===4}><strong>{item.title}</strong><p>{item.body}</p></li>{#if i<4}<li class="connector" aria-hidden="true">{@render arrow()}</li>{/if}{/each}</ol>
 {/if}
 <div class="description">{#each diagram.description.split('\n\n') as p}<p>{p}</p>{/each}</div>
 <a href={`/images/aase/m02-05-${number}-${lang}.svg`} target="_blank" rel="noreferrer">{lang==='zh'?'開啟／下載原尺寸 SVG':'Open / download full-size SVG'}</a>
</figure>
<style>
 figure{container-type:inline-size;margin:1.5rem 0;padding:1.25rem;border:1px solid #d5dce0;border-radius:.8rem;background:#fbfcfd;color:#18252c;min-width:0;overflow-wrap:anywhere}figcaption{margin-bottom:1.25rem}figcaption strong{font-size:1.15rem}h3,strong,p,a{font-size:1rem;line-height:1.8}h3{margin:0;font-weight:650}p{margin:.5rem 0 0}.endpoint,.boundary,.parallel li,.llm,.workflow li:not(.connector){padding:1rem;border:1px solid #c6d3d8;border-radius:.6rem;min-width:0}.endpoint{text-align:center;background:#edf2f7}.boundary{border:2px solid #ba7950;background:#fff9f2}.boundary>h3,.boundary-label{text-align:center}.parallel{list-style:none;padding:0;margin:1rem 0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.8rem}.parallel li{margin:0;background:#fff}.llm{display:flex;gap:1rem;align-items:center;background:#e9edf6}.llm span{font-size:2rem}.llm>div{min-width:0}.arrow{display:block;margin:.5rem auto;width:1.5rem;height:2rem;fill:none;stroke:#637982;stroke-width:2}.role{padding:1.25rem 0;border-bottom:1px solid #d5dce0}.role:first-of-type{padding-top:0}.role:last-of-type{border-bottom:0}.role p{margin:1rem 0 0}.role h3{font-size:1.15rem}.workflow ol{list-style:none;padding:0;margin:0}.workflow li{margin:0}.workflow .connector{padding:0}.result{background:#e8f4ef;border-color:#90c7b9!important}.description{margin:1.25rem 0 .75rem}.workflow .description{border-top:1px solid #c6d3d8;padding-top:.5rem}a:focus-visible{outline:3px solid #245fb0;outline-offset:3px}
 @container(max-width:34rem){.parallel{grid-template-columns:1fr}.llm{display:block}.llm span{display:block}}
 @media(max-width:540px){figure{padding:.75rem}}
</style>
