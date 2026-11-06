<script lang="ts">
 import type {ConceptVisual} from '$lib/concepts';
 let {diagram,layout,lang}:{diagram:ConceptVisual;layout:'comparison'|'process'|'evidence';lang:'zh'|'en'}=$props();
 const icons=['</>','◉','↗'];
</script>
<figure class="requirements-diagram" class:comparison={layout==='comparison'} class:process={layout==='process'} class:evidence={layout==='evidence'}>
 <figcaption><strong>{diagram.caption}</strong></figcaption>
 {#if layout==='process'}
  <ol>{#each diagram.items as item}<li><strong>{item.title}</strong><p>{item.body}</p></li>{/each}</ol>
 {:else}
  <ul>{#each diagram.items as item,i}<li>{#if layout==='evidence'}<span aria-hidden="true" class="icon">{icons[i]}</span>{/if}<div><strong>{item.title}</strong><p>{item.body}</p></div></li>{/each}</ul>
 {/if}
 <p class="interpretation">{diagram.description}</p>
 <a class="download" href={`/images/aase/m01-04-${layout}-${lang}.svg`} target="_blank" rel="noreferrer">{lang==='zh'?'開啟／下載原尺寸 SVG':'Open / download full-size SVG'}</a>
</figure>
<style>
 figure{container-type:inline-size;background:#fbfcfc;border:1px solid var(--line);border-radius:6px;padding:1.25rem;margin:1.5rem 0;color:#18252c}
 figcaption{margin-bottom:1.25rem}figcaption>strong{font-size:1.1rem}
 ul,ol{list-style:none;margin:0;padding:0}li{margin:0;padding:0;min-width:0}li strong{font-size:1.05rem;line-height:1.7}li p,.interpretation{font-size:1rem;line-height:1.8;overflow-wrap:anywhere}li p{margin:.4rem 0 0}
 .comparison ul{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:2rem}.comparison .interpretation{border-top:1px solid var(--line);padding-top:1.2rem;font-weight:600}
 .process ol{text-align:center}.process li{padding:.75rem}.process li:not(:last-child)::after{content:'↓';display:block;color:#59666c;margin:1.1rem 0 .2rem}.process li:last-child{border:1px solid #b54b25;background:#f9f0eb;border-radius:6px}
 .evidence ul{display:grid;gap:1rem}.evidence li{display:flex;gap:1rem;align-items:center}.icon{flex:none;width:2.4rem;white-space:nowrap;text-align:center;font-size:1.25rem}
 .interpretation{margin:1.2rem 0 .6rem}.download{font-size:1rem;line-height:1.7;display:inline-block;overflow-wrap:anywhere}
 @container(max-width:32.5rem){.comparison ul{grid-template-columns:1fr;gap:1.5rem}}
 @media(max-width:540px){figure{padding:.8rem}}
</style>
