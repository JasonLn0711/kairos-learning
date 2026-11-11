<script lang="ts">
 import type {ConceptVisual} from '$lib/concepts';
 let {diagram,lang}:{diagram:ConceptVisual;lang:'zh'|'en'}=$props();
</script>
<figure class="prompt-spec-diagram">
 <figcaption><strong>{diagram.caption}</strong></figcaption>
 <ol>{#each diagram.items as item,i}<li class:verification={i===4}><strong>{item.title}</strong><p>{item.body}</p>{#if i<4}<span class="arrow" aria-hidden="true">↓</span>{/if}</li>{/each}</ol>
 <p class="interpretation">{diagram.description}</p>
 <a href={`/images/aase/m05-01-workflow-${lang}.svg`} target="_blank" rel="noreferrer">{lang==='zh'?'開啟／下載原尺寸 SVG':'Open / download full-size SVG'}</a>
</figure>
<style>
 figure{background:#fbfcfd;border:1px solid #d3d8dd;border-radius:1rem;padding:1.2rem;margin:1.5rem 0;color:#18252c;overflow-wrap:anywhere}
 figcaption,li strong{font-size:1.05rem;line-height:1.7}figcaption{margin-bottom:1.5rem}
 ol{list-style:none;padding:0;margin:0;text-align:center}li{margin:0;padding:.7rem .5rem;min-width:0}li p,.interpretation,a{font-size:1rem;line-height:1.8}li p{margin:.3rem 0 0}.arrow{display:block;margin:1rem 0 .2rem;color:#59666c}
 .verification{border:1px solid #d3d8dd;border-radius:.6rem}.interpretation{text-align:center;margin:1rem 0}a{display:inline-block}
 @media(max-width:540px){figure{padding:.8rem}}
</style>
