<script lang="ts">
  import {onMount} from 'svelte';
  import {noteDiagramSpecs,type NoteDiagram,type NoteDiagramSpec} from '$lib/note-diagrams';
  let {diagram,lang}:{diagram:NoteDiagram;lang:string}=$props();
  const spec=$derived(noteDiagramSpecs[diagram.name] as NoteDiagramSpec);
  const layout=$derived(spec.layout.replace('continuation-',''));
  const zh=$derived(lang==='zh');
  let graph=$state<HTMLDivElement>();
  let paths=$state<{d:string;label:string;x:number;y:number}[]>([]);
  let canvas=$state({width:1,height:1});
  const label=(key:string)=>({yes:zh?'是':'Yes',no:zh?'否':'No',optional:zh?'必要時':'If needed'}[key]??key);
  const directions=[null,[0,1],[2,1],[1,2],[1,2],[1,2],null,[2,1],null];
  function measure(){
    if(!graph)return;
    const outer=graph.getBoundingClientRect();
    const nodes=[...graph.querySelectorAll<HTMLElement>('[data-node]')].map(el=>({id:Number(el.dataset.node),b:el.getBoundingClientRect()}));
    const box=(id:number)=>nodes.find(n=>n.id===id)!.b;
    canvas={width:outer.width,height:outer.height};
    paths=(spec.edges??[]).map(([from,to,key,both])=>{
      const a=box(from),b=box(to),horizontal=Math.abs(a.top-b.top)<2;
      let x1=horizontal?a.right-outer.left:a.left+a.width/2-outer.left;
      let y1=horizontal?a.top+a.height/2-outer.top:a.bottom-outer.top;
      let x2=horizontal?b.left-outer.left:b.left+b.width/2-outer.left;
      let y2=horizontal?b.top+b.height/2-outer.top:b.top-outer.top;
      // Mobile stacks a formerly horizontal exchange; endpoints still follow the actual nodes.
      const rowA=spec.rows!.findIndex(r=>r.includes(from)),rowB=spec.rows!.findIndex(r=>r.includes(to));
      const crossesNode=nodes.some(n=>n.id!==from&&n.id!==to&&n.b.top>=a.bottom&&n.b.bottom<=b.top&&n.b.left<=Math.max(x1,x2)+outer.left&&n.b.right>=Math.min(x1,x2)+outer.left);
      let d:string;
      let routed=false;
      if(horizontal){d=`M${x1} ${y1}H${x2}m-7-5 7 5-7 5`;if(both)d+=`M${x1+7} ${y1-5}l-7 5 7 5`;}
      else if(rowB-rowA>1||crossesNode){
        routed=true;
        const gutter=outer.width-7;
        d=`M${a.right-outer.left} ${a.top+a.height/2-outer.top}H${gutter}V${y2-20}H${x2}V${y2}m-5-7 5 7 5-7`;
      }else{
        const mid=(y1+y2)/2;
        d=`M${x1} ${y1}V${mid}H${x2}V${y2}m-5-7 5 7 5-7`;
        if(both)d+=`M${x1-5} ${y1+7}l5-7 5 7`;
      }
      return {d,label:label(key),x:routed?(outer.width-7+x2)/2:(x1+x2)/2,y:routed?y2-28:horizontal?(y1+y2)/2-10:(y1+y2)/2-8};
    });
  }
  onMount(()=>{
    if(!graph)return;
    const observer=new ResizeObserver(measure);observer.observe(graph);
    for(const el of graph.querySelectorAll('[data-node]'))observer.observe(el);
    document.fonts.ready.then(measure);
    measure();return ()=>observer.disconnect();
  });
