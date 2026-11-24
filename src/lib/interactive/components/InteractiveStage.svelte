<script lang="ts">
  import { onMount } from 'svelte';
  import {
    compactStageWidth, localMotionPath, motionPlan, sceneLinks,
    type NetworkLayout, type Point, type SceneLayout
  } from '../geometry.ts';
  import type { Locale, Scene, SceneEdge, SceneNode } from '../model.ts';

  import {createPlayback} from '../visual/playback.ts';
  import RoleGlyph from '../visual/components/RoleGlyph.svelte';
  import {networkStage} from '../visual/scene.ts';

  let {
    stepId, nodes, edges, scene, lang, playing, replay
  }: {
    stepId: string;
    nodes: SceneNode[];
    edges: SceneEdge[];
    scene: Scene;
    lang: Locale;
    playing: boolean;
    replay: number;
  } = $props();

  const stageId = $props.id();
  const wideStage = $derived(networkStage(stepId,nodes,edges,scene,lang,'wide'));
  const wide = $derived(wideStage.layout);
  const compactStage = $derived(networkStage(stepId,nodes,edges,scene,lang,'compact'));
  const compact = $derived(compactStage.layout);
  const focusLabel = $derived(nodes.find(node => node.id === scene.focus)?.label[lang] ?? '');
  const routeLabel = $derived(scene.route.map(id => nodes.find(node => node.id === id)?.label[lang]).join(' → '));
  const title = $derived(lang === 'zh' ? '請求路線圖' : 'Request route diagram');
  const description = $derived(lang === 'zh'
    ? `${scene.label[lang]}。目前焦點為${focusLabel}。路線：${routeLabel}。`
    : `${scene.label[lang]}. Current focus: ${focusLabel}. Route: ${routeLabel}.`);

  let board: HTMLDivElement;
  let mode = $state<SceneLayout>('wide');
  let fittedRatio = $state<number>();
  let visible = $state(false);
  let reduceMotion = $state(true);
  let marker = $state<{ mode: SceneLayout; point: Point; waiting: boolean; leg:number; progress:number }>();
  const playback=createPlayback();
  let previousScene: Scene | undefined;
  let previousReplay: number | undefined;

  onMount(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const fitPreference = window.matchMedia('(min-width: 1120px) and (min-height: 660px)');
    const updatePreference = () => { reduceMotion = media.matches; };
    const updateVisibility = () => { visible = document.visibilityState === 'visible'; };
    const updateLayout = () => {
      const { width, height } = board.getBoundingClientRect();
      mode = width <= compactStageWidth ? 'compact' : 'wide';
      fittedRatio = fitPreference.matches && width > 0 && height > 0 ? width / height : undefined;
    };
    const observer = new ResizeObserver(updateLayout);
    observer.observe(board);
    media.addEventListener('change', updatePreference);
    fitPreference.addEventListener('change', updateLayout);
    document.addEventListener('visibilitychange', updateVisibility);
    updatePreference();
    updateVisibility();
    updateLayout();
    return () => {
      observer.disconnect();
      media.removeEventListener('change', updatePreference);
      fitPreference.removeEventListener('change', updateLayout);
      document.removeEventListener('visibilitychange', updateVisibility);
    };
  });

  $effect(() => {
    const currentScene = scene;
    const currentReplay = replay;
    const layout = mode;
    const network = layout === 'wide' ? wide : compact;
    if (previousScene !== currentScene || previousReplay !== currentReplay) {
      previousScene = currentScene;
      previousReplay = currentReplay;
      playback.reset();
      marker = undefined;
    }
    if (!board || reduceMotion || !visible || !playing) return;
    const plan = motionPlan(sceneLinks(network, currentScene), currentScene);
    const paths = Array.from(board.querySelectorAll<SVGPathElement>(
      `svg[data-scene-layout="${layout}"] [data-motion-leg]`
    ));
    if (paths.length !== plan.length) return;

    const lengths = paths.map(path => path.getTotalLength());
    playback.pause();
    let frame = requestAnimationFrame(draw);
    function draw(now: number) {
      const state = playback.tick(now,plan,true);
      const { x, y } = paths[state.leg].getPointAtLength(lengths[state.leg] * state.position);
      marker = { mode: layout, point: { x, y }, waiting: state.waiting, leg:state.leg, progress:state.position };
      frame = requestAnimationFrame(draw);
    }
    return () => cancelAnimationFrame(frame);
  });
</script>

