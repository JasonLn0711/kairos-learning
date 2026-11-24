<script lang="ts">
  import TeachingGlyph from './TeachingGlyph.svelte';
  import {objects} from './objects.ts';
  let {name,selected=0}:{name:string;selected?:number}=$props();
  const family=$derived(objects[name].glyph);
</script>

<g data-instrument={name} stroke="#355452" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  {#if name==='mask'}
    <g transform="matrix(1,-.2,.34,.84,-24,-12)">
      {#each [0,1,2] as row}{#each [0,1,2] as col}
        <g transform={'translate('+col*14+' '+row*14+')'}>
          <rect width="13" height="13" fill={col<=row?'#b8dfd1':'#f1dcbd'}/>
          <path d={col<=row?'m3 7 3 3 4-6':'m4 4 5 5m0-5-5 5'} fill="none"/>
        </g>
      {/each}{/each}
    </g>
  {:else if ['trace','event','logs','telemetry','metric','observed'].includes(name)}
    <path d="m-24-13 40-6 8 5-41 7z" fill="#bfd3ca"/>
    <path d="m-24-13 7 6v28l-7-6z" fill="#8fb0a6"/>
    <g transform="matrix(1,-.15,0,1,-17,-7)">
      <rect width="41" height="28" rx="2" fill="#f1f6e9"/>
      {#if name==='metric'}<path d="m4 21 9-4 6 1 8-12 9 4" fill="none"/>
      {:else if name==='trace' || name==='telemetry'}
        <path d="M5 6h25M11 14h13M20 21h15" stroke="#477e74" stroke-width="4"/>
        <path d="M9 8v6h2m6 2v5h3" fill="none"/>
      {:else}{#each [6,13,20] as y}<circle cx="6" cy={y} r="1.5"/><path d={'M12 '+y+'h21'} fill="none"/>{/each}{/if}
    </g>
  {:else if ['workflow','plan','orchestration','decision','policy'].includes(name)}
    <g transform="matrix(1,-.17,.15,1,0,0)">
      <rect x="-25" y="-15" width="48" height="33" rx="3" fill="#94b1ad"/>
      <rect x="-23" y="-19" width="48" height="33" rx="3" fill="#ecf1dd"/>
      <path d="M-14-2h7m12 0h4v-9h6M9-2v9h6" fill="none"/>
      <circle cx="-17" cy="-2" r="3" fill="#77b8aa"/>
      <path d="m-7-2 6-6 6 6-6 6z" fill="#e4ba77"/>
      <rect x="14" y="-13" width="6" height="5" fill="#b3d4c4"/><rect x="14" y="5" width="6" height="5" fill="#dcb496"/>
    </g>
  {:else if ['agent','model','runtime','host','execution','sandbox','workspace'].includes(name)}
    <path d="m-24-15 38-6 8 6-39 7z" fill="#d4d5e5"/><path d="m-24-15 7 7v26l-7-7z" fill="#9098b8"/>
    <g transform="matrix(1,-.17,0,1,-17,-8)">
      <rect width="39" height="26" rx="2" fill="#dce6e6"/>
      {#if name==='model' || name==='agent'}
        <path d="m7 7 12 5L7 20m12-8 11-6m-11 6 11 8" fill="none"/>
        {#each [[7,7],[7,20],[19,12],[30,6],[30,20]] as p}<circle cx={p[0]} cy={p[1]} r="2.5" fill="#739e99"/>{/each}
      {:else if name==='sandbox' || name==='workspace'}
        <rect x="5" y="4" width="29" height="18" rx="2" fill="none" stroke-dasharray="3 2"/><path d="M11 11h5l2 2h8v6H11z" fill="#e7c898"/>
      {:else}<path d="m6 7 5 4-5 4m9 1h8"/><circle cx="32" cy="6" r="2" fill="#7eb69a"/>{/if}
    </g>
  {:else if ['keyCache','valueCache','cache','memory','archive','retrieval'].includes(name)}
    {#each [10,0,-10] as y,i}
      <g transform={'translate(0 '+y+')'}>
        <path d="m-22-3 27-8 17 6-28 8z" fill="#d4e6df"/><path d="m-22-3 16 6v6l-16-6z" fill="#83a9a5"/>
        <path d="m-6 3 28-8v6L-6 9z" fill={i===selected?'#efc38d':'#b9d8d0'}/>
      </g>
    {/each}
  {:else if ['allow','deny','stop','verification','schema','authorization'].includes(name)}
    <TeachingGlyph kind="gate"/>
    <circle cx="8" cy="6" r="10" fill={['deny','stop'].includes(name)?'#f4cfb7':'#eaf2dd'}/>
    <path d={['deny','stop'].includes(name)?'M3 6h10':name==='authorization'?'M5 6a3 3 0 1 1 1 3l-4 4m1-1 2 1':name==='schema'?'m5 2-3 4 3 4m6-8 3 4-3 4':'m2 6 4 4 7-9'} fill="none"/>
  {:else if ['requestId','taskId','dedup'].includes(name)}
    <path d="m-22-6 11-9 31 1 2 22-32 4z" fill="#91aea9"/>
    <path d="m-23-9 11-9 31 1 2 22-32 4z" fill="#f6e1bc"/><circle cx="-13" cy="-5" r="2"/>
    <path d="M-5-10v13m4-14v13m5-14V1m3-14V0m5-14v13" stroke-width="2"/>
  {:else}
    <TeachingGlyph kind={family} {selected}/>
  {/if}
</g>
