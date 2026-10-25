# M04-01 relationship diagrams 2.0.2

Redesign the eight existing bilingual visual aids from v2.0.1 (sixteen SVG files), preserving all original titles, captions, item text, teaching, code, questions and Q&A. The original Public/Finance access card and earlier Q&A illustrations remain unchanged. Categories and protocols use parallel labeled relationships; permissions use two parallel inputs to one result; UNC decomposes a path; SMB uses client/server exchange lanes with a server-local authorization check; SMB/Samba/NAS separates protocol/implementation/device; the document example distinguishes file observation, event consumption and completion notification. No FTP commands from the style reference were inserted.

Version decision: **2.0.1 → 2.0.2**, internal revision **9 → 10**. This is a patch because it refines existing explanatory relationships and accessibility presentation without changing conceptual conclusions or adding teaching scope. Both language versions receive the same visual refinement.

Direct JSON comparison with the preceding commit confirms all lesson content except version/revision is unchanged, and `m0401-visuals.json` is byte-unchanged. All sixteen SVGs preserve every original title/caption/item. GX10 Brave checks at 320/390/1280 show all eight expanded diagrams without page or card overflow in both languages. Keyboard Enter expands/collapses the native disclosures. Permission comparisons stack on mobile and share a single result connector; they never become a sequential grant chain.

Validation uses Node 24.22.0. Content validation, tests, Svelte check (zero errors/warnings), unpublished-content boundary, static release links/anchors/language pairs and original MATLAB checksum checks passed. npm audit has three pre-existing low-severity findings and no high/critical findings. No live DNS/AXFR test was performed.

GX10 Brave is the browser used for local UI validation, not the parent's cloud browser. The parent inspected the original reference PNG pixels and supplied verified design specifications; the PNG files were not transferred to GX10. HTML text reflows at small widths; the standalone SVG is a scalable fixed-layout export, not responsive reflow. Each export contains accessible title/description and real SVG text. All image files are strictly below 100,000 bytes.

Previous production: `3d7993f37b5aa8d40abdaf4f2fa0945d7ab86d77`, successful [Pages run 40166890996](https://github.com/JasonLn0711/kairos-learning/actions/runs/40166890996). Publication must use a draft-first reviewed PR, successful quality checks, merge, successful Pages workflow, and production readback. Final deployment identity is recorded in the completion receipt after it exists.

| SVG | Bytes |
| --- | ---: |
| [m04-01-questions-zh.svg](https://learn.cs-kairos.com/images/ceh/m04-01-questions-zh.svg) | 1845 |
| [m04-01-questions-en.svg](https://learn.cs-kairos.com/images/ceh/m04-01-questions-en.svg) | 2001 |
| [m04-01-entry-evidence-zh.svg](https://learn.cs-kairos.com/images/ceh/m04-01-entry-evidence-zh.svg) | 1787 |
| [m04-01-entry-evidence-en.svg](https://learn.cs-kairos.com/images/ceh/m04-01-entry-evidence-en.svg) | 1901 |
| [m04-01-permissions-zh.svg](https://learn.cs-kairos.com/images/ceh/m04-01-permissions-zh.svg) | 1573 |
| [m04-01-permissions-en.svg](https://learn.cs-kairos.com/images/ceh/m04-01-permissions-en.svg) | 1803 |
| [m04-01-protocols-zh.svg](https://learn.cs-kairos.com/images/ceh/m04-01-protocols-zh.svg) | 1879 |
| [m04-01-protocols-en.svg](https://learn.cs-kairos.com/images/ceh/m04-01-protocols-en.svg) | 2040 |
| [m04-01-unc-zh.svg](https://learn.cs-kairos.com/images/ceh/m04-01-unc-zh.svg) | 1211 |
| [m04-01-unc-en.svg](https://learn.cs-kairos.com/images/ceh/m04-01-unc-en.svg) | 1200 |
| [m04-01-smb-process-zh.svg](https://learn.cs-kairos.com/images/ceh/m04-01-smb-process-zh.svg) | 2795 |
| [m04-01-smb-process-en.svg](https://learn.cs-kairos.com/images/ceh/m04-01-smb-process-en.svg) | 2915 |
| [m04-01-roles-zh.svg](https://learn.cs-kairos.com/images/ceh/m04-01-roles-zh.svg) | 1544 |
| [m04-01-roles-en.svg](https://learn.cs-kairos.com/images/ceh/m04-01-roles-en.svg) | 1777 |
| [m04-01-document-flow-zh.svg](https://learn.cs-kairos.com/images/ceh/m04-01-document-flow-zh.svg) | 2042 |
| [m04-01-document-flow-en.svg](https://learn.cs-kairos.com/images/ceh/m04-01-document-flow-en.svg) | 2201 |
