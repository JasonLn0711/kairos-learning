<script lang="ts">
  import {noteDiagramSpecs,tlsDirections,noteReferenceImage,type NoteDiagram} from '$lib/note-diagrams';
  import NoteDay02Supplement from './NoteDay02Supplement.svelte';
  import NoteTcpHandshake from './NoteTcpHandshake.svelte';
  import NoteRecoveryTimeline from './NoteRecoveryTimeline.svelte';
  import NoteDay01Diagram from './NoteDay01Diagram.svelte';
  import NoteContinuationDiagram from './NoteContinuationDiagram.svelte';
  import {noteFigurePath} from '$lib/ceh-notes';
  import type {Locale} from '$lib/model';
  let {diagram,date,part,lang}:{diagram:NoteDiagram;date:string;part:number;lang:Locale}=$props();
  const layout=$derived(noteDiagramSpecs[diagram.name].layout);
  const zh=$derived(lang==='zh');
  const shield='M12 3l8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z';
  const marks=['m8 12 3 3 5-6','M12 8v5m0 3v1','M9 9a3 3 0 0 1 6 0c0 2-3 2-3 4m0 3v1'];
  function directionLabel(index:number):string {
    const d=tlsDirections[index];
    return d==='to-server'?(zh?'瀏覽器 → 網站伺服器':'Browser → Web server'):d==='to-client'?(zh?'網站伺服器 → 瀏覽器':'Web server → Browser'):d==='both'?(zh?'雙方各自在本機計算':'Both endpoints compute locally'):(zh?'瀏覽器在本機驗證':'Browser validates locally');
  }
