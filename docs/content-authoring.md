# Bilingual lesson and question authoring

Each public lesson should help a reader make one defensible technical judgment. Start with the problem, explain its mechanism and limits, work through an original example, then give a safe task with an observable expected result.

## Canonical fields

Edit one `content/lessons/<id>.json` object. `src/lib/model.ts` defines the types and `src/lib/validate.ts` checks the content before deployment.

| Field | Contract |
| --- | --- |
| `id`, `slug`, `course`, `module`, `order` | Stable identity, URL and unique positive reading order. Published URLs remain stable. |
| `revision`, `status`, `publishedOn`, `reviewedOn` | Positive revision, draft/published status, valid calendar dates. Publication uses the Asia/Taipei build date. |
| `sourceIds` | References to HTTPS primary sources in `content/sources.json`, each with a checked date. |
| `prerequisites`, `related`, `terms` | Valid IDs, no self-link or prerequisite cycle; glossary links back to the relevant lesson. |
| `text.zh`, `text.en` | Complete titles, summaries, objectives, explanatory sections, worked example and safe exercise. Section IDs and paragraph counts align. |
| `questions` | Stable IDs, revision, one answer index 0–3, concept ID, four choices and four explanations in each language. |

`reviewedOn` records the content check represented by the release, not an assertion that Jason personally reviewed or learned the lesson. This first release uses AI-assisted original drafting and technical/source review; independent reader acceptance is recorded separately. Do not reuse private learner answers or imply human authorship that has not been established.

