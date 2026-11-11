<script lang="ts">
 import type {ConceptVisual} from '$lib/concepts';
 let {diagram,number,lang}:{diagram:ConceptVisual;number:1|2;lang:'zh'|'en'}=$props();
</script>
<figure class="openspec-diagram" class:commands={number===1} data-figure={number}>
 <figcaption><strong>{diagram.caption}</strong></figcaption>
 <ol>{#each diagram.items as item,i}<li><span class="number" aria-hidden="true">{i+1}</span><div><strong>{item.title}</strong>{#each item.body.split('\n') as line}<p class:artifact={number===1&&i===0}>{line}</p>{/each}</div>{#if i>0}<svg class="arrow" aria-hidden="true" viewBox="0 0 24 32"><path d="M12 2v26m-7-7 7 7 7-7"/></svg>{/if}</li>{/each}</ol>
 <p class="return">{lang==='zh'?'↶ 下一次變更：回到規劃與釐清問題':'↶ Next change: return to planning and exploration'}</p>
 <p>{diagram.description}</p>
 <a href={`/images/aase/m05-05-${number}-${lang}.svg`} target="_blank" rel="noreferrer">{lang==='zh'?'開啟／下載原尺寸 SVG':'Open / download full-size SVG'}</a>
</figure>
<style>
 figure{container-type:inline-size;min-width:0;margin:1.5rem 0;padding:1.25rem;border:1px solid #b8d1d2;border-radius:.8rem;background:#f5faf9;color:#182f32;overflow-wrap:anywhere}figcaption{margin-bottom:1.25rem}figcaption strong{font-size:1.15rem}p,strong,a{font-size:1rem;line-height:1.8}ol{list-style:none;padding:0;margin:0;display:grid;gap:2.8rem}li{position:relative;display:flex;gap:.75rem;min-width:0;padding:1rem;border:1px solid #a8c5c7;border-radius:.6rem;background:#fff}li>div{min-width:0}li p{margin:.55rem 0 0}.artifact{padding:.5rem;border:1px solid #b8d1d2;border-radius:.4rem;background:#edf6f4}.number{flex:none;display:grid;place-items:center;width:1.8rem;height:1.8rem;background:#e3f1ef;border-radius:.4rem;font-weight:650}.arrow{position:absolute;top:-2.5rem;left:calc(50% - .6rem);width:1.2rem;height:2rem;fill:none;stroke:#386d72;stroke-width:2}.return{padding:.7rem 0;border-bottom:1px dashed #8bacae}a{display:inline-block;margin-top:.6rem}a:focus-visible{outline:3px solid #245fb0;outline-offset:3px}
 @container(min-width:36rem){.commands ol{grid-template-columns:repeat(3,minmax(0,1fr));gap:2.5rem}.commands li{display:block}.commands .number{margin-bottom:.7rem}.commands .arrow{top:calc(50% - 1rem);left:-1.9rem;transform:rotate(-90deg)}}
 @media(max-width:540px){figure{padding:.75rem}}
</style>
