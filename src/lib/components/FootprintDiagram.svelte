<script lang="ts">
 import diagrams from '$lib/footprint-diagrams.json';
 let {src,lang='zh'}:{src:string;lang?:string}=$props();
 type Diagram={flow:boolean;nodes:{title:string;body:string[]}[];footer:string[]};
 const diagram=$derived((diagrams as Record<string,Diagram>)[src]);
</script>
{#if diagram}
 <div class="footprint-model" data-footprint-model={src}>
  <p class="relation">{diagram.flow?(lang==='en'?'Arrows show the teaching sequence; each step has its stated conditions.':'箭頭表示教學步驟順序；各步依其條件執行。'):(lang==='en'?'Parallel cards compare categories; their order does not imply a process.':'並列卡片比較不同類別；排列順序沒有流程意涵。')}</p>
  <ol class:flow={diagram.flow}>{#each diagram.nodes as node,i}<li><h3>{node.title}</h3>{#each node.body as line}<p>{line}</p>{/each}{#if diagram.flow&&i<diagram.nodes.length-1}<span class="arrow" aria-hidden="true">↓</span>{/if}</li>{/each}</ol>
  {#each diagram.footer as line}<p>{line}</p>{/each}
 </div>
{/if}
<style>
 .footprint-model{container-type:inline-size;min-width:0;margin:1rem 0;color:#172b3a;font-size:1rem;line-height:1.75}
 ol{list-style:none;padding:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem}ol.flow{grid-template-columns:1fr;gap:2.5rem}
 li{position:relative;min-width:0;border:1px solid #7892a6;border-radius:1rem;background:#e8f2fb;padding:1rem;overflow-wrap:anywhere}li:nth-child(2){background:#fff3d8}li:nth-child(3){background:#e7f3ed}
 h3{font-size:1rem;line-height:1.75;margin:0 0 .3rem}p{margin:.3rem 0;font-size:1rem;line-height:1.75}.arrow{position:absolute;bottom:-2.3rem;left:50%;font-size:1.5rem}
 @container(max-width:540px){ol{grid-template-columns:1fr}}
</style>
