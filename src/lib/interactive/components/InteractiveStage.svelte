<script lang="ts">
  import { onMount } from 'svelte';
  import {
    compactStageWidth, layoutNetwork, localMotionPath, motionAt, motionPlan, sceneLinks,
    type NetworkLayout, type Point, type SceneLayout
  } from '../geometry.ts';
  import type { Locale, Scene, SceneEdge, SceneNode } from '../model.ts';

  let {
    nodes, edges, scene, lang, playing, replay, onfinish
  }: {
    nodes: SceneNode[];
    edges: SceneEdge[];
    scene: Scene;
    lang: Locale;
    playing: boolean;
    replay: number;
    onfinish?: () => void;
  } = $props();

  const stageId = $props.id();
  const wide = $derived(layoutNetwork(nodes, edges, 'wide'));
  const compact = $derived(layoutNetwork(nodes, edges, 'compact'));
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
  let marker = $state<{ mode: SceneLayout; point: Point; waiting: boolean }>();
  let elapsed = 0;
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
      elapsed = 0;
      marker = undefined;
    }
    if (!board || reduceMotion || !visible || !playing) return;
    const plan = motionPlan(sceneLinks(network, currentScene), currentScene);
    const paths = Array.from(board.querySelectorAll<SVGPathElement>(
      `svg[data-scene-layout="${layout}"] [data-motion-leg]`
    ));
    if (paths.length !== plan.length) return;

    const lengths = paths.map(path => path.getTotalLength());
    let timestamp: number | undefined;
    let frame = requestAnimationFrame(draw);
    function draw(now: number) {
      // Ignore long gaps from hidden tabs and cap the first frame after a stall.
      elapsed += timestamp === undefined ? 0 : Math.min(50, now - timestamp);
      timestamp = now;
      const state = motionAt(plan, elapsed);
      const { x, y } = paths[state.leg].getPointAtLength(lengths[state.leg] * state.position);
      marker = { mode: layout, point: { x, y }, waiting: state.waiting };
      if (state.done) onfinish?.();
      else frame = requestAnimationFrame(draw);
    }
    return () => cancelAnimationFrame(frame);
  });
</script>

