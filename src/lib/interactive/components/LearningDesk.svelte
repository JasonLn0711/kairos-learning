<script lang="ts">
  import { onMount, tick } from "svelte";
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import { localized } from "#lib/model.ts";
  import { sceneAt, explanationAt, type Locale, type InteractiveLessonData } from "../model.ts";
  import type { Concept } from "../aase/model.ts";
  import type { Snapshot } from "../chapter/frame.ts";
  import InteractiveFrame from "./InteractiveFrame.svelte";
  import InteractiveStage from "./InteractiveStage.svelte";
  import LearningStage from "./LearningStage.svelte";
  import ChapterChart from "../chapter/ChapterChart.svelte";
  import "./learning-desk.css";

  type Group = {
    id: string;
    title: string;
    href: string;
    items: { title: string; href: string }[];
  };
  type Chapter = {
    id: string;
    title: string;
    summary: string;
    sourceHref: string;
    units: Concept[];
  };
  type Mode = "learn" | "practice" | "lab" | "notes";
  let {
    lang,
    directory,
    lesson,
    chapter,
    home = false,
  }: {
    lang: Locale;
    directory: Group[];
    lesson?: InteractiveLessonData | null;
    chapter?: Chapter;
    home?: boolean;
  } = $props();
  const zh = $derived(lang === "zh");
  const tr = (cn: string, en: string) => (lang === "zh" ? cn : en);
  const group = $derived(directory.find((g) => g.id === (chapter?.id ?? lesson?.id)));
  const path = $derived(
    home
      ? "/interactive/"
      : chapter
        ? "/interactive/aase/m02/" + chapter.id + "/"
        : "/interactive/system-design/" + lesson?.id + "/",
  );
  const title = $derived(
    chapter?.title ?? lesson?.title[lang] ?? tr("互動學習", "Interactive learning"),
  );
  const summary = $derived(chapter?.summary ?? lesson?.summary[lang] ?? title);
  let ready = $state(false),
    reduced = $state(false),
    paused = $state(false),
    replay = $state(0),
    reset = $state(0);
  let dark = $state(false);
  let panel = $state<"canvas" | "directory" | "detail">("canvas");
  let search: HTMLDialogElement,
    searchField: HTMLInputElement,
    query = $state("");
  let answer = $state<number>(),
    submitted = $state<number>();
  let dnsCached = $state(false),
    dbSlow = $state(false);
  let snapshot = $state<{ key: string; value: Snapshot }>();
  const url = $derived(page.shallow?.url ?? page.url);
  const hash = $derived(ready ? url.hash.slice(1) : "");
  const mode = $derived(
    (ready && ["practice", "lab", "notes"].includes(url.searchParams.get("mode") ?? "")
      ? url.searchParams.get("mode")
      : "learn") as Mode,
  );
  const modes: Mode[] = ["learn", "practice", "lab", "notes"];
  const names = $derived({
    learn: tr("學習", "Learn"),
    practice: tr("練習", "Practice"),
    lab: tr("設計實驗室", "Design Lab"),
    notes: tr("速查表", "Cheatsheets"),
  });
  const rows = $derived(
    chapter?.units.flatMap((unit, i) =>
      unit.scenes.map((scene, j) => ({ unit, scene, i, j, key: unit.slug + "-" + scene.id })),
    ) ?? [],
  );
  const requestedStep = $derived(ready ? Number(url.searchParams.get("step")) : 1);
  const index = $derived(
    chapter
      ? rows.findIndex((s) => s.key === hash)
      : Number.isInteger(requestedStep) &&
          requestedStep >= 1 &&
          requestedStep <= (lesson?.steps.length ?? 0)
        ? requestedStep - 1
        : 0,
  );
  const row = $derived(rows[Math.max(0, index)]);
  const step = $derived(lesson?.steps[Number.isInteger(index) ? index : 0] ?? lesson?.steps[0]);
  const drawing = $derived(step ? sceneAt(step, { dnsCached, dbSlow }) : undefined);
  const note = $derived(step ? explanationAt(step, lang, { dnsCached, dbSlow }) : undefined);
  const count = $derived(chapter ? rows.length : (lesson?.steps.length ?? 0));
  const lessonCount = $derived(chapter && index >= 0 ? row.unit.scenes.length : count);
  const lessonPosition = $derived(chapter && index >= 0 ? row.j + 1 : index + 1);
  const quiz = $derived(row?.unit.check ?? lesson?.check);
  const sceneTitle = $derived(
    chapter ? (index < 0 ? title : row.scene.title[lang]) : (step?.title[lang] ?? title),
  );
  const key = $derived(row?.key ?? step?.id ?? "");
  const view = $derived(hash === "poster" ? "poster" : index < 0 ? "chapter" : "scene");
  const timeline = $derived(
    chapter
      ? index < 0
        ? chapter.units.map((u, i) => ({
            label: u.title[lang],
            target: rows.findIndex((r) => r.i === i),
          }))
        : row.unit.scenes.map((s, j) => ({ label: s.title[lang], target: index - row.j + j }))
      : (lesson?.steps.map((s, i) => ({ label: s.title[lang], target: i })) ?? []),
  );
  const hits = $derived(
    directory
      .flatMap((g) => g.items.map((item) => ({ ...item, group: g.title })))
      .filter((item) =>
        (item.group + " " + item.title).toLowerCase().includes(query.trim().toLowerCase()),
      ),
  );
  onMount(() => {
    ready = true;
    try {
      dark = localStorage.getItem("learning-desk-theme") === "dark";
    } catch {
      /* Storage is optional. */
    }
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => (reduced = media.matches);
    update();
    media.addEventListener("change", update);
    if (location.hash === "#aase") panel = "directory";
    try {
      const transfer = JSON.parse(sessionStorage.getItem("desk-language") ?? "null");
      if (transfer?.url === location.href) {
        dnsCached = transfer.dnsCached === true;
        dbSlow = transfer.dbSlow === true;
        panel = transfer.panel ?? "canvas";
      }
      sessionStorage.removeItem("desk-language");
    } catch {
      /* Use the default scenario. */
    }
    return () => media.removeEventListener("change", update);
  });
  $effect(() => {
    void key;
    answer = undefined;
    submitted = undefined;
  });
  function transferLanguage(e: MouseEvent) {
    try {
      sessionStorage.setItem(
        "desk-language",
        JSON.stringify({
          url: (e.currentTarget as HTMLAnchorElement).href,
          dnsCached,
          dbSlow,
          panel,
        }),
      );
    } catch {
      /* The link works without storage. */
    }
  }
  function toggleTheme() {
    dark = !dark;
    try {
      localStorage.setItem("learning-desk-theme", dark ? "dark" : "light");
    } catch {
      /* Storage is optional. */
    }
  }
  function moveTo(next: URL) {
    void goto(next, { shallow: true, reset: false });
  }
  function go(i: number) {
    if (i < 0 || i >= count) return;
    const next = new URL(location.href);
    if (chapter) next.hash = rows[i].key;
    else next.searchParams.set("step", String(i + 1));
    moveTo(next);
  }
  function setMode(m: Mode) {
    panel = "canvas";
    const next = new URL(location.href);
    if (m === "learn") next.searchParams.delete("mode");
    else next.searchParams.set("mode", m);
    if (chapter && m === "lab" && (index < 0 || !(row.scene.demo || row.scene.choices))) {
      next.hash = (
        rows.find((r) => r.i === row.i && (r.scene.demo || r.scene.choices)) ??
        rows.find((r) => r.scene.demo || r.scene.choices) ??
        rows[0]
      ).key;
    }
    moveTo(next);
  }
  function overview(poster: boolean) {
    const next = new URL(location.href);
    next.hash = poster ? "poster" : "";
    moveTo(next);
  }
  async function find() {
    query = "";
    search.showModal();
    await tick();
    searchField.focus();
  }
  function keys(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (!search.open) void find();
      return;
    }
    if (
      search.open ||
      e.metaKey ||
      e.ctrlKey ||
      e.altKey ||
      e.shiftKey ||
      e.defaultPrevented ||
      !(e.target instanceof Element) ||
      e.target.closest("input,select,button,a,textarea,summary,fieldset")
    )
      return;
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      go(index + (e.key === "ArrowRight" ? 1 : -1));
    }
  }
  const other = $derived(localized(path, zh ? "en" : "zh") + (ready ? url.search + url.hash : ""));
