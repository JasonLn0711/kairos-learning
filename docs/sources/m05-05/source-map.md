# M05-05 source custody, full bilingual adoption and source review

Editorial date: 2026-11-09 (Asia/Taipei). Stable ID CEH26-M05-C05; display M05-05; proposed v1.0.0 / revision 1. Beginner outcome: explain a vulnerability priority using applicability, three distinct signals and local risk evidence. This is a public anonymous teaching draft, not a learner or deployment record.

## Baseline and preserved scope

Website latest-main baseline db49baece9d649d97be55d36de42c3b7d994acf4; CEH baseline 1258918f5bb1ed58fa7e600c502cc61ceae65c52. Both repositories' M05 branches and C05/M05-05 PRs were searched before creation: no C05 work was found. Latest website main contains the later nine-section C04 replacement, already published in its data; C04 source, generator, data and assets are untouched. Its historical browser-success note does not override this task's explicit no-retry restriction. Only C05's own pending title is updated, with previous-registry.json retained; existing stable slug and adjacency remain.

`original.zh.md` preserves the complete supplied eight-section public manuscript bytes; source-sha256.json checks custody. `teaching.zh-TW.md` is the full adopted Chinese manuscript, with figure/answer placement markers. `teaching.en.md` is a full counterpart. Shared InlineText supports HTTPS links, so Markdown emphasis/backtick delimiters are normalized in generated paragraphs/lists; all wording, numbers and links remain. No text is summarized, no scenario is claimed observed, and no actual learner Q&A is invented (qa=[]).

## Section and branch mapping

Both languages use the same section anchors and block sequence. The generator emits every paragraph, list item, table cell and added answer into sourceBody; static inspection checks visible text order separately from the source hash.

| Original location | Adopted anchor | Preserved teaching and additions |
| --- | --- | --- |
| Opening, both paragraphs | before section-1 | Prior identification lesson, prioritization question, three roles and asset-context requirement. |
| 一 / 1, both paragraphs | section-1 | Basement vs daily-open shop lock analogy; ownership, reachability, consequence, defenses, safe change and probability analogy limit. |
| 二 / 2, all five paragraphs | section-2 | CVSS expansion, 0–10 scale and all five rating bands; four metric groups and Supplemental boundary; vector meaning; version/type/vector/provider/date custody; v3.1/v4.0 difference, severity vs risk/98% misconception; network/privilege/interaction/CIA questions; local exposure distinction; disagreement and no averaging. |
| 三 / 3, opening, two bullets, two following paragraphs | section-3 | CISA/KEV expansion and basic evidence; listing vs local compromise and absence vs no exploitation; separate external/local evidence; dated checks and applicability of deadlines; restricted catalog access and no current counts/deadlines. |
| 四 / 4, all four paragraphs | section-4 | EPSS expansion, daily 0–1/30-day forecast; 0.20=20% synthetic interpretation; asset/company limitation; percentile 95 vs probability and class-rank analogy; low/high/missing values, dates and changing model inputs. |
| 五 / 5, opening, three-row table, policy paragraph | section-5 | All three questions and non-claims; incompatible scales, no invented official sum; policy formula/threshold/exception/owner traceability. Add four-card model: three parallel signals plus shared local context. |
| 六 / 6, all six paragraphs | section-6 | Synthetic A/B, not calculated vectors or real CVEs; A=9.8/0.01/isolated/no production data with isolation evidence; B=8.1/0.60/known exploitation/critical external service/confirmed applicability/unpatched; reason for B first while retaining A; changed isolation/verified mitigation can change order; approved short-term action, test/recovery/window; recommendation vs effective risk removal; full bounded conclusion and no local compromise claim. |
| 七 / 7, five numbered items and final paragraph | section-7 | Applicability before scores; dated CVSS/KEV/EPSS evidence; entry/privilege/features/data/business/defenses; owner/time/policy/mitigation/recovery; installed/running/function/condition checks after patching; authorized validation and later management scope. |
| 八 / 8, environment + three-step exercise + original small check + conclusion | section-8 | Paper/local-only environment; separate advisory/confirmed/unknown rows; two evidence items plus one decision-changing fact; approved mitigation/post-patch verification; expected rationale and local-draft cleanup; original colleague quote and two-evidence-category question retained. |
| Added answer after original check | answer-m0505 | Two full bilingual paragraphs, native initially closed details: applicability (complete version/configuration/patch) and local risk context (exposure/importance/consequence/defenses); low EPSS and absence from KEV do not justify ignoring. Explanation separates forecast from local compromise, lists branch/running/backport and authorized validation. No answer submission or learning-state claim. |

## Necessary primary-source reading

Checked 2026-11-09, no CISA KEV catalog request made. These are conceptual checks, not current vulnerability assessments or legal advice.

| Source | Version/date and reading scope | Support |
| --- | --- | --- |
| [FIRST CVSS specification](https://www.first.org/cvss/v4.0/specification-document) | CVSS v4.0, document version 1.2; introduction, four metric groups, Supplemental, qualitative ratings and vector section read. | Four groups, 0–10 scale and five bands; Supplemental does not alter final CVSS score; vector accompanies assessment. |
| [FIRST CVSS user guide](https://www.first.org/cvss/v4.0/user-guide) | v4.0 online guide; nomenclature and Base severity vs risk sections read; no separate document date invented. | Score type and Base/Threat/Environmental distinction; Base alone is not risk. |
| [FIRST EPSS](https://www.first.org/epss/) | Current online introduction, checked on stated date; no numeric data feed downloaded. | Published-CVE next-30-day exploitation forecast, daily 0–1 values and rank. |
| [Using EPSS](https://www.first.org/epss/using-epss) | Online guidance, interpretation and common mistakes read. | Population-level forecast lacks local inventory/controls; low probability is not safe-to-ignore; preserve context. |
| [EPSS FAQ](https://www.first.org/epss/faq) | Probability and percentile sections read; no latest empirical base-rate claim used. | Probability estimates observed exploitation activity; percentile is relative rank, not that probability. |
| [Official CISA notification](https://content.govdelivery.com/accounts/USDHSCISA/bulletins/4198f58) | Notification dated 2026-05-29, full bulletin read. | Basic KEV/active-exploitation evidence and FCEB-specific BOD scope. No claim about today's catalog, current individual entries or universal deadlines. |

The prior KEV main-page 403 is user-supplied access evidence. It was not retried, and the provided notification was used only for its authorized basic-concept scope; no links back to the blocked catalog were followed.

## Diagram contract

`diagrams.json` supplies the same four cards to HTML, search and SVG export. CVSS/KEV/EPSS are parallel, and the fourth card carries shared local context; no arrows, numerical sum, rank formula or attack measurements are invented. PrioritySignalsDiagram renders escaped HTML text with container reflow, three wide cards plus a full-width context card; narrow cards stack in the same reading order. The matching standalone SVG presents the same labeled cards vertically for readable full text. This is a layout difference, not a new sequence. Existing reviewed sanitizer and byte limit are reused; concepts.ts restricts C05 identity, exact paired paths, cards kind and four nodes. Geometry, contrast and visual interpretation remain unverified until the permitted manual gate.

[Rule-level release receipt](../../releases/2026-11-09-m05-05.md) separates source completeness, static output, engineering tests, browser gaps and production state.
