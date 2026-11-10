# M05-08 editorial worksheet, source custody and full adoption map

Editorial date 2026-11-10 (Asia/Taipei). CEH26-M05-C08 displays M05-08; initial proposed contentVersion 1.0.0, revision 1, draft. This is one composite route unit: Risk Prioritization, Remediation and Reporting (old M05-12/13/14), not three separate lessons.

## Remote baseline and preservation

Website main read at 0f2b6e4ae36d9793f447923e7f37afdae9c46a3e; CEH main at 47fcb67dcc4f233b450446f006d903c954cfeb59. Current remote AGENTS, article standards, content authoring, writing worksheet, diagram system and publication runbook were read before editing. M05 branches/PRs were searched; the returned older M05 PRs are historical, not C08 work. No existing C08 branch or PR was found.

Main includes published C01–C06 teaching; C07 exists on separate `draft/ceh26-m05-c07`. Its registry identity was read and copied verbatim only as a pending neighbor (`c07-pending-identity.json`), without importing its teaching, changing its branch, resetting its work or claiming its publication. Main's unrendered old M05-08 clashes with the new stable C08 short URL; old M05-11 maps to C07, and old 12/13/14 combine into C08. Those five pending entries are preserved in previous-pending-registry.json. Existing C01–C07 teaching files, sources, generators, assets and publication histories are untouched. Other optional pending entries remain for later route reconciliation; no complete M05→M20 route reset is claimed.

## Completed article worksheet

| Item | Editorial decision |
| --- | --- |
| Reader/prerequisites | Beginner building on finding validation and earlier M05 severity, exposure and scan-coverage concepts. |
| Core question | After a confirmed finding, which action comes first, who owns it, and what evidence supports closure? |
| Main claim | Confirmed findings become reasoned priorities, owned actions and reviewable results; mitigation, installation reports and verified closure stay distinct. |
| Reader takeaway | Explain priority and constraints, select authorized responses, execute controlled changes, verify technical and service outcomes, report scope and track residual risk. |
| Publication/version/dates | Initial draft 1.0.0, editorial date 2026-11-10. No first-publication event is claimed. Schema-required publishedOn is provisional and must become the actual first-publication date only after permitted acceptance. |
| Original/scope | Entire supplied eight-section Chinese text retained byte-for-byte as original.zh.md, hashed by source-sha256.json. Complete paired manuscripts; no shortening or summary translation. |
| Observations/inference/action | All A/B/C and Sapling Order Service facts are synthetic assumptions; no scan, account, patch, network control or incident response was executed. Case recommendations are not completed operational changes. |
| Plain explanation | House repairs distinguish listing from acting/confirming; priority questions cover consequence, applicability, threat and controls/constraints; response options distinguish corrections, mitigation, avoidance, acceptance and sharing. |
| Figures | Workflow: four ordered preparation/deployment/verification/monitoring stages, with three sequence arrows and failure/rollback caveat. Status: three parallel fields for entry restriction, update report and incomplete checks; no cross-field arrows or automatic pass. |
| Reflow/text alternative | Escaped selectable HTML; status cards reflow by container width, workflow remains readable vertical sequence. Same model enters search and four reviewed SVG downloads; vertical SVG cards preserve meaning, not a claim of browser reflow acceptance. |
| Models/constraints | Existing sourceBody/visual/answer kinds; new C08 validator restricts identity, exact bilingual paths, kind, counts (workflow=4/status=3) and string fields. No arbitrary markup, coordinates, calculator or risk formula. |
| Interaction/keyboarding | No input or scoring. One initially closed native reference answer and ordinary SVG download links require later keyboard/no-JS checks. |
| Public scope | Anonymous synthetic teaching only; no private ID, actual learner answer, credentials, private notes or Planning write. qa=[]; no invented Q&A or learning-completion evidence. |
| Bilingual/editorial work | Complete English counterpart preserves every explanation, A/B/C assumption, sample report, numeric counting example, exercise and limit. Drafting, translation and primary-source review are documented here; no fixed AI collaboration line is added to public article. |

## Original-to-adopted mapping

The original is already complete teaching, not an outline. Original bold standalone section labels become semantic h2 headings; emphasis/backtick delimiters normalize to text under the existing HTTPS-link-only InlineText contract. No words or conditions are removed. Two figures and two reference-answer paragraphs are additions. Both manuscripts use identical section anchors and sourceBody block order; automated checks verify every original Chinese passage in order, including all list items and case branches. English is checked for equivalent meaning and depth, not treated as a summary.