</script>
<figure class="note-diagram" data-diagram={diagram.name}>
  <figcaption>{diagram.caption}</figcaption>
  {#if layout.startsWith('day02-')}
    <NoteDay02Supplement {diagram}/>
  {:else if layout==='tcp-handshake'}
    <NoteTcpHandshake {diagram}/>
  {:else if layout==='soc-timeline'}
    <NoteRecoveryTimeline {diagram} {lang}/>
  {:else if layout.startsWith('day01-')}
    <NoteDay01Diagram {diagram} {lang}/>
  {:else if layout.startsWith('continuation-')}
    <NoteContinuationDiagram {diagram} {lang}/>
  {:else if layout==='table'}
    <dl class="roe">{#each diagram.items as item}<div><dt>{item.title}</dt><dd>{item.body}</dd></div>{/each}</dl>
  {:else if layout==='sequence'}
    <div class="endpoints" aria-hidden="true"><strong>{zh?'瀏覽器':'Browser'}</strong><strong>{zh?'網站伺服器':'Web server'}</strong></div>
    <ol class="sequence">{#each diagram.items as item,i}
      <li class:local={tlsDirections[i]==='both'||tlsDirections[i]==='client'} class:reply={tlsDirections[i]==='to-client'}>
        <p class="direction">{directionLabel(i)}</p><strong>{item.title}</strong>
        {#if tlsDirections[i]==='to-server'||tlsDirections[i]==='to-client'}
          <svg class="message" aria-hidden="true" viewBox="0 0 400 24" preserveAspectRatio="none"><path d={tlsDirections[i]==='to-server'?'M2 12H395m-8-7 8 7-8 7':'M398 12H5m8-7-8 7 8 7'}/></svg>
        {/if}
        <p>{item.body}</p>
      </li>
    {/each}</ol>
    <div class="endpoints" aria-hidden="true"><strong>{zh?'瀏覽器':'Browser'}</strong><strong>{zh?'網站伺服器':'Web server'}</strong></div>
  {:else}
    {#if layout==='branches'}<p class="root">{zh?'題目到底在問什麼？':'What is the question asking?'}</p><svg class="next" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 4v16m-5-5 5 5 5-5"/></svg>{/if}
    <svelte:element this={['flow','layers','numbered'].includes(layout)?'ol':'ul'} class={layout}>
      {#each diagram.items as item,i}
        <li>
          {#if layout==='numbered'}<span class="number" aria-hidden="true">{String(i+1).padStart(2,'0')}</span>{/if}
          {#if layout==='rows'}<svg class="shield" aria-hidden="true" viewBox="0 0 24 24"><path d={shield}/><path d={marks[i]}/></svg>{/if}
          {#if diagram.name==='overview'}<svg class="overview-icon" aria-hidden="true" viewBox="0 0 24 24"><path d={i===0?shield:i===1?'M3 8 12 3l9 5-9 5-9-5Zm0 5 9 5 9-5M3 18l9 5 9-5':'M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm5 12 6 6M7 10l2 2 4-4'}/></svg>{/if}
          <div><strong>{item.title}</strong>{#each item.body.split('\n') as line}<p>{line}</p>{/each}</div>
          {#if ['flow','layers','numbered'].includes(layout)&&i<diagram.items.length-1}<svg class="next" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 4v16m-5-5 5 5 5-5"/></svg>{/if}
        </li>
      {/each}
    </svelte:element>
  {/if}
  <p class="description">{diagram.description}</p>
  <div class="links"><a href={noteFigurePath(date,part,diagram.name,lang)} download>{zh?'下載圖解 SVG':'Download figure SVG'}</a>{#if noteReferenceImage(date,diagram.name)}<a href={noteReferenceImage(date,diagram.name)}>{zh?'檢視參考原圖':'View the supplied reference'}</a>{/if}</div>
</figure>
<style>
  .note-diagram{container-type:inline-size;min-width:0;margin:1.75rem 0;padding:1rem;border:1px solid #d8dce0;border-radius:14px;background:#fbfcfd;overflow-wrap:anywhere}
  figcaption{font-weight:650;font-size:1rem;line-height:1.8}ol,ul{list-style:none;margin:1rem 0;padding:0}li{min-width:0}strong{font-size:1.125rem;line-height:1.8}p{margin:.35rem 0;white-space:pre-line}svg{fill:none;stroke:currentColor;stroke-width:1.8;width:24px;height:24px;flex-shrink:0}.next{display:block;margin:1.2rem auto;color:#657079}
  .flow li{text-align:center;padding:.6rem}.overview-icon{display:block;margin:0 auto .5rem}.layers li{padding:1rem .6rem}.layers li strong{font-size:1.2rem}.numbered li{display:grid;grid-template-columns:3.5rem minmax(0,1fr);gap:.8rem}.number{padding:.5rem;background:#f1f3f4;border-radius:12px;text-align:center;font-size:1.25rem;align-self:start}.numbered .next{grid-column:1;margin:.8rem auto}.rows li{display:grid;grid-template-columns:3.5rem minmax(0,1fr);gap:1rem;border-bottom:1px solid #e1e5e8;padding:1.2rem 0}.rows li:last-child{border:0}.shield{width:2.5rem;height:2.5rem;background:#eaf5f1;border-radius:10px;padding:.5rem;box-sizing:content-box;color:#006b39}.rows li:nth-child(2) .shield{color:#b52323;background:#f9eeee}.rows li:nth-child(3) .shield{color:#18252c;background:#f1f3f4}
  .roe{margin:1rem 0}.roe>div{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.6fr);gap:1rem;border-bottom:1px solid #d8dce0;padding:.65rem 0}dt{font-weight:600}dd{margin:0;white-space:pre-line}
  .parallel,.branches{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem}.parallel li,.branches li{padding:1rem;background:#f5f7f8;border-radius:10px}.branches li{border-top:2px solid #d8dce0}.root{text-align:center;font-weight:650;padding:.75rem}.description{color:#515b61;margin:1rem 0 .4rem}a{font-size:.875rem;line-height:1.8}
  .links{display:flex;flex-wrap:wrap;gap:.5rem 1rem}
  .endpoints{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem;text-align:center}.endpoints strong{border:1px solid #4a9865;border-radius:7px;background:#e6f3e9;padding:.8rem}.sequence{margin:0 calc(25% - .25rem);border-inline:2px solid #899296}.sequence li{position:relative;padding:.8rem .6rem;text-align:center}.sequence strong{font-size:1rem}.sequence .direction{font-size:1rem;color:#515b61}.sequence .message{display:block;width:calc(100% + 1.2rem);margin-inline:-.6rem;height:20px;color:#657079}.sequence .reply .message{stroke-dasharray:6 5}.sequence .local{margin:.6rem -40%;background:#f7f3ea;border:1px solid #b47a36;border-radius:6px}.sequence .local p:last-child{font-size:1rem}
  @container(max-width:34rem){.parallel,.branches{grid-template-columns:minmax(0,1fr)}.roe>div{grid-template-columns:minmax(0,1fr);gap:.25rem}.sequence{margin:0;border:0}.sequence li{padding:.8rem .5rem}.sequence .message{width:100%;margin-inline:0}.sequence .local{margin:.6rem 0}.endpoints{gap:.5rem}.endpoints strong{font-size:1rem;padding:.5rem}.numbered li,.rows li{grid-template-columns:2.75rem minmax(0,1fr);gap:.6rem}.shield{width:1.75rem;height:1.75rem}}
</style>
