<script lang="ts">
  import type {SourceBlock} from '$lib/concepts';
  let {block,lang='zh'}:{block:Extract<SourceBlock,{kind:'visual'}>;lang?:string}=$props();
  const items=$derived(block.visual.items);
  const protocols=$derived(block.src.includes('-protocols-'));
</script>
<figure class="ftp-smtp-diagram" class:protocols aria-label={block.visual.caption}>
  <figcaption>{block.visual.caption}</figcaption>
  {#if protocols}
    <section aria-label="FTP">
      <h3>FTP</h3>
      <div class="ftp-path">
        <div class="node"><strong>{items[0].title}</strong><p>{items[0].body}</p></div>
        <div class="channels">
          {#each [items[2],items[3]] as channel,i}
            <div class="channel" class:data={i===1}>
              <strong>{channel.title}</strong>
              <svg aria-hidden="true" viewBox="0 0 100 16" preserveAspectRatio="none"><path d="M2 8h96M10 1 2 8l8 7M90 1l8 7-8 7"/></svg>
              <p>{channel.body}</p>
            </div>
          {/each}
        </div>
        <div class="node"><strong>{items[1].title}</strong><p>{items[1].body}</p></div>
      </div>
      <div class="band"><strong>{items[4].title}</strong><p>{items[4].body}</p></div>
    </section>
    <section aria-label="SMTP">
      <h3>SMTP</h3>
      <div class="mail-path">
        {#each [5,6,7] as at,i}
          <div class="node" class:submission={i===1}><strong>{items[at].title}</strong><p>{items[at].body}</p></div>
          {#if i<2}<div class="mail-edge"><strong>TCP {items[8+i].title}</strong><svg aria-hidden="true" viewBox="0 0 100 16" preserveAspectRatio="none"><path d="M2 8h96M90 1l8 7-8 7"/></svg><p>{items[8+i].body}</p></div>{/if}
        {/each}
      </div>
      <div class="band warning"><strong>{items[10].title}</strong><p>{items[10].body}</p></div>
    </section>
  {:else}
    <ul class="evidence-cards">{#each items as item,i}<li class:done={i===1} class:unproven={i===2}><strong>{item.title}</strong>{#each item.body.split('\n') as line}<p>{line}</p>{/each}</li>{/each}</ul>
  {/if}
  <p class="reading-rule">{block.visual.description}</p>
  <a href={block.src} download>{block.downloadLabel}</a>
</figure>
<style>
  .ftp-smtp-diagram{container-type:inline-size;margin:1.5rem 0;padding:1rem;border-radius:14px;background:#f5f8fc;border:1px solid #b7c9df;color:#173450;overflow-wrap:anywhere}
  figcaption{font-size:1.2rem;font-weight:700;line-height:1.75;margin-bottom:1rem}
  .ftp-smtp-diagram p,.ftp-smtp-diagram strong,.ftp-smtp-diagram a{font-size:1rem;line-height:1.8}
  h3{margin:0 0 1rem;font-size:1.1rem;line-height:1.8}
  section{padding:1rem;border:1px solid #b7c9df;background:white;border-radius:12px;margin:1rem 0}
  p{margin:.5rem 0 0}
  .node{padding:1rem;border-radius:12px;background:#e7f0ff;text-align:center;min-width:0}
  .submission{background:#e4f3f0}
  .ftp-path,.mail-path{display:grid;gap:1rem;align-items:center}
  .channels{display:grid;gap:1rem;min-width:0}
  .channel{color:#205e96;text-align:center;padding:.5rem}
  .channel.data{color:#00766b}
  svg{display:block;width:100%;height:1rem;fill:none;stroke:currentColor;stroke-width:2}
  .mail-edge{color:#205e96;text-align:center;min-width:0}
  .mail-edge svg{transform:rotate(90deg);width:2.5rem;height:2.5rem;margin:.4rem auto}
  .mail-edge p{font-size:1rem}
  .band{padding:.75rem;margin-top:1rem;border-radius:10px;background:#ecf8f5;color:#11635d}
  .warning{background:#fff2e1;color:#885217}
  .evidence-cards{list-style:none;margin:0;padding:0;display:grid;gap:1rem}
  .evidence-cards li{padding:1rem;border:1px solid #b7c9df;border-radius:12px;background:#fff;color:#205e96;min-width:0}
  .evidence-cards strong{display:block;border-radius:8px;padding:.6rem;background:#e7f0ff}
  .evidence-cards p{margin-top:1rem}
  .evidence-cards .done{color:#11635d}.done strong{background:#e1f5ef}
  .evidence-cards .unproven{color:#885217}.unproven strong{background:#fff2e1}
  .reading-rule{padding:1rem;background:#e7edf5;border-radius:10px;margin:1rem 0}
  a{color:#174d77;text-underline-offset:.2em}
  @container(min-width:620px){.ftp-path{grid-template-columns:minmax(0,1fr) minmax(0,2fr) minmax(0,1fr)}.mail-path{grid-template-columns:minmax(0,1fr) minmax(0,.75fr) minmax(0,1fr) minmax(0,.75fr) minmax(0,1fr);gap:.6rem}.mail-path .node{padding:.65rem}.mail-edge svg{transform:none;width:100%;height:1rem}.evidence-cards{grid-template-columns:repeat(3,minmax(0,1fr))}}
  @container(max-width:350px){section{padding:.6rem}.node{padding:.7rem}}
</style>
