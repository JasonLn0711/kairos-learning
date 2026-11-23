<script lang="ts">
  import RoleGlyph from '../../src/lib/interactive/visual/components/RoleGlyph.svelte';
  import Primitive from '../../src/lib/interactive/visual/Primitive.svelte';
  import {glyphs,isPacket,type GlyphRole,type VisualState} from '../../src/lib/interactive/visual/registry.ts';
  const roles=Object.keys(glyphs) as GlyphRole[];
  const states:VisualState[]=['idle','active','focused','warning','failed'];
</script>
<h1>角色與訊息 · Scene glyphs</h1>
<main>{#each roles as role}
<section data-gallery-role={role}><h2>{glyphs[role].label.join(' · ')}</h2>
{#each (isPacket(role)?['idle'] as const:states) as state,i}
<svg viewBox="-45 -62 90 90" width={i===0?76:i===1?44:60} aria-label={state} role="img"><RoleGlyph {role} {state} compact={i===1}/></svg>
{/each}
<svg viewBox="-45 -62 90 90" width="104" aria-label="Detail" role="img"><RoleGlyph {role} orientation="left"/></svg>
</section>{/each}
<section><h2>來源與去向 · Request origin</h2><svg viewBox="0 0 280 100" role="img" aria-label="User at browser sends a request to an application server">
<g transform="translate(28 72)"><RoleGlyph role="person" scale={.75}/></g>
<g transform="translate(74 65)"><RoleGlyph role="browser"/></g>
<Primitive kind="connector" points={[{x:102,y:65},{x:155,y:79},{x:202,y:54}]}/>
<g transform="translate(155 79)"><RoleGlyph role="request"/></g>
<g transform="translate(230 55)"><RoleGlyph role="app"/></g></svg></section></main>
<style>main{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));gap:12px}
section{border:1px solid;padding:12px;border-radius:8px}section:nth-child(even){background:#edf2ee}h2{font-size:1rem}svg{vertical-align:middle;max-width:100%}</style>
