<script lang="ts">
 import type {ConceptBlock} from '$lib/concepts';
 import InlineText from './InlineText.svelte';
 let {diagram,number,lang}:{diagram:Extract<ConceptBlock,{kind:'cards'|'flow'}>|Extract<ConceptBlock,{kind:'table'}>;number:number;lang:'zh'|'en'}=$props();
</script>
<figure data-agent-review-figure={number}>
 <figcaption><strong>{diagram.caption}</strong>{#if 'description' in diagram}<p>{diagram.description}</p>{/if}</figcaption>
 {#if diagram.kind==='table'}
  <!-- svelte-ignore a11y_no_noninteractive_tabindex (Named local table scrolling.) -->
  <div class="table-scroll" role="region" aria-label={diagram.caption} tabindex="0"><table><thead><tr>{#each diagram.headers as h}<th scope="col">{h}</th>{/each}</tr></thead><tbody>{#each diagram.rows as row}<tr>{#each row as cell}<td><InlineText text={cell}/></td>{/each}</tr>{/each}</tbody></table></div>
 {:else if number===5}
  <dl>{#each diagram.items as item}<div class:decision={item.title.startsWith('決策')||item.title.startsWith('Decision')}><dt>{item.title}</dt><dd>{item.body}</dd></div>{/each}</dl>
 {:else if number===1}
  <ul class="inputs">{#each diagram.items as item}<li><strong>{item.title}</strong><p>{item.body}</p></li>{/each}</ul>
  <div class="aggregation" aria-hidden="true">↓</div>
  <div class="reviewer"><strong>{lang==='zh'?'人的審查與決策':'Human review and decision'}</strong><p>{lang==='zh'?'接受／要求修正／延後':'Accept / Revise / Defer'}</p></div>
 {:else}
  <ol class:git={number===2}>{#each diagram.items as item,i}<li><span class="number" aria-hidden="true">{i+1}</span><div><strong>{item.title}</strong><p>{item.body}</p></div>{#if i<diagram.items.length-1}<span class="connector" aria-hidden="true">↓</span>{/if}</li>{/each}</ol>
 {/if}
 <a href={`/images/aase/m07-06-${number}-${lang}.svg`} target="_blank" rel="noreferrer">{lang==='zh'?'開啟／下載原尺寸 SVG':'Open / download full-size SVG'}</a>
</figure>
<style>
 figure{container-type:inline-size;margin:1.5rem 0;padding:1.25rem;background:#fbfcfd;border:1px solid #d5dce0;border-radius:.8rem;color:#18252c;min-width:0;overflow-wrap:anywhere}strong,p,dt,dd,th,td,a{font-size:1rem;line-height:1.8}figcaption>strong{font-size:1.15rem}p{margin:.4rem 0 0}figcaption{margin-bottom:1.25rem}ul,ol{list-style:none;padding:0;margin:0}.inputs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1rem}.inputs li,.reviewer{padding:1rem;background:#f1f4f5;border:1px solid #d5dce0;border-radius:.6rem;min-width:0}.reviewer{text-align:center}.aggregation{text-align:center;font-size:1.4rem;margin:.5rem}ol{display:grid;gap:2.5rem}ol li{display:flex;gap:.8rem;position:relative;padding:1rem;border:1px solid #d5dce0;border-radius:.6rem;background:#fff;min-width:0}.number{flex:none;line-height:1.8}.connector{position:absolute;top:calc(100% + .3rem);left:calc(50% - .5rem);font-size:1.3rem}.table-scroll{max-width:100%;overflow:auto}table{width:100%;border-collapse:collapse}th,td{vertical-align:top;text-align:left;padding:.65rem;border-bottom:1px solid #d5dce0;min-width:7rem}th{background:#f1f4f5}dl{margin:0}dl>div{margin:.75rem 0}dt{font-weight:700}dd{margin:.2rem 0 0}.decision{border-left:3px solid #a33b30;padding-left:.8rem}a{display:inline-block;margin-top:1.25rem}a:focus-visible,.table-scroll:focus-visible{outline:3px solid #245fb0;outline-offset:3px}@container(max-width:34rem){.inputs{grid-template-columns:1fr}.inputs li{border-left:3px solid #70818b}}@media(max-width:540px){figure{padding:.75rem}}
</style>