</script>
{#snippet node(i:number)}<div class="node" class:danger={(diagram.name==='authorizationgates'&&[2,4].includes(i))||(diagram.name==='transactiontampering'&&i===1)||(diagram.name==='serviceavailability'&&i===1)||(diagram.name==='transportprotection'&&i<3)||(diagram.name==='ssdremapping'&&i===2)} class:blue={(diagram.name==='itotrisks'&&i===0)||(diagram.name==='ciaobjectives'&&i===0)||(diagram.name==='signatureevidence'&&i===2)||(diagram.name==='riskassessment'&&i===2)} class:warm={(diagram.name==='ciaobjectives'&&i===2)||(diagram.name==='itotrisks'&&i===1)} class:neutral={diagram.name==='ciaobjectives'&&i>2} class:decision={spec.edges?.some(([from,,key])=>from===i&&['yes','no'].includes(key))} data-node={i}><strong>{diagram.items[i].title}</strong>{#each diagram.items[i].body.split('\n') as line}<p>{line}</p>{/each}</div>{/snippet}
{#snippet arrow()}<svg class="arrow" aria-hidden="true" viewBox="0 0 24 32"><path d="M12 2v26m-6-6 6 6 6-6"/></svg>{/snippet}
{#if layout==='graph'}
  <div class="graph" bind:this={graph}>
    <svg class="connections" aria-hidden="true" viewBox={`0 0 ${canvas.width} ${canvas.height}`} preserveAspectRatio="none">
      {#each paths as p}<path d={p.d}/>{#if p.label}<text x={p.x} y={p.y}>{p.label}</text>{/if}{/each}
    </svg>
    {#each spec.rows! as row}<div class="rank" style={`--columns:${row.length}`}>{#each row as i}{@render node(i)}{/each}</div>{/each}
  </div>
  <ul class="relations" aria-label={zh?'連線與條件':'Connections and conditions'}>{#each spec.edges! as [from,to,key,both]}<li>{diagram.items[from].title} {both?'↔':'→'} {diagram.items[to].title}{#if key}（{label(key)}）{/if}</li>{/each}</ul>
{:else if layout==='parallel'}
  <div class="parallel">{#each diagram.items as _,i}{@render node(i)}{/each}</div>
{:else if layout==='bars'||layout==='bytes'}
  {#each diagram.items as item,i}<section class="parameter"><strong>{item.title}</strong>
    {#if layout==='bars'}<div class="bar" style={`width:${i===0?50:100}%`} aria-hidden="true"></div>
    {:else}<div class="bytes" class:key={i===1} aria-hidden="true">{#each Array(i===0?16:32) as _,j}<span>{j+1}</span>{/each}</div>{/if}
    <p>{item.body}</p></section>{/each}
{:else if layout==='digest'}
  <div class="digests">{#each diagram.items as item}<div><strong>{item.title}</strong><span aria-hidden="true">→</span><p>{item.body}</p></div>{/each}</div>
{:else if layout==='nested'}
  <div class="node outer"><strong>{diagram.items[0].title}</strong><p>{diagram.items[0].body}</p>{@render node(1)}</div>
{:else if layout==='paired'}
  <div class="parallel">{#each [0,1] as column}<div class="lane">{#each Array(diagram.items.length/2) as _,i}{#if i>0}{@render arrow()}{/if}{@render node(column*diagram.items.length/2+i)}{/each}</div>{/each}</div>
{:else if layout==='aes'}
  {@render node(0)}{@render arrow()}
  <div class="node"><strong>{diagram.items[1].title}</strong><ul class="finalists">{#each diagram.items[1].body.split('\n') as name}<li class:selected={name==='Rijndael'}>{name}</li>{/each}</ul></div>
  {@render arrow()}{@render node(2)}
{:else if layout==='sequence'}
  <div class="actors">{#each [0,1,2] as i}<div>{@render node(i)}</div>{/each}</div>
  <ol class="sequence">{#each diagram.items.slice(3) as item,i}<li class:local={!directions[i]} data-event={i}>
    <strong>{item.title}</strong><p>{item.body}</p>
    {#if directions[i]}{@const pair=directions[i]!}<svg class="message" aria-hidden="true" viewBox="0 0 600 32" preserveAspectRatio="none"><path class:reply={i===1||i===3||i===4||i===5} d={`M${100+pair[0]*200} 16H${100+pair[1]*200}m${pair[1]>pair[0]?-8:8}-6 ${pair[1]>pair[0]?8:-8} 6 ${pair[1]>pair[0]?-8:8} 6`}/></svg>{/if}
  </li>{/each}</ol>
{/if}
<style>
 .node.danger{background:#fbeeee;border-color:#d9a4a4}.node.blue{background:#e9f2fa;border-color:#a4c5e1}.node.warm{background:#f7f1e9;border-color:#d7bfa1}.node.neutral{background:#f6f7f8;border-color:#cbd1d5}
 .node{min-width:0;padding:1rem;border:1px solid #b8d5c5;border-radius:14px;background:#e6f5ec;text-align:center;overflow-wrap:anywhere}.node.decision{border-style:dashed;background:#f0faf3}.node strong,.parameter strong{font-size:1.125rem;line-height:1.8}.node p,.parameter p,.sequence p,.digests p{font-size:1rem;line-height:1.8;margin:.35rem 0;white-space:pre-line}.graph{position:relative;padding-right:1.25rem;display:grid;gap:4rem;margin:1.25rem 0}.rank{display:grid;grid-template-columns:repeat(var(--columns),minmax(0,1fr));gap:3rem;align-items:stretch}.connections{position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none}.connections path{fill:none;stroke:#77867f;stroke-width:1.7}.connections text{font-size:14px;fill:#175f3b;stroke:#fbfcfd;stroke-width:5;paint-order:stroke;text-anchor:middle}.rank .node{position:relative}.relations{font-size:1rem;line-height:1.8;margin:1rem 0;padding-left:1.25rem}.relations li{margin:.35rem 0;overflow-wrap:anywhere}.parallel{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem;margin:1rem 0}.arrow{display:block;width:24px;height:32px;margin:1rem auto;fill:none;stroke:#77867f;stroke-width:2}.bar{height:1rem;border-radius:5px;background:#c7dfe9;margin:.6rem 0}.parameter{margin:1.5rem 0}.bytes{display:grid;grid-template-columns:repeat(16,minmax(0,1fr));gap:3px;margin:.6rem 0}.bytes span{display:grid;place-items:center;min-height:1.8rem;background:#c6dfea;font-size:.875rem;line-height:1.8}.bytes.key span{background:#c5e3d7}.digests>div{display:grid;grid-template-columns:minmax(0,1fr) 2rem minmax(0,1fr);gap:.5rem;align-items:center;margin:1rem 0}.outer{padding:1rem;text-align:left;background:#f7faf8}.outer>.node{margin-top:1rem;background:#fff}.lane{min-width:0;padding:.5rem;border:1px solid #d8dce0;border-radius:12px}.finalists{list-style:none;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.6rem;padding:0;margin:1rem 0}.finalists li{padding:.5rem;background:#fff;border-radius:6px}.finalists .selected{background:#b9dec9;font-weight:700}.actors{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0;margin-top:1rem}.actors>div{padding:0 .3rem}.actors .node{height:100%;padding:.6rem}.actors strong{font-size:1rem}.sequence{list-style:none;padding:0;margin:0;background:linear-gradient(to right,transparent calc(16.666% - 1px),#a2aaa6 calc(16.666% - 1px),#a2aaa6 calc(16.666% + 1px),transparent calc(16.666% + 1px),transparent calc(50% - 1px),#a2aaa6 calc(50% - 1px),#a2aaa6 calc(50% + 1px),transparent calc(50% + 1px),transparent calc(83.333% - 1px),#a2aaa6 calc(83.333% - 1px),#a2aaa6 calc(83.333% + 1px),transparent calc(83.333% + 1px))}.sequence li{padding:1rem 0;text-align:center}.sequence strong,.sequence p{background:#fbfcfd;box-decoration-break:clone}.sequence .local{background:#fff6e9;border:1px solid #bd955a;margin:.75rem 0;padding:.75rem}.sequence .local[data-event="0"]{width:66.666%}.sequence .local[data-event="6"]{width:33.333%;margin-left:66.666%}.sequence .local[data-event="8"]{width:66.666%;margin-left:33.333%}.sequence .local strong,.sequence .local p{background:transparent}.message{display:block;width:100%;height:32px;fill:none;stroke:#77867f;stroke-width:2}.reply{stroke-dasharray:5 4}
 @container(max-width:34rem){.parallel,.rank{grid-template-columns:minmax(0,1fr)}.rank{gap:4rem}.bytes{grid-template-columns:repeat(8,minmax(0,1fr))}.finalists{grid-template-columns:repeat(2,minmax(0,1fr))}.actors{grid-template-columns:minmax(0,1fr)}.sequence{background:none}.sequence .local[data-event]{width:100%;margin-left:0}.graph{padding-right:1.25rem}.digests>div{grid-template-columns:minmax(0,1fr) 1rem minmax(0,1fr)}}
</style>
