<script lang="ts">
  import {boundEvidence} from './scene-values.ts';
  import {objects} from './objects.ts';
  import {storyboard,isAssociation,feedback} from './storyboards.ts';
  import TeachingGlyph from './TeachingGlyph.svelte';
  import type {Locale} from '../../model.ts';
  import type {TeachingScene} from '../../aase/model.ts';

  let {slug,scene,lang,values={},active='',states={}}:{
    slug:string;scene:TeachingScene;lang:Locale;values?:Record<string,string>;
    active?:string;states?:Record<string,string>
  }=$props();
  const uid=$props.id();
  let width=$state(680);
  const graph=$derived(storyboard(slug,Number(scene.id)));
  const evidence=$derived(boundEvidence(slug,scene,lang));
  function datum(key:string){
    const value=values[key]??evidence[key]??'';
    return Array.from(value).length<=(lang==='zh'?13:24)?value:'';
  }
  function valueLines(key:string){
    const value=datum(key),limit=lang==='zh'?9:15;
    if(!compact || value.length<=limit)return [value];
    const split=lang==='en'?value.lastIndexOf(' ',limit):-1;
    const at=split>4?split:limit;
    return [value.slice(0,at).trim(),value.slice(at).trim()];
  }
  function begin(animation:SVGAnimationElement,delay:number){
    if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches && typeof animation.beginElementAt==='function'){
      animation.beginElementAt(delay);
    }
  }
  const association=$derived(isAssociation(slug,Number(scene.id)));
  const compact=$derived(width>0 && width<430);
  const canvasWidth=$derived(Math.max(230,Math.min(820,width||680)));
  const vertical=$derived(compact || graph.columns.some(column=>column.length>=4));
  const layout=$derived.by(()=>{
    const columns=graph.columns;
    const map:Record<string,{x:number;y:number}>={};
    const parallel=columns.length===1;
    if(vertical || parallel){
      let y=32;
      for(const column of columns){
        const perRow=Math.min(column.length,compact?2:5);
        for(let i=0;i<column.length;i++){
          const row=Math.floor(i/perRow), count=Math.min(perRow,column.length-row*perRow);
          map[column[i]]={x:(i%perRow+.5)*canvasWidth/count,y:y+row*(compact?98:83)};
        }
        y+=Math.ceil(column.length/perRow)*(compact?98:83)+(columns.length>1?15:0);
      }
      return {map,height:y-23};
    }
    const rows=Math.max(...columns.map(c=>c.length));
    const pitch=rows>=3?69:80;
    columns.forEach((column,i)=>column.forEach((key,j)=>{
      map[key]={x:72+i*(canvasWidth-144)/(columns.length-1),y:34+(j+(rows-column.length)/2)*pitch};
    }));
    return {map,height:pitch*(rows-1)+84};
  });
  const points=$derived(layout.map);
  const loop=$derived(feedback[slug]?.step===scene.id?feedback[slug]:undefined);
  const span=$derived([canvasWidth,layout.height+(loop?28:0)]);
  const loopPath=$derived.by(()=>{
    if(!loop)return '';
    const a=points[loop.from],b=points[loop.to];
    return compact?'M'+(a.x+28)+' '+a.y+' H'+(canvasWidth-10)+' V'+b.y+' H'+(b.x+30)
      :'M'+(a.x+26)+' '+a.y+' h12 V'+(layout.height+3)+' H'+(b.x-38)+' V'+b.y+' h10';
  });
  function muted(from:string,to:string){
    if (states[from]==='failed' || states[from]==='skipped' || states[to]==='skipped') return true;
    const branches=graph.links.filter(([source])=>source===from).map(([,target])=>target);
    return !association && branches.includes(active) && to!==active;
  }
  function edge(source:string,target:string){
    const a=points[source],b=points[target];
    if(vertical){
      const sign=Math.sign(b.y-a.y);
      const y1=a.y+(sign>0?(datum(source)?48+(valueLines(source).length-1)*12:33):-24), y2=b.y+(sign>0?-25:39),mid=(y1+y2)/2;
      return 'M'+a.x+' '+y1+' C'+a.x+' '+mid+' '+b.x+' '+mid+' '+b.x+' '+y2;
    }
    const sign=Math.sign(b.x-a.x),x1=a.x+sign*26,x2=b.x-sign*28;
    const y1=a.y-6,y2=b.y-6;
    if(graph.columns.findIndex(c=>c.includes(target))-graph.columns.findIndex(c=>c.includes(source))>1) return 'M'+x1+' '+y1+' Q'+((a.x+b.x)/2)+' -34 '+x2+' '+y2;
    return 'M'+x1+' '+y1+' C'+((x1+x2)/2)+' '+y1+' '+((x1+x2)/2)+' '+y2+' '+x2+' '+y2;
  }
