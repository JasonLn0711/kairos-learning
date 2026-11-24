<script lang="ts">
  import {fit,type Frame} from "../../chapter/frame.ts";
  import {contextBudgetLimit,contextBudgetParts} from '../../../context-budget.ts';
  import type {Locale} from '../../model.ts';
  import type {TeachingScene} from '../../aase/model.ts';
  let {frame,scene,lang,logs,labels}:{frame:Frame;scene:TeachingScene;lang:Locale;logs:number;labels:string[]}=$props();
  const uid=$props.id();
  const fixed=contextBudgetParts.reduce((sum,n)=>sum+n,0);
  const scale=390/(fixed+3000);
  const limit=14+contextBudgetLimit*scale;
  const colors=['#c6e1dc','#92c0bc','#c9d1e8','#dec8a3','#e1aa87'];
  const examples=$derived(scene.id==='03'?[1800,1000]:[logs]);
</script>
<g transform={fit(frame,420,examples.length*52+32)} data-flow="context-budget" data-scene={scene.id}>
    <title id={uid+'-t'}>{scene.title[lang]}</title><desc id={uid+'-d'}>{scene.mechanism[lang]} {examples.map(extra=>fixed+extra).join(' → ')} / {contextBudgetLimit}</desc>
    {#each examples as extra,r}
      {@const parts=[...contextBudgetParts,extra]}
      <g transform={'translate(14 '+(39+r*52)+')'}>
        {#each parts as amount,i}
          {@const start=parts.slice(0,i).reduce((sum,n)=>sum+n,0)*scale}
          {@const width=amount*scale}
          {#if amount}
            <g data-object={['rules','task','tests','reserve','logs'][i]} data-tokens={amount}>
              <title>{labels[i]} · {amount}</title>
              <rect x={start} width={width} height="17" fill={colors[i]}/><path d={'M'+start+' 0l6-5h'+width+'l-6 5z'} fill={colors[i]}/>
            </g>
          {/if}
        {/each}
        <text y="33">{(fixed+extra).toLocaleString('en-US')} / {contextBudgetLimit.toLocaleString('en-US')} token</text>
      </g>
    {/each}
    <path d={'M'+limit+' 21v'+(examples.length*52-8)} stroke-dasharray="3 3" stroke-width="2"/>
    <text x={limit} y="16" text-anchor="middle">{lang==='zh'?'容量上限':'Capacity limit'}</text>
</g>
<style>


 path,rect{stroke:#456061;stroke-width:1}
 text{font:650 13px system-ui,sans-serif;fill:var(--ink)}
</style>
