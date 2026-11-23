# AASE M02 immersive workspace visual audit

## Before

Captured all three live URLs with Chromium 156.0.8078.4 at 100% browser zoom on macOS. Each received HTTP 200. Screenshots and measured region boxes are in ignored `.local/aase-m02-before/`. File names use the sample name and viewport width. Capture settled fonts and network and requested reduced motion for stable illustrations.

| CSS viewport | Reference document height | Request Lifecycle document height | Canonical M02 index document height |
| --- | ---: | ---: | ---: |
| 1440 × 900 | 900 | 1879 | 2050 |
| 1366 × 768 | 768 | 1874 | 2050 |
| 1280 × 720 | 720 | 1867 | 2050 |
| 390 × 844 | 1499 | 2697 | 2995 |
| 320 × 568 | 1625 | 2838 | 3258 |

Document width matched the viewport in all captures. Heights are CSS pixels.

- At 1440 × 900, the reference's 47 px header sits above approx. 255 / 860 / 324 px columns. The stage and its bottom step strip sit in the central sheet, with Replay and Pause over the stage and contextual step actions in the right panel. At 1280 × 720 the central sheet is 659 px tall. The left navigation is off canvas on mobile, the central scene comes before the explanation, and the page scrolls vertically. Clicking Next from step 5 switched to step 6 and updated the URL fragment. The stage kept its frame while displayed topology, status, and explanation changed. [Reference lesson](https://designed-to-scale.vercel.app/#/replication/5)
- Request Lifecycle uses an 87 px desktop header plus a title-and-summary band. At 1280 × 720, the workspace starts at y315 and controls occupy y690–760. At 390 × 844 controls begin at y951. The existing desktop stage already dominates the workspace horizontally and the operation row is in that stage column. The stage currently grows with SVG width, and supplementary reading and the site footer extend the document below the primary workspace. [Request Lifecycle](https://learn.cs-kairos.com/interactive/system-design/request-lifecycle/)
- The canonical M02 index uses the site header, course navigation, and long-form reading flow. Its desktop content starts at y143 and the module rail is 220 px wide. Mobile shows the navigation above the reading column. Keep this layout as the curriculum's long-form destination. [AASE M02 index](https://learn.cs-kairos.com/courses/aase/v1/m02/)

## Before-to-after acceptance

| Observation | Design change | Acceptance evidence |
| --- | --- | --- |
| Header and title cost 315 px before the 1280 × 720 workspace | Compact route-scoped title and navigation | Desktop screenshots and document overflow measurements |
| Width-driven SVG and controls compete for height | Fluid-height stage with a dedicated control row | Control bounds, diagram legibility and stable scene framing |
| Supporting reading extends the interactive document | Explicit reading access with full no-JS fallback | Keyboard focus restoration and no-JS text inspection |
| Mobile controls start below the fold | Compact navigation and reflow with reachable controls | 390 × 844 and 320 × 568 captures and no horizontal overflow |
| Canonical M02 index is the long-form course entry | Connect the atlas to published articles and back | Bilingual links and publication-gate tests |

The baseline covers the requested URLs in desktop Chromium and its emulated viewport sizes. Native phones and non-Chromium engines were outside this capture.

## First integrated capture

The first 40-unit build passed all 20 tests in `playwright.aase-m02-immersive.config.ts` in Chromium. The suite captured 106 images before Request Lifecycle was added to this matrix. It confirmed no document-level scrolling at the four desktop sizes for representative scenes of each kind present in the authored data, and no horizontal overflow in the tested mobile and increased-text states. The touch check advanced a step, opened the reading panel and returned to the same scene. Source evidence is in `.local/aase-m02-browser-run.log`, with images in `.local/aase-m02-after/`.

Inspection of the six chapter overview frames found clear hierarchy, visible controls and legible bilingual type. It also found a compositional gap in the first integrated renderer. A one- or two-card scene could leave most of the fluid-height stage empty at 1440 × 900. The viewport result alone is therefore evidence of layout fit. Visual acceptance also requires inspecting whether each final stage makes the mechanism clear at the available size.

## Final read-back

The clean Chromium run passed the focus and overflow matrix. At 1440 × 900 the Request Lifecycle and both calculator/gate references occupied 900 CSS px document height with reading closed. The final stage adds SVG flow, comparison and evidence marks while retaining readable HTML names and outcomes. I inspected `.local/aase-m02-after/request-comparison.png`, `chapters-zh-final.png`, `reference-softmax.png` and `reference-gates.png`. The reference-inspired shell and original diagram style are visible in those captures.

## Compact-desktop follow-up

The exhaustive sweep identified long English explanations pushing the outer document beyond 720 px and the seven-card harness diagram exceeding the stage by 16 px. The explanation pane now scrolls with keyboard focus. The stage keeps its central support diagram while tightening the parallel cards on compact desktops. The clean-build Playwright matrix and independent visual QA both passed. View the two language chapter montages and the Request Lifecycle comparison as `review-zh-chapters.png`, `review-en-chapters.png` and `review-request-comparison.png` in the local after-capture folder.
