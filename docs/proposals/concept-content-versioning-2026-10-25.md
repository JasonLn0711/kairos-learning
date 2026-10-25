# Concept content versions — approved baseline, October 25, 2026

Status: **APPROVED — option B selected October 25, 2026.** M04-01 migrates from legacy v8 to public content version **v2.0.0**, with its integer `revision: 8` retained. The baseline content is deployed commit `bf4dce8839e42040dd1bf00856eb57d2f05e8780`. Earlier labels, receipts and source files remain unchanged. No teaching text, diagrams, quizzes, language bodies, learning states or concept URLs change. Both language pages receive edition metadata only; this does not claim a new English rewrite.

The alternative analysis below remains a historical explanation of the decision, not adopted retrospective labels. Future updates follow the major/minor/patch rules; other concepts retain their legacy labels until explicitly migrated.

## Meaning and release rules

Use `vMAJOR.MINOR.PATCH` for the public **content edition**, for example `v2.1.0`. This is an editorial version scheme, not a promise of software API compatibility.

| Level | Decision criterion | Examples | Reset rule |
| --- | --- | --- | --- |
| Major | Reshape the learning objectives or the lesson's overall narrative/learning architecture so readers need a new coherent reading path. A local heading change is insufficient. | Replace the governing teaching model; redesign the complete explanatory progression. | `2.4.3 → 3.0.0` |
| Minor | Add or substantially revise a section, real Q&A, meaningful explanatory diagram, exercise or assessment while retaining the lesson's governing purpose. | Add the two SMB/Kafka discussions; introduce diagrams that add teaching content or new understanding. | `2.4.3 → 2.5.0` |
| Patch | Refine wording, formatting, accessibility presentation or links without changing conceptual conclusions, scope of evidence, exercises or meaningful teaching coverage. | Typo, broken link, wrapping fix; rename a heading or visualize existing text without changing its meaning. | `2.4.3 → 2.4.4` |

A diagram is not automatically minor. A status card or layout that only makes existing text clearer is patch; new explanations, learning content or substantive new understanding are minor. Classify the educational change, not the use of a new visual technique.

A significant conceptual error correction is **at least minor**; use major if it changes the learning model or core conclusion. Record the incorrect claim, corrected claim and affected editions. Never hide it as cosmetic patch work. A small typo that does not alter meaning remains patch. When a release combines changes, use the highest applicable level once. Reset lower components on major/minor increments. A failed deployment, retry or unchanged rebuild does not increment the content version. Assign an edition to the verified release; keep the previous public edition until publication succeeds.

Distinguish these identities:

- **Content version**: reader-facing editorial meaning, such as `2.0.0`.
- **Internal revision**: existing positive integer content snapshot counter; preserve historical numbers and allow it to advance independently of the semantic increment.
- **Git commit / deployed commit**: exact source identity and the merged build deployed by the workflow. Neither encodes educational significance.
- **Dates**: retain original `publishedOn`; explain the existing `date` as the content-edition date. Store actual deployment timestamp separately in release evidence. Do not rewrite old dates to match migration day.
- **Shared UI release**: tracked by website commits/releases. A common disclosure or theme update does not increment every lesson. If a lesson gains a substantive teaching diagram, its content edition can change even when the implementation uses shared UI.
- **Language scope**: one edition may identify the bilingual concept package, with explicit `changedLocales` and change notes. It must not imply that both language bodies were rewritten when only Chinese changed.

## Verified M04-01 history and possible retrospective classification

The table records actual legacy revision labels and source commits. The semantic column is **a proposed retrospective interpretation**, not a claim that those labels appeared historically. The proposed major boundary at legacy v3 is grounded in its whole-lesson story-first rewrite. Legacy v4–v5 continue the same enumeration-versus-permission learning model; v5 fulfills/corrects the supplied-text implementation and does not automatically create a second major redesign.

