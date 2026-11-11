<script lang="ts">
 import type {ConceptVisual} from '$lib/concepts';
 let {diagram,number,lang}:{diagram:ConceptVisual;number:1|2|3;lang:'zh'|'en'}=$props();
 const icons=['M4 5h16v14H4zM7 9h1m3 0h1m3 0h1M7 13h10','M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18m-2 5 6 4-6 4z','m4 12 5 5L20 6m-7 11 7-7'];
</script>
<figure class="apptest-diagram" class:pipeline={number===1} class:stages={number===2} class:syntax={number===3} data-figure={number}>
 <figcaption><strong>{diagram.caption}</strong></figcaption>
 <ol>{#each diagram.items as item,i}<li class:missing={number===2&&i===0} class:success={number===2&&i===1}>
  {#if number===1}<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d={icons[i]}/></svg>{/if}
  <div class="entry"><strong class:code={number===3}>{item.title}</strong>{#each item.body.split('\n') as line}<p>{line}</p>{/each}</div>
  {#if number!==3&&i<diagram.items.length-1}<svg class="arrow" aria-hidden="true" viewBox="0 0 24 32"><path d="M12 2v26m-7-7 7 7 7-7"/></svg>{/if}
 </li>{/each}</ol>
 <p class="description">{diagram.description}</p>
 <a href={`/images/aase/m08-04-${number}-${lang}.svg`} target="_blank" rel="noreferrer">{lang==='zh'?'開啟／下載原尺寸 SVG':'Open / download full-size SVG'}</a>
</figure>
<style>
 figure{container-type:inline-size;margin:1.5rem 0;padding:1.25rem;min-width:0;border:1px solid #cbd7df;border-radius:1rem;background:#fbfcfd;color:#18252c;overflow-wrap:anywhere}figcaption{margin-bottom:1.25rem}figcaption strong{font-size:1.15rem}strong,p,a{font-size:1rem;line-height:1.8}ol{list-style:none;padding:0;margin:0;display:grid;gap:2.8rem}li{position:relative;padding:1rem;min-width:0;margin:0;border:1px solid #bdc9d0;border-radius:.65rem;background:white}p{margin:.4rem 0 0}.entry{min-width:0}.pipeline li{text-align:center}.icon{width:1.5rem;height:1.5rem;fill:none;stroke:currentColor;stroke-width:1.6;display:block;margin:0 auto .6rem}.arrow{position:absolute;top:calc(100% + .3rem);left:calc(50% - .6rem);width:1.2rem;height:2rem;fill:none;stroke:#5a7186;stroke-width:2}.missing{border-left:4px solid #a75527;background:#fff6ed}.success{border-left:4px solid #287254;background:#edf8f3}.stages .entry p{padding:.5rem 0;border-bottom:1px solid #d5dedf}.stages .entry p:last-child{border-bottom:0}.syntax ol{gap:1rem}.syntax li{border:0;border-left:3px solid #7893a5;border-radius:0;padding:.5rem 1rem}.code{font-family:var(--mono,monospace);white-space:normal;overflow-wrap:anywhere}.description{margin:1.25rem 0 .75rem}a:focus-visible{outline:3px solid #245fb0;outline-offset:3px}
 @container(min-width:38rem){.pipeline ol{grid-template-columns:repeat(3,minmax(0,1fr));gap:2.5rem}.pipeline .arrow{top:calc(50% - 1rem);left:calc(100% + .65rem);transform:rotate(-90deg)}}
 @media(max-width:540px){figure{padding:.75rem}}
</style>
