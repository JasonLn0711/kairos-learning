<script lang="ts">
 import type {ConceptVisual} from '$lib/concepts';
 let {diagram,number,lang}:{diagram:ConceptVisual;number:number;lang:'zh'|'en'}=$props();
 const nodeId=(index:number)=>`recovery-form-${lang}-${index}`;
</script>
<figure class="recovery-diagram" data-figure={number}>
 <figcaption><strong>{diagram.caption}</strong></figcaption>
 {#if number===4}
  <div class="error-summary">
   <strong>{diagram.items[0].title}</strong><p>{diagram.items[0].body}</p>
   <ul>{#each [1,2] as i}<li><a href={'#'+nodeId(i)}>{diagram.items[i].title}</a>：{diagram.items[i].body}</li>{/each}</ul>
  </div>
  <dl class="form-example">
   {#each diagram.items.slice(3) as item,i}<div id={i===1?nodeId(1):i===2?nodeId(2):undefined} tabindex="-1" class:field-error={i===1||i===2}><dt>{item.title}</dt><dd>{item.body}</dd></div>{/each}
  </dl>
 {:else if number===5}
  <div class="state-flow">
   {#each diagram.items.slice(0,3) as item,i}<div class="stage" class:decision={i===2}><strong>{item.title}</strong><p>{item.body}</p></div><span class="down" aria-hidden="true">↓</span>{/each}
   <div class="branches">{#each diagram.items.slice(3) as item,i}<div class="branch" class:success={i===1}><strong>{item.title}</strong><p>{item.body}</p></div>{/each}</div>
  </div>
 {:else}
  <ul class:formula={number===3} class:message={number<3}>
   {#each diagram.items as item,i}<li><strong>{item.title}</strong><p>{item.body}</p></li>{#if number===3&&i<2}<li class="plus" aria-hidden="true">＋</li>{/if}{/each}
  </ul>
 {/if}
 <p class="interpretation">{diagram.description}</p>
 {#if number===4}<p><a href="https://design.cms.gov/patterns/Forms/error-validation/">CMS Design System — Error validation</a></p>{/if}
 <a href={`/images/aase/m04-06-${number}-${lang}.svg`} target="_blank" rel="noreferrer">{lang==='zh'?'開啟／下載原尺寸 SVG':'Open / download full-size SVG'}</a>
</figure>
<style>
 figure{container-type:inline-size;padding:1rem;margin:1.5rem 0;background:#fbfcfd;border:1px solid #d5dce0;border-radius:1rem;color:#18252c}figcaption,p,li,dt,dd,a,strong{font-size:1rem;line-height:1.8;overflow-wrap:anywhere}figcaption{margin-bottom:1rem}p{margin:.5rem 0;white-space:pre-line}ul{list-style:none;padding:0;margin:0;display:grid;gap:1rem}li,.stage,.branch{min-width:0;padding:1rem;border:1px solid #a4b1c3;border-radius:1rem}.message li{border:0;padding:.5rem}.message{border:1px solid #d5dce0;border-radius:.8rem;padding:.5rem}.formula{grid-template-columns:minmax(0,1fr) auto minmax(0,1fr) auto minmax(0,1fr);gap:.5rem}.formula li{position:relative}.formula .plus{display:flex;align-items:center;justify-content:center;padding:0;border:0;font-size:1.3rem;color:#59666e}.state-flow{max-width:48rem;margin:auto}.stage{max-width:32rem;margin:auto;text-align:center;background:#e9edf4}.decision{background:#fff2cc;border-color:#d99d26}.down{display:block;text-align:center;font-size:1.7rem;line-height:1.8}.branches{position:relative;margin-top:1rem;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem}.branches::before{content:"";position:absolute;left:25%;right:25%;top:-1rem;height:1rem;border:1px solid #59666e;border-bottom:0}.branches::before{content:"";position:absolute;left:25%;right:25%;top:-1rem;height:1rem;border:1px solid #59666e;border-bottom:0}.branch{background:#fce7e7;border-color:#ca5c62}.success{background:#e2f2e8;border-color:#609c77}.error-summary{border-left:7px solid #d71949;padding:1rem;background:#fff5f7}.error-summary ul{list-style:disc;padding-left:1.5rem}.error-summary li{border:0;padding:0}.form-example{margin:1rem 0}.form-example>div{margin:1rem 0;padding:1rem;border:1px solid #64748b;border-radius:.4rem}.form-example dt{font-weight:700}.form-example dd{margin:.5rem 0 0;white-space:pre-line}.form-example .field-error{border:2px solid #bc1744}.field-error dd{color:#a2153c}a{color:#075f87;text-decoration:underline}a:focus-visible,[tabindex]:focus{outline:3px solid #b15840;outline-offset:4px}.interpretation{margin-top:1rem}
 @container(max-width:36rem){.branches::before{display:none}.branches::before{display:none}.formula,.branches{grid-template-columns:1fr}.formula li{margin-bottom:.3rem}.branch{border-left-width:5px}}
</style>
