<script lang="ts">
 import type {ConceptVisual} from '$lib/concepts';
 let {diagram,number,lang}:{diagram:ConceptVisual;number:1|2|3;lang:'zh'|'en'}=$props();
</script>
<figure class:pair={number===1} data-tls-figure={number}>
 <figcaption><strong>{diagram.caption}</strong><p>{diagram.description}</p></figcaption>
 <ol>{#each diagram.items as item,i}<li>
  <div class="node" class:termination={number===2&&i===1}><strong>{item.title}</strong><p>{item.body.split('\n→ ')[0]}</p></div>
  {#if i<diagram.items.length-1}<div class="connector"><span aria-hidden="true">{number===1?'↔':'↓'}</span>{#if number!==1}<p>{item.body.split('\n→ ')[1]}</p>{/if}</div>{/if}
 </li>{/each}</ol>
 <a href={`/images/aase/m06-06-${number}-${lang}.svg`} target="_blank" rel="noreferrer">{lang==='zh'?'開啟／下載原尺寸 SVG':'Open / download full-size SVG'}</a>
</figure>
<style>
 figure{container-type:inline-size;margin:1.5rem 0;padding:1.25rem;border:1px solid #d5dce0;border-radius:.8rem;background:#fbfcfd;color:#18252c;min-width:0;overflow-wrap:anywhere}strong,p,a{font-size:1rem;line-height:1.8}figcaption>strong{font-size:1.15rem}p{margin:.5rem 0 0}figcaption{margin-bottom:1.25rem}ol{list-style:none;padding:0;margin:0;display:grid}li{position:relative;min-width:0}.node{padding:1rem;border:1px solid #d5dce0;border-radius:.6rem;background:#fff;min-width:0}.termination{border-color:#16804d;background:#f1faf5}.connector{text-align:center;padding:.65rem .5rem}.connector span{font-size:1.3rem;line-height:1.7}.connector p{margin:0}.pair ol{grid-template-columns:1fr 1fr;gap:3rem}.pair .node{height:100%;box-sizing:border-box}.pair .connector{position:absolute;left:calc(100% + .6rem);top:calc(50% - 1.5rem)}a{display:inline-block;margin-top:1.5rem}a:focus-visible{outline:3px solid #245fb0;outline-offset:3px}@container(max-width:32rem){.pair ol{grid-template-columns:1fr;gap:0}.pair .node{height:auto}.pair .connector{position:static}}@media(max-width:540px){figure{padding:.75rem}}
</style>
