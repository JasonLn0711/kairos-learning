# M03-05 source-preserving edition

Current edition: **1.1.0**, revision **2**, revised **2026-11-03 (Asia/Taipei)**. Original publication date remains 2026-11-03. Added localhost practice and expanded teaching scope warrant a minor version. Deployment and live readback are recorded separately in the [release receipt](../../releases/2026-11-03-m03-05-replacement.md).

## Source and adoption

The supplied [complete original](supplied-2026-11-03/teaching-original.txt) is preserved byte-for-byte with source.sha256.json. The previous paired teaching/answer documents, content JSON, models, four source SVGs, README and asset evidence are in archive-v1.0.0. The original four reference answers and two bilingual semantic diagrams are unchanged. Ten diagram/model/ZIP files have recorded SHA-256 checksums in supplied-2026-11-03/preserved-assets.sha256.json.

The Chinese manuscript is reconstructed from the original with only the exact changes in [detailed-editorial-changes.json](detailed-editorial-changes.json). The [63-heading bilingual map](detailed-section-map.json) includes all subsections and scenario branches, not merely chapter titles. Both languages contain nine tables and 87 code/output/ASCII blocks. The English counterpart retains each explanation, analogy, condition, example and exercise; prose paragraph lengths differ naturally. The four scenario questions retain stable reference-answer anchors; qa remains empty and no learner progress is claimed.

Corrections remove personalized deployment assumptions, distinguish TCP application data from SYN-only evidence, scope the version-detection flow to TCP, distinguish configuration reload from replacing running code, mark an option fragment as non-executable, update the reference-answer wording, and add an isolated practice directory, port-conflict handling and cleanup verification. Raw source wording remains preserved. The synthetic CVE, package versions and scan output are illustrations, not verified vulnerabilities or claims about latest releases.

## Technical review

- [Nmap service/version detection](https://nmap.org/book/man-version-detection.html): conventional port names, -sV, default TCP 9100 exclusion and probe impact.
- [Nmap technique](https://nmap.org/book/vscan-technique.html): TCP NULL probe, response matching and softmatch restrictions; UDP is a separate path.
- [RFC 9110 §10.2.4](https://www.rfc-editor.org/rfc/rfc9110.html#section-10.2.4): optional Server identification and disclosure limits.
- [Nginx server_tokens](https://nginx.org/en/docs/http/ngx_http_core_module.html#server_tokens): version emission in Server fields and error responses; disabling it is not patching.
- [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/): layered edge/origin architecture. The teaching topology is hypothetical.
- [Ubuntu security updates](https://documentation.ubuntu.com/security/security-updates/) and [Ubuntu notices](https://ubuntu.com/security/notices): backported updates and distribution-specific security evidence.
- [Red Hat backport explanation](https://access.redhat.com/solutions/57665): a fix can be applied to an older maintained package. The original backport-policy URL remains in the supplied manuscript; direct retrieval of that URL failed during this review, so the official explanation and Ubuntu documentation were used to corroborate the concept.

Review date: 2026-11-03. These references are documentation, not installed-version evidence. The local HTTP practice actually ran with Python 3.12.3 and Nmap 7.94SVN; exact observations and scope limits are in the release receipt. Nginx configuration changes, package updates, Cloudflare deployment and external-target scans were not executed.

## Reproduction and acceptance

```sh
python3 scripts/m0305_content.py
python3 scripts/m0305_content.py --check
python3 scripts/m0305_diagrams.py --check
npm run validate:content
npm test
npm run check
node scripts/check-publication-boundary.mjs
npm run validate:release
npx playwright test --config playwright.m0305.config.ts
```

Set CEH_BASE_URL=https://learn.cs-kairos.com for production browser readback. Keep local evidence separately before the live run. Tests verify full source order, every mapped heading, complete code blocks, paired table structure, preserved answers/assets and source reconstruction; counts alone do not establish teaching completeness. Browser checks verify four widths, text enlargement, keyboard, no JavaScript and standalone SVG/downloads.

Existing diagram-models.json continues to supply semantic HTML and deterministic standalone SVGs through the fail-closed serializer. No new renderer, framework or SVG trust exception is introduced. The only shared rendering edit enables the existing keyboard-scrollable code branch for M03-05. The M03-02 historical hash test excludes that exact added condition while retaining its original checksum contract.
