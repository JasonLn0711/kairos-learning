# M04-02 source-preserving DNS edition 1.1.0

The full supplied Chinese lesson is integrated in its original eleven-section order, including four multiple-choice questions and the fifth open response. Four reference diagrams are recreated as responsive text: name-to-connection, recursive resolution, CNAME and ordinary query versus AXFR. Eight SVGs cover Chinese and English. Root/TLD/authoritative exchanges each originate at the recursive resolver; cache hit and miss are separate paths. All existing Chinese teaching, exercises and explanations remain in a distinct expandable supplement; existing English teaching is unchanged, with four matching diagrams added. Empty Q&A remains empty.

Version decision: this concept previously displayed legacy revision 2, not semantic 2.0.0. For this explicitly requested migration, declare that verified snapshot as the 1.0.0 comparison baseline without rewriting historical labels. This release is **1.1.0**, internal revision **3**: substantial source coverage and presentation additions retain the DNS-evidence learning purpose. It is not a copied M04-01 version or a claim of a whole-lesson major redesign. Original publishedOn remains 2026-10-23; edition date is 2026-10-25. Changed locales: zh content and diagrams; en diagram additions only.

The private raw text is retained byte-for-byte (28,023 bytes). [Normalization manifest](2026-10-25-m04-02-normalization.json) records the serialized Mermaid CSS, seven citation badges and two inert UI labels removed/replaced. No teaching sentence, command, question or diagram label is omitted. Whitespace, table cells and list markers become semantic HTML; AXFR's flattened label extraction is regrouped by card. Verified source links replace badges. A separate RFC 9824 / RFC 2308 note explains synthesized NODATA, referrals and CNAME-target NXDOMAIN without silently rewriting the supplied questions. No submission/grading service is claimed.

`python3 scripts/verify-m0402-source.py <private-source> --html build/courses/ceh/v13/m04/concepts/m04-02/index.html` passed complete normalized prose/order and all diagram-label comparisons. The full input stays outside the public repository. Browser checks cover 320/390/1280px, all 11 anchors, real copyable text, native disclosure keyboard behavior, and both language diagram sets. A browser download-event operation timed out; its outcome remains unconfirmed and is not counted as passed. Static asset/path equality is covered by release validation.

Validation uses Node 24.22.0. Content validation, tests, Svelte check (zero errors/warnings), unpublished-content boundary, static release links/anchors/language pairs and original MATLAB checksum checks passed. npm audit has three pre-existing low-severity findings and no high/critical findings. No live DNS/AXFR test was performed.

GX10 Brave is the browser used for local UI validation, not the parent's cloud browser. The parent inspected the original reference PNG pixels and supplied verified design specifications; the PNG files were not transferred to GX10. HTML text reflows at small widths; the standalone SVG is a scalable fixed-layout export, not responsive reflow. Each export contains accessible title/description and real SVG text. All image files are strictly below 100,000 bytes.

Previous production: `3d7993f37b5aa8d40abdaf4f2fa0945d7ab86d77`, successful [Pages run 40166890996](https://github.com/JasonLn0711/kairos-learning/actions/runs/40166890996). Publication must use a draft-first reviewed PR, successful quality checks, merge, successful Pages workflow, and production readback. Final deployment identity is recorded in the completion receipt after it exists.

| SVG | Bytes |
| --- | ---: |
| [m04-02-axfr-en.svg](https://learn.cs-kairos.com/images/ceh/m04-02-axfr-en.svg) | 1592 |
| [m04-02-axfr-zh.svg](https://learn.cs-kairos.com/images/ceh/m04-02-axfr-zh.svg) | 1497 |
| [m04-02-cname-en.svg](https://learn.cs-kairos.com/images/ceh/m04-02-cname-en.svg) | 1532 |
| [m04-02-cname-zh.svg](https://learn.cs-kairos.com/images/ceh/m04-02-cname-zh.svg) | 1447 |
| [m04-02-lookup-en.svg](https://learn.cs-kairos.com/images/ceh/m04-02-lookup-en.svg) | 1662 |
| [m04-02-lookup-zh.svg](https://learn.cs-kairos.com/images/ceh/m04-02-lookup-zh.svg) | 1602 |
| [m04-02-resolution-en.svg](https://learn.cs-kairos.com/images/ceh/m04-02-resolution-en.svg) | 2783 |
| [m04-02-resolution-zh.svg](https://learn.cs-kairos.com/images/ceh/m04-02-resolution-zh.svg) | 2713 |
