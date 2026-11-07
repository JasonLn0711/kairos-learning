<script lang="ts">
  import diagrams from '$lib/m0403-diagrams.json';
  type Row={from:string;to:string;label:string;channel:string};
  type Panel={title:string;rows:Row[];note:string};
  type Spec={title:string;caption:string;rows?:Row[];panels?:Panel[]};
  let { id, lang='zh' }: {id:'login'|'download'|'modes';lang?:string}=$props();
  const spec=$derived(diagrams[lang==='zh'?'zh':'en'][id] as Spec);
</script>

{#snippet lane(rows:Row[])}
  <div class="endpoints" aria-hidden="true">
    <span><svg viewBox="0 0 40 32"><rect x="7" y="3" width="26" height="19" rx="2"/><path d="M3 28h34l-4-6H7z"/></svg>Client</span>
    <span><svg viewBox="0 0 40 32"><rect x="10" y="2" width="20" height="28" rx="3"/><path d="M10 11h20M10 21h20M14 7h2M14 16h2M14 26h2"/></svg>Server</span>
  </div>
  <ol class="sequence">
    {#each rows as row}
      <li class:data-lane={row.channel.includes('data connection') || row.channel.includes('資料連線')}>
        <span class="channel">{row.channel}</span><strong>{row.label}</strong>
        <div class="route" aria-label={row.from+' → '+row.to}><span>Client</span><span class="arrow" aria-hidden="true">{row.from==='Client'?'⟶':'⟵'}</span><span>Server</span></div>
      </li>
    {/each}
  </ol>
{/snippet}
<figure data-ftp-diagram={id} aria-labelledby={'ftp-figure-'+id}>
  <figcaption><strong id={'ftp-figure-'+id}>{spec.title}</strong><p>{spec.caption}</p></figcaption>
  <div class="diagram-body">
    {#if spec.panels}<div class="modes">{#each spec.panels as panel}<section><h4>{panel.title}</h4>{@render lane(panel.rows)}<p>{panel.note}</p></section>{/each}</div>
    {:else if spec.rows}{@render lane(spec.rows)}{/if}
  </div>
  <a href={'/images/ceh/m04-03-'+id+'-'+lang+'.svg'} download>{lang==='zh'?'下載 SVG 圖解':'Download SVG diagram'} — {spec.title}</a>
</figure>
<style>
  figure{margin:1.5rem 0;padding:clamp(.7rem,3vw,1.4rem);background:#f7f5ef;border:1px solid #8c9e92;border-radius:14px;color:#303632;min-width:0;overflow-wrap:anywhere}
  figcaption strong{font-size:1.1rem}p{line-height:1.7}
  .endpoints{display:flex;justify-content:space-between;padding:.6rem 1rem}.endpoints span{display:grid;text-align:center;font-weight:650;gap:.2rem}.endpoints svg{width:42px;height:34px;fill:none;stroke:#416b82;stroke-width:2}
  .sequence{list-style:none;padding:0;margin:0}.sequence li{padding:.6rem;margin:.4rem 0;border:1px solid #b2c0b7;border-radius:8px;background:#fff;text-align:center}
  .sequence .data-lane{background:#e8eef7;border-color:#8395b3}.channel{display:block;font-size:.78rem;color:#47574e}.sequence strong{display:block;font-size:.95rem;line-height:1.5}
  .route{display:flex;align-items:center;justify-content:space-between;gap:.4rem;font-size:.8rem}.arrow{font-size:2rem;line-height:1;color:#476195;flex:1}.modes{display:grid;gap:1rem}.modes section{min-width:0;border-top:1px solid #b2c0b7}.modes h4{margin-bottom:.5rem}a{display:inline-block;margin-top:.8rem;color:#24553c}
  @media(min-width:700px){.modes{grid-template-columns:1fr 1fr}}
</style>
