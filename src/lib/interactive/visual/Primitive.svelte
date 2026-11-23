<script lang="ts">
  import { prism, pointList, roundedPath } from './shape.ts';
  import { surfaces, type Tone } from './tokens.ts';
  import type { Point } from '../geometry.ts';
  type Kind = 'tile'|'box'|'cylinder'|'shadow'|'focus'|'label'|'grid'|'connector'|'arrow';
  let {kind, width=1, depth=1, height=12, tone='neutral', points=[], text='', radius=22}:
    {kind:Kind;width?:number;depth?:number;height?:number;tone?:Tone;points?:Point[];text?:string;radius?:number}=$props();
  const faces=$derived(prism(width,depth,kind==='tile'?4:height));
  const fill=$derived(surfaces[tone]);
  const uid=$props.id();
  const ry=$derived(radius*.42);
</script>

<g aria-hidden="true" stroke="currentColor" stroke-width="1.35" stroke-linejoin="round" stroke-linecap="round">
  {#if kind==='box' || kind==='tile'}
    <polygon points={pointList(faces.left)} fill={fill.left}/>
    <polygon points={pointList(faces.right)} fill={fill.right}/>
    <polygon points={pointList(faces.top)} fill={fill.top}/>
  {:else if kind==='cylinder'}
    <path d="M{-radius} {-height} h{2*radius} v{height} a{radius} {ry} 0 0 1 {-2*radius} 0Z" fill={fill.left}/>
    <ellipse cy={-height} rx={radius} {ry} fill={fill.top}/>
    <path d="M{-radius} {-height/2} a{radius} {ry} 0 0 0 {2*radius} 0" fill="none"/>
  {:else if kind==='shadow'}
    <ellipse cy="5" rx={radius} ry={radius*.37} fill="currentColor" opacity=".16" stroke="none"/>
  {:else if kind==='focus'}
    <polygon points={pointList(prism(width,depth,0).top)} stroke-dasharray="4 3" fill="none" stroke-width="2" vector-effect="non-scaling-stroke"/>
  {:else if kind==='label'}
    <text text-anchor="middle" stroke="none" fill="currentColor" font-size="13">{text}</text>
  {:else if kind==='grid'}
    <defs><pattern id={uid+'-grid'} width="48" height="28" patternUnits="userSpaceOnUse"><path d="M0 14 24 0 48 14 24 28Z" fill="none" opacity=".11"/></pattern></defs>
    <rect x="-48" y="-48" width="96" height="96" fill={'url(#'+uid+'-grid)'} stroke="none"/>
  {:else if kind==='connector'}
    <defs><marker id={uid+'-end'} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M1 1 9 5 1 9 3 5Z" fill="currentColor"/></marker></defs>
    <path d={roundedPath(points,4)} fill="none" marker-end={'url(#'+uid+'-end)'} vector-effect="non-scaling-stroke"/>
  {:else}
    <path d="M-5-4 4 0 -5 4 -3 0Z" fill="currentColor"/>
  {/if}
</g>
