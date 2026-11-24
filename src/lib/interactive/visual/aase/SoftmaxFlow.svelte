<script lang="ts">
  import {fit,type Frame} from "../../chapter/frame.ts";
  import {attentionDemo} from '../../../attention-demo.ts';
  import type {Locale} from '../../model.ts';
  import type {TeachingScene} from '../../aase/model.ts';
  let {frame,a,b,lang,scene}:{frame:Frame;a:number;b:number;lang:Locale;scene:TeachingScene}=$props();
  const width=$derived(frame.width);
  const small=$derived(width>0&&width<430);
  const uid=$props.id();
  const shift=$derived(Math.max(a,b));
  const exp=$derived([Math.exp(a-shift),Math.exp(b-shift)]);
  const result=$derived(attentionDemo(a,b));
  const zh=$derived(lang==='zh');
  function point(lane:number,col:number){
    return small?{x:lane===2?145:lane===0?71:219,y:30+col*51}:{x:62+col*117,y:lane===2?57:lane===0?30:84};
  }
  const boxes=$derived([
    {lane:0,col:0,key:'scoreA',label:'A · s = '+a,value:'v = 2'},
    {lane:1,col:0,key:'scoreB',label:'B · s = '+b,value:'v = 6'},
    {lane:0,col:1,key:'expA',label:'exp(sA − m)',value:exp[0].toFixed(3)},
    {lane:1,col:1,key:'expB',label:'exp(sB − m)',value:exp[1].toFixed(3)},
    {lane:2,col:2,key:'sum',label:zh?'共同分母 Σ':'Shared sum Σ',value:(exp[0]+exp[1]).toFixed(3)},
    ...result.weights.map((w,i)=>({lane:i,col:3,key:i?'partB':'partA',label:(i?'wB':'wA')+' = '+w.toFixed(3),value:scene.id==='02'?(i?'expB / Σ':'expA / Σ'):'× '+(i?6:2)+' = '+(w*(i?6:2)).toFixed(3)})),
    {lane:2,col:4,key:'weighted',label:zh?'加權和':'Weighted sum',value:result.value.toFixed(3)}
  ]);
  const firstStep=$derived(scene.id==='01');
  const normalize=$derived(scene.id==='02');
  const connections=$derived(firstStep?[]:normalize?[[0,2],[1,3],[2,4],[3,4],[2,5],[3,6],[4,5],[4,6]]:[[0,2],[1,3],[2,4],[3,4],[2,5],[3,6],[4,5],[4,6],[5,7],[6,7]]);
</script>
<g transform={fit(frame,firstStep?290:small?290:normalize?475:590,firstStep?80:small?(normalize?207:260):114)} data-flow="softmax-weighted-sum" data-scene={scene.id}>
    <title id={uid+'-t'}>{scene.title[lang]}</title><desc id={uid+'-d'}>{scene.mechanism[lang]} m = max({a}, {b}). Σ = {(exp[0]+exp[1]).toFixed(3)}. {result.value.toFixed(3)}</desc>
    <defs><marker id={uid+'-arrow'} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto"><path d="m1 1 6 3-6 3" fill="none" stroke="currentColor"/></marker></defs>
    {#each connections as [i,j]}
      {@const p=point(boxes[i].lane,boxes[i].col)}{@const q=point(boxes[j].lane,boxes[j].col)}
      <line x1={p.x+(small?0:46)} y1={p.y+(small?16:0)} x2={q.x-(small?0:48)} y2={q.y-(small?22:0)} marker-end={'url(#'+uid+'-arrow)'} />
    {/each}
    {#each boxes.filter(box=>firstStep?box.col===0:!normalize||box.col<4) as box}
      {@const p=firstStep?{x:box.lane?215:75,y:42}:point(box.lane,box.col)}
      <g transform={'translate('+p.x+' '+p.y+')'} data-object={box.key}>
        <path d="m-46-14 6-5h89l-4 5z" fill="#b0caca"/><path d="m45-14 4-5v30l-4 5z" fill="#83a9aa"/>
        <rect x="-46" y="-14" width="91" height="30" rx="2" fill={box.lane===2?'#f4ddb6':'#e4eeea'}/>
        <text y="-2">{box.label}</text><text class="number" y="12">{box.value}</text>
      </g>
    {/each}
</g>
<style>


 line,path,rect{stroke:#4c6e72;stroke-width:1.2}

 text{fill:#213e43;font:600 11px system-ui,sans-serif;text-anchor:middle}
 .number{font:600 12px ui-monospace,monospace}
</style>
