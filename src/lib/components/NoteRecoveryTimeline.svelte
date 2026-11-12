<script lang="ts">
 import type {NoteDiagram} from '$lib/note-diagrams';
 import {recoveryTimelineWidths} from '$lib/ceh-recovery-timeline';
 let {diagram,lang}:{diagram:NoteDiagram;lang:string}=$props();
</script>
<div class="timeline" data-timeline="recovery" aria-label={lang==='zh'?'時間比例：RPO 15 分鐘，RTO 120 分鐘，1：8':'Time ratio: RPO 15 minutes, RTO 120 minutes, 1:8'}>
 <div class="segments" aria-hidden="true"><div class="rpo" style:width={`${recoveryTimelineWidths.rpo}%`}></div><div class="rto" style:width={`${recoveryTimelineWidths.rto}%`}></div><span class="point start"></span><span class="point incident" style:left={`${recoveryTimelineWidths.rpo}%`}></span><span class="point end"></span></div>
 <p class="ratio">{lang==='zh'?'RPO 15 分鐘：RTO 120 分鐘 = 1：8（線段按時間比例）':'RPO 15 minutes : RTO 120 minutes = 1:8 (segments are to scale)'}</p>
 <ol>{#each diagram.items as item,i}<li data-timeline-point={[-15,0,120][i]}><strong>{item.title}</strong><p>{item.body}</p></li>{/each}</ol>
</div>
<style>
.timeline{min-width:0;margin:1.25rem 0;overflow-wrap:anywhere}.segments{display:flex;position:relative;height:1rem;margin:2rem .5rem 1.5rem}.segments>div{height:.5rem;align-self:center}.rpo{background:#ac772b}.rto{background:#2c8478}.point{position:absolute;top:-.3rem;bottom:-.3rem;width:3px;background:#455952}.start{left:0}.end{right:0}.ratio{font-weight:650;line-height:1.8}ol{list-style:none;padding:0;display:grid;gap:1rem}li{min-width:0;padding:1rem;border:1px solid #b8d5c5;border-radius:12px;background:#f1f6f3}strong{font-size:1.125rem;line-height:1.8}p{margin:.4rem 0 0;line-height:1.8}
</style>
