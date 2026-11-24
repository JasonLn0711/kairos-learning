<script lang="ts">
  import type {Concept} from '../aase/model.ts';
  import type {Locale} from '../model.ts';
  import type {Snapshot} from './frame.ts';
  import {plans} from './plans.ts';
  import TeachingGlyph from '../visual/aase/TeachingGlyph.svelte';
  import FlowPulse from './FlowPulse.svelte';
  import SceneLayer from './SceneLayer.svelte';

  let {chapter,title,units,lang,mode,unitIndex,step,snapshot,paused,select}:{
    chapter:string;title:string;units:Concept[];lang:Locale;mode:'chapter'|'scene'|'poster';
    unitIndex:number;step:number;snapshot?:Snapshot;paused:boolean;select:(index:number,step:number)=>void
  }=$props();
  let scroller:HTMLDivElement;
  $effect(()=>{void mode;void unitIndex;void step;if(scroller)scroller.scrollTop=0;});
  const uid=$props.id();
  const zh=$derived(lang==='zh');
  let width=$state(1000);
  const compact=$derived(width<660);
  const canvas=$derived(compact?Math.max(270,width):1040);
  const plan=$derived(plans[chapter]);
  const layers=$derived(plan.layers.map(group=>group.filter(n=>units.some(u=>u.slug===n.slug))).filter(g=>g.length));
  const cards=$derived.by(()=>{
    const nodes:Record<string,{x:number;y:number;w:number;h:number}>={};
    const margin=compact?18:42, gap=compact?12:44;
    let y=34;
    for(const layer of layers){
      const w=compact?canvas-2*margin:Math.min(432,(canvas-margin*2-(layer.length-1)*gap)/layer.length);
      layer.forEach((node,i)=>{
        nodes[node.slug]={x:compact?margin:(canvas-layer.length*w-(layer.length-1)*gap)/2+i*(w+gap),y:y+(compact?i*110:0),w,h:88};
      });
      y+=88+(compact?(layer.length-1)*110+52:50);
    }
    return nodes;
  });
  const overviewHeight=$derived(Math.max(...Object.values(cards).map(n=>n.y+n.h))+40);
  const links=$derived(plan.links.filter(link=>cards[link.from]&&cards[link.to]).map((link,i)=>{
    const a=cards[link.from],b=cards[link.to];
    const sameRow=a.y===b.y;
    const lane=compact?4+i%4*3:12+i%5*5;
    let d:string;
    if(sameRow){
      const x=a.x<b.x?a.x+a.w:a.x, end=a.x<b.x?b.x:b.x+b.w;
      d='M'+x+' '+(a.y+44)+' H'+end;
    }else if(b.y-a.y>(compact?145:170) || b.y<a.y){
      const left=(a.x+b.x)<canvas/2 || compact;
      const x=left?lane:canvas-lane;
      d='M'+(left?a.x:a.x+a.w)+' '+(a.y+53)+' H'+x+' V'+(b.y+41)+' H'+(left?b.x:b.x+b.w);
    }else{
      const x=a.x+a.w/2,end=b.x+b.w/2,mid=(a.y+a.h+b.y)/2;
      d='M'+x+' '+(a.y+a.h)+' C'+x+' '+mid+' '+end+' '+mid+' '+end+' '+b.y;
    }
    return {...link,d};
  }));
  const columns=$derived(compact?1:3);
  const sheetWidth=$derived(compact?canvas:1664);
  const sceneW=$derived((sheetWidth-16*(columns+1))/columns);
  const drawingHeight=$derived(compact?312:205);
  function lines(text:string,width:number){
    const em=Array.from(text).reduce((sum,c)=>sum+(c.charCodeAt(0)>255?1:.62),0);
    return Math.max(1,Math.ceil(em*14/Math.max(1,width-12)));
  }
  const bands=$derived.by(()=>{
    let y=overviewHeight;
    return units.map(unit=>{
      const start=y;
      const heights=unit.scenes.map(scene=>{
        const alternatives=scene.choices?.map(c=>c.cards)??[];
        const recordHeight=scene.demo?0:Math.max(...[scene.cards,...alternatives].map(cards=>cards.reduce((h,c)=>h+8+20*Math.max(lines(c.label[lang],sceneW*.30),lines(c.value[lang],sceneW*.61)),0)));
        return 95+drawingHeight+20*lines(scene.observe[lang],sceneW-32)+recordHeight;
      });
      const offsets=heights.map((_,j)=>compact?heights.slice(0,j).reduce((sum,h)=>sum+h+20,0):0);
      y+=68+(compact?heights.reduce((sum,h)=>sum+h+20,0):Math.max(...heights)+20);
      return {start,heights,offsets,end:y};
    });
  });
  const totalHeight=$derived(bands[bands.length-1].end);
  function box(i:number,j:number){
    return {x:16+(j%columns)*(sceneW+16),y:bands[i].start+58+bands[i].offsets[j],height:bands[i].heights[j]};
  }
  const focus=$derived(box(unitIndex,step));
  const view=$derived(mode==='scene'?[focus.x,focus.y,sceneW,focus.height]:[0,0,mode==='poster'?sheetWidth:canvas,mode==='poster'?totalHeight:overviewHeight]);
  const frame=$derived({width:sceneW-20,height:drawingHeight});
  function go(event:MouseEvent,i:number,j:number){
    if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
    event.preventDefault();select(i,j);
  }
