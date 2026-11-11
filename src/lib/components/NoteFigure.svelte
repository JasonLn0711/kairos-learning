<script lang="ts">
  import {noteFigurePath,type NoteFigure} from '$lib/ceh-notes';
  import type {Locale} from '$lib/model';
  import icons from '$lib/note-cia-icons.json';
  import {noteReferenceImage} from '$lib/note-diagrams';
  let {figure,date,part,lang}:{figure:NoteFigure;date:string;part:number;lang:Locale}=$props();
</script>
<figure class="note-figure" class:workflow={figure.name==='workflow'} data-figure={figure.name}>
  <figcaption>{figure.caption}</figcaption>
  {#if figure.name==='workflow'}
    <ol>{#each figure.items as item,i}<li><strong>{item.title}</strong><p>{item.body}</p>{#if i<figure.items.length-1}<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 4v16m-5-5 5 5 5-5"/></svg>{/if}</li>{/each}</ol>
  {:else}
    <ul class="cia">{#each figure.items as item,i}<li><svg aria-hidden="true" viewBox="0 0 24 24"><path d={icons[i]}/></svg><strong class="letter">{['C','I','A'][i]}</strong><span>{item.title.slice(4)}</span>{#each item.body.split('\n') as line}<p>{line}</p>{/each}</li>{/each}</ul>
  {/if}
  <p class="description">{figure.description}</p>
  <div class="links"><a href={noteFigurePath(date,part,figure.name,lang)} download>{lang==='zh'?'下載圖解 SVG':'Download figure SVG'}</a>{#if noteReferenceImage(date,figure.name)}<a href={noteReferenceImage(date,figure.name)}>{lang==='zh'?'檢視參考原圖':'View the supplied reference'}</a>{/if}</div>
</figure>
<style>
.note-figure{border:1px solid #d8dce0;border-radius:14px;padding:1rem;margin:1.75rem 0;background:#fbfcfd;min-width:0;overflow-wrap:anywhere}
figcaption{font-size:1rem;line-height:1.8}ol,ul{list-style:none;padding:0;margin:.8rem 0}svg{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:1.8;flex-shrink:0}
.workflow li{text-align:center;padding:.5rem 0}.workflow li strong{font-size:1.125rem}.workflow li p{margin:.25rem 0}.workflow li svg{display:block;width:18px;height:18px;margin:1.2rem auto;color:#657079}
.cia{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.6rem}.cia li{display:flex;flex-direction:column;align-items:center;text-align:center;background:#e9f2f7;border-radius:10px;padding:1rem .6rem;min-width:0}.cia li:nth-child(2){background:#eaf5f1}.cia li:nth-child(3){background:#f7f3ea}.cia svg{color:#0067b3}.cia li:nth-child(2) svg{color:#006b39}.cia li:nth-child(3) svg{color:#5c6064}.letter{font-size:1.4rem;line-height:1.8}.cia p{margin:0}.cia li p:first-of-type{color:#515b61}
.description{color:#515b61;margin:.8rem 0 .4rem}a{font-size:.875rem}
.links{display:flex;flex-wrap:wrap;gap:.5rem 1rem}
@media(max-width:600px){.cia{grid-template-columns:minmax(0,1fr)}}
</style>
