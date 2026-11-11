<script lang="ts">
 import type {ConceptVisual} from '$lib/concepts';
 let {diagram,number,lang}:{diagram:ConceptVisual;number:number;lang:'zh'|'en'}=$props();
</script>
<figure class="environment-diagram" data-figure={number}>
 <figcaption><strong>{diagram.caption}</strong><p>{diagram.description}</p></figcaption>
 {#if number===1}
  <div class="roles" aria-hidden="true"><div><svg viewBox="0 0 80 52"><path d="M12 22h56L56 8H24ZM16 26v20h48V26M12 34h56M28 26v20M52 26v20"/></svg><span>{lang==='zh'?'餐廳':'Restaurant'}</span></div><div><svg viewBox="0 0 80 52"><path d="M16 8h48v30H16ZM8 46l8-8h48l8 8ZM34 18l-7 5 7 5m12-10 7 5-7 5"/></svg><span>{lang==='zh'?'軟體開發':'Software development'}</span></div></div>
  <dl class="pairs">{#each diagram.items as item}<div><dt>{item.title}</dt><dd>{item.body}</dd></div>{/each}</dl>
 {:else if number===3}
  <ol>{#each diagram.items as item,i}<li><div class="number" aria-hidden="true">{i+1}</div><div><strong>{item.title}</strong><p>{item.body}</p></div></li>{/each}</ol>
 {:else if number===4}
  <ul class="platforms">{#each diagram.items as item}<li><h3>{item.title}</h3><!-- svelte-ignore a11y_no_noninteractive_tabindex (A named scrolling code region needs keyboard access.) --><div class="code-region" role="region" aria-label={item.title+' commands'} tabindex="0"><pre><code>{item.body}</code></pre></div></li>{/each}</ul>
 {:else}
  <ul class="environments">{#each diagram.items as item}<li><strong>{item.title}</strong><p>{item.body}</p></li>{/each}</ul>
 {/if}
 <a class="download" href={`/images/aase/m07-01-${number}-${lang}.svg`} target="_blank" rel="noreferrer">{lang==='zh'?'開啟／下載原尺寸 SVG':'Open / download full-size SVG'}</a>
</figure>
<style>
 figure{container-type:inline-size;margin:1.5rem 0;padding:1.25rem;background:#fbfcfd;border:1px solid #bcc6cd;border-radius:12px;color:#18252c;min-width:0}
 figcaption strong{font-size:1.1rem;line-height:1.7}figcaption p,li p,dt,dd,.download,li strong{font-size:1rem;line-height:1.8;overflow-wrap:anywhere}
 figcaption p{margin:.6rem 0 1.2rem}.roles{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem}.roles>div{display:grid;place-items:center;gap:.4rem;padding:1rem;background:#eef2f4;border-radius:8px;font-size:1rem;line-height:1.8}.roles svg{width:5rem;max-width:100%;height:auto;fill:none;stroke:#506573;stroke-width:2}
 dl{margin:0}.pairs>div{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.6fr);gap:1rem;padding:.8rem 0;border-top:1px solid #dce2e6}dt{font-weight:650}dd{margin:0}
 ul,ol{list-style:none;padding:0;margin:0}li{min-width:0}.environments{display:grid;gap:1rem}.environments li{padding:1rem;border:1px solid #bcc6cd;border-left:4px solid #506573;border-radius:8px;background:white}li p{margin:.3rem 0 0}
 ol{display:grid;gap:1.8rem}ol li{position:relative;display:flex;gap:1rem;padding:.6rem 0}ol li:not(:last-child)::after{content:'↓';position:absolute;bottom:-1.5rem;left:.5rem;color:#506573;font-size:1.25rem}.number{flex:none;font-size:1rem;line-height:1.8;width:1.6rem}
 .platforms{display:grid;gap:1rem}.platforms li{border:1px solid #bcc6cd;border-radius:8px;overflow:hidden}.platforms h3{font-size:1rem;line-height:1.8;margin:0;padding:.8rem;background:#eef2f4}.code-region{overflow:auto;max-width:100%;padding:.8rem}pre{margin:0;overflow:visible;min-width:max-content;font-size:1rem;line-height:1.8}code{font:inherit;font-family:ui-monospace,monospace;background:none;padding:0}.download{display:inline-block;margin-top:1.25rem}
 @container(min-width:40rem){.platforms{grid-template-columns:repeat(2,minmax(0,1fr))}}
 @container(max-width:22rem){.pairs>div{grid-template-columns:1fr;gap:.2rem}.roles{gap:.5rem}.roles>div{padding:.6rem}}
 @media(max-width:540px){figure{padding:.8rem}}
</style>
