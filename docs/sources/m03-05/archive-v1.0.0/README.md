# M03-05 source-preserving edition

The complete paired teaching manuscripts and four reference answers are preserved here. Initial content version: **1.0.0**; revision: **1**; content revision date and intended first publication date: **2026-11-03 (Asia/Taipei)**. Production publication is established separately by its deployment receipt, not by these fields alone.

The adopted route assigns **Service Version & Banner Grabbing** to M03-05. The M03 supplement—port state is an observation, not a compromise result—is included in section 6. This is one composite teaching unit, not an extra unit for each subtopic. No learner submissions or private progress appear here.

`M03-05-teaching.zh-TW.md` retains the complete chat teaching text. `M03-05-teaching.en.md` is its full English counterpart. The final paragraph describes the chat's delivery/answer-link convention; the website additionally displays the complete reference answers as four initially closed native disclosures. Body text, tables, code and diagrams are directly readable. Original sentences stay in order; diagrams and answers supplement them.

## Technical sources checked 2026-11-03

- [Nmap service/version detection](https://nmap.org/book/man-version-detection.html): port-name mapping, `-sV`, probe behavior and effects.
- [Nmap technique](https://nmap.org/book/vscan-technique.html): the NULL probe establishes TCP before waiting; some protocols require requests.
- [Nmap probe format](https://nmap.org/book/vscan-fileformat.html#vscan-db-softmatch): softmatch narrows service probes, not numerical confidence.
- [Nmap OS detection](https://nmap.org/book/man-os-detection.html): application service identification differs from stack fingerprinting.
- [RFC 9110 §10.2.4](https://www.rfc-editor.org/rfc/rfc9110.html#section-10.2.4), June 2022: optional Server information and disclosure limits. [§3.7](https://www.rfc-editor.org/rfc/rfc9110.html#section-3.7): intermediary/reverse-proxy roles.
- [Red Hat backport policy](https://access.redhat.com/security/updates/backporting): complete vendor package revisions and patch records matter more than upstream version strings alone.

Nmap/Red Hat pages are continuously maintained documentation, not an assertion of a specific installed tool version. All endpoints and products in the teaching case are synthetic. No scan was executed. The exercise analyzes provided text only; it requires no credentials, network activity or cleanup of system changes.

## Reproduction

```sh
python3 scripts/m0305_diagrams.py
python3 scripts/m0305_content.py
python3 scripts/m0305_diagrams.py --check
python3 scripts/m0305_content.py --check
npm run validate:content
npm test
npm run check
node scripts/check-publication-boundary.mjs
npm run validate:release
```

`diagram-models.json` is the single source for paired semantic HTML flow diagrams and standalone SVGs. The existing fail-closed SVG serializer checks generated downloads. No arbitrary HTML, new framework or new site is introduced. The ZIP is deterministic. Native HTML reflows; the downloaded SVG retains its original coordinate layout. See [acceptance record](../../releases/2026-11-03-m03-05.md).
