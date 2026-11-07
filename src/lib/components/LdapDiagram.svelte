<script lang="ts">
 import type {SourceBlock} from '$lib/concepts';
 let {block}:{block:Extract<SourceBlock,{kind:'visual'}>}=$props();
 const key=$derived(block.src.split('m04-08-')[1].replace(/-(zh|en)-v1-1-0\.svg$/,''));
 const items=$derived(block.visual.items);
 const tree=$derived(['directory','central','sso','scope'].includes(key));
</script>
<figure class="ldap-diagram" data-ldap={key}>
 <figcaption>{block.visual.caption}</figcaption>
 {#if tree}
  <div class="root node"><strong>{items[0].title}</strong><p>{items[0].body}</p></div>
  <div class="branches">
   {#each items.slice(1,4) as item,i}
    <div class="branch">
     <div class="node" class:selected={key==='scope'}><strong>{item.title}</strong><p>{item.body}</p></div>
     {#if key==='scope'&&i===2}<div class="children">{#each items.slice(4) as child}<div class="node"><strong>{child.title}</strong><p>{child.body}</p></div>{/each}</div>{/if}
    </div>
   {/each}
  </div>
 {:else if key==='entry'||key==='result'}
  <dl>{#each items as item}<div class:limit={key==='result'&&item.title==='Result Code'}><dt>{item.title}</dt><dd>{item.body}</dd></div>{/each}</dl>
 {:else if key==='tickets'}
  <ol class="tickets">{#each items as item,i}{@const lines=item.body.split('\n')}{@const endpoints=item.title.split(' → ')}
   <li><p class="stage">{lines[0]}</p><div class="endpoints"><strong>{endpoints[0]}</strong><strong>{endpoints[1]}</strong></div>
    <p class="message"><span aria-hidden="true">→</span> {lines[1]}</p>
    <p class="reply">{#if i<2}<span aria-hidden="true">←</span> {/if}{lines[2]}</p>
   </li>
  {/each}</ol>
 {:else}
  <ol class:flow={block.visual.kind==='flow'} class:cards={block.visual.kind==='cards'}>
   {#each items as item,i}<li class="node"><strong>{item.title}</strong><p>{item.body}</p></li>{#if block.visual.kind==='flow'&&i<items.length-1}<li class="arrow" aria-hidden="true">↓</li>{/if}{/each}
  </ol>
 {/if}
 <p class="description">{block.visual.description}</p><a href={block.src} download>{block.downloadLabel}</a>
</figure>
<style>
 .ldap-diagram{container-type:inline-size;min-width:0;margin:1.75rem 0;padding:1.2rem;background:#f7f9fb;border:1px solid #c3cdd8;border-radius:14px;color:#213547;overflow-wrap:anywhere}
 figcaption{font-size:1.2rem;font-weight:700;line-height:1.8;margin-bottom:1rem}.ldap-diagram p,.ldap-diagram strong,.ldap-diagram dt,.ldap-diagram dd,.ldap-diagram a{font-size:1rem;line-height:1.8}.ldap-diagram p{margin:.45rem 0}.node{min-width:0;padding:1rem;border:1px solid #a0adba;border-radius:12px;background:#fff}.root{max-width:24rem;margin:auto;text-align:center}.branches{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1rem;padding-top:2rem;position:relative}.branches:before{content:'';position:absolute;top:0;left:50%;height:1rem;border-left:2px solid #8b969f}.branch{min-width:0;position:relative}.branch:before{content:'';position:absolute;top:-1rem;left:50%;height:1rem;border-left:2px solid #8b969f}.branch:after{content:'';position:absolute;top:-1rem;left:-.5rem;right:-.5rem;border-top:2px solid #8b969f}.branch:first-child:after{left:50%}.branch:last-child:after{right:50%}.children{display:grid;gap:.75rem;margin-top:0;margin-left:1rem;padding-top:1rem;padding-left:1rem;border-left:2px solid #8b969f}.children .node{position:relative}.children .node:before{content:'';position:absolute;left:-1rem;top:1.5rem;width:1rem;border-top:2px solid #8b969f}.selected{border:3px solid #368878;background:#e3f1ee}.description{margin-top:1.2rem!important}.cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.85rem}.ldap-diagram ol{list-style:none;padding:0;margin:0}.flow{display:grid}.arrow{text-align:center;font-size:1.5rem}.tickets li{border-bottom:1px solid #c3cdd8;padding:1rem 0}.stage{font-weight:600}.endpoints{display:flex;justify-content:space-between;gap:1.5rem}.endpoints strong{max-width:46%}.message,.reply{text-align:center;padding:.5rem}.reply{color:#22694f}.message span,.reply span{font-size:1.4em}.ldap-diagram dl{margin:0}.ldap-diagram dl>div{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.4fr);gap:1rem;border-bottom:1px solid #c3cdd8;padding:.75rem 0}.ldap-diagram dd{margin:0}.limit{color:#a33c22;font-weight:700}a:focus-visible{outline:3px solid #b75c00;outline-offset:4px}
 @container(max-width:560px){.branches{grid-template-columns:1fr;gap:1rem;padding-top:1rem;padding-left:1rem;border-left:2px solid #8b969f}.branches:before,.branch:before{display:none}.branch:after,.branch:first-child:after,.branch:last-child:after{top:1.5rem;left:-1rem;width:1rem;right:auto}.children{margin-left:1rem}.cards{grid-template-columns:1fr}.endpoints{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem}.endpoints strong{max-width:100%}.endpoints strong:last-child{text-align:right}}
</style>