| Actual legacy label/date | Verified change | Source commit | Option A: proposed equivalent |
| --- | --- | --- | --- |
| v1 · 2026-10-23 | Initial five-part enumeration lesson and one check, served through the generic concept catalog. | [dc036a7](https://github.com/JasonLn0711/kairos-learning/commit/dc036a718f2858da5132e6921860829c0f94144e) | 1.0.0 |
| v2 · 2026-10-23 | Expanded seven-part teaching, authorized practice, evidence interpretation, three tests and technical clarifications. | [4f8023e](https://github.com/JasonLn0711/kairos-learning/commit/4f8023ece3c2bb3797b72fdb094b5a303eb826ff) | 1.1.0 |
| v3 · 2026-10-23 | Reorganized both languages around one Public/Finance story; concrete output before terminology, guided operations and parallel permission cards. Candidate single major boundary. | [1d2ea1e](https://github.com/JasonLn0711/kairos-learning/commit/1d2ea1e7261ed5c9c4524822f34cd9e88c4ea7b3) | 2.0.0 |
| v4 · 2026-10-25 | Substantial Chinese section replacement, PowerShell examples and scoped light code styling. Common Q&A disclosure UI was a separate commit. | [f7f88fe](https://github.com/JasonLn0711/kairos-learning/commit/f7f88fe522d0eddb6a4ce645758e8dd22ba77429) | 2.1.0 |
| v5 · 2026-10-25 | Corrected implementation to preserve the entire supplied Chinese text and order; removed unsupplied Chinese tests. English body stayed unchanged. This substantial fidelity/coverage correction is minor, not patch or an automatic second major. | [627f568](https://github.com/JasonLn0711/kairos-learning/commit/627f568d0a11163c481c24a172a95bae1f36a679) | 2.2.0 |
| v6 · 2026-10-25 | Renamed the introduction and added the responsive Public/Finance diagram with 1,855-byte SVG. Both changes preserve existing meaning; this is a patch-level presentation change. | [22f27f0](https://github.com/JasonLn0711/kairos-learning/commit/22f27f0a9063c5d1f812ee15b08057e6de8946fd) | 2.2.1 |
| v7 · 2026-10-25 | Added two genuine supplied SMB/Kafka Q&A, local teaching tests, editorial clarifications and supplemental visualization. | [110e8f8](https://github.com/JasonLn0711/kairos-learning/commit/110e8f81b6c700ddd581b3361e0cc813bd5344ed) | 2.3.0 |
| v8 · 2026-10-25 | Three contextual status/architecture diagrams and separate consumer-group clarification; original answers and tests retained. | [72fb43d](https://github.com/JasonLn0711/kairos-learning/commit/72fb43d3f832225da4d6b261d3450211d15d0c44) | 2.3.1 or 2.4.0 (see below) |

Evidence includes the source snapshots plus the existing private revision-2 through revision-8 deployment receipts. v1 is verified here from its source snapshot; this proposal does not invent a separate v1 deployment receipt. v8's deployed merge is [bf4dce8](https://github.com/JasonLn0711/kairos-learning/commit/bf4dce8839e42040dd1bf00856eb57d2f05e8780), with [successful Pages run](https://github.com/JasonLn0711/kairos-learning/actions/runs/40165598643). Exact private evidence locations are indexed in Planning, not copied to public teaching.

## Two migration choices

**A — reconstruct the sequence from the verified major boundary.** Adopt v3 as the one major transition to 2.0.0, then classify the already published additions in order as above, with the v8 teaching-impact judgment explicit. Under the refined diagram rule, legacy v6 is patch and v7 is minor. Legacy v8 would be **v2.3.1** if its diagrams and consumer-group note only clarify existing meaning, or **v2.4.0** if that note is judged new substantive teaching. The earlier 2.5.0 estimate treated every diagram addition as minor and is superseded; it is not a unique or adopted conclusion. This provides a detailed explanatory mapping, but classification of older editorial changes is retrospective and requires agreement on the v3 boundary. Keep legacy labels and original receipts unchanged; the mapping is a new dated document only.

**B — establish a declared migration baseline now (recommended).** After approval, display current legacy v8 as **v2.0.0**, explicitly saying “semantic content versioning begins at the existing revision 8 snapshot; earlier labels were legacy revision numbers.” Preserve the v1–v8 change history without assigning historical semantic labels. Major 2 honors the one-major-change decision; minor/patch zero mark the new numbering baseline, not a claim that Q&A or diagrams were absent. Subsequent meaningful additions become 2.1.0, and wording-only corrections become 2.0.1.

B avoids false historical precision and accommodates the user-directed v4/v5 implementation correction without claiming another major. A remains appropriate if the user wants and approves the detailed retrospective mapping. **Option B is now confirmed; option A remains an unadopted alternative.**

## Non-destructive implementation

Current code uses `ConceptTeaching.revision: number` in `src/lib/concepts.ts:9`, requires a positive integer at line 29, and prints `v{teaching.revision}` in `Concept.svelte:21`. Simply replacing the integer with `"2.0.0"` would fail validation. Other lesson/question revisions and persisted question attempts also use integer revision matching; leave them unchanged.

1. Add optional `contentVersion?: string` to the concept type only. Validate canonical numeric `a.b.c` with positive major and nonnegative minor/patch, no leading zeros, no `v` inside the data string. A suitable pattern is `^[1-9]\\d*\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)$` (use normal single backslashes in a regex literal). Keep integer `revision` and its existing validation.
2. Scope the first migration to M04-01. Render `v{contentVersion}` when present and use existing `v{revision}` for unmigrated concepts. Do not assign versions to pending lessons or bulk-relabel other lessons. This metadata-only migration retains revision 8; contentVersion identifies the new naming scheme and the migration release commit identifies the metadata change.
3. Add a dated migration/change entry with selected strategy, legacy base revision/commit, semantic version, rationale, changed locales, implementation commit and deployment evidence. Preserve all old files. The approved baseline is 2.0.0.
4. Keep concept ID, URL, Q&A IDs, anchors, registry order, downloads and searchable teaching text stable. Add the display version to exports/search only where they already show edition metadata; do not use it as a route or learner-answer key.
5. Validate valid/invalid semantic versions, legacy fallback, M04-01 display, unchanged other lessons and question-attempt parsing; check bilingual metadata, source-text fidelity, links, search and downloads. Run existing CI/release checks and production readback. Update the private publication evidence only after deployment; never infer understanding from a version change.

This is a targeted schema addition and display change, not a data rewrite. The existing authoring guide remains the canonical workflow and links this approved policy. No standalone concept downloads carry edition labels today; existing SVG downloads remain byte-identical. Search includes v2.0.0 for M04-01, while concept order stays registry-based rather than version-based.
