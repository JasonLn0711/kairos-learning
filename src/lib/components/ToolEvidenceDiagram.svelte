<script lang="ts">
 import type {ConceptVisual} from '$lib/concepts';
 let {diagram,number,lang}:{diagram:ConceptVisual;number:1|2|3|4;lang:'zh'|'en'}=$props();
</script>
<figure class="tool-evidence" class:tool-flow={number===1} class:permission-pair={number===2} class:course-map={number===3} class:execution-record={number===4} data-figure={number}>
 <figcaption><strong>{diagram.caption}</strong></figcaption>
 {#if number===1}<p class="lead">{diagram.description}</p><svg class="initial-arrow" aria-hidden="true" viewBox="0 0 24 32"><path d="M12 2v26m-7-7 7 7 7-7"/></svg>{/if}
 <ol>{#each diagram.items as item,i}<li class:accepted={(number===1&&i===4)||(number===2&&i===0)} class:prohibited={number===2&&i===1} class:record-success={number===4&&i<3} class:record-missing={number===4&&i===3}>
  {#if number===3}<a href={`${lang==='en'?'/en':''}/courses/aase/v1/m02/concepts/m02-0${i+1}/`}>{item.title}</a>{:else}<strong>{item.title}</strong>{/if}<p>{item.body}</p>
  {#if number===1&&i<4}<svg class="arrow" aria-hidden="true" viewBox="0 0 24 32"><path d="M12 2v26m-7-7 7 7 7-7"/></svg>{/if}
 </li>{/each}</ol>
 {#if number!==1}<p class="description">{diagram.description}</p>{/if}
 <a class="download" href={`/images/aase/m02-06-${number}-${lang}.svg`} target="_blank" rel="noreferrer">{lang==='zh'?'開啟／下載原尺寸 SVG':'Open / download full-size SVG'}</a>
</figure>
<style>
 figure{container-type:inline-size;margin:1.5rem 0;padding:1.25rem;border:1px solid #d5dce0;border-radius:.8rem;background:#fbfcfd;color:#18252c;min-width:0;overflow-wrap:anywhere}figcaption{margin-bottom:1.25rem}strong{font-weight:650}figcaption strong{font-size:1.15rem}strong,p,a{font-size:1rem;line-height:1.8}ol{list-style:none;padding:0;margin:0;display:grid;gap:1rem}li{position:relative;margin:0;padding:1rem;min-width:0;border:1px solid #d5dce0;border-radius:.6rem;background:#fff}p{margin:.5rem 0 0}.lead{text-align:center}.initial-arrow{display:block;width:1.2rem;height:2rem;margin:.6rem auto;fill:none;stroke:#637982;stroke-width:2}.tool-flow ol{gap:2.8rem}.arrow{position:absolute;top:calc(100% + .3rem);left:calc(50% - .6rem);width:1.2rem;height:2rem;fill:none;stroke:#637982;stroke-width:2}.accepted{background:#eaf6ef;border-color:#91bca4}.prohibited{background:#fff5f4;border-color:#cba9a4}.prohibited strong{color:#9a302a}.permission-pair ol{grid-template-columns:repeat(2,minmax(0,1fr))}.course-map ol,.execution-record ol{gap:0}.course-map li,.execution-record li{display:grid;grid-template-columns:6rem minmax(0,1fr);gap:1rem;border:0;border-bottom:1px solid #d5dce0;border-radius:0;background:transparent;align-items:start}.course-map li p,.execution-record li p{margin:0}.execution-record li{grid-template-columns:minmax(0,2fr) minmax(0,1fr)}.record-success p{color:#176841}.record-missing p{color:#a12e23}.description{margin:1.25rem 0 .75rem}.download{display:inline-block;margin-top:1rem}a:focus-visible{outline:3px solid #245fb0;outline-offset:3px}
 @container(max-width:30rem){.permission-pair ol{grid-template-columns:1fr}.course-map li{grid-template-columns:1fr;gap:.3rem}.execution-record li{grid-template-columns:1fr;gap:.3rem}}
 @media(max-width:540px){figure{padding:.75rem}}
</style>
