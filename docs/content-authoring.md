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
2. Run `npm run validate:content`, `npm test` and `npm run check`.
3. Run the actual publication-boundary build and static release checks described in the [runbook](publishing-security.md).
4. Review article, paired language, glossary backlink, quiz and exercise at narrow and desktop widths. Run executable examples locally and record only observed outputs.
5. Change a question revision whenever its wording or answer semantics change enough to invalidate prior attempts. Keep its stable ID for the same concept; use a new ID for a different question.
6. Publish through a reviewed PR and verify the deployed URL. Record independent learner feedback when obtained; do not infer it from tests.

All lessons, module quizzes and wrong-answer review consume the same question object. Search text is generated from the published catalog. No copied answer bank, manual search index or parallel lesson list is needed. Future-dated content is excluded until a later authorized build; it is not an automatic publication schedule.

[Architecture](platform-architecture.md) · [Decision history](ceh-bilingual-publishing-plan.zh-tw.md) · [Release evidence](releases/2026-10-23-phase-0-3.md)

## One-concept reading route — October 23

`content/concepts.json` is the ordered registry of stable IDs, modules and bilingual titles. Pending concepts have registry entries but no published teaching. Each teaching lives in `content/concepts/<lowercase-id>.json`; its `id` must match a registry entry. `src/lib/concepts.ts` validates the data and applies the shared status/date gate to routes, search, navigation and public page data. No original lesson reference or route-code edit is needed to publish the next concept.

Teaching fields: `id`, positive `revision`, `date` (content revision date), `status` (`draft` or `published`), `publishedOn`, and `text.zh` / `text.en`, each with `summary` and `sections` (`id`, `heading`, `paragraphs`). Both languages use the same section IDs. Keep published IDs and URLs stable. M04-01 revision 2 preserves the seven-section teaching scope, with reviewed technical corrections; exact supplied originals remain in their designated source archives.

Optional `qa` is an array of anonymized actual questions and discussion supplied by the learner: each has a stable `id` and `text.zh` / `text.en` with `question` and an `answer` array of paragraphs. Omit it or use `[]` to display pending. Actual learner wording stays in the private source archive; public Q&A excludes identifying information, secrets and nonpublic third-party material. No private source path, delivery ID or progress belongs in website content.

Shortest update workflow:

1. Preserve supplied originals in the adopted private archive; publish only reviewed teaching and anonymized discussion. Preserve the already-public initial teaching archive. Record delivery separately from understanding.
2. Add the registry entry if needed; create or edit its teaching JSON, both languages and optional anonymous Q&A. Increment revision for a content change. Keep draft/future content closed; use `published` only after review.
3. Run `npm run validate:content`, `npm test`, `npm run check`, `node scripts/check-publication-boundary.mjs` and `npm run validate:release`. The boundary check renders an isolated second-concept fixture, removes it, tests draft/future exclusion, then rebuilds clean production output. Reserved fixture IDs M04-98 and M04-99 are never production curriculum.
4. Check mobile/desktop, bilingual body and Q&A, previous/next links, search and missing IDs. Publish through the existing PR/Pages workflow; read back the exact public URL and record the deployment commit/run in private progress and the thin daily index.

Routes, search and navigation resolve by concept ID. Pending neighbors link to their module-index anchor. Registry order determines adjacency across modules, so add later modules in the intended editorial sequence. Each module retains its own concept count; M04 has twelve core topics followed by M05, with seven optional recognition/risk topics.

Sections may include `blocks`: semantic `table` (caption, headers, rows), `step` (heading, paragraphs, optional code), or `details` (legacy data kind, rendered as an ordinary visible section). Keep bilingual structure aligned. Optional `checks` contains teaching tests, each with a stable ID, zero-based answer, and bilingual prompt, four options and four rationales. Tests and their directly visible explanations are distinct from `qa`; reading an answer neither submits a learner response nor confirms understanding.

Revision 3 adds text-first `flow` and `cards` blocks, each with a caption, description and title/body items. Use ordered lists for a process and parallel unordered cards for independent permissions. These figures are readable HTML with CSS, not images or progress trackers. Supply both languages and keep all content searchable. Use statistical charts only when actual data answers a relevant question.

## Responsive teaching diagrams — adopted October 25

