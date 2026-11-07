# M03-06 source-preserving edition

The complete paired teaching manuscripts and four reference answers are preserved here. Initial version **1.0.0**, revision **1**, revision date and first-publication field **2026-11-03 (Asia/Taipei)**. These fields alone do not establish live deployment.

The adopted route assigns **OS Fingerprinting** to M03-06. One composite unit explains active/passive collection, packet features, match limitations, network position and administrator verification. The M03 supplement that port states are observations rather than compromise results remains explicit.

The paired original manuscripts remain complete and in order. Two diagrams supplement the source before sections 4 and 7; four native initially closed reference answers follow the manuscript. No actual learner answers or private progress appear here. Body and figures remain directly readable and searchable.

## Sources reviewed 2026-11-03

- https://nmap.org/book/osdetect.html — OS-fingerprint purpose and evidence.
- https://nmap.org/book/osdetect-other-methods.html — passive collection and alternatives.
- https://nmap.org/book/osdetect-methods.html — combined probe features.
- https://nmap.org/book/man-os-detection.html — -O, open/closed port conditions and limits.
- https://nmap.org/book/osdetect-guess.html — IPv4 weighted feature matching, not calibrated real-world probability.
- https://nmap.org/book/osdetect-unidentified.html — unreliable results and network conditions.
- https://nmap.org/book/osdetect-usage.html — stack versus service-derived information and intermediaries.
- https://www.rfc-editor.org/rfc/rfc791.html#section-3.1 — IPv4 TTL (1981).
- https://www.rfc-editor.org/rfc/rfc9293.html#section-3.1 — TCP window and options (2022).

Nmap documentation is continuously maintained; no specific installed version or executed scan is claimed. The exercise is an offline synthetic case with no third-party target, credentials or system changes.

## Reproduction

Run scripts/m0306_diagrams.py and scripts/m0306_content.py; their --check modes verify deterministic regeneration. Run npm run validate:content, npm test, npm run check, node scripts/check-publication-boundary.mjs and npm run validate:release in sequence.

The existing sourceBody.visual model supplies both native HTML flows and sanitized SVG downloads. No arbitrary HTML, new framework or separate site is introduced. Native HTML reflows; downloadable SVGs preserve fixed original geometry. Full acceptance is recorded in ../../releases/2026-11-03-m03-06.md.


## 2026-11-03 full supplied replacement — v1.1.0

The [supplied manuscript](supplied-2026-11-03/teaching-original.txt) is preserved byte for byte with its [SHA-256](supplied-2026-11-03/source.sha256.json). The complete previous bilingual edition, answers, models and concept JSON remain in [archive-v1.0.0](archive-v1.0.0/README.md).

The current edition replaces the body with all supplied chapters and subsections, including the overview, nine main sections, sources, extended teaching Q&A and review. The [69-entry bilingual map](detailed-section-map.json) connects each heading to a stable rendered anchor; the article title remains introductory text beneath the existing page title. The [editorial changes](detailed-editorial-changes.json) reconstruct the Chinese manuscript from the supplied original, retaining explanations, examples, tables and ASCII diagrams. The English edition follows every subsection with the same mechanisms, scenarios, values and limits; paragraph wrapping and explanatory phrasing differ.

Corrections distinguish three feature groups, SACK Permitted, unscaled SYN/SYN-ACK windows, and TCP-based HTTPS from HTTP/3. LaTeX is rendered as equivalent searchable plain-text formulas. Extended teaching Q&A stays in the body; actual learner qa remains empty. No network scan or learner completion is claimed.

The two existing native HTML diagrams, four downloadable SVGs, ZIP and four reference answers remain unchanged in content. The proxy figure now follows section 6 and the evidence figure follows section 7, adjacent to their explanations. [Preservation hashes](supplied-2026-11-03/preserved-assets.sha256.json) cover the diagram model and downloads. Existing section-1 through section-9 and sources anchors remain valid. New subheadings use the existing sourceBody paragraph-with-id contract; no new markup injection path is introduced.

Source review on 2026-11-03 checked the Nmap and RFC references listed above, plus [RFC 7323 section 2.2](https://www.rfc-editor.org/rfc/rfc7323.html#section-2.2) for SYN window scaling and [RFC 9114](https://www.rfc-editor.org/rfc/rfc9114.html) for HTTP/3. These are documentation checks, not a live network experiment.

Run the existing content generator and checks, then `npx playwright test --config playwright.m0306.config.ts`. Set `CEH_BASE_URL=https://learn.cs-kairos.com` for the same browser checks against production. [Replacement receipt](../../releases/2026-11-03-m03-06-replacement.md) records this version's validation and publication separately from historical v1.0.0 evidence.