</script>
<figure class="flow" bind:clientWidth={width} data-flow={slug} data-scene={scene.id}>
  <svg viewBox={'0 -8 '+span[0]+' '+(span[1]+18)} role="img" aria-labelledby={uid+'-title '+uid+'-description'} style={'--natural:'+span[0]+'px'}>
    <title id={uid+'-title'}>{scene.title[lang]}</title><desc id={uid+'-description'}>{scene.mechanism[lang]} {scene.observe[lang]} {Object.keys(points).map(key=>[objects[key][lang],values[key]??evidence[key]].filter(Boolean).join(' · ')).join('；')}</desc>
    <defs><marker id={uid+'-arrow'} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="m1 1 6 3-6 3" fill="none" stroke="currentColor"/></marker></defs>
    {#if loop}<path d={loopPath} class="wire" marker-end={'url(#'+uid+'-arrow)'}/><text class="value" x={canvasWidth/2} y={layout.height+20}>{loop[lang]}</text>{/if}
    {#each graph.links as [from,to]}
      <path d={edge(from,to)} class="wire" class:association class:idle={muted(from,to)} marker-end={association?undefined:'url(#'+uid+'-arrow)'} />
    {/each}
    {#key [slug,scene.id,active,JSON.stringify(values),JSON.stringify(states)].join('|')}
      {#each graph.links as [from,to],index}
        {#if !association && !muted(from,to) && (Object.keys(states).length || active===from || active===to)}
          <circle class="transit" r="3" opacity="0" aria-hidden="true">
            <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.05;.94;1" dur=".65s" begin="indefinite" use:begin={index*.65}/>
            <animateMotion path={edge(from,to)} dur=".65s" begin="indefinite" use:begin={index*.65}/>
          </circle>
        {/if}
      {/each}
    {/key}
    {#each Object.entries(points) as [key,p]}
      <g transform={'translate('+p.x+' '+p.y+')'} data-object={key} data-state={states[key]??(active===key?'selected':undefined)} class:skipped={states[key]==='skipped'}>
        <title>{objects[key][lang]} · {values[key]??evidence[key]??scene.title[lang]}</title>
        {#if active===key || states[key]==='failed'}<ellipse cy="-6" rx="30" ry="21" class="highlight" class:failed={states[key]==='failed'} />{/if}
        <g transform="translate(0 -6) scale(.84)"><TeachingGlyph kind={objects[key].glyph} selected={values.matrix==='#42'?2:1}/></g>
        <text y="26">{objects[key][lang]}</text>
        {#if datum(key)}<text class="value" y="41">{#each valueLines(key) as line,i}<tspan x="0" dy={i?12:0}>{line}</tspan>{/each}</text>{/if}
      </g>
    {/each}
  </svg>
  {#if association}<figcaption>{lang==='zh'?'虛線連接各項平行支援。':'Dashed lines connect parallel responsibilities.'}</figcaption>{/if}
</figure>
<style>
 .flow {margin:0;min-inline-size:0;background:var(--paper);border-block:1px solid var(--line);color:var(--ink);padding:.35rem .15rem;}
 svg {display:block;inline-size:100%;max-inline-size:var(--natural);margin:auto;overflow:visible}
 text {text-anchor:middle;fill:var(--ink);font:600 14px system-ui,sans-serif}
 .value {fill:var(--accent);font:650 11px system-ui,sans-serif}
 figcaption{text-align:center;color:var(--muted);font-size:.9rem}
 .wire {stroke:var(--accent);stroke-width:1.8;fill:none}
 .association,.idle {stroke-dasharray:4 4}
 .idle {opacity:.38}
 .transit {fill:var(--accent)}
 @media(prefers-reduced-motion:reduce){.transit{display:none}}
 .highlight {fill:var(--soft);stroke:var(--accent);stroke-width:2}
 .failed {stroke-dasharray:4 2;stroke-width:3}
 .skipped {opacity:.66}
 @media(forced-colors:active){.wire,.highlight{stroke:CanvasText}text,.value{fill:CanvasText}}
</style>
