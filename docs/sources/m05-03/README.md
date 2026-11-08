# M05-03 authoring worksheet and source custody

Reader: beginner. Primary question: how should the kind of weakness determine the assessment viewpoint and evidence needed? Claim: cause, assessment dimension and proof strength are different questions.

The original public-safe Chinese teaching is retained completely in `teaching.zh-TW.md`. `teaching.en.md` is a full paired translation, not a summary. The generated sourceBody normalizes Markdown emphasis into semantic headings, paragraphs and lists. No technical teaching is omitted. Reference answers, exercise outcome/cleanup guidance and source-date notes are clearly supplementary editorial material, not learner responses. No private message IDs, answers or personal data are included.

Version 1.0.0; initial teaching and revision date 2026-11-08 Taiwan. The staged `publishedOn` is intended for first publication on that date, NOT evidence of deployment. If first production availability is later, set it to the actual initial publication date before release. Keep this PR draft pending acceptance.

## Section coverage (both languages)
| Original section | Canonical position | Preserved teaching | Review |
|---|---|---|---|
| Opening | opening paragraph | Cause determines examination/remediation | Full source retained |
| Restaurant | section-1 | Faulty refrigerator/settings/process require different fixes | Full source retained |
| Weakness causes | section-2 | Five overlapping categories; example and correction for each; OWASP | Full source retained |
| Assessment objects | section-3 | Host/network/application/database; wireless/cloud limits | Full source retained |
| Internal/external | section-4 | Observation position, port visibility, permissions, employer distinction | Full source retained |
| Active/passive | section-5 | Requests versus observation, load/visibility/privacy, authentication and automation axes | Full source retained |
| Synthetic case | section-6 | A: version inference; B: policy/setting; C: bounded authorization evidence | Full source retained |
| Prioritization | section-7 | Severity versus priority; matched remediation evidence; no intrusion claim | Full source retained |
| Paper exercise | section-8 | A/B/C evidence matrix and method choice; no live actions | Full source retained |
| Check and conclusion | section-9 | Cross-account order despite clean version scan; cause/viewpoint/evidence | Full source retained |

## Sources and route
Checked 2026-11-08: [OWASP vulnerability definition](https://community.owasp.org/vulnerabilities/), [NIST SP 800-115, September 2008, sections 2.4.1 and 4.1](https://csrc.nist.gov/pubs/sp/800/115/final). These support application weakness definitions and assessment viewpoints, not a universal mutually exclusive taxonomy or current tool commands. Examples are original and synthetic.

Current route CEH26-M05-C03, human label M05-03, combines subjects formerly labelled M05-02 and M05-04. Dependency PR #95 registers the eight current units; do not overwrite that registry or interpret the old mapping as stable-ID equivalence.

## Acceptance record
URL pair: https://learn.cs-kairos.com/courses/ceh/v13/m05/concepts/m05-03/ and https://learn.cs-kairos.com/en/courses/ceh/v13/m05/concepts/m05-03/ (intended routes, not verified live).

| Rule | Language / size | Method | Result / evidence |
|---|---|---|---|
| WRITE-01–05, WRITE-08–11 | zh/en, source | Read original and full translation; section map above | Source review passed; classifications and examples explicitly bounded |
| WRITE-06 | zh/en, source | Version/date review | Prepared; actual publication date pending |
| Privacy | zh/en, source | Public-safe teaching only | No personal facts or private identifiers; all operational examples synthetic |
| HTML-01 and A11Y-03 | zh/en, source | Approved sourceBody model; answer-only disclosure | Source structure and ordered built HTML text passed; interaction pending |
| HTML/A11Y dimensions, keyboard/focus, no-JS, 200% | zh/en, 320/390/768/1280 CSS px | Prepared `tests/browser/m05-02-03.spec.ts` | NOT RUN. Prior dependency browser attempt failed before page inspection: socket() failed: Operation not permitted. Do not retry blocked capability. Manual review remains pending |
| FIG-01–06 | zh/en, all sizes | No custom graphic included | No image/SVG introduced; relationship graphic remains a possible authoring enhancement, not a passed graphical review |
| Code local scroll / light background | zh/en, all sizes | No executable code/output block | Not applicable |
| Build/content/release boundary | zh/en, build | See release receipt | Passed: 264 tests, content/check/build/release/boundary; [receipt](../../releases/2026-11-08-m05-02-03.md) |
| Production identity/content/version | zh/en, live | Exact deployed commit plus page readback required | Pending; commit/PR is not deployment |
