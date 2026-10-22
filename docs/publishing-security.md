# Static release, security and recovery

The release path is PR → review → static preview → production. User authorization for this implementation includes publication; the technical checks below establish what is being published. Existing Git and deployment history remains available for recovery.

## Release checks

Use Node.js 24 and `npm ci`. Run the commands in the [README](../README.md). Both PR and production workflows validate content, tests, types, audit at high severity, the actual unpublished-content boundary, legacy MATLAB and the static output. Download checks run against the existing `SHA256SUMS` and cover six ZIP files. The PR workflow uploads the complete `build/` artifact for a local static preview; production uploads it to Pages only after checks pass.

`validate_release.py` checks local destinations and anchors, duplicate IDs, language pairs, canonical, hashed CSP, static-asset byte equality and selected credential patterns. This targeted scan is useful evidence, not a claim of exhaustive secret detection. No `.env`, source map or `.git` files belong in the deployment.

SvelteKit adds a hash-based CSP meta tag to generated pages. GitHub Pages does not honor Cloudflare Workers `_headers`; do not claim response headers from a file it ignores. Legacy MATLAB remains unchanged and does not acquire the new page CSP. Cloudflare's existing TLS/proxy configuration remains in place. There are no API bindings, stored server credentials, account sessions or third-party analytics in the new application. npm audit currently reports three low-severity entries inherited through Kit 2's cookie dependency; no high/critical entries remain. A major framework upgrade is a separate compatibility change.

Before merge, record the previous successful Pages run and commit. Check both language versions, navigation, search, wrong-answer → correction → refreshed-empty review, keyboard controls, the smallest supported width, long code blocks, and MATLAB return links. Browser test answers are test evidence only. Lighthouse laboratory scores and scoped accessibility checks do not establish field Core Web Vitals or a complete WCAG certification.

After merge, confirm the Pages workflow succeeds, inspect the public root and deep lessons over HTTPS, verify a missing path returns 404, and compare published ZIP hashes. Record the deployed commit and URL in the [release receipt](releases/2026-10-23-phase-0-3.md).

## Recovery procedure

1. Identify the last successful production workflow and its exact source commit before changing anything.
2. If its artifact remains available, use the existing deployment workflow's rerun operation for that commit. Alternatively prepare a new revert commit or PR restoring the affected source while preserving both histories. Never reset/force-push main.
3. Verify the restored root, a deep lesson, MATLAB, downloads and 404. Then restore the intended known-good release using its workflow or a new forward fix.
4. Record actual rollback and restoration results. A documented command or an unexecuted workflow is not a completed drill.

The pre-migration baseline is `69c24f847425486529424dfa858e0b53dddd1c03`, which deployed the original `site/` tree. It remains in Git history and can reconstruct MATLAB. The current workflow deploys `build/`; restoring a historical source also requires its matching workflow/configuration. Learning DNS remains the existing proxied GitHub Pages CNAME, independent of the main-site Worker. Do not edit API, console or other applications to recover a course release.

An incident correction should state the affected content/version, evidence, correction and next validation. Capacity, learner scores and exam readiness remain in their subject/Planning records. This release adds no recurring daily-publication obligation.
