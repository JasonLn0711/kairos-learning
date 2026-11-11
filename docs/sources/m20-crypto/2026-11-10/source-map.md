# M20 AES distinction · source and adoption map

Scope: source-reviewed teaching integration from Kairos Hub. No private question text, answer, learner record or research workspace is copied. This is an original public example, not an official exam item. No owner misunderstanding or learning result is claimed.

The previous public lesson is preserved in [before.json](before.json) and Git. Original publication date 2026-10-23, stable ID and slug, existing sections, two questions and exercise remain. Version 1.0.1 → 1.1.0 adds teaching scope; revision 2 → 3. Both languages adopt the same four-paragraph section and original third question. Titles receive the required M20 prefix.

| Source / location | Adopted content | Target |
| --- | --- | --- |
| NIST AES Development, AES Overview | Five finalists, Rijndael selection, 2001 FIPS 197, required sizes | aes-finalists paragraphs 2–3 |
| Twofish designers, Twofish introduction | Finalist not selected; 128-bit block and 128–256-bit keys | aes-finalists paragraphs 2–3 |
| Original editorial explanation | Block/key distinction and tray analogy, limited to sizes | aes-finalists paragraph 1 |
| Original editorial worked example | Shared properties do not uniquely identify a candidate | aes-finalists paragraph 4 and q3 |

Primary sources were opened on 2026-11-10. Historical algorithm identity is the scope; no present deployment recommendation or security-strength comparison is made. The finalist comparison explicitly limits candidates before using nonselection as the distinguishing condition.

Applicable rules: WRITE-01–11, HTML-01–04, A11Y-01–03. No new illustration or interaction model is introduced; FIG and INT changes are not applicable. Existing rendering and question controls must pass the normal release and targeted bilingual browser checks. Publication/readback remains unproven until recorded in the release receipt.

NIST FIPS 197 (2023 editorial update), abstract, independently verifies 128-bit blocks and AES-128/192/256 key lengths; cited as aes-standard. Its update makes no technical algorithm change.