{#snippet drawStage(layout: NetworkLayout, variant: SceneLayout)}
  {@const id = stageId + '-' + variant}
  {@const camera = (variant === 'wide' ? wideStage : compactStage).camera}
  {@const ratio = fittedRatio ?? layout.width/layout.height}
  {@const cameraWidth = Math.max(camera.width,camera.height*ratio)}
  {@const cameraHeight = cameraWidth/ratio}
  {@const cameraX = camera.x-cameraWidth/2}
  {@const cameraY = camera.y-cameraHeight/2}
  {@const focus = layout.nodes.find(node => node.id === scene.focus)}
  {@const links = sceneLinks(layout, scene)}
  {@const motion = links.length ? links.map(link => link.path) : focus ? [localMotionPath(focus)] : []}
  {@const active = new Map(links.map(link => [link.from + '>' + link.to, link]))}
  {@const leg=links[reduceMotion?links.length-1:marker?.leg??0]}
  {@const packet=marker?.mode===variant && !reduceMotion?marker.point:reduceMotion?leg?.end:leg?.start}
  {@const returning=leg && (leg.to==='browser' || leg.from==='database' || scene.signal==='response')}
  <svg
    class:compact-svg={variant === 'compact'}
    class:wide-svg={variant === 'wide'}
    viewBox="{cameraX} {cameraY} {cameraWidth} {cameraHeight}"
    width={layout.width}
    height={layout.height}
    data-scene-layout={variant}
    role="img"
    aria-labelledby={id + '-title ' + id + '-description'}
  >
    <title id={id + '-title'}>{title}</title>
    <desc id={id + '-description'}>{description}</desc>
    <defs>
      <pattern id={id + '-grid'} patternUnits="userSpaceOnUse" width="48" height="24">
        <path class="grid-line" d="M0 12L24 0 48 12 24 24ZM0 12H48" />
      </pattern>
      <marker id={id + '-arrow'} viewBox="0 0 9 9" refX="8" refY="4.5" markerWidth="8" markerHeight="8"
        markerUnits="userSpaceOnUse" orient="auto">
        <path class="arrowhead" d="M0 0L9 4.5 0 9 2.5 4.5Z" />
      </marker>
    </defs>
    <rect class="ground" x={cameraX} y={cameraY} width={cameraWidth} height={cameraHeight} />
    <rect x={cameraX} y={cameraY} width={cameraWidth} height={cameraHeight} fill={'url(#' + id + '-grid)'} />
    {#each layout.links as link (link.id)}
      <path class="idle-link" d={link.path} />
    {/each}
    {#each [...active.values()] as link (link.from + '>' + link.to)}
      <path class="active-link" d={link.path} data-edge={link.from + '>' + link.to}
        marker-end={'url(#' + id + '-arrow)'} />
    {/each}

    {#each motion as path}
      <path data-motion-leg d={path} visibility="hidden" fill="none" />
    {/each}

    {#each layout.nodes as node (node.id)}
      {@const focused = scene.focus === node.id}
      {@const followsRoute = scene.route.includes(node.id)}
      {@const sideLabel = variant === 'compact' && node.position.x < layout.width / 2 && node.kind !== 'browser'}
      {@const aboveLabel = node.kind === 'dns' || (variant === 'compact' && node.kind === 'browser')}
      <g
        transform="translate({node.position.x},{node.position.y})"
        class="entity"
        class:focused
        class:follows-route={followsRoute}
        data-node={node.id}
        data-focused={focused}
      >
        {#if node.kind==='browser'}
          <g transform="translate(-37 2)"><RoleGlyph role="person" scale={.68}/></g>
        {/if}
        <RoleGlyph role={node.kind} state={focused?'focused':followsRoute?'active':'muted'} compact={variant==='compact'}/>
        <text
          class="entity-label" class:close-label={layout.nodes.length<=2}
          x={sideLabel ? 48 : 0}
          y={aboveLabel ? -62 : sideLabel ? -12 : 47}
          text-anchor={sideLabel ? 'start' : 'middle'}
        >{node.label[lang]}</text>
      </g>
    {/each}
    {#if !links.length && focus}
      <g aria-hidden="true" transform="translate({focus.position.x-18} {focus.position.y+22})">
        <rect width="36" height="3" rx="1.5" fill="var(--stage-grid)"/>
        <rect width={36*(reduceMotion?1:marker?.progress??0)} height="3" rx="1.5" fill="var(--stage-current)"/>
      </g>
    {/if}
    {#if packet && links.length}
      <circle class="packet-halo" cx={packet.x} cy={packet.y} r="11" />
      <g data-packet transform="translate({packet.x},{packet.y})">
        <RoleGlyph role={scene.signal==='secure'?'secure':returning?'response':scene.signal==='data'?'data':'request'} scale={.85}/>
      </g>
    {/if}
  </svg>
{/snippet}

<figure class="interactive-stage" data-renderer={wideStage.renderer} data-theme="interactive-stage" data-scene-signal={scene.signal} data-scene-focus={scene.focus}
  data-packet-state={reduceMotion ? 'static' : !playing ? 'paused' : marker?.waiting ? 'waiting' : 'playing'}>
  <div class="board" bind:this={board}>
    {@render drawStage(wide, 'wide')}
    {@render drawStage(compact, 'compact')}
  </div>
  <figcaption>
    <strong>{scene.label[lang]}</strong>
    <span>{lang === 'zh' ? '焦點為' : 'Focus on '}{focusLabel}</span>
  </figcaption>
</figure>

<style>
  /* Hallmark v2 · CS Kairos technical illustration
     Make the route legible by keeping the stage stable and preserving text at small widths. */
  [data-theme='interactive-stage'] {
    --stage-ground: #f3f2e9;
    --stage-grid: #dfe4dc;
    --stage-base-top: #d9e3db;
    --stage-base-left: #c1d0c8;
    --stage-base-right: #a9bcb2;
    --stage-node-top: #f5f8ef;
    --stage-node-left: #dce5df;
    --stage-node-right: #bbcfc7;
    --stage-stroke: #657d73;
    --stage-edge: #899e94;
    --stage-shadow: #496653;
    --stage-clay: #a54527;
    --stage-packet-border: #fffdf3;
  }
  .interactive-stage {
    --stage-packet: var(--stage-clay);
    --stage-current: var(--accent);
    margin: 0;
    min-width: 0;
    background: var(--paper);
    color: var(--ink);
    border: 1px solid var(--line);
    border-radius: .5rem;
    overflow: clip;
  }

  .board { container: request-stage / inline-size; }
  @media (min-width: 1120px) and (min-height: 660px) {
    :global(.immersive-lesson.focus) .interactive-stage { display: grid; grid-template-rows: minmax(0, 1fr) auto; }
    :global(.immersive-lesson.focus) .board { min-height: 0; background: var(--stage-ground); }
    :global(.immersive-lesson.focus) svg { height: 100%; }
  }
  svg { display: block; width: 100%; height: auto; }
  .compact-svg { display: none; }
  @container request-stage (max-width: 475px) {
    .wide-svg { display: none; }
    .compact-svg { display: block; }
  }
  .ground { fill: var(--stage-ground); }
  .grid-line { fill: none; stroke: var(--stage-grid); stroke-width: .75; }
  .idle-link { fill: none; stroke: var(--stage-edge); stroke-width: 1.4; stroke-dasharray: 3 5; }
  .active-link { fill: none; stroke: var(--stage-current); stroke-width: 2.6; }

  .arrowhead { fill: var(--stage-current); }
  .entity-label { fill: var(--ink); font-size: 19px; font-weight: 590; }
  .compact-svg .entity-label { font-size: 16px; }
  .entity-label.close-label {font-size:13px}
  .focused .entity-label { fill: var(--stage-current); font-weight: 750; }
  .packet-halo { fill: var(--stage-packet); opacity: .18; }
  [data-scene-signal='secure'] .active-link { stroke-dasharray: 5 3; }
  [data-scene-signal='response'] { --stage-current: var(--stage-clay); --stage-packet: var(--accent); }
  [data-packet-state='waiting'] .packet-halo { opacity: .33; }
  figcaption {
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: .25rem 1rem;
    padding: .65rem .85rem;
    border-top: 1px solid var(--line);
    font-size: .9rem;
    line-height: 1.5;
  }
  figcaption span { color: var(--muted); }
  @media (forced-colors: active) {
    .interactive-stage {
      --stage-ground: Canvas;
      --stage-grid: GrayText;
      --stage-base-top: Canvas;
      --stage-base-left: Canvas;
      --stage-base-right: Canvas;
      --stage-node-top: Canvas;
      --stage-node-left: Canvas;
      --stage-node-right: Canvas;
      --stage-stroke: CanvasText;
      --stage-edge: GrayText;
      --stage-current: Highlight;
      --stage-packet: Highlight;
      --stage-packet-border: Canvas;
    }
    [data-scene-signal='response'] { --stage-current: Highlight; --stage-packet: Highlight; }
    .grid-line { opacity: .2; }
  }
</style>
