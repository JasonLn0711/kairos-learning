<script lang="ts">
 import type {ConceptVisual} from '$lib/concepts';
 let {diagram,number,lang}:{diagram:ConceptVisual;number:1|2|3|5|6;lang:'zh'|'en'}=$props();
 const destinations:Record<number,number[]>={0:[1],1:[2],2:[11,3],3:[4],4:[5,6],5:[1],6:[7],7:[8,9],8:[1],9:[10,11]};
 function routeText(body:string,targets:number[]):{text:string;target?:number}[]{
  const result:{text:string;target?:number}[]=[];
  let position=0;
  while(position<body.length){
   const match=targets.map(target=>({target,title:diagram.items[target].title,index:body.indexOf(diagram.items[target].title,position)})).filter(m=>m.index>=0).sort((a,b)=>a.index-b.index)[0];
   if(!match){result.push({text:body.slice(position)});break;}
   if(match.index>position)result.push({text:body.slice(position,match.index)});
   result.push({text:match.title,target:match.target});position=match.index+match.title.length;
  }
  return result;
 }
</script>
<figure class="workflow-diagram" class:decisions={number===2} class:dependency={number===6} class:sequence={number===1} data-workflow-figure={number}>
 <figcaption><strong>{diagram.caption}</strong><p>{diagram.description}</p></figcaption>
 <ol role="list">
  {#each diagram.items as item,i}<li id={`workflow-figure-${number}-node-${i}`} class:decision={number===2&&[2,4,7,9].includes(i)} class:end={number===2&&i>=10}>
   <strong>{number===2?`${String(i+1).padStart(2,'0')} · `:''}{item.title}</strong>
   {#if number===2&&destinations[i]}<p class="routes">{#each routeText(item.body,destinations[i]) as part}{#if part.target!==undefined}<a href={`#workflow-figure-${number}-node-${part.target}`}>{part.text}</a>{:else}{part.text}{/if}{/each}</p>{:else}<p>{item.body}</p>{/if}
   {#if number===1&&i<2||number===6&&[0,1,2].includes(i)}<span class="arrow" aria-hidden="true">↓</span>{/if}
  </li>{/each}
 </ol>
 <a class="download" href={`/images/aase/m03-03-${number}-${lang}.svg`} target="_blank" rel="noreferrer">{lang==='zh'?'開啟／下載原尺寸 SVG':'Open / download full-size SVG'}</a>
</figure>
<style>
 figure{container-type:inline-size;min-width:0;margin:1.5rem 0;padding:1.25rem;border:1px solid #c5d6cb;border-radius:1rem;background:#fbfdfb;color:#173329;overflow-wrap:anywhere}figcaption strong{font-size:1.1rem}p,strong,a{font-size:1rem;line-height:1.8}p{margin:.5rem 0}ol{list-style:none;margin:1.25rem 0;padding:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1rem}li{margin:0;padding:1rem;border:1px solid #adcbb8;border-radius:.8rem;background:#f0f8f3;min-width:0;position:relative;scroll-margin-top:6rem}.decision{border:2px dashed #658f76;background:#e3f2e9}.end{border-radius:2rem;background:#d9eee0}nav{display:flex;flex-direction:column;gap:.5rem}a{color:#175b3b;text-underline-offset:.2em}.sequence ol{grid-template-columns:1fr;gap:2.5rem}.arrow{position:absolute;bottom:-2.2rem;left:calc(50% - .5rem);font-size:1.5rem;color:#557764}.dependency ol{grid-template-columns:repeat(2,minmax(0,1fr));gap:2.5rem 1rem}.dependency li:nth-child(-n+3),.dependency li:last-child{grid-column:1/-1}.dependency li:nth-child(4),.dependency li:nth-child(5){border-color:#64748b;background:white}.dependency li:last-child:before{content:'↑';position:absolute;top:-2.3rem;left:calc(50% - .5rem);transform:rotate(180deg);font-size:1.5rem;color:#557764}.download{display:inline-block;margin-top:.5rem}a:focus-visible{outline:3px solid #2563eb;outline-offset:3px}li:target{outline:3px solid #2563eb;outline-offset:3px}
 @container(max-width:40rem){ol{grid-template-columns:1fr}.dependency ol{grid-template-columns:1fr}.dependency li:nth-child(5){margin-top:-1.5rem}.dependency li:nth-child(4)::before,.dependency li:nth-child(5)::before{content:'∥';display:inline-block;margin-right:.5rem;color:#475569}}
 @media(max-width:540px){figure{padding:.75rem}}
</style>
