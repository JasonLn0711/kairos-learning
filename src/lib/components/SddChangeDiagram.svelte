<script lang="ts">
 import type {ConceptVisual} from '$lib/concepts';
 let {diagram,lang}:{diagram:ConceptVisual;lang:'zh'|'en'}=$props();
</script>
<figure class="sdd-change">
 <figcaption><strong>{diagram.caption}</strong></figcaption>
 <ol>{#each diagram.items as item,i}<li><strong>{i+1}. {item.title}</strong><p>{item.body}</p>{#if i<4}<span aria-hidden="true">↓</span>{/if}</li>{/each}</ol>
 <p>{diagram.description}</p>
 <a href={`/images/aase/m05-04-workflow-${lang}.svg`} target="_blank" rel="noreferrer">{lang==='zh'?'開啟／下載原尺寸 SVG':'Open / download full-size SVG'}</a>
</figure>
<style>
 figure{background:#fbfcfc;border:1px solid var(--line);border-radius:16px;padding:1.25rem;margin:1.5rem 0;color:#18252c}
 figcaption{margin-bottom:1rem}ol{list-style:none;margin:0;padding:0;text-align:center}li{padding:.7rem;overflow-wrap:anywhere}li strong,p{font-size:1rem;line-height:1.8}li p{margin:.35rem 0}li span{display:block;color:#526168;margin:1rem 0 .2rem}li:last-child{border:1px solid #cbded8;background:#eaf6f2;border-radius:12px}a{display:inline-block;font-size:1rem;line-height:1.8;overflow-wrap:anywhere}a:focus-visible{outline:3px solid #97532b;outline-offset:3px}@media(max-width:540px){figure{padding:.75rem}}
</style>
