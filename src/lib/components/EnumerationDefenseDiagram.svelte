<script lang="ts">
 import {onMount} from 'svelte';
 import type {SourceBlock} from '$lib/concepts';
 let {block,lang}:{block:Extract<SourceBlock,{kind:'visual'}>;lang:string}=$props();
 const name=$derived(block.src.match(/m04-10-(rights|controls|acceptance)-/)![1]);
 const v=$derived(block.visual);
 let selected=$state(1);let ready=$state(false);
 onMount(()=>{ready=true;});
</script>
<figure data-enumeration-defense={name}>
 <figcaption>{v.caption}</figcaption>
 <p>{v.description}</p>
 {#if name==='acceptance'}
  <fieldset disabled={!ready}>
   <legend>{lang==='zh'?'選擇測試身分':'Select the tested identity'}</legend>
   {#each v.items as item,i}<label><input type="radio" name={'defense-identity-'+lang} value={i} bind:group={selected}/>{item.title}</label>{/each}
  </fieldset>
  <div class="result" aria-live="polite" aria-atomic="true">
   <strong>{v.items[selected].title}</strong>
   {#each v.items[selected].body.split('\n\n') as paragraph}<p>{paragraph}</p>{/each}
  </div>
  <p>{lang==='zh'?'完整合成案例對照（無 JavaScript 仍可閱讀）：':'All synthetic cases (readable without JavaScript):'}</p>
 {/if}
 <svelte:element this={name==='controls'?'ol':'ul'} class="nodes" class:flow={name==='controls'} class:parallel={name==='rights'} role="list">
  {#each v.items as item,i}
   <li>
    {#if name==='controls'&&i>0}<span class="arrow" aria-hidden="true">↓</span>{/if}
    <strong>{item.title}</strong>
    {#each item.body.split('\n\n') as paragraph}<p>{paragraph}</p>{/each}
   </li>
  {/each}
 </svelte:element>
 <a href={block.src} download>{block.downloadLabel}{name==='acceptance'?(lang==='zh'?'（全部案例）':' (all cases)'):''}</a>
</figure>
<style>
 figure{container-type:inline-size;margin:2rem 0;padding:1rem;border:1px solid #9bb1bd;border-radius:1rem;background:#fafcfc;min-width:0;overflow-wrap:anywhere;color:#183b59}
 figcaption{font-size:1.15rem;line-height:1.8;font-weight:700}p,strong,label,legend,a{font-size:1rem;line-height:1.8}p{margin:.6rem 0 1rem}
 .nodes{list-style:none;display:grid;gap:1rem;padding:0;margin:1.5rem 0}.nodes li,.result{min-width:0;border:1px solid #9bb1bd;border-radius:.75rem;background:white;padding:1rem;position:relative}.nodes p:last-child{margin-bottom:0}.flow{gap:3rem}.arrow{position:absolute;left:calc(50% - .5rem);top:-2.5rem;font-size:1.5rem;color:#47748e}
 fieldset{border:1px solid #9bb1bd;padding:1rem;min-width:0}label{display:flex;align-items:baseline;gap:.6rem;cursor:pointer;margin:.5rem 0}input{width:1.1rem;height:1.1rem;min-height:1.1rem;flex:none;accent-color:#183b59}.result{margin-top:1rem;border-left:4px solid #a44835}a{display:inline-block;margin-top:.5rem}
 @container(min-width:40rem){.parallel{grid-template-columns:repeat(3,minmax(0,1fr))}}
</style>
