<script lang="ts">
  import Primitive from '../Primitive.svelte';
  import {glyphs,isPacket,type GlyphRole,type VisualState} from '../registry.ts';
  import {surfaces,type Tone} from '../tokens.ts';
  let {role,state='idle',scale=1,orientation='right',tone,label='',compact=false}:
    {role:GlyphRole;state?:VisualState;scale?:number;orientation?:'left'|'right';tone?:Tone;label?:string;compact?:boolean}=$props();
  const color=$derived(tone??glyphs[role].tone);
  const packet=$derived(isPacket(role));
</script>
<g data-glyph={role} data-state={state} opacity={state==='muted'?.68:1}
  transform="scale({orientation==='left'?-scale:scale} {scale})" role={label?'img':undefined} aria-label={label||undefined} aria-hidden={label?undefined:true}
  stroke="currentColor" fill="none" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round">
  {#if packet}
    {#if role==='secure'}
      <path d="M-4-2V-5a4 4 0 0 1 8 0v3" stroke-width="2.5"/>
      <rect x="-7" y="-2" width="14" height="10" rx="2" fill={surfaces.teal.left}/>
      <path d="M0 2v2"/>
    {:else if role==='event'}
      <path d="M0-8 8 0 0 8 -8 0Z" fill={surfaces.clay.top}/><path d="m1-4-3 5h4l-2 4"/>
    {:else if role==='data'}
      <path d="M-7-3h12v10H-7Z" fill={surfaces.violet.left}/><path d="M-4-7H8V3H-4Z" fill={surfaces.violet.top}/>
    {:else}
      <rect x="-9" y="-6" width="18" height="12" rx="2" fill={surfaces[color].top}/>
      {#if role==='request'}<path d="m-8-5 8 6 8-6"/>{:else}<path d="m-5 0 4-3m-4 3 4 3m-3-3h9"/>{/if}
    {/if}
  {:else if role==='person'}
    <Primitive kind="shadow" radius={12}/>
    <path d="m-5-16-1 16h4l3-12 2 12h4l-1-16" fill="#647c83"/>
    <path d="M-6-31q6-4 12 0l5 13-4 2-3-8v10h-9v-11l-4 8-4-2Z" fill={surfaces[color].left}/>
    <circle cy="-39" r="6.5" fill="#ebc6a4"/>
  {:else}
    <Primitive kind="shadow" radius={36}/>
    {#if role==='browser'}
      <Primitive kind="tile" width={.87} depth={.68}/>
      <path d="m-24-12 30-17 15 9-30 18Z" fill="#d7d8cf"/>
      <path d="m-24-12 30-17v-24l-30 17Z" fill="#364849"/>
      <path d="m-21-16 24-14v-18l-24 14Z" fill="#f4fbf6"/>
      <path d="m-18-30 16-9m-16 14 10-6" stroke="#6c968d" stroke-width="2"/>
      <path d="m-13-13 19-11m-14 13 18-10" stroke-width="1"/>
    {:else if role==='database'}
      <Primitive kind="cylinder" height={31} radius={24} tone={color}/>
      <path d="M-24-9a24 10 0 0 0 48 0" />
      <path d="M14-6l4-2" stroke-width="2"/>
    {:else}
      <Primitive kind="box" width={.82} depth={.72} height={role==='app'?30:24} tone={color}/>
      {#if role==='dns'}
        <g transform="translate(0 -25) scale(1 .62)"><circle r="10" fill={surfaces.clay.top}/><ellipse rx="4" ry="10"/><path d="M-10 0h20"/></g>
      {:else if role==='edge'}
        <path d="m-10-24 8-4 10 4-8 5m-6-1 6 1-1-4" stroke-width="2.2"/>
      {:else}
        <path d="m-11-31 10-5 12 6-10 5Z" fill={surfaces.teal.left}/>
      {/if}
      <path d="m-24-17 18 10m-18-4 18 10" stroke-width="2"/>
      <circle cx="8" cy="-4" r="1.7" fill="currentColor"/>
      {#if !compact}<circle cx="14" cy="-7" r="1.4" fill="currentColor"/>{/if}
    {/if}
  {/if}
  {#if state==='focused' || state==='active'}
    {#if !packet}<Primitive kind="focus" width={1.05} depth={.91}/>{/if}
  {:else if ['failed','blocked','warning','success','processing'].includes(state)}
    <g transform="translate(19 -39)"><circle r="8" fill="Canvas"/>
      {#if state==='failed'}<path d="m-3-3 6 6m0-6-6 6"/>
      {:else if state==='blocked'}<path d="M-4 0h8"/>
      {:else if state==='warning'}<path d="M0-4v4m0 3v.2"/>
      {:else if state==='success'}<path d="m-4 0 3 3 5-6"/>
      {:else}<path d="M0-4v4l3 2"/>{/if}
    </g>
  {/if}
</g>