| Original location | Adopted location in both languages | Retained substance / justified addition | Result |
| --- | --- | --- | --- |
| Title + opening 2 paragraphs | public title; before section-1 | Prior validation context, three closure questions, reasoned priority/owner/reviewable result claim. | Complete. |
| 一, 3 paragraphs | section-1 | Broken lock/rusty frame/leaking faucet; photos/IDs/severity do not choose owner/order/interim control/verification; three expanded terms; changing conditions require monitoring after closure. | Complete; analogy limit preserved. |
| 二, lead + 4 questions | section-2 | Consequences; local enabled/reachable/identity conditions; dated reliable exploitation evidence vs local compromise; effective controls, maintenance/dependency/testing constraints. | All questions retained. |
| 二, CVSS paragraph | section-2 | Expanded CVSS, Base severity vs organizational risk; FIRST 1.2 source; no recalculation or invented score×value×probability formula. | Complete. |
| 二, difficulty + incident branches | section-2 | Difficult patching does not reduce inherent technical risk; resource escalation/interim controls; active compromise needs incident response, with evidence/containment/fixing distinguished. | Both branches retained. |
| 三, permanent correction | section-3 | Applicable update/permissions/unsupported component; patch definition; configuration/logic may need other action. | Complete. |
| 三, mitigation | section-3 | Disable feature/restrict sources/isolate; verify effect/residual risk; entry restriction is not package correction. | Complete. |
| 三, retire/avoid | section-3 | Authorized retirement with service/dependency/data-retention checks, not arbitrary shutdown. | Complete. |
| 三, acceptance | section-3 | Authorized decision-maker, impact/alternatives/limits, owner/scope/reason/review; scanning operator cannot self-accept because hard to fix. | Complete. |
| 三, sharing + combined responses | section-3 | Insurance/outsourcing does not eliminate weakness or responsibility; combine controls and fixes; NIST accept/mitigate/transfer/avoid, patching within mitigation; temporary/permanent distinction is pedagogical status clarity. | Complete official-classification boundary. |
| 四, before + rollback | section-4 | Assets/components/trusted source/compatibility/dependencies/owner; approved downtime, usable backup/recovery, stop/rollback decision; rollback may restore weakness despite service recovery. | Complete. |
| 四, during + after | section-4 | Authorized staged execution/records/privileges/restarts; no disabling defense for schedule; original problem and normal service verified separately; installation report vs active running version; NIST four phases. | Complete; added four-stage workflow figure. |
| 五, intro + A | section-5 | Fictional service/no real CVE or scan; public important orders, enabled applicable feature, reliable exploitation source; approve interim entry control plus testing/change/revalidation, no untested rush. | Complete. |
| 五, B | section-5 | High-severity isolated test context: no real data, proven reachability controls, no known production dependency; owner/action after A; new production DB path changes priority. | Complete conditional reasoning. |
| 五, C | section-5 | Missing required authenticated checks are a coverage gap, not safety/count; owner/time and importance may make evidence gathering urgent; unknown not automatically last. | Complete. |
| 五, status transitions + deadlines | section-5 | Entry control done/update pending→mitigated, fix open; update done/auth failure→verification incomplete; effective applicable version, checks and service evidence needed for scoped closure; no universal hours/days. | Complete; added parallel status figure. |
| 六, management summary + 5 detail fields | section-6 | Important risks/services/action/decisions; no traffic-light-only summary or untested “all safe”; scope, evidence, priority, plan, result/retest/residual/review data. | All five field groups retained. |
| 六, example + report privacy | section-6 | Exact bounded status logic (specified-source restriction, package update still open); progress not binary; approved readers/access limits, no secrets/personal data, authorized de-identified external version. | Complete. |
| 七, counting + comparisons | section-7 | Ten host-findings vs one weakness on ten hosts; duplicate detections; twenty fewer hosts confound decline; compare scope, successful coverage and exceptions. | All numbers/denominators retained in both languages. |
| 七, tracking + closure reasons | section-7 | High-priority/open/overdue/fixed-and-revalidated/mitigated/accepted/unchecked categories, major risk vs easy-ticket counts; verified fix/retirement/false positive/acceptance remain separate closed reasons. | Complete. |
| 八, environment + 3 steps + expected result | section-8 | Paper/local-only/no target/config change; next action/owner for A/B/C; restriction vs permanent-fix evidence; three-sentence management summary/unknowns; synthetic record not audit, optional draft cleanup/no device restoration. | Complete. |
| Original small check + closing process | section-8 | Entry restriction/update report/auth failure/required checks missing; asks claim/status/evidence; confirmation→rationale→owner→effectiveness→report→tracking; communication completion vs risk improvement. | Original question and conclusion retained. |
| Added answer | answer-m0508 | Cannot claim passed verification; record three states separately; installed-and-effective fix, successful necessary checks and normal service results; approved authentication repair/authorized revalidation; partial scope limits conclusion and unknowns. | Two full bilingual paragraphs, initially closed native details. |

## Source reading and versions

Rechecked 2026-11-10. No vulnerability feed, legal deadline or target was queried.

| Source | Version/date and actual reading | Used support |
| --- | --- | --- |
| [NIST SP 800-40r4 PDF](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-40r4.pdf) | April 2022; title/date/public-domain statement, Section 2.1 risk responses and Sections 2.3.1–2.3.4 preparation/deployment/verification/monitoring read in the PDF text. Printed pages 3–7 (PDF pages 10–14). | Four response approaches, mitigation includes patching; testing/dependencies/trusted source; installation/effectiveness vs monitoring; rollback can reintroduce exposure. Not a statement of a universal organization-specific deadline. |
| [FIRST CVSS v4.0 User Guide](https://www.first.org/cvss/v4.0/user-guide) | Document Version 1.2, read version/nomenclature and Base severity-not-risk sections. No separate revision date invented. | Base score alone is insufficient for local risk; no score, vector or official aggregate formula is generated. |

## Acceptance boundary

[Rule-level per-page receipt](../../releases/2026-11-10-m05-08.md) separates source adoption, static build, tests, manual browser acceptance and actual publication. Prior browser/socket and formal-page 403 restrictions remain in effect; the current task explicitly prohibits PR creation/retry, merging and deployment. No such operation is attempted through another tool or environment. Public draft-branch preservation is independently authorized and does not create a PR or release.
