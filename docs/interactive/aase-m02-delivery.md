# AASE M02 immersive learning delivery

Status: locally implemented. Final release checks are recorded below.

## Baseline

- Feature branch: `feat/aase-m02-immersive`, isolated from concurrent local changes.
- Fetched source: `c52b395c4188a8cceb4e80630c51854af69197cc`.
- SvelteKit 3.4.0, Svelte 5.57.2, Vite 8.3.5, adapter-static 4.0.1 and pnpm 10.34.9 resolve from the existing lockfile. The frozen install passed.
- All six source articles are published with date 2026-11-05. They retain ownership of their prose, sections, checks and sources.
- `attentionDemo` and `contextBudget` already implement the two numerical examples as constrained pure TypeScript. The existing networking scene has its own strict validator and publication filter.
- Baseline `rust-anything profile --lang ts . -- node --experimental-strip-types ../../interactive-pilot/profile-interactive.mjs` exited 0. An Apple M2 synthetic loop evaluated 360,000 samples in 354 ms. The profiler attributed 227 ms inclusive to route composition over the whole run. This is a repeated Node workload. Browser SVG rendering and learner-facing timing need their own evidence.

## Source tree

```text
content/interactive/aase-m02/{manifest,m02-01,m02-02,m02-03,m02-04,m02-05,m02-06}.json
src/lib/interactive/aase/{model,validate,simulations}.ts
src/lib/interactive/components/{ImmersiveShell,AaseAtlas,AaseConceptLearning,LearningStage,StageDiagram,PolicyStage}.svelte
src/lib/interactive/components/{InteractiveFrame,InteractiveHub,InteractiveLesson,InteractiveStage}.svelte
src/lib/server/{aase-interactive,catalog}.ts
src/lib/components/{ContentPage,AaseLesson,ToolEvidenceDiagram}.svelte
src/routes/{interactive,en/interactive}/aase/m02/
src/routes/{interactive,en/interactive}/+page.{server.ts,svelte}
src/routes/sitemap.xml/+server.ts
scripts/check-interactive-publication.mjs
tests/{aase-interactive-coverage,aase-interactive-simulations}.test.ts
tests/browser/{aase-m02-immersive,interactive}.spec.ts
playwright.aase-m02-immersive.config.ts
docs/interactive/aase-m02-{coverage,visual-audit,delivery}.md
```

## Preview

