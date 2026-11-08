# M05-01 source custody and authoring worksheet

## Scope and source map

Audience: beginner. One question: what distinguishes vulnerability assessment from penetration testing after a potential weakness is found?

The paired `teaching.zh-TW.md` and `teaching.en.md` retain the complete eight-section teaching, including the opening, home analogy, six linked definitions, VA/scanning distinction, PT and ROE, selection criteria, five-step synthetic case, defender evidence/limitations and all four check options. Website packaging uses semantic headings and lists in place of chat emphasis. The chat-only pending-publication status is not article content. A separate reference-answer disclosure is added; it is not a learner answer or proof of mastery. No private conversation IDs or learner records are included.

Each source heading maps in order to `sourceBody` section-1 through section-8. Every non-heading chunk maps to one paragraph or list, without shortening. `scripts/m05_01_content.py --check` enforces the generated-body match. English is a full translation, not a summary. Numbers, conditions, case and conclusions match. `qa` remains empty.

Version: 1.0.0. Initial teaching date and intended initial publication date: 2026-11-08 Taiwan. Actual production availability remains unverified until deployment; this is not a claim that a local published flag is live. If first production publication occurs later, update publishedOn to the actual date before release.

## Technical sources

Read on 2026-11-08:
- https://csrc.nist.gov/glossary/term/vulnerability_assessment
- https://csrc.nist.gov/glossary/term/penetration_testing
- https://csrc.nist.gov/pubs/sp/800/115/final (September 2008; planning, evidence and limitations, not current-tool instructions).

Original explanations and anonymized synthetic examples; no real system exploitation. Distinguish observed version string from possible applicability, successful bounded test from historical compromise, and an untested condition from a passed test.

## Route migration

Exact eight-unit order checked against source repository `study-plan/core-route-2026-10-27.md` blob f6dc1a7a733cb192a4286dbb27475817cd34f525 and JSON blob 654ed0ce5dcf5afe0cddff333e25f2d2f61ae8bc. `legacy-pending-registry.json` archives the former 14 pending entries. No old M05 concept teaching JSON existed on the inspected main. The existing published `ceh-m05-priority` lesson is untouched.

New internal IDs CEH26-M05-C01..C08 use sequential current-route public labels and URLs M05-01..08. Old source display mappings express topic scope, not identity or equivalence; do not treat old M05-02 and new M05-02 as the same lesson. No published URL was displaced. Registry currently lacks M20; future M05→M20 transition must be reconciled before C08 teaching reaches that transition, outside this limited migration.

## Review record

URLs: `/courses/ceh/v13/m05/concepts/m05-01/` and `/en/courses/ceh/v13/m05/concepts/m05-01/` on learn.cs-kairos.com.

| Rule/scope | Languages / sizes | Result | Evidence / remaining work |
|---|---|---|---|
| WRITE-01, WRITE-05, WRITE-09–11: plain language, full source, scope | zh/en, source | Pass, source review | Eight-section correspondence above; paired source-body tests |
| WRITE-06: version/date | zh/en, source | Prepared; production pending | 1.0.0; 2026-11-08 intended publication, verify actual deployment |
| Privacy, synthetic case, observation/inference | zh/en, source | Pass, source review | No personal data; version 2.4 explicitly synthetic; no exploitation commands |
| Model/contract and route preservation | zh/en, source | Pass, automated | Content validation and route tests; legacy pending snapshot |
| FIG-01–06: downloadable custom diagrams | zh/en, all sizes | Not applicable | No custom image added. Text flow directly readable in semantic body |
| A11Y-01, A11Y-03/body disclosure | zh/en, source | Source structure pass; browser pending | Only reference answer uses answer kind; no fabricated Q&A |
| HTML-01–04, A11Y-02: layout, focus, keyboard, 200% text, no-JS | zh/en, 320/390/768/1280 CSS px | Pending | Browser attempted with Chromium; startup failed before any page inspection: `socket() failed: Operation not permitted` plus crashpad database error. No screenshots or browser acceptance achieved; no retry of restricted capability |
| Build/release gates | zh/en, build | Pass, automated | 261 Node tests, content validation, Svelte check (0 errors/warnings), build, validate:release, publication-boundary checks passed |
| Deployment and production identity | zh/en, production | Pending | Browser review blocked; do not merge or report live before required gates and exact deployment verification |

No automatic test is represented as a manual browser inspection.