</script>
<!-- svelte-ignore a11y_no_noninteractive_tabindex (the full poster is a keyboard-scrollable named region) -->
<div bind:this={scroller} class="chart" class:poster={mode==='poster'} class:focused={mode==='scene'} bind:clientWidth={width} tabindex={mode==='poster'?0:undefined} role="region" aria-label={zh?'章節圖解':'Chapter diagram'}>
  <svg class="chapter-svg" data-chapter={chapter} data-view={mode} viewBox={view.join(' ')} aria-labelledby={uid+'-title '+uid+'-desc'}>
    <title id={uid+'-title'}>{chapter.toUpperCase()} · {title}</title>
    <desc id={uid+'-desc'}>{zh?'同一張圖包含章節關係與所有概念的三幕分鏡。實線為資料或控制流，虛線箭頭為查驗，點線為平行支援。':'One diagram contains chapter relationships and the three scenes of each concept. Solid arrows carry data or control, dashed arrows indicate checks, and dotted lines indicate parallel support.'}</desc>
    <defs><clipPath id={uid+'-camera'}><rect x={view[0]} y={view[1]} width={view[2]} height={view[3]}/></clipPath><marker id={uid+'-tip'} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="m1 1 8 4-8 4" fill="none" stroke="#356d69" stroke-width="1.5"/></marker></defs>
    <g clip-path={'url(#'+uid+'-camera)'}>
    <g transform={'translate('+(mode==='poster'?(sheetWidth-canvas)/2:0)+' 0)'} aria-hidden={mode==='scene'}>
      {#each links as edge}<path d={edge.d} class="link" class:check={edge.kind==='check'} class:support={edge.kind==='support'} marker-end={edge.kind==='support'?undefined:'url(#'+uid+'-tip)'}/>{/each}
      {#each layers.flat() as node}
        {@const c=cards[node.slug]}{@const i=units.findIndex(u=>u.slug===node.slug)}
        <a href={'#'+node.slug+'-01'} tabindex={mode==='scene'?-1:0} onclick={e=>go(e,i,0)} aria-label={units[i].title[lang]}>
          <g transform={'translate('+c.x+' '+c.y+')'} data-concept={node.slug}>
            <path d={'M0 0 9 -6h'+c.w+'l-9 6z'} fill="#c4d8cc"/><path d={'M'+c.w+' 0l9-6v88l-9 6z'} fill="#aac1b6"/>
            <rect width={c.w} height="88" rx="3" class="node"/>
            <g transform="translate(35 41)"><TeachingGlyph kind={node.glyph}/></g>
            <foreignObject x="70" y="2" width={c.w-77} height="86"><div class="node-text"><b>{units[i].title[lang]}</b><span>{node[lang]}</span></div></foreignObject>
          </g>
        </a>
      {/each}
      {#if mode!=='scene'}<FlowPulse {paused} paths={links.filter(e=>e.kind==='flow').map(e=>e.d)}/>{/if}
    </g>
    {#each units as unit,i}
      <g data-band={unit.slug} aria-hidden={mode==='chapter'}>
        <text x="16" y={bands[i].start+37} class="band-title">{unit.title[lang]}</text>
        {#each unit.scenes as scene,j}
          {@const b=box(i,j)}{@const current=i===unitIndex&&j===step}
          {@const sceneH=b.height}
          {@const displayCards=scene.choices?.[current?(snapshot?.choice??0):0]?.cards??scene.cards}
          <g transform={'translate('+b.x+' '+b.y+')'} aria-hidden={mode==='scene' && !current} data-panel={unit.slug+'-'+scene.id}>
            <rect width={sceneW} height={sceneH} rx="5" class="panel" class:selected={current && mode==='scene'}/>
            <foreignObject x="12" y="7" width={sceneW-24} height="54">
              <div class="panel-title"><small>{chapter.toUpperCase()} · {i+1}.{j+1}</small><strong>{scene.title[lang]}</strong></div>
            </foreignObject>
            <g transform="translate(10 60)">
              <SceneLayer {unit} {scene} {lang} {frame} snapshot={current?snapshot:undefined} run={current && mode==='scene'} {paused}/>
            </g>
            <foreignObject x="12" y={frame.height+62} width={sceneW-24} height={sceneH-frame.height-65}>
              <div class="observation">{scene.observe[lang]}</div>
              {#if !scene.demo}<dl class="sample">{#each displayCards as card}<div><dt>{card.label[lang]}</dt><dd>{card.value[lang]}</dd></div>{/each}</dl>{/if}
            </foreignObject>
            {#if mode==='poster'}<a href={'#'+unit.slug+'-'+scene.id} onclick={e=>go(e,i,j)} aria-label={scene.title[lang]}><rect class="hit" width={sceneW} height={sceneH}/></a>{/if}
          </g>
          {#if j<unit.scenes.length-1}
            <path class="read-order" d={compact?'M'+(b.x+sceneW/2)+' '+(b.y+sceneH+2)+'v14':'M'+(b.x+sceneW+1)+' '+(b.y+sceneH/2)+'h13'} marker-end={'url(#'+uid+'-tip)'}/>
          {/if}
        {/each}
      </g>
    {/each}
    </g>
  </svg>
</div>
<style>
 .chart{min-width:0;max-height:72vh;overflow:auto;background:#f6f8f3;border:1px solid #b6c6ba;border-radius:.4rem}
 .chapter-svg{display:block;width:100%;height:auto;color:#253e3d}
 .chart.focused{max-height:none;overflow:visible}.focused svg{max-width:720px;margin-inline:auto}.sample{margin:8px 0 0;border-top:1px solid #a8beb2;font:13px/18px system-ui;color:#23453c}.sample div{display:grid;grid-template-columns:32% 1fr;gap:8px;padding:3px 2px;border-bottom:1px solid #d7e0d8}.sample dt{font-weight:650}.sample dd{margin:0;overflow-wrap:anywhere}
 .node,.panel{fill:#fffef8;stroke:#91a99e;stroke-width:1.3}
 a:hover .node,a:focus .node,.selected{stroke:#27695c;stroke-width:3}
 .node-text,.panel-title,.observation{font-family:system-ui,sans-serif;color:#223e3b;line-height:1.28;overflow-wrap:anywhere}
 .node-text{height:100%;display:flex;flex-direction:column;justify-content:center;gap:4px}
 .node-text b{font-size:16px}.node-text span,.observation{font-size:13px}
 .panel-title strong,.panel-title small{display:block}.panel-title strong{font-size:16px}.panel-title small{color:#52665d;font-size:11px}
 .link{fill:none;stroke:#356d69;stroke-width:2}.check{stroke-dasharray:7 4}.support{stroke-dasharray:2 5}
 .hit{fill:transparent;stroke:transparent}.hit:hover,a:focus .hit{stroke:#356d69;stroke-width:3}.read-order{stroke:#63796f;fill:none}
 .band-title{font:650 18px system-ui;fill:#223e3b}
</style>
