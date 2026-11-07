<script lang="ts">
 import type {SourceBlock} from '$lib/concepts';
 let {block,lang='zh'}:{block:Extract<SourceBlock,{kind:'visual'}>;lang?:string}=$props();
</script>
<figure class="snmp-diagram" data-snmp-diagram>
 <figcaption><strong>{block.visual.caption}</strong><p>{block.visual.description}</p></figcaption>
 <div class="manager"><svg viewBox="0 0 100 65" aria-hidden="true"><rect x="15" y="2" width="70" height="43" rx="6" fill="currentColor"/><path d="M42 45v13m16-13v13M28 60h44" stroke="currentColor" stroke-width="5"/></svg><strong>{block.visual.items[0].title}</strong></div>
 <p class="exchange">{block.visual.items[0].body}</p>
 <ul class="devices" aria-label={lang==='en'?'Parallel devices':'平行設備'}>
  {#each block.visual.items.slice(1) as item}
   <li><svg viewBox="0 0 120 40" aria-hidden="true"><rect x="2" y="2" width="116" height="36" rx="6" fill="currentColor"/><circle cx="23" cy="20" r="4" fill="#e4f3eb"/><circle cx="39" cy="20" r="4" fill="#e4f3eb"/><circle cx="55" cy="20" r="4" fill="#e4f3eb"/></svg><strong>{item.title}</strong><p>{item.body}</p></li>
  {/each}
 </ul>
 <p>{lang==='en'?'Devices are peers. GET travels from Manager to Agent; replies travel back. The shared lines represent query relationships, not physical cabling or a chain of devices.':'三種設備彼此平行。GET 從 Manager 傳到 Agent，回覆反向傳回；共同分支表示查詢關係，並非實際布線或設備先後順序。'}</p>
 <a href={block.src} download>{block.downloadLabel} — {block.visual.caption}</a>
</figure>
<style>
 .snmp-diagram{container-type:inline-size;margin:1.5rem 0;padding:1rem;border:1px solid #607d94;border-radius:16px;background:#f8fbfc;color:#183b59;overflow-wrap:anywhere}
 figcaption>strong{font-size:1.15rem}p{font-size:1rem;line-height:1.8;margin:.6rem 0 1rem}.manager{display:flex;align-items:center;flex-direction:column;gap:.5rem;max-width:25rem;margin:1.2rem auto 0;padding:1rem;background:#dceaff;border:3px solid #3977bd;border-radius:20px;text-align:center}.manager svg{width:80px;height:52px;color:#3977bd}.exchange{text-align:center;color:#183b59;font-weight:650;margin:.7rem 0}.devices{list-style:none;padding:0;margin:1.4rem 0 0;display:grid;gap:1rem}.devices li{min-width:0;padding:1rem;background:#e4f3eb;border:3px solid #458574;border-radius:20px;text-align:center;position:relative}.devices li svg{display:block;width:110px;height:37px;color:#458574;margin:0 auto .8rem}.devices li strong{display:block;font-size:1.1rem}.devices li p{margin:.6rem 0 0}.devices li::before{content:'';position:absolute;left:50%;top:-1.4rem;height:1.3rem;border-left:3px solid #607d94}a{display:inline-block;line-height:1.8}a:focus-visible{outline:3px solid #17664b;outline-offset:4px}
 @container(min-width:600px){.devices{grid-template-columns:repeat(3,minmax(0,1fr));border-top:3px solid #607d94;padding-top:1.4rem;margin-top:1.2rem;position:relative}.devices::before{content:'';position:absolute;left:50%;top:-1.2rem;height:1.2rem;border-left:3px solid #607d94}.devices li{padding:.9rem .6rem}.devices li::before{top:-1.6rem;height:1.4rem}}
 @container(max-width:599px){.devices{padding:.8rem;border:1px solid #607d94;border-radius:12px}.devices li::before{display:none}}
</style>