From this worktree, run `pnpm run build` then `python3 -m http.server 46143 --bind 127.0.0.1 --directory build`. Open the [Chinese atlas](http://127.0.0.1:46143/interactive/aase/m02/), [English atlas](http://127.0.0.1:46143/en/interactive/aase/m02/), [softmax calculator](http://127.0.0.1:46143/en/interactive/aase/m02/m02-01/softmax-weighted-sum/?step=2), [Four Gates simulator](http://127.0.0.1:46143/interactive/aase/m02/m02-06/four-gates/?step=2) or [Request Lifecycle](http://127.0.0.1:46143/interactive/system-design/request-lifecycle/).

## Evidence

- [Visual audit](aase-m02-visual-audit.md)
- [Source coverage](aase-m02-coverage.md)
- [Existing interactive pilot](../interactive-learning-pilot.md)
- [Static publication and recovery](../publishing-security.md)

The requested main-branch publication uses the existing Pages workflow. This report records the verified local build; production acceptance also requires read-back of the deployed artifact.

## Publication and rollback

After review and explicit publication authorization, use the repository’s existing Pages workflow. Confirm the deployed commit and read back both atlas locales, representative concept/step links, Request Lifecycle, search and sitemap, one unknown path and the preserved MATLAB ZIP checksums. The pre-change source is `c52b395c4188a8cceb4e80630c51854af69197cc`. If a future release needs rollback, revert the feature integration and run the ordinary release gates on that revert. Preserve Git history.

## Implementation and verification scope

- The interactive inventory contains 40 units and 120 scenes. A standalone content test checks every canonical top-level section and every named nested block against both locale anchor sets. The source articles, canonical review questions and downloads remain in their original catalogs.
- The two locale wrappers share a server-side catalog. Lesson status, the Taipei publication date and both canonical locale gates determine whether a unit is available. Closed content stays outside the route entries and public discovery surfaces. The audit fixture checks real build output.
- The stage retains human-readable HTML values and outcomes alongside semantic SVG. The shared shell reserves a desktop stage row and reflows for mobile. Native dialog behavior supplies modal focus handling and Escape. Without hydration, the full written reading view and source links remain inline.
- Softmax and budget calculations reuse the canonical teaching functions. Tool gates and workflow limits are local pure functions. Choice scenes model authored, deterministic cases without calling model endpoints or executing learner commands.
- `rust-anything profile --lang ts . -- node --experimental-strip-types ../profile-m02.mjs` exited 0. On the development machine, the synthetic loop ran 400,000 calculator, gate and workflow calls in 15 ms. Calls occur on learner input and the mission specifies a TypeScript runtime, so this branch keeps the constrained TypeScript implementation. The result does not establish browser or production performance.

## Completed preliminary commands

| Command | Result |
| --- | --- |
| `pnpm install --frozen-lockfile` | Passed |
| `pnpm run validate:content` | 22 existing bilingual lessons, 52 original questions and 29 terms |
| `pnpm test` | 444 tests passed, including dedicated coverage, validator and simulation tests |
| `pnpm audit --audit-level=high` | No known vulnerabilities reported |
| `uvx --python 3.12 --from pip-audit==2.10.1 pip-audit --require-hashes -r resources/aase/requirements.txt` | No known vulnerabilities reported |
| `python3 -m unittest discover -s scripts -p test_validation_html.py` | Six passed |
| `(cd site/courses/matlab-practice/downloads && shasum -a 256 -c SHA256SUMS.txt)` | All six ZIP checksums matched |

## Final acceptance

| Command | Observed result |
| --- | --- |
| `pnpm run check` | Zero errors, zero warnings |
| `node scripts/check-publication-boundary.mjs` | Passed after handling the closed English curriculum fixture, then restored source files and rebuilt |
| `node scripts/check-interactive-publication.mjs` | Draft and future-dated networking and AASE fixtures excluded from public routes, metadata, search, sitemap and text assets |
| `pnpm run build` | Passed on Node 24.22.3. Both locale trees contain 47 AASE pages each |
| `pnpm run validate:release` | 512 HTML pages and 1,062 preserved assets passed along with the existing release gates |
| `pnpm exec playwright test --config playwright.aase-m02-immersive.config.ts` | 29 passed |
| `pnpm exec playwright test --config playwright.interactive.config.ts` | 13 passed |

Chromium 156.0.8078.4 on macOS 27.0.1. All 80 concept URLs responded successfully. The browser matrix exercises each rendered scene kind at four desktop sizes across both locales, verifies mobile reflow and 200% text sizing, and covers direct steps/history, touch, keyboard, escape/focus restoration, no-JS reading and representative scenario outcomes. At 1440 × 900 the two reference stages allocated approximately 777 × 665 CSS pixels. Their document heights and the upgraded Request Lifecycle document height were 900 px. Capture files are under `.local/aase-m02-before/` and `.local/aase-m02-after/`. The focused path and role checks do not establish whole-site WCAG conformance or testing on native mobile devices, Safari, or Firefox.

Applied rules include WRITE-02/05/12/15, HTML-04, FIG-01/02/05–07, INT-01, A11Y-02 and PUB-02. PUB-01 live verification follows a separately authorized deployment. The Vite build retains a size warning for a large shared content chunk.

## Review hardening

- Reproduced a quiz selection carrying into an adjacent concept in the earlier build. Both locale routes now key each learning page by its concept identity. The regression exercises a real answer and the Next concept link.
- Replaced generic diagram marks with labeled token pieces, a signed-coordinate vector, a causal-mask table and six parallel support functions around the model. Only scenes with matching authored structure get specialized views. Each visual still has selectable labels and a written equivalent.
- Added input-driven local policies for task governance, sandbox capabilities, host authority, retry deduplication and required-field verification. The two classroom weekend limits remain separate. MCP failure comparisons follow the [2025-06-18 Tools specification](https://modelcontextprotocol.io/specification/2025-06-18/server/tools). The JSON examples and policy effects are fictional.
- The expanded fixture withholds a middle concept and a chapter whose source translation is closed. It also verifies that the published predecessor links to the next available concept. The temporary fixture uncovered a hardcoded canonical course-map link. The diagram now receives links from the published catalog and retains the labels for withheld articles. The checked-in article content and download files are preserved.
- The refreshed `rust-anything profile --lang ts . -- node --experimental-strip-types ../profile-m02-review.mjs` ran 900,000 synthetic evaluations in approximately 23 ms on the same development machine. It is a repeated Node workload. The study keeps the TypeScript runtime selected by the brief.

The added browser assertions verify actual static identity, canonical article anchors, sitemap and search entries across all published concepts. They also test focus geometry for the longest copy in each locale, fresh quiz state across adjacent concepts and the new input-driven policies.

## Learner acceptance read-back

| Requirement | Evidence from the clean build |
| --- | --- |
| Navigate to any concept in either language | 80 direct concept routes verified with page identity, reciprocal metadata, original article fragments, search and sitemap references. Both locale trees contain 47 AASE pages each. |
| Explore mechanisms through substantive scenes | 40 concepts with three scenes each. Browser checks exercised arithmetic, canonical field presence, stale retrieval, model context, authorization, sandbox state, service-side deduplication, and independent acceptance. |
| Read, check and share | Checked source links, drawer focus restoration, no-JS descriptions and values, fresh quiz state on concept change, and step URL history and locale navigation. |
| Use desktop focus mode without page scrolling | Passed the 1280×720, 1366×768, 1440×900 and 1920×1080 matrices for both locales with representative scene kinds and longest copy. A separate keyboard test confirmed that longer explanations scroll inside the focus pane. An exhaustive Chromium sweep at 1280×720 opened all 240 locale/scene combinations, exercised 68 alternate scenario states and found no overflow or wrong result. |
| Use small widths or 200% text | Checked 1024, 768, 390 and 320 px layouts, touch controls and 200% text resizing. Independently inspected six mechanism types in both locales at 1280 and 320 px. |
| Return to canonical material and Request Lifecycle | Verified canonical anchors and course discovery. Request Lifecycle passed all 13 regression checks. Static release validation checked 512 HTML pages and 1,062 carried-through assets. |

Final visuals are under `.local/aase-m02-after/`. Key files are `review-zh-chapters.png`, `review-en-chapters.png`, `review-request-comparison.png` and `stage-audit/`. Repeated browser checks were run against the clean build after publication fixtures restored the source and finished. The review is local to `feat/aase-m02-immersive`.

The compact-desktop compaction alternate state was inspected at 1280×720. The stage and its content measured 485 CSS px tall and the document stayed at 1280×720. See `review-en-compaction-1280.png`.

## Planning and related evidence

The [11/23 day note](https://github.com/JasonLn0711/planning-everything-track/blob/main/weeks/2026-W48/days/2026-11-23.md#aase-m02-immersive-2026-11-23) records the teaching outcome and release gate. The [W48 plan](https://github.com/JasonLn0711/planning-everything-track/blob/main/weeks/2026-W48/weekly-plan.md#aase-m02-immersive-2026-11-23) records capacity and the [website project](https://github.com/JasonLn0711/planning-everything-track/blob/main/data/projects/2026-05-public-website-v3-clean-slate-rebuild.md#aase-m02-immersive-2026-11-23) records status. See the [Request Lifecycle pilot](../interactive-learning-pilot.md) for the predecessor and the [curriculum coverage](aase-m02-coverage.md) for source anchors and the integrated exercise.

## Production read-back

The initial Pages run deployed `85e8bd0b`. Live inspection found 22 px of outer vertical scroll in the Chinese DNS step at 1280×720. Fix `e6495938` contained the status announcement within the scrollable focus pane. All 20 bilingual Request Lifecycle scenes fit 1280×720 locally after the fix, and the 13 Request Lifecycle browser tests passed.

[GitHub Pages run 45158413361](https://github.com/JasonLn0711/kairos-learning/actions/runs/45158413361) deployed `e6495938d7b1e488668b43e85efd311d9a9d3fa4`. On November 23, 2026, Chromium verified 40 concept links per locale, Softmax and Request Lifecycle step 2 at 1280×720, and both canonical module links. Search and sitemap included both concept paths. A missing path returned 404, and all six published MATLAB ZIP files matched their SHA-256 checksums. These checks establish a production spot check.


## 2026-11-24｜Kairos Learn 工作區

現行入口使用滿版學習工作區。HTTP 與 AASE M02 共用課程目錄、圖解、分鏡與步驟說明。上方的 Kairos Learn 連回所選語系的互動首頁。 [中文入口](https://learn.cs-kairos.com/interactive/) · [英文入口](https://learn.cs-kairos.com/en/interactive/) · [滿版工作區發布回執](../releases/2026-11-24-kairos-learn.md) · [章節圖解與來源](reconstruction-v2/10-chapter-diagrams.md)

讀者從工作區回到課程首頁、手機展開章節概念或逐幕選擇的設計與驗收，見[11/24 網頁設計優化與正式站回讀](../web-design-optimization.md#production-read-back)。
