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
