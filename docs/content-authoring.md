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
