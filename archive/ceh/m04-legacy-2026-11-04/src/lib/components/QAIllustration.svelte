<script lang="ts">
 import data from '$lib/qa-illustrations.json';
 let {kind,lang,sourceLabels=false}:{kind:'status'|'smb'|'kafka';lang:string;sourceLabels?:boolean}=$props();
 const d=$derived(data[lang==='zh'?'zh':'en'][kind]);
</script>
<figure class="qa-illustration" data-kind={kind}>
 <figcaption>{d.title}</figcaption>
 {#if kind==='status'}
 <div class="statuses">{#each d.nodes as n,i}<div class={'state state-'+i}><span aria-hidden="true">{['✓','⊘','?'][i]}</span><strong class:qa-source-text={sourceLabels}>{n[0]}</strong><span class:qa-source-text={sourceLabels}>{n[1]}</span></div>{/each}</div>
 {:else if kind==='smb'}
 <div class="server node"><span aria-hidden="true">▣</span><strong>{d.nodes[0][0]}</strong><span>{d.nodes[0][1]}</span></div>
 <div class="clients">{#each d.nodes.slice(1) as n}<div class="client"><p>{lang==='zh'?'檔案伺服器 ↔':'File server ↔'} {n[0]}<br/>{n[1]}</p><div class="node"><span aria-hidden="true">▱</span><strong>{n[0]}</strong></div></div>{/each}</div>
 {:else}
 <div class="events"><div class="node"><strong>{d.nodes[0][0]}</strong><span>{d.nodes[0][1]}</span></div><p class="arrow">↓ {lang==='zh'?'發布事件':'Publish event'}</p><div class="node broker"><strong>{d.nodes[1][0]}</strong><span>{d.nodes[1][1]}</span></div><div class="consumers">{#each d.nodes.slice(2) as n}<div><p class="arrow">Kafka → {n[0]}<br/>{lang==='zh'?'事件資料':'Event data'}</p><div class="node"><strong>{n[0]}</strong><span>{n[1]}</span></div></div>{/each}</div></div>
 {/if}
 <p>{d.caption}</p>
 {#if 'note' in d}<p class="note">{d.note}</p>{/if}
 <a href={'/images/ceh/m04-01-qa-'+kind+'-'+lang+'.svg'} download>{lang==='zh'?'下載 SVG 圖解':'Download SVG diagram'}</a>
</figure>
<style>
 .qa-illustration{margin:1.5rem 0;padding:1rem;border:1px solid #c8cec7;border-radius:18px;background:#f7f5ef;color:#303632;line-height:1.6}figcaption{font-weight:700;margin-bottom:1rem}.state{display:flex;flex-wrap:wrap;align-items:center;gap:.7rem;padding:1rem 0;border-bottom:1px solid #d8d8ce}.state strong{flex:1}.state-0{color:#176339}.state-1{color:#a32c2c}.state-2{color:#525953}.node{display:flex;flex-direction:column;align-items:center;text-align:center;gap:.3rem;padding:.8rem;border:1px solid #829eae;border-radius:12px;background:#e9f1f5;color:#23485b;min-width:0}.server{max-width:22rem;margin:auto}.clients,.consumers{display:grid;grid-template-columns:1fr 1fr;gap:1rem}.client p,.arrow{text-align:center;margin:.65rem 0}.broker{background:#d9eee4;color:#20553e}.note{font-size:.95rem}a{color:#1d5c49}a:focus-visible{outline:3px solid #17664b;outline-offset:3px}@media(max-width:420px){.clients,.consumers{grid-template-columns:1fr}.state{align-items:flex-start}.state strong{flex:none}.state>span:last-child{flex-basis:100%;padding-left:1.7rem}}
</style>
