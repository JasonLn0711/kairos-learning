<script lang="ts">
  import {onMount} from 'svelte';
  import {noteFigurePath,type NoteRecall} from '$lib/ceh-notes';
  import type {Locale} from '$lib/model';
  let {block,date,part,lang}:{block:NoteRecall;date:string;part:number;lang:Locale}=$props();
  let ready=$state(false), active=$state(0);
  onMount(()=>{ready=true;});
  const zh=$derived(lang==='zh');
</script>
<figure class="recall" data-figure="recall">
  <figcaption>{block.caption}</figcaption>
  {#each block.cards as card,i}
    {#if !ready || active===i}
      <section class="recall-card" aria-label={(zh?'回憶卡 ':'Recall card ')+(i+1)}>
        <p class="count" aria-live="polite">{i+1} / {block.cards.length}</p>
        <div class="prompt"><h3>{card.question}</h3><p>{zh?'先在心裡作答，再翻開答案':'Answer in your mind, then reveal the answer'}</p></div>
        <p class="references">{zh?'對應：':'References: '}{card.references}</p>
        <details><summary>{zh?'顯示答案':'Show answer'}</summary>{#each card.answer as paragraph}<p>{paragraph}</p>{/each}</details>
      </section>
    {/if}
  {/each}
  <div class="controls"><button type="button" class="secondary" disabled={!ready||active===0} onclick={()=>active-=1}>← {zh?'上一張':'Previous'}</button><button type="button" disabled={!ready||active===block.cards.length-1} onclick={()=>active+=1}>{zh?'下一張':'Next'} →</button></div>
  <p class="description">{block.description}</p>
  <a href={noteFigurePath(date,part,'recall',lang)} download>{zh?`下載全部 ${block.cards.length} 張回憶卡 SVG`:`Download all ${block.cards.length} recall cards as SVG`}</a>
</figure>
<style>
.recall{border:1px solid #d8dce0;border-radius:16px;padding:1rem;margin:1.75rem 0;background:#fbfcfd;overflow-wrap:anywhere;min-width:0}figcaption{font-size:1.125rem}.count{text-align:right;color:#515b61;margin:0;font-size:.875rem}.prompt{text-align:center;padding:3rem 1rem;min-height:150px}.prompt h3{font-size:1.125rem;line-height:1.8;margin:0}.prompt p{color:#515b61;margin:.6rem 0 0}.references{font-size:.875rem;color:#515b61}details{border:1px solid #cbd1d5;border-radius:18px;padding:.4rem 1rem}summary{text-align:center;cursor:pointer}details p{text-align:left}.controls{display:flex;justify-content:space-between;gap:1rem;margin-top:1rem}.controls button{border-radius:24px}button:disabled{opacity:.55;cursor:default}.description{color:#515b61}a{font-size:.875rem}.recall-card+.recall-card{border-top:1px solid #d8dce0;margin-top:1rem;padding-top:1rem}
@media(max-width:540px){.prompt{padding:2rem 0}}
</style>
