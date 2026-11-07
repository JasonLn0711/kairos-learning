<script lang="ts">
 import {onMount} from 'svelte';
 import type {ConceptVisual} from '$lib/concepts';
 import ContextBudgetDemo from './ContextBudgetDemo.svelte';
 let {diagram,number,lang}:{diagram:ConceptVisual;number:1|2|3|4|5;lang:'zh'|'en'}=$props();
 let ready=$state(false),copyState=$state<'idle'|'copied'|'failed'>('idle');
 onMount(()=>{ready=true;});
 async function copy(){try{await navigator.clipboard.writeText(diagram.items.map(i=>`${i.title}: ${i.body}`).join('\n')+'\n\n'+diagram.description);copyState='copied';}catch{copyState='failed';}}
</script>
<figure class="context-diagram" class:selection={number===1} class:composition={number===2} class:handoff={number===4} class:workflow={number===5} data-figure={number}>
 <figcaption><strong>{diagram.caption}</strong></figcaption>
 {#if number===3}<ContextBudgetDemo {diagram} {lang}/><h3>{lang==='zh'?'下載圖的靜態預設值':'Static defaults in the downloadable diagram'}</h3>{/if}
 {#if number===4}<button onclick={copy} disabled={!ready}>{lang==='zh'?'複製交接範例':'Copy handoff example'}</button><p role="status">{copyState==='copied'?(lang==='zh'?'已複製，包含教學假設說明。':'Copied, including the teaching-assumption note.'):copyState==='failed'?(lang==='zh'?'無法存取剪貼簿；請選取下方文字手動複製。':'Clipboard access failed; select the text below and copy it manually.') : ''}</p><noscript><p>{lang==='zh'?'可直接選取下方交接文字複製。':'Select the handoff text below to copy it manually.'}</p></noscript>{/if}
 <ol>{#each diagram.items as item,i}<li>
  <strong>{item.title}</strong>
  {#if number===1&&i===0}<div class="files" aria-hidden="true">{#each Array(6) as _}<span>▤</span>{/each}</div>{/if}
  {#if number===1&&i===1}<ul>{#each item.body.split('\n') as line}<li>{line}</li>{/each}</ul>{:else}<p>{item.body}</p>{/if}
  {#if number===1&&i===0}<span class="select-label">{lang==='zh'?'選取':'Select'}<svg aria-hidden="true" viewBox="0 0 80 24"><path d="M2 12h72m-9-8 9 8-9 8"/></svg></span>{/if}
  {#if number===5&&i<3}<svg class="arrow" aria-hidden="true" viewBox="0 0 24 32"><path d="M12 2v26m-7-7 7 7 7-7"/></svg>{/if}
 </li>{/each}</ol>
 <p class="description">{diagram.description}</p>
 <a href={`/images/aase/m02-02-${number}-${lang}.svg`} target="_blank" rel="noreferrer">{lang==='zh'?'開啟／下載原尺寸 SVG':'Open / download full-size SVG'}</a>
</figure>
<style>
 figure{container-type:inline-size;background:#fbfcfc;border:1px solid #d4d8da;border-radius:1rem;padding:1.25rem;margin:1.5rem 0;min-width:0;color:#26353c;overflow-wrap:anywhere}figcaption{margin-bottom:1.25rem}figcaption strong{font-size:1.15rem}p,strong,li,a,button{font-size:1rem;line-height:1.8}ol{list-style:none;padding:0;margin:0;display:grid;gap:1rem}ol>li{min-width:0;position:relative;margin:0}p{margin:.4rem 0}.description{margin:1.25rem 0 .6rem}.selection{background:#f8f6f1}.selection ol{grid-template-columns:repeat(2,minmax(0,1fr));gap:5.5rem}.selection ol>li{background:#e8e5de;border:2px solid #c8c2b7;padding:1rem;border-radius:1rem;text-align:center}.selection ol>li:last-child{background:#ecd5c8;border-color:#b77e65}.selection ul{list-style:none;padding:0;margin:1rem 0 0}.selection ul li{margin:.6rem 0;padding:.5rem;background:#fff;border-radius:.5rem}.selection ul li:last-child{border:1px dashed #aa8472;background:#f6ece6}.files{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.5rem;margin:1rem 0}.files span{font-size:2.1rem;background:white;border:1px solid #c8c2b7;border-radius:.5rem}.files span:nth-child(3){background:#cddbd3}.select-label{position:absolute;left:calc(100% + .3rem);top:45%;width:4.8rem;color:#9c5b45}.select-label svg{display:block;width:100%;fill:none;stroke:currentColor;stroke-width:3;stroke-dasharray:7 5}.composition li{border-bottom:1px solid #d5dcdf;padding:.7rem 0}.handoff ol{gap:.65rem}.handoff ol>li strong{margin-right:.5rem}.handoff ol>li p{display:inline}.workflow ol{gap:2.5rem;text-align:center}.workflow ol>li{padding:.8rem}.workflow ol>li:nth-child(3){background:#f4eae6;border:1px solid #ca9c87;border-radius:.5rem}.arrow{position:absolute;left:calc(50% - .6rem);top:calc(100% + .2rem);width:1.2rem;height:2rem;fill:none;stroke:#697b82;stroke-width:2}button{color:#26353c;font:inherit;padding:.3rem .8rem;background:white;border:1px solid #8b9699;border-radius:.5rem;cursor:pointer;margin-bottom:.6rem}button:disabled{opacity:.65;cursor:default}button:focus-visible,a:focus-visible{outline:3px solid #245fb0;outline-offset:3px}
 @container(max-width:34rem){.selection ol{grid-template-columns:1fr;gap:5.5rem}.select-label{left:calc(50% - 2.4rem);top:calc(100% + .5rem)}.select-label svg{transform:rotate(90deg);height:2.5rem}}
 @media(max-width:540px){figure{padding:.75rem}}
</style>
