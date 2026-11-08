# M05-02 authoring worksheet and source custody

Reader: beginner. Primary question: how can an assessor distinguish the inventory of assets from the authorized scope of one engagement? Claim: inventory, permission and evidence coverage are separate facts.

The original public-safe Chinese teaching is retained completely in `teaching.zh-TW.md`. `teaching.en.md` is a full paired translation, not a summary. The generated sourceBody normalizes Markdown emphasis into semantic headings, paragraphs and lists. The final conversation bridge announcing the next lesson is omitted from canonical teaching; no technical content is omitted. Reference answers, exercise outcome/cleanup guidance and source-date notes are clearly supplementary editorial material, not learner responses. No private message IDs, answers or personal data are included.

Version 1.0.0; initial teaching and revision date 2026-11-08 Taiwan. The staged `publishedOn` is intended for first publication on that date, NOT evidence of deployment. If first production availability is later, set it to the actual initial publication date before release. Keep this PR draft pending acceptance.

## Section coverage (both languages)
| Original section | Canonical position | Preserved teaching | Review |
|---|---|---|---|
| Opening | opening paragraphs | Inventory and authorization before tools | Full source retained |
| Home inspection | section-1 | Rooms/pipes versus allowed scope; no-neighbor rule | Full source retained |
| Assets | section-2 | Devices, services, data, identities and dependencies; CIS limitation | Full source retained |
| Useful inventory | section-3 | Seven fields; WEB-TEST-01; IP identity/time limitations | Full source retained |
| Scope | section-4 | Targets, identity/actions, location/time, stopping, evidence; ROE and third parties | Full source retained |
| Synthetic case | section-5 | A/B/C, dependency versus authorization, bounded reporting, observation/inference | Full source retained |
| Visibility limits | section-6 | Offline/temporary/segmented resources, cross-checks, unknowns, coverage evidence | Full source retained |
| Paper exercise | section-7 | Three synthetic assets, responsibility/data/source, exclusions/stops; no live actions | Full source retained |
| Check and conclusion | section-8 | Unscoped database question; target/authority/coverage | Full source retained except chat transition |

## Sources and route
Checked 2026-11-08: [CIS Control 1, v8.1 context](https://www.cisecurity.org/controls/inventory-and-control-of-enterprise-assets), [NIST SP 800-115, September 2008, section 6.5](https://csrc.nist.gov/pubs/sp/800/115/final). These support inventory coverage and assessment planning, not new tool instructions or a fixed universal inventory schema. Examples are original and synthetic.

Current route CEH26-M05-C02, human label M05-02, maps to the asset/scope subject formerly labelled M05-03. Dependency PR #95 registers the eight current units; do not overwrite that registry or interpret the old mapping as stable-ID equivalence.

## Acceptance record
URL pair: https://learn.cs-kairos.com/courses/ceh/v13/m05/concepts/m05-02/ and https://learn.cs-kairos.com/en/courses/ceh/v13/m05/concepts/m05-02/ (intended routes, not verified live).

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
