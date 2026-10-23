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

Sections may include `blocks`: semantic `table` (caption, headers, rows), `step` (heading, paragraphs, optional code), or collapsible `details`. Keep bilingual structure aligned. Optional `checks` contains teaching tests, each with a stable ID, zero-based answer, and bilingual prompt, four options and four rationales. Tests and their expandable explanations are distinct from `qa`; expanding an answer neither submits a learner response nor confirms understanding.
