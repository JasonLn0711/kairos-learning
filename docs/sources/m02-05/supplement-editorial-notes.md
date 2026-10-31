# M02-05 supplement — source and editorial record

Revision 2 / content 1.1.0, prepared 2026-10-31. This expands the existing unit at its stable URL.

## Source preservation

- `original-supplement-2026-10-31.zh-TW.txt` preserves the submitted educational text verbatim, including its original placeholders and citation fragments. SHA-256: `8da66fa58ce7021f7eb7f3269de950d1d9fdf861007844231db05594f082deb9`.
- `archive/v1/` preserves the preceding paired teaching and answer sources.
- The reviewed teaching keeps the original sequence: parcel analogy, two Received reading directions, trust boundary, SPF, DKIM, DMARC alignment, Authentication-Results, six-layer analysis and three scenario questions.
- Publication prose uses positive, direct explanations. Missing three-hop examples and references are completed. The submission's interaction placeholder is replaced by three ordinary questions with separately collapsed reference answers.

## Verified facts and scoped refinements

- [RFC 5321 §4.4](https://www.rfc-editor.org/rfc/rfc5321.html#section-4.4): receiving SMTP systems prepend trace information. Chronology and source verification are presented as distinct reading tasks, with normalized time zones and clock checks.
- [RFC 7208 §8.4](https://www.rfc-editor.org/rfc/rfc7208.html#section-8.4): SPF fail records domain authorization failure; final disposition follows receiver policy. The `-all` example is explicitly separated from the receiver's action.
- [RFC 6376 §3.5](https://www.rfc-editor.org/rfc/rfc6376.html#section-3.5): `d=`, `s=`, `h=`, `bh=`, canonicalization and optional `l=` explain the signed scope; the selector DNS lookup is completed. Private/public keys are described by signing/verification roles.
- [RFC 9989](https://www.rfc-editor.org/rfc/rfc9989.html): the submitted May 2026 publication date is correct. It obsoletes RFCs 7489 and 9091. Section 4.4 supplies strict/relaxed alignment and at-least-one-aligned-pass logic; policy preferences and receiver handling remain distinct.
- [RFC 8601](https://www.rfc-editor.org/rfc/rfc8601.html): trust in Authentication-Results is established through the receiving system and its configured authentication-service identifiers, with logs/metadata corroboration.
- Business verification is connected to M09 through independent established contact channels and account/transaction evidence.

All message records, domains and addresses are synthetic. The two added paired diagrams extend the existing four; the original four remain intact. This change revises teaching rather than adding a curriculum unit. Private learner records and personal identifiers are outside these public source files.

## Validation boundary

Source-order tests, bilingual structural parity, original-source digest, exact SVG/ZIP checks, search coverage and closed-answer rendering are automated. Formal HTTP/browser/mobile checks follow the existing access restrictions and remain a separately recorded acceptance step.
