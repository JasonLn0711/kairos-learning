<script lang="ts">
 import {sitemapGroups} from '$lib/information-hierarchy';
 import type {ConceptVisual} from '$lib/concepts';
 let {diagram,number,lang}:{diagram:ConceptVisual;number:1|2|3|4|5|6;lang:'zh'|'en'}=$props();
</script>
{#snippet lines(value:string)}
 {#each value.split('\n') as line}<span>{line.trim()}</span>{/each}
{/snippet}
<figure class="ia-diagram" data-figure={number}>
 <figcaption><strong>{diagram.caption}</strong></figcaption>
 {#if number===1}
  <div class="inclusion outer"><strong>{diagram.items[0].title}</strong><p>{@render lines(diagram.items[0].body)}</p>
   <div class="inclusion middle"><strong>{diagram.items[1].title}</strong><p>{diagram.items[1].body}</p>
    <div class="inclusion inner"><strong>{diagram.items[2].title}</strong><p>{diagram.items[2].body}</p></div>
   </div>
  </div>
 {:else if number===2}
  <div class="root"><strong>{diagram.items[0].title}</strong><p>{diagram.items[0].body}</p></div>
  <ul class="branches" role="list">{#each diagram.items.slice(1) as item}<li><strong>{item.title}</strong><ul class="tree" role="list">{#each sitemapGroups(item.body) as group}<li><span>{group.title}</span>{#if group.children.length}<ul role="list">{#each group.children as child}<li>{child}</li>{/each}</ul>{/if}</li>{/each}</ul></li>{/each}</ul>
 {:else if number===3}
  <ul class="comparison" role="list">{#each diagram.items as item,i}<li><strong class="alternative">{item.title}</strong>
   {#each item.body.split('\n\n') as part,j}
    {#if i===0&&j===1}<div class="mock-actions">{#each part.split('\n') as action}<span>{action}</span>{/each}</div>
    {:else}<p class:screen-title={j===0} class:error={i===1&&j===3} class:primary={i===1&&j===4} class:note={j===item.body.split('\n\n').length-1}>{@render lines(part)}</p>{/if}
   {/each}</li>{/each}</ul>
 {:else if number===4}
  <dl class="states">{#each diagram.items as item}<div><dt>{item.title}</dt><dd>{item.body}</dd></div>{/each}</dl>
 {:else if number===5}
  <ul class="comparison layouts" role="list">{#each diagram.items as item,i}<li><strong>{item.title}</strong><ol class:desktop={i===0}>{#each item.body.split('\n') as line}<li>{line}</li>{/each}</ol></li>{/each}</ul>
 {:else}
  <ol class="workflow" role="list">{#each diagram.items as item,i}<li><strong>{i+1}. {item.title}</strong><p>{item.body}</p>{#if i<diagram.items.length-1}<svg class="arrow" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 3v17m-6-6 6 6 6-6"/></svg>{/if}</li>{/each}</ol>
 {/if}
 <p class="interpretation">{diagram.description}</p>
 <a href={`/images/aase/m04-03-${number}-${lang}.svg`} target="_blank" rel="noreferrer">{lang==='zh'?'開啟／下載原尺寸 SVG':'Open / download full-size SVG'}</a>
</figure>
<style>
 figure{container-type:inline-size;margin:1.5rem 0;padding:1rem;border:1px solid #ced8db;border-radius:1rem;background:#fbfcfd;color:#18252c}figcaption,strong,p,li,dt,dd,span,a{font-size:1rem;line-height:1.8}figcaption{margin-bottom:1rem}p{margin:.6rem 0;overflow-wrap:anywhere}.inclusion{padding:1rem;border:2px solid #368079;border-radius:.8rem}.outer{background:#edf7f4}.middle{background:#e6f2fb;margin-top:.8rem;border-color:#397c9b}.inner{background:#efedfa;margin-top:.8rem;border-color:#7468a3}.ia-diagram span{display:block}.root{padding:1rem;text-align:center;background:#e0f2ed;border:1px solid #62988c;border-radius:.6rem}.root p{margin:.2rem 0}.branches{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:1rem;list-style:none;padding:1.3rem 0 0;margin:0;position:relative}.branches:before{content:'';position:absolute;top:0;left:50%;height:1.3rem;border-left:2px solid #65757c}.branches>li{min-width:0;border:1px solid #bccbd0;border-top:3px solid #397c9b;border-radius:.5rem;padding:.7rem;margin:0;overflow-wrap:anywhere}.branches>li:nth-child(2){border-top-color:#7468a3}.branches>li:nth-child(3){border-top-color:#a35a46}.branches>li:nth-child(4){border-top-color:#368079}.tree{list-style:none;padding:0;border-left:2px solid #8b9ca3;margin-top:.8rem;padding-left:.6rem}.tree>li{margin:0;padding-left:.6rem}.tree ul{list-style:none;margin:.3rem 0;padding-left:.8rem;border-left:1px solid #8b9ca3}.tree ul li{margin:0;padding:.3rem 0 .3rem .5rem}.tree span{padding:.3rem 0;position:relative}.tree span:before{content:'';position:absolute;left:-.6rem;top:1.1rem;width:.4rem;border-top:1px solid #8b9ca3}.comparison{list-style:none;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem;margin:0;padding:0}.comparison>li{padding:1rem;border:1px solid #ced8db;border-radius:.8rem;min-width:0;overflow-wrap:anywhere;margin:0}.alternative{color:#4e5e65;font-weight:400}.screen-title{font-weight:700;margin-top:1rem}.mock-actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.3rem}.mock-actions span,.primary{background:#edf0f2;border-radius:.4rem;padding:.4rem;text-align:center}.primary{background:#e3ecfb}.error{padding:.5rem;border:1px solid #a75b4a;border-left:4px solid #a75b4a;border-radius:.4rem}.note{color:#4e5e65}.states{margin:0}.states>div{display:grid;grid-template-columns:minmax(9rem,1fr) 3fr;gap:1rem;padding:1rem 0;border-bottom:1px solid #ced8db}.states dt{font-weight:700;overflow-wrap:anywhere}.states dd{margin:0}.layouts ol{list-style:none;padding:0;margin:1rem 0 0;display:grid;gap:.4rem}.layouts ol li{padding:.5rem;background:#edf0f2;border-radius:.3rem;margin:0;min-width:0;overflow-wrap:anywhere}.layouts .desktop{grid-template-columns:repeat(2,minmax(0,1fr))}.desktop li:first-child,.desktop li:last-child{grid-column:1/-1}.layouts ol li:last-child{background:#e3ecfb}.workflow{list-style:none;padding:0;margin:0}.workflow li{position:relative;text-align:center;margin:0 0 2rem;padding:.8rem;min-width:0;overflow-wrap:anywhere}.workflow li:last-child{background:#e3ecfb;border-radius:.5rem;margin-bottom:0}.workflow p{margin:.3rem 0}.arrow{width:24px;height:24px;position:absolute;left:calc(50% - 12px);bottom:-1.6rem;stroke:#65757c;stroke-width:1.7;fill:none}.interpretation{margin-top:1rem}a:focus-visible{outline:3px solid #a35a46;outline-offset:4px}
 @container(max-width:48rem){.branches{grid-template-columns:repeat(2,minmax(0,1fr))}}
 @container(max-width:36rem){.comparison,.branches{grid-template-columns:1fr}.states>div{grid-template-columns:1fr;gap:.4rem}.inclusion{padding:.7rem}.mock-actions{grid-template-columns:1fr}}
</style>
