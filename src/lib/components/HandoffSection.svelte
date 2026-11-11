<script lang="ts">
 import {onMount} from 'svelte';
 import type {AaseSection} from '$lib/aase';
 import AaseProse from './AaseProse.svelte';
 import AaseBlocks from './AaseBlocks.svelte';
 let {section,lang}:{section:AaseSection;lang:'zh'|'en'}=$props();
 let ready=$state(false);
 let selected=$state<boolean[]>(Array(8).fill(false));
 const count=$derived(selected.filter(Boolean).length);
 onMount(()=>{ready=true;});
</script>
<AaseProse paragraphs={section.paragraphs.flatMap(p=>p.split('\n\n'))}/>
{#each section.blocks??[] as block}
 {#if block.kind==='flow'||block.kind==='cards'}
  {@const checklist=section.id==='checklist'}
  <figure class:checklist>
   <figcaption>{block.caption}</figcaption>
   {#if checklist}
    <output aria-live="polite" aria-label={lang==='zh'?'已盤點項目數':'Reviewed items'}>{count} / 8</output>
    <progress max="8" value={count} aria-label={lang==='zh'?'文件盤點進度':'Document review progress'}></progress>
    <div class="checks">{#each block.items as item,i}<label><input type="checkbox" disabled={!ready} bind:checked={selected[i]}/><span>{item.title}</span></label>{/each}</div>
    <button disabled={!ready} onclick={()=>selected=Array(8).fill(false)}>{lang==='zh'?'重新檢查':'Reset review'}</button>
    <noscript><p>{lang==='zh'?'未啟用 JavaScript：八項清單仍可閱讀；勾選、計數與重設停用。':'JavaScript is off: all eight items remain readable; selection, counting and reset are disabled.'}</p></noscript>
   {:else}
    <ol class="route">{#each block.items as item,i}<li><h3>{item.title}</h3><p>{item.body}</p>{#if i<block.items.length-1}<svg aria-hidden="true" viewBox="0 0 24 32"><path d="M12 2v25m-6-6 6 6 6-6"/></svg>{/if}</li>{/each}</ol>
   {/if}
   <p class="description">{block.description}</p>
   <a href={`/images/aase/m09-02-${checklist?2:1}-${lang}.svg`} download>{lang==='zh'?'下載 SVG 圖檔':'Download SVG'}</a>
  </figure>
 {:else if block.kind==='prose'}<AaseProse paragraphs={block.paragraphs.flatMap(p=>p.split('\n\n'))}/>
 {:else}<AaseBlocks blocks={[block]} {lang}/>{/if}
{/each}
<style>
 figure{position:relative;margin:1.5rem 0;padding:1.25rem;border:1px solid #c9d1d5;border-radius:1rem;background:#fbfcfd;color:#18252c;line-height:1.7;min-width:0;overflow-wrap:anywhere}
 figcaption{font-weight:700;padding-right:4rem}output{position:absolute;right:1.25rem;top:1.25rem;font-size:1rem}progress{display:block;width:100%;height:.5rem;margin:1rem 0;accent-color:#356b57}
 .route{list-style:none;margin:1.5rem 0;padding:0;text-align:center}.route li{padding:0;display:flex;flex-direction:column;align-items:center}.route h3{font-size:1.0625rem;margin:0;line-height:1.7}.route p{margin:.25rem 0;line-height:1.7}.route svg{width:1.5rem;height:2rem;margin:.5rem 0;fill:none;stroke:#59666e;stroke-width:2}
 .checks{display:grid;gap:.75rem}.checks label{display:flex;align-items:flex-start;gap:.75rem;font-size:1rem;line-height:1.7;cursor:pointer}.checks input{flex:0 0 auto;width:1.125rem;height:1.125rem;margin-top:.3rem;accent-color:#356b57}
 button{display:block;margin:1rem 0 0 auto;border:1px solid #64748b;border-radius:1rem;background:white;color:inherit;font:inherit;padding:.25rem .75rem;cursor:pointer}button:disabled,input:disabled{cursor:default}button:focus-visible,input:focus-visible,a:focus-visible{outline:3px solid #175a86;outline-offset:4px}.description{margin:1rem 0 .5rem;font-size:1rem;line-height:1.7}a{font-size:1rem}
</style>