{#snippet drawStage(layout: NetworkLayout, variant: SceneLayout)}
  {@const id = stageId + '-' + variant}
  {@const cameraWidth = fittedRatio ? Math.max(layout.width, layout.height * fittedRatio) : layout.width}
  {@const cameraHeight = fittedRatio ? Math.max(layout.height, layout.width / fittedRatio) : layout.height}
  {@const cameraX = (layout.width - cameraWidth) / 2}
  {@const cameraY = (layout.height - cameraHeight) / 2}
  {@const focus = layout.nodes.find(node => node.id === scene.focus)}
  {@const links = sceneLinks(layout, scene)}
  {@const motion = links.length ? links.map(link => link.path) : focus ? [localMotionPath(focus)] : []}
  {@const active = new Map(links.map(link => [link.from + '>' + link.to, link]))}
  {@const first = links[0]}
  {@const staticPoint = first ? { x: (first.start.x + first.end.x) / 2, y: (first.start.y + first.end.y) / 2 }
    : focus && { x: focus.position.x - 21, y: focus.position.y - 50 }}
  {@const packet = marker?.mode === variant && !reduceMotion ? marker.point : staticPoint}
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
    {#if !links.length && focus}
      <path class="local-trace" d={localMotionPath(focus)} />
    {/if}
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
        <path class="shadow" d="M-45 4L0-17 45 4 0 25Z" />
        <path class="base-left" d="M-38 0L0 17V24L-38 7Z" />
        <path class="base-right" d="M0 17L38 0V7L0 24Z" />
        <path class="base-top" d="M-38 0L0-17 38 0 0 17Z" />
        <path class="entity-left" d="M-29-36L0-23V6L-29-7Z" />
        <path class="entity-right" d="M0-23L29-36V-7L0 6Z" />
        <path class="entity-top" d="M-29-36L0-49 29-36 0-23Z" />
        <g class="top-mark" transform="translate(0,-36)">
          {#if node.kind === 'browser'}
            <path d="M-11 3L1-6 10 2 3 3 1 7-3 4Z" />
          {:else if node.kind === 'dns'}
            <path d="M-10 3L0-2 10 3M0-2V-6M-10 3L-14 1M-10 3L-6 5M10 3L6 5M10 3L14 1" />
          {:else if node.kind === 'edge'}
            <path d="M-12 0H-4L2-4H9M-4 0L2 4H9M7-6L10-4 7-2M7 2L10 4 7 6" />
          {:else if node.kind === 'app'}
            <path d="M-7-2L-11 0-7 2M7-2L11 0 7 2M3-5L-3 5" />
          {:else}
            <ellipse rx="10" ry="4.5" />
            <path d="M-10 0V2C-10 8 10 8 10 2V0" />
          {/if}
        </g>
        <path class="seams" d="M-24-25L-6-17M-24-18L-6-10M6-17L24-25M6-10L24-18" />
        <path class="port" d="M-22-10L-17-8M8-4L13-6" />
        {#if focused}<path class="focus-outline" d="M-44 1L0-19 44 1 0 21Z" />{/if}
        <text
          class="entity-label"
          x={sideLabel ? 48 : 0}
          y={aboveLabel ? -62 : sideLabel ? -12 : 47}
          text-anchor={sideLabel ? 'start' : 'middle'}
        >{node.label[lang]}</text>
      </g>
    {/each}
    {#if packet}
      <circle class="packet-halo" cx={packet.x} cy={packet.y} r="11" />
      <g data-packet transform="translate({packet.x},{packet.y})">
        {#if scene.signal === 'secure'}
          <rect class="packet" x="-5" y="-1" width="10" height="8" rx="1" />
          <path class="lock-shackle" d="M-3-1V-3a3 3 0 0 1 6 0v2" />
        {:else}
          <path class="packet" d="M0-6L6 0 0 6-6 0Z" />
        {/if}
      </g>
    {/if}
  </svg>
{/snippet}

<figure class="interactive-stage" data-theme="interactive-stage" data-scene-signal={scene.signal} data-scene-focus={scene.focus}
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
  .local-trace { fill: none; stroke: var(--stage-current); stroke-width: 1.5; stroke-dasharray: 3 3; }
  .arrowhead { fill: var(--stage-current); }
  .shadow { fill: var(--stage-shadow); opacity: .15; }
  .base-left, .base-right, .base-top, .entity-left, .entity-right, .entity-top {
    stroke: var(--stage-stroke);
    stroke-linejoin: round;
    stroke-width: 1.15;
  }
  .base-left { fill: var(--stage-base-left); }
  .base-right { fill: var(--stage-base-right); }
  .base-top { fill: var(--stage-base-top); }
  .entity-left { fill: var(--stage-node-left); }
  .entity-right { fill: var(--stage-node-right); }
  .entity-top { fill: var(--stage-node-top); }
  .top-mark, .seams, .port { fill: none; stroke: var(--stage-stroke); stroke-width: 1.4; stroke-linecap: round; stroke-linejoin: round; }
  .top-mark { stroke-width: 1.9; }
  .seams { opacity: .65; }
  .port { stroke-width: 2.2; }
  .follows-route .top-mark, .focused .top-mark { stroke: var(--stage-current); }
  .focused :is(.entity-left, .entity-right, .entity-top) { stroke: var(--stage-current); stroke-width: 1.9; }
  .focus-outline { fill: none; stroke: var(--stage-current); stroke-width: 2; stroke-linejoin: round; stroke-dasharray: 3 3; }
  .entity-label { fill: var(--ink); font-size: 19px; font-weight: 590; }
  .compact-svg .entity-label { font-size: 16px; }
  .focused .entity-label { fill: var(--stage-current); font-weight: 750; }
  .packet-halo { fill: var(--stage-packet); opacity: .18; }
  .packet { fill: var(--stage-packet); stroke: var(--stage-packet-border); stroke-width: 2; }
  .lock-shackle { fill: none; stroke: var(--stage-packet); stroke-width: 2; }
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
