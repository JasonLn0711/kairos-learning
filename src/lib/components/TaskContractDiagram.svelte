<script lang="ts">
 import type {ConceptVisual} from '$lib/concepts';
 let {diagram,number,lang}:{diagram:ConceptVisual;number:1|2;lang:'zh'|'en'}=$props();
</script>
<figure class:process={number===1}>
 <figcaption><strong>{diagram.caption}</strong></figcaption>
 {#if number===1}<ol>{#each diagram.items as item}<li><strong>{item.title}</strong><p>{item.body}</p></li>{/each}</ol>
 {:else}<ul>{#each diagram.items as item,i}<li><span aria-hidden="true">{i===0?'?':'↺'}</span><div><strong>{item.title}</strong><p>{item.body}</p></div></li>{/each}</ul>{/if}
 <p>{diagram.description}</p>
 <a href={`/images/aase/m07-02-${number}-${lang}.svg`} target="_blank" rel="noreferrer">{lang==='zh'?'開啟／下載原尺寸 SVG':'Open / download full-size SVG'}</a>
</figure>
<style>
 figure{container-type:inline-size;background:#fbfcfc;border:1px solid var(--line);border-radius:6px;padding:1.25rem;margin:1.5rem 0;color:#18252c}
 figcaption{margin-bottom:1.25rem}ul,ol{list-style:none;margin:0;padding:0}li{min-width:0;padding:.8rem}strong,p,a{overflow-wrap:anywhere}li strong{font-size:1.05rem;line-height:1.7}p,a{font-size:1rem;line-height:1.8}li p{margin:.4rem 0 0;white-space:pre-line}
 .process ol{text-align:center}.process li:not(:last-child)::after{content:'↓';display:block;color:#59666c;margin:1rem 0 .2rem}.process li:last-child{border:1px solid var(--line);border-radius:6px}
 ul li{display:flex;gap:1rem}ul li+li{border-top:1px solid var(--line)}li span{flex:none;font-size:1.3rem}
 @container(max-width:30rem){li{padding:.7rem .2rem}ul li{gap:.5rem}}
 @media(max-width:540px){figure{padding:.8rem}}
</style>
