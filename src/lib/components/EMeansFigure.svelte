<script lang="ts">
 import {eMeansModels,eMeansArtwork,eMeansAsset,cosineStep,type EMeansFigureName,type EMeansLocale} from '#lib/e-means-figures.ts';
 let {name,lang}:{name:EMeansFigureName;lang:EMeansLocale}=$props();
 const m=$derived(eMeansModels[name]);
 const art=$derived(eMeansArtwork(name));
</script>
<figure class="emeans-figure" data-emeans-figure={name}>
 <figcaption>{m.title[lang]}</figcaption>
 <p>{m.description[lang]}</p>
 {#if art}<svg class="art" viewBox="0 0 720 320" aria-hidden="true"><!-- Only fixed allowlisted geometry; content cannot supply markup. -->{@html art}</svg>{/if}
 {#if name==='components'}<p class="core"><strong>Mini-batch + EMA</strong></p>{/if}
 {#if name==='ivf'}
  {@const labels=eMeansModels.ivf.flows[lang]}
  <section class="offline"><h4>{labels[0]}</h4><div class="node"><strong>{m.nodes[0][lang].title}</strong><p>{m.nodes[0][lang].body}</p></div><p class="arrow" aria-hidden="true">↓</p><h4>{m.nodes[1][lang].title}</h4><div class="regions">{#each labels.slice(1,4) as region}<div class="node"><strong>{region}</strong></div>{/each}</div><p>{m.nodes[1][lang].body}</p></section>
  <section class="online"><h4>{labels[4]}</h4><p><strong>{m.nodes[2][lang].title}</strong></p><ol class="flow">{#each labels.slice(5) as label,i}<li>{#if i}<span class="arrow" aria-hidden="true">↓</span>{/if}<div class="node"><strong>{label}</strong></div></li>{/each}</ol><p>{m.nodes[2][lang].body}</p></section>
 {:else}
 <div class="nodes" class:components={name==='components'} class:parallel={name==='clusters'||name==='minima'}>
 {#each m.nodes as n,i}<div class="node" style:border-left-color={name==='ema'?['#808080','#2485b9','#d65a42'][i]:(name==='minima'||name==='batches')?['#d65a42','#2485b9'][i]:['#2485b9','#d65a42','#299b76'][i]??'#64748b'}><strong>{n[lang].title}</strong><p>{n[lang].body}</p></div>{/each}
 </div>
 {/if}
 {#if name==='cosine'}<!-- svelte-ignore a11y_no_noninteractive_tabindex (Keyboard access to the numeric chart table.) -->
 <div class="table-scroll" role="region" aria-label={lang==='zh'?'Cosine步長數值':'Cosine step values'} tabindex="0"><table><thead><tr><th scope="col">{lang==='zh'?'更新進度':'Update progress'}</th><th scope="col">α(u)</th></tr></thead><tbody>{#each Array.from({length:11},(_,i)=>i) as i}<tr><td>{i*10}%</td><td>{cosineStep(i/10).toFixed(4)}</td></tr>{/each}</tbody></table></div>{/if}
 <p class="note">{m.note[lang]}</p>
 <a href={eMeansAsset(name,lang)} download>{lang==='zh'?'下載SVG：':'Download SVG: '}{m.title[lang]}</a>
</figure>
<style>
 .regions{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.5rem}.offline,.online{border:1px solid #cbd5e1;border-radius:.75rem;padding:.75rem;margin:1rem 0}.flow{list-style:none;padding:0}.arrow{text-align:center;display:block;font-size:1.5rem}h4{font-size:1rem;line-height:1.8;overflow-wrap:anywhere}@container(max-width:25rem){.regions{grid-template-columns:1fr}}
 .emeans-figure{margin:2rem 0;padding:1rem;border:1px solid #94a3b8;border-radius:1rem;min-width:0;container-type:inline-size;background:#fff;color:#182b40}figcaption{font-size:1.1rem;font-weight:700;line-height:1.7}.emeans-figure p,.emeans-figure a,.emeans-figure strong{font-size:1rem;line-height:1.8;overflow-wrap:anywhere}.art{display:block;width:100%;height:auto;max-height:24rem;margin:1rem auto}.nodes{display:grid;gap:.75rem}.parallel,.components{grid-template-columns:repeat(2,minmax(0,1fr))}.node{min-width:0;border:1px solid #cbd5e1;border-left-width:4px;border-radius:.75rem;padding:.9rem}.node p{margin:.5rem 0 0}.core{text-align:center}.note{border-top:1px solid #cbd5e1;padding-top:1rem}.table-scroll{overflow:auto;max-width:100%;margin:1rem 0}table{width:100%;border-collapse:collapse;font-size:1rem;line-height:1.8}th,td{text-align:left;padding:.5rem;border-bottom:1px solid #cbd5e1}:focus-visible{outline:3px solid #147d72;outline-offset:3px}@container(max-width:30rem){.parallel,.components{grid-template-columns:1fr}}
</style>
