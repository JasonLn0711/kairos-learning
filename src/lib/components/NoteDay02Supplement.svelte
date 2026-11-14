<script lang="ts">
 import type {NoteDiagram} from '$lib/note-diagrams';
 import {noteDiagramSpecs} from '$lib/note-diagrams';
 let {diagram}:{diagram:NoteDiagram}=$props();
 const layout=$derived(noteDiagramSpecs[diagram.name].layout);
 const priority=noteDiagramSpecs.m20d2priority;
 const depths=[0,1,2,1,2];
 const folder='M3 7V5h6l3 3h9v12H3V7Zm0 3h18';
 const file='M6 3h8l4 4v14H6V3Zm3 8h6m-6 4h6';
</script>
{#if layout==='day02-priority'}
 <table class="priority-list" aria-label="四個觀念的排名、建議占比與定位">
  <thead><tr class="row head"><th scope="col">排名</th><th scope="col">觀念</th><th scope="col">建議時間占比</th><th scope="col">考試定位</th></tr></thead>
  <tbody>{#each diagram.items as item,i}<tr class="row"><td class="rank">{priority.ranks[i]}</td><th scope="row">{item.title}</th><td class="weight">{item.body.split('｜')[0]}</td><td class="position">{item.body.split('｜')[1]}</td></tr>{/each}</tbody>
 </table>
 <div class="ratio" aria-hidden="true">{#each priority.weights as weight,i}<span class={'part part-'+i} style:flex-grow={weight}></span>{/each}</div>
{:else if layout==='day02-tree'}
 <ol class="tree" aria-label="應用程式目錄階層">{#each diagram.items as item,i}<li style:--depth={depths[i]}><svg viewBox="0 0 24 24" aria-hidden="true"><path d={i===2||i===4?file:folder}/>{#if i===4}<path d="M10 11v-1a2 2 0 0 1 4 0v1m-5 0h6v6H9v-6Z"/>{/if}</svg><div><strong>{item.title}</strong><p>{item.body}</p></div></li>{/each}</ol>
{:else}
 <ol class="boxflow">{#each diagram.items as item,i}<li><div class:boxed={i>=2}><strong>{item.title}</strong><p>{item.body}</p></div>{#if i<diagram.items.length-1}<svg class="next" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v17m-6-6 6 6 6-6"/></svg>{/if}</li>{/each}</ol>
{/if}
<style>
 .priority-list{display:block;width:100%;margin:1.25rem 0}thead,tbody{display:block}th,td{padding:0;border:0;text-align:left;background:transparent}.row{display:grid;grid-template-columns:3rem minmax(0,1.2fr) minmax(0,.65fr) minmax(0,1.6fr);gap:1rem;padding:.8rem 0;border-bottom:1px solid #d8dce0;align-items:start}.row>*{min-width:0;overflow-wrap:anywhere;font-size:1rem;line-height:1.8}.head{font-weight:700}.weight{text-align:right}.ratio{display:flex;gap:3px;height:1.4rem;margin-top:1.75rem;overflow:hidden;border-radius:.5rem}.part{flex-basis:0}.part-0{background:#245fe8}.part-1{background:#0d928a}.part-2{background:#b57a1c}.part-3{background:#7739e8}
 ol{list-style:none;padding:0;margin:1rem 0}li{min-width:0}strong{font-size:1.125rem;line-height:1.8}p{margin:.4rem 0;font-size:1rem;line-height:1.8}svg{width:24px;height:24px;fill:none;stroke:#657079;stroke-width:1.8;flex-shrink:0}.tree li{display:flex;gap:.8rem;align-items:start;padding:.6rem 0 .6rem calc(var(--depth)*1.75rem)}.tree svg{margin-top:.35rem}.tree li>div{min-width:0}.tree strong{overflow-wrap:anywhere}.tree li:nth-child(3),.tree li:nth-child(5){border-left:1px solid #d8dce0;margin-left:1.75rem;padding-left:1.75rem}.boxflow{text-align:center}.boxflow li>div{padding:1rem .5rem}.boxed{border:1px solid #d8dce0;border-radius:12px}.next{display:block;margin:1.25rem auto}
 @container(max-width:36rem){.head{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}.row{grid-template-columns:2rem minmax(0,1fr) 3rem;gap:.5rem}.position{grid-column:2 / -1}.tree li{padding-left:calc(var(--depth)*.8rem)}.tree li:nth-child(3),.tree li:nth-child(5){margin-left:.8rem;padding-left:.8rem}.tree{margin-inline:0}.ratio{height:1rem}}
</style>
