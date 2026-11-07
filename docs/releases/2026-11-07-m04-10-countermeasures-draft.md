# M04-10 enumeration countermeasures — draft acceptance record

Prepared from fresh main `bb445be` on 2026-11-07. C09 was already published by PR #84. This work adds C10 as a **draft**, not as a published lesson, and does not revise C09 or the M05 identity scheme.

## Scope and source fidelity

[Complete source/adaptation record](../sources/m04-10/README.md) includes two full manuscripts and a 76-paragraph ledger. Each language generates 76 sourceBody blocks: ten sections, six service subsections, the complete directory-policy case, the original tabletop check and one native reference answer. The case retains separate network, identity, object/operation and transport evidence. The exercise requires no real target or configuration changes. `qa=[]`; reference-answer reading is not learner completion.

WRITE-01–05 and WRITE-08–10 are covered by paragraph-level adoption, paired technical conditions and near-claim primary sources. WRITE-06 uses initial content version 1.0.0, revision 1, content revision date 2026-11-07. The draft `publishedOn` is a proposed release date, not a claim of first publication; confirm the actual first publication date before release. WRITE-07 retains the existing public attribution. No figures, executable examples, renderer, dependencies, security permissions or deployment workflow are changed (FIG/INT changes not applicable).

The [exact teaching original](https://github.com/JasonLn0711/ceh-cehp-certification-notes-2026/blob/a3524afa46cef2824a1cd3999982b630006dc2ca/source/2026-11-07-m04-10/teaching.zh-TW.md) is preserved in the CEH source archive. Private delivery metadata and learner records remain outside public Git; public files contain no private message identifiers, learner responses or private delivery timestamps. The source hash records preservation independently from website adoption.

## Acceptance scope

Static source-to-HTML checks and browser acceptance are separate. `scripts/verify-m0410-preview.py` temporarily builds a local published fixture, checks every body text unit in order in both languages, checks ten section anchors and the closed reference answer, saves local evidence, and restores the draft in a `finally` block. It neither starts a browser nor deploys. Run the publication-boundary check afterward to recreate clean draft-gated build output.

Browser acceptance for this exact C10 artifact is **pending and unexecuted**: 320/390/768/1280 widths, computed text size, 200% text, keyboard/focus, no-JavaScript reading, search/navigation and native answer operation have not been measured. Prior local Chromium launch was denied before opening a page. No browser launch, browser download, executor switch, security-setting change or previously denied formal-site GET was retried. C09 evidence is not reused as C10 evidence.

HTML-01/A11Y-01/A11Y-03 receive only static semantic/text evidence here. HTML-02–04 and A11Y-02 remain pending browser checks; static tests do not establish visual layout or keyboard behavior. No full accessibility certification or real-device protection result is claimed.

No merge, individual PR approval, auto-merge or deployment is performed. Before release: complete exact-artifact browser acceptance and independent review, confirm the actual first-publication date, change the draft only through the normal reviewed path, rerun checks, record the current successful Pages baseline, and verify the deployed commit and both live pages. The public route remains unavailable until that gate is satisfied.

## Check results

Results are appended after the final checks. Tool installation first found an unavailable default npm cache; a workspace-safe temporary cache is used instead. This does not change package versions or system settings.

Independent content review on 2026-11-07 found no blocking omission or technical issue: all ten sections, six protocol subsections, eighteen citation occurrences and their URL order correspond; named identifiers have matching occurrences; all 76 bilingual JSON blocks match the respective manuscripts after formatting and reference-answer handling. The English reference answer preserves the same evidence limits. Public exercise/answer-wrapper adaptations were reviewed. This is content review, not a GitHub Approve review or browser acceptance.

Final local checks on 2026-11-07:

- `npm ci --cache /tmp/kairos-c10-npm-cache`: passed with the committed lockfile; no dependency changes.
- `python3 scripts/m04_10_content.py --check`: passed, 76 paired blocks.
- Original SHA-256 and 76-paragraph adoption check: passed; semantic heading normalization plus the two declared public adaptations only.
- `npm run validate:content`: passed.
- `npm test`: 250/250 passed, including paired full source hashes, ledger/manuscript equality, citation URL order, navigation fixture and draft/future exclusion.
- `npm run check`: zero errors and zero warnings.
- `python3 scripts/verify-m0410-preview.py`: passed, both languages 76 blocks / 88 text units in order; ten anchors and one closed native answer. Local static HTML evidence is separate from browser acceptance.
- `node scripts/check-publication-boundary.mjs`: passed, including the second-concept fixture, draft/future text exclusion, English course gates and clean production rebuild.
- `npm run validate:release`: passed, including links, anchors, CSP, language pairs, static assets and preserved course/package checks.
- `npm audit --audit-level=high`: passed; five inherited low-severity findings, no high/critical findings. No forced upgrades.
- Six existing MATLAB/download SHA-256 checks: passed.
- `git diff --check`: passed.

Browser checks and production readback remain unexecuted as described above. PR creation is also unattempted pending confirmation for this specific draft PR; a branch push does not constitute PR review, publication or learner understanding.
