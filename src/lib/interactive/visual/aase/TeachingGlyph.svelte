<script lang="ts">
  import type {Glyph} from './objects.ts';
  let {kind,selected=0}: {kind:Glyph;selected?:number}=$props();
</script>
<g class="object" stroke="var(--glyph-line,#294858)" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round" fill="none">
  <ellipse cy="19" rx="23" ry="6" fill="var(--line)" stroke="none" opacity=".5"/>
  {#if kind==='sheet' || kind==='stamp'}
    <path d="m-19 10 1-28 22-6 12 8-1 28-23 6z" fill="#efdbb4"/>
    <path d="m-18-18 22-6 0 9 12-1-1 28-33 8z" fill="#fff5dd"/>
    <path d="m4-24 12 8-12 2z" fill="#ccb58a"/>
    <path d="m-12-7 12-3m-12 9 17-4"/>
    {#if kind==='stamp'}<circle cx="12" cy="11" r="10" fill="#d6eddf"/><path d="m6 11 4 4 7-9"/>{:else}<path d="m-12 6 14-3"/>{/if}
  {:else if kind==='matrix' || kind==='vector' || kind==='strip'}
    {#each Array(kind==='matrix'?4:1) as _,r}
      {#each Array(kind==='strip'?3:4) as _,c}
        <g transform={'translate('+(-23+c*11+r*2)+' '+(kind==='matrix'?-9+r*6-c*2:3-c*2)+')'}>
          <path d="m0 0 9-2 5 3-9 2z" fill={r===selected?'#e2b275':'#afcfd0'}/>
          <path d="m0 0 5 3v7l-5-3z" fill="#83aaa9"/><path d="m5 3 9-2v7l-9 2z" fill={r===selected?'#f2d7ae':'#d4e8e7'}/>
        </g>
      {/each}
    {/each}
  {:else if kind==='vault'}
    <path d="M-19-12v25c0 10 38 10 38 0v-25" fill="#95bdc2"/><ellipse cy="-12" rx="19" ry="7" fill="#d5e8e5"/>
    <path d="M-19-4c0 10 38 10 38 0m-38 9c0 10 38 10 38 0"/><circle cx="12" cy="12" r="2" fill="#fff"/>
  {:else if kind==='gate'}
    <path d="m-23 13 0-28 33-7 9 6v29l-7 2v-23l-23 5v22z" fill="#95b7b5"/>
    <path d="m-23-15 9 6 33-7-9-6z" fill="#d3e9e3"/><path d="m-14-9 33-7v6l-26 6v22l-7 1z" fill="#b4d2cc"/>
    <path d="m-6 9 17-4" stroke-dasharray="3 3"/>
  {:else if kind==='person'}
    <circle cy="-14" r="8" fill="#efd1a2"/><path d="M-15 14v-6c0-15 30-18 30-5v9l-14 6z" fill="#88b5b9"/><path d="m1 18 0-10 14-5"/>
  {:else if kind==='clock' || kind==='lens' || kind==='meter'}
    <path d="m-13-10 7-5c22-10 33 17 18 27l-7 4" fill="#91aeb5"/>
    <ellipse cy="0" rx="16" ry="17" fill="#e4efeb"/>
    {#if kind==='clock'}<path d="M0-11v12l8 5"/><circle r="2" fill="#2a5454"/>
    {:else if kind==='lens'}<path d="m10 13 9 10 5-4-10-10z" fill="#cc9b65"/><path d="M-9-3q1-7 7-8"/>
    {:else}<path d="M-11 3a11 11 0 0 1 22 0M0 4l7-9"/><circle cy="4" r="2" fill="#395c61"/>{/if}
  {:else if kind==='message'}
    <path d="m-21-8 32-8 10 6-1 24-31 7-10-7z" fill="#9abebd"/><path d="m-11-2 32-8-1 24-31 7z" fill="#d6ebe6"/><path d="m-11-2 16 10 16-18"/>
  {:else}
    <path d="m-22-10 29-9 16 9-29 10z" fill="#d9d9ec"/><path d="m-22-10 16 10v19l-16-9z" fill="#8f94b6"/><path d="m-6 0 29-10v19l-29 10z" fill="#bec3dc"/>
    {#if kind==='operator'}<path d="m2 5 11-4m-6-3v11"/>{:else}<path d="m0 5 14-5m-14 10 14-5"/><circle cx="18" cy="3" r="1" fill="#234"/>{/if}
  {/if}
</g>
