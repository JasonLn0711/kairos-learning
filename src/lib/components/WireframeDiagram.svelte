<script lang="ts">
 import type {ConceptVisual} from '$lib/concepts';
 let {diagram,number,lang}:{diagram:ConceptVisual;number:number;lang:'zh'|'en'}=$props();
</script>
<figure class="wireframe-diagram" data-figure={number} class:states={number===2} class:transitions={number===3} class:comparison={number===4}>
 <figcaption><strong>{diagram.caption}</strong><p>{diagram.description}</p></figcaption>
 <svelte:element this={number===1?'ol':'ul'} role="list">
 {#each diagram.items as item,i}
 <li>
 {#if number===3}
 {@const endpoints=item.title.split(' → ')}
 <div class="endpoints"><strong>{endpoints[0]}</strong><span class="connector"><span>{item.body}</span><svg aria-hidden="true" viewBox="0 0 100 20" preserveAspectRatio="none"><path d="M0 10H97m-8-7 8 7-8 7"/></svg></span><strong>{endpoints[1]}</strong></div>
 {:else}
 <strong class="title">{item.title}</strong>
 {#each item.body.split('\n\n') as part,j}<p class:action={number===2&&j===item.body.split('\n\n').length-2} class:failure={number===4&&j===item.body.split('\n\n').length-1}>{part}</p>{/each}
 {#if number===1&&i<diagram.items.length-1}<svg class="next" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 2v19m-7-7 7 7 7-7"/></svg>{/if}
 {/if}
 </li>
 {/each}
 </svelte:element>
 <p><a href={`/images/aase/m04-04-${number}-${lang}.svg`} target="_blank" rel="noreferrer">{lang==='zh'?'開啟／下載原尺寸 SVG':'Open / download full-size SVG'}</a></p>
</figure>
<style>
 figure{container-type:inline-size;padding:1rem;margin:1.5rem 0;border:1px solid #d5dce0;border-radius:1rem;background:#fbfcfd;color:#18252c;min-width:0}figcaption,p,li,strong,a{font-size:1rem;line-height:1.8;overflow-wrap:anywhere}figcaption p{margin:.5rem 0 1rem}ul,ol{list-style:none;display:grid;gap:1rem;padding:0;margin:0}li{min-width:0;position:relative;padding:1rem;border:1px solid #d5dce0;border-radius:.8rem;margin:0}p{margin:.6rem 0;white-space:pre-line}.title{display:block}.states ul{grid-template-columns:repeat(2,minmax(0,1fr))}.states .title{padding-bottom:.8rem;border-bottom:1px solid #e4e7e9}.action{background:#eee;padding:.5rem;text-align:center;border-radius:.4rem}.comparison li+li{border-color:#77a88c}.failure{border-left:3px dashed #a32929;padding-left:.7rem}.next{display:block;width:24px;height:24px;margin:.8rem auto -2.5rem;position:relative;z-index:1;fill:none;stroke:#65757c;stroke-width:1.7}ol{gap:2.5rem}ol li{text-align:center}.transitions li{background:#edf9f1;border-color:#bddac9}.endpoints{display:grid;grid-template-columns:minmax(0,1fr) minmax(6rem,1fr) minmax(0,1fr);gap:1rem;align-items:center}.connector{text-align:center;font-size:1rem;line-height:1.8}.connector svg{display:block;width:100%;height:20px;stroke:#65757c;stroke-width:1.5;fill:none}a:focus-visible{outline:3px solid #b15840;outline-offset:4px}
 @container(max-width:35rem){.states ul{grid-template-columns:1fr}.endpoints{grid-template-columns:1fr;text-align:center}.connector svg{width:24px;height:24px;transform:rotate(90deg);margin:auto}.endpoints{gap:.4rem}li{padding:.7rem}}
</style>
