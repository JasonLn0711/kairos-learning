# CEH26-M04-C03 — FTP / SMTP evidence review

Editorial date: 2026-11-04 (Asia/Taipei). New M04 unit C03 combines FTP and SMTP; public slug is `m04-03`. This is an original synthetic lesson, not an official exam question or a record of executed network activity. The historical separate FTP/SMTP units remain historical and are not republished by this change.

## Scope and principle

Beginner readers learn to distinguish endpoint responses, disclosed metadata, authentication, operation-specific authorization and independently granted testing permission. The eleven sections cover FTP control/data channels, active/passive modes, FEAT and MLSD, anonymous access policy, an original abbreviated transcript, FTPS versus SFTP, SMTP submission/relay roles, EHLO/AUTH/VRFY/EXPN responses, STARTTLS, defensive verification and one check. The exercise is offline evidence classification; no target is contacted and no credential or user datum is used.

## Primary sources actually reviewed

All checked 2026-11-04. These are protocol foundations, not claims about an installed product version or a newest release.

| Source | Publication | Adopted scope |
|---|---|---|
| https://www.rfc-editor.org/rfc/rfc959.html | October 1985 | FTP control/data, command-specific responses; later extensions handled separately. |
| https://www.rfc-editor.org/rfc/rfc2428.html | September 1998 | Active/passive extended data negotiation, EPSV and NAT context. |
| https://www.rfc-editor.org/rfc/rfc2389.html | August 1998 | FEAT capability negotiation. |
| https://www.rfc-editor.org/rfc/rfc3659.html | March 2007 | MLST/MLSD structured metadata and directory listing. |
| https://www.rfc-editor.org/rfc/rfc2577.html | May 1999 | FTP cleartext and anonymous-access security considerations. Informational, not a new implementation test. |
| https://www.rfc-editor.org/rfc/rfc4217.html | October 2005 | Distinct TLS protection for FTP control and data channels, PROT P. No obsolete TLS algorithm recommendation is adopted. |
| https://man.openbsd.org/sftp.1 | Rolling OpenSSH manual, accessed date above | SFTP runs over SSH, distinct from FTPS. No installed version inferred. |
| https://www.rfc-editor.org/rfc/rfc6409.html | November 2011 | SMTP relay versus submission, TCP25/587. |
| https://www.rfc-editor.org/rfc/rfc8314.html | January 2018 | TLS for submission, TCP465 implicit TLS; port is not proof of negotiated protection. |
| https://www.rfc-editor.org/rfc/rfc4954.html | July 2007 | SMTP AUTH and capability visibility. |
| https://www.rfc-editor.org/rfc/rfc5321.html | October 2008 | SMTP EHLO, VRFY/EXPN, 252/550 and command-relative meaning; no user-existence inference. |
| https://www.rfc-editor.org/rfc/rfc3463.html | January 2003 | Enhanced status classification; retain implementation/context. |
| https://www.rfc-editor.org/rfc/rfc3207.html | February 2002 | STARTTLS resets SMTP knowledge; new EHLO and hop scope. |

## Editorial decisions

- The FTP example explicitly omits authentication and data setup; 230 cannot be used to infer anonymous login. MLSD metadata and RETR failure are distinct operations.
- The SMTP example is synthesized; 252 is unverified, not absent. EHLO capabilities do not prove TLS, AUTH, delivery or open relay.
- All permissions are parallel dimensions, not an automatic sequential escalation path. Diagram layout must preserve this distinction.
- One reference answer is an editorial answer, not an actual learner response. No personal Q&A is added.
- Grammar and standard protocol tokens are kept; no copied exam banks, private systems or real staff names.

## Website review contract

Read current main AGENTS.md, docs/article-standards.md, docs/content-authoring.md, docs/article-writing-template.md, docs/diagram-design-system.md, docs/publishing-security.md and docs/perspectives/authoring.md before drafting. Apply WRITE-01–07, HTML-01–04, FIG-01–06 and A11Y-01–03. INT-01 interactive computation is not applicable. Follow the current ten-ID M04 migration and common short-slug resolver; do not restore legacy public teaching.

Preserve complete paired source text, native visible body and diagrams, with only the reference answer collapsed. Publish only after content/type/tests/boundary/static gates. Record actual browser URL/language/dimensions, production version and exact deployment source separately; unexecuted checks remain pending. This review alone does not assert publication or complete accessibility acceptance.
