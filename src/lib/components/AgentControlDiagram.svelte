<script lang="ts">
 import type {ConceptVisual} from '$lib/concepts';
 let {diagram,number,lang}:{diagram:ConceptVisual;number:1|2|3|4;lang:'zh'|'en'}=$props();
 const split=$derived(number===1?2:number===2?4:0);
</script>
<figure class="agent-control-diagram" data-figure={number}>
 <figcaption><strong>{diagram.caption}</strong></figcaption>
 {#if number===3}
 <dl class="contract">{#each diagram.items as item,i}<div class:permission={i===1||i===2} class:prohibited={i===2}><dt>{item.title}</dt><dd>{item.body}</dd></div>{/each}</dl>
 {:else}
 <ol class="sequence">{#each diagram.items.slice(0,split||undefined) as item,i}<li class:agent={number===4&&i===2}><strong>{item.title}</strong><p>{item.body}</p>{#if i<(split||diagram.items.length)-1}<span class="arrow" aria-hidden="true">↓</span>{/if}</li>{/each}</ol>
 {#if split}
 <div class="fork" aria-hidden="true"><svg viewBox="0 0 600 50" preserveAspectRatio="none"><path d="M300 0V18H150V42m-7-7 7 7 7-7M300 18H450V42m-7-7 7 7 7-7"/></svg></div>
 <ul class="outcomes">{#each diagram.items.slice(split) as item,i}<li class:failure={number===1?i===1:i===0} class:success={number===1?i===0:i===1}><strong>{item.title}</strong><p>{item.body}</p>{#if number===2&&i===0}<span class="return">↩ {lang==='zh'?'回到「觀察」；遇停止條件則交接':'Return to Observe; hand off at a stop condition'}</span>{/if}</li>{/each}</ul>
 {/if}
 {/if}
 <p class="interpretation">{diagram.description}</p>
 <a href={`/images/aase/m02-04-${number}-${lang}.svg`} target="_blank" rel="noreferrer">{lang==='zh'?'開啟／下載原尺寸 SVG':'Open / download full-size SVG'}</a>
</figure>
<style>
 figure{container-type:inline-size;background:#fbfcfc;border:1px solid var(--line);border-radius:6px;padding:1.25rem;margin:1.5rem 0;color:#18252c}figcaption{margin-bottom:1.25rem}figcaption>strong{font-size:1.1rem}
 p,li,dt,dd,.return{font-size:1rem;line-height:1.8;overflow-wrap:anywhere}p{margin:.4rem 0 0}ul,ol{list-style:none;margin:0;padding:0}li{min-width:0;margin:0;border:1px solid #d4d8da;border-radius:10px;padding:1rem}strong{line-height:1.8}.sequence{text-align:center}.sequence li{position:relative;margin-bottom:2.5rem}.sequence li:last-child{margin-bottom:0}.arrow{position:absolute;left:calc(50% - .5rem);bottom:-2.3rem;color:#59666c;font-size:1.4rem}.agent{border-color:#b54b25}.fork svg{width:100%;height:3rem;display:block;fill:none;stroke:#59666c;stroke-width:2}.outcomes{display:grid;grid-template-columns:1fr 1fr;gap:1rem}.success{background:#edf5f0;border-color:#9bbbab}.failure,.prohibited{background:#fbf0ed;border-color:#d6ab9c}.return{display:block;margin-top:.8rem;font-weight:600}.contract{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin:0}.contract div{grid-column:1/-1;min-width:0;padding:.8rem;border-bottom:1px solid #d4d8da}.contract .permission{grid-column:auto}.contract dt{font-weight:650}.contract dd{margin:.4rem 0 0}.interpretation{margin:1.2rem 0 .6rem}a{font-size:1rem;line-height:1.8}
 @container(max-width:32.5rem){.outcomes,.contract{grid-template-columns:1fr}.fork{display:none}.outcomes{margin-top:1rem}.outcomes li::before{content:'↳';display:block;color:#59666c}.contract .permission{grid-column:1/-1}}
 @media(max-width:540px){figure{padding:.8rem}}
</style>
