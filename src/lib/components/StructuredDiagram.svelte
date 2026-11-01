<script lang="ts">
 import type {TeachingDiagram} from '$lib/perspective-diagrams';
 let {diagram:d}:{diagram:TeachingDiagram}=$props();
</script>
<div class="structured" data-layout={d.layout}>
 {#each d.groups as group,gi}
 {#if d.layout==='access-path'&&gi>0}<svg class="management-line" viewBox="0 0 20 50" aria-hidden="true"><path d="M10 0v50"/></svg>{/if}
 {#if d.layout==='layers'&&gi>0}<svg class="layer-arrow" viewBox="0 0 30 60" aria-hidden="true"><path d="M15 0v52m-8-8 8 8 8-8"/></svg>{/if}
 <section class="group" class:kernel={gi===1}>
 <h3>{group.title}</h3>
 <svelte:element this={group.mode==='flow'?'ol':'ul'} class="nodes" role="list">
 {#each group.items as node,i}
 <li class="slot" data-tone={node.tone} class:released={node.state==='released'}>
 {#if i>0&&group.mode==='flow'&&(!['reference','lifetime'].includes(d.layout??'')||i===1)}<svg class="connector" class:stale={d.layout==='reference'||(d.layout==='lifetime'&&gi===1)} viewBox="0 0 40 40" preserveAspectRatio="none" aria-hidden="true"><path d={d.layout==='reference'&&i===1?'M0 2h20v32h18m-7-5 7 5-7 5':'M2 20h32m-8-8 8 8-8 8'}/></svg>{/if}
 <div class="node"><h4>{node.title}</h4>
 {#if node.cells}<div class="cells">{#each node.cells as cell}<span>{cell}</span>{/each}</div>{/if}
 <p>{node.body}</p></div>
 </li>
 {/each}
 </svelte:element>
 </section>
 {/each}
</div>
<style>
 .structured{container-type:inline-size;overflow-wrap:anywhere}.group{min-width:0}h3{font-size:1.1rem;line-height:1.7;margin:0 0 1rem}h4{margin:0;font-size:1.2rem;line-height:1.7}.nodes{list-style:none;padding:0;margin:0;display:grid;gap:2.5rem}.slot{position:relative;min-width:0;--edge:#2864db;--fill:#eff6ff;--ink:#1746ad}.slot[data-tone=orange]{--edge:#c46500;--fill:#fff9eb;--ink:#994600}.slot[data-tone=teal]{--edge:#008459;--fill:#edfcf5;--ink:#006747}.slot[data-tone=red]{--edge:#d63d60;--fill:#fff0f3;--ink:#a80e36}.node{box-sizing:border-box;height:100%;padding:1.2rem;border:2px solid var(--edge);border-radius:1.2rem;background:var(--fill);color:var(--ink);text-align:center}.node p{font-size:1rem;line-height:1.8;margin:.8rem 0 0}.cells{display:flex;gap:.5rem;justify-content:center;margin:1rem 0}.cells span{flex:1;min-width:0;background:white;border:2px solid var(--edge);border-radius:.65rem;font-size:2rem;font-weight:750;padding:.5rem .15rem;line-height:1.4}.released .cells span{border-style:dashed}.connector{position:absolute;width:2rem;height:2rem;top:-2.3rem;left:calc(50% - 1rem);transform:rotate(90deg);fill:none;stroke:#596b82;stroke-width:2.5}.stale{stroke:#c62828;stroke-dasharray:5 3}.layer-arrow{display:block;width:2rem;height:3.5rem;margin:.3rem auto;fill:none;stroke:#596b82;stroke-width:2.5;stroke-dasharray:6 4}
 [data-layout=cells] .nodes{gap:1rem;grid-template-columns:repeat(2,minmax(0,1fr))}[data-layout=cells] .node{padding:.8rem .4rem;background:#dceaff}[data-layout=cells] h4{font-size:1rem}[data-layout=cells] .cells span{border:0;background:none;font-size:2.2rem}[data-layout=cells] .cells{margin:.5rem 0}
 [data-layout=layers] .group{border:2px solid #5795ff;border-radius:1.2rem;padding:1rem;background:#eff6ff}[data-layout=layers] .kernel{border-color:#20ab66;background:#edfcf5}[data-layout=layers] .node{background:white;border-width:1px;border-radius:.8rem}
 .slot[data-tone=purple]{--edge:#8861cf;--fill:#f0eaff;--ink:#54249d}
 [data-layout=lifetime] .group{padding:1.2rem;border:2px solid #5795ff;border-radius:1.2rem;background:#eff6ff;margin-bottom:1.5rem}
 [data-layout=lifetime] .kernel{background:#fff9eb;border-color:#d48a00}
 [data-layout=lifetime] .node{background:white}
 [data-layout=lifetime] .released .node{border-style:dashed}
 [data-layout=lifetime] .cells span{border:0;padding:0;font-size:clamp(1.2rem,3cqi,2rem)}
 [data-layout=lifetime] .slot:last-child{align-self:center}
 [data-layout=lifetime] .slot:last-child .node{background:var(--fill);border:0}
 .management-line{display:block;height:3rem;width:1.25rem;margin:0 auto;stroke:#b66b00;stroke-width:2.5;stroke-dasharray:5 4}
 [data-layout=access-path] .kernel h3{font-size:1rem;text-align:center}
 @container(min-width:620px){
 [data-layout=lifetime] .nodes,[data-layout=access-path] .nodes{grid-template-columns:repeat(3,minmax(0,1fr));gap:2rem}
 [data-layout=access-path] .kernel{max-width:70%;margin:0 auto}[data-layout=access-path] .kernel .nodes{grid-template-columns:1fr}

 [data-layout=layers] .layer-arrow{margin-left:calc(75% - 1rem);margin-right:0}
 [data-layout=cells] .nodes{grid-template-columns:repeat(4,minmax(0,1fr))}
 [data-layout=stages] .nodes{grid-template-columns:repeat(3,minmax(0,1fr));gap:2rem}
 [data-layout=layers] .nodes{grid-template-columns:repeat(2,minmax(0,1fr));gap:2rem}[data-layout=layers] .kernel .nodes{grid-template-columns:1fr}
 .connector{top:calc(50% - 1rem);left:-2rem;transform:none}
 [data-layout=reference] .nodes{grid-template-columns:1fr 1fr;gap:2.5rem 4rem}
 [data-layout=reference] .slot:nth-child(1){grid-column:1;grid-row:1}
 [data-layout=reference] .slot:nth-child(2){grid-column:2;grid-row:1 / 3;align-self:center}
 [data-layout=reference] .slot:nth-child(3){grid-column:1;grid-row:2}
 [data-layout=reference] .slot:nth-child(2) .connector{width:4rem;height:6rem;top:calc(50% - 6rem);left:-4rem}
 [data-layout=reference] .slot:nth-child(3) .connector{display:none}
 }
 @container(max-width:340px){[data-layout=cells] .nodes{grid-template-columns:1fr}}
</style>
