<script lang="ts">
 import {onMount} from 'svelte';
 import type {AaseSection} from '$lib/aase';
 import AaseBlocks from './AaseBlocks.svelte';
 import InlineText from './InlineText.svelte';
 import {deliveryFee,acceptsLength} from '$lib/rule-testing-demo';
 let {section,lang}:{section:AaseSection;lang:'zh'|'en'}=$props();
 let ready=$state(false);let amount=$state(999);let length=$state(80);
 const zh=$derived(lang==='zh');
 onMount(()=>{ready=true;});
</script>
{#snippet prose(values:string[])}
 {#each values.flatMap(p=>p.split('\n\n')) as p}
  {#if p.startsWith('### ')}<h3><InlineText text={p.slice(4)}/></h3>
  {:else if p.startsWith('- ')}<ul>{#each p.split('\n') as line}<li><InlineText text={line.replace(/^- /,'')}/></li>{/each}</ul>
  {:else if p.startsWith('1. ')}<ol>{#each p.split('\n') as line}<li><InlineText text={line.replace(/^\d+\. /,'')}/></li>{/each}</ol>
  {:else}<p><InlineText text={p}/></p>{/if}
 {/each}
{/snippet}
{@render prose(section.paragraphs)}
{#each section.blocks??[] as block}
 {#if block.kind==='prose'}{@render prose(block.paragraphs)}
 {:else if block.kind==='flow'||block.kind==='cards'}
  {@const n=section.id==='map'?1:section.id==='delivery'?2:3}
  <figure data-rule-testing-figure={n}>
   <figcaption><strong>{block.caption}</strong><p>{block.description}</p></figcaption>
   {#if n===1}
    <ol class="process">{#each block.items as item,i}<li class:pass={i===3} class:fail={i===4}><strong>{item.title}</strong><p>{item.body}</p>{#if i<3}<span aria-hidden="true">↓</span>{/if}</li>{/each}</ol>
   {:else if n===2}
    <label for="delivery-amount">{block.items[0].title} <strong>NT$ {amount.toLocaleString('en-US')}</strong></label>
    <input id="delivery-amount" type="range" min="0" max="2000" step="1" bind:value={amount} disabled={!ready}/>
    <div class="ends"><span>0</span><span>{zh?'1,000 元門檻':'1,000 threshold'}</span><span>2,000</span></div>
    <div class="result" aria-live="polite"><p>{block.items[1].title}：<strong>NT$ {deliveryFee(amount)}</strong></p><p>{amount<1000?(zh?`距離免運門檻還差 NT$ ${1000-amount}`:`NT$ ${1000-amount} below free delivery`):(zh?'已達免運門檻':'Free-delivery threshold reached')}</p></div>
   {:else}
    <label for="rule-length">{zh?'輸入長度':'Input length'} <strong>{length} {zh?'字元':'characters'}</strong></label>
    <input id="rule-length" type="range" min="0" max="100" step="1" bind:value={length} disabled={!ready}/>
    <ul class="boundaries">{#each block.items as item}<li><strong>{item.title}</strong><p>{item.body}</p></li>{/each}</ul>
    <p class="result" aria-live="polite">{acceptsLength(length)?(zh?'符合長度規格':'Within the length limit'):(zh?'超過長度規格':'Exceeds the length limit')} — {zh?'尚須檢查是否為有效的非空字串':'Still check for a valid nonempty string'}</p>
   {/if}
   {#if n!==1&&!ready}<p>{zh?'啟用 JavaScript 後可調整滑桿；目前顯示可核對的預設案例。':'Enable JavaScript to adjust the slider; the default example remains readable.'}</p>{/if}
   <a href={`/images/aase/m08-03-${n}-${lang}.svg`} target="_blank" rel="noreferrer">{zh?'開啟／下載預設案例 SVG':'Open / download default-example SVG'}</a>
  </figure>
 {:else}<AaseBlocks blocks={[block]} {lang}/>{/if}
{/each}
<style>
 figure{container-type:inline-size;min-width:0;border:1px solid #b9c4ca;border-radius:.8rem;padding:1rem;margin:1.5rem 0;background:#fbfcfd;color:#18252c;overflow-wrap:anywhere}p,li,label,a{font-size:1rem;line-height:1.8}figcaption{margin-bottom:1rem}figcaption strong{font-size:1.15rem}p{margin:.5rem 0 1rem}label{display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap}input{width:100%;margin:1rem 0;accent-color:#175f91}.ends{display:flex;justify-content:space-between;gap:.5rem;flex-wrap:wrap}.result{margin:1rem 0;padding:.75rem;background:#f0f6f7;border:1px solid #b9c4ca;border-radius:.5rem}.process,.boundaries{list-style:none;padding:0;display:grid;gap:1rem}.process{grid-template-columns:1fr 1fr;gap:2.8rem 1rem}.process li,.boundaries li{position:relative;min-width:0;border:1px solid #b9c4ca;border-radius:.5rem;padding:1rem;text-align:center;background:white}.process li:nth-child(-n+3){grid-column:1/-1}.process li span{position:absolute;top:calc(100% + .5rem);left:50%}.process .pass{border-color:#16804d;background:#f0f8f3}.process .fail{border-color:#a63939;background:#fff5f5}.boundaries{grid-template-columns:repeat(3,1fr)}a:focus-visible,input:focus-visible{outline:3px solid #175f91;outline-offset:4px}@container(max-width:24rem){.process,.boundaries{grid-template-columns:1fr}.process li{grid-column:1!important}}
</style>
