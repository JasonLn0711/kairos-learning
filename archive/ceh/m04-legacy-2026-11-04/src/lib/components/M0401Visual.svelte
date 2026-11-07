<script lang="ts">
 import visuals from '$lib/m0401-visuals.json';
 let {id,lang}:{id:keyof typeof visuals;lang:string}=$props();
 const spec=$derived(visuals[id]);const d=$derived(spec[lang==='zh'?'zh':'en']);const zh=$derived(lang==='zh');
 const actions=$derived(zh?['監控程式觀察文件','消費 document.uploaded','完成事件']:['Watcher observes the file','Consume document.uploaded','Completion event']);
</script>
{#snippet icon(kind:number)}
 <svg class="icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
 {#if kind===0}<rect x="3" y="3" width="18" height="13" rx="2"/><path d="M8 21h8M12 16v5"/>
 {:else if kind===1}<path d="M3 7V4h6l3 3h9v14H3V7Zm0 4h18"/>
 {:else if kind===2}<path d="M7 11V7a5 5 0 0 1 10 0v4"/><rect x="4" y="11" width="16" height="11" rx="2"/><path d="M12 15v3"/>
 {:else}<rect x="3" y="2" width="18" height="8" rx="2"/><rect x="3" y="14" width="18" height="8" rx="2"/><path d="M7 6h3M7 18h3"/>{/if}
 </svg>
{/snippet}
{#snippet node(item:{title:string;body:string},i:number)}
 <div class="node">{@render icon(i%4)}<div><strong>{item.title}</strong><p>{item.body}</p></div></div>
{/snippet}
<section class="visual-supplement" data-visual={id}>
 <h4>{zh?'輔助圖解：':'Visual aid: '}{d.title}</h4>
 <figure>
  <figcaption>{d.caption}</figcaption>
  {#if id==='permissions'}
   <div class="permission-pair">{#each d.items.slice(0,2) as item,i}<div>{@render node(item,i+1)}</div>{/each}</div>
   <p class="arrow">↓ {zh?'兩層共同影響本次結果':'Both layers contribute to this result'}</p><div class="outcome">{@render node(d.items[2],2)}</div>
  {:else if id==='unc'}
   <div class="path-parts">{#each d.items as item}<div class="path-part"><code>{item.title}</code><span class="bracket" aria-hidden="true">└────┘</span><p>{item.body}</p></div>{/each}</div>
  {:else if id==='smb-process'}
   <div class="lane-head"><strong>{zh?'用戶端':'Client'}</strong><strong>{zh?'檔案伺服器':'File server'}</strong></div>
   <ol class="sequence">{#each d.items as item,i}<li><div class="phase"><strong>{item.title}</strong><p>{item.body}</p></div>
    {#if i===3}<div class="server-check">{zh?'伺服器檢查':'Server checks'} ↓</div>{:else}<div class="exchange" aria-label={zh?'雙向交換':'Two-way exchange'}><span>←</span><span class="rule"></span><span>→</span></div>{/if}
   </li>{/each}</ol>
  {:else if id==='roles'}
   <div class="protocol">{@render node(d.items[0],0)}</div>
   <div class="roles">{#each d.items.slice(1) as item,i}<div><p class="arrow">↑ SMB · {i===0?(zh?'實作':'Implements'):(zh?'可支援':'Can support')}</p>{@render node(item,i+1)}</div>{/each}</div>
  {:else if id==='document-flow'}
   <ol class="flow">{#each d.items as item,i}<li>{@render node(item,i)}{#if i<d.items.length-1}<p class="arrow">↓ {actions[i]}</p>{/if}</li>{/each}</ol>
  {:else}
   <ul class="relations">{#each d.items as item,i}<li>
    <div class="subject">{@render icon(i%4)}<strong>{item.title}</strong></div>
    <span class="relation">→ <span>{id==='questions'?(zh?'問':'Ask'):id==='protocols'?(zh?'查詢':'Query'):(zh?'核對':'Check')}</span></span>
    <p>{item.body}</p>
   </li>{/each}</ul>
  {/if}
  <a href={'/images/ceh/m04-01-'+id+'-'+lang+'.svg'} download>{zh?'下載 SVG 圖解':'Download SVG diagram'} — {d.title}</a>
 </figure>
</section>
<style>
 .visual-supplement{margin:1.2rem 0;border:1px solid #778d80;border-radius:16px;background:#f7f5ef;color:#303632;padding:1rem}h4{font-weight:650;line-height:1.6}a:focus-visible{outline:3px solid #17664b;outline-offset:3px}figure{margin:1rem 0 0}figcaption{line-height:1.7;margin-bottom:1rem;overflow-wrap:anywhere}.icon{width:24px;height:24px;flex-shrink:0;color:#24553c}.node{display:flex;align-items:center;gap:.8rem;min-width:0;padding:1rem;background:#fffef9;border:1px solid #778d80;border-radius:12px}.node p,.phase p{margin:.35rem 0 0;line-height:1.65;overflow-wrap:anywhere}strong{overflow-wrap:anywhere}.arrow{text-align:center;color:#24553c;font-size:.9rem;margin:.55rem 0}.permission-pair,.roles{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem}.outcome .node,.protocol .node{background:#e8f0ef;justify-content:center}.path-parts{display:flex;gap:.5rem;justify-content:center;flex-wrap:wrap}.path-part{text-align:center;min-width:0;flex:1;padding:.8rem;border-radius:10px;background:#fffef9;border:1px solid #778d80}.path-part code{white-space:normal;overflow-wrap:anywhere;background:transparent;color:#17553c;font-size:1rem}.path-part p{font-size:.9rem;margin:.3rem 0}.bracket{display:block;color:#24553c}.flow,.sequence,.relations{list-style:none;padding:0;margin:1rem 0}.flow li,.sequence li{margin:0}.flow li:nth-child(2) .node{background:#e8f0ef}.lane-head{display:flex;justify-content:space-between;gap:1rem;padding:.75rem;background:#e8f0ef;border-radius:10px}.sequence{border-left:2px solid #778d80;border-right:2px solid #778d80;padding:0 1rem}.sequence li{padding:.7rem 0}.phase{text-align:center;padding:.7rem;border:1px solid #778d80;border-radius:10px;background:#fffef9}.exchange{display:flex;align-items:center;color:#24553c;gap:.2rem}.rule{height:1px;background:#778d80;flex:1}.server-check{text-align:right;color:#24553c;margin:.3rem 0;font-size:.9rem}.relations{display:grid;gap:.8rem}.relations li{display:grid;grid-template-columns:minmax(0,1fr) 4rem minmax(0,1.3fr);gap:.7rem;align-items:center;margin:0;padding:.9rem;border:1px solid #778d80;border-radius:12px;background:#fffef9}.subject{display:flex;align-items:center;gap:.6rem;min-width:0}.relation{color:#24553c;text-align:center;font-size:.85rem}.relation span{display:block}.relations p{margin:0;line-height:1.65;overflow-wrap:anywhere}a{color:#17553c;display:inline-block;margin-top:.85rem;overflow-wrap:anywhere}@media(max-width:540px){.visual-supplement{padding:.8rem}.permission-pair,.roles{grid-template-columns:1fr}.relations li{grid-template-columns:minmax(0,1fr);gap:.3rem}.relation{text-align:left}.relation span{display:inline}.path-part{flex-basis:100%}.sequence{padding:0 .65rem}}
</style>