Use the verified [M04-01 v6 simulation card](https://learn.cs-kairos.com/courses/ceh/v13/m04/concepts/m04-01/) as the default presentation pattern when a concept benefits from a diagram. This is a visual preference, not a requirement to illustrate every paragraph or rebuild older lessons. It does not change test authorization, delivery order, learner understanding or publication permission. The [CEH teaching bridge](https://github.com/JasonLn0711/ceh-cehp-certification-notes-2026/blob/main/docs/public-teaching-bridge-2026-10-23.md#responsive-teaching-diagrams) links this standard to the learning workflow.

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

[AccessDiagram.svelte](../src/lib/components/AccessDiagram.svelte) renders the responsive card; [SourceBody.svelte](../src/lib/components/SourceBody.svelte) places it in the original text order. The `accessDiagram` block in [M04-01 content](../content/concepts/m04-01.json) contains the original eight text segments. The catalog includes them in search. The current block is a validated, specific simulation-card shape; adapt the schema deliberately when another diagram needs different semantics rather than forcing unrelated content into it.

The [standalone SVG source](../site/images/ceh/m04-01-access-results.svg) and [published SVG](https://learn.cs-kairos.com/images/ceh/m04-01-access-results.svg) are **1,855 bytes** at this reference version. The verified minimum text contrast is 5.4:1. [Implementation commit](https://github.com/JasonLn0711/kairos-learning/commit/3fba077d5691b98972100ecb95e084ef3cf11a61) and [successful deployment](https://github.com/JasonLn0711/kairos-learning/actions/runs/40163169848) identify the baseline; remeasure after any asset change.

### Acceptance and publication

For each changed diagram, record source-text comparison, actual image bytes, alternative text, contrast, viewport checks, keyboard behavior when applicable, search inclusion and downloaded-file equality. Preserve neighboring content, language scope, Q&A disclosures and code styling. Run the existing content/type/tests, publication-boundary build and release-link/asset checks from the [publishing runbook](publishing-security.md). After the authorized deployment succeeds, read the actual public page and asset back and compare them with the verified build. A commit, build or screenshot alone is not production confirmation.

Keep detailed engineering evidence with the website release and link the outcome from the CEH source record and private Planning index. This standard adds no schedule, learner completion claim, automatic retrofit or new permission to publish.

### How the published diagrams work and how to maintain them

This implementation uses **Svelte 5 + SvelteKit + Vite**, with `adapter-static` producing the `build/` website. It uses neither React nor Mermaid, and adds no charting package. See [package scripts](../package.json), [static adapter configuration](../svelte.config.js) and the [Pages workflow](../.github/workflows/pages.yml).

There are two coordinated representations, not one automatically responsive SVG:

1. **The page illustration is semantic HTML with CSS.** [QAIllustration.svelte](../src/lib/components/QAIllustration.svelte) renders figure/caption, text nodes, cards and connection labels from [bilingual diagram data](../src/lib/qa-illustrations.json). CSS Grid lays out clients/consumers in two columns; at `max-width:420px` it switches to one column. Flex wrapping moves status text onto another line. Text reflows rather than shrinking a desktop picture. Explicit connection endpoints remain readable after stacking, so the mobile layout does not imply A connects to B or consumer B forwards to C.
2. **The downloadable illustration is a standalone SVG file** under `site/images/ceh/m04-01-qa-*.svg`. Its `viewBox` defines a fixed coordinate system; a viewer can scale it proportionally, but this file does **not** independently rearrange its nodes on mobile. The page does not display the standalone file as its main responsive illustration. SVG title/description and visible text describe the diagram. Simple rectangles, paths and text keep each file around 1–3 KB without embedded raster pixels, fonts or JavaScript. Those byte counts describe the SVG assets, not the entire webpage or framework bundle.

The earlier [AccessDiagram.svelte](../src/lib/components/AccessDiagram.svelte) similarly uses HTML/CSS for the full card, with small inline SVG icons (`viewBox="0 0 24 24"`). At 420px, results wrap onto their own row. Its entire card is a download link with a complete accessible label; the underlying figure has a full text alternative and hides duplicated decorative content from assistive technology. New Q&A figures instead expose their real text and caption directly, hide decorative symbols, and provide an explicit download link. Enter activates focused links; native Q&A summary controls support Enter/Space. Visible focus outlines and labels/icons supplement colors. These are basic accessibility checks, not a claim of comprehensive screen-reader certification.

**Content placement and maintenance:** the original Q&A remains in [M04-01 JSON](../content/concepts/m04-01.json). [QAAnswer.svelte](../src/lib/components/QAAnswer.svelte) currently identifies the specific SMB status sequence and architecture A/B labels, inserting figures at those exact positions. It replaces the six status labels with equivalent figure text once, preserving source order. This is a deliberately scoped placement rule, not an automatic diagram generator for arbitrary prose. If the source labels change or another lesson needs figures, update and test an explicit mapping rather than assuming the current matching rule generalizes. [SourceBody.svelte](../src/lib/components/SourceBody.svelte) provides the separate typed `accessDiagram`/`visual` route used in lesson bodies.

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

### M04-01 whole-page visual presentation patch

Version 2.0.1 (internal revision 9) adds eight optional visual aids while preserving all original body/Q&A wording, order and tests. [M0401Visual.svelte](../src/lib/components/M0401Visual.svelte) reads [the bilingual visual manifest](../src/lib/m0401-visuals.json); cards reflow from two columns to one at 540px, and ordered flows remain vertical. Originally these visual aids used closed disclosures. The October 25 direct-reading preference below supersedes that behavior: figures and their labels now render directly, including inside an opened parent Q&A. All labels join the concept search text. Sixteen fixed-layout SVG downloads remain separate from the reflowing HTML.

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

修改圖解後執行 `npm run generate:readable-diagrams`，核對描述、標籤、分組與原圖；`python3 scripts/build-readable-diagrams.py --check` 檢查產物同步。`ReadableDiagramText` 只輸出文字，不接受任意 SVG／HTML；原 SVG 仍經既有受審核邊界。重排文字直接可見，參考答案才使用原生收合。

驗收入口：`npm run test:browser:m01-m02`。測試包含 32 頁四種寬度、200% 根文字大小、鍵盤順序、原生收合、局部捲動、無 JavaScript 與原圖下載。另執行既有內容、型別、單元、發布閘門及靜態發布檢查。結果與範圍見 [M01–M02 改善紀錄](releases/2026-11-01-m01-m02-readability.md)。


## 文章日期資訊列

依 [WRITE-06](article-standards.md#原發布版本與修訂日期write-06)維護日期；由 [ArticleMetadata](../src/lib/components/ArticleMetadata.svelte)統一呈現。概念文章使用 `publishedOn`、`contentVersion`／`revision`、`date`；觀點使用 `publishedOn`、`contentVersion`、`updatedOn`，內部 `revision` 不作顯示版號。章節教材新增可選 `contentVersion` 與 `revisedOn`，校對仍使用 `reviewedOn`；`revisedOn` 必須是有效日期且不早於原發布日。舊章節缺修訂紀錄時省略，不把 `reviewedOn` 改當修訂日。

閱讀改善視為文章版本更新，依影響提升 patch／minor／major 並同步修訂日期；不新增獨立「閱讀更新」欄位。原稿、全文順序及原發布日保留。共享元件變更需列出實際影響文章，依同一規則判定，不能以 UI-only 為由跳過版本記錄。本次三篇舊章節 `v1` 明確以 1.0.0 作語意基準，閱讀修訂採 `v1.0.1`、內部 revision 2；歷史 v1 標示仍由 Git 保留。MATLAB 靜態原稿依既有保留要求維持原檔，後續有文章修訂需求時依同規範處理。

11/01 版本規則優先於本文件早期「shared UI-only release 不改教材版本」的做法；舊段落作為歷史保留，新修訂遵循 [WRITE-06](article-standards.md#原發布版本與修訂日期write-06)。純重新建置或部署仍不升版。

授權發布後，使用 `CEH_READING_BASE_URL=https://learn.cs-kairos.com npx playwright test --config playwright.m01-m02.config.ts` 對正式站重跑同一組驗收；正式站證據寫入 `.local/m01-m02/live/`，本機結果另存。測試不會自行部署。

## 結構化記憶體與分層圖解

新增 `cells`、`stages`、`layers`、`reference`、`lifetime`、`access-path` 版型及受限 cells／released 欄位，契約、響應式規則與驗收統一依[圖解設計規範](diagram-design-system.md)。新增教學範圍與版型的實作見[記憶體基礎回執](releases/2026-11-01-nas-memory-foundations.md)。

## M02-06 網路角色圖與 CIDR 模擬器

M02-06 v1.1.0 直接替換第 2–4 節，第 8 節承接查詢練習與整合案例；第 5–7、9 節及原始 SVG／ZIP 保留。[修訂驗收](releases/2026-11-01-m02-06-network-revision.md)記錄採用範圍與來源差異。

六張新圖沿用 `sourceBody.visual`，以已知 `/images/ceh/m02-06-<layout>-<lang>.svg` 路徑選取 [雙語圖解資料](../src/lib/m0206-network-diagrams.json)。版型只接受 network-map、prefix-bits、private-network、bgp-routing、cdn-origin、proxy-modes；節點數依序為 4、4、4、3、4、5。資料含 caption、description、nodes（title／body／tone）、labels、footer；兩語節點順序一致，IP、ASN 與位元數一致。任意路徑不會啟用新渲染器，文字由 Svelte 跳脫，不接收任意 HTML 或 SVG 標記。

[NetworkDiagram](../src/lib/components/NetworkDiagram.svelte)用語意 HTML 與容器查詢重排；群組保留平行設備、條件回源、控制面與資料面差異。獨立 SVG 由 [產生器](../scripts/m0206_network.py)讀取同一資料，以固定桌面座標呈現，再經既有嚴格 serializer 產生受審核檔案。新圖使用原生 HTML 正文，不重複展示整張縮小的 SVG；舊 Traceroute 與證據流程圖繼續使用 ReviewedSvgVisual。

[CidrExplorer](../src/lib/components/CidrExplorer.svelte)只計算固定 192.0.2.25 的 /24–/30；使用原生 range、可見標籤、鍵盤與 aria-live。無 JavaScript 時控制停用，/24 預設計算仍可閱讀。此模擬不發出網路請求、修改設定或保存學習進度。理解題使用既有原生參考答案收合，不提供虛構的送出／評分功能。

維護順序：

```sh
python3 scripts/m0206_network.py
python3 scripts/m0206_svg.py
python3 scripts/m0206_content.py
npm run generate:readable-diagrams
npm run validate:content
npm test
npm run check
node scripts/check-publication-boundary.mjs
npm run validate:release
npm run test:browser:m0206
```

第二步同步十二張新下載圖、原有受審核註冊表及獨立 network-svg.zip；不改寫原 bilingual-svg.zip。`--check` 驗證來源圖、序列化輸出與 ZIP 確定性。英文換行保留完整詞；瀏覽器檢查 SVG 文字在 viewBox 內且不與箭頭交疊。圖號 1–6 是這次網路角色補充的內部順序，舊圖以原標題辨識；stable section-* 錨點與既有課程路線保留。

## M03-01 隨文傳輸圖解（2026-11-03）

[M03-01 v1.1.0 修訂回執](releases/2026-11-03-m03-01-transport.md)記錄九節正文替換、三題參考答案、四張參考圖與原版保存。[正式圖解模型](sources/m03-01/diagram-models.json)只含 overview、handshake、transport、tuple 四種版型，兩語節點數依序為 3、3、2、5；端點與 TCP 交握方向、TCP 重傳及 UDP 遺失須共同驗證。

`python3 scripts/m0301_diagrams.py` 產生受限資料副本與來源 SVG；再依序執行 `m0301_svg.py`、`m0301_content.py`。SVG 沿用既有 fail-closed serializer，viewBox 維持 900×624，繪圖座標以等比 transform 保留參考圖比例。`TransportDiagram.svelte` 使用同一份資料輸出可選取 HTML，窄欄重排，不把縮小 SVG 當成手機正文。下載 SVG 與 ZIP 保留桌面關係；來源原版在 `archive-v1.0.0/`。

驗收：內容、單元、型別、發布邊界、靜態輸出，加上 `npx playwright test --config playwright.footprints.config.ts`。圖解原生顯示，三題參考答案預設收合；`qa` 維持空陣列。原發布日不變，修訂與學習進度分開記錄。

## M03-02 ICMP／ARP 白話教學與比較圖

v1.1.0 依 2026-11-03 供稿替換主機探索、ICMP、ARP 說明，補充 Ubuntu 觀察練習與三題情境檢核；原發布日與 section-1 至 section-9 保留。兩語各七個原生參考答案預設收合，`qa` 仍為空。原稿與參考圖保存於 [來源紀錄](sources/m03-02/revision-2026-11-03.md)。

[discovery-diagrams.json](sources/m03-02/discovery-diagrams.json)只提供兩種已知版型：outcomes 為三張卡，next-hop 為兩張卡；每卡含 2 或 3 個 endpoint（title、address）、相鄰節點的有向 edge（source、target、label、solid／dashed）、claim 與 notes。ICMP 前兩卡有去回兩條 edge，第三卡只有送出但未確認交付的虛線。ARP 本地卡去回兩條 edge，遠端卡依序交付閘道與遠端；後者是資料轉送，不是 ARP 跨路由器。

產生器驗證關係與純資料，HTML 與 SVG 共用同一來源。`DiscoveryDiagram.svelte` 僅依四個已知資產路徑選取模型，以 Svelte 跳脫文字；不接受任意 SVG 或 HTML。650px 以上圖欄並排比較，較窄時按 DOM 順序重排；各卡寬度不足時 endpoint 與方向箭頭改成直向。原圖保留參考圖的桌面分組與雙向／轉送關係，採 852×600 viewBox 與內部等比例座標，沿用既有 SVG sanitizer，不放寬審核邊界。原圖下載可放大，HTML 節點保持正文大小。

維護順序：

```sh
python3 scripts/m0302_discovery.py
python3 scripts/m0302_svg.py
python3 scripts/m0302_content.py
npm run validate:content
npm test
npm run check
node scripts/check-publication-boundary.mjs
npm run validate:release
npm run test:browser:m0302
```

新圖四份 SVG 可逐張下載；舊八份 SVG 與原 ZIP 保留。`m0302_discovery.py --check` 驗證來源 SVG 與 HTML 模型同步，`m0302_svg.py --check` 驗證受審核產物與搜尋標籤。瀏覽器驗收檢查雙語四尺寸、200% 文字、無 JavaScript、鍵盤操作、下載位元組與 SVG 文字邊界。依專案 AGENTS.md，文章修訂包含該次修改的提交與部署授權；完成驗證後接續發布，再執行正式站回讀。本機驗收不能代替正式站回讀。[修訂回執](releases/2026-11-03-m03-02-discovery.md)


### M03-02 ARP 補充 v1.2.0

[ARP 補充回執](releases/2026-11-03-m03-02-arp-supplement.md)記錄 5–6 節旁文、8.3–8.4 查詢／學習路線及 9.2 四題整合檢核；兩語各十一題參考答案。圖 1／2 及全部 visual 區塊、ICMP 第 1–4 節、原七題答案保留，以來源目錄的雜湊與 v1.1.0 JSON 比對。此次只需執行 `m0302_content.py` 產生教材；圖解產生器以 `--check` 驗證，無需改寫既有圖檔。

## M03-03 掃描判讀與本機範例

M03-03 v1.1.0 的四張隨文圖使用 `src/lib/m0303-scan-diagrams.json`，由 `ScanDiagram.svelte` 顯示可換行 HTML，`scripts/m0303_diagrams.py` 產生同資料 SVG，再由 `scripts/m0303_svg.py` 經既有嚴格 serializer 匯出與封裝。限定 connect／syn／udp／positions；兩種 TCP 流程方向固定 right、left、right，最後分別為 ACK、RST；UDP 四卡為替代結果，位置三列為獨立路徑。來源文稿經 `scripts/m0303_content.py` 轉為既有 sourceBody，保留標題與答案錨點。舊 footprint 註冊移除本課，避免重複呈現過期圖解。

維護時依序執行三支 m0303 產生器、`npm test`、`npm run check`、發布邊界及 release 檢查，再用 `npx playwright test --config playwright.m0303.config.ts` 驗收。正式站設 `CEH_BASE_URL=https://learn.cs-kairos.com`。來源與差異見 [source review](sources/m03-03/source-review.md)，驗收見 [修訂回執](releases/2026-11-03-m03-03-replacement.md)。

## M03-04 狀態判讀 v1.1.0

來源與舊版保存在 [source review](sources/m03-04/source-review.md)所列目錄。修改兩語 Markdown 後執行 `python3 scripts/m0304_content.py`；本次沿用全部受審核圖，不需重製 SVG。依序完成內容、單元、型別、發布邊界及 release 驗證，再執行 `npx playwright test --config playwright.m0304.config.ts`；正式站以 `CEH_BASE_URL=https://learn.cs-kairos.com` 回讀。驗證範圍與限制見[修訂回執](releases/2026-11-03-m03-04-replacement.md)。

### M03-04 v1.1.1 小節完整性

依使用者更正，供稿各章內的小節必須完整呈現，不能用章級摘要取代。`detailed-section-map.json` 對應 64 個中英標題；中文全文以原供稿加上 `detailed-editorial-changes.json` 的明列修正核對。沿用既有 h2／h3 sourceBody，不改共用渲染器；33 個命令／ASCII 區塊保留可選取文字與鍵盤局部捲動。[本次回執](releases/2026-11-03-m03-04-detailed.md)取代上一版對教學深度的完成主張。
