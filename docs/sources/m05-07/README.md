# M05-07 source archive

Stable ID: CEH26-M05-C07. Display ID: M05-07. Subject: False Positive / False Negative & Validation. Draft content version: 1.0.0; editorial date: 2026-11-10. No first-publication date is asserted.

- `original.zh-TW.md`: exact supplied Chinese teaching, unchanged.
- `teaching.zh-TW.md`: semantic heading normalization only.
- `teaching.en.md`: complete English translation with all examples, conditions and links.
- `reference-answer.zh-TW.md` and `reference-answer.en.md`: separate editorial explanation, rendered in a default-closed native disclosure, not actual Q&A.
- `source-sha256.json`: immutable input-byte checks.
- `source-map.md`: subsection-by-subsection bilingual adoption and limitations.
- `registry-before.json`: previous registry for narrowly scoped migration verification.

Run `python3 scripts/m05_07_content.py` to regenerate the draft JSON, or add `--check` to verify it. The generator deliberately writes `status: draft`, uses the required `publishedOn` field as an eligibility date only and retains `qa: []`. Publication requires a separately authorized and verified change to this generator as well as generated content.

See [acceptance record](../../releases/2026-11-10-m05-07-draft.md). This archive does not contain private message identifiers, learner records or a claim of completed learning.

Rendering normalization: emphasis delimiters (`**`) are removed from generated prose because InlineText does not interpret them; all emphasized words remain. Numbered source lists retain their ordered semantics through a validated optional `ordered` boolean and native `ol`; existing lists default to `ul`. This is a bounded model extension, not arbitrary markup.
