<script lang="ts">
  import type {Concept,TeachingScene} from '../../aase/model.ts';
  import type {Locale} from '../../model.ts';
  import {fit,type Frame} from '../../chapter/frame.ts';
  import FlowPulse from '../../chapter/FlowPulse.svelte';

  let {unit,scene,frame,lang,choice,run,paused}:{unit:Concept;scene:TeachingScene;frame:Frame;lang:Locale;choice:number;run:boolean;paused:boolean}=$props();
  const zh=$derived(lang==='zh');
  const order=$derived(unit.slug==='position-information');
  const original=$derived(order?unit.scenes[0].cards.map(c=>c.value[lang]):
    unit.scenes[1].cards[0].value[lang].split(/[,、]\s*/));
  const chosen=$derived(scene.choices?.[choice]?.cards);
  const output=$derived.by(()=>{
    if(order){
      const text=scene.id==='03'?scene.cards[1].value[lang]:chosen?.[0].value[lang];
      return text?text.split(/\s*→\s*/):original;
    }
    if(scene.id==='01')return [...original,'?'];
    if(scene.id==='03')return [...original,scene.cards[1].value[lang],'?'];
    return chosen![1].value[lang].split(/[,、]\s*/);
  });
  const first=$derived(scene.id==='01' && order);
  const source=$derived(order?original:scene.id==='03'?[...original,scene.cards[1].value[lang]]:scene.id==='02'?[...original,'?']:original);
  const uid=$props.id();
  const pitch=77;
  const x=(i:number)=>18+i*pitch;
  function track(from:number,to:number){
    return 'M'+(x(from)+30)+' 61 C'+(x(from)+30)+' 87 '+(x(to)+30)+' 81 '+(x(to)+30)+' 108';
  }
  const tracks=$derived(source.map((v,i)=>track(i,order?output.indexOf(v):i)));
  const nextRound=$derived(!order && scene.id==='03');
  const colors=['#c3e3db','#dfd9ef','#f3d5a2','#dce5e6'];
  function color(v:string,i:number){return v==='?'?'#fffdf3':colors[order?original.indexOf(v):i];}
</script>

{#snippet tile(word:string,i:number,y:number)}
  <g transform={'translate('+x(i)+' '+y+')'} data-object="slot" data-slot={i+1}>
    <path d="m0 0 6-5h59l-6 5z" fill="#d5e3d8"/>
    <path d="m59 0 6-5v25l-6 5z" fill="#92aca4"/>
    <rect width="59" height="25" fill={color(word,i)} stroke-dasharray={word==='?'?'3 2':undefined}/>
    <text x="30" y="17">{word}</text>
  </g>
{/snippet}
<g data-flow={unit.slug} data-scene={scene.id} transform={fit(frame,Math.max(source.length,output.length)*pitch+25,first?83:158)}>
  <title>{scene.title[lang]}</title><desc>{scene.mechanism[lang]} {scene.observe[lang]}</desc>
  <defs><marker id={uid+'-arrow'} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="4" markerHeight="4" orient="auto"><path d="m1 1 6 3-6 3" fill="none"/></marker></defs>
  {#each source as word,i}
    <text class="index" x={x(i)+30} y="20">{zh?'位置':'Position'} {i+1}</text>
    {@render tile(word,i,32)}
  {/each}
  {#if !first}
    {#each tracks as d,i}<path {d} class="wire" marker-end={'url(#'+uid+'-arrow)'} stroke-dasharray={source[i]==='?'?'4 3':undefined}/>{/each}
    {#if nextRound}
      <path d={'M'+(x(0)+30)+' 74v7H'+(x(2)+30)+'v-7 M'+(x(2)+30)+' 81H'+(x(3)+30)+'v26'} class="wire" stroke-dasharray="3 3" marker-end={'url(#'+uid+'-arrow)'}/>
    {/if}
    {#if run}<FlowPulse {paused} paths={tracks}/>{/if}
    {#each output as word,i}
      {@render tile(word,i,110)}
      <text class="index" x={x(i)+30} y="152">{order?(i===0?(zh?'動作者':'Actor'):i===2?(zh?'接受者':'Recipient'):''):word==='?'?(zh?'待預測':'Predict'):(i<original.length?(zh?'保留':'Keep'):(zh?'接入前綴':'Append'))}</text>
    {/each}
  {/if}
</g>
<style>
  path,rect{stroke:#526e67;stroke-width:1.2}.wire{stroke:#488478;stroke-width:2;fill:none}
  text{font:650 12px system-ui;fill:#25413c;text-anchor:middle}.index{font-size:10px}
</style>
