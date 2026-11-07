<script lang="ts">
  import type {SourceBlock} from '$lib/concepts';
  let {block,lang='zh'}:{block:Extract<SourceBlock,{kind:'visual'}>;lang?:string}=$props();
  const stages=$derived(block.visual.kind==='flow');
  const labels=$derived(lang==='zh'?['觀察到的事情','能確定的事','不能直接推論']:['Observed','Established','Not established']);
</script>
<figure class="smb-diagram" class:stages aria-label={block.visual.caption}>
  <figcaption>{block.visual.caption}</figcaption>
  {#if stages}
    <ol class="stage-list">
      {#each block.visual.items as item,i}
        <li>
          <span class="number" aria-hidden="true">0{i+1}</span>
          <strong>{item.title}</strong>
          <p class="yes">{item.body.split('\n')[0]}</p>
          <p class="no">{item.body.split('\n')[1]}</p>
          {#if i<block.visual.items.length-1}<svg class="arrow" aria-hidden="true" viewBox="0 0 24 24"><path d="M3 12h18m-7-7 7 7-7 7"/></svg>{/if}
        </li>
      {/each}
    </ol>
  {:else}
    <div class="column-labels" aria-hidden="true">{#each labels as label}<strong>{label}</strong>{/each}</div>
    <ul class="evidence-list">
      {#each block.visual.items as item}
        <li>
          <div><span class="mobile-label">{labels[0]}</span><strong>{item.title}</strong></div>
          <div class="yes"><span class="mobile-label">{labels[1]}</span>{item.body.split('\n')[0]}</div>
          <div class="no"><span class="mobile-label">{labels[2]}</span>{item.body.split('\n')[1]}</div>
        </li>
      {/each}
    </ul>
  {/if}
  <p class="rule">{block.visual.description}</p>
  <a href={block.src} download>{block.downloadLabel}</a>
</figure>
<style>
  .smb-diagram{container-type:inline-size;margin:1.5rem 0;padding:1rem;background:#101b30;color:#e8f0ff;border:1px solid #527594;border-radius:12px;overflow-wrap:anywhere}
  figcaption{font-size:1.25rem;font-weight:700;line-height:1.7;margin-bottom:1rem}
  .smb-diagram p,.smb-diagram li,.smb-diagram strong,.smb-diagram a{font-size:1rem;line-height:1.8}
  ol,ul{list-style:none;padding:0;margin:0}
  .stage-list{display:grid;gap:2.5rem}
  .stage-list li{position:relative;min-width:0;padding:1rem;background:#1d304d;border:1px solid #527594;border-radius:12px}
  .stage-list strong{display:block;margin-bottom:1rem}
  .number{display:block;color:#8cd6ff;margin-bottom:.6rem;font-weight:700}
  .smb-diagram .yes{color:#90e8cf}
  .smb-diagram .no{color:#ffb6bf}
  .arrow{position:absolute;width:1.5rem;height:1.5rem;left:calc(50% - .75rem);bottom:-2rem;transform:rotate(90deg);fill:none;stroke:#8cd6ff;stroke-width:2}
  .column-labels{display:none}
  .evidence-list{display:grid;gap:1rem}
  .evidence-list li{display:grid;gap:.7rem;padding:1rem;background:#1d304d;border-radius:10px}
  .mobile-label{display:block;font-weight:700;color:#c5d8ed}
  .smb-diagram .rule{padding:1rem;border:1px solid #527594;border-radius:10px;color:#c5d8ed;margin:1.5rem 0 1rem}
  a{color:#8cd6ff;text-underline-offset:.2em}
  @container(min-width:680px){.stage-list{grid-template-columns:repeat(5,minmax(0,1fr));gap:1.5rem}.stage-list li{padding:.75rem}.arrow{left:auto;right:-1.5rem;bottom:50%;transform:none}}
  @container(min-width:620px){.column-labels{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1rem;margin-bottom:.75rem;color:#8cd6ff}.evidence-list li{grid-template-columns:repeat(3,minmax(0,1fr));gap:1rem}.mobile-label{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}}
</style>
