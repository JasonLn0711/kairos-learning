<script lang="ts">
 import models from '$lib/cs-systems-diagrams.json';
 import type {SystemsFigureName} from '$lib/perspective-body';
 let {name,lang}:{name:SystemsFigureName;lang:'zh'|'en'}=$props();
 const m=$derived(models[name]);
 const src=$derived(`/images/perspectives/cs-systems-${name}-${lang}.svg`);
 const icons=['M6 6h12v12H6z M9 9h6v6H9z M9 2v4 M15 2v4 M9 18v4 M15 18v4 M2 9h4 M2 15h4 M18 9h4 M18 15h4','M3 5h18v14H3z M6 8v4 M10 8v4 M14 8v4 M18 8v4 M6 19v3 M10 19v3 M14 19v3 M18 19v3','M3 12l4-8h10l4 8v8H3z M3 12h18 M6 16h1 M10 16h1','M3 3h18v14H3z M8 21h8 M12 17v4 M8 8h8 M8 12h8'];
</script>
{#snippet node(i:number)}
 {@const n=m.nodes[i][lang]}
 <div class="node" class:verification={name==='lifecycle'&&i===5}>
 {#if name==='hardware'}<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d={icons[i]}/></svg>{/if}
 <strong>{n.title}</strong>{#if n.body}<span>{n.body}</span>{/if}
 </div>
{/snippet}
{#snippet arrow()}<svg class="arrow" viewBox="0 0 24 32" aria-hidden="true"><path d="M12 2v25m-6-6 6 6 6-6"/></svg>{/snippet}
<figure class="systems-figure" class:dag={name==='git-dag'}>
 <figcaption>{m.title[lang]}</figcaption>
 {#if name==='lifecycle'}<ol class="flow">{#each m.nodes as _,i}<li>{#if i}{@render arrow()}{/if}{@render node(i)}</li>{/each}</ol>
 {:else if name==='hardware'}<div class="parallel hardware">{#each m.nodes as _,i}{@render node(i)}{/each}</div>
 {:else if name==='links'}
 <div class="comparison">
 <section><h4>Hard links</h4><div class="parallel">{@render node(0)}{@render node(1)}</div><p class="relation">a.txt ↘　↙ b.txt</p>{@render node(2)}{@render arrow()}{@render node(3)}</section>
 <section><h4>Symbolic link</h4>{@render node(4)}{@render arrow()}{@render node(5)}<p class="dashed">⇢ resolve path: target.txt</p>{@render node(6)}{@render arrow()}{@render node(7)}{@render arrow()}{@render node(8)}<div class="condition"><p>link inode ⇢ {lang==='zh'?'目標移除時':'if target removed'}</p>{@render node(9)}</div></section>
 </div>
 {:else if name==='cas'}<div class="flow">{#each [0,1,2] as i}{@render node(i)}{@render arrow()}{/each}</div><div class="parallel">{@render node(3)}{@render node(4)}</div>
 {:else if name==='environment'}<div class="flow">{@render node(0)}{@render arrow()}{@render node(1)}{@render arrow()}{@render node(2)}</div>
 {:else if name==='docker'}<div class="layers">{#each [0,1,2,3] as i}{@render node(i)}{/each}</div><div class="persistent">{@render node(4)}</div>
 {:else if name==='git-areas'}<div class="parallel areas">{#each [0,1,2] as i}{@render node(i)}{/each}</div><p class="relation">Working Tree → <code>git add</code> → Index → <code>git commit</code> → Repository</p>
 {:else}
 <div class="dag-map"><svg viewBox="0 0 1000 420" preserveAspectRatio="none" aria-hidden="true"><path class="mainline" d="M100 210H280L470 84H660L860 210"/><path d="M280 210L470 336H660L860 210"/></svg>{#each [{v:'A',x:10,y:50},{v:'B',x:28,y:50},{v:'C',x:47,y:20},{v:'D',x:66,y:20},{v:'E',x:47,y:80},{v:'F',x:66,y:80},{v:'G',x:86,y:50}] as c}<span class="commit map-commit" class:merge={c.v==='G'} style:left={c.x+'%'} style:top={c.y+'%'}>{c.v}</span>{/each}<span class="branch-label">{lang==='zh'?'功能分支':'Feature branch'}</span><span class="other-label">{lang==='zh'?'另一條開發線':'Another development line'}</span></div>
 <div class="history"><div class="commit-row"><span class="commit">A</span><span class="join">—</span><span class="commit">B</span></div><div class="branches"><section class="feature"><h4>{lang==='zh'?'功能分支':'Feature branch'}</h4><p>B — C — D</p><div class="commit-row"><span class="commit">C</span><span class="join">—</span><span class="commit">D</span></div></section><section><h4>{lang==='zh'?'另一條開發線':'Another development line'}</h4><p>B — E — F</p><div class="commit-row"><span class="commit">E</span><span class="join">—</span><span class="commit">F</span></div></section></div><p class="relation">D ↘ G ↙ F</p><div class="commit merge">G</div><p>{lang==='zh'?'合併提交':'Merge commit'}</p></div>
 {/if}
 <p>{m.note[lang]}</p>
 <a href={src} download>{lang==='zh'?'下載 SVG：':'Download SVG: '}{m.title[lang]}</a>
</figure>
<style>
 .dag-map{position:relative;aspect-ratio:1000/420;margin-block:2rem}.dag-map svg{position:absolute;inset:0;width:100%;height:100%;fill:none;stroke:#64748b;stroke-width:6}.dag-map .mainline{stroke:#0f9488}.map-commit{position:absolute;transform:translate(-50%,-50%)}.branch-label,.other-label{position:absolute;left:40%;font-size:1rem;line-height:1.7}.branch-label{top:-1rem}.other-label{bottom:-1rem}.history{display:none}@container(max-width:35rem){.dag-map{display:none}.history{display:block}}
 .systems-figure{margin:2rem 0;padding:1rem;border:1px solid #94a3b8;border-radius:1rem;min-width:0;container-type:inline-size;color:#18252c;background:#fff}figcaption{font-size:1.1rem;font-weight:700;line-height:1.7;margin-bottom:1.5rem}.node{padding:1rem;min-width:0;text-align:center}.node strong,.node span{display:block;font-size:1rem;line-height:1.8;overflow-wrap:anywhere}.node strong{font-size:1.15rem}.node span{color:#475569}.parallel,.comparison,.branches{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem}.hardware{border:1px solid #cbd5e1;border-radius:1rem}.areas{grid-template-columns:repeat(3,minmax(0,1fr))}.flow{list-style:none;padding:0;margin:0}.flow li{display:block}.arrow{display:block;width:24px;height:32px;margin:.5rem auto;fill:none;stroke:#475569;stroke-width:2}.icon{display:block;width:36px;height:36px;margin:0 auto .75rem;fill:none;stroke:currentColor;stroke-width:1.8}.verification,.persistent{border:1px solid #cbd5e1;border-radius:1rem}.layers .node{text-align:left;padding:1.5rem 1rem}.persistent{margin-top:1rem;border-top:3px solid #94a3b8}.comparison>section{padding:.5rem;border:1px solid #cbd5e1;border-radius:.5rem;min-width:0}h4{font-size:1.1rem;line-height:1.7;text-align:center}.comparison .node{border:1px solid #94a3b8;border-radius:.5rem}.relation{text-align:center;overflow-wrap:anywhere}.dashed,.condition{border-top:2px dashed #64748b;padding-top:1rem}.history{text-align:center}.commit-row{display:flex;align-items:center;justify-content:center;gap:.5rem}.commit{display:inline-grid;place-items:center;width:3rem;height:3rem;border:3px solid #64748b;border-radius:50%;background:#e2e8f0;font-size:1.5rem;font-weight:700}.feature .commit{border-color:#0f766e}.merge{margin:auto;background:#0f766e;color:#fff;border-color:#0f766e}.branches{margin-top:1rem}.branches section{padding:1rem;border:1px solid #cbd5e1;border-radius:.5rem;min-width:0}.join{font-size:1.5rem}.systems-figure p,.systems-figure a{font-size:1rem;line-height:1.8;overflow-wrap:anywhere}@container(max-width:35rem){.comparison,.branches,.areas{grid-template-columns:1fr}.hardware{grid-template-columns:1fr}.node{padding:.75rem}.comparison .parallel{grid-template-columns:1fr}}
</style>