Each language must stand on its own. Keep technical numbers, examples, code and answer keys consistent. Preserve English protocol terms where they aid precision. Source links support specific technical claims; they do not turn an original scenario into an official exam question. Check the CEH course version and [exam blueprint](https://cert.eccouncil.org/wp-content/uploads/2024/04/CEH-Exam-Blueprint-v5.pdf) separately. Twenty course modules do not establish complete exam coverage.

## Exercises and sources

Every exercise declares its environment, at least three steps, expected output or decision, a small check and cleanup. This release uses synthetic tabletop records and offline Python standard-library programs. No task scans a public target, requests credentials or requires malware. For future network labs, document owned/authorized scope, target allowlist, stop conditions and cleanup before publication.

Add sources to `content/sources.json`; cite their IDs at lesson and section level. Prefer official specifications, standards, vendor documentation and primary research. Record access limits honestly. A source review is not a claim that every provider allowed an automated HTTP fetch. Never import leaked exam questions, private transcripts, student data or secrets.

## Revision and release

1. Draft both languages, source references, example, exercise and all answer explanations.
2. Run `pnpm run validate:content`, `pnpm test` and `pnpm run check`.
3. Run the actual publication-boundary build and static release checks described in the [runbook](publishing-security.md).
4. Review article, paired language, glossary backlink, quiz and exercise at narrow and desktop widths. Run executable examples locally and record only observed outputs.
5. Change a question revision whenever its wording or answer semantics change enough to invalidate prior attempts. Keep its stable ID for the same concept; use a new ID for a different question.
6. Publish through a reviewed PR and verify the deployed URL. Record independent learner feedback when obtained; do not infer it from tests.

All lessons, module quizzes and wrong-answer review consume the same question object. Search text is generated from the published catalog. No copied answer bank, manual search index or parallel lesson list is needed. Future-dated content is excluded until a later authorized build; it is not an automatic publication schedule.

[Architecture](platform-architecture.md) · [Decision history](ceh-bilingual-publishing-plan.zh-tw.md) · [Release evidence](releases/2026-10-23-phase-0-3.md)

## One-concept reading route — October 23

Current M04 contract (2026-11-07): ten new stable IDs; C01–C10 are published. Old source and renderer examples below are historical references stored outside the build. Legacy teaching and image assets are retired. Public slugs m04-01–m04-10 resolve only their corresponding new stable IDs after the shared publication gate. [Migration receipt](releases/2026-11-04-m04-route-reset.md).

`content/concepts.json` is the ordered registry of stable IDs, modules and bilingual titles. Pending concepts have registry entries but no published teaching. Each teaching lives in `content/concepts/<lowercase-id>.json`; its `id` must match a registry entry. `src/lib/concepts.ts` validates the data and applies the shared status/date gate to routes, search, navigation and public page data. No original lesson reference or route-code edit is needed to publish the next concept.

Teaching fields: `id`, positive `revision`, `date` (content revision date), `status` (`draft` or `published`), `publishedOn`, and `text.zh` / `text.en`, each with `summary` and `sections` (`id`, `heading`, `paragraphs`). Both languages use the same section IDs. Keep published IDs and URLs stable. M04-01 revision 2 preserves the seven-section teaching scope, with reviewed technical corrections; exact supplied originals remain in their designated source archives.

Optional `qa` is an array of anonymized actual questions and discussion supplied by the learner: each has a stable `id` and `text.zh` / `text.en` with `question` and an `answer` array of paragraphs. Omit it or use `[]` to display pending. Actual learner wording stays in the private source archive; public Q&A excludes identifying information, secrets and nonpublic third-party material. No private source path, delivery ID or progress belongs in website content.

Shortest update workflow:

1. Preserve supplied originals in the adopted private archive; publish only reviewed teaching and anonymized discussion. Preserve the already-public initial teaching archive. Record delivery separately from understanding.
2. Add the registry entry if needed; create or edit its teaching JSON, both languages and optional anonymous Q&A. Increment revision for a content change. Keep draft/future content closed; use `published` only after review.
3. Run `pnpm run validate:content`, `pnpm test`, `pnpm run check`, `node scripts/check-publication-boundary.mjs` and `pnpm run validate:release`. The boundary check renders an isolated second-concept fixture, removes it, tests draft/future exclusion, then rebuilds clean production output. Reserved fixture IDs M04-98 and M04-99 are never production curriculum.
4. Check mobile/desktop, bilingual body and Q&A, previous/next links, search and missing IDs. Publish through the existing PR/Pages workflow; read back the exact public URL and record the deployment commit/run in private progress and the thin daily index.

Routes, search and navigation resolve by concept ID. Pending neighbors link to their module-index anchor. Registry order determines adjacency across modules, so add later modules in the intended editorial sequence. Each module retains its own concept count; M04 now has ten units identified as `CEH26-M04-C01` through `CEH26-M04-C10`, followed by M05. The historical twelve-page route is retired; see [migration and recovery](releases/2026-11-04-m04-route-reset.md). A registry entry without teaching has no article route or search entry. To publish a reviewed unit, add its bilingual teaching JSON with the exact new ID and use the existing status/date gate. Never reuse legacy M04 IDs for new meanings.

Sections may include `blocks`: semantic `table` (caption, headers, rows), `step` (heading, paragraphs, optional code), or `details` (legacy data kind, rendered as an ordinary visible section). Keep bilingual structure aligned. Optional `checks` contains teaching tests, each with a stable ID, zero-based answer, and bilingual prompt, four options and four rationales. Tests and their directly visible explanations are distinct from `qa`; reading an answer neither submits a learner response nor confirms understanding.

Revision 3 adds text-first `flow` and `cards` blocks, each with a caption, description and title/body items. Use ordered lists for a process and parallel unordered cards for independent permissions. These figures are readable HTML with CSS, not images or progress trackers. Supply both languages and keep all content searchable. Use statistical charts only when actual data answers a relevant question.

## Responsive teaching diagrams — adopted October 25

Historical reference (retired from the public site on 2026-11-04): use the archived [M04-01 simulation card](../archive/ceh/m04-legacy-2026-11-04/content/concepts/m04-01.json) as a presentation reference when a concept benefits from a diagram. This is a visual preference, not a requirement to illustrate every paragraph or rebuild older lessons. It does not change test authorization, delivery order, learner understanding or publication permission. The [CEH teaching bridge](https://github.com/JasonLn0711/ceh-cehp-certification-notes-2026/blob/main/docs/public-teaching-bridge-2026-10-23.md#responsive-teaching-diagrams) links this standard to the learning workflow.

### Choose the appropriate form

Use a process diagram for a sequence, parallel cards for independent operations or permissions, and a resource/status card for a small synthetic scenario. The M04-01 Public/Finance card is a resource/status comparison; its results describe the stated simulation, not measured access to a real system. Keep ordinary prose when it communicates the point more clearly. Statistical charts require real, relevant data and a stated source; never invent measurements to fill a chart.

### Implementation and source fidelity

- Prefer native lightweight SVG/HTML/CSS or a component compatible with the existing framework. A single diagram does not justify adding React or a charting package. Use the established light background, fine border, rounded corners and typography.
- Each image file must be strictly **less than 100,000 bytes**. Record its actual byte count and public URL in the release evidence. An HTML/component diagram also provides a matching standalone SVG that can be downloaded or inspected for size.
- Preserve the supplied wording and sequence. Move the relevant text into one diagram without repeating the same content beneath it. A title change or wording edit requires its own requested scope. Compare the resulting readable text against the source; retain differences explicitly allowed for that revision.
- Keep image, visible component, alternative text, search text and download semantically consistent. Provide complete meaningful alternative text; use labels and icons as well as color. A checkmark/lock plus success/rejection wording is the reference pattern. Do not bake the only searchable text into pixels.
- At **320, 390 and 1280 pixels**, check readable labels, wrapping, captions and page overflow. Reflow cards at small widths rather than shrinking a wide desktop drawing until text is unreadable.
- Check text contrast (at least 4.5:1 for ordinary text) and meaningful graphical/control contrast (at least 3:1). Interactive links or disclosures retain visible keyboard focus and native keyboard behavior. A static diagram needs no artificial interaction; if it downloads on activation, verify that keyboard download and its accessible name.

### Existing implementation and reference asset

[AccessDiagram.svelte](../archive/ceh/m04-legacy-2026-11-04/src/lib/components/AccessDiagram.svelte) renders the responsive card; [SourceBody.svelte](../src/lib/components/SourceBody.svelte) places it in the original text order. The `accessDiagram` block in [M04-01 content](../archive/ceh/m04-legacy-2026-11-04/content/concepts/m04-01.json) contains the original eight text segments. The catalog includes them in search. The current block is a validated, specific simulation-card shape; adapt the schema deliberately when another diagram needs different semantics rather than forcing unrelated content into it.

The [standalone SVG source](../archive/ceh/m04-legacy-2026-11-04/site/images/ceh/m04-01-access-results.svg) and [archived SVG](../archive/ceh/m04-legacy-2026-11-04/site/images/ceh/m04-01-access-results.svg) are **1,855 bytes** at this reference version. The verified minimum text contrast is 5.4:1. [Implementation commit](https://github.com/JasonLn0711/kairos-learning/commit/3fba077d5691b98972100ecb95e084ef3cf11a61) and [successful deployment](https://github.com/JasonLn0711/kairos-learning/actions/runs/40163169848) identify the baseline; remeasure after any asset change.

### Acceptance and publication

For each changed diagram, record source-text comparison, actual image bytes, alternative text, contrast, viewport checks, keyboard behavior when applicable, search inclusion and downloaded-file equality. Preserve neighboring content, language scope, Q&A disclosures and code styling. Run the existing content/type/tests, publication-boundary build and release-link/asset checks from the [publishing runbook](publishing-security.md). After the authorized deployment succeeds, read the actual public page and asset back and compare them with the verified build. A commit, build or screenshot alone is not production confirmation.

Keep detailed engineering evidence with the website release and link the outcome from the CEH source record and private Planning index. This standard adds no schedule, learner completion claim, automatic retrofit or new permission to publish.

### How the published diagrams work and how to maintain them

This implementation uses **Svelte 5 + SvelteKit + Vite**, with `adapter-static` producing the `build/` website. It uses neither React nor Mermaid, and adds no charting package. See [package scripts](../package.json), [static adapter configuration](../svelte.config.js) and the [Pages workflow](../.github/workflows/pages.yml).

There are two coordinated representations, not one automatically responsive SVG:

1. **The page illustration is semantic HTML with CSS.** [QAIllustration.svelte](../archive/ceh/m04-legacy-2026-11-04/src/lib/components/QAIllustration.svelte) renders figure/caption, text nodes, cards and connection labels from [bilingual diagram data](../archive/ceh/m04-legacy-2026-11-04/src/lib/qa-illustrations.json). CSS Grid lays out clients/consumers in two columns; at `max-width:420px` it switches to one column. Flex wrapping moves status text onto another line. Text reflows rather than shrinking a desktop picture. Explicit connection endpoints remain readable after stacking, so the mobile layout does not imply A connects to B or consumer B forwards to C.
2. **The downloadable illustration is a standalone SVG file** under `site/images/ceh/m04-01-qa-*.svg`. Its `viewBox` defines a fixed coordinate system; a viewer can scale it proportionally, but this file does **not** independently rearrange its nodes on mobile. The page does not display the standalone file as its main responsive illustration. SVG title/description and visible text describe the diagram. Simple rectangles, paths and text keep each file around 1–3 KB without embedded raster pixels, fonts or JavaScript. Those byte counts describe the SVG assets, not the entire webpage or framework bundle.

The earlier [AccessDiagram.svelte](../archive/ceh/m04-legacy-2026-11-04/src/lib/components/AccessDiagram.svelte) similarly uses HTML/CSS for the full card, with small inline SVG icons (`viewBox="0 0 24 24"`). At 420px, results wrap onto their own row. Its entire card is a download link with a complete accessible label; the underlying figure has a full text alternative and hides duplicated decorative content from assistive technology. New Q&A figures instead expose their real text and caption directly, hide decorative symbols, and provide an explicit download link. Enter activates focused links; native Q&A summary controls support Enter/Space. Visible focus outlines and labels/icons supplement colors. These are basic accessibility checks, not a claim of comprehensive screen-reader certification.

**Content placement and maintenance:** the original Q&A remains in [M04-01 JSON](../archive/ceh/m04-legacy-2026-11-04/content/concepts/m04-01.json). [QAAnswer.svelte](../src/lib/components/QAAnswer.svelte) currently identifies the specific SMB status sequence and architecture A/B labels, inserting figures at those exact positions. It replaces the six status labels with equivalent figure text once, preserving source order. This is a deliberately scoped placement rule, not an automatic diagram generator for arbitrary prose. If the source labels change or another lesson needs figures, update and test an explicit mapping rather than assuming the current matching rule generalizes. [SourceBody.svelte](../src/lib/components/SourceBody.svelte) provides the separate typed `accessDiagram`/`visual` route used in lesson bodies.

The JSON/component and standalone SVG are currently maintained together; there is **no committed automatic SVG-generation pipeline**. When changing a diagram, update both language data and paired SVG files, compare their meaning, verify original text/search retention, and remeasure bytes and text bounds. Ordinary HTML text can be selected/searched; the original answers and editorial text also feed the existing search catalog. Supplemental labels do not automatically enter that search index merely because they appear in a component.

**Publication path:** scoped source change → local checks/build → pull-request quality checks → authorized merge to `main` → existing Pages workflow builds and deploys `build/` → verify the exact deployment commit and read back the public page/downloads. `site/` is the configured static asset directory. A commit is not proof of deployment. Do not change DNS or hosting permissions to update these diagrams.

For the verified three-figure release, both languages were tested at 320/390/1280, including exact 93/79 original-answer text segments, disclosure/quiz keyboard behavior, no horizontal page overflow, all six downloaded SVG bytes, and SVG text bounds. Text contrast was at least 6.52:1. [Source release](https://github.com/JasonLn0711/kairos-learning/commit/72fb43d3f832225da4d6b261d3450211d15d0c44) and [successful deployment](https://github.com/JasonLn0711/kairos-learning/actions/runs/40165598643) identify the implementation. Production browser checks passed; a separate urllib full-page comparison received HTTP 403 and was not retried. Preserve this distinction in the release evidence.

### Supplied long-form Q&A

Actual supplied questions and answers may use `qa[].format: "markdown"`. Each language retains a complete answer string, optional `originalQuestion`, separate `editorial` clarifications and `explanation` for its embedded teaching test. The constrained escaped-text renderer supports headings, paragraphs, inline code, fenced code and tables; it does not execute HTML. Preserve the supplied answer's sentence order, and record source/visible-text comparison. Current long-form answers contain one four-choice teaching test whose suggested answer is C; extending this shape requires an explicit answer-key model rather than reusing that fixed key for another question.

Original supplied answers, editorial corrections, supplemental diagrams and test feedback remain distinguishable. Quiz selection is ephemeral page state: submit shows feedback, changing the choice clears it, and reload clears the selection. No answer is sent to the assistant or written to personal progress. Stable `qa-<id>` anchors open their disclosure; pending Q&A stays pending on concepts without actual discussion. Private source IDs and originals belong in the adopted private archive, not public page data.

For a source-faithful concept, `text.<locale>.sourceBody` can replace the section array while preserving ordered headings, paragraphs, lists and code. Keep `sections: []` in that locale. A `visual` source block wraps the existing `flow`/`cards` format with a local `/images/ceh/*.svg` download and label; all semantic figure text remains searchable. M04-07 demonstrates this pattern with an explicitly labeled web supplement alongside unchanged delivered text. Keep the source archive and the web supplement distinguishable.

The M04-01 Q&A examples place status cards and the SMB/Kafka architecture figures beside the matching source paragraphs. `QAIllustration.svelte` reflows text on mobile; its six inspectable SVG downloads are under `site/images/ceh/m04-01-qa-*`. Source labels remain searchable DOM text in their original order. The earlier combined SVG URLs remain available for existing links; the page presents the three requested figures once. Kafka data arrows branch from the broker to independent consumer groups; the caption separately identifies consumer fetch behavior.

## Content versioning — adopted October 25

Follow the [approved semantic content-version policy and legacy history](proposals/concept-content-versioning-2026-10-25.md). M04-01 uses `contentVersion: "2.0.0"` as an explicit migration baseline from legacy v8, retaining integer `revision: 8`. Other concepts keep their existing labels. Content version, revision, Git commit, deployment date and shared UI release have distinct meanings. Diagrams that only clarify existing wording are patch changes; new teaching content is minor. Original history and learner states remain intact.

### Historical M04-01 whole-page visual presentation patch

Version 2.0.1 (internal revision 9) adds eight optional visual aids while preserving all original body/Q&A wording, order and tests. [M0401Visual.svelte](../archive/ceh/m04-legacy-2026-11-04/src/lib/components/M0401Visual.svelte) reads [the bilingual visual manifest](../archive/ceh/m04-legacy-2026-11-04/src/lib/m0401-visuals.json); cards reflow from two columns to one at 540px, and ordered flows remain vertical. Originally these visual aids used closed disclosures. The October 25 direct-reading preference below supersedes that behavior: figures and their labels now render directly, including inside an opened parent Q&A. All labels join the concept search text. Sixteen fixed-layout SVG downloads remain separate from the reflowing HTML.

Coverage: five independent questions (no mandatory sequence); IP/port/protocol and distinct evidence; share plus NTFS permissions; protocol-information map; UNC parts; simplified SMB process; SMB/Samba/NAS roles; file/event/AI responsibilities. Existing status and SMB/Kafka diagrams remain. Commands, full source tables, API/audit details, risk prose and tests stay in their original form for copying and precise reading. No new conceptual conclusion is added, so this batch is one patch increment.

Chinese body placements currently refer to the preserved source block indices 8, 23, 47 and 79; English uses the existing section IDs. Q&A placements use matching source table/paragraph boundaries. When changing that source structure, review those mappings and verify the eight unique placements in both languages. The original source data is not rewritten to hold diagram summaries. Compare all source text and quiz data against the prior release, and confirm each added download is below 100,000 bytes and retains readable text within its viewBox.

## CEH direct-reading preference — October 25, 2026

The user explicitly requested that only actual Q&A retain expand/collapse. Apply this to CEH course teaching and navigation, not unrelated website sections. Render diagrams, prose, retained source material, lab/implementation steps, ASCII schematics, technical notes and dig line explanations directly. Do not use `details open` as a substitute: non-Q&A teaching has no collapse control. A figure inside an actual Q&A appears with its parent answer, without a nested figure disclosure.

`ConceptQA` remains the actual discussion disclosure. Ordinary concept checks show their answer/rationales directly; they are not reclassified as Q&A. Interactive `QuestionCard` tests retain answer selection/submission and post-answer feedback, which is assessment behavior rather than a presentation toggle. Its no-JavaScript answer fallback is directly visible. Keep all source sentences/order, stable anchors, selectable code, responsive HTML and independent SVG downloads. This shared UI-only change is recorded in site release history; lesson content editions and revisions remain unchanged.

## CEH answer and code presentation — October 27, 2026

This supersedes the October 25 rule only for explicitly supplied **reference answers to teaching checks**. Keep learner discussion in `qa` separate: publishing a reference answer is not a learner submission or evidence of understanding.

- All CEH code/output/ASCII blocks use a light background and dark text. The shared CEH page override uses `#f2f6f5` / `#18252c` (14.39:1 measured text contrast); unrelated courses are outside this change.
- Give teaching questions plain-language Traditional Chinese reference answers using Taiwanese phrasing. Put each answer in a native disclosure, closed initially; label it clearly as a reference answer. Keep a complete matching English answer on bilingual pages.
- A `sourceBody` answer is `{kind:'answer', id:'answer-...', summary:string, paragraphs:string[]}`. Its content remains searchable. It does not create a learner Q&A entry, store a response or advance progress.
- Body prose, tables, code, diagrams and procedural explanations remain directly visible, including diagrams inside an opened answer; no nested diagram disclosures.
- Preserve stable IDs/URLs and delivered history. New instruction to publish answers supersedes earlier “do not reveal answers” wording for the same supplied check. Record that editorial change, without implying the reader has learned it.

M01-02 v1.1.0 provides the seven-section example of this format. Retain independent content, code contrast, default-closed disclosure, keyboard and viewport checks. Never label an unexecuted browser check as passed.

## M09-03 spatial SVG reading model — October 29, 2026

The v1.2.0 revision preserves all four published primary manuscript/reference-answer
files byte for byte. Seven bilingual spatial figures replace the earlier visual
presentation, with separately labeled concept → diagram → example → mechanism →
limits guidance in `docs/sources/m09-03/spatial-reading-support.json`. One additional
three-part visual-reasoning exercise has a fifth closed reference answer; `qa`
remains empty. This is a minor content addition, not evidence of learner progress.

`ReviewedSvgVisual.svelte` renders only the assets registered by `reviewed-svg.ts`
(currently M09-03). It embeds only generated,
reviewed repository SVG markup; other concepts keep their existing renderer.
`scripts/m0903_svg.py` rejects non-allowlisted elements/attributes, active or external
content, CSS escapes/comments, duplicate or unscoped IDs, and unresolved references.
Unique title/description IDs support accessible inline figures. Do not replace
this boundary with arbitrary supplied HTML. Run `python3 scripts/build-m0903.py`
after editing approved assets/support; it regenerates the lesson, deterministic
ZIP, sanitized inline bundle, and searchable SVG labels. CI checks these exact
artifacts and the source-preservation contract.

The later October 29 column-fit presentation preference supersedes the initial
800px minimum canvas. All full teaching SVG figures must fit their available
column: `width:100%`, `max-width:100%`, `height:auto`, with the original `viewBox`
and proportional `preserveAspectRatio="xMidYMid meet"`. Do not impose a fixed or
minimum pixel display width, a fixed height, forced horizontal panning, or crop
the diagram to make it fit. The SVG drawing coordinates remain unchanged.

Uniform scaling also shrinks labels. Retain visible reflowing explanations and
an original-SVG zoom link; do not claim native 16px labels remain 16px at every
screen width. This is proportional scaling, not rearrangement of diagram nodes.
Existing `sourceImage` SVG images and MATLAB `figure img` already follow the same
column-fit rule. Decorative node icons and logos retain their intentional small
sizes; never apply an indiscriminate global `svg{width:100%}` rule.

This is a shared presentation update, not a lesson-content edition increment.
Original answers, prose and diagrams remain intact; only reference answers collapse.

Solid/conditional arrows, undirected concept lines, shared-control boundaries,
and evidence support have explicitly different meanings. In particular, code
disclosure is not proof of login or exfiltration; WebAuthn browser scope rejection
is distinct from RP assertion verification; no private key travels in the
authentication reply. Native pixel/geometry checks and static HTML checks are
recorded separately from browser/mobile/keyboard QA and production readback.

A later lesson may reuse this component by registering its separately validated
generated SVG map and adding exact-asset/safety tests. Keep namespace prefixes
unique per lesson, figure and language; never register raw external or runtime
user markup. Unregistered `visual` assets retain the existing semantic renderer.

## Perspectives extension

觀點專欄採完整中英雙語，使用獨立內容目錄與共用發布日期機制。選題、語氣、臺灣用語、白話教學、證據與校閱依[文章撰寫與編輯規範](perspectives/authoring.md)，工作稿使用[文章企劃與撰稿模板](perspectives/writing-template.md)。這套編輯流程適用於觀點專欄；教材沿用本文件既有規範。私人案例材料保存在忽略的本機目錄，合成預覽使用隔離建置。

## 全站共同規範

所有教學頁面遵循[文章與響應式閱讀規範](article-standards.md)。既有歷史規則有差異時，以共同規範的閱讀品質與收合要求為準；資料契約及原始教材保留要求持續適用。


## M01–M02 閱讀導引與可換行圖解

[逐篇導讀資料](../content/reading-support/ceh-m01-m02.json)以既有文章 ID 為鍵，每篇提供 `zh`、`en`，各包含 `goal`（主要學習成果）、`startingPoint`（起點）、`route`（閱讀順序）、`output`（可檢查的練習產物）。先核對原文實際教學內容，再撰寫四欄；不把新增練習寫成已完成的學習成效。這份資料由 [ArticleReadingGuide](../src/lib/components/ArticleReadingGuide.svelte)直接輸出語意 HTML，並納入既有發布閘門後的搜尋索引。

導讀屬於文章版本的一部分。依 11/01 使用者確認，閱讀改善也須更新文章版本與修訂日期；保留原始稿件、正文、來源查核日期、題目答案及 SVG。未完成的 M02 後續概念不因導讀機制而發布。

[圖解文字產生器](../scripts/build-readable-diagrams.py)將 M02 的原圖標籤匯出為 [可換行文字資料](../src/lib/m01-m02-readable-diagrams.json)。相鄰文字僅按原圖矩形歸組，維持來源順序，不從座標推導箭頭、因果或流程。M01-07 使用已有的[雙語圖解資料](sources/m01-07/diagram-data.json)，搭配保留的四張中文原圖。既有 HTML 圖解持續採原元件。

修改圖解後執行 `pnpm run generate:readable-diagrams`，核對描述、標籤、分組與原圖；`python3 scripts/build-readable-diagrams.py --check` 檢查產物同步。`ReadableDiagramText` 只輸出文字，不接受任意 SVG／HTML；原 SVG 仍經既有受審核邊界。重排文字直接可見，參考答案才使用原生收合。

驗收入口：`pnpm run test:browser:m01-m02`。測試包含 32 頁四種寬度、200% 根文字大小、鍵盤順序、原生收合、局部捲動、無 JavaScript 與原圖下載。另執行既有內容、型別、單元、發布閘門及靜態發布檢查。結果與範圍見 [M01–M02 改善紀錄](releases/2026-11-01-m01-m02-readability.md)。


## 文章日期資訊列

依 [WRITE-06](article-standards.md#原發布版本與修訂日期write-06)維護日期；由 [ArticleMetadata](../src/lib/components/ArticleMetadata.svelte)統一呈現。概念文章使用 `publishedOn`、`contentVersion`／`revision`、`date`；觀點使用 `publishedOn`、`contentVersion`、`updatedOn`，內部 `revision` 不作顯示版號。章節教材新增可選 `contentVersion` 與 `revisedOn`，校對仍使用 `reviewedOn`；`revisedOn` 必須是有效日期且不早於原發布日。舊章節缺修訂紀錄時省略，不把 `reviewedOn` 改當修訂日。

閱讀改善視為文章版本更新，依影響提升 patch／minor／major 並同步修訂日期；不新增獨立「閱讀更新」欄位。原稿、全文順序及原發布日保留。共享元件變更需列出實際影響文章，依同一規則判定，不能以 UI-only 為由跳過版本記錄。本次三篇舊章節 `v1` 明確以 1.0.0 作語意基準，閱讀修訂採 `v1.0.1`、內部 revision 2；歷史 v1 標示仍由 Git 保留。MATLAB 靜態原稿依既有保留要求維持原檔，後續有文章修訂需求時依同規範處理。

11/01 版本規則優先於本文件早期「shared UI-only release 不改教材版本」的做法；舊段落作為歷史保留，新修訂遵循 [WRITE-06](article-standards.md#原發布版本與修訂日期write-06)。純重新建置或部署仍不升版。

授權發布後，使用 `CEH_READING_BASE_URL=https://learn.cs-kairos.com pnpm exec playwright test --config playwright.m01-m02.config.ts` 對正式站重跑同一組驗收；正式站證據寫入 `.local/m01-m02/live/`，本機結果另存。測試不會自行部署。

## 結構化記憶體與分層圖解

新增 `cells`、`stages`、`layers`、`reference`、`lifetime`、`access-path` 版型及受限 cells／released 欄位，契約、響應式規則與驗收統一依[圖解設計規範](diagram-design-system.md)。新增教學範圍與版型的實作見[記憶體基礎回執](releases/2026-11-01-nas-memory-foundations.md)。

## M02-06 網路角色圖與 CIDR 模擬器

此實作已採納為共用圖解參考模式；設計選擇、復用邊界與新互動驗收依[FIG-06／INT-01](diagram-design-system.md#m02-06-網路圖解與互動準則)。以下保留 M02-06 專屬資料及生成流程。

M02-06 v1.1.0 直接替換第 2–4 節，第 8 節承接查詢練習與整合案例；第 5–7、9 節及原始 SVG／ZIP 保留。[修訂驗收](releases/2026-11-01-m02-06-network-revision.md)記錄採用範圍與來源差異。

六張新圖沿用 `sourceBody.visual`，以已知 `/images/ceh/m02-06-<layout>-<lang>.svg` 路徑選取 [雙語圖解資料](../src/lib/m0206-network-diagrams.json)。版型只接受 network-map、prefix-bits、private-network、bgp-routing、cdn-origin、proxy-modes；節點數依序為 4、4、4、3、4、5。資料含 caption、description、nodes（title／body／tone）、labels、footer；兩語節點順序一致，IP、ASN 與位元數一致。任意路徑不會啟用新渲染器，文字由 Svelte 跳脫，不接收任意 HTML 或 SVG 標記。

[NetworkDiagram](../src/lib/components/NetworkDiagram.svelte)用語意 HTML 與容器查詢重排；群組保留平行設備、條件回源、控制面與資料面差異。獨立 SVG 由 [產生器](../scripts/m0206_network.py)讀取同一資料，以固定桌面座標呈現，再經既有嚴格 serializer 產生受審核檔案。新圖使用原生 HTML 正文，不重複展示整張縮小的 SVG；舊 Traceroute 與證據流程圖繼續使用 ReviewedSvgVisual。

[CidrExplorer](../src/lib/components/CidrExplorer.svelte)只計算固定 192.0.2.25 的 /24–/30；使用原生 range、可見標籤、鍵盤與 aria-live。無 JavaScript 時控制停用，/24 預設計算仍可閱讀。此模擬不發出網路請求、修改設定或保存學習進度。理解題使用既有原生參考答案收合，不提供虛構的送出／評分功能。

維護順序：

```sh
python3 scripts/m0206_network.py
python3 scripts/m0206_svg.py
python3 scripts/m0206_content.py
pnpm run generate:readable-diagrams
pnpm run validate:content
pnpm test
pnpm run check
node scripts/check-publication-boundary.mjs
pnpm run validate:release
pnpm run test:browser:m0206
```

第二步同步十二張新下載圖、原有受審核註冊表及獨立 network-svg.zip；不改寫原 bilingual-svg.zip。`--check` 驗證來源圖、序列化輸出與 ZIP 確定性。英文換行保留完整詞；瀏覽器檢查 SVG 文字在 viewBox 內且不與箭頭交疊。圖號 1–6 是這次網路角色補充的內部順序，舊圖以原標題辨識；stable section-* 錨點與既有課程路線保留。

## M03-01 隨文傳輸圖解（2026-11-03）

[M03-01 v1.1.0 修訂回執](releases/2026-11-03-m03-01-transport.md)記錄九節正文替換、三題參考答案、四張參考圖與原版保存。[正式圖解模型](sources/m03-01/diagram-models.json)只含 overview、handshake、transport、tuple 四種版型，兩語節點數依序為 3、3、2、5；端點與 TCP 交握方向、TCP 重傳及 UDP 遺失須共同驗證。

`python3 scripts/m0301_diagrams.py` 產生受限資料副本與來源 SVG；再依序執行 `m0301_svg.py`、`m0301_content.py`。SVG 沿用既有 fail-closed serializer，viewBox 維持 900×624，繪圖座標以等比 transform 保留參考圖比例。`TransportDiagram.svelte` 使用同一份資料輸出可選取 HTML，窄欄重排，不把縮小 SVG 當成手機正文。下載 SVG 與 ZIP 保留桌面關係；來源原版在 `archive-v1.0.0/`。

驗收：內容、單元、型別、發布邊界、靜態輸出，加上 `pnpm exec playwright test --config playwright.footprints.config.ts`。圖解原生顯示，三題參考答案預設收合；`qa` 維持空陣列。原發布日不變，修訂與學習進度分開記錄。

## M03-02 ICMP／ARP 白話教學與比較圖

v1.1.0 依 2026-11-03 供稿替換主機探索、ICMP、ARP 說明，補充 Ubuntu 觀察練習與三題情境檢核；原發布日與 section-1 至 section-9 保留。兩語各七個原生參考答案預設收合，`qa` 仍為空。原稿與參考圖保存於 [來源紀錄](sources/m03-02/revision-2026-11-03.md)。

[discovery-diagrams.json](sources/m03-02/discovery-diagrams.json)只提供兩種已知版型：outcomes 為三張卡，next-hop 為兩張卡；每卡含 2 或 3 個 endpoint（title、address）、相鄰節點的有向 edge（source、target、label、solid／dashed）、claim 與 notes。ICMP 前兩卡有去回兩條 edge，第三卡只有送出但未確認交付的虛線。ARP 本地卡去回兩條 edge，遠端卡依序交付閘道與遠端；後者是資料轉送，不是 ARP 跨路由器。

產生器驗證關係與純資料，HTML 與 SVG 共用同一來源。`DiscoveryDiagram.svelte` 僅依四個已知資產路徑選取模型，以 Svelte 跳脫文字；不接受任意 SVG 或 HTML。650px 以上圖欄並排比較，較窄時按 DOM 順序重排；各卡寬度不足時 endpoint 與方向箭頭改成直向。原圖保留參考圖的桌面分組與雙向／轉送關係，採 852×600 viewBox 與內部等比例座標，沿用既有 SVG sanitizer，不放寬審核邊界。原圖下載可放大，HTML 節點保持正文大小。

維護順序：

```sh
python3 scripts/m0302_discovery.py
python3 scripts/m0302_svg.py
python3 scripts/m0302_content.py
pnpm run validate:content
pnpm test
pnpm run check
node scripts/check-publication-boundary.mjs
pnpm run validate:release
pnpm run test:browser:m0302
```

新圖四份 SVG 可逐張下載；舊八份 SVG 與原 ZIP 保留。`m0302_discovery.py --check` 驗證來源 SVG 與 HTML 模型同步，`m0302_svg.py --check` 驗證受審核產物與搜尋標籤。瀏覽器驗收檢查雙語四尺寸、200% 文字、無 JavaScript、鍵盤操作、下載位元組與 SVG 文字邊界。依專案 AGENTS.md，文章修訂包含該次修改的提交與部署授權；完成驗證後接續發布，再執行正式站回讀。本機驗收不能代替正式站回讀。[修訂回執](releases/2026-11-03-m03-02-discovery.md)


### M03-02 ARP 補充 v1.2.0

[ARP 補充回執](releases/2026-11-03-m03-02-arp-supplement.md)記錄 5–6 節旁文、8.3–8.4 查詢／學習路線及 9.2 四題整合檢核；兩語各十一題參考答案。圖 1／2 及全部 visual 區塊、ICMP 第 1–4 節、原七題答案保留，以來源目錄的雜湊與 v1.1.0 JSON 比對。此次只需執行 `m0302_content.py` 產生教材；圖解產生器以 `--check` 驗證，無需改寫既有圖檔。

## M03-03 掃描判讀與本機範例

M03-03 v1.1.0 的四張隨文圖使用 `src/lib/m0303-scan-diagrams.json`，由 `ScanDiagram.svelte` 顯示可換行 HTML，`scripts/m0303_diagrams.py` 產生同資料 SVG，再由 `scripts/m0303_svg.py` 經既有嚴格 serializer 匯出與封裝。限定 connect／syn／udp／positions；兩種 TCP 流程方向固定 right、left、right，最後分別為 ACK、RST；UDP 四卡為替代結果，位置三列為獨立路徑。來源文稿經 `scripts/m0303_content.py` 轉為既有 sourceBody，保留標題與答案錨點。舊 footprint 註冊移除本課，避免重複呈現過期圖解。

維護時依序執行三支 m0303 產生器、`pnpm test`、`pnpm run check`、發布邊界及 release 檢查，再用 `pnpm exec playwright test --config playwright.m0303.config.ts` 驗收。正式站設 `CEH_BASE_URL=https://learn.cs-kairos.com`。來源與差異見 [source review](sources/m03-03/source-review.md)，驗收見 [修訂回執](releases/2026-11-03-m03-03-replacement.md)。

## M03-04 狀態判讀 v1.1.0

來源與舊版保存在 [source review](sources/m03-04/source-review.md)所列目錄。修改兩語 Markdown 後執行 `python3 scripts/m0304_content.py`；本次沿用全部受審核圖，不需重製 SVG。依序完成內容、單元、型別、發布邊界及 release 驗證，再執行 `pnpm exec playwright test --config playwright.m0304.config.ts`；正式站以 `CEH_BASE_URL=https://learn.cs-kairos.com` 回讀。驗證範圍與限制見[修訂回執](releases/2026-11-03-m03-04-replacement.md)。

### M03-04 v1.1.1 小節完整性

依使用者更正，供稿各章內的小節必須完整呈現，不能用章級摘要取代。`detailed-section-map.json` 對應 64 個中英標題；中文全文以原供稿加上 `detailed-editorial-changes.json` 的明列修正核對。沿用既有 h2／h3 sourceBody，不改共用渲染器；33 個命令／ASCII 區塊保留可選取文字與鍵盤局部捲動。[本次回執](releases/2026-11-03-m03-04-detailed.md)取代上一版對教學深度的完成主張。

## M03-05 完整服務辨識教材 v1.1.0

供稿完整保存在 [來源目錄](sources/m03-05/README.md)，63 個雙語章節／小節以 detailed-section-map.json 對應；中文全文依原稿加明列技術修正核對。修改兩語 Markdown 後執行 `python3 scripts/m0305_content.py`，原有圖解僅以 `m0305_diagrams.py --check` 核對。完成內容、單元、型別、發布邊界及 release 檢查，再用 `pnpm exec playwright test --config playwright.m0305.config.ts` 驗收；正式站設定 CEH_BASE_URL。本機實測、四個答案、原圖保存與部署界線見[修訂回執](releases/2026-11-03-m03-05-replacement.md)。


## M03-06 完整作業系統指紋教材 v1.1.0

[來源紀錄](sources/m03-06/README.md)保留原供稿、v1.0.0 舊版、69 個雙語章節／小節對照及明列修正。編輯兩語 Markdown 後執行 `python3 scripts/m0306_content.py`；兩張既有圖及四題參考答案保留，圖檔以 `m0306_diagrams.py --check` 核對。來源全文對照、單元、型別、發布邊界與 release 通過後，執行 `pnpm exec playwright test --config playwright.m0306.config.ts`，正式站設定 `CEH_BASE_URL`。沿用 sourceBody 標題與原生局部捲動，不新增框架；[修訂回執](releases/2026-11-03-m03-06-replacement.md)區分本機與正式驗收。

## M03-07 完整 Nmap 教材 v1.1.0

[來源紀錄](sources/m03-07/README.md)保留完整供稿、v1.0.0 原版及逐項修正，31 個雙語章節／小節以 detailed-section-map.json 對應。修改兩語 Markdown 後執行 `python3 scripts/m0307_content.py`；四張共用模型圖以 `python3 scripts/m0307_diagrams.py` 產生，兩者皆支援 `--check`。完成內容、單元、型別、發布邊界及 release 驗證，再用 `pnpm exec playwright test --config playwright.m0307.config.ts` 驗收；正式站設定 `CEH_BASE_URL`。[修訂回執](releases/2026-11-03-m03-07-replacement.md)區分本機實測、發布回讀及參考圖結構比對。

## 新版 M04 第一課（2026-11-04）

`CEH26-M04-C01` 使用正式網址 `concepts/m04-01/`，顯示別名為 `CEH M04-01`；內部 stable ID 與舊教材分開，舊正文不恢復。完整雙語原稿、單題參考答案與雜湊在 [來源目錄](sources/ceh26-m04-c01/README.md)。以 `python3 scripts/ceh26_m04_c01_content.py --check` 核對原稿產物。沿既有 sourceBody 與 publication gate，qa 為空；參考答案不代表學員回答。C03–C10 仍只有目錄。當前目錄公開數量依 catalog 計算；歷史全待發布狀態保留在遷移回執。

### M04 公開 slug 契約

依使用者明確要求，`conceptSlug` 將內部 `CEH26-M04-C01…C10` 對應到 `m04-01…m04-10`，`conceptPath` 是路由、目錄、導覽、搜尋與 sitemap 的共用入口。不要以公開 slug 反推 stable ID，也不要建立 legacy teaching ID。catalog 檢查公開路徑碰撞；沒有公開 teaching 的項目仍只有目錄錨點。中英相同規則；原 `/concepts/ceh26-m04-c01/` 明確 404，不產生第二份正文或另設 client-only redirect。canonical／hreflang／page JSON 均指向目前正式 slug。網址修正以 C01 v1.0.1 記錄，原發布日保留，正文／原稿與 qa 不變；[遷移回執](releases/2026-11-04-m04-public-slugs.md)保留先前網址歷史。

## 新版 M04 第二課 DNS（2026-11-04）

`CEH26-M04-C02` 顯示為 `CEH M04-02`，公開路徑固定 `concepts/m04-02/`，不公開 ceh26 前綴 slug。完整繁中原稿 SHA-256 為 `744c93e7d07c7a82131aaae007957decd1dccf4a6339c2322feda45d67c9471d`，與英譯及參考答案保存在[來源目錄](sources/ceh26-m04-c02/README.md)。執行 `python3 scripts/ceh26_m04_c02_content.py --check` 核對既有 sourceBody 產物。十一節正文直接顯示，唯一參考答案預設收合；qa 為空。C01 不變，C03–C10 保持待發布，舊 DNS 原稿／Q&A／SVG 留在非輸出歸檔。

### M04-02 完整供稿與兩張參考圖 v1.1.0

[修訂來源](sources/ceh26-m04-c02/revision-2026-11-04/README.md)保留本次完整供稿、兩張PNG及v1.0.0原版；75個雙語章／小節錨點承接完整教學，舊section-1至section-11繼續有效。先修改完整雙語稿、逐節對照與圖解資料，再執行ceh26_m04_c02_diagrams.py及ceh26_m04_c02_content.py；兩者支援--check。verify-ceh26-m04-c02.py逐行核對中文採用界線與雙語來源至資料的順序。圖解使用既有visual模型，只有四個dns-*-v1-1-0.svg已知路徑啟用DnsEvidenceDiagram；文字由Svelte跳脫並納入既有搜尋。主文與圖解直接顯示，四題編輯參考解答沿answer-dns-evidence原生收合，qa維持空陣列。新版公開slug、C01與C03–C10發布閘門保留。驗收與發布見[v1.1.0回執](releases/2026-11-04-ceh26-m04-c02-full-replacement.md)。

## 新版 M04 第三課 FTP／SMTP（2026-11-04）

`CEH26-M04-C03` 沿用短網址 `concepts/m04-03/`；完整中英原稿、答案與雜湊在 [來源目錄](sources/ceh26-m04-c03/README.md)。執行 ceh26_m04_c03_content.py 與 ceh26_m04_c03_diagrams.py 的 --check 核對全文、兩組平行角色／權限圖及下載。十一節正文直接呈現，一題答案預設收合，qa 維持空陣列。C01、C02 正文不變，C04–C10 待發布，舊版歸檔不公開。[發布紀錄](releases/2026-11-04-ceh26-m04-c03.md)。

## AASE v1 獨立系列（2026-11-05）

AASE 使用 `content/aase/course.json` 的九模組、49 概念目錄及獨立 `AASE-Mxx-Cyy` 識別碼，不共用 CEH 的 Mxx-yy 正本。教材寫於 `content/aase/lessons/`，來源位於 `content/aase/sources.json`。`src/lib/aase.ts` 驗證欄位、日期、情境答案與課程總量，沿用 `isPublic` 的狀態／日期閘門；目錄的 `pending` 是規劃狀態，是否可閱讀由通過閘門的教材決定。

初批明確為繁體中文先行；該批沒有英文路由、語言切換或虛構英文 alternates。後續雙語能力依下方「AASE 雙語出版」契約；未完成的概念仍不產生英文頁。未發布正文不進頁面資料、導覽或搜尋。概念前後篇尚未完成時，連到對應模組錨點；不產生空白教材頁。既有 CEH 雙語及 SVG 邊界保持原契約。

`AaseLesson.svelte` 沿共用 `TeachingArticle` 呈現結構化文字與程式碼，圖解使用 CEH 的 flow／cards 與 `ConceptBlocks`；不接受原始 HTML／SVG 注入。圖解的節點與搜尋文字來自同一教材資料，手機重排，答案用原生 details。讀者自我檢核不記錄成績，不冒充互動測驗或實作通過。

工作坊正本在 `resources/aase/`；起始骨架與教師參考解答分開。`pnpm run package:aase` 產生固定時間戳 ZIP 與 SHA256；`python3 scripts/package-aase.py --check` 核對每個檔案與位元組。修改工作坊後重新封裝。新增產業案例只用合成資料及核實的規則，不複製整套工程教材。

驗證：內容、單元、型別、`node scripts/check-publication-boundary.mjs`、`pnpm run validate:release`；另執行工作坊 pytest 與 `pnpm run test:browser:aase`。瀏覽器設定會啟動本機靜態網站與 Streamlit，需先依資源 README 安裝 `.local/aase-venv`。正式站以 `AASE_BASE_URL=https://learn.cs-kairos.com` 回讀網站與下載；遠端模式明確跳過本機 Streamlit 測試，不把靜態代管視為 Python 後端。

### AASE 與 CEH 共用版型、欄位（2026-11-05）

依使用者要求，兩套教材透過 `TeachingArticle.svelte` 共用摘要、資訊列、閱讀導引、本文目錄、`article.prose`、概念 Q&A 及 `.next-links`，透過 `CourseRail.svelte` 共用章節側欄。版型不硬寫課程名稱或 CEH 路徑；AASE 以自己的模組、stable ID 與網址傳入，CEH 原識別碼及內容保留。

AASE 四篇資料升為 v1.0.1，對齊 CEH 的 `id`、`revision`、`contentVersion`、`date`、`publishedOn`、`status`、`text.zh.summary`、`text.zh.sections`、`checks[].text.zh`、`qa[].text.zh`。段落沿 `id`／`heading`／`paragraphs`，圖解與步驟使用同一 `ConceptBlock` 型別及 `ConceptBlocks.svelte`；檢核題沿零起算 answer、四選項與四解析。AASE 額外保留 `text.zh.objectives`、`exercise`、`readingGuide` 與來源欄位，讓原有學習證據仍可編輯及搜尋。`revisedOn` 改為 CEH 的 `date`，正文不再放在頂層。遷移前原稿見 [保存紀錄](sources/aase/layout-2026-11-05/README.md)。

`qa` 代表收到的實際問題，與編輯理解檢核 `checks` 分開；版型遷移的四篇均為 `[]`，顯示與 CEH 相同的待補訊息。單語 Q&A 由共用元件依現有語言顯示，支持 question、originalQuestion、answer、explanation、editorial 及既有受限 Markdown 格式；不產生假英文。CEH 原有雙語驗證不放寬，該批 AASE 驗證只接受已確認的繁中欄位；後續英文欄位與逐語言閘門見下方雙語契約。

維護時執行既有內容、型別、單元與發布邊界；AASE 瀏覽器測試比對兩課程的共用欄位、實際計算樣式與側欄目的地。因觸及共用教材元件，另執行 `pnpm exec playwright test --config playwright.ceh26-m04-c02.config.ts`，確認 CEH 雙語、Q&A、SVG 下載及短網址保留。[本次回執](releases/2026-11-05-aase-ceh-layout.md)


## 新版 M04 第五課 NetBIOS／RPC（2026-11-05）

`CEH26-M04-C05` 使用 `concepts/m04-05/`，完整雙語、兩份原始輸入與 SHA-256 在[來源目錄](sources/ceh26-m04-c05/README.md)。執行 `python3 scripts/ceh26_m04_c05_content.py --check` 核對全文；七節正文直接可讀，一題原生參考答案預設收合，qa 空陣列。C05 初次發布集合為 C01–C03、C05；C04 同步後目前為 C01–C05，C06–C10 仍 pending。C05 前一項連至 C04 正文，後一項連至 C06 待發布目錄錨點，舊 stable-ID URL 與舊教學歸檔不公開。[回執](releases/2026-11-05-ceh26-m04-c05.md)區分本機驗收、已知共用側欄200%文字差距及正式發布。

### AASE 架構圖區塊（2026-11-05）

AASE章節正文可使用受限`architecture`區塊，外層教材欄位及CEH版型不變。`AaseBlocks`只將新區塊交給`ArchitectureDiagram`，原flow／cards／table／step仍交給未修改的ConceptBlocks；CEH資料型別、驗證與渲染器不放寬。

正式模型與驗證在src/lib/architecture-diagram.ts：level限定context／container；caption、description、boundary為文字；nodes為2–8個唯一id／title／body／kind／inside；relations為1–12條from／to／label。kind限定person、software-system、container、data-store；拒絕多餘欄位、未知端點、自連、重複及未連結節點。Context恰有一個系統內software-system，每個外部節點都須直接連到該主系統；在此條件下允許外部節點間的補充關係（例如M06-02郵件服務→顧客）；Container內只接受應用容器或資料儲存，不以檔名自動視為服務。

HTML按系統範圍分組節點，再呈現可讀的方向關係列；容器查詢重排雙欄與箭頭，文字與搜尋由同一資料產生。沒有任意HTML／SVG、座標、事件或圖片路徑，也沒有新增SVG匯出。圖例需明說系統範圍不代表安全信任邊界，關係列不表示時序。標籤元件支持zh／en，該批AASE正文僅已確認繁中；後續英譯由雙語契約逐篇開放，不因元件有英文標籤就產生路由。

執行architecture-diagram.test.ts的資料拒絕與搜尋／發布測試、既有內容／型別／發布邊界／release及AASE瀏覽器檢查。瀏覽器逐節核對節點分組、關係端點與標籤，四尺寸、200%文字、無JavaScript及手機／桌面圖解；同時保留原教材與CEH回歸。[發布回執](releases/2026-11-05-aase-m06.md)記錄實際影響及未驗事項。

### 英文共用課程導覽（2026-11-05）

英文 .with-rail 側欄與前後篇連結使用 overflow-wrap:anywhere；900px 以下 rail-content 高度上限為 10rem，540px 以下前後篇直向排列。維持完整標題、目的地及局部捲動，不以隱藏文字或省略號解決溢出。中文不匹配本次樣式。修改後執行 `pnpm exec playwright test --config playwright.course-rail.config.ts`，正式站設定 RAIL_BASE_URL；涵蓋 CEH 中英、AASE 中文、有／無 JavaScript、四尺寸及 200% 根字級。

53 筆 CEH 資料依 WRITE-06 提升 patch，原發布日及非版本內容雜湊保留；17 筆舊式 lesson 的語意版號遷移基準另記。[回執](releases/2026-11-05-english-course-navigation.md)及[逐筆清單](releases/2026-11-05-course-navigation-versions.json)保留版本來源。M03-02 歷史 CSS 雜湊核對修訂前保存檔，不改寫原雜湊。該次導覽修正未開啟 AASE 英文全文或路由；後續開放狀態依下方契約及回執。

### AASE 雙語出版（2026-11-05）

中文課綱仍在 course.json；course.en.json 提供相同九模組／49 stable ID 的英文目錄文字，依 ID 與順序核對，不能覆寫分鐘、深度或 slug。英文課程本身有 status／publishedOn；各篇 AaseLesson 的 text.en 及 checks[].text.en 完整後，另附 translations.en.status／publishedOn，並受原文章全域狀態／日期約束。translations.en.publishedOn 控制英文開放時機；資訊列仍以兩語共用的原 publishedOn、contentVersion 及 date 呈現，不把翻譯閘門日期冒充版本修訂日。

forLanguage(lang) 只投影當前語言的公開正文、解析及實際 Q&A，不以中文代填英文。課程關閉時沒有英文路由／搜尋；翻譯缺件、draft 或 future 時只有目錄項目，前後篇落至該語言模組錨點。真正成對的頁面才有 language link 與三個 alternates，canonical／sitemap／搜尋共用 catalog。qa 可保留尚未翻譯的實際中文問題，英文只呈現已翻譯者；無問題就保留空陣列。

兩語章節 ID、順序、段落數、目標與練習步數、區塊形狀、程式碼、來源 ID、圖解節點／關係及答案鍵對應。驗證器的結構核對不取代編輯語意核對。ArchitectureDiagram 與搜尋文字接收同一語言參數。來源與前版保存依 WRITE-04／06；初批 M01-01 v1.0.2 保留中文正文與檢核並新增英譯；後續 M01-02–04 各升 v1.0.1，原中文同樣不改，M01 四篇英文齊備，M02 六篇亦新增對應並升 v1.0.1；M03 五篇新增完整對應（M03-01 升 v1.0.3，其餘四篇 v1.0.1），M04 六篇新增完整對應（M04-05 升 v1.0.2，其餘五篇 v1.0.1），M05 五篇新增完整對應（M05-03 升 v1.0.3，其餘四篇 v1.0.1），M06 六篇新增完整對應並升 v1.0.1，M07 七篇新增完整對應並升 v1.0.1，M08 六篇新增完整對應並升 v1.0.1，M09 四篇新增完整對應並升 v1.0.1，中英文 49 篇正文均已實作。詳細出版狀態見 [M01 英文回執](releases/2026-11-05-aase-m01-en.md)、[M02 英文回執](releases/2026-11-05-aase-m02-en.md)、[M03 英文回執](releases/2026-11-05-aase-m03-en.md)、[M04 英文回執](releases/2026-11-05-aase-m04-en.md)及 [M05 英文回執](releases/2026-11-05-aase-m05-en.md)、[M06 英文回執](releases/2026-11-05-aase-m06-en.md)、[M07 英文回執](releases/2026-11-05-aase-m07-en.md)、[M08 英文回執](releases/2026-11-05-aase-m08-en.md)、[M09 英文回執](releases/2026-11-05-aase-m09-en.md)。

先跑內容、單元、型別，再執行 publication-boundary（含英文課程與翻譯 draft／future 的真正建置）及 release；接續 `pnpm exec playwright test --config playwright.aase-bilingual.config.ts`、完整 AASE 及 CEH 共用版型回歸。正式站以 AASE_BASE_URL 執行新套件。測試輸出與建置不可同時改寫同一產物目錄；先等建置結束再啟動瀏覽器。英文工作坊 HTML 與 ZIP 內語言分開核對，未翻譯 ZIP 必須明示。[發布回執](releases/2026-11-05-aase-bilingual-foundation.md)記錄實際範圍。

## 新版 M04 第四課 SMB 複習與診斷（2026-11-05）

`CEH26-M04-C04` 使用短網址 `concepts/m04-04/`；完整中英公開稿、單題答案、六個雙語錨點與雜湊在 [來源目錄](sources/ceh26-m04-c04/README.md)。執行 `python3 scripts/ceh26_m04_c04_content.py --check` 核對全文。沿用 sourceBody，本文直接閱讀、參考答案預設收合、qa 為空。以文字及清單呈現拒絕階段、實際身分與傳輸保護；本次無新增圖解或互動。C01–C03 與 C05 正文保留，C06–C10 待發布，舊版歸檔不公開。[驗收與發布紀錄](releases/2026-11-05-ceh26-m04-c04.md)。

### M04-04 全文抽換與標題（2026-11-05）

依 WRITE-08，C04 的公開 `displayId` 為 `M04-04`，內部 `CEH26-M04-C04` 與短網址保留。資料驗證接受既有 `CEH M04-xx` 及新 `M04-xx` 顯示值，仍須與 stable ID 課次一致；後續修訂採新格式。

完整原文、參考 PNG、編輯處理與英文稿在 [抽換來源](sources/ceh26-m04-c04/replacement-2026-11-05/README.md)，舊稿保留原處及 Git 歷史。執行 `python3 scripts/ceh26_m04_c04_content.py --check` 核對雙語正文與四個 SVG。v1.1.0 增加完整教學範圍，原發布日不變。正文為十一章、十一個表格、39 段程式／文字範例、兩圖及四題理解檢核；一個預設收合的編輯參考答案，qa 保持空陣列。

圖解沿既有 `visual` 資料形狀；固定四個 `m04-04-{stages|evidence}-{zh|en}-v1-1-0.svg` 路徑交由 `SmbDiagram` 以跳脫文字呈現。flow 是五個依序關卡，每卡一個成功範圍及推論界線；cards 是五筆三欄證據對照，手機逐筆堆疊。SVG 僅由固定元素、幾何與跳脫文字產生，再經既有 `m0903_svg` sanitizer，沒有任意標記、影像或事件。HTML、搜尋及 SVG 來自同一資料；SVG 固定桌面版面，頁面 HTML 依容器重排。

內容、單元、型別、publication-boundary、release 及 C04 瀏覽器檢查依序執行；共用 SourceBody 另跑 C02 回歸。驗證與正式站回讀見 [本次回執](releases/2026-11-05-ceh26-m04-c04-replacement.md)。

### M04-05 完整 NetBIOS／RPC 教學 v1.1.0

[替換來源](sources/ceh26-m04-c05/replacement-2026-11-05/README.md)保存完整供稿、三張參考 PNG、前版與明列公開稿調整。38 個中英章／小節、9 表、37 個程式／文字區塊均沿 sourceBody；公開課次 M04-05，stable ID 與 slug 保留。三張圖由 diagram-models.json 提供 HTML、搜尋與 SVG 文字；RpcEvidenceDiagram 只接六個已知圖檔路徑，rpc-diagram-groups.json 定義平行三卡／兩卡、五階段流程與底部界線，窄欄直向重排。SVG 產生器沿既有 sanitizer。先執行 ceh26_m04_c05_content.py、ceh26_m04_c05_diagrams.py，再以 verify-ceh26-m04-c05.py 核對完整來源、錨點、雜湊及產物。三題編輯參考答案沿既有原生收合，qa=[]。驗收與發布見 [回執](releases/2026-11-05-ceh26-m04-c05-full-replacement.md)。

### AASE 公開課次與模組篇數（2026-11-05）

依 WRITE-08，`aase-labels.ts` 共用讀者課次與標題；stable ID、URL 與 readingId 保留。主標題、資訊列、目錄、前後篇及搜尋使用 `Mxx-yy`，課程名稱仍在導覽與站點資訊。`AaseCourse` 依目前模組篩選可用概念，僅存在未開放概念時顯示準備中。49 筆各升 patch，正文、圖解、來源、原發布日期及翻譯閘門不變；[本批回執](releases/2026-11-05-aase-short-titles.md)記錄實測及發布狀態。

### M04-03 完整白話教學 v1.1.0（2026-11-05）

[抽換來源](sources/ceh26-m04-c03/replacement-2026-11-05/README.md)保存完整供稿、兩張 PNG、修訂前 JSON 與明列公開稿調整。公開 displayId 為 M04-03，stable ID／slug 與 2026-11-04 原發布日保留；十一章之外完整保留第二部分、重點整理與理解檢核。中英各 330 區塊、6 表、22 段命令／文字範例，五段編輯解答沿單一原生收合，qa=[]。

兩圖沿 visual 模型，只在四個 m04-03-{protocols|evidence}-{zh|en}-v1-1-0.svg 固定路徑啟用 FtpSmtpDiagram。第一圖保留 FTP 雙通道及 SMTP 三角色／兩段連線；第二圖三張卡並列判讀。手機按相同分組重排，不將平行通道／證據分類轉成先後流程。兩語同一模型供 HTML、搜尋及 SVG，SVG 經既有 sanitizer；原有圖檔與 ZIP 保留歷史，不覆寫。

執行 ceh26_m04_c03_content.py、ceh26_m04_c03_diagrams.py 的 --check，再依內容、單元、型別、publication-boundary、release、C03 瀏覽器與 C02 共用元件回歸順序驗證。正式站設定 CEH_BASE_URL，回讀兩語正文與四個 SVG；實測與未驗界線見[本次回執](releases/2026-11-05-ceh26-m04-c03-replacement.md)。

<a id="aase-m0101-replacement-2026-11-06"></a>
### AASE M01-01 完整供稿與表單比較（2026-11-06）

M01-01 v1.1.0 的[完整來源與逐節對照](sources/aase/m01-01/replacement-2026-11-06/README.md)保留原文、兩張 PNG、前版 v1.0.3 與雜湊。正文沿既有 AASE 結構，導言及七節、兩表、AppTest h3 與四選項有完整中英對應；stable ID、slug、原發布日、練習、QA 與翻譯閘門保留。舊的版型／英文初版／短標題遷移測試核對前版保存檔，新版另由 aase-m0101-replacement.test.ts 核對來源與修訂範圍，不改寫歷史原稿。

ApplicationCheckDemo 只在本課 analogy 與 scenario 啟用，表單對照接收現有 cards 資料；其餘 AASE blocks 與 CEH 不改。比較圖以 HTML／CSS 保留平行關係、輸入欄位、主要／次要操作及錯誤摘要／欄位提示；無任意 HTML／SVG，沒有新匯出格式。情境控制只切固定合成資料，本機 JSON 匯出由 applicationReport 核對三個非空白欄位，缺漏時不提供下載。無 JavaScript 保留預設缺漏與兩情境結果表，停用控制；不發請求、不寫入申請或成績。

維護時依序執行內容、單元、型別、publication-boundary、release，以及 `npx playwright test --config playwright.aase-m0101.config.ts`；正式站設定 `AASE_BASE_URL`。共用 AaseLesson 改動另核對既有 AASE bilingual M01-01 與 CEH C02 回歸。[修訂回執](releases/2026-11-06-aase-m01-01-replacement.md)記錄實際結果與待驗項目。

<a id="ceh26-m04-c06-nfs-2026-11-06"></a>
### M04-06 Unix/Linux 使用者與 NFS（2026-11-06）

本課採 `CEH26-M04-C06` stable ID、公開課次 `M04-06` 與既有短 slug，完整中英供稿、附圖、修訂前目錄、171 段採用對照及雜湊在[來源紀錄](sources/ceh26-m04-c06/replacement-2026-11-06/README.md)。開始時新版只有目錄，故以 v1.0.0 初次發布；退役的舊 M04-06 SMTP 留原歸檔，內容與日期不混用。修改 teaching／answer 兩語 Markdown 與 diagram-models.json，再執行 `python3 scripts/ceh26_m04_c06_content.py`；`--check` 已列入 release，核對 124 區塊與八份受審核 SVG。

圖 1／2 沿既有 flow／cards；圖 3／4 只在 `m04-06-{mount|permissions}-{zh|en}-v1-0-0.svg` 固定路徑啟用 NfsEvidenceDiagram。mount 為 Client→Server 的虛線請求，手機維持端點與方向；permissions 使用 600／640／644／777 原生選單，permissionBits 拒絕其他輸入，無 JavaScript 保留 600 與全模式對照。SVG 對照固定顯示全模式，不隨當前選擇改寫。文字由同一 visual 模型進入 HTML、搜尋及下載；產生器沿既有 sanitizer，不放寬 SVG 或任意標記邊界。

新增正文使新版 M04 開放 C01–C06 與 C08，共七篇、三項待發布；C05 下一篇改連本課，C07／C09／C10 發布閘門保留。相鄰與目錄測試須同步核對公開路由、搜尋、sitemap 及 stable-ID URL 404，不將已發布 C08 當作待發布。內容、單元、型別、publication-boundary、release 後依序執行 `npx playwright test --config playwright.ceh26-m04-c06.config.ts` 及 C02／C05 回歸；正式站設定 `CEH_BASE_URL`。[回執](releases/2026-11-06-ceh26-m04-c06-nfs.md)記錄各層證據，題目與工具驗證均不代表本人理解或 NFS 實機安全。

<a id="aase-m0102-replacement-2026-11-06"></a>
### AASE M01-02 完整責任分工教材（2026-11-06）

[本次來源與逐段對照](sources/aase/m01-02/replacement-2026-11-06/README.md)保留原文、v1.0.2 前版、外部圖源取得狀態及使用者確認。正式 JSON 為 v1.1.0，七節加導言／課後結語完整雙語，四圖沿既有 cards／flow、四表與六項任務契約。角色與責任為平行卡片；證據及交接為編號流程，不引入任意 HTML／SVG 或新的圖解格式。

供稿三題各 A–C，AASE 的 checks 受限支援三或四選項、等量解析、答案範圍及兩語數量一致；CEH 契約不變。保留舊題於前版，不新增評分、實際 Q&A 或作答紀錄。目錄標題同步，stable ID／slug／原發布日與翻譯閘門不改；練習用「任務契約表」避免表號錯位。

AgentTestScenarios 只在 M01-02 testing 節啟用，沿 applicationReport 判斷固定的完整、缺漏、空白與先完整後清空輸入；預設最後一種。標示規格預期，不充作 app.py／pytest 的真實紀錄；無 JavaScript 保留預設及全情境表。正文／來源對照、單元、型別、publication-boundary、release 後，執行 playwright.aase-m0102.config.ts 與 M01 既有回歸；正式站設定 AASE_BASE_URL。[修訂回執](releases/2026-11-06-aase-m01-02-replacement.md)記錄規則、實測與待驗事項。

<a id="aase-m0103-replacement-2026-11-06"></a>
### AASE M01-03 個人工具與組織系統（2026-11-06）

[完整來源](sources/aase/m01-03/replacement-2026-11-06/README.md)保留供稿、主要 PNG、v1.0.2、139 段採用對照與 SHA-256。正式 v1.1.0／revision 4 為十節加導言的完整雙語，四圖四表與三題 4／4／3 檢核；原發布日、stable ID、slug、readingId、翻譯閘門與練習保留。目錄標題同步至課綱與工作坊封裝，未把網站可讀當本人學習完成。

沿既有 cards／step／flow：differences 的六筆 cards 由 OrganizationDimensions 呈現五個平行面向及共同成果，identity 的三筆 cards 由 DocumentAccessSimulation 呈現明列政策、三選單與固定規則；驗證器限制其數量及兩語形狀，不接受任意標記。圖解契約見[五面向共同支撐](diagram-design-system.md#aase-organization-dimensions)。simulatedDocumentAccess 只模擬三身分、兩文件、三操作，未知值拒絕，沒有實際登入或文件操作。預設小明／文件 A／讀取，無 JavaScript 保留結果與規則。

第四節另假設兩人被授權修改同份文件，與第三節政策分開；原文版本衝突解法補明伺服器／資料層的原子比對更新。內容、單元、型別、publication-boundary、release 後，執行 playwright.aase-m0103.config.ts；正式站設定 AASE_BASE_URL，另驗 M01 英文及 M01-02 回歸。[回執](releases/2026-11-06-aase-m01-03-replacement.md)保存實測、部署與待驗界線。

## AASE M01-04 source replacement — 2026-11-06

M01-04 v1.1.0 adopts the supplied introduction and eight complete sections in both languages. The [source bundle](sources/aase/m01-04/replacement-2026-11-06/README.md) retains 123 paragraph records, three reference PNGs and the previous v1.0.2 lesson. Existing publication gates, lesson identity, source anchors, objectives and synthetic practice remain. Three new three-option checks use new Q1–Q3 IDs and B/C/B answers; answers remain native disclosures, without submission or progress tracking.

`RequirementsInterviewDiagram.svelte` renders only this lesson's analogy/cards, workflow/flow and testing/cards as comparison, process and evidence. The catalog constrains them to exactly 2/5/3 nodes and matching kinds in both languages. The first figure compares parallel roles; only the second figure has four sequential arrows, with the last step highlighted. The third compares evidence requirements without completion arrows. Text is semantic HTML and enters the existing search catalog. CSS reflows the parallel columns according to available width; all teaching is directly visible.

`scripts/aase_m0104_svg.py` reads these same three blocks to generate six escaped-text standalone SVGs under `site/images/aase/`. It accepts no runtime markup or external references, enforces the small fixed element set and 100000-byte limit, and supports `--check`. These exports are linked as images, not registered as arbitrary inline SVG. Fixed SVG geometry and responsive HTML are distinct. Regenerate after any figure text change; run `tests/aase-m0104-replacement.test.ts` and `npx playwright test --config playwright.aase-m0104.config.ts`, with `AASE_BASE_URL=https://learn.cs-kairos.com` for production. Evidence belongs in the [release receipt](releases/2026-11-06-aase-m01-04-replacement.md).

## M04-09 其他列舉（2026-11-07）

`CEH26-M04-C09` 目前為 v1.1.0（revision 2），原發布 2026-11-07。依[本次來源對照](sources/m04-09/source-review.md)維護十一節、四表與四題，正解 B／B／C／B；第四題為 TFTP。十張本次附件衍生十組圖解，另加證據 ladder，合計十一組雙語 HTML／二十二張 SVG；首版與本次來源分開保管。`python3 scripts/m04_09_content.py --check` 核對雙語成稿、模型及匯出；程式圍欄轉為 code，子標題轉為既有 h3。`OtherEnumerationDiagram`、`SourceBody` 與 `concepts.ts` 共同約束圖名、版本、節點數與 flow/cards；BGP 新版四 AS 菱形與原版五 AS 拓樸分開。前版 SVG 保留，新增使用 `v1-1-0`。正文、搜尋、下載同源，無任意 HTML/SVG；`ip -6 neigh show` 使用具名、鍵盤可捲動的 code 區域。檢查入口 `playwright.m04-09.config.ts`，正式站用 `M04_09_BASE_URL=https://learn.cs-kairos.com`，詳見[本次回執](releases/2026-11-07-m04-09-replacement.md)。

### AASE M02-01 Token／Attention 圖解與互動

v1.1.0 起，`TokenAttentionDiagram.svelte` 以既有 cards／flow 模型承接六張圖，`aase.ts` 限定章節、種類與節點數：pipeline flow 6、units cards 2、analogy cards 4、attention cards 3、attention-example cards 2、limits flow 4。其餘章節不接受這個專用圖解；內容仍只能提供經驗證的文字，不提供任意標記或資產路徑。中英沿用相同結構、數值與閱讀順序。

圖 1／6 是垂直流程；圖 2 是兩組平行切分；圖 3 是四維向量，窄版兩欄；圖 4 是三個平行角色；圖 5 結合可操作的算術教具與明示的靜態預設。`attention-demo.ts` 固定 Value 2／6，分數有限域 −4 至 4，採減最大值的穩定 Softmax，先算完整精度再捨入。無 JavaScript 時保留 [1,0] 的結果與說明，停用控制。不保存學員進度，不代表真實模型實驗。

SVG 由 `python3 scripts/aase_m0201_svg.py` 從正式 JSON 產生，`--check` 核對逐位元組一致。只有固定受審核元素及 escaped text，單檔小於 100000 bytes。下載圖 5 表示預設值，不跟隨瀏覽器互動。驗收執行 `npx playwright test --config playwright.aase-m0201.config.ts`；正式站使用 `AASE_BASE_URL=https://learn.cs-kairos.com`，覆蓋雙語全文、四寬度、200% 文字、無 JS、鍵盤、SVG 邊界／文字重疊及下載 bytes。

### AASE M02-02 上下文、預算與交接

M02-02 v1.1.0 的五圖沿 `cards/flow` 正式資料：analogy cards 2、window cards 5、budget-example cards 5、prepare cards 7＋flow 4；`aase.ts` 檢查種類、順序、節點數與固定預算值。`ContextWindowDiagram` 只接受編號 1–5，資產路徑固定，不接受任意標記；選取虛線與工作流程箭頭的含義不同，窄版重排保持端點及順序。`scripts/aase_m0202_svg.py` 產生十個同源 SVG，`--check` 核對位元組，每檔小於 100000 bytes。

`contextBudget` 的教學上限為 10000，固定分項 [1000,2000,4500,1500]，額外日誌接受 0–3000 整數。UI 步進 100、預設 500，保留 1800 與重設；無 JS 保留 9500／剩餘 500 並停用控制。分段條只顯示預算範圍，超出量用文字呈現。圖 4 的剪貼簿內容含七欄及教學假設，成功寫入後才顯示成功；失敗提示手動複製。

`AaseText.openChecks` 是可選的開放題陣列，每題須有唯一課程 Qxx ID、非空 prompt 與非空 answer 段落；不能與選擇題 ID 重複。兩語沿 sameShape，搜尋收錄題目及答案。AaseLesson 在選擇題之後呈現原生 details 參考答案，不建成績或假提交狀態。本課原題封存，新增 Q04 選擇題及 Q05／Q06 開放題；qa 仍為空。

來源與逐小節處理見 [M02-02 對照](sources/aase/m02-02/replacement-2026-11-07/source-map.md)。本課檢查用 `playwright.aase-m0202.config.ts`，正式站設定 `AASE_BASE_URL`；共用渲染變更另回歸 `playwright.aase-m0201.config.ts`。

### AASE M02-03 四種機制圖解

`MemoryMechanismsDiagram.svelte` 只在 `AASE-M02-C03` 使用既有 `cards`／`flow` 資料。六圖依序為辦公室四角色、五個 token 詞塊、兩節點壓縮、三節點檢索、四欄交接與六步跨日流程；`src/lib/aase.ts` 檢查節點數、種類與雙語結構。平行角色與交接欄位沒有箭頭；token 圖只連第四與第五格；其餘箭頭表示該圖定義的順序。圖 6 在第二天前加分隔。

正文與節點為可搜尋 HTML；容器小於 34rem 時左右圖改上下，箭頭隨方向調整。固定的 12 個外部 SVG 由 `python3 scripts/aase_m0203_svg.py` 產生，`--check` 比較 bytes；沿用換行 helper、跳脫文字與元素白名單，不開放 runtime SVG markup。執行 `tests/aase-m0203-replacement.test.ts` 與 `npx playwright test --config playwright.aase-m0203.config.ts`；正式站使用 `AASE_BASE_URL`。四題採既有原生答案展開，不建立評分或學員完成狀態。來源、圖意差異與驗收見 [M02-03 回執](releases/2026-11-07-aase-m0203-replacement.md)。

### AASE M02-04 控制流程與任務控制卡

M02-04 v1.1.0 使用既有 cards／flow 資料；control 為 4／6 節點的兩圖、stopping 六欄控制卡、hybrid 四步流程，aase.ts 驗證種類、位置與數量。AgentControlDiagram 僅在本課啟用，固定分支保留互斥關係，失敗分支明示回到觀察及停止出口，權限兩欄窄版重排。文字由 Svelte 跳脫，沒有任意 HTML 或圖檔路徑。

`scripts/aase_m0204_svg.py` 從正式雙語 JSON 產生八個 SVG；`--check` 核對 bytes，固定受審核元素、跳脫文字與小於 100000 bytes 邊界。正文、搜尋及 SVG 同源。三題 A–C 選擇題沿原生參考答案收合，不新增批改服務。來源、技術修正與驗收見 [M02-04 回執](releases/2026-11-07-aase-m0204-replacement.md)；瀏覽器入口 `playwright.aase-m0204.config.ts`，正式站以 `AASE_BASE_URL` 指定。

### AASE M02-05 Harness 圖解與全開放題（2026-11-07）

M02-05 revision 4 起使用四張受限 `cards`／`flow`，節點數固定為 9、3、3、5；分別為整體架構、前後三角色詳解及五步流程。`HarnessDiagram.svelte` 只負責此課，資料不含任意標記或座標。六面向平行，不是六步流程；Security／Observability 全程註記不新增流程節點。角色 body 用雙換行分段，正文直接可見。`scripts/aase_m0205_svg.py --check` 核對八份雙語匯出。

既有 `openChecks` 可單獨構成理解檢核；至少需有一題 `checks` 或非空且合法的 `openChecks`，原題目 ID 唯一性、答案段落、雙語形狀與發布閘門仍須通過。M02-02 的混合題型保持；M02-05 三題採新 Q04～Q06，無評分、送出或虛構學習紀錄。共用引言改用「作答」涵蓋選擇題及開放題。

執行 `tests/aase-m0205-replacement.test.ts`、`playwright.aase-m0205.config.ts` 與共用檢查；正式站以 `AASE_BASE_URL` 回讀。詳見 [來源對照](sources/aase/m02-05/replacement-2026-11-07/source-map.md)及[驗收紀錄](releases/2026-11-07-aase-m02-05-replacement.md)。

### AASE M02-06 工具、沙箱與驗收證據

`ToolEvidenceDiagram.svelte` 僅在本課渲染四組 cards/flow：analogy flow 5、sandbox cards 2、connection cards 6、verification cards 5；`aase.ts` 檢查位置、種類、節點數與雙語形狀。圖 1 的主管任務與五步流程有五個向下箭頭；圖 2 是平行權限範圍；圖 3 是課程索引；圖 4 保留每列獨立執行狀態，均不誤畫成完成流程。

八個 SVG 由 `python3 scripts/aase_m0206_svg.py` 產生，`--check` 核對 bytes；固定受審核元素、跳脫文字與大小上限。HTML 與搜尋同源，手機依容器寬度重排，沒有新評分或學習狀態。保留 MCP 協定示例，新增簡化工具請求／回覆與原稿合成日誌；一題選擇題及一題 openChecks 沿原生參考答案展開。單元檢查 `tests/aase-m0206-replacement.test.ts`，瀏覽器用 `playwright.aase-m0206.config.ts`，正式站設定 `AASE_BASE_URL`。來源對照與驗收見 [M02-06 回執](releases/2026-11-07-aase-m0206-replacement.md)。

## M04-10 列舉防護（2026-11-07）

`CEH26-M04-C10` 首次公開 v1.0.0，採用九節雙語供稿。`python3 scripts/m04_10_content.py` 由成稿及圖解資料生成正文與六份 SVG，`--check` 核對同步。三張圖沿用 `SourceBody.visual`：rights 為三項平行能力、controls 為四項解釋順序、acceptance 為三個合成案例。驗證器限制課程 ID、種類、節點數及案例四段結構。`EnumerationDefenseDiagram` 只切換既有合成資料，不連線、不保存作答；無 JavaScript 保留預設與全部案例全文，停用 radio。答案沿原生展開。來源與差異見[逐節對照](sources/m04-10/source-map.md)，檢查入口 `playwright.m04-10.config.ts`，正式站設定 `M04_10_BASE_URL`；結果見[發布紀錄](releases/2026-11-07-m04-10.md)。


### AASE M03-01 問題陳述（2026-11-07）

[完整供稿與對照](sources/aase/m03-01/replacement-2026-11-07/README.md)保留原文、七張 PNG 及 Git v1.0.4。v1.1.0 為導言加十節完整雙語，七圖、兩表、十節 problem.md 原樣範例、三題三選項與一題開放追問。保留身份、舊章節錨點、原發布日及翻譯閘門；原題在前版留存，新題使用 Q04–Q07。

`ProblemStatementDiagram.svelte` 僅用於本課既有 cards／flow。aase.ts 限定 analogy 2、structure 5、acceptance 2、workflow 7、documents 2＋3、connection 4 節點及種類。平行比較不接箭頭；As-Is／To-Be 是兩組獨立流程，修正步驟明示條件；problem→spec→implementation 三卡於寬版呈兩層、窄版縱排。沒有任意標記或資產路徑。`python3 scripts/aase_m0301_svg.py --check` 核對十四個同源受審核 SVG；各小於 100000 bytes。

執行 `tests/aase-m0301-replacement.test.ts` 與 `playwright.aase-m0301.config.ts`；正式站使用 `AASE_BASE_URL=https://learn.cs-kairos.com`。歷史遷移測試讀取保存的前版，當前教材由新測試檢查。完整實測與發布狀態見 [回執](releases/2026-11-07-aase-m03-01-replacement.md)。
#### M02-02 四圖新稿後續抽換（2026-11-07）

v1.1.1／revision 5 依新供稿抽換七節；原四張圖對應資料室、五項組成、容量與工作循環。保留七欄交接卡，因此資料仍維持五組已驗證 figures，公開工作循環 caption 為「圖 4」，資產路徑仍為 `m02-02-5-{lang}.svg`。新檢核為 Q07 四選項（C）與 Q08 開放題；舊題留於封存。原發布、有效錨點、預算算術與發布閘門維持。新來源、雙語逐小節對照、圖意差異及本次實測見[後續抽換回執](releases/2026-11-07-aase-m0202-followup.md)；前述 v1.1.0 記錄保留作歷史。

### AASE M03-02 角色、訪談與證據分層

M03-02 v1.1.0 以既有 cards／flow 承接三張參考圖：roadmap flow 5、evidence cards 4、conflict cards 2；`aase.ts` 限定位置、種類與數量。`StakeholderInterviewDiagram.svelte` 使用可搜尋 HTML、固定裝飾 SVG 及容器重排；只有五步流程有四個向下箭頭，四層證據與兩階段條件比較不建立因果或權限關係。圖 2 的雙段 body 保留主張與限制。六個下載 SVG 由 `python3 scripts/aase_m0302_svg.py` 產生，`--check` 比較 bytes、檢查受審核元素及大小上限。

完整 problem.md 在雙語使用相同 code，英文另有完整逐欄解讀；四題原選項以新 Q04–Q07 呈現，沿原生參考答案，沒有評分與學習狀態。執行 `tests/aase-m0302-replacement.test.ts` 與 `playwright.aase-m0302.config.ts`，正式站設定 `AASE_BASE_URL`。詳見[來源與逐小節對照](sources/aase/m03-02/replacement-2026-11-07/source-map.md)及[發布回執](releases/2026-11-07-aase-m0302-replacement.md)。

## M04-08：LDAP 完整抽換與 Kerberos 入門（v1.1.0）

正本位於 [本次來源目錄](sources/m04-08/replacement-2026-11-07/README.md)，完整中英稿經 `scripts/m04_08_content.py` 轉為既有 sourceBody。十張參考圖共用 `diagram-models.json`，`LdapDiagram.svelte` 只接受固定 `m04-08-(directory|parameters|scope|result|paging|central|entry|search|sso|tickets)-(zh|en)-v1-1-0.svg` 路徑。節點數依序為 4／4／6／7／3／4／4／4／4／3；僅 paging／search／tickets 使用 flow，其餘 cards。

directory／central／sso 是一個根與三個平行子節點；scope 再將 Wang／Li 歸在第三個子節點下，綠框只代表 one-level 候選，圖說明列 base／subtree 與 Filter／權限界線。parameters 是 2×2 並列設定。entry／result 使用語意 dl 資料列；paging／search 是有順序箭頭的流程。tickets 的每項 title 固定拆為 `Client → Peer` 兩端，body 為階段／請求／回覆或授權結果三行；最後一項不畫回覆箭頭。模型驗證拒絕錯誤節點數及票證交換形狀，全部字串由 Svelte 跳脫，SVG 沿既有 sanitizer 匯出。

保持舊公開網址、原發布日與八個既有 section 主題錨點。新增 directory-overview、directory-names、ldap-introduction、kerberos-introduction；補充內部章節採 h3。三組參考答案用原生 details，qa=[]，沒有假測驗控制。`verify-m04-08-source.py --check` 驗證 378 個原始段落與附件雜湊；`playwright.m04-08.config.ts` 核對兩語全文、四尺寸、200% 文字、無 JavaScript、鍵盤及全部下載。正式站以 M04_08_BASE_URL 指定。[發布與驗收回執](releases/2026-11-07-m04-08-replacement.md)分層記錄證據。

## M05-01 弱點評估與滲透測試（2026-11-08）

M05-01 首次公開 v1.0.0。`scripts/m05_01_content.py` 由完整中英稿與 diagrams.json 生成 sourceBody 及八份受審核 SVG；`--check` 核對 bytes。四圖使用既有 cards／flow，節點數固定為 6／3／4／5；`concepts.ts` 約束本課 ID、路徑、種類及數量。`AssessmentDiagram.svelte` 將第一圖的威脅／利用並列，其餘層次按原圖順序，風險是獨立評估；只有工作流程有順序箭頭，第四步明示必要與授權條件。手機按容器重排，正文與圖標籤可搜尋，無任意 HTML 或 SVG 注入。

兩題沿原生 answer 參考解析，不建立送出或批改狀態。來源與逐小節／圖意差異見 [source-map](sources/m05-01/source-map.md)，單元檢查 `tests/m05-01.test.ts`，瀏覽器入口 `playwright.m05-01.config.ts`；正式站使用 `M05_01_BASE_URL`。發布後核對 M04-10 下一篇連至本課、M05-02 保持準備中。[驗收回執](releases/2026-11-08-m05-01.md)分別記錄內容、呈現與正式站證據。

## M05-02 資產盤點與範圍（2026-11-08）

首次正文 v1.0.0 依[逐小節對照](sources/m05-02/source-map.md)完整採入七節供稿與來源節。`scripts/m05_02_content.py` 從雙語稿與 diagrams.json 產生 sourceBody 及八份受審核 SVG，`--check` 核對同步。`ScopeDiagram.svelte` 僅接受本課固定路徑；concepts.ts限制inventory／scope／workflow／coverage節點數2／3／5／1及種類。100格30/70與80%條為固定合成案例；A→B/C為依賴分支，窄版各子項明列A→，不變成B→C。五步工作流才是時序。正文、搜尋、SVG同源，三題沿原生參考答案，無批改服務或學習紀錄。瀏覽器入口 `playwright.m05-02.config.ts`，正式站用 `M05_02_BASE_URL`；驗證與發布見[回執](releases/2026-11-08-m05-02.md)。

## M05-03 分類與評估圖解

M05-03 使用既有 sourceBody visual 契約，限定 `m05-03-(causes|targets|methods|dimensions|evidence)-(zh|en)-v1-0-0.svg`；節點數依序 5／5／2／5／4，僅 evidence 為 flow，其餘 cards。`ClassificationDiagram.svelte` 以 HTML 與容器查詢呈現並列、分層與流程，窄版不把分類關係畫成依序流程。`scripts/m05_03_content.py` 從中英稿及 diagrams.json 生成正式正文與十份 sanitizer 審核 SVG；`--check` 驗證重建一致。來源對照及部署證據見 [M05-03 回執](releases/2026-11-08-m05-03.md)。

<a id="aase-uv-cache"></a>

### 工作站 Python 依賴共用｜2026-11-08

本機 AASE 的四個 Python 環境保留原有路徑與 41 個套件版本；透過 uv 的共用快取安裝，保留各自的環境與 pip 相容入口。教材包的 `resources/aase/requirements.txt` 與學員操作方式維持原規範。此次工作站重現鎖檔存於忽略的 `.local/aase-requirements.lock`，含完整版本與 SHA-256；私有維護證據留在主機的 dependency-sharing 紀錄。

既有環境直接安裝，不重建 `.venv`：

```sh
uv pip install --python .local/aase-venv/bin/python --require-hashes --link-mode hardlink -r .local/aase-requirements.lock
```

已有完整快取時可加 `--offline`。此鎖檔只重現本機 Python 3.12.3 的已驗證組合；其他 Python／平台或套件升級需另外驗證。新 checkout 沒有本機鎖檔時，先依教材需求建立獨立環境，再產生並檢查完整鎖檔；不要將不同專案合併進同一可寫環境。

[Workstation governance and validation receipt](https://github.com/JasonLn0711/planning-everything-track/blob/main/data/projects/2026-04-ubuntu-storage-governance.md#dependency-sharing-2026-11-08) retains the aggregate result and host evidence locator.


<a id="cs-systems-perspective"></a>
## 資工底層原理觀點的維護與追溯

本篇完整雙語來源與編輯修正見[來源紀錄](sources/cs-systems-foundations/README.md)，發布、規則及 Planning 雙向關聯見[回執](releases/2026-11-08-cs-systems-foundations.md#planning-connection-2026-11-08)。`PerspectiveBlock` 以受限 paragraph／heading／code／list／table 保留交錯次序，`systemsFigure` 只接受八個固定圖名；HTML 與搜尋共用正式資料，下載由 `scripts/cs_systems_diagrams.py` 產生。完整稿轉換／同步使用 `python3 scripts/generate-cs-systems.py --check`；修改稿件或圖解後先重建，再執行觀點、型別與必要發布閘門。來源與產生器同時核對，避免重建覆蓋未納入的編輯。

瀏覽器檢查為 `node scripts/check-cs-systems-browser.mjs`，隔離預覽由 `python3 scripts/preview-cs-systems.py` 建立；正式站設定 `CS_SYSTEMS_BASE_URL=https://learn.cs-kairos.com`，SVG 字框檢查使用 `node scripts/check-cs-systems-svg.mjs`。證據留執行 owner，Planning 僅承接 locator、狀態、容量與下一關。修改正文依 WRITE-06 更新版本／日期；文件關聯維護不自動改教材版號或代填學習完成。

## M05-04 CVE、CWE、CPE 與資料庫（draft）

CEH26-M05-C04 顯示 M05-04，正文沿既有 sourceBody；`scripts/m05_04_content.py` 從完整中英稿及 diagrams.json 生成正文與兩份受審核 SVG。三張平行角色卡由 IdentificationDiagram 承接，限定本課角色圖路徑、cards 與三節點；沒有順序箭頭。小檢核沿原生 answer 收合，qa=[]。C05 待編入口為嚴重度／優先順序；已發布前三課保留。`tests/m05-04.test.ts` 驗證身份與 draft/future 閘門；`scripts/check-m05-04-static.py` 僅做暫時公開狀態的隔離靜態全文檢查，finally 恢復 draft，之後須重跑 boundary 建立乾淨輸出。它不能代替瀏覽器或正式頁驗收。[逐節來源](sources/m05-04/source-map.md)及[回執](releases/2026-11-08-m05-04.md)分別記錄內容與發布狀態。


### M05-04 九節新供稿抽換（2026-11-08）

本次新稿取代上段八節草稿；前版與原始來源保留。[新來源與對照](sources/m05-04/replacement-2026-11-08/source-map.md)持有九節、十小節、六表與兩題開放問題，五組圖為 roles／identifier／lookup／finding／evidence，節點數 5／3／4／5／4；僅 lookup 為 flow。IdentificationDiagram 以 HTML／SVG 圖示、具語意 dl 與編號層次重排，不接受任意標記。十個下載圖由 `scripts/m05_04_replacement.py` 產生並通過 sanitizer，`--check` 比對 bytes；舊 m05_04_content.py 轉接目前產生器，避免重建舊稿覆蓋新稿。

`preview-m05-04.py` 建立獨立副本；`check-m05-04-browser.mjs` 驗全文／四尺寸／200%／無 JS／下載／鍵盤，正式站用 M05_04_BASE_URL。`check-m05-04-svg.mjs` 檢查十 SVG 字框／重疊。舊 static 腳本改轉接隔離建置與瀏覽器檢查，不再暫改正式內容。前版環境拒絕紀錄保持為歷史；本次 Chrome 已成功執行，不以舊阻塞代替本輪驗收。

### 2026-11-09 維護命令與工作目錄整合

現行維護命令依 package.json 的 pnpm pin 執行；歷史回執保留當時命令。[整合回執](releases/2026-11-09-repository-reconciliation.md)連接來源、衝突處理、實測與 Planning；本輪沒有修訂教學正文。

<a id="m05-05-prioritization"></a>
## M05-05｜CVSS、KEV、EPSS 優先順序

`CEH26-M05-C05` 沿既有課次及短網址，首次公開 v1.0.0。完整供稿、四張 PNG、課綱前版、逐段採用對照與官方查核在[來源紀錄](sources/m05-05/README.md)；兩語各九節、五小節、五表、四圖與兩個原開放問題，qa=[]。來源卡雜訊、0.20標題及靜態教材語氣的處理逐項明列。

四圖共用 diagrams.json：signals cards 3、groups cards 4、probability cards 1、workflow flow 4。`PrioritizationDiagram.svelte` 保留平行列、CVSS四組指標、固定20%長條與四關三箭頭；只有workflow表示順序。`prioritization-diagrams.ts` 約束本課、四個圖名、雙語固定路徑、種類、數量、欄位及固定0.20＝20%值，不接受任意標記、輸入分數或官方風險計算器主張。

`python3 scripts/m05_05_content.py --check`核對完整中英正文與八份 sanitizer SVG；`tests/m05-05.test.ts`核對原件／逐段採用、範例數值、發布閘門及無效圖解拒絕。先完成內容、單元、型別、publication-boundary及release，再執行 `node scripts/check-m05-05-browser.mjs`、`node scripts/check-m05-05-svg.mjs`。正式站指定 `M05_05_BASE_URL=https://learn.cs-kairos.com`。來源與發布證據由[本次回執](releases/2026-11-09-m05-05.md)承接；M05-04下一篇隨共用catalog連至新正文，M05-08維持待發布。

## AASE M03-05 成功指標完整供稿（2026-11-09）

AASE-M03-C05 v1.1.0 的[來源與逐節對照](sources/aase/m03-05/replacement-2026-11-09/source-map.md)保存完整原文、五張PNG、前版、雙語稿及雜湊。`scripts/aase_m0305_content.py`由雙語稿與figures.json產生正式JSON，`--check`核對同步。原九節、導言及分母說明分為11個section，六個既有錨點與原發布日保留。四道新開放題使用Q04–Q07，參考解析沿原生收合，qa仍為空。

AASE專屬`prose`區塊只接受非空paragraphs字串陣列，以Svelte跳脫文字保留「表格／圖解後接說明」的原始次序，搜尋沿同一資料；固定條列前綴轉原生ul／ol，CEH型別保持原契約。SuccessEvidenceDiagram只接本課固定五圖：evidence-chain／metrics／measure／analogy／trace，節點數6／2／4／2／5，只有第一圖為flow。滑桿支援0–4整數，預設3／4＝75%，公式與4／4門檻直接可見；無JavaScript保留預設結果並停用控制。十份獨立SVG由`aase_m0305_svg.py`產生，下載固定為預設案例。

單元檢查為`tests/aase-m0305-replacement.test.ts`；瀏覽器為`playwright.aase-m0305.config.ts`，正式站使用AASE_BASE_URL。包含全文、四尺寸／200%、鍵盤、無JS、同源搜尋、SVG字框／重疊及下載位元組。原始資料與前版由SHA256SUMS核對，具體執行與待驗項目見[回執](releases/2026-11-09-aase-m03-05-replacement.md)。

## AASE M04-01 完整供稿與五圖（2026-11-09）

AASE-M04-C01 v1.1.1 的[來源對照](sources/aase/m04-01/replacement-2026-11-09/source-map.md)保留原稿、五PNG、前版、雙語稿與雜湊。兩語九section承接導言、七節及理解檢核；原六錨點、發布日保留。三個餐廳小節、兩表、三開放題Q04–Q06完整進入正文，qa=[]，參考解析原生收合。

HciPerspectivesDiagram只處理本課固定4步flow／3列cards／2欄cards／5欄需求cards／6步flow，手機原生重排，示意動作區維持文字。模型拒絕多餘節點、錯誤關係與markup欄位；十獨立SVG由aase_m0401_svg.py使用同源資料及固定allowlist輸出。aase_m0401_content.py由雙語稿與figures.json產生正式JSON；兩者--check核對同步。原稿正規化與逐節編輯在來源紀錄，不以標題數代替完整性。

維護檢查：tests/aase-m0401-replacement.test.ts、playwright.aase-m0401.config.ts；正式站指定AASE_BASE_URL。全文／順序、四尺寸／200%、無JS／鍵盤／搜尋及SVG下載檢查後，依[回執](releases/2026-11-09-aase-m04-01-replacement.md)更新實際發布證據。課名同步course雙語目錄與工作坊ZIP，操作教材本身未改。

## AASE M03-04 MVP 完整供稿（2026-11-09）

v1.1.0／revision 4 保留原發布日與六個舊錨點，導言及十節完整雙語由 `scripts/aase_m0304_content.py` 產生；`--check` 核對成稿同步。原文、兩張 PNG、前版與逐節採用見[來源對照](sources/aase/m03-04/replacement-2026-11-09/source-map.md)。四表、完整 problem.md 與四選項理解檢核均進入正文，新題 Q04 使用既有參考答案展開。

`MvpScopeDiagram.svelte` 僅用於本課：analogy cards 四節點呈現兩個前置節點與兩個互斥條件結果，workflow flow 五節點、四箭頭並保留五個圖示。`aase.ts` 拒絕錯誤位置、種類或數量；文字由 Svelte 跳脫。手機重排保留條件標籤，不建立分支間箭頭。四份 SVG 從正式 JSON 經 `scripts/aase_m0304_svg.py` 匯出，固定元素白名單、小於100000 bytes，`--check` 比較位元組。正文、搜尋與圖檔同源。

單元為 `tests/aase-m0304-replacement.test.ts`；瀏覽器為 `playwright.aase-m0304.config.ts`，正式站設定 `AASE_BASE_URL`。逐段全文、四尺寸及200%文字、無JS、鍵盤、搜尋、四SVG邊界／重疊及下載一致性由同一檢查承接。實測與發布見[回執](releases/2026-11-09-aase-m03-04-replacement.md)。

## M05-06｜認證掃描與證據界線

CEH26-M05-C06／M05-06由原待編M05-10主題移入指定課次，八節完整雙語。來源見[逐節對照](sources/m05-06/source-map.md)，發布證據見[回執](releases/2026-11-09-m05-06.md)。`scripts/m05_06_content.py --check`核對正式JSON與六份sanitizer SVG；`ScanEvidenceDiagram.svelte`承接paths共同主機＋兩平行面、gates五節點四連線、result四列合成結果。`scan-evidence-diagrams.ts`限制身份、固定路徑、種類、節點數與欄位。正文／搜尋／下載同源，不提供掃描或批改服務。

單元為`tests/m05-06.test.ts`，瀏覽器為`node scripts/check-m05-06-browser.mjs`，正式站設定`M05_06_BASE_URL=https://learn.cs-kairos.com`；`node scripts/check-m05-06-svg.mjs`核對六圖字框與重疊。同期修改於隔離工作樹驗收，保留原工作目錄。


## AASE M03-03｜As-Is、To-Be 與 User Flow 完整供稿（2026-11-11）

`content/aase/lessons/aase-m03-c03.json` 保留 URL、原發布日、實際 Q&A 及六個既有錨點，升為 v1.1.0。原稿、七張參考圖與前版位於 [來源紀錄](sources/aase/m03-03/replacement-2026-11-11/README.md)，十節及小節、五表、原樣 problem.md、四題開放檢核依 [逐節對照](sources/aase/m03-03/replacement-2026-11-11/source-map.md)維護。

`teaching.{zh,en}.md` 與 `figures.json` 由 `scripts/aase_m0303_content.py` 產生正式教材。兩語共用原稿的程式碼；英文在 code 前完整解釋工作表內容。五張靜態圖沿用受限 cards／flow 模型，節點數、kind 與允許欄位由 AASE 驗證器約束；`WorkflowDiagram.svelte` 負責 HTML 重排，`scripts/aase_m0303_svg.py` 由相同正式資料產生十張 SVG。圖 2 的 12 節點與 14 明列出口取代跨版面繞線，保留每條條件與回復關係；圖 6 的 UI/UX 與規格／測試始終為平行工作。

`WorkflowExercises.svelte` 的兩種固定教學互動分別是圖 4（資料修改使舊結果失效，重新檢查後才可輸出）與圖 7（四情境走讀）。控制項使用原生 radio／button，無 JavaScript 時停用並保留靜態範例及可展開的全部案例。它們沒有真實保費計算、業務提交、評分或學習進度紀錄；後端一致性及正式業務規則仍須由真實系統另外驗證。

維護時跑兩個產生器的 `--check`、`pnpm run validate:content`、單元與型別、publication-boundary、release，再跑 `playwright.aase-m0303.config.ts`、既有 AASE 雙語及 CEH 共用版型回歸。圖解／互動變更須核對四尺寸、200% 文字、鍵盤、無 JavaScript、搜尋、SVG 幾何與位元組；正式站同套件以 `AASE_BASE_URL` 回讀。[驗收與發布紀錄](releases/2026-11-11-aase-m03-03-replacement.md)。

## AASE M04-01 醫院情境與四圖抽換（2026-11-11）

v1.2.0／revision 6 以新供稿取代餐廳版本；[逐小節來源對照](sources/aase/m04-01/replacement-2026-11-11/source-map.md)保留原文、四PNG、前版、雙語成稿、正規化與雜湊。十二個section承接導言、十節及銜接；舊section錨點與Q04–Q06保留，新實作題Q07沿原生參考解析。三表、六行業、心智模型／回饋／錯誤預防、易用性三面向及完整AI指令進入正式正文。

四圖位置為analogy／three-lenses／quality／case，全部使用受限cards資料，節點數3／4／5／2。HciPerspectivesDiagram 將醫院三列、概念交會、目標與同層UI／HCI的分層流程、修改前後雙欄重排；僅圖3有三個閱讀箭頭，UI與HCI之間沒有箭頭。HTML、搜尋與八份SVG由同一正式JSON提供。normalize-source.py --check、aase_m0401_content.py --check與aase_m0401_svg.py --check分別檢查來源正規化、正文、下載同步。

單元與瀏覽器仍用 tests/aase-m0401-replacement.test.ts、playwright.aase-m0401.config.ts；本機獨立連接埠4297，正式站指定AASE_BASE_URL。[回執](releases/2026-11-11-aase-m04-01-replacement.md)記錄實際驗證、發布與待驗界線，歷史五圖回執保留原結果。

## CEH 考古題知識筆記 — 2026-11-10

`content/ceh-notes/YYYY-MM-DD.json` 維護同一天的單一筆記；`parts` 按供稿順序延續，不替同日每份供稿新增日期頁。原稿、原圖與採用對照留在 `docs/sources/ceh-notes/YYYY-MM-DD/part-NN/`；正文保留完整小節，來源與編輯補充分開記錄。`expectedParts` 只記錄使用者預期數量，頁面顯示實際已發布部分數量；不得把尚未提供部分寫成已完成。追加內容保留原發布日、日期網址及既有錨點，增加revision與revisedOn。

`src/lib/ceh-notes.ts` 驗證唯一日期、有效日期、雙語結構、部分編號、`pN-`錨點、HTTPS來源與受限區塊，拒絕額外markup欄位。整篇及各部分共用 `isPublic` 的status／publishedOn閘門；只將過閘資料送至日期頁、清單、搜尋與sitemap。發布邊界腳本檢查整篇及同日部分的draft／future標記不進入實際HTML／JSON／JS。未提供原題全文時，保留供稿題號及參考答案，不宣稱已核對題庫正解。

正文沿用SourceBody的段落、清單及可鍵盤捲動表格。`NoteFigure`承接四節點向下workflow與三欄平行CIA；`NoteRecall`承接三張卡，無JavaScript可閱讀三卡與原生答案；`NoteChecks`保留供稿三選項並提供本頁逐項回饋，不儲存、不外送或宣稱學習完成。圖示的節點、文字、搜尋與SVG共用正式JSON；`python3 scripts/ceh_notes_svg.py --check` 已納入validate:release，輸出固定allowlist且每圖小於100000bytes。新領域圖需先擴充契約，禁止以任意HTML／SVG繞過。

維護檢查：`tests/ceh-notes.test.ts` 與 `node scripts/check-ceh-notes-browser.mjs`；後者檢查雙語全文、四尺寸／200%、無JS、鍵盤、回憶卡與情境檢核、六SVG文字邊界與下載。設定 `CEH_NOTES_BASE_URL=https://learn.cs-kairos.com` 可回讀正式站。首次供稿採用與視覺差異見[來源對照](sources/ceh-notes/2026-11-10/part-01/source-map.md)，實測與發布見[回執](releases/2026-11-10-ceh-notes-part-01.md)。

### 三份新供稿重製契約

新供稿、原版與逐小節追溯見[重製來源](sources/ceh-notes/2026-11-10/reconstruction/source-map.md)，本輪實測與發布證據見[重製回執](releases/2026-11-10-ceh-notes-reconstruction.md)。`contentVersion` 是三段語意版本，`revision` 保留內部計數；遷移基準與歷史顯示分開記錄，保留原發布日。

`diagram` 區塊只接受 `kind/name/caption/description/items`，每個 item 僅含 title/body。`src/lib/note-diagram-specs.json` 共用固定圖名、節點數與版型：overview 3、encryption 3、defense 5、hats 3、roe 5、testing 5、decision 4、hash 2、compare 2、tls 10。NoteDiagram 以 HTML、容器查詢與固定 SVG 圖示／箭頭呈現；CIA 仍沿 NoteFigure 三欄平行卡。TLS 固定兩端與訊息方向，虛線表示伺服器回覆，並非加密狀態；本機計算／驗證不加成網路傳送箭頭。模型拒絕任意圖形標記及額外欄位，HTML／搜尋／SVG 共用文字。

回憶卡支援 1–12 張，各卡須有問題、題號參考與至少一段參考答案；新供稿分別需要 8／6 張。檢核維持 3 或 4 選項，解析數與選項數相同，答案索引不能越界。未提供題文或答案的部分須保留來源界線；開放題不新增無服務支援的提交／批改承諾。

`scripts/ceh_note_reference_svg.py` 由現有 `ceh_notes_svg.py` 呼叫，沿固定元素／屬性 allowlist 與 100000 bytes 上限；不要手改生成 SVG。`node scripts/check-note-reference-diagrams.mjs` 建立獨立 SSR fixture，驗 11 張參考圖的雙語文字、四尺寸／200%、無 JS、下載與 SVG 字框／重疊。它不修改 canonical 內容或解鎖草稿，不能代替完整文章或正式站驗收。完整頁面的 `check-ceh-notes-browser.mjs` 依目前已接入圖名檢查下載與搜尋；現行驗收涵蓋三部分全文、17 張回憶卡及所有檢核組與 30 份 SVG。

三份正文由 `scripts/reconstruct-ceh-notes.py` 與 `ceh_note_part1.py`／`ceh_note_part2.py`／`ceh_note_part3.py` 重建；`--check` 與 `scripts/audit-ceh-note-adoption.py --check` 已納入 validate:release，驗證同步、原附件雜湊及明確逐標題採用映射。原始資料不可由生成結果覆寫。

驗收順序：單元／型別 → SSR 圖解 fixture → 發布邊界與最終 production build → validate:release → 新 preview／完整頁面瀏覽器。SSR fixture 或 SvelteKit sync 會刷新生成檔，不可與 production build 並行，也不可在最終建置後執行而沿用舊 preview；完整頁面檢查同時核對 HTML／client bootstrap 識別碼。

## AASE M04-05 完整供稿與六圖（2026-11-11）

v1.1.0／revision 5 保留 2026-11-05 原發布日及七個舊錨點，導言與十節完整雙語由 `scripts/aase_m0405_content.py` 從[成稿與來源對照](sources/aase/m04-05/replacement-2026-11-11/source-map.md)產生；`--check` 核對同步。四張完整表、版本 3／4 範例與三個開放問題及參考解析沿既有模型呈現，qa 空陣列，不新增提交或評分服務。

`DisclosureStatesDiagram.svelte` 僅承接本課六張固定 cards：列印兩卡、設定三列、基本／進階兩卡、手風琴三列、四狀態並列、變更前後兩節點加兩種策略。只有圖 6 有兩個向下箭頭；手機重排保留策略互斥與四狀態並列語意。手風琴為靜態結構示意，必要正文直接顯示。模型限制六圖位置、節點數、cards 種類及欄位；資料不含任意 HTML／SVG 標記。`scripts/aase_m0405_svg.py` 從正式 JSON 匯出十二份固定白名單 SVG，小於100000 bytes；HTML、搜尋與下載共用資料。原 PNG 在來源目錄保存，圖 3 以清楚進階入口修正淡化呈現，其餘差異及查核界線見 source-map。

維護檢查為 `tests/aase-m0405-replacement.test.ts`、`playwright.aase-m0405.config.ts`；正式站以 `AASE_BASE_URL=https://learn.cs-kairos.com` 執行。全文順序、四尺寸／200%、鍵盤、無 JS、搜尋、十二 SVG 文字邊界／重疊／位元組及兩個工作坊下載同時核對。實際驗證與發布結果見[回執](releases/2026-11-11-aase-m04-05-replacement.md)。

### 11/10 續篇來源版本與 17 張圖 — 2026-11-11

兩份續篇與 17 張圖沿用同一日期頁，v1.2.0 保留既有較新完整稿及錨點，再接續本批完整供稿版。來源／逐段雙語／採用對照見 [continuation-17-reference](sources/ceh-notes/2026-11-10/continuation-17-reference/source-map.md)。661 筆來源單位的實際正文由 `ceh_note_continuation.py` 採用；`check-ceh-continuation-source.py --check` 已加入 release gate，核對原始 bytes、正規化、來源範圍及真正正文，不以單純字數或圖名代替完整性。

17 個固定圖名與版型登記在 `note-diagram-specs.json`。`NoteContinuationDiagram` 使用 HTML 節點、容器重排及經量測的 SVG 連線，連線端點／條件固定於受審核 spec，內容仍只允許 title／body 文字。平行保護範圍、巢狀卷與 16／32 位元組格各有專用結構；CA／網站／瀏覽器序列區分事先簽發與連線內往返。沒有 JS 時節點及具名關係文字直接可讀。`ceh_note_continuation_svg.py` 序列化同源文字，沿既有 allowlist 及每圖小於 100000 bytes 的邊界。

本批原始回憶問題各七個、情境題各五題；附件未附翻面答案，保留來源界線；情境題依供稿先不提供答案鍵。`check-ceh-continuation-diagrams.mjs` 檢查 SSR／無 JS、四尺寸／200% 及 34 份匯出；`check-ceh-continuation-graphs.mjs` 檢查真正頁面的量測端點。最終頁面與發布證據見 [本輪回執](releases/2026-11-11-ceh-continuation-17.md)。

## AASE M04-02｜任務分析與條件回復

[2026-11-11來源及逐節對照](sources/aase/m04-02/replacement-2026-11-11/README.md)保存八章供稿、五張原圖、舊版及編輯差異。修改完整中英稿或`figures.json`後執行`scripts/aase_m0402_content.py`與`scripts/aase_m0402_svg.py`（皆支援`--check`）。正式資料保留六個既有錨點，新增各小節；三個物流問題使用原生開放檢核與編輯參考答案，不提供送答服務。

`TaskAnalysisDiagram.svelte`沿既有cards／flow承接五種固定版型：goal六節點、plans六／五節點、methods五階段、walkthrough三條件。`aase.ts`限制位置、種類、數量及欄位；不接受HTML、任意SVG或外部圖片路徑。HTA分解與流程順序分開，二分支手機重排不相接。文字、搜尋與十份受審核SVG同源。驗收用`tests/aase-m0402-replacement.test.ts`與`playwright.aase-m0402.config.ts`；正式站設定`AASE_BASE_URL`。結果見[回執](releases/2026-11-11-aase-m04-02-replacement.md)。

## AASE M03-05 十節新供稿與六圖（2026-11-11）

v1.2.0／revision 5 的[來源對照](sources/aase/m03-05/replacement-2026-11-11/source-map.md)保存完整原文、六張PNG、待換前版與雙語稿。原十節、導言與分母界線成為十二section，舊十一錨點、原發布日與翻譯閘門保留；五個原開放問題搭配Q08–Q12參考解析，qa=[]。`normalize-source.py --check`核對原文與明列正規化；`aase_m0305_content.py --check`核對雙語稿、圖解及正式JSON。

SuccessEvidenceDiagram沿受限cards／flow，revision 5限定evidence-chain／metrics／measure／assumptions／trace／understanding節點數6／3／4／4／4／7，只有第一圖為flow。第二圖是三個平行角色，第六圖使用主張區與六列dl。`successMetrics`固定四瑕疵兩良品，檢查整數邊界；兩個range與全部阻擋按鈕只計算合成資料，無JS停用互動並保留預設及公式。十二個SVG由`aase_m0305_svg.py`從正式模型產生，`--check`比對位元組，下載固定預設。

單元與瀏覽器入口仍為`tests/aase-m0305-replacement.test.ts`、`playwright.aase-m0305.config.ts`。正式站設定AASE_BASE_URL。驗證範圍含完整正文與順序、四尺寸／200%、鍵盤／無JS、兩滑桿、全部阻擋、搜尋、十二SVG邊界／重疊／下載；實際結果與待驗事項見[發布回執](releases/2026-11-11-aase-m03-05-replacement.md)。

## AASE M04-03 完整供稿與六圖（2026-11-11）

AASE-M04-C03 v1.1.0／revision 4 保留原發布日與六個舊錨點。完整來源、六張 PNG、前版及逐節採用在[來源對照](sources/aase/m04-03/replacement-2026-11-11/source-map.md)；兩語各導言及九節、三表、六圖、完整 wireframe-notes.md 模板，三題四選項使用 Q04–Q06 與既有原生參考解析。qa=[]，沒有作答儲存或理解完成主張。

InformationHierarchyDiagram 由受限 cards／flow 承接包含、樹狀、比較、狀態對照、版型與流程；節點數 3／5／2／4／2／5，只有最後五步為 flow。sitemapGroups 解析兩空格子層級，aase.ts 核對完整八個子頁的父子關係；HTML、搜尋、12 份獨立 SVG 同源，固定 SVG 元素及屬性白名單。

`python3 scripts/aase_m0403_content.py --check` 與 `python3 scripts/aase_m0403_svg.py --check` 核對生成一致；單元為 `tests/aase-m0403-replacement.test.ts`，瀏覽器為 `playwright.aase-m0403.config.ts`，正式站使用 `AASE_BASE_URL=https://learn.cs-kairos.com`。全文順序、四尺寸／200%、無 JS、鍵盤、搜尋與圖檔幾何／下載驗證見[發布回執](releases/2026-11-11-aase-m04-03-replacement.md)。

## AASE M04-06 完整供稿與復原圖解（2026-11-11）

完整雙語稿、五參考圖與前版見[來源目錄](sources/aase/m04-06/replacement-2026-11-11/README.md)。以 `python3 scripts/aase_m0406_content.py` 生成正文，`python3 scripts/aase_m0406_svg.py` 生成十份SVG，兩者支援 `--check`。RecoveryDiagram僅在本課revision≥4承接五個cards圖，節點數2／2／3／7／5；驗證器限制種類、欄位與數量。圖4為可聚焦摘要連結的靜態定義清單，圖5為替代條件分支，不是線性流程。

檢查入口為 `tests/aase-m0406-replacement.test.ts` 與 `playwright.aase-m0406.config.ts`，正式站指定 `AASE_BASE_URL=https://learn.cs-kairos.com`。來源、逐小節採用、適用規則、實測與發布界線見[回執](releases/2026-11-11-aase-m04-06-replacement.md)。

## AASE M04-04 Wireframe 完整供稿（2026-11-11）

AASE-M04-C04 v1.1.0由`aase_m0404_content.py`將完整中英成稿及figures.json轉入正式正文；`--check`比對同步。五組既有flow／cards依序為5／4／11／2／2項，只有需求至交付為flow。WireframeDiagram保留四畫面的2×2／窄版重排、十一條起點／事件／終點關係、上傳分支比較與兩張任務卡；不把條件出口畫成必經步驟。驗證器限制課次、位置、種類、節點數、欄位與轉換端點形狀。十個固定白名單SVG由`aase_m0404_svg.py`同源生成，各小於100000 bytes；下載排版差異記在來源對照。三個供稿開放題沿原生參考答案；qa=[]，不提供提交或AI批改。

檢查入口為`tests/aase-m0404-replacement.test.ts`與`playwright.aase-m0404.config.ts`；正式站設定`AASE_BASE_URL`。來源、原版、逐節採用、圖意差異與實測／發布結果見[本次回執](releases/2026-11-11-aase-m04-04-replacement.md)。

## AASE M05-03 完整驗收供稿（2026-11-11）

v1.1.0／revision 6保留原發布日與舊章節錨點；[來源對照](sources/aase/m05-03/replacement-2026-11-11/source-map.md)保存原稿、三PNG與前版。兩語八節、三表、三份完整原碼、四選項Q02與開放Q03進入正式正文，qa=[]。scripts/aase_m0503_content.py由雙語稿產生JSON；scripts/aase_m0503_svg.py由同一JSON產生六SVG，兩者--check核對同步。

AcceptanceDiagram只承接本課固定三圖：mechanism flow三節點、examples cards四平行情境、tests flow五層；aase.ts限制位置、種類、數量及欄位。HTML自然換行，圖2無箭頭，其他箭頭表示情境推進／追溯關係，無任意標記。tests/aase-m0503-replacement.test.ts驗原碼、歷史、閘門與無效圖解；playwright.aase-m0503.config.ts驗完整雙語、四尺寸與200%、無JS、鍵盤、搜尋及SVG邊界／下載位元組。正式站指定AASE_BASE_URL；實測與發布見[回執](releases/2026-11-11-aase-m05-03-replacement.md)。
## AASE M05-04 SDD 五步變更（2026-11-11）

供稿、前版、單圖與[逐小節對照](sources/aase/m05-04/replacement-2026-11-11/source-map.md)由本repo保存。v1.1.0保留原發布日及六個既有錨點，完整雙語承接七節、六列影響表、五列人機分工、兩段候選情境、Markdown範本與三題開放檢核。第四欄仍為候選，三欄工作坊參考程式未改。

`SddChangeDiagram.svelte`只呈現本課loop的五步flow；模型拒絕錯誤位置、種類、節點數與額外標記欄位。`scripts/aase_m0504_svg.py --check`核對同源雙語SVG。正文及搜尋保留所有節點文字，手機以HTML換行，最後節點強調決策，四個箭頭依序向下。維護檢查為 `tests/aase-m0504-replacement.test.ts` 與 `playwright.aase-m0504.config.ts`；正式站指定 `AASE_BASE_URL`。發布與實測另記回執。

### AASE M05-01 Prompt 與 Spec（2026-11-11）

v1.1.0 依供稿抽換九節雙語正文，保留原發布日期與六個既有段落錨點。`scripts/aase_m0501_content.py` 由完整成稿生成 JSON，`--check` 核對同步；三張表、R-01～R-04／T-01～T-04、Agent 任務、BDD 情境與三題原始理解檢核在正文呈現。既有三題為補充檢核，供稿三題沿原生答案展開，不建立提交或評分服務。兩語保留相同中文 spec.md 程式碼，英文有完整條款解讀。

`PromptSpecDiagram.svelte` 使用既有 flow 資料模型，五節點維持參考圖的直向閱讀順序，Verification 獨立框線，回修說明明示回到適當階段；手機換行而不縮小整張圖。驗證器限制此課五節點與受限文字欄位。`scripts/aase_m0501_svg.py` 沿受審核流程 exporter 產生兩份 SVG，大小均低於 100000 bytes；HTML、搜尋與匯出同源。檢查用 `tests/aase-m0501-replacement.test.ts`、`playwright.aase-m0501.config.ts`；正式站以 `AASE_BASE_URL` 指定。詳見[逐節對照](sources/aase/m05-01/replacement-2026-11-11/source-map.md)與[驗收回執](releases/2026-11-11-aase-m05-01-replacement.md)。

## AASE M05-05｜OpenSpec 與輕量 Markdown（2026-11-11）

v1.1.1／revision 5 保留原發布日與六個既有 section 錨點；[來源對照](sources/aase/m05-05/replacement-2026-11-11/source-map.md)持有原稿、兩 PNG、前版、完整雙語成稿、逐段修正與十三小節對照。`scripts/aase_m0505_content.py --check` 核對九節正文、四表、七段文件範例與四道新開放題 Q04–Q07；qa=[]。兩語示例 code bytes 一致，中文原始範例保存在原件。

OpenSpecDiagram 僅接本課兩張 flow：三命令三節點與五步循環五節點。HTML、搜尋及下載 SVG 取自正式 lesson；`scripts/aase_m0505_svg.py --check` 核對四個固定匯出。下載圖與頁面各自重排／固定版面，工具指令、文件格式、行為驗證與封存界線分開解釋。單元檢查為 `tests/aase-m0505-replacement.test.ts`；瀏覽器以 `playwright.aase-m0505.config.ts` 核對全文次序、四尺寸／200%、鍵盤／無JS、搜尋、SVG 幾何與下載 bytes，正式站設定 AASE_BASE_URL。[回執](releases/2026-11-11-aase-m05-05-replacement.md)記錄實際結果與發布閘門。

## AASE M08-01｜驗證證據完整供稿（2026-11-11）

v1.1.0／revision 4 的[來源對照](sources/aase/m08-01/replacement-2026-11-11/source-map.md)保存完整原文、三PNG、前版、雙語稿及SHA256SUMS。八section承接導言與七節，保留五驗證面向、五步紀錄流程、兩表、完整verification-notes.md及三道三選項原題。六個既有錨點與原發布日保留；新題Q04–Q06使用原生收合解析，qa=[]。

`aase_m0801_content.py`生成正式JSON；`VerificationEvidenceDiagram`呈現規格＋五平行面向cards（6節點）、三證據狀態cards（3節點）、協作flow（4節點／3箭頭）。前兩圖不把平行面向或狀態串接成流程。`aase.ts`限制圖的位置、種類、數量與欄位；六SVG由同源JSON經`aase_m0801_svg.py`輸出並以固定白名單檢查。

生成器`--check`、`tests/aase-m0801-replacement.test.ts`及`playwright.aase-m0801.config.ts`檢查同步、固定圖契約、全文順序、四尺寸／200%、無JS、鍵盤、搜尋及SVG下載位元組／文字邊界。正式站使用`AASE_BASE_URL=https://learn.cs-kairos.com`；實測與發布狀態見[回執](releases/2026-11-11-aase-m08-01-replacement.md)。

## AASE M07-05 預覽與匯出供稿抽換（2026-11-11）

v1.1.0／revision 4 保留原發布日與六錨點；[來源對照](sources/aase/m07-05/replacement-2026-11-11/source-map.md)保存原文、兩PNG、前版與完整雙語JSON稿。`aase_m0705_content.py --check`核對十二節、三表、兩圖及四開放題；qa維持空陣列。

PreviewExportDiagram只在M07-05啟用固定四項表單與七節點條件流程。資料修改分支返回檢查，與未變分支保持平行。瀏覽器示範的checkedPreviewReport在匯出邊界檢查三個字串／80字元／快照比對並只輸出允許鍵；工作坊原函式與呼叫端責任另在正文說明。無JS保留靜態例，停用控制項。四個SVG由`aase_m0705_svg.py`以同份資料及固定元素／屬性白名單產生，不接收任意標記。兩產生器都支援--check。

單元為tests/aase-m0705-replacement.test.ts，瀏覽器為playwright.aase-m0705.config.ts；正式站指定AASE_BASE_URL。全文、四尺寸／200%、鍵盤、無JS、JSON下載、SVG與搜尋檢查及正式發布證據見[回執](releases/2026-11-11-aase-m07-05-replacement.md)。


## AASE M06-02｜C4 System Context 供稿抽換

v1.1.0／revision 4保留原發布日與六個既有章節錨點。完整導言及九節、五表、四圖、七節architecture.md與三題原問題，見[逐節來源對照](sources/aase/m06-02/replacement-2026-11-11/source-map.md)。兩語的文件範本可翻譯自然語言，其他可執行code維持逐字核對。Q04–Q06沿用原生details，前兩題三選項保留，不提供批改或學習完成狀態。

SystemContextLessonDiagram復用ArchitectureDiagram與受限cards；四張圖的HTML、搜尋與八份SVG來自正式模型。模型保留每個外部節點與主系統直接相連的條件，允許已連結節點間的補充關係，以保留銀行範例SES→Customer。圖像版面差異、作者及CC BY 4.0授權見來源對照。

維護使用`python3 scripts/aase_m0602_content.py --check`、`python3 scripts/aase_m0602_svg.py --check`、`tests/aase-m0602-replacement.test.ts`與`playwright.aase-m0602.config.ts`，正式站以AASE_BASE_URL指定。[驗證與發布回執](releases/2026-11-11-aase-m06-02-replacement.md)分開記錄本機、正式站與未驗事項。

## AASE M08-04 AppTest 完整供稿（2026-11-11）

AASE-M08-C04 v1.1.0／revision 4 保留原發布日、路徑及六個舊錨點；`run` 錨點位於啟動命令的 h3。供稿導言及九節、三個實作步驟、四表、五段程式／指令與三道四選題完整雙語進入正文。[來源對照](sources/aase/m08-04/replacement-2026-11-11/source-map.md)保存原稿、三 PNG、前版、成稿及修正。`aase_m0804_content.py --check`核對稿件、共享程式與JSON；可執行程式在 `resources/aase/examples/m08-04/`，隨既有工作坊ZIP發布。

`AppTestDiagram.svelte`以受限ConceptVisual呈現三步流程、三個含欄位值的相繼狀態、五項無箭頭語法清單。HTML文字可搜尋、原生重排，六SVG由`aase_m0804_svg.py`同源生成並限制元素與屬性。`aase.ts`拒絕錯誤位置、關係、節點數及額外標記欄位。題目保留原有概念ID，依供稿順序為Q01／Q03／Q02，答案B／C／D；參考解析沿原生details，不建立虛假提交或學習紀錄。

單元為`tests/aase-m0804-replacement.test.ts`；瀏覽器為`playwright.aase-m0804.config.ts`，正式站指定`AASE_BASE_URL`。全文順序、四尺寸／200%、無JS、鍵盤、搜尋、SVG文字邊界／重疊與下載bytes由同一檢查承接。AppTest固定1.51.0實測；啟動本課app於127.0.0.1:8584後，可執行`node scripts/check-aase-m0804-example.mjs`核對真實下載及三階段；各層結果見[發布回執](releases/2026-11-11-aase-m08-04-replacement.md)。
## AASE M07-02 規格與工作契約（2026-11-11）

v1.1.0 的[完整來源與逐節對照](sources/aase/m07-02/replacement-2026-11-11/source-map.md)保留十節供稿、兩張 PNG 及前版。`scripts/aase_m0702_content.py --check` 核對完整雙語正文、七表與四個開放檢核；原任務 code 保持一致，英文附逐項解讀。TaskContractDiagram 使用五步 flow／兩情境 cards，`aase.ts` 限定位置、關係與數量。四份 SVG 由既有文字序列化器同源產生，`scripts/aase_m0702_svg.py --check` 核對同步；頁面維持可選取 HTML、無 JS 正文與原生答案收合。單元入口為 `tests/aase-m0702-replacement.test.ts`，瀏覽器入口為 `playwright.aase-m0702.config.ts`，正式站指定 `AASE_BASE_URL`。[回執](releases/2026-11-11-aase-m07-02-replacement.md)記錄本次實測及發布層次。

## AASE M06-04｜Browser、HTTP、API 與資料流

v1.1.0 保留原發布日與六個舊錨點，十節與導言完整雙語由 `scripts/aase_m0604_content.py` 產生，`--check` 核對成稿同步。[來源與逐節對照](sources/aase/m06-04/replacement-2026-11-11/README.md)保存原稿、四 PNG、前版及原題全部選項。四圖為六步 flow／三層 cards／兩條四節點架構鏈／固定 Network 模擬表；`WebDataFlowDiagram.svelte` 以語意 HTML 重排，只有第一圖與架構內部有箭頭，101 明示為協定升級。八 SVG 由 `aase_m0604_svg.py` 同源匯出。正文保留四個完整程式／訊息範例、五教學表、六產業與三題 Q04–Q06，qa=[]。

驗證入口為 `tests/aase-m0604-replacement.test.ts`、`playwright.aase-m0604.config.ts`；正式站指定 `AASE_BASE_URL`。檢查全文順序、四尺寸與200%、鍵盤、無JS、搜尋、圖檔位元組與字框重疊。來源、實測與發布狀態由[回執](releases/2026-11-11-aase-m06-04-replacement.md)承接。


## AASE M07-01｜環境、骨架與工具鏈（2026-11-11）

[完整來源與對照](sources/aase/m07-01/replacement-2026-11-11/source-map.md)保存九節供稿、四 PNG、前版與雙語成稿。`scripts/aase_m0701_content.py --check`核對正式 JSON；舊六錨點保留，其中 observe 位於停止服務步驟。原三題另存前版，供稿三題以 Q04–Q06 沿既有參考答案收合，qa=[]。

`EnvironmentSetupDiagram.svelte`沿受限 cards／flow 資料，以 HTML dl、ul、ol 與局部程式碼捲動呈現 8 列配對、3 平行環境、5 步順序與 2 平台替代路徑。`aase.ts`限定各節圖數、節點數及關係，拒絕任意欄位；`scripts/aase_m0701_svg.py --check`核對同源的八份固定路徑 SVG，元素與屬性使用 allowlist。原始程式碼保留，PowerShell 命令另補，英文逐項解釋共享範本。

單元為`tests/aase-m0701-replacement.test.ts`；瀏覽器為`playwright.aase-m0701.config.ts`，正式站使用 AASE_BASE_URL。全文、四尺寸、200%、無 JS、鍵盤、搜尋、八圖幾何與下載位元組依[發布回執](releases/2026-11-11-aase-m07-01-replacement.md)記錄。本次不更改工作坊規格或套件版本。

## AASE M06-05 身分、授權與工作階段完整供稿（2026-11-11）

AASE-M06-C05 v1.1.0 保留原日期、URL 與六個舊錨點，導言及八節完整雙語、六表、五個深層小節與三題新檢核。原文、三 PNG、前版及採用差異見[來源對照](sources/aase/m06-05/replacement-2026-11-11/source-map.md)。`aase_m0605_content.py` 由完整稿及 figures.json 生成正式 JSON，`aase_m0605_svg.py` 由正式資料生成六個受限 SVG，兩者支援 `--check`。

`SessionAccessDiagram.svelte` 僅處理本課四因素、Session／權限條件分支與瀏覽器／伺服器分工；資料驗證限定 cards 與 4／6／3 節點，不接受任意標記。全文與搜尋共用資料，手機重排保持拒絕與許可的條件標籤。瀏覽器檢查為 `playwright.aase-m0605.config.ts`，正式站指定 AASE_BASE_URL；實測及發布證據見[回執](releases/2026-11-11-aase-m06-05-replacement.md)。候選 architecture.md 保持待實作／待驗證，不宣稱 Streamlit 原型具備正式登入或多人隔離。

## AASE M06-03｜C4 四視角與七圖（2026-11-11）

`AASE-M06-C03` v1.1.0 的[完整來源與逐節對照](sources/aase/m06-03/replacement-2026-11-11/README.md)承接導言、原八章、四層小節與 Session State 小節、四表及原三題三選項。原六錨點、發布日與課次 URL 保留；architecture.md 模板同行附中英，code 兩語一致。

`C4ViewsDiagram.svelte` 僅用於本課固定七圖：放大層級、邏輯角色與三實例、C1 邊界、C2 應用與儲存、程序內四元件、Streamlit 程序與外部下載、四階段盤點。依序節點數4／4／3／5／4／6／4；aase.ts限制圖位置、cards種類、數量與文字欄位。並列副本／元件不加時序箭頭，支付及下載關係明列真正端點，窄欄保留內外與程序包含關係。

正式 JSON 同源產生 HTML／搜尋／十四份 SVG；`python3 scripts/aase_m0603_svg.py --check`核對衍生檔。`tests/aase-m0603-replacement.test.ts`檢查原件／版本／錨點／三選項、範例執行及非法資料拒絕；`playwright.aase-m0603.config.ts`核對全文、四尺寸／200%／無JS、鍵盤、SVG字框及下載。正式站設定 `AASE_BASE_URL=https://learn.cs-kairos.com`。實際檢查與發布狀態見[回執](releases/2026-11-11-aase-m06-03-replacement.md)。

## AASE M06-01｜流程與架構完整抽換（2026-11-11）

本課v1.1.0使用既有sections／prose／step／table／cards／flow；兩語各導言加八節、三表、兩Python範例、三題三選項。`FlowArchitectureDiagram.svelte`依本課固定五圖呈現餐廳時序、三個平行接收者、完整性是／否與重查回圈、Streamlit主機內同程序／規則／狀態、C4逐層縮放；窄版保留關係文字及分組，下載SVG共用正式JSON。驗證器限定本課revision>=4的位置、種類、節點數5／5／7／6／4及欄位。

維護`python3 scripts/aase_m0601_content.py --check`、`python3 scripts/aase_m0601_svg.py --check`、`tests/aase-m0601-replacement.test.ts`及`playwright.aase-m0601.config.ts`；正式站設定AASE_BASE_URL。完整供稿、舊版、圖意差異及逐小節採用在[來源對照](sources/aase/m06-01/replacement-2026-11-11/source-map.md)，本輪各層證據在[回執](releases/2026-11-11-aase-m06-01-replacement.md)。

## AASE M08-06｜資安負向情境與回歸證據（2026-11-11）

v1.1.0／revision 4 保留原發布日與六錨點；導言及原九節、五表、七個 code 區塊、三題 4／4／3 選項完整雙語抽換。原稿、參考圖、前版、逐小節採用與截斷程式的修正見[來源紀錄](sources/aase/m08-06/replacement-2026-11-11/README.md)。`aase_m0806_content.py --check`核對成稿及正式 JSON；`aase_m0806_svg.py --check`核對兩語 SVG。五步垂直 flow 由 RegressionEvidenceDiagram 呈現，最後淡綠，aase.ts 限制一圖五節點及文字欄位。單元 tests/aase-m0806-replacement.test.ts；瀏覽器 playwright.aase-m0806.config.ts。獨立 pytest 三例只驗非空字串與允許欄位，多人授權保持未實作、未驗證。實測及正式站回讀見[回執](releases/2026-11-11-aase-m08-06-replacement.md)。

## AASE M07-03｜第一個表單切片（2026-11-11）

AASE-M07-C03 v1.1.0／revision 4 的八節雙語全文、五產業表、六術語表、七列驗收表及三題開放問題，依[供稿與對照](sources/aase/m07-03/replacement-2026-11-11/source-map.md)抽換；原六錨點與原發布日保留，qa=[]。完整 app.py 保留可選取程式碼，原稿黏合換行修復另記技術查核。

VerticalSliceDiagram 只接本課 slice 四節點 cards 及 roadmap 四節點 flow；VerticalSliceForm 接 behavior 三節點 cards，欄位標籤與預設值來自正式模型，輸入與未檢核預覽只在記憶體中。網頁每次 input 清除舊結果；Python 範例 on_change 在變更提交時清除，正文明示差異。無 JS 保留預設欄位與靜態解說並停用控制。圖 1 比較平行分層；圖 3 使用編號呈現課程階段，沒有自動業務判定。

六份受限 SVG 由 `python3 scripts/aase_m0703_svg.py` 從同一模型匯出，`--check` 核對同步；圖 2 固定為預設狀態。單元 `tests/aase-m0703-replacement.test.ts`、Python `scripts/test_aase_m0703.py` 與瀏覽器 `playwright.aase-m0703.config.ts` 分別檢查資料／閘門、真實 Streamlit rerun、全文／四尺寸／200%／無 JS／鍵盤／SVG。正式站指定 `AASE_BASE_URL`；實際結果見[回執](releases/2026-11-11-aase-m07-03-replacement.md)。

## AASE M07-07 完整抽換（2026-11-11）

M07-07 v1.1.0 的[來源、前版與逐節對照](sources/aase/m07-07/replacement-2026-11-11/source-map.md)保存十節供稿、四張 PNG、完整雙語與三道新檢核。`scripts/aase_m0707_content.py --check` 核對正式 JSON，`scripts/aase_m0707_svg.py --check` 核對八份受審核 SVG。四圖依序為六階段 flow、六項表單 cards、三階段 flow、四段範本 cards；模型限定課次／位置／種類／數量與欄位。

`DebuggingDiagram.svelte` 使用同源可搜尋 HTML、容器重排與固定下載路徑。`stale-report.ts` 對照 Bug 的舊快照存在與 Fixed 的完整性／快照一致性，編輯時另使舊結果失效；下載僅為標記 simulation=true 的本機合成文字。無 JS 控制停用，保留預設三欄與完整靜態比較；範本可手動選字。原發布日、路徑、六個舊錨點及雙語閘門保持；新 Q04–Q06 三選項與原生參考解析不建立作答或學習狀態。

本課單元入口 `tests/aase-m0707-replacement.test.ts`，瀏覽器入口 `playwright.aase-m0707.config.ts`；正式站指定 `AASE_BASE_URL=https://learn.cs-kairos.com`。驗證／發布分層與具體結果見[發布回執](releases/2026-11-11-aase-m07-07-replacement.md)。

## AASE M09-03｜成果展示與驗收證據（2026-11-11）

完整九節供稿、兩張參考 PNG、前版與逐小節採用見[來源紀錄](sources/aase/m09-03/replacement-2026-11-11/README.md)。v1.1.0 保留原發布日及六個舊錨點；原三題與工作坊具體追溯表作補充，三個新開放問題及編輯解析沿原生收合，qa=[]。

`aase_m0903_content.py`由雙語採用稿產生正式 JSON；`aase_m0903_svg.py`同源產生四份受限 SVG。AcceptanceEvidenceDiagram 只接本課五步 flow／三列 cards，HTML 保留垂直閱讀及實際觀察強調，下載不接受任意標記。兩支腳本的 `--check`、`tests/aase-m0903-replacement.test.ts` 與 `playwright.aase-m0903.config.ts` 分別核對同步、資料邊界及實際全文／四尺寸／放大／無 JS／鍵盤／下載。發布狀態以[回執](releases/2026-11-11-aase-m09-03-replacement.md)為準。

## AASE M09-02｜README、限制與交接（2026-11-11）

v1.1.0／revision 4 的[來源與逐小節對照](sources/aase/m09-02/replacement-2026-11-11/README.md)保存原文、兩張PNG與前版。七章完整雙語保留餐廳四小節、兩表、示意命令、三種證據、三行摘要README及原三道開放問題；另保留既有工作坊實際命令與六個錨點，原發布日不變。

`aase_m0902_content.py --check`核對雙語稿與正式JSON；`aase_m0902_svg.py --check`核對四份白名單SVG。HandoffSection僅承接本課四階段flow與八項cards，aase.ts限制位置、種類、數量及文字欄位，維持HTML／搜尋／SVG同源。清單計數0–8只代表文件盤點，重設清除本頁選取；無JS保留八列，互動停用。

單元`tests/aase-m0902-replacement.test.ts`，瀏覽器`playwright.aase-m0902.config.ts`；正式站使用AASE_BASE_URL。全文、表格、四尺寸／200%、無JS、鍵盤、勾選重設、搜尋及四SVG下載／字框檢查由[回執](releases/2026-11-11-aase-m09-02-replacement.md)記錄。

## AASE M09-01 Git、Diff、Commit 與還原（2026-11-11）

M09-01 v1.1.0 由[完整雙語稿與逐小節對照](sources/aase/m09-01/replacement-2026-11-11/source-map.md)產生，保存十節、五表、十段指令及三題四選項。`python3 scripts/aase_m0901_content.py --check` 核對同步；既有六錨點及原發布日保留。`GitHistorySection.svelte` 承接本課正文順序與受限四位置 flow／四條件 cards；文字跳脫，只有固定裝飾 SVG 箭頭。aase.ts 限定圖位置、節點數、種類、欄位及 add／commit／push 標籤順序；並列條件不接箭頭。`python3 scripts/aase_m0901_svg.py --check` 由同源模型核對四份受審核 SVG。

`tests/aase-m0901-replacement.test.ts` 實跑 A–D 合成 Git 練習；`playwright.aase-m0901.config.ts` 驗證兩語全文、四尺寸、200%、無JS、鍵盤、搜尋與下載。正式站使用 `AASE_BASE_URL=https://learn.cs-kairos.com`。結果與限制見[本次回執](releases/2026-11-11-aase-m09-01-replacement.md)。

## AASE M07-06 審查 Diff、工具紀錄與決策（2026-11-11）

本課 v1.1.0 的[逐節對照](sources/aase/m07-06/replacement-2026-11-11/source-map.md)保留原稿、五張 PNG、前版、完整中英稿與雜湊。`aase_m0706_content.py` 將十節、六表（包含圖3）、十一段程式／輸出與三道開放題編譯為正式 JSON，`--check` 核對同步。六個既有錨點、原發布日與路由保留；三道新題使用 Q04–Q06，答案沿原生收合，qa=[]。

`AgentReviewDiagram` 只接 M07-06 的五張固定圖；平行三依據匯入人審查、Git 三位置、三欄證據表、五步流程及完整決策示例各保有原圖關係。HTML 文字可搜尋，窄欄重排，寬表局部鍵盤捲動；示例不建立提交或評分服務。十份 SVG 由 `aase_m0706_svg.py` 讀取正式 JSON 產生，固定元素與屬性白名單、escaped text、單檔小於 100000 bytes，不接受執行期任意 SVG。單元入口 `tests/aase-m0706-replacement.test.ts`；瀏覽器入口 `playwright.aase-m0706.config.ts`，正式站設定 `AASE_BASE_URL`。本次[回執](releases/2026-11-11-aase-m07-06-replacement.md)分列實測與待驗。
