<script lang="ts">
 import {onMount} from 'svelte';
 import {examplePrefix} from '$lib/m0206-network';
 let {lang}:{lang:string}=$props();
 let prefix=$state(24);
 let interactive=$state(false);
 onMount(()=>{interactive=true;});
 const range=$derived(examplePrefix(prefix));
 const zh=$derived(lang==='zh');
</script>
<section class="cidr-explorer" aria-label={zh?'CIDR 網段模擬器':'CIDR prefix explorer'}>
 <h3>{zh?'CIDR 網段模擬器':'CIDR prefix explorer'}</h3>
 <p>{zh?'固定 IPv4：':'Fixed IPv4: '}192.0.2.25</p>
 <label for="cidr-prefix">{zh?'前綴長度':'Prefix length'} <strong>/{prefix}</strong></label>
 <input id="cidr-prefix" type="range" disabled={!interactive} min="24" max="30" step="1" bind:value={prefix} aria-valuetext={`/${prefix}`} />
 <div class="ends"><span>/24</span><span>/30</span></div>
 <dl aria-live="polite"><div><dt>{zh?'所屬網段':'Containing prefix'}</dt><dd data-cidr="network">{range.network}</dd></div><div><dt>{zh?'總位址數':'Total addresses'}</dt><dd data-cidr="count">{range.count}</dd></div><div><dt>{zh?'涵蓋範圍':'Address range'}</dt><dd data-cidr="range">{range.start} – {range.end}</dd></div></dl>
 <p>2^(32 − {prefix}) = {range.count}</p>
 <p>{zh?'只計算位址範圍，不修改網路設定。無 JavaScript 時顯示 /24 預設值；可用上方表格及 Python 練習核對。':'Calculates address ranges without changing network settings. Without JavaScript, /24 remains visible; use the table and Python exercise to check other values.'}</p>
</section>
<style>
 .cidr-explorer{padding:1rem;border:1px solid #64748b;border-radius:1rem;background:#f5f8ff;margin-top:1.5rem;overflow-wrap:anywhere}h3{margin:0;font-size:1.15rem}p,dt,dd,label{font-size:1rem;line-height:1.8}input{display:block;width:100%;accent-color:#075bc5;margin:.75rem 0}.ends{display:flex;justify-content:space-between}dl{display:grid;gap:.8rem}dd{margin:0;font-weight:650}input:focus-visible{outline:3px solid #175f91;outline-offset:4px}
</style>