</script>

{#snippet stepActions()}
  <div class="desk-actions">
    <button disabled={index <= 0} onclick={() => go(index - 1)}>← {tr("上一步", "Back")}</button>
    {#if chapter && index === count - 1 && directory[directory.findIndex((g) => g.id === chapter?.id) + 1]}<a
        class="forward"
        href={directory[directory.findIndex((g) => g.id === chapter?.id) + 1].href}
        >{tr("下一章", "Next chapter")} →</a
      >
    {:else if index === count - 1}<button class="forward" onclick={() => setMode("practice")}
        >{names.practice} →</button
      >
    {:else}<button class="forward" onclick={() => go(index + 1)}
        >{chapter && index >= 0 && rows[index + 1].i !== row.i
          ? tr("下一概念", "Next concept")
          : tr("下一步", "Next")} →</button
      >{/if}
  </div>
{/snippet}
<svelte:window onkeydown={keys} />
<InteractiveFrame bare {lang} {path} {title} description={summary}>
  <main
    class="learning-desk"
    id="main"
    tabindex="-1"
    class:dark
    data-pane={panel}
    data-mode={mode}
    data-step={index + 1}
  >
    <header class="desk-bar">
      <a
        class="desk-brand"
        href={localized("/interactive/", lang)}
        aria-labelledby="desk-brand-name desk-brand-home"
      >
        <svg width="32" height="32" viewBox="0 0 36 34" aria-hidden="true">
          {#each [[3, 16, "#a9c4e1"], [17, 16, "#b8c993"], [10, 4, "#e3c58c"]] as c}<g
              transform={"translate(" + c[0] + " " + c[1] + ")"}
              stroke="#292a22"
              stroke-width="1.3"
              stroke-linejoin="round"
              ><path d="m0 4 7-4 7 4v8l-7 4-7-4z" fill={String(c[2])} /><path
                d="m0 4 7 4 7-4m-7 4v8"
                fill="none"
              /></g
            >{/each}
        </svg><span id="desk-brand-name">Kairos <b>Learn</b></span>
        <span id="desk-brand-home" class="sr-only">{tr("互動學習首頁", "interactive learning home")}</span>
      </a>
      <a class="desk-return" href={localized("/", lang)}>
        <span aria-hidden="true">←</span> {tr("課程首頁", "Course home")}
      </a>
      <nav class="desk-modes" aria-label={tr("學習模式", "Learning modes")}>
        {#each modes as m, i}<button aria-pressed={mode === m} onclick={() => setMode(m)}
            ><span aria-hidden="true">{["◫", "◇", "▱", "▤"][i]}</span> {names[m]}</button
          >{/each}
      </nav>
      <button
        class="desk-find"
        onclick={find}
        aria-label={tr("搜尋課程與概念", "Search lessons and concepts")}
        >⌕ <span>{tr("搜尋課程與概念", "Search lessons & concepts")}</span> <kbd>⌘ K</kbd></button
      >
      <button
        class="theme-switch"
        aria-label={tr("切換明暗外觀", "Toggle color theme")}
        aria-pressed={dark}
        onclick={toggleTheme}>{dark ? "☀" : "☾"}</button
      >
      <a
        class="language"
        hreflang={zh ? "en" : "zh-Hant"}
        onclick={transferLanguage}
        href={other}
        data-sveltekit-reload>{zh ? "EN" : "繁中"}</a
      >
    </header>
    <nav class="pane-switch" aria-label={tr("切換欄位", "Workspace panels")}>
      {#each ["directory", "canvas", "detail"] as p, i}<button
          aria-pressed={panel === p}
          onclick={() => (panel = p as typeof panel)}
          >{[tr("目錄", "Directory"), tr("圖解", "Diagram"), tr("步驟說明", "Step notes")][
            i
          ]}</button
        >{/each}
    </nav>
    <div class="desk-layout">
      <nav class="desk-directory" aria-label={tr("課程目錄", "Lessons directory")} id="aase">
        <div class="desk-cap">
          <strong>▰ {tr("課程目錄", "Lessons directory")}</strong><span
            >{directory.reduce((n, g) => n + g.items.length, 0)} {tr("課", "lessons")}</span
          >
        </div>
        <div class="tree">
          {#each directory as g, i}
            <details open={g.id === group?.id}>
              <summary
                ><span
                  class="folder"
                  style={"--folder:" +
                    ["#ddbf75", "#9cbba0", "#abc2e1", "#c4b4da", "#ddb1a0", "#a6c8c5", "#d8b0bb"][
                      i % 7
                    ]}
                ></span><b>{g.id.startsWith("m02") ? g.id.toUpperCase() : "01."}</b>
                {g.title}<small>{g.items.length}</small></summary
              >
              <div>
                {#if g.id.startsWith("m02")}<a
                    class:current={g.id === group?.id && index < 0}
                    href={g.href}
                    onclick={() => (panel = "canvas")}>{tr("章節全貌", "Chapter overview")}</a
                  >{/if}
                {#each g.items as item}<a
                    class:current={g.id === group?.id &&
                      (!chapter || (index >= 0 && item.href.endsWith("#" + row.unit.slug + "-01")))}
                    href={item.href}
                    onclick={() => (panel = "canvas")}
                    ><span aria-hidden="true">▧</span> {item.title}</a
                  >{/each}
              </div>
            </details>
          {/each}
        </div>
        <div class="desk-progress">
          <span
            >{chapter
              ? tr("本章進度", "Chapter position")
              : tr("本課進度", "Lesson position")}</span
          ><b>{Math.max(0, index + 1)} / {count}</b><progress
            max={count || 1}
            value={Math.max(0, index + 1)}
          ></progress>
        </div>
      </nav>
      <section class="desk-center">
        <div class="desk-heading">
          <div class="desk-eyebrow">
            {chapter ? chapter.id.toUpperCase() : "01. " + tr("網路基礎", "Networking")}
            <span>/</span>
            {chapter && index >= 0
              ? tr("概念", "Concept") + " " + (row.i + 1) + " / " + chapter.units.length
              : names[mode]}
          </div>
          <div class="title-line">
            <h1>{chapter && index >= 0 ? row.unit.title[lang] : title}</h1>
            <span class="count-chip">{lessonCount} {tr("幕", "steps")}</span>
          </div>
          <p>{chapter && index >= 0 ? row.unit.objective[lang] : summary}</p>
        </div>
        {#if mode === "learn" || mode === "lab"}
          <div class="desk-canvas">
            <div class="canvas-tools">
              <div class="signal-tag">
                <i></i>{chapter
                  ? index < 0
                    ? tr("章節脈絡", "Chapter flow")
                    : sceneTitle
                  : drawing?.label[lang]}
              </div>
              <div>
                {#if chapter}<button
                    onclick={() =>
                      overview(
                        view !== "chapter" && view !== "poster" ? false : view === "chapter",
                      )}
                    >{view === "chapter"
                      ? tr("完整大圖", "Full diagram")
                      : tr("章節脈絡", "Chapter flow")}</button
                  >{/if}
                {#if !reduced}<button
                    onclick={() => {
                      replay++;
                      paused = false;
                    }}
                    aria-label={tr("重播", "Replay")}>↻</button
                  ><button onclick={() => (paused = !paused)}
                    >{paused ? "▷" : "Ⅱ"}
                    {paused ? tr("繼續", "Play") : tr("暫停", "Pause")}</button
                  >{/if}
              </div>
            </div>
            {#if lesson && step}<div class="request-facts">
                <span><small>{tr("通訊協定", "Protocol")}</small>HTTPS</span><span
                  ><small>{tr("主機", "Host")}</small>portal.example</span
                ><span><small>{tr("資源", "Resource")}</small>/guide</span>
              </div>{/if}
            <div class="desk-art">
              {#if chapter && row}
                {#key replay}<ChapterChart
                    diagramOnly
                    chapter={chapter.id}
                    {title}
                    units={chapter.units}
                    {lang}
                    mode={view}
                    unitIndex={row.i}
                    step={row.j}
                    snapshot={snapshot?.key === key ? snapshot.value : undefined}
                    paused={paused || reduced}
                    select={(i, j) => go(rows.findIndex((r) => r.i === i && r.j === j))}
                  />{/key}
              {:else if lesson && step && drawing}
                <InteractiveStage
                  showNetwork
                  stepId={step.id}
                  nodes={lesson.nodes}
                  edges={lesson.edges}
                  scene={drawing}
                  {lang}
                  playing={ready && !paused && !reduced}
                  {replay}
                />
              {:else}<p>{tr("從目錄選擇章節", "Choose a chapter from the directory.")}</p>{/if}
            </div>
            {#if mode === "lab"}<div class="lab-tools">
                {#if chapter}
                  <label
                    >{tr("實驗", "Experiment")}
                    <select value={index} onchange={(e) => go(Number(e.currentTarget.value))}
                      >{#each rows as r, i}{#if r.scene.choices || r.scene.demo}<option value={i}
                            >{r.scene.title[lang]}</option
                          >{/if}{/each}</select
                    ></label
                  ><button class="mobile-adjust" onclick={() => (panel = "detail")}
                    >{tr("調整條件", "Adjust conditions")}</button
                  >
                {:else}<label
                    ><input type="checkbox" bind:checked={dnsCached} onchange={() => go(1)} />
                    {tr("DNS 快取命中", "DNS cache hit")}</label
                  ><label
                    ><input type="checkbox" bind:checked={dbSlow} onchange={() => go(7)} />
                    {tr("慢速資料庫", "Slow database")}</label
                  >{/if}
              </div>{/if}
          </div>
        {:else if mode === "practice" && quiz}
          <section class="desk-sheet">
            <small>{tr("理解檢查", "Knowledge check")}</small>
            <h2>{quiz.question[lang]}</h2>
            <fieldset>
              {#each quiz.options as opt, i}<label
                  ><input type="radio" name="answer" value={i} bind:group={answer} />
                  {opt[lang]}</label
                >{/each}
            </fieldset>
            <button
              class="forward"
              disabled={answer === undefined}
              onclick={() => (submitted = answer)}>{tr("核對答案", "Check answer")}</button
            >{#if submitted !== undefined}<p role="status">
                {submitted === quiz.answer ? "✓" : "↻"}
                {quiz.feedback[submitted][lang]}
              </p>{/if}
          </section>
        {:else}
          <section class="desk-sheet">
            <h2>{names.notes}</h2>
            {#if chapter}{#each chapter.units as u}<details>
                  <summary>{u.title[lang]}</summary>{#each u.scenes as s}<article
                      id={u.slug + "-" + s.id}
                    >
                      <h3>{s.title[lang]}</h3>
                      <p>{s.mechanism[lang]}</p>
                      <p>{s.observe[lang]}</p>
                      <p>{s.boundary[lang]}</p>
                      <a href={chapter.sourceHref + "#" + s.sourceAnchors[0]}
                        >{tr("對照原文", "Read source")}</a
                      >
                    </article>{/each}
                </details>{/each}
            {:else if lesson}{#each lesson.steps as s}<details>
                  <summary>{s.title[lang]}</summary>
                  <p>{s.text[lang].mechanism}</p>
                  <p>{s.text[lang].observe}</p>
                  <p>{s.text[lang].boundary}</p>
                </details>{/each}
              <h3>{tr("延伸閱讀", "Further reading")}</h3>
              {#each lesson.sources as source}<p>
                  <a href={source.url}>{source.title[lang]} ↗</a>
                </p>{/each}{/if}
          </section>
        {/if}
        <div class="desk-timeline">
          <div class="desk-cap">
            <strong>{tr("本課分鏡", "In this lesson")}</strong><span
              >{index < 0
                ? tr("選擇概念", "Select a concept")
                : lessonPosition + " / " + lessonCount}</span
            >
          </div>
          <div class="stops">
            {#each timeline as t, i}<button
                aria-current={index === t.target ? "step" : undefined}
                title={t.label}
                aria-label={i + 1 + ". " + t.label}
                onclick={() => go(t.target)}><b>{i + 1}</b><span>{t.label}</span></button
              >{/each}
          </div>
        </div>
        <div class="desk-compact-actions">{@render stepActions()}</div>
      </section>
      <aside class="desk-side">
        <div class="desk-note">
          <div class="note-top">
            <span
              >{index < 0
                ? tr("章節全貌", "Chapter overview")
                : tr("步驟", "STEP") + " " + lessonPosition + " / " + lessonCount}</span
            ><b>{chapter ? "AASE" : "HTTPS"}</b>
          </div>
          <div class="note-body">
            <h2 id="step-title">{sceneTitle}</h2>
            {#if chapter && row && index >= 0}
              <p>{row.scene.mechanism[lang]}</p>
              <div class="takeaway">
                <strong>✧ {tr("觀察重點", "Key idea")}</strong>
                <p>{row.scene.observe[lang]}</p>
              </div>
              {#key key + ":" + reset}<LearningStage
                  slug={row.unit.slug}
                  scene={row.scene}
                  {lang}
                  {ready}
                  fixture={chapter.id === "m02-06" ? "m02-06" : "m02-04"}
                  onchange={(v) => (snapshot = { key, value: v })}
                />{/key}
              {#if row.scene.choices || row.scene.demo}<button onclick={() => reset++}
                  >{tr("重設條件", "Reset conditions")}</button
                >{/if}
              <details>
                <summary>{tr("判讀界線", "Evidence boundary")}</summary>
                <p>{row.scene.boundary[lang]}</p>
              </details>
              <a href={chapter.sourceHref + "#" + row.scene.sourceAnchors[0]}
                >{tr("對照原文", "Read the source")} ↗</a
              >
            {:else if chapter}<p>{chapter.summary}</p>
              <a href={chapter.sourceHref}>{tr("原始教材", "Source lesson")} ↗</a>
            {:else if note}<p>{note.mechanism}</p>
              <div class="takeaway">
                <strong>✧ {tr("觀察重點", "Key idea")}</strong>
                <p>{note.observe}</p>
              </div>
              {#if step?.variant?.when === "dns-cached"}<label
                  ><input type="checkbox" bind:checked={dnsCached} />
                  {tr("已有 DNS 快取", "Cached DNS answer")}</label
                >{:else if step?.variant?.when === "db-slow"}<label
                  ><input type="checkbox" bind:checked={dbSlow} />
                  {tr("慢速資料庫", "Slow database")}</label
                >{/if}
              <details>
                <summary>{tr("適用條件", "Scenario assumptions")}</summary>
                <p>{note.boundary}</p>
              </details>{/if}
          </div>
          {@render stepActions()}
        </div>
        <div class="desk-goals">
          <strong>{tr("學習目標", "You’ll learn")}</strong>{#if chapter && index >= 0}<p>
              ◇ {row.unit.objective[lang]}
            </p>{:else if chapter}{#each chapter.units as u}<p>
                ◇ {u.objective[lang]}
              </p>{/each}{:else if lesson}<p>◇ {lesson.objective[lang]}</p>{/if}
        </div>
      </aside>
    </div>
    <dialog bind:this={search} aria-label={tr("搜尋課程", "Search lessons")}>
      <div class="search-head">
        <input
          bind:this={searchField}
          bind:value={query}
          placeholder={tr("搜尋課程與概念", "Search lessons & concepts")}
          aria-label={tr("關鍵字", "Search term")}
        /><button onclick={() => search.close()}>{tr("關閉", "Close")}</button>
      </div>
      <div class="search-results">
        {#each hits as hit}<a
            href={hit.href}
            onclick={() => {
              search.close();
              panel = "canvas";
            }}><small>{hit.group}</small>{hit.title}</a
          >{:else}<p>{tr("沒有符合的課程", "No matching lessons")}</p>{/each}
      </div>
    </dialog>
    <noscript
      ><a class="static-open" href="#desk-reading">{tr("閱讀文字版", "Read the text version")}</a>
      <section id="desk-reading">
        <h2>{title}</h2>
        {#each rows as r}<article id={r.key}>
            <h3>{r.scene.title[lang]}</h3>
            <p>{r.scene.mechanism[lang]}</p>
            <p>{r.scene.observe[lang]}</p>
            <p>{r.scene.boundary[lang]}</p>
            {#each r.scene.cards as c}<p><b>{c.label[lang]}</b> · {c.value[lang]}</p>{/each}
            {#each r.scene.choices ?? [] as c}<p>
                <b>{c.label[lang]}</b> · {c.result[lang]}
              </p>{/each}
            {#if chapter}<a href={chapter.sourceHref + "#" + r.scene.sourceAnchors[0]}
                >{tr("對照原文", "Read the source")}</a
              >{/if}
          </article>{/each}{#each lesson?.steps ?? [] as s}<article>
            <h3>{s.title[lang]}</h3>
            <p>{s.text[lang].mechanism}</p>
            <p>{s.text[lang].observe}</p>
            <p>{s.text[lang].boundary}</p>
            {#if s.variant}<p>
                {s.variant.text[lang].observe}
                {s.variant.text[lang].boundary}
              </p>{/if}
          </article>{/each}<a href="#main">{tr("返回", "Back")}</a>
      </section></noscript
    >
  </main>
</InteractiveFrame>
