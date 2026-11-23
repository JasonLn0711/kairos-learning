# Interactive learning pilot

The pilot was developed in `feat/interactive-learning-pilot` and fast-forwarded to the pre-pilot release base `f83ae048f846128733b69e67777809c05c31e632` before publication. The original checkout contained concurrent work, so the pilot uses the checked-in snapshot in a separate worktree. The frozen lockfile resolves SvelteKit 3.4.0 and Svelte 5.57.2. The static adapter emits directory indexes with trailing slashes. Legacy MATLAB files are served at their existing paths.

## Local preview

From the feature worktree, run `pnpm run build` and `python3 -m http.server 46105 --bind 127.0.0.1 --directory build`.

| Locale | Hub | Lesson |
| --- | --- | --- |
| 繁體中文 | [互動學習](http://127.0.0.1:46105/interactive/) | [一個網頁請求的旅程](http://127.0.0.1:46105/interactive/system-design/request-lifecycle/) |
| English | [Interactive learning](http://127.0.0.1:46105/en/interactive/) | [How an HTTPS Request Travels](http://127.0.0.1:46105/en/interactive/system-design/request-lifecycle/) |

Append `?step=8` directly after the lesson's trailing slash to open the database step with JavaScript enabled.

## Changes by path

```text
README.md
docs/interactive-learning-pilot.md
content/interactive/request-lifecycle.json
src/lib/interactive/
  catalog.ts
  geometry.ts
  model.ts
  validate.ts
  components/
    InteractiveFrame.svelte
    InteractiveHub.svelte
    InteractiveLesson.svelte
    InteractiveStage.svelte
src/lib/components/ContentPage.svelte
src/lib/server/
  catalog.ts
  interactive.ts
src/routes/
  interactive/
    +page.server.ts
    +page.svelte
    system-design/request-lifecycle/
      +page.server.ts
      +page.svelte
  en/interactive/
    +page.server.ts
    +page.svelte
    system-design/request-lifecycle/
      +page.server.ts
      +page.svelte
  sitemap.xml/+server.ts
scripts/check-interactive-publication.mjs
playwright.interactive.config.ts
tests/
  interactive-catalog.test.ts
  interactive-geometry.test.ts
  browser/interactive.spec.ts
```

## Implementation and editorial verification

- **WRITE-02, 05–07, 12 and 15.** One original dataset serves both locales. The schema requires ten stable ordered steps, bilingual source titles and explanations, two named scenarios, and one original question with feedback for each answer. The ten steps and nine primary references also appear in the static reading view. The lesson shows the shared first-edition date, revision and brand. The existing Networking lesson is linked for further reading.
- **FIG-01, 02, 05–07 and INT-01.** The TypeScript geometry projects positions and clips directional paths to node boundaries. Wide and compact frames keep all five entities labeled. DNS cache hits stay on the browser, TLS has a dedicated lock and dashed route, and the slow database variant holds the marker at the same database hop. The sample covers an HTTP/2 cold path and names circumstances that can change it. Animation timing represents teaching pace. The fallback offers a static first step and all ten written sections.
- **PUB-01 and 02.** The server-only catalog validates the content before exposing the lesson through prerender, hub, search or sitemap. The fixture check copies the project into a disposable directory and scans generated text assets after each closed build. The inherited hash-based CSP applies to the new HTML. The controls use in-memory state and keep answers in the browser. Production read-back belongs to the authorized release.
- Renderer work uses Svelte, TypeScript and the browser SVG APIs. The focused synthetic Node 26 profile ran 360,000 geometry and motion samples in about 0.36 seconds on an Apple M2. Route assembly and clipping led the trace. Those functions run when the scene or layout changes. Each animation frame samples the existing path. The timing measures JavaScript computation in a synthetic loop.

## Verification commands

| Command | Result |
| --- | --- |
| `node --version`, `pnpm --version`, `python3 --version` | Node 24.22.3 and 26.13.1, pnpm 10.34.9, Python 3.15.2 |
| `pnpm install --frozen-lockfile` | Passed with the existing lockfile |
| `pnpm run validate:content` | 22 existing bilingual lessons, 52 questions and 29 terms passed |
| `pnpm test` | 437 passed, including seven pilot geometry, scene and catalog tests |
| `pnpm run check` | Zero errors and zero warnings |
| `node scripts/check-publication-boundary.mjs` | Existing gates passed and removed their fixtures |
| `node scripts/check-interactive-publication.mjs` | Draft and future-dated builds excluded the lesson and its sentinel from public pages, search, sitemap and text assets |
| `pnpm run build` | Clean static build emitted all four pilot pages. Vite reported a large existing course chunk |
| `pnpm run validate:release` | 418 HTML pages and 1,062 carried-through static assets passed, along with the existing article gates |
| `pnpm audit --audit-level=high` | No known vulnerabilities reported |
| `uvx --python 3.12 --from pip-audit==2.10.1 pip-audit --require-hashes -r resources/aase/requirements.txt` | The pinned Python audit reported no known vulnerabilities. `uvx` supplied the runner because `pipx` was unavailable |
| `python3 -m unittest discover -s scripts -p test_validation_html.py` | Six passed |
| `(cd site/courses/matlab-practice/downloads && shasum -a 256 -c SHA256SUMS.txt)` | All six archives matched |
| `pnpm exec playwright test --config playwright.interactive.config.ts` | Eleven passed in Chromium 156.0.8078.4. Covers direct links, history, touch, keyboard, the two variants, quiz feedback, reduced motion, no JavaScript, overflow, metadata and legacy routes |
| `rust-anything profile --lang ts . -- node --experimental-strip-types ../profile-interactive.mjs` | Synthetic trace and output in `../profile.log` on the review machine |

Screenshots are local under `.local/interactive-evidence/` in the feature worktree. The filenames record locale, page and CSS viewport width (320, 390, 768 or 1280). The forced-colors screenshots use CSS `zoom: 200%` in Chromium. Run logs and the profiler harness are in the parent directory. Evidence is from local Chromium and touch emulation on macOS.

Hallmark’s component lint reported zero failures. Its optional rendered landing-page heuristics flagged dense lesson copy, a short hub and SVG imagery. The pilot retains the required full walkthrough, the one-lesson hub and the original network illustration. The static build also retains Vite’s warning for an existing content bundle used by the general content routes.

## Release and rollback

After review and authorization, use the existing GitHub Pages workflow and its pinned install, security and release gates. Verify the four published paths, a reloaded deep link, the language pair, search and sitemap entries, one missing lesson path and preserved MATLAB checksums on the actual site. The authorized main-branch push starts the existing Pages workflow. Deployment acceptance requires reading back the published artifact. If a later release needs rollback, revert the pilot's eventual merge on the release branch and redeploy the resulting commit. Use the pre-pilot SHA above to compare behavior and preserve any intervening work.

## Planning and related material

The [daily note](https://github.com/JasonLn0711/planning-everything-track/blob/main/weeks/2026-W48/days/2026-11-23.md#kairos-interactive-pilot-2026-11-23) records the layout decision and acceptance gate. The [weekly plan](https://github.com/JasonLn0711/planning-everything-track/blob/main/weeks/2026-W48/weekly-plan.md#kairos-interactive-pilot-2026-11-23) tracks capacity and the [site project](https://github.com/JasonLn0711/planning-everything-track/blob/main/data/projects/2026-05-public-website-v3-clean-slate-rebuild.md#kairos-interactive-pilot-2026-11-23) tracks status. See the [publishing policy](publishing-security.md) and [previous performance evidence](shared-rust-tools.md#route-payload-performance-2026-11-23).

## Immersive workspace follow-up

The shared focus workspace and six-chapter AASE M02 atlas extend this pilot. See the [M02 engineering receipt](interactive/aase-m02-delivery.md) for its acceptance and release evidence.
