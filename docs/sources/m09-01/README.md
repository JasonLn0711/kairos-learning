# M09-01 primary manuscript and original artwork

The complete supplied 2026-10-29 manuscript is preserved byte-for-byte in `user-primary-2026-10-29.md`. It is the source of this edition, not a replacement by an earlier unpublished draft. Original artwork is kept byte-for-byte in `site/images/ceh/m09-01-original-{1..4}.svg`; the downloadable ZIP contains these same four files with their original filenames.

## Editorial mapping

- Manuscript title → stable M09-01 registry title and page title.
- Body paragraphs, lists and all three tables → ordered bilingual `sourceBody` blocks. Formatting markers are rendered semantically; no body paragraph is shortened.
- Original SVG 1 → section 2 (trust, authentication, authorization, least privilege).
- Original SVG 2 → section 4 (CEH knowledge map).
- Original SVG 3 → section 5 (independent verification).
- Original SVG 4 → section 7 (defense in depth).
- Conversation-only content-reference markers and sandbox image links → actual visible original SVG images and download links.
- Sandbox ZIP reference → locally packaged four-original-SVG download.
- Tracking query parameters are omitted in displayed source URLs; the archived manuscript remains untouched.
- A labeled curriculum clarification separates conceptual cross-links from evidence that a reader has already studied a chapter. The adopted route reaches M09 before M02/M03/M04.
- Five plain-language reference answers are supplied as a labeled addition, closed by default. They do not constitute a learner answer or evidence of understanding. Original questions remain.
- English is a faithful full translation, not a summary. Both languages use the same Chinese original SVG artwork with localized captions and alternative descriptions. The image text is not edited or redrawn.

## Primary-source checks, 2026-10-29

- [NIST social engineering](https://csrc.nist.gov/glossary/term/social_engineering): sensitive information, unauthorized access and fraud through deception and trust.
- [NIST authentication](https://csrc.nist.gov/glossary/term/authentication): identity verification; not a blanket authorization decision.
- [MITRE ATT&CK T1566](https://attack.mitre.org/techniques/T1566/): Initial Access and four sub-techniques .001–.004 confirmed (page version 2.8, modified 2026-09-18).
- [FBI I-121925-PSA](https://www.fbi.gov/investigate/cyber/alerts/2025/senior-us-officials-continue-to-be-impersonated-in-malicious-messaging-campaign): independently identify contact information before verification.

These checks support the specific claims; neither the instructional sequence nor the diagrams are official certification diagrams. No third-party target is tested.

## Presentation and limits

Original SVGs were parsed for scripts, event handlers, foreign objects and external references and rendered locally for inspection. They are static original vector images, not screenshot substitutes. Browser/mobile/keyboard verification remains unperformed because of the known environment restriction; image text scales but does not reflow. Open-original/download links permit zoom. Rendering with Inkscape does not validate browser filter appearance (its renderer reports unsupported `feDropShadow`). This document does not claim publication, merge or deployment.
