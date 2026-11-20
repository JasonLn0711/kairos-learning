<script lang="ts">
 import {noteDiagramSpecs,type NoteDiagram} from '#lib/note-diagrams.ts';
 let {diagram}:{diagram:NoteDiagram}=$props();
 const layout=$derived(noteDiagramSpecs[diagram.name].layout);
</script>
{#snippet message(item:NoteDiagram['items'][number],i:number)}
 <li class:reply={i===1}><strong>{item.title}</strong><p>{item.body}</p><svg aria-hidden="true" viewBox="0 0 400 24" preserveAspectRatio="none"><path d={i===1?'M398 12H5m10-8L5 12l10 8':'M2 12H395m-10-8 10 8-10 8'}/></svg></li>
{/snippet}
{#if layout==='day02b-https'}
 <div class="peers">{#each diagram.items.slice(0,2) as item}<div><strong>{item.title}</strong><p>{item.body}</p></div>{/each}</div>
 <p class="network">網際網路 · 概念連線（虛線）</p>
 <ol class="steps">{#each diagram.items.slice(2) as item}<li><strong>{item.title}</strong><p>{item.body}</p></li>{/each}</ol>
{:else if layout==='day02b-scans'}
 <div class="comparison">{#each [0,1] as column}<section><h4>{column===0?'TCP Connect Scan':'TCP SYN Scan'}</h4><p>Nmap <code>{column===0?'-sT':'-sS'}</code></p><div class="actors" aria-hidden="true"><span>Client</span><span>Server</span></div><ol class="messages">{#each diagram.items.slice(column*3,column*3+3) as item,i}{@render message(item,i)}{/each}</ol></section>{/each}</div>
{:else if layout==='day02b-udp'}
 <div class="probe"><strong>{diagram.items[0].title}</strong><p>{diagram.items[0].body}</p><p>依觀察結果分成下列四種情況</p></div>
 <ul class="branches">{#each diagram.items.slice(1) as item}<li><strong><code>{item.title}</code></strong><p>{item.body}</p></li>{/each}</ul>
{/if}
<style>
 .peers,.comparison,.branches{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem;margin:1rem 0}.peers>div,.comparison>section,.branches>li{min-width:0;padding:1rem;border:1px solid #b9c5cf;border-radius:14px;background:#f4f6f8}.peers{text-align:center;gap:20%}.peers>div{border:2px solid #94a3b8;background:#eceef1}.network{text-align:center;border-top:2px dashed #7b879a;padding-top:.5rem}.steps{list-style:none;padding:0;margin:1rem 0}.steps li{padding:1rem;text-align:center;border-radius:12px;margin:.75rem 0;background:#eceef1}.steps li:nth-child(2){background:#e5f3ec}.steps li:nth-child(3){background:#e7edfb}.steps li:nth-child(4){background:#f1e8fa}.probe{text-align:center;padding:1.5rem .5rem .5rem}.branches{list-style:none;padding:0}.branches li{background:#fbfcfd}.actors{display:flex;justify-content:space-between;border-bottom:1px dashed #94a3b8;padding:.5rem}.messages{list-style:none;padding:0}.messages li{text-align:center;color:#245fe8;padding:.75rem 0}.messages .reply{color:#00856b}.messages li:last-child{color:#7739ba}.messages p{color:#18252c}.messages svg{display:block;width:100%;height:24px;fill:none;stroke:currentColor;stroke-width:2}strong,h4{font-size:1.125rem;line-height:1.8}h4{margin:0}p{font-size:1rem;line-height:1.8;margin:.4rem 0;overflow-wrap:anywhere}code{font-size:1rem;overflow-wrap:anywhere}
 @container(max-width:36rem){.comparison,.branches,.peers{grid-template-columns:minmax(0,1fr);gap:1rem}.comparison>section,.peers>div,.branches>li{padding:.75rem}}
</style>
