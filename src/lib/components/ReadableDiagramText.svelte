<script lang="ts">
 import {readableDiagram} from '$lib/article-reading';
 let {src,lang}:{src:string;lang:string}=$props();
 const data=$derived(readableDiagram(src,lang));
</script>
{#if data}<section class="readable-diagram-text" aria-label={lang==='zh'?'可換行圖解文字':'Reflowing diagram text'}>
 <h3>{lang==='zh'?'逐項讀圖':'Read the diagram'}</h3>
 <p>{data.description}</p>
 <p class="legend">{lang==='zh'?'先讀下方的標籤與解說，再對照原圖的箭頭、分支與群組。':'Read the labels and explanations below, then follow the arrows, branches and groups in the original drawing.'}</p>
 <ul role="list">{#each data.rows as row}<li>{#each row as text}<p>{text}</p>{/each}</li>{/each}</ul>
</section>{/if}
<style>
 section{margin:1rem 0;color:#182b40}h3{font-size:1rem;line-height:1.7;margin:.5rem 0}p{font-size:1rem;line-height:1.8;overflow-wrap:anywhere}.legend{font-size:.9rem}ul{list-style:none;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,17rem),1fr));gap:.65rem}li{border-left:3px solid #64748b;padding:.35rem .65rem;min-width:0}li p{margin:0}
</style>
