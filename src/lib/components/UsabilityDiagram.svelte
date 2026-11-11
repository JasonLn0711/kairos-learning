<script lang="ts">
 import type {ConceptBlock} from '$lib/concepts';
 let {diagram,number,lang}:{diagram:ConceptBlock;number:number;lang:'zh'|'en'}=$props();
</script>
<figure class="usability-diagram" data-figure={number}>
 <figcaption><strong>{'caption' in diagram ? diagram.caption : ''}</strong></figcaption>
 {#if diagram.kind==='table'}
  <dl>{#each diagram.rows as row}<div><dt>{row[0]}</dt><dd>{row[1]}</dd></div>{/each}</dl>
  <p>{lang==='zh'?'虛構教學示例，不代表曾經進行真人測試。':'Fictional teaching example; no claim of human testing.'}</p>
 {:else if diagram.kind==='flow'}
  <ol>{#each diagram.items as item,i}<li><strong>{i+1}. {item.title}</strong><p>{item.body}</p>{#if i<diagram.items.length-1}<span class="arrow" aria-hidden="true">↓</span>{/if}</li>{/each}</ol>
  <p>{diagram.description}</p>
 {:else if diagram.kind==='cards'}
  {#each diagram.items as item}<section class="design"><h3>{item.title}</h3><strong>{item.body.split("\n")[0]}</strong><p>{item.body.split("\n").slice(1,-1).join("\n")}</p><span class="action">{item.body.split("\n").at(-1)}</span></section>{/each}
  <p>{diagram.description}</p>
 {/if}
 <a href={`/images/aase/m08-05-${number}-${lang}.svg`} target="_blank" rel="noreferrer">{lang==='zh'?'開啟／下載原尺寸 SVG':'Open / download full-size SVG'}</a>
</figure>
<style>
 figure{container-type:inline-size;padding:1rem;border:1px solid #d5dce0;border-radius:1rem;background:#fbfcfd;margin:1.5rem 0;color:#18252c}figcaption,p,li,dt,dd,h3,a,strong{font-size:1rem;line-height:1.8;overflow-wrap:anywhere}figcaption{margin-bottom:1rem}ol{list-style:none;padding:0;margin:0}li{text-align:center;padding:.5rem 0}p{margin:.5rem 0;white-space:pre-line}.arrow{display:block;color:#59666e;font-size:1.5rem}dl{margin:0}dl>div{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,2fr);gap:1rem;padding:.6rem 0;border-bottom:1px solid #d5dce0}dd{margin:0}.design{padding:1rem 0}.design+.design{border-top:1px solid #d5dce0}h3{margin:0 0 1rem;font-weight:400;color:#59666e}.action{display:block;text-align:center;background:#f1f2f3;padding:.4rem;border-radius:.4rem;font-size:1rem;line-height:1.8;overflow-wrap:anywhere}a{color:#075f87;text-decoration:underline}a:focus-visible{outline:3px solid #b15840;outline-offset:4px}@container(max-width:25rem){dl>div{grid-template-columns:1fr;gap:.25rem}dt{font-weight:700}}
</style>
