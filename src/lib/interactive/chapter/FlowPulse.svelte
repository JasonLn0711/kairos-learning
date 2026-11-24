<script lang="ts">
  import {onMount} from 'svelte';
  import {cyclePosition} from './motion.ts';
  let {paths,paused=false}:{paths:string[];paused?:boolean}=$props();
  let group:SVGGElement;
  let available=$state(false);
  let point=$state<{x:number;y:number;lap:number;holding:boolean}>();
  let elapsed=0,signature='';
  onMount(()=>{
    const preference=matchMedia('(prefers-reduced-motion: reduce)');
    const update=()=>available=!preference.matches && !document.hidden;
    update();preference.addEventListener('change',update);document.addEventListener('visibilitychange',update);
    return ()=>{preference.removeEventListener('change',update);document.removeEventListener('visibilitychange',update);};
  });
  $effect(()=>{
    const key=paths.join('|');
    if(signature!==key){signature=key;elapsed=0;point=undefined;}
    if(!available || paused || !paths.length || !group)return;
    const curves=Array.from(group.querySelectorAll('path'));
    const lengths=curves.map(curve=>curve.getTotalLength());
    let last:number|undefined,frame=requestAnimationFrame(draw);
    function draw(now:number){
      if(last!==undefined)elapsed+=now-last;
      last=now;
      const sample=cyclePosition(elapsed,curves.length*650);
      const index=Math.min(curves.length-1,Math.floor(sample.elapsed/650));
      const t=Math.min(1,(sample.elapsed-index*650)/650);
      const pos=curves[index].getPointAtLength(t*lengths[index]);
      point={x:pos.x,y:pos.y,lap:sample.lap,holding:sample.holding};
      frame=requestAnimationFrame(draw);
    }
    return ()=>cancelAnimationFrame(frame);
  });
</script>
<g data-flow-pulse bind:this={group} aria-hidden="true">
  {#each paths as d}<path {d} fill="none" stroke="none"/>{/each}
  {#if available && point}<circle cx={point.x} cy={point.y} r="4" fill="#9b5332" stroke="white" data-lap={point.lap} data-hold={point.holding}/>{/if}
</g>
