<script lang="ts">
 import diagram from '$lib/qa-diagram.json';import type {Locale} from '$lib/model';let {lang}:{lang:Locale}=$props();const d=$derived(diagram[lang]);
</script>
<figure class="qa-diagram"><figcaption>{d.title}</figcaption>
 {#each d.panels as panel}<section><h4>{panel.title}</h4>{#each panel.rows as row}<p class="direction"><strong>{row[0]}</strong><span>{row[1]}</span><strong>{row[2]}</strong></p>{/each}</section>{/each}
 <p>{d.caption}</p><a href={'/images/ceh/m04-01-smb-kafka-'+lang+'.svg'} download>{d.download}</a>
</figure>
<style>.qa-diagram{margin:1.5rem 0;padding:1rem;border:1px solid #d8d8ce;border-radius:18px;background:#f7f5ef;color:#303632}figcaption{font-weight:700}section{border-top:1px solid #d8d8ce;margin-top:1rem}h4{margin:1rem 0}.direction{display:flex;flex-wrap:wrap;align-items:center;gap:.5rem;margin:.8rem 0}.direction strong{padding:.3rem .5rem;border:1px solid #b5c8bc;border-radius:6px}.direction span{color:#176339}a:focus-visible{outline:3px solid #17664b;outline-offset:3px}@media(max-width:420px){.direction{flex-direction:column;align-items:flex-start;padding-bottom:.7rem;border-bottom:1px solid #deded5}}</style>
