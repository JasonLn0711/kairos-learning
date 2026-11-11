<script lang="ts">
 import type {ConceptVisual} from '$lib/concepts';
 let {diagram,number,lang}:{diagram:ConceptVisual;number:1|2|3|4|5;lang:'zh'|'en'}=$props();
</script>
<figure class="task-diagram" data-figure={number}>
 <figcaption><strong>{diagram.caption}</strong></figcaption>
 {#if number===1||number===2}
  <div class="center"><strong>{diagram.items[0].title}</strong><p>{diagram.items[0].body}</p></div>
  <div class="connector" aria-hidden="true"><svg viewBox="0 0 48 24"><path d={number===1?'M24 2v18m-6-6 6 6 6-6':'M24 2v8M8 10h32M8 10v12M40 10v12'}/></svg></div>
  <ul class="grid" role="list">{#each diagram.items.slice(1,number===1?5:6) as item}<li><strong>{item.title}</strong>{#if number===1}<p>{item.body}</p>{/if}</li>{/each}</ul>
  {#if number===1}<div class="connector" aria-hidden="true"><svg viewBox="0 0 48 24"><path d="M24 2v18m-6-6 6 6 6-6"/></svg></div><div class="center"><strong>{diagram.items[5].title}</strong><p>{diagram.items[5].body}</p></div>{/if}
 {:else if number===3}
  <div class="center"><strong>{diagram.items[0].title}</strong><div class="connector" aria-hidden="true"><svg viewBox="0 0 48 24"><path d="M24 2v18m-6-6 6 6 6-6"/></svg></div><p class="decision">{diagram.items[0].body}</p></div>
  <div class="branches">{#each [1,3] as i}<section class="branch"><strong class="condition">{diagram.items[i].title}</strong><div class="connector" aria-hidden="true"><svg viewBox="0 0 48 24"><path d="M24 2v18m-6-6 6 6 6-6"/></svg></div><p>{diagram.items[i].body}</p><div class="connector" aria-hidden="true"><svg viewBox="0 0 48 24"><path d="M24 2v18m-6-6 6 6 6-6"/></svg></div><div class="decision"><strong>{diagram.items[i+1].title}</strong><p>{diagram.items[i+1].body}</p></div></section>{/each}</div>
 {:else}
  <svelte:element this={number===4?'ol':'ul'} class="sequence" role="list">{#each diagram.items as item,i}<li><strong>{item.title}</strong><p>{item.body}</p>{#if number===4&&i<diagram.items.length-1}<div class="connector" aria-hidden="true"><svg viewBox="0 0 48 24"><path d="M24 2v18m-6-6 6 6 6-6"/></svg></div>{/if}</li>{/each}</svelte:element>
 {/if}
 <p class="interpretation">{diagram.description}</p>
 <a href={`/images/aase/m04-02-${number}-${lang}.svg`} target="_blank" rel="noreferrer">{lang==='zh'?'開啟／下載原尺寸 SVG':'Open / download full-size SVG'}</a>
</figure>
<style>
 figure{container-type:inline-size;margin:1.5rem 0;padding:1rem;border:1px solid var(--line);border-radius:1rem;background:#fbfcfd;color:#18252c}figcaption{font-size:1rem;line-height:1.8;margin-bottom:1rem}p{font-size:1rem;line-height:1.8;margin:.5rem 0;white-space:pre-line}strong{font-size:1rem;line-height:1.8}ul,ol{list-style:none;margin:0;padding:0}.center{text-align:center;padding:.5rem}.connector{text-align:center;color:#59666e;font-size:1.25rem;line-height:1.8}.connector svg{display:block;width:48px;height:24px;margin:.5rem auto;fill:none;stroke:currentColor;stroke-width:1.6}.grid,.branches{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.75rem}.grid li,.decision{border:1px solid #d5dce0;border-radius:.6rem;padding:.75rem;text-align:center;min-width:0}.grid li{margin:0}.branch{text-align:center;min-width:0}.condition{display:inline-block;background:#e4e8eb;padding:.2rem .6rem;border-radius:1rem}.branch:first-child .condition{background:#ffe6d5;color:#8c3b15}.sequence li{padding:.75rem 0;margin:0;border-bottom:1px solid #d5dce0}.sequence li:last-child{border:0}.interpretation{border-top:1px solid #d5dce0;padding-top:1rem;margin-top:1rem}a{font-size:1rem;line-height:1.8}a:focus-visible{outline:3px solid #b15840;outline-offset:4px}figure *{overflow-wrap:anywhere}
 @container(max-width:38rem){.grid,.branches{grid-template-columns:1fr}.branch+.branch{border-top:2px dashed #aab4bb;padding-top:1rem;margin-top:.5rem}}
</style>
