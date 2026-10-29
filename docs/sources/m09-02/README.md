# M09-02 v1.1.0 — complete supplied manuscript and original SVGs

The complete supplied teaching is retained in `user-primary-2026-10-29.md` after removing transport-only metadata (public-source SHA-256 `d3125240593f7d15483a5049b47099f40109c855e1c98c469cfaf1449099d2aa`). The original supplied bytes remain in the private local input archive, not in this public repository. No teaching paragraph, table cell or question was removed: only conversation reference tokens, internal transport links and tracking parameters were removed or replaced by the actual public SVG/ZIP URLs. This replaces the shorter M09-02 v1.0.0 presentation, retained in `docs/archive/m09-02-1.0.0/teaching.json` and Git history. The concept identity, URL, publication date, learner Q&A and all other lessons are unchanged. This is a minor content edition, not a new teaching-delivery or learner-completion claim.

## Source and presentation mapping

- All nine numbered sections, paragraphs, lists and four tables remain in order. The initial manuscript title maps to the existing page title. Markdown emphasis is normalized to readable text; source headings preserve semantic hierarchy.
- `translated-source.en.json` is the complete aligned English translation of the 266 source blocks, not a summary. Five image placeholders identify the original files before website metadata is attached.
- Conversation-only content-reference tokens and sandbox image links become directly visible original SVG images, with open/zoom and download links. Tracking URL parameters are removed from public citations, the private original remains unchanged; the public source uses cleaned links.
- Diagram 1 → section 2 (classification); diagram 3 → section 3 (CEH map); diagram 2 → section 4 (trust boundary); diagram 4 → section 5 (defense in depth); diagram 5 → section 6 (evidence and response).
- All five original SVG files remain byte-identical to their ZIP entries. The supplied ZIP is served byte-for-byte at `/downloads/ceh-m09-02-original-svg.zip`; the image manifest records hashes, dimensions and bilingual alternative descriptions. Both locales show the unchanged Chinese artwork, not redrawn replacements.
- Six clearly labeled website notes distinguish curriculum cross-links from reader completion, clarify the scope of the taxonomy, SPF/DMARC alignment and receiver discretion, passkey phishing-resistance versus MFA, evidence checkpoints versus a mandatory event sequence, and optional reference answers versus learner submissions.
- Four A–D reference answers are editorial additions, initially closed. Original questions and the instruction to think first remain. No body, table, diagram or procedural explanation is collapsed.
- Existing `section-1` through `section-19`, `answer-reference` and `connections` anchors remain at corresponding revised topics. New subsection anchors use an M09-02-specific prefix. All eight related concept links lead to published lessons.

## Technical checks

See `source-review.json` for the checked primary sources and exact scope. Important distinctions include: phishing is not necessarily bulk mail; the impersonated identity is not the targeted person; credential exposure is not proof of successful login; mail authentication is not business authorization; and phishing resistance does not by itself establish multiple authentication factors.

Current references include NIST SP 800-63B-4, MITRE ATT&CK T1566 version 2.8 with all four sub-techniques, DET0070 version 1.0, and RFC 9989 (May 2026), which supersedes RFC 7489 and 9091. Technical clarifications are labeled, not silently substituted for source paragraphs. No real target is tested and no real credentials, private progress or private attachment identifiers are published.

## Verification limits

All SVGs were parsed for executable/external content and rendered individually with Inkscape for actual image inspection. No clipping or overlap was observed at the native 1600 × 940 canvas. This does not establish browser, phone or keyboard behavior. Original image text scales with the container but does not reflow; open-original links allow zoom. Known browser socket and live-page access restrictions were respected, not retried or bypassed.

Run `python3 scripts/verify-m0902.py` after a clean build for ordered bilingual static-text readback, diagram placement/visibility, closed reference answers, anchor continuity, and original ZIP/SVG/build byte equality. The release receipt separates local checks, remote CI and production deployment; creating a draft PR is not publication.
