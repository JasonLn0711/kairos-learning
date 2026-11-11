<script lang="ts">
 import type {ConceptVisual} from '$lib/concepts';
 let {diagram,number,lang}:{diagram:ConceptVisual;number:1|2|3;lang:'zh'|'en'}=$props();
</script>
<figure data-verification-figure={number}>
 <figcaption><strong>{diagram.caption}</strong></figcaption>
 {#if number===1}
  <div class="spec"><strong>{diagram.items[0].title}</strong><p>{diagram.items[0].body}</p></div>
  <div class="arrow" aria-hidden="true">↓</div>
  <ul class="perspectives">{#each diagram.items.slice(1) as item}<li><strong>{item.title}</strong><p>{item.body}</p></li>{/each}</ul>
 {:else if number===2}
  <ul class="states">{#each diagram.items as item,i}<li><span class="status" class:pass={i===0} class:fail={i===1} aria-hidden="true">{['✓','×','○'][i]}</span><div><strong>{item.title.slice(2)}</strong><p>{item.body}</p></div></li>{/each}</ul>
 {:else}
  <ol class="workflow">{#each diagram.items as item,i}<li><strong>{item.title}</strong><p>{item.body}</p>{#if i<diagram.items.length-1}<span class="connector" aria-hidden="true">↓</span>{/if}</li>{/each}</ol>
 {/if}
 <p class="interpretation">{diagram.description}</p>
 <a href={`/images/aase/m08-01-${number}-${lang}.svg`} target="_blank" rel="noreferrer">{lang==='zh'?'開啟／下載原尺寸 SVG':'Open / download full-size SVG'}</a>
</figure>
<style>
 figure{container-type:inline-size;background:#fbfcfd;border:1px solid #d5dce0;border-radius:1rem;padding:1.1rem;margin:1.5rem 0;color:#18252c;min-width:0;overflow-wrap:anywhere}figcaption{margin-bottom:1rem}figcaption>strong{font-size:1.1rem;line-height:1.7}strong,p,a{font-size:1rem;line-height:1.8}p{margin:.35rem 0 0}ul,ol{list-style:none;padding:0;margin:0}.spec{text-align:center;padding:.8rem}.arrow{text-align:center;color:#53636d;font-size:1.3rem;margin:.7rem}.perspectives{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.6rem}.perspectives li{border:1px solid #d5dce0;border-radius:.7rem;padding:.8rem;min-width:0}.perspectives li:last-child{grid-column:1/-1}.states li{display:flex;gap:.8rem;padding:1rem 0;border-bottom:1px solid #d5dce0}.states li:last-child{border-bottom:0}.status{font-size:1.2rem;line-height:1.7;color:#53636d}.status.pass{color:#167243}.status.fail{color:#b52b31}.workflow{display:grid;gap:2.5rem;text-align:center}.workflow li{position:relative;padding:.7rem}.workflow li:last-child{border:1px solid #d5dce0;border-radius:.7rem}.connector{position:absolute;top:calc(100% + .4rem);left:calc(50% - .5rem);color:#53636d}.interpretation{margin:1rem 0 .5rem}a{display:inline-block}a:focus-visible{outline:3px solid #245fb0;outline-offset:3px}@container(max-width:30rem){.perspectives{grid-template-columns:1fr}}@media(max-width:540px){figure{padding:.75rem}}
</style>
