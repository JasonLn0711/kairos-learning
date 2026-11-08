# M05-04 source custody and subsection adoption

Editorial check: 2026-11-08 (Asia/Taipei). Intended reader: a beginner deciding whether a public advisory applies to a system. Stable ID CEH26-M05-C04; display M05-04; proposed v1.0.0 / revision 1. This is a public draft, not a publication or learner-completion record.

## Source and changes

`original.zh.md` retains the supplied anonymous synthetic teaching bytes, checked by source-sha256.json. `teaching.zh-TW.md` and `teaching.en.md` are complete paired editorial manuscripts. Public source archives contain no private conversation, delivery identifiers or learner answers. The source's time-of-day delivery lead-in is replaced by a general transition from inventory and classification; only that conversational framing is excluded. No original technical paragraph is abridged. The added answer is an editorial reference answer, not a learner response; qa remains empty.

| Original location | Adopted anchor in both languages | Preserved content / change |
| --- | --- | --- |
| Opening | before section-1 | Advisory applicability question, three roles and compromise boundary; contextual delivery wording removed. |
| 一 / 1 | section-1 | Recall event, defect type, model/year/component; common language, duplicate counting and analogy limits. |
| 二 / 2 | section-2 | CVE expansion, ID syntax, year limits, CNA scope, descriptions/references; Reserved/Published/Rejected; absence/presence limits. |
| 三 / 3 | section-3 | CWE expansion, software/hardware types, CWE-79 mechanism and Web-course boundary; many-to-many mapping, report identity and preventive design. |
| 四 / 4 | section-4 | CPE attributes, naming analogy, asset/IP/MAC distinction; branch, version range, feature/platform/patch and combined conditions. Added parallel role figure. |
| 五 / 5, items 1–4 | section-5 | CVE, NVD, vendor/distributor and local records as four distinct sources; April 2026 enrichment/scoring change; disagreements, dates and C05 handoff. |
| 六 / 6, scenario + steps 1–5 | section-6 | Synthetic Orange 2.4; 2.4–2.6/preview/2.7 conditions; banner vs full version; product branch and record updates; feature/access conditions; backport definition and installation/running evidence; bounded finding wording and authorized validation. |
| 七 / 7 | section-7 | All record fields, post-patch evidence; product/vulnerability/type multiplicities and counts. |
| 八 / 8 | section-8 | Known/unconfirmed/next-action exercise, observable result and no cleanup; original small check and closing principle. Added paired closed reference answer naming branch/features/patch/backport/running/exposure and authorized validation. |

## Primary-source reading

All checked 2026-11-08. Record source versions and dates separately from the draft's prospective publication date.

| Source | Version/date and observed reading | Claims used |
| --- | --- | --- |
| [CVE glossary](https://www.cve.org/ResourcesSupport/Glossary?activeTerm=glossaryRBP) | Unversioned online glossary. Direct extraction returns a JavaScript notice; official search-index extraction exposed the complete glossary, read in this review. No browser access attempted. | CVE ID, CNA, Record and Reserved/Published/Rejected definitions. |
| [CVE identifier archive](https://www.cve.org/Resources/Media/Archives/OldWebsite/cve/identifiers/index.html), [archived FAQ](https://www.cve.org/Resources/Media/Archives/OldWebsite/about/faqs.html) | Historical official pages, not a current NVD operations authority; identifier page and relevant FAQ text read. | Four-or-more sequence digits and year not discovery/introduction date. |
| [MITRE About CWE](https://cwe.mitre.org/about/index.html) | Page updated 2026-09-30. | Software/hardware weakness taxonomy, prevention. |
| [CWE-79](https://cwe.mitre.org/data/definitions/79.html) | Page title indicates CWE 5.0; description and XSS nuance read. | Improper neutralization of user-controllable input in generated web output. |
| [NIST CPE glossary](https://csrc.nist.gov/glossary/term/common_platform_enumeration) | Unversioned online definition. | Standardized platform naming. |
| [NIST IR 7695](https://csrc.nist.gov/pubs/ir/7695/final) | CPE Naming 2.3, final 2011-08-19; publication abstract/history read, not a claim of full PDF reading. | Product-class names and machine-readable encodings. |
| [NIST NVD operations](https://www.nist.gov/news-events/news/2026/04/nist-updates-nvd-operations-address-record-cve-growth) | Published 2026-04-15; prioritization, separate scoring and backlog sections read. | Selective enrichment, no routine duplicate CNA scoring; missing enrichment is not absence of local risk. |

## Identity and route handling

Latest website main baseline: 6441d19cbcc2ecf1e980298961b0725d09d5fcaa. M05-02/03 reflect PR 99/98; no use of old PR 95/97 drafts. Existing branches and PRs were searched before creation; no M05-04 work found. `previous-pending-registry.json` preserves only the displaced unrendered M05-04–07 entries. Old 04 assessment types are already included in published 03; old 05/06 combine into C04; old 07 maps to pending C05. All published M05-01/02/03 JSON files remain unchanged. Other pending units remain for later route migration; this change does not claim a complete M05/M20 route reset.

## Diagram contract

`diagrams.json` is the bilingual three-card model for CVE/CWE/CPE, inserted after the CPE explanation. These are parallel roles with explicit many-to-many caveats, no sequence or causal arrows. IdentificationDiagram uses escaped HTML text and container reflow; the existing reviewed SVG sanitizer serializes two matching assets from the same model. No arbitrary HTML, path or event data is accepted. concepts.ts restricts the lesson identity, exact paths, cards kind and three nodes. Automated shape/byte checks cannot establish visual acceptance.

See [release receipt](../../releases/2026-11-08-m05-04.md) for exact validation scope and pending gates.

Formatting normalization: the shared InlineText component parses HTTPS links only. The generator removes Markdown emphasis/backtick delimiters from paragraph text instead of displaying those delimiters literally. Technical strings, all words and source links are preserved; the archived manuscripts retain the original Markdown. This is formatting, not a content abridgment.
