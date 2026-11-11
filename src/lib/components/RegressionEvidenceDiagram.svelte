<script lang="ts">
 import type {ConceptVisual} from '$lib/concepts';
 let {diagram,lang}:{diagram:ConceptVisual;lang:'zh'|'en'}=$props();
</script>
<figure class="regression-evidence">
 <figcaption><strong>{diagram.caption}</strong></figcaption>
 <ol>{#each diagram.items as item}<li><strong>{item.title}</strong><p>{item.body}</p></li>{/each}</ol>
 <p class="interpretation">{diagram.description}</p>
 <a href={`/images/aase/m08-06-1-${lang}.svg`} target="_blank" rel="noreferrer">{lang==='zh'?'開啟／下載原尺寸 SVG':'Open / download full-size SVG'}</a>
</figure>
<style>
 figure{margin:1.5rem 0;padding:1rem;background:#fbfcfd;border:1px solid #d7dce0;border-radius:10px;color:#18252c}
 ol{list-style:none;padding:0;margin:1rem 0;text-align:center}
 li{padding:.65rem;overflow-wrap:anywhere;line-height:1.8}
 li p{margin:0;font-size:1rem;line-height:1.8}li strong{font-size:1rem}
 li:not(:last-child)::after{content:'↓';display:block;color:#59666c;margin:1rem 0 .2rem}
 li:last-child{background:#eaf6ef;border:1px solid #ccdfd3;border-radius:6px}
 .interpretation,a{font-size:1rem;line-height:1.8;overflow-wrap:anywhere}
</style>
