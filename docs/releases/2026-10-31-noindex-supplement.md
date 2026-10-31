# M02-03 noindex teaching supplement

## Scope

- Expand M02-03 section 5 in Traditional Chinese and English with HTML meta and HTTP header examples, crawl → rule → index flow, Search Console checks, and a private-PDF scenario with a closed reference answer.
- Add one paired SVG flow and searchable text equivalents. Existing four diagrams and the original eight-file download ZIP remain unchanged; the new paired flow is available through its own SVG download links.
- Connect M01-06 security controls, M13 web server hardening and M14 object authorization back to the detailed M02-03 section. Preserve other teaching and stable URLs.
- This is a revision of an existing topic. Curriculum IDs and the 161-unit route remain unchanged.
- All examples are synthetic. Code examples are escaped article text. Website indexing, robots.txt, authentication, authorization and hosting settings retain their existing configuration.

## Source review (2026-10-31)

- [Google Search stages](https://developers.google.com/search/docs/fundamentals/how-search-works)
- [Google noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing)
- [Google robots.txt](https://developers.google.com/search/docs/crawling-indexing/robots/intro)
- [Search Console temporary removals](https://support.google.com/webmasters/answer/9689846): about six months; pair with the appropriate long-term content/indexing/access decision.
- [OWASP authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html): resource and action checks for every request, including static resources.

## Editorial continuity

Integrates the latest Chinese editorial source and two independent web captions from main `494a52e`, preserving those supplied revisions alongside the noindex expansion.

## Validation record

- Passed 62 tests, bilingual content validation, and Svelte/TypeScript checking (0 errors, 0 warnings).
- Publication-boundary checks passed across 500 text artifacts; clean release validation passed for 246 HTML pages and 208 preserved static assets.
- Verified full source order, escaped code examples, five inline SVGs per language, two reference answers closed by default, search text, unchanged original SVG ZIP and MATLAB checksums.
- The paired new SVGs were rendered and visually inspected at 600 × 640; labels fit within their cards. CSS retains the existing proportional-width and body-size cap. Browser/mobile and live-site checks remain separate.
- Publication proceeds through the existing draft PR, review and Pages workflow. Deployment and live-content verification are separate release evidence.
