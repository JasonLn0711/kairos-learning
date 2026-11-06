<script lang="ts">
 import {onMount} from 'svelte';
 import type {SourceBlock} from '$lib/concepts';
 import {permissionBits,permissionModes} from '$lib/nfs-permissions';
 let {block,lang='zh'}:{block:Extract<SourceBlock,{kind:'visual'}>;lang?:string}=$props();
 const items=$derived(block.visual.items),mount=$derived(block.src.includes('-mount-'));
 let ready=$state(false),mode=$state(600);onMount(()=>{ready=true;});
 const bits=$derived(permissionBits(mode));
 const title=$derived(lang==='zh'?'檔案權限模式':'File permission mode');
</script>
<figure class="nfs-diagram" data-nfs={mount?'mount':'permissions'}>
 <figcaption>{block.visual.caption}</figcaption>
 {#if mount}
 <div class="mount-path">
  <div class="node client"><svg aria-hidden="true" viewBox="0 0 100 70"><rect x="20" y="10" width="60" height="40" rx="4"/><path d="M50 50v10M10 60h80"/></svg><strong>{items[0].title}</strong><p>{items[0].body}</p></div>
  <div class="edge"><strong>{items[1].title}</strong><svg class="arrow" aria-hidden="true" viewBox="0 0 100 24"><path d="M2 12H96m-12 -9 12 9 -12 9"/></svg><p>{items[1].body}</p></div>
  <div class="node server"><svg aria-hidden="true" viewBox="0 0 100 70"><rect x="25" y="5" width="50" height="60" rx="5"/><path d="M35 22h30M35 37h30"/></svg><strong>{items[2].title}</strong><p>{items[2].body}</p></div>
 </div>
 {:else}
 <label for="nfs-permission-mode">{title}</label><select id="nfs-permission-mode" bind:value={mode} disabled={!ready}>{#each permissionModes as value}<option value={value}>{value}</option>{/each}</select>
 <div class="permission-groups" role="status" aria-live="polite">{#each ['Owner','Group','Others'] as name,i}<div class="group"><strong>{name}</strong><p><code>{bits[i]}</code></p></div>{/each}</div>
 <p>{items[permissionModes.findIndex(value=>value===mode)].title}</p>
 <noscript><p>{lang==='zh'?'未啟用 JavaScript：保留 600 預設與下方全部模式對照，切換停用。':'Without JavaScript: 600 and all reference modes below remain readable; switching is disabled.'}</p></noscript>
 <ul class="mode-reference">{#each items as item}<li><strong>{item.title}</strong><p>{item.body}</p></li>{/each}</ul>
 {/if}
 <p>{block.visual.description}</p><a href={block.src} download>{block.downloadLabel}</a>
</figure>
<style>
 .nfs-diagram{container-type:inline-size;margin:1.5rem 0;padding:1rem;background:#f5f8fc;border:1px solid #b7c9df;border-radius:14px;color:#173450;overflow-wrap:anywhere}.nfs-diagram p,.nfs-diagram li,.nfs-diagram strong,.nfs-diagram a,.nfs-diagram label,.nfs-diagram select{font-size:1rem;line-height:1.8}figcaption{font-size:1.2rem;font-weight:700;line-height:1.75;margin-bottom:1rem}.mount-path{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.2fr) minmax(0,1fr);align-items:center;gap:1rem}.node{padding:1.25rem;border-radius:22px;text-align:center;min-width:0;border:2px solid #8b9cb1;background:#edf0f5}.server{border-color:#009b8b;background:#e5f5f2}.node>svg{display:block;width:5rem;height:4rem;margin:auto auto .7rem}.node svg *{fill:none;stroke:#17212c;stroke-width:4}.node p{margin:.5rem 0}.edge{text-align:center;min-width:0}.edge .arrow{display:block;width:100%;height:2rem;margin:.5rem 0}.arrow path{fill:none;stroke:#17212c;stroke-width:2;stroke-dasharray:8 5}.permission-groups{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.75rem;margin:1rem 0}.group{padding:1rem;border:1px solid #8b9cb1;text-align:center;background:#fff;border-radius:10px}.group p{margin:.5rem 0}.group code{font-size:1.4rem}.mode-reference{padding-left:1.3rem}.mode-reference p{margin:0 0 .6rem}label{display:block}select{font:inherit;max-width:100%;padding:.6rem;background:#fff;border:1px solid #60738d;color:#173450;white-space:normal}select:focus-visible,a:focus-visible{outline:3px solid #d66b00;outline-offset:3px}@container(max-width:560px){.mount-path{grid-template-columns:1fr}.edge .arrow{width:5rem;margin:1rem auto;transform:rotate(90deg)}.permission-groups{grid-template-columns:1fr}}
</style>
